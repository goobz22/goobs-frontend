// src/components/TransferList/transferlist.stories.tsx

import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { z } from 'zod'
import TransferList, { TransferListDropdownDataMap } from './index'
import Form from '../Form'
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test'

const meta: Meta<typeof TransferList> = {
  title: 'Components/TransferList',
  component: TransferList,
  argTypes: {
    sacredtheme: { control: 'boolean' },
    variant: {
      control: 'radio',
      options: ['singleSelection', 'multipleSelection'],
    },
  },
  parameters: {
    layout: 'centered',
  },
}
export default meta

type Story = StoryObj<typeof TransferList>

const singleLeftItems = ['Item A', 'Item B', 'Item C', 'Item D', 'Item E']
const singleRightItems = ['Item X', 'Item Y']

const dropdownDataMap: TransferListDropdownDataMap = {
  knowledgebase: {
    leftItems: ['Solar Flares', 'Galaxy Clusters', 'Nebulas'],
    rightItems: ['Black Holes'],
  },
  topics: {
    leftItems: ['Astro-Physics', 'Quantum Mechanics'],
    rightItems: ['General Relativity'],
  },
}
const dropdownOptions = [
  { value: '', label: 'Select Category' },
  { value: 'knowledgebase', label: 'Knowledgebase' },
  { value: 'topics', label: 'Topics' },
]

const itemLabelMap = {
  HIGH: 'High Priority',
  MEDIUM: 'Medium Priority',
  LOW: 'Low Priority',
}

/**
 * 1) Premium Theme
 */
