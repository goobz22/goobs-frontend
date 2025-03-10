// src/components/SearchableDropdown/searchabledropdown.stories.tsx

import { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from '@storybook/test'
import SearchableDropdown from './index'

/**
 * Reusable list of options for demonstration.
 */
const sampleOptions = [
  { value: 'apple', attribute1: 'Fruit', attribute2: 'Green or Red' },
  { value: 'banana', attribute1: 'Fruit', attribute2: 'Yellow' },
  { value: 'carrot', attribute1: 'Vegetable', attribute2: 'Orange' },
  { value: 'potato', attribute1: 'Vegetable', attribute2: 'Brown' },
  { value: 'avocado', attribute1: 'Fruit', attribute2: 'Green' },
  { value: 'broccoli', attribute1: 'Vegetable', attribute2: 'Green' },
]

/**
 * Sample options with the complex variant attributes
 */
const complexSampleOptions = [
  {
    value: 'apple',
    attribute1: 'Fruit',
    attribute2: 'Green or Red',
    attribute3: 'High Fiber',
    attribute4: 'Seasonal: Fall',
    attribute5: 'Origin: Worldwide',
    attribute6: 'Storage: Cool, Dry',
  },
  {
    value: 'banana',
    attribute1: 'Fruit',
    attribute2: 'Yellow',
    attribute3: 'High Potassium',
    attribute4: 'Year-round',
    attribute5: 'Origin: Tropical',
    attribute6: 'Storage: Room Temp',
  },
  {
    value: 'carrot',
    attribute1: 'Vegetable',
    attribute2: 'Orange',
    attribute3: 'High Vitamin A',
    attribute4: 'Year-round',
    attribute5: 'Origin: Middle East',
    attribute6: 'Storage: Refrigerated',
  },
  {
    value: 'potato',
    attribute1: 'Vegetable',
    attribute2: 'Brown',
    attribute3: 'High Starch',
    attribute4: 'Year-round',
    attribute5: 'Origin: South America',
    attribute6: 'Storage: Dark, Cool',
  },
  {
    value: 'avocado',
    attribute1: 'Fruit',
    attribute2: 'Green',
    attribute3: 'Healthy Fats',
    attribute4: 'Seasonal: Spring',
    attribute5: 'Origin: Mexico',
    attribute6: 'Storage: Room Temp',
  },
  {
    value: 'broccoli',
    attribute1: 'Vegetable',
    attribute2: 'Green',
    attribute3: 'High Vitamin K',
    attribute4: 'Seasonal: Winter',
    attribute5: 'Origin: Mediterranean',
    attribute6: 'Storage: Refrigerated',
  },
]

/**
 * Helper function to safely access dropdown options in tests
 */
const getDropdownOptions = () => {
  const listboxElement = document.querySelector('[role="listbox"]')
  if (listboxElement && listboxElement instanceof HTMLElement) {
    const listbox = within(listboxElement)
    return listbox.getAllByRole('option')
  }
  console.log('Listbox not found')
  return []
}

/**
 * Storybook metadata
 */
const meta: Meta<typeof SearchableDropdown> = {
  title: 'Components/Field/Dropdown/Searchable',
  component: SearchableDropdown,
  argTypes: {
    backgroundcolor: { control: 'color' },
    outlinecolor: { control: 'color' },
    fontcolor: { control: 'color' },
    inputfontcolor: { control: 'color' },
    shrunkfontcolor: { control: 'color' },
    unshrunkfontcolor: { control: 'color' },
    placeholdercolor: { control: 'color' },
    shrunklabelposition: {
      control: 'select',
      options: ['onNotch', 'aboveNotch'],
    },
    variant: {
      control: 'select',
      options: ['simple', 'complex'],
      description: 'Dropdown display variant',
    },
  },
}
export default meta

type Story = StoryObj<typeof SearchableDropdown>

/**
 * 1) Basic usage
 *    Uses userEvent => keep `async`.
 */
export const Basic: Story = {
  args: {
    label: 'Basic SearchableDropdown',
    options: sampleOptions,
    placeholder: 'Start typing...',
    variant: 'simple',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Check for the label using a more specific query
    expect(
      canvas.getByRole('combobox', { name: 'Basic SearchableDropdown' })
    ).toBeInTheDocument()

    // Click into the input
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)

    // Type a partial match
    await userEvent.type(input, 'car')

    // Get dropdown options
    const listboxItems = getDropdownOptions()

    // Check if any option contains "carrot"
    const hasCarrot = listboxItems.some(
      item => item.textContent && item.textContent.includes('carrot')
    )
    expect(hasCarrot).toBe(true)
  },
}

/**
 * 2) With defaultValue
 *    No user interactions => remove `async`.
 */
