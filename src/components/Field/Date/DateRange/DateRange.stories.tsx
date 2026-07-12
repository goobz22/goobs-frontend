/**
 * @fileoverview Storybook stories for the DateRange component.
 * These stories showcase the various states, themes, and styling capabilities of the DateRange field.
 * The DateRange component provides dual date picker inputs for selecting date ranges.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import { within, expect, fn, userEvent } from 'storybook/test'
import { z } from 'zod'
import DateRangeComponent, {
  type DateRange,
  type DateRangeProps,
} from './index'
import Form from '../../../Form'

// Wrapper component for state management
const DateRangeWithState = ({
  initialValue = { start: null, end: null },
  ...props
}: Omit<DateRangeProps, 'value' | 'onChange'> & {
  initialValue?: DateRange
}) => {
  const [value, setValue] = useState<DateRange>(initialValue)
  const handleChange = (dateRange: DateRange) => {
    setValue(dateRange)
  }
  return <DateRangeComponent {...props} value={value} onChange={handleChange} />
}

// --------------------------------------------------------------------------
// STORYBOOK METADATA
// --------------------------------------------------------------------------
const meta: Meta<typeof DateRangeComponent> = {
  title: 'Components/Field/Date/DateRange',
  component: DateRangeComponent,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: { control: 'object' },
    onChange: { action: 'changed' },
    startLabel: { control: 'text' },
    endLabel: { control: 'text' },
    error: { control: 'text' },
    styles: {
      control: 'object',
      description:
        'Comprehensive styling options including theme, colors, layout, and more',
    },
  },
  decorators: [
    Story => (
      <div style={{ width: '600px', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof DateRangeComponent>

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  name: 'Light Theme (Default)',
  render: () => (
    <DateRangeWithState
      startLabel="Start Date"
      endLabel="End Date"
      styles={{ theme: 'light' }}
    />
  ),
  // Light-themed content — pin the light canvas so the light-theme label
  // color is measured (and seen) on the surface it is designed for.
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  render: () => (
    <DateRangeWithState
      startLabel="From Date"
      endLabel="To Date"
      styles={{ theme: 'dark' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  render: () => (
    <DateRangeWithState
      startLabel="Era Beginning"
      endLabel="Era End"
      styles={{ theme: 'sacred' }}
    />
  ),
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// CUSTOM COLOR STORIES
// --------------------------------------------------------------------------

export const CustomColors: Story = {
  render: () => (
    <DateRangeWithState
      startLabel="Custom Start"
      endLabel="Custom End"
      styles={{
        theme: 'light',
        backgroundColor: 'rgba(255, 248, 220, 0.95)',
        borderColor: 'rgba(255, 165, 0, 0.4)',
        borderFocusedColor: 'rgba(255, 165, 0, 1)',
        textColor: 'rgba(139, 69, 19, 1)',
        // Full-opacity saddle-brown: the 0.7-alpha variant blends to
        // #ae7d5a on white (3.57:1 < 4.5). Solid #8b4513 is 7.10:1.
        labelColor: 'rgba(139, 69, 19, 1)',
      }}
    />
  ),
  // Light-themed demo — pin the light canvas (it previously inherited the
  // sacred #0e0e0e canvas, where the brown label measured 1.91:1).
  globals: { backgrounds: { value: 'light' } },
}

export const NeonStyle: Story = {
  render: () => (
    <DateRangeWithState
      startLabel="Neon Start"
      endLabel="Neon End"
      styles={{
        theme: 'dark',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderColor: 'rgba(255, 0, 255, 0.5)',
        borderFocusedColor: 'rgba(255, 0, 255, 1)',
        textColor: 'rgba(255, 0, 255, 1)',
        // Full-opacity magenta: 0.7 alpha blends to #b807be on the dark
        // canvas (3.22:1 < 4.5). Solid #ff00ff is 5.66:1 on #111827.
        labelColor: 'rgba(255, 0, 255, 1)',
        borderRadius: '12px',
        borderWidth: '2px',
      }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

// --------------------------------------------------------------------------
// LAYOUT AND SPACING STORIES
// --------------------------------------------------------------------------

export const CustomLayout: Story = {
  name: 'Custom Layout & Spacing',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <DateRangeWithState
        startLabel="Large Padding"
        endLabel="Large Padding"
        styles={{
          theme: 'light',
          padding: '24px',
          borderRadius: '16px',
          fontSize: '18px',
        }}
      />
      <DateRangeWithState
        startLabel="Custom Dimensions"
        endLabel="Custom Dimensions"
        styles={{
          theme: 'light',
          height: '60px',
          width: '100%',
          borderRadius: '8px',
        }}
      />
      <DateRangeWithState
        startLabel="Asymmetric Padding"
        endLabel="Asymmetric Padding"
        styles={{
          theme: 'light',
          paddingLeft: '32px',
          paddingRight: '16px',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      />
    </div>
  ),
  // All three demos are light-themed — pin the light canvas.
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// TYPOGRAPHY STORIES
// --------------------------------------------------------------------------

export const CustomTypography: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <DateRangeWithState
        startLabel="Large Text Start"
        endLabel="Large Text End"
        styles={{
          theme: 'light',
          fontSize: '20px',
          fontWeight: 'bold',
          lineHeight: '1.5',
          padding: '20px',
        }}
      />
      <DateRangeWithState
        startLabel="Custom Font Start"
        endLabel="Custom Font End"
        styles={{
          theme: 'light',
          fontFamily: '"Georgia", serif',
          fontSize: '16px',
          fontWeight: 400,
        }}
      />
      <DateRangeWithState
        startLabel="Small & Light Start"
        endLabel="Small & Light End"
        styles={{
          theme: 'light',
          fontSize: '14px',
          fontWeight: 300,
          padding: '12px',
        }}
      />
    </div>
  ),
  // All three demos are light-themed — pin the light canvas.
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ERROR STATES
// --------------------------------------------------------------------------

// Mixed-theme story: each block sits on its own theme-matched surface so
// every field is rendered (and contrast-measured) against the background it
// is designed for, instead of all three inheriting one canvas.
export const ErrorStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{
          background: '#ffffff',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <DateRangeWithState
          startLabel="Start Date"
          endLabel="End Date"
          error="Please select a valid date range."
          styles={{ theme: 'light' }}
        />
      </div>
      <div
        style={{
          background: '#111827',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <DateRangeWithState
          startLabel="From Date"
          endLabel="To Date"
          error="End date cannot be before start date."
          styles={{
            theme: 'dark',
            borderErrorColor: 'rgba(255, 99, 71, 1)',
            labelErrorColor: 'rgba(255, 99, 71, 1)',
            helperTextErrorColor: 'rgba(255, 99, 71, 1)',
          }}
        />
      </div>
      <div
        style={{
          background: '#0e0e0e',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <DateRangeWithState
          startLabel="Era Beginning"
          endLabel="Era End"
          error="The sacred timeline is misaligned."
          styles={{ theme: 'sacred' }}
        />
      </div>
    </div>
  ),
}

// --------------------------------------------------------------------------
// REQUIRED FIELDS
// --------------------------------------------------------------------------

// Mixed-theme story: per-block theme-matched surfaces (see ErrorStates).
export const RequiredFields: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div
        style={{
          background: '#ffffff',
          padding: '1rem',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <DateRangeWithState
          startLabel="Required Start"
          endLabel="Required End"
          styles={{ theme: 'light', required: true }}
        />
        <DateRangeWithState
          startLabel="Project Start"
          endLabel="Project End"
          error="Both dates are required"
          styles={{ theme: 'light', required: true }}
        />
      </div>
      <div
        style={{
          background: '#111827',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <DateRangeWithState
          startLabel="Planning Start"
          endLabel="Planning End"
          styles={{ theme: 'dark', required: true }}
        />
      </div>
      <div
        style={{
          background: '#0e0e0e',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <DateRangeWithState
          startLabel="Custom Required Start"
          endLabel="Custom Required End"
          styles={{
            theme: 'sacred',
            required: true,
            requiredIndicatorText: ' (required)',
            '--field-required-indicator': 'rgba(255, 215, 0, 1)',
          }}
        />
      </div>
    </div>
  ),
}

// --------------------------------------------------------------------------
// COMPREHENSIVE SHOWCASE
// --------------------------------------------------------------------------

export const ComprehensiveShowcase: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '2rem',
        padding: '1rem',
      }}
    >
      {/* Light Theme Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Light Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <DateRangeWithState
            startLabel="Basic Start"
            endLabel="Basic End"
            styles={{ theme: 'light' }}
          />
          <DateRangeWithState
            startLabel="With Error"
            endLabel="With Error"
            error="Invalid date range"
            styles={{ theme: 'light' }}
          />
          <DateRangeWithState
            startLabel="Required Start"
            endLabel="Required End"
            styles={{ theme: 'light', required: true }}
          />
        </div>
      </div>

      {/* Dark Theme Section — dark-themed fields sit on a dark surface so
          they are shown (and contrast-measured) on the background they are
          designed for; #9CA3AF on #111827 is 6.99:1. */}
      <div
        style={{
          background: '#111827',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#9CA3AF' }}>Dark Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <DateRangeWithState
            startLabel="Basic Dark Start"
            endLabel="Basic Dark End"
            styles={{ theme: 'dark' }}
          />
          <DateRangeWithState
            startLabel="Custom Colors"
            endLabel="Custom Colors"
            styles={{
              theme: 'dark',
              borderFocusedColor: 'rgba(34, 197, 94, 1)',
              labelColor: 'rgba(34, 197, 94, 0.8)',
            }}
          />
          <DateRangeWithState
            startLabel="Large Size"
            endLabel="Large Size"
            styles={{
              theme: 'dark',
              fontSize: '18px',
              padding: '20px',
              borderRadius: '12px',
            }}
          />
        </div>
      </div>

      {/* Sacred Theme Section — sacred fields use a translucent near-black
          control bg (rgba(0,0,0,0.4)) and gold labels, which only work on a
          near-black surface; on the white canvas they measured #999999 with
          1.3–2.6:1 text. Gold #FFD700 on #0e0e0e is 13.76:1. */}
      <div
        style={{
          background: '#0e0e0e',
          padding: '1rem',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>Sacred Theme</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <DateRangeWithState
            startLabel="Era Beginning"
            endLabel="Era End"
            styles={{ theme: 'sacred' }}
          />
          <DateRangeWithState
            startLabel="Sacred Start"
            endLabel="Sacred End"
            error="Timeline misaligned"
            styles={{ theme: 'sacred' }}
          />
          <DateRangeWithState
            startLabel="Divine Start"
            endLabel="Divine End"
            styles={{
              theme: 'sacred',
              borderRadius: '16px',
              padding: '18px',
            }}
          />
        </div>
      </div>

      {/* Custom Styling Section */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#7C3AED' }}>
          Custom Styling
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Dark-themed neon demo on a dark surface. Label/text use the
              lighter neon purple #c084fc: 6.71:1 on #111827 and 7.90:1 on
              the near-black input bg (solid #9333ea only reaches 3.3:1 on
              dark surfaces). */}
          <div
            style={{
              background: '#111827',
              padding: '1rem',
              borderRadius: '8px',
            }}
          >
            <DateRangeWithState
              startLabel="Neon Start"
              endLabel="Neon End"
              styles={{
                theme: 'dark',
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                borderColor: 'rgba(147, 51, 234, 0.5)',
                borderFocusedColor: 'rgba(147, 51, 234, 1)',
                textColor: 'rgba(192, 132, 252, 1)',
                labelColor: 'rgba(192, 132, 252, 1)',
                borderRadius: '20px',
                borderWidth: '2px',
              }}
            />
          </div>
          <DateRangeWithState
            startLabel="Soft Start"
            endLabel="Soft End"
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(249, 250, 251, 1)',
              borderColor: 'rgba(209, 213, 219, 1)',
              borderFocusedColor: 'rgba(59, 130, 246, 1)',
              borderRadius: '24px',
              padding: '16px 24px',
            }}
          />
          <DateRangeWithState
            startLabel="Minimal Start"
            endLabel="Minimal End"
            styles={{
              theme: 'light',
              backgroundColor: 'rgba(255, 255, 255, 1)',
              borderColor: 'rgba(0, 0, 0, 0.1)',
              borderFocusedColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '0px',
              borderWidth: '0px 0px 2px 0px',
              padding: '12px 0px',
            }}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// DISABLED STATE
// --------------------------------------------------------------------------

export const DisabledStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <DateRangeWithState
        startLabel="Disabled Light Start"
        endLabel="Disabled Light End"
        initialValue={{
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31'),
        }}
        styles={{ theme: 'light', disabled: true }}
      />
      <DateRangeWithState
        startLabel="Disabled Dark Start"
        endLabel="Disabled Dark End"
        initialValue={{
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31'),
        }}
        styles={{ theme: 'dark', disabled: true }}
      />
      <DateRangeWithState
        startLabel="Disabled Sacred Start"
        endLabel="Disabled Sacred End"
        initialValue={{
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31'),
        }}
        styles={{ theme: 'sacred', disabled: true }}
      />
    </div>
  ),
}

