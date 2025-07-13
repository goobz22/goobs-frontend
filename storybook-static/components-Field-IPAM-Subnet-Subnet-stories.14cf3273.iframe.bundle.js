'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [6196],
    {
      './src/components/Field/IPAM/Subnet/Subnet.stories.tsx': (
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
            default: () => __WEBPACK_DEFAULT_EXPORT__,
          }))
        var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ =
            __webpack_require__(
              './node_modules/next/dist/compiled/react/jsx-runtime.js'
            ),
          react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          ___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
            './src/components/Field/IPAM/Subnet/index.tsx'
          ),
          console = __webpack_require__(
            './node_modules/console-browserify/index.js'
          )
        const __WEBPACK_DEFAULT_EXPORT__ = {
            title: 'Components/Field/IPAM/Subnet',
            component: ___WEBPACK_IMPORTED_MODULE_2__.A,
            argTypes: {
              disabled: { control: 'boolean' },
              label: { control: 'text' },
              min: { control: 'number' },
              max: { control: 'number' },
            },
            parameters: { layout: 'centered' },
          },
          PremiumTheme = {
            name: 'Premium Theme',
            render: args =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                className: 'w-[400px] p-6 bg-gray-50 rounded-lg',
                children: (0,
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  ___WEBPACK_IMPORTED_MODULE_2__.A,
                  { ...args }
                ),
              }),
            args: {
              label: 'Subnet Mask',
              value: { address: '', mask: 24 },
              onChange: value => console.log('Value changed:', value),
            },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: args =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                className: 'w-[400px] p-6 bg-black rounded-lg',
                children: (0,
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  ___WEBPACK_IMPORTED_MODULE_2__.A,
                  { ...args }
                ),
              }),
            args: { ...PremiumTheme.args },
          },
          InteractiveSubnetDemo = () => {
            const [sacredtheme, setsacredtheme] =
                react__WEBPACK_IMPORTED_MODULE_1__.useState(!1),
              [disabled, setDisabled] =
                react__WEBPACK_IMPORTED_MODULE_1__.useState(!1),
              [value, setValue] = react__WEBPACK_IMPORTED_MODULE_1__.useState({
                address: '',
                mask: 24,
              })
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                className: 'w-[500px] space-y-4',
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      className: 'p-4 bg-white rounded-lg border',
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
                          'div',
                          {
                            className: 'grid grid-cols-2 gap-2',
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
                                    ' ',
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
                                    ' ',
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
                      className:
                        'p-6 rounded-lg ' +
                        (sacredtheme ? 'bg-black' : 'bg-gray-50'),
                      children: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        ___WEBPACK_IMPORTED_MODULE_2__.A,
                        {
                          label: 'Interactive Subnet',
                          value,
                          onChange: setValue,
                          disabled,
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
                InteractiveSubnetDemo,
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
