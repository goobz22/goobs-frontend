'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [3341],
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
      './src/components/CodeCopy/codecopy.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            PremiumTheme: () => PremiumTheme,
            SacredTheme: () => SacredTheme,
            __namedExportsOrder: () => __namedExportsOrder,
            default: () => codecopy_stories,
          }))
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          Button = __webpack_require__('./src/components/Button/index.tsx'),
          ContentCopy = __webpack_require__(
            './src/components/Icons/ContentCopy.tsx'
          ),
          es = __webpack_require__('./node_modules/highlight.js/es/index.js'),
          theme = __webpack_require__('./src/theme/index.ts')
        const SacredGlyphs = () => {
            const glyphStyles = (0, react.useMemo)(
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
                decorativeGlyphs: {
                  position: 'absolute',
                  bottom: '0.5rem',
                  right: '0.5rem',
                  fontSize: '3.75rem',
                  color: 'rgba(255, 215, 0, 0.2)',
                  pointerEvents: 'none',
                },
                floatingGlyphs: {
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  gap: '0.5rem',
                  opacity: 0.05,
                  pointerEvents: 'none',
                },
                floatingGlyph: { color: '#FFD700', fontSize: '1.5rem' },
              }),
              []
            )
            return (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
              children: [
                (0, jsx_runtime.jsx)('div', {
                  style: glyphStyles.backgroundGlyphs,
                  children: theme.vR[0],
                }),
                (0, jsx_runtime.jsx)('div', {
                  style: glyphStyles.decorativeGlyphs,
                  children: theme.vR[18],
                }),
                (0, jsx_runtime.jsx)('div', {
                  style: glyphStyles.floatingGlyphs,
                  children: [theme.vR[8], theme.vR[12], theme.vR[16]].map(
                    (glyph, i) =>
                      (0, jsx_runtime.jsx)(
                        'div',
                        {
                          style: {
                            ...glyphStyles.floatingGlyph,
                            animation: `sacred-glyph-float ${4 + i}s infinite`,
                            animationDelay: 0.5 * i + 's',
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
          SacredLineNumbers = ({ lineNumbers, computedStyles }) =>
            (0, jsx_runtime.jsxs)('div', {
              style: computedStyles.lineNumbers,
              children: [
                (0, jsx_runtime.jsx)('div', {
                  style: computedStyles.lineNumbersGlyph,
                  children: theme.vR[11],
                }),
                lineNumbers.map(num =>
                  (0, jsx_runtime.jsx)(
                    'div',
                    {
                      style: {
                        ...computedStyles.lineNumber,
                        animation: `line-number-glow ${3 + (num % 3)}s ease-in-out infinite`,
                        animationDelay: 0.1 * num + 's',
                      },
                      children: num,
                    },
                    num
                  )
                ),
              ],
            }),
          CodeCopy = props => {
            const { code, language, styles, ...rest } = props,
              codeRef = (0, react.useRef)(null),
              [copied, setCopied] = (0, react.useState)(!1),
              computedStyles = (0, react.useMemo)(
                () =>
                  (0, theme.lQ)(
                    styles,
                    null == styles ? void 0 : styles.disabled
                  ),
                [styles]
              ),
              lineNumbers = (0, react.useMemo)(
                () =>
                  Array.from(
                    { length: code.split('\n').length },
                    (_, i) => i + 1
                  ),
                [code]
              ),
              handleCopy = (0, react.useCallback)(() => {
                if (null == styles ? void 0 : styles.disabled) return
                const codeElement = codeRef.current
                if (codeElement) {
                  const textArea = document.createElement('textarea')
                  ;((textArea.value = codeElement.innerText),
                    document.body.appendChild(textArea),
                    textArea.select(),
                    document.execCommand('copy'),
                    textArea.remove(),
                    setCopied(!0),
                    setTimeout(() => setCopied(!1), 1e3))
                }
              }, [null == styles ? void 0 : styles.disabled])
            ;(0, react.useEffect)(() => {
              if (
                codeRef.current &&
                (es.A.highlightElement(codeRef.current),
                'sacred' === (null == styles ? void 0 : styles.theme) &&
                  codeRef.current)
              ) {
                codeRef.current
                  .querySelectorAll('.hljs-keyword')
                  .forEach(el => {
                    ;((el.style.color = '#FFD700'),
                      (el.style.textShadow = '0 0 4px rgba(255, 215, 0, 0.5)'))
                  })
                codeRef.current.querySelectorAll('.hljs-string').forEach(el => {
                  el.style.color = 'rgba(255, 215, 0, 0.8)'
                })
                codeRef.current
                  .querySelectorAll('.hljs-comment')
                  .forEach(el => {
                    ;((el.style.color = 'rgba(255, 215, 0, 0.5)'),
                      (el.style.fontStyle = 'italic'))
                  })
                codeRef.current
                  .querySelectorAll('.hljs-function, .hljs-title')
                  .forEach(el => {
                    el.style.color = 'rgba(255, 215, 0, 0.9)'
                  })
              }
            }, [code, language, null == styles ? void 0 : styles.theme])
            const isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              shouldShowLineNumbers =
                !1 !== (null == styles ? void 0 : styles.showLineNumbers)
            return (0, jsx_runtime.jsxs)('div', {
              style: {
                ...computedStyles.container,
                ...(isSacredTheme && computedStyles.shimmer),
              },
              ...rest,
              children: [
                isSacredTheme && (0, jsx_runtime.jsx)(SacredGlyphs, {}),
                (0, jsx_runtime.jsxs)('div', {
                  style: computedStyles.header,
                  children: [
                    (0, jsx_runtime.jsxs)('div', {
                      style: computedStyles.langIndicator,
                      children: [
                        isSacredTheme &&
                          (0, jsx_runtime.jsx)('span', {
                            style: computedStyles.langGlyph,
                            children: theme.vR[5],
                          }),
                        (0, jsx_runtime.jsx)('span', {
                          style: computedStyles.langText,
                          children: language,
                        }),
                      ],
                    }),
                    (0, jsx_runtime.jsx)(Button.A, {
                      text: copied ? 'Copied!' : 'Copy Code',
                      icon: (0, jsx_runtime.jsx)(ContentCopy.A, {}),
                      onClick: handleCopy,
                      styles: {
                        theme:
                          (null == styles ? void 0 : styles.theme) || 'dark',
                        disabled: null == styles ? void 0 : styles.disabled,
                        iconLocation: 'left',
                        backgroundColor: 'transparent',
                        color: isSacredTheme ? '#FFD700' : void 0,
                      },
                    }),
                  ],
                }),
                (0, jsx_runtime.jsxs)('div', {
                  style: computedStyles.codeBlock,
                  children: [
                    isSacredTheme &&
                      shouldShowLineNumbers &&
                      (0, jsx_runtime.jsx)(SacredLineNumbers, {
                        lineNumbers,
                        computedStyles,
                      }),
                    !isSacredTheme &&
                      shouldShowLineNumbers &&
                      (0, jsx_runtime.jsx)('div', {
                        style: computedStyles.lineNumbers,
                        children: lineNumbers.map(num =>
                          (0, jsx_runtime.jsx)(
                            'div',
                            { style: computedStyles.lineNumber, children: num },
                            num
                          )
                        ),
                      }),
                    (0, jsx_runtime.jsx)('pre', {
                      style: computedStyles.pre,
                      children: (0, jsx_runtime.jsx)('code', {
                        ref: codeRef,
                        className: `language-${language}`,
                        children: code,
                      }),
                    }),
                  ],
                }),
              ],
            })
          }
        CodeCopy.displayName = 'CodeCopy'
        const components_CodeCopy = CodeCopy
        CodeCopy.__docgenInfo = {
          description:
            'A code display component with syntax highlighting and copy functionality.',
          methods: [],
          displayName: 'CodeCopy',
          props: {
            code: {
              required: !0,
              tsType: { name: 'string' },
              description: 'Code content to display and copy',
            },
            language: {
              required: !0,
              tsType: { name: 'string' },
              description: 'Programming language for syntax highlighting',
            },
            styles: {
              required: !1,
              tsType: { name: 'CodeCopyStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties',
            },
          },
        }
        const codecopy_stories = {
            title: 'Components/CodeCopy',
            component: components_CodeCopy,
            argTypes: {
              language: {
                control: { type: 'select' },
                options: ['javascript', 'typescript', 'css', 'html', 'json'],
              },
              styles: {
                control: 'object',
                description: 'Custom styles using the theme system',
              },
            },
          },
          PremiumTheme = {
            name: 'Premium Theme',
            args: {
              code: 'function greet() {\n  console.log("Hello, world!");\n}',
              language: 'javascript',
              styles: { theme: 'light' },
            },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            args: {
              code: 'interface Person {\n  name: string;\n  age: number;\n}\nconst user: Person = { name: "Alice", age: 25 };',
              language: 'typescript',
              styles: { theme: 'sacred' },
            },
          },
          __namedExportsOrder = ['PremiumTheme', 'SacredTheme']
      },
      './src/components/Icons/ContentCopy.tsx': (
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
          ContentCopyIcon = ({ sacredtheme = !1, style = {}, ...props }) => {
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
                          d: 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z',
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
          __WEBPACK_DEFAULT_EXPORT__ = ContentCopyIcon
        ContentCopyIcon.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ContentCopyIcon',
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
    },
  ]
)
