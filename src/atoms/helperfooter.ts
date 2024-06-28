import { atom } from 'jotai'

export interface HelperFooterMessage {
  status?: 'error' | 'success'
  statusMessage?: string
  spreadMessage?: string
  spreadMessagePriority?: number
  formname?: string
  required?: boolean
}

export const helperFooterAtom = atom<Record<string, HelperFooterMessage>>({
  default: {
    status: 'success',
    statusMessage: '',
    spreadMessage: '',
    spreadMessagePriority: 0,
    formname: '',
    required: false,
  },
})