export const PremiumTheme: Story = {
  render: args => {
    const Component = () => {
      const [localLeft, setLocalLeft] = React.useState(
        args.leftItems ?? singleLeftItems
      )
      const [localRight, setLocalRight] = React.useState(
        args.rightItems ?? singleRightItems
      )
      const [localDataMap, setLocalDataMap] =
        React.useState<TransferListDropdownDataMap>(
          args.dropdownDataMap ?? dropdownDataMap
        )
      const handleChange = (
        newLeft: string[],
        newRight: string[],
        dropdownValue?: string
      ) => {
        if (args.variant === 'multipleSelection' && dropdownValue) {
          setLocalDataMap(prev => ({
            ...prev,
            [dropdownValue]: { leftItems: newLeft, rightItems: newRight },
          }))
        } else {
          setLocalLeft(newLeft)
          setLocalRight(newRight)
        }
        args.onChange?.(newLeft, newRight, dropdownValue)
      }
      return (
        <div
          style={{
            width: '700px',
            padding: '24px',
            background: '#f9fafb',
            borderRadius: '8px',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: '16px',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Premium TransferList
          </h3>
          {(() => {
            const tlProps: import('./index').TransferListProps = {
              onChange: handleChange,
            }
            if (args.variant !== undefined) tlProps.variant = args.variant
            if (args.dropdownLabel !== undefined)
              tlProps.dropdownLabel = args.dropdownLabel
            if (args.dropdownOptions !== undefined)
              tlProps.dropdownOptions = args.dropdownOptions
            if (args.itemLabelMap !== undefined)
              tlProps.itemLabelMap = args.itemLabelMap
            if (typeof args.sacredtheme === 'boolean')
              tlProps.sacredtheme = args.sacredtheme
            if (args.className !== undefined) tlProps.className = args.className
            if (args.style !== undefined) tlProps.style = args.style
            if (args.leftTitle !== undefined) tlProps.leftTitle = args.leftTitle
            if (args.rightTitle !== undefined)
              tlProps.rightTitle = args.rightTitle
            if (args.variant === 'singleSelection') {
              tlProps.leftItems = localLeft
              tlProps.rightItems = localRight
            } else if (args.variant === 'multipleSelection') {
              tlProps.dropdownDataMap = localDataMap
            }
            return <TransferList {...tlProps} />
          })()}
        </div>
      )
    }
    return <Component />
  },
  args: {
    variant: 'singleSelection',
    leftItems: singleLeftItems,
    rightItems: singleRightItems,
    dropdownLabel: 'Select Category',
    dropdownOptions: dropdownOptions,
    dropdownDataMap: dropdownDataMap,
    itemLabelMap: itemLabelMap,
    onChange: (left, right, dropdownValue) => {
      console.log('Premium TransferList updated:', {
        left,
        right,
        dropdownValue,
      })
    },
    sacredtheme: false,
  },
}

/**
 * 2) Sacred Theme
 */
export const SacredTheme: Story = {
  render: args => {
    const Component = () => {
      const [localLeft, setLocalLeft] = React.useState(
        args.leftItems ?? singleLeftItems
      )
      const [localRight, setLocalRight] = React.useState(
        args.rightItems ?? singleRightItems
      )
      const [localDataMap, setLocalDataMap] =
        React.useState<TransferListDropdownDataMap>(
          args.dropdownDataMap ?? dropdownDataMap
        )
      const handleChange = (
        newLeft: string[],
        newRight: string[],
        dropdownValue?: string
      ) => {
        if (args.variant === 'multipleSelection' && dropdownValue) {
          setLocalDataMap(prev => ({
            ...prev,
            [dropdownValue]: { leftItems: newLeft, rightItems: newRight },
          }))
        } else {
          setLocalLeft(newLeft)
          setLocalRight(newRight)
        }
        args.onChange?.(newLeft, newRight, dropdownValue)
      }
      return (
        <div
          style={{
            width: '700px',
            padding: '24px',
            background: 'rgba(0, 0, 0, 0.9)',
            borderRadius: '8px',
            border: '1px solid rgba(250, 204, 21, 0.3)',
          }}
        >
          <h3
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#ffd700',
              marginBottom: '16px',
              fontFamily: "'Cinzel', Georgia, serif",
            }}
          >
            Sacred TransferList
          </h3>
          {(() => {
            const tlProps: import('./index').TransferListProps = {
              onChange: handleChange,
            }
            if (args.variant !== undefined) tlProps.variant = args.variant
            if (args.dropdownLabel !== undefined)
              tlProps.dropdownLabel = args.dropdownLabel
            if (args.dropdownOptions !== undefined)
              tlProps.dropdownOptions = args.dropdownOptions
            if (args.itemLabelMap !== undefined)
              tlProps.itemLabelMap = args.itemLabelMap
            if (typeof args.sacredtheme === 'boolean')
              tlProps.sacredtheme = args.sacredtheme
            if (args.className !== undefined) tlProps.className = args.className
            if (args.style !== undefined) tlProps.style = args.style
            if (args.leftTitle !== undefined) tlProps.leftTitle = args.leftTitle
            if (args.rightTitle !== undefined)
              tlProps.rightTitle = args.rightTitle
            if (args.variant === 'singleSelection') {
              tlProps.leftItems = localLeft
              tlProps.rightItems = localRight
            } else if (args.variant === 'multipleSelection') {
              tlProps.dropdownDataMap = localDataMap
            }
            return <TransferList {...tlProps} />
          })()}
        </div>
      )
    }
    return <Component />
  },
  args: {
    ...PremiumTheme.args,
    sacredtheme: true,
  },
}

