'use server'

import { SpreadErrorMessage } from '@/types/validation'
import { createDataField } from './dataField'

class ReusableStore {
  private static instance: ReusableStore | null = null
  private store: Record<string, Record<string, SpreadErrorMessage>> = {}

  private constructor() {
    console.log('ReusableStore constructor called')
  }

  public static async getInstance(): Promise<ReusableStore> {
    console.log('Getting ReusableStore instance')
    if (!ReusableStore.instance) {
      ReusableStore.instance = new ReusableStore()
    }
    console.log('ReusableStore instance retrieved')
    return ReusableStore.instance
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
    const dataField = await createDataField<SpreadErrorMessage>(
      this.store[registrationToken],
      'registrationToken'
    )
    const result = await dataField.get({ identifier: 'registrationToken' })
    console.log(
      'RegistrationToken retrieved with identifier:',
      registrationToken,
      'and value:',
      result
    )
    return result
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
    const dataField = await createDataField<SpreadErrorMessage>(
      this.store[registrationToken],
      identifier
    )
    const result = await dataField.get({ identifier })
    console.log(
      'Value retrieved with identifier:',
      identifier,
      'and value:',
      result
    )
    return result
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
    const dataField = await createDataField<SpreadErrorMessage>(
      this.store[registrationToken],
      identifier
    )
    await dataField.set({ identifier, value })
    console.log('Value set with identifier:', identifier, 'and value:', value)
  }
}

export async function getReusableStore(): Promise<ReusableStore> {
  console.log('Exporting ReusableStore instance')
  return ReusableStore.getInstance()
}