export const WithDefaultValue: Story = {
  args: {
    label: 'Dropdown with Default Value',
    options: sampleOptions,
    defaultValue: 'banana',
    variant: 'simple',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Expect the combobox to show the default item with first letter capitalized
    const input = canvas.getByRole('combobox')
    expect(input).toHaveValue('Banana')
  },
}

/**
 * 3) Simple Variant with Attributes
 *    Uses userEvent => keep `async`.
 */
export const SimpleVariant: Story = {
  args: {
    label: 'Simple Variant',
    options: [
      {
        value: 'item1',
        attribute1: 'Extra data #1',
        attribute2: 'More info #1',
      },
      {
        value: 'item2',
        attribute1: 'Extra data #2',
        attribute2: 'More info #2',
      },
      {
        value: 'item3',
        attribute1: 'Extra data #3',
        attribute2: 'More info #3',
      },
    ],
    placeholder: 'Search items...',
    variant: 'simple',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Open the dropdown
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)

    // Get dropdown options
    const listboxItems = getDropdownOptions()

    // Check if the items we're looking for exist
    const hasItem1 = listboxItems.some(
      item => item.textContent && item.textContent.includes('item1')
    )
    const hasItem3 = listboxItems.some(
      item => item.textContent && item.textContent.includes('item3')
    )

    expect(hasItem1).toBe(true)
    expect(hasItem3).toBe(true)
  },
}

/**
 * 4) Complex Variant with Additional Attributes
 *    Uses userEvent => keep `async`.
 */
export const ComplexVariant: Story = {
  args: {
    label: 'Complex Variant',
    options: [
      {
        value: 'item1',
        attribute1: 'Primary attribute #1',
        attribute2: 'Secondary attribute #1',
        attribute3: 'Tertiary attribute #1',
        attribute4: 'Additional info #1',
        attribute5: 'Extended data #1',
        attribute6: 'Final info #1',
      },
      {
        value: 'item2',
        attribute1: 'Primary attribute #2',
        attribute2: 'Secondary attribute #2',
        attribute3: 'Tertiary attribute #2',
        attribute4: 'Additional info #2',
        attribute5: 'Extended data #2',
        attribute6: 'Final info #2',
      },
      {
        value: 'item3',
        attribute1: 'Primary attribute #3',
        attribute2: 'Secondary attribute #3',
        attribute3: 'Tertiary attribute #3',
        attribute4: 'Additional info #3',
        attribute5: 'Extended data #3',
        attribute6: 'Final info #3',
      },
    ],
    placeholder: 'Search complex items...',
    variant: 'complex',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Open the dropdown
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)

    // Get dropdown options
    const listboxItems = getDropdownOptions()

    // Check if the items and their attributes are present in any of the option items
    const hasItem1 = listboxItems.some(
      item => item.textContent && item.textContent.includes('item1')
    )
    const hasAttributes = listboxItems.some(
      item =>
        item.textContent &&
        item.textContent.includes('Primary attribute') &&
        item.textContent.includes('Secondary attribute')
    )
    const hasExtendedAttributes = listboxItems.some(
      item =>
        item.textContent &&
        item.textContent.includes('Extended data') &&
        item.textContent.includes('Final info')
    )

    expect(hasItem1).toBe(true)
    expect(hasAttributes).toBe(true)
    expect(hasExtendedAttributes).toBe(true)
  },
}

/**
 * 5) Complex Data Example
 *    Uses userEvent => keep `async`.
 */
export const ComplexDataExample: Story = {
  args: {
    label: 'Food Items',
    options: complexSampleOptions,
    placeholder: 'Search foods...',
    variant: 'complex',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Open the dropdown
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)
    await userEvent.type(input, 'a')

    // Get dropdown options
    const listboxItems = getDropdownOptions()

    // Check if avocado and its attributes are present
    const hasAvocado = listboxItems.some(
      item => item.textContent && item.textContent.includes('avocado')
    )
    const hasFruitGreen = listboxItems.some(
      item =>
        item.textContent &&
        item.textContent.includes('Fruit') &&
        item.textContent.includes('Green')
    )
    const hasHealthyFats = listboxItems.some(
      item => item.textContent && item.textContent.includes('Healthy Fats')
    )
    const hasOriginStorage = listboxItems.some(
      item =>
        item.textContent &&
        (item.textContent.includes('Origin: Mexico') ||
          item.textContent.includes('Storage: Room Temp'))
    )

    expect(hasAvocado).toBe(true)
    expect(hasFruitGreen).toBe(true)
    expect(hasHealthyFats).toBe(true)
    expect(hasOriginStorage).toBe(true)
  },
}

/**
 * 6) Error State
 *    No user interactions => remove `async`.
 */
export const ErrorState: Story = {
  args: {
    label: 'Error Dropdown',
    options: sampleOptions,
    error: true,
    helperText: 'Something went wrong!',
    variant: 'simple',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Confirm the helper text
    expect(canvas.getByText('Something went wrong!')).toBeInTheDocument()
  },
}

