/**
 * The meeting-affordance decision, pinned.
 *
 * `canUseMeetingCapability` is the single home every meeting control in
 * `ProjectBoard`/`InlineShowTask` consults, so its truth table IS the component
 * contract that ThothOS' `lint:workspace-affordance-axis` relies on:
 *
 *   handler present, no map            -> control RENDERED and fires
 *   handler absent                     -> control NOT rendered
 *   handler present, map denies        -> control NOT rendered
 *
 * The rendering half of that contract is fenced by the Storybook stories in
 * `board/ProjectBoard.stories.tsx` (goobs has no DOM unit harness — the story +
 * Chromatic baseline is the regression test here) and by
 * `scripts/lint-meeting-affordance-gate.ts`, which walls every control render
 * site against the "disabled instead of hidden" shape this replaced. This file
 * pins the DECISION, which is the part that can be tested without a browser.
 *
 * Run: bun test ./scripts/__tests__/meeting-capability.test.ts
 */
import { describe, expect, it } from 'bun:test'
import {
  MEETING_CAPABILITIES,
  canUseMeetingCapability,
  type MeetingCapability,
} from '../../src/components/ProjectBoard/utils/meetingCapability'

const handler = () => {}

describe('canUseMeetingCapability — the three contract states', () => {
  it('handler present and no permission map -> available (control renders and fires)', () => {
    for (const capability of MEETING_CAPABILITIES)
      expect(canUseMeetingCapability(capability, handler)).toBe(true)
  })

  it('handler absent -> unavailable (control is not rendered)', () => {
    for (const capability of MEETING_CAPABILITIES) {
      expect(canUseMeetingCapability(capability, undefined)).toBe(false)
      // A withheld handler stays withheld no matter how permissive the map is:
      // the two halves are AND-ed, so a grant cannot conjure a callback.
      expect(
        canUseMeetingCapability(capability, undefined, {
          [capability]: { access: 'write' },
        })
      ).toBe(false)
    }
  })

  it('map denies -> unavailable even with a handler present', () => {
    for (const capability of MEETING_CAPABILITIES) {
      for (const access of ['no-access', 'read'] as const) {
        expect(
          canUseMeetingCapability(capability, handler, {
            [capability]: { access },
          })
        ).toBe(false)
      }
    }
  })
})

describe('canUseMeetingCapability — the axis the coarse permission cannot express', () => {
  it('grants each capability independently', () => {
    // The whole point of the map: confirm a booking you may not schedule.
    const permissions = {
      schedule: { access: 'read' },
      confirm: { access: 'write' },
      reschedule: { access: 'write' },
      cancel: { access: 'no-access' },
    } as const
    const available = MEETING_CAPABILITIES.filter(c =>
      canUseMeetingCapability(c, handler, permissions)
    )
    expect(available).toEqual(['confirm', 'reschedule'])
  })

  it('an UNNAMED capability is ungoverned, not denied — the handler decides', () => {
    // Partial by design: a map that names only `cancel` must not silently
    // switch the other three off, or adding a capability to the map would be a
    // breaking change for every existing caller.
    const permissions = { cancel: { access: 'no-access' } } as const
    expect(canUseMeetingCapability('cancel', handler, permissions)).toBe(false)
    expect(canUseMeetingCapability('schedule', handler, permissions)).toBe(true)
    expect(canUseMeetingCapability('confirm', handler, permissions)).toBe(true)
    expect(canUseMeetingCapability('reschedule', handler, permissions)).toBe(true)
  })

  it('an empty map behaves exactly like no map (backwards compatibility)', () => {
    for (const capability of MEETING_CAPABILITIES)
      expect(canUseMeetingCapability(capability, handler, {})).toBe(
        canUseMeetingCapability(capability, handler)
      )
  })
})

describe('canUseMeetingCapability — non-function handlers are absent handlers', () => {
  it('rejects every non-function handler value', () => {
    // A plain loop rather than it.each: bun SPREADS an array row into the test
    // arguments, so `[]` would arrive as zero arguments and quietly test
    // nothing — the fixture would pass by not running.
    const notHandlers: unknown[] = [undefined, null, 0, '', false, {}, [], 'fn']
    for (const value of notHandlers)
      expect(canUseMeetingCapability('schedule', value)).toBe(false)
  })
})

describe('MEETING_CAPABILITIES', () => {
  it('names exactly the four independently-grantable affordances', () => {
    const expected: MeetingCapability[] = [
      'schedule',
      'confirm',
      'reschedule',
      'cancel',
    ]
    expect([...MEETING_CAPABILITIES].sort()).toEqual(expected.sort())
  })
})
