// src/components/Button/button.stories.tsx

import * as Agnostic from '../../framework-agnostic'
import {
  createStorybookAdapter,
  adaptStoryRender,
} from '../../framework-agnostic/adapters/react'
import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'
import CustomButton from './index'

// Framework-agnostic SVG icon components
const SendIcon = (props: {
  style?: Agnostic.CSSProperties
  className?: string
}) =>
  Agnostic.createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      height: '24px',
      viewBox: '0 0 24 24',
      width: '24px',
      fill: 'currentColor',
      style: props.style,
      className: props.className,
    },
    Agnostic.createElement('path', { d: 'M0 0h24v24H0V0z', fill: 'none' }),
    Agnostic.createElement('path', {
      d: 'M2.01 21L23 12 2.01 3 2 10l15 2-15 2 .01 7z',
    })
  )

const AddIcon = (props: {
  style?: Agnostic.CSSProperties
  className?: string
}) =>
  Agnostic.createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      height: '24px',
      viewBox: '0 0 24 24',
      width: '24px',
      fill: 'currentColor',
      style: props.style,
      className: props.className,
    },
    Agnostic.createElement('path', { d: 'M0 0h24v24H0V0z', fill: 'none' }),
    Agnostic.createElement('path', { d: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' })
  )

const DownloadIcon = (props: {
  style?: Agnostic.CSSProperties
  className?: string
}) =>
  Agnostic.createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      height: '24px',
      viewBox: '0 0 24 24',
      width: '24px',
      fill: 'currentColor',
      style: props.style,
      className: props.className,
    },
    Agnostic.createElement('path', { d: 'M0 0h24v24H0V0z', fill: 'none' }),
    Agnostic.createElement('path', {
      d: 'M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z',
    })
  )

// Create React adapter for CustomButton
const ReactButton = createStorybookAdapter(CustomButton, 'CustomButton')

/**
 * Storybook metadata
 */
const meta: Meta<typeof ReactButton> = {
  title: 'Components/Button',
  component: ReactButton,
  argTypes: {
    backgroundcolor: { control: 'color' },
    fontcolor: { control: 'color' },
    iconcolor: { control: 'color' },
    iconsize: { control: 'text' },
    sacredtheme: { control: 'boolean' },
    outline: { control: 'boolean' },
  },
  parameters: {
    a11y: {
      disable: false,
    },
  },
}
export default meta

type Story = StoryObj<typeof ReactButton>

/**
 * 1) Premium Theme Variants
 */
