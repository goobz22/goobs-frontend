;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [1135],
    {
      './node_modules/@storybook/instrumenter/dist sync recursive': module => {
        function webpackEmptyContext(req) {
          var e = new Error("Cannot find module '" + req + "'")
          throw ((e.code = 'MODULE_NOT_FOUND'), e)
        }
        ;((webpackEmptyContext.keys = () => []),
          (webpackEmptyContext.resolve = webpackEmptyContext),
          (webpackEmptyContext.id =
            './node_modules/@storybook/instrumenter/dist sync recursive'),
          (module.exports = webpackEmptyContext))
      },
      './node_modules/@storybook/test/dist sync recursive': module => {
        function webpackEmptyContext(req) {
          var e = new Error("Cannot find module '" + req + "'")
          throw ((e.code = 'MODULE_NOT_FOUND'), e)
        }
        ;((webpackEmptyContext.keys = () => []),
          (webpackEmptyContext.resolve = webpackEmptyContext),
          (webpackEmptyContext.id =
            './node_modules/@storybook/test/dist sync recursive'),
          (module.exports = webpackEmptyContext))
      },
      './src/components/Typography/index.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        'use strict'
        __webpack_require__.d(__webpack_exports__, {
          A: () => components_Typography,
        })
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          shared =
            (__webpack_require__(
              './node_modules/next/dist/compiled/react/index.js'
            ),
            __webpack_require__('./src/theme/shared.ts'))
        const typographyThemes = {
            light: {
              base: {
                margin: '0',
                padding: '0',
                lineHeight: '1.6',
                letterSpacing: '0.01em',
                position: 'relative',
                transition: shared.Ds.medium,
              },
              variants: {
                merrih1: {
                  fontSize: '2.25rem',
                  fontWeight: '700',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(17, 24, 39)',
                },
                merrih2: {
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(17, 24, 39)',
                },
                merrih3: {
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(17, 24, 39)',
                },
                merrih4: {
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(17, 24, 39)',
                },
                merrih5: {
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(17, 24, 39)',
                },
                merrih6: {
                  fontSize: '1rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(17, 24, 39)',
                },
                merriparagraph: {
                  fontSize: '1rem',
                  fontWeight: '400',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(55, 65, 81)',
                },
                merrihelperfooter: {
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(107, 114, 128)',
                },
              },
              alignment: {
                left: { textAlign: 'left' },
                center: { textAlign: 'center' },
                right: { textAlign: 'right' },
              },
              gutterBottom: { marginBottom: '1rem' },
              outline: {
                textStroke: '1px rgb(17, 24, 39)',
                WebkitTextStroke: '1px rgb(17, 24, 39)',
              },
            },
            dark: {
              base: {
                margin: '0',
                padding: '0',
                lineHeight: '1.6',
                letterSpacing: '0.01em',
                position: 'relative',
                transition: shared.Ds.medium,
              },
              variants: {
                merrih1: {
                  fontSize: '2.25rem',
                  fontWeight: '700',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(243, 244, 246)',
                },
                merrih2: {
                  fontSize: '1.875rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(243, 244, 246)',
                },
                merrih3: {
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(243, 244, 246)',
                },
                merrih4: {
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(243, 244, 246)',
                },
                merrih5: {
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(243, 244, 246)',
                },
                merrih6: {
                  fontSize: '1rem',
                  fontWeight: '600',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(243, 244, 246)',
                },
                merriparagraph: {
                  fontSize: '1rem',
                  fontWeight: '400',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(209, 213, 219)',
                },
                merrihelperfooter: {
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  fontFamily: 'Merriweather, serif',
                  color: 'rgb(156, 163, 175)',
                },
              },
              alignment: {
                left: { textAlign: 'left' },
                center: { textAlign: 'center' },
                right: { textAlign: 'right' },
              },
              gutterBottom: { marginBottom: '1rem' },
              outline: {
                textStroke: '1px rgb(243, 244, 246)',
                WebkitTextStroke: '1px rgb(243, 244, 246)',
              },
            },
            sacred: {
              base: {
                margin: '0',
                padding: '0',
                lineHeight: '1.6',
                letterSpacing: '0.02em',
                position: 'relative',
                transition: shared.Ds.premium,
              },
              variants: {
                merrih1: {
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  fontFamily: 'Cinzel, serif',
                  color: '#FFD700',
                  textShadow:
                    '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)',
                  animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
                },
                merrih2: {
                  fontSize: '2rem',
                  fontWeight: '600',
                  fontFamily: 'Cinzel, serif',
                  color: '#FFD700',
                  textShadow:
                    '0 0 15px rgba(255, 215, 0, 0.7), 0 0 30px rgba(255, 215, 0, 0.3)',
                  animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
                },
                merrih3: {
                  fontSize: '1.75rem',
                  fontWeight: '600',
                  fontFamily: 'Cinzel, serif',
                  color: '#FFD700',
                  textShadow:
                    '0 0 12px rgba(255, 215, 0, 0.6), 0 0 25px rgba(255, 215, 0, 0.2)',
                  animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
                },
                merrih4: {
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  fontFamily: 'Cinzel, serif',
                  color: '#FFD700',
                  textShadow:
                    '0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.2)',
                  animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
                },
                merrih5: {
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  fontFamily: 'Cinzel, serif',
                  color: '#FFD700',
                  textShadow:
                    '0 0 8px rgba(255, 215, 0, 0.4), 0 0 16px rgba(255, 215, 0, 0.2)',
                  animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
                },
                merrih6: {
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  fontFamily: 'Cinzel, serif',
                  color: '#FFD700',
                  textShadow:
                    '0 0 6px rgba(255, 215, 0, 0.3), 0 0 12px rgba(255, 215, 0, 0.1)',
                  animation: 'sacredTextGlow 3s ease-in-out infinite alternate',
                },
                merriparagraph: {
                  fontSize: '1rem',
                  fontWeight: '400',
                  fontFamily: 'Cinzel, serif',
                  color: 'rgba(245, 245, 220, 0.9)',
                  textShadow: '0 0 5px rgba(255, 215, 0, 0.2)',
                },
                merrihelperfooter: {
                  fontSize: '0.875rem',
                  fontWeight: '400',
                  fontFamily: 'Cinzel, serif',
                  color: 'rgba(245, 245, 220, 0.7)',
                  textShadow: '0 0 3px rgba(255, 215, 0, 0.1)',
                },
              },
              alignment: {
                left: { textAlign: 'left' },
                center: { textAlign: 'center' },
                right: { textAlign: 'right' },
              },
              gutterBottom: { marginBottom: '1rem' },
              outline: {
                textStroke: '1px #FFD700',
                WebkitTextStroke: '1px #FFD700',
              },
            },
          },
          getTypographyStyles = styles => {
            const themeConfig = (styles => {
                const theme =
                    (null == styles ? void 0 : styles.theme) || 'light',
                  baseTheme = typographyThemes[theme]
                if (!styles) return baseTheme
                const variant = styles.variant || 'merriparagraph',
                  baseVariant = baseTheme.variants[variant]
                return {
                  ...baseTheme,
                  variants: {
                    ...baseTheme.variants,
                    [variant]: {
                      ...baseVariant,
                      fontSize: styles.fontSize || baseVariant.fontSize,
                      fontWeight: styles.fontWeight || baseVariant.fontWeight,
                      fontFamily: styles.fontFamily || baseVariant.fontFamily,
                      color: styles.color || baseVariant.color,
                      textShadow: styles.textShadow || baseVariant.textShadow,
                      animation: baseVariant.animation,
                    },
                  },
                }
              })(styles),
              variant =
                (null == styles ? void 0 : styles.variant) || 'merriparagraph',
              align = (null == styles ? void 0 : styles.textAlign) || 'left',
              variantStyle = themeConfig.variants[variant],
              alignmentStyle = themeConfig.alignment[align]
            return {
              container: {
                ...themeConfig.base,
                ...variantStyle,
                ...alignmentStyle,
                ...((null == styles ? void 0 : styles.gutterBottom) &&
                  themeConfig.gutterBottom),
                ...((null == styles ? void 0 : styles.outline) &&
                  themeConfig.outline),
                fontStyle: null == styles ? void 0 : styles.fontStyle,
                margin: null == styles ? void 0 : styles.margin,
                marginTop: null == styles ? void 0 : styles.marginTop,
                marginBottom: null == styles ? void 0 : styles.marginBottom,
                marginLeft: null == styles ? void 0 : styles.marginLeft,
                marginRight: null == styles ? void 0 : styles.marginRight,
                padding: null == styles ? void 0 : styles.padding,
                paddingTop: null == styles ? void 0 : styles.paddingTop,
                paddingBottom: null == styles ? void 0 : styles.paddingBottom,
                paddingLeft: null == styles ? void 0 : styles.paddingLeft,
                paddingRight: null == styles ? void 0 : styles.paddingRight,
                width: null == styles ? void 0 : styles.width,
                maxWidth: null == styles ? void 0 : styles.maxWidth,
                minWidth: null == styles ? void 0 : styles.minWidth,
                height: null == styles ? void 0 : styles.height,
                maxHeight: null == styles ? void 0 : styles.maxHeight,
                minHeight: null == styles ? void 0 : styles.minHeight,
                position: null == styles ? void 0 : styles.position,
                transition: (
                  null == styles ? void 0 : styles.transitionDuration
                )
                  ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
                  : themeConfig.base.transition,
                animation: null == styles ? void 0 : styles.animation,
                animationDelay: null == styles ? void 0 : styles.animationDelay,
              },
            }
          }
        var console = __webpack_require__(
          './node_modules/console-browserify/index.js'
        )
        const variantMapping = {
            merrih1: 'h1',
            merrih2: 'h2',
            merrih3: 'h3',
            merrih4: 'h4',
            merrih5: 'h5',
            merrih6: 'h6',
            merriparagraph: 'p',
            merrihelperfooter: 'p',
          },
          Typography = ({
            text,
            children,
            variant = 'merriparagraph',
            styles,
            ...rest
          }) => {
            console.log('Typography component rendered with props:', {
              variant,
              text: text || children,
              styles,
            })
            const mergedStyles = { variant, ...styles },
              computedStyles = getTypographyStyles(mergedStyles),
              Component = variantMapping[variant] || 'p',
              content = children || text
            return (0, jsx_runtime.jsx)(Component, {
              style: computedStyles.container,
              ...rest,
              children: content,
            })
          }
        Typography.displayName = 'Typography'
        const components_Typography = Typography
        Typography.__docgenInfo = {
          description:
            'A component for rendering text with consistent styling and theming.',
          methods: [],
          displayName: 'Typography',
          props: {
            text: {
              required: !1,
              tsType: { name: 'string' },
              description:
                'The text content to display. Can be used instead of children.',
            },
            children: {
              required: !1,
              tsType: { name: 'ReactReactNode', raw: 'React.ReactNode' },
              description:
                'The content to display. Takes precedence over the `text` prop.',
            },
            variant: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "| 'merriparagraph'\n| 'merrihelperfooter'\n| 'merrih1'\n| 'merrih2'\n| 'merrih3'\n| 'merrih4'\n| 'merrih5'\n| 'merrih6'",
                elements: [
                  { name: 'literal', value: "'merriparagraph'" },
                  { name: 'literal', value: "'merrihelperfooter'" },
                  { name: 'literal', value: "'merrih1'" },
                  { name: 'literal', value: "'merrih2'" },
                  { name: 'literal', value: "'merrih3'" },
                  { name: 'literal', value: "'merrih4'" },
                  { name: 'literal', value: "'merrih5'" },
                  { name: 'literal', value: "'merrih6'" },
                ],
              },
              description:
                'The typography variant to apply. Determines the style and semantic tag.',
              defaultValue: { value: "'merriparagraph'", computed: !1 },
            },
            styles: {
              required: !1,
              tsType: { name: 'TypographyStyles' },
              description:
                'Custom styles to apply to the component using the theme system.',
            },
          },
        }
      },
      './src/components/Typography/typography.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        'use strict'
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            AsChild: () => AsChild,
            Centered: () => Centered,
            CustomColor: () => CustomColor,
            CustomFontSize: () => CustomFontSize,
            DarkH1: () => DarkH1,
            DarkParagraph: () => DarkParagraph,
            DarkWithOutline: () => DarkWithOutline,
            GutterBottom: () => GutterBottom,
            InteractionTest: () => InteractionTest,
            LightH1: () => LightH1,
            LightH2: () => LightH2,
            LightHelperText: () => LightHelperText,
            LightParagraph: () => LightParagraph,
            LightWithOutline: () => LightWithOutline,
            SacredH1: () => SacredH1,
            SacredParagraph: () => SacredParagraph,
            SacredWithOutline: () => SacredWithOutline,
            __namedExportsOrder: () => __namedExportsOrder,
            default: () => __WEBPACK_DEFAULT_EXPORT__,
          }))
        var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ =
            __webpack_require__(
              './node_modules/next/dist/compiled/react/jsx-runtime.js'
            ),
          _storybook_test__WEBPACK_IMPORTED_MODULE_2__ =
            (__webpack_require__(
              './node_modules/next/dist/compiled/react/index.js'
            ),
            __webpack_require__(
              './node_modules/@storybook/test/dist/index.mjs'
            )),
          _index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
            './src/components/Typography/index.tsx'
          )
        const __WEBPACK_DEFAULT_EXPORT__ = {
            title: 'Components/Typography',
            component: _index__WEBPACK_IMPORTED_MODULE_3__.A,
            parameters: { layout: 'centered' },
            argTypes: {
              variant: {
                control: 'select',
                options: [
                  'merrih1',
                  'merrih2',
                  'merrih3',
                  'merrih4',
                  'merrih5',
                  'merrih6',
                  'merriparagraph',
                  'merrihelperfooter',
                ],
              },
              text: { control: 'text' },
              styles: {
                control: 'object',
                description: 'Custom styles using the theme system',
              },
            },
            tags: ['autodocs'],
          },
          LightH1 = {
            name: 'Light/Heading 1',
            args: {
              variant: 'merrih1',
              text: 'Heading 1 - Light Theme',
              styles: { theme: 'light' },
            },
          },
          LightH2 = {
            name: 'Light/Heading 2',
            args: {
              variant: 'merrih2',
              text: 'Heading 2 - Light Theme',
              styles: { theme: 'light' },
            },
          },
          LightParagraph = {
            name: 'Light/Paragraph',
            args: {
              variant: 'merriparagraph',
              text: 'This is a paragraph in the light theme. It uses Merriweather for excellent readability.',
              styles: { theme: 'light' },
            },
          },
          LightHelperText = {
            name: 'Light/Helper Text',
            args: {
              variant: 'merrihelperfooter',
              text: 'This is helper text for captions or footers.',
              styles: { theme: 'light' },
            },
          },
          LightWithOutline = {
            name: 'Light/With Outline',
            args: {
              variant: 'merrih2',
              text: 'Outlined Light Heading',
              styles: { theme: 'light', outline: !0 },
            },
          },
          DarkH1 = {
            name: 'Dark/Heading 1',
            args: {
              variant: 'merrih1',
              text: 'Heading 1 - Dark Theme',
              styles: { theme: 'dark' },
            },
            parameters: { backgrounds: { default: 'dark' } },
          },
          DarkParagraph = {
            name: 'Dark/Paragraph',
            args: {
              variant: 'merriparagraph',
              text: 'This is a paragraph in the dark theme with improved contrast.',
              styles: { theme: 'dark' },
            },
            parameters: { backgrounds: { default: 'dark' } },
          },
          DarkWithOutline = {
            name: 'Dark/With Outline',
            args: {
              variant: 'merrih2',
              text: 'Outlined Dark Heading',
              styles: { theme: 'dark', outline: !0 },
            },
            parameters: { backgrounds: { default: 'dark' } },
          },
          SacredH1 = {
            name: 'Sacred/Heading 1',
            args: {
              variant: 'merrih1',
              text: 'Heading 1 - Sacred Theme',
              styles: { theme: 'sacred' },
            },
            parameters: { backgrounds: { default: 'dark' } },
          },
          SacredParagraph = {
            name: 'Sacred/Paragraph',
            args: {
              variant: 'merriparagraph',
              text: 'This is a paragraph in the sacred theme, using Cinzel for a mystical feel.',
              styles: { theme: 'sacred' },
            },
            parameters: { backgrounds: { default: 'dark' } },
          },
          SacredWithOutline = {
            name: 'Sacred/With Outline',
            args: {
              variant: 'merrih2',
              text: 'Outlined Sacred Heading',
              styles: { theme: 'sacred', outline: !0 },
            },
            parameters: { backgrounds: { default: 'dark' } },
          },
          Centered = {
            name: 'Alignment/Center',
            args: {
              variant: 'merriparagraph',
              text: 'This text is center-aligned.',
              styles: { theme: 'light', textAlign: 'center', width: '300px' },
            },
          },
          GutterBottom = {
            name: 'Spacing/Gutter Bottom',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _index__WEBPACK_IMPORTED_MODULE_3__.A,
                    {
                      variant: 'merriparagraph',
                      text: 'This paragraph has a bottom margin.',
                      styles: { theme: 'light', gutterBottom: !0 },
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _index__WEBPACK_IMPORTED_MODULE_3__.A,
                    {
                      variant: 'merriparagraph',
                      text: 'This is the next paragraph to show the spacing.',
                      styles: { theme: 'light' },
                    }
                  ),
                ],
              }),
          },
          AsChild = {
            name: 'Composition/As Child',
            args: {
              variant: 'merrih1',
              children: (0,
              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('span', {
                children: [
                  'This is a ',
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'strong',
                    { style: { color: 'blue' }, children: 'React node child' }
                  ),
                  ' ',
                  'inside Typography.',
                ],
              }),
              styles: { theme: 'light' },
            },
          },
          CustomColor = {
            name: 'Customization/Custom Color',
            args: {
              variant: 'merrih2',
              text: 'Custom colored heading',
              styles: { theme: 'light', color: '#e11d48' },
            },
          },
          CustomFontSize = {
            name: 'Customization/Custom Font Size',
            args: {
              variant: 'merriparagraph',
              text: 'This paragraph has a custom font size.',
              styles: { theme: 'light', fontSize: '1.25rem' },
            },
          },
          InteractionTest = {
            name: 'Interaction and A11y Test',
            render: () =>
              (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  padding: '2rem',
                  background: '#f0f0f0',
                },
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _index__WEBPACK_IMPORTED_MODULE_3__.A,
                    {
                      variant: 'merrih1',
                      styles: { theme: 'light' },
                      children: 'Test Heading 1',
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _index__WEBPACK_IMPORTED_MODULE_3__.A,
                    {
                      variant: 'merriparagraph',
                      styles: { theme: 'light' },
                      children: 'This is a test paragraph.',
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    _index__WEBPACK_IMPORTED_MODULE_3__.A,
                    {
                      variant: 'merrihelperfooter',
                      styles: { theme: 'light', textAlign: 'right' },
                      children: 'Footer text',
                    }
                  ),
                ],
              }),
            play: async ({ canvasElement }) => {
              const canvas = (0,
                _storybook_test__WEBPACK_IMPORTED_MODULE_2__.ux)(canvasElement),
                heading = canvas.getByText('Test Heading 1'),
                paragraph = canvas.getByText('This is a test paragraph.'),
                footer = canvas.getByText('Footer text')
              ;(await (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                heading
              ).toBeVisible(),
                await (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                  paragraph
                ).toBeVisible(),
                await (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                  footer
                ).toBeVisible(),
                (0, _storybook_test__WEBPACK_IMPORTED_MODULE_2__.E3)(
                  footer
                ).toHaveStyle({ 'text-align': 'right' }))
            },
          },
          __namedExportsOrder = [
            'LightH1',
            'LightH2',
            'LightParagraph',
            'LightHelperText',
            'LightWithOutline',
            'DarkH1',
            'DarkParagraph',
            'DarkWithOutline',
            'SacredH1',
            'SacredParagraph',
            'SacredWithOutline',
            'Centered',
            'GutterBottom',
            'AsChild',
            'CustomColor',
            'CustomFontSize',
            'InteractionTest',
          ]
      },
      './src/theme/shared.ts': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        'use strict'
        __webpack_require__.d(__webpack_exports__, {
          Ds: () => TRANSITIONS,
          I4: () => SHADOWS,
          r5: () => SACRED_ANIMATIONS,
          vR: () => SACRED_GLYPHS,
          zh: () => injectKeyframes,
        })
        const SACRED_GLYPHS = [
            '𓁟',
            '𓂀',
            '𓃀',
            '𓄿',
            '𓊖',
            '𓊗',
            '𓋴',
            '𓏏',
            '𓊨',
            '𓁦',
            '𓅓',
            '𓆄',
            '𓇳',
            '𓈖',
            '𓊹',
            '𓊺',
            '𓊻',
            '𓋹',
            '𓌻',
            '𓍿',
            '𓅨',
            '𓂋',
            '𓏭',
            '𓊵',
          ],
          SACRED_ANIMATIONS = {
            float: 'sacredFloat 3s ease-in-out infinite',
            glow: 'sacredGlow 3s ease-in-out infinite',
            rotate: 'sacredGlyphRotate 20s linear infinite',
            shimmer: 'sacredShimmer 2s ease-in-out infinite',
          },
          TRANSITIONS = {
            fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            medium: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            slow: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            premium: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          },
          SHADOWS = {
            light: {
              small:
                '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
              medium:
                '0 4px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
              large:
                '0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.1)',
            },
            dark: {
              small:
                '0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
              medium:
                '0 4px 8px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)',
              large:
                '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.3)',
            },
            sacred: {
              small:
                '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1)',
              medium:
                '0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2)',
              large:
                '0 0 40px rgba(255, 215, 0, 0.6), 0 0 80px rgba(255, 215, 0, 0.3)',
            },
          },
          injectKeyframes = () => {
            if ('undefined' != typeof document) {
              const styleElement = document.createElement('style')
              ;((styleElement.textContent =
                '\n@keyframes pulse {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.7;\n  }\n}\n\n@keyframes glyph-rotate {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes sacred-glow-pulse {\n  0% {\n    box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.3), inset 0 0 30px rgba(255, 215, 0, 0.15);\n  }\n  100% {\n    box-shadow: 0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 215, 0, 0.4), inset 0 0 40px rgba(255, 215, 0, 0.2);\n  }\n}\n\n@keyframes sacred-error-pulse {\n  0% {\n    box-shadow: 0 0 30px rgba(184, 134, 11, 0.5), 0 0 60px rgba(184, 134, 11, 0.25), inset 0 0 30px rgba(184, 134, 11, 0.1);\n  }\n  100% {\n    box-shadow: 0 0 40px rgba(184, 134, 11, 0.7), 0 0 80px rgba(184, 134, 11, 0.35), inset 0 0 40px rgba(184, 134, 11, 0.15);\n  }\n}\n\n@keyframes sacred-icon-glow {\n  0% {\n    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));\n  }\n  100% {\n    filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.8));\n  }\n}\n\n@keyframes sacred-error-icon-pulse {\n  0% {\n    filter: drop-shadow(0 0 8px rgba(184, 134, 11, 0.6));\n  }\n  100% {\n    filter: drop-shadow(0 0 12px rgba(184, 134, 11, 0.8));\n  }\n}\n\n@keyframes sacredFloat {\n  0%, 100% {\n    transform: translateY(0px);\n  }\n  50% {\n    transform: translateY(-5px);\n  }\n}\n\n@keyframes sacredGlow {\n  0%, 100% {\n    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);\n  }\n  50% {\n    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);\n  }\n}\n\n@keyframes sacredGlyphRotate {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes sacredShimmer {\n  0% {\n    background-position: -200% 0;\n  }\n  100% {\n    background-position: 200% 0;\n  }\n}\n'),
                document.head.querySelector('style[data-keyframes="true"]') ||
                  (styleElement.setAttribute('data-keyframes', 'true'),
                  document.head.appendChild(styleElement)))
            }
          }
      },
    },
  ]
)
