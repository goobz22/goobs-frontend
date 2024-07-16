import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { get } from 'goobs-cache'

/**
 * Represents the structure of a helper footer message.
 * @interface HelperFooterMessage
 */
export interface HelperFooterMessage {
  /** The status of the message, either 'error' or 'success'. */
  status: 'error' | 'success'
  /** A message describing the status. */
  statusMessage: string
  /** A message to be displayed to the user. */
  spreadMessage: string
  /** A number indicating the priority of the message. Lower numbers indicate higher priority. */
  spreadMessagePriority: number
  /** The name of the form associated with this message. */
  formname: string
  /** Indicates whether this message is required to be addressed. */
  required: boolean
}

/**
 * A type definition for the interval ID returned by setInterval.
 */
type IntervalID = ReturnType<typeof setInterval>

/**
 * A custom hook for managing helper footer messages and form validation.
 *
 * @param {string} [initialFormname] - The initial name of the form to fetch helper footers for.
 * @returns {Object} An object containing the current error message, form validity state, and functions to update and fetch form validation.
 */
const useHelperFooter = (initialFormname?: string) => {
  /**
   * State for storing the current error message.
   */
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )

  /**
   * State for storing the current form validity.
   */
  const [isFormValid, setIsFormValid] = useState<boolean>(true)

  /**
   * State for storing the current helper footers.
   */
  const [helperFooters, setHelperFooters] = useState<HelperFooterMessage[]>([])

  /**
   * Ref for storing the previous helper footers to compare against.
   */
  const prevHelperFooters = useRef<HelperFooterMessage[]>([])

  /**
   * Ref for storing the previous error message to compare against.
   */
  const prevErrorMessage = useRef<string | undefined>(undefined)

  /**
   * Ref for storing the previous form validity to compare against.
   */
  const prevIsFormValid = useRef<boolean>(true)

  /**
   * Ref for storing the interval ID for periodic helper footer fetching.
   */
  const intervalIdRef = useRef<IntervalID | null>(null)

  /**
   * Fetches helper footer messages from the cache.
   *
   * @param {string} [formname] - The name of the form to fetch helper footers for.
   * @returns {Promise<HelperFooterMessage[]>} A promise that resolves to an array of HelperFooterMessage objects.
   */
  const fetchHelperFooters = useCallback(
    async (formname?: string): Promise<HelperFooterMessage[]> => {
      const currentFormname = formname || initialFormname
      if (!currentFormname) {
        return []
      }

      const helperFooterResult = await get(
        'helperfooter',
        currentFormname,
        'client'
      )

      if (
        helperFooterResult &&
        typeof helperFooterResult === 'object' &&
        'type' in helperFooterResult &&
        helperFooterResult.type === 'json' &&
        'value' in helperFooterResult &&
        typeof helperFooterResult.value === 'object' &&
        helperFooterResult.value !== null
      ) {
        const fetchedHelperFooters = Object.entries(
          helperFooterResult.value as Record<string, unknown>
        )
          .map(([key, value]): HelperFooterMessage | null => {
            if (
              typeof value === 'object' &&
              value !== null &&
              'status' in value &&
              'statusMessage' in value &&
              'spreadMessage' in value &&
              'spreadMessagePriority' in value &&
              'required' in value
            ) {
              return {
                status: value.status as 'error' | 'success',
                statusMessage: String(value.statusMessage),
                spreadMessage: String(value.spreadMessage),
                spreadMessagePriority: Number(value.spreadMessagePriority),
                required: Boolean(value.required),
                formname: key,
              }
            }
            return null
          })
          .filter((value): value is HelperFooterMessage => value !== null)

        if (
          JSON.stringify(fetchedHelperFooters) !==
          JSON.stringify(prevHelperFooters.current)
        ) {
          setHelperFooters(fetchedHelperFooters)
          prevHelperFooters.current = fetchedHelperFooters
        }
        return fetchedHelperFooters
      }

      if (helperFooters.length > 0) {
        setHelperFooters([])
        prevHelperFooters.current = []
      }
      return []
    },
    [initialFormname, helperFooters]
  )

  /**
   * Updates the form validation state based on the fetched helper footers.
   *
   * @param {string} [formname] - The name of the form to update validation for.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the form is valid.
   */
  const updateFormValidation = useCallback(
    async (formname?: string): Promise<boolean> => {
      const fetchedHelperFooters = await fetchHelperFooters(formname)

      if (fetchedHelperFooters.length === 0) {
        setErrorMessage(undefined)
        setIsFormValid(true)
        return true
      }

      const errorFooters = fetchedHelperFooters.filter(
        footer => footer.status === 'error' && footer.required
      )

      if (errorFooters.length > 0) {
        const highestPriorityError = errorFooters.reduce((prev, current) =>
          prev.spreadMessagePriority < current.spreadMessagePriority
            ? prev
            : current
        )
        setErrorMessage(highestPriorityError.spreadMessage)
        setIsFormValid(false)
        return false
      }

      setErrorMessage(undefined)
      setIsFormValid(true)
      return true
    },
    [fetchHelperFooters]
  )

  /**
   * Effect to run form validation when the initial form name changes.
   */
  useEffect(() => {
    void updateFormValidation()
  }, [initialFormname, updateFormValidation])

  /**
   * Effect to set up periodic helper footer fetching.
   */
  useEffect(() => {
    if (initialFormname) {
      const fetchAndUpdateHelperFooters = async () => {
        await updateFormValidation(initialFormname)
      }

      void fetchAndUpdateHelperFooters()
      intervalIdRef.current = setInterval(fetchAndUpdateHelperFooters, 1000)

      return () => {
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current)
        }
      }
    }
  }, [initialFormname, updateFormValidation])

  /**
   * Effect to update refs when error message or form validity changes.
   */
  useEffect(() => {
    if (
      errorMessage !== prevErrorMessage.current ||
      isFormValid !== prevIsFormValid.current
    ) {
      prevErrorMessage.current = errorMessage
      prevIsFormValid.current = isFormValid
    }
  }, [errorMessage, isFormValid])

  /**
   * Memoized helper footers to prevent unnecessary re-renders.
   */
  const memoizedHelperFooters = useMemo(() => helperFooters, [helperFooters])

  /**
   * Memoized return value of the hook to prevent unnecessary re-renders.
   */
  const returnValue = useMemo(
    () => ({
      errorMessage,
      isFormValid,
      updateFormValidation,
      fetchHelperFooters,
      helperFooters: memoizedHelperFooters,
    }),
    [
      errorMessage,
      isFormValid,
      updateFormValidation,
      fetchHelperFooters,
      memoizedHelperFooters,
    ]
  )

  return returnValue
}

export default useHelperFooter
