'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [1517],
    {
      './src/components/Chip/chip.stories.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        ;(__webpack_require__.r(__webpack_exports__),
          __webpack_require__.d(__webpack_exports__, {
            CustomColors: () => CustomColors,
            CustomSize: () => CustomSize,
            DarkTheme: () => DarkTheme,
            Default: () => Default,
            Deletable: () => Deletable,
            Disabled: () => Disabled,
            LightTheme: () => LightTheme,
            NoOutline: () => NoOutline,
            SacredDisabled: () => SacredDisabled,
            SacredTheme: () => SacredTheme,
            __namedExportsOrder: () => __namedExportsOrder,
            default: () => __WEBPACK_DEFAULT_EXPORT__,
          }))
        var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ =
          __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          )
        const __WEBPACK_DEFAULT_EXPORT__ = {
            title: 'Components/Chip',
            component: __webpack_require__('./src/components/Chip/index.tsx').A,
            argTypes: {
              label: { control: 'text' },
              styles: {
                control: 'object',
                description:
                  'Comprehensive styling options including theme, custom colors, and layout properties.',
              },
              onDelete: { action: 'deleted' },
            },
            parameters: { layout: 'centered' },
            decorators: [
              Story =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                  style: { padding: '1rem', display: 'flex', gap: '1rem' },
                  children: (0,
                  react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    Story,
                    {}
                  ),
                }),
            ],
          },
          Default = {
            args: { label: 'Default Chip', styles: { theme: 'light' } },
          },
          Deletable = {
            args: {
              label: 'Deletable Chip',
              onDelete: () => alert('Chip deleted!'),
              styles: { theme: 'light' },
            },
          },
          Disabled = {
            name: 'State/Disabled',
            args: {
              label: 'Disabled Chip',
              onDelete: () => alert('Chip deleted!'),
              styles: { theme: 'light', disabled: !0 },
            },
          },
          LightTheme = {
            name: 'Theme/Light',
            args: {
              label: 'Light Theme Chip',
              onDelete: () => alert('Chip deleted!'),
              styles: { theme: 'light' },
            },
          },
          DarkTheme = {
            name: 'Theme/Dark',
            args: {
              label: 'Dark Theme Chip',
              onDelete: () => alert('Chip deleted!'),
              styles: { theme: 'dark' },
            },
            parameters: { backgrounds: { default: 'dark' } },
          },
          SacredTheme = {
            name: 'Theme/Sacred',
            args: {
              label: 'Sacred Chip',
              onDelete: () => alert('Chip deleted!'),
              styles: { theme: 'sacred' },
            },
            parameters: { backgrounds: { default: 'dark' } },
          },
          SacredDisabled = {
            name: 'Theme/Sacred Disabled',
            args: {
              label: 'Sacred & Disabled',
              onDelete: () => alert('Chip deleted!'),
              styles: { theme: 'sacred', disabled: !0 },
            },
            parameters: { backgrounds: { default: 'dark' } },
          },
          NoOutline = {
            name: 'Theme/No Outline',
            args: {
              label: 'No Outline',
              styles: { theme: 'light', outline: !1 },
            },
          },
          CustomColors = {
            name: 'Customization/Custom Colors',
            args: {
              label: 'Custom Colors',
              onDelete: () => alert('Chip deleted!'),
              styles: {
                theme: 'light',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 0.3)',
                color: 'rgb(34, 197, 94)',
                hoverBackgroundColor: 'rgba(34, 197, 94, 0.15)',
                hoverBorderColor: 'rgba(34, 197, 94, 0.4)',
              },
            },
          },
          CustomSize = {
            name: 'Customization/Custom Size',
            args: {
              label: 'Large Chip',
              onDelete: () => alert('Chip deleted!'),
              styles: {
                theme: 'light',
                height: '36px',
                padding: '0 16px',
                fontSize: '16px',
              },
            },
          },
          __namedExportsOrder = [
            'Default',
            'Deletable',
            'Disabled',
            'LightTheme',
            'DarkTheme',
            'SacredTheme',
            'SacredDisabled',
            'NoOutline',
            'CustomColors',
            'CustomSize',
          ]
      },
      './src/components/Chip/index.tsx': (
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
          _Icons_Close__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
            './src/components/Icons/Close.tsx'
          ),
          _theme__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
            './src/theme/index.ts'
          )
        const Chip = ({ label, onDelete, styles }) => {
            const [isHovered, setIsHovered] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
              [isCloseHovered, setIsCloseHovered] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
              isDisabled = null == styles ? void 0 : styles.disabled,
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              computedStyles = (0, _theme__WEBPACK_IMPORTED_MODULE_3__.z6)(
                styles,
                isHovered,
                isDisabled
              ),
              closeButtonStyle = {
                ...computedStyles.closeButton,
                ...(isCloseHovered &&
                  !isDisabled &&
                  computedStyles.closeButtonHover),
                ...(isDisabled && computedStyles.closeButtonDisabled),
              }
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: computedStyles.container,
                onMouseEnter: () => setIsHovered(!0),
                onMouseLeave: () => setIsHovered(!1),
                children: [
                  isSacredTheme &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment,
                      {
                        children: [
                          (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            'span',
                            {
                              style: {
                                ...computedStyles.glyph,
                                ...computedStyles.glyphLeft,
                                ...(isHovered &&
                                  !isDisabled &&
                                  computedStyles.glyphVisible),
                              },
                              children:
                                _theme__WEBPACK_IMPORTED_MODULE_3__.vR[7],
                            }
                          ),
                          (0,
                          react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                            'span',
                            {
                              style: {
                                ...computedStyles.glyph,
                                ...computedStyles.glyphRight,
                                ...(isHovered &&
                                  !isDisabled &&
                                  computedStyles.glyphVisible),
                              },
                              children:
                                _theme__WEBPACK_IMPORTED_MODULE_3__.vR[13],
                            }
                          ),
                          isHovered &&
                            !isDisabled &&
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'div',
                              { style: computedStyles.shimmer }
                            ),
                        ],
                      }
                    ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'span',
                    {
                      style: { position: 'relative', zIndex: 1 },
                      children: label,
                    }
                  ),
                  onDelete &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      'button',
                      {
                        onClick: isDisabled ? void 0 : onDelete,
                        style: closeButtonStyle,
                        onMouseEnter: () => setIsCloseHovered(!0),
                        onMouseLeave: () => setIsCloseHovered(!1),
                        disabled: isDisabled,
                        'aria-label': 'Remove chip',
                        children: (0,
                        react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          _Icons_Close__WEBPACK_IMPORTED_MODULE_2__.A,
                          { style: { width: '16px', height: '16px' } }
                        ),
                      }
                    ),
                ],
              }
            )
          },
          __WEBPACK_DEFAULT_EXPORT__ = Chip
        Chip.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'Chip',
          props: {
            label: {
              required: !0,
              tsType: { name: 'string' },
              description: '',
            },
            onDelete: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'ChipStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
          },
        }
      },
      './src/components/Icons/Close.tsx': (
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
          )
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
          premiumStyles_icon = {
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
            color: 'rgb(75, 85, 99)',
          },
          premiumStyles_iconHover = {
            transform: 'scale(1.05)',
            filter: 'drop-shadow(0 2px 4px rgba(75, 85, 99, 0.3))',
            color: 'rgb(55, 65, 81)',
          },
          sacredStyles_icon = {
            transition: 'all 0.4s ease',
            filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))',
            color: 'rgba(255, 215, 0, 0.9)',
          },
          sacredStyles_iconHover = {
            transform: 'scale(1.1) rotate(5deg)',
            filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
            color: '#FFD700',
          },
          sacredStyles_glyph = {
            position: 'absolute',
            fontSize: '12px',
            color: 'rgba(255, 215, 0, 0.6)',
            transition: 'all 0.3s ease',
            opacity: 0,
            pointerEvents: 'none',
            animation: 'sacredGlyphRotate 20s linear infinite',
          },
          sacredStyles_glyphVisible = { opacity: 1 },
          CloseIcon = ({
            fontSize = 'medium',
            className = '',
            style = {},
            sacredtheme = !1,
          }) => {
            const [isHovered, setIsHovered] = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
              [glyph] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(
                SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]
              )
            ;(0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
              if (sacredtheme) {
                const styleSheet = document.styleSheets[0],
                  keyframes =
                    '\n        @keyframes sacredGlyphRotate {\n          from { transform: rotate(0deg); }\n          to { transform: rotate(360deg); }\n        }\n      '
                try {
                  styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
                } catch (e) {}
              }
            }, [sacredtheme])
            const size = (() => {
                switch (fontSize) {
                  case 'small':
                    return '18'
                  case 'large':
                    return '28'
                  default:
                    return '24'
                }
              })(),
              iconStyle = {
                ...(sacredtheme ? sacredStyles_icon : premiumStyles_icon),
                ...(isHovered && sacredtheme ? sacredStyles_iconHover : {}),
                ...(isHovered && !sacredtheme ? premiumStyles_iconHover : {}),
                ...style,
              }
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              'div',
              {
                style: { position: 'relative', display: 'inline-block' },
                onMouseEnter: () => setIsHovered(!0),
                onMouseLeave: () => setIsHovered(!1),
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'svg',
                    {
                      width: size,
                      height: size,
                      viewBox: '0 0 24 24',
                      fill: 'currentColor',
                      className,
                      style: iconStyle,
                      children: (0,
                      react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'path',
                        {
                          d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
                        }
                      ),
                    }
                  ),
                  sacredtheme &&
                    (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                      'div',
                      {
                        style: {
                          ...sacredStyles_glyph,
                          ...(isHovered && sacredStyles_glyphVisible),
                          top: '-8px',
                          right: '-8px',
                        },
                        children: glyph,
                      }
                    ),
                ],
              }
            )
          },
          __WEBPACK_DEFAULT_EXPORT__ = CloseIcon
        CloseIcon.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'CloseIcon',
          props: {
            fontSize: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "'small' | 'medium' | 'large'",
                elements: [
                  { name: 'literal', value: "'small'" },
                  { name: 'literal', value: "'medium'" },
                  { name: 'literal', value: "'large'" },
                ],
              },
              description: '',
              defaultValue: { value: "'medium'", computed: !1 },
            },
            className: {
              required: !1,
              tsType: { name: 'string' },
              description: '',
              defaultValue: { value: "''", computed: !1 },
            },
            style: {
              required: !1,
              tsType: {
                name: 'ReactCSSProperties',
                raw: 'React.CSSProperties',
              },
              description: '',
              defaultValue: { value: '{}', computed: !1 },
            },
            sacredtheme: {
              required: !1,
              tsType: { name: 'boolean' },
              description: '',
              defaultValue: { value: 'false', computed: !1 },
            },
          },
        }
      },
    },
  ]
)
