'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [8915],
    {
      './src/components/ProgressBar/progressbar.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            CustomLabel: () => CustomLabel,
            CustomSize: () => CustomSize,
            DarkTheme: () => DarkTheme,
            Determinate: () => Determinate,
            Disabled: () => Disabled,
            Indeterminate: () => Indeterminate,
            LightTheme: () => LightTheme,
            NoLabel: () => NoLabel,
            ProgressStates: () => ProgressStates,
            SacredIndeterminate: () => SacredIndeterminate,
            SacredTheme: () => SacredTheme,
            ThemeComparison: () => ThemeComparison,
            __namedExportsOrder: () => __namedExportsOrder,
            default: () => progressbar_stories,
          }))
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          theme = __webpack_require__('./src/theme/index.ts')
        const ProgressBar = ({
          value = 0,
          variant = 'determinate',
          showLabel = !1,
          label,
          'aria-label': ariaLabel,
          'aria-required': ariaRequired,
          styles,
        }) => {
          const isIndeterminate = 'indeterminate' === variant,
            progressValue = Math.min(Math.max(value, 0), 100),
            computedStyles = (0, react.useMemo)(
              () => (0, theme.tZ)(styles, progressValue, variant),
              [styles, progressValue, variant]
            ),
            getLabel = (0, react.useCallback)(
              () =>
                label ||
                (isIndeterminate
                  ? 'Loading...'
                  : `${Math.round(progressValue)}%`),
              [label, isIndeterminate, progressValue]
            ),
            getAriaValueNow = (0, react.useCallback)(
              () => (isIndeterminate ? void 0 : progressValue),
              [isIndeterminate, progressValue]
            ),
            getAriaValueText = (0, react.useCallback)(
              () =>
                label ||
                (isIndeterminate
                  ? 'Loading'
                  : `${Math.round(progressValue)} percent`),
              [label, isIndeterminate, progressValue]
            )
          return (0, jsx_runtime.jsxs)('div', {
            children: [
              (0, jsx_runtime.jsx)('div', {
                style: computedStyles.container,
                role: 'progressbar',
                'aria-label': ariaLabel || 'Progress',
                'aria-required': ariaRequired,
                'aria-valuemin': isIndeterminate ? void 0 : 0,
                'aria-valuemax': isIndeterminate ? void 0 : 100,
                'aria-valuenow': getAriaValueNow(),
                'aria-valuetext': getAriaValueText(),
                'data-testid': 'progress-bar',
                children: (0, jsx_runtime.jsx)('div', {
                  style: computedStyles.bar,
                  'data-testid': 'progress-bar-fill',
                }),
              }),
              showLabel &&
                (0, jsx_runtime.jsx)('div', {
                  style: computedStyles.label,
                  'data-testid': 'progress-bar-label',
                  children: getLabel(),
                }),
            ],
          })
        }
        ProgressBar.displayName = 'ProgressBar'
        const components_ProgressBar = ProgressBar
        ProgressBar.__docgenInfo = {
          description:
            'A versatile progress bar component that supports both determinate and indeterminate modes.',
          methods: [],
          displayName: 'ProgressBar',
          props: {
            value: {
              required: !1,
              tsType: { name: 'number' },
              description: 'Progress value from 0-100 for determinate mode',
              defaultValue: { value: '0', computed: !1 },
            },
            variant: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "'determinate' | 'indeterminate'",
                elements: [
                  { name: 'literal', value: "'determinate'" },
                  { name: 'literal', value: "'indeterminate'" },
                ],
              },
              description: 'Variant of the progress bar',
              defaultValue: { value: "'determinate'", computed: !1 },
            },
            showLabel: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'Show progress label/percentage',
              defaultValue: { value: 'false', computed: !1 },
            },
            label: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Custom label text (overrides default percentage)',
            },
            'aria-label': {
              required: !1,
              tsType: { name: 'string' },
              description: 'ARIA label for accessibility',
            },
            'aria-required': {
              required: !1,
              tsType: { name: 'boolean' },
              description:
                'Whether the progress bar represents a required process',
            },
            styles: {
              required: !1,
              tsType: { name: 'ProgressBarStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
          },
        }
        const progressbar_stories = {
            title: 'Components/ProgressBar',
            component: components_ProgressBar,
            parameters: {
              layout: 'centered',
              docs: {
                description: {
                  component:
                    'A versatile progress bar component that supports both determinate (with specific progress value) and indeterminate (loading) modes across light, dark, and sacred themes.',
                },
              },
            },
            tags: ['autodocs'],
            argTypes: {
              value: {
                control: { type: 'range', min: 0, max: 100, step: 1 },
                description: 'Progress value from 0-100 for determinate mode',
              },
              variant: {
                control: { type: 'select' },
                options: ['determinate', 'indeterminate'],
                description: 'Variant of the progress bar',
              },
              showLabel: {
                control: { type: 'boolean' },
                description: 'Show progress label/percentage',
              },
              label: {
                control: { type: 'text' },
                description: 'Custom label text (overrides default percentage)',
              },
              'aria-label': {
                control: { type: 'text' },
                description: 'ARIA label for accessibility',
              },
              'aria-required': {
                control: { type: 'boolean' },
                description:
                  'Whether the progress bar represents a required process',
              },
              styles: {
                control: { type: 'object' },
                description: 'Comprehensive styling options',
              },
            },
          },
          Determinate = {
            args: {
              value: 65,
              variant: 'determinate',
              showLabel: !0,
              styles: { theme: 'light' },
            },
          },
          Indeterminate = {
            args: {
              variant: 'indeterminate',
              showLabel: !0,
              styles: { theme: 'light' },
            },
          },
          LightTheme = {
            args: {
              value: 45,
              variant: 'determinate',
              showLabel: !0,
              styles: { theme: 'light' },
            },
          },
          DarkTheme = {
            args: {
              value: 45,
              variant: 'determinate',
              showLabel: !0,
              styles: { theme: 'dark' },
            },
            parameters: { backgrounds: { default: 'dark' } },
          },
          SacredTheme = {
            args: {
              value: 45,
              variant: 'determinate',
              showLabel: !0,
              styles: { theme: 'sacred' },
            },
            parameters: { backgrounds: { default: 'dark' } },
          },
          SacredIndeterminate = {
            args: {
              variant: 'indeterminate',
              showLabel: !0,
              styles: { theme: 'sacred' },
            },
            parameters: { backgrounds: { default: 'dark' } },
          },
          CustomLabel = {
            args: {
              value: 80,
              variant: 'determinate',
              showLabel: !0,
              label: 'Processing files...',
              styles: { theme: 'light' },
            },
          },
          NoLabel = {
            args: {
              value: 30,
              variant: 'determinate',
              showLabel: !1,
              styles: { theme: 'light' },
            },
          },
          CustomSize = {
            args: {
              value: 70,
              variant: 'determinate',
              showLabel: !0,
              styles: { theme: 'light', width: '400px', height: '8px' },
            },
          },
          Disabled = {
            args: {
              value: 50,
              variant: 'determinate',
              showLabel: !0,
              styles: { theme: 'light', disabled: !0 },
            },
          },
          ProgressStates = {
            render: () =>
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  width: '300px',
                },
                children: [
                  (0, jsx_runtime.jsxs)('div', {
                    children: [
                      (0, jsx_runtime.jsx)('h4', { children: 'Starting (0%)' }),
                      (0, jsx_runtime.jsx)(components_ProgressBar, {
                        value: 0,
                        showLabel: !0,
                        styles: { theme: 'light' },
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    children: [
                      (0, jsx_runtime.jsx)('h4', {
                        children: 'In Progress (35%)',
                      }),
                      (0, jsx_runtime.jsx)(components_ProgressBar, {
                        value: 35,
                        showLabel: !0,
                        styles: { theme: 'light' },
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    children: [
                      (0, jsx_runtime.jsx)('h4', {
                        children: 'Nearly Complete (85%)',
                      }),
                      (0, jsx_runtime.jsx)(components_ProgressBar, {
                        value: 85,
                        showLabel: !0,
                        styles: { theme: 'light' },
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    children: [
                      (0, jsx_runtime.jsx)('h4', {
                        children: 'Complete (100%)',
                      }),
                      (0, jsx_runtime.jsx)(components_ProgressBar, {
                        value: 100,
                        showLabel: !0,
                        styles: { theme: 'light' },
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    children: [
                      (0, jsx_runtime.jsx)('h4', {
                        children: 'Loading (Indeterminate)',
                      }),
                      (0, jsx_runtime.jsx)(components_ProgressBar, {
                        variant: 'indeterminate',
                        showLabel: !0,
                        styles: { theme: 'light' },
                      }),
                    ],
                  }),
                ],
              }),
            parameters: {
              docs: {
                description: {
                  story:
                    'Different progress states from start to completion, including indeterminate loading.',
                },
              },
            },
          },
          ThemeComparison = {
            render: () =>
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '30px',
                  width: '300px',
                },
                children: [
                  (0, jsx_runtime.jsxs)('div', {
                    children: [
                      (0, jsx_runtime.jsx)('h4', { children: 'Light Theme' }),
                      (0, jsx_runtime.jsx)(components_ProgressBar, {
                        value: 60,
                        showLabel: !0,
                        styles: { theme: 'light' },
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: {
                      padding: '20px',
                      backgroundColor: '#1f2937',
                      borderRadius: '8px',
                    },
                    children: [
                      (0, jsx_runtime.jsx)('h4', {
                        style: { color: 'white', margin: '0 0 10px 0' },
                        children: 'Dark Theme',
                      }),
                      (0, jsx_runtime.jsx)(components_ProgressBar, {
                        value: 60,
                        showLabel: !0,
                        styles: { theme: 'dark' },
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: {
                      padding: '20px',
                      backgroundColor: '#0a0a0a',
                      borderRadius: '8px',
                    },
                    children: [
                      (0, jsx_runtime.jsx)('h4', {
                        style: { color: '#FFD700', margin: '0 0 10px 0' },
                        children: 'Sacred Theme',
                      }),
                      (0, jsx_runtime.jsx)(components_ProgressBar, {
                        value: 60,
                        showLabel: !0,
                        styles: { theme: 'sacred' },
                      }),
                    ],
                  }),
                ],
              }),
            parameters: {
              docs: {
                description: {
                  story:
                    'Comparison of all three themes: light, dark, and sacred.',
                },
              },
            },
          },
          __namedExportsOrder = [
            'Determinate',
            'Indeterminate',
            'LightTheme',
            'DarkTheme',
            'SacredTheme',
            'SacredIndeterminate',
            'CustomLabel',
            'NoLabel',
            'CustomSize',
            'Disabled',
            'ProgressStates',
            'ThemeComparison',
          ]
      },
    },
  ]
)
