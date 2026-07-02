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
  /** Root background color. */
  backgroundColor?: string
  /** Root background-image. */
  backgroundImage?: string
  /** Root border color. */
  borderColor?: string
  /** Root border radius. */
  borderRadius?: string
  /** Root border width. */
  borderWidth?: string
  /** Root box shadow. */
  boxShadow?: string
  /** Root padding. */
  padding?: string

  // Layout and spacing. gap/inputGap forward as the --cci-gap /
  // --cci-input-gap custom properties (main-content and digit-cell gaps);
  // margins apply inline on the root element.
  /** Gap between the main content blocks (--cci-gap). */
  gap?: string
  /** Gap between the digit cells (--cci-input-gap). */
  inputGap?: string
  /** Root margin shorthand. */
  margin?: string
  /** Root top margin. */
  marginTop?: string
  /** Root bottom margin. */
  marginBottom?: string
  /** Root left margin. */
  marginLeft?: string
  /** Root right margin. */
  marginRight?: string

  /**
   * Disables every digit input and dims the container
   * (emitted as `data-disabled` on the root).
   */
  disabled?: boolean

  // Dimensions — applied as inline overrides on the root element.
  /** Root width. */
  width?: string
  /** Root max-width. */
  maxWidth?: string
  /** Root min-width. */
  minWidth?: string
  /** Root height. */
  height?: string
  /** Root max-height. */
  maxHeight?: string
  /** Root min-height. */
  minHeight?: string
}
