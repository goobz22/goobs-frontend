// src/utils/phone/format.ts

export const formatPhoneNumber = (phoneNumber: string): string => {
  const prefix = '+1 '
  // Remove any non-digit characters and the "+1 " prefix to get the raw digits
  let cleaned = phoneNumber.replace(/\D/g, '')

  // If the user hasn't typed anything beyond "+1 ", return just the prefix
  if (cleaned.startsWith('1')) {
    cleaned = cleaned.substring(1) // Remove leading "1" if it's part of the input
  }

  if (cleaned.length === 0) {
    return prefix // Only show the prefix if no digits have been entered
  }

  // Apply formatting only when the user starts typing digits
  if (cleaned.length <= 3) {
    return `${prefix}${cleaned}`
  } else if (cleaned.length <= 6) {
    return `${prefix}${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
  } else {
    return `${prefix}${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
}

export const unformatPhoneNumber = (phoneNumber: string): string => {
  // Remove any formatting to get the raw digits
  return phoneNumber.replace(/\D/g, '')
}
