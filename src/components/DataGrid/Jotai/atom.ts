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

    console.log('columnVisibilityActions - before:', {
      type: update.type,
      currentVisibility,
    })

    switch (update.type) {
      case 'toggle': {
        if (update.field) {
          newVisibility = {
            ...currentVisibility,
            [update.field]: !currentVisibility[update.field],
          }
          console.log('columnVisibilityActions - toggle:', {
            field: update.field,
            before: currentVisibility[update.field],
            after: newVisibility[update.field],
          })
          set(columnVisibilityAtom, newVisibility)
        }
        break
      }

      case 'setAll': {
        columns.forEach(column => {
          newVisibility[column] = !!update.value
        })
        console.log('columnVisibilityActions - setAll:', {
          value: update.value,
          newState: newVisibility,
        })
        set(columnVisibilityAtom, newVisibility)
        break
      }

      case 'save': {
        if (update.newState) {
          console.log('columnVisibilityActions - save:', {
            before: currentVisibility,
            after: update.newState,
          })
          set(columnVisibilityAtom, update.newState)
        }
        break
      }

      case 'reset': {
        columns.forEach(column => {
          newVisibility[column] = true
        })
        console.log('columnVisibilityActions - reset:', newVisibility)
        set(columnVisibilityAtom, newVisibility)
        break
      }
    }

    console.log('columnVisibilityActions - after:', get(columnVisibilityAtom))
  }
)
