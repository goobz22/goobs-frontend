/** @fileoverview Regression stories for form transactions and schema validation. */
import React, { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { expect, userEvent, within } from 'storybook/test'
import { z } from 'zod'
import Form from './index'
import { useFormContext } from './context'
import { useFieldArray } from './useFieldArray'
import { useFieldValues } from './useFieldValues'
import { useFormField } from './useFormField'
import TextField from '../Field/Text'
import Button from '../Button'

const collectionSchema = z.object({
  tasks: z.array(z.object({ label: z.string() })),
  fields: z.record(z.string(), z.string()),
})
type Collection = z.infer<typeof collectionSchema>

function CollectionControls({ initial }: { initial: Collection }) {
  const { engine } = useFormContext()
  const array = useFieldArray<{ label: string }>('tasks')
  const record = useFieldValues<string>('fields')
  const [snapshot] = useState(engine.values)
  return (
    <>
      <Button
        text="Batch updates"
        styles={{ theme: 'light' }}
        onClick={() => {
          array.append({ label: 'C' })
          array.append({ label: 'D' })
          record.setValue('first', 'one')
          record.setValue('second', 'two')
        }}
      />
      <Button
        text="Move first item"
        styles={{ theme: 'light' }}
        onClick={() => array.move(0, 1)}
      />
      <output data-testid="collection">{JSON.stringify(engine.values)}</output>
      <output data-testid="original">{JSON.stringify(initial)}</output>
      <output data-testid="snapshot">{JSON.stringify(snapshot)}</output>
    </>
  )
}

function PendingStatus() {
  const { engine } = useFormContext()
  return <output data-testid="pending">{String(engine.isSubmitting)}</output>
}

function NestedFields() {
  const street = useFormField('address.street')
  const task = useFormField('tasks.0.label')
  return (
    <>
      <TextField
        name="address.street"
        styles={{ theme: 'light' }}
        label="Street"
        value={String(street.value ?? '')}
        onChange={street.onChange}
        onBlur={street.onBlur}
        error={street.error}
      />
      <TextField
        name="tasks.0.label"
        styles={{ theme: 'light' }}
        label="Task"
        value={String(task.value ?? '')}
        onChange={task.onChange}
        onBlur={task.onBlur}
        error={task.error}
      />
    </>
  )
}

/** Shared by the story and the real-browser regression runner; no mocked engine. */
export function AuditHarness() {
  const [initial] = useState<Collection>(() => ({
    tasks: [{ label: 'A' }, { label: 'B' }],
    fields: {},
  }))
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(
    null
  )
  const [calls, setCalls] = useState(0)
  const completion = useRef<(() => void) | undefined>(undefined)
  return (
    <div>
      <Form<Record<string, unknown>>
        schema={z.object({
          name: z.string().trim(),
          quantity: z.coerce.number(),
          category: z.string().default('general'),
        })}
        initialValues={{ name: '  Alice  ', quantity: '12' }}
        onSubmit={setSubmitted}
        subject="parsed values"
      >
        <Button
          type="submit"
          text="Submit parsed values"
          styles={{ theme: 'light' }}
        />
        <output data-testid="submitted">{JSON.stringify(submitted)}</output>
      </Form>
      <Form
        schema={z.object({
          address: z.object({ street: z.string().min(1, 'Street required') }),
          tasks: z.array(
            z.object({ label: z.string().min(1, 'Task required') })
          ),
        })}
        initialValues={{ address: { street: '' }, tasks: [{ label: '' }] }}
        onSubmit={() => undefined}
        subject="nested fields"
      >
        <NestedFields />
        <Button
          type="submit"
          text="Validate nested fields"
          styles={{ theme: 'light' }}
        />
      </Form>
      <Form
        schema={collectionSchema}
        initialValues={initial}
        onSubmit={() => undefined}
        subject="collections"
      >
        <CollectionControls initial={initial} />
      </Form>
      <Form
        schema={z.object({})}
        initialValues={{}}
        subject="pending save"
        onSubmit={() => {
          setCalls(value => value + 1)
          return new Promise<void>(resolve => {
            completion.current = resolve
          })
        }}
      >
        <Button type="submit" text="Start save" styles={{ theme: 'light' }} />
        <Button
          text="Complete save"
          styles={{ theme: 'light' }}
          onClick={() => completion.current?.()}
        />
        <output data-testid="calls">{calls}</output>
        <PendingStatus />
      </Form>
    </div>
  )
}

const meta: Meta<typeof Form> = {
  title: 'Components/Form/Regressions',
  component: Form,
  excludeStories: ['AuditHarness'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof meta>

/** Parsed output, nested errors, atomic collection updates and an in-flight save. */
export const Transactions: Story = {
  render: () => <AuditHarness />,
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', { name: 'Submit parsed values' })
    )
    await expect(canvas.getByTestId('submitted')).toHaveTextContent(
      '{"name":"Alice","quantity":12,"category":"general"}'
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Validate nested fields' })
    )
    await expect(canvas.getByText('Street required')).toBeVisible()
    await expect(canvas.getByText('Task required')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Move first item' })
    )
    await expect(canvas.getByTestId('original')).toHaveTextContent(
      '{"tasks":[{"label":"A"},{"label":"B"}],"fields":{}}'
    )
    await expect(canvas.getByTestId('snapshot')).toHaveTextContent(
      '{"tasks":[{"label":"A"},{"label":"B"}],"fields":{}}'
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Batch updates' }))
    await expect(canvas.getByTestId('collection')).toHaveTextContent(
      '{"tasks":[{"label":"B"},{"label":"A"},{"label":"C"},{"label":"D"}],"fields":{"first":"one","second":"two"}}'
    )
    const save = canvas.getByRole('button', { name: 'Start save' })
    await userEvent.dblClick(save)
    await expect(canvas.getByTestId('calls')).toHaveTextContent('1')
    await userEvent.click(canvas.getByRole('button', { name: 'Complete save' }))
    await userEvent.click(save)
    await expect(canvas.getByTestId('calls')).toHaveTextContent('2')
    await userEvent.click(canvas.getByRole('button', { name: 'Complete save' }))
  },
}
