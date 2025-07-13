'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [7202],
    {
      './src/components/Field/IPAM/Supernet/Supernet.stories.tsx': (
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
            default: () => Supernet_stories,
          }))
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          Subnet = __webpack_require__(
            './src/components/Field/IPAM/Subnet/index.tsx'
          )
        const SupernetField = ({
            value,
            onChange,
            label = 'Supernet',
            required = !1,
          }) =>
            (0, jsx_runtime.jsx)(Subnet.A, {
              value,
              onChange,
              label,
              required,
              min: 8,
              max: 23,
              maskType: 'supernet',
            }),
          Supernet = SupernetField
        SupernetField.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'SupernetField',
          props: {
            value: {
              required: !0,
              tsType: { name: 'SupernetFieldValue' },
              description: '',
            },
            onChange: {
              required: !0,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(value: SupernetFieldValue) => void',
                signature: {
                  arguments: [
                    { type: { name: 'SupernetFieldValue' }, name: 'value' },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            label: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "'Supernet'", computed: !1 },
            },
            required: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
          },
        }
        var console = __webpack_require__(
          './node_modules/console-browserify/index.js'
        )
        const Supernet_stories = {
            title: 'Components/Field/IPAM/Supernet',
            component: Supernet,
            argTypes: { label: { control: 'text' } },
            parameters: { layout: 'centered' },
          },
          PremiumTheme = {
            name: 'Premium Theme',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                className: 'w-[400px] p-6 bg-gray-50 rounded-lg',
                children: (0, jsx_runtime.jsx)(Supernet, { ...args }),
              }),
            args: {
              label: 'Supernet Mask',
              value: { address: '', mask: 16 },
              onChange: value => console.log('Value changed:', value),
            },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: args =>
              (0, jsx_runtime.jsx)('div', {
                className: 'w-[400px] p-6 bg-black rounded-lg',
                children: (0, jsx_runtime.jsx)(Supernet, { ...args }),
              }),
            args: { ...PremiumTheme.args },
          },
          InteractiveDemoRenderer = () => {
            const [value, setValue] = react.useState({ address: '', mask: 16 })
            return (0, jsx_runtime.jsxs)('div', {
              className: 'w-[500px] space-y-4',
              children: [
                (0, jsx_runtime.jsxs)('div', {
                  className: 'p-4 bg-white rounded-lg border',
                  children: [
                    (0, jsx_runtime.jsx)('h3', {
                      style: { fontWeight: 'bold', marginBottom: '0.5rem' },
                      children: 'Controls',
                    }),
                    (0, jsx_runtime.jsx)('div', {
                      className: 'grid grid-cols-2 gap-2',
                      children: (0, jsx_runtime.jsx)('span', {
                        children:
                          'Interactive controls can be added here when needed',
                      }),
                    }),
                  ],
                }),
                (0, jsx_runtime.jsx)('div', {
                  className: 'p-6 rounded-lg bg-gray-50',
                  children: (0, jsx_runtime.jsx)(Supernet, {
                    label: 'Interactive Supernet',
                    value,
                    onChange: setValue,
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
    },
  ]
)
