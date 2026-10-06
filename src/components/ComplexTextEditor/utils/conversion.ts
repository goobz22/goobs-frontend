import type { EditorMode } from '../Toolbars/Complex'
import sanitizeMarkup from 'sanitize-html'
import { decodeHTML } from 'entities'
import { escapeHtml, mdToHtml, sanitizeUrl } from './markdown'
export { mdToHtml } from './markdown'

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
