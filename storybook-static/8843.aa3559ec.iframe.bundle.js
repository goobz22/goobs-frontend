'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [8843],
    {
      './src/components/Field/Dropdown/Regular/index.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
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
          _Icons_ExpandMore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
            './src/components/Icons/ExpandMore.tsx'
          )
        const Dropdown = ({
            label,
            options,
            defaultValue,
            onChange,
            onBlur,
            onFocus,
            value: externalValue,
            showIdColumns = !1,
            helperText,
            styles,
          }) => {
            const [selectedValue, setSelectedValue] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(''),
              [focused, setFocused] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
              filteredOptions = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(
                () =>
                  showIdColumns
                    ? options
                    : options.filter(opt => {
                        const value = opt.value.toLowerCase()
                        return !(
                          'id' === value ||
                          '_id' === value ||
                          /^[0-9a-f]{24}$/.test(value)
                        )
                      }),
                [options, showIdColumns]
              )
            ;(0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
              void 0 !== externalValue
                ? setSelectedValue(externalValue)
                : defaultValue && setSelectedValue(defaultValue)
            }, [externalValue, defaultValue])
            const handleChange = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(
                event => {
                  if (null == styles ? void 0 : styles.disabled) return
                  const newValue = event.target.value
                  ;(setSelectedValue(newValue), onChange && onChange(event))
                },
                [onChange, null == styles ? void 0 : styles.disabled]
              ),
              handleBlur = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(
                e => {
                  ;(null == styles ? void 0 : styles.disabled) ||
                    (setFocused(!1), null == onBlur || onBlur(e))
                },
                [onBlur, null == styles ? void 0 : styles.disabled]
              ),
              handleFocus = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(
                e => {
                  ;(null == styles ? void 0 : styles.disabled) ||
                    (setFocused(!0), null == onFocus || onFocus(e))
                },
                [onFocus, null == styles ? void 0 : styles.disabled]
              ),
              {
                themeConfig,
                borderColor,
                labelColor,
                footerTextColor,
                transition,
              } = (0, _theme__WEBPACK_IMPORTED_MODULE_2__.AW)(styles, focused),
              componentStyles = {
                container: (0, _theme__WEBPACK_IMPORTED_MODULE_2__.ZZ)(styles),
                label: (0, _theme__WEBPACK_IMPORTED_MODULE_2__.Wh)(
                  labelColor,
                  themeConfig
                ),
                selectWrapper: { position: 'relative' },
                select: {
                  width: '100%',
                  minHeight: '40px',
                  appearance: 'none',
                  borderRadius:
                    (null == styles ? void 0 : styles.borderRadius) || '8px',
                  border: `${(null == styles ? void 0 : styles.borderWidth) || '1px'} solid ${borderColor}`,
                  padding:
                    (null == styles ? void 0 : styles.padding) ||
                    '8px 40px 8px 16px',
                  backgroundColor: themeConfig.background,
                  color: themeConfig.text,
                  fontFamily: themeConfig.fontFamily,
                  fontSize:
                    (null == styles ? void 0 : styles.fontSize) || '16px',
                  transition,
                  ...((null == styles ? void 0 : styles.disabled) && {
                    backgroundColor: '#E0E0E0',
                    color: '#9E9E9E',
                    borderColor: '#BDBDBD',
                    cursor: 'not-allowed',
                  }),
                },
                iconWrapper: {
                  position: 'absolute',
                  inset: '0 0 0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 12px',
                  pointerEvents: 'none',
                },
                icon: {
                  width: '20px',
                  height: '20px',
                  color: (null == styles ? void 0 : styles.disabled)
                    ? '#9E9E9E'
                    : themeConfig.text,
                },
                footerText: (0, _theme__WEBPACK_IMPORTED_MODULE_2__.En)(
                  footerTextColor,
                  themeConfig,
                  styles
                ),
              }
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: componentStyles.container,
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'label',
                    {
                      style: componentStyles.label,
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
                      style: componentStyles.selectWrapper,
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'select',
                          {
                            value: selectedValue,
                            onChange: handleChange,
                            onBlur: handleBlur,
                            onFocus: handleFocus,
                            disabled: null == styles ? void 0 : styles.disabled,
                            ...(0, _theme__WEBPACK_IMPORTED_MODULE_2__.SI)(
                              null == styles ? void 0 : styles.required
                            ),
                            style: componentStyles.select,
                            children: filteredOptions.map(option => {
                              const displayText = option.value
                                  ? option.value
                                      .replace(/_/g, ' ')
                                      .charAt(0)
                                      .toUpperCase() +
                                    option.value.replace(/_/g, ' ').slice(1)
                                  : '',
                                attributes = [
                                  option.attribute1,
                                  option.attribute2,
                                ].filter(Boolean),
                                attributeText =
                                  attributes.length > 0
                                    ? ` (${attributes.join(' | ')})`
                                    : ''
                              return (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                'option',
                                {
                                  value: option.value,
                                  children: [displayText, attributeText],
                                },
                                option.value
                              )
                            }),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'div',
                          {
                            style: componentStyles.iconWrapper,
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Icons_ExpandMore__WEBPACK_IMPORTED_MODULE_3__.A,
                              { style: componentStyles.icon }
                            ),
                          }
                        ),
                      ],
                    }
                  ),
                  helperText &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      'div',
                      {
                        style: componentStyles.footerText,
                        children: helperText,
                      }
                    ),
                ],
              }
            )
          },
          __WEBPACK_DEFAULT_EXPORT__ = Dropdown
        Dropdown.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'Dropdown',
          props: {
            label: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            options: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'DropdownOption' }],
                raw: 'DropdownOption[]',
              },
              description: '',
            },
            defaultValue: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            onChange: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.ChangeEvent<HTMLSelectElement>) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactChangeEvent',
                        raw: 'React.ChangeEvent<HTMLSelectElement>',
                        elements: [{ name: 'HTMLSelectElement' }],
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
                name: 'FocusEventHandler',
                elements: [{ name: 'HTMLSelectElement' }],
                raw: 'FocusEventHandler<HTMLSelectElement>',
              },
              description: '',
            },
            onFocus: {
              required: !1,
              tsType: {
                name: 'FocusEventHandler',
                elements: [{ name: 'HTMLSelectElement' }],
                raw: 'FocusEventHandler<HTMLSelectElement>',
              },
              description: '',
            },
            value: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            showIdColumns: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
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
      },
      './src/components/Field/Search/index.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
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
      './src/components/Toolbar/index.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.d(__webpack_exports__, { A: () => Toolbar })
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          Button = __webpack_require__('./src/components/Button/index.tsx')
        const getStyles = styles => {
            const isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              isDarkTheme = 'dark' === (null == styles ? void 0 : styles.theme)
            return {
              container: { display: 'flex', alignItems: 'center' },
              dividerContainer: {
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
              },
              divider: {
                height: '20px',
                borderLeft: isSacredTheme
                  ? '2px solid rgba(255, 215, 0, 0.6)'
                  : isDarkTheme
                    ? '2px solid rgba(156, 163, 175, 0.6)'
                    : '2px solid rgba(0, 0, 0, 0.6)',
                ...(isSacredTheme && {
                  filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))',
                }),
              },
              buttonsContainer: {
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0 16px',
              },
            }
          },
          VerticalDivider = ({ styles }) => {
            const computedStyles = getStyles(styles)
            return (0, jsx_runtime.jsx)('div', {
              style: computedStyles.divider,
            })
          },
          Left = ({ buttons, styles }) => {
            const computedStyles = getStyles(styles)
            return (0, jsx_runtime.jsxs)('div', {
              style: computedStyles.container,
              children: [
                (0, jsx_runtime.jsx)('div', {
                  style: computedStyles.dividerContainer,
                  children: (0, jsx_runtime.jsx)(VerticalDivider, { styles }),
                }),
                (0, jsx_runtime.jsx)('div', {
                  style: computedStyles.buttonsContainer,
                  children:
                    null == buttons
                      ? void 0
                      : buttons.map((btn, i) => {
                          const isDisabled = !!btn.disabled
                          return (0, jsx_runtime.jsx)(
                            Button.A,
                            {
                              text: btn.text,
                              onClick: btn.onClick,
                              disabled: isDisabled,
                              styles: {
                                theme: null == styles ? void 0 : styles.theme,
                              },
                            },
                            i
                          )
                        }),
                }),
              ],
            })
          },
          left = Left
        Left.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'Left',
          props: {
            buttons: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [{ name: 'ButtonProps' }],
                raw: 'ButtonProps[]',
              },
              description: 'Array of button configs to render on the left side',
            },
            styles: {
              required: !1,
              tsType: { name: 'ToolbarStyles' },
              description: '',
            },
          },
        }
        var Search = __webpack_require__(
          './src/components/Field/Search/index.tsx'
        )
        const LeftCenter = props => {
            const {
                label,
                placeholder,
                styles,
                value = '',
                onChange = () => {},
              } = props,
              computedStyles = (styles => {
                const isSacredTheme =
                  'sacred' === (null == styles ? void 0 : styles.theme)
                return {
                  container: {
                    display: 'flex',
                    alignItems: 'flex-end',
                    width: '24rem',
                    height: '3.5rem',
                    position: 'relative',
                  },
                  searchbarContainer: {
                    marginBottom: '0.5rem',
                    width: '100%',
                    ...(isSacredTheme && {
                      animation: 'sacred-glow 1.5s infinite alternate',
                      borderRadius: '0.375rem',
                    }),
                  },
                  glyph: {
                    content: '"𓂀"',
                    position: 'absolute',
                    top: '0.25rem',
                    right: '-20px',
                    fontSize: '1rem',
                    color: 'rgba(255, 215, 0, 0.3)',
                    animation: 'glyph-rotate 10s linear infinite',
                    zIndex: 10,
                    display: isSacredTheme ? 'block' : 'none',
                  },
                }
              })(styles),
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme)
            return (0, jsx_runtime.jsxs)('div', {
              style: computedStyles.container,
              children: [
                (0, jsx_runtime.jsx)('div', { style: computedStyles.glyph }),
                (0, jsx_runtime.jsx)('div', {
                  style: computedStyles.searchbarContainer,
                  children: (0, jsx_runtime.jsx)(Search.A, {
                    label: isSacredTheme ? 'Divine Search' : label,
                    placeholder: isSacredTheme
                      ? 'Seek ancient wisdom...'
                      : placeholder,
                    value,
                    onChange,
                    styles: { theme: null == styles ? void 0 : styles.theme },
                  }),
                }),
              ],
            })
          },
          leftCenter = LeftCenter
        LeftCenter.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'LeftCenter',
          props: {
            styles: {
              required: !1,
              tsType: { name: 'ToolbarStyles' },
              description: '',
            },
          },
          composes: ['Partial'],
        }
        var Regular = __webpack_require__(
          './src/components/Field/Dropdown/Regular/index.tsx'
        )
        function Right({ dropdown, styles }) {
          const computedStyles = {
              container: {
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                height: '100%',
                padding: '0 16px',
                gap: '10px',
                width: '12rem',
              },
            },
            dropdownWithTheme = {
              ...dropdown,
              styles: {
                theme: (null == styles ? void 0 : styles.theme) || 'light',
                ...dropdown.styles,
              },
            }
          return (0, jsx_runtime.jsx)('div', {
            style: computedStyles.container,
            children: (0, jsx_runtime.jsx)(Regular.A, { ...dropdownWithTheme }),
          })
        }
        const right = Right
        Right.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'Right',
          props: {
            dropdown: {
              required: !0,
              tsType: { name: 'DropdownProps' },
              description:
                "A single dropdown to render. (We'll render multiple <Right> if needed.)",
            },
            styles: {
              required: !1,
              tsType: { name: 'ToolbarStyles' },
              description: '',
            },
          },
        }
        var Typography = __webpack_require__(
            './src/components/Typography/index.tsx'
          ),
          FileCopy = __webpack_require__('./src/components/Icons/FileCopy.tsx'),
          Delete = __webpack_require__('./src/components/Icons/Delete.tsx'),
          Download = __webpack_require__('./src/components/Icons/Download.tsx'),
          Edit = __webpack_require__('./src/components/Icons/Edit.tsx')
        function ManageRow({
          handleClose = () => {},
          selectedRows = [],
          rows = [],
          onDuplicate,
          onDelete,
          onManage,
          onShow,
          onExport,
          styles,
        }) {
          const isSacredTheme =
            'sacred' === (null == styles ? void 0 : styles.theme)
          ;(0, react.useEffect)(() => {
            if (isSacredTheme) {
              const styleSheet = document.styleSheets[0],
                keyframes =
                  '\n        @keyframes manageRowGlowPulse {\n          0%, 100% { \n            border-color: rgba(255, 215, 0, 0.5);\n            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);\n          }\n          50% { \n            border-color: rgba(255, 215, 0, 0.8);\n            box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);\n          }\n        }\n      '
              try {
                styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
              } catch (e) {}
            }
          }, [isSacredTheme])
          const handleActionSelection = type => {
              switch (type) {
                case 'duplicate':
                  ;(null == onDuplicate || onDuplicate(), handleClose())
                  break
                case 'delete':
                  onDelete &&
                    (onDelete(), selectedRows.length > 0 && handleClose())
                  break
                case 'export':
                  ;(onExport ? onExport() : handleExport(), handleClose())
                  break
                case 'manage':
                  if (1 === selectedRows.length && onManage)
                    return void onManage()
                  break
                case 'show':
                  ;(null == onShow || onShow(), handleClose())
              }
            },
            handleExport = () => {
              const csvContent = rows
                  .filter(row => {
                    var _row_id
                    return selectedRows.includes(
                      null !== (_row_id = row.id) && void 0 !== _row_id
                        ? _row_id
                        : row._id
                    )
                  })
                  .map(row => Object.values(row).join(','))
                  .join('\n'),
                blob = new Blob([csvContent], {
                  type: 'text/csv;charset=utf-8;',
                }),
                link = document.createElement('a')
              if (void 0 !== link.download) {
                const url = URL.createObjectURL(blob)
                ;(link.setAttribute('href', url),
                  link.setAttribute('download', 'exported_data.csv'),
                  (link.style.visibility = 'hidden'),
                  document.body.appendChild(link),
                  link.click(),
                  document.body.removeChild(link))
              }
            }
          if (0 === selectedRows.length) return null
          const containerStyle = {
              zIndex: 1300,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '60px',
              minWidth: '100%',
              padding: '0 4px',
              userSelect: 'none',
              boxShadow:
                '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              borderRadius: '6px',
              backgroundColor: isSacredTheme
                ? 'rgba(0, 0, 0, 0.9)'
                : 'rgba(255, 255, 255, 1)',
              ...(isSacredTheme && {
                border: '2px solid rgba(255, 215, 0, 0.5)',
                backdropFilter: 'blur(8px)',
                animation: 'manageRowGlowPulse 3s ease-in-out infinite',
              }),
            },
            dividerStyle = {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              borderRight: isSacredTheme
                ? '1px solid rgba(255, 215, 0, 0.3)'
                : '1px solid rgba(229, 231, 235, 1)',
              paddingRight: '8px',
              marginRight: '8px',
            },
            actionButtonStyle = {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px',
              cursor: 'pointer',
              borderRadius: '6px',
              transition: 'colors 0.3s ease',
              userSelect: 'none',
            },
            iconContainerStyle = {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: isSacredTheme
                ? 'rgba(255, 215, 0, 1)'
                : 'rgba(0, 0, 0, 1)',
            }
          return (0, jsx_runtime.jsx)('div', {
            style: containerStyle,
            children: (0, jsx_runtime.jsxs)('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                width: '100%',
              },
              children: [
                (0, jsx_runtime.jsx)('div', {
                  style: {
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',
                  },
                  children: (0, jsx_runtime.jsx)(Typography.A, {
                    variant: 'merriparagraph',
                    text: `${selectedRows.length} ${1 === selectedRows.length ? 'item' : 'items'} selected`,
                    styles: {
                      color: isSacredTheme ? '#FFD700' : void 0,
                      theme: isSacredTheme ? 'sacred' : 'light',
                    },
                  }),
                }),
                (0, jsx_runtime.jsxs)('div', {
                  style: {
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2px',
                  },
                  children: [
                    1 === selectedRows.length &&
                      (onManage || onShow || onDuplicate) &&
                      (0, jsx_runtime.jsxs)('div', {
                        style: dividerStyle,
                        children: [
                          onManage &&
                            (0, jsx_runtime.jsx)('div', {
                              onClick: e => {
                                ;(e.stopPropagation(),
                                  handleActionSelection('manage'))
                              },
                              style: actionButtonStyle,
                              children: (0, jsx_runtime.jsxs)('div', {
                                style: iconContainerStyle,
                                children: [
                                  (0, jsx_runtime.jsx)(Edit.A, {}),
                                  (0, jsx_runtime.jsx)(Typography.A, {
                                    variant: 'merriparagraph',
                                    text: 'Manage',
                                    styles: {
                                      color: isSacredTheme ? '#FFD700' : void 0,
                                      theme: isSacredTheme ? 'sacred' : 'light',
                                    },
                                  }),
                                ],
                              }),
                            }),
                          onShow &&
                            (0, jsx_runtime.jsx)('div', {
                              onClick: e => {
                                ;(e.stopPropagation(),
                                  handleActionSelection('show'))
                              },
                              style: actionButtonStyle,
                              children: (0, jsx_runtime.jsxs)('div', {
                                style: iconContainerStyle,
                                children: [
                                  (0, jsx_runtime.jsxs)('svg', {
                                    xmlns: 'http://www.w3.org/2000/svg',
                                    width: '1em',
                                    height: '1em',
                                    viewBox: '0 0 24 24',
                                    fill: 'none',
                                    stroke: 'currentColor',
                                    strokeWidth: '2',
                                    strokeLinecap: 'round',
                                    strokeLinejoin: 'round',
                                    children: [
                                      (0, jsx_runtime.jsx)('path', {
                                        d: 'M1 12C2.73 16.11 7 20 12 20s9.27-3.89 11-8c-1.73-4.11-6-8-11-8S2.73 7.89 1 12z',
                                      }),
                                      (0, jsx_runtime.jsx)('circle', {
                                        cx: '12',
                                        cy: '12',
                                        r: '3',
                                      }),
                                    ],
                                  }),
                                  (0, jsx_runtime.jsx)(Typography.A, {
                                    variant: 'merriparagraph',
                                    text: 'Show',
                                    styles: {
                                      color: isSacredTheme ? '#FFD700' : void 0,
                                      theme: isSacredTheme ? 'sacred' : 'light',
                                    },
                                  }),
                                ],
                              }),
                            }),
                          onDuplicate &&
                            (0, jsx_runtime.jsx)('div', {
                              onClick: e => {
                                ;(e.stopPropagation(),
                                  handleActionSelection('duplicate'))
                              },
                              style: actionButtonStyle,
                              children: (0, jsx_runtime.jsxs)('div', {
                                style: iconContainerStyle,
                                children: [
                                  (0, jsx_runtime.jsx)(FileCopy.A, {}),
                                  (0, jsx_runtime.jsx)(Typography.A, {
                                    variant: 'merriparagraph',
                                    text: 'Duplicate',
                                    styles: {
                                      color: isSacredTheme ? '#FFD700' : void 0,
                                      theme: isSacredTheme ? 'sacred' : 'light',
                                    },
                                  }),
                                ],
                              }),
                            }),
                        ],
                      }),
                    (0, jsx_runtime.jsxs)('div', {
                      style: {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      },
                      children: [
                        onDelete &&
                          (0, jsx_runtime.jsx)('div', {
                            onClick: e => {
                              ;(e.stopPropagation(),
                                handleActionSelection('delete'))
                            },
                            style: actionButtonStyle,
                            children: (0, jsx_runtime.jsxs)('div', {
                              style: iconContainerStyle,
                              children: [
                                (0, jsx_runtime.jsx)(Delete.A, {}),
                                (0, jsx_runtime.jsx)(Typography.A, {
                                  variant: 'merriparagraph',
                                  text: 'Delete',
                                  styles: {
                                    color: isSacredTheme ? '#FFD700' : void 0,
                                    theme: isSacredTheme ? 'sacred' : 'light',
                                  },
                                }),
                              ],
                            }),
                          }),
                        onExport &&
                          (0, jsx_runtime.jsx)('div', {
                            onClick: e => {
                              ;(e.stopPropagation(),
                                handleActionSelection('export'))
                            },
                            style: actionButtonStyle,
                            children: (0, jsx_runtime.jsxs)('div', {
                              style: iconContainerStyle,
                              children: [
                                (0, jsx_runtime.jsx)(Download.A, {}),
                                (0, jsx_runtime.jsx)(Typography.A, {
                                  variant: 'merriparagraph',
                                  text: 'Export',
                                  styles: {
                                    color: isSacredTheme ? '#FFD700' : void 0,
                                    theme: isSacredTheme ? 'sacred' : 'light',
                                  },
                                }),
                              ],
                            }),
                          }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          })
        }
        const DataGrid_ManageRow = ManageRow
        ManageRow.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ManageRow',
          props: {
            handleClose: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
              defaultValue: { value: '() => {}', computed: !1 },
            },
            selectedRows: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [{ name: 'string' }],
                raw: 'string[]',
              },
              description: '',
              defaultValue: { value: '[]', computed: !1 },
            },
            rows: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{ [key: string]: unknown }',
                    signature: {
                      properties: [
                        {
                          key: { name: 'string' },
                          value: { name: 'unknown', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'Array<{ [key: string]: unknown }>',
              },
              description: '',
              defaultValue: { value: '[]', computed: !1 },
            },
            onDuplicate: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onDelete: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onManage: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onShow: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onExport: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'DataGridStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
          },
        }
        function RightCenter({
          selectedRows = [],
          rows = [],
          onDuplicate,
          onDelete,
          onManage,
          onShow,
          onExport,
          handleClose,
          styles,
        }) {
          const computedStyles = {
            container: {
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              height: '100%',
              padding: '0 16px',
            },
          }
          return (0, jsx_runtime.jsx)('div', {
            style: computedStyles.container,
            children: (0, jsx_runtime.jsx)(DataGrid_ManageRow, {
              selectedRows,
              rows,
              onDuplicate,
              onDelete,
              onManage,
              onShow,
              onExport,
              handleClose,
              styles: { theme: null == styles ? void 0 : styles.theme },
            }),
          })
        }
        const rightCenter = RightCenter
        RightCenter.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'RightCenter',
          props: {
            selectedRows: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [{ name: 'string' }],
                raw: 'string[]',
              },
              description: '',
              defaultValue: { value: '[]', computed: !1 },
            },
            rows: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{ [key: string]: unknown }',
                    signature: {
                      properties: [
                        {
                          key: { name: 'string' },
                          value: { name: 'unknown', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'Array<{ [key: string]: unknown }>',
              },
              description: '',
              defaultValue: { value: '[]', computed: !1 },
            },
            onDuplicate: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onDelete: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onManage: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onShow: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onExport: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            handleClose: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'ToolbarStyles' },
              description: '',
            },
          },
        }
        var theme = __webpack_require__('./src/theme/index.ts')
        const CustomToolbar = ({
            buttons,
            searchbarProps,
            rightCenterProps,
            dropdowns,
            styles,
          }) => {
            const computedStyles = (0, react.useMemo)(
                () => (0, theme.A5)(styles),
                [styles]
              ),
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme)
            return (
              (0, react.useEffect)(() => {
                const style = document.createElement('style')
                return (
                  (style.textContent =
                    '\n      @media (min-width: 768px) {\n        .toolbar-mobile-container {\n          display: none !important;\n        }\n        .toolbar-tablet-container {\n          display: flex !important;\n          align-items: center;\n          justify-content: space-between;\n          width: 100%;\n          gap: 1rem;\n        }\n      }\n      @media (min-width: 1280px) {\n        .toolbar-container {\n            flex-direction: row;\n            align-items: center;\n            justify-content: space-between;\n        }\n        .toolbar-tablet-container {\n            display: none !important;\n        }\n        .toolbar-desktop-left, .toolbar-desktop-right {\n          display: flex !important;\n          align-items: center;\n          gap: 1rem;\n          flex-wrap: wrap;\n        }\n      }\n    '),
                  document.head.appendChild(style),
                  () => {
                    document.head.removeChild(style)
                  }
                )
              }, []),
              (0, jsx_runtime.jsxs)('div', {
                style: computedStyles.container,
                className: 'toolbar-container',
                children: [
                  isSacredTheme &&
                    (0, jsx_runtime.jsx)('span', {
                      style: computedStyles.glyph,
                      children: '𓊗',
                    }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: computedStyles.desktopLeft,
                    className: 'toolbar-desktop-left',
                    children: [
                      (0, jsx_runtime.jsx)(left, { buttons, styles }),
                      searchbarProps &&
                        (0, jsx_runtime.jsx)(leftCenter, {
                          ...searchbarProps,
                          styles,
                        }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: computedStyles.desktopRight,
                    className: 'toolbar-desktop-right',
                    children: [
                      rightCenterProps &&
                        (0, jsx_runtime.jsx)(rightCenter, {
                          ...rightCenterProps,
                          styles,
                        }),
                      null == dropdowns
                        ? void 0
                        : dropdowns.map((dd, index) =>
                            (0, jsx_runtime.jsx)(
                              right,
                              { dropdown: dd, styles },
                              index
                            )
                          ),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: computedStyles.tabletContainer,
                    className: 'toolbar-tablet-container',
                    children: [
                      (0, jsx_runtime.jsx)('div', {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          flexWrap: 'wrap',
                        },
                        children: (0, jsx_runtime.jsx)(left, {
                          buttons,
                          styles,
                        }),
                      }),
                      (0, jsx_runtime.jsxs)('div', {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          flexWrap: 'wrap',
                        },
                        children: [
                          rightCenterProps &&
                            (0, jsx_runtime.jsx)(rightCenter, {
                              ...rightCenterProps,
                              styles,
                            }),
                          null == dropdowns
                            ? void 0
                            : dropdowns.map((dd, index) =>
                                (0, jsx_runtime.jsx)(
                                  right,
                                  { dropdown: dd, styles },
                                  index
                                )
                              ),
                        ],
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: computedStyles.mobileContainer,
                    className: 'toolbar-mobile-container',
                    children: [
                      (0, jsx_runtime.jsx)('div', {
                        style: computedStyles.mobileRow,
                        children: (0, jsx_runtime.jsx)(left, {
                          buttons,
                          styles,
                        }),
                      }),
                      rightCenterProps &&
                        (0, jsx_runtime.jsx)('div', {
                          children: (0, jsx_runtime.jsx)(rightCenter, {
                            ...rightCenterProps,
                            styles,
                          }),
                        }),
                      null == dropdowns
                        ? void 0
                        : dropdowns.map((dd, index) =>
                            (0, jsx_runtime.jsx)(
                              'div',
                              {
                                children: (0, jsx_runtime.jsx)(right, {
                                  dropdown: dd,
                                  styles,
                                }),
                              },
                              index
                            )
                          ),
                    ],
                  }),
                ],
              })
            )
          },
          Toolbar = CustomToolbar
        CustomToolbar.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'CustomToolbar',
          props: {
            buttons: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [{ name: 'ButtonProps' }],
                raw: 'ButtonProps[]',
              },
              description: '',
            },
            searchbarProps: {
              required: !1,
              tsType: { name: 'SearchbarProps' },
              description: '',
            },
            rightCenterProps: {
              required: !1,
              tsType: { name: 'RightCenterProps' },
              description: '',
            },
            dropdowns: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [{ name: 'DropdownProps' }],
                raw: 'DropdownProps[]',
              },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'ToolbarStyles' },
              description: '',
            },
          },
        }
      },
      './src/components/Typography/index.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.d(__webpack_exports__, {
          A: () => components_Typography,
        })
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          shared =
            (__webpack_require__(
              './node_modules/next/dist/compiled/react/index.js'
            ),
            __webpack_require__('./src/theme/shared.ts'))
        const typographyThemes = {
            light: {
              base: {
                margin: '0',
                padding: '0',
                lineHeight: '1.6',
                letterSpacing: '0.01em',
                position: 'relative',
                transition: shared.Ds.medium,
              },
              variants: {
                merrih1: {
                  fontSize: '2.25rem',
                  fontWeight: '700',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(17, 24, 39)',
                },
                merrih2: {
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(17, 24, 39)',
                },
                merrih3: {
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(17, 24, 39)',
                },
                merrih4: {
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(17, 24, 39)',
                },
                merrih5: {
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(17, 24, 39)',
                },
                merrih6: {
                  fontSize: '1rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(17, 24, 39)',
                },
                merriparagraph: {
                  fontSize: '1rem',
                  fontWeight: '400',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(55, 65, 81)',
                },
                merrihelperfooter: {
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(107, 114, 128)',
                },
              },
              alignment: {
                left: { textAlign: 'left' },
                center: { textAlign: 'center' },
                right: { textAlign: 'right' },
              },
              gutterBottom: { marginBottom: '1rem' },
              outline: {
                textStroke: '1px rgb(17, 24, 39)',
                WebkitTextStroke: '1px rgb(17, 24, 39)',
              },
            },
            dark: {
              base: {
                margin: '0',
                padding: '0',
                lineHeight: '1.6',
                letterSpacing: '0.01em',
                position: 'relative',
                transition: shared.Ds.medium,
              },
              variants: {
                merrih1: {
                  fontSize: '2.25rem',
                  fontWeight: '700',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(243, 244, 246)',
                },
                merrih2: {
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(243, 244, 246)',
                },
                merrih3: {
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(243, 244, 246)',
                },
                merrih4: {
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(243, 244, 246)',
                },
                merrih5: {
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(243, 244, 246)',
                },
                merrih6: {
                  fontSize: '1rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(243, 244, 246)',
                },
                merriparagraph: {
                  fontSize: '1rem',
                  fontWeight: '400',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(209, 213, 219)',
                },
                merrihelperfooter: {
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(156, 163, 175)',
                },
              },
              alignment: {
                left: { textAlign: 'left' },
                center: { textAlign: 'center' },
                right: { textAlign: 'right' },
              },
              gutterBottom: { marginBottom: '1rem' },
              outline: {
                textStroke: '1px rgb(243, 244, 246)',
                WebkitTextStroke: '1px rgb(243, 244, 246)',
              },
            },
            sacred: {
              base: {
                margin: '0',
                padding: '0',
                lineHeight: '1.6',
                letterSpacing: '0.02em',
                position: 'relative',
                transition: shared.Ds.premium,
              },
              variants: {
                merrih1: {
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  fontFamily: 'Cinzel, serif',
                  color: '#FFD700',
                  textShadow:
                    '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)',
                  animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
                },
                merrih2: {
                  fontSize: '2rem',
                  fontWeight: '600',
                  fontFamily: 'Cinzel, serif',
                  color: '#FFD700',
                  textShadow:
                    '0 0 15px rgba(255, 215, 0, 0.7), 0 0 30px rgba(255, 215, 0, 0.3)',
                  animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
                },
                merrih3: {
                  fontSize: '1.75rem',
                  fontWeight: '600',
                  fontFamily: 'Cinzel, serif',
                  color: '#FFD700',
                  textShadow:
                    '0 0 12px rgba(255, 215, 0, 0.6), 0 0 25px rgba(255, 215, 0, 0.2)',
                  animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
                },
                merrih4: {
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  fontFamily: 'Cinzel, serif',
                  color: '#FFD700',
                  textShadow:
                    '0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.2)',
                  animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
                },
                merrih5: {
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  fontFamily: 'Cinzel, serif',
                  color: '#FFD700',
                  textShadow:
                    '0 0 8px rgba(255, 215, 0, 0.4), 0 0 16px rgba(255, 215, 0, 0.2)',
                  animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
                },
                merrih6: {
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  fontFamily: 'Cinzel, serif',
                  color: '#FFD700',
                  textShadow:
                    '0 0 6px rgba(255, 215, 0, 0.3), 0 0 12px rgba(255, 215, 0, 0.1)',
                  animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
                },
                merriparagraph: {
                  fontSize: '1rem',
                  fontWeight: '400',
                  fontFamily: 'Cinzel, serif',
                  color: 'rgba(245, 245, 220, 0.9)',
                  textShadow: '0 0 5px rgba(255, 215, 0, 0.2)',
                },
                merrihelperfooter: {
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  fontFamily: 'Cinzel, serif',
                  color: 'rgba(245, 245, 220, 0.7)',
                  textShadow: '0 0 3px rgba(255, 215, 0, 0.1)',
                },
              },
              alignment: {
                left: { textAlign: 'left' },
                center: { textAlign: 'center' },
                right: { textAlign: 'right' },
              },
              gutterBottom: { marginBottom: '1rem' },
              outline: {
                textStroke: '1px #FFD700',
                WebkitTextStroke: '1px #FFD700',
              },
            },
          },
          getTypographyStyles = styles => {
            const themeConfig = (styles => {
                const theme =
                    (null == styles ? void 0 : styles.theme) || 'light',
                  baseTheme = typographyThemes[theme]
                if (!styles) return baseTheme
                const variant = styles.variant || 'merriparagraph',
                  baseVariant = baseTheme.variants[variant]
                return {
                  ...baseTheme,
                  variants: {
                    ...baseTheme.variants,
                    [variant]: {
                      ...baseVariant,
                      fontSize: styles.fontSize || baseVariant.fontSize,
                      fontWeight: styles.fontWeight || baseVariant.fontWeight,
                      fontFamily: styles.fontFamily || baseVariant.fontFamily,
                      color: styles.color || baseVariant.color,
                      textShadow: styles.textShadow || baseVariant.textShadow,
                      animation: baseVariant.animation,
                    },
                  },
                }
              })(styles),
              variant =
                (null == styles ? void 0 : styles.variant) || 'merriparagraph',
              align = (null == styles ? void 0 : styles.textAlign) || 'left',
              variantStyle = themeConfig.variants[variant],
              alignmentStyle = themeConfig.alignment[align]
            return {
              container: {
                ...themeConfig.base,
                ...variantStyle,
                ...alignmentStyle,
                ...((null == styles ? void 0 : styles.gutterBottom) &&
                  themeConfig.gutterBottom),
                ...((null == styles ? void 0 : styles.outline) &&
                  themeConfig.outline),
                fontStyle: null == styles ? void 0 : styles.fontStyle,
                margin: null == styles ? void 0 : styles.margin,
                marginTop: null == styles ? void 0 : styles.marginTop,
                marginBottom: null == styles ? void 0 : styles.marginBottom,
                marginLeft: null == styles ? void 0 : styles.marginLeft,
                marginRight: null == styles ? void 0 : styles.marginRight,
                padding: null == styles ? void 0 : styles.padding,
                paddingTop: null == styles ? void 0 : styles.paddingTop,
                paddingBottom: null == styles ? void 0 : styles.paddingBottom,
                paddingLeft: null == styles ? void 0 : styles.paddingLeft,
                paddingRight: null == styles ? void 0 : styles.paddingRight,
                width: null == styles ? void 0 : styles.width,
                maxWidth: null == styles ? void 0 : styles.maxWidth,
                minWidth: null == styles ? void 0 : styles.minWidth,
                height: null == styles ? void 0 : styles.height,
                maxHeight: null == styles ? void 0 : styles.maxHeight,
                minHeight: null == styles ? void 0 : styles.minHeight,
                position: null == styles ? void 0 : styles.position,
                transition: (
                  null == styles ? void 0 : styles.transitionDuration
                )
                  ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
                  : themeConfig.base.transition,
                animation: null == styles ? void 0 : styles.animation,
                animationDelay: null == styles ? void 0 : styles.animationDelay,
              },
            }
          }
        var console = __webpack_require__(
          './node_modules/console-browserify/index.js'
        )
        const variantMapping = {
            merrih1: 'h1',
            merrih2: 'h2',
            merrih3: 'h3',
            merrih4: 'h4',
            merrih5: 'h5',
            merrih6: 'h6',
            merriparagraph: 'p',
            merrihelperfooter: 'p',
          },
          Typography = ({
            text,
            children,
            variant = 'merriparagraph',
            styles,
            ...rest
          }) => {
            console.log('Typography component rendered with props:', {
              variant,
              text: text || children,
              styles,
            })
            const mergedStyles = { variant, ...styles },
              computedStyles = getTypographyStyles(mergedStyles),
              Component = variantMapping[variant] || 'p',
              content = children || text
            return (0, jsx_runtime.jsx)(Component, {
              style: computedStyles.container,
              ...rest,
              children: content,
            })
          }
        Typography.displayName = 'Typography'
        const components_Typography = Typography
        Typography.__docgenInfo = {
          description:
            'A component for rendering text with consistent styling and theming.',
          methods: [],
          displayName: 'Typography',
          props: {
            text: {
              required: !1,
              tsType: { name: 'string' },
              description:
                'The text content to display. Can be used instead of children.',
            },
            children: {
              required: !1,
              tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
              description:
                'The content to display. Takes precedence over the `text` prop.',
            },
            variant: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "| 'merriparagraph'\n| 'merrihelperfooter'\n| 'merrih1'\n| 'merrih2'\n| 'merrih3'\n| 'merrih4'\n| 'merrih5'\n| 'merrih6'",
                elements: [
                  { name: 'literal', value: "'merriparagraph'" },
                  { name: 'literal', value: "'merrihelperfooter'" },
                  { name: 'literal', value: "'merrih1'" },
                  { name: 'literal', value: "'merrih2'" },
                  { name: 'literal', value: "'merrih3'" },
                  { name: 'literal', value: "'merrih4'" },
                  { name: 'literal', value: "'merrih5'" },
                  { name: 'literal', value: "'merrih6'" },
                ],
              },
              description:
                'The typography variant to apply. Determines the style and semantic tag.',
              defaultValue: { value: "'merriparagraph'", computed: !1 },
            },
            styles: {
              required: !1,
              tsType: { name: 'TypographyStyles' },
              description:
                'Custom styles to apply to the component using the theme system.',
            },
          },
        }
      },
    },
  ]
)
