import { useState } from 'react'

export const usePassword = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  return {
    passwordVisible,
    togglePasswordVisibility,
  }
}
