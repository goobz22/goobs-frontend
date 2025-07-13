'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [146],
    {
      './src/components/Field/Number/ExternalIncrement/ExternalIncrement.stories.tsx':
        (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
          ;(__webpack_require__.r(__webpack_exports__),
            __webpack_require__.d(__webpack_exports__, {
              InteractiveDemo: () => InteractiveDemo,
              PremiumTheme: () => PremiumTheme,
              SacredTheme: () => SacredTheme,
              __namedExportsOrder: () => __namedExportsOrder,
              default: () => ExternalIncrement_stories,
            }))
          var jsx_runtime = __webpack_require__(
              './node_modules/next/dist/compiled/react/jsx-runtime.js'
            ),
            react = __webpack_require__(
              './node_modules/next/dist/compiled/react/index.js'
            ),
            theme = __webpack_require__('./src/theme/index.ts')
          const IncrementNumberField = ({
              initialValue = '0',
              onChange,
              label,
              helperText,
              styles,
              ...rest
            }) => {
              const [internalValue, setInternalValue] = (0, react.useState)(
                  initialValue
                ),
                [isFocused, setIsFocused] = (0, react.useState)(!1),
                handleIncrement = (0, react.useCallback)(() => {
                  ;(null == styles ? void 0 : styles.disabled) ||
                    setInternalValue(prev => {
                      const num = parseInt(prev, 10),
                        newValue = (isNaN(num) ? 0 : num + 1).toString()
                      return (null == onChange || onChange(), newValue)
                    })
                }, [onChange, null == styles ? void 0 : styles.disabled]),
                handleDecrement = (0, react.useCallback)(() => {
                  ;(null == styles ? void 0 : styles.disabled) ||
                    setInternalValue(prev => {
                      const num = parseInt(prev, 10),
                        newValue = Math.max(
                          0,
                          isNaN(num) ? 0 : num - 1
                        ).toString()
                      return (null == onChange || onChange(), newValue)
                    })
                }, [onChange, null == styles ? void 0 : styles.disabled]),
                handleChange = (0, react.useCallback)(
                  event => {
                    const numValue = event.target.value.replace(/[^0-9]/g, '')
                    ;(setInternalValue('' === numValue ? '0' : numValue),
                      null == onChange || onChange())
                  },
                  [onChange]
                ),
                handleFocus = (0, react.useCallback)(
                  () => setIsFocused(!0),
                  []
                ),
                handleBlur = (0, react.useCallback)(() => setIsFocused(!1), []),
                computedStyles = ((styles, isFocused) => {
                  const {
                      themeConfig,
                      borderColor,
                      labelColor,
                      footerTextColor,
                      transition,
                    } = (0, theme.AW)(styles, isFocused),
                    disabled = null == styles ? void 0 : styles.disabled
                  return {
                    container: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      ...(0, theme.ZZ)(styles),
                    },
                    button: {
                      padding: '4px 12px',
                      border: `1px solid ${borderColor}`,
                      borderRadius:
                        (null == styles ? void 0 : styles.borderRadius) ||
                        '6px',
                      transition,
                      backgroundColor: themeConfig.background,
                      color: themeConfig.text,
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.5 : 1,
                      fontFamily: themeConfig.fontFamily,
                      fontSize:
                        (null == styles ? void 0 : styles.fontSize) || '14px',
                      fontWeight: 500,
                      minWidth: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    inputWrapper: {
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                    },
                    input: {
                      width: '64px',
                      height: '40px',
                      textAlign: 'center',
                      border: `${(null == styles ? void 0 : styles.borderWidth) || '1px'} solid ${borderColor}`,
                      borderRadius:
                        (null == styles ? void 0 : styles.borderRadius) ||
                        '8px',
                      outline: 'none',
                      transition,
                      backgroundColor: themeConfig.background,
                      color: themeConfig.text,
                      opacity: disabled ? 0.5 : 1,
                      fontFamily: themeConfig.fontFamily,
                      fontSize:
                        (null == styles ? void 0 : styles.fontSize) || '16px',
                      fontWeight: null == styles ? void 0 : styles.fontWeight,
                      padding: '8px',
                      boxSizing: 'border-box',
                    },
                    label: (0, theme.Wh)(labelColor, themeConfig),
                    footerText: (0, theme.En)(
                      footerTextColor,
                      themeConfig,
                      styles
                    ),
                  }
                })(styles, isFocused)
              return (0, jsx_runtime.jsxs)('div', {
                style: computedStyles.container,
                children: [
                  (0, jsx_runtime.jsx)('button', {
                    type: 'button',
                    onClick: handleDecrement,
                    disabled: null == styles ? void 0 : styles.disabled,
                    style: computedStyles.button,
                    children: '-',
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: computedStyles.inputWrapper,
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
                      (0, jsx_runtime.jsx)('input', {
                        type: 'text',
                        value: internalValue,
                        onChange: handleChange,
                        onFocus: handleFocus,
                        onBlur: handleBlur,
                        disabled: null == styles ? void 0 : styles.disabled,
                        ...(0, theme.SI)(
                          null == styles ? void 0 : styles.required
                        ),
                        style: computedStyles.input,
                        ...rest,
                      }),
                      helperText &&
                        (0, jsx_runtime.jsx)('div', {
                          style: computedStyles.footerText,
                          children: helperText,
                        }),
                    ],
                  }),
                  (0, jsx_runtime.jsx)('button', {
                    type: 'button',
                    onClick: handleIncrement,
                    disabled: null == styles ? void 0 : styles.disabled,
                    style: computedStyles.button,
                    children: '+',
                  }),
                ],
              })
            },
            ExternalIncrement = IncrementNumberField
          IncrementNumberField.__docgenInfo = {
            description: '',
            methods: [],
            displayName: 'IncrementNumberField',
            props: {
              initialValue: {
                required: !1,
                tsType: { name: 'string' },
                description: '',
                defaultValue: { value: "'0'", computed: !1 },
              },
              onChange: {
                required: !1,
                tsType: {
                  name: 'signature',
                  type: 'function',
                  raw: '() => void',
                  signature: { arguments: [], return: { name: 'void' } },
                },
                description: '',
              },
              label: {
                required: !1,
                tsType: { name: 'string' },
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
            composes: ['Omit'],
          }
          const ExternalIncrement_stories = {
              title: 'Components/Field/Number/ExternalIncrement',
              component: ExternalIncrement,
              argTypes: {
                styles: { control: 'object' },
                label: { control: 'text' },
                helperText: { control: 'text' },
                initialValue: { control: 'text' },
              },
              parameters: { layout: 'centered' },
            },
            PremiumTheme = {
              name: 'Premium Theme',
              render: args =>
                (0, jsx_runtime.jsx)('div', {
                  style: {
                    padding: '2rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                  },
                  children: (0, jsx_runtime.jsx)(ExternalIncrement, {
                    ...args,
                  }),
                }),
              args: { label: 'Quantity', styles: { theme: 'light' } },
            },
            SacredTheme = {
              name: 'Sacred Theme',
              render: args =>
                (0, jsx_runtime.jsx)('div', {
                  style: {
                    padding: '2rem',
                    backgroundColor: '#000',
                    borderRadius: '8px',
                  },
                  children: (0, jsx_runtime.jsx)(ExternalIncrement, {
                    ...args,
                  }),
                }),
              args: { ...PremiumTheme.args, styles: { theme: 'sacred' } },
            },
            InteractiveDemoRenderer = () => {
              const [sacredtheme, setsacredtheme] = react.useState(!1),
                [disabled, setDisabled] = react.useState(!1)
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
                          gridTemplateColumns: 'repeat(2, 1fr)',
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
                        ],
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsx)('div', {
                    style: {
                      padding: '2rem',
                      borderRadius: '8px',
                      backgroundColor: sacredtheme ? 'black' : '#f9fafb',
                      display: 'flex',
                      justifyContent: 'center',
                    },
                    children: (0, jsx_runtime.jsx)(ExternalIncrement, {
                      label: 'Amount',
                      initialValue: '5',
                      onChange: () => {},
                      styles: {
                        theme: sacredtheme ? 'sacred' : 'light',
                        disabled,
                      },
                    }),
                  }),
                ],
              })
            },
            InteractiveDemo = {
              name: 'Interactive Demo',
              render: () => (0, jsx_runtime.jsx)(InteractiveDemoRenderer, {}),
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
