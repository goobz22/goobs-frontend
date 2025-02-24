import { RichTextEditorTypes } from '../types'
import React from 'react'

// Simple regex patterns to identify bold and italic in markdown
const boldAndItalicPattern = /(\*\*\*(.*?)\*\*\*)/g
const boldPattern = /(\*\*(.*?)\*\*)/g
const italicPattern = /(\*(.*?)\*)/g

/**
 * 1) Converts markdown to Slate format (async because we use Promise.all)
 */
export const markdownToSlate = async (
  markdown: string
): Promise<RichTextEditorTypes['CustomElement'][]> => {
  // Split markdown text by line breaks to create paragraphs
  const lines = markdown
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)

  const output: RichTextEditorTypes['CustomElement'][] = await Promise.all(
    lines.map(line => {
      const paragraph: RichTextEditorTypes['CustomElement'] = {
        type: 'paragraph',
        children: [{ text: line }],
      }

      // Check for bold and italic (***)
      if (boldAndItalicPattern.test(line)) {
        paragraph.children = Array.from(
          line.matchAll(boldAndItalicPattern)
        ).map(match => ({
          text: match[2],
          italic: true,
          bold: true,
        }))
      }
      // Check for bold (**)
      else if (boldPattern.test(line)) {
        paragraph.children = Array.from(line.matchAll(boldPattern)).map(
          match => ({
            text: match[2],
            bold: true,
          })
        )
      }
      // Check for italic (*)
      else if (italicPattern.test(line)) {
        paragraph.children = Array.from(line.matchAll(italicPattern)).map(
          match => ({
            text: match[2],
            italic: true,
          })
        )
      }

      return paragraph
    })
  )

  return output
}

/**
 * 2) Switch from Markdown to RichText mode (async because we call markdownToSlate)
 */
export const handleSwitchToRichText = async (
  markdown: string,
  setSlateValue: (value: RichTextEditorTypes['CustomElement'][]) => void,
  setNewSlateValue: (value: RichTextEditorTypes['CustomElement'][]) => void,
  setMarkdownMode: (value: boolean) => void
): Promise<void> => {
  if (markdown !== '') {
    const newSlateValue = await markdownToSlate(markdown)
    setSlateValue(newSlateValue)
    setNewSlateValue(newSlateValue)
  }
  setMarkdownMode(false)
}

/**
 * 3) Apply bold markdown around selectedText (NO async since we do no awaiting)
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
 * 4) Apply italic markdown around selectedText (NO async)
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
 * 5) Replace the selected text with newValue in the original markdown (NO async)
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

/**
 * 6) Handle markdown input changes (NO async)
 */
export const handleMarkdownChange = (
  event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  setMarkdown: (value: string) => void
): void => {
  setMarkdown(event.target.value)
}
