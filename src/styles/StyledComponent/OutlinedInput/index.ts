import { StyledComponentProps } from '../../../types/styledcomponent'

const outlinedInputStyles = (
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
  const {
    outlinecolor,
    backgroundcolor,
    componentvariant,
    unshrunkfontcolor,
    combinedfontcolor,
  } = props

  const defaultControlHeight = '40px'
  const multilineMinHeight = '85px'
  const inputPadding = '0 0px'
  const searchInputPadding = '0 14px 0 24px'

  return {
    backgroundColor: backgroundcolor || 'inherit',
    width: '100%',
    cursor: componentvariant === 'dropdown' ? 'pointer' : 'text',
    height:
      componentvariant !== 'multilinetextfield' ? defaultControlHeight : 'auto',
    boxSizing: 'border-box',
    border: outlinecolor ? `1px solid ${outlinecolor}` : 'inherit',
    paddingLeft: componentvariant === 'searchbar' ? '24px' : '0px',
    paddingRight: '0px',
    color: combinedfontcolor || unshrunkfontcolor || 'inherit',
    pointerEvents: componentvariant === 'dropdown' ? 'none' : 'auto',
    userSelect: componentvariant === 'dropdown' ? 'none' : 'auto',
  }
}

export default outlinedInputStyles
