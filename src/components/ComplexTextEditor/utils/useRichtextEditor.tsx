import React, { useCallback, useState, useMemo, useEffect } from 'react'
import {
  createEditor,
  Descendant,
  Transforms,
  Editor,
  Element as SlateElement,
  Node,
  NodeEntry,
} from 'slate'
import { withReact, ReactEditor } from 'slate-react'
import { withHistory } from 'slate-history'

// Define types locally instead of importing from external files
export type AlignmentFormat = 'left' | 'center' | 'right' | 'justify'
export type InlineFormat =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'code'
  | 'link'
export type BlockFormat =
  | 'paragraph'
  | 'list-item'
  | 'bulleted-list'
  | 'numbered-list'
  | 'link'

export interface RichTextEditorTypes {
  Block: Record<string, BlockFormat>
  Inline: Record<string, InlineFormat>
  Alignment: AlignmentFormat
  CustomElement: {
    type: BlockFormat
    align?: AlignmentFormat
    url?: string
    children: Array<{ text: string } & Partial<Record<InlineFormat, boolean>>>
  }
  CustomText: {
    text: string
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strikethrough?: boolean
    code?: boolean
    link?: string
  }
}

const RichTextEditorConfig: RichTextEditorTypes = {
  Block: {
    Paragraph: 'paragraph',
    ListItem: 'list-item',
    BulletedList: 'bulleted-list',
    NumberedList: 'numbered-list',
    Link: 'link',
  },
  Inline: {
    Bold: 'bold',
    Italic: 'italic',
    Underline: 'underline',
    Strikethrough: 'strikethrough',
    Code: 'code',
  },
  Alignment: 'left',
  CustomElement: { type: 'paragraph', children: [] },
  CustomText: { text: '' },
}

// Custom type guard
function isCustomElement(
  node: Node
): node is RichTextEditorTypes['CustomElement'] {
  return SlateElement.isElement(node) && 'type' in node
}

