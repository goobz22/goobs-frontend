'use client'

import React, { useEffect } from 'react'
import Typography from '../../Typography'
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
      const styleSheet = document.styleSheets[0]
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
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length)
      } catch {
        // Keyframes might already exist
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
    height: '60px',
    minWidth: '100%',
    padding: '0 4px',
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
    width: '100%',
  }

  const titleContainerStyle = {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
  }

  const actionsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '2px',
  }

  const dividerStyle = {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
    borderRight: isSacredTheme
      ? '1px solid rgba(255, 215, 0, 0.3)'
      : '1px solid rgba(229, 231, 235, 1)',
    paddingRight: '8px',
    marginRight: '8px',
  }

  const actionButtonStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'colors 0.3s ease',
    userSelect: 'none' as const,
  }

  const iconContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    color: isSacredTheme ? 'rgba(255, 215, 0, 1)' : 'rgba(0, 0, 0, 1)',
  }

  const actionsRowStyle = {
    display: 'flex',
    flexDirection: 'row' as const,
    alignItems: 'center',
  }

  return (
    <div style={containerStyle}>
      <div style={innerContainerStyle}>
        <div style={titleContainerStyle}>
          <Typography
            variant="merriparagraph"
            text={`${selectedRows.length} ${
              selectedRows.length === 1 ? 'item' : 'items'
            } selected`}
            styles={{
              color: isSacredTheme ? '#FFD700' : undefined,
              theme: isSacredTheme ? 'sacred' : 'light',
            }}
          />
        </div>

        <div style={actionsContainerStyle}>
          {selectedRows.length === 1 && (onManage || onShow || onDuplicate) && (
            <div style={dividerStyle}>
              {onManage && (
                <div
                  onClick={e => {
                    e.stopPropagation()
                    handleActionSelection('manage')
                  }}
                  style={actionButtonStyle}
                >
                  <div style={iconContainerStyle}>
                    <Edit />
                    <Typography
                      variant="merriparagraph"
                      text="Manage"
                      styles={{
                        color: isSacredTheme ? '#FFD700' : undefined,
                        theme: isSacredTheme ? 'sacred' : 'light',
                      }}
                    />
                  </div>
                </div>
              )}
              {onShow && (
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
                      width="1em"
                      height="1em"
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
                    <Typography
                      variant="merriparagraph"
                      text="Show"
                      styles={{
                        color: isSacredTheme ? '#FFD700' : undefined,
                        theme: isSacredTheme ? 'sacred' : 'light',
                      }}
                    />
                  </div>
                </div>
              )}

              {onDuplicate && (
                <div
                  onClick={e => {
                    e.stopPropagation()
                    handleActionSelection('duplicate')
                  }}
                  style={actionButtonStyle}
                >
                  <div style={iconContainerStyle}>
                    <FileCopy />
                    <Typography
                      variant="merriparagraph"
                      text="Duplicate"
                      styles={{
                        color: isSacredTheme ? '#FFD700' : undefined,
                        theme: isSacredTheme ? 'sacred' : 'light',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={actionsRowStyle}>
            {onDelete && (
              <div
                onClick={e => {
                  e.stopPropagation()
                  handleActionSelection('delete')
                }}
                style={actionButtonStyle}
              >
                <div style={iconContainerStyle}>
                  <Delete />
                  <Typography
                    variant="merriparagraph"
                    text="Delete"
                    styles={{
                      color: isSacredTheme ? '#FFD700' : undefined,
                      theme: isSacredTheme ? 'sacred' : 'light',
                    }}
                  />
                </div>
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
                  <Download />
                  <Typography
                    variant="merriparagraph"
                    text="Export"
                    styles={{
                      color: isSacredTheme ? '#FFD700' : undefined,
                      theme: isSacredTheme ? 'sacred' : 'light',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageRow
