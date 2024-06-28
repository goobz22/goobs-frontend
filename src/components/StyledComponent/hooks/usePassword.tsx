import { useState } from 'react'

/**
 * usePassword hook provides functionality for managing password visibility state.
 * It allows toggling the visibility of the password field between masked and unmasked states.
 * @returns An object containing the passwordVisible state and the togglePasswordVisibility function.
 */
export const usePassword = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)

  /**
   * togglePasswordVisibility function toggles the visibility state of the password field.
   * It switches between the masked and unmasked states.
   */
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  return {
    passwordVisible,
    togglePasswordVisibility,
  }
}
