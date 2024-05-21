import { StyledComponentProps } from '../../../types/styledcomponent'

const labelStyles = (
  props: Pick<
    StyledComponentProps,
    | 'componentvariant'
    | 'unshrunkfontcolor'
    | 'shrunkfontcolor'
    | 'combinedfontcolor'
    | 'shrunklabellocation'
  >
): React.CSSProperties => {
  const {
    componentvariant,
    unshrunkfontcolor,
    shrunkfontcolor,
    combinedfontcolor,
    shrunklabellocation,
  } = props

  // Default translation
  const defaultTransform = 'translate(14px, 9px) scale(1)'

  // Exception translations
  const exceptions: Partial<
    Record<Exclude<StyledComponentProps['componentvariant'], undefined>, string>
  > = {
    searchbar: 'translate(35px, 9px) scale(1)',
  }

  // Shrink transformation for dropdown variant
  const ShrunkTransform = 'translate(0px, -18px) scale(0.75)'

  // Shrink transformation for other variants
  const defaultShrunkTransform = 'translate(11px, -9px) scale(0.75)'

  // Determine the correct transformation based on componentvariant
  const transform =
    componentvariant && exceptions[componentvariant]
      ? exceptions[componentvariant]
      : defaultTransform

  const shrunkStyles: React.CSSProperties =
    shrunklabellocation === 'above'
      ? {
          transform: ShrunkTransform,
          color: combinedfontcolor || shrunkfontcolor || 'black',
          padding: '0 4px',
        }
      : {
          transform: defaultShrunkTransform,
          color: combinedfontcolor || shrunkfontcolor || 'black',
          padding: '0 4px',
        }

  return {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 'auto',
    padding: '0 4px',
    color: combinedfontcolor || unshrunkfontcolor || 'black',
    transform: transform,
    minHeight: '20px',
    ...(shrunkStyles as any),
  }
}

export default labelStyles
