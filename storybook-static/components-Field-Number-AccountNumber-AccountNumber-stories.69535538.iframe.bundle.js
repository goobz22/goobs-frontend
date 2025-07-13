'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [3814],
    {
      './src/components/Field/Number/AccountNumber/AccountNumber.stories.tsx': (
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
            default: () => AccountNumber_stories,
          }))
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          theme = __webpack_require__('./src/theme/index.ts')
        const AccountNumber = ({
          onChange,
          value = '',
          minLength = 8,
          maxLength = 17,
          isDefaultValue = !1,
          label = 'Account Number',
          placeholder,
          id,
          onFocus,
          onBlur,
          helperText,
          styles,
          ...props
        }) => {
          const [internalValue, setInternalValue] = (0, react.useState)(value),
            [isFocused, setIsFocused] = (0, react.useState)(!1),
            [hasBeenEdited, setHasBeenEdited] = (0, react.useState)(!1),
            validateAccountNumber = (0, react.useCallback)(
              accountNumber => {
                const trimmedValue = accountNumber.trim()
                if ('' === trimmedValue) return !0
                const normalizedValue = trimmedValue.replace(/-/g, ''),
                  hasOnlyDigits = /^\d+$/.test(normalizedValue),
                  isValidLength =
                    normalizedValue.length >= minLength &&
                    normalizedValue.length <= maxLength
                return hasOnlyDigits && isValidLength
              },
              [minLength, maxLength]
            ),
            formatInput = (0, react.useCallback)(
              input => input.replace(/[^\d-]/g, ''),
              []
            ),
            maskAccountNumber = (0, react.useCallback)(accountNumber => {
              if (!accountNumber || accountNumber.length < 4)
                return accountNumber
              const lastFour = accountNumber.slice(-4)
              return (
                '*'.repeat(Math.max(0, accountNumber.length - 4)) + lastFour
              )
            }, []),
            getDisplayValue = (0, react.useCallback)(
              () =>
                isDefaultValue && !isFocused && !hasBeenEdited && internalValue
                  ? maskAccountNumber(internalValue)
                  : internalValue,
              [
                isDefaultValue,
                isFocused,
                hasBeenEdited,
                internalValue,
                maskAccountNumber,
              ]
            )
          ;(0, react.useEffect)(() => {
            setInternalValue(value)
          }, [value])
          const handleChange = (0, react.useCallback)(
              e => {
                const rawValue = e.target.value,
                  formattedValue = formatInput(rawValue)
                ;(setInternalValue(formattedValue), setHasBeenEdited(!0))
                const valid = validateAccountNumber(formattedValue)
                null == onChange || onChange(formattedValue, valid)
              },
              [onChange, validateAccountNumber, formatInput]
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
                    (null == styles ? void 0 : styles.paddingLeft) || '40px',
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
            finalPlaceholder =
              'sacred' === (null == styles ? void 0 : styles.theme)
                ? '1234567890'
                : placeholder,
            AccountAdornment = () =>
              (0, jsx_runtime.jsx)('div', {
                style: {
                  ...computedStyles.adornment,
                  ...computedStyles.startAdornment,
                },
                children: (0, jsx_runtime.jsx)('span', { children: '#' }),
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
                  (0, jsx_runtime.jsx)(AccountAdornment, {}),
                  (0, jsx_runtime.jsx)('input', {
                    type: 'text',
                    id,
                    value: getDisplayValue(),
                    onChange: handleChange,
                    onFocus: handleFocus,
                    onBlur: handleBlur,
                    disabled: null == styles ? void 0 : styles.disabled,
                    ...(0, theme.SI)(null == styles ? void 0 : styles.required),
                    placeholder: finalPlaceholder,
                    maxLength: maxLength + 5,
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
        AccountNumber.displayName = 'AccountNumber'
        const Number_AccountNumber = AccountNumber
        AccountNumber.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'AccountNumber',
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
              defaultValue: { value: '8', computed: !1 },
            },
            maxLength: {
              required: !1,
              tsType: { name: 'number' },
              description: '',
              defaultValue: { value: '17', computed: !1 },
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
              defaultValue: { value: "'Account Number'", computed: !1 },
            },
            placeholder: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
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
        const AccountNumber_stories = {
            title: 'Components/Field/Number/AccountNumber',
            component: Number_AccountNumber,
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
                children: (0, jsx_runtime.jsx)(Number_AccountNumber, {
                  ...args,
                }),
              }),
            args: {
              label: 'Account Number',
              placeholder: 'Enter your account number',
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
                children: (0, jsx_runtime.jsx)(Number_AccountNumber, {
                  ...args,
                }),
              }),
            args: { ...PremiumTheme.args, styles: { theme: 'sacred' } },
          },
          InteractiveDemoComponent = () => {
            const [sacredtheme, setsacredtheme] = react.useState(!1),
              [disabled, setDisabled] = react.useState(!1),
              [isDefault, setIsDefault] = react.useState(!0),
              [value, setValue] = react.useState('1234567890'),
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
                  children: (0, jsx_runtime.jsx)(Number_AccountNumber, {
                    label: 'Interactive Account Number',
                    value,
                    onChange: (val, valid) => {
                      ;(setValue(val), setIsValid(valid))
                    },
                    styles: {
                      theme: sacredtheme ? 'sacred' : 'light',
                      disabled,
                    },
                    isDefaultValue: isDefault,
                    helperText: isValid ? void 0 : 'Invalid account number',
                  }),
                }),
              ],
            })
          },
          InteractiveDemo = {
            name: 'Interactive Demo',
            render: () => (0, jsx_runtime.jsx)(InteractiveDemoComponent, {}),
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