const InteractiveDemoRenderer = () => {
  const [left, setLeft] = React.useState(singleLeftItems)
  const [right, setRight] = React.useState(singleRightItems)
  const [sacredtheme, setsacredtheme] = React.useState(false)

  const handleChange = (newLeft: string[], newRight: string[]) => {
    setLeft(newLeft)
    setRight(newRight)
  }

  return (
    <div
      style={{
        width: '800px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div
        style={{
          padding: '16px',
          background: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
        }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={sacredtheme}
            onChange={e => setsacredtheme(e.target.checked)}
          />
          Enable Sacred Theme
        </label>
      </div>
      <div
        style={{
          padding: '24px',
          borderRadius: '8px',
          ...(sacredtheme
            ? {
                background: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(250, 204, 21, 0.3)',
              }
            : { background: '#f9fafb' }),
        }}
      >
        <TransferList
          leftItems={left}
          rightItems={right}
          onChange={handleChange}
          sacredtheme={sacredtheme}
        />
      </div>
    </div>
  )
}

/**
 * 3) Dark Theme
 *
 * Exercises the `styles={{ theme: 'dark' }}` API (the legacy `sacredtheme`
 * boolean can only express sacred-vs-light, so a dark canvas fell back to the
 * light palette and rendered invisible headings). The column headings now use
 * --goobs-dark-text #e2e8f0 = 14.39:1 on the #111827 canvas; item labels use
 * the same on the #1e293b list surface = 11.87:1. Pinned to the dark canvas so
 * the contrast sweep audits the dark palette on its intended background.
 */
const DarkThemeRenderer = () => {
  const [left, setLeft] = React.useState(singleLeftItems)
  const [right, setRight] = React.useState(singleRightItems)
  const handleChange = (newLeft: string[], newRight: string[]) => {
    setLeft(newLeft)
    setRight(newRight)
  }
  return (
    <div
      style={{
        width: '700px',
        padding: '24px',
        background: '#111827',
        borderRadius: '8px',
        border: '1px solid #334155',
      }}
    >
      <h3
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: '#e2e8f0',
          marginBottom: '16px',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Dark TransferList
      </h3>
      <TransferList
        leftItems={left}
        rightItems={right}
        onChange={handleChange}
        styles={{ theme: 'dark' }}
      />
    </div>
  )
}

export const DarkTheme: Story = {
  render: () => <DarkThemeRenderer />,
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * 4) Interactive Demo
 */
export const InteractiveDemo: Story = {
  render: () => <InteractiveDemoRenderer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Each side is now a real, named <ul> list whose heading owns the column.
    // Anchor on the column that owns each heading.
    const leftColumn = canvas.getByRole('heading', {
      name: 'Unassigned',
    }).parentElement
    const rightColumn = canvas.getByRole('heading', {
      name: 'Assigned',
    }).parentElement

    // Each row is a REAL native checkbox (input type=checkbox), not a <button>
    // wrapping a nested checkbox (the old nested-interactive markup — WCAG
    // 4.1.2). Prove the item exposes the checkbox role + accessible name…
    const itemACheckbox = canvas.getByRole('checkbox', { name: 'Item A' })
    await expect(itemACheckbox).not.toBeChecked()
    // …and is no longer announced as a button.
    await expect(canvas.queryByRole('button', { name: 'Item A' })).toBeNull()

    // Item A starts in the Unassigned (left) column.
    const itemToMove = await canvas.findByText('Item A')
    await expect(leftColumn).toContainElement(itemToMove)

    // Clicking the label toggles the native checkbox (real htmlFor binding).
    await userEvent.click(itemToMove)
    await expect(itemACheckbox).toBeChecked()

    // The transfer button is named by its DESTINATION LIST (WCAG 1.3.3 / 2.4.6),
    // not by spatial direction: with the default titles the "move selected"
    // button reads "move selected to Assigned", never "move selected right".
    const moveRightButton = await canvas.findByRole('button', {
      name: 'move selected to Assigned',
    })
    await userEvent.click(moveRightButton)

    // Assert the move actually happened: Item A now renders inside the
    // Assigned column and no longer inside Unassigned.
    const movedItem = await canvas.findByText('Item A')
    await expect(rightColumn).toContainElement(movedItem)
    await expect(leftColumn).not.toContainElement(movedItem)

    // The transfer was announced to screen-reader users via the polite status
    // live region (WCAG 4.1.3 Status Messages).
    const status = canvas.getByRole('status')
    await expect(status).toHaveTextContent(/Moved 1 item to Assigned/)
  },
}

/**
 * 5) Accessible structure — real headings + real lists.
 *
 * The transfer list is embedded under a real `<h2>` section; its column titles
 * render as consumer-controlled `<h3>` elements (via `headingLevel`, WCAG 1.3.1
 * / SEO), and each side is a real `<ul>` named by its heading. Exercises the
 * markup that lets screen-reader and search-engine users perceive the outline
 * and list structure — none of which existed when the titles were styled
 * `<div>`s and the items were `<button>`s in a `<div>`.
 *
 * Also pins the review-fix invariants: each list carries an EXPLICIT
 * `role="list"` and each row an EXPLICIT `role="listitem"` (Safari strips the
 * implicit roles when `list-style: none`, so the attributes must be present —
 * `getByRole('list')` alone would false-pass in jsdom), the composite
 * `role="group"` is NAMED (`aria-label` from the column titles) rather than an
 * anonymous, context-free "group", AND every transfer button names its
 * destination LIST by the consumer's title ("move all to On team", not the
 * spatial "move all right") so the button names agree with the group name and
 * adapt to `leftTitle`/`rightTitle` (WCAG 1.3.3 / 2.4.6).
 */
const AccessibleStructureRenderer = () => {
  const [left, setLeft] = React.useState(singleLeftItems)
  const [right, setRight] = React.useState(singleRightItems)
  return (
    <div style={{ width: '700px', padding: '24px' }}>
      <h2 style={{ marginBottom: '12px' }}>Team roster</h2>
      <TransferList
        leftItems={left}
        rightItems={right}
        headingLevel={3}
        leftTitle="Available"
        rightTitle="On team"
        onChange={(newLeft, newRight) => {
          setLeft(newLeft)
          setRight(newRight)
        }}
      />
    </div>
  )
}

export const AccessibleStructure: Story = {
  render: () => <AccessibleStructureRenderer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Column titles are REAL, level-3 headings (not styled divs), keeping the
    // outline correct beneath the section's <h2>.
    await expect(
      canvas.getByRole('heading', { level: 3, name: 'Available' })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('heading', { level: 3, name: 'On team' })
    ).toBeInTheDocument()

    // Both sides are real lists, and each is programmatically named by its
    // column heading (aria-labelledby).
    const lists = canvas.getAllByRole('list')
    await expect(lists.length).toBeGreaterThanOrEqual(2)
    await expect(
      canvas.getByRole('list', { name: 'Available' })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('list', { name: 'On team' })
    ).toBeInTheDocument()

    // The `role="list"` must be an EXPLICIT attribute, not just the <ul>'s
    // implicit role: Safari drops the implicit list/listitem roles when
    // `list-style` computes to `none` (which `.listInner` sets), so VoiceOver
    // only announces "list, N items" if the attribute is literally present.
    // jsdom keeps the implicit role, so `getByRole('list')` above would
    // false-pass — assert the raw attribute so a regression that removes it
    // fails here.
    const uls = canvasElement.querySelectorAll('ul')
    await expect(uls.length).toBeGreaterThanOrEqual(2)
    uls.forEach(ul => expect(ul.getAttribute('role')).toBe('list'))

    // Every row carries an explicit `role="listitem"` for the same reason.
    const items = canvasElement.querySelectorAll('li')
    await expect(items.length).toBeGreaterThanOrEqual(1)
    items.forEach(li => expect(li.getAttribute('role')).toBe('listitem'))

    // The composite group is NAMED (aria-label built from the column titles),
    // so assistive tech announces its purpose instead of a bare "group". An
    // unnamed group would not be findable by this accessible name.
    await expect(
      canvas.getByRole('group', {
        name: 'Transfer items between Available and On team',
      })
    ).toBeInTheDocument()

    // Every transfer button names its DESTINATION LIST by the consumer's title
    // (WCAG 1.3.3 Sensory Characteristics / 2.4.6 Headings & Labels), so the
    // button names AGREE with the group name above rather than contradicting it:
    // before the fix the group said "…between Available and On team" while the
    // buttons said the spatial "move all right / left". A screen-reader user with
    // no visual left/right mapping can now tell which list each button targets.
    // The four buttons must be findable by these destination-derived names — a
    // regression to hardcoded "right"/"left" labels fails here.
    await expect(
      canvas.getByRole('button', { name: 'move all to On team' })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: 'move selected to On team' })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: 'move selected to Available' })
    ).toBeInTheDocument()
    await expect(
      canvas.getByRole('button', { name: 'move all to Available' })
    ).toBeInTheDocument()

    // And the removed spatial names no longer exist anywhere.
    await expect(
      canvas.queryByRole('button', { name: 'move all right' })
    ).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'move all left' })
    ).toBeNull()
  },
}