// --------------------------------------------------------------------------
// VALIDATION DEMO
// --------------------------------------------------------------------------

const onValidationSuccess = fn()

const DateRangeValidationDemo = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  })
  const [error, setError] = useState('')

  const validateDateRange = (range: DateRange) => {
    if (!range.start || !range.end) {
      setError('Both start and end dates are required')
    } else if (range.start > range.end) {
      setError('End date cannot be before start date')
    } else {
      setError('')
    }
  }

  const handleSubmit = () => {
    validateDateRange(dateRange)
    if (error === '' && dateRange.start && dateRange.end) {
      onValidationSuccess()
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '500px',
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0' }}>Date Range Validation</h3>
      <DateRangeComponent
        startLabel="Start Date"
        endLabel="End Date"
        value={dateRange}
        onChange={value => {
          setDateRange(value)
          if (error) validateDateRange(value)
        }}
        error={error}
        styles={{ theme: 'light', required: true }}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: '12px 24px',
          // blue-600: white-on-#2563EB is 5.17:1 (white-on-#3B82F6 was 3.67:1)
          backgroundColor: '#2563EB',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '500',
        }}
      >
        Validate Date Range
      </button>
      <p style={{ fontSize: '14px', color: '#6B7280' }}>
        Select both start and end dates to see validation in action.
      </p>
    </div>
  )
}

