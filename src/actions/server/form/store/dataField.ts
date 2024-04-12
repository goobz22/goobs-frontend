'use server';
import { HelperFooterMessage, ValidationProps, SpreadErrorMessage } from '@/types/validation';
import { createEncryptionUtility, decryptValue } from './crypt';

class DataField<T extends HelperFooterMessage & SpreadErrorMessage> {
  private store: Record<string, T>;
  private identifier: string | null;

  constructor(store: Record<string, T>) {
    console.log('DataField constructor called');
    this.store = store;
    this.identifier = null;
  }

  async get(props: HelperFooterMessage): Promise<T | undefined> {
    console.log('DataField get called with props:', props);
    if (!this.identifier) {
      console.error('Identifier not set');
      throw new Error('Identifier not set. Call setIdentifier() before using get().');
    }
    console.log('Getting data with identifier:', this.identifier);
    if (this.identifier && this.store[this.identifier]) {
      const storedData = this.store[this.identifier];
      console.log('Stored data retrieved:', storedData);
      if (storedData.value && typeof storedData.value === 'string') {
        const decryptedValue = await decryptValue(storedData.value);
        console.log('Decrypted value:', decryptedValue);
        return { ...storedData, value: decryptedValue };
      }
      return storedData;
    }
    console.log('Data not found for identifier:', this.identifier);
    return undefined;
  }

  async set(props: ValidationProps & T): Promise<void> {
    console.log('DataField set called with props:', props);
    if (!this.identifier) {
      console.error('Identifier not set');
      throw new Error('Identifier not set. Call setIdentifier() before using set().');
    }

    const value = props.value;
    if (value === undefined || typeof value !== 'string') {
      console.error('Invalid value. Expected a string.');
      throw new Error('Invalid value. Expected a string.');
    }

    const encryptionUtility = await createEncryptionUtility();
    console.log('Original value before encryption:', value);
    const encryptedValue = encryptionUtility.encrypt(value);
    console.log('Encrypted value:', encryptedValue);

    let data: Record<string, any> = {
      'identifier': this.identifier,
      'value': encryptedValue,
    };

    console.log('Storing data with identifier:', this.identifier);
    this.store[this.identifier] = data as T;
    console.log('Stored data:', this.store[this.identifier]);
  }

  async delete(): Promise<void> {
    console.log('DataField delete called');
    if (!this.identifier) {
      console.error('Identifier not set');
      throw new Error('Identifier not set. Call setIdentifier() before using delete().');
    }

    console.log('Deleting data with identifier:', this.identifier);
    delete this.store[this.identifier];
    console.log('Deleted data with identifier:', this.identifier);
  }

  async setIdentifier(identifier: string): Promise<void> {
    console.log('Setting identifier:', identifier);
    this.identifier = identifier;
  }

  getIdentifier(): string | null {
    console.log('Getting identifier:', this.identifier);
    return this.identifier;
  }
}

// Exporting a function to create instances of DataField
export async function createDataField<T extends HelperFooterMessage & SpreadErrorMessage>(
  store: Record<string, T>,
  identifier: string
): Promise<DataField<T>> {
  console.log('Creating DataField instance with identifier:', identifier);
  const dataField = new DataField<T>(store);
  await dataField.setIdentifier(identifier);
  console.log('DataField instance created');
  return dataField;
}