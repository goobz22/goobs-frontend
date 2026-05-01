// --------------------------------------------------------------------------
// LEGACY FORM FIELD THEME — pruned in the 2026-05-01 Field overhaul
// --------------------------------------------------------------------------
//
// What used to live here:
//   - getSharedFormFieldStyles + 4 sibling helpers (now: CSS rules in
//     `src/components/Field/Shell/FieldShell.module.css`)
//   - getRequiredIndicatorStyle (now: `.requiredIndicator` CSS class)
//   - getRequiredLabelText (no longer needed — FieldShell renders the
//     label + indicator together)
//   - injectFormFieldGlobalResets (now: a `:global` block in the CSS
//     module)
//   - SharedFormFieldProps (unused outside this file — dropped)
//
// What survives:
//   - `FormFieldTheme` and `FormFieldStyles` types — still used by
//     `ComplexTextEditor` and `BigCalendar` themes which haven't been
//     migrated to FieldShell yet. These two interfaces are no longer
//     consumed by any Field component.
//   - `formFieldThemes` color map — drives `getFormFieldTheme` for
//     ComplexTextEditor's nested theme system.
//   - `getFormFieldTheme` — consumed by ComplexTextEditor only.
//   - `getRequiredProps` and `validateRequired` — pure utilities still
//     handy for forms outside the Field/Shell flow.

export interface FormFieldTheme {
  background: string
  border: {
    default: string
    focused: string
    error: string
  }
  text: string
  label: {
    default: string
    focused: string
    error: string
    shrunkBackground: string
  }
  adornment: {
    default: string
    focused: string
  }
  footerText: {
    default: string
    error: string
    info: string
  }
  fontFamily: string
}

export interface FormFieldStyles {
  // Theme selection
  theme?: 'light' | 'dark' | 'sacred'

  // Custom colors (all must be rgba format)
  backgroundColor?: string
  borderColor?: string
  borderFocusedColor?: string
  borderErrorColor?: string
  textColor?: string
  labelColor?: string
  labelFocusedColor?: string
  labelErrorColor?: string
  labelShrunkBackgroundColor?: string
  adornmentColor?: string
  adornmentFocusedColor?: string
  footerTextColor?: string
  footerTextErrorColor?: string
  footerTextInfoColor?: string
  fontFamily?: string

  // Required field styling
  requiredIndicatorColor?: string
  requiredIndicatorText?: string

  // Field state
  disabled?: boolean
  required?: boolean
  helperTextType?: 'error' | 'info'

  // Layout and spacing
  padding?: string
  paddingLeft?: string
  paddingRight?: string
  paddingTop?: string
  paddingBottom?: string
  margin?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string

  // Border and shape
  borderRadius?: string
  borderWidth?: string

  // Typography
  fontSize?: string
  fontWeight?: string | number
  lineHeight?: string

  // Dimensions
  width?: string
  height?: string
  minWidth?: string
  maxWidth?: string
  minHeight?: string
  maxHeight?: string

  // Adornment positioning (inherited by ComplexTextEditor + dropdown styles)
  startAdornmentOffset?: string
  endAdornmentOffset?: string
  arrowTop?: string
  arrowRight?: string
  arrowBottom?: string
  arrowLeft?: string
  arrowPadding?: string

  // Label positioning
  labelOffset?: string
  labelShrunkOffset?: string

  // Footer spacing
  footerMarginTop?: string
  footerFontSize?: string

  // Transitions
  transitionDuration?: string
  transitionEasing?: string
}

export const formFieldThemes: Record<
  'light' | 'dark' | 'sacred',
  FormFieldTheme
