;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [5575],
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
      './src/components/Checkbox/index.tsx': (
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
      './src/components/TransferList/transferlist.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        'use strict'
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            InteractiveDemo: () => InteractiveDemo,
            PremiumTheme: () => PremiumTheme,
            SacredTheme: () => SacredTheme,
            __namedExportsOrder: () => __namedExportsOrder,
            default: () => transferlist_stories,
          }))
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          Regular = __webpack_require__(
            './src/components/Field/Dropdown/Regular/index.tsx'
          ),
          Checkbox = __webpack_require__('./src/components/Checkbox/index.tsx')
        function not(a, b) {
          return a.filter(value => -1 === b.indexOf(value))
        }
        function intersection(a, b) {
          return a.filter(value => -1 !== b.indexOf(value))
        }
        const premiumStyles = {
            container: {
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            },
            column: { display: 'flex', flexDirection: 'column', width: '100%' },
            title: {
              marginBottom: '8px',
              fontWeight: 600,
              color: 'rgb(17, 24, 39)',
              fontFamily: '"Inter", sans-serif',
            },
            list: {
              width: '100%',
              height: '232px',
              overflow: 'auto',
              marginTop: '8px',
              border: '1px solid rgb(209, 213, 219)',
              borderRadius: '4px',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
              backgroundColor: 'white',
            },
            listItem: {
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              borderBottom: '1px solid rgb(229, 231, 235)',
            },
            listItemHover: { backgroundColor: 'rgb(249, 250, 251)' },
            listItemChecked: {
              backgroundColor: 'rgb(239, 246, 255)',
              borderLeft: '4px solid rgb(59, 130, 246)',
            },
            checkboxContainer: {
              display: 'flex',
              alignItems: 'center',
              marginRight: '12px',
            },
            label: { flex: 1, fontWeight: 500, color: 'rgb(17, 24, 39)' },
            buttonGroup: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '64px',
              gap: '4px',
            },
            button: {
              padding: '4px 12px',
              fontSize: '14px',
              border: '1px solid rgb(209, 213, 219)',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
              backgroundColor: 'white',
              color: 'rgb(55, 65, 81)',
            },
            buttonHover: { backgroundColor: 'rgb(249, 250, 251)' },
            buttonDisabled: { opacity: 0.5, cursor: 'not-allowed' },
          },
          sacredStyles = {
            container: {
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
              padding: '16px',
              backgroundColor: 'rgba(10, 10, 10, 0.6)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              position: 'relative',
            },
            column: { display: 'flex', flexDirection: 'column', width: '100%' },
            title: {
              marginBottom: '8px',
              fontWeight: 600,
              color: '#FFD700',
              fontFamily: '"Cinzel", serif',
              letterSpacing: '0.05em',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
            },
            list: {
              width: '100%',
              height: '232px',
              overflow: 'auto',
              marginTop: '8px',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '4px',
              backgroundColor: 'rgba(0,0,0,0.8)',
              animation: 'sacred-glow-pulse 2s infinite alternate',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255, 215, 0, 0.5) rgba(0, 0, 0, 0.3)',
            },
            listItem: {
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              textAlign: 'left',
              transition: 'all 0.3s ease',
              color: '#FFD700',
              borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
              backgroundColor: 'rgba(0,0,0,0.9)',
              border: '1px solid rgba(255, 215, 0, 0.1)',
              borderRadius: '4px',
              margin: '4px 0',
              boxShadow: '0 0 5px rgba(255, 215, 0, 0.1)',
            },
            listItemHover: {
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              transform: 'translateX(4px)',
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
            },
            listItemChecked: {
              backgroundColor: 'rgba(255, 215, 0, 0.2)',
              borderLeft: '4px solid #FFD700',
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
            },
            checkboxContainer: {
              display: 'flex',
              alignItems: 'center',
              marginRight: '12px',
            },
            label: {
              flex: 1,
              fontWeight: 500,
              color: '#FFD700',
              textShadow: '0 0 5px rgba(255, 215, 0, 0.3)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            buttonGroup: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '64px',
              gap: '4px',
            },
            button: {
              padding: '4px 12px',
              fontSize: '14px',
              border: '1px solid #FFD700',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: '#FFD700',
              animation: 'sacred-float 3s infinite ease-in-out',
            },
            buttonHover: {
              backgroundColor: 'rgba(255, 215, 0, 0.2)',
              transform: 'scale(1.1)',
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
            },
            buttonDisabled: {
              opacity: 0.5,
              cursor: 'not-allowed',
              color: '#FFD700',
              borderColor: '#FFD700',
            },
            glyph: {
              position: 'absolute',
              top: '8px',
              right: '8px',
              fontSize: '20px',
              color: 'rgba(255, 215, 0, 0.2)',
              animation: 'glyph-rotate 20s linear infinite',
            },
          },
          TransferList = ({
            variant = 'singleSelection',
            leftItems = [],
            rightItems = [],
            dropdownLabel,
            dropdownOptions = [],
            dropdownDataMap = {},
            itemLabelMap,
            onChange,
            leftTitle = 'Unassigned',
            rightTitle = 'Assigned',
            sacredtheme = !1,
            className,
            style,
          }) => {
            const [selectedDropdownValue, setSelectedDropdownValue] = (0,
              react.useState)(''),
              [checked, setChecked] = (0, react.useState)([]),
              [hoveredButton, setHoveredButton] = (0, react.useState)(null),
              [hoveredItem, setHoveredItem] = (0, react.useState)(null),
              styles = sacredtheme ? sacredStyles : premiumStyles
            let currentLeft = leftItems,
              currentRight = rightItems
            var _dropdownDataMap_selectedDropdownValue,
              _dropdownDataMap_selectedDropdownValue1,
              _dropdownDataMap_selectedDropdownValue_leftItems,
              _dropdownDataMap_selectedDropdownValue_rightItems
            'multipleSelection' === variant &&
              ((currentLeft =
                null !==
                  (_dropdownDataMap_selectedDropdownValue_leftItems =
                    null ===
                      (_dropdownDataMap_selectedDropdownValue =
                        dropdownDataMap[selectedDropdownValue]) ||
                    void 0 === _dropdownDataMap_selectedDropdownValue
                      ? void 0
                      : _dropdownDataMap_selectedDropdownValue.leftItems) &&
                void 0 !== _dropdownDataMap_selectedDropdownValue_leftItems
                  ? _dropdownDataMap_selectedDropdownValue_leftItems
                  : []),
              (currentRight =
                null !==
                  (_dropdownDataMap_selectedDropdownValue_rightItems =
                    null ===
                      (_dropdownDataMap_selectedDropdownValue1 =
                        dropdownDataMap[selectedDropdownValue]) ||
                    void 0 === _dropdownDataMap_selectedDropdownValue1
                      ? void 0
                      : _dropdownDataMap_selectedDropdownValue1.rightItems) &&
                void 0 !== _dropdownDataMap_selectedDropdownValue_rightItems
                  ? _dropdownDataMap_selectedDropdownValue_rightItems
                  : []))
            ;(0, react.useEffect)(() => {
              'multipleSelection' === variant && setChecked([])
            }, [variant, selectedDropdownValue])
            const leftChecked = intersection(checked, currentLeft),
              rightChecked = intersection(checked, currentRight),
              handleToggle = value => () => {
                const currentIndex = checked.indexOf(value),
                  newChecked = [...checked]
                ;(-1 === currentIndex
                  ? newChecked.push(value)
                  : newChecked.splice(currentIndex, 1),
                  setChecked(newChecked))
              },
              renderList = items =>
                (0, jsx_runtime.jsx)('div', {
                  style: styles.list,
                  children: (0, jsx_runtime.jsx)('div', {
                    style: { borderBottom: 'none' },
                    children: items.map(value => {
                      const labelId = `transfer-list-item-${value}-label`,
                        isChecked = -1 !== checked.indexOf(value),
                        displayedLabel =
                          (null == itemLabelMap
                            ? void 0
                            : itemLabelMap[value]) || value,
                        listItemStyle = {
                          ...styles.listItem,
                          ...(hoveredItem === value && styles.listItemHover),
                          ...(isChecked && styles.listItemChecked),
                        }
                      return (0, jsx_runtime.jsxs)(
                        'button',
                        {
                          onClick: handleToggle(value),
                          style: listItemStyle,
                          onMouseEnter: () => setHoveredItem(value),
                          onMouseLeave: () => setHoveredItem(null),
                          children: [
                            (0, jsx_runtime.jsx)('div', {
                              style: styles.checkboxContainer,
                              children: (0, jsx_runtime.jsx)(Checkbox.A, {
                                checked: isChecked,
                                onChange: () => {},
                                'aria-labelledby': labelId,
                                styles: {
                                  theme: sacredtheme ? 'sacred' : 'light',
                                },
                              }),
                            }),
                            (0, jsx_runtime.jsx)('span', {
                              id: labelId,
                              style: styles.label,
                              children: displayedLabel,
                            }),
                          ],
                        },
                        value
                      )
                    }),
                  }),
                }),
              TransferButton = ({
                onClick,
                disabled,
                'aria-label': ariaLabel,
                children,
                name,
              }) => {
                const buttonStyle = {
                  ...styles.button,
                  ...(hoveredButton === name &&
                    !disabled &&
                    styles.buttonHover),
                  ...(disabled && styles.buttonDisabled),
                  ...(sacredtheme && {
                    animationDelay: 'all-left' === name ? '0.5s' : void 0,
                  }),
                }
                return (0, jsx_runtime.jsx)('button', {
                  onClick,
                  disabled,
                  'aria-label': ariaLabel,
                  style: buttonStyle,
                  onMouseEnter: () => setHoveredButton(name),
                  onMouseLeave: () => setHoveredButton(null),
                  children,
                })
              }
            return (0, jsx_runtime.jsxs)('div', {
              style: { ...styles.container, ...style },
              className,
              children: [
                sacredtheme &&
                  (0, jsx_runtime.jsx)('div', {
                    style: sacredStyles.glyph,
                    children: '𓊨',
                  }),
                (0, jsx_runtime.jsx)('div', {
                  style: styles.column,
                  children:
                    'singleSelection' === variant
                      ? (0, jsx_runtime.jsxs)('div', {
                          style: styles.column,
                          children: [
                            (0, jsx_runtime.jsx)('h3', {
                              style: styles.title,
                              children: leftTitle,
                            }),
                            renderList(currentLeft),
                          ],
                        })
                      : (0, jsx_runtime.jsxs)('div', {
                          style: styles.column,
                          children: [
                            (0, jsx_runtime.jsx)(Regular.A, {
                              label: dropdownLabel || '',
                              options: dropdownOptions,
                              value: selectedDropdownValue,
                              onChange: e =>
                                setSelectedDropdownValue(e.target.value),
                              styles: {
                                theme: sacredtheme ? 'sacred' : 'light',
                              },
                            }),
                            renderList(currentLeft),
                          ],
                        }),
                }),
                (0, jsx_runtime.jsxs)('div', {
                  style: styles.buttonGroup,
                  children: [
                    (0, jsx_runtime.jsx)(TransferButton, {
                      onClick: () => {
                        const newRight = [...currentRight, ...currentLeft]
                        ;(onChange(
                          [],
                          newRight,
                          'multipleSelection' === variant
                            ? selectedDropdownValue
                            : void 0
                        ),
                          setChecked([]))
                      },
                      disabled: 0 === currentLeft.length,
                      'aria-label': 'move all right',
                      name: 'all-right',
                      children: '≫',
                    }),
                    (0, jsx_runtime.jsx)(TransferButton, {
                      onClick: () => {
                        const newRight = [...currentRight, ...leftChecked],
                          newLeft = not(currentLeft, leftChecked)
                        ;(setChecked(not(checked, leftChecked)),
                          onChange(
                            newLeft,
                            newRight,
                            'multipleSelection' === variant
                              ? selectedDropdownValue
                              : void 0
                          ))
                      },
                      disabled: 0 === leftChecked.length,
                      'aria-label': 'move selected right',
                      name: 'checked-right',
                      children: '>',
                    }),
                    (0, jsx_runtime.jsx)(TransferButton, {
                      onClick: () => {
                        const newLeft = [...currentLeft, ...rightChecked],
                          newRight = not(currentRight, rightChecked)
                        ;(setChecked(not(checked, rightChecked)),
                          onChange(
                            newLeft,
                            newRight,
                            'multipleSelection' === variant
                              ? selectedDropdownValue
                              : void 0
                          ))
                      },
                      disabled: 0 === rightChecked.length,
                      'aria-label': 'move selected left',
                      name: 'checked-left',
                      children: '<',
                    }),
                    (0, jsx_runtime.jsx)(TransferButton, {
                      onClick: () => {
                        const newLeft = [...currentLeft, ...currentRight]
                        ;(onChange(
                          newLeft,
                          [],
                          'multipleSelection' === variant
                            ? selectedDropdownValue
                            : void 0
                        ),
                          setChecked([]))
                      },
                      disabled: 0 === currentRight.length,
                      'aria-label': 'move all left',
                      name: 'all-left',
                      children: '≪',
                    }),
                  ],
                }),
                (0, jsx_runtime.jsxs)('div', {
                  style: styles.column,
                  children: [
                    (0, jsx_runtime.jsx)('h3', {
                      style: styles.title,
                      children: rightTitle,
                    }),
                    renderList(currentRight),
                  ],
                }),
              ],
            })
          },
          components_TransferList = TransferList
        TransferList.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'TransferList',
          props: {
            variant: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "'singleSelection' | 'multipleSelection'",
                elements: [
                  { name: 'literal', value: "'singleSelection'" },
                  { name: 'literal', value: "'multipleSelection'" },
                ],
              },
              description: '',
              defaultValue: { value: "'singleSelection'", computed: !1 },
            },
            leftItems: {
              required: !1,
              tsType: { name: 'unknown' },
              description: '',
              defaultValue: { value: '[]', computed: !1 },
            },
            rightItems: {
              required: !1,
              tsType: { name: 'unknown' },
              description: '',
              defaultValue: { value: '[]', computed: !1 },
            },
            dropdownLabel: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            dropdownOptions: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [{ name: 'DropdownOption' }],
                raw: 'DropdownOption[]',
              },
              description: '',
              defaultValue: { value: '[]', computed: !1 },
            },
            dropdownDataMap: {
              required: !1,
              tsType: { name: 'TransferListDropdownDataMap' },
              description: '',
              defaultValue: { value: '{}', computed: !1 },
            },
            itemLabelMap: {
              required: !1,
              tsType: {
                name: 'Record',
                elements: [{ name: 'string' }, { name: 'string' }],
                raw: 'Record<string, string>',
              },
              description: '',
            },
            onChange: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(\n  leftItems: string[],\n  rightItems: string[],\n  dropdownValue?: string\n) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'Array',
                        elements: [{ name: 'string' }],
                        raw: 'string[]',
                      },
                      name: 'leftItems',
                    },
                    {
                      type: {
                        name: 'Array',
                        elements: [{ name: 'string' }],
                        raw: 'string[]',
                      },
                      name: 'rightItems',
                    },
                    { type: { name: 'string' }, name: 'dropdownValue' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            leftTitle: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "'Unassigned'", computed: !1 },
            },
            rightTitle: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "'Assigned'", computed: !1 },
            },
            sacredtheme: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
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
        var dist = __webpack_require__(
            './node_modules/@storybook/test/dist/index.mjs'
          ),
          console = __webpack_require__(
            './node_modules/console-browserify/index.js'
          )
        const transferlist_stories = {
            title: 'Components/TransferList',
            component: components_TransferList,
            argTypes: {
              sacredtheme: { control: 'boolean' },
              variant: {
                control: 'radio',
                options: ['singleSelection', 'multipleSelection'],
              },
            },
            parameters: { layout: 'centered' },
          },
          singleLeftItems = ['Item A', 'Item B', 'Item C', 'Item D', 'Item E'],
          singleRightItems = ['Item X', 'Item Y'],
          dropdownDataMap = {
            knowledgebase: {
              leftItems: ['Solar Flares', 'Galaxy Clusters', 'Nebulas'],
              rightItems: ['Black Holes'],
            },
            topics: {
              leftItems: ['Astro-Physics', 'Quantum Mechanics'],
              rightItems: ['General Relativity'],
            },
          },
          PremiumTheme = {
            name: 'Premium Theme',
            render: args => {
              const Component = () => {
                var _args_leftItems
                const [localLeft, setLocalLeft] = react.useState(
                  null !== (_args_leftItems = args.leftItems) &&
                    void 0 !== _args_leftItems
                    ? _args_leftItems
                    : singleLeftItems
                )
                var _args_rightItems
                const [localRight, setLocalRight] = react.useState(
                  null !== (_args_rightItems = args.rightItems) &&
                    void 0 !== _args_rightItems
                    ? _args_rightItems
                    : singleRightItems
                )
                var _args_dropdownDataMap
                const [localDataMap, setLocalDataMap] = react.useState(
                  null !== (_args_dropdownDataMap = args.dropdownDataMap) &&
                    void 0 !== _args_dropdownDataMap
                    ? _args_dropdownDataMap
                    : dropdownDataMap
                )
                return (0, jsx_runtime.jsxs)('div', {
                  className: 'w-[700px] p-6 bg-gray-50 rounded-lg',
                  children: [
                    (0, jsx_runtime.jsx)('h3', {
                      className:
                        'text-xl font-bold text-gray-800 mb-4 font-inter',
                      children: 'Premium TransferList',
                    }),
                    (0, jsx_runtime.jsx)(components_TransferList, {
                      ...args,
                      leftItems:
                        'singleSelection' === args.variant
                          ? localLeft
                          : args.leftItems,
                      rightItems:
                        'singleSelection' === args.variant
                          ? localRight
                          : args.rightItems,
                      dropdownDataMap:
                        'multipleSelection' === args.variant
                          ? localDataMap
                          : args.dropdownDataMap,
                      onChange: (newLeft, newRight, dropdownValue) => {
                        var _args_onChange
                        ;('multipleSelection' === args.variant && dropdownValue
                          ? setLocalDataMap(prev => ({
                              ...prev,
                              [dropdownValue]: {
                                leftItems: newLeft,
                                rightItems: newRight,
                              },
                            }))
                          : (setLocalLeft(newLeft), setLocalRight(newRight)),
                          null === (_args_onChange = args.onChange) ||
                            void 0 === _args_onChange ||
                            _args_onChange.call(
                              args,
                              newLeft,
                              newRight,
                              dropdownValue
                            ))
                      },
                    }),
                  ],
                })
              }
              return (0, jsx_runtime.jsx)(Component, {})
            },
            args: {
              variant: 'singleSelection',
              leftItems: singleLeftItems,
              rightItems: singleRightItems,
              dropdownLabel: 'Select Category',
              dropdownOptions: [
                { value: '', label: 'Select Category' },
                { value: 'knowledgebase', label: 'Knowledgebase' },
                { value: 'topics', label: 'Topics' },
              ],
              dropdownDataMap,
              itemLabelMap: {
                HIGH: 'High Priority',
                MEDIUM: 'Medium Priority',
                LOW: 'Low Priority',
              },
              onChange: (left, right, dropdownValue) => {
                console.log('Premium TransferList updated:', {
                  left,
                  right,
                  dropdownValue,
                })
              },
              sacredtheme: !1,
            },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: args => {
              const Component = () => {
                var _args_leftItems
                const [localLeft, setLocalLeft] = react.useState(
                  null !== (_args_leftItems = args.leftItems) &&
                    void 0 !== _args_leftItems
                    ? _args_leftItems
                    : singleLeftItems
                )
                var _args_rightItems
                const [localRight, setLocalRight] = react.useState(
                  null !== (_args_rightItems = args.rightItems) &&
                    void 0 !== _args_rightItems
                    ? _args_rightItems
                    : singleRightItems
                )
                var _args_dropdownDataMap
                const [localDataMap, setLocalDataMap] = react.useState(
                  null !== (_args_dropdownDataMap = args.dropdownDataMap) &&
                    void 0 !== _args_dropdownDataMap
                    ? _args_dropdownDataMap
                    : dropdownDataMap
                )
                return (0, jsx_runtime.jsxs)('div', {
                  className:
                    'w-[700px] p-6 bg-black/90 rounded-lg border border-yellow-400/30',
                  children: [
                    (0, jsx_runtime.jsx)('h3', {
                      className:
                        'text-xl font-bold text-yellow-400 mb-4 font-cinzel animate-sacred-glow',
                      children: 'Sacred TransferList',
                    }),
                    (0, jsx_runtime.jsx)(components_TransferList, {
                      ...args,
                      leftItems:
                        'singleSelection' === args.variant
                          ? localLeft
                          : args.leftItems,
                      rightItems:
                        'singleSelection' === args.variant
                          ? localRight
                          : args.rightItems,
                      dropdownDataMap:
                        'multipleSelection' === args.variant
                          ? localDataMap
                          : args.dropdownDataMap,
                      onChange: (newLeft, newRight, dropdownValue) => {
                        var _args_onChange
                        ;('multipleSelection' === args.variant && dropdownValue
                          ? setLocalDataMap(prev => ({
                              ...prev,
                              [dropdownValue]: {
                                leftItems: newLeft,
                                rightItems: newRight,
                              },
                            }))
                          : (setLocalLeft(newLeft), setLocalRight(newRight)),
                          null === (_args_onChange = args.onChange) ||
                            void 0 === _args_onChange ||
                            _args_onChange.call(
                              args,
                              newLeft,
                              newRight,
                              dropdownValue
                            ))
                      },
                    }),
                  ],
                })
              }
              return (0, jsx_runtime.jsx)(Component, {})
            },
            args: { ...PremiumTheme.args, sacredtheme: !0 },
          },
          InteractiveDemoRenderer = () => {
            const [left, setLeft] = react.useState(singleLeftItems),
              [right, setRight] = react.useState(singleRightItems),
              [sacredtheme, setsacredtheme] = react.useState(!1)
            return (0, jsx_runtime.jsxs)('div', {
              className: 'w-[800px] space-y-4',
              children: [
                (0, jsx_runtime.jsx)('div', {
                  className: 'p-4 bg-white rounded-lg border',
                  children: (0, jsx_runtime.jsxs)('label', {
                    className: 'flex items-center gap-2',
                    children: [
                      (0, jsx_runtime.jsx)('input', {
                        type: 'checkbox',
                        checked: sacredtheme,
                        onChange: e => setsacredtheme(e.target.checked),
                      }),
                      'Enable Sacred Theme',
                    ],
                  }),
                }),
                (0, jsx_runtime.jsx)('div', {
                  className:
                    'p-6 rounded-lg ' +
                    (sacredtheme
                      ? 'bg-black/90 border border-yellow-400/30'
                      : 'bg-gray-50'),
                  children: (0, jsx_runtime.jsx)(components_TransferList, {
                    leftItems: left,
                    rightItems: right,
                    onChange: (newLeft, newRight) => {
                      ;(setLeft(newLeft), setRight(newRight))
                    },
                    sacredtheme,
                  }),
                }),
              ],
            })
          },
          InteractiveDemo = {
            name: 'Interactive Demo',
            render: () => (0, jsx_runtime.jsx)(InteractiveDemoRenderer, {}),
            play: async ({ canvasElement }) => {
              const canvas = (0, dist.ux)(canvasElement),
                itemToMove = await canvas.findByText('Item A')
              await dist.Q4.click(itemToMove)
              const moveRightButton = await canvas.findByRole('button', {
                name: 'move selected right',
              })
              await dist.Q4.click(moveRightButton)
            },
          },
          __namedExportsOrder = [
            'PremiumTheme',
            'SacredTheme',
            'InteractiveDemo',
          ]
      },
    },
  ]
)
