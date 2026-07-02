/**
 * @fileoverview This file defines the List, ListItem, ListItemIcon, and ListItemText components.
 */
'use client'

import React from 'react'
import cssStyles from './List.module.css'

// --------------------------------------------------------------------------
// STYLES TYPE
// --------------------------------------------------------------------------
// Migrated off theme/list.ts onto the CSS module. The public shape is kept
// identical to the old `ListStyles` (theme / dense / customStyles) so callers
// passing `styles` are unaffected. `customStyles` are caller-supplied inline
// overrides and legitimately stay in JS (recipe step 3).

export interface ListStyles {
  theme?: 'light' | 'dark' | 'sacred'
  dense?: boolean
  customStyles?: {
    container?: React.CSSProperties
    listItem?: React.CSSProperties
    listItemIcon?: React.CSSProperties
    listItemTextPrimary?: React.CSSProperties
    listItemTextSecondary?: React.CSSProperties
  }
}

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
  const theme = styles?.theme ?? 'light'
  return (
    <ul
      className={cssStyles.container}
      data-theme={theme}
      data-component="List"
      {...(styles?.dense && { 'data-dense': 'true' })}
      {...(styles?.customStyles?.container && {
        style: styles.customStyles.container,
      })}
    >
      {children}
    </ul>
  )
}

export const ListItem: React.FC<ListItemProps> = ({ children, styles }) => {
  const theme = styles?.theme ?? 'light'
  return (
    <li
      className={cssStyles.listItem}
      data-theme={theme}
      {...(styles?.dense && { 'data-dense': 'true' })}
      {...(styles?.customStyles?.listItem && {
        style: styles.customStyles.listItem,
      })}
    >
      {children}
    </li>
  )
}

export const ListItemIcon: React.FC<ListItemIconProps> = ({
  children,
  styles,
}) => {
  const theme = styles?.theme ?? 'light'
  return (
    <div
      className={cssStyles.listItemIcon}
      data-theme={theme}
      {...(styles?.dense && { 'data-dense': 'true' })}
      {...(styles?.customStyles?.listItemIcon && {
        style: styles.customStyles.listItemIcon,
      })}
    >
      {children}
    </div>
  )
}

export const ListItemText: React.FC<ListItemTextProps> = ({
  primary,
  secondary,
  styles,
}) => {
  const theme = styles?.theme ?? 'light'
  return (
    <div>
      {primary && (
        <span
          className={cssStyles.listItemTextPrimary}
          data-theme={theme}
          {...(styles?.dense && { 'data-dense': 'true' })}
          {...(styles?.customStyles?.listItemTextPrimary && {
            style: styles.customStyles.listItemTextPrimary,
          })}
        >
          {primary}
        </span>
      )}
      {secondary && (
        <span
          className={cssStyles.listItemTextSecondary}
          data-theme={theme}
          {...(styles?.dense && { 'data-dense': 'true' })}
          {...(styles?.customStyles?.listItemTextSecondary && {
            style: styles.customStyles.listItemTextSecondary,
          })}
        >
          {secondary}
        </span>
      )}
    </div>
  )
}

List.displayName = 'List'
ListItem.displayName = 'ListItem'
ListItemIcon.displayName = 'ListItemIcon'
ListItemText.displayName = 'ListItemText'