/**
 * 7) Whole-row click toggles selection.
 *
 * The row `<li>` carries `data-action="toggle"` and `data-checked` (the machine
 * test selectors) and the CSS paints it with `cursor: pointer` + a hover
 * affordance. That affordance is truthful: a pointer click anywhere on the row
 * (its padding / inter-control gaps — where `event.target` is the `<li>`
 * itself) toggles the row's checkbox, so a consumer test driving a row via
 * `[data-action="toggle"]` toggles rather than silently no-opping. `fireEvent`
 * dispatches directly on the `<li>` (target === the row), exercising the guard
 * path specifically; clicks that land on the checkbox/label are still handled
 * natively (and would double-fire without the guard). Toggling twice returns to
 * the unchecked state, proving the row click is a genuine toggle.
 */
const RowClickToggleRenderer = () => {
  const [left, setLeft] = React.useState(singleLeftItems)
  const [right, setRight] = React.useState(singleRightItems)
  return (
    <div style={{ width: '700px', padding: '24px' }}>
      <TransferList
        leftItems={left}
        rightItems={right}
        onChange={(newLeft, newRight) => {
          setLeft(newLeft)
          setRight(newRight)
        }}
      />
    </div>
  )
}

export const RowClickToggle: Story = {
  render: () => <RowClickToggleRenderer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Item A's row + its native checkbox. The checkbox starts unchecked.
    const itemACheckbox = canvas.getByRole('checkbox', { name: 'Item A' })
    await expect(itemACheckbox).not.toBeChecked()

    // The row that owns Item A, addressed by the machine selector.
    const itemALabel = canvas.getByText('Item A')
    const row = itemALabel.closest('[data-action="toggle"]') as HTMLElement
    await expect(row).not.toBeNull()

    // A click that targets the row itself (its padding) toggles the checkbox —
    // the guarded row onClick fires because event.target === the <li>. Before
    // the fix this <li> was inert and the click was a silent no-op.
    await fireEvent.click(row)
    await expect(itemACheckbox).toBeChecked()
    await expect(row).toHaveAttribute('data-checked', 'true')

    // Clicking the row again untoggles it — a genuine two-way toggle, not a
    // one-shot, and never a double-toggle that would land back where it started
    // on the first click.
    await fireEvent.click(row)
    await expect(itemACheckbox).not.toBeChecked()
    await expect(row).not.toHaveAttribute('data-checked')
  },
}

