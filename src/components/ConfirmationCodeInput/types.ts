// Public styling contract for ConfirmationCodeInput. Relocated from the old
// src/theme/confirmationcodeinput.ts (removed in the css-modules-theme-removal
// teardown) — the component is fully CSS-module driven now. 2026-07 audit:
// shrunk to the honored surface. The ~52 keys the component never read
// (hover*, input*, inputFocus*, success*, statusIndicator*, transition*,
// outline, backdropFilter — residue carried over verbatim from the removed
// theme layer) were deleted; no consumer passed any of them. Theme-level
// values live in ConfirmationCodeInput.module.css as --cci-* custom
// properties keyed off [data-theme].
export interface ConfirmationCodeInputStyles {
  /**
   * Theme variant — emitted as `data-theme` on the root element; selects the
   * --cci-* token set in the CSS module (sacred is the default).
   */
  theme?: 'light' | 'dark' | 'sacred'

  // Container styling — applied as inline overrides on the root element.
  backgroundColor?: string
  backgroundImage?: string
  borderColor?: string
  borderRadius?: string
  borderWidth?: string
  boxShadow?: string
  padding?: string

  // Layout and spacing. gap/inputGap forward as the --cci-gap /
  // --cci-input-gap custom properties (main-content and digit-cell gaps);
  // margins apply inline on the root element.
  gap?: string
  inputGap?: string
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  /**
   * Disables every digit input and dims the container
   * (emitted as `data-disabled` on the root).
   */
  disabled?: boolean

  // Dimensions — applied as inline overrides on the root element.
  width?: string
  maxWidth?: string
  minWidth?: string
  height?: string
  maxHeight?: string
  minHeight?: string
}
