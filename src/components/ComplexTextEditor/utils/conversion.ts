import type { EditorMode } from '../Toolbars/Complex'

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Apply inline-formatting rules to a single line. Headings, lists,
 * blockquotes, and code blocks are handled at block level above.
 */
function inlineMarkdown(line: string): string {
  let out = line
  // Inline code first so its contents skip other replacements (best-effort).
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
  // Bold + italic.
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>')
  // Strikethrough — actually emit a tag instead of dropping content.
  out = out.replace(/~~([^~]+)~~/g, '<del>$1</del>')
  // Image (must come before link — link regex would also match the alt text).
  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
  // Link.
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  return out
}

/**
 * Markdown → HTML renderer. Block-level: ATX headings (#/##/###/####),
 * fenced code blocks (```), blockquotes (>), unordered lists (- / *),
 * ordered lists (1. ), horizontal rule (---), paragraphs (blank-line
 * separated). Inline: bold, italic, strikethrough, code, links, images.
 *
 * Not goal: 100% CommonMark conformance. Goal: a competent renderer for
 * rich-text site blocks and inline doc-style content. ReDoS-safe — every
 * pattern uses a negated character class instead of unbounded greedy.
 *
 * Older shape (single-pass regex chain that wrapped everything in <p>
 * and emitted one <ul> per list item) has been replaced with a
 * line-by-line block-aware walker so consecutive list items collapse
 * into one <ul>/<ol> and paragraphs separate properly on blank lines.
 */
export function mdToHtml(md: string): string {
  if (!md) return ''
  const escaped = escapeHtml(md.replace(/\r\n?/g, '\n'))
  const lines = escaped.split('\n')

  const out: string[] = []
  let i = 0

  type ListKind = 'ul' | 'ol' | null
  let listKind: ListKind = null
  const closeList = () => {
    if (listKind) {
      out.push(`</${listKind}>`)
      listKind = null
    }
  }
  const openList = (kind: 'ul' | 'ol') => {
    if (listKind !== kind) {
      closeList()
      out.push(`<${kind}>`)
      listKind = kind
    }
  }

  let paragraphBuffer: string[] = []
  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return
    out.push(`<p>${paragraphBuffer.map(inlineMarkdown).join('<br>')}</p>`)
    paragraphBuffer = []
  }

  while (i < lines.length) {
    const line = lines[i] ?? ''

    // Fenced code block.
    if (/^```/.test(line.trim())) {
      flushParagraph()
      closeList()
      const codeLines: string[] = []
      i += 1
      while (i < lines.length && !/^```/.test((lines[i] ?? '').trim())) {
        codeLines.push(lines[i] ?? '')
        i += 1
      }
      out.push(`<pre><code>${codeLines.join('\n')}</code></pre>`)
      i += 1
      continue
    }

    // Blank line — paragraph break.
    if (/^\s*$/.test(line)) {
      flushParagraph()
      closeList()
      i += 1
      continue
    }

    // Horizontal rule.
    if (/^\s*---+\s*$/.test(line)) {
      flushParagraph()
      closeList()
      out.push('<hr>')
      i += 1
      continue
    }

    // Headings (#, ##, ###, ####).
    const headingMatch = /^(#{1,4})\s+(.+)$/.exec(line)
    if (headingMatch) {
      flushParagraph()
      closeList()
      const level = headingMatch[1]?.length ?? 1
      out.push(
        `<h${level}>${inlineMarkdown(headingMatch[2] ?? '')}</h${level}>`
      )
      i += 1
      continue
    }

    // Blockquote.
    if (/^>\s?/.test(line)) {
      flushParagraph()
      closeList()
      out.push(
        `<blockquote>${inlineMarkdown(line.replace(/^>\s?/, ''))}</blockquote>`
      )
      i += 1
      continue
    }

    // Unordered list item.
    const ulMatch = /^[-*]\s+(.+)$/.exec(line)
    if (ulMatch) {
      flushParagraph()
      openList('ul')
      out.push(`<li>${inlineMarkdown(ulMatch[1] ?? '')}</li>`)
      i += 1
      continue
    }

    // Ordered list item.
    const olMatch = /^\d+\.\s+(.+)$/.exec(line)
    if (olMatch) {
      flushParagraph()
      openList('ol')
      out.push(`<li>${inlineMarkdown(olMatch[1] ?? '')}</li>`)
      i += 1
      continue
    }

    // Paragraph line — buffer it; flush on blank-line / block start.
    closeList()
    paragraphBuffer.push(line)
    i += 1
  }

  flushParagraph()
  closeList()

  return out.join('\n')
}

function htmlToMd(html: string): string {
  let md = html
  // Use non-greedy patterns with negated character classes to prevent ReDoS
  md = md.replace(/<h1>([^<]*)<\/h1>/g, '# $1\n')
  md = md.replace(/<h2>([^<]*)<\/h2>/g, '## $1\n')
  md = md.replace(/<h3>([^<]*)<\/h3>/g, '### $1\n')
  md = md.replace(/<strong>([^<]*)<\/strong>/g, '**$1**')
  md = md.replace(/<em>([^<]*)<\/em>/g, '*$1*')
  md = md.replace(/<s>([^<]*)<\/s>/g, '~~$1~~')
  md = md.replace(/<code>([^<]*)<\/code>/g, '`$1`')
  md = md.replace(/<a href="([^"]*)"[^>]*>([^<]*)<\/a>/g, '[$2]($1)')
  md = md.replace(/<li>([^<]*)<\/li>/g, '- $1\n')
  md = md.replace(/<br\s*\/?>/g, '\n')
  md = md.replace(/<p>([^<]*)<\/p>/g, '$1\n\n')
  // Remove remaining HTML tags using a loop to handle nested tags
  let prevMd = ''
  while (prevMd !== md) {
    prevMd = md
    md = md.replace(/<[^>]+>/g, '')
  }
  return md.trim()
}

function textToHtml(text: string): string {
  return '<p>' + escapeHtml(text).replace(/\n/g, '<br>') + '</p>'
}

function htmlToText(html: string): string {
  let text = html
  text = text.replace(/<br\s*\/?>/g, '\n')
  // Remove HTML tags using a loop to handle nested tags completely
  let prevText = ''
  while (prevText !== text) {
    prevText = text
    text = text.replace(/<[^>]+>/g, '')
  }
  return text
}

export function convertValue(
  value: string,
  fromMode: EditorMode,
  toMode: EditorMode
): string {
  if (fromMode === toMode) return value
  let intermediate: string
  switch (fromMode) {
    case 'simple':
      intermediate = textToHtml(value)
      break
    case 'markdown':
      intermediate = mdToHtml(value)
      break
    case 'rich':
      intermediate = value
      break
  }
  switch (toMode) {
    case 'simple':
      return htmlToText(intermediate)
    case 'markdown':
      return htmlToMd(intermediate)
    case 'rich':
      return intermediate
  }
  return value
}