const errorSchema = z.object({
  assignedSkills: z.array(z.string()).min(1, 'Assign at least one skill.'),
})

/**
 * 6) Validation error — visible AND announced.
 *
 * Bound into a `<Form>` whose schema requires at least one assigned item. A
 * blocked submit now renders the engine's error as visible text inside a
 * `role="alert"` region (before this pass the component read the error but
 * NEVER rendered it — a silent WCAG 3.3.1 failure), and marks the group
 * `aria-invalid` + `aria-describedby` so assistive tech ties the message to the
 * field.
 */
export const ValidationError: Story = {
  render: () => (
    <div style={{ width: '700px', padding: '24px' }}>
      <Form
        schema={errorSchema}
        initialValues={{ assignedSkills: [] }}
        onSubmit={() => {}}
        subject="skills"
      >
        <TransferList
          name="assignedSkills"
          leftItems={['Design', 'Engineering', 'Sales']}
          leftTitle="Available"
          rightTitle="Assigned"
          onChange={() => {}}
        />
        <button type="submit" style={{ marginTop: '16px' }}>
          Save
        </button>
      </Form>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // No visible field error before submit. (The error is queried by its text,
    // not by role="alert", because the parent <Form> also renders an
    // always-present role="alert" summary region.)
    await expect(
      canvas.queryByText('Assign at least one skill.')
    ).toBeNull()

    // Submitting with nothing assigned fails the min(1) rule.
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))

    // The error is now rendered, visible, and in an alert region…
    const errorText = await canvas.findByText('Assign at least one skill.')
    await expect(errorText).toHaveAttribute('role', 'alert')

    // …and the composite group is marked invalid + linked to that message.
    const group = canvas.getByRole('group')
    await expect(group).toHaveAttribute('aria-invalid', 'true')
    await expect(group).toHaveAttribute('aria-describedby', errorText.id)
  },
}

