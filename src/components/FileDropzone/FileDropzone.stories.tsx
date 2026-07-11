import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn, userEvent, expect, waitFor } from 'storybook/test'
import { z } from 'zod'
import FileDropzone from './index'
import Form from '../Form'
import CustomButton from '../Button'

const meta: Meta<typeof FileDropzone> = {
  title: 'Components/FileDropzone',
  component: FileDropzone,
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj<typeof FileDropzone>

/**
 * Form-bound usage. The host owns the upload transport — here a stub that just
 * records the picked filename — and feeds the result back through `value` +
 * `preview`. FieldShell supplies the label, required indicator, and error wiring.
 */
const productSchema = z.object({
  imageUrl: z.string().min(1, 'A product image is required'),
})

type ProductValues = z.infer<typeof productSchema>

function ImageUploadForm() {
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const fakeUpload = async (file: File) => {
    setUploading(true)
    // Stand-in for the host's Cloudflare hook.
    await new Promise(resolve => setTimeout(resolve, 600))
    setImageUrl(`uploaded://${file.name}`)
    setUploading(false)
  }

  return (
    <Form
      schema={productSchema}
      initialValues={{ imageUrl } as ProductValues}
      onSubmit={fn()}
      subject="product"
      id="product-image-form"
    >
      <FileDropzone
        name="imageUrl"
        label="Product Image"
        required
        variant="image"
        value={imageUrl}
        uploading={uploading}
        onFileSelect={fakeUpload}
        onRemove={() => setImageUrl('')}
        preview={
          imageUrl ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                fontSize: '0.65rem',
                padding: 6,
                textAlign: 'center',
                color: '#ffd700',
              }}
            >
              {imageUrl.replace('uploaded://', '')}
            </div>
          ) : undefined
        }
      />
      <div style={{ marginTop: 16 }}>
        <CustomButton type="submit" text="Save product" action="save" />
      </div>
    </Form>
  )
}

export const FormBoundImage: Story = {
  render: () => <ImageUploadForm />,
}

export const DocumentVariant: Story = {
  render: () => {
    function DocDemo() {
      const [doc, setDoc] = useState('')
      return (
        <FileDropzone
          label="Attach contract"
          variant="document"
          accept=".pdf,.docx"
          value={doc}
          onFileSelect={file => setDoc(file.name)}
          onRemove={() => setDoc('')}
          preview={
            doc ? (
              <div style={{ fontSize: '0.6rem', padding: 4, color: '#ffd700' }}>
                {doc}
              </div>
            ) : undefined
          }
        />
      )
    }
    return <DocDemo />
  },
}

/**
 * Error + required state. The operable drop-target `<button>` (not the hidden
 * `display:none` file input) carries `aria-required`, `aria-invalid`, and an
 * `aria-describedby` linked to the FieldShell error region, so a screen reader
 * navigating to the control it actually operates hears "required, invalid" and
 * the failure text — the fix for the state ARIA previously landing only on the
 * out-of-tree input.
 */
export const WithError: Story = {
  render: () => (
    <FileDropzone
      label="Product Image"
      required
      variant="image"
      value=""
      error="Upload failed — file exceeds 5 MB"
      onFileSelect={() => {}}
    />
  ),
}

/**
 * Uploading state. The drop-target button is natively `disabled` and marked
 * `aria-busy`; the visually-hidden `role="status"` live region announces
 * "Uploading image…" (WCAG 4.1.3) so the transition reaches assistive tech even
 * though a disabled button's label change ("Upload image" → "Uploading…") and a
 * drag-drop pick (which never focuses the button) would otherwise be silent.
 */
export const Uploading: Story = {
  args: {
    label: 'Product Image',
    required: true,
    variant: 'image',
    value: 'uploaded://logo.png',
    uploading: true,
    onFileSelect: fn(),
    preview: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          fontSize: '0.65rem',
          color: '#ffd700',
        }}
      >
        logo.png
      </div>
    ),
  },
}

