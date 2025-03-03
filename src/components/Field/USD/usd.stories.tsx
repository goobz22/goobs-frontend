import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme } from '@mui/material/styles'
import USDField from './index'

const theme = createTheme()

const meta: Meta<typeof USDField> = {
  title: 'Components/Field/USD',
  component: USDField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof USDField>

export const Default: Story = {
  args: {
    label: 'Amount',
  },
}

export const WithInitialValue: Story = {
  args: {
    label: 'Amount',
    initialValue: '1000',
  },
}

export const WithMinMax: Story = {
  args: {
    label: 'Amount',
    min: 0,
    max: 10000,
    helperText: 'Enter a value between $0 and $10,000',
  },
}

export const WithCustomPrecision: Story = {
  args: {
    label: 'Amount',
    precision: 3,
    helperText:
      'Value will be rounded to 3 decimal places when min/max limits are reached',
  },
}

export const WithCustomLabel: Story = {
  args: {
    label: 'Price',
  },
}

export const WithPlaceholder: Story = {
  args: {
    label: 'Amount',
    placeholder: 'Enter amount',
  },
}

export const WithHelperText: Story = {
  args: {
    label: 'Amount',
    helperText: 'Enter a value between $0 and $10,000',
  },
}

export const WithError: Story = {
  args: {
    label: 'Amount',
    error: true,
    helperText: 'Invalid amount',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Amount',
    disabled: true,
    initialValue: '1000',
  },
}

export const ReadOnly: Story = {
  args: {
    label: 'Amount',
    readOnly: true,
    initialValue: '1000',
  },
}

export const WithCustomWidth: Story = {
  args: {
    label: 'Amount',
    sx: { width: '300px' },
  },
}

export const WithCustomIconStyles: Story = {
  args: {
    label: 'Amount',
    sx: {
      '& .MuiInputAdornment-root': {
        color: 'primary.main',
      },
      '& .MuiSvgIcon-root': {
        fontSize: '1.5rem',
      },
    },
  },
}

export const WithCustomInputStyles: Story = {
  args: {
    label: 'Amount',
    sx: {
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'grey.50',
        '&:hover': {
          backgroundColor: 'grey.100',
        },
      },
    },
  },
}

export const WithLargeAmount: Story = {
  args: {
    label: 'Amount',
    initialValue: '1000000',
    helperText: 'Enter a large amount',
  },
}

export const WithSmallAmount: Story = {
  args: {
    label: 'Amount',
    initialValue: '0.01',
    helperText: 'Enter a small amount',
  },
}

export const WithZeroAmount: Story = {
  args: {
    label: 'Amount',
    initialValue: '0',
    helperText: 'Zero amount',
  },
}

export const WithNegativeAmount: Story = {
  args: {
    label: 'Amount',
    initialValue: '-100',
    helperText: 'Negative amount',
  },
}

export const WithCustomValidation: Story = {
  args: {
    label: 'Amount',
    min: 100,
    max: 1000,
    helperText: 'Amount must be between $100 and $1,000',
  },
}

export const WithDecimalInput: Story = {
  args: {
    label: 'Amount',
    initialValue: '100.5',
    helperText: 'You can manually enter decimal points',
  },
}

export const WithMultipleDecimals: Story = {
  args: {
    label: 'Amount',
    initialValue: '100.5',
    helperText: 'Only the first decimal point will be kept',
  },
}
