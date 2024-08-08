import { useCallback, useMemo } from 'react'
import { session } from 'goobs-cache'

export interface HelperFooterMessage {
  status: 'error' | 'success' | 'emptyAndRequired'
  statusMessage: string
  spreadMessage: string
  spreadMessagePriority: number
  required: boolean
  hasInput?: boolean
}

const useHelperFooter = (initialFormname?: string) => {
  console.log(
    'useHelperFooter: Hook called with initialFormname:',
    initialFormname
  )

  const helperFooterAtom = session.atom<Record<
    string,
    HelperFooterMessage
  > | null>(null)
  const currentErrorIndexAtom = session.atom<number>(0)

  const fetchHelperFooters = useCallback(async (): Promise<Record<
    string,
    HelperFooterMessage
  > | null> => {
    console.log('useHelperFooter: fetchHelperFooters called')
    if (!initialFormname) {
      console.log('useHelperFooter: No formname provided, returning null')
      return null
    }

    const [helperFooters, setHelperFooters] = session.useAtom(helperFooterAtom)

    if (helperFooters === null) {
      const [helperFooterResult] = session.useAtom(
        session.atom(`helperfooter:${initialFormname}`)
      )
      console.log('useHelperFooter: helperFooterResult:', helperFooterResult)

      if (
        helperFooterResult &&
        typeof helperFooterResult === 'object' &&
        helperFooterResult !== null
      ) {
        const fetchedHelperFooters: Record<string, HelperFooterMessage> = {}

        for (const [key, value] of Object.entries(helperFooterResult)) {
          if (
            typeof value === 'object' &&
            value !== null &&
            'status' in value &&
            'statusMessage' in value &&
            'spreadMessage' in value &&
            'spreadMessagePriority' in value &&
            'required' in value &&
            'hasInput' in value
          ) {
            fetchedHelperFooters[key] = {
              status: value.status as 'error' | 'success' | 'emptyAndRequired',
              statusMessage: String(value.statusMessage),
              spreadMessage: String(value.spreadMessage),
              spreadMessagePriority: Number(value.spreadMessagePriority),
              required: Boolean(value.required),
              hasInput: Boolean(value.hasInput),
            }
          }
        }

        console.log(
          'useHelperFooter: Fetched helper footers:',
          fetchedHelperFooters
        )
        setHelperFooters(fetchedHelperFooters)
        return fetchedHelperFooters
      }

      console.log(
        'useHelperFooter: Invalid helper footer result, returning null'
      )
      return null
    }

    return helperFooters
  }, [initialFormname, helperFooterAtom])

  const updateFormValidation = useCallback(async (): Promise<boolean> => {
    console.log('useHelperFooter: updateFormValidation called')
    const fetchedHelperFooters = await fetchHelperFooters()

    if (fetchedHelperFooters) {
      const errorFooters = Object.values(fetchedHelperFooters).filter(
        footer =>
          (footer.status === 'error' || footer.status === 'emptyAndRequired') &&
          footer.required
      )

      console.log('useHelperFooter: Error footers:', errorFooters)

      if (errorFooters.length === 0) {
        const [, setCurrentErrorIndex] = session.useAtom(currentErrorIndexAtom)
        setCurrentErrorIndex(0)
        console.log('useHelperFooter: No errors found, returning true')
        return true
      }

      errorFooters.sort(
        (a, b) => a.spreadMessagePriority - b.spreadMessagePriority
      )

      const [currentErrorIndex, setCurrentErrorIndex] = session.useAtom(
        currentErrorIndexAtom
      )
      if (currentErrorIndex >= errorFooters.length) {
        setCurrentErrorIndex(0)
      }

      console.log('useHelperFooter: Errors found, returning false')
      return false
    }

    console.log('useHelperFooter: No helper footers, returning true')
    return true
  }, [fetchHelperFooters, currentErrorIndexAtom])

  const checkFormStatus = useCallback(async () => {
    console.log('useHelperFooter: checkFormStatus called')
    const fetchedHelperFooters = await fetchHelperFooters()
    const status = fetchedHelperFooters
      ? Object.values(fetchedHelperFooters).every(
          value => !value.required || (value.required && value.hasInput)
        )
      : true
    console.log('useHelperFooter: Form status:', status)
    return status
  }, [fetchHelperFooters])

  const getEmptyRequiredFields = useCallback(async () => {
    console.log('useHelperFooter: getEmptyRequiredFields called')
    const fetchedHelperFooters = await fetchHelperFooters()
    if (!fetchedHelperFooters) return []
    const emptyFields = Object.entries(fetchedHelperFooters)
      .filter(([, value]) => value.required && !value.hasInput)
      .map(([key]) => key)
    console.log('useHelperFooter: Empty required fields:', emptyFields)
    return emptyFields
  }, [fetchHelperFooters])

  const getCurrentErrorMessage = useCallback(async () => {
    console.log('useHelperFooter: getCurrentErrorMessage called')
    const fetchedHelperFooters = await fetchHelperFooters()
    if (!fetchedHelperFooters) return undefined
    const errorFooters = Object.values(fetchedHelperFooters).filter(
      footer =>
        (footer.status === 'error' || footer.status === 'emptyAndRequired') &&
        footer.required
    )
    if (errorFooters.length === 0) return undefined
    const [currentErrorIndex] = session.useAtom(currentErrorIndexAtom)
    const message = errorFooters[currentErrorIndex]?.spreadMessage
    console.log('useHelperFooter: Current error message:', message)
    return message
  }, [fetchHelperFooters, currentErrorIndexAtom])

  const isFormValid = useCallback(async () => {
    const fetchedHelperFooters = await fetchHelperFooters()
    if (!fetchedHelperFooters) return true
    const valid = Object.values(fetchedHelperFooters).every(
      footer =>
        footer.status !== 'error' && footer.status !== 'emptyAndRequired'
    )
    console.log('useHelperFooter: isFormValid:', valid)
    return valid
  }, [fetchHelperFooters])

  const nextError = useCallback(async () => {
    console.log('useHelperFooter: nextError called')
    const fetchedHelperFooters = await fetchHelperFooters()
    if (!fetchedHelperFooters) return
    const errorFooters = Object.values(fetchedHelperFooters).filter(
      footer =>
        (footer.status === 'error' || footer.status === 'emptyAndRequired') &&
        footer.required
    )
    if (errorFooters.length > 0) {
      const [currentErrorIndex, setCurrentErrorIndex] = session.useAtom(
        currentErrorIndexAtom
      )
      setCurrentErrorIndex((currentErrorIndex + 1) % errorFooters.length)
      console.log(
        'useHelperFooter: New error index:',
        (currentErrorIndex + 1) % errorFooters.length
      )
    }
  }, [fetchHelperFooters, currentErrorIndexAtom])

  const result = useMemo(
    () => ({
      errorMessage: getCurrentErrorMessage,
      isFormValid,
      updateFormValidation,
      fetchHelperFooters,
      nextError,
      checkFormStatus,
      getEmptyRequiredFields,
    }),
    [
      getCurrentErrorMessage,
      isFormValid,
      updateFormValidation,
      fetchHelperFooters,
      nextError,
      checkFormStatus,
      getEmptyRequiredFields,
    ]
  )

  console.log('useHelperFooter: Returning result:', result)
  return result
}

export default useHelperFooter
