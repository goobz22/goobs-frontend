/**
 * @fileoverview This file defines the List, ListItem, ListItemIcon, and ListItemText components.
 */
'use client'

import React from 'react'
import cssStyles from './List.module.css'

// --------------------------------------------------------------------------
// STYLES TYPE
// --------------------------------------------------------------------------

/**
 * Shared styling surface for every List part. Each part resolves its OWN
 * theme and density from the `styles` it receives — nothing cascades from
 * `List` to its items — so pass the same object to every part for a
 * consistent look. `customStyles` entries are caller-supplied inline-style
 * escape hatches; each part applies only its matching entry.
 */
export interface ListStyles {
  /** `data-theme` variant stamped on the receiving part: 'light' (default), 'dark', or 'sacred'. */
  theme?: 'light' | 'dark' | 'sacred'
  /** Compact spacing: stamps `data-dense="true"` on the receiving part. Default false. */
  dense?: boolean
  /** Per-part inline-style overrides; each part reads only its own key. */
  customStyles?: {
    /** Inline styles for the `List` root `<ul>`. */
    container?: React.CSSProperties
    /** Inline styles for a `ListItem` `<li>`. */
    listItem?: React.CSSProperties
    /** Inline styles for the `ListItemIcon` wrapper. */
    listItemIcon?: React.CSSProperties
    /** Inline styles for the `ListItemText` primary span. */
    listItemTextPrimary?: React.CSSProperties
    /** Inline styles for the `ListItemText` secondary span. */
    listItemTextSecondary?: React.CSSProperties
  }
}

// --------------------------------------------------------------------------
// PROPS INTERFACES
// --------------------------------------------------------------------------

/** Props for the `List` root (`<ul>`). */
export interface ListProps {
  children: React.ReactNode
  /** Theme/density/inline overrides for THIS part only (the `container` customStyles entry). */
  styles?: ListStyles
}

/** Props for a `ListItem` (`<li>`). */
export interface ListItemProps {
  children: React.ReactNode
  /** Theme/density/inline overrides for THIS part only (the `listItem` customStyles entry). */
  styles?: ListStyles
}

/** Props for the `ListItemIcon` leading-icon wrapper. */
export interface ListItemIconProps {
  children: React.ReactNode
  /** Theme/density/inline overrides for THIS part only (the `listItemIcon` customStyles entry). */
  styles?: ListStyles
}

/** Props for `ListItemText`, the two-line primary/secondary text block. */
export interface ListItemTextProps {
  /** Main line; the span renders only when provided. */
  primary?: React.ReactNode
  /** Secondary line under the primary; the span renders only when provided. */
  secondary?: React.ReactNode
  /** Theme/density/inline overrides for THIS part only (the `listItemText*` customStyles entries). */
  styles?: ListStyles
}

// --------------------------------------------------------------------------
// MAIN COMPONENTS
// --------------------------------------------------------------------------

/**
 * Themed `<ul>` list root, composed with `ListItem`, `ListItemIcon`, and
 * `ListItemText`. Each part stamps its own `data-theme` (light default) and
 * optional `data-dense` from the `styles` it receives — the List's theme does
 * NOT cascade to items, so pass the same `styles` to every part.
 *
 * The `<ul>` carries an explicit `role="list"` because the stylesheet sets
 * `list-style: none`; WebKit/VoiceOver strip the implicit list semantics from a
 * bulletless `<ul>` (and its `<li>` children lose `listitem`), so the role
 * restores the "list, N items" announcement and list navigation (WCAG 1.3.1).
 */
export const List: React.FC<ListProps> = ({ children, styles }) => {
  const theme = styles?.theme ?? 'light'
  return (
    <ul
      className={cssStyles.container}
      role="list"
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

/**
 * `<li>` row inside a `List`. Resolves its own theme (light default) and
 * density from its `styles` prop; honors the `listItem` customStyles entry.
 */
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

/**
 * Leading-icon wrapper for a `ListItem`: vertically centers its icon child,
 * colors it per theme (light default, inheriting the surrounding color), and
 * tightens the icon-to-text gutter when dense. Honors the `listItemIcon`
 * customStyles entry.
 */
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

/**
 * Two-line text block for a `ListItem`: a `primary` span and a `secondary`
 * span, each rendered only when provided. Resolves its own theme (light
 * default) and honors the `listItemTextPrimary`/`listItemTextSecondary`
 * customStyles entries.
 */
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
