'use server'

import fs from 'fs/promises'
import path from 'path'
import { FormStoreProps, ReusableStore } from '../../../../types/formstore'
import {
  encryptValue,
  decryptValue,
} from '../../../../actions/server/form/store/crypt'

let instance: ReusableStore | null = null

const createReusableStore = async (): Promise<ReusableStore> => {
  if (!instance) {
    const storageDir = path.join(process.cwd(), 'storage')
    await fs.mkdir(storageDir, { recursive: true })
    instance = {
      storageDir,
      async get(
        storename: string,
        identifier: string
      ): Promise<FormStoreProps | undefined> {
        console.log(
          'Getting value for storename:',
          storename,
          'and identifier:',
          identifier
        )
        const filePath = path.join(
          this.storageDir,
          `${storename}_${identifier}.json`
        )
        console.log('File path:', filePath)
        try {
          const data = await fs.readFile(filePath, 'utf8')
          console.log('File data:', data)
          const parsedData: FormStoreProps = JSON.parse(data)
          console.log('Parsed data:', parsedData)
          try {
            const decryptedValue = decryptValue(
              parsedData.value,
              parsedData.encryptionKey,
              parsedData.encryptionIV
            )
            console.log(
              'Value retrieved with storename:',
              storename,
              'identifier:',
              identifier,
              'and decrypted value:',
              decryptedValue
            )
            return { ...parsedData, value: decryptedValue }
          } catch (error) {
            console.error('Error decrypting value:', error)
            return undefined
          }
        } catch (error) {
          console.log(
            'Store not found for storename:',
            storename,
            'and identifier:',
            identifier
          )
          console.error('Error getting value:', error)
          return undefined
        }
      },
      async set(props: FormStoreProps): Promise<void> {
        console.log('Setting value with props:', props)
        const {
          storename,
          identifier,
          value,
          expirationTime,
          encryptionKey,
          encryptionIV,
        } = props
        const filePath = path.join(
          this.storageDir,
          `${storename}_${identifier}.json`
        )
        console.log('File path:', filePath)
        try {
          const encryptedValue = encryptValue(
            value,
            encryptionKey,
            encryptionIV
          )
          console.log('Encrypted value:', encryptedValue)
          await fs.mkdir(this.storageDir, { recursive: true })
          await fs.writeFile(
            filePath,
            JSON.stringify({
              storename,
              identifier,
              value: encryptedValue,
              expirationTime,
              encryptionKey,
              encryptionIV,
            })
          )
          console.log(
            'Value set with storename:',
            storename,
            'identifier:',
            identifier,
            'encrypted value:',
            encryptedValue,
            'and expirationTime:',
            expirationTime
          )
          await this.cleanup()
        } catch (error) {
          console.error('Error setting value:', error)
          throw error
        }
      },
      async cleanup(): Promise<void> {
        console.log('Running cleanup')
        try {
          const files = await fs.readdir(this.storageDir)
          console.log('Files in storage directory:', files)
          for (const file of files) {
            const filePath = path.join(this.storageDir, file)
            console.log('Processing file:', filePath)
            const data = await fs.readFile(filePath, 'utf8')
            const parsedData: FormStoreProps = JSON.parse(data)
            if (Date.now() > parsedData.expirationTime) {
              await fs.unlink(filePath)
              console.log('Deleted expired file:', file)
            } else {
              console.log('File is still valid:', file)
            }
          }
          console.log('Cleanup completed')
        } catch (error) {
          console.error('Error during cleanup:', error)
        }
      },
    }
  }
  return instance
}

export const getReusableStore = async (
  storename: string,
  identifier: string
): Promise<FormStoreProps | undefined> => {
  console.log('Getting ReusableStore value')
  console.log('Storename:', storename)
  console.log('Identifier:', identifier)
  const reusableStore = await createReusableStore()
  console.log('ReusableStore instance retrieved')
  try {
    const storedValue = await reusableStore.get(storename, identifier)
    if (storedValue) {
      console.log('Stored value retrieved:', storedValue)
      return storedValue
    } else {
      console.log('Stored value not found')
      return undefined
    }
  } catch (error) {
    console.error('Error retrieving stored value:', error)
    return undefined
  }
}

export const setReusableStore = async (
  props: FormStoreProps
): Promise<void> => {
  console.log('Setting ReusableStore value')
  console.log('Props:', props)
  const reusableStore = await createReusableStore()
  console.log('ReusableStore instance retrieved')
  await reusableStore.set(props)
  console.log('ReusableStore value set successfully')
}
