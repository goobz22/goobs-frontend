'use client'

import React, { useEffect } from 'react'
import FileCopy from '../../Icons/FileCopy'
import Delete from '../../Icons/Delete'
import Download from '../../Icons/Download'
import Edit from '../../Icons/Edit'
import type { DataGridStyles } from '../../../theme'

type ModalType = 'duplicate' | 'delete' | 'export' | 'manage' | 'show'

interface ManageRowProps {
  handleClose?: () => void
  selectedRows?: string[]
  rows?: Array<{ [key: string]: unknown }>
  onDuplicate?: () => void
  onDelete?: () => void
  onManage?: () => void
  onShow?: () => void
  onExport?: () => void
  /** Comprehensive styling options including theme, custom colors, and layout properties. */
  styles?: DataGridStyles
}

function ManageRow({
  handleClose = () => {},
  selectedRows = [],
  rows = [],
  onDuplicate,
  onDelete,
  onManage,
  onShow,
  onExport,
  styles,
}: ManageRowProps) {
  const isSacredTheme = styles?.theme === 'sacred'

  // CSS keyframes for sacred animations
  useEffect(() => {
    if (isSacredTheme) {
      const styleSheet =
        typeof document !== 'undefined' && document.styleSheets?.length
          ? document.styleSheets[0]
          : undefined
      const keyframes = `
        @keyframes manageRowGlowPulse {
          0%, 100% { 
            border-color: rgba(255, 215, 0, 0.5);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
          }
          50% { 
            border-color: rgba(255, 215, 0, 0.8);
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
          }
        }
      `
      if (styleSheet) {
        try {
          styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
        } catch {
          // Keyframes might already exist
        }
      }
    }
  }, [isSacredTheme])

  const handleActionSelection = (type: ModalType) => {
    switch (type) {
      case 'duplicate':
        onDuplicate?.()
        handleClose()
        break
      case 'delete':
        if (onDelete) {
          onDelete()
          if (selectedRows.length > 0) {
            handleClose()
          }
        }
        break
      case 'export':
        if (onExport) {
          onExport()
        } else {
          handleExport()
        }
        handleClose()
        break
      case 'manage':
        if (selectedRows.length === 1 && onManage) {
          onManage()
          return
        }
        break
      case 'show':
        onShow?.()
        handleClose()
        break
    }
  }

  const handleExport = () => {
    const selectedData = rows.filter(row =>
      selectedRows.includes((row.id ?? row._id) as string)
    )
    const csvContent = selectedData
      .map(row => Object.values(row).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'exported_data.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (selectedRows.length === 0) return null

  const containerStyle = {
    zIndex: 1300,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '48px',
    width: 'auto',
    maxWidth: '100%',
    minWidth: '0',
    padding: '0 8px',
    boxSizing: 'border-box' as const,
    userSelect: 'none' as const,
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderRadius: '6px',
    backgroundColor: isSacredTheme
      ? 'rgba(0, 0, 0, 0.9)'
      : 'rgba(255, 255, 255, 1)',
    ...(isSacredTheme && {
      border: '2px solid rgba(255, 215, 0, 0.5)',
      backdropFilter: 'blur(8px)',
      animation: 'manageRowGlowPulse 3s ease-in-out infinite',
    }),
  }

  const innerContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    width: 'auto',
    minWidth: '0',
    maxWidth: '100%',
  }

  const titleContainerStyle = {
    flex: '0 1 auto',
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    minWidth: '0',
    overflow: 'hidden',
  }

  const actionsContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '2px',
    flex: '0 0 auto',
    minWidth: '0',
  }

  const dividerStyle = {
    width: '1px',
    height: '24px',
    backgroundColor: isSacredTheme
      ? 'rgba(255, 215, 0, 0.3)'
      : 'rgba(229, 231, 235, 1)',
    margin: '0 8px',
    flexShrink: 0,
  }

  const actionButtonStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 8px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'colors 0.3s ease',
    userSelect: 'none' as const,
    minWidth: '0',
    height: '40px',
    gap: '2px',
    whiteSpace: 'nowrap' as const,
  }

  const iconContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isSacredTheme ? 'rgba(255, 215, 0, 1)' : 'rgba(55, 65, 81, 1)',
    fontSize: '16px',
    width: '20px',
    height: '16px',
    margin: '0',
    padding: '0',
  }

  const actionsRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    height: '100%',
  }

  return (
    <div style={containerStyle}>
      <div style={innerContainerStyle}>
        <div style={titleContainerStyle}>
          <span
            style={{
              color: isSacredTheme ? '#FFD700' : 'rgba(55, 65, 81, 1)',
              fontSize: '14px',
              fontWeight: '500',
              margin: '0',
              padding: '0',
              lineHeight: '1',
            }}
          >
            {`${selectedRows.length} ${
              selectedRows.length === 1 ? 'item' : 'items'
            } selected`}
          </span>
        </div>

        <div style={actionsContainerStyle}>
          <div style={actionsRowStyle}>
            {selectedRows.length === 1 && onManage && (
              <div
                onClick={e => {
                  e.stopPropagation()
                  handleActionSelection('manage')
                }}
                style={actionButtonStyle}
              >
                <div style={iconContainerStyle}>
                  <Edit
                    styles={{ theme: isSacredTheme ? 'sacred' : 'light' }}
                    width="16"
                    height="16"
                    style={{ width: '16px', height: '16px' }}
                  />
                </div>
                <span
                  style={{
                    color: isSacredTheme ? '#FFD700' : 'rgba(55, 65, 81, 1)',
                    fontSize: '10px',
                    fontWeight: '500',
                    margin: '0',
                    padding: '0',
                    lineHeight: '1',
                    display: 'block',
                  }}
                >
                  Manage
                </span>
              </div>
            )}

            {selectedRows.length === 1 && onShow && (
              <div
                onClick={e => {
                  e.stopPropagation()
                  handleActionSelection('show')
                }}
                style={actionButtonStyle}
              >
                <div style={iconContainerStyle}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12C2.73 16.11 7 20 12 20s9.27-3.89 11-8c-1.73-4.11-6-8-11-8S2.73 7.89 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <span
                  style={{
                    color: isSacredTheme ? '#FFD700' : 'rgba(55, 65, 81, 1)',
                    fontSize: '10px',
                    fontWeight: '500',
                    margin: '0',
                    padding: '0',
                    lineHeight: '1',
                    display: 'block',
                  }}
                >
                  Show
                </span>
              </div>
            )}

            {selectedRows.length === 1 && onDuplicate && (
              <div
                onClick={e => {
                  e.stopPropagation()
                  handleActionSelection('duplicate')
                }}
                style={actionButtonStyle}
              >
                <div style={iconContainerStyle}>
                  <FileCopy
                    styles={{ theme: isSacredTheme ? 'sacred' : 'light' }}
                    width="16"
                    height="16"
                    style={{ width: '16px', height: '16px' }}
                  />
                </div>
                <span
                  style={{
                    color: isSacredTheme ? '#FFD700' : 'rgba(55, 65, 81, 1)',
                    fontSize: '10px',
                    fontWeight: '500',
                    margin: '0',
                    padding: '0',
                    lineHeight: '1',
                    display: 'block',
                  }}
                >
                  Duplicate
                </span>
              </div>
            )}

            {selectedRows.length === 1 &&
              (onManage || onShow || onDuplicate) && (
                <div style={dividerStyle} />
              )}

            {onDelete && (
              <div
                onClick={e => {
                  e.stopPropagation()
                  handleActionSelection('delete')
                }}
                style={actionButtonStyle}
              >
                <div style={iconContainerStyle}>
                  <Delete
                    styles={{ theme: isSacredTheme ? 'sacred' : 'light' }}
                    width="16"
                    height="16"
                    style={{ width: '16px', height: '16px' }}
                  />
                </div>
                <span
                  style={{
                    color: isSacredTheme ? '#FFD700' : 'rgba(55, 65, 81, 1)',
                    fontSize: '10px',
                    fontWeight: '500',
                    margin: '0',
                    padding: '0',
                    lineHeight: '1',
                    display: 'block',
                  }}
                >
                  Delete
                </span>
              </div>
            )}

            {onExport && (
              <div
                onClick={e => {
                  e.stopPropagation()
                  handleActionSelection('export')
                }}
                style={actionButtonStyle}
              >
                <div style={iconContainerStyle}>
                  <Download
                    styles={{ theme: isSacredTheme ? 'sacred' : 'light' }}
                    width="16"
                    height="16"
                    style={{ width: '16px', height: '16px' }}
                  />
                </div>
                <span
                  style={{
                    color: isSacredTheme ? '#FFD700' : 'rgba(55, 65, 81, 1)',
                    fontSize: '10px',
                    fontWeight: '500',
                    margin: '0',
                    padding: '0',
                    lineHeight: '1',
                    display: 'block',
                  }}
                >
                  Export
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageRow
