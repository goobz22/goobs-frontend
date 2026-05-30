'use client'

import React, { forwardRef, type CSSProperties } from 'react'

import cssStyles from './Paper.module.css'

export interface PaperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  styles?: {
    theme?: string
    width?: string
    maxWidth?: string
    minWidth?: string
    height?: string
    maxHeight?: string
    minHeight?: string
    padding?: string
    borderRadius?: string
    backgroundColor?: string
    backgroundImage?: string
    border?: string
    borderColor?: string
    borderWidth?: string
    boxShadow?: string
    backdropFilter?: string
    opacity?: number | string
    margin?: string
    marginBottom?: string
    marginTop?: string
    marginLeft?: string
    marginRight?: string
  }
  elevation?: number
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
      dataForm,
      dataSubject,
      dataPaper,
      ...restProps
    },
    ref
  ) => {
    const isSacredTheme = styles?.theme === 'sacred'

    // Elevation-driven box-shadow. This is a scalar function of `elevation`,
    // so it is computed here and handed to CSS via the --paper-shadow custom
    // property; the selector lives in Paper.module.css. Values match the old
    // inline logic exactly:
    //   sacred → gold glow, default → soft drop shadow
    const elevationShadow = isSacredTheme
      ? `0 0 ${20 + elevation * 10}px rgba(255, 215, 0, 0.3), 0 0 ${40 + elevation * 20}px rgba(255, 215, 0, 0.1)`
      : `0 ${elevation}px ${elevation * 4}px rgba(0, 0, 0, 0.1)`
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
          ? `${styles.borderWidth} solid ${isSacredTheme ? 'rgba(255, 215, 0, 0.3)' : 'rgba(0, 0, 0, 0.12)'}`
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
      <div
        ref={ref}
        className={[cssStyles.root, className].filter(Boolean).join(' ')}
        data-component="Paper"
        data-theme={isSacredTheme ? 'sacred' : 'default'}
        style={dynamicStyle}
        data-form={dataForm}
        data-subject={dataSubject}
        data-paper={dataPaper}
        {...restProps}
      >
        {children}
      </div>
    )
  }
)

Paper.displayName = 'Paper'

export default Paper
