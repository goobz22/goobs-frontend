;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [8825],
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
      './src/components/Dialog/dialog.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        'use strict'
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            CustomBackdrop: () => CustomBackdrop,
            CustomColors: () => CustomColors,
            Dark: () => Dark,
            InteractionTest: () => InteractionTest,
            Light: () => Light,
            LightCustomSize: () => LightCustomSize,
            LightFullWidth: () => LightFullWidth,
            Sacred: () => Sacred,
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
            './src/components/Dialog/index.tsx'
          ),
          _Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
            './src/components/Button/index.tsx'
          )
        const __WEBPACK_DEFAULT_EXPORT__ = {
            title: 'Components/Dialog',
            component: _index__WEBPACK_IMPORTED_MODULE_3__.A,
            parameters: { layout: 'fullscreen' },
            argTypes: {
              open: { control: 'boolean' },
              styles: {
                control: 'object',
                description: 'Custom styles using the theme system',
              },
            },
            tags: ['autodocs'],
          },
          DialogContent = () =>
            (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
              style: { padding: '24px', minWidth: '300px' },
              children: [
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('h2', {
                  style: {
                    margin: '0 0 16px 0',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                  },
                  children: 'Confirm Action',
                }),
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('p', {
                  style: { margin: '0 0 24px 0', color: '#666' },
                  children:
                    'Are you sure you want to proceed with this action? This cannot be undone.',
                }),
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      gap: '12px',
                      justifyContent: 'flex-end',
                    },
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        _Button__WEBPACK_IMPORTED_MODULE_4__.A,
                        { styles: { theme: 'light' }, children: 'Cancel' }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        _Button__WEBPACK_IMPORTED_MODULE_4__.A,
                        {
                          styles: {
                            theme: 'light',
                            backgroundColor: '#dc2626',
                            color: 'white',
                          },
                          children: 'Confirm',
                        }
                      ),
                    ],
                  }
                ),
              ],
            }),
          InteractiveDialog = ({ styles, children }) => {
            const [open, setOpen] = (0,
            react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1)
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: { padding: '20px' },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _Button__WEBPACK_IMPORTED_MODULE_4__.A,
                    {
                      styles: {
                        theme:
                          (null == styles ? void 0 : styles.theme) || 'light',
                      },
                      onClick: () => setOpen(!0),
                      children: 'Open Dialog',
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _index__WEBPACK_IMPORTED_MODULE_3__.A,
                    { open, onClose: () => setOpen(!1), styles, children }
                  ),
                ],
              }
            )
          },
          Light = {
            name: 'Light/Basic',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractiveDialog,
                {
                  styles: { theme: 'light' },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    DialogContent,
                    {}
                  ),
                }
              ),
          },
          LightFullWidth = {
            name: 'Light/Full Width',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractiveDialog,
                {
                  styles: { theme: 'light', fullWidth: !0, maxWidth: '600px' },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    DialogContent,
                    {}
                  ),
                }
              ),
          },
          LightCustomSize = {
            name: 'Light/Custom Size',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractiveDialog,
                {
                  styles: {
                    theme: 'light',
                    maxWidth: '800px',
                    minHeight: '400px',
                  },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                    style: { padding: '24px' },
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'h2',
                        {
                          style: {
                            margin: '0 0 16px 0',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                          },
                          children: 'Large Dialog',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'p',
                        {
                          style: { margin: '0 0 16px 0', color: '#666' },
                          children:
                            'This dialog demonstrates custom sizing options. You can set maxWidth, minHeight, and other dimensional properties through the styles prop.',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'div',
                        {
                          style: {
                            height: '200px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '8px',
                            padding: '16px',
                          },
                          children: (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            'p',
                            { children: 'Content area with custom height' }
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
                InteractiveDialog,
                {
                  styles: { theme: 'dark' },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                    style: {
                      padding: '24px',
                      minWidth: '300px',
                      color: 'white',
                    },
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'h2',
                        {
                          style: {
                            margin: '0 0 16px 0',
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                          },
                          children: 'Dark Theme Dialog',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'p',
                        {
                          style: { margin: '0 0 24px 0', color: '#d1d5db' },
                          children:
                            'This dialog uses the dark theme with improved contrast and styling.',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                        'div',
                        {
                          style: {
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end',
                          },
                          children: [
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_4__.A,
                              { styles: { theme: 'dark' }, children: 'Cancel' }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_4__.A,
                              {
                                styles: {
                                  theme: 'dark',
                                  backgroundColor: '#2563eb',
                                  color: 'white',
                                },
                                children: 'Confirm',
                              }
                            ),
                          ],
                        }
                      ),
                    ],
                  }),
                }
              ),
            parameters: { backgrounds: { default: 'dark' } },
          },
          Sacred = {
            name: 'Sacred/Basic',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractiveDialog,
                {
                  styles: { theme: 'sacred' },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                    style: {
                      padding: '24px',
                      minWidth: '300px',
                      color: '#f5f5dc',
                    },
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'h2',
                        {
                          style: {
                            margin: '0 0 16px 0',
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            color: '#FFD700',
                            textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                          },
                          children: 'Sacred Theme Dialog',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'p',
                        {
                          style: { margin: '0 0 24px 0', color: '#f5f5dc' },
                          children:
                            'This dialog uses the sacred theme with mystical golden accents and special effects.',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                        'div',
                        {
                          style: {
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end',
                          },
                          children: [
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_4__.A,
                              {
                                styles: { theme: 'sacred' },
                                children: 'Cancel',
                              }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_4__.A,
                              {
                                styles: { theme: 'sacred' },
                                children: 'Confirm',
                              }
                            ),
                          ],
                        }
                      ),
                    ],
                  }),
                }
              ),
            parameters: { backgrounds: { default: 'dark' } },
          },
          CustomBackdrop = {
            name: 'Customization/Custom Backdrop',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractiveDialog,
                {
                  styles: {
                    theme: 'light',
                    backdropBackgroundColor: 'rgba(59, 130, 246, 0.3)',
                    backdropBlur: '4px',
                  },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                    style: { padding: '24px', minWidth: '300px' },
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'h2',
                        {
                          style: {
                            margin: '0 0 16px 0',
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                          },
                          children: 'Custom Backdrop',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'p',
                        {
                          style: { margin: '0 0 24px 0', color: '#666' },
                          children:
                            'This dialog has a custom blue backdrop with enhanced blur effect.',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        _Button__WEBPACK_IMPORTED_MODULE_4__.A,
                        { styles: { theme: 'light' }, children: 'Close' }
                      ),
                    ],
                  }),
                }
              ),
          },
          CustomColors = {
            name: 'Customization/Custom Colors',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractiveDialog,
                {
                  styles: {
                    theme: 'light',
                    backgroundColor: 'rgba(254, 242, 242, 0.95)',
                    borderColor: '#fca5a5',
                    borderWidth: '2px',
                  },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                    style: { padding: '24px', minWidth: '300px' },
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'h2',
                        {
                          style: {
                            margin: '0 0 16px 0',
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            color: '#dc2626',
                          },
                          children: 'Error Dialog',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'p',
                        {
                          style: { margin: '0 0 24px 0', color: '#991b1b' },
                          children:
                            'This dialog uses custom colors to indicate an error state.',
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
                          children: 'Understand',
                        }
                      ),
                    ],
                  }),
                }
              ),
          },
          InteractionTestComponent = () => {
            const [open, setOpen] = (0,
            react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1)
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: { padding: '20px' },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _Button__WEBPACK_IMPORTED_MODULE_4__.A,
                    {
                      styles: { theme: 'light' },
                      onClick: () => setOpen(!0),
                      'data-testid': 'open-dialog',
                      children: 'Open Test Dialog',
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _index__WEBPACK_IMPORTED_MODULE_3__.A,
                    {
                      open,
                      onClose: () => setOpen(!1),
                      styles: { theme: 'light' },
                      children: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                        'div',
                        {
                          style: { padding: '24px' },
                          children: [
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'h2',
                              {
                                'data-testid': 'dialog-title',
                                children: 'Test Dialog',
                              }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'p',
                              {
                                'data-testid': 'dialog-content',
                                children:
                                  'This dialog can be closed by clicking the backdrop, pressing Escape, or clicking the close button.',
                              }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_4__.A,
                              {
                                styles: { theme: 'light' },
                                onClick: () => setOpen(!1),
                                'data-testid': 'close-dialog',
                                children: 'Close Dialog',
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
                openButton = canvas.getByTestId('open-dialog')
              await _storybook_test__WEBPACK_IMPORTED_MODULE_2__.Q4.click(
                openButton
              )
              const dialogTitle = canvas.getByTestId('dialog-title')
              await (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                dialogTitle
              ).toBeVisible()
              const closeButton = canvas.getByTestId('close-dialog')
              ;(await _storybook_test__WEBPACK_IMPORTED_MODULE_2__.Q4.click(
                closeButton
              ),
                await (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                  dialogTitle
                ).not.toBeVisible())
            },
          },
          __namedExportsOrder = [
            'Light',
            'LightFullWidth',
            'LightCustomSize',
            'Dark',
            'Sacred',
            'CustomBackdrop',
            'CustomColors',
            'InteractionTest',
          ]
      },
      './src/components/Dialog/index.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        'use strict'
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
    },
  ]
)
