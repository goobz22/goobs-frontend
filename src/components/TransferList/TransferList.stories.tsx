// src/components/TransferList/transferlist.stories.tsx

import React from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { z } from 'zod'
import TransferList, { TransferListDropdownDataMap } from './index'
import Form from '../Form'
import { expect, userEvent, within } from 'storybook/test'

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

    const moveRightButton = await canvas.findByRole('button', {
      name: 'move selected right',
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
