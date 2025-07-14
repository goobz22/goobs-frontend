'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [3626],
    {
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
