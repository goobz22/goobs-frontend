'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [3010],
    {
      './src/components/ConfirmationCodeInput/codeinput.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            Interactive: () => Interactive,
            Premium: () => Premium,
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
            './src/components/ConfirmationCodeInput/index.tsx'
          )
        const __WEBPACK_DEFAULT_EXPORT__ = {
            title: 'Components/ConfirmationCodeInputs',
            component: _index__WEBPACK_IMPORTED_MODULE_2__.A,
            argTypes: {
              codeLength: { control: 'number' },
              showActionButtons: { control: 'boolean' },
              showSendResendButton: { control: 'boolean' },
              showSuccessState: { control: 'boolean' },
              styles: {
                control: 'object',
                description: 'Custom styles using the theme system',
              },
            },
            parameters: { layout: 'centered' },
          },
          Premium = {
            name: 'Premium Theme',
            render: args =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                style: {
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
              isValid: !0,
              styles: { theme: 'light' },
              onDisableVerification: () => alert('Verification disabled'),
            },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: args =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                style: {
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
            args: {
              isValid: !0,
              styles: { theme: 'sacred' },
              onDisableVerification: () => alert('Verification disabled'),
            },
          },
          InteractiveDemo = () => {
            const [sacredTheme, setSacredTheme] =
                react__WEBPACK_IMPORTED_MODULE_1__.useState(!1),
              [value, setValue] =
                react__WEBPACK_IMPORTED_MODULE_1__.useState(''),
              [isValid, setIsValid] =
                react__WEBPACK_IMPORTED_MODULE_1__.useState(!1),
              [showSuccess, setShowSuccess] =
                react__WEBPACK_IMPORTED_MODULE_1__.useState(!1)
            react__WEBPACK_IMPORTED_MODULE_1__.useEffect(() => {
              setIsValid(6 === value.length && /^\d+$/.test(value))
            }, [value])
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: {
                  width: '600px',
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
                                  checked: sacredTheme,
                                  onChange: e =>
                                    setSacredTheme(e.target.checked),
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
                        backgroundColor: sacredTheme ? 'black' : '#f3f4f6',
                      },
                      children: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        _index__WEBPACK_IMPORTED_MODULE_2__.A,
                        {
                          value,
                          onChange: setValue,
                          isValid,
                          onVerify: () => {
                            isValid &&
                              (setShowSuccess(!0),
                              setTimeout(() => {
                                ;(setShowSuccess(!1), setValue(''))
                              }, 3e3))
                          },
                          styles: { theme: sacredTheme ? 'sacred' : 'light' },
                          showActionButtons: !0,
                          showSuccessState: showSuccess,
                          onDisableVerification: () => alert('Disabled'),
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
          __namedExportsOrder = ['Premium', 'SacredTheme', 'Interactive']
      },
    },
  ]
)
