'use client'

import React, { useState, useMemo } from 'react'
import Popover from '../../../Popover'
import Checkbox from '../../../Checkbox'
import Chip from '../../../Chip'
import ArrowDropDown from '../../../Icons/ArrowDropDown'

type SxProps = Record<string, unknown>
type FormControlProps = Record<string, unknown>

export interface DropdownOption {
  value: string
  attribute1?: string
  attribute2?: string
  attribute3?: string
  attribute4?: string
  attribute5?: string
  attribute6?: string
  uniqueKey?: string
}

export type MultiSelectOption = string | DropdownOption

export interface MultiSelectChipProps
  extends Omit<FormControlProps, 'onChange'> {
  label?: React.ReactNode
  options?: MultiSelectOption[]
  defaultSelected?: string[]
  onChange?: (values: string[]) => void
  complexOptions?: boolean
  showOptionDetails?: boolean
  sacredtheme?: boolean
  className?: string
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  inputfontcolor?: string
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  placeholdercolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  sx?: SxProps
}

interface UnifiedOption {
  value: string
  label: React.ReactNode
}

function isDropdownOption(option: unknown): option is DropdownOption {
  return typeof option === 'object' && option !== null && 'value' in option
}

const getStyles = (
  sacredtheme: boolean,
  backgroundcolor?: string,
  outlinecolor?: string,
  fontcolor?: string
) => ({
  container: { position: 'relative', width: '100%' } as React.CSSProperties,
  chipContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.25rem',
    padding: '0.5rem',
    minHeight: '40px',
    border: `2px solid ${sacredtheme ? 'rgba(255, 215, 0, 0.5)' : outlinecolor || '#CBD5E1'}`,
    borderRadius: '0.375rem',
    cursor: 'pointer',
    backgroundColor: sacredtheme
      ? 'rgba(0, 0, 0, 0.8)'
      : backgroundcolor || 'white',
    color: sacredtheme ? 'rgba(255, 215, 0, 0.7)' : fontcolor || '#4A5568',
    '&:hover': { borderColor: sacredtheme ? '#FFD700' : '#A0AEC0' },
  } as React.CSSProperties,
  placeholder: {
    color: sacredtheme ? 'rgba(255, 215, 0, 0.7)' : '#A0AEC0',
  } as React.CSSProperties,
  arrowIcon: {
    position: 'absolute' as const,
    right: '0.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: sacredtheme ? '#FFD700' : '#4A5568',
  } as React.CSSProperties,
  popoverContent: {
    width: '16rem',
    maxHeight: '15rem',
    overflowY: 'auto',
    border: `1px solid ${sacredtheme ? 'rgba(255, 215, 0, 0.3)' : '#E2E8F0'}`,
    borderRadius: '0.375rem',
    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    backgroundColor: sacredtheme ? 'rgba(0,0,0,0.95)' : 'white',
  } as React.CSSProperties,
  option: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: sacredtheme ? 'rgba(255, 215, 0, 0.1)' : '#F7FAFC',
    },
  } as React.CSSProperties,
  optionLabel: { marginLeft: '0.5rem' } as React.CSSProperties,
  optionDetails: {
    value: {
      color: sacredtheme ? '#FFD700' : 'inherit',
      fontWeight: '500',
    } as React.CSSProperties,
    attribute: {
      fontSize: '0.875rem',
      color: sacredtheme ? 'rgba(255, 215, 0, 0.7)' : '#718096',
      fontStyle: 'italic',
    } as React.CSSProperties,
  },
})

const MultiSelectChip: React.FC<MultiSelectChipProps> = ({
  label = 'Chip',
  options = [],
  defaultSelected = [],
  onChange,
  complexOptions: userSpecifiedComplexOptions,
  showOptionDetails = false,
  sacredtheme = false,
  className,
  backgroundcolor,
  outlinecolor,
  fontcolor,
  placeholdercolor,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)
  const [selectedValues, setSelectedValues] =
    useState<string[]>(defaultSelected)
  const styles = getStyles(
    sacredtheme,
    backgroundcolor,
    outlinecolor,
    fontcolor
  )

  const unifiedOptions = useMemo<UnifiedOption[]>(() => {
    const isComplex =
      userSpecifiedComplexOptions === true ||
      (userSpecifiedComplexOptions !== false &&
        options.length > 0 &&
        isDropdownOption(options[0]))
    if (isComplex) {
      return options.filter(isDropdownOption).map(o => ({
        value: o.value,
        label:
          showOptionDetails && o.attribute1 ? (
            <div>
              <div style={styles.optionDetails.value}>{o.value}</div>
              <div style={styles.optionDetails.attribute}>{o.attribute1}</div>
            </div>
          ) : (
            o.value
          ),
      }))
    }
    return options
      .filter((o): o is string => typeof o === 'string')
      .map(o => ({ value: o, label: o }))
  }, [
    options,
    userSpecifiedComplexOptions,
    showOptionDetails,
    styles.optionDetails,
  ])

  const handleToggle = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value]
    setSelectedValues(newSelectedValues)
    onChange?.(newSelectedValues)
  }

  const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
    setAnchorEl(null)
  }

  return (
    <div style={styles.container} className={className} {...rest}>
      <div onClick={handleOpen} ref={setAnchorEl} style={styles.chipContainer}>
        {selectedValues.length === 0 && (
          <span style={{ ...styles.placeholder, color: placeholdercolor }}>
            {label}
          </span>
        )}
        {selectedValues.map(value => (
          <Chip
            key={value}
            label={value}
            onDelete={() => handleToggle(value)}
            sacredtheme={sacredtheme}
          />
        ))}
        <ArrowDropDown style={styles.arrowIcon} />
      </div>
      <Popover open={isOpen} onClose={handleClose} anchorEl={anchorEl}>
        <div style={styles.popoverContent}>
          {unifiedOptions.map(option => (
            <div
              key={option.value}
              onClick={() => handleToggle(option.value)}
              style={styles.option}
            >
              <Checkbox
                checked={selectedValues.includes(option.value)}
                onChange={() => {}}
                sacredtheme={sacredtheme}
              />
              <div style={styles.optionLabel}>{option.label}</div>
            </div>
          ))}
        </div>
      </Popover>
    </div>
  )
}

export default MultiSelectChip
