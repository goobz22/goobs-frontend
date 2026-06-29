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
      canvas.setPointerCapture(e.pointerId)
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
    onChange?.(dataUrl)
    onBlur?.()
  }, [onChange, onBlur])

  const handleClear = useCallback(() => {
    if (disabled) return
    setupCanvas()
    lastEmittedRef.current = ''
    setHasInk(false)
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
      {({ inputId, inputAriaProps }) => (
        <div>
          <div
            className={cssStyles.surface}
            data-disabled={disabled || undefined}
            style={surfaceStyle}
          >
            <canvas
              ref={canvasRef}
              id={inputId}
              className={cssStyles.canvas}
              role="img"
              aria-label={
                typeof label === 'string' ? label : 'Signature pad'
              }
              data-field-name={dataFieldName ?? name}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endStroke}
              onPointerLeave={endStroke}
              {...inputAriaProps}
            />
            {!hasInk && (
              <div className={cssStyles.placeholder}>{placeholder}</div>
            )}
          </div>
          <div className={cssStyles.toolbar}>
            <button
              type="button"
              className={cssStyles.clearButton}
              onClick={handleClear}
              disabled={disabled || !hasInk}
              data-action="clear"
            >
              {clearText}
            </button>
          </div>
        </div>
      )}
    </FieldShell>
  )
}

SignatureField.displayName = 'SignatureField'

export default SignatureField
