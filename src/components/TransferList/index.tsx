'use client'

import React, { useState } from 'react'
import Dropdown, { DropdownOption } from '../Field/Dropdown/Regular'
import CustomCheckbox from '../Checkbox'

function not(a: readonly string[], b: readonly string[]) {
  return a.filter(value => b.indexOf(value) === -1)
}
function intersection(a: readonly string[], b: readonly string[]) {
  return a.filter(value => b.indexOf(value) !== -1)
}

export type TransferListVariant = 'singleSelection' | 'multipleSelection'

export interface TransferListDropdownDataMap {
  [dropdownValue: string]: {
    leftItems: string[]
    rightItems: string[]
  }
}

export interface TransferListProps {
  variant?: TransferListVariant
  leftItems?: readonly string[]
  rightItems?: readonly string[]
  dropdownLabel?: string
  dropdownOptions?: DropdownOption[]
  dropdownDataMap?: TransferListDropdownDataMap
  itemLabelMap?: Record<string, string>
  onChange: (
    leftItems: string[],
    rightItems: string[],
    dropdownValue?: string
  ) => void
  leftTitle?: string
  rightTitle?: string
  sacredtheme?: boolean
  className?: string
  style?: React.CSSProperties
}

const premiumStyles = {
  container: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  } as React.CSSProperties,
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  } as React.CSSProperties,
  title: {
    marginBottom: '8px',
    fontWeight: 600,
    color: 'rgb(17, 24, 39)',
    fontFamily: '"Inter", sans-serif',
  } as React.CSSProperties,
  list: {
    width: '100%',
    height: '232px',
    overflow: 'auto',
    marginTop: '8px',
    border: '1px solid rgb(209, 213, 219)',
    borderRadius: '4px',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
    backgroundColor: 'white',
  } as React.CSSProperties,
  listItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    textAlign: 'left',
    transition: 'all 0.3s ease',
    borderBottom: '1px solid rgb(229, 231, 235)',
  } as React.CSSProperties,
  listItemHover: {
    backgroundColor: 'rgb(249, 250, 251)',
  } as React.CSSProperties,
  listItemChecked: {
    backgroundColor: 'rgb(239, 246, 255)',
    borderLeft: '4px solid rgb(59, 130, 246)',
  } as React.CSSProperties,
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '12px',
  } as React.CSSProperties,
  label: {
    flex: 1,
    fontWeight: 500,
    color: 'rgb(17, 24, 39)',
  } as React.CSSProperties,
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '64px',
    gap: '4px',
  } as React.CSSProperties,
  button: {
    padding: '4px 12px',
    fontSize: '14px',
    border: '1px solid rgb(209, 213, 219)',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    backgroundColor: 'white',
    color: 'rgb(55, 65, 81)',
  } as React.CSSProperties,
  buttonHover: {
    backgroundColor: 'rgb(249, 250, 251)',
  } as React.CSSProperties,
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  } as React.CSSProperties,
}

const sacredStyles = {
  container: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    padding: '16px',
    backgroundColor: 'rgba(10, 10, 10, 0.6)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    position: 'relative',
  } as React.CSSProperties,
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  } as React.CSSProperties,
  title: {
    marginBottom: '8px',
    fontWeight: 600,
    color: '#FFD700',
    fontFamily: '"Cinzel", serif',
    letterSpacing: '0.05em',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
  } as React.CSSProperties,
  list: {
    width: '100%',
    height: '232px',
    overflow: 'auto',
    marginTop: '8px',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    borderRadius: '4px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    animation: 'sacred-glow-pulse 2s infinite alternate',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(255, 215, 0, 0.5) rgba(0, 0, 0, 0.3)',
  } as React.CSSProperties,
  listItem: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    textAlign: 'left',
    transition: 'all 0.3s ease',
    color: '#FFD700',
    borderTop: '1px solid rgba(255, 215, 0, 0.1)',
    borderRight: '1px solid rgba(255, 215, 0, 0.1)',
    borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
    borderLeft: '1px solid rgba(255, 215, 0, 0.1)',
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: '4px',
    margin: '4px 0',
    boxShadow: '0 0 5px rgba(255, 215, 0, 0.1)',
  } as React.CSSProperties,
  listItemHover: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    transform: 'translateX(4px)',
    boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
  } as React.CSSProperties,
  listItemChecked: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderLeft: '4px solid #FFD700',
    boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
  } as React.CSSProperties,
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '12px',
  } as React.CSSProperties,
  label: {
    flex: 1,
    fontWeight: 500,
    color: '#FFD700',
    textShadow: '0 0 5px rgba(255, 215, 0, 0.3)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  } as React.CSSProperties,
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '64px',
    gap: '4px',
  } as React.CSSProperties,
  button: {
    padding: '4px 12px',
    fontSize: '14px',
    border: '1px solid #FFD700',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: '#FFD700',
    animation: 'sacred-float 3s infinite ease-in-out',
  } as React.CSSProperties,
  buttonHover: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    transform: 'scale(1.1)',
    boxShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
  } as React.CSSProperties,
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    color: '#FFD700',
    borderColor: '#FFD700',
  } as React.CSSProperties,
  glyph: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    fontSize: '20px',
    color: 'rgba(255, 215, 0, 0.2)',
    animation: 'glyph-rotate 20s linear infinite',
  } as React.CSSProperties,
}