/**
 * A value is present and `onRemove` is wired, so the "Remove" control renders.
 * It carries `aria-label="Remove image"` (variant-aware; the visible "Remove"
 * text stays inside the name so WCAG 2.5.3 Label-in-Name holds) so the control
 * reads with its field context rather than a bare "Remove". The status region
 * reflects the selected state.
 *
 * The play function pins the focus-restoration fix (WCAG 2.4.3): activating
 * Remove clears the value host-side, which unmounts the focused Remove control
 * — focus must move to the (always-mounted) browse button rather than falling to
 * `<body>`.
 */
export const WithValueRemovable: Story = {
  render: () => {
    function RemovableDemo() {
      const [img, setImg] = useState('uploaded://banner.jpg')
      return (
        <FileDropzone
          label="Product Image"
          variant="image"
          value={img}
          onFileSelect={file => setImg(`uploaded://${file.name}`)}
          onRemove={() => setImg('')}
          preview={
            img ? (
              <div style={{ fontSize: '0.6rem', padding: 4, color: '#ffd700' }}>
                {img.replace('uploaded://', '')}
              </div>
            ) : undefined
          }
        />
      )
    }
    return <RemovableDemo />
  },
  play: async ({ canvasElement }) => {
    const removeButton = canvasElement.querySelector<HTMLButtonElement>(
      '[data-file-dropzone-remove="true"]'
    )
    await expect(removeButton).not.toBeNull()
    const browseButton = canvasElement.querySelector<HTMLButtonElement>(
      '[data-file-dropzone-browse="true"]'
    )
    await expect(browseButton).not.toBeNull()

    // Focus the Remove control the way a keyboard user would, then activate it.
    removeButton!.focus()
    await expect(removeButton).toHaveFocus()
    await userEvent.click(removeButton!)

    // The value cleared, the Remove control unmounted, and focus landed on the
    // browse button instead of dropping to <body>.
    await waitFor(() => expect(browseButton).toHaveFocus())
    await expect(
      canvasElement.querySelector('[data-file-dropzone-remove="true"]')
    ).toBeNull()
  },
}

/**
 * Pins the field-label association (a11y audit follow-up, WCAG 1.3.1 / 3.3.2).
 * The FieldShell `<label htmlFor>` targets the `display:none` file input (out of
 * the accessibility tree), so the operable browse `<button>` carries
 * `aria-labelledby` referencing a visually-hidden, `aria-hidden` mirror of the
 * field label PLUS its own visible action text. A screen reader on a form with
 * several upload fields therefore announces "Product Image Upload image" (field
 * + action) rather than a context-free "Upload image", and WCAG 2.5.3
 * Label-in-Name still holds because the visible action text stays in the name.
 */
export const AccessibleName: Story = {
  render: () => (
    <FileDropzone
      label="Product Image"
      variant="image"
      value=""
      onFileSelect={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const browseButton = canvasElement.querySelector<HTMLButtonElement>(
      '[data-file-dropzone-browse="true"]'
    )
    await expect(browseButton).not.toBeNull()

    // The field name rides the operable control via aria-labelledby — not the
    // hidden input the FieldShell label points at.
    const labelledBy = browseButton!.getAttribute('aria-labelledby')
    await expect(labelledBy).toBeTruthy()

    // Both reference targets resolve; useId() ids contain colons, so resolve
    // via getElementById rather than a CSS attribute selector.
    const ids = (labelledBy ?? '').split(' ')
    await expect(ids.length).toBe(2)
    const referencedName = ids
      .map(id => document.getElementById(id)?.textContent?.trim() ?? '')
      .join(' ')
    // Field label first, then the visible action text (Label-in-Name intact).
    await expect(referencedName).toBe('Product Image Upload image')
    await expect(referencedName).toContain('Upload image')
  },
}

/**
 * The dark theme (`styles.theme: 'dark'`) on the dark canvas: the preview
 * tile switches to the slate surface (#0f172a) with a #334155 border, the
 * drop-target label and hint render in the blue-accent dark palette
 * (#60a5fa / #93c5fd accents, #cbd5e1 text), and the typeface flips from
 * Cinzel to Inter — the `[data-theme='dark']` override block in
 * FileDropzone.module.css.
 */
export const DarkTheme: Story = {
  name: 'Theme/Dark',
  args: {
    label: 'Product Image',
    variant: 'image',
    value: '',
    onFileSelect: fn(),
    styles: { theme: 'dark' },
  },
  globals: { backgrounds: { value: 'dark' } },
}
