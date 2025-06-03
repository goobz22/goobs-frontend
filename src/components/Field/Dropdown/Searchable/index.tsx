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
  keyframes,
  alpha,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { black, white } from '../../../../styles/palette'
import Typography from '../../../Typography'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import HistoryIcon from '@mui/icons-material/History'
import SearchIcon from '@mui/icons-material/Search'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

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

// Sacred theming constants and animations
const SACRED_GLYPHS = [
  '𓁟',
  '𓂀',
  '𓃀',
  '𓄿',
  '𓊖',
  '𓊗',
  '𓋴',
  '𓏏',
  '𓊨',
  '𓁦',
  '𓅓',
  '𓆄',
  '𓇳',
  '𓈖',
  '𓊹',
  '𓊺',
  '𓊻',
  '𓋹',
  '𓌻',
  '𓍿',
  '𓅨',
  '𓂋',
  '𓏭',
  '𓊵',
]

const sacredGlowPulse = keyframes`
  0% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3); }
  50% { text-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.5); }
  100% { text-shadow: 0 0 5px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3); }
`

const sacredFloat = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0px); }
`

const sacredShimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const rotateGlyph = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

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
  // NEW: Sacred theme support
  sacredTheme?: boolean
  sacredTitle?: string
  sacredSubtitle?: string
}

const StyledFormControl = styled(FormControl)<{ width?: string }>(
  ({ width }) => ({
    width: width || '100%',
    marginTop: '15px',
    height: 'auto',
    overflow: 'visible',
  })
)

const StyledInputLabel = styled(InputLabel, {
  shouldForwardProp: prop =>
    prop !== 'shrunkfontcolor' &&
    prop !== 'unshrunkfontcolor' &&
    prop !== 'shrunklabelposition' &&
    prop !== 'sacredtheme',
})<{
  shrunkfontcolor?: string
  unshrunkfontcolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  disabled?: boolean
  sacredtheme?: boolean
}>(
  ({
    shrunkfontcolor,
    unshrunkfontcolor,
    shrunklabelposition,
    disabled,
    sacredtheme,
  }) => ({
    color: disabled
      ? 'rgba(0, 0, 0, 0.38)'
      : sacredtheme
        ? alpha('#FFD700', 0.8)
        : unshrunkfontcolor || black.main,
    transition: 'all 0.3s ease',
    ...(sacredtheme && {
      textShadow: '0 0 6px rgba(255, 215, 0, 0.3)',
      fontWeight: 500,
      letterSpacing: '0.5px',
    }),
    '&.Mui-focused': {
      color: disabled
        ? 'rgba(0, 0, 0, 0.38)'
        : sacredtheme
          ? '#FFD700'
          : shrunkfontcolor || black.main,
      ...(sacredtheme && {
        textShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
      }),
    },
    '&.MuiInputLabel-shrink': {
      color: disabled
        ? 'rgba(0, 0, 0, 0.38)'
        : sacredtheme
          ? '#FFD700'
          : shrunkfontcolor || black.main,
      ...(sacredtheme && {
        textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
        fontWeight: 600,
      }),
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
  })
)

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
  sacredTheme = false,
  sacredTitle = '',
  sacredSubtitle = '',
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
          sacredtheme={sacredTheme}
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
          placeholder={sacredTheme ? 'Seek divine wisdom...' : placeholder}
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
                color: disabled
                  ? 'rgba(0, 0, 0, 0.38)'
                  : sacredTheme
                    ? '#FFD700'
                    : black.main,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                ...(sacredTheme && {
                  '&:hover': {
                    color: '#FFD700',
                    filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))',
                    transform: 'scale(1.1)',
                  },
                }),
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
              ? 'rgba(0, 0, 0, 0.12) !important'
              : sacredTheme
                ? `${alpha('#000000', 0.8)} !important`
                : `${backgroundcolor || white.main} !important`,
            borderRadius: '4px',
            color: disabled
              ? 'rgba(0, 0, 0, 0.38)'
              : sacredTheme
                ? '#FFD700'
                : fontcolor || black.main,
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            ...(sacredTheme && {
              backgroundImage: `
                linear-gradient(rgba(255, 215, 0, 0.05), rgba(255, 215, 0, 0.05)),
                radial-gradient(circle at top right, rgba(255, 215, 0, 0.08) 0%, transparent 50%)
              `,
              '&::before': {
                content: '"𓊹"',
                position: 'absolute',
                top: '50%',
                right: '45px',
                transform: 'translateY(-50%)',
                color: alpha('#FFD700', 0.3),
                fontSize: '14px',
                pointerEvents: 'none',
                zIndex: 1,
                animation: `${rotateGlyph} 20s linear infinite`,
              },
            }),
            '& fieldset': {
              borderColor: disabled
                ? 'rgba(0, 0, 0, 0.26)'
                : sacredTheme
                  ? '#FFD700'
                  : outlinecolor || black.main,
              ...(sacredTheme && {
                borderWidth: '2px',
                boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)',
              }),
              ...(shrunklabelposition === 'aboveNotch' && {
                legend: {
                  width: '0px !important',
                },
              }),
            },
            '&:hover fieldset': {
              borderColor: disabled
                ? 'rgba(0, 0, 0, 0.26)'
                : sacredTheme
                  ? '#FFD700'
                  : outlinecolor || black.main,
              ...(sacredTheme && {
                boxShadow: '0 0 15px rgba(255, 215, 0, 0.4)',
              }),
            },
            '&.Mui-focused fieldset': {
              borderColor: disabled
                ? 'rgba(0, 0, 0, 0.26)'
                : sacredTheme
                  ? '#FFD700'
                  : outlinecolor || black.main,
              ...(sacredTheme && {
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
                animation: `${sacredGlowPulse} 2s ease-in-out infinite`,
              }),
            },
            '& input': {
              backgroundColor: 'transparent !important',
              color: disabled
                ? 'rgba(0, 0, 0, 0.38)'
                : sacredTheme
                  ? '#FFD700'
                  : inputfontcolor || fontcolor || black.main,
              zIndex: 2,
              '&::placeholder': {
                color: disabled
                  ? 'rgba(0, 0, 0, 0.38)'
                  : sacredTheme
                    ? alpha('#FFD700', 0.7)
                    : placeholdercolor || 'rgba(0, 0, 0, 0.54)',
                opacity: 1,
                fontStyle: sacredTheme ? 'italic' : 'normal',
                letterSpacing: sacredTheme ? '0.5px' : 'normal',
              },
              cursor: disabled ? 'not-allowed' : 'pointer',
              ...(sacredTheme && {
                textShadow: '0 0 8px rgba(255, 215, 0, 0.3)',
                fontWeight: 500,
              }),
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
            boxShadow: sacredTheme
              ? '0px 10px 30px rgba(255, 215, 0, 0.3), 0px 0px 20px rgba(0, 0, 0, 0.8)'
              : '0px 5px 15px rgba(0, 0, 0, 0.2)',
            width: menuAnchorEl?.offsetWidth
              ? `${menuAnchorEl.offsetWidth}px`
              : 'auto',
            maxWidth: menuAnchorEl?.offsetWidth
              ? `${menuAnchorEl.offsetWidth}px`
              : 'auto',
            minWidth: menuAnchorEl?.offsetWidth
              ? `${menuAnchorEl.offsetWidth}px`
              : 'auto',
            maxHeight: '400px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: sacredTheme ? '#0a0a0a' : 'white',
            ...(sacredTheme && {
              backgroundImage: `
                linear-gradient(rgba(255, 215, 0, 0.03), rgba(255, 215, 0, 0.03)),
                radial-gradient(circle at top center, rgba(255, 215, 0, 0.1) 0%, transparent 70%)
              `,
              border: `2px solid ${alpha('#FFD700', 0.4)}`,
              borderRadius: '8px',
              '&::before': {
                content: `"${SACRED_GLYPHS[0]}"`,
                position: 'absolute',
                top: '8px',
                right: '8px',
                color: alpha('#FFD700', 0.3),
                fontSize: '12px',
                animation: `${rotateGlyph} 15s linear infinite`,
                zIndex: 1,
              },
            }),
          },
          '& .MuiMenu-list': {
            padding: 0,
            paddingBottom: variant === 'complex' ? '40px' : 0,
            maxHeight: variant === 'complex' ? '360px' : '400px', // Account for tabs height
            overflowY: 'auto',
            overflowX: 'hidden',
            width: '100%',
            flexShrink: 0, // Prevent shrinking
            ...(sacredTheme && {
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255, 215, 0, 0.6)',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.8)',
                },
              },
            }),
            ...(activeTab === 1 &&
              combinedHistory.length === 0 && {
                overflowY: 'hidden',
                maxHeight: '360px',
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
              background: sacredTheme
                ? `linear-gradient(135deg, ${alpha('#FFD700', 0.15)} 0%, ${alpha('#000000', 0.9)} 100%)`
                : `linear-gradient(135deg, ${customColors.blue.lighter} 0%, rgba(187, 222, 251, 0.7) 100%)`,
              borderBottom: sacredTheme
                ? `2px solid ${alpha('#FFD700', 0.4)}`
                : `2px solid ${customColors.blue.light}`,
              borderRadius: '8px 8px 0 0',
              p: 2,
              position: 'sticky',
              top: 0,
              zIndex: 5,
              boxShadow: sacredTheme
                ? '0 2px 12px rgba(255, 215, 0, 0.3), inset 0 0 20px rgba(255, 215, 0, 0.05)'
                : '0 2px 8px rgba(25, 118, 210, 0.15)',
              ...(sacredTheme && {
                backgroundImage: `
                  radial-gradient(circle at top left, rgba(255, 215, 0, 0.1) 0%, transparent 50%)
                `,
                '&::before': {
                  content: '"𓊹"',
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  color: alpha('#FFD700', 0.4),
                  fontSize: '16px',
                  animation: `${rotateGlyph} 12s linear infinite`,
                },
              }),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <CheckCircleIcon
                sx={{
                  color: sacredTheme ? '#FFD700' : customColors.blue.main,
                  fontSize: '20px',
                  mt: 0.2,
                  flexShrink: 0,
                  ...(sacredTheme && {
                    filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))',
                    animation: `${sacredFloat} 2s ease-in-out infinite`,
                  }),
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  fontvariant="merriparagraph"
                  text={selectedOption.value}
                  fontcolor={sacredTheme ? '#FFD700' : customColors.blue.dark}
                  sx={{
                    fontSize: '16px',
                    fontWeight: 600,
                    lineHeight: '22px',
                    width: '100%',
                    textAlign: 'left',
                    mb: 0.5,
                    ...(sacredTheme && {
                      textShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
                      letterSpacing: '0.8px',
                    }),
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
                          fontcolor={
                            sacredTheme
                              ? alpha('#FFD700', 0.8)
                              : 'rgba(25, 118, 210, 0.8)'
                          }
                          sx={{
                            fontSize: '13px',
                            lineHeight: '18px',
                            width: '100%',
                            textAlign: 'left',
                            fontWeight: 500,
                            ...(sacredTheme && {
                              fontStyle: 'italic',
                              letterSpacing: '0.4px',
                            }),
                          }}
                        />
                      )}

                      {secondLineAttributes.length > 0 && (
                        <Typography
                          fontvariant="merriparagraph"
                          text={secondLineAttributes.join(' | ')}
                          fontcolor={
                            sacredTheme
                              ? alpha('#FFD700', 0.7)
                              : 'rgba(25, 118, 210, 0.7)'
                          }
                          sx={{
                            fontSize: '13px',
                            lineHeight: '18px',
                            width: '100%',
                            textAlign: 'left',
                            mt: 0.25,
                            fontWeight: 400,
                            ...(sacredTheme && {
                              fontStyle: 'italic',
                              letterSpacing: '0.3px',
                            }),
                          }}
                        />
                      )}
                    </>
                  )
                })()}
              </Box>
            </Box>
            {/* Sacred decorative elements */}
            {sacredTheme && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  gap: 0.5,
                }}
              >
                {['𓂀', '𓊖', '𓂀'].map((glyph, i) => (
                  <Box
                    key={i}
                    sx={{
                      color: alpha('#FFD700', 0.3),
                      fontSize: 8,
                      animation: `${sacredFloat} ${2 + i * 0.3}s ease-in-out infinite`,
                    }}
                  >
                    {glyph}
                  </Box>
                ))}
              </Box>
            )}
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
                borderBottom: sacredTheme
                  ? `1px solid ${alpha('#FFD700', 0.2)}`
                  : '1px solid #f0f0f0',
                backgroundColor: sacredTheme ? 'transparent' : 'white',
                color: sacredTheme ? alpha('#FFD700', 0.9) : 'inherit',
                position: 'relative',
                transition: 'all 0.3s ease',
                ...(sacredTheme && {
                  '&::before': {
                    content: `"${SACRED_GLYPHS[Math.floor(Math.random() * SACRED_GLYPHS.length)]}"`,
                    position: 'absolute',
                    left: '4px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    opacity: 0,
                    transition: 'all 0.3s ease',
                    color: '#FFD700',
                    fontSize: '12px',
                    animation: `${sacredFloat} 3s ease-in-out infinite`,
                  },
                }),
                '&:hover': {
                  backgroundColor: sacredTheme
                    ? alpha('#FFD700', 0.1)
                    : customColors.skyBlue.light,
                  ...(sacredTheme && {
                    color: '#FFD700',
                    textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
                    transform: 'translateX(8px)',
                    '&::before': {
                      opacity: 1,
                      transform: 'translateY(-50%) translateX(-2px) scale(1.2)',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent)',
                      backgroundSize: '200% 100%',
                      animation: `${sacredShimmer} 1.5s ease-in-out`,
                      pointerEvents: 'none',
                    },
                  }),
                },
              }}
            >
              <Box sx={{ width: '100%', pl: sacredTheme ? 2 : 0 }}>
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
                  fontcolor={
                    sacredTheme ? alpha('#FFD700', 0.9) : customColors.blue.dark
                  }
                  sx={{
                    fontSize: '16px',
                    fontWeight: isCurrentInput ? '500' : 'normal',
                    lineHeight: '22px',
                    width: '100%',
                    textAlign: 'left',
                    ...(sacredTheme && {
                      letterSpacing: '0.5px',
                      fontWeight: 500,
                    }),
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
                            fontcolor={
                              sacredTheme
                                ? alpha('#FFD700', 0.7)
                                : 'rgba(0, 0, 0, 0.6)'
                            }
                            sx={{
                              fontSize: '14px',
                              lineHeight: '18px',
                              width: '100%',
                              textAlign: 'left',
                              ...(sacredTheme && {
                                fontStyle: 'italic',
                                letterSpacing: '0.3px',
                              }),
                            }}
                          />
                        )}

                        {secondLineAttributes.length > 0 && (
                          <Typography
                            fontvariant="merriparagraph"
                            text={secondLineAttributes.join(' | ')}
                            fontcolor={
                              sacredTheme
                                ? alpha('#FFD700', 0.6)
                                : 'rgba(0, 0, 0, 0.6)'
                            }
                            sx={{
                              fontSize: '14px',
                              lineHeight: '18px',
                              width: '100%',
                              textAlign: 'left',
                              mt: 0.5,
                              ...(sacredTheme && {
                                fontStyle: 'italic',
                                letterSpacing: '0.3px',
                              }),
                            }}
                          />
                        )}

                        {thirdLineAttributes.length > 0 && (
                          <Typography
                            fontvariant="merriparagraph"
                            text={thirdLineAttributes.join(' | ')}
                            fontcolor={
                              sacredTheme
                                ? alpha('#FFD700', 0.5)
                                : 'rgba(0, 0, 0, 0.6)'
                            }
                            sx={{
                              fontSize: '14px',
                              lineHeight: '18px',
                              width: '100%',
                              textAlign: 'left',
                              mt: 0.5,
                              ...(sacredTheme && {
                                fontStyle: 'italic',
                                letterSpacing: '0.3px',
                              }),
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
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 2,
                  ...(sacredTheme && {
                    backgroundImage: `
                    radial-gradient(circle at center, rgba(255, 215, 0, 0.03) 0%, transparent 70%)
                  `,
                  }),
                }}
              >
                {sacredTheme && (
                  <Box
                    sx={{
                      mr: 1,
                      color: alpha('#FFD700', 0.5),
                      fontSize: '16px',
                    }}
                  >
                    𓊗
                  </Box>
                )}
                <Typography
                  fontvariant="merriparagraph"
                  text="No matching options found"
                  fontcolor={
                    sacredTheme ? alpha('#FFD700', 0.7) : 'rgba(0, 0, 0, 0.6)'
                  }
                  sx={{
                    ...(sacredTheme && {
                      fontStyle: 'italic',
                      letterSpacing: '0.5px',
                      textShadow: '0 0 6px rgba(255, 215, 0, 0.3)',
                    }),
                  }}
                />
                {sacredTheme && (
                  <Box
                    sx={{
                      ml: 1,
                      color: alpha('#FFD700', 0.5),
                      fontSize: '16px',
                    }}
                  >
                    𓊗
                  </Box>
                )}
              </Box>
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
              backgroundColor: sacredTheme ? 'transparent' : 'white',
              ...(sacredTheme && {
                backgroundImage: `
                  radial-gradient(circle at center, rgba(255, 215, 0, 0.05) 0%, transparent 70%)
                `,
              }),
            }}
          >
            <HistoryIcon
              sx={{
                fontSize: '64px',
                color: sacredTheme
                  ? alpha('#FFD700', 0.4)
                  : 'rgba(0, 0, 0, 0.2)',
                mb: 2,
                opacity: 0.5,
                ...(sacredTheme && {
                  filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.3))',
                  animation: `${sacredFloat} 4s ease-in-out infinite`,
                }),
              }}
            />
            <Typography
              fontvariant="merriparagraph"
              text={sacredTitle || 'No search history'}
              fontcolor={sacredTheme ? '#FFD700' : customColors.blue.main}
              sx={{
                fontSize: '16px',
                fontWeight: 500,
                mb: 1,
                ...(sacredTheme && {
                  textShadow: '0 0 8px rgba(255, 215, 0, 0.5)',
                  letterSpacing: '1px',
                }),
              }}
            />
            <Typography
              fontvariant="merriparagraph"
              text={sacredSubtitle || 'Items you search for will appear here'}
              fontcolor={
                sacredTheme ? alpha('#FFD700', 0.7) : 'rgba(0, 0, 0, 0.6)'
              }
              sx={{
                fontSize: '14px',
                maxWidth: '240px',
                lineHeight: 1.4,
                ...(sacredTheme && {
                  fontStyle: 'italic',
                  letterSpacing: '0.5px',
                }),
              }}
            />
            {/* Sacred decorative glyphs */}
            {sacredTheme && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1,
                  mt: 2,
                }}
              >
                {['𓅨', '𓂋', '𓏭'].map((glyph, i) => (
                  <Box
                    key={i}
                    sx={{
                      color: alpha('#FFD700', 0.4),
                      fontSize: 14,
                      animation: `${sacredFloat} ${3 + i * 0.5}s ease-in-out infinite`,
                    }}
                  >
                    {glyph}
                  </Box>
                ))}
              </Box>
            )}
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
              borderTop: sacredTheme
                ? `1px solid ${alpha('#FFD700', 0.3)}`
                : `1px solid rgba(0, 0, 0, 0.1)`,
              bgcolor: sacredTheme ? '#0a0a0a' : white.main,
              zIndex: 9999, // Use very high z-index
              height: '40px',
              boxShadow: sacredTheme
                ? '0px -2px 8px rgba(255, 215, 0, 0.2)'
                : '0px -2px 8px rgba(0, 0, 0, 0.08)',
              width: '100%', // Full width
              marginTop: 'auto', // Push to the bottom when content is short
              ...(sacredTheme && {
                backgroundImage: `
                  linear-gradient(rgba(255, 215, 0, 0.02), rgba(255, 215, 0, 0.02))
                `,
              }),
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
                  backgroundColor: sacredTheme
                    ? '#FFD700'
                    : customColors.blue.main,
                  height: '3px',
                  borderRadius: '3px 3px 0 0',
                  ...(sacredTheme && {
                    boxShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
                  }),
                },
                '& .MuiTab-root': {
                  minHeight: '40px',
                  height: '40px',
                  padding: '8px',
                  fontWeight: 500,
                  textTransform: 'none',
                  transition: 'all 0.2s ease',
                  color: sacredTheme
                    ? alpha('#FFD700', 0.7)
                    : 'rgba(0, 0, 0, 0.6)',
                  '&:hover': {
                    backgroundColor: sacredTheme
                      ? alpha('#FFD700', 0.1)
                      : 'rgba(25, 118, 210, 0.04)',
                    color: sacredTheme ? '#FFD700' : customColors.blue.main,
                    ...(sacredTheme && {
                      textShadow: '0 0 6px rgba(255, 215, 0, 0.5)',
                    }),
                  },
                  '&.Mui-selected': {
                    color: sacredTheme ? '#FFD700' : customColors.blue.main,
                    ...(sacredTheme && {
                      textShadow: '0 0 8px rgba(255, 215, 0, 0.7)',
                      fontWeight: 600,
                    }),
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
                      ? sacredTheme
                        ? '#FFD700'
                        : customColors.blue.main
                      : sacredTheme
                        ? alpha('#FFD700', 0.6)
                        : 'rgba(0, 0, 0, 0.6)',
                  fontSize: '13px',
                  fontWeight: activeTab === 0 ? 600 : 400,
                  '&.Mui-selected': {
                    color: sacredTheme ? '#FFD700' : customColors.blue.main,
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
                      ? sacredTheme
                        ? '#FFD700'
                        : customColors.blue.main
                      : sacredTheme
                        ? alpha('#FFD700', 0.6)
                        : 'rgba(0, 0, 0, 0.6)',
                  fontSize: '13px',
                  fontWeight: activeTab === 1 ? 600 : 400,
                  '&.Mui-selected': {
                    color: sacredTheme ? '#FFD700' : customColors.blue.main,
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
