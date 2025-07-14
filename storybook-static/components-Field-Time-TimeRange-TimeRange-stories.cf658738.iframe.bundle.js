'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [9530],
    {
      './src/components/Field/Dropdown/Regular/index.tsx': (
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
      './src/components/Field/Time/TimeRange/TimeRange.stories.tsx': (
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
            default: () => TimeRange_stories,
          }))
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          theme = __webpack_require__('./src/theme/index.ts'),
          AccessTime = __webpack_require__(
            './src/components/Icons/AccessTime.tsx'
          ),
          Regular = __webpack_require__(
            './src/components/Field/Dropdown/Regular/index.tsx'
          ),
          console = __webpack_require__(
            './node_modules/console-browserify/index.js'
          )
        const formatTimeDisplay = (hours, minutes) =>
            `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`,
          parseTimeInput = timeString => {
            const parts = timeString.split(':')
            if (2 === parts.length) {
              const hours = parseInt(parts[0], 10),
                minutes = parseInt(parts[1], 10)
              if (
                !isNaN(hours) &&
                !isNaN(minutes) &&
                hours >= 0 &&
                hours <= 23 &&
                minutes >= 0 &&
                minutes <= 59
              )
                return { hours, minutes }
            }
            return null
          },
          createTimeDate = (hours, minutes) => {
            const date = new Date()
            return (date.setHours(hours, minutes, 0, 0), date)
          },
          TimeRangeComponent = ({
            onChange,
            value,
            startLabel = 'Start Time',
            endLabel = 'End Time',
            timezone = 'America/New_York',
            showTimezone = !1,
            helperText,
            styles,
            ...rest
          }) => {
            const formatTime = (0, react.useCallback)(
                date => {
                  return date
                    ? showTimezone
                      ? ((date, timezone) => {
                          try {
                            return new Intl.DateTimeFormat('en-US', {
                              timeZone: timezone,
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: !0,
                            }).format(date)
                          } catch (error) {
                            return (
                              console.warn(
                                'Timezone formatting failed:',
                                error
                              ),
                              formatTimeDisplay(
                                date.getHours(),
                                date.getMinutes()
                              )
                            )
                          }
                        })(date, timezone)
                      : ((hours = date.getHours()),
                        (minutes = date.getMinutes()),
                        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`)
                    : ''
                  var hours, minutes
                },
                [showTimezone, timezone]
              ),
              [timeRange, setTimeRange] = (0, react.useState)(
                value || { start: null, end: null }
              ),
              [isStartTimeOpen, setIsStartTimeOpen] = (0, react.useState)(!1),
              [isEndTimeOpen, setIsEndTimeOpen] = (0, react.useState)(!1),
              [startTimeInputValue, setStartTimeInputValue] = (0,
              react.useState)(formatTime(timeRange.start)),
              [endTimeInputValue, setEndTimeInputValue] = (0, react.useState)(
                formatTime(timeRange.end)
              ),
              [activeSelection, setActiveSelection] = (0, react.useState)(
                'start'
              ),
              [isFocused, setIsFocused] = (0, react.useState)(!1),
              popoverRef = (0, react.useRef)(null),
              [viewedHour, setViewedHour] = (0, react.useState)(12),
              [viewedMinute, setViewedMinute] = (0, react.useState)(0),
              [viewedAmPm, setViewedAmPm] = (0, react.useState)('AM'),
              [dragPosition, setDragPosition] = (0, react.useState)({
                x: 0,
                y: 0,
              }),
              [isDragging, setIsDragging] = (0, react.useState)(!1),
              [dragOffset, setDragOffset] = (0, react.useState)({ x: 0, y: 0 }),
              sacredtheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              pickerStyles = ((sacredtheme, isDragging) => ({
                datePicker: {
                  position: 'fixed',
                  top: '100%',
                  left: 0,
                  zIndex: 50,
                  backgroundColor: sacredtheme ? 'rgba(0,0,0,0.95)' : 'white',
                  borderRadius: '0.5rem',
                  padding: '1.25rem',
                  minWidth: '300px',
                  maxWidth: '400px',
                  boxShadow: sacredtheme
                    ? '0 0 1.5rem rgba(255, 215, 0, 0.2)'
                    : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  border: sacredtheme
                    ? '2px solid rgba(255, 215, 0, 0.5)'
                    : '1px solid #E5E7EB',
                  animation: sacredtheme
                    ? 'date-field-sacred-glow 2s infinite alternate'
                    : 'none',
                },
                header: {
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: sacredtheme
                      ? 'rgba(255, 215, 0, 0.05)'
                      : '#F9FAFB',
                  },
                },
                backButton: {
                  height: '2rem',
                  width: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 0.25rem',
                  padding: 0,
                  borderRadius: '9999px',
                  transition: 'all 0.3s ease',
                  color: sacredtheme ? '#FFD700' : '#4B5563',
                  backgroundColor: sacredtheme
                    ? 'rgba(255, 215, 0, 0.1)'
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: sacredtheme
                      ? 'rgba(255, 215, 0, 0.2)'
                      : '#F3F4F6',
                  },
                },
                headerTextContainer: { flex: 1, pointerEvents: 'none' },
                headerTitle: {
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: sacredtheme ? '#FFD700' : '#1F2937',
                  fontFamily: sacredtheme
                    ? 'Cinzel, serif'
                    : 'Inter, sans-serif',
                  cursor: 'pointer',
                },
                headerSubtitle: {
                  fontSize: '1rem',
                  color: sacredtheme ? 'rgba(255, 215, 0, 0.7)' : '#6B7280',
                  fontFamily: sacredtheme
                    ? 'Arapey, serif'
                    : 'Inter, sans-serif',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  textAlign: 'center',
                },
                grid: { display: 'grid', gap: '0.5rem' },
                grid3Col: { gridTemplateColumns: 'repeat(3, 1fr)' },
                pickerButton: {
                  padding: '0.5rem',
                  borderRadius: '9999px',
                  textAlign: 'center',
                  transition: 'background-color 0.2s',
                  color: sacredtheme ? 'rgba(255, 215, 0, 0.8)' : 'black',
                  backgroundColor: sacredtheme
                    ? 'rgba(255, 215, 0, 0.1)'
                    : '#F3F4F6',
                  '&:hover': {
                    backgroundColor: sacredtheme
                      ? 'rgba(255, 215, 0, 0.2)'
                      : '#E5E7EB',
                  },
                  '&:disabled': {
                    backgroundColor: 'transparent',
                    color: sacredtheme ? 'rgba(255, 215, 0, 0.3)' : '#D1D5DB',
                    '&:hover': { backgroundColor: 'transparent' },
                  },
                },
                calendarIcon: {
                  height: '1.25rem',
                  width: '1.25rem',
                  color: sacredtheme ? '#FFD700' : '#6B7280',
                  animation: sacredtheme
                    ? 'sacred-icon-glow 1.5s infinite alternate'
                    : 'none',
                },
                select: {
                  background: 'transparent',
                  border: 'none',
                  color: sacredtheme ? '#FFD700' : '#1F2937',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  fontFamily: sacredtheme
                    ? 'Cinzel, serif'
                    : 'Inter, sans-serif',
                  cursor: 'pointer',
                  padding: 0,
                  margin: 0,
                  paddingRight: '1.5rem',
                },
              }))(sacredtheme, isDragging),
              {
                themeConfig,
                borderColor,
                labelColor,
                adornmentColor,
                footerTextColor,
                transition,
              } = (0, theme.AW)(styles, isFocused),
              componentStyles = {
                container: {
                  ...(0, theme.ZZ)(styles),
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  width: '100%',
                },
                timeInputContainer: {
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '1rem',
                },
                inputWrapper: {
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  height: (null == styles ? void 0 : styles.height) || '40px',
                  width: '100%',
                  border: `${(null == styles ? void 0 : styles.borderWidth) || '1px'} solid ${borderColor}`,
                  borderRadius:
                    (null == styles ? void 0 : styles.borderRadius) || '8px',
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
                    (null == styles ? void 0 : styles.padding) || '8px 16px',
                  paddingRight: '48px',
                  fontSize:
                    (null == styles ? void 0 : styles.fontSize) || '16px',
                  fontWeight: null == styles ? void 0 : styles.fontWeight,
                  lineHeight: null == styles ? void 0 : styles.lineHeight,
                  fontFamily: themeConfig.fontFamily,
                  color: 'inherit',
                  boxSizing: 'border-box',
                },
                label: (0, theme.Wh)(labelColor, themeConfig),
                endAdornment: (0, theme.EK)(adornmentColor),
                footerText: (0, theme.En)(footerTextColor, themeConfig, styles),
              }
            ;((0, react.useEffect)(() => {
              value &&
                (setTimeRange(value),
                setStartTimeInputValue(formatTime(value.start)),
                setEndTimeInputValue(formatTime(value.end)))
            }, [value, formatTime]),
              (0, react.useEffect)(() => {
                if (isStartTimeOpen || isEndTimeOpen) {
                  const centerX = window.innerWidth / 2 - 175,
                    centerY = window.innerHeight / 2 - 200
                  setDragPosition({ x: centerX, y: centerY })
                  const selected = isStartTimeOpen
                    ? timeRange.start
                    : timeRange.end
                  if (selected) {
                    let hours = selected.getHours()
                    ;(setViewedAmPm(hours >= 12 ? 'PM' : 'AM'),
                      (hours = hours % 12 || 12),
                      setViewedHour(hours),
                      setViewedMinute(selected.getMinutes()))
                  } else
                    (setViewedHour(12), setViewedMinute(0), setViewedAmPm('AM'))
                }
              }, [isStartTimeOpen, isEndTimeOpen, timeRange]))
            const closePicker = (0, react.useCallback)(() => {
                'start' === activeSelection
                  ? setIsStartTimeOpen(!1)
                  : setIsEndTimeOpen(!1)
              }, [activeSelection]),
              handleClickOutside = (0, react.useCallback)(
                event => {
                  popoverRef.current &&
                    !popoverRef.current.contains(event.target) &&
                    closePicker()
                },
                [closePicker, popoverRef]
              )
            ;(0, react.useEffect)(
              () => (
                document.addEventListener('click', handleClickOutside),
                () => document.removeEventListener('click', handleClickOutside)
              ),
              [handleClickOutside]
            )
            const handleMouseDown = (0, react.useCallback)(
                e => {
                  ;(e.preventDefault(), setIsDragging(!0))
                  let currentX = dragPosition.x,
                    currentY = dragPosition.y
                  setDragOffset({
                    x: e.clientX - currentX,
                    y: e.clientY - currentY,
                  })
                },
                [dragPosition]
              ),
              handleMouseMove = (0, react.useCallback)(
                e => {
                  if (isDragging) {
                    const newX = e.clientX - dragOffset.x,
                      newY = e.clientY - dragOffset.y,
                      maxX = window.innerWidth - 100,
                      minX = -250,
                      maxY = window.innerHeight - 100,
                      minY = -200
                    setDragPosition({
                      x: Math.max(minX, Math.min(maxX, newX)),
                      y: Math.max(minY, Math.min(maxY, newY)),
                    })
                  }
                },
                [isDragging, dragOffset]
              ),
              handleMouseUp = (0, react.useCallback)(
                () => setIsDragging(!1),
                []
              )
            ;(0, react.useEffect)(
              () => (
                isDragging
                  ? (document.addEventListener('mousemove', handleMouseMove),
                    document.addEventListener('mouseup', handleMouseUp),
                    (document.body.style.userSelect = 'none'))
                  : (document.removeEventListener('mousemove', handleMouseMove),
                    document.removeEventListener('mouseup', handleMouseUp),
                    (document.body.style.userSelect = '')),
                () => {
                  ;(document.removeEventListener('mousemove', handleMouseMove),
                    document.removeEventListener('mouseup', handleMouseUp),
                    (document.body.style.userSelect = ''))
                }
              ),
              [isDragging, handleMouseMove, handleMouseUp]
            )
            const handleInputChange = (newValue, type) => {
                const formatted = formatInput(newValue)
                'start' === type
                  ? setStartTimeInputValue(formatted)
                  : setEndTimeInputValue(formatted)
                const parsedTime = parseTimeInput(formatted)
                if (parsedTime) {
                  const newTime = createTimeDate(
                    parsedTime.hours,
                    parsedTime.minutes
                  )
                  if (
                    'start' === type ||
                    (timeRange.start && newTime > timeRange.start)
                  ) {
                    const newRange = { ...timeRange, [type]: newTime }
                    ;(setTimeRange(newRange),
                      null == onChange || onChange(newRange))
                  }
                }
              },
              formatInput = input => {
                const digits = input.replace(/\D/g, '').slice(0, 4)
                return digits.length > 2
                  ? `${digits.slice(0, 2)}:${digits.slice(2)}`
                  : digits
              },
              handleTimeSelect = () => {
                let hours = viewedHour
                ;('PM' === viewedAmPm && (hours += 12),
                  24 === hours && (hours = 0))
                const newTime = createTimeDate(hours, viewedMinute)
                if ('start' === activeSelection) {
                  const newRange = { start: newTime, end: timeRange.end }
                  ;(timeRange.end &&
                    newTime > timeRange.end &&
                    ((newRange.end = null), setEndTimeInputValue('')),
                    setTimeRange(newRange),
                    setStartTimeInputValue(formatTime(newTime)),
                    onChange && onChange(newRange))
                } else
                  (!timeRange.start || newTime > timeRange.start) &&
                    (setTimeRange({ ...timeRange, end: newTime }),
                    setEndTimeInputValue(formatTime(newTime)),
                    onChange && onChange({ ...timeRange, end: newTime }))
                closePicker()
              },
              handleKeyDown = (e, isStart) => {
                var _rest_onKeyDown
                const inputValue = isStart
                    ? startTimeInputValue
                    : endTimeInputValue,
                  setInputValue = isStart
                    ? setStartTimeInputValue
                    : setEndTimeInputValue,
                  handleChange = isStart
                    ? time => setTimeRange({ ...timeRange, start: time })
                    : time => setTimeRange({ ...timeRange, end: time }),
                  input = e.currentTarget,
                  pos = input.selectionStart || 0
                if ('ArrowUp' === e.key || 'ArrowDown' === e.key) {
                  e.preventDefault()
                  const inc = 'ArrowUp' === e.key ? 1 : -1,
                    parts = inputValue.split(':').map(p => parseInt(p, 10) || 0)
                  let [hours, minutes] = parts
                  const selectedPart = pos <= 2 ? 'hours' : 'minutes'
                  'hours' === selectedPart
                    ? (hours = (hours + inc + 24) % 24)
                    : (minutes = (minutes + inc + 60) % 60)
                  setInputValue(
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
                  )
                  ;(handleChange(createTimeDate(hours, minutes)),
                    onChange && onChange(timeRange),
                    setTimeout(() => {
                      'hours' === selectedPart
                        ? input.setSelectionRange(0, 2)
                        : input.setSelectionRange(3, 5)
                    }, 0))
                } else if ('Backspace' === e.key && 3 === pos) {
                  e.preventDefault()
                  const newValue = inputValue.slice(0, 2)
                  setInputValue(newValue)
                  const parsed = parseTimeInput(newValue)
                  if (parsed) {
                    ;(handleChange(
                      createTimeDate(parsed.hours, parsed.minutes)
                    ),
                      onChange && onChange(timeRange))
                  }
                  setTimeout(() => input.setSelectionRange(2, 2), 0)
                }
                null === (_rest_onKeyDown = rest.onKeyDown) ||
                  void 0 === _rest_onKeyDown ||
                  _rest_onKeyDown.call(rest, e)
              },
              handleClick = e => {
                var _rest_onClick
                const input = e.currentTarget,
                  pos = input.selectionStart || 0
                let start = 0,
                  end = 2
                ;(pos > 2 && ((start = 3), (end = 5)),
                  setTimeout(() => input.setSelectionRange(start, end), 0),
                  null === (_rest_onClick = rest.onClick) ||
                    void 0 === _rest_onClick ||
                    _rest_onClick.call(rest, e))
              },
              handleFocus = (0, react.useCallback)(
                e => {
                  var _rest_onFocus
                  ;(setIsFocused(!0),
                    null === (_rest_onFocus = rest.onFocus) ||
                      void 0 === _rest_onFocus ||
                      _rest_onFocus.call(rest, e))
                },
                [rest]
              ),
              handleBlur = (0, react.useCallback)(
                e => {
                  var _rest_onBlur
                  ;(setIsFocused(!1),
                    null === (_rest_onBlur = rest.onBlur) ||
                      void 0 === _rest_onBlur ||
                      _rest_onBlur.call(rest, e))
                },
                [rest]
              ),
              createInputField = (
                label,
                value,
                onChange,
                onIconClick,
                isStart
              ) => {
                var _rest_placeholder
                return (0, jsx_runtime.jsxs)('div', {
                  style: { flex: 1 },
                  children: [
                    label &&
                      (0, jsx_runtime.jsxs)('label', {
                        style: componentStyles.label,
                        children: [
                          label,
                          (null == styles ? void 0 : styles.required) &&
                            (0, jsx_runtime.jsx)('span', {
                              style: (0, theme.sz)(styles),
                              children:
                                (null == styles
                                  ? void 0
                                  : styles.requiredIndicatorText) || ' *',
                            }),
                        ],
                      }),
                    (0, jsx_runtime.jsxs)('div', {
                      style: componentStyles.inputWrapper,
                      children: [
                        (0, jsx_runtime.jsx)('input', {
                          ...rest,
                          ...(0, theme.SI)(
                            null == styles ? void 0 : styles.required
                          ),
                          value,
                          disabled: null == styles ? void 0 : styles.disabled,
                          onChange: e => onChange(e.target.value),
                          onFocus: handleFocus,
                          onBlur: handleBlur,
                          onKeyDown: e => handleKeyDown(e, isStart),
                          onClick: handleClick,
                          placeholder:
                            null !== (_rest_placeholder = rest.placeholder) &&
                            void 0 !== _rest_placeholder
                              ? _rest_placeholder
                              : 'HH:MM',
                          style: componentStyles.input,
                        }),
                        (0, jsx_runtime.jsx)('div', {
                          style: {
                            ...componentStyles.endAdornment,
                            right: '16px',
                          },
                          children: (0, jsx_runtime.jsx)(TimeAdornment, {
                            onClick: onIconClick,
                          }),
                        }),
                      ],
                    }),
                  ],
                })
              },
              CustomTimePicker = () =>
                (0, jsx_runtime.jsxs)('div', {
                  ref: popoverRef,
                  style: {
                    ...pickerStyles.datePicker,
                    position: 'absolute',
                    left: dragPosition.x,
                    top: dragPosition.y,
                  },
                  children: [
                    (0, jsx_runtime.jsxs)('div', {
                      style: {
                        ...pickerStyles.header,
                        flexDirection: 'column',
                      },
                      children: [
                        (0, jsx_runtime.jsx)('p', {
                          style: pickerStyles.headerSubtitle,
                          onMouseDown: handleMouseDown,
                          children: 'Click and drag to move',
                        }),
                        (0, jsx_runtime.jsx)('div', {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            gap: '0.5rem',
                          },
                          children: (0, jsx_runtime.jsxs)('div', {
                            style: {
                              display: 'flex',
                              gap: '0.5rem',
                              transform: 'translateY(-5px)',
                            },
                            children: [
                              (0, jsx_runtime.jsx)(Regular.A, {
                                options: Array.from({ length: 12 }, (_, i) => ({
                                  value: (i + 1).toString(),
                                })),
                                value: viewedHour.toString(),
                                onChange: e =>
                                  setViewedHour(parseInt(e.target.value)),
                                label: '',
                                styles: {
                                  theme: sacredtheme ? 'sacred' : 'light',
                                  height: '2rem',
                                  fontSize: '1rem',
                                  padding: '0.25rem 1.5rem 0.25rem 0.5rem',
                                  width: '80px',
                                },
                              }),
                              (0, jsx_runtime.jsx)(Regular.A, {
                                options: Array.from({ length: 60 }, (_, i) => ({
                                  value: i.toString().padStart(2, '0'),
                                })),
                                value: viewedMinute.toString().padStart(2, '0'),
                                onChange: e =>
                                  setViewedMinute(parseInt(e.target.value)),
                                label: '',
                                styles: {
                                  theme: sacredtheme ? 'sacred' : 'light',
                                  height: '2rem',
                                  fontSize: '1rem',
                                  padding: '0.25rem 1.5rem 0.25rem 0.5rem',
                                  width: '80px',
                                },
                              }),
                              (0, jsx_runtime.jsx)(Regular.A, {
                                options: [{ value: 'AM' }, { value: 'PM' }],
                                value: viewedAmPm,
                                onChange: e => setViewedAmPm(e.target.value),
                                label: '',
                                styles: {
                                  theme: sacredtheme ? 'sacred' : 'light',
                                  height: '2rem',
                                  fontSize: '1rem',
                                  padding: '0.25rem 1.5rem 0.25rem 0.5rem',
                                  width: '80px',
                                },
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                    (0, jsx_runtime.jsx)('div', {
                      style: { textAlign: 'center', marginTop: '1rem' },
                      children: (0, jsx_runtime.jsx)('button', {
                        onClick: handleTimeSelect,
                        style: {
                          padding: '0.5rem 1rem',
                          backgroundColor: sacredtheme
                            ? 'rgba(255, 215, 0, 0.2)'
                            : '#F3F4F6',
                          color: sacredtheme ? '#FFD700' : '#1F2937',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                        },
                        children: 'Confirm',
                      }),
                    }),
                  ],
                }),
              TimeAdornment = ({ onClick }) =>
                (0, jsx_runtime.jsxs)('div', {
                  style: {
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  },
                  children: [
                    sacredtheme &&
                      (0, jsx_runtime.jsx)('div', {
                        style: {
                          position: 'absolute',
                          left: '-1.25rem',
                          color: 'rgba(255,215,0,0.4)',
                          fontSize: '0.75rem',
                          animation:
                            'date-field-float-glyph 4s infinite alternate',
                        },
                        children: '𓇳',
                      }),
                    (0, jsx_runtime.jsx)('div', {
                      onClick,
                      style: { cursor: 'pointer' },
                      children: (0, jsx_runtime.jsx)(AccessTime.A, {
                        style: pickerStyles.calendarIcon,
                      }),
                    }),
                  ],
                })
            return (0, jsx_runtime.jsxs)('div', {
              style: componentStyles.container,
              children: [
                (0, jsx_runtime.jsxs)('div', {
                  style: componentStyles.timeInputContainer,
                  children: [
                    createInputField(
                      startLabel,
                      startTimeInputValue,
                      value => handleInputChange(value, 'start'),
                      e => {
                        ;(e.stopPropagation(),
                          setActiveSelection('start'),
                          setIsStartTimeOpen(!0))
                      },
                      !0
                    ),
                    createInputField(
                      endLabel,
                      endTimeInputValue,
                      value => handleInputChange(value, 'end'),
                      e => {
                        ;(e.stopPropagation(),
                          setActiveSelection('end'),
                          setIsEndTimeOpen(!0))
                      },
                      !1
                    ),
                  ],
                }),
                (isStartTimeOpen || isEndTimeOpen) &&
                  (0, jsx_runtime.jsx)(CustomTimePicker, {}),
              ],
            })
          },
          TimeRange = TimeRangeComponent
        TimeRangeComponent.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'TimeRangeComponent',
          props: {
            onChange: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(timeRange: TimeRange) => void',
                signature: {
                  arguments: [
                    { type: { name: 'TimeRange' }, name: 'timeRange' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            value: {
              required: !1,
              tsType: { name: 'TimeRange' },
              description: '',
            },
            startLabel: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "'Start Time'", computed: !1 },
            },
            endLabel: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "'End Time'", computed: !1 },
            },
            timezone: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "'America/New_York'", computed: !1 },
            },
            showTimezone: {
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
        const TimeRange_stories = {
            title: 'Components/Field/Time/TimeRange',
            component: TimeRange,
            argTypes: {
              showTimezone: { control: 'boolean' },
              timezone: { control: 'text' },
            },
            parameters: { layout: 'centered' },
          },
          PremiumTheme = {
            name: 'Premium Theme',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                style: {
                  width: '500px',
                  padding: '2rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                },
                children: (0, jsx_runtime.jsx)(TimeRange, { ...args }),
              }),
            args: {
              startLabel: 'Start Time',
              endLabel: 'End Time',
              value: {
                start: new Date(),
                end: new Date(new Date().getTime() + 72e5),
              },
            },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                style: {
                  width: '500px',
                  padding: '2rem',
                  backgroundColor: '#000',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
                },
                children: (0, jsx_runtime.jsx)(TimeRange, { ...args }),
              }),
            args: { ...PremiumTheme.args, styles: { theme: 'sacred' } },
          },
          InteractiveDemoRenderer = () => {
            const [showTimezone, setShowTimezone] = react.useState(!0),
              [value, setValue] = react.useState({
                start: new Date(),
                end: new Date(new Date().getTime() + 72e5),
              })
            return (0, jsx_runtime.jsxs)('div', {
              style: {
                width: '600px',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              },
              children: [
                (0, jsx_runtime.jsxs)('div', {
                  style: {
                    padding: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                  },
                  children: [
                    (0, jsx_runtime.jsx)('h3', {
                      style: { fontWeight: 'bold', marginBottom: '0.5rem' },
                      children: 'Controls',
                    }),
                    (0, jsx_runtime.jsx)('div', {
                      style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '0.5rem',
                      },
                      children: (0, jsx_runtime.jsxs)('label', {
                        children: [
                          (0, jsx_runtime.jsx)('input', {
                            type: 'checkbox',
                            checked: showTimezone,
                            onChange: e => setShowTimezone(e.target.checked),
                          }),
                          'Show Timezone',
                        ],
                      }),
                    }),
                  ],
                }),
                (0, jsx_runtime.jsx)('div', {
                  style: {
                    padding: '2rem',
                    borderRadius: '8px',
                    backgroundColor: '#f9fafb',
                  },
                  children: (0, jsx_runtime.jsx)(TimeRange, {
                    value,
                    onChange: setValue,
                    showTimezone,
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
      './src/components/Icons/AccessTime.tsx': (
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
          AccessTimeIcon = ({ sacredtheme = !1, style = {}, ...props }) => {
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
            const iconStyle = {
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
                      xmlns: 'http://www.w3.org/2000/svg',
                      height: '24',
                      viewBox: '0 -960 960 960',
                      width: '24',
                      fill: 'currentColor',
                      style: iconStyle,
                      ...props,
                      children: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'path',
                        {
                          d: 'm612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z',
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
          __WEBPACK_DEFAULT_EXPORT__ = AccessTimeIcon
        AccessTimeIcon.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'AccessTimeIcon',
          props: {
            sacredtheme: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
            style: {
              defaultValue: { value: '{}', computed: !1 },
              required: !1,
            },
          },
        }
      },
      './src/components/Icons/ExpandMore.tsx': (
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
    },
  ]
)
