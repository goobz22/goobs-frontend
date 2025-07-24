/**
 * @fileoverview This file defines the List, ListItem, ListItemIcon, and ListItemText components.
 */
'use client'

import React, { useMemo } from 'react'
import { ListStyles, getListStyles } from '../../theme'

// --------------------------------------------------------------------------
// PROPS INTERFACES
// --------------------------------------------------------------------------

export interface ListProps {
  children: React.ReactNode
  styles?: ListStyles
}

export interface ListItemProps {
  children: React.ReactNode
  styles?: ListStyles
}

export interface ListItemIconProps {
  children: React.ReactNode
  styles?: ListStyles
}

export interface ListItemTextProps {
  primary?: React.ReactNode
  secondary?: React.ReactNode
  styles?: ListStyles
}

// --------------------------------------------------------------------------
// MAIN COMPONENTS
// --------------------------------------------------------------------------

export const List: React.FC<ListProps> = ({ children, styles }) => {
  const computedStyles = useMemo(() => getListStyles(styles), [styles])
  return <ul style={computedStyles.container}>{children}</ul>
}

export const ListItem: React.FC<ListItemProps> = ({ children, styles }) => {
  const computedStyles = useMemo(() => getListStyles(styles), [styles])
  return <li style={computedStyles.listItem}>{children}</li>
}

export const ListItemIcon: React.FC<ListItemIconProps> = ({
  children,
  styles,
}) => {
  const computedStyles = useMemo(() => getListStyles(styles), [styles])
  return <div style={computedStyles.listItemIcon}>{children}</div>
}

export const ListItemText: React.FC<ListItemTextProps> = ({
  primary,
  secondary,
  styles,
}) => {
  const computedStyles = useMemo(() => getListStyles(styles), [styles])
  return (
    <div>
      {primary && (
        <span style={computedStyles.listItemTextPrimary}>{primary}</span>
      )}
      {secondary && (
        <span style={computedStyles.listItemTextSecondary}>{secondary}</span>
      )}
    </div>
  )
}

List.displayName = 'List'
ListItem.displayName = 'ListItem'
ListItemIcon.displayName = 'ListItemIcon'
ListItemText.displayName = 'ListItemText'
