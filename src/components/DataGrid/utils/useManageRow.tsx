'use client'

import { useCallback } from 'react'

interface UseManageRowProps {
  onManage?: (selectedRows: string[]) => void
  selectedRows: string[]
  handleSelectionChange: (newSelectedIds: string[]) => void
}

/**
 * A hook for handling "Manage" row interactions:
 * - closing the ManageRow component (clearing selection if needed)
 * - calling the parent-provided `onManage` callback with the current selected rows
 */
export function useManageRow({
  onManage,
  selectedRows,
  handleSelectionChange,
}: UseManageRowProps) {
  // If the user clicks "Close" and there's no onManage prop, clear the row selection
  const handleManageRowClose = useCallback(() => {
    if (!onManage) {
      handleSelectionChange([])
    }
  }, [onManage, handleSelectionChange])

  // When the user clicks "Manage", call onManage with the current selected rows
  const handleManage = useCallback(() => {
    if (onManage) {
      onManage(selectedRows)
    }
  }, [onManage, selectedRows])

  return {
    handleManageRowClose,
    handleManage,
  }
}
