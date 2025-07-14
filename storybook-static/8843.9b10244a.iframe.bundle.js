'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [8843],
    {
      './src/components/Button/index.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.d(__webpack_exports__, {
          A: () => __WEBPACK_DEFAULT_EXPORT__,
          e: () => ButtonGroup,
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
        const ButtonGroup = ({
            value,
            exclusive,
            onChange,
            children,
            styles,
          }) => {
            const groupStyles = (0, _theme__WEBPACK_IMPORTED_MODULE_2__.hs)(
                styles
              ),
              totalChildren =
                react__WEBPACK_IMPORTED_MODULE_1__.Children.toArray(
                  children
                ).length,
              enhancedChildren =
                react__WEBPACK_IMPORTED_MODULE_1__.Children.map(
                  children,
                  (child, index) => {
                    if (
                      react__WEBPACK_IMPORTED_MODULE_1__.isValidElement(child)
                    ) {
                      const isFirst = 0 === index,
                        isLast = index === totalChildren - 1,
                        isSelected = (child.props.value || '') === value,
                        borderColor =
                          'sacred' === (null == styles ? void 0 : styles.theme)
                            ? 'rgba(255, 215, 0, 0.4)'
                            : 'dark' ===
                                (null == styles ? void 0 : styles.theme)
                              ? 'rgba(75, 85, 99, 0.8)'
                              : 'rgba(226, 232, 240, 0.8)'
                      return react__WEBPACK_IMPORTED_MODULE_1__.cloneElement(
                        child,
                        {
                          ...child.props,
                          styles: {
                            ...child.props.styles,
                            ...styles,
                            borderColor: 'transparent',
                            borderWidth: '0',
                            boxShadow: 'none',
                            margin: '0',
                            padding: '8px 16px',
                            borderRadius: isFirst
                              ? `${groupStyles.container.borderRadius || '8px'} 0 0 ${groupStyles.container.borderRadius || '8px'}`
                              : isLast
                                ? `0 ${groupStyles.container.borderRadius || '8px'} ${groupStyles.container.borderRadius || '8px'} 0`
                                : '0',
                            ...(!isLast && {
                              borderRightWidth: '1px',
                              borderRightStyle: 'solid',
                              borderRightColor: borderColor,
                            }),
                            ...(isSelected && {
                              backgroundColor:
                                'sacred' ===
                                (null == styles ? void 0 : styles.theme)
                                  ? 'rgba(255, 215, 0, 0.2)'
                                  : 'dark' ===
                                      (null == styles ? void 0 : styles.theme)
                                    ? 'rgba(59, 130, 246, 0.3)'
                                    : 'rgba(59, 130, 246, 0.1)',
                            }),
                          },
                          onClick: e => {
                            ;(exclusive && onChange(e, child.props.value || ''),
                              child.props.onClick && child.props.onClick(e))
                          },
                          selected: isSelected,
                        }
                      )
                    }
                    return child
                  }
                ),
              computedGroupStyle = {
                display: 'flex',
                borderRadius: groupStyles.container.borderRadius || '8px',
                overflow: 'hidden',
                background: 'transparent',
                boxShadow: groupStyles.container.boxShadow,
                border: groupStyles.container.border,
                padding: '0',
              }
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
              'div',
              { style: computedGroupStyle, children: enhancedChildren }
            )
          },
          SacredGlyphs = ({ isHovered, isDisabled, isIconOnly }) => {
            const [leftGlyph, setLeftGlyph] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(
                _theme__WEBPACK_IMPORTED_MODULE_2__.vR[
                  Math.floor(
                    Math.random() *
                      _theme__WEBPACK_IMPORTED_MODULE_2__.vR.length
                  )
                ]
              ),
              [rightGlyph, setRightGlyph] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(
                _theme__WEBPACK_IMPORTED_MODULE_2__.vR[
                  Math.floor(
                    Math.random() *
                      _theme__WEBPACK_IMPORTED_MODULE_2__.vR.length
                  )
                ]
              )
            ;(0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
              if (isHovered) {
                const timer = setTimeout(() => {
                  ;(setLeftGlyph(
                    _theme__WEBPACK_IMPORTED_MODULE_2__.vR[
                      Math.floor(
                        Math.random() *
                          _theme__WEBPACK_IMPORTED_MODULE_2__.vR.length
                      )
                    ]
                  ),
                    setRightGlyph(
                      _theme__WEBPACK_IMPORTED_MODULE_2__.vR[
                        Math.floor(
                          Math.random() *
                            _theme__WEBPACK_IMPORTED_MODULE_2__.vR.length
                        )
                      ]
                    ))
                }, 300)
                return () => clearTimeout(timer)
              }
            }, [isHovered])
            const glyphStyles = (0, react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(
              () => ({
                glyph: {
                  position: 'absolute',
                  fontSize: '14px',
                  color: 'rgba(255, 215, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  opacity: 0,
                  pointerEvents: 'none',
                },
                glyphLeft: {
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                },
                glyphRight: {
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                },
                glyphVisible: { opacity: 1 },
              }),
              []
            )
            return isIconOnly
              ? null
              : (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment,
                  {
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'div',
                        {
                          style: {
                            ...glyphStyles.glyph,
                            ...glyphStyles.glyphLeft,
                            ...(isHovered &&
                              !isDisabled &&
                              glyphStyles.glyphVisible),
                          },
                          children: leftGlyph,
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'div',
                        {
                          style: {
                            ...glyphStyles.glyph,
                            ...glyphStyles.glyphRight,
                            ...(isHovered &&
                              !isDisabled &&
                              glyphStyles.glyphVisible),
                          },
                          children: rightGlyph,
                        }
                      ),
                    ],
                  }
                )
          },
          Button = (0, react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(
            ({ text, icon, styles, onClick, selected, ...restProps }, ref) => {
              const [isHovered, setIsHovered] = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
                [isActive, setIsActive] = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
                isDisabled =
                  (null == styles ? void 0 : styles.disabled) ||
                  restProps.disabled,
                isIconOnly = !!icon && !text,
                isSacredTheme =
                  'sacred' === (null == styles ? void 0 : styles.theme),
                iconLocation =
                  (null == styles ? void 0 : styles.iconLocation) || 'left',
                computedStyles = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(
                  () =>
                    (0, _theme__WEBPACK_IMPORTED_MODULE_2__.hs)(
                      styles,
                      isHovered,
                      isActive || selected,
                      isDisabled
                    ),
                  [styles, isHovered, isActive, selected, isDisabled]
                ),
                handleMouseEnter = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
                  setIsHovered(!0)
                }, []),
                handleMouseLeave = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
                  ;(setIsHovered(!1), setIsActive(!1))
                }, []),
                handleMouseDown = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
                  setIsActive(!0)
                }, []),
                handleMouseUp = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
                  setIsActive(!1)
                }, []),
                handleClick = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(
                  event => {
                    !isDisabled && onClick && onClick(event)
                  },
                  [isDisabled, onClick]
                ),
                iconComponent = (0, react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(
                  () =>
                    icon
                      ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'span',
                          { children: icon }
                        )
                      : null,
                  [icon]
                )
              return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                'button',
                {
                  ref,
                  style: computedStyles.container,
                  disabled: isDisabled,
                  onMouseEnter: handleMouseEnter,
                  onMouseLeave: handleMouseLeave,
                  onMouseDown: handleMouseDown,
                  onMouseUp: handleMouseUp,
                  onClick: handleClick,
                  ...restProps,
                  children: [
                    isSacredTheme &&
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SacredGlyphs,
                        { isHovered, isDisabled: !!isDisabled, isIconOnly }
                      ),
                    'above' === iconLocation && iconComponent,
                    'left' === iconLocation && iconComponent,
                    text &&
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'span',
                        { children: text }
                      ),
                    'right' === iconLocation && iconComponent,
                  ],
                }
              )
            }
          )
        Button.displayName = 'Button'
        const __WEBPACK_DEFAULT_EXPORT__ = Button
        ;((ButtonGroup.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ButtonGroup',
          props: {
            value: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            exclusive: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
            },
            onChange: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(\n  event: React.MouseEvent<HTMLElement>,\n  newValue: string | null\n) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactMouseEvent',
                        raw: 'React.MouseEvent<HTMLElement>',
                        elements: [{ name: 'HTMLElement' }],
                      },
                      name: 'event',
                    },
                    {
                      type: {
                        name: 'union',
                        raw: 'string | null',
                        elements: [{ name: 'string' }, { name: 'null' }],
                      },
                      name: 'newValue',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            children: {
              required: !0,
              tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'ButtonStyles' },
              description: '',
            },
          },
        }),
          (Button.__docgenInfo = {
            description: 'A versatile and themeable button component.',
            methods: [],
            displayName: 'Button',
            props: {
              text: {
                required: !1,
                tsType: { name: 'string' },
                description: 'The text content of the button.',
              },
              icon: {
                required: !1,
                tsType: { name: 'ReactNode' },
                description:
                  'An icon to display within the button. Can be a React node or a component.',
              },
              styles: {
                required: !1,
                tsType: { name: 'ButtonStyles' },
                description:
                  'Comprehensive styling options including theme, custom colors, and layout properties.',
              },
              selected: {
                required: !1,
                tsType: { name: 'boolean' },
                description: '',
              },
              value: {
                required: !1,
                tsType: { name: 'string' },
                description: '',
              },
            },
            composes: ['Omit'],
          }))
      },
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
                        const value = String(opt.value).toLowerCase()
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
                              const valueStr = String(option.value),
                                displayText = option.value
                                  ? valueStr
                                      .replace(/_/g, ' ')
                                      .charAt(0)
                                      .toUpperCase() +
                                    valueStr.replace(/_/g, ' ').slice(1)
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
              })(styles, focused),
              theme = (null == styles ? void 0 : styles.theme) || 'light',
              placeholderColor = (() => {
                switch (theme) {
                  case 'dark':
                  default:
                    return '#9CA3AF'
                  case 'sacred':
                    return 'rgba(255, 215, 0, 0.7)'
                }
              })(),
              placeholderStyles = ((theme, placeholderColor) => {
                const className = `searchbar-placeholder-${theme}`
                return {
                  css: `\n    .${className}::placeholder {\n      color: ${placeholderColor} !important;\n      opacity: 0.7;\n    }\n    \n    .${className}::-webkit-input-placeholder {\n      color: ${placeholderColor} !important;\n      opacity: 0.7;\n    }\n    \n    .${className}::-moz-placeholder {\n      color: ${placeholderColor} !important;\n      opacity: 0.7;\n    }\n    \n    .${className}:-ms-input-placeholder {\n      color: ${placeholderColor} !important;\n      opacity: 0.7;\n    }\n    \n    .${className}::-ms-input-placeholder {\n      color: ${placeholderColor} !important;\n      opacity: 0.7;\n    }\n  `,
                  className,
                }
              })(theme, placeholderColor)
            ;(0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
              const styleId = `searchbar-placeholder-${theme}`
              let styleElement = document.getElementById(styleId)
              return (
                styleElement ||
                  ((styleElement = document.createElement('style')),
                  (styleElement.id = styleId),
                  document.head.appendChild(styleElement)),
                (styleElement.textContent = placeholderStyles.css),
                () => {
                  const element = document.getElementById(styleId)
                  element && element.remove()
                }
              )
            }, [theme, placeholderStyles.css])
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
                              {}
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'input',
                          {
                            type: 'text',
                            placeholder,
                            value,
                            onChange,
                            onFocus: () => setFocused(!0),
                            onBlur: () => setFocused(!1),
                            style: computedStyles.input,
                            className: placeholderStyles.className,
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
                    width: '100%',
                    maxWidth: '24rem',
                    minWidth: '200px',
                    height: '3.5rem',
                    position: 'relative',
                    flex: '1 1 auto',
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
                'sacred' === (null == styles ? void 0 : styles.theme),
              searchbarStyles = (toolbarStyles => {
                switch (
                  (null == toolbarStyles ? void 0 : toolbarStyles.theme) ||
                  'light'
                ) {
                  case 'dark':
                    return {
                      theme: 'dark',
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderFocusedColor: '#475569',
                      textColor: '#E2E8F0',
                      labelColor: '#E2E8F0',
                      labelFocusedColor: '#F1F5F9',
                      adornmentColor: '#9CA3AF',
                      adornmentFocusedColor: '#E2E8F0',
                      borderRadius: '8px',
                      height: '40px',
                      fontFamily: 'Inter, sans-serif',
                    }
                  case 'sacred':
                    return {
                      theme: 'sacred',
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      borderColor: 'rgba(255, 215, 0, 0.5)',
                      borderFocusedColor: 'rgba(255, 215, 0, 0.8)',
                      textColor: '#FBBF24',
                      labelColor: '#FBBF24',
                      labelFocusedColor: '#FFD700',
                      adornmentColor: 'rgba(255, 215, 0, 0.6)',
                      adornmentFocusedColor: '#FFD700',
                      borderRadius: '8px',
                      height: '40px',
                      fontFamily: 'Cinzel, serif',
                    }
                  default:
                    return {
                      theme: 'light',
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderFocusedColor: '#94A3B8',
                      textColor: '#374151',
                      labelColor: '#374151',
                      labelFocusedColor: '#1F2937',
                      adornmentColor: '#6B7280',
                      adornmentFocusedColor: '#374151',
                      borderRadius: '8px',
                      height: '40px',
                      fontFamily: 'Inter, sans-serif',
                    }
                }
              })(styles)
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
                    styles: searchbarStyles,
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
                padding: '0 8px',
                gap: '10px',
                minWidth: '0',
                maxWidth: '12rem',
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
        var FileCopy = __webpack_require__(
            './src/components/Icons/FileCopy.tsx'
          ),
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
              height: '48px',
              width: '100%',
              maxWidth: '100%',
              minWidth: '0',
              padding: '0 8px',
              boxSizing: 'border-box',
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
              width: '1px',
              height: '24px',
              backgroundColor: isSacredTheme
                ? 'rgba(255, 215, 0, 0.3)'
                : 'rgba(229, 231, 235, 1)',
              margin: '0 8px',
              flexShrink: 0,
            },
            actionButtonStyle = {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px 8px',
              cursor: 'pointer',
              borderRadius: '4px',
              transition: 'colors 0.3s ease',
              userSelect: 'none',
              minWidth: '0',
              height: '40px',
              gap: '2px',
              whiteSpace: 'nowrap',
            },
            iconContainerStyle = {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isSacredTheme
                ? 'rgba(255, 215, 0, 1)'
                : 'rgba(55, 65, 81, 1)',
              fontSize: '16px',
              width: '20px',
              height: '16px',
              margin: '0',
              padding: '0',
            }
          return (0, jsx_runtime.jsx)('div', {
            style: containerStyle,
            children: (0, jsx_runtime.jsxs)('div', {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                width: '100%',
                minWidth: '0',
                maxWidth: '100%',
              },
              children: [
                (0, jsx_runtime.jsx)('div', {
                  style: {
                    flex: '1 1 auto',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 8px',
                    minWidth: '0',
                    overflow: 'hidden',
                  },
                  children: (0, jsx_runtime.jsx)('span', {
                    style: {
                      color: isSacredTheme ? '#FFD700' : 'rgba(55, 65, 81, 1)',
                      fontSize: '14px',
                      fontWeight: '500',
                      margin: '0',
                      padding: '0',
                      lineHeight: '1',
                    },
                    children: `${selectedRows.length} ${1 === selectedRows.length ? 'item' : 'items'} selected`,
                  }),
                }),
                (0, jsx_runtime.jsx)('div', {
                  style: {
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '2px',
                    flex: '0 0 auto',
                    minWidth: '0',
                  },
                  children: (0, jsx_runtime.jsxs)('div', {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      height: '100%',
                    },
                    children: [
                      1 === selectedRows.length &&
                        onManage &&
                        (0, jsx_runtime.jsxs)('div', {
                          onClick: e => {
                            ;(e.stopPropagation(),
                              handleActionSelection('manage'))
                          },
                          style: actionButtonStyle,
                          children: [
                            (0, jsx_runtime.jsx)('div', {
                              style: iconContainerStyle,
                              children: (0, jsx_runtime.jsx)(Edit.A, {
                                sacredtheme: isSacredTheme,
                                width: '16',
                                height: '16',
                                style: { width: '16px', height: '16px' },
                              }),
                            }),
                            (0, jsx_runtime.jsx)('span', {
                              style: {
                                color: isSacredTheme
                                  ? '#FFD700'
                                  : 'rgba(55, 65, 81, 1)',
                                fontSize: '10px',
                                fontWeight: '500',
                                margin: '0',
                                padding: '0',
                                lineHeight: '1',
                                display: 'block',
                              },
                              children: 'Manage',
                            }),
                          ],
                        }),
                      1 === selectedRows.length &&
                        onShow &&
                        (0, jsx_runtime.jsxs)('div', {
                          onClick: e => {
                            ;(e.stopPropagation(),
                              handleActionSelection('show'))
                          },
                          style: actionButtonStyle,
                          children: [
                            (0, jsx_runtime.jsx)('div', {
                              style: iconContainerStyle,
                              children: (0, jsx_runtime.jsxs)('svg', {
                                xmlns: 'http://www.w3.org/2000/svg',
                                width: '16',
                                height: '16',
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
                            }),
                            (0, jsx_runtime.jsx)('span', {
                              style: {
                                color: isSacredTheme
                                  ? '#FFD700'
                                  : 'rgba(55, 65, 81, 1)',
                                fontSize: '10px',
                                fontWeight: '500',
                                margin: '0',
                                padding: '0',
                                lineHeight: '1',
                                display: 'block',
                              },
                              children: 'Show',
                            }),
                          ],
                        }),
                      1 === selectedRows.length &&
                        onDuplicate &&
                        (0, jsx_runtime.jsxs)('div', {
                          onClick: e => {
                            ;(e.stopPropagation(),
                              handleActionSelection('duplicate'))
                          },
                          style: actionButtonStyle,
                          children: [
                            (0, jsx_runtime.jsx)('div', {
                              style: iconContainerStyle,
                              children: (0, jsx_runtime.jsx)(FileCopy.A, {
                                sacredtheme: isSacredTheme,
                                width: '16',
                                height: '16',
                                style: { width: '16px', height: '16px' },
                              }),
                            }),
                            (0, jsx_runtime.jsx)('span', {
                              style: {
                                color: isSacredTheme
                                  ? '#FFD700'
                                  : 'rgba(55, 65, 81, 1)',
                                fontSize: '10px',
                                fontWeight: '500',
                                margin: '0',
                                padding: '0',
                                lineHeight: '1',
                                display: 'block',
                              },
                              children: 'Duplicate',
                            }),
                          ],
                        }),
                      1 === selectedRows.length &&
                        (onManage || onShow || onDuplicate) &&
                        (0, jsx_runtime.jsx)('div', { style: dividerStyle }),
                      onDelete &&
                        (0, jsx_runtime.jsxs)('div', {
                          onClick: e => {
                            ;(e.stopPropagation(),
                              handleActionSelection('delete'))
                          },
                          style: actionButtonStyle,
                          children: [
                            (0, jsx_runtime.jsx)('div', {
                              style: iconContainerStyle,
                              children: (0, jsx_runtime.jsx)(Delete.A, {
                                sacredtheme: isSacredTheme,
                                width: '16',
                                height: '16',
                                style: { width: '16px', height: '16px' },
                              }),
                            }),
                            (0, jsx_runtime.jsx)('span', {
                              style: {
                                color: isSacredTheme
                                  ? '#FFD700'
                                  : 'rgba(55, 65, 81, 1)',
                                fontSize: '10px',
                                fontWeight: '500',
                                margin: '0',
                                padding: '0',
                                lineHeight: '1',
                                display: 'block',
                              },
                              children: 'Delete',
                            }),
                          ],
                        }),
                      onExport &&
                        (0, jsx_runtime.jsxs)('div', {
                          onClick: e => {
                            ;(e.stopPropagation(),
                              handleActionSelection('export'))
                          },
                          style: actionButtonStyle,
                          children: [
                            (0, jsx_runtime.jsx)('div', {
                              style: iconContainerStyle,
                              children: (0, jsx_runtime.jsx)(Download.A, {
                                sacredtheme: isSacredTheme,
                                width: '16',
                                height: '16',
                                style: { width: '16px', height: '16px' },
                              }),
                            }),
                            (0, jsx_runtime.jsx)('span', {
                              style: {
                                color: isSacredTheme
                                  ? '#FFD700'
                                  : 'rgba(55, 65, 81, 1)',
                                fontSize: '10px',
                                fontWeight: '500',
                                margin: '0',
                                padding: '0',
                                lineHeight: '1',
                                display: 'block',
                              },
                              children: 'Export',
                            }),
                          ],
                        }),
                    ],
                  }),
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
              height: '100%',
              padding: '0 8px',
              minWidth: '0',
              flex: '1 1 auto',
              maxWidth: '100%',
              overflow: 'hidden',
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
                    '\n      .toolbar-container {\n        width: 100%;\n        max-width: 100%;\n        box-sizing: border-box;\n        overflow: hidden;\n      }\n      \n      @media (min-width: 768px) {\n        .toolbar-mobile-container {\n          display: none !important;\n        }\n        .toolbar-tablet-container {\n          display: flex !important;\n          align-items: center;\n          justify-content: space-between;\n          width: 100%;\n          max-width: 100%;\n          box-sizing: border-box;\n          gap: 1rem;\n          overflow: hidden;\n        }\n      }\n      @media (min-width: 1280px) {\n        .toolbar-container {\n            flex-direction: row;\n            align-items: center;\n            justify-content: space-between;\n            max-width: 100%;\n            box-sizing: border-box;\n            overflow: hidden;\n        }\n        .toolbar-tablet-container {\n            display: none !important;\n        }\n        .toolbar-desktop-left, .toolbar-desktop-right {\n          display: flex !important;\n          align-items: center;\n          gap: 1rem;\n          flex-wrap: nowrap;\n          min-width: 0;\n          box-sizing: border-box;\n          overflow: hidden;\n        }\n        .toolbar-desktop-left {\n          flex: 0 0 auto;\n          max-width: 50%;\n        }\n        .toolbar-desktop-right {\n          flex: 1 1 auto;\n          justify-content: flex-end;\n          max-width: 50%;\n          min-width: 0;\n        }\n      }\n    '),
                  document.head.appendChild(style),
                  () => {
                    document.head.removeChild(style)
                  }
                )
              }, []),
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  ...computedStyles.container,
                  width: '100%',
                  maxWidth: '100%',
                  minWidth: '0',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                },
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
                    style: {
                      ...computedStyles.desktopRight,
                      minWidth: '0',
                      flex: '1 1 auto',
                      maxWidth: '100%',
                      overflow: 'hidden',
                    },
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
                    style: {
                      ...computedStyles.tabletContainer,
                      maxWidth: '100%',
                      overflow: 'hidden',
                    },
                    className: 'toolbar-tablet-container',
                    children: [
                      (0, jsx_runtime.jsx)('div', {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          flexWrap: 'wrap',
                          flex: '1 1 auto',
                          minWidth: '0',
                          overflow: 'hidden',
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
                          flex: '0 0 auto',
                          minWidth: '0',
                          maxWidth: '100%',
                          overflow: 'hidden',
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
                    style: {
                      ...computedStyles.mobileContainer,
                      maxWidth: '100%',
                      overflow: 'hidden',
                    },
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
                          style: { minWidth: '0', maxWidth: '100%' },
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
                                style: { minWidth: '0', maxWidth: '100%' },
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
    },
  ]
)
