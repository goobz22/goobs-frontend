'use client'

import React, { useState, useEffect, SyntheticEvent, useRef } from 'react'
import {
  Autocomplete,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  FormControl,
  Box,
  Tabs,
  Tab,
  styled as muiStyled,
  Popper,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { black, white } from '../../../../styles/palette'
import Typography from '../../../Typography'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import HistoryIcon from '@mui/icons-material/History'
import SearchIcon from '@mui/icons-material/Search'
import { unstable_useEnhancedEffect as useEnhancedEffect } from '@mui/utils'

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

interface StyledAutocompleteProps {
  backgroundcolor?: string
  outlinecolor?: string
  fontcolor?: string
  inputfontcolor?: string
  placeholdercolor?: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  disabled?: boolean
  variant?: 'simple' | 'complex'
}

// Styled tab component for the dropdown footer
const StyledTab = muiStyled(Tab)(() => ({
  minHeight: '36px',
  fontSize: '12px',
  padding: '6px 12px',
  color: black.main,
  '&.Mui-selected': {
    color: black.main,
    fontWeight: 'bold',
  },
}))

const StyledTabs = muiStyled(Tabs)(() => ({
  minHeight: '36px',
  borderTop: `1px solid ${black.light}`,
  '& .MuiTabs-indicator': {
    backgroundColor: black.main,
  },
}))

const StyledAutocomplete = styled(
  Autocomplete<DropdownOption, false, false, true>
)<StyledAutocompleteProps>(props => {
  const {
    backgroundcolor,
    outlinecolor,
    fontcolor,
    inputfontcolor,
    placeholdercolor,
    shrunklabelposition,
    disabled,
    variant,
  } = props

  return {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      width: '100%',
      overflow: 'visible',
      minHeight: '40px',
      height: '40px !important',
      backgroundColor: disabled
        ? 'rgba(0, 0, 0, 0.12)'
        : backgroundcolor || white.main,
      color: disabled ? 'rgba(0, 0, 0, 0.38)' : fontcolor || black.main,
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
      },
      cursor: disabled ? 'not-allowed' : 'text',
    },
    '& .MuiInputLabel-root': {
      color: black.main,
      '&.MuiInputLabel-shrink': {
        ...(shrunklabelposition === 'aboveNotch' && {
          transform: 'translate(0px, -17px) scale(0.75)',
        }),
        ...(shrunklabelposition === 'onNotch' && {
          transform: 'translate(13px, -4px) scale(0.75)',
        }),
      },
    },
    '& .MuiAutocomplete-input': {
      padding: '8px 14px',
    },
    // Improve dropdown menu positioning and styling
    '& .MuiAutocomplete-popper': {
      width: '100% !important',
      zIndex: 9999, // Ensure high z-index for the popup
      '& .MuiPaper-root': {
        width: '100%',
        marginTop: '4px',
        maxHeight: '300px', // Increase max height for better usability
        overflowY: 'auto',
        boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)', // Enhanced shadow
        border: `1px solid ${black.light}`, // Add border to dropdown container
      },
      '& .MuiAutocomplete-listbox': {
        padding: '0', // Remove default padding for cleaner lines
        '& .MuiAutocomplete-option': {
          padding: variant === 'complex' ? '10px 14px' : '8px 14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          '& .MuiTypography-root': {
            width: '100%',
            textAlign: 'left',
          },
          '&:last-child': {
            borderBottom: 'none', // Remove border from last item to avoid double borders
          },
        },
        '& .MuiAutocomplete-option[aria-selected="true"]': {
          backgroundColor: `${black.main}08`,
        },
        '& .MuiAutocomplete-option:hover': {
          backgroundColor: `${black.main}15`, // Slightly darker hover state
        },
      },
    },
  }
})

