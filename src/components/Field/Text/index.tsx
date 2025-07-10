'use client'
import * as Agnostic from '../../../framework-agnostic'

export type TextFieldProps = Agnostic.InputHTMLAttributes<HTMLInputElement> & {
  startAdornment?: Agnostic.VirtualElement
  endAdornment?: Agnostic.VirtualElement
  label?: Agnostic.VirtualElement | string
  inputPadding?: { top?: number; left?: number }
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  error?: boolean
  sacredtheme?: boolean
}

const getStyles = (
  sacredtheme?: boolean,
  error?: boolean,
  isLabelShrunken?: boolean,
  isVisuallyActive?: boolean,
  shrunklabelposition?: 'onNotch' | 'aboveNotch',
  startAdornment?: Agnostic.VirtualElement,
  endAdornment?: Agnostic.VirtualElement,
  hasLabel?: boolean,
  measuredWidth?: number
) => {
  const borderColor = error
    ? '#EF4444'
    : isVisuallyActive
      ? sacredtheme
        ? '#FFD700'
        : '#3B82F6'
      : sacredtheme
        ? 'rgba(255, 215, 0, 0.4)'
        : '#D1D5DB'

  // Centralized transition properties for smoother animations
  const transitionCurve = 'cubic-bezier(0.4, 0, 0.2, 1)'
  const transitionDuration = '200ms'
  const sharedTransition = `all ${transitionDuration} ${transitionCurve}`

  return {
    container: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      width: '100%',
      marginTop: hasLabel ? '8px' : '0px',
      marginBottom: '16px',
      height: 'auto',
      overflow: 'visible',
    } as Agnostic.CSSProperties,

    inputWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      minHeight: '40px',
      height: 'auto',
      borderRadius: '8px',
      transition: sharedTransition,
      ...(sacredtheme
        ? {
            backgroundColor: 'rgba(10, 10, 10, 0.98)', // Increased opacity, removed blur
            color: '#FFD700',
            backgroundImage: `
              radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
              radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.03) 0%, transparent 50%)
            `,
            ...(isVisuallyActive && {
              boxShadow:
                '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
              backgroundImage: `
                linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(255, 215, 0, 0.1) 100%),
                radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
                radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.05) 0%, transparent 50%)
              `,
            }),
          }
        : {
            backgroundColor: 'rgba(255, 255, 255, 0.98)', // Increased opacity, removed blur
            color: 'rgb(31, 41, 55)',
            ...(isVisuallyActive && {
              backgroundColor: 'rgba(239, 246, 255, 1)', // Make fully opaque on focus
              boxShadow:
                '0 4px 6px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.06)',
            }),
          }),
    } as Agnostic.CSSProperties,

    // Notched outline effect using multiple divs
    outlineTop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      backgroundColor: borderColor,
      transition: sharedTransition,
      ...(isLabelShrunken &&
        hasLabel &&
        shrunklabelposition === 'onNotch' && {
          background: `linear-gradient(to right, ${borderColor} 0%, ${borderColor} 10px, transparent 10px, transparent calc(14px + ${measuredWidth}px), ${borderColor} calc(14px + ${measuredWidth}px), ${borderColor} 100%)`,
        }),
    } as Agnostic.CSSProperties,

    outlineBottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '1px',
      backgroundColor: borderColor,
      transition: sharedTransition,
    } as Agnostic.CSSProperties,

    outlineLeft: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: '1px',
      backgroundColor: borderColor,
      transition: sharedTransition,
    } as Agnostic.CSSProperties,

    outlineRight: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      width: '1px',
      backgroundColor: borderColor,
      transition: sharedTransition,
    } as Agnostic.CSSProperties,

    input: {
      width: '100%',
      backgroundColor: 'transparent',
      outline: 'none',
      border: 'none',
      padding: '16px',
      paddingTop: hasLabel ? '16px' : '2px',
      paddingBottom: hasLabel ? '16px' : '22px',
      textAlign: 'left',
      fontSize: '16px',
      fontFamily: sacredtheme ? '"Cinzel", serif' : '"Inter", sans-serif',
      fontWeight: sacredtheme ? 500 : 400,
      color: sacredtheme ? '#FFD700' : 'rgb(31, 41, 55)',
      paddingLeft: startAdornment ? '48px' : '16px',
      paddingRight: endAdornment ? '48px' : '16px',
      transition: sharedTransition,
      ...(sacredtheme && {
        textShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
        letterSpacing: '0.025em',
      }),
    } as Agnostic.CSSProperties,

    label: {
      position: 'absolute',
      left:
        isLabelShrunken && shrunklabelposition === 'onNotch' ? '12px' : '16px',
      transition: `transform ${transitionDuration} ${transitionCurve}, color ${transitionDuration} ${transitionCurve}, font-size ${transitionDuration} ${transitionCurve}, top ${transitionDuration} ${transitionCurve}, left ${transitionDuration} ${transitionCurve}`,
      pointerEvents: 'none',
      transformOrigin: 'top left',
      fontFamily: sacredtheme ? '"Cinzel", serif' : '"Inter", sans-serif',
      fontWeight: isLabelShrunken
        ? sacredtheme
          ? 700
          : 600
        : sacredtheme
          ? 600
          : 500,
      color: sacredtheme ? 'rgba(255, 215, 0, 0.8)' : '#6B7280',
      ...(isLabelShrunken
        ? {
            fontSize: '13px',
            ...(shrunklabelposition === 'aboveNotch'
              ? {
                  top: '-24px',
                  transform: 'translateY(0) scale(1)',
                  backgroundColor: 'transparent',
                  padding: '0',
                }
              : {
                  top: '0px',
                  transform: 'translateY(-50%) scale(1)',
                  backgroundColor: sacredtheme
                    ? 'rgba(10, 10, 10, 0.98)' // Match wrapper
                    : 'rgba(255, 255, 255, 0.98)', // Match wrapper
                  padding: '0 2px',
                }),
          }
        : {
            top: '50%',
            transform: 'translateY(-50%) scale(1)',
            fontSize: '16px',
            backgroundColor: 'transparent',
            padding: '0',
          }),
      ...(isVisuallyActive && {
        color: sacredtheme ? '#FFD700' : '#3B82F6',
        ...(sacredtheme && {
          textShadow: '0 0 15px rgba(255, 215, 0, 0.6)',
        }),
      }),
      ...(error && {
        color: '#EF4444',
      }),
    } as Agnostic.CSSProperties,

    adornment: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: sharedTransition,
      color: sacredtheme ? 'rgba(255, 215, 0, 0.8)' : '#6B7280',
      ...(isVisuallyActive && {
        color: sacredtheme ? '#FFD700' : '#3B82F6',
      }),
    } as Agnostic.CSSProperties,

    startAdornment: {
      left: '16px',
    } as Agnostic.CSSProperties,

    endAdornment: {
      right: '16px',
    } as Agnostic.CSSProperties,

    // Sacred theme decorative elements
    sacredGlyph: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      color: 'rgba(255, 215, 0, 0.3)',
      fontSize: '12px',
      pointerEvents: 'none',
      transition: 'all 0.3s ease',
      ...(isVisuallyActive && {
        color: 'rgba(255, 215, 0, 0.6)',
        animation: 'sacredFloat 3s ease-in-out infinite',
      }),
    } as Agnostic.CSSProperties,
  }
}