/**
 * 8) Keyboard focus is retained across a transfer.
 *
 * Activating a transfer arrow can disable that very button — "move all right"
 * empties the left list, so its own precondition (`currentLeft.length === 0`)
 * becomes true. A focused element that becomes disabled is blurred by the
 * browser and focus falls to `<body>`, dropping a keyboard user out of the
 * control (WCAG 2.4.3 Focus Order / 2.4.7 Focus Visible). After each move the
 * component redirects focus to the first still-enabled transfer button, so
 * focus never leaves the button group. Here, moving every item right disables
 * "move all right"; focus lands on the now-enabled reciprocal "move all left".
 *
 * jsdom does NOT auto-blur a disabled element, so before the fix focus would
 * remain trapped on the now-disabled button — this play fails against that
 * pre-fix behavior (and against a real browser, where focus would instead have
 * fallen to `<body>`).
 */
const FocusRetentionRenderer = () => {
  const [left, setLeft] = React.useState(['Item A', 'Item B'])
  const [right, setRight] = React.useState<string[]>([])
  return (
    <div style={{ width: '700px', padding: '24px' }}>
      <TransferList
        leftItems={left}
        rightItems={right}
        onChange={(newLeft, newRight) => {
          setLeft(newLeft)
          setRight(newRight)
        }}
      />
    </div>
  )
}

export const FocusRetainedAfterTransfer: Story = {
  render: () => <FocusRetentionRenderer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Buttons are named by destination list (WCAG 1.3.3 / 2.4.6): with default
    // titles, "move all to Assigned" / "move all to Unassigned" — not
    // "move all right" / "move all left".
    const moveAllRight = canvas.getByRole('button', {
      name: 'move all to Assigned',
    })
    const moveAllLeft = canvas.getByRole('button', {
      name: 'move all to Unassigned',
    })

    // Before the transfer: the left list has items so "move all right" is
    // enabled, and "move all left" is disabled (the right list is empty).
    await expect(moveAllRight).toBeEnabled()
    await expect(moveAllLeft).toBeDisabled()

    // Activating "move all right" moves every item right, which flips the button
    // that was just used to disabled.
    await userEvent.click(moveAllRight)
    await expect(moveAllRight).toBeDisabled()

    // Focus is redirected to the first still-enabled transfer button rather than
    // being dropped on the now-disabled button (or lost to <body>): the
    // reciprocal "move all left" (the right list is now non-empty) takes focus.
    await waitFor(() => expect(moveAllLeft).toHaveFocus())
    await expect(moveAllRight).not.toHaveFocus()
    await expect(document.body).not.toHaveFocus()
  },
}

/**
 * 9) Multiple-selection variant — category combobox is NAMED, plus end-to-end
 *    coverage for the previously-untested dropdown-driven path.
 *
 * The `multipleSelection` variant swaps the left column's heading for a category
 * `Dropdown` (`role="combobox"`) that chooses which item set the two lists show.
 * Field/Dropdown derives the combobox's accessible name from its `label`, so when
 * a consumer omits `dropdownLabel`, TransferList must still supply a meaningful
 * fallback — otherwise the combobox is left with only the weak content-derived
 * "Select…" name (WCAG 4.1.2 Name, Role, Value). This renders WITHOUT
 * `dropdownLabel` and asserts the combobox is findable by the "Category"
 * fallback. It also exercises the whole variant end-to-end — the entire
 * `multipleSelection` path had NO story/play coverage before — selecting a
 * category, transferring an item, and confirming the polite status announcement.
 */
