#!/usr/bin/env python3
"""
ideas-archive Updater Script
=============================
Parse new ideas from Slack channel messages and update monthly JSON.
Run via Hermes cron job once per week (Monday 10:00).

Usage:
  python archive-ideas.py [--fetch|--help]

Environment:
  GITHUB_TOKEN - GitHub personal access token (for push)
  SLACK_TOKEN  - Slack bot token (falls back to .hermes/.env)
  IDEAS_REPO   - Path to local git clone (default: ~/projects/ideas-archive)
"""

import json, re, os, sys, subprocess
from datetime import datetime, timezone, timedelta
from pathlib import Path

REPO_DIR = os.path.expanduser(os.environ.get('IDEAS_REPO', '~/projects/ideas-archive'))
DATA_DIR = os.path.join(REPO_DIR, 'data')
CHANNEL_ID = 'C0BE3JG2BT8'

def clean(s):
    if not s: return ""
    s = re.sub(r'\*+', '', s)
    return s.replace('\n', ' ').strip()

def infer_category(idea):
    t = (idea.get('title','') + ' ' + idea.get('description','') + ' ' + (idea.get('theme','') or '')).lower()
    cats = {
        'productivity': ['productivite','productivity','routine','habitude','organisation','focus'],
        'ai': ['intelligence','gpt','llm','machine learning','deep','neural','tensorflow'],
        'fintech': ['finance','paiement','banque','money','mvola','revenue','budget','depense'],
        'health': ['sante','health','medical','bien-etre','stress','anxiete','calm','mindfulness','mental'],
        'transport': ['transport','logistique','colis','livraison','taxi','voiture','trajet','chauffeur'],
        'climate': ['climat','environnement','recyclage','cyclone','alerte','recyclable'],
        'social': ['reseau','social','communaute','matching','emploi','micro','skill','echange'],
        'edtech': ['education','cours','apprentissage','formation','pedagogique'],
        'devtools': ['cli','dev','code','env','secret','debug','developpeur'],
        'iot': ['iot','capteur','esp32','hardware','potager','jardin'],
    }
    for cat, keywords in cats.items():
        for kw in keywords:
            if kw in t: return cat
    return 'other'

def load_monthly(month_str):
    path = os.path.join(DATA_DIR, f'{month_str}.json')
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"month": month_str, "updated_at": "", "ideas": []}

def save_monthly(data):
    path = os.path.join(DATA_DIR, f"{data['month']}.json")
    data['updated_at'] = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    return path

def generate_id(date_str, title):
    slug = re.sub(r'[^a-z0-9-]', '', title.lower()[:30].replace(' ', '-'))
    return f"{date_str.replace('-','')}-{slug}"

def extract_ideas_a(text, date_str):
    """Parse 'Idees d'application du matin' format"""
    ideas = []
    blocks = re.split(r'\n---\n', text)
    for block in blocks:
        name = None
        m = re.search(r'\*:bulb:\s*Nom\s*:\s*\*?([^*\n]+?)\*?\s*$', block, re.MULTILINE)
        if m:
            name = m.group(1).strip()
        else:
            m = re.search(r':bulb:\s*\*?(\d+)\.\s+([^*\n]+?)\*?', block)
            if m:
                name = m.group(2).strip()
            else:
                m = re.search(r':bulb:\s+\*([^*]+?)\*', block)
                if m and 'Nom' not in m.group(1):
                    name = m.group(1).strip()
        if not name or len(name) > 40: continue

        desc = _ext(block, r':memo:\s+.*?Description\s*:\*?\s*(.*?)(?:\n\*?:dart:|\n---|\Z)')
        problem = _ext(block, r':dart:\s+.*?Probleme\s*(?:resolu)?\s*:\*?\s*(.*?)(?:\n\*?:bar_chart:|\n---|\Z)')
        market = _ext(block, r':bar_chart:\s+.*?Marche\s*(?:cible)?\s*:\*?\s*(.*?)(?:\n\*?:moneybag:|\n---|\Z)')
        revenue = _ext(block, r':moneybag:\s+.*?revenus?\s*(?:potentiel)?\s*:\*?\s*(.*?)(?:\n\*?:hammer_and_wrench:|\n---|\Z)')
        stack = _ext(block, r':hammer_and_wrench:\s+.*?Stack\s*(?:technique|sugeree)?\s*:\*?\s*(.*?)(?:\n\*?:chart_with_upwards_trend:|\n---|\Z)')
        diff_m = re.search(r':chart_with_upwards_trend:\s+.*?Difficulte\s*(?:de lancement)?\s*:\*?\s*(\d+)\s*(?:/\d+)?', block)
        difficulty = int(diff_m.group(1)) if diff_m else None

        idea = {
            "id": generate_id(date_str, name),
            "title": clean(name),
            "description": clean(desc),
            "problem": clean(problem),
            "market": clean(market or ""),
            "revenue": clean(revenue or ""),
            "stack": clean(stack or ""),
            "difficulty": difficulty,
            "source": "idees-matin",
            "region": "global",
            "date": date_str,
            "status": "pending",
            "category": "other",
        }
        idea['category'] = infer_category(idea)
        if idea.get('title'):
            ideas.append(idea)
    return ideas

