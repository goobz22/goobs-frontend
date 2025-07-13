'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [7800],
    {
      './src/components/Field/IPAM/VLAN/VLAN.stories.tsx': (
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
            default: () => VLAN_stories,
          }))
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          InternalIncrement = __webpack_require__(
            './src/components/Field/Number/InternalIncrement/index.tsx'
          )
        const VLANField = ({
            initialValue = '',
            onChange,
            label = 'VLAN ID',
            disabled,
            reservedVLANs = [],
            ...rest
          }) => {
            var _rest_styles
            const [errorMessage, setErrorMessage] = (0, react.useState)(void 0),
              [isValid, setIsValid] = (0, react.useState)(!0),
              [currentValue, setCurrentValue] = (0, react.useState)(
                initialValue
              ),
              valueRef = (0, react.useRef)(initialValue),
              pendingEventRef = (0, react.useRef)(null),
              getValidationResult = (0, react.useCallback)(
                vlanStr => {
                  if (!vlanStr) return { isValid: !0 }
                  const vlanId = parseInt(vlanStr, 10)
                  return isNaN(vlanId)
                    ? { isValid: !1, message: 'VLAN ID must be a number' }
                    : vlanId < 1
                      ? { isValid: !1, message: 'VLAN ID must be at least 1' }
                      : vlanId > 4094
                        ? { isValid: !1, message: 'VLAN ID cannot exceed 4094' }
                        : reservedVLANs.includes(vlanId)
                          ? {
                              isValid: !1,
                              message: `VLAN ID ${vlanId} is reserved and cannot be used`,
                            }
                          : { isValid: !0 }
                },
                [reservedVLANs]
              )
            ;((0, react.useEffect)(() => {
              const result = getValidationResult(currentValue)
              ;(setIsValid(result.isValid), setErrorMessage(result.message))
            }, [currentValue, getValidationResult]),
              (0, react.useEffect)(() => {
                initialValue &&
                  (setCurrentValue(initialValue),
                  (valueRef.current = initialValue))
              }, [initialValue]),
              (0, react.useEffect)(() => {
                ;(valueRef.current !== currentValue &&
                  setCurrentValue(valueRef.current),
                  pendingEventRef.current &&
                    onChange &&
                    (onChange(pendingEventRef.current),
                    (pendingEventRef.current = null)))
              }, [currentValue, onChange]))
            const handleChange = (0, react.useCallback)(
              event => {
                if ('number' == typeof event) {
                  const numValue = event
                  if (reservedVLANs.includes(numValue)) {
                    let nextValue = numValue
                    const maxIterations = 4093
                    let iterations = 0
                    for (
                      ;
                      reservedVLANs.includes(nextValue) &&
                      iterations < maxIterations;

                    )
                      ((nextValue = nextValue >= 4094 ? 1 : nextValue + 1),
                        iterations++)
                    const validValue = nextValue.toString()
                    valueRef.current = validValue
                    const syntheticEvent = { target: { value: validValue } }
                    return void (pendingEventRef.current = syntheticEvent)
                  }
                  const stringValue = numValue.toString()
                  valueRef.current = stringValue
                  const syntheticEvent = { target: { value: stringValue } }
                  return void (pendingEventRef.current = syntheticEvent)
                }
                const stringValue = event.target.value
                ;((valueRef.current = stringValue),
                  (pendingEventRef.current = event),
                  setCurrentValue(prev =>
                    prev === stringValue ? prev + ' ' : stringValue
                  ))
              },
              [reservedVLANs]
            )
            return (0, jsx_runtime.jsx)(InternalIncrement.A, {
              initialValue: currentValue,
              onChange: handleChange,
              label,
              min: 1,
              max: 4094,
              helperText: errorMessage,
              placeholder: '1-4094',
              styles: {
                ...rest.styles,
                helperTextType: isValid ? 'info' : 'error',
                disabled:
                  void 0 !== disabled
                    ? disabled
                    : null === (_rest_styles = rest.styles) ||
                        void 0 === _rest_styles
                      ? void 0
                      : _rest_styles.disabled,
              },
              ...rest,
            })
          },
          VLAN = VLANField
        VLANField.__docgenInfo = {
          description:
            'A specialized field for VLAN ID entry\n- Validates VLAN ID ranges (1-4094)\n- Provides increment/decrement buttons\n- Supports reserved VLAN ID validation\n- Prevents entry of non-numeric characters',
          methods: [],
          displayName: 'VLANField',
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
                'A standard ChangeEvent<HTMLInputElement> so parent can do\ne.g. (event) => getVLANValue(event.target.value) ...',
            },
            label: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "'VLAN ID'", computed: !1 },
            },
            disabled: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
            },
            reservedVLANs: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [{ name: 'number' }],
                raw: 'number[]',
              },
              description: "Array of reserved VLAN IDs that can't be used",
              defaultValue: { value: '[]', computed: !1 },
            },
          },
          composes: ['Omit'],
        }
        var console = __webpack_require__(
          './node_modules/console-browserify/index.js'
        )
        const VLAN_stories = {
            title: 'Components/Field/IPAM/VLAN',
            component: VLAN,
            argTypes: {
              disabled: { control: 'boolean' },
              label: { control: 'text' },
              styles: { control: 'object' },
              reservedVLANs: { control: 'object' },
            },
            parameters: { layout: 'centered' },
          },
          PremiumTheme = {
            name: 'Premium Theme',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                className: 'w-[400px] p-6 bg-gray-50 rounded-lg',
                children: (0, jsx_runtime.jsx)(VLAN, { ...args }),
              }),
            args: {
              label: 'VLAN ID',
              onChange: event =>
                console.log('Value changed:', event.target.value),
              styles: { theme: 'light' },
            },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                className: 'w-[400px] p-6 bg-black rounded-lg',
                children: (0, jsx_runtime.jsx)(VLAN, { ...args }),
              }),
            args: { ...PremiumTheme.args, styles: { theme: 'sacred' } },
          },
          InteractiveDemoRenderer = () => {
            const [sacredtheme, setsacredtheme] = react.useState(!1),
              [disabled, setDisabled] = react.useState(!1),
              [showReservedVLANs, setShowReservedVLANs] = react.useState(!1),
              [value, setValue] = react.useState('100')
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
                              checked: showReservedVLANs,
                              onChange: e =>
                                setShowReservedVLANs(e.target.checked),
                            }),
                            ' ',
                            'Reserved VLANs',
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
                  children: (0, jsx_runtime.jsx)(VLAN, {
                    label: 'Interactive VLAN',
                    initialValue: value,
                    onChange: e => setValue(e.target.value),
                    styles: {
                      theme: sacredtheme ? 'sacred' : 'light',
                      disabled,
                    },
                    reservedVLANs: showReservedVLANs ? [50, 100, 150, 200] : [],
                  }),
                }),
              ],
            })
          },
          InteractiveDemo = {
            name: 'Interactive Demo',
            render: () => (0, jsx_runtime.jsx)(InteractiveDemoRenderer, {}),
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
