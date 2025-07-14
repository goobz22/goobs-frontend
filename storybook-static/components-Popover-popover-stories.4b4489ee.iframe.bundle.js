;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [2495],
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
      './src/components/Button/index.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        'use strict'
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
      './src/components/Popover/index.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        'use strict'
        __webpack_require__.d(__webpack_exports__, {
          A: () => components_Popover,
        })
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          shared = __webpack_require__('./src/theme/shared.ts')
        const popoverThemes = {
            light: {
              popover: {
                position: 'fixed',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                boxShadow: shared.I4.light.medium,
                border: '1px solid rgba(226, 232, 240, 0.8)',
                backdropFilter: 'blur(8px)',
                marginTop: '0.5rem',
                zIndex: 1300,
              },
              transition: shared.Ds.medium,
            },
            dark: {
              popover: {
                position: 'fixed',
                backgroundColor: 'rgba(31, 41, 55, 0.95)',
                borderRadius: '12px',
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(75, 85, 99, 0.8)',
                backdropFilter: 'blur(8px)',
                marginTop: '0.5rem',
                zIndex: 1300,
              },
              transition: shared.Ds.medium,
            },
            sacred: {
              popover: {
                position: 'fixed',
                backgroundColor: 'rgba(10, 10, 10, 0.95)',
                borderRadius: '8px',
                boxShadow: shared.I4.sacred.medium,
                border: '2px solid rgba(255, 215, 0, 0.4)',
                backdropFilter: 'blur(4px)',
                marginTop: '0.5rem',
                zIndex: 1300,
                backgroundImage:
                  '\n        radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),\n        radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.03) 0%, transparent 50%)\n      ',
              },
              transition: shared.Ds.premium,
            },
          },
          getPopoverStyles = (styles, anchorRect) => {
            const themeConfig = (styles => {
              const theme = (null == styles ? void 0 : styles.theme) || 'light',
                baseTheme = popoverThemes[theme]
              return styles
                ? {
                    popover: {
                      ...baseTheme.popover,
                      backgroundColor:
                        styles.backgroundColor ||
                        baseTheme.popover.backgroundColor,
                      border: styles.borderColor
                        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
                        : baseTheme.popover.border,
                      borderRadius:
                        styles.borderRadius || baseTheme.popover.borderRadius,
                      boxShadow:
                        styles.boxShadow || baseTheme.popover.boxShadow,
                      backdropFilter:
                        styles.backdropFilter ||
                        baseTheme.popover.backdropFilter,
                      backgroundImage:
                        styles.backgroundImage ||
                        baseTheme.popover.backgroundImage,
                      marginTop:
                        styles.marginTop || baseTheme.popover.marginTop,
                      zIndex: styles.zIndex || baseTheme.popover.zIndex,
                      position: styles.position || baseTheme.popover.position,
                    },
                    transition: styles.transitionDuration
                      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
                      : baseTheme.transition,
                  }
                : baseTheme
            })(styles)
            return {
              popover: {
                position: themeConfig.popover.position,
                backgroundColor: themeConfig.popover.backgroundColor,
                borderRadius: themeConfig.popover.borderRadius,
                boxShadow: themeConfig.popover.boxShadow,
                border: themeConfig.popover.border,
                backdropFilter: themeConfig.popover.backdropFilter,
                backgroundImage: themeConfig.popover.backgroundImage,
                marginTop: themeConfig.popover.marginTop,
                zIndex: themeConfig.popover.zIndex,
                transition: themeConfig.transition,
                maxWidth: null == styles ? void 0 : styles.maxWidth,
                width: null == styles ? void 0 : styles.width,
                minWidth: null == styles ? void 0 : styles.minWidth,
                height: null == styles ? void 0 : styles.height,
                maxHeight: null == styles ? void 0 : styles.maxHeight,
                minHeight: null == styles ? void 0 : styles.minHeight,
                padding: null == styles ? void 0 : styles.padding,
                margin: null == styles ? void 0 : styles.margin,
                ...(anchorRect && {
                  top:
                    (null == styles ? void 0 : styles.top) || anchorRect.bottom,
                  left:
                    (null == styles ? void 0 : styles.left) || anchorRect.left,
                  right: null == styles ? void 0 : styles.right,
                  bottom: null == styles ? void 0 : styles.bottom,
                }),
              },
            }
          },
          Popover = ({ open, onClose, anchorEl, children, styles }) => {
            const popoverRef = (0, react.useRef)(null)
            if (
              ((0, react.useEffect)(() => {
                const handleClickOutside = event => {
                  popoverRef.current &&
                    !popoverRef.current.contains(event.target) &&
                    anchorEl &&
                    !anchorEl.contains(event.target) &&
                    onClose()
                }
                return (
                  open
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
                )
              }, [open, onClose, anchorEl]),
              !open || !anchorEl)
            )
              return null
            const rect = anchorEl.getBoundingClientRect(),
              computedStyles = getPopoverStyles(styles, rect)
            return (0, jsx_runtime.jsx)('div', {
              ref: popoverRef,
              style: computedStyles.popover,
              children,
            })
          },
          components_Popover = Popover
        Popover.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'Popover',
          props: {
            open: {
              required: !0,
              tsType: { name: 'boolean' },
              description: 'Whether the popover is open',
            },
            onClose: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: 'Function to call when the popover should close',
            },
            anchorEl: {
              required: !0,
              tsType: {
                name: 'union',
                raw: 'HTMLElement | null',
                elements: [{ name: 'HTMLElement' }, { name: 'null' }],
              },
              description:
                'The anchor element to position the popover relative to',
            },
            children: {
              required: !0,
              tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
              description: 'The content to display in the popover',
            },
            styles: {
              required: !1,
              tsType: { name: 'PopoverStyles' },
              description:
                'Custom styles to apply to the popover using the theme system',
            },
          },
        }
      },
      './src/components/Popover/popover.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        'use strict'
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            CustomColors: () => CustomColors,
            CustomPosition: () => CustomPosition,
            Dark: () => Dark,
            DarkWithMenu: () => DarkWithMenu,
            InteractionTest: () => InteractionTest,
            Light: () => Light,
            LightCustomSize: () => LightCustomSize,
            LightWithCustomContent: () => LightWithCustomContent,
            Sacred: () => Sacred,
            SacredWithMysticalContent: () => SacredWithMysticalContent,
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
            './src/components/Popover/index.tsx'
          ),
          _Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
            './src/components/Button/index.tsx'
          )
        const __WEBPACK_DEFAULT_EXPORT__ = {
            title: 'Components/Popover',
            component: _index__WEBPACK_IMPORTED_MODULE_3__.A,
            parameters: { layout: 'centered' },
            argTypes: {
              open: { control: 'boolean' },
              styles: {
                control: 'object',
                description: 'Custom styles using the theme system',
              },
            },
            tags: ['autodocs'],
          },
          PopoverContent = ({ theme }) =>
            (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
              style: { padding: '16px', minWidth: '200px' },
              children: [
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('h3', {
                  style: {
                    margin: '0 0 8px 0',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    color:
                      'sacred' === theme
                        ? '#FFD700'
                        : 'dark' === theme
                          ? 'white'
                          : '#333',
                  },
                  children: 'Popover Content',
                }),
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('p', {
                  style: {
                    margin: '0 0 12px 0',
                    fontSize: '0.875rem',
                    color:
                      'sacred' === theme
                        ? '#f5f5dc'
                        : 'dark' === theme
                          ? '#d1d5db'
                          : '#666',
                  },
                  children:
                    'This is some content inside the popover. It can contain any React elements.',
                }),
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                  style: { display: 'flex', gap: '8px' },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _Button__WEBPACK_IMPORTED_MODULE_4__.A,
                    {
                      styles: { theme: theme || 'light', fontSize: '0.875rem' },
                      children: 'Action',
                    }
                  ),
                }),
              ],
            }),
          InteractivePopover = ({ styles, children }) => {
            const [open, setOpen] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
              anchorRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null)
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: { padding: '100px' },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _Button__WEBPACK_IMPORTED_MODULE_4__.A,
                    {
                      ref: anchorRef,
                      styles: {
                        theme:
                          (null == styles ? void 0 : styles.theme) || 'light',
                      },
                      onClick: () => setOpen(!open),
                      children: 'Toggle Popover',
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _index__WEBPACK_IMPORTED_MODULE_3__.A,
                    {
                      open,
                      onClose: () => setOpen(!1),
                      anchorEl: anchorRef.current,
                      styles,
                      children,
                    }
                  ),
                ],
              }
            )
          },
          Light = {
            name: 'Light/Basic',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractivePopover,
                {
                  styles: { theme: 'light' },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    PopoverContent,
                    { theme: 'light' }
                  ),
                }
              ),
          },
          LightWithCustomContent = {
            name: 'Light/Custom Content',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractivePopover,
                {
                  styles: { theme: 'light', padding: '20px' },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                    style: { minWidth: '300px' },
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'h3',
                        {
                          style: {
                            margin: '0 0 12px 0',
                            fontSize: '1.125rem',
                            fontWeight: 'bold',
                          },
                          children: 'User Profile',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                        'div',
                        {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '12px',
                          },
                          children: [
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'div',
                              {
                                style: {
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  backgroundColor: '#3b82f6',
                                },
                              }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                              'div',
                              {
                                children: [
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    'p',
                                    {
                                      style: {
                                        margin: '0',
                                        fontWeight: 'bold',
                                      },
                                      children: 'John Doe',
                                    }
                                  ),
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    'p',
                                    {
                                      style: {
                                        margin: '0',
                                        fontSize: '0.875rem',
                                        color: '#666',
                                      },
                                      children: 'john.doe@example.com',
                                    }
                                  ),
                                ],
                              }
                            ),
                          ],
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'div',
                        {
                          style: {
                            borderTop: '1px solid #e5e7eb',
                            paddingTop: '12px',
                          },
                          children: (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            _Button__WEBPACK_IMPORTED_MODULE_4__.A,
                            {
                              styles: { theme: 'light', width: '100%' },
                              children: 'View Profile',
                            }
                          ),
                        }
                      ),
                    ],
                  }),
                }
              ),
          },
          LightCustomSize = {
            name: 'Light/Custom Size',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractivePopover,
                {
                  styles: {
                    theme: 'light',
                    maxWidth: '400px',
                    minHeight: '200px',
                    padding: '24px',
                  },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'h3',
                        {
                          style: {
                            margin: '0 0 16px 0',
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                          },
                          children: 'Large Popover',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'p',
                        {
                          style: { margin: '0 0 16px 0', color: '#666' },
                          children:
                            'This popover demonstrates custom sizing options. You can control width, height, and padding through the styles prop.',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'div',
                        {
                          style: {
                            height: '100px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '8px',
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          },
                          children: (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            'p',
                            {
                              style: { margin: '0', color: '#666' },
                              children: 'Custom content area',
                            }
                          ),
                        }
                      ),
                    ],
                  }),
                }
              ),
          },
          Dark = {
            name: 'Dark/Basic',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractivePopover,
                {
                  styles: { theme: 'dark' },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    PopoverContent,
                    { theme: 'dark' }
                  ),
                }
              ),
            parameters: { backgrounds: { default: 'dark' } },
          },
          DarkWithMenu = {
            name: 'Dark/Menu',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractivePopover,
                {
                  styles: { theme: 'dark', padding: '8px' },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                    style: { minWidth: '180px' },
                    children: ['Profile', 'Settings', 'Help', 'Sign Out'].map(
                      item =>
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'div',
                          {
                            style: {
                              padding: '8px 12px',
                              cursor: 'pointer',
                              borderRadius: '4px',
                              color: '#d1d5db',
                              fontSize: '0.875rem',
                              transition: 'background-color 0.2s',
                            },
                            onMouseEnter: e => {
                              e.currentTarget.style.backgroundColor =
                                'rgba(75, 85, 99, 0.5)'
                            },
                            onMouseLeave: e => {
                              e.currentTarget.style.backgroundColor =
                                'transparent'
                            },
                            children: item,
                          },
                          item
                        )
                    ),
                  }),
                }
              ),
            parameters: { backgrounds: { default: 'dark' } },
          },
          Sacred = {
            name: 'Sacred/Basic',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractivePopover,
                {
                  styles: { theme: 'sacred' },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    PopoverContent,
                    { theme: 'sacred' }
                  ),
                }
              ),
            parameters: { backgrounds: { default: 'dark' } },
          },
          SacredWithMysticalContent = {
            name: 'Sacred/Mystical Content',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractivePopover,
                {
                  styles: { theme: 'sacred', padding: '20px' },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                    style: { minWidth: '250px', color: '#f5f5dc' },
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'h3',
                        {
                          style: {
                            margin: '0 0 12px 0',
                            fontSize: '1.125rem',
                            fontWeight: 'bold',
                            color: '#FFD700',
                            textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                          },
                          children: '⚡ Sacred Powers ⚡',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'div',
                        {
                          style: { marginBottom: '16px' },
                          children: [
                            'Divine Protection',
                            'Mystic Insight',
                            'Sacred Healing',
                          ].map(power =>
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                              'div',
                              {
                                style: {
                                  padding: '6px 0',
                                  fontSize: '0.875rem',
                                  borderBottom:
                                    '1px solid rgba(255, 215, 0, 0.2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                },
                                children: [
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    'span',
                                    {
                                      style: { color: '#FFD700' },
                                      children: '✨',
                                    }
                                  ),
                                  power,
                                ],
                              },
                              power
                            )
                          ),
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        _Button__WEBPACK_IMPORTED_MODULE_4__.A,
                        {
                          styles: { theme: 'sacred', width: '100%' },
                          children: 'Activate Power',
                        }
                      ),
                    ],
                  }),
                }
              ),
            parameters: { backgrounds: { default: 'dark' } },
          },
          CustomColors = {
            name: 'Customization/Custom Colors',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractivePopover,
                {
                  styles: {
                    theme: 'light',
                    backgroundColor: 'rgba(254, 242, 242, 0.95)',
                    borderColor: '#fca5a5',
                    borderWidth: '2px',
                  },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                    style: { padding: '16px', minWidth: '200px' },
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'h3',
                        {
                          style: {
                            margin: '0 0 8px 0',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            color: '#dc2626',
                          },
                          children: '🚨 Warning',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'p',
                        {
                          style: {
                            margin: '0 0 12px 0',
                            fontSize: '0.875rem',
                            color: '#991b1b',
                          },
                          children:
                            'This popover uses custom colors to indicate a warning state.',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        _Button__WEBPACK_IMPORTED_MODULE_4__.A,
                        {
                          styles: {
                            theme: 'light',
                            backgroundColor: '#dc2626',
                            color: 'white',
                          },
                          children: 'Acknowledge',
                        }
                      ),
                    ],
                  }),
                }
              ),
          },
          CustomPosition = {
            name: 'Customization/Custom Position',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractivePopover,
                {
                  styles: {
                    theme: 'light',
                    marginTop: '2rem',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                    style: {
                      padding: '16px',
                      minWidth: '200px',
                      textAlign: 'center',
                    },
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'h3',
                        {
                          style: {
                            margin: '0 0 8px 0',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                          },
                          children: 'Custom Position',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'p',
                        {
                          style: {
                            margin: '0',
                            fontSize: '0.875rem',
                            color: '#666',
                          },
                          children:
                            'This popover has custom positioning with centered alignment.',
                        }
                      ),
                    ],
                  }),
                }
              ),
          },
          InteractionTestComponent = () => {
            const [open, setOpen] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
              anchorRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null)
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: { padding: '100px' },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _Button__WEBPACK_IMPORTED_MODULE_4__.A,
                    {
                      ref: anchorRef,
                      styles: { theme: 'light' },
                      onClick: () => setOpen(!open),
                      'data-testid': 'toggle-popover',
                      children: 'Toggle Test Popover',
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _index__WEBPACK_IMPORTED_MODULE_3__.A,
                    {
                      open,
                      onClose: () => setOpen(!1),
                      anchorEl: anchorRef.current,
                      styles: { theme: 'light' },
                      children: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                        'div',
                        {
                          style: { padding: '16px' },
                          children: [
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'h3',
                              {
                                'data-testid': 'popover-title',
                                children: 'Test Popover',
                              }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'p',
                              {
                                'data-testid': 'popover-content',
                                children:
                                  'This popover can be closed by clicking outside or pressing Escape.',
                              }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_4__.A,
                              {
                                styles: { theme: 'light' },
                                onClick: () => setOpen(!1),
                                'data-testid': 'close-popover',
                                children: 'Close Popover',
                              }
                            ),
                          ],
                        }
                      ),
                    }
                  ),
                ],
              }
            )
          },
          InteractionTest = {
            name: 'Interaction and A11y Test',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractionTestComponent,
                {}
              ),
            play: async ({ canvasElement }) => {
              const canvas = (0,
                _storybook_test__WEBPACK_IMPORTED_MODULE_2__.ux)(canvasElement),
                toggleButton = canvas.getByTestId('toggle-popover')
              await _storybook_test__WEBPACK_IMPORTED_MODULE_2__.Q4.click(
                toggleButton
              )
              const popoverTitle = canvas.getByTestId('popover-title')
              await (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                popoverTitle
              ).toBeVisible()
              const closeButton = canvas.getByTestId('close-popover')
              ;(await _storybook_test__WEBPACK_IMPORTED_MODULE_2__.Q4.click(
                closeButton
              ),
                await (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                  popoverTitle
                ).not.toBeVisible())
            },
          },
          __namedExportsOrder = [
            'Light',
            'LightWithCustomContent',
            'LightCustomSize',
            'Dark',
            'DarkWithMenu',
            'Sacred',
            'SacredWithMysticalContent',
            'CustomColors',
            'CustomPosition',
            'InteractionTest',
          ]
      },
    },
  ]
)
