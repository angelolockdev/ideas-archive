---
version: alpha
name: Ideas-Archive
description: A dark-first analytical archive for app ideas. The system anchors on a deep navy canvas (#0b0f1a) with an indigo-blue accent (#60a5fa), surfaced cards (#1a1f2e), and warm-orange highlights (#f59e0b) for starred/coup-de-coeur items. Light mode inverts to a clean white-canvas (#faf9f7) system with slate text and the same indigo accent. Typography uses Inter for everything — clean, technical, fast-reading.

colors:
  # Dark mode
  dark-canvas: "#0b0f1a"
  dark-bg: "#111827"
  dark-card: "#1a1f2e"
  dark-card-hover: "#1f2537"
  dark-border: "#2a3040"
  dark-border-light: "#374151"
  dark-text: "#f0f2f5"
  dark-text-2: "#9ca3af"
  dark-text-3: "#6b7280"

  # Light mode
  light-canvas: "#faf9f7"
  light-bg: "#f3f4f6"
  light-card: "#ffffff"
  light-card-hover: "#f9fafb"
  light-border: "#e5e7eb"
  light-border-light: "#d1d5db"
  light-text: "#111827"
  light-text-2: "#4b5563"
  light-text-3: "#9ca3af"

  # Accent
  accent: "#60a5fa"
  accent-glow: "rgba(96,165,250,.12)"
  accent-hover: "#3b82f6"
  green: "#34d399"
  green-glow: "rgba(52,211,153,.12)"
  orange: "#f59e0b"
  orange-glow: "rgba(245,158,11,.12)"
  purple: "#a78bfa"
  purple-glow: "rgba(167,139,250,.12)"
  teal: "#2dd4bf"
  red: "#ef4444"
  pink: "#f472b6"

typography:
  display-lg:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 36px
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.5px"
  display-md:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 28px
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.3px"
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.2px"
  card-title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0
  subhead:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  stats:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 24px
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.5px"
  button:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0
  badge:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

components:
  nav-bar:
    backgroundColor: "rgba(11,15,26,0.85)"
    textColor: "{colors.dark-text-2}"
    typography: "{typography.subhead}"
    height: 56px
  card:
    backgroundColor: "{colors.dark-card}"
    textColor: "{colors.dark-text}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.dark-border}"
    padding: 20px
  card-hover:
    backgroundColor: "{colors.dark-card-hover}"
    borderColor: "{colors.accent}"
  card-light:
    backgroundColor: "{colors.light-card}"
    textColor: "{colors.light-text}"
    border: "1px solid {colors.light-border}"
  button-star:
    backgroundColor: transparent
    textColor: "{colors.dark-text-3}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.dark-border}"
    size: 32px
  button-star-light:
    backgroundColor: transparent
    textColor: "{colors.light-text-3}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.light-border}"
  star-active:
    backgroundColor: "{colors.orange-glow}"
    textColor: "{colors.orange}"
    border: "1px solid {colors.orange}"
  filter-bar:
    backgroundColor: "{colors.dark-card}"
    border: "1px solid {colors.dark-border}"
    rounded: "{rounded.lg}"
    padding: 16px 20px
  stat-card:
    backgroundColor: "{colors.dark-card}"
    border: "1px solid {colors.dark-border}"
    rounded: "{rounded.sm}"
    padding: 14px 18px
  theme-toggle:
    backgroundColor: "{colors.dark-card}"
    border: "1px solid {colors.dark-border}"
    rounded: "{rounded.md}"
    size: 36px
---
