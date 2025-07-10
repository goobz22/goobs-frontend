'use client'

import React, { useEffect } from 'react'
import Typography from '../../Typography'
import FileCopy from '../../Icons/FileCopy'
import Delete from '../../Icons/Delete'
import Download from '../../Icons/Download'
import Edit from '../../Icons/Edit'

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
  sacredtheme?: boolean
}

// Premium theme styles (when sacredtheme=false)
const premiumStyles = {
  container: {
    zIndex: 1300,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '60px',
    minWidth: '100%',
    padding: '0 4px',
    userSelect: 'none',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderRadius: '6px',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  } as React.CSSProperties,

  innerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    width: '100%',
  } as React.CSSProperties,

  titleContainer: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
  } as React.CSSProperties,

  actionsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2px',
  } as React.CSSProperties,

  divider: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRight: '1px solid rgba(229, 231, 235, 1)',
    paddingRight: '8px',
    marginRight: '8px',
  } as React.CSSProperties,

  actionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'colors 0.3s ease',
    userSelect: 'none',
    '&:hover': {
      backgroundColor: 'rgba(243, 244, 246, 1)',
    },
  } as React.CSSProperties,

  iconContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'rgba(0, 0, 0, 1)',
  } as React.CSSProperties,

  actionsRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  } as React.CSSProperties,
}

// Sacred theme styles (when sacredtheme=true)
const sacredStyles = {
  container: {
    zIndex: 1300,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '60px',
    minWidth: '100%',
    padding: '0 4px',
    userSelect: 'none',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderRadius: '6px',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    border: '2px solid rgba(255, 215, 0, 0.5)',
    backdropFilter: 'blur(8px)',
    animation: 'manageRowGlowPulse 3s ease-in-out infinite',
  } as React.CSSProperties,

  innerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    width: '100%',
  } as React.CSSProperties,

  titleContainer: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
  } as React.CSSProperties,

  actionsContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2px',
  } as React.CSSProperties,

  divider: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRight: '1px solid rgba(255, 215, 0, 0.3)',
    paddingRight: '8px',
    marginRight: '8px',
  } as React.CSSProperties,

  actionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'colors 0.3s ease',
    userSelect: 'none',
    '&:hover': {
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
  } as React.CSSProperties,

  iconContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'rgba(255, 215, 0, 1)',
  } as React.CSSProperties,

  actionsRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  } as React.CSSProperties,

  typography: {
    fontFamily: '"Cinzel", serif',
    fontWeight: 600,
    letterSpacing: '0.025em',
    textShadow: '0 0 3px rgba(255, 215, 0, 0.3)',
  } as React.CSSProperties,

  typographySmall: {
    fontFamily: '"Crimson Text", serif',
  } as React.CSSProperties,
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
  sacredtheme = false,
}: ManageRowProps) {
  // CSS keyframes for sacred animations
  useEffect(() => {
    if (sacredtheme) {
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
  }, [sacredtheme])

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

  const styles = sacredtheme ? sacredStyles : premiumStyles

  const titleStyle = {
    ...(sacredtheme ? sacredStyles.typography : {}),
    ...(sacredtheme ? {} : {}),
  }

  const smallTypographyStyle = {
    ...(sacredtheme ? sacredStyles.typographySmall : {}),
    ...(sacredtheme ? {} : {}),
  }

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <div style={styles.titleContainer}>
          <Typography
            fontvariant="merriparagraph"
            text={`${selectedRows.length} ${
              selectedRows.length === 1 ? 'item' : 'items'
            } selected`}
            fontcolor={sacredtheme ? '#FFD700' : undefined}
            style={sacredtheme ? titleStyle : {}}
          />
        </div>

        <div style={styles.actionsContainer}>
          {selectedRows.length === 1 && (onManage || onShow || onDuplicate) && (
            <div style={styles.divider}>
              {onManage && (
                <div
                  onClick={e => {
                    e.stopPropagation()
                    handleActionSelection('manage')
                  }}
                  style={styles.actionButton}
                >
                  <div style={styles.iconContainer}>
                    <Edit />
                    <Typography
                      fontvariant="merriparagraph"
                      text="Manage"
                      fontcolor={sacredtheme ? '#FFD700' : undefined}
                      style={sacredtheme ? smallTypographyStyle : {}}
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
                  style={styles.actionButton}
                >
                  <div style={styles.iconContainer}>
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
                      fontvariant="merriparagraph"
                      text="Show"
                      fontcolor={sacredtheme ? '#FFD700' : undefined}
                      style={sacredtheme ? smallTypographyStyle : {}}
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
                  style={styles.actionButton}
                >
                  <div style={styles.iconContainer}>
                    <FileCopy />
                    <Typography
                      fontvariant="merriparagraph"
                      text="Duplicate"
                      fontcolor={sacredtheme ? '#FFD700' : undefined}
                      style={sacredtheme ? smallTypographyStyle : {}}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={styles.actionsRow}>
            {onDelete && (
              <div
                onClick={e => {
                  e.stopPropagation()
                  handleActionSelection('delete')
                }}
                style={styles.actionButton}
              >
                <div style={styles.iconContainer}>
                  <Delete />
                  <Typography
                    fontvariant="merriparagraph"
                    text="Delete"
                    fontcolor={sacredtheme ? '#FFD700' : undefined}
                    style={sacredtheme ? smallTypographyStyle : {}}
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
                style={styles.actionButton}
              >
                <div style={styles.iconContainer}>
                  <Download />
                  <Typography
                    fontvariant="merriparagraph"
                    text="Export"
                    fontcolor={sacredtheme ? '#FFD700' : undefined}
                    style={sacredtheme ? smallTypographyStyle : {}}
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
