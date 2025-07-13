'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [5010],
    {
      './src/components/Field/Number/InternalIncrement/InternalIncrement.stories.tsx':
        (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
          ;(__webpack_require__.r(__webpack_exports__),
            __webpack_require__.d(__webpack_exports__, {
              InteractiveDemo: () => InteractiveDemo,
              PremiumTheme: () => PremiumTheme,
              SacredTheme: () => SacredTheme,
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
            _index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
              './src/components/Field/Number/InternalIncrement/index.tsx'
            )
          const __WEBPACK_DEFAULT_EXPORT__ = {
              title: 'Components/Field/Number/InternalIncrement',
              component: _index__WEBPACK_IMPORTED_MODULE_2__.A,
              argTypes: {
                styles: { control: 'object' },
                label: { control: 'text' },
                helperText: { control: 'text' },
                min: { control: 'number' },
                max: { control: 'number' },
                initialValue: { control: 'text' },
                initialDelay: { control: 'number' },
                repeatInterval: { control: 'number' },
              },
              parameters: { layout: 'centered' },
            },
            PremiumTheme = {
              name: 'Premium Theme',
              render: args =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                  style: {
                    width: '400px',
                    padding: '2rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                  },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _index__WEBPACK_IMPORTED_MODULE_2__.A,
                    { ...args }
                  ),
                }),
              args: {
                label: 'Quantity',
                initialValue: '1',
                styles: { theme: 'light' },
              },
            },
            SacredTheme = {
              name: 'Sacred Theme',
              render: args =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                  style: {
                    width: '400px',
                    padding: '2rem',
                    backgroundColor: '#000',
                    borderRadius: '8px',
                  },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _index__WEBPACK_IMPORTED_MODULE_2__.A,
                    { ...args }
                  ),
                }),
              args: { ...PremiumTheme.args, styles: { theme: 'sacred' } },
            },
            InteractiveDemoRenderer = () => {
              const [sacredtheme, setsacredtheme] =
                  react__WEBPACK_IMPORTED_MODULE_1__.useState(!1),
                [disabled, setDisabled] =
                  react__WEBPACK_IMPORTED_MODULE_1__.useState(!1),
                [value, setValue] =
                  react__WEBPACK_IMPORTED_MODULE_1__.useState('10')
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
                          borderRadius: '8px',
                        },
                        children: [
                          (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
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
                            'div',
                            {
                              style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '0.5rem',
                              },
                              children: [
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
                                      'Sacred',
                                    ],
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
                                          checked: disabled,
                                          onChange: e =>
                                            setDisabled(e.target.checked),
                                        }
                                      ),
                                      'Disabled',
                                    ],
                                  }
                                ),
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
                          borderRadius: '8px',
                          backgroundColor: sacredtheme ? 'black' : '#f9fafb',
                          display: 'flex',
                          justifyContent: 'center',
                        },
                        children: (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            label: 'Amount',
                            initialValue: value,
                            onChange: e => {
                              setValue(
                                'number' == typeof e
                                  ? String(e)
                                  : e.target.value
                              )
                            },
                            styles: {
                              theme: sacredtheme ? 'sacred' : 'light',
                              disabled,
                            },
                            min: 0,
                            max: 100,
                          }
                        ),
                      }
                    ),
                  ],
                }
              )
            },
            InteractiveDemo = {
              name: 'Interactive Demo',
              render: () =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  InteractiveDemoRenderer,
                  {}
                ),
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
