import { describe, expect, test } from 'bun:test'
import { menuGeometry } from '../../src/components/Field/Dropdown/menuGeometry'

describe('portalled dropdown placement', () => {
  test('flips the measured low trigger above the viewport edge', () => {
    const menu = menuGeometry(
      { top: 763, bottom: 814, left: 300, width: 280 },
      { width: 1440, height: 900 },
      200
    )
    expect(menu.top).toBeUndefined()
    expect(menu.bottom).toBe(141)
    expect(menu.maxHeight).toBe(200)
    expect(900 - menu.bottom! - menu.maxHeight).toBeGreaterThanOrEqual(8)
  })

  test('keeps a top trigger below and clamps height and horizontal position', () => {
    const menu = menuGeometry(
      { top: 20, bottom: 60, left: 380, width: 180 },
      { width: 400, height: 150 },
      200
    )
    expect(menu.top).toBe(64)
    expect(menu.bottom).toBeUndefined()
    expect(menu.maxHeight).toBe(78)
    expect(menu.top! + menu.maxHeight).toBeLessThanOrEqual(142)
    expect(menu.left + menu.width).toBeLessThanOrEqual(392)
  })
})
