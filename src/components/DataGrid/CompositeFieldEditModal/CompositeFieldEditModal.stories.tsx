import React, { useState, useCallback, useRef } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect, userEvent, waitFor } from 'storybook/test'
import CompositeFieldEditModal from './index'
import type { CompositeFieldConfig, RowData } from '../types'

/**
 * Stories for the DataGrid CompositeFieldEditModal — the multi-field "Edit
 * Fields" editor that opens over a grid row. These are ALSO the regression net
 * for the `missing-dialog-focus-trap` a11y class fix: the editor content used to
 * re-declare `role="dialog"` + `aria-modal="true"` on its own inner wrapper,
 * NESTED inside the goobs <Dialog> that already owns the modal role + the APG
 * focus trap. That produced two dialog surfaces (only one focus-managed) and
 * left the modal without an accessible name. The fix drops the inner
 * role/aria-modal and names the wrapping <Dialog> via `ariaLabelledBy` pointed
 * at the visible "Edit Fields" heading.
 */

const meta: Meta<typeof CompositeFieldEditModal> = {
  title: 'Components/DataGrid/CompositeFieldEditModal',
  component: CompositeFieldEditModal,
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj<typeof CompositeFieldEditModal>

const contactFields: CompositeFieldConfig[] = [
  {
    field: 'contactName',
    label: 'Full Name',
    type: 'text',
    required: true,
    placeholder: 'Enter contact name',
  },
  {
    field: 'contactEmail',
    label: 'Email',
    type: 'text',
    helperText: 'Work email preferred',
  },
]

const contactRow: RowData = {
  id: '1',
  contactName: 'John Doe',
  contactEmail: 'john.doe@acme.com',
}

/**
 * Harness: a trigger button that opens the modal, so the play tests can assert
 * focus MOVES INTO the dialog on open and is RESTORED to the trigger on close.
 */
const Harness: React.FC = () => {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const handleClose = useCallback(() => setOpen(false), [])
  const handleSave = useCallback(() => setOpen(false), [])

  return (
    <div style={{ padding: '120px' }}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        style={{ padding: '8px 16px' }}
      >
        Edit contact
      </button>
      <CompositeFieldEditModal
        open={open}
        onClose={handleClose}
        onSave={handleSave}
        rowData={contactRow}
        compositeFields={contactFields}
        styles={{ theme: 'light' }}
      />
    </div>
  )
}

/** Default: the editor open on light theme (visual baseline). */
export const Open: Story = {
  render: () => {
    const OpenOnMount: React.FC = () => (
      <div style={{ padding: '40px' }}>
        <CompositeFieldEditModal
          open
          onClose={() => {}}
          onSave={() => {}}
          rowData={contactRow}
          compositeFields={contactFields}
          styles={{ theme: 'light' }}
        />
      </div>
    )
    return <OpenOnMount />
  },
  globals: { backgrounds: { value: 'light' } },
}

/**
 * A11y regression — the editor is a SINGLE, NAMED, focus-managed modal.
 * Guards the `missing-dialog-focus-trap` fix:
 *   1. Exactly ONE `role="dialog"` in the document (no nested inner dialog).
 *   2. That dialog exposes the accessible name "Edit Fields" (4.1.2) from the
 *      wrapping <Dialog>'s `ariaLabelledBy` heading.
 *   3. Opening moved focus INTO the surface (WCAG 2.4.3).
 *   4. Escape closes it and RESTORES focus to the trigger (2.1.2 / 4.1.2).
 */
export const A11yDialogFocusManagement: Story = {
  name: 'A11y/Dialog Focus Management',
  render: () => <Harness />,
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Edit contact' })
    await userEvent.click(trigger)

    // The goobs <Dialog> PORTALS to document.body, so query the whole document.
    const body = within(canvasElement.ownerDocument.body)

    // 1. Exactly ONE dialog surface — the inner content wrapper must NOT
    //    re-declare role="dialog" (the nested-dialog regression).
    const dialog = await body.findByRole('dialog')
    await waitFor(() => expect(body.getAllByRole('dialog')).toHaveLength(1))

    // 2. The single dialog carries an accessible name from the "Edit Fields"
    //    heading (via the wrapper's ariaLabelledBy).
    await expect(dialog).toHaveAccessibleName('Edit Fields')

    // 3. Opening moved focus INTO the surface.
    await waitFor(() =>
      expect(dialog.contains(canvasElement.ownerDocument.activeElement)).toBe(
        true
      )
    )

    // 4. Escape closes the dialog and RESTORES focus to the trigger.
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(dialog).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