const MultipleSelectionRenderer = () => {
  const [dataMap, setDataMap] =
    React.useState<TransferListDropdownDataMap>(dropdownDataMap)
  return (
    <div style={{ width: '700px', padding: '24px' }}>
      {/* No `dropdownLabel` — exercises the "Category" accessible-name fallback. */}
      <TransferList
        variant="multipleSelection"
        dropdownOptions={dropdownOptions}
        dropdownDataMap={dataMap}
        onChange={(newLeft, newRight, dropdownValue) => {
          if (dropdownValue) {
            setDataMap(prev => ({
              ...prev,
              [dropdownValue]: { leftItems: newLeft, rightItems: newRight },
            }))
          }
        }}
      />
    </div>
  )
}

export const MultipleSelection: Story = {
  render: () => <MultipleSelectionRenderer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // With `dropdownLabel` omitted, the category combobox still has a real
    // accessible name ("Category" fallback) rather than the weak content-derived
    // "Select…" (WCAG 4.1.2). A regression to `label={dropdownLabel || ''}` would
    // fail this lookup.
    const combobox = canvas.getByRole('combobox', { name: 'Category' })
    await expect(combobox).toBeInTheDocument()

    // Open the category dropdown and choose a category…
    await userEvent.click(combobox)
    const option = await canvas.findByRole('option', { name: 'knowledgebase' })
    await userEvent.click(option)

    // …which populates the left (Available) list with that category's items. The
    // list falls back to the "Available items" name in this headingless variant.
    const availableList = canvas.getByRole('list', { name: 'Available items' })
    await expect(
      within(availableList).getByText('Solar Flares')
    ).toBeInTheDocument()

    // Select an item and move it to the Assigned list — exercises the
    // multipleSelection transfer path end-to-end (the selected category value is
    // threaded back through `onChange` so the correct data-map bucket updates).
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Solar Flares' }))
    await userEvent.click(
      canvas.getByRole('button', { name: 'move selected to Assigned' })
    )

    // The Assigned list now contains the moved item…
    const assignedList = canvas.getByRole('list', { name: 'Assigned' })
    await expect(
      within(assignedList).getByText('Solar Flares')
    ).toBeInTheDocument()

    // …and the transfer was announced to screen-reader users (WCAG 4.1.3).
    await expect(canvas.getByRole('status')).toHaveTextContent(
      /Moved 1 item to Assigned/
    )
  },
}

/**
 * 10) Accessibility — forced colors / Windows High Contrast (WCAG 1.4.1, 2.4.7)
 *
 * Regression gate for the forced-colors fix. In forced-colors / Windows High
 * Contrast Mode the UA drops every `box-shadow` and repaints backgrounds/borders
 * from a small system palette. That erases the checked-row selection cue — the
 * `data-checked` background tint + glow box-shadow vanish and the 4px accent left
 * border is repainted to the same system colour as every other row — so a
 * selected row no longer stands out at the row level (selection still reads via
 * the native checkbox, the non-colour backstop). The fix adds a
 * `@media (forced-colors: active)` block that restores a system-`Highlight`
 * outline on the checked row and pins the transfer buttons' focus outline to the
 * system focus colour. A play function cannot flip the OS forced-colors
 * preference, so this asserts — via the CSSOM, scoped to THIS component's hashed
 * CSS-module classes — that TransferList's own forced-colors block still exists
 * and still restores BOTH the checked-row selection cue and the button focus
 * indicator. If a future edit drops or weakens the block, this re-fails.
 */