/**
 * 7) Required Dropdown
 *    No user interactions => remove `async`.
 */
export const RequiredField: Story = {
  args: {
    label: 'Required Dropdown',
    options: sampleOptions,
    required: true,
    variant: 'simple',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Check that label is present with a more specific query
    expect(
      canvas.getByRole('combobox', { name: 'Required Dropdown' })
    ).toBeInTheDocument()
  },
}

/**
 * 8) Custom Colors
 *    Uses userEvent => keep `async`.
 */
export const CustomColors: Story = {
  args: {
    label: 'Custom Colors',
    options: sampleOptions,
    backgroundcolor: '#f0f8ff',
    outlinecolor: '#ff5722',
    fontcolor: '#4caf50',
    inputfontcolor: '#e91e63',
    shrunkfontcolor: '#673ab7',
    unshrunkfontcolor: '#9c27b0',
    shrunklabelposition: 'onNotch',
    placeholdercolor: '#42a5f5',
    placeholder: 'Enter something...',
    variant: 'simple',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Interact just to ensure no errors
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)
    expect(input).toBeInTheDocument()
  },
}

/**
 * 9) Custom Colors - Complex Variant
 *    Uses userEvent => keep `async`.
 */
export const CustomColorsComplex: Story = {
  args: {
    label: 'Custom Colors - Complex',
    options: complexSampleOptions,
    backgroundcolor: '#f0f8ff',
    outlinecolor: '#ff5722',
    fontcolor: '#4caf50',
    inputfontcolor: '#e91e63',
    shrunkfontcolor: '#673ab7',
    unshrunkfontcolor: '#9c27b0',
    shrunklabelposition: 'onNotch',
    placeholdercolor: '#42a5f5',
    placeholder: 'Enter something...',
    variant: 'complex',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Interact just to ensure no errors
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)
    expect(input).toBeInTheDocument()
  },
}

/**
 * 10) Searching & Selecting
 *    Uses userEvent => keep `async`.
 */
export const SearchAndSelect: Story = {
  args: {
    label: 'Search & Select',
    options: sampleOptions,
    placeholder: 'Find an item...',
    variant: 'simple',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Focus and type a partial search
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)
    await userEvent.type(input, 'avo')

    // Get dropdown options
    const listboxItems = getDropdownOptions()

    // Find the avocado option
    const avocadoOption = listboxItems.find(
      item => item.textContent && item.textContent.includes('avocado')
    )

    expect(avocadoOption).toBeTruthy()

    // Click the option if found
    if (avocadoOption) {
      await userEvent.click(avocadoOption)

      // Now the combobox value should be "Avocado" (with capitalization)
      expect(input).toHaveValue('Avocado')
    }
  },
}

/**
 * 11) No Options scenario
 *    Uses userEvent => keep `async`.
 */
export const NoOptions: Story = {
  args: {
    label: 'Empty Dropdown',
    options: [],
    placeholder: 'No items available...',
    variant: 'simple',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Open the dropdown
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)
    // No items should appear
    expect(canvas.queryByText('apple')).not.toBeInTheDocument()
  },
}

/**
 * 12) Disabled State
 *    No user interactions => remove `async`.
 */
export const DisabledState: Story = {
  args: {
    label: 'Disabled Dropdown',
    options: sampleOptions,
    placeholder: 'Cannot select',
    disabled: true,
    variant: 'simple',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox')
    expect(input).toBeDisabled()
  },
}

/**
 * 13) Complex Variant Disabled
 *    No user interactions => remove `async`.
 */
export const ComplexVariantDisabled: Story = {
  args: {
    label: 'Complex Variant Disabled',
    options: complexSampleOptions,
    placeholder: 'Cannot select',
    disabled: true,
    variant: 'complex',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('combobox')
    expect(input).toBeDisabled()
  },
}

/**
 * 14) All Attributes Display
 *    Uses userEvent => keep `async`.
 */
export const AllAttributesDisplay: Story = {
  args: {
    label: 'All Attributes Display',
    options: [
      {
        value: 'complete item',
        attribute1: 'First level',
        attribute2: 'Second level',
        attribute3: 'Third level',
        attribute4: 'Fourth level',
        attribute5: 'Fifth level',
        attribute6: 'Sixth level',
      },
    ],
    placeholder: 'View all attributes...',
    variant: 'complex',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Open the dropdown
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)

    // Get dropdown options
    const listboxItems = getDropdownOptions()

    // Check if all attribute levels are displayed
    const hasAllLevels = listboxItems.some(
      item =>
        item.textContent &&
        item.textContent.includes('First level') &&
        item.textContent.includes('Second level') &&
        item.textContent.includes('Third level') &&
        item.textContent.includes('Fourth level') &&
        item.textContent.includes('Fifth level') &&
        item.textContent.includes('Sixth level')
    )

    expect(hasAllLevels).toBe(true)
  },
}

