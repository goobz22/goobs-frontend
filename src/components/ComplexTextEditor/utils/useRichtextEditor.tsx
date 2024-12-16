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
import {
  RichTextEditorTypes,
  InlineFormat,
  BlockFormat,
  AlignmentFormat,
} from '../types'

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
    console.log('RichTextEditor: markdownMode = ', markdownMode)
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
    ) as NodeEntry<Node>[]
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
        type: format as 'bulleted-list' | 'numbered-list',
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
    ) as NodeEntry<Node>[]

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
      const link = node[0] as RichTextEditorTypes['CustomElement']
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
  }
}
