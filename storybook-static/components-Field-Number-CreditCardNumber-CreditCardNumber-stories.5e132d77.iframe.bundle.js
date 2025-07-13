'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [7508],
    {
      './src/components/Field/Number/CreditCardNumber/CreditCardNumber.stories.tsx':
        (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
          ;(__webpack_require__.r(__webpack_exports__),
            __webpack_require__.d(__webpack_exports__, {
              InteractiveDemo: () => InteractiveDemo,
              PremiumTheme: () => PremiumTheme,
              SacredTheme: () => SacredTheme,
              __namedExportsOrder: () => __namedExportsOrder,
              default: () => CreditCardNumber_stories,
            }))
          var jsx_runtime = __webpack_require__(
              './node_modules/next/dist/compiled/react/jsx-runtime.js'
            ),
            react = __webpack_require__(
              './node_modules/next/dist/compiled/react/index.js'
            ),
            theme = __webpack_require__('./src/theme/index.ts')
          const cardPatterns = [
              {
                type: 'amex',
                pattern: /^3[47]/,
                length: [15],
                format: /(\d{4})(\d{6})(\d{5})/,
              },
              {
                type: 'visa',
                pattern: /^4/,
                length: [16, 18, 19],
                format: /(\d{4})(\d{4})(\d{4})(\d{4})/,
              },
              {
                type: 'mastercard',
                pattern: /^5[1-5]|^222[1-9]|^22[3-9]|^2[3-6]|^27[0-1]|^2720/,
                length: [16],
                format: /(\d{4})(\d{4})(\d{4})(\d{4})/,
              },
              {
                type: 'discover',
                pattern: /^6(?:011|5)/,
                length: [16],
                format: /(\d{4})(\d{4})(\d{4})(\d{4})/,
              },
              {
                type: 'dinersclub',
                pattern: /^3(?:0[0-5]|[68])/,
                length: [14],
                format: /(\d{4})(\d{6})(\d{4})/,
              },
              {
                type: 'jcb',
                pattern: /^35/,
                length: [16],
                format: /(\d{4})(\d{4})(\d{4})(\d{4})/,
              },
            ],
            CreditCardNumber = ({
              onChange,
              value = '',
              useLuhnValidation = !0,
              isDefaultValue = !1,
              enableFormatting = !0,
              label = 'Card Number',
              placeholder = '1234 5678 9012 3456',
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
                detectCardType = (0, react.useCallback)(cardNumber => {
                  const cleanNumber = cardNumber.replace(/\D/g, '')
                  for (const pattern of cardPatterns)
                    if (pattern.pattern.test(cleanNumber)) return pattern.type
                  return 'unknown'
                }, []),
                validateLuhn = (0, react.useCallback)(cardNumber => {
                  const cleanNumber = cardNumber.replace(/\D/g, '')
                  if (cleanNumber.length < 13) return !1
                  let sum = 0,
                    isEven = !1
                  for (let i = cleanNumber.length - 1; i >= 0; i--) {
                    let digit = parseInt(cleanNumber[i])
                    ;(isEven && ((digit *= 2), digit > 9 && (digit -= 9)),
                      (sum += digit),
                      (isEven = !isEven))
                  }
                  return sum % 10 == 0
                }, []),
                validateCreditCard = (0, react.useCallback)(
                  cardNumber => {
                    const cleanNumber = cardNumber.replace(/\D/g, '')
                    if ('' === cleanNumber) return !0
                    if (!/^\d+$/.test(cleanNumber)) return !1
                    const detectedType = detectCardType(cleanNumber),
                      pattern = cardPatterns.find(p => p.type === detectedType)
                    if (pattern) {
                      if (!pattern.length.includes(cleanNumber.length))
                        return !1
                    } else if (
                      cleanNumber.length < 13 ||
                      cleanNumber.length > 19
                    )
                      return !1
                    return !useLuhnValidation || validateLuhn(cleanNumber)
                  },
                  [detectCardType, useLuhnValidation, validateLuhn]
                ),
                formatInput = (0, react.useCallback)(
                  input => {
                    const cleanNumber = input.replace(/\D/g, '')
                    if (!enableFormatting) return cleanNumber
                    const detectedType = detectCardType(cleanNumber),
                      pattern = cardPatterns.find(p => p.type === detectedType)
                    if (pattern && cleanNumber.length >= 4) {
                      const match = cleanNumber.match(pattern.format)
                      if (match) return match.slice(1).join(' ').trim()
                    }
                    return cleanNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
                  },
                  [detectCardType, enableFormatting]
                ),
                maskCreditCard = (0, react.useCallback)(
                  cardNumber => {
                    const cleanNumber = cardNumber.replace(/\D/g, '')
                    if (!cleanNumber || cleanNumber.length < 8)
                      return cardNumber
                    const firstFour = cleanNumber.slice(0, 4),
                      lastFour = cleanNumber.slice(-4),
                      maskedNumber =
                        firstFour +
                        '*'.repeat(Math.max(0, cleanNumber.length - 8)) +
                        lastFour
                    return enableFormatting
                      ? formatInput(maskedNumber)
                      : maskedNumber
                  },
                  [enableFormatting, formatInput]
                ),
                getDisplayValue = (0, react.useCallback)(
                  () =>
                    isDefaultValue &&
                    !isFocused &&
                    !hasBeenEdited &&
                    internalValue
                      ? maskCreditCard(internalValue)
                      : internalValue,
                  [
                    isDefaultValue,
                    isFocused,
                    hasBeenEdited,
                    internalValue,
                    maskCreditCard,
                  ]
                )
              ;(0, react.useEffect)(() => {
                const formattedValue = formatInput(value || '')
                setInternalValue(formattedValue)
              }, [value, formatInput])
              const handleChange = (0, react.useCallback)(
                  e => {
                    const rawValue = e.target.value,
                      formattedValue = formatInput(rawValue).slice(0, 23)
                    ;(setInternalValue(formattedValue), setHasBeenEdited(!0))
                    const detectedType = detectCardType(formattedValue),
                      valid = validateCreditCard(formattedValue)
                    null == onChange ||
                      onChange(
                        formattedValue.replace(/\D/g, ''),
                        valid,
                        detectedType
                      )
                  },
                  [onChange, validateCreditCard, formatInput, detectCardType]
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
                getCardIcon = (0, react.useCallback)(
                  () =>
                    'sacred' === (null == styles ? void 0 : styles.theme)
                      ? '𓊪'
                      : '💳',
                  [null == styles ? void 0 : styles.theme]
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
                      height:
                        (null == styles ? void 0 : styles.height) || '40px',
                      width: '100%',
                      border: `${(null == styles ? void 0 : styles.borderWidth) || '1px'} solid ${borderColor}`,
                      borderRadius:
                        (null == styles ? void 0 : styles.borderRadius) ||
                        '8px',
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
                        (null == styles ? void 0 : styles.padding) ||
                        '8px 16px',
                      paddingLeft:
                        (null == styles ? void 0 : styles.paddingLeft) ||
                        '48px',
                      paddingRight:
                        (null == styles ? void 0 : styles.paddingRight) ||
                        '16px',
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
                    footerText: (0, theme.En)(
                      footerTextColor,
                      themeConfig,
                      styles
                    ),
                  }
                })(styles, isFocused),
                CardAdornment = () =>
                  (0, jsx_runtime.jsx)('div', {
                    style: {
                      ...computedStyles.adornment,
                      ...computedStyles.startAdornment,
                    },
                    children: (0, jsx_runtime.jsx)('span', {
                      children: getCardIcon(),
                    }),
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
                      (0, jsx_runtime.jsx)(CardAdornment, {}),
                      (0, jsx_runtime.jsx)('input', {
                        type: 'text',
                        inputMode: 'numeric',
                        id,
                        value: getDisplayValue(),
                        onChange: handleChange,
                        onFocus: handleFocus,
                        onBlur: handleBlur,
                        disabled: null == styles ? void 0 : styles.disabled,
                        ...(0, theme.SI)(
                          null == styles ? void 0 : styles.required
                        ),
                        placeholder,
                        maxLength: 23,
                        autoComplete: 'cc-number',
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
          CreditCardNumber.displayName = 'CreditCardNumber'
          const Number_CreditCardNumber = CreditCardNumber
          CreditCardNumber.__docgenInfo = {
            description: '',
            methods: [],
            displayName: 'CreditCardNumber',
            props: {
              onChange: {
                required: !1,
                tsType: {
                  name: 'signature',
                  type: 'function',
                  raw: '(value: string, isValid: boolean, cardType: CardType) => void',
                  signature: {
                    arguments: [
                      { type: { name: 'string' }, name: 'value' },
                      { type: { name: 'boolean' }, name: 'isValid' },
                      {
                        type: {
                          name: 'union',
                          raw: "| 'visa'\n| 'mastercard'\n| 'amex'\n| 'discover'\n| 'dinersclub'\n| 'jcb'\n| 'unknown'",
                          elements: [
                            { name: 'literal', value: "'visa'" },
                            { name: 'literal', value: "'mastercard'" },
                            { name: 'literal', value: "'amex'" },
                            { name: 'literal', value: "'discover'" },
                            { name: 'literal', value: "'dinersclub'" },
                            { name: 'literal', value: "'jcb'" },
                            { name: 'literal', value: "'unknown'" },
                          ],
                        },
                        name: 'cardType',
                      },
                    ],
                    return: { name: 'void' },
                  },
                },
                description: '',
              },
              useLuhnValidation: {
                required: !1,
                tsType: { name: 'boolean' },
                description: '',
                defaultValue: { value: 'true', computed: !1 },
              },
              isDefaultValue: {
                required: !1,
                tsType: { name: 'boolean' },
                description: '',
                defaultValue: { value: 'false', computed: !1 },
              },
              enableFormatting: {
                required: !1,
                tsType: { name: 'boolean' },
                description: '',
                defaultValue: { value: 'true', computed: !1 },
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
                defaultValue: { value: "'Card Number'", computed: !1 },
              },
              placeholder: {
                required: !1,
                tsType: { name: 'string' },
                description: '',
                defaultValue: { value: "'1234 5678 9012 3456'", computed: !1 },
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
          const CreditCardNumber_stories = {
              title: 'Components/Field/Number/CreditCardNumber',
              component: Number_CreditCardNumber,
              argTypes: {
                styles: { control: 'object' },
                label: { control: 'text' },
                helperText: { control: 'text' },
                isDefaultValue: { control: 'boolean' },
                useLuhnValidation: { control: 'boolean' },
                enableFormatting: { control: 'boolean' },
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
                  children: (0, jsx_runtime.jsx)(Number_CreditCardNumber, {
                    ...args,
                  }),
                }),
              args: {
                label: 'Credit Card Number',
                placeholder: '1234 5678 9012 3456',
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
                  children: (0, jsx_runtime.jsx)(Number_CreditCardNumber, {
                    ...args,
                  }),
                }),
              args: { ...PremiumTheme.args, styles: { theme: 'sacred' } },
            },
            InteractiveDemoComponent = () => {
              const [sacredtheme, setsacredtheme] = react.useState(!1),
                [disabled, setDisabled] = react.useState(!1),
                [isDefault, setIsDefault] = react.useState(!0),
                [value, setValue] = react.useState('4242424242424242'),
                [isValid, setIsValid] = react.useState(!0),
                [cardType, setCardType] = react.useState('unknown')
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
                    children: (0, jsx_runtime.jsx)(Number_CreditCardNumber, {
                      label: 'Interactive Card Number',
                      value,
                      onChange: (val, valid, type) => {
                        ;(setValue(val), setIsValid(valid), setCardType(type))
                      },
                      styles: {
                        theme: sacredtheme ? 'sacred' : 'light',
                        disabled,
                      },
                      isDefaultValue: isDefault,
                      helperText: isValid ? void 0 : 'Invalid card number',
                    }),
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: { color: sacredtheme ? 'white' : 'black' },
                    children: [
                      (0, jsx_runtime.jsxs)('p', {
                        children: ['Card Type: ', cardType],
                      }),
                      (0, jsx_runtime.jsxs)('p', {
                        children: ['Is Valid: ', isValid ? 'Yes' : 'No'],
                      }),
                    ],
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
