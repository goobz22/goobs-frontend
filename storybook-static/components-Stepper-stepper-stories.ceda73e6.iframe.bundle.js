'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [2663],
    {
      './src/components/Stepper/index.tsx': (
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
          _theme_shared__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
            './src/theme/shared.ts'
          ),
          _Icons_Check__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
            './src/components/Icons/Check.tsx'
          ),
          _Icons_CircleOutline__WEBPACK_IMPORTED_MODULE_5__ =
            __webpack_require__('./src/components/Icons/CircleOutline.tsx'),
          _Icons_Lock__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
            './src/components/Icons/Lock.tsx'
          ),
          _Icons_Error__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
            './src/components/Icons/Error.tsx'
          ),
          _Icons_InfoOutline__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
            './src/components/Icons/InfoOutline.tsx'
          )
        const Tooltip = ({ children, title, styles }) => {
            const [isVisible, setIsVisible] = (0,
            react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1)
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: styles.tooltipContainer,
                onMouseEnter: () => setIsVisible(!0),
                onMouseLeave: () => setIsVisible(!1),
                children: [
                  children,
                  isVisible &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                      'div',
                      {
                        style: styles.tooltip,
                        children: [
                          title,
                          (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            'div',
                            { style: styles.tooltipArrow }
                          ),
                        ],
                      }
                    ),
                ],
              }
            )
          },
          Stepper = ({ steps, styles }) => {
            const [hoveredStep, setHoveredStep] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(null),
              [hoveredErrorIcon, setHoveredErrorIcon] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(null),
              orientation =
                (null == styles ? void 0 : styles.orientation) || 'horizontal',
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              computedStyles = (0, react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(
                () => (0, _theme__WEBPACK_IMPORTED_MODULE_2__.Mo)(styles),
                [styles]
              )
            ;(0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
              ;(0, _theme_shared__WEBPACK_IMPORTED_MODULE_3__.zh)()
            }, [])
            const getStepIcon = (status, stepNumber) => {
                switch (status) {
                  case 'completed':
                    return (0,
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      _Icons_Check__WEBPACK_IMPORTED_MODULE_4__.A,
                      { style: computedStyles.icon }
                    )
                  case 'error': {
                    const isErrorHovered = hoveredErrorIcon === stepNumber
                    return (0,
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      _Icons_Error__WEBPACK_IMPORTED_MODULE_7__.A,
                      {
                        style: {
                          ...computedStyles.errorIcon,
                          ...(isErrorHovered && computedStyles.errorIconHover),
                        },
                      }
                    )
                  }
                  case 'inactive':
                    return (0,
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      _Icons_Lock__WEBPACK_IMPORTED_MODULE_6__.A,
                      { style: computedStyles.inactiveIcon }
                    )
                  default:
                    return (0,
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      _Icons_CircleOutline__WEBPACK_IMPORTED_MODULE_5__.A,
                      { style: computedStyles.icon }
                    )
                }
              },
              isStepClickable = step => 'inactive' !== step.status,
              getStepIconContainerStyle = status => {
                switch (status) {
                  case 'completed':
                    return {
                      ...computedStyles.stepIconContainer,
                      ...computedStyles.stepIconContainerCompleted,
                    }
                  case 'active':
                    return {
                      ...computedStyles.stepIconContainer,
                      ...computedStyles.stepIconContainerActive,
                    }
                  case 'error':
                    return {
                      ...computedStyles.stepIconContainer,
                      ...computedStyles.stepIconContainerError,
                    }
                  case 'inactive':
                    return {
                      ...computedStyles.stepIconContainer,
                      ...computedStyles.stepIconContainerInactive,
                    }
                  default:
                    return computedStyles.stepIconContainer
                }
              }
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: computedStyles.container,
                children: [
                  isSacredTheme &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      'div',
                      {
                        style: computedStyles.sacredGlyph,
                        children:
                          _theme__WEBPACK_IMPORTED_MODULE_2__.vR[
                            Math.floor(
                              Math.random() *
                                _theme__WEBPACK_IMPORTED_MODULE_2__.vR.length
                            )
                          ],
                      }
                    ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'div',
                    {
                      style: {
                        ...computedStyles.stepperContainer,
                        flexDirection:
                          'vertical' === orientation ? 'column' : 'row',
                        gap: 'vertical' === orientation ? '1rem' : '0',
                      },
                      children: steps.map((step, index) => {
                        const isClickable = isStepClickable(step),
                          isHovered = hoveredStep === step.stepNumber
                        return (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'div',
                          {
                            style: {
                              ...computedStyles.stepContainer,
                              flex: 'horizontal' === orientation ? 1 : 'none',
                              width:
                                'vertical' === orientation ? '100%' : 'auto',
                            },
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                'div',
                                {
                                  style: computedStyles.stepContent,
                                  children: [
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      'div',
                                      {
                                        style: getStepIconContainerStyle(
                                          step.status
                                        ),
                                        children:
                                          'error' === step.status &&
                                          step.description
                                            ? (0,
                                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                Tooltip,
                                                {
                                                  title: step.description,
                                                  styles: computedStyles,
                                                  children: (0,
                                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                    'div',
                                                    {
                                                      style: {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent:
                                                          'center',
                                                      },
                                                      onMouseEnter: () =>
                                                        setHoveredErrorIcon(
                                                          step.stepNumber
                                                        ),
                                                      onMouseLeave: () =>
                                                        setHoveredErrorIcon(
                                                          null
                                                        ),
                                                      children: getStepIcon(
                                                        step.status,
                                                        step.stepNumber
                                                      ),
                                                    }
                                                  ),
                                                }
                                              )
                                            : getStepIcon(
                                                step.status,
                                                step.stepNumber
                                              ),
                                      }
                                    ),
                                    (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                      'div',
                                      {
                                        style: {
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.5rem',
                                        },
                                        children: [
                                          (0,
                                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                            'button',
                                            {
                                              onClick: () =>
                                                (step => {
                                                  isStepClickable(step) &&
                                                    (window.location.href =
                                                      (step =>
                                                        step.statusLink ||
                                                        step.stepLink)(step))
                                                })(step),
                                              disabled: !isClickable,
                                              style: {
                                                ...computedStyles.stepButton,
                                                ...(isHovered &&
                                                  isClickable &&
                                                  computedStyles.stepButtonHover),
                                                ...(!isClickable &&
                                                  computedStyles.stepButtonDisabled),
                                              },
                                              onMouseEnter: () =>
                                                setHoveredStep(step.stepNumber),
                                              onMouseLeave: () =>
                                                setHoveredStep(null),
                                              children: step.label,
                                            }
                                          ),
                                          step.description &&
                                            'error' !== step.status &&
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              Tooltip,
                                              {
                                                title: step.description,
                                                styles: computedStyles,
                                                children: (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                  'button',
                                                  {
                                                    style: {
                                                      ...computedStyles.infoButton,
                                                      ...(isHovered &&
                                                        computedStyles.infoButtonHover),
                                                    },
                                                    children: (0,
                                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                      _Icons_InfoOutline__WEBPACK_IMPORTED_MODULE_8__.A,
                                                      {
                                                        style: {
                                                          width: '1rem',
                                                          height: '1rem',
                                                        },
                                                      }
                                                    ),
                                                  }
                                                ),
                                              }
                                            ),
                                        ],
                                      }
                                    ),
                                  ],
                                }
                              ),
                              index < steps.length - 1 &&
                                'horizontal' === orientation &&
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                  'div',
                                  { style: computedStyles.connector }
                                ),
                              index < steps.length - 1 &&
                                'vertical' === orientation &&
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                  'div',
                                  { style: computedStyles.verticalConnector }
                                ),
                            ],
                          },
                          step.label
                        )
                      }),
                    }
                  ),
                ],
              }
            )
          }
        Stepper.displayName = 'Stepper'
        const __WEBPACK_DEFAULT_EXPORT__ = Stepper
        Stepper.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'Stepper',
          props: {
            steps: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [
                  {
                    name: 'signature',
                    type: 'object',
                    raw: "{\n  stepNumber: number\n  label: string\n  stepLink: string\n  status: 'completed' | 'active' | 'error' | 'inactive'\n  statusLink?: string\n  description?: string\n}",
                    signature: {
                      properties: [
                        {
                          key: 'stepNumber',
                          value: { name: 'number', required: !0 },
                        },
                        {
                          key: 'label',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'stepLink',
                          value: { name: 'string', required: !0 },
                        },
                        {
                          key: 'status',
                          value: {
                            name: 'union',
                            raw: "'completed' | 'active' | 'error' | 'inactive'",
                            elements: [
                              { name: 'literal', value: "'completed'" },
                              { name: 'literal', value: "'active'" },
                              { name: 'literal', value: "'error'" },
                              { name: 'literal', value: "'inactive'" },
                            ],
                            required: !0,
                          },
                        },
                        {
                          key: 'statusLink',
                          value: { name: 'string', required: !1 },
                        },
                        {
                          key: 'description',
                          value: { name: 'string', required: !1 },
                        },
                      ],
                    },
                  },
                ],
                raw: "{\n  stepNumber: number\n  label: string\n  stepLink: string\n  status: 'completed' | 'active' | 'error' | 'inactive'\n  statusLink?: string\n  description?: string\n}[]",
              },
              description:
                'Array of step objects defining the stepper configuration',
            },
            styles: {
              required: !1,
              tsType: { name: 'StepperStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties',
            },
          },
        }
      },
      './src/components/Stepper/stepper.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            AccountSetupWizard: () => AccountSetupWizard,
            CheckoutProcess: () => CheckoutProcess,
            InteractiveDemo: () => InteractiveDemo,
            ProjectSetupFlow: () => ProjectSetupFlow,
            SacredRitualSetup: () => SacredRitualSetup,
            ThemeShowcase: () => ThemeShowcase,
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
            './src/components/Stepper/index.tsx'
          )
        const Dialog = ({
            isOpen,
            onClose,
            title,
            children,
            theme = 'light',
          }) => {
            if (!isOpen) return null
            const styles = {
              light: {
                overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm',
                dialog:
                  'fixed inset-4 max-w-4xl mx-auto my-8 bg-white rounded-xl shadow-2xl',
                header:
                  'px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-xl',
                title: 'text-xl font-semibold text-gray-900',
                content: 'p-6 max-h-[70vh] overflow-y-auto',
              },
              dark: {
                overlay: 'fixed inset-0 bg-black/70 backdrop-blur-sm',
                dialog:
                  'fixed inset-4 max-w-4xl mx-auto my-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700',
                header:
                  'px-6 py-4 border-b border-gray-700 bg-gray-900 rounded-t-xl',
                title: 'text-xl font-semibold text-gray-100',
                content: 'p-6 max-h-[70vh] overflow-y-auto',
              },
              sacred: {
                overlay: 'fixed inset-0 bg-black/80 backdrop-blur-sm',
                dialog:
                  'fixed inset-4 max-w-4xl mx-auto my-8 bg-black/95 rounded-xl shadow-2xl border-2 border-yellow-400/30',
                header:
                  'px-6 py-4 border-b border-yellow-400/30 bg-black/80 rounded-t-xl',
                title: 'text-xl font-semibold text-yellow-400 font-serif',
                content: 'p-6 max-h-[70vh] overflow-y-auto',
              },
            }[theme]
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
              'div',
              {
                className: styles.overlay,
                onClick: onClose,
                children: (0,
                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                  className: styles.dialog,
                  onClick: e => e.stopPropagation(),
                  children: [
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      'div',
                      {
                        className: styles.header,
                        children: (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                          'div',
                          {
                            className: 'flex items-center justify-between',
                            children: [
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                'h2',
                                { className: styles.title, children: title }
                              ),
                              (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                'button',
                                {
                                  onClick: onClose,
                                  className:
                                    'p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors',
                                  children: '×',
                                }
                              ),
                            ],
                          }
                        ),
                      }
                    ),
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      'div',
                      { className: styles.content, children }
                    ),
                  ],
                }),
              }
            )
          },
          FormField = ({ label, children, theme = 'light' }) =>
            (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
              className: 'mb-4',
              children: [
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  'label',
                  {
                    className: {
                      light: 'block text-sm font-medium text-gray-700 mb-2',
                      dark: 'block text-sm font-medium text-gray-300 mb-2',
                      sacred:
                        'block text-sm font-medium text-yellow-400 mb-2 font-serif',
                    }[theme],
                    children: label,
                  }
                ),
                children,
              ],
            }),
          Input = ({ placeholder, type = 'text', theme = 'light' }) =>
            (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('input', {
              type,
              placeholder,
              className: {
                light:
                  'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                dark: 'w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                sacred:
                  'w-full px-3 py-2 border border-yellow-400/30 bg-black/50 text-yellow-100 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent',
              }[theme],
            }),
          Button = ({
            children,
            variant = 'primary',
            theme = 'light',
            onClick,
            disabled,
          }) =>
            (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('button', {
              className: `px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${{ light: { primary: 'bg-blue-600 text-white hover:bg-blue-700', secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300' }, dark: { primary: 'bg-blue-600 text-white hover:bg-blue-700', secondary: 'bg-gray-600 text-gray-100 hover:bg-gray-500' }, sacred: { primary: 'bg-yellow-600 text-black hover:bg-yellow-500', secondary: 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30 border border-yellow-400/30' } }[theme][variant]}`,
              onClick,
              disabled,
              children,
            }),
          __WEBPACK_DEFAULT_EXPORT__ = {
            title: 'Components/Stepper',
            component: _index__WEBPACK_IMPORTED_MODULE_2__.A,
            parameters: {
              layout: 'fullscreen',
              docs: {
                description: {
                  component:
                    'Interactive stepper component for multi-step processes, wizards, and workflows.',
                },
              },
            },
          },
          AccountSetupWizard = {
            name: '🧙‍♂️ Account Setup Wizard',
            render: () => {
              const Component = () => {
                const [isOpen, setIsOpen] = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useState)(!0)
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                  'div',
                  {
                    className: 'min-h-screen bg-gray-100 p-8',
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        Button,
                        {
                          onClick: () => setIsOpen(!0),
                          children: 'Open Account Setup Wizard',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        Dialog,
                        {
                          isOpen,
                          onClose: () => setIsOpen(!1),
                          title: 'Create Your Account',
                          theme: 'light',
                          children: (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                            'div',
                            {
                              className: 'space-y-8',
                              children: [
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                  _index__WEBPACK_IMPORTED_MODULE_2__.A,
                                  {
                                    steps: [
                                      {
                                        stepNumber: 1,
                                        label: 'Personal Info',
                                        stepLink: '#personal',
                                        status: 'completed',
                                        description:
                                          'Basic personal information and contact details',
                                      },
                                      {
                                        stepNumber: 2,
                                        label: 'Account Details',
                                        stepLink: '#account',
                                        status: 'active',
                                        description:
                                          'Username, password, and security preferences',
                                      },
                                      {
                                        stepNumber: 3,
                                        label: 'Preferences',
                                        stepLink: '#preferences',
                                        status: 'inactive',
                                        description:
                                          'Customize your experience and notification settings',
                                      },
                                      {
                                        stepNumber: 4,
                                        label: 'Verification',
                                        stepLink: '#verify',
                                        status: 'inactive',
                                        description:
                                          'Verify your email address and complete setup',
                                      },
                                    ],
                                    styles: {
                                      theme: 'light',
                                      orientation: 'horizontal',
                                    },
                                  }
                                ),
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                  'div',
                                  {
                                    className: 'bg-gray-50 rounded-lg p-6',
                                    children: [
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                        'h3',
                                        {
                                          className:
                                            'text-lg font-semibold mb-4',
                                          children: 'Step 2: Account Details',
                                        }
                                      ),
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                        'div',
                                        {
                                          className:
                                            'grid grid-cols-1 md:grid-cols-2 gap-4',
                                          children: [
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              FormField,
                                              {
                                                label: 'Username',
                                                children: (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                  Input,
                                                  {
                                                    placeholder:
                                                      'Enter username',
                                                  }
                                                ),
                                              }
                                            ),
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              FormField,
                                              {
                                                label: 'Email',
                                                children: (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                  Input,
                                                  {
                                                    type: 'email',
                                                    placeholder:
                                                      'your@email.com',
                                                  }
                                                ),
                                              }
                                            ),
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              FormField,
                                              {
                                                label: 'Password',
                                                children: (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                  Input,
                                                  {
                                                    type: 'password',
                                                    placeholder:
                                                      'Enter password',
                                                  }
                                                ),
                                              }
                                            ),
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              FormField,
                                              {
                                                label: 'Confirm Password',
                                                children: (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                  Input,
                                                  {
                                                    type: 'password',
                                                    placeholder:
                                                      'Confirm password',
                                                  }
                                                ),
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
                                    className: 'flex justify-between',
                                    children: [
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                        Button,
                                        {
                                          variant: 'secondary',
                                          children: '← Previous',
                                        }
                                      ),
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                        Button,
                                        { children: 'Continue →' }
                                      ),
                                    ],
                                  }
                                ),
                              ],
                            }
                          ),
                        }
                      ),
                    ],
                  }
                )
              }
              return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                Component,
                {}
              )
            },
          },
          CheckoutProcess = {
            name: '🛒 E-commerce Checkout',
            render: () => {
              const Component = () => {
                const [isOpen, setIsOpen] = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useState)(!0)
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                  'div',
                  {
                    className: 'min-h-screen bg-gray-900 p-8',
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        Button,
                        {
                          onClick: () => setIsOpen(!0),
                          theme: 'dark',
                          children: 'Open Checkout',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        Dialog,
                        {
                          isOpen,
                          onClose: () => setIsOpen(!1),
                          title: 'Complete Your Purchase',
                          theme: 'dark',
                          children: (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                            'div',
                            {
                              className: 'space-y-8',
                              children: [
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                  _index__WEBPACK_IMPORTED_MODULE_2__.A,
                                  {
                                    steps: [
                                      {
                                        stepNumber: 1,
                                        label: 'Cart Review',
                                        stepLink: '#cart',
                                        status: 'completed',
                                      },
                                      {
                                        stepNumber: 2,
                                        label: 'Shipping',
                                        stepLink: '#shipping',
                                        status: 'completed',
                                      },
                                      {
                                        stepNumber: 3,
                                        label: 'Payment',
                                        stepLink: '#payment',
                                        status: 'error',
                                        description:
                                          'Payment method declined. Please try a different card or payment method.',
                                      },
                                      {
                                        stepNumber: 4,
                                        label: 'Confirmation',
                                        stepLink: '#confirm',
                                        status: 'inactive',
                                      },
                                    ],
                                    styles: {
                                      theme: 'dark',
                                      orientation: 'horizontal',
                                    },
                                  }
                                ),
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                  'div',
                                  {
                                    className:
                                      'bg-red-900/20 border border-red-500/30 rounded-lg p-6',
                                    children: [
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                        'h3',
                                        {
                                          className:
                                            'text-lg font-semibold mb-4 text-red-400',
                                          children: 'Payment Error',
                                        }
                                      ),
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                        'p',
                                        {
                                          className: 'text-gray-300 mb-4',
                                          children:
                                            'Your payment could not be processed. Please check your payment information and try again.',
                                        }
                                      ),
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                        'div',
                                        {
                                          className:
                                            'grid grid-cols-1 md:grid-cols-2 gap-4',
                                          children: [
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              FormField,
                                              {
                                                label: 'Card Number',
                                                theme: 'dark',
                                                children: (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                  Input,
                                                  {
                                                    placeholder:
                                                      '1234 5678 9012 3456',
                                                    theme: 'dark',
                                                  }
                                                ),
                                              }
                                            ),
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              FormField,
                                              {
                                                label: 'Expiry Date',
                                                theme: 'dark',
                                                children: (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                  Input,
                                                  {
                                                    placeholder: 'MM/YY',
                                                    theme: 'dark',
                                                  }
                                                ),
                                              }
                                            ),
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              FormField,
                                              {
                                                label: 'CVV',
                                                theme: 'dark',
                                                children: (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                  Input,
                                                  {
                                                    placeholder: '123',
                                                    theme: 'dark',
                                                  }
                                                ),
                                              }
                                            ),
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              FormField,
                                              {
                                                label: 'Cardholder Name',
                                                theme: 'dark',
                                                children: (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                  Input,
                                                  {
                                                    placeholder: 'John Doe',
                                                    theme: 'dark',
                                                  }
                                                ),
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
                                    className: 'flex justify-between',
                                    children: [
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                        Button,
                                        {
                                          variant: 'secondary',
                                          theme: 'dark',
                                          children: '← Back to Shipping',
                                        }
                                      ),
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                        Button,
                                        {
                                          theme: 'dark',
                                          children: 'Retry Payment',
                                        }
                                      ),
                                    ],
                                  }
                                ),
                              ],
                            }
                          ),
                        }
                      ),
                    ],
                  }
                )
              }
              return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                Component,
                {}
              )
            },
          },
          SacredRitualSetup = {
            name: '🔮 Sacred Ritual Configuration',
            render: () => {
              const Component = () => {
                const [isOpen, setIsOpen] = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useState)(!0)
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                  'div',
                  {
                    className: 'min-h-screen bg-black p-8',
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        Button,
                        {
                          onClick: () => setIsOpen(!0),
                          theme: 'sacred',
                          children: 'Begin Sacred Ritual',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        Dialog,
                        {
                          isOpen,
                          onClose: () => setIsOpen(!1),
                          title: '⚡ Arcane Configuration Ritual ⚡',
                          theme: 'sacred',
                          children: (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                            'div',
                            {
                              className: 'space-y-8',
                              children: [
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                  _index__WEBPACK_IMPORTED_MODULE_2__.A,
                                  {
                                    steps: [
                                      {
                                        stepNumber: 1,
                                        label: 'Preparation',
                                        stepLink: '#prepare',
                                        status: 'completed',
                                        description:
                                          'Gather the required mystical components and cleanse the sacred space',
                                      },
                                      {
                                        stepNumber: 2,
                                        label: 'Invocation',
                                        stepLink: '#invoke',
                                        status: 'completed',
                                        description:
                                          'Call upon the ancient powers and establish the magical circle',
                                      },
                                      {
                                        stepNumber: 3,
                                        label: 'Channeling',
                                        stepLink: '#channel',
                                        status: 'error',
                                        description:
                                          'The mystical energies are unstable. Realign the ethereal conduits to proceed.',
                                      },
                                      {
                                        stepNumber: 4,
                                        label: 'Manifestation',
                                        stepLink: '#manifest',
                                        status: 'inactive',
                                        description:
                                          'Focus your will to manifest the desired outcome in the physical realm',
                                      },
                                      {
                                        stepNumber: 5,
                                        label: 'Sealing',
                                        stepLink: '#seal',
                                        status: 'inactive',
                                        description:
                                          'Bind the ritual energies and close the sacred circle safely',
                                      },
                                    ],
                                    styles: {
                                      theme: 'sacred',
                                      orientation: 'horizontal',
                                    },
                                  }
                                ),
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                  'div',
                                  {
                                    className:
                                      'bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-6',
                                    children: [
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                        'h3',
                                        {
                                          className:
                                            'text-lg font-semibold mb-4 text-yellow-400 font-serif',
                                          children:
                                            '🔮 Ethereal Realignment Required',
                                        }
                                      ),
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                        'p',
                                        {
                                          className:
                                            'text-yellow-100 mb-6 font-serif',
                                          children:
                                            'The cosmic energies are in discord. Adjust the mystical parameters to stabilize the channeling process.',
                                        }
                                      ),
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                        'div',
                                        {
                                          className:
                                            'grid grid-cols-1 md:grid-cols-2 gap-6',
                                          children: [
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              FormField,
                                              {
                                                label: 'Lunar Phase Alignment',
                                                theme: 'sacred',
                                                children: (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                                  'select',
                                                  {
                                                    className:
                                                      'w-full px-3 py-2 border border-yellow-400/30 bg-black/50 text-yellow-100 rounded-lg focus:ring-2 focus:ring-yellow-500',
                                                    children: [
                                                      (0,
                                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                        'option',
                                                        { children: 'New Moon' }
                                                      ),
                                                      (0,
                                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                        'option',
                                                        {
                                                          children:
                                                            'Waxing Crescent',
                                                        }
                                                      ),
                                                      (0,
                                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                        'option',
                                                        {
                                                          children: 'Full Moon',
                                                        }
                                                      ),
                                                      (0,
                                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                        'option',
                                                        {
                                                          children:
                                                            'Waning Gibbous',
                                                        }
                                                      ),
                                                    ],
                                                  }
                                                ),
                                              }
                                            ),
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              FormField,
                                              {
                                                label: 'Elemental Focus',
                                                theme: 'sacred',
                                                children: (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                                  'select',
                                                  {
                                                    className:
                                                      'w-full px-3 py-2 border border-yellow-400/30 bg-black/50 text-yellow-100 rounded-lg focus:ring-2 focus:ring-yellow-500',
                                                    children: [
                                                      (0,
                                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                        'option',
                                                        { children: 'Fire' }
                                                      ),
                                                      (0,
                                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                        'option',
                                                        { children: 'Water' }
                                                      ),
                                                      (0,
                                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                        'option',
                                                        { children: 'Earth' }
                                                      ),
                                                      (0,
                                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                        'option',
                                                        { children: 'Air' }
                                                      ),
                                                      (0,
                                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                        'option',
                                                        { children: 'Void' }
                                                      ),
                                                    ],
                                                  }
                                                ),
                                              }
                                            ),
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              FormField,
                                              {
                                                label: 'Arcane Frequency (Hz)',
                                                theme: 'sacred',
                                                children: (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                  Input,
                                                  {
                                                    placeholder: '432.0',
                                                    theme: 'sacred',
                                                  }
                                                ),
                                              }
                                            ),
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              FormField,
                                              {
                                                label: 'Crystal Resonance',
                                                theme: 'sacred',
                                                children: (0,
                                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                  Input,
                                                  {
                                                    placeholder:
                                                      'Amethyst Matrix',
                                                    theme: 'sacred',
                                                  }
                                                ),
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
                                    className: 'flex justify-between',
                                    children: [
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                        Button,
                                        {
                                          variant: 'secondary',
                                          theme: 'sacred',
                                          children: '← Return to Invocation',
                                        }
                                      ),
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                        Button,
                                        {
                                          theme: 'sacred',
                                          children: 'Realign Energies ⚡',
                                        }
                                      ),
                                    ],
                                  }
                                ),
                              ],
                            }
                          ),
                        }
                      ),
                    ],
                  }
                )
              }
              return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                Component,
                {}
              )
            },
          },
          ProjectSetupFlow = {
            name: '⚙️ Project Setup (Vertical)',
            render: () => {
              const Component = () => {
                const [isOpen, setIsOpen] = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useState)(!0)
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                  'div',
                  {
                    className: 'min-h-screen bg-gray-100 p-8',
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        Button,
                        {
                          onClick: () => setIsOpen(!0),
                          children: 'Open Project Setup',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        Dialog,
                        {
                          isOpen,
                          onClose: () => setIsOpen(!1),
                          title: '🚀 New Project Setup',
                          theme: 'light',
                          children: (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                            'div',
                            {
                              className:
                                'grid grid-cols-1 lg:grid-cols-3 gap-8',
                              children: [
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                  'div',
                                  {
                                    className: 'lg:col-span-1',
                                    children: (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      _index__WEBPACK_IMPORTED_MODULE_2__.A,
                                      {
                                        steps: [
                                          {
                                            stepNumber: 1,
                                            label: 'Project Initialization',
                                            stepLink: '#init',
                                            status: 'completed',
                                            description:
                                              'Create project structure and initialize version control',
                                          },
                                          {
                                            stepNumber: 2,
                                            label: 'Dependencies',
                                            stepLink: '#deps',
                                            status: 'completed',
                                            description:
                                              'Install required packages and configure build tools',
                                          },
                                          {
                                            stepNumber: 3,
                                            label: 'Configuration',
                                            stepLink: '#config',
                                            status: 'active',
                                            description:
                                              'Set up environment variables and application settings',
                                          },
                                          {
                                            stepNumber: 4,
                                            label: 'Database Setup',
                                            stepLink: '#database',
                                            status: 'inactive',
                                            description:
                                              'Initialize database schema and seed data',
                                          },
                                          {
                                            stepNumber: 5,
                                            label: 'Testing',
                                            stepLink: '#testing',
                                            status: 'inactive',
                                            description:
                                              'Configure test suites and run initial tests',
                                          },
                                          {
                                            stepNumber: 6,
                                            label: 'Deployment',
                                            stepLink: '#deploy',
                                            status: 'inactive',
                                            description:
                                              'Set up CI/CD pipeline and deploy to staging',
                                          },
                                        ],
                                        styles: {
                                          theme: 'light',
                                          orientation: 'vertical',
                                        },
                                      }
                                    ),
                                  }
                                ),
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                  'div',
                                  {
                                    className: 'lg:col-span-2',
                                    children: [
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                        'div',
                                        {
                                          className:
                                            'bg-blue-50 border border-blue-200 rounded-lg p-6',
                                          children: [
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              'h3',
                                              {
                                                className:
                                                  'text-lg font-semibold mb-4 text-blue-900',
                                                children:
                                                  'Step 3: Project Configuration',
                                              }
                                            ),
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              'p',
                                              {
                                                className: 'text-blue-700 mb-6',
                                                children:
                                                  'Configure your project settings and environment variables for development and production.',
                                              }
                                            ),
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                              'div',
                                              {
                                                className: 'space-y-4',
                                                children: [
                                                  (0,
                                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                    FormField,
                                                    {
                                                      label: 'Project Name',
                                                      children: (0,
                                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                        Input,
                                                        {
                                                          placeholder:
                                                            'my-awesome-project',
                                                        }
                                                      ),
                                                    }
                                                  ),
                                                  (0,
                                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                    FormField,
                                                    {
                                                      label: 'Environment',
                                                      children: (0,
                                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                                        'select',
                                                        {
                                                          className:
                                                            'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500',
                                                          children: [
                                                            (0,
                                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                              'option',
                                                              {
                                                                children:
                                                                  'Development',
                                                              }
                                                            ),
                                                            (0,
                                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                              'option',
                                                              {
                                                                children:
                                                                  'Staging',
                                                              }
                                                            ),
                                                            (0,
                                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                              'option',
                                                              {
                                                                children:
                                                                  'Production',
                                                              }
                                                            ),
                                                          ],
                                                        }
                                                      ),
                                                    }
                                                  ),
                                                  (0,
                                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                    FormField,
                                                    {
                                                      label: 'API Base URL',
                                                      children: (0,
                                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                        Input,
                                                        {
                                                          placeholder:
                                                            'https://api.example.com',
                                                        }
                                                      ),
                                                    }
                                                  ),
                                                  (0,
                                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                    FormField,
                                                    {
                                                      label: 'Database URL',
                                                      children: (0,
                                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                        Input,
                                                        {
                                                          placeholder:
                                                            'postgresql://localhost:5432/mydb',
                                                        }
                                                      ),
                                                    }
                                                  ),
                                                ],
                                              }
                                            ),
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                              'div',
                                              {
                                                className:
                                                  'mt-6 p-4 bg-green-50 border border-green-200 rounded-lg',
                                                children: [
                                                  (0,
                                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                    'h4',
                                                    {
                                                      className:
                                                        'font-medium text-green-900 mb-2',
                                                      children:
                                                        '✅ Configuration Tips:',
                                                    }
                                                  ),
                                                  (0,
                                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                                    'ul',
                                                    {
                                                      className:
                                                        'text-sm text-green-700 space-y-1',
                                                      children: [
                                                        (0,
                                                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                          'li',
                                                          {
                                                            children:
                                                              '• Use environment variables for sensitive data',
                                                          }
                                                        ),
                                                        (0,
                                                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                          'li',
                                                          {
                                                            children:
                                                              '• Keep development and production configs separate',
                                                          }
                                                        ),
                                                        (0,
                                                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                          'li',
                                                          {
                                                            children:
                                                              '• Validate all required settings before proceeding',
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
                                          className:
                                            'flex justify-between mt-6',
                                          children: [
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              Button,
                                              {
                                                variant: 'secondary',
                                                children:
                                                  '← Back to Dependencies',
                                              }
                                            ),
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              Button,
                                              {
                                                children:
                                                  'Continue to Database →',
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
                        }
                      ),
                    ],
                  }
                )
              }
              return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                Component,
                {}
              )
            },
          },
          InteractiveDemo = {
            name: '🎮 Interactive Demo',
            render: () => {
              const Component = () => {
                const [theme, setTheme] = (0,
                  react__WEBPACK_IMPORTED_MODULE_1__.useState)('light'),
                  [orientation, setOrientation] = (0,
                  react__WEBPACK_IMPORTED_MODULE_1__.useState)('horizontal'),
                  [currentStep, setCurrentStep] = (0,
                  react__WEBPACK_IMPORTED_MODULE_1__.useState)(2),
                  demoSteps = [
                    {
                      stepNumber: 1,
                      label: 'Getting Started',
                      stepLink: '#start',
                      status: currentStep > 1 ? 'completed' : 'active',
                      description: 'Learn the basics and set up your workspace',
                    },
                    {
                      stepNumber: 2,
                      label: 'Configuration',
                      stepLink: '#config',
                      status:
                        2 === currentStep
                          ? 'active'
                          : currentStep > 2
                            ? 'completed'
                            : 'inactive',
                      description: 'Customize settings and preferences',
                    },
                    {
                      stepNumber: 3,
                      label: 'Integration',
                      stepLink: '#integration',
                      status:
                        3 === currentStep
                          ? Math.random() > 0.5
                            ? 'error'
                            : 'active'
                          : currentStep > 3
                            ? 'completed'
                            : 'inactive',
                      description:
                        3 === currentStep && Math.random() > 0.5
                          ? 'Connection failed. Check your API credentials and network settings.'
                          : 'Connect with external services and APIs',
                    },
                    {
                      stepNumber: 4,
                      label: 'Finalization',
                      stepLink: '#final',
                      status:
                        4 === currentStep
                          ? 'active'
                          : currentStep > 4
                            ? 'completed'
                            : 'inactive',
                      description: 'Review and complete the setup process',
                    },
                  ]
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  'div',
                  {
                    className: {
                      light: 'min-h-screen bg-gray-100 p-8',
                      dark: 'min-h-screen bg-gray-900 p-8',
                      sacred: 'min-h-screen bg-black p-8',
                    }[theme],
                    children: (0,
                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                      'div',
                      {
                        className: 'max-w-6xl mx-auto space-y-8',
                        children: [
                          (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                            'div',
                            {
                              className:
                                'bg-white dark:bg-gray-800 sacred:bg-black/50 rounded-lg p-6 border sacred:border-yellow-400/30',
                              children: [
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                  'h2',
                                  {
                                    className:
                                      'text-2xl font-bold mb-6 dark:text-white sacred:text-yellow-400',
                                    children: 'Interactive Stepper Demo',
                                  }
                                ),
                                (0,
                                react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                  'div',
                                  {
                                    className:
                                      'grid grid-cols-1 md:grid-cols-4 gap-4 mb-6',
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
                                                  'block text-sm font-medium mb-2 dark:text-gray-300 sacred:text-yellow-400',
                                                children: 'Theme',
                                              }
                                            ),
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                              'select',
                                              {
                                                value: theme,
                                                onChange: e =>
                                                  setTheme(e.target.value),
                                                className:
                                                  'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white sacred:border-yellow-400/30 sacred:bg-black/50 sacred:text-yellow-100 rounded-lg',
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
                                                    {
                                                      value: 'dark',
                                                      children: 'Dark',
                                                    }
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
                                        'div',
                                        {
                                          children: [
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              'label',
                                              {
                                                className:
                                                  'block text-sm font-medium mb-2 dark:text-gray-300 sacred:text-yellow-400',
                                                children: 'Orientation',
                                              }
                                            ),
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                              'select',
                                              {
                                                value: orientation,
                                                onChange: e =>
                                                  setOrientation(
                                                    e.target.value
                                                  ),
                                                className:
                                                  'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white sacred:border-yellow-400/30 sacred:bg-black/50 sacred:text-yellow-100 rounded-lg',
                                                children: [
                                                  (0,
                                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                    'option',
                                                    {
                                                      value: 'horizontal',
                                                      children: 'Horizontal',
                                                    }
                                                  ),
                                                  (0,
                                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                    'option',
                                                    {
                                                      value: 'vertical',
                                                      children: 'Vertical',
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
                                          children: [
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                              'label',
                                              {
                                                className:
                                                  'block text-sm font-medium mb-2 dark:text-gray-300 sacred:text-yellow-400',
                                                children: 'Current Step',
                                              }
                                            ),
                                            (0,
                                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                                              'select',
                                              {
                                                value: currentStep,
                                                onChange: e =>
                                                  setCurrentStep(
                                                    Number(e.target.value)
                                                  ),
                                                className:
                                                  'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white sacred:border-yellow-400/30 sacred:bg-black/50 sacred:text-yellow-100 rounded-lg',
                                                children: [
                                                  (0,
                                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                    'option',
                                                    {
                                                      value: 1,
                                                      children: 'Step 1',
                                                    }
                                                  ),
                                                  (0,
                                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                    'option',
                                                    {
                                                      value: 2,
                                                      children: 'Step 2',
                                                    }
                                                  ),
                                                  (0,
                                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                    'option',
                                                    {
                                                      value: 3,
                                                      children:
                                                        'Step 3 (Random Error)',
                                                    }
                                                  ),
                                                  (0,
                                                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                                    'option',
                                                    {
                                                      value: 4,
                                                      children: 'Step 4',
                                                    }
                                                  ),
                                                ],
                                              }
                                            ),
                                          ],
                                        }
                                      ),
                                      (0,
                                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                        'div',
                                        {
                                          className: 'flex items-end',
                                          children: (0,
                                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                            Button,
                                            {
                                              onClick: () =>
                                                setCurrentStep(
                                                  Math.floor(
                                                    4 * Math.random()
                                                  ) + 1
                                                ),
                                              theme,
                                              children: 'Randomize',
                                            }
                                          ),
                                        }
                                      ),
                                    ],
                                  }
                                ),
                              ],
                            }
                          ),
                          (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            'div',
                            {
                              className:
                                'bg-white dark:bg-gray-800 sacred:bg-black/50 rounded-lg p-8 border sacred:border-yellow-400/30',
                              children: (0,
                              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                _index__WEBPACK_IMPORTED_MODULE_2__.A,
                                {
                                  steps: demoSteps,
                                  styles: { theme, orientation },
                                }
                              ),
                            }
                          ),
                        ],
                      }
                    ),
                  }
                )
              }
              return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                Component,
                {}
              )
            },
          },
          ThemeShowcase = {
            name: '🎨 Theme Showcase',
            render: () => {
              const basicSteps = [
                {
                  stepNumber: 1,
                  label: 'Start',
                  stepLink: '#1',
                  status: 'completed',
                },
                {
                  stepNumber: 2,
                  label: 'Progress',
                  stepLink: '#2',
                  status: 'active',
                },
                {
                  stepNumber: 3,
                  label: 'Error',
                  stepLink: '#3',
                  status: 'error',
                  description: 'Something went wrong!',
                },
                {
                  stepNumber: 4,
                  label: 'Finish',
                  stepLink: '#4',
                  status: 'inactive',
                },
              ]
              return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                'div',
                {
                  className:
                    'min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8',
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                    className: 'max-w-6xl mx-auto space-y-12',
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'h1',
                        {
                          className:
                            'text-3xl font-bold text-center text-gray-900 mb-12',
                          children: 'Stepper Theme Showcase',
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                        'div',
                        {
                          className: 'bg-white rounded-xl p-8 shadow-lg',
                          children: [
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'h2',
                              {
                                className:
                                  'text-xl font-semibold mb-6 text-gray-900',
                                children: '☀️ Light Theme',
                              }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _index__WEBPACK_IMPORTED_MODULE_2__.A,
                              { steps: basicSteps, styles: { theme: 'light' } }
                            ),
                          ],
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                        'div',
                        {
                          className: 'bg-gray-900 rounded-xl p-8 shadow-lg',
                          children: [
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'h2',
                              {
                                className:
                                  'text-xl font-semibold mb-6 text-gray-100',
                                children: '🌙 Dark Theme',
                              }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _index__WEBPACK_IMPORTED_MODULE_2__.A,
                              { steps: basicSteps, styles: { theme: 'dark' } }
                            ),
                          ],
                        }
                      ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                        'div',
                        {
                          className:
                            'bg-black rounded-xl p-8 shadow-lg border-2 border-yellow-400/30',
                          children: [
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'h2',
                              {
                                className:
                                  'text-xl font-semibold mb-6 text-yellow-400 font-serif',
                                children: '🔮 Sacred Theme',
                              }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              _index__WEBPACK_IMPORTED_MODULE_2__.A,
                              { steps: basicSteps, styles: { theme: 'sacred' } }
                            ),
                          ],
                        }
                      ),
                    ],
                  }),
                }
              )
            },
          },
          __namedExportsOrder = [
            'AccountSetupWizard',
            'CheckoutProcess',
            'SacredRitualSetup',
            'ProjectSetupFlow',
            'InteractiveDemo',
            'ThemeShowcase',
          ]
      },
    },
  ]
)
