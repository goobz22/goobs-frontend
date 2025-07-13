'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [6488],
    {
      './src/components/Field/IPAM/Address/Address.stories.tsx': (
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
          theme = __webpack_require__('./src/theme/index.ts'),
          Typography = __webpack_require__(
            './src/components/Typography/index.tsx'
          ),
          console = __webpack_require__(
            './node_modules/console-browserify/index.js'
          )
        const isValidSegment = segment => {
            if ('' === segment) return !0
            const num = parseInt(segment, 10)
            return (
              !isNaN(num) &&
              num >= 0 &&
              num <= 255 &&
              segment === num.toString() &&
              segment.length <= 3
            )
          },
          isValidIPAddress = ip => {
            const segments = ip.split('.')
            return (
              4 === segments.length &&
              segments.every(
                segment => isValidSegment(segment) && '' !== segment
              )
            )
          },
          ipToNumber = ip => {
            if (!isValidIPAddress(ip)) return -1
            const parts = ip.split('.').map(Number)
            return (
              (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]
            )
          },
          isValidIPRange = (startIP, endIP) =>
            !isValidIPAddress(startIP) ||
            !isValidIPAddress(endIP) ||
            ipToNumber(startIP) <= ipToNumber(endIP),
          isIPInSubnetCIDR = (ip, subnetAddr, cidr) => {
            if (!isValidIPAddress(ip) || !isValidIPAddress(subnetAddr) || !cidr)
              return !1
            const mask = cidrToMask(cidr),
              range = calculateNetworkRange(subnetAddr, mask),
              ipNum = ipToNumber(ip),
              startNum = ipToNumber(range.start),
              endNum = ipToNumber(range.end)
            return ipNum >= startNum && ipNum <= endNum
          },
          isIPInUsableRange = (ip, subnetAddr, cidr) => {
            if (!isValidIPAddress(ip) || !isValidIPAddress(subnetAddr) || !cidr)
              return !0
            const usableRange = calculateUsableIPRange(subnetAddr, cidr)
            if (!usableRange) return !0
            const ipNum = ipToNumber(ip),
              startNum = ipToNumber(usableRange.start),
              endNum = ipToNumber(usableRange.end)
            return ipNum >= startNum && ipNum <= endNum
          },
          cidrToMask = cidr => {
            const safeCidr = Math.max(0, Math.min(32, cidr)),
              bitmask = 0 === safeCidr ? 0 : -1 << (32 - safeCidr)
            return [
              (bitmask >>> 24) & 255,
              (bitmask >>> 16) & 255,
              (bitmask >>> 8) & 255,
              255 & bitmask,
            ].join('.')
          },
          isGatewayInSubnet = (gateway, subnetAddress, subnetCIDR) => {
            if (
              !isValidIPAddress(gateway) ||
              !isValidIPAddress(subnetAddress) ||
              !subnetCIDR
            )
              return !0
            const subnetMask = cidrToMask(subnetCIDR),
              range = calculateNetworkRange(subnetAddress, subnetMask),
              gatewayNum = ipToNumber(gateway),
              startNum = ipToNumber(range.start),
              endNum = ipToNumber(range.end)
            if (!(gatewayNum >= startNum && gatewayNum <= endNum)) return !1
            const isNetworkAddress = gateway === range.start,
              isBroadcastAddress = gateway === range.end
            return !(isNetworkAddress || isBroadcastAddress)
          },
          calculateNetworkRange = (network, mask) => {
            const networkParts = network
                .split('.')
                .map(part => parseInt(part, 10)),
              maskParts = mask.split('.').map(part => parseInt(part, 10)),
              startParts = networkParts.map((part, i) => part & maskParts[i]),
              endParts = startParts.map(
                (part, i) => part | (255 & ~maskParts[i])
              )
            return { start: startParts.join('.'), end: endParts.join('.') }
          },
          calculateUsableIPRange = (subnetAddress, subnetCIDR, gatewayIP) => {
            if (!isValidIPAddress(subnetAddress) || !subnetCIDR) return null
            const subnetMask = cidrToMask(subnetCIDR),
              range = calculateNetworkRange(subnetAddress, subnetMask)
            let usableStart = ipToNumber(range.start) + 1,
              usableEnd = ipToNumber(range.end) - 1
            if (gatewayIP && isValidIPAddress(gatewayIP)) {
              const gatewayNum = ipToNumber(gatewayIP)
              gatewayNum >= usableStart &&
                gatewayNum <= usableEnd &&
                console.log(
                  `Gateway IP ${gatewayIP} is in the usable range and will be excluded`
                )
            }
            return { start: numToIP(usableStart), end: numToIP(usableEnd) }
          },
          numToIP = num =>
            [
              (num >>> 24) & 255,
              (num >>> 16) & 255,
              (num >>> 8) & 255,
              255 & num,
            ].join('.'),
          IPAddressField = ({
            initialValue = '',
            onChange,
            label = 'IP Address',
            allowIncomplete = !0,
            autoInsertDots = !0,
            defaultNetwork,
            subnetMask,
            subnetAddress,
            subnetCIDR,
            isGateway = !1,
            isRange = !1,
            isStartIP = !1,
            isEndIP = !1,
            startIPValue,
            endIPValue,
            renderAsRange = !1,
            onEndIPChange,
            onEndIPBlur,
            errorEnd = !1,
            availableRangeMessage,
            placeholder = '192.168.0.1',
            ...rest
          }) => {
            var _rest_styles,
              _rest_styles1,
              _rest_styles2,
              _rest_styles3,
              _rest_styles4,
              _rest_styles5,
              _rest_styles6,
              _rest_styles7,
              _rest_styles8
            const [value, setValue] = (0, react.useState)(initialValue),
              [isValid, setIsValid] = (0, react.useState)(
                '' === initialValue || isValidIPAddress(initialValue)
              ),
              [isInNetwork, setIsInNetwork] = (0, react.useState)(!0),
              [isInSubnet, setIsInSubnet] = (0, react.useState)(!0),
              [isValidRange, setIsValidRange] = (0, react.useState)(!0),
              lastInputTypeWasDelete = (0, react.useRef)(!1),
              styles = {
                infoText: {
                  display: 'block',
                  marginTop: '-0.5rem',
                  marginBottom: '0.25rem',
                  fontStyle: 'italic',
                  color:
                    'sacred' ===
                    (null === (_rest_styles = rest.styles) ||
                    void 0 === _rest_styles
                      ? void 0
                      : _rest_styles.theme)
                      ? 'rgba(255, 215, 0, 0.7)'
                      : '#6B7280',
                },
                rangeContainer: { width: '100%' },
                rangeInner: {
                  display: 'flex',
                  width: '100%',
                  gap: '0.5rem',
                  alignItems: 'center',
                },
                rangeDivider: { marginTop: '1rem' },
                rangeSide: { flex: 1 },
              }
            const valueRef = (0, react.useRef)(value),
              subnetAddressRef = (0, react.useRef)(subnetAddress),
              subnetCIDRRef = (0, react.useRef)(subnetCIDR),
              startIPValueRef = (0, react.useRef)(startIPValue),
              endIPValueRef = (0, react.useRef)(endIPValue)
            ;((0, react.useEffect)(() => {
              ;((valueRef.current = value),
                (subnetAddressRef.current = subnetAddress),
                (subnetCIDRRef.current = subnetCIDR),
                (startIPValueRef.current = startIPValue),
                (endIPValueRef.current = endIPValue))
            }, [value, subnetAddress, subnetCIDR, startIPValue, endIPValue]),
              (0, react.useEffect)(() => {
                defaultNetwork &&
                  subnetMask &&
                  isValidIPAddress(defaultNetwork) &&
                  isValidIPAddress(subnetMask)
              }, [defaultNetwork, subnetMask]),
              (0, react.useEffect)(() => {
                ;(() => {
                  if (initialValue) {
                    const validIP = isValidIPAddress(initialValue)
                    ;(setIsValid(validIP),
                      validIP &&
                        defaultNetwork &&
                        subnetMask &&
                        setIsInNetwork(
                          ((ip, network, mask) => {
                            if (
                              !isValidIPAddress(ip) ||
                              !isValidIPAddress(network) ||
                              !isValidIPAddress(mask)
                            )
                              return !0
                            const ipParts = ip
                                .split('.')
                                .map(part => parseInt(part, 10)),
                              networkParts = network
                                .split('.')
                                .map(part => parseInt(part, 10)),
                              maskParts = mask
                                .split('.')
                                .map(part => parseInt(part, 10))
                            for (let i = 0; i < 4; i++)
                              if (
                                (ipParts[i] & maskParts[i]) !==
                                (networkParts[i] & maskParts[i])
                              )
                                return !1
                            return !0
                          })(initialValue, defaultNetwork, subnetMask)
                        ),
                      validIP &&
                        subnetAddress &&
                        void 0 !== subnetCIDR &&
                        setIsInNetwork(
                          isIPInSubnetCIDR(
                            initialValue,
                            subnetAddress,
                            subnetCIDR
                          )
                        ),
                      isGateway &&
                        validIP &&
                        subnetAddress &&
                        void 0 !== subnetCIDR &&
                        setIsInSubnet(
                          isGatewayInSubnet(
                            initialValue,
                            subnetAddress,
                            subnetCIDR
                          )
                        ),
                      isRange &&
                        (isStartIP &&
                        endIPValue &&
                        validIP &&
                        isValidIPAddress(endIPValue)
                          ? setIsValidRange(
                              isValidIPRange(initialValue, endIPValue)
                            )
                          : isEndIP &&
                            startIPValue &&
                            validIP &&
                            isValidIPAddress(startIPValue) &&
                            setIsValidRange(
                              isValidIPRange(startIPValue, initialValue)
                            )))
                  }
                })()
              }, [
                initialValue,
                defaultNetwork,
                subnetMask,
                subnetAddress,
                subnetCIDR,
                isGateway,
                isRange,
                isStartIP,
                isEndIP,
                startIPValue,
                endIPValue,
              ]),
              (0, react.useEffect)(() => {
                if (
                  isGateway &&
                  isValidIPAddress(value) &&
                  subnetAddress &&
                  void 0 !== subnetCIDR &&
                  (value !== valueRef.current ||
                    subnetAddress !== subnetAddressRef.current ||
                    subnetCIDR !== subnetCIDRRef.current)
                ) {
                  const subnetValid = isGatewayInSubnet(
                    value,
                    subnetAddress,
                    subnetCIDR
                  )
                  subnetValid !== isInSubnet && setIsInSubnet(subnetValid)
                }
              }, [isGateway, value, subnetAddress, subnetCIDR, isInSubnet]),
              (0, react.useEffect)(() => {
                if (isRange && isValidIPAddress(value)) {
                  let bothInSubnet = !0
                  if (subnetAddress && void 0 !== subnetCIDR)
                    if (
                      isStartIP &&
                      endIPValue &&
                      isValidIPAddress(endIPValue)
                    ) {
                      const startInSubnet = isIPInSubnetCIDR(
                          value,
                          subnetAddress,
                          subnetCIDR
                        ),
                        endInSubnet = isIPInSubnetCIDR(
                          endIPValue,
                          subnetAddress,
                          subnetCIDR
                        ),
                        startInUsable = isIPInUsableRange(
                          value,
                          subnetAddress,
                          subnetCIDR
                        ),
                        endInUsable = isIPInUsableRange(
                          endIPValue,
                          subnetAddress,
                          subnetCIDR
                        )
                      bothInSubnet =
                        startInSubnet &&
                        endInSubnet &&
                        startInUsable &&
                        endInUsable
                    } else if (
                      isEndIP &&
                      startIPValue &&
                      isValidIPAddress(startIPValue)
                    ) {
                      const startInSubnet = isIPInSubnetCIDR(
                          startIPValue,
                          subnetAddress,
                          subnetCIDR
                        ),
                        endInSubnet = isIPInSubnetCIDR(
                          value,
                          subnetAddress,
                          subnetCIDR
                        ),
                        startInUsable = isIPInUsableRange(
                          startIPValue,
                          subnetAddress,
                          subnetCIDR
                        ),
                        endInUsable = isIPInUsableRange(
                          value,
                          subnetAddress,
                          subnetCIDR
                        )
                      bothInSubnet =
                        startInSubnet &&
                        endInSubnet &&
                        startInUsable &&
                        endInUsable
                    }
                  const rangeValid =
                    (isStartIP && endIPValue && isValidIPAddress(endIPValue)
                      ? isValidIPRange(value, endIPValue)
                      : !(
                          isEndIP &&
                          startIPValue &&
                          isValidIPAddress(startIPValue)
                        ) || isValidIPRange(startIPValue, value)) &&
                    bothInSubnet
                  rangeValid !== isValidRange && setIsValidRange(rangeValid)
                }
              }, [
                isRange,
                isStartIP,
                isEndIP,
                value,
                startIPValue,
                endIPValue,
                isValidRange,
                subnetAddress,
                subnetCIDR,
              ]))
            const formatIPAddress = (0, react.useCallback)(
                (input, wasDelete) => {
                  let formatted = input
                    .replace(/[^\d.]/g, '')
                    .replace(/\.{2,}/g, '.')
                    .replace(/^\./, '')
                  const dots = formatted.match(/\./g)
                  dots &&
                    dots.length > 3 &&
                    (formatted = formatted.substring(
                      0,
                      formatted.lastIndexOf('.')
                    ))
                  let segments = formatted.split('.'),
                    i = 0
                  for (; i < segments.length; ) {
                    let seg = segments[i]
                    if ('' !== seg && seg.length > 3) {
                      let first = seg.substring(0, 3),
                        rest = seg.substring(3)
                      ;((segments[i] = first), segments.splice(i + 1, 0, rest))
                    } else i++
                  }
                  for (let j = 0; j < segments.length; j++) {
                    let seg = segments[j]
                    if ('' !== seg) {
                      parseInt(seg, 10) > 255 && (segments[j] = '255')
                    }
                  }
                  if (
                    (segments.length > 4 && (segments = segments.slice(0, 4)),
                    (formatted = segments.join('.')),
                    autoInsertDots && !wasDelete)
                  ) {
                    const segments = formatted.split('.')
                    segments.length < 4 &&
                      3 === segments[segments.length - 1].length &&
                      (formatted += '.')
                  }
                  return formatted
                },
                [autoInsertDots]
              ),
              validateIPAddress = (0, react.useCallback)(
                ip => {
                  if ('' === ip) return !0
                  let valid = allowIncomplete
                    ? ip.split('.').every(isValidSegment)
                    : isValidIPAddress(ip)
                  if (isValidIPAddress(ip)) {
                    if (subnetAddress && void 0 !== subnetCIDR) {
                      const inSubnet = isIPInSubnetCIDR(
                          ip,
                          subnetAddress,
                          subnetCIDR
                        ),
                        inUsableRange = isIPInUsableRange(
                          ip,
                          subnetAddress,
                          subnetCIDR
                        )
                      setIsInNetwork(inSubnet && (isGateway || inUsableRange))
                    }
                  } else setIsInNetwork(!0)
                  return valid
                },
                [allowIncomplete, subnetAddress, subnetCIDR, isGateway]
              ),
              handleKeyDown = (0, react.useCallback)(e => {
                if (!e.ctrlKey && !e.altKey && !e.metaKey) {
                  const allowed = /^[0-9.]$/
                  ;[
                    'Backspace',
                    'Delete',
                    'ArrowLeft',
                    'ArrowRight',
                    'Tab',
                    'Enter',
                  ].includes(e.key) ||
                    allowed.test(e.key) ||
                    e.preventDefault()
                }
                lastInputTypeWasDelete.current =
                  'Backspace' === e.key || 'Delete' === e.key
              }, [])
            if (renderAsRange) {
              var _rest_styles9,
                _rest_styles10,
                _rest_styles11,
                _rest_styles12,
                _rest_styles13,
                _rest_styles14,
                _rest_styles15
              const handleStartIPChange = value => {
                  if (onChange) {
                    onChange({ target: { value }, currentTarget: { value } })
                  }
                },
                handleEndIPChange = value => {
                  if (onEndIPChange) {
                    onEndIPChange({
                      target: { value },
                      currentTarget: { value },
                    })
                  }
                },
                {
                  themeConfig: rangeThemeConfig,
                  borderColor: rangeBorderColor,
                  labelColor: rangeLabelColor,
                  footerTextColor: rangeFooterTextColor,
                  transition: rangeTransition,
                } = (0, theme.AW)(rest.styles, !(isValidRange && !errorEnd)),
                rangeComponentStyles = {
                  container: (0, theme.ZZ)(rest.styles),
                  inputWrapper: {
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    height:
                      (null === (_rest_styles9 = rest.styles) ||
                      void 0 === _rest_styles9
                        ? void 0
                        : _rest_styles9.height) || '40px',
                    width: '100%',
                    border: `${(null === (_rest_styles10 = rest.styles) || void 0 === _rest_styles10 ? void 0 : _rest_styles10.borderWidth) || '1px'} solid ${rangeBorderColor}`,
                    borderRadius:
                      (null === (_rest_styles11 = rest.styles) ||
                      void 0 === _rest_styles11
                        ? void 0
                        : _rest_styles11.borderRadius) || '8px',
                    backgroundColor: rangeThemeConfig.background,
                    color: rangeThemeConfig.text,
                    margin: 0,
                    padding: 0,
                    boxSizing: 'border-box',
                    transition: rangeTransition,
                  },
                  input: {
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'transparent',
                    outline: 'none',
                    border: 'none',
                    padding:
                      (null === (_rest_styles12 = rest.styles) ||
                      void 0 === _rest_styles12
                        ? void 0
                        : _rest_styles12.padding) || '8px 16px',
                    fontSize:
                      (null === (_rest_styles13 = rest.styles) ||
                      void 0 === _rest_styles13
                        ? void 0
                        : _rest_styles13.fontSize) || '16px',
                    fontWeight:
                      null === (_rest_styles14 = rest.styles) ||
                      void 0 === _rest_styles14
                        ? void 0
                        : _rest_styles14.fontWeight,
                    lineHeight:
                      null === (_rest_styles15 = rest.styles) ||
                      void 0 === _rest_styles15
                        ? void 0
                        : _rest_styles15.lineHeight,
                    fontFamily: rangeThemeConfig.fontFamily,
                    color: 'inherit',
                    boxSizing: 'border-box',
                  },
                  label: (0, theme.Wh)(rangeLabelColor, rangeThemeConfig),
                  footerText: (0, theme.En)(
                    rangeFooterTextColor,
                    rangeThemeConfig,
                    rest.styles
                  ),
                },
                createRangeInput = (
                  inputLabel,
                  inputValue,
                  inputOnChange,
                  inputError
                ) => {
                  var _rest_styles
                  return (0, jsx_runtime.jsxs)('div', {
                    style: styles.rangeSide,
                    children: [
                      inputLabel &&
                        (0, jsx_runtime.jsxs)('label', {
                          style: rangeComponentStyles.label,
                          children: [
                            inputLabel,
                            rest.required &&
                              (0, jsx_runtime.jsx)('span', {
                                style: (0, theme.sz)(rest.styles),
                                children:
                                  (null === (_rest_styles = rest.styles) ||
                                  void 0 === _rest_styles
                                    ? void 0
                                    : _rest_styles.requiredIndicatorText) ||
                                  ' *',
                              }),
                          ],
                        }),
                      (0, jsx_runtime.jsx)('div', {
                        style: rangeComponentStyles.inputWrapper,
                        children: (0, jsx_runtime.jsx)('input', {
                          ...rest,
                          ...(0, theme.SI)(rest.required),
                          value: inputValue || '',
                          disabled: rest.disabled,
                          onChange: e => inputOnChange(e.target.value),
                          onBlur: onEndIPBlur,
                          placeholder:
                            placeholder ||
                            (inputLabel.includes('Start')
                              ? '192.168.0.1'
                              : '192.168.0.255'),
                          style: rangeComponentStyles.input,
                        }),
                      }),
                      inputError &&
                        (0, jsx_runtime.jsx)('div', {
                          style: rangeComponentStyles.footerText,
                          children: inputError,
                        }),
                    ],
                  })
                }
              return (0, jsx_runtime.jsxs)('div', {
                style: styles.rangeContainer,
                children: [
                  availableRangeMessage &&
                    (0, jsx_runtime.jsx)(Typography.A, {
                      children: availableRangeMessage,
                    }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: styles.rangeInner,
                    children: [
                      createRangeInput(
                        startIPValue ? label : '',
                        startIPValue,
                        handleStartIPChange,
                        isValidRange ? void 0 : 'Invalid IP range'
                      ),
                      (0, jsx_runtime.jsx)(Typography.A, { children: '-' }),
                      createRangeInput(
                        endIPValue ? label : '',
                        endIPValue,
                        handleEndIPChange,
                        errorEnd || !isValidRange ? 'Invalid IP range' : void 0
                      ),
                    ],
                  }),
                ],
              })
            }
            const {
                themeConfig,
                borderColor,
                labelColor,
                footerTextColor,
                transition,
              } = (0, theme.AW)(
                rest.styles,
                !(isValid && isInNetwork && isInSubnet)
              ),
              componentStyles = {
                container: (0, theme.ZZ)(rest.styles),
                inputWrapper: {
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  height:
                    (null === (_rest_styles1 = rest.styles) ||
                    void 0 === _rest_styles1
                      ? void 0
                      : _rest_styles1.height) || '40px',
                  width: '100%',
                  border: `${(null === (_rest_styles2 = rest.styles) || void 0 === _rest_styles2 ? void 0 : _rest_styles2.borderWidth) || '1px'} solid ${borderColor}`,
                  borderRadius:
                    (null === (_rest_styles3 = rest.styles) ||
                    void 0 === _rest_styles3
                      ? void 0
                      : _rest_styles3.borderRadius) || '8px',
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
                    (null === (_rest_styles4 = rest.styles) ||
                    void 0 === _rest_styles4
                      ? void 0
                      : _rest_styles4.padding) || '8px 16px',
                  fontSize:
                    (null === (_rest_styles5 = rest.styles) ||
                    void 0 === _rest_styles5
                      ? void 0
                      : _rest_styles5.fontSize) || '16px',
                  fontWeight:
                    null === (_rest_styles6 = rest.styles) ||
                    void 0 === _rest_styles6
                      ? void 0
                      : _rest_styles6.fontWeight,
                  lineHeight:
                    null === (_rest_styles7 = rest.styles) ||
                    void 0 === _rest_styles7
                      ? void 0
                      : _rest_styles7.lineHeight,
                  fontFamily: themeConfig.fontFamily,
                  color: 'inherit',
                  boxSizing: 'border-box',
                },
                label: (0, theme.Wh)(labelColor, themeConfig),
                footerText: (0, theme.En)(
                  footerTextColor,
                  themeConfig,
                  rest.styles
                ),
              },
              error =
                isValid && isInNetwork && isInSubnet
                  ? void 0
                  : 'Invalid IP address'
            return (0, jsx_runtime.jsxs)('div', {
              style: { ...componentStyles.container, width: '100%' },
              children: [
                label &&
                  (0, jsx_runtime.jsxs)('label', {
                    style: componentStyles.label,
                    children: [
                      label,
                      rest.required &&
                        (0, jsx_runtime.jsx)('span', {
                          style: (0, theme.sz)(rest.styles),
                          children:
                            (null === (_rest_styles8 = rest.styles) ||
                            void 0 === _rest_styles8
                              ? void 0
                              : _rest_styles8.requiredIndicatorText) || ' *',
                        }),
                    ],
                  }),
                (0, jsx_runtime.jsx)('div', {
                  style: componentStyles.inputWrapper,
                  children: (0, jsx_runtime.jsx)('input', {
                    ...rest,
                    ...(0, theme.SI)(rest.required),
                    value,
                    disabled: rest.disabled,
                    onChange: e =>
                      (newValue => {
                        const formatted = formatIPAddress(
                            newValue,
                            lastInputTypeWasDelete.current
                          ),
                          valid = validateIPAddress(formatted)
                        ;(setIsValid(valid),
                          setValue(formatted),
                          onChange &&
                            onChange({
                              target: { value: formatted },
                              currentTarget: { value: formatted },
                            }))
                      })(e.target.value),
                    onKeyDown: handleKeyDown,
                    placeholder,
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
          Address = IPAddressField
        IPAddressField.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'IPAddressField',
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
              description: '',
            },
            label: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "'IP Address'", computed: !1 },
            },
            allowIncomplete: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'true', computed: !1 },
            },
            autoInsertDots: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'true', computed: !1 },
            },
            defaultNetwork: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            subnetMask: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            subnetAddress: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            subnetCIDR: {
              required: !1,
              tsType: { name: 'number' },
              description: '',
            },
            isGateway: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
            isRange: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
            isStartIP: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
            isEndIP: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
            endIPValue: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            startIPValue: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            renderAsRange: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
            onEndIPChange: {
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
              description: '',
            },
            onEndIPBlur: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            errorEnd: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
            showAvailableRange: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
            },
            gatewayIP: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            availableRangeMessage: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            placeholder: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "'192.168.0.1'", computed: !1 },
            },
          },
          composes: ['Omit'],
        }
        const Address_stories = {
            title: 'Components/Field/IPAM/Address',
            component: Address,
            argTypes: {
              disabled: { control: 'boolean' },
              label: { control: 'text' },
              error: { control: 'text' },
              styles: { control: 'object' },
            },
            parameters: { layout: 'centered' },
          },
          PremiumTheme = {
            name: 'Premium Theme',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                className: 'w-[400px] p-6 bg-gray-50 rounded-lg',
                children: (0, jsx_runtime.jsx)(Address, { ...args }),
              }),
            args: { label: 'IP Address', styles: { theme: 'light' } },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                className: 'w-[400px] p-6 bg-black rounded-lg',
                children: (0, jsx_runtime.jsx)(Address, { ...args }),
              }),
            args: { ...PremiumTheme.args, styles: { theme: 'sacred' } },
          },
          InteractiveAddressDemo = () => {
            const [sacredtheme, setsacredtheme] = react.useState(!1),
              [disabled, setDisabled] = react.useState(!1),
              [showError, setShowError] = react.useState(!1),
              [value, setValue] = react.useState('192.168.1.1')
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
                              checked: showError,
                              onChange: e => setShowError(e.target.checked),
                            }),
                            ' ',
                            'Error',
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
                  children: (0, jsx_runtime.jsx)(Address, {
                    label: 'Interactive IP Address',
                    initialValue: value,
                    onChange: e => setValue(e.target.value),
                    styles: { theme: sacredtheme ? 'sacred' : 'light' },
                    disabled,
                    error: showError ? 'Invalid IP address' : void 0,
                  }),
                }),
              ],
            })
          },
          InteractiveDemo = {
            name: 'Interactive Demo',
            render: () => (0, jsx_runtime.jsx)(InteractiveAddressDemo, {}),
          },
          __namedExportsOrder = [
            'PremiumTheme',
            'SacredTheme',
            'InteractiveDemo',
          ]
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
