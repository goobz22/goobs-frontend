import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

interface ColumnVisibility {
  [key: string]: boolean
}

// Create a persistent atom that saves to localStorage
export const columnVisibilityAtom = atomWithStorage<ColumnVisibility>(
  'columnVisibility',
  {}
)

// Atom for managing initial column setup
export const columnsAtom = atom<string[]>([])

// Actions atom for updating visibility
export const columnVisibilityActions = atom(
  null,
  (
    get,
    set,
    update: {
      type: 'toggle' | 'setAll' | 'reset' | 'save'
      field?: string
      value?: boolean
      newState?: ColumnVisibility
    }
  ) => {
    const currentVisibility = get(columnVisibilityAtom)
    const columns = get(columnsAtom)
    let newVisibility: ColumnVisibility = {}

    switch (update.type) {
      case 'toggle': {
        if (update.field) {
          newVisibility = {
            ...currentVisibility,
            [update.field]: !currentVisibility[update.field],
          }
          set(columnVisibilityAtom, newVisibility)
        }
        break
      }

      case 'setAll': {
        columns.forEach(column => {
          newVisibility[column] = !!update.value
        })
        set(columnVisibilityAtom, newVisibility)
        break
      }

      case 'save': {
        if (update.newState) {
          set(columnVisibilityAtom, update.newState)
        }
        break
      }

      case 'reset': {
        columns.forEach(column => {
          newVisibility[column] = true
        })
        set(columnVisibilityAtom, newVisibility)
        break
      }
    }
  }
)
