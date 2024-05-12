import { atom } from 'jotai'
import { HelperFooterMessage } from '@/types/validation'

export const helperFooterAtom = atom<Record<string, HelperFooterMessage>>({
  default: {
    status: 'success',
    statusMessage: '',
    spreadMessage: '',
    spreadMessagePriority: 0,
    formname: '',
  },
})
