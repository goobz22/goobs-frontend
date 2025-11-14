import { useCallback, useEffect, useRef, useState } from 'react'
import { useColumnVisibility } from '../context/ColumnVisibilityContext'
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
  const { columnVisibility, saveVisibility } = useColumnVisibility()
  const [searchInput, setSearchInput] = useState(initialSearchInput)
  const [isAllChecked, setIsAllChecked] = useState(true)
  const initialized = useRef(false)

  useEffect(() => {
    if (isPopupOpen) {
      const currentVisibility: ColumnVisibilityModel = {}
      columns.forEach(column => {
        currentVisibility[column.field] = columnVisibility[column.field] ?? true
      })
      setTempVisibleColumns(currentVisibility)
      setIsAllChecked(
        columns.every(column => currentVisibility[column.field] === true)
      )
      initialized.current = true
    }
  }, [isPopupOpen, columns, columnVisibility])

  const handleAllCols = useCallback(
    (checked: boolean) => {
      setIsAllChecked(checked)

      setTempVisibleColumns(() => {
        const newVisibility: ColumnVisibilityModel = {}
        columns.forEach(column => {
          newVisibility[column.field] = checked
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

        return newState
      })
    },
    [columns]
  )

  const onSaveColumnView = useCallback(() => {
    saveVisibility(tempVisibleColumns)
    handleClose()
  }, [tempVisibleColumns, saveVisibility, handleClose])

  const formatColumnName = useCallback((fieldName: string): string => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }, [])

  const handlePageUnload = useCallback(() => {
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