// TransferButton component moved outside TransferList to avoid re-creation during render
interface TransferButtonProps {
  onClick: () => void
  disabled: boolean
  'aria-label': string
  children: React.ReactNode
  name: string
  styles: typeof premiumStyles | typeof sacredStyles
  sacredtheme: boolean
  hoveredButton: string | null
  setHoveredButton: (name: string | null) => void
}

const TransferButton: React.FC<TransferButtonProps> = ({
  onClick,
  disabled,
  'aria-label': ariaLabel,
  children,
  name,
  styles,
  sacredtheme,
  hoveredButton,
  setHoveredButton,
}) => {
  const isHovered = hoveredButton === name
  const buttonStyle: React.CSSProperties = {
    ...styles.button,
    ...(isHovered && !disabled && styles.buttonHover),
    ...(disabled && styles.buttonDisabled),
    ...(sacredtheme && {
      animationDelay: name === 'all-left' ? '0.5s' : undefined,
    }),
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      style={buttonStyle}
      onMouseEnter={() => setHoveredButton(name)}
      onMouseLeave={() => setHoveredButton(null)}
    >
      {children}
    </button>
  )
}

const TransferList: React.FC<TransferListProps> = ({
  variant = 'singleSelection',
  leftItems = [],
  rightItems = [],
  dropdownLabel,
  dropdownOptions = [],
  dropdownDataMap = {},
  itemLabelMap,
  onChange,
  leftTitle = 'Unassigned',
  rightTitle = 'Assigned',
  sacredtheme = false,
  className,
  style,
}) => {
  const [selectedDropdownValue, setSelectedDropdownValueInternal] =
    useState<string>('')
  const [checked, setChecked] = useState<readonly string[]>([])
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Custom handler that resets checked when dropdown changes
  const setSelectedDropdownValue = React.useCallback(
    (value: string) => {
      setSelectedDropdownValueInternal(value)
      if (variant === 'multipleSelection') {
        setChecked([])
      }
    },
    [variant]
  )

  const styles = sacredtheme ? sacredStyles : premiumStyles

  let currentLeft: readonly string[] = leftItems
  let currentRight: readonly string[] = rightItems

  if (variant === 'multipleSelection') {
    currentLeft = dropdownDataMap[selectedDropdownValue]?.leftItems ?? []
    currentRight = dropdownDataMap[selectedDropdownValue]?.rightItems ?? []
  }

  const leftChecked = intersection(checked, currentLeft)
  const rightChecked = intersection(checked, currentRight)

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]
    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
  }

  const handleAllRight = () => {
    const newRight = [...currentRight, ...currentLeft]
    onChange(
      [],
      newRight,
      variant === 'multipleSelection' ? selectedDropdownValue : undefined
    )
    setChecked([])
  }

  const handleCheckedRight = () => {
    const newRight = [...currentRight, ...leftChecked]
    const newLeft = not(currentLeft, leftChecked)
    setChecked(not(checked, leftChecked))
    onChange(
      newLeft,
      newRight,
      variant === 'multipleSelection' ? selectedDropdownValue : undefined
    )
  }

  const handleCheckedLeft = () => {
    const newLeft = [...currentLeft, ...rightChecked]
    const newRight = not(currentRight, rightChecked)
    setChecked(not(checked, rightChecked))
    onChange(
      newLeft,
      newRight,
      variant === 'multipleSelection' ? selectedDropdownValue : undefined
    )
  }

  const handleAllLeft = () => {
    const newLeft = [...currentLeft, ...currentRight]
    onChange(
      newLeft,
      [],
      variant === 'multipleSelection' ? selectedDropdownValue : undefined
    )
    setChecked([])
  }

  const renderList = (items: readonly string[]) => (
    <div style={styles.list}>
      <div style={{ borderBottom: 'none' }}>
        {items.map(value => {
          const labelId = `transfer-list-item-${value}-label`
          const isChecked = checked.indexOf(value) !== -1
          const displayedLabel = itemLabelMap?.[value] || value
          const isHovered = hoveredItem === value

          const listItemStyle: React.CSSProperties = {
            ...styles.listItem,
            ...(isHovered && styles.listItemHover),
            ...(isChecked && styles.listItemChecked),
          }

          return (
            <button
              key={value}
              onClick={handleToggle(value)}
              style={listItemStyle}
              onMouseEnter={() => setHoveredItem(value)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div style={styles.checkboxContainer}>
                <CustomCheckbox
                  checked={isChecked}
                  onChange={() => {}}
                  aria-labelledby={labelId}
                  styles={{
                    theme: sacredtheme ? 'sacred' : 'light',
                  }}
                />
              </div>
              <span id={labelId} style={styles.label}>
                {displayedLabel}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )

  const renderLeftColumn = () => {
    if (variant === 'singleSelection') {
      return (
        <div style={styles.column}>
          <h3 style={styles.title}>{leftTitle}</h3>
          {renderList(currentLeft)}
        </div>
      )
    }
    return (
      <div style={styles.column}>
        <Dropdown
          label={dropdownLabel || ''}
          options={dropdownOptions}
          value={selectedDropdownValue}
          onChange={value => setSelectedDropdownValue(value)}
          styles={{ theme: sacredtheme ? 'sacred' : 'light' }}
        />
        {renderList(currentLeft)}
      </div>
    )
  }

  return (
    <div style={{ ...styles.container, ...style }} className={className}>
      {sacredtheme && <div style={sacredStyles.glyph}>𓊨</div>}
      <div style={styles.column}>{renderLeftColumn()}</div>
      <div style={styles.buttonGroup}>
        <TransferButton
          onClick={handleAllRight}
          disabled={currentLeft.length === 0}
          aria-label="move all right"
          name="all-right"
          styles={styles}
          sacredtheme={sacredtheme}
          hoveredButton={hoveredButton}
          setHoveredButton={setHoveredButton}
        >
          ≫
        </TransferButton>
        <TransferButton
          onClick={handleCheckedRight}
          disabled={leftChecked.length === 0}
          aria-label="move selected right"
          name="checked-right"
          styles={styles}
          sacredtheme={sacredtheme}
          hoveredButton={hoveredButton}
          setHoveredButton={setHoveredButton}
        >
          &gt;
        </TransferButton>
        <TransferButton
          onClick={handleCheckedLeft}
          disabled={rightChecked.length === 0}
          aria-label="move selected left"
          name="checked-left"
          styles={styles}
          sacredtheme={sacredtheme}
          hoveredButton={hoveredButton}
          setHoveredButton={setHoveredButton}
        >
          &lt;
        </TransferButton>
        <TransferButton
          onClick={handleAllLeft}
          disabled={currentRight.length === 0}
          aria-label="move all left"
          name="all-left"
          styles={styles}
          sacredtheme={sacredtheme}
          hoveredButton={hoveredButton}
          setHoveredButton={setHoveredButton}
        >
          ≪
        </TransferButton>
      </div>
      <div style={styles.column}>
        <h3 style={styles.title}>{rightTitle}</h3>
        {renderList(currentRight)}
      </div>
    </div>
  )
}

export default TransferList
