'use client'

import { useCallback, useMemo, MutableRefObject, useRef } from 'react'
import { session } from 'goobs-cache'
import { StyledComponentProps } from '../index'
import { HelperFooterMessage } from './useInputHelperFooter'
import { ClientLogger } from 'goobs-testing'

type HelperFooterState = Record<string, HelperFooterMessage>

export const useRequiredFieldsValidator = (
  formname: string,
  components: StyledComponentProps[],
  hasInputRef: MutableRefObject<boolean>,
  helperFooterAtom: ReturnType<typeof session.atom<HelperFooterState>>
) => {
  ClientLogger.debug('useRequiredFieldsValidator called', {
    formname,
    componentsCount: components.length,
    hasInputRefCurrent: hasInputRef.current,
  })

  const [helperFooters, setHelperFooters] = session.useAtom(helperFooterAtom)
  const failedAttempts = useRef<Record<string, number>>({})

  const initializeComponentStatuses = useCallback(() => {
    ClientLogger.debug('initializeComponentStatuses called')

    try {
      const initialHelperFooters: HelperFooterState = {
        ...(helperFooters || {}),
      }

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
          ClientLogger.debug(`Created new helper footer`, {
            componentName: component.name,
            helperFooter: initialHelperFooters[component.name],
          })
        }
      })

      ClientLogger.debug('Setting helper footers in session atom')
      setHelperFooters(initialHelperFooters)

      ClientLogger.debug(`Initialized helper footers`, { initialHelperFooters })
    } catch (error) {
      ClientLogger.error('Error in initializeComponentStatuses', { error })
    }
  }, [components, helperFooters, setHelperFooters])

  const checkFormStatus = useCallback(() => {
    ClientLogger.debug('checkFormStatus called')
    try {
      const requiredComponents = components.filter(
        component => component.required
      )
      ClientLogger.debug('Required components', {
        count: requiredComponents.length,
      })

      const allRequiredHaveInput = requiredComponents.every(
        component =>
          helperFooters[component.name || '']?.hasInput || hasInputRef.current
      )
      ClientLogger.debug('All required fields have input', {
        allRequiredHaveInput,
      })
      return allRequiredHaveInput
    } catch (error) {
      ClientLogger.error('Error in checkFormStatus', { error })
      return false
    }
  }, [components, hasInputRef, helperFooters])

  const getEmptyRequiredFields = useCallback(() => {
    ClientLogger.debug('getEmptyRequiredFields called')

    try {
      const emptyFields = Object.entries(helperFooters)
        .filter(
          ([, value]) =>
            value.required && !value.hasInput && !hasInputRef.current
        )
        .map(([key]) => key)
      ClientLogger.debug('Empty required fields', { emptyFields })
      return emptyFields
    } catch (error) {
      ClientLogger.error('Error in getEmptyRequiredFields', { error })
      return []
    }
  }, [hasInputRef, helperFooters])

  const validateRequiredField = useCallback(
    (
      name: string,
      label: string,
      required: boolean,
      spreadMessagePriority: number
    ) => {
      ClientLogger.debug('validateRequiredField called', {
        name,
        label,
        required,
        spreadMessagePriority,
      })

      try {
        if (failedAttempts.current[name] && failedAttempts.current[name] >= 3) {
          ClientLogger.warn('Validation attempts exceeded for field', {
            name,
            attempts: failedAttempts.current[name],
          })
          return
        }

        if (
          required &&
          !helperFooters[name]?.hasInput &&
          !hasInputRef.current
        ) {
          ClientLogger.debug(
            `${name} is required and empty, updating helper footer`
          )
          const newHelperFooter: HelperFooterMessage = {
            status: 'emptyAndRequired',
            statusMessage: `${label} is required.`,
            spreadMessage: `${label} is required.`,
            spreadMessagePriority,
            required: true,
            hasInput: false,
          }

          setHelperFooters((prev: HelperFooterState) => ({
            ...prev,
            [name]: newHelperFooter,
          }))

          ClientLogger.debug('Updated helperFooters', {
            name,
            newHelperFooter,
          })

          failedAttempts.current[name] = (failedAttempts.current[name] || 0) + 1
        } else {
          ClientLogger.debug(
            `${name} validation not needed or already has input`
          )
        }
      } catch (error) {
        ClientLogger.error('Error in validateRequiredField', { error, name })
        failedAttempts.current[name] = (failedAttempts.current[name] || 0) + 1
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

  ClientLogger.debug('useRequiredFieldsValidator returning', { result })
  return result
}

export default useRequiredFieldsValidator
