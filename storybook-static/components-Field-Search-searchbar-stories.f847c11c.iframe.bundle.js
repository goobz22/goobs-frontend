;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [2881],
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
      './src/components/Field/Search/index.tsx': (
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
          ),
          _Icons_Search__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
            './src/components/Icons/Search.tsx'
          )
        const Searchbar = ({
            label,
            placeholder,
            value,
            onChange,
            helperText,
            styles,
          }) => {
            const [focused, setFocused] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
              computedStyles = ((styles, isFocused) => {
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
                      '8px 16px 8px 48px',
                    paddingLeft:
                      (null == styles ? void 0 : styles.paddingLeft) || '48px',
                    paddingRight:
                      (null == styles ? void 0 : styles.paddingRight) || '16px',
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
                  label: (0, _theme__WEBPACK_IMPORTED_MODULE_2__.Wh)(
                    labelColor,
                    themeConfig
                  ),
                  startAdornment: {
                    ...(0, _theme__WEBPACK_IMPORTED_MODULE_2__.EK)(
                      adornmentColor
                    ),
                    left: '16px',
                  },
                  footerText: (0, _theme__WEBPACK_IMPORTED_MODULE_2__.En)(
                    footerTextColor,
                    themeConfig,
                    styles
                  ),
                }
              })(styles, focused)
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: computedStyles.container,
                children: [
                  label &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                      'label',
                      {
                        style: computedStyles.label,
                        children: [
                          label,
                          (null == styles ? void 0 : styles.required) &&
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'span',
                              {
                                style: (0,
                                _theme__WEBPACK_IMPORTED_MODULE_2__.sz)(styles),
                                children:
                                  (null == styles
                                    ? void 0
                                    : styles.requiredIndicatorText) || ' *',
                              }
                            ),
                        ],
                      }
                    ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      style: computedStyles.inputWrapper,
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'div',
                          {
                            style: computedStyles.startAdornment,
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Icons_Search__WEBPACK_IMPORTED_MODULE_3__.A,
                              {
                                style: {
                                  width: '20px',
                                  height: '20px',
                                  color: 'inherit',
                                },
                              }
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'input',
                          {
                            id: 'search-input',
                            type: 'text',
                            value,
                            onChange,
                            onFocus: () => setFocused(!0),
                            onBlur: () => setFocused(!1),
                            disabled: null == styles ? void 0 : styles.disabled,
                            placeholder,
                            style: {
                              ...computedStyles.input,
                              ...((null == styles
                                ? void 0
                                : styles.disabled) && {
                                opacity: 0.5,
                                cursor: 'not-allowed',
                              }),
                            },
                            ...(0, _theme__WEBPACK_IMPORTED_MODULE_2__.SI)(
                              null == styles ? void 0 : styles.required
                            ),
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
          },
          __WEBPACK_DEFAULT_EXPORT__ = Searchbar
        Searchbar.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'Searchbar',
          props: {
            label: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            placeholder: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            value: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            onChange: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(e: React.ChangeEvent<HTMLInputElement>) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactChangeEvent',
                        raw: 'React.ChangeEvent<HTMLInputElement>',
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
            className: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'FormFieldStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
          },
        }
      },
      './src/components/Field/Search/searchbar.stories.tsx': (
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
            SearchDemoStory: () => SearchDemoStory,
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
            './src/components/Field/Search/index.tsx'
          )
        const SearchBarWithState = ({ initialValue = '', ...props }) => {
            const [value, setValue] = (0,
            react__WEBPACK_IMPORTED_MODULE_1__.useState)(initialValue)
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
              _index__WEBPACK_IMPORTED_MODULE_3__.A,
              {
                ...props,
                value,
                onChange: e => {
                  setValue(e.target.value)
                },
              }
            )
          },
          __WEBPACK_DEFAULT_EXPORT__ = {
            title: 'Components/Field/Search',
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
                SearchBarWithState,
                {
                  label: 'Search',
                  placeholder: 'Search for items...',
                  styles: { theme: 'light' },
                }
              ),
          },
          DarkTheme = {
            name: 'Dark Theme',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                SearchBarWithState,
                {
                  label: 'Search Query',
                  placeholder: 'Enter search terms',
                  styles: { theme: 'dark' },
                }
              ),
            parameters: { backgrounds: { default: 'dark' } },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                SearchBarWithState,
                {
                  label: 'Divine Search',
                  placeholder: 'Seek ancient wisdom...',
                  styles: { theme: 'sacred' },
                }
              ),
            parameters: { backgrounds: { default: 'dark' } },
          },
          CustomColors = {
            name: 'Custom Colors',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                SearchBarWithState,
                {
                  label: 'Custom Search',
                  placeholder: 'Search with custom colors',
                  styles: {
                    theme: 'light',
                    backgroundColor: 'rgba(240, 253, 244, 0.95)',
                    borderColor: 'rgba(34, 197, 94, 0.4)',
                    borderFocusedColor: 'rgba(34, 197, 94, 1)',
                    textColor: 'rgba(21, 128, 61, 1)',
                    labelColor: 'rgba(21, 128, 61, 0.7)',
                  },
                }
              ),
          },
          NeonStyle = {
            name: 'Neon Style',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                SearchBarWithState,
                {
                  label: 'Neon Search',
                  placeholder: 'Futuristic search',
                  styles: {
                    theme: 'dark',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    borderColor: 'rgba(236, 72, 153, 0.5)',
                    borderFocusedColor: 'rgba(236, 72, 153, 1)',
                    textColor: 'rgba(236, 72, 153, 1)',
                    labelColor: 'rgba(236, 72, 153, 0.7)',
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
                    SearchBarWithState,
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
                    SearchBarWithState,
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
                    SearchBarWithState,
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
                    SearchBarWithState,
                    {
                      label: 'Large Text',
                      placeholder: 'Search with bigger text',
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
                    SearchBarWithState,
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
                    SearchBarWithState,
                    {
                      label: 'Small & Light',
                      placeholder: 'Subtle search',
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
                    SearchBarWithState,
                    {
                      label: 'Search Query',
                      initialValue: 'invalid@#$%',
                      error: 'Search contains invalid characters.',
                      styles: { theme: 'light' },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    SearchBarWithState,
                    {
                      label: 'Product Search',
                      placeholder: 'Enter product name',
                      error: 'No results found for your search.',
                      styles: {
                        theme: 'dark',
                        borderErrorColor: 'rgba(255, 99, 71, 1)',
                        labelErrorColor: 'rgba(255, 99, 71, 1)',
                        footerTextErrorColor: 'rgba(255, 99, 71, 1)',
                      },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    SearchBarWithState,
                    {
                      label: 'Sacred Search',
                      initialValue: 'forbidden-knowledge',
                      error: 'This knowledge is forbidden to mortals.',
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
                    SearchBarWithState,
                    {
                      label: 'Required Search',
                      placeholder: 'Enter search query',
                      required: !0,
                      styles: { theme: 'light' },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    SearchBarWithState,
                    {
                      label: 'Product Search',
                      placeholder: 'Search for products',
                      required: !0,
                      error: 'Search query is required',
                      styles: { theme: 'light' },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    SearchBarWithState,
                    {
                      label: 'User Search',
                      placeholder: 'Search for users',
                      required: !0,
                      styles: { theme: 'dark' },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    SearchBarWithState,
                    {
                      label: 'Custom Required Search',
                      placeholder: 'Enter divine query',
                      required: !0,
                      styles: {
                        theme: 'sacred',
                        requiredIndicatorText: ' (required)',
                        requiredIndicatorColor: 'rgba(255, 215, 0, 1)',
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
                                SearchBarWithState,
                                {
                                  label: 'Basic Search',
                                  placeholder: 'Search items',
                                  styles: { theme: 'light' },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                SearchBarWithState,
                                {
                                  label: 'Search Query',
                                  initialValue: 'invalid',
                                  error: 'Invalid search',
                                  styles: { theme: 'light' },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                SearchBarWithState,
                                {
                                  label: 'Required Search',
                                  placeholder: 'Required field',
                                  required: !0,
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
                                SearchBarWithState,
                                {
                                  label: 'Basic Dark',
                                  placeholder: 'Search items',
                                  styles: { theme: 'dark' },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                SearchBarWithState,
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
                                SearchBarWithState,
                                {
                                  label: 'Large Size',
                                  placeholder: 'Search items',
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
                                SearchBarWithState,
                                {
                                  label: 'Divine Search',
                                  placeholder: 'Seek wisdom',
                                  styles: { theme: 'sacred' },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                SearchBarWithState,
                                {
                                  label: 'Sacred Query',
                                  initialValue: 'forbidden',
                                  error: 'Knowledge forbidden',
                                  styles: { theme: 'sacred' },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                SearchBarWithState,
                                {
                                  label: 'Ancient Search',
                                  placeholder: 'Enter divine query',
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
                                SearchBarWithState,
                                {
                                  label: 'Neon Style',
                                  placeholder: 'Futuristic search',
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
                                SearchBarWithState,
                                {
                                  label: 'Soft Rounded',
                                  placeholder: 'Gentle search',
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
                                SearchBarWithState,
                                {
                                  label: 'Minimal',
                                  placeholder: 'Clean search',
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
                    SearchBarWithState,
                    {
                      label: 'Disabled Light',
                      initialValue: 'cannot-search',
                      disabled: !0,
                      styles: { theme: 'light' },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    SearchBarWithState,
                    {
                      label: 'Disabled Dark',
                      initialValue: 'locked-search',
                      disabled: !0,
                      styles: { theme: 'dark' },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    SearchBarWithState,
                    {
                      label: 'Disabled Sacred',
                      initialValue: 'sealed-knowledge',
                      disabled: !0,
                      styles: { theme: 'sacred' },
                    }
                  ),
                ],
              }),
          },
          SearchDemo = () => {
            const [query, setQuery] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(''),
              [results, setResults] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)([]),
              [isSearching, setIsSearching] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
              mockData = [
                'Apple iPhone 15',
                'Samsung Galaxy S24',
                'MacBook Pro',
                'Dell XPS 13',
                'iPad Air',
                'Microsoft Surface',
                'Google Pixel 8',
                'Sony WH-1000XM4',
                'AirPods Pro',
                'Nintendo Switch',
              ]
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
                    { style: { margin: '0 0 1rem 0' }, children: 'Search Demo' }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _index__WEBPACK_IMPORTED_MODULE_3__.A,
                    {
                      label: 'Product Search',
                      placeholder: 'Search for products...',
                      value: query,
                      onChange: e => {
                        const searchQuery = e.target.value
                        ;(setQuery(searchQuery),
                          setIsSearching(!0),
                          setTimeout(() => {
                            if (searchQuery.trim()) {
                              const filtered = mockData.filter(item =>
                                item
                                  .toLowerCase()
                                  .includes(searchQuery.toLowerCase())
                              )
                              setResults(filtered)
                            } else setResults([])
                            setIsSearching(!1)
                          }, 300))
                      },
                      styles: { theme: 'light' },
                    }
                  ),
                  isSearching &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      'div',
                      {
                        style: {
                          padding: '1rem',
                          textAlign: 'center',
                          fontSize: '14px',
                          color: '#6B7280',
                        },
                        children: 'Searching...',
                      }
                    ),
                  !isSearching &&
                    results.length > 0 &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      'div',
                      {
                        style: {
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          maxHeight: '200px',
                          overflowY: 'auto',
                        },
                        children: results.map((item, index) =>
                          (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            'div',
                            {
                              style: {
                                padding: '0.75rem 1rem',
                                borderBottom:
                                  index < results.length - 1
                                    ? '1px solid #E5E7EB'
                                    : 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                              },
                              onMouseEnter: e => {
                                e.target.style.backgroundColor = '#F3F4F6'
                              },
                              onMouseLeave: e => {
                                e.target.style.backgroundColor = 'transparent'
                              },
                              children: item,
                            },
                            index
                          )
                        ),
                      }
                    ),
                  !isSearching &&
                    query &&
                    0 === results.length &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                      'div',
                      {
                        style: {
                          padding: '1rem',
                          textAlign: 'center',
                          fontSize: '14px',
                          color: '#6B7280',
                        },
                        children: ['No results found for "', query, '"'],
                      }
                    ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('p', {
                    style: { fontSize: '14px', color: '#6B7280' },
                    children:
                      'Start typing to search through products. Results will appear below.',
                  }),
                ],
              }
            )
          },
          SearchDemoStory = {
            name: 'Search Demo',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                SearchDemo,
                {}
              ),
          },
          InteractionTest = {
            name: 'Interaction Test',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                SearchBarWithState,
                {
                  label: 'Test Search Input',
                  placeholder: 'Search for testing...',
                  styles: { theme: 'light' },
                }
              ),
            play: async ({ canvasElement }) => {
              const canvas = (0,
                _storybook_test__WEBPACK_IMPORTED_MODULE_2__.ux)(canvasElement),
                input = canvas.getByPlaceholderText('Search for testing...'),
                label = canvas.getByText('Test Search Input')
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
                  'testing search functionality',
                  { delay: 50 }
                ),
                await (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                  input
                ).toHaveValue('testing search functionality'))
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
            'SearchDemoStory',
            'InteractionTest',
          ]
      },
      './src/components/Icons/Search.tsx': (
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
          premiumStyles_icon = {
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
            color: 'rgb(75, 85, 99)',
          },
          premiumStyles_iconHover = {
            transform: 'scale(1.05)',
            filter: 'drop-shadow(0 2px 4px rgba(75, 85, 99, 0.3))',
            color: 'rgb(55, 65, 81)',
          },
          sacredStyles_icon = {
            transition: 'all 0.4s ease',
            filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))',
            color: 'rgba(255, 215, 0, 0.9)',
          },
          sacredStyles_iconHover = {
            transform: 'scale(1.1) rotate(5deg)',
            filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
            color: '#FFD700',
          },
          sacredStyles_glyph = {
            position: 'absolute',
            fontSize: '12px',
            color: 'rgba(255, 215, 0, 0.6)',
            transition: 'all 0.3s ease',
            opacity: 0,
            pointerEvents: 'none',
            animation: 'sacredGlyphRotate 20s linear infinite',
          },
          sacredStyles_glyphVisible = { opacity: 1 },
          SearchIcon = ({
            fontSize = 'medium',
            className = '',
            style = {},
            sacredtheme = !1,
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
            const size = (() => {
                switch (fontSize) {
                  case 'small':
                    return '18'
                  case 'large':
                    return '28'
                  default:
                    return '24'
                }
              })(),
              iconStyle = {
                ...(sacredtheme ? sacredStyles_icon : premiumStyles_icon),
                ...(isHovered && sacredtheme ? sacredStyles_iconHover : {}),
                ...(isHovered && !sacredtheme ? premiumStyles_iconHover : {}),
                ...style,
              }
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: { position: 'relative', display: 'inline-block' },
                onMouseEnter: () => setIsHovered(!0),
                onMouseLeave: () => setIsHovered(!1),
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'svg',
                    {
                      width: size,
                      height: size,
                      viewBox: '0 0 24 24',
                      fill: 'currentColor',
                      className,
                      style: iconStyle,
                      children: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'path',
                        {
                          d: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
                        }
                      ),
                    }
                  ),
                  sacredtheme &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      'div',
                      {
                        style: {
                          ...sacredStyles_glyph,
                          ...(isHovered && sacredStyles_glyphVisible),
                          top: '-8px',
                          right: '-8px',
                        },
                        children: glyph,
                      }
                    ),
                ],
              }
            )
          },
          __WEBPACK_DEFAULT_EXPORT__ = SearchIcon
        SearchIcon.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'SearchIcon',
          props: {
            fontSize: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "'small' | 'medium' | 'large'",
                elements: [
                  { name: 'literal', value: "'small'" },
                  { name: 'literal', value: "'medium'" },
                  { name: 'literal', value: "'large'" },
                ],
              },
              description: '',
              defaultValue: { value: "'medium'", computed: !1 },
            },
            className: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "''", computed: !1 },
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
            sacredtheme: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
          },
        }
      },
    },
  ]
)
