'use client'

import React, {
  useId,
  useRef,
  useState,
  type DragEvent,
  type ReactNode,
} from 'react'
import { emitDiag } from '../../utils/diag'
import FieldShell from '../Field/Shell'
import type { FieldTheme } from '../Field/Shell/types'
import cssStyles from './FileDropzone.module.css'

export type FileDropzoneVariant = 'image' | 'document'

export interface FileDropzoneProps {
  /**
   * Current value identifier — typically the uploaded asset URL / filename.
   * Drives the "Upload" vs "Change" button label and the cleared-input reset.
   * Presentation-only: the dropzone never fetches it, it's just a signal that
   * a value exists.
   */
  value?: string

  /** Called with the picked `File` whenever the user drops or browses one. */
  onFileSelect: (file: File) => void

  /**
   * `accept` attribute for the hidden file input. Defaults are derived from
   * `variant` (`'image/*'` for image, all files for document) when omitted.
   */
  accept?: string

  /**
   * Preview node rendered in the leading preview tile (e.g. a Next.js
   * `<Image>` for image uploads, a doc icon + filename for documents). When
   * omitted, a variant-appropriate placeholder glyph renders.
   */
  preview?: ReactNode

  /** Host-controlled uploading flag — disables the control + shows progress copy. */
  uploading?: boolean

  /** Host-controlled error string — rendered in the FieldShell error region. */
  error?: string

  /** Visible field label. Forwarded to `<FieldShell>`. */
  label?: ReactNode

  /** Marks the field required (FieldShell renders the required indicator). */
  required?: boolean

  /** Stable test selector — forwarded to FieldShell as `data-field-name`. */
  name?: string

  /**
   * Layout / copy variant. `'image'` shows a square preview tile; `'document'`
   * shows a wide drop strip. Default `'image'`.
   */
  variant?: FileDropzoneVariant

  /** Optional remove handler. When set, a "Remove" control renders while a value exists. */
  onRemove?: () => void

  /** Theming. Default `'sacred'`. */
  styles?: { theme?: FieldTheme }
}

function defaultAccept(variant: FileDropzoneVariant): string {
  return variant === 'image' ? 'image/*' : ''
}

