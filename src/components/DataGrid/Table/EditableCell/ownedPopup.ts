interface ControlLike {
  getAttribute(name: string): string | null
}

interface CellLike {
  querySelectorAll(selector: string): ArrayLike<ControlLike>
}

interface DocumentLike {
  getElementById(id: string): { contains(node: unknown): boolean } | null
}

/**
 * True when `target` sits inside a popup that one of the cell's own controls opens (`aria-controls`).
 *
 * A dropdown editor portals its listbox OUTSIDE the <td>, so "the press is outside the cell" is true for the very
 * press that begins an option click. The cell's save-on-outside-mousedown listener would then store the cell's OLD
 * value and close the editor before the option's click lands: choosing "read" saved "write". A popup the cell's own
 * controls point at belongs to the editor, so a press on it is inside.
 */
export function isInsideOwnedPopup(
  cell: CellLike,
  doc: DocumentLike,
  target: unknown
): boolean {
  const controls = cell.querySelectorAll('[aria-controls]')
  for (let index = 0; index < controls.length; index++) {
    const id = controls[index]?.getAttribute('aria-controls')
    if (id && doc.getElementById(id)?.contains(target)) return true
  }
  return false
}
