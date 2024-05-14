export interface FormStoreProps {
  identifier: string
  storename: string
  value: string
  expirationTime: number
  encryptionKey: string
  encryptionIV: string
}

export type ReusableStore = {
  storageDir: string
  get: (
    storename: string,
    identifier: string
  ) => Promise<FormStoreProps | undefined>
  set: (props: FormStoreProps) => Promise<void>
  cleanup: () => Promise<void>
}