export const PremiumThemeVariants: Story = {
  name: 'Premium Theme - All Variants',
  render: adaptStoryRender(args => {
    return Agnostic.createElement(
      'div',
      {
        className:
          'space-y-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl',
      },
      Agnostic.createElement(
        'h3',
        {
          className: 'text-xl font-bold text-gray-900 mb-6 font-inter',
        },
        'Premium Button Styles'
      ),

      Agnostic.createElement(
        'div',
        {
          className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
        },
        Agnostic.createElement(
          'div',
          { className: 'space-y-3' },
          Agnostic.createElement(
            'h4',
            { className: 'text-sm font-medium text-gray-700' },
            'Standard'
          ),
          CustomButton({ ...args, text: 'Standard', sacredtheme: false })
        ),
        Agnostic.createElement(
          'div',
          { className: 'space-y-3' },
          Agnostic.createElement(
            'h4',
            { className: 'text-sm font-medium text-gray-700' },
            'With Icon Left'
          ),
          CustomButton({
            ...args,
            text: 'Send',
            icon: SendIcon,
            iconlocation: 'left',
            sacredtheme: false,
          })
        ),
        Agnostic.createElement(
          'div',
          { className: 'space-y-3' },
          Agnostic.createElement(
            'h4',
            { className: 'text-sm font-medium text-gray-700' },
            'With Icon Right'
          ),
          CustomButton({
            ...args,
            text: 'Download',
            icon: DownloadIcon,
            iconlocation: 'right',
            sacredtheme: false,
          })
        ),
        Agnostic.createElement(
          'div',
          { className: 'space-y-3' },
          Agnostic.createElement(
            'h4',
            { className: 'text-sm font-medium text-gray-700' },
            'Icon Above'
          ),
          CustomButton({
            ...args,
            text: 'Upload',
            icon: AddIcon,
            iconlocation: 'above',
            sacredtheme: false,
          })
        ),
        Agnostic.createElement(
          'div',
          { className: 'space-y-3' },
          Agnostic.createElement(
            'h4',
            { className: 'text-sm font-medium text-gray-700' },
            'Icon Only'
          ),
          CustomButton({ ...args, icon: SendIcon, sacredtheme: false })
        ),
        Agnostic.createElement(
          'div',
          { className: 'space-y-3' },
          Agnostic.createElement(
            'h4',
            { className: 'text-sm font-medium text-gray-700' },
            'Disabled'
          ),
          CustomButton({
            ...args,
            text: 'Disabled',
            disabled: true,
            sacredtheme: false,
          })
        )
      )
    )
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test interactive elements
    const standardBtn = canvas.getByText('Standard')
    const sendBtn = canvas.getByText('Send')

    expect(standardBtn).toBeInTheDocument()
    expect(sendBtn).toBeInTheDocument()

    // Test clicking enabled buttons
    await userEvent.click(standardBtn)
    await userEvent.click(sendBtn)

    // Test disabled button
    const disabledBtn = canvas.getByText('Disabled')
    expect(disabledBtn).toBeDisabled()
  },
}

/**
 * 2) Sacred Theme Variants
 */
export const SacredThemeVariants: Story = {
  name: 'Sacred Theme - All Variants',
  render: adaptStoryRender(args => {
    return Agnostic.createElement(
      'div',
      {
        className: 'bg-black/90 p-8 rounded-xl',
      },
      Agnostic.createElement(
        'h3',
        {
          className:
            'text-xl font-bold text-yellow-400 mb-6 font-cinzel animate-sacred-glow',
        },
        'Sacred Power Buttons'
      ),

      Agnostic.createElement(
        'div',
        {
          className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        },
        Agnostic.createElement(
          'div',
          { className: 'space-y-3' },
          Agnostic.createElement(
            'h4',
            { className: 'text-sm font-medium text-yellow-300' },
            'Divine Standard'
          ),
          CustomButton({ ...args, text: 'Invoke Power', sacredtheme: true })
        ),
        Agnostic.createElement(
          'div',
          { className: 'space-y-3' },
          Agnostic.createElement(
            'h4',
            { className: 'text-sm font-medium text-yellow-300' },
            'Sacred Messenger'
          ),
          CustomButton({
            ...args,
            text: 'Send',
            icon: SendIcon,
            iconlocation: 'left',
            sacredtheme: true,
          })
        ),
        Agnostic.createElement(
          'div',
          { className: 'space-y-3' },
          Agnostic.createElement(
            'h4',
            { className: 'text-sm font-medium text-yellow-300' },
            'Ancient Download'
          ),
          CustomButton({
            ...args,
            text: 'Retrieve',
            icon: DownloadIcon,
            iconlocation: 'right',
            sacredtheme: true,
          })
        ),
        Agnostic.createElement(
          'div',
          { className: 'space-y-3' },
          Agnostic.createElement(
            'h4',
            { className: 'text-sm font-medium text-yellow-300' },
            'Temple Offering'
          ),
          CustomButton({
            ...args,
            text: 'Offer',
            icon: AddIcon,
            iconlocation: 'above',
            sacredtheme: true,
          })
        ),
        Agnostic.createElement(
          'div',
          { className: 'space-y-3' },
          Agnostic.createElement(
            'h4',
            { className: 'text-sm font-medium text-yellow-300' },
            'Sacred Seal'
          ),
          CustomButton({ ...args, icon: SendIcon, sacredtheme: true })
        ),
        Agnostic.createElement(
          'div',
          { className: 'space-y-3' },
          Agnostic.createElement(
            'h4',
            { className: 'text-sm font-medium text-yellow-300' },
            'Dormant Power'
          ),
          CustomButton({
            ...args,
            text: 'Sealed',
            disabled: true,
            sacredtheme: true,
          })
        )
      )
    )
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test sacred theme buttons
    const invokeBtn = canvas.getByText('Invoke Power')
    const sendBtn = canvas.getByText('Send')

    expect(invokeBtn).toBeInTheDocument()
    expect(sendBtn).toBeInTheDocument()

    // Test clicking enabled buttons
    await userEvent.click(invokeBtn)
    await userEvent.click(sendBtn)

    // Test disabled sacred button
    const sealedBtn = canvas.getByText('Sealed')
    expect(sealedBtn).toBeDisabled()
  },
}

/**
 * 3) Simple Demo
 */
export const SimpleDemo: Story = {
  name: 'Simple Demo',
  render: adaptStoryRender(args => {
    return Agnostic.createElement(
      'div',
      {
        className: 'space-y-4 p-6',
      },
      Agnostic.createElement(
        'h3',
        { className: 'text-lg font-bold mb-4' },
        'Framework-Agnostic Button Demo'
      ),
      CustomButton({ ...args, text: 'Click Me', sacredtheme: false }),
      CustomButton({ ...args, text: 'Sacred Power', sacredtheme: true })
    )
  }),
}
