import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { z } from 'zod'
import FileDropzone from './index'
import Form from '../Form'
import CustomButton from '../Button'

const meta: Meta<typeof FileDropzone> = {
  title: 'Primitives/FileDropzone',
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
      onSubmit={values => alert(`submit: ${values.imageUrl}`)}
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