const StyledFormHelperText = styled(FormHelperText)({
  marginLeft: '14px',
})

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
  // Update local history state to support timestamps
  const [localHistory, setLocalHistory] = useState<HistoryItem[]>([])

  // Add state for active tab - 0 for All Options, 1 for History
  const [activeTab, setActiveTab] = useState<number>(0)

  // Use ref to track if we've done initial history setup to avoid loops
  const initializedRef = React.useRef(false)

  // Always use controlled open state
  const [isOpen, setIsOpen] = useState(false)

  // Reference to the tab container
  const tabsRef = useRef<HTMLDivElement | null>(null)

  // Ref for the input/autocomplete
  const autocompleteRef = useRef<HTMLDivElement>(null)

  // Use enhanced effect to handle tab clicks without closing dropdown
  useEnhancedEffect(() => {
    // If tabs aren't mounted yet, do nothing
    if (!tabsRef.current) return

    const tabsElement = tabsRef.current

    // Prevent any click inside the tabs from bubbling up
    const preventClose = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }

    // Add click handler to the tabs element
    tabsElement.addEventListener('mousedown', preventClose, true)
    tabsElement.addEventListener('click', preventClose, true)

    // Cleanup
    return () => {
      tabsElement.removeEventListener('mousedown', preventClose, true)
      tabsElement.removeEventListener('click', preventClose, true)
    }
  }, [tabsRef.current])

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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleInputSubmit()
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
  }

  // Function to handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    // Set tab value
    setActiveTab(newValue)

    // Keep the dropdown open when switching tabs
    setIsOpen(true)

    // Prevent any bubbling that might close the dropdown
    _event.preventDefault()
    _event.stopPropagation()
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
      return options;
    }
    // Hide options where the value is exactly 'id' or '_id', or looks like a database ID
    return options.filter(opt => {
      const value = opt.value.toLowerCase();
      // Check if value is an ID field or looks like an ObjectId (MongoDB ID format)
      return !(
        value === 'id' || 
        value === '_id' || 
        /^[0-9a-f]{24}$/.test(value)
      );
    });
  }, [options, showIdColumns]);

  // Create a combined options array based on active tab and input value
  const getFilteredOptions = React.useCallback(() => {
    const currentInputVal = inputValue.trim()

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
    // If input is empty, return all options
    if (!currentInputVal) {
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
  }, [inputValue, combinedHistory, filteredBaseOptions, activeTab, variant])

  // Create the footer component for the dropdown with tabs
  const ListboxFooter = React.forwardRef<HTMLDivElement>((_, ref) => (
    <Box
      ref={(node: HTMLDivElement | null) => {
        // Set both refs
        if (ref) {
          if (typeof ref === 'function') {
            ref(node)
          } else {
            ref.current = node
          }
        }
        tabsRef.current = node
      }}
      sx={{
        position: 'sticky',
        bottom: 0,
        backgroundColor: white.main,
        zIndex: 2,
        borderTop: `1px solid ${black.light}`,
      }}
      onClick={e => {
        e.preventDefault()
        e.stopPropagation()
      }}
      onMouseDown={e => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <StyledTabs
        value={activeTab}
        onChange={handleTabChange}
        centered
        sx={{
          pointerEvents: 'all',
        }}
      >
        <StyledTab
          icon={<SearchIcon fontSize="small" />}
          label="ALL OPTIONS"
          iconPosition="start"
          sx={{
            pointerEvents: 'all',
          }}
        />
        <StyledTab
          icon={<HistoryIcon fontSize="small" />}
          label="HISTORY"
          iconPosition="start"
          sx={{
            pointerEvents: 'all',
          }}
        />
      </StyledTabs>
    </Box>
  ))

  // Add display name to ListboxFooter
  ListboxFooter.displayName = 'ListboxFooter'

  // Custom Listbox component that adds the footer
  const CustomListbox = React.forwardRef<
    HTMLElement,
    React.HTMLAttributes<HTMLElement>
  >((props, ref) => {
    const { children, ...other } = props
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        onClick={e => {
          e.stopPropagation()
          return false
        }}
        style={{ pointerEvents: 'auto' }}
      >
        <ul {...other}>{children}</ul>
        {variant === 'complex' && <ListboxFooter />}
      </div>
    )
  })

  // Add display name to CustomListbox
  CustomListbox.displayName = 'CustomListbox'

  // Memoize the filtered options to prevent recreation on every render
  const filteredOptions = React.useMemo(
    () => getFilteredOptions(),
    [getFilteredOptions]
  )

  // Ensure activeTab is always 0 for simple variant
  useEffect(() => {
    if (variant === 'simple' && activeTab !== 0) {
      setActiveTab(0)
    }
  }, [variant, activeTab])

  return (
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
        unshrunkfontcolor={disabled ? 'rgba(0, 0, 0, 0.38)' : unshrunkfontcolor}
        shrunklabelposition={shrunklabelposition}
        disabled={disabled}
      >
        {label}
      </StyledInputLabel>
      <StyledAutocomplete
        id={name}
        options={filteredOptions}
        freeSolo
        value={value}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(_e, newInputValue) => {
          if (!disabled) {
            setInputValue(newInputValue)
          }
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        forcePopupIcon
        open={isOpen}
        onOpen={() => {
          setIsOpen(true)
        }}
        onClose={event => {
          // Don't close when clicking tabs
          if (tabsRef.current?.contains(event.target as Node)) {
            return
          }

          setIsOpen(false)
        }}
        popupIcon={
          <ArrowDropDownIcon
            sx={{ color: disabled ? 'rgba(0, 0, 0, 0.38)' : black.main }}
          />
        }
        disablePortal={false}
        ListboxProps={{
          style: {
            maxHeight: '300px',
            overflowY: 'auto',
            pointerEvents: 'all',
          },
        }}
        ListboxComponent={CustomListbox}
        componentsProps={{
          popper: {
            onClick: e => {
              // Prevent clicks in the popper from closing the dropdown
              e.stopPropagation()
            },
            style: {
              pointerEvents: 'all',
              // Ensure clicks inside the popper don't close it
              inset: '0px auto auto 0px',
              zIndex: 9999,
            },
          },
          paper: {
            onClick: e => {
              // Prevent clicks on the paper from closing the dropdown
              e.stopPropagation()
            },
            style: { pointerEvents: 'all' },
          },
        }}
        ref={autocompleteRef}
        PopperComponent={props => (
          <Popper
            {...props}
            onClick={e => {
              e.stopPropagation()
            }}
            style={{
              ...props.style,
              pointerEvents: 'all',
              zIndex: 9999,
            }}
            modifiers={[
              {
                name: 'preventOverflow',
                enabled: true,
                options: {
                  altAxis: true,
                  altBoundary: true,
                  tether: true,
                  rootBoundary: 'document',
                  padding: 8,
                },
              },
              {
                name: 'offset',
                options: {
                  offset: [0, 0],
                },
              },
            ]}
          >
            {props.children}
          </Popper>
        )}
        disabled={disabled}
        backgroundcolor={backgroundcolor}
        outlinecolor={outlinecolor}
        fontcolor={fontcolor}
        inputfontcolor={inputfontcolor}
        placeholdercolor={placeholdercolor}
        variant={variant}
        filterOptions={opts => opts} // We're handling filtering ourselves
        getOptionLabel={(option: DropdownOption | string) => {
          if (typeof option === 'string') {
            return option
          }
          return (
            option.value.replace(/_/g, ' ').charAt(0).toUpperCase() +
            option.value.replace(/_/g, ' ').slice(1)
          )
        }}
        renderOption={(
          liProps: React.HTMLAttributes<HTMLLIElement>,
          option
        ) => {
          const { key, ...restLiProps } = liProps as {
            key: string
          } & React.HTMLAttributes<HTMLLIElement>

          // Common styles for both variants
          const liStyle = {
            color: black.main,
            padding: variant === 'complex' ? '10px 14px' : '8px 14px',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'flex-start' as const,
            gap: variant === 'complex' ? '4px' : '2px',
            width: '100%',
            borderBottom: `1px solid ${black.light}`,
          }

          // Use the uniqueKey prop if available, otherwise fall back to the provided key
          const optionKey = option.uniqueKey || key

          // Check if this is a history item
          const isHistoryItem = option.uniqueKey?.startsWith('history-')
          const isCurrentInput = option.uniqueKey?.startsWith('current-')
          const isNoHistoryPlaceholder = option.uniqueKey === 'no-history'

          return (
            <li key={optionKey} {...restLiProps} style={liStyle}>
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
                fontcolor={black.main}
                sx={{
                  fontSize: '14px',
                  fontWeight: isCurrentInput
                    ? '500'
                    : isHistoryItem
                      ? '400'
                      : variant === 'complex'
                        ? '500'
                        : 'normal',
                  fontStyle: isHistoryItem ? 'italic' : 'normal',
                  lineHeight: '20px',
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
                    fontSize: '11px',
                    lineHeight: '14px',
                    width: '100%',
                    textAlign: 'left',
                    fontStyle: 'italic',
                  }}
                />
              )}

              {/* For simple variant - show attribute1 and attribute2 on one line */}
              {variant === 'simple' &&
                !isHistoryItem &&
                !isCurrentInput &&
                !isNoHistoryPlaceholder &&
                (option.attribute1 || option.attribute2) && (
                  <Typography
                    fontvariant="merriparagraph"
                    text={[option.attribute1, option.attribute2]
                      .filter(Boolean)
                      .join(' | ')}
                    fontcolor="rgba(0, 0, 0, 0.6)"
                    sx={{
                      fontSize: '12px',
                      lineHeight: '16px',
                      width: '100%',
                      textAlign: 'left',
                    }}
                  />
                )}

              {/* For complex variant - show attributes on separate lines */}
              {variant === 'complex' &&
                !isHistoryItem &&
                !isCurrentInput &&
                !isNoHistoryPlaceholder && (
                  <>
                    {/* First line of attributes */}
                    {(option.attribute1 || option.attribute2) && (
                      <Typography
                        fontvariant="merriparagraph"
                        text={[option.attribute1, option.attribute2]
                          .filter(Boolean)
                          .join(' | ')}
                        fontcolor="rgba(0, 0, 0, 0.6)"
                        sx={{
                          fontSize: '12px',
                          lineHeight: '16px',
                          width: '100%',
                          textAlign: 'left',
                        }}
                      />
                    )}

                    {/* Second line of attributes */}
                    {(option.attribute3 || option.attribute4) && (
                      <Typography
                        fontvariant="merriparagraph"
                        text={[option.attribute3, option.attribute4]
                          .filter(Boolean)
                          .join(' | ')}
                        fontcolor="rgba(0, 0, 0, 0.6)"
                        sx={{
                          fontSize: '12px',
                          lineHeight: '16px',
                          width: '100%',
                          textAlign: 'left',
                        }}
                      />
                    )}

                    {/* Third line of attributes */}
                    {(option.attribute5 || option.attribute6) && (
                      <Typography
                        fontvariant="merriparagraph"
                        text={[option.attribute5, option.attribute6]
                          .filter(Boolean)
                          .join(' | ')}
                        fontcolor="rgba(0, 0, 0, 0.6)"
                        sx={{
                          fontSize: '12px',
                          lineHeight: '16px',
                          width: '100%',
                          textAlign: 'left',
                        }}
                      />
                    )}
                  </>
                )}

              {/* For history items, show additional attributes from original options */}
              {isHistoryItem && variant === 'complex' && (
                <>
                  {/* Show attribute3/4 as first additional line for history */}
                  {(option.attribute3 || option.attribute4) && (
                    <Typography
                      fontvariant="merriparagraph"
                      text={[option.attribute3, option.attribute4]
                        .filter(Boolean)
                        .join(' | ')}
                      fontcolor="rgba(0, 0, 0, 0.6)"
                      sx={{
                        fontSize: '12px',
                        lineHeight: '16px',
                        width: '100%',
                        textAlign: 'left',
                        fontStyle: 'italic',
                      }}
                    />
                  )}

                  {/* Show attribute5/6 as second additional line for history */}
                  {(option.attribute5 || option.attribute6) && (
                    <Typography
                      fontvariant="merriparagraph"
                      text={[option.attribute5, option.attribute6]
                        .filter(Boolean)
                        .join(' | ')}
                      fontcolor="rgba(0, 0, 0, 0.6)"
                      sx={{
                        fontSize: '12px',
                        lineHeight: '16px',
                        width: '100%',
                        textAlign: 'left',
                        fontStyle: 'italic',
                      }}
                    />
                  )}
                </>
              )}

              {/* For current input search, show a simpler display */}
              {isCurrentInput && option.attribute1 && (
                <Typography
                  fontvariant="merriparagraph"
                  text={option.attribute1}
                  fontcolor="rgba(0, 0, 0, 0.6)"
                  sx={{
                    fontSize: '12px',
                    lineHeight: '16px',
                    width: '100%',
                    textAlign: 'left',
                  }}
                />
              )}

              {/* For no history placeholder, show the instructions */}
              {isNoHistoryPlaceholder && option.attribute1 && (
                <Typography
                  fontvariant="merriparagraph"
                  text={option.attribute1}
                  fontcolor="rgba(0, 0, 0, 0.6)"
                  sx={{
                    fontSize: '12px',
                    lineHeight: '16px',
                    width: '100%',
                    textAlign: 'left',
                    fontStyle: 'italic',
                  }}
                />
              )}
            </li>
          )
        }}
        renderInput={params => (
          <OutlinedInput
            {...params.InputProps}
            inputProps={{
              ...params.inputProps,
              'aria-labelledby': labelId,
              onKeyDown: handleKeyDown,
            }}
            placeholder={placeholder}
            error={error}
            required={required}
            notched={
              shrunklabelposition === 'onNotch' &&
              (isFocused || !!value || !!inputValue || !!placeholder)
            }
            label={label}
            sx={{
              '& fieldset': {
                ...(shrunklabelposition === 'aboveNotch' && {
                  legend: {
                    width: '0px !important',
                  },
                }),
              },
            }}
          />
        )}
        sx={{
          '& .MuiAutocomplete-option': {
            color: black.main,
          },
          '& .MuiAutocomplete-option[aria-selected="true"]': {
            backgroundColor: `${black.main}08`,
          },
          '& .MuiAutocomplete-clearIndicator': {
            display: 'none',
          },
        }}
      />
      {helperText && (
        <StyledFormHelperText error={error} disabled={disabled}>
          {helperText}
        </StyledFormHelperText>
      )}
    </StyledFormControl>
  )
}

export default SearchableDropdown
