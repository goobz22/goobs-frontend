/**
 * Markdown toolbar helpers for ComplexTextEditor's markdown mode.
 *
 * The markdown-to-Slate conversion path that used to live here
 * (`markdownToSlate` + `handleSwitchToRichText`, plus the bold/italic regexes
 * they parsed with) was removed 2026-09-07: the rich-text half of this editor
 * is a contentEditable surface (`RichEditor/index.tsx`) whose conversion seam is
 * `utils/conversion.ts`, there is no Slate document model anywhere in the
 * library, and nothing had imported either function. `handleMarkdownChange`
 * (a one-line setState passthrough) went with them for the same reason.
 * The three helpers below ARE wired: `Toolbars/Editor` and `MarkdownEditor`
 * import them.
 */

/**
 * Apply bold markdown around selectedText.
 */
export const handleBoldClick = (
  selectedText: string,
  markdown: string,
  setMarkdown: (value: string) => void
): void => {
  if (selectedText) {
    const newValue = '**' + selectedText + '**'
    replaceSelectedText(newValue, markdown, selectedText, setMarkdown)
  }
}

/**
 * Apply italic markdown around selectedText.
 */
export const handleItalicClick = (
  selectedText: string,
  markdown: string,
  setMarkdown: (value: string) => void
): void => {
  if (selectedText) {
    const newValue = '_' + selectedText + '_'
    replaceSelectedText(newValue, markdown, selectedText, setMarkdown)
  }
}

/**
 * Replace the selected text with newValue in the original markdown.
 */
export const replaceSelectedText = (
  newValue: string,
  markdown: string,
  selectedText: string,
  setMarkdown: (value: string) => void
): void => {
  if (selectedText) {
    const newMarkdown = markdown.replace(selectedText, newValue)
    setMarkdown(newMarkdown)
  }
}
