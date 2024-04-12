'use server'
import { ValidationProps, SpreadErrorMessage } from '@/types/validation'
import { createDataField } from '../dataField'

class RegistrationStore {
  private static instance: RegistrationStore | null = null
  private store: Record<string, Record<string, any>> = {}

  private constructor() {
    console.log('RegistrationStore constructor called')
  }

  public static async getInstance(): Promise<RegistrationStore> {
    console.log('Getting RegistrationStore instance')
    if (!RegistrationStore.instance) {
      RegistrationStore.instance = new RegistrationStore()
    }
    console.log('RegistrationStore instance retrieved')
    return RegistrationStore.instance
  }

  public async setRegistrationToken(registrationToken: string): Promise<void> {
    console.log('Setting registration token:', registrationToken)
    this.store[registrationToken] = {}
    console.log('Registration token set')
  }

  public async getRegistrationToken(
    registrationToken: string
  ): Promise<SpreadErrorMessage | undefined> {
    console.log(
      'Getting registration token for registration token:',
      registrationToken
    )
    const result = this.store[registrationToken]?.['registrationToken']
    console.log(
      'RegistrationToken retrieved with identifier:',
      registrationToken,
      'and value:',
      result
    )
    if (result && result.identifier === registrationToken) {
      return result
    }
    return undefined
  }

  public async get(
    registrationToken: string,
    identifier: string
  ): Promise<SpreadErrorMessage | undefined> {
    console.log(
      'Getting value for registration token:',
      registrationToken,
      'and identifier:',
      identifier
    )
    const result = this.store[registrationToken]?.[identifier]
    console.log(
      'Value retrieved with identifier:',
      identifier,
      'and value:',
      result
    )
    if (result && result.identifier === identifier) {
      return result
    }
    return undefined
  }

  public async set(
    registrationToken: string,
    value: string,
    identifier: string
  ): Promise<void> {
    console.log(
      'Setting value for registration token:',
      registrationToken,
      'and identifier:',
      identifier
    )
    if (!this.store[registrationToken]) {
      this.store[registrationToken] = {}
    }
    const existingValue = this.store[registrationToken][identifier]
    if (existingValue && existingValue.identifier !== identifier) {
      console.log('Identifier does not match, not updating the value')
      return
    }
    this.store[registrationToken][identifier] = { identifier, value }
    console.log('Value set with identifier:', identifier, 'and value:', value)
  }
}

export async function getRegistrationStore(): Promise<RegistrationStore> {
  console.log('Exporting RegistrationStore instance')
  return RegistrationStore.getInstance()
}