export const ValidationDemo: Story = {
  render: () => <DateRangeValidationDemo />,
  // Light-themed demo (default-color heading/copy + theme:'light' field) —
  // pin the light canvas it is designed for.
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  render: () => (
    <DateRangeWithState
      startLabel="Test Start Date"
      endLabel="Test End Date"
      styles={{ theme: 'light' }}
    />
  ),
  // Light-themed content — pin the light canvas.
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check that labels are present
    await expect(canvas.getByText('Test Start Date')).toBeInTheDocument()
    await expect(canvas.getByText('Test End Date')).toBeInTheDocument()

    // Check that date inputs are present
    const startInput = canvas.getByLabelText('Test Start Date')
    const endInput = canvas.getByLabelText('Test End Date')

    expect(startInput).toBeVisible()
    expect(endInput).toBeVisible()
  },
}

// --------------------------------------------------------------------------
// A11Y: GROUP SEMANTICS + CROSS-FIELD ERROR
// --------------------------------------------------------------------------

// The start/end inputs are two related controls forming ONE range, so the
// wrapper is exposed as a named role="group" (WCAG 1.3.1). A cross-field
// error (start > end) is a property of the whole range, so it must mark BOTH
// inputs aria-invalid — not just the start — and be announced once via a
// role="alert" region (WCAG 4.1.2 / 4.1.3). Because the message describes the
// whole range, BOTH inputs point aria-describedby at that single region, so a
// screenreader landing on either control can read the reason (WCAG 3.3.1).
export const GroupSemanticsAndError: Story = {
  name: 'A11y: Group Semantics & Range Error',
  render: () => (
    <DateRangeWithState
      startLabel="Trip Start"
      endLabel="Trip End"
      ariaLabel="Trip dates"
      error="End date cannot be before start date."
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // The pair is announced as one named group.
    const group = canvas.getByRole('group', { name: 'Trip dates' })
    await expect(group).toBeInTheDocument()

    // A cross-field error marks BOTH date inputs invalid, not just the start.
    const startInput = canvas.getByLabelText('Trip Start')
    const endInput = canvas.getByLabelText('Trip End')
    await expect(startInput).toHaveAttribute('aria-invalid', 'true')
    await expect(endInput).toHaveAttribute('aria-invalid', 'true')

    // The message is announced once via a live alert region and BOTH inputs
    // are programmatically described by that same region — a screenreader on
    // either the start or the end control can read the reason for the error,
    // not just hear "invalid" (WCAG 3.3.1).
    const alert = canvas.getByRole('alert')
    await expect(alert).toHaveTextContent(
      'End date cannot be before start date.'
    )
    await expect(startInput).toHaveAttribute('aria-describedby', alert.id)
    await expect(endInput).toHaveAttribute('aria-describedby', alert.id)
  },
}

