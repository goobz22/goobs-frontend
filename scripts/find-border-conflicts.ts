import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

function walk(dir: string): string[] {
  const results: string[] = []
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist') continue
    const full = join(dir, entry)
    const s = statSync(full)
    if (s.isDirectory()) results.push(...walk(full))
    else if (['.ts', '.tsx', '.js', '.jsx'].includes(extname(full)))
      results.push(full)
  }
  return results
}

const conflicts: Array<{
  file: string
  borderLine: number
  conflictLine: number
  border: string
  conflict: string
}> = []

for (const file of walk('src')) {
  const content = readFileSync(file, 'utf-8')
  const lines = content.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    // Match border shorthand: border: 'none', border: '1px solid ...', border: `...`
    if (
      line.match(/^border:\s*'/) ||
      line.match(/^border:\s*`/) ||
      line.match(/^border:\s*"/)
    ) {
      // Check nearby lines for non-shorthand border properties
      for (
        let j = Math.max(0, i - 8);
        j < Math.min(lines.length, i + 8);
        j++
      ) {
        if (j === i) continue
        const nearby = lines[j].trim()
        if (nearby.match(/^border(Bottom|Top|Left|Right):/)) {
          // Make sure they're in the same object (no closing brace between them)
          const start = Math.min(i, j)
          const end = Math.max(i, j)
          const between = lines.slice(start, end + 1).join('\n')
          // Check for } that would indicate a different object
          const braceCount = (between.match(/\}/g) || []).length
          if (braceCount === 0) {
            conflicts.push({
              file: file.replace(/\\/g, '/'),
              borderLine: i + 1,
              conflictLine: j + 1,
              border: line,
              conflict: nearby,
            })
          }
        }
      }
    }
  }
}

for (const c of conflicts) {
  console.log(
    `${c.file}:${c.borderLine} "${c.border}" conflicts with :${c.conflictLine} "${c.conflict}"`
  )
}
console.log(`\nTotal conflicts: ${conflicts.length}`)
