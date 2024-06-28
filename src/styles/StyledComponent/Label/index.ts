import { StyledComponentProps } from '../../../components/StyledComponent'
import React from 'react'

/**
 * labelStyles function generates the styles for the input label based on the provided props.
 * It adjusts the label's position, color, and transform based on the component variant, font colors, and focus state.
 * @param props The props for the labelStyles function, including componentvariant, unshrunkfontcolor, shrunkfontcolor, combinedfontcolor, shrunklabellocation, and focused.
 * @returns The styles for the input label.
 */
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
    shrunklabellocation = 'onnotch',
    focused,
  } = props

  /**
   * unshrunkStyles object contains the styles for the unshrunk label state.
   */
  const unshrunkStyles: React.CSSProperties = {
    color: combinedfontcolor || unshrunkfontcolor || 'black',
    transform: 'scale(1)',
    transformOrigin: 'top left',
    top: '13px',
    left: '12px',
    ...(componentvariant === 'searchbar' && {
      transform: 'translate(25px, 2px) scale(1)',
    }),
  }

  /**
   * shrunkStyles object contains the styles for the shrunk label state.
   */
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

  /**
   * Return the combined styles for the label, including the base styles, unshrunk styles, and shrunk styles if focused.
   */
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
