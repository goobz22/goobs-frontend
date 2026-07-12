import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import ListItemCard from './index'
import IconButton from '../IconButton'

const meta: Meta<typeof ListItemCard> = {
  title: 'Components/ListItemCard',
  component: ListItemCard,
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj<typeof ListItemCard>

interface Step {
  id: string
  name: string
  description: string
}

const initialSteps: Step[] = [
  { id: 'a', name: 'Collect requirements', description: 'Kickoff call' },
  { id: 'b', name: 'Draft proposal', description: 'Pricing + scope' },
  { id: 'c', name: 'Client review', description: 'Awaiting sign-off' },
]

/**
 * Full interactive list: selectable rows with numbered order badge, leading
 * icon, keyboard ↑/↓ reorder (composed Card.DragHandle), a custom edit action,
 * and a remove control (composed IconButton).
 */
function EditableList() {
  const [steps, setSteps] = useState<Step[]>(initialSteps)
  const [selectedId, setSelectedId] = useState<string>('a')

  const move = (index: number, delta: number) => {
    setSteps(prev => {
      const next = [...prev]
      const target = index + delta
      if (target < 0 || target >= next.length) return prev
      const [item] = next.splice(index, 1)
      if (!item) return prev
      next.splice(target, 0, item)
      return next
    })
  }

  return (
    <ul role="list" style={{ display: 'grid', gap: 8, padding: 0, margin: 0 }}>
      {steps.map((step, index) => (
        <ListItemCard
          key={step.id}
          selected={selectedId === step.id}
          onSelect={() => setSelectedId(step.id)}
          onRemove={() => setSteps(prev => prev.filter(s => s.id !== step.id))}
          {...(index > 0 ? { onMoveUp: () => move(index, -1) } : {})}
          {...(index < steps.length - 1
            ? { onMoveDown: () => move(index, +1) }
            : {})}
          reorderLabel={`Reorder ${step.name}`}
          accentColor="#22c55e"
        >
          <ListItemCard.Order>{index + 1}</ListItemCard.Order>
          <ListItemCard.Icon>📍</ListItemCard.Icon>
          <ListItemCard.Content title={step.name} subtitle={step.description} />
          <ListItemCard.Actions>
            <IconButton size="xsmall" color="primary" aria-label="Edit step">
              ✎
            </IconButton>
          </ListItemCard.Actions>
        </ListItemCard>
      ))}
    </ul>
  )
}

export const EditableReorderableList: Story = {
  render: () => <EditableList />,
  globals: { backgrounds: { value: 'sacred' } },
}

export const SingleRow: Story = {
  render: () => (
    <ul role="list" style={{ padding: 0, margin: 0 }}>
      <ListItemCard onRemove={() => {}}>
        <ListItemCard.Icon>📄</ListItemCard.Icon>
        <ListItemCard.Content
          title="contract-final.pdf"
          subtitle="2.4 MB · uploaded just now"
        />
      </ListItemCard>
    </ul>
  ),
  globals: { backgrounds: { value: 'sacred' } },
}

export const SelectedDark: Story = {
  render: () => (
    <ul role="list" style={{ padding: 0, margin: 0 }}>
      <ListItemCard selected onSelect={() => {}} styles={{ theme: 'dark' }}>
        <ListItemCard.Order>1</ListItemCard.Order>
        <ListItemCard.Content title="Primary contact" subtitle="Jane Doe" />
      </ListItemCard>
    </ul>
  ),
  globals: { backgrounds: { value: 'dark' } },
}

/**
 * Accessible name of a SELECTABLE row.
 *
 * Each `onSelect` row wraps its naming content in a native `<button>` toggle
 * target (Enter/Space activate; `aria-pressed` reflects `selected`). Its
 * accessible NAME comes from `aria-labelledby` pointed at the Content title +
 * subtitle spans — so a screen reader announces "Draft proposal, Pricing +
 * scope, toggle button, pressed" rather than a concatenation of the order badge,
 * leading icon, and every nested control's label. This story keeps a single
 * `selectedId` (a single-select PRESENTATION), but the underlying widgets are
 * INDEPENDENT toggle buttons — `aria-pressed` conveys each row's own pressed
 * state, not mutual exclusivity (see `MultiSelectToggle`). The selected state is
 * conveyed non-visually via `aria-pressed` (never by the accent ring alone); the
 * order badge and leading icon stay `aria-hidden` so they don't pollute the name.
 */
function SelectableList() {
  const [selectedId, setSelectedId] = useState<string>('b')
  return (
    <ul role="list" style={{ display: 'grid', gap: 8, padding: 0, margin: 0 }}>
      {initialSteps.map((step, index) => (
        <ListItemCard
          key={step.id}
          selected={selectedId === step.id}
          onSelect={() => setSelectedId(step.id)}
          styles={{ theme: 'light' }}
        >
          <ListItemCard.Order>{index + 1}</ListItemCard.Order>
          <ListItemCard.Icon>📍</ListItemCard.Icon>
          <ListItemCard.Content title={step.name} subtitle={step.description} />
        </ListItemCard>
      ))}
    </ul>
  )
}

export const SelectableAccessibleName: Story = {
  render: () => <SelectableList />,
  globals: { backgrounds: { value: 'light' } },
}

/**
 * MULTI-SELECT toggle semantics.
 *
 * The selectable row is a toggle `<button>` (`aria-pressed`), so a list of them
 * models INDEPENDENT / multi-select: several rows can be pressed at once and each
 * reports its OWN `aria-pressed` state (a screen reader announces "…, toggle
 * button, pressed" per selected row). This is exactly what `aria-pressed`
 * conveys — it does NOT imply the mutual exclusivity of a radiogroup/listbox.
 * The single-select `SelectableAccessibleName` story above is the SAME toggle
 * buttons with one id kept; true single-select grouping (radiogroup / listbox
 * roles) belongs on the container, not on this single-`<li>` primitive, so the
 * row correctly ships the valid toggle-button semantics instead of an orphan
 * `role="radio"`.
 */
function MultiSelectList() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['a', 'c'])
  const toggle = (id: string) =>
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  return (
    <ul role="list" style={{ display: 'grid', gap: 8, padding: 0, margin: 0 }}>
      {initialSteps.map((step, index) => (
        <ListItemCard
          key={step.id}
          selected={selectedIds.includes(step.id)}
          onSelect={() => toggle(step.id)}
          styles={{ theme: 'light' }}
        >
          <ListItemCard.Order>{index + 1}</ListItemCard.Order>
          <ListItemCard.Content title={step.name} subtitle={step.description} />
        </ListItemCard>
      ))}
    </ul>
  )
}