function TextFieldCore(props: TextFieldProps): Agnostic.VirtualElement | null {
  const {
    name,
    label,
    placeholder,
    onChange,
    onFocus,
    onBlur,
    value,
    error,
    disabled,
    className,
    startAdornment,
    endAdornment,
    shrunklabelposition = 'onNotch',
    sacredtheme = false,
    ...restProps
  } = props

  const inputRef = Agnostic.useSignal<HTMLInputElement | null>(null)
  const focusSignal = Agnostic.useFocusSignal({ name: 'textfield-focus' })
  const hasValueSignal = Agnostic.useSignal(Boolean(value?.toString().length), {
    name: 'textfield-has-value',
  })

  // Update hasValue signal when props change
  Agnostic.useEffect(() => {
    console.log('--- ⚡️ TextField useEffect ---', { value: props.value });
    hasValueSignal.value = Boolean(value?.toString().length)
  }, [value])

  const hasLabel = Boolean(label)

  const labelMeasure = Agnostic.useMeasureSignal({ name: 'label-measure' })
  const measuredWidth = labelMeasure.width

  const handleChange = (e: Agnostic.ChangeEvent<HTMLInputElement>) => {
    hasValueSignal.value = Boolean(e.target.value.length)
    onChange?.(e)
  }

  const handleClick = () => {
    inputRef.value?.focus()
  }

  // The 'visually active' state is now determined by a combination of the focus signal
  // (which handles live focus/blur) and whether there's a value on initial render.
  // This ensures the label is shrunken correctly from the start if a value is provided.
  const isVisuallyActive = focusSignal.value || hasValueSignal.value
  const isLabelShrunken = isVisuallyActive

  console.log('--- ⚛️ TextField Render State ---', {
    name: props.name,
    'props.value': props.value,
    'focusSignal.value': focusSignal.value,
    'hasValueSignal.value': hasValueSignal.value,
    isVisuallyActive,
    isLabelShrunken,
  });

  const styles = getStyles(
    sacredtheme,
    error,
    isLabelShrunken,
    isVisuallyActive,
    shrunklabelposition,
    startAdornment,
    endAdornment,
    hasLabel,
    measuredWidth
  )

  // Add CSS animations for sacred theme
  Agnostic.useEffect(() => {
    if (sacredtheme) {
      const styleSheet = document.styleSheets[0]
      const keyframes = `
        @keyframes sacredFloat {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-3px); opacity: 0.6; }
        }
      `
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
      } catch {
        // Keyframes might already exist
      }
    }
  }, [sacredtheme])

  return Agnostic.createElement(
    'div',
    { style: styles.container, className: className },
    Agnostic.createElement(
      'div',
      {
        style: styles.inputWrapper,
        onClick: handleClick,
      },
      // Notched outline
      Agnostic.createElement('div', { style: styles.outlineTop }),
      Agnostic.createElement('div', { style: styles.outlineBottom }),
      Agnostic.createElement('div', { style: styles.outlineLeft }),
      Agnostic.createElement('div', { style: styles.outlineRight }),

      // Start adornment
      startAdornment &&
        Agnostic.createElement(
          'div',
          { style: { ...styles.adornment, ...styles.startAdornment } },
          startAdornment
        ),

      // Input field
      Agnostic.createElement('input', {
        id: name,
        name: name,
        placeholder: isLabelShrunken && placeholder ? placeholder : '',
        onChange: handleChange,
        onFocus: onFocus,
        onBlur: onBlur,
        value: value,
        disabled: disabled,
        style: styles.input,
        ref: (el: HTMLInputElement | null) => {
          console.log(`--- 🔗 TextField ref callback ---`, { el: !!el, name: props.name });
          inputRef.value = el
          focusSignal.attachTo(el, () => {
            const hasContent = Boolean(el?.value);
            console.log(`--- ❔ TextField contentCallback ---`, { hasContent, value: el?.value });
            return hasContent;
          })
        },
        ...restProps,
      }),

      // End adornment
      endAdornment &&
        Agnostic.createElement(
          'div',
          { style: { ...styles.adornment, ...styles.endAdornment } },
          endAdornment
        ),

      // Sacred theme decorative glyph
      sacredtheme &&
        Agnostic.createElement('div', { style: styles.sacredGlyph }, '𓊖')
    ),

          // Label
      label &&
        Agnostic.createElement(
          'label',
          {
            htmlFor: name,
            style: styles.label,
            ref: (el: HTMLLabelElement | null) => {
              console.log(`--- 🏷️ TextField label ref callback ---`, { 
                el: !!el, 
                name: props.name, 
                tagName: el?.tagName,
                id: el?.id,
                isSameNode: el && labelMeasure._element && el.isSameNode(labelMeasure._element),
                labelText: typeof label === 'string' ? label : 'complex'
              });
              labelMeasure.attachTo(el)
            },
          },
          label
        )
  )
}

// Export the framework-agnostic component
const TextField = TextFieldCore

export default TextField
