'use client'

/**
 * =============================================================================
 * SignatureField — a canvas signature pad bound to a form string field
 * =============================================================================
 *
 * Captures a hand-drawn signature and stores it as a PNG **data-URL string** on
 * the form engine (or via the controlled `value`/`onChange` pair outside a form).
 * Self-contained: native canvas + pointer events, no third-party dependency.
 *
 *   <Form schema={S} initialValues={d} onSubmit={save}>
 *     <SignatureField name="signatureImage" label="Signature" required />
 *   </Form>
 *
 * Like every goobs field it auto-binds inside a `<Form>` when given a `name` and
 * no explicit `value` (see useFieldBinding); outside a form it is a controlled
 * component driven by `value` (a data-URL or '') + `onChange`. The stored value
 * is `''` when empty so a `z.string().min(1)` / required schema rejects an
 * un-signed field. An incoming non-empty `value` (edit mode) is painted onto the
 * canvas so the existing signature shows and can be cleared/redrawn.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import cssStyles from './SignatureField.module.css'
import FieldShell, { type FieldStyleOverrides } from '../Shell'
import { useFieldBinding } from '../Shell/useFieldBinding'

export interface SignatureFieldProps {
  /** The signature as a PNG data-URL, or '' when empty. */
  value?: string
  /** Called with the new data-URL on each stroke end, or '' on clear. */
  onChange?: (value: string) => void
  /** Called (touched) when the surface loses focus / a stroke ends. */
  onBlur?: () => void
  label?: React.ReactNode
  helperText?: string
  /** Error message rendered below the surface; sets aria-invalid. */
  error?: string | boolean
  required?: boolean
  disabled?: boolean
  placeholder?: string
  /** Drawing-stroke color. Default '#111111'. */
  penColor?: string
  /** Canvas background (also the exported PNG background). Default '#ffffff'. */
  backgroundColor?: string
  /** Text shown on the clear button. Default 'Clear'. */
  clearText?: string
  /** Stable test selector — emitted as `data-field` on the wrapper. */
  dataField?: string
  /** Stable test selector — emitted as `data-field-name` on the wrapper. */
  dataFieldName?: string
  /** Form-engine binding key (also `data-field-name` when dataFieldName unset). */
  name?: string
  styles?: FieldStyleOverrides & {
    /** Pixel height of the drawing surface (default 180). */
    height?: number | string
  }
}

