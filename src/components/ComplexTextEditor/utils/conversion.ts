import type { EditorMode } from '../Toolbars/Complex'
import sanitizeMarkup from 'sanitize-html'
import { decodeHTML } from 'entities'

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Lowercase a URL with all whitespace / C0-control chars removed, for URL
 * SCHEME detection only (browsers ignore tabs/newlines inside a scheme, so
 * `java&#9;script:` must read as `javascript:`). Filters on code point rather
 * than a control-char regex so it never trips `no-control-regex`.
 */
function urlSchemeProbe(value: string): string {
  let probe = ''
  for (const ch of value) if (ch.charCodeAt(0) > 0x20) probe += ch
  return probe.toLowerCase()
}

/**
 * Restrict a markdown link/image URL to a safe scheme so the generated
 * `href`/`src` can never carry an executable URL. `escapeHtml` (run over the
 * whole source first) blocks HTML-tag and attribute-breakout injection, but it
 * does NOT touch a `javascript:` scheme sitting inside a `[text](URL)` /
 * `![alt](URL)` — so `[x](javascript:alert(1))` would still emit a clickable
 * `<a href="javascript:alert(1)">`. This closes that seam.
 *
 * Scheme DETECTION runs on a copy with C0 control chars removed (browsers
 * ignore tabs/newlines inside a URL scheme, so `java&#9;script:` is
 * `javascript:`), but the ORIGINAL value is returned unchanged when allowed —
 * a legitimate URL's contents (e.g. an inline SVG data-URI) are never mangled.
 *
 * - `src` (images): `http(s)` and inert `data:image/*` only; anything else
 *   (incl. `javascript:` and non-image `data:`) becomes empty.
 * - `href` (links): `http(s)`/`mailto`/`tel`/relative/anchor only; a dangerous
 *   scheme becomes `#`.
 */
function sanitizeUrl(url: string, context: 'href' | 'src'): string {
  const trimmed = url.trim()
  const probe = urlSchemeProbe(trimmed)
  const scheme = /^([a-z][a-z0-9+.-]*):/.exec(probe)
  if (!scheme) return trimmed // relative path, `#anchor`, or scheme-less
  const proto = scheme[1]
  if (context === 'src') {
    if (proto === 'http' || proto === 'https') return trimmed
    if (probe.startsWith('data:image/')) return trimmed
    return ''
  }
  if (
    proto === 'http' ||
    proto === 'https' ||
    proto === 'mailto' ||
    proto === 'tel'
  )
    return trimmed
  return '#'
}

/**
 * Strip active/script content from an HTML string while preserving structural
 * and inline formatting tags. This is the escaping SEAM for the two
 * `dangerouslySetInnerHTML` sinks that render a raw HTML VALUE rather than
 * `mdToHtml` output: the rich-text editor's contentEditable value
 * (`RichEditor/index.tsx`) and the knowledgebase article field values rendered
 * in the add-task drawer (`ProjectBoard/forms/AddTask/inline.tsx`). Both carry
 * HTML by design (bold/lists/images/code), so escaping-to-text would break the
 * feature — the correct root-cause fix is to keep the formatting and remove the
 * script vectors.
 *
 * Preserved: b/i/u/s, headings, lists, links, code, images, blockquotes, etc.
 * Removed: `<script>`/`<style>`/`<iframe>`/`<object>`/`<embed>`/… elements (with
 * their content), inline `on*=` event-handler attributes, and
 * `javascript:`/`vbscript:`/non-image `data:` URLs in `href`/`src`.
 *
 * Parse HTML before checking attributes: browsers decode character references
 * in URLs and accept attribute syntax a regex cannot safely recognize. The
 * same parser runs during SSR and in the browser, with an explicit allowlist
 * for editor formatting. Hosts must also sanitize content at their own trust
 * boundaries before storing or rendering it elsewhere.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''
  const colors = [/^#[\da-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i, /^[a-z]+$/i]
  return sanitizeMarkup(html, {
    allowedTags: [
      ...sanitizeMarkup.defaults.allowedTags,
      'img',
      'font',
      's',
      'strike',
    ],
    allowedAttributes: {
      '*': ['style'],
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      font: ['color', 'face', 'size'],
      code: ['class'],
      th: ['colspan', 'rowspan', 'scope'],
      td: ['colspan', 'rowspan'],
      ol: ['start', 'reversed'],
      li: ['value'],
    },
    allowedStyles: {
      '*': {
        'text-align': [/^(left|right|center|justify)$/],
        color: colors,
        'background-color': colors,
        'font-size': [/^\d+(?:\.\d+)?(?:px|em|rem|%)$/],
        'font-family': [/^[\w\s,'"-]+$/],
        'font-weight': [/^(normal|bold|[1-9]00)$/],
        'font-style': [/^(normal|italic|oblique)$/],
        'text-decoration': [/^(none|underline|line-through|overline)$/],
      },
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
    transformTags: {
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, src: sanitizeUrl(attribs.src ?? '', 'src') },
      }),
      a: (tagName, attribs) => ({
        tagName,
        attribs:
          attribs.target === '_blank'
            ? { ...attribs, rel: 'noopener noreferrer' }
            : attribs,
      }),
    },
  })
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
  // URL is scheme-restricted (sanitizeUrl) so a `data:`/`javascript:` src can
  // never ride in; alt is already HTML-escaped by the source-wide escapeHtml.
  out = out.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (_match, alt: string, url: string) =>
      `<img src="${sanitizeUrl(url, 'src')}" alt="${alt}" />`
  )
  // Link — href scheme-restricted so `[x](javascript:alert(1))` cannot emit a
  // clickable `javascript:` link (escapeHtml alone does not neutralize it).
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, text: string, url: string) =>
      `<a href="${sanitizeUrl(url, 'href')}">${text}</a>`
  )
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
  // Decode once, after stripping markup, so escaped literal tags remain text.
  return decodeHTML(md).trim()
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
  return decodeHTML(text)
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
