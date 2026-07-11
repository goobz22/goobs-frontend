'use client'

import React, {
  forwardRef,
  type CSSProperties,
  type ElementType,
} from 'react'

import cssStyles from './Paper.module.css'

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  /** Styling options: theme plus scalar overrides layered over the CSS-module defaults. */
  styles?: {
    /** Theme variant: only 'sacred' selects the sacred surface (gold glow); any other value (or unset) renders the default surface. */
    theme?: string
    /** Surface width. */
    width?: string
    /** Surface max-width. */
    maxWidth?: string
    /** Surface min-width. */
    minWidth?: string
    /** Surface height. */
    height?: string
    /** Surface max-height. */
    maxHeight?: string
    /** Surface min-height. */
    minHeight?: string
    /** Surface padding. */
    padding?: string
    /** Surface border radius. */
    borderRadius?: string
    /** Surface background color. */
    backgroundColor?: string
    /** Surface background-image. */
    backgroundImage?: string
    /** Full border shorthand; wins over borderColor/borderWidth. */
    border?: string
    /** Border color; composes `<borderWidth> solid <borderColor>` when `border` is not set. */
    borderColor?: string
    /** Border width; with neither border nor borderColor it composes a theme-tinted border on its own (default 1px with borderColor). */
    borderWidth?: string
    /** Surface box shadow; replaces the elevation-derived shadow. */
    boxShadow?: string
    /** Surface backdrop-filter. */
    backdropFilter?: string
    /** Surface opacity. */
    opacity?: number | string
    /** Margin shorthand; when set, the per-side margins are ignored. */
    margin?: string
    /** Bottom margin (ignored when `margin` is set). */
    marginBottom?: string
    /** Top margin (ignored when `margin` is set). */
    marginTop?: string
    /** Left margin (ignored when `margin` is set). */
    marginLeft?: string
    /** Right margin (ignored when `margin` is set). */
    marginRight?: string
  }
  elevation?: number
  /**
   * Underlying element. Default `'div'` (a generic surface). Because Paper
   * groups related content, a consumer that IS a document region should pass
   * the semantically correct sectioning/landmark element so the surface is
   * announced to assistive tech and reflected in the SSR'd document outline
   * for crawlers — e.g. `as="section"`, `as="article"`, `as="aside"`,
   * `as="header"`, `as="footer"`, or `as="main"`. The chosen element keeps
   * its own native role (Paper adds none); name a landmark via `aria-label`/
   * `aria-labelledby` forwarded through rest props. All `data-*` test hooks,
   * `data-component="Paper"`, theming, and rest props are emitted regardless
   * of the element, so the machine-test contract is unchanged. (WCAG 1.3.1
   * Info and Relationships.)
   */
  as?: ElementType
  /**
   * When this Paper is the surface for an inline form, set
   * `dataForm="<verb>-<entity>"` (e.g. `"create-contract"`,
   * `"manage-category"`) to mark the form root for tests:
   *   `await expect(page.locator('[data-form="create-contract"]')).toBeVisible()`
   * Generic `data-*` attributes already pass through via
   * `...restProps`; this is the named, documented hook.
   */
  dataForm?: string
  /**
   * Singular entity noun (e.g. `"contract"`, `"category"`). Emitted as
   * `data-subject="<value>"` so tests can disambiguate when multiple
   * Papers (e.g. nested forms) live on the same page.
   */
  dataSubject?: string
  /**
   * Generic kind label (e.g. `"card"`, `"panel"`, `"summary"`)
   * emitted as `data-paper="<value>"`. Use when the surface needs a
   * stable selector but isn't a form.
   */
  dataPaper?: string
}