export const MultiSelectToggle: Story = {
  render: () => <MultiSelectList />,
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Content-less selectable row named via `selectLabel`.
 *
 * A selectable row (`onSelect`) whose only visible descendants are the
 * `aria-hidden` leading icon has no `<ListItemCard.Content>` text to name its
 * `<button>`. Passing `selectLabel` sets an explicit `aria-label`, so the toggle
 * button announces e.g. "Sun, toggle button" instead of an EMPTY name
 * (WCAG 4.1.2). Without `selectLabel` here the component would `console.warn` in
 * development about a nameless select target — this story exercises that guarded
 * escape hatch (and must NOT warn).
 */
function IconOnlySelectableList() {
  const swatches = [
    { id: 'sun', glyph: '☀️', label: 'Sun' },
    { id: 'moon', glyph: '🌙', label: 'Moon' },
    { id: 'star', glyph: '⭐', label: 'Star' },
  ]
  const [selectedId, setSelectedId] = useState<string>('sun')
  return (
    <ul role="list" style={{ display: 'grid', gap: 8, padding: 0, margin: 0 }}>
      {swatches.map(swatch => (
        <ListItemCard
          key={swatch.id}
          selected={selectedId === swatch.id}
          onSelect={() => setSelectedId(swatch.id)}
          selectLabel={swatch.label}
          styles={{ theme: 'light' }}
        >
          <ListItemCard.Icon>{swatch.glyph}</ListItemCard.Icon>
        </ListItemCard>
      ))}
    </ul>
  )
}

export const SelectableWithSelectLabel: Story = {
  render: () => <IconOnlySelectableList />,
  globals: { backgrounds: { value: 'light' } },
}
