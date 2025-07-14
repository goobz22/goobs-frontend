'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [6270],
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
      './src/components/Chip/index.tsx': (
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
          _Icons_Close__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
            './src/components/Icons/Close.tsx'
          ),
          _theme__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
            './src/theme/index.ts'
          )
        const Chip = ({ label, onDelete, styles }) => {
            const [isHovered, setIsHovered] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
              [isCloseHovered, setIsCloseHovered] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
              isDisabled = null == styles ? void 0 : styles.disabled,
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              computedStyles = (0, _theme__WEBPACK_IMPORTED_MODULE_3__.z6)(
                styles,
                isHovered,
                isDisabled
              ),
              closeButtonStyle = {
                ...computedStyles.closeButton,
                ...(isCloseHovered &&
                  !isDisabled &&
                  computedStyles.closeButtonHover),
                ...(isDisabled && computedStyles.closeButtonDisabled),
              }
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: computedStyles.container,
                onMouseEnter: () => setIsHovered(!0),
                onMouseLeave: () => setIsHovered(!1),
                children: [
                  isSacredTheme &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment,
                      {
                        children: [
                          (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            'span',
                            {
                              style: {
                                ...computedStyles.glyph,
                                ...computedStyles.glyphLeft,
                                ...(isHovered &&
                                  !isDisabled &&
                                  computedStyles.glyphVisible),
                              },
                              children:
                                _theme__WEBPACK_IMPORTED_MODULE_3__.vR[7],
                            }
                          ),
                          (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            'span',
                            {
                              style: {
                                ...computedStyles.glyph,
                                ...computedStyles.glyphRight,
                                ...(isHovered &&
                                  !isDisabled &&
                                  computedStyles.glyphVisible),
                              },
                              children:
                                _theme__WEBPACK_IMPORTED_MODULE_3__.vR[13],
                            }
                          ),
                          isHovered &&
                            !isDisabled &&
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'div',
                              { style: computedStyles.shimmer }
                            ),
                        ],
                      }
                    ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'span',
                    {
                      style: { position: 'relative', zIndex: 1 },
                      children: label,
                    }
                  ),
                  onDelete &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      'button',
                      {
                        onClick: isDisabled ? void 0 : onDelete,
                        style: closeButtonStyle,
                        onMouseEnter: () => setIsCloseHovered(!0),
                        onMouseLeave: () => setIsCloseHovered(!1),
                        disabled: isDisabled,
                        'aria-label': 'Remove chip',
                        children: (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _Icons_Close__WEBPACK_IMPORTED_MODULE_2__.A,
                          { style: { width: '16px', height: '16px' } }
                        ),
                      }
                    ),
                ],
              }
            )
          },
          __WEBPACK_DEFAULT_EXPORT__ = Chip
        Chip.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'Chip',
          props: {
            label: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            onDelete: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'ChipStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
          },
        }
      },
      './src/components/Field/Dropdown/MultiSelect/index.tsx': (
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
          _Popover__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
            './src/components/Popover/index.tsx'
          ),
          _Checkbox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
            './src/components/Checkbox/index.tsx'
          ),
          _Chip__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
            './src/components/Chip/index.tsx'
          ),
          _Icons_ArrowDropDown__WEBPACK_IMPORTED_MODULE_5__ =
            __webpack_require__('./src/components/Icons/ArrowDropDown.tsx')
        function isDropdownOption(option) {
          return (
            'object' == typeof option && null !== option && 'value' in option
          )
        }
        const MultiSelectChip = ({
            label = 'Chip',
            options = [],
            defaultSelected = [],
            onChange,
            complexOptions: userSpecifiedComplexOptions,
            showOptionDetails = !1,
            helperText,
            styles: fieldStyles,
            ...rest
          }) => {
            const [isOpen, setIsOpen] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
              [anchorEl, setAnchorEl] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(null),
              [selectedValues, setSelectedValues] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(defaultSelected),
              sacredtheme =
                'sacred' === (null == fieldStyles ? void 0 : fieldStyles.theme),
              styles = ((
                sacredtheme,
                backgroundcolor,
                outlinecolor,
                color
              ) => ({
                container: { position: 'relative', width: '100%' },
                chipContainer: {
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.25rem',
                  padding: '0.5rem',
                  minHeight: '40px',
                  border: `2px solid ${sacredtheme ? 'rgba(255, 215, 0, 0.5)' : outlinecolor || '#CBD5E1'}`,
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  backgroundColor: sacredtheme
                    ? 'rgba(0, 0, 0, 0.8)'
                    : backgroundcolor || 'white',
                  color: sacredtheme
                    ? 'rgba(255, 215, 0, 0.7)'
                    : color || '#4A5568',
                  '&:hover': {
                    borderColor: sacredtheme ? '#FFD700' : '#A0AEC0',
                  },
                },
                placeholder: {
                  color: sacredtheme ? 'rgba(255, 215, 0, 0.7)' : '#A0AEC0',
                },
                arrowIcon: {
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: sacredtheme ? '#FFD700' : '#4A5568',
                },
                popoverContent: {
                  width: '16rem',
                  maxHeight: '15rem',
                  overflowY: 'auto',
                  border:
                    '1px solid ' +
                    (sacredtheme ? 'rgba(255, 215, 0, 0.3)' : '#E2E8F0'),
                  borderRadius: '0.375rem',
                  boxShadow:
                    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  backgroundColor: sacredtheme ? 'rgba(0,0,0,0.95)' : 'white',
                },
                option: {
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: sacredtheme
                      ? 'rgba(255, 215, 0, 0.1)'
                      : '#F7FAFC',
                  },
                },
                optionLabel: { marginLeft: '0.5rem' },
                optionDetails: {
                  value: {
                    color: sacredtheme ? '#FFD700' : 'inherit',
                    fontWeight: '500',
                  },
                  attribute: {
                    fontSize: '0.875rem',
                    color: sacredtheme ? 'rgba(255, 215, 0, 0.7)' : '#718096',
                    fontStyle: 'italic',
                  },
                },
              }))(sacredtheme, void 0, void 0, void 0),
              unifiedOptions = (0, react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(
                () =>
                  !0 === userSpecifiedComplexOptions ||
                  (!1 !== userSpecifiedComplexOptions &&
                    options.length > 0 &&
                    isDropdownOption(options[0]))
                    ? options
                        .filter(isDropdownOption)
                        .map(o => ({
                          value: o.value,
                          label:
                            showOptionDetails && o.attribute1
                              ? (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                  'div',
                                  {
                                    children: [
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                        'div',
                                        {
                                          style: styles.optionDetails.value,
                                          children: o.value,
                                        }
                                      ),
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                        'div',
                                        {
                                          style: styles.optionDetails.attribute,
                                          children: o.attribute1,
                                        }
                                      ),
                                    ],
                                  }
                                )
                              : o.value,
                        }))
                    : options
                        .filter(o => 'string' == typeof o)
                        .map(o => ({ value: o, label: o })),
                [
                  options,
                  userSpecifiedComplexOptions,
                  showOptionDetails,
                  styles.optionDetails,
                ]
              ),
              handleToggle = value => {
                const newSelectedValues = selectedValues.includes(value)
                  ? selectedValues.filter(v => v !== value)
                  : [...selectedValues, value]
                ;(setSelectedValues(newSelectedValues),
                  null == onChange || onChange(newSelectedValues))
              }
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: styles.container,
                ...rest,
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      onClick: event => {
                        ;(setAnchorEl(event.currentTarget), setIsOpen(!0))
                      },
                      ref: setAnchorEl,
                      style: styles.chipContainer,
                      children: [
                        0 === selectedValues.length &&
                          (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            'span',
                            { style: styles.placeholder, children: label }
                          ),
                        selectedValues.map(value =>
                          (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            _Chip__WEBPACK_IMPORTED_MODULE_4__.A,
                            {
                              label: value,
                              onDelete: () => handleToggle(value),
                              styles: {
                                theme: sacredtheme ? 'sacred' : 'light',
                              },
                            },
                            value
                          )
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _Icons_ArrowDropDown__WEBPACK_IMPORTED_MODULE_5__.A,
                          { style: styles.arrowIcon }
                        ),
                      ],
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _Popover__WEBPACK_IMPORTED_MODULE_2__.A,
                    {
                      open: isOpen,
                      onClose: () => {
                        ;(setIsOpen(!1), setAnchorEl(null))
                      },
                      anchorEl,
                      children: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'div',
                        {
                          style: styles.popoverContent,
                          children: unifiedOptions.map(option =>
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                              'div',
                              {
                                onClick: () => handleToggle(option.value),
                                style: styles.option,
                                children: [
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    _Checkbox__WEBPACK_IMPORTED_MODULE_3__.A,
                                    {
                                      checked: selectedValues.includes(
                                        option.value
                                      ),
                                      onChange: () => {},
                                      styles: {
                                        theme: sacredtheme ? 'sacred' : 'light',
                                      },
                                    }
                                  ),
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    'div',
                                    {
                                      style: styles.optionLabel,
                                      children: option.label,
                                    }
                                  ),
                                ],
                              },
                              option.value
                            )
                          ),
                        }
                      ),
                    }
                  ),
                  helperText &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      'div',
                      {
                        style: {
                          marginTop: '4px',
                          fontSize: '14px',
                          color: sacredtheme
                            ? 'rgba(255, 215, 0, 0.7)'
                            : '#6B7280',
                        },
                        children: helperText,
                      }
                    ),
                ],
              }
            )
          },
          __WEBPACK_DEFAULT_EXPORT__ = MultiSelectChip
        MultiSelectChip.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'MultiSelectChip',
          props: {
            label: {
              required: !1,
              tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
              description: '',
              defaultValue: { value: "'Chip'", computed: !1 },
            },
            options: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'union',
                    raw: 'string | DropdownOption',
                    elements: [{ name: 'string' }, { name: 'DropdownOption' }],
                  },
                ],
                raw: 'MultiSelectOption[]',
              },
              description: '',
              defaultValue: { value: '[]', computed: !1 },
            },
            defaultSelected: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [{ name: 'string' }],
                raw: 'string[]',
              },
              description: '',
              defaultValue: { value: '[]', computed: !1 },
            },
            onChange: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(values: string[]) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'Array',
                        elements: [{ name: 'string' }],
                        raw: 'string[]',
                      },
                      name: 'values',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            complexOptions: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
            },
            showOptionDetails: {
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
              tsType: {
                name: 'signature',
                type: 'object',
                raw: "{\n  theme?: 'light' | 'dark' | 'sacred'\n  disabled?: boolean\n  required?: boolean\n  height?: string\n  width?: string\n  borderRadius?: string\n  borderWidth?: string\n  padding?: string\n  fontSize?: string\n  fontWeight?: string\n  lineHeight?: string\n  helperTextType?: 'error' | 'info'\n  requiredIndicatorText?: string\n  container?: React.CSSProperties\n}",
                signature: {
                  properties: [
                    {
                      key: 'theme',
                      value: {
                        name: 'union',
                        raw: "'light' | 'dark' | 'sacred'",
                        elements: [
                          { name: 'literal', value: "'light'" },
                          { name: 'literal', value: "'dark'" },
                          { name: 'literal', value: "'sacred'" },
                        ],
                        required: !1,
                      },
                    },
                    {
                      key: 'disabled',
                      value: { name: 'boolean', required: !1 },
                    },
                    {
                      key: 'required',
                      value: { name: 'boolean', required: !1 },
                    },
                    { key: 'height', value: { name: 'string', required: !1 } },
                    { key: 'width', value: { name: 'string', required: !1 } },
                    {
                      key: 'borderRadius',
                      value: { name: 'string', required: !1 },
                    },
                    {
                      key: 'borderWidth',
                      value: { name: 'string', required: !1 },
                    },
                    { key: 'padding', value: { name: 'string', required: !1 } },
                    {
                      key: 'fontSize',
                      value: { name: 'string', required: !1 },
                    },
                    {
                      key: 'fontWeight',
                      value: { name: 'string', required: !1 },
                    },
                    {
                      key: 'lineHeight',
                      value: { name: 'string', required: !1 },
                    },
                    {
                      key: 'helperTextType',
                      value: {
                        name: 'union',
                        raw: "'error' | 'info'",
                        elements: [
                          { name: 'literal', value: "'error'" },
                          { name: 'literal', value: "'info'" },
                        ],
                        required: !1,
                      },
                    },
                    {
                      key: 'requiredIndicatorText',
                      value: { name: 'string', required: !1 },
                    },
                    {
                      key: 'container',
                      value: {
                        name: 'ReactCSSProperties',
                        raw: 'React.CSSProperties',
                        required: !1,
                      },
                    },
                  ],
                },
              },
              description: '',
            },
          },
        }
      },
      './src/components/Icons/ArrowDropDown.tsx': (
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
          ArrowDropDownIcon = ({
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
                        { d: 'M7 10l5 5 5-5z' }
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
          __WEBPACK_DEFAULT_EXPORT__ = ArrowDropDownIcon
        ArrowDropDownIcon.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ArrowDropDownIcon',
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
      './src/components/Icons/Close.tsx': (
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
          CloseIcon = ({
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
                        {
                          d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
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
          __WEBPACK_DEFAULT_EXPORT__ = CloseIcon
        CloseIcon.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'CloseIcon',
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