def extract_ideas_b(text, date_str):
    """Parse 'Idees Matinales Self-Improving' format (Madagascar focus)"""
    ideas = []
    blocks = re.split(r'\n---\n', text)
    for block in blocks:
        m = re.search(r'\*(\d+)\.\s+([^*\n]+?)\*', block)
        if not m: continue
        name = m.group(2).strip()

        theme_m = re.search(r'\*Theme\*\s*:\s*([^*\n|]+)', block)
        theme = theme_m.group(1).strip() if theme_m else None
        kw_m = re.search(r'\*Mot-cle.*?\*?\s*:\s*"([^"]+)"', block)
        keyword = kw_m.group(1) if kw_m else None

        problem = _ext(block, r':dart:\s+\*Probleme\*\s*:\s*(.*?)(?:\n:bulb:|\n---|\Z)')
        solution = _ext(block, r':bulb:\s+\*Solution\*\s*:\s*(.*?)(?:\n:iphone:|\n---|\Z)')
        stack = _ext(block, r':iphone:\s+\*Stack\*\s*:\s*(.*?)(?:\n:moneybag:|\n---|\Z)')
        monetization = _ext(block, r':moneybag:\s+\*Monetisation\*\s*:\s*(.*?)(?:\n:earth_africa:|\n---|\Z)')
        why_now = _ext(block, r':earth_africa:\s+\*Pourquoi maintenant\*\s*:\s*(.*?)(?:\n:zap:|\n---|\Z)')
        mvp_m = re.search(r':zap:\s+\*MVP.*?\*\s*:\s*(.*?)(?:\n---|\Z)', block, re.DOTALL)
        mvp = clean(mvp_m.group(1)) if mvp_m else ""

        idea = {
            "id": generate_id(date_str, name),
            "title": clean(name),
            "description": clean(solution),
            "problem": clean(problem),
            "market": None,
            "revenue": clean(monetization),
            "stack": clean(stack),
            "difficulty": None,
            "source": "self-improving",
            "region": "madagascar",
            "theme": clean(theme) if theme else None,
            "keyword": keyword,
            "why_now": clean(why_now),
            "mvp_plan": mvp,
            "date": date_str,
            "status": "pending",
            "category": "other",
        }
        idea['category'] = infer_category(idea)
        if idea.get('title'):
            ideas.append(idea)
    return ideas

def _ext(text, pattern):
    m = re.search(pattern, text)
    if m:
        val = m.group(1).strip()
        val = re.sub(r'\n:?\w+:\s*\*?.*', '', val).strip()
        return val
    return ""

def update_monthly(new_ideas, month_str):
    """Merge new ideas into monthly file, avoiding duplicates by ID"""
    data = load_monthly(month_str)
    existing_ids = {i['id'] for i in data['ideas']}
    added = 0
    for idea in new_ideas:
        if idea['id'] not in existing_ids:
            data['ideas'].append(idea)
            existing_ids.add(idea['id'])
            added += 1
    if added:
        save_monthly(data)
    return added

def git_commit_and_push(msg):
    """Commit and push changes to GitHub"""
    try:
        subprocess.run(['git', '-C', REPO_DIR, 'add', '-A'], check=True, capture_output=True)
        subprocess.run(['git', '-C', REPO_DIR, 'commit', '-m', msg, '--allow-empty'], check=True, capture_output=True)
        subprocess.run(['git', '-C', REPO_DIR, 'push'], check=True, capture_output=True)
        return True
    except subprocess.CalledProcessError as e:
        if 'nothing to commit' in e.stderr.decode():
            return True  # No changes
        print(f"Git error: {e.stderr.decode()}")
        return False

if __name__ == '__main__':
    print("ideas-archive updater — to be run via Hermes cron with Slack + GitHub access")
    print("This script requires specific tools that are environment-dependent.")
    sys.exit(0)
