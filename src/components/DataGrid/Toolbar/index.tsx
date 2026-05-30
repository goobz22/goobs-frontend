/**
 * =============================================================================
 * DATAGRID TOOLBAR COMPONENT
 * =============================================================================
 *
 * The toolbar sits above the table and provides action controls for the DataGrid.
 * It has two main sections:
 *
 * LAYOUT:
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ [Custom Buttons...]                              [ManageRow Actions...] │
 * │ (Left side)                                              (Right side)   │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * LEFT SIDE - CUSTOM BUTTONS:
 * - Passed via `buttons` prop from DataGrid
 * - Typically includes action buttons like "Create New", "Export", etc.
 * - Filtered based on permissions (write-only actions hidden in read mode)
 *
 * RIGHT SIDE - MANAGE ROW ACTIONS:
 * - Rendered by ManageRow component
 * - Provides CRUD operations for selected rows:
 *   - Add (create new row)
 *   - Duplicate (copy selected rows)
 *   - Delete (remove selected rows)
 *   - Manage (open detail editor)
 *   - Show (open read-only view)
 *
 * PERMISSIONS FILTERING:
 * - In 'read' mode, buttons with write-action keywords are hidden
 * - Keywords: create, add, delete, remove, edit, update
 * - 'write' mode shows all buttons
 *
 * =============================================================================
 */

'use client'

import React, { useMemo, type FC } from 'react'
import Button, { type ButtonProps } from '../../Button'
import ManageRow from '../ManageRow'
import type { DataGridStyles } from '../types'
import cssStyles from '../DataGrid.module.css'

/**
 * Props for the DataGridToolbar component.
 */
export interface DataGridToolbarProps {
  /** Custom action buttons to display on the left side */
  buttons?: ButtonProps[]

  /**
   * Props for the ManageRow component (right side).
   * Controls CRUD actions for selected rows.
   */
  manageRowProps?: {
    /** Currently selected row IDs */
    selectedRows?: string[]
    /** Full row data (for context) */
    rows?: Array<{ [key: string]: unknown }>
    /** Handler for Add action */
    onAdd?: () => void
    /** Handler for Duplicate action */
    onDuplicate?: () => void
    /** Handler for Delete action */
    onDelete?: () => void
    /** Handler for Manage (edit) action */
    onManage?: () => void
    /** Handler for Show (view) action */
    onShow?: () => void
    /** Handler for Export action */
    onExport?: () => void
    /** Handler for closing manage row UI */
    handleClose?: () => void
    /** Permission level */
    permissions?:
      | {
          access: 'no-access' | 'read' | 'write'
        }
      | undefined
  }

  /** Theme and style configuration */
  styles?: DataGridStyles

  /** Permission level for filtering buttons */
  permissions?:
    | {
        access: 'no-access' | 'read' | 'write'
      }
    | undefined
}

/**
 * Derive a canonical `data-action` verb from a custom toolbar button's visible
 * text when the caller did not pass an explicit `action`. Goobs `Button` emits
 * `action` as `data-action`, which is the stable hook the test suite targets
 * (`[data-action="create"]` / `[data-action="manage"]` / `[data-action="delete"]`).
 * Deriving from text means every existing workspace's "Create X" / "Manage X" /
 * "Delete" toolbar button becomes targetable without editing each call site, and
 * without coupling the test to a fragile, emoji-prefixed accessible-name regex
 * (icons render into the name, e.g. "⚙️Manage Contact", defeating `/^Manage$/`).
 * An explicit `action` passed by the caller always wins. The verb buckets mirror
 * the write-keyword set used by the read-only permission filter above.
 */
function deriveButtonAction(text?: string): string | undefined {
  const normalized = (text ?? '').toLowerCase()
  if (/\b(create|add|new)\b/.test(normalized)) return 'create'
  if (/\b(manage|edit|update)\b/.test(normalized)) return 'manage'
  if (/\b(delete|remove)\b/.test(normalized)) return 'delete'
  if (/\b(save|submit)\b/.test(normalized)) return 'save'
  return undefined
}

/**
 * DATAGRID TOOLBAR COMPONENT
 * --------------------------
 * Renders the action toolbar above the data table.
 */
const DataGridToolbar: FC<DataGridToolbarProps> = ({
  buttons,
  manageRowProps,
  styles,
  permissions,
}) => {
  // ═══════════════════════════════════════════════════════════════════════════
  // PERMISSION-BASED BUTTON FILTERING
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Filter buttons based on user permissions.
   * - 'write' access: Show all buttons
   * - 'read' access: Hide buttons with write-action keywords in their text
   *
   * Keywords that indicate write operations:
   * create, add, delete, remove, edit, update
   */
  const filteredButtons = useMemo(() => {
    if (!permissions || permissions.access === 'write') {
      return buttons // Show all buttons for write access
    }
    // For read-only access, filter out action buttons
    return buttons?.filter(btn => {
      const text = btn.text?.toLowerCase() || ''
      // Hide buttons that perform write operations
      return (
        !text.includes('create') &&
        !text.includes('add') &&
        !text.includes('delete') &&
        !text.includes('remove') &&
        !text.includes('edit') &&
        !text.includes('update')
      )
    })
  }, [buttons, permissions])

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className={cssStyles.toolbar}>
      {/* ─────────────────────────────────────────────────────────────────────
          LEFT SECTION: Custom Buttons
          These are passed from the DataGrid parent via the buttons prop.
          Filtered based on permissions in read-only mode.
          ───────────────────────────────────────────────────────────────────── */}
      <div className={cssStyles.toolbarLeft}>
        {filteredButtons?.map((btn, idx) => {
          // Explicit action wins; otherwise derive from the button text so
          // every workspace's toolbar buttons expose [data-action] for tests.
          // Conditional spread (not `action={…}`) because ButtonProps.action is
          // a required-if-present string under exactOptionalPropertyTypes — we
          // must omit the prop entirely rather than pass `undefined`.
          const resolvedAction = btn.action ?? deriveButtonAction(btn.text)
          return (
            <Button
              key={idx}
              {...btn}
              {...(resolvedAction ? { action: resolvedAction } : {})}
              styles={{
                ...btn.styles,
                theme: btn.styles?.theme || styles?.theme || 'light',
              }}
            />
          )
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          RIGHT SECTION: ManageRow Actions
          Provides CRUD operations for selected rows.
          The ManageRow component handles permission-based visibility internally.
          ───────────────────────────────────────────────────────────────────── */}
      <div className={cssStyles.toolbarRight}>
        <ManageRow
          selectedRows={manageRowProps?.selectedRows || []}
          {...(manageRowProps?.onAdd ? { onAdd: manageRowProps.onAdd } : {})}
          {...(manageRowProps?.onDuplicate
            ? { onDuplicate: manageRowProps.onDuplicate }
            : {})}
          {...(manageRowProps?.onDelete
            ? { onDelete: manageRowProps.onDelete }
            : {})}
          {...(manageRowProps?.onManage
            ? { onManage: manageRowProps.onManage }
            : {})}
          {...(manageRowProps?.onShow ? { onShow: manageRowProps.onShow } : {})}
          {...(manageRowProps?.handleClose
            ? { handleClose: manageRowProps.handleClose }
            : {})}
          {...(styles ? { styles } : {})}
        />
      </div>
    </div>
  )
}

export default DataGridToolbar
