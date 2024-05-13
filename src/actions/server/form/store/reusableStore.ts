import fs from 'fs/promises'
import path from 'path'
import { FormStoreProps } from '@/types/formstore'
import { encryptValue, decryptValue } from '@/actions/server/form/store/crypt'

class ReusableStore {
  private static instance: ReusableStore | null = null
  private storageDir: string

  private constructor() {
    console.log('ReusableStore constructor called')
    this.storageDir = path.join(process.cwd(), 'storage')
    console.log('Storage directory:', this.storageDir)
    fs.mkdir(this.storageDir, { recursive: true })
      .then(() => {
        console.log('Storage directory created successfully')
      })
      .catch(error => {
        console.error('Error creating storage directory:', error)
      })
  }

  public static async getInstance(): Promise<ReusableStore> {
    console.log('Getting ReusableStore instance')
    if (!ReusableStore.instance) {
      console.log('Creating new ReusableStore instance')
      ReusableStore.instance = new ReusableStore()
    } else {
      console.log('Using existing ReusableStore instance')
    }
    console.log('ReusableStore instance retrieved')
    return ReusableStore.instance
  }

  private async cleanup(): Promise<void> {
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
  }

  public async get(
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
        const decryptedValue = await decryptValue(parsedData.value)
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
  }

  public async set(props: FormStoreProps): Promise<void> {
    console.log('Setting value with props:', props)
    const { storename, identifier, value, expirationTime } = props
    const filePath = path.join(
      this.storageDir,
      `${storename}_${identifier}.json`
    )
    console.log('File path:', filePath)
    try {
      const encryptedValue = await encryptValue(value)
      console.log('Encrypted value:', encryptedValue)

      // Create the storage directory if it doesn't exist
      await fs.mkdir(this.storageDir, { recursive: true })

      // Write the file with the encrypted value
      await fs.writeFile(
        filePath,
        JSON.stringify({
          storename,
          identifier,
          value: encryptedValue,
          expirationTime,
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
      // Run cleanup after setting a new value
      await this.cleanup()
    } catch (error) {
      console.error('Error setting value:', error)
      throw error // Rethrow the error to handle it at the calling site
    }
  }
}

export async function getReusableStore(
  storename: string,
  identifier: string
): Promise<FormStoreProps | undefined> {
  console.log('Getting ReusableStore value')
  console.log('Storename:', storename)
  console.log('Identifier:', identifier)
  const reusableStore = await ReusableStore.getInstance()
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

export async function setReusableStore(props: FormStoreProps): Promise<void> {
  console.log('Setting ReusableStore value')
  console.log('Props:', props)
  const reusableStore = await ReusableStore.getInstance()
  console.log('ReusableStore instance retrieved')
  await reusableStore.set(props)
  console.log('ReusableStore value set successfully')
}
