'use client'

import React, { useState, useEffect, SyntheticEvent } from 'react'
import {
  InputLabel,
  OutlinedInput,
  FormHelperText,
  FormControl,
  Box,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { black, white } from '../../../../styles/palette'
import Typography from '../../../Typography'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import HistoryIcon from '@mui/icons-material/History'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import Searchbar from '../../Search'

// Define custom colors since palette doesn't have them
const customColors = {
  blue: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    lighter: '#bbdefb',
  },
  skyBlue: {
    main: '#03a9f4',
    light: '#e1f5fe',
    lighter: '#f0f8ff',
  },
}

// Define a history item type with timestamp
interface HistoryItem {
  text: string
  timestamp: Date
  // Optional formatted date string for display
  formattedDate?: string
}

export interface DropdownOption {
  value: string
  attribute1?: string
  attribute2?: string
  attribute3?: string // New attribute for complex variant
  attribute4?: string // New attribute for complex variant
  attribute5?: string // Additional attribute for complex variant
  attribute6?: string // Additional attribute for complex variant
  uniqueKey?: string // Add uniqueKey for React key usage
}

export interface SearchableDropdownProps {
  label: string
  options: DropdownOption[]
  defaultValue?: string
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  inputfontcolor?: string
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  placeholdercolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  onChange?: (value: DropdownOption | null) => void
  error?: boolean
  helperText?: string
  name?: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
  width?: string
  style?: React.CSSProperties
  variant?: 'simple' | 'complex'
  // Update search history type to support timestamps
  searchHistory?: HistoryItem[] | string[]
  onSearch?: (searchTerm: string, timestamp?: Date) => void
  maxHistoryItems?: number
  // Controls whether ID columns (containing 'id' or '_id') are visible by default
  showIdColumns?: boolean
}

const StyledFormControl = styled(FormControl)<{ width?: string }>(
  ({ width }) => ({
    width: width || '100%',
    marginTop: '15px',
    height: 'auto',
    overflow: 'visible',
  })
)

const StyledInputLabel = styled(InputLabel)<{
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  disabled?: boolean
}>(({ shrunkfontcolor, unshrunkfontcolor, shrunklabelposition, disabled }) => ({
  color: disabled ? 'rgba(0, 0, 0, 0.38)' : unshrunkfontcolor || black.main,
  '&.Mui-focused': {
    color: disabled ? 'rgba(0, 0, 0, 0.38)' : shrunkfontcolor || black.main,
  },
  '&.MuiInputLabel-shrink': {
    color: disabled ? 'rgba(0, 0, 0, 0.38)' : shrunkfontcolor || black.main,
    ...(shrunklabelposition === 'aboveNotch' && {
      top: '-8px',
      left: '-14px',
    }),
    ...(shrunklabelposition === 'onNotch' && {
      top: '2.5px',
      left: '0px',
    }),
  },
  '&:not(.MuiInputLabel-shrink)': {
    transform: 'scale(1)',
    transformOrigin: 'top left',
    top: '10px',
    left: '12px',
  },
}))

const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    margin: 0,
    width: '100%',
    maxWidth: '100%',
    height: '100%',
    maxHeight: '100%',
    borderRadius: 0,
    backgroundColor: customColors.skyBlue.lighter, // Light blue background
  },
}))

const StyledDialogTitle = styled(DialogTitle)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  borderBottom: `1px solid ${customColors.blue.light}`,
  backgroundColor: customColors.blue.main, // Blue header
  color: white.main,
}))

const StyledDialogContent = styled(DialogContent)(() => ({
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  backgroundColor: customColors.skyBlue.lighter, // Light blue background
}))

const StyledFormHelperText = styled(FormHelperText)({
  marginLeft: '14px',
})