// The wrapper is always a named group even without an explicit ariaLabel —
// the default accessible name is 'Date range'.
export const DefaultGroupLabel: Story = {
  name: 'A11y: Default Group Label',
  render: () => (
    <DateRangeWithState
      startLabel="Start Date"
      endLabel="End Date"
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Date range' })
    ).toBeInTheDocument()
  },
}

// A boolean `error={true}` (styling-only, no message — a documented FieldShell
// mode) marks BOTH inputs invalid but renders NO message region. So NEITHER
// input may carry an `aria-describedby`: a describedby pointing at the absent
// region is a dangling/invalid ARIA reference (axe aria-valid-attr-value).
// Regression guard for the boolean-error dangling-describedby fix — the end
// input's ARIA now MIRRORS the start shell's resolved bag (which omits
// aria-describedby when the shell renders no region) instead of re-deriving a
// describedby from `Boolean(error)`.
export const BooleanErrorNoMessage: Story = {
  name: 'A11y: Boolean Error (no message)',
  render: () => (
    <DateRangeWithState
      startLabel="Boolean Start"
      endLabel="Boolean End"
      error
      styles={{ theme: 'light' }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const startInput = canvas.getByLabelText('Boolean Start')
    const endInput = canvas.getByLabelText('Boolean End')

    // Both controls are programmatically invalid — a styling-only error still
    // conveys the invalid STATE on both ends of the range (WCAG 4.1.2).
    await expect(startInput).toHaveAttribute('aria-invalid', 'true')
    await expect(endInput).toHaveAttribute('aria-invalid', 'true')

    // No message region is rendered, so NEITHER input references one. A
    // dangling aria-describedby (pointing at a non-existent id) would be an
    // invalid ARIA reference — the bug this guards against.
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
    await expect(startInput).not.toHaveAttribute('aria-describedby')
    await expect(endInput).not.toHaveAttribute('aria-describedby')
  },
}

// --------------------------------------------------------------------------
// A11Y: FORM-ENGINE-DERIVED RANGE ERROR
// --------------------------------------------------------------------------

// The whole {start,end} range is one engine key; the range is invalid until
// BOTH dates are supplied. The refine attaches its message at the `tripDates`
// path, so the engine reports it for that key once the field is touched (on
// submit) — with no explicit `error` prop on the DateRange.
const RangeFormSchema = z.object({
  tripDates: z
    .object({
      start: z.date().nullable(),
      end: z.date().nullable(),
    })
    .refine(range => range.start !== null && range.end !== null, {
      message: 'Both start and end dates are required.',
    }),
})

const onRangeFormSubmit = fn()

// When a DateRange is bound in a <Form> by `name` with NO explicit `error`, the
// range error is DERIVED by the form engine and resolved on the START shell
// (which carries `name`). The END input has no `name` and never reads the
// engine — so it must MIRROR the start shell's resolved aria-invalid /
// aria-describedby, not re-derive them from the (absent) explicit `error` prop.
// Regression guard: reverting the mirror to `Boolean(error)` leaves the end
// input neither invalid nor described on the engine-derived path (WCAG 1.3.1 /
// 3.3.1 / 4.1.2).
export const FormEngineDerivedError: Story = {
  name: 'A11y: Form-Engine-Derived Range Error',
  render: () => (
    <Form
      schema={RangeFormSchema}
      initialValues={{ tripDates: { start: null, end: null } }}
      subject="trip dates"
      onSubmit={onRangeFormSubmit}
    >
      <DateRangeComponent
        name="tripDates"
        startLabel="Engine Start"
        endLabel="Engine End"
        ariaLabel="Trip dates"
        styles={{ theme: 'light' }}
      />
      <button type="submit" style={{ marginTop: '1rem' }}>
        Validate
      </button>
    </Form>
  ),
  globals: { backgrounds: { value: 'light' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const startInput = canvas.getByLabelText('Engine Start')
    const endInput = canvas.getByLabelText('Engine End')

    // Submitting the empty required range surfaces the engine-derived error on
    // the whole `tripDates` key (both dates null) — no explicit error prop.
    await userEvent.click(canvas.getByRole('button', { name: 'Validate' }))

    // The message region is the field helper (there is also a form-level status
    // alert, so query by the message text, not by role).
    const helper = await canvas.findByText(
      'Both start and end dates are required.'
    )

    // The engine error is resolved on the START shell (it owns `name`); the END
    // input MIRRORS it — both are invalid and both are described by that same
    // region, so a screenreader on either control reads the reason.
    await expect(startInput).toHaveAttribute('aria-invalid', 'true')
    await expect(endInput).toHaveAttribute('aria-invalid', 'true')
    await expect(startInput).toHaveAttribute('aria-describedby', helper.id)
    await expect(endInput).toHaveAttribute('aria-describedby', helper.id)
  },
}