> = {
  light: {
    background: 'rgba(255, 255, 255, 0.95)',
    border: {
      default: 'rgba(209, 213, 219, 1)',
      focused: 'rgba(59, 130, 246, 1)',
      error: 'rgba(239, 68, 68, 1)',
    },
    text: 'rgba(31, 41, 55, 1)',
    label: {
      default: 'rgba(107, 114, 128, 1)',
      focused: 'rgba(59, 130, 246, 1)',
      error: 'rgba(239, 68, 68, 1)',
      shrunkBackground: 'rgba(255, 255, 255, 0.95)',
    },
    adornment: {
      default: 'rgba(107, 114, 128, 1)',
      focused: 'rgba(59, 130, 246, 1)',
    },
    footerText: {
      default: 'rgba(107, 114, 128, 1)',
      error: 'rgba(239, 68, 68, 1)',
      info: 'rgba(59, 130, 246, 1)',
    },
    fontFamily: '"Inter", sans-serif',
  },
  dark: {
    background: 'rgba(31, 41, 55, 0.95)',
    border: {
      default: 'rgba(75, 85, 99, 1)',
      focused: 'rgba(96, 165, 250, 1)',
      error: 'rgba(239, 68, 68, 1)',
    },
    text: 'rgba(255, 255, 255, 1)',
    label: {
      default: 'rgba(156, 163, 175, 1)',
      focused: 'rgba(96, 165, 250, 1)',
      error: 'rgba(239, 68, 68, 1)',
      shrunkBackground: 'rgba(31, 41, 55, 0.95)',
    },
    adornment: {
      default: 'rgba(156, 163, 175, 1)',
      focused: 'rgba(96, 165, 250, 1)',
    },
    footerText: {
      default: 'rgba(156, 163, 175, 1)',
      error: 'rgba(239, 68, 68, 1)',
      info: 'rgba(96, 165, 250, 1)',
    },
    fontFamily: '"Inter", sans-serif',
  },
  sacred: {
    background: 'rgba(0, 0, 0, 0.7)',
    border: {
      default: 'rgba(255, 215, 0, 0.3)',
      focused: 'rgba(255, 215, 0, 0.7)',
      error: 'rgba(239, 68, 68, 1)',
    },
    text: 'rgba(255, 255, 255, 0.9)',
    label: {
      default: 'rgba(255, 215, 0, 0.8)',
      focused: 'rgba(255, 215, 0, 1)',
      error: 'rgba(239, 68, 68, 1)',
      shrunkBackground: 'rgba(0, 0, 0, 0.7)',
    },
    adornment: {
      default: 'rgba(255, 215, 0, 0.6)',
      focused: 'rgba(255, 215, 0, 1)',
    },
    footerText: {
      default: 'rgba(255, 255, 255, 0.6)',
      error: 'rgba(239, 68, 68, 1)',
      info: 'rgba(96, 165, 250, 1)',
    },
    fontFamily: '"Crimson Text", serif',
  },
}

// Helper function to get computed theme with custom style overrides.
// Used by `ComplexTextEditor/theme.ts` and `theme/complextexteditor.ts`
// to derive ComplexTextEditor's color tokens from FormFieldStyles.
// Field components no longer call this — they use CSS variables.
export const getFormFieldTheme = (styles?: FormFieldStyles): FormFieldTheme => {
  const theme = styles?.theme || 'sacred'
  const baseTheme = formFieldThemes[theme]

  if (!styles) {
    return baseTheme
  }

  return {
    background: styles.backgroundColor || baseTheme.background,
    border: {
      default: styles.borderColor || baseTheme.border.default,
      focused: styles.borderFocusedColor || baseTheme.border.focused,
      error: styles.borderErrorColor || baseTheme.border.error,
    },
    text: styles.textColor || baseTheme.text,
    label: {
      default: styles.labelColor || baseTheme.label.default,
      focused: styles.labelFocusedColor || baseTheme.label.focused,
      error: styles.labelErrorColor || baseTheme.label.error,
      shrunkBackground:
        styles.labelShrunkBackgroundColor || baseTheme.label.shrunkBackground,
    },
    adornment: {
      default: styles.adornmentColor || baseTheme.adornment.default,
      focused: styles.adornmentFocusedColor || baseTheme.adornment.focused,
    },
    footerText: {
      default: styles.footerTextColor || baseTheme.footerText.default,
      error: styles.footerTextErrorColor || baseTheme.footerText.error,
      info: styles.footerTextInfoColor || baseTheme.footerText.info,
    },
    fontFamily: styles.fontFamily || baseTheme.fontFamily,
  }
}

export const getRequiredProps = (required?: boolean) => ({
  required: !!required,
  'aria-required': !!required,
})

export const validateRequired = (
  value: string,
  required?: boolean
): string | undefined => {
  if (required && (!value || value.trim() === '')) {
    return 'This field is required'
  }
  return undefined
}
