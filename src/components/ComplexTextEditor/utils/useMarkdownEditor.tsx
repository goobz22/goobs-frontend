'use server'

import { RichTextEditorTypes } from '@/components/ComplexTextEditor/types'
import React from 'react'

// Simple regex patterns to identify bold and italic in markdown
const boldAndItalicPattern = /(\*\*\*(.*?)\*\*\*)/g
const boldPattern = /(\*\*(.*?)\*\*)/g
const italicPattern = /(\*(.*?)\*)/g

export const markdownToSlate = async (
  markdown: string
): Promise<RichTextEditorTypes['CustomElement'][]> => {
  // Split markdown text by line breaks to create paragraphs
  const lines = markdown
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)

  const output: RichTextEditorTypes['CustomElement'][] = await Promise.all(
    lines.map(async line => {
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

export const handleSwitchToRichText = async (
  markdown: string,
  setSlateValue: (value: RichTextEditorTypes['CustomElement'][]) => void,
  setNewSlateValue: (value: RichTextEditorTypes['CustomElement'][]) => void,
  setMarkdownMode: (value: boolean) => void
): Promise<void> => {
  try {
    if (markdown !== '') {
      const newSlateValue = await markdownToSlate(markdown)
      setSlateValue(newSlateValue)
      setNewSlateValue(newSlateValue)
      console.log('New Slate Value: ', newSlateValue)
    }
    console.log('Before switching: markdownMode = ', false)
    setMarkdownMode(false)
  } catch (err) {
    console.error('Error switching to RichText mode: ', err)
  }
}

export const handleBoldClick = async (
  selectedText: string,
  markdown: string,
  setMarkdown: (value: string) => void
): Promise<void> => {
  if (selectedText) {
    const newValue = '**' + selectedText + '**'
    await replaceSelectedText(newValue, markdown, selectedText, setMarkdown)
  }
}

export const handleItalicClick = async (
  selectedText: string,
  markdown: string,
  setMarkdown: (value: string) => void
): Promise<void> => {
  if (selectedText) {
    const newValue = '_' + selectedText + '_'
    await replaceSelectedText(newValue, markdown, selectedText, setMarkdown)
  }
}

export const replaceSelectedText = async (
  newValue: string,
  markdown: string,
  selectedText: string,
  setMarkdown: (value: string) => void
): Promise<void> => {
  if (selectedText) {
    const newMarkdown = markdown.replace(selectedText, newValue)
    setMarkdown(newMarkdown)
  }
}

export const handleMarkdownChange = async (
  event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  setMarkdown: (value: string) => void
): Promise<void> => {
  setMarkdown(event.target.value)
}
