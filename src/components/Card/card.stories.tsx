/**
 * @fileoverview Storybook stories for the Card compound component.
 *
 * Card is a compositional surface primitive: the root `<Card>` plus a set of
 * slot subcomponents attached as static properties (`Card.Header`,
 * `Card.Title`, `Card.Body`, `Card.Footer`, etc.). Because a meaningful card is
 * always a composition of slots — never configured through flat props — every
 * story uses a `render` function that assembles a realistic card rather than
 * passing `args`.
 *
 * Coverage: a Default course card, the three themes (light / dark / sacred),
 * and several key states (badges + header actions, split footer, a clickable
 * block-link title, selected, and a compact/borderAccent metrics variant).
 *
 * The theme is set via the component's `styles={{ theme }}` prop (see
 * `CardProps.styles` in ./index.tsx), which defaults to `'sacred'`.
 */
import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Card, { type CardTheme } from './index'

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['standard', 'compact'],
      description: 'Visual density / padding scale',
    },
    selected: { control: 'boolean', description: 'Selection state — ring' },
    interactive: {
      control: 'boolean',
      description: 'Marks the card as a whole-card click target (visual cue)',
    },
    disabled: { control: 'boolean', description: 'Disabled visual state' },
    dragging: { control: 'boolean', description: 'Drag state' },
    styles: {
      control: 'object',
      description: "Theming — { theme: 'sacred' | 'light' | 'dark' }",
    },
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Card>

// --------------------------------------------------------------------------
// SAMPLE DATA
// --------------------------------------------------------------------------

const course = {
  _id: 'course_egyptology_101',
  title: 'Foundations of Egyptology',
  category: 'History & Culture',
  status: 'Published',
  description:
    'A guided journey through the dynasties, hieroglyphs, and daily life of ' +
    'ancient Egypt — from the Old Kingdom pyramids to the Ptolemaic era.',
  lessonCount: 24,
  duration: '6h 15m',
  progress: 0.62,
  created: 'Jan 5, 2026',
}

const noop = (): void => {}

// A full course card, parameterized by theme so every theme story shares the
// exact same composition and differs only by the `styles.theme` value.
const CourseCard = ({ theme }: { theme: CardTheme }): React.JSX.Element => (
  <Card cardType="course" cardId={course._id} styles={{ theme }} interactive>
    <Card.Header>
      <Card.HeaderIcon>📚</Card.HeaderIcon>
      <Card.Title onClick={noop}>{course.title}</Card.Title>
      <Card.Subtitle>{course.category}</Card.Subtitle>
      <Card.HeaderBadges>
        <span>{course.status}</span>
      </Card.HeaderBadges>
    </Card.Header>

    <Card.Body>
      <Card.Description>{course.description}</Card.Description>
      <Card.Metrics>
        <Card.Metric icon="🎓" label="Lessons" value={course.lessonCount} />
        <Card.Metric icon="⏱" label="Duration" value={course.duration} />
      </Card.Metrics>
      <Card.Progress value={course.progress} label="Complete" />
    </Card.Body>

    <Card.Footer split>
      <Card.FooterActions side="left">
        <button type="button">View</button>
      </Card.FooterActions>
      <Card.FooterActions side="right">
        <button type="button">Edit</button>
      </Card.FooterActions>
      <Card.FooterMeta>Created {course.created}</Card.FooterMeta>
    </Card.Footer>
  </Card>
)

// --------------------------------------------------------------------------
// DEFAULT
// --------------------------------------------------------------------------

