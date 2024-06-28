export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '')

  // Ensure the number starts with +1
  let formattedNumber = '+1 '

  if (digits.length > 0) {
    // Add the area code
    formattedNumber += digits.slice(0, 3)

    if (digits.length > 3) {
      // Add first dash and next three digits
      formattedNumber += '-' + digits.slice(3, 6)

      if (digits.length > 6) {
        // Add second dash and last four digits
        formattedNumber += '-' + digits.slice(6, 10)
      }
    }
  }

  return formattedNumber
}
