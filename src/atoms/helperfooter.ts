import { atom } from 'jotai'

interface HelperFooterMessage {
  status?: 'error' | 'success'
  statusMessage?: string
  spreadMessage?: string
  spreadMessagePriority?: number
  formname?: string
}

export const helperFooterAtom = atom<Record<string, HelperFooterMessage>>({
  default: {
    status: 'success',
    statusMessage: '',
    spreadMessage: '',
    spreadMessagePriority: 0,
    formname: '',
  },
})