/** A realistic course card composed from the header / body / footer slots. */
export const Default: Story = {
  render: () => (
    <div style={{ width: '360px' }}>
      <CourseCard theme="light" />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

// --------------------------------------------------------------------------
// THEME STORIES
// --------------------------------------------------------------------------

export const LightTheme: Story = {
  name: 'Themes/Light Theme',
  render: () => (
    <div style={{ width: '360px' }}>
      <CourseCard theme="light" />
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

export const DarkTheme: Story = {
  name: 'Themes/Dark Theme',
  render: () => (
    <div style={{ width: '360px' }}>
      <CourseCard theme="dark" />
    </div>
  ),
  globals: { backgrounds: { value: 'dark' } },
}

export const SacredTheme: Story = {
  name: 'Themes/Sacred Theme',
  render: () => (
    <div style={{ width: '360px' }}>
      <CourseCard theme="sacred" />
    </div>
  ),
  globals: { backgrounds: { value: 'sacred' } },
}

// --------------------------------------------------------------------------
// STATE STORIES
// --------------------------------------------------------------------------

/**
 * Header badges + header actions + header meta together — the "item card with
 * a status chip and trailing controls" archetype.
 */
export const WithBadgesAndActions: Story = {
  name: 'States/Badges + Header Actions',
  render: () => (
    <div style={{ width: '360px' }}>
      <Card cardType="course" cardId={course._id} styles={{ theme: 'light' }}>
        <Card.Header>
          <Card.HeaderIcon>📚</Card.HeaderIcon>
          <Card.Title>{course.title}</Card.Title>
          <Card.Subtitle>{course.category}</Card.Subtitle>
          <Card.HeaderMeta>Updated 2h ago</Card.HeaderMeta>
          <Card.HeaderBadges>
            <span>{course.status}</span>
            <span>New</span>
          </Card.HeaderBadges>
          <Card.HeaderActions>
            <button type="button" aria-label="Edit">
              ✏️
            </button>
            <button type="button" aria-label="More">
              ⋯
            </button>
          </Card.HeaderActions>
        </Card.Header>
        <Card.Body>
          <Card.Description>{course.description}</Card.Description>
        </Card.Body>
      </Card>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

/**
 * A clickable block-link title. When `Card.Title` has an `onClick`, the whole
 * card becomes the click target (block-link pattern) while inner controls stay
 * individually clickable. Pairs with `interactive` for the cursor cue.
 */
export const ClickableTitle: Story = {
  name: 'States/Clickable Title (Block-Link)',
  render: () => (
    <div style={{ width: '360px' }}>
      <Card
        cardType="course"
        cardId={course._id}
        styles={{ theme: 'light' }}
        interactive
      >
        <Card.Header>
          <Card.HeaderIcon>📚</Card.HeaderIcon>
          <Card.Title onClick={noop} ariaLabel={`Open ${course.title}`}>
            {course.title}
          </Card.Title>
          <Card.Subtitle>{course.category}</Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <Card.Description>{course.description}</Card.Description>
        </Card.Body>
      </Card>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

/**
 * Selected state — emits the selection ring, paired with a
 * `Card.SelectionCheckbox` in the header actions.
 */
export const Selected: Story = {
  name: 'States/Selected',
  render: () => (
    <div style={{ width: '360px' }}>
      <Card
        cardType="course"
        cardId={course._id}
        styles={{ theme: 'light' }}
        selected
      >
        <Card.Header>
          <Card.HeaderIcon>📚</Card.HeaderIcon>
          <Card.Title>{course.title}</Card.Title>
          <Card.Subtitle>{course.category}</Card.Subtitle>
          <Card.HeaderActions>
            <Card.SelectionCheckbox
              checked
              onChange={noop}
              ariaLabel="Select this course"
            />
          </Card.HeaderActions>
        </Card.Header>
        <Card.Body>
          <Card.Description>{course.description}</Card.Description>
        </Card.Body>
      </Card>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}

/**
 * A compact card with a left border accent and a stats grid — the dense
 * "metric tile" archetype (e.g. a financial / analytics summary card).
 */
export const CompactWithStats: Story = {
  name: 'States/Compact + Border Accent',
  render: () => (
    <div style={{ width: '360px' }}>
      <Card
        cardType="course"
        cardId={course._id}
        styles={{ theme: 'light' }}
        variant="compact"
        borderAccent={{ color: '#6366f1', side: 'left' }}
      >
        <Card.Header>
          <Card.Title>{course.title}</Card.Title>
          <Card.Subtitle>Enrollment summary</Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <Card.Stats columns={3}>
            <Card.StatCell label="Lessons" value={course.lessonCount} />
            <Card.StatCell label="Enrolled" value={128} />
            <Card.StatCell
              label="Completion"
              value="62%"
              valueColor="#15803d"
            />
          </Card.Stats>
        </Card.Body>
      </Card>
    </div>
  ),
  globals: { backgrounds: { value: 'light' } },
}