const SignatureField: React.FC<SignatureFieldProps> = ({
  value: valueProp,
  onChange: onChangeProp,
  onBlur: onBlurProp,
  label,
  helperText,
  error,
  required: requiredProp,
  disabled: disabledProp,
  placeholder = 'Sign here',
  penColor = '#111111',
  backgroundColor = '#ffffff',
  clearText = 'Clear',
  dataField,
  dataFieldName,
  name,
  styles,
}) => {
  // Form binding: inside a <Form> with a name and no explicit value, the engine
  // drives value/onChange; otherwise this is a controlled pass-through.
  const {
    value,
    onChange: rebindOnChange,
    onBlur: bindingOnBlur,
  } = useFieldBinding<string>({
    name,
    value: valueProp,
    onChange: onChangeProp,
    onBlur: onBlurProp,
  })
  const onChange = rebindOnChange ?? onChangeProp
  const onBlur = bindingOnBlur ?? onBlurProp

  const disabled = disabledProp ?? styles?.disabled ?? false
  const required = requiredProp ?? styles?.required ?? false

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawingRef = useRef(false)
  // The last data-URL THIS component emitted, so the value→canvas sync effect
  // can tell an external/initial value (repaint) from our own echo (skip).
  const lastEmittedRef = useRef<string>('')
  const [hasInk, setHasInk] = useState<boolean>(Boolean(value))
  // Screen-reader announcement channel. The signature surface is a pointer-only
  // <canvas> whose success/clear feedback is otherwise conveyed only by pixels
  // appearing — invisible to AT. This polite live region announces each state
  // transition so a non-sighted user learns their stroke or clear took effect
  // (WCAG 4.1.3 Status Messages). Empty on mount so nothing is announced until
  // the user acts.
  const [announcement, setAnnouncement] = useState<string>('')

  // Size the canvas backing store to its CSS box × devicePixelRatio so strokes
  // stay crisp, and scale the context so we can draw in CSS pixels. Repaints the
  // current value after a resize (the backing store is cleared by a size change).
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    const rect = canvas.getBoundingClientRect()
    const cssWidth = rect.width || canvas.clientWidth || 1
    const cssHeight = rect.height || canvas.clientHeight || 1
    canvas.width = Math.round(cssWidth * dpr)
    canvas.height = Math.round(cssHeight * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, cssWidth, cssHeight)
    ctx.lineWidth = 2.2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = penColor
  }, [backgroundColor, penColor])

  // Paint a data-URL onto the (already-sized) canvas.
  const paintValue = useCallback((dataUrl: string) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const img = new Image()
    img.onload = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.drawImage(img, 0, 0, rect.width, rect.height)
    }
    img.src = dataUrl
  }, [])

  // Initial setup + resize handling.
  useEffect(() => {
    setupCanvas()
    if (value) {
      lastEmittedRef.current = value
      paintValue(value)
    }
    const canvas = canvasRef.current
    if (!canvas || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => {
      setupCanvas()
      if (lastEmittedRef.current) paintValue(lastEmittedRef.current)
    })
    observer.observe(canvas)
    return () => observer.disconnect()
    // Run once on mount; value sync is handled by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // External value changes (initial edit value, programmatic reset). Skip our
  // own echoes (value === lastEmitted). An empty value clears the surface.
  useEffect(() => {
    const current = value ?? ''
    if (current === lastEmittedRef.current) return
    lastEmittedRef.current = current
    setupCanvas()
    if (current) {
      paintValue(current)
      setHasInk(true)
    } else {
      setHasInk(false)
    }
  }, [value, setupCanvas, paintValue])

  const pointFromEvent = (
    e: React.PointerEvent<HTMLCanvasElement>
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (disabled) return
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      const point = pointFromEvent(e)
      if (!canvas || !ctx || !point) return
      try {
        canvas.setPointerCapture(e.pointerId)
      } catch {
        // Pointer capture is a progressive enhancement — it keeps the stroke
        // tracking the pointer if it leaves the canvas. It throws when there is
        // no active native pointer for this id (e.g. synthetic pointer events
        // dispatched by a Storybook play function / test); the stroke still
        // works without capture, so this is safe to ignore.
      }
      drawingRef.current = true
      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
    },
    [disabled]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawingRef.current || disabled) return
      const ctx = canvasRef.current?.getContext('2d')
      const point = pointFromEvent(e)
      if (!ctx || !point) return
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
    },
    [disabled]
  )

  const endStroke = useCallback(() => {
    if (!drawingRef.current) return
    drawingRef.current = false
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    lastEmittedRef.current = dataUrl
    setHasInk(true)
    setAnnouncement('Signature captured.')
    onChange?.(dataUrl)
    onBlur?.()
  }, [onChange, onBlur])

  const handleClear = useCallback(() => {
    if (disabled) return
    setupCanvas()
    lastEmittedRef.current = ''
    setHasInk(false)
    setAnnouncement('Signature cleared.')
    onChange?.('')
    onBlur?.()
  }, [disabled, setupCanvas, onChange, onBlur])

  const surfaceStyle: React.CSSProperties | undefined = styles?.height
    ? ({
        ['--signature-height' as string]:
          typeof styles.height === 'number'
            ? `${styles.height}px`
            : styles.height,
      } as React.CSSProperties)
    : undefined

  // Accessible name for the pointer-only canvas. `htmlFor` on FieldShell's
  // <label> does not name a non-labelable <canvas>, so the canvas carries its
  // own name — and that name must expose the CURRENT state (signed vs empty)
  // and whether the field is required, since neither the aria-hidden required
  // glyph nor aria-required (unsupported on role="img") reaches AT here. This
  // makes signed/empty perceivable to a screen reader on focus (WCAG 1.1.1,
  // 1.3.1, 4.1.2).
  const baseLabel = typeof label === 'string' && label ? label : 'Signature pad'
  const canvasAriaLabel = `${baseLabel}${required ? ', required' : ''}, ${
    hasInk ? 'signature present' : 'no signature, draw to sign'
  }`

  return (
    <FieldShell
      label={label}
      helperText={helperText}
      error={error}
      disabled={disabled}
      required={required}
      dataField={dataField}
      dataFieldName={dataFieldName}
      name={name}
      filled={hasInk}
      styles={styles}
    >
      {({ inputId, inputAriaProps }) => {
        // FieldShell's inputAriaProps bag includes `aria-required` when the
        // field is required. aria-required is a WIDGET property, NOT a global
        // attribute, so it is INVALID on this canvas's role="img" (axe-core
        // aria-allowed-attr flags it — a WCAG 4.1.2 automated failure) and is
        // ignored by AT. Strip only aria-required here; required-ness is instead
        // conveyed through the accessible name (canvasAriaLabel). aria-invalid,
        // aria-describedby, and aria-disabled are all valid on any role, so they
        // are preserved.
        const canvasAriaProps = { ...inputAriaProps }
        delete canvasAriaProps['aria-required']
        return (
        <div>
          <div
            className={cssStyles.surface}
            data-disabled={disabled || undefined}
            data-signed={hasInk || undefined}
            style={surfaceStyle}
          >
            <canvas
              ref={canvasRef}
              id={inputId}
              className={cssStyles.canvas}
              role="img"
              aria-label={canvasAriaLabel}
              // Reachable by keyboard/AT so a non-pointer user can perceive the
              // field's name, state, and error (aria-describedby) — the freehand
              // drawing itself is an inherent pointer/handwriting gesture (no
              // keyboard-draw is required), but the field must not be skippable.
              // Not focusable while disabled.
              tabIndex={disabled ? -1 : 0}
              data-field-name={dataFieldName ?? name}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endStroke}
              onPointerLeave={endStroke}
              {...canvasAriaProps}
            />
            {!hasInk && (
              // Purely visual affordance — the same "draw to sign" instruction
              // is in the canvas's accessible name, so hide the duplicate from AT.
              <div className={cssStyles.placeholder} aria-hidden="true">
                {placeholder}
              </div>
            )}
          </div>
          <div className={cssStyles.toolbar}>
            <button
              type="button"
              className={cssStyles.clearButton}
              onClick={handleClear}
              disabled={disabled || !hasInk}
              data-action="clear"
              // The visible text ("Clear") names the button, but on its own it
              // is ambiguous in a screen-reader element/rotor list where buttons
              // are read out of their visual context (WCAG 2.4.6 Headings and
              // Labels) — several fields could each expose a bare "Clear". Fold
              // the field identity into the accessible name so it reads e.g.
              // "Clear, Signature". Built from `clearText` first so the visible
              // label text is always a substring of the accessible name (WCAG
              // 2.5.3 Label in Name) even when a consumer customizes `clearText`.
              aria-label={`${clearText}, ${baseLabel}`}
            >
              {clearText}
            </button>
          </div>
          {/* Polite live region: announces signed/cleared to screen readers
              (visual users see the ink/placeholder change directly). */}
          <div
            role="status"
            aria-live="polite"
            className={cssStyles.srOnly}
            data-signature-status=""
          >
            {announcement}
          </div>
        </div>
        )
      }}
    </FieldShell>
  )
}

SignatureField.displayName = 'SignatureField'

export default SignatureField
