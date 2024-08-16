import { useCallback } from 'react'

/**
 * Custom hook that tracks whether an input field has a value or a specific status.
 *
 * @param {string | undefined} value - The current value of the input field.
 * @param {boolean | undefined} valuestatus - A boolean status associated with the input field.
 *
 * @returns {boolean} - Whether the input field has a value or a specific status.
 *
 * @example
 * const hasInput = useHasInput(inputValue, inputStatus);
 */
export const useHasInput = (
  value: string | undefined,
  valuestatus: boolean | undefined
): boolean => {
  return !!value || !!valuestatus
}

/**
 * Custom hook that prevents autocomplete, autocorrect, autocapitalize, and spellcheck on an input field.
 * This is particularly useful for password fields or other sensitive inputs.
 *
 * @param {React.RefObject<HTMLInputElement>} inputRefInternal - React ref object for the input element.
 *
 * @returns {(input: HTMLInputElement | null) => void} - A callback function to set the attributes on the input element.
 *
 * @example
 * const inputRef = useRef<HTMLInputElement>(null);
 * const setInputAttributes = usePreventAutocomplete();
 * // In your JSX:
 * <input ref={el => { inputRef.current = el; setInputAttributes(el); }} ... />
 */
export const usePreventAutocomplete = (): ((
  input: HTMLInputElement | null
) => void) => {
  return useCallback((input: HTMLInputElement | null) => {
    if (input) {
      input.setAttribute('autocomplete', 'new-password')
      input.setAttribute('autocorrect', 'off')
      input.setAttribute('autocapitalize', 'none')
      input.setAttribute('spellcheck', 'false')
    }
  }, [])
}
