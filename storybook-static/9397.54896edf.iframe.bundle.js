'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [9397],
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
          index_es = __webpack_require__(
            './node_modules/slate-react/dist/index.es.js'
          ),
          Regular = __webpack_require__(
            './src/components/Field/Dropdown/Regular/index.tsx'
          ),
          Button = __webpack_require__('./src/components/Button/index.tsx'),
          dist_index_es = __webpack_require__(
            './node_modules/slate/dist/index.es.js'
          ),
          slate_history_dist_index_es = __webpack_require__(
            './node_modules/slate-history/dist/index.es.js'
          )
        const RichTextEditorConfig_Block = {
            Paragraph: 'paragraph',
            ListItem: 'list-item',
            BulletedList: 'bulleted-list',
            NumberedList: 'numbered-list',
            Link: 'link',
          },
          RichTextEditorConfig_Alignment = 'left'
        function isCustomElement(node) {
          return dist_index_es.Hg.isElement(node) && 'type' in node
        }
        const useRichTextEditor = (initialValue, onChange) => {
            const editor = (0, react.useMemo)(
                () =>
                  (0, slate_history_dist_index_es.$k)(
                    (0, index_es.o$)((0, dist_index_es.ie)())
                  ),
                []
              ),
              [markdownMode, setMarkdownMode] = (0, react.useState)(!1),
              [markdown, setMarkdown] = (0, react.useState)(''),
              [slateValue, setSlateValue] = (0, react.useState)([]),
              [internalValue, setInternalValue] = (0, react.useState)(
                initialValue
              )
            ;(0, react.useEffect)(() => {}, [markdownMode])
            const handleChange = (0, react.useCallback)(
                newValue => {
                  ;(setInternalValue(newValue),
                    setSlateValue(newValue),
                    onChange && onChange(newValue))
                },
                [onChange]
              ),
              toggleMark = format => {
                isMarkActive(format)
                  ? dist_index_es.KE.removeMark(editor, format)
                  : dist_index_es.KE.addMark(editor, format, !0)
              },
              isBlockActive = (format, property = 'type') => {
                const [match] = Array.from(
                  dist_index_es.KE.nodes(editor, {
                    match: n =>
                      isCustomElement(n) &&
                      property in n &&
                      n[property] === format,
                  })
                )
                return !!match
              },
              toggleBlock = format => {
                const isActive = isBlockActive(
                    format,
                    Object.values(RichTextEditorConfig_Alignment).includes(
                      format
                    )
                      ? 'align'
                      : 'type'
                  ),
                  isList =
                    'bulleted-list' === format || 'numbered-list' === format
                let newProperties
                if (
                  (dist_index_es.gB.unwrapNodes(editor, {
                    match: n =>
                      isCustomElement(n) &&
                      ('bulleted-list' === n.type ||
                        'numbered-list' === n.type) &&
                      !Object.values(RichTextEditorConfig_Alignment).includes(
                        format
                      ),
                    split: !0,
                  }),
                  (newProperties = Object.values(
                    RichTextEditorConfig_Alignment
                  ).includes(format)
                    ? { align: isActive ? void 0 : format }
                    : {
                        type: isActive
                          ? RichTextEditorConfig_Block.Paragraph
                          : isList
                            ? RichTextEditorConfig_Block.ListItem
                            : format,
                      }),
                  dist_index_es.gB.setNodes(editor, newProperties),
                  !isActive && isList)
                ) {
                  const block = { type: format, children: [] }
                  dist_index_es.gB.wrapNodes(editor, block)
                }
              },
              isMarkActive = format => {
                const marks = dist_index_es.KE.marks(editor)
                return !!marks && !0 === marks[format]
              },
              toggleAlignment = alignment => {
                const [match] = Array.from(
                    dist_index_es.KE.nodes(editor, {
                      match: n => isCustomElement(n) && n.align === alignment,
                      mode: 'all',
                    })
                  ),
                  isActive = !!match
                dist_index_es.gB.setNodes(
                  editor,
                  { align: isActive ? void 0 : alignment },
                  {
                    match: n =>
                      dist_index_es.Hg.isElement(n) &&
                      dist_index_es.KE.isBlock(editor, n),
                  }
                )
              },
              slateToMarkdown = () =>
                internalValue
                  .map(node => {
                    switch (node.type) {
                      case 'bulleted-list':
                        return node.children
                          .map(item => `* ${serializeLeaf(item)}`)
                          .join('\n')
                      case 'numbered-list':
                        return node.children
                          .map(
                            (item, index) =>
                              `${index + 1}. ${serializeLeaf(item)}`
                          )
                          .join('\n')
                      case 'list-item':
                      case 'paragraph':
                      default:
                        return serializeLeaf(node)
                      case 'link':
                        return `[${serializeLeaf(node)}](${node.url})`
                    }
                  })
                  .join('\n\n'),
              serializeLeaf = node => {
                if ('text' in node && 'string' == typeof node.text) {
                  let text = node.text
                  return (
                    'bold' in node &&
                    'italic' in node &&
                    node.bold &&
                    node.italic
                      ? (text = `***${text}***`)
                      : 'bold' in node && node.bold
                        ? (text = `**${text}**`)
                        : 'italic' in node &&
                          node.italic &&
                          (text = `*${text}*`),
                    'code' in node && node.code && (text = `\`${text}\``),
                    'strikethrough' in node &&
                      node.strikethrough &&
                      (text = `~~${text}~~`),
                    text
                  )
                }
                return 'children' in node && Array.isArray(node.children)
                  ? node.children.map(child => serializeLeaf(child)).join('')
                  : ''
              }
            return {
              editor,
              markdownMode,
              setMarkdownMode,
              markdown,
              setMarkdown,
              slateValue,
              setSlateValue,
              internalValue,
              handleChange,
              handleBoldClick: () => {
                toggleMark('bold')
              },
              handleItalicClick: () => {
                toggleMark('italic')
              },
              insertLink: () => {
                let url = window.prompt('Enter the URL of the link:')
                if (!url) return
                const { selection } = editor
                if (!selection) return
                const nodes = Array.from(
                  dist_index_es.KE.nodes(editor, {
                    at: selection,
                    match: n =>
                      isCustomElement(n) &&
                      n.type === RichTextEditorConfig_Block.Link,
                  })
                )
                if (nodes.length > 0) {
                  const [node] = nodes,
                    link = node[0]
                  if (
                    ((url = window.prompt(
                      'Edit the URL of the link:',
                      link.url
                    )),
                    !url)
                  )
                    return
                  dist_index_es.gB.setNodes(
                    editor,
                    { url },
                    { at: index_es.rL.findPath(editor, link) }
                  )
                } else {
                  const link = {
                    type: RichTextEditorConfig_Block.Link,
                    url,
                    children: [
                      { text: dist_index_es.KE.string(editor, selection) },
                    ],
                  }
                  ;(dist_index_es.gB.wrapNodes(editor, link, { split: !0 }),
                    dist_index_es.gB.collapse(editor, { edge: 'end' }))
                }
              },
              onKeyDown: event => {
                if (event.ctrlKey)
                  switch ((event.preventDefault(), event.key)) {
                    case 'b':
                      toggleMark('bold')
                      break
                    case 'i':
                      toggleMark('italic')
                      break
                    case 'u':
                      toggleMark('underline')
                      break
                    case 'z':
                      editor.undo()
                      break
                    case 'y':
                      editor.redo()
                      break
                    case 's':
                      toggleMark('strikethrough')
                      break
                    case 'c':
                      toggleMark('code')
                      break
                    case '1':
                      toggleBlock('bulleted-list')
                      break
                    case '2':
                      toggleBlock('numbered-list')
                      break
                    case 'l':
                      toggleAlignment('left')
                      break
                    case 'e':
                      toggleAlignment('center')
                      break
                    case 'r':
                      toggleAlignment('right')
                      break
                    case 'j':
                      toggleAlignment('justify')
                      break
                    default:
                      return
                  }
              },
              toggleMark,
              toggleBlock,
              isMarkActive,
              isBlockActive,
              toggleAlignment,
              handleSwitchToMarkdown: (setMarkdown, setMarkdownMode) => {
                ;(setMarkdown(slateToMarkdown()), setMarkdownMode(!0))
              },
            }
          },
          useMarkdownEditor_handleBoldClick = (
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
            container: { padding: '8px' },
            toolbarRow: { display: 'flex', flexDirection: 'row', gap: '4px' },
            buttonGroup: { display: 'flex', gap: '4px' },
            buttonsContainer: { display: 'flex', gap: '2px', flexWrap: 'wrap' },
          },
          sacredStyles = {
            container: {
              padding: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            toolbarRow: { display: 'flex', flexDirection: 'row', gap: '4px' },
            buttonGroup: { display: 'flex', gap: '4px' },
            buttonsContainer: { display: 'flex', gap: '2px', flexWrap: 'wrap' },
          },
          ToolbarMarkdown = ({
            editor,
            handleBoldClick,
            handleItalicClick,
            markdownMode,
            setMarkdown,
            toolbarType = 'richtext',
            styles,
          }) => {
            const [alignValue, setAlignValue] = (0, react.useState)('left'),
              [textType, setTextType] = (0, react.useState)('paragraph'),
              { toggleMark, toggleBlock, isMarkActive, isBlockActive } =
                useRichTextEditor([], () => {}),
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
                      'undo' in editor &&
                        'function' == typeof editor.undo &&
                        editor.undo()
                      break
                    case 'redo':
                      'redo' in editor &&
                        'function' == typeof editor.redo &&
                        editor.redo()
                      break
                    case 'bulleted-list':
                    case 'numbered-list':
                    case 'left':
                    case 'center':
                    case 'right':
                    case 'justify':
                      toggleBlock(action)
                      break
                    case 'bold':
                    case 'italic':
                    case 'underline':
                    case 'strikethrough':
                    case 'code':
                      toggleMark(action)
                      break
                    case 'link':
                      editor &&
                        'function' == typeof editor.insertLink &&
                        editor.insertLink()
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
                  ].includes(format)
                    ? isBlockActive(format)
                    : isMarkActive(format)))(format)
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
            return (0, jsx_runtime.jsx)('div', {
              style: containerStyles.container,
              children: (0, jsx_runtime.jsxs)('div', {
                style: containerStyles.toolbarRow,
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
                  showExtendedOptions &&
                    (0, jsx_runtime.jsx)('div', {
                      style: { width: '200px' },
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
                          setTextType(event.target.value)
                        },
                        styles: {
                          theme:
                            (null == styles ? void 0 : styles.theme) || 'light',
                        },
                      }),
                    }),
                  showExtendedOptions &&
                    (0, jsx_runtime.jsx)('div', {
                      style: { width: '150px' },
                      children: (0, jsx_runtime.jsx)(Regular.A, {
                        label: 'Alignment',
                        options: alignmentOptions,
                        value: alignValue,
                        onChange: event => {
                          setAlignValue(event.target.value)
                        },
                        styles: {
                          theme:
                            (null == styles ? void 0 : styles.theme) || 'light',
                        },
                      }),
                    }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: containerStyles.buttonsContainer,
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
            })
          },
          Editor = ToolbarMarkdown
        ToolbarMarkdown.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ToolbarMarkdown',
          props: {
            editor: {
              required: !1,
              tsType: {
                name: 'intersection',
                raw: 'BaseEditor & ReactEditor & HistoryEditor',
                elements: [
                  { name: 'BaseEditor' },
                  { name: 'ReactEditor' },
                  { name: 'HistoryEditor' },
                ],
              },
              description: '',
            },
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
            markdownMode: {
              required: !0,
              tsType: { name: 'boolean' },
              description: '',
            },
            setMarkdownMode: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(value: boolean) => void',
                signature: {
                  arguments: [{ type: { name: 'boolean' }, name: 'value' }],
                  return: { name: 'void' },
                },
              },
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
                raw: "'markdown' | 'richtext'",
                elements: [
                  { name: 'literal', value: "'markdown'" },
                  { name: 'literal', value: "'richtext'" },
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
        const Leaf = ({ attributes, children, leaf, sacredtheme = !1 }) => {
          const customLeaf = leaf,
            linkStyle = sacredtheme
              ? { color: 'rgba(255, 215, 0, 1)', textDecoration: 'underline' }
              : { color: 'rgba(37, 99, 235, 1)', textDecoration: 'underline' },
            codeStyle = sacredtheme
              ? {
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  color: 'rgba(255, 215, 0, 1)',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                }
              : {
                  backgroundColor: 'rgba(243, 244, 246, 1)',
                  color: 'rgba(55, 65, 81, 1)',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                },
            textStyle = sacredtheme
              ? { color: 'rgba(255, 215, 0, 0.9)' }
              : { color: 'rgba(0, 0, 0, 1)' }
          let formattedChildren = children
          return (
            customLeaf.bold &&
              (formattedChildren = (0, jsx_runtime.jsx)('strong', {
                children: formattedChildren,
              })),
            customLeaf.italic &&
              (formattedChildren = (0, jsx_runtime.jsx)('em', {
                children: formattedChildren,
              })),
            customLeaf.underline &&
              (formattedChildren = (0, jsx_runtime.jsx)('u', {
                children: formattedChildren,
              })),
            customLeaf.strikethrough &&
              (formattedChildren = (0, jsx_runtime.jsx)('s', {
                children: formattedChildren,
              })),
            customLeaf.link &&
              (formattedChildren = (0, jsx_runtime.jsx)('a', {
                href: customLeaf.link,
                style: linkStyle,
                children: formattedChildren,
              })),
            customLeaf.code &&
              (formattedChildren = (0, jsx_runtime.jsx)('code', {
                style: codeStyle,
                children: formattedChildren,
              })),
            (0, jsx_runtime.jsx)('span', {
              ...attributes,
              style: textStyle,
              children: formattedChildren,
            })
          )
        }
        function RichTextEditor({
          value,
          onChange,
          label,
          minRows = 5,
          markdownMode,
          setMarkdownMode,
          setMarkdown,
          styles: editorStyles,
        }) {
          const accordion =
              (null == editorStyles ? void 0 : editorStyles.accordionMode) ||
              !1,
            accordionSummary =
              (null == editorStyles ? void 0 : editorStyles.accordionSummary) ||
              label ||
              'Rich Text Editor',
            defaultExpanded =
              (null == editorStyles
                ? void 0
                : editorStyles.accordionDefaultExpanded) || !1,
            isSacredTheme =
              'sacred' === (null == editorStyles ? void 0 : editorStyles.theme),
            [isFocused, setIsFocused] = (0, react.useState)(!1),
            [expanded, setExpanded] = (0, react.useState)(defaultExpanded),
            computedStyles = (0, theme.lm)(editorStyles, isFocused),
            { themeConfig } = (0, theme.AW)(editorStyles, isFocused),
            {
              editor,
              internalValue,
              handleChange,
              handleBoldClick,
              handleItalicClick,
              onKeyDown,
            } = useRichTextEditor(value, onChange ? () => onChange() : void 0)
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
          const renderElement = (0, react.useCallback)(
              props =>
                (0, jsx_runtime.jsx)(Element, {
                  ...props,
                  sacredtheme: isSacredTheme,
                }),
              [isSacredTheme]
            ),
            renderLeaf = (0, react.useCallback)(
              props =>
                (0, jsx_runtime.jsx)(Leaf, {
                  ...props,
                  sacredtheme: isSacredTheme,
                }),
              [isSacredTheme]
            ),
            editorContent = (0, jsx_runtime.jsx)('div', {
              style: computedStyles.editorArea,
              children: (0, jsx_runtime.jsxs)(index_es.A, {
                editor,
                initialValue: internalValue,
                onChange: handleChange,
                children: [
                  (0, jsx_runtime.jsx)(Editor, {
                    markdownMode,
                    setMarkdownMode,
                    setMarkdown,
                    handleBoldClick,
                    handleItalicClick,
                    toolbarType: 'richtext',
                    editor,
                    styles: editorStyles,
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: { position: 'relative' },
                    children: [
                      (0, jsx_runtime.jsx)(index_es.Fo, {
                        style: {
                          ...computedStyles.editorArea,
                          minHeight: 20 * minRows + 'px',
                          border: 'none',
                          outline: 'none',
                        },
                        placeholder: isSacredTheme
                          ? 'Channel divine wisdom...'
                          : 'Enter text...',
                        onKeyDown,
                        onFocus: () => {
                          setIsFocused(!0)
                        },
                        onBlur: () => {
                          setIsFocused(!1)
                        },
                        renderElement,
                        renderLeaf,
                      }),
                      isSacredTheme &&
                        (0, jsx_runtime.jsx)('div', {
                          style: computedStyles.sacredGlyph,
                          children: theme.vR[2],
                        }),
                    ],
                  }),
                ],
              }),
            }),
            labelElement =
              label &&
              !accordion &&
              (0, jsx_runtime.jsx)('label', {
                style: (0, theme.Wh)(themeConfig.label.default, themeConfig),
                children: label,
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
                    children: accordionSummary || label || 'Rich Text Editor',
                  }),
                  details: editorContent,
                })
              : (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                  children: [labelElement, editorContent],
                }),
          })
        }
        const Element = ({
            attributes,
            children,
            element,
            sacredtheme = !1,
          }) => {
            const customElement = element,
              textStyle = sacredtheme
                ? { color: 'rgba(255, 215, 0, 0.9)' }
                : { color: 'rgba(0, 0, 0, 1)' },
              linkStyle = sacredtheme
                ? { color: 'rgba(255, 215, 0, 1)', textDecoration: 'underline' }
                : { color: 'rgba(37, 99, 235, 1)', textDecoration: 'underline' }
            if (!customElement.type) return null
            const style = { textAlign: customElement.align, ...textStyle }
            switch (customElement.type) {
              case 'list-item':
                return (0, jsx_runtime.jsx)('li', {
                  style,
                  ...attributes,
                  children,
                })
              case 'link':
                return (0, jsx_runtime.jsx)('a', {
                  href: customElement.url,
                  ...attributes,
                  style: { ...style, ...linkStyle },
                  children,
                })
              case 'bulleted-list':
                return (0, jsx_runtime.jsx)('ul', {
                  style,
                  ...attributes,
                  children,
                })
              case 'numbered-list':
                return (0, jsx_runtime.jsx)('ol', {
                  style,
                  ...attributes,
                  children,
                })
              default:
                return (0, jsx_runtime.jsx)('p', {
                  style,
                  ...attributes,
                  children,
                })
            }
          },
          RichEditor = RichTextEditor
        RichTextEditor.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'RichTextEditor',
          props: {
            value: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'Descendant' }],
                raw: 'Descendant[]',
              },
              description: '',
            },
            label: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            minRows: {
              required: !1,
              tsType: { name: 'number' },
              description: '',
              defaultValue: { value: '5', computed: !1 },
            },
            onChange: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onSelectionChange: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onValueChange: {
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
            setMarkdownMode: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(value: boolean) => void',
                signature: {
                  arguments: [{ type: { name: 'boolean' }, name: 'value' }],
                  return: { name: 'void' },
                },
              },
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
            styles: {
              required: !1,
              tsType: { name: 'ComplexTextEditorStyles' },
              description: '',
            },
          },
        }
        const MarkdownEditor = ({
            markdown,
            setMarkdown,
            markdownMode,
            setMarkdownMode,
            styles,
          }) => {
            const [markdownValue, setMarkdownValue] = (0, react.useState)(
                markdown
              ),
              [selectedText, setSelectedText] = (0, react.useState)(''),
              [isFocused, setIsFocused] = (0, react.useState)(!1),
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
              (0, react.useEffect)(() => {}, [markdownMode]),
              (0, react.useEffect)(() => {
                markdown !== markdownValue && setMarkdownValue(markdown)
              }, [markdown, markdownValue]))
            const textareaStyle = {
              ...computedStyles.editorArea,
              boxSizing: 'border-box',
              width: '100%',
              fontFamily: 'monospace',
              border: 'none',
              outline: 'none',
              resize: 'vertical',
              ...(isSacredTheme && {
                animation: 'markdownEditorCodeGlow 4s ease-in-out infinite',
              }),
            }
            return (0, jsx_runtime.jsxs)('div', {
              style: computedStyles.editorArea,
              children: [
                (0, jsx_runtime.jsx)(Editor, {
                  markdownMode,
                  setMarkdownMode,
                  setMarkdown,
                  handleBoldClick: () =>
                    useMarkdownEditor_handleBoldClick(
                      selectedText,
                      markdown,
                      setMarkdown
                    ),
                  handleItalicClick: () =>
                    useMarkdownEditor_handleItalicClick(
                      selectedText,
                      markdown,
                      setMarkdown
                    ),
                  toolbarType: 'markdown',
                  styles,
                }),
                (0, jsx_runtime.jsxs)('div', {
                  style: { position: 'relative' },
                  children: [
                    (0, jsx_runtime.jsx)('textarea', {
                      value: markdownValue,
                      onChange: event => {
                        const newValue = event.target.value
                        ;(setMarkdownValue(newValue), setMarkdown(newValue))
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
                      rows: 10,
                    }),
                    isSacredTheme &&
                      (0, jsx_runtime.jsx)('div', {
                        style: computedStyles.sacredGlyph,
                        children: theme.vR[1],
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
            markdown: {
              required: !0,
              tsType: { name: 'string' },
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
            markdownMode: {
              required: !0,
              tsType: { name: 'boolean' },
              description: '',
            },
            setMarkdownMode: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(value: boolean) => void',
                signature: {
                  arguments: [{ type: { name: 'boolean' }, name: 'value' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            setNewSlateValue: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: "(value: RichTextEditorTypes['CustomElement'][]) => void",
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'Array',
                        elements: [
                          {
                            name: "RichTextEditorTypes['CustomElement']",
                            raw: "RichTextEditorTypes['CustomElement']",
                          },
                        ],
                        raw: "RichTextEditorTypes['CustomElement'][]",
                      },
                      name: 'value',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'ComplexTextEditorStyles' },
              description: '',
            },
          },
        }
        const SimpleEditor = ({
            value,
            setValue,
            minRows = 5,
            label,
            styles,
          }) => {
            const [isFocused, setIsFocused] = (0, react.useState)(!1),
              [leftGlyph] = (0, react.useState)(
                theme.vR[Math.floor(Math.random() * theme.vR.length)]
              ),
              [rightGlyph] = (0, react.useState)(
                theme.vR[Math.floor(Math.random() * theme.vR.length)]
              ),
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              computedStyles = (0, theme.lm)(styles, isFocused),
              { themeConfig } = (0, theme.AW)(styles, isFocused)
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
            const labelElement =
                label &&
                (0, jsx_runtime.jsx)('label', {
                  style: (0, theme.Wh)(themeConfig.label.default, themeConfig),
                  children: label,
                }),
              textareaStyle = {
                ...computedStyles.editorArea,
                width: '100%',
                resize: 'vertical',
                fontFamily: 'inherit',
                ...(isSacredTheme && { paddingRight: '50px' }),
              },
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
            return (0, jsx_runtime.jsxs)('div', {
              style: computedStyles.container,
              children: [
                labelElement,
                (0, jsx_runtime.jsxs)('div', {
                  style: { position: 'relative' },
                  children: [
                    (0, jsx_runtime.jsx)('textarea', {
                      value,
                      onChange: event => {
                        setValue(event.target.value)
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
                        : label || 'Enter text...',
                      style: textareaStyle,
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
              ],
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
            setValue: {
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
            label: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'ComplexTextEditorStyles' },
              description: '',
            },
          },
        }
        var console = __webpack_require__(
          './node_modules/console-browserify/index.js'
        )
        const ComplexToolbar = ({
            mode,
            setMode,
            label,
            minRows = 5,
            simpleValue,
            setSimpleValue,
            richValue,
            onRichChange,
            markdown,
            setMarkdown,
            markdownMode,
            setMarkdownMode,
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
                      onChange: (_event, newMode) => {
                        null !== newMode && setMode(newMode)
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
                    value: simpleValue,
                    setValue: setSimpleValue,
                    minRows,
                    label,
                    styles,
                  }),
                'rich' === mode &&
                  (0, jsx_runtime.jsx)(RichEditor, {
                    value: richValue,
                    onChange: onRichChange,
                    label,
                    minRows,
                    markdownMode,
                    setMarkdownMode,
                    setMarkdown,
                    styles,
                  }),
                'markdown' === mode &&
                  (0, jsx_runtime.jsx)(ComplexTextEditor_MarkdownEditor, {
                    markdown,
                    setMarkdown,
                    markdownMode,
                    setMarkdownMode,
                    setNewSlateValue: value => {
                      console.log('Setting new slate value:', value)
                    },
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
            label: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            minRows: {
              required: !1,
              tsType: { name: 'number' },
              description: '',
              defaultValue: { value: '5', computed: !1 },
            },
            simpleValue: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            setSimpleValue: {
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
            richValue: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'Descendant' }],
                raw: 'Descendant[]',
              },
              description: '',
            },
            onRichChange: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            markdown: {
              required: !0,
              tsType: { name: 'string' },
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
            markdownMode: {
              required: !0,
              tsType: { name: 'boolean' },
              description: '',
            },
            setMarkdownMode: {
              required: !0,
              tsType: {
                name: 'ReactDispatch',
                raw: 'React.Dispatch<React.SetStateAction<boolean>>',
                elements: [
                  {
                    name: 'ReactSetStateAction',
                    raw: 'React.SetStateAction<boolean>',
                    elements: [{ name: 'boolean' }],
                  },
                ],
              },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'ComplexTextEditorStyles' },
              description: '',
            },
          },
        }
        var ComplexTextEditor_console = __webpack_require__(
          './node_modules/console-browserify/index.js'
        )
        const initialSlateValue = [{ children: [{ text: '' }] }],
          ComplexTextEditor = ({
            value,
            editorType,
            initialValue = '',
            initialMode,
            label,
            minRows = 5,
            onChange,
            helperText,
            styles,
          }) => {
            const accordion =
                (null == styles ? void 0 : styles.accordionMode) || !1,
              accordionSummary =
                (null == styles ? void 0 : styles.accordionSummary) ||
                label ||
                'Text Editor',
              defaultExpanded =
                (null == styles ? void 0 : styles.accordionDefaultExpanded) ||
                !1,
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme)
            ComplexTextEditor_console.log('ComplexTextEditor rendered:', {
              editorType,
              theme: null == styles ? void 0 : styles.theme,
            })
            const startValue = void 0 !== value ? value : initialValue,
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
              [mode, setMode] = (0, react.useState)(startMode),
              [simpleValue, setSimpleValue] = (0, react.useState)(startValue),
              [richValue] = (0, react.useState)(initialSlateValue),
              [markdown, setMarkdown] = (0, react.useState)(startValue),
              [markdownMode, setMarkdownMode] = (0, react.useState)(
                'markdown' === startMode
              ),
              [isFocused, _setIsFocused] = (0, react.useState)(!1),
              computedStyles = (0, theme.lm)(styles, isFocused),
              { themeConfig, footerTextColor } = (0, theme.AW)(
                styles,
                isFocused
              )
            ;(0, react.useEffect)(() => {
              void 0 !== value &&
                value !== simpleValue &&
                (setSimpleValue(value), setMarkdown(value))
            }, [value, simpleValue])
            const handleSimpleValueChange = (0, react.useCallback)(
                value => {
                  ;(setSimpleValue(value), onChange && onChange(value))
                },
                [onChange]
              ),
              handleRichChange = (0, react.useCallback)(() => {
                ComplexTextEditor_console.log('Rich content changed')
              }, []),
              handleMarkdownChange = (0, react.useCallback)(
                value => {
                  ;(setMarkdown(value), onChange && onChange(value))
                },
                [onChange]
              ),
              createEditorContent = () => {
                const editorLabel = accordion ? void 0 : label
                return 'simple' === editorType
                  ? (0, jsx_runtime.jsx)(ComplexTextEditor_SimpleEditor, {
                      value: simpleValue,
                      setValue: handleSimpleValueChange,
                      minRows,
                      label: editorLabel,
                      styles,
                    })
                  : (0, jsx_runtime.jsx)(Complex, {
                      mode,
                      setMode,
                      label: editorLabel,
                      minRows,
                      simpleValue,
                      setSimpleValue: handleSimpleValueChange,
                      richValue,
                      onRichChange: handleRichChange,
                      markdown,
                      setMarkdown: handleMarkdownChange,
                      markdownMode,
                      setMarkdownMode,
                      styles,
                    })
              },
              labelElement =
                label &&
                !accordion &&
                (0, jsx_runtime.jsx)('label', {
                  style: (0, theme.Wh)(themeConfig.label.default, themeConfig),
                  children: label,
                }),
              helperTextElement =
                helperText &&
                (0, jsx_runtime.jsx)('div', {
                  style: (0, theme.En)(footerTextColor, themeConfig, styles),
                  children: helperText,
                })
            if (accordion) {
              const summaryText = accordionSummary || label || 'Text Editor'
              return (0, jsx_runtime.jsxs)('div', {
                style: computedStyles.container,
                children: [
                  (0, jsx_runtime.jsx)(Accordion.A, {
                    summary: summaryText,
                    details: createEditorContent(),
                    expanded: defaultExpanded,
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
              style: computedStyles.container,
              children: [
                labelElement,
                createEditorContent(),
                helperTextElement,
                isSacredTheme &&
                  (0, jsx_runtime.jsx)('div', {
                    style: computedStyles.sacredGlyph,
                    children: theme.vR[14],
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
          },
        }
      },
    },
  ]
)
