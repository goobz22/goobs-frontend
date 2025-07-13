'use strict'
;(self.webpackChunkgoobs_frontend = self.webpackChunkgoobs_frontend || []).push(
  [
    [1669],
    {
      './src/theme/index.ts': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
        __webpack_require__.d(__webpack_exports__, {
          vR: () => shared.vR,
          Ql: () => black,
          jB: () => getAccordionStyles,
          pu: () => getAlertStyles,
          hs: () => getButtonStyles,
          Hu: () => getCardStyles,
          WS: () => getCheckboxStyles,
          z6: () => getChipStyles,
          lQ: () => getCodeCopyStyles,
          lm: () => getComplexTextEditorStyles,
          RJ: () => getConfirmationCodeInputStyles,
          fN: () => getDataGridStyles,
          Ux: () => getDrawerStyles,
          tZ: () => getProgressBarStyles,
          Op: () => getProjectBoardStyles,
          sz: () => getRequiredIndicatorStyle,
          SI: () => getRequiredProps,
          EK: () => getSharedAdornmentStyles,
          ZZ: () => getSharedContainerStyles,
          En: () => getSharedFooterTextStyles,
          AW: () => getSharedFormFieldStyles,
          Wh: () => getSharedLabelStyles,
          Mo: () => getStepperStyles,
          HZ: () => getSwitchStyles,
          A5: () => getToolbarStyles,
          Oh: () => grey,
        })
        __webpack_require__('./node_modules/next/dist/compiled/react/index.js')
        const formFieldThemes = {
            light: {
              background: 'rgba(255, 255, 255, 0.95)',
              border: {
                default: 'rgba(209, 213, 219, 1)',
                focused: 'rgba(59, 130, 246, 1)',
                error: 'rgba(239, 68, 68, 1)',
              },
              text: 'rgba(31, 41, 55, 1)',
              label: {
                default: 'rgba(107, 114, 128, 1)',
                focused: 'rgba(59, 130, 246, 1)',
                error: 'rgba(239, 68, 68, 1)',
                shrunkBackground: 'rgba(255, 255, 255, 0.95)',
              },
              adornment: {
                default: 'rgba(107, 114, 128, 1)',
                focused: 'rgba(59, 130, 246, 1)',
              },
              footerText: {
                default: 'rgba(107, 114, 128, 1)',
                error: 'rgba(239, 68, 68, 1)',
                info: 'rgba(59, 130, 246, 1)',
              },
              fontFamily: '"Inter", sans-serif',
            },
            dark: {
              background: 'rgba(31, 41, 55, 0.95)',
              border: {
                default: 'rgba(75, 85, 99, 1)',
                focused: 'rgba(96, 165, 250, 1)',
                error: 'rgba(239, 68, 68, 1)',
              },
              text: 'rgba(255, 255, 255, 1)',
              label: {
                default: 'rgba(156, 163, 175, 1)',
                focused: 'rgba(96, 165, 250, 1)',
                error: 'rgba(239, 68, 68, 1)',
                shrunkBackground: 'rgba(31, 41, 55, 0.95)',
              },
              adornment: {
                default: 'rgba(156, 163, 175, 1)',
                focused: 'rgba(96, 165, 250, 1)',
              },
              footerText: {
                default: 'rgba(156, 163, 175, 1)',
                error: 'rgba(239, 68, 68, 1)',
                info: 'rgba(96, 165, 250, 1)',
              },
              fontFamily: '"Inter", sans-serif',
            },
            sacred: {
              background: 'rgba(10, 10, 10, 0.9)',
              border: {
                default: 'rgba(255, 215, 0, 0.4)',
                focused: 'rgba(255, 215, 0, 1)',
                error: 'rgba(239, 68, 68, 1)',
              },
              text: 'rgba(255, 215, 0, 1)',
              label: {
                default: 'rgba(107, 114, 128, 1)',
                focused: 'rgba(255, 215, 0, 1)',
                error: 'rgba(239, 68, 68, 1)',
                shrunkBackground: 'rgba(10, 10, 10, 0.9)',
              },
              adornment: {
                default: 'rgba(107, 114, 128, 1)',
                focused: 'rgba(255, 215, 0, 1)',
              },
              footerText: {
                default: 'rgba(107, 114, 128, 1)',
                error: 'rgba(239, 68, 68, 1)',
                info: 'rgba(255, 215, 0, 0.8)',
              },
              fontFamily: '"Cinzel", serif',
            },
          },
          getFormFieldTheme = styles => {
            const theme = (null == styles ? void 0 : styles.theme) || 'light',
              baseTheme = formFieldThemes[theme]
            return styles
              ? {
                  background: styles.backgroundColor || baseTheme.background,
                  border: {
                    default: styles.borderColor || baseTheme.border.default,
                    focused:
                      styles.borderFocusedColor || baseTheme.border.focused,
                    error: styles.borderErrorColor || baseTheme.border.error,
                  },
                  text: styles.textColor || baseTheme.text,
                  label: {
                    default: styles.labelColor || baseTheme.label.default,
                    focused:
                      styles.labelFocusedColor || baseTheme.label.focused,
                    error: styles.labelErrorColor || baseTheme.label.error,
                    shrunkBackground:
                      styles.labelShrunkBackgroundColor ||
                      baseTheme.label.shrunkBackground,
                  },
                  adornment: {
                    default:
                      styles.adornmentColor || baseTheme.adornment.default,
                    focused:
                      styles.adornmentFocusedColor ||
                      baseTheme.adornment.focused,
                  },
                  footerText: {
                    default:
                      styles.footerTextColor || baseTheme.footerText.default,
                    error:
                      styles.footerTextErrorColor || baseTheme.footerText.error,
                    info:
                      styles.footerTextInfoColor || baseTheme.footerText.info,
                  },
                  fontFamily: styles.fontFamily || baseTheme.fontFamily,
                }
              : baseTheme
          },
          getSharedFormFieldStyles = (styles, isFocused) => {
            const themeConfig = getFormFieldTheme(styles),
              helperTextType =
                (null == styles ? void 0 : styles.helperTextType) || 'info',
              isError = 'error' === helperTextType
            return {
              themeConfig,
              borderColor: isError
                ? themeConfig.border.error
                : isFocused
                  ? themeConfig.border.focused
                  : themeConfig.border.default,
              labelColor: isError
                ? themeConfig.label.error
                : themeConfig.label.default,
              adornmentColor: isFocused
                ? themeConfig.adornment.focused
                : themeConfig.adornment.default,
              footerTextColor:
                'error' === helperTextType
                  ? themeConfig.footerText.error
                  : 'info' === helperTextType
                    ? themeConfig.footerText.info
                    : themeConfig.footerText.default,
              transition: (null == styles ? void 0 : styles.transitionDuration)
                ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
                : 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
              isError,
              helperTextType,
            }
          },
          getSharedLabelStyles = (labelColor, themeConfig) => ({
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            color: labelColor,
            fontFamily: themeConfig.fontFamily,
            fontWeight: 600,
            lineHeight: '1.2',
            letterSpacing: '0.01em',
            pointerEvents: 'auto',
          }),
          getSharedContainerStyles = styles => ({
            position: 'relative',
            width: (null == styles ? void 0 : styles.width) || '100%',
            minWidth: null == styles ? void 0 : styles.minWidth,
            maxWidth: null == styles ? void 0 : styles.maxWidth,
            height: (null == styles ? void 0 : styles.height) || 'auto',
            minHeight: null == styles ? void 0 : styles.minHeight,
            maxHeight: null == styles ? void 0 : styles.maxHeight,
            marginTop: (null == styles ? void 0 : styles.marginTop) || '0',
            marginBottom: null == styles ? void 0 : styles.marginBottom,
            marginLeft: null == styles ? void 0 : styles.marginLeft,
            marginRight: null == styles ? void 0 : styles.marginRight,
            margin: null == styles ? void 0 : styles.margin,
          }),
          getSharedFooterTextStyles = (
            footerTextColor,
            themeConfig,
            styles
          ) => ({
            display: 'block',
            marginTop:
              (null == styles ? void 0 : styles.footerMarginTop) || '8px',
            fontSize:
              (null == styles ? void 0 : styles.footerFontSize) || '12px',
            color: footerTextColor,
            fontFamily: themeConfig.fontFamily,
            lineHeight: '1.3',
            fontWeight: 400,
          }),
          getSharedAdornmentStyles = adornmentColor => ({
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            color: adornmentColor,
          }),
          getRequiredIndicatorStyle = styles => ({
            color:
              (null == styles ? void 0 : styles.requiredIndicatorColor) ||
              'rgba(239, 68, 68, 1)',
          }),
          getRequiredProps = required => ({
            required: !!required,
            'aria-required': !!required,
          }),
          accordionThemes = {
            light: {
              container: {
                background: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'none',
              },
              containerHover: {
                transform: 'translateY(-1px)',
                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.15)',
              },
              containerExpanded: {
                boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.12)',
                background: '#fafafa',
              },
              summary: {
                background: '#f5f7fa',
                color: 'inherit',
                fontFamily: 'merriweather',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: 'normal',
                borderBottom: 'none',
                minHeight: '32px',
                height: '32px',
                maxHeight: '32px',
                whiteSpace: 'nowrap',
                minWidth: 'fit-content',
              },
              summaryHover: { backgroundColor: '#e8f0fe', color: 'inherit' },
              summaryExpanded: {
                backgroundColor: '#e3f2fd',
                borderBottomColor: 'rgba(0, 0, 0, 0.12)',
                color: 'inherit',
                fontWeight: 500,
              },
              details: {
                background: 'white',
                borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                color: 'inherit',
                fontFamily: 'inherit',
                fontSize: '16px',
                lineHeight: 1.6,
                backdropFilter: 'none',
              },
              icon: { color: '#000000', filter: 'none' },
              iconHover: {
                color: '#000000',
                transform: 'scale(1.1)',
                filter: 'none',
              },
              iconExpanded: {
                transform: 'rotate(180deg)',
                color: '#000000',
                filter: 'none',
              },
              transition: 'all 0.2s ease',
              mobile: {
                borderRadius: '6px',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
                summaryPadding: '4px 16px',
                summaryMinHeight: '32px',
                detailsPadding: '12px 16px',
                summaryFontSize: '14px',
              },
              tablet: { detailsPadding: '14px 18px' },
              desktop: { detailsPadding: '16px 24px' },
            },
            dark: {
              container: {
                background: 'rgba(31, 41, 55, 0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
              },
              containerHover: {
                transform: 'translateY(-1px)',
                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.25)',
              },
              containerExpanded: {
                boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.3)',
                background: 'rgba(30, 58, 138, 0.2)',
              },
              summary: {
                background: 'rgba(17, 24, 39, 0.5)',
                color: 'rgb(243, 244, 246)',
                fontFamily: 'merriweather',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: 'normal',
                borderBottom: 'none',
                minHeight: '32px',
                height: '32px',
                maxHeight: '32px',
                whiteSpace: 'nowrap',
                minWidth: 'fit-content',
              },
              summaryHover: {
                backgroundColor: 'rgba(30, 58, 138, 0.3)',
                color: 'rgb(96, 165, 250)',
              },
              summaryExpanded: {
                backgroundColor: 'rgba(30, 58, 138, 0.4)',
                borderBottomColor: 'rgba(96, 165, 250, 0.3)',
                color: 'rgb(96, 165, 250)',
                fontWeight: 500,
              },
              details: {
                background: 'rgba(17, 24, 39, 0.8)',
                borderTop: '1px solid rgba(75, 85, 99, 0.5)',
                color: 'rgb(209, 213, 219)',
                fontFamily: 'inherit',
                fontSize: '16px',
                lineHeight: 1.6,
                backdropFilter: 'blur(4px)',
              },
              icon: { color: 'rgb(156, 163, 175)', filter: 'none' },
              iconHover: {
                color: 'rgb(96, 165, 250)',
                transform: 'scale(1.1)',
                filter: 'none',
              },
              iconExpanded: {
                transform: 'rotate(180deg)',
                color: 'rgb(96, 165, 250)',
                filter: 'none',
              },
              transition: 'all 0.2s ease',
              mobile: {
                borderRadius: '6px',
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.3)',
                summaryPadding: '4px 16px',
                summaryMinHeight: '32px',
                detailsPadding: '12px 16px',
                summaryFontSize: '14px',
              },
              tablet: { detailsPadding: '14px 18px' },
              desktop: { detailsPadding: '16px 24px' },
            },
            sacred: {
              container: {
                background: '#0a0a0a',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '8px',
                boxShadow:
                  '0 0 15px rgba(255, 215, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
                backgroundImage:
                  '\n        linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),\n        radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%)\n      ',
              },
              containerHover: {
                transform: 'translateY(-1px)',
                boxShadow:
                  '0 0 25px rgba(255, 215, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.4)',
              },
              containerExpanded: {
                boxShadow:
                  '0 0 30px rgba(255, 215, 0, 0.5), 0 6px 12px rgba(0, 0, 0, 0.5)',
                background: '#0a0a0a',
                borderColor: '#FFD700',
                backgroundImage:
                  '\n        linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02)),\n        radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%)\n      ',
              },
              summary: {
                background: 'transparent',
                color: 'rgba(255, 215, 0, 0.9)',
                fontFamily: '"Cinzel", serif',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
                borderBottom: 'none',
                minHeight: '32px',
                height: '32px',
                maxHeight: '32px',
                whiteSpace: 'nowrap',
                minWidth: 'fit-content',
              },
              summaryHover: {
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                color: '#FFD700',
                textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
              },
              summaryExpanded: {
                backgroundColor: 'rgba(255, 215, 0, 0.05)',
                borderBottomColor: 'rgba(255, 215, 0, 0.3)',
                color: '#FFD700',
                fontWeight: 600,
                textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
              },
              details: {
                background: 'transparent',
                borderTop: '1px solid rgba(255, 215, 0, 0.2)',
                color: 'rgba(255, 215, 0, 0.8)',
                fontFamily: 'inherit',
                fontSize: '16px',
                lineHeight: 1.6,
                backdropFilter: 'blur(2px)',
              },
              icon: {
                color: '#FFD700',
                filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))',
              },
              iconHover: {
                color: '#FFD700',
                transform: 'scale(1.1)',
                filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))',
              },
              iconExpanded: {
                transform: 'rotate(180deg)',
                color: '#FFD700',
                filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))',
              },
              transition: 'all 0.3s ease',
              mobile: {
                borderRadius: '6px',
                boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)',
                summaryPadding: '4px 16px',
                summaryMinHeight: '32px',
                detailsPadding: '12px 16px',
                summaryFontSize: '14px',
              },
              tablet: { detailsPadding: '14px 18px' },
              desktop: { detailsPadding: '24px 32px' },
            },
          },
          getResponsiveStyles = (theme, breakpoint) => {
            const responsive = theme[breakpoint]
            return 'mobile' === breakpoint
              ? {
                  borderRadius: responsive.borderRadius,
                  boxShadow: responsive.boxShadow,
                }
              : {}
          },
          getResponsiveSummaryStyles = (theme, breakpoint) => {
            const responsive = theme[breakpoint]
            return 'mobile' === breakpoint
              ? {
                  padding: responsive.summaryPadding,
                  minHeight: responsive.summaryMinHeight,
                  fontSize: responsive.summaryFontSize,
                }
              : {}
          },
          getResponsiveDetailsStyles = (theme, breakpoint) => ({
            padding: theme[breakpoint].detailsPadding,
          }),
          getAccordionStyles = (styles, isHovered, isExpanded, isDisabled) => {
            const themeConfig = (styles => {
                const theme =
                    (null == styles ? void 0 : styles.theme) || 'light',
                  baseTheme = accordionThemes[theme]
                return styles
                  ? {
                      ...baseTheme,
                      container: {
                        background:
                          styles.backgroundColor ||
                          baseTheme.container.background,
                        border: styles.borderColor
                          ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
                          : baseTheme.container.border,
                        borderRadius:
                          styles.borderRadius ||
                          baseTheme.container.borderRadius,
                        boxShadow:
                          styles.boxShadow || baseTheme.container.boxShadow,
                        backdropFilter:
                          styles.backdropFilter ||
                          baseTheme.container.backdropFilter,
                        backgroundImage:
                          styles.backgroundImage ||
                          baseTheme.container.backgroundImage,
                      },
                      containerHover: {
                        transform:
                          styles.hoverTransform ||
                          baseTheme.containerHover.transform,
                        boxShadow:
                          styles.hoverBoxShadow ||
                          baseTheme.containerHover.boxShadow,
                        borderColor:
                          styles.hoverBorderColor ||
                          baseTheme.containerHover.borderColor,
                      },
                      containerExpanded: {
                        boxShadow:
                          styles.expandedBoxShadow ||
                          baseTheme.containerExpanded.boxShadow,
                        background:
                          styles.expandedBackgroundColor ||
                          baseTheme.containerExpanded.background,
                        borderColor:
                          styles.expandedBorderColor ||
                          baseTheme.containerExpanded.borderColor,
                        backgroundImage:
                          styles.expandedBackgroundImage ||
                          baseTheme.containerExpanded.backgroundImage,
                      },
                      summary: {
                        background:
                          styles.summaryBackgroundColor ||
                          baseTheme.summary.background,
                        color: styles.summaryColor || baseTheme.summary.color,
                        fontFamily:
                          styles.summaryFontFamily ||
                          baseTheme.summary.fontFamily,
                        fontSize:
                          styles.summaryFontSize || baseTheme.summary.fontSize,
                        fontWeight:
                          styles.summaryFontWeight ||
                          baseTheme.summary.fontWeight,
                        letterSpacing:
                          styles.summaryLetterSpacing ||
                          baseTheme.summary.letterSpacing,
                        textShadow:
                          styles.summaryTextShadow ||
                          baseTheme.summary.textShadow,
                        borderBottom:
                          styles.summaryBorderBottom ||
                          baseTheme.summary.borderBottom,
                        minHeight:
                          styles.summaryMinHeight ||
                          baseTheme.summary.minHeight,
                        height: styles.height || baseTheme.summary.height,
                        maxHeight:
                          styles.maxHeight || baseTheme.summary.maxHeight,
                        whiteSpace:
                          styles.summaryWhiteSpace ||
                          baseTheme.summary.whiteSpace,
                        overflow:
                          styles.summaryOverflow || baseTheme.summary.overflow,
                        textOverflow:
                          styles.summaryTextOverflow ||
                          baseTheme.summary.textOverflow,
                        minWidth: styles.minWidth || baseTheme.summary.minWidth,
                      },
                      summaryHover: {
                        backgroundColor:
                          styles.summaryHoverBackgroundColor ||
                          baseTheme.summaryHover.backgroundColor,
                        color:
                          styles.summaryHoverColor ||
                          baseTheme.summaryHover.color,
                        transform:
                          styles.summaryHoverTransform ||
                          baseTheme.summaryHover.transform,
                        textShadow:
                          styles.summaryHoverTextShadow ||
                          baseTheme.summaryHover.textShadow,
                      },
                      summaryExpanded: {
                        backgroundColor:
                          styles.summaryExpandedBackgroundColor ||
                          baseTheme.summaryExpanded.backgroundColor,
                        borderBottomColor:
                          styles.summaryExpandedBorderBottomColor ||
                          baseTheme.summaryExpanded.borderBottomColor,
                        color:
                          styles.summaryExpandedColor ||
                          baseTheme.summaryExpanded.color,
                        fontWeight:
                          styles.summaryExpandedFontWeight ||
                          baseTheme.summaryExpanded.fontWeight,
                        textShadow:
                          styles.summaryExpandedTextShadow ||
                          baseTheme.summaryExpanded.textShadow,
                      },
                      details: {
                        background:
                          styles.detailsBackgroundColor ||
                          baseTheme.details.background,
                        borderTop:
                          styles.detailsBorderTop ||
                          baseTheme.details.borderTop,
                        color: styles.detailsColor || baseTheme.details.color,
                        fontFamily:
                          styles.detailsFontFamily ||
                          baseTheme.details.fontFamily,
                        fontSize:
                          styles.detailsFontSize || baseTheme.details.fontSize,
                        lineHeight:
                          styles.detailsLineHeight ||
                          baseTheme.details.lineHeight,
                        backdropFilter:
                          styles.detailsBackdropFilter ||
                          baseTheme.details.backdropFilter,
                      },
                      icon: {
                        color: styles.iconColor || baseTheme.icon.color,
                        filter: styles.iconFilter || baseTheme.icon.filter,
                      },
                      iconHover: {
                        color:
                          styles.iconHoverColor || baseTheme.iconHover.color,
                        transform:
                          styles.iconHoverTransform ||
                          baseTheme.iconHover.transform,
                        filter:
                          styles.iconHoverFilter || baseTheme.iconHover.filter,
                      },
                      iconExpanded: {
                        transform:
                          styles.iconExpandedTransform ||
                          baseTheme.iconExpanded.transform,
                        color:
                          styles.iconExpandedColor ||
                          baseTheme.iconExpanded.color,
                        filter:
                          styles.iconExpandedFilter ||
                          baseTheme.iconExpanded.filter,
                      },
                      transition: styles.transitionDuration
                        ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
                        : baseTheme.transition,
                    }
                  : baseTheme
              })(styles),
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme),
              level = (null == styles ? void 0 : styles.level) || 0,
              levelIndent =
                ((null == styles ? void 0 : styles.levelIndentBase) || 0) +
                level *
                  ((null == styles ? void 0 : styles.levelIndentIncrement) || 6)
            return {
              container: {
                marginBottom:
                  (null == styles ? void 0 : styles.marginBottom) || '8px',
                margin: null == styles ? void 0 : styles.margin,
                width: (null == styles ? void 0 : styles.width) || '100%',
                maxWidth: null == styles ? void 0 : styles.maxWidth,
                minWidth: null == styles ? void 0 : styles.minWidth,
                borderRadius: themeConfig.container.borderRadius,
                overflow: 'hidden',
                position: 'relative',
                transition: themeConfig.transition,
                backgroundColor: themeConfig.container.background,
                border: themeConfig.container.border,
                boxShadow: themeConfig.container.boxShadow,
                backdropFilter: themeConfig.container.backdropFilter,
                backgroundImage: themeConfig.container.backgroundImage,
                ...(isHovered &&
                  !isDisabled && {
                    transform: themeConfig.containerHover.transform,
                    boxShadow: themeConfig.containerHover.boxShadow,
                    borderColor: themeConfig.containerHover.borderColor,
                  }),
                ...(isExpanded &&
                  !isDisabled && {
                    boxShadow: themeConfig.containerExpanded.boxShadow,
                    background: themeConfig.containerExpanded.background,
                    borderColor: themeConfig.containerExpanded.borderColor,
                    backgroundImage:
                      themeConfig.containerExpanded.backgroundImage,
                  }),
                ...(isDisabled && {
                  opacity: isSacredTheme ? 0.6 : 0.8,
                  backgroundColor: isSacredTheme
                    ? 'rgba(0, 0, 0, 0.8)'
                    : '#f8f8f8',
                  borderColor: isSacredTheme
                    ? 'rgba(255, 215, 0, 0.1)'
                    : void 0,
                }),
                ...(!1 === (null == styles ? void 0 : styles.outline) && {
                  border: 'none',
                  boxShadow: 'none',
                }),
              },
              summary: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding:
                  (null == styles ? void 0 : styles.summaryPadding) ||
                  `4px 16px 4px ${levelIndent}px`,
                height: '32px',
                maxHeight: '32px',
                minWidth: 'fit-content',
                transition: themeConfig.transition,
                position: 'relative',
                backgroundColor: themeConfig.summary.background,
                color: themeConfig.summary.color,
                fontFamily: themeConfig.summary.fontFamily,
                fontWeight: themeConfig.summary.fontWeight,
                fontSize: themeConfig.summary.fontSize,
                letterSpacing: themeConfig.summary.letterSpacing,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                minHeight: themeConfig.summary.minHeight,
                borderBottom: themeConfig.summary.borderBottom,
                textShadow: themeConfig.summary.textShadow,
                whiteSpace: 'nowrap',
                ...(isHovered &&
                  !isDisabled && {
                    backgroundColor: themeConfig.summaryHover.backgroundColor,
                    color: themeConfig.summaryHover.color,
                    transform: themeConfig.summaryHover.transform,
                    textShadow: themeConfig.summaryHover.textShadow,
                  }),
                ...(isExpanded &&
                  !isDisabled && {
                    backgroundColor:
                      themeConfig.summaryExpanded.backgroundColor,
                    borderBottom: `1px solid ${themeConfig.summaryExpanded.borderBottomColor}`,
                    color: themeConfig.summaryExpanded.color,
                    fontWeight: themeConfig.summaryExpanded.fontWeight,
                    textShadow: themeConfig.summaryExpanded.textShadow,
                  }),
                ...(isDisabled && {
                  opacity: 1,
                  color: isSacredTheme ? 'rgba(255, 215, 0, 0.3)' : '#666',
                  cursor: 'not-allowed',
                }),
              },
              details: {
                padding:
                  (null == styles ? void 0 : styles.detailsPadding) || '16px',
                position: 'relative',
                backgroundColor: themeConfig.details.background,
                borderTop: themeConfig.details.borderTop,
                color: themeConfig.details.color,
                fontFamily: themeConfig.details.fontFamily,
                fontSize: themeConfig.details.fontSize,
                lineHeight: themeConfig.details.lineHeight,
                backdropFilter: themeConfig.details.backdropFilter,
                ...(!1 === (null == styles ? void 0 : styles.outline) && {
                  borderTop: 'none',
                }),
              },
              icon: {
                width: '24px',
                height: '24px',
                transition: themeConfig.transition,
                color: themeConfig.icon.color,
                filter: themeConfig.icon.filter,
                ...(isHovered &&
                  !isDisabled && {
                    color: themeConfig.iconHover.color,
                    transform: themeConfig.iconHover.transform,
                    filter: themeConfig.iconHover.filter,
                  }),
                ...(isExpanded &&
                  !isDisabled && {
                    transform: themeConfig.iconExpanded.transform,
                    color: themeConfig.iconExpanded.color,
                    filter: themeConfig.iconExpanded.filter,
                  }),
                ...(isDisabled && {
                  color: isSacredTheme ? 'rgba(255, 215, 0, 0.3)' : '#999',
                }),
              },
              responsive: {
                mobile: {
                  container: getResponsiveStyles(themeConfig, 'mobile'),
                  summary: getResponsiveSummaryStyles(themeConfig, 'mobile'),
                  details: getResponsiveDetailsStyles(themeConfig, 'mobile'),
                },
                tablet: {
                  container: getResponsiveStyles(themeConfig, 'tablet'),
                  summary: getResponsiveSummaryStyles(themeConfig, 'tablet'),
                  details: getResponsiveDetailsStyles(themeConfig, 'tablet'),
                },
                desktop: {
                  container: getResponsiveStyles(themeConfig, 'desktop'),
                  summary: getResponsiveSummaryStyles(themeConfig, 'desktop'),
                  details: getResponsiveDetailsStyles(themeConfig, 'desktop'),
                },
              },
            }
          }
        var shared = __webpack_require__('./src/theme/shared.ts')
        const alertThemes = {
            light: {
              container: {
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid',
                borderRadius: '12px',
                boxShadow: shared.I4.light.small,
                backdropFilter: 'blur(8px)',
                fontFamily: '"Inter", sans-serif',
                fontSize: '15px',
                lineHeight: 1.5,
                padding: '20px',
              },
              containerHover: {
                transform: 'translateY(-1px)',
                boxShadow:
                  '0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)',
              },
              severity: {
                error: {
                  backgroundColor: 'rgba(254, 242, 242, 0.9)',
                  borderColor: 'rgba(248, 113, 113, 0.4)',
                  color: 'rgb(153, 27, 27)',
                },
                warning: {
                  backgroundColor: 'rgba(255, 251, 235, 0.9)',
                  borderColor: 'rgba(251, 191, 36, 0.4)',
                  color: 'rgb(146, 64, 14)',
                },
                info: {
                  backgroundColor: 'rgba(239, 246, 255, 0.9)',
                  borderColor: 'rgba(96, 165, 250, 0.4)',
                  color: 'rgb(30, 64, 175)',
                },
                success: {
                  backgroundColor: 'rgba(240, 253, 244, 0.9)',
                  borderColor: 'rgba(74, 222, 128, 0.4)',
                  color: 'rgb(21, 128, 61)',
                },
              },
              icon: { width: '20px', height: '20px' },
              iconHover: { transform: 'scale(1.1)' },
              message: { fontWeight: 500 },
              closeButton: {
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(0, 0, 0, 0.1)',
                color: 'currentColor',
                fontSize: '16px',
              },
              closeButtonHover: {
                background: 'rgba(0, 0, 0, 0.2)',
                transform: 'scale(1.1)',
              },
              transition: shared.Ds.medium,
            },
            dark: {
              container: {
                background: 'rgba(31, 41, 55, 0.95)',
                border: '1px solid',
                borderRadius: '12px',
                boxShadow:
                  '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(8px)',
                fontFamily: '"Inter", sans-serif',
                fontSize: '15px',
                lineHeight: 1.5,
                padding: '20px',
              },
              containerHover: {
                transform: 'translateY(-1px)',
                boxShadow:
                  '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)',
              },
              severity: {
                error: {
                  backgroundColor: 'rgba(127, 29, 29, 0.3)',
                  borderColor: 'rgba(248, 113, 113, 0.4)',
                  color: 'rgb(252, 165, 165)',
                },
                warning: {
                  backgroundColor: 'rgba(120, 53, 15, 0.3)',
                  borderColor: 'rgba(251, 191, 36, 0.4)',
                  color: 'rgb(254, 215, 170)',
                },
                info: {
                  backgroundColor: 'rgba(30, 64, 175, 0.3)',
                  borderColor: 'rgba(96, 165, 250, 0.4)',
                  color: 'rgb(191, 219, 254)',
                },
                success: {
                  backgroundColor: 'rgba(20, 83, 45, 0.3)',
                  borderColor: 'rgba(74, 222, 128, 0.4)',
                  color: 'rgb(187, 247, 208)',
                },
              },
              icon: { width: '20px', height: '20px' },
              iconHover: { transform: 'scale(1.1)' },
              message: { fontWeight: 500 },
              closeButton: {
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'currentColor',
                fontSize: '16px',
              },
              closeButtonHover: {
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.1)',
              },
              transition: shared.Ds.medium,
            },
            sacred: {
              container: {
                background: 'rgba(10, 10, 10, 0.9)',
                border: '2px solid rgba(255, 215, 0, 0.4)',
                borderRadius: '12px',
                boxShadow: shared.I4.sacred.small,
                backdropFilter: 'blur(8px)',
                fontFamily: '"Cinzel", serif',
                fontSize: '16px',
                lineHeight: 1.6,
                padding: '24px',
                backgroundImage:
                  '\n        radial-gradient(circle at top right, rgba(255, 215, 0, 0.03) 0%, transparent 50%),\n        radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.02) 0%, transparent 50%)\n      ',
              },
              containerHover: {
                transform: 'translateY(-2px)',
                boxShadow: shared.I4.sacred.medium,
                borderColor: 'rgba(255, 215, 0, 0.6)',
              },
              severity: {
                error: {
                  backgroundColor: 'rgba(10, 10, 10, 0.9)',
                  borderColor: 'rgba(255, 215, 0, 0.4)',
                  color: 'rgba(255, 120, 120, 0.9)',
                  textShadow: '0 0 10px rgba(255, 120, 120, 0.5)',
                },
                warning: {
                  backgroundColor: 'rgba(10, 10, 10, 0.9)',
                  borderColor: 'rgba(255, 215, 0, 0.4)',
                  color: 'rgba(255, 215, 0, 0.9)',
                  textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                },
                info: {
                  backgroundColor: 'rgba(10, 10, 10, 0.9)',
                  borderColor: 'rgba(255, 215, 0, 0.4)',
                  color: 'rgba(120, 200, 255, 0.9)',
                  textShadow: '0 0 10px rgba(120, 200, 255, 0.5)',
                },
                success: {
                  backgroundColor: 'rgba(10, 10, 10, 0.9)',
                  borderColor: 'rgba(255, 215, 0, 0.4)',
                  color: 'rgba(120, 255, 150, 0.9)',
                  textShadow: '0 0 10px rgba(120, 255, 150, 0.5)',
                },
              },
              icon: {
                width: '24px',
                height: '24px',
                filter: 'drop-shadow(0 0 6px currentColor)',
              },
              iconHover: {
                transform: 'scale(1.2) rotate(5deg)',
                filter: 'drop-shadow(0 0 12px currentColor)',
              },
              message: { fontWeight: 600, letterSpacing: '0.02em' },
              closeButton: {
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                background: 'rgba(255, 215, 0, 0.1)',
                color: '#FFD700',
                fontSize: '18px',
                fontFamily: '"Cinzel", serif',
                textShadow: '0 0 6px rgba(255, 215, 0, 0.5)',
              },
              closeButtonHover: {
                background: 'rgba(255, 215, 0, 0.2)',
                borderColor: 'rgba(255, 215, 0, 0.6)',
                transform: 'scale(1.1)',
                boxShadow: '0 0 12px rgba(255, 215, 0, 0.4)',
              },
              transition: shared.Ds.premium,
            },
          },
          getAlertStyles = (styles, severity, isHovered, isClosing) => {
            const themeConfig = (styles => {
                const theme =
                    (null == styles ? void 0 : styles.theme) || 'light',
                  baseTheme = alertThemes[theme]
                return styles
                  ? {
                      container: {
                        background:
                          styles.backgroundColor ||
                          baseTheme.container.background,
                        border: styles.borderColor
                          ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
                          : baseTheme.container.border,
                        borderRadius:
                          styles.borderRadius ||
                          baseTheme.container.borderRadius,
                        boxShadow:
                          styles.boxShadow || baseTheme.container.boxShadow,
                        backdropFilter:
                          styles.backdropFilter ||
                          baseTheme.container.backdropFilter,
                        fontFamily:
                          styles.fontFamily || baseTheme.container.fontFamily,
                        fontSize:
                          styles.fontSize || baseTheme.container.fontSize,
                        lineHeight:
                          styles.lineHeight || baseTheme.container.lineHeight,
                        padding: styles.padding || baseTheme.container.padding,
                        backgroundImage:
                          styles.backgroundImage ||
                          baseTheme.container.backgroundImage,
                      },
                      containerHover: {
                        transform:
                          styles.hoverTransform ||
                          baseTheme.containerHover.transform,
                        boxShadow:
                          styles.hoverBoxShadow ||
                          baseTheme.containerHover.boxShadow,
                        borderColor:
                          styles.hoverBorderColor ||
                          baseTheme.containerHover.borderColor,
                      },
                      severity: {
                        error: {
                          backgroundColor:
                            styles.errorBackgroundColor ||
                            baseTheme.severity.error.backgroundColor,
                          borderColor:
                            styles.errorBorderColor ||
                            baseTheme.severity.error.borderColor,
                          color:
                            styles.errorColor || baseTheme.severity.error.color,
                          textShadow:
                            styles.errorTextShadow ||
                            baseTheme.severity.error.textShadow,
                        },
                        warning: {
                          backgroundColor:
                            styles.warningBackgroundColor ||
                            baseTheme.severity.warning.backgroundColor,
                          borderColor:
                            styles.warningBorderColor ||
                            baseTheme.severity.warning.borderColor,
                          color:
                            styles.warningColor ||
                            baseTheme.severity.warning.color,
                          textShadow:
                            styles.warningTextShadow ||
                            baseTheme.severity.warning.textShadow,
                        },
                        info: {
                          backgroundColor:
                            styles.infoBackgroundColor ||
                            baseTheme.severity.info.backgroundColor,
                          borderColor:
                            styles.infoBorderColor ||
                            baseTheme.severity.info.borderColor,
                          color:
                            styles.infoColor || baseTheme.severity.info.color,
                          textShadow:
                            styles.infoTextShadow ||
                            baseTheme.severity.info.textShadow,
                        },
                        success: {
                          backgroundColor:
                            styles.successBackgroundColor ||
                            baseTheme.severity.success.backgroundColor,
                          borderColor:
                            styles.successBorderColor ||
                            baseTheme.severity.success.borderColor,
                          color:
                            styles.successColor ||
                            baseTheme.severity.success.color,
                          textShadow:
                            styles.successTextShadow ||
                            baseTheme.severity.success.textShadow,
                        },
                      },
                      icon: {
                        width: styles.iconWidth || baseTheme.icon.width,
                        height: styles.iconHeight || baseTheme.icon.height,
                        filter: styles.iconFilter || baseTheme.icon.filter,
                      },
                      iconHover: {
                        transform:
                          styles.iconHoverTransform ||
                          baseTheme.iconHover.transform,
                        filter:
                          styles.iconHoverFilter || baseTheme.iconHover.filter,
                      },
                      message: {
                        fontWeight:
                          styles.messageFontWeight ||
                          baseTheme.message.fontWeight,
                        letterSpacing:
                          styles.messageLetterSpacing ||
                          baseTheme.message.letterSpacing,
                      },
                      closeButton: {
                        width:
                          styles.closeButtonWidth ||
                          baseTheme.closeButton.width,
                        height:
                          styles.closeButtonHeight ||
                          baseTheme.closeButton.height,
                        borderRadius:
                          styles.closeButtonBorderRadius ||
                          baseTheme.closeButton.borderRadius,
                        border:
                          styles.closeButtonBorder ||
                          baseTheme.closeButton.border,
                        background:
                          styles.closeButtonBackground ||
                          baseTheme.closeButton.background,
                        color:
                          styles.closeButtonColor ||
                          baseTheme.closeButton.color,
                        fontSize:
                          styles.closeButtonFontSize ||
                          baseTheme.closeButton.fontSize,
                        fontFamily:
                          styles.closeButtonFontFamily ||
                          baseTheme.closeButton.fontFamily,
                        textShadow:
                          styles.closeButtonTextShadow ||
                          baseTheme.closeButton.textShadow,
                      },
                      closeButtonHover: {
                        background:
                          styles.closeButtonHoverBackground ||
                          baseTheme.closeButtonHover.background,
                        borderColor:
                          styles.closeButtonHoverBorderColor ||
                          baseTheme.closeButtonHover.borderColor,
                        transform:
                          styles.closeButtonHoverTransform ||
                          baseTheme.closeButtonHover.transform,
                        boxShadow:
                          styles.closeButtonHoverBoxShadow ||
                          baseTheme.closeButtonHover.boxShadow,
                      },
                      transition: styles.transitionDuration
                        ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
                        : baseTheme.transition,
                    }
                  : baseTheme
              })(styles),
              severityConfig = severity
                ? themeConfig.severity[severity]
                : themeConfig.severity.info
            return {
              container: {
                display: 'flex',
                alignItems: 'center',
                gap: (null == styles ? void 0 : styles.gap) || '16px',
                position: 'relative',
                overflow: 'hidden',
                transition: themeConfig.transition,
                margin: null == styles ? void 0 : styles.margin,
                marginTop: null == styles ? void 0 : styles.marginTop,
                marginBottom: null == styles ? void 0 : styles.marginBottom,
                marginLeft: null == styles ? void 0 : styles.marginLeft,
                marginRight: null == styles ? void 0 : styles.marginRight,
                width: null == styles ? void 0 : styles.width,
                maxWidth: null == styles ? void 0 : styles.maxWidth,
                minWidth: null == styles ? void 0 : styles.minWidth,
                height: null == styles ? void 0 : styles.height,
                maxHeight: null == styles ? void 0 : styles.maxHeight,
                minHeight: null == styles ? void 0 : styles.minHeight,
                background: themeConfig.container.background,
                border: themeConfig.container.border,
                borderRadius: themeConfig.container.borderRadius,
                boxShadow: themeConfig.container.boxShadow,
                backdropFilter: themeConfig.container.backdropFilter,
                fontFamily: themeConfig.container.fontFamily,
                fontSize: themeConfig.container.fontSize,
                lineHeight: themeConfig.container.lineHeight,
                padding: themeConfig.container.padding,
                backgroundImage: themeConfig.container.backgroundImage,
                backgroundColor: severityConfig.backgroundColor,
                borderColor: severityConfig.borderColor,
                color: severityConfig.color,
                textShadow: severityConfig.textShadow,
                ...(isHovered && {
                  transform: themeConfig.containerHover.transform,
                  boxShadow: themeConfig.containerHover.boxShadow,
                  borderColor: themeConfig.containerHover.borderColor,
                }),
                ...(isClosing && {
                  opacity: 0,
                  transform:
                    'sacred' === (null == styles ? void 0 : styles.theme)
                      ? 'scale(0.95)'
                      : 'scale(0.98)',
                }),
                ...(!1 === (null == styles ? void 0 : styles.outline) && {
                  border: 'none',
                  boxShadow: 'none',
                }),
              },
              icon: {
                width: themeConfig.icon.width,
                height: themeConfig.icon.height,
                flexShrink: 0,
                transition: themeConfig.transition,
                filter: themeConfig.icon.filter,
                ...(isHovered && {
                  transform: themeConfig.iconHover.transform,
                  filter: themeConfig.iconHover.filter,
                }),
              },
              message: {
                flex: 1,
                fontWeight: themeConfig.message.fontWeight,
                letterSpacing: themeConfig.message.letterSpacing,
                color:
                  (null == styles ? void 0 : styles.messageColor) || 'inherit',
              },
              closeButton: {
                width: themeConfig.closeButton.width,
                height: themeConfig.closeButton.height,
                borderRadius: themeConfig.closeButton.borderRadius,
                border: themeConfig.closeButton.border,
                background: themeConfig.closeButton.background,
                color: themeConfig.closeButton.color,
                fontSize: themeConfig.closeButton.fontSize,
                fontFamily: themeConfig.closeButton.fontFamily,
                textShadow: themeConfig.closeButton.textShadow,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: themeConfig.transition,
                flexShrink: 0,
                ...(isHovered && {
                  background: themeConfig.closeButtonHover.background,
                  borderColor: themeConfig.closeButtonHover.borderColor,
                  transform: themeConfig.closeButtonHover.transform,
                  boxShadow: themeConfig.closeButtonHover.boxShadow,
                }),
              },
            }
          },
          buttonThemes = {
            light: {
              container: {
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                borderRadius: '10px',
                boxShadow: shared.I4.light.small,
                backdropFilter: 'blur(8px)',
                fontFamily: '"Inter", sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '-0.025em',
                color: 'rgb(55, 65, 81)',
                padding: '12px 24px',
                minHeight: '44px',
                gap: '8px',
              },
              containerHover: {
                transform: 'translateY(-1px)',
                boxShadow:
                  '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 6px rgba(0, 0, 0, 0.08)',
                backgroundColor: 'rgba(239, 246, 255, 0.95)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                color: 'rgb(29, 78, 216)',
              },
              containerActive: {
                transform: 'translateY(0px)',
                boxShadow:
                  '0 2px 4px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
              },
              containerDisabled: {
                opacity: 0.6,
                backgroundColor: 'rgba(249, 250, 251, 0.8)',
                color: 'rgb(156, 163, 175)',
              },
              transition: shared.Ds.medium,
            },
            dark: {
              container: {
                background: 'rgba(31, 41, 55, 0.95)',
                border: '1px solid rgba(75, 85, 99, 0.8)',
                borderRadius: '10px',
                boxShadow:
                  '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(8px)',
                fontFamily: '"Inter", sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '-0.025em',
                color: 'rgb(243, 244, 246)',
                padding: '12px 24px',
                minHeight: '44px',
                gap: '8px',
              },
              containerHover: {
                transform: 'translateY(-1px)',
                boxShadow:
                  '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)',
                backgroundColor: 'rgba(30, 58, 138, 0.3)',
                borderColor: 'rgba(96, 165, 250, 0.4)',
                color: 'rgb(96, 165, 250)',
              },
              containerActive: {
                transform: 'translateY(0px)',
                boxShadow:
                  '0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
              },
              containerDisabled: {
                opacity: 0.6,
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                color: 'rgb(75, 85, 99)',
              },
              transition: shared.Ds.medium,
            },
            sacred: {
              container: {
                background: 'rgba(10, 10, 10, 0.9)',
                border: '2px solid rgba(255, 215, 0, 0.4)',
                borderRadius: '12px',
                boxShadow: shared.I4.sacred.small,
                backdropFilter: 'blur(8px)',
                fontFamily: '"Cinzel", serif',
                fontSize: '15px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: 'rgba(255, 215, 0, 0.9)',
                textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                textTransform: 'uppercase',
                padding: '16px 32px',
                minHeight: '52px',
                gap: '12px',
              },
              containerHover: {
                transform: 'translateY(-2px)',
                boxShadow: shared.I4.sacred.medium,
                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                borderColor: 'rgba(255, 215, 0, 0.8)',
                color: '#FFD700',
                textShadow: '0 0 15px rgba(255, 215, 0, 0.8)',
              },
              containerActive: {
                transform: 'translateY(-1px)',
                boxShadow:
                  '0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.15)',
              },
              containerDisabled: {
                opacity: 0.4,
                backgroundColor: 'rgba(10, 10, 10, 0.6)',
                color: 'rgba(255, 215, 0, 0.3)',
                borderColor: 'rgba(255, 215, 0, 0.2)',
                textShadow: 'none',
              },
              transition: shared.Ds.premium,
            },
          },
          getButtonStyles = (styles, isHovered, isActive, isDisabled) => {
            const themeConfig = (styles => {
                const theme =
                    (null == styles ? void 0 : styles.theme) || 'light',
                  baseTheme = buttonThemes[theme]
                return styles
                  ? {
                      container: {
                        background:
                          styles.backgroundColor ||
                          baseTheme.container.background,
                        border: styles.borderColor
                          ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
                          : baseTheme.container.border,
                        borderRadius:
                          styles.borderRadius ||
                          baseTheme.container.borderRadius,
                        boxShadow:
                          styles.boxShadow || baseTheme.container.boxShadow,
                        backdropFilter:
                          styles.backdropFilter ||
                          baseTheme.container.backdropFilter,
                        fontFamily:
                          styles.fontFamily || baseTheme.container.fontFamily,
                        fontSize:
                          styles.fontSize || baseTheme.container.fontSize,
                        fontWeight:
                          styles.fontWeight || baseTheme.container.fontWeight,
                        letterSpacing:
                          styles.letterSpacing ||
                          baseTheme.container.letterSpacing,
                        color: styles.color || baseTheme.container.color,
                        textShadow:
                          styles.textShadow || baseTheme.container.textShadow,
                        textTransform:
                          styles.textTransform ||
                          baseTheme.container.textTransform,
                        padding: styles.padding || baseTheme.container.padding,
                        minHeight:
                          styles.minHeight || baseTheme.container.minHeight,
                        gap: styles.gap || baseTheme.container.gap,
                        backgroundImage:
                          styles.backgroundImage ||
                          baseTheme.container.backgroundImage,
                      },
                      containerHover: {
                        transform:
                          styles.hoverTransform ||
                          baseTheme.containerHover.transform,
                        boxShadow:
                          styles.hoverBoxShadow ||
                          baseTheme.containerHover.boxShadow,
                        backgroundColor:
                          styles.hoverBackgroundColor ||
                          baseTheme.containerHover.backgroundColor,
                        borderColor:
                          styles.hoverBorderColor ||
                          baseTheme.containerHover.borderColor,
                        color:
                          styles.hoverColor || baseTheme.containerHover.color,
                        textShadow:
                          styles.hoverTextShadow ||
                          baseTheme.containerHover.textShadow,
                      },
                      containerActive: {
                        transform:
                          styles.activeTransform ||
                          baseTheme.containerActive.transform,
                        boxShadow:
                          styles.activeBoxShadow ||
                          baseTheme.containerActive.boxShadow,
                      },
                      containerDisabled: {
                        opacity:
                          null !==
                            (_styles_disabledOpacity =
                              styles.disabledOpacity) &&
                          void 0 !== _styles_disabledOpacity
                            ? _styles_disabledOpacity
                            : baseTheme.containerDisabled.opacity,
                        backgroundColor:
                          styles.disabledBackgroundColor ||
                          baseTheme.containerDisabled.backgroundColor,
                        color:
                          styles.disabledColor ||
                          baseTheme.containerDisabled.color,
                        borderColor:
                          styles.disabledBorderColor ||
                          baseTheme.containerDisabled.borderColor,
                        textShadow:
                          styles.disabledTextShadow ||
                          baseTheme.containerDisabled.textShadow,
                      },
                      transition: styles.transitionDuration
                        ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
                        : baseTheme.transition,
                    }
                  : baseTheme
                var _styles_disabledOpacity
              })(styles),
              contentAlign =
                (null == styles ? void 0 : styles.contentAlign) || 'center',
              justifyContent =
                'left' === contentAlign
                  ? 'flex-start'
                  : 'right' === contentAlign
                    ? 'flex-end'
                    : 'center',
              flexDirection =
                'above' ===
                ((null == styles ? void 0 : styles.iconLocation) || 'left')
                  ? 'column'
                  : 'row'
            return {
              container: {
                display: 'inline-flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                transition: themeConfig.transition,
                borderRadius: themeConfig.container.borderRadius,
                border: themeConfig.container.border,
                backgroundColor: themeConfig.container.background,
                backdropFilter: themeConfig.container.backdropFilter,
                boxShadow: themeConfig.container.boxShadow,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                fontFamily: themeConfig.container.fontFamily,
                fontSize: themeConfig.container.fontSize,
                fontWeight: themeConfig.container.fontWeight,
                letterSpacing: themeConfig.container.letterSpacing,
                color: themeConfig.container.color,
                textShadow: themeConfig.container.textShadow,
                textTransform: themeConfig.container.textTransform,
                textAlign: 'center',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                padding: themeConfig.container.padding,
                minHeight: themeConfig.container.minHeight,
                gap: themeConfig.container.gap,
                backgroundImage: themeConfig.container.backgroundImage,
                justifyContent,
                flexDirection,
                margin: null == styles ? void 0 : styles.margin,
                marginTop: null == styles ? void 0 : styles.marginTop,
                marginBottom: null == styles ? void 0 : styles.marginBottom,
                marginLeft: null == styles ? void 0 : styles.marginLeft,
                marginRight: null == styles ? void 0 : styles.marginRight,
                width: null == styles ? void 0 : styles.width,
                maxWidth: null == styles ? void 0 : styles.maxWidth,
                minWidth: null == styles ? void 0 : styles.minWidth,
                height: null == styles ? void 0 : styles.height,
                maxHeight: null == styles ? void 0 : styles.maxHeight,
                ...(isDisabled && {
                  opacity: themeConfig.containerDisabled.opacity,
                  backgroundColor:
                    themeConfig.containerDisabled.backgroundColor,
                  color: themeConfig.containerDisabled.color,
                  borderColor: themeConfig.containerDisabled.borderColor,
                  textShadow: themeConfig.containerDisabled.textShadow,
                  transform: 'none',
                  boxShadow: 'none',
                }),
                ...(isHovered &&
                  !isDisabled && {
                    transform: themeConfig.containerHover.transform,
                    boxShadow: themeConfig.containerHover.boxShadow,
                    backgroundColor: themeConfig.containerHover.backgroundColor,
                    borderColor: themeConfig.containerHover.borderColor,
                    color: themeConfig.containerHover.color,
                    textShadow: themeConfig.containerHover.textShadow,
                  }),
                ...(isActive &&
                  !isDisabled && {
                    transform: themeConfig.containerActive.transform,
                    boxShadow: themeConfig.containerActive.boxShadow,
                  }),
                ...(!1 === (null == styles ? void 0 : styles.outline) && {
                  border: 'none',
                  boxShadow: 'none',
                }),
              },
            }
          },
          chipThemes = {
            light: {
              container: {
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '16px',
                boxShadow: shared.I4.light.small,
                backdropFilter: 'blur(4px)',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                color: 'rgb(59, 130, 246)',
                padding: '0 12px',
                height: '28px',
              },
              containerHover: {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                color: 'rgb(59, 130, 246)',
              },
              containerDisabled: {
                opacity: 0.6,
                backgroundColor: 'rgba(156, 163, 175, 0.1)',
                color: 'rgb(156, 163, 175)',
                borderColor: 'rgba(156, 163, 175, 0.2)',
              },
              closeButton: {
                marginLeft: '6px',
                marginRight: '-4px',
                padding: '2px',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                color: 'rgba(59, 130, 246, 0.7)',
                transition: shared.Ds.fast,
              },
              closeButtonHover: {
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: 'rgb(59, 130, 246)',
                transform: 'scale(1.1)',
              },
              closeButtonDisabled: {
                color: 'rgba(156, 163, 175, 0.5)',
                cursor: 'not-allowed',
              },
              glyph: {
                position: 'absolute',
                fontSize: '10px',
                color: 'rgba(59, 130, 246, 0.2)',
                transition: shared.Ds.medium,
                pointerEvents: 'none',
                zIndex: 0,
              },
              glyphLeft: {
                left: '2px',
                top: '50%',
                transform: 'translateY(-50%)',
              },
              glyphRight: {
                right: '2px',
                top: '50%',
                transform: 'translateY(-50%)',
              },
              glyphVisible: { opacity: 0.4 },
              shimmer: {
                position: 'absolute',
                top: '0',
                left: '-100%',
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent)',
                animation: 'sacredShimmer 3s ease-in-out infinite',
              },
              transition: shared.Ds.medium,
            },
            dark: {
              container: {
                background: 'rgba(59, 130, 246, 0.15)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '16px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(4px)',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                color: 'rgb(96, 165, 250)',
                padding: '0 12px',
                height: '28px',
              },
              containerHover: {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgba(59, 130, 246, 0.4)',
                color: 'rgb(147, 197, 253)',
              },
              containerDisabled: {
                opacity: 0.6,
                backgroundColor: 'rgba(75, 85, 99, 0.1)',
                color: 'rgb(75, 85, 99)',
                borderColor: 'rgba(75, 85, 99, 0.2)',
              },
              closeButton: {
                marginLeft: '6px',
                marginRight: '-4px',
                padding: '2px',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                color: 'rgba(96, 165, 250, 0.7)',
                transition: shared.Ds.fast,
              },
              closeButtonHover: {
                backgroundColor: 'rgba(96, 165, 250, 0.1)',
                color: 'rgb(147, 197, 253)',
                transform: 'scale(1.1)',
              },
              closeButtonDisabled: {
                color: 'rgba(75, 85, 99, 0.5)',
                cursor: 'not-allowed',
              },
              glyph: {
                position: 'absolute',
                fontSize: '10px',
                color: 'rgba(96, 165, 250, 0.2)',
                transition: shared.Ds.medium,
                pointerEvents: 'none',
                zIndex: 0,
              },
              glyphLeft: {
                left: '2px',
                top: '50%',
                transform: 'translateY(-50%)',
              },
              glyphRight: {
                right: '2px',
                top: '50%',
                transform: 'translateY(-50%)',
              },
              glyphVisible: { opacity: 0.4 },
              shimmer: {
                position: 'absolute',
                top: '0',
                left: '-100%',
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.2), transparent)',
                animation: 'sacredShimmer 3s ease-in-out infinite',
              },
              transition: shared.Ds.medium,
            },
            sacred: {
              container: {
                background: 'rgba(10, 10, 10, 0.9)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '20px',
                boxShadow: shared.I4.sacred.small,
                backdropFilter: 'blur(8px)',
                fontFamily: 'Cinzel, serif',
                fontSize: '14px',
                fontWeight: '500',
                color: '#FFD700',
                padding: '0 16px',
                height: '32px',
                backgroundImage:
                  'radial-gradient(circle at center, rgba(255, 215, 0, 0.05) 0%, transparent 50%)',
              },
              containerHover: {
                transform: 'translateY(-2px) scale(1.02)',
                boxShadow: shared.I4.sacred.medium,
                backgroundColor: 'rgba(10, 10, 10, 0.95)',
                borderColor: 'rgba(255, 215, 0, 0.6)',
                color: '#FFD700',
                backgroundImage:
                  'radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
              },
              containerDisabled: {
                opacity: 0.4,
                backgroundColor: 'rgba(10, 10, 10, 0.6)',
                color: 'rgba(255, 215, 0, 0.3)',
                borderColor: 'rgba(255, 215, 0, 0.1)',
              },
              closeButton: {
                marginLeft: '8px',
                marginRight: '-4px',
                padding: '3px',
                borderRadius: '50%',
                border: 'none',
                background: 'transparent',
                color: 'rgba(255, 215, 0, 0.7)',
                transition: shared.Ds.premium,
              },
              closeButtonHover: {
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                color: '#FFD700',
                transform: 'scale(1.15) rotate(90deg)',
                boxShadow: '0 0 12px rgba(255, 215, 0, 0.3)',
              },
              closeButtonDisabled: {
                color: 'rgba(255, 215, 0, 0.2)',
                cursor: 'not-allowed',
              },
              glyph: {
                position: 'absolute',
                fontSize: '10px',
                color: 'rgba(255, 215, 0, 0.2)',
                transition: shared.Ds.premium,
                pointerEvents: 'none',
                zIndex: 0,
              },
              glyphLeft: {
                left: '2px',
                top: '50%',
                transform: 'translateY(-50%)',
              },
              glyphRight: {
                right: '2px',
                top: '50%',
                transform: 'translateY(-50%)',
              },
              glyphVisible: { opacity: 0.4 },
              shimmer: {
                position: 'absolute',
                top: '0',
                left: '-100%',
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent)',
                animation: 'sacredShimmer 3s ease-in-out infinite',
              },
              transition: shared.Ds.premium,
            },
          },
          getChipStyles = (styles, isHovered, isDisabled) => {
            const themeConfig = (styles => {
              const theme = (null == styles ? void 0 : styles.theme) || 'light',
                baseTheme = chipThemes[theme]
              return styles
                ? {
                    container: {
                      background:
                        styles.backgroundColor ||
                        baseTheme.container.background,
                      border: styles.borderColor
                        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
                        : baseTheme.container.border,
                      borderRadius:
                        styles.borderRadius || baseTheme.container.borderRadius,
                      boxShadow:
                        styles.boxShadow || baseTheme.container.boxShadow,
                      backdropFilter:
                        styles.backdropFilter ||
                        baseTheme.container.backdropFilter,
                      fontFamily:
                        styles.fontFamily || baseTheme.container.fontFamily,
                      fontSize: styles.fontSize || baseTheme.container.fontSize,
                      fontWeight:
                        styles.fontWeight || baseTheme.container.fontWeight,
                      color: styles.color || baseTheme.container.color,
                      textShadow:
                        styles.textShadow || baseTheme.container.textShadow,
                      padding: styles.padding || baseTheme.container.padding,
                      height: styles.height || baseTheme.container.height,
                      backgroundImage:
                        styles.backgroundImage ||
                        baseTheme.container.backgroundImage,
                    },
                    containerHover: {
                      transform:
                        styles.hoverTransform ||
                        baseTheme.containerHover.transform,
                      boxShadow:
                        styles.hoverBoxShadow ||
                        baseTheme.containerHover.boxShadow,
                      backgroundColor:
                        styles.hoverBackgroundColor ||
                        baseTheme.containerHover.backgroundColor,
                      borderColor:
                        styles.hoverBorderColor ||
                        baseTheme.containerHover.borderColor,
                      color:
                        styles.hoverColor || baseTheme.containerHover.color,
                      backgroundImage:
                        styles.hoverBackgroundImage ||
                        baseTheme.containerHover.backgroundImage,
                    },
                    containerDisabled: {
                      opacity:
                        null !==
                          (_styles_disabledOpacity = styles.disabledOpacity) &&
                        void 0 !== _styles_disabledOpacity
                          ? _styles_disabledOpacity
                          : baseTheme.containerDisabled.opacity,
                      backgroundColor:
                        styles.disabledBackgroundColor ||
                        baseTheme.containerDisabled.backgroundColor,
                      color:
                        styles.disabledColor ||
                        baseTheme.containerDisabled.color,
                      borderColor:
                        styles.disabledBorderColor ||
                        baseTheme.containerDisabled.borderColor,
                      textShadow:
                        styles.disabledTextShadow ||
                        baseTheme.containerDisabled.textShadow,
                    },
                    closeButton: baseTheme.closeButton,
                    closeButtonHover: baseTheme.closeButtonHover,
                    closeButtonDisabled: baseTheme.closeButtonDisabled,
                    glyph: baseTheme.glyph,
                    glyphLeft: baseTheme.glyphLeft,
                    glyphRight: baseTheme.glyphRight,
                    glyphVisible: baseTheme.glyphVisible,
                    shimmer: baseTheme.shimmer,
                    transition: styles.transitionDuration
                      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
                      : baseTheme.transition,
                  }
                : baseTheme
              var _styles_disabledOpacity
            })(styles)
            return {
              container: {
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                transition: themeConfig.transition,
                borderRadius: themeConfig.container.borderRadius,
                border: themeConfig.container.border,
                backgroundColor: themeConfig.container.background,
                backdropFilter: themeConfig.container.backdropFilter,
                boxShadow: themeConfig.container.boxShadow,
                cursor: 'default',
                fontFamily: themeConfig.container.fontFamily,
                fontSize: themeConfig.container.fontSize,
                fontWeight: themeConfig.container.fontWeight,
                color: themeConfig.container.color,
                textShadow: themeConfig.container.textShadow,
                padding: themeConfig.container.padding,
                height: themeConfig.container.height,
                backgroundImage: themeConfig.container.backgroundImage,
                width: null == styles ? void 0 : styles.width,
                maxWidth: null == styles ? void 0 : styles.maxWidth,
                minWidth: null == styles ? void 0 : styles.minWidth,
                maxHeight: null == styles ? void 0 : styles.maxHeight,
                ...(isDisabled && {
                  opacity: themeConfig.containerDisabled.opacity,
                  backgroundColor:
                    themeConfig.containerDisabled.backgroundColor,
                  color: themeConfig.containerDisabled.color,
                  borderColor: themeConfig.containerDisabled.borderColor,
                  textShadow: themeConfig.containerDisabled.textShadow,
                  transform: 'none',
                  boxShadow: 'none',
                }),
                ...(isHovered &&
                  !isDisabled && {
                    transform: themeConfig.containerHover.transform,
                    boxShadow: themeConfig.containerHover.boxShadow,
                    backgroundColor: themeConfig.containerHover.backgroundColor,
                    borderColor: themeConfig.containerHover.borderColor,
                    color: themeConfig.containerHover.color,
                    backgroundImage: themeConfig.containerHover.backgroundImage,
                  }),
                ...(!1 === (null == styles ? void 0 : styles.outline) && {
                  border: 'none',
                  boxShadow: 'none',
                }),
              },
              closeButton: {
                ...themeConfig.closeButton,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                position: 'relative',
                zIndex: 1,
              },
              closeButtonHover: { ...themeConfig.closeButtonHover },
              closeButtonDisabled: { ...themeConfig.closeButtonDisabled },
              glyph: themeConfig.glyph,
              glyphLeft: themeConfig.glyphLeft,
              glyphRight: themeConfig.glyphRight,
              glyphVisible: themeConfig.glyphVisible,
              shimmer: themeConfig.shimmer,
            }
          },
          checkboxThemes = {
            light: {
              wrapper: { transition: shared.Ds.medium },
              container: { width: '24px', height: '24px' },
              box: {
                border: '2px solid rgb(59, 130, 246)',
                borderRadius: '4px',
                backgroundColor: 'rgba(249, 250, 251, 0.9)',
                backdropFilter: 'blur(4px)',
                boxShadow: shared.I4.light.small,
                transition: shared.Ds.medium,
              },
              boxHover: {
                backgroundColor: 'rgba(239, 246, 255, 0.8)',
                borderColor: 'rgb(37, 99, 235)',
                transform: 'scale(1.05)',
                boxShadow:
                  '0 4px 12px rgba(59, 130, 246, 0.2), 0 2px 6px rgba(59, 130, 246, 0.1)',
              },
              boxChecked: {
                backgroundColor: 'rgb(59, 130, 246)',
                borderColor: 'transparent',
                boxShadow:
                  '0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 6px rgba(59, 130, 246, 0.2)',
              },
              boxIndeterminate: {
                backgroundColor: 'rgb(59, 130, 246)',
                borderColor: 'transparent',
                boxShadow:
                  '0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 6px rgba(59, 130, 246, 0.2)',
              },
              boxDisabled: {
                backgroundColor: 'rgba(249, 250, 251, 0.5)',
                borderColor: 'rgb(156, 163, 175)',
                transform: 'none',
                boxShadow: 'none',
              },
              icon: {
                color: 'white',
                transform: 'scale(0.8) translate(2px, 1px)',
                transition: shared.Ds.medium,
              },
              iconVisible: {
                opacity: 1,
                transform: 'scale(1) translate(2px, 1px)',
              },
              iconDisabled: { color: 'rgb(156, 163, 175)' },
            },
            dark: {
              wrapper: { transition: shared.Ds.medium },
              container: { width: '24px', height: '24px' },
              box: {
                border: '2px solid rgb(96, 165, 250)',
                borderRadius: '4px',
                backgroundColor: 'rgba(31, 41, 55, 0.9)',
                backdropFilter: 'blur(4px)',
                boxShadow:
                  '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
                transition: shared.Ds.medium,
              },
              boxHover: {
                backgroundColor: 'rgba(30, 58, 138, 0.3)',
                borderColor: 'rgb(59, 130, 246)',
                transform: 'scale(1.05)',
                boxShadow:
                  '0 4px 12px rgba(96, 165, 250, 0.3), 0 2px 6px rgba(96, 165, 250, 0.2)',
              },
              boxChecked: {
                backgroundColor: 'rgb(96, 165, 250)',
                borderColor: 'transparent',
                boxShadow:
                  '0 4px 12px rgba(96, 165, 250, 0.4), 0 2px 6px rgba(96, 165, 250, 0.3)',
              },
              boxIndeterminate: {
                backgroundColor: 'rgb(96, 165, 250)',
                borderColor: 'transparent',
                boxShadow:
                  '0 4px 12px rgba(96, 165, 250, 0.4), 0 2px 6px rgba(96, 165, 250, 0.3)',
              },
              boxDisabled: {
                backgroundColor: 'rgba(17, 24, 39, 0.5)',
                borderColor: 'rgb(75, 85, 99)',
                transform: 'none',
                boxShadow: 'none',
              },
              icon: {
                color: 'white',
                transform: 'scale(0.8) translate(2px, 1px)',
                transition: shared.Ds.medium,
              },
              iconVisible: {
                opacity: 1,
                transform: 'scale(1) translate(2px, 1px)',
              },
              iconDisabled: { color: 'rgb(75, 85, 99)' },
            },
            sacred: {
              wrapper: { transition: shared.Ds.premium },
              container: { width: '28px', height: '28px' },
              box: {
                border: '2px solid rgba(255, 215, 0, 0.4)',
                borderRadius: '6px',
                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                backdropFilter: 'blur(8px)',
                boxShadow: shared.I4.sacred.small,
                backgroundImage:
                  'radial-gradient(circle at center, rgba(255, 215, 0, 0.05) 0%, transparent 50%)',
                transition: shared.Ds.premium,
              },
              boxHover: {
                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                borderColor: 'rgba(255, 215, 0, 0.8)',
                transform: 'scale(1.1)',
                boxShadow: shared.I4.sacred.medium,
                backgroundImage:
                  'radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
              },
              boxChecked: {
                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                borderColor: '#FFD700',
                boxShadow: shared.I4.sacred.large,
                backgroundImage:
                  '\n        linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(255, 215, 0, 0.1) 100%),\n        radial-gradient(circle at center, rgba(255, 215, 0, 0.15) 0%, transparent 50%)\n      ',
              },
              boxIndeterminate: {
                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                borderColor: '#FFD700',
                boxShadow: shared.I4.sacred.large,
                backgroundImage:
                  '\n        linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(10, 10, 10, 0.9) 50%, rgba(255, 215, 0, 0.1) 100%),\n        radial-gradient(circle at center, rgba(255, 215, 0, 0.15) 0%, transparent 50%)\n      ',
              },
              boxDisabled: {
                backgroundColor: 'rgba(10, 10, 10, 0.6)',
                borderColor: 'rgba(255, 215, 0, 0.2)',
                transform: 'none',
                boxShadow: 'none',
              },
              icon: {
                color: '#FFD700',
                filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))',
                transform: 'scale(0.8) rotate(-10deg) translate(2px, 1px)',
                transition: shared.Ds.premium,
              },
              iconVisible: {
                opacity: 1,
                transform: 'scale(1) rotate(0deg) translate(2px, 1px)',
                filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.8))',
              },
              iconDisabled: { color: 'rgba(255, 215, 0, 0.3)', filter: 'none' },
            },
          },
          getCheckboxStyles = (
            styles,
            isHovered,
            isChecked,
            isIndeterminate,
            isDisabled
          ) => {
            const themeConfig = (styles => {
              const theme = (null == styles ? void 0 : styles.theme) || 'light',
                baseTheme = checkboxThemes[theme]
              return styles
                ? {
                    wrapper: {
                      transition: styles.transitionDuration
                        ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
                        : baseTheme.wrapper.transition,
                    },
                    container: {
                      width: styles.width || baseTheme.container.width,
                      height: styles.height || baseTheme.container.height,
                    },
                    box: {
                      border: styles.borderColor
                        ? `${styles.borderWidth || '2px'} solid ${styles.borderColor}`
                        : baseTheme.box.border,
                      borderRadius:
                        styles.borderRadius || baseTheme.box.borderRadius,
                      backgroundColor:
                        styles.backgroundColor || baseTheme.box.backgroundColor,
                      backdropFilter:
                        styles.backdropFilter || baseTheme.box.backdropFilter,
                      boxShadow: styles.boxShadow || baseTheme.box.boxShadow,
                      backgroundImage:
                        styles.backgroundImage || baseTheme.box.backgroundImage,
                      transition: baseTheme.box.transition,
                    },
                    boxHover: {
                      backgroundColor:
                        styles.hoverBackgroundColor ||
                        baseTheme.boxHover.backgroundColor,
                      borderColor:
                        styles.hoverBorderColor ||
                        baseTheme.boxHover.borderColor,
                      transform:
                        styles.hoverTransform || baseTheme.boxHover.transform,
                      boxShadow:
                        styles.hoverBoxShadow || baseTheme.boxHover.boxShadow,
                      backgroundImage:
                        styles.hoverBackgroundImage ||
                        baseTheme.boxHover.backgroundImage,
                    },
                    boxChecked: {
                      backgroundColor:
                        styles.checkedBackgroundColor ||
                        baseTheme.boxChecked.backgroundColor,
                      borderColor:
                        styles.checkedBorderColor ||
                        baseTheme.boxChecked.borderColor,
                      boxShadow:
                        styles.checkedBoxShadow ||
                        baseTheme.boxChecked.boxShadow,
                      backgroundImage:
                        styles.checkedBackgroundImage ||
                        baseTheme.boxChecked.backgroundImage,
                    },
                    boxIndeterminate: {
                      backgroundColor:
                        styles.indeterminateBackgroundColor ||
                        baseTheme.boxIndeterminate.backgroundColor,
                      borderColor:
                        styles.indeterminateBorderColor ||
                        baseTheme.boxIndeterminate.borderColor,
                      boxShadow:
                        styles.indeterminateBoxShadow ||
                        baseTheme.boxIndeterminate.boxShadow,
                      backgroundImage:
                        styles.indeterminateBackgroundImage ||
                        baseTheme.boxIndeterminate.backgroundImage,
                    },
                    boxDisabled: {
                      backgroundColor:
                        styles.disabledBackgroundColor ||
                        baseTheme.boxDisabled.backgroundColor,
                      borderColor:
                        styles.disabledBorderColor ||
                        baseTheme.boxDisabled.borderColor,
                      transform:
                        styles.disabledTransform ||
                        baseTheme.boxDisabled.transform,
                      boxShadow:
                        styles.disabledBoxShadow ||
                        baseTheme.boxDisabled.boxShadow,
                    },
                    icon: {
                      color: styles.iconColor || baseTheme.icon.color,
                      filter: styles.iconFilter || baseTheme.icon.filter,
                      transform:
                        styles.iconTransform || baseTheme.icon.transform,
                      transition: baseTheme.icon.transition,
                    },
                    iconVisible: {
                      opacity:
                        null !==
                          (_styles_iconVisibleOpacity =
                            styles.iconVisibleOpacity) &&
                        void 0 !== _styles_iconVisibleOpacity
                          ? _styles_iconVisibleOpacity
                          : baseTheme.iconVisible.opacity,
                      transform:
                        styles.iconVisibleTransform ||
                        baseTheme.iconVisible.transform,
                      filter:
                        styles.iconVisibleFilter ||
                        baseTheme.iconVisible.filter,
                    },
                    iconDisabled: {
                      color:
                        styles.iconDisabledColor ||
                        baseTheme.iconDisabled.color,
                      filter:
                        styles.iconDisabledFilter ||
                        baseTheme.iconDisabled.filter,
                    },
                  }
                : baseTheme
              var _styles_iconVisibleOpacity
            })(styles)
            return {
              wrapper: {
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: themeConfig.wrapper.transition,
                margin: null == styles ? void 0 : styles.margin,
                marginTop: null == styles ? void 0 : styles.marginTop,
                marginBottom: null == styles ? void 0 : styles.marginBottom,
                marginLeft: null == styles ? void 0 : styles.marginLeft,
                marginRight: null == styles ? void 0 : styles.marginRight,
              },
              container: {
                position: 'relative',
                width: themeConfig.container.width,
                height: themeConfig.container.height,
                flexShrink: 0,
              },
              input: {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                margin: 0,
                padding: 0,
                zIndex: 3,
              },
              box: {
                pointerEvents: 'none',
                width: '100%',
                height: '100%',
                border: themeConfig.box.border,
                borderRadius: themeConfig.box.borderRadius,
                transition: themeConfig.box.transition,
                backgroundColor: themeConfig.box.backgroundColor,
                backdropFilter: themeConfig.box.backdropFilter,
                boxShadow: themeConfig.box.boxShadow,
                backgroundImage: themeConfig.box.backgroundImage,
                position: 'absolute',
                top: '0',
                left: '0',
                zIndex: 1,
                ...(isHovered &&
                  !isDisabled && {
                    backgroundColor: themeConfig.boxHover.backgroundColor,
                    borderColor: themeConfig.boxHover.borderColor,
                    transform: themeConfig.boxHover.transform,
                    boxShadow: themeConfig.boxHover.boxShadow,
                    backgroundImage: themeConfig.boxHover.backgroundImage,
                  }),
                ...(isChecked && {
                  backgroundColor: themeConfig.boxChecked.backgroundColor,
                  borderColor: themeConfig.boxChecked.borderColor,
                  boxShadow: themeConfig.boxChecked.boxShadow,
                  backgroundImage: themeConfig.boxChecked.backgroundImage,
                }),
                ...(isIndeterminate && {
                  backgroundColor: themeConfig.boxIndeterminate.backgroundColor,
                  borderColor: themeConfig.boxIndeterminate.borderColor,
                  boxShadow: themeConfig.boxIndeterminate.boxShadow,
                  backgroundImage: themeConfig.boxIndeterminate.backgroundImage,
                }),
                ...(isDisabled && {
                  backgroundColor: themeConfig.boxDisabled.backgroundColor,
                  borderColor: themeConfig.boxDisabled.borderColor,
                  transform: themeConfig.boxDisabled.transform,
                  boxShadow: themeConfig.boxDisabled.boxShadow,
                }),
                ...(!1 === (null == styles ? void 0 : styles.outline) && {
                  border: 'none',
                  boxShadow: 'none',
                }),
              },
              icon: {
                pointerEvents: 'none',
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                color: themeConfig.icon.color,
                opacity: 0,
                transition: themeConfig.icon.transition,
                transform: themeConfig.icon.transform,
                filter: themeConfig.icon.filter,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...((isChecked || isIndeterminate) && {
                  opacity: themeConfig.iconVisible.opacity,
                  transform: themeConfig.iconVisible.transform,
                  filter: themeConfig.iconVisible.filter,
                }),
                ...(isDisabled && {
                  color: themeConfig.iconDisabled.color,
                  filter: themeConfig.iconDisabled.filter,
                }),
                ...(!1 === (null == styles ? void 0 : styles.outline) && {
                  transform:
                    'sacred' === (null == styles ? void 0 : styles.theme)
                      ? isChecked || isIndeterminate
                        ? 'scale(1) rotate(0deg) translate(0px, 1px)'
                        : 'scale(0.8) rotate(-10deg) translate(0px, 1px)'
                      : isChecked || isIndeterminate
                        ? 'scale(1) translate(0px, 1px)'
                        : 'scale(0.8) translate(0px, 1px)',
                }),
              },
            }
          },
          lightTheme = {
            container: {
              position: 'relative',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D5DB',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              overflow: 'hidden',
              transition: shared.Ds.medium,
            },
            header: {
              height: '2.5rem',
              width: '100%',
              backgroundColor: '#F3F4F6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 1rem',
              borderTopLeftRadius: 'inherit',
              borderTopRightRadius: 'inherit',
              borderBottom: '1px solid #D1D5DB',
              position: 'relative',
              zIndex: 20,
            },
            langIndicator: {
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            },
            langGlyph: { display: 'none' },
            langText: {
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              color: '#374151',
              fontFamily: 'monospace',
              fontWeight: 600,
              letterSpacing: '0.05em',
            },
            codeBlock: {
              backgroundColor: '#F9FAFB',
              color: '#1F2937',
              flexGrow: 1,
              width: '100%',
              display: 'flex',
              position: 'relative',
              zIndex: 20,
            },
            lineNumbers: {
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderRight: '1px solid #D1D5DB',
              padding: '1rem 0.5rem',
              userSelect: 'none',
              position: 'relative',
            },
            lineNumbersGlyph: { display: 'none' },
            lineNumber: {
              color: '#6B7280',
              fontSize: '0.75rem',
              lineHeight: '1.5rem',
              fontFamily: 'monospace',
              textAlign: 'right',
              paddingRight: '0.5rem',
            },
            pre: {
              backgroundColor: 'transparent',
              margin: 0,
              flexGrow: 1,
              padding: '1rem',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              lineHeight: '1.5rem',
              color: '#1F2937',
            },
            shimmer: { display: 'none' },
            glyph: { display: 'none' },
          },
          darkTheme = {
            container: {
              position: 'relative',
              borderRadius: '8px',
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              overflow: 'hidden',
              transition: shared.Ds.medium,
            },
            header: {
              height: '2.5rem',
              width: '100%',
              backgroundColor: '#111827',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 1rem',
              borderTopLeftRadius: 'inherit',
              borderTopRightRadius: 'inherit',
              borderBottom: '1px solid #374151',
              position: 'relative',
              zIndex: 20,
            },
            langIndicator: {
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            },
            langGlyph: { display: 'none' },
            langText: {
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              color: '#D1D5DB',
              fontFamily: 'monospace',
              fontWeight: 600,
              letterSpacing: '0.05em',
            },
            codeBlock: {
              backgroundColor: '#000000',
              color: '#F9FAFB',
              flexGrow: 1,
              width: '100%',
              display: 'flex',
              position: 'relative',
              zIndex: 20,
            },
            lineNumbers: {
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRight: '1px solid #374151',
              padding: '1rem 0.5rem',
              userSelect: 'none',
              position: 'relative',
            },
            lineNumbersGlyph: { display: 'none' },
            lineNumber: {
              color: '#9CA3AF',
              fontSize: '0.75rem',
              lineHeight: '1.5rem',
              fontFamily: 'monospace',
              textAlign: 'right',
              paddingRight: '0.5rem',
            },
            pre: {
              backgroundColor: 'transparent',
              margin: 0,
              flexGrow: 1,
              padding: '1rem',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              lineHeight: '1.5rem',
              color: '#F9FAFB',
            },
            shimmer: { display: 'none' },
            glyph: { display: 'none' },
          },
          sacredTheme = {
            container: {
              position: 'relative',
              borderRadius: '0px',
              backgroundColor: '#1C1917',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              overflow: 'hidden',
              animation: shared.r5.glow,
              boxShadow: shared.I4.sacred.medium,
            },
            header: {
              height: '2.5rem',
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
              backgroundImage:
                'linear-gradient(to right, rgba(255, 215, 0, 0.1), transparent)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 1rem',
              borderTopLeftRadius: 'inherit',
              borderTopRightRadius: 'inherit',
              position: 'relative',
              zIndex: 20,
            },
            langIndicator: {
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            },
            langGlyph: {
              color: 'rgba(255, 215, 0, 0.6)',
              fontSize: '0.875rem',
              animation: 'glyph-rotate 10s linear infinite',
            },
            langText: {
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              color: 'rgba(255, 215, 0, 0.8)',
              fontFamily: 'Cinzel, serif',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textShadow: '0 0 2px rgba(255,215,0,0.3)',
            },
            codeBlock: {
              backgroundColor: 'transparent',
              color: 'rgba(255, 215, 0, 0.9)',
              flexGrow: 1,
              width: '100%',
              display: 'flex',
              position: 'relative',
              zIndex: 20,
            },
            lineNumbers: {
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRight: '1px solid rgba(255, 215, 0, 0.2)',
              padding: '1rem 0.5rem',
              userSelect: 'none',
              position: 'relative',
            },
            lineNumbersGlyph: {
              position: 'absolute',
              top: '0.25rem',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'rgba(255, 215, 0, 0.2)',
              fontSize: '0.75rem',
            },
            lineNumber: {
              color: 'rgba(255, 215, 0, 0.4)',
              fontSize: '0.75rem',
              lineHeight: '1.5rem',
              fontFamily: 'monospace',
              textAlign: 'right',
              paddingRight: '0.5rem',
            },
            pre: {
              backgroundColor: 'transparent',
              margin: 0,
              flexGrow: 1,
              padding: '1rem',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              lineHeight: '1.5rem',
              color: 'rgba(255, 215, 0, 0.9)',
              textShadow: '0 0 2px rgba(255,215,0,0.2)',
            },
            shimmer: {
              position: 'absolute',
              inset: '0px',
              backgroundImage:
                'linear-gradient(to bottom right, transparent, rgba(255, 215, 0, 0.05), transparent)',
              backgroundSize: '200% 100%',
              animation: 'sacred-code-shimmer 4s linear infinite',
              pointerEvents: 'none',
              zIndex: 10,
            },
            glyph: {
              position: 'absolute',
              fontSize: '1rem',
              color: 'rgba(255, 215, 0, 0.2)',
              pointerEvents: 'none',
              opacity: 0.3,
            },
          },
          getCodeCopyStyles = (styles, isDisabled) => {
            const baseTheme =
              'light' === (null == styles ? void 0 : styles.theme)
                ? lightTheme
                : 'sacred' === (null == styles ? void 0 : styles.theme)
                  ? sacredTheme
                  : darkTheme
            return {
              container: {
                ...baseTheme.container,
                ...((null == styles ? void 0 : styles.containerBackground) && {
                  backgroundColor: styles.containerBackground,
                }),
                ...((null == styles ? void 0 : styles.borderColor) && {
                  borderColor: styles.borderColor,
                }),
                ...((null == styles ? void 0 : styles.borderRadius) && {
                  borderRadius: styles.borderRadius,
                }),
                ...(isDisabled && {
                  opacity: 0.6,
                  pointerEvents: 'none',
                  filter: 'grayscale(0.5)',
                }),
              },
              header: {
                ...baseTheme.header,
                ...((null == styles ? void 0 : styles.headerBackground) && {
                  backgroundColor: styles.headerBackground,
                }),
              },
              langIndicator: baseTheme.langIndicator,
              langGlyph: baseTheme.langGlyph,
              langText: {
                ...baseTheme.langText,
                ...((null == styles ? void 0 : styles.textColor) && {
                  color: styles.textColor,
                }),
              },
              codeBlock: {
                ...baseTheme.codeBlock,
                ...((null == styles ? void 0 : styles.codeBackground) && {
                  backgroundColor: styles.codeBackground,
                }),
              },
              lineNumbers: {
                ...baseTheme.lineNumbers,
                ...(!1 ===
                  (null == styles ? void 0 : styles.showLineNumbers) && {
                  display: 'none',
                }),
              },
              lineNumbersGlyph: baseTheme.lineNumbersGlyph,
              lineNumber: baseTheme.lineNumber,
              pre: {
                ...baseTheme.pre,
                ...((null == styles ? void 0 : styles.fontFamily) && {
                  fontFamily: styles.fontFamily,
                }),
                ...((null == styles ? void 0 : styles.fontSize) && {
                  fontSize: styles.fontSize,
                }),
                ...((null == styles ? void 0 : styles.lineHeight) && {
                  lineHeight: styles.lineHeight,
                }),
                ...((null == styles ? void 0 : styles.textColor) && {
                  color: styles.textColor,
                }),
              },
              shimmer: baseTheme.shimmer,
              glyph: baseTheme.glyph,
            }
          },
          dataGridThemes = {
            light: {
              container: {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                backgroundColor: '#F8FAFC',
                borderRadius: '0.5rem',
                border: '1px solid #E2E8F0',
              },
              error: {
                marginBottom: '0.5rem',
                padding: '1rem',
                borderWidth: '1px',
                borderRadius: '0.25rem',
                backgroundColor: '#FEF2F2',
                color: '#B91C1C',
                borderColor: '#FECACA',
              },
              tableContainer: {
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                position: 'relative',
                margin: '0',
                padding: '0',
              },
              table: {
                tableContainer: {
                  width: '100%',
                  overflowX: 'hidden',
                  borderRadius: '0.5rem',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                },
                tableWrapper: { overflowX: 'visible', width: '100%' },
                table: {
                  width: '100%',
                  minWidth: 'max-content',
                  tableLayout: 'auto',
                  backgroundColor: 'transparent',
                },
              },
              footerContainer: {
                display: 'flex',
                justifyContent: 'center',
                gap: '0.125rem',
                marginTop: '0.5rem',
                opacity: 0.5,
              },
              footerGlyph: {
                color: '#64748B',
                fontSize: '0.75rem',
                animation: 'none',
              },
              glyph: {
                position: 'absolute',
                fontSize: '1.125rem',
                color: 'rgba(100, 116, 139, 0.3)',
                zIndex: 10,
                animation: 'none',
              },
              transition: shared.Ds.medium,
            },
            dark: {
              container: {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                backgroundColor: '#1E293B',
                borderRadius: '0.5rem',
                border: '1px solid #334155',
              },
              error: {
                marginBottom: '0.5rem',
                padding: '1rem',
                borderWidth: '1px',
                borderRadius: '0.25rem',
                backgroundColor: 'rgba(127, 29, 29, 0.3)',
                color: '#F87171',
                borderColor: 'rgba(239, 68, 68, 0.3)',
              },
              tableContainer: {
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                position: 'relative',
                margin: '0',
                padding: '0',
              },
              table: {
                tableContainer: {
                  width: '100%',
                  overflowX: 'hidden',
                  borderRadius: '0.5rem',
                  border: '1px solid #334155',
                  backgroundColor: '#1E293B',
                },
                tableWrapper: { overflowX: 'visible', width: '100%' },
                table: {
                  width: '100%',
                  minWidth: 'max-content',
                  tableLayout: 'auto',
                  backgroundColor: 'transparent',
                },
              },
              footerContainer: {
                display: 'flex',
                justifyContent: 'center',
                gap: '0.125rem',
                marginTop: '0.5rem',
                opacity: 0.5,
              },
              footerGlyph: {
                color: '#64748B',
                fontSize: '0.75rem',
                animation: 'none',
              },
              glyph: {
                position: 'absolute',
                fontSize: '1.125rem',
                color: 'rgba(100, 116, 139, 0.3)',
                zIndex: 10,
                animation: 'none',
              },
              transition: shared.Ds.medium,
            },
            sacred: {
              container: {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(16px)',
                border: '2px solid rgba(255, 215, 0, 0.5)',
                borderRadius: '0.5rem',
                animation: 'datagrid-glow-pulse 2s infinite alternate',
              },
              error: {
                marginBottom: '0.5rem',
                padding: '1rem',
                borderWidth: '1px',
                borderRadius: '0.25rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#F87171',
                borderColor: 'rgba(239, 68, 68, 0.3)',
              },
              tableContainer: {
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                position: 'relative',
                margin: '0',
                padding: '0',
              },
              table: {
                tableContainer: {
                  width: '100%',
                  overflowX: 'hidden',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                tableWrapper: { overflowX: 'visible', width: '100%' },
                table: {
                  width: '100%',
                  minWidth: 'max-content',
                  tableLayout: 'auto',
                  backgroundColor: 'transparent',
                },
              },
              footerContainer: {
                display: 'flex',
                justifyContent: 'center',
                gap: '0.125rem',
                marginTop: '0.5rem',
                opacity: 0.5,
              },
              footerGlyph: {
                color: '#FFD700',
                fontSize: '0.75rem',
                animation: 'datagrid-float 3s ease-in-out infinite',
              },
              glyph: {
                position: 'absolute',
                fontSize: '1.125rem',
                color: 'rgba(255, 215, 0, 0.3)',
                zIndex: 10,
                animation: 'datagrid-float 8s infinite alternate',
              },
              transition: shared.Ds.premium,
            },
          },
          getDataGridStyles = styles => {
            const themeConfig = (styles => {
                const theme =
                    (null == styles ? void 0 : styles.theme) || 'light',
                  baseTheme = dataGridThemes[theme]
                return styles
                  ? {
                      container: {
                        position: baseTheme.container.position,
                        display: baseTheme.container.display,
                        flexDirection: baseTheme.container.flexDirection,
                        width: styles.width || baseTheme.container.width,
                        backgroundColor:
                          styles.backgroundColor ||
                          baseTheme.container.backgroundColor,
                        backdropFilter:
                          styles.backdropFilter ||
                          baseTheme.container.backdropFilter,
                        border: styles.borderColor
                          ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
                          : baseTheme.container.border,
                        borderRadius:
                          styles.borderRadius ||
                          baseTheme.container.borderRadius,
                        animation:
                          styles.animation || baseTheme.container.animation,
                      },
                      error: {
                        marginBottom: baseTheme.error.marginBottom,
                        padding: baseTheme.error.padding,
                        borderWidth: baseTheme.error.borderWidth,
                        borderRadius: baseTheme.error.borderRadius,
                        backgroundColor:
                          styles.errorBackgroundColor ||
                          baseTheme.error.backgroundColor,
                        color: styles.errorColor || baseTheme.error.color,
                        borderColor:
                          styles.errorBorderColor ||
                          baseTheme.error.borderColor,
                      },
                      tableContainer: baseTheme.tableContainer,
                      table: baseTheme.table,
                      footerContainer: baseTheme.footerContainer,
                      footerGlyph: baseTheme.footerGlyph,
                      glyph: baseTheme.glyph,
                      transition: styles.transitionDuration
                        ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
                        : baseTheme.transition,
                    }
                  : baseTheme
              })(styles),
              containerStyle = {
                position: themeConfig.container.position,
                display: themeConfig.container.display,
                flexDirection: themeConfig.container.flexDirection,
                width: themeConfig.container.width,
                backgroundColor: themeConfig.container.backgroundColor,
                backdropFilter: themeConfig.container.backdropFilter,
                border: themeConfig.container.border,
                borderRadius: themeConfig.container.borderRadius,
                animation: themeConfig.container.animation,
                transition: themeConfig.transition,
                height: null == styles ? void 0 : styles.height,
                maxWidth: null == styles ? void 0 : styles.maxWidth,
                minWidth: null == styles ? void 0 : styles.minWidth,
                maxHeight: null == styles ? void 0 : styles.maxHeight,
                minHeight: null == styles ? void 0 : styles.minHeight,
                padding: null == styles ? void 0 : styles.padding,
                margin: null == styles ? void 0 : styles.margin,
              },
              errorStyle = {
                marginBottom: themeConfig.error.marginBottom,
                padding: themeConfig.error.padding,
                borderWidth: themeConfig.error.borderWidth,
                borderRadius: themeConfig.error.borderRadius,
                backgroundColor: themeConfig.error.backgroundColor,
                color: themeConfig.error.color,
                borderColor: themeConfig.error.borderColor,
                borderStyle: 'solid',
              },
              tableContainerStyle = {
                width: themeConfig.tableContainer.width,
                display: themeConfig.tableContainer.display,
                flexDirection: themeConfig.tableContainer.flexDirection,
                alignItems: themeConfig.tableContainer.alignItems,
                position: themeConfig.tableContainer.position,
                margin: themeConfig.tableContainer.margin,
                padding: themeConfig.tableContainer.padding,
              },
              footerContainerStyle = {
                display: themeConfig.footerContainer.display,
                justifyContent: themeConfig.footerContainer.justifyContent,
                gap: themeConfig.footerContainer.gap,
                marginTop: themeConfig.footerContainer.marginTop,
                opacity: themeConfig.footerContainer.opacity,
              },
              footerGlyphStyle = {
                color: themeConfig.footerGlyph.color,
                fontSize: themeConfig.footerGlyph.fontSize,
                animation: themeConfig.footerGlyph.animation,
              },
              glyphStyle = {
                position: themeConfig.glyph.position,
                fontSize: themeConfig.glyph.fontSize,
                color: themeConfig.glyph.color,
                zIndex: themeConfig.glyph.zIndex,
                animation: themeConfig.glyph.animation,
              }
            return {
              container: containerStyle,
              error: errorStyle,
              tableContainer: tableContainerStyle,
              table: {
                tableContainer: {
                  width: themeConfig.table.tableContainer.width,
                  overflowX: themeConfig.table.tableContainer.overflowX,
                  minWidth: themeConfig.table.tableContainer.minWidth,
                  borderRadius: themeConfig.table.tableContainer.borderRadius,
                  overflow: themeConfig.table.tableContainer.overflow,
                  border: themeConfig.table.tableContainer.border,
                  backgroundColor:
                    themeConfig.table.tableContainer.backgroundColor,
                },
                tableWrapper: {
                  overflowX: themeConfig.table.tableWrapper.overflowX,
                  width: themeConfig.table.tableWrapper.width,
                  minWidth: themeConfig.table.tableWrapper.minWidth,
                },
                table: {
                  width: themeConfig.table.table.width,
                  minWidth: themeConfig.table.table.minWidth,
                  tableLayout: themeConfig.table.table.tableLayout,
                  backgroundColor: themeConfig.table.table.backgroundColor,
                },
              },
              footerContainer: footerContainerStyle,
              footerGlyph: footerGlyphStyle,
              glyph: glyphStyle,
            }
          },
          complexTextEditorThemes = {
            light: {
              container: {
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                fontFamily: '"Inter", sans-serif',
              },
              toolbar: {
                background: 'rgba(248, 250, 252, 0.8)',
                borderColor: 'rgba(226, 232, 240, 0.8)',
                borderRadius: '8px 8px 0 0',
                padding: '8px',
                gap: '4px',
              },
              toggleGroup: {
                background: 'rgba(255, 255, 255, 0.9)',
                borderColor: 'rgba(209, 213, 219, 1)',
                borderRadius: '6px',
              },
              editorArea: {
                background: 'rgba(255, 255, 255, 1)',
                borderColor: 'rgba(209, 213, 219, 1)',
                color: 'rgba(31, 41, 55, 1)',
                fontFamily: '"Inter", sans-serif',
                fontSize: '14px',
                lineHeight: '1.5',
                padding: '16px',
                minHeight: '120px',
                borderRadius: '0 0 8px 8px',
                boxShadow: shared.I4.light.small,
              },
              sacred: {
                glyph: {
                  color: 'rgba(255, 215, 0, 0.2)',
                  filter: 'none',
                  animation: 'none',
                },
                borderGlow: 'none',
                textGlow: 'none',
                backgroundImage: 'none',
              },
              transition: shared.Ds.medium,
            },
            dark: {
              container: {
                background: 'rgba(31, 41, 55, 0.95)',
                borderRadius: '8px',
                fontFamily: '"Inter", sans-serif',
              },
              toolbar: {
                background: 'rgba(17, 24, 39, 0.8)',
                borderColor: 'rgba(75, 85, 99, 0.8)',
                borderRadius: '8px 8px 0 0',
                padding: '8px',
                gap: '4px',
              },
              toggleGroup: {
                background: 'rgba(31, 41, 55, 0.9)',
                borderColor: 'rgba(75, 85, 99, 1)',
                borderRadius: '6px',
              },
              editorArea: {
                background: 'rgba(17, 24, 39, 1)',
                borderColor: 'rgba(75, 85, 99, 1)',
                color: 'rgba(243, 244, 246, 1)',
                fontFamily: '"Inter", sans-serif',
                fontSize: '14px',
                lineHeight: '1.5',
                padding: '16px',
                minHeight: '120px',
                borderRadius: '0 0 8px 8px',
                boxShadow:
                  '0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
              },
              sacred: {
                glyph: {
                  color: 'rgba(255, 215, 0, 0.2)',
                  filter: 'none',
                  animation: 'none',
                },
                borderGlow: 'none',
                textGlow: 'none',
                backgroundImage: 'none',
              },
              transition: shared.Ds.medium,
            },
            sacred: {
              container: {
                background: 'rgba(10, 10, 10, 0.9)',
                borderRadius: '12px',
                fontFamily: '"Cinzel", serif',
              },
              toolbar: {
                background: 'rgba(0, 0, 0, 0.5)',
                borderColor: 'rgba(255, 215, 0, 0.3)',
                borderRadius: '12px 12px 0 0',
                padding: '12px',
                gap: '8px',
              },
              toggleGroup: {
                background: 'rgba(10, 10, 10, 0.9)',
                borderColor: 'rgba(255, 215, 0, 0.4)',
                borderRadius: '8px',
              },
              editorArea: {
                background: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'rgba(255, 215, 0, 0.3)',
                color: 'rgba(255, 215, 0, 0.9)',
                fontFamily: '"Cinzel", serif',
                fontSize: '16px',
                lineHeight: '1.6',
                padding: '24px',
                minHeight: '150px',
                borderRadius: '0 0 12px 12px',
                boxShadow: shared.I4.sacred.small,
              },
              sacred: {
                glyph: {
                  color: 'rgba(255, 215, 0, 0.2)',
                  filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.4))',
                  animation:
                    'complexTextEditorGlyphFloat 10s ease-in-out infinite',
                },
                borderGlow: '0 0 20px rgba(255, 215, 0, 0.3)',
                textGlow: '0 0 3px rgba(255, 215, 0, 0.3)',
                backgroundImage:
                  '\n        linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%, rgba(255, 215, 0, 0.05) 100%),\n        radial-gradient(circle at top right, rgba(255, 215, 0, 0.03) 0%, transparent 50%)\n      ',
              },
              transition: shared.Ds.premium,
            },
          },
          getComplexTextEditorStyles = (styles, isFocused) => {
            const themeConfig = (styles => {
                const theme =
                    (null == styles ? void 0 : styles.theme) || 'light',
                  baseTheme = complexTextEditorThemes[theme]
                return styles
                  ? {
                      container: {
                        background:
                          styles.backgroundColor ||
                          baseTheme.container.background,
                        borderRadius:
                          styles.borderRadius ||
                          baseTheme.container.borderRadius,
                        fontFamily:
                          styles.fontFamily || baseTheme.container.fontFamily,
                      },
                      toolbar: {
                        background:
                          styles.toolbarBackground ||
                          baseTheme.toolbar.background,
                        borderColor:
                          styles.toolbarBorderColor ||
                          baseTheme.toolbar.borderColor,
                        borderRadius: baseTheme.toolbar.borderRadius,
                        padding:
                          styles.toolbarPadding || baseTheme.toolbar.padding,
                        gap: styles.toolbarGap || baseTheme.toolbar.gap,
                      },
                      toggleGroup: {
                        background:
                          styles.toggleBackground ||
                          baseTheme.toggleGroup.background,
                        borderColor:
                          styles.toggleBorderColor ||
                          baseTheme.toggleGroup.borderColor,
                        borderRadius: baseTheme.toggleGroup.borderRadius,
                      },
                      editorArea: {
                        background:
                          styles.editorBackground ||
                          baseTheme.editorArea.background,
                        borderColor:
                          styles.editorBorderColor ||
                          baseTheme.editorArea.borderColor,
                        color: styles.textColor || baseTheme.editorArea.color,
                        fontFamily:
                          styles.editorFontFamily ||
                          baseTheme.editorArea.fontFamily,
                        fontSize:
                          styles.editorFontSize ||
                          baseTheme.editorArea.fontSize,
                        lineHeight:
                          styles.editorLineHeight ||
                          baseTheme.editorArea.lineHeight,
                        padding:
                          styles.editorPadding || baseTheme.editorArea.padding,
                        minHeight:
                          styles.editorMinHeight ||
                          baseTheme.editorArea.minHeight,
                        borderRadius: baseTheme.editorArea.borderRadius,
                        boxShadow:
                          styles.editorBoxShadow ||
                          baseTheme.editorArea.boxShadow,
                      },
                      sacred: {
                        glyph: {
                          color:
                            styles.sacredGlyphColor ||
                            baseTheme.sacred.glyph.color,
                          filter:
                            styles.sacredGlyphFilter ||
                            baseTheme.sacred.glyph.filter,
                          animation:
                            styles.sacredGlyphAnimation ||
                            baseTheme.sacred.glyph.animation,
                        },
                        borderGlow:
                          styles.sacredBorderGlow ||
                          baseTheme.sacred.borderGlow,
                        textGlow:
                          styles.sacredTextGlow || baseTheme.sacred.textGlow,
                        backgroundImage:
                          styles.sacredBackgroundImage ||
                          baseTheme.sacred.backgroundImage,
                      },
                      transition: styles.transitionDuration
                        ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
                        : baseTheme.transition,
                    }
                  : baseTheme
              })(styles),
              formFieldTheme = getFormFieldTheme(styles),
              isSacredTheme =
                'sacred' === (null == styles ? void 0 : styles.theme)
            return {
              container: {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                background: themeConfig.container.background,
                borderRadius: themeConfig.container.borderRadius,
                fontFamily: themeConfig.container.fontFamily,
                transition: themeConfig.transition,
                margin: null == styles ? void 0 : styles.margin,
                marginTop: null == styles ? void 0 : styles.marginTop,
                marginBottom: null == styles ? void 0 : styles.marginBottom,
                marginLeft: null == styles ? void 0 : styles.marginLeft,
                marginRight: null == styles ? void 0 : styles.marginRight,
                width: (null == styles ? void 0 : styles.width) || '100%',
                maxWidth: null == styles ? void 0 : styles.maxWidth,
                minWidth: null == styles ? void 0 : styles.minWidth,
                height: null == styles ? void 0 : styles.height,
                maxHeight: null == styles ? void 0 : styles.maxHeight,
                minHeight: null == styles ? void 0 : styles.minHeight,
                ...(isSacredTheme && {
                  backgroundImage: themeConfig.sacred.backgroundImage,
                  boxShadow: themeConfig.sacred.borderGlow,
                }),
                ...((null == styles ? void 0 : styles.disabled) && {
                  opacity: 0.6,
                  pointerEvents: 'none',
                }),
              },
              toolbar: {
                display:
                  !1 === (null == styles ? void 0 : styles.showToolbar)
                    ? 'none'
                    : 'flex',
                flexDirection: 'column',
                background: themeConfig.toolbar.background,
                borderBottom: `1px solid ${themeConfig.toolbar.borderColor}`,
                borderRadius: themeConfig.toolbar.borderRadius,
                padding: themeConfig.toolbar.padding,
                gap: themeConfig.toolbar.gap,
              },
              toggleRow: {
                display:
                  !1 === (null == styles ? void 0 : styles.showModeToggle)
                    ? 'none'
                    : 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              },
              editorArea: {
                background: themeConfig.editorArea.background,
                border: `1px solid ${isFocused ? formFieldTheme.border.focused : themeConfig.editorArea.borderColor}`,
                borderRadius: themeConfig.editorArea.borderRadius,
                color: themeConfig.editorArea.color,
                fontFamily: themeConfig.editorArea.fontFamily,
                fontSize: themeConfig.editorArea.fontSize,
                lineHeight: themeConfig.editorArea.lineHeight,
                padding: themeConfig.editorArea.padding,
                minHeight: themeConfig.editorArea.minHeight,
                boxShadow: themeConfig.editorArea.boxShadow,
                transition: themeConfig.transition,
                outline: 'none',
                resize: 'vertical',
                ...(isSacredTheme && {
                  textShadow: themeConfig.sacred.textGlow,
                }),
                ...('error' ===
                  (null == styles ? void 0 : styles.helperTextType) && {
                  borderColor: formFieldTheme.border.error,
                  color: formFieldTheme.footerText.error,
                }),
              },
              sacredGlyph: {
                position: 'absolute',
                bottom: '-20px',
                right: '20px',
                fontSize: '48px',
                color: themeConfig.sacred.glyph.color,
                filter: themeConfig.sacred.glyph.filter,
                animation: themeConfig.sacred.glyph.animation,
                pointerEvents: 'none',
                zIndex: 0,
                transition: themeConfig.transition,
              },
            }
          },
          confirmationCodeInputThemes = {
            light: {
              container: {
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                borderRadius: '12px',
                boxShadow: shared.I4.light.small,
                backdropFilter: 'blur(8px)',
                padding: '1.5rem',
              },
              containerHover: {
                transform: 'translateY(-1px)',
                boxShadow: shared.I4.light.medium,
                borderColor: 'rgba(59, 130, 246, 0.3)',
              },
              successContainer: {
                background: 'rgba(240, 253, 244, 0.95)',
                border: '1px solid rgba(74, 222, 128, 0.4)',
                borderRadius: '12px',
                boxShadow: shared.I4.light.small,
                backdropFilter: 'blur(8px)',
                padding: '1.5rem',
              },
              successIcon: {
                fontSize: '3.75rem',
                color: 'rgb(34, 197, 94)',
                filter: 'drop-shadow(0 2px 4px rgba(34, 197, 94, 0.3))',
              },
              successMessage: {
                fontSize: '1.5rem',
                lineHeight: '2rem',
                color: 'rgb(21, 128, 61)',
                fontFamily: '"Inter", sans-serif',
                fontWeight: '600',
                letterSpacing: '-0.025em',
                textTransform: 'none',
              },
              input: {
                width: '3rem',
                height: '3.5rem',
                padding: '0',
                fontSize: '1.25rem',
                fontFamily: '"Inter", sans-serif',
                fontWeight: '500',
                letterSpacing: '0.05em',
                color: 'rgb(31, 41, 55)',
                backgroundColor: 'rgb(255, 255, 255)',
                borderColor: 'rgb(209, 213, 219)',
                borderRadius: '8px',
                borderWidth: '1px',
              },
              inputFocus: {
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: '2px',
                transform: 'scale(1.02)',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
              },
              statusIndicator: {
                width: '1.25rem',
                height: '1.25rem',
                borderRadius: '50%',
                backgroundColor: 'rgb(239, 68, 68)',
              },
              statusIndicatorValid: { backgroundColor: 'rgb(34, 197, 94)' },
              transition: shared.Ds.medium,
            },
            dark: {
              container: {
                background: 'rgba(31, 41, 55, 0.95)',
                border: '1px solid rgba(75, 85, 99, 0.8)',
                borderRadius: '12px',
                boxShadow:
                  '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(8px)',
                padding: '1.5rem',
              },
              containerHover: {
                transform: 'translateY(-1px)',
                boxShadow:
                  '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)',
                borderColor: 'rgba(96, 165, 250, 0.4)',
              },
              successContainer: {
                background: 'rgba(20, 83, 45, 0.3)',
                border: '1px solid rgba(74, 222, 128, 0.4)',
                borderRadius: '12px',
                boxShadow:
                  '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(8px)',
                padding: '1.5rem',
              },
              successIcon: {
                fontSize: '3.75rem',
                color: 'rgb(187, 247, 208)',
                filter: 'drop-shadow(0 2px 4px rgba(187, 247, 208, 0.3))',
              },
              successMessage: {
                fontSize: '1.5rem',
                lineHeight: '2rem',
                color: 'rgb(187, 247, 208)',
                fontFamily: '"Inter", sans-serif',
                fontWeight: '600',
                letterSpacing: '-0.025em',
                textTransform: 'none',
              },
              input: {
                width: '3rem',
                height: '3.5rem',
                padding: '0',
                fontSize: '1.25rem',
                fontFamily: '"Inter", sans-serif',
                fontWeight: '500',
                letterSpacing: '0.05em',
                color: 'rgb(243, 244, 246)',
                backgroundColor: 'rgb(55, 65, 81)',
                borderColor: 'rgb(107, 114, 128)',
                borderRadius: '8px',
                borderWidth: '1px',
              },
              inputFocus: {
                borderColor: 'rgb(96, 165, 250)',
                borderWidth: '2px',
                transform: 'scale(1.02)',
                boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.1)',
              },
              statusIndicator: {
                width: '1.25rem',
                height: '1.25rem',
                borderRadius: '50%',
                backgroundColor: 'rgb(248, 113, 113)',
              },
              statusIndicatorValid: { backgroundColor: 'rgb(74, 222, 128)' },
              transition: shared.Ds.medium,
            },
            sacred: {
              container: {
                background: 'rgba(10, 10, 10, 0.95)',
                border: '2px solid rgba(255, 215, 0, 0.4)',
                borderRadius: '12px',
                boxShadow: shared.I4.sacred.small,
                backdropFilter: 'blur(8px)',
                padding: '1.5rem',
                backgroundImage:
                  '\n        radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),\n        radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.03) 0%, transparent 50%)\n      ',
              },
              containerHover: {
                transform: 'translateY(-2px)',
                boxShadow: shared.I4.sacred.medium,
                borderColor: 'rgba(255, 215, 0, 0.6)',
              },
              successContainer: {
                background: 'rgba(10, 10, 10, 0.95)',
                border: '2px solid rgba(255, 215, 0, 0.6)',
                borderRadius: '12px',
                boxShadow: shared.I4.sacred.medium,
                backdropFilter: 'blur(8px)',
                padding: '1.5rem',
                backgroundImage:
                  '\n        radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 50%),\n        linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, transparent 50%)\n      ',
              },
              successIcon: {
                fontSize: '3.75rem',
                color: '#FFD700',
                filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
                animation: 'sacred-pulse 1.5s infinite',
              },
              successMessage: {
                fontSize: '1.5rem',
                lineHeight: '2rem',
                color: '#FFD700',
                fontFamily: '"Cinzel", serif',
                fontWeight: '600',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
              },
              input: {
                width: '3rem',
                height: '3.5rem',
                padding: '0',
                fontSize: '1.25rem',
                fontFamily: 'monospace',
                fontWeight: '600',
                letterSpacing: '0.1em',
                color: '#FFD700',
                backgroundColor: 'rgba(26, 26, 26, 0.9)',
                borderColor: 'rgba(255, 215, 0, 0.5)',
                borderRadius: '8px',
                borderWidth: '1px',
                textShadow: '0 0 2px rgba(255, 215, 0, 0.5)',
                animation: 'sacred-input-glow 3s infinite alternate',
              },
              inputFocus: {
                borderColor: '#FFD700',
                borderWidth: '2px',
                transform: 'scale(1.05)',
                boxShadow:
                  '0 0 20px rgba(255, 215, 0, 0.6), inset 0 0 15px rgba(255, 215, 0, 0.3)',
              },
              statusIndicator: {
                width: '1.25rem',
                height: '1.25rem',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 215, 0, 0.3)',
              },
              statusIndicatorValid: {
                backgroundColor: '#FFD700',
                animation: 'sacred-status-glow 1.5s infinite alternate',
              },
              transition: shared.Ds.slow,
            },
          },
          getConfirmationCodeInputStyles = (
            styles,
            isHovered,
            isValid,
            isDisabled
          ) => {
            const themeConfig = (styles => {
              const theme = (null == styles ? void 0 : styles.theme) || 'light',
                baseTheme = confirmationCodeInputThemes[theme]
              return styles
                ? {
                    container: {
                      background:
                        styles.backgroundColor ||
                        baseTheme.container.background,
                      border: styles.borderColor
                        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
                        : baseTheme.container.border,
                      borderRadius:
                        styles.borderRadius || baseTheme.container.borderRadius,
                      boxShadow:
                        styles.boxShadow || baseTheme.container.boxShadow,
                      backdropFilter:
                        styles.backdropFilter ||
                        baseTheme.container.backdropFilter,
                      padding: styles.padding || baseTheme.container.padding,
                      backgroundImage:
                        styles.backgroundImage ||
                        baseTheme.container.backgroundImage,
                    },
                    containerHover: {
                      transform:
                        styles.hoverTransform ||
                        baseTheme.containerHover.transform,
                      boxShadow:
                        styles.hoverBoxShadow ||
                        baseTheme.containerHover.boxShadow,
                      borderColor:
                        styles.hoverBorderColor ||
                        baseTheme.containerHover.borderColor,
                    },
                    successContainer: {
                      background:
                        styles.successBackgroundColor ||
                        baseTheme.successContainer.background,
                      border: styles.successBorderColor
                        ? `${styles.borderWidth || '1px'} solid ${styles.successBorderColor}`
                        : baseTheme.successContainer.border,
                      borderRadius:
                        styles.successBorderRadius ||
                        baseTheme.successContainer.borderRadius,
                      boxShadow:
                        styles.successBoxShadow ||
                        baseTheme.successContainer.boxShadow,
                      backdropFilter:
                        styles.successBackdropFilter ||
                        baseTheme.successContainer.backdropFilter,
                      padding:
                        styles.successPadding ||
                        baseTheme.successContainer.padding,
                      backgroundImage:
                        styles.successBackgroundImage ||
                        baseTheme.successContainer.backgroundImage,
                    },
                    successIcon: {
                      fontSize:
                        styles.successIconFontSize ||
                        baseTheme.successIcon.fontSize,
                      color:
                        styles.successIconColor || baseTheme.successIcon.color,
                      filter:
                        styles.successIconFilter ||
                        baseTheme.successIcon.filter,
                      animation:
                        styles.successIconAnimation ||
                        baseTheme.successIcon.animation,
                    },
                    successMessage: {
                      fontSize:
                        styles.successMessageFontSize ||
                        baseTheme.successMessage.fontSize,
                      lineHeight:
                        styles.successMessageLineHeight ||
                        baseTheme.successMessage.lineHeight,
                      color:
                        styles.successMessageColor ||
                        baseTheme.successMessage.color,
                      fontFamily:
                        styles.successMessageFontFamily ||
                        baseTheme.successMessage.fontFamily,
                      fontWeight:
                        styles.successMessageFontWeight ||
                        baseTheme.successMessage.fontWeight,
                      letterSpacing:
                        styles.successMessageLetterSpacing ||
                        baseTheme.successMessage.letterSpacing,
                      textTransform:
                        styles.successMessageTextTransform ||
                        baseTheme.successMessage.textTransform,
                      textShadow:
                        styles.successMessageTextShadow ||
                        baseTheme.successMessage.textShadow,
                    },
                    input: {
                      width: styles.inputWidth || baseTheme.input.width,
                      height: styles.inputHeight || baseTheme.input.height,
                      padding: styles.inputPadding || baseTheme.input.padding,
                      fontSize:
                        styles.inputFontSize || baseTheme.input.fontSize,
                      fontFamily:
                        styles.inputFontFamily || baseTheme.input.fontFamily,
                      fontWeight:
                        styles.inputFontWeight || baseTheme.input.fontWeight,
                      letterSpacing:
                        styles.inputLetterSpacing ||
                        baseTheme.input.letterSpacing,
                      color: styles.inputColor || baseTheme.input.color,
                      backgroundColor:
                        styles.inputBackgroundColor ||
                        baseTheme.input.backgroundColor,
                      borderColor:
                        styles.inputBorderColor || baseTheme.input.borderColor,
                      borderRadius:
                        styles.inputBorderRadius ||
                        baseTheme.input.borderRadius,
                      borderWidth:
                        styles.inputBorderWidth || baseTheme.input.borderWidth,
                      textShadow:
                        styles.inputTextShadow || baseTheme.input.textShadow,
                      animation:
                        styles.inputAnimation || baseTheme.input.animation,
                    },
                    inputFocus: {
                      borderColor:
                        styles.inputFocusBorderColor ||
                        baseTheme.inputFocus.borderColor,
                      borderWidth:
                        styles.inputFocusBorderWidth ||
                        baseTheme.inputFocus.borderWidth,
                      transform:
                        styles.inputFocusTransform ||
                        baseTheme.inputFocus.transform,
                      boxShadow:
                        styles.inputFocusBoxShadow ||
                        baseTheme.inputFocus.boxShadow,
                    },
                    statusIndicator: {
                      width:
                        styles.statusIndicatorWidth ||
                        baseTheme.statusIndicator.width,
                      height:
                        styles.statusIndicatorHeight ||
                        baseTheme.statusIndicator.height,
                      borderRadius:
                        styles.statusIndicatorBorderRadius ||
                        baseTheme.statusIndicator.borderRadius,
                      backgroundColor:
                        styles.statusIndicatorBackgroundColor ||
                        baseTheme.statusIndicator.backgroundColor,
                      animation:
                        styles.statusIndicatorAnimation ||
                        baseTheme.statusIndicator.animation,
                    },
                    statusIndicatorValid: {
                      backgroundColor:
                        styles.statusIndicatorValidBackgroundColor ||
                        baseTheme.statusIndicatorValid.backgroundColor,
                      animation:
                        styles.statusIndicatorValidAnimation ||
                        baseTheme.statusIndicatorValid.animation,
                    },
                    transition: styles.transitionDuration
                      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
                      : baseTheme.transition,
                  }
                : baseTheme
            })(styles)
            return {
              container: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                width: (null == styles ? void 0 : styles.width) || '100%',
                maxWidth: null == styles ? void 0 : styles.maxWidth,
                minWidth: null == styles ? void 0 : styles.minWidth,
                height: null == styles ? void 0 : styles.height,
                maxHeight: null == styles ? void 0 : styles.maxHeight,
                minHeight: null == styles ? void 0 : styles.minHeight,
                margin: null == styles ? void 0 : styles.margin,
                marginTop: null == styles ? void 0 : styles.marginTop,
                marginBottom: null == styles ? void 0 : styles.marginBottom,
                marginLeft: null == styles ? void 0 : styles.marginLeft,
                marginRight: null == styles ? void 0 : styles.marginRight,
                background: themeConfig.container.background,
                border: themeConfig.container.border,
                borderRadius: themeConfig.container.borderRadius,
                boxShadow: themeConfig.container.boxShadow,
                backdropFilter: themeConfig.container.backdropFilter,
                padding: themeConfig.container.padding,
                backgroundImage: themeConfig.container.backgroundImage,
                transition: themeConfig.transition,
                opacity: isDisabled ? 0.5 : 1,
                cursor: isDisabled ? 'not-allowed' : 'default',
                ...(isHovered &&
                  !isDisabled && {
                    transform: themeConfig.containerHover.transform,
                    boxShadow: themeConfig.containerHover.boxShadow,
                    borderColor: themeConfig.containerHover.borderColor,
                  }),
              },
              successContainer: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
                background: themeConfig.successContainer.background,
                border: themeConfig.successContainer.border,
                borderRadius: themeConfig.successContainer.borderRadius,
                boxShadow: themeConfig.successContainer.boxShadow,
                backdropFilter: themeConfig.successContainer.backdropFilter,
                padding: themeConfig.successContainer.padding,
                backgroundImage: themeConfig.successContainer.backgroundImage,
                transition: themeConfig.transition,
              },
              successIcon: {
                fontSize: themeConfig.successIcon.fontSize,
                color: themeConfig.successIcon.color,
                filter: themeConfig.successIcon.filter,
                animation: themeConfig.successIcon.animation,
              },
              successMessage: {
                fontSize: themeConfig.successMessage.fontSize,
                lineHeight: themeConfig.successMessage.lineHeight,
                color: themeConfig.successMessage.color,
                fontFamily: themeConfig.successMessage.fontFamily,
                fontWeight: themeConfig.successMessage.fontWeight,
                letterSpacing: themeConfig.successMessage.letterSpacing,
                textTransform: themeConfig.successMessage.textTransform,
                textShadow: themeConfig.successMessage.textShadow,
                textAlign: 'center',
                margin: 0,
              },
              input: {
                width: themeConfig.input.width,
                height: themeConfig.input.height,
                padding: themeConfig.input.padding,
                fontSize: themeConfig.input.fontSize,
                fontFamily: themeConfig.input.fontFamily,
                fontWeight: themeConfig.input.fontWeight,
                letterSpacing: themeConfig.input.letterSpacing,
                color: themeConfig.input.color,
                backgroundColor: themeConfig.input.backgroundColor,
                border: `${themeConfig.input.borderWidth} solid ${themeConfig.input.borderColor}`,
                borderRadius: themeConfig.input.borderRadius,
                textShadow: themeConfig.input.textShadow,
                animation: themeConfig.input.animation,
                textAlign: 'center',
                outline: 'none',
                transition: themeConfig.transition,
              },
              inputFocus: {
                borderColor: themeConfig.inputFocus.borderColor,
                borderWidth: themeConfig.inputFocus.borderWidth,
                transform: themeConfig.inputFocus.transform,
                boxShadow: themeConfig.inputFocus.boxShadow,
              },
              statusIndicator: {
                width: themeConfig.statusIndicator.width,
                height: themeConfig.statusIndicator.height,
                borderRadius: themeConfig.statusIndicator.borderRadius,
                backgroundColor: isValid
                  ? themeConfig.statusIndicatorValid.backgroundColor
                  : themeConfig.statusIndicator.backgroundColor,
                animation: isValid
                  ? themeConfig.statusIndicatorValid.animation
                  : themeConfig.statusIndicator.animation,
                transition: themeConfig.transition,
              },
              mainContent: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                gap: (null == styles ? void 0 : styles.gap) || '1.25rem',
              },
              inputsRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
              inputGroup: {
                display: 'flex',
                gap: (null == styles ? void 0 : styles.inputGap) || '0.75rem',
              },
              buttonContainer: {
                display: 'flex',
                gap: '0.5rem',
                width: '100%',
              },
            }
          },
          drawerThemes = {
            light: {
              permanent: {
                background: 'rgba(255, 255, 255, 0.95)',
                borderRight: '1px solid rgba(226, 232, 240, 0.8)',
                borderLeft: 'none',
                boxShadow: shared.I4.light.medium,
                backdropFilter: 'blur(8px)',
              },
              temporary: {
                background: 'rgba(255, 255, 255, 0.95)',
                borderRight: '1px solid rgba(226, 232, 240, 0.8)',
                borderLeft: 'none',
                boxShadow: shared.I4.light.large,
                backdropFilter: 'blur(8px)',
              },
              backdrop: {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(2px)',
              },
              transition: shared.Ds.medium,
            },
            dark: {
              permanent: {
                background: 'rgba(31, 41, 55, 0.95)',
                borderRight: '1px solid rgba(75, 85, 99, 0.8)',
                borderLeft: 'none',
                boxShadow:
                  '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
              },
              temporary: {
                background: 'rgba(31, 41, 55, 0.95)',
                borderRight: '1px solid rgba(75, 85, 99, 0.8)',
                borderLeft: 'none',
                boxShadow:
                  '0 8px 25px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(8px)',
              },
              backdrop: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(2px)',
              },
              transition: shared.Ds.medium,
            },
            sacred: {
              permanent: {
                background: 'rgba(10, 10, 10, 0.95)',
                borderRight: '2px solid rgba(255, 215, 0, 0.4)',
                borderLeft: 'none',
                boxShadow: shared.I4.sacred.large,
                backdropFilter: 'blur(8px)',
                backgroundImage:
                  '\n        radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),\n        radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.03) 0%, transparent 50%)\n      ',
              },
              temporary: {
                background: 'rgba(10, 10, 10, 0.95)',
                borderRight: '2px solid rgba(255, 215, 0, 0.6)',
                borderLeft: 'none',
                boxShadow: shared.I4.sacred.large,
                backdropFilter: 'blur(8px)',
                backgroundImage:
                  '\n        radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%),\n        radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.05) 0%, transparent 50%),\n        linear-gradient(135deg, rgba(255, 215, 0, 0.02) 0%, transparent 50%)\n      ',
              },
              backdrop: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(4px)',
              },
              transition: shared.Ds.slow,
            },
          },
          getDrawerStyles = (styles, open, anchor, _variant) => {
            const themeConfig = (styles => {
                const theme =
                    (null == styles ? void 0 : styles.theme) || 'light',
                  baseTheme = drawerThemes[theme]
                return styles
                  ? {
                      permanent: {
                        background:
                          styles.permanentBackground ||
                          baseTheme.permanent.background,
                        borderRight:
                          styles.permanentBorderRight ||
                          baseTheme.permanent.borderRight,
                        borderLeft:
                          styles.permanentBorderLeft ||
                          baseTheme.permanent.borderLeft,
                        boxShadow:
                          styles.permanentBoxShadow ||
                          baseTheme.permanent.boxShadow,
                        backdropFilter:
                          styles.permanentBackdropFilter ||
                          baseTheme.permanent.backdropFilter,
                        backgroundImage:
                          styles.permanentBackgroundImage ||
                          baseTheme.permanent.backgroundImage,
                      },
                      temporary: {
                        background:
                          styles.temporaryBackground ||
                          baseTheme.temporary.background,
                        borderRight:
                          styles.temporaryBorderRight ||
                          baseTheme.temporary.borderRight,
                        borderLeft:
                          styles.temporaryBorderLeft ||
                          baseTheme.temporary.borderLeft,
                        boxShadow:
                          styles.temporaryBoxShadow ||
                          baseTheme.temporary.boxShadow,
                        backdropFilter:
                          styles.temporaryBackdropFilter ||
                          baseTheme.temporary.backdropFilter,
                        backgroundImage:
                          styles.temporaryBackgroundImage ||
                          baseTheme.temporary.backgroundImage,
                      },
                      backdrop: {
                        backgroundColor:
                          styles.backdropBackgroundColor ||
                          baseTheme.backdrop.backgroundColor,
                        backdropFilter:
                          styles.backdropBackdropFilter ||
                          baseTheme.backdrop.backdropFilter,
                      },
                      transition: styles.transitionDuration
                        ? `transform ${styles.transitionDuration} ${styles.transitionEasing || 'ease-in-out'}`
                        : baseTheme.transition,
                    }
                  : baseTheme
              })(styles),
              anchorSide = anchor || 'left'
            return {
              permanent: {
                height: (null == styles ? void 0 : styles.height) || '100%',
                position: 'fixed',
                top: 0,
                [anchorSide]: 0,
                width: (null == styles ? void 0 : styles.width) || '240px',
                maxWidth: null == styles ? void 0 : styles.maxWidth,
                minWidth: null == styles ? void 0 : styles.minWidth,
                maxHeight: null == styles ? void 0 : styles.maxHeight,
                minHeight: null == styles ? void 0 : styles.minHeight,
                padding: null == styles ? void 0 : styles.padding,
                margin: null == styles ? void 0 : styles.margin,
                background: themeConfig.permanent.background,
                ['left' === anchorSide ? 'borderRight' : 'borderLeft']:
                  'left' === anchorSide
                    ? themeConfig.permanent.borderRight
                    : themeConfig.permanent.borderLeft,
                boxShadow: themeConfig.permanent.boxShadow,
                backdropFilter: themeConfig.permanent.backdropFilter,
                backgroundImage: themeConfig.permanent.backgroundImage,
                zIndex: (null == styles ? void 0 : styles.zIndex) || 30,
                opacity: (null == styles ? void 0 : styles.disabled) ? 0.5 : 1,
                pointerEvents: (null == styles ? void 0 : styles.disabled)
                  ? 'none'
                  : 'auto',
              },
              temporaryBackdrop: {
                position: 'fixed',
                inset: 0,
                backgroundColor: themeConfig.backdrop.backgroundColor,
                backdropFilter: themeConfig.backdrop.backdropFilter,
                zIndex: (null == styles ? void 0 : styles.backdropZIndex) || 40,
              },
              temporaryDrawer: {
                position: 'fixed',
                top: 0,
                height: (null == styles ? void 0 : styles.height) || '100%',
                width: (null == styles ? void 0 : styles.width) || '240px',
                maxWidth: null == styles ? void 0 : styles.maxWidth,
                minWidth: null == styles ? void 0 : styles.minWidth,
                maxHeight: null == styles ? void 0 : styles.maxHeight,
                minHeight: null == styles ? void 0 : styles.minHeight,
                padding: null == styles ? void 0 : styles.padding,
                margin: null == styles ? void 0 : styles.margin,
                background: themeConfig.temporary.background,
                ['left' === anchorSide ? 'borderRight' : 'borderLeft']:
                  'left' === anchorSide
                    ? themeConfig.temporary.borderRight
                    : themeConfig.temporary.borderLeft,
                boxShadow: themeConfig.temporary.boxShadow,
                backdropFilter: themeConfig.temporary.backdropFilter,
                backgroundImage: themeConfig.temporary.backgroundImage,
                zIndex: (null == styles ? void 0 : styles.zIndex) || 50,
                transition: themeConfig.transition,
                [anchorSide]: 0,
                transform: open
                  ? 'translateX(0)'
                  : 'left' === anchorSide
                    ? 'translateX(-100%)'
                    : 'translateX(100%)',
                opacity: (null == styles ? void 0 : styles.disabled) ? 0.5 : 1,
                pointerEvents: (null == styles ? void 0 : styles.disabled)
                  ? 'none'
                  : 'auto',
              },
            }
          },
          progressBarThemes = {
            light: {
              container: {
                background: 'rgba(229, 231, 235, 0.8)',
                border: '1px solid rgba(209, 213, 219, 0.6)',
                borderRadius: '9999px',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(4px)',
              },
              bar: {
                background:
                  'linear-gradient(to right, rgb(37, 99, 235), rgb(59, 130, 246), rgb(37, 99, 235))',
                borderRadius: '9999px',
                boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)',
                filter: 'drop-shadow(0 1px 2px rgba(37, 99, 235, 0.2))',
              },
              indeterminateBar: {
                background:
                  'linear-gradient(90deg, transparent, rgb(59, 130, 246), transparent)',
                borderRadius: '9999px',
                boxShadow: '0 1px 3px rgba(59, 130, 246, 0.4)',
                filter: 'drop-shadow(0 1px 2px rgba(59, 130, 246, 0.3))',
                animation: 'progressIndeterminate 1.5s ease-in-out infinite',
              },
              label: {
                color: 'rgb(55, 65, 81)',
                fontSize: '14px',
                fontFamily: '"Inter", sans-serif',
                fontWeight: '500',
              },
              transition: shared.Ds.medium,
            },
            dark: {
              container: {
                background: 'rgba(55, 65, 81, 0.8)',
                border: '1px solid rgba(75, 85, 99, 0.6)',
                borderRadius: '9999px',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(4px)',
              },
              bar: {
                background:
                  'linear-gradient(to right, rgb(96, 165, 250), rgb(147, 197, 253), rgb(96, 165, 250))',
                borderRadius: '9999px',
                boxShadow: '0 1px 3px rgba(96, 165, 250, 0.4)',
                filter: 'drop-shadow(0 1px 2px rgba(96, 165, 250, 0.3))',
              },
              indeterminateBar: {
                background:
                  'linear-gradient(90deg, transparent, rgb(147, 197, 253), transparent)',
                borderRadius: '9999px',
                boxShadow: '0 1px 3px rgba(147, 197, 253, 0.5)',
                filter: 'drop-shadow(0 1px 2px rgba(147, 197, 253, 0.4))',
                animation: 'progressIndeterminate 1.5s ease-in-out infinite',
              },
              label: {
                color: 'rgb(209, 213, 219)',
                fontSize: '14px',
                fontFamily: '"Inter", sans-serif',
                fontWeight: '500',
              },
              transition: shared.Ds.medium,
            },
            sacred: {
              container: {
                background: 'rgba(26, 26, 26, 0.9)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '9999px',
                boxShadow: shared.I4.sacred.small,
                backdropFilter: 'blur(4px)',
                backgroundImage:
                  '\n        radial-gradient(circle at left, rgba(255, 215, 0, 0.05) 0%, transparent 50%),\n        radial-gradient(circle at right, rgba(255, 215, 0, 0.03) 0%, transparent 50%)\n      ',
              },
              bar: {
                background:
                  'linear-gradient(to right, #FBBF24, #F59E0B, #FFD700, #F59E0B, #FBBF24)',
                borderRadius: '9999px',
                boxShadow:
                  '0 0 8px rgba(255, 215, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.8))',
              },
              indeterminateBar: {
                background:
                  'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), #FFD700, rgba(255, 215, 0, 0.3), transparent)',
                borderRadius: '9999px',
                boxShadow:
                  '0 0 12px rgba(255, 215, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 1))',
                animation:
                  'sacredProgressIndeterminate 2s ease-in-out infinite',
              },
              label: {
                color: '#FFD700',
                fontSize: '14px',
                fontFamily: '"Cinzel", serif',
                fontWeight: '600',
                textShadow: '0 0 4px rgba(255, 215, 0, 0.6)',
              },
              transition: shared.Ds.slow,
            },
          },
          getProgressBarStyles = (styles, value, variant) => {
            const themeConfig = (styles => {
                const theme =
                    (null == styles ? void 0 : styles.theme) || 'light',
                  baseTheme = progressBarThemes[theme]
                return styles
                  ? {
                      container: {
                        background:
                          styles.backgroundColor ||
                          baseTheme.container.background,
                        border: styles.borderColor
                          ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
                          : baseTheme.container.border,
                        borderRadius:
                          styles.borderRadius ||
                          baseTheme.container.borderRadius,
                        boxShadow:
                          styles.boxShadow || baseTheme.container.boxShadow,
                        backdropFilter:
                          styles.backdropFilter ||
                          baseTheme.container.backdropFilter,
                        backgroundImage:
                          styles.backgroundImage ||
                          baseTheme.container.backgroundImage,
                      },
                      bar: {
                        background:
                          styles.barBackground || baseTheme.bar.background,
                        borderRadius:
                          styles.barBorderRadius || baseTheme.bar.borderRadius,
                        boxShadow:
                          styles.barBoxShadow || baseTheme.bar.boxShadow,
                        backgroundImage:
                          styles.barBackgroundImage ||
                          baseTheme.bar.backgroundImage,
                        filter: styles.barFilter || baseTheme.bar.filter,
                      },
                      indeterminateBar: {
                        background:
                          styles.indeterminateBarBackground ||
                          baseTheme.indeterminateBar.background,
                        borderRadius:
                          styles.indeterminateBarBorderRadius ||
                          baseTheme.indeterminateBar.borderRadius,
                        boxShadow:
                          styles.indeterminateBarBoxShadow ||
                          baseTheme.indeterminateBar.boxShadow,
                        backgroundImage:
                          styles.indeterminateBarBackgroundImage ||
                          baseTheme.indeterminateBar.backgroundImage,
                        filter:
                          styles.indeterminateBarFilter ||
                          baseTheme.indeterminateBar.filter,
                        animation:
                          styles.indeterminateBarAnimation ||
                          baseTheme.indeterminateBar.animation,
                      },
                      label: {
                        color: styles.labelColor || baseTheme.label.color,
                        fontSize:
                          styles.labelFontSize || baseTheme.label.fontSize,
                        fontFamily:
                          styles.labelFontFamily || baseTheme.label.fontFamily,
                        fontWeight:
                          styles.labelFontWeight || baseTheme.label.fontWeight,
                        textShadow:
                          styles.labelTextShadow || baseTheme.label.textShadow,
                      },
                      transition: styles.transitionDuration
                        ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
                        : baseTheme.transition,
                    }
                  : baseTheme
              })(styles),
              progressValue = Math.min(Math.max(value || 0, 0), 100),
              isIndeterminate = 'indeterminate' === variant
            return {
              container: {
                width: (null == styles ? void 0 : styles.width) || '100%',
                height: (null == styles ? void 0 : styles.height) || '10px',
                maxWidth: null == styles ? void 0 : styles.maxWidth,
                minWidth: null == styles ? void 0 : styles.minWidth,
                maxHeight: null == styles ? void 0 : styles.maxHeight,
                minHeight: null == styles ? void 0 : styles.minHeight,
                padding: null == styles ? void 0 : styles.padding,
                margin: null == styles ? void 0 : styles.margin,
                marginTop: null == styles ? void 0 : styles.marginTop,
                marginBottom: null == styles ? void 0 : styles.marginBottom,
                marginLeft: null == styles ? void 0 : styles.marginLeft,
                marginRight: null == styles ? void 0 : styles.marginRight,
                background: themeConfig.container.background,
                border: themeConfig.container.border,
                borderRadius: themeConfig.container.borderRadius,
                boxShadow: themeConfig.container.boxShadow,
                backdropFilter: themeConfig.container.backdropFilter,
                backgroundImage: themeConfig.container.backgroundImage,
                position: 'relative',
                overflow: 'hidden',
                opacity: (null == styles ? void 0 : styles.disabled) ? 0.5 : 1,
                pointerEvents: (null == styles ? void 0 : styles.disabled)
                  ? 'none'
                  : 'auto',
              },
              bar: isIndeterminate
                ? {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '50%',
                    background: themeConfig.indeterminateBar.background,
                    borderRadius: themeConfig.indeterminateBar.borderRadius,
                    boxShadow: themeConfig.indeterminateBar.boxShadow,
                    backgroundImage:
                      themeConfig.indeterminateBar.backgroundImage,
                    filter: themeConfig.indeterminateBar.filter,
                    animation: themeConfig.indeterminateBar.animation,
                  }
                : {
                    height: '100%',
                    width: `${progressValue}%`,
                    background: themeConfig.bar.background,
                    borderRadius: themeConfig.bar.borderRadius,
                    boxShadow: themeConfig.bar.boxShadow,
                    backgroundImage: themeConfig.bar.backgroundImage,
                    filter: themeConfig.bar.filter,
                    transition: themeConfig.transition,
                  },
              label: {
                color: themeConfig.label.color,
                fontSize: themeConfig.label.fontSize,
                fontFamily: themeConfig.label.fontFamily,
                fontWeight: themeConfig.label.fontWeight,
                textShadow: themeConfig.label.textShadow,
                marginTop: '4px',
                textAlign: 'center',
              },
            }
          },
          projectBoardThemes =
            (shared.I4.light.medium,
            shared.Ds.medium,
            shared.Ds.medium,
            shared.I4.sacred.large,
            shared.Ds.slow,
            {
              light: {
                container: {
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  borderRadius: '12px',
                  boxShadow: shared.I4.light.medium,
                  backdropFilter: 'blur(8px)',
                },
                glyph: {
                  color: 'rgba(107, 114, 128, 0.3)',
                  fontSize: '1.5rem',
                  zIndex: 10,
                },
                toolbarContainer: {
                  background: 'transparent',
                  padding: '0.25rem 1rem',
                  margin: '0.25rem 0',
                  borderRadius: '8px',
                },
                transition: shared.Ds.medium,
              },
              dark: {
                container: {
                  background: 'rgba(31, 41, 55, 0.95)',
                  border: '1px solid rgba(75, 85, 99, 0.8)',
                  borderRadius: '12px',
                  boxShadow:
                    '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(8px)',
                },
                glyph: {
                  color: 'rgba(156, 163, 175, 0.3)',
                  fontSize: '1.5rem',
                  zIndex: 10,
                },
                toolbarContainer: {
                  background: 'transparent',
                  padding: '0.25rem 1rem',
                  margin: '0.25rem 0',
                  borderRadius: '8px',
                },
                transition: shared.Ds.medium,
              },
              sacred: {
                container: {
                  background: 'rgba(0, 0, 0, 0.8)',
                  border: '2px solid rgba(255, 215, 0, 0.5)',
                  borderRadius: '0.5rem',
                  boxShadow: shared.I4.sacred.large,
                  backdropFilter: 'blur(8px)',
                  backgroundImage:
                    '\n        radial-gradient(circle at top left, rgba(255, 215, 0, 0.08) 0%, transparent 50%),\n        radial-gradient(circle at bottom right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),\n        linear-gradient(135deg, rgba(255, 215, 0, 0.02) 0%, transparent 50%)\n      ',
                  animation: 'projectBoardGlowPulse 3s infinite alternate',
                },
                glyph: {
                  color: 'rgba(255, 215, 0, 0.3)',
                  fontSize: '1.5rem',
                  zIndex: 10,
                  animation: 'projectBoardFloat 10s infinite alternate',
                },
                toolbarContainer: {
                  background: 'rgba(255, 215, 0, 0.05)',
                  padding: '0.25rem 1rem',
                  margin: '0.25rem 0',
                  borderRadius: '8px',
                },
                transition: shared.Ds.slow,
              },
            }),
          getProjectBoardStyles = (styles, isDisabled) => {
            const themeConfig = (styles => {
                const theme =
                    (null == styles ? void 0 : styles.theme) || 'light',
                  baseTheme = projectBoardThemes[theme]
                return styles
                  ? {
                      container: {
                        background:
                          styles.backgroundColor ||
                          baseTheme.container.background,
                        border: styles.borderColor
                          ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
                          : baseTheme.container.border,
                        borderRadius:
                          styles.borderRadius ||
                          baseTheme.container.borderRadius,
                        boxShadow:
                          styles.boxShadow || baseTheme.container.boxShadow,
                        backdropFilter:
                          styles.backdropFilter ||
                          baseTheme.container.backdropFilter,
                        backgroundImage:
                          styles.backgroundImage ||
                          baseTheme.container.backgroundImage,
                        animation:
                          styles.containerAnimation ||
                          baseTheme.container.animation,
                      },
                      glyph: {
                        color: styles.glyphColor || baseTheme.glyph.color,
                        fontSize:
                          styles.glyphFontSize || baseTheme.glyph.fontSize,
                        zIndex: styles.glyphZIndex || baseTheme.glyph.zIndex,
                        animation:
                          styles.glyphAnimation || baseTheme.glyph.animation,
                      },
                      toolbarContainer: {
                        background:
                          styles.toolbarBackground ||
                          baseTheme.toolbarContainer.background,
                        padding:
                          styles.toolbarPadding ||
                          baseTheme.toolbarContainer.padding,
                        margin:
                          styles.toolbarMargin ||
                          baseTheme.toolbarContainer.margin,
                        borderRadius:
                          styles.toolbarBorderRadius ||
                          baseTheme.toolbarContainer.borderRadius,
                      },
                      transition: styles.transitionDuration
                        ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
                        : baseTheme.transition,
                    }
                  : baseTheme
              })(styles),
              containerStyle = {
                boxSizing: 'border-box',
                width: (null == styles ? void 0 : styles.width) || '100%',
                height: (null == styles ? void 0 : styles.height) || '100%',
                maxWidth: null == styles ? void 0 : styles.maxWidth,
                minWidth: null == styles ? void 0 : styles.minWidth,
                maxHeight: null == styles ? void 0 : styles.maxHeight,
                minHeight: null == styles ? void 0 : styles.minHeight,
                padding: null == styles ? void 0 : styles.padding,
                margin: null == styles ? void 0 : styles.margin,
                marginTop: null == styles ? void 0 : styles.marginTop,
                marginBottom: null == styles ? void 0 : styles.marginBottom,
                marginLeft: null == styles ? void 0 : styles.marginLeft,
                marginRight: null == styles ? void 0 : styles.marginRight,
                position: 'relative',
                background: themeConfig.container.background,
                border: themeConfig.container.border,
                borderRadius: themeConfig.container.borderRadius,
                boxShadow: themeConfig.container.boxShadow,
                backdropFilter: themeConfig.container.backdropFilter,
                backgroundImage: themeConfig.container.backgroundImage,
                animation: themeConfig.container.animation,
                overflow: 'hidden',
                transition: themeConfig.transition,
                opacity: isDisabled ? 0.5 : 1,
                pointerEvents: isDisabled ? 'none' : 'auto',
              },
              glyphStyle = {
                position: 'absolute',
                color: themeConfig.glyph.color,
                zIndex: themeConfig.glyph.zIndex,
                animation: themeConfig.glyph.animation,
              }
            return {
              container: containerStyle,
              glyph: glyphStyle,
              toolbarContainer: {
                background: themeConfig.toolbarContainer.background,
                padding: themeConfig.toolbarContainer.padding,
                margin: themeConfig.toolbarContainer.margin,
                borderRadius: themeConfig.toolbarContainer.borderRadius,
              },
              glyphPositions: {
                topLeft: {
                  ...glyphStyle,
                  top: '0.75rem',
                  left: '0.75rem',
                  fontSize: '1.5rem',
                },
                topRight: {
                  ...glyphStyle,
                  top: '0.75rem',
                  right: '0.75rem',
                  fontSize: '1.5rem',
                  animationDirection: 'reverse',
                },
                bottomLeft: {
                  ...glyphStyle,
                  bottom: '0.75rem',
                  left: '0.75rem',
                  fontSize: '1.125rem',
                  animationDelay: '1s',
                },
                bottomRight: {
                  ...glyphStyle,
                  bottom: '0.75rem',
                  right: '0.75rem',
                  fontSize: '1.125rem',
                  animationDirection: 'reverse',
                  animationDelay: '1s',
                },
              },
            }
          },
          toolbarThemes = {
            light: {
              container: {
                background: 'rgba(248, 250, 252, 0.8)',
                border: '1px solid rgba(226, 232, 240, 0.6)',
                borderRadius: '8px',
                boxShadow: shared.I4.light.small,
                backdropFilter: 'blur(4px)',
                padding: '0.75rem',
              },
              glyph: {
                color: 'rgba(107, 114, 128, 0.3)',
                fontSize: '0.875rem',
              },
              transition: shared.Ds.medium,
            },
            dark: {
              container: {
                background: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid rgba(75, 85, 99, 0.6)',
                borderRadius: '8px',
                boxShadow:
                  '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(4px)',
                padding: '0.75rem',
              },
              glyph: {
                color: 'rgba(156, 163, 175, 0.3)',
                fontSize: '0.875rem',
              },
              transition: shared.Ds.medium,
            },
            sacred: {
              container: {
                background: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '0.5rem',
                boxShadow: shared.I4.sacred.small,
                backdropFilter: 'blur(4px)',
                padding: '1rem',
                backgroundImage:
                  '\n        radial-gradient(circle at top right, rgba(255, 215, 0, 0.05) 0%, transparent 50%),\n        radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.03) 0%, transparent 50%)\n      ',
                animation: 'sacredGlowPulse 2s infinite alternate',
              },
              glyph: {
                color: 'rgba(255, 215, 0, 0.2)',
                fontSize: '0.875rem',
                animation: 'glyphRotate 10s linear infinite',
              },
              transition: shared.Ds.slow,
            },
          },
          getToolbarStyles = (styles, isDisabled) => {
            const themeConfig = (styles => {
              const theme = (null == styles ? void 0 : styles.theme) || 'light',
                baseTheme = toolbarThemes[theme]
              return styles
                ? {
                    container: {
                      background:
                        styles.backgroundColor ||
                        baseTheme.container.background,
                      border: styles.borderColor
                        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
                        : baseTheme.container.border,
                      borderRadius:
                        styles.borderRadius || baseTheme.container.borderRadius,
                      boxShadow:
                        styles.boxShadow || baseTheme.container.boxShadow,
                      backdropFilter:
                        styles.backdropFilter ||
                        baseTheme.container.backdropFilter,
                      padding: styles.padding || baseTheme.container.padding,
                      backgroundImage:
                        styles.backgroundImage ||
                        baseTheme.container.backgroundImage,
                      animation:
                        styles.containerAnimation ||
                        baseTheme.container.animation,
                    },
                    glyph: {
                      color: styles.glyphColor || baseTheme.glyph.color,
                      fontSize:
                        styles.glyphFontSize || baseTheme.glyph.fontSize,
                      animation:
                        styles.glyphAnimation || baseTheme.glyph.animation,
                    },
                    transition: styles.transitionDuration
                      ? `all ${styles.transitionDuration} ${styles.transitionEasing || 'cubic-bezier(0.4, 0, 0.2, 1)'}`
                      : baseTheme.transition,
                  }
                : baseTheme
            })(styles)
            return {
              container: {
                display: 'flex',
                flexDirection: 'column',
                width: (null == styles ? void 0 : styles.width) || '100%',
                gap: (null == styles ? void 0 : styles.gap) || '1rem',
                maxWidth: null == styles ? void 0 : styles.maxWidth,
                minWidth: null == styles ? void 0 : styles.minWidth,
                maxHeight: null == styles ? void 0 : styles.maxHeight,
                minHeight: null == styles ? void 0 : styles.minHeight,
                margin: null == styles ? void 0 : styles.margin,
                marginTop: null == styles ? void 0 : styles.marginTop,
                marginBottom: null == styles ? void 0 : styles.marginBottom,
                marginLeft: null == styles ? void 0 : styles.marginLeft,
                marginRight: null == styles ? void 0 : styles.marginRight,
                background: themeConfig.container.background,
                border: themeConfig.container.border,
                borderRadius: themeConfig.container.borderRadius,
                boxShadow: themeConfig.container.boxShadow,
                backdropFilter: themeConfig.container.backdropFilter,
                padding: themeConfig.container.padding,
                backgroundImage: themeConfig.container.backgroundImage,
                animation: themeConfig.container.animation,
                position: 'relative',
                transition: themeConfig.transition,
                opacity: isDisabled ? 0.5 : 1,
                pointerEvents: isDisabled ? 'none' : 'auto',
              },
              glyph: {
                position: 'absolute',
                top: '0.25rem',
                right: '0.5rem',
                color: themeConfig.glyph.color,
                fontSize: themeConfig.glyph.fontSize,
                animation: themeConfig.glyph.animation,
              },
              desktopLeft: { display: 'none' },
              desktopRight: { display: 'none' },
              tabletContainer: { display: 'none' },
              mobileContainer: {
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                width: '100%',
              },
              mobileRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
            }
          },
          stepper_lightTheme = {
            container: {
              position: 'relative',
              padding: '1.5rem',
              backgroundColor: 'transparent',
              borderRadius: '12px',
              transition: shared.Ds.medium,
            },
            sacredGlyph: { display: 'none' },
            stepperContainer: { display: 'flex', alignItems: 'center' },
            stepContainer: {
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            },
            stepContent: {
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              position: 'relative',
              zIndex: 1,
            },
            stepIconContainer: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              border: '2px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              transition: shared.Ds.medium,
              boxShadow: shared.I4.light.small,
              position: 'relative',
              cursor: 'pointer',
            },
            stepIconContainerCompleted: {
              backgroundColor: '#F0F9FF',
              borderColor: '#3B82F6',
              boxShadow:
                '0 4px 12px rgba(59, 130, 246, 0.15), 0 2px 4px rgba(59, 130, 246, 0.1)',
              transform: 'scale(1.05)',
            },
            stepIconContainerActive: {
              backgroundColor: '#EFF6FF',
              borderColor: '#2563EB',
              boxShadow:
                '0 0 0 4px rgba(37, 99, 235, 0.1), 0 4px 16px rgba(37, 99, 235, 0.2)',
              transform: 'scale(1.1)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            stepIconContainerError: {
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              border: 'none',
              boxShadow: 'none',
              transform: 'none',
              width: 'auto',
              height: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            stepIconContainerInactive: {
              backgroundColor: '#F9FAFB',
              borderColor: '#D1D5DB',
              opacity: 0.6,
            },
            stepButton: {
              textAlign: 'left',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#1F2937',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              transition: shared.Ds.medium,
              background: 'none',
              border: 'none',
              padding: '0.25rem 0',
              cursor: 'pointer',
              letterSpacing: '0.025em',
              lineHeight: 1.4,
            },
            stepButtonHover: {
              color: '#2563EB',
              transform: 'translateY(-1px)',
            },
            stepButtonDisabled: {
              cursor: 'not-allowed',
              opacity: 0.4,
              color: '#9CA3AF',
            },
            infoButton: {
              padding: '0.375rem',
              borderRadius: '50%',
              transition: shared.Ds.medium,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6B7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            },
            infoButtonHover: {
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              color: '#2563EB',
              transform: 'scale(1.1)',
            },
            connector: {
              flex: 1,
              height: '3px',
              margin: '0 1.5rem',
              backgroundColor: '#E5E7EB',
              borderRadius: '1.5px',
              transition: shared.Ds.medium,
              position: 'relative',
              overflow: 'hidden',
            },
            verticalConnector: {
              width: '3px',
              height: '2.5rem',
              marginLeft: '1.5rem',
              marginRight: '1rem',
              backgroundColor: '#E5E7EB',
              borderRadius: '1.5px',
              transition: shared.Ds.medium,
              position: 'relative',
              overflow: 'hidden',
            },
            icon: {
              width: '1.25rem',
              height: '1.25rem',
              color: '#2563EB',
              transition: shared.Ds.medium,
            },
            errorIcon: {
              width: '1.5rem',
              height: '1.5rem',
              color: '#EF4444',
              transition: shared.Ds.medium,
              cursor: 'pointer',
              filter: 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))',
            },
            errorIconHover: { transform: 'scale(1.1)' },
            inactiveIcon: {
              width: '1.25rem',
              height: '1.25rem',
              color: '#9CA3AF',
            },
            tooltipContainer: { position: 'relative', display: 'inline-block' },
            tooltip: {
              position: 'absolute',
              zIndex: 50,
              padding: '0.5rem 0.75rem',
              fontSize: '0.8rem',
              borderRadius: '6px',
              boxShadow: shared.I4.light.medium,
              whiteSpace: 'nowrap',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '0.5rem',
              backgroundColor: '#1F2937',
              color: '#FFFFFF',
              fontWeight: 500,
            },
            tooltipArrow: {
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              border: '5px solid transparent',
              borderTopColor: '#1F2937',
            },
          },
          stepper_darkTheme = {
            container: {
              position: 'relative',
              padding: '1.5rem',
              backgroundColor: 'transparent',
              borderRadius: '12px',
              transition: shared.Ds.medium,
            },
            sacredGlyph: { display: 'none' },
            stepperContainer: { display: 'flex', alignItems: 'center' },
            stepContainer: {
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            },
            stepContent: {
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              position: 'relative',
              zIndex: 1,
            },
            stepIconContainer: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              border: '2px solid #374151',
              backgroundColor: '#1F2937',
              transition: shared.Ds.medium,
              boxShadow: shared.I4.dark.small,
              position: 'relative',
              cursor: 'pointer',
            },
            stepIconContainerCompleted: {
              backgroundColor: '#1E3A8A',
              borderColor: '#3B82F6',
              boxShadow:
                '0 4px 12px rgba(59, 130, 246, 0.25), 0 2px 4px rgba(59, 130, 246, 0.15)',
              transform: 'scale(1.05)',
            },
            stepIconContainerActive: {
              backgroundColor: '#1E40AF',
              borderColor: '#60A5FA',
              boxShadow:
                '0 0 0 4px rgba(96, 165, 250, 0.15), 0 4px 16px rgba(96, 165, 250, 0.3)',
              transform: 'scale(1.1)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            stepIconContainerError: {
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              border: 'none',
              boxShadow: 'none',
              transform: 'none',
              width: 'auto',
              height: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            stepIconContainerInactive: {
              backgroundColor: '#1F2937',
              borderColor: '#374151',
              opacity: 0.6,
            },
            stepButton: {
              textAlign: 'left',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#F3F4F6',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              transition: shared.Ds.medium,
              background: 'none',
              border: 'none',
              padding: '0.25rem 0',
              cursor: 'pointer',
              letterSpacing: '0.025em',
              lineHeight: 1.4,
            },
            stepButtonHover: {
              color: '#60A5FA',
              transform: 'translateY(-1px)',
            },
            stepButtonDisabled: {
              cursor: 'not-allowed',
              opacity: 0.4,
              color: '#6B7280',
            },
            infoButton: {
              padding: '0.375rem',
              borderRadius: '50%',
              transition: shared.Ds.medium,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9CA3AF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            },
            infoButtonHover: {
              backgroundColor: 'rgba(96, 165, 250, 0.15)',
              color: '#60A5FA',
              transform: 'scale(1.1)',
            },
            connector: {
              flex: 1,
              height: '3px',
              margin: '0 1.5rem',
              backgroundColor: '#374151',
              borderRadius: '1.5px',
              transition: shared.Ds.medium,
              position: 'relative',
              overflow: 'hidden',
            },
            verticalConnector: {
              width: '3px',
              height: '2.5rem',
              marginLeft: '1.5rem',
              marginRight: '1rem',
              backgroundColor: '#374151',
              borderRadius: '1.5px',
              transition: shared.Ds.medium,
              position: 'relative',
              overflow: 'hidden',
            },
            icon: {
              width: '1.25rem',
              height: '1.25rem',
              color: '#60A5FA',
              transition: shared.Ds.medium,
            },
            errorIcon: {
              width: '1.5rem',
              height: '1.5rem',
              color: '#EF4444',
              transition: shared.Ds.medium,
              cursor: 'pointer',
              filter: 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))',
            },
            errorIconHover: { transform: 'scale(1.1)' },
            inactiveIcon: {
              width: '1.25rem',
              height: '1.25rem',
              color: '#6B7280',
            },
            tooltipContainer: { position: 'relative', display: 'inline-block' },
            tooltip: {
              position: 'absolute',
              zIndex: 50,
              padding: '0.5rem 0.75rem',
              fontSize: '0.8rem',
              borderRadius: '6px',
              boxShadow: shared.I4.dark.medium,
              whiteSpace: 'nowrap',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '0.5rem',
              backgroundColor: '#F3F4F6',
              color: '#1F2937',
              fontWeight: 500,
            },
            tooltipArrow: {
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              border: '5px solid transparent',
              borderTopColor: '#F3F4F6',
            },
          },
          stepper_sacredTheme = {
            container: {
              position: 'relative',
              padding: '2rem 2.5rem',
              backgroundColor: 'rgba(8, 8, 12, 0.95)',
              borderRadius: '20px',
              border: '2px solid transparent',
              backgroundImage:
                '\n      linear-gradient(rgba(8, 8, 12, 0.95), rgba(8, 8, 12, 0.95)),\n      linear-gradient(135deg, \n        rgba(255, 215, 0, 0.4) 0%, \n        rgba(255, 215, 0, 0.1) 25%, \n        rgba(184, 134, 11, 0.2) 50%, \n        rgba(255, 215, 0, 0.1) 75%, \n        rgba(255, 215, 0, 0.4) 100%\n      )\n    ',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
              transition: shared.Ds.premium,
              boxShadow:
                '\n      0 0 40px rgba(255, 215, 0, 0.3),\n      0 0 80px rgba(255, 215, 0, 0.1),\n      inset 0 0 40px rgba(255, 215, 0, 0.05)\n    ',
            },
            sacredGlyph: {
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              fontSize: '1.75rem',
              color: 'rgba(255, 215, 0, 0.4)',
              animation: 'glyph-rotate 20s linear infinite',
              filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.3))',
              userSelect: 'none',
            },
            stepperContainer: {
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              gap: '0.5rem',
            },
            stepContainer: {
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              flex: 1,
            },
            stepContent: {
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              position: 'relative',
              zIndex: 1,
            },
            stepIconContainer: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3.25rem',
              height: '3.25rem',
              borderRadius: '50%',
              border: '2px solid rgba(255, 215, 0, 0.5)',
              backgroundColor: 'rgba(8, 8, 12, 0.8)',
              transition: shared.Ds.premium,
              position: 'relative',
              cursor: 'pointer',
              boxShadow:
                '\n      0 0 20px rgba(255, 215, 0, 0.2),\n      inset 0 0 20px rgba(255, 215, 0, 0.1)\n    ',
            },
            stepIconContainerCompleted: {
              backgroundColor: 'rgba(255, 215, 0, 0.12)',
              borderColor: 'rgba(255, 215, 0, 0.8)',
              boxShadow:
                '\n      0 0 30px rgba(255, 215, 0, 0.4),\n      0 0 60px rgba(255, 215, 0, 0.2),\n      inset 0 0 30px rgba(255, 215, 0, 0.15)\n    ',
              transform: 'scale(1.08)',
            },
            stepIconContainerActive: {
              backgroundColor: 'rgba(255, 215, 0, 0.18)',
              borderColor: 'rgba(255, 215, 0, 0.9)',
              boxShadow:
                '\n      0 0 40px rgba(255, 215, 0, 0.6),\n      0 0 80px rgba(255, 215, 0, 0.3),\n      inset 0 0 40px rgba(255, 215, 0, 0.2)\n    ',
              transform: 'scale(1.12)',
              animation:
                'sacred-glow-pulse 2.5s ease-in-out infinite alternate',
            },
            stepIconContainerError: {
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              border: 'none',
              boxShadow: 'none',
              transform: 'none',
              width: 'auto',
              height: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            stepIconContainerInactive: {
              backgroundColor: 'rgba(8, 8, 12, 0.8)',
              borderColor: 'rgba(255, 215, 0, 0.25)',
              opacity: 0.5,
              boxShadow:
                '\n      0 0 10px rgba(255, 215, 0, 0.1),\n      inset 0 0 10px rgba(255, 215, 0, 0.05)\n    ',
            },
            stepButton: {
              textAlign: 'left',
              fontWeight: 600,
              fontSize: '1rem',
              color: 'rgba(255, 215, 0, 0.95)',
              fontFamily: 'Cinzel, serif',
              transition: shared.Ds.premium,
              background: 'none',
              border: 'none',
              padding: '0.5rem 0',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              lineHeight: 1.3,
              textShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
              position: 'relative',
            },
            stepButtonHover: {
              color: 'rgba(255, 215, 0, 1)',
              textShadow:
                '\n      0 0 20px rgba(255, 215, 0, 0.8),\n      0 0 40px rgba(255, 215, 0, 0.4)\n    ',
              transform: 'translateY(-1px)',
            },
            stepButtonDisabled: {
              cursor: 'not-allowed',
              opacity: 0.4,
              color: 'rgba(255, 215, 0, 0.3)',
              textShadow: 'none',
            },
            infoButton: {
              padding: '0.5rem',
              borderRadius: '50%',
              transition: shared.Ds.premium,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255, 215, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            },
            infoButtonHover: {
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              color: 'rgba(255, 215, 0, 1)',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
              transform: 'scale(1.1)',
            },
            connector: {
              flex: 1,
              height: '3px',
              margin: '0 1.5rem',
              backgroundColor: 'transparent',
              borderRadius: '1.5px',
              transition: shared.Ds.premium,
              position: 'relative',
              overflow: 'hidden',
              background:
                '\n      linear-gradient(90deg, \n        rgba(255, 215, 0, 0.1) 0%, \n        rgba(255, 215, 0, 0.4) 30%, \n        rgba(255, 215, 0, 0.6) 50%, \n        rgba(255, 215, 0, 0.4) 70%, \n        rgba(255, 215, 0, 0.1) 100%\n      )\n    ',
              boxShadow:
                '\n      0 0 10px rgba(255, 215, 0, 0.3),\n      inset 0 0 10px rgba(255, 215, 0, 0.1)\n    ',
            },
            verticalConnector: {
              width: '3px',
              height: '2.5rem',
              marginLeft: '1.625rem',
              marginRight: '1rem',
              backgroundColor: 'transparent',
              borderRadius: '1.5px',
              transition: shared.Ds.premium,
              position: 'relative',
              overflow: 'hidden',
              background:
                '\n      linear-gradient(180deg, \n        rgba(255, 215, 0, 0.1) 0%, \n        rgba(255, 215, 0, 0.4) 30%, \n        rgba(255, 215, 0, 0.6) 50%, \n        rgba(255, 215, 0, 0.4) 70%, \n        rgba(255, 215, 0, 0.1) 100%\n      )\n    ',
              boxShadow:
                '\n      0 0 10px rgba(255, 215, 0, 0.3),\n      inset 0 0 10px rgba(255, 215, 0, 0.1)\n    ',
            },
            icon: {
              width: '1.375rem',
              height: '1.375rem',
              color: 'rgba(255, 215, 0, 0.95)',
              transition: shared.Ds.premium,
              filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.6))',
              animation: 'sacred-icon-glow 3s ease-in-out infinite alternate',
            },
            errorIcon: {
              width: '1.75rem',
              height: '1.75rem',
              color: 'rgba(184, 134, 11, 0.95)',
              transition: shared.Ds.premium,
              cursor: 'pointer',
              filter: 'drop-shadow(0 0 12px rgba(184, 134, 11, 0.7))',
              animation:
                'sacred-error-icon-pulse 2s ease-in-out infinite alternate',
            },
            errorIconHover: { transform: 'scale(1.1)' },
            inactiveIcon: {
              width: '1.375rem',
              height: '1.375rem',
              color: 'rgba(255, 215, 0, 0.4)',
              filter: 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.3))',
            },
            tooltipContainer: { position: 'relative', display: 'inline-block' },
            tooltip: {
              position: 'absolute',
              zIndex: 50,
              padding: '0.75rem 1.25rem',
              fontSize: '0.875rem',
              borderRadius: '12px',
              boxShadow:
                '\n      0 0 30px rgba(255, 215, 0, 0.6),\n      0 0 60px rgba(255, 215, 0, 0.3)\n    ',
              whiteSpace: 'nowrap',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '1rem',
              backgroundColor: 'rgba(255, 215, 0, 0.95)',
              color: 'rgba(8, 8, 12, 0.95)',
              fontWeight: 700,
              fontFamily: 'Cinzel, serif',
              letterSpacing: '0.025em',
              border: '1px solid rgba(255, 215, 0, 0.8)',
              textShadow: 'none',
            },
            tooltipArrow: {
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              border: '6px solid transparent',
              borderTopColor: 'rgba(255, 215, 0, 0.95)',
              filter: 'drop-shadow(0 2px 4px rgba(255, 215, 0, 0.3))',
            },
          },
          getStepperStyles = styles => {
            const baseTheme =
              'light' === (null == styles ? void 0 : styles.theme)
                ? stepper_lightTheme
                : 'sacred' === (null == styles ? void 0 : styles.theme)
                  ? stepper_sacredTheme
                  : stepper_darkTheme
            return {
              container: {
                ...baseTheme.container,
                ...((null == styles ? void 0 : styles.containerBackground) && {
                  backgroundColor: styles.containerBackground,
                }),
                ...((null == styles ? void 0 : styles.borderColor) && {
                  borderColor: styles.borderColor,
                }),
                ...((null == styles ? void 0 : styles.borderRadius) && {
                  borderRadius: styles.borderRadius,
                }),
              },
              sacredGlyph: baseTheme.sacredGlyph,
              stepperContainer: baseTheme.stepperContainer,
              stepContainer: baseTheme.stepContainer,
              stepContent: {
                ...baseTheme.stepContent,
                ...((null == styles ? void 0 : styles.stepSpacing) && {
                  gap: styles.stepSpacing,
                }),
              },
              stepIconContainer: {
                ...baseTheme.stepIconContainer,
                ...((null == styles ? void 0 : styles.stepSize) && {
                  width: styles.stepSize,
                  height: styles.stepSize,
                }),
              },
              stepIconContainerCompleted: {
                ...baseTheme.stepIconContainerCompleted,
                ...((null == styles ? void 0 : styles.completedColor) && {
                  borderColor: styles.completedColor,
                }),
              },
              stepIconContainerActive: {
                ...baseTheme.stepIconContainerActive,
                ...((null == styles ? void 0 : styles.activeColor) && {
                  borderColor: styles.activeColor,
                }),
              },
              stepIconContainerError: {
                ...baseTheme.stepIconContainerError,
                ...((null == styles ? void 0 : styles.errorColor) && {
                  borderColor: styles.errorColor,
                }),
              },
              stepIconContainerInactive: {
                ...baseTheme.stepIconContainerInactive,
                ...((null == styles ? void 0 : styles.inactiveColor) && {
                  borderColor: styles.inactiveColor,
                }),
              },
              stepButton: {
                ...baseTheme.stepButton,
                ...((null == styles ? void 0 : styles.textColor) && {
                  color: styles.textColor,
                }),
                ...((null == styles ? void 0 : styles.fontFamily) && {
                  fontFamily: styles.fontFamily,
                }),
                ...((null == styles ? void 0 : styles.fontSize) && {
                  fontSize: styles.fontSize,
                }),
                ...((null == styles ? void 0 : styles.fontWeight) && {
                  fontWeight: styles.fontWeight,
                }),
              },
              stepButtonHover: baseTheme.stepButtonHover,
              stepButtonDisabled: baseTheme.stepButtonDisabled,
              infoButton: baseTheme.infoButton,
              infoButtonHover: baseTheme.infoButtonHover,
              connector: {
                ...baseTheme.connector,
                ...((null == styles ? void 0 : styles.connectorColor) && {
                  backgroundColor: styles.connectorColor,
                }),
              },
              verticalConnector: {
                ...baseTheme.verticalConnector,
                ...((null == styles ? void 0 : styles.connectorColor) && {
                  backgroundColor: styles.connectorColor,
                }),
              },
              icon: {
                ...baseTheme.icon,
                ...((null == styles ? void 0 : styles.iconSize) && {
                  width: styles.iconSize,
                  height: styles.iconSize,
                }),
              },
              errorIcon: {
                ...baseTheme.errorIcon,
                ...((null == styles ? void 0 : styles.iconSize) && {
                  width: styles.iconSize,
                  height: styles.iconSize,
                }),
              },
              errorIconHover: baseTheme.errorIconHover,
              inactiveIcon: {
                ...baseTheme.inactiveIcon,
                ...((null == styles ? void 0 : styles.iconSize) && {
                  width: styles.iconSize,
                  height: styles.iconSize,
                }),
              },
              tooltipContainer: baseTheme.tooltipContainer,
              tooltip: baseTheme.tooltip,
              tooltipArrow: baseTheme.tooltipArrow,
            }
          },
          switch_lightTheme = {
            container: {
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              cursor: 'pointer',
              gap: '8px',
              transition: shared.Ds.medium,
            },
            containerDisabled: { cursor: 'not-allowed', opacity: 0.6 },
            track: {
              position: 'relative',
              width: '48px',
              height: '24px',
              backgroundColor: 'rgba(156, 163, 175, 0.3)',
              borderRadius: '12px',
              transition: shared.Ds.medium,
              border: '1px solid rgba(156, 163, 175, 0.2)',
              backdropFilter: 'blur(4px)',
              overflow: 'hidden',
            },
            trackNoOutline: { border: 'none' },
            trackChecked: {
              backgroundColor: 'rgb(59, 130, 246)',
              borderColor: 'transparent',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
            },
            trackFocused: { boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)' },
            trackDisabled: {
              backgroundColor: 'rgba(156, 163, 175, 0.2)',
              borderColor: 'rgba(156, 163, 175, 0.1)',
            },
            thumb: {
              position: 'absolute',
              top: '2px',
              left: '2px',
              width: '20px',
              height: '20px',
              backgroundColor: 'white',
              borderRadius: '50%',
              transition: shared.Ds.medium,
              boxShadow: shared.I4.light.small,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: '#6B7280',
            },
            thumbChecked: {
              transform: 'translateX(24px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              color: '#3B82F6',
            },
            thumbDisabled: {
              backgroundColor: 'rgba(249, 250, 251, 0.8)',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              color: '#9CA3AF',
            },
            input: {
              position: 'absolute',
              opacity: 0,
              width: '100%',
              height: '100%',
              margin: 0,
              cursor: 'pointer',
            },
            inputDisabled: { cursor: 'not-allowed' },
            glyph: { display: 'none' },
            glyphLeft: { display: 'none' },
            glyphRight: { display: 'none' },
            glyphVisible: { display: 'none' },
            shimmer: { display: 'none' },
            leftLabel: {
              fontSize: '14px',
              fontWeight: 500,
              color: 'rgb(55, 65, 81)',
              fontFamily: 'Inter, system-ui, sans-serif',
              userSelect: 'none',
              transition: shared.Ds.medium,
            },
            rightLabel: {
              fontSize: '14px',
              fontWeight: 500,
              color: 'rgb(55, 65, 81)',
              fontFamily: 'Inter, system-ui, sans-serif',
              userSelect: 'none',
              transition: shared.Ds.medium,
            },
          },
          switch_darkTheme = {
            container: {
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              cursor: 'pointer',
              gap: '8px',
              transition: shared.Ds.medium,
            },
            containerDisabled: { cursor: 'not-allowed', opacity: 0.6 },
            track: {
              position: 'relative',
              width: '48px',
              height: '24px',
              backgroundColor: 'rgba(75, 85, 99, 0.4)',
              borderRadius: '12px',
              transition: shared.Ds.medium,
              border: '1px solid rgba(75, 85, 99, 0.3)',
              backdropFilter: 'blur(4px)',
              overflow: 'hidden',
            },
            trackNoOutline: { border: 'none' },
            trackChecked: {
              backgroundColor: 'rgb(59, 130, 246)',
              borderColor: 'transparent',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
            },
            trackFocused: { boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' },
            trackDisabled: {
              backgroundColor: 'rgba(75, 85, 99, 0.2)',
              borderColor: 'rgba(75, 85, 99, 0.1)',
            },
            thumb: {
              position: 'absolute',
              top: '2px',
              left: '2px',
              width: '20px',
              height: '20px',
              backgroundColor: '#F3F4F6',
              borderRadius: '50%',
              transition: shared.Ds.medium,
              boxShadow: shared.I4.dark.small,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: '#4B5563',
            },
            thumbChecked: {
              transform: 'translateX(24px)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
              color: '#3B82F6',
            },
            thumbDisabled: {
              backgroundColor: 'rgba(107, 114, 128, 0.8)',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
              color: '#6B7280',
            },
            input: {
              position: 'absolute',
              opacity: 0,
              width: '100%',
              height: '100%',
              margin: 0,
              cursor: 'pointer',
            },
            inputDisabled: { cursor: 'not-allowed' },
            glyph: { display: 'none' },
            glyphLeft: { display: 'none' },
            glyphRight: { display: 'none' },
            glyphVisible: { display: 'none' },
            shimmer: { display: 'none' },
            leftLabel: {
              fontSize: '14px',
              fontWeight: 500,
              color: 'rgb(209, 213, 219)',
              fontFamily: 'Inter, system-ui, sans-serif',
              userSelect: 'none',
              transition: shared.Ds.medium,
            },
            rightLabel: {
              fontSize: '14px',
              fontWeight: 500,
              color: 'rgb(209, 213, 219)',
              fontFamily: 'Inter, system-ui, sans-serif',
              userSelect: 'none',
              transition: shared.Ds.medium,
            },
          },
          switch_sacredTheme = {
            container: {
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              cursor: 'pointer',
              gap: '12px',
              transition: shared.Ds.premium,
            },
            containerDisabled: { cursor: 'not-allowed', opacity: 0.6 },
            track: {
              position: 'relative',
              width: '56px',
              height: '28px',
              backgroundColor: 'rgba(10, 10, 10, 0.9)',
              borderRadius: '14px',
              transition: shared.Ds.premium,
              border: '2px solid rgba(255, 215, 0, 0.3)',
              backdropFilter: 'blur(8px)',
              overflow: 'hidden',
              backgroundImage:
                '\n      radial-gradient(circle at 25% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),\n      radial-gradient(circle at 75% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)\n    ',
            },
            trackNoOutline: { border: 'none', boxShadow: 'none' },
            trackChecked: {
              backgroundColor: 'rgba(10, 10, 10, 0.9)',
              borderColor: '#FFD700',
              boxShadow: shared.I4.sacred.medium,
              backgroundImage:
                '\n      radial-gradient(circle at 25% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),\n      radial-gradient(circle at 75% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)\n    ',
            },
            trackFocused: { boxShadow: '0 0 0 4px rgba(255, 215, 0, 0.3)' },
            trackDisabled: {
              backgroundColor: 'rgba(10, 10, 10, 0.6)',
              borderColor: 'rgba(255, 215, 0, 0.1)',
              boxShadow: 'none',
            },
            thumb: {
              position: 'absolute',
              top: '2px',
              left: '2px',
              width: '24px',
              height: '24px',
              backgroundColor: 'rgba(10, 10, 10, 0.9)',
              borderRadius: '50%',
              transition: shared.Ds.premium,
              border: '1px solid rgba(255, 215, 0, 0.4)',
              boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: '#FFD700',
              backgroundImage:
                '\n      radial-gradient(circle at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)\n    ',
            },
            thumbChecked: {
              transform: 'translateX(28px)',
              borderColor: '#FFD700',
              boxShadow:
                '0 0 25px rgba(255, 215, 0, 0.6), 0 0 50px rgba(255, 215, 0, 0.3)',
              backgroundImage:
                '\n      radial-gradient(circle at center, rgba(255, 215, 0, 0.2) 0%, transparent 70%)\n    ',
            },
            thumbDisabled: {
              backgroundColor: 'rgba(10, 10, 10, 0.6)',
              borderColor: 'rgba(255, 215, 0, 0.2)',
              boxShadow: 'none',
              color: 'rgba(255, 215, 0, 0.3)',
            },
            input: {
              position: 'absolute',
              opacity: 0,
              width: '100%',
              height: '100%',
              margin: 0,
              cursor: 'pointer',
            },
            inputDisabled: { cursor: 'not-allowed' },
            glyph: {
              position: 'absolute',
              fontSize: '8px',
              color: 'rgba(255, 215, 0, 0.3)',
              transition: shared.Ds.premium,
              pointerEvents: 'none',
              animation: 'sacredSwitchFloat 3s ease-in-out infinite',
            },
            glyphLeft: {
              left: '-16px',
              top: '50%',
              transform: 'translateY(-50%)',
            },
            glyphRight: {
              right: '-16px',
              top: '50%',
              transform: 'translateY(-50%)',
            },
            glyphVisible: { opacity: 0.6 },
            shimmer: {
              position: 'absolute',
              top: '0',
              left: '-100%',
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent)',
              animation: 'sacredSwitchShimmer 2s ease-in-out infinite',
              borderRadius: 'inherit',
            },
            leftLabel: {
              fontSize: '14px',
              fontWeight: 500,
              color: '#FFD700',
              fontFamily: 'Cinzel, serif',
              userSelect: 'none',
              transition: shared.Ds.premium,
              textShadow: '0 0 5px rgba(255, 215, 0, 0.3)',
            },
            rightLabel: {
              fontSize: '14px',
              fontWeight: 500,
              color: '#FFD700',
              fontFamily: 'Cinzel, serif',
              userSelect: 'none',
              transition: shared.Ds.premium,
              textShadow: '0 0 5px rgba(255, 215, 0, 0.3)',
            },
          },
          getSwitchStyles = (
            styles,
            isFocused,
            isHovered,
            isChecked,
            isDisabled
          ) => {
            const baseTheme =
              'light' === (null == styles ? void 0 : styles.theme)
                ? switch_lightTheme
                : 'sacred' === (null == styles ? void 0 : styles.theme)
                  ? switch_sacredTheme
                  : switch_darkTheme
            return {
              container: {
                ...baseTheme.container,
                ...(isDisabled && baseTheme.containerDisabled),
              },
              containerDisabled: baseTheme.containerDisabled,
              track: {
                ...baseTheme.track,
                ...((null == styles ? void 0 : styles.trackWidth) && {
                  width: styles.trackWidth,
                }),
                ...((null == styles ? void 0 : styles.trackHeight) && {
                  height: styles.trackHeight,
                }),
                ...((null == styles ? void 0 : styles.trackBackground) && {
                  backgroundColor: styles.trackBackground,
                }),
                ...((null == styles ? void 0 : styles.trackBorderColor) && {
                  borderColor: styles.trackBorderColor,
                }),
                ...((null == styles ? void 0 : styles.trackBorderRadius) && {
                  borderRadius: styles.trackBorderRadius,
                }),
                ...(!1 === (null == styles ? void 0 : styles.outline) &&
                  baseTheme.trackNoOutline),
                ...(isChecked && {
                  ...baseTheme.trackChecked,
                  ...((null == styles ? void 0 : styles.checkedTrackColor) && {
                    backgroundColor: styles.checkedTrackColor,
                  }),
                }),
                ...(isFocused &&
                  !1 !== (null == styles ? void 0 : styles.focusEffects) &&
                  baseTheme.trackFocused),
                ...(isDisabled && baseTheme.trackDisabled),
              },
              trackNoOutline: baseTheme.trackNoOutline,
              trackChecked: baseTheme.trackChecked,
              trackFocused: baseTheme.trackFocused,
              trackDisabled: baseTheme.trackDisabled,
              thumb: {
                ...baseTheme.thumb,
                ...((null == styles ? void 0 : styles.thumbSize) && {
                  width: styles.thumbSize,
                  height: styles.thumbSize,
                }),
                ...((null == styles ? void 0 : styles.thumbBackground) && {
                  backgroundColor: styles.thumbBackground,
                }),
                ...((null == styles ? void 0 : styles.thumbBorderColor) && {
                  borderColor: styles.thumbBorderColor,
                }),
                ...(isChecked && {
                  ...baseTheme.thumbChecked,
                  ...((null == styles ? void 0 : styles.checkedThumbColor) && {
                    backgroundColor: styles.checkedThumbColor,
                  }),
                }),
                ...(isDisabled && baseTheme.thumbDisabled),
              },
              thumbChecked: baseTheme.thumbChecked,
              thumbDisabled: baseTheme.thumbDisabled,
              input: {
                ...baseTheme.input,
                ...(isDisabled && baseTheme.inputDisabled),
              },
              inputDisabled: baseTheme.inputDisabled,
              glyph: {
                ...baseTheme.glyph,
                ...((null == styles ? void 0 : styles.transitionDuration) && {
                  transition: `all ${styles.transitionDuration} ease`,
                }),
              },
              glyphLeft: {
                ...baseTheme.glyphLeft,
                ...(isHovered && baseTheme.glyphVisible),
              },
              glyphRight: {
                ...baseTheme.glyphRight,
                ...(isHovered && baseTheme.glyphVisible),
              },
              glyphVisible: baseTheme.glyphVisible,
              shimmer: baseTheme.shimmer,
              leftLabel: {
                ...baseTheme.leftLabel,
                ...((null == styles ? void 0 : styles.labelColor) && {
                  color: styles.labelColor,
                }),
                ...((null == styles ? void 0 : styles.labelFontFamily) && {
                  fontFamily: styles.labelFontFamily,
                }),
                ...((null == styles ? void 0 : styles.labelFontSize) && {
                  fontSize: styles.labelFontSize,
                }),
                ...((null == styles ? void 0 : styles.labelFontWeight) && {
                  fontWeight: styles.labelFontWeight,
                }),
              },
              rightLabel: {
                ...baseTheme.rightLabel,
                ...((null == styles ? void 0 : styles.labelColor) && {
                  color: styles.labelColor,
                }),
                ...((null == styles ? void 0 : styles.labelFontFamily) && {
                  fontFamily: styles.labelFontFamily,
                }),
                ...((null == styles ? void 0 : styles.labelFontSize) && {
                  fontSize: styles.labelFontSize,
                }),
                ...((null == styles ? void 0 : styles.labelFontWeight) && {
                  fontWeight: styles.labelFontWeight,
                }),
              },
            }
          },
          card_lightTheme = {
            container: {
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              boxShadow: shared.I4.light.small,
              overflow: 'hidden',
              transition: shared.Ds.medium,
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
            imageOverlay: { display: 'none' },
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
            title: { color: 'rgb(31, 41, 55)', fontWeight: 600 },
            bodySection: { padding: '24px' },
            bodyText: { color: 'rgb(55, 65, 81)', lineHeight: 1.6 },
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
            glyph: { display: 'none' },
            glyphTopRight: { display: 'none' },
            glyphBottomLeft: { display: 'none' },
            price: { color: 'rgb(59, 130, 246)', fontWeight: 600 },
            toggle: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
            },
            toggleLabel: { color: 'rgb(75, 85, 99)' },
            activeToggleLabel: { color: 'rgb(31, 41, 55)', fontWeight: 600 },
            taskContainer: { padding: '16px', cursor: 'pointer' },
            taskCheckbox: { marginRight: '12px' },
            inventoryContainer: { padding: '20px' },
            productContainer: { padding: '20px' },
            pricingSummary: {
              padding: '20px',
              backgroundColor: 'rgba(249, 250, 251, 0.5)',
            },
          },
          card_darkTheme = {
            container: {
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(75, 85, 99, 0.8)',
              borderRadius: '12px',
              backgroundColor: 'rgba(31, 41, 55, 0.95)',
              backdropFilter: 'blur(8px)',
              boxShadow: shared.I4.dark.small,
              overflow: 'hidden',
              transition: shared.Ds.medium,
              fontFamily: '"Inter", sans-serif',
            },
            containerNoOutline: {
              border: 'none',
              boxShadow: 'none',
              backgroundColor: 'rgba(31, 41, 55, 0.6)',
            },
            containerHover: {
              transform: 'translateY(-2px)',
              boxShadow:
                '0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.2)',
              borderColor: 'rgba(96, 165, 250, 0.4)',
            },
            containerWithImage: { flexDirection: 'row' },
            image: {
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              flexShrink: 0,
            },
            imageOverlay: { display: 'none' },
            imageTop: { width: '100%', height: '192px' },
            imageLeft: { width: '192px', height: '100%' },
            content: { display: 'flex', flexDirection: 'column', flexGrow: 1 },
            header: {
              width: '100%',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(75, 85, 99, 0.5)',
              backgroundColor: 'rgba(17, 24, 39, 0.5)',
            },
            headerNoUnderline: { borderBottom: 'none' },
            title: { color: 'rgb(243, 244, 246)', fontWeight: 600 },
            bodySection: { padding: '24px' },
            bodyText: { color: 'rgb(209, 213, 219)', lineHeight: 1.6 },
            footer: {
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 24px',
              marginTop: 'auto',
              borderTop: '1px solid rgba(75, 85, 99, 0.3)',
              backgroundColor: 'rgba(17, 24, 39, 0.3)',
            },
            breadcrumb: { display: 'flex', alignItems: 'center', gap: '8px' },
            accent: {
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              background:
                'linear-gradient(180deg, rgb(96, 165, 250) 0%, rgb(59, 130, 246) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            accentVisible: { opacity: 1 },
            glyph: { display: 'none' },
            glyphTopRight: { display: 'none' },
            glyphBottomLeft: { display: 'none' },
            price: { color: 'rgb(96, 165, 250)', fontWeight: 600 },
            toggle: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
            },
            toggleLabel: { color: 'rgb(156, 163, 175)' },
            activeToggleLabel: { color: 'rgb(243, 244, 246)', fontWeight: 600 },
            taskContainer: { padding: '16px', cursor: 'pointer' },
            taskCheckbox: { marginRight: '12px' },
            inventoryContainer: { padding: '20px' },
            productContainer: { padding: '20px' },
            pricingSummary: {
              padding: '20px',
              backgroundColor: 'rgba(17, 24, 39, 0.5)',
            },
          },
          card_sacredTheme = {
            container: {
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              border: '2px solid rgba(255, 215, 0, 0.4)',
              borderRadius: '12px',
              backgroundColor: 'rgba(10, 10, 10, 0.9)',
              backdropFilter: 'blur(8px)',
              boxShadow: shared.I4.sacred.medium,
              overflow: 'hidden',
              transition: shared.Ds.premium,
              fontFamily: '"Cinzel", serif',
              backgroundImage:
                '\n      radial-gradient(circle at top right, rgba(255, 215, 0, 0.03) 0%, transparent 50%),\n      radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.02) 0%, transparent 50%)\n    ',
            },
            containerNoOutline: { border: 'none', boxShadow: 'none' },
            containerHover: {
              transform: 'translateY(-2px)',
              borderColor: 'rgba(255, 215, 0, 0.8)',
              boxShadow: shared.I4.sacred.large,
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
            title: {
              color: '#FFD700',
              fontFamily: '"Cinzel", serif',
              fontWeight: 700,
              textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
            },
            bodySection: { padding: '28px' },
            bodyText: {
              color: 'rgba(255, 215, 0, 0.8)',
              fontFamily: '"Merriweather", serif',
              lineHeight: 1.6,
              letterSpacing: '0.025em',
            },
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
            accent: { display: 'none' },
            accentVisible: { display: 'none' },
            glyph: {
              position: 'absolute',
              fontSize: '16px',
              color: 'rgba(255, 215, 0, 0.2)',
              pointerEvents: 'none',
              opacity: 0.3,
              animation: 'glyph-rotate 10s linear infinite',
            },
            glyphTopRight: { top: '12px', right: '12px' },
            glyphBottomLeft: { bottom: '12px', left: '12px' },
            price: {
              color: '#FFD700',
              fontWeight: 'bold',
              textShadow: '0 0 5px rgba(255,215,0,0.5)',
              animation: 'sacred-price-pulse 2s infinite alternate',
            },
            toggle: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
            },
            toggleLabel: { color: 'rgba(255, 215, 0, 0.7)' },
            activeToggleLabel: {
              color: '#FFD700',
              textShadow: '0 0 3px rgba(255,215,0,0.5)',
            },
            taskContainer: {
              padding: '20px',
              cursor: 'pointer',
              backgroundColor: 'rgba(255, 215, 0, 0.02)',
            },
            taskCheckbox: { marginRight: '16px' },
            inventoryContainer: {
              padding: '24px',
              backgroundColor: 'rgba(255, 215, 0, 0.02)',
            },
            productContainer: {
              padding: '24px',
              backgroundColor: 'rgba(255, 215, 0, 0.02)',
            },
            pricingSummary: {
              padding: '24px',
              backgroundColor: 'rgba(255, 215, 0, 0.05)',
              borderTop: '1px solid rgba(255, 215, 0, 0.2)',
            },
          },
          getCardStyles = (styles, isHovered, isDisabled) => {
            const baseTheme =
              'light' === (null == styles ? void 0 : styles.theme)
                ? card_lightTheme
                : 'sacred' === (null == styles ? void 0 : styles.theme)
                  ? card_sacredTheme
                  : card_darkTheme
            return {
              container: {
                ...baseTheme.container,
                ...((null == styles ? void 0 : styles.containerBackground) && {
                  backgroundColor: styles.containerBackground,
                }),
                ...((null == styles ? void 0 : styles.borderColor) && {
                  borderColor: styles.borderColor,
                }),
                ...((null == styles ? void 0 : styles.borderRadius) && {
                  borderRadius: styles.borderRadius,
                }),
                ...((null == styles ? void 0 : styles.width) && {
                  width:
                    'number' == typeof styles.width
                      ? `${styles.width}px`
                      : styles.width,
                }),
                ...((null == styles ? void 0 : styles.height) && {
                  height:
                    'number' == typeof styles.height
                      ? `${styles.height}px`
                      : styles.height,
                }),
                ...((null == styles ? void 0 : styles.padding) && {
                  padding: styles.padding,
                }),
                ...((null == styles ? void 0 : styles.margin) && {
                  margin: styles.margin,
                }),
                ...((null == styles ? void 0 : styles.fontFamily) && {
                  fontFamily: styles.fontFamily,
                }),
                ...((null == styles ? void 0 : styles.boxShadow) && {
                  boxShadow: styles.boxShadow,
                }),
                ...((null == styles ? void 0 : styles.backdropFilter) && {
                  backdropFilter: styles.backdropFilter,
                }),
                ...(!1 === (null == styles ? void 0 : styles.outline) &&
                  baseTheme.containerNoOutline),
                ...(isHovered &&
                  !1 !== (null == styles ? void 0 : styles.hoverEffects) &&
                  baseTheme.containerHover),
                ...(isDisabled && {
                  opacity: 0.6,
                  pointerEvents: 'none',
                  filter: 'grayscale(0.3)',
                }),
              },
              containerNoOutline: baseTheme.containerNoOutline,
              containerHover: baseTheme.containerHover,
              containerWithImage: baseTheme.containerWithImage,
              image: baseTheme.image,
              imageOverlay: baseTheme.imageOverlay,
              imageTop: baseTheme.imageTop,
              imageLeft: baseTheme.imageLeft,
              content: baseTheme.content,
              header: {
                ...baseTheme.header,
                ...(!1 === (null == styles ? void 0 : styles.titleUnderline) &&
                  baseTheme.headerNoUnderline),
              },
              headerNoUnderline: baseTheme.headerNoUnderline,
              title: {
                ...baseTheme.title,
                ...((null == styles ? void 0 : styles.textColor) && {
                  color: styles.textColor,
                }),
                ...((null == styles ? void 0 : styles.fontSize) && {
                  fontSize: styles.fontSize,
                }),
                ...((null == styles ? void 0 : styles.fontWeight) && {
                  fontWeight: styles.fontWeight,
                }),
              },
              bodySection: baseTheme.bodySection,
              bodyText: {
                ...baseTheme.bodyText,
                ...((null == styles ? void 0 : styles.textColor) && {
                  color: styles.textColor,
                }),
              },
              footer: baseTheme.footer,
              breadcrumb: baseTheme.breadcrumb,
              accent: {
                ...baseTheme.accent,
                ...((null == styles ? void 0 : styles.accentColor) && {
                  background: `linear-gradient(180deg, ${styles.accentColor} 0%, ${styles.accentColor}80 100%)`,
                }),
              },
              accentVisible: baseTheme.accentVisible,
              glyph: baseTheme.glyph,
              glyphTopRight: baseTheme.glyphTopRight,
              glyphBottomLeft: baseTheme.glyphBottomLeft,
              price: baseTheme.price,
              toggle: baseTheme.toggle,
              toggleLabel: baseTheme.toggleLabel,
              activeToggleLabel: baseTheme.activeToggleLabel,
              taskContainer: baseTheme.taskContainer,
              taskCheckbox: baseTheme.taskCheckbox,
              inventoryContainer: baseTheme.inventoryContainer,
              productContainer: baseTheme.productContainer,
              pricingSummary: baseTheme.pricingSummary,
            }
          },
          h1Config = {
            fontSize: '3rem',
            fontWeight: 700,
            textTransform: 'none',
          },
          h2Config = {
            fontSize: '2.5rem',
            fontWeight: 700,
            textTransform: 'none',
          },
          h3Config = {
            fontSize: '2rem',
            fontWeight: 400,
            textTransform: 'none',
          },
          h4Config = {
            fontSize: '1.5rem',
            fontWeight: 400,
            textTransform: 'none',
          },
          h5Config = {
            fontSize: '1.25rem',
            fontWeight: 400,
            textTransform: 'none',
          },
          h6Config = {
            fontSize: '1.1rem',
            fontWeight: 400,
            textTransform: 'none',
          },
          paragraphConfig = {
            fontSize: '.9rem',
            fontWeight: 400,
            textTransform: 'none',
          },
          helperFooterConfig = {
            fontSize: '0.7rem',
            fontWeight: 400,
            textTransform: 'none',
          },
          black = { main: '#000000', light: '#333333', dark: '#000000' },
          grey = { main: '#E8E8E8', light: '#F5F5F5', dark: '#BDBDBD' }
      },
      './src/theme/shared.ts': (
        __unused_webpack_module,
        __webpack_exports__,
        __webpack_require__
      ) => {
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