const ForcedColorsRenderer = () => {
  const [left, setLeft] = React.useState(singleLeftItems)
  const [right, setRight] = React.useState(singleRightItems)
  return (
    <div
      style={{
        width: '700px',
        padding: '24px',
        // Sacred surfaces read correctly only on a dark backdrop.
        background: '#0e0e0e',
        borderRadius: '8px',
      }}
    >
      <TransferList
        leftItems={left}
        rightItems={right}
        styles={{ theme: 'sacred' }}
        onChange={(newLeft, newRight) => {
          setLeft(newLeft)
          setRight(newRight)
        }}
      />
    </div>
  )
}

export const AccessibilityForcedColors: Story = {
  name: 'Accessibility - Forced Colors (WCAG 1.4.1)',
  render: () => <ForcedColorsRenderer />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check a row so the checked-row selection styling is present in the DOM.
    const itemACheckbox = canvas.getByRole('checkbox', { name: 'Item A' })
    await userEvent.click(itemACheckbox)
    await expect(itemACheckbox).toBeChecked()

    // Collect this component's hashed CSS-module class tokens to scope the CSSOM
    // search — so another component's forced-colors block can never false-green
    // this gate.
    const root = canvasElement.querySelector(
      '[data-component="TransferList"]'
    ) as HTMLElement
    const scopeTokens = new Set<string>()
    for (const element of [root, ...Array.from(root.querySelectorAll('*'))]) {
      if (typeof element.className !== 'string') continue
      for (const token of element.className.trim().split(/\s+/).filter(Boolean)) {
        scopeTokens.add(token)
      }
    }
    expect(scopeTokens.size).toBeGreaterThan(0)

    // Collect every style rule inside a `forced-colors: active` media block from
    // the same-origin injected stylesheets. Cross-origin sheets throw on
    // `.cssRules` and are skipped.
    const forcedColorsRules: CSSStyleRule[] = []
    const visit = (rules: CSSRuleList) => {
      for (const rule of Array.from(rules)) {
        if (rule instanceof CSSMediaRule) {
          const mediaText = rule.media.mediaText
          if (/forced-colors/i.test(mediaText) && /active/i.test(mediaText)) {
            for (const inner of Array.from(rule.cssRules)) {
              if (inner instanceof CSSStyleRule) forcedColorsRules.push(inner)
            }
            continue
          }
        }
        if ('cssRules' in rule) {
          visit((rule as CSSGroupingRule).cssRules)
        }
      }
    }
    for (const sheet of Array.from(document.styleSheets)) {
      try {
        visit(sheet.cssRules)
      } catch {
        // Cross-origin / non-inspectable stylesheet — ignore.
      }
    }

    // Scope to TransferList's own forced-colors rules via its hashed class tokens.
    const tlRules = forcedColorsRules.filter(
      rule =>
        typeof rule.selectorText === 'string' &&
        Array.from(scopeTokens).some(token => rule.selectorText.includes(token))
    )
    expect(tlRules.length).toBeGreaterThan(0)

    // The checked-row selection cue must be restored with a forced-colors-safe
    // primitive (an outline / border) since the tint + box-shadow are dropped.
    const restoresSelectionCue = tlRules.some(
      rule =>
        /checked/i.test(rule.selectorText) &&
        (rule.style.getPropertyValue('outline').trim() !== '' ||
          rule.style.getPropertyValue('outline-style').trim() !== '' ||
          rule.style.getPropertyValue('border').trim() !== '' ||
          rule.style.getPropertyValue('border-color').trim() !== '')
    )
    expect(restoresSelectionCue).toBe(true)

    // Keyboard focus on the transfer buttons must stay visible (an outline
    // survives forced-colors where box-shadow is dropped).
    const restoresFocusOutline = tlRules.some(
      rule =>
        /focus-visible/i.test(rule.selectorText) &&
        (rule.style.getPropertyValue('outline').trim() !== '' ||
          rule.style.getPropertyValue('outline-style').trim() !== '')
    )
    expect(restoresFocusOutline).toBe(true)
  },
}
