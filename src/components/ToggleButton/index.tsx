'use client'

import React from 'react'

interface ToggleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  selected?: boolean
  sacredtheme?: boolean
}

const premiumStyles = {
  button: {
    padding: '4px 12px',
    fontSize: '14px',
    border: '1px solid #D1D5DB',
    transition: 'all 0.3s ease',
    color: '#4B5563',
    backgroundColor: 'white',
    cursor: 'pointer',
  } as React.CSSProperties,
  buttonHover: {
    backgroundColor: '#F3F4F6',
  } as React.CSSProperties,
  buttonSelected: {
    backgroundColor: '#DBEAFE',
    color: 'black',
  } as React.CSSProperties,
  buttonGroup: {
    display: 'flex',
    borderRadius: '6px',
    overflow: 'hidden',
  } as React.CSSProperties,
}

const sacredStyles = {
  button: {
    padding: '4px 12px',
    fontSize: '14px',
    border: '1px solid rgba(255, 215, 0, 0.3)',
    transition: 'all 0.3s ease',
    color: 'rgba(255, 215, 0, 0.7)',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  } as React.CSSProperties,
  buttonHover: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderColor: 'rgba(255, 215, 0, 0.5)',
  } as React.CSSProperties,
  buttonSelected: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    color: '#FFD700',
    borderColor: '#FFD700',
    animation: 'complex-toolbar-button-glow 1.5s infinite alternate',
  } as React.CSSProperties,
  buttonGroup: {
    display: 'flex',
    borderRadius: '6px',
    overflow: 'hidden',
  } as React.CSSProperties,
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  value: _value,
  selected,
  sacredtheme,
  children,
  style,
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false)
  const styles = sacredtheme ? sacredStyles : premiumStyles

  const buttonStyle: React.CSSProperties = {
    ...styles.button,
    ...(selected && styles.buttonSelected),
    ...(isHovered && !selected && styles.buttonHover),
    ...style,
  }

  return (
    <button
      {...props}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  )
}

interface ToggleButtonGroupProps {
  value: string
  exclusive?: boolean
  onChange: (
    event: React.MouseEvent<HTMLElement>,
    newMode: string | null
  ) => void
  children: React.ReactNode
  sacredtheme?: boolean
  className?: string
  style?: React.CSSProperties
}

export const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({
  value,
  exclusive,
  onChange,
  children,
  sacredtheme,
  className,
  style,
}) => {
  const styles = sacredtheme ? sacredStyles : premiumStyles
  const enhancedChildren = React.Children.map(children, child => {
    if (React.isValidElement<ToggleButtonProps>(child)) {
      return React.cloneElement(child, {
        selected: child.props.value === value,
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          if (exclusive) {
            onChange(e, child.props.value)
          }
        },
        sacredtheme: sacredtheme,
      })
    }
    return child
  })

  return (
    <div style={{ ...styles.buttonGroup, ...style }} className={className}>
      {enhancedChildren}
    </div>
  )
}
