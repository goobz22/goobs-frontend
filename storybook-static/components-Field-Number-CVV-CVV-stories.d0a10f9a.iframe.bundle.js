'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [3642],
    {
      './src/components/Field/Number/CVV/CVV.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            InteractiveDemo: () => InteractiveDemo,
            PremiumTheme: () => PremiumTheme,
            SacredTheme: () => SacredTheme,
            __namedExportsOrder: () => __namedExportsOrder,
            default: () => CVV_stories,
          }))
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          theme = __webpack_require__('./src/theme/index.ts')
        const CVV = ({
          onChange,
          value = '',
          minLength = 3,
          maxLength = 4,
          isDefaultValue = !1,
          label = 'CVV',
          placeholder = '123',
          id,
          onFocus,
          onBlur,
          helperText,
          styles,
          ...props
        }) => {
          const [internalValue, setInternalValue] = (0, react.useState)(
              value || ''
            ),
            [isFocused, setIsFocused] = (0, react.useState)(!1),
            [hasBeenEdited, setHasBeenEdited] = (0, react.useState)(!1),
            validateCVV = (0, react.useCallback)(
              cvv => {
                const trimmedValue = cvv.trim()
                if ('' === trimmedValue) return !0
                const hasOnlyDigits = /^\d+$/.test(trimmedValue),
                  isValidLength =
                    trimmedValue.length >= minLength &&
                    trimmedValue.length <= maxLength
                return hasOnlyDigits && isValidLength
              },
              [minLength, maxLength]
            ),
            formatInput = (0, react.useCallback)(
              input => input.replace(/\D/g, ''),
              []
            ),
            maskCVV = (0, react.useCallback)(
              cvv => (cvv ? '*'.repeat(cvv.length) : cvv),
              []
            ),
            getDisplayValue = (0, react.useCallback)(
              () =>
                isDefaultValue && !isFocused && !hasBeenEdited && internalValue
                  ? maskCVV(internalValue)
                  : internalValue,
              [isDefaultValue, isFocused, hasBeenEdited, internalValue, maskCVV]
            )
          ;(0, react.useEffect)(() => {
            setInternalValue(value || '')
          }, [value])
          const handleChange = (0, react.useCallback)(
              e => {
                const rawValue = e.target.value,
                  truncatedValue = formatInput(rawValue).slice(0, maxLength)
                ;(setInternalValue(truncatedValue), setHasBeenEdited(!0))
                const valid = validateCVV(truncatedValue)
                null == onChange || onChange(truncatedValue, valid)
              },
              [onChange, validateCVV, formatInput, maxLength]
            ),
            handleFocus = (0, react.useCallback)(
              e => {
                ;(setIsFocused(!0), null == onFocus || onFocus(e))
              },
              [onFocus]
            ),
            handleBlur = (0, react.useCallback)(
              e => {
                ;(setIsFocused(!1), null == onBlur || onBlur(e))
              },
              [onBlur]
            ),
            computedStyles = ((styles, isFocused) => {
              const {
                themeConfig,
                borderColor,
                labelColor,
                adornmentColor,
                footerTextColor,
                transition,
              } = (0, theme.AW)(styles, isFocused)
              return {
                container: (0, theme.ZZ)(styles),
                inputWrapper: {
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  height: (null == styles ? void 0 : styles.height) || '40px',
                  width: '100%',
                  border: `${(null == styles ? void 0 : styles.borderWidth) || '1px'} solid ${borderColor}`,
                  borderRadius:
                    (null == styles ? void 0 : styles.borderRadius) || '8px',
                  backgroundColor: themeConfig.background,
                  color: themeConfig.text,
                  margin: 0,
                  padding: 0,
                  boxSizing: 'border-box',
                  transition,
                },
                input: {
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'transparent',
                  outline: 'none',
                  border: 'none',
                  padding:
                    (null == styles ? void 0 : styles.padding) || '8px 16px',
                  paddingLeft:
                    (null == styles ? void 0 : styles.paddingLeft) || '48px',
                  paddingRight:
                    (null == styles ? void 0 : styles.paddingRight) || '16px',
                  fontSize:
                    (null == styles ? void 0 : styles.fontSize) || '16px',
                  fontWeight: null == styles ? void 0 : styles.fontWeight,
                  lineHeight: null == styles ? void 0 : styles.lineHeight,
                  fontFamily: themeConfig.fontFamily,
                  color: 'inherit',
                  boxSizing: 'border-box',
                },
                label: (0, theme.Wh)(labelColor, themeConfig),
                adornment: (0, theme.EK)(adornmentColor),
                startAdornment: { left: '16px' },
                footerText: (0, theme.En)(footerTextColor, themeConfig, styles),
              }
            })(styles, isFocused),
            CVVAdornment = () =>
              (0, jsx_runtime.jsx)('div', {
                style: {
                  ...computedStyles.adornment,
                  ...computedStyles.startAdornment,
                },
                children: (0, jsx_runtime.jsx)('span', { children: '🔒' }),
              })
          return (0, jsx_runtime.jsxs)('div', {
            style: computedStyles.container,
            children: [
              label &&
                (0, jsx_runtime.jsxs)('label', {
                  style: computedStyles.label,
                  children: [
                    label,
                    (null == styles ? void 0 : styles.required) &&
                      (0, jsx_runtime.jsx)('span', {
                        style: (0, theme.sz)(styles),
                        children:
                          (null == styles
                            ? void 0
                            : styles.requiredIndicatorText) || ' *',
                      }),
                  ],
                }),
              (0, jsx_runtime.jsxs)('div', {
                style: computedStyles.inputWrapper,
                children: [
                  (0, jsx_runtime.jsx)(CVVAdornment, {}),
                  (0, jsx_runtime.jsx)('input', {
                    type: 'password',
                    id,
                    value: getDisplayValue(),
                    onChange: handleChange,
                    onFocus: handleFocus,
                    onBlur: handleBlur,
                    disabled: null == styles ? void 0 : styles.disabled,
                    ...(0, theme.SI)(null == styles ? void 0 : styles.required),
                    placeholder,
                    maxLength,
                    autoComplete: 'cc-csc',
                    style: computedStyles.input,
                    ...props,
                  }),
                ],
              }),
              helperText &&
                (0, jsx_runtime.jsx)('div', {
                  style: computedStyles.footerText,
                  children: helperText,
                }),
            ],
          })
        }
        CVV.displayName = 'CVV'
        const Number_CVV = CVV
        CVV.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'CVV',
          props: {
            onChange: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(value: string, isValid: boolean) => void',
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'value' },
                    { type: { name: 'boolean' }, name: 'isValid' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            minLength: {
              required: !1,
              tsType: { name: 'number' },
              description: '',
              defaultValue: { value: '3', computed: !1 },
            },
            maxLength: {
              required: !1,
              tsType: { name: 'number' },
              description: '',
              defaultValue: { value: '4', computed: !1 },
            },
            isDefaultValue: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
            value: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "''", computed: !1 },
            },
            label: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "'CVV'", computed: !1 },
            },
            placeholder: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "'123'", computed: !1 },
            },
            id: { required: !1, tsType: { name: 'string' }, description: '' },
            onFocus: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(e: React.FocusEvent<HTMLInputElement>) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactFocusEvent',
                        raw: 'React.FocusEvent<HTMLInputElement>',
                        elements: [{ name: 'HTMLInputElement' }],
                      },
                      name: 'e',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onBlur: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(e: React.FocusEvent<HTMLInputElement>) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactFocusEvent',
                        raw: 'React.FocusEvent<HTMLInputElement>',
                        elements: [{ name: 'HTMLInputElement' }],
                      },
                      name: 'e',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            helperText: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'FormFieldStyles' },
              description: '',
            },
          },
        }
        const CVV_stories = {
            title: 'Components/Field/Number/CVV',
            component: Number_CVV,
            argTypes: {
              styles: { control: 'object' },
              label: { control: 'text' },
              helperText: { control: 'text' },
              isDefaultValue: { control: 'boolean' },
              minLength: { control: 'number' },
              maxLength: { control: 'number' },
              placeholder: { control: 'text' },
            },
            parameters: { layout: 'centered' },
          },
          PremiumTheme = {
            name: 'Premium Theme',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                style: {
                  width: '400px',
                  padding: '2rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                },
                children: (0, jsx_runtime.jsx)(Number_CVV, { ...args }),
              }),
            args: {
              label: 'CVV',
              placeholder: '123',
              styles: { theme: 'light' },
            },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                style: {
                  width: '400px',
                  padding: '2rem',
                  backgroundColor: '#000',
                  borderRadius: '8px',
                },
                children: (0, jsx_runtime.jsx)(Number_CVV, { ...args }),
              }),
            args: { ...PremiumTheme.args, styles: { theme: 'sacred' } },
          },
          InteractiveCVVDemo = () => {
            const [sacredtheme, setsacredtheme] = react.useState(!1),
              [disabled, setDisabled] = react.useState(!1),
              [isDefault, setIsDefault] = react.useState(!0),
              [value, setValue] = react.useState('123'),
              [isValid, setIsValid] = react.useState(!0)
            return (0, jsx_runtime.jsxs)('div', {
              style: {
                width: '500px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              },
              children: [
                (0, jsx_runtime.jsxs)('div', {
                  style: {
                    padding: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                  },
                  children: [
                    (0, jsx_runtime.jsx)('h3', {
                      style: { fontWeight: 'bold', marginBottom: '0.5rem' },
                      children: 'Controls',
                    }),
                    (0, jsx_runtime.jsxs)('div', {
                      style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.5rem',
                      },
                      children: [
                        (0, jsx_runtime.jsxs)('label', {
                          children: [
                            (0, jsx_runtime.jsx)('input', {
                              type: 'checkbox',
                              checked: sacredtheme,
                              onChange: e => setsacredtheme(e.target.checked),
                            }),
                            'Sacred',
                          ],
                        }),
                        (0, jsx_runtime.jsxs)('label', {
                          children: [
                            (0, jsx_runtime.jsx)('input', {
                              type: 'checkbox',
                              checked: disabled,
                              onChange: e => setDisabled(e.target.checked),
                            }),
                            'Disabled',
                          ],
                        }),
                        (0, jsx_runtime.jsxs)('label', {
                          children: [
                            (0, jsx_runtime.jsx)('input', {
                              type: 'checkbox',
                              checked: isDefault,
                              onChange: e => setIsDefault(e.target.checked),
                            }),
                            'Is Default Value',
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, jsx_runtime.jsx)('div', {
                  style: {
                    padding: '2rem',
                    borderRadius: '8px',
                    backgroundColor: sacredtheme ? 'black' : '#f9fafb',
                  },
                  children: (0, jsx_runtime.jsx)(Number_CVV, {
                    label: 'Interactive CVV',
                    value,
                    onChange: (val, valid) => {
                      ;(setValue(val), setIsValid(valid))
                    },
                    styles: {
                      theme: sacredtheme ? 'sacred' : 'light',
                      disabled,
                    },
                    isDefaultValue: isDefault,
                    helperText: isValid ? void 0 : 'Invalid CVV',
                  }),
                }),
              ],
            })
          },
          InteractiveDemo = {
            name: 'Interactive Demo',
            render: () => (0, jsx_runtime.jsx)(InteractiveCVVDemo, {}),
          },
          __namedExportsOrder = [
            'PremiumTheme',
            'SacredTheme',
            'InteractiveDemo',
          ]
      },
    },
  ]
)
