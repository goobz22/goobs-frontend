import { EditorMode } from '../Toolbars/Complex'

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function mdToHtml(md: string): string {
  let html = escapeHtml(md)
  html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>')
  html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>')
  html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  html = html.replace(/~~(.*?)~~/g, '$1')
  html = html.replace(/`(.*?)`/g, '<code>$1</code>')
  html = html.replace(/\[([^[]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  html = html.replace(/^- (.*)$/gm, '<ul><li>$1</li></ul>')
  html = html.replace(/^\d+\. (.*)$/gm, '<ol><li>$1</li></ol>')
  html = html.replace(/\n/g, '<br>')
  return '<p>' + html + '</p>'
}

function htmlToMd(html: string): string {
  let md = html
  md = md.replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
  md = md.replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
  md = md.replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
  md = md.replace(/<strong>(.*?)<\/strong>/g, '**$1**')
  md = md.replace(/<em>(.*?)<\/em>/g, '*$1*')
  md = md.replace(/(.*?)<\/s>/g, '~~$1~~')
  md = md.replace(/<code>(.*?)<\/code>/g, '`$1`')
  md = md.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')
  md = md.replace(/<li>(.*?)<\/li>/g, '- $1\n')
  md = md.replace(/<br>/g, '\n')
  md = md.replace(/<p>(.*?)<\/p>/g, '$1\n\n')
  md = md.replace(/<[^>]+>/g, '')
  return md.trim()
}

function textToHtml(text: string): string {
  return '<p>' + escapeHtml(text).replace(/\n/g, '<br>') + '</p>'
}

function htmlToText(html: string): string {
  let text = html
  text = text.replace(/<br>/g, '\n')
  text = text.replace(/<[^>]+>/g, '')
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
