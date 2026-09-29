/** Geometry for a fixed, portalled dropdown anchored to a trigger. */
export interface MenuGeometry {
  top?: number
  bottom?: number
  left: number
  width: number
  maxHeight: number
}

interface AnchorRect {
  top: number
  bottom: number
  left: number
  width: number
}

/** Keep the menu in the viewport; choose the side with more room when below is short. */
export function menuGeometry(
  anchor: AnchorRect,
  viewport: { width: number; height: number },
  preferredHeight: number
): MenuGeometry {
  const gap = 4
  const inset = 8
  const below = Math.max(0, viewport.height - anchor.bottom - gap - inset)
  const above = Math.max(0, anchor.top - gap - inset)
  const opensAbove = below < preferredHeight && above > below
  const maxHeight = Math.min(preferredHeight, opensAbove ? above : below)
  const width = Math.min(
    Math.max(0, anchor.width),
    Math.max(0, viewport.width - inset * 2)
  )
  const left = Math.min(
    Math.max(inset, anchor.left),
    Math.max(inset, viewport.width - inset - width)
  )

  return {
    ...(opensAbove
      ? { bottom: viewport.height - anchor.top + gap }
      : { top: Math.min(anchor.bottom + gap, viewport.height - inset) }),
    left,
    width,
    maxHeight,
  }
}
