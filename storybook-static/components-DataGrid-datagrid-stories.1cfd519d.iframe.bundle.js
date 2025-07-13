'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [1793],
    {
      './src/components/Checkbox/index.tsx': (
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
          )
        const CheckIcon = ({ theme }) =>
            (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('svg', {
              viewBox: '0 0 20 20',
              fill: 'currentColor',
              style: {
                width: 'sacred' === theme ? '20px' : '18px',
                height: 'sacred' === theme ? '20px' : '18px',
                flexShrink: 0,
              },
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                'path',
                {
                  d: 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z',
                  strokeWidth: '0.5',
                  stroke: 'currentColor',
                }
              ),
            }),
          IndeterminateIcon = ({ theme }) =>
            (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('svg', {
              viewBox: '0 0 20 20',
              fill: 'currentColor',
              style: {
                width: 'sacred' === theme ? '20px' : '18px',
                height: 'sacred' === theme ? '20px' : '18px',
                flexShrink: 0,
              },
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                'path',
                {
                  d: 'M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z',
                  strokeWidth: '0.5',
                  stroke: 'currentColor',
                }
              ),
            }),
          SacredGlyphs = ({ isHovered }) => {
            const glyphStyles = (0, react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(
              () => ({
                glyph: {
                  position: 'absolute',
                  fontSize: '12px',
                  color: 'rgba(255, 215, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  pointerEvents: 'none',
                },
                glyphLeft: {
                  left: '-24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                },
                glyphRight: {
                  right: '-24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                },
                glyphVisible: { opacity: 0.6 },
                glyphFloating: {
                  animation: 'sacredFloat 3s ease-in-out infinite',
                },
                glyphDelayedFloating: {
                  animation: 'sacredFloat 3s ease-in-out infinite 1.5s',
                },
              }),
              []
            )
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment,
              {
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'span',
                    {
                      style: {
                        ...glyphStyles.glyph,
                        ...glyphStyles.glyphLeft,
                        ...(isHovered && glyphStyles.glyphVisible),
                        ...glyphStyles.glyphFloating,
                      },
                      children: _theme__WEBPACK_IMPORTED_MODULE_2__.vR[11],
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'span',
                    {
                      style: {
                        ...glyphStyles.glyph,
                        ...glyphStyles.glyphRight,
                        ...(isHovered && glyphStyles.glyphVisible),
                        ...glyphStyles.glyphDelayedFloating,
                      },
                      children: _theme__WEBPACK_IMPORTED_MODULE_2__.vR[15],
                    }
                  ),
                ],
              }
            )
          },
          PremiumAccent = ({ isChecked, isIndeterminate, outline }) => {
            const accentStyles = (0,
            react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(
              () => ({
                accent: {
                  position: 'absolute',
                  left: '-2px',
                  top: '-2px',
                  right: '-2px',
                  bottom: '-2px',
                  borderRadius: '6px',
                  background:
                    'linear-gradient(45deg, rgb(59, 130, 246), rgb(147, 197, 253))',
                  opacity: 0.3,
                  transition: 'opacity 0.3s ease',
                  zIndex: -1,
                },
              }),
              []
            )
            return outline && (isChecked || isIndeterminate)
              ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                  style: accentStyles.accent,
                })
              : null
          },
          Checkbox = (0, react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(
            (props, ref) => {
              const {
                  indeterminate,
                  checked: controlledChecked,
                  defaultChecked,
                  onChange,
                  onFocus,
                  onBlur,
                  styles,
                  ...rest
                } = props,
                id = (0, react__WEBPACK_IMPORTED_MODULE_1__.useId)(),
                internalRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(
                  null
                ),
                [isHovered, setIsHovered] = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
                [uncontrolledChecked, setUncontrolledChecked] = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useState)(
                  defaultChecked || !1
                ),
                isControlled = void 0 !== controlledChecked,
                checked = isControlled
                  ? controlledChecked
                  : uncontrolledChecked,
                isDisabled = !(
                  !(null == styles ? void 0 : styles.disabled) && !rest.disabled
                ),
                isSacredTheme =
                  'sacred' === (null == styles ? void 0 : styles.theme),
                isChecked = checked,
                isIndeterminate = indeterminate && !isChecked,
                computedStyles = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(
                  () =>
                    (0, _theme__WEBPACK_IMPORTED_MODULE_2__.WS)(
                      styles,
                      isHovered,
                      isChecked,
                      isIndeterminate,
                      isDisabled
                    ),
                  [styles, isHovered, isChecked, isIndeterminate, isDisabled]
                ),
                handleFocus = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(
                  event => {
                    null == onFocus || onFocus(event)
                  },
                  [onFocus]
                ),
                handleBlur = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(
                  event => {
                    null == onBlur || onBlur(event)
                  },
                  [onBlur]
                ),
                handleChange = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(
                  e => {
                    const newChecked = e.target.checked
                    ;(isControlled || setUncontrolledChecked(newChecked),
                      null == onChange || onChange(newChecked))
                  },
                  [isControlled, onChange]
                ),
                handleMouseEnter = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
                  setIsHovered(!0)
                }, []),
                handleMouseLeave = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
                  setIsHovered(!1)
                }, [])
              return (
                (0, react__WEBPACK_IMPORTED_MODULE_1__.useImperativeHandle)(
                  ref,
                  () => internalRef.current
                ),
                (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
                  internalRef.current &&
                    (internalRef.current.indeterminate = indeterminate || !1)
                }, [indeterminate]),
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                  'label',
                  {
                    htmlFor: id,
                    style: computedStyles.wrapper,
                    onMouseEnter: handleMouseEnter,
                    onMouseLeave: handleMouseLeave,
                    children: [
                      isSacredTheme &&
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          SacredGlyphs,
                          { isHovered }
                        ),
                      !isSacredTheme &&
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          PremiumAccent,
                          {
                            isChecked,
                            isIndeterminate: !!isIndeterminate,
                            outline:
                              !1 !== (null == styles ? void 0 : styles.outline),
                          }
                        ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                        'div',
                        {
                          style: computedStyles.container,
                          children: [
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'input',
                              {
                                type: 'checkbox',
                                id,
                                ref: internalRef,
                                style: computedStyles.input,
                                'aria-checked': indeterminate
                                  ? 'mixed'
                                  : void 0,
                                disabled: isDisabled,
                                checked: !!isChecked,
                                onChange: handleChange,
                                onFocus: handleFocus,
                                onBlur: handleBlur,
                                ...rest,
                              }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'div',
                              { style: computedStyles.box }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'div',
                              {
                                style: computedStyles.icon,
                                children: indeterminate
                                  ? (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      IndeterminateIcon,
                                      {
                                        theme:
                                          null == styles
                                            ? void 0
                                            : styles.theme,
                                      }
                                    )
                                  : (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      CheckIcon,
                                      {
                                        theme:
                                          null == styles
                                            ? void 0
                                            : styles.theme,
                                      }
                                    ),
                              }
                            ),
                          ],
                        }
                      ),
                    ],
                  }
                )
              )
            }
          )
        Checkbox.displayName = 'Checkbox'
        const __WEBPACK_DEFAULT_EXPORT__ = Checkbox
        Checkbox.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'Checkbox',
          props: {
            checked: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'Whether the checkbox is checked',
            },
            defaultChecked: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'Default checked state for uncontrolled mode',
            },
            onChange: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(checked: boolean) => void',
                signature: {
                  arguments: [{ type: { name: 'boolean' }, name: 'checked' }],
                  return: { name: 'void' },
                },
              },
              description: 'Callback when checkbox state changes',
            },
            onFocus: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.FocusEvent<HTMLInputElement>) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactFocusEvent',
                        raw: 'React.FocusEvent<HTMLInputElement>',
                        elements: [{ name: 'HTMLInputElement' }],
                      },
                      name: 'event',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: 'Callback when checkbox is focused',
            },
            onBlur: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.FocusEvent<HTMLInputElement>) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactFocusEvent',
                        raw: 'React.FocusEvent<HTMLInputElement>',
                        elements: [{ name: 'HTMLInputElement' }],
                      },
                      name: 'event',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: 'Callback when checkbox loses focus',
            },
            indeterminate: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'Whether the checkbox is in indeterminate state',
            },
            styles: {
              required: !1,
              tsType: { name: 'CheckboxStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
          },
          composes: ['Omit'],
        }
      },
      './src/components/DataGrid/datagrid.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            CustomStyling: () => CustomStyling,
            DarkTheme: () => DarkTheme,
            InteractiveDemo: () => InteractiveDemo,
            LightTheme: () => LightTheme,
            SacredTheme: () => SacredTheme,
            __namedExportsOrder: () => __namedExportsOrder,
            default: () => datagrid_stories,
          }))
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          Toolbar = __webpack_require__('./src/components/Toolbar/index.tsx'),
          esm_react = __webpack_require__('./node_modules/jotai/esm/react.mjs'),
          vanilla = __webpack_require__('./node_modules/jotai/esm/vanilla.mjs')
        const columnVisibilityAtom = (0,
          __webpack_require__('./node_modules/jotai/esm/vanilla/utils.mjs').tG)(
            'columnVisibility',
            {}
          ),
          columnsAtom = (0, vanilla.eU)([]),
          columnVisibilityActions = (0, vanilla.eU)(
            null,
            (get, set, update) => {
              const currentVisibility = get(columnVisibilityAtom),
                columns = get(columnsAtom)
              let newVisibility = {}
              switch (update.type) {
                case 'toggle':
                  update.field &&
                    ((newVisibility = {
                      ...currentVisibility,
                      [update.field]: !currentVisibility[update.field],
                    }),
                    set(columnVisibilityAtom, newVisibility))
                  break
                case 'setAll':
                  ;(columns.forEach(column => {
                    newVisibility[column] = !!update.value
                  }),
                    set(columnVisibilityAtom, newVisibility))
                  break
                case 'save':
                  update.newState && set(columnVisibilityAtom, update.newState)
                  break
                case 'reset':
                  ;(columns.forEach(column => {
                    newVisibility[column] = !0
                  }),
                    set(columnVisibilityAtom, newVisibility))
              }
            }
          ),
          dataGridStore = (0, vanilla.y$)()
        function arraysAreEqual(a, b) {
          if (a.length !== b.length) return !1
          for (let i = 0; i < a.length; i++)
            if (a[i].field !== b[i].field) return !1
          return !0
        }
        var Searchable = __webpack_require__(
            './src/components/Field/Dropdown/Searchable/index.tsx'
          ),
          Checkbox = __webpack_require__('./src/components/Checkbox/index.tsx')
        const ColumnHeaderRow = ({
            isMobile,
            allRowsSelected,
            someRowsSelected,
            handleHeaderCheckboxChange,
            finalDesktopColumns,
            overflowDesktopColumns,
            allColumns,
            selectedOverflowField,
            setSelectedOverflowField,
            styles,
          }) => {
            const isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              componentStyles = {
                headerRow: { overflow: 'visible' },
                headerCell: {
                  padding: '0 0 5px 0',
                  lineHeight: '45px',
                  verticalAlign: 'bottom',
                },
                checkboxCell: { padding: 0, width: '3rem' },
                mobileDropdownCell: {
                  width: '100%',
                  minWidth: '200px',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  overflow: 'visible',
                  position: 'relative',
                  zIndex: 50,
                  paddingRight: '0.5rem',
                },
                overflowCell: {
                  width: '275px',
                  minWidth: '275px',
                  boxSizing: 'border-box',
                  overflow: 'visible',
                  position: 'relative',
                  zIndex: 50,
                  height: '55px',
                },
                columnHeader: width => ({
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  verticalAlign: 'bottom',
                  padding: 0,
                  width: width ? `${width}px` : void 0,
                  minWidth: width ? `${width}px` : void 0,
                  maxWidth: width ? `${width}px` : '200px',
                }),
              },
              handleCheckboxChange = checked => {
                handleHeaderCheckboxChange({
                  target: { checked },
                  currentTarget: { checked },
                })
              }
            if (isMobile) {
              const mobileOptions = allColumns.map(col => {
                  var _col_headerName
                  return {
                    value:
                      null !== (_col_headerName = col.headerName) &&
                      void 0 !== _col_headerName
                        ? _col_headerName
                        : col.field,
                  }
                }),
                currentMobileChoice =
                  mobileOptions.find(opt => {
                    const matchingColumn = allColumns.find(
                      c => c.field === selectedOverflowField
                    )
                    var _matchingColumn_headerName
                    return (
                      matchingColumn &&
                      opt.value ===
                        (null !==
                          (_matchingColumn_headerName =
                            matchingColumn.headerName) &&
                        void 0 !== _matchingColumn_headerName
                          ? _matchingColumn_headerName
                          : matchingColumn.field)
                    )
                  }) || (mobileOptions.length > 0 ? mobileOptions[0] : null),
                handleMobileChange = value => {
                  if (null == value ? void 0 : value.value) {
                    const matchingColumn = allColumns.find(col => {
                      var _col_headerName
                      return (
                        (null !== (_col_headerName = col.headerName) &&
                        void 0 !== _col_headerName
                          ? _col_headerName
                          : col.field) === value.value
                      )
                    })
                    matchingColumn &&
                      setSelectedOverflowField(matchingColumn.field)
                  } else
                    setSelectedOverflowField(
                      allColumns.length > 0 ? allColumns[0].field : ''
                    )
                }
              return (0, jsx_runtime.jsxs)('tr', {
                style: componentStyles.headerRow,
                children: [
                  (0, jsx_runtime.jsx)('th', {
                    style: {
                      ...componentStyles.headerCell,
                      ...componentStyles.checkboxCell,
                    },
                    children: (0, jsx_runtime.jsx)(Checkbox.A, {
                      checked: allRowsSelected,
                      indeterminate: someRowsSelected,
                      onChange: handleCheckboxChange,
                      styles: { theme: isSacredTheme ? 'sacred' : 'light' },
                    }),
                  }),
                  (0, jsx_runtime.jsx)('th', {
                    style: {
                      ...componentStyles.headerCell,
                      ...componentStyles.mobileDropdownCell,
                    },
                    children: (0, jsx_runtime.jsx)(Searchable.A, {
                      label: 'Columns',
                      options: mobileOptions,
                      defaultValue:
                        (null == currentMobileChoice
                          ? void 0
                          : currentMobileChoice.value) || '',
                      onChange: handleMobileChange,
                      styles: { theme: isSacredTheme ? 'sacred' : 'light' },
                    }),
                  }),
                ],
              })
            }
            const handleOverflowChange = value => {
              if (null == value ? void 0 : value.value) {
                const matchingColumn = overflowDesktopColumns.find(
                  col =>
                    col.headerName === value.value || col.field === value.value
                )
                setSelectedOverflowField(
                  matchingColumn ? matchingColumn.field : value.value
                )
              } else setSelectedOverflowField('')
            }
            return (0, jsx_runtime.jsxs)('tr', {
              style: componentStyles.headerRow,
              children: [
                (0, jsx_runtime.jsx)('th', {
                  style: {
                    ...componentStyles.headerCell,
                    ...componentStyles.checkboxCell,
                  },
                  children: (0, jsx_runtime.jsx)(Checkbox.A, {
                    checked: allRowsSelected,
                    indeterminate: someRowsSelected,
                    onChange: handleCheckboxChange,
                    styles: { theme: isSacredTheme ? 'sacred' : 'light' },
                  }),
                }),
                finalDesktopColumns.map(col => {
                  var _overflowDesktopColumns_find,
                    _overflowDesktopColumns_find_headerName,
                    _overflowDesktopColumns__headerName,
                    _col_headerName
                  return '__overflow__' === col.field
                    ? (0, jsx_runtime.jsx)(
                        'th',
                        {
                          style: {
                            ...componentStyles.headerCell,
                            ...componentStyles.overflowCell,
                          },
                          children: (0, jsx_runtime.jsx)(Searchable.A, {
                            label: 'More Columns',
                            options: overflowDesktopColumns.map(oc => {
                              var _oc_headerName
                              return {
                                value:
                                  null !== (_oc_headerName = oc.headerName) &&
                                  void 0 !== _oc_headerName
                                    ? _oc_headerName
                                    : oc.field,
                              }
                            }),
                            defaultValue: selectedOverflowField
                              ? null !==
                                  (_overflowDesktopColumns_find_headerName =
                                    null ===
                                      (_overflowDesktopColumns_find =
                                        overflowDesktopColumns.find(
                                          oc =>
                                            oc.field === selectedOverflowField
                                        )) ||
                                    void 0 === _overflowDesktopColumns_find
                                      ? void 0
                                      : _overflowDesktopColumns_find.headerName) &&
                                void 0 !==
                                  _overflowDesktopColumns_find_headerName
                                ? _overflowDesktopColumns_find_headerName
                                : selectedOverflowField
                              : overflowDesktopColumns.length > 0
                                ? null !==
                                    (_overflowDesktopColumns__headerName =
                                      overflowDesktopColumns[0].headerName) &&
                                  void 0 !== _overflowDesktopColumns__headerName
                                  ? _overflowDesktopColumns__headerName
                                  : overflowDesktopColumns[0].field
                                : '',
                            onChange: handleOverflowChange,
                            styles: {
                              theme: isSacredTheme ? 'sacred' : 'light',
                            },
                          }),
                        },
                        'overflow-header'
                      )
                    : (0, jsx_runtime.jsx)(
                        'th',
                        {
                          style: {
                            ...componentStyles.headerCell,
                            ...componentStyles.columnHeader(col.width),
                          },
                          children:
                            null !== (_col_headerName = col.headerName) &&
                            void 0 !== _col_headerName
                              ? _col_headerName
                              : col.field,
                        },
                        col.field
                      )
                }),
              ],
            })
          },
          Table_ColumnHeaderRow = ColumnHeaderRow
        ColumnHeaderRow.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ColumnHeaderRow',
          props: {
            isMobile: {
              required: !0,
              tsType: { name: 'boolean' },
              description: '',
            },
            allRowsSelected: {
              required: !0,
              tsType: { name: 'boolean' },
              description: '',
            },
            someRowsSelected: {
              required: !0,
              tsType: { name: 'boolean' },
              description: '',
            },
            handleHeaderCheckboxChange: {
              required: !0,
              tsType: {
                name: 'ReactChangeEventHandler',
                raw: 'React.ChangeEventHandler<HTMLInputElement>',
                elements: [{ name: 'HTMLInputElement' }],
              },
              description: '',
            },
            finalDesktopColumns: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'ColumnDef' }],
                raw: 'ColumnDef[]',
              },
              description: '',
            },
            overflowDesktopColumns: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'ColumnDef' }],
                raw: 'ColumnDef[]',
              },
              description: '',
            },
            allColumns: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'ColumnDef' }],
                raw: 'ColumnDef[]',
              },
              description: '',
            },
            selectedOverflowField: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            setSelectedOverflowField: {
              required: !0,
              tsType: {
                name: 'ReactDispatch',
                raw: 'React.Dispatch<React.SetStateAction<string>>',
                elements: [
                  {
                    name: 'ReactSetStateAction',
                    raw: 'React.SetStateAction<string>',
                    elements: [{ name: 'string' }],
                  },
                ],
              },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'DataGridStyles' },
              description: '',
            },
          },
        }
        var Tooltip = __webpack_require__('./src/components/Tooltip/index.tsx')
        function safeString(value) {
          if (null == value) return ''
          switch (typeof value) {
            case 'string':
              return value
            case 'number':
            case 'boolean':
              return String(value)
            case 'object':
              try {
                return JSON.stringify(value)
              } catch (e) {
                return ''
              }
            default:
              return ''
          }
        }
        function formatCurrency(value, sacredtheme = !1) {
          let numValue
          if ('number' == typeof value) numValue = value
          else if ('string' == typeof value) {
            const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''))
            numValue = isNaN(parsed) ? 0 : parsed
          } else numValue = 0
          const formatted = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(numValue),
            isZero = 0 === numValue,
            isNegative = numValue < 0,
            isLarge = Math.abs(numValue) >= 1e4,
            isMedium = Math.abs(numValue) >= 1e3 && Math.abs(numValue) < 1e4,
            colorScheme = sacredtheme
              ? isZero
                ? {
                    text: '#9CA3AF',
                    background:
                      'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(55, 65, 81, 0.8) 100%)',
                    border: 'rgba(156, 163, 175, 0.5)',
                    shadow: '0 2px 6px rgba(255, 215, 0, 0.1)',
                    pulse: !1,
                  }
                : isNegative
                  ? {
                      text: '#EF4444',
                      background:
                        'linear-gradient(135deg, rgba(127, 29, 29, 0.8) 0%, rgba(185, 28, 28, 0.8) 100%)',
                      border: 'rgba(239, 68, 68, 0.6)',
                      shadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                      pulse: isLarge,
                    }
                  : isLarge
                    ? {
                        text: '#FFD700',
                        background:
                          'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.25) 100%)',
                        border: '#FFD700',
                        shadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
                        pulse: !0,
                      }
                    : isMedium
                      ? {
                          text: '#F59E0B',
                          background:
                            'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.2) 100%)',
                          border: 'rgba(245, 158, 11, 0.6)',
                          shadow: '0 3px 8px rgba(245, 158, 11, 0.2)',
                          pulse: !1,
                        }
                      : {
                          text: '#D97706',
                          background:
                            'linear-gradient(135deg, rgba(217, 119, 6, 0.05) 0%, rgba(217, 119, 6, 0.15) 100%)',
                          border: 'rgba(217, 119, 6, 0.5)',
                          shadow: '0 2px 6px rgba(217, 119, 6, 0.15)',
                          pulse: !1,
                        }
              : isZero
                ? {
                    text: '#6B7280',
                    background:
                      'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
                    border: '#E5E7EB',
                    shadow: 'none',
                    pulse: !1,
                  }
                : isNegative
                  ? {
                      text: '#DC2626',
                      background:
                        'linear-gradient(135deg, #FEF2F2 0%, #FECACA 30%, #FCA5A5 100%)',
                      border: '#F87171',
                      shadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
                      pulse: isLarge,
                    }
                  : isLarge
                    ? {
                        text: '#059669',
                        background:
                          'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 30%, #A7F3D0 100%)',
                        border: '#34D399',
                        shadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
                        pulse: !0,
                      }
                    : isMedium
                      ? {
                          text: '#0D9488',
                          background:
                            'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 50%, #99F6E4 100%)',
                          border: '#5EEAD4',
                          shadow: '0 3px 8px rgba(13, 148, 136, 0.15)',
                          pulse: !1,
                        }
                      : {
                          text: '#0F766E',
                          background:
                            'linear-gradient(135deg, #F0FDFA 0%, #E6FFFA 100%)',
                          border: '#7DD3FC',
                          shadow: '0 2px 6px rgba(15, 118, 110, 0.1)',
                          pulse: !1,
                        },
            formatId = `currency-${Math.random().toString(36).substr(2, 9)}`,
            element = (0, jsx_runtime.jsxs)('span', {
              id: formatId,
              style: {
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily:
                  '"Inter Tight", "JetBrains Mono", "SF Pro Display", system-ui, sans-serif',
                fontWeight: isZero ? 400 : isLarge ? 700 : 600,
                fontSize: isLarge ? '0.95rem' : '0.875rem',
                lineHeight: 1.3,
                letterSpacing: isLarge ? '0.01em' : '0.02em',
                color: colorScheme.text,
                background: colorScheme.background,
                border: `1.5px solid ${colorScheme.border}`,
                borderRadius: '8px',
                padding: isLarge ? '6px 12px' : '5px 10px',
                minWidth: isLarge ? '100px' : '90px',
                textAlign: 'right',
                boxShadow: colorScheme.shadow,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
                userSelect: 'none',
                textShadow: isZero
                  ? 'none'
                  : '0 1px 2px rgba(255, 255, 255, 0.8)',
                animation: colorScheme.pulse
                  ? `pulse-${formatId} 2s ease-in-out infinite`
                  : 'none',
              },
              onMouseEnter: e => {
                ;((e.currentTarget.style.transform =
                  'translateY(-1px) scale(1.02)'),
                  (e.currentTarget.style.boxShadow = isZero
                    ? '0 2px 8px rgba(0, 0, 0, 0.1)'
                    : colorScheme.shadow
                        .replace('0.15)', '0.25)')
                        .replace('0.2)', '0.35)')
                        .replace('0.1)', '0.2)')))
              },
              onMouseLeave: e => {
                ;((e.currentTarget.style.transform = 'translateY(0) scale(1)'),
                  (e.currentTarget.style.boxShadow = colorScheme.shadow))
              },
              children: [
                colorScheme.pulse &&
                  (0, jsx_runtime.jsx)('style', {
                    children: `\n            @keyframes pulse-${formatId} {\n              0%, 100% { opacity: 1; }\n              50% { opacity: 0.85; }\n            }\n          `,
                  }),
                isLarge &&
                  !isNegative &&
                  (0, jsx_runtime.jsx)('span', {
                    style: {
                      marginRight: '4px',
                      fontSize: '0.75em',
                      opacity: 0.7,
                      color: sacredtheme ? '#FFD700' : '#10B981',
                    },
                    children: '▲',
                  }),
                (0, jsx_runtime.jsx)('span', {
                  style: {
                    opacity: 0.85,
                    marginRight: '2px',
                    fontSize: isLarge ? '0.85em' : '0.8em',
                    fontWeight: 500,
                  },
                  children: '$',
                }),
                (0, jsx_runtime.jsx)('span', {
                  style: {
                    fontVariantNumeric: 'tabular-nums',
                    fontFeatureSettings: '"tnum" 1',
                    letterSpacing: '0.015em',
                  },
                  children: formatted.replace('$', ''),
                }),
                isLarge &&
                  !isNegative &&
                  (0, jsx_runtime.jsx)('span', {
                    style: {
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background:
                        'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                      animation: `shimmer-${formatId} 3s ease-in-out infinite`,
                    },
                    children: (0, jsx_runtime.jsx)('style', {
                      children: `\n              @keyframes shimmer-${formatId} {\n                0% { left: -100%; }\n                50%, 100% { left: 100%; }\n              }\n            `,
                    }),
                  }),
              ],
            })
          return { formatted, element }
        }
        function formatCreditCard(value, sacredtheme = !1) {
          let digits = ''
          if (
            ((digits =
              'string' == typeof value
                ? value.replace(/\D/g, '')
                : 'number' == typeof value
                  ? String(value).replace(/\D/g, '')
                  : ''),
            !digits || digits.length < 4)
          ) {
            const formatted = '•••• •••• •••• ••••'
            return {
              formatted,
              element: (0, jsx_runtime.jsx)('span', {
                style: {
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontFamily:
                    '"JetBrains Mono", "SF Mono", Consolas, monospace',
                  fontWeight: 400,
                  fontSize: '0.875rem',
                  lineHeight: 1.3,
                  letterSpacing: '0.1em',
                  color: sacredtheme ? 'rgba(255, 215, 0, 0.5)' : '#9CA3AF',
                  backgroundColor: sacredtheme
                    ? 'rgba(255, 215, 0, 0.05)'
                    : 'rgba(156, 163, 175, 0.1)',
                  border: sacredtheme
                    ? '1px solid rgba(255, 215, 0, 0.3)'
                    : '1px solid rgba(156, 163, 175, 0.3)',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  minWidth: '140px',
                  textAlign: 'center',
                  userSelect: 'none',
                },
                children: formatted,
              }),
            }
          }
          const lastFour = digits.slice(-4),
            formatted = ('•'.repeat(Math.max(0, digits.length - 4)) + lastFour)
              .replace(/(.{4})/g, '$1 ')
              .trim(),
            cardInfo = sacredtheme
              ? {
                  color: '#FFD700',
                  bgGradient:
                    'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 30%, rgba(255, 215, 0, 0.15) 100%)',
                  borderColor: 'rgba(255, 215, 0, 0.6)',
                }
              : {
                  color: '#1F2937',
                  bgGradient:
                    'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 30%, #CBD5E1 100%)',
                  borderColor: '#475569',
                },
            formatId = `card-${Math.random().toString(36).substr(2, 9)}`,
            element = (0, jsx_runtime.jsxs)('span', {
              id: formatId,
              style: {
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: '"JetBrains Mono", "SF Mono", Consolas, monospace',
                fontWeight: 500,
                fontSize: '0.875rem',
                lineHeight: 1.3,
                letterSpacing: '0.08em',
                color: cardInfo.color,
                background: cardInfo.bgGradient,
                border: `1.5px solid ${cardInfo.borderColor}`,
                borderRadius: '8px',
                padding: '6px 12px',
                minWidth: '140px',
                textAlign: 'center',
                boxShadow: sacredtheme
                  ? '0 2px 8px rgba(255, 215, 0, 0.2)'
                  : '0 2px 8px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
                userSelect: 'none',
                overflow: 'hidden',
              },
              onMouseEnter: e => {
                ;((e.currentTarget.style.transform = 'translateY(-1px)'),
                  (e.currentTarget.style.boxShadow = sacredtheme
                    ? '0 4px 12px rgba(255, 215, 0, 0.3)'
                    : '0 4px 12px rgba(0, 0, 0, 0.15)'))
              },
              onMouseLeave: e => {
                ;((e.currentTarget.style.transform = 'translateY(0)'),
                  (e.currentTarget.style.boxShadow = sacredtheme
                    ? '0 2px 8px rgba(255, 215, 0, 0.2)'
                    : '0 2px 8px rgba(0, 0, 0, 0.1)'))
              },
              children: [
                (0, jsx_runtime.jsx)('span', {
                  style: {
                    fontVariantNumeric: 'tabular-nums',
                    fontFeatureSettings: '"tnum" 1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  },
                  children: formatted
                    .split('')
                    .map((char, index) =>
                      (0, jsx_runtime.jsx)(
                        'span',
                        {
                          style: {
                            opacity: '•' === char ? 0.6 : 1,
                            fontSize: '•' === char ? '1.2em' : '1em',
                            fontWeight: '•' === char ? 300 : 600,
                          },
                          children: char,
                        },
                        index
                      )
                    ),
                }),
                (0, jsx_runtime.jsx)('span', {
                  style: {
                    fontSize: '0.75rem',
                    opacity: 0.5,
                    marginLeft: '8px',
                    color: sacredtheme ? '#FFD700' : '#6B7280',
                  },
                  children: '🔒',
                }),
                (0, jsx_runtime.jsx)('span', {
                  style: {
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '20px',
                    height: '100%',
                    background:
                      'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                    pointerEvents: 'none',
                  },
                }),
              ],
            })
          return { formatted, element }
        }
        function formatExpirationDate(value, sacredtheme = !1) {
          const date = (input => {
              if (!input || 'string' != typeof input) return null
              const cleaned = input.replace(/[^0-9]/g, '')
              let month, year
              return cleaned.length >= 3 &&
                ((month = parseInt(cleaned.slice(0, 2), 10)),
                (year = parseInt(cleaned.slice(2), 10)),
                year < 100 && (year += 2e3),
                !isNaN(month) && !isNaN(year) && month >= 1 && month <= 12)
                ? new Date(year, month - 1)
                : null
            })(safeString(value)),
            formatted = date
              ? `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(2)}`
              : 'Invalid Date',
            status = (() => {
              if (!date) return 'invalid'
              const now = new Date()
              now.setHours(0, 0, 0, 0)
              const expiry = new Date(date)
              if (
                (expiry.setMonth(expiry.getMonth() + 1, 0),
                expiry.setHours(23, 59, 59, 999),
                expiry < now)
              )
                return 'expired'
              const sixMonthsFromNow = new Date(now)
              return (
                sixMonthsFromNow.setMonth(now.getMonth() + 6),
                expiry < sixMonthsFromNow ? 'expiring_soon' : 'valid'
              )
            })()
          return {
            formatted,
            element: (0, jsx_runtime.jsxs)('span', {
              style: (() => {
                const themes = {
                    sacredtheme: {
                      valid: {
                        color: '#A3E635',
                        bg: 'rgba(163, 230, 53, 0.1)',
                        borderColor: 'rgba(163, 230, 53, 0.4)',
                      },
                      expiring_soon: {
                        color: '#FBBF24',
                        bg: 'rgba(251, 191, 36, 0.1)',
                        borderColor: 'rgba(251, 191, 36, 0.5)',
                      },
                      expired: {
                        color: '#F87171',
                        bg: 'rgba(248, 113, 113, 0.1)',
                        borderColor: 'rgba(248, 113, 113, 0.5)',
                      },
                      invalid: {
                        color: '#9CA3AF',
                        bg: 'rgba(156, 163, 175, 0.1)',
                        borderColor: 'rgba(156, 163, 175, 0.3)',
                      },
                    },
                    standard: {
                      valid: {
                        color: '#166534',
                        bg: '#DCFCE7',
                        borderColor: '#4ADE80',
                      },
                      expiring_soon: {
                        color: '#92400E',
                        bg: '#FEF3C7',
                        borderColor: '#FBBF24',
                      },
                      expired: {
                        color: '#991B1B',
                        bg: '#FEE2E2',
                        borderColor: '#F87171',
                      },
                      invalid: {
                        color: '#4B5563',
                        bg: '#F3F4F6',
                        borderColor: '#D1D5DB',
                      },
                    },
                  },
                  style = (sacredtheme ? themes.sacredtheme : themes.standard)[
                    status
                  ]
                return {
                  fontFamily:
                    '"Inter", "SF Pro Display", system-ui, sans-serif',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  borderRadius: '12px',
                  padding: '5px 10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  borderWidth: '1.5px',
                  borderStyle: 'solid',
                  color: style.color,
                  backgroundColor: style.bg,
                  borderColor: style.borderColor,
                }
              })(),
              children: [
                (0, jsx_runtime.jsx)('span', {
                  style: { fontSize: '0.75rem', opacity: 0.8 },
                  children: {
                    valid: '✓',
                    expiring_soon: '⏳',
                    expired: '✕',
                    invalid: '?',
                  }[status],
                }),
                (0, jsx_runtime.jsx)('span', { children: formatted }),
              ],
            }),
          }
        }
        function formatAccountNumber(value, sacredtheme = !1) {
          let digits = ''
          if (
            (('string' != typeof value && 'number' != typeof value) ||
              (digits = String(value).replace(/\D/g, '')),
            !digits || digits.length < 4)
          ) {
            const formatted = '••••'
            return {
              formatted,
              element: (0, jsx_runtime.jsx)('span', {
                style: {
                  fontFamily: '"JetBrains Mono", monospace',
                  color: sacredtheme ? 'rgba(255, 215, 0, 0.6)' : '#6B7280',
                  letterSpacing: '0.1em',
                },
                children: formatted,
              }),
            }
          }
          const lastFour = digits.slice(-4),
            formatted = '•'.repeat(digits.length - 4) + lastFour,
            themeStyle = sacredtheme
              ? {
                  color: '#FFD700',
                  fontFamily: '"Caudex", serif',
                  textShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
                }
              : { color: '#1F2937', fontFamily: '"Inter", sans-serif' }
          return {
            formatted,
            element: (0, jsx_runtime.jsxs)('div', {
              style: { display: 'flex', alignItems: 'center', gap: '8px' },
              children: [
                (0, jsx_runtime.jsx)('span', {
                  style: {
                    fontSize: '0.75rem',
                    opacity: 0.6,
                    color: sacredtheme ? '#FFD700' : '#4B5563',
                  },
                  children: '#',
                }),
                (0, jsx_runtime.jsx)('span', {
                  style: {
                    ...themeStyle,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    letterSpacing: '0.05em',
                  },
                  children: formatted,
                }),
              ],
            }),
          }
        }
        function formatRoutingNumber(value, sacredtheme = !1) {
          let digits = ''
          if (
            (('string' != typeof value && 'number' != typeof value) ||
              (digits = String(value).replace(/\D/g, '')),
            9 !== digits.length)
          ) {
            const formatted = 'Invalid ABA'
            return {
              formatted,
              element: (0, jsx_runtime.jsx)('span', {
                style: {
                  fontFamily: '"Inter", sans-serif',
                  color: '#EF4444',
                  fontSize: '0.8rem',
                  fontStyle: 'italic',
                },
                children: formatted,
              }),
            }
          }
          const formatted = digits,
            themeStyle = sacredtheme
              ? {
                  color: '#38BDF8',
                  fontFamily: '"Orbitron", sans-serif',
                  textShadow: '0 0 10px rgba(56, 189, 248, 0.4)',
                }
              : { color: '#0284C7', fontFamily: '"Inter", sans-serif' }
          return {
            formatted,
            element: (0, jsx_runtime.jsxs)('div', {
              style: { display: 'flex', alignItems: 'center', gap: '8px' },
              children: [
                (0, jsx_runtime.jsx)('span', {
                  style: {
                    fontSize: '0.8rem',
                    opacity: 0.7,
                    color: sacredtheme ? '#38BDF8' : '#3B82F6',
                  },
                  children: '⑆',
                }),
                (0, jsx_runtime.jsx)('span', {
                  style: {
                    ...themeStyle,
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    letterSpacing: '0.075em',
                    transition: 'letter-spacing 0.3s ease',
                  },
                  onMouseEnter: e =>
                    (e.currentTarget.style.letterSpacing = '0.1em'),
                  onMouseLeave: e =>
                    (e.currentTarget.style.letterSpacing = '0.075em'),
                  children: formatted,
                }),
              ],
            }),
          }
        }
        const Rows = ({
            rows,
            finalDesktopColumns,
            overflowDesktopColumns,
            selectedOverflowField,
            isMobile,
            mobileSelectedColumn,
            allColumns,
            selectedRowIds,
            onRowClick,
            onRowCheckboxChange,
            styles,
          }) => {
            const isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme)
            return rows && 0 !== rows.length
              ? (0, jsx_runtime.jsx)('tbody', {
                  children: rows.map(row => {
                    const rowId = getRowId(row),
                      isSelected = selectedRowIds.includes(rowId),
                      rowStyle = {
                        transition: 'background-color 0.2s ease',
                        cursor: 'pointer',
                        ...(isSelected && isSacredTheme
                          ? {
                              backgroundColor: 'rgba(255, 215, 0, 0.15)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 215, 0, 0.2)',
                              },
                            }
                          : {}),
                        ...(isSelected && !isSacredTheme
                          ? {
                              backgroundColor: 'rgba(219, 234, 254, 1)',
                              '&:hover': {
                                backgroundColor: 'rgba(191, 219, 254, 1)',
                              },
                            }
                          : {}),
                      }
                    return (0, jsx_runtime.jsxs)(
                      'tr',
                      {
                        onClick: () =>
                          null == onRowClick ? void 0 : onRowClick(row),
                        style: rowStyle,
                        children: [
                          (0, jsx_runtime.jsx)('td', {
                            className: 'w-12 p-0 align-middle',
                            children: (0, jsx_runtime.jsx)(Checkbox.A, {
                              checked: isSelected,
                              onChange: _checked => {
                                onRowCheckboxChange(rowId)
                              },
                              onClick: e => e.stopPropagation(),
                              styles: {
                                theme: isSacredTheme ? 'sacred' : 'light',
                              },
                            }),
                          }),
                          !isMobile &&
                            finalDesktopColumns.map(col => {
                              let cellContent
                              if ('__overflow__' === col.field) {
                                const overflowCol = overflowDesktopColumns.find(
                                  c => c.field === selectedOverflowField
                                )
                                if (overflowCol) {
                                  const value = row[overflowCol.field]
                                  cellContent =
                                    'currency' === overflowCol.type
                                      ? formatCurrency(value, isSacredTheme)
                                          .element
                                      : 'credit_card' === overflowCol.type
                                        ? formatCreditCard(value, isSacredTheme)
                                            .element
                                        : 'expiration_date' === overflowCol.type
                                          ? formatExpirationDate(
                                              value,
                                              isSacredTheme
                                            ).element
                                          : 'account_number' ===
                                              overflowCol.type
                                            ? formatAccountNumber(
                                                value,
                                                isSacredTheme
                                              ).element
                                            : 'routing_number' ===
                                                overflowCol.type
                                              ? formatRoutingNumber(
                                                  value,
                                                  isSacredTheme
                                                ).element
                                              : safeString(value)
                                } else cellContent = '---'
                              } else {
                                const value = row[col.field]
                                cellContent =
                                  'currency' === col.type
                                    ? formatCurrency(value, isSacredTheme)
                                        .element
                                    : 'credit_card' === col.type
                                      ? formatCreditCard(value, isSacredTheme)
                                          .element
                                      : 'expiration_date' === col.type
                                        ? formatExpirationDate(
                                            value,
                                            isSacredTheme
                                          ).element
                                        : 'account_number' === col.type
                                          ? formatAccountNumber(
                                              value,
                                              isSacredTheme
                                            ).element
                                          : 'routing_number' === col.type
                                            ? formatRoutingNumber(
                                                value,
                                                isSacredTheme
                                              ).element
                                            : safeString(value)
                              }
                              return (0, jsx_runtime.jsx)(
                                'td',
                                {
                                  className: 'p-2 align-middle',
                                  children: (0, jsx_runtime.jsx)(Tooltip.A, {
                                    title: safeString(row[col.field]),
                                    sacredtheme: isSacredTheme,
                                    children: (0, jsx_runtime.jsx)('div', {
                                      className: 'truncate',
                                      children: cellContent,
                                    }),
                                  }),
                                },
                                col.field
                              )
                            }),
                          isMobile &&
                            (0, jsx_runtime.jsx)('td', {
                              className: 'p-2 align-middle',
                              children: (() => {
                                const mobileCol = allColumns.find(
                                  c => c.field === mobileSelectedColumn
                                )
                                if (mobileCol) {
                                  const value = row[mobileCol.field]
                                  return 'currency' === mobileCol.type
                                    ? formatCurrency(value, isSacredTheme)
                                        .element
                                    : 'credit_card' === mobileCol.type
                                      ? formatCreditCard(value, isSacredTheme)
                                          .element
                                      : 'expiration_date' === mobileCol.type
                                        ? formatExpirationDate(
                                            value,
                                            isSacredTheme
                                          ).element
                                        : 'account_number' === mobileCol.type
                                          ? formatAccountNumber(
                                              value,
                                              isSacredTheme
                                            ).element
                                          : 'routing_number' === mobileCol.type
                                            ? formatRoutingNumber(
                                                value,
                                                isSacredTheme
                                              ).element
                                            : safeString(value)
                                }
                                return '---'
                              })(),
                            }),
                        ],
                      },
                      rowId
                    )
                  }),
                })
              : (0, jsx_runtime.jsx)('tbody', {
                  children: (0, jsx_runtime.jsx)('tr', {
                    children: (0, jsx_runtime.jsx)('td', {
                      colSpan: 100,
                      className: 'text-center p-12 text-gray-500 italic',
                      children: 'No data to display.',
                    }),
                  }),
                })
          },
          Table_Rows = Rows
        Rows.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'Rows',
          props: {
            rows: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'RowData' }],
                raw: 'RowData[]',
              },
              description: '',
            },
            finalDesktopColumns: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'ColumnDef' }],
                raw: 'ColumnDef[]',
              },
              description: '',
            },
            overflowDesktopColumns: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'ColumnDef' }],
                raw: 'ColumnDef[]',
              },
              description: '',
            },
            selectedOverflowField: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            isMobile: {
              required: !0,
              tsType: { name: 'boolean' },
              description: '',
            },
            mobileSelectedColumn: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            allColumns: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'ColumnDef' }],
                raw: 'ColumnDef[]',
              },
              description: '',
            },
            selectedRowIds: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'string' }],
                raw: 'string[]',
              },
              description: '',
            },
            onRowClick: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(row: RowData) => void',
                signature: {
                  arguments: [{ type: { name: 'RowData' }, name: 'row' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onRowCheckboxChange: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(rowId: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'rowId' }],
                  return: { name: 'void' },
                },
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
        var theme = __webpack_require__('./src/theme/index.ts')
        function getRowId(row) {
          var _row_id, _ref
          return String(
            null !==
              (_ref =
                null !== (_row_id = row.id) && void 0 !== _row_id
                  ? _row_id
                  : row._id) && void 0 !== _ref
              ? _ref
              : ''
          )
        }
        function Table({
          columns,
          rows,
          onRowClick,
          selectedRowIds = [],
          allRowsSelected = !1,
          someRowsSelected = !1,
          onHeaderCheckboxChange,
          onRowCheckboxChange,
          styles,
        }) {
          const isMobile = (function useIsMobile(width = 500) {
              const [isMobile, setIsMobile] = (0, react.useState)(!1)
              return (
                (0, react.useEffect)(() => {
                  const checkScreenSize = () =>
                    setIsMobile(window.innerWidth < width)
                  return (
                    checkScreenSize(),
                    window.addEventListener('resize', checkScreenSize),
                    () => window.removeEventListener('resize', checkScreenSize)
                  )
                }, [width]),
                isMobile
              )
            })(500),
            isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            computedStyles = (0, theme.fN)(styles),
            {
              containerRef,
              fittedDesktopColumns,
              overflowDesktopColumns,
              selectedOverflowField,
              setSelectedOverflowField,
            } = (function useComputeTableResize({
              columns,
              checkboxSelection,
              showOverflowDropdown,
            }) {
              const containerRef = (0, react.useRef)(null),
                [fittedDesktopColumns, setFittedDesktopColumns] = (0,
                react.useState)([]),
                [overflowDesktopColumns, setOverflowDesktopColumns] = (0,
                react.useState)([]),
                [selectedOverflowField, setSelectedOverflowField] = (0,
                react.useState)(''),
                columnVisibility = (0, esm_react.md)(columnVisibilityAtom, {
                  store: dataGridStore,
                }),
                measureTextWidth = (0, react.useCallback)(
                  (text, font = '14px Roboto') => {
                    const ctx = document
                      .createElement('canvas')
                      .getContext('2d')
                    return ctx
                      ? ((ctx.font = font), ctx.measureText(text).width)
                      : 100
                  },
                  []
                ),
                measureColumnNeededWidth = (0, react.useCallback)(
                  col => {
                    if (null != col.width) return col.width
                    if ('id' === col.field || '_id' === col.field) return 60
                    const header = col.headerName || col.field
                    return measureTextWidth(header) + 60
                  },
                  [measureTextWidth]
                ),
                recalcColumns = (0, react.useCallback)(() => {
                  if (!containerRef.current) return
                  const containerWidth = containerRef.current.offsetWidth,
                    visibleCols = columns.filter(
                      col => !1 !== columnVisibility[col.field]
                    )
                  let usedWidth = checkboxSelection ? 50 : 0
                  const overflowReservedWidth = showOverflowDropdown ? 275 : 0,
                    canFit = []
                  let theOverflow = []
                  for (let i = 0; i < visibleCols.length; i++) {
                    const col = visibleCols[i],
                      needed = measureColumnNeededWidth(col)
                    if (null != col.width) {
                      if (
                        !(
                          usedWidth + needed + overflowReservedWidth + 50 <=
                          containerWidth
                        )
                      ) {
                        theOverflow = visibleCols.slice(i)
                        break
                      }
                      ;(canFit.push(col), (usedWidth += needed))
                    } else {
                      if (
                        !(
                          usedWidth + needed + overflowReservedWidth <=
                          containerWidth - 50
                        )
                      ) {
                        if (
                          ((theOverflow = visibleCols.slice(i)),
                          theOverflow.length > 0 && canFit.length > 1)
                        ) {
                          const lastFitted = canFit.pop()
                          lastFitted &&
                            (theOverflow = [lastFitted, ...theOverflow])
                        }
                        break
                      }
                      ;(canFit.push(col), (usedWidth += needed))
                    }
                  }
                  let newSelected = selectedOverflowField
                  var _theOverflow_
                  ;(theOverflow.length > 0 &&
                  !theOverflow.some(c => c.field === newSelected)
                    ? (newSelected =
                        (null === (_theOverflow_ = theOverflow[0]) ||
                        void 0 === _theOverflow_
                          ? void 0
                          : _theOverflow_.field) || '')
                    : 0 === theOverflow.length &&
                      '' !== newSelected &&
                      (newSelected = ''),
                    arraysAreEqual(canFit, fittedDesktopColumns) ||
                      setFittedDesktopColumns(canFit),
                    arraysAreEqual(theOverflow, overflowDesktopColumns) ||
                      setOverflowDesktopColumns(theOverflow),
                    newSelected !== selectedOverflowField &&
                      setSelectedOverflowField(newSelected))
                }, [
                  containerRef,
                  columns,
                  columnVisibility,
                  checkboxSelection,
                  showOverflowDropdown,
                  measureColumnNeededWidth,
                  fittedDesktopColumns,
                  overflowDesktopColumns,
                  selectedOverflowField,
                ])
              return (
                (0, react.useLayoutEffect)(() => {
                  if (!containerRef.current) return
                  const ro = new ResizeObserver(() => {
                    recalcColumns()
                  })
                  return (
                    ro.observe(containerRef.current),
                    () => ro.disconnect()
                  )
                }, [recalcColumns]),
                (0, react.useEffect)(() => {
                  const handleResize = () => {
                    recalcColumns()
                  }
                  return (
                    window.addEventListener('resize', handleResize),
                    () => {
                      window.removeEventListener('resize', handleResize)
                    }
                  )
                }, [recalcColumns]),
                (0, react.useEffect)(() => {
                  recalcColumns()
                }, [recalcColumns]),
                {
                  containerRef,
                  fittedDesktopColumns,
                  overflowDesktopColumns,
                  selectedOverflowField,
                  setSelectedOverflowField,
                }
              )
            })({
              columns: columns.map(col =>
                col.width ? { ...col, computedWidth: col.width } : col
              ),
              checkboxSelection: !0,
              showOverflowDropdown: !isMobile,
            })
          ;((0, react.useEffect)(() => {
            !selectedOverflowField &&
              overflowDesktopColumns.length > 0 &&
              setSelectedOverflowField(overflowDesktopColumns[0].field)
          }, [
            selectedOverflowField,
            overflowDesktopColumns,
            setSelectedOverflowField,
          ]),
            (0, react.useEffect)(() => {
              isMobile &&
                !selectedOverflowField &&
                columns.length > 0 &&
                setSelectedOverflowField(columns[0].field)
            }, [
              isMobile,
              selectedOverflowField,
              columns,
              setSelectedOverflowField,
            ]))
          const finalDesktopColumns = isMobile
              ? []
              : overflowDesktopColumns.length > 0
                ? [
                    ...fittedDesktopColumns,
                    { field: '__overflow__', headerName: 'More Columns' },
                  ]
                : fittedDesktopColumns,
            tableContainerStyle = {
              ...computedStyles.table.tableContainer,
              ...(isMobile && { minWidth: '100%' }),
            },
            tableWrapperStyle = {
              ...computedStyles.table.tableWrapper,
              ...(isMobile && { minWidth: '100%' }),
              ...(isSacredTheme && {
                '&::-webkit-scrollbar': { height: '0.5rem' },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderRadius: '0.375rem',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(255, 215, 0, 0.5)',
                  borderRadius: '0.375rem',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.7)',
                },
              }),
            },
            tableStyle = {
              ...computedStyles.table.table,
              ...(isMobile && { minWidth: '100%' }),
              ...(isSacredTheme && {
                '& td': {
                  borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: 'serif',
                },
                '& th': {
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                  color: '#FFD700',
                  fontFamily: 'Cinzel, serif',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
                },
                '& tr:hover': { backgroundColor: 'rgba(255, 215, 0, 0.05)' },
              }),
            }
          return (0, jsx_runtime.jsx)('div', {
            style: tableContainerStyle,
            children: (0, jsx_runtime.jsx)('div', {
              ref: containerRef,
              style: tableWrapperStyle,
              children: (0, jsx_runtime.jsxs)('table', {
                style: tableStyle,
                children: [
                  (0, jsx_runtime.jsx)('thead', {
                    children: (0, jsx_runtime.jsx)(Table_ColumnHeaderRow, {
                      isMobile,
                      allRowsSelected,
                      someRowsSelected,
                      handleHeaderCheckboxChange: onHeaderCheckboxChange,
                      finalDesktopColumns,
                      overflowDesktopColumns,
                      selectedOverflowField,
                      setSelectedOverflowField,
                      allColumns: columns,
                      styles,
                    }),
                  }),
                  (0, jsx_runtime.jsx)(Table_Rows, {
                    rows,
                    finalDesktopColumns,
                    overflowDesktopColumns,
                    selectedOverflowField,
                    isMobile,
                    mobileSelectedColumn: selectedOverflowField,
                    selectedRowIds,
                    onRowClick,
                    onRowCheckboxChange,
                    allColumns: columns,
                    styles,
                  }),
                ],
              }),
            }),
          })
        }
        Table.displayName = 'Table'
        const DataGrid_Table = Table
        Table.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'Table',
          props: {
            columns: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'ColumnDef' }],
                raw: 'ColumnDef[]',
              },
              description: '',
            },
            rows: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'RowData' }],
                raw: 'RowData[]',
              },
              description: '',
            },
            onRowClick: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(row: RowData) => void',
                signature: {
                  arguments: [{ type: { name: 'RowData' }, name: 'row' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            selectedRowIds: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [{ name: 'string' }],
                raw: 'string[]',
              },
              description: '',
              defaultValue: { value: '[]', computed: !1 },
            },
            onSelectionChange: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(selectedIds: string[]) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'Array',
                        elements: [{ name: 'string' }],
                        raw: 'string[]',
                      },
                      name: 'selectedIds',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            allRowsSelected: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
            someRowsSelected: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
            onHeaderCheckboxChange: {
              required: !0,
              tsType: {
                name: 'ReactChangeEventHandler',
                raw: 'React.ChangeEventHandler<HTMLInputElement>',
                elements: [{ name: 'HTMLInputElement' }],
              },
              description: '',
            },
            onRowCheckboxChange: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(rowId: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'rowId' }],
                  return: { name: 'void' },
                },
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
        const VerticalDivider = ({ styles }) => {
          const isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            dividerStyle = {
              borderLeft: isSacredTheme
                ? '2px solid rgba(255, 215, 0, 0.4)'
                : '2px solid rgba(0, 0, 0, 1)',
              height: '20px',
              ...(isSacredTheme && {
                boxShadow:
                  '0 4px 6px -1px rgba(255, 215, 0, 0.6), 0 2px 4px -1px rgba(255, 215, 0, 0.4)',
              }),
            }
          return (0, jsx_runtime.jsx)('div', { style: dividerStyle })
        }
        VerticalDivider.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'VerticalDivider',
          props: {
            styles: {
              required: !1,
              tsType: { name: 'DataGridStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
          },
        }
        var Button = __webpack_require__('./src/components/Button/index.tsx'),
          Search = __webpack_require__(
            './src/components/Field/Search/index.tsx'
          ),
          ShowHideEye = __webpack_require__(
            './src/components/Icons/ShowHideEye.tsx'
          ),
          Typography = __webpack_require__(
            './src/components/Typography/index.tsx'
          ),
          Popover = __webpack_require__('./src/components/Popover/index.tsx')
        function ManageColumns({
          open = !1,
          handleClose = () => {},
          columns,
          styles,
          anchorEl = null,
        }) {
          const isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            {
              handleAllCols,
              toggleColumnState,
              visibleColumns,
              onSaveColumnView,
              formatColumnName,
              searchInput,
              setSearchInput,
              isAllChecked,
            } = (({
              columns,
              handleClose,
              isPopupOpen,
              initialSearchInput = '',
            }) => {
              const [tempVisibleColumns, setTempVisibleColumns] = (0,
                react.useState)({}),
                [columnVisibility] = (0, esm_react.fp)(columnVisibilityAtom, {
                  store: dataGridStore,
                }),
                updateVisibility = (0, esm_react.Xr)(columnVisibilityActions, {
                  store: dataGridStore,
                }),
                [searchInput, setSearchInput] = (0, react.useState)(
                  initialSearchInput
                ),
                [isAllChecked, setIsAllChecked] = (0, react.useState)(!0),
                initialized = (0, react.useRef)(!1)
              ;(0, react.useEffect)(() => {
                if (isPopupOpen) {
                  const currentVisibility = {}
                  ;(columns.forEach(column => {
                    var _columnVisibility_column_field
                    currentVisibility[column.field] =
                      null ===
                        (_columnVisibility_column_field =
                          columnVisibility[column.field]) ||
                      void 0 === _columnVisibility_column_field ||
                      _columnVisibility_column_field
                  }),
                    setTempVisibleColumns(currentVisibility),
                    setIsAllChecked(
                      columns.every(
                        column => !0 === currentVisibility[column.field]
                      )
                    ),
                    (initialized.current = !0))
                }
              }, [isPopupOpen, columns, columnVisibility])
              const handleAllCols = (0, react.useCallback)(
                  checked => {
                    ;(setIsAllChecked(checked),
                      setTempVisibleColumns(() => {
                        const newVisibility = {}
                        return (
                          columns.forEach(column => {
                            newVisibility[column.field] = checked
                          }),
                          newVisibility
                        )
                      }))
                  },
                  [columns]
                ),
                toggleColumnState = (0, react.useCallback)(
                  field => {
                    setTempVisibleColumns(prev => {
                      const newState = { ...prev, [field]: !prev[field] },
                        areAllVisible = columns.every(column =>
                          field === column.field
                            ? newState[field]
                            : prev[column.field]
                        )
                      return (setIsAllChecked(areAllVisible), newState)
                    })
                  },
                  [columns]
                ),
                onSaveColumnView = (0, react.useCallback)(() => {
                  ;(updateVisibility({
                    type: 'save',
                    newState: tempVisibleColumns,
                  }),
                    handleClose())
                }, [tempVisibleColumns, updateVisibility, handleClose]),
                formatColumnName = (0, react.useCallback)(
                  fieldName =>
                    fieldName
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase())
                      .trim(),
                  []
                ),
                handlePageUnload = (0, react.useCallback)(() => {
                  handleClose()
                }, [handleClose])
              return (
                (0, react.useEffect)(
                  () => (
                    window.addEventListener('beforeunload', handlePageUnload),
                    () => {
                      window.removeEventListener(
                        'beforeunload',
                        handlePageUnload
                      )
                    }
                  ),
                  [handlePageUnload]
                ),
                {
                  handleAllCols,
                  toggleColumnState,
                  visibleColumns: tempVisibleColumns,
                  onSaveColumnView,
                  formatColumnName,
                  searchInput,
                  setSearchInput,
                  isAllChecked,
                }
              )
            })({ columns, handleClose, isPopupOpen: open })
          ;(0, react.useEffect)(() => {
            if (isSacredTheme) {
              const styleSheet = document.styleSheets[0],
                keyframes =
                  '\n        @keyframes glowPulse {\n          0%, 100% { \n            border-color: rgba(255, 215, 0, 0.5);\n            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);\n          }\n          50% { \n            border-color: rgba(255, 215, 0, 0.8);\n            box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);\n          }\n        }\n        @keyframes floatGlyphPopover {\n          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }\n          50% { transform: translateY(-3px) rotate(180deg); opacity: 0.5; }\n        }\n      '
              try {
                styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
              } catch (e) {}
            }
          }, [isSacredTheme])
          const someColumnsVisible = react.useMemo(
              () =>
                columns.some(column => !0 === visibleColumns[column.field]) &&
                !columns.every(column => !0 === visibleColumns[column.field]),
              [columns, visibleColumns]
            ),
            filteredColumns = columns.filter(column =>
              formatColumnName(column.field)
                .toLowerCase()
                .includes(searchInput.toLowerCase())
            ),
            containerStyle = {
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              ...(isSacredTheme && { backdropFilter: 'blur(20px)' }),
            },
            scrollAreaStyle = {
              maxHeight: '160px',
              overflowY: 'auto',
              marginBottom: '10px',
              ...(isSacredTheme && {
                '&::-webkit-scrollbar': { width: '8px', height: '8px' },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(255, 215, 0, 0.5)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.7)',
                },
              }),
            },
            columnRowStyle = {
              display: 'flex',
              alignItems: 'center',
              marginBottom: '4px',
            },
            columnRowHoverStyle = {
              borderRadius: '6px',
              padding: '0 4px',
              margin: '0 -4px',
              ...(isSacredTheme && {
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
              }),
            },
            eyeButtonStyle = {
              padding: '4px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              ...(isSacredTheme && {
                color: 'rgba(255, 215, 0, 1)',
                '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.1)' },
              }),
            }
          return (0, jsx_runtime.jsx)(Popover.A, {
            open: Boolean(open),
            onClose: () => {
              ;(null == handleClose || handleClose(), setSearchInput(''))
            },
            anchorEl,
            styles: { theme: isSacredTheme ? 'sacred' : 'light' },
            children: (0, jsx_runtime.jsxs)('div', {
              style: containerStyle,
              children: [
                isSacredTheme &&
                  (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                    children: [
                      (0, jsx_runtime.jsx)('div', {
                        style: {
                          position: 'absolute',
                          fontSize: '14px',
                          color: 'rgba(255, 215, 0, 0.3)',
                          animation:
                            'floatGlyphPopover 3s ease-in-out infinite',
                          top: '8px',
                          left: '8px',
                        },
                        children: theme.vR[22],
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: {
                          position: 'absolute',
                          fontSize: '14px',
                          color: 'rgba(255, 215, 0, 0.3)',
                          animation:
                            'floatGlyphPopover 3s ease-in-out infinite',
                          top: '8px',
                          right: '8px',
                          animationDirection: 'reverse',
                        },
                        children: theme.vR[23],
                      }),
                    ],
                  }),
                (0, jsx_runtime.jsx)(Typography.A, {
                  text: isSacredTheme ? 'Sacred Columns' : 'Manage Columns',
                  variant: 'merriparagraph',
                  styles: { color: isSacredTheme ? 'gold' : 'black' },
                }),
                (0, jsx_runtime.jsx)('div', {
                  style: { marginTop: '4px', marginBottom: 0 },
                  children: (0, jsx_runtime.jsx)(Search.A, {
                    value: searchInput,
                    onChange: e => {
                      setSearchInput(e.target.value)
                    },
                    placeholder: isSacredTheme
                      ? 'Seek columns...'
                      : 'Search Columns',
                    styles: { theme: isSacredTheme ? 'sacred' : 'light' },
                  }),
                }),
                (0, jsx_runtime.jsxs)('div', {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: 0,
                    marginBottom: 0,
                    justifyContent: 'space-between',
                  },
                  children: [
                    (0, jsx_runtime.jsx)(Typography.A, {
                      text: 'All Columns',
                      variant: 'merriparagraph',
                      styles: { color: isSacredTheme ? 'gold' : 'black' },
                    }),
                    (0, jsx_runtime.jsx)('div', {
                      style: { marginRight: '-4px' },
                      children: (0, jsx_runtime.jsx)(Checkbox.A, {
                        checked: isAllChecked,
                        indeterminate: someColumnsVisible && !isAllChecked,
                        onChange: checked => {
                          handleAllCols(checked)
                        },
                        styles: { theme: isSacredTheme ? 'sacred' : 'light' },
                      }),
                    }),
                  ],
                }),
                (0, jsx_runtime.jsx)('div', {
                  style: scrollAreaStyle,
                  children: filteredColumns.map((column, index) => {
                    const isVisible = !0 === visibleColumns[column.field]
                    return (0, jsx_runtime.jsxs)(
                      'div',
                      {
                        style: {
                          ...columnRowStyle,
                          ...(isSacredTheme ? columnRowHoverStyle : {}),
                        },
                        children: [
                          (0, jsx_runtime.jsx)(Typography.A, {
                            text: formatColumnName(column.field),
                            variant: 'merriparagraph',
                            styles: {
                              color: isSacredTheme ? 'white' : 'black',
                            },
                          }),
                          (0, jsx_runtime.jsx)('button', {
                            onClick: () => {
                              return (
                                (columnField = column.field),
                                void toggleColumnState(columnField)
                              )
                              var columnField
                            },
                            style: eyeButtonStyle,
                            children: (0, jsx_runtime.jsx)(ShowHideEye.A, {
                              visible: isVisible,
                              sacredtheme: isSacredTheme,
                            }),
                          }),
                        ],
                      },
                      index
                    )
                  }),
                }),
                (0, jsx_runtime.jsx)(Button.A, {
                  text: 'Save',
                  styles: { theme: isSacredTheme ? 'sacred' : 'light' },
                  onClick: onSaveColumnView,
                }),
              ],
            }),
          })
        }
        const ManageColumn = ManageColumns
        ManageColumns.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ManageColumns',
          props: {
            open: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
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
              defaultValue: { value: '() => {}', computed: !1 },
            },
            columns: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'ColumnDef' }],
                raw: 'ColumnDef[]',
              },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'DataGridStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
            anchorEl: {
              required: !1,
              tsType: {
                name: 'union',
                raw: 'HTMLElement | null',
                elements: [{ name: 'HTMLElement' }, { name: 'null' }],
              },
              description: '',
              defaultValue: { value: 'null', computed: !1 },
            },
          },
        }
        var FirstPage = __webpack_require__(
            './src/components/Icons/FirstPage.tsx'
          ),
          LastPage = __webpack_require__('./src/components/Icons/LastPage.tsx'),
          KeyboardArrowLeft = __webpack_require__(
            './src/components/Icons/KeyboardArrowLeft.tsx'
          ),
          KeyboardArrowRight = __webpack_require__(
            './src/components/Icons/KeyboardArrowRight.tsx'
          )
        const TablePagination = ({
          page,
          pageSize,
          rowCount,
          onPageChange,
          styles,
        }) => {
          const totalPages = Math.ceil(rowCount / pageSize),
            from = 0 === rowCount ? 0 : page * pageSize + 1,
            to = Math.min(rowCount, (page + 1) * pageSize),
            isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            paginationButtonStyle = {
              padding: '4px',
              borderRadius: '50%',
              transition: 'colors 0.3s ease',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: isSacredTheme
                ? 'rgba(255, 215, 0, 1)'
                : 'rgba(75, 85, 99, 1)',
            },
            paginationTextStyle = {
              fontSize: '14px',
              color: isSacredTheme
                ? 'rgba(255, 215, 0, 0.9)'
                : 'rgba(55, 65, 81, 1)',
              fontFamily: isSacredTheme ? '"Crimson Text", serif' : 'inherit',
            }
          return (0, jsx_runtime.jsxs)('div', {
            style: { display: 'flex', alignItems: 'center', gap: '8px' },
            children: [
              (0, jsx_runtime.jsx)('button', {
                onClick: () => onPageChange(0),
                disabled: 0 === page,
                style: {
                  ...paginationButtonStyle,
                  opacity: 0 === page ? 0.5 : 1,
                  cursor: 0 === page ? 'not-allowed' : 'pointer',
                },
                children: (0, jsx_runtime.jsx)(FirstPage.A, {}),
              }),
              (0, jsx_runtime.jsx)('button', {
                onClick: () => onPageChange(page - 1),
                disabled: 0 === page,
                style: {
                  ...paginationButtonStyle,
                  opacity: 0 === page ? 0.5 : 1,
                  cursor: 0 === page ? 'not-allowed' : 'pointer',
                },
                children: (0, jsx_runtime.jsx)(KeyboardArrowLeft.A, {}),
              }),
              (0, jsx_runtime.jsxs)('span', {
                style: paginationTextStyle,
                children: [from, '-', to, ' of ', rowCount],
              }),
              (0, jsx_runtime.jsx)('button', {
                onClick: () => onPageChange(page + 1),
                disabled: page >= totalPages - 1,
                style: {
                  ...paginationButtonStyle,
                  opacity: page >= totalPages - 1 ? 0.5 : 1,
                  cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                },
                children: (0, jsx_runtime.jsx)(KeyboardArrowRight.A, {}),
              }),
              (0, jsx_runtime.jsx)('button', {
                onClick: () => onPageChange(totalPages - 1),
                disabled: page >= totalPages - 1,
                style: {
                  ...paginationButtonStyle,
                  opacity: page >= totalPages - 1 ? 0.5 : 1,
                  cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                },
                children: (0, jsx_runtime.jsx)(LastPage.A, {}),
              }),
            ],
          })
        }
        function CustomFooter({
          page,
          pageSize,
          rowCount,
          onPageChange,
          columns,
          styles,
        }) {
          const [isOpen, setIsOpen] = (0, react.useState)(!1),
            [anchorEl, setAnchorEl] = (0, react.useState)(null),
            isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            containerStyle = {
              width: '100%',
              minWidth: '100%',
              height: '56px',
              position: 'sticky',
              left: 0,
              ...(isSacredTheme && {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                borderTop: '2px solid rgba(255, 215, 0, 0.3)',
                backdropFilter: 'blur(8px)',
              }),
            },
            dividerContainerStyle = {
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              marginRight: '4px',
            }
          return (0, jsx_runtime.jsxs)('div', {
            style: containerStyle,
            children: [
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexWrap: 'nowrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                  padding: '0 8px',
                  overflow: 'hidden',
                },
                children: [
                  (0, jsx_runtime.jsxs)('div', {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%',
                    },
                    children: [
                      (0, jsx_runtime.jsx)('div', {
                        style: dividerContainerStyle,
                        children: (0, jsx_runtime.jsx)(VerticalDivider, {
                          styles,
                        }),
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          height: '100%',
                          gap: '4px',
                          paddingRight: '4px',
                          overflow: 'hidden',
                        },
                        children: (0, jsx_runtime.jsx)(Button.A, {
                          onClick: event => {
                            ;(setAnchorEl(event.currentTarget), setIsOpen(!0))
                          },
                          text: 'Columns',
                          icon: (0, jsx_runtime.jsx)(ShowHideEye.A, {
                            visible: !0,
                            sacredtheme: isSacredTheme,
                          }),
                          styles: {
                            theme: isSacredTheme ? 'sacred' : 'light',
                            iconLocation: 'left',
                            disabled: !1,
                            minWidth: 'unset',
                            padding: '8px',
                          },
                        }),
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: dividerContainerStyle,
                        children: (0, jsx_runtime.jsx)(VerticalDivider, {
                          styles,
                        }),
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsx)('div', {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%',
                      marginLeft: 'auto',
                      overflow: 'hidden',
                      paddingRight: '16px',
                    },
                    children: (0, jsx_runtime.jsx)(TablePagination, {
                      page,
                      pageSize,
                      rowCount,
                      onPageChange,
                      styles,
                    }),
                  }),
                ],
              }),
              (0, jsx_runtime.jsx)(ManageColumn, {
                open: isOpen,
                handleClose: () => {
                  ;(setIsOpen(!1), setAnchorEl(null))
                },
                columns,
                styles,
                anchorEl,
              }),
            ],
          })
        }
        const Footer = CustomFooter
        CustomFooter.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'CustomFooter',
        }
        var DateField = __webpack_require__(
            './src/components/Field/Date/DateField/index.tsx'
          ),
          DateRange = __webpack_require__(
            './src/components/Field/Date/DateRange/index.tsx'
          )
        const FilterSection = ({ filters, styles }) => {
            const [width] = (function useWindowSize() {
                const [size, setSize] = (0, react.useState)([0, 0])
                return (
                  (0, react.useEffect)(() => {
                    function updateSize() {
                      setSize([window.innerWidth, window.innerHeight])
                    }
                    return (
                      window.addEventListener('resize', updateSize),
                      updateSize(),
                      () => window.removeEventListener('resize', updateSize)
                    )
                  }, []),
                  size
                )
              })(),
              isMobile = width < 600,
              isTablet = width < 900,
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme)
            if (
              ((0, react.useEffect)(() => {
                if (isSacredTheme) {
                  const styleSheet = document.styleSheets[0],
                    keyframes =
                      '\n        @keyframes sacredGlow {\n          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }\n          50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.5); }\n        }\n        @keyframes glyphRotate {\n          from { transform: rotate(0deg); }\n          to { transform: rotate(360deg); }\n        }\n        @keyframes sacredFloat {\n          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }\n          50% { transform: translateY(-3px) scale(1.05); opacity: 0.8; }\n        }\n      '
                  try {
                    styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
                  } catch (e) {}
                }
              }, [isSacredTheme]),
              !filters || 0 === filters.length)
            )
              return null
            const renderFilterComponent = filter =>
                'daterange' === filter.type
                  ? (0, jsx_runtime.jsx)(DateRange.A, {
                      startLabel: 'From Date',
                      endLabel: 'To Date',
                      value: filter.value,
                      onChange: filter.onChange,
                      styles: { theme: isSacredTheme ? 'sacred' : 'light' },
                    })
                  : 'date' === filter.type
                    ? (0, jsx_runtime.jsx)(DateField.A, {
                        label: filter.label,
                        value: filter.value ? new Date(filter.value) : null,
                        onChange: filter.onChange,
                        placeholder: filter.placeholder,
                        styles: { theme: isSacredTheme ? 'sacred' : 'light' },
                        disableFutureDateValidation: !0,
                      })
                    : (0, jsx_runtime.jsx)('div', {
                        style: { width: filter.width || '100%' },
                        children: (0, jsx_runtime.jsx)(Searchable.A, {
                          label: filter.label,
                          options: filter.options || [],
                          defaultValue:
                            'all' === filter.value ? '' : filter.value,
                          onChange: filter.onChange,
                          placeholder: filter.placeholder,
                          styles: { theme: isSacredTheme ? 'sacred' : 'light' },
                        }),
                      }),
              filterSectionStyle = {
                width: '100%',
                position: 'relative',
                padding: isSacredTheme ? '4px' : '2px',
                ...(isSacredTheme && {
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  backgroundImage:
                    'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%, transparent 100%)',
                  animation: 'sacredGlow 3s ease-in-out infinite',
                }),
              },
              gridStyle = {
                display: 'grid',
                gap: '4px',
                ...(isMobile
                  ? { gridTemplateColumns: '1fr' }
                  : isTablet
                    ? 1 === filters.length
                      ? { gridTemplateColumns: 'repeat(2, 1fr)' }
                      : { gridTemplateColumns: '1fr' }
                    : 1 === filters.length
                      ? { gridTemplateColumns: 'repeat(4, 1fr)' }
                      : 2 === filters.length
                        ? { gridTemplateColumns: 'repeat(2, 1fr)' }
                        : 3 === filters.length
                          ? { gridTemplateColumns: 'repeat(3, 1fr)' }
                          : { gridTemplateColumns: 'repeat(4, 1fr)' }),
              }
            return (0, jsx_runtime.jsxs)('div', {
              style: filterSectionStyle,
              children: [
                isSacredTheme &&
                  (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                    children: [
                      (0, jsx_runtime.jsxs)('div', {
                        style: {
                          position: 'absolute',
                          fontSize: '12px',
                          color: 'rgba(255, 215, 0, 0.3)',
                          animation: 'sacredFloat 2s ease-in-out infinite',
                          zIndex: 10,
                          top: '8px',
                          left: '8px',
                        },
                        children: [theme.vR[15], ' '],
                      }),
                      (0, jsx_runtime.jsxs)('div', {
                        style: {
                          position: 'absolute',
                          fontSize: '12px',
                          color: 'rgba(255, 215, 0, 0.3)',
                          animation: 'sacredFloat 2s ease-in-out infinite',
                          zIndex: 10,
                          bottom: '8px',
                          right: '8px',
                          animationDirection: 'reverse',
                        },
                        children: [theme.vR[16], ' '],
                      }),
                    ],
                  }),
                (0, jsx_runtime.jsx)('div', {
                  style: gridStyle,
                  children: filters.map((filter, index) =>
                    (0, jsx_runtime.jsx)(
                      'div',
                      {
                        style: {
                          ...('daterange' !== filter.type || isMobile
                            ? {}
                            : { gridColumn: 'span 2' }),
                        },
                        children: renderFilterComponent(filter),
                      },
                      `${filter.label}-${index}`
                    )
                  ),
                }),
                isSacredTheme &&
                  (0, jsx_runtime.jsx)('div', {
                    style: {
                      position: 'absolute',
                      bottom: '4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: '2px',
                      opacity: 0.5,
                    },
                    children: [theme.vR[4], theme.vR[5], theme.vR[4]].map(
                      (glyph, i) =>
                        (0, jsx_runtime.jsx)(
                          'div',
                          {
                            style: {
                              color: 'rgba(255, 215, 0, 0.4)',
                              fontSize: '8px',
                              animation: `sacredFloat ${2 + 0.3 * i}s ease-in-out infinite`,
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
          DataGrid_FilterSection = FilterSection
        FilterSection.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'FilterSection',
          props: {
            filters: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'DataGridFilter' }],
                raw: 'DataGridFilter[]',
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
        function MetricCard({
          title,
          value,
          subtitle,
          icon,
          trend,
          glyph,
          styles,
        }) {
          const isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            selectedGlyph =
              glyph || theme.vR[Math.floor(Math.random() * theme.vR.length)],
            cardColor = isSacredTheme ? '#FFD700' : '#1976d2',
            componentStyles = ((isSacredTheme, color) => ({
              container: {
                height: '100%',
                borderRadius: '0.75rem',
                borderWidth: '2px',
                transition: 'all 0.3s ease-in-out',
                ...(isSacredTheme
                  ? {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      backgroundImage:
                        'linear-gradient(to bottom right, #000, #1a1a1a)',
                      borderColor: `rgba(${parseInt((null == color ? void 0 : color.slice(1, 3)) || '0', 16)}, ${parseInt((null == color ? void 0 : color.slice(3, 5)) || '0', 16)}, ${parseInt((null == color ? void 0 : color.slice(5, 7)) || '0', 16)}, 0.5)`,
                      animation: 'metric-card-glow 2s infinite alternate',
                      position: 'relative',
                      overflow: 'hidden',
                      backdropFilter: 'blur(32px)',
                    }
                  : {
                      backgroundImage:
                        'linear-gradient(to bottom right, white, #F9FAFB)',
                      borderColor: `rgba(${parseInt((null == color ? void 0 : color.slice(1, 3)) || '0', 16)}, ${parseInt((null == color ? void 0 : color.slice(3, 5)) || '0', 16)}, ${parseInt((null == color ? void 0 : color.slice(5, 7)) || '0', 16)}, 0.2)`,
                    }),
              },
              containerHover: {
                transform: isSacredTheme
                  ? 'translateY(-0.5rem) scale(1.05)'
                  : 'translateY(-0.25rem)',
                boxShadow:
                  '0 1rem 1.5rem -0.5rem rgba(0,0,0,0.1), 0 0.5rem 1rem -0.25rem rgba(0,0,0,0.05)',
              },
              glyph: {
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                fontSize: '2.25rem',
                zIndex: 20,
                transition: 'all 0.3s ease-in-out',
                animation: 'metric-card-float 4s infinite ease-in-out',
                color: `rgba(${parseInt((null == color ? void 0 : color.slice(1, 3)) || '0', 16)}, ${parseInt((null == color ? void 0 : color.slice(3, 5)) || '0', 16)}, ${parseInt((null == color ? void 0 : color.slice(5, 7)) || '0', 16)}, 0.4)`,
              },
              dataStream: {
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0.125rem',
                height: '100%',
                overflow: 'hidden',
                zIndex: 10,
                '::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage:
                    'linear-gradient(to top, transparent, currentColor, transparent)',
                  animation: 'metric-card-data-stream 3s linear infinite',
                },
              },
              content: { position: 'relative', zIndex: 30, padding: '0.75rem' },
              header: {
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '0.5rem',
              },
              iconContainer: {
                marginRight: '0.5rem',
                padding: '0.25rem',
                borderRadius: '0.5rem',
                border: '1px solid',
                boxShadow:
                  '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                color,
                backgroundColor: `rgba(${parseInt((null == color ? void 0 : color.slice(1, 3)) || '0', 16)}, ${parseInt((null == color ? void 0 : color.slice(3, 5)) || '0', 16)}, ${parseInt((null == color ? void 0 : color.slice(5, 7)) || '0', 16)}, 0.15)`,
                borderColor: `rgba(${parseInt((null == color ? void 0 : color.slice(1, 3)) || '0', 16)}, ${parseInt((null == color ? void 0 : color.slice(3, 5)) || '0', 16)}, ${parseInt((null == color ? void 0 : color.slice(5, 7)) || '0', 16)}, 0.3)`,
              },
              titleContainer: { flex: 1 },
              title: {
                fontWeight: 600,
                letterSpacing: '0.025em',
                fontFamily: isSacredTheme
                  ? 'Cinzel, serif'
                  : 'Inter, sans-serif',
                color: isSacredTheme ? 'rgba(255,255,255,0.9)' : '#6B7280',
                textShadow: isSacredTheme
                  ? `0 0 10px rgba(${parseInt((null == color ? void 0 : color.slice(1, 3)) || '0', 16)}, ${parseInt((null == color ? void 0 : color.slice(3, 5)) || '0', 16)}, ${parseInt((null == color ? void 0 : color.slice(5, 7)) || '0', 16)}, 0.3)`
                  : 'none',
              },
              value: {
                fontSize: '2.25rem',
                fontWeight: 700,
                marginBottom: '0.25rem',
                fontFamily: isSacredTheme ? 'Cinzel, serif' : 'sans-serif',
                letterSpacing: isSacredTheme ? '-0.025em' : 'normal',
                color,
                textShadow: `0 0 15px rgba(${parseInt((null == color ? void 0 : color.slice(1, 3)) || '0', 16)}, ${parseInt((null == color ? void 0 : color.slice(3, 5)) || '0', 16)}, ${parseInt((null == color ? void 0 : color.slice(5, 7)) || '0', 16)}, 0.5)`,
              },
              subtitle: {
                marginBottom: '0.25rem',
                fontFamily: isSacredTheme
                  ? 'Crimson Text, serif'
                  : 'Inter, sans-serif',
                fontSize: isSacredTheme ? '1rem' : '0.875rem',
                letterSpacing: isSacredTheme ? '0.05em' : 'normal',
                color: isSacredTheme ? 'rgba(255,255,255,0.8)' : '#6B7280',
              },
              trendContainer: {
                display: 'flex',
                alignItems: 'center',
                marginTop: '0.25rem',
              },
              trend: {
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.125rem',
                fontFamily: isSacredTheme
                  ? 'Crimson Text, serif'
                  : 'Inter, sans-serif',
                fontSize: '1rem',
              },
              shimmer: {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                backgroundImage:
                  'linear-gradient(to right, transparent, currentColor, transparent)',
                animation: 'metric-card-shimmer 3s infinite',
                animationDelay: '1.5s',
                opacity: 0.6,
              },
            }))(isSacredTheme, cardColor),
            [isHovered, setIsHovered] = (0, react.useState)(!1)
          return (0, jsx_runtime.jsxs)('div', {
            style: {
              ...componentStyles.container,
              ...(isHovered && componentStyles.containerHover),
              ...((null == styles ? void 0 : styles.backgroundColor) && {
                backgroundColor: styles.backgroundColor,
              }),
              ...((null == styles ? void 0 : styles.borderColor) && {
                borderColor: styles.borderColor,
              }),
              ...((null == styles ? void 0 : styles.borderRadius) && {
                borderRadius: styles.borderRadius,
              }),
            },
            onMouseEnter: () => setIsHovered(!0),
            onMouseLeave: () => setIsHovered(!1),
            children: [
              isSacredTheme &&
                (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                  children: [
                    (0, jsx_runtime.jsx)('div', {
                      style: componentStyles.glyph,
                      children: selectedGlyph,
                    }),
                    (0, jsx_runtime.jsx)('div', {
                      style: componentStyles.dataStream,
                    }),
                    (0, jsx_runtime.jsx)('div', {
                      style: componentStyles.shimmer,
                    }),
                  ],
                }),
              (0, jsx_runtime.jsxs)('div', {
                style: componentStyles.content,
                children: [
                  (0, jsx_runtime.jsxs)('div', {
                    style: componentStyles.header,
                    children: [
                      icon &&
                        (0, jsx_runtime.jsx)('div', {
                          style: {
                            ...componentStyles.iconContainer,
                            color: cardColor,
                            backgroundColor: `rgba(${parseInt(cardColor.slice(1, 3), 16)}, ${parseInt(cardColor.slice(3, 5), 16)}, ${parseInt(cardColor.slice(5, 7), 16)}, 0.1)`,
                            borderColor: `rgba(${parseInt(cardColor.slice(1, 3), 16)}, ${parseInt(cardColor.slice(3, 5), 16)}, ${parseInt(cardColor.slice(5, 7), 16)}, 0.3)`,
                          },
                          children: icon,
                        }),
                      (0, jsx_runtime.jsx)('div', {
                        style: componentStyles.titleContainer,
                        children: (0, jsx_runtime.jsx)(Typography.A, {
                          children: title,
                        }),
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsx)(Typography.A, { children: value }),
                  subtitle &&
                    (0, jsx_runtime.jsx)(Typography.A, { children: subtitle }),
                  trend &&
                    (0, jsx_runtime.jsx)('div', {
                      style: componentStyles.trendContainer,
                      children: (0, jsx_runtime.jsxs)(Typography.A, {
                        children: [
                          (0, jsx_runtime.jsx)('span', {
                            style: { fontSize: '1.125rem' },
                            children: trend.isPositive ? '↗' : '↘',
                          }),
                          Math.abs(trend.value),
                          '%',
                        ],
                      }),
                    }),
                ],
              }),
            ],
          })
        }
        MetricCard.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'MetricCard',
          props: {
            title: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            value: {
              required: !0,
              tsType: {
                name: 'union',
                raw: 'string | number',
                elements: [{ name: 'string' }, { name: 'number' }],
              },
              description: '',
            },
            subtitle: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            icon: {
              required: !1,
              tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
              description: '',
            },
            trend: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'object',
                raw: '{\n  value: number\n  isPositive: boolean\n}',
                signature: {
                  properties: [
                    { key: 'value', value: { name: 'number', required: !0 } },
                    {
                      key: 'isPositive',
                      value: { name: 'boolean', required: !0 },
                    },
                  ],
                },
              },
              description: '',
            },
            glyph: {
              required: !1,
              tsType: { name: 'string' },
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
        const premiumStyles = {
            container: { width: '100%', marginBottom: '8px', padding: '4px' },
            grid: { display: 'grid', gap: '8px' },
          },
          sacredStyles = {
            container: { width: '100%', marginBottom: '8px', padding: '4px' },
            grid: { display: 'grid', gap: '8px' },
          },
          MetricSection = ({ metrics, styles }) => {
            const componentStyles =
                'sacred' === (null == styles ? void 0 : styles.theme)
                  ? sacredStyles
                  : premiumStyles,
              gridStyle = {
                ...componentStyles.grid,
                ...(() => {
                  switch (metrics.length) {
                    case 1:
                      return { gridTemplateColumns: '1fr' }
                    case 2:
                      return {
                        gridTemplateColumns: '1fr',
                        '@media (min-width: 768px)': {
                          gridTemplateColumns: 'repeat(2, 1fr)',
                        },
                      }
                    case 3:
                      return {
                        gridTemplateColumns: '1fr',
                        '@media (min-width: 768px)': {
                          gridTemplateColumns: 'repeat(3, 1fr)',
                        },
                      }
                    default:
                      return {
                        gridTemplateColumns: '1fr',
                        '@media (min-width: 768px)': {
                          gridTemplateColumns: 'repeat(2, 1fr)',
                        },
                        '@media (min-width: 1024px)': {
                          gridTemplateColumns: 'repeat(4, 1fr)',
                        },
                      }
                  }
                })(),
              }
            return (0, jsx_runtime.jsx)('div', {
              style: componentStyles.container,
              children: (0, jsx_runtime.jsx)('div', {
                style: gridStyle,
                children: metrics.map((metric, index) =>
                  (0, jsx_runtime.jsx)(
                    'div',
                    {
                      children: (0, jsx_runtime.jsx)(MetricCard, {
                        title: metric.title,
                        value: metric.value,
                        subtitle: metric.subtitle,
                        icon: metric.icon,
                        trend: metric.trend,
                        glyph: metric.glyph,
                        styles,
                      }),
                    },
                    `${metric.title}-${index}`
                  )
                ),
              }),
            })
          },
          DataGrid_MetricSection = MetricSection
        function toLowerCaseString(value) {
          if (null == value) return ''
          if ('object' == typeof value)
            try {
              return JSON.stringify(value).toLowerCase()
            } catch (e) {
              return ''
            }
          return 'string' == typeof value
            ? value.toLowerCase()
            : 'number' == typeof value || 'boolean' == typeof value
              ? String(value).toLowerCase()
              : ''
        }
        MetricSection.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'MetricSection',
          props: {
            metrics: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'MetricCardData' }],
                raw: 'MetricCardData[]',
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
        function arePropsEqual(prevProps, nextProps) {
          const keysToCompare = [
            'columns',
            'rows',
            'buttons',
            'dropdowns',
            'searchbarProps',
            'error',
            'showIdColumns',
            'filters',
            'metrics',
            'styles',
          ]
          for (const key of keysToCompare)
            if (
              JSON.stringify(prevProps[key]) !== JSON.stringify(nextProps[key])
            )
              return !1
          return !0
        }
        function DataGrid({
          columns,
          rows: providedRows,
          buttons,
          dropdowns,
          searchbarProps,
          error = null,
          onDuplicate,
          onDelete,
          onManage,
          onShow,
          onSelectionChange,
          showIdColumns = !1,
          filters,
          metrics,
          styles,
        }) {
          const containerRef = (0, react.useRef)(null),
            isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            computedStyles = (0, theme.fN)(styles),
            filteredColumns = (0, react.useMemo)(
              () =>
                showIdColumns
                  ? columns
                  : columns.filter(
                      col => 'id' !== col.field && '_id' !== col.field
                    ),
              [columns, showIdColumns]
            ),
            [rows, setRows] = (0, react.useState)(providedRows || []),
            [selectedRows, setSelectedRows] = (0, react.useState)([]),
            [page, setPage] = (0, react.useState)(0),
            autoPageSize = (function useAutoRowHeight(
              containerRef,
              {
                headerHeight = 60,
                footerHeight = 56,
                rowHeight = 53,
                minRows = 5,
                maxRows = 100,
              } = {}
            ) {
              const [rowsToShow, setRowsToShow] = (0, react.useState)(minRows),
                resizeObserverRef = (0, react.useRef)(null)
              return (
                (0, react.useEffect)(() => {
                  const calculateRows = () => {
                    if (!containerRef.current) return
                    const availableHeight =
                      containerRef.current.clientHeight -
                      headerHeight -
                      footerHeight
                    let calculatedRows = Math.floor(availableHeight / rowHeight)
                    ;((calculatedRows = Math.max(calculatedRows, minRows)),
                      (calculatedRows = Math.min(calculatedRows, maxRows)),
                      setRowsToShow(calculatedRows))
                  }
                  return (
                    calculateRows(),
                    containerRef.current &&
                      !resizeObserverRef.current &&
                      ((resizeObserverRef.current = new ResizeObserver(
                        calculateRows
                      )),
                      resizeObserverRef.current.observe(containerRef.current)),
                    window.addEventListener('resize', calculateRows),
                    () => {
                      ;(resizeObserverRef.current &&
                        resizeObserverRef.current.disconnect(),
                        window.removeEventListener('resize', calculateRows))
                    }
                  )
                }, [
                  containerRef,
                  headerHeight,
                  footerHeight,
                  rowHeight,
                  minRows,
                  maxRows,
                ]),
                rowsToShow
              )
            })(containerRef, {
              headerHeight:
                ((null == filters ? void 0 : filters.length) ? 50 : 0) +
                ((null == metrics ? void 0 : metrics.length) ? 120 : 0) +
                150,
              footerHeight: 56,
              rowHeight: 53,
              minRows: 5,
            }),
            [pageSize, setPageSize] = (0, react.useState)(10)
          ;((0, react.useEffect)(() => {
            autoPageSize > 0 && setPageSize(autoPageSize)
          }, [autoPageSize]),
            (function useInitializeGrid({ columns, providedRows, setRows }) {
              const setColumns = (0, esm_react.Xr)(columnsAtom, {
                  store: dataGridStore,
                }),
                columnVisibility = (0, esm_react.md)(columnVisibilityAtom, {
                  store: dataGridStore,
                }),
                updateVisibility = (0, esm_react.Xr)(columnVisibilityActions, {
                  store: dataGridStore,
                }),
                initialized = (0, react.useRef)(!1)
              ;((0, react.useEffect)(() => {
                setRows(providedRows || [])
              }, [providedRows, setRows]),
                (0, react.useEffect)(() => {
                  if (!initialized.current) {
                    setColumns(columns.map(col => col.field))
                    const initialVisibility = {}
                    ;(columns.forEach(column => {
                      void 0 === columnVisibility[column.field] &&
                        (initialVisibility[column.field] = !0)
                    }),
                      Object.keys(initialVisibility).length > 0 &&
                        updateVisibility({
                          type: 'save',
                          newState: {
                            ...columnVisibility,
                            ...initialVisibility,
                          },
                        }),
                      (initialized.current = !0))
                  }
                }, [columns, columnVisibility, setColumns, updateVisibility]))
            })({ columns: filteredColumns, providedRows, setRows }))
          const handleSelectionChange = newSelectedIds => {
              ;(setSelectedRows(newSelectedIds),
                null == onSelectionChange || onSelectionChange(newSelectedIds))
            },
            { filteredRows, updatedSearchbarProps } = (({
              columns,
              rows,
              searchbarProps,
              updateVisibility,
            }) => {
              const [searchValue, setSearchValue] = (0, react.useState)(''),
                [tags, setTags] = (0, react.useState)([])
              ;(0, react.useEffect)(() => {
                setTags(
                  searchValue.trim() ? searchValue.toLowerCase().split(' ') : []
                )
              }, [searchValue])
              const handleSearchChange = (0, react.useCallback)(event => {
                  setSearchValue(event.target.value)
                }, []),
                filteredRows = (0, react.useMemo)(() => {
                  if (!searchValue.trim()) return rows
                  const searchTerms = searchValue
                    .toLowerCase()
                    .trim()
                    .split(' ')
                  return rows.filter(row =>
                    searchTerms.some(term =>
                      columns.some(column => {
                        var _column_headerName
                        const headerMatch =
                            null === (_column_headerName = column.headerName) ||
                            void 0 === _column_headerName
                              ? void 0
                              : _column_headerName.toLowerCase().includes(term),
                          fieldMatch = column.field
                            .toLowerCase()
                            .includes(term),
                          cellMatch = toLowerCaseString(
                            row[column.field]
                          ).includes(term)
                        return headerMatch || fieldMatch || cellMatch
                      })
                    )
                  )
                }, [rows, searchValue, columns]),
                visibleColumns = (0, react.useMemo)(() => {
                  if (!searchValue.trim())
                    return new Set(columns.map(col => col.field))
                  const searchTerms = searchValue
                    .toLowerCase()
                    .trim()
                    .split(' ')
                  return new Set(
                    columns
                      .filter(col =>
                        searchTerms.some(term => {
                          var _col_headerName
                          const headerMatch =
                              null === (_col_headerName = col.headerName) ||
                              void 0 === _col_headerName
                                ? void 0
                                : _col_headerName.toLowerCase().includes(term),
                            fieldMatch = col.field.toLowerCase().includes(term),
                            hasMatchingData = filteredRows.some(row =>
                              toLowerCaseString(row[col.field]).includes(term)
                            )
                          return headerMatch || fieldMatch || hasMatchingData
                        })
                      )
                      .map(col => col.field)
                  )
                }, [columns, searchValue, filteredRows])
              ;(0, react.useEffect)(() => {
                if (!updateVisibility) return
                if (0 === tags.length) return
                const newVisibility = {}
                ;(columns.forEach(column => {
                  newVisibility[column.field] = visibleColumns.has(column.field)
                }),
                  updateVisibility({ type: 'save', newState: newVisibility }))
              }, [tags, columns, visibleColumns, updateVisibility])
              const updatedSearchbarProps = {
                ...searchbarProps,
                value: searchValue,
                onChange: handleSearchChange,
                label: 'Search DataGrid',
              }
              return {
                searchValue,
                setSearchValue,
                handleSearchChange,
                filteredRows,
                visibleColumns,
                tags,
                updatedSearchbarProps,
              }
            })({ columns: filteredColumns, rows, searchbarProps }),
            { handleManageRowClose, handleManage } = (function useManageRow({
              onManage,
              selectedRows,
              handleSelectionChange,
            }) {
              return {
                handleManageRowClose: (0, react.useCallback)(() => {
                  onManage || handleSelectionChange([])
                }, [onManage, handleSelectionChange]),
                handleManage: (0, react.useCallback)(() => {
                  onManage && onManage(selectedRows)
                }, [onManage, selectedRows]),
              }
            })({ onManage, selectedRows, handleSelectionChange }),
            startIndex = page * pageSize,
            visibleRows = filteredRows.slice(startIndex, startIndex + pageSize)
          ;(0, react.useEffect)(() => {
            const totalPages = Math.ceil(filteredRows.length / pageSize)
            page >= totalPages && totalPages > 0 && setPage(totalPages - 1)
          }, [filteredRows.length, pageSize, page])
          const allRowsSelected =
              rows.length > 0 &&
              rows.every(r => {
                var _r__id
                return selectedRows.includes(
                  String(
                    null !== (_r__id = r._id) && void 0 !== _r__id
                      ? _r__id
                      : r.id
                  )
                )
              }),
            someRowsSelected =
              rows.length > 0 &&
              selectedRows.length > 0 &&
              selectedRows.length < rows.length
          return (0, jsx_runtime.jsxs)('div', {
            ref: containerRef,
            style: computedStyles.container,
            children: [
              isSacredTheme &&
                (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                  children: [
                    (0, jsx_runtime.jsx)('div', {
                      style: {
                        ...computedStyles.glyph,
                        top: '0.75rem',
                        left: '0.75rem',
                      },
                      children: theme.vR[23],
                    }),
                    (0, jsx_runtime.jsx)('div', {
                      style: {
                        ...computedStyles.glyph,
                        top: '0.75rem',
                        right: '0.75rem',
                        animationDirection: 'reverse',
                      },
                      children: theme.vR[22],
                    }),
                  ],
                }),
              error &&
                (0, jsx_runtime.jsx)('div', {
                  style: computedStyles.error,
                  children: error.message,
                }),
              (0, jsx_runtime.jsx)(Toolbar.A, {
                buttons,
                dropdowns: (null == dropdowns ? void 0 : dropdowns[0])
                  ? [dropdowns[0]]
                  : void 0,
                searchbarProps: updatedSearchbarProps,
                rightCenterProps:
                  selectedRows.length > 0
                    ? {
                        selectedRows,
                        rows,
                        onDuplicate: onDuplicate
                          ? () => onDuplicate(selectedRows)
                          : void 0,
                        onDelete: onDelete
                          ? () => {
                              ;(onDelete(selectedRows),
                                handleSelectionChange([]))
                            }
                          : void 0,
                        onManage: onManage ? handleManage : void 0,
                        onShow: onShow ? () => onShow(selectedRows) : void 0,
                        handleClose: handleManageRowClose,
                      }
                    : void 0,
                styles: {
                  theme: (null == styles ? void 0 : styles.theme) || 'light',
                },
              }),
              filters &&
                Array.isArray(filters) &&
                filters.length > 0 &&
                (0, jsx_runtime.jsx)(DataGrid_FilterSection, {
                  filters,
                  styles,
                }),
              metrics &&
                Array.isArray(metrics) &&
                metrics.length > 0 &&
                (0, jsx_runtime.jsx)(DataGrid_MetricSection, {
                  metrics,
                  styles,
                }),
              (0, jsx_runtime.jsxs)('div', {
                style: computedStyles.tableContainer,
                children: [
                  (0, jsx_runtime.jsx)(DataGrid_Table, {
                    columns: filteredColumns,
                    rows: visibleRows,
                    selectedRowIds: selectedRows,
                    onRowClick: row =>
                      (function selectRow(
                        row,
                        selectedRows,
                        onSelectionChange
                      ) {
                        if (!onSelectionChange) return
                        var _row__id
                        const rowId =
                          null !== (_row__id = row._id) && void 0 !== _row__id
                            ? _row__id
                            : row.id
                        if (!rowId) return
                        onSelectionChange(
                          selectedRows.includes(rowId)
                            ? selectedRows.filter(id => id !== rowId)
                            : [...selectedRows, rowId]
                        )
                      })(row, selectedRows, handleSelectionChange),
                    allRowsSelected,
                    someRowsSelected,
                    onHeaderCheckboxChange: () =>
                      (function selectAllRows(
                        rows,
                        selectedRows,
                        onSelectionChange
                      ) {
                        if (!onSelectionChange) return
                        onSelectionChange(
                          rows.length > 0 &&
                            rows.every(r => selectedRows.includes(getRowId(r)))
                            ? []
                            : rows.map(r => getRowId(r))
                        )
                      })(rows, selectedRows, handleSelectionChange),
                    onRowCheckboxChange: rowId => {
                      selectedRows.includes(rowId)
                        ? handleSelectionChange(
                            selectedRows.filter(id => id !== rowId)
                          )
                        : handleSelectionChange([...selectedRows, rowId])
                    },
                    styles,
                  }),
                  (0, jsx_runtime.jsx)(Footer, {
                    page,
                    pageSize,
                    rowCount: filteredRows.length,
                    onPageChange: setPage,
                    columns: filteredColumns,
                    styles,
                  }),
                ],
              }),
              isSacredTheme &&
                (0, jsx_runtime.jsx)('div', {
                  style: computedStyles.footerContainer,
                  children: ['𓊖', '𓊗', '𓊖'].map((glyph, index) =>
                    (0, jsx_runtime.jsx)(
                      'p',
                      {
                        style: {
                          ...computedStyles.footerGlyph,
                          animationDelay: 2 + 0.3 * index + 's',
                        },
                        children: glyph,
                      },
                      index
                    )
                  ),
                }),
            ],
          })
        }
        const components_DataGrid = react.memo(DataGrid, arePropsEqual)
        DataGrid.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'DataGrid',
          props: {
            columns: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'ColumnDef' }],
                raw: 'ColumnDef[]',
              },
              description: '',
            },
            rows: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'RowData' }],
                raw: 'RowData[]',
              },
              description: '',
            },
            buttons: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [{ name: 'ButtonProps' }],
                raw: 'ButtonProps[]',
              },
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
            searchbarProps: {
              required: !1,
              tsType: { name: 'SearchbarProps' },
              description: '',
            },
            error: {
              required: !1,
              tsType: {
                name: 'union',
                raw: 'Error | null',
                elements: [{ name: 'Error' }, { name: 'null' }],
              },
              description: '',
              defaultValue: { value: 'null', computed: !1 },
            },
            showIdColumns: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
            onManage: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(selectedRows: string[]) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'Array',
                        elements: [{ name: 'string' }],
                        raw: 'string[]',
                      },
                      name: 'selectedRows',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onShow: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(selectedRows: string[]) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'Array',
                        elements: [{ name: 'string' }],
                        raw: 'string[]',
                      },
                      name: 'selectedRows',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onDuplicate: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(selectedRows: string[]) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'Array',
                        elements: [{ name: 'string' }],
                        raw: 'string[]',
                      },
                      name: 'selectedRows',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onDelete: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(selectedRows: string[]) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'Array',
                        elements: [{ name: 'string' }],
                        raw: 'string[]',
                      },
                      name: 'selectedRows',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onSelectionChange: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(selectedRows: string[]) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'Array',
                        elements: [{ name: 'string' }],
                        raw: 'string[]',
                      },
                      name: 'selectedRows',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            filters: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [{ name: 'DataGridFilter' }],
                raw: 'DataGridFilter[]',
              },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'DataGridStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
            metrics: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [{ name: 'MetricCardData' }],
                raw: 'MetricCardData[]',
              },
              description: '',
            },
          },
        }
        const sampleColumns = [
            { field: 'id', headerName: 'ID', width: 90 },
            { field: 'name', headerName: 'Name', width: 150 },
            { field: 'age', headerName: 'Age', type: 'default', width: 110 },
          ],
          sampleRows = [
            { id: '1', name: 'John Doe', age: 35 },
            { id: '2', name: 'Jane Doe', age: 32 },
            { id: '3', name: 'Peter Pan', age: 100 },
          ],
          commonArgs = {
            columns: sampleColumns,
            rows: sampleRows,
            buttons: [{ text: 'Add New' }],
            dropdowns: [
              {
                label: 'Filter',
                options: [{ value: 'all' }, { value: 'active' }],
              },
            ],
            searchbarProps: { value: '', onChange: () => {} },
          },
          datagrid_stories = {
            title: 'Components/DataGrid',
            component: components_DataGrid,
            parameters: { layout: 'fullscreen' },
            argTypes: {
              styles: {
                control: 'object',
                description:
                  'Comprehensive styling options including theme, custom colors, and layout properties.',
              },
              showIdColumns: { control: 'boolean' },
            },
          },
          LightTheme = {
            name: 'Light Theme',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                style: {
                  backgroundColor: '#f3f4f6',
                  height: '100vh',
                  padding: '1rem',
                },
                children: (0, jsx_runtime.jsx)(components_DataGrid, {
                  ...args,
                }),
              }),
            args: { ...commonArgs, styles: { theme: 'light' } },
          },
          DarkTheme = {
            name: 'Dark Theme',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                style: {
                  backgroundColor: '#1e293b',
                  height: '100vh',
                  padding: '1rem',
                },
                children: (0, jsx_runtime.jsx)(components_DataGrid, {
                  ...args,
                }),
              }),
            args: { ...commonArgs, styles: { theme: 'dark' } },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                style: {
                  backgroundColor: 'black',
                  height: '100vh',
                  padding: '1rem',
                },
                children: (0, jsx_runtime.jsx)(components_DataGrid, {
                  ...args,
                }),
              }),
            args: { ...commonArgs, styles: { theme: 'sacred' } },
          },
          InteractiveDemoComponent = () => {
            const [theme, setTheme] = react.useState('light'),
              [showIds, setShowIds] = react.useState(!0)
            return (0, jsx_runtime.jsxs)('div', {
              style: {
                padding: '1rem',
                backgroundColor: (() => {
                  switch (theme) {
                    case 'dark':
                      return '#1e293b'
                    case 'sacred':
                      return 'black'
                    default:
                      return '#f3f4f6'
                  }
                })(),
                height: '100vh',
              },
              children: [
                (0, jsx_runtime.jsxs)('div', {
                  style: {
                    position: 'fixed',
                    top: '1rem',
                    right: '1rem',
                    zIndex: 100,
                    backgroundColor: 'white',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                  },
                  children: [
                    (0, jsx_runtime.jsx)('h3', {
                      style: { fontWeight: 'bold', marginBottom: '0.5rem' },
                      children: 'Controls',
                    }),
                    (0, jsx_runtime.jsx)('div', {
                      style: { marginBottom: '0.5rem' },
                      children: (0, jsx_runtime.jsxs)('label', {
                        children: [
                          (0, jsx_runtime.jsx)('span', {
                            style: { marginRight: '0.5rem' },
                            children: 'Theme:',
                          }),
                          (0, jsx_runtime.jsxs)('select', {
                            value: theme,
                            onChange: e => setTheme(e.target.value),
                            children: [
                              (0, jsx_runtime.jsx)('option', {
                                value: 'light',
                                children: 'Light',
                              }),
                              (0, jsx_runtime.jsx)('option', {
                                value: 'dark',
                                children: 'Dark',
                              }),
                              (0, jsx_runtime.jsx)('option', {
                                value: 'sacred',
                                children: 'Sacred',
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                    (0, jsx_runtime.jsxs)('label', {
                      children: [
                        (0, jsx_runtime.jsx)('input', {
                          type: 'checkbox',
                          checked: showIds,
                          onChange: e => setShowIds(e.target.checked),
                        }),
                        (0, jsx_runtime.jsx)('span', {
                          style: { marginLeft: '0.5rem' },
                          children: 'Show ID Columns',
                        }),
                      ],
                    }),
                  ],
                }),
                (0, jsx_runtime.jsx)(components_DataGrid, {
                  columns: sampleColumns,
                  rows: sampleRows,
                  buttons: [{ text: 'Add New' }],
                  dropdowns: [
                    {
                      label: 'Filter',
                      options: [{ value: 'all' }, { value: 'active' }],
                    },
                  ],
                  searchbarProps: { value: '', onChange: () => {} },
                  styles: { theme },
                  showIdColumns: showIds,
                }),
              ],
            })
          },
          InteractiveDemo = {
            name: 'Interactive Demo',
            render: () => (0, jsx_runtime.jsx)(InteractiveDemoComponent, {}),
          },
          CustomStyling = {
            name: 'Custom Styling',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                style: {
                  backgroundColor: '#f3f4f6',
                  height: '100vh',
                  padding: '1rem',
                },
                children: (0, jsx_runtime.jsx)(components_DataGrid, {
                  ...args,
                }),
              }),
            args: {
              ...commonArgs,
              styles: {
                theme: 'light',
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
              },
            },
          },
          __namedExportsOrder = [
            'LightTheme',
            'DarkTheme',
            'SacredTheme',
            'InteractiveDemo',
            'CustomStyling',
          ]
      },
      './src/components/Field/Dropdown/Searchable/index.tsx': (
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
      './src/components/Popover/index.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
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
    },
  ]
)
