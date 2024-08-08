import { useCallback, useMemo, MutableRefObject } from 'react'
import { session } from 'goobs-cache'
import { StyledComponentProps } from '../index'
import { HelperFooterMessage } from './useInputHelperFooter'

type HelperFooterState = Record<string, HelperFooterMessage>

export const useRequiredFieldsValidator = (
  formname: string,
  components: StyledComponentProps[],
  hasInputRef: MutableRefObject<boolean>
) => {
  console.log('useRequiredFieldsValidator called with:', {
    formname,
    components,
    hasInputRef,
  })

  const helperFootersAtom = session.atom<HelperFooterState>({})
  const [helperFooters, setHelperFooters] = session.useAtom(helperFootersAtom)

  const initializeComponentStatuses = useCallback(() => {
    console.log('initializeComponentStatuses called')

    const initialHelperFooters: HelperFooterState = { ...helperFooters }

    components.forEach(component => {
      if (
        component.name &&
        component.required &&
        component.label &&
        !initialHelperFooters[component.name]
      ) {
        initialHelperFooters[component.name] = {
          status: 'emptyAndRequired',
          statusMessage: `${component.label} is required.`,
          spreadMessage: `${component.label} is required.`,
          spreadMessagePriority: component.spreadMessagePriority || 1,
          required: true,
          hasInput: false,
        }
        console.log(
          `Created new helper footer for ${component.name}:`,
          initialHelperFooters[component.name]
        )
      }
    })

    console.log('Setting helper footers in session atom')
    setHelperFooters(initialHelperFooters)

    console.log(`Initialized helper footers:`, initialHelperFooters)
  }, [components, helperFooters, setHelperFooters])

  const checkFormStatus = useCallback(() => {
    console.log('checkFormStatus called')
    const requiredComponents = components.filter(
      component => component.required
    )
    console.log('Required components:', requiredComponents)

    const allRequiredHaveInput = requiredComponents.every(
      component =>
        helperFooters[component.name || '']?.hasInput || hasInputRef.current
    )
    console.log('All required fields have input:', allRequiredHaveInput)
    return allRequiredHaveInput
  }, [components, hasInputRef, helperFooters])

  const getEmptyRequiredFields = useCallback(() => {
    console.log('getEmptyRequiredFields called')

    const emptyFields = Object.entries(helperFooters)
      .filter(
        ([, value]) => value.required && !value.hasInput && !hasInputRef.current
      )
      .map(([key]) => key)
    console.log('Empty required fields:', emptyFields)
    return emptyFields
  }, [hasInputRef, helperFooters])

  const validateRequiredField = useCallback(
    (
      name: string,
      label: string,
      required: boolean,
      spreadMessagePriority: number
    ) => {
      console.log(`validateRequiredField called for ${name}`)

      if (required && !helperFooters[name]?.hasInput && !hasInputRef.current) {
        console.log(`${name} is required and empty, updating helper footer`)
        const newHelperFooter: HelperFooterMessage = {
          status: 'emptyAndRequired',
          statusMessage: `${label} is required.`,
          spreadMessage: `${label} is required.`,
          spreadMessagePriority,
          required: true,
          hasInput: false,
        }

        setHelperFooters(prev => ({
          ...prev,
          [name]: newHelperFooter,
        }))

        console.log('Updated helperFooters:', {
          ...helperFooters,
          [name]: newHelperFooter,
        })
      } else {
        console.log(`${name} validation not needed or already has input`)
      }
    },
    [hasInputRef, helperFooters, setHelperFooters]
  )

  const result = useMemo(
    () => ({
      checkFormStatus,
      getEmptyRequiredFields,
      validateRequiredField,
      initializeComponentStatuses,
    }),
    [
      checkFormStatus,
      getEmptyRequiredFields,
      validateRequiredField,
      initializeComponentStatuses,
    ]
  )

  console.log('useRequiredFieldsValidator returning:', result)
  return result
}

export default useRequiredFieldsValidator
