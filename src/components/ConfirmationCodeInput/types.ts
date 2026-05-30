// Public styling contract for ConfirmationCodeInput. Relocated from the old
// src/theme/confirmationcodeinput.ts (removed in the css-modules-theme-removal
// teardown) — the component is fully CSS-module driven now, so only this
// caller-facing override type survives. Shape preserved verbatim so existing
// callers keep compiling.
export interface ConfirmationCodeInputStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  boxShadow?: string
  backdropFilter?: string
  backgroundImage?: string
  padding?: string

  // Hover states
  hoverBackgroundColor?: string
  hoverBorderColor?: string
  hoverBoxShadow?: string
  hoverTransform?: string

  // Success container styling
  successBackgroundColor?: string
  successBorderColor?: string
  successBorderRadius?: string
  successBoxShadow?: string
  successBackdropFilter?: string
  successBackgroundImage?: string
  successPadding?: string

  // Success icon styling
  successIconFontSize?: string
  successIconColor?: string
  successIconFilter?: string
  successIconAnimation?: string

  // Success message styling
  successMessageFontSize?: string
  successMessageLineHeight?: string
  successMessageColor?: string
  successMessageFontFamily?: string
  successMessageFontWeight?: string | number
  successMessageLetterSpacing?: string
  successMessageTextTransform?: string
  successMessageTextShadow?: string

  // Input styling
  inputWidth?: string
  inputHeight?: string
  inputPadding?: string
  inputFontSize?: string
  inputFontFamily?: string
  inputFontWeight?: string | number
  inputLetterSpacing?: string
  inputColor?: string
  inputBackgroundColor?: string
  inputBorderColor?: string
  inputBorderRadius?: string
  inputBorderWidth?: string
  inputTextShadow?: string
  inputAnimation?: string

  // Input focus styling
  inputFocusBorderColor?: string
  inputFocusBorderWidth?: string
  inputFocusTransform?: string
  inputFocusBoxShadow?: string

  // Status indicator styling
  statusIndicatorWidth?: string
  statusIndicatorHeight?: string
  statusIndicatorBorderRadius?: string
  statusIndicatorBackgroundColor?: string
  statusIndicatorAnimation?: string
  statusIndicatorValidBackgroundColor?: string
  statusIndicatorValidAnimation?: string

  // Layout and spacing
  gap?: string
  inputGap?: string
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string

  // States
  disabled?: boolean
  outline?: boolean

  // Dimensions
  width?: string
  maxWidth?: string
  minWidth?: string
  height?: string
  maxHeight?: string
  minHeight?: string
}
