'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [5027],
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
      './src/components/Tooltip/index.tsx': (
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
          console = __webpack_require__(
            './node_modules/console-browserify/index.js'
          )
        const premiumStyles = {
            container: { position: 'relative', display: 'inline-block' },
            tooltip: {
              position: 'fixed',
              zIndex: 9999,
              pointerEvents: 'none',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
              opacity: 0,
              transform: 'scale(0.95)',
            },
            tooltipVisible: { opacity: 1, transform: 'scale(1)' },
            content: {
              padding: '8px 12px',
              fontSize: '14px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              position: 'relative',
              backgroundColor: 'rgba(23, 23, 23, 0.9)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(4px)',
              fontFamily: '"Inter", sans-serif',
            },
            arrow: {
              position: 'absolute',
              width: 0,
              height: 0,
              border: '5px solid transparent',
            },
          },
          sacredStyles = {
            container: { position: 'relative', display: 'inline-block' },
            tooltip: {
              position: 'fixed',
              zIndex: 9999,
              pointerEvents: 'none',
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              opacity: 0,
              transform: 'scale(0.9)',
            },
            tooltipVisible: { opacity: 1, transform: 'scale(1)' },
            content: {
              padding: '10px 16px',
              fontSize: '15px',
              borderRadius: '10px',
              boxShadow:
                '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
              position: 'relative',
              backgroundColor: 'rgba(10, 10, 10, 0.9)',
              color: '#FFD700',
              border: '1px solid rgba(255, 215, 0, 0.4)',
              backdropFilter: 'blur(8px)',
              fontFamily: '"Cinzel", serif',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
              animation: 'sacredTooltipGlow 3s ease-in-out infinite alternate',
            },
            arrow: {
              position: 'absolute',
              width: 0,
              height: 0,
              border: '6px solid transparent',
            },
          },
          StyledTooltip = ({
            children,
            title,
            tooltipplacement = 'top',
            offsetX = 0,
            offsetY = 0,
            sacredtheme = !1,
            arrow = !0,
            open: controlledOpen,
            onOpen,
            onClose,
            enterDelay = 100,
            leaveDelay = 0,
            className,
            style,
          }) => {
            const [isVisible, setIsVisible] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
              [position, setPosition] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)({ x: 0, y: 0 }),
              triggerRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),
              tooltipRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),
              enterTimeoutRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(
                null
              ),
              leaveTimeoutRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(
                null
              ),
              isControlled = void 0 !== controlledOpen,
              showTooltip = isControlled ? controlledOpen : isVisible,
              styles = sacredtheme ? sacredStyles : premiumStyles
            console.log('StyledTooltip rendered:', {
              title,
              sacredtheme,
              isVisible: showTooltip,
            })
            ;((0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
              const updatePosition = () => {
                if (!triggerRef.current || !tooltipRef.current) return
                const triggerRect = triggerRef.current.getBoundingClientRect(),
                  tooltipRect = tooltipRef.current.getBoundingClientRect()
                let x = 0,
                  y = 0
                const arrowOffset = sacredtheme ? 10 : 8
                switch (tooltipplacement) {
                  case 'top':
                    ;((x =
                      triggerRect.left +
                      triggerRect.width / 2 -
                      tooltipRect.width / 2),
                      (y = triggerRect.top - tooltipRect.height - arrowOffset))
                    break
                  case 'bottom':
                    ;((x =
                      triggerRect.left +
                      triggerRect.width / 2 -
                      tooltipRect.width / 2),
                      (y = triggerRect.bottom + arrowOffset))
                    break
                  case 'left':
                    ;((x = triggerRect.left - tooltipRect.width - arrowOffset),
                      (y =
                        triggerRect.top +
                        triggerRect.height / 2 -
                        tooltipRect.height / 2))
                    break
                  case 'right':
                    ;((x = triggerRect.right + arrowOffset),
                      (y =
                        triggerRect.top +
                        triggerRect.height / 2 -
                        tooltipRect.height / 2))
                }
                ;((x += offsetX), (y += offsetY))
                const viewportWidth = window.innerWidth,
                  viewportHeight = window.innerHeight
                ;(x < 0 && (x = arrowOffset),
                  x + tooltipRect.width > viewportWidth &&
                    (x = viewportWidth - tooltipRect.width - arrowOffset),
                  y < 0 && (y = arrowOffset),
                  y + tooltipRect.height > viewportHeight &&
                    (y = viewportHeight - tooltipRect.height - arrowOffset),
                  setPosition({ x, y }))
              }
              return (
                showTooltip &&
                  (updatePosition(),
                  window.addEventListener('scroll', updatePosition, !0),
                  window.addEventListener('resize', updatePosition)),
                () => {
                  ;(window.removeEventListener('scroll', updatePosition, !0),
                    window.removeEventListener('resize', updatePosition))
                }
              )
            }, [showTooltip, tooltipplacement, offsetX, offsetY, sacredtheme]),
              (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(
                () => () => {
                  ;(enterTimeoutRef.current &&
                    clearTimeout(enterTimeoutRef.current),
                    leaveTimeoutRef.current &&
                      clearTimeout(leaveTimeoutRef.current))
                },
                []
              ))
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment,
              {
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'div',
                    {
                      ref: triggerRef,
                      onMouseEnter: () => {
                        isControlled
                          ? null == onOpen || onOpen()
                          : (leaveTimeoutRef.current &&
                              clearTimeout(leaveTimeoutRef.current),
                            (enterTimeoutRef.current = setTimeout(() => {
                              ;(setIsVisible(!0), null == onOpen || onOpen())
                            }, enterDelay)))
                      },
                      onMouseLeave: () => {
                        isControlled
                          ? null == onClose || onClose()
                          : (enterTimeoutRef.current &&
                              clearTimeout(enterTimeoutRef.current),
                            (leaveTimeoutRef.current = setTimeout(() => {
                              ;(setIsVisible(!1), null == onClose || onClose())
                            }, leaveDelay)))
                      },
                      style: { ...styles.container, ...style },
                      className,
                      children,
                    }
                  ),
                  title &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      'div',
                      {
                        ref: tooltipRef,
                        style: {
                          ...styles.tooltip,
                          ...(showTooltip && styles.tooltipVisible),
                          left: `${position.x}px`,
                          top: `${position.y}px`,
                        },
                        children: (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'div',
                          {
                            style: styles.content,
                            children: [
                              title,
                              arrow &&
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                  'div',
                                  {
                                    style: (() => {
                                      const color = sacredtheme
                                        ? '#FFD700'
                                        : 'rgba(23, 23, 23, 0.9)'
                                      switch (tooltipplacement) {
                                        case 'top':
                                          return {
                                            ...styles.arrow,
                                            top: '100%',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            borderTopColor: color,
                                          }
                                        case 'bottom':
                                          return {
                                            ...styles.arrow,
                                            bottom: '100%',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            borderBottomColor: color,
                                          }
                                        case 'left':
                                          return {
                                            ...styles.arrow,
                                            left: '100%',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            borderLeftColor: color,
                                          }
                                        case 'right':
                                          return {
                                            ...styles.arrow,
                                            right: '100%',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            borderRightColor: color,
                                          }
                                        default:
                                          return {}
                                      }
                                    })(),
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
          __WEBPACK_DEFAULT_EXPORT__ = StyledTooltip
        StyledTooltip.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'StyledTooltip',
          props: {
            children: {
              required: !0,
              tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
              description: '',
            },
            title: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            tooltipplacement: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "'left' | 'right' | 'top' | 'bottom'",
                elements: [
                  { name: 'literal', value: "'left'" },
                  { name: 'literal', value: "'right'" },
                  { name: 'literal', value: "'top'" },
                  { name: 'literal', value: "'bottom'" },
                ],
              },
              description: '',
              defaultValue: { value: "'top'", computed: !1 },
            },
            offsetX: {
              required: !1,
              tsType: { name: 'number' },
              description: '',
              defaultValue: { value: '0', computed: !1 },
            },
            offsetY: {
              required: !1,
              tsType: { name: 'number' },
              description: '',
              defaultValue: { value: '0', computed: !1 },
            },
            sacredtheme: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'If true, enables the stylized "sacred" theme.',
              defaultValue: { value: 'false', computed: !1 },
            },
            arrow: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'true', computed: !1 },
            },
            open: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
            },
            onOpen: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
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
            enterDelay: {
              required: !1,
              tsType: { name: 'number' },
              description: '',
              defaultValue: { value: '100', computed: !1 },
            },
            leaveDelay: {
              required: !1,
              tsType: { name: 'number' },
              description: '',
              defaultValue: { value: '0', computed: !1 },
            },
            className: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            style: {
              required: !1,
              tsType: {
                name: 'ReactCSSProperties',
                raw: 'React.CSSProperties',
              },
              description: '',
            },
          },
        }
      },
      './src/components/Tooltip/tooltip.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            InteractiveDemo: () => InteractiveDemo,
            PremiumThemeVariants: () => PremiumThemeVariants,
            SacredThemeVariants: () => SacredThemeVariants,
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
          _index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
            './src/components/Tooltip/index.tsx'
          ),
          _Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
            './src/components/Button/index.tsx'
          )
        const __WEBPACK_DEFAULT_EXPORT__ = {
            title: 'Components/Tooltip',
            component: _index__WEBPACK_IMPORTED_MODULE_2__.A,
            parameters: { layout: 'centered' },
            argTypes: {
              title: { control: 'text' },
              tooltipplacement: {
                control: 'select',
                options: ['top', 'bottom', 'left', 'right'],
              },
              sacredtheme: { control: 'boolean' },
              arrow: { control: 'boolean' },
              enterDelay: { control: 'number' },
              leaveDelay: { control: 'number' },
            },
            tags: ['autodocs'],
          },
          defaultArgs = {
            title: 'Tooltip',
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
              { text: 'Hover me' }
            ),
          },
          PremiumThemeVariants = {
            name: 'Premium Theme - All Variants',
            render: args =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                className: 'p-8 bg-gray-50 rounded-xl',
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'h3',
                    {
                      className:
                        'text-xl font-bold text-gray-900 mb-6 font-inter',
                      children: 'Premium Tooltips',
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      className:
                        'flex flex-wrap gap-8 justify-center items-center h-64',
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'top',
                            title: 'Top Tooltip',
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'Top' }
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'bottom',
                            title: 'Bottom Tooltip',
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'Bottom' }
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'left',
                            title: 'Left Tooltip',
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'Left' }
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'right',
                            title: 'Right Tooltip',
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'Right' }
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'top',
                            title: 'No Arrow',
                            arrow: !1,
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'No Arrow' }
                            ),
                          }
                        ),
                      ],
                    }
                  ),
                ],
              }),
            args: { ...defaultArgs, sacredtheme: !1 },
          },
          SacredThemeVariants = {
            name: 'Sacred Theme - All Variants',
            render: args =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                className: 'p-8 bg-black/90 rounded-xl',
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'h3',
                    {
                      className:
                        'text-xl font-bold text-yellow-400 mb-6 font-cinzel animate-sacred-glow',
                      children: 'Sacred Tooltips',
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      className:
                        'flex flex-wrap gap-8 justify-center items-center h-64',
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'top',
                            title: 'Ancient Wisdom (Top)',
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'Top', styles: { theme: 'sacred' } }
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'bottom',
                            title: 'Divine Insight (Bottom)',
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'Bottom', styles: { theme: 'sacred' } }
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'left',
                            title: 'Mystical Secret (Left)',
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'Left', styles: { theme: 'sacred' } }
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'right',
                            title: 'Golden Prophecy (Right)',
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'Right', styles: { theme: 'sacred' } }
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'top',
                            title: 'No Arrow',
                            arrow: !1,
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'No Arrow', styles: { theme: 'sacred' } }
                            ),
                          }
                        ),
                      ],
                    }
                  ),
                ],
              }),
            args: { ...defaultArgs, sacredtheme: !0 },
          },
          InteractiveDemoRenderer = () => {
            const [config, setConfig] =
              react__WEBPACK_IMPORTED_MODULE_1__.useState({
                title: 'Interactive Tooltip',
                placement: 'top',
                sacredtheme: !1,
                showArrow: !0,
                enterDelay: 100,
                leaveDelay: 0,
              })
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                className: 'w-[500px] space-y-6',
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      className:
                        'p-6 bg-white rounded-lg border border-gray-200',
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'h3',
                          {
                            className:
                              'text-lg font-semibold text-gray-900 mb-4',
                            children: 'Tooltip Configuration',
                          }
                        ),
                        (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'div',
                          {
                            className: 'grid grid-cols-2 gap-4',
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                'div',
                                {
                                  children: [
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      'label',
                                      {
                                        className:
                                          'block text-sm font-medium text-gray-700 mb-2',
                                        children: 'Title',
                                      }
                                    ),
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      'input',
                                      {
                                        type: 'text',
                                        value: config.title,
                                        onChange: e =>
                                          setConfig({
                                            ...config,
                                            title: e.target.value,
                                          }),
                                        className:
                                          'w-full p-2 border border-gray-300 rounded-md',
                                      }
                                    ),
                                  ],
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                'div',
                                {
                                  children: [
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      'label',
                                      {
                                        className:
                                          'block text-sm font-medium text-gray-700 mb-2',
                                        children: 'Placement',
                                      }
                                    ),
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                      'select',
                                      {
                                        value: config.placement,
                                        onChange: e =>
                                          setConfig({
                                            ...config,
                                            placement: e.target.value,
                                          }),
                                        className:
                                          'w-full p-2 border border-gray-300 rounded-md',
                                        children: [
                                          (0,
                                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                            'option',
                                            { value: 'top', children: 'Top' }
                                          ),
                                          (0,
                                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                            'option',
                                            {
                                              value: 'bottom',
                                              children: 'Bottom',
                                            }
                                          ),
                                          (0,
                                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                            'option',
                                            { value: 'left', children: 'Left' }
                                          ),
                                          (0,
                                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                            'option',
                                            {
                                              value: 'right',
                                              children: 'Right',
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
                        ),
                        (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'div',
                          {
                            className: 'flex items-center gap-4 mt-4',
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                'label',
                                {
                                  className: 'flex items-center',
                                  children: [
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      'input',
                                      {
                                        type: 'checkbox',
                                        checked: config.sacredtheme,
                                        onChange: e =>
                                          setConfig({
                                            ...config,
                                            sacredtheme: e.target.checked,
                                          }),
                                      }
                                    ),
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      'span',
                                      {
                                        className: 'ml-2',
                                        children: 'Sacred Theme',
                                      }
                                    ),
                                  ],
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                'label',
                                {
                                  className: 'flex items-center',
                                  children: [
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      'input',
                                      {
                                        type: 'checkbox',
                                        checked: config.showArrow,
                                        onChange: e =>
                                          setConfig({
                                            ...config,
                                            showArrow: e.target.checked,
                                          }),
                                      }
                                    ),
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      'span',
                                      {
                                        className: 'ml-2',
                                        children: 'Show Arrow',
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
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'div',
                    {
                      className:
                        'p-8 rounded-xl flex justify-center items-center h-48 ' +
                        (config.sacredtheme ? 'bg-black/90' : 'bg-gray-50'),
                      children: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        _index__WEBPACK_IMPORTED_MODULE_2__.A,
                        {
                          title: config.title,
                          tooltipplacement: config.placement,
                          sacredtheme: config.sacredtheme,
                          arrow: config.showArrow,
                          enterDelay: config.enterDelay,
                          leaveDelay: config.leaveDelay,
                          children: (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                            {
                              text: 'Hover me',
                              styles: {
                                theme: config.sacredtheme ? 'sacred' : 'light',
                              },
                            }
                          ),
                        }
                      ),
                    }
                  ),
                ],
              }
            )
          },
          InteractiveDemo = {
            name: 'Interactive Demo',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractiveDemoRenderer,
                {}
              ),
          },
          __namedExportsOrder = [
            'PremiumThemeVariants',
            'SacredThemeVariants',
            'InteractiveDemo',
          ]
      },
    },
  ]
)