export const useRichTextEditor = (
  initialValue: Descendant[],
  onChange?: (value: Descendant[]) => void
) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [markdownMode, setMarkdownMode] = useState(false)
  const [markdown, setMarkdown] = useState('')
  const [slateValue, setSlateValue] = useState<Descendant[]>([])
  const [internalValue, setInternalValue] =
    useState<Array<RichTextEditorTypes['CustomElement'] | Descendant>>(
      initialValue
    )

  useEffect(() => {
    // Effect for markdownMode changes
  }, [markdownMode])

  const handleChange = useCallback(
    (newValue: Descendant[]) => {
      setInternalValue(newValue)
      setSlateValue(newValue)
      if (onChange) {
        onChange(newValue)
      }
    },
    [onChange]
  )

  const toggleMark = (format: InlineFormat) => {
    const isActive = isMarkActive(format)
    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  }

  const isBlockActive = (
    format: BlockFormat | AlignmentFormat,
    property: keyof RichTextEditorTypes['CustomElement'] = 'type'
  ): boolean => {
    const [match] = Array.from(
      Editor.nodes(editor, {
        match: n =>
          isCustomElement(n) && property in n && n[property] === format,
      })
    )
    return !!match
  }

  const toggleBlock = (format: BlockFormat | AlignmentFormat) => {
    const isActive = isBlockActive(
      format,
      Object.values(RichTextEditorConfig.Alignment).includes(
        format as AlignmentFormat
      )
        ? 'align'
        : 'type'
    )
    const isList = format === 'bulleted-list' || format === 'numbered-list'

    Transforms.unwrapNodes(editor, {
      match: n =>
        isCustomElement(n) &&
        (n.type === 'bulleted-list' || n.type === 'numbered-list') &&
        !Object.values(RichTextEditorConfig.Alignment).includes(
          format as AlignmentFormat
        ),
      split: true,
    })

    let newProperties: Partial<RichTextEditorTypes['CustomElement']>
    if (
      Object.values(RichTextEditorConfig.Alignment).includes(
        format as AlignmentFormat
      )
    ) {
      newProperties = {
        align: isActive ? undefined : (format as AlignmentFormat),
      }
    } else {
      newProperties = {
        type: isActive
          ? RichTextEditorConfig.Block.Paragraph
          : isList
            ? RichTextEditorConfig.Block.ListItem
            : (format as Exclude<
                BlockFormat,
                'bulleted-list' | 'numbered-list'
              >),
      }
    }

    Transforms.setNodes(editor, newProperties)

    if (!isActive && isList) {
      const block: RichTextEditorTypes['CustomElement'] = {
        type: format,
        children: [],
      }
      Transforms.wrapNodes(editor, block)
    }
  }

  const isMarkActive = (format: InlineFormat): boolean => {
    const marks = Editor.marks(editor) as Record<string, boolean>
    return marks ? marks[format] === true : false
  }

  const toggleAlignment = (alignment: AlignmentFormat) => {
    const [match] = Array.from(
      Editor.nodes(editor, {
        match: n => {
          return isCustomElement(n) && n.align === alignment
        },
        mode: 'all',
      })
    )

    const isActive = !!match

    Transforms.setNodes<RichTextEditorTypes['CustomElement']>(
      editor,
      { align: isActive ? undefined : alignment },
      { match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n) }
    )
  }

  const handleBoldClick = () => {
    toggleMark('bold')
  }

  const handleItalicClick = () => {
    toggleMark('italic')
  }

  const insertLink = () => {
    let url = window.prompt('Enter the URL of the link:')
    if (!url) return
    const { selection } = editor
    if (!selection) return
    const nodes: NodeEntry<RichTextEditorTypes['CustomElement']>[] = Array.from(
      Editor.nodes(editor, {
        at: selection,
        match: n =>
          isCustomElement(n) && n.type === RichTextEditorConfig.Block.Link,
      })
    )
    if (nodes.length > 0) {
      const [node] = nodes
      const link = node[0]
      url = window.prompt('Edit the URL of the link:', link.url)
      if (!url) return
      Transforms.setNodes<RichTextEditorTypes['CustomElement']>(
        editor,
        { url },
        { at: ReactEditor.findPath(editor, link) }
      )
    } else {
      const link: RichTextEditorTypes['CustomElement'] = {
        type: RichTextEditorConfig.Block.Link,
        url,
        children: [{ text: Editor.string(editor, selection) }],
      }
      Transforms.wrapNodes(editor, link, { split: true })
      Transforms.collapse(editor, { edge: 'end' })
    }
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!event.ctrlKey) {
      return
    }

    event.preventDefault()

    switch (event.key) {
      case 'b': {
        toggleMark('bold')
        break
      }
      case 'i': {
        toggleMark('italic')
        break
      }
      case 'u': {
        toggleMark('underline')
        break
      }
      case 'z': {
        editor.undo()
        break
      }
      case 'y': {
        editor.redo()
        break
      }
      case 's': {
        toggleMark('strikethrough')
        break
      }
      case 'c': {
        toggleMark('code')
        break
      }
      case '1': {
        toggleBlock('bulleted-list')
        break
      }
      case '2': {
        toggleBlock('numbered-list')
        break
      }
      case 'l': {
        toggleAlignment('left')
        break
      }
      case 'e': {
        toggleAlignment('center')
        break
      }
      case 'r': {
        toggleAlignment('right')
        break
      }
      case 'j': {
        toggleAlignment('justify')
        break
      }
      default:
        return
    }
  }

  /**
   * Convert Slate value to Markdown string and switch to markdown mode
   */
  const handleSwitchToMarkdown = (
    editor: ReactEditor,
    setMarkdown: (value: string) => void,
    setMarkdownMode: (value: boolean) => void
  ): void => {
    // Simple conversion from Slate to Markdown
    const markdown = slateToMarkdown()
    setMarkdown(markdown)
    setMarkdownMode(true)
  }

  /**
   * Convert Slate nodes to Markdown format
   */
  const slateToMarkdown = (): string => {
    // Get the current content from the editor
    const nodes = internalValue as RichTextEditorTypes['CustomElement'][]

    // Transform nodes to markdown
    const markdownLines = nodes.map(node => {
      // Handle different block types
      switch (node.type) {
        case 'bulleted-list':
          // Handle bulleted lists
          return node.children
            .map(
              (item: RichTextEditorTypes['CustomElement'] | { text: string }) =>
                `* ${serializeLeaf(item)}`
            )
            .join('\n')
        case 'numbered-list':
          // Handle numbered lists
          return node.children
            .map(
              (
                item: RichTextEditorTypes['CustomElement'] | { text: string },
                index: number
              ) => `${index + 1}. ${serializeLeaf(item)}`
            )
            .join('\n')
        case 'list-item':
          // If list item appears directly (unlikely), render as paragraph
          return serializeLeaf(node)
        case 'link':
          // Handle links
          return `[${serializeLeaf(node)}](${node.url})`
        case 'paragraph':
        default:
          // Default case handles paragraphs
          return serializeLeaf(node)
      }
    })

    return markdownLines.join('\n\n')
  }

  /**
   * Serialize leaf nodes with their text formatting
   */
  const serializeLeaf = (
    node:
      | RichTextEditorTypes['CustomElement']
      | RichTextEditorTypes['CustomText']
      | { text: string }
  ): string => {
    // If node is a text leaf
    if ('text' in node && typeof node.text === 'string') {
      let text = node.text

      // Apply formatting
      if ('bold' in node && 'italic' in node && node.bold && node.italic) {
        text = `***${text}***`
      } else if ('bold' in node && node.bold) {
        text = `**${text}**`
      } else if ('italic' in node && node.italic) {
        text = `*${text}*`
      }
      if ('code' in node && node.code) {
        text = `\`${text}\``
      }
      if ('strikethrough' in node && node.strikethrough) {
        text = `~~${text}~~`
      }

      return text
    }

    // If node has children, process each child
    if ('children' in node && Array.isArray(node.children)) {
      return node.children
        .map(child =>
          serializeLeaf(
            child as
              | RichTextEditorTypes['CustomElement']
              | RichTextEditorTypes['CustomText']
              | { text: string }
          )
        )
        .join('')
    }

    return ''
  }

  return {
    editor,
    markdownMode,
    setMarkdownMode,
    markdown,
    setMarkdown,
    slateValue,
    setSlateValue,
    internalValue,
    handleChange,
    handleBoldClick,
    handleItalicClick,
    insertLink,
    onKeyDown,
    toggleMark,
    toggleBlock,
    isMarkActive,
    isBlockActive,
    toggleAlignment,
    handleSwitchToMarkdown,
  }
}
