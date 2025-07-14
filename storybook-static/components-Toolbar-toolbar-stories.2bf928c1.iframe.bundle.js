'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [7459],
    {
      './src/components/Toolbar/toolbar.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            DarkTheme: () => DarkTheme,
            InteractiveDemo: () => InteractiveDemo,
            LightTheme: () => LightTheme,
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
            './src/components/Toolbar/index.tsx'
          ),
          console = __webpack_require__(
            './node_modules/console-browserify/index.js'
          )
        const sampleButtons = [
            {
              text: 'Button 1',
              onClick: () => console.log('Button 1 clicked'),
            },
            {
              text: 'Button 2',
              onClick: () => console.log('Button 2 clicked'),
            },
          ],
          sampleSearchProps = {
            label: 'Search Something',
            placeholder: 'Type here...',
            value: '',
            onChange: e => console.log('Searching =>', e.target.value),
          },
          sampleDropdown = {
            label: 'Pick an Option',
            options: [
              { value: 'Alpha' },
              { value: 'Beta' },
              { value: 'Gamma' },
            ],
            onChange: e => console.log('Single dropdown =>', e.target.value),
          },
          __WEBPACK_DEFAULT_EXPORT__ = {
            title: 'Components/Toolbar',
            component: _index__WEBPACK_IMPORTED_MODULE_2__.A,
            argTypes: {
              styles: {
                control: 'object',
                description: 'Toolbar styling configuration',
              },
            },
            parameters: { layout: 'fullscreen' },
          },
          LightTheme = {
            name: 'Light Theme',
            render: args =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                className: 'p-4 bg-gray-100',
                children: (0,
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  _index__WEBPACK_IMPORTED_MODULE_2__.A,
                  { ...args }
                ),
              }),
            args: {
              buttons: sampleButtons,
              searchbarProps: sampleSearchProps,
              rightCenterProps: {
                selectedRows: ['1'],
                rows: [{ id: '1' }],
                onDuplicate: () => console.log('duplicate'),
                onDelete: () => console.log('delete'),
              },
              dropdowns: [sampleDropdown],
              styles: { theme: 'light' },
            },
          },
          DarkTheme = {
            name: 'Dark Theme',
            render: args =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                className: 'p-4 bg-gray-900',
                children: (0,
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  _index__WEBPACK_IMPORTED_MODULE_2__.A,
                  { ...args }
                ),
              }),
            args: { ...LightTheme.args, styles: { theme: 'dark' } },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: args =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                className: 'p-4 bg-black',
                children: (0,
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  _index__WEBPACK_IMPORTED_MODULE_2__.A,
                  { ...args }
                ),
              }),
            args: { ...LightTheme.args, styles: { theme: 'sacred' } },
          },
          InteractiveDemoRenderer = () => {
            const [theme, setTheme] =
                react__WEBPACK_IMPORTED_MODULE_1__.useState('light'),
              [showButtons, setShowButtons] =
                react__WEBPACK_IMPORTED_MODULE_1__.useState(!0),
              [showSearch, setShowSearch] =
                react__WEBPACK_IMPORTED_MODULE_1__.useState(!0),
              [showRightCenter, setShowRightCenter] =
                react__WEBPACK_IMPORTED_MODULE_1__.useState(!0),
              [showDropdowns, setShowDropdowns] =
                react__WEBPACK_IMPORTED_MODULE_1__.useState(!0),
              backgroundClass =
                'sacred' === theme
                  ? 'bg-black'
                  : 'dark' === theme
                    ? 'bg-gray-900'
                    : 'bg-gray-100'
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                className: `p-4 ${backgroundClass}`,
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      className:
                        'fixed top-24 right-4 z-50 p-4 bg-white rounded-lg border shadow-lg',
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'h3',
                          {
                            className: 'text-lg font-bold mb-2',
                            children: 'Controls',
                          }
                        ),
                        (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'div',
                          {
                            className: 'flex flex-col gap-2',
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                'label',
                                {
                                  children: [
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      'span',
                                      {
                                        className:
                                          'block text-sm font-medium mb-1',
                                        children: 'Theme:',
                                      }
                                    ),
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                      'select',
                                      {
                                        value: theme,
                                        onChange: e => setTheme(e.target.value),
                                        className: 'w-full p-1 border rounded',
                                        children: [
                                          (0,
                                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                            'option',
                                            {
                                              value: 'light',
                                              children: 'Light',
                                            }
                                          ),
                                          (0,
                                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                            'option',
                                            { value: 'dark', children: 'Dark' }
                                          ),
                                          (0,
                                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                            'option',
                                            {
                                              value: 'sacred',
                                              children: 'Sacred',
                                            }
                                          ),
                                        ],
                                      }
                                    ),
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
                                        checked: showButtons,
                                        onChange: e =>
                                          setShowButtons(e.target.checked),
                                      }
                                    ),
                                    ' ',
                                    'Show Buttons',
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
                                        checked: showSearch,
                                        onChange: e =>
                                          setShowSearch(e.target.checked),
                                      }
                                    ),
                                    ' ',
                                    'Show Search',
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
                                        checked: showRightCenter,
                                        onChange: e =>
                                          setShowRightCenter(e.target.checked),
                                      }
                                    ),
                                    ' ',
                                    'Show Right Center',
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
                                        checked: showDropdowns,
                                        onChange: e =>
                                          setShowDropdowns(e.target.checked),
                                      }
                                    ),
                                    ' ',
                                    'Show Dropdowns',
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
                    _index__WEBPACK_IMPORTED_MODULE_2__.A,
                    {
                      buttons: showButtons ? sampleButtons : void 0,
                      searchbarProps: showSearch ? sampleSearchProps : void 0,
                      rightCenterProps: showRightCenter
                        ? { selectedRows: ['1'], rows: [{ id: '1' }] }
                        : void 0,
                      dropdowns: showDropdowns ? [sampleDropdown] : void 0,
                      styles: { theme },
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
            'LightTheme',
            'DarkTheme',
            'SacredTheme',
            'InteractiveDemo',
          ]
      },
    },
  ]
)
