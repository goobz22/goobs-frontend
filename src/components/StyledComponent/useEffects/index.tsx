import React, { useEffect } from 'react'

/**
 * Custom hook that tracks whether an input field has a value or a specific status.
 *
 * @param {string | undefined} value - The current value of the input field.
 * @param {boolean | undefined} valuestatus - A boolean status associated with the input field.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setHasInput - State setter function to update the hasInput state.
 *
 * @example
 * const [hasInput, setHasInput] = useState(false);
 * useHasInputEffect(inputValue, inputStatus, setHasInput);
 */
export const useHasInputEffect = (
  value: string | undefined,
  valuestatus: boolean | undefined,
  setHasInput: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    const hasInput = !!value || !!valuestatus
    setHasInput(hasInput)
  }, [value, valuestatus, setHasInput])
}

/**
 * Custom hook that prevents autocomplete, autocorrect, autocapitalize, and spellcheck on an input field.
 * This is particularly useful for password fields or other sensitive inputs.
 *
 * @param {React.RefObject<HTMLInputElement>} inputRefInternal - React ref object for the input element.
 *
 * @example
 * const inputRef = useRef<HTMLInputElement>(null);
 * usePreventAutocompleteEffect(inputRef);
 * // In your JSX:
 * <input ref={inputRef} ... />
 */
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