/**
 * 15) With Search History
 *    Uses userEvent => keep `async`.
 */
export const WithSearchHistory: Story = {
  args: {
    label: 'Search with History',
    options: complexSampleOptions,
    placeholder: 'Search with history...',
    variant: 'complex',
    // Provide pre-populated search history
    searchHistory: [
      { text: 'apple', timestamp: new Date(Date.now() - 5 * 60000) }, // 5 minutes ago
      { text: 'broccoli', timestamp: new Date(Date.now() - 60 * 60000) }, // 1 hour ago
      {
        text: 'custom search',
        timestamp: new Date(Date.now() - 24 * 60 * 60000),
      }, // 1 day ago
    ],
    maxHistoryItems: 5,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Open the dropdown
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)

    // Switch to history tab
    const historyTab = canvas.getByRole('tab', { name: /HISTORY/i })
    await userEvent.click(historyTab)

    // Get dropdown options after switching to history tab
    const listboxItems = getDropdownOptions()

    // Check if history items are displayed
    const hasAppleHistory = listboxItems.some(
      item => item.textContent && item.textContent.includes('apple')
    )

    const hasTimestamp = listboxItems.some(
      item =>
        item.textContent &&
        (item.textContent.includes('minutes ago') ||
          item.textContent.includes('hour ago') ||
          item.textContent.includes('day ago'))
    )

    expect(hasAppleHistory).toBe(true)
    expect(hasTimestamp).toBe(true)

    // Try entering a new search term
    await userEvent.clear(input)
    await userEvent.type(input, 'new search')
    await userEvent.tab() // Blur to trigger adding to history

    // Reopen and check history tab again
    await userEvent.click(input)
    await userEvent.click(historyTab)

    // Should now include our new search
    const updatedListboxItems = getDropdownOptions()
    const hasNewSearch = updatedListboxItems.some(
      item => item.textContent && item.textContent.includes('new search')
    )

    expect(hasNewSearch).toBe(true)
  },
}

/**
 * 16) With Search Callback
 *    Uses userEvent => keep `async`.
 */
export const WithSearchCallback: Story = {
  args: {
    label: 'Search with Callback',
    options: sampleOptions,
    placeholder: 'Search with callback...',
    variant: 'simple',
    // This callback will be triggered when searches are performed
    onSearch: (searchTerm: string, timestamp?: Date) => {
      console.log(
        `Search term: ${searchTerm}, Time: ${timestamp?.toISOString() || 'No timestamp'}`
      )
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Perform a search
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)
    await userEvent.type(input, 'test search')
    await userEvent.tab() // Blur to trigger search

    // Since we can't easily verify the callback in Storybook tests,
    // we'll just ensure the component functions correctly
    expect(input).toHaveValue('test search')
  },
}

/**
 * 17) Tab Navigation
 *    Uses userEvent => keep `async`.
 */
export const TabNavigation: Story = {
  args: {
    label: 'Tab Navigation Demo',
    options: sampleOptions,
    placeholder: 'Explore tabs...',
    variant: 'simple',
    // Provide some search history
    searchHistory: [
      'previous search one',
      'previous search two',
      'previous search three',
    ],
    maxHistoryItems: 10,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Open the dropdown
    const input = canvas.getByRole('combobox')
    await userEvent.click(input)

    // First check that we're on the default "ALL OPTIONS" tab
    // and can see the regular options
    const allOptionsTab = canvas.getByRole('tab', { name: /ALL OPTIONS/i })
    expect(allOptionsTab).toHaveAttribute('aria-selected', 'true')

    // We should see the original options
    const initialListboxItems = getDropdownOptions()
    const hasAppleOption = initialListboxItems.some(
      item => item.textContent && item.textContent.includes('apple')
    )
    expect(hasAppleOption).toBe(true)

    // Now switch to the HISTORY tab
    const historyTab = canvas.getByRole('tab', { name: /HISTORY/i })
    await userEvent.click(historyTab)
    expect(historyTab).toHaveAttribute('aria-selected', 'true')

    // Now we should see the history items
    const historyListboxItems = getDropdownOptions()
    const hasHistoryItems = historyListboxItems.some(
      item => item.textContent && item.textContent.includes('previous search')
    )
    expect(hasHistoryItems).toBe(true)

    // Now switch back to ALL OPTIONS tab
    await userEvent.click(allOptionsTab)
    expect(allOptionsTab).toHaveAttribute('aria-selected', 'true')

    // We should see the original options again
    const finalListboxItems = getDropdownOptions()
    const hasAppleOptionAgain = finalListboxItems.some(
      item => item.textContent && item.textContent.includes('apple')
    )
    expect(hasAppleOptionAgain).toBe(true)
  },
}
