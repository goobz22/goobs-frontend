;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [7175],
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
      './src/components/Field/Dropdown/Searchable/index.tsx': (
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
      './src/components/Field/Dropdown/Searchable/searchabledropdown.stories.tsx':
        (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
          'use strict'
          ;(__webpack_require__.r(__webpack_exports__),
            __webpack_require__.d(__webpack_exports__, {
              ComprehensiveShowcase: () => ComprehensiveShowcase,
              CustomColors: () => CustomColors,
              CustomLayout: () => CustomLayout,
              CustomTypography: () => CustomTypography,
              DarkTheme: () => DarkTheme,
              DisabledStates: () => DisabledStates,
              ErrorStates: () => ErrorStates,
              InteractionTest: () => InteractionTest,
              LightTheme: () => LightTheme,
              NeonStyle: () => NeonStyle,
              OptionVariations: () => OptionVariations,
              RequiredFields: () => RequiredFields,
              SacredTheme: () => SacredTheme,
              SearchDemo: () => SearchDemo,
              __namedExportsOrder: () => __namedExportsOrder,
              default: () => __WEBPACK_DEFAULT_EXPORT__,
            }))
          var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ =
              __webpack_require__(
                './node_modules/next/dist/compiled/react/jsx-runtime.js'
              ),
            react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
              './node_modules/next/dist/compiled/react/index.js'
            ),
            _storybook_test__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
              './node_modules/@storybook/test/dist/index.mjs'
            ),
            _index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
              './src/components/Field/Dropdown/Searchable/index.tsx'
            ),
            console = __webpack_require__(
              './node_modules/console-browserify/index.js'
            )
          const sampleOptions = [
              { value: 'apple' },
              { value: 'banana' },
              { value: 'cherry' },
              { value: 'date' },
              { value: 'elderberry' },
              { value: 'fig' },
              { value: 'grape' },
              { value: 'honeydew' },
            ],
            countryOptions = [
              { value: 'us' },
              { value: 'ca' },
              { value: 'uk' },
              { value: 'au' },
              { value: 'de' },
              { value: 'fr' },
              { value: 'jp' },
              { value: 'in' },
              { value: 'br' },
              { value: 'mx' },
            ],
            SearchableDropdownWithState = ({
              initialValue = '',
              options = sampleOptions,
              styles,
              ...props
            }) =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                _index__WEBPACK_IMPORTED_MODULE_3__.A,
                {
                  ...props,
                  options,
                  defaultValue: initialValue,
                  onChange: option => {
                    console.log('Selected option:', option)
                  },
                  styles,
                }
              ),
            __WEBPACK_DEFAULT_EXPORT__ = {
              title: 'Components/Field/Dropdown/Searchable',
              component: _index__WEBPACK_IMPORTED_MODULE_3__.A,
              parameters: { layout: 'centered' },
              tags: ['autodocs'],
              argTypes: {
                defaultValue: { control: 'text' },
                onChange: { action: 'changed' },
                label: { control: 'text' },
                placeholder: { control: 'text' },
                helperText: { control: 'text' },
                options: { control: 'object' },
                styles: { control: 'object' },
              },
              decorators: [
                Story =>
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'div',
                    {
                      style: { width: '400px', padding: '2rem' },
                      children: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        Story,
                        {}
                      ),
                    }
                  ),
              ],
            },
            LightTheme = {
              name: 'Light Theme (Default)',
              render: () =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  SearchableDropdownWithState,
                  {
                    label: 'Select Fruit',
                    placeholder: 'Choose a fruit',
                    styles: { theme: 'light' },
                  }
                ),
            },
            DarkTheme = {
              name: 'Dark Theme',
              render: () =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  SearchableDropdownWithState,
                  {
                    label: 'Select Country',
                    placeholder: 'Choose a country',
                    options: countryOptions,
                    styles: { theme: 'dark' },
                  }
                ),
              parameters: { backgrounds: { default: 'dark' } },
            },
            SacredTheme = {
              name: 'Sacred Theme',
              render: () =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  SearchableDropdownWithState,
                  {
                    label: 'Divine Selection',
                    placeholder: 'Choose sacred option...',
                    styles: { theme: 'sacred' },
                  }
                ),
              parameters: { backgrounds: { default: 'dark' } },
            },
            CustomColors = {
              name: 'Custom Colors',
              render: () =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  SearchableDropdownWithState,
                  {
                    label: 'Custom Dropdown',
                    placeholder: 'Choose option',
                    styles: {
                      theme: 'light',
                      backgroundColor: 'rgba(249, 250, 251, 0.95)',
                      borderColor: 'rgba(79, 70, 229, 0.4)',
                      borderFocusedColor: 'rgba(79, 70, 229, 1)',
                      textColor: 'rgba(55, 48, 163, 1)',
                      labelColor: 'rgba(55, 48, 163, 0.7)',
                    },
                  }
                ),
            },
            NeonStyle = {
              name: 'Neon Style',
              render: () =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  SearchableDropdownWithState,
                  {
                    label: 'Neon Dropdown',
                    placeholder: 'Choose option',
                    styles: {
                      theme: 'dark',
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      borderColor: 'rgba(16, 185, 129, 0.5)',
                      borderFocusedColor: 'rgba(16, 185, 129, 1)',
                      textColor: 'rgba(16, 185, 129, 1)',
                      labelColor: 'rgba(16, 185, 129, 0.7)',
                      borderRadius: '12px',
                      borderWidth: '2px',
                    },
                  }
                ),
              parameters: { backgrounds: { default: 'dark' } },
            },
            CustomLayout = {
              name: 'Custom Layout & Spacing',
              render: () =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    },
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Large Padding',
                          placeholder: 'Choose option',
                          styles: {
                            theme: 'light',
                            padding: '24px',
                            borderRadius: '16px',
                            fontSize: '18px',
                          },
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Custom Dimensions',
                          placeholder: 'Fixed height',
                          styles: {
                            theme: 'light',
                            height: '60px',
                            width: '100%',
                            borderRadius: '8px',
                          },
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Asymmetric Padding',
                          placeholder: 'Different padding sides',
                          styles: {
                            theme: 'light',
                            paddingLeft: '32px',
                            paddingRight: '16px',
                            paddingTop: '20px',
                            paddingBottom: '20px',
                          },
                        }
                      ),
                    ],
                  }
                ),
            },
            CustomTypography = {
              name: 'Custom Typography',
              render: () =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    },
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Large Text',
                          placeholder: 'Choose option',
                          styles: {
                            theme: 'light',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            lineHeight: '1.5',
                            padding: '20px',
                          },
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Custom Font',
                          placeholder: 'Different font family',
                          styles: {
                            theme: 'light',
                            fontFamily: '"Georgia", serif',
                            fontSize: '16px',
                            fontWeight: 400,
                          },
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Small & Light',
                          placeholder: 'Choose option',
                          styles: {
                            theme: 'light',
                            fontSize: '14px',
                            fontWeight: 300,
                            padding: '12px',
                          },
                        }
                      ),
                    ],
                  }
                ),
            },
            OptionVariations = {
              name: 'Option Variations',
              render: () =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    },
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Fruits',
                          placeholder: 'Choose a fruit',
                          options: sampleOptions,
                          styles: { theme: 'light' },
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Countries',
                          placeholder: 'Choose a country',
                          options: countryOptions,
                          styles: { theme: 'light' },
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Large Dataset',
                          placeholder: 'Choose option',
                          options: Array.from({ length: 100 }, (_, i) => ({
                            value: `option-${i}`,
                          })),
                          styles: { theme: 'light' },
                        }
                      ),
                    ],
                  }
                ),
            },
            ErrorStates = {
              name: 'Error States',
              render: () =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    },
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Select Option',
                          placeholder: 'Choose an option',
                          error: 'Please select a valid option.',
                          styles: { theme: 'light' },
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Country Selection',
                          placeholder: 'Choose a country',
                          error: 'Country selection is required.',
                          options: countryOptions,
                          styles: {
                            theme: 'dark',
                            borderErrorColor: 'rgba(255, 99, 71, 1)',
                            labelErrorColor: 'rgba(255, 99, 71, 1)',
                            footerTextErrorColor: 'rgba(255, 99, 71, 1)',
                          },
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Sacred Choice',
                          placeholder: 'Choose sacred option',
                          error: 'The divine choice is required.',
                          styles: { theme: 'sacred' },
                        }
                      ),
                    ],
                  }
                ),
            },
            RequiredFields = {
              name: 'Required Fields',
              render: () =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    },
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Required Selection',
                          placeholder: 'Choose an option',
                          required: !0,
                          styles: { theme: 'light' },
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Country',
                          placeholder: 'Choose a country',
                          required: !0,
                          error: 'This field is required',
                          options: countryOptions,
                          styles: { theme: 'light' },
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Category',
                          placeholder: 'Choose a category',
                          required: !0,
                          styles: { theme: 'dark' },
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Custom Required Dropdown',
                          placeholder: 'Choose divine option',
                          required: !0,
                          styles: {
                            theme: 'sacred',
                            requiredIndicatorText: ' (required)',
                            requiredIndicatorColor: 'rgba(255, 215, 0, 1)',
                          },
                        }
                      ),
                    ],
                  }
                ),
            },
            ComprehensiveShowcase = {
              name: 'Comprehensive Showcase',
              render: () =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                  'div',
                  {
                    style: {
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '2rem',
                      padding: '1rem',
                    },
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                        'div',
                        {
                          children: [
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'h3',
                              {
                                style: {
                                  margin: '0 0 1rem 0',
                                  color: '#374151',
                                },
                                children: 'Light Theme',
                              }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                              'div',
                              {
                                style: {
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '1rem',
                                },
                                children: [
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    SearchableDropdownWithState,
                                    {
                                      label: 'Basic Dropdown',
                                      placeholder: 'Choose option',
                                      styles: { theme: 'light' },
                                    }
                                  ),
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    SearchableDropdownWithState,
                                    {
                                      label: 'With Error',
                                      placeholder: 'Choose option',
                                      error: 'Invalid selection',
                                      styles: { theme: 'light' },
                                    }
                                  ),
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    SearchableDropdownWithState,
                                    {
                                      label: 'Required Field',
                                      placeholder: 'Choose option',
                                      required: !0,
                                      styles: { theme: 'light' },
                                    }
                                  ),
                                ],
                              }
                            ),
                          ],
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                        'div',
                        {
                          children: [
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'h3',
                              {
                                style: {
                                  margin: '0 0 1rem 0',
                                  color: '#9CA3AF',
                                },
                                children: 'Dark Theme',
                              }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                              'div',
                              {
                                style: {
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '1rem',
                                },
                                children: [
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    SearchableDropdownWithState,
                                    {
                                      label: 'Basic Dark',
                                      placeholder: 'Choose option',
                                      styles: { theme: 'dark' },
                                    }
                                  ),
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    SearchableDropdownWithState,
                                    {
                                      label: 'Custom Colors',
                                      placeholder: 'Custom styling',
                                      styles: {
                                        theme: 'dark',
                                        borderFocusedColor:
                                          'rgba(34, 197, 94, 1)',
                                        labelColor: 'rgba(34, 197, 94, 0.8)',
                                      },
                                    }
                                  ),
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    SearchableDropdownWithState,
                                    {
                                      label: 'Large Size',
                                      placeholder: 'Choose option',
                                      styles: {
                                        theme: 'dark',
                                        fontSize: '18px',
                                        padding: '20px',
                                        borderRadius: '12px',
                                      },
                                    }
                                  ),
                                ],
                              }
                            ),
                          ],
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                        'div',
                        {
                          children: [
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'h3',
                              {
                                style: {
                                  margin: '0 0 1rem 0',
                                  color: '#FFD700',
                                },
                                children: 'Sacred Theme',
                              }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                              'div',
                              {
                                style: {
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '1rem',
                                },
                                children: [
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    SearchableDropdownWithState,
                                    {
                                      label: 'Divine Selection',
                                      placeholder: 'Sacred choice',
                                      styles: { theme: 'sacred' },
                                    }
                                  ),
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    SearchableDropdownWithState,
                                    {
                                      label: 'Sacred Dropdown',
                                      placeholder: 'Choose divine option',
                                      error: 'Choice forbidden',
                                      styles: { theme: 'sacred' },
                                    }
                                  ),
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    SearchableDropdownWithState,
                                    {
                                      label: 'Holy Selection',
                                      placeholder: 'Enter divine choice',
                                      styles: {
                                        theme: 'sacred',
                                        borderRadius: '16px',
                                        padding: '18px',
                                      },
                                    }
                                  ),
                                ],
                              }
                            ),
                          ],
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                        'div',
                        {
                          children: [
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'h3',
                              {
                                style: {
                                  margin: '0 0 1rem 0',
                                  color: '#7C3AED',
                                },
                                children: 'Custom Styling',
                              }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                              'div',
                              {
                                style: {
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '1rem',
                                },
                                children: [
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    SearchableDropdownWithState,
                                    {
                                      label: 'Neon Style',
                                      placeholder: 'Choose option',
                                      styles: {
                                        theme: 'dark',
                                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                                        borderColor: 'rgba(147, 51, 234, 0.5)',
                                        borderFocusedColor:
                                          'rgba(147, 51, 234, 1)',
                                        textColor: 'rgba(147, 51, 234, 1)',
                                        labelColor: 'rgba(147, 51, 234, 0.8)',
                                        borderRadius: '20px',
                                        borderWidth: '2px',
                                      },
                                    }
                                  ),
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    SearchableDropdownWithState,
                                    {
                                      label: 'Soft Rounded',
                                      placeholder: 'Choose option',
                                      styles: {
                                        theme: 'light',
                                        backgroundColor:
                                          'rgba(249, 250, 251, 1)',
                                        borderColor: 'rgba(209, 213, 219, 1)',
                                        borderFocusedColor:
                                          'rgba(59, 130, 246, 1)',
                                        borderRadius: '24px',
                                        padding: '16px 24px',
                                      },
                                    }
                                  ),
                                  (0,
                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                    SearchableDropdownWithState,
                                    {
                                      label: 'Minimal',
                                      placeholder: 'Choose option',
                                      styles: {
                                        theme: 'light',
                                        backgroundColor:
                                          'rgba(255, 255, 255, 1)',
                                        borderColor: 'rgba(0, 0, 0, 0.1)',
                                        borderFocusedColor:
                                          'rgba(0, 0, 0, 0.3)',
                                        borderRadius: '0px',
                                        borderWidth: '0px 0px 2px 0px',
                                        padding: '12px 0px',
                                      },
                                    }
                                  ),
                                ],
                              }
                            ),
                          ],
                        }
                      ),
                    ],
                  }
                ),
              parameters: {
                layout: 'fullscreen',
                backgrounds: { default: 'light' },
              },
            },
            DisabledStates = {
              name: 'Disabled States',
              render: () =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    },
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Disabled Light',
                          initialValue: 'apple',
                          disabled: !0,
                          styles: { theme: 'light' },
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Disabled Dark',
                          initialValue: 'us',
                          options: countryOptions,
                          disabled: !0,
                          styles: { theme: 'dark' },
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        SearchableDropdownWithState,
                        {
                          label: 'Disabled Sacred',
                          initialValue: 'banana',
                          disabled: !0,
                          styles: { theme: 'sacred' },
                        }
                      ),
                    ],
                  }
                ),
            },
            SearchableDropdownDemo = () => {
              const [selectedCountry, setSelectedCountry] = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useState)(''),
                [selectedFruit, setSelectedFruit] = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useState)(''),
                [error, setError] = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useState)('')
              return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                'div',
                {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    width: '400px',
                  },
                  children: [
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      'h3',
                      {
                        style: { margin: '0 0 1rem 0' },
                        children: 'Searchable Dropdown Demo',
                      }
                    ),
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      _index__WEBPACK_IMPORTED_MODULE_3__.A,
                      {
                        label: 'Country',
                        placeholder: 'Search and select country',
                        options: countryOptions,
                        defaultValue: selectedCountry,
                        onChange: option => {
                          setSelectedCountry(
                            (null == option ? void 0 : option.value) || ''
                          )
                        },
                        styles: { theme: 'light' },
                      }
                    ),
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      _index__WEBPACK_IMPORTED_MODULE_3__.A,
                      {
                        label: 'Fruit',
                        placeholder: 'Search and select fruit',
                        options: sampleOptions,
                        defaultValue: selectedFruit,
                        onChange: option => {
                          setSelectedFruit(
                            (null == option ? void 0 : option.value) || ''
                          )
                        },
                        styles: { theme: 'light' },
                      }
                    ),
                    error &&
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'div',
                        {
                          style: {
                            color: 'rgba(239, 68, 68, 1)',
                            fontSize: '14px',
                          },
                          children: error,
                        }
                      ),
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      'button',
                      {
                        onClick: () => {
                          selectedCountry && selectedFruit
                            ? (setError(''),
                              alert(
                                `Selected: ${selectedCountry} and ${selectedFruit}`
                              ))
                            : setError('Please select both country and fruit')
                        },
                        style: {
                          padding: '12px 24px',
                          backgroundColor: '#3B82F6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          fontWeight: '500',
                        },
                        children: 'Submit Selection',
                      }
                    ),
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                      'div',
                      {
                        style: { fontSize: '14px', color: '#6B7280' },
                        children: [
                          (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            'p',
                            { children: 'Searchable dropdown features:' }
                          ),
                          (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                            'ul',
                            {
                              style: {
                                margin: '0.5rem 0',
                                paddingLeft: '1.5rem',
                              },
                              children: [
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                  'li',
                                  {
                                    children:
                                      'Type to search and filter options',
                                  }
                                ),
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                  'li',
                                  { children: 'Select from filtered results' }
                                ),
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                  'li',
                                  { children: 'Keyboard navigation support' }
                                ),
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                  'li',
                                  { children: 'Required field validation' }
                                ),
                              ],
                            }
                          ),
                        ],
                      }
                    ),
                  ],
                }
              )
            },
            SearchDemo = {
              name: 'Search Demo',
              render: () =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  SearchableDropdownDemo,
                  {}
                ),
            },
            InteractionTest = {
              name: 'Interaction Test',
              render: () =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  SearchableDropdownWithState,
                  {
                    label: 'Test Searchable Dropdown',
                    placeholder: 'Search and select...',
                    styles: { theme: 'light' },
                  }
                ),
              play: async ({ canvasElement }) => {
                const canvas = (0,
                  _storybook_test__WEBPACK_IMPORTED_MODULE_2__.ux)(
                    canvasElement
                  ),
                  label = canvas.getByText('Test Searchable Dropdown'),
                  dropdown = canvas.getByRole('button')
                ;((0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                  label
                ).toBeVisible(),
                  (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                    dropdown
                  ).toBeVisible(),
                  await _storybook_test__WEBPACK_IMPORTED_MODULE_2__.Q4.click(
                    dropdown
                  ),
                  (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                    dropdown
                  ).toBeVisible())
              },
            },
            __namedExportsOrder = [
              'LightTheme',
              'DarkTheme',
              'SacredTheme',
              'CustomColors',
              'NeonStyle',
              'CustomLayout',
              'CustomTypography',
              'OptionVariations',
              'ErrorStates',
              'RequiredFields',
              'ComprehensiveShowcase',
              'DisabledStates',
              'SearchDemo',
              'InteractionTest',
            ]
        },
      './src/components/Icons/ArrowDropDown.tsx': (
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
    },
  ]
)
