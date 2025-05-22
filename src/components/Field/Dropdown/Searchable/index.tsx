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
  Menu,
  MenuItem,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { black, white } from '../../../../styles/palette'
import Typography from '../../../Typography'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import HistoryIcon from '@mui/icons-material/History'
import SearchIcon from '@mui/icons-material/Search'

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
      top: '2px',
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

  // Add state variables to store the original input value
  const [storedInputValue, setStoredInputValue] = useState('')
  const [tempInputValue, setTempInputValue] = useState('')

  // Add state for menu anchor
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)

  // Determine whether to use dialog or menu
  const menuOpen = Boolean(menuAnchorEl)

  // Handle menu open/close
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      setMenuAnchorEl(event.currentTarget)
      // Store current input value to restore it later if needed
      setStoredInputValue(inputValue)
      // Clear temp input value to show all options
      setTempInputValue('')
      // Always disable filtering when opening the menu to show all options
      setIsFilteringEnabled(false)
      // Reset activeTab to 0 (All Options) when opening the menu
      setActiveTab(0)
    }
  }

  const handleCloseMenu = () => {
    setMenuAnchorEl(null)

    // If no new search was performed, restore the original input value
    if (tempInputValue === '' && inputValue !== storedInputValue) {
      setInputValue(storedInputValue)
    }

    // Reset the temporary input value
    setTempInputValue('')
  }

  // Handle selection from menu
  const handleMenuSelection = (option: DropdownOption) => {
    // Set the selected value
    handleChange({} as SyntheticEvent, option)
    // Close the menu
    handleCloseMenu()
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
      // Format display text based on value and available attributes
      let displayText = defaultOption.value

      // Include more comprehensive information if attributes are available
      if (
        defaultOption.attribute1 ||
        defaultOption.attribute2 ||
        defaultOption.attribute3 ||
        defaultOption.attribute4 ||
        defaultOption.attribute5 ||
        defaultOption.attribute6
      ) {
        const contactInfo = []

        // Add all available attributes to provide complete context
        if (defaultOption.attribute1) {
          contactInfo.push(`${defaultOption.attribute1}`)
        }

        if (defaultOption.attribute2) {
          contactInfo.push(`${defaultOption.attribute2}`)
        }

        if (defaultOption.attribute3) {
          contactInfo.push(`${defaultOption.attribute3}`)
        }

        if (defaultOption.attribute4) {
          contactInfo.push(`${defaultOption.attribute4}`)
        }

        if (defaultOption.attribute5) {
          contactInfo.push(`${defaultOption.attribute5}`)
        }

        if (defaultOption.attribute6) {
          contactInfo.push(`${defaultOption.attribute6}`)
        }

        // If we have contact info to display alongside the value
        if (contactInfo.length > 0) {
          displayText = `${defaultOption.value} (${contactInfo.join(' | ')})`
        }
      }

      setValue(defaultOption)
      setInputValue(displayText)
    }
  }, [defaultValue, options])

  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    newValue: DropdownOption | string | null
  ) => {
    // Don't enable filtering when selection is made
    // Keep filtering disabled to show all options
    setIsFilteringEnabled(false)

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
        // Format display text based on value and available attributes
        // Include more comprehensive information including attributes
        let displayText = newValue.value

        // Check if we have attributes to display in a more informative format
        if (
          newValue.attribute1 ||
          newValue.attribute2 ||
          newValue.attribute3 ||
          newValue.attribute4 ||
          newValue.attribute5 ||
          newValue.attribute6
        ) {
          // For contact-like entries, try to create a more comprehensive display
          // Include available attributes based on what's available
          // This supports formats like the address/contact example in the screenshot

          // For addresses, phone numbers, etc., we want to keep the original value visible
          // but also show additional context if available
          const contactInfo = []

          // Add all available attributes to provide complete context
          if (newValue.attribute1) {
            contactInfo.push(`${newValue.attribute1}`)
          }

          if (newValue.attribute2) {
            contactInfo.push(`${newValue.attribute2}`)
          }

          if (newValue.attribute3) {
            contactInfo.push(`${newValue.attribute3}`)
          }

          if (newValue.attribute4) {
            contactInfo.push(`${newValue.attribute4}`)
          }

          if (newValue.attribute5) {
            contactInfo.push(`${newValue.attribute5}`)
          }

          if (newValue.attribute6) {
            contactInfo.push(`${newValue.attribute6}`)
          }

          // If we have contact info to display alongside the value
          if (contactInfo.length > 0) {
            displayText = `${newValue.value} (${contactInfo.join(' | ')})`
          }
        }

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
    // Keep filtering disabled to always show all options
    setIsFilteringEnabled(false)
  }

  // Function to handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    // Set tab value
    setActiveTab(newValue)

    // Keep the dropdown open when switching tabs
    // But disable filtering to show all options
    setIsFilteringEnabled(false)
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
    const currentInputVal = inputValue.trim()

    // HISTORY TAB - only apply when variant is complex
    if (activeTab === 1 && variant === 'complex') {
      if (combinedHistory.length === 0) {
        // Return empty array - we'll handle the empty state with custom UI
        return []
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
    // Start with all base options
    const allOptions = [...filteredBaseOptions]

    // Only apply filtering if filtering is enabled and there's input text
    if (isFilteringEnabled && currentInputVal) {
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

      // Also filter out the currently selected option from filtered results
      if (value && typeof value !== 'string') {
        return filteredOpts.filter(option => option.value !== value.value)
      }
      return filteredOpts
    }

    // When not filtering, return all options except the currently selected one
    // This prevents the selected item from appearing twice (in Selected section and in options list)
    if (value && typeof value !== 'string') {
      return allOptions.filter(option => option.value !== value.value)
    }
    return allOptions
  }, [
    inputValue,
    combinedHistory,
    filteredBaseOptions,
    activeTab,
    variant,
    isFilteringEnabled,
    value, // Add value to dependencies to update when selection changes
  ])

  // Get the currently selected option if any
  const selectedOption = React.useMemo(() => {
    if (!value || typeof value === 'string') return null

    return filteredBaseOptions.find(opt => opt.value === value.value) || null
  }, [value, filteredBaseOptions])

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

        {/* Input field for the dropdown */}
        <OutlinedInput
          id={name}
          value={inputValue}
          onChange={e => {
            if (!disabled) {
              setInputValue(e.target.value)
              setTempInputValue(e.target.value)
              // Only enable filtering when typing in search box
              setIsFilteringEnabled(e.target.value.trim() !== '')
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleOpenMenu}
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
              onClick={(e: React.MouseEvent<SVGSVGElement>) => {
                // Prevent event from bubbling to parent
                e.stopPropagation()
                // Pass the event's current target as the anchor element
                if (!disabled) {
                  handleOpenMenu(e as unknown as React.MouseEvent<HTMLElement>)
                }
              }}
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

      {/* Standard Material UI Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        sx={{
          '& .MuiPaper-root': {
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
            width: menuAnchorEl?.offsetWidth
              ? `${menuAnchorEl.offsetWidth}px`
              : 'auto',
            position: 'relative', // Ensure proper positioning context for absolute elements
            display: 'flex', // Add flexbox for proper layout
            flexDirection: 'column', // Stack children vertically
            overflow: 'hidden', // Hide overflow to prevent double scrollbars
            maxHeight: '400px', // Set max height on the paper
          },
          '& .MuiMenu-list': {
            padding: 0, // Remove default padding
            paddingBottom: variant === 'complex' ? '40px' : 0, // Space for tabs
            flex: '1 1 auto', // Allow list to fill available space
            overflowY: 'auto', // Only the list should scroll
            width: '100%', // Ensure full width
            ...(activeTab === 1 &&
              combinedHistory.length === 0 && {
                overflowY: 'hidden', // Hide scrollbar when showing empty history state
                flex: 'none', // Don't flex when showing empty history
              }),
          },
        }}
        MenuListProps={{
          style: {
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        PaperProps={{
          style: {
            // Always match the width of the anchor element exactly
            width: menuAnchorEl?.offsetWidth
              ? `${menuAnchorEl.offsetWidth}px`
              : 'auto',
            minWidth: 'auto', // Override any min-width
            maxWidth: 'none', // Override any max-width constraints
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {/* Selected item display at top of menu when a value is selected */}
        {selectedOption && (
          <Box
            sx={{
              bgcolor: customColors.blue.lighter,
              borderBottom: `1px solid ${customColors.blue.light}`,
              borderLeft: `3px solid ${customColors.blue.main}`,
              p: 1.5,
              pl: 1.2,
              position: 'sticky',
              top: 0,
              zIndex: 5,
            }}
          >
            <Typography
              fontvariant="merriparagraph"
              text="Selected"
              fontcolor={customColors.blue.main}
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                mb: 0.5,
                textTransform: 'uppercase',
              }}
            />
            <Typography
              fontvariant="merriparagraph"
              text={selectedOption.value}
              fontcolor={customColors.blue.dark}
              sx={{
                fontSize: '16px',
                fontWeight: 500,
                lineHeight: '22px',
                width: '100%',
                textAlign: 'left',
              }}
            />
            {/* Display attributes for selected item */}
            {(() => {
              // First line: attribute1 and attribute2
              const firstLineAttributes = [
                selectedOption.attribute1,
                selectedOption.attribute2,
              ].filter(attr => showIdColumns || (attr && !isIdField(attr)))

              // Second line: attribute3 and attribute4
              const secondLineAttributes = [
                selectedOption.attribute3,
                selectedOption.attribute4,
              ].filter(attr => showIdColumns || (attr && !isIdField(attr)))

              return (
                <>
                  {firstLineAttributes.length > 0 && (
                    <Typography
                      fontvariant="merriparagraph"
                      text={firstLineAttributes.join(' | ')}
                      fontcolor="rgba(0, 0, 0, 0.6)"
                      sx={{
                        fontSize: '14px',
                        lineHeight: '18px',
                        width: '100%',
                        textAlign: 'left',
                      }}
                    />
                  )}

                  {secondLineAttributes.length > 0 && (
                    <Typography
                      fontvariant="merriparagraph"
                      text={secondLineAttributes.join(' | ')}
                      fontcolor="rgba(0, 0, 0, 0.6)"
                      sx={{
                        fontSize: '14px',
                        lineHeight: '18px',
                        width: '100%',
                        textAlign: 'left',
                        mt: 0.5,
                      }}
                    />
                  )}
                </>
              )
            })()}
          </Box>
        )}

        {/* Menu items - without nested scrollable container */}
        {displayOptions.map(option => {
          const isHistoryItem = option.uniqueKey?.startsWith('history-')
          const isCurrentInput = option.uniqueKey?.startsWith('current-')
          // Don't highlight selected items in the regular list anymore

          return (
            <MenuItem
              key={option.uniqueKey || option.value}
              onClick={() => handleMenuSelection(option)}
              sx={{
                py: 1,
                px: 2,
                borderBottom: '1px solid #f0f0f0',
                '&:hover': {
                  backgroundColor: customColors.skyBlue.light,
                },
              }}
            >
              <Box sx={{ width: '100%' }}>
                {/* Main value text */}
                <Typography
                  fontvariant="merriparagraph"
                  text={
                    isCurrentInput
                      ? `Search: "${option.value}"`
                      : isHistoryItem
                        ? `History: ${option.value}`
                        : option.value
                  }
                  fontcolor={customColors.blue.dark}
                  sx={{
                    fontSize: '16px',
                    fontWeight: isCurrentInput ? '500' : 'normal',
                    lineHeight: '22px',
                    width: '100%',
                    textAlign: 'left',
                  }}
                />

                {/* Display attribute1 and attribute2 side by side */}
                {!isHistoryItem &&
                  !isCurrentInput &&
                  (() => {
                    // First line: attribute1 and attribute2
                    const firstLineAttributes = [
                      option.attribute1,
                      option.attribute2,
                    ].filter(
                      attr => showIdColumns || (attr && !isIdField(attr))
                    )

                    // Second line: attribute3 and attribute4
                    const secondLineAttributes = [
                      option.attribute3,
                      option.attribute4,
                    ].filter(
                      attr => showIdColumns || (attr && !isIdField(attr))
                    )

                    // Third line: attribute5 and attribute6
                    const thirdLineAttributes = [
                      option.attribute5,
                      option.attribute6,
                    ].filter(
                      attr => showIdColumns || (attr && !isIdField(attr))
                    )

                    return (
                      <>
                        {firstLineAttributes.length > 0 && (
                          <Typography
                            fontvariant="merriparagraph"
                            text={firstLineAttributes.join(' | ')}
                            fontcolor="rgba(0, 0, 0, 0.6)"
                            sx={{
                              fontSize: '14px',
                              lineHeight: '18px',
                              width: '100%',
                              textAlign: 'left',
                            }}
                          />
                        )}

                        {secondLineAttributes.length > 0 && (
                          <Typography
                            fontvariant="merriparagraph"
                            text={secondLineAttributes.join(' | ')}
                            fontcolor="rgba(0, 0, 0, 0.6)"
                            sx={{
                              fontSize: '14px',
                              lineHeight: '18px',
                              width: '100%',
                              textAlign: 'left',
                              mt: 0.5,
                            }}
                          />
                        )}

                        {thirdLineAttributes.length > 0 && (
                          <Typography
                            fontvariant="merriparagraph"
                            text={thirdLineAttributes.join(' | ')}
                            fontcolor="rgba(0, 0, 0, 0.6)"
                            sx={{
                              fontSize: '14px',
                              lineHeight: '18px',
                              width: '100%',
                              textAlign: 'left',
                              mt: 0.5,
                            }}
                          />
                        )}
                      </>
                    )
                  })()}
              </Box>
            </MenuItem>
          )
        })}

        {/* No results message - only show when not on history tab or when history tab has items */}
        {displayOptions.length === 0 &&
          !(activeTab === 1 && combinedHistory.length === 0) && (
            <MenuItem disabled>
              <Typography
                fontvariant="merriparagraph"
                text="No matching options found"
                fontcolor="rgba(0, 0, 0, 0.6)"
              />
            </MenuItem>
          )}

        {/* Custom empty history state */}
        {activeTab === 1 && combinedHistory.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 16px',
              paddingBottom: '24px',
              textAlign: 'center',
              height: '300px', // Fixed height to match screenshot
              overflow: 'hidden', // Prevent scrolling
            }}
          >
            <HistoryIcon
              sx={{
                fontSize: '64px',
                color: 'rgba(0, 0, 0, 0.2)',
                mb: 2,
                opacity: 0.5,
              }}
            />
            <Typography
              fontvariant="merriparagraph"
              text="No search history"
              fontcolor={customColors.blue.main}
              sx={{
                fontSize: '16px',
                fontWeight: 500,
                mb: 1,
              }}
            />
            <Typography
              fontvariant="merriparagraph"
              text="Items you search for will appear here"
              fontcolor="rgba(0, 0, 0, 0.6)"
              sx={{
                fontSize: '14px',
                maxWidth: '240px',
                lineHeight: 1.4,
              }}
            />
          </Box>
        )}

        {/* Tabs for complex variant at the bottom of the menu - fixed position */}
        {variant === 'complex' && (
          <Box
            sx={{
              position: 'sticky', // Use sticky positioning
              bottom: 0,
              left: 0,
              right: 0,
              borderTop: `1px solid rgba(0, 0, 0, 0.1)`,
              bgcolor: white.main,
              zIndex: 9999, // Use very high z-index
              height: '40px',
              boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.08)',
              width: '100%', // Full width
              marginTop: 'auto', // Push to the bottom when content is short
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              centered
              variant="fullWidth"
              sx={{
                minHeight: '40px',
                height: '40px',
                '& .MuiTabs-indicator': {
                  backgroundColor: customColors.blue.main,
                  height: '3px',
                  borderRadius: '3px 3px 0 0',
                },
                '& .MuiTab-root': {
                  minHeight: '40px',
                  height: '40px',
                  padding: '8px',
                  fontWeight: 500,
                  textTransform: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    color: customColors.blue.main,
                  },
                },
              }}
            >
              <Tab
                icon={<SearchIcon fontSize="small" />}
                label="All Options"
                iconPosition="start"
                sx={{
                  color:
                    activeTab === 0
                      ? customColors.blue.main
                      : 'rgba(0, 0, 0, 0.6)',
                  fontSize: '13px',
                  fontWeight: activeTab === 0 ? 600 : 400,
                  '&.Mui-selected': {
                    color: customColors.blue.main,
                  },
                }}
              />
              <Tab
                icon={<HistoryIcon fontSize="small" />}
                label="History"
                iconPosition="start"
                sx={{
                  color:
                    activeTab === 1
                      ? customColors.blue.main
                      : 'rgba(0, 0, 0, 0.6)',
                  fontSize: '13px',
                  fontWeight: activeTab === 1 ? 600 : 400,
                  '&.Mui-selected': {
                    color: customColors.blue.main,
                  },
                }}
              />
            </Tabs>
          </Box>
        )}
      </Menu>
    </>
  )
}

export default SearchableDropdown
