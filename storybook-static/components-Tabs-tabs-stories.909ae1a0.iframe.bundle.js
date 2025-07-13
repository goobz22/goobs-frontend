'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [9993],
    {
      './src/components/Tabs/tabs.stories.tsx': (
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
            default: () => tabs_stories,
          }))
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          external_STORYBOOK_MODULE_TEST_ =
            __webpack_require__('storybook/test'),
          navigation = __webpack_require__(
            './node_modules/@storybook/nextjs/dist/export-mocks/navigation/index.mjs'
          )
        const premiumStyles = {
            container: {
              position: 'sticky',
              top: 0,
              zIndex: 50,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgb(0,0,0)',
              color: 'white',
            },
            tabsContainer: { width: '100%', height: '100%' },
            tabsInnerContainer: {
              height: '100%',
              display: 'flex',
              position: 'relative',
            },
            tab: {
              height: '100%',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 500,
              fontSize: '16px',
              transition: 'all 0.3s ease',
              position: 'relative',
              boxSizing: 'border-box',
              fontFamily: 'Merriweather, serif',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'white',
              cursor: 'pointer',
            },
            tabHover: { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            tabActive: {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
            },
            tabIndicator: {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              transition: 'all 0.3s ease',
              backgroundColor: 'transparent',
            },
            tabIndicatorActive: { backgroundColor: 'white', height: '2px' },
            border: { borderLeft: '1px solid white' },
          },
          sacredStyles = {
            container: {
              ...premiumStyles.container,
              backgroundColor: 'rgb(0,0,0)',
              color: '#FFD700',
              borderBottom: '2px solid rgba(255, 215, 0, 0.4)',
              animation: 'sacred-glow-pulse 2s infinite alternate',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
            },
            tabsContainer: premiumStyles.tabsContainer,
            tabsInnerContainer: premiumStyles.tabsInnerContainer,
            tab: {
              ...premiumStyles.tab,
              fontFamily: '"Cinzel", serif',
              letterSpacing: '0.05em',
              color: 'rgba(255, 215, 0, 0.8)',
            },
            tabHover: {
              color: '#FFD700',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
              animation: 'sacred-shimmer 1s forwards',
            },
            tabActive: {
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              color: '#FFD700',
              fontWeight: 600,
              textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
            },
            tabIndicator: { ...premiumStyles.tabIndicator },
            tabIndicatorActive: {
              backgroundColor: '#FFD700',
              height: '4px',
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
            },
            border: { borderLeft: '1px solid rgba(255, 215, 0, 0.3)' },
            glyph: {
              fontSize: '12px',
              opacity: 0.6,
              animation: 'glyph-rotate 10s linear infinite',
            },
            tabContent: { display: 'flex', alignItems: 'center', gap: '8px' },
          }
        function Tabs({
          items,
          height = '48px',
          alignment = 'left',
          navname = '',
          sacredtheme = !1,
          className,
          style,
        }) {
          const [activeTabValues, setActiveTabValues] = (0, react.useState)({}),
            [hoveredTab, setHoveredTab] = (0, react.useState)(null),
            pathname = (0, navigation.usePathname)(),
            styles = sacredtheme ? sacredStyles : premiumStyles
          ;(0, react.useEffect)(() => {
            const currentTab = items.find(item => item.route === pathname)
            setActiveTabValues(prev => ({
              ...prev,
              [navname]: {
                tabId: (null == currentTab ? void 0 : currentTab.title) || !1,
              },
            }))
          }, [items, navname, pathname])
          const handleTabClick = tab => {
              var newValue
              ;(tab.title &&
                ((newValue = tab.title),
                setActiveTabValues(prev => ({
                  ...prev,
                  [navname]: { tabId: newValue },
                }))),
                'route' === tab.trigger && tab.route
                  ? (window.location.href = tab.route)
                  : 'onClick' === tab.trigger && tab.onClick && tab.onClick())
            },
            containerStyle = {
              ...styles.container,
              height,
              minHeight: height,
              ...style,
            }
          return (0, jsx_runtime.jsx)('div', {
            style: containerStyle,
            className,
            children: (0, jsx_runtime.jsx)('div', {
              style: styles.tabsContainer,
              children: (0, jsx_runtime.jsx)('div', {
                style: {
                  ...styles.tabsInnerContainer,
                  ...{
                    left: { justifyContent: 'flex-start' },
                    center: { justifyContent: 'center' },
                    right: { justifyContent: 'flex-end' },
                    justify: { justifyContent: 'space-between' },
                    inherit: { justifyContent: 'flex-start' },
                  }[alignment],
                },
                children: items.map((item, index) => {
                  var _activeTabValues_navname
                  const isActive =
                      (null ===
                        (_activeTabValues_navname = activeTabValues[navname]) ||
                      void 0 === _activeTabValues_navname
                        ? void 0
                        : _activeTabValues_navname.tabId) === item.title,
                    isHovered = hoveredTab === item.title,
                    tabStyle = {
                      ...styles.tab,
                      ...(isHovered && !isActive && styles.tabHover),
                      ...(isActive && styles.tabActive),
                      ...(item.hasleftborder && styles.border),
                      ...(item.hasrightborder && {
                        ...styles.border,
                        borderRight: styles.border.borderLeft,
                        borderLeft: 'none',
                      }),
                    },
                    tabIndicatorStyle = {
                      ...styles.tabIndicator,
                      ...(isActive && styles.tabIndicatorActive),
                    }
                  return (0, jsx_runtime.jsxs)(
                    'button',
                    {
                      onClick: () => handleTabClick(item),
                      style: tabStyle,
                      onMouseEnter: () => setHoveredTab(item.title || ''),
                      onMouseLeave: () => setHoveredTab(null),
                      children: [
                        (0, jsx_runtime.jsx)('div', {
                          style: tabIndicatorStyle,
                        }),
                        (0, jsx_runtime.jsxs)('div', {
                          style: sacredStyles.tabContent,
                          children: [
                            sacredtheme &&
                              (0, jsx_runtime.jsx)('span', {
                                style: {
                                  ...sacredStyles.glyph,
                                  animation: `glyph-rotate ${10 + 2 * index}s linear infinite`,
                                },
                                children: index % 2 == 0 ? '𓊹' : '𓋹',
                              }),
                            (0, jsx_runtime.jsx)('span', {
                              children: item.title || '',
                            }),
                          ],
                        }),
                      ],
                    },
                    item.title
                  )
                }),
              }),
            }),
          })
        }
        const components_Tabs = Tabs
        Tabs.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'Tabs',
          props: {
            items: {
              required: !0,
              tsType: {
                name: 'Array',
                elements: [{ name: 'TabsItem' }],
                raw: 'TabsItem[]',
              },
              description: '',
            },
            height: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "'48px'", computed: !1 },
            },
            alignment: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "'left' | 'center' | 'right' | 'justify'",
                elements: [
                  { name: 'literal', value: "'left'" },
                  { name: 'literal', value: "'center'" },
                  { name: 'literal', value: "'right'" },
                  { name: 'literal', value: "'justify'" },
                ],
              },
              description: '',
              defaultValue: { value: "'left'", computed: !1 },
            },
            navname: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "''", computed: !1 },
            },
            sacredtheme: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
            className: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
            },
            style: {
              required: !1,
              tsType: {
                name: 'ReactCSSProperties',
                raw: 'React.CSSProperties',
              },
              description: '',
            },
          },
        }
        const mixedTriggerTabs = [
            { title: 'Profile', route: '/profile', trigger: 'route' },
            {
              title: 'Settings',
              onClick: () => alert('Settings clicked!'),
              trigger: 'onClick',
            },
            {
              title: 'Logout',
              onClick: () => alert('Logging out!'),
              trigger: 'onClick',
            },
          ],
          tabs_stories = {
            title: 'Components/Tabs',
            component: components_Tabs,
            argTypes: {
              sacredtheme: { control: 'boolean' },
              alignment: {
                control: 'radio',
                options: ['left', 'center', 'right', 'justify'],
              },
              height: { control: 'text' },
            },
            parameters: { layout: 'fullscreen' },
          },
          PremiumTheme = {
            name: 'Premium Theme',
            render: args =>
              (0, jsx_runtime.jsxs)('div', {
                className: 'bg-gray-800 h-[200vh]',
                children: [
                  (0, jsx_runtime.jsx)(components_Tabs, { ...args }),
                  (0, jsx_runtime.jsxs)('div', {
                    className: 'p-8 text-white',
                    children: [
                      (0, jsx_runtime.jsx)('h1', {
                        className: 'text-2xl font-bold',
                        children: 'Page Content',
                      }),
                      (0, jsx_runtime.jsx)('p', {
                        children:
                          'Scroll down to see the tabs stick to the top.',
                      }),
                    ],
                  }),
                ],
              }),
            args: {
              items: [
                { title: 'Home', route: '/home', trigger: 'route' },
                { title: 'About', route: '/about', trigger: 'route' },
                { title: 'Contact', route: '/contact', trigger: 'route' },
              ],
              alignment: 'left',
              height: '60px',
              navname: 'premiumNav',
              sacredtheme: !1,
            },
          },
          SacredTheme = {
            name: 'Sacred Theme',
            render: args =>
              (0, jsx_runtime.jsxs)('div', {
                className: 'bg-black h-[200vh]',
                children: [
                  (0, jsx_runtime.jsx)(components_Tabs, { ...args }),
                  (0, jsx_runtime.jsxs)('div', {
                    className: 'p-8 text-yellow-200',
                    children: [
                      (0, jsx_runtime.jsx)('h1', {
                        className: 'text-2xl font-bold font-cinzel',
                        children: 'Ancient Archives',
                      }),
                      (0, jsx_runtime.jsx)('p', {
                        className: 'font-cinzel',
                        children: 'Scroll to observe the sacred header.',
                      }),
                    ],
                  }),
                ],
              }),
            args: {
              ...PremiumTheme.args,
              items: [
                {
                  title: 'Tab One',
                  route: '/one',
                  trigger: 'route',
                  hasrightborder: !0,
                },
                {
                  title: 'Tab Two',
                  route: '/two',
                  trigger: 'route',
                  hasleftborder: !0,
                  hasrightborder: !0,
                },
                { title: 'Tab Three', route: '/three', trigger: 'route' },
              ],
              alignment: 'center',
              sacredtheme: !0,
            },
          },
          InteractiveDemoRenderer = () => {
            const [sacredtheme, setsacredtheme] = react.useState(!1),
              [alignment, setAlignment] = react.useState('left')
            return (0, jsx_runtime.jsxs)('div', {
              className:
                'h-[200vh] ' + (sacredtheme ? 'bg-black' : 'bg-gray-800'),
              children: [
                (0, jsx_runtime.jsxs)('div', {
                  className:
                    'p-4 bg-white rounded-lg border fixed top-24 right-4 z-50',
                  children: [
                    (0, jsx_runtime.jsx)('h3', {
                      className: 'text-lg font-bold mb-2',
                      children: 'Controls',
                    }),
                    (0, jsx_runtime.jsxs)('div', {
                      className: 'flex flex-col gap-2',
                      children: [
                        (0, jsx_runtime.jsxs)('label', {
                          className: 'flex items-center gap-2',
                          children: [
                            (0, jsx_runtime.jsx)('input', {
                              type: 'checkbox',
                              checked: sacredtheme,
                              onChange: e => setsacredtheme(e.target.checked),
                            }),
                            'Sacred Theme',
                          ],
                        }),
                        (0, jsx_runtime.jsxs)('select', {
                          value: alignment,
                          onChange: e => setAlignment(e.target.value),
                          className: 'p-1 border rounded',
                          children: [
                            (0, jsx_runtime.jsx)('option', {
                              value: 'left',
                              children: 'Left',
                            }),
                            (0, jsx_runtime.jsx)('option', {
                              value: 'center',
                              children: 'Center',
                            }),
                            (0, jsx_runtime.jsx)('option', {
                              value: 'right',
                              children: 'Right',
                            }),
                            (0, jsx_runtime.jsx)('option', {
                              value: 'justify',
                              children: 'Justify',
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, jsx_runtime.jsx)(components_Tabs, {
                  items: mixedTriggerTabs,
                  sacredtheme,
                  alignment,
                  navname: 'interactiveNav',
                }),
                (0, jsx_runtime.jsxs)('div', {
                  className:
                    'p-8 ' + (sacredtheme ? 'text-yellow-200' : 'text-white'),
                  children: [
                    (0, jsx_runtime.jsx)('h1', {
                      className: `text-2xl font-bold ${sacredtheme && 'font-cinzel'}`,
                      children: 'Interactive Content',
                    }),
                    (0, jsx_runtime.jsx)('p', {
                      children: 'Use the controls to change the tabs.',
                    }),
                  ],
                }),
              ],
            })
          },
          InteractiveDemo = {
            name: 'Interactive Demo',
            render: () => (0, jsx_runtime.jsx)(InteractiveDemoRenderer, {}),
            play: async ({ canvasElement }) => {
              const canvas = (0, external_STORYBOOK_MODULE_TEST_.within)(
                  canvasElement
                ),
                settingsTab = await canvas.findByText('Settings')
              await external_STORYBOOK_MODULE_TEST_.userEvent.click(settingsTab)
            },
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
