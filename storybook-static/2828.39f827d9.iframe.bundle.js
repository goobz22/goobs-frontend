'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [2828],
    {
      './src/components/Accordion/index.tsx': (
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
      './src/components/ComplexTextEditor/index.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.d(__webpack_exports__, {
          A: () => components_ComplexTextEditor,
        })
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          Regular = __webpack_require__(
            './src/components/Field/Dropdown/Regular/index.tsx'
          ),
          Button = __webpack_require__('./src/components/Button/index.tsx')
        const useMarkdownEditor_handleBoldClick = (
            selectedText,
            markdown,
            setMarkdown
          ) => {
            if (selectedText) {
              replaceSelectedText(
                '**' + selectedText + '**',
                markdown,
                selectedText,
                setMarkdown
              )
            }
          },
          useMarkdownEditor_handleItalicClick = (
            selectedText,
            markdown,
            setMarkdown
          ) => {
            if (selectedText) {
              replaceSelectedText(
                '_' + selectedText + '_',
                markdown,
                selectedText,
                setMarkdown
              )
            }
          },
          replaceSelectedText = (
            newValue,
            markdown,
            selectedText,
            setMarkdown
          ) => {
            if (selectedText) {
              setMarkdown(markdown.replace(selectedText, newValue))
            }
          }
        var theme = __webpack_require__('./src/theme/index.ts'),
          Link = __webpack_require__('./src/components/Icons/Link.tsx'),
          Undo = __webpack_require__('./src/components/Icons/Undo.tsx'),
          Redo = __webpack_require__('./src/components/Icons/Redo.tsx'),
          FormatAlignLeft = __webpack_require__(
            './src/components/Icons/FormatAlignLeft.tsx'
          ),
          FormatAlignCenter = __webpack_require__(
            './src/components/Icons/FormatAlignCenter.tsx'
          ),
          FormatAlignRight = __webpack_require__(
            './src/components/Icons/FormatAlignRight.tsx'
          ),
          FormatBold = __webpack_require__(
            './src/components/Icons/FormatBold.tsx'
          ),
          FormatItalic = __webpack_require__(
            './src/components/Icons/FormatItalic.tsx'
          ),
          FormatUnderlined = __webpack_require__(
            './src/components/Icons/FormatUnderlined.tsx'
          ),
          StrikethroughS = __webpack_require__(
            './src/components/Icons/StrikethroughS.tsx'
          ),
          Code = __webpack_require__('./src/components/Icons/Code.tsx'),
          FormatListNumbered = __webpack_require__(
            './src/components/Icons/FormatListNumbered.tsx'
          ),
          FormatListBulleted = __webpack_require__(
            './src/components/Icons/FormatListBulleted.tsx'
          )
        const premiumStyles = {
            container: {
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            },
            toolbarRow: {
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              alignItems: 'center',
              flexWrap: 'wrap',
            },
            primaryRow: {
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              alignItems: 'center',
              flexWrap: 'wrap',
            },
            dropdownRow: {
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              alignItems: 'center',
              flexWrap: 'wrap',
            },
            buttonGroup: { display: 'flex', gap: '4px', alignItems: 'center' },
            buttonsContainer: {
              display: 'flex',
              gap: '2px',
              flexWrap: 'wrap',
              alignItems: 'center',
            },
            dropdown: {
              minWidth: '120px',
              maxWidth: '160px',
              flex: '1 1 120px',
            },
          },
          sacredStyles = {
            container: {
              padding: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            },
            toolbarRow: {
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              alignItems: 'center',
              flexWrap: 'wrap',
            },
            primaryRow: {
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              alignItems: 'center',
              flexWrap: 'wrap',
            },
            dropdownRow: {
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              alignItems: 'center',
              flexWrap: 'wrap',
            },
            buttonGroup: { display: 'flex', gap: '4px', alignItems: 'center' },
            buttonsContainer: {
              display: 'flex',
              gap: '2px',
              flexWrap: 'wrap',
              alignItems: 'center',
            },
            dropdown: {
              minWidth: '120px',
              maxWidth: '160px',
              flex: '1 1 120px',
            },
          },
          ToolbarMarkdown = ({
            editor,
            handleBoldClick,
            handleItalicClick,
            handleUnderlineClick,
            handleStrikethroughClick,
            handleCodeClick,
            handleLinkClick,
            handleUndo,
            handleRedo,
            handleAlign,
            handleTextType,
            handleBulletedList,
            handleNumberedList,
            markdownMode,
            setMarkdown,
            toolbarType = 'richtext',
            styles,
          }) => {
            const [alignValue, setAlignValue] = (0, react.useState)('left'),
              [textType, setTextType] = (0, react.useState)('paragraph'),
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme)
            ;(0, react.useEffect)(() => {
              if (isSacredTheme) {
                const styleSheet = document.styleSheets[0],
                  keyframes =
                    '\n        @keyframes toolbarIconGlow {\n          0%, 100% { filter: drop-shadow(0 0 2px rgba(255, 215, 0, 0.5)); }\n          50% { filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8)); }\n        }\n      '
                try {
                  styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
                } catch (e) {}
              }
            }, [isSacredTheme])
            const showExtendedOptions =
                'richtext' === toolbarType && !markdownMode,
              alignmentOptions = [
                {
                  value: 'left',
                  icon: (0, jsx_runtime.jsx)(FormatAlignLeft.A, {
                    style: { width: '16px', height: '16px' },
                  }),
                },
                {
                  value: 'center',
                  icon: (0, jsx_runtime.jsx)(FormatAlignCenter.A, {
                    style: { width: '16px', height: '16px' },
                  }),
                },
                {
                  value: 'right',
                  icon: (0, jsx_runtime.jsx)(FormatAlignRight.A, {
                    style: { width: '16px', height: '16px' },
                  }),
                },
              ],
              handleEditorAction = action => event => {
                if ((event.preventDefault(), markdownMode)) {
                  const selection = window.getSelection()
                  if (selection) {
                    const selectedText = selection.toString()
                    switch (action) {
                      case 'bold':
                        handleBoldClick
                          ? handleBoldClick()
                          : useMarkdownEditor_handleBoldClick(
                              selectedText,
                              selectedText,
                              setMarkdown
                            )
                        break
                      case 'italic':
                        handleItalicClick
                          ? handleItalicClick()
                          : useMarkdownEditor_handleItalicClick(
                              selectedText,
                              selectedText,
                              setMarkdown
                            )
                        break
                      case 'code':
                        if (selectedText) {
                          replaceSelectedText(
                            '`' + selectedText + '`',
                            selectedText,
                            selectedText,
                            setMarkdown
                          )
                        }
                        break
                      case 'link': {
                        const url = prompt('Enter the URL')
                        if (url && selectedText) {
                          replaceSelectedText(
                            '[' + selectedText + '](' + url + ')',
                            selectedText,
                            selectedText,
                            setMarkdown
                          )
                        }
                        break
                      }
                      case 'strikethrough':
                        if (selectedText) {
                          replaceSelectedText(
                            '~~' + selectedText + '~~',
                            selectedText,
                            selectedText,
                            setMarkdown
                          )
                        }
                        break
                      case 'bulleted-list':
                        if (selectedText) {
                          const bulletedList = selectedText
                            .split('\n')
                            .map(line => `* ${line}`)
                            .join('\n')
                          replaceSelectedText(
                            bulletedList,
                            selectedText,
                            selectedText,
                            setMarkdown
                          )
                        }
                        break
                      case 'numbered-list':
                        if (selectedText) {
                          const numberedList = selectedText
                            .split('\n')
                            .map((line, index) => `${index + 1}. ${line}`)
                            .join('\n')
                          replaceSelectedText(
                            numberedList,
                            selectedText,
                            selectedText,
                            setMarkdown
                          )
                        }
                    }
                  }
                } else if (editor)
                  switch (action) {
                    case 'undo':
                      handleUndo && handleUndo()
                      break
                    case 'redo':
                      handleRedo && handleRedo()
                      break
                    case 'bulleted-list':
                      handleBulletedList && handleBulletedList()
                      break
                    case 'numbered-list':
                      handleNumberedList && handleNumberedList()
                      break
                    case 'left':
                      handleAlign && handleAlign('left')
                      break
                    case 'center':
                      handleAlign && handleAlign('center')
                      break
                    case 'right':
                      handleAlign && handleAlign('right')
                      break
                    case 'justify':
                      handleAlign && handleAlign('justify')
                      break
                    case 'bold':
                      handleBoldClick && handleBoldClick()
                      break
                    case 'italic':
                      handleItalicClick && handleItalicClick()
                      break
                    case 'underline':
                      handleUnderlineClick && handleUnderlineClick()
                      break
                    case 'strikethrough':
                      handleStrikethroughClick && handleStrikethroughClick()
                      break
                    case 'code':
                      handleCodeClick && handleCodeClick()
                      break
                    case 'link':
                      handleLinkClick && handleLinkClick()
                  }
              },
              containerStyles = isSacredTheme ? sacredStyles : premiumStyles,
              getButtonStyles = format => {
                const isActive = (format =>
                  !(!editor || markdownMode) &&
                  ([
                    'bulleted-list',
                    'numbered-list',
                    'left',
                    'center',
                    'right',
                    'justify',
                  ].includes(format),
                  document.queryCommandState(format)))(format)
                return {
                  theme: null == styles ? void 0 : styles.theme,
                  backgroundColor: isActive
                    ? isSacredTheme
                      ? 'rgba(255, 215, 0, 0.2)'
                      : 'rgba(0, 0, 0, 0.10)'
                    : 'transparent',
                  color: isActive
                    ? isSacredTheme
                      ? '#FFD700'
                      : theme.Oh.dark
                    : isSacredTheme
                      ? 'rgba(255, 215, 0, 0.8)'
                      : theme.Ql.main,
                  borderRadius: '2px',
                  minWidth: '36px',
                  width: '36px',
                  height: '36px',
                  padding: '6px',
                  margin: '2px',
                }
              }
            return (0, jsx_runtime.jsxs)('div', {
              style: containerStyles.container,
              children: [
                (0, jsx_runtime.jsxs)('div', {
                  style: containerStyles.primaryRow,
                  children: [
                    (0, jsx_runtime.jsxs)('div', {
                      style: containerStyles.buttonGroup,
                      children: [
                        (0, jsx_runtime.jsx)(Button.A, {
                          icon: (0, jsx_runtime.jsx)(Undo.A, {
                            style: { width: '16px', height: '16px' },
                          }),
                          onClick: handleEditorAction('undo'),
                          styles: getButtonStyles('undo'),
                          disabled: markdownMode,
                        }),
                        (0, jsx_runtime.jsx)(Button.A, {
                          icon: (0, jsx_runtime.jsx)(Redo.A, {
                            style: { width: '16px', height: '16px' },
                          }),
                          onClick: handleEditorAction('redo'),
                          styles: getButtonStyles('redo'),
                          disabled: markdownMode,
                        }),
                      ],
                    }),
                    (0, jsx_runtime.jsxs)('div', {
                      style: containerStyles.buttonGroup,
                      children: [
                        (0, jsx_runtime.jsx)(Button.A, {
                          icon: (0, jsx_runtime.jsx)(FormatBold.A, {
                            style: { width: '16px', height: '16px' },
                          }),
                          onClick: handleEditorAction('bold'),
                          styles: getButtonStyles('bold'),
                        }),
                        (0, jsx_runtime.jsx)(Button.A, {
                          icon: (0, jsx_runtime.jsx)(FormatItalic.A, {
                            style: { width: '16px', height: '16px' },
                          }),
                          onClick: handleEditorAction('italic'),
                          styles: getButtonStyles('italic'),
                        }),
                        (0, jsx_runtime.jsx)(Button.A, {
                          icon: (0, jsx_runtime.jsx)(FormatUnderlined.A, {
                            style: { width: '16px', height: '16px' },
                          }),
                          onClick: handleEditorAction('underline'),
                          styles: getButtonStyles('underline'),
                          disabled: markdownMode,
                        }),
                      ],
                    }),
                  ],
                }),
                showExtendedOptions &&
                  (0, jsx_runtime.jsxs)('div', {
                    style: containerStyles.dropdownRow,
                    children: [
                      (0, jsx_runtime.jsx)('div', {
                        style: containerStyles.dropdown,
                        children: (0, jsx_runtime.jsx)(Regular.A, {
                          label: 'Text Type',
                          options: [
                            { value: 'paragraph' },
                            { value: 'h1' },
                            { value: 'h2' },
                            { value: 'h3' },
                          ],
                          value: textType,
                          onChange: event => {
                            const newType = event.target.value
                            ;(setTextType(newType),
                              handleTextType && handleTextType(newType))
                          },
                          styles: {
                            theme:
                              (null == styles ? void 0 : styles.theme) ||
                              'light',
                          },
                        }),
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: containerStyles.dropdown,
                        children: (0, jsx_runtime.jsx)(Regular.A, {
                          label: 'Alignment',
                          options: alignmentOptions,
                          value: alignValue,
                          onChange: event => {
                            setAlignValue(event.target.value)
                          },
                          styles: {
                            theme:
                              (null == styles ? void 0 : styles.theme) ||
                              'light',
                          },
                        }),
                      }),
                    ],
                  }),
                (0, jsx_runtime.jsxs)('div', {
                  style: containerStyles.toolbarRow,
                  children: [
                    (0, jsx_runtime.jsxs)('div', {
                      style: containerStyles.buttonGroup,
                      children: [
                        (0, jsx_runtime.jsx)(Button.A, {
                          icon: (0, jsx_runtime.jsx)(StrikethroughS.A, {
                            style: { width: '16px', height: '16px' },
                          }),
                          onClick: handleEditorAction('strikethrough'),
                          styles: getButtonStyles('strikethrough'),
                        }),
                        (0, jsx_runtime.jsx)(Button.A, {
                          icon: (0, jsx_runtime.jsx)(Code.A, {
                            style: { width: '16px', height: '16px' },
                          }),
                          onClick: handleEditorAction('code'),
                          styles: getButtonStyles('code'),
                        }),
                        (0, jsx_runtime.jsx)(Button.A, {
                          icon: (0, jsx_runtime.jsx)(Link.A, {
                            style: { width: '16px', height: '16px' },
                          }),
                          onClick: handleEditorAction('link'),
                          styles: getButtonStyles('link'),
                        }),
                      ],
                    }),
                    (0, jsx_runtime.jsxs)('div', {
                      style: containerStyles.buttonGroup,
                      children: [
                        (0, jsx_runtime.jsx)(Button.A, {
                          icon: (0, jsx_runtime.jsx)(FormatListNumbered.A, {
                            style: { width: '16px', height: '16px' },
                          }),
                          onClick: handleEditorAction('numbered-list'),
                          styles: getButtonStyles('numbered-list'),
                        }),
                        (0, jsx_runtime.jsx)(Button.A, {
                          icon: (0, jsx_runtime.jsx)(FormatListBulleted.A, {
                            style: { width: '16px', height: '16px' },
                          }),
                          onClick: handleEditorAction('bulleted-list'),
                          styles: getButtonStyles('bulleted-list'),
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            })
          },
          Editor = ToolbarMarkdown
        ToolbarMarkdown.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ToolbarMarkdown',
          props: {
            editor: { required: !1, tsType: { name: 'any' }, description: '' },
            handleBoldClick: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            handleItalicClick: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            handleUnderlineClick: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            handleStrikethroughClick: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            handleCodeClick: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            handleLinkClick: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            handleUndo: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            handleRedo: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            handleAlign: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(align: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'align' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            handleTextType: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(type: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'type' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            handleBulletedList: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            handleNumberedList: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            markdownMode: {
              required: !0,
              tsType: { name: 'boolean' },
              description: '',
            },
            setMarkdown: {
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
              description: '',
            },
            toolbarType: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "'markdown' | 'richtext' | 'rich'",
                elements: [
                  { name: 'literal', value: "'markdown'" },
                  { name: 'literal', value: "'richtext'" },
                  { name: 'literal', value: "'rich'" },
                ],
              },
              description: '',
              defaultValue: { value: "'richtext'", computed: !1 },
            },
            styles: {
              required: !1,
              tsType: { name: 'ComplexTextEditorStyles' },
              description: '',
            },
          },
        }
        var Typography = __webpack_require__(
            './src/components/Typography/index.tsx'
          ),
          Accordion = __webpack_require__(
            './src/components/Accordion/index.tsx'
          )
        function RichTextEditor({
          value,
          onChange,
          minRows = 5,
          styles: editorStyles,
        }) {
          const accordion =
              (null == editorStyles ? void 0 : editorStyles.accordionMode) ||
              !1,
            accordionSummary =
              (null == editorStyles ? void 0 : editorStyles.accordionSummary) ||
              'Rich Text Editor',
            defaultExpanded =
              (null == editorStyles
                ? void 0
                : editorStyles.accordionDefaultExpanded) || !1,
            isSacredTheme =
              'sacred' === (null == editorStyles ? void 0 : editorStyles.theme),
            [isFocused, setIsFocused] = (0, react.useState)(!1),
            [expanded, setExpanded] = (0, react.useState)(defaultExpanded),
            editorRef = (0, react.useRef)(null)
          ;(0, react.useEffect)(() => {
            editorRef.current &&
              editorRef.current.innerHTML !== value &&
              (editorRef.current.innerHTML = value)
          }, [value])
          const handleInput = () => {
              editorRef.current && onChange(editorRef.current.innerHTML)
            },
            execCmd = (cmd, val = null) => {
              var _editorRef_current
              ;(null === (_editorRef_current = editorRef.current) ||
                void 0 === _editorRef_current ||
                _editorRef_current.focus(),
                document.execCommand(cmd, !1, val),
                handleInput())
            },
            computedStyles = (0, theme.lm)(editorStyles, isFocused),
            { themeConfig } = (0, theme.AW)(editorStyles, isFocused)
          ;(0, react.useEffect)(() => {
            if (isSacredTheme) {
              const styleSheet = document.styleSheets[0],
                keyframes =
                  '\n        @keyframes richTextEditorBorderPulse {\n          0%, 100% { border-color: rgba(255, 215, 0, 0.3); }\n          50% { border-color: rgba(255, 215, 0, 0.6); }\n        }\n        @keyframes richTextEditorTextGlow {\n          0%, 100% { text-shadow: 0 0 3px rgba(255, 215, 0, 0.3); }\n          50% { text-shadow: 0 0 6px rgba(255, 215, 0, 0.5); }\n        }\n      '
              try {
                styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
              } catch (e) {}
            }
          }, [isSacredTheme])
          const editorContent = (0, jsx_runtime.jsxs)('div', {
            style: {
              ...computedStyles.editorArea,
              maxWidth: '100%',
              boxSizing: 'border-box',
            },
            children: [
              (0, jsx_runtime.jsx)(Editor, {
                handleBoldClick: () => execCmd('bold'),
                handleItalicClick: () => execCmd('italic'),
                handleUnderlineClick: () => execCmd('underline'),
                handleStrikethroughClick: () => execCmd('strikeThrough'),
                handleCodeClick: () => execCmd('formatBlock', '<pre>'),
                handleLinkClick: () => {
                  const url = prompt('Enter URL')
                  url && execCmd('createLink', url)
                },
                handleUndo: () => execCmd('undo'),
                handleRedo: () => execCmd('redo'),
                handleAlign: align =>
                  execCmd(
                    `justify${align.charAt(0).toUpperCase() + align.slice(1)}`
                  ),
                handleTextType: type => execCmd('formatBlock', `<${type}>`),
                handleBulletedList: () => execCmd('insertUnorderedList'),
                handleNumberedList: () => execCmd('insertOrderedList'),
                markdownMode: !1,
                setMarkdown: () => {},
                toolbarType: 'richtext',
                styles: editorStyles,
              }),
              (0, jsx_runtime.jsxs)('div', {
                style: { position: 'relative' },
                children: [
                  (0, jsx_runtime.jsx)('div', {
                    ref: editorRef,
                    contentEditable: !0,
                    onInput: handleInput,
                    onBlur: () => {
                      setIsFocused(!1)
                    },
                    onFocus: () => {
                      setIsFocused(!0)
                    },
                    style: {
                      minHeight: 20 * minRows + 'px',
                      outline: 'none',
                      width: '100%',
                      maxWidth: '100%',
                      minWidth: '0',
                      boxSizing: 'border-box',
                    },
                    dangerouslySetInnerHTML: { __html: value },
                  }),
                  isSacredTheme &&
                    (0, jsx_runtime.jsx)('div', {
                      style: computedStyles.sacredGlyph,
                      children: theme.vR[2],
                    }),
                ],
              }),
            ],
          })
          return (0, jsx_runtime.jsx)('div', {
            style: computedStyles.container,
            children: accordion
              ? (0, jsx_runtime.jsx)(Accordion.A, {
                  expanded,
                  onChange: () => {
                    setExpanded(!expanded)
                  },
                  styles: {
                    theme: null == editorStyles ? void 0 : editorStyles.theme,
                  },
                  summary: (0, jsx_runtime.jsx)(Typography.A, {
                    variant: 'merrih4',
                    styles: isSacredTheme
                      ? { color: themeConfig.text }
                      : void 0,
                    children: accordionSummary,
                  }),
                  details: editorContent,
                })
              : (0, jsx_runtime.jsx)(jsx_runtime.Fragment, {
                  children: editorContent,
                }),
          })
        }
        const RichEditor = RichTextEditor
        function escapeHtml(unsafe) {
          return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
        }
        function mdToHtml(md) {
          let html = escapeHtml(md)
          return (
            (html = html.replace(/^# (.*)$/gm, '<h1>$1</h1>')),
            (html = html.replace(/^## (.*)$/gm, '<h2>$1</h2>')),
            (html = html.replace(/^### (.*)$/gm, '<h3>$1</h3>')),
            (html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')),
            (html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')),
            (html = html.replace(/~~(.*?)~~/g, '$1')),
            (html = html.replace(/`(.*?)`/g, '<code>$1</code>')),
            (html = html.replace(
              /\[([^[]+)\]\(([^)]+)\)/g,
              '<a href="$2">$1</a>'
            )),
            (html = html.replace(/^- (.*)$/gm, '<ul><li>$1</li></ul>')),
            (html = html.replace(/^\d+\. (.*)$/gm, '<ol><li>$1</li></ol>')),
            (html = html.replace(/\n/g, '<br>')),
            '<p>' + html + '</p>'
          )
        }
        function convertValue(value, fromMode, toMode) {
          if (fromMode === toMode) return value
          let intermediate
          switch (fromMode) {
            case 'simple':
              intermediate = (function textToHtml(text) {
                return '<p>' + escapeHtml(text).replace(/\n/g, '<br>') + '</p>'
              })(value)
              break
            case 'markdown':
              intermediate = mdToHtml(value)
              break
            case 'rich':
              intermediate = value
          }
          switch (toMode) {
            case 'simple':
              return (function htmlToText(html) {
                let text = html
                return (
                  (text = text.replace(/<br>/g, '\n')),
                  (text = text.replace(/<[^>]+>/g, '')),
                  text
                )
              })(intermediate)
            case 'markdown':
              return (function htmlToMd(html) {
                let md = html
                return (
                  (md = md.replace(/<h1>(.*?)<\/h1>/g, '# $1\n')),
                  (md = md.replace(/<h2>(.*?)<\/h2>/g, '## $1\n')),
                  (md = md.replace(/<h3>(.*?)<\/h3>/g, '### $1\n')),
                  (md = md.replace(/<strong>(.*?)<\/strong>/g, '**$1**')),
                  (md = md.replace(/<em>(.*?)<\/em>/g, '*$1*')),
                  (md = md.replace(/(.*?)<\/s>/g, '~~$1~~')),
                  (md = md.replace(/<code>(.*?)<\/code>/g, '`$1`')),
                  (md = md.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')),
                  (md = md.replace(/<li>(.*?)<\/li>/g, '- $1\n')),
                  (md = md.replace(/<br>/g, '\n')),
                  (md = md.replace(/<p>(.*?)<\/p>/g, '$1\n\n')),
                  (md = md.replace(/<[^>]+>/g, '')),
                  md.trim()
                )
              })(intermediate)
            case 'rich':
              return intermediate
          }
          return value
        }
        RichTextEditor.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'RichTextEditor',
          props: {
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
                raw: '(html: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'html' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            minRows: {
              required: !1,
              tsType: { name: 'number' },
              description: '',
              defaultValue: { value: '5', computed: !1 },
            },
            styles: {
              required: !1,
              tsType: { name: 'ComplexTextEditorStyles' },
              description: '',
            },
          },
        }
        const MarkdownEditor = ({ value, onChange, minRows, styles }) => {
            const [markdownValue, setMarkdownValue] = (0, react.useState)(
                value
              ),
              [selectedText, setSelectedText] = (0, react.useState)(''),
              [isFocused, setIsFocused] = (0, react.useState)(!1),
              [showPreview, setShowPreview] = (0, react.useState)(!1),
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              computedStyles = (0, theme.lm)(styles, isFocused)
            ;((0, react.useEffect)(() => {
              if (isSacredTheme) {
                const styleSheet = document.styleSheets[0],
                  keyframes =
                    '\n        @keyframes markdownEditorCodeGlow {\n          0%, 100% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }\n          50% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.5); }\n        }\n        @keyframes markdownEditorGlyphRotate {\n          from { transform: rotate(0deg); }\n          to { transform: rotate(360deg); }\n        }\n      '
                try {
                  styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
                } catch (e) {}
              }
            }, [isSacredTheme]),
              (0, react.useEffect)(() => {
                value !== markdownValue && setMarkdownValue(value)
              }, [value, markdownValue]))
            const textareaStyle = {
              ...computedStyles.editorArea,
              boxSizing: 'border-box',
              width: showPreview ? '50%' : '100%',
              maxWidth: '100%',
              minWidth: '0',
              fontFamily: 'monospace',
              border: 'none',
              outline: 'none',
              resize: 'vertical',
              ...(isSacredTheme && {
                animation: 'markdownEditorCodeGlow 4s ease-in-out infinite',
              }),
            }
            return (0, jsx_runtime.jsxs)('div', {
              style: {
                ...computedStyles.container,
                maxWidth: '100%',
                boxSizing: 'border-box',
              },
              children: [
                (0, jsx_runtime.jsx)(Editor, {
                  handleBoldClick: () =>
                    useMarkdownEditor_handleBoldClick(
                      selectedText,
                      value,
                      onChange
                    ),
                  handleItalicClick: () =>
                    useMarkdownEditor_handleItalicClick(
                      selectedText,
                      value,
                      onChange
                    ),
                  markdownMode: !0,
                  setMarkdown: onChange,
                  toolbarType: 'markdown',
                  styles,
                }),
                (0, jsx_runtime.jsx)('button', {
                  onClick: () => setShowPreview(!showPreview),
                  children: 'Toggle Preview',
                }),
                (0, jsx_runtime.jsxs)('div', {
                  style: { display: 'flex' },
                  children: [
                    (0, jsx_runtime.jsx)('textarea', {
                      value: markdownValue,
                      onChange: event => {
                        const newValue = event.target.value
                        ;(setMarkdownValue(newValue), onChange(newValue))
                      },
                      onSelect: event => {
                        const target = event.target
                        setSelectedText(
                          target.value.substring(
                            target.selectionStart,
                            target.selectionEnd
                          )
                        )
                      },
                      onFocus: () => {
                        setIsFocused(!0)
                      },
                      onBlur: () => {
                        setIsFocused(!1)
                      },
                      placeholder: isSacredTheme
                        ? 'Compose your markdown scripture...'
                        : 'Enter markdown...',
                      style: textareaStyle,
                      rows: minRows || 10,
                    }),
                    showPreview &&
                      (0, jsx_runtime.jsx)('div', {
                        style: { width: '50%', borderLeft: '1px solid' },
                        dangerouslySetInnerHTML: {
                          __html: mdToHtml(markdownValue),
                        },
                      }),
                  ],
                }),
              ],
            })
          },
          ComplexTextEditor_MarkdownEditor = MarkdownEditor
        MarkdownEditor.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'MarkdownEditor',
          props: {
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
                raw: '(value: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'value' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            minRows: {
              required: !1,
              tsType: { name: 'number' },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'ComplexTextEditorStyles' },
              description: '',
            },
          },
        }
        const SimpleEditor = ({ value, onChange, minRows = 5, styles }) => {
            const [isFocused, setIsFocused] = (0, react.useState)(!1),
              [leftGlyph] = (0, react.useState)(
                theme.vR[Math.floor(Math.random() * theme.vR.length)]
              ),
              [rightGlyph] = (0, react.useState)(
                theme.vR[Math.floor(Math.random() * theme.vR.length)]
              ),
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              computedStyles = (0, theme.lm)(styles, isFocused)
            ;(0, react.useEffect)(() => {
              if (isSacredTheme) {
                const styleSheet = document.styleSheets[0],
                  keyframes =
                    '\n        @keyframes simpleEditorInputGlow {\n          0%, 100% { \n            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 5px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(255, 215, 0, 0.1);\n            border-color: rgba(255, 215, 0, 0.3);\n          }\n          50% { \n            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1), 0 0 15px rgba(255, 215, 0, 0.5), inset 0 0 20px rgba(255, 215, 0, 0.2);\n            border-color: rgba(255, 215, 0, 0.5);\n          }\n        }\n        @keyframes simpleEditorGlyphPulse {\n          0%, 100% { opacity: 0.2; }\n          50% { opacity: 0.5; }\n        }\n      '
                try {
                  styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
                } catch (e) {}
              }
            }, [isSacredTheme])
            const textareaStyle = {
                ...computedStyles.editorArea,
                width: '100%',
                maxWidth: '100%',
                minWidth: '0',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                ...(isSacredTheme && { paddingRight: '50px' }),
              },
              scrollbarClassName = computedStyles.scrollbarClassName || '',
              glyphStyles_glyph = {
                position: 'absolute',
                fontSize: '20px',
                color: 'rgba(255, 215, 0, 0.2)',
                pointerEvents: 'none',
                transition: 'all 0.3s ease',
                animation: 'simpleEditorGlyphPulse 3s ease-in-out infinite',
              },
              glyphStyles_glyphTopRight = { top: '10px', right: '10px' },
              glyphStyles_glyphBottomLeft = {
                bottom: '10px',
                left: '10px',
                animationDelay: '1.5s',
              }
            return (0, jsx_runtime.jsx)('div', {
              style: {
                ...computedStyles.container,
                maxWidth: '100%',
                boxSizing: 'border-box',
              },
              children: (0, jsx_runtime.jsxs)('div', {
                style: {
                  position: 'relative',
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                },
                children: [
                  (0, jsx_runtime.jsx)('textarea', {
                    value,
                    onChange: event => {
                      onChange(event.target.value)
                    },
                    onFocus: () => {
                      setIsFocused(!0)
                    },
                    onBlur: () => {
                      setIsFocused(!1)
                    },
                    rows: minRows,
                    placeholder: isSacredTheme
                      ? 'Inscribe your sacred text...'
                      : 'Enter text...',
                    style: textareaStyle,
                    className: scrollbarClassName,
                  }),
                  isSacredTheme &&
                    (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                      children: [
                        (0, jsx_runtime.jsx)('div', {
                          style: {
                            ...glyphStyles_glyph,
                            ...glyphStyles_glyphTopRight,
                          },
                          children: rightGlyph,
                        }),
                        (0, jsx_runtime.jsx)('div', {
                          style: {
                            ...glyphStyles_glyph,
                            ...glyphStyles_glyphBottomLeft,
                          },
                          children: leftGlyph,
                        }),
                      ],
                    }),
                ],
              }),
            })
          },
          ComplexTextEditor_SimpleEditor = SimpleEditor
        SimpleEditor.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'SimpleEditor',
          props: {
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
                raw: '(value: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'value' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            minRows: {
              required: !1,
              tsType: { name: 'number' },
              description: '',
              defaultValue: { value: '5', computed: !1 },
            },
            styles: {
              required: !1,
              tsType: { name: 'ComplexTextEditorStyles' },
              description: '',
            },
          },
        }
        const ComplexToolbar = ({
            mode,
            setMode,
            value,
            onChange,
            minRows = 5,
            styles,
          }) => {
            const computedStyles = (0, theme.lm)(styles, !1)
            return (0, jsx_runtime.jsxs)('div', {
              style: computedStyles.container,
              children: [
                !1 !== (null == styles ? void 0 : styles.showModeToggle) &&
                  (0, jsx_runtime.jsx)('div', {
                    style: computedStyles.toggleRow,
                    children: (0, jsx_runtime.jsxs)(Button.e, {
                      value: mode,
                      exclusive: !0,
                      onChange: (_event, newValue) => {
                        newValue &&
                          (newMode => {
                            const converted = convertValue(value, mode, newMode)
                            ;(onChange(converted), setMode(newMode))
                          })(newValue)
                      },
                      styles: {
                        theme:
                          (null == styles ? void 0 : styles.theme) || 'light',
                        backgroundColor: 'transparent',
                        borderColor: 'transparent',
                        boxShadow: 'none',
                        padding: '0',
                        margin: '0',
                      },
                      children: [
                        (0, jsx_runtime.jsx)(Button.A, {
                          value: 'simple',
                          text: 'Simple',
                        }),
                        (0, jsx_runtime.jsx)(Button.A, {
                          value: 'rich',
                          text: 'Rich Text',
                        }),
                        (0, jsx_runtime.jsx)(Button.A, {
                          value: 'markdown',
                          text: 'Markdown',
                        }),
                      ],
                    }),
                  }),
                'simple' === mode &&
                  (0, jsx_runtime.jsx)(ComplexTextEditor_SimpleEditor, {
                    value,
                    onChange,
                    minRows,
                    styles,
                  }),
                'rich' === mode &&
                  (0, jsx_runtime.jsx)(RichEditor, {
                    value,
                    onChange,
                    minRows,
                    styles,
                  }),
                'markdown' === mode &&
                  (0, jsx_runtime.jsx)(ComplexTextEditor_MarkdownEditor, {
                    value,
                    onChange,
                    minRows,
                    styles,
                  }),
              ],
            })
          },
          Complex = ComplexToolbar
        ComplexToolbar.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ComplexToolbar',
          props: {
            mode: {
              required: !0,
              tsType: {
                name: 'union',
                raw: "'rich' | 'markdown' | 'simple'",
                elements: [
                  { name: 'literal', value: "'rich'" },
                  { name: 'literal', value: "'markdown'" },
                  { name: 'literal', value: "'simple'" },
                ],
              },
              description: '',
            },
            setMode: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(mode: EditorMode) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'union',
                        raw: "'rich' | 'markdown' | 'simple'",
                        elements: [
                          { name: 'literal', value: "'rich'" },
                          { name: 'literal', value: "'markdown'" },
                          { name: 'literal', value: "'simple'" },
                        ],
                      },
                      name: 'mode',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
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
                raw: '(value: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'value' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            minRows: {
              required: !1,
              tsType: { name: 'number' },
              description: '',
              defaultValue: { value: '5', computed: !1 },
            },
            styles: {
              required: !1,
              tsType: { name: 'ComplexTextEditorStyles' },
              description: '',
            },
          },
        }
        const ComplexTextEditor = ({
          value: valueProp,
          editorType,
          initialValue = '',
          initialMode,
          label,
          minRows = 5,
          onChange,
          helperText,
          styles,
          autoSave,
          autoSaveKey,
        }) => {
          const accordion =
              (null == styles ? void 0 : styles.accordionMode) || !1,
            accordionSummary =
              (null == styles ? void 0 : styles.accordionSummary) ||
              label ||
              'Text Editor',
            defaultExpanded =
              (null == styles ? void 0 : styles.accordionDefaultExpanded) || !1,
            isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            startValue = initialValue,
            startMode = (function determineStartMode(
              editorType,
              initialMode,
              defaultMode
            ) {
              if (initialMode) return initialMode
              if (defaultMode) return defaultMode
              switch (editorType) {
                case 'markdown':
                  return 'markdown'
                case 'rich':
                  return 'rich'
                default:
                  return 'simple'
              }
            })(
              editorType,
              initialMode,
              null == styles ? void 0 : styles.defaultMode
            ),
            [valueState, setValueState] = (0, react.useState)(startValue),
            value = void 0 !== valueProp ? valueProp : valueState,
            [mode, setMode] = (0, react.useState)(startMode),
            [isFocused, _setIsFocused] = (0, react.useState)(!1),
            [accordionExpanded, setAccordionExpanded] = (0, react.useState)(
              defaultExpanded
            ),
            stylesWithTransparentLabel = {
              ...styles,
              labelShrunkBackgroundColor: 'transparent',
            },
            computedStyles = (0, theme.lm)(
              stylesWithTransparentLabel,
              isFocused
            ),
            { themeConfig, footerTextColor } = (0, theme.AW)(
              stylesWithTransparentLabel,
              isFocused
            )
          ;((0, react.useEffect)(() => {
            if (autoSave && autoSaveKey) {
              const draft = localStorage.getItem(autoSaveKey)
              draft && !value && setValueState(draft)
            }
          }, [autoSave, autoSaveKey, value]),
            (0, react.useEffect)(() => {
              if (autoSave && autoSaveKey) {
                const timeout = setTimeout(
                  () => localStorage.setItem(autoSaveKey, value),
                  1e3
                )
                return () => clearTimeout(timeout)
              }
            }, [autoSave, autoSaveKey, value]))
          const handleChange = (0, react.useCallback)(
              newValue => {
                ;(void 0 === valueProp && setValueState(newValue),
                  onChange && onChange(newValue))
              },
              [onChange, valueProp]
            ),
            createEditorContent = () =>
              'simple' === editorType
                ? (0, jsx_runtime.jsx)(ComplexTextEditor_SimpleEditor, {
                    value,
                    onChange: handleChange,
                    minRows,
                    styles,
                  })
                : (0, jsx_runtime.jsx)(Complex, {
                    mode,
                    setMode,
                    value,
                    onChange: handleChange,
                    minRows,
                    styles,
                  }),
            labelElement =
              label &&
              !accordion &&
              (0, jsx_runtime.jsx)('label', {
                style: {
                  ...(0, theme.Wh)(themeConfig.label.default, themeConfig),
                  background: 'transparent',
                  backgroundColor: 'transparent',
                  backdropFilter: 'none',
                  padding: '0',
                  borderRadius: '0',
                  boxShadow: 'none',
                  ...(isSacredTheme && {
                    color: 'rgba(255, 215, 0, 0.9)',
                    fontFamily: '"Cinzel", serif',
                    textShadow: '0 0 3px rgba(255, 215, 0, 0.3)',
                    letterSpacing: '0.05em',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }),
                },
                children: label,
              }),
            helperTextElement =
              helperText &&
              (0, jsx_runtime.jsx)('div', {
                style: (0, theme.En)(footerTextColor, themeConfig, styles),
                children: helperText,
              })
          if (accordion) {
            const summaryText = accordionSummary || label || 'Text Editor',
              handleAccordionChange = (_event, expanded) => {
                setAccordionExpanded(expanded)
              }
            return (0, jsx_runtime.jsxs)('div', {
              style: computedStyles.container,
              children: [
                (0, jsx_runtime.jsx)(Accordion.A, {
                  summary: summaryText,
                  details: createEditorContent(),
                  expanded: accordionExpanded,
                  onChange: handleAccordionChange,
                  styles: { theme: null == styles ? void 0 : styles.theme },
                }),
                isSacredTheme &&
                  (0, jsx_runtime.jsx)('div', {
                    style: computedStyles.sacredGlyph,
                    children: theme.vR[14],
                  }),
              ],
            })
          }
          return (0, jsx_runtime.jsxs)('div', {
            children: [
              labelElement,
              (0, jsx_runtime.jsxs)('div', {
                style: computedStyles.container,
                children: [
                  createEditorContent(),
                  helperTextElement,
                  isSacredTheme &&
                    (0, jsx_runtime.jsx)('div', {
                      style: computedStyles.sacredGlyph,
                      children: theme.vR[14],
                    }),
                ],
              }),
            ],
          })
        }
        const components_ComplexTextEditor = ComplexTextEditor
        ComplexTextEditor.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ComplexTextEditor',
          props: {
            value: {
              required: !1,
              tsType: { name: 'string' },
              description:
                'The current value of the editor (for controlled usage).',
            },
            editorType: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "'simple' | 'markdown' | 'rich' | 'complex'",
                elements: [
                  { name: 'literal', value: "'simple'" },
                  { name: 'literal', value: "'markdown'" },
                  { name: 'literal', value: "'rich'" },
                  { name: 'literal', value: "'complex'" },
                ],
              },
              description: 'The type of editor to render.',
            },
            initialValue: {
              required: !1,
              tsType: { name: 'string' },
              description:
                'The initial value of the editor (for uncontrolled usage).',
              defaultValue: { value: "''", computed: !1 },
            },
            initialMode: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "'rich' | 'markdown' | 'simple'",
                elements: [
                  { name: 'literal', value: "'rich'" },
                  { name: 'literal', value: "'markdown'" },
                  { name: 'literal', value: "'simple'" },
                ],
              },
              description: 'The initial mode for complex editors.',
            },
            label: {
              required: !1,
              tsType: { name: 'string' },
              description: 'The label for the editor.',
            },
            minRows: {
              required: !1,
              tsType: { name: 'number' },
              description: 'The minimum number of rows for the editor.',
              defaultValue: { value: '5', computed: !1 },
            },
            onChange: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(value: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'value' }],
                  return: { name: 'void' },
                },
              },
              description: 'Callback fired when the editor value changes.',
            },
            helperText: {
              required: !1,
              tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
              description: 'Helper text to display below the editor.',
            },
            styles: {
              required: !1,
              tsType: { name: 'ComplexTextEditorStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
            autoSave: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
            },
            autoSaveKey: {
              required: !1,
              tsType: { name: 'string' },
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
