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
    unshrunkfontcolor,
    shrunkfontcolor,
    combinedfontcolor,
    shrunklabellocation = 'onnotch',
    focused,
  } = props

  const unshrunkStyles: React.CSSProperties = {
    color: combinedfontcolor || unshrunkfontcolor || 'black',
    transform: 'scale(1)',
    transformOrigin: 'top left',
    top: '13px',
    left: '12px',
  }

  const shrunkStyles: React.CSSProperties = {
    color: combinedfontcolor || shrunkfontcolor || 'black',
    transform: 'scale(0.75)',
    transformOrigin: 'top left',
    ...(shrunklabellocation === 'onnotch' && {
      top: '-4px',
      left: '12px',
    }),
    ...(shrunklabellocation === 'above' && {
      top: '3px',
      left: '0',
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
