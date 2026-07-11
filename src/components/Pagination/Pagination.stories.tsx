/**
 * @fileoverview Storybook stories for the Pagination component.
 * Demonstrates the default (MUI) palette and the sacred theme, the
 * first/last/prev/next button options, sibling/boundary counts, and the
 * disabled state. Stories track the current page with a stateful wrapper.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import Pagination from './index'

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  argTypes: {
    page: {
      control: { type: 'number', min: 1 },
      description: 'The currently selected page (1-based)',
    },
    count: {
      control: { type: 'number', min: 1 },
      description: 'Total number of pages',
    },
    siblingCount: {
      control: { type: 'number', min: 0 },
      description: 'Number of page buttons shown on each side of the current page',
    },
    boundaryCount: {
      control: { type: 'number', min: 0 },
      description: 'Number of page buttons shown at the start and end',
    },
    showFirstButton: {
      control: 'boolean',
      description: 'Show the jump-to-first-page button',
    },
    showLastButton: {
      control: 'boolean',
      description: 'Show the jump-to-last-page button',
    },
    styles: {
      control: 'object',
      description: 'Styling options including theme, disabled, gap, and padding',
    },
  },
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Pagination>

// --------------------------------------------------------------------------
// INTERACTIVE WRAPPER
// --------------------------------------------------------------------------
// Pagination is controlled — it needs `page` + `onChange` to navigate. This
// wrapper holds the page state so the buttons actually change the selection.

const InteractivePagination = ({
  count = 10,
  initialPage = 1,
  siblingCount,
  boundaryCount,
  showFirstButton,
  showLastButton,
  hidePrevButton,
  hideNextButton,
  styles,
}: {
  count?: number
  initialPage?: number
  siblingCount?: number
  boundaryCount?: number
  showFirstButton?: boolean
  showLastButton?: boolean
  hidePrevButton?: boolean
  hideNextButton?: boolean
  styles?: { disabled?: boolean; theme?: string; gap?: string; padding?: string }
}): React.JSX.Element => {
  const [page, setPage] = useState(initialPage)
  return (
    <Pagination
      page={page}
      count={count}
      onChange={(_event, nextPage) => setPage(nextPage)}
      {...(siblingCount !== undefined && { siblingCount })}
      {...(boundaryCount !== undefined && { boundaryCount })}
      {...(showFirstButton !== undefined && { showFirstButton })}
      {...(showLastButton !== undefined && { showLastButton })}
      {...(hidePrevButton !== undefined && { hidePrevButton })}
      {...(hideNextButton !== undefined && { hideNextButton })}
      {...(styles !== undefined && { styles })}
    />
  )
}

// --------------------------------------------------------------------------
// THEME STORIES
// --------------------------------------------------------------------------
// The default palette renders for any theme other than `sacred` (including no
// theme at all); only `theme: 'sacred'` renders the gold palette.

export const Default: Story = {
  name: 'Themes/Default',
  render: () => <InteractivePagination count={10} initialPage={1} />,
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  name: 'Themes/Dark Theme',
  render: () => (
    <InteractivePagination
      count={10}
      initialPage={1}
      styles={{ theme: 'dark' }}
    />
  ),
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  name: 'Themes/Sacred Theme',
  render: () => (
    <InteractivePagination
      count={10}
      initialPage={1}
      styles={{ theme: 'sacred' }}
    />
  ),
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// BUTTON OPTION STORIES
// --------------------------------------------------------------------------

export const WithFirstLastButtons: Story = {
  name: 'Buttons/First & Last',
  render: () => (
    <InteractivePagination
      count={20}
      initialPage={10}
      showFirstButton
      showLastButton
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const HiddenPrevNext: Story = {
  name: 'Buttons/Hidden Prev & Next',
  render: () => (
    <InteractivePagination
      count={10}
      initialPage={5}
      hidePrevButton
      hideNextButton
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// COUNT / SIBLING STORIES
// --------------------------------------------------------------------------

export const ManyPagesWithEllipsis: Story = {
  name: 'Counts/Many Pages (Ellipsis)',
  render: () => (
    <InteractivePagination
      count={50}
      initialPage={25}
      showFirstButton
      showLastButton
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const SiblingAndBoundaryCount: Story = {
  name: 'Counts/Sibling & Boundary',
  render: () => (
    <InteractivePagination
      count={50}
      initialPage={25}
      siblingCount={2}
      boundaryCount={2}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// STATE STORIES
// --------------------------------------------------------------------------

export const Disabled: Story = {
  name: 'State/Disabled',
  render: () => (
    <InteractivePagination
      count={10}
      initialPage={3}
      styles={{ disabled: true }}
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// ACCESSIBILITY STORIES
// --------------------------------------------------------------------------
// Exercises the accessible structure: the items render inside a real
// <nav aria-label> landmark as a <ul>/<li> list (screen readers announce the
// item count + step through pages); the selected page carries aria-current
// ="page"; every control has an accessible name (numbered buttons
// "Go to page N", the direction buttons "Go to first/previous/next/last
// page" with their icons aria-hidden); Tab moves between the buttons and the
// keyboard focus ring is visible via :focus-visible. Tab into the row to see
// the focus indicator; boundary buttons are disabled at page 1 / last page.

export const AccessibleStructure: Story = {
  name: 'Accessibility/Keyboard & Semantics',
  render: () => (
    <InteractivePagination
      count={20}
      initialPage={1}
      showFirstButton
      showLastButton
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}

// Exercises the screen-reader page-change announcement (WCAG 4.1.3). The
// component renders a visually-hidden `role="status" aria-live="polite"` region
// ("Page N of M") as the first child of the <nav>; changing pages updates its
// text so assistive tech announces the new active page even though focus stays
// on the just-clicked control. Enable a screen reader and click through the
// pages — each selection is spoken as "Page N of M". The middle-of-range
// starting page also shows the start/end ellipses, whose contrast was lifted to
// meet WCAG 1.4.3 (they are informational "skipped range" text, not decoration).
export const PageChangeAnnouncement: Story = {
  name: 'Accessibility/Page Change Announcement',
  render: () => (
    <InteractivePagination
      count={30}
      initialPage={15}
      showFirstButton
      showLastButton
    />
  ),
  globals: { backgrounds: { value: 'light' } },
}
