'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [5027],
    {
      './src/components/Tooltip/tooltip.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            InteractiveDemo: () => InteractiveDemo,
            PremiumThemeVariants: () => PremiumThemeVariants,
            SacredThemeVariants: () => SacredThemeVariants,
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
            './src/components/Tooltip/index.tsx'
          ),
          _Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
            './src/components/Button/index.tsx'
          )
        const __WEBPACK_DEFAULT_EXPORT__ = {
            title: 'Components/Tooltip',
            component: _index__WEBPACK_IMPORTED_MODULE_2__.A,
            parameters: { layout: 'centered' },
            argTypes: {
              title: { control: 'text' },
              tooltipplacement: {
                control: 'select',
                options: ['top', 'bottom', 'left', 'right'],
              },
              sacredtheme: { control: 'boolean' },
              arrow: { control: 'boolean' },
              enterDelay: { control: 'number' },
              leaveDelay: { control: 'number' },
            },
            tags: ['autodocs'],
          },
          defaultArgs = {
            title: 'Tooltip',
            children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
              { text: 'Hover me' }
            ),
          },
          PremiumThemeVariants = {
            name: 'Premium Theme - All Variants',
            render: args =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                className: 'p-8 bg-gray-50 rounded-xl',
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'h3',
                    {
                      className:
                        'text-xl font-bold text-gray-900 mb-6 font-inter',
                      children: 'Premium Tooltips',
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      className:
                        'flex flex-wrap gap-8 justify-center items-center h-64',
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'top',
                            title: 'Top Tooltip',
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'Top' }
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'bottom',
                            title: 'Bottom Tooltip',
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'Bottom' }
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'left',
                            title: 'Left Tooltip',
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'Left' }
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'right',
                            title: 'Right Tooltip',
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'Right' }
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'top',
                            title: 'No Arrow',
                            arrow: !1,
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'No Arrow' }
                            ),
                          }
                        ),
                      ],
                    }
                  ),
                ],
              }),
            args: { ...defaultArgs, sacredtheme: !1 },
          },
          SacredThemeVariants = {
            name: 'Sacred Theme - All Variants',
            render: args =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                className: 'p-8 bg-black/90 rounded-xl',
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'h3',
                    {
                      className:
                        'text-xl font-bold text-yellow-400 mb-6 font-cinzel animate-sacred-glow',
                      children: 'Sacred Tooltips',
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      className:
                        'flex flex-wrap gap-8 justify-center items-center h-64',
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'top',
                            title: 'Ancient Wisdom (Top)',
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'Top', styles: { theme: 'sacred' } }
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'bottom',
                            title: 'Divine Insight (Bottom)',
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'Bottom', styles: { theme: 'sacred' } }
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'left',
                            title: 'Mystical Secret (Left)',
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'Left', styles: { theme: 'sacred' } }
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'right',
                            title: 'Golden Prophecy (Right)',
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'Right', styles: { theme: 'sacred' } }
                            ),
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _index__WEBPACK_IMPORTED_MODULE_2__.A,
                          {
                            ...args,
                            tooltipplacement: 'top',
                            title: 'No Arrow',
                            arrow: !1,
                            children: (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                              { text: 'No Arrow', styles: { theme: 'sacred' } }
                            ),
                          }
                        ),
                      ],
                    }
                  ),
                ],
              }),
            args: { ...defaultArgs, sacredtheme: !0 },
          },
          InteractiveDemoRenderer = () => {
            const [config, setConfig] =
              react__WEBPACK_IMPORTED_MODULE_1__.useState({
                title: 'Interactive Tooltip',
                placement: 'top',
                sacredtheme: !1,
                showArrow: !0,
                enterDelay: 100,
                leaveDelay: 0,
              })
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                className: 'w-[500px] space-y-6',
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                    'div',
                    {
                      className:
                        'p-6 bg-white rounded-lg border border-gray-200',
                      children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'h3',
                          {
                            className:
                              'text-lg font-semibold text-gray-900 mb-4',
                            children: 'Tooltip Configuration',
                          }
                        ),
                        (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'div',
                          {
                            className: 'grid grid-cols-2 gap-4',
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                'div',
                                {
                                  children: [
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      'label',
                                      {
                                        className:
                                          'block text-sm font-medium text-gray-700 mb-2',
                                        children: 'Title',
                                      }
                                    ),
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      'input',
                                      {
                                        type: 'text',
                                        value: config.title,
                                        onChange: e =>
                                          setConfig({
                                            ...config,
                                            title: e.target.value,
                                          }),
                                        className:
                                          'w-full p-2 border border-gray-300 rounded-md',
                                      }
                                    ),
                                  ],
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                'div',
                                {
                                  children: [
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      'label',
                                      {
                                        className:
                                          'block text-sm font-medium text-gray-700 mb-2',
                                        children: 'Placement',
                                      }
                                    ),
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                      'select',
                                      {
                                        value: config.placement,
                                        onChange: e =>
                                          setConfig({
                                            ...config,
                                            placement: e.target.value,
                                          }),
                                        className:
                                          'w-full p-2 border border-gray-300 rounded-md',
                                        children: [
                                          (0,
                                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                            'option',
                                            { value: 'top', children: 'Top' }
                                          ),
                                          (0,
                                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                            'option',
                                            {
                                              value: 'bottom',
                                              children: 'Bottom',
                                            }
                                          ),
                                          (0,
                                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                            'option',
                                            { value: 'left', children: 'Left' }
                                          ),
                                          (0,
                                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                            'option',
                                            {
                                              value: 'right',
                                              children: 'Right',
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
                        (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'div',
                          {
                            className: 'flex items-center gap-4 mt-4',
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                'label',
                                {
                                  className: 'flex items-center',
                                  children: [
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      'input',
                                      {
                                        type: 'checkbox',
                                        checked: config.sacredtheme,
                                        onChange: e =>
                                          setConfig({
                                            ...config,
                                            sacredtheme: e.target.checked,
                                          }),
                                      }
                                    ),
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      'span',
                                      {
                                        className: 'ml-2',
                                        children: 'Sacred Theme',
                                      }
                                    ),
                                  ],
                                }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                'label',
                                {
                                  className: 'flex items-center',
                                  children: [
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      'input',
                                      {
                                        type: 'checkbox',
                                        checked: config.showArrow,
                                        onChange: e =>
                                          setConfig({
                                            ...config,
                                            showArrow: e.target.checked,
                                          }),
                                      }
                                    ),
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      'span',
                                      {
                                        className: 'ml-2',
                                        children: 'Show Arrow',
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
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'div',
                    {
                      className:
                        'p-8 rounded-xl flex justify-center items-center h-48 ' +
                        (config.sacredtheme ? 'bg-black/90' : 'bg-gray-50'),
                      children: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        _index__WEBPACK_IMPORTED_MODULE_2__.A,
                        {
                          title: config.title,
                          tooltipplacement: config.placement,
                          sacredtheme: config.sacredtheme,
                          arrow: config.showArrow,
                          enterDelay: config.enterDelay,
                          leaveDelay: config.leaveDelay,
                          children: (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            _Button__WEBPACK_IMPORTED_MODULE_3__.A,
                            {
                              text: 'Hover me',
                              styles: {
                                theme: config.sacredtheme ? 'sacred' : 'light',
                              },
                            }
                          ),
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
            'PremiumThemeVariants',
            'SacredThemeVariants',
            'InteractiveDemo',
          ]
      },
    },
  ]
)
