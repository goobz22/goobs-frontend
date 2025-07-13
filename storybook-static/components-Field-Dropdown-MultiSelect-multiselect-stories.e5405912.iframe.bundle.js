'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [3626],
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
      './src/components/Field/Dropdown/MultiSelect/multiselect.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            Interactive: () => Interactive,
            Premium: () => Premium,
            __namedExportsOrder: () => __namedExportsOrder,
            default: () => __WEBPACK_DEFAULT_EXPORT__,
            sacredtheme: () => sacredtheme,
          }))
        var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ =
            __webpack_require__(
              './node_modules/next/dist/compiled/react/jsx-runtime.js'
            ),
          react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          _index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
            './src/components/Field/Dropdown/MultiSelect/index.tsx'
          )
        const __WEBPACK_DEFAULT_EXPORT__ = {
            title: 'Components/Field/Dropdown/MultiSelect',
            component: _index__WEBPACK_IMPORTED_MODULE_2__.A,
            argTypes: {
              label: { control: 'text' },
              helperText: { control: 'text' },
              styles: { control: 'object' },
            },
            parameters: { layout: 'centered' },
          },
          NAMES = [
            'Oliver Hansen',
            'Van Henry',
            'April Tucker',
            'Ralph Hubbard',
            'Omar Alexander',
            'Carlos Abbott',
            'Miriam Wagner',
            'Bradley Wilkerson',
            'Virginia Andrews',
            'Kelly Snyder',
          ],
          Premium = {
            name: 'Premium Theme',
            render: args =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                style: {
                  width: '400px',
                  padding: '2rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.5rem',
                },
                children: (0,
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  _index__WEBPACK_IMPORTED_MODULE_2__.A,
                  { ...args }
                ),
              }),
            args: {
              label: 'Select Names',
              options: NAMES,
              styles: { theme: 'light' },
            },
          },
          sacredtheme = {
            name: 'Sacred Theme',
            render: args =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                style: {
                  width: '400px',
                  padding: '2rem',
                  backgroundColor: 'black',
                  borderRadius: '0.5rem',
                },
                children: (0,
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  _index__WEBPACK_IMPORTED_MODULE_2__.A,
                  { ...args }
                ),
              }),
            args: { ...Premium.args, styles: { theme: 'sacred' } },
          },
          InteractiveDemo = () => {
            const [sacredtheme, setsacredtheme] =
                react__WEBPACK_IMPORTED_MODULE_1__.useState(!1),
              [selected, setSelected] =
                react__WEBPACK_IMPORTED_MODULE_1__.useState(['Van Henry'])
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: {
                  width: '500px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      style: {
                        padding: '1rem',
                        border: '1px solid #ccc',
                        borderRadius: '0.5rem',
                      },
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'h3',
                          {
                            style: {
                              fontWeight: 'bold',
                              marginBottom: '0.5rem',
                            },
                            children: 'Controls',
                          }
                        ),
                        (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'label',
                          {
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                'input',
                                {
                                  type: 'checkbox',
                                  checked: sacredtheme,
                                  onChange: e =>
                                    setsacredtheme(e.target.checked),
                                }
                              ),
                              ' ',
                              'Sacred Theme',
                            ],
                          }
                        ),
                      ],
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'div',
                    {
                      style: {
                        padding: '2rem',
                        borderRadius: '0.5rem',
                        backgroundColor: sacredtheme ? 'black' : '#f3f4f6',
                      },
                      children: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        _index__WEBPACK_IMPORTED_MODULE_2__.A,
                        {
                          label: 'Select Names',
                          options: NAMES,
                          defaultSelected: selected,
                          onChange: setSelected,
                          styles: { theme: sacredtheme ? 'sacred' : 'light' },
                        }
                      ),
                    }
                  ),
                ],
              }
            )
          },
          Interactive = {
            name: 'Interactive Demo',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                InteractiveDemo,
                {}
              ),
          },
          __namedExportsOrder = ['Premium', 'sacredtheme', 'Interactive']
      },
    },
  ]
)
