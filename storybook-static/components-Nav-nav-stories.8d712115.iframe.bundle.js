;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [5295],
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
      './src/components/Accordion/index.tsx': (
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
          next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
            './node_modules/next/link.js'
          ),
          next_link__WEBPACK_IMPORTED_MODULE_2___default =
            __webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__),
          _Icons_ExpandMore__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
            './src/components/Icons/ExpandMore.tsx'
          ),
          _theme__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
            './src/theme/index.ts'
          )
        const SacredGlyphs = ({ isExpanded, isHovered, isDisabled }) => {
            const glyphStyles = (0, react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(
              () => ({
                backgroundGlyphs: {
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  color: 'rgba(255, 215, 0, 0.2)',
                  fontSize: '12px',
                  animation: 'sacredFloat 3s ease-in-out infinite',
                  pointerEvents: 'none',
                },
                glyph: {
                  position: 'absolute',
                  color: 'rgba(255, 215, 0, 0.4)',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  opacity: 0,
                },
                glyphLeft: {
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                },
                glyphRight: {
                  right: '48px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                },
                glyphVisible: { opacity: 1 },
                glyphExpanded: {
                  opacity: 1,
                  animation: 'sacredGlyphRotate 20s linear infinite',
                },
                decorativeGlyphs: {
                  position: 'absolute',
                  bottom: '8px',
                  right: '16px',
                  display: 'flex',
                  gap: '4px',
                  opacity: 0.3,
                },
                decorativeGlyph: {
                  color: '#FFD700',
                  fontSize: '12px',
                  animation: 'sacredGlow 3s ease-in-out infinite',
                },
              }),
              []
            )
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment,
              {
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'div',
                    {
                      style: glyphStyles.backgroundGlyphs,
                      children: _theme__WEBPACK_IMPORTED_MODULE_4__.vR[0],
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'div',
                    {
                      style: {
                        ...glyphStyles.glyph,
                        ...glyphStyles.glyphLeft,
                        ...(isHovered &&
                          !isDisabled &&
                          glyphStyles.glyphVisible),
                        ...(isExpanded &&
                          !isDisabled &&
                          glyphStyles.glyphExpanded),
                      },
                      children: _theme__WEBPACK_IMPORTED_MODULE_4__.vR[3],
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
                        ...(isExpanded &&
                          !isDisabled &&
                          glyphStyles.glyphExpanded),
                      },
                      children: _theme__WEBPACK_IMPORTED_MODULE_4__.vR[7],
                    }
                  ),
                ],
              }
            )
          },
          SacredDetailsDecorations = () => {
            const decorativeStyles = (0,
            react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(
              () => ({
                decorativeGlyphs: {
                  position: 'absolute',
                  bottom: '8px',
                  right: '16px',
                  display: 'flex',
                  gap: '4px',
                  opacity: 0.3,
                },
                decorativeGlyph: {
                  color: '#FFD700',
                  fontSize: '12px',
                  animation: 'sacredGlow 3s ease-in-out infinite',
                },
              }),
              []
            )
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: decorativeStyles.decorativeGlyphs,
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'span',
                    {
                      style: {
                        ...decorativeStyles.decorativeGlyph,
                        animationDelay: '0s',
                      },
                      children: _theme__WEBPACK_IMPORTED_MODULE_4__.vR[20],
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'span',
                    {
                      style: {
                        ...decorativeStyles.decorativeGlyph,
                        animationDelay: '1s',
                      },
                      children: _theme__WEBPACK_IMPORTED_MODULE_4__.vR[21],
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'span',
                    {
                      style: {
                        ...decorativeStyles.decorativeGlyph,
                        animationDelay: '2s',
                      },
                      children: _theme__WEBPACK_IMPORTED_MODULE_4__.vR[22],
                    }
                  ),
                ],
              }
            )
          },
          Accordion = props => {
            const {
                summary,
                details,
                styles,
                level = 0,
                type = 'accordion',
                onClick,
                href,
                isActive,
                expanded: controlledExpanded,
                defaultExpanded,
                onChange,
                ...rest
              } = props,
              { expanded, handleToggle } = (({
                expanded: controlledExpanded,
                defaultExpanded = !1,
                onChange,
                styles,
              }) => {
                const { current: isControlled } =
                    react__WEBPACK_IMPORTED_MODULE_1__.useRef(
                      void 0 !== controlledExpanded
                    ),
                  [internalExpanded, setInternalExpanded] = (0,
                  react__WEBPACK_IMPORTED_MODULE_1__.useState)(defaultExpanded),
                  expanded = isControlled
                    ? controlledExpanded
                    : internalExpanded,
                  handleToggle = (0,
                  react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(
                    event => {
                      if (null == styles ? void 0 : styles.disabled) return
                      const newExpanded = !expanded
                      ;(isControlled || setInternalExpanded(newExpanded),
                        null == onChange || onChange(event, newExpanded))
                    },
                    [
                      null == styles ? void 0 : styles.disabled,
                      expanded,
                      isControlled,
                      onChange,
                    ]
                  )
                return (
                  (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
                    isControlled && setInternalExpanded(controlledExpanded)
                  }, [controlledExpanded, isControlled]),
                  { expanded, handleToggle }
                )
              })(props),
              [isHovered, setIsHovered] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
              computedStyles = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(() => {
                const stylesWithLevel = { ...styles, level }
                return (0, _theme__WEBPACK_IMPORTED_MODULE_4__.jB)(
                  stylesWithLevel,
                  isHovered,
                  expanded,
                  null == styles ? void 0 : styles.disabled
                )
              }, [styles, level, isHovered, expanded]),
              handleMouseEnter = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
                setIsHovered(!0)
              }, []),
              handleMouseLeave = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
                setIsHovered(!1)
              }, []),
              handleClick = (0, react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(
                event => {
                  ;(null == styles ? void 0 : styles.disabled) ||
                    ('menu' === type
                      ? null == onClick || onClick(event)
                      : handleToggle(event))
                },
                [
                  type,
                  onClick,
                  handleToggle,
                  null == styles ? void 0 : styles.disabled,
                ]
              ),
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              isMenuType = 'menu' === type,
              summaryStyleWithActive = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(
                () =>
                  isMenuType && isActive
                    ? {
                        ...computedStyles.summary,
                        backgroundColor: isSacredTheme
                          ? 'rgba(255, 215, 0, 0.15)'
                          : 'rgba(59, 130, 246, 0.1)',
                        color: isSacredTheme ? '#FFD700' : '#3B82F6',
                        fontWeight: 600,
                      }
                    : computedStyles.summary,
                [computedStyles.summary, isMenuType, isActive, isSacredTheme]
              ),
              summaryContent = (0,
              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                style: summaryStyleWithActive,
                onClick: handleClick,
                onMouseEnter: handleMouseEnter,
                onMouseLeave: handleMouseLeave,
                role: 'button',
                tabIndex: (null == styles ? void 0 : styles.disabled) ? -1 : 0,
                'aria-expanded': isMenuType ? void 0 : expanded,
                'data-testid': isMenuType ? 'menu-item' : 'accordion-summary',
                ...rest,
                children: [
                  !isMenuType &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      _Icons_ExpandMore__WEBPACK_IMPORTED_MODULE_3__.A,
                      {
                        style: {
                          ...computedStyles.icon,
                          position: 'absolute',
                          left: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          zIndex: 1,
                        },
                      }
                    ),
                  isSacredTheme &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      'div',
                      {
                        style: {
                          flex: 1,
                          paddingLeft: isMenuType ? '16px' : '30px',
                          paddingRight: '24px',
                          whiteSpace: 'nowrap',
                          minWidth: 'fit-content',
                        },
                        children: summary,
                      }
                    ),
                  !isSacredTheme &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      'div',
                      {
                        style: {
                          flex: 1,
                          paddingLeft: isMenuType ? '16px' : '30px',
                          whiteSpace: 'nowrap',
                          minWidth: 'fit-content',
                        },
                        children: summary,
                      }
                    ),
                ],
              })
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: computedStyles.container,
                children: [
                  isSacredTheme &&
                    !isMenuType &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      SacredGlyphs,
                      {
                        isExpanded: !!expanded,
                        isHovered,
                        isDisabled: !!(null == styles
                          ? void 0
                          : styles.disabled),
                      }
                    ),
                  isMenuType && href
                    ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        next_link__WEBPACK_IMPORTED_MODULE_2___default(),
                        {
                          href,
                          style: { textDecoration: 'none', color: 'inherit' },
                          children: summaryContent,
                        }
                      )
                    : summaryContent,
                  !isMenuType &&
                    expanded &&
                    details &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                      'div',
                      {
                        style: computedStyles.details,
                        children: [
                          (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            'div',
                            {
                              style: { position: 'relative', zIndex: 1 },
                              children: details,
                            }
                          ),
                          isSacredTheme &&
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              SacredDetailsDecorations,
                              {}
                            ),
                        ],
                      }
                    ),
                ],
              }
            )
          }
        Accordion.displayName = 'Accordion'
        const __WEBPACK_DEFAULT_EXPORT__ = Accordion
        Accordion.__docgenInfo = {
          description:
            'A collapsible content panel that supports multiple themes and controlled/uncontrolled states.\nAlso supports menu items for navigation.',
          methods: [],
          displayName: 'Accordion',
          props: {
            summary: {
              required: !0,
              tsType: { name: 'ReactNode' },
              description: 'Content displayed in the accordion header.',
            },
            details: {
              required: !1,
              tsType: { name: 'ReactNode' },
              description: 'Content displayed when the accordion is expanded.',
            },
            expanded: {
              required: !1,
              tsType: { name: 'boolean' },
              description:
                'Controls the expanded state (for a controlled component).',
            },
            defaultExpanded: {
              required: !1,
              tsType: { name: 'boolean' },
              description:
                'Sets the initial expanded state (for an uncontrolled component).',
            },
            onChange: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.SyntheticEvent, expanded: boolean) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactSyntheticEvent',
                        raw: 'React.SyntheticEvent',
                      },
                      name: 'event',
                    },
                    { type: { name: 'boolean' }, name: 'expanded' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: 'Callback fired when the expanded state changes.',
            },
            styles: {
              required: !1,
              tsType: { name: 'AccordionStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
            level: {
              required: !1,
              tsType: { name: 'number' },
              description:
                'Nesting level for indentation (0 = no indent, 1+ = progressively indented)',
            },
            type: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "'accordion' | 'menu'",
                elements: [
                  { name: 'literal', value: "'accordion'" },
                  { name: 'literal', value: "'menu'" },
                ],
              },
              description:
                "Type of component: 'accordion' for expandable sections, 'menu' for clickable items",
            },
            onClick: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.SyntheticEvent) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactSyntheticEvent',
                        raw: 'React.SyntheticEvent',
                      },
                      name: 'event',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description:
                "Callback fired when menu item is clicked (only used when type is 'menu')",
            },
            href: {
              required: !1,
              tsType: { name: 'string' },
              description: "URL for navigation (only used when type is 'menu')",
            },
            isActive: {
              required: !1,
              tsType: { name: 'boolean' },
              description:
                "Whether the menu item is currently active (only used when type is 'menu')",
            },
          },
        }
      },
      './src/components/Field/Dropdown/Searchable/index.tsx': (
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
      './src/components/Icons/ArrowDropDown.tsx': (
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
          ArrowDropDownIcon = ({
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
                        { d: 'M7 10l5 5 5-5z' }
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
          __WEBPACK_DEFAULT_EXPORT__ = ArrowDropDownIcon
        ArrowDropDownIcon.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ArrowDropDownIcon',
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
      './src/components/Icons/ExpandMore.tsx': (
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
          ExpandMoreIcon = ({
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
                        { d: 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z' }
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
          __WEBPACK_DEFAULT_EXPORT__ = ExpandMoreIcon
        ExpandMoreIcon.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ExpandMoreIcon',
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
      './src/components/Nav/nav.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        'use strict'
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            ComprehensiveShowcase: () => ComprehensiveShowcase,
            DarkTheme: () => DarkTheme,
            InteractionTest: () => InteractionTest,
            InteractiveNavigation: () => InteractiveNavigation,
            LightTheme: () => LightTheme,
            MinimalConfiguration: () => MinimalConfiguration,
            NestedNavigation: () => NestedNavigation,
            SacredTemporaryVariant: () => SacredTemporaryVariant,
            SacredTheme: () => SacredTheme,
            SixLevelComparison: () => SixLevelComparison,
            SixLevelDynamicWidth: () => SixLevelDynamicWidth,
            SixLevelLightTheme: () => SixLevelLightTheme,
            SixLevelSacredTheme: () => SixLevelSacredTheme,
            TemporaryVariant: () => TemporaryVariant,
            WithoutSearch: () => WithoutSearch,
            __namedExportsOrder: () => __namedExportsOrder,
            default: () => nav_stories,
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
          next_link = __webpack_require__('./node_modules/next/link.js'),
          link_default = __webpack_require__.n(next_link),
          navigation = __webpack_require__(
            './node_modules/@storybook/nextjs/dist/export-mocks/navigation/index.mjs'
          ),
          Searchable = __webpack_require__(
            './src/components/Field/Dropdown/Searchable/index.tsx'
          ),
          Accordion = __webpack_require__(
            './src/components/Accordion/index.tsx'
          ),
          theme = __webpack_require__('./src/theme/index.ts')
        const Drawer = ({
            open,
            onClose,
            children,
            anchor = 'left',
            variant = 'permanent',
            styles,
          }) => {
            const drawerRef = (0, react.useRef)(null),
              isDisabled = null == styles ? void 0 : styles.disabled,
              computedStyles = (0, react.useMemo)(
                () => (0, theme.Ux)(styles, open, anchor, variant),
                [styles, open, anchor, variant]
              ),
              handleClickOutside = (0, react.useCallback)(
                event => {
                  drawerRef.current &&
                    !drawerRef.current.contains(event.target) &&
                    onClose()
                },
                [onClose]
              ),
              handleBackdropClick = (0, react.useCallback)(() => {
                isDisabled || onClose()
              }, [onClose, isDisabled])
            return (
              (0, react.useEffect)(
                () => (
                  open && 'temporary' === variant
                    ? document.addEventListener('mousedown', handleClickOutside)
                    : document.removeEventListener(
                        'mousedown',
                        handleClickOutside
                      ),
                  () => {
                    document.removeEventListener(
                      'mousedown',
                      handleClickOutside
                    )
                  }
                ),
                [open, variant, handleClickOutside]
              ),
              'permanent' === variant
                ? (0, jsx_runtime.jsx)('div', {
                    style: computedStyles.permanent,
                    children,
                  })
                : (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                    children: [
                      open &&
                        (0, jsx_runtime.jsx)('div', {
                          style: computedStyles.temporaryBackdrop,
                          onClick: handleBackdropClick,
                        }),
                      (0, jsx_runtime.jsx)('div', {
                        ref: drawerRef,
                        style: computedStyles.temporaryDrawer,
                        children,
                      }),
                    ],
                  })
            )
          },
          components_Drawer = Drawer
        Drawer.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'Drawer',
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
            children: {
              required: !0,
              tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
              description: '',
            },
            anchor: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "'left' | 'right'",
                elements: [
                  { name: 'literal', value: "'left'" },
                  { name: 'literal', value: "'right'" },
                ],
              },
              description: '',
              defaultValue: { value: "'left'", computed: !1 },
            },
            variant: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "'permanent' | 'temporary'",
                elements: [
                  { name: 'literal', value: "'permanent'" },
                  { name: 'literal', value: "'temporary'" },
                ],
              },
              description: '',
              defaultValue: { value: "'permanent'", computed: !1 },
            },
            styles: {
              required: !1,
              tsType: { name: 'DrawerStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
          },
        }
        var Typography = __webpack_require__(
          './src/components/Typography/index.tsx'
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
          findActiveItemPath = (items, currentPath) => {
            for (const item of items) {
              if (item.route && item.route === currentPath) return [item]
              if (item.children && item.children.length > 0) {
                const childPath = findActiveItemPath(item.children, currentPath)
                if (childPath) return [item, ...childPath]
              }
            }
            return null
          },
          SacredBackground = ({ width, height }) => {
            const canvasRef = (0, react.useRef)(null),
              animationRef = (0, react.useRef)(null)
            return (
              (0, react.useEffect)(() => {
                const canvas = canvasRef.current
                if (!canvas) return
                const ctx = canvas.getContext('2d')
                if (!ctx) return
                ;((canvas.width = width), (canvas.height = height))
                const particles = []
                for (let i = 0; i < 15; i++)
                  particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: 0.3 * (Math.random() - 0.5),
                    vy: 0.3 * (Math.random() - 0.5),
                    glyph:
                      SACRED_GLYPHS[
                        Math.floor(Math.random() * SACRED_GLYPHS.length)
                      ],
                    size: 12 + 8 * Math.random(),
                    opacity: 0.2 * Math.random() + 0.1,
                    maxOpacity: 0.3 * Math.random() + 0.2,
                  })
                const animate = time => {
                  ;(ctx.clearRect(0, 0, width, height),
                    particles.forEach(particle => {
                      ;((particle.x += particle.vx),
                        (particle.y += particle.vy),
                        (particle.opacity =
                          particle.maxOpacity *
                          (0.7 +
                            0.3 * Math.sin(0.001 * time + 0.01 * particle.x))),
                        particle.x < -20 && (particle.x = width + 20),
                        particle.x > width + 20 && (particle.x = -20),
                        particle.y < -20 && (particle.y = height + 20),
                        particle.y > height + 20 && (particle.y = -20),
                        ctx.save(),
                        (ctx.globalAlpha = particle.opacity),
                        (ctx.fillStyle = '#FFD700'),
                        (ctx.font = `${particle.size}px serif`),
                        (ctx.textAlign = 'center'),
                        (ctx.textBaseline = 'middle'),
                        (ctx.shadowColor = 'rgba(255, 215, 0, 0.5)'),
                        (ctx.shadowBlur = 4),
                        ctx.fillText(particle.glyph, particle.x, particle.y),
                        ctx.restore())
                    }),
                    (animationRef.current = requestAnimationFrame(animate)))
                }
                return (
                  animate(0),
                  () => {
                    animationRef.current &&
                      cancelAnimationFrame(animationRef.current)
                  }
                )
              }, [width, height]),
              (0, jsx_runtime.jsx)('canvas', {
                ref: canvasRef,
                style: {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0.4,
                  pointerEvents: 'none',
                },
              })
            )
          }
        function Nav({
          items = [],
          showSearchableNav = !0,
          showTitle = !0,
          showLine = !0,
          verticalNavTitle = 'Navigation',
          searchableNavLabel = 'Search or select a nav',
          anchor = 'left',
          backgroundcolor,
          titleUrl,
          mobileOpen = !1,
          onClose,
          variant = 'permanent',
          spacingfromtopofscreen,
          marginabovetitle = '0px',
          marginbelowtitle = '0px',
          router,
          sacredtheme = !1,
          sacredTitle,
          sacredSubtitle,
          pathname: propPathname,
        }) {
          const [dropdownSelection, setDropdownSelection] = (0,
            react.useState)(),
            [titleHover, setTitleHover] = (0, react.useState)(!1),
            nextPathname = (0, navigation.usePathname)(),
            pathname = propPathname || nextPathname,
            containerRef = (0, react.useRef)(null),
            [containerSize, setContainerSize] = (0, react.useState)({
              width: 280,
              height: 600,
            }),
            styles = ((sacredtheme, backgroundcolor) => ({
              navContainer: {
                height: '100%',
                backgroundColor: sacredtheme
                  ? '#0a0a0a'
                  : backgroundcolor || '#F3F4F6',
                color: sacredtheme ? '#FFD700' : 'inherit',
                ...(sacredtheme && {
                  backgroundImage:
                    '\n          linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),\n          radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%)\n        ',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  boxShadow:
                    '\n          0 0 30px rgba(255, 215, 0, 0.1),\n          inset 0 0 60px rgba(255, 215, 0, 0.03)\n        ',
                }),
              },
              contentContainer: {
                position: 'relative',
                height: '100%',
                overflow: 'visible',
                minWidth: 'fit-content',
              },
              navList: {
                position: 'relative',
                zIndex: 1,
                height: '100%',
                overflowY: 'auto',
                overflowX: 'visible',
                padding: '0 15px',
                boxSizing: 'border-box',
                minWidth: 'fit-content',
                ...(sacredtheme && {
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255, 215, 0, 0.5) rgba(0, 0, 0, 0.3)',
                }),
              },
              titleContainer: {
                textAlign: 'center',
                padding: '8px 8px',
                position: 'relative',
                whiteSpace: 'nowrap',
                minWidth: 'fit-content',
              },
              titleLink: { textDecoration: 'none', color: 'inherit' },
              searchContainer: {
                position: 'relative',
                zIndex: 1e3,
                minHeight: '40px',
                whiteSpace: 'nowrap',
                marginTop: '0',
                paddingLeft: '10px',
                minWidth: 'fit-content',
              },
              divider: {
                width: '100%',
                height: '1px',
                backgroundColor: sacredtheme
                  ? 'rgba(255, 215, 0, 0.3)'
                  : 'white',
                marginTop: '20px',
                marginBottom: '8px',
                minWidth: '280px',
              },
              sacredTitleContainer: {
                textAlign: 'center',
                padding: '8px 8px',
                position: 'relative',
                whiteSpace: 'nowrap',
                minWidth: 'fit-content',
              },
              sacredTitleHeader: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
                gap: '8px',
              },
              sacredTitleHeaderLine: {
                width: '40px',
                height: '1px',
                background:
                  'linear-gradient(to right, transparent, #FFD700, transparent)',
              },
              sacredTitleHeaderGlyph: {
                color: '#FFD700',
                fontSize: '16px',
                animation: 'nav-rotate-glyph 20s linear infinite',
              },
              sacredTitleMain: {
                color: '#FFD700',
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                animation: 'nav-glow-pulse 3s ease-in-out infinite',
                fontFamily: '"Cinzel", serif',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              },
              sacredTitleMainHover: {
                transform: 'scale(1.05)',
                textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
              },
              sacredSubtitle: {
                color: 'rgba(255, 215, 0, 0.7)',
                fontSize: '12px',
                fontStyle: 'italic',
                marginTop: '4px',
                letterSpacing: '1px',
                whiteSpace: 'nowrap',
              },
              sacredGlyphsContainer: {
                display: 'flex',
                justifyContent: 'center',
                gap: '4px',
                marginTop: '4px',
              },
              sacredGlyph: {
                color: 'rgba(255, 215, 0, 0.6)',
                fontSize: '10px',
              },
              sacredDivider: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 16px',
                marginBottom: '-12px',
                minWidth: '280px',
              },
              sacredDividerLine: {
                width: '30%',
                height: '1px',
                background:
                  'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.5), transparent)',
              },
              sacredDividerGlyph: {
                color: '#FFD700',
                fontSize: '14px',
                padding: '0 8px',
                animation: 'nav-rotate-glyph 15s linear infinite reverse',
              },
              sacredFooter: { textAlign: 'center', padding: '24px 16px' },
              sacredFooterText: {
                color: 'rgba(255, 215, 0, 0.6)',
                fontSize: '10px',
                fontStyle: 'italic',
                letterSpacing: '1px',
                marginBottom: '8px',
              },
              sacredFooterGlyphs: {
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
              },
              sacredFooterGlyph: {
                color: 'rgba(255, 215, 0, 0.4)',
                fontSize: '12px',
              },
            }))(sacredtheme, backgroundcolor)
          ;((0, react.useEffect)(() => {
            if (sacredtheme) {
              const style = document.createElement('style')
              return (
                (style.textContent =
                  '\n        .nav-sacred-scrollbar::-webkit-scrollbar {\n          width: 8px;\n        }\n        .nav-sacred-scrollbar::-webkit-scrollbar-track {\n          background-color: rgba(0, 0, 0, 0.3);\n          border-radius: 4px;\n        }\n        .nav-sacred-scrollbar::-webkit-scrollbar-thumb {\n          background-color: rgba(255, 215, 0, 0.5);\n          border-radius: 4px;\n        }\n        .nav-sacred-scrollbar::-webkit-scrollbar-thumb:hover {\n          background-color: rgba(255, 215, 0, 0.7);\n        }\n      '),
                document.head.appendChild(style),
                () => {
                  document.head.removeChild(style)
                }
              )
            }
          }, [sacredtheme]),
            (0, react.useEffect)(() => {
              const activePath = findActiveItemPath(items, pathname)
              if (activePath) {
                var _activePath_
                const mainNavItemTitle =
                  null === (_activePath_ = activePath[0]) ||
                  void 0 === _activePath_
                    ? void 0
                    : _activePath_.title
                setDropdownSelection(mainNavItemTitle)
              }
            }, [pathname, items]),
            (0, react.useEffect)(() => {
              if (!sacredtheme || !containerRef.current) return
              const updateSize = () => {
                const container = containerRef.current
                container &&
                  setContainerSize({
                    width: container.offsetWidth,
                    height: container.offsetHeight,
                  })
              }
              return (
                updateSize(),
                window.addEventListener('resize', updateSize),
                () => window.removeEventListener('resize', updateSize)
              )
            }, [sacredtheme]))
          const navOptions = items.map(item => ({ value: item.title }))
          function renderNavItem(item, level = 0) {
            const isActive = item.route === pathname
            var _item_children
            return item.children && item.children.length > 0
              ? (0, jsx_runtime.jsx)(
                  Accordion.A,
                  {
                    summary: item.title,
                    details: (0, jsx_runtime.jsx)('div', {
                      style: { padding: '0' },
                      children:
                        null === (_item_children = item.children) ||
                        void 0 === _item_children
                          ? void 0
                          : _item_children.map(child =>
                              renderNavItem(child, level + 1)
                            ),
                    }),
                    styles: {
                      theme: sacredtheme ? 'sacred' : 'light',
                      level,
                      levelIndentBase: 16,
                      levelIndentIncrement: 12,
                      outline: !1,
                    },
                  },
                  item.title
                )
              : (0, jsx_runtime.jsx)(
                  Accordion.A,
                  {
                    type: 'menu',
                    summary: item.title,
                    href: item.route,
                    onClick: () =>
                      (function handleNavClick(item) {
                        'route' === item.trigger && item.route && router
                          ? (router.push(item.route),
                            'temporary' === variant && onClose && onClose())
                          : 'onClick' === item.trigger &&
                            item.onClick &&
                            (item.onClick(),
                            'temporary' === variant && onClose && onClose())
                      })(item),
                    isActive,
                    styles: {
                      theme: sacredtheme ? 'sacred' : 'light',
                      level,
                      levelIndentBase: 16,
                      levelIndentIncrement: 12,
                      outline: !1,
                    },
                  },
                  item.title
                )
          }
          const selectedMainNavItem = items.find(
              item => item.title === dropdownSelection
            ),
            SacredTitle = () =>
              (0, jsx_runtime.jsxs)('div', {
                style: styles.sacredTitleContainer,
                children: [
                  (0, jsx_runtime.jsxs)('div', {
                    style: styles.sacredTitleHeader,
                    children: [
                      (0, jsx_runtime.jsx)('div', {
                        style: styles.sacredTitleHeaderLine,
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: styles.sacredTitleHeaderGlyph,
                        children: '𓊹',
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: styles.sacredTitleHeaderLine,
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsx)(link_default(), {
                    href: titleUrl || '/',
                    style: styles.titleLink,
                    onClick: 'temporary' === variant ? onClose : void 0,
                    children: (0, jsx_runtime.jsx)('div', {
                      style: {
                        ...styles.sacredTitleMain,
                        ...(titleHover ? styles.sacredTitleMainHover : {}),
                      },
                      onMouseEnter: () => setTitleHover(!0),
                      onMouseLeave: () => setTitleHover(!1),
                      children: sacredTitle || verticalNavTitle,
                    }),
                  }),
                  sacredSubtitle &&
                    (0, jsx_runtime.jsx)('div', {
                      style: styles.sacredSubtitle,
                      children: sacredSubtitle,
                    }),
                  (0, jsx_runtime.jsx)('div', {
                    style: styles.sacredGlyphsContainer,
                    children: ['𓏏', '𓊖', '𓍯', '𓏏', '𓊖'].map((glyph, i) =>
                      (0, jsx_runtime.jsx)(
                        'div',
                        {
                          style: {
                            ...styles.sacredGlyph,
                            animation: `nav-float ${2 + 0.3 * i}s ease-in-out infinite`,
                          },
                          children: glyph,
                        },
                        i
                      )
                    ),
                  }),
                ],
              }),
            RegularTitle = () =>
              (0, jsx_runtime.jsx)('div', {
                style: {
                  ...styles.titleContainer,
                  marginTop: marginabovetitle,
                  marginBottom: marginbelowtitle,
                },
                children: (0, jsx_runtime.jsx)(link_default(), {
                  href: titleUrl || '/',
                  style: styles.titleLink,
                  children: (0, jsx_runtime.jsx)(Typography.A, {
                    variant: 'merrih4',
                    styles: { color: 'black' },
                    children: verticalNavTitle,
                  }),
                }),
              }),
            SacredDivider = () =>
              (0, jsx_runtime.jsxs)('div', {
                style: styles.sacredDivider,
                children: [
                  (0, jsx_runtime.jsx)('div', {
                    style: styles.sacredDividerLine,
                  }),
                  (0, jsx_runtime.jsx)('div', {
                    style: styles.sacredDividerGlyph,
                    children: '𓋹',
                  }),
                  (0, jsx_runtime.jsx)('div', {
                    style: styles.sacredDividerLine,
                  }),
                ],
              }),
            navContent = (0, jsx_runtime.jsxs)('div', {
              ref: containerRef,
              style: styles.contentContainer,
              children: [
                sacredtheme &&
                  (0, jsx_runtime.jsx)(SacredBackground, {
                    width: containerSize.width,
                    height: containerSize.height,
                  }),
                (0, jsx_runtime.jsxs)('div', {
                  style: styles.navList,
                  className: sacredtheme ? 'nav-sacred-scrollbar' : '',
                  children: [
                    showTitle &&
                      (sacredtheme
                        ? (0, jsx_runtime.jsx)(SacredTitle, {})
                        : (0, jsx_runtime.jsx)(RegularTitle, {})),
                    showSearchableNav &&
                      (0, jsx_runtime.jsx)('div', {
                        style: styles.searchContainer,
                        children: (0, jsx_runtime.jsx)(Searchable.A, {
                          label: searchableNavLabel,
                          options: navOptions,
                          onChange: option => {
                            option && setDropdownSelection(option.value)
                          },
                          defaultValue: dropdownSelection,
                          styles: {
                            theme: sacredtheme ? 'sacred' : 'light',
                            backgroundColor: sacredtheme
                              ? 'rgba(0, 0, 0, 0.6)'
                              : void 0,
                            borderColor: sacredtheme
                              ? 'rgba(255, 215, 0, 0.4)'
                              : void 0,
                            borderFocusedColor: sacredtheme
                              ? 'rgba(255, 215, 0, 1)'
                              : void 0,
                            labelColor: sacredtheme
                              ? 'rgba(255, 215, 0, 0.8)'
                              : void 0,
                            textColor: sacredtheme
                              ? 'rgba(255, 215, 0, 1)'
                              : void 0,
                          },
                        }),
                      }),
                    showLine &&
                      (sacredtheme
                        ? (0, jsx_runtime.jsx)(SacredDivider, {})
                        : (0, jsx_runtime.jsx)('div', {
                            style: styles.divider,
                          })),
                    (0, jsx_runtime.jsx)('div', {
                      style: { overflow: 'visible', minWidth: 'fit-content' },
                      children: selectedMainNavItem
                        ? renderNavItem(selectedMainNavItem, 0)
                        : items.map(item => renderNavItem(item, 0)),
                    }),
                    sacredtheme &&
                      (0, jsx_runtime.jsxs)('div', {
                        style: styles.sacredFooter,
                        children: [
                          (0, jsx_runtime.jsx)('div', {
                            style: styles.sacredFooterText,
                            children: '"Through wisdom, navigate the divine"',
                          }),
                          (0, jsx_runtime.jsx)('div', {
                            style: styles.sacredFooterGlyphs,
                            children: ['𓅨', '𓂋', '𓏭', '𓊵'].map((glyph, i) =>
                              (0, jsx_runtime.jsx)(
                                'div',
                                {
                                  style: {
                                    ...styles.sacredFooterGlyph,
                                    animation: `nav-glow-pulse ${4 + 0.5 * i}s ease-in-out infinite`,
                                  },
                                  children: glyph,
                                },
                                i
                              )
                            ),
                          }),
                        ],
                      }),
                  ],
                }),
              ],
            })
          return (0, jsx_runtime.jsx)('div', {
            style: {
              ...styles.navContainer,
              minWidth: 'fit-content',
              overflow: 'visible',
            },
            children:
              'temporary' === variant
                ? (0, jsx_runtime.jsx)(components_Drawer, {
                    anchor,
                    open: mobileOpen,
                    onClose: onClose || (() => {}),
                    children: (0, jsx_runtime.jsx)('div', {
                      style: {
                        minWidth: '320px',
                        width: 'fit-content',
                        overflow: 'visible',
                      },
                      children: navContent,
                    }),
                  })
                : (0, jsx_runtime.jsx)('div', {
                    style: {
                      minWidth: '320px',
                      width: 'fit-content',
                      height: '100vh',
                      position: 'fixed',
                      top: spacingfromtopofscreen,
                      [anchor]: 0,
                      paddingTop: '17px',
                      boxSizing: 'border-box',
                      overflow: 'visible',
                    },
                    children: navContent,
                  }),
          })
        }
        const components_Nav = Nav
        Nav.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'Nav',
          props: {
            items: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [{ name: 'NavItem' }],
                raw: 'NavItem[]',
              },
              description: '',
              defaultValue: { value: '[]', computed: !1 },
            },
            showSearchableNav: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'true', computed: !1 },
            },
            showTitle: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'true', computed: !1 },
            },
            showLine: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'true', computed: !1 },
            },
            verticalNavTitle: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "'Navigation'", computed: !1 },
            },
            searchableNavLabel: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "'Search or select a nav'", computed: !1 },
            },
            anchor: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "'left' | 'right'",
                elements: [
                  { name: 'literal', value: "'left'" },
                  { name: 'literal', value: "'right'" },
                ],
              },
              description: '',
              defaultValue: { value: "'left'", computed: !1 },
            },
            backgroundcolor: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            titleUrl: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            mobileOpen: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
            onClose: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            variant: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "'temporary' | 'permanent'",
                elements: [
                  { name: 'literal', value: "'temporary'" },
                  { name: 'literal', value: "'permanent'" },
                ],
              },
              description: '',
              defaultValue: { value: "'permanent'", computed: !1 },
            },
            spacingfromtopofscreen: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            marginabovetitle: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "'0px'", computed: !1 },
            },
            marginbelowtitle: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "'0px'", computed: !1 },
            },
            router: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'object',
                raw: '{ push: (route: string) => void }',
                signature: {
                  properties: [
                    {
                      key: 'push',
                      value: {
                        name: 'signature',
                        type: 'function',
                        raw: '(route: string) => void',
                        signature: {
                          arguments: [
                            { type: { name: 'string' }, name: 'route' },
                          ],
                          return: { name: 'void' },
                        },
                        required: !0,
                      },
                    },
                  ],
                },
              },
              description: '',
            },
            sacredtheme: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
            sacredTitle: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            sacredSubtitle: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            pathname: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
          },
        }
        const basicNavItems = [
            { title: 'Dashboard', route: '/dashboard', trigger: 'route' },
            { title: 'Analytics', route: '/analytics', trigger: 'route' },
            { title: 'Settings', route: '/settings', trigger: 'route' },
          ],
          nestedNavItems = [
            { title: 'Dashboard', route: '/dashboard', trigger: 'route' },
            {
              title: 'Users',
              children: [
                { title: 'User List', route: '/users/list', trigger: 'route' },
                { title: 'Add User', route: '/users/add', trigger: 'route' },
                {
                  title: 'User Roles',
                  route: '/users/roles',
                  trigger: 'route',
                },
              ],
            },
            {
              title: 'Products',
              children: [
                {
                  title: 'Product List',
                  route: '/products/list',
                  trigger: 'route',
                },
                {
                  title: 'Categories',
                  route: '/products/categories',
                  trigger: 'route',
                },
              ],
            },
            { title: 'Analytics', route: '/analytics', trigger: 'route' },
          ],
          sixLevelNavItems = [
            { title: 'Home', route: '/', trigger: 'route' },
            {
              title: 'Management',
              children: [
                { title: 'Overview', route: '/management', trigger: 'route' },
                {
                  title: 'Users',
                  children: [
                    {
                      title: 'All Users',
                      route: '/management/users',
                      trigger: 'route',
                    },
                    {
                      title: 'User Details',
                      children: [
                        {
                          title: 'Profile Management',
                          route: '/management/users/profile',
                          trigger: 'route',
                        },
                        {
                          title: 'Permissions',
                          children: [
                            {
                              title: 'Role Management',
                              route: '/management/users/permissions/roles',
                              trigger: 'route',
                            },
                            {
                              title: 'Advanced Settings',
                              children: [
                                {
                                  title: 'Access Control Lists',
                                  route:
                                    '/management/users/permissions/advanced/acl',
                                  trigger: 'route',
                                },
                                {
                                  title: 'Security Policies',
                                  route:
                                    '/management/users/permissions/advanced/security',
                                  trigger: 'route',
                                },
                                {
                                  title: 'Audit Logs',
                                  route:
                                    '/management/users/permissions/advanced/audit',
                                  trigger: 'route',
                                },
                              ],
                            },
                            {
                              title: 'Group Permissions',
                              route: '/management/users/permissions/groups',
                              trigger: 'route',
                            },
                          ],
                        },
                        {
                          title: 'Activity Logs',
                          route: '/management/users/activity',
                          trigger: 'route',
                        },
                      ],
                    },
                    {
                      title: 'Add User',
                      route: '/management/users/add',
                      trigger: 'route',
                    },
                  ],
                },
                {
                  title: 'Products',
                  children: [
                    {
                      title: 'Inventory',
                      route: '/management/products/inventory',
                      trigger: 'route',
                    },
                    {
                      title: 'Categories',
                      children: [
                        {
                          title: 'Main Categories',
                          route: '/management/products/categories/main',
                          trigger: 'route',
                        },
                        {
                          title: 'Subcategories',
                          children: [
                            {
                              title: 'Electronics',
                              route:
                                '/management/products/categories/sub/electronics',
                              trigger: 'route',
                            },
                            {
                              title: 'Detailed Classification',
                              children: [
                                {
                                  title: 'Product Specifications',
                                  route:
                                    '/management/products/categories/sub/detailed/specs',
                                  trigger: 'route',
                                },
                                {
                                  title: 'Quality Standards',
                                  route:
                                    '/management/products/categories/sub/detailed/quality',
                                  trigger: 'route',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              title: 'Reports',
              children: [
                {
                  title: 'Sales Reports',
                  route: '/reports/sales',
                  trigger: 'route',
                },
                {
                  title: 'Analytics',
                  route: '/reports/analytics',
                  trigger: 'route',
                },
              ],
            },
            { title: 'Help', route: '/help', trigger: 'route' },
          ],
          sacredSixLevelNavItems = [
            { title: 'Divine Portal', route: '/', trigger: 'route' },
            {
              title: 'Sacred Archives',
              children: [
                {
                  title: 'Archive Overview',
                  route: '/archives',
                  trigger: 'route',
                },
                {
                  title: 'Scrolls of Wisdom',
                  children: [
                    {
                      title: 'All Sacred Texts',
                      route: '/archives/scrolls',
                      trigger: 'route',
                    },
                    {
                      title: 'Ancient Manuscripts',
                      children: [
                        {
                          title: 'Hieroglyphic Records',
                          route: '/archives/scrolls/manuscripts/hieroglyphic',
                          trigger: 'route',
                        },
                        {
                          title: 'Papyrus Collection',
                          children: [
                            {
                              title: 'Medical Papyri',
                              route:
                                '/archives/scrolls/manuscripts/papyrus/medical',
                              trigger: 'route',
                            },
                            {
                              title: 'Sacred Mathematics',
                              children: [
                                {
                                  title: 'Geometry of Pyramids',
                                  route:
                                    '/archives/scrolls/manuscripts/papyrus/math/geometry',
                                  trigger: 'route',
                                },
                                {
                                  title: 'Astronomical Calculations',
                                  route:
                                    '/archives/scrolls/manuscripts/papyrus/math/astronomy',
                                  trigger: 'route',
                                },
                                {
                                  title: 'Divine Numerology',
                                  route:
                                    '/archives/scrolls/manuscripts/papyrus/math/numerology',
                                  trigger: 'route',
                                },
                              ],
                            },
                            {
                              title: 'Religious Texts',
                              route:
                                '/archives/scrolls/manuscripts/papyrus/religious',
                              trigger: 'route',
                            },
                          ],
                        },
                        {
                          title: 'Stone Inscriptions',
                          route: '/archives/scrolls/manuscripts/stone',
                          trigger: 'route',
                        },
                      ],
                    },
                    {
                      title: 'Codex Collection',
                      route: '/archives/scrolls/codex',
                      trigger: 'route',
                    },
                  ],
                },
                {
                  title: 'Temple Records',
                  children: [
                    {
                      title: 'Daily Rituals',
                      route: '/archives/temple/rituals',
                      trigger: 'route',
                    },
                    {
                      title: 'Sacred Ceremonies',
                      route: '/archives/temple/ceremonies',
                      trigger: 'route',
                    },
                  ],
                },
              ],
            },
            {
              title: 'Divine Governance',
              children: [
                {
                  title: "Pharaoh's Court",
                  children: [
                    {
                      title: 'Royal Decrees',
                      route: '/governance/court/decrees',
                      trigger: 'route',
                    },
                    {
                      title: 'Court Officials',
                      children: [
                        {
                          title: 'High Priests',
                          route: '/governance/court/officials/priests',
                          trigger: 'route',
                        },
                        {
                          title: 'Sacred Scribes',
                          children: [
                            {
                              title: 'Royal Scribes',
                              route:
                                '/governance/court/officials/scribes/royal',
                              trigger: 'route',
                            },
                            {
                              title: 'Divine Scholars',
                              children: [
                                {
                                  title: 'Knowledge Keepers',
                                  route:
                                    '/governance/court/officials/scribes/scholars/keepers',
                                  trigger: 'route',
                                },
                                {
                                  title: 'Wisdom Guardians',
                                  route:
                                    '/governance/court/officials/scribes/scholars/guardians',
                                  trigger: 'route',
                                },
                                {
                                  title: 'Truth Seekers',
                                  route:
                                    '/governance/court/officials/scribes/scholars/seekers',
                                  trigger: 'route',
                                },
                              ],
                            },
                            {
                              title: 'Temple Scribes',
                              route:
                                '/governance/court/officials/scribes/temple',
                              trigger: 'route',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  title: 'Sacred Laws',
                  route: '/governance/laws',
                  trigger: 'route',
                },
              ],
            },
            {
              title: "Thoth's Analytics",
              children: [
                {
                  title: 'Divine Metrics',
                  route: '/analytics/metrics',
                  trigger: 'route',
                },
                {
                  title: 'Cosmic Patterns',
                  children: [
                    {
                      title: 'Stellar Alignments',
                      route: '/analytics/patterns/stellar',
                      trigger: 'route',
                    },
                    {
                      title: 'Seasonal Cycles',
                      route: '/analytics/patterns/seasonal',
                      trigger: 'route',
                    },
                  ],
                },
              ],
            },
            {
              title: 'Sacred Settings',
              children: [
                {
                  title: 'Temple Configuration',
                  route: '/settings/temple',
                  trigger: 'route',
                },
                {
                  title: 'Divine Permissions',
                  children: [
                    {
                      title: 'Priest Hierarchy',
                      route: '/settings/permissions/priests',
                      trigger: 'route',
                    },
                    {
                      title: 'Sacred Access',
                      children: [
                        {
                          title: 'Inner Sanctum',
                          route: '/settings/permissions/access/sanctum',
                          trigger: 'route',
                        },
                        {
                          title: 'Sacred Chambers',
                          children: [
                            {
                              title: 'Library of Thoth',
                              route:
                                '/settings/permissions/access/chambers/library',
                              trigger: 'route',
                            },
                            {
                              title: 'Divine Vaults',
                              children: [
                                {
                                  title: 'Chamber of Truth',
                                  route:
                                    '/settings/permissions/access/chambers/vaults/truth',
                                  trigger: 'route',
                                },
                                {
                                  title: 'Hall of Judgment',
                                  route:
                                    '/settings/permissions/access/chambers/vaults/judgment',
                                  trigger: 'route',
                                },
                                {
                                  title: 'Eternal Archives',
                                  route:
                                    '/settings/permissions/access/chambers/vaults/eternal',
                                  trigger: 'route',
                                },
                              ],
                            },
                            {
                              title: 'Meditation Chambers',
                              route:
                                '/settings/permissions/access/chambers/meditation',
                              trigger: 'route',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
          interactiveNavItems = [
            { title: 'Dashboard', route: '/dashboard', trigger: 'route' },
            {
              title: 'Quick Actions',
              children: [
                {
                  title: 'Export Data',
                  trigger: 'onClick',
                  onClick: () => alert('Exporting data...'),
                },
                {
                  title: 'Generate Report',
                  trigger: 'onClick',
                  onClick: () => alert('Generating report...'),
                },
                {
                  title: 'Clear Cache',
                  trigger: 'onClick',
                  onClick: () => alert('Cache cleared!'),
                },
              ],
            },
            { title: 'Settings', route: '/settings', trigger: 'route' },
          ],
          NavWrapper = ({ children }) =>
            (0, jsx_runtime.jsx)('div', {
              style: {
                height: '600px',
                width: '320px',
                position: 'relative',
                overflow: 'visible',
                minWidth: 'fit-content',
              },
              children,
            }),
          MobileNavDemo = ({ navItems, sacredtheme = !1 }) => {
            const [mobileOpen, setMobileOpen] = (0, react.useState)(!1)
            return (0, jsx_runtime.jsxs)('div', {
              style: { height: '400px', width: '100%', position: 'relative' },
              children: [
                (0, jsx_runtime.jsx)('button', {
                  onClick: () => setMobileOpen(!0),
                  style: {
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 1e3,
                    padding: '0.5rem 1rem',
                    backgroundColor: sacredtheme ? '#FFD700' : '#3B82F6',
                    color: sacredtheme ? '#1C1917' : 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                  },
                  children: 'Open Nav',
                }),
                (0, jsx_runtime.jsx)(components_Nav, {
                  items: navItems,
                  variant: 'temporary',
                  mobileOpen,
                  onClose: () => setMobileOpen(!1),
                  sacredtheme,
                  verticalNavTitle: 'Mobile Navigation',
                  sacredTitle: 'Sacred Mobile',
                  sacredSubtitle: 'The Portable Wisdom',
                }),
              ],
            })
          },
          nav_stories = {
            title: 'Components/Nav',
            component: components_Nav,
            argTypes: {
              items: {
                control: 'object',
                description:
                  'Array of navigation items with hierarchical structure',
              },
              sacredtheme: {
                control: 'boolean',
                description:
                  'Enable Egyptian-inspired sacred theme with animations',
              },
              showSearchableNav: {
                control: 'boolean',
                description: 'Show/hide the searchable navigation dropdown',
              },
              showTitle: {
                control: 'boolean',
                description: 'Show/hide the navigation title',
              },
              showLine: {
                control: 'boolean',
                description: 'Show/hide the divider line',
              },
              variant: {
                control: 'select',
                options: ['permanent', 'temporary'],
                description:
                  'Navigation variant (permanent or mobile temporary)',
              },
              anchor: {
                control: 'select',
                options: ['left', 'right'],
                description: 'Anchor position for the navigation',
              },
              verticalNavTitle: {
                control: 'text',
                description: 'Title for regular theme navigation',
              },
              sacredTitle: {
                control: 'text',
                description: 'Title for sacred theme navigation',
              },
              sacredSubtitle: {
                control: 'text',
                description: 'Subtitle for sacred theme navigation',
              },
              backgroundcolor: {
                control: 'color',
                description: 'Custom background color for the navigation',
              },
            },
          },
          SixLevelLightTheme = {
            name: 'Six Level/Light Theme',
            render: () =>
              (0, jsx_runtime.jsx)(NavWrapper, {
                children: (0, jsx_runtime.jsx)(components_Nav, {
                  items: sixLevelNavItems,
                  verticalNavTitle: 'Six Level Navigation',
                  pathname: '/management/users/permissions/advanced/security',
                }),
              }),
            parameters: {
              docs: {
                description: {
                  story:
                    'Demonstrates 6 levels of navigation hierarchy with light theme. Shows dynamic width expansion and progressive indentation.',
                },
              },
            },
          },
          SixLevelSacredTheme = {
            name: 'Six Level/Sacred Theme',
            render: () =>
              (0, jsx_runtime.jsx)(NavWrapper, {
                children: (0, jsx_runtime.jsx)(components_Nav, {
                  items: sacredSixLevelNavItems,
                  sacredtheme: !0,
                  sacredTitle: 'Sacred Hierarchy',
                  sacredSubtitle: 'Six Levels of Divine Organization',
                  pathname:
                    '/archives/scrolls/manuscripts/papyrus/math/astronomy',
                }),
              }),
            parameters: {
              backgrounds: { default: 'dark' },
              docs: {
                description: {
                  story:
                    'Sacred theme with 6 levels of navigation. Features Egyptian naming, progressive indentation, and golden styling with hieroglyphic elements.',
                },
              },
            },
          },
          SixLevelComparison = {
            name: 'Six Level/Theme Comparison',
            render: () =>
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  display: 'flex',
                  gap: '2rem',
                  alignItems: 'flex-start',
                  overflow: 'visible',
                },
                children: [
                  (0, jsx_runtime.jsxs)('div', {
                    style: { minWidth: 'fit-content' },
                    children: [
                      (0, jsx_runtime.jsx)('h3', {
                        style: { margin: '0 0 1rem 0', color: '#374151' },
                        children: 'Light Theme Navigation',
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: {
                          height: '600px',
                          width: '320px',
                          position: 'relative',
                          overflow: 'visible',
                          minWidth: 'fit-content',
                        },
                        children: (0, jsx_runtime.jsx)(components_Nav, {
                          items: sixLevelNavItems,
                          verticalNavTitle: 'Light Navigation',
                          pathname:
                            '/management/users/permissions/advanced/audit',
                        }),
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: { minWidth: 'fit-content' },
                    children: [
                      (0, jsx_runtime.jsx)('h3', {
                        style: { margin: '0 0 1rem 0', color: '#FFD700' },
                        children: 'Sacred Theme Navigation',
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: {
                          height: '600px',
                          width: '320px',
                          position: 'relative',
                          overflow: 'visible',
                          minWidth: 'fit-content',
                        },
                        children: (0, jsx_runtime.jsx)(components_Nav, {
                          items: sacredSixLevelNavItems,
                          sacredtheme: !0,
                          sacredTitle: 'Sacred Archives',
                          sacredSubtitle: 'Divine Wisdom Hierarchy',
                          pathname:
                            '/governance/court/officials/scribes/scholars/guardians',
                        }),
                      }),
                    ],
                  }),
                ],
              }),
            parameters: {
              layout: 'fullscreen',
              backgrounds: { default: 'light' },
              docs: {
                description: {
                  story:
                    'Side-by-side comparison of 6-level navigation with light and sacred themes, demonstrating dynamic width expansion.',
                },
              },
            },
          },
          SixLevelDynamicWidth = {
            name: 'Six Level/Dynamic Width Demo',
            render: () =>
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                },
                children: [
                  (0, jsx_runtime.jsxs)('div', {
                    children: [
                      (0, jsx_runtime.jsx)('h3', {
                        style: { margin: '0 0 1rem 0', color: '#dc2626' },
                        children: 'Fixed Width Container (320px)',
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: {
                          height: '500px',
                          width: '320px',
                          position: 'relative',
                          border: '2px dashed #dc2626',
                          overflow: 'hidden',
                        },
                        children: (0, jsx_runtime.jsx)(components_Nav, {
                          items: [
                            {
                              title:
                                'Very Long Navigation Item That Should Be Cut Off',
                              children: [
                                {
                                  title:
                                    'Another Extremely Long Menu Item That Demonstrates Text Truncation',
                                  route: '/long-path',
                                  trigger: 'route',
                                },
                              ],
                            },
                          ],
                          verticalNavTitle: 'Fixed Width',
                          pathname: '/long-path',
                        }),
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    children: [
                      (0, jsx_runtime.jsx)('h3', {
                        style: { margin: '0 0 1rem 0', color: '#16a34a' },
                        children: 'Dynamic Width Container (Auto-expands)',
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: {
                          height: '500px',
                          width: '320px',
                          position: 'relative',
                          border: '2px dashed #16a34a',
                          overflow: 'visible',
                          minWidth: 'fit-content',
                        },
                        children: (0, jsx_runtime.jsx)(components_Nav, {
                          items: [
                            {
                              title:
                                'Very Long Navigation Item That Should Be Fully Visible',
                              children: [
                                {
                                  title:
                                    'Another Extremely Long Menu Item That Demonstrates Full Text Display',
                                  route: '/long-path-visible',
                                  trigger: 'route',
                                },
                              ],
                            },
                          ],
                          verticalNavTitle: 'Dynamic Width',
                          pathname: '/long-path-visible',
                        }),
                      }),
                    ],
                  }),
                ],
              }),
            parameters: {
              layout: 'fullscreen',
              backgrounds: { default: 'light' },
              docs: {
                description: {
                  story:
                    'Demonstrates the difference between fixed width containers and dynamic width containers with long navigation text.',
                },
              },
            },
          },
          LightTheme = {
            name: 'Basic/Light Theme',
            render: () =>
              (0, jsx_runtime.jsx)(NavWrapper, {
                children: (0, jsx_runtime.jsx)(components_Nav, {
                  items: basicNavItems,
                  verticalNavTitle: 'Light Navigation',
                  pathname: '/dashboard',
                }),
              }),
          },
          DarkTheme = {
            name: 'Basic/Dark Theme',
            render: () =>
              (0, jsx_runtime.jsx)(NavWrapper, {
                children: (0, jsx_runtime.jsx)(components_Nav, {
                  items: basicNavItems,
                  verticalNavTitle: 'Dark Navigation',
                  backgroundcolor: '#1F2937',
                  pathname: '/analytics',
                }),
              }),
            parameters: { backgrounds: { default: 'dark' } },
          },
          SacredTheme = {
            name: 'Basic/Sacred Theme',
            render: () =>
              (0, jsx_runtime.jsx)(NavWrapper, {
                children: (0, jsx_runtime.jsx)(components_Nav, {
                  items: basicNavItems,
                  sacredtheme: !0,
                  sacredTitle: 'Sacred Navigation',
                  sacredSubtitle: 'Divine Interface',
                  pathname: '/settings',
                }),
              }),
            parameters: { backgrounds: { default: 'dark' } },
          },
          NestedNavigation = {
            name: 'Structure/Nested',
            render: () =>
              (0, jsx_runtime.jsx)(NavWrapper, {
                children: (0, jsx_runtime.jsx)(components_Nav, {
                  items: nestedNavItems,
                  verticalNavTitle: 'Nested Navigation',
                  pathname: '/users/add',
                }),
              }),
          },
          InteractiveNavigation = {
            name: 'Structure/Interactive',
            render: () =>
              (0, jsx_runtime.jsx)(NavWrapper, {
                children: (0, jsx_runtime.jsx)(components_Nav, {
                  items: interactiveNavItems,
                  verticalNavTitle: 'Interactive Navigation',
                  pathname: '/dashboard',
                }),
              }),
          },
          TemporaryVariant = {
            name: 'Variant/Temporary (Mobile)',
            render: () =>
              (0, jsx_runtime.jsx)(MobileNavDemo, {
                navItems: sixLevelNavItems,
              }),
          },
          SacredTemporaryVariant = {
            name: 'Variant/Sacred Mobile',
            render: () =>
              (0, jsx_runtime.jsx)(MobileNavDemo, {
                navItems: sacredSixLevelNavItems,
                sacredtheme: !0,
              }),
            parameters: { backgrounds: { default: 'dark' } },
          },
          WithoutSearch = {
            name: 'Configuration/No Search',
            render: () =>
              (0, jsx_runtime.jsx)(NavWrapper, {
                children: (0, jsx_runtime.jsx)(components_Nav, {
                  items: sixLevelNavItems,
                  showSearchableNav: !1,
                  verticalNavTitle: 'No Search Navigation',
                  pathname: '/management/users/permissions/roles',
                }),
              }),
          },
          MinimalConfiguration = {
            name: 'Configuration/Minimal',
            render: () =>
              (0, jsx_runtime.jsx)(NavWrapper, {
                children: (0, jsx_runtime.jsx)(components_Nav, {
                  items: basicNavItems,
                  showSearchableNav: !1,
                  showTitle: !1,
                  showLine: !1,
                  pathname: '/analytics',
                }),
              }),
          },
          ComprehensiveShowcase = {
            name: 'Comprehensive Showcase',
            render: () =>
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '2rem',
                  padding: '2rem',
                  minHeight: '100vh',
                  overflow: 'visible',
                },
                children: [
                  (0, jsx_runtime.jsxs)('div', {
                    style: {
                      height: '600px',
                      position: 'relative',
                      overflow: 'visible',
                      minWidth: 'fit-content',
                    },
                    children: [
                      (0, jsx_runtime.jsx)('h3', {
                        style: {
                          margin: '0 0 1rem 0',
                          color: '#374151',
                          textAlign: 'center',
                        },
                        children: 'Six Level Light Theme',
                      }),
                      (0, jsx_runtime.jsx)(components_Nav, {
                        items: sixLevelNavItems,
                        verticalNavTitle: 'Light Navigation',
                        pathname:
                          '/management/users/permissions/advanced/audit',
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: {
                      height: '600px',
                      position: 'relative',
                      overflow: 'visible',
                      minWidth: 'fit-content',
                    },
                    children: [
                      (0, jsx_runtime.jsx)('h3', {
                        style: {
                          margin: '0 0 1rem 0',
                          color: '#FFD700',
                          textAlign: 'center',
                        },
                        children: 'Six Level Sacred Theme',
                      }),
                      (0, jsx_runtime.jsx)(components_Nav, {
                        items: sacredSixLevelNavItems,
                        sacredtheme: !0,
                        sacredTitle: 'Sacred Archives',
                        sacredSubtitle: 'Divine Hierarchy',
                        pathname:
                          '/governance/court/officials/scribes/scholars/keepers',
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: {
                      height: '600px',
                      position: 'relative',
                      overflow: 'visible',
                      minWidth: 'fit-content',
                    },
                    children: [
                      (0, jsx_runtime.jsx)('h3', {
                        style: {
                          margin: '0 0 1rem 0',
                          color: '#7C3AED',
                          textAlign: 'center',
                        },
                        children: 'Interactive Features',
                      }),
                      (0, jsx_runtime.jsx)(components_Nav, {
                        items: interactiveNavItems,
                        verticalNavTitle: 'Interactive Nav',
                        backgroundcolor: '#7C3AED',
                        pathname: '/dashboard',
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: {
                      height: '600px',
                      position: 'relative',
                      overflow: 'visible',
                      minWidth: 'fit-content',
                    },
                    children: [
                      (0, jsx_runtime.jsx)('h3', {
                        style: {
                          margin: '0 0 1rem 0',
                          color: '#DC2626',
                          textAlign: 'center',
                        },
                        children: 'Custom Styling',
                      }),
                      (0, jsx_runtime.jsx)(components_Nav, {
                        items: nestedNavItems,
                        verticalNavTitle: 'Custom Navigation',
                        backgroundcolor: '#DC2626',
                        marginabovetitle: '1rem',
                        marginbelowtitle: '1rem',
                        pathname: '/users/roles',
                      }),
                    ],
                  }),
                ],
              }),
            parameters: { layout: 'fullscreen' },
          },
          InteractionTest = {
            name: 'Interaction Test',
            render: () =>
              (0, jsx_runtime.jsx)(NavWrapper, {
                children: (0, jsx_runtime.jsx)(components_Nav, {
                  items: sixLevelNavItems,
                  verticalNavTitle: 'Test Navigation',
                  pathname: '/management/users/permissions/advanced/security',
                }),
              }),
            play: async ({ canvasElement }) => {
              const canvas = (0, dist.ux)(canvasElement),
                managementItem = canvas.getByText('Management')
              ;(await dist.Q4.click(managementItem),
                await (0, dist.E3)(canvas.getByText('Users')).toBeVisible())
              const usersItem = canvas.getByText('Users')
              ;(await dist.Q4.click(usersItem),
                await (0, dist.E3)(
                  canvas.getByText('User Details')
                ).toBeVisible())
            },
          },
          __namedExportsOrder = [
            'SixLevelLightTheme',
            'SixLevelSacredTheme',
            'SixLevelComparison',
            'SixLevelDynamicWidth',
            'LightTheme',
            'DarkTheme',
            'SacredTheme',
            'NestedNavigation',
            'InteractiveNavigation',
            'TemporaryVariant',
            'SacredTemporaryVariant',
            'WithoutSearch',
            'MinimalConfiguration',
            'ComprehensiveShowcase',
            'InteractionTest',
          ]
      },
      './src/components/Typography/index.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        'use strict'
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
