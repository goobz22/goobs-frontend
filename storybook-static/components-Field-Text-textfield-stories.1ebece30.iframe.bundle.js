;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [6532],
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
      './src/components/Field/Text/index.tsx': (
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
          ),
          _theme__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
            './src/theme/index.ts'
          )
        const TextField = props => {
          const {
              value,
              onChange,
              onFocus,
              onBlur,
              helperText,
              startAdornment,
              endAdornment,
              label,
              styles,
              ...rest
            } = props,
            [isFocused, setIsFocused] = (0,
            react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
            inputRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),
            computedStyles = (0, react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(
              () =>
                ((styles, isFocused, hasStartAdornment, hasEndAdornment) => {
                  const {
                    themeConfig,
                    borderColor,
                    labelColor,
                    adornmentColor,
                    footerTextColor,
                    transition,
                  } = (0, _theme__WEBPACK_IMPORTED_MODULE_2__.AW)(
                    styles,
                    isFocused
                  )
                  return {
                    container: (0, _theme__WEBPACK_IMPORTED_MODULE_2__.ZZ)(
                      styles
                    ),
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
                        (hasStartAdornment
                          ? (null == styles
                              ? void 0
                              : styles.startAdornmentOffset) || '48px'
                          : '16px'),
                      paddingRight:
                        (null == styles ? void 0 : styles.paddingRight) ||
                        (hasEndAdornment
                          ? (null == styles
                              ? void 0
                              : styles.endAdornmentOffset) || '48px'
                          : '16px'),
                      paddingTop:
                        (null == styles ? void 0 : styles.paddingTop) || '8px',
                      paddingBottom:
                        (null == styles ? void 0 : styles.paddingBottom) ||
                        '8px',
                      fontSize:
                        (null == styles ? void 0 : styles.fontSize) || '16px',
                      fontWeight: null == styles ? void 0 : styles.fontWeight,
                      lineHeight: null == styles ? void 0 : styles.lineHeight,
                      fontFamily: themeConfig.fontFamily,
                      color: 'inherit',
                      boxSizing: 'border-box',
                    },
                    label: (0, _theme__WEBPACK_IMPORTED_MODULE_2__.Wh)(
                      labelColor,
                      themeConfig
                    ),
                    adornment: (0, _theme__WEBPACK_IMPORTED_MODULE_2__.EK)(
                      adornmentColor
                    ),
                    startAdornment: { left: '16px' },
                    endAdornment: { right: '16px' },
                    footerText: (0, _theme__WEBPACK_IMPORTED_MODULE_2__.En)(
                      footerTextColor,
                      themeConfig,
                      styles
                    ),
                  }
                })(styles, isFocused, !!startAdornment, !!endAdornment),
              [styles, isFocused, startAdornment, endAdornment]
            ),
            handleChange = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(
              e => {
                const newValue = e.target.value
                onChange(newValue)
              },
              [onChange]
            ),
            handleFocus = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(
              e => {
                ;(setIsFocused(!0), null == onFocus || onFocus(e))
              },
              [onFocus]
            ),
            handleBlur = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(
              e => {
                ;(setIsFocused(!1), null == onBlur || onBlur(e))
              },
              [onBlur]
            )
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
            'div',
            {
              style: computedStyles.container,
              children: [
                label &&
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'label',
                    {
                      style: computedStyles.label,
                      children:
                        'string' == typeof label
                          ? (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment,
                              {
                                children: [
                                  label,
                                  (null == styles ? void 0 : styles.required) &&
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      'span',
                                      {
                                        style: (0,
                                        _theme__WEBPACK_IMPORTED_MODULE_2__.sz)(
                                          styles
                                        ),
                                        children:
                                          (null == styles
                                            ? void 0
                                            : styles.requiredIndicatorText) ||
                                          ' *',
                                      }
                                    ),
                                ],
                              }
                            )
                          : label,
                    }
                  ),
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                  'div',
                  {
                    style: computedStyles.inputWrapper,
                    onClick: () => {
                      var _inputRef_current
                      null === (_inputRef_current = inputRef.current) ||
                        void 0 === _inputRef_current ||
                        _inputRef_current.focus()
                    },
                    children: [
                      startAdornment &&
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'div',
                          {
                            style: {
                              ...computedStyles.adornment,
                              ...computedStyles.startAdornment,
                            },
                            children: startAdornment,
                          }
                        ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'input',
                        {
                          ref: inputRef,
                          ...rest,
                          ...(0, _theme__WEBPACK_IMPORTED_MODULE_2__.SI)(
                            null == styles ? void 0 : styles.required
                          ),
                          value: value || '',
                          disabled: null == styles ? void 0 : styles.disabled,
                          onChange: handleChange,
                          onFocus: handleFocus,
                          onBlur: handleBlur,
                          style: computedStyles.input,
                        }
                      ),
                      endAdornment &&
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'div',
                          {
                            style: {
                              ...computedStyles.adornment,
                              ...computedStyles.endAdornment,
                            },
                            children: endAdornment,
                          }
                        ),
                    ],
                  }
                ),
                helperText &&
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'div',
                    { style: computedStyles.footerText, children: helperText }
                  ),
              ],
            }
          )
        }
        TextField.displayName = 'TextField'
        const __WEBPACK_DEFAULT_EXPORT__ = TextField
        TextField.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'TextField',
          props: {
            value: {
              required: !0,
              tsType: { name: 'string' },
              description: 'The value of the input.',
            },
            onChange: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(value: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'value' }],
                  return: { name: 'void' },
                },
              },
              description: 'Callback fired when the value changes.',
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
              description: 'Callback fired when the input is focused.',
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
              description: 'Callback fired when the input loses focus.',
            },
            helperText: {
              required: !1,
              tsType: { name: 'string' },
              description:
                'Helper text to display (can be error or info based on styles.helperTextType).',
            },
            startAdornment: {
              required: !1,
              tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
              description: 'A React node to display at the start of the input.',
            },
            endAdornment: {
              required: !1,
              tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
              description: 'A React node to display at the end of the input.',
            },
            label: {
              required: !1,
              tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
              description:
                'The label for the input. Can be a string or a React node.',
            },
            styles: {
              required: !1,
              tsType: { name: 'FormFieldStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
          },
          composes: ['Omit'],
        }
      },
      './src/components/Field/Text/textfield.stories.tsx': (
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
            CustomTransitions: () => CustomTransitions,
            CustomTypography: () => CustomTypography,
            DarkTheme: () => DarkTheme,
            DisabledStates: () => DisabledStates,
            ErrorStates: () => ErrorStates,
            InteractionTest: () => InteractionTest,
            LabelsAndPlaceholders: () => LabelsAndPlaceholders,
            LightTheme: () => LightTheme,
            NeonStyle: () => NeonStyle,
            RequiredFields: () => RequiredFields,
            RequiredValidation: () => RequiredValidation,
            SacredTheme: () => SacredTheme,
            SharedRequiredSystem: () => SharedRequiredSystem,
            WithAdornments: () => WithAdornments,
            __namedExportsOrder: () => __namedExportsOrder,
            default: () => __WEBPACK_DEFAULT_EXPORT__,
          }))
        var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ =
            __webpack_require__(
              './node_modules/next/dist/compiled/react/jsx-runtime.js'
            ),
          react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          _storybook_test__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
            './node_modules/@storybook/test/dist/index.mjs'
          ),
          _index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
            './src/components/Field/Text/index.tsx'
          )
        const AtIcon = () =>
            (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('svg', {
              xmlns: 'http://www.w3.org/2000/svg',
              width: '20',
              height: '20',
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '2',
              children: [
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  'circle',
                  { cx: '12', cy: '12', r: '4' }
                ),
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  'path',
                  { d: 'M16 8v-2a4 4 0 00-4-4 4 4 0 00-4 4v2' }
                ),
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  'path',
                  { d: 'M12 16v2a4 4 0 004 4 4 4 0 004-4v-2' }
                ),
              ],
            }),
          SearchIcon = () =>
            (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('svg', {
              xmlns: 'http://www.w3.org/2000/svg',
              width: '18',
              height: '18',
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '2',
              children: [
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  'circle',
                  { cx: '11', cy: '11', r: '8' }
                ),
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  'path',
                  { d: 'M21 21l-4.35-4.35' }
                ),
              ],
            }),
          LockIcon = () =>
            (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('svg', {
              xmlns: 'http://www.w3.org/2000/svg',
              width: '18',
              height: '18',
              viewBox: '0 0 24 24',
              fill: 'none',
              stroke: 'currentColor',
              strokeWidth: '2',
              children: [
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  'rect',
                  {
                    x: '3',
                    y: '11',
                    width: '18',
                    height: '11',
                    rx: '2',
                    ry: '2',
                  }
                ),
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  'circle',
                  { cx: '12', cy: '16', r: '1' }
                ),
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  'path',
                  { d: 'M7 11V7a5 5 0 0 1 10 0v4' }
                ),
              ],
            }),
          TextFieldWithState = ({ initialValue = '', ...props }) => {
            const [value, setValue] = (0,
            react__WEBPACK_IMPORTED_MODULE_1__.useState)(initialValue)
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
              _index__WEBPACK_IMPORTED_MODULE_3__.A,
              { ...props, value, onChange: setValue }
            )
          },
          __WEBPACK_DEFAULT_EXPORT__ = {
            title: 'Components/Field/Text',
            component: _index__WEBPACK_IMPORTED_MODULE_3__.A,
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
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                  style: { width: '400px', padding: '2rem' },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    Story,
                    {}
                  ),
                }),
            ],
          },
          LightTheme = {
            name: 'Light Theme (Default)',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                TextFieldWithState,
                {
                  label: 'Email Address',
                  placeholder: 'your@email.com',
                  styles: { theme: 'light' },
                }
              ),
          },
          DarkTheme = {
            name: 'Dark Theme',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                TextFieldWithState,
                {
                  label: 'Username',
                  placeholder: 'Enter username',
                  styles: { theme: 'dark' },
                }
              ),
            parameters: { backgrounds: { default: 'dark' } },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                TextFieldWithState,
                {
                  label: 'Ancient Inscription',
                  placeholder: 'Enter sacred text...',
                  styles: { theme: 'sacred' },
                }
              ),
            parameters: { backgrounds: { default: 'dark' } },
          },
          CustomColors = {
            name: 'Custom Colors',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                TextFieldWithState,
                {
                  label: 'Custom Styled',
                  placeholder: 'Custom appearance',
                  styles: {
                    theme: 'light',
                    backgroundColor: 'rgba(255, 240, 245, 0.95)',
                    borderColor: 'rgba(255, 20, 147, 0.4)',
                    borderFocusedColor: 'rgba(255, 20, 147, 1)',
                    textColor: 'rgba(139, 0, 139, 1)',
                    labelColor: 'rgba(139, 0, 139, 0.7)',
                  },
                }
              ),
          },
          NeonStyle = {
            name: 'Neon Style',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                TextFieldWithState,
                {
                  label: 'Neon Input',
                  placeholder: 'Futuristic design',
                  styles: {
                    theme: 'dark',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    borderColor: 'rgba(0, 255, 255, 0.5)',
                    borderFocusedColor: 'rgba(0, 255, 255, 1)',
                    textColor: 'rgba(0, 255, 255, 1)',
                    labelColor: 'rgba(0, 255, 255, 0.7)',
                    borderRadius: '12px',
                    borderWidth: '2px',
                  },
                }
              ),
            parameters: { backgrounds: { default: 'dark' } },
          },
          CustomLayout = {
            name: 'Custom Layout & Spacing',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Large Padding',
                      placeholder: 'Extra space inside',
                      styles: {
                        theme: 'light',
                        padding: '24px',
                        borderRadius: '16px',
                        fontSize: '18px',
                      },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Custom Dimensions',
                      placeholder: 'Fixed height',
                      styles: {
                        theme: 'light',
                        height: '60px',
                        width: '100%',
                        borderRadius: '8px',
                      },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Asymmetric Padding',
                      placeholder: 'Different padding sides',
                      styles: {
                        theme: 'light',
                        paddingLeft: '32px',
                        paddingRight: '16px',
                        paddingTop: '20px',
                        paddingBottom: '20px',
                      },
                    }
                  ),
                ],
              }),
          },
          CustomTypography = {
            name: 'Custom Typography',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Large Text',
                      placeholder: 'Bigger font size',
                      styles: {
                        theme: 'light',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        lineHeight: '1.5',
                        padding: '20px',
                      },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Custom Font',
                      placeholder: 'Different font family',
                      styles: {
                        theme: 'light',
                        fontFamily: '"Georgia", serif',
                        fontSize: '16px',
                        fontWeight: 400,
                      },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Small & Light',
                      placeholder: 'Subtle appearance',
                      styles: {
                        theme: 'light',
                        fontSize: '14px',
                        fontWeight: 300,
                        padding: '12px',
                      },
                    }
                  ),
                ],
              }),
          },
          WithAdornments = {
            name: 'With Adornments',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Search',
                      placeholder: 'Search...',
                      startAdornment: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchIcon,
                        {}
                      ),
                      styles: { theme: 'light' },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Password',
                      placeholder: 'Enter password',
                      type: 'password',
                      endAdornment: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        LockIcon,
                        {}
                      ),
                      styles: { theme: 'light' },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Username',
                      placeholder: '@username',
                      startAdornment: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        AtIcon,
                        {}
                      ),
                      endAdornment: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchIcon,
                        {}
                      ),
                      styles: {
                        theme: 'light',
                        startAdornmentOffset: '56px',
                        endAdornmentOffset: '56px',
                      },
                    }
                  ),
                ],
              }),
          },
          ErrorStates = {
            name: 'Error States',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Email Address',
                      initialValue: 'invalid-email',
                      error: 'Please enter a valid email address.',
                      styles: { theme: 'light' },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Full Name',
                      placeholder: 'This field is required',
                      error: 'This field cannot be empty.',
                      styles: {
                        theme: 'dark',
                        borderErrorColor: 'rgba(255, 99, 71, 1)',
                        labelErrorColor: 'rgba(255, 99, 71, 1)',
                        footerTextErrorColor: 'rgba(255, 99, 71, 1)',
                      },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Ancient Inscription',
                      initialValue: 'forbidden text',
                      error: 'This knowledge is forbidden.',
                      styles: { theme: 'sacred' },
                    }
                  ),
                ],
              }),
          },
          LabelsAndPlaceholders = {
            name: 'Labels and Placeholders',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'With Label and Placeholder',
                      placeholder: 'Enter your email address',
                      styles: { theme: 'light' },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    { label: 'Label Only', styles: { theme: 'light' } }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      placeholder: 'Placeholder Only',
                      styles: { theme: 'light' },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Pre-filled Value',
                      initialValue: 'sample@email.com',
                      styles: { theme: 'light' },
                    }
                  ),
                ],
              }),
          },
          CustomTransitions = {
            name: 'Custom Transitions',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Slow Transition',
                      placeholder: 'Slow animations',
                      styles: {
                        theme: 'light',
                        transitionDuration: '800ms',
                        transitionEasing:
                          'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Fast Transition',
                      placeholder: 'Quick animations',
                      styles: {
                        theme: 'light',
                        transitionDuration: '100ms',
                        transitionEasing: 'linear',
                      },
                    }
                  ),
                ],
              }),
          },
          ComprehensiveShowcase = {
            name: 'Comprehensive Showcase',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                style: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2rem',
                  padding: '1rem',
                },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'h3',
                          {
                            style: { margin: '0 0 1rem 0', color: '#374151' },
                            children: 'Light Theme',
                          }
                        ),
                        (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'div',
                          {
                            style: {
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '1rem',
                            },
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                TextFieldWithState,
                                {
                                  label: 'Basic Light',
                                  placeholder: 'Enter text',
                                  styles: { theme: 'light' },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                TextFieldWithState,
                                {
                                  label: 'Username',
                                  initialValue: 'invalid',
                                  error: 'Invalid input',
                                  styles: { theme: 'light' },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                TextFieldWithState,
                                {
                                  label: 'With Adornment',
                                  placeholder: 'Search',
                                  startAdornment: (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    SearchIcon,
                                    {}
                                  ),
                                  styles: { theme: 'light' },
                                }
                              ),
                            ],
                          }
                        ),
                      ],
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'h3',
                          {
                            style: { margin: '0 0 1rem 0', color: '#9CA3AF' },
                            children: 'Dark Theme',
                          }
                        ),
                        (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'div',
                          {
                            style: {
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '1rem',
                            },
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                TextFieldWithState,
                                {
                                  label: 'Basic Dark',
                                  placeholder: 'Enter text',
                                  styles: { theme: 'dark' },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                TextFieldWithState,
                                {
                                  label: 'Custom Colors',
                                  placeholder: 'Custom styling',
                                  styles: {
                                    theme: 'dark',
                                    borderFocusedColor: 'rgba(34, 197, 94, 1)',
                                    labelColor: 'rgba(34, 197, 94, 0.8)',
                                  },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                TextFieldWithState,
                                {
                                  label: 'Large Size',
                                  placeholder: 'Bigger input',
                                  styles: {
                                    theme: 'dark',
                                    fontSize: '18px',
                                    padding: '20px',
                                    borderRadius: '12px',
                                  },
                                }
                              ),
                            ],
                          }
                        ),
                      ],
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'h3',
                          {
                            style: { margin: '0 0 1rem 0', color: '#FFD700' },
                            children: 'Sacred Theme',
                          }
                        ),
                        (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'div',
                          {
                            style: {
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '1rem',
                            },
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                TextFieldWithState,
                                {
                                  label: 'Ancient Text',
                                  placeholder: 'Sacred inscription',
                                  styles: { theme: 'sacred' },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                TextFieldWithState,
                                {
                                  label: 'Sacred Knowledge',
                                  initialValue: 'forbidden',
                                  error: 'This knowledge is forbidden',
                                  styles: { theme: 'sacred' },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                TextFieldWithState,
                                {
                                  label: 'Divine Input',
                                  placeholder: 'Enter divine text',
                                  endAdornment: (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    AtIcon,
                                    {}
                                  ),
                                  styles: {
                                    theme: 'sacred',
                                    borderRadius: '16px',
                                    padding: '18px',
                                  },
                                }
                              ),
                            ],
                          }
                        ),
                      ],
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'h3',
                          {
                            style: { margin: '0 0 1rem 0', color: '#7C3AED' },
                            children: 'Custom Styling',
                          }
                        ),
                        (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'div',
                          {
                            style: {
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '1rem',
                            },
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                TextFieldWithState,
                                {
                                  label: 'Neon Style',
                                  placeholder: 'Futuristic',
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
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                TextFieldWithState,
                                {
                                  label: 'Soft Rounded',
                                  placeholder: 'Gentle appearance',
                                  styles: {
                                    theme: 'light',
                                    backgroundColor: 'rgba(249, 250, 251, 1)',
                                    borderColor: 'rgba(209, 213, 219, 1)',
                                    borderFocusedColor: 'rgba(59, 130, 246, 1)',
                                    borderRadius: '24px',
                                    padding: '16px 24px',
                                  },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                TextFieldWithState,
                                {
                                  label: 'Minimal',
                                  placeholder: 'Clean design',
                                  styles: {
                                    theme: 'light',
                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                    borderColor: 'rgba(0, 0, 0, 0.1)',
                                    borderFocusedColor: 'rgba(0, 0, 0, 0.3)',
                                    borderRadius: '0px',
                                    borderWidth: '0px 0px 2px 0px',
                                    padding: '12px 0px',
                                  },
                                }
                              ),
                            ],
                          }
                        ),
                      ],
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'h3',
                          {
                            style: { margin: '0 0 1rem 0', color: '#DC2626' },
                            children: 'Required Fields',
                          }
                        ),
                        (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'div',
                          {
                            style: {
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '1rem',
                            },
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                TextFieldWithState,
                                {
                                  label: 'Required Light',
                                  placeholder: 'This field is required',
                                  styles: { theme: 'light', required: !0 },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                TextFieldWithState,
                                {
                                  label: 'Required Dark',
                                  placeholder: 'Enter value',
                                  error: 'This field is required',
                                  styles: { theme: 'dark', required: !0 },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                TextFieldWithState,
                                {
                                  label: 'Custom Required',
                                  placeholder: 'Ancient text',
                                  styles: {
                                    theme: 'sacred',
                                    required: !0,
                                    requiredIndicatorText: ' (required)',
                                    requiredIndicatorColor:
                                      'rgba(255, 215, 0, 1)',
                                  },
                                }
                              ),
                            ],
                          }
                        ),
                      ],
                    }
                  ),
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
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Disabled Light',
                      initialValue: 'Cannot be edited',
                      disabled: !0,
                      styles: { theme: 'light' },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Disabled Dark',
                      initialValue: 'Cannot be edited',
                      disabled: !0,
                      styles: { theme: 'dark' },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Disabled Sacred',
                      initialValue: 'Sealed knowledge',
                      disabled: !0,
                      styles: { theme: 'sacred' },
                    }
                  ),
                ],
              }),
          },
          RequiredFields = {
            name: 'Required Fields',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Required Field',
                      placeholder: 'This field is required',
                      styles: { theme: 'light', required: !0 },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Required Email',
                      placeholder: 'Enter your email',
                      error: 'This field is required',
                      styles: { theme: 'light', required: !0 },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Required Password',
                      placeholder: 'Create a password',
                      type: 'password',
                      endAdornment: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        LockIcon,
                        {}
                      ),
                      styles: { theme: 'dark', required: !0 },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    TextFieldWithState,
                    {
                      label: 'Custom Required Indicator',
                      placeholder: 'Enter ancient knowledge',
                      styles: {
                        theme: 'sacred',
                        required: !0,
                        requiredIndicatorText: ' (required)',
                        requiredIndicatorColor: 'rgba(255, 215, 0, 1)',
                      },
                    }
                  ),
                ],
              }),
            play: async ({ canvasElement }) => {
              const canvas = (0,
              _storybook_test__WEBPACK_IMPORTED_MODULE_2__.ux)(canvasElement)
              ;(await (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                canvas.getByText(/Required Field/)
              ).toBeInTheDocument(),
                await (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                  canvas.getByText(/Required Email/)
                ).toBeInTheDocument(),
                await (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                  canvas.getByText(/Required Password/)
                ).toBeInTheDocument())
              const inputs = canvas.getAllByRole('textbox')
              ;((0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                inputs[0]
              ).toBeRequired(),
                (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                  inputs[1]
                ).toBeRequired())
              const passwordInput =
                canvas.getByPlaceholderText('Create a password')
              ;(0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                passwordInput
              ).toBeRequired()
            },
          },
          RequiredValidationDemo = () => {
            const [name, setName] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(''),
              [email, setEmail] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(''),
              [errors, setErrors] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)({
                name: '',
                email: '',
              })
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  width: '400px',
                },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'h3',
                    {
                      style: { margin: '0 0 1rem 0' },
                      children: 'Required Field Validation',
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _index__WEBPACK_IMPORTED_MODULE_3__.A,
                    {
                      label: 'Full Name',
                      placeholder: 'Enter your full name',
                      value: name,
                      onChange: setName,
                      helperText: errors.name,
                      styles: { theme: 'light', required: !0 },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _index__WEBPACK_IMPORTED_MODULE_3__.A,
                    {
                      label: 'Email Address',
                      placeholder: 'Enter your email',
                      type: 'email',
                      value: email,
                      onChange: setEmail,
                      helperText: errors.email,
                      styles: { theme: 'light', required: !0 },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'button',
                    {
                      onClick: () => {
                        const nameError =
                            '' === name.trim() ? 'Name is required' : '',
                          emailError =
                            '' === email.trim() ? 'Email is required' : ''
                        ;(setErrors({ name: nameError, email: emailError }),
                          nameError ||
                            emailError ||
                            alert('Form submitted successfully!'))
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
                      children: 'Submit Form',
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('p', {
                    style: { fontSize: '14px', color: '#6B7280' },
                    children:
                      'Try submitting the form without filling in the required fields to see validation in action.',
                  }),
                ],
              }
            )
          },
          RequiredValidation = {
            name: 'Required Validation Demo',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                RequiredValidationDemo,
                {}
              ),
          },
          SharedRequiredSystemDemo = () => {
            const [firstName, setFirstName] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(''),
              [lastName, setLastName] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(''),
              [email, setEmail] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(''),
              [country, setCountry] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(''),
              [errors, setErrors] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)({
                firstName: '',
                lastName: '',
                email: '',
                country: '',
              })
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  width: '500px',
                },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'h3',
                    {
                      style: { margin: '0 0 1rem 0', color: '#1F2937' },
                      children: 'Shared Required System Demo',
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('p', {
                    style: {
                      fontSize: '14px',
                      color: '#6B7280',
                      margin: '0 0 1rem 0',
                    },
                    children:
                      'This demo shows how TextField and Dropdown components share the same required field system with consistent styling and validation behavior.',
                  }),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem',
                      },
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_3__.A,
                          {
                            label: 'First Name',
                            placeholder: 'Enter your first name',
                            value: firstName,
                            onChange: setFirstName,
                            helperText: errors.firstName,
                            styles: { theme: 'light', required: !0 },
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_3__.A,
                          {
                            label: 'Last Name',
                            placeholder: 'Enter your last name',
                            value: lastName,
                            onChange: setLastName,
                            helperText: errors.lastName,
                            styles: { theme: 'light', required: !0 },
                          }
                        ),
                      ],
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _index__WEBPACK_IMPORTED_MODULE_3__.A,
                    {
                      label: 'Email Address',
                      placeholder: 'Enter your email',
                      type: 'email',
                      value: email,
                      onChange: setEmail,
                      helperText: errors.email,
                      styles: { theme: 'light', required: !0 },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                      },
                      children: [
                        (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'label',
                          {
                            style: {
                              fontWeight: '600',
                              fontSize: '14px',
                              color: '#374151',
                              marginBottom: '6px',
                            },
                            children: [
                              'Country',
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                'span',
                                {
                                  style: { color: 'rgba(239, 68, 68, 1)' },
                                  children: ' *',
                                }
                              ),
                            ],
                          }
                        ),
                        (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'select',
                          {
                            value: country,
                            onChange: e => setCountry(e.target.value),
                            required: !0,
                            style: {
                              padding: '12px 16px',
                              borderRadius: '8px',
                              border: '1px solid rgba(209, 213, 219, 1)',
                              fontSize: '16px',
                              backgroundColor: 'rgba(255, 255, 255, 1)',
                              color: 'rgba(17, 24, 39, 1)',
                              minHeight: '40px',
                              appearance: 'none',
                              backgroundImage:
                                "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                              backgroundPosition: 'right 12px center',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: '16px',
                              paddingRight: '40px',
                            },
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                'option',
                                { value: '', children: 'Select a country' }
                              ),
                              [
                                { value: 'us', label: 'United States' },
                                { value: 'ca', label: 'Canada' },
                                { value: 'uk', label: 'United Kingdom' },
                                { value: 'au', label: 'Australia' },
                                { value: 'de', label: 'Germany' },
                                { value: 'fr', label: 'France' },
                                { value: 'jp', label: 'Japan' },
                              ].map(option =>
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                  'option',
                                  {
                                    value: option.value,
                                    children: option.label,
                                  },
                                  option.value
                                )
                              ),
                            ],
                          }
                        ),
                        errors.country &&
                          (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            'div',
                            {
                              style: {
                                fontSize: '12px',
                                color: 'rgba(239, 68, 68, 1)',
                                marginTop: '8px',
                              },
                              children: errors.country,
                            }
                          ),
                      ],
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'button',
                    {
                      onClick: () => {
                        const firstNameError =
                            '' === firstName.trim()
                              ? 'First name is required'
                              : '',
                          lastNameError =
                            '' === lastName.trim()
                              ? 'Last name is required'
                              : '',
                          emailError =
                            '' === email.trim() ? 'Email is required' : '',
                          countryError =
                            '' === country.trim() ? 'Country is required' : ''
                        ;(setErrors({
                          firstName: firstNameError,
                          lastName: lastNameError,
                          email: emailError,
                          country: countryError,
                        }),
                          firstNameError ||
                            lastNameError ||
                            emailError ||
                            countryError ||
                            alert('Form submitted successfully!'))
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
                        marginTop: '1rem',
                      },
                      children: 'Submit Form',
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      style: {
                        backgroundColor: 'rgba(249, 250, 251, 1)',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(209, 213, 219, 1)',
                        fontSize: '14px',
                        color: '#6B7280',
                      },
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'h4',
                          {
                            style: { margin: '0 0 0.5rem 0', color: '#374151' },
                            children: 'Shared Required Features:',
                          }
                        ),
                        (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'ul',
                          {
                            style: { margin: '0', paddingLeft: '1.5rem' },
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                'li',
                                {
                                  children:
                                    'Automatic asterisk (*) indicators for required fields',
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                'li',
                                {
                                  children:
                                    'Consistent styling across TextField and Dropdown',
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                'li',
                                {
                                  children:
                                    'Proper HTML5 validation attributes (required, aria-required)',
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                'li',
                                {
                                  children:
                                    'Customizable required indicator text and color',
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                'li',
                                {
                                  children:
                                    'Unified error handling and validation',
                                }
                              ),
                            ],
                          }
                        ),
                      ],
                    }
                  ),
                ],
              }
            )
          },
          SharedRequiredSystem = {
            name: 'Shared Required System',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                SharedRequiredSystemDemo,
                {}
              ),
            parameters: { layout: 'centered' },
          },
          InteractionTest = {
            name: 'Interaction Test',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                TextFieldWithState,
                {
                  label: 'Test Input',
                  placeholder: 'Type here for testing...',
                  styles: { theme: 'light' },
                }
              ),
            play: async ({ canvasElement }) => {
              const canvas = (0,
                _storybook_test__WEBPACK_IMPORTED_MODULE_2__.ux)(canvasElement),
                input = canvas.getByPlaceholderText('Type here for testing...'),
                label = canvas.getByText('Test Input')
              ;((0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                label
              ).toBeVisible(),
                (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                  input
                ).toBeVisible(),
                await _storybook_test__WEBPACK_IMPORTED_MODULE_2__.Q4.click(
                  input
                ),
                await _storybook_test__WEBPACK_IMPORTED_MODULE_2__.Q4.type(
                  input,
                  'Hello, Testing!',
                  { delay: 50 }
                ),
                await (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                  input
                ).toHaveValue('Hello, Testing!'))
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
            'WithAdornments',
            'ErrorStates',
            'LabelsAndPlaceholders',
            'CustomTransitions',
            'ComprehensiveShowcase',
            'DisabledStates',
            'RequiredFields',
            'RequiredValidation',
            'SharedRequiredSystem',
            'InteractionTest',
          ]
      },
    },
  ]
)
