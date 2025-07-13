;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [468],
    {
      './node_modules/@storybook/instrumenter/dist sync recursive': module => {
        function webpackEmptyContext(req) {
          var e = new Error("Cannot find module '" + req + "'")
          throw ((e.code = 'MODULE_NOT_FOUND'), e)
        }
        ;((webpackEmptyContext.keys = () => []),
          (webpackEmptyContext.resolve = webpackEmptyContext),
          (webpackEmptyContext.id =
            './node_modules/@storybook/instrumenter/dist sync recursive'),
          (module.exports = webpackEmptyContext))
      },
      './node_modules/@storybook/test/dist sync recursive': module => {
        function webpackEmptyContext(req) {
          var e = new Error("Cannot find module '" + req + "'")
          throw ((e.code = 'MODULE_NOT_FOUND'), e)
        }
        ;((webpackEmptyContext.keys = () => []),
          (webpackEmptyContext.resolve = webpackEmptyContext),
          (webpackEmptyContext.id =
            './node_modules/@storybook/test/dist sync recursive'),
          (module.exports = webpackEmptyContext))
      },
      './src/components/Field/PhoneNumber/phonenumberfield.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        'use strict'
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            ComprehensiveShowcase: () => ComprehensiveShowcase,
            CustomColors: () => CustomColors,
            CustomLayout: () => CustomLayout,
            CustomTypography: () => CustomTypography,
            DarkTheme: () => DarkTheme,
            DisabledStates: () => DisabledStates,
            ErrorStates: () => ErrorStates,
            InteractionTest: () => InteractionTest,
            LightTheme: () => LightTheme,
            NeonStyle: () => NeonStyle,
            RequiredFields: () => RequiredFields,
            SacredTheme: () => SacredTheme,
            ValidationDemo: () => ValidationDemo,
            __namedExportsOrder: () => __namedExportsOrder,
            default: () => phonenumberfield_stories,
          }))
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          dist = __webpack_require__(
            './node_modules/@storybook/test/dist/index.mjs'
          ),
          theme = __webpack_require__('./src/theme/index.ts')
        const formatPhoneNumber = inputValue => {
            const limitedDigits = inputValue
              .replace(/\D/g, '')
              .replace(/^1/, '')
              .slice(0, 10)
            let formattedNumber = '+1 '
            return (
              limitedDigits.length > 0 &&
                ((formattedNumber += limitedDigits.slice(0, 3)),
                limitedDigits.length > 3 &&
                  ((formattedNumber += '-' + limitedDigits.slice(3, 6)),
                  limitedDigits.length > 6 &&
                    (formattedNumber += '-' + limitedDigits.slice(6)))),
              formattedNumber
            )
          },
          parseExistingPhoneNumber = value => {
            if (!value) return '+1 '
            if (value.includes('+1')) {
              const digits = value.replace(/\D/g, '').replace(/^1/, '')
              return formatPhoneNumber(digits)
            }
            return formatPhoneNumber(value)
          },
          PhoneNumberField = react.memo(props => {
            const {
                label = 'Phone Number',
                placeholder,
                onChange,
                onFocus,
                onBlur,
                value = '',
                helperText,
                id,
                styles,
                ...restProps
              } = props,
              [phoneNumber, setPhoneNumber] = (0, react.useState)(() =>
                parseExistingPhoneNumber(String(value || ''))
              ),
              [isFocused, setIsFocused] = (0, react.useState)(!1)
            ;(0, react.useEffect)(() => {
              setPhoneNumber(parseExistingPhoneNumber(String(value || '')))
            }, [value])
            const sacredtheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              {
                themeConfig,
                borderColor,
                labelColor,
                adornmentColor,
                footerTextColor,
                transition,
              } = (0, theme.AW)(styles, isFocused),
              componentStyles = {
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
                  paddingRight: sacredtheme ? '48px' : '16px',
                  fontSize:
                    (null == styles ? void 0 : styles.fontSize) || '16px',
                  fontWeight: null == styles ? void 0 : styles.fontWeight,
                  lineHeight: null == styles ? void 0 : styles.lineHeight,
                  fontFamily: themeConfig.fontFamily,
                  color: 'inherit',
                  boxSizing: 'border-box',
                },
                label: (0, theme.Wh)(labelColor, themeConfig),
                endAdornment: (0, theme.EK)(adornmentColor),
                footerText: (0, theme.En)(footerTextColor, themeConfig, styles),
              },
              handleChange = (0, react.useCallback)(
                e => {
                  const input = e.target.value
                  if ('+1 ' === input || '+1' === input || '+' === input)
                    return (
                      setPhoneNumber('+1 '),
                      void (onChange && onChange('+1 '))
                    )
                  let strippedInput = input
                    .replace(/^\+1\s?/, '')
                    .replace(/\D/g, '')
                    .slice(0, 10)
                  const formattedValue = formatPhoneNumber(strippedInput)
                  ;(setPhoneNumber(formattedValue),
                    onChange && onChange(formattedValue))
                },
                [onChange]
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
              endAdornment = (0, react.useMemo)(
                () =>
                  sacredtheme
                    ? (0, jsx_runtime.jsx)('span', {
                        style: componentStyles.endAdornment,
                        children: '𓋴',
                      })
                    : null,
                [sacredtheme, componentStyles.endAdornment]
              )
            return (0, jsx_runtime.jsxs)('div', {
              style: componentStyles.container,
              children: [
                label &&
                  (0, jsx_runtime.jsxs)('label', {
                    style: componentStyles.label,
                    children: [
                      sacredtheme ? 'Sacred Connection' : label,
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
                  style: componentStyles.inputWrapper,
                  children: [
                    (0, jsx_runtime.jsx)('input', {
                      ...restProps,
                      ...(0, theme.SI)(
                        null == styles ? void 0 : styles.required
                      ),
                      type: 'tel',
                      id,
                      value: phoneNumber,
                      disabled: null == styles ? void 0 : styles.disabled,
                      onChange: handleChange,
                      onFocus: handleFocus,
                      onBlur: handleBlur,
                      placeholder: sacredtheme
                        ? 'Divine number...'
                        : placeholder,
                      style: componentStyles.input,
                    }),
                    endAdornment &&
                      (0, jsx_runtime.jsx)('div', {
                        style: {
                          ...componentStyles.endAdornment,
                          right: '16px',
                        },
                        children: endAdornment,
                      }),
                  ],
                }),
                helperText &&
                  (0, jsx_runtime.jsx)('div', {
                    style: componentStyles.footerText,
                    children: helperText,
                  }),
              ],
            })
          })
        PhoneNumberField.displayName = 'PhoneNumberField'
        const PhoneNumber = PhoneNumberField
        PhoneNumberField.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'PhoneNumberField',
          props: {
            value: {
              required: !1,
              tsType: {
                name: 'union',
                raw: 'string | number',
                elements: [{ name: 'string' }, { name: 'number' }],
              },
              description: '',
            },
            onChange: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(value: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'value' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            label: {
              required: !1,
              tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
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
            onFocus: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.FocusEvent<HTMLInputElement>) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactFocusEvent',
                        raw: 'React.FocusEvent<HTMLInputElement>',
                        elements: [{ name: 'HTMLInputElement' }],
                      },
                      name: 'event',
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
                raw: '(event: React.FocusEvent<HTMLInputElement>) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactFocusEvent',
                        raw: 'React.FocusEvent<HTMLInputElement>',
                        elements: [{ name: 'HTMLInputElement' }],
                      },
                      name: 'event',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onKeyDown: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.KeyboardEvent<HTMLInputElement>) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactKeyboardEvent',
                        raw: 'React.KeyboardEvent<HTMLInputElement>',
                        elements: [{ name: 'HTMLInputElement' }],
                      },
                      name: 'event',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onClick: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.MouseEvent<HTMLInputElement>) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactMouseEvent',
                        raw: 'React.MouseEvent<HTMLInputElement>',
                        elements: [{ name: 'HTMLInputElement' }],
                      },
                      name: 'event',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            placeholder: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            id: { required: !1, tsType: { name: 'string' }, description: '' },
            autoComplete: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
          },
        }
        const PhoneNumberFieldWithState = ({ initialValue = '', ...props }) => {
            const [value, setValue] = (0, react.useState)(initialValue)
            return (0, jsx_runtime.jsx)(PhoneNumber, {
              ...props,
              value,
              onChange: setValue,
            })
          },
          phonenumberfield_stories = {
            title: 'Components/Field/PhoneNumber',
            component: PhoneNumber,
            parameters: { layout: 'centered' },
            tags: ['autodocs'],
            argTypes: {
              value: { control: 'text' },
              onChange: { action: 'changed' },
              label: { control: 'text' },
              placeholder: { control: 'text' },
              helperText: { control: 'text' },
              styles: {
                control: 'object',
                description:
                  'Comprehensive styling options including theme, colors, layout, and more',
              },
            },
            decorators: [
              Story =>
                (0, jsx_runtime.jsx)('div', {
                  style: { width: '400px', padding: '2rem' },
                  children: (0, jsx_runtime.jsx)(Story, {}),
                }),
            ],
          },
          LightTheme = {
            name: 'Light Theme (Default)',
            render: () =>
              (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                label: 'Phone Number',
                placeholder: '(555) 123-4567',
                styles: { theme: 'light' },
              }),
          },
          DarkTheme = {
            name: 'Dark Theme',
            render: () =>
              (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                label: 'Contact Number',
                placeholder: 'Enter phone number',
                styles: { theme: 'dark' },
              }),
            parameters: { backgrounds: { default: 'dark' } },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: () =>
              (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                label: 'Divine Communication',
                placeholder: 'Sacred contact...',
                styles: { theme: 'sacred' },
              }),
            parameters: { backgrounds: { default: 'dark' } },
          },
          CustomColors = {
            name: 'Custom Colors',
            render: () =>
              (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                label: 'Custom Styled Phone',
                placeholder: '(555) 123-4567',
                styles: {
                  theme: 'light',
                  backgroundColor: 'rgba(240, 248, 255, 0.95)',
                  borderColor: 'rgba(59, 130, 246, 0.4)',
                  borderFocusedColor: 'rgba(59, 130, 246, 1)',
                  textColor: 'rgba(30, 64, 175, 1)',
                  labelColor: 'rgba(30, 64, 175, 0.7)',
                },
              }),
          },
          NeonStyle = {
            name: 'Neon Style',
            render: () =>
              (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                label: 'Neon Phone Input',
                placeholder: '(555) 123-4567',
                styles: {
                  theme: 'dark',
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  borderColor: 'rgba(34, 197, 94, 0.5)',
                  borderFocusedColor: 'rgba(34, 197, 94, 1)',
                  textColor: 'rgba(34, 197, 94, 1)',
                  labelColor: 'rgba(34, 197, 94, 0.7)',
                  borderRadius: '12px',
                  borderWidth: '2px',
                },
              }),
            parameters: { backgrounds: { default: 'dark' } },
          },
          CustomLayout = {
            name: 'Custom Layout & Spacing',
            render: () =>
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                    label: 'Large Padding',
                    placeholder: '(555) 123-4567',
                    styles: {
                      theme: 'light',
                      padding: '24px',
                      borderRadius: '16px',
                      fontSize: '18px',
                    },
                  }),
                  (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                    label: 'Custom Dimensions',
                    placeholder: 'Fixed height',
                    styles: {
                      theme: 'light',
                      height: '60px',
                      width: '100%',
                      borderRadius: '8px',
                    },
                  }),
                  (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                    label: 'Asymmetric Padding',
                    placeholder: 'Different padding sides',
                    styles: {
                      theme: 'light',
                      paddingLeft: '32px',
                      paddingRight: '16px',
                      paddingTop: '20px',
                      paddingBottom: '20px',
                    },
                  }),
                ],
              }),
          },
          CustomTypography = {
            name: 'Custom Typography',
            render: () =>
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                    label: 'Large Text',
                    placeholder: '(555) 123-4567',
                    styles: {
                      theme: 'light',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      lineHeight: '1.5',
                      padding: '20px',
                    },
                  }),
                  (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                    label: 'Custom Font',
                    placeholder: 'Different font family',
                    styles: {
                      theme: 'light',
                      fontFamily: '"Georgia", serif',
                      fontSize: '16px',
                      fontWeight: 400,
                    },
                  }),
                  (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                    label: 'Small & Light',
                    placeholder: '(555) 123-4567',
                    styles: {
                      theme: 'light',
                      fontSize: '14px',
                      fontWeight: 300,
                      padding: '12px',
                    },
                  }),
                ],
              }),
          },
          ErrorStates = {
            name: 'Error States',
            render: () =>
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                    label: 'Phone Number',
                    initialValue: '555-123',
                    error: 'Please enter a valid phone number.',
                    styles: { theme: 'light' },
                  }),
                  (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                    label: 'Contact Number',
                    placeholder: 'This field is required',
                    error: 'Phone number is required.',
                    styles: {
                      theme: 'dark',
                      borderErrorColor: 'rgba(255, 99, 71, 1)',
                      labelErrorColor: 'rgba(255, 99, 71, 1)',
                      footerTextErrorColor: 'rgba(255, 99, 71, 1)',
                    },
                  }),
                  (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                    label: 'Sacred Contact',
                    initialValue: 'invalid-number',
                    error: 'The sacred digits are not aligned.',
                    styles: { theme: 'sacred' },
                  }),
                ],
              }),
          },
          RequiredFields = {
            name: 'Required Fields',
            render: () =>
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                    label: 'Required Phone',
                    placeholder: '(555) 123-4567',
                    required: !0,
                    styles: { theme: 'light' },
                  }),
                  (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                    label: 'Emergency Contact',
                    placeholder: 'Enter emergency contact',
                    required: !0,
                    error: 'This field is required',
                    styles: { theme: 'light' },
                  }),
                  (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                    label: 'Business Phone',
                    placeholder: 'Enter business number',
                    required: !0,
                    styles: { theme: 'dark' },
                  }),
                  (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                    label: 'Custom Required Indicator',
                    placeholder: 'Enter divine number',
                    required: !0,
                    styles: {
                      theme: 'sacred',
                      requiredIndicatorText: ' (required)',
                      requiredIndicatorColor: 'rgba(255, 215, 0, 1)',
                    },
                  }),
                ],
              }),
          },
          ComprehensiveShowcase = {
            name: 'Comprehensive Showcase',
            render: () =>
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2rem',
                  padding: '1rem',
                },
                children: [
                  (0, jsx_runtime.jsxs)('div', {
                    children: [
                      (0, jsx_runtime.jsx)('h3', {
                        style: { margin: '0 0 1rem 0', color: '#374151' },
                        children: 'Light Theme',
                      }),
                      (0, jsx_runtime.jsxs)('div', {
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem',
                        },
                        children: [
                          (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                            label: 'Basic Phone',
                            placeholder: '(555) 123-4567',
                            styles: { theme: 'light' },
                          }),
                          (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                            label: 'Phone Number',
                            initialValue: '555-123',
                            error: 'Invalid format',
                            styles: { theme: 'light' },
                          }),
                          (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                            label: 'Emergency Contact',
                            placeholder: 'Required field',
                            required: !0,
                            styles: { theme: 'light' },
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    children: [
                      (0, jsx_runtime.jsx)('h3', {
                        style: { margin: '0 0 1rem 0', color: '#9CA3AF' },
                        children: 'Dark Theme',
                      }),
                      (0, jsx_runtime.jsxs)('div', {
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem',
                        },
                        children: [
                          (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                            label: 'Basic Dark',
                            placeholder: '(555) 123-4567',
                            styles: { theme: 'dark' },
                          }),
                          (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                            label: 'Custom Colors',
                            placeholder: 'Custom styling',
                            styles: {
                              theme: 'dark',
                              borderFocusedColor: 'rgba(34, 197, 94, 1)',
                              labelColor: 'rgba(34, 197, 94, 0.8)',
                            },
                          }),
                          (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                            label: 'Large Size',
                            placeholder: '(555) 123-4567',
                            styles: {
                              theme: 'dark',
                              fontSize: '18px',
                              padding: '20px',
                              borderRadius: '12px',
                            },
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    children: [
                      (0, jsx_runtime.jsx)('h3', {
                        style: { margin: '0 0 1rem 0', color: '#FFD700' },
                        children: 'Sacred Theme',
                      }),
                      (0, jsx_runtime.jsxs)('div', {
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem',
                        },
                        children: [
                          (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                            label: 'Divine Contact',
                            placeholder: 'Sacred numbers',
                            styles: { theme: 'sacred' },
                          }),
                          (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                            label: 'Sacred Phone',
                            initialValue: 'forbidden',
                            error: 'Invalid sacred digits',
                            styles: { theme: 'sacred' },
                          }),
                          (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                            label: 'Holy Number',
                            placeholder: 'Enter divine digits',
                            styles: {
                              theme: 'sacred',
                              borderRadius: '16px',
                              padding: '18px',
                            },
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    children: [
                      (0, jsx_runtime.jsx)('h3', {
                        style: { margin: '0 0 1rem 0', color: '#7C3AED' },
                        children: 'Custom Styling',
                      }),
                      (0, jsx_runtime.jsxs)('div', {
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1rem',
                        },
                        children: [
                          (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                            label: 'Neon Style',
                            placeholder: '(555) 123-4567',
                            styles: {
                              theme: 'dark',
                              backgroundColor: 'rgba(0, 0, 0, 0.95)',
                              borderColor: 'rgba(147, 51, 234, 0.5)',
                              borderFocusedColor: 'rgba(147, 51, 234, 1)',
                              textColor: 'rgba(147, 51, 234, 1)',
                              labelColor: 'rgba(147, 51, 234, 0.8)',
                              borderRadius: '20px',
                              borderWidth: '2px',
                            },
                          }),
                          (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                            label: 'Soft Rounded',
                            placeholder: '(555) 123-4567',
                            styles: {
                              theme: 'light',
                              backgroundColor: 'rgba(249, 250, 251, 1)',
                              borderColor: 'rgba(209, 213, 219, 1)',
                              borderFocusedColor: 'rgba(59, 130, 246, 1)',
                              borderRadius: '24px',
                              padding: '16px 24px',
                            },
                          }),
                          (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                            label: 'Minimal',
                            placeholder: '(555) 123-4567',
                            styles: {
                              theme: 'light',
                              backgroundColor: 'rgba(255, 255, 255, 1)',
                              borderColor: 'rgba(0, 0, 0, 0.1)',
                              borderFocusedColor: 'rgba(0, 0, 0, 0.3)',
                              borderRadius: '0px',
                              borderWidth: '0px 0px 2px 0px',
                              padding: '12px 0px',
                            },
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            parameters: {
              layout: 'fullscreen',
              backgrounds: { default: 'light' },
            },
          },
          DisabledStates = {
            name: 'Disabled States',
            render: () =>
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                    label: 'Disabled Light',
                    initialValue: '(555) 123-4567',
                    disabled: !0,
                    styles: { theme: 'light' },
                  }),
                  (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                    label: 'Disabled Dark',
                    initialValue: '(555) 123-4567',
                    disabled: !0,
                    styles: { theme: 'dark' },
                  }),
                  (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                    label: 'Disabled Sacred',
                    initialValue: '(555) 123-4567',
                    disabled: !0,
                    styles: { theme: 'sacred' },
                  }),
                ],
              }),
          },
          PhoneValidationDemo = () => {
            const [phone, setPhone] = (0, react.useState)(''),
              [error, setError] = (0, react.useState)(''),
              validatePhone = value => {
                '' === value.trim()
                  ? setError('Phone number is required')
                  : /^\(\d{3}\) \d{3}-\d{4}$/.test(value)
                    ? setError('')
                    : setError(
                        'Please enter a valid phone number format: (555) 123-4567'
                      )
              }
            return (0, jsx_runtime.jsxs)('div', {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                width: '400px',
              },
              children: [
                (0, jsx_runtime.jsx)('h3', {
                  style: { margin: '0 0 1rem 0' },
                  children: 'Phone Number Validation',
                }),
                (0, jsx_runtime.jsx)(PhoneNumber, {
                  label: 'Phone Number',
                  placeholder: '(555) 123-4567',
                  value: phone,
                  onChange: value => {
                    ;(setPhone(value), error && validatePhone(value))
                  },
                  helperText: error,
                  styles: { theme: 'light', required: !0 },
                }),
                (0, jsx_runtime.jsx)('button', {
                  onClick: () => {
                    ;(validatePhone(phone),
                      '' === error &&
                        '' !== phone.trim() &&
                        alert('Phone number validated successfully!'))
                  },
                  style: {
                    padding: '12px 24px',
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '500',
                  },
                  children: 'Validate Phone',
                }),
                (0, jsx_runtime.jsx)('p', {
                  style: { fontSize: '14px', color: '#6B7280' },
                  children:
                    'Enter a phone number in the format (555) 123-4567 to see validation in action.',
                }),
              ],
            })
          },
          ValidationDemo = {
            name: 'Validation Demo',
            render: () => (0, jsx_runtime.jsx)(PhoneValidationDemo, {}),
          },
          InteractionTest = {
            name: 'Interaction Test',
            render: () =>
              (0, jsx_runtime.jsx)(PhoneNumberFieldWithState, {
                label: 'Test Phone Input',
                placeholder: '(555) 123-4567',
                styles: { theme: 'light' },
              }),
            play: async ({ canvasElement }) => {
              const canvas = (0, dist.ux)(canvasElement),
                input = canvas.getByPlaceholderText('(555) 123-4567'),
                label = canvas.getByText('Test Phone Input')
              ;((0, dist.E3)(label).toBeVisible(),
                (0, dist.E3)(input).toBeVisible(),
                await dist.Q4.click(input),
                await dist.Q4.type(input, '5551234567', { delay: 50 }),
                await (0, dist.E3)(input).toHaveValue('(555) 123-4567'))
            },
          },
          __namedExportsOrder = [
            'LightTheme',
            'DarkTheme',
            'SacredTheme',
            'CustomColors',
            'NeonStyle',
            'CustomLayout',
            'CustomTypography',
            'ErrorStates',
            'RequiredFields',
            'ComprehensiveShowcase',
            'DisabledStates',
            'ValidationDemo',
            'InteractionTest',
          ]
      },
    },
  ]
)
