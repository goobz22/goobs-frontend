import { describe, expect, test } from 'bun:test'
import { isInsideOwnedPopup } from '../../src/components/DataGrid/Table/EditableCell/ownedPopup'

/**
 * A grid cell's dropdown editor portals its listbox OUTSIDE the <td>. The cell's "mousedown outside saves" listener must
 * treat a press on THAT listbox as inside — otherwise the press that begins an option click stores the cell's OLD value
 * and closes the editor before the option's click lands (ThothOS Permissions matrix: choosing "read" saved "write").
 */

interface FakeNode {
  id?: string
  parent?: FakeNode
}

function within(popup: FakeNode, node: unknown): boolean {
  for (let at = node as FakeNode | undefined; at; at = at.parent) if (at === popup) return true
  return false
}

function world() {
  const listbox: FakeNode = { id: 'field-r0-listbox' }
  const option: FakeNode = { parent: listbox }
  const otherPopup: FakeNode = { id: 'someone-elses-listbox' }
  const elsewhere: FakeNode = {}
  const popups: Record<string, FakeNode> = { [listbox.id!]: listbox, [otherPopup.id!]: otherPopup }
  const doc = {
    getElementById: (id: string) => {
      const popup = popups[id]
      return popup ? { contains: (node: unknown) => within(popup, node) } : null
    },
  }
  const cell = (controls: Array<string | null>) => ({
    querySelectorAll: () => controls.map(value => ({ getAttribute: (name: string) => (name === 'aria-controls' ? value : null) })),
  })
  return { doc, cell, option, listbox, otherPopup, elsewhere }
}

describe('a cell editor owns the popup its controls point at', () => {
  test('a press on an option inside the listbox the cell controls is INSIDE the editor', () => {
    const { doc, cell, option } = world()
    expect(isInsideOwnedPopup(cell(['field-r0-listbox']), doc, option)).toBe(true)
  })

  test('a press on the listbox itself (scrollbar, padding) is inside too', () => {
    const { doc, cell, listbox } = world()
    expect(isInsideOwnedPopup(cell(['field-r0-listbox']), doc, listbox)).toBe(true)
  })

  test('a press elsewhere on the page is still OUTSIDE (the save-on-outside-click keeps working)', () => {
    const { doc, cell, elsewhere } = world()
    expect(isInsideOwnedPopup(cell(['field-r0-listbox']), doc, elsewhere)).toBe(false)
  })

  test('a listbox the cell does NOT control is outside (another editor or page popup is not ours)', () => {
    const { doc, cell, otherPopup } = world()
    expect(isInsideOwnedPopup(cell(['field-r0-listbox']), doc, otherPopup)).toBe(false)
  })

  test('controls that point at nothing, or have no aria-controls value, never count', () => {
    const { doc, cell, option } = world()
    expect(isInsideOwnedPopup(cell([null, '', 'missing-id']), doc, option)).toBe(false)
    expect(isInsideOwnedPopup(cell([]), doc, option)).toBe(false)
  })

  test('several controls: the one whose popup holds the press wins', () => {
    const { doc, cell, option } = world()
    expect(isInsideOwnedPopup(cell(['missing-id', 'field-r0-listbox']), doc, option)).toBe(true)
  })
})
