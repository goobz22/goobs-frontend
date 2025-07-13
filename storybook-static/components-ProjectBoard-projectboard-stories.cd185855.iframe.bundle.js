'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [2083],
    {
      './src/components/Dialog/index.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.d(__webpack_exports__, {
          A: () => components_Dialog,
        })
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          shared = __webpack_require__('./src/theme/shared.ts')
        const dialogThemes = {
            light: {
              backdrop: {
                position: 'fixed',
                inset: '0',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(2px)',
              },
              dialog: {
                position: 'relative',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                boxShadow: shared.I4.light.large,
                border: '1px solid rgba(226, 232, 240, 0.8)',
                backdropFilter: 'blur(8px)',
              },
              transition: shared.Ds.medium,
            },
            dark: {
              backdrop: {
                position: 'fixed',
                inset: '0',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(2px)',
              },
              dialog: {
                position: 'relative',
                backgroundColor: 'rgba(31, 41, 55, 0.95)',
                borderRadius: '16px',
                boxShadow:
                  '0 8px 25px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(75, 85, 99, 0.8)',
                backdropFilter: 'blur(8px)',
              },
              transition: shared.Ds.medium,
            },
            sacred: {
              backdrop: {
                position: 'fixed',
                inset: '0',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(3px)',
              },
              dialog: {
                position: 'relative',
                backgroundColor: 'rgba(10, 10, 10, 0.95)',
                borderRadius: '12px',
                boxShadow: shared.I4.sacred.large,
                border: '2px solid rgba(255, 215, 0, 0.4)',
                backdropFilter: 'blur(4px)',
                backgroundImage:
                  '\n        radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%),\n        radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.05) 0%, transparent 50%)\n      ',
              },
              transition: shared.Ds.premium,
            },
          },
          getDialogStyles = styles => {
            const themeConfig = (styles => {
              const theme = (null == styles ? void 0 : styles.theme) || 'light',
                baseTheme = dialogThemes[theme]
              return styles
                ? {
                    backdrop: {
                      ...baseTheme.backdrop,
                      backgroundColor:
                        styles.backdropBackgroundColor ||
                        baseTheme.backdrop.backgroundColor,
                      backdropFilter: styles.backdropBlur
                        ? `blur(${styles.backdropBlur})`
                        : baseTheme.backdrop.backdropFilter,
                      zIndex: styles.zIndex || baseTheme.backdrop.zIndex,
                    },
                    dialog: {
                      ...baseTheme.dialog,
                      backgroundColor:
                        styles.backgroundColor ||
                        baseTheme.dialog.backgroundColor,
                      border: styles.borderColor
                        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
                        : baseTheme.dialog.border,
                      borderRadius:
                        styles.borderRadius || baseTheme.dialog.borderRadius,
                      boxShadow: styles.boxShadow || baseTheme.dialog.boxShadow,
                      backdropFilter:
                        styles.backdropFilter ||
                        baseTheme.dialog.backdropFilter,
                      backgroundImage:
                        styles.backgroundImage ||
                        baseTheme.dialog.backgroundImage,
                    },
                    transition: styles.transitionDuration
                      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
                      : baseTheme.transition,
                  }
                : baseTheme
            })(styles)
            return {
              backdrop: {
                position: themeConfig.backdrop.position,
                inset: themeConfig.backdrop.inset,
                zIndex: themeConfig.backdrop.zIndex,
                display: themeConfig.backdrop.display,
                alignItems: themeConfig.backdrop.alignItems,
                justifyContent: themeConfig.backdrop.justifyContent,
                backgroundColor: themeConfig.backdrop.backgroundColor,
                backdropFilter: themeConfig.backdrop.backdropFilter,
              },
              dialog: {
                position: themeConfig.dialog.position,
                backgroundColor: themeConfig.dialog.backgroundColor,
                borderRadius: themeConfig.dialog.borderRadius,
                boxShadow: themeConfig.dialog.boxShadow,
                border: themeConfig.dialog.border,
                backdropFilter: themeConfig.dialog.backdropFilter,
                backgroundImage: themeConfig.dialog.backgroundImage,
                transition: themeConfig.transition,
                maxWidth: null == styles ? void 0 : styles.maxWidth,
                width:
                  (null == styles ? void 0 : styles.width) ||
                  ((null == styles ? void 0 : styles.fullWidth)
                    ? '100%'
                    : void 0),
                minWidth: null == styles ? void 0 : styles.minWidth,
                height: null == styles ? void 0 : styles.height,
                maxHeight: null == styles ? void 0 : styles.maxHeight,
                minHeight: null == styles ? void 0 : styles.minHeight,
                padding: null == styles ? void 0 : styles.padding,
                margin: null == styles ? void 0 : styles.margin,
              },
            }
          },
          Dialog = ({ open, onClose, children, styles }) => {
            const dialogRef = (0, react.useRef)(null)
            if (
              ((0, react.useEffect)(() => {
                const handleKeydown = event => {
                  'Escape' === event.key && onClose()
                }
                return (
                  open
                    ? document.addEventListener('keydown', handleKeydown)
                    : document.removeEventListener('keydown', handleKeydown),
                  () => {
                    document.removeEventListener('keydown', handleKeydown)
                  }
                )
              }, [open, onClose]),
              !open)
            )
              return null
            const computedStyles = getDialogStyles(styles)
            return (0, jsx_runtime.jsx)('div', {
              style: computedStyles.backdrop,
              onClick: onClose,
              children: (0, jsx_runtime.jsx)('div', {
                ref: dialogRef,
                style: computedStyles.dialog,
                onClick: e => e.stopPropagation(),
                children,
              }),
            })
          },
          components_Dialog = Dialog
        Dialog.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'Dialog',
          props: {
            open: {
              required: !0,
              tsType: { name: 'boolean' },
              description: 'Whether the dialog is open',
            },
            onClose: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: 'Function to call when the dialog should close',
            },
            children: {
              required: !0,
              tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
              description: 'The content to display in the dialog',
            },
            styles: {
              required: !1,
              tsType: { name: 'DialogStyles' },
              description:
                'Custom styles to apply to the dialog using the theme system',
            },
          },
        }
      },
      './src/components/Field/Dropdown/Searchable/index.tsx': (
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
          _Icons_ArrowDropDown__WEBPACK_IMPORTED_MODULE_3__ =
            __webpack_require__('./src/components/Icons/ArrowDropDown.tsx')
        const SearchableDropdown = ({
            label,
            options,
            defaultValue,
            onChange,
            placeholder,
            helperText,
            styles,
          }) => {
            const [isOpen, setIsOpen] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
              [selectedOption, setSelectedOption] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(null),
              [searchTerm, setSearchTerm] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(''),
              [history, setHistory] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)([]),
              [activeTab, setActiveTab] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)('options'),
              containerRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(
                null
              ),
              componentStyles = ((styles, isOpen) => {
                const {
                    themeConfig,
                    borderColor,
                    labelColor,
                    footerTextColor,
                    transition,
                  } = (0, _theme__WEBPACK_IMPORTED_MODULE_2__.AW)(
                    styles,
                    isOpen
                  ),
                  sacredTheme =
                    'sacred' === (null == styles ? void 0 : styles.theme)
                return {
                  container: (0, _theme__WEBPACK_IMPORTED_MODULE_2__.ZZ)(
                    styles
                  ),
                  label: (0, _theme__WEBPACK_IMPORTED_MODULE_2__.Wh)(
                    labelColor,
                    themeConfig
                  ),
                  trigger: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: (null == styles ? void 0 : styles.height) || '40px',
                    padding:
                      (null == styles ? void 0 : styles.padding) || '8px 16px',
                    borderRadius:
                      (null == styles ? void 0 : styles.borderRadius) || '8px',
                    border: `${(null == styles ? void 0 : styles.borderWidth) || '1px'} solid ${borderColor}`,
                    transition,
                    backgroundColor: themeConfig.background,
                    color: themeConfig.text,
                    cursor: 'pointer',
                    outline: 'none',
                    fontFamily: themeConfig.fontFamily,
                    fontSize:
                      (null == styles ? void 0 : styles.fontSize) || '16px',
                  },
                  listbox: {
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '100%',
                    backgroundColor: themeConfig.background,
                    border: `1px solid ${borderColor}`,
                    marginTop: '4px',
                    borderRadius:
                      (null == styles ? void 0 : styles.borderRadius) || '8px',
                    zIndex: 10,
                    boxShadow: sacredTheme
                      ? '0 10px 30px rgba(255, 215, 0, 0.3)'
                      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    maxHeight: '240px',
                    overflowY: 'auto',
                  },
                  tabContainer: {
                    display: 'flex',
                    borderBottom: `1px solid ${borderColor}`,
                  },
                  tabButton: isActive => ({
                    flex: 1,
                    padding: '8px 16px',
                    backgroundColor: isActive
                      ? sacredTheme
                        ? 'rgba(255, 215, 0, 0.2)'
                        : '#F3F4F6'
                      : 'transparent',
                    color: themeConfig.text,
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: themeConfig.fontFamily,
                    fontSize: '14px',
                    transition,
                  }),
                  searchContainer: { padding: '8px' },
                  searchInput: {
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${borderColor}`,
                    borderRadius: '4px',
                    backgroundColor: themeConfig.background,
                    color: themeConfig.text,
                    fontFamily: themeConfig.fontFamily,
                    fontSize: '14px',
                    outline: 'none',
                  },
                  option: {
                    padding: '8px 16px',
                    cursor: 'pointer',
                    color: themeConfig.text,
                    fontFamily: themeConfig.fontFamily,
                    fontSize: '14px',
                    transition,
                    '&:hover': {
                      backgroundColor: sacredTheme
                        ? 'rgba(255, 215, 0, 0.1)'
                        : '#F3F4F6',
                    },
                  },
                  footerText: (0, _theme__WEBPACK_IMPORTED_MODULE_2__.En)(
                    footerTextColor,
                    themeConfig,
                    styles
                  ),
                }
              })(styles, isOpen)
            ;((0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
              const defaultOption = options.find(
                option => option.value === defaultValue
              )
              defaultOption && setSelectedOption(defaultOption)
            }, [defaultValue, options]),
              (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
                const handleClickOutside = event => {
                  containerRef.current &&
                    !containerRef.current.contains(event.target) &&
                    setIsOpen(!1)
                }
                return (
                  document.addEventListener('mousedown', handleClickOutside),
                  () =>
                    document.removeEventListener(
                      'mousedown',
                      handleClickOutside
                    )
                )
              }, []))
            const handleSelect = option => {
                ;(setSelectedOption(option),
                  setSearchTerm(''),
                  setIsOpen(!1),
                  null == onChange || onChange(option),
                  setHistory(prevHistory =>
                    [
                      option,
                      ...prevHistory.filter(h => h.value !== option.value),
                    ].slice(0, 5)
                  ))
              },
              filteredOptions = options.filter(option =>
                option.value.toLowerCase().includes(searchTerm.toLowerCase())
              )
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: componentStyles.container,
                ref: containerRef,
                children: [
                  label &&
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
                      style: { position: 'relative' },
                      children: [
                        (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'button',
                          {
                            type: 'button',
                            style: componentStyles.trigger,
                            onClick: () =>
                              !(null == styles ? void 0 : styles.disabled) &&
                              setIsOpen(!isOpen),
                            disabled: null == styles ? void 0 : styles.disabled,
                            ...(0, _theme__WEBPACK_IMPORTED_MODULE_2__.SI)(
                              null == styles ? void 0 : styles.required
                            ),
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                'span',
                                {
                                  children: selectedOption
                                    ? selectedOption.value
                                    : placeholder,
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                _Icons_ArrowDropDown__WEBPACK_IMPORTED_MODULE_3__.A,
                                {
                                  style: {
                                    transition: 'transform 0.2s',
                                    transform: isOpen
                                      ? 'rotate(180deg)'
                                      : 'rotate(0deg)',
                                  },
                                }
                              ),
                            ],
                          }
                        ),
                        isOpen &&
                          (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                            'div',
                            {
                              style: componentStyles.listbox,
                              children: [
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                  'div',
                                  {
                                    style: componentStyles.tabContainer,
                                    children: [
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                        'button',
                                        {
                                          onClick: () =>
                                            setActiveTab('options'),
                                          style: componentStyles.tabButton(
                                            'options' === activeTab
                                          ),
                                          children: 'Options',
                                        }
                                      ),
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                        'button',
                                        {
                                          onClick: () =>
                                            setActiveTab('history'),
                                          style: componentStyles.tabButton(
                                            'history' === activeTab
                                          ),
                                          children: 'History',
                                        }
                                      ),
                                    ],
                                  }
                                ),
                                'options' === activeTab &&
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                    'div',
                                    {
                                      children: [
                                        (0,
                                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                          'div',
                                          {
                                            style:
                                              componentStyles.searchContainer,
                                            children: (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              'input',
                                              {
                                                type: 'text',
                                                placeholder: 'Search...',
                                                style:
                                                  componentStyles.searchInput,
                                                value: searchTerm,
                                                onChange: e =>
                                                  setSearchTerm(e.target.value),
                                              }
                                            ),
                                          }
                                        ),
                                        filteredOptions.map(option =>
                                          (0,
                                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                            'div',
                                            {
                                              style: componentStyles.option,
                                              onClick: () =>
                                                handleSelect(option),
                                              children: option.value,
                                            },
                                            option.uniqueKey || option.value
                                          )
                                        ),
                                      ],
                                    }
                                  ),
                                'history' === activeTab &&
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    'div',
                                    {
                                      children: history.map(option =>
                                        (0,
                                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                          'div',
                                          {
                                            style: componentStyles.option,
                                            onClick: () => handleSelect(option),
                                            children: option.value,
                                          },
                                          option.uniqueKey || option.value
                                        )
                                      ),
                                    }
                                  ),
                              ],
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
          __WEBPACK_DEFAULT_EXPORT__ = SearchableDropdown
        SearchableDropdown.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'SearchableDropdown',
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
                raw: '(value: DropdownOption | null) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'union',
                        raw: 'DropdownOption | null',
                        elements: [
                          { name: 'DropdownOption' },
                          { name: 'null' },
                        ],
                      },
                      name: 'value',
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
      './src/components/Field/Text/index.tsx': (
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
      './src/components/Icons/MoreVert.tsx': (
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
          MoreVertIcon = ({ sacredtheme = !1, style = {}, ...props }) => {
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
            const iconStyle = {
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
                      xmlns: 'http://www.w3.org/2000/svg',
                      height: '24',
                      viewBox: '0 0 24 24',
                      width: '24',
                      fill: 'currentColor',
                      style: iconStyle,
                      ...props,
                      children: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'path',
                        {
                          d: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
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
          __WEBPACK_DEFAULT_EXPORT__ = MoreVertIcon
        MoreVertIcon.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'MoreVertIcon',
          props: {
            sacredtheme: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
            style: {
              defaultValue: { value: '{}', computed: !1 },
              required: !1,
            },
          },
        }
      },
      './src/components/ProjectBoard/projectboard.stories.tsx': (
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
            default: () => projectboard_stories,
          }))
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          esm_react = __webpack_require__('./node_modules/jotai/esm/react.mjs'),
          vanilla = __webpack_require__('./node_modules/jotai/esm/vanilla.mjs')
        const columnsAtom = (0, vanilla.eU)([]),
          store = (0, vanilla.y$)()
        function JotaiProvider({ children }) {
          return (0, jsx_runtime.jsx)(esm_react.Kq, { store, children })
        }
        ;(store.set(columnsAtom, []),
          (JotaiProvider.__docgenInfo = {
            description:
              'A Jotai Provider component that uses a custom store to prevent\n"multiple instances" error in Next.js applications.',
            methods: [],
            displayName: 'JotaiProvider',
            props: {
              children: {
                required: !0,
                tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
                description: '',
              },
            },
          }))
        var Toolbar = __webpack_require__('./src/components/Toolbar/index.tsx'),
          Dialog = __webpack_require__('./src/components/Dialog/index.tsx'),
          Close = __webpack_require__('./src/components/Icons/Close.tsx'),
          Typography = __webpack_require__(
            './src/components/Typography/index.tsx'
          ),
          Searchable = __webpack_require__(
            './src/components/Field/Dropdown/Searchable/index.tsx'
          ),
          MultiSelect = __webpack_require__(
            './src/components/Field/Dropdown/MultiSelect/index.tsx'
          ),
          ComplexTextEditor = __webpack_require__(
            './src/components/ComplexTextEditor/index.tsx'
          ),
          Button = __webpack_require__('./src/components/Button/index.tsx'),
          Text = __webpack_require__('./src/components/Field/Text/index.tsx')
        const SACRED_GLYPHS = ['𓁹', '𓂀', '𓊖', '𓊹'],
          AdministratorAddTaskCompanyDropdown = ({
            open,
            onClose,
            onAdd,
            statuses,
            subStatuses,
            topics,
            schedulingQueues,
            knowledgebaseArticles,
            severityLevels,
            rawCompanies,
            createdUserId,
            sacredtheme = !1,
          }) => {
            var _companyOptions_find,
              _severityOptions_find,
              _statusOptions_find,
              _queueOptions_find,
              _finalSubStatusOptions_find
            const [selectedCompanyId, setSelectedCompanyId] = (0,
              react.useState)(''),
              [selectedSeverityId, setSelectedSeverityId] = (0, react.useState)(
                ''
              ),
              [selectedQueueId, setSelectedQueueId] = (0, react.useState)(''),
              [selectedStatus, setSelectedStatus] = (0, react.useState)(''),
              [selectedStatusId, setSelectedStatusId] = (0, react.useState)(''),
              [selectedSubStatusId, setSelectedSubStatusId] = (0,
              react.useState)(''),
              [selectedTopicIds, setSelectedTopicIds] = (0, react.useState)([]),
              [selectedArticleIds, setSelectedArticleIds] = (0, react.useState)(
                []
              ),
              [taskTitle, setTaskTitle] = (0, react.useState)(''),
              [taskDescription, setTaskDescription] = (0, react.useState)(''),
              [isCloseHovered, setCloseHovered] = (0, react.useState)(!1),
              styles = (sacredtheme => ({
                dialog: {
                  width: '100%',
                  '@media (min-width: 640px)': { width: '700px' },
                  margin: '1rem auto',
                  pointerEvents: 'auto',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  ...(sacredtheme && {
                    border: '2px solid rgba(255, 215, 0, 0.5)',
                    boxShadow: '0 0 1.5rem rgba(255, 215, 0, 0.3)',
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    animation: 'add-task-glow-pulse 2s infinite alternate',
                  }),
                },
                glyph: {
                  position: 'absolute',
                  top: '0.75rem',
                  fontSize: '1.125rem',
                  color: 'rgba(255, 215, 0, 0.3)',
                  zIndex: 10,
                  animation: 'add-task-float-glyph 5s infinite alternate',
                },
                closeButton: {
                  position: 'absolute',
                  right: '0.5rem',
                  top: '0.5rem',
                  zIndex: 20,
                  padding: '0.25rem',
                  borderRadius: '9999px',
                  color: sacredtheme ? '#FFD700' : '#6B7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                },
                closeButtonHover: {
                  color: sacredtheme ? '#FBBF24' : '#1F2937',
                },
                header: {
                  padding: '0.75rem',
                  ...(sacredtheme && {
                    borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
                    backgroundColor: 'rgba(255, 215, 0, 0.05)',
                  }),
                },
                title: {
                  marginBottom: '0.75rem',
                  ...(sacredtheme && {
                    fontFamily: 'Cinzel, serif',
                    letterSpacing: '0.05em',
                    textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
                    color: '#FFD700',
                  }),
                },
                formContainer: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                },
                row: {
                  display: 'flex',
                  flexDirection: 'column',
                  '@media (min-width: 640px)': { flexDirection: 'row' },
                  gap: '0.25rem',
                },
                col: {
                  flex: '1 1 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                },
                buttonContainer: {
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                  flexDirection: 'column',
                  '@media (min-width: 640px)': { flexDirection: 'row' },
                },
              }))(sacredtheme),
              companyOptions = rawCompanies.map(c => ({
                value: c.companyName,
                attribute1: c._id,
              })),
              severityOptions = severityLevels.map(sl => ({
                value: String(sl.severityLevel),
                attribute1: sl.description || '',
                attribute2: sl._id,
              })),
              statusOptions = statuses.map(s => ({
                value: s.status,
                attribute1: s._id,
              })),
              filteredSubStatusOptions = subStatuses
                .filter(s => {
                  var _statuses_find
                  if (!selectedStatus) return !1
                  const selectedStatusId =
                    null ===
                      (_statuses_find = statuses.find(
                        status => status.status === selectedStatus
                      )) || void 0 === _statuses_find
                      ? void 0
                      : _statuses_find._id
                  return s.statusId === selectedStatusId
                })
                .map(s => {
                  var _statuses_find
                  const associatedStatus =
                    (null ===
                      (_statuses_find = statuses.find(
                        status => status._id === s.statusId
                      )) || void 0 === _statuses_find
                      ? void 0
                      : _statuses_find.status) || ''
                  return {
                    value: s.subStatus,
                    attribute1: associatedStatus,
                    attribute2: s._id,
                  }
                }),
              finalSubStatusOptions =
                filteredSubStatusOptions.length > 0
                  ? filteredSubStatusOptions
                  : selectedStatus
                    ? [
                        {
                          value: 'No substatuses available for this status',
                          attribute1: '',
                          attribute2: '',
                        },
                      ]
                    : [],
              queueOptions = schedulingQueues.map(q => ({
                value: q.queueName,
                attribute1: q._id,
              }))
            react.useEffect(() => {
              setSelectedSubStatusId('')
            }, [selectedStatus])
            const handleSubmit = (0, react.useCallback)(() => {
              if (
                !selectedSeverityId ||
                !selectedStatusId ||
                !selectedSubStatusId
              )
                return void alert('Please fill out all required fields.')
              const newTaskData = {
                title: taskTitle,
                description: taskDescription,
                topicIds: selectedTopicIds,
                articleIds: selectedArticleIds,
                severityId: selectedSeverityId,
                schedulingQueueId: selectedQueueId,
                statusId: selectedStatusId,
                substatusId: selectedSubStatusId,
                employeeIds: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                closedAt: new Date(),
                createdBy: createdUserId,
                comments: [],
                commentIds: [],
                customerAssigned: '',
                severity: '',
                schedulingQueue: '',
                status: '',
                subStatus: '',
                topicLabels: [],
                kbArticles: [],
                teamMember: '',
                nextActionDate: '',
                companyId: selectedCompanyId,
                customerId: '',
                editHistory: [],
              }
              onAdd(newTaskData)
            }, [
              taskTitle,
              taskDescription,
              selectedTopicIds,
              selectedArticleIds,
              selectedSeverityId,
              selectedQueueId,
              selectedStatusId,
              selectedSubStatusId,
              selectedCompanyId,
              createdUserId,
              onAdd,
            ])
            return (0, jsx_runtime.jsx)(Dialog.A, {
              open,
              onClose,
              styles: { theme: sacredtheme ? 'sacred' : 'light' },
              children: (0, jsx_runtime.jsxs)('div', {
                style: styles.dialog,
                children: [
                  sacredtheme &&
                    (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                      children: [
                        (0, jsx_runtime.jsx)('div', {
                          style: { ...styles.glyph, left: '0.75rem' },
                          children: SACRED_GLYPHS[0],
                        }),
                        (0, jsx_runtime.jsx)('div', {
                          style: {
                            ...styles.glyph,
                            right: '3rem',
                            animationDirection: 'reverse',
                          },
                          children: SACRED_GLYPHS[1],
                        }),
                      ],
                    }),
                  (0, jsx_runtime.jsx)('button', {
                    onClick: onClose,
                    style: {
                      ...styles.closeButton,
                      ...(isCloseHovered && styles.closeButtonHover),
                    },
                    onMouseEnter: () => setCloseHovered(!0),
                    onMouseLeave: () => setCloseHovered(!1),
                    children: (0, jsx_runtime.jsx)(Close.A, {
                      style: { height: '1.5rem', width: '1.5rem' },
                    }),
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: styles.header,
                    children: [
                      (0, jsx_runtime.jsx)(Typography.A, {
                        variant: 'merrih5',
                        styles: { color: sacredtheme ? '#FFD700' : void 0 },
                        children: 'Create Task',
                      }),
                      (0, jsx_runtime.jsxs)('div', {
                        style: styles.formContainer,
                        children: [
                          (0, jsx_runtime.jsx)(Text.A, {
                            label: 'Task Title',
                            value: taskTitle,
                            onChange: setTaskTitle,
                            placeholder: 'Enter Task Title',
                            styles: { theme: sacredtheme ? 'sacred' : 'light' },
                          }),
                          (0, jsx_runtime.jsx)(ComplexTextEditor.A, {
                            label: 'Task Description',
                            value: taskDescription,
                            onChange: setTaskDescription,
                            editorType: 'simple',
                            minRows: 5,
                            styles: { theme: sacredtheme ? 'sacred' : 'light' },
                          }),
                          (0, jsx_runtime.jsx)(Searchable.A, {
                            label: 'Company',
                            options: companyOptions,
                            defaultValue:
                              null ===
                                (_companyOptions_find = companyOptions.find(
                                  opt => opt.attribute1 === selectedCompanyId
                                )) || void 0 === _companyOptions_find
                                ? void 0
                                : _companyOptions_find.value,
                            onChange: option =>
                              setSelectedCompanyId(
                                (null == option ? void 0 : option.attribute1) ||
                                  ''
                              ),
                            placeholder: 'Select a company',
                            styles: { theme: sacredtheme ? 'sacred' : 'light' },
                          }),
                          (0, jsx_runtime.jsxs)('div', {
                            style: styles.row,
                            children: [
                              (0, jsx_runtime.jsxs)('div', {
                                style: styles.col,
                                children: [
                                  (0, jsx_runtime.jsx)(Searchable.A, {
                                    label: 'Severity Level',
                                    options: severityOptions,
                                    defaultValue:
                                      null ===
                                        (_severityOptions_find =
                                          severityOptions.find(
                                            opt =>
                                              opt.attribute2 ===
                                              selectedSeverityId
                                          )) || void 0 === _severityOptions_find
                                        ? void 0
                                        : _severityOptions_find.value,
                                    onChange: option =>
                                      setSelectedSeverityId(
                                        (null == option
                                          ? void 0
                                          : option.attribute2) || ''
                                      ),
                                    placeholder: 'Select severity level',
                                    styles: {
                                      theme: sacredtheme ? 'sacred' : 'light',
                                    },
                                  }),
                                  (0, jsx_runtime.jsx)(Searchable.A, {
                                    label: 'Status',
                                    options: statusOptions,
                                    defaultValue:
                                      null ===
                                        (_statusOptions_find =
                                          statusOptions.find(
                                            opt =>
                                              opt.attribute1 ===
                                              selectedStatusId
                                          )) || void 0 === _statusOptions_find
                                        ? void 0
                                        : _statusOptions_find.value,
                                    onChange: option => {
                                      const newStatus =
                                        (null == option
                                          ? void 0
                                          : option.value) || ''
                                      ;(setSelectedStatus(newStatus),
                                        setSelectedStatusId(
                                          (null == option
                                            ? void 0
                                            : option.attribute1) || ''
                                        ))
                                    },
                                    placeholder: 'Select status',
                                    styles: {
                                      theme: sacredtheme ? 'sacred' : 'light',
                                    },
                                  }),
                                ],
                              }),
                              (0, jsx_runtime.jsxs)('div', {
                                style: styles.col,
                                children: [
                                  (0, jsx_runtime.jsx)(Searchable.A, {
                                    label: 'Associated Product (Queue)',
                                    options: queueOptions,
                                    defaultValue:
                                      null ===
                                        (_queueOptions_find = queueOptions.find(
                                          opt =>
                                            opt.attribute1 === selectedQueueId
                                        )) || void 0 === _queueOptions_find
                                        ? void 0
                                        : _queueOptions_find.value,
                                    onChange: option =>
                                      setSelectedQueueId(
                                        (null == option
                                          ? void 0
                                          : option.attribute1) || ''
                                      ),
                                    placeholder: 'Select product queue',
                                    styles: {
                                      theme: sacredtheme ? 'sacred' : 'light',
                                    },
                                  }),
                                  (0, jsx_runtime.jsx)(Searchable.A, {
                                    label: 'Substatus',
                                    options: finalSubStatusOptions,
                                    defaultValue:
                                      null ===
                                        (_finalSubStatusOptions_find =
                                          finalSubStatusOptions.find(
                                            opt =>
                                              opt.attribute2 ===
                                              selectedSubStatusId
                                          )) ||
                                      void 0 === _finalSubStatusOptions_find
                                        ? void 0
                                        : _finalSubStatusOptions_find.value,
                                    onChange: option =>
                                      setSelectedSubStatusId(
                                        (null == option
                                          ? void 0
                                          : option.attribute2) || ''
                                      ),
                                    placeholder: selectedStatus
                                      ? 'Select substatus'
                                      : 'Please select a status first',
                                    styles: {
                                      theme: sacredtheme ? 'sacred' : 'light',
                                      disabled: !selectedStatus,
                                    },
                                  }),
                                ],
                              }),
                            ],
                          }),
                          react.useMemo(() => {
                            const topicOptions = topics.map(t => ({
                                value: t.topic || `Topic ${t._id}`,
                                attribute1: t._id,
                              })),
                              selectedTopicValues = selectedTopicIds.map(id => {
                                const topic = topics.find(t => t._id === id)
                                return topic
                                  ? topic.topic || `Topic ${topic._id}`
                                  : id
                              })
                            return (0, jsx_runtime.jsx)(MultiSelect.A, {
                              label: 'Topics',
                              options: topicOptions,
                              defaultSelected: selectedTopicValues,
                              onChange: selectedValues => {
                                const newSelectedIds = selectedValues.map(
                                  value => {
                                    const matchingTopic = topicOptions.find(
                                      opt => opt.value === value
                                    )
                                    return (
                                      (null == matchingTopic
                                        ? void 0
                                        : matchingTopic.attribute1) || value
                                    )
                                  }
                                )
                                setSelectedTopicIds(newSelectedIds)
                              },
                              complexOptions: !0,
                              styles: {
                                theme: sacredtheme ? 'sacred' : 'light',
                              },
                            })
                          }, [topics, selectedTopicIds, sacredtheme]),
                          react.useMemo(() => {
                            const articleOptions = knowledgebaseArticles.map(
                                a => ({
                                  value: a.articleTitle || `Article ${a._id}`,
                                  attribute1: a._id,
                                })
                              ),
                              selectedArticleValues = selectedArticleIds.map(
                                id => {
                                  const article = knowledgebaseArticles.find(
                                    a => a._id === id
                                  )
                                  return article
                                    ? article.articleTitle ||
                                        `Article ${article._id}`
                                    : id
                                }
                              )
                            return (0, jsx_runtime.jsx)(MultiSelect.A, {
                              label: 'Knowledgebase Articles',
                              options: articleOptions,
                              defaultSelected: selectedArticleValues,
                              onChange: selectedValues => {
                                const newSelectedIds = selectedValues.map(
                                  value => {
                                    const matchingArticle = articleOptions.find(
                                      opt => opt.value === value
                                    )
                                    return (
                                      (null == matchingArticle
                                        ? void 0
                                        : matchingArticle.attribute1) || value
                                    )
                                  }
                                )
                                setSelectedArticleIds(newSelectedIds)
                              },
                              complexOptions: !0,
                              styles: {
                                theme: sacredtheme ? 'sacred' : 'light',
                              },
                            })
                          }, [
                            knowledgebaseArticles,
                            selectedArticleIds,
                            sacredtheme,
                          ]),
                          (0, jsx_runtime.jsxs)('div', {
                            style: styles.buttonContainer,
                            children: [
                              (0, jsx_runtime.jsx)(Button.A, {
                                text: 'Cancel',
                                onClick: onClose,
                                styles: {
                                  theme: sacredtheme ? 'sacred' : 'light',
                                },
                              }),
                              (0, jsx_runtime.jsx)(Button.A, {
                                text: 'Create Task',
                                onClick: handleSubmit,
                                styles: {
                                  theme: sacredtheme ? 'sacred' : 'light',
                                },
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            })
          },
          companyDropdown = AdministratorAddTaskCompanyDropdown
        AdministratorAddTaskCompanyDropdown.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'AdministratorAddTaskCompanyDropdown',
          props: {
            open: {
              required: !0,
              tsType: { name: 'boolean' },
              description: '',
            },
            onClose: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onAdd: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: "(newTask: Omit<Task, '_id'>) => void",
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'Omit',
                        elements: [
                          {
                            name: 'signature',
                            type: 'object',
                            raw: '{\n  _id: string\n  /** The parent company ID or other domain-specific reference. */\n  companyId: string\n  title: string\n  description: string\n  /** If severity is linked to a separate record, store it here. */\n  severityId: string\n  /** The main status. */\n  statusId: string\n  /** The sub-status. */\n  substatusId: string\n  /** The scheduling queue ID. */\n  schedulingQueueId: string\n  /** Topics array, each referencing a topic ID. */\n  topicIds: string[]\n  /** Comments array, referencing comment IDs. */\n  commentIds: string[]\n  /** Employee IDs assigned to the task. */\n  employeeIds: string[]\n  /** Knowledgebase article IDs. */\n  articleIds: string[]\n  /** The "customer" ID if you have one. */\n  customerId: string\n  /** Timestamps. */\n  createdAt: Date\n  closedAt: Date\n  updatedAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n  /**\n   * If you want to store the actual comments (rather than just commentIds),\n   * so ShowTask can display them directly.\n   */\n  comments: Comment[]\n  /** If you store the "customer assigned" label as text (e.g. "Bobbie Sue"). */\n  customerAssigned: string\n  /** Severity label text (e.g. "Critical"). */\n  severity: string\n  /** Scheduling Queue text (e.g. "Technologies Unlimited"). */\n  schedulingQueue: string\n  /** High-level status text (e.g. "Open"). */\n  status: string\n  /** Sub-status text (e.g. "In Progress"). */\n  subStatus: string\n  /**\n   * If you want to store the actual topic strings (e.g. ["Technical Support"]).\n   * This can be used in addition to or instead of topicIds.\n   */\n  topicLabels: string[]\n  /**\n   * If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\n   * This can be used in addition to or instead of articleIds.\n   */\n  kbArticles: string[]\n  /** A string representing the assigned team member (e.g. "Matthew Goluba"). */\n  teamMember: string\n  /** If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST"). */\n  nextActionDate: string\n}',
                            signature: {
                              properties: [
                                {
                                  key: '_id',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'companyId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'The parent company ID or other domain-specific reference.',
                                },
                                {
                                  key: 'title',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'description',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'severityId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If severity is linked to a separate record, store it here.',
                                },
                                {
                                  key: 'statusId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The main status.',
                                },
                                {
                                  key: 'substatusId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The sub-status.',
                                },
                                {
                                  key: 'schedulingQueueId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The scheduling queue ID.',
                                },
                                {
                                  key: 'topicIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Topics array, each referencing a topic ID.',
                                },
                                {
                                  key: 'commentIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Comments array, referencing comment IDs.',
                                },
                                {
                                  key: 'employeeIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Employee IDs assigned to the task.',
                                },
                                {
                                  key: 'articleIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description: 'Knowledgebase article IDs.',
                                },
                                {
                                  key: 'customerId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'The "customer" ID if you have one.',
                                },
                                {
                                  key: 'createdAt',
                                  value: { name: 'Date', required: !0 },
                                  description: 'Timestamps.',
                                },
                                {
                                  key: 'closedAt',
                                  value: { name: 'Date', required: !0 },
                                },
                                {
                                  key: 'updatedAt',
                                  value: { name: 'Date', required: !0 },
                                },
                                {
                                  key: 'createdBy',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'editHistory',
                                  value: {
                                    name: 'Array',
                                    elements: [
                                      {
                                        name: 'signature',
                                        type: 'object',
                                        raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                        signature: {
                                          properties: [
                                            {
                                              key: '_id',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'editedBy',
                                              value: {
                                                name: 'string',
                                                required: !1,
                                              },
                                            },
                                            {
                                              key: 'editedAt',
                                              value: {
                                                name: 'Date',
                                                required: !1,
                                              },
                                            },
                                            {
                                              key: 'text',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'isOriginal',
                                              value: {
                                                name: 'boolean',
                                                required: !0,
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                    raw: 'CommentEditHistory[]',
                                    required: !0,
                                  },
                                },
                                {
                                  key: 'comments',
                                  value: {
                                    name: 'Array',
                                    elements: [
                                      {
                                        name: 'signature',
                                        type: 'object',
                                        raw: '{\n  _id: string\n  text: string\n  createdAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n}',
                                        signature: {
                                          properties: [
                                            {
                                              key: '_id',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'text',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'createdAt',
                                              value: {
                                                name: 'Date',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'createdBy',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'editHistory',
                                              value: {
                                                name: 'Array',
                                                elements: [
                                                  {
                                                    name: 'signature',
                                                    type: 'object',
                                                    raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                                    signature: {
                                                      properties: [
                                                        {
                                                          key: '_id',
                                                          value: {
                                                            name: 'string',
                                                            required: !0,
                                                          },
                                                        },
                                                        {
                                                          key: 'editedBy',
                                                          value: {
                                                            name: 'string',
                                                            required: !1,
                                                          },
                                                        },
                                                        {
                                                          key: 'editedAt',
                                                          value: {
                                                            name: 'Date',
                                                            required: !1,
                                                          },
                                                        },
                                                        {
                                                          key: 'text',
                                                          value: {
                                                            name: 'string',
                                                            required: !0,
                                                          },
                                                        },
                                                        {
                                                          key: 'isOriginal',
                                                          value: {
                                                            name: 'boolean',
                                                            required: !0,
                                                          },
                                                        },
                                                      ],
                                                    },
                                                  },
                                                ],
                                                raw: 'CommentEditHistory[]',
                                                required: !0,
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                    raw: 'Comment[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store the actual comments (rather than just commentIds),\nso ShowTask can display them directly.',
                                },
                                {
                                  key: 'customerAssigned',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If you store the "customer assigned" label as text (e.g. "Bobbie Sue").',
                                },
                                {
                                  key: 'severity',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Severity label text (e.g. "Critical").',
                                },
                                {
                                  key: 'schedulingQueue',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Scheduling Queue text (e.g. "Technologies Unlimited").',
                                },
                                {
                                  key: 'status',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'High-level status text (e.g. "Open").',
                                },
                                {
                                  key: 'subStatus',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Sub-status text (e.g. "In Progress").',
                                },
                                {
                                  key: 'topicLabels',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store the actual topic strings (e.g. ["Technical Support"]).\nThis can be used in addition to or instead of topicIds.',
                                },
                                {
                                  key: 'kbArticles',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\nThis can be used in addition to or instead of articleIds.',
                                },
                                {
                                  key: 'teamMember',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'A string representing the assigned team member (e.g. "Matthew Goluba").',
                                },
                                {
                                  key: 'nextActionDate',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST").',
                                },
                              ],
                            },
                          },
                          { name: 'literal', value: "'_id'" },
                        ],
                        raw: "Omit<Task, '_id'>",
                      },
                      name: 'newTask',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            statuses: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  status: string\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'status',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawStatus[]',
              },
              description: '',
            },
            subStatuses: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  subStatus: string\n  description?: string\n  statusId: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'subStatus',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                        {
                          key: 'statusId',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawSubStatus[]',
              },
              description: '',
            },
            topics: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  topic: string\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'topic',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawTopic[]',
              },
              description: '',
            },
            schedulingQueues: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  queueName: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'queueName',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawQueue[]',
              },
              description: '',
            },
            knowledgebaseArticles: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  articleTitle: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'articleTitle',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawArticle[]',
              },
              description: '',
            },
            severityLevels: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  severityLevel: number\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'severityLevel',
                          value: { name: 'number', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawSeverityLevel[]',
              },
              description: '',
            },
            rawCompanies: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  companyName: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'companyName',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawCompany[]',
              },
              description: '',
            },
            createdUserId: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            sacredtheme: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
          },
        }
        const companyProvided_SACRED_GLYPHS = ['𓁹', '𓂀', '𓊖', '𓊹'],
          AdministratorAddTaskCompanyProvided = ({
            open,
            onClose,
            onAdd,
            statuses,
            subStatuses,
            topics,
            schedulingQueues,
            knowledgebaseArticles,
            severityLevels,
            companyId,
            createdUserId,
            sacredtheme = !1,
          }) => {
            var _severityOptions_find,
              _statusOptions_find,
              _queueOptions_find,
              _finalSubStatusOptions_find
            const [selectedSeverityId, setSelectedSeverityId] = (0,
              react.useState)(''),
              [selectedQueueId, setSelectedQueueId] = (0, react.useState)(''),
              [selectedStatus, setSelectedStatus] = (0, react.useState)(''),
              [selectedStatusId, setSelectedStatusId] = (0, react.useState)(''),
              [selectedSubStatusId, setSelectedSubStatusId] = (0,
              react.useState)(''),
              [selectedTopicIds, setSelectedTopicIds] = (0, react.useState)([]),
              [selectedArticleIds, setSelectedArticleIds] = (0, react.useState)(
                []
              ),
              [taskTitle, setTaskTitle] = (0, react.useState)(''),
              [taskDescription, setTaskDescription] = (0, react.useState)(''),
              [isCloseHovered, setCloseHovered] = (0, react.useState)(!1),
              styles = (sacredtheme => ({
                dialog: {
                  width: '100%',
                  '@media (min-width: 640px)': { width: '700px' },
                  margin: '1rem auto',
                  pointerEvents: 'auto',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  ...(sacredtheme && {
                    border: '2px solid rgba(255, 215, 0, 0.5)',
                    boxShadow: '0 0 1.5rem rgba(255, 215, 0, 0.3)',
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    animation: 'add-task-glow-pulse 2s infinite alternate',
                  }),
                },
                glyph: {
                  position: 'absolute',
                  top: '0.75rem',
                  fontSize: '1.125rem',
                  color: 'rgba(255, 215, 0, 0.3)',
                  zIndex: 10,
                  animation: 'add-task-float-glyph 5s infinite alternate',
                },
                closeButton: {
                  position: 'absolute',
                  right: '0.5rem',
                  top: '0.5rem',
                  zIndex: 20,
                  padding: '0.25rem',
                  borderRadius: '9999px',
                  color: sacredtheme ? '#FFD700' : '#6B7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                },
                closeButtonHover: {
                  color: sacredtheme ? '#FBBF24' : '#1F2937',
                },
                header: {
                  padding: '0.75rem',
                  ...(sacredtheme && {
                    borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
                    backgroundColor: 'rgba(255, 215, 0, 0.05)',
                  }),
                },
                title: {
                  marginBottom: '0.75rem',
                  ...(sacredtheme && {
                    fontFamily: 'Cinzel, serif',
                    letterSpacing: '0.05em',
                    textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
                    color: '#FFD700',
                  }),
                },
                formContainer: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                },
                row: {
                  display: 'flex',
                  flexDirection: 'column',
                  '@media (min-width: 640px)': { flexDirection: 'row' },
                  gap: '0.25rem',
                },
                col: {
                  flex: '1 1 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                },
                buttonContainer: {
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                  flexDirection: 'column',
                  '@media (min-width: 640px)': { flexDirection: 'row' },
                },
              }))(sacredtheme),
              severityOptions = severityLevels.map(sl => ({
                value: String(sl.severityLevel),
                attribute1: sl.description || '',
                attribute2: sl._id,
              })),
              statusOptions = statuses.map(s => ({
                value: s.status,
                attribute1: s._id,
              })),
              filteredSubStatusOptions = subStatuses
                .filter(s => {
                  var _statuses_find
                  if (!selectedStatus) return !1
                  const selectedStatusId =
                    null ===
                      (_statuses_find = statuses.find(
                        status => status.status === selectedStatus
                      )) || void 0 === _statuses_find
                      ? void 0
                      : _statuses_find._id
                  return s.statusId === selectedStatusId
                })
                .map(s => {
                  var _statuses_find
                  const associatedStatus =
                    (null ===
                      (_statuses_find = statuses.find(
                        status => status._id === s.statusId
                      )) || void 0 === _statuses_find
                      ? void 0
                      : _statuses_find.status) || ''
                  return {
                    value: s.subStatus,
                    attribute1: associatedStatus,
                    attribute2: s._id,
                  }
                }),
              finalSubStatusOptions =
                filteredSubStatusOptions.length > 0
                  ? filteredSubStatusOptions
                  : selectedStatus
                    ? [
                        {
                          value: 'No substatuses available for this status',
                          attribute1: '',
                          attribute2: '',
                        },
                      ]
                    : [],
              queueOptions = schedulingQueues.map(q => ({
                value: q.queueName,
                attribute1: q._id,
              }))
            react.useEffect(() => {
              setSelectedSubStatusId('')
            }, [selectedStatus])
            const handleSubmit = (0, react.useCallback)(() => {
              if (
                !selectedSeverityId ||
                !selectedStatusId ||
                !selectedSubStatusId
              )
                return void alert('Please fill out all required fields.')
              const newTaskData = {
                title: taskTitle,
                description: taskDescription,
                topicIds: selectedTopicIds,
                articleIds: selectedArticleIds,
                severityId: selectedSeverityId,
                schedulingQueueId: selectedQueueId,
                statusId: selectedStatusId,
                substatusId: selectedSubStatusId,
                employeeIds: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                closedAt: new Date(),
                createdBy: createdUserId,
                comments: [],
                commentIds: [],
                customerAssigned: '',
                severity: '',
                schedulingQueue: '',
                status: '',
                subStatus: '',
                topicLabels: [],
                kbArticles: [],
                teamMember: '',
                nextActionDate: '',
                companyId,
                customerId: '',
                editHistory: [],
              }
              onAdd(newTaskData)
            }, [
              taskTitle,
              taskDescription,
              selectedTopicIds,
              selectedArticleIds,
              selectedSeverityId,
              selectedQueueId,
              selectedStatusId,
              selectedSubStatusId,
              companyId,
              createdUserId,
              onAdd,
            ])
            return (0, jsx_runtime.jsx)(Dialog.A, {
              open,
              onClose,
              styles: { theme: sacredtheme ? 'sacred' : 'light' },
              children: (0, jsx_runtime.jsxs)('div', {
                style: styles.dialog,
                children: [
                  sacredtheme &&
                    (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                      children: [
                        (0, jsx_runtime.jsx)('div', {
                          style: { ...styles.glyph, left: '0.75rem' },
                          children: companyProvided_SACRED_GLYPHS[0],
                        }),
                        (0, jsx_runtime.jsx)('div', {
                          style: {
                            ...styles.glyph,
                            right: '3rem',
                            animationDirection: 'reverse',
                          },
                          children: companyProvided_SACRED_GLYPHS[1],
                        }),
                      ],
                    }),
                  (0, jsx_runtime.jsx)('button', {
                    onClick: onClose,
                    style: {
                      ...styles.closeButton,
                      ...(isCloseHovered && styles.closeButtonHover),
                    },
                    onMouseEnter: () => setCloseHovered(!0),
                    onMouseLeave: () => setCloseHovered(!1),
                    children: (0, jsx_runtime.jsx)(Close.A, {
                      style: { height: '1.5rem', width: '1.5rem' },
                    }),
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: styles.header,
                    children: [
                      (0, jsx_runtime.jsx)(Typography.A, {
                        variant: 'merrih5',
                        styles: { color: sacredtheme ? '#FFD700' : void 0 },
                        children: 'Create Task',
                      }),
                      (0, jsx_runtime.jsxs)('div', {
                        style: styles.formContainer,
                        children: [
                          (0, jsx_runtime.jsx)(Text.A, {
                            label: 'Task Title',
                            value: taskTitle,
                            onChange: setTaskTitle,
                            placeholder: 'Enter Task Title',
                            styles: { theme: sacredtheme ? 'sacred' : 'light' },
                          }),
                          (0, jsx_runtime.jsx)(ComplexTextEditor.A, {
                            label: 'Task Description',
                            value: taskDescription,
                            onChange: setTaskDescription,
                            editorType: 'simple',
                            minRows: 5,
                            styles: { theme: sacredtheme ? 'sacred' : 'light' },
                          }),
                          (0, jsx_runtime.jsxs)('div', {
                            style: styles.row,
                            children: [
                              (0, jsx_runtime.jsxs)('div', {
                                style: styles.col,
                                children: [
                                  (0, jsx_runtime.jsx)(Searchable.A, {
                                    label: 'Severity Level',
                                    options: severityOptions,
                                    defaultValue:
                                      null ===
                                        (_severityOptions_find =
                                          severityOptions.find(
                                            opt =>
                                              opt.attribute2 ===
                                              selectedSeverityId
                                          )) || void 0 === _severityOptions_find
                                        ? void 0
                                        : _severityOptions_find.value,
                                    onChange: option =>
                                      setSelectedSeverityId(
                                        (null == option
                                          ? void 0
                                          : option.attribute2) || ''
                                      ),
                                    placeholder: 'Select severity level',
                                    styles: {
                                      theme: sacredtheme ? 'sacred' : 'light',
                                    },
                                  }),
                                  (0, jsx_runtime.jsx)(Searchable.A, {
                                    label: 'Status',
                                    options: statusOptions,
                                    defaultValue:
                                      null ===
                                        (_statusOptions_find =
                                          statusOptions.find(
                                            opt =>
                                              opt.attribute1 ===
                                              selectedStatusId
                                          )) || void 0 === _statusOptions_find
                                        ? void 0
                                        : _statusOptions_find.value,
                                    onChange: option => {
                                      const newStatus =
                                        (null == option
                                          ? void 0
                                          : option.value) || ''
                                      ;(setSelectedStatus(newStatus),
                                        setSelectedStatusId(
                                          (null == option
                                            ? void 0
                                            : option.attribute1) || ''
                                        ))
                                    },
                                    placeholder: 'Select status',
                                    styles: {
                                      theme: sacredtheme ? 'sacred' : 'light',
                                    },
                                  }),
                                ],
                              }),
                              (0, jsx_runtime.jsxs)('div', {
                                style: styles.col,
                                children: [
                                  (0, jsx_runtime.jsx)(Searchable.A, {
                                    label: 'Associated Product (Queue)',
                                    options: queueOptions,
                                    defaultValue:
                                      null ===
                                        (_queueOptions_find = queueOptions.find(
                                          opt =>
                                            opt.attribute1 === selectedQueueId
                                        )) || void 0 === _queueOptions_find
                                        ? void 0
                                        : _queueOptions_find.value,
                                    onChange: option =>
                                      setSelectedQueueId(
                                        (null == option
                                          ? void 0
                                          : option.attribute1) || ''
                                      ),
                                    placeholder: 'Select product queue',
                                    styles: {
                                      theme: sacredtheme ? 'sacred' : 'light',
                                    },
                                  }),
                                  (0, jsx_runtime.jsx)(Searchable.A, {
                                    label: 'Substatus',
                                    options: finalSubStatusOptions,
                                    defaultValue:
                                      null ===
                                        (_finalSubStatusOptions_find =
                                          finalSubStatusOptions.find(
                                            opt =>
                                              opt.attribute2 ===
                                              selectedSubStatusId
                                          )) ||
                                      void 0 === _finalSubStatusOptions_find
                                        ? void 0
                                        : _finalSubStatusOptions_find.value,
                                    onChange: option =>
                                      setSelectedSubStatusId(
                                        (null == option
                                          ? void 0
                                          : option.attribute2) || ''
                                      ),
                                    placeholder: selectedStatus
                                      ? 'Select substatus'
                                      : 'Please select a status first',
                                    styles: {
                                      theme: sacredtheme ? 'sacred' : 'light',
                                      disabled: !selectedStatus,
                                    },
                                  }),
                                ],
                              }),
                            ],
                          }),
                          react.useMemo(() => {
                            const topicOptions = topics.map(t => ({
                                value: t.topic || `Topic ${t._id}`,
                                attribute1: t._id,
                              })),
                              selectedTopicValues = selectedTopicIds.map(id => {
                                const topic = topics.find(t => t._id === id)
                                return topic
                                  ? topic.topic || `Topic ${topic._id}`
                                  : id
                              })
                            return (0, jsx_runtime.jsx)(MultiSelect.A, {
                              label: 'Topics',
                              options: topicOptions,
                              defaultSelected: selectedTopicValues,
                              onChange: selectedValues => {
                                const newSelectedIds = selectedValues.map(
                                  value => {
                                    const matchingTopic = topicOptions.find(
                                      opt => opt.value === value
                                    )
                                    return (
                                      (null == matchingTopic
                                        ? void 0
                                        : matchingTopic.attribute1) || value
                                    )
                                  }
                                )
                                setSelectedTopicIds(newSelectedIds)
                              },
                              complexOptions: !0,
                              styles: {
                                theme: sacredtheme ? 'sacred' : 'light',
                              },
                            })
                          }, [topics, selectedTopicIds, sacredtheme]),
                          react.useMemo(() => {
                            const articleOptions = knowledgebaseArticles.map(
                                a => ({
                                  value: a.articleTitle || `Article ${a._id}`,
                                  attribute1: a._id,
                                })
                              ),
                              selectedArticleValues = selectedArticleIds.map(
                                id => {
                                  const article = knowledgebaseArticles.find(
                                    a => a._id === id
                                  )
                                  return article
                                    ? article.articleTitle ||
                                        `Article ${article._id}`
                                    : id
                                }
                              )
                            return (0, jsx_runtime.jsx)(MultiSelect.A, {
                              label: 'Knowledgebase Articles',
                              options: articleOptions,
                              defaultSelected: selectedArticleValues,
                              onChange: selectedValues => {
                                const newSelectedIds = selectedValues.map(
                                  value => {
                                    const matchingArticle = articleOptions.find(
                                      opt => opt.value === value
                                    )
                                    return (
                                      (null == matchingArticle
                                        ? void 0
                                        : matchingArticle.attribute1) || value
                                    )
                                  }
                                )
                                setSelectedArticleIds(newSelectedIds)
                              },
                              complexOptions: !0,
                              styles: {
                                theme: sacredtheme ? 'sacred' : 'light',
                              },
                            })
                          }, [
                            knowledgebaseArticles,
                            selectedArticleIds,
                            sacredtheme,
                          ]),
                          (0, jsx_runtime.jsxs)('div', {
                            style: styles.buttonContainer,
                            children: [
                              (0, jsx_runtime.jsx)(Button.A, {
                                text: 'Cancel',
                                onClick: onClose,
                                styles: {
                                  theme: sacredtheme ? 'sacred' : 'light',
                                },
                              }),
                              (0, jsx_runtime.jsx)(Button.A, {
                                text: 'Create Task',
                                onClick: handleSubmit,
                                styles: {
                                  theme: sacredtheme ? 'sacred' : 'light',
                                },
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            })
          },
          companyProvided = AdministratorAddTaskCompanyProvided
        AdministratorAddTaskCompanyProvided.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'AdministratorAddTaskCompanyProvided',
          props: {
            open: {
              required: !0,
              tsType: { name: 'boolean' },
              description: '',
            },
            onClose: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onAdd: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: "(newTask: Omit<Task, '_id'>) => void",
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'Omit',
                        elements: [
                          {
                            name: 'signature',
                            type: 'object',
                            raw: '{\n  _id: string\n  /** The parent company ID or other domain-specific reference. */\n  companyId: string\n  title: string\n  description: string\n  /** If severity is linked to a separate record, store it here. */\n  severityId: string\n  /** The main status. */\n  statusId: string\n  /** The sub-status. */\n  substatusId: string\n  /** The scheduling queue ID. */\n  schedulingQueueId: string\n  /** Topics array, each referencing a topic ID. */\n  topicIds: string[]\n  /** Comments array, referencing comment IDs. */\n  commentIds: string[]\n  /** Employee IDs assigned to the task. */\n  employeeIds: string[]\n  /** Knowledgebase article IDs. */\n  articleIds: string[]\n  /** The "customer" ID if you have one. */\n  customerId: string\n  /** Timestamps. */\n  createdAt: Date\n  closedAt: Date\n  updatedAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n  /**\n   * If you want to store the actual comments (rather than just commentIds),\n   * so ShowTask can display them directly.\n   */\n  comments: Comment[]\n  /** If you store the "customer assigned" label as text (e.g. "Bobbie Sue"). */\n  customerAssigned: string\n  /** Severity label text (e.g. "Critical"). */\n  severity: string\n  /** Scheduling Queue text (e.g. "Technologies Unlimited"). */\n  schedulingQueue: string\n  /** High-level status text (e.g. "Open"). */\n  status: string\n  /** Sub-status text (e.g. "In Progress"). */\n  subStatus: string\n  /**\n   * If you want to store the actual topic strings (e.g. ["Technical Support"]).\n   * This can be used in addition to or instead of topicIds.\n   */\n  topicLabels: string[]\n  /**\n   * If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\n   * This can be used in addition to or instead of articleIds.\n   */\n  kbArticles: string[]\n  /** A string representing the assigned team member (e.g. "Matthew Goluba"). */\n  teamMember: string\n  /** If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST"). */\n  nextActionDate: string\n}',
                            signature: {
                              properties: [
                                {
                                  key: '_id',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'companyId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'The parent company ID or other domain-specific reference.',
                                },
                                {
                                  key: 'title',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'description',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'severityId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If severity is linked to a separate record, store it here.',
                                },
                                {
                                  key: 'statusId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The main status.',
                                },
                                {
                                  key: 'substatusId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The sub-status.',
                                },
                                {
                                  key: 'schedulingQueueId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The scheduling queue ID.',
                                },
                                {
                                  key: 'topicIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Topics array, each referencing a topic ID.',
                                },
                                {
                                  key: 'commentIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Comments array, referencing comment IDs.',
                                },
                                {
                                  key: 'employeeIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Employee IDs assigned to the task.',
                                },
                                {
                                  key: 'articleIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description: 'Knowledgebase article IDs.',
                                },
                                {
                                  key: 'customerId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'The "customer" ID if you have one.',
                                },
                                {
                                  key: 'createdAt',
                                  value: { name: 'Date', required: !0 },
                                  description: 'Timestamps.',
                                },
                                {
                                  key: 'closedAt',
                                  value: { name: 'Date', required: !0 },
                                },
                                {
                                  key: 'updatedAt',
                                  value: { name: 'Date', required: !0 },
                                },
                                {
                                  key: 'createdBy',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'editHistory',
                                  value: {
                                    name: 'Array',
                                    elements: [
                                      {
                                        name: 'signature',
                                        type: 'object',
                                        raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                        signature: {
                                          properties: [
                                            {
                                              key: '_id',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'editedBy',
                                              value: {
                                                name: 'string',
                                                required: !1,
                                              },
                                            },
                                            {
                                              key: 'editedAt',
                                              value: {
                                                name: 'Date',
                                                required: !1,
                                              },
                                            },
                                            {
                                              key: 'text',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'isOriginal',
                                              value: {
                                                name: 'boolean',
                                                required: !0,
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                    raw: 'CommentEditHistory[]',
                                    required: !0,
                                  },
                                },
                                {
                                  key: 'comments',
                                  value: {
                                    name: 'Array',
                                    elements: [
                                      {
                                        name: 'signature',
                                        type: 'object',
                                        raw: '{\n  _id: string\n  text: string\n  createdAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n}',
                                        signature: {
                                          properties: [
                                            {
                                              key: '_id',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'text',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'createdAt',
                                              value: {
                                                name: 'Date',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'createdBy',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'editHistory',
                                              value: {
                                                name: 'Array',
                                                elements: [
                                                  {
                                                    name: 'signature',
                                                    type: 'object',
                                                    raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                                    signature: {
                                                      properties: [
                                                        {
                                                          key: '_id',
                                                          value: {
                                                            name: 'string',
                                                            required: !0,
                                                          },
                                                        },
                                                        {
                                                          key: 'editedBy',
                                                          value: {
                                                            name: 'string',
                                                            required: !1,
                                                          },
                                                        },
                                                        {
                                                          key: 'editedAt',
                                                          value: {
                                                            name: 'Date',
                                                            required: !1,
                                                          },
                                                        },
                                                        {
                                                          key: 'text',
                                                          value: {
                                                            name: 'string',
                                                            required: !0,
                                                          },
                                                        },
                                                        {
                                                          key: 'isOriginal',
                                                          value: {
                                                            name: 'boolean',
                                                            required: !0,
                                                          },
                                                        },
                                                      ],
                                                    },
                                                  },
                                                ],
                                                raw: 'CommentEditHistory[]',
                                                required: !0,
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                    raw: 'Comment[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store the actual comments (rather than just commentIds),\nso ShowTask can display them directly.',
                                },
                                {
                                  key: 'customerAssigned',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If you store the "customer assigned" label as text (e.g. "Bobbie Sue").',
                                },
                                {
                                  key: 'severity',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Severity label text (e.g. "Critical").',
                                },
                                {
                                  key: 'schedulingQueue',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Scheduling Queue text (e.g. "Technologies Unlimited").',
                                },
                                {
                                  key: 'status',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'High-level status text (e.g. "Open").',
                                },
                                {
                                  key: 'subStatus',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Sub-status text (e.g. "In Progress").',
                                },
                                {
                                  key: 'topicLabels',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store the actual topic strings (e.g. ["Technical Support"]).\nThis can be used in addition to or instead of topicIds.',
                                },
                                {
                                  key: 'kbArticles',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\nThis can be used in addition to or instead of articleIds.',
                                },
                                {
                                  key: 'teamMember',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'A string representing the assigned team member (e.g. "Matthew Goluba").',
                                },
                                {
                                  key: 'nextActionDate',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST").',
                                },
                              ],
                            },
                          },
                          { name: 'literal', value: "'_id'" },
                        ],
                        raw: "Omit<Task, '_id'>",
                      },
                      name: 'newTask',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            statuses: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  status: string\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'status',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawStatus[]',
              },
              description: '',
            },
            subStatuses: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  subStatus: string\n  description?: string\n  statusId: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'subStatus',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                        {
                          key: 'statusId',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawSubStatus[]',
              },
              description: '',
            },
            topics: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  topic: string\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'topic',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawTopic[]',
              },
              description: '',
            },
            schedulingQueues: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  queueName: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'queueName',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawQueue[]',
              },
              description: '',
            },
            knowledgebaseArticles: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  articleTitle: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'articleTitle',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawArticle[]',
              },
              description: '',
            },
            severityLevels: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  severityLevel: number\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'severityLevel',
                          value: { name: 'number', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawSeverityLevel[]',
              },
              description: '',
            },
            companyId: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            createdUserId: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            sacredtheme: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
          },
        }
        const customerDropdown_SACRED_GLYPHS = ['𓁹', '𓂀', '𓊖', '𓊹'],
          CompanyAddTaskCustomerDropdown = ({
            open,
            onClose,
            onAdd,
            statuses,
            subStatuses,
            topics,
            schedulingQueues,
            knowledgebaseArticles,
            severityLevels,
            rawCustomers,
            createdUserId,
            sacredtheme = !1,
          }) => {
            var _customerOptions_find,
              _severityOptions_find,
              _statusOptions_find,
              _queueOptions_find,
              _finalSubStatusOptions_find
            const [selectedCustomerId, setSelectedCustomerId] = (0,
              react.useState)(''),
              [selectedSeverityId, setSelectedSeverityId] = (0, react.useState)(
                ''
              ),
              [selectedQueueId, setSelectedQueueId] = (0, react.useState)(''),
              [selectedStatus, setSelectedStatus] = (0, react.useState)(''),
              [selectedStatusId, setSelectedStatusId] = (0, react.useState)(''),
              [selectedSubStatusId, setSelectedSubStatusId] = (0,
              react.useState)(''),
              [selectedTopicIds, setSelectedTopicIds] = (0, react.useState)([]),
              [selectedArticleIds, setSelectedArticleIds] = (0, react.useState)(
                []
              ),
              [taskTitle, setTaskTitle] = (0, react.useState)(''),
              [taskDescription, setTaskDescription] = (0, react.useState)(''),
              [isCloseHovered, setCloseHovered] = (0, react.useState)(!1),
              styles = (sacredtheme => ({
                dialog: {
                  width: '100%',
                  '@media (min-width: 640px)': { width: '700px' },
                  margin: '1rem auto',
                  pointerEvents: 'auto',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  ...(sacredtheme && {
                    border: '2px solid rgba(255, 215, 0, 0.5)',
                    boxShadow: '0 0 1.5rem rgba(255, 215, 0, 0.3)',
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    animation: 'add-task-glow-pulse 2s infinite alternate',
                  }),
                },
                glyph: {
                  position: 'absolute',
                  top: '0.75rem',
                  fontSize: '1.125rem',
                  color: 'rgba(255, 215, 0, 0.3)',
                  zIndex: 10,
                  animation: 'add-task-float-glyph 5s infinite alternate',
                },
                closeButton: {
                  position: 'absolute',
                  right: '0.5rem',
                  top: '0.5rem',
                  zIndex: 20,
                  padding: '0.25rem',
                  borderRadius: '9999px',
                  color: sacredtheme ? '#FFD700' : '#6B7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                },
                closeButtonHover: {
                  color: sacredtheme ? '#FBBF24' : '#1F2937',
                },
                header: {
                  padding: '0.75rem',
                  ...(sacredtheme && {
                    borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
                    backgroundColor: 'rgba(255, 215, 0, 0.05)',
                  }),
                },
                title: {
                  marginBottom: '0.75rem',
                  ...(sacredtheme && {
                    fontFamily: 'Cinzel, serif',
                    letterSpacing: '0.05em',
                    textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
                    color: '#FFD700',
                  }),
                },
                formContainer: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                },
                row: {
                  display: 'flex',
                  flexDirection: 'column',
                  '@media (min-width: 640px)': { flexDirection: 'row' },
                  gap: '0.25rem',
                },
                col: {
                  flex: '1 1 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                },
                buttonContainer: {
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                  flexDirection: 'column',
                  '@media (min-width: 640px)': { flexDirection: 'row' },
                },
              }))(sacredtheme),
              customerOptions = rawCustomers.map(c => ({
                value:
                  c.firstName || c.lastName
                    ? `${c.firstName || ''} ${c.lastName || ''}`.trim()
                    : '',
                attribute1: c.email || '',
                attribute2: c._id,
              })),
              severityOptions = severityLevels.map(sl => ({
                value: String(sl.severityLevel),
                attribute1: sl.description || '',
                attribute2: sl._id,
              })),
              statusOptions = statuses.map(s => ({
                value: s.status,
                attribute1: s._id,
              })),
              filteredSubStatusOptions = subStatuses
                .filter(s => {
                  var _statuses_find
                  if (!selectedStatus) return !1
                  const selectedStatusId =
                    null ===
                      (_statuses_find = statuses.find(
                        status => status.status === selectedStatus
                      )) || void 0 === _statuses_find
                      ? void 0
                      : _statuses_find._id
                  return s.statusId === selectedStatusId
                })
                .map(s => {
                  var _statuses_find
                  const associatedStatus =
                    (null ===
                      (_statuses_find = statuses.find(
                        status => status._id === s.statusId
                      )) || void 0 === _statuses_find
                      ? void 0
                      : _statuses_find.status) || ''
                  return {
                    value: s.subStatus,
                    attribute1: associatedStatus,
                    attribute2: s._id,
                  }
                }),
              finalSubStatusOptions =
                filteredSubStatusOptions.length > 0
                  ? filteredSubStatusOptions
                  : selectedStatus
                    ? [
                        {
                          value: 'No substatuses available for this status',
                          attribute1: '',
                          attribute2: '',
                        },
                      ]
                    : [],
              queueOptions = schedulingQueues.map(q => ({
                value: q.queueName,
                attribute1: q._id,
              }))
            react.useEffect(() => {
              setSelectedSubStatusId('')
            }, [selectedStatus])
            const handleSubmit = (0, react.useCallback)(() => {
              if (
                !(
                  selectedCustomerId &&
                  selectedSeverityId &&
                  selectedStatusId &&
                  selectedSubStatusId
                )
              )
                return void alert('Please fill out all required fields.')
              const newTaskData = {
                title: taskTitle,
                description: taskDescription,
                topicIds: selectedTopicIds,
                articleIds: selectedArticleIds,
                severityId: selectedSeverityId,
                schedulingQueueId: selectedQueueId,
                statusId: selectedStatusId,
                substatusId: selectedSubStatusId,
                employeeIds: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                closedAt: new Date(),
                createdBy: createdUserId,
                comments: [],
                commentIds: [],
                customerAssigned: '',
                severity: '',
                schedulingQueue: '',
                status: '',
                subStatus: '',
                topicLabels: [],
                kbArticles: [],
                teamMember: '',
                nextActionDate: '',
                companyId: '',
                customerId: selectedCustomerId,
                editHistory: [],
              }
              onAdd(newTaskData)
            }, [
              taskTitle,
              taskDescription,
              selectedTopicIds,
              selectedArticleIds,
              selectedSeverityId,
              selectedQueueId,
              selectedStatusId,
              selectedSubStatusId,
              selectedCustomerId,
              createdUserId,
              onAdd,
            ])
            return (0, jsx_runtime.jsx)(Dialog.A, {
              open,
              onClose,
              styles: { theme: sacredtheme ? 'sacred' : 'light' },
              children: (0, jsx_runtime.jsxs)('div', {
                style: styles.dialog,
                children: [
                  sacredtheme &&
                    (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                      children: [
                        (0, jsx_runtime.jsx)('div', {
                          style: { ...styles.glyph, left: '0.75rem' },
                          children: customerDropdown_SACRED_GLYPHS[0],
                        }),
                        (0, jsx_runtime.jsx)('div', {
                          style: {
                            ...styles.glyph,
                            right: '3rem',
                            animationDirection: 'reverse',
                          },
                          children: customerDropdown_SACRED_GLYPHS[1],
                        }),
                      ],
                    }),
                  (0, jsx_runtime.jsx)('button', {
                    onClick: onClose,
                    style: {
                      ...styles.closeButton,
                      ...(isCloseHovered && styles.closeButtonHover),
                    },
                    onMouseEnter: () => setCloseHovered(!0),
                    onMouseLeave: () => setCloseHovered(!1),
                    children: (0, jsx_runtime.jsx)(Close.A, {
                      style: { height: '1.5rem', width: '1.5rem' },
                    }),
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: styles.header,
                    children: [
                      (0, jsx_runtime.jsx)(Typography.A, {
                        variant: 'merrih5',
                        styles: { color: sacredtheme ? '#FFD700' : void 0 },
                        children: 'Create Task',
                      }),
                      (0, jsx_runtime.jsxs)('div', {
                        style: styles.formContainer,
                        children: [
                          (0, jsx_runtime.jsx)(Text.A, {
                            label: 'Task Title',
                            value: taskTitle,
                            onChange: setTaskTitle,
                            placeholder: 'Enter Task Title',
                            styles: { theme: sacredtheme ? 'sacred' : 'light' },
                          }),
                          (0, jsx_runtime.jsx)(ComplexTextEditor.A, {
                            label: 'Task Description',
                            value: taskDescription,
                            onChange: setTaskDescription,
                            editorType: 'simple',
                            minRows: 5,
                            styles: { theme: sacredtheme ? 'sacred' : 'light' },
                          }),
                          (0, jsx_runtime.jsx)(Searchable.A, {
                            label: 'Customer',
                            options: customerOptions,
                            defaultValue:
                              null ===
                                (_customerOptions_find = customerOptions.find(
                                  opt => opt.attribute2 === selectedCustomerId
                                )) || void 0 === _customerOptions_find
                                ? void 0
                                : _customerOptions_find.value,
                            onChange: option =>
                              setSelectedCustomerId(
                                (null == option ? void 0 : option.attribute2) ||
                                  ''
                              ),
                            placeholder: 'Select a customer',
                            styles: { theme: sacredtheme ? 'sacred' : 'light' },
                          }),
                          (0, jsx_runtime.jsxs)('div', {
                            style: styles.row,
                            children: [
                              (0, jsx_runtime.jsxs)('div', {
                                style: styles.col,
                                children: [
                                  (0, jsx_runtime.jsx)(Searchable.A, {
                                    label: 'Severity Level',
                                    options: severityOptions,
                                    defaultValue:
                                      null ===
                                        (_severityOptions_find =
                                          severityOptions.find(
                                            opt =>
                                              opt.attribute2 ===
                                              selectedSeverityId
                                          )) || void 0 === _severityOptions_find
                                        ? void 0
                                        : _severityOptions_find.value,
                                    onChange: option =>
                                      setSelectedSeverityId(
                                        (null == option
                                          ? void 0
                                          : option.attribute2) || ''
                                      ),
                                    placeholder: 'Select severity level',
                                    styles: {
                                      theme: sacredtheme ? 'sacred' : 'light',
                                    },
                                  }),
                                  (0, jsx_runtime.jsx)(Searchable.A, {
                                    label: 'Status',
                                    options: statusOptions,
                                    defaultValue:
                                      null ===
                                        (_statusOptions_find =
                                          statusOptions.find(
                                            opt =>
                                              opt.attribute1 ===
                                              selectedStatusId
                                          )) || void 0 === _statusOptions_find
                                        ? void 0
                                        : _statusOptions_find.value,
                                    onChange: option => {
                                      const newStatus =
                                        (null == option
                                          ? void 0
                                          : option.value) || ''
                                      ;(setSelectedStatus(newStatus),
                                        setSelectedStatusId(
                                          (null == option
                                            ? void 0
                                            : option.attribute1) || ''
                                        ))
                                    },
                                    placeholder: 'Select status',
                                    styles: {
                                      theme: sacredtheme ? 'sacred' : 'light',
                                    },
                                  }),
                                ],
                              }),
                              (0, jsx_runtime.jsxs)('div', {
                                style: styles.col,
                                children: [
                                  (0, jsx_runtime.jsx)(Searchable.A, {
                                    label: 'Associated Product (Queue)',
                                    options: queueOptions,
                                    defaultValue:
                                      null ===
                                        (_queueOptions_find = queueOptions.find(
                                          opt =>
                                            opt.attribute1 === selectedQueueId
                                        )) || void 0 === _queueOptions_find
                                        ? void 0
                                        : _queueOptions_find.value,
                                    onChange: option =>
                                      setSelectedQueueId(
                                        (null == option
                                          ? void 0
                                          : option.attribute1) || ''
                                      ),
                                    placeholder: 'Select product queue',
                                    styles: {
                                      theme: sacredtheme ? 'sacred' : 'light',
                                    },
                                  }),
                                  (0, jsx_runtime.jsx)(Searchable.A, {
                                    label: 'Substatus',
                                    options: finalSubStatusOptions,
                                    defaultValue:
                                      null ===
                                        (_finalSubStatusOptions_find =
                                          finalSubStatusOptions.find(
                                            opt =>
                                              opt.attribute2 ===
                                              selectedSubStatusId
                                          )) ||
                                      void 0 === _finalSubStatusOptions_find
                                        ? void 0
                                        : _finalSubStatusOptions_find.value,
                                    onChange: option =>
                                      setSelectedSubStatusId(
                                        (null == option
                                          ? void 0
                                          : option.attribute2) || ''
                                      ),
                                    placeholder: selectedStatus
                                      ? 'Select substatus'
                                      : 'Please select a status first',
                                    styles: {
                                      theme: sacredtheme ? 'sacred' : 'light',
                                      disabled: !selectedStatus,
                                    },
                                  }),
                                ],
                              }),
                            ],
                          }),
                          react.useMemo(() => {
                            const topicOptions = topics.map(t => ({
                                value: t.topic || `Topic ${t._id}`,
                                attribute1: t._id,
                              })),
                              selectedTopicValues = selectedTopicIds.map(id => {
                                const topic = topics.find(t => t._id === id)
                                return topic
                                  ? topic.topic || `Topic ${topic._id}`
                                  : id
                              })
                            return (0, jsx_runtime.jsx)(MultiSelect.A, {
                              label: 'Topics',
                              options: topicOptions,
                              defaultSelected: selectedTopicValues,
                              onChange: selectedValues => {
                                const newSelectedIds = selectedValues.map(
                                  value => {
                                    const matchingTopic = topicOptions.find(
                                      opt => opt.value === value
                                    )
                                    return (
                                      (null == matchingTopic
                                        ? void 0
                                        : matchingTopic.attribute1) || value
                                    )
                                  }
                                )
                                setSelectedTopicIds(newSelectedIds)
                              },
                              complexOptions: !0,
                              styles: {
                                theme: sacredtheme ? 'sacred' : 'light',
                              },
                            })
                          }, [topics, selectedTopicIds, sacredtheme]),
                          react.useMemo(() => {
                            const articleOptions = knowledgebaseArticles.map(
                                a => ({
                                  value: a.articleTitle || `Article ${a._id}`,
                                  attribute1: a._id,
                                })
                              ),
                              selectedArticleValues = selectedArticleIds.map(
                                id => {
                                  const article = knowledgebaseArticles.find(
                                    a => a._id === id
                                  )
                                  return article
                                    ? article.articleTitle ||
                                        `Article ${article._id}`
                                    : id
                                }
                              )
                            return (0, jsx_runtime.jsx)(MultiSelect.A, {
                              label: 'Knowledgebase Articles',
                              options: articleOptions,
                              defaultSelected: selectedArticleValues,
                              onChange: selectedValues => {
                                const newSelectedIds = selectedValues.map(
                                  value => {
                                    const matchingArticle = articleOptions.find(
                                      opt => opt.value === value
                                    )
                                    return (
                                      (null == matchingArticle
                                        ? void 0
                                        : matchingArticle.attribute1) || value
                                    )
                                  }
                                )
                                setSelectedArticleIds(newSelectedIds)
                              },
                              complexOptions: !0,
                              styles: {
                                theme: sacredtheme ? 'sacred' : 'light',
                              },
                            })
                          }, [
                            knowledgebaseArticles,
                            selectedArticleIds,
                            sacredtheme,
                          ]),
                          (0, jsx_runtime.jsxs)('div', {
                            style: styles.buttonContainer,
                            children: [
                              (0, jsx_runtime.jsx)(Button.A, {
                                text: 'Cancel',
                                onClick: onClose,
                                styles: {
                                  theme: sacredtheme ? 'sacred' : 'light',
                                },
                              }),
                              (0, jsx_runtime.jsx)(Button.A, {
                                text: 'Create Task',
                                onClick: handleSubmit,
                                styles: {
                                  theme: sacredtheme ? 'sacred' : 'light',
                                },
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            })
          },
          customerDropdown = CompanyAddTaskCustomerDropdown
        CompanyAddTaskCustomerDropdown.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'CompanyAddTaskCustomerDropdown',
          props: {
            open: {
              required: !0,
              tsType: { name: 'boolean' },
              description: '',
            },
            onClose: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onAdd: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: "(newTask: Omit<Task, '_id'>) => void",
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'Omit',
                        elements: [
                          {
                            name: 'signature',
                            type: 'object',
                            raw: '{\n  _id: string\n  /** The parent company ID or other domain-specific reference. */\n  companyId: string\n  title: string\n  description: string\n  /** If severity is linked to a separate record, store it here. */\n  severityId: string\n  /** The main status. */\n  statusId: string\n  /** The sub-status. */\n  substatusId: string\n  /** The scheduling queue ID. */\n  schedulingQueueId: string\n  /** Topics array, each referencing a topic ID. */\n  topicIds: string[]\n  /** Comments array, referencing comment IDs. */\n  commentIds: string[]\n  /** Employee IDs assigned to the task. */\n  employeeIds: string[]\n  /** Knowledgebase article IDs. */\n  articleIds: string[]\n  /** The "customer" ID if you have one. */\n  customerId: string\n  /** Timestamps. */\n  createdAt: Date\n  closedAt: Date\n  updatedAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n  /**\n   * If you want to store the actual comments (rather than just commentIds),\n   * so ShowTask can display them directly.\n   */\n  comments: Comment[]\n  /** If you store the "customer assigned" label as text (e.g. "Bobbie Sue"). */\n  customerAssigned: string\n  /** Severity label text (e.g. "Critical"). */\n  severity: string\n  /** Scheduling Queue text (e.g. "Technologies Unlimited"). */\n  schedulingQueue: string\n  /** High-level status text (e.g. "Open"). */\n  status: string\n  /** Sub-status text (e.g. "In Progress"). */\n  subStatus: string\n  /**\n   * If you want to store the actual topic strings (e.g. ["Technical Support"]).\n   * This can be used in addition to or instead of topicIds.\n   */\n  topicLabels: string[]\n  /**\n   * If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\n   * This can be used in addition to or instead of articleIds.\n   */\n  kbArticles: string[]\n  /** A string representing the assigned team member (e.g. "Matthew Goluba"). */\n  teamMember: string\n  /** If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST"). */\n  nextActionDate: string\n}',
                            signature: {
                              properties: [
                                {
                                  key: '_id',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'companyId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'The parent company ID or other domain-specific reference.',
                                },
                                {
                                  key: 'title',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'description',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'severityId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If severity is linked to a separate record, store it here.',
                                },
                                {
                                  key: 'statusId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The main status.',
                                },
                                {
                                  key: 'substatusId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The sub-status.',
                                },
                                {
                                  key: 'schedulingQueueId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The scheduling queue ID.',
                                },
                                {
                                  key: 'topicIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Topics array, each referencing a topic ID.',
                                },
                                {
                                  key: 'commentIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Comments array, referencing comment IDs.',
                                },
                                {
                                  key: 'employeeIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Employee IDs assigned to the task.',
                                },
                                {
                                  key: 'articleIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description: 'Knowledgebase article IDs.',
                                },
                                {
                                  key: 'customerId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'The "customer" ID if you have one.',
                                },
                                {
                                  key: 'createdAt',
                                  value: { name: 'Date', required: !0 },
                                  description: 'Timestamps.',
                                },
                                {
                                  key: 'closedAt',
                                  value: { name: 'Date', required: !0 },
                                },
                                {
                                  key: 'updatedAt',
                                  value: { name: 'Date', required: !0 },
                                },
                                {
                                  key: 'createdBy',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'editHistory',
                                  value: {
                                    name: 'Array',
                                    elements: [
                                      {
                                        name: 'signature',
                                        type: 'object',
                                        raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                        signature: {
                                          properties: [
                                            {
                                              key: '_id',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'editedBy',
                                              value: {
                                                name: 'string',
                                                required: !1,
                                              },
                                            },
                                            {
                                              key: 'editedAt',
                                              value: {
                                                name: 'Date',
                                                required: !1,
                                              },
                                            },
                                            {
                                              key: 'text',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'isOriginal',
                                              value: {
                                                name: 'boolean',
                                                required: !0,
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                    raw: 'CommentEditHistory[]',
                                    required: !0,
                                  },
                                },
                                {
                                  key: 'comments',
                                  value: {
                                    name: 'Array',
                                    elements: [
                                      {
                                        name: 'signature',
                                        type: 'object',
                                        raw: '{\n  _id: string\n  text: string\n  createdAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n}',
                                        signature: {
                                          properties: [
                                            {
                                              key: '_id',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'text',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'createdAt',
                                              value: {
                                                name: 'Date',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'createdBy',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'editHistory',
                                              value: {
                                                name: 'Array',
                                                elements: [
                                                  {
                                                    name: 'signature',
                                                    type: 'object',
                                                    raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                                    signature: {
                                                      properties: [
                                                        {
                                                          key: '_id',
                                                          value: {
                                                            name: 'string',
                                                            required: !0,
                                                          },
                                                        },
                                                        {
                                                          key: 'editedBy',
                                                          value: {
                                                            name: 'string',
                                                            required: !1,
                                                          },
                                                        },
                                                        {
                                                          key: 'editedAt',
                                                          value: {
                                                            name: 'Date',
                                                            required: !1,
                                                          },
                                                        },
                                                        {
                                                          key: 'text',
                                                          value: {
                                                            name: 'string',
                                                            required: !0,
                                                          },
                                                        },
                                                        {
                                                          key: 'isOriginal',
                                                          value: {
                                                            name: 'boolean',
                                                            required: !0,
                                                          },
                                                        },
                                                      ],
                                                    },
                                                  },
                                                ],
                                                raw: 'CommentEditHistory[]',
                                                required: !0,
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                    raw: 'Comment[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store the actual comments (rather than just commentIds),\nso ShowTask can display them directly.',
                                },
                                {
                                  key: 'customerAssigned',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If you store the "customer assigned" label as text (e.g. "Bobbie Sue").',
                                },
                                {
                                  key: 'severity',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Severity label text (e.g. "Critical").',
                                },
                                {
                                  key: 'schedulingQueue',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Scheduling Queue text (e.g. "Technologies Unlimited").',
                                },
                                {
                                  key: 'status',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'High-level status text (e.g. "Open").',
                                },
                                {
                                  key: 'subStatus',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Sub-status text (e.g. "In Progress").',
                                },
                                {
                                  key: 'topicLabels',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store the actual topic strings (e.g. ["Technical Support"]).\nThis can be used in addition to or instead of topicIds.',
                                },
                                {
                                  key: 'kbArticles',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\nThis can be used in addition to or instead of articleIds.',
                                },
                                {
                                  key: 'teamMember',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'A string representing the assigned team member (e.g. "Matthew Goluba").',
                                },
                                {
                                  key: 'nextActionDate',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST").',
                                },
                              ],
                            },
                          },
                          { name: 'literal', value: "'_id'" },
                        ],
                        raw: "Omit<Task, '_id'>",
                      },
                      name: 'newTask',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            statuses: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  status: string\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'status',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawStatus[]',
              },
              description: '',
            },
            subStatuses: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  subStatus: string\n  description?: string\n  statusId: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'subStatus',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                        {
                          key: 'statusId',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawSubStatus[]',
              },
              description: '',
            },
            topics: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  topic: string\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'topic',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawTopic[]',
              },
              description: '',
            },
            schedulingQueues: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  queueName: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'queueName',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawQueue[]',
              },
              description: '',
            },
            knowledgebaseArticles: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  articleTitle: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'articleTitle',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawArticle[]',
              },
              description: '',
            },
            severityLevels: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  severityLevel: number\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'severityLevel',
                          value: { name: 'number', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawSeverityLevel[]',
              },
              description: '',
            },
            rawCustomers: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  firstName?: string\n  lastName?: string\n  email?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'firstName',
                          value: { name: 'string', required: !1 },
                        },
                        {
                          key: 'lastName',
                          value: { name: 'string', required: !1 },
                        },
                        {
                          key: 'email',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawCustomer[]',
              },
              description: '',
            },
            createdUserId: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            sacredtheme: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
          },
        }
        const customerProvided_SACRED_GLYPHS = ['𓁹', '𓂀', '𓊖', '𓊹'],
          CompanyAddTaskCustomerProvided = ({
            open,
            onClose,
            onAdd,
            statuses,
            subStatuses,
            topics,
            schedulingQueues,
            knowledgebaseArticles,
            severityLevels,
            customerId,
            createdUserId,
            sacredtheme = !1,
          }) => {
            var _severityOptions_find,
              _statusOptions_find,
              _queueOptions_find,
              _finalSubStatusOptions_find
            const [selectedSeverityId, setSelectedSeverityId] = (0,
              react.useState)(''),
              [selectedQueueId, setSelectedQueueId] = (0, react.useState)(''),
              [selectedStatus, setSelectedStatus] = (0, react.useState)(''),
              [selectedStatusId, setSelectedStatusId] = (0, react.useState)(''),
              [selectedSubStatusId, setSelectedSubStatusId] = (0,
              react.useState)(''),
              [selectedTopicIds, setSelectedTopicIds] = (0, react.useState)([]),
              [selectedArticleIds, setSelectedArticleIds] = (0, react.useState)(
                []
              ),
              [taskTitle, setTaskTitle] = (0, react.useState)(''),
              [taskDescription, setTaskDescription] = (0, react.useState)(''),
              [isCloseHovered, setCloseHovered] = (0, react.useState)(!1),
              styles = (sacredtheme => ({
                dialog: {
                  width: '100%',
                  '@media (min-width: 640px)': { width: '700px' },
                  margin: '1rem auto',
                  pointerEvents: 'auto',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  ...(sacredtheme && {
                    border: '2px solid rgba(255, 215, 0, 0.5)',
                    boxShadow: '0 0 1.5rem rgba(255, 215, 0, 0.3)',
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    animation: 'add-task-glow-pulse 2s infinite alternate',
                  }),
                },
                glyph: {
                  position: 'absolute',
                  top: '0.75rem',
                  fontSize: '1.125rem',
                  color: 'rgba(255, 215, 0, 0.3)',
                  zIndex: 10,
                  animation: 'add-task-float-glyph 5s infinite alternate',
                },
                closeButton: {
                  position: 'absolute',
                  right: '0.5rem',
                  top: '0.5rem',
                  zIndex: 20,
                  padding: '0.25rem',
                  borderRadius: '9999px',
                  color: sacredtheme ? '#FFD700' : '#6B7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                },
                closeButtonHover: {
                  color: sacredtheme ? '#FBBF24' : '#1F2937',
                },
                header: {
                  padding: '0.75rem',
                  ...(sacredtheme && {
                    borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
                    backgroundColor: 'rgba(255, 215, 0, 0.05)',
                  }),
                },
                title: {
                  marginBottom: '0.75rem',
                  ...(sacredtheme && {
                    fontFamily: 'Cinzel, serif',
                    letterSpacing: '0.05em',
                    textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
                    color: '#FFD700',
                  }),
                },
                formContainer: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                },
                row: {
                  display: 'flex',
                  flexDirection: 'column',
                  '@media (min-width: 640px)': { flexDirection: 'row' },
                  gap: '0.25rem',
                },
                col: {
                  flex: '1 1 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                },
                buttonContainer: {
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  marginTop: '0.5rem',
                  flexDirection: 'column',
                  '@media (min-width: 640px)': { flexDirection: 'row' },
                },
              }))(sacredtheme),
              severityOptions = severityLevels.map(sl => ({
                value: String(sl.severityLevel),
                attribute1: sl.description || '',
                attribute2: sl._id,
              })),
              statusOptions = statuses.map(s => ({
                value: s.status,
                attribute1: s._id,
              })),
              filteredSubStatusOptions = subStatuses
                .filter(s => {
                  var _statuses_find
                  if (!selectedStatus) return !1
                  const selectedStatusId =
                    null ===
                      (_statuses_find = statuses.find(
                        status => status.status === selectedStatus
                      )) || void 0 === _statuses_find
                      ? void 0
                      : _statuses_find._id
                  return s.statusId === selectedStatusId
                })
                .map(s => {
                  var _statuses_find
                  const associatedStatus =
                    (null ===
                      (_statuses_find = statuses.find(
                        status => status._id === s.statusId
                      )) || void 0 === _statuses_find
                      ? void 0
                      : _statuses_find.status) || ''
                  return {
                    value: s.subStatus,
                    attribute1: associatedStatus,
                    attribute2: s._id,
                  }
                }),
              finalSubStatusOptions =
                filteredSubStatusOptions.length > 0
                  ? filteredSubStatusOptions
                  : selectedStatus
                    ? [
                        {
                          value: 'No substatuses available for this status',
                          attribute1: '',
                          attribute2: '',
                        },
                      ]
                    : [],
              queueOptions = schedulingQueues.map(q => ({
                value: q.queueName,
                attribute1: q._id,
              }))
            react.useEffect(() => {
              setSelectedSubStatusId('')
            }, [selectedStatus])
            const handleSubmit = (0, react.useCallback)(() => {
              if (
                !selectedSeverityId ||
                !selectedStatusId ||
                !selectedSubStatusId
              )
                return void alert('Please fill out all required fields.')
              const newTaskData = {
                title: taskTitle,
                description: taskDescription,
                topicIds: selectedTopicIds,
                articleIds: selectedArticleIds,
                severityId: selectedSeverityId,
                schedulingQueueId: selectedQueueId,
                statusId: selectedStatusId,
                substatusId: selectedSubStatusId,
                employeeIds: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                closedAt: new Date(),
                createdBy: createdUserId,
                comments: [],
                commentIds: [],
                customerAssigned: '',
                severity: '',
                schedulingQueue: '',
                status: '',
                subStatus: '',
                topicLabels: [],
                kbArticles: [],
                teamMember: '',
                nextActionDate: '',
                companyId: '',
                customerId,
                editHistory: [],
              }
              onAdd(newTaskData)
            }, [
              taskTitle,
              taskDescription,
              selectedTopicIds,
              selectedArticleIds,
              selectedSeverityId,
              selectedQueueId,
              selectedStatusId,
              selectedSubStatusId,
              customerId,
              createdUserId,
              onAdd,
            ])
            return (0, jsx_runtime.jsx)(Dialog.A, {
              open,
              onClose,
              styles: { theme: sacredtheme ? 'sacred' : 'light' },
              children: (0, jsx_runtime.jsxs)('div', {
                style: styles.dialog,
                children: [
                  sacredtheme &&
                    (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                      children: [
                        (0, jsx_runtime.jsx)('div', {
                          style: { ...styles.glyph, left: '0.75rem' },
                          children: customerProvided_SACRED_GLYPHS[0],
                        }),
                        (0, jsx_runtime.jsx)('div', {
                          style: {
                            ...styles.glyph,
                            right: '3rem',
                            animationDirection: 'reverse',
                          },
                          children: customerProvided_SACRED_GLYPHS[1],
                        }),
                      ],
                    }),
                  (0, jsx_runtime.jsx)('button', {
                    onClick: onClose,
                    style: {
                      ...styles.closeButton,
                      ...(isCloseHovered && styles.closeButtonHover),
                    },
                    onMouseEnter: () => setCloseHovered(!0),
                    onMouseLeave: () => setCloseHovered(!1),
                    children: (0, jsx_runtime.jsx)(Close.A, {
                      style: { height: '1.5rem', width: '1.5rem' },
                    }),
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: styles.header,
                    children: [
                      (0, jsx_runtime.jsx)(Typography.A, {
                        variant: 'merrih5',
                        styles: { color: sacredtheme ? '#FFD700' : void 0 },
                        children: 'Create Task',
                      }),
                      (0, jsx_runtime.jsxs)('div', {
                        style: styles.formContainer,
                        children: [
                          (0, jsx_runtime.jsx)(Text.A, {
                            label: 'Task Title',
                            value: taskTitle,
                            onChange: setTaskTitle,
                            placeholder: 'Enter Task Title',
                            styles: { theme: sacredtheme ? 'sacred' : 'light' },
                          }),
                          (0, jsx_runtime.jsx)(ComplexTextEditor.A, {
                            label: 'Task Description',
                            value: taskDescription,
                            onChange: setTaskDescription,
                            editorType: 'simple',
                            minRows: 5,
                            styles: { theme: sacredtheme ? 'sacred' : 'light' },
                          }),
                          (0, jsx_runtime.jsxs)('div', {
                            style: styles.row,
                            children: [
                              (0, jsx_runtime.jsxs)('div', {
                                style: styles.col,
                                children: [
                                  (0, jsx_runtime.jsx)(Searchable.A, {
                                    label: 'Severity Level',
                                    options: severityOptions,
                                    defaultValue:
                                      null ===
                                        (_severityOptions_find =
                                          severityOptions.find(
                                            opt =>
                                              opt.attribute2 ===
                                              selectedSeverityId
                                          )) || void 0 === _severityOptions_find
                                        ? void 0
                                        : _severityOptions_find.value,
                                    onChange: option =>
                                      setSelectedSeverityId(
                                        (null == option
                                          ? void 0
                                          : option.attribute2) || ''
                                      ),
                                    placeholder: 'Select severity level',
                                    styles: {
                                      theme: sacredtheme ? 'sacred' : 'light',
                                    },
                                  }),
                                  (0, jsx_runtime.jsx)(Searchable.A, {
                                    label: 'Status',
                                    options: statusOptions,
                                    defaultValue:
                                      null ===
                                        (_statusOptions_find =
                                          statusOptions.find(
                                            opt =>
                                              opt.attribute1 ===
                                              selectedStatusId
                                          )) || void 0 === _statusOptions_find
                                        ? void 0
                                        : _statusOptions_find.value,
                                    onChange: option => {
                                      const newStatus =
                                        (null == option
                                          ? void 0
                                          : option.value) || ''
                                      ;(setSelectedStatus(newStatus),
                                        setSelectedStatusId(
                                          (null == option
                                            ? void 0
                                            : option.attribute1) || ''
                                        ))
                                    },
                                    placeholder: 'Select status',
                                    styles: {
                                      theme: sacredtheme ? 'sacred' : 'light',
                                    },
                                  }),
                                ],
                              }),
                              (0, jsx_runtime.jsxs)('div', {
                                style: styles.col,
                                children: [
                                  (0, jsx_runtime.jsx)(Searchable.A, {
                                    label: 'Associated Product (Queue)',
                                    options: queueOptions,
                                    defaultValue:
                                      null ===
                                        (_queueOptions_find = queueOptions.find(
                                          opt =>
                                            opt.attribute1 === selectedQueueId
                                        )) || void 0 === _queueOptions_find
                                        ? void 0
                                        : _queueOptions_find.value,
                                    onChange: option =>
                                      setSelectedQueueId(
                                        (null == option
                                          ? void 0
                                          : option.attribute1) || ''
                                      ),
                                    placeholder: 'Select product queue',
                                    styles: {
                                      theme: sacredtheme ? 'sacred' : 'light',
                                    },
                                  }),
                                  (0, jsx_runtime.jsx)(Searchable.A, {
                                    label: 'Substatus',
                                    options: finalSubStatusOptions,
                                    defaultValue:
                                      null ===
                                        (_finalSubStatusOptions_find =
                                          finalSubStatusOptions.find(
                                            opt =>
                                              opt.attribute2 ===
                                              selectedSubStatusId
                                          )) ||
                                      void 0 === _finalSubStatusOptions_find
                                        ? void 0
                                        : _finalSubStatusOptions_find.value,
                                    onChange: option =>
                                      setSelectedSubStatusId(
                                        (null == option
                                          ? void 0
                                          : option.attribute2) || ''
                                      ),
                                    placeholder: selectedStatus
                                      ? 'Select substatus'
                                      : 'Please select a status first',
                                    styles: {
                                      theme: sacredtheme ? 'sacred' : 'light',
                                      disabled: !selectedStatus,
                                    },
                                  }),
                                ],
                              }),
                            ],
                          }),
                          react.useMemo(() => {
                            const topicOptions = topics.map(t => ({
                                value: t.topic || `Topic ${t._id}`,
                                attribute1: t._id,
                              })),
                              selectedTopicValues = selectedTopicIds.map(id => {
                                const topic = topics.find(t => t._id === id)
                                return topic
                                  ? topic.topic || `Topic ${topic._id}`
                                  : id
                              })
                            return (0, jsx_runtime.jsx)(MultiSelect.A, {
                              label: 'Topics',
                              options: topicOptions,
                              defaultSelected: selectedTopicValues,
                              onChange: selectedValues => {
                                const newSelectedIds = selectedValues.map(
                                  value => {
                                    const matchingTopic = topicOptions.find(
                                      opt => opt.value === value
                                    )
                                    return (
                                      (null == matchingTopic
                                        ? void 0
                                        : matchingTopic.attribute1) || value
                                    )
                                  }
                                )
                                setSelectedTopicIds(newSelectedIds)
                              },
                              complexOptions: !0,
                              styles: {
                                theme: sacredtheme ? 'sacred' : 'light',
                              },
                            })
                          }, [topics, selectedTopicIds, sacredtheme]),
                          react.useMemo(() => {
                            const articleOptions = knowledgebaseArticles.map(
                                a => ({
                                  value: a.articleTitle || `Article ${a._id}`,
                                  attribute1: a._id,
                                })
                              ),
                              selectedArticleValues = selectedArticleIds.map(
                                id => {
                                  const article = knowledgebaseArticles.find(
                                    a => a._id === id
                                  )
                                  return article
                                    ? article.articleTitle ||
                                        `Article ${article._id}`
                                    : id
                                }
                              )
                            return (0, jsx_runtime.jsx)(MultiSelect.A, {
                              label: 'Knowledgebase Articles',
                              options: articleOptions,
                              defaultSelected: selectedArticleValues,
                              onChange: selectedValues => {
                                const newSelectedIds = selectedValues.map(
                                  value => {
                                    const matchingArticle = articleOptions.find(
                                      opt => opt.value === value
                                    )
                                    return (
                                      (null == matchingArticle
                                        ? void 0
                                        : matchingArticle.attribute1) || value
                                    )
                                  }
                                )
                                setSelectedArticleIds(newSelectedIds)
                              },
                              complexOptions: !0,
                              styles: {
                                theme: sacredtheme ? 'sacred' : 'light',
                              },
                            })
                          }, [
                            knowledgebaseArticles,
                            selectedArticleIds,
                            sacredtheme,
                          ]),
                          (0, jsx_runtime.jsxs)('div', {
                            style: styles.buttonContainer,
                            children: [
                              (0, jsx_runtime.jsx)(Button.A, {
                                text: 'Cancel',
                                onClick: onClose,
                                styles: {
                                  theme: sacredtheme ? 'sacred' : 'light',
                                },
                              }),
                              (0, jsx_runtime.jsx)(Button.A, {
                                text: 'Create Task',
                                onClick: handleSubmit,
                                styles: {
                                  theme: sacredtheme ? 'sacred' : 'light',
                                },
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            })
          },
          customerProvided = CompanyAddTaskCustomerProvided
        CompanyAddTaskCustomerProvided.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'CompanyAddTaskCustomerProvided',
          props: {
            open: {
              required: !0,
              tsType: { name: 'boolean' },
              description: '',
            },
            onClose: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onAdd: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: "(newTask: Omit<Task, '_id'>) => void",
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'Omit',
                        elements: [
                          {
                            name: 'signature',
                            type: 'object',
                            raw: '{\n  _id: string\n  /** The parent company ID or other domain-specific reference. */\n  companyId: string\n  title: string\n  description: string\n  /** If severity is linked to a separate record, store it here. */\n  severityId: string\n  /** The main status. */\n  statusId: string\n  /** The sub-status. */\n  substatusId: string\n  /** The scheduling queue ID. */\n  schedulingQueueId: string\n  /** Topics array, each referencing a topic ID. */\n  topicIds: string[]\n  /** Comments array, referencing comment IDs. */\n  commentIds: string[]\n  /** Employee IDs assigned to the task. */\n  employeeIds: string[]\n  /** Knowledgebase article IDs. */\n  articleIds: string[]\n  /** The "customer" ID if you have one. */\n  customerId: string\n  /** Timestamps. */\n  createdAt: Date\n  closedAt: Date\n  updatedAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n  /**\n   * If you want to store the actual comments (rather than just commentIds),\n   * so ShowTask can display them directly.\n   */\n  comments: Comment[]\n  /** If you store the "customer assigned" label as text (e.g. "Bobbie Sue"). */\n  customerAssigned: string\n  /** Severity label text (e.g. "Critical"). */\n  severity: string\n  /** Scheduling Queue text (e.g. "Technologies Unlimited"). */\n  schedulingQueue: string\n  /** High-level status text (e.g. "Open"). */\n  status: string\n  /** Sub-status text (e.g. "In Progress"). */\n  subStatus: string\n  /**\n   * If you want to store the actual topic strings (e.g. ["Technical Support"]).\n   * This can be used in addition to or instead of topicIds.\n   */\n  topicLabels: string[]\n  /**\n   * If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\n   * This can be used in addition to or instead of articleIds.\n   */\n  kbArticles: string[]\n  /** A string representing the assigned team member (e.g. "Matthew Goluba"). */\n  teamMember: string\n  /** If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST"). */\n  nextActionDate: string\n}',
                            signature: {
                              properties: [
                                {
                                  key: '_id',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'companyId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'The parent company ID or other domain-specific reference.',
                                },
                                {
                                  key: 'title',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'description',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'severityId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If severity is linked to a separate record, store it here.',
                                },
                                {
                                  key: 'statusId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The main status.',
                                },
                                {
                                  key: 'substatusId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The sub-status.',
                                },
                                {
                                  key: 'schedulingQueueId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The scheduling queue ID.',
                                },
                                {
                                  key: 'topicIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Topics array, each referencing a topic ID.',
                                },
                                {
                                  key: 'commentIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Comments array, referencing comment IDs.',
                                },
                                {
                                  key: 'employeeIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Employee IDs assigned to the task.',
                                },
                                {
                                  key: 'articleIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description: 'Knowledgebase article IDs.',
                                },
                                {
                                  key: 'customerId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'The "customer" ID if you have one.',
                                },
                                {
                                  key: 'createdAt',
                                  value: { name: 'Date', required: !0 },
                                  description: 'Timestamps.',
                                },
                                {
                                  key: 'closedAt',
                                  value: { name: 'Date', required: !0 },
                                },
                                {
                                  key: 'updatedAt',
                                  value: { name: 'Date', required: !0 },
                                },
                                {
                                  key: 'createdBy',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'editHistory',
                                  value: {
                                    name: 'Array',
                                    elements: [
                                      {
                                        name: 'signature',
                                        type: 'object',
                                        raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                        signature: {
                                          properties: [
                                            {
                                              key: '_id',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'editedBy',
                                              value: {
                                                name: 'string',
                                                required: !1,
                                              },
                                            },
                                            {
                                              key: 'editedAt',
                                              value: {
                                                name: 'Date',
                                                required: !1,
                                              },
                                            },
                                            {
                                              key: 'text',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'isOriginal',
                                              value: {
                                                name: 'boolean',
                                                required: !0,
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                    raw: 'CommentEditHistory[]',
                                    required: !0,
                                  },
                                },
                                {
                                  key: 'comments',
                                  value: {
                                    name: 'Array',
                                    elements: [
                                      {
                                        name: 'signature',
                                        type: 'object',
                                        raw: '{\n  _id: string\n  text: string\n  createdAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n}',
                                        signature: {
                                          properties: [
                                            {
                                              key: '_id',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'text',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'createdAt',
                                              value: {
                                                name: 'Date',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'createdBy',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'editHistory',
                                              value: {
                                                name: 'Array',
                                                elements: [
                                                  {
                                                    name: 'signature',
                                                    type: 'object',
                                                    raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                                    signature: {
                                                      properties: [
                                                        {
                                                          key: '_id',
                                                          value: {
                                                            name: 'string',
                                                            required: !0,
                                                          },
                                                        },
                                                        {
                                                          key: 'editedBy',
                                                          value: {
                                                            name: 'string',
                                                            required: !1,
                                                          },
                                                        },
                                                        {
                                                          key: 'editedAt',
                                                          value: {
                                                            name: 'Date',
                                                            required: !1,
                                                          },
                                                        },
                                                        {
                                                          key: 'text',
                                                          value: {
                                                            name: 'string',
                                                            required: !0,
                                                          },
                                                        },
                                                        {
                                                          key: 'isOriginal',
                                                          value: {
                                                            name: 'boolean',
                                                            required: !0,
                                                          },
                                                        },
                                                      ],
                                                    },
                                                  },
                                                ],
                                                raw: 'CommentEditHistory[]',
                                                required: !0,
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                    raw: 'Comment[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store the actual comments (rather than just commentIds),\nso ShowTask can display them directly.',
                                },
                                {
                                  key: 'customerAssigned',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If you store the "customer assigned" label as text (e.g. "Bobbie Sue").',
                                },
                                {
                                  key: 'severity',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Severity label text (e.g. "Critical").',
                                },
                                {
                                  key: 'schedulingQueue',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Scheduling Queue text (e.g. "Technologies Unlimited").',
                                },
                                {
                                  key: 'status',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'High-level status text (e.g. "Open").',
                                },
                                {
                                  key: 'subStatus',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Sub-status text (e.g. "In Progress").',
                                },
                                {
                                  key: 'topicLabels',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store the actual topic strings (e.g. ["Technical Support"]).\nThis can be used in addition to or instead of topicIds.',
                                },
                                {
                                  key: 'kbArticles',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\nThis can be used in addition to or instead of articleIds.',
                                },
                                {
                                  key: 'teamMember',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'A string representing the assigned team member (e.g. "Matthew Goluba").',
                                },
                                {
                                  key: 'nextActionDate',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST").',
                                },
                              ],
                            },
                          },
                          { name: 'literal', value: "'_id'" },
                        ],
                        raw: "Omit<Task, '_id'>",
                      },
                      name: 'newTask',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            statuses: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  status: string\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'status',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawStatus[]',
              },
              description: '',
            },
            subStatuses: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  subStatus: string\n  description?: string\n  statusId: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'subStatus',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                        {
                          key: 'statusId',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawSubStatus[]',
              },
              description: '',
            },
            topics: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  topic: string\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'topic',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawTopic[]',
              },
              description: '',
            },
            schedulingQueues: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  queueName: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'queueName',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawQueue[]',
              },
              description: '',
            },
            knowledgebaseArticles: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  articleTitle: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'articleTitle',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawArticle[]',
              },
              description: '',
            },
            severityLevels: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  severityLevel: number\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'severityLevel',
                          value: { name: 'number', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawSeverityLevel[]',
              },
              description: '',
            },
            customerId: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            createdUserId: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            sacredtheme: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
          },
        }
        const customer_SACRED_GLYPHS = ['𓁹', '𓂀', '𓊖', '𓊹'],
          CustomerAddTask = ({
            open,
            onClose,
            onAdd,
            topics,
            schedulingQueues,
            severityLevels,
            companyId,
            createdUserId,
            styles,
          }) => {
            var _severityOptions_find, _queueOptions_find
            const [selectedSeverityId, setSelectedSeverityId] = (0,
              react.useState)(''),
              [selectedQueueId, setSelectedQueueId] = (0, react.useState)(''),
              [selectedTopicIds, setSelectedTopicIds] = (0, react.useState)([]),
              [taskTitle, setTaskTitle] = (0, react.useState)(''),
              [taskDescription, setTaskDescription] = (0, react.useState)(''),
              [isCloseHovered, setCloseHovered] = (0, react.useState)(!1),
              computedStyles = (styles => {
                const isSacredTheme =
                    'sacred' === (null == styles ? void 0 : styles.theme),
                  isDarkTheme =
                    'dark' === (null == styles ? void 0 : styles.theme)
                return {
                  dialog: {
                    width: '100%',
                    '@media (min-width: 640px)': { width: '700px' },
                    margin: '1rem auto',
                    pointerEvents: 'auto',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    ...(isSacredTheme && {
                      border: '2px solid rgba(255, 215, 0, 0.5)',
                      boxShadow: '0 0 1.5rem rgba(255, 215, 0, 0.3)',
                      backgroundColor: 'rgba(0, 0, 0, 0.95)',
                      animation: 'add-task-glow-pulse 2s infinite alternate',
                    }),
                    ...(isDarkTheme && {
                      backgroundColor: 'rgba(17, 24, 39, 0.95)',
                      border: '2px solid rgba(75, 85, 99, 0.5)',
                    }),
                  },
                  glyph: {
                    position: 'absolute',
                    top: '0.75rem',
                    fontSize: '1.125rem',
                    color: 'rgba(255, 215, 0, 0.3)',
                    zIndex: 10,
                    animation: 'add-task-float-glyph 5s infinite alternate',
                  },
                  closeButton: {
                    position: 'absolute',
                    right: '0.5rem',
                    top: '0.5rem',
                    zIndex: 20,
                    padding: '0.25rem',
                    borderRadius: '9999px',
                    color: isSacredTheme
                      ? '#FFD700'
                      : isDarkTheme
                        ? '#E5E7EB'
                        : '#6B7280',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  },
                  closeButtonHover: {
                    color: isSacredTheme
                      ? '#FBBF24'
                      : isDarkTheme
                        ? '#F9FAFB'
                        : '#1F2937',
                  },
                  header: {
                    padding: '0.75rem',
                    ...(isSacredTheme && {
                      borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
                      backgroundColor: 'rgba(255, 215, 0, 0.05)',
                    }),
                    ...(isDarkTheme && {
                      borderBottom: '2px solid rgba(75, 85, 99, 0.3)',
                      backgroundColor: 'rgba(75, 85, 99, 0.05)',
                    }),
                  },
                  title: {
                    marginBottom: '0.75rem',
                    ...(isSacredTheme && {
                      fontFamily: 'Cinzel, serif',
                      letterSpacing: '0.05em',
                      textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
                      color: '#FFD700',
                    }),
                    ...(isDarkTheme && { color: '#E5E7EB' }),
                  },
                  formContainer: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  },
                  row: {
                    display: 'flex',
                    flexDirection: 'column',
                    '@media (min-width: 640px)': { flexDirection: 'row' },
                    gap: '0.25rem',
                  },
                  col: {
                    flex: '1 1 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  },
                  buttonContainer: {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                    flexDirection: 'column',
                    '@media (min-width: 640px)': { flexDirection: 'row' },
                  },
                }
              })(styles),
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              severityOptions = severityLevels.map(sl => ({
                value: String(sl.severityLevel),
                attribute1: sl.description || '',
                attribute2: sl._id,
              })),
              queueOptions = schedulingQueues.map(q => ({
                value: q.queueName,
                attribute1: q._id,
              })),
              handleSubmit = (0, react.useCallback)(() => {
                if (!selectedSeverityId || !taskTitle || !taskDescription)
                  return void alert('Please fill out all required fields.')
                const newTaskData = {
                  title: taskTitle,
                  description: taskDescription,
                  topicIds: selectedTopicIds,
                  articleIds: [],
                  severityId: selectedSeverityId,
                  schedulingQueueId: selectedQueueId,
                  statusId: '',
                  substatusId: '',
                  employeeIds: [],
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  closedAt: new Date(),
                  createdBy: createdUserId,
                  comments: [],
                  commentIds: [],
                  customerAssigned: '',
                  severity: '',
                  schedulingQueue: '',
                  status: '',
                  subStatus: '',
                  topicLabels: [],
                  kbArticles: [],
                  teamMember: '',
                  nextActionDate: '',
                  companyId,
                  customerId: createdUserId,
                  editHistory: [],
                }
                onAdd(newTaskData)
              }, [
                taskTitle,
                taskDescription,
                selectedTopicIds,
                selectedSeverityId,
                selectedQueueId,
                companyId,
                createdUserId,
                onAdd,
              ])
            return (0, jsx_runtime.jsx)(Dialog.A, {
              open,
              onClose,
              styles: { theme: isSacredTheme ? 'sacred' : 'light' },
              children: (0, jsx_runtime.jsxs)('div', {
                style: computedStyles.dialog,
                children: [
                  isSacredTheme &&
                    (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                      children: [
                        (0, jsx_runtime.jsx)('div', {
                          style: { ...computedStyles.glyph, left: '0.75rem' },
                          children: customer_SACRED_GLYPHS[0],
                        }),
                        (0, jsx_runtime.jsx)('div', {
                          style: {
                            ...computedStyles.glyph,
                            right: '3rem',
                            animationDirection: 'reverse',
                          },
                          children: customer_SACRED_GLYPHS[1],
                        }),
                      ],
                    }),
                  (0, jsx_runtime.jsx)('button', {
                    onClick: onClose,
                    style: {
                      ...computedStyles.closeButton,
                      ...(isCloseHovered && computedStyles.closeButtonHover),
                    },
                    onMouseEnter: () => setCloseHovered(!0),
                    onMouseLeave: () => setCloseHovered(!1),
                    children: (0, jsx_runtime.jsx)(Close.A, {
                      style: { height: '1.5rem', width: '1.5rem' },
                    }),
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: computedStyles.header,
                    children: [
                      (0, jsx_runtime.jsx)(Typography.A, {
                        variant: 'merrih5',
                        styles: { color: isSacredTheme ? '#FFD700' : void 0 },
                        children: 'Create Task',
                      }),
                      (0, jsx_runtime.jsxs)('div', {
                        style: computedStyles.formContainer,
                        children: [
                          (0, jsx_runtime.jsx)(Text.A, {
                            label: 'Task Title',
                            value: taskTitle,
                            onChange: setTaskTitle,
                            placeholder: 'Enter Task Title',
                            styles: {
                              theme: null == styles ? void 0 : styles.theme,
                            },
                          }),
                          (0, jsx_runtime.jsx)(ComplexTextEditor.A, {
                            label: 'Task Description',
                            value: taskDescription,
                            onChange: setTaskDescription,
                            editorType: 'simple',
                            minRows: 5,
                            styles: {
                              theme: null == styles ? void 0 : styles.theme,
                            },
                          }),
                          (0, jsx_runtime.jsxs)('div', {
                            style: computedStyles.row,
                            children: [
                              (0, jsx_runtime.jsx)('div', {
                                style: computedStyles.col,
                                children: (0, jsx_runtime.jsx)(Searchable.A, {
                                  label: 'Severity Level',
                                  options: severityOptions,
                                  defaultValue:
                                    null ===
                                      (_severityOptions_find =
                                        severityOptions.find(
                                          opt =>
                                            opt.attribute2 ===
                                            selectedSeverityId
                                        )) || void 0 === _severityOptions_find
                                      ? void 0
                                      : _severityOptions_find.value,
                                  onChange: option =>
                                    setSelectedSeverityId(
                                      (null == option
                                        ? void 0
                                        : option.attribute2) || ''
                                    ),
                                  placeholder: 'Select severity level',
                                  styles: {
                                    theme:
                                      null == styles ? void 0 : styles.theme,
                                  },
                                }),
                              }),
                              (0, jsx_runtime.jsx)('div', {
                                style: computedStyles.col,
                                children: (0, jsx_runtime.jsx)(Searchable.A, {
                                  label: 'Associated Product (Queue)',
                                  options: queueOptions,
                                  defaultValue:
                                    null ===
                                      (_queueOptions_find = queueOptions.find(
                                        opt =>
                                          opt.attribute1 === selectedQueueId
                                      )) || void 0 === _queueOptions_find
                                      ? void 0
                                      : _queueOptions_find.value,
                                  onChange: option =>
                                    setSelectedQueueId(
                                      (null == option
                                        ? void 0
                                        : option.attribute1) || ''
                                    ),
                                  placeholder: 'Select product queue',
                                  styles: {
                                    theme:
                                      null == styles ? void 0 : styles.theme,
                                  },
                                }),
                              }),
                            ],
                          }),
                          react.useMemo(() => {
                            const topicOptions = topics.map(t => ({
                                value: t.topic || `Topic ${t._id}`,
                                attribute1: t._id,
                              })),
                              selectedTopicValues = selectedTopicIds.map(id => {
                                const topic = topics.find(t => t._id === id)
                                return topic
                                  ? topic.topic || `Topic ${topic._id}`
                                  : id
                              })
                            return (0, jsx_runtime.jsx)(MultiSelect.A, {
                              label: 'Topics',
                              options: topicOptions,
                              defaultSelected: selectedTopicValues,
                              onChange: selectedValues => {
                                const newSelectedIds = selectedValues.map(
                                  value => {
                                    const matchingTopic = topicOptions.find(
                                      opt => opt.value === value
                                    )
                                    return (
                                      (null == matchingTopic
                                        ? void 0
                                        : matchingTopic.attribute1) || value
                                    )
                                  }
                                )
                                setSelectedTopicIds(newSelectedIds)
                              },
                              complexOptions: !0,
                              styles: {
                                theme: null == styles ? void 0 : styles.theme,
                              },
                            })
                          }, [
                            topics,
                            selectedTopicIds,
                            null == styles ? void 0 : styles.theme,
                          ]),
                          (0, jsx_runtime.jsxs)('div', {
                            style: computedStyles.buttonContainer,
                            children: [
                              (0, jsx_runtime.jsx)(Button.A, {
                                text: 'Cancel',
                                onClick: onClose,
                                styles: {
                                  theme: null == styles ? void 0 : styles.theme,
                                },
                              }),
                              (0, jsx_runtime.jsx)(Button.A, {
                                text: 'Create Task',
                                onClick: handleSubmit,
                                styles: {
                                  theme: null == styles ? void 0 : styles.theme,
                                },
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            })
          },
          customer = CustomerAddTask
        CustomerAddTask.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'CustomerAddTask',
          props: {
            open: {
              required: !0,
              tsType: { name: 'boolean' },
              description: '',
            },
            onClose: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onAdd: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: "(newTask: Omit<Task, '_id'>) => void",
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'Omit',
                        elements: [
                          {
                            name: 'signature',
                            type: 'object',
                            raw: '{\n  _id: string\n  /** The parent company ID or other domain-specific reference. */\n  companyId: string\n  title: string\n  description: string\n  /** If severity is linked to a separate record, store it here. */\n  severityId: string\n  /** The main status. */\n  statusId: string\n  /** The sub-status. */\n  substatusId: string\n  /** The scheduling queue ID. */\n  schedulingQueueId: string\n  /** Topics array, each referencing a topic ID. */\n  topicIds: string[]\n  /** Comments array, referencing comment IDs. */\n  commentIds: string[]\n  /** Employee IDs assigned to the task. */\n  employeeIds: string[]\n  /** Knowledgebase article IDs. */\n  articleIds: string[]\n  /** The "customer" ID if you have one. */\n  customerId: string\n  /** Timestamps. */\n  createdAt: Date\n  closedAt: Date\n  updatedAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n  /**\n   * If you want to store the actual comments (rather than just commentIds),\n   * so ShowTask can display them directly.\n   */\n  comments: Comment[]\n  /** If you store the "customer assigned" label as text (e.g. "Bobbie Sue"). */\n  customerAssigned: string\n  /** Severity label text (e.g. "Critical"). */\n  severity: string\n  /** Scheduling Queue text (e.g. "Technologies Unlimited"). */\n  schedulingQueue: string\n  /** High-level status text (e.g. "Open"). */\n  status: string\n  /** Sub-status text (e.g. "In Progress"). */\n  subStatus: string\n  /**\n   * If you want to store the actual topic strings (e.g. ["Technical Support"]).\n   * This can be used in addition to or instead of topicIds.\n   */\n  topicLabels: string[]\n  /**\n   * If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\n   * This can be used in addition to or instead of articleIds.\n   */\n  kbArticles: string[]\n  /** A string representing the assigned team member (e.g. "Matthew Goluba"). */\n  teamMember: string\n  /** If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST"). */\n  nextActionDate: string\n}',
                            signature: {
                              properties: [
                                {
                                  key: '_id',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'companyId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'The parent company ID or other domain-specific reference.',
                                },
                                {
                                  key: 'title',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'description',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'severityId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If severity is linked to a separate record, store it here.',
                                },
                                {
                                  key: 'statusId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The main status.',
                                },
                                {
                                  key: 'substatusId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The sub-status.',
                                },
                                {
                                  key: 'schedulingQueueId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The scheduling queue ID.',
                                },
                                {
                                  key: 'topicIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Topics array, each referencing a topic ID.',
                                },
                                {
                                  key: 'commentIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Comments array, referencing comment IDs.',
                                },
                                {
                                  key: 'employeeIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Employee IDs assigned to the task.',
                                },
                                {
                                  key: 'articleIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description: 'Knowledgebase article IDs.',
                                },
                                {
                                  key: 'customerId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'The "customer" ID if you have one.',
                                },
                                {
                                  key: 'createdAt',
                                  value: { name: 'Date', required: !0 },
                                  description: 'Timestamps.',
                                },
                                {
                                  key: 'closedAt',
                                  value: { name: 'Date', required: !0 },
                                },
                                {
                                  key: 'updatedAt',
                                  value: { name: 'Date', required: !0 },
                                },
                                {
                                  key: 'createdBy',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'editHistory',
                                  value: {
                                    name: 'Array',
                                    elements: [
                                      {
                                        name: 'signature',
                                        type: 'object',
                                        raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                        signature: {
                                          properties: [
                                            {
                                              key: '_id',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'editedBy',
                                              value: {
                                                name: 'string',
                                                required: !1,
                                              },
                                            },
                                            {
                                              key: 'editedAt',
                                              value: {
                                                name: 'Date',
                                                required: !1,
                                              },
                                            },
                                            {
                                              key: 'text',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'isOriginal',
                                              value: {
                                                name: 'boolean',
                                                required: !0,
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                    raw: 'CommentEditHistory[]',
                                    required: !0,
                                  },
                                },
                                {
                                  key: 'comments',
                                  value: {
                                    name: 'Array',
                                    elements: [
                                      {
                                        name: 'signature',
                                        type: 'object',
                                        raw: '{\n  _id: string\n  text: string\n  createdAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n}',
                                        signature: {
                                          properties: [
                                            {
                                              key: '_id',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'text',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'createdAt',
                                              value: {
                                                name: 'Date',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'createdBy',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'editHistory',
                                              value: {
                                                name: 'Array',
                                                elements: [
                                                  {
                                                    name: 'signature',
                                                    type: 'object',
                                                    raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                                    signature: {
                                                      properties: [
                                                        {
                                                          key: '_id',
                                                          value: {
                                                            name: 'string',
                                                            required: !0,
                                                          },
                                                        },
                                                        {
                                                          key: 'editedBy',
                                                          value: {
                                                            name: 'string',
                                                            required: !1,
                                                          },
                                                        },
                                                        {
                                                          key: 'editedAt',
                                                          value: {
                                                            name: 'Date',
                                                            required: !1,
                                                          },
                                                        },
                                                        {
                                                          key: 'text',
                                                          value: {
                                                            name: 'string',
                                                            required: !0,
                                                          },
                                                        },
                                                        {
                                                          key: 'isOriginal',
                                                          value: {
                                                            name: 'boolean',
                                                            required: !0,
                                                          },
                                                        },
                                                      ],
                                                    },
                                                  },
                                                ],
                                                raw: 'CommentEditHistory[]',
                                                required: !0,
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                    raw: 'Comment[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store the actual comments (rather than just commentIds),\nso ShowTask can display them directly.',
                                },
                                {
                                  key: 'customerAssigned',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If you store the "customer assigned" label as text (e.g. "Bobbie Sue").',
                                },
                                {
                                  key: 'severity',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Severity label text (e.g. "Critical").',
                                },
                                {
                                  key: 'schedulingQueue',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Scheduling Queue text (e.g. "Technologies Unlimited").',
                                },
                                {
                                  key: 'status',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'High-level status text (e.g. "Open").',
                                },
                                {
                                  key: 'subStatus',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Sub-status text (e.g. "In Progress").',
                                },
                                {
                                  key: 'topicLabels',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store the actual topic strings (e.g. ["Technical Support"]).\nThis can be used in addition to or instead of topicIds.',
                                },
                                {
                                  key: 'kbArticles',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\nThis can be used in addition to or instead of articleIds.',
                                },
                                {
                                  key: 'teamMember',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'A string representing the assigned team member (e.g. "Matthew Goluba").',
                                },
                                {
                                  key: 'nextActionDate',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST").',
                                },
                              ],
                            },
                          },
                          { name: 'literal', value: "'_id'" },
                        ],
                        raw: "Omit<Task, '_id'>",
                      },
                      name: 'newTask',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            topics: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  topic: string\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'topic',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawTopic[]',
              },
              description: '',
            },
            schedulingQueues: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  queueName: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'queueName',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawQueue[]',
              },
              description: '',
            },
            severityLevels: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  severityLevel: number\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'severityLevel',
                          value: { name: 'number', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawSeverityLevel[]',
              },
              description: '',
            },
            companyId: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            createdUserId: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'ProjectBoardStyles' },
              description: '',
            },
          },
        }
        var MoreVert = __webpack_require__(
            './src/components/Icons/MoreVert.tsx'
          ),
          Popover = __webpack_require__('./src/components/Popover/index.tsx'),
          DateField = __webpack_require__(
            './src/components/Field/Date/DateField/index.tsx'
          ),
          Chip = __webpack_require__('./src/components/Chip/index.tsx')
        const client_SACRED_GLYPHS = ['𓁹', '𓂀', '𓊖', '𓊹']
        function formatRelativeTime(date) {
          if (!date) return ''
          const diff = new Date().getTime() - date.getTime()
          if (diff < 0) return 'in the future?'
          const mins = Math.floor(diff / 6e4)
          if (mins < 60) return `${mins} minute${1 === mins ? '' : 's'} ago`
          const hours = Math.floor(mins / 60)
          if (hours < 24) return `${hours} hour${1 === hours ? '' : 's'} ago`
          const days = Math.floor(hours / 24)
          return `${days} day${1 === days ? '' : 's'} ago`
        }
        function safeParseDate(dateStr) {
          if (!dateStr) return null
          const d = new Date(dateStr)
          return Number.isNaN(d.getTime()) ? null : d
        }
        const ShowTask = ({
            open,
            onClose,
            taskId,
            taskTitle,
            createdBy,
            description,
            comments,
            customerAssigned,
            severity,
            schedulingQueue,
            status,
            subStatus,
            topics,
            knowledgebaseArticles,
            teamMemberAssigned,
            nextActionDate,
            customerOptions,
            severityOptions,
            schedulingQueueOptions,
            statusOptions,
            subStatusOptions,
            topicOptions,
            knowledgebaseArticleOptions,
            teamMemberOptions,
            currentUserName,
            onCloseTask,
            onComment,
            onEdit,
            onDelete,
            onDuplicate,
            onEditComment,
            onRevisionHistory,
            styles,
          }) => {
            const [localComments, setLocalComments] = (0, react.useState)(
                comments
              ),
              [newComment, setNewComment] = (0, react.useState)(''),
              [isEditing, setIsEditing] = (0, react.useState)(!1),
              [formData, setFormData] = (0, react.useState)({
                taskTitle,
                description,
                customerAssigned,
                severity,
                schedulingQueue,
                status,
                subStatus,
                topics,
                knowledgebaseArticles,
                teamMemberAssigned,
                nextActionDate,
              }),
              [editingCommentId, setEditingCommentId] = (0, react.useState)(
                null
              ),
              [editingCommentText, setEditingCommentText] = (0, react.useState)(
                ''
              ),
              [selectedRevisions, setSelectedRevisions] = (0, react.useState)(
                {}
              ),
              computedStyles = (styles => {
                const isSacredTheme =
                    'sacred' === (null == styles ? void 0 : styles.theme),
                  isDarkTheme =
                    'dark' === (null == styles ? void 0 : styles.theme)
                return {
                  dialog: {
                    borderWidth: '2px',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    ...(isSacredTheme
                      ? {
                          borderColor: 'rgba(255, 215, 0, 0.5)',
                          backgroundColor: 'rgba(0, 0, 0, 0.95)',
                          animation:
                            'show-task-glow-pulse 2s infinite alternate',
                        }
                      : isDarkTheme
                        ? {
                            borderColor: 'rgba(75, 85, 99, 0.5)',
                            backgroundColor: 'rgba(17, 24, 39, 0.95)',
                          }
                        : { borderColor: 'black' }),
                  },
                  glyph: {
                    position: 'absolute',
                    top: '0.75rem',
                    color: 'rgba(255, 215, 0, 0.3)',
                    fontSize: '1.125rem',
                    zIndex: 10,
                    animation: 'show-task-float-glyph 5s infinite alternate',
                  },
                  header: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.5rem',
                    borderBottom:
                      '2px solid ' +
                      (isSacredTheme
                        ? 'rgba(255, 215, 0, 0.3)'
                        : isDarkTheme
                          ? 'rgba(75, 85, 99, 0.3)'
                          : 'black'),
                    ...(isSacredTheme && {
                      backgroundColor: 'rgba(255, 215, 0, 0.05)',
                    }),
                    ...(isDarkTheme && {
                      backgroundColor: 'rgba(75, 85, 99, 0.05)',
                    }),
                  },
                  headerTitle: {
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    ...(isSacredTheme && {
                      fontFamily: 'Cinzel, serif',
                      letterSpacing: '0.05em',
                      textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
                    }),
                    ...(isDarkTheme && { color: '#E5E7EB' }),
                  },
                  headerSubtitle: {
                    fontSize: '0.875rem',
                    marginTop: '0.125rem',
                    ...(isSacredTheme && { fontFamily: 'Crimson Text, serif' }),
                    ...(isDarkTheme && { color: '#9CA3AF' }),
                  },
                  headerActions: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  },
                  grid: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 0,
                  },
                  mainContent: {
                    gridColumn: 'span 2 / span 2',
                    padding: '0.5rem',
                    paddingTop: 0,
                  },
                  descriptionContainer: {
                    border:
                      '1px solid ' +
                      (isSacredTheme
                        ? 'rgba(255, 215, 0, 0.3)'
                        : isDarkTheme
                          ? 'rgba(75, 85, 99, 0.3)'
                          : 'black'),
                    margin: '0 -8px',
                    padding: '0.5rem 8px',
                    paddingBottom: '0.5rem',
                    ...(isSacredTheme && {
                      backgroundColor: 'rgba(255, 215, 0, 0.02)',
                    }),
                    ...(isDarkTheme && {
                      backgroundColor: 'rgba(75, 85, 99, 0.02)',
                    }),
                  },
                  sectionTitle: {
                    fontWeight: 700,
                    marginBottom: '0.25rem',
                    ...(isSacredTheme && { fontFamily: 'Cinzel, serif' }),
                    ...(isDarkTheme && { color: '#E5E7EB' }),
                  },
                  descriptionText: {
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    ...(isSacredTheme && { fontFamily: 'Crimson Text, serif' }),
                    ...(isDarkTheme && { color: '#D1D5DB' }),
                  },
                  comment: { marginBottom: '0' },
                  commentEditing: {
                    border:
                      '1px solid ' +
                      (isSacredTheme
                        ? 'rgba(255, 215, 0, 0.3)'
                        : isDarkTheme
                          ? 'rgba(75, 85, 99, 0.3)'
                          : 'black'),
                    margin: '0 -8px',
                    padding: '0.25rem 0.5rem',
                    ...(isSacredTheme && {
                      backgroundColor: 'rgba(255, 215, 0, 0.02)',
                    }),
                    ...(isDarkTheme && {
                      backgroundColor: 'rgba(75, 85, 99, 0.02)',
                    }),
                  },
                  commentContent: {
                    border:
                      '1px solid ' +
                      (isSacredTheme
                        ? 'rgba(255, 215, 0, 0.3)'
                        : isDarkTheme
                          ? 'rgba(75, 85, 99, 0.3)'
                          : 'black'),
                    margin: '0 -8px',
                    padding: '0.5rem',
                    ...(isSacredTheme && {
                      backgroundColor: 'rgba(255, 215, 0, 0.02)',
                    }),
                    ...(isDarkTheme && {
                      backgroundColor: 'rgba(75, 85, 99, 0.02)',
                    }),
                  },
                  sidebar: {
                    gridColumn: 'span 1 / span 1',
                    padding: '0.5rem',
                    borderLeft:
                      '2px solid ' +
                      (isSacredTheme
                        ? 'rgba(255, 215, 0, 0.3)'
                        : isDarkTheme
                          ? 'rgba(75, 85, 99, 0.3)'
                          : 'black'),
                    ...(isSacredTheme && {
                      backgroundColor: 'rgba(255, 215, 0, 0.02)',
                    }),
                    ...(isDarkTheme && {
                      backgroundColor: 'rgba(75, 85, 99, 0.02)',
                    }),
                  },
                  sidebarSection: { marginBottom: '0.5rem' },
                  sidebarLabel: {
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    ...(isSacredTheme && { fontFamily: 'Cinzel, serif' }),
                    ...(isDarkTheme && { color: '#E5E7EB' }),
                  },
                  sidebarValue: {
                    fontSize: '0.875rem',
                    ...(isSacredTheme && { fontFamily: 'Crimson Text, serif' }),
                    ...(isDarkTheme && { color: '#D1D5DB' }),
                  },
                  chipContainer: {
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.25rem',
                    marginTop: '0.25rem',
                  },
                }
              })(styles),
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme)
            ;(0, react.useEffect)(() => {
              setLocalComments(prev =>
                prev.map(c => {
                  if (!c.editHistory || 0 === c.editHistory.length) {
                    const originalTime = c.createdAt || new Date(),
                      originalRev = {
                        _id: `rev-orig-${c._id}`,
                        editedBy: c.createdBy,
                        editedAt: originalTime,
                        text: c.text,
                        isOriginal: !0,
                      }
                    return { ...c, editHistory: [originalRev] }
                  }
                  return c
                })
              )
            }, [])
            const cancelEditingComment = () => {
                ;(setEditingCommentId(null), setEditingCommentText(''))
              },
              [commentMenu, setCommentMenu] = (0, react.useState)({
                anchor: null,
                commentId: null,
              }),
              closeCommentMenu = () => {
                setCommentMenu({ anchor: null, commentId: null })
              },
              handleEditClick = (commentId, text) => {
                ;(closeCommentMenu(),
                  ((commentId, currentText) => {
                    ;(setEditingCommentId(commentId),
                      setEditingCommentText(currentText))
                  })(commentId, text))
              }
            return (0, jsx_runtime.jsx)(Dialog.A, {
              open,
              onClose,
              styles: { theme: isSacredTheme ? 'sacred' : 'light' },
              children: (0, jsx_runtime.jsxs)('div', {
                style: computedStyles.dialog,
                children: [
                  isSacredTheme &&
                    (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                      children: [
                        (0, jsx_runtime.jsx)('div', {
                          style: {
                            ...computedStyles.glyph,
                            top: '0.75rem',
                            left: '0.75rem',
                          },
                          children: client_SACRED_GLYPHS[0],
                        }),
                        (0, jsx_runtime.jsx)('div', {
                          style: {
                            ...computedStyles.glyph,
                            top: '0.75rem',
                            right: '3rem',
                            animationDirection: 'reverse',
                          },
                          children: client_SACRED_GLYPHS[1],
                        }),
                      ],
                    }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: computedStyles.header,
                    children: [
                      (0, jsx_runtime.jsxs)('div', {
                        children: [
                          isEditing
                            ? (0, jsx_runtime.jsx)(Text.A, {
                                label: 'Task Title',
                                value: formData.taskTitle,
                                onChange: value =>
                                  setFormData(prev => ({
                                    ...prev,
                                    taskTitle: value,
                                  })),
                                className: 'mb-1',
                                styles: {
                                  theme: isSacredTheme ? 'sacred' : 'light',
                                },
                              })
                            : (0, jsx_runtime.jsx)(Typography.A, {
                                variant: 'merrih4',
                                styles: {
                                  theme: isSacredTheme ? 'sacred' : 'light',
                                },
                                children: formData.taskTitle,
                              }),
                          (0, jsx_runtime.jsx)(Typography.A, {
                            variant: 'merrih5',
                            text: `created by ${createdBy}`,
                            styles: {
                              theme: isSacredTheme ? 'sacred' : 'light',
                            },
                          }),
                        ],
                      }),
                      (0, jsx_runtime.jsxs)('div', {
                        style: computedStyles.headerActions,
                        children: [
                          (0, jsx_runtime.jsx)(Button.A, {
                            text: isEditing ? 'Save' : 'Edit',
                            onClick: () => {
                              isEditing
                                ? (onEdit({
                                    taskTitle: formData.taskTitle,
                                    description: formData.description,
                                    customerAssigned: formData.customerAssigned,
                                    severity: formData.severity,
                                    schedulingQueue: formData.schedulingQueue,
                                    status: formData.status,
                                    subStatus: formData.subStatus,
                                    topics: formData.topics,
                                    knowledgebaseArticles:
                                      formData.knowledgebaseArticles,
                                    teamMemberAssigned:
                                      formData.teamMemberAssigned,
                                    nextActionDate: formData.nextActionDate,
                                  }),
                                  setIsEditing(!1))
                                : setIsEditing(!0)
                            },
                            styles: {
                              theme: isSacredTheme ? 'sacred' : 'light',
                            },
                          }),
                          (0, jsx_runtime.jsx)(Button.A, {
                            text: 'Delete',
                            onClick: onDelete,
                            styles: {
                              theme: isSacredTheme ? 'sacred' : 'light',
                            },
                          }),
                          (0, jsx_runtime.jsx)(Button.A, {
                            text: 'Duplicate',
                            onClick: onDuplicate,
                            styles: {
                              theme: isSacredTheme ? 'sacred' : 'light',
                            },
                          }),
                          (0, jsx_runtime.jsx)(Button.A, {
                            icon: (0, jsx_runtime.jsx)(Close.A, {}),
                            onClick: onClose,
                            styles: {
                              theme: isSacredTheme ? 'sacred' : 'light',
                              outline: !0,
                            },
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: computedStyles.grid,
                    children: [
                      (0, jsx_runtime.jsxs)('div', {
                        style: computedStyles.mainContent,
                        children: [
                          (0, jsx_runtime.jsx)('div', {
                            style: computedStyles.descriptionContainer,
                            children: isEditing
                              ? (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                  children: [
                                    (0, jsx_runtime.jsx)(Typography.A, {
                                      variant: 'merrih5',
                                      text: 'Task Description',
                                      styles: {
                                        theme: isSacredTheme
                                          ? 'sacred'
                                          : 'light',
                                      },
                                    }),
                                    (0, jsx_runtime.jsx)(ComplexTextEditor.A, {
                                      value: formData.description,
                                      onChange: val =>
                                        setFormData(prev => ({
                                          ...prev,
                                          description: val,
                                        })),
                                      label: 'Task Description',
                                      editorType: 'simple',
                                      minRows: 3,
                                      styles: {
                                        theme: isSacredTheme
                                          ? 'sacred'
                                          : 'light',
                                      },
                                    }),
                                  ],
                                })
                              : (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                                  children: [
                                    (0, jsx_runtime.jsx)(Typography.A, {
                                      variant: 'merrih5',
                                      text: 'Task Description',
                                      styles: {
                                        theme: isSacredTheme
                                          ? 'sacred'
                                          : 'light',
                                      },
                                    }),
                                    (0, jsx_runtime.jsx)(Typography.A, {
                                      variant: 'merrih6',
                                      text: formData.description,
                                      styles: {
                                        theme: isSacredTheme
                                          ? 'sacred'
                                          : 'light',
                                      },
                                    }),
                                  ],
                                }),
                          }),
                          localComments.map(comment => {
                            const selectedRevId =
                              selectedRevisions[comment._id] || null
                            let displayedText = comment.text,
                              displayedTime = comment.createdAt,
                              displayedAuthor = comment.createdBy
                            if (selectedRevId && comment.editHistory) {
                              const foundRev = comment.editHistory.find(
                                r => r._id === selectedRevId
                              )
                              var _foundRev_editedAt, _foundRev_editedBy
                              if (foundRev)
                                ((displayedText = foundRev.text),
                                  (displayedTime =
                                    null !==
                                      (_foundRev_editedAt =
                                        foundRev.editedAt) &&
                                    void 0 !== _foundRev_editedAt
                                      ? _foundRev_editedAt
                                      : comment.createdAt),
                                  (displayedAuthor =
                                    null !==
                                      (_foundRev_editedBy =
                                        foundRev.editedBy) &&
                                    void 0 !== _foundRev_editedBy
                                      ? _foundRev_editedBy
                                      : comment.createdBy))
                            }
                            const createdTime = formatRelativeTime(
                                comment.createdAt
                              ),
                              updatedTime = formatRelativeTime(displayedTime),
                              hasHistory =
                                comment.editHistory &&
                                comment.editHistory.length > 0,
                              canEdit =
                                currentUserName &&
                                comment.createdBy === currentUserName,
                              isMenuOpen =
                                commentMenu.anchor &&
                                commentMenu.commentId === comment._id
                            return (0, jsx_runtime.jsx)(
                              'div',
                              {
                                style: computedStyles.comment,
                                children:
                                  editingCommentId === comment._id
                                    ? (0, jsx_runtime.jsxs)('div', {
                                        style: computedStyles.commentEditing,
                                        children: [
                                          (0, jsx_runtime.jsx)(
                                            ComplexTextEditor.A,
                                            {
                                              value: editingCommentText,
                                              onChange: val =>
                                                setEditingCommentText(val),
                                              label: 'Edit Comment',
                                              minRows: 3,
                                              editorType: 'simple',
                                              styles: {
                                                theme: isSacredTheme
                                                  ? 'sacred'
                                                  : 'light',
                                              },
                                            }
                                          ),
                                          (0, jsx_runtime.jsxs)('div', {
                                            className:
                                              'flex justify-end mt-1 gap-1',
                                            children: [
                                              (0, jsx_runtime.jsx)(Button.A, {
                                                text: 'Save',
                                                onClick: () =>
                                                  (commentId => {
                                                    const now = new Date()
                                                    ;(onEditComment(
                                                      commentId,
                                                      editingCommentText,
                                                      taskId
                                                    ),
                                                      setLocalComments(prev =>
                                                        prev.map(c => {
                                                          if (
                                                            c._id !== commentId
                                                          )
                                                            return c
                                                          const newRevision = {
                                                            _id: `rev-${Date.now()}`,
                                                            editedBy:
                                                              currentUserName ||
                                                              'UnknownUser',
                                                            editedAt: now,
                                                            text: editingCommentText,
                                                            isOriginal: !1,
                                                          }
                                                          return {
                                                            ...c,
                                                            text: editingCommentText,
                                                            editHistory: [
                                                              ...(c.editHistory ||
                                                                []),
                                                              newRevision,
                                                            ],
                                                          }
                                                        })
                                                      ),
                                                      setEditingCommentId(null),
                                                      setEditingCommentText(''),
                                                      setSelectedRevisions(
                                                        prev => ({
                                                          ...prev,
                                                          [commentId]: null,
                                                        })
                                                      ))
                                                  })(comment._id),
                                                styles: {
                                                  theme: isSacredTheme
                                                    ? 'sacred'
                                                    : 'light',
                                                },
                                              }),
                                              (0, jsx_runtime.jsx)(Button.A, {
                                                text: 'Cancel',
                                                onClick: cancelEditingComment,
                                                styles: {
                                                  theme: isSacredTheme
                                                    ? 'sacred'
                                                    : 'light',
                                                  outline: !0,
                                                },
                                              }),
                                            ],
                                          }),
                                        ],
                                      })
                                    : (0, jsx_runtime.jsxs)('div', {
                                        style: computedStyles.commentContent,
                                        children: [
                                          (0, jsx_runtime.jsxs)('div', {
                                            className:
                                              'flex justify-between items-start',
                                            children: [
                                              (0, jsx_runtime.jsx)(
                                                Typography.A,
                                                {
                                                  variant: 'merrih5',
                                                  text: comment.createdBy,
                                                  styles: {
                                                    theme: isSacredTheme
                                                      ? 'sacred'
                                                      : 'light',
                                                  },
                                                }
                                              ),
                                              (0, jsx_runtime.jsx)(Button.A, {
                                                icon: (0, jsx_runtime.jsx)(
                                                  MoreVert.A,
                                                  {}
                                                ),
                                                onClick: e => {
                                                  return (
                                                    (event = e),
                                                    (commentId = comment._id),
                                                    void setCommentMenu({
                                                      anchor:
                                                        event.currentTarget,
                                                      commentId,
                                                    })
                                                  )
                                                  var event, commentId
                                                },
                                                styles: {
                                                  theme: isSacredTheme
                                                    ? 'sacred'
                                                    : 'light',
                                                  outline: !0,
                                                },
                                              }),
                                              (0, jsx_runtime.jsxs)(Popover.A, {
                                                open: Boolean(isMenuOpen),
                                                onClose: closeCommentMenu,
                                                anchorEl: commentMenu.anchor,
                                                styles: {
                                                  theme: isSacredTheme
                                                    ? 'sacred'
                                                    : 'light',
                                                },
                                                children: [
                                                  canEdit &&
                                                    (0, jsx_runtime.jsx)(
                                                      'div',
                                                      {
                                                        onClick: () =>
                                                          handleEditClick(
                                                            comment._id,
                                                            comment.text
                                                          ),
                                                        style: {
                                                          ...computedStyles.headerActions,
                                                          background: 'none',
                                                          border: 'none',
                                                          cursor: 'pointer',
                                                          padding:
                                                            '0.5rem 1rem',
                                                          color: isSacredTheme
                                                            ? 'rgba(255, 215, 0, 0.7)'
                                                            : '#666',
                                                        },
                                                        children: 'Edit',
                                                      }
                                                    ),
                                                  hasHistory &&
                                                    (0, jsx_runtime.jsx)(
                                                      'div',
                                                      {
                                                        style: {
                                                          width: '14rem',
                                                        },
                                                        children: (0,
                                                        jsx_runtime.jsx)(
                                                          Searchable.A,
                                                          {
                                                            label:
                                                              'Revision History',
                                                            placeholder:
                                                              'Select revision...',
                                                            options:
                                                              comment.editHistory.map(
                                                                rev => {
                                                                  var _rev_editedAt
                                                                  const revTime =
                                                                    formatRelativeTime(
                                                                      null !==
                                                                        (_rev_editedAt =
                                                                          rev.editedAt) &&
                                                                        void 0 !==
                                                                          _rev_editedAt
                                                                        ? _rev_editedAt
                                                                        : comment.createdAt
                                                                    )
                                                                  var _rev_editedBy
                                                                  return {
                                                                    value: `${rev.isOriginal ? 'Original' : 'Edited'} ${revTime} by ${null !== (_rev_editedBy = rev.editedBy) && void 0 !== _rev_editedBy ? _rev_editedBy : comment.createdBy}`,
                                                                    attribute1:
                                                                      rev._id,
                                                                  }
                                                                }
                                                              ) || [],
                                                            onChange: opt =>
                                                              ((
                                                                commentId,
                                                                revisionId
                                                              ) => {
                                                                setSelectedRevisions(
                                                                  prev => ({
                                                                    ...prev,
                                                                    [commentId]:
                                                                      revisionId ||
                                                                      null,
                                                                  })
                                                                )
                                                                const comment =
                                                                  localComments.find(
                                                                    c =>
                                                                      c._id ===
                                                                      commentId
                                                                  )
                                                                comment &&
                                                                  comment.editHistory &&
                                                                  onRevisionHistory(
                                                                    commentId,
                                                                    comment.editHistory
                                                                  )
                                                              })(
                                                                comment._id,
                                                                (null == opt
                                                                  ? void 0
                                                                  : opt.attribute1) ||
                                                                  null
                                                              ),
                                                            defaultValue:
                                                              selectedRevId ||
                                                              void 0,
                                                            styles: {
                                                              theme:
                                                                isSacredTheme
                                                                  ? 'sacred'
                                                                  : 'light',
                                                            },
                                                          }
                                                        ),
                                                      }
                                                    ),
                                                ],
                                              }),
                                            ],
                                          }),
                                          (0, jsx_runtime.jsxs)('div', {
                                            className: 'mt-auto',
                                            children: [
                                              (0, jsx_runtime.jsx)(
                                                Typography.A,
                                                {
                                                  variant: 'merriparagraph',
                                                  text: displayedText,
                                                  styles: {
                                                    theme: isSacredTheme
                                                      ? 'sacred'
                                                      : 'light',
                                                  },
                                                }
                                              ),
                                              (0, jsx_runtime.jsxs)('div', {
                                                style:
                                                  computedStyles.descriptionText,
                                                children: [
                                                  comment.createdAt &&
                                                    (0, jsx_runtime.jsxs)(
                                                      'span',
                                                      {
                                                        children: [
                                                          'Created ',
                                                          createdTime,
                                                          ' by ',
                                                          comment.createdBy,
                                                        ],
                                                      }
                                                    ),
                                                  displayedTime &&
                                                    displayedAuthor &&
                                                    (0, jsx_runtime.jsxs)(
                                                      'span',
                                                      {
                                                        children: [
                                                          ' ',
                                                          '| Edited ',
                                                          updatedTime,
                                                          ' by ',
                                                          displayedAuthor,
                                                        ],
                                                      }
                                                    ),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                              },
                              comment._id
                            )
                          }),
                          (0, jsx_runtime.jsxs)('div', {
                            style: {
                              margin: '0 -8px 0 0',
                              padding: '0.5rem 8px 0.5rem',
                            },
                            children: [
                              (0, jsx_runtime.jsx)(ComplexTextEditor.A, {
                                value: newComment,
                                onChange: val => setNewComment(val),
                                label: 'Add Comment',
                                minRows: 3,
                                editorType: 'simple',
                                styles: {
                                  theme: isSacredTheme ? 'sacred' : 'light',
                                },
                              }),
                              (0, jsx_runtime.jsxs)('div', {
                                className: 'flex justify-end mt-2 gap-2',
                                children: [
                                  (0, jsx_runtime.jsx)(Button.A, {
                                    text: 'Close Task',
                                    onClick: () => onCloseTask(taskId),
                                    styles: {
                                      theme: isSacredTheme ? 'sacred' : 'light',
                                    },
                                  }),
                                  (0, jsx_runtime.jsx)(Button.A, {
                                    text: 'Comment',
                                    onClick: () => {
                                      const trimmed = newComment.trim()
                                      if (!trimmed) return
                                      const now = new Date(),
                                        newLocalComment = {
                                          _id: `temp-${Date.now()}`,
                                          createdBy:
                                            currentUserName || 'UnknownUser',
                                          text: trimmed,
                                          createdAt: now,
                                          editHistory: [
                                            {
                                              _id: `rev-orig-temp-${Date.now()}`,
                                              editedBy:
                                                currentUserName ||
                                                'UnknownUser',
                                              editedAt: now,
                                              text: trimmed,
                                              isOriginal: !0,
                                            },
                                          ],
                                        }
                                      ;(setLocalComments([
                                        ...localComments,
                                        newLocalComment,
                                      ]),
                                        onComment(trimmed, taskId),
                                        setNewComment(''))
                                    },
                                    styles: {
                                      theme: isSacredTheme ? 'sacred' : 'light',
                                    },
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, jsx_runtime.jsxs)('div', {
                        style: computedStyles.sidebar,
                        children: [
                          [
                            {
                              label: 'Customer Assigned',
                              value: formData.customerAssigned,
                              options: customerOptions.map(cust => ({
                                value:
                                  cust.firstName || cust.lastName
                                    ? `${cust.firstName || ''} ${cust.lastName || ''}`.trim()
                                    : cust._id,
                                attribute1: cust._id,
                              })),
                              field: 'customerAssigned',
                            },
                            {
                              label: 'Severity',
                              value: formData.severity,
                              options: severityOptions.map(s => ({
                                value: String(s.severityLevel),
                                attribute1: s._id,
                              })),
                              field: 'severity',
                            },
                            {
                              label: 'Scheduling Queue',
                              value: formData.schedulingQueue,
                              options: schedulingQueueOptions.map(q => ({
                                value: q.queueName,
                                attribute1: q._id,
                              })),
                              field: 'schedulingQueue',
                            },
                            {
                              label: 'Status',
                              value: formData.status,
                              options: statusOptions.map(s => ({
                                value: s.status,
                                attribute1: s._id,
                              })),
                              field: 'status',
                            },
                            {
                              label: 'Sub Status',
                              value: formData.subStatus,
                              options: subStatusOptions.map(s => ({
                                value: s.subStatus,
                                attribute1: s._id,
                              })),
                              field: 'subStatus',
                            },
                            {
                              label: 'Team Member Assigned',
                              value: formData.teamMemberAssigned,
                              options: teamMemberOptions.map(tm => ({
                                value:
                                  tm.firstName && tm.lastName
                                    ? `${tm.firstName} ${tm.lastName}`
                                    : tm._id,
                                attribute1: tm._id,
                              })),
                              field: 'teamMemberAssigned',
                            },
                          ].map(({ label, value, options, field }) =>
                            (0, jsx_runtime.jsxs)(
                              'div',
                              {
                                style: computedStyles.sidebarSection,
                                children: [
                                  !isEditing &&
                                    (0, jsx_runtime.jsx)(Typography.A, {
                                      variant: 'merriparagraph',
                                      text: label,
                                      styles: {
                                        theme: isSacredTheme
                                          ? 'sacred'
                                          : 'light',
                                      },
                                    }),
                                  isEditing
                                    ? (0, jsx_runtime.jsx)(Searchable.A, {
                                        label,
                                        options,
                                        defaultValue: value,
                                        onChange: newVal =>
                                          setFormData(prev => ({
                                            ...prev,
                                            [field]:
                                              (null == newVal
                                                ? void 0
                                                : newVal.attribute1) || '',
                                          })),
                                        styles: {
                                          theme: isSacredTheme
                                            ? 'sacred'
                                            : 'light',
                                        },
                                      })
                                    : value
                                      ? (0, jsx_runtime.jsx)(Chip.A, {
                                          label: value,
                                          styles: {
                                            theme: isSacredTheme
                                              ? 'sacred'
                                              : 'light',
                                          },
                                        })
                                      : null,
                                ],
                              },
                              label
                            )
                          ),
                          (0, jsx_runtime.jsxs)('div', {
                            style: computedStyles.sidebarSection,
                            children: [
                              !isEditing &&
                                (0, jsx_runtime.jsx)(Typography.A, {
                                  variant: 'merriparagraph',
                                  text: 'Topics',
                                  styles: {
                                    theme: isSacredTheme ? 'sacred' : 'light',
                                  },
                                }),
                              isEditing
                                ? (0, jsx_runtime.jsx)(MultiSelect.A, {
                                    label: 'Topics',
                                    options: topicOptions.map(t => t.topic),
                                    defaultSelected: formData.topics,
                                    onChange: values =>
                                      setFormData(prev => ({
                                        ...prev,
                                        topics: values,
                                      })),
                                    styles: {
                                      theme: isSacredTheme ? 'sacred' : 'light',
                                    },
                                  })
                                : formData.topics.length > 0
                                  ? (0, jsx_runtime.jsx)('div', {
                                      style: computedStyles.chipContainer,
                                      children: formData.topics.map(
                                        (topic, idx) =>
                                          (0, jsx_runtime.jsx)(
                                            Chip.A,
                                            {
                                              label: topic,
                                              styles: {
                                                theme: isSacredTheme
                                                  ? 'sacred'
                                                  : 'light',
                                              },
                                            },
                                            idx
                                          )
                                      ),
                                    })
                                  : null,
                            ],
                          }),
                          (0, jsx_runtime.jsxs)('div', {
                            style: computedStyles.sidebarSection,
                            children: [
                              !isEditing &&
                                (0, jsx_runtime.jsx)(Typography.A, {
                                  variant: 'merriparagraph',
                                  text: 'Knowledgebase Articles',
                                  styles: {
                                    theme: isSacredTheme ? 'sacred' : 'light',
                                  },
                                }),
                              isEditing
                                ? (0, jsx_runtime.jsx)(MultiSelect.A, {
                                    label: 'Knowledgebase Articles',
                                    options: knowledgebaseArticleOptions.map(
                                      a => a.articleTitle
                                    ),
                                    defaultSelected:
                                      formData.knowledgebaseArticles,
                                    onChange: values =>
                                      setFormData(prev => ({
                                        ...prev,
                                        knowledgebaseArticles: values,
                                      })),
                                    styles: {
                                      theme: isSacredTheme ? 'sacred' : 'light',
                                    },
                                  })
                                : formData.knowledgebaseArticles.length > 0
                                  ? (0, jsx_runtime.jsx)('div', {
                                      style: computedStyles.chipContainer,
                                      children:
                                        formData.knowledgebaseArticles.map(
                                          (article, idx) =>
                                            (0, jsx_runtime.jsx)(
                                              Chip.A,
                                              {
                                                label: article,
                                                styles: {
                                                  theme: isSacredTheme
                                                    ? 'sacred'
                                                    : 'light',
                                                },
                                              },
                                              idx
                                            )
                                        ),
                                    })
                                  : null,
                            ],
                          }),
                          (0, jsx_runtime.jsxs)('div', {
                            style: computedStyles.sidebarSection,
                            children: [
                              !isEditing &&
                                (0, jsx_runtime.jsx)(Typography.A, {
                                  variant: 'merriparagraph',
                                  text: 'Next Action Date',
                                  styles: {
                                    theme: isSacredTheme ? 'sacred' : 'light',
                                  },
                                }),
                              isEditing
                                ? (0, jsx_runtime.jsx)('div', {
                                    className: 'mt-1 w-full',
                                    children: (0, jsx_runtime.jsx)(
                                      DateField.A,
                                      {
                                        label: 'Next Action Date',
                                        value: safeParseDate(
                                          formData.nextActionDate
                                        ),
                                        onChange: date => {
                                          if (!date || !('start' in date))
                                            if (date instanceof Date) {
                                              const mm = String(
                                                  date.getMonth() + 1
                                                ).padStart(2, '0'),
                                                dd = String(
                                                  date.getDate()
                                                ).padStart(2, '0'),
                                                yyyy = date.getFullYear()
                                              setFormData(prev => ({
                                                ...prev,
                                                nextActionDate: `${mm}/${dd}/${yyyy}`,
                                              }))
                                            } else
                                              setFormData(prev => ({
                                                ...prev,
                                                nextActionDate: '',
                                              }))
                                        },
                                        styles: {
                                          theme: isSacredTheme
                                            ? 'sacred'
                                            : 'light',
                                        },
                                      }
                                    ),
                                  })
                                : formData.nextActionDate
                                  ? (0, jsx_runtime.jsx)(Typography.A, {
                                      variant: 'merriparagraph',
                                      text: formData.nextActionDate,
                                      styles: {
                                        theme: isSacredTheme
                                          ? 'sacred'
                                          : 'light',
                                      },
                                    })
                                  : null,
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            })
          },
          client = ShowTask
        ShowTask.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ShowTask',
          props: {
            open: {
              required: !0,
              tsType: { name: 'boolean' },
              description: '',
            },
            onClose: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            taskId: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            taskTitle: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            createdBy: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            description: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            comments: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  text: string\n  createdAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'text',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'createdAt',
                          value: { name: 'Date', required: !0 },
                        },
                        {
                          key: 'createdBy',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'editHistory',
                          value: {
                            name: 'Array',
                            elements: [
                              {
                                name: 'signature',
                                type: 'object',
                                raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                signature: {
                                  properties: [
                                    {
                                      key: '_id',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'editedBy',
                                      value: { name: 'string', required: !1 },
                                    },
                                    {
                                      key: 'editedAt',
                                      value: { name: 'Date', required: !1 },
                                    },
                                    {
                                      key: 'text',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'isOriginal',
                                      value: { name: 'boolean', required: !0 },
                                    },
                                  ],
                                },
                              },
                            ],
                            raw: 'CommentEditHistory[]',
                            required: !0,
                          },
                        },
                      ],
                    },
                  },
                ],
                raw: 'Comment[]',
              },
              description: '',
            },
            customerAssigned: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            severity: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            schedulingQueue: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            status: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            subStatus: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            topics: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'string' }],
                raw: 'string[]',
              },
              description: '',
            },
            knowledgebaseArticles: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'string' }],
                raw: 'string[]',
              },
              description: '',
            },
            teamMemberAssigned: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            nextActionDate: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            customerOptions: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  firstName?: string\n  lastName?: string\n  email?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'firstName',
                          value: { name: 'string', required: !1 },
                        },
                        {
                          key: 'lastName',
                          value: { name: 'string', required: !1 },
                        },
                        {
                          key: 'email',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawCustomer[]',
              },
              description: '',
            },
            severityOptions: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  severityLevel: number\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'severityLevel',
                          value: { name: 'number', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawSeverityLevel[]',
              },
              description: '',
            },
            schedulingQueueOptions: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  queueName: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'queueName',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawQueue[]',
              },
              description: '',
            },
            statusOptions: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  status: string\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'status',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawStatus[]',
              },
              description: '',
            },
            subStatusOptions: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  subStatus: string\n  description?: string\n  statusId: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'subStatus',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                        {
                          key: 'statusId',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawSubStatus[]',
              },
              description: '',
            },
            topicOptions: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  topic: string\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'topic',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawTopic[]',
              },
              description: '',
            },
            knowledgebaseArticleOptions: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  articleTitle: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'articleTitle',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawArticle[]',
              },
              description: '',
            },
            teamMemberOptions: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  firstName?: string\n  lastName?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'firstName',
                          value: { name: 'string', required: !1 },
                        },
                        {
                          key: 'lastName',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawEmployee[]',
              },
              description: '',
            },
            currentUserName: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            onCloseTask: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(taskId: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'taskId' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onComment: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(commentText: string, _id: string) => void',
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'commentText' },
                    { type: { name: 'string' }, name: '_id' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onEdit: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(updatedData: {\n  taskTitle: string\n  description: string\n  customerAssigned: string\n  severity: string\n  schedulingQueue: string\n  status: string\n  subStatus: string\n  topics: string[]\n  knowledgebaseArticles: string[]\n  teamMemberAssigned: string\n  nextActionDate: string\n}) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'signature',
                        type: 'object',
                        raw: '{\n  taskTitle: string\n  description: string\n  customerAssigned: string\n  severity: string\n  schedulingQueue: string\n  status: string\n  subStatus: string\n  topics: string[]\n  knowledgebaseArticles: string[]\n  teamMemberAssigned: string\n  nextActionDate: string\n}',
                        signature: {
                          properties: [
                            {
                              key: 'taskTitle',
                              value: { name: 'string', required: !0 },
                            },
                            {
                              key: 'description',
                              value: { name: 'string', required: !0 },
                            },
                            {
                              key: 'customerAssigned',
                              value: { name: 'string', required: !0 },
                            },
                            {
                              key: 'severity',
                              value: { name: 'string', required: !0 },
                            },
                            {
                              key: 'schedulingQueue',
                              value: { name: 'string', required: !0 },
                            },
                            {
                              key: 'status',
                              value: { name: 'string', required: !0 },
                            },
                            {
                              key: 'subStatus',
                              value: { name: 'string', required: !0 },
                            },
                            {
                              key: 'topics',
                              value: {
                                name: 'Array',
                                elements: [{ name: 'string' }],
                                raw: 'string[]',
                                required: !0,
                              },
                            },
                            {
                              key: 'knowledgebaseArticles',
                              value: {
                                name: 'Array',
                                elements: [{ name: 'string' }],
                                raw: 'string[]',
                                required: !0,
                              },
                            },
                            {
                              key: 'teamMemberAssigned',
                              value: { name: 'string', required: !0 },
                            },
                            {
                              key: 'nextActionDate',
                              value: { name: 'string', required: !0 },
                            },
                          ],
                        },
                      },
                      name: 'updatedData',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onDelete: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onDuplicate: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onEditComment: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(commentId: string, newText: string, taskId: string) => void',
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'commentId' },
                    { type: { name: 'string' }, name: 'newText' },
                    { type: { name: 'string' }, name: 'taskId' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onRevisionHistory: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(\n  commentId: string,\n  revisionHistory: CommentEditHistory[]\n) => void',
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'commentId' },
                    {
                      type: {
                        name: 'Array',
                        elements: [
                          {
                            name: 'signature',
                            type: 'object',
                            raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                            signature: {
                              properties: [
                                {
                                  key: '_id',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'editedBy',
                                  value: { name: 'string', required: !1 },
                                },
                                {
                                  key: 'editedAt',
                                  value: { name: 'Date', required: !1 },
                                },
                                {
                                  key: 'text',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'isOriginal',
                                  value: { name: 'boolean', required: !0 },
                                },
                              ],
                            },
                          },
                        ],
                        raw: 'CommentEditHistory[]',
                      },
                      name: 'revisionHistory',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'ProjectBoardStyles' },
              description: '',
            },
          },
        }
        var Card = __webpack_require__('./src/components/Card/index.tsx'),
          Regular = __webpack_require__(
            './src/components/Field/Dropdown/Regular/index.tsx'
          ),
          Checkbox = __webpack_require__('./src/components/Checkbox/index.tsx')
        function useTaskDragAndDrop() {
          const [dragItem, setDragItem] = react.useState(null)
          return {
            dragItem,
            setDragItem,
            handleTaskDragStart: function handleTaskDragStart(item) {
              setDragItem(item)
            },
            handleTaskDragOver: function handleTaskDragOver(e) {
              e.preventDefault()
            },
            handleTaskDrop: function handleTaskDrop(
              e,
              { dropColumnIndex, dropTaskIndex, allColumns, setAllColumns }
            ) {
              if ((e.preventDefault(), !dragItem)) return
              const { columnIndex: sourceColIdx, taskIndex: sourceTaskIdx } =
                dragItem
              if (sourceColIdx < 0 || sourceColIdx >= allColumns.length) return
              const sourceColumn = allColumns[sourceColIdx]
              if (
                sourceTaskIdx < 0 ||
                sourceTaskIdx >= sourceColumn.tasks.length
              )
                return
              const [movedTask] = sourceColumn.tasks.splice(sourceTaskIdx, 1)
              if (dropColumnIndex < 0 || dropColumnIndex >= allColumns.length)
                return (
                  sourceColumn.tasks.splice(sourceTaskIdx, 0, movedTask),
                  void setDragItem(null)
                )
              const destColumn = allColumns[dropColumnIndex]
              ;(dropTaskIndex < 0 && (dropTaskIndex = 0),
                dropTaskIndex > destColumn.tasks.length &&
                  (dropTaskIndex = destColumn.tasks.length),
                destColumn.tasks.splice(dropTaskIndex, 0, movedTask))
              const newCols = [...allColumns]
              ;((newCols[sourceColIdx] = { ...sourceColumn }),
                (newCols[dropColumnIndex] = { ...destColumn }),
                setAllColumns(newCols),
                setDragItem(null))
            },
          }
        }
        const desktop_SACRED_GLYPHS = ['𓏭', '𓊵', '𓂋', '𓊹']
        function DesktopBoard({
          columns,
          overflowColumns,
          selectedOverflowColumnId,
          onChangeSelectedOverflowColumn,
          selectedTask,
          onSelectTask,
          onColumnDragStart,
          onColumnDragOver,
          onColumnDrop,
          sacredtheme = !1,
        }) {
          var _activeOverflowColumn_tasks
          const [allColumns, setAllColumns] = (0, esm_react.fp)(columnsAtom),
            [selectedColumnIndex, setSelectedColumnIndex] = (0, react.useState)(
              null
            ),
            { handleTaskDragStart, handleTaskDragOver, handleTaskDrop } =
              useTaskDragAndDrop(),
            styles = (sacredtheme => ({
              boardContainer: {
                display: 'flex',
                flexDirection: 'row',
                gap: '0.75rem',
              },
              column: {
                boxSizing: 'border-box',
                width: '300px',
                height: '70vh',
                borderRadius: '0.375rem',
                display: 'flex',
                flexDirection: 'column',
                overflowX: 'hidden',
                overflowY: 'auto',
                position: 'relative',
                ...(sacredtheme
                  ? {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      border: '2px solid rgba(255, 215, 0, 0.5)',
                      animation: 'board-glow-pulse 2s infinite alternate',
                      backdropFilter: 'blur(16px)',
                    }
                  : { backgroundColor: 'black' }),
              },
              columnHeader: {
                padding: '0.5rem',
                position: 'relative',
                ...(sacredtheme
                  ? {
                      borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    }
                  : { borderBottom: '1px solid white' }),
              },
              columnTitleContainer: {
                display: 'flex',
                flexDirection: 'column',
                gap: '0.125rem',
              },
              columnTitle: {
                ...(sacredtheme && {
                  fontFamily: 'Cinzel, serif',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
                }),
              },
              columnDescription: {
                ...(sacredtheme && { fontFamily: 'Crimson Text, serif' }),
              },
              tasksContainer: { padding: '0.5rem', flex: 1 },
              noTasks: {
                ...(sacredtheme && {
                  fontStyle: 'italic',
                  fontFamily: 'Crimson Text, serif',
                }),
              },
              tasksList: {
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              },
              checkbox: {
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
              },
              glyph: {
                position: 'absolute',
                top: '0.5rem',
                left: '0.5rem',
                fontSize: '0.875rem',
                color: 'rgba(255, 215, 0, 0.3)',
                animation: 'board-float-glyph 3s infinite alternate',
                zIndex: 10,
              },
            }))(sacredtheme)
          function isTaskCheckboxDisabled() {
            return null !== selectedColumnIndex
          }
          function isColumnDraggable(colIndex) {
            return selectedColumnIndex === colIndex
          }
          function isTaskDraggable(colIndex, taskIndex) {
            return (
              null === selectedColumnIndex &&
              (null == selectedTask ? void 0 : selectedTask.colIndex) ===
                colIndex &&
              (null == selectedTask ? void 0 : selectedTask.taskIndex) ===
                taskIndex
            )
          }
          function handleLocalTaskDragStart(e, columnIndex, taskIndex) {
            isTaskDraggable(columnIndex, taskIndex)
              ? handleTaskDragStart({ columnIndex, taskIndex })
              : e.preventDefault()
          }
          function handleLocalTaskDrop(e, dropColumnIndex, dropTaskIndex) {
            ;(e.preventDefault(),
              handleTaskDrop(e, {
                dropColumnIndex,
                dropTaskIndex,
                allColumns,
                setAllColumns,
              }))
          }
          const hasOverflow = Boolean(
            null == overflowColumns ? void 0 : overflowColumns.length
          )
          let activeOverflowColumn
          hasOverflow &&
            selectedOverflowColumnId &&
            overflowColumns &&
            (activeOverflowColumn =
              overflowColumns.find(c => c._id === selectedOverflowColumnId) ||
              overflowColumns[0])
          const handleOverflowDropdownChange = (0, react.useCallback)(
            e => {
              if (!overflowColumns || !onChangeSelectedOverflowColumn) return
              const colTitle = e.target.value,
                found = overflowColumns.find(c => c.title === colTitle)
              found && onChangeSelectedOverflowColumn(found._id)
            },
            [overflowColumns, onChangeSelectedOverflowColumn]
          )
          var _overflowColumns_map
          return (0, jsx_runtime.jsxs)('div', {
            style: styles.boardContainer,
            children: [
              columns.map((col, colIndex) => {
                var _col_tasks
                const colChecked = selectedColumnIndex === colIndex
                return (0, jsx_runtime.jsxs)(
                  'div',
                  {
                    draggable: isColumnDraggable(colIndex),
                    onDragStart: e =>
                      (function handleLocalColumnDragStart(e, colIndex) {
                        isColumnDraggable(colIndex)
                          ? onColumnDragStart(e, colIndex)
                          : e.preventDefault()
                      })(e, colIndex),
                    onDragOver: e =>
                      (function handleLocalColumnDragOver(e, colIndex) {
                        ;(e.preventDefault(), onColumnDragOver(e, colIndex))
                      })(e, colIndex),
                    onDrop: e =>
                      (function handleLocalColumnDrop(e, colIndex) {
                        ;(e.preventDefault(), onColumnDrop(e, colIndex))
                      })(e, colIndex),
                    style: styles.column,
                    children: [
                      sacredtheme &&
                        (0, jsx_runtime.jsx)('div', {
                          style: styles.glyph,
                          children:
                            desktop_SACRED_GLYPHS[
                              colIndex % desktop_SACRED_GLYPHS.length
                            ],
                        }),
                      (0, jsx_runtime.jsxs)('div', {
                        style: styles.columnHeader,
                        children: [
                          (0, jsx_runtime.jsx)(Checkbox.A, {
                            checked: colChecked,
                            disabled: null !== selectedTask,
                            onChange: () =>
                              (function handleColumnCheck(colIndex) {
                                selectedColumnIndex === colIndex
                                  ? setSelectedColumnIndex(null)
                                  : (onSelectTask(-1, -1),
                                    setSelectedColumnIndex(colIndex))
                              })(colIndex),
                            styles: { theme: sacredtheme ? 'sacred' : 'light' },
                            style: styles.checkbox,
                          }),
                          (0, jsx_runtime.jsxs)('div', {
                            style: styles.columnTitleContainer,
                            children: [
                              (0, jsx_runtime.jsx)(Typography.A, {
                                variant: 'merrih4',
                                styles: {
                                  color: sacredtheme ? '#FFD700' : 'white',
                                },
                                children: col.title,
                              }),
                              (0, jsx_runtime.jsx)(Typography.A, {
                                variant: 'merrih6',
                                styles: {
                                  color: sacredtheme
                                    ? 'rgba(255, 215, 0, 0.8)'
                                    : 'white',
                                },
                                children: col.description,
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: styles.tasksContainer,
                        children: (
                          null === (_col_tasks = col.tasks) ||
                          void 0 === _col_tasks
                            ? void 0
                            : _col_tasks.length
                        )
                          ? (0, jsx_runtime.jsx)('div', {
                              style: styles.tasksList,
                              children: col.tasks.map((task, taskIndex) => {
                                const isSelected =
                                  (null == selectedTask
                                    ? void 0
                                    : selectedTask.colIndex) === colIndex &&
                                  (null == selectedTask
                                    ? void 0
                                    : selectedTask.taskIndex) === taskIndex
                                return (0, jsx_runtime.jsx)(
                                  Card.A,
                                  {
                                    variant: 'task',
                                    title: task.title,
                                    description: task.description,
                                    checked: isSelected,
                                    disabled: isTaskCheckboxDisabled(),
                                    onCheck: () => {
                                      null === selectedColumnIndex &&
                                        onSelectTask(colIndex, taskIndex)
                                    },
                                    draggable: isTaskDraggable(
                                      colIndex,
                                      taskIndex
                                    ),
                                    onDragStart: e =>
                                      handleLocalTaskDragStart(
                                        e,
                                        colIndex,
                                        taskIndex
                                      ),
                                    onDragOver: handleTaskDragOver,
                                    onDrop: e =>
                                      handleLocalTaskDrop(
                                        e,
                                        colIndex,
                                        taskIndex
                                      ),
                                    sacredtheme,
                                  },
                                  task._id
                                )
                              }),
                            })
                          : (0, jsx_runtime.jsx)(Typography.A, {
                              styles: {
                                color: sacredtheme
                                  ? 'rgba(255, 215, 0, 0.6)'
                                  : 'white',
                              },
                              children: 'No tasks yet',
                            }),
                      }),
                    ],
                  },
                  col._id
                )
              }),
              hasOverflow &&
                activeOverflowColumn &&
                (0, jsx_runtime.jsxs)(
                  'div',
                  {
                    draggable: !1,
                    onDragOver: e => e.preventDefault(),
                    onDrop: e => {
                      ;(e.preventDefault(), onColumnDrop(e, columns.length))
                    },
                    style: {
                      ...styles.column,
                      animationDelay: sacredtheme ? '0.5s' : void 0,
                    },
                    children: [
                      (0, jsx_runtime.jsxs)('div', {
                        style: styles.columnHeader,
                        children: [
                          (0, jsx_runtime.jsx)(Regular.A, {
                            label: 'More Columns',
                            options:
                              null !==
                                (_overflowColumns_map =
                                  null == overflowColumns
                                    ? void 0
                                    : overflowColumns.map(col => ({
                                        value: col.title,
                                      }))) && void 0 !== _overflowColumns_map
                                ? _overflowColumns_map
                                : [],
                            value:
                              null == activeOverflowColumn
                                ? void 0
                                : activeOverflowColumn.title,
                            onChange: handleOverflowDropdownChange,
                            styles: {
                              theme: sacredtheme ? 'sacred' : 'light',
                              backgroundColor: sacredtheme
                                ? 'rgba(255, 215, 0, 0.1)'
                                : 'white',
                              borderColor: sacredtheme ? '#FFD700' : 'white',
                              textColor: sacredtheme ? '#FFD700' : '#000',
                              labelColor: sacredtheme ? '#FFD700' : 'white',
                            },
                          }),
                          (0, jsx_runtime.jsx)('div', {
                            style: styles.columnTitleContainer,
                            children: (0, jsx_runtime.jsx)(Typography.A, {
                              variant: 'merrih6',
                              styles: {
                                color: sacredtheme
                                  ? 'rgba(255, 215, 0, 0.8)'
                                  : 'white',
                              },
                              children: activeOverflowColumn.description,
                            }),
                          }),
                        ],
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: styles.tasksContainer,
                        children: (
                          null ===
                            (_activeOverflowColumn_tasks =
                              activeOverflowColumn.tasks) ||
                          void 0 === _activeOverflowColumn_tasks
                            ? void 0
                            : _activeOverflowColumn_tasks.length
                        )
                          ? (0, jsx_runtime.jsx)('div', {
                              style: styles.tasksList,
                              children: activeOverflowColumn.tasks.map(
                                (task, taskIndex) => {
                                  const overflowColIndex = columns.length,
                                    isSelected =
                                      (null == selectedTask
                                        ? void 0
                                        : selectedTask.colIndex) ===
                                        overflowColIndex &&
                                      (null == selectedTask
                                        ? void 0
                                        : selectedTask.taskIndex) === taskIndex
                                  return (0, jsx_runtime.jsx)(
                                    Card.A,
                                    {
                                      variant: 'task',
                                      title: task.title,
                                      description: task.description,
                                      checked: isSelected,
                                      disabled: isTaskCheckboxDisabled(),
                                      onCheck: () => {
                                        null === selectedColumnIndex &&
                                          onSelectTask(
                                            overflowColIndex,
                                            taskIndex
                                          )
                                      },
                                      draggable: isTaskDraggable(
                                        overflowColIndex,
                                        taskIndex
                                      ),
                                      onDragStart: e =>
                                        handleLocalTaskDragStart(
                                          e,
                                          overflowColIndex,
                                          taskIndex
                                        ),
                                      onDragOver: handleTaskDragOver,
                                      onDrop: e =>
                                        handleLocalTaskDrop(
                                          e,
                                          overflowColIndex,
                                          taskIndex
                                        ),
                                      sacredtheme,
                                    },
                                    task._id
                                  )
                                }
                              ),
                            })
                          : (0, jsx_runtime.jsx)(Typography.A, {
                              styles: {
                                color: sacredtheme
                                  ? 'rgba(255, 215, 0, 0.6)'
                                  : 'white',
                              },
                              children: 'No tasks yet',
                            }),
                      }),
                    ],
                  },
                  'overflow-desktop-column'
                ),
            ],
          })
        }
        DesktopBoard.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'DesktopBoard',
          props: {
            columns: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  title: string\n  description: string\n  tasks: Task[]\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'title',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'tasks',
                          value: {
                            name: 'Array',
                            elements: [
                              {
                                name: 'signature',
                                type: 'object',
                                raw: '{\n  _id: string\n  /** The parent company ID or other domain-specific reference. */\n  companyId: string\n  title: string\n  description: string\n  /** If severity is linked to a separate record, store it here. */\n  severityId: string\n  /** The main status. */\n  statusId: string\n  /** The sub-status. */\n  substatusId: string\n  /** The scheduling queue ID. */\n  schedulingQueueId: string\n  /** Topics array, each referencing a topic ID. */\n  topicIds: string[]\n  /** Comments array, referencing comment IDs. */\n  commentIds: string[]\n  /** Employee IDs assigned to the task. */\n  employeeIds: string[]\n  /** Knowledgebase article IDs. */\n  articleIds: string[]\n  /** The "customer" ID if you have one. */\n  customerId: string\n  /** Timestamps. */\n  createdAt: Date\n  closedAt: Date\n  updatedAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n  /**\n   * If you want to store the actual comments (rather than just commentIds),\n   * so ShowTask can display them directly.\n   */\n  comments: Comment[]\n  /** If you store the "customer assigned" label as text (e.g. "Bobbie Sue"). */\n  customerAssigned: string\n  /** Severity label text (e.g. "Critical"). */\n  severity: string\n  /** Scheduling Queue text (e.g. "Technologies Unlimited"). */\n  schedulingQueue: string\n  /** High-level status text (e.g. "Open"). */\n  status: string\n  /** Sub-status text (e.g. "In Progress"). */\n  subStatus: string\n  /**\n   * If you want to store the actual topic strings (e.g. ["Technical Support"]).\n   * This can be used in addition to or instead of topicIds.\n   */\n  topicLabels: string[]\n  /**\n   * If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\n   * This can be used in addition to or instead of articleIds.\n   */\n  kbArticles: string[]\n  /** A string representing the assigned team member (e.g. "Matthew Goluba"). */\n  teamMember: string\n  /** If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST"). */\n  nextActionDate: string\n}',
                                signature: {
                                  properties: [
                                    {
                                      key: '_id',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'companyId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'The parent company ID or other domain-specific reference.',
                                    },
                                    {
                                      key: 'title',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'description',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'severityId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If severity is linked to a separate record, store it here.',
                                    },
                                    {
                                      key: 'statusId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The main status.',
                                    },
                                    {
                                      key: 'substatusId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The sub-status.',
                                    },
                                    {
                                      key: 'schedulingQueueId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The scheduling queue ID.',
                                    },
                                    {
                                      key: 'topicIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Topics array, each referencing a topic ID.',
                                    },
                                    {
                                      key: 'commentIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Comments array, referencing comment IDs.',
                                    },
                                    {
                                      key: 'employeeIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Employee IDs assigned to the task.',
                                    },
                                    {
                                      key: 'articleIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description: 'Knowledgebase article IDs.',
                                    },
                                    {
                                      key: 'customerId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'The "customer" ID if you have one.',
                                    },
                                    {
                                      key: 'createdAt',
                                      value: { name: 'Date', required: !0 },
                                      description: 'Timestamps.',
                                    },
                                    {
                                      key: 'closedAt',
                                      value: { name: 'Date', required: !0 },
                                    },
                                    {
                                      key: 'updatedAt',
                                      value: { name: 'Date', required: !0 },
                                    },
                                    {
                                      key: 'createdBy',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'editHistory',
                                      value: {
                                        name: 'Array',
                                        elements: [
                                          {
                                            name: 'signature',
                                            type: 'object',
                                            raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                            signature: {
                                              properties: [
                                                {
                                                  key: '_id',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'editedBy',
                                                  value: {
                                                    name: 'string',
                                                    required: !1,
                                                  },
                                                },
                                                {
                                                  key: 'editedAt',
                                                  value: {
                                                    name: 'Date',
                                                    required: !1,
                                                  },
                                                },
                                                {
                                                  key: 'text',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'isOriginal',
                                                  value: {
                                                    name: 'boolean',
                                                    required: !0,
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                        raw: 'CommentEditHistory[]',
                                        required: !0,
                                      },
                                    },
                                    {
                                      key: 'comments',
                                      value: {
                                        name: 'Array',
                                        elements: [
                                          {
                                            name: 'signature',
                                            type: 'object',
                                            raw: '{\n  _id: string\n  text: string\n  createdAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n}',
                                            signature: {
                                              properties: [
                                                {
                                                  key: '_id',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'text',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'createdAt',
                                                  value: {
                                                    name: 'Date',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'createdBy',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'editHistory',
                                                  value: {
                                                    name: 'Array',
                                                    elements: [
                                                      {
                                                        name: 'signature',
                                                        type: 'object',
                                                        raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                                        signature: {
                                                          properties: [
                                                            {
                                                              key: '_id',
                                                              value: {
                                                                name: 'string',
                                                                required: !0,
                                                              },
                                                            },
                                                            {
                                                              key: 'editedBy',
                                                              value: {
                                                                name: 'string',
                                                                required: !1,
                                                              },
                                                            },
                                                            {
                                                              key: 'editedAt',
                                                              value: {
                                                                name: 'Date',
                                                                required: !1,
                                                              },
                                                            },
                                                            {
                                                              key: 'text',
                                                              value: {
                                                                name: 'string',
                                                                required: !0,
                                                              },
                                                            },
                                                            {
                                                              key: 'isOriginal',
                                                              value: {
                                                                name: 'boolean',
                                                                required: !0,
                                                              },
                                                            },
                                                          ],
                                                        },
                                                      },
                                                    ],
                                                    raw: 'CommentEditHistory[]',
                                                    required: !0,
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                        raw: 'Comment[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store the actual comments (rather than just commentIds),\nso ShowTask can display them directly.',
                                    },
                                    {
                                      key: 'customerAssigned',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If you store the "customer assigned" label as text (e.g. "Bobbie Sue").',
                                    },
                                    {
                                      key: 'severity',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Severity label text (e.g. "Critical").',
                                    },
                                    {
                                      key: 'schedulingQueue',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Scheduling Queue text (e.g. "Technologies Unlimited").',
                                    },
                                    {
                                      key: 'status',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'High-level status text (e.g. "Open").',
                                    },
                                    {
                                      key: 'subStatus',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Sub-status text (e.g. "In Progress").',
                                    },
                                    {
                                      key: 'topicLabels',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store the actual topic strings (e.g. ["Technical Support"]).\nThis can be used in addition to or instead of topicIds.',
                                    },
                                    {
                                      key: 'kbArticles',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\nThis can be used in addition to or instead of articleIds.',
                                    },
                                    {
                                      key: 'teamMember',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'A string representing the assigned team member (e.g. "Matthew Goluba").',
                                    },
                                    {
                                      key: 'nextActionDate',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST").',
                                    },
                                  ],
                                },
                              },
                            ],
                            raw: 'Task[]',
                            required: !0,
                          },
                        },
                      ],
                    },
                  },
                ],
                raw: 'ColumnData[]',
              },
              description: '',
            },
            overflowColumns: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  title: string\n  description: string\n  tasks: Task[]\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'title',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'tasks',
                          value: {
                            name: 'Array',
                            elements: [
                              {
                                name: 'signature',
                                type: 'object',
                                raw: '{\n  _id: string\n  /** The parent company ID or other domain-specific reference. */\n  companyId: string\n  title: string\n  description: string\n  /** If severity is linked to a separate record, store it here. */\n  severityId: string\n  /** The main status. */\n  statusId: string\n  /** The sub-status. */\n  substatusId: string\n  /** The scheduling queue ID. */\n  schedulingQueueId: string\n  /** Topics array, each referencing a topic ID. */\n  topicIds: string[]\n  /** Comments array, referencing comment IDs. */\n  commentIds: string[]\n  /** Employee IDs assigned to the task. */\n  employeeIds: string[]\n  /** Knowledgebase article IDs. */\n  articleIds: string[]\n  /** The "customer" ID if you have one. */\n  customerId: string\n  /** Timestamps. */\n  createdAt: Date\n  closedAt: Date\n  updatedAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n  /**\n   * If you want to store the actual comments (rather than just commentIds),\n   * so ShowTask can display them directly.\n   */\n  comments: Comment[]\n  /** If you store the "customer assigned" label as text (e.g. "Bobbie Sue"). */\n  customerAssigned: string\n  /** Severity label text (e.g. "Critical"). */\n  severity: string\n  /** Scheduling Queue text (e.g. "Technologies Unlimited"). */\n  schedulingQueue: string\n  /** High-level status text (e.g. "Open"). */\n  status: string\n  /** Sub-status text (e.g. "In Progress"). */\n  subStatus: string\n  /**\n   * If you want to store the actual topic strings (e.g. ["Technical Support"]).\n   * This can be used in addition to or instead of topicIds.\n   */\n  topicLabels: string[]\n  /**\n   * If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\n   * This can be used in addition to or instead of articleIds.\n   */\n  kbArticles: string[]\n  /** A string representing the assigned team member (e.g. "Matthew Goluba"). */\n  teamMember: string\n  /** If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST"). */\n  nextActionDate: string\n}',
                                signature: {
                                  properties: [
                                    {
                                      key: '_id',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'companyId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'The parent company ID or other domain-specific reference.',
                                    },
                                    {
                                      key: 'title',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'description',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'severityId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If severity is linked to a separate record, store it here.',
                                    },
                                    {
                                      key: 'statusId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The main status.',
                                    },
                                    {
                                      key: 'substatusId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The sub-status.',
                                    },
                                    {
                                      key: 'schedulingQueueId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The scheduling queue ID.',
                                    },
                                    {
                                      key: 'topicIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Topics array, each referencing a topic ID.',
                                    },
                                    {
                                      key: 'commentIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Comments array, referencing comment IDs.',
                                    },
                                    {
                                      key: 'employeeIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Employee IDs assigned to the task.',
                                    },
                                    {
                                      key: 'articleIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description: 'Knowledgebase article IDs.',
                                    },
                                    {
                                      key: 'customerId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'The "customer" ID if you have one.',
                                    },
                                    {
                                      key: 'createdAt',
                                      value: { name: 'Date', required: !0 },
                                      description: 'Timestamps.',
                                    },
                                    {
                                      key: 'closedAt',
                                      value: { name: 'Date', required: !0 },
                                    },
                                    {
                                      key: 'updatedAt',
                                      value: { name: 'Date', required: !0 },
                                    },
                                    {
                                      key: 'createdBy',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'editHistory',
                                      value: {
                                        name: 'Array',
                                        elements: [
                                          {
                                            name: 'signature',
                                            type: 'object',
                                            raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                            signature: {
                                              properties: [
                                                {
                                                  key: '_id',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'editedBy',
                                                  value: {
                                                    name: 'string',
                                                    required: !1,
                                                  },
                                                },
                                                {
                                                  key: 'editedAt',
                                                  value: {
                                                    name: 'Date',
                                                    required: !1,
                                                  },
                                                },
                                                {
                                                  key: 'text',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'isOriginal',
                                                  value: {
                                                    name: 'boolean',
                                                    required: !0,
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                        raw: 'CommentEditHistory[]',
                                        required: !0,
                                      },
                                    },
                                    {
                                      key: 'comments',
                                      value: {
                                        name: 'Array',
                                        elements: [
                                          {
                                            name: 'signature',
                                            type: 'object',
                                            raw: '{\n  _id: string\n  text: string\n  createdAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n}',
                                            signature: {
                                              properties: [
                                                {
                                                  key: '_id',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'text',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'createdAt',
                                                  value: {
                                                    name: 'Date',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'createdBy',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'editHistory',
                                                  value: {
                                                    name: 'Array',
                                                    elements: [
                                                      {
                                                        name: 'signature',
                                                        type: 'object',
                                                        raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                                        signature: {
                                                          properties: [
                                                            {
                                                              key: '_id',
                                                              value: {
                                                                name: 'string',
                                                                required: !0,
                                                              },
                                                            },
                                                            {
                                                              key: 'editedBy',
                                                              value: {
                                                                name: 'string',
                                                                required: !1,
                                                              },
                                                            },
                                                            {
                                                              key: 'editedAt',
                                                              value: {
                                                                name: 'Date',
                                                                required: !1,
                                                              },
                                                            },
                                                            {
                                                              key: 'text',
                                                              value: {
                                                                name: 'string',
                                                                required: !0,
                                                              },
                                                            },
                                                            {
                                                              key: 'isOriginal',
                                                              value: {
                                                                name: 'boolean',
                                                                required: !0,
                                                              },
                                                            },
                                                          ],
                                                        },
                                                      },
                                                    ],
                                                    raw: 'CommentEditHistory[]',
                                                    required: !0,
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                        raw: 'Comment[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store the actual comments (rather than just commentIds),\nso ShowTask can display them directly.',
                                    },
                                    {
                                      key: 'customerAssigned',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If you store the "customer assigned" label as text (e.g. "Bobbie Sue").',
                                    },
                                    {
                                      key: 'severity',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Severity label text (e.g. "Critical").',
                                    },
                                    {
                                      key: 'schedulingQueue',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Scheduling Queue text (e.g. "Technologies Unlimited").',
                                    },
                                    {
                                      key: 'status',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'High-level status text (e.g. "Open").',
                                    },
                                    {
                                      key: 'subStatus',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Sub-status text (e.g. "In Progress").',
                                    },
                                    {
                                      key: 'topicLabels',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store the actual topic strings (e.g. ["Technical Support"]).\nThis can be used in addition to or instead of topicIds.',
                                    },
                                    {
                                      key: 'kbArticles',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\nThis can be used in addition to or instead of articleIds.',
                                    },
                                    {
                                      key: 'teamMember',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'A string representing the assigned team member (e.g. "Matthew Goluba").',
                                    },
                                    {
                                      key: 'nextActionDate',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST").',
                                    },
                                  ],
                                },
                              },
                            ],
                            raw: 'Task[]',
                            required: !0,
                          },
                        },
                      ],
                    },
                  },
                ],
                raw: 'ColumnData[]',
              },
              description: '',
            },
            selectedOverflowColumnId: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            onChangeSelectedOverflowColumn: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(colId: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'colId' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            selectedTask: {
              required: !0,
              tsType: {
                name: 'union',
                raw: '{ colIndex: number; taskIndex: number } | null',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{ colIndex: number; taskIndex: number }',
                    signature: {
                      properties: [
                        {
                          key: 'colIndex',
                          value: { name: 'number', required: !0 },
                        },
                        {
                          key: 'taskIndex',
                          value: { name: 'number', required: !0 },
                        },
                      ],
                    },
                  },
                  { name: 'null' },
                ],
              },
              description: '',
            },
            onSelectTask: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(colIndex: number, taskIndex: number) => void',
                signature: {
                  arguments: [
                    { type: { name: 'number' }, name: 'colIndex' },
                    { type: { name: 'number' }, name: 'taskIndex' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onColumnDragStart: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(e: React.DragEvent, columnIndex: number) => void',
                signature: {
                  arguments: [
                    {
                      type: { name: 'ReactDragEvent', raw: 'React.DragEvent' },
                      name: 'e',
                    },
                    { type: { name: 'number' }, name: 'columnIndex' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onColumnDragOver: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(e: React.DragEvent, columnIndex: number) => void',
                signature: {
                  arguments: [
                    {
                      type: { name: 'ReactDragEvent', raw: 'React.DragEvent' },
                      name: 'e',
                    },
                    { type: { name: 'number' }, name: 'columnIndex' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onColumnDrop: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(e: React.DragEvent, columnIndex: number) => void',
                signature: {
                  arguments: [
                    {
                      type: { name: 'ReactDragEvent', raw: 'React.DragEvent' },
                      name: 'e',
                    },
                    { type: { name: 'number' }, name: 'columnIndex' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'ProjectBoardStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
            sacredtheme: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'Sacred theme flag for styling',
              defaultValue: { value: 'false', computed: !1 },
            },
          },
        }
        const mobile_SACRED_GLYPHS = ['𓏭', '𓊵', '𓂋', '𓊹']
        function MobileBoard({
          columns,
          overflowColumns,
          selectedOverflowColumnId,
          onChangeSelectedOverflowColumn,
          selectedTask,
          onSelectTask,
          onColumnDrop,
          sacredtheme = !1,
        }) {
          var _currentColumn_tasks
          const [allColumns, setAllColumns] = (0, esm_react.fp)(columnsAtom),
            { handleTaskDragStart, handleTaskDragOver, handleTaskDrop } =
              useTaskDragAndDrop(),
            [mobileColumnIndex, setMobileColumnIndex] = (0, react.useState)(0),
            [selectedColumnIndex, setSelectedColumnIndex] = (0, react.useState)(
              null
            ),
            styles = (sacredtheme => ({
              boardContainer: {
                boxSizing: 'border-box',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              },
              column: {
                boxSizing: 'border-box',
                width: '300px',
                height: '70vh',
                borderRadius: '0.375rem',
                display: 'flex',
                flexDirection: 'column',
                overflowX: 'hidden',
                overflowY: 'auto',
                position: 'relative',
                ...(sacredtheme
                  ? {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      border: '2px solid rgba(255, 215, 0, 0.5)',
                      animation: 'board-glow-pulse 2s infinite alternate',
                      backdropFilter: 'blur(16px)',
                    }
                  : { backgroundColor: 'black' }),
              },
              columnHeader: {
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                position: 'relative',
                ...(sacredtheme
                  ? {
                      borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    }
                  : { borderBottom: '1px solid white' }),
              },
              columnDescription: {
                ...(sacredtheme && { fontFamily: 'Crimson Text, serif' }),
              },
              tasksContainer: { padding: '0.5rem', flex: 1 },
              noTasks: {
                ...(sacredtheme && {
                  fontStyle: 'italic',
                  fontFamily: 'Crimson Text, serif',
                }),
              },
              tasksList: {
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              },
              checkbox: {
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
              },
              glyph: {
                position: 'absolute',
                top: '0.5rem',
                left: '0.5rem',
                fontSize: '0.875rem',
                color: 'rgba(255, 215, 0, 0.3)',
                animation: 'board-float-glyph 3s infinite alternate',
                zIndex: 10,
              },
            }))(sacredtheme)
          function isColumnDraggable(colIndex) {
            return selectedColumnIndex === colIndex
          }
          function isTaskDraggable(colIndex, taskIndex) {
            return (
              null === selectedColumnIndex &&
              (null == selectedTask ? void 0 : selectedTask.colIndex) ===
                colIndex &&
              (null == selectedTask ? void 0 : selectedTask.taskIndex) ===
                taskIndex
            )
          }
          function handleLocalTaskDragStart(e, columnIndex, taskIndex) {
            isTaskDraggable(columnIndex, taskIndex)
              ? handleTaskDragStart({ columnIndex, taskIndex })
              : e.preventDefault()
          }
          function handleLocalTaskDrop(e, dropColumnIndex, dropTaskIndex) {
            ;(e.preventDefault(),
              handleTaskDrop(e, {
                dropColumnIndex,
                dropTaskIndex,
                allColumns,
                setAllColumns,
              }))
          }
          const hasOverflow = Boolean(
            null == overflowColumns ? void 0 : overflowColumns.length
          )
          let activeOverflowColumn
          hasOverflow &&
            selectedOverflowColumnId &&
            overflowColumns &&
            (activeOverflowColumn =
              overflowColumns.find(c => c._id === selectedOverflowColumnId) ||
              overflowColumns[0])
          const handleOverflowDropdownChange = (0, react.useCallback)(
            e => {
              if (!overflowColumns || !onChangeSelectedOverflowColumn) return
              const colTitle = e.target.value,
                found = overflowColumns.find(c => c.title === colTitle)
              found && onChangeSelectedOverflowColumn(found._id)
            },
            [overflowColumns, onChangeSelectedOverflowColumn]
          )
          if (hasOverflow && activeOverflowColumn) {
            var _activeOverflowColumn_tasks
            const overflowColIndex = columns.length
            var _overflowColumns_map
            return (0, jsx_runtime.jsxs)(
              'div',
              {
                draggable: !1,
                onDragOver: e => e.preventDefault(),
                onDrop: e => {
                  ;(e.preventDefault(), onColumnDrop(e, overflowColIndex))
                },
                style: styles.column,
                children: [
                  sacredtheme &&
                    (0, jsx_runtime.jsx)('div', {
                      style: styles.glyph,
                      children: mobile_SACRED_GLYPHS[0],
                    }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: styles.columnHeader,
                    children: [
                      (0, jsx_runtime.jsx)(Regular.A, {
                        label: 'More Columns',
                        options:
                          null !==
                            (_overflowColumns_map =
                              null == overflowColumns
                                ? void 0
                                : overflowColumns.map(col => ({
                                    value: col.title,
                                  }))) && void 0 !== _overflowColumns_map
                            ? _overflowColumns_map
                            : [],
                        value:
                          null == activeOverflowColumn
                            ? void 0
                            : activeOverflowColumn.title,
                        onChange: handleOverflowDropdownChange,
                        styles: {
                          theme: sacredtheme ? 'sacred' : 'light',
                          backgroundColor: sacredtheme
                            ? 'rgba(255, 215, 0, 0.1)'
                            : 'white',
                          borderColor: sacredtheme ? '#FFD700' : 'white',
                          textColor: sacredtheme ? '#FFD700' : '#000',
                          labelColor: sacredtheme ? '#FFD700' : 'white',
                        },
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: {
                          ...styles.columnDescription,
                          marginTop: '0.25rem',
                        },
                        children: (0, jsx_runtime.jsx)(Typography.A, {
                          variant: 'merrih6',
                          styles: {
                            color: sacredtheme
                              ? 'rgba(255, 215, 0, 0.8)'
                              : 'white',
                          },
                          children: activeOverflowColumn.description,
                        }),
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsx)('div', {
                    style: styles.tasksContainer,
                    children: (
                      null ===
                        (_activeOverflowColumn_tasks =
                          activeOverflowColumn.tasks) ||
                      void 0 === _activeOverflowColumn_tasks
                        ? void 0
                        : _activeOverflowColumn_tasks.length
                    )
                      ? (0, jsx_runtime.jsx)('div', {
                          style: styles.tasksList,
                          children: activeOverflowColumn.tasks.map(
                            (task, taskIndex) => {
                              const isSelected =
                                (null == selectedTask
                                  ? void 0
                                  : selectedTask.colIndex) ===
                                  overflowColIndex &&
                                (null == selectedTask
                                  ? void 0
                                  : selectedTask.taskIndex) === taskIndex
                              return (0, jsx_runtime.jsx)(
                                Card.A,
                                {
                                  variant: 'task',
                                  title: task.title,
                                  description: task.description,
                                  checked: isSelected,
                                  disabled: !1,
                                  onCheck: () =>
                                    onSelectTask(overflowColIndex, taskIndex),
                                  draggable: isTaskDraggable(
                                    overflowColIndex,
                                    taskIndex
                                  ),
                                  onDragStart: e =>
                                    handleLocalTaskDragStart(
                                      e,
                                      overflowColIndex,
                                      taskIndex
                                    ),
                                  onDragOver: handleTaskDragOver,
                                  onDrop: e =>
                                    handleLocalTaskDrop(
                                      e,
                                      overflowColIndex,
                                      taskIndex
                                    ),
                                  sacredtheme,
                                },
                                task._id
                              )
                            }
                          ),
                        })
                      : (0, jsx_runtime.jsx)(Typography.A, {
                          styles: {
                            color: sacredtheme
                              ? 'rgba(255, 215, 0, 0.6)'
                              : 'white',
                          },
                          children: 'No tasks yet',
                        }),
                  }),
                ],
              },
              'overflow-mobile-column'
            )
          }
          if (!columns.length)
            return (0, jsx_runtime.jsx)(Typography.A, {
              styles: { color: sacredtheme ? '#FFD700' : 'black' },
              children: 'No columns available.',
            })
          const currentColumn = columns[mobileColumnIndex]
          return (0, jsx_runtime.jsx)('div', {
            style: styles.boardContainer,
            children: (0, jsx_runtime.jsxs)(
              'div',
              {
                draggable: isColumnDraggable(mobileColumnIndex),
                onDragStart: e =>
                  (function handleLocalColumnDragStart(e, colIndex) {
                    isColumnDraggable(colIndex) || e.preventDefault()
                  })(e, mobileColumnIndex),
                onDragOver: e => e.preventDefault(),
                onDrop: e => {
                  ;(e.preventDefault(), onColumnDrop(e, mobileColumnIndex))
                },
                style: styles.column,
                children: [
                  sacredtheme &&
                    (0, jsx_runtime.jsx)('div', {
                      style: styles.glyph,
                      children:
                        mobile_SACRED_GLYPHS[
                          mobileColumnIndex % mobile_SACRED_GLYPHS.length
                        ],
                    }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: styles.columnHeader,
                    children: [
                      (0, jsx_runtime.jsx)(Checkbox.A, {
                        checked: selectedColumnIndex === mobileColumnIndex,
                        disabled: (function isColumnCheckboxDisabled() {
                          return null !== selectedTask
                        })(),
                        onChange: () =>
                          (function handleColumnCheck(colIndex) {
                            selectedColumnIndex === colIndex
                              ? setSelectedColumnIndex(null)
                              : (onSelectTask(-1, -1),
                                setSelectedColumnIndex(colIndex))
                          })(mobileColumnIndex),
                        styles: { theme: sacredtheme ? 'sacred' : 'light' },
                        style: styles.checkbox,
                      }),
                      (0, jsx_runtime.jsx)(Regular.A, {
                        label: 'Select Column',
                        options: columns.map(col => ({ value: col.title })),
                        value: currentColumn.title,
                        onChange: function handleColumnDropdownChange(e) {
                          const title = e.target.value,
                            foundIndex = columns.findIndex(
                              c => c.title === title
                            )
                          foundIndex >= 0 &&
                            (onSelectTask(-1, -1),
                            setSelectedColumnIndex(null),
                            setMobileColumnIndex(foundIndex))
                        },
                        styles: {
                          theme: sacredtheme ? 'sacred' : 'light',
                          backgroundColor: sacredtheme
                            ? 'rgba(255, 215, 0, 0.1)'
                            : 'white',
                          borderColor: sacredtheme ? '#FFD700' : 'white',
                          textColor: sacredtheme ? '#FFD700' : '#000',
                          labelColor: sacredtheme ? '#FFD700' : 'white',
                        },
                      }),
                      (0, jsx_runtime.jsx)(Typography.A, {
                        variant: 'merrih6',
                        styles: {
                          color: sacredtheme
                            ? 'rgba(255, 215, 0, 0.8)'
                            : 'white',
                        },
                        children: currentColumn.description,
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsx)('div', {
                    style: styles.tasksContainer,
                    children: (
                      null === (_currentColumn_tasks = currentColumn.tasks) ||
                      void 0 === _currentColumn_tasks
                        ? void 0
                        : _currentColumn_tasks.length
                    )
                      ? (0, jsx_runtime.jsx)('div', {
                          style: styles.tasksList,
                          children: currentColumn.tasks.map(
                            (task, taskIndex) => {
                              const isSelected =
                                (null == selectedTask
                                  ? void 0
                                  : selectedTask.colIndex) ===
                                  mobileColumnIndex &&
                                (null == selectedTask
                                  ? void 0
                                  : selectedTask.taskIndex) === taskIndex
                              return (0, jsx_runtime.jsx)(
                                Card.A,
                                {
                                  variant: 'task',
                                  title: task.title,
                                  description: task.description,
                                  checked: isSelected,
                                  disabled: null !== selectedColumnIndex,
                                  onCheck: () => {
                                    null === selectedColumnIndex &&
                                      onSelectTask(mobileColumnIndex, taskIndex)
                                  },
                                  draggable: isTaskDraggable(
                                    mobileColumnIndex,
                                    taskIndex
                                  ),
                                  onDragStart: e =>
                                    handleLocalTaskDragStart(
                                      e,
                                      mobileColumnIndex,
                                      taskIndex
                                    ),
                                  onDragOver: handleTaskDragOver,
                                  onDrop: e =>
                                    handleLocalTaskDrop(
                                      e,
                                      mobileColumnIndex,
                                      taskIndex
                                    ),
                                  sacredtheme,
                                },
                                task._id
                              )
                            }
                          ),
                        })
                      : (0, jsx_runtime.jsx)(Typography.A, {
                          styles: {
                            color: sacredtheme
                              ? 'rgba(255, 215, 0, 0.6)'
                              : 'white',
                          },
                          children: 'No tasks yet',
                        }),
                  }),
                ],
              },
              currentColumn._id
            ),
          })
        }
        MobileBoard.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'MobileBoard',
          props: {
            columns: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  title: string\n  description: string\n  tasks: Task[]\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'title',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'tasks',
                          value: {
                            name: 'Array',
                            elements: [
                              {
                                name: 'signature',
                                type: 'object',
                                raw: '{\n  _id: string\n  /** The parent company ID or other domain-specific reference. */\n  companyId: string\n  title: string\n  description: string\n  /** If severity is linked to a separate record, store it here. */\n  severityId: string\n  /** The main status. */\n  statusId: string\n  /** The sub-status. */\n  substatusId: string\n  /** The scheduling queue ID. */\n  schedulingQueueId: string\n  /** Topics array, each referencing a topic ID. */\n  topicIds: string[]\n  /** Comments array, referencing comment IDs. */\n  commentIds: string[]\n  /** Employee IDs assigned to the task. */\n  employeeIds: string[]\n  /** Knowledgebase article IDs. */\n  articleIds: string[]\n  /** The "customer" ID if you have one. */\n  customerId: string\n  /** Timestamps. */\n  createdAt: Date\n  closedAt: Date\n  updatedAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n  /**\n   * If you want to store the actual comments (rather than just commentIds),\n   * so ShowTask can display them directly.\n   */\n  comments: Comment[]\n  /** If you store the "customer assigned" label as text (e.g. "Bobbie Sue"). */\n  customerAssigned: string\n  /** Severity label text (e.g. "Critical"). */\n  severity: string\n  /** Scheduling Queue text (e.g. "Technologies Unlimited"). */\n  schedulingQueue: string\n  /** High-level status text (e.g. "Open"). */\n  status: string\n  /** Sub-status text (e.g. "In Progress"). */\n  subStatus: string\n  /**\n   * If you want to store the actual topic strings (e.g. ["Technical Support"]).\n   * This can be used in addition to or instead of topicIds.\n   */\n  topicLabels: string[]\n  /**\n   * If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\n   * This can be used in addition to or instead of articleIds.\n   */\n  kbArticles: string[]\n  /** A string representing the assigned team member (e.g. "Matthew Goluba"). */\n  teamMember: string\n  /** If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST"). */\n  nextActionDate: string\n}',
                                signature: {
                                  properties: [
                                    {
                                      key: '_id',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'companyId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'The parent company ID or other domain-specific reference.',
                                    },
                                    {
                                      key: 'title',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'description',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'severityId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If severity is linked to a separate record, store it here.',
                                    },
                                    {
                                      key: 'statusId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The main status.',
                                    },
                                    {
                                      key: 'substatusId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The sub-status.',
                                    },
                                    {
                                      key: 'schedulingQueueId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The scheduling queue ID.',
                                    },
                                    {
                                      key: 'topicIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Topics array, each referencing a topic ID.',
                                    },
                                    {
                                      key: 'commentIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Comments array, referencing comment IDs.',
                                    },
                                    {
                                      key: 'employeeIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Employee IDs assigned to the task.',
                                    },
                                    {
                                      key: 'articleIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description: 'Knowledgebase article IDs.',
                                    },
                                    {
                                      key: 'customerId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'The "customer" ID if you have one.',
                                    },
                                    {
                                      key: 'createdAt',
                                      value: { name: 'Date', required: !0 },
                                      description: 'Timestamps.',
                                    },
                                    {
                                      key: 'closedAt',
                                      value: { name: 'Date', required: !0 },
                                    },
                                    {
                                      key: 'updatedAt',
                                      value: { name: 'Date', required: !0 },
                                    },
                                    {
                                      key: 'createdBy',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'editHistory',
                                      value: {
                                        name: 'Array',
                                        elements: [
                                          {
                                            name: 'signature',
                                            type: 'object',
                                            raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                            signature: {
                                              properties: [
                                                {
                                                  key: '_id',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'editedBy',
                                                  value: {
                                                    name: 'string',
                                                    required: !1,
                                                  },
                                                },
                                                {
                                                  key: 'editedAt',
                                                  value: {
                                                    name: 'Date',
                                                    required: !1,
                                                  },
                                                },
                                                {
                                                  key: 'text',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'isOriginal',
                                                  value: {
                                                    name: 'boolean',
                                                    required: !0,
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                        raw: 'CommentEditHistory[]',
                                        required: !0,
                                      },
                                    },
                                    {
                                      key: 'comments',
                                      value: {
                                        name: 'Array',
                                        elements: [
                                          {
                                            name: 'signature',
                                            type: 'object',
                                            raw: '{\n  _id: string\n  text: string\n  createdAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n}',
                                            signature: {
                                              properties: [
                                                {
                                                  key: '_id',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'text',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'createdAt',
                                                  value: {
                                                    name: 'Date',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'createdBy',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'editHistory',
                                                  value: {
                                                    name: 'Array',
                                                    elements: [
                                                      {
                                                        name: 'signature',
                                                        type: 'object',
                                                        raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                                        signature: {
                                                          properties: [
                                                            {
                                                              key: '_id',
                                                              value: {
                                                                name: 'string',
                                                                required: !0,
                                                              },
                                                            },
                                                            {
                                                              key: 'editedBy',
                                                              value: {
                                                                name: 'string',
                                                                required: !1,
                                                              },
                                                            },
                                                            {
                                                              key: 'editedAt',
                                                              value: {
                                                                name: 'Date',
                                                                required: !1,
                                                              },
                                                            },
                                                            {
                                                              key: 'text',
                                                              value: {
                                                                name: 'string',
                                                                required: !0,
                                                              },
                                                            },
                                                            {
                                                              key: 'isOriginal',
                                                              value: {
                                                                name: 'boolean',
                                                                required: !0,
                                                              },
                                                            },
                                                          ],
                                                        },
                                                      },
                                                    ],
                                                    raw: 'CommentEditHistory[]',
                                                    required: !0,
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                        raw: 'Comment[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store the actual comments (rather than just commentIds),\nso ShowTask can display them directly.',
                                    },
                                    {
                                      key: 'customerAssigned',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If you store the "customer assigned" label as text (e.g. "Bobbie Sue").',
                                    },
                                    {
                                      key: 'severity',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Severity label text (e.g. "Critical").',
                                    },
                                    {
                                      key: 'schedulingQueue',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Scheduling Queue text (e.g. "Technologies Unlimited").',
                                    },
                                    {
                                      key: 'status',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'High-level status text (e.g. "Open").',
                                    },
                                    {
                                      key: 'subStatus',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Sub-status text (e.g. "In Progress").',
                                    },
                                    {
                                      key: 'topicLabels',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store the actual topic strings (e.g. ["Technical Support"]).\nThis can be used in addition to or instead of topicIds.',
                                    },
                                    {
                                      key: 'kbArticles',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\nThis can be used in addition to or instead of articleIds.',
                                    },
                                    {
                                      key: 'teamMember',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'A string representing the assigned team member (e.g. "Matthew Goluba").',
                                    },
                                    {
                                      key: 'nextActionDate',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST").',
                                    },
                                  ],
                                },
                              },
                            ],
                            raw: 'Task[]',
                            required: !0,
                          },
                        },
                      ],
                    },
                  },
                ],
                raw: 'ColumnData[]',
              },
              description: '',
            },
            overflowColumns: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  title: string\n  description: string\n  tasks: Task[]\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'title',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'tasks',
                          value: {
                            name: 'Array',
                            elements: [
                              {
                                name: 'signature',
                                type: 'object',
                                raw: '{\n  _id: string\n  /** The parent company ID or other domain-specific reference. */\n  companyId: string\n  title: string\n  description: string\n  /** If severity is linked to a separate record, store it here. */\n  severityId: string\n  /** The main status. */\n  statusId: string\n  /** The sub-status. */\n  substatusId: string\n  /** The scheduling queue ID. */\n  schedulingQueueId: string\n  /** Topics array, each referencing a topic ID. */\n  topicIds: string[]\n  /** Comments array, referencing comment IDs. */\n  commentIds: string[]\n  /** Employee IDs assigned to the task. */\n  employeeIds: string[]\n  /** Knowledgebase article IDs. */\n  articleIds: string[]\n  /** The "customer" ID if you have one. */\n  customerId: string\n  /** Timestamps. */\n  createdAt: Date\n  closedAt: Date\n  updatedAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n  /**\n   * If you want to store the actual comments (rather than just commentIds),\n   * so ShowTask can display them directly.\n   */\n  comments: Comment[]\n  /** If you store the "customer assigned" label as text (e.g. "Bobbie Sue"). */\n  customerAssigned: string\n  /** Severity label text (e.g. "Critical"). */\n  severity: string\n  /** Scheduling Queue text (e.g. "Technologies Unlimited"). */\n  schedulingQueue: string\n  /** High-level status text (e.g. "Open"). */\n  status: string\n  /** Sub-status text (e.g. "In Progress"). */\n  subStatus: string\n  /**\n   * If you want to store the actual topic strings (e.g. ["Technical Support"]).\n   * This can be used in addition to or instead of topicIds.\n   */\n  topicLabels: string[]\n  /**\n   * If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\n   * This can be used in addition to or instead of articleIds.\n   */\n  kbArticles: string[]\n  /** A string representing the assigned team member (e.g. "Matthew Goluba"). */\n  teamMember: string\n  /** If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST"). */\n  nextActionDate: string\n}',
                                signature: {
                                  properties: [
                                    {
                                      key: '_id',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'companyId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'The parent company ID or other domain-specific reference.',
                                    },
                                    {
                                      key: 'title',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'description',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'severityId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If severity is linked to a separate record, store it here.',
                                    },
                                    {
                                      key: 'statusId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The main status.',
                                    },
                                    {
                                      key: 'substatusId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The sub-status.',
                                    },
                                    {
                                      key: 'schedulingQueueId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The scheduling queue ID.',
                                    },
                                    {
                                      key: 'topicIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Topics array, each referencing a topic ID.',
                                    },
                                    {
                                      key: 'commentIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Comments array, referencing comment IDs.',
                                    },
                                    {
                                      key: 'employeeIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Employee IDs assigned to the task.',
                                    },
                                    {
                                      key: 'articleIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description: 'Knowledgebase article IDs.',
                                    },
                                    {
                                      key: 'customerId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'The "customer" ID if you have one.',
                                    },
                                    {
                                      key: 'createdAt',
                                      value: { name: 'Date', required: !0 },
                                      description: 'Timestamps.',
                                    },
                                    {
                                      key: 'closedAt',
                                      value: { name: 'Date', required: !0 },
                                    },
                                    {
                                      key: 'updatedAt',
                                      value: { name: 'Date', required: !0 },
                                    },
                                    {
                                      key: 'createdBy',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'editHistory',
                                      value: {
                                        name: 'Array',
                                        elements: [
                                          {
                                            name: 'signature',
                                            type: 'object',
                                            raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                            signature: {
                                              properties: [
                                                {
                                                  key: '_id',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'editedBy',
                                                  value: {
                                                    name: 'string',
                                                    required: !1,
                                                  },
                                                },
                                                {
                                                  key: 'editedAt',
                                                  value: {
                                                    name: 'Date',
                                                    required: !1,
                                                  },
                                                },
                                                {
                                                  key: 'text',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'isOriginal',
                                                  value: {
                                                    name: 'boolean',
                                                    required: !0,
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                        raw: 'CommentEditHistory[]',
                                        required: !0,
                                      },
                                    },
                                    {
                                      key: 'comments',
                                      value: {
                                        name: 'Array',
                                        elements: [
                                          {
                                            name: 'signature',
                                            type: 'object',
                                            raw: '{\n  _id: string\n  text: string\n  createdAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n}',
                                            signature: {
                                              properties: [
                                                {
                                                  key: '_id',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'text',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'createdAt',
                                                  value: {
                                                    name: 'Date',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'createdBy',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'editHistory',
                                                  value: {
                                                    name: 'Array',
                                                    elements: [
                                                      {
                                                        name: 'signature',
                                                        type: 'object',
                                                        raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                                        signature: {
                                                          properties: [
                                                            {
                                                              key: '_id',
                                                              value: {
                                                                name: 'string',
                                                                required: !0,
                                                              },
                                                            },
                                                            {
                                                              key: 'editedBy',
                                                              value: {
                                                                name: 'string',
                                                                required: !1,
                                                              },
                                                            },
                                                            {
                                                              key: 'editedAt',
                                                              value: {
                                                                name: 'Date',
                                                                required: !1,
                                                              },
                                                            },
                                                            {
                                                              key: 'text',
                                                              value: {
                                                                name: 'string',
                                                                required: !0,
                                                              },
                                                            },
                                                            {
                                                              key: 'isOriginal',
                                                              value: {
                                                                name: 'boolean',
                                                                required: !0,
                                                              },
                                                            },
                                                          ],
                                                        },
                                                      },
                                                    ],
                                                    raw: 'CommentEditHistory[]',
                                                    required: !0,
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                        raw: 'Comment[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store the actual comments (rather than just commentIds),\nso ShowTask can display them directly.',
                                    },
                                    {
                                      key: 'customerAssigned',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If you store the "customer assigned" label as text (e.g. "Bobbie Sue").',
                                    },
                                    {
                                      key: 'severity',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Severity label text (e.g. "Critical").',
                                    },
                                    {
                                      key: 'schedulingQueue',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Scheduling Queue text (e.g. "Technologies Unlimited").',
                                    },
                                    {
                                      key: 'status',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'High-level status text (e.g. "Open").',
                                    },
                                    {
                                      key: 'subStatus',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Sub-status text (e.g. "In Progress").',
                                    },
                                    {
                                      key: 'topicLabels',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store the actual topic strings (e.g. ["Technical Support"]).\nThis can be used in addition to or instead of topicIds.',
                                    },
                                    {
                                      key: 'kbArticles',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\nThis can be used in addition to or instead of articleIds.',
                                    },
                                    {
                                      key: 'teamMember',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'A string representing the assigned team member (e.g. "Matthew Goluba").',
                                    },
                                    {
                                      key: 'nextActionDate',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST").',
                                    },
                                  ],
                                },
                              },
                            ],
                            raw: 'Task[]',
                            required: !0,
                          },
                        },
                      ],
                    },
                  },
                ],
                raw: 'ColumnData[]',
              },
              description: '',
            },
            selectedOverflowColumnId: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            onChangeSelectedOverflowColumn: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(colId: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'colId' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            selectedTask: {
              required: !0,
              tsType: {
                name: 'union',
                raw: '{ colIndex: number; taskIndex: number } | null',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{ colIndex: number; taskIndex: number }',
                    signature: {
                      properties: [
                        {
                          key: 'colIndex',
                          value: { name: 'number', required: !0 },
                        },
                        {
                          key: 'taskIndex',
                          value: { name: 'number', required: !0 },
                        },
                      ],
                    },
                  },
                  { name: 'null' },
                ],
              },
              description: '',
            },
            onSelectTask: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(colIndex: number, taskIndex: number) => void',
                signature: {
                  arguments: [
                    { type: { name: 'number' }, name: 'colIndex' },
                    { type: { name: 'number' }, name: 'taskIndex' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onColumnDragStart: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(e: React.DragEvent, columnIndex: number) => void',
                signature: {
                  arguments: [
                    {
                      type: { name: 'ReactDragEvent', raw: 'React.DragEvent' },
                      name: 'e',
                    },
                    { type: { name: 'number' }, name: 'columnIndex' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onColumnDragOver: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(e: React.DragEvent, columnIndex: number) => void',
                signature: {
                  arguments: [
                    {
                      type: { name: 'ReactDragEvent', raw: 'React.DragEvent' },
                      name: 'e',
                    },
                    { type: { name: 'number' }, name: 'columnIndex' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onColumnDrop: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(e: React.DragEvent, columnIndex: number) => void',
                signature: {
                  arguments: [
                    {
                      type: { name: 'ReactDragEvent', raw: 'React.DragEvent' },
                      name: 'e',
                    },
                    { type: { name: 'number' }, name: 'columnIndex' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'ProjectBoardStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
            sacredtheme: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'Sacred theme flag for styling',
              defaultValue: { value: 'false', computed: !1 },
            },
          },
        }
        const tablet_SACRED_GLYPHS = ['𓏭', '𓊵', '𓂋', '𓊹']
        function TabletBoard({
          columns,
          overflowColumns,
          selectedOverflowColumnId,
          onChangeSelectedOverflowColumn,
          selectedTask,
          onSelectTask,
          onColumnDragStart,
          onColumnDragOver,
          onColumnDrop,
          sacredtheme = !1,
        }) {
          var _activeOverflowColumn_tasks
          const [allColumns, setAllColumns] = (0, esm_react.fp)(columnsAtom),
            [selectedColumnIndex, setSelectedColumnIndex] = (0, react.useState)(
              null
            ),
            { handleTaskDragStart, handleTaskDragOver, handleTaskDrop } =
              useTaskDragAndDrop(),
            styles = (sacredtheme => ({
              boardContainer: {
                display: 'flex',
                flexDirection: 'row',
                gap: '0.75rem',
              },
              column: {
                boxSizing: 'border-box',
                width: '300px',
                height: '70vh',
                borderRadius: '0.375rem',
                display: 'flex',
                flexDirection: 'column',
                overflowX: 'hidden',
                overflowY: 'auto',
                position: 'relative',
                ...(sacredtheme
                  ? {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      border: '2px solid rgba(255, 215, 0, 0.5)',
                      animation: 'board-glow-pulse 2s infinite alternate',
                      backdropFilter: 'blur(16px)',
                    }
                  : { backgroundColor: 'black' }),
              },
              columnHeader: {
                padding: '0.5rem',
                position: 'relative',
                ...(sacredtheme
                  ? {
                      borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    }
                  : { borderBottom: '1px solid white' }),
              },
              columnTitleContainer: {
                display: 'flex',
                flexDirection: 'column',
                gap: '0.125rem',
              },
              columnTitle: {
                ...(sacredtheme && {
                  fontFamily: 'Cinzel, serif',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textShadow: '0 0 5px rgba(255, 215, 0, 0.5)',
                }),
              },
              columnDescription: {
                ...(sacredtheme && { fontFamily: 'Crimson Text, serif' }),
              },
              tasksContainer: { padding: '0.5rem', flex: 1 },
              noTasks: {
                ...(sacredtheme && {
                  fontStyle: 'italic',
                  fontFamily: 'Crimson Text, serif',
                }),
              },
              tasksList: {
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              },
              checkbox: {
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
              },
              glyph: {
                position: 'absolute',
                top: '0.5rem',
                left: '0.5rem',
                fontSize: '0.875rem',
                color: 'rgba(255, 215, 0, 0.3)',
                animation: 'board-float-glyph 3s infinite alternate',
                zIndex: 10,
              },
            }))(sacredtheme)
          function isTaskCheckboxDisabled() {
            return null !== selectedColumnIndex
          }
          function isColumnDraggable(colIndex) {
            return selectedColumnIndex === colIndex
          }
          function isTaskDraggable(colIndex, taskIndex) {
            return (
              null === selectedColumnIndex &&
              (null == selectedTask ? void 0 : selectedTask.colIndex) ===
                colIndex &&
              (null == selectedTask ? void 0 : selectedTask.taskIndex) ===
                taskIndex
            )
          }
          function handleLocalTaskDragStart(e, columnIndex, taskIndex) {
            isTaskDraggable(columnIndex, taskIndex)
              ? handleTaskDragStart({ columnIndex, taskIndex })
              : e.preventDefault()
          }
          function handleLocalTaskDrop(e, dropColumnIndex, dropTaskIndex) {
            ;(e.preventDefault(),
              handleTaskDrop(e, {
                dropColumnIndex,
                dropTaskIndex,
                allColumns,
                setAllColumns,
              }))
          }
          const hasOverflow = Boolean(
            null == overflowColumns ? void 0 : overflowColumns.length
          )
          let activeOverflowColumn
          hasOverflow &&
            selectedOverflowColumnId &&
            overflowColumns &&
            (activeOverflowColumn =
              overflowColumns.find(c => c._id === selectedOverflowColumnId) ||
              overflowColumns[0])
          const handleOverflowDropdownChange = (0, react.useCallback)(
            e => {
              if (!overflowColumns || !onChangeSelectedOverflowColumn) return
              const colTitle = e.target.value,
                found = overflowColumns.find(c => c.title === colTitle)
              found && onChangeSelectedOverflowColumn(found._id)
            },
            [overflowColumns, onChangeSelectedOverflowColumn]
          )
          var _overflowColumns_map
          return (0, jsx_runtime.jsxs)('div', {
            style: styles.boardContainer,
            children: [
              columns.map((col, colIndex) => {
                var _col_tasks
                const colChecked = selectedColumnIndex === colIndex
                return (0, jsx_runtime.jsxs)(
                  'div',
                  {
                    draggable: isColumnDraggable(colIndex),
                    onDragStart: e =>
                      (function handleLocalColumnDragStart(e, colIndex) {
                        isColumnDraggable(colIndex)
                          ? onColumnDragStart(e, colIndex)
                          : e.preventDefault()
                      })(e, colIndex),
                    onDragOver: e =>
                      (function handleLocalColumnDragOver(e, colIndex) {
                        ;(e.preventDefault(), onColumnDragOver(e, colIndex))
                      })(e, colIndex),
                    onDrop: e =>
                      (function handleLocalColumnDrop(e, colIndex) {
                        ;(e.preventDefault(), onColumnDrop(e, colIndex))
                      })(e, colIndex),
                    style: styles.column,
                    children: [
                      sacredtheme &&
                        (0, jsx_runtime.jsx)('div', {
                          style: styles.glyph,
                          children:
                            tablet_SACRED_GLYPHS[
                              colIndex % tablet_SACRED_GLYPHS.length
                            ],
                        }),
                      (0, jsx_runtime.jsxs)('div', {
                        style: styles.columnHeader,
                        children: [
                          (0, jsx_runtime.jsx)(Checkbox.A, {
                            checked: colChecked,
                            disabled: null !== selectedTask,
                            onChange: () =>
                              (function handleColumnCheck(colIndex) {
                                selectedColumnIndex === colIndex
                                  ? setSelectedColumnIndex(null)
                                  : (onSelectTask(-1, -1),
                                    setSelectedColumnIndex(colIndex))
                              })(colIndex),
                            styles: { theme: sacredtheme ? 'sacred' : 'light' },
                            style: styles.checkbox,
                          }),
                          (0, jsx_runtime.jsxs)('div', {
                            style: styles.columnTitleContainer,
                            children: [
                              (0, jsx_runtime.jsx)(Typography.A, {
                                variant: 'merrih4',
                                styles: {
                                  color: sacredtheme ? '#FFD700' : 'white',
                                },
                                children: col.title,
                              }),
                              (0, jsx_runtime.jsx)(Typography.A, {
                                variant: 'merrih6',
                                styles: {
                                  color: sacredtheme
                                    ? 'rgba(255, 215, 0, 0.8)'
                                    : 'white',
                                },
                                children: col.description,
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: styles.tasksContainer,
                        children: (
                          null === (_col_tasks = col.tasks) ||
                          void 0 === _col_tasks
                            ? void 0
                            : _col_tasks.length
                        )
                          ? (0, jsx_runtime.jsx)('div', {
                              style: styles.tasksList,
                              children: col.tasks.map((task, taskIndex) => {
                                const isSelected =
                                  (null == selectedTask
                                    ? void 0
                                    : selectedTask.colIndex) === colIndex &&
                                  (null == selectedTask
                                    ? void 0
                                    : selectedTask.taskIndex) === taskIndex
                                return (0, jsx_runtime.jsx)(
                                  Card.A,
                                  {
                                    variant: 'task',
                                    title: task.title,
                                    description: task.description,
                                    checked: isSelected,
                                    disabled: isTaskCheckboxDisabled(),
                                    onCheck: () => {
                                      null === selectedColumnIndex &&
                                        onSelectTask(colIndex, taskIndex)
                                    },
                                    draggable: isTaskDraggable(
                                      colIndex,
                                      taskIndex
                                    ),
                                    onDragStart: e =>
                                      handleLocalTaskDragStart(
                                        e,
                                        colIndex,
                                        taskIndex
                                      ),
                                    onDragOver: handleTaskDragOver,
                                    onDrop: e =>
                                      handleLocalTaskDrop(
                                        e,
                                        colIndex,
                                        taskIndex
                                      ),
                                    sacredtheme,
                                  },
                                  task._id
                                )
                              }),
                            })
                          : (0, jsx_runtime.jsx)(Typography.A, {
                              styles: {
                                color: sacredtheme
                                  ? 'rgba(255, 215, 0, 0.6)'
                                  : 'white',
                              },
                              children: 'No tasks yet',
                            }),
                      }),
                    ],
                  },
                  col._id
                )
              }),
              hasOverflow &&
                activeOverflowColumn &&
                (0, jsx_runtime.jsxs)(
                  'div',
                  {
                    draggable: !1,
                    onDragOver: e => e.preventDefault(),
                    onDrop: e => {
                      ;(e.preventDefault(), onColumnDrop(e, columns.length))
                    },
                    style: {
                      ...styles.column,
                      animationDelay: sacredtheme ? '0.5s' : void 0,
                    },
                    children: [
                      (0, jsx_runtime.jsxs)('div', {
                        style: styles.columnHeader,
                        children: [
                          (0, jsx_runtime.jsx)(Regular.A, {
                            label: 'More Columns',
                            options:
                              null !==
                                (_overflowColumns_map =
                                  null == overflowColumns
                                    ? void 0
                                    : overflowColumns.map(col => ({
                                        value: col.title,
                                      }))) && void 0 !== _overflowColumns_map
                                ? _overflowColumns_map
                                : [],
                            value:
                              null == activeOverflowColumn
                                ? void 0
                                : activeOverflowColumn.title,
                            onChange: handleOverflowDropdownChange,
                            styles: {
                              theme: sacredtheme ? 'sacred' : 'light',
                              backgroundColor: sacredtheme
                                ? 'rgba(255, 215, 0, 0.1)'
                                : 'white',
                              borderColor: sacredtheme ? '#FFD700' : 'white',
                              textColor: sacredtheme ? '#FFD700' : '#000',
                              labelColor: sacredtheme ? '#FFD700' : 'white',
                            },
                          }),
                          (0, jsx_runtime.jsx)('div', {
                            style: {
                              ...styles.columnTitleContainer,
                              marginTop: '0.25rem',
                            },
                            children: (0, jsx_runtime.jsx)(Typography.A, {
                              variant: 'merrih6',
                              styles: {
                                color: sacredtheme
                                  ? 'rgba(255, 215, 0, 0.8)'
                                  : 'white',
                              },
                              children: activeOverflowColumn.description,
                            }),
                          }),
                        ],
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: styles.tasksContainer,
                        children: (
                          null ===
                            (_activeOverflowColumn_tasks =
                              activeOverflowColumn.tasks) ||
                          void 0 === _activeOverflowColumn_tasks
                            ? void 0
                            : _activeOverflowColumn_tasks.length
                        )
                          ? (0, jsx_runtime.jsx)('div', {
                              style: styles.tasksList,
                              children: activeOverflowColumn.tasks.map(
                                (task, taskIndex) => {
                                  const overflowColIndex = columns.length,
                                    isSelected =
                                      (null == selectedTask
                                        ? void 0
                                        : selectedTask.colIndex) ===
                                        overflowColIndex &&
                                      (null == selectedTask
                                        ? void 0
                                        : selectedTask.taskIndex) === taskIndex
                                  return (0, jsx_runtime.jsx)(
                                    Card.A,
                                    {
                                      variant: 'task',
                                      title: task.title,
                                      description: task.description,
                                      checked: isSelected,
                                      disabled: isTaskCheckboxDisabled(),
                                      onCheck: () => {
                                        null === selectedColumnIndex &&
                                          onSelectTask(
                                            overflowColIndex,
                                            taskIndex
                                          )
                                      },
                                      draggable: isTaskDraggable(
                                        overflowColIndex,
                                        taskIndex
                                      ),
                                      onDragStart: e =>
                                        handleLocalTaskDragStart(
                                          e,
                                          overflowColIndex,
                                          taskIndex
                                        ),
                                      onDragOver: handleTaskDragOver,
                                      onDrop: e =>
                                        handleLocalTaskDrop(
                                          e,
                                          overflowColIndex,
                                          taskIndex
                                        ),
                                      sacredtheme,
                                    },
                                    task._id
                                  )
                                }
                              ),
                            })
                          : (0, jsx_runtime.jsx)(Typography.A, {
                              styles: {
                                color: sacredtheme
                                  ? 'rgba(255, 215, 0, 0.6)'
                                  : 'white',
                              },
                              children: 'No tasks yet',
                            }),
                      }),
                    ],
                  },
                  'overflow-tablet-column'
                ),
            ],
          })
        }
        function Board(props) {
          const modifiedProps = {
            ...props,
            onSelectTask: (colIndex, taskIndex) => {
              props.onSelectTask(colIndex, taskIndex)
            },
          }
          return (
            react.useEffect(() => {
              const style = document.createElement('style')
              return (
                (style.textContent =
                  '\n      .desktop-board { display: none; }\n      .mobile-board { display: block; }\n      .tablet-board { display: none; }\n\n      @media (min-width: 768px) {\n        .desktop-board { display: none; }\n        .mobile-board { display: none; }\n        .tablet-board { display: block; }\n      }\n\n      @media (min-width: 1280px) {\n        .desktop-board { display: block; }\n        .mobile-board { display: none; }\n        .tablet-board { display: none; }\n      }\n    '),
                document.head.appendChild(style),
                () => {
                  document.head.removeChild(style)
                }
              )
            }, []),
            (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
              children: [
                (0, jsx_runtime.jsx)('div', {
                  className: 'desktop-board',
                  children: (0, jsx_runtime.jsx)(DesktopBoard, {
                    ...modifiedProps,
                  }),
                }),
                (0, jsx_runtime.jsx)('div', {
                  className: 'mobile-board',
                  children: (0, jsx_runtime.jsx)(MobileBoard, {
                    ...modifiedProps,
                  }),
                }),
                (0, jsx_runtime.jsx)('div', {
                  className: 'tablet-board',
                  children: (0, jsx_runtime.jsx)(TabletBoard, {
                    ...modifiedProps,
                  }),
                }),
              ],
            })
          )
        }
        ;((TabletBoard.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'TabletBoard',
          props: {
            columns: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  title: string\n  description: string\n  tasks: Task[]\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'title',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'tasks',
                          value: {
                            name: 'Array',
                            elements: [
                              {
                                name: 'signature',
                                type: 'object',
                                raw: '{\n  _id: string\n  /** The parent company ID or other domain-specific reference. */\n  companyId: string\n  title: string\n  description: string\n  /** If severity is linked to a separate record, store it here. */\n  severityId: string\n  /** The main status. */\n  statusId: string\n  /** The sub-status. */\n  substatusId: string\n  /** The scheduling queue ID. */\n  schedulingQueueId: string\n  /** Topics array, each referencing a topic ID. */\n  topicIds: string[]\n  /** Comments array, referencing comment IDs. */\n  commentIds: string[]\n  /** Employee IDs assigned to the task. */\n  employeeIds: string[]\n  /** Knowledgebase article IDs. */\n  articleIds: string[]\n  /** The "customer" ID if you have one. */\n  customerId: string\n  /** Timestamps. */\n  createdAt: Date\n  closedAt: Date\n  updatedAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n  /**\n   * If you want to store the actual comments (rather than just commentIds),\n   * so ShowTask can display them directly.\n   */\n  comments: Comment[]\n  /** If you store the "customer assigned" label as text (e.g. "Bobbie Sue"). */\n  customerAssigned: string\n  /** Severity label text (e.g. "Critical"). */\n  severity: string\n  /** Scheduling Queue text (e.g. "Technologies Unlimited"). */\n  schedulingQueue: string\n  /** High-level status text (e.g. "Open"). */\n  status: string\n  /** Sub-status text (e.g. "In Progress"). */\n  subStatus: string\n  /**\n   * If you want to store the actual topic strings (e.g. ["Technical Support"]).\n   * This can be used in addition to or instead of topicIds.\n   */\n  topicLabels: string[]\n  /**\n   * If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\n   * This can be used in addition to or instead of articleIds.\n   */\n  kbArticles: string[]\n  /** A string representing the assigned team member (e.g. "Matthew Goluba"). */\n  teamMember: string\n  /** If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST"). */\n  nextActionDate: string\n}',
                                signature: {
                                  properties: [
                                    {
                                      key: '_id',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'companyId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'The parent company ID or other domain-specific reference.',
                                    },
                                    {
                                      key: 'title',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'description',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'severityId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If severity is linked to a separate record, store it here.',
                                    },
                                    {
                                      key: 'statusId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The main status.',
                                    },
                                    {
                                      key: 'substatusId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The sub-status.',
                                    },
                                    {
                                      key: 'schedulingQueueId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The scheduling queue ID.',
                                    },
                                    {
                                      key: 'topicIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Topics array, each referencing a topic ID.',
                                    },
                                    {
                                      key: 'commentIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Comments array, referencing comment IDs.',
                                    },
                                    {
                                      key: 'employeeIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Employee IDs assigned to the task.',
                                    },
                                    {
                                      key: 'articleIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description: 'Knowledgebase article IDs.',
                                    },
                                    {
                                      key: 'customerId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'The "customer" ID if you have one.',
                                    },
                                    {
                                      key: 'createdAt',
                                      value: { name: 'Date', required: !0 },
                                      description: 'Timestamps.',
                                    },
                                    {
                                      key: 'closedAt',
                                      value: { name: 'Date', required: !0 },
                                    },
                                    {
                                      key: 'updatedAt',
                                      value: { name: 'Date', required: !0 },
                                    },
                                    {
                                      key: 'createdBy',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'editHistory',
                                      value: {
                                        name: 'Array',
                                        elements: [
                                          {
                                            name: 'signature',
                                            type: 'object',
                                            raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                            signature: {
                                              properties: [
                                                {
                                                  key: '_id',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'editedBy',
                                                  value: {
                                                    name: 'string',
                                                    required: !1,
                                                  },
                                                },
                                                {
                                                  key: 'editedAt',
                                                  value: {
                                                    name: 'Date',
                                                    required: !1,
                                                  },
                                                },
                                                {
                                                  key: 'text',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'isOriginal',
                                                  value: {
                                                    name: 'boolean',
                                                    required: !0,
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                        raw: 'CommentEditHistory[]',
                                        required: !0,
                                      },
                                    },
                                    {
                                      key: 'comments',
                                      value: {
                                        name: 'Array',
                                        elements: [
                                          {
                                            name: 'signature',
                                            type: 'object',
                                            raw: '{\n  _id: string\n  text: string\n  createdAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n}',
                                            signature: {
                                              properties: [
                                                {
                                                  key: '_id',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'text',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'createdAt',
                                                  value: {
                                                    name: 'Date',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'createdBy',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'editHistory',
                                                  value: {
                                                    name: 'Array',
                                                    elements: [
                                                      {
                                                        name: 'signature',
                                                        type: 'object',
                                                        raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                                        signature: {
                                                          properties: [
                                                            {
                                                              key: '_id',
                                                              value: {
                                                                name: 'string',
                                                                required: !0,
                                                              },
                                                            },
                                                            {
                                                              key: 'editedBy',
                                                              value: {
                                                                name: 'string',
                                                                required: !1,
                                                              },
                                                            },
                                                            {
                                                              key: 'editedAt',
                                                              value: {
                                                                name: 'Date',
                                                                required: !1,
                                                              },
                                                            },
                                                            {
                                                              key: 'text',
                                                              value: {
                                                                name: 'string',
                                                                required: !0,
                                                              },
                                                            },
                                                            {
                                                              key: 'isOriginal',
                                                              value: {
                                                                name: 'boolean',
                                                                required: !0,
                                                              },
                                                            },
                                                          ],
                                                        },
                                                      },
                                                    ],
                                                    raw: 'CommentEditHistory[]',
                                                    required: !0,
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                        raw: 'Comment[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store the actual comments (rather than just commentIds),\nso ShowTask can display them directly.',
                                    },
                                    {
                                      key: 'customerAssigned',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If you store the "customer assigned" label as text (e.g. "Bobbie Sue").',
                                    },
                                    {
                                      key: 'severity',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Severity label text (e.g. "Critical").',
                                    },
                                    {
                                      key: 'schedulingQueue',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Scheduling Queue text (e.g. "Technologies Unlimited").',
                                    },
                                    {
                                      key: 'status',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'High-level status text (e.g. "Open").',
                                    },
                                    {
                                      key: 'subStatus',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Sub-status text (e.g. "In Progress").',
                                    },
                                    {
                                      key: 'topicLabels',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store the actual topic strings (e.g. ["Technical Support"]).\nThis can be used in addition to or instead of topicIds.',
                                    },
                                    {
                                      key: 'kbArticles',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\nThis can be used in addition to or instead of articleIds.',
                                    },
                                    {
                                      key: 'teamMember',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'A string representing the assigned team member (e.g. "Matthew Goluba").',
                                    },
                                    {
                                      key: 'nextActionDate',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST").',
                                    },
                                  ],
                                },
                              },
                            ],
                            raw: 'Task[]',
                            required: !0,
                          },
                        },
                      ],
                    },
                  },
                ],
                raw: 'ColumnData[]',
              },
              description: '',
            },
            overflowColumns: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  title: string\n  description: string\n  tasks: Task[]\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'title',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'tasks',
                          value: {
                            name: 'Array',
                            elements: [
                              {
                                name: 'signature',
                                type: 'object',
                                raw: '{\n  _id: string\n  /** The parent company ID or other domain-specific reference. */\n  companyId: string\n  title: string\n  description: string\n  /** If severity is linked to a separate record, store it here. */\n  severityId: string\n  /** The main status. */\n  statusId: string\n  /** The sub-status. */\n  substatusId: string\n  /** The scheduling queue ID. */\n  schedulingQueueId: string\n  /** Topics array, each referencing a topic ID. */\n  topicIds: string[]\n  /** Comments array, referencing comment IDs. */\n  commentIds: string[]\n  /** Employee IDs assigned to the task. */\n  employeeIds: string[]\n  /** Knowledgebase article IDs. */\n  articleIds: string[]\n  /** The "customer" ID if you have one. */\n  customerId: string\n  /** Timestamps. */\n  createdAt: Date\n  closedAt: Date\n  updatedAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n  /**\n   * If you want to store the actual comments (rather than just commentIds),\n   * so ShowTask can display them directly.\n   */\n  comments: Comment[]\n  /** If you store the "customer assigned" label as text (e.g. "Bobbie Sue"). */\n  customerAssigned: string\n  /** Severity label text (e.g. "Critical"). */\n  severity: string\n  /** Scheduling Queue text (e.g. "Technologies Unlimited"). */\n  schedulingQueue: string\n  /** High-level status text (e.g. "Open"). */\n  status: string\n  /** Sub-status text (e.g. "In Progress"). */\n  subStatus: string\n  /**\n   * If you want to store the actual topic strings (e.g. ["Technical Support"]).\n   * This can be used in addition to or instead of topicIds.\n   */\n  topicLabels: string[]\n  /**\n   * If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\n   * This can be used in addition to or instead of articleIds.\n   */\n  kbArticles: string[]\n  /** A string representing the assigned team member (e.g. "Matthew Goluba"). */\n  teamMember: string\n  /** If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST"). */\n  nextActionDate: string\n}',
                                signature: {
                                  properties: [
                                    {
                                      key: '_id',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'companyId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'The parent company ID or other domain-specific reference.',
                                    },
                                    {
                                      key: 'title',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'description',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'severityId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If severity is linked to a separate record, store it here.',
                                    },
                                    {
                                      key: 'statusId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The main status.',
                                    },
                                    {
                                      key: 'substatusId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The sub-status.',
                                    },
                                    {
                                      key: 'schedulingQueueId',
                                      value: { name: 'string', required: !0 },
                                      description: 'The scheduling queue ID.',
                                    },
                                    {
                                      key: 'topicIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Topics array, each referencing a topic ID.',
                                    },
                                    {
                                      key: 'commentIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Comments array, referencing comment IDs.',
                                    },
                                    {
                                      key: 'employeeIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'Employee IDs assigned to the task.',
                                    },
                                    {
                                      key: 'articleIds',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description: 'Knowledgebase article IDs.',
                                    },
                                    {
                                      key: 'customerId',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'The "customer" ID if you have one.',
                                    },
                                    {
                                      key: 'createdAt',
                                      value: { name: 'Date', required: !0 },
                                      description: 'Timestamps.',
                                    },
                                    {
                                      key: 'closedAt',
                                      value: { name: 'Date', required: !0 },
                                    },
                                    {
                                      key: 'updatedAt',
                                      value: { name: 'Date', required: !0 },
                                    },
                                    {
                                      key: 'createdBy',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'editHistory',
                                      value: {
                                        name: 'Array',
                                        elements: [
                                          {
                                            name: 'signature',
                                            type: 'object',
                                            raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                            signature: {
                                              properties: [
                                                {
                                                  key: '_id',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'editedBy',
                                                  value: {
                                                    name: 'string',
                                                    required: !1,
                                                  },
                                                },
                                                {
                                                  key: 'editedAt',
                                                  value: {
                                                    name: 'Date',
                                                    required: !1,
                                                  },
                                                },
                                                {
                                                  key: 'text',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'isOriginal',
                                                  value: {
                                                    name: 'boolean',
                                                    required: !0,
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                        raw: 'CommentEditHistory[]',
                                        required: !0,
                                      },
                                    },
                                    {
                                      key: 'comments',
                                      value: {
                                        name: 'Array',
                                        elements: [
                                          {
                                            name: 'signature',
                                            type: 'object',
                                            raw: '{\n  _id: string\n  text: string\n  createdAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n}',
                                            signature: {
                                              properties: [
                                                {
                                                  key: '_id',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'text',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'createdAt',
                                                  value: {
                                                    name: 'Date',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'createdBy',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'editHistory',
                                                  value: {
                                                    name: 'Array',
                                                    elements: [
                                                      {
                                                        name: 'signature',
                                                        type: 'object',
                                                        raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                                        signature: {
                                                          properties: [
                                                            {
                                                              key: '_id',
                                                              value: {
                                                                name: 'string',
                                                                required: !0,
                                                              },
                                                            },
                                                            {
                                                              key: 'editedBy',
                                                              value: {
                                                                name: 'string',
                                                                required: !1,
                                                              },
                                                            },
                                                            {
                                                              key: 'editedAt',
                                                              value: {
                                                                name: 'Date',
                                                                required: !1,
                                                              },
                                                            },
                                                            {
                                                              key: 'text',
                                                              value: {
                                                                name: 'string',
                                                                required: !0,
                                                              },
                                                            },
                                                            {
                                                              key: 'isOriginal',
                                                              value: {
                                                                name: 'boolean',
                                                                required: !0,
                                                              },
                                                            },
                                                          ],
                                                        },
                                                      },
                                                    ],
                                                    raw: 'CommentEditHistory[]',
                                                    required: !0,
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                        raw: 'Comment[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store the actual comments (rather than just commentIds),\nso ShowTask can display them directly.',
                                    },
                                    {
                                      key: 'customerAssigned',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If you store the "customer assigned" label as text (e.g. "Bobbie Sue").',
                                    },
                                    {
                                      key: 'severity',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Severity label text (e.g. "Critical").',
                                    },
                                    {
                                      key: 'schedulingQueue',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Scheduling Queue text (e.g. "Technologies Unlimited").',
                                    },
                                    {
                                      key: 'status',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'High-level status text (e.g. "Open").',
                                    },
                                    {
                                      key: 'subStatus',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'Sub-status text (e.g. "In Progress").',
                                    },
                                    {
                                      key: 'topicLabels',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store the actual topic strings (e.g. ["Technical Support"]).\nThis can be used in addition to or instead of topicIds.',
                                    },
                                    {
                                      key: 'kbArticles',
                                      value: {
                                        name: 'Array',
                                        elements: [{ name: 'string' }],
                                        raw: 'string[]',
                                        required: !0,
                                      },
                                      description:
                                        'If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\nThis can be used in addition to or instead of articleIds.',
                                    },
                                    {
                                      key: 'teamMember',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'A string representing the assigned team member (e.g. "Matthew Goluba").',
                                    },
                                    {
                                      key: 'nextActionDate',
                                      value: { name: 'string', required: !0 },
                                      description:
                                        'If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST").',
                                    },
                                  ],
                                },
                              },
                            ],
                            raw: 'Task[]',
                            required: !0,
                          },
                        },
                      ],
                    },
                  },
                ],
                raw: 'ColumnData[]',
              },
              description: '',
            },
            selectedOverflowColumnId: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            onChangeSelectedOverflowColumn: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(colId: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'colId' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            selectedTask: {
              required: !0,
              tsType: {
                name: 'union',
                raw: '{ colIndex: number; taskIndex: number } | null',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{ colIndex: number; taskIndex: number }',
                    signature: {
                      properties: [
                        {
                          key: 'colIndex',
                          value: { name: 'number', required: !0 },
                        },
                        {
                          key: 'taskIndex',
                          value: { name: 'number', required: !0 },
                        },
                      ],
                    },
                  },
                  { name: 'null' },
                ],
              },
              description: '',
            },
            onSelectTask: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(colIndex: number, taskIndex: number) => void',
                signature: {
                  arguments: [
                    { type: { name: 'number' }, name: 'colIndex' },
                    { type: { name: 'number' }, name: 'taskIndex' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onColumnDragStart: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(e: React.DragEvent, columnIndex: number) => void',
                signature: {
                  arguments: [
                    {
                      type: { name: 'ReactDragEvent', raw: 'React.DragEvent' },
                      name: 'e',
                    },
                    { type: { name: 'number' }, name: 'columnIndex' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onColumnDragOver: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(e: React.DragEvent, columnIndex: number) => void',
                signature: {
                  arguments: [
                    {
                      type: { name: 'ReactDragEvent', raw: 'React.DragEvent' },
                      name: 'e',
                    },
                    { type: { name: 'number' }, name: 'columnIndex' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onColumnDrop: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(e: React.DragEvent, columnIndex: number) => void',
                signature: {
                  arguments: [
                    {
                      type: { name: 'ReactDragEvent', raw: 'React.DragEvent' },
                      name: 'e',
                    },
                    { type: { name: 'number' }, name: 'columnIndex' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'ProjectBoardStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
            sacredtheme: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'Sacred theme flag for styling',
              defaultValue: { value: 'false', computed: !1 },
            },
          },
        }),
          (Board.__docgenInfo = {
            description: '',
            methods: [],
            displayName: 'Board',
            props: {
              columns: {
                required: !0,
                tsType: {
                  name: 'Array',
                  elements: [
                    {
                      name: 'signature',
                      type: 'object',
                      raw: '{\n  _id: string\n  title: string\n  description: string\n  tasks: Task[]\n}',
                      signature: {
                        properties: [
                          {
                            key: '_id',
                            value: { name: 'string', required: !0 },
                          },
                          {
                            key: 'title',
                            value: { name: 'string', required: !0 },
                          },
                          {
                            key: 'description',
                            value: { name: 'string', required: !0 },
                          },
                          {
                            key: 'tasks',
                            value: {
                              name: 'Array',
                              elements: [
                                {
                                  name: 'signature',
                                  type: 'object',
                                  raw: '{\n  _id: string\n  /** The parent company ID or other domain-specific reference. */\n  companyId: string\n  title: string\n  description: string\n  /** If severity is linked to a separate record, store it here. */\n  severityId: string\n  /** The main status. */\n  statusId: string\n  /** The sub-status. */\n  substatusId: string\n  /** The scheduling queue ID. */\n  schedulingQueueId: string\n  /** Topics array, each referencing a topic ID. */\n  topicIds: string[]\n  /** Comments array, referencing comment IDs. */\n  commentIds: string[]\n  /** Employee IDs assigned to the task. */\n  employeeIds: string[]\n  /** Knowledgebase article IDs. */\n  articleIds: string[]\n  /** The "customer" ID if you have one. */\n  customerId: string\n  /** Timestamps. */\n  createdAt: Date\n  closedAt: Date\n  updatedAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n  /**\n   * If you want to store the actual comments (rather than just commentIds),\n   * so ShowTask can display them directly.\n   */\n  comments: Comment[]\n  /** If you store the "customer assigned" label as text (e.g. "Bobbie Sue"). */\n  customerAssigned: string\n  /** Severity label text (e.g. "Critical"). */\n  severity: string\n  /** Scheduling Queue text (e.g. "Technologies Unlimited"). */\n  schedulingQueue: string\n  /** High-level status text (e.g. "Open"). */\n  status: string\n  /** Sub-status text (e.g. "In Progress"). */\n  subStatus: string\n  /**\n   * If you want to store the actual topic strings (e.g. ["Technical Support"]).\n   * This can be used in addition to or instead of topicIds.\n   */\n  topicLabels: string[]\n  /**\n   * If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\n   * This can be used in addition to or instead of articleIds.\n   */\n  kbArticles: string[]\n  /** A string representing the assigned team member (e.g. "Matthew Goluba"). */\n  teamMember: string\n  /** If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST"). */\n  nextActionDate: string\n}',
                                  signature: {
                                    properties: [
                                      {
                                        key: '_id',
                                        value: { name: 'string', required: !0 },
                                      },
                                      {
                                        key: 'companyId',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'The parent company ID or other domain-specific reference.',
                                      },
                                      {
                                        key: 'title',
                                        value: { name: 'string', required: !0 },
                                      },
                                      {
                                        key: 'description',
                                        value: { name: 'string', required: !0 },
                                      },
                                      {
                                        key: 'severityId',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'If severity is linked to a separate record, store it here.',
                                      },
                                      {
                                        key: 'statusId',
                                        value: { name: 'string', required: !0 },
                                        description: 'The main status.',
                                      },
                                      {
                                        key: 'substatusId',
                                        value: { name: 'string', required: !0 },
                                        description: 'The sub-status.',
                                      },
                                      {
                                        key: 'schedulingQueueId',
                                        value: { name: 'string', required: !0 },
                                        description: 'The scheduling queue ID.',
                                      },
                                      {
                                        key: 'topicIds',
                                        value: {
                                          name: 'Array',
                                          elements: [{ name: 'string' }],
                                          raw: 'string[]',
                                          required: !0,
                                        },
                                        description:
                                          'Topics array, each referencing a topic ID.',
                                      },
                                      {
                                        key: 'commentIds',
                                        value: {
                                          name: 'Array',
                                          elements: [{ name: 'string' }],
                                          raw: 'string[]',
                                          required: !0,
                                        },
                                        description:
                                          'Comments array, referencing comment IDs.',
                                      },
                                      {
                                        key: 'employeeIds',
                                        value: {
                                          name: 'Array',
                                          elements: [{ name: 'string' }],
                                          raw: 'string[]',
                                          required: !0,
                                        },
                                        description:
                                          'Employee IDs assigned to the task.',
                                      },
                                      {
                                        key: 'articleIds',
                                        value: {
                                          name: 'Array',
                                          elements: [{ name: 'string' }],
                                          raw: 'string[]',
                                          required: !0,
                                        },
                                        description:
                                          'Knowledgebase article IDs.',
                                      },
                                      {
                                        key: 'customerId',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'The "customer" ID if you have one.',
                                      },
                                      {
                                        key: 'createdAt',
                                        value: { name: 'Date', required: !0 },
                                        description: 'Timestamps.',
                                      },
                                      {
                                        key: 'closedAt',
                                        value: { name: 'Date', required: !0 },
                                      },
                                      {
                                        key: 'updatedAt',
                                        value: { name: 'Date', required: !0 },
                                      },
                                      {
                                        key: 'createdBy',
                                        value: { name: 'string', required: !0 },
                                      },
                                      {
                                        key: 'editHistory',
                                        value: {
                                          name: 'Array',
                                          elements: [
                                            {
                                              name: 'signature',
                                              type: 'object',
                                              raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                              signature: {
                                                properties: [
                                                  {
                                                    key: '_id',
                                                    value: {
                                                      name: 'string',
                                                      required: !0,
                                                    },
                                                  },
                                                  {
                                                    key: 'editedBy',
                                                    value: {
                                                      name: 'string',
                                                      required: !1,
                                                    },
                                                  },
                                                  {
                                                    key: 'editedAt',
                                                    value: {
                                                      name: 'Date',
                                                      required: !1,
                                                    },
                                                  },
                                                  {
                                                    key: 'text',
                                                    value: {
                                                      name: 'string',
                                                      required: !0,
                                                    },
                                                  },
                                                  {
                                                    key: 'isOriginal',
                                                    value: {
                                                      name: 'boolean',
                                                      required: !0,
                                                    },
                                                  },
                                                ],
                                              },
                                            },
                                          ],
                                          raw: 'CommentEditHistory[]',
                                          required: !0,
                                        },
                                      },
                                      {
                                        key: 'comments',
                                        value: {
                                          name: 'Array',
                                          elements: [
                                            {
                                              name: 'signature',
                                              type: 'object',
                                              raw: '{\n  _id: string\n  text: string\n  createdAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n}',
                                              signature: {
                                                properties: [
                                                  {
                                                    key: '_id',
                                                    value: {
                                                      name: 'string',
                                                      required: !0,
                                                    },
                                                  },
                                                  {
                                                    key: 'text',
                                                    value: {
                                                      name: 'string',
                                                      required: !0,
                                                    },
                                                  },
                                                  {
                                                    key: 'createdAt',
                                                    value: {
                                                      name: 'Date',
                                                      required: !0,
                                                    },
                                                  },
                                                  {
                                                    key: 'createdBy',
                                                    value: {
                                                      name: 'string',
                                                      required: !0,
                                                    },
                                                  },
                                                  {
                                                    key: 'editHistory',
                                                    value: {
                                                      name: 'Array',
                                                      elements: [
                                                        {
                                                          name: 'signature',
                                                          type: 'object',
                                                          raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                                          signature: {
                                                            properties: [
                                                              {
                                                                key: '_id',
                                                                value: {
                                                                  name: 'string',
                                                                  required: !0,
                                                                },
                                                              },
                                                              {
                                                                key: 'editedBy',
                                                                value: {
                                                                  name: 'string',
                                                                  required: !1,
                                                                },
                                                              },
                                                              {
                                                                key: 'editedAt',
                                                                value: {
                                                                  name: 'Date',
                                                                  required: !1,
                                                                },
                                                              },
                                                              {
                                                                key: 'text',
                                                                value: {
                                                                  name: 'string',
                                                                  required: !0,
                                                                },
                                                              },
                                                              {
                                                                key: 'isOriginal',
                                                                value: {
                                                                  name: 'boolean',
                                                                  required: !0,
                                                                },
                                                              },
                                                            ],
                                                          },
                                                        },
                                                      ],
                                                      raw: 'CommentEditHistory[]',
                                                      required: !0,
                                                    },
                                                  },
                                                ],
                                              },
                                            },
                                          ],
                                          raw: 'Comment[]',
                                          required: !0,
                                        },
                                        description:
                                          'If you want to store the actual comments (rather than just commentIds),\nso ShowTask can display them directly.',
                                      },
                                      {
                                        key: 'customerAssigned',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'If you store the "customer assigned" label as text (e.g. "Bobbie Sue").',
                                      },
                                      {
                                        key: 'severity',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'Severity label text (e.g. "Critical").',
                                      },
                                      {
                                        key: 'schedulingQueue',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'Scheduling Queue text (e.g. "Technologies Unlimited").',
                                      },
                                      {
                                        key: 'status',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'High-level status text (e.g. "Open").',
                                      },
                                      {
                                        key: 'subStatus',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'Sub-status text (e.g. "In Progress").',
                                      },
                                      {
                                        key: 'topicLabels',
                                        value: {
                                          name: 'Array',
                                          elements: [{ name: 'string' }],
                                          raw: 'string[]',
                                          required: !0,
                                        },
                                        description:
                                          'If you want to store the actual topic strings (e.g. ["Technical Support"]).\nThis can be used in addition to or instead of topicIds.',
                                      },
                                      {
                                        key: 'kbArticles',
                                        value: {
                                          name: 'Array',
                                          elements: [{ name: 'string' }],
                                          raw: 'string[]',
                                          required: !0,
                                        },
                                        description:
                                          'If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\nThis can be used in addition to or instead of articleIds.',
                                      },
                                      {
                                        key: 'teamMember',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'A string representing the assigned team member (e.g. "Matthew Goluba").',
                                      },
                                      {
                                        key: 'nextActionDate',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST").',
                                      },
                                    ],
                                  },
                                },
                              ],
                              raw: 'Task[]',
                              required: !0,
                            },
                          },
                        ],
                      },
                    },
                  ],
                  raw: 'ColumnData[]',
                },
                description: '',
              },
              overflowColumns: {
                required: !1,
                tsType: {
                  name: 'Array',
                  elements: [
                    {
                      name: 'signature',
                      type: 'object',
                      raw: '{\n  _id: string\n  title: string\n  description: string\n  tasks: Task[]\n}',
                      signature: {
                        properties: [
                          {
                            key: '_id',
                            value: { name: 'string', required: !0 },
                          },
                          {
                            key: 'title',
                            value: { name: 'string', required: !0 },
                          },
                          {
                            key: 'description',
                            value: { name: 'string', required: !0 },
                          },
                          {
                            key: 'tasks',
                            value: {
                              name: 'Array',
                              elements: [
                                {
                                  name: 'signature',
                                  type: 'object',
                                  raw: '{\n  _id: string\n  /** The parent company ID or other domain-specific reference. */\n  companyId: string\n  title: string\n  description: string\n  /** If severity is linked to a separate record, store it here. */\n  severityId: string\n  /** The main status. */\n  statusId: string\n  /** The sub-status. */\n  substatusId: string\n  /** The scheduling queue ID. */\n  schedulingQueueId: string\n  /** Topics array, each referencing a topic ID. */\n  topicIds: string[]\n  /** Comments array, referencing comment IDs. */\n  commentIds: string[]\n  /** Employee IDs assigned to the task. */\n  employeeIds: string[]\n  /** Knowledgebase article IDs. */\n  articleIds: string[]\n  /** The "customer" ID if you have one. */\n  customerId: string\n  /** Timestamps. */\n  createdAt: Date\n  closedAt: Date\n  updatedAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n  /**\n   * If you want to store the actual comments (rather than just commentIds),\n   * so ShowTask can display them directly.\n   */\n  comments: Comment[]\n  /** If you store the "customer assigned" label as text (e.g. "Bobbie Sue"). */\n  customerAssigned: string\n  /** Severity label text (e.g. "Critical"). */\n  severity: string\n  /** Scheduling Queue text (e.g. "Technologies Unlimited"). */\n  schedulingQueue: string\n  /** High-level status text (e.g. "Open"). */\n  status: string\n  /** Sub-status text (e.g. "In Progress"). */\n  subStatus: string\n  /**\n   * If you want to store the actual topic strings (e.g. ["Technical Support"]).\n   * This can be used in addition to or instead of topicIds.\n   */\n  topicLabels: string[]\n  /**\n   * If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\n   * This can be used in addition to or instead of articleIds.\n   */\n  kbArticles: string[]\n  /** A string representing the assigned team member (e.g. "Matthew Goluba"). */\n  teamMember: string\n  /** If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST"). */\n  nextActionDate: string\n}',
                                  signature: {
                                    properties: [
                                      {
                                        key: '_id',
                                        value: { name: 'string', required: !0 },
                                      },
                                      {
                                        key: 'companyId',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'The parent company ID or other domain-specific reference.',
                                      },
                                      {
                                        key: 'title',
                                        value: { name: 'string', required: !0 },
                                      },
                                      {
                                        key: 'description',
                                        value: { name: 'string', required: !0 },
                                      },
                                      {
                                        key: 'severityId',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'If severity is linked to a separate record, store it here.',
                                      },
                                      {
                                        key: 'statusId',
                                        value: { name: 'string', required: !0 },
                                        description: 'The main status.',
                                      },
                                      {
                                        key: 'substatusId',
                                        value: { name: 'string', required: !0 },
                                        description: 'The sub-status.',
                                      },
                                      {
                                        key: 'schedulingQueueId',
                                        value: { name: 'string', required: !0 },
                                        description: 'The scheduling queue ID.',
                                      },
                                      {
                                        key: 'topicIds',
                                        value: {
                                          name: 'Array',
                                          elements: [{ name: 'string' }],
                                          raw: 'string[]',
                                          required: !0,
                                        },
                                        description:
                                          'Topics array, each referencing a topic ID.',
                                      },
                                      {
                                        key: 'commentIds',
                                        value: {
                                          name: 'Array',
                                          elements: [{ name: 'string' }],
                                          raw: 'string[]',
                                          required: !0,
                                        },
                                        description:
                                          'Comments array, referencing comment IDs.',
                                      },
                                      {
                                        key: 'employeeIds',
                                        value: {
                                          name: 'Array',
                                          elements: [{ name: 'string' }],
                                          raw: 'string[]',
                                          required: !0,
                                        },
                                        description:
                                          'Employee IDs assigned to the task.',
                                      },
                                      {
                                        key: 'articleIds',
                                        value: {
                                          name: 'Array',
                                          elements: [{ name: 'string' }],
                                          raw: 'string[]',
                                          required: !0,
                                        },
                                        description:
                                          'Knowledgebase article IDs.',
                                      },
                                      {
                                        key: 'customerId',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'The "customer" ID if you have one.',
                                      },
                                      {
                                        key: 'createdAt',
                                        value: { name: 'Date', required: !0 },
                                        description: 'Timestamps.',
                                      },
                                      {
                                        key: 'closedAt',
                                        value: { name: 'Date', required: !0 },
                                      },
                                      {
                                        key: 'updatedAt',
                                        value: { name: 'Date', required: !0 },
                                      },
                                      {
                                        key: 'createdBy',
                                        value: { name: 'string', required: !0 },
                                      },
                                      {
                                        key: 'editHistory',
                                        value: {
                                          name: 'Array',
                                          elements: [
                                            {
                                              name: 'signature',
                                              type: 'object',
                                              raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                              signature: {
                                                properties: [
                                                  {
                                                    key: '_id',
                                                    value: {
                                                      name: 'string',
                                                      required: !0,
                                                    },
                                                  },
                                                  {
                                                    key: 'editedBy',
                                                    value: {
                                                      name: 'string',
                                                      required: !1,
                                                    },
                                                  },
                                                  {
                                                    key: 'editedAt',
                                                    value: {
                                                      name: 'Date',
                                                      required: !1,
                                                    },
                                                  },
                                                  {
                                                    key: 'text',
                                                    value: {
                                                      name: 'string',
                                                      required: !0,
                                                    },
                                                  },
                                                  {
                                                    key: 'isOriginal',
                                                    value: {
                                                      name: 'boolean',
                                                      required: !0,
                                                    },
                                                  },
                                                ],
                                              },
                                            },
                                          ],
                                          raw: 'CommentEditHistory[]',
                                          required: !0,
                                        },
                                      },
                                      {
                                        key: 'comments',
                                        value: {
                                          name: 'Array',
                                          elements: [
                                            {
                                              name: 'signature',
                                              type: 'object',
                                              raw: '{\n  _id: string\n  text: string\n  createdAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n}',
                                              signature: {
                                                properties: [
                                                  {
                                                    key: '_id',
                                                    value: {
                                                      name: 'string',
                                                      required: !0,
                                                    },
                                                  },
                                                  {
                                                    key: 'text',
                                                    value: {
                                                      name: 'string',
                                                      required: !0,
                                                    },
                                                  },
                                                  {
                                                    key: 'createdAt',
                                                    value: {
                                                      name: 'Date',
                                                      required: !0,
                                                    },
                                                  },
                                                  {
                                                    key: 'createdBy',
                                                    value: {
                                                      name: 'string',
                                                      required: !0,
                                                    },
                                                  },
                                                  {
                                                    key: 'editHistory',
                                                    value: {
                                                      name: 'Array',
                                                      elements: [
                                                        {
                                                          name: 'signature',
                                                          type: 'object',
                                                          raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                                          signature: {
                                                            properties: [
                                                              {
                                                                key: '_id',
                                                                value: {
                                                                  name: 'string',
                                                                  required: !0,
                                                                },
                                                              },
                                                              {
                                                                key: 'editedBy',
                                                                value: {
                                                                  name: 'string',
                                                                  required: !1,
                                                                },
                                                              },
                                                              {
                                                                key: 'editedAt',
                                                                value: {
                                                                  name: 'Date',
                                                                  required: !1,
                                                                },
                                                              },
                                                              {
                                                                key: 'text',
                                                                value: {
                                                                  name: 'string',
                                                                  required: !0,
                                                                },
                                                              },
                                                              {
                                                                key: 'isOriginal',
                                                                value: {
                                                                  name: 'boolean',
                                                                  required: !0,
                                                                },
                                                              },
                                                            ],
                                                          },
                                                        },
                                                      ],
                                                      raw: 'CommentEditHistory[]',
                                                      required: !0,
                                                    },
                                                  },
                                                ],
                                              },
                                            },
                                          ],
                                          raw: 'Comment[]',
                                          required: !0,
                                        },
                                        description:
                                          'If you want to store the actual comments (rather than just commentIds),\nso ShowTask can display them directly.',
                                      },
                                      {
                                        key: 'customerAssigned',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'If you store the "customer assigned" label as text (e.g. "Bobbie Sue").',
                                      },
                                      {
                                        key: 'severity',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'Severity label text (e.g. "Critical").',
                                      },
                                      {
                                        key: 'schedulingQueue',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'Scheduling Queue text (e.g. "Technologies Unlimited").',
                                      },
                                      {
                                        key: 'status',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'High-level status text (e.g. "Open").',
                                      },
                                      {
                                        key: 'subStatus',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'Sub-status text (e.g. "In Progress").',
                                      },
                                      {
                                        key: 'topicLabels',
                                        value: {
                                          name: 'Array',
                                          elements: [{ name: 'string' }],
                                          raw: 'string[]',
                                          required: !0,
                                        },
                                        description:
                                          'If you want to store the actual topic strings (e.g. ["Technical Support"]).\nThis can be used in addition to or instead of topicIds.',
                                      },
                                      {
                                        key: 'kbArticles',
                                        value: {
                                          name: 'Array',
                                          elements: [{ name: 'string' }],
                                          raw: 'string[]',
                                          required: !0,
                                        },
                                        description:
                                          'If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\nThis can be used in addition to or instead of articleIds.',
                                      },
                                      {
                                        key: 'teamMember',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'A string representing the assigned team member (e.g. "Matthew Goluba").',
                                      },
                                      {
                                        key: 'nextActionDate',
                                        value: { name: 'string', required: !0 },
                                        description:
                                          'If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST").',
                                      },
                                    ],
                                  },
                                },
                              ],
                              raw: 'Task[]',
                              required: !0,
                            },
                          },
                        ],
                      },
                    },
                  ],
                  raw: 'ColumnData[]',
                },
                description: '',
              },
              selectedOverflowColumnId: {
                required: !1,
                tsType: { name: 'string' },
                description: '',
              },
              onChangeSelectedOverflowColumn: {
                required: !1,
                tsType: {
                  name: 'signature',
                  type: 'function',
                  raw: '(colId: string) => void',
                  signature: {
                    arguments: [{ type: { name: 'string' }, name: 'colId' }],
                    return: { name: 'void' },
                  },
                },
                description: '',
              },
              selectedTask: {
                required: !0,
                tsType: {
                  name: 'union',
                  raw: '{ colIndex: number; taskIndex: number } | null',
                  elements: [
                    {
                      name: 'signature',
                      type: 'object',
                      raw: '{ colIndex: number; taskIndex: number }',
                      signature: {
                        properties: [
                          {
                            key: 'colIndex',
                            value: { name: 'number', required: !0 },
                          },
                          {
                            key: 'taskIndex',
                            value: { name: 'number', required: !0 },
                          },
                        ],
                      },
                    },
                    { name: 'null' },
                  ],
                },
                description: '',
              },
              onSelectTask: {
                required: !0,
                tsType: {
                  name: 'signature',
                  type: 'function',
                  raw: '(colIndex: number, taskIndex: number) => void',
                  signature: {
                    arguments: [
                      { type: { name: 'number' }, name: 'colIndex' },
                      { type: { name: 'number' }, name: 'taskIndex' },
                    ],
                    return: { name: 'void' },
                  },
                },
                description: '',
              },
              onColumnDragStart: {
                required: !0,
                tsType: {
                  name: 'signature',
                  type: 'function',
                  raw: '(e: React.DragEvent, columnIndex: number) => void',
                  signature: {
                    arguments: [
                      {
                        type: {
                          name: 'ReactDragEvent',
                          raw: 'React.DragEvent',
                        },
                        name: 'e',
                      },
                      { type: { name: 'number' }, name: 'columnIndex' },
                    ],
                    return: { name: 'void' },
                  },
                },
                description: '',
              },
              onColumnDragOver: {
                required: !0,
                tsType: {
                  name: 'signature',
                  type: 'function',
                  raw: '(e: React.DragEvent, columnIndex: number) => void',
                  signature: {
                    arguments: [
                      {
                        type: {
                          name: 'ReactDragEvent',
                          raw: 'React.DragEvent',
                        },
                        name: 'e',
                      },
                      { type: { name: 'number' }, name: 'columnIndex' },
                    ],
                    return: { name: 'void' },
                  },
                },
                description: '',
              },
              onColumnDrop: {
                required: !0,
                tsType: {
                  name: 'signature',
                  type: 'function',
                  raw: '(e: React.DragEvent, columnIndex: number) => void',
                  signature: {
                    arguments: [
                      {
                        type: {
                          name: 'ReactDragEvent',
                          raw: 'React.DragEvent',
                        },
                        name: 'e',
                      },
                      { type: { name: 'number' }, name: 'columnIndex' },
                    ],
                    return: { name: 'void' },
                  },
                },
                description: '',
              },
              styles: {
                required: !1,
                tsType: { name: 'ProjectBoardStyles' },
                description:
                  'Comprehensive styling options including theme, custom colors, and layout properties.',
              },
              sacredtheme: {
                required: !1,
                tsType: { name: 'boolean' },
                description: 'Sacred theme flag for styling',
              },
            },
          }))
        var theme = __webpack_require__('./src/theme/index.ts')
        function ProjectBoardContent({
          variant,
          boardType,
          columns,
          tasks,
          rawStatuses,
          rawSubStatuses,
          rawTopics,
          rawQueues,
          rawArticles,
          rawCustomers,
          rawEmployees,
          rawCompanies,
          rawSeverityLevels,
          onEdit,
          onDelete,
          onDuplicate,
          onEditComment,
          onAdd,
          onComment,
          onRevisionHistory,
          currentUser,
          customerId,
          companyId,
          preferDropdown,
          styles,
        }) {
          const [columnState, setColumnState] = (0, esm_react.fp)(columnsAtom),
            mergedColumns = (0, react.useMemo)(
              () =>
                (function mergeColumnsAndTasks(columns, tasks, boardType) {
                  return columns.map(col => {
                    const colId = col._id,
                      matchingTasks = tasks.filter(task => {
                        switch (boardType) {
                          case 'severityLevel':
                            return task.severityId === colId
                          case 'status':
                            return task.statusId === colId
                          case 'subStatus':
                            return task.substatusId === colId
                          case 'topic':
                            return task.topicIds.includes(colId)
                          default:
                            return !1
                        }
                      })
                    return {
                      _id: col._id,
                      title: col.title,
                      description: col.description,
                      tasks: matchingTasks,
                    }
                  })
                })(columns, tasks, boardType),
              [columns, tasks, boardType]
            ),
            isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            isDisabled = null == styles ? void 0 : styles.disabled,
            computedStyles = (0, react.useMemo)(
              () => (0, theme.Op)(styles, isDisabled),
              [styles, isDisabled]
            )
          ;(0, react.useEffect)(() => {
            setColumnState(mergedColumns)
          }, [mergedColumns, setColumnState])
          const [selectedTask, setSelectedTask] = (0, react.useState)(null)
          const allTasks = (0, react.useMemo)(
              () => columnState.flatMap(col => col.tasks),
              [columnState]
            ),
            { handleColumnDragStart, handleColumnDragOver, handleColumnDrop } =
              (function useColumnDragAndDrop(columnState, setColumnState) {
                const [dragItem, setDragItem] = react.useState(null)
                return {
                  handleColumnDragStart: function handleColumnDragStart(
                    e,
                    columnIndex
                  ) {
                    ;((e.dataTransfer.effectAllowed = 'move'),
                      setDragItem({ type: 'column', columnIndex }))
                  },
                  handleColumnDragOver: function handleColumnDragOver(e) {
                    ;(e.preventDefault(), (e.dataTransfer.dropEffect = 'move'))
                  },
                  handleColumnDrop: function handleColumnDrop(
                    e,
                    dropColumnIndex
                  ) {
                    if (
                      (e.preventDefault(),
                      !dragItem || 'column' !== dragItem.type)
                    )
                      return void setDragItem(null)
                    const newCols = (function reorder(
                      list,
                      startIndex,
                      endIndex
                    ) {
                      const result = [...list],
                        [removed] = result.splice(startIndex, 1)
                      return (result.splice(endIndex, 0, removed), result)
                    })(columnState, dragItem.columnIndex, dropColumnIndex)
                    ;(setColumnState(newCols), setDragItem(null))
                  },
                }
              })(columnState, setColumnState),
            [addTaskOpen, setAddTaskOpen] = (0, react.useState)(!1),
            [showTaskOpen, setShowTaskOpen] = (0, react.useState)('-1'),
            handleAddTask = (0, react.useCallback)(
              newTask => {
                if (0 === columnState.length)
                  return (onAdd(newTask), void setAddTaskOpen(!1))
                const newCols = [...columnState],
                  colId = newCols[0]._id,
                  typedTask = {
                    _id: String(Date.now()),
                    ...newTask,
                    severityId:
                      'severityLevel' === boardType
                        ? colId
                        : newTask.severityId,
                    schedulingQueueId:
                      'status' === boardType
                        ? colId
                        : newTask.schedulingQueueId,
                    statusId: 'status' === boardType ? colId : newTask.statusId,
                    substatusId:
                      'subStatus' === boardType ? colId : newTask.substatusId,
                    topicIds:
                      'topic' === boardType ? [colId] : newTask.topicIds,
                  }
                ;(newCols[0].tasks.push(typedTask),
                  setColumnState(newCols),
                  setAddTaskOpen(!1),
                  onAdd(newTask))
              },
              [columnState, boardType, setColumnState, onAdd]
            ),
            currentShowTask = allTasks.find(t => t._id === showTaskOpen)
          if ('-1' !== showTaskOpen && !currentShowTask)
            throw new Error('ShowTask is open but no task found')
          const showTaskTitle =
              (null == currentShowTask ? void 0 : currentShowTask.title) || '',
            showTaskDescription =
              (null == currentShowTask
                ? void 0
                : currentShowTask.description) || '',
            showTaskCreatedBy =
              (null == currentShowTask ? void 0 : currentShowTask.createdBy) ||
              '',
            showTaskCommentsFixed = (0, react.useMemo)(
              () =>
                currentShowTask
                  ? currentShowTask.comments.map(c => {
                      var _c_createdAt
                      return {
                        _id: c._id,
                        text: c.text,
                        createdAt: new Date(
                          null !== (_c_createdAt = c.createdAt) &&
                          void 0 !== _c_createdAt
                            ? _c_createdAt
                            : Date.now()
                        ),
                        createdBy: c.createdBy,
                        editHistory: c.editHistory.map(eh => ({
                          ...eh,
                          ...(eh.editedAt
                            ? { editedAt: new Date(eh.editedAt) }
                            : {}),
                        })),
                      }
                    })
                  : [],
              [currentShowTask]
            ),
            showTaskCustomerAssigned =
              (null == currentShowTask
                ? void 0
                : currentShowTask.customerAssigned) || '',
            showTaskSeverity =
              (null == currentShowTask ? void 0 : currentShowTask.severity) ||
              '',
            showTaskSchedulingQueue =
              (null == currentShowTask
                ? void 0
                : currentShowTask.schedulingQueue) || '',
            showTaskStatus =
              (null == currentShowTask ? void 0 : currentShowTask.status) || '',
            showTaskSubStatus =
              (null == currentShowTask ? void 0 : currentShowTask.subStatus) ||
              '',
            showTaskTopics =
              (null == currentShowTask
                ? void 0
                : currentShowTask.topicLabels) || [],
            showTaskKBArticles =
              (null == currentShowTask ? void 0 : currentShowTask.kbArticles) ||
              [],
            showTaskTeamMemberAssigned =
              (null == currentShowTask ? void 0 : currentShowTask.teamMember) ||
              '',
            showTaskNextActionDate =
              (null == currentShowTask
                ? void 0
                : currentShowTask.nextActionDate) || '',
            [searchTerm, setSearchTerm] = (0, react.useState)('')
          const filteredColumnState = (0, react.useMemo)(() => {
              const lowerTerm = searchTerm.toLowerCase()
              return columnState.map(col => {
                const filteredTasks = col.tasks.filter(
                  t =>
                    t.title.toLowerCase().includes(lowerTerm) ||
                    t.description.toLowerCase().includes(lowerTerm)
                )
                return { ...col, tasks: filteredTasks }
              })
            }, [columnState, searchTerm]),
            {
              containerRef,
              fittedColumns,
              overflowColumns,
              selectedOverflowColumnId,
              setSelectedOverflowColumnId,
            } = (function useComputeBoardResize({
              columns,
              columnWidth,
              showOverflowDropdown,
            }) {
              const containerRef = (0, react.useRef)(null),
                [fittedColumns, setFittedColumns] = (0, react.useState)([]),
                [overflowColumns, setOverflowColumns] = (0, react.useState)([]),
                [selectedOverflowColumnId, setSelectedOverflowColumnId] = (0,
                react.useState)(''),
                recalcColumns = (0, react.useCallback)(() => {
                  if (!containerRef.current) return
                  const containerWidth = containerRef.current.offsetWidth,
                    overflowReservedWidth = showOverflowDropdown
                      ? columnWidth
                      : 0
                  let usedWidth = 0
                  const canFit = []
                  let theOverflow = []
                  for (let i = 0; i < columns.length; i++) {
                    if (
                      !(
                        usedWidth + columnWidth + overflowReservedWidth <=
                        containerWidth
                      )
                    ) {
                      if (
                        ((theOverflow = columns.slice(i)),
                        theOverflow.length > 0 && canFit.length > 0)
                      ) {
                        const lastFitted = canFit.pop()
                        lastFitted &&
                          (theOverflow = [lastFitted, ...theOverflow])
                      }
                      break
                    }
                    ;(canFit.push(columns[i]), (usedWidth += columnWidth))
                  }
                  ;(setFittedColumns(canFit),
                    setOverflowColumns(theOverflow),
                    theOverflow.length > 0
                      ? theOverflow.some(
                          c => c._id === selectedOverflowColumnId
                        ) || setSelectedOverflowColumnId(theOverflow[0]._id)
                      : '' !== selectedOverflowColumnId &&
                        setSelectedOverflowColumnId(''))
                }, [
                  columns,
                  columnWidth,
                  showOverflowDropdown,
                  selectedOverflowColumnId,
                ])
              return (
                (0, react.useLayoutEffect)(() => {
                  if (!containerRef.current) return
                  const ro = new ResizeObserver(() => {
                    recalcColumns()
                  })
                  return (
                    ro.observe(containerRef.current),
                    () => ro.disconnect()
                  )
                }, [recalcColumns]),
                (0, react.useEffect)(() => {
                  const handleResize = () => recalcColumns()
                  return (
                    window.addEventListener('resize', handleResize),
                    () => window.removeEventListener('resize', handleResize)
                  )
                }, [recalcColumns]),
                (0, react.useEffect)(() => {
                  recalcColumns()
                }, [recalcColumns]),
                {
                  containerRef,
                  fittedColumns,
                  overflowColumns,
                  selectedOverflowColumnId,
                  setSelectedOverflowColumnId,
                }
              )
            })({
              columns: filteredColumnState,
              columnWidth: 300,
              showOverflowDropdown: !0,
            })
          const exactlyOneSelected = null !== selectedTask
          let selectedTaskId = ''
          if (selectedTask) {
            const { colIndex, taskIndex } = selectedTask
            colIndex >= 0 &&
              colIndex < columnState.length &&
              taskIndex >= 0 &&
              taskIndex < columnState[colIndex].tasks.length &&
              (selectedTaskId = columnState[colIndex].tasks[taskIndex]._id)
          }
          const buttons = [
            { text: 'Create Task', onClick: () => setAddTaskOpen(!0) },
            {
              text: 'Show Task',
              onClick: () => {
                exactlyOneSelected &&
                  selectedTaskId &&
                  setShowTaskOpen(selectedTaskId)
              },
              disabled: !exactlyOneSelected || !selectedTaskId,
            },
          ]
          return (0, jsx_runtime.jsxs)('div', {
            ref: containerRef,
            style: computedStyles.container,
            children: [
              isSacredTheme &&
                (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                  children: [
                    (0, jsx_runtime.jsx)('div', {
                      style: computedStyles.glyphPositions.topLeft,
                      children: theme.vR[0],
                    }),
                    (0, jsx_runtime.jsx)('div', {
                      style: computedStyles.glyphPositions.topRight,
                      children: theme.vR[13],
                    }),
                    (0, jsx_runtime.jsx)('div', {
                      style: computedStyles.glyphPositions.bottomLeft,
                      children: theme.vR[5],
                    }),
                    (0, jsx_runtime.jsx)('div', {
                      style: computedStyles.glyphPositions.bottomRight,
                      children: theme.vR[9],
                    }),
                  ],
                }),
              (0, jsx_runtime.jsx)(Toolbar.A, {
                buttons,
                searchbarProps: {
                  label: 'Search...',
                  value: searchTerm,
                  onChange: function handleSearchChange(e) {
                    setSearchTerm(e.target.value)
                  },
                  styles: { theme: null == styles ? void 0 : styles.theme },
                },
                styles: { theme: null == styles ? void 0 : styles.theme },
              }),
              (0, jsx_runtime.jsx)('div', {
                style: computedStyles.toolbarContainer,
                children: (0, jsx_runtime.jsx)(Board, {
                  columns: fittedColumns,
                  overflowColumns,
                  selectedOverflowColumnId,
                  onChangeSelectedOverflowColumn: setSelectedOverflowColumnId,
                  selectedTask,
                  onSelectTask: function handleSelectTask(colIndex, taskIndex) {
                    selectedTask &&
                    selectedTask.colIndex === colIndex &&
                    selectedTask.taskIndex === taskIndex
                      ? setSelectedTask(null)
                      : setSelectedTask({ colIndex, taskIndex })
                  },
                  onColumnDragStart: handleColumnDragStart,
                  onColumnDragOver: handleColumnDragOver,
                  onColumnDrop: handleColumnDrop,
                  styles: { theme: null == styles ? void 0 : styles.theme },
                }),
              }),
              'administrator' === variant &&
                (0, jsx_runtime.jsx)(jsx_runtime.Fragment, {
                  children:
                    !0 === preferDropdown ||
                    (!1 !== preferDropdown &&
                      rawCompanies &&
                      rawCompanies.length > 0)
                      ? (0, jsx_runtime.jsx)(companyDropdown, {
                          open: addTaskOpen,
                          onClose: () => setAddTaskOpen(!1),
                          onAdd: handleAddTask,
                          statuses: rawStatuses,
                          subStatuses: rawSubStatuses,
                          topics: rawTopics,
                          schedulingQueues: rawQueues,
                          knowledgebaseArticles: rawArticles,
                          severityLevels: rawSeverityLevels,
                          createdUserId: currentUser._id,
                          rawCompanies: rawCompanies || [],
                          sacredtheme:
                            'sacred' ===
                            (null == styles ? void 0 : styles.theme),
                        })
                      : (0, jsx_runtime.jsx)(companyProvided, {
                          open: addTaskOpen,
                          onClose: () => setAddTaskOpen(!1),
                          onAdd: handleAddTask,
                          statuses: rawStatuses,
                          subStatuses: rawSubStatuses,
                          topics: rawTopics,
                          schedulingQueues: rawQueues,
                          knowledgebaseArticles: rawArticles,
                          severityLevels: rawSeverityLevels,
                          createdUserId: currentUser._id,
                          companyId: companyId || '',
                          sacredtheme:
                            'sacred' ===
                            (null == styles ? void 0 : styles.theme),
                        }),
                }),
              'company' === variant &&
                (0, jsx_runtime.jsx)(jsx_runtime.Fragment, {
                  children:
                    !0 === preferDropdown ||
                    (!1 !== preferDropdown &&
                      rawCustomers &&
                      rawCustomers.length > 0)
                      ? (0, jsx_runtime.jsx)(customerDropdown, {
                          open: addTaskOpen,
                          onClose: () => setAddTaskOpen(!1),
                          onAdd: handleAddTask,
                          statuses: rawStatuses,
                          subStatuses: rawSubStatuses,
                          topics: rawTopics,
                          schedulingQueues: rawQueues,
                          knowledgebaseArticles: rawArticles,
                          severityLevels: rawSeverityLevels,
                          createdUserId: currentUser._id,
                          rawCustomers: rawCustomers || [],
                          sacredtheme:
                            'sacred' ===
                            (null == styles ? void 0 : styles.theme),
                        })
                      : (0, jsx_runtime.jsx)(customerProvided, {
                          open: addTaskOpen,
                          onClose: () => setAddTaskOpen(!1),
                          onAdd: handleAddTask,
                          statuses: rawStatuses,
                          subStatuses: rawSubStatuses,
                          topics: rawTopics,
                          schedulingQueues: rawQueues,
                          knowledgebaseArticles: rawArticles,
                          severityLevels: rawSeverityLevels,
                          createdUserId: currentUser._id,
                          customerId: customerId || '',
                          sacredtheme:
                            'sacred' ===
                            (null == styles ? void 0 : styles.theme),
                        }),
                }),
              'customer' === variant &&
                (0, jsx_runtime.jsx)(customer, {
                  open: addTaskOpen,
                  onClose: () => setAddTaskOpen(!1),
                  onAdd: handleAddTask,
                  topics: rawTopics,
                  schedulingQueues: rawQueues,
                  severityLevels: rawSeverityLevels,
                  createdUserId: currentUser._id,
                  companyId: companyId || '',
                  styles: { theme: null == styles ? void 0 : styles.theme },
                }),
              currentShowTask &&
                (0, jsx_runtime.jsx)(client, {
                  open: !0,
                  onClose: () => setShowTaskOpen('-1'),
                  taskId: showTaskOpen,
                  taskTitle: showTaskTitle,
                  createdBy: showTaskCreatedBy,
                  description: showTaskDescription,
                  comments: showTaskCommentsFixed,
                  customerAssigned: showTaskCustomerAssigned,
                  severity: showTaskSeverity,
                  schedulingQueue: showTaskSchedulingQueue,
                  status: showTaskStatus,
                  subStatus: showTaskSubStatus,
                  topics: showTaskTopics,
                  knowledgebaseArticles: showTaskKBArticles,
                  teamMemberAssigned: showTaskTeamMemberAssigned,
                  nextActionDate: showTaskNextActionDate,
                  currentUserName: `${currentUser.firstName} ${currentUser.lastName}`,
                  onEdit: updatedData => {
                    onEdit({ _id: showTaskOpen, ...updatedData })
                  },
                  onDelete: () => onDelete({ _id: showTaskOpen }),
                  onDuplicate: () => onDuplicate({ _id: showTaskOpen }),
                  onComment: text => onComment(text, showTaskOpen),
                  onEditComment: (commentId, newText) =>
                    (function handleEditComment(commentId, newText, taskId) {
                      ;(setColumnState(oldCols =>
                        oldCols.map(col => {
                          const updatedTasks = col.tasks.map(task => {
                            if (task._id !== taskId) return task
                            const updatedComments = task.comments.map(c =>
                              c._id === commentId ? { ...c, text: newText } : c
                            )
                            return { ...task, comments: updatedComments }
                          })
                          return { ...col, tasks: updatedTasks }
                        })
                      ),
                        onEditComment(commentId, newText, taskId))
                    })(commentId, newText, showTaskOpen),
                  onCloseTask: function handleCloseTask(taskId) {
                    ;(setColumnState(oldCols =>
                      oldCols.map(col => {
                        const updatedTasks = col.tasks.map(task =>
                          task._id === taskId
                            ? { ...task, closedAt: new Date() }
                            : task
                        )
                        return { ...col, tasks: updatedTasks }
                      })
                    ),
                      setShowTaskOpen('-1'))
                  },
                  onRevisionHistory,
                  customerOptions: rawCustomers,
                  severityOptions: rawSeverityLevels,
                  schedulingQueueOptions: rawQueues,
                  statusOptions: rawStatuses,
                  subStatusOptions: rawSubStatuses,
                  topicOptions: rawTopics,
                  knowledgebaseArticleOptions: rawArticles,
                  teamMemberOptions: rawEmployees,
                  styles: { theme: null == styles ? void 0 : styles.theme },
                }),
            ],
          })
        }
        function ProjectBoard(props) {
          return (0, jsx_runtime.jsx)(JotaiProvider, {
            children: (0, jsx_runtime.jsx)(ProjectBoardContent, { ...props }),
          })
        }
        const components_ProjectBoard = react.memo(ProjectBoard)
        ProjectBoard.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ProjectBoard',
          props: {
            variant: {
              required: !0,
              tsType: {
                name: 'union',
                raw: "'administrator' | 'company' | 'customer'",
                elements: [
                  { name: 'literal', value: "'administrator'" },
                  { name: 'literal', value: "'company'" },
                  { name: 'literal', value: "'customer'" },
                ],
              },
              description: '',
            },
            boardType: {
              required: !0,
              tsType: {
                name: 'union',
                raw: "'severityLevel' | 'status' | 'subStatus' | 'topic'",
                elements: [
                  { name: 'literal', value: "'severityLevel'" },
                  { name: 'literal', value: "'status'" },
                  { name: 'literal', value: "'subStatus'" },
                  { name: 'literal', value: "'topic'" },
                ],
              },
              description: '',
            },
            columns: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  title: string\n  description: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'title',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: '{\n  _id: string\n  title: string\n  description: string\n}[]',
              },
              description: '',
            },
            tasks: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  /** The parent company ID or other domain-specific reference. */\n  companyId: string\n  title: string\n  description: string\n  /** If severity is linked to a separate record, store it here. */\n  severityId: string\n  /** The main status. */\n  statusId: string\n  /** The sub-status. */\n  substatusId: string\n  /** The scheduling queue ID. */\n  schedulingQueueId: string\n  /** Topics array, each referencing a topic ID. */\n  topicIds: string[]\n  /** Comments array, referencing comment IDs. */\n  commentIds: string[]\n  /** Employee IDs assigned to the task. */\n  employeeIds: string[]\n  /** Knowledgebase article IDs. */\n  articleIds: string[]\n  /** The "customer" ID if you have one. */\n  customerId: string\n  /** Timestamps. */\n  createdAt: Date\n  closedAt: Date\n  updatedAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n  /**\n   * If you want to store the actual comments (rather than just commentIds),\n   * so ShowTask can display them directly.\n   */\n  comments: Comment[]\n  /** If you store the "customer assigned" label as text (e.g. "Bobbie Sue"). */\n  customerAssigned: string\n  /** Severity label text (e.g. "Critical"). */\n  severity: string\n  /** Scheduling Queue text (e.g. "Technologies Unlimited"). */\n  schedulingQueue: string\n  /** High-level status text (e.g. "Open"). */\n  status: string\n  /** Sub-status text (e.g. "In Progress"). */\n  subStatus: string\n  /**\n   * If you want to store the actual topic strings (e.g. ["Technical Support"]).\n   * This can be used in addition to or instead of topicIds.\n   */\n  topicLabels: string[]\n  /**\n   * If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\n   * This can be used in addition to or instead of articleIds.\n   */\n  kbArticles: string[]\n  /** A string representing the assigned team member (e.g. "Matthew Goluba"). */\n  teamMember: string\n  /** If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST"). */\n  nextActionDate: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'companyId',
                          value: { name: 'string', required: !0 },
                          description:
                            'The parent company ID or other domain-specific reference.',
                        },
                        {
                          key: 'title',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'severityId',
                          value: { name: 'string', required: !0 },
                          description:
                            'If severity is linked to a separate record, store it here.',
                        },
                        {
                          key: 'statusId',
                          value: { name: 'string', required: !0 },
                          description: 'The main status.',
                        },
                        {
                          key: 'substatusId',
                          value: { name: 'string', required: !0 },
                          description: 'The sub-status.',
                        },
                        {
                          key: 'schedulingQueueId',
                          value: { name: 'string', required: !0 },
                          description: 'The scheduling queue ID.',
                        },
                        {
                          key: 'topicIds',
                          value: {
                            name: 'Array',
                            elements: [{ name: 'string' }],
                            raw: 'string[]',
                            required: !0,
                          },
                          description:
                            'Topics array, each referencing a topic ID.',
                        },
                        {
                          key: 'commentIds',
                          value: {
                            name: 'Array',
                            elements: [{ name: 'string' }],
                            raw: 'string[]',
                            required: !0,
                          },
                          description:
                            'Comments array, referencing comment IDs.',
                        },
                        {
                          key: 'employeeIds',
                          value: {
                            name: 'Array',
                            elements: [{ name: 'string' }],
                            raw: 'string[]',
                            required: !0,
                          },
                          description: 'Employee IDs assigned to the task.',
                        },
                        {
                          key: 'articleIds',
                          value: {
                            name: 'Array',
                            elements: [{ name: 'string' }],
                            raw: 'string[]',
                            required: !0,
                          },
                          description: 'Knowledgebase article IDs.',
                        },
                        {
                          key: 'customerId',
                          value: { name: 'string', required: !0 },
                          description: 'The "customer" ID if you have one.',
                        },
                        {
                          key: 'createdAt',
                          value: { name: 'Date', required: !0 },
                          description: 'Timestamps.',
                        },
                        {
                          key: 'closedAt',
                          value: { name: 'Date', required: !0 },
                        },
                        {
                          key: 'updatedAt',
                          value: { name: 'Date', required: !0 },
                        },
                        {
                          key: 'createdBy',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'editHistory',
                          value: {
                            name: 'Array',
                            elements: [
                              {
                                name: 'signature',
                                type: 'object',
                                raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                signature: {
                                  properties: [
                                    {
                                      key: '_id',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'editedBy',
                                      value: { name: 'string', required: !1 },
                                    },
                                    {
                                      key: 'editedAt',
                                      value: { name: 'Date', required: !1 },
                                    },
                                    {
                                      key: 'text',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'isOriginal',
                                      value: { name: 'boolean', required: !0 },
                                    },
                                  ],
                                },
                              },
                            ],
                            raw: 'CommentEditHistory[]',
                            required: !0,
                          },
                        },
                        {
                          key: 'comments',
                          value: {
                            name: 'Array',
                            elements: [
                              {
                                name: 'signature',
                                type: 'object',
                                raw: '{\n  _id: string\n  text: string\n  createdAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n}',
                                signature: {
                                  properties: [
                                    {
                                      key: '_id',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'text',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'createdAt',
                                      value: { name: 'Date', required: !0 },
                                    },
                                    {
                                      key: 'createdBy',
                                      value: { name: 'string', required: !0 },
                                    },
                                    {
                                      key: 'editHistory',
                                      value: {
                                        name: 'Array',
                                        elements: [
                                          {
                                            name: 'signature',
                                            type: 'object',
                                            raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                            signature: {
                                              properties: [
                                                {
                                                  key: '_id',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'editedBy',
                                                  value: {
                                                    name: 'string',
                                                    required: !1,
                                                  },
                                                },
                                                {
                                                  key: 'editedAt',
                                                  value: {
                                                    name: 'Date',
                                                    required: !1,
                                                  },
                                                },
                                                {
                                                  key: 'text',
                                                  value: {
                                                    name: 'string',
                                                    required: !0,
                                                  },
                                                },
                                                {
                                                  key: 'isOriginal',
                                                  value: {
                                                    name: 'boolean',
                                                    required: !0,
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        ],
                                        raw: 'CommentEditHistory[]',
                                        required: !0,
                                      },
                                    },
                                  ],
                                },
                              },
                            ],
                            raw: 'Comment[]',
                            required: !0,
                          },
                          description:
                            'If you want to store the actual comments (rather than just commentIds),\nso ShowTask can display them directly.',
                        },
                        {
                          key: 'customerAssigned',
                          value: { name: 'string', required: !0 },
                          description:
                            'If you store the "customer assigned" label as text (e.g. "Bobbie Sue").',
                        },
                        {
                          key: 'severity',
                          value: { name: 'string', required: !0 },
                          description: 'Severity label text (e.g. "Critical").',
                        },
                        {
                          key: 'schedulingQueue',
                          value: { name: 'string', required: !0 },
                          description:
                            'Scheduling Queue text (e.g. "Technologies Unlimited").',
                        },
                        {
                          key: 'status',
                          value: { name: 'string', required: !0 },
                          description: 'High-level status text (e.g. "Open").',
                        },
                        {
                          key: 'subStatus',
                          value: { name: 'string', required: !0 },
                          description: 'Sub-status text (e.g. "In Progress").',
                        },
                        {
                          key: 'topicLabels',
                          value: {
                            name: 'Array',
                            elements: [{ name: 'string' }],
                            raw: 'string[]',
                            required: !0,
                          },
                          description:
                            'If you want to store the actual topic strings (e.g. ["Technical Support"]).\nThis can be used in addition to or instead of topicIds.',
                        },
                        {
                          key: 'kbArticles',
                          value: {
                            name: 'Array',
                            elements: [{ name: 'string' }],
                            raw: 'string[]',
                            required: !0,
                          },
                          description:
                            'If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\nThis can be used in addition to or instead of articleIds.',
                        },
                        {
                          key: 'teamMember',
                          value: { name: 'string', required: !0 },
                          description:
                            'A string representing the assigned team member (e.g. "Matthew Goluba").',
                        },
                        {
                          key: 'nextActionDate',
                          value: { name: 'string', required: !0 },
                          description:
                            'If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST").',
                        },
                      ],
                    },
                  },
                ],
                raw: 'Task[]',
              },
              description: '',
            },
            rawStatuses: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  status: string\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'status',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawStatus[]',
              },
              description: '',
            },
            rawSubStatuses: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  subStatus: string\n  description?: string\n  statusId: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'subStatus',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                        {
                          key: 'statusId',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawSubStatus[]',
              },
              description: '',
            },
            rawTopics: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  topic: string\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'topic',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawTopic[]',
              },
              description: '',
            },
            rawQueues: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  queueName: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'queueName',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawQueue[]',
              },
              description: '',
            },
            rawArticles: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  articleTitle: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'articleTitle',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawArticle[]',
              },
              description: '',
            },
            rawCustomers: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  firstName?: string\n  lastName?: string\n  email?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'firstName',
                          value: { name: 'string', required: !1 },
                        },
                        {
                          key: 'lastName',
                          value: { name: 'string', required: !1 },
                        },
                        {
                          key: 'email',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawCustomer[]',
              },
              description: '',
            },
            rawEmployees: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  firstName?: string\n  lastName?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'firstName',
                          value: { name: 'string', required: !1 },
                        },
                        {
                          key: 'lastName',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawEmployee[]',
              },
              description: '',
            },
            rawCompanies: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  companyName: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'companyName',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawCompany[]',
              },
              description: '',
            },
            rawSeverityLevels: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  _id: string\n  severityLevel: number\n  description?: string\n}',
                    signature: {
                      properties: [
                        { key: '_id', value: { name: 'string', required: !0 } },
                        {
                          key: 'severityLevel',
                          value: { name: 'number', required: !0 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: 'RawSeverityLevel[]',
              },
              description: '',
            },
            onEdit: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(args: { _id: string }) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'signature',
                        type: 'object',
                        raw: '{ _id: string }',
                        signature: {
                          properties: [
                            {
                              key: '_id',
                              value: { name: 'string', required: !0 },
                            },
                          ],
                        },
                      },
                      name: 'args',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onDelete: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(args: { _id: string }) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'signature',
                        type: 'object',
                        raw: '{ _id: string }',
                        signature: {
                          properties: [
                            {
                              key: '_id',
                              value: { name: 'string', required: !0 },
                            },
                          ],
                        },
                      },
                      name: 'args',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onDuplicate: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(args: { _id: string }) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'signature',
                        type: 'object',
                        raw: '{ _id: string }',
                        signature: {
                          properties: [
                            {
                              key: '_id',
                              value: { name: 'string', required: !0 },
                            },
                          ],
                        },
                      },
                      name: 'args',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onEditComment: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(commentId: string, newText: string, taskId: string) => void',
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'commentId' },
                    { type: { name: 'string' }, name: 'newText' },
                    { type: { name: 'string' }, name: 'taskId' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onAdd: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: "(newTask: Omit<Task, '_id'>) => void",
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'Omit',
                        elements: [
                          {
                            name: 'signature',
                            type: 'object',
                            raw: '{\n  _id: string\n  /** The parent company ID or other domain-specific reference. */\n  companyId: string\n  title: string\n  description: string\n  /** If severity is linked to a separate record, store it here. */\n  severityId: string\n  /** The main status. */\n  statusId: string\n  /** The sub-status. */\n  substatusId: string\n  /** The scheduling queue ID. */\n  schedulingQueueId: string\n  /** Topics array, each referencing a topic ID. */\n  topicIds: string[]\n  /** Comments array, referencing comment IDs. */\n  commentIds: string[]\n  /** Employee IDs assigned to the task. */\n  employeeIds: string[]\n  /** Knowledgebase article IDs. */\n  articleIds: string[]\n  /** The "customer" ID if you have one. */\n  customerId: string\n  /** Timestamps. */\n  createdAt: Date\n  closedAt: Date\n  updatedAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n  /**\n   * If you want to store the actual comments (rather than just commentIds),\n   * so ShowTask can display them directly.\n   */\n  comments: Comment[]\n  /** If you store the "customer assigned" label as text (e.g. "Bobbie Sue"). */\n  customerAssigned: string\n  /** Severity label text (e.g. "Critical"). */\n  severity: string\n  /** Scheduling Queue text (e.g. "Technologies Unlimited"). */\n  schedulingQueue: string\n  /** High-level status text (e.g. "Open"). */\n  status: string\n  /** Sub-status text (e.g. "In Progress"). */\n  subStatus: string\n  /**\n   * If you want to store the actual topic strings (e.g. ["Technical Support"]).\n   * This can be used in addition to or instead of topicIds.\n   */\n  topicLabels: string[]\n  /**\n   * If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\n   * This can be used in addition to or instead of articleIds.\n   */\n  kbArticles: string[]\n  /** A string representing the assigned team member (e.g. "Matthew Goluba"). */\n  teamMember: string\n  /** If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST"). */\n  nextActionDate: string\n}',
                            signature: {
                              properties: [
                                {
                                  key: '_id',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'companyId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'The parent company ID or other domain-specific reference.',
                                },
                                {
                                  key: 'title',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'description',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'severityId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If severity is linked to a separate record, store it here.',
                                },
                                {
                                  key: 'statusId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The main status.',
                                },
                                {
                                  key: 'substatusId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The sub-status.',
                                },
                                {
                                  key: 'schedulingQueueId',
                                  value: { name: 'string', required: !0 },
                                  description: 'The scheduling queue ID.',
                                },
                                {
                                  key: 'topicIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Topics array, each referencing a topic ID.',
                                },
                                {
                                  key: 'commentIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Comments array, referencing comment IDs.',
                                },
                                {
                                  key: 'employeeIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'Employee IDs assigned to the task.',
                                },
                                {
                                  key: 'articleIds',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description: 'Knowledgebase article IDs.',
                                },
                                {
                                  key: 'customerId',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'The "customer" ID if you have one.',
                                },
                                {
                                  key: 'createdAt',
                                  value: { name: 'Date', required: !0 },
                                  description: 'Timestamps.',
                                },
                                {
                                  key: 'closedAt',
                                  value: { name: 'Date', required: !0 },
                                },
                                {
                                  key: 'updatedAt',
                                  value: { name: 'Date', required: !0 },
                                },
                                {
                                  key: 'createdBy',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'editHistory',
                                  value: {
                                    name: 'Array',
                                    elements: [
                                      {
                                        name: 'signature',
                                        type: 'object',
                                        raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                        signature: {
                                          properties: [
                                            {
                                              key: '_id',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'editedBy',
                                              value: {
                                                name: 'string',
                                                required: !1,
                                              },
                                            },
                                            {
                                              key: 'editedAt',
                                              value: {
                                                name: 'Date',
                                                required: !1,
                                              },
                                            },
                                            {
                                              key: 'text',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'isOriginal',
                                              value: {
                                                name: 'boolean',
                                                required: !0,
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                    raw: 'CommentEditHistory[]',
                                    required: !0,
                                  },
                                },
                                {
                                  key: 'comments',
                                  value: {
                                    name: 'Array',
                                    elements: [
                                      {
                                        name: 'signature',
                                        type: 'object',
                                        raw: '{\n  _id: string\n  text: string\n  createdAt: Date\n  createdBy: string\n  editHistory: CommentEditHistory[]\n}',
                                        signature: {
                                          properties: [
                                            {
                                              key: '_id',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'text',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'createdAt',
                                              value: {
                                                name: 'Date',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'createdBy',
                                              value: {
                                                name: 'string',
                                                required: !0,
                                              },
                                            },
                                            {
                                              key: 'editHistory',
                                              value: {
                                                name: 'Array',
                                                elements: [
                                                  {
                                                    name: 'signature',
                                                    type: 'object',
                                                    raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                                                    signature: {
                                                      properties: [
                                                        {
                                                          key: '_id',
                                                          value: {
                                                            name: 'string',
                                                            required: !0,
                                                          },
                                                        },
                                                        {
                                                          key: 'editedBy',
                                                          value: {
                                                            name: 'string',
                                                            required: !1,
                                                          },
                                                        },
                                                        {
                                                          key: 'editedAt',
                                                          value: {
                                                            name: 'Date',
                                                            required: !1,
                                                          },
                                                        },
                                                        {
                                                          key: 'text',
                                                          value: {
                                                            name: 'string',
                                                            required: !0,
                                                          },
                                                        },
                                                        {
                                                          key: 'isOriginal',
                                                          value: {
                                                            name: 'boolean',
                                                            required: !0,
                                                          },
                                                        },
                                                      ],
                                                    },
                                                  },
                                                ],
                                                raw: 'CommentEditHistory[]',
                                                required: !0,
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                    raw: 'Comment[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store the actual comments (rather than just commentIds),\nso ShowTask can display them directly.',
                                },
                                {
                                  key: 'customerAssigned',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If you store the "customer assigned" label as text (e.g. "Bobbie Sue").',
                                },
                                {
                                  key: 'severity',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Severity label text (e.g. "Critical").',
                                },
                                {
                                  key: 'schedulingQueue',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Scheduling Queue text (e.g. "Technologies Unlimited").',
                                },
                                {
                                  key: 'status',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'High-level status text (e.g. "Open").',
                                },
                                {
                                  key: 'subStatus',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'Sub-status text (e.g. "In Progress").',
                                },
                                {
                                  key: 'topicLabels',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store the actual topic strings (e.g. ["Technical Support"]).\nThis can be used in addition to or instead of topicIds.',
                                },
                                {
                                  key: 'kbArticles',
                                  value: {
                                    name: 'Array',
                                    elements: [{ name: 'string' }],
                                    raw: 'string[]',
                                    required: !0,
                                  },
                                  description:
                                    'If you want to store knowledgebase articles as raw text (e.g. ["How to Troubleshoot Stuff"]).\nThis can be used in addition to or instead of articleIds.',
                                },
                                {
                                  key: 'teamMember',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'A string representing the assigned team member (e.g. "Matthew Goluba").',
                                },
                                {
                                  key: 'nextActionDate',
                                  value: { name: 'string', required: !0 },
                                  description:
                                    'If you store the next action date/time as a string (e.g. "09/15/2023 - 8:30AM CST").',
                                },
                              ],
                            },
                          },
                          { name: 'literal', value: "'_id'" },
                        ],
                        raw: "Omit<Task, '_id'>",
                      },
                      name: 'newTask',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            currentUser: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'object',
                raw: '{\n  _id: string\n  firstName: string\n  lastName: string\n}',
                signature: {
                  properties: [
                    { key: '_id', value: { name: 'string', required: !0 } },
                    {
                      key: 'firstName',
                      value: { name: 'string', required: !0 },
                    },
                    {
                      key: 'lastName',
                      value: { name: 'string', required: !0 },
                    },
                  ],
                },
              },
              description: '',
            },
            customerId: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            companyId: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            preferDropdown: {
              required: !1,
              tsType: { name: 'boolean' },
              description:
                "Whether to prefer the dropdown version of AddTask forms instead of using the 'provided' version.",
            },
            onComment: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(commentText: string, _id: string) => void',
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'commentText' },
                    { type: { name: 'string' }, name: '_id' },
                  ],
                  return: { name: 'void' },
                },
              },
              description:
                "If ShowTask calls onComment with both commentText and _id,\ndefine the signature here. You can also do (text: string) => void if that's your design.",
            },
            onRevisionHistory: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(\n  commentId: string,\n  revisionHistory: CommentEditHistory[]\n) => void',
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'commentId' },
                    {
                      type: {
                        name: 'Array',
                        elements: [
                          {
                            name: 'signature',
                            type: 'object',
                            raw: '{\n  _id: string\n  editedBy?: string\n  editedAt?: Date\n  text: string\n  isOriginal: boolean\n}',
                            signature: {
                              properties: [
                                {
                                  key: '_id',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'editedBy',
                                  value: { name: 'string', required: !1 },
                                },
                                {
                                  key: 'editedAt',
                                  value: { name: 'Date', required: !1 },
                                },
                                {
                                  key: 'text',
                                  value: { name: 'string', required: !0 },
                                },
                                {
                                  key: 'isOriginal',
                                  value: { name: 'boolean', required: !0 },
                                },
                              ],
                            },
                          },
                        ],
                        raw: 'CommentEditHistory[]',
                      },
                      name: 'revisionHistory',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description:
                'New callback for passing the revision history of a comment.',
            },
            styles: {
              required: !1,
              tsType: { name: 'ProjectBoardStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
          },
        }
        var console = __webpack_require__(
          './node_modules/console-browserify/index.js'
        )
        const sampleColumns = [
            { _id: '1', title: 'To Do', description: 'Tasks to be done' },
            {
              _id: '2',
              title: 'In Progress',
              description: 'Tasks currently being worked on',
            },
            { _id: '3', title: 'Done', description: 'Completed tasks' },
          ],
          sampleTasks = [
            {
              _id: 't1',
              title: 'Task 1',
              description: 'Description 1',
              statusId: '1',
              comments: [],
              topicIds: [],
              editHistory: [],
              createdBy: 'Admin',
              severityId: 's1',
              schedulingQueueId: 'q1',
              substatusId: 'ss1',
              severity: 'low',
              schedulingQueue: 'q1',
              status: 'open',
              subStatus: 'new',
              topicLabels: [],
              kbArticles: [],
              teamMember: 'none',
              nextActionDate: '',
              companyId: '',
              customerId: 'c1',
              employeeIds: [],
              articleIds: [],
              customerAssigned: 'c1',
              commentIds: [],
              createdAt: new Date(),
              closedAt: new Date(),
              updatedAt: new Date(),
            },
            {
              _id: 't2',
              title: 'Task 2',
              description: 'Description 2',
              statusId: '2',
              comments: [],
              topicIds: [],
              editHistory: [],
              createdBy: 'Admin',
              severityId: 's1',
              schedulingQueueId: 'q1',
              substatusId: 'ss1',
              severity: 'low',
              schedulingQueue: 'q1',
              status: 'open',
              subStatus: 'new',
              topicLabels: [],
              kbArticles: [],
              teamMember: 'none',
              nextActionDate: '',
              companyId: '',
              customerId: 'c1',
              employeeIds: [],
              articleIds: [],
              customerAssigned: 'c1',
              commentIds: [],
              createdAt: new Date(),
              closedAt: new Date(),
              updatedAt: new Date(),
            },
            {
              _id: 't3',
              title: 'Task 3',
              description: 'Description 3',
              statusId: '3',
              comments: [],
              topicIds: [],
              editHistory: [],
              createdBy: 'Admin',
              severityId: 's1',
              schedulingQueueId: 'q1',
              substatusId: 'ss1',
              severity: 'low',
              schedulingQueue: 'q1',
              status: 'open',
              subStatus: 'new',
              topicLabels: [],
              kbArticles: [],
              teamMember: 'none',
              nextActionDate: '',
              companyId: '',
              customerId: 'c1',
              employeeIds: [],
              articleIds: [],
              customerAssigned: 'c1',
              commentIds: [],
              createdAt: new Date(),
              closedAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          commonArgs = {
            columns: sampleColumns,
            tasks: sampleTasks,
            currentUser: { _id: 'u1', firstName: 'Test', lastName: 'User' },
            onAdd: task => console.log('Add task:', task),
            onEdit: task => console.log('Edit task:', task),
            onDelete: task => console.log('Delete task:', task),
            onDuplicate: task => console.log('Duplicate task:', task),
            onComment: (text, taskId) =>
              console.log('Add comment:', text, 'to task:', taskId),
            onEditComment: (commentId, text, taskId) =>
              console.log('Edit comment:', commentId, text, 'to task:', taskId),
          },
          projectboard_stories = {
            title: 'Components/ProjectBoard',
            component: components_ProjectBoard,
            parameters: { layout: 'fullscreen' },
            argTypes: {
              variant: {
                control: 'radio',
                options: ['administrator', 'company', 'customer'],
              },
            },
          },
          PremiumTheme = {
            name: 'Premium Theme',
            args: {
              ...commonArgs,
              variant: 'administrator',
              boardType: 'status',
              styles: { theme: 'light' },
            },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            args: {
              ...commonArgs,
              variant: 'administrator',
              boardType: 'status',
              styles: { theme: 'sacred' },
            },
          },
          InteractiveDemoRenderer = () => {
            const [isSacredTheme, setIsSacredTheme] = react.useState(!1),
              [variant, setVariant] = react.useState('administrator'),
              [boardType, setBoardType] = react.useState('status')
            return (0, jsx_runtime.jsxs)('div', {
              style: {
                padding: '1rem',
                backgroundColor: isSacredTheme ? 'black' : '#f3f4f6',
                height: '100vh',
              },
              children: [
                (0, jsx_runtime.jsxs)('div', {
                  style: {
                    position: 'fixed',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 100,
                    backgroundColor: 'white',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                  },
                  children: [
                    (0, jsx_runtime.jsxs)('label', {
                      children: [
                        (0, jsx_runtime.jsx)('input', {
                          type: 'checkbox',
                          checked: isSacredTheme,
                          onChange: e => setIsSacredTheme(e.target.checked),
                        }),
                        (0, jsx_runtime.jsx)('span', {
                          style: { marginLeft: '0.5rem' },
                          children: 'Sacred Theme',
                        }),
                      ],
                    }),
                    (0, jsx_runtime.jsxs)('select', {
                      value: variant,
                      onChange: e => setVariant(e.target.value),
                      children: [
                        (0, jsx_runtime.jsx)('option', {
                          value: 'administrator',
                          children: 'Administrator',
                        }),
                        (0, jsx_runtime.jsx)('option', {
                          value: 'company',
                          children: 'Company',
                        }),
                        (0, jsx_runtime.jsx)('option', {
                          value: 'customer',
                          children: 'Customer',
                        }),
                      ],
                    }),
                    (0, jsx_runtime.jsxs)('select', {
                      value: boardType,
                      onChange: e => setBoardType(e.target.value),
                      children: [
                        (0, jsx_runtime.jsx)('option', {
                          value: 'status',
                          children: 'Status',
                        }),
                        (0, jsx_runtime.jsx)('option', {
                          value: 'severityLevel',
                          children: 'Severity',
                        }),
                        (0, jsx_runtime.jsx)('option', {
                          value: 'subStatus',
                          children: 'Sub-Status',
                        }),
                        (0, jsx_runtime.jsx)('option', {
                          value: 'topic',
                          children: 'Topic',
                        }),
                      ],
                    }),
                  ],
                }),
                (0, jsx_runtime.jsx)(components_ProjectBoard, {
                  ...commonArgs,
                  columns: sampleColumns,
                  tasks: sampleTasks,
                  currentUser: {
                    _id: 'u1',
                    firstName: 'Test',
                    lastName: 'User',
                  },
                  styles: { theme: isSacredTheme ? 'sacred' : 'light' },
                  variant,
                  boardType,
                  rawArticles: [],
                  rawCompanies: [],
                  rawCustomers: [],
                  rawEmployees: [],
                  rawQueues: [],
                  rawSeverityLevels: [],
                  rawStatuses: [],
                  rawSubStatuses: [],
                  rawTopics: [],
                  onRevisionHistory: () => {},
                  onEdit: () => {},
                  onDelete: () => {},
                  onDuplicate: () => {},
                  onAdd: () => {},
                  onComment: () => {},
                  onEditComment: () => {},
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
