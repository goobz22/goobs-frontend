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
}