export const Paper = forwardRef<HTMLDivElement, PaperProps>(
  (
    {
      children,
      styles,
      elevation = 1,
      className,
      as,
      dataForm,
      dataSubject,
      dataPaper,
      ...restProps
    },
    ref
  ) => {
    // Polymorphic surface element. Defaults to a generic `<div>`; a consumer
    // that IS a document region passes the correct sectioning/landmark element
    // (section/article/aside/header/footer/main). The element keeps its own
    // native role — Paper adds none. Matches the FieldGrid `as` convention.
    const Element = (as ?? 'div') as ElementType
    const isSacredTheme = styles?.theme === 'sacred'
    const isDarkTheme = styles?.theme === 'dark'
    // Real three-theme surface selection. 'sacred' and 'dark' each get their
    // own [data-theme] block in Paper.module.css; anything else (incl. 'light'
    // and unset) falls through to the base .root (the historical light surface).
    const dataTheme = isSacredTheme ? 'sacred' : isDarkTheme ? 'dark' : 'light'

    // Elevation-driven box-shadow. This is a scalar function of `elevation`,
    // so it is computed here and handed to CSS via the --paper-shadow custom
    // property; the selector lives in Paper.module.css. Values match the old
    // inline logic exactly:
    //   sacred → gold glow, default → soft drop shadow
    const elevationShadow = isSacredTheme
      ? `0 0 ${20 + elevation * 10}px var(--goobs-gold-a30), 0 0 ${40 + elevation * 20}px var(--goobs-gold-a10)`
      : `0 ${elevation}px ${elevation * 4}px var(--goobs-black-a10)`
    const resolvedShadow = styles?.boxShadow ?? elevationShadow

    // Border resolution mirrors the old branch precedence: an explicit
    // `border` wins, else `borderColor` (+ optional `borderWidth`), else the
    // theme default. Only emit a JS override when the caller supplied one of
    // those — otherwise the [data-theme] CSS default applies.
    const resolvedBorder = styles?.border
      ? styles.border
      : styles?.borderColor
        ? `${styles.borderWidth || '1px'} solid ${styles.borderColor}`
        : styles?.borderWidth
          ? `${styles.borderWidth} solid ${
              isSacredTheme
                ? 'var(--goobs-gold-a30)'
                : isDarkTheme
                  ? 'rgba(255, 255, 255, 0.12)'
                  : 'var(--goobs-black-a12)'
            }`
          : undefined

    // Caller-supplied scalar overrides layer on top of the CSS defaults. The
    // elevation shadow always rides through --paper-shadow.
    const dynamicStyle: CSSProperties = {
      ['--paper-shadow' as string]: resolvedShadow,
      ...(styles?.width !== undefined && { width: styles.width }),
      ...(styles?.maxWidth !== undefined && { maxWidth: styles.maxWidth }),
      ...(styles?.minWidth !== undefined && { minWidth: styles.minWidth }),
      ...(styles?.height !== undefined && { height: styles.height }),
      ...(styles?.maxHeight !== undefined && { maxHeight: styles.maxHeight }),
      ...(styles?.minHeight !== undefined && { minHeight: styles.minHeight }),
      ...(styles?.padding !== undefined && { padding: styles.padding }),
      ...(styles?.borderRadius !== undefined && {
        borderRadius: styles.borderRadius,
      }),
      ...(styles?.backgroundColor !== undefined && {
        backgroundColor: styles.backgroundColor,
      }),
      ...(styles?.backgroundImage !== undefined && {
        backgroundImage: styles.backgroundImage,
      }),
      ...(resolvedBorder !== undefined && { border: resolvedBorder }),
      ...(styles?.backdropFilter !== undefined && {
        backdropFilter: styles.backdropFilter,
      }),
      ...(styles?.opacity !== undefined && { opacity: styles.opacity }),
      // `margin` shorthand wins over the individual sides (old behaviour:
      // when `margin` is set the per-side props were dropped).
      ...(styles?.margin !== undefined
        ? { margin: styles.margin }
        : {
            ...(styles?.marginBottom !== undefined && {
              marginBottom: styles.marginBottom,
            }),
            ...(styles?.marginTop !== undefined && {
              marginTop: styles.marginTop,
            }),
            ...(styles?.marginLeft !== undefined && {
              marginLeft: styles.marginLeft,
            }),
            ...(styles?.marginRight !== undefined && {
              marginRight: styles.marginRight,
            }),
          }),
    }

    return (
      <Element
        ref={ref}
        className={[cssStyles.root, className].filter(Boolean).join(' ')}
        data-component="Paper"
        data-theme={dataTheme}
        style={dynamicStyle}
        data-form={dataForm}
        data-subject={dataSubject}
        data-paper={dataPaper}
        {...restProps}
      >
        {children}
      </Element>
    )
  }
)

Paper.displayName = 'Paper'

export default Paper
