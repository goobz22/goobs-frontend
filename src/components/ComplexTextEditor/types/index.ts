import { Descendant } from 'slate'

export interface RichTextEditorTypes {
  Block: {
    Paragraph: 'paragraph'
    ListItem: 'list-item'
    BulletedList: 'bulleted-list'
    NumberedList: 'numbered-list'
    Link: 'link'
  }
  Inline: {
    Bold: 'bold'
    Italic: 'italic'
    Underline: 'underline'
    Strikethrough: 'strikethrough'
    Code: 'code'
  }
  Alignment: 'left' | 'center' | 'right' | 'justify'
  CustomElement: {
    type:
      | RichTextEditorTypes['Block'][keyof RichTextEditorTypes['Block']]
      | RichTextEditorTypes['Inline'][keyof RichTextEditorTypes['Inline']]
    children: Descendant[]
    align?: RichTextEditorTypes['Alignment']
    url?: string
  }
  CustomText: {
    text: string
    bold?: boolean
    italic?: boolean
    code?: boolean
    underline?: boolean
    strikethrough?: boolean
    align?: RichTextEditorTypes['Alignment']
    link?: string
  }
}

export type InlineFormat =
  RichTextEditorTypes['Inline'][keyof RichTextEditorTypes['Inline']]
export type BlockFormat =
  RichTextEditorTypes['Block'][keyof RichTextEditorTypes['Block']]
export type AlignmentFormat = RichTextEditorTypes['Alignment']
