import type { Meta, StoryObj } from '@storybook/nextjs'
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from './index'

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof Table>

const sampleData = [
  {
    id: 1,
    name: 'Sacred Temple Report',
    category: 'Financial',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Divine Balance Sheet',
    category: 'Management',
    status: 'Draft',
  },
  {
    id: 3,
    name: 'Holy Income Statement',
    category: 'Compliance',
    status: 'Archived',
  },
]

/**
 * Light theme threaded only to the container + table (NOT to every leaf) —
 * pins the two cascade pathways: the head resolves the light raised surface
 * with dark text, and unthemed cells resolve `--goobs-light-text` on light
 * borders instead of falling back to the sacred gold palette.
 */
export const Light: Story = {
  globals: { backgrounds: { value: 'light' } },
  render: () => (
    <TableContainer styles={{ theme: 'light' }}>
      <Table styles={{ theme: 'light' }}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sampleData.map(row => (
            <TableRow key={row.id} hover>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
}

/**
 * Sacred theme threaded explicitly to EVERY element (container, table, rows,
 * cells) — pins the per-element `data-theme` pathway: gold uppercase header
 * on the gold-a10 surface, gold-a90 serif cell text, gold-a20 cell borders.
 */
export const Sacred: Story = {
  globals: { backgrounds: { value: 'sacred' } },
  render: () => (
    <TableContainer styles={{ theme: 'sacred' }}>
      <Table styles={{ theme: 'sacred' }}>
        <TableHead>
          <TableRow styles={{ theme: 'sacred' }}>
            <TableCell styles={{ theme: 'sacred' }}>ID</TableCell>
            <TableCell styles={{ theme: 'sacred' }}>Sacred Name</TableCell>
            <TableCell styles={{ theme: 'sacred' }}>Divine Category</TableCell>
            <TableCell styles={{ theme: 'sacred' }}>Holy Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sampleData.map(row => (
            <TableRow key={row.id} hover styles={{ theme: 'sacred' }}>
              <TableCell styles={{ theme: 'sacred' }}>{row.id}</TableCell>
              <TableCell styles={{ theme: 'sacred' }}>{row.name}</TableCell>
              <TableCell styles={{ theme: 'sacred' }}>{row.category}</TableCell>
              <TableCell styles={{ theme: 'sacred' }}>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
}

/**
 * Dark theme on every element — pins the dark raised-surface header, dark
 * text cells, dark borders, and the white-alpha row hover.
 */
export const Dark: Story = {
  globals: { backgrounds: { value: 'dark' } },
  render: () => (
    <TableContainer styles={{ theme: 'dark' }}>
      <Table styles={{ theme: 'dark' }}>
        <TableHead>
          <TableRow styles={{ theme: 'dark' }}>
            <TableCell styles={{ theme: 'dark' }}>ID</TableCell>
            <TableCell styles={{ theme: 'dark' }}>Name</TableCell>
            <TableCell styles={{ theme: 'dark' }}>Category</TableCell>
            <TableCell styles={{ theme: 'dark' }}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sampleData.map(row => (
            <TableRow key={row.id} hover styles={{ theme: 'dark' }}>
              <TableCell styles={{ theme: 'dark' }}>{row.id}</TableCell>
              <TableCell styles={{ theme: 'dark' }}>{row.name}</TableCell>
              <TableCell styles={{ theme: 'dark' }}>{row.category}</TableCell>
              <TableCell styles={{ theme: 'dark' }}>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
}

/**
 * Scalar CSS-variable overrides — pins the inheritance pathway: the Table's
 * `backgroundColor` fills the `<table>` surface (`--table-bg`, midnight navy),
 * while the header/cell overrides set on the WRAPPERS (not the leaves)
 * inherit down — teal header bg (`--table-header-bg`) with white header text
 * from the Table, lavender cell text + monospace font + coral cell borders
 * from the container. No cell/head element carries its own override.
 */
export const StyleOverrides: Story = {
  globals: { backgrounds: { value: 'dark' } },
  render: () => (
    <TableContainer
      styles={{
        theme: 'dark',
        color: '#c4b5fd',
        cellBorderColor: '#fb7185',
        fontFamily: 'Consolas, monospace',
      }}
    >
      <Table
        styles={{
          theme: 'dark',
          backgroundColor: '#101830',
          headerBackgroundColor: '#0f766e',
          headerColor: '#ffffff',
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sampleData.map(row => (
            <TableRow key={row.id} hover>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ),
}

/**
 * A bare themed Table WITHOUT a TableContainer — pins the new
 * `.table[data-theme='light']` cascade: the head and unthemed cells resolve
 * the light palette from the `<table>`'s own `data-theme` attribute, which
 * previously required a themed container ancestor (the styles prop on Table
 * was a no-op before the CSS-module implementation).
 */
export const BareTableThemed: Story = {
  globals: { backgrounds: { value: 'light' } },
  render: () => (
    <Table styles={{ theme: 'light' }}>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Category</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sampleData.map(row => (
          <TableRow key={row.id} hover>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.category}</TableCell>
            <TableCell>{row.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}
