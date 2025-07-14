'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [7861],
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
      './src/components/Icons/CheckCircle.tsx': (
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
            color: 'rgb(34, 197, 94)',
          },
          premiumStyles_iconHover = {
            transform: 'scale(1.05)',
            filter: 'drop-shadow(0 2px 4px rgba(34, 197, 94, 0.3))',
            color: 'rgb(22, 163, 74)',
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
          CheckCircleIcon = ({ sacredtheme = !1, style = {}, ...props }) => {
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
                      viewBox: '0 -960 960 960',
                      width: '24',
                      fill: 'currentColor',
                      style: iconStyle,
                      ...props,
                      children: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'path',
                        {
                          d: 'm424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z',
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
          __WEBPACK_DEFAULT_EXPORT__ = CheckCircleIcon
        CheckCircleIcon.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'CheckCircleIcon',
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
      './src/components/Icons/Info.tsx': (
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
            color: 'rgb(59, 130, 246)',
          },
          premiumStyles_iconHover = {
            transform: 'scale(1.05)',
            filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))',
            color: 'rgb(29, 78, 216)',
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
          InfoIcon = ({ sacredtheme = !1, style = {}, ...props }) => {
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
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'svg',
                    {
                      xmlns: 'http://www.w3.org/2000/svg',
                      height: '24',
                      viewBox: '0 0 24 24',
                      width: '24',
                      fill: 'currentColor',
                      style: iconStyle,
                      ...props,
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'circle',
                          {
                            cx: '12',
                            cy: '12',
                            r: '10',
                            stroke: 'currentColor',
                            strokeWidth: '2',
                            fill: 'none',
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'path',
                          {
                            d: 'M12 16v-4',
                            stroke: 'currentColor',
                            strokeWidth: '2',
                            strokeLinecap: 'round',
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'path',
                          {
                            d: 'M12 8h.01',
                            stroke: 'currentColor',
                            strokeWidth: '2',
                            strokeLinecap: 'round',
                          }
                        ),
                      ],
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
          __WEBPACK_DEFAULT_EXPORT__ = InfoIcon
        InfoIcon.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'InfoIcon',
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
      './src/components/PricingTable/pricingtable.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            BothPrices: () => BothPrices,
            InteractiveDemo: () => InteractiveDemo,
            PremiumTheme: () => PremiumTheme,
            SacredTheme: () => SacredTheme,
            __namedExportsOrder: () => __namedExportsOrder,
            default: () => pricingtable_stories,
          }))
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          Info = __webpack_require__('./src/components/Icons/Info.tsx'),
          CheckCircle = __webpack_require__(
            './src/components/Icons/CheckCircle.tsx'
          ),
          Tooltip = __webpack_require__('./src/components/Tooltip/index.tsx'),
          Button = __webpack_require__('./src/components/Button/index.tsx'),
          src_theme = __webpack_require__('./src/theme/index.ts')
        const PricingTable = props => {
            const {
                tabletitle,
                packagecolumns,
                monthlyprice,
                annualprice,
                features,
                buttoncolumns,
                router,
                theme = 'light',
                disabled = !1,
                highlightedPackageIndex,
              } = props,
              styles = ((theme = 'light', disabled = !1) => {
                const common = {
                  container: {
                    padding: '1.5rem',
                    borderRadius: '0.375rem',
                    position: 'relative',
                    overflow: 'hidden',
                    ...(disabled
                      ? { opacity: 0.5, pointerEvents: 'none' }
                      : {}),
                  },
                  glyph: {
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    fontSize: '1.5rem',
                  },
                  header: {
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                  },
                  priceLabel: { fontSize: '1rem', fontStyle: 'italic' },
                  packageName: {
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: '0.5rem 0',
                  },
                  price: {
                    textAlign: 'center',
                    padding: '0.25rem 0',
                    fontWeight: 600,
                  },
                  annualPrice: {
                    textAlign: 'center',
                    padding: '0.25rem 0',
                    fontStyle: 'italic',
                  },
                  featureTitle: {
                    fontWeight: 500,
                    padding: '0.5rem 0 0.5rem 0.5rem',
                  },
                  subFeatureTitle: {
                    fontWeight: 400,
                    padding: '0.25rem 0 0.25rem 1.5rem',
                  },
                  checkCell: {
                    textAlign: 'center',
                    padding: '0.5rem 0',
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                  },
                  checkIcon: {},
                  buttonSection: { marginTop: '1rem' },
                  button: { width: '100%' },
                  sacredFooter: {
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    marginTop: '1rem',
                  },
                  sacredFooterGlyph: {},
                  rowEven: { backgroundColor: 'rgba(0,0,0,0.02)' },
                  cellBorder: { borderRight: '1px solid rgba(0,0,0,0.1)' },
                  highlighted: {
                    backgroundColor: 'rgba(255,215,0,0.05)',
                    boxShadow: 'inset 0 0 10px rgba(255,215,0,0.3)',
                  },
                  badge: {
                    display: 'inline-block',
                    backgroundColor: '#4F46E5',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    marginLeft: '0.5rem',
                  },
                  toggleBackground: '#E5E7EB',
                }
                switch (theme) {
                  case 'sacred':
                    return {
                      ...common,
                      container: {
                        ...common.container,
                        backgroundColor: 'rgba(0,0,0,0.95)',
                        border: '1px solid rgba(154,132,0,0.3)',
                        boxShadow: '0 0 20px rgba(255,215,0,0.3)',
                        backdropFilter: 'blur(4px)',
                      },
                      glyph: {
                        ...common.glyph,
                        color: 'rgba(255,215,0,0.2)',
                        animation: 'spin 20s linear infinite',
                        position: 'absolute',
                      },
                      header: {
                        ...common.header,
                        color: '#FFD700',
                        fontFamily: 'serif',
                        textShadow: '0 0 5px rgba(255,215,0,0.5)',
                      },
                      priceLabel: {
                        ...common.priceLabel,
                        color: 'rgba(255,215,0,0.8)',
                      },
                      packageName: {
                        ...common.packageName,
                        color: '#FFD700',
                        backgroundColor: 'rgba(154,132,0,0.1)',
                        borderTopLeftRadius: '0.375rem',
                        borderTopRightRadius: '0.375rem',
                      },
                      price: { ...common.price, color: '#FFD700' },
                      annualPrice: {
                        ...common.annualPrice,
                        color: 'rgba(255,215,0,0.7)',
                      },
                      featureTitle: {
                        ...common.featureTitle,
                        color: '#FFD700',
                        backgroundColor: 'rgba(154,132,0,0.05)',
                      },
                      subFeatureTitle: {
                        ...common.subFeatureTitle,
                        color: 'rgba(255,215,0,0.9)',
                      },
                      checkIcon: { color: '#FFD700', fontSize: '1.25rem' },
                      sacredFooterGlyph: {
                        color: 'rgba(255,215,0,0.3)',
                        fontSize: '0.75rem',
                        animation: 'float 3s ease-in-out infinite',
                      },
                      toggleBackground: 'rgba(0,0,0,0.8)',
                    }
                  case 'dark':
                    return {
                      ...common,
                      container: {
                        ...common.container,
                        backgroundColor: 'rgba(31,41,55,0.95)',
                        border: '1px solid rgba(75,85,99,0.8)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(4px)',
                      },
                      glyph: { display: 'none' },
                      header: { ...common.header, color: '#F3F4F6' },
                      priceLabel: { ...common.priceLabel, color: '#9CA3AF' },
                      packageName: {
                        ...common.packageName,
                        color: '#F9FAFB',
                        backgroundColor: 'rgba(55,65,81,0.5)',
                      },
                      price: { ...common.price, color: '#E5E7EB' },
                      annualPrice: { ...common.annualPrice, color: '#9CA3AF' },
                      featureTitle: {
                        ...common.featureTitle,
                        color: '#D1D5DB',
                        backgroundColor: 'rgba(55,65,81,0.2)',
                      },
                      subFeatureTitle: {
                        ...common.subFeatureTitle,
                        color: '#9CA3AF',
                      },
                      checkIcon: { color: '#4ADE80' },
                      sacredFooter: { display: 'none' },
                      toggleBackground: '#374151',
                    }
                  default:
                    return {
                      ...common,
                      container: {
                        ...common.container,
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        border: '1px solid rgba(226,232,240,0.8)',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        backdropFilter: 'blur(4px)',
                      },
                      glyph: { display: 'none' },
                      header: { ...common.header, color: '#1F2937' },
                      priceLabel: { ...common.priceLabel, color: '#6B7280' },
                      packageName: {
                        ...common.packageName,
                        color: '#1F2937',
                        backgroundColor: '#F3F4F6',
                      },
                      price: { ...common.price, color: '#1F2937' },
                      annualPrice: { ...common.annualPrice, color: '#6B7280' },
                      featureTitle: {
                        ...common.featureTitle,
                        color: '#374151',
                        backgroundColor: '#F9FAFB',
                      },
                      subFeatureTitle: {
                        ...common.subFeatureTitle,
                        color: '#4B5563',
                      },
                      checkIcon: { color: '#22C55E' },
                      sacredFooter: { display: 'none' },
                      toggleBackground: '#E5E7EB',
                    }
                }
              })(theme, disabled),
              isSacredTheme = 'sacred' === theme
            var _packagecolumns_packagenames
            const packagenames =
                null !==
                  (_packagecolumns_packagenames =
                    null == packagecolumns
                      ? void 0
                      : packagecolumns.packagenames) &&
                void 0 !== _packagecolumns_packagenames
                  ? _packagecolumns_packagenames
                  : [],
              numPackages = packagenames.length
            if (0 === numPackages) return null
            return (0, jsx_runtime.jsxs)('div', {
              style: styles.container,
              children: [
                isSacredTheme &&
                  (0, jsx_runtime.jsx)('div', {
                    style: styles.glyph,
                    children: src_theme.vR[0],
                  }),
                tabletitle &&
                  (0, jsx_runtime.jsx)('h5', {
                    style: styles.header,
                    children: tabletitle.text,
                  }),
                (0, jsx_runtime.jsx)('div', {
                  style: { overflowX: 'auto' },
                  children: (0, jsx_runtime.jsxs)('div', {
                    style: {
                      display: 'grid',
                      gap: 0,
                      gridTemplateColumns: `minmax(200px, 300px) repeat(${numPackages}, minmax(150px, 1fr))`,
                      minWidth: 'fit-content',
                    },
                    children: [
                      (0, jsx_runtime.jsx)('div', {}),
                      ' ',
                      packagenames.map((name, i) =>
                        (0, jsx_runtime.jsxs)(
                          'div',
                          {
                            style: {
                              ...styles.packageName,
                              ...(i === highlightedPackageIndex
                                ? styles.highlighted
                                : {}),
                            },
                            children: [
                              name,
                              i === highlightedPackageIndex &&
                                (0, jsx_runtime.jsx)('span', {
                                  style: styles.badge,
                                  children: 'Popular',
                                }),
                            ],
                          },
                          i
                        )
                      ),
                      monthlyprice &&
                        (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                          children: [
                            (0, jsx_runtime.jsx)('div', {
                              style: styles.priceLabel,
                              children: 'Monthly Price',
                            }),
                            monthlyprice.prices
                              .slice(0, numPackages)
                              .map((price, i) =>
                                (0, jsx_runtime.jsx)(
                                  'div',
                                  {
                                    style: {
                                      ...styles.price,
                                      ...(i === highlightedPackageIndex
                                        ? styles.highlighted
                                        : {}),
                                    },
                                    children: price.replace(
                                      /Monthly - |Annually - /,
                                      ''
                                    ),
                                  },
                                  i
                                )
                              ),
                          ],
                        }),
                      annualprice &&
                        (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                          children: [
                            (0, jsx_runtime.jsx)('div', {
                              style: styles.priceLabel,
                              children: 'Annual Price',
                            }),
                            annualprice.annualprices
                              .slice(0, numPackages)
                              .map((price, i) =>
                                (0, jsx_runtime.jsx)(
                                  'div',
                                  {
                                    style: {
                                      ...styles.annualPrice,
                                      ...(i === highlightedPackageIndex
                                        ? styles.highlighted
                                        : {}),
                                    },
                                    children: price.replace(
                                      /Monthly - |Annually - /,
                                      ''
                                    ),
                                  },
                                  i
                                )
                              ),
                          ],
                        }),
                      null == features
                        ? void 0
                        : features.map((feature, fIndex) => {
                            var _feature_subfeatures
                            return (0, jsx_runtime.jsxs)(
                              react.Fragment,
                              {
                                children: [
                                  (0, jsx_runtime.jsxs)('div', {
                                    style: {
                                      ...styles.featureTitle,
                                      ...(fIndex % 2 == 0
                                        ? styles.rowEven
                                        : {}),
                                    },
                                    children: [
                                      (0, jsx_runtime.jsx)('span', {
                                        children: feature.title,
                                      }),
                                      feature.infopopuptext &&
                                        (0, jsx_runtime.jsx)(Tooltip.A, {
                                          tooltipplacement: 'right',
                                          title: feature.infopopuptext,
                                          sacredtheme: isSacredTheme,
                                          children: (0, jsx_runtime.jsx)(
                                            Info.A,
                                            {
                                              fontSize: 'small',
                                              style: {
                                                marginLeft: '0.5rem',
                                                display: 'inline-block',
                                              },
                                            }
                                          ),
                                        }),
                                    ],
                                  }),
                                  packagenames.map((_, pIndex) => {
                                    var _feature_tiedtopackage_tiedtopackages,
                                      _feature_tiedtopackage
                                    return (0, jsx_runtime.jsx)(
                                      'div',
                                      {
                                        style: {
                                          ...styles.checkCell,
                                          borderRight:
                                            '1px solid rgba(0,0,0,0.1)',
                                          ...(fIndex % 2 == 0
                                            ? styles.rowEven
                                            : {}),
                                          ...(pIndex === highlightedPackageIndex
                                            ? styles.highlighted
                                            : {}),
                                        },
                                        children:
                                          'true' ===
                                            (null ===
                                              (_feature_tiedtopackage =
                                                feature.tiedtopackage) ||
                                            void 0 === _feature_tiedtopackage ||
                                            null ===
                                              (_feature_tiedtopackage_tiedtopackages =
                                                _feature_tiedtopackage.tiedtopackages) ||
                                            void 0 ===
                                              _feature_tiedtopackage_tiedtopackages
                                              ? void 0
                                              : _feature_tiedtopackage_tiedtopackages[
                                                  pIndex
                                                ]) &&
                                          (0, jsx_runtime.jsx)(CheckCircle.A, {
                                            style: styles.checkIcon,
                                            fontSize: 'small',
                                          }),
                                      },
                                      pIndex
                                    )
                                  }),
                                  null ===
                                    (_feature_subfeatures =
                                      feature.subfeatures) ||
                                  void 0 === _feature_subfeatures
                                    ? void 0
                                    : _feature_subfeatures.map((sub, sIndex) =>
                                        (0, jsx_runtime.jsxs)(
                                          react.Fragment,
                                          {
                                            children: [
                                              (0, jsx_runtime.jsxs)('div', {
                                                style: styles.subFeatureTitle,
                                                children: [
                                                  (0, jsx_runtime.jsx)('span', {
                                                    children: sub.title,
                                                  }),
                                                  sub.infopopuptext &&
                                                    (0, jsx_runtime.jsx)(
                                                      Tooltip.A,
                                                      {
                                                        tooltipplacement:
                                                          'right',
                                                        title:
                                                          sub.infopopuptext,
                                                        sacredtheme:
                                                          isSacredTheme,
                                                        children: (0,
                                                        jsx_runtime.jsx)(
                                                          Info.A,
                                                          {
                                                            fontSize: 'small',
                                                            style: {
                                                              marginLeft:
                                                                '0.5rem',
                                                              display:
                                                                'inline-block',
                                                            },
                                                          }
                                                        ),
                                                      }
                                                    ),
                                                ],
                                              }),
                                              packagenames.map((_, pIndex) => {
                                                var _sub_tiedtopackage_tiedtopackages,
                                                  _sub_tiedtopackage
                                                return (0, jsx_runtime.jsx)(
                                                  'div',
                                                  {
                                                    style: {
                                                      ...styles.checkCell,
                                                      borderRight:
                                                        '1px solid rgba(0,0,0,0.1)',
                                                      ...(fIndex % 2 == 0
                                                        ? styles.rowEven
                                                        : {}),
                                                      ...(pIndex ===
                                                      highlightedPackageIndex
                                                        ? styles.highlighted
                                                        : {}),
                                                    },
                                                    children:
                                                      'true' ===
                                                        (null ===
                                                          (_sub_tiedtopackage =
                                                            sub.tiedtopackage) ||
                                                        void 0 ===
                                                          _sub_tiedtopackage ||
                                                        null ===
                                                          (_sub_tiedtopackage_tiedtopackages =
                                                            _sub_tiedtopackage.tiedtopackages) ||
                                                        void 0 ===
                                                          _sub_tiedtopackage_tiedtopackages
                                                          ? void 0
                                                          : _sub_tiedtopackage_tiedtopackages[
                                                              pIndex
                                                            ]) &&
                                                      (0, jsx_runtime.jsx)(
                                                        CheckCircle.A,
                                                        {
                                                          style:
                                                            styles.checkIcon,
                                                          fontSize: 'small',
                                                        }
                                                      ),
                                                  },
                                                  pIndex
                                                )
                                              }),
                                            ],
                                          },
                                          sIndex
                                        )
                                      ),
                                ],
                              },
                              fIndex
                            )
                          }),
                      (0, jsx_runtime.jsx)('div', {}),
                      ' ',
                      null == buttoncolumns
                        ? void 0
                        : buttoncolumns.buttontexts
                            .slice(0, numPackages)
                            .map((text, i) =>
                              (0, jsx_runtime.jsx)(
                                'div',
                                {
                                  style: styles.buttonSection,
                                  children: (0, jsx_runtime.jsx)(Button.A, {
                                    text,
                                    onClick: () => {
                                      return (
                                        (index = i),
                                        void (
                                          router &&
                                          (null == buttoncolumns ||
                                          null ===
                                            (_buttoncolumns_buttonlinks =
                                              buttoncolumns.buttonlinks) ||
                                          void 0 === _buttoncolumns_buttonlinks
                                            ? void 0
                                            : _buttoncolumns_buttonlinks[
                                                index
                                              ]) &&
                                          router.push(
                                            buttoncolumns.buttonlinks[index]
                                          )
                                        )
                                      )
                                      var index, _buttoncolumns_buttonlinks
                                    },
                                    styles: { theme, ...styles.button },
                                    disabled,
                                  }),
                                },
                                i
                              )
                            ),
                    ],
                  }),
                }),
                isSacredTheme &&
                  (0, jsx_runtime.jsx)('div', {
                    style: styles.sacredFooter,
                    children: [
                      src_theme.vR[20],
                      src_theme.vR[21],
                      src_theme.vR[20],
                    ].map((glyph, i) =>
                      (0, jsx_runtime.jsx)(
                        'span',
                        {
                          style: {
                            ...styles.sacredFooterGlyph,
                            animationDuration: 2 + 0.3 * i + 's',
                          },
                          children: glyph,
                        },
                        i
                      )
                    ),
                  }),
              ],
            })
          },
          components_PricingTable = PricingTable
        PricingTable.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'PricingTable',
          props: {
            tabletitle: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'object',
                raw: '{ text: string }',
                signature: {
                  properties: [
                    { key: 'text', value: { name: 'string', required: !0 } },
                  ],
                },
              },
              description: '',
            },
            packagecolumns: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'object',
                raw: '{ packagenames: string[] }',
                signature: {
                  properties: [
                    {
                      key: 'packagenames',
                      value: {
                        name: 'Array',
                        elements: [{ name: 'string' }],
                        raw: 'string[]',
                        required: !0,
                      },
                    },
                  ],
                },
              },
              description: '',
            },
            monthlyprice: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'object',
                raw: '{ prices: string[] }',
                signature: {
                  properties: [
                    {
                      key: 'prices',
                      value: {
                        name: 'Array',
                        elements: [{ name: 'string' }],
                        raw: 'string[]',
                        required: !0,
                      },
                    },
                  ],
                },
              },
              description: '',
            },
            annualprice: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'object',
                raw: '{ annualprices: string[] }',
                signature: {
                  properties: [
                    {
                      key: 'annualprices',
                      value: {
                        name: 'Array',
                        elements: [{ name: 'string' }],
                        raw: 'string[]',
                        required: !0,
                      },
                    },
                  ],
                },
              },
              description: '',
            },
            features: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [{ name: 'Feature' }],
                raw: 'Feature[]',
              },
              description: '',
            },
            buttoncolumns: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'object',
                raw: '{\n  buttontexts: string[]\n  buttonlinks: string[]\n}',
                signature: {
                  properties: [
                    {
                      key: 'buttontexts',
                      value: {
                        name: 'Array',
                        elements: [{ name: 'string' }],
                        raw: 'string[]',
                        required: !0,
                      },
                    },
                    {
                      key: 'buttonlinks',
                      value: {
                        name: 'Array',
                        elements: [{ name: 'string' }],
                        raw: 'string[]',
                        required: !0,
                      },
                    },
                  ],
                },
              },
              description: '',
            },
            router: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'object',
                raw: '{ push(url: string): void }',
                signature: {
                  properties: [
                    { key: 'push', value: { name: 'void', required: !0 } },
                  ],
                },
              },
              description: '',
            },
            theme: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "'light' | 'dark' | 'sacred'",
                elements: [
                  { name: 'literal', value: "'light'" },
                  { name: 'literal', value: "'dark'" },
                  { name: 'literal', value: "'sacred'" },
                ],
              },
              description: 'Theme selection',
            },
            disabled: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'Disabled state',
            },
            highlightedPackageIndex: {
              required: !1,
              tsType: { name: 'number' },
              description: '',
            },
            defaultBilling: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "'monthly' | 'annual'",
                elements: [
                  { name: 'literal', value: "'monthly'" },
                  { name: 'literal', value: "'annual'" },
                ],
              },
              description: '',
            },
          },
        }
        const defaultConfig = {
            tabletitle: { text: 'Features' },
            packagecolumns: {
              packagenames: ['ThothOS', 'ThothOS Pro', 'ThothOS Enterprise'],
            },
            monthlyprice: {
              prices: ['Monthly - $10', 'Monthly - $20', 'Monthly - $30'],
            },
            annualprice: {
              annualprices: [
                'Annually - $100',
                'Annually - $200',
                'Annually - $300',
              ],
            },
            features: [
              {
                title: 'Frontend Components',
                infopopuptext: 'How do I choose the right plan?',
                subfeatures: [
                  {
                    title: 'Pricing Table',
                    infopopuptext: 'Pricing table subfeature info',
                  },
                  {
                    title: 'Feature Grid',
                    infopopuptext: 'Feature grid subfeature info',
                  },
                ],
                tiedtopackage: { tiedtopackages: ['true', 'true', 'true'] },
              },
              {
                title: 'Backend Capabilities',
                infopopuptext: 'What is the difference between the plans?',
                subfeatures: [
                  {
                    title: 'API Integration',
                    infopopuptext: 'API integration subfeature info',
                  },
                  {
                    title: 'Database Support',
                    infopopuptext: 'Database support subfeature info',
                  },
                ],
                tiedtopackage: { tiedtopackages: ['true', 'true', 'true'] },
              },
            ],
            buttoncolumns: {
              buttontexts: ['Learn More', 'Learn More', 'Learn More'],
              buttonlinks: [
                '#goobs-frontend-unlimited',
                '#goobs-frontend-unlimited',
                '#goobs-frontend-unlimited',
              ],
            },
          },
          pricingtable_stories = {
            title: 'Components/PricingTable',
            component: components_PricingTable,
            argTypes: {
              theme: {
                control: 'select',
                options: ['light', 'dark', 'sacred'],
              },
            },
            parameters: { layout: 'centered' },
          },
          PremiumTheme = {
            name: 'Premium Theme',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                className: 'w-[800px] p-6 bg-gray-50 rounded-lg',
                children: (0, jsx_runtime.jsx)(components_PricingTable, {
                  ...args,
                }),
              }),
            args: {
              ...defaultConfig,
              theme: 'light',
              highlightedPackageIndex: 1,
            },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                className: 'w-[800px] p-6 bg-black rounded-lg',
                children: (0, jsx_runtime.jsx)(components_PricingTable, {
                  ...args,
                }),
              }),
            args: {
              ...defaultConfig,
              theme: 'sacred',
              highlightedPackageIndex: 1,
            },
          },
          InteractiveDemoRenderer = () => {
            const [sacredtheme, setsacredtheme] = react.useState(!1)
            return (0, jsx_runtime.jsxs)('div', {
              className:
                'w-[800px] p-6 rounded-lg ' +
                (sacredtheme ? 'bg-black' : 'bg-gray-50'),
              children: [
                (0, jsx_runtime.jsx)('div', {
                  className:
                    'fixed top-4 right-4 z-50 p-4 bg-white rounded-lg border shadow-lg',
                  children: (0, jsx_runtime.jsxs)('label', {
                    children: [
                      (0, jsx_runtime.jsx)('input', {
                        type: 'checkbox',
                        checked: sacredtheme,
                        onChange: e => setsacredtheme(e.target.checked),
                      }),
                      ' ',
                      'Sacred Theme',
                    ],
                  }),
                }),
                (0, jsx_runtime.jsx)(components_PricingTable, {
                  ...defaultConfig,
                  theme: sacredtheme ? 'sacred' : 'light',
                  highlightedPackageIndex: 1,
                }),
              ],
            })
          },
          InteractiveDemo = {
            name: 'Interactive Demo',
            render: () => (0, jsx_runtime.jsx)(InteractiveDemoRenderer, {}),
          },
          BothPrices = {
            name: 'Both Monthly and Annual',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                className: 'w-[800px] p-6 bg-gray-50 rounded-lg',
                children: (0, jsx_runtime.jsx)(components_PricingTable, {
                  ...args,
                }),
              }),
            args: {
              ...defaultConfig,
              theme: 'light',
              highlightedPackageIndex: 2,
            },
          },
          __namedExportsOrder = [
            'PremiumTheme',
            'SacredTheme',
            'InteractiveDemo',
            'BothPrices',
          ]
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
    },
  ]
)
