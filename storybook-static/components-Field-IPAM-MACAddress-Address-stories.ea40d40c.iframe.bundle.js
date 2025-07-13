'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [4205],
    {
      './src/components/Field/IPAM/MACAddress/Address.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            InteractiveDemo: () => InteractiveDemo,
            PremiumTheme: () => PremiumTheme,
            SacredTheme: () => SacredTheme,
            __namedExportsOrder: () => __namedExportsOrder,
            default: () => Address_stories,
          }))
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          theme = __webpack_require__('./src/theme/index.ts')
        const isValidMACAddress = mac => {
            const segments = mac.split(':')
            return (
              6 === segments.length &&
              segments.every(
                segment =>
                  (segment =>
                    '' === segment || /^[0-9a-fA-F]{1,2}$/.test(segment))(
                    segment
                  ) && '' !== segment
              )
            )
          },
          MACAddressField = ({
            initialValue = '',
            onChange,
            label = 'MAC Address',
            helperText,
            disabled,
            styles,
            ...rest
          }) => {
            const [value, setValue] = (0, react.useState)(initialValue),
              [isValid, setIsValid] = (0, react.useState)(
                '' === initialValue || isValidMACAddress(initialValue)
              ),
              lastInputTypeWasDelete = (0, react.useRef)(!1)
            ;(0, react.useEffect)(() => {
              if (initialValue) {
                const validMAC = isValidMACAddress(initialValue)
                setIsValid(validMAC)
              }
            }, [initialValue])
            const formatMACAddress = (0, react.useCallback)(
                (input, wasDelete) => {
                  let formatted = input
                    .replace(/[^0-9a-fA-F:]/g, '')
                    .toUpperCase()
                  ;((formatted = formatted.replace(/:{2,}/g, ':')),
                    (formatted = formatted.replace(/^:/, '')))
                  const colons = formatted.match(/:/g)
                  colons &&
                    colons.length > 5 &&
                    (formatted = formatted.substring(
                      0,
                      formatted.lastIndexOf(':')
                    ))
                  const segments = formatted.split(':')
                  for (let i = 0; i < segments.length; i++)
                    segments[i].length > 2 &&
                      (segments[i] = segments[i].substring(0, 2))
                  if (((formatted = segments.join(':')), !wasDelete)) {
                    const segments = formatted.split(':')
                    if (segments.length < 6) {
                      2 === segments[segments.length - 1].length &&
                        segments.length < 6 &&
                        (formatted += ':')
                    }
                  }
                  return formatted
                },
                []
              ),
              validateMACAddress = (0, react.useCallback)(
                mac => '' === mac || isValidMACAddress(mac),
                []
              ),
              handleTextFieldChange = (0, react.useCallback)(
                newValue => {
                  lastInputTypeWasDelete.current =
                    newValue.length < value.length
                  const formattedValue = formatMACAddress(
                      newValue,
                      lastInputTypeWasDelete.current
                    ),
                    valid = validateMACAddress(formattedValue)
                  if ((setValue(formattedValue), setIsValid(valid), onChange)) {
                    onChange({
                      target: { value: formattedValue },
                      currentTarget: { value: formattedValue },
                    })
                  }
                },
                [onChange, formatMACAddress, validateMACAddress, value]
              ),
              handlePaste = (0, react.useCallback)(
                event => {
                  event.preventDefault()
                  const pastedText = event.clipboardData.getData('text'),
                    formattedValue = formatMACAddress(pastedText, !1)
                  ;(setValue(formattedValue),
                    setIsValid(validateMACAddress(formattedValue)))
                  null == onChange ||
                    onChange({ target: { value: formattedValue } })
                },
                [formatMACAddress, onChange, validateMACAddress]
              ),
              error = isValid
                ? helperText
                : 'Please enter a valid MAC address (XX:XX:XX:XX:XX:XX)',
              mergedStyles = {
                ...styles,
                disabled:
                  void 0 !== disabled
                    ? disabled
                    : null == styles
                      ? void 0
                      : styles.disabled,
              },
              {
                themeConfig,
                borderColor,
                labelColor,
                footerTextColor,
                transition,
              } = (0, theme.AW)(mergedStyles, !1),
              componentStyles = {
                container: (0, theme.ZZ)(mergedStyles),
                inputWrapper: {
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  height:
                    (null == mergedStyles ? void 0 : mergedStyles.height) ||
                    '40px',
                  width: '100%',
                  border: `${(null == mergedStyles ? void 0 : mergedStyles.borderWidth) || '1px'} solid ${borderColor}`,
                  borderRadius:
                    (null == mergedStyles
                      ? void 0
                      : mergedStyles.borderRadius) || '8px',
                  backgroundColor: themeConfig.background,
                  color: themeConfig.text,
                  margin: 0,
                  padding: 0,
                  boxSizing: 'border-box',
                  transition,
                },
                input: {
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'transparent',
                  outline: 'none',
                  border: 'none',
                  padding:
                    (null == mergedStyles ? void 0 : mergedStyles.padding) ||
                    '8px 16px',
                  fontSize:
                    (null == mergedStyles ? void 0 : mergedStyles.fontSize) ||
                    '16px',
                  fontWeight:
                    null == mergedStyles ? void 0 : mergedStyles.fontWeight,
                  lineHeight:
                    null == mergedStyles ? void 0 : mergedStyles.lineHeight,
                  fontFamily: themeConfig.fontFamily,
                  color: 'inherit',
                  boxSizing: 'border-box',
                },
                label: (0, theme.Wh)(labelColor, themeConfig),
                footerText: (0, theme.En)(
                  footerTextColor,
                  themeConfig,
                  mergedStyles
                ),
              }
            return (0, jsx_runtime.jsxs)('div', {
              style: componentStyles.container,
              children: [
                label &&
                  (0, jsx_runtime.jsxs)('label', {
                    style: componentStyles.label,
                    children: [
                      label,
                      (null == mergedStyles ? void 0 : mergedStyles.required) &&
                        (0, jsx_runtime.jsx)('span', {
                          style: (0, theme.sz)(mergedStyles),
                          children:
                            (null == mergedStyles
                              ? void 0
                              : mergedStyles.requiredIndicatorText) || ' *',
                        }),
                    ],
                  }),
                (0, jsx_runtime.jsx)('div', {
                  style: componentStyles.inputWrapper,
                  children: (0, jsx_runtime.jsx)('input', {
                    ...rest,
                    ...(0, theme.SI)(
                      null == mergedStyles ? void 0 : mergedStyles.required
                    ),
                    value,
                    disabled:
                      null == mergedStyles ? void 0 : mergedStyles.disabled,
                    onChange: e => handleTextFieldChange(e.target.value),
                    onPaste: handlePaste,
                    placeholder: '00:1A:2B:3C:4D:5E',
                    style: componentStyles.input,
                  }),
                }),
                error &&
                  (0, jsx_runtime.jsx)('div', {
                    style: componentStyles.footerText,
                    children: error,
                  }),
              ],
            })
          },
          MACAddress = MACAddressField
        MACAddressField.__docgenInfo = {
          description:
            'A specialized text field for MAC address management\n- Validates MAC addresses in proper format\n- Automatically adds colons after every 2 hex digits\n- Only allows valid MAC address format (XX:XX:XX:XX:XX:XX)\n- Converts all inputs to uppercase\n- Requires complete MAC addresses',
          methods: [],
          displayName: 'MACAddressField',
          props: {
            initialValue: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "''", computed: !1 },
            },
            onChange: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.ChangeEvent<HTMLInputElement>) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactChangeEvent',
                        raw: 'React.ChangeEvent<HTMLInputElement>',
                        elements: [{ name: 'HTMLInputElement' }],
                      },
                      name: 'event',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description:
                'A standard ChangeEvent<HTMLInputElement> so parent can do\ne.g. (event) => getMacValue(event.target.value) ...',
            },
            label: {
              required: !1,
              tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
              description: '',
              defaultValue: { value: "'MAC Address'", computed: !1 },
            },
            helperText: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            disabled: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'FormFieldStyles' },
              description: '',
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
              description: '',
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
              description: '',
            },
            onKeyDown: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.KeyboardEvent<HTMLInputElement>) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactKeyboardEvent',
                        raw: 'React.KeyboardEvent<HTMLInputElement>',
                        elements: [{ name: 'HTMLInputElement' }],
                      },
                      name: 'event',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onClick: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.MouseEvent<HTMLInputElement>) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactMouseEvent',
                        raw: 'React.MouseEvent<HTMLInputElement>',
                        elements: [{ name: 'HTMLInputElement' }],
                      },
                      name: 'event',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onPaste: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.ClipboardEvent<HTMLInputElement>) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactClipboardEvent',
                        raw: 'React.ClipboardEvent<HTMLInputElement>',
                        elements: [{ name: 'HTMLInputElement' }],
                      },
                      name: 'event',
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
            id: { required: !1, tsType: { name: 'string' }, description: '' },
            autoComplete: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
          },
        }
        const Address_stories = {
            title: 'Components/Field/IPAM/MACAddress',
            component: MACAddress,
            argTypes: {
              disabled: { control: 'boolean' },
              label: { control: 'text' },
              helperText: { control: 'text' },
              styles: { control: 'object' },
            },
            parameters: { layout: 'centered' },
          },
          PremiumTheme = {
            name: 'Premium Theme',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                className: 'w-[400px] p-6 bg-gray-50 rounded-lg',
                children: (0, jsx_runtime.jsx)(MACAddress, { ...args }),
              }),
            args: { label: 'MAC Address', styles: { theme: 'light' } },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                className: 'w-[400px] p-6 bg-black rounded-lg',
                children: (0, jsx_runtime.jsx)(MACAddress, { ...args }),
              }),
            args: { ...PremiumTheme.args, styles: { theme: 'sacred' } },
          },
          InteractiveMACAddressDemo = () => {
            const [sacredtheme, setsacredtheme] = react.useState(!1),
              [disabled, setDisabled] = react.useState(!1),
              [showHelperText, setShowHelperText] = react.useState(!1),
              [value, setValue] = react.useState('00:1A:2B:3C:4D:5E')
            return (0, jsx_runtime.jsxs)('div', {
              className: 'w-[500px] space-y-4',
              children: [
                (0, jsx_runtime.jsxs)('div', {
                  className: 'p-4 bg-white rounded-lg border',
                  children: [
                    (0, jsx_runtime.jsx)('h3', {
                      style: { fontWeight: 'bold', marginBottom: '0.5rem' },
                      children: 'Controls',
                    }),
                    (0, jsx_runtime.jsxs)('div', {
                      className: 'grid grid-cols-3 gap-2',
                      children: [
                        (0, jsx_runtime.jsxs)('label', {
                          children: [
                            (0, jsx_runtime.jsx)('input', {
                              type: 'checkbox',
                              checked: sacredtheme,
                              onChange: e => setsacredtheme(e.target.checked),
                            }),
                            ' ',
                            'Sacred',
                          ],
                        }),
                        (0, jsx_runtime.jsxs)('label', {
                          children: [
                            (0, jsx_runtime.jsx)('input', {
                              type: 'checkbox',
                              checked: disabled,
                              onChange: e => setDisabled(e.target.checked),
                            }),
                            ' ',
                            'Disabled',
                          ],
                        }),
                        (0, jsx_runtime.jsxs)('label', {
                          children: [
                            (0, jsx_runtime.jsx)('input', {
                              type: 'checkbox',
                              checked: showHelperText,
                              onChange: e =>
                                setShowHelperText(e.target.checked),
                            }),
                            ' ',
                            'Helper Text',
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, jsx_runtime.jsx)('div', {
                  className:
                    'p-6 rounded-lg ' +
                    (sacredtheme ? 'bg-black' : 'bg-gray-50'),
                  children: (0, jsx_runtime.jsx)(MACAddress, {
                    label: 'Interactive MAC Address',
                    initialValue: value,
                    onChange: e => setValue(e.target.value),
                    styles: { theme: sacredtheme ? 'sacred' : 'light' },
                    disabled,
                    helperText: showHelperText
                      ? 'Enter a valid MAC address'
                      : void 0,
                  }),
                }),
              ],
            })
          },
          InteractiveDemo = {
            name: 'Interactive Demo',
            render: () => (0, jsx_runtime.jsx)(InteractiveMACAddressDemo, {}),
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