// Create a utility function to check if a field is an ID field
const isIdField = (fieldName: string): boolean => {
  if (!fieldName) return false

  // Check if it's a common ID field name
  if (fieldName.toLowerCase() === 'id' || fieldName.toLowerCase() === '_id') {
    return true
  }

  // Check if it contains "id" or "_id" as a standalone word or suffix
  if (/(\b|_)id$/i.test(fieldName)) {
    return true
  }

  // Check if it looks like a MongoDB ObjectId
  if (/^[0-9a-f]{24}$/.test(fieldName)) {
    return true
  }

  return false
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  options,
  defaultValue,
  backgroundcolor,
  outlinecolor,
  fontcolor = black.main,
  inputfontcolor = black.main,
  shrunkfontcolor = black.main,
  unshrunkfontcolor = black.main,
  placeholdercolor = black.main,
  shrunklabelposition = 'onNotch',
  onChange,
  error = false,
  helperText,
  name,
  required = false,
  placeholder,
  disabled = false,
  width,
  style,
  variant = 'simple', // Default to simple variant
  searchHistory = [], // Default to empty array
  onSearch,
  maxHistoryItems = 5, // Default to showing 5 history items
  showIdColumns = false, // Default to hiding ID columns for security
}) => {
  const [value, setValue] = useState<DropdownOption | string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  // Controls whether input filtering is active
  const [isFilteringEnabled, setIsFilteringEnabled] = useState(true)
  // Update local history state to support timestamps
  const [localHistory, setLocalHistory] = useState<HistoryItem[]>([])

  // Add state for active tab - 0 for All Options, 1 for History
  const [activeTab, setActiveTab] = useState<number>(0)

  // Use ref to track if we've done initial history setup to avoid loops
  const initializedRef = React.useRef(false)

  // Replace open/onOpen/onClose logic with dialog state
  const [dialogOpen, setDialogOpen] = useState(false)

  // Add state variables to store the original input value
  const [storedInputValue, setStoredInputValue] = useState('')
  const [tempInputValue, setTempInputValue] = useState('')

  // Handle dialog open/close
  const handleOpenDialog = () => {
    setDialogOpen(true)
    // Temporarily disable filtering when opening the dialog
    setIsFilteringEnabled(false)
    // Store current input value to restore it later if needed
    setStoredInputValue(inputValue)
    // Clear input temporarily to show all options
    setTempInputValue('')
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)

    // If no new search was performed, restore the original input value
    if (tempInputValue === '' && inputValue !== storedInputValue) {
      setInputValue(storedInputValue)
    }

    // Reset the temporary input value
    setTempInputValue('')
  }

  // Handle selection from dialog
  const handleDialogSelection = (option: DropdownOption) => {
    // Set the selected value
    handleChange({} as SyntheticEvent, option)
    // Close the dialog
    handleCloseDialog()
  }

  // Create the list of options to show in the dialog
  const renderOptionsList = () => {
    return displayOptions.map(option => {
      // Check if this is a history item
      const isHistoryItem = option.uniqueKey?.startsWith('history-')
      const isCurrentInput = option.uniqueKey?.startsWith('current-')
      const isNoHistoryPlaceholder = option.uniqueKey === 'no-history'

      return (
        <Box
          key={option.uniqueKey || option.value}
          sx={{
            padding: variant === 'complex' ? '14px 16px' : '12px 16px',
            borderBottom: `1px solid ${customColors.blue.lighter}`,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: customColors.skyBlue.light,
            },
            '&:active': {
              backgroundColor: customColors.blue.lighter,
            },
          }}
          onClick={() => handleDialogSelection(option)}
        >
          {/* Main value - both variants */}
          <Typography
            fontvariant="merriparagraph"
            text={
              isNoHistoryPlaceholder
                ? option.value
                : isCurrentInput
                  ? `Search: "${option.value}"`
                  : isHistoryItem
                    ? `History: ${option.value.replace(/_/g, ' ')}`
                    : option.value.replace(/_/g, ' ')
            }
            fontcolor={customColors.blue.dark}
            sx={{
              fontSize: '16px',
              fontWeight: isCurrentInput
                ? '500'
                : isHistoryItem
                  ? '400'
                  : variant === 'complex'
                    ? '500'
                    : 'normal',
              fontStyle: isHistoryItem ? 'italic' : 'normal',
              lineHeight: '22px',
              width: '100%',
              textAlign: 'left',
            }}
          />

          {/* For history items, show the timestamp */}
          {isHistoryItem && option.attribute2 && (
            <Typography
              fontvariant="merriparagraph"
              text={option.attribute2}
              fontcolor="rgba(0, 0, 0, 0.6)"
              sx={{
                fontSize: '13px',
                lineHeight: '16px',
                width: '100%',
                textAlign: 'left',
                fontStyle: 'italic',
              }}
            />
          )}

          {/* For simple variant - show attribute1 and attribute2 on one line (excluding ID fields) */}
          {variant === 'simple' &&
            !isHistoryItem &&
            !isCurrentInput &&
            !isNoHistoryPlaceholder &&
            (() => {
              // Filter out ID attributes if showIdColumns is false
              const filteredAttributes = [
                option.attribute1,
                option.attribute2,
              ].filter(attr => showIdColumns || (attr && !isIdField(attr)))

              return filteredAttributes.length > 0 ? (
                <Typography
                  fontvariant="merriparagraph"
                  text={filteredAttributes.join(' | ')}
                  fontcolor="rgba(0, 0, 0, 0.6)"
                  sx={{
                    fontSize: '14px',
                    lineHeight: '18px',
                    width: '100%',
                    textAlign: 'left',
                  }}
                />
              ) : null
            })()}

          {/* For complex variant - show attributes on separate lines (excluding ID fields) */}
          {variant === 'complex' &&
            !isHistoryItem &&
            !isCurrentInput &&
            !isNoHistoryPlaceholder && (
              <>
                {/* First line of attributes */}
                {(() => {
                  const filteredAttributes = [
                    option.attribute1,
                    option.attribute2,
                  ].filter(attr => showIdColumns || (attr && !isIdField(attr)))

                  return filteredAttributes.length > 0 ? (
                    <Typography
                      fontvariant="merriparagraph"
                      text={filteredAttributes.join(' | ')}
                      fontcolor="rgba(0, 0, 0, 0.6)"
                      sx={{
                        fontSize: '14px',
                        lineHeight: '18px',
                        width: '100%',
                        textAlign: 'left',
                      }}
                    />
                  ) : null
                })()}

                {/* Second line of attributes */}
                {(() => {
                  const filteredAttributes = [
                    option.attribute3,
                    option.attribute4,
                  ].filter(attr => showIdColumns || (attr && !isIdField(attr)))

                  return filteredAttributes.length > 0 ? (
                    <Typography
                      fontvariant="merriparagraph"
                      text={filteredAttributes.join(' | ')}
                      fontcolor="rgba(0, 0, 0, 0.6)"
                      sx={{
                        fontSize: '14px',
                        lineHeight: '18px',
                        width: '100%',
                        textAlign: 'left',
                      }}
                    />
                  ) : null
                })()}

                {/* Additional attributes if needed */}
                {(() => {
                  const filteredAttributes = [
                    option.attribute5,
                    option.attribute6,
                  ].filter(attr => showIdColumns || (attr && !isIdField(attr)))

                  return filteredAttributes.length > 0 ? (
                    <Typography
                      fontvariant="merriparagraph"
                      text={filteredAttributes.join(' | ')}
                      fontcolor="rgba(0, 0, 0, 0.6)"
                      sx={{
                        fontSize: '14px',
                        lineHeight: '18px',
                        width: '100%',
                        textAlign: 'left',
                      }}
                    />
                  ) : null
                })()}
              </>
            )}
        </Box>
      )
    })
  }

  // Function to format date for display
  const formatDate = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    // If less than a minute ago
    if (diff < 60 * 1000) {
      return 'Just now'
    }

    // If less than an hour ago
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000))
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    }

    // If less than a day ago
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000))
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    }

    // If less than a week ago
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = Math.floor(diff / (24 * 60 * 60 * 1000))
      return `${days} ${days === 1 ? 'day' : 'days'} ago`
    }

    // Otherwise, format as date
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Initialize history with timestamps if using simple strings
  useEffect(() => {
    if (!initializedRef.current && searchHistory && searchHistory.length > 0) {
      // Check if searchHistory items are strings or already HistoryItems
      if (typeof searchHistory[0] === 'string') {
        const historyWithTimestamps = (searchHistory as string[]).map(
          (text, index) => {
            // Create timestamps with slight variations so older items are truly older
            const timestamp = new Date()
            timestamp.setMinutes(timestamp.getMinutes() - (index + 1))

            return {
              text,
              timestamp,
              formattedDate: formatDate(timestamp),
            }
          }
        )
        setLocalHistory(historyWithTimestamps)
      } else {
        // Already the right format, just update formatted dates
        const formattedHistory = (searchHistory as HistoryItem[]).map(item => ({
          ...item,
          formattedDate: formatDate(item.timestamp),
        }))
        setLocalHistory(formattedHistory)
      }

      initializedRef.current = true
    }
  }, [searchHistory])

  // Refresh formatted dates every minute for "minutes ago" style timestamps
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (localHistory.length > 0) {
        setLocalHistory(prev =>
          prev.map(item => ({
            ...item,
            formattedDate: formatDate(item.timestamp),
          }))
        )
      }
    }, 60000) // Update every minute

    return () => clearInterval(intervalId)
  }, [localHistory.length])

  useEffect(() => {
    const defaultOption = options.find(option => option.value === defaultValue)
    if (defaultOption) {
      const displayText =
        defaultOption.value.replace(/_/g, ' ').charAt(0).toUpperCase() +
        defaultOption.value.replace(/_/g, ' ').slice(1)
      setValue(defaultOption)
      setInputValue(displayText)
    }
  }, [defaultValue, options])

  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    newValue: DropdownOption | string | null
  ) => {
    // Reset filtering after selection is made
    setIsFilteringEnabled(true)

    if (typeof newValue === 'string') {
      setValue(newValue)
      setInputValue(newValue)
      onChange?.(null)

      // Add to search history if it's a string input
      if (newValue.trim()) {
        const now = new Date()

        if (onSearch) {
          onSearch(newValue.trim(), now)
        } else {
          // Only update local history if we're not using onSearch callback
          setLocalHistory(prev => {
            const newItem = {
              text: newValue.trim(),
              timestamp: now,
              formattedDate: formatDate(now),
            }
            const filteredPrev = prev.filter(h => h.text !== newItem.text)
            return [newItem, ...filteredPrev].slice(0, maxHistoryItems)
          })
        }
      }
    } else {
      setValue(newValue)
      if (newValue) {
        const displayText =
          newValue.value.replace(/_/g, ' ').charAt(0).toUpperCase() +
          newValue.value.replace(/_/g, ' ').slice(1)
        setInputValue(displayText)
        onChange?.(newValue)

        // Add to search history
        const now = new Date()

        if (onSearch) {
          onSearch(displayText, now)
        } else if (newValue.value.trim()) {
          // Only update local history if we're not using onSearch callback
          setLocalHistory(prev => {
            const newItem = {
              text: displayText,
              timestamp: now,
              formattedDate: formatDate(now),
            }
            const filteredPrev = prev.filter(h => h.text !== newItem.text)
            return [newItem, ...filteredPrev].slice(0, maxHistoryItems)
          })
        }
      } else {
        setInputValue('')
        onChange?.(null)
      }
    }
  }

  // Handler for when the input is submitted (e.g., Enter key)
  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      const now = new Date()

      if (onSearch) {
        onSearch(inputValue.trim(), now)
      } else {
        // Only update local history if we're not using onSearch callback
        setLocalHistory(prev => {
          const newItem = {
            text: inputValue.trim(),
            timestamp: now,
            formattedDate: formatDate(now),
          }
          const filteredPrev = prev.filter(h => h.text !== newItem.text)
          return [newItem, ...filteredPrev].slice(0, maxHistoryItems)
        })
      }
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    if (!value && !inputValue) {
      setIsFocused(false)
    }
    // Save search when blurring
    if (inputValue.trim()) {
      handleInputSubmit()
    }
    // Reset filtering when dropdown closes
    setIsFilteringEnabled(true)
  }

  // Function to handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    // Set tab value
    setActiveTab(newValue)

    // Keep the dropdown open when switching tabs
    setIsFilteringEnabled(true)
  }

  const labelId = `${name}-label`

  // Use a combined history that prioritizes prop history when available but falls back to local history
  const combinedHistory = React.useMemo(() => {
    if (searchHistory?.length) {
      // Convert string[] to HistoryItem[] if needed
      if (typeof searchHistory[0] === 'string') {
        return (searchHistory as string[]).map((text, index) => {
          // Create timestamps with slight variations
          const timestamp = new Date()
          timestamp.setMinutes(timestamp.getMinutes() - (index + 1))

          return {
            text,
            timestamp,
            formattedDate: formatDate(timestamp),
          }
        })
      }

      // Already HistoryItem[] format
      return searchHistory as HistoryItem[]
    }

    return localHistory
  }, [searchHistory, localHistory])

  // Filter out options with id values if showIdColumns is false
  const filteredBaseOptions = React.useMemo(() => {
    if (showIdColumns) {
      return options
    }
    // Hide options where the value is exactly 'id' or '_id', or looks like a database ID
    return options.filter(opt => {
      const value = opt.value.toLowerCase()
      // Check if value is an ID field or looks like an ObjectId (MongoDB ID format)
      return !(
        value === 'id' ||
        value === '_id' ||
        /^[0-9a-f]{24}$/.test(value)
      )
    })
  }, [options, showIdColumns])

  // Create a combined options array based on active tab and input value
  const getFilteredOptions = React.useCallback(() => {
    // When dialog is open and no search input, show all options with selected at top
    if (dialogOpen && !tempInputValue.trim()) {
      // Find the currently selected option if any
      const selectedOption =
        value && typeof value !== 'string'
          ? filteredBaseOptions.find(opt => opt.value === value.value)
          : null

      // If there's a selected option, put it at the top
      if (selectedOption) {
        const otherOptions = filteredBaseOptions.filter(
          opt => opt.value !== selectedOption.value
        )
        return [selectedOption, ...otherOptions]
      }

      // Otherwise just return all options
      return filteredBaseOptions
    }

    const currentInputVal = dialogOpen
      ? tempInputValue.trim()
      : inputValue.trim()

    // HISTORY TAB - only apply when variant is complex
    if (activeTab === 1 && variant === 'complex') {
      if (combinedHistory.length === 0) {
        // Show a placeholder message if no history
        return [
          {
            value: 'No search history',
            uniqueKey: 'no-history',
            attribute1: 'Try searching for something first',
          },
        ]
      }

      // Map history items to dropdown options
      return combinedHistory.map(item => {
        // Check if this history item matches any of the original options
        const matchingOption = filteredBaseOptions.find(
          opt =>
            opt.value.toLowerCase() === item.text.toLowerCase() ||
            (
              opt.value.replace(/_/g, ' ').charAt(0).toUpperCase() +
              opt.value.replace(/_/g, ' ').slice(1)
            ).toLowerCase() === item.text.toLowerCase()
        )

        if (matchingOption) {
          // If we have a matching original option, use its attributes
          return {
            value: item.text,
            uniqueKey: `history-${item.text}`,
            attribute1: 'Search History',
            attribute2: item.formattedDate || formatDate(item.timestamp),
            attribute3: matchingOption.attribute1,
            attribute4: matchingOption.attribute2,
            attribute5: matchingOption.attribute3,
            attribute6: matchingOption.attribute4,
          }
        } else {
          // Otherwise just use the basic history item with timestamp
          return {
            value: item.text,
            uniqueKey: `history-${item.text}`,
            attribute1: 'Search History',
            attribute2: item.formattedDate || formatDate(item.timestamp),
          }
        }
      })
    }

    // ALL OPTIONS TAB (activeTab === 0)
    // If filtering is disabled or input is empty, return all options
    if (!isFilteringEnabled || !currentInputVal) {
      // If dialog is open and there's a selected value, prioritize it
      if (dialogOpen && value && typeof value !== 'string') {
        const selectedOption = filteredBaseOptions.find(
          opt => opt.value === value.value
        )
        if (selectedOption) {
          const otherOptions = filteredBaseOptions.filter(
            opt => opt.value !== selectedOption.value
          )
          return [selectedOption, ...otherOptions]
        }
      }
      return filteredBaseOptions
    }

    // Filter options based on current input
    const filteredOpts = filteredBaseOptions.filter(opt =>
      opt.value.toLowerCase().includes(currentInputVal.toLowerCase())
    )

    // If no matches found, add the current input as a custom option
    if (filteredOpts.length === 0) {
      return [
        {
          value: currentInputVal,
          uniqueKey: `current-${currentInputVal}`,
          attribute1: 'Search',
        },
      ]
    }

    // Check if the input exactly matches any option
    const exactMatch = filteredOpts.some(
      opt => opt.value.toLowerCase() === currentInputVal.toLowerCase()
    )

    // If no exact match, add the current input as the first option
    if (!exactMatch) {
      return [
        {
          value: currentInputVal,
          uniqueKey: `current-${currentInputVal}`,
          attribute1: 'Search',
        },
        ...filteredOpts,
      ]
    }

    return filteredOpts
  }, [
    inputValue,
    tempInputValue,
    combinedHistory,
    filteredBaseOptions,
    activeTab,
    variant,
    isFilteringEnabled,
    dialogOpen,
    value,
  ])

  // Memoize the filtered options to prevent recreation on every render
  const filteredOptions = React.useMemo(
    () => getFilteredOptions(),
    [getFilteredOptions]
  )

  // Use filtered options in both the dialog and autocomplete
  const displayOptions = filteredOptions

  // Ensure activeTab is always 0 for simple variant
  useEffect(() => {
    if (variant === 'simple' && activeTab !== 0) {
      setActiveTab(0)
    }
  }, [variant, activeTab])

  return (
    <>
      <StyledFormControl
        error={error}
        disabled={disabled}
        width={width}
        style={style}
      >
        <StyledInputLabel
          id={labelId}
          shrink={isFocused || !!value || !!inputValue || !!placeholder}
          required={required}
          error={error}
          shrunkfontcolor={disabled ? 'rgba(0, 0, 0, 0.38)' : shrunkfontcolor}
          unshrunkfontcolor={
            disabled ? 'rgba(0, 0, 0, 0.38)' : unshrunkfontcolor
          }
          shrunklabelposition={shrunklabelposition}
          disabled={disabled}
        >
          {label}
        </StyledInputLabel>

        {/* The input field with click handler to open dialog */}
        <OutlinedInput
          id={name}
          value={inputValue}
          onChange={e => {
            if (!disabled) {
              setInputValue(e.target.value)
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleOpenDialog}
          placeholder={placeholder}
          error={error}
          required={required}
          notched={
            shrunklabelposition === 'onNotch' &&
            (isFocused || !!value || !!inputValue || !!placeholder)
          }
          label={label}
          endAdornment={
            <ArrowDropDownIcon
              sx={{
                color: disabled ? 'rgba(0, 0, 0, 0.38)' : black.main,
                cursor: 'pointer',
              }}
              onClick={handleOpenDialog}
            />
          }
          sx={{
            width: '100%',
            minHeight: '40px',
            height: '40px !important',
            backgroundColor: disabled
              ? 'rgba(0, 0, 0, 0.12)'
              : backgroundcolor || white.main,
            color: disabled ? 'rgba(0, 0, 0, 0.38)' : fontcolor || black.main,
            cursor: disabled ? 'not-allowed' : 'pointer',
            '& fieldset': {
              borderColor: disabled
                ? 'rgba(0, 0, 0, 0.26)'
                : outlinecolor || black.main,
              ...(shrunklabelposition === 'aboveNotch' && {
                legend: {
                  width: '0px !important',
                },
              }),
            },
            '&:hover fieldset': {
              borderColor: disabled
                ? 'rgba(0, 0, 0, 0.26)'
                : outlinecolor || black.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: disabled
                ? 'rgba(0, 0, 0, 0.26)'
                : outlinecolor || black.main,
            },
            '& input': {
              color: disabled
                ? 'rgba(0, 0, 0, 0.38)'
                : inputfontcolor || fontcolor || black.main,
              '&::placeholder': {
                color: disabled
                  ? 'rgba(0, 0, 0, 0.38)'
                  : placeholdercolor || 'rgba(0, 0, 0, 0.54)',
                opacity: 1,
              },
              cursor: disabled ? 'not-allowed' : 'pointer',
            },
          }}
        />

        {helperText && (
          <StyledFormHelperText error={error} disabled={disabled}>
            {helperText}
          </StyledFormHelperText>
        )}
      </StyledFormControl>

      {/* Fullscreen Dialog for option selection - moved outside FormControl */}
      <StyledDialog open={dialogOpen} onClose={handleCloseDialog} fullScreen>
        <StyledDialogTitle>
          <Typography
            fontvariant="merriparagraph"
            text={label}
            fontcolor={white.main}
            sx={{ fontSize: '18px', fontWeight: 'bold' }}
          />
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
            sx={{ color: white.main }}
          >
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>

        {/* Search input for filtering inside dialog - using Searchbar component */}
        <Box
          sx={{
            padding: '16px',
            borderBottom: `1px solid ${customColors.blue.light}`,
            backgroundColor: customColors.skyBlue.light,
          }}
        >
          <Searchbar
            placeholder="Search options..."
            value={tempInputValue}
            onChange={e => {
              setTempInputValue(e.target.value)
              setIsFilteringEnabled(true)
            }}
            backgroundcolor={white.main}
            iconcolor={customColors.blue.main}
            outlinecolor={customColors.blue.light}
            fontcolor={customColors.blue.dark}
          />
        </Box>

        {/* Tabs for complex variant */}
        {variant === 'complex' && (
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{
              borderBottom: `1px solid ${customColors.blue.light}`,
              backgroundColor: customColors.blue.light,
              '& .MuiTabs-indicator': {
                backgroundColor: white.main,
              },
            }}
          >
            <Tab
              icon={<SearchIcon fontSize="small" />}
              label="ALL OPTIONS"
              iconPosition="start"
              sx={{
                color: customColors.blue.dark,
                '&.Mui-selected': {
                  color: white.main,
                  fontWeight: 'bold',
                },
              }}
            />
            <Tab
              icon={<HistoryIcon fontSize="small" />}
              label="HISTORY"
              iconPosition="start"
              sx={{
                color: customColors.blue.dark,
                '&.Mui-selected': {
                  color: white.main,
                  fontWeight: 'bold',
                },
              }}
            />
          </Tabs>
        )}

        <StyledDialogContent>
          {/* Options List */}
          {renderOptionsList()}

          {/* No results message */}
          {displayOptions.length === 0 && (
            <Box sx={{ padding: '20px', textAlign: 'center' }}>
              <Typography
                fontvariant="merriparagraph"
                text="No matching options found"
                fontcolor="rgba(0, 0, 0, 0.6)"
              />
            </Box>
          )}
        </StyledDialogContent>
      </StyledDialog>
    </>
  )
}

export default SearchableDropdown
