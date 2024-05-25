import { StyledComponentProps } from '../../../components/StyledComponent'
import React from 'react'

const labelStyles = (
  props: Pick<
    StyledComponentProps,
    | 'componentvariant'
    | 'unshrunkfontcolor'
    | 'shrunkfontcolor'
    | 'combinedfontcolor'
    | 'shrunklabellocation'
    | 'focused'
  >
): React.CSSProperties => {
  const {
    componentvariant,
    unshrunkfontcolor,
    shrunkfontcolor,
    combinedfontcolor,
    shrunklabellocation = 'onnotch', // Set 'onnotch' as the default value
    focused,
  } = props

  // Default translation
  const defaultTransform = 'translate(12px, 13px) scale(1)'

  // Exception translations
  const exceptions: Partial<
    Record<Exclude<StyledComponentProps['componentvariant'], undefined>, string>
  > = {
    searchbar: 'translate(35px, 13px) scale(1)',
    dropdown: defaultTransform,
  }

  const unshrunkStyles: React.CSSProperties = {
    color: combinedfontcolor || unshrunkfontcolor || 'black',
    transform:
      componentvariant && exceptions[componentvariant]
        ? exceptions[componentvariant]
        : defaultTransform,
    transformOrigin: 'top left',
  }

  const shrunkStyles: React.CSSProperties = {
    color: combinedfontcolor || shrunkfontcolor || 'black',
    transform: 'scale(0.75)',
    transformOrigin: 'top left',
    top: '-4px',
    left: '12px',
    ...(shrunklabellocation === 'above' && {
      top: '-16px',
      left: '0',
    }),
    ...(shrunklabellocation === 'left' && {
      top: '8px',
      left: '-12px',
    }),
  }

  return {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 'auto',
    padding: '0 4px',
    minHeight: '20px',
    ...unshrunkStyles,
    ...(focused && shrunkStyles),
  }
}

export default labelStyles
