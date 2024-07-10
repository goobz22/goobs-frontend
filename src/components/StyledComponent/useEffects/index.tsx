import React, { useEffect } from 'react'
import { get, JSONValue } from 'goobs-cache'
import {
  HelperFooterMessage,
  useHelperFooter,
} from '../helperfooter/useHelperFooter'

export const useHelperFooterEffect = (
  setHelperFooterValue: React.Dispatch<
    React.SetStateAction<Record<string, HelperFooterMessage>>
  >
) => {
  useEffect(() => {
    const fetchHelperFooter = async () => {
      const result = await get('helperFooter', 'client')
      if (result && typeof result === 'object' && 'value' in result) {
        setHelperFooterValue(
          (result as JSONValue).value as Record<string, HelperFooterMessage>
        )
      }
    }
    fetchHelperFooter()
  }, [setHelperFooterValue])
}

export const useHasInputEffect = (
  value: string | undefined,
  valuestatus: boolean | undefined,
  setHasInput: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    setHasInput(!!value || !!valuestatus)
  }, [value, valuestatus, setHasInput])
}

export const usePreventAutocompleteEffect = (
  inputRefInternal: React.RefObject<HTMLInputElement>
) => {
  useEffect(() => {
    const input = inputRefInternal.current
    if (input) {
      input.setAttribute('autocomplete', 'new-password')
      input.setAttribute('autocorrect', 'off')
      input.setAttribute('autocapitalize', 'none')
      input.setAttribute('spellcheck', 'false')
    }
  }, [inputRefInternal])
}

export const useValidateRequiredEffect = (
  required: boolean | undefined,
  formname: string | undefined,
  name: string | undefined,
  label: string | undefined
) => {
  const { validateField } = useHelperFooter()

  useEffect(() => {
    if (required && formname && name && label) {
      const emptyFormData = new FormData()
      emptyFormData.append(name, '')
      validateField(name, emptyFormData, label, required, formname)
    }
  }, [required, formname, name, label, validateField])
}

export const useShowErrorEffect = (
  formSubmitted: boolean,
  hasInput: boolean,
  isFocused: boolean,
  setShowError: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    setShowError(formSubmitted || (hasInput && !isFocused))
  }, [formSubmitted, hasInput, isFocused, setShowError])
}
