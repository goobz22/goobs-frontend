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
            ColumnResizeDemo: () => ColumnResizeDemo,
            CustomStyling: () => CustomStyling,
            DarkTheme: () => DarkTheme,
            FinancialStatements: () => FinancialStatements,
            InteractiveDemo: () => InteractiveDemo,
            LightTheme: () => LightTheme,
            ManageRowDemo: () => ManageRowDemo,
            SacredTheme: () => SacredTheme,
            SacredThemeWithMetrics: () => SacredThemeWithMetrics,
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
          Checkbox = __webpack_require__('./src/components/Checkbox/index.tsx'),
          MoreVert = __webpack_require__('./src/components/Icons/MoreVert.tsx'),
          Popover = __webpack_require__('./src/components/Popover/index.tsx'),
          src_theme = __webpack_require__('./src/theme/index.ts')
        const ColumnHeaderRow = ({
            allRowsSelected,
            someRowsSelected,
            handleHeaderCheckboxChange,
            columns,
            getResizeHandleProps,
            isResizing,
            resizingColumn,
            styles,
            onColumnSort,
            onManageColumns,
            draggedColumn,
            onColumnDragStart,
            onColumnDragOver,
            onColumnDrop,
            onColumnDragEnd,
          }) => {
            const isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              componentStyles = (styles => {
                const computedStyles = (0, src_theme.fN)(styles)
                return {
                  headerRow: {
                    position: 'relative',
                    zIndex: 50,
                    height: '55px',
                    ...computedStyles.table.tableHeader,
                  },
                  headerCell: {
                    padding: '0.75rem',
                    lineHeight: '45px',
                    verticalAlign: 'bottom',
                    fontWeight: '600',
                    textAlign: 'left',
                    color: computedStyles.table.tableHeaderCell.color,
                  },
                  checkboxCell: {
                    padding: '0.75rem',
                    width: '48px',
                    minWidth: '48px',
                    maxWidth: '48px',
                    textAlign: 'center',
                    borderRight:
                      computedStyles.table.tableHeaderCell.borderRight,
                    verticalAlign: 'middle',
                    fontWeight: '600',
                    color: computedStyles.table.tableHeaderCell.color,
                  },
                  mobileDropdownCell: {
                    width: '100%',
                    minWidth: '200px',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    overflow: 'visible',
                    position: 'relative',
                    zIndex: 50,
                    paddingRight: '0.5rem',
                    ...computedStyles.table.tableHeaderCell,
                    color: computedStyles.table.tableHeaderCell.color,
                  },
                  overflowCell: {
                    width: '275px',
                    minWidth: '275px',
                    boxSizing: 'border-box',
                    overflow: 'visible',
                    position: 'relative',
                    zIndex: 50,
                    ...computedStyles.table.tableHeaderCell,
                    color: computedStyles.table.tableHeaderCell.color,
                  },
                  columnHeader: width => ({
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    verticalAlign: 'middle',
                    padding: '0.75rem',
                    width: width ? `${width}px` : void 0,
                    minWidth: width ? `${width}px` : void 0,
                    maxWidth: width ? `${width}px` : '200px',
                    borderRight:
                      computedStyles.table.tableHeaderCell.borderRight,
                    fontWeight: '600',
                    textAlign: 'left',
                    color: computedStyles.table.tableHeaderCell.color,
                  }),
                }
              })(styles),
              [openDropdown, setOpenDropdown] = (0, react.useState)(null),
              [anchorEl, setAnchorEl] = (0, react.useState)(null)
            return (0, jsx_runtime.jsxs)('tr', {
              style: componentStyles.headerRow,
              children: [
                (0, jsx_runtime.jsx)('th', {
                  style: componentStyles.checkboxCell,
                  children: (0, jsx_runtime.jsx)(Checkbox.A, {
                    checked: allRowsSelected,
                    indeterminate: someRowsSelected,
                    onChange: checked => {
                      handleHeaderCheckboxChange({
                        target: { checked },
                        currentTarget: { checked },
                      })
                    },
                    styles: { theme: isSacredTheme ? 'sacred' : 'light' },
                  }),
                }),
                columns.map(col => {
                  const cellStyle = componentStyles.columnHeader(
                    col.computedWidth
                  )
                  return (0, jsx_runtime.jsxs)(
                    'th',
                    {
                      style: {
                        ...cellStyle,
                        position: 'relative',
                        opacity: draggedColumn === col.field ? 0.5 : 1,
                      },
                      draggable: !0,
                      onDragStart: () =>
                        null == onColumnDragStart
                          ? void 0
                          : onColumnDragStart(col.field),
                      onDragOver: onColumnDragOver,
                      onDrop: () =>
                        null == onColumnDrop ? void 0 : onColumnDrop(col.field),
                      onDragEnd: onColumnDragEnd,
                      children: [
                        (0, jsx_runtime.jsxs)('div', {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'grab',
                          },
                          children: [
                            (0, jsx_runtime.jsx)('span', {
                              style: {
                                flex: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                userSelect: 'none',
                              },
                              children: col.headerName || col.field,
                            }),
                            (0, jsx_runtime.jsx)('button', {
                              onClick: e => {
                                ;(e.preventDefault(),
                                  e.stopPropagation(),
                                  setAnchorEl(e.currentTarget),
                                  setOpenDropdown(col.field))
                              },
                              style: {
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                color: isSacredTheme ? '#FFD700' : '#6B7280',
                                opacity: 0.7,
                                transition: 'opacity 0.2s',
                              },
                              onMouseEnter: e =>
                                (e.currentTarget.style.opacity = '1'),
                              onMouseLeave: e =>
                                (e.currentTarget.style.opacity = '0.7'),
                              children: (0, jsx_runtime.jsx)(MoreVert.A, {}),
                            }),
                          ],
                        }),
                        (0, jsx_runtime.jsx)(Popover.A, {
                          open: openDropdown === col.field,
                          onClose: () => {
                            ;(setOpenDropdown(null), setAnchorEl(null))
                          },
                          anchorEl,
                          styles: { theme: isSacredTheme ? 'sacred' : 'light' },
                          children: (0, jsx_runtime.jsxs)('div', {
                            style: {
                              padding: '8px',
                              minWidth: '180px',
                              maxHeight: '400px',
                              overflow: 'auto',
                              backgroundColor: isSacredTheme
                                ? 'rgba(0, 0, 0, 0.9)'
                                : 'white',
                              borderRadius: '8px',
                              boxShadow: isSacredTheme
                                ? '0 10px 30px rgba(255, 215, 0, 0.3)'
                                : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            },
                            children: [
                              (0, jsx_runtime.jsx)('button', {
                                onClick: () => {
                                  ;(null == onColumnSort ||
                                    onColumnSort(col.field, 'asc'),
                                    setOpenDropdown(null))
                                },
                                style: {
                                  width: '100%',
                                  textAlign: 'left',
                                  padding: '8px 12px',
                                  border:
                                    '1px solid ' +
                                    (isSacredTheme ? '#FFD700' : '#E5E7EB'),
                                  background: isSacredTheme
                                    ? 'rgba(255, 215, 0, 0.05)'
                                    : '#F9F9F9',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  color: isSacredTheme ? '#FFD700' : '#1F2937',
                                  borderRadius: '4px',
                                  display: 'block',
                                },
                                onMouseEnter: e => {
                                  e.currentTarget.style.backgroundColor =
                                    isSacredTheme
                                      ? 'rgba(255, 215, 0, 0.2)'
                                      : 'rgba(59, 130, 246, 0.1)'
                                },
                                onMouseLeave: e => {
                                  e.currentTarget.style.backgroundColor =
                                    isSacredTheme
                                      ? 'rgba(255, 215, 0, 0.05)'
                                      : '#F9F9F9'
                                },
                                children: 'Sort A → Z',
                              }),
                              (0, jsx_runtime.jsx)('button', {
                                onClick: () => {
                                  ;(null == onColumnSort ||
                                    onColumnSort(col.field, 'desc'),
                                    setOpenDropdown(null))
                                },
                                style: {
                                  width: '100%',
                                  textAlign: 'left',
                                  padding: '8px 12px',
                                  border:
                                    '1px solid ' +
                                    (isSacredTheme ? '#FFD700' : '#E5E7EB'),
                                  background: isSacredTheme
                                    ? 'rgba(255, 215, 0, 0.05)'
                                    : '#F9F9F9',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  color: isSacredTheme ? '#FFD700' : '#1F2937',
                                  borderRadius: '4px',
                                  marginTop: '2px',
                                  display: 'block',
                                },
                                onMouseEnter: e => {
                                  e.currentTarget.style.backgroundColor =
                                    isSacredTheme
                                      ? 'rgba(255, 215, 0, 0.2)'
                                      : 'rgba(59, 130, 246, 0.1)'
                                },
                                onMouseLeave: e => {
                                  e.currentTarget.style.backgroundColor =
                                    isSacredTheme
                                      ? 'rgba(255, 215, 0, 0.05)'
                                      : '#F9F9F9'
                                },
                                children: 'Sort Z → A',
                              }),
                              (0, jsx_runtime.jsx)('hr', {
                                style: {
                                  margin: '8px 0',
                                  border: 'none',
                                  borderTop:
                                    '1px solid ' +
                                    (isSacredTheme
                                      ? 'rgba(255, 215, 0, 0.3)'
                                      : '#E5E7EB'),
                                },
                              }),
                              (0, jsx_runtime.jsx)('hr', {
                                style: {
                                  margin: '8px 0',
                                  border: 'none',
                                  borderTop:
                                    '1px solid ' +
                                    (isSacredTheme
                                      ? 'rgba(255, 215, 0, 0.3)'
                                      : '#E5E7EB'),
                                },
                              }),
                              (0, jsx_runtime.jsx)('button', {
                                onClick: () => {
                                  ;(null == onManageColumns ||
                                    onManageColumns(),
                                    setOpenDropdown(null))
                                },
                                style: {
                                  width: '100%',
                                  textAlign: 'left',
                                  padding: '8px 12px',
                                  border: 'none',
                                  background: 'none',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  color: isSacredTheme ? '#FFD700' : '#1F2937',
                                },
                                children: 'Manage All Columns',
                              }),
                            ],
                          }),
                        }),
                        !1 !== col.resizable &&
                          (0, jsx_runtime.jsx)('div', {
                            ...getResizeHandleProps(col.field),
                            style: {
                              ...getResizeHandleProps(col.field).style,
                              backgroundColor:
                                resizingColumn === col.field
                                  ? 'rgba(59, 130, 246, 0.2)'
                                  : 'rgba(148, 163, 184, 0.1)',
                              borderRight:
                                resizingColumn === col.field
                                  ? '2px solid #3B82F6'
                                  : '1px solid rgba(148, 163, 184, 0.3)',
                            },
                            onMouseEnter: e => {
                              isResizing ||
                                ((e.currentTarget.style.backgroundColor =
                                  'rgba(59, 130, 246, 0.2)'),
                                (e.currentTarget.style.borderRight =
                                  '2px solid #3B82F6'))
                            },
                            onMouseLeave: e => {
                              isResizing ||
                                resizingColumn === col.field ||
                                ((e.currentTarget.style.backgroundColor =
                                  'rgba(148, 163, 184, 0.1)'),
                                (e.currentTarget.style.borderRight =
                                  '1px solid rgba(148, 163, 184, 0.3)'))
                            },
                            title: 'Drag to resize column',
                          }),
                      ],
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
            columns: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'ColumnDef' }],
                raw: 'ColumnDef[]',
              },
              description: '',
            },
            getResizeHandleProps: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(columnField: string) => {\n  onMouseDown: (e: React.MouseEvent) => void\n  style: React.CSSProperties\n}',
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'columnField' },
                  ],
                  return: {
                    name: 'signature',
                    type: 'object',
                    raw: '{\n  onMouseDown: (e: React.MouseEvent) => void\n  style: React.CSSProperties\n}',
                    signature: {
                      properties: [
                        {
                          key: 'onMouseDown',
                          value: {
                            name: 'signature',
                            type: 'function',
                            raw: '(e: React.MouseEvent) => void',
                            signature: {
                              arguments: [
                                {
                                  type: {
                                    name: 'ReactMouseEvent',
                                    raw: 'React.MouseEvent',
                                  },
                                  name: 'e',
                                },
                              ],
                              return: { name: 'void' },
                            },
                            required: !0,
                          },
                        },
                        {
                          key: 'style',
                          value: {
                            name: 'ReactCSSProperties',
                            raw: 'React.CSSProperties',
                            required: !0,
                          },
                        },
                      ],
                    },
                  },
                },
              },
              description: '',
            },
            isResizing: {
              required: !0,
              tsType: { name: 'boolean' },
              description: '',
            },
            resizingColumn: {
              required: !0,
              tsType: {
                name: 'union',
                raw: 'string | null',
                elements: [{ name: 'string' }, { name: 'null' }],
              },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'DataGridStyles' },
              description: '',
            },
            onColumnSort: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: "(field: string, direction: 'asc' | 'desc') => void",
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'field' },
                    {
                      type: {
                        name: 'union',
                        raw: "'asc' | 'desc'",
                        elements: [
                          { name: 'literal', value: "'asc'" },
                          { name: 'literal', value: "'desc'" },
                        ],
                      },
                      name: 'direction',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onManageColumns: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            draggedColumn: {
              required: !1,
              tsType: {
                name: 'union',
                raw: 'string | null',
                elements: [{ name: 'string' }, { name: 'null' }],
              },
              description: '',
            },
            onColumnDragStart: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(field: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'field' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onColumnDragOver: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(e: React.DragEvent) => void',
                signature: {
                  arguments: [
                    {
                      type: { name: 'ReactDragEvent', raw: 'React.DragEvent' },
                      name: 'e',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onColumnDrop: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(targetField: string) => void',
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'targetField' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onColumnDragEnd: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
          },
        }
        var Tooltip = __webpack_require__('./src/components/Tooltip/index.tsx'),
          Regular = __webpack_require__(
            './src/components/Field/Dropdown/Regular/index.tsx'
          )
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
        const Rows = ({
            rows,
            columns,
            selectedRowIds,
            onRowClick,
            styles,
            editingCell,
            editingValue,
            onCellClick,
            onCellSave,
            onCellCancel,
            onEditingValueChange,
          }) => {
            const isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              computedStyles = (0, src_theme.fN)(styles)
            return rows && 0 !== rows.length
              ? (0, jsx_runtime.jsx)('tbody', {
                  children: rows.map(row => {
                    const rowId = getRowId(row),
                      isSelected = selectedRowIds.includes(rowId),
                      rowStyle = {
                        ...computedStyles.table.tableRow,
                        ...(isSelected && {
                          backgroundColor: isSacredTheme
                            ? 'rgba(255, 215, 0, 0.15)'
                            : 'rgba(219, 234, 254, 1)',
                        }),
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                      },
                      rowHoverStyle = { ...computedStyles.table.tableRowHover }
                    return (0, jsx_runtime.jsxs)(
                      'tr',
                      {
                        onClick: () =>
                          null == onRowClick ? void 0 : onRowClick(row),
                        style: rowStyle,
                        onMouseEnter: e => {
                          isSelected ||
                            Object.assign(e.currentTarget.style, rowHoverStyle)
                        },
                        onMouseLeave: e => {
                          isSelected ||
                            Object.assign(e.currentTarget.style, rowStyle)
                        },
                        children: [
                          (0, jsx_runtime.jsx)('td', {
                            style: {
                              ...computedStyles.table.tableCell,
                              width: '48px',
                              minWidth: '48px',
                              maxWidth: '48px',
                              padding: '0',
                              border: 'none',
                            },
                          }),
                          columns.map(col => {
                            const value = row[col.field],
                              isEditing =
                                (null == editingCell
                                  ? void 0
                                  : editingCell.rowId) === rowId &&
                                (null == editingCell
                                  ? void 0
                                  : editingCell.field) === col.field
                            let cellContent
                            return (
                              (cellContent =
                                '__overflow__' === col.field
                                  ? '---'
                                  : isEditing
                                    ? 'dropdown' === col.type &&
                                      col.dropdownOptions
                                      ? (0, jsx_runtime.jsx)('div', {
                                          style: { width: '100%' },
                                          children: (0, jsx_runtime.jsx)(
                                            Regular.A,
                                            {
                                              label: '',
                                              value: editingValue,
                                              options: col.dropdownOptions.map(
                                                opt => ({
                                                  value: opt.value,
                                                  label: opt.label || opt.value,
                                                })
                                              ),
                                              onChange: e => {
                                                const newValue = e.target.value
                                                ;(null ==
                                                  onEditingValueChange ||
                                                  onEditingValueChange(
                                                    newValue
                                                  ),
                                                  null == onCellSave ||
                                                    onCellSave(
                                                      rowId,
                                                      col.field,
                                                      newValue
                                                    ))
                                              },
                                              styles: {
                                                theme: isSacredTheme
                                                  ? 'sacred'
                                                  : 'light',
                                                fontSize: '14px',
                                                height: '32px',
                                              },
                                            }
                                          ),
                                        })
                                      : (0, jsx_runtime.jsx)('div', {
                                          style: { width: '100%' },
                                          children: (0, jsx_runtime.jsx)(
                                            'input',
                                            {
                                              type: 'text',
                                              value: editingValue,
                                              onChange: e =>
                                                null == onEditingValueChange
                                                  ? void 0
                                                  : onEditingValueChange(
                                                      e.target.value
                                                    ),
                                              onBlur: () =>
                                                null == onCellSave
                                                  ? void 0
                                                  : onCellSave(
                                                      rowId,
                                                      col.field,
                                                      editingValue || ''
                                                    ),
                                              onKeyPress: e => {
                                                'Enter' === e.key
                                                  ? null == onCellSave ||
                                                    onCellSave(
                                                      rowId,
                                                      col.field,
                                                      editingValue || ''
                                                    )
                                                  : 'Escape' === e.key &&
                                                    (null == onCellCancel ||
                                                      onCellCancel())
                                              },
                                              style: {
                                                width: '100%',
                                                border: '1px solid #ccc',
                                                padding: '4px',
                                                fontSize: '14px',
                                                borderRadius: '4px',
                                                backgroundColor: isSacredTheme
                                                  ? 'rgba(0, 0, 0, 0.8)'
                                                  : 'white',
                                                color: isSacredTheme
                                                  ? '#FFD700'
                                                  : '#333',
                                              },
                                              autoFocus: !0,
                                            }
                                          ),
                                        })
                                    : 'currency' === col.type
                                      ? (function formatCurrency(
                                          value,
                                          sacredtheme = !1
                                        ) {
                                          let numValue
                                          if ('number' == typeof value)
                                            numValue = value
                                          else if ('string' == typeof value) {
                                            const parsed = parseFloat(
                                              value.replace(/[^0-9.-]/g, '')
                                            )
                                            numValue = isNaN(parsed)
                                              ? 0
                                              : parsed
                                          } else numValue = 0
                                          const formatted =
                                              new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: 'USD',
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                              }).format(numValue),
                                            isZero = 0 === numValue,
                                            isNegative = numValue < 0,
                                            isLarge = Math.abs(numValue) >= 1e4,
                                            isMedium =
                                              Math.abs(numValue) >= 1e3 &&
                                              Math.abs(numValue) < 1e4,
                                            colorScheme = sacredtheme
                                              ? isZero
                                                ? {
                                                    text: '#9CA3AF',
                                                    background:
                                                      'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(55, 65, 81, 0.8) 100%)',
                                                    border:
                                                      'rgba(156, 163, 175, 0.5)',
                                                    shadow:
                                                      '0 2px 6px rgba(255, 215, 0, 0.1)',
                                                    pulse: !1,
                                                  }
                                                : isNegative
                                                  ? {
                                                      text: '#EF4444',
                                                      background:
                                                        'linear-gradient(135deg, rgba(127, 29, 29, 0.8) 0%, rgba(185, 28, 28, 0.8) 100%)',
                                                      border:
                                                        'rgba(239, 68, 68, 0.6)',
                                                      shadow:
                                                        '0 4px 12px rgba(239, 68, 68, 0.3)',
                                                      pulse: isLarge,
                                                    }
                                                  : isLarge
                                                    ? {
                                                        text: '#FFD700',
                                                        background:
                                                          'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.25) 100%)',
                                                        border: '#FFD700',
                                                        shadow:
                                                          '0 4px 12px rgba(255, 215, 0, 0.4)',
                                                        pulse: !0,
                                                      }
                                                    : isMedium
                                                      ? {
                                                          text: '#F59E0B',
                                                          background:
                                                            'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.2) 100%)',
                                                          border:
                                                            'rgba(245, 158, 11, 0.6)',
                                                          shadow:
                                                            '0 3px 8px rgba(245, 158, 11, 0.2)',
                                                          pulse: !1,
                                                        }
                                                      : {
                                                          text: '#D97706',
                                                          background:
                                                            'linear-gradient(135deg, rgba(217, 119, 6, 0.05) 0%, rgba(217, 119, 6, 0.15) 100%)',
                                                          border:
                                                            'rgba(217, 119, 6, 0.5)',
                                                          shadow:
                                                            '0 2px 6px rgba(217, 119, 6, 0.15)',
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
                                                      shadow:
                                                        '0 4px 12px rgba(220, 38, 38, 0.15)',
                                                      pulse: isLarge,
                                                    }
                                                  : isLarge
                                                    ? {
                                                        text: '#059669',
                                                        background:
                                                          'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 30%, #A7F3D0 100%)',
                                                        border: '#34D399',
                                                        shadow:
                                                          '0 4px 12px rgba(5, 150, 105, 0.2)',
                                                        pulse: !0,
                                                      }
                                                    : isMedium
                                                      ? {
                                                          text: '#0D9488',
                                                          background:
                                                            'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 50%, #99F6E4 100%)',
                                                          border: '#5EEAD4',
                                                          shadow:
                                                            '0 3px 8px rgba(13, 148, 136, 0.15)',
                                                          pulse: !1,
                                                        }
                                                      : {
                                                          text: '#0F766E',
                                                          background:
                                                            'linear-gradient(135deg, #F0FDFA 0%, #E6FFFA 100%)',
                                                          border: '#7DD3FC',
                                                          shadow:
                                                            '0 2px 6px rgba(15, 118, 110, 0.1)',
                                                          pulse: !1,
                                                        },
                                            formatId = `currency-${Math.random().toString(36).substr(2, 9)}`,
                                            element = (0, jsx_runtime.jsxs)(
                                              'span',
                                              {
                                                id: formatId,
                                                style: {
                                                  position: 'relative',
                                                  display: 'inline-flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  fontFamily:
                                                    '"Inter Tight", "JetBrains Mono", "SF Pro Display", system-ui, sans-serif',
                                                  fontWeight: isZero
                                                    ? 400
                                                    : isLarge
                                                      ? 700
                                                      : 600,
                                                  fontSize: isLarge
                                                    ? '0.95rem'
                                                    : '0.875rem',
                                                  lineHeight: 1.3,
                                                  letterSpacing: isLarge
                                                    ? '0.01em'
                                                    : '0.02em',
                                                  color: colorScheme.text,
                                                  background:
                                                    colorScheme.background,
                                                  border: `1.5px solid ${colorScheme.border}`,
                                                  borderRadius: '8px',
                                                  padding: isLarge
                                                    ? '6px 12px'
                                                    : '5px 10px',
                                                  minWidth: isLarge
                                                    ? '100px'
                                                    : '90px',
                                                  textAlign: 'right',
                                                  boxShadow: colorScheme.shadow,
                                                  backdropFilter: 'blur(8px)',
                                                  WebkitBackdropFilter:
                                                    'blur(8px)',
                                                  transition:
                                                    'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
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
                                                    (e.currentTarget.style.boxShadow =
                                                      isZero
                                                        ? '0 2px 8px rgba(0, 0, 0, 0.1)'
                                                        : colorScheme.shadow
                                                            .replace(
                                                              '0.15)',
                                                              '0.25)'
                                                            )
                                                            .replace(
                                                              '0.2)',
                                                              '0.35)'
                                                            )
                                                            .replace(
                                                              '0.1)',
                                                              '0.2)'
                                                            )))
                                                },
                                                onMouseLeave: e => {
                                                  ;((e.currentTarget.style.transform =
                                                    'translateY(0) scale(1)'),
                                                    (e.currentTarget.style.boxShadow =
                                                      colorScheme.shadow))
                                                },
                                                children: [
                                                  colorScheme.pulse &&
                                                    (0, jsx_runtime.jsx)(
                                                      'style',
                                                      {
                                                        children: `\n            @keyframes pulse-${formatId} {\n              0%, 100% { opacity: 1; }\n              50% { opacity: 0.85; }\n            }\n          `,
                                                      }
                                                    ),
                                                  isLarge &&
                                                    !isNegative &&
                                                    (0, jsx_runtime.jsx)(
                                                      'span',
                                                      {
                                                        style: {
                                                          marginRight: '4px',
                                                          fontSize: '0.75em',
                                                          opacity: 0.7,
                                                          color: sacredtheme
                                                            ? '#FFD700'
                                                            : '#10B981',
                                                        },
                                                        children: '▲',
                                                      }
                                                    ),
                                                  (0, jsx_runtime.jsx)('span', {
                                                    style: {
                                                      opacity: 0.85,
                                                      marginRight: '2px',
                                                      fontSize: isLarge
                                                        ? '0.85em'
                                                        : '0.8em',
                                                      fontWeight: 500,
                                                    },
                                                    children: '$',
                                                  }),
                                                  (0, jsx_runtime.jsx)('span', {
                                                    style: {
                                                      fontVariantNumeric:
                                                        'tabular-nums',
                                                      fontFeatureSettings:
                                                        '"tnum" 1',
                                                      letterSpacing: '0.015em',
                                                    },
                                                    children: formatted.replace(
                                                      '$',
                                                      ''
                                                    ),
                                                  }),
                                                  isLarge &&
                                                    !isNegative &&
                                                    (0, jsx_runtime.jsx)(
                                                      'span',
                                                      {
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
                                                        children: (0,
                                                        jsx_runtime.jsx)(
                                                          'style',
                                                          {
                                                            children: `\n              @keyframes shimmer-${formatId} {\n                0% { left: -100%; }\n                50%, 100% { left: 100%; }\n              }\n            `,
                                                          }
                                                        ),
                                                      }
                                                    ),
                                                ],
                                              }
                                            )
                                          return { formatted, element }
                                        })(value, isSacredTheme).element
                                      : 'credit_card' === col.type
                                        ? (function formatCreditCard(
                                            value,
                                            sacredtheme = !1
                                          ) {
                                            let digits = ''
                                            if (
                                              ((digits =
                                                'string' == typeof value
                                                  ? value.replace(/\D/g, '')
                                                  : 'number' == typeof value
                                                    ? String(value).replace(
                                                        /\D/g,
                                                        ''
                                                      )
                                                    : ''),
                                              !digits || digits.length < 4)
                                            ) {
                                              const formatted =
                                                '•••• •••• •••• ••••'
                                              return {
                                                formatted,
                                                element: (0, jsx_runtime.jsx)(
                                                  'span',
                                                  {
                                                    style: {
                                                      display: 'inline-flex',
                                                      alignItems: 'center',
                                                      fontFamily:
                                                        '"JetBrains Mono", "SF Mono", Consolas, monospace',
                                                      fontWeight: 400,
                                                      fontSize: '0.875rem',
                                                      lineHeight: 1.3,
                                                      letterSpacing: '0.1em',
                                                      color: sacredtheme
                                                        ? 'rgba(255, 215, 0, 0.5)'
                                                        : '#9CA3AF',
                                                      backgroundColor:
                                                        sacredtheme
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
                                                  }
                                                ),
                                              }
                                            }
                                            const lastFour = digits.slice(-4),
                                              formatted = (
                                                '•'.repeat(
                                                  Math.max(0, digits.length - 4)
                                                ) + lastFour
                                              )
                                                .replace(/(.{4})/g, '$1 ')
                                                .trim(),
                                              cardInfo = sacredtheme
                                                ? {
                                                    color: '#FFD700',
                                                    bgGradient:
                                                      'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 30%, rgba(255, 215, 0, 0.15) 100%)',
                                                    borderColor:
                                                      'rgba(255, 215, 0, 0.6)',
                                                  }
                                                : {
                                                    color: '#1F2937',
                                                    bgGradient:
                                                      'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 30%, #CBD5E1 100%)',
                                                    borderColor: '#475569',
                                                  },
                                              formatId = `card-${Math.random().toString(36).substr(2, 9)}`,
                                              element = (0, jsx_runtime.jsxs)(
                                                'span',
                                                {
                                                  id: formatId,
                                                  style: {
                                                    position: 'relative',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontFamily:
                                                      '"JetBrains Mono", "SF Mono", Consolas, monospace',
                                                    fontWeight: 500,
                                                    fontSize: '0.875rem',
                                                    lineHeight: 1.3,
                                                    letterSpacing: '0.08em',
                                                    color: cardInfo.color,
                                                    background:
                                                      cardInfo.bgGradient,
                                                    border: `1.5px solid ${cardInfo.borderColor}`,
                                                    borderRadius: '8px',
                                                    padding: '6px 12px',
                                                    minWidth: '140px',
                                                    textAlign: 'center',
                                                    boxShadow: sacredtheme
                                                      ? '0 2px 8px rgba(255, 215, 0, 0.2)'
                                                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                    backdropFilter: 'blur(4px)',
                                                    WebkitBackdropFilter:
                                                      'blur(4px)',
                                                    transition:
                                                      'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    cursor: 'default',
                                                    userSelect: 'none',
                                                    overflow: 'hidden',
                                                  },
                                                  onMouseEnter: e => {
                                                    ;((e.currentTarget.style.transform =
                                                      'translateY(-1px)'),
                                                      (e.currentTarget.style.boxShadow =
                                                        sacredtheme
                                                          ? '0 4px 12px rgba(255, 215, 0, 0.3)'
                                                          : '0 4px 12px rgba(0, 0, 0, 0.15)'))
                                                  },
                                                  onMouseLeave: e => {
                                                    ;((e.currentTarget.style.transform =
                                                      'translateY(0)'),
                                                      (e.currentTarget.style.boxShadow =
                                                        sacredtheme
                                                          ? '0 2px 8px rgba(255, 215, 0, 0.2)'
                                                          : '0 2px 8px rgba(0, 0, 0, 0.1)'))
                                                  },
                                                  children: [
                                                    (0, jsx_runtime.jsx)(
                                                      'span',
                                                      {
                                                        style: {
                                                          fontVariantNumeric:
                                                            'tabular-nums',
                                                          fontFeatureSettings:
                                                            '"tnum" 1',
                                                          display: 'flex',
                                                          alignItems: 'center',
                                                          gap: '2px',
                                                        },
                                                        children: formatted
                                                          .split('')
                                                          .map((char, index) =>
                                                            (0,
                                                            jsx_runtime.jsx)(
                                                              'span',
                                                              {
                                                                style: {
                                                                  opacity:
                                                                    '•' === char
                                                                      ? 0.6
                                                                      : 1,
                                                                  fontSize:
                                                                    '•' === char
                                                                      ? '1.2em'
                                                                      : '1em',
                                                                  fontWeight:
                                                                    '•' === char
                                                                      ? 300
                                                                      : 600,
                                                                },
                                                                children: char,
                                                              },
                                                              index
                                                            )
                                                          ),
                                                      }
                                                    ),
                                                    (0, jsx_runtime.jsx)(
                                                      'span',
                                                      {
                                                        style: {
                                                          fontSize: '0.75rem',
                                                          opacity: 0.5,
                                                          marginLeft: '8px',
                                                          color: sacredtheme
                                                            ? '#FFD700'
                                                            : '#6B7280',
                                                        },
                                                        children: '🔒',
                                                      }
                                                    ),
                                                    (0, jsx_runtime.jsx)(
                                                      'span',
                                                      {
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
                                                      }
                                                    ),
                                                  ],
                                                }
                                              )
                                            return { formatted, element }
                                          })(value, isSacredTheme).element
                                        : 'expiration_date' === col.type
                                          ? (function formatExpirationDate(
                                              value,
                                              sacredtheme = !1
                                            ) {
                                              const date = (input => {
                                                  if (
                                                    !input ||
                                                    'string' != typeof input
                                                  )
                                                    return null
                                                  const cleaned = input.replace(
                                                    /[^0-9]/g,
                                                    ''
                                                  )
                                                  let month, year
                                                  return cleaned.length >= 3 &&
                                                    ((month = parseInt(
                                                      cleaned.slice(0, 2),
                                                      10
                                                    )),
                                                    (year = parseInt(
                                                      cleaned.slice(2),
                                                      10
                                                    )),
                                                    year < 100 && (year += 2e3),
                                                    !isNaN(month) &&
                                                      !isNaN(year) &&
                                                      month >= 1 &&
                                                      month <= 12)
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
                                                    (expiry.setMonth(
                                                      expiry.getMonth() + 1,
                                                      0
                                                    ),
                                                    expiry.setHours(
                                                      23,
                                                      59,
                                                      59,
                                                      999
                                                    ),
                                                    expiry < now)
                                                  )
                                                    return 'expired'
                                                  const sixMonthsFromNow =
                                                    new Date(now)
                                                  return (
                                                    sixMonthsFromNow.setMonth(
                                                      now.getMonth() + 6
                                                    ),
                                                    expiry < sixMonthsFromNow
                                                      ? 'expiring_soon'
                                                      : 'valid'
                                                  )
                                                })()
                                              return {
                                                formatted,
                                                element: (0, jsx_runtime.jsxs)(
                                                  'span',
                                                  {
                                                    style: (() => {
                                                      const themes = {
                                                          sacredtheme: {
                                                            valid: {
                                                              color: '#A3E635',
                                                              bg: 'rgba(163, 230, 53, 0.1)',
                                                              borderColor:
                                                                'rgba(163, 230, 53, 0.4)',
                                                            },
                                                            expiring_soon: {
                                                              color: '#FBBF24',
                                                              bg: 'rgba(251, 191, 36, 0.1)',
                                                              borderColor:
                                                                'rgba(251, 191, 36, 0.5)',
                                                            },
                                                            expired: {
                                                              color: '#F87171',
                                                              bg: 'rgba(248, 113, 113, 0.1)',
                                                              borderColor:
                                                                'rgba(248, 113, 113, 0.5)',
                                                            },
                                                            invalid: {
                                                              color: '#9CA3AF',
                                                              bg: 'rgba(156, 163, 175, 0.1)',
                                                              borderColor:
                                                                'rgba(156, 163, 175, 0.3)',
                                                            },
                                                          },
                                                          standard: {
                                                            valid: {
                                                              color: '#166534',
                                                              bg: '#DCFCE7',
                                                              borderColor:
                                                                '#4ADE80',
                                                            },
                                                            expiring_soon: {
                                                              color: '#92400E',
                                                              bg: '#FEF3C7',
                                                              borderColor:
                                                                '#FBBF24',
                                                            },
                                                            expired: {
                                                              color: '#991B1B',
                                                              bg: '#FEE2E2',
                                                              borderColor:
                                                                '#F87171',
                                                            },
                                                            invalid: {
                                                              color: '#4B5563',
                                                              bg: '#F3F4F6',
                                                              borderColor:
                                                                '#D1D5DB',
                                                            },
                                                          },
                                                        },
                                                        style = (
                                                          sacredtheme
                                                            ? themes.sacredtheme
                                                            : themes.standard
                                                        )[status]
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
                                                        transition:
                                                          'all 0.2s ease',
                                                        borderWidth: '1.5px',
                                                        borderStyle: 'solid',
                                                        color: style.color,
                                                        backgroundColor:
                                                          style.bg,
                                                        borderColor:
                                                          style.borderColor,
                                                      }
                                                    })(),
                                                    children: [
                                                      (0, jsx_runtime.jsx)(
                                                        'span',
                                                        {
                                                          style: {
                                                            fontSize: '0.75rem',
                                                            opacity: 0.8,
                                                          },
                                                          children: {
                                                            valid: '✓',
                                                            expiring_soon: '⏳',
                                                            expired: '✕',
                                                            invalid: '?',
                                                          }[status],
                                                        }
                                                      ),
                                                      (0, jsx_runtime.jsx)(
                                                        'span',
                                                        { children: formatted }
                                                      ),
                                                    ],
                                                  }
                                                ),
                                              }
                                            })(value, isSacredTheme).element
                                          : 'account_number' === col.type
                                            ? (function formatAccountNumber(
                                                value,
                                                sacredtheme = !1
                                              ) {
                                                let digits = ''
                                                if (
                                                  (('string' != typeof value &&
                                                    'number' != typeof value) ||
                                                    (digits = String(
                                                      value
                                                    ).replace(/\D/g, '')),
                                                  !digits || digits.length < 4)
                                                ) {
                                                  const formatted = '••••'
                                                  return {
                                                    formatted,
                                                    element: (0,
                                                    jsx_runtime.jsx)('span', {
                                                      style: {
                                                        fontFamily:
                                                          '"JetBrains Mono", monospace',
                                                        color: sacredtheme
                                                          ? 'rgba(255, 215, 0, 0.6)'
                                                          : '#6B7280',
                                                        letterSpacing: '0.1em',
                                                      },
                                                      children: formatted,
                                                    }),
                                                  }
                                                }
                                                const lastFour =
                                                    digits.slice(-4),
                                                  formatted =
                                                    '•'.repeat(
                                                      digits.length - 4
                                                    ) + lastFour,
                                                  themeStyle = sacredtheme
                                                    ? {
                                                        color: '#FFD700',
                                                        fontFamily:
                                                          '"Caudex", serif',
                                                        textShadow:
                                                          '0 0 8px rgba(255, 215, 0, 0.5)',
                                                      }
                                                    : {
                                                        color: '#1F2937',
                                                        fontFamily:
                                                          '"Inter", sans-serif',
                                                      }
                                                return {
                                                  formatted,
                                                  element: (0,
                                                  jsx_runtime.jsxs)('div', {
                                                    style: {
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      gap: '8px',
                                                    },
                                                    children: [
                                                      (0, jsx_runtime.jsx)(
                                                        'span',
                                                        {
                                                          style: {
                                                            fontSize: '0.75rem',
                                                            opacity: 0.6,
                                                            color: sacredtheme
                                                              ? '#FFD700'
                                                              : '#4B5563',
                                                          },
                                                          children: '#',
                                                        }
                                                      ),
                                                      (0, jsx_runtime.jsx)(
                                                        'span',
                                                        {
                                                          style: {
                                                            ...themeStyle,
                                                            fontWeight: 600,
                                                            fontSize: '0.9rem',
                                                            letterSpacing:
                                                              '0.05em',
                                                          },
                                                          children: formatted,
                                                        }
                                                      ),
                                                    ],
                                                  }),
                                                }
                                              })(value, isSacredTheme).element
                                            : 'routing_number' === col.type
                                              ? (function formatRoutingNumber(
                                                  value,
                                                  sacredtheme = !1
                                                ) {
                                                  let digits = ''
                                                  if (
                                                    (('string' !=
                                                      typeof value &&
                                                      'number' !=
                                                        typeof value) ||
                                                      (digits = String(
                                                        value
                                                      ).replace(/\D/g, '')),
                                                    9 !== digits.length)
                                                  ) {
                                                    const formatted =
                                                      'Invalid ABA'
                                                    return {
                                                      formatted,
                                                      element: (0,
                                                      jsx_runtime.jsx)('span', {
                                                        style: {
                                                          fontFamily:
                                                            '"Inter", sans-serif',
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
                                                          fontFamily:
                                                            '"Orbitron", sans-serif',
                                                          textShadow:
                                                            '0 0 10px rgba(56, 189, 248, 0.4)',
                                                        }
                                                      : {
                                                          color: '#0284C7',
                                                          fontFamily:
                                                            '"Inter", sans-serif',
                                                        }
                                                  return {
                                                    formatted,
                                                    element: (0,
                                                    jsx_runtime.jsxs)('div', {
                                                      style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                      },
                                                      children: [
                                                        (0, jsx_runtime.jsx)(
                                                          'span',
                                                          {
                                                            style: {
                                                              fontSize:
                                                                '0.8rem',
                                                              opacity: 0.7,
                                                              color: sacredtheme
                                                                ? '#38BDF8'
                                                                : '#3B82F6',
                                                            },
                                                            children: '⑆',
                                                          }
                                                        ),
                                                        (0, jsx_runtime.jsx)(
                                                          'span',
                                                          {
                                                            style: {
                                                              ...themeStyle,
                                                              fontWeight: 500,
                                                              fontSize:
                                                                '0.9rem',
                                                              letterSpacing:
                                                                '0.075em',
                                                              transition:
                                                                'letter-spacing 0.3s ease',
                                                            },
                                                            onMouseEnter: e =>
                                                              (e.currentTarget.style.letterSpacing =
                                                                '0.1em'),
                                                            onMouseLeave: e =>
                                                              (e.currentTarget.style.letterSpacing =
                                                                '0.075em'),
                                                            children: formatted,
                                                          }
                                                        ),
                                                      ],
                                                    }),
                                                  }
                                                })(value, isSacredTheme).element
                                              : safeString(value)),
                              (0, jsx_runtime.jsx)(
                                'td',
                                {
                                  style: computedStyles.table.tableCell,
                                  onClick: e => {
                                    !isEditing &&
                                      selectedRowIds.includes(rowId) &&
                                      (e.stopPropagation(),
                                      null == onCellClick ||
                                        onCellClick(rowId, col.field, value))
                                  },
                                  children: (0, jsx_runtime.jsx)(Tooltip.A, {
                                    title: safeString(row[col.field]),
                                    sacredtheme: isSacredTheme,
                                    children: (0, jsx_runtime.jsx)('div', {
                                      style: {
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        color:
                                          computedStyles.table.tableCell.color,
                                      },
                                      children: cellContent,
                                    }),
                                  }),
                                },
                                col.field
                              )
                            )
                          }),
                        ],
                      },
                      rowId
                    )
                  }),
                })
              : (0, jsx_runtime.jsx)('tbody', {
                  children: (0, jsx_runtime.jsxs)('tr', {
                    style: computedStyles.table.tableRow,
                    children: [
                      (0, jsx_runtime.jsx)('td', {
                        style: {
                          ...computedStyles.table.tableCell,
                          width: '48px',
                          minWidth: '48px',
                          maxWidth: '48px',
                          padding: '0',
                          border: 'none',
                        },
                      }),
                      (0, jsx_runtime.jsx)('td', {
                        colSpan: 100,
                        style: {
                          ...computedStyles.table.tableCell,
                          textAlign: 'center',
                          padding: '3rem',
                          color: computedStyles.table.tableCell.color,
                          fontStyle: 'italic',
                          opacity: 0.6,
                        },
                        children: 'No data to display.',
                      }),
                    ],
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
            columns: {
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
            styles: {
              required: !1,
              tsType: { name: 'DataGridStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
            editingCell: {
              required: !1,
              tsType: {
                name: 'union',
                raw: '{ rowId: string; field: string } | null',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{ rowId: string; field: string }',
                    signature: {
                      properties: [
                        {
                          key: 'rowId',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'field',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                  { name: 'null' },
                ],
              },
              description: '',
            },
            editingValue: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            onCellClick: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(rowId: string, field: string, currentValue: unknown) => void',
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'rowId' },
                    { type: { name: 'string' }, name: 'field' },
                    { type: { name: 'unknown' }, name: 'currentValue' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onCellSave: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(rowId: string, field: string, value: string) => void',
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'rowId' },
                    { type: { name: 'string' }, name: 'field' },
                    { type: { name: 'string' }, name: 'value' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onCellCancel: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onEditingValueChange: {
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
              description: '',
            },
          },
        }
        var datagrid = __webpack_require__('./src/theme/datagrid.ts')
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
          onColumnResize,
          styles,
          editingCell,
          editingValue,
          onCellClick,
          onCellSave,
          onCellCancel,
          onEditingValueChange,
          onColumnSort,
          onManageColumns,
          draggedColumn,
          onColumnDragStart,
          onColumnDragOver,
          onColumnDrop,
          onColumnDragEnd,
        }) {
          const computedStyles = (0, src_theme.fN)(styles),
            theme = (null == styles ? void 0 : styles.theme) || 'light',
            themeConfig = (0, datagrid.m8)(styles),
            {
              updatedColumns,
              isResizing,
              resizingColumn,
              getResizeHandleProps,
            } = (function useColumnResize({ columns, onColumnResize }) {
              const [isResizing, setIsResizing] = (0, react.useState)(!1),
                [resizingColumn, setResizingColumn] = (0, react.useState)(null),
                [startX, setStartX] = (0, react.useState)(0),
                [startWidth, setStartWidth] = (0, react.useState)(0),
                [updatedColumns, setUpdatedColumns] = (0, react.useState)(
                  columns
                ),
                [tempWidth, setTempWidth] = (0, react.useState)(null),
                resizingElementRef = (0, react.useRef)(null)
              ;(0, react.useEffect)(() => {
                setUpdatedColumns(columns)
              }, [columns])
              const handleMouseDown = (0, react.useCallback)(
                  (e, columnField) => {
                    ;(e.preventDefault(), e.stopPropagation())
                    const column = updatedColumns.find(
                      col => col.field === columnField
                    )
                    if (!column) return
                    const headerElement = e.target.closest('th')
                    ;((resizingElementRef.current = headerElement),
                      setIsResizing(!0),
                      setResizingColumn(columnField),
                      setStartX(e.clientX),
                      setStartWidth(
                        column.computedWidth || column.width || 200
                      ))
                  },
                  [updatedColumns]
                ),
                handleMouseMove = (0, react.useCallback)(
                  e => {
                    if (!isResizing || !resizingColumn) return
                    const deltaX = e.clientX - startX,
                      newWidth = Math.max(50, startWidth + deltaX)
                    ;(setTempWidth(newWidth),
                      resizingElementRef.current &&
                        ((resizingElementRef.current.style.width = `${newWidth}px`),
                        (resizingElementRef.current.style.minWidth = `${newWidth}px`),
                        (resizingElementRef.current.style.maxWidth = `${newWidth}px`)),
                      setUpdatedColumns(prev =>
                        prev.map(col =>
                          col.field === resizingColumn
                            ? {
                                ...col,
                                computedWidth: newWidth,
                                width: newWidth,
                              }
                            : col
                        )
                      ))
                  },
                  [isResizing, resizingColumn, startX, startWidth]
                ),
                handleMouseUp = (0, react.useCallback)(() => {
                  isResizing &&
                    resizingColumn &&
                    (onColumnResize &&
                      onColumnResize(resizingColumn, tempWidth || startWidth),
                    setIsResizing(!1),
                    setResizingColumn(null),
                    setStartX(0),
                    setStartWidth(0),
                    setTempWidth(null),
                    (resizingElementRef.current = null))
                }, [
                  isResizing,
                  resizingColumn,
                  tempWidth,
                  startWidth,
                  onColumnResize,
                ])
              ;(0, react.useEffect)(
                () => (
                  isResizing &&
                    (document.addEventListener('mousemove', handleMouseMove),
                    document.addEventListener('mouseup', handleMouseUp),
                    (document.body.style.cursor = 'col-resize'),
                    (document.body.style.userSelect = 'none')),
                  () => {
                    ;(document.removeEventListener(
                      'mousemove',
                      handleMouseMove
                    ),
                      document.removeEventListener('mouseup', handleMouseUp),
                      (document.body.style.cursor = ''),
                      (document.body.style.userSelect = ''))
                  }
                ),
                [isResizing, handleMouseMove, handleMouseUp]
              )
              const getResizeHandleProps = (0, react.useCallback)(
                columnField => ({
                  onMouseDown: e => handleMouseDown(e, columnField),
                  style: {
                    position: 'absolute',
                    right: '-4px',
                    top: '0',
                    width: '8px',
                    height: '100%',
                    cursor: 'col-resize',
                    backgroundColor: 'transparent',
                    zIndex: 10,
                    borderRight: '2px solid transparent',
                    transition: isResizing ? 'none' : 'all 0.2s ease',
                  },
                }),
                [handleMouseDown, isResizing]
              )
              return {
                updatedColumns,
                isResizing,
                resizingColumn,
                getResizeHandleProps,
              }
            })({ columns, onColumnResize }),
            scrollbarStyles = ((theme, scrollbarConfig) => {
              const scrollbarClass = `datagrid-scrollbar-${theme}`
              return {
                css: `\n    .${scrollbarClass}::-webkit-scrollbar {\n      height: ${scrollbarConfig.height};\n      width: ${scrollbarConfig.width};\n    }\n    \n    .${scrollbarClass}::-webkit-scrollbar-track {\n      background-color: ${scrollbarConfig.track.backgroundColor};\n      border-radius: ${scrollbarConfig.track.borderRadius};\n    }\n    \n    .${scrollbarClass}::-webkit-scrollbar-thumb {\n      background-color: ${scrollbarConfig.thumb.backgroundColor};\n      border-radius: ${scrollbarConfig.thumb.borderRadius};\n      ${scrollbarConfig.thumb.border ? `border: ${scrollbarConfig.thumb.border};` : ''}\n    }\n    \n    .${scrollbarClass}::-webkit-scrollbar-thumb:hover {\n      background-color: ${scrollbarConfig.thumbHover.backgroundColor};\n    }\n    \n    /* Firefox scrollbar styles */\n    .${scrollbarClass} {\n      scrollbar-width: thin;\n      scrollbar-color: ${scrollbarConfig.thumb.backgroundColor} ${scrollbarConfig.track.backgroundColor};\n    }\n  `,
                className: scrollbarClass,
              }
            })(theme, themeConfig.scrollbar)
          ;(0, react.useEffect)(() => {
            const styleId = `datagrid-scrollbar-${theme}`
            let styleElement = document.getElementById(styleId)
            return (
              styleElement ||
                ((styleElement = document.createElement('style')),
                (styleElement.id = styleId),
                document.head.appendChild(styleElement)),
              (styleElement.textContent = scrollbarStyles.css),
              () => {
                const element = document.getElementById(styleId)
                element && element.remove()
              }
            )
          }, [theme, scrollbarStyles.css])
          const tableContainerStyle = {
              ...computedStyles.table.tableContainer,
              overflowX: 'auto',
              width: '100%',
            },
            tableWrapperStyle = {
              ...computedStyles.table.tableWrapper,
              overflowX: 'auto',
              width: '100%',
            },
            tableStyle = {
              ...computedStyles.table.table,
              width: 'max-content',
              minWidth: '100%',
            }
          return (0, jsx_runtime.jsx)('div', {
            style: tableContainerStyle,
            children: (0, jsx_runtime.jsx)('div', {
              style: tableWrapperStyle,
              className: scrollbarStyles.className,
              children: (0, jsx_runtime.jsxs)('table', {
                style: tableStyle,
                children: [
                  (0, jsx_runtime.jsx)('thead', {
                    children: (0, jsx_runtime.jsx)(Table_ColumnHeaderRow, {
                      allRowsSelected,
                      someRowsSelected,
                      handleHeaderCheckboxChange: onHeaderCheckboxChange,
                      columns: updatedColumns,
                      getResizeHandleProps,
                      isResizing,
                      resizingColumn,
                      styles,
                      onColumnSort,
                      onManageColumns,
                      draggedColumn,
                      onColumnDragStart,
                      onColumnDragOver,
                      onColumnDrop,
                      onColumnDragEnd,
                    }),
                  }),
                  (0, jsx_runtime.jsx)(Table_Rows, {
                    rows,
                    columns: updatedColumns,
                    selectedRowIds,
                    onRowClick,
                    styles,
                    editingCell,
                    editingValue,
                    onCellClick,
                    onCellSave,
                    onCellCancel,
                    onEditingValueChange,
                  }),
                ],
              }),
            }),
          })
        }
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
            onColumnResize: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(columnField: string, newWidth: number) => void',
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'columnField' },
                    { type: { name: 'number' }, name: 'newWidth' },
                  ],
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
            editingCell: {
              required: !1,
              tsType: {
                name: 'union',
                raw: '{ rowId: string; field: string } | null',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: '{ rowId: string; field: string }',
                    signature: {
                      properties: [
                        {
                          key: 'rowId',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'field',
                          value: { name: 'string', required: !0 },
                        },
                      ],
                    },
                  },
                  { name: 'null' },
                ],
              },
              description: '',
            },
            editingValue: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            onCellClick: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(rowId: string, field: string, currentValue: unknown) => void',
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'rowId' },
                    { type: { name: 'string' }, name: 'field' },
                    { type: { name: 'unknown' }, name: 'currentValue' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onCellSave: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(rowId: string, field: string, value: string) => void',
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'rowId' },
                    { type: { name: 'string' }, name: 'field' },
                    { type: { name: 'string' }, name: 'value' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onCellCancel: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            onEditingValueChange: {
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
              description: '',
            },
            onColumnSort: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: "(field: string, direction: 'asc' | 'desc') => void",
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'field' },
                    {
                      type: {
                        name: 'union',
                        raw: "'asc' | 'desc'",
                        elements: [
                          { name: 'literal', value: "'asc'" },
                          { name: 'literal', value: "'desc'" },
                        ],
                      },
                      name: 'direction',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onManageColumns: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            draggedColumn: {
              required: !1,
              tsType: {
                name: 'union',
                raw: 'string | null',
                elements: [{ name: 'string' }, { name: 'null' }],
              },
              description: '',
            },
            onColumnDragStart: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(field: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'field' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onColumnDragOver: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(e: React.DragEvent) => void',
                signature: {
                  arguments: [
                    {
                      type: { name: 'ReactDragEvent', raw: 'React.DragEvent' },
                      name: 'e',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onColumnDrop: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(targetField: string) => void',
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'targetField' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onColumnDragEnd: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
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
        const PageSizeSelector = ({ pageSize, onPageSizeChange, styles }) => {
            const isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              dropdownStyles = (dataGridStyles => {
                switch (
                  (null == dataGridStyles ? void 0 : dataGridStyles.theme) ||
                  'light'
                ) {
                  case 'dark':
                    return {
                      theme: 'dark',
                      backgroundColor: '#1E293B',
                      borderColor: '#334155',
                      borderFocusedColor: '#475569',
                      textColor: '#E2E8F0',
                      labelColor: '#E2E8F0',
                      labelFocusedColor: '#F1F5F9',
                      adornmentColor: '#9CA3AF',
                      adornmentFocusedColor: '#E2E8F0',
                      borderRadius: '6px',
                      height: '32px',
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif',
                    }
                  case 'sacred':
                    return {
                      theme: 'sacred',
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      borderColor: 'rgba(255, 215, 0, 0.5)',
                      borderFocusedColor: 'rgba(255, 215, 0, 0.8)',
                      textColor: '#FBBF24',
                      labelColor: '#FBBF24',
                      labelFocusedColor: '#FFD700',
                      adornmentColor: 'rgba(255, 215, 0, 0.6)',
                      adornmentFocusedColor: '#FFD700',
                      borderRadius: '6px',
                      height: '32px',
                      fontSize: '14px',
                      fontFamily: 'Cinzel, serif',
                    }
                  default:
                    return {
                      theme: 'light',
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E2E8F0',
                      borderFocusedColor: '#94A3B8',
                      textColor: '#374151',
                      labelColor: '#374151',
                      labelFocusedColor: '#1F2937',
                      adornmentColor: '#6B7280',
                      adornmentFocusedColor: '#374151',
                      borderRadius: '6px',
                      height: '32px',
                      fontSize: '14px',
                      fontFamily: 'Inter, sans-serif',
                    }
                }
              })(styles),
              containerStyle = {
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.9)'
                  : 'rgba(55, 65, 81, 1)',
                fontFamily: isSacredTheme ? '"Cinzel", serif' : 'inherit',
              },
              selectedValue = String(pageSize)
            return (0, jsx_runtime.jsxs)('div', {
              style: containerStyle,
              children: [
                (0, jsx_runtime.jsx)('span', {
                  style: { whiteSpace: 'nowrap' },
                  children: 'Show:',
                }),
                (0, jsx_runtime.jsx)('div', {
                  style: { minWidth: '70px', marginTop: '-15px' },
                  children: (0, jsx_runtime.jsx)(Regular.A, {
                    label: '',
                    value: selectedValue,
                    onChange: event => {
                      const newPageSize = parseInt(event.target.value, 10)
                      isNaN(newPageSize) || onPageSizeChange(newPageSize)
                    },
                    options: [
                      { value: 5, label: '5' },
                      { value: 10, label: '10' },
                      { value: 25, label: '25' },
                      { value: 50, label: '50' },
                      { value: 100, label: '100' },
                    ],
                    styles: dropdownStyles,
                  }),
                }),
              ],
            })
          },
          TablePagination = ({
            page,
            pageSize,
            rowCount,
            onPageChange,
            onPageSizeChange,
            styles,
          }) => {
            const totalPages = Math.ceil(rowCount / pageSize),
              from = 0 === rowCount ? 0 : page * pageSize + 1,
              to = Math.min(rowCount, (page + 1) * pageSize),
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              isDarkTheme = 'dark' === (null == styles ? void 0 : styles.theme),
              paginationTextStyle = {
                fontSize: '14px',
                fontWeight: '500',
                color: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.9)'
                  : isDarkTheme
                    ? '#E2E8F0'
                    : '#374151',
                fontFamily: isSacredTheme
                  ? '"Cinzel", serif'
                  : '"Inter", sans-serif',
                minWidth: '80px',
                textAlign: 'center',
                padding: '0 8px',
              },
              PaginationButton = ({
                onClick,
                disabled,
                children,
                'aria-label': ariaLabel,
              }) => {
                const [isHovered, setIsHovered] = react.useState(!1),
                  buttonStyle = (disabled => {
                    const baseStyle = {
                      padding: '8px',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease-in-out',
                      border: 'none',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      fontSize: '16px',
                    }
                    return disabled
                      ? {
                          ...baseStyle,
                          backgroundColor: 'transparent',
                          color: isSacredTheme
                            ? 'rgba(255, 215, 0, 0.3)'
                            : isDarkTheme
                              ? 'rgba(156, 163, 175, 0.3)'
                              : 'rgba(107, 114, 128, 0.3)',
                          opacity: 0.5,
                        }
                      : isSacredTheme
                        ? {
                            ...baseStyle,
                            backgroundColor: 'rgba(255, 215, 0, 0.1)',
                            color: '#FFD700',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            backdropFilter: 'blur(4px)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 215, 0, 0.2)',
                              borderColor: 'rgba(255, 215, 0, 0.6)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 4px 8px rgba(255, 215, 0, 0.2)',
                            },
                          }
                        : isDarkTheme
                          ? {
                              ...baseStyle,
                              backgroundColor: '#334155',
                              color: '#E2E8F0',
                              border: '1px solid #475569',
                              '&:hover': {
                                backgroundColor: '#475569',
                                borderColor: '#64748B',
                                transform: 'translateY(-1px)',
                              },
                            }
                          : {
                              ...baseStyle,
                              backgroundColor: '#F8FAFC',
                              color: '#374151',
                              border: '1px solid #E2E8F0',
                              '&:hover': {
                                backgroundColor: '#F1F5F9',
                                borderColor: '#CBD5E1',
                                transform: 'translateY(-1px)',
                              },
                            }
                  })(disabled)
                return (0, jsx_runtime.jsx)('button', {
                  onClick,
                  disabled,
                  'aria-label': ariaLabel,
                  style: {
                    ...buttonStyle,
                    ...(isHovered &&
                      !disabled && {
                        transform: 'translateY(-1px)',
                        boxShadow: isSacredTheme
                          ? '0 4px 8px rgba(255, 215, 0, 0.2)'
                          : isDarkTheme
                            ? '0 4px 8px rgba(0, 0, 0, 0.3)'
                            : '0 4px 8px rgba(0, 0, 0, 0.1)',
                      }),
                  },
                  onMouseEnter: () => setIsHovered(!0),
                  onMouseLeave: () => setIsHovered(!1),
                  children,
                })
              }
            return (0, jsx_runtime.jsxs)('div', {
              style: { display: 'flex', alignItems: 'center', gap: '8px' },
              children: [
                (0, jsx_runtime.jsx)(PageSizeSelector, {
                  pageSize,
                  onPageSizeChange,
                  styles,
                }),
                (0, jsx_runtime.jsx)(PaginationButton, {
                  onClick: () => onPageChange(0),
                  disabled: 0 === page,
                  'aria-label': 'Go to first page',
                  children: (0, jsx_runtime.jsx)(LastPage.A, {}),
                }),
                (0, jsx_runtime.jsx)(PaginationButton, {
                  onClick: () => onPageChange(page - 1),
                  disabled: 0 === page,
                  'aria-label': 'Go to previous page',
                  children: (0, jsx_runtime.jsx)(KeyboardArrowLeft.A, {}),
                }),
                (0, jsx_runtime.jsxs)('div', {
                  style: paginationTextStyle,
                  children: [from, '-', to, ' of ', rowCount],
                }),
                (0, jsx_runtime.jsx)(PaginationButton, {
                  onClick: () => onPageChange(page + 1),
                  disabled: page >= totalPages - 1,
                  'aria-label': 'Go to next page',
                  children: (0, jsx_runtime.jsx)(KeyboardArrowRight.A, {}),
                }),
                (0, jsx_runtime.jsx)(PaginationButton, {
                  onClick: () => onPageChange(totalPages - 1),
                  disabled: page >= totalPages - 1,
                  'aria-label': 'Go to last page',
                  children: (0, jsx_runtime.jsx)(FirstPage.A, {}),
                }),
              ],
            })
          }
        function CustomFooter({
          page,
          pageSize,
          rowCount,
          onPageChange,
          onPageSizeChange,
          columns: _columns,
          styles,
        }) {
          const containerStyle = {
            width: '100%',
            minWidth: '100%',
            height: '56px',
            position: 'sticky',
            left: 0,
            ...('sacred' === (null == styles ? void 0 : styles.theme) && {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderTop: '2px solid rgba(255, 215, 0, 0.3)',
              backdropFilter: 'blur(8px)',
            }),
          }
          return (0, jsx_runtime.jsx)('div', {
            style: containerStyle,
            children: (0, jsx_runtime.jsxs)('div', {
              style: {
                display: 'flex',
                flexWrap: 'nowrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                padding: '0 1rem',
                overflow: 'hidden',
              },
              children: [
                (0, jsx_runtime.jsx)('div', {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                  },
                }),
                (0, jsx_runtime.jsx)('div', {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'center',
                    flex: '1',
                    maxWidth: '300px',
                  },
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
                    onPageSizeChange,
                    styles,
                  }),
                }),
              ],
            }),
          })
        }
        const Footer = CustomFooter
        CustomFooter.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'CustomFooter',
          props: {
            page: { required: !0, tsType: { name: 'number' }, description: '' },
            pageSize: {
              required: !0,
              tsType: { name: 'number' },
              description: '',
            },
            rowCount: {
              required: !0,
              tsType: { name: 'number' },
              description: '',
            },
            onPageChange: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(newPage: number) => void',
                signature: {
                  arguments: [{ type: { name: 'number' }, name: 'newPage' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onPageSizeChange: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(newPageSize: number) => void',
                signature: {
                  arguments: [
                    { type: { name: 'number' }, name: 'newPageSize' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
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
          },
        }
        var Searchable = __webpack_require__(
            './src/components/Field/Dropdown/Searchable/index.tsx'
          ),
          DateField = __webpack_require__(
            './src/components/Field/Date/DateField/index.tsx'
          ),
          DateRange = __webpack_require__(
            './src/components/Field/Date/DateRange/index.tsx'
          ),
          Search = __webpack_require__(
            './src/components/Field/Search/index.tsx'
          )
        const FilterSection = ({
            filters,
            columns = [],
            rows = [],
            onSearchFilter,
            styles,
          }) => {
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
              [searchTerm, setSearchTerm] = (0, react.useState)(''),
              isMobile = width < 600,
              isTablet = width < 900,
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              toLowerCaseString = value => {
                if (null == value) return ''
                if ('object' == typeof value)
                  try {
                    return JSON.stringify(value).toLowerCase()
                  } catch (e) {
                    return ''
                  }
                return 'string' == typeof value ||
                  'number' == typeof value ||
                  'boolean' == typeof value
                  ? String(value).toLowerCase()
                  : ''
              }
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
              !filters && !columns.length)
            )
              return null
            const renderFilterComponent = filter =>
                'daterange' === filter.type
                  ? (0, jsx_runtime.jsx)('div', {
                      style: {
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                      },
                      children: (0, jsx_runtime.jsx)(DateRange.A, {
                        startLabel: 'From Date',
                        endLabel: 'To Date',
                        value: filter.value,
                        onChange: filter.onChange,
                        styles: { theme: isSacredTheme ? 'sacred' : 'light' },
                      }),
                    })
                  : 'date' === filter.type
                    ? (0, jsx_runtime.jsx)('div', {
                        style: {
                          width: '100%',
                          maxWidth: '100%',
                          boxSizing: 'border-box',
                        },
                        children: (0, jsx_runtime.jsx)(DateField.A, {
                          label: filter.label,
                          value: filter.value ? new Date(filter.value) : null,
                          onChange: filter.onChange,
                          placeholder: filter.placeholder,
                          styles: { theme: isSacredTheme ? 'sacred' : 'light' },
                          disableFutureDateValidation: !0,
                        }),
                      })
                    : (0, jsx_runtime.jsx)('div', {
                        style: {
                          width: '100%',
                          maxWidth: '100%',
                          boxSizing: 'border-box',
                        },
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
                maxWidth: '100%',
                position: 'relative',
                padding: '1rem',
                boxSizing: 'border-box',
                overflow: 'hidden',
                ...(isSacredTheme && {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  backgroundImage:
                    'linear-gradient(135deg, rgba(255, 215, 0, 0.02) 0%, transparent 50%, transparent 100%)',
                }),
              },
              gridStyle = {
                display: 'grid',
                gap: '8px',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                ...(() => {
                  const totalItems = filters.length + 1,
                    hasDateRange = filters.some(f => 'daterange' === f.type)
                  return isMobile
                    ? { gridTemplateColumns: '1fr' }
                    : isTablet
                      ? totalItems <= 2
                        ? { gridTemplateColumns: '1fr' }
                        : { gridTemplateColumns: 'repeat(2, 1fr)' }
                      : 1 === totalItems
                        ? { gridTemplateColumns: '1fr' }
                        : 2 === totalItems || 3 === totalItems || hasDateRange
                          ? { gridTemplateColumns: 'repeat(2, 1fr)' }
                          : { gridTemplateColumns: 'repeat(3, 1fr)' }
                })(),
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
                        children: [src_theme.vR[15], ' '],
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
                        children: [src_theme.vR[16], ' '],
                      }),
                    ],
                  }),
                (0, jsx_runtime.jsxs)('div', {
                  style: gridStyle,
                  children: [
                    (0, jsx_runtime.jsx)('div', {
                      style: {
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                      },
                      children: (0, jsx_runtime.jsx)(Search.A, {
                        label: 'Search',
                        placeholder: 'Search data...',
                        value: searchTerm,
                        onChange: e => {
                          const newSearchTerm = e.target.value
                          if ((setSearchTerm(newSearchTerm), onSearchFilter)) {
                            const filteredRows = (searchValue => {
                                if (!searchValue.trim() || !rows.length)
                                  return rows
                                const searchTerms = searchValue
                                    .toLowerCase()
                                    .trim()
                                    .split(' '),
                                  columnHeaderTerms = [],
                                  contentTerms = []
                                return (
                                  searchTerms.forEach(term => {
                                    columns.some(column => {
                                      var _column_headerName
                                      const headerMatch =
                                          null ===
                                            (_column_headerName =
                                              column.headerName) ||
                                          void 0 === _column_headerName
                                            ? void 0
                                            : _column_headerName
                                                .toLowerCase()
                                                .includes(term),
                                        fieldMatch = column.field
                                          .toLowerCase()
                                          .includes(term)
                                      return headerMatch || fieldMatch
                                    })
                                      ? columnHeaderTerms.push(term)
                                      : contentTerms.push(term)
                                  }),
                                  columnHeaderTerms.length > 0 &&
                                  0 === contentTerms.length
                                    ? rows
                                    : contentTerms.length > 0
                                      ? rows.filter(row =>
                                          contentTerms.some(term =>
                                            columns.some(column =>
                                              toLowerCaseString(
                                                row[column.field]
                                              ).includes(term)
                                            )
                                          )
                                        )
                                      : rows
                                )
                              })(newSearchTerm),
                              visibleColumns = (searchValue => {
                                if (!searchValue.trim() || !columns.length)
                                  return columns.map(col => col.field)
                                const searchTerms = searchValue
                                  .toLowerCase()
                                  .trim()
                                  .split(' ')
                                return columns
                                  .filter(col =>
                                    searchTerms.some(term => {
                                      var _col_headerName
                                      const headerMatch =
                                          null ===
                                            (_col_headerName =
                                              col.headerName) ||
                                          void 0 === _col_headerName
                                            ? void 0
                                            : _col_headerName
                                                .toLowerCase()
                                                .includes(term),
                                        fieldMatch = col.field
                                          .toLowerCase()
                                          .includes(term),
                                        hasMatchingData = rows.some(row =>
                                          toLowerCaseString(
                                            row[col.field]
                                          ).includes(term)
                                        )
                                      return (
                                        headerMatch ||
                                        fieldMatch ||
                                        hasMatchingData
                                      )
                                    })
                                  )
                                  .map(col => col.field)
                              })(newSearchTerm)
                            onSearchFilter(
                              newSearchTerm,
                              filteredRows,
                              visibleColumns
                            )
                          }
                        },
                        styles: { theme: isSacredTheme ? 'sacred' : 'light' },
                      }),
                    }),
                    filters.map((filter, index) =>
                      (0, jsx_runtime.jsx)(
                        'div',
                        {
                          style: {
                            width: '100%',
                            maxWidth: '100%',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            ...('daterange' !== filter.type || isMobile
                              ? {}
                              : { gridColumn: 'span 2' }),
                          },
                          children: renderFilterComponent(filter),
                        },
                        `${filter.label}-${index}`
                      )
                    ),
                  ],
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
                    children: [
                      src_theme.vR[4],
                      src_theme.vR[5],
                      src_theme.vR[4],
                    ].map((glyph, i) =>
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
            columns: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [{ name: 'ColumnDef' }],
                raw: 'ColumnDef[]',
              },
              description: '',
              defaultValue: { value: '[]', computed: !1 },
            },
            rows: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [{ name: 'RowData' }],
                raw: 'RowData[]',
              },
              description: '',
              defaultValue: { value: '[]', computed: !1 },
            },
            onSearchFilter: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(\n  searchTerm: string,\n  filteredRows: RowData[],\n  visibleColumns: string[]\n) => void',
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'searchTerm' },
                    {
                      type: {
                        name: 'Array',
                        elements: [{ name: 'RowData' }],
                        raw: 'RowData[]',
                      },
                      name: 'filteredRows',
                    },
                    {
                      type: {
                        name: 'Array',
                        elements: [{ name: 'string' }],
                        raw: 'string[]',
                      },
                      name: 'visibleColumns',
                    },
                  ],
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
          egyptianStyles_goldColor = '#FFD700',
          egyptianStyles_cardBackground = 'rgba(0, 0, 0, 0.85)'
        if ('undefined' != typeof document) {
          const style = document.createElement('style')
          ;((style.textContent =
            '\n@keyframes rotateGlyph {\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n}\n\n@keyframes sacredGlow {\n  0% { \n    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);\n    border-color: rgba(255, 215, 0, 0.5);\n  }\n  50% { \n    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);\n    border-color: rgba(255, 215, 0, 0.8);\n  }\n  100% { \n    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);\n    border-color: rgba(255, 215, 0, 0.5);\n  }\n}\n\n@keyframes floatAnimation {\n  0% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }\n  33% { transform: translateY(-3px) rotate(120deg); opacity: 0.6; }\n  66% { transform: translateY(1px) rotate(240deg); opacity: 0.4; }\n  100% { transform: translateY(0px) rotate(360deg); opacity: 0.3; }\n}\n\n@keyframes sacredShimmer {\n  0% { background-position: -200% center; }\n  100% { background-position: 200% center; }\n}\n\n@keyframes dataStreamAnimation {\n  0% { \n    transform: translateY(-100%);\n    opacity: 0;\n  }\n  50% { \n    opacity: 0.3;\n  }\n  100% { \n    transform: translateY(100%);\n    opacity: 0;\n  }\n}\n\n@keyframes standardHover {\n  0% { transform: translateY(0px); }\n  100% { transform: translateY(-4px); }\n}\n\n@keyframes sacredHover {\n  0% { transform: translateY(0px) scale(1); }\n  100% { transform: translateY(-8px) scale(1.02); }\n}\n'),
            document.head.querySelector('style[data-metric-card]') ||
              (style.setAttribute('data-metric-card', 'true'),
              document.head.appendChild(style)))
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
          const [isHovered, setIsHovered] = (0, react.useState)(!1),
            isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            selectedGlyph =
              glyph ||
              SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)],
            cardColor = ((colorName = 'primary') => {
              if (isSacredTheme)
                switch (colorName) {
                  case 'success':
                    return '#10B981'
                  case 'warning':
                    return '#F59E0B'
                  case 'error':
                    return '#EF4444'
                  case 'info':
                    return '#3B82F6'
                  case 'secondary':
                    return '#8B5CF6'
                  default:
                    return egyptianStyles_goldColor
                }
              else
                switch (colorName) {
                  case 'success':
                    return '#4caf50'
                  case 'warning':
                    return '#ff9800'
                  case 'error':
                    return '#f44336'
                  case 'info':
                    return '#2196f3'
                  case 'secondary':
                    return '#9c27b0'
                  default:
                    return '#1976d2'
                }
            })('primary'),
            rgb = (hex => {
              const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
                hex
              )
              return result
                ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16),
                  }
                : { r: 0, g: 0, b: 0 }
            })(cardColor),
            rgbaColor = alpha => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
          if (!isSacredTheme) {
            const standardCardStyle = {
                height: '100%',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: `2px solid ${rgbaColor(0.2)}`,
                borderRadius: '12px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                ...(isHovered && {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 10px 25px ${rgbaColor(0.2)}`,
                  borderColor: rgbaColor(0.4),
                }),
              },
              standardContentStyle = {
                padding: '24px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              },
              standardHeaderStyle = {
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '16px',
              },
              standardIconStyle = {
                marginRight: '16px',
                color: cardColor,
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: rgbaColor(0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
              standardTitleStyle = {
                color: '#6B7280',
                fontWeight: 600,
                letterSpacing: '0.5px',
                fontSize: '16px',
                lineHeight: '1.2',
                margin: 0,
              },
              standardValueStyle = {
                color: cardColor,
                fontWeight: 700,
                fontSize: '48px',
                lineHeight: '1.1',
                fontFamily: '"Inter", sans-serif',
                margin: '0 0 8px 0',
              },
              standardSubtitleStyle = {
                fontSize: '14px',
                color: '#6B7280',
                margin: '0 0 8px 0',
                lineHeight: '1.3',
              },
              standardTrendStyle = {
                fontSize: '14px',
                color: (null == trend ? void 0 : trend.isPositive)
                  ? '#10B981'
                  : '#EF4444',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: 'auto',
              }
            return (0, jsx_runtime.jsx)('div', {
              style: standardCardStyle,
              onMouseEnter: () => setIsHovered(!0),
              onMouseLeave: () => setIsHovered(!1),
              children: (0, jsx_runtime.jsxs)('div', {
                style: standardContentStyle,
                children: [
                  (0, jsx_runtime.jsxs)('div', {
                    style: standardHeaderStyle,
                    children: [
                      icon &&
                        (0, jsx_runtime.jsx)('div', {
                          style: standardIconStyle,
                          children: icon,
                        }),
                      (0, jsx_runtime.jsx)('h3', {
                        style: standardTitleStyle,
                        children: title,
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsx)('div', {
                    style: standardValueStyle,
                    children: value,
                  }),
                  subtitle &&
                    (0, jsx_runtime.jsx)('div', {
                      style: standardSubtitleStyle,
                      children: subtitle,
                    }),
                  trend &&
                    (0, jsx_runtime.jsxs)('div', {
                      style: standardTrendStyle,
                      children: [
                        (0, jsx_runtime.jsx)('span', {
                          style: { fontSize: '16px' },
                          children: trend.isPositive ? '↗' : '↘',
                        }),
                        Math.abs(trend.value),
                        '%',
                      ],
                    }),
                ],
              }),
            })
          }
          const sacredCardStyle = {
              height: '100%',
              background: `linear-gradient(135deg, ${egyptianStyles_cardBackground} 0%, rgba(22, 33, 62, 0.95) 100%)`,
              border: `2px solid ${rgbaColor(0.5)}`,
              borderRadius: '12px',
              position: 'relative',
              overflow: 'hidden',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              animation: 'sacredGlow 4s ease-in-out infinite',
              cursor: 'pointer',
              ...(isHovered && {
                transform: 'translateY(-8px) scale(1.02)',
                borderColor: rgbaColor(0.8),
                boxShadow: `0 20px 40px rgba(0, 0, 0, 0.6), 0 0 40px ${rgbaColor(0.4)}, inset 0 0 20px ${rgbaColor(0.1)}`,
              }),
            },
            cosmicEnergyStyle = {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `conic-gradient(from 0deg at 50% 50%, ${rgbaColor(0.1)} 0deg, transparent 60deg, ${rgbaColor(0.05)} 120deg, transparent 180deg, ${rgbaColor(0.1)} 240deg, transparent 300deg, ${rgbaColor(0.05)} 360deg)`,
              opacity: 0.4,
              zIndex: 0,
              animation: 'rotateGlyph 60s linear infinite',
            },
            borderShimmerStyle = {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${cardColor}, transparent)`,
              backgroundSize: '200% 100%',
              animation: 'sacredShimmer 3s linear infinite',
              zIndex: 1,
            },
            sacredGlyphStyle = {
              position: 'absolute',
              top: '16px',
              right: '16px',
              color: rgbaColor(0.4),
              fontSize: '28px',
              animation: 'floatAnimation 8s ease-in-out infinite',
              zIndex: 2,
              transition: 'all 0.3s ease',
              textShadow: `0 0 10px ${rgbaColor(0.3)}`,
              ...(isHovered && { transform: 'scale(1.1) rotate(15deg)' }),
            },
            dataStreamAfterStyle = {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `linear-gradient(180deg, transparent, ${cardColor}, transparent)`,
              animation: 'dataStreamAnimation 6s linear infinite',
            },
            sacredIconStyle = {
              marginRight: '16px',
              color: cardColor,
              padding: '8px',
              borderRadius: '8px',
              backgroundColor: rgbaColor(0.15),
              border: `1px solid ${rgbaColor(0.3)}`,
              boxShadow: `0 0 10px ${rgbaColor(0.2)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            sacredTitleStyle = {
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 600,
              letterSpacing: '0.5px',
              fontFamily: '"Cinzel", serif',
              textShadow: `0 0 10px ${rgbaColor(0.3)}`,
              fontSize: '16px',
              lineHeight: '1.2',
              margin: 0,
              flex: 1,
            },
            sacredValueStyle = {
              color: cardColor,
              fontWeight: 700,
              fontSize: '48px',
              lineHeight: '1.1',
              margin: '0 0 8px 0',
              textShadow: `0 0 15px ${rgbaColor(0.5)}`,
              fontFamily: '"Cinzel", serif',
              letterSpacing: '0.02em',
            },
            sacredTrendStyle = {
              color: (null == trend ? void 0 : trend.isPositive)
                ? '#10B981'
                : '#EF4444',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: '"Crimson Text", serif',
              textShadow:
                '0 0 8px ' +
                ((null == trend ? void 0 : trend.isPositive)
                  ? 'rgba(16, 185, 129, 0.3)'
                  : 'rgba(239, 68, 68, 0.3)'),
              fontSize: '15px',
              marginTop: 'auto',
            },
            bottomShimmerStyle = {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${cardColor}, transparent)`,
              backgroundSize: '200% 100%',
              animation: 'sacredShimmer 3s linear infinite',
              animationDelay: '1.5s',
              opacity: 0.6,
            }
          return (0, jsx_runtime.jsxs)('div', {
            style: sacredCardStyle,
            onMouseEnter: () => setIsHovered(!0),
            onMouseLeave: () => setIsHovered(!1),
            children: [
              (0, jsx_runtime.jsx)('div', { style: cosmicEnergyStyle }),
              (0, jsx_runtime.jsx)('div', { style: borderShimmerStyle }),
              (0, jsx_runtime.jsx)('div', {
                style: sacredGlyphStyle,
                children: selectedGlyph,
              }),
              (0, jsx_runtime.jsx)('div', {
                style: {
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '2px',
                  height: '100%',
                  overflow: 'hidden',
                  zIndex: 1,
                },
                children: (0, jsx_runtime.jsx)('div', {
                  style: dataStreamAfterStyle,
                }),
              }),
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  position: 'relative',
                  zIndex: 3,
                  padding: '24px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                },
                children: [
                  (0, jsx_runtime.jsxs)('div', {
                    style: {
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                    },
                    children: [
                      icon &&
                        (0, jsx_runtime.jsx)('div', {
                          style: sacredIconStyle,
                          children: icon,
                        }),
                      (0, jsx_runtime.jsx)('h3', {
                        style: sacredTitleStyle,
                        children: title,
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsx)('div', {
                    style: sacredValueStyle,
                    children: value,
                  }),
                  subtitle &&
                    (0, jsx_runtime.jsx)('div', {
                      style: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: '0 0 8px 0',
                        fontFamily: '"Crimson Text", serif',
                        fontSize: '16px',
                        letterSpacing: '0.025em',
                        lineHeight: '1.3',
                      },
                      children: subtitle,
                    }),
                  trend &&
                    (0, jsx_runtime.jsxs)('div', {
                      style: sacredTrendStyle,
                      children: [
                        (0, jsx_runtime.jsx)('span', {
                          style: { fontSize: '17px' },
                          children: trend.isPositive ? '↗' : '↘',
                        }),
                        Math.abs(trend.value),
                        '%',
                      ],
                    }),
                ],
              }),
              (0, jsx_runtime.jsx)('div', { style: bottomShimmerStyle }),
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
            container: {
              width: '100%',
              maxWidth: '100%',
              marginBottom: '0',
              padding: '1rem',
              boxSizing: 'border-box',
              overflow: 'hidden',
            },
            flexContainer: {
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'flex-start',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
            },
            cardWrapper: {
              flex: '1 1 calc(100% - 0rem)',
              minWidth: '280px',
              maxWidth: '100%',
              '@media (min-width: 768px)': {
                flex: '1 1 calc(50% - 0.5rem)',
                maxWidth: 'calc(50% - 0.5rem)',
              },
              '@media (min-width: 1024px)': {
                flex: '1 1 calc(25% - 0.75rem)',
                maxWidth: 'calc(25% - 0.75rem)',
              },
            },
          },
          sacredStyles = {
            container: {
              width: '100%',
              maxWidth: '100%',
              marginBottom: '0',
              padding: '1rem',
              boxSizing: 'border-box',
              overflow: 'hidden',
            },
            flexContainer: {
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'flex-start',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box',
            },
            cardWrapper: {
              flex: '1 1 calc(100% - 0rem)',
              minWidth: '280px',
              maxWidth: '100%',
              '@media (min-width: 768px)': {
                flex: '1 1 calc(50% - 0.5rem)',
                maxWidth: 'calc(50% - 0.5rem)',
              },
              '@media (min-width: 1024px)': {
                flex: '1 1 calc(25% - 0.75rem)',
                maxWidth: 'calc(25% - 0.75rem)',
              },
            },
          },
          MetricSection = ({ metrics, styles }) => {
            const componentStyles =
              'sacred' === (null == styles ? void 0 : styles.theme)
                ? sacredStyles
                : premiumStyles
            return (0, jsx_runtime.jsx)('div', {
              style: componentStyles.container,
              children: (0, jsx_runtime.jsx)('div', {
                style: componentStyles.flexContainer,
                children: metrics.map((metric, index) =>
                  (0, jsx_runtime.jsx)(
                    'div',
                    {
                      style: {
                        flex: '1 1 0',
                        minWidth: '250px',
                        maxWidth: '350px',
                        boxSizing: 'border-box',
                      },
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
        const ManageColumnsSimple = ({
            open,
            onClose,
            columns,
            hiddenColumns,
            onColumnShow,
            onColumnHide,
            styles,
          }) => {
            const isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme)
            if (!open) return null
            const modalStyle = {
                backgroundColor: isSacredTheme
                  ? 'rgba(0, 0, 0, 0.95)'
                  : 'white',
                borderRadius: '12px',
                padding: '24px',
                minWidth: '400px',
                maxWidth: '500px',
                maxHeight: '80vh',
                overflow: 'auto',
                border: isSacredTheme
                  ? '2px solid #FFD700'
                  : '1px solid #E5E7EB',
                boxShadow: isSacredTheme
                  ? '0 20px 40px rgba(255, 215, 0, 0.3)'
                  : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              },
              titleStyle = {
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: isSacredTheme ? '#FFD700' : '#1F2937',
                textAlign: 'center',
                fontFamily: isSacredTheme ? 'Cinzel, serif' : 'inherit',
              },
              columnItemStyle = {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom:
                  '1px solid ' +
                  (isSacredTheme ? 'rgba(255, 215, 0, 0.2)' : '#F3F4F6'),
              },
              columnNameStyle = {
                fontSize: '14px',
                color: isSacredTheme ? '#FBBF24' : '#374151',
                fontFamily: isSacredTheme ? 'Cinzel, serif' : 'inherit',
              },
              buttonStyle = {
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.1)'
                  : '#F3F4F6',
                color: isSacredTheme ? '#FFD700' : '#374151',
                marginTop: '20px',
                width: '100%',
              }
            return (0, jsx_runtime.jsx)('div', {
              style: {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1e3,
              },
              onClick: onClose,
              children: (0, jsx_runtime.jsxs)('div', {
                style: modalStyle,
                onClick: e => e.stopPropagation(),
                children: [
                  (0, jsx_runtime.jsx)('h3', {
                    style: titleStyle,
                    children: isSacredTheme
                      ? 'Sacred Column Management'
                      : 'Manage Columns',
                  }),
                  (0, jsx_runtime.jsx)('div', {
                    children: columns.map(column => {
                      const isVisible = !hiddenColumns.has(column.field)
                      return (0, jsx_runtime.jsxs)(
                        'div',
                        {
                          style: columnItemStyle,
                          children: [
                            (0, jsx_runtime.jsx)('span', {
                              style: columnNameStyle,
                              children: column.headerName || column.field,
                            }),
                            (0, jsx_runtime.jsx)(Checkbox.A, {
                              checked: isVisible,
                              onChange: checked => {
                                return (
                                  (field = column.field),
                                  void (checked
                                    ? onColumnShow(field)
                                    : onColumnHide(field))
                                )
                                var field
                              },
                              styles: {
                                theme: isSacredTheme ? 'sacred' : 'light',
                              },
                            }),
                          ],
                        },
                        column.field
                      )
                    }),
                  }),
                  (0, jsx_runtime.jsx)('button', {
                    onClick: onClose,
                    style: buttonStyle,
                    onMouseEnter: e => {
                      e.currentTarget.style.backgroundColor = isSacredTheme
                        ? 'rgba(255, 215, 0, 0.2)'
                        : '#E5E7EB'
                    },
                    onMouseLeave: e => {
                      e.currentTarget.style.backgroundColor = isSacredTheme
                        ? 'rgba(255, 215, 0, 0.1)'
                        : '#F3F4F6'
                    },
                    children: 'Done',
                  }),
                ],
              }),
            })
          },
          DataGrid_ManageColumnsSimple = ManageColumnsSimple
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
        ManageColumnsSimple.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ManageColumnsSimple',
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
            columns: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'ColumnDef' }],
                raw: 'ColumnDef[]',
              },
              description: '',
            },
            hiddenColumns: {
              required: !0,
              tsType: {
                name: 'Set',
                elements: [{ name: 'string' }],
                raw: 'Set<string>',
              },
              description: '',
            },
            onColumnShow: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(field: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'field' }],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onColumnHide: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(field: string) => void',
                signature: {
                  arguments: [{ type: { name: 'string' }, name: 'field' }],
                  return: { name: 'void' },
                },
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
        var vanilla = __webpack_require__(
            './node_modules/jotai/esm/vanilla.mjs'
          ),
          esm_react = __webpack_require__('./node_modules/jotai/esm/react.mjs')
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
          onColumnResize,
          showIdColumns = !1,
          filters,
          metrics,
          styles,
        }) {
          const containerRef = (0, react.useRef)(null),
            isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            computedStyles = (0, src_theme.fN)(styles),
            [draggedColumn, setDraggedColumn] = (0, react.useState)(null),
            [columnOrder, setColumnOrder] = (0, react.useState)([]),
            [hiddenColumns, setHiddenColumns] = (0, react.useState)(new Set()),
            [showManageColumns, setShowManageColumns] = (0, react.useState)(!1),
            filteredColumns = (0, react.useMemo)(
              () =>
                showIdColumns
                  ? columns
                  : columns.filter(
                      col => 'id' !== col.field && '_id' !== col.field
                    ),
              [columns, showIdColumns]
            )
          ;(0, react.useEffect)(() => {
            filteredColumns.length > 0 &&
              0 === columnOrder.length &&
              setColumnOrder(filteredColumns.map(col => col.field))
          }, [filteredColumns, columnOrder.length])
          const orderedColumns = (0, react.useMemo)(() => {
              if (0 === columnOrder.length) return filteredColumns
              const ordered = columnOrder
                  .map(fieldName =>
                    filteredColumns.find(col => col.field === fieldName)
                  )
                  .filter(Boolean),
                existingFields = new Set(columnOrder)
              return [
                ...ordered,
                ...filteredColumns.filter(
                  col => !existingFields.has(col.field)
                ),
              ]
            }, [filteredColumns, columnOrder]),
            [columnWidths, setColumnWidths] = (0, react.useState)({}),
            [searchFilteredRows, setSearchFilteredRows] = (0, react.useState)(
              []
            ),
            [visibleColumnFields, setVisibleColumnFields] = (0, react.useState)(
              []
            ),
            [hasActiveSearch, setHasActiveSearch] = (0, react.useState)(!1),
            columnsWithWidths = (0, react.useMemo)(
              () =>
                orderedColumns.map(col => ({
                  ...col,
                  width: columnWidths[col.field] || col.width,
                  computedWidth:
                    columnWidths[col.field] || col.computedWidth || col.width,
                })),
              [orderedColumns, columnWidths]
            ),
            visibleColumns = (0, react.useMemo)(() => {
              let filteredCols = columnsWithWidths.filter(
                col => !hiddenColumns.has(col.field)
              )
              return (
                hasActiveSearch &&
                  (filteredCols = filteredCols.filter(col =>
                    visibleColumnFields.includes(col.field)
                  )),
                filteredCols
              )
            }, [
              columnsWithWidths,
              visibleColumnFields,
              hasActiveSearch,
              hiddenColumns,
            ]),
            handleColumnResize = (0, react.useCallback)(
              (columnField, newWidth) => {
                ;(setColumnWidths(prev => ({
                  ...prev,
                  [columnField]: newWidth,
                })),
                  onColumnResize && onColumnResize(columnField, newWidth))
              },
              [onColumnResize]
            ),
            handleSearchFilter = (0, react.useCallback)(
              (searchTerm, filteredRows, visibleColumns) => {
                ;(setSearchFilteredRows(filteredRows),
                  setVisibleColumnFields(visibleColumns),
                  setHasActiveSearch(searchTerm.trim().length > 0))
              },
              []
            ),
            [rows, setRows] = (0, react.useState)(providedRows || []),
            [selectedRows, setSelectedRows] = (0, react.useState)([]),
            [page, setPage] = (0, react.useState)(0),
            [editingCell, setEditingCell] = (0, react.useState)(null),
            [editingValue, setEditingValue] = (0, react.useState)(''),
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
            [pageSize, setPageSize] = (0, react.useState)(5),
            [manualPageSizeSet, setManualPageSizeSet] = (0, react.useState)(!0)
          ;(0, react.useEffect)(() => {
            autoPageSize > 0 && !manualPageSizeSet && setPageSize(autoPageSize)
          }, [autoPageSize, manualPageSizeSet])
          const handlePageSizeChange = (0, react.useCallback)(newPageSize => {
            ;(setPageSize(newPageSize), setManualPageSizeSet(!0), setPage(0))
          }, [])
          !(function useInitializeGrid({ columns, providedRows, setRows }) {
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
                        newState: { ...columnVisibility, ...initialVisibility },
                      }),
                    (initialized.current = !0))
                }
              }, [columns, columnVisibility, setColumns, updateVisibility]))
          })({ columns: visibleColumns, providedRows, setRows })
          const handleSelectionChange = newSelectedIds => {
              ;(setSelectedRows(newSelectedIds),
                null == onSelectionChange || onSelectionChange(newSelectedIds))
            },
            handleCellClick = (0, react.useCallback)(
              (rowId, field, currentValue) => {
                if (selectedRows.includes(rowId))
                  if ((setEditingCell({ rowId, field }), null == currentValue))
                    setEditingValue('')
                  else if ('object' == typeof currentValue)
                    try {
                      setEditingValue(JSON.stringify(currentValue))
                    } catch (e) {
                      setEditingValue('[object]')
                    }
                  else
                    setEditingValue(
                      'string' == typeof currentValue ||
                        'number' == typeof currentValue ||
                        'boolean' == typeof currentValue
                        ? String(currentValue)
                        : ''
                    )
              },
              [selectedRows]
            ),
            handleCellSave = (0, react.useCallback)((rowId, field, value) => {
              ;(setRows(prevRows =>
                prevRows.map(row => {
                  var _row__id
                  return String(
                    null !== (_row__id = row._id) && void 0 !== _row__id
                      ? _row__id
                      : row.id
                  ) === rowId
                    ? { ...row, [field]: value }
                    : row
                })
              ),
                setEditingCell(null),
                setEditingValue(''))
            }, []),
            handleCellCancel = (0, react.useCallback)(() => {
              ;(setEditingCell(null), setEditingValue(''))
            }, []),
            handleEditingValueChange = (0, react.useCallback)(value => {
              setEditingValue(value)
            }, []),
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
            })({
              columns: visibleColumns,
              rows: hasActiveSearch ? searchFilteredRows : rows,
              searchbarProps,
            }),
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
            handleColumnSort = (0, react.useCallback)((field, direction) => {
              setRows(prevRows =>
                [...prevRows].sort((a, b) => {
                  const aValue = a[field],
                    bValue = b[field]
                  if ('string' == typeof aValue && 'string' == typeof bValue)
                    return 'asc' === direction
                      ? aValue.localeCompare(bValue)
                      : bValue.localeCompare(aValue)
                  if ('number' == typeof aValue && 'number' == typeof bValue)
                    return 'asc' === direction
                      ? aValue - bValue
                      : bValue - aValue
                  const aStr =
                      null != aValue
                        ? 'string' == typeof aValue ||
                          'number' == typeof aValue ||
                          'boolean' == typeof aValue
                          ? String(aValue)
                          : JSON.stringify(aValue)
                        : '',
                    bStr =
                      null != bValue
                        ? 'string' == typeof bValue ||
                          'number' == typeof bValue ||
                          'boolean' == typeof bValue
                          ? String(bValue)
                          : JSON.stringify(bValue)
                        : ''
                  return 'asc' === direction
                    ? aStr.localeCompare(bStr)
                    : bStr.localeCompare(aStr)
                })
              )
            }, []),
            handleColumnHide = (0, react.useCallback)(field => {
              setHiddenColumns(prev => {
                const newSet = new Set(prev)
                return (newSet.add(field), newSet)
              })
            }, []),
            handleColumnShow = (0, react.useCallback)(field => {
              setHiddenColumns(prev => {
                const newSet = new Set(prev)
                return (newSet.delete(field), newSet)
              })
            }, []),
            handleToggleManageColumns = (0, react.useCallback)(() => {
              setShowManageColumns(prev => !prev)
            }, []),
            handleColumnDragStart = (0, react.useCallback)(field => {
              setDraggedColumn(field)
            }, []),
            handleColumnDragOver = (0, react.useCallback)(e => {
              e.preventDefault()
            }, []),
            handleColumnDrop = (0, react.useCallback)(
              targetField => {
                draggedColumn && draggedColumn !== targetField
                  ? (setColumnOrder(prevOrder => {
                      const newOrder = [...prevOrder],
                        draggedIndex = newOrder.indexOf(draggedColumn),
                        targetIndex = newOrder.indexOf(targetField)
                      return (
                        -1 !== draggedIndex &&
                          -1 !== targetIndex &&
                          (newOrder.splice(draggedIndex, 1),
                          newOrder.splice(targetIndex, 0, draggedColumn)),
                        newOrder
                      )
                    }),
                    setDraggedColumn(null))
                  : setDraggedColumn(null)
              },
              [draggedColumn]
            ),
            handleColumnDragEnd = (0, react.useCallback)(() => {
              setDraggedColumn(null)
            }, []),
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
            children: [
              metrics &&
                Array.isArray(metrics) &&
                metrics.length > 0 &&
                (0, jsx_runtime.jsx)('div', {
                  style: { marginBottom: '1rem' },
                  children: (0, jsx_runtime.jsx)(DataGrid_MetricSection, {
                    metrics,
                    styles,
                  }),
                }),
              (0, jsx_runtime.jsx)('div', {
                style: { marginBottom: '1rem' },
                children: (0, jsx_runtime.jsx)(DataGrid_FilterSection, {
                  filters: filters || [],
                  columns: columnsWithWidths,
                  rows,
                  onSearchFilter: handleSearchFilter,
                  styles,
                }),
              }),
              (0, jsx_runtime.jsxs)('div', {
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
                          children: src_theme.vR[23],
                        }),
                        (0, jsx_runtime.jsx)('div', {
                          style: {
                            ...computedStyles.glyph,
                            top: '0.75rem',
                            right: '0.75rem',
                            animationDirection: 'reverse',
                          },
                          children: src_theme.vR[22],
                        }),
                      ],
                    }),
                  error &&
                    (0, jsx_runtime.jsx)('div', {
                      style: computedStyles.error,
                      children: error.message,
                    }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: computedStyles.contentWrapper,
                    children: [
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
                                onShow: onShow
                                  ? () => onShow(selectedRows)
                                  : void 0,
                                handleClose: handleManageRowClose,
                              }
                            : void 0,
                        styles: {
                          theme:
                            (null == styles ? void 0 : styles.theme) || 'light',
                        },
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: computedStyles.sectionDivider,
                      }),
                      (0, jsx_runtime.jsx)(DataGrid_Table, {
                        columns: visibleColumns,
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
                              null !== (_row__id = row._id) &&
                              void 0 !== _row__id
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
                                rows.every(r =>
                                  selectedRows.includes(getRowId(r))
                                )
                                ? []
                                : rows.map(r => getRowId(r))
                            )
                          })(rows, selectedRows, handleSelectionChange),
                        onColumnResize: handleColumnResize,
                        styles,
                        editingCell,
                        editingValue,
                        onCellClick: handleCellClick,
                        onCellSave: handleCellSave,
                        onCellCancel: handleCellCancel,
                        onEditingValueChange: handleEditingValueChange,
                        onColumnSort: handleColumnSort,
                        onManageColumns: handleToggleManageColumns,
                        draggedColumn,
                        onColumnDragStart: handleColumnDragStart,
                        onColumnDragOver: handleColumnDragOver,
                        onColumnDrop: handleColumnDrop,
                        onColumnDragEnd: handleColumnDragEnd,
                      }),
                      (0, jsx_runtime.jsx)(Footer, {
                        page,
                        pageSize,
                        rowCount: filteredRows.length,
                        onPageChange: setPage,
                        onPageSizeChange: handlePageSizeChange,
                        columns: visibleColumns,
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
                  (0, jsx_runtime.jsx)(DataGrid_ManageColumnsSimple, {
                    open: showManageColumns,
                    onClose: handleToggleManageColumns,
                    columns: filteredColumns,
                    hiddenColumns,
                    onColumnShow: handleColumnShow,
                    onColumnHide: handleColumnHide,
                    styles,
                  }),
                ],
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
            onColumnResize: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(columnField: string, newWidth: number) => void',
                signature: {
                  arguments: [
                    { type: { name: 'string' }, name: 'columnField' },
                    { type: { name: 'number' }, name: 'newWidth' },
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
        var console = __webpack_require__(
          './node_modules/console-browserify/index.js'
        )
        const sampleColumns = [
            { field: 'id', headerName: 'ID', width: 90, resizable: !0 },
            { field: 'name', headerName: 'Name', width: 150, resizable: !0 },
            {
              field: 'age',
              headerName: 'Age',
              type: 'default',
              width: 110,
              resizable: !0,
            },
            {
              field: 'email',
              headerName: 'Email Address',
              width: 200,
              resizable: !0,
            },
            {
              field: 'department',
              headerName: 'Department',
              width: 140,
              resizable: !0,
              type: 'dropdown',
              dropdownOptions: [
                { value: 'Engineering' },
                { value: 'Marketing' },
                { value: 'HR' },
                { value: 'Sales' },
                { value: 'Finance' },
                { value: 'Operations' },
                { value: 'Customer Service' },
                { value: 'Product' },
                { value: 'Legal' },
                { value: 'Design' },
                { value: 'Data Science' },
                { value: 'Security' },
                { value: 'Administration' },
                { value: 'Business Development' },
                { value: 'Quality Assurance' },
                { value: 'Adventure' },
                { value: 'Construction' },
              ],
            },
            {
              field: 'salary',
              headerName: 'Salary',
              type: 'currency',
              width: 120,
              resizable: !0,
            },
            {
              field: 'startDate',
              headerName: 'Start Date',
              width: 130,
              resizable: !0,
            },
            {
              field: 'status',
              headerName: 'Status',
              width: 100,
              resizable: !0,
              type: 'dropdown',
              dropdownOptions: [
                { value: 'Active' },
                { value: 'On Leave' },
                { value: 'Vacation' },
                { value: 'Training' },
                { value: 'Remote' },
                { value: 'Probation' },
                { value: 'Intern' },
                { value: 'Flying' },
                { value: 'Building' },
              ],
            },
          ],
          sampleRows = [
            {
              id: '1',
              name: 'John Doe',
              age: 35,
              email: 'john.doe@company.com',
              department: 'Engineering',
              salary: 75e3,
              startDate: '2020-01-15',
              status: 'Active',
            },
            {
              id: '2',
              name: 'Jane Doe',
              age: 32,
              email: 'jane.doe@company.com',
              department: 'Marketing',
              salary: 68e3,
              startDate: '2021-03-22',
              status: 'Active',
            },
            {
              id: '3',
              name: 'Peter Pan',
              age: 100,
              email: 'peter.pan@neverland.com',
              department: 'Adventure',
              salary: 5e4,
              startDate: '1904-12-27',
              status: 'Flying',
            },
            {
              id: '4',
              name: 'Alice Wonder',
              age: 28,
              email: 'alice.wonder@rabbit.hole',
              department: 'HR',
              salary: 55e3,
              startDate: '2022-07-10',
              status: 'Active',
            },
            {
              id: '5',
              name: 'Bob Builder',
              age: 45,
              email: 'bob.builder@construction.com',
              department: 'Construction',
              salary: 82e3,
              startDate: '2018-05-03',
              status: 'Building',
            },
            ...Array.from({ length: 95 }, (_, i) => {
              const id = (i + 6).toString(),
                firstNames = [
                  'Michael',
                  'Sarah',
                  'David',
                  'Emma',
                  'Chris',
                  'Jessica',
                  'Ryan',
                  'Ashley',
                  'Kevin',
                  'Amanda',
                  'Daniel',
                  'Jennifer',
                  'Matthew',
                  'Lisa',
                  'James',
                  'Maria',
                  'Andrew',
                  'Michelle',
                  'Joshua',
                  'Elizabeth',
                  'Brandon',
                  'Nicole',
                  'Tyler',
                  'Rachel',
                  'Jacob',
                  'Stephanie',
                  'Nicholas',
                  'Rebecca',
                  'Anthony',
                  'Laura',
                  'William',
                  'Melissa',
                  'Samuel',
                  'Amy',
                  'Joseph',
                  'Angela',
                  'Alexander',
                  'Deborah',
                  'Adam',
                  'Sharon',
                ],
                lastNames = [
                  'Smith',
                  'Johnson',
                  'Williams',
                  'Brown',
                  'Jones',
                  'Garcia',
                  'Miller',
                  'Davis',
                  'Rodriguez',
                  'Martinez',
                  'Hernandez',
                  'Lopez',
                  'Gonzalez',
                  'Wilson',
                  'Anderson',
                  'Thomas',
                  'Taylor',
                  'Moore',
                  'Jackson',
                  'Martin',
                  'Lee',
                  'Perez',
                  'Thompson',
                  'White',
                  'Harris',
                  'Sanchez',
                  'Clark',
                  'Ramirez',
                  'Lewis',
                  'Robinson',
                  'Walker',
                  'Young',
                  'Allen',
                  'King',
                  'Wright',
                  'Scott',
                  'Torres',
                  'Nguyen',
                  'Hill',
                  'Flores',
                ],
                departments = [
                  'Engineering',
                  'Marketing',
                  'HR',
                  'Sales',
                  'Finance',
                  'Operations',
                  'Customer Service',
                  'Product',
                  'Legal',
                  'Design',
                  'Data Science',
                  'Security',
                  'Administration',
                  'Business Development',
                  'Quality Assurance',
                ],
                statuses = [
                  'Active',
                  'On Leave',
                  'Vacation',
                  'Training',
                  'Remote',
                  'Probation',
                  'Intern',
                ],
                firstName = firstNames[i % firstNames.length],
                lastName =
                  lastNames[
                    Math.floor(i / firstNames.length) % lastNames.length
                  ],
                department = departments[i % departments.length],
                status = statuses[i % statuses.length],
                age = 22 + (i % 43),
                baseSalary = 4e4 + (i % 20) * 5e3 + 2e3 * Math.floor(i / 20),
                years = 2018 + (i % 6),
                months = String(1 + (i % 12)).padStart(2, '0'),
                days = String(1 + (i % 28)).padStart(2, '0')
              return {
                id,
                name: `${firstName} ${lastName}`,
                age,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
                department,
                salary: baseSalary,
                startDate: `${years}-${months}-${days}`,
                status,
              }
            }),
          ],
          employeeMetrics = [
            {
              title: 'Total Employees',
              value: 100,
              subtitle: 'Active workforce',
              trend: { value: 12.5, isPositive: !0 },
              icon: (0, jsx_runtime.jsx)('svg', {
                width: '20',
                height: '20',
                viewBox: '0 0 24 24',
                fill: 'currentColor',
                children: (0, jsx_runtime.jsx)('path', {
                  d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
                }),
              }),
            },
            {
              title: 'Average Salary',
              value: '$67,250',
              subtitle: 'Per employee',
              trend: { value: 8.2, isPositive: !0 },
              icon: (0, jsx_runtime.jsx)('svg', {
                width: '20',
                height: '20',
                viewBox: '0 0 24 24',
                fill: 'currentColor',
                children: (0, jsx_runtime.jsx)('path', {
                  d: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
                }),
              }),
            },
            {
              title: 'Active Status',
              value: '85%',
              subtitle: '85 of 100 employees',
              trend: { value: 5, isPositive: !0 },
              icon: (0, jsx_runtime.jsx)('svg', {
                width: '20',
                height: '20',
                viewBox: '0 0 24 24',
                fill: 'currentColor',
                children: (0, jsx_runtime.jsx)('path', {
                  d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                }),
              }),
            },
            {
              title: 'Departments',
              value: 15,
              subtitle: 'Active divisions',
              icon: (0, jsx_runtime.jsx)('svg', {
                width: '20',
                height: '20',
                viewBox: '0 0 24 24',
                fill: 'currentColor',
                children: (0, jsx_runtime.jsx)('path', {
                  d: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
                }),
              }),
            },
          ],
          sampleFilters = [
            {
              label: 'Department',
              value: 'all',
              type: 'dropdown',
              options: [
                { value: 'all' },
                { value: 'Engineering' },
                { value: 'Marketing' },
                { value: 'HR' },
                { value: 'Sales' },
                { value: 'Finance' },
                { value: 'Operations' },
                { value: 'Customer Service' },
                { value: 'Product' },
                { value: 'Legal' },
                { value: 'Design' },
                { value: 'Data Science' },
                { value: 'Security' },
                { value: 'Administration' },
                { value: 'Business Development' },
                { value: 'Quality Assurance' },
                { value: 'Adventure' },
                { value: 'Construction' },
              ],
              onChange: value => {
                console.log('Department filter changed:', value)
              },
              placeholder: 'All Departments',
            },
            {
              label: 'Status',
              value: 'all',
              type: 'dropdown',
              options: [
                { value: 'all' },
                { value: 'Active' },
                { value: 'On Leave' },
                { value: 'Vacation' },
                { value: 'Training' },
                { value: 'Remote' },
                { value: 'Probation' },
                { value: 'Intern' },
                { value: 'Flying' },
                { value: 'Building' },
              ],
              onChange: value => {
                console.log('Status filter changed:', value)
              },
              placeholder: 'All Statuses',
            },
          ],
          commonArgs = {
            columns: sampleColumns,
            rows: sampleRows,
            buttons: [{ text: 'Add New' }],
            searchbarProps: { value: '', onChange: () => {} },
            filters: sampleFilters,
            metrics: employeeMetrics,
            onManage: selectedRows => {
              console.log('Manage rows:', selectedRows)
            },
            onDelete: selectedRows => {
              console.log('Delete rows:', selectedRows)
            },
            onDuplicate: selectedRows => {
              console.log('Duplicate rows:', selectedRows)
            },
            onShow: selectedRows => {
              console.log('Show rows:', selectedRows)
            },
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
                  minHeight: '100vh',
                  padding: '1rem',
                  margin: 0,
                  boxSizing: 'border-box',
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
                  minHeight: '100vh',
                  padding: '1rem',
                  margin: 0,
                  boxSizing: 'border-box',
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
                  backgroundColor: '#000',
                  minHeight: '100vh',
                  padding: '1rem',
                  margin: 0,
                  boxSizing: 'border-box',
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
                  searchbarProps: { value: '', onChange: () => {} },
                  filters: sampleFilters,
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
                  minHeight: '100vh',
                  padding: '1rem',
                  margin: 0,
                  boxSizing: 'border-box',
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
          ColumnResizeDemoComponent = args => {
            const [columnWidths, setColumnWidths] = react.useState({})
            return (0, jsx_runtime.jsxs)('div', {
              style: {
                minHeight: '100vh',
                padding: '1rem',
                margin: 0,
                boxSizing: 'border-box',
              },
              children: [
                (0, jsx_runtime.jsxs)('div', {
                  style: {
                    marginBottom: '1rem',
                    fontSize: '14px',
                    color: '#666',
                  },
                  children: [
                    (0, jsx_runtime.jsx)('strong', {
                      children: 'Resize Demo:',
                    }),
                    ' Hover over column borders to see resize handles. Drag to resize columns.',
                    (0, jsx_runtime.jsx)('br', {}),
                    (0, jsx_runtime.jsx)('strong', {
                      children: 'Filter Demo:',
                    }),
                    ' Use the filter section above the table to filter data.',
                    (0, jsx_runtime.jsx)('br', {}),
                    (0, jsx_runtime.jsx)('strong', {
                      children: 'Metrics Demo:',
                    }),
                    ' Key performance indicators are displayed at the top.',
                    Object.keys(columnWidths).length > 0 &&
                      (0, jsx_runtime.jsxs)('div', {
                        style: { marginTop: '0.5rem' },
                        children: [
                          (0, jsx_runtime.jsx)('strong', {
                            children: 'Resized columns:',
                          }),
                          ' ',
                          JSON.stringify(columnWidths, null, 2),
                        ],
                      }),
                  ],
                }),
                (0, jsx_runtime.jsx)(components_DataGrid, {
                  ...args,
                  showIdColumns: !0,
                  onColumnResize: (columnField, newWidth) => {
                    ;(console.log(
                      `Column ${columnField} resized to ${newWidth}px`
                    ),
                      setColumnWidths(prev => ({
                        ...prev,
                        [columnField]: newWidth,
                      })))
                  },
                  filters: sampleFilters,
                  metrics: employeeMetrics,
                }),
              ],
            })
          },
          ColumnResizeDemo = {
            name: 'Column Resize Demo',
            render: args =>
              (0, jsx_runtime.jsx)(ColumnResizeDemoComponent, { ...args }),
            args: { ...commonArgs, styles: { theme: 'light' } },
          },
          financialColumns = [
            {
              field: 'id',
              headerName: 'Transaction ID',
              width: 120,
              resizable: !0,
            },
            { field: 'date', headerName: 'Date', width: 120, resizable: !0 },
            {
              field: 'description',
              headerName: 'Description',
              width: 250,
              resizable: !0,
            },
            {
              field: 'category',
              headerName: 'Category',
              width: 140,
              resizable: !0,
            },
            {
              field: 'amount',
              headerName: 'Amount',
              type: 'currency',
              width: 120,
              resizable: !0,
            },
            { field: 'type', headerName: 'Type', width: 100, resizable: !0 },
            {
              field: 'account',
              headerName: 'Account',
              width: 150,
              resizable: !0,
            },
            {
              field: 'status',
              headerName: 'Status',
              width: 100,
              resizable: !0,
            },
          ],
          financialRows = [
            {
              id: 'TXN-001',
              date: '2024-01-15',
              description: 'Office Supplies Purchase',
              category: 'Office Expenses',
              amount: -245.5,
              type: 'Expense',
              account: 'Business Checking',
              status: 'Cleared',
            },
            {
              id: 'TXN-002',
              date: '2024-01-18',
              description: 'Client Payment - ABC Corp',
              category: 'Revenue',
              amount: 5e3,
              type: 'Income',
              account: 'Business Checking',
              status: 'Cleared',
            },
            {
              id: 'TXN-003',
              date: '2024-02-01',
              description: 'Monthly Software Subscription',
              category: 'Technology',
              amount: -99.99,
              type: 'Expense',
              account: 'Business Credit Card',
              status: 'Pending',
            },
            {
              id: 'TXN-004',
              date: '2024-02-10',
              description: 'Consulting Services Revenue',
              category: 'Revenue',
              amount: 2500,
              type: 'Income',
              account: 'Business Checking',
              status: 'Cleared',
            },
            {
              id: 'TXN-005',
              date: '2024-02-15',
              description: 'Equipment Purchase',
              category: 'Capital Expenses',
              amount: -1200,
              type: 'Expense',
              account: 'Business Checking',
              status: 'Cleared',
            },
            {
              id: 'TXN-006',
              date: '2024-03-01',
              description: 'Marketing Campaign',
              category: 'Marketing',
              amount: -750,
              type: 'Expense',
              account: 'Business Credit Card',
              status: 'Cleared',
            },
            {
              id: 'TXN-007',
              date: '2024-03-12',
              description: 'Project Payment - XYZ Ltd',
              category: 'Revenue',
              amount: 8500,
              type: 'Income',
              account: 'Business Checking',
              status: 'Cleared',
            },
            ...Array.from({ length: 125 }, (_, i) => {
              const id = `TXN-${String(i + 8).padStart(3, '0')}`,
                categories = [
                  'Revenue',
                  'Office Expenses',
                  'Technology',
                  'Marketing',
                  'Travel',
                  'Professional Services',
                  'Insurance',
                  'Utilities',
                  'Equipment',
                  'Training & Development',
                  'Legal & Compliance',
                  'Banking & Finance',
                  'Communication',
                  'Supplies',
                  'Transportation',
                  'Capital Expenses',
                ],
                accounts = [
                  'Business Checking',
                  'Business Credit Card',
                  'Savings Account',
                  'Petty Cash',
                ],
                statuses = ['Cleared', 'Pending', 'Reconciled', 'Processing'],
                isIncome = i % 3 == 0,
                type = isIncome ? 'Income' : 'Expense',
                descriptions = isIncome
                  ? [
                      'Client Payment - Professional Services',
                      'Monthly Retainer Fee',
                      'Project Milestone Payment',
                      'Consulting Revenue',
                      'Software License Sale',
                      'Training Workshop Revenue',
                      'Product Sales Revenue',
                      'Subscription Revenue',
                      'Partnership Commission',
                      'Investment Returns',
                      'Rental Income',
                      'Interest Income',
                      'Grant Funding',
                      'Contract Payment',
                      'Service Fee Revenue',
                    ]
                  : [
                      'Office Rent Payment',
                      'Utility Bills',
                      'Internet & Phone Service',
                      'Software Subscription',
                      'Marketing Advertisement',
                      'Business Travel',
                      'Equipment Maintenance',
                      'Professional Services',
                      'Insurance Premium',
                      'Office Supplies',
                      'Parking & Transportation',
                      'Business Meals',
                      'Conference & Training',
                      'Legal Fees',
                      'Accounting Services',
                      'Bank Fees',
                      'Postage & Shipping',
                      'Website & Domain',
                      'Cloud Storage',
                      'Security Services',
                    ],
                description = descriptions[i % descriptions.length]
              let amount
              ;((amount = isIncome
                ? 500 + 15e3 * Math.random()
                : -(25 + 2e3 * Math.random())),
                (amount = Math.round(100 * amount) / 100))
              const category = categories[i % categories.length],
                account = accounts[i % accounts.length],
                status = statuses[i % statuses.length]
              return {
                id,
                date: `${i % 2 == 0 ? 2024 : 2023}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
                description,
                category,
                amount,
                type,
                account,
                status,
              }
            }),
          ],
          financialFilters = [
            {
              label: 'Transaction Date Range',
              value: { start: null, end: null },
              type: 'daterange',
              onChange: value => {
                console.log('Date range filter changed:', value)
              },
            },
            {
              label: 'Category',
              value: 'all',
              type: 'dropdown',
              options: [
                { value: 'all' },
                { value: 'Revenue' },
                { value: 'Office Expenses' },
                { value: 'Technology' },
                { value: 'Marketing' },
                { value: 'Travel' },
                { value: 'Professional Services' },
                { value: 'Insurance' },
                { value: 'Utilities' },
                { value: 'Equipment' },
                { value: 'Training & Development' },
                { value: 'Legal & Compliance' },
                { value: 'Banking & Finance' },
                { value: 'Communication' },
                { value: 'Supplies' },
                { value: 'Transportation' },
                { value: 'Capital Expenses' },
              ],
              onChange: value => {
                console.log('Category filter changed:', value)
              },
              placeholder: 'All Categories',
            },
            {
              label: 'Transaction Type',
              value: 'all',
              type: 'dropdown',
              options: [
                { value: 'all' },
                { value: 'Income' },
                { value: 'Expense' },
              ],
              onChange: value => {
                console.log('Type filter changed:', value)
              },
              placeholder: 'All Types',
            },
            {
              label: 'Status',
              value: 'all',
              type: 'dropdown',
              options: [
                { value: 'all' },
                { value: 'Cleared' },
                { value: 'Pending' },
                { value: 'Reconciled' },
                { value: 'Processing' },
              ],
              onChange: value => {
                console.log('Status filter changed:', value)
              },
              placeholder: 'All Statuses',
            },
          ],
          financialMetrics = [
            {
              title: 'Total Revenue',
              value: '$342,750',
              subtitle: 'Incoming transactions',
              trend: { value: 15.3, isPositive: !0 },
              icon: (0, jsx_runtime.jsx)('svg', {
                width: '20',
                height: '20',
                viewBox: '0 0 24 24',
                fill: 'currentColor',
                children: (0, jsx_runtime.jsx)('path', {
                  d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
                }),
              }),
            },
            {
              title: 'Total Expenses',
              value: '$187,420',
              subtitle: 'Outgoing transactions',
              trend: { value: 3.2, isPositive: !1 },
              icon: (0, jsx_runtime.jsx)('svg', {
                width: '20',
                height: '20',
                viewBox: '0 0 24 24',
                fill: 'currentColor',
                children: (0, jsx_runtime.jsx)('path', {
                  d: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6',
                }),
              }),
            },
            {
              title: 'Net Income',
              value: '$155,330',
              subtitle: 'Profit margin',
              trend: { value: 22.8, isPositive: !0 },
              icon: (0, jsx_runtime.jsx)('svg', {
                width: '20',
                height: '20',
                viewBox: '0 0 24 24',
                fill: 'currentColor',
                children: (0, jsx_runtime.jsx)('path', {
                  d: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
                }),
              }),
            },
            {
              title: 'Transactions',
              value: 132,
              subtitle: 'Total processed',
              icon: (0, jsx_runtime.jsx)('svg', {
                width: '20',
                height: '20',
                viewBox: '0 0 24 24',
                fill: 'currentColor',
                children: (0, jsx_runtime.jsx)('path', {
                  d: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
                }),
              }),
            },
          ],
          FinancialStatements = {
            name: 'Financial Statements with Date Filters',
            render: args =>
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  backgroundColor: '#f3f4f6',
                  height: '100vh',
                  padding: '1rem',
                },
                children: [
                  (0, jsx_runtime.jsxs)('div', {
                    style: {
                      marginBottom: '1rem',
                      fontSize: '14px',
                      color: '#666',
                    },
                    children: [
                      (0, jsx_runtime.jsx)('strong', {
                        children: 'Financial Demo:',
                      }),
                      ' This story showcases date range filtering with financial transaction data.',
                      (0, jsx_runtime.jsx)('br', {}),
                      (0, jsx_runtime.jsx)('strong', { children: 'Features:' }),
                      ' Date range filter, currency formatting, category-based filtering, and financial metrics.',
                    ],
                  }),
                  (0, jsx_runtime.jsx)(components_DataGrid, {
                    ...args,
                    columns: financialColumns,
                    rows: financialRows,
                    buttons: [{ text: 'Add Transaction' }],
                    searchbarProps: { value: '', onChange: () => {} },
                    filters: financialFilters,
                    metrics: financialMetrics,
                    styles: { theme: 'light' },
                    showIdColumns: !0,
                  }),
                ],
              }),
            args: {
              columns: financialColumns,
              rows: financialRows,
              filters: financialFilters,
              metrics: financialMetrics,
              styles: { theme: 'light' },
            },
          },
          SacredThemeWithMetrics = {
            name: 'Sacred Theme with Metrics',
            render: args =>
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  backgroundColor: '#000',
                  minHeight: '100vh',
                  padding: '1rem',
                  margin: 0,
                  backgroundImage:
                    'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
                  boxSizing: 'border-box',
                },
                children: [
                  (0, jsx_runtime.jsxs)('div', {
                    style: {
                      marginBottom: '1rem',
                      fontSize: '14px',
                      color: '#FFD700',
                    },
                    children: [
                      (0, jsx_runtime.jsx)('strong', {
                        children: 'Sacred Theme Demo:',
                      }),
                      ' Experience the mystical design with ancient glyphs and golden accents.',
                      (0, jsx_runtime.jsx)('br', {}),
                      (0, jsx_runtime.jsx)('strong', { children: 'Features:' }),
                      ' Sacred metrics with animated glyphs, mystical styling, and ethereal effects.',
                    ],
                  }),
                  (0, jsx_runtime.jsx)(components_DataGrid, {
                    ...args,
                    columns: sampleColumns,
                    rows: sampleRows,
                    buttons: [{ text: 'Add Sacred Entity' }],
                    searchbarProps: { value: '', onChange: () => {} },
                    filters: sampleFilters,
                    metrics: employeeMetrics,
                    styles: { theme: 'sacred' },
                    showIdColumns: !0,
                  }),
                ],
              }),
            args: {
              columns: sampleColumns,
              rows: sampleRows,
              filters: sampleFilters,
              metrics: employeeMetrics,
              styles: { theme: 'sacred' },
            },
            parameters: {
              backgrounds: { default: 'dark' },
              layout: 'fullscreen',
            },
          },
          ManageRowDemo = {
            name: 'Manage Row Demo',
            render: args =>
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  minHeight: '100vh',
                  padding: '1rem',
                  margin: 0,
                  boxSizing: 'border-box',
                },
                children: [
                  (0, jsx_runtime.jsxs)('div', {
                    style: {
                      marginBottom: '1rem',
                      fontSize: '14px',
                      color: '#666',
                    },
                    children: [
                      (0, jsx_runtime.jsx)('strong', {
                        children: 'Manage Row Demo:',
                      }),
                      ' Click on the checkboxes to select rows. The manage row toolbar will appear with options to manage, delete, duplicate, and show selected rows.',
                      (0, jsx_runtime.jsx)('br', {}),
                      (0, jsx_runtime.jsx)('strong', {
                        children: 'Test Instructions:',
                      }),
                      (0, jsx_runtime.jsx)('br', {}),
                      '1. Click on row checkboxes to select rows',
                      (0, jsx_runtime.jsx)('br', {}),
                      '2. Notice the toolbar appears with manage options',
                      (0, jsx_runtime.jsx)('br', {}),
                      '3. Check the console for callback logs when clicking manage actions',
                    ],
                  }),
                  (0, jsx_runtime.jsx)(components_DataGrid, {
                    ...args,
                    showIdColumns: !0,
                    onManage: selectedRows => {
                      ;(console.log(
                        '🔧 Manage action called with rows:',
                        selectedRows
                      ),
                        alert(
                          `Managing ${selectedRows.length} row(s): ${selectedRows.join(', ')}`
                        ))
                    },
                    onDelete: selectedRows => {
                      ;(console.log(
                        '🗑️ Delete action called with rows:',
                        selectedRows
                      ),
                        alert(
                          `Deleting ${selectedRows.length} row(s): ${selectedRows.join(', ')}`
                        ))
                    },
                    onDuplicate: selectedRows => {
                      ;(console.log(
                        '📋 Duplicate action called with rows:',
                        selectedRows
                      ),
                        alert(
                          `Duplicating ${selectedRows.length} row(s): ${selectedRows.join(', ')}`
                        ))
                    },
                    onShow: selectedRows => {
                      ;(console.log(
                        '👁️ Show action called with rows:',
                        selectedRows
                      ),
                        alert(
                          `Showing ${selectedRows.length} row(s): ${selectedRows.join(', ')}`
                        ))
                    },
                    onSelectionChange: selectedRows => {
                      console.log('✅ Selection changed to:', selectedRows)
                    },
                  }),
                ],
              }),
            args: {
              columns: sampleColumns,
              rows: sampleRows,
              buttons: [{ text: 'Add New' }],
              searchbarProps: { value: '', onChange: () => {} },
              styles: { theme: 'light' },
            },
          },
          __namedExportsOrder = [
            'LightTheme',
            'DarkTheme',
            'SacredTheme',
            'InteractiveDemo',
            'CustomStyling',
            'ColumnResizeDemo',
            'FinancialStatements',
            'SacredThemeWithMetrics',
            'ManageRowDemo',
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
