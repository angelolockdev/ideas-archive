import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const sourceDirectory = join(projectRoot, 'data')
const publicDirectory = join(projectRoot, 'public', 'data')

await rm(publicDirectory, { recursive: true, force: true })
await mkdir(publicDirectory, { recursive: true })
await cp(sourceDirectory, publicDirectory, { recursive: true })

const months = (await readdir(sourceDirectory))
  .filter(fileName => /^\d{4}-\d{2}\.json$/.test(fileName))
  .map(fileName => fileName.replace(/\.json$/, ''))
  .sort()
  .reverse()

await writeFile(
  join(publicDirectory, 'index.json'),
  `${JSON.stringify({ months }, null, 2)}\n`,
  'utf8',
)
