'use server'

export default async function getFormData(
  formData: FormData
): Promise<Record<string, unknown>> {
  const data: Record<string, unknown> = {}

  for (const [key, value] of Array.from(formData.entries())) {
    if (value !== null && value !== undefined) {
      data[key] = value
    }
  }

  return data
}
