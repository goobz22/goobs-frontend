import { useCallback, useEffect, useRef, useState } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { columnVisibilityAtom, columnVisibilityActions } from '../Jotai/atom'
import type { ColumnDef } from '../types'

type ColumnVisibilityModel = { [key: string]: boolean }

interface UseManageColumnProps {
  columns: ColumnDef[]
  handleClose: () => void
  isPopupOpen: boolean
  initialSearchInput?: string
}

export const useManageColumn = ({
  columns,
  handleClose,
  isPopupOpen,
  initialSearchInput = '',
}: UseManageColumnProps) => {
  const [tempVisibleColumns, setTempVisibleColumns] =
    useState<ColumnVisibilityModel>({})
  const [columnVisibility] = useAtom(columnVisibilityAtom)
  const updateVisibility = useSetAtom(columnVisibilityActions)
  const [searchInput, setSearchInput] = useState(initialSearchInput)
  const [isAllChecked, setIsAllChecked] = useState(true)
  const initialized = useRef(false)

  console.log('useManageColumn hook render:', {
    isPopupOpen,
    columnVisibility,
    tempVisibleColumns,
    searchInput,
  })

  useEffect(() => {
    if (isPopupOpen) {
      const currentVisibility: ColumnVisibilityModel = {}
      columns.forEach(column => {
        currentVisibility[column.field] = columnVisibility[column.field] ?? true
      })
      console.log('Initializing tempVisibleColumns:', currentVisibility)
      setTempVisibleColumns(currentVisibility)
      setIsAllChecked(
        columns.every(column => currentVisibility[column.field] === true)
      )
      initialized.current = true
    }
  }, [isPopupOpen, columns, columnVisibility])

  const handleAllCols = useCallback(
    (checked: boolean) => {
      console.log('handleAllCols called with checked:', checked)
      setIsAllChecked(checked)

      setTempVisibleColumns(prev => {
        const newVisibility: ColumnVisibilityModel = {}
        columns.forEach(column => {
          newVisibility[column.field] = checked
        })

        console.log('handleAllCols:', {
          before: prev,
          after: newVisibility,
          checked,
        })

        return newVisibility
      })
    },
    [columns]
  )

  const toggleColumnState = useCallback(
    (field: string) => {
      setTempVisibleColumns(prev => {
        const newState = {
          ...prev,
          [field]: !prev[field],
        }

        // Update isAllChecked based on new state
        const areAllVisible = columns.every(column =>
          field === column.field ? newState[field] : prev[column.field]
        )
        setIsAllChecked(areAllVisible)

        console.log('toggleColumnState:', {
          field,
          before: prev[field],
          after: newState[field],
          allState: newState,
          areAllVisible,
        })
        return newState
      })
    },
    [columns]
  )

  const onSaveColumnView = useCallback(() => {
    console.log('Saving column visibility state:', tempVisibleColumns)
    updateVisibility({ type: 'save', newState: tempVisibleColumns })
    handleClose()
  }, [tempVisibleColumns, updateVisibility, handleClose])

  const formatColumnName = useCallback((fieldName: string): string => {
    const formatted = fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
    console.log('Formatting column name:', { fieldName, formatted })
    return formatted
  }, [])

  const handlePageUnload = useCallback(() => {
    console.log('Page unload - closing manage columns')
    handleClose()
  }, [handleClose])

  useEffect(() => {
    window.addEventListener('beforeunload', handlePageUnload)
    return () => {
      window.removeEventListener('beforeunload', handlePageUnload)
    }
  }, [handlePageUnload])

  return {
    handleAllCols,
    toggleColumnState,
    visibleColumns: tempVisibleColumns,
    onSaveColumnView,
    formatColumnName,
    searchInput,
    setSearchInput,
    isAllChecked,
  }
}
