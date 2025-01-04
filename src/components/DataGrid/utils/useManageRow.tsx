'use client'

import { useCallback } from 'react'

interface UseManageRowProps {
  onManage?: () => void
  selectedRows: string[]
  handleSelectionChange: (newSelectedIds: string[]) => void
}

/**
 * A hook for handling "Manage" row interactions:
 * - closing the ManageRow component
 * - calling the parent-provided `onManage` callback
 */
export function useManageRow({
  onManage,
  selectedRows,
  handleSelectionChange,
}: UseManageRowProps) {
  // If user clicks "Close" in ManageRow but there's no onManage prop, clear row selection
  const handleManageRowClose = useCallback(() => {
    if (!onManage) {
      handleSelectionChange([])
    }
  }, [onManage, handleSelectionChange])

  // Called if user clicks "Manage" in ManageRow
  const handleManage = useCallback(() => {
    console.log('DataGrid handleManage with selectedRows:', selectedRows)
    onManage?.()
  }, [onManage, selectedRows])

  return {
    handleManageRowClose,
    handleManage,
  }
}
