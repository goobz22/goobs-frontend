'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [9406],
    {
      './src/components/Card/index.tsx': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.d(__webpack_exports__, { A: () => components_Card })
        var jsx_runtime = __webpack_require__(
            './node_modules/next/dist/compiled/react/jsx-runtime.js'
          ),
          react = __webpack_require__(
            './node_modules/next/dist/compiled/react/index.js'
          ),
          Typography = __webpack_require__(
            './src/components/Typography/index.tsx'
          ),
          Info = __webpack_require__('./src/components/Icons/Info.tsx'),
          Tooltip = __webpack_require__('./src/components/Tooltip/index.tsx'),
          Button = __webpack_require__('./src/components/Button/index.tsx'),
          next_link = __webpack_require__('./node_modules/next/link.js'),
          link_default = __webpack_require__.n(next_link),
          FavoriteIcon = __webpack_require__(
            './src/components/Icons/FavoriteIcon.tsx'
          ),
          Stepper = __webpack_require__('./src/components/Stepper/index.tsx'),
          console = __webpack_require__(
            './node_modules/console-browserify/index.js'
          )
        const premiumStyles = {
            container: {
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              boxShadow:
                '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontFamily: '"Inter", sans-serif',
            },
            containerNoOutline: {
              border: 'none',
              boxShadow: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
            },
            containerHover: {
              transform: 'translateY(-2px)',
              boxShadow:
                '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.08)',
              borderColor: 'rgba(59, 130, 246, 0.3)',
            },
            containerWithImage: { flexDirection: 'row' },
            image: {
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              flexShrink: 0,
            },
            imageTop: { width: '100%', height: '192px' },
            imageLeft: { width: '192px', height: '100%' },
            content: { display: 'flex', flexDirection: 'column', flexGrow: 1 },
            header: {
              width: '100%',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
              backgroundColor: 'rgba(248, 250, 252, 0.5)',
            },
            headerNoUnderline: { borderBottom: 'none' },
            bodySection: { padding: '24px' },
            bodyMobile: { padding: '24px', display: 'block' },
            bodyDesktop: { display: 'none' },
            footer: {
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              marginTop: 'auto',
              borderTop: '1px solid rgba(226, 232, 240, 0.3)',
              backgroundColor: 'rgba(248, 250, 252, 0.3)',
            },
            breadcrumb: { display: 'flex', alignItems: 'center', gap: '8px' },
            accent: {
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              background:
                'linear-gradient(180deg, rgb(59, 130, 246) 0%, rgb(147, 197, 253) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            accentVisible: { opacity: 1 },
          },
          sacredStyles = {
            container: {
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              border: '2px solid rgba(255, 215, 0, 0.4)',
              borderRadius: '12px',
              backgroundColor: 'rgba(10, 10, 10, 0.9)',
              backdropFilter: 'blur(8px)',
              boxShadow:
                '0 0 20px rgba(255, 215, 0, 0.2), 0 0 40px rgba(255, 215, 0, 0.1)',
              overflow: 'hidden',
              transition: 'all 0.4s ease',
              fontFamily: '"Cinzel", serif',
              backgroundImage:
                '\n      radial-gradient(circle at top right, rgba(255, 215, 0, 0.03) 0%, transparent 50%),\n      radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.02) 0%, transparent 50%)\n    ',
            },
            containerNoOutline: { border: 'none', boxShadow: 'none' },
            containerHover: {
              transform: 'translateY(-2px)',
              borderColor: 'rgba(255, 215, 0, 0.8)',
              boxShadow:
                '0 0 30px rgba(255, 215, 0, 0.4), 0 0 60px rgba(255, 215, 0, 0.2)',
              backgroundImage:
                '\n      linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(255, 215, 0, 0.1) 100%),\n      radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),\n      radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.03) 0%, transparent 50%)\n    ',
            },
            containerWithImage: { flexDirection: 'row' },
            image: {
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              flexShrink: 0,
              position: 'relative',
            },
            imageOverlay: {
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(45deg, transparent 0%, rgba(255, 215, 0, 0.1) 50%, transparent 100%)',
            },
            imageTop: { width: '100%', height: '192px' },
            imageLeft: { width: '192px', height: '100%' },
            content: { display: 'flex', flexDirection: 'column', flexGrow: 1 },
            header: {
              width: '100%',
              padding: '20px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
              backgroundColor: 'rgba(255, 215, 0, 0.05)',
            },
            headerNoUnderline: { borderBottom: 'none' },
            bodySection: { padding: '28px' },
            bodyMobile: { padding: '28px', display: 'block' },
            bodyDesktop: { display: 'none' },
            footer: {
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 28px',
              marginTop: 'auto',
              borderTop: '1px solid rgba(255, 215, 0, 0.3)',
              backgroundColor: 'rgba(255, 215, 0, 0.03)',
            },
            breadcrumb: { display: 'flex', alignItems: 'center', gap: '12px' },
            glyph: {
              position: 'absolute',
              fontSize: '16px',
              color: 'rgba(255, 215, 0, 0.2)',
              pointerEvents: 'none',
              opacity: 0.3,
            },
            glyphTopRight: { top: '12px', right: '12px' },
            glyphBottomLeft: { bottom: '12px', left: '12px' },
          },
          SACRED_GLYPHS = ['𓁟', '𓂀', '𓃀', '𓄿', '𓊖', '𓊗', '𓋴', '𓏏'],
          DefaultCard = ({
            title,
            titleUnderline = !0,
            body,
            image,
            imagePosition = 'top',
            parentText = 'Parent',
            parentLink = '/',
            childText = 'Child',
            childLink = '/',
            grandchildLink = '/',
            favoriteEnabled = !1,
            breadcrumbEnabled = !1,
            linkEnabled = !1,
            width = '100%',
            height,
            stepperEnabled = !1,
            stepperSteps = [],
            className,
            sacredtheme = !1,
            outline = !0,
            ...rest
          }) => {
            const [isHovered, setIsHovered] = (0, react.useState)(!1)
            console.log('DefaultCard rendered with props:', {
              title,
              sacredtheme,
              width,
              height,
            })
            const styles = sacredtheme ? sacredStyles : premiumStyles,
              containerStyle = {
                ...styles.container,
                ...(!outline && styles.containerNoOutline),
                ...(image &&
                  'left' === imagePosition &&
                  styles.containerWithImage),
                ...(isHovered && styles.containerHover),
                width: 'number' == typeof width ? `${width}px` : width,
                height: 'number' == typeof height ? `${height}px` : height,
              },
              imageStyle = {
                ...styles.image,
                ...('top' === imagePosition
                  ? styles.imageTop
                  : styles.imageLeft),
                backgroundImage: image ? `url(${image})` : void 0,
              },
              headerStyle = {
                ...styles.header,
                ...(!titleUnderline && styles.headerNoUnderline),
              }
            return (0, jsx_runtime.jsxs)('div', {
              className,
              style: containerStyle,
              onMouseEnter: () => setIsHovered(!0),
              onMouseLeave: () => setIsHovered(!1),
              ...rest,
              children: [
                sacredtheme &&
                  (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                    children: [
                      (0, jsx_runtime.jsx)('div', {
                        style: {
                          ...sacredStyles.glyph,
                          ...sacredStyles.glyphTopRight,
                        },
                        children: SACRED_GLYPHS[0],
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: {
                          ...sacredStyles.glyph,
                          ...sacredStyles.glyphBottomLeft,
                        },
                        children: SACRED_GLYPHS[1],
                      }),
                    ],
                  }),
                !sacredtheme &&
                  outline &&
                  (0, jsx_runtime.jsx)('div', {
                    style: {
                      ...premiumStyles.accent,
                      ...(isHovered && premiumStyles.accentVisible),
                    },
                  }),
                image &&
                  (0, jsx_runtime.jsx)('div', {
                    style: imageStyle,
                    children:
                      sacredtheme &&
                      (0, jsx_runtime.jsx)('div', {
                        style: sacredStyles.imageOverlay,
                      }),
                  }),
                (0, jsx_runtime.jsxs)('div', {
                  style: styles.content,
                  children: [
                    title &&
                      (0, jsx_runtime.jsxs)('div', {
                        style: headerStyle,
                        children: [
                          (0, jsx_runtime.jsx)(Typography.A, {
                            text: title,
                            variant: 'merrih5',
                            styles: {
                              color: sacredtheme
                                ? '#FFD700'
                                : 'rgb(31, 41, 55)',
                              ...(sacredtheme && {
                                fontFamily: '"Cinzel", serif',
                                fontWeight: 700,
                                textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                              }),
                            },
                          }),
                          favoriteEnabled &&
                            (0, jsx_runtime.jsx)(FavoriteIcon.A, {}),
                        ],
                      }),
                    body &&
                      (0, jsx_runtime.jsx)('div', {
                        className: 'hidden md:block',
                        style: styles.bodySection,
                        children: (0, jsx_runtime.jsx)(Typography.A, {
                          text: body,
                          variant: 'merriparagraph',
                          styles: {
                            color: sacredtheme
                              ? 'rgba(255, 215, 0, 0.8)'
                              : 'rgb(55, 65, 81)',
                            ...(sacredtheme && {
                              fontFamily: '"Merriweather", serif',
                              lineHeight: 1.6,
                            }),
                          },
                        }),
                      }),
                    body &&
                      (0, jsx_runtime.jsx)('div', {
                        className: 'block md:hidden',
                        style: styles.bodySection,
                        children: (0, jsx_runtime.jsx)(Tooltip.A, {
                          title: body,
                          arrow: !0,
                          tooltipplacement: 'right',
                          offsetX: 0,
                          offsetY: 0,
                          sacredtheme,
                          children: (0, jsx_runtime.jsx)(Info.A, {
                            style: {
                              color: sacredtheme ? '#FFD700' : 'black',
                              cursor: 'pointer',
                              ...(sacredtheme && {
                                filter:
                                  'drop-shadow(0 0 6px rgba(255, 215, 0, 0.5))',
                              }),
                            },
                          }),
                        }),
                      }),
                    stepperEnabled &&
                      (0, jsx_runtime.jsx)('div', {
                        style: { padding: '0 24px' },
                        children: (0, jsx_runtime.jsx)(Stepper.A, {
                          steps: stepperSteps,
                          styles: {
                            orientation: 'vertical',
                            theme: sacredtheme ? 'sacred' : 'light',
                          },
                        }),
                      }),
                    (0, jsx_runtime.jsxs)('div', {
                      style: styles.footer,
                      children: [
                        (0, jsx_runtime.jsx)('div', {
                          children:
                            breadcrumbEnabled &&
                            (0, jsx_runtime.jsxs)('div', {
                              style: styles.breadcrumb,
                              children: [
                                (0, jsx_runtime.jsx)(link_default(), {
                                  href: parentLink || '/',
                                  passHref: !0,
                                  children: (0, jsx_runtime.jsx)(Typography.A, {
                                    text: parentText,
                                    variant: 'merriparagraph',
                                    styles: {
                                      color: sacredtheme
                                        ? 'rgba(255, 215, 0, 0.8)'
                                        : 'rgb(75, 85, 99)',
                                    },
                                  }),
                                }),
                                (0, jsx_runtime.jsx)(Typography.A, {
                                  text: '>',
                                  variant: 'merriparagraph',
                                  styles: {
                                    color: sacredtheme
                                      ? 'rgba(255, 215, 0, 0.6)'
                                      : 'rgb(107, 114, 128)',
                                  },
                                }),
                                (0, jsx_runtime.jsx)(link_default(), {
                                  href: childLink || '/',
                                  passHref: !0,
                                  children: (0, jsx_runtime.jsx)(Typography.A, {
                                    text: childText,
                                    variant: 'merriparagraph',
                                    styles: {
                                      color: sacredtheme
                                        ? 'rgba(255, 215, 0, 0.8)'
                                        : 'rgb(75, 85, 99)',
                                    },
                                  }),
                                }),
                              ],
                            }),
                        }),
                        (0, jsx_runtime.jsx)('div', {
                          style: { paddingLeft: '16px' },
                          children:
                            linkEnabled &&
                            (0, jsx_runtime.jsx)(link_default(), {
                              href: grandchildLink || '/',
                              passHref: !0,
                              children: (0, jsx_runtime.jsx)(Button.A, {
                                icon: (0, jsx_runtime.jsx)('svg', {
                                  xmlns: 'http://www.w3.org/2000/svg',
                                  width: '1em',
                                  height: '1em',
                                  viewBox: '0 0 24 24',
                                  fill: 'none',
                                  stroke: 'currentColor',
                                  strokeWidth: '2',
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                  children: (0, jsx_runtime.jsx)('polyline', {
                                    points: '9 18 15 12 9 6',
                                  }),
                                }),
                                styles: {
                                  theme: sacredtheme ? 'sacred' : 'light',
                                  color: sacredtheme
                                    ? '#FFD700'
                                    : 'rgb(55, 65, 81)',
                                  fontSize: '15px',
                                  iconLocation: 'right',
                                  outline,
                                },
                              }),
                            }),
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            })
          },
          defaultconfig = DefaultCard
        DefaultCard.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'DefaultCard',
          props: {
            title: {
              required: !1,
              tsType: { name: 'string' },
              description: 'The main title of the card.',
            },
            titleUnderline: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'If true, a border will be shown below the title.',
              defaultValue: { value: 'true', computed: !1 },
            },
            body: {
              required: !1,
              tsType: { name: 'string' },
              description: 'The main body content of the card.',
            },
            image: {
              required: !1,
              tsType: { name: 'string' },
              description: "URL for the card's image.",
            },
            imagePosition: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "'top' | 'left'",
                elements: [
                  { name: 'literal', value: "'top'" },
                  { name: 'literal', value: "'left'" },
                ],
              },
              description: 'Position of the image relative to the content.',
              defaultValue: { value: "'top'", computed: !1 },
            },
            parentText: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Text for the parent level in the breadcrumb.',
              defaultValue: { value: "'Parent'", computed: !1 },
            },
            parentLink: {
              required: !1,
              tsType: { name: 'string' },
              description: 'URL for the parent level in the breadcrumb.',
              defaultValue: { value: "'/'", computed: !1 },
            },
            childText: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Text for the child level in the breadcrumb.',
              defaultValue: { value: "'Child'", computed: !1 },
            },
            childLink: {
              required: !1,
              tsType: { name: 'string' },
              description: 'URL for the child level in the breadcrumb.',
              defaultValue: { value: "'/'", computed: !1 },
            },
            grandchildLink: {
              required: !1,
              tsType: { name: 'string' },
              description:
                'URL for the final action link/button in the footer.',
              defaultValue: { value: "'/'", computed: !1 },
            },
            favoriteEnabled: {
              required: !1,
              tsType: { name: 'boolean' },
              description:
                'If true, a favorite icon will be displayed in the header.',
              defaultValue: { value: 'false', computed: !1 },
            },
            breadcrumbEnabled: {
              required: !1,
              tsType: { name: 'boolean' },
              description:
                'If true, breadcrumbs will be displayed in the footer.',
              defaultValue: { value: 'false', computed: !1 },
            },
            linkEnabled: {
              required: !1,
              tsType: { name: 'boolean' },
              description:
                'If true, a link/button will be displayed in the footer.',
              defaultValue: { value: 'false', computed: !1 },
            },
            width: {
              required: !1,
              tsType: {
                name: 'union',
                raw: 'string | number',
                elements: [{ name: 'string' }, { name: 'number' }],
              },
              description: 'The width of the card.',
              defaultValue: { value: "'100%'", computed: !1 },
            },
            height: {
              required: !1,
              tsType: {
                name: 'union',
                raw: 'string | number',
                elements: [{ name: 'string' }, { name: 'number' }],
              },
              description: 'The height of the card.',
            },
            stepperEnabled: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'If true, a stepper component will be displayed.',
              defaultValue: { value: 'false', computed: !1 },
            },
            stepperSteps: {
              required: !1,
              tsType: {
                name: "StepperProps['steps']",
                raw: "StepperProps['steps']",
              },
              description: 'The steps to be passed to the stepper component.',
              defaultValue: { value: '[]', computed: !1 },
            },
            className: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Additional CSS classes for custom styling.',
            },
            sacredtheme: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'If true, enables the stylized "sacred" theme.',
              defaultValue: { value: 'false', computed: !1 },
            },
            outline: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'If true, displays an outline style.',
              defaultValue: { value: 'true', computed: !1 },
            },
          },
        }
        var theme = __webpack_require__('./src/theme/index.ts'),
          Checkbox = __webpack_require__('./src/components/Checkbox/index.tsx')
        const TaskCard = ({
          title = 'Task Title',
          description = 'Description',
          checked = !1,
          disabled = !1,
          onCheck,
          height = 'auto',
          draggable = !1,
          onDragStart,
          onDragOver,
          onDrop,
          styles,
        }) => {
          const [isHovered, setIsHovered] = (0, react.useState)(!1),
            isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            outline = !1 !== (null == styles ? void 0 : styles.outline),
            computedStyles = (0, react.useMemo)(
              () =>
                (0, theme.Hu)(
                  { ...styles, variant: 'task' },
                  isHovered,
                  disabled
                ),
              [styles, isHovered, disabled]
            ),
            containerStyle = {
              ...computedStyles.taskContainer,
              ...(checked && {
                backgroundColor: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.05)'
                  : 'rgba(239, 246, 255, 0.8)',
                borderColor: isSacredTheme
                  ? '#FFD700'
                  : 'rgba(34, 197, 94, 0.4)',
              }),
              ...(draggable && { cursor: 'grab' }),
              height: 'number' == typeof height ? `${height}px` : height,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            },
            titleStyle = {
              marginBottom: '4px',
              transition: 'all 0.3s ease',
              ...(checked && {
                textDecoration: 'line-through',
                textDecorationColor: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.5)'
                  : 'rgba(34, 197, 94, 0.5)',
              }),
            },
            descriptionStyle = {
              transition: 'all 0.3s ease',
              ...(checked && {
                textDecoration: 'line-through',
                textDecorationColor: isSacredTheme
                  ? 'rgba(255, 215, 0, 0.3)'
                  : 'rgba(34, 197, 94, 0.3)',
                opacity: 0.8,
              }),
            }
          return (0, jsx_runtime.jsxs)('div', {
            draggable,
            onDragStart,
            onDragOver,
            onDrop,
            style: containerStyle,
            onMouseEnter: () => setIsHovered(!0),
            onMouseLeave: () => setIsHovered(!1),
            children: [
              !isSacredTheme &&
                outline &&
                checked &&
                (0, jsx_runtime.jsx)('div', {
                  style: {
                    ...computedStyles.accent,
                    ...computedStyles.accentVisible,
                    background:
                      'linear-gradient(180deg, rgb(34, 197, 94) 0%, rgb(74, 222, 128) 100%)',
                  },
                }),
              isSacredTheme &&
                (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                  children: [
                    (0, jsx_runtime.jsx)('div', {
                      style: {
                        ...computedStyles.glyph,
                        ...computedStyles.glyphBottomLeft,
                        fontSize: '32px',
                        bottom: '8px',
                        left: '8px',
                      },
                      children: theme.vR[checked ? 2 : 0],
                    }),
                    checked &&
                      (0, jsx_runtime.jsx)('div', {
                        style: {
                          ...computedStyles.glyph,
                          ...computedStyles.glyphTopRight,
                          fontSize: '12px',
                          top: '8px',
                          right: '8px',
                          display: 'flex',
                          gap: '4px',
                        },
                        children: ['𓏭', '𓊵', '𓁟'].map((glyph, i) =>
                          (0, jsx_runtime.jsx)(
                            'div',
                            {
                              style: {
                                color: 'rgba(255, 215, 0, 0.4)',
                                animationDelay: 0.3 * i + 's',
                                opacity: 0.4 - 0.1 * i,
                              },
                              children: glyph,
                            },
                            i
                          )
                        ),
                      }),
                  ],
                }),
              (0, jsx_runtime.jsx)(Checkbox.A, {
                checked,
                disabled,
                onChange: onCheck,
                styles: {
                  theme: isSacredTheme
                    ? 'sacred'
                    : (null == styles ? void 0 : styles.theme) || 'light',
                },
              }),
              (0, jsx_runtime.jsxs)('div', {
                style: { display: 'flex', flexDirection: 'column', flex: 1 },
                children: [
                  (0, jsx_runtime.jsx)(Typography.A, {
                    text: title,
                    variant: 'merrih5',
                    styles: {
                      ...titleStyle,
                      color: isSacredTheme
                        ? checked
                          ? '#FFD700'
                          : 'rgba(255, 215, 0, 0.9)'
                        : checked
                          ? 'rgb(34, 197, 94)'
                          : computedStyles.title.color,
                      fontFamily: isSacredTheme ? '"Cinzel", serif' : void 0,
                      fontWeight: isSacredTheme ? 600 : void 0,
                      letterSpacing: isSacredTheme ? '0.025em' : void 0,
                      textShadow:
                        isSacredTheme && checked
                          ? '0 0 8px rgba(255, 215, 0, 0.3)'
                          : void 0,
                    },
                  }),
                  (0, jsx_runtime.jsx)(Typography.A, {
                    text: description,
                    variant: 'merriparagraph',
                    styles: {
                      ...descriptionStyle,
                      color: isSacredTheme
                        ? checked
                          ? 'rgba(255, 215, 0, 0.6)'
                          : 'rgba(255, 215, 0, 0.8)'
                        : checked
                          ? 'rgb(107, 114, 128)'
                          : computedStyles.bodyText.color,
                      fontFamily: isSacredTheme
                        ? '"Merriweather", serif'
                        : void 0,
                      lineHeight: isSacredTheme ? 1.6 : void 0,
                    },
                  }),
                ],
              }),
            ],
          })
        }
        TaskCard.displayName = 'TaskCard'
        const task = TaskCard
        TaskCard.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'TaskCard',
          props: {
            title: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Task title',
              defaultValue: { value: "'Task Title'", computed: !1 },
            },
            description: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Task description',
              defaultValue: { value: "'Description'", computed: !1 },
            },
            checked: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'Whether the task is checked/completed',
              defaultValue: { value: 'false', computed: !1 },
            },
            disabled: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'Whether the task is disabled',
              defaultValue: { value: 'false', computed: !1 },
            },
            onCheck: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(checked: boolean) => void',
                signature: {
                  arguments: [{ type: { name: 'boolean' }, name: 'checked' }],
                  return: { name: 'void' },
                },
              },
              description: 'Callback when check state changes',
            },
            height: {
              required: !1,
              tsType: {
                name: 'union',
                raw: 'string | number',
                elements: [{ name: 'string' }, { name: 'number' }],
              },
              description: 'Custom height',
              defaultValue: { value: "'auto'", computed: !1 },
            },
            draggable: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'Whether the card is draggable',
              defaultValue: { value: 'false', computed: !1 },
            },
            onDragStart: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.DragEvent) => void',
                signature: {
                  arguments: [
                    {
                      type: { name: 'ReactDragEvent', raw: 'React.DragEvent' },
                      name: 'event',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: 'Drag event handlers',
            },
            onDragOver: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.DragEvent) => void',
                signature: {
                  arguments: [
                    {
                      type: { name: 'ReactDragEvent', raw: 'React.DragEvent' },
                      name: 'event',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            onDrop: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.DragEvent) => void',
                signature: {
                  arguments: [
                    {
                      type: { name: 'ReactDragEvent', raw: 'React.DragEvent' },
                      name: 'event',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: '',
            },
            styles: {
              required: !1,
              tsType: { name: 'CardStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties',
            },
          },
        }
        var Add = __webpack_require__('./src/components/Icons/Add.tsx'),
          Remove = __webpack_require__('./src/components/Icons/Remove.tsx')
        const ProductCard = ({
          title: _title,
          numDevelopers = 1,
          onAddDeveloper,
          onRemoveDeveloper,
          licenses = 1,
          unitPrice = 180,
          total: _total,
          onBuy,
          onLivePreview,
          featuredescriptions = [],
          releaseDate,
          onContact,
          createdBy,
          styles,
        }) => {
          const [numDevelopersInput, setNumDevelopersInput] = (0,
            react.useState)(numDevelopers.toString()),
            [numLicenses, setNumLicenses] = (0, react.useState)(licenses),
            [addHover, setAddHover] = (0, react.useState)(!1),
            [removeHover, setRemoveHover] = (0, react.useState)(!1),
            [contactHover, setContactHover] = (0, react.useState)(!1),
            [isHovered, setIsHovered] = (0, react.useState)(!1),
            isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            computedStyles = (0, react.useMemo)(
              () => (0, theme.Hu)({ ...styles, variant: 'product' }, isHovered),
              [styles, isHovered]
            ),
            containerStyle = { ...computedStyles.productContainer },
            developerButtonStyle = {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1.5rem',
              height: '1.5rem',
              borderRadius: '0.375rem',
              transition: 'all 0.3s ease',
              color: isSacredTheme ? '#FFD700' : '#4B5563',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            },
            developerButtonHoverStyle = {
              backgroundColor: isSacredTheme
                ? 'rgba(255, 215, 0, 0.1)'
                : '#E5E7EB',
              transform: isSacredTheme ? 'scale(1.1)' : 'none',
            },
            inputStyle = {
              width: '100%',
              border: '1px solid',
              borderRadius: '0.375rem',
              padding: '0.25rem',
              textAlign: 'center',
              backgroundColor: isSacredTheme ? 'rgba(0,0,0,0.8)' : 'white',
              borderColor: isSacredTheme ? 'rgba(255, 215, 0, 0.5)' : '#D1D5DB',
              color: isSacredTheme ? '#FFD700' : 'black',
              fontWeight: isSacredTheme ? 600 : 'normal',
            }
          return (0, jsx_runtime.jsxs)('div', {
            style: containerStyle,
            onMouseEnter: () => setIsHovered(!0),
            onMouseLeave: () => setIsHovered(!1),
            children: [
              isSacredTheme &&
                (0, jsx_runtime.jsx)('div', {
                  style: {
                    ...computedStyles.glyph,
                    ...computedStyles.glyphTopRight,
                    fontSize: '3rem',
                    animation: 'product-card-rotate-glyph 15s linear infinite',
                    zIndex: 0,
                  },
                  children: theme.vR[4],
                }),
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  marginBottom: '0.5rem',
                  position: 'relative',
                  zIndex: 10,
                },
                children: [
                  (0, jsx_runtime.jsx)(Typography.A, {
                    text: 'Number of developers',
                    variant: 'merriparagraph',
                    styles: {
                      color: isSacredTheme
                        ? 'rgba(255, 215, 0, 0.9)'
                        : computedStyles.bodyText.color,
                      fontWeight: isSacredTheme ? 600 : void 0,
                      letterSpacing: isSacredTheme ? '0.025em' : void 0,
                    },
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: '0.25rem',
                    },
                    children: [
                      (0, jsx_runtime.jsx)('button', {
                        onClick: () => {
                          const newNumDevelopers =
                            parseInt(numDevelopersInput, 10) - 1
                          newNumDevelopers >= 1 &&
                            (setNumDevelopersInput(newNumDevelopers.toString()),
                            setNumLicenses(newNumDevelopers),
                            null == onRemoveDeveloper || onRemoveDeveloper())
                        },
                        style: {
                          ...developerButtonStyle,
                          ...(removeHover && developerButtonHoverStyle),
                        },
                        onMouseEnter: () => setRemoveHover(!0),
                        onMouseLeave: () => setRemoveHover(!1),
                        children: (0, jsx_runtime.jsx)(Remove.A, {
                          style: { width: '1rem', height: '1rem' },
                        }),
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: { margin: '0 0.25rem', width: '3rem' },
                        children: (0, jsx_runtime.jsx)('input', {
                          type: 'text',
                          value: numDevelopersInput,
                          onChange: event => {
                            const value = event.target.value
                            ;(setNumDevelopersInput(value),
                              setNumLicenses(parseInt(value, 10)))
                          },
                          style: inputStyle,
                        }),
                      }),
                      (0, jsx_runtime.jsx)('button', {
                        onClick: () => {
                          const newNumDevelopers =
                            parseInt(numDevelopersInput, 10) + 1
                          ;(setNumDevelopersInput(newNumDevelopers.toString()),
                            setNumLicenses(newNumDevelopers),
                            null == onAddDeveloper || onAddDeveloper())
                        },
                        style: {
                          ...developerButtonStyle,
                          ...(addHover && developerButtonHoverStyle),
                        },
                        onMouseEnter: () => setAddHover(!0),
                        onMouseLeave: () => setAddHover(!1),
                        children: (0, jsx_runtime.jsx)(Add.A, {
                          style: { width: '1rem', height: '1rem' },
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  marginBottom: '0.5rem',
                  position: 'relative',
                  zIndex: 10,
                },
                children: [
                  (0, jsx_runtime.jsx)('div', {
                    children: (0, jsx_runtime.jsx)(Typography.A, {
                      text: `Licenses: ${numLicenses}`,
                      variant: 'merriparagraph',
                      styles: {
                        color: isSacredTheme
                          ? 'rgba(255, 215, 0, 0.8)'
                          : computedStyles.bodyText.color,
                      },
                    }),
                  }),
                  (0, jsx_runtime.jsx)('div', {
                    children: (0, jsx_runtime.jsx)(Typography.A, {
                      text: `Unit price: $ ${unitPrice}`,
                      variant: 'merriparagraph',
                      styles: {
                        color: isSacredTheme
                          ? 'rgba(255, 215, 0, 0.8)'
                          : computedStyles.bodyText.color,
                      },
                    }),
                  }),
                  (0, jsx_runtime.jsx)('div', {
                    style: { fontWeight: 'bold' },
                    children: (0, jsx_runtime.jsx)(Typography.A, {
                      text: `Total: $ ${(unitPrice * numLicenses).toFixed(2)}`,
                      variant: 'merriparagraph',
                      styles: {
                        color: isSacredTheme
                          ? '#FFD700'
                          : computedStyles.price.color,
                        fontSize: isSacredTheme ? '1.125rem' : void 0,
                        fontWeight: isSacredTheme ? 'bold' : void 0,
                        textShadow: isSacredTheme
                          ? '0 0 5px rgba(255,215,0,0.5)'
                          : void 0,
                      },
                    }),
                  }),
                ],
              }),
              (0, jsx_runtime.jsxs)('div', {
                style: {
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  position: 'relative',
                  zIndex: 10,
                  gap: '0.25rem',
                },
                children: [
                  (0, jsx_runtime.jsx)(Button.A, {
                    text: 'Buy now',
                    styles: {
                      theme: isSacredTheme
                        ? 'sacred'
                        : (null == styles ? void 0 : styles.theme) || 'light',
                      backgroundColor: isSacredTheme
                        ? 'rgba(0,0,0,0.9)'
                        : void 0,
                      color: isSacredTheme ? '#FFD700' : void 0,
                    },
                    onClick: onBuy,
                  }),
                  (0, jsx_runtime.jsx)(Button.A, {
                    text: 'Live Preview',
                    styles: {
                      theme: isSacredTheme
                        ? 'sacred'
                        : (null == styles ? void 0 : styles.theme) || 'light',
                      backgroundColor: isSacredTheme
                        ? 'rgba(0,0,0,0.9)'
                        : void 0,
                      color: isSacredTheme ? '#FFD700' : void 0,
                    },
                    onClick: onLivePreview,
                  }),
                ],
              }),
              (0, jsx_runtime.jsx)('div', {
                style: { position: 'relative', zIndex: 10 },
                children: featuredescriptions.map((feature, index) =>
                  (0, jsx_runtime.jsx)(
                    'div',
                    {
                      children: (0, jsx_runtime.jsx)(Typography.A, {
                        text: `✓ ${feature}`,
                        variant: 'merriparagraph',
                        styles: {
                          color: isSacredTheme
                            ? 'rgba(255, 215, 0, 0.8)'
                            : computedStyles.bodyText.color,
                        },
                      }),
                    },
                    index
                  )
                ),
              }),
              releaseDate &&
                (0, jsx_runtime.jsx)('div', {
                  style: {
                    marginTop: '0.5rem',
                    position: 'relative',
                    zIndex: 10,
                  },
                  children: (0, jsx_runtime.jsx)(Typography.A, {
                    text: `First release: ${releaseDate}`,
                    variant: 'merriparagraph',
                    styles: {
                      color: isSacredTheme
                        ? 'rgba(255, 215, 0, 0.7)'
                        : computedStyles.bodyText.color,
                    },
                  }),
                }),
              onContact &&
                (0, jsx_runtime.jsx)('div', {
                  onClick: onContact,
                  style: {
                    marginTop: '0.5rem',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 10,
                  },
                  onMouseEnter: () => setContactHover(!0),
                  onMouseLeave: () => setContactHover(!1),
                  children: (0, jsx_runtime.jsx)(Typography.A, {
                    text: 'Questions? Contact us',
                    variant: 'merriparagraph',
                    styles: {
                      color:
                        contactHover && isSacredTheme
                          ? '#FBBF24'
                          : isSacredTheme
                            ? 'rgba(255, 215, 0, 0.8)'
                            : computedStyles.bodyText.color,
                      textShadow:
                        contactHover && isSacredTheme
                          ? '0 0 5px rgba(255,215,0,0.5)'
                          : void 0,
                    },
                  }),
                }),
              createdBy &&
                (0, jsx_runtime.jsx)('div', {
                  style: {
                    marginTop: '0.5rem',
                    position: 'relative',
                    zIndex: 10,
                  },
                  children: (0, jsx_runtime.jsx)(Typography.A, {
                    text: `Created by ${createdBy}`,
                    variant: 'merriparagraph',
                    styles: {
                      color: isSacredTheme
                        ? 'rgba(255, 215, 0, 0.7)'
                        : computedStyles.bodyText.color,
                    },
                  }),
                }),
            ],
          })
        }
        ProductCard.displayName = 'ProductCard'
        const product = ProductCard
        ProductCard.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ProductCard',
          props: {
            title: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Product title',
            },
            numDevelopers: {
              required: !1,
              tsType: { name: 'number' },
              description: 'Number of developers',
              defaultValue: { value: '1', computed: !1 },
            },
            onAddDeveloper: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: 'Callback to add developer',
            },
            onRemoveDeveloper: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: 'Callback to remove developer',
            },
            licenses: {
              required: !1,
              tsType: { name: 'number' },
              description: 'Number of licenses',
              defaultValue: { value: '1', computed: !1 },
            },
            unitPrice: {
              required: !1,
              tsType: { name: 'number' },
              description: 'Unit price',
              defaultValue: { value: '180', computed: !1 },
            },
            total: {
              required: !1,
              tsType: { name: 'number' },
              description: 'Total price',
            },
            onBuy: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: 'Buy button callback',
            },
            onLivePreview: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: 'Live preview callback',
            },
            featuredescriptions: {
              required: !1,
              tsType: {
                name: 'Array',
                elements: [{ name: 'string' }],
                raw: 'string[]',
              },
              description: 'Feature descriptions',
              defaultValue: { value: '[]', computed: !1 },
            },
            releaseDate: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Release date',
            },
            onContact: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: 'Contact callback',
            },
            createdBy: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Created by',
            },
            styles: {
              required: !1,
              tsType: { name: 'CardStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties',
            },
          },
        }
        const InventoryCard = ({
          title,
          image,
          license,
          developmentUse,
          productionUse,
          updates,
          support,
          price,
          quantity,
          onRemove,
          styles,
        }) => {
          const [removeHover, setRemoveHover] = (0, react.useState)(!1),
            [isHovered, setIsHovered] = (0, react.useState)(!1),
            isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            computedStyles = (0, react.useMemo)(
              () =>
                (0, theme.Hu)({ ...styles, variant: 'inventory' }, isHovered),
              [styles, isHovered]
            ),
            inventoryStyles = {
              container: {
                ...computedStyles.inventoryContainer,
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                overflow: 'hidden',
                ...(isSacredTheme && {
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  backgroundColor: 'black',
                  animation: 'inventory-card-border-glow 2s infinite alternate',
                }),
              },
              shimmer: {
                position: 'absolute',
                inset: '0px',
                backgroundImage:
                  'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.05), transparent)',
                animation: 'inventory-card-shimmer 3s infinite',
                pointerEvents: 'none',
                zIndex: 10,
              },
              imageContainer: {
                width: '200px',
                minHeight: '100%',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                flexShrink: 0,
                position: 'relative',
                zIndex: 20,
              },
              content: {
                padding: '1rem',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                zIndex: 20,
              },
              header: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              },
              details: { marginTop: 'auto', paddingBottom: '0.625rem' },
              detailItem: { marginTop: '0.25rem' },
              removeLink: { marginTop: 'auto', alignSelf: 'flex-end' },
            }
          return (0, jsx_runtime.jsxs)('div', {
            style: inventoryStyles.container,
            onMouseEnter: () => setIsHovered(!0),
            onMouseLeave: () => setIsHovered(!1),
            children: [
              isSacredTheme &&
                (0, jsx_runtime.jsx)('div', { style: inventoryStyles.shimmer }),
              (0, jsx_runtime.jsx)('div', {
                style: {
                  ...inventoryStyles.imageContainer,
                  backgroundImage: image ? `url(${image})` : void 0,
                },
              }),
              (0, jsx_runtime.jsxs)('div', {
                style: inventoryStyles.content,
                children: [
                  isSacredTheme &&
                    (0, jsx_runtime.jsx)('div', {
                      style: {
                        ...computedStyles.glyph,
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        color: 'rgba(255, 215, 0, 0.2)',
                        fontSize: '2.25rem',
                        animation: 'inventory-card-pulse 3s infinite',
                      },
                      children: theme.vR[2],
                    }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: inventoryStyles.header,
                    children: [
                      title &&
                        (0, jsx_runtime.jsx)(Typography.A, {
                          text: title,
                          variant: 'merrih5',
                          styles: {
                            color: isSacredTheme
                              ? '#FFD700'
                              : computedStyles.title.color,
                            fontFamily: isSacredTheme
                              ? 'Cinzel, serif'
                              : void 0,
                            fontWeight: isSacredTheme ? 600 : void 0,
                            letterSpacing: isSacredTheme ? '0.05em' : void 0,
                            textShadow: isSacredTheme
                              ? '0 0 5px rgba(255, 215, 0, 0.5)'
                              : void 0,
                          },
                        }),
                      (0, jsx_runtime.jsx)('div', {
                        style: { textAlign: 'right' },
                        children: (0, jsx_runtime.jsx)(Typography.A, {
                          text: `${quantity} x ${price}`,
                          variant: 'merriparagraph',
                          styles: {
                            color: isSacredTheme
                              ? 'rgba(255, 215, 0, 0.9)'
                              : computedStyles.price.color,
                            fontWeight: isSacredTheme ? 600 : void 0,
                            textShadow: isSacredTheme
                              ? '0 0 3px rgba(255,215,0,0.5)'
                              : void 0,
                          },
                        }),
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: inventoryStyles.details,
                    children: [
                      (0, jsx_runtime.jsx)('div', {
                        style: inventoryStyles.detailItem,
                        children: (0, jsx_runtime.jsx)(Typography.A, {
                          text: `License: ${license || ''}`,
                          variant: 'merriparagraph',
                          styles: {
                            color: isSacredTheme
                              ? 'rgba(255, 215, 0, 0.8)'
                              : computedStyles.bodyText.color,
                          },
                        }),
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: inventoryStyles.detailItem,
                        children: (0, jsx_runtime.jsx)(Typography.A, {
                          text: `Development use: ${developmentUse || ''}`,
                          variant: 'merriparagraph',
                          styles: {
                            color: isSacredTheme
                              ? 'rgba(255, 215, 0, 0.8)'
                              : computedStyles.bodyText.color,
                          },
                        }),
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: inventoryStyles.detailItem,
                        children: (0, jsx_runtime.jsx)(Typography.A, {
                          text: `Production use: ${productionUse || ''}`,
                          variant: 'merriparagraph',
                          styles: {
                            color: isSacredTheme
                              ? 'rgba(255, 215, 0, 0.8)'
                              : computedStyles.bodyText.color,
                          },
                        }),
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: inventoryStyles.detailItem,
                        children: (0, jsx_runtime.jsx)(Typography.A, {
                          text: `Updates: ${updates || ''}`,
                          variant: 'merriparagraph',
                          styles: {
                            color: isSacredTheme
                              ? 'rgba(255, 215, 0, 0.8)'
                              : computedStyles.bodyText.color,
                          },
                        }),
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: inventoryStyles.detailItem,
                        children: (0, jsx_runtime.jsx)(Typography.A, {
                          text: `Support: ${support || ''}`,
                          variant: 'merriparagraph',
                          styles: {
                            color: isSacredTheme
                              ? 'rgba(255, 215, 0, 0.8)'
                              : computedStyles.bodyText.color,
                          },
                        }),
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsx)('div', {
                    style: inventoryStyles.removeLink,
                    children: (0, jsx_runtime.jsx)(link_default(), {
                      href: '#',
                      passHref: !0,
                      onClick: e => {
                        ;(e.preventDefault(), null == onRemove || onRemove())
                      },
                      children: (0, jsx_runtime.jsx)('span', {
                        onMouseEnter: () => setRemoveHover(!0),
                        onMouseLeave: () => setRemoveHover(!1),
                        style: {
                          textDecoration: isSacredTheme ? 'underline' : void 0,
                        },
                        children: (0, jsx_runtime.jsx)(Typography.A, {
                          text: 'Remove',
                          variant: 'merriparagraph',
                          styles: {
                            color: removeHover
                              ? isSacredTheme
                                ? '#FBBF24'
                                : computedStyles.title.color
                              : isSacredTheme
                                ? '#FFD700'
                                : computedStyles.bodyText.color,
                            textShadow:
                              removeHover && isSacredTheme
                                ? '0 0 5px rgba(255,215,0,0.5)'
                                : void 0,
                          },
                        }),
                      }),
                    }),
                  }),
                ],
              }),
            ],
          })
        }
        InventoryCard.displayName = 'InventoryCard'
        const inventory = InventoryCard
        InventoryCard.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'InventoryCard',
          props: {
            title: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Item title',
            },
            image: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Item image URL',
            },
            license: {
              required: !1,
              tsType: { name: 'string' },
              description: 'License type',
            },
            developmentUse: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Development use description',
            },
            productionUse: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Production use description',
            },
            updates: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Updates description',
            },
            support: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Support description',
            },
            price: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Price per item',
            },
            quantity: {
              required: !1,
              tsType: { name: 'number' },
              description: 'Quantity',
            },
            onRemove: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: 'Remove item callback',
            },
            styles: {
              required: !1,
              tsType: { name: 'CardStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties',
            },
          },
        }
        var Switch = __webpack_require__('./src/components/Switch/index.tsx')
        const ProductSummaryCard = ({
          title,
          body,
          annualPrice,
          monthlyPrice,
          button1Props,
          button2Props,
          styles,
        }) => {
          const [isAnnualPricing, setIsAnnualPricing] = (0, react.useState)(!0),
            [isHovered, setIsHovered] = (0, react.useState)(!1),
            isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            computedStyles = (0, react.useMemo)(
              () =>
                (0, theme.Hu)(
                  { ...styles, variant: 'productsummary' },
                  isHovered
                ),
              [styles, isHovered]
            ),
            productSummaryStyles = {
              container: {
                ...computedStyles.container,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                overflow: 'hidden',
                ...(isSacredTheme && {
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  backgroundColor: 'black',
                  boxShadow: '0 0 1.5rem rgba(255, 215, 0, 0.2)',
                  backgroundImage:
                    'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.05), transparent)',
                }),
              },
              header: {
                width: '100%',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                zIndex: 10,
                ...(isSacredTheme
                  ? {
                      borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                      backgroundImage:
                        'linear-gradient(to right, rgba(255, 215, 0, 0.05), transparent, rgba(255, 215, 0, 0.05))',
                    }
                  : { borderBottom: '1px solid #E5E7EB' }),
              },
              body: { padding: '1rem', position: 'relative', zIndex: 10 },
              footer: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                marginTop: 'auto',
                position: 'relative',
                zIndex: 10,
              },
              pricingToggle: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
            }
          return (0, jsx_runtime.jsxs)('div', {
            style: productSummaryStyles.container,
            onMouseEnter: () => setIsHovered(!0),
            onMouseLeave: () => setIsHovered(!1),
            children: [
              isSacredTheme &&
                (0, jsx_runtime.jsx)('div', {
                  style: {
                    ...computedStyles.glyph,
                    position: 'absolute',
                    bottom: '1rem',
                    left: '1rem',
                    color: 'rgba(255, 215, 0, 0.15)',
                    fontSize: '4.5rem',
                    animation: 'product-summary-float 5s infinite alternate',
                    zIndex: 0,
                  },
                  children: theme.vR[1],
                }),
              (0, jsx_runtime.jsxs)('div', {
                style: productSummaryStyles.header,
                children: [
                  (0, jsx_runtime.jsx)(Typography.A, {
                    text: title,
                    variant: 'merrih5',
                    styles: {
                      color: isSacredTheme
                        ? '#FFD700'
                        : computedStyles.title.color,
                      fontFamily: isSacredTheme ? 'Cinzel, serif' : void 0,
                      fontWeight: isSacredTheme ? 600 : void 0,
                      letterSpacing: isSacredTheme ? '0.05em' : void 0,
                      textShadow: isSacredTheme
                        ? '0 0 5px rgba(255, 215, 0, 0.5)'
                        : void 0,
                    },
                  }),
                  (0, jsx_runtime.jsx)(Typography.A, {
                    text: isAnnualPricing
                      ? `$${annualPrice}`
                      : `$${monthlyPrice}`,
                    variant: 'merrih6',
                    styles: {
                      color: isSacredTheme
                        ? '#FFD700'
                        : computedStyles.price.color,
                      fontWeight: isSacredTheme ? 'bold' : void 0,
                      textShadow: isSacredTheme
                        ? '0 0 5px rgba(255,215,0,0.5)'
                        : void 0,
                    },
                  }),
                ],
              }),
              body &&
                (0, jsx_runtime.jsx)('div', {
                  style: productSummaryStyles.body,
                  children: (0, jsx_runtime.jsx)(Typography.A, {
                    text: body,
                    variant: 'merriparagraph',
                    styles: {
                      color: isSacredTheme
                        ? 'rgba(255, 215, 0, 0.8)'
                        : computedStyles.bodyText.color,
                      letterSpacing: isSacredTheme ? '0.025em' : void 0,
                    },
                  }),
                }),
              (0, jsx_runtime.jsxs)('div', {
                style: productSummaryStyles.footer,
                children: [
                  button1Props &&
                    (0, jsx_runtime.jsx)(Button.A, {
                      ...button1Props,
                      styles: {
                        ...button1Props.styles,
                        theme: isSacredTheme
                          ? 'sacred'
                          : (null == styles ? void 0 : styles.theme) || 'light',
                      },
                    }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: productSummaryStyles.pricingToggle,
                    children: [
                      (0, jsx_runtime.jsx)(Typography.A, {
                        text: 'Monthly',
                        variant: 'merriparagraph',
                        styles: {
                          color: isAnnualPricing
                            ? isSacredTheme
                              ? 'rgba(255, 215, 0, 0.7)'
                              : computedStyles.toggleLabel.color
                            : isSacredTheme
                              ? '#FFD700'
                              : computedStyles.activeToggleLabel.color,
                          textShadow:
                            !isAnnualPricing && isSacredTheme
                              ? '0 0 3px rgba(255,215,0,0.5)'
                              : void 0,
                          marginRight: '0.5rem',
                        },
                      }),
                      (0, jsx_runtime.jsx)(Switch.A, {
                        checked: isAnnualPricing,
                        onChange: () => {
                          setIsAnnualPricing(!isAnnualPricing)
                        },
                        styles: {
                          theme: isSacredTheme
                            ? 'sacred'
                            : (null == styles ? void 0 : styles.theme) ||
                              'light',
                        },
                      }),
                      (0, jsx_runtime.jsx)(Typography.A, {
                        text: 'Annual',
                        variant: 'merriparagraph',
                        styles: {
                          color: isAnnualPricing
                            ? isSacredTheme
                              ? '#FFD700'
                              : computedStyles.activeToggleLabel.color
                            : isSacredTheme
                              ? 'rgba(255, 215, 0, 0.7)'
                              : computedStyles.toggleLabel.color,
                          textShadow:
                            isAnnualPricing && isSacredTheme
                              ? '0 0 3px rgba(255,215,0,0.5)'
                              : void 0,
                          marginLeft: '0.5rem',
                        },
                      }),
                    ],
                  }),
                  button2Props &&
                    (0, jsx_runtime.jsx)(Button.A, {
                      ...button2Props,
                      styles: {
                        ...button2Props.styles,
                        theme: isSacredTheme
                          ? 'sacred'
                          : (null == styles ? void 0 : styles.theme) || 'light',
                      },
                    }),
                ],
              }),
            ],
          })
        }
        ProductSummaryCard.displayName = 'ProductSummaryCard'
        const productsummary = ProductSummaryCard
        ProductSummaryCard.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'ProductSummaryCard',
          props: {
            title: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Product title',
            },
            body: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Product description',
            },
            annualPrice: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Annual price',
            },
            monthlyPrice: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Monthly price',
            },
            button1Props: {
              required: !1,
              tsType: { name: 'ButtonProps' },
              description: 'First button props',
            },
            button2Props: {
              required: !1,
              tsType: { name: 'ButtonProps' },
              description: 'Second button props',
            },
            styles: {
              required: !1,
              tsType: { name: 'CardStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties',
            },
          },
        }
        const SimplePricingSummary = ({
          subtotal = 'USD 180.00',
          total = 'USD 180.00',
          proceedText = 'Proceed to checkout',
          taxText = 'Taxes may apply before placing an order.',
          discountText = 'Coupons and discounts will apply on the next step.',
          onProceed,
          styles,
        }) => {
          const [isHovered, setIsHovered] = (0, react.useState)(!1),
            isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            computedStyles = (0, react.useMemo)(
              () =>
                (0, theme.Hu)(
                  { ...styles, variant: 'simplepricingsummary' },
                  isHovered
                ),
              [styles, isHovered]
            ),
            pricingSummaryStyles = {
              container: {
                ...computedStyles.pricingSummary,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                padding: '1rem',
                overflow: 'hidden',
                ...(isSacredTheme && {
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  backgroundColor: 'black',
                  animation:
                    'simple-pricing-summary-glow 2s infinite alternate',
                  backgroundImage:
                    'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.05), transparent)',
                }),
              },
              summaryContainer: { display: 'flex', flexDirection: 'column' },
              subtotalRow: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
              totalSection: {
                marginTop: '0.5rem',
                paddingTop: '0.5rem',
                ...(isSacredTheme
                  ? {
                      borderTop: '1px solid rgba(255, 215, 0, 0.3)',
                      backgroundImage:
                        'linear-gradient(to right, rgba(255, 215, 0, 0.05), transparent, rgba(255, 215, 0, 0.05))',
                    }
                  : { borderTop: '1px solid #E5E7EB' }),
              },
              totalRow: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
              buttonContainer: { marginTop: '1rem' },
            }
          return (0, jsx_runtime.jsxs)('div', {
            style: pricingSummaryStyles.container,
            onMouseEnter: () => setIsHovered(!0),
            onMouseLeave: () => setIsHovered(!1),
            children: [
              isSacredTheme &&
                (0, jsx_runtime.jsx)('div', {
                  style: {
                    ...computedStyles.glyph,
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    color: 'rgba(255, 215, 0, 0.2)',
                    fontSize: '2.25rem',
                    animation:
                      'simple-pricing-summary-glyph-rotate 15s linear infinite',
                  },
                  children: theme.vR[2],
                }),
              (0, jsx_runtime.jsxs)('div', {
                style: pricingSummaryStyles.summaryContainer,
                children: [
                  (0, jsx_runtime.jsxs)('div', {
                    style: pricingSummaryStyles.subtotalRow,
                    children: [
                      (0, jsx_runtime.jsx)(Typography.A, {
                        text: 'Subtotal',
                        variant: 'merriparagraph',
                        styles: {
                          color: isSacredTheme
                            ? 'rgba(255, 215, 0, 0.9)'
                            : computedStyles.bodyText.color,
                        },
                      }),
                      (0, jsx_runtime.jsx)(Typography.A, {
                        text: subtotal,
                        variant: 'merriparagraph',
                        styles: {
                          color: isSacredTheme
                            ? 'rgba(255, 215, 0, 0.8)'
                            : computedStyles.bodyText.color,
                        },
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsx)('div', {
                    style: pricingSummaryStyles.totalSection,
                    children: (0, jsx_runtime.jsxs)('div', {
                      style: pricingSummaryStyles.totalRow,
                      children: [
                        (0, jsx_runtime.jsx)(Typography.A, {
                          text: 'TOTAL',
                          variant: 'merrih5',
                          styles: {
                            color: isSacredTheme
                              ? '#FFD700'
                              : computedStyles.title.color,
                            fontFamily: isSacredTheme
                              ? 'Cinzel, serif'
                              : void 0,
                            fontWeight: isSacredTheme ? 'bold' : void 0,
                            letterSpacing: isSacredTheme ? '0.1em' : void 0,
                            textShadow: isSacredTheme
                              ? '0 0 5px rgba(255,215,0,0.5)'
                              : void 0,
                          },
                        }),
                        (0, jsx_runtime.jsx)(Typography.A, {
                          text: total,
                          variant: 'merrih5',
                          styles: {
                            color: isSacredTheme
                              ? '#FFD700'
                              : computedStyles.price.color,
                            fontFamily: isSacredTheme
                              ? 'Cinzel, serif'
                              : void 0,
                            fontWeight: isSacredTheme ? 'bold' : void 0,
                            textShadow: isSacredTheme
                              ? '0 0 5px rgba(255,215,0,0.5)'
                              : void 0,
                          },
                        }),
                      ],
                    }),
                  }),
                ],
              }),
              (0, jsx_runtime.jsx)('div', {
                style: pricingSummaryStyles.buttonContainer,
                children: (0, jsx_runtime.jsx)(Button.A, {
                  text: proceedText,
                  styles: {
                    backgroundColor: isSacredTheme ? 'rgba(0,0,0,0.9)' : void 0,
                    color: isSacredTheme ? '#FFD700' : void 0,
                    width: '100%',
                    theme: isSacredTheme
                      ? 'sacred'
                      : (null == styles ? void 0 : styles.theme) || 'light',
                  },
                  onClick: onProceed,
                }),
              }),
              (0, jsx_runtime.jsx)(Typography.A, {
                text: taxText,
                variant: 'merriparagraph',
                styles: {
                  color: isSacredTheme
                    ? 'rgba(255, 215, 0, 0.6)'
                    : computedStyles.bodyText.color,
                  marginTop: '0.5rem',
                  fontSize: '0.75rem',
                },
              }),
              (0, jsx_runtime.jsx)(Typography.A, {
                text: discountText,
                variant: 'merriparagraph',
                styles: {
                  color: isSacredTheme
                    ? 'rgba(255, 215, 0, 0.6)'
                    : computedStyles.bodyText.color,
                  marginTop: '0.25rem',
                  fontSize: '0.75rem',
                },
              }),
            ],
          })
        }
        SimplePricingSummary.displayName = 'SimplePricingSummary'
        const simplepricingsummary = SimplePricingSummary
        SimplePricingSummary.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'SimplePricingSummary',
          props: {
            subtotal: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Subtotal amount',
              defaultValue: { value: "'USD 180.00'", computed: !1 },
            },
            total: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Total amount',
              defaultValue: { value: "'USD 180.00'", computed: !1 },
            },
            proceedText: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Proceed button text',
              defaultValue: { value: "'Proceed to checkout'", computed: !1 },
            },
            taxText: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Tax information text',
              defaultValue: {
                value: "'Taxes may apply before placing an order.'",
                computed: !1,
              },
            },
            discountText: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Discount information text',
              defaultValue: {
                value: "'Coupons and discounts will apply on the next step.'",
                computed: !1,
              },
            },
            onProceed: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: 'Proceed callback',
            },
            styles: {
              required: !1,
              tsType: { name: 'CardStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties',
            },
          },
        }
        const DetailedPricingSummary = ({
          product = 'Goobs Repo Unlimited × 1',
          vendor = 'Technologies Unlimited',
          vendorPrice = '$180.00',
          subtotal = '$180.00',
          vat = '$0.00',
          total = '$180.00',
          proceedText = 'Proceed to checkout',
          onProceed,
          styles,
        }) => {
          const [isHovered, setIsHovered] = (0, react.useState)(!1),
            isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            computedStyles = (0, react.useMemo)(
              () =>
                (0, theme.Hu)(
                  { ...styles, variant: 'detailedpricingsummary' },
                  isHovered
                ),
              [styles, isHovered]
            ),
            detailedPricingStyles = {
              container: {
                ...computedStyles.pricingSummary,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                padding: '1rem',
                overflow: 'hidden',
                ...(isSacredTheme && {
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  backgroundColor: 'black',
                  animation:
                    'detailed-pricing-summary-glow 2s infinite alternate',
                  backgroundImage:
                    'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.05), transparent)',
                }),
              },
              summaryContainer: { display: 'flex', flexDirection: 'column' },
              productDescription: { marginTop: '0.5rem' },
              vendorSection: { marginTop: '1rem' },
              vendorRow: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
              vendorPrice: {
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              },
              subtotalSection: { marginTop: '1rem' },
              vatSection: { marginTop: '0.5rem' },
              totalSection: {
                marginTop: '0.5rem',
                paddingTop: '0.5rem',
                ...(isSacredTheme
                  ? {
                      borderTop: '1px solid rgba(255, 215, 0, 0.3)',
                      backgroundImage:
                        'linear-gradient(to right, rgba(255, 215, 0, 0.05), transparent, rgba(255, 215, 0, 0.05))',
                    }
                  : { borderTop: '1px solid #E5E7EB' }),
              },
              totalRow: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
              buttonContainer: { marginTop: '1rem' },
            }
          return (0, jsx_runtime.jsxs)('div', {
            style: detailedPricingStyles.container,
            onMouseEnter: () => setIsHovered(!0),
            onMouseLeave: () => setIsHovered(!1),
            children: [
              isSacredTheme &&
                (0, jsx_runtime.jsx)('div', {
                  style: {
                    ...computedStyles.glyph,
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    color: 'rgba(255, 215, 0, 0.2)',
                    fontSize: '1.5rem',
                    animation:
                      'detailed-pricing-summary-float 5s infinite alternate',
                  },
                  children: theme.vR[0],
                }),
              (0, jsx_runtime.jsxs)('div', {
                style: detailedPricingStyles.summaryContainer,
                children: [
                  (0, jsx_runtime.jsx)(Typography.A, {
                    text: 'Product',
                    variant: 'merriparagraph',
                    styles: {
                      color: isSacredTheme
                        ? '#FFD700'
                        : computedStyles.title.color,
                      fontFamily: isSacredTheme ? 'Cinzel, serif' : void 0,
                      fontWeight: isSacredTheme ? 600 : void 0,
                      letterSpacing: isSacredTheme ? '0.05em' : void 0,
                      textShadow: isSacredTheme
                        ? '0 0 5px rgba(255,215,0,0.5)'
                        : void 0,
                    },
                  }),
                  (0, jsx_runtime.jsx)(Typography.A, {
                    text: product,
                    variant: 'merriparagraph',
                    styles: {
                      color: isSacredTheme
                        ? 'rgba(255, 215, 0, 0.8)'
                        : computedStyles.bodyText.color,
                      marginTop: '0.5rem',
                    },
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: detailedPricingStyles.vendorSection,
                    children: [
                      (0, jsx_runtime.jsxs)('div', {
                        style: detailedPricingStyles.vendorRow,
                        children: [
                          (0, jsx_runtime.jsx)(Typography.A, {
                            text: 'Vendor:',
                            variant: 'merriparagraph',
                            styles: {
                              color: isSacredTheme
                                ? 'rgba(255, 215, 0, 0.9)'
                                : computedStyles.bodyText.color,
                            },
                          }),
                          (0, jsx_runtime.jsx)(Typography.A, {
                            text: vendor,
                            variant: 'merriparagraph',
                            styles: {
                              color: isSacredTheme
                                ? 'rgba(255, 215, 0, 0.8)'
                                : computedStyles.bodyText.color,
                            },
                          }),
                        ],
                      }),
                      (0, jsx_runtime.jsx)('div', {
                        style: detailedPricingStyles.vendorPrice,
                        children: (0, jsx_runtime.jsx)(Typography.A, {
                          text: vendorPrice,
                          variant: 'merriparagraph',
                          styles: {
                            color: isSacredTheme
                              ? '#FFD700'
                              : computedStyles.price.color,
                            fontWeight: isSacredTheme ? 600 : void 0,
                            textShadow: isSacredTheme
                              ? '0 0 3px rgba(255,215,0,0.5)'
                              : void 0,
                          },
                        }),
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: detailedPricingStyles.subtotalSection,
                    children: [
                      (0, jsx_runtime.jsx)(Typography.A, {
                        text: 'Subtotal',
                        variant: 'merriparagraph',
                        styles: {
                          color: isSacredTheme
                            ? 'rgba(255, 215, 0, 0.9)'
                            : computedStyles.bodyText.color,
                        },
                      }),
                      (0, jsx_runtime.jsx)(Typography.A, {
                        text: subtotal,
                        variant: 'merriparagraph',
                        styles: {
                          color: isSacredTheme
                            ? 'rgba(255, 215, 0, 0.8)'
                            : computedStyles.bodyText.color,
                          textAlign: 'right',
                        },
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsxs)('div', {
                    style: detailedPricingStyles.vatSection,
                    children: [
                      (0, jsx_runtime.jsx)(Typography.A, {
                        text: 'VAT',
                        variant: 'merriparagraph',
                        styles: {
                          color: isSacredTheme
                            ? 'rgba(255, 215, 0, 0.9)'
                            : computedStyles.bodyText.color,
                        },
                      }),
                      (0, jsx_runtime.jsx)(Typography.A, {
                        text: vat,
                        variant: 'merriparagraph',
                        styles: {
                          color: isSacredTheme
                            ? 'rgba(255, 215, 0, 0.8)'
                            : computedStyles.bodyText.color,
                          textAlign: 'right',
                        },
                      }),
                    ],
                  }),
                  (0, jsx_runtime.jsx)('div', {
                    style: detailedPricingStyles.totalSection,
                    children: (0, jsx_runtime.jsxs)('div', {
                      style: detailedPricingStyles.totalRow,
                      children: [
                        (0, jsx_runtime.jsx)(Typography.A, {
                          text: 'Total',
                          variant: 'merrih5',
                          styles: {
                            color: isSacredTheme
                              ? '#FFD700'
                              : computedStyles.title.color,
                            fontFamily: isSacredTheme
                              ? 'Cinzel, serif'
                              : void 0,
                            fontWeight: isSacredTheme ? 'bold' : void 0,
                            letterSpacing: isSacredTheme ? '0.1em' : void 0,
                            textShadow: isSacredTheme
                              ? '0 0 5px rgba(255,215,0,0.5)'
                              : void 0,
                          },
                        }),
                        (0, jsx_runtime.jsx)(Typography.A, {
                          text: total,
                          variant: 'merrih5',
                          styles: {
                            color: isSacredTheme
                              ? '#FFD700'
                              : computedStyles.price.color,
                            fontFamily: isSacredTheme
                              ? 'Cinzel, serif'
                              : void 0,
                            fontWeight: isSacredTheme ? 'bold' : void 0,
                            letterSpacing: isSacredTheme ? '0.1em' : void 0,
                            textShadow: isSacredTheme
                              ? '0 0 5px rgba(255,215,0,0.5)'
                              : void 0,
                          },
                        }),
                      ],
                    }),
                  }),
                ],
              }),
              (0, jsx_runtime.jsx)('div', {
                style: detailedPricingStyles.buttonContainer,
                children: (0, jsx_runtime.jsx)(Button.A, {
                  text: proceedText,
                  styles: {
                    theme: isSacredTheme
                      ? 'sacred'
                      : (null == styles ? void 0 : styles.theme) || 'light',
                    backgroundColor: isSacredTheme ? 'rgba(0,0,0,0.9)' : void 0,
                    color: isSacredTheme ? '#FFD700' : void 0,
                    width: '100%',
                  },
                  onClick: onProceed,
                }),
              }),
            ],
          })
        }
        DetailedPricingSummary.displayName = 'DetailedPricingSummary'
        const detailedpricingsummary = DetailedPricingSummary
        DetailedPricingSummary.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'DetailedPricingSummary',
          props: {
            product: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Product name',
              defaultValue: {
                value: "'Goobs Repo Unlimited × 1'",
                computed: !1,
              },
            },
            vendor: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Vendor name',
              defaultValue: { value: "'Technologies Unlimited'", computed: !1 },
            },
            vendorPrice: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Vendor price',
              defaultValue: { value: "'$180.00'", computed: !1 },
            },
            subtotal: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Subtotal amount',
              defaultValue: { value: "'$180.00'", computed: !1 },
            },
            vat: {
              required: !1,
              tsType: { name: 'string' },
              description: 'VAT amount',
              defaultValue: { value: "'$0.00'", computed: !1 },
            },
            total: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Total amount',
              defaultValue: { value: "'$180.00'", computed: !1 },
            },
            proceedText: {
              required: !1,
              tsType: { name: 'string' },
              description: 'Proceed button text',
              defaultValue: { value: "'Proceed to checkout'", computed: !1 },
            },
            onProceed: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '() => void',
                signature: { arguments: [], return: { name: 'void' } },
              },
              description: 'Proceed callback',
            },
            styles: {
              required: !1,
              tsType: { name: 'CardStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties',
            },
          },
        }
        var Card_console = __webpack_require__(
          './node_modules/console-browserify/index.js'
        )
        const Card = ({ variant = 'default', ...props }) => {
            switch (
              (Card_console.log(
                `Rendering Card with variant: ${variant}`,
                props
              ),
              variant)
            ) {
              case 'task':
                return (0, jsx_runtime.jsx)(task, {
                  title: props.title,
                  description: props.description,
                  checked: props.checked,
                  disabled: props.disabled,
                  onCheck: props.onCheck,
                  height: props.height,
                  styles: {
                    theme: props.sacredtheme ? 'sacred' : props.theme,
                    outline: props.outline,
                    ...props.styles,
                  },
                  draggable: props.draggable,
                  onDragStart: props.onDragStart,
                  onDragOver: props.onDragOver,
                  onDrop: props.onDrop,
                })
              case 'product':
                return (0, jsx_runtime.jsx)(product, {
                  title: props.title,
                  numDevelopers: props.numDevelopers,
                  onAddDeveloper: props.onAddDeveloper,
                  onRemoveDeveloper: props.onRemoveDeveloper,
                  licenses: props.licenses,
                  unitPrice: props.unitPrice,
                  total: props.total,
                  onBuy: props.onBuy,
                  onLivePreview: props.onLivePreview,
                  featuredescriptions: props.featuredescriptions,
                  releaseDate: props.releaseDate,
                  onContact: props.onContact,
                  createdBy: props.createdBy,
                  styles: {
                    theme: props.sacredtheme ? 'sacred' : props.theme,
                    ...props.styles,
                  },
                })
              case 'inventory':
                return (0, jsx_runtime.jsx)(inventory, {
                  title: props.title,
                  image: props.image,
                  license: props.license,
                  developmentUse: props.developmentUse,
                  productionUse: props.productionUse,
                  updates: props.updates,
                  support: props.support,
                  price: props.price,
                  quantity: props.quantity,
                  styles: {
                    theme: props.sacredtheme ? 'sacred' : props.theme,
                    ...props.styles,
                  },
                  onRemove: props.onRemove,
                })
              case 'productsummary':
                return (0, jsx_runtime.jsx)(productsummary, {
                  title: props.title,
                  body: props.body,
                  annualPrice: props.annualPrice,
                  monthlyPrice: props.monthlyPrice,
                  button1Props: props.button1Props,
                  button2Props: props.button2Props,
                  styles: {
                    theme: props.sacredtheme ? 'sacred' : props.theme,
                    ...props.styles,
                  },
                })
              case 'simplepricingsummary':
                return (0, jsx_runtime.jsx)(simplepricingsummary, {
                  subtotal: props.subtotal,
                  total: props.totalPrice,
                  proceedText: props.proceedText,
                  taxText: props.taxText,
                  discountText: props.discountText,
                  onProceed: props.onProceed,
                  styles: {
                    theme: props.sacredtheme ? 'sacred' : props.theme,
                    ...props.styles,
                  },
                })
              case 'detailedpricingsummary':
                return (0, jsx_runtime.jsx)(detailedpricingsummary, {
                  product: props.product,
                  vendor: props.vendor,
                  vendorPrice: props.vendorPrice,
                  subtotal: props.subtotal,
                  vat: props.vat,
                  total: props.totalPrice,
                  proceedText: props.proceedText,
                  onProceed: props.onProceed,
                  styles: {
                    theme: props.sacredtheme ? 'sacred' : props.theme,
                    ...props.styles,
                  },
                })
              default:
                return (0, jsx_runtime.jsx)(defaultconfig, {
                  ...props,
                  sacredtheme: props.sacredtheme,
                })
            }
          },
          components_Card = Card
        Card.__docgenInfo = {
          description:
            'Main Card component that renders different card variants based on the variant prop',
          methods: [],
          displayName: 'Card',
          props: {
            variant: {
              required: !1,
              tsType: {
                name: 'union',
                raw: "| 'default'\n| 'task'\n| 'product'\n| 'inventory'\n| 'productsummary'\n| 'simplepricingsummary'\n| 'detailedpricingsummary'",
                elements: [
                  { name: 'literal', value: "'default'" },
                  { name: 'literal', value: "'task'" },
                  { name: 'literal', value: "'product'" },
                  { name: 'literal', value: "'inventory'" },
                  { name: 'literal', value: "'productsummary'" },
                  { name: 'literal', value: "'simplepricingsummary'" },
                  { name: 'literal', value: "'detailedpricingsummary'" },
                ],
              },
              description: 'Card variant to render',
              defaultValue: { value: "'default'", computed: !1 },
            },
          },
        }
      },
      './src/components/Checkbox/index.tsx': (
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
          )
        const CheckIcon = ({ theme }) =>
            (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('svg', {
              viewBox: '0 0 20 20',
              fill: 'currentColor',
              style: {
                width: 'sacred' === theme ? '20px' : '18px',
                height: 'sacred' === theme ? '20px' : '18px',
                flexShrink: 0,
              },
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                'path',
                {
                  d: 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z',
                  strokeWidth: '0.5',
                  stroke: 'currentColor',
                }
              ),
            }),
          IndeterminateIcon = ({ theme }) =>
            (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('svg', {
              viewBox: '0 0 20 20',
              fill: 'currentColor',
              style: {
                width: 'sacred' === theme ? '20px' : '18px',
                height: 'sacred' === theme ? '20px' : '18px',
                flexShrink: 0,
              },
              children: (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                'path',
                {
                  d: 'M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z',
                  strokeWidth: '0.5',
                  stroke: 'currentColor',
                }
              ),
            }),
          SacredGlyphs = ({ isHovered }) => {
            const glyphStyles = (0, react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(
              () => ({
                glyph: {
                  position: 'absolute',
                  fontSize: '12px',
                  color: 'rgba(255, 215, 0, 0.3)',
                  transition: 'all 0.3s ease',
                  pointerEvents: 'none',
                },
                glyphLeft: {
                  left: '-24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                },
                glyphRight: {
                  right: '-24px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                },
                glyphVisible: { opacity: 0.6 },
                glyphFloating: {
                  animation: 'sacredFloat 3s ease-in-out infinite',
                },
                glyphDelayedFloating: {
                  animation: 'sacredFloat 3s ease-in-out infinite 1.5s',
                },
              }),
              []
            )
            return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
              react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment,
              {
                children: [
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'span',
                    {
                      style: {
                        ...glyphStyles.glyph,
                        ...glyphStyles.glyphLeft,
                        ...(isHovered && glyphStyles.glyphVisible),
                        ...glyphStyles.glyphFloating,
                      },
                      children: _theme__WEBPACK_IMPORTED_MODULE_2__.vR[11],
                    }
                  ),
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'span',
                    {
                      style: {
                        ...glyphStyles.glyph,
                        ...glyphStyles.glyphRight,
                        ...(isHovered && glyphStyles.glyphVisible),
                        ...glyphStyles.glyphDelayedFloating,
                      },
                      children: _theme__WEBPACK_IMPORTED_MODULE_2__.vR[15],
                    }
                  ),
                ],
              }
            )
          },
          PremiumAccent = ({ isChecked, isIndeterminate, outline }) => {
            const accentStyles = (0,
            react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(
              () => ({
                accent: {
                  position: 'absolute',
                  left: '-2px',
                  top: '-2px',
                  right: '-2px',
                  bottom: '-2px',
                  borderRadius: '6px',
                  background:
                    'linear-gradient(45deg, rgb(59, 130, 246), rgb(147, 197, 253))',
                  opacity: 0.3,
                  transition: 'opacity 0.3s ease',
                  zIndex: -1,
                },
              }),
              []
            )
            return outline && (isChecked || isIndeterminate)
              ? (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)('div', {
                  style: accentStyles.accent,
                })
              : null
          },
          Checkbox = (0, react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(
            (props, ref) => {
              const {
                  indeterminate,
                  checked: controlledChecked,
                  defaultChecked,
                  onChange,
                  onFocus,
                  onBlur,
                  styles,
                  ...rest
                } = props,
                id = (0, react__WEBPACK_IMPORTED_MODULE_1__.useId)(),
                internalRef = (0, react__WEBPACK_IMPORTED_MODULE_1__.useRef)(
                  null
                ),
                [isHovered, setIsHovered] = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
                [uncontrolledChecked, setUncontrolledChecked] = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useState)(
                  defaultChecked || !1
                ),
                isControlled = void 0 !== controlledChecked,
                checked = isControlled
                  ? controlledChecked
                  : uncontrolledChecked,
                isDisabled = !(
                  !(null == styles ? void 0 : styles.disabled) && !rest.disabled
                ),
                isSacredTheme =
                  'sacred' === (null == styles ? void 0 : styles.theme),
                isChecked = checked,
                isIndeterminate = indeterminate && !isChecked,
                computedStyles = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(
                  () =>
                    (0, _theme__WEBPACK_IMPORTED_MODULE_2__.WS)(
                      styles,
                      isHovered,
                      isChecked,
                      isIndeterminate,
                      isDisabled
                    ),
                  [styles, isHovered, isChecked, isIndeterminate, isDisabled]
                ),
                handleFocus = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(
                  event => {
                    null == onFocus || onFocus(event)
                  },
                  [onFocus]
                ),
                handleBlur = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(
                  event => {
                    null == onBlur || onBlur(event)
                  },
                  [onBlur]
                ),
                handleChange = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(
                  e => {
                    const newChecked = e.target.checked
                    ;(isControlled || setUncontrolledChecked(newChecked),
                      null == onChange || onChange(newChecked))
                  },
                  [isControlled, onChange]
                ),
                handleMouseEnter = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
                  setIsHovered(!0)
                }, []),
                handleMouseLeave = (0,
                react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
                  setIsHovered(!1)
                }, [])
              return (
                (0, react__WEBPACK_IMPORTED_MODULE_1__.useImperativeHandle)(
                  ref,
                  () => internalRef.current
                ),
                (0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
                  internalRef.current &&
                    (internalRef.current.indeterminate = indeterminate || !1)
                }, [indeterminate]),
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                  'label',
                  {
                    htmlFor: id,
                    style: computedStyles.wrapper,
                    onMouseEnter: handleMouseEnter,
                    onMouseLeave: handleMouseLeave,
                    children: [
                      isSacredTheme &&
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          SacredGlyphs,
                          { isHovered }
                        ),
                      !isSacredTheme &&
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          PremiumAccent,
                          {
                            isChecked,
                            isIndeterminate: !!isIndeterminate,
                            outline:
                              !1 !== (null == styles ? void 0 : styles.outline),
                          }
                        ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                        'div',
                        {
                          style: computedStyles.container,
                          children: [
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'input',
                              {
                                type: 'checkbox',
                                id,
                                ref: internalRef,
                                style: computedStyles.input,
                                'aria-checked': indeterminate
                                  ? 'mixed'
                                  : void 0,
                                disabled: isDisabled,
                                checked: !!isChecked,
                                onChange: handleChange,
                                onFocus: handleFocus,
                                onBlur: handleBlur,
                                ...rest,
                              }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'div',
                              { style: computedStyles.box }
                            ),
                            (0,
                            react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                              'div',
                              {
                                style: computedStyles.icon,
                                children: indeterminate
                                  ? (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      IndeterminateIcon,
                                      {
                                        theme:
                                          null == styles
                                            ? void 0
                                            : styles.theme,
                                      }
                                    )
                                  : (0,
                                    react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                                      CheckIcon,
                                      {
                                        theme:
                                          null == styles
                                            ? void 0
                                            : styles.theme,
                                      }
                                    ),
                              }
                            ),
                          ],
                        }
                      ),
                    ],
                  }
                )
              )
            }
          )
        Checkbox.displayName = 'Checkbox'
        const __WEBPACK_DEFAULT_EXPORT__ = Checkbox
        Checkbox.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'Checkbox',
          props: {
            checked: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'Whether the checkbox is checked',
            },
            defaultChecked: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'Default checked state for uncontrolled mode',
            },
            onChange: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(checked: boolean) => void',
                signature: {
                  arguments: [{ type: { name: 'boolean' }, name: 'checked' }],
                  return: { name: 'void' },
                },
              },
              description: 'Callback when checkbox state changes',
            },
            onFocus: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.FocusEvent<HTMLInputElement>) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactFocusEvent',
                        raw: 'React.FocusEvent<HTMLInputElement>',
                        elements: [{ name: 'HTMLInputElement' }],
                      },
                      name: 'event',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: 'Callback when checkbox is focused',
            },
            onBlur: {
              required: !1,
              tsType: {
                name: 'signature',
                type: 'function',
                raw: '(event: React.FocusEvent<HTMLInputElement>) => void',
                signature: {
                  arguments: [
                    {
                      type: {
                        name: 'ReactFocusEvent',
                        raw: 'React.FocusEvent<HTMLInputElement>',
                        elements: [{ name: 'HTMLInputElement' }],
                      },
                      name: 'event',
                    },
                  ],
                  return: { name: 'void' },
                },
              },
              description: 'Callback when checkbox loses focus',
            },
            indeterminate: {
              required: !1,
              tsType: { name: 'boolean' },
              description: 'Whether the checkbox is in indeterminate state',
            },
            styles: {
              required: !1,
              tsType: { name: 'CheckboxStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties.',
            },
          },
          composes: ['Omit'],
        }
      },
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
      './src/components/Switch/index.tsx': (
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
          )
        const Switch = ({
          disabled,
          checked,
          styles,
          onChange,
          leftLabel,
          rightLabel,
          ...props
        }) => {
          const [isFocused, setIsFocused] = (0,
            react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
            [isHovered, setIsHovered] = (0,
            react__WEBPACK_IMPORTED_MODULE_1__.useState)(!1),
            isSacredTheme =
              'sacred' === (null == styles ? void 0 : styles.theme),
            computedStyles = (0, react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(
              () =>
                (0, _theme__WEBPACK_IMPORTED_MODULE_2__.HZ)(
                  styles,
                  isFocused,
                  isHovered,
                  checked,
                  disabled
                ),
              [styles, isFocused, isHovered, checked, disabled]
            )
          ;(0, react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
            if (isSacredTheme) {
              const styleSheet = document.styleSheets[0],
                keyframes =
                  "\n        @keyframes sacredSwitchFloat {\n          0%, 100% { transform: translateY(-50%) scale(1); opacity: 0.3; }\n          50% { transform: translateY(-50%) scale(1.1); opacity: 0.6; }\n        }\n        @keyframes sacredSwitchShimmer {\n          0% { left: '-100%'; }\n          50% { left: '100%'; }\n          100% { left: '100%'; }\n        }\n      "
              try {
                styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
              } catch (e) {}
            }
          }, [isSacredTheme])
          return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
            'label',
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
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'span',
                          {
                            style: {
                              ...computedStyles.glyph,
                              ...computedStyles.glyphLeft,
                            },
                            children: _theme__WEBPACK_IMPORTED_MODULE_2__.vR[9],
                          }
                        ),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'span',
                          {
                            style: {
                              ...computedStyles.glyph,
                              ...computedStyles.glyphRight,
                            },
                            children:
                              _theme__WEBPACK_IMPORTED_MODULE_2__.vR[16],
                          }
                        ),
                      ],
                    }
                  ),
                leftLabel &&
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'span',
                    { style: computedStyles.leftLabel, children: leftLabel }
                  ),
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(
                  'div',
                  {
                    style: computedStyles.track,
                    children: [
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'input',
                        {
                          type: 'checkbox',
                          style: computedStyles.input,
                          checked,
                          disabled,
                          onChange: event => {
                            onChange && onChange(event)
                          },
                          onFocus: () => setIsFocused(!0),
                          onBlur: () => setIsFocused(!1),
                          ...props,
                        }
                      ),
                      isSacredTheme &&
                        checked &&
                        isHovered &&
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                          'div',
                          { style: computedStyles.shimmer }
                        ),
                      (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                        'div',
                        {
                          style: computedStyles.thumb,
                          children: isSacredTheme
                            ? checked
                              ? '𓊹'
                              : '𓊨'
                            : checked
                              ? '✓'
                              : '',
                        }
                      ),
                    ],
                  }
                ),
                rightLabel &&
                  (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                    'span',
                    { style: computedStyles.rightLabel, children: rightLabel }
                  ),
              ],
            }
          )
        }
        Switch.displayName = 'Switch'
        const __WEBPACK_DEFAULT_EXPORT__ = Switch
        Switch.__docgenInfo = {
          description: '',
          methods: [],
          displayName: 'Switch',
          props: {
            leftLabel: {
              required: !1,
              tsType: { name: 'string' },
              description:
                'Label text to display on the left side of the switch',
            },
            rightLabel: {
              required: !1,
              tsType: { name: 'string' },
              description:
                'Label text to display on the right side of the switch',
            },
            styles: {
              required: !1,
              tsType: { name: 'SwitchStyles' },
              description:
                'Comprehensive styling options including theme, custom colors, and layout properties',
            },
          },
        }
      },
    },
  ]
)
