;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [8648],
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
      './src/components/ComplexTextEditor/editor.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        'use strict'
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            AccordionInteractionTest: () => AccordionInteractionTest,
            AccordionMode: () => AccordionMode,
            ComplexEditor: () => ComplexEditor,
            ComplexModeTest: () => ComplexModeTest,
            ComprehensiveShowcase: () => ComprehensiveShowcase,
            CustomColors: () => CustomColors,
            CustomLayout: () => CustomLayout,
            DarkTheme: () => DarkTheme,
            EditorConfiguration: () => EditorConfiguration,
            HelperTextAndErrors: () => HelperTextAndErrors,
            InteractionTest: () => InteractionTest,
            LightTheme: () => LightTheme,
            MarkdownEditor: () => MarkdownEditor,
            MarkdownWithPreview: () => MarkdownWithPreview,
            ModeSwitching: () => ModeSwitching,
            NeonStyle: () => NeonStyle,
            RichTextEditor: () => RichTextEditor,
            SacredTheme: () => SacredTheme,
            SimpleEditor: () => SimpleEditor,
            WithAutoSave: () => WithAutoSave,
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
            './src/components/ComplexTextEditor/index.tsx'
          )
        const ComplexTextEditorWithState = ({
            initialValue = '',
            ...props
          }) => {
            const [value, setValue] = (0,
            react__WEBPACK_IMPORTED_MODULE_1__.useState)(initialValue)
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
              _index__WEBPACK_IMPORTED_MODULE_3__.A,
              { ...props, value, onChange: setValue }
            )
          },
          __WEBPACK_DEFAULT_EXPORT__ = {
            title: 'Components/ComplexTextEditor',
            component: _index__WEBPACK_IMPORTED_MODULE_3__.A,
            parameters: { layout: 'centered' },
            tags: ['autodocs'],
            argTypes: {
              value: { control: 'text' },
              onChange: { action: 'changed' },
              label: { control: 'text' },
              editorType: {
                control: 'select',
                options: ['simple', 'markdown', 'rich', 'complex'],
              },
              minRows: { control: { type: 'number', min: 1, max: 20 } },
              helperText: { control: 'text' },
              styles: {
                control: 'object',
                description:
                  'Comprehensive styling options including theme, colors, accordion mode, and editor configuration',
              },
            },
            decorators: [
              Story =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                  style: { width: '600px', padding: '2rem' },
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
                ComplexTextEditorWithState,
                {
                  label: 'Document Content',
                  initialValue: 'Enter your text here...',
                  styles: { theme: 'light' },
                }
              ),
          },
          DarkTheme = {
            name: 'Dark Theme',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                ComplexTextEditorWithState,
                {
                  label: 'Document Content',
                  initialValue: 'Enter your text here...',
                  styles: { theme: 'dark' },
                }
              ),
            parameters: { backgrounds: { default: 'dark' } },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                ComplexTextEditorWithState,
                {
                  label: 'Sacred Manuscript',
                  initialValue: 'Inscribe your sacred text...',
                  styles: { theme: 'sacred' },
                }
              ),
            parameters: { backgrounds: { default: 'dark' } },
          },
          SimpleEditor = {
            name: 'Simple Text Editor',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
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
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          ComplexTextEditorWithState,
                          {
                            label: 'Simple Text Editor',
                            editorType: 'simple',
                            initialValue:
                              'This is a simple text editor with basic functionality in light theme.',
                            styles: { theme: 'light' },
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
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          ComplexTextEditorWithState,
                          {
                            label: 'Simple Text Editor',
                            editorType: 'simple',
                            initialValue:
                              'This is a simple text editor with basic functionality in dark theme.',
                            styles: { theme: 'dark' },
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
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          ComplexTextEditorWithState,
                          {
                            label: 'Sacred Text Editor',
                            editorType: 'simple',
                            initialValue:
                              'This is a simple text editor with sacred theme styling and mystical appearance.',
                            styles: { theme: 'sacred' },
                          }
                        ),
                      ],
                    }
                  ),
                ],
              }),
            parameters: {
              layout: 'centered',
              backgrounds: { default: 'light' },
            },
          },
          MarkdownEditor = {
            name: 'Markdown Editor',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                ComplexTextEditorWithState,
                {
                  label: 'Markdown Content',
                  editorType: 'markdown',
                  initialValue:
                    '# Markdown Title\\n\\n**Bold text** and *italic text*\\n\\n- List item 1\\n- List item 2',
                  styles: { theme: 'light' },
                }
              ),
          },
          RichTextEditor = {
            name: 'Rich Text Editor',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                ComplexTextEditorWithState,
                {
                  label: 'Rich Text Content',
                  editorType: 'rich',
                  initialValue:
                    'This is a rich text editor with formatting options.',
                  styles: { theme: 'light' },
                }
              ),
          },
          ComplexEditor = {
            name: 'Complex Editor (All Modes)',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                ComplexTextEditorWithState,
                {
                  label: 'Complex Editor',
                  editorType: 'complex',
                  initialValue:
                    'Switch between different editing modes using the toolbar.',
                  styles: { theme: 'light' },
                }
              ),
          },
          AccordionMode = {
            name: 'Accordion Mode',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    ComplexTextEditorWithState,
                    {
                      label: 'Collapsible Editor',
                      initialValue:
                        'This editor is in accordion mode and can be expanded/collapsed.',
                      styles: {
                        theme: 'light',
                        accordionMode: !0,
                        accordionSummary: 'Text Editor',
                        accordionDefaultExpanded: !0,
                      },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    ComplexTextEditorWithState,
                    {
                      label: 'Dark Accordion',
                      initialValue: 'Dark theme with accordion mode.',
                      styles: {
                        theme: 'dark',
                        accordionMode: !0,
                        accordionSummary: 'Dark Editor',
                        accordionDefaultExpanded: !1,
                      },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    ComplexTextEditorWithState,
                    {
                      label: 'Sacred Accordion',
                      initialValue:
                        'Sacred theme with mystical accordion mode.',
                      styles: {
                        theme: 'sacred',
                        accordionMode: !0,
                        accordionSummary: 'Sacred Manuscript',
                        accordionDefaultExpanded: !1,
                      },
                    }
                  ),
                ],
              }),
          },
          CustomColors = {
            name: 'Custom Colors',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                ComplexTextEditorWithState,
                {
                  label: 'Custom Styled Editor',
                  initialValue: 'Custom color scheme for the editor.',
                  styles: {
                    theme: 'light',
                    backgroundColor: 'rgba(255, 240, 245, 0.95)',
                    borderColor: 'rgba(255, 20, 147, 0.4)',
                    borderFocusedColor: 'rgba(255, 20, 147, 1)',
                    textColor: 'rgba(139, 0, 139, 1)',
                    labelColor: 'rgba(139, 0, 139, 0.7)',
                  },
                }
              ),
          },
          NeonStyle = {
            name: 'Neon Style',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                ComplexTextEditorWithState,
                {
                  label: 'Neon Editor',
                  initialValue: 'Futuristic neon design for the editor.',
                  styles: {
                    theme: 'dark',
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    borderColor: 'rgba(0, 255, 255, 0.5)',
                    borderFocusedColor: 'rgba(0, 255, 255, 1)',
                    textColor: 'rgba(0, 255, 255, 1)',
                    labelColor: 'rgba(0, 255, 255, 0.7)',
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
                    ComplexTextEditorWithState,
                    {
                      label: 'Large Padding',
                      initialValue:
                        'Editor with extra padding for comfortable editing.',
                      minRows: 3,
                      styles: {
                        theme: 'light',
                        padding: '24px',
                        borderRadius: '16px',
                        fontSize: '18px',
                      },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    ComplexTextEditorWithState,
                    {
                      label: 'Tall Editor',
                      initialValue:
                        'Taller editor with more rows for longer content.',
                      minRows: 8,
                      styles: { theme: 'light', borderRadius: '8px' },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    ComplexTextEditorWithState,
                    {
                      label: 'Compact Editor',
                      initialValue: 'Compact editor with minimal spacing.',
                      minRows: 2,
                      styles: {
                        theme: 'light',
                        padding: '8px 12px',
                        fontSize: '14px',
                        borderRadius: '4px',
                      },
                    }
                  ),
                ],
              }),
          },
          EditorConfiguration = {
            name: 'Editor Configuration',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    ComplexTextEditorWithState,
                    {
                      label: 'Hide Mode Toggle',
                      editorType: 'complex',
                      initialValue: 'Editor with mode toggle hidden.',
                      styles: { theme: 'light', showModeToggle: !1 },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    ComplexTextEditorWithState,
                    {
                      label: 'Default to Rich Mode',
                      editorType: 'complex',
                      initialValue: 'Editor that starts in rich text mode.',
                      styles: { theme: 'light', defaultMode: 'rich' },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    ComplexTextEditorWithState,
                    {
                      label: 'Default to Markdown',
                      editorType: 'complex',
                      initialValue:
                        '# Markdown Mode\\n\\nStarts in **markdown** editing mode.',
                      styles: { theme: 'dark', defaultMode: 'markdown' },
                    }
                  ),
                ],
              }),
          },
          HelperTextAndErrors = {
            name: 'Helper Text and States',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    ComplexTextEditorWithState,
                    {
                      label: 'With Helper Text',
                      initialValue: 'Editor with helpful information below.',
                      helperText:
                        'This editor supports rich text, markdown, and simple text modes.',
                      styles: { theme: 'light' },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    ComplexTextEditorWithState,
                    {
                      label: 'Error State',
                      initialValue: 'Invalid content',
                      helperText:
                        'Content validation failed. Please check your input.',
                      styles: { theme: 'light', helperTextType: 'error' },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    ComplexTextEditorWithState,
                    {
                      label: 'Info Helper',
                      initialValue: 'Informational content',
                      helperText:
                        'Pro tip: Use Ctrl+B for bold and Ctrl+I for italic in rich text mode.',
                      styles: { theme: 'dark', helperTextType: 'info' },
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
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
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
                                ComplexTextEditorWithState,
                                {
                                  label: 'Simple Editor',
                                  editorType: 'simple',
                                  initialValue: 'Basic text editing',
                                  styles: { theme: 'light' },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                ComplexTextEditorWithState,
                                {
                                  label: 'Rich Text Editor',
                                  editorType: 'rich',
                                  initialValue: 'Rich text with formatting',
                                  styles: { theme: 'light' },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                ComplexTextEditorWithState,
                                {
                                  label: 'Accordion Mode',
                                  initialValue: 'Collapsible editor',
                                  styles: {
                                    theme: 'light',
                                    accordionMode: !0,
                                    accordionSummary: 'Click to expand',
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
                                ComplexTextEditorWithState,
                                {
                                  label: 'Markdown Editor',
                                  editorType: 'markdown',
                                  initialValue:
                                    '# Markdown\\n**Bold** *italic*',
                                  styles: { theme: 'dark' },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                ComplexTextEditorWithState,
                                {
                                  label: 'Complex Editor',
                                  editorType: 'complex',
                                  initialValue: 'Multi-mode editor',
                                  styles: {
                                    theme: 'dark',
                                    defaultMode: 'rich',
                                  },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                ComplexTextEditorWithState,
                                {
                                  label: 'Custom Styling',
                                  initialValue: 'Enhanced dark theme',
                                  styles: {
                                    theme: 'dark',
                                    borderFocusedColor: 'rgba(34, 197, 94, 1)',
                                    labelColor: 'rgba(34, 197, 94, 0.8)',
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
                                ComplexTextEditorWithState,
                                {
                                  label: 'Ancient Manuscript',
                                  editorType: 'simple',
                                  initialValue: 'Sacred text inscribed here...',
                                  styles: { theme: 'sacred' },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                ComplexTextEditorWithState,
                                {
                                  label: 'Divine Scripture',
                                  editorType: 'rich',
                                  initialValue: 'Rich text with sacred powers',
                                  styles: { theme: 'sacred' },
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                ComplexTextEditorWithState,
                                {
                                  label: 'Mystical Accordion',
                                  initialValue: 'Hidden knowledge within',
                                  styles: {
                                    theme: 'sacred',
                                    accordionMode: !0,
                                    accordionSummary: 'Sacred Scrolls',
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
                                ComplexTextEditorWithState,
                                {
                                  label: 'Neon Style',
                                  initialValue: 'Futuristic editor',
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
                                ComplexTextEditorWithState,
                                {
                                  label: 'Soft Rounded',
                                  initialValue: 'Gentle appearance',
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
                                ComplexTextEditorWithState,
                                {
                                  label: 'Minimal Design',
                                  initialValue: 'Clean and simple',
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
          ModeSwitchingDemo = () => {
            const [value, setValue] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(
                '# Welcome\n\nThis editor supports **multiple modes**:\n\n- Simple text\n- **Rich text** with formatting\n- Markdown editing'
              ),
              [mode, setMode] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)('markdown')
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      style: {
                        display: 'flex',
                        gap: '1rem',
                        marginBottom: '1rem',
                      },
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'button',
                          {
                            onClick: () => setMode('simple'),
                            style: {
                              padding: '8px 16px',
                              backgroundColor:
                                'simple' === mode ? '#3B82F6' : '#E5E7EB',
                              color: 'simple' === mode ? 'white' : '#374151',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            },
                            children: 'Simple',
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'button',
                          {
                            onClick: () => setMode('rich'),
                            style: {
                              padding: '8px 16px',
                              backgroundColor:
                                'rich' === mode ? '#3B82F6' : '#E5E7EB',
                              color: 'rich' === mode ? 'white' : '#374151',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            },
                            children: 'Rich Text',
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'button',
                          {
                            onClick: () => setMode('markdown'),
                            style: {
                              padding: '8px 16px',
                              backgroundColor:
                                'markdown' === mode ? '#3B82F6' : '#E5E7EB',
                              color: 'markdown' === mode ? 'white' : '#374151',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            },
                            children: 'Markdown',
                          }
                        ),
                      ],
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _index__WEBPACK_IMPORTED_MODULE_3__.A,
                    {
                      label: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Editor`,
                      value,
                      onChange: setValue,
                      editorType: 'complex',
                      styles: {
                        theme: 'light',
                        defaultMode: mode,
                        showModeToggle: !0,
                      },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'div',
                    {
                      style: {
                        backgroundColor: 'rgba(249, 250, 251, 1)',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(209, 213, 219, 1)',
                        fontSize: '14px',
                        color: '#6B7280',
                      },
                      children: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                        'p',
                        {
                          style: { margin: '0' },
                          children: [
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'strong',
                              { children: 'Current mode:' }
                            ),
                            ' ',
                            mode,
                            ' • Switch between modes to see how the editor adapts while preserving your content.',
                          ],
                        }
                      ),
                    }
                  ),
                ],
              }
            )
          },
          ModeSwitching = {
            name: 'Mode Switching Demo',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                ModeSwitchingDemo,
                {}
              ),
          },
          InteractionTest = {
            name: 'Interaction Test',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                ComplexTextEditorWithState,
                {
                  label: 'Test Editor',
                  initialValue: 'Type here for testing...',
                  editorType: 'simple',
                  styles: { theme: 'light' },
                }
              ),
            play: async ({ canvasElement }) => {
              const canvas = (0,
                _storybook_test__WEBPACK_IMPORTED_MODULE_2__.ux)(canvasElement),
                label = canvas.getByText('Test Editor')
              ;(0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                label
              ).toBeVisible()
              const textarea = canvas.getByDisplayValue(
                'Type here for testing...'
              )
              ;((0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                textarea
              ).toBeVisible(),
                await _storybook_test__WEBPACK_IMPORTED_MODULE_2__.Q4.click(
                  textarea
                ),
                await _storybook_test__WEBPACK_IMPORTED_MODULE_2__.Q4.clear(
                  textarea
                ),
                await _storybook_test__WEBPACK_IMPORTED_MODULE_2__.Q4.type(
                  textarea,
                  'Hello, Complex Editor!',
                  { delay: 50 }
                ),
                await (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                  textarea
                ).toHaveValue('Hello, Complex Editor!'))
            },
          },
          AccordionInteractionTest = {
            name: 'Accordion Interaction Test',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                ComplexTextEditorWithState,
                {
                  label: 'Accordion Test',
                  initialValue: 'Content inside accordion',
                  styles: {
                    theme: 'light',
                    accordionMode: !0,
                    accordionSummary: 'Click to expand editor',
                    accordionDefaultExpanded: !1,
                  },
                }
              ),
            play: async ({ canvasElement }) => {
              const canvas = (0,
                _storybook_test__WEBPACK_IMPORTED_MODULE_2__.ux)(canvasElement),
                accordionButton = canvas.getByText('Click to expand editor')
              ;((0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                accordionButton
              ).toBeVisible(),
                await _storybook_test__WEBPACK_IMPORTED_MODULE_2__.Q4.click(
                  accordionButton
                ))
              const textarea = canvas.getByDisplayValue(
                'Content inside accordion'
              )
              ;(0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                textarea
              ).toBeVisible()
            },
          },
          ComplexModeTest = {
            name: 'Complex Mode Test',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                ComplexTextEditorWithState,
                {
                  label: 'Complex Mode Test',
                  initialValue: 'Test complex editor modes',
                  editorType: 'complex',
                  styles: { theme: 'light' },
                }
              ),
            play: async ({ canvasElement }) => {
              const canvas = (0,
                _storybook_test__WEBPACK_IMPORTED_MODULE_2__.ux)(canvasElement),
                simpleButton = canvas.getByRole('button', { name: /simple/i }),
                richTextButton = canvas.getByRole('button', {
                  name: /rich text/i,
                }),
                markdownButton = canvas.getByRole('button', {
                  name: /markdown/i,
                })
              ;((0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                simpleButton
              ).toBeVisible(),
                (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                  richTextButton
                ).toBeVisible(),
                (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                  markdownButton
                ).toBeVisible(),
                await _storybook_test__WEBPACK_IMPORTED_MODULE_2__.Q4.click(
                  markdownButton
                ))
            },
          },
          WithAutoSave = {
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                ComplexTextEditorWithState,
                {
                  autoSave: !0,
                  autoSaveKey: 'storybook-draft',
                  initialValue: 'Type to see auto-save',
                }
              ),
          },
          MarkdownWithPreview = {
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                ComplexTextEditorWithState,
                { editorType: 'markdown', styles: { theme: 'light' } }
              ),
          },
          __namedExportsOrder = [
            'LightTheme',
            'DarkTheme',
            'SacredTheme',
            'SimpleEditor',
            'MarkdownEditor',
            'RichTextEditor',
            'ComplexEditor',
            'AccordionMode',
            'CustomColors',
            'NeonStyle',
            'CustomLayout',
            'EditorConfiguration',
            'HelperTextAndErrors',
            'ComprehensiveShowcase',
            'ModeSwitching',
            'InteractionTest',
            'AccordionInteractionTest',
            'ComplexModeTest',
            'WithAutoSave',
            'MarkdownWithPreview',
          ]
      },
      './src/components/Field/Dropdown/Regular/index.tsx': (
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
    },
  ]
)
