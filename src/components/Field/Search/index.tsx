'use client'
import React, { useState } from 'react'
import SearchIcon from '../../Icons/Search'

export interface SearchbarProps {
  label?: string
  placeholder?: string
  value: string
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  sacredtheme?: boolean
  className?: string
  style?: React.CSSProperties
}

const getStyles = (
  sacredtheme?: boolean,
  isLabelShrunken?: boolean,
  isFocused?: boolean,
  shrunklabelposition?: 'onNotch' | 'aboveNotch'
) => ({
  container: {
    width: '100%',
    position: 'relative',
    height: '3rem',
    display: 'flex',
    justifyContent: 'flex-end',
  } as React.CSSProperties,
  inputContainer: {
    position: 'relative',
    width: '100%',
  } as React.CSSProperties,
  input: {
    width: '100%',
    height: '2.5rem',
    paddingLeft: '3rem',
    paddingRight: '1rem',
    borderWidth: '1px',
    borderRadius: '0.375rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    ...(sacredtheme
      ? {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#FFD700',
          borderColor: isFocused ? '#FFD700' : 'rgba(255, 215, 0, 0.5)',
          backgroundImage:
            'linear-gradient(rgba(255,215,0,0.05), rgba(255,215,0,0.05)), radial-gradient(circle at top right, rgba(255,215,0,0.08) 0%, transparent 50%)',
          boxShadow: isFocused ? '0 0 20px rgba(255, 215, 0, 0.6)' : 'none',
        }
      : {
          backgroundColor: 'white',
          color: 'black',
          borderColor: isFocused ? '#3B82F6' : '#D1D5DB',
          boxShadow: isFocused ? '0 0 10px rgba(59, 130, 246, 0.3)' : 'none',
        }),
  } as React.CSSProperties,
  label: {
    position: 'absolute',
    transition: 'all 0.2s ease',
    pointerEvents: 'none',
    zIndex: 10,
    color: sacredtheme ? 'rgba(255, 215, 0, 0.8)' : '#6B7280',
    ...(isLabelShrunken
      ? {
          fontSize: '0.75rem',
          ...(shrunklabelposition === 'aboveNotch'
            ? {
                top: '-1.25rem',
                left: '0',
              }
            : {
                top: '0.5rem',
                left: '1rem',
                transform: 'translateY(-50%)',
                backgroundColor: sacredtheme ? 'black' : 'white',
                padding: '0 0.25rem',
              }),
        }
      : {
          top: '50%',
          left: '2.75rem',
          transform: 'translateY(-50%)',
          fontSize: '1rem',
        }),
    ...(isFocused && { color: sacredtheme ? '#FFD700' : '#3B82F6' }),
  } as React.CSSProperties,
  iconContainer: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  sacredGlyph: {
    position: 'absolute',
    left: '-1.25rem',
    color: 'rgba(255, 215, 0, 0.4)',
    fontSize: '0.75rem',
    animation: 'sacred-pulse 2s infinite',
  } as React.CSSProperties,
})

const Searchbar: React.FC<SearchbarProps> = ({
  label,
  placeholder,
  value,
  shrunklabelposition = 'onNotch',
  onChange,
  sacredtheme = false,
  className,
  style,
}) => {
  const [focused, setFocused] = useState(false)
  const isLabelShrunken = focused || Boolean(value)

  const handleFocus = () => setFocused(true)
  const handleBlur = () => setFocused(false)

  const labelText = sacredtheme ? 'Divine Search' : label
  const placeholderText = isLabelShrunken
    ? sacredtheme
      ? 'Seek ancient wisdom...'
      : placeholder
    : ''
  const styles = getStyles(
    sacredtheme,
    isLabelShrunken,
    focused,
    shrunklabelposition
  )

  return (
    <div style={{ ...styles.container, ...style }} className={className}>
      <div style={styles.inputContainer}>
        <input
          id="search-input"
          type="text"
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholderText}
          style={styles.input}
        />
        {labelText && (
          <label htmlFor="search-input" style={styles.label}>
            {labelText}
          </label>
        )}
        <div style={styles.iconContainer}>
          {sacredtheme && <span style={styles.sacredGlyph}>𓂀</span>}
          <SearchIcon
            style={{
              width: '1.25rem',
              height: '1.25rem',
              color: sacredtheme ? '#FFD700' : '#4B5563',
              animation: sacredtheme ? 'gold-shimmer 2s infinite' : 'none',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Searchbar