function placeholderGlyph(variant: FileDropzoneVariant): ReactNode {
  if (variant === 'image') {
    return (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    )
  }
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

/**
 * Drag-drop + click-to-browse file picker with a preview slot, generalized
 * from the ThothOS Cloudflare image-upload field into a presentation-only
 * primitive: the host app owns the upload transport, receives the picked
 * `File` via `onFileSelect`, and controls `uploading` / `error` / `preview`.
 * Label, required, and error wiring is delegated to the shared `<FieldShell>`
 * so the dropzone announces to assistive tech like every other goobs field.
 * The drop surface is a real `<button>` that opens a hidden
 * `<input type="file">` and doubles as a native drag-drop target; the input
 * resets after each pick so the same file can be re-selected. Because that
 * hidden input is `display:none` (absent from the accessibility tree), the
 * shell's state ARIA (`aria-required` / `aria-invalid` / the `aria-describedby`
 * → error-region link) is spread onto the operable `<button>` instead — the
 * same convention the Dropdown combobox uses — and a visually-hidden polite
 * `role="status"` region announces the pick / uploading / selected transition
 * (WCAG 4.1.3) since a disabled button's label change isn't reliably announced.
 * Emits `data-component="FileDropzone"` plus a `file.select` diagnostics beacon
 * on every pick.
 */
const FileDropzone: React.FC<FileDropzoneProps> = ({
  value,
  onFileSelect,
  accept,
  preview,
  uploading = false,
  error,
  label,
  required,
  name,
  variant = 'image',
  onRemove,
  styles,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const instanceId = useId()
  const theme = styles?.theme ?? 'sacred'
  const resolvedAccept = accept ?? defaultAccept(variant)
  const hasValue = value !== undefined && value !== ''
  const hintId = `${instanceId}-hint`
  const noun = variant === 'image' ? 'image' : 'file'

  // Visually-hidden polite status text (WCAG 4.1.3). While `uploading` the
  // drop-target button is natively `disabled`, and a disabled control's label
  // change ("Upload image" → "Uploading…") is not reliably announced; drag-drop
  // picks never focus the button at all. This live region carries the
  // pick / upload / done transition to assistive tech regardless of focus.
  const statusText = uploading
    ? `Uploading ${noun}…`
    : hasValue
      ? `${noun.charAt(0).toUpperCase()}${noun.slice(1)} selected`
      : ''

  const dispatchFile = (file: File | undefined | null): void => {
    if (!file) return
    emitDiag({
      type: 'action.invoke',
      action: 'file.select',
      subject: name ?? variant,
    })
    onFileSelect(file)
    // Reset so the SAME file can be re-picked (mirrors the ThothOS original).
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    dispatchFile(event.target.files?.[0])
  }

  const handleDrop = (event: DragEvent<HTMLButtonElement>): void => {
    event.preventDefault()
    setIsDragActive(false)
    if (uploading) return
    dispatchFile(event.dataTransfer.files?.[0])
  }

  const handleDragOver = (event: DragEvent<HTMLButtonElement>): void => {
    event.preventDefault()
    if (!uploading) setIsDragActive(true)
  }

  const handleDragLeave = (event: DragEvent<HTMLButtonElement>): void => {
    event.preventDefault()
    setIsDragActive(false)
  }

  const browseLabel = uploading
    ? 'Uploading…'
    : hasValue
      ? variant === 'image'
        ? 'Change image'
        : 'Change file'
      : variant === 'image'
        ? 'Upload image'
        : 'Upload file'

  return (
    <FieldShell
      label={label}
      {...(required !== undefined && { required })}
      {...(error !== undefined && { error })}
      {...(name !== undefined && { name, dataFieldName: name })}
      dataField="fileDropzone"
      styles={{ theme }}
    >
      {({ inputId, inputAriaProps }) => {
        // The operable control is the <button>, not the display:none file
        // input (which is removed from the accessibility tree). So the state
        // ARIA FieldShell builds — aria-required / aria-invalid / the
        // aria-describedby → error-region link — must ride the BUTTON, mirroring
        // the Dropdown combobox pattern (Field/Dropdown/Regular). Merge the
        // shell's error/helper describedby with the local drag-drop hint so a
        // screen reader hears both the instruction and any error on the control
        // it actually operates.
        const describedBy =
          [hintId, inputAriaProps['aria-describedby']]
            .filter(Boolean)
            .join(' ') || undefined
        return (
        <div
          className={cssStyles.dropzone}
          data-component="FileDropzone"
          data-file-dropzone="true"
          data-theme={theme}
          data-variant={variant}
          {...(uploading && { 'data-uploading': 'true' })}
          {...(isDragActive && { 'data-drag-active': 'true' })}
        >
          <div className={cssStyles.row}>
            <div
              className={cssStyles.preview}
              data-file-dropzone-preview="true"
            >
              {preview !== undefined ? (
                preview
              ) : (
                <span className={cssStyles.placeholder} aria-hidden="true">
                  {placeholderGlyph(variant)}
                </span>
              )}
            </div>

            <div className={cssStyles.controls}>
              <input
                ref={fileInputRef}
                id={inputId}
                type="file"
                className={cssStyles.hiddenInput}
                {...(resolvedAccept !== '' && { accept: resolvedAccept })}
                onChange={handleInputChange}
                disabled={uploading}
                {...inputAriaProps}
              />
              <button
                type="button"
                className={cssStyles.dropTarget}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                disabled={uploading}
                {...inputAriaProps}
                aria-describedby={describedBy}
                {...(uploading && { 'aria-busy': true })}
                data-file-dropzone-browse="true"
              >
                <span className={cssStyles.dropTargetLabel}>{browseLabel}</span>
                <span id={hintId} className={cssStyles.dropTargetHint}>
                  Drag &amp; drop or click to browse
                </span>
              </button>

              {hasValue && onRemove !== undefined && (
                <button
                  type="button"
                  className={cssStyles.removeButton}
                  onClick={onRemove}
                  disabled={uploading}
                  aria-label={`Remove ${noun}`}
                  data-file-dropzone-remove="true"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <span
            className={cssStyles.srOnly}
            role="status"
            aria-live="polite"
            data-file-dropzone-status="true"
          >
            {statusText}
          </span>
        </div>
        )
      }}
    </FieldShell>
  )
}

FileDropzone.displayName = 'FileDropzone'

export default FileDropzone
