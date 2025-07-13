;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [5672],
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
      './src/components/Field/Password/passwordfield.stories.tsx': (
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
            default: () => passwordfield_stories,
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
          theme = __webpack_require__('./src/theme/index.ts'),
          ShowHideEye = __webpack_require__(
            './src/components/Icons/ShowHideEye.tsx'
          )
        const PasswordField = ({
            label = 'Password',
            placeholder,
            value,
            onChange,
            onFocus,
            onBlur,
            helperText,
            id,
            styles,
            ...rest
          }) => {
            const [passwordVisible, setPasswordVisible] = (0, react.useState)(
                !1
              ),
              [isFocused, setIsFocused] = (0, react.useState)(!1),
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
                      (null == styles ? void 0 : styles.padding) ||
                      '8px 48px 8px 16px',
                    paddingLeft:
                      (null == styles ? void 0 : styles.paddingLeft) || '16px',
                    paddingRight:
                      (null == styles ? void 0 : styles.paddingRight) || '48px',
                    paddingTop:
                      (null == styles ? void 0 : styles.paddingTop) || '8px',
                    paddingBottom:
                      (null == styles ? void 0 : styles.paddingBottom) || '8px',
                    fontSize:
                      (null == styles ? void 0 : styles.fontSize) || '16px',
                    fontWeight: null == styles ? void 0 : styles.fontWeight,
                    lineHeight: null == styles ? void 0 : styles.lineHeight,
                    fontFamily: themeConfig.fontFamily,
                    color: 'inherit',
                    boxSizing: 'border-box',
                  },
                  label: (0, theme.Wh)(labelColor, themeConfig),
                  endAdornment: {
                    ...(0, theme.EK)(adornmentColor),
                    right: '12px',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    padding: 0,
                  },
                  footerText: (0, theme.En)(
                    footerTextColor,
                    themeConfig,
                    styles
                  ),
                }
              })(styles, isFocused),
              togglePasswordVisibility = (0, react.useCallback)(
                () => setPasswordVisible(prev => !prev),
                []
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
              )
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
                    (0, jsx_runtime.jsx)('input', {
                      type: passwordVisible ? 'text' : 'password',
                      id,
                      value,
                      onChange,
                      onFocus: handleFocus,
                      onBlur: handleBlur,
                      disabled: null == styles ? void 0 : styles.disabled,
                      placeholder,
                      style: {
                        ...computedStyles.input,
                        ...((null == styles ? void 0 : styles.disabled) && {
                          opacity: 0.5,
                          cursor: 'not-allowed',
                        }),
                      },
                      ...(0, theme.SI)(
                        null == styles ? void 0 : styles.required
                      ),
                      ...rest,
                    }),
                    (0, jsx_runtime.jsx)('button', {
                      type: 'button',
                      onClick: togglePasswordVisibility,
                      style: computedStyles.endAdornment,
                      disabled: null == styles ? void 0 : styles.disabled,
                      children: (0, jsx_runtime.jsx)(ShowHideEye.A, {
                        visible: passwordVisible,
                        sacredtheme:
                          'sacred' === (null == styles ? void 0 : styles.theme),
                      }),
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
          },
          Password = PasswordField
        PasswordField.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'PasswordField',
          props: {
            label: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "'Password'", computed: !1 },
            },
            placeholder: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            value: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            onChange: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.ChangeEvent<HTMLInputElement>) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactChangeEvent',
                        raw: 'React.ChangeEvent<HTMLInputElement>',
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
            helperText: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            id: { required: !1, tsType: { name: 'string' }, description: '' },
            styles: {
              required: !1,
              tsType: { name: 'FormFieldStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
          },
        }
        const PasswordFieldWithState = ({ initialValue = '', ...props }) => {
            const [value, setValue] = (0, react.useState)(initialValue)
            return (0, jsx_runtime.jsx)(Password, {
              ...props,
              value,
              onChange: event => {
                setValue(event.target.value)
              },
            })
          },
          passwordfield_stories = {
            title: 'Components/Field/Password',
            component: Password,
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
              (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                label: 'Password',
                placeholder: 'Enter your password',
                styles: { theme: 'light' },
              }),
          },
          DarkTheme = {
            name: 'Dark Theme',
            render: () =>
              (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                label: 'Secure Password',
                placeholder: 'Enter secure password',
                styles: { theme: 'dark' },
              }),
            parameters: { backgrounds: { default: 'dark' } },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: () =>
              (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                label: 'Secret Incantation',
                placeholder: 'Enter sacred words...',
                styles: { theme: 'sacred' },
              }),
            parameters: { backgrounds: { default: 'dark' } },
          },
          CustomColors = {
            name: 'Custom Colors',
            render: () =>
              (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                label: 'Custom Styled Password',
                placeholder: 'Enter password',
                styles: {
                  theme: 'light',
                  backgroundColor: 'rgba(255, 235, 238, 0.95)',
                  borderColor: 'rgba(220, 38, 127, 0.4)',
                  borderFocusedColor: 'rgba(220, 38, 127, 1)',
                  textColor: 'rgba(136, 19, 55, 1)',
                  labelColor: 'rgba(136, 19, 55, 0.7)',
                },
              }),
          },
          NeonStyle = {
            name: 'Neon Style',
            render: () =>
              (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                label: 'Neon Password',
                placeholder: 'Enter neon password',
                styles: {
                  theme: 'dark',
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  borderColor: 'rgba(255, 215, 0, 0.5)',
                  borderFocusedColor: 'rgba(255, 215, 0, 1)',
                  textColor: 'rgba(255, 215, 0, 1)',
                  labelColor: 'rgba(255, 215, 0, 0.7)',
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
                  (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                    label: 'Large Padding',
                    placeholder: 'Extra space inside',
                    styles: {
                      theme: 'light',
                      padding: '24px',
                      borderRadius: '16px',
                      fontSize: '18px',
                    },
                  }),
                  (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                    label: 'Custom Dimensions',
                    placeholder: 'Fixed height',
                    styles: {
                      theme: 'light',
                      height: '60px',
                      width: '100%',
                      borderRadius: '8px',
                    },
                  }),
                  (0, jsx_runtime.jsx)(PasswordFieldWithState, {
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
                  (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                    label: 'Large Text',
                    placeholder: 'Bigger password field',
                    styles: {
                      theme: 'light',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      lineHeight: '1.5',
                      padding: '20px',
                    },
                  }),
                  (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                    label: 'Custom Font',
                    placeholder: 'Different font family',
                    styles: {
                      theme: 'light',
                      fontFamily: '"Georgia", serif',
                      fontSize: '16px',
                      fontWeight: 400,
                    },
                  }),
                  (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                    label: 'Small & Light',
                    placeholder: 'Subtle appearance',
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
                  (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                    label: 'Password',
                    initialValue: 'weak',
                    error:
                      'Password is too weak. Must be at least 8 characters.',
                    styles: { theme: 'light' },
                  }),
                  (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                    label: 'Confirm Password',
                    placeholder: 'Confirm your password',
                    error: 'Passwords do not match.',
                    styles: {
                      theme: 'dark',
                      borderErrorColor: 'rgba(255, 99, 71, 1)',
                      labelErrorColor: 'rgba(255, 99, 71, 1)',
                      footerTextErrorColor: 'rgba(255, 99, 71, 1)',
                    },
                  }),
                  (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                    label: 'Sacred Key',
                    initialValue: 'forbidden',
                    error: 'The sacred key is corrupted.',
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
                  (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                    label: 'Required Password',
                    placeholder: 'Enter your password',
                    required: !0,
                    styles: { theme: 'light' },
                  }),
                  (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                    label: 'Current Password',
                    placeholder: 'Enter current password',
                    required: !0,
                    error: 'This field is required',
                    styles: { theme: 'light' },
                  }),
                  (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                    label: 'New Password',
                    placeholder: 'Enter new password',
                    required: !0,
                    styles: { theme: 'dark' },
                  }),
                  (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                    label: 'Custom Required Password',
                    placeholder: 'Enter sacred password',
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
                          (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                            label: 'Basic Password',
                            placeholder: 'Enter password',
                            styles: { theme: 'light' },
                          }),
                          (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                            label: 'Password Field',
                            initialValue: 'weak',
                            error: 'Password too weak',
                            styles: { theme: 'light' },
                          }),
                          (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                            label: 'Required Password',
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
                          (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                            label: 'Basic Dark',
                            placeholder: 'Enter password',
                            styles: { theme: 'dark' },
                          }),
                          (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                            label: 'Custom Colors',
                            placeholder: 'Custom styling',
                            styles: {
                              theme: 'dark',
                              borderFocusedColor: 'rgba(34, 197, 94, 1)',
                              labelColor: 'rgba(34, 197, 94, 0.8)',
                            },
                          }),
                          (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                            label: 'Large Size',
                            placeholder: 'Enter password',
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
                          (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                            label: 'Sacred Key',
                            placeholder: 'Secret incantation',
                            styles: { theme: 'sacred' },
                          }),
                          (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                            label: 'Sacred Password',
                            initialValue: 'forbidden',
                            error: 'Key corrupted',
                            styles: { theme: 'sacred' },
                          }),
                          (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                            label: 'Divine Password',
                            placeholder: 'Enter divine key',
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
                          (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                            label: 'Neon Style',
                            placeholder: 'Enter password',
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
                          (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                            label: 'Soft Rounded',
                            placeholder: 'Enter password',
                            styles: {
                              theme: 'light',
                              backgroundColor: 'rgba(249, 250, 251, 1)',
                              borderColor: 'rgba(209, 213, 219, 1)',
                              borderFocusedColor: 'rgba(59, 130, 246, 1)',
                              borderRadius: '24px',
                              padding: '16px 24px',
                            },
                          }),
                          (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                            label: 'Minimal',
                            placeholder: 'Enter password',
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
                  (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                    label: 'Disabled Light',
                    initialValue: 'cannot-edit',
                    disabled: !0,
                    styles: { theme: 'light' },
                  }),
                  (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                    label: 'Disabled Dark',
                    initialValue: 'locked-password',
                    disabled: !0,
                    styles: { theme: 'dark' },
                  }),
                  (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                    label: 'Disabled Sacred',
                    initialValue: 'sealed-key',
                    disabled: !0,
                    styles: { theme: 'sacred' },
                  }),
                ],
              }),
          },
          PasswordValidationDemo = () => {
            const [password, setPassword] = (0, react.useState)(''),
              [confirmPassword, setConfirmPassword] = (0, react.useState)(''),
              [errors, setErrors] = (0, react.useState)({
                password: '',
                confirmPassword: '',
              }),
              validatePassword = pwd => {
                const hasUpperCase = /[A-Z]/.test(pwd),
                  hasLowerCase = /[a-z]/.test(pwd),
                  hasNumbers = /\d/.test(pwd),
                  hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
                return pwd.length < 8
                  ? 'Password must be at least 8 characters long'
                  : hasUpperCase
                    ? hasLowerCase
                      ? hasNumbers
                        ? hasSpecialChar
                          ? ''
                          : 'Password must contain at least one special character'
                        : 'Password must contain at least one number'
                      : 'Password must contain at least one lowercase letter'
                    : 'Password must contain at least one uppercase letter'
              },
              validateConfirmPassword = (pwd, confirmPwd) =>
                pwd !== confirmPwd ? 'Passwords do not match' : ''
            return (0, jsx_runtime.jsxs)('div', {
              style: { display: 'flex', flexDirection: 'column', gap: '1rem' },
              children: [
                (0, jsx_runtime.jsx)(Password, {
                  label: 'Password',
                  placeholder: 'Enter your password',
                  value: password,
                  onChange: event => {
                    const newPassword = event.target.value
                    ;(setPassword(newPassword),
                      setErrors(prev => ({
                        ...prev,
                        password: validatePassword(newPassword),
                        confirmPassword: validateConfirmPassword(
                          newPassword,
                          confirmPassword
                        ),
                      })))
                  },
                  helperText: errors.password,
                  styles: { theme: 'light', required: !0 },
                }),
                (0, jsx_runtime.jsx)(Password, {
                  label: 'Confirm Password',
                  placeholder: 'Confirm your password',
                  value: confirmPassword,
                  onChange: event => {
                    const newConfirmPassword = event.target.value
                    ;(setConfirmPassword(newConfirmPassword),
                      setErrors(prev => ({
                        ...prev,
                        confirmPassword: validateConfirmPassword(
                          password,
                          newConfirmPassword
                        ),
                      })))
                  },
                  helperText: errors.confirmPassword,
                  styles: { theme: 'light', required: !0 },
                }),
                (0, jsx_runtime.jsx)('button', {
                  onClick: () => {
                    const passwordError = validatePassword(password),
                      confirmPasswordError = validateConfirmPassword(
                        password,
                        confirmPassword
                      )
                    setErrors({
                      password: passwordError,
                      confirmPassword: confirmPasswordError,
                    })
                  },
                  style: {
                    padding: '12px 24px',
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  },
                  children: 'Validate',
                }),
              ],
            })
          },
          ValidationDemo = {
            name: 'Validation Demo',
            render: () => (0, jsx_runtime.jsx)(PasswordValidationDemo, {}),
          },
          InteractionTest = {
            name: 'Interaction Test',
            render: () =>
              (0, jsx_runtime.jsx)(PasswordFieldWithState, {
                label: 'Test Password Input',
                placeholder: 'Enter password for testing',
                styles: { theme: 'light' },
              }),
            play: async ({ canvasElement }) => {
              const canvas = (0, dist.ux)(canvasElement),
                input = canvas.getByPlaceholderText(
                  'Enter password for testing'
                ),
                label = canvas.getByText('Test Password Input')
              ;((0, dist.E3)(label).toBeVisible(),
                (0, dist.E3)(input).toBeVisible(),
                (0, dist.E3)(input).toHaveAttribute('type', 'password'),
                await dist.Q4.click(input),
                await dist.Q4.type(input, 'SecurePassword123!', { delay: 50 }),
                await (0, dist.E3)(input).toHaveValue('SecurePassword123!'))
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
      './src/components/Icons/ShowHideEye.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        'use strict'
        __webpack_require__.d(__webpack_exports__, {
          A: () => __WEBPACK_DEFAULT_EXPORT__,
        })
        var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ =
            __webpack_require__(
              './node_modules/next/dist/compiled/react/jsx-runtime.js'
            ),
          react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          )
        const SACRED_GLYPHS = [
            '𓁟',
            '𓂀',
            '𓃀',
            '𓄿',
            '𓊖',
            '𓊗',
            '𓋴',
            '𓏏',
            '𓊨',
            '𓁦',
            '𓅓',
            '𓆄',
            '𓇳',
            '𓈖',
            '𓊹',
            '𓊺',
            '𓊻',
            '𓋹',
            '𓌻',
            '𓍿',
            '𓅨',
            '𓂋',
            '𓏭',
            '𓊵',
          ],
          premiumStyles = {
            icon: {
              width: '16px',
              height: '16px',
              color: 'rgb(75, 85, 99)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
            },
            iconHover: {
              transform: 'scale(1.05)',
              filter: 'drop-shadow(0 2px 4px rgba(75, 85, 99, 0.3))',
              color: 'rgb(55, 65, 81)',
            },
          },
          sacredStyles = {
            icon: {
              width: '16px',
              height: '16px',
              color: 'rgba(255, 215, 0, 0.9)',
              transition: 'all 0.4s ease',
              filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))',
              fontFamily:
                'Segoe UI Historic, Noto Sans Egyptian Hieroglyphs, serif',
            },
            iconHover: {
              transform: 'scale(1.1) rotate(5deg)',
              filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
              color: '#FFD700',
              fontFamily:
                'Segoe UI Historic, Noto Sans Egyptian Hieroglyphs, serif',
            },
            glyph: {
              position: 'absolute',
              fontSize: '10px',
              color: 'rgba(255, 215, 0, 0.6)',
              transition: 'all 0.3s ease',
              opacity: 0,
              pointerEvents: 'none',
              animation: 'sacredGlyphRotate 20s linear infinite',
              fontFamily:
                'Segoe UI Historic, Noto Sans Egyptian Hieroglyphs, serif',
            },
            glyphVisible: {
              opacity: 1,
              fontFamily:
                'Segoe UI Historic, Noto Sans Egyptian Hieroglyphs, serif',
            },
          },
          ShowHideEyeIcon = ({
            visible = !1,
            sacredtheme = !1,
            style = {},
          }) => {
            const [isHovered, setIsHovered] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
              [glyph] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(
                SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
              )
            ;(0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
              if (sacredtheme) {
                const styleSheet = document.styleSheets[0],
                  keyframes =
                    '\n        @keyframes sacredGlyphRotate {\n          from { transform: rotate(0deg); }\n          to { transform: rotate(360deg); }\n        }\n      '
                try {
                  styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
                } catch (e) {}
              }
            }, [sacredtheme])
            const styles = sacredtheme ? sacredStyles : premiumStyles,
              iconStyle = {
                ...styles.icon,
                ...(isHovered && sacredtheme ? styles.iconHover : {}),
                ...(isHovered && !sacredtheme ? premiumStyles.iconHover : {}),
                ...style,
              }
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: { position: 'relative', display: 'inline-block' },
                onMouseEnter: () => setIsHovered(!0),
                onMouseLeave: () => setIsHovered(!1),
                children: [
                  visible
                    ? sacredtheme
                      ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'div',
                          {
                            style: {
                              ...iconStyle,
                              fontSize: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontFamily:
                                'Segoe UI Historic, Noto Sans Egyptian Hieroglyphs, serif',
                            },
                            children: '𓂀',
                          }
                        )
                      : (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'svg',
                          {
                            style: iconStyle,
                            xmlns: 'http://www.w3.org/2000/svg',
                            viewBox: '0 0 24 24',
                            fill: 'none',
                            stroke: 'currentColor',
                            strokeWidth: '2',
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                'path',
                                {
                                  d: 'M1 12C2.73 16.11 7 20 12 20s9.27-3.89 11-8c-1.73-4.11-6-8-11-8S2.73 7.89 1 12z',
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                'circle',
                                { cx: '12', cy: '12', r: '3' }
                              ),
                            ],
                          }
                        )
                    : sacredtheme
                      ? (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'div',
                          {
                            style: {
                              ...iconStyle,
                              fontSize: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontFamily:
                                'Segoe UI Historic, Noto Sans Egyptian Hieroglyphs, serif',
                              position: 'relative',
                            },
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                'span',
                                { style: { opacity: 0.5 }, children: '𓂀' }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                'div',
                                {
                                  style: {
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform:
                                      'translate(-50%, -50%) rotate(45deg)',
                                    width: '20px',
                                    height: '2px',
                                    backgroundColor: 'currentColor',
                                  },
                                }
                              ),
                            ],
                          }
                        )
                      : (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'svg',
                          {
                            style: iconStyle,
                            xmlns: 'http://www.w3.org/2000/svg',
                            viewBox: '0 0 24 24',
                            fill: 'none',
                            stroke: 'currentColor',
                            strokeWidth: '2',
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                'path',
                                {
                                  d: 'M17.94 17.94A10.06 10.06 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.81 2.01-3.41 3.56-4.69M9.53 9.53A3.001 3.001 0 0 1 12 15a3 3 0 0 1-2.47-5.47',
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                'path',
                                { d: 'M1 1l22 22' }
                              ),
                            ],
                          }
                        ),
                  sacredtheme &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      'div',
                      {
                        style: {
                          ...sacredStyles.glyph,
                          ...(isHovered && sacredStyles.glyphVisible),
                          top: '-6px',
                          right: '-6px',
                        },
                        children: glyph,
                      }
                    ),
                ],
              }
            )
          },
          __WEBPACK_DEFAULT_EXPORT__ = ShowHideEyeIcon
        ShowHideEyeIcon.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ShowHideEyeIcon',
          props: {
            visible: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
            sacredtheme: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
            style: {
              required: !1,
              tsType: {
                name: 'ReactCSSProperties',
                raw: 'React.CSSProperties',
              },
              description: '',
              defaultValue: { value: '{}', computed: !1 },
            },
          },
        }
      },
    },
  ]
)
