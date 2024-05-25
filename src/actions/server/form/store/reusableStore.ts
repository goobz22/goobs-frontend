'use server'

import fs from 'fs/promises'
import path from 'path'
import { FormStoreProps } from '../../../../types/formstore'
import {
  encryptValue,
  decryptValue,
} from '../../../../actions/server/form/store/crypt'

export async function reusableStore(
  operation: 'get' | 'set' | 'cleanup',
  props?: FormStoreProps
): Promise<FormStoreProps | undefined | void> {
  const storageDir = path.join(process.cwd(), 'storage')
  await fs.mkdir(storageDir, { recursive: true })

  if (operation === 'get' && props) {
    const { storename, identifier } = props
    console.log(
      'Getting value for storename:',
      storename,
      'and identifier:',
      identifier
    )
    const filePath = path.join(storageDir, `${storename}_${identifier}.json`)
    console.log('File path:', filePath)
    try {
      const data = await fs.readFile(filePath, 'utf8')
      console.log('File data:', data)
      const parsedData: FormStoreProps = JSON.parse(data)
      console.log('Parsed data:', parsedData)
      try {
        const decryptedValue = await decryptValue(
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
  } else if (operation === 'set' && props) {
    console.log('Setting value with props:', props)
    const {
      storename,
      identifier,
      value,
      expirationTime,
      encryptionKey,
      encryptionIV,
    } = props
    const filePath = path.join(storageDir, `${storename}_${identifier}.json`)
    console.log('File path:', filePath)
    try {
      const encryptedValue = await encryptValue(
        value,
        encryptionKey,
        encryptionIV
      )
      console.log('Encrypted value:', encryptedValue)
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
      await reusableStore('cleanup')
    } catch (error) {
      console.error('Error setting value:', error)
      throw error
    }
  } else if (operation === 'cleanup') {
    console.log('Running cleanup')
    try {
      const files = await fs.readdir(storageDir)
      console.log('Files in storage directory:', files)
      for (const file of files) {
        const filePath = path.join(storageDir, file)
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
  }
}
