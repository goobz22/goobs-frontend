import { StyledComponentProps } from '../../../types/styledcomponent'

const formControlStyles = (
  props: Pick<
    StyledComponentProps,
    | 'outlinecolor'
    | 'backgroundcolor'
    | 'componentvariant'
    | 'unshrunkfontcolor'
    | 'shrunkfontcolor'
    | 'combinedfontcolor'
    | 'iconcolor'
    | 'shrunklabellocation'
  >
): React.CSSProperties => {
  const { outlinecolor, componentvariant } = props

  return {
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    border: outlinecolor ? `1px solid ${outlinecolor} !important` : 'inherit',
    borderColor: outlinecolor
      ? `1px solid ${outlinecolor} !important`
      : 'inherit',
    width: '100%',
    position: 'relative',
    cursor: componentvariant === 'dropdown' ? 'pointer' : 'text',
    margin: 0,
    padding: 0,
  }
}

export default formControlStyles
