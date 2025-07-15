/**
 * @fileoverview Storybook stories for the Nav component.
 * These stories showcase the various themes, configurations, and capabilities of the Nav component,
 * including different navigation structures, themes, and interactive features with up to 6 levels of depth.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from '@storybook/test'
import Nav, { NavItem } from './index'

// --------------------------------------------------------------------------
// SAMPLE DATA
// --------------------------------------------------------------------------

const basicNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    route: '/dashboard',
    trigger: 'route',
  },
  {
    title: 'Analytics',
    route: '/analytics',
    trigger: 'route',
  },
  {
    title: 'Settings',
    route: '/settings',
    trigger: 'route',
  },
]

const nestedNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    route: '/dashboard',
    trigger: 'route',
  },
  {
    title: 'Users',
    children: [
      {
        title: 'User List',
        route: '/users/list',
        trigger: 'route',
      },
      {
        title: 'Add User',
        route: '/users/add',
        trigger: 'route',
      },
      {
        title: 'User Roles',
        route: '/users/roles',
        trigger: 'route',
      },
    ],
  },
  {
    title: 'Products',
    children: [
      {
        title: 'Product List',
        route: '/products/list',
        trigger: 'route',
      },
      {
        title: 'Categories',
        route: '/products/categories',
        trigger: 'route',
      },
    ],
  },
  {
    title: 'Analytics',
    route: '/analytics',
    trigger: 'route',
  },
]

// Six-level navigation structure for comprehensive testing
const sixLevelNavItems: NavItem[] = [
  {
    title: 'Home',
    route: '/',
    trigger: 'route',
  },
  {
    title: 'Management',
    children: [
      {
        title: 'Overview',
        route: '/management',
        trigger: 'route',
      },
      {
        title: 'Users',
        children: [
          {
            title: 'All Users',
            route: '/management/users',
            trigger: 'route',
          },
          {
            title: 'User Details',
            children: [
              {
                title: 'Profile Management',
                route: '/management/users/profile',
                trigger: 'route',
              },
              {
                title: 'Permissions',
                children: [
                  {
                    title: 'Role Management',
                    route: '/management/users/permissions/roles',
                    trigger: 'route',
                  },
                  {
                    title: 'Advanced Settings',
                    children: [
                      {
                        title: 'Access Control Lists',
                        route: '/management/users/permissions/advanced/acl',
                        trigger: 'route',
                      },
                      {
                        title: 'Security Policies',
                        route:
                          '/management/users/permissions/advanced/security',
                        trigger: 'route',
                      },
                      {
                        title: 'Audit Logs',
                        route: '/management/users/permissions/advanced/audit',
                        trigger: 'route',
                      },
                    ],
                  },
                  {
                    title: 'Group Permissions',
                    route: '/management/users/permissions/groups',
                    trigger: 'route',
                  },
                ],
              },
              {
                title: 'Activity Logs',
                route: '/management/users/activity',
                trigger: 'route',
              },
            ],
          },
          {
            title: 'Add User',
            route: '/management/users/add',
            trigger: 'route',
          },
        ],
      },
      {
        title: 'Products',
        children: [
          {
            title: 'Inventory',
            route: '/management/products/inventory',
            trigger: 'route',
          },
          {
            title: 'Categories',
            children: [
              {
                title: 'Main Categories',
                route: '/management/products/categories/main',
                trigger: 'route',
              },
              {
                title: 'Subcategories',
                children: [
                  {
                    title: 'Electronics',
                    route: '/management/products/categories/sub/electronics',
                    trigger: 'route',
                  },
                  {
                    title: 'Detailed Classification',
                    children: [
                      {
                        title: 'Product Specifications',
                        route:
                          '/management/products/categories/sub/detailed/specs',
                        trigger: 'route',
                      },
                      {
                        title: 'Quality Standards',
                        route:
                          '/management/products/categories/sub/detailed/quality',
                        trigger: 'route',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Reports',
    children: [
      {
        title: 'Sales Reports',
        route: '/reports/sales',
        trigger: 'route',
      },
      {
        title: 'Analytics',
        route: '/reports/analytics',
        trigger: 'route',
      },
    ],
  },
  {
    title: 'Help',
    route: '/help',
    trigger: 'route',
  },
]

// Sacred theme navigation with comprehensive levels and Egyptian-inspired naming
const sacredSixLevelNavItems: NavItem[] = [
  {
    title: 'Divine Portal',
    route: '/',
    trigger: 'route',
  },
  {
    title: 'Sacred Archives',
    children: [
      {
        title: 'Archive Overview',
        route: '/archives',
        trigger: 'route',
      },
      {
        title: 'Scrolls of Wisdom',
        children: [
          {
            title: 'All Sacred Texts',
            route: '/archives/scrolls',
            trigger: 'route',
          },
          {
            title: 'Ancient Manuscripts',
            children: [
              {
                title: 'Hieroglyphic Records',
                route: '/archives/scrolls/manuscripts/hieroglyphic',
                trigger: 'route',
              },
              {
                title: 'Papyrus Collection',
                children: [
                  {
                    title: 'Medical Papyri',
                    route: '/archives/scrolls/manuscripts/papyrus/medical',
                    trigger: 'route',
                  },
                  {
                    title: 'Sacred Mathematics',
                    children: [
                      {
                        title: 'Geometry of Pyramids',
                        route:
                          '/archives/scrolls/manuscripts/papyrus/math/geometry',
                        trigger: 'route',
                      },
                      {
                        title: 'Astronomical Calculations',
                        route:
                          '/archives/scrolls/manuscripts/papyrus/math/astronomy',
                        trigger: 'route',
                      },
                      {
                        title: 'Divine Numerology',
                        route:
                          '/archives/scrolls/manuscripts/papyrus/math/numerology',
                        trigger: 'route',
                      },
                    ],
                  },
                  {
                    title: 'Religious Texts',
                    route: '/archives/scrolls/manuscripts/papyrus/religious',
                    trigger: 'route',
                  },
                ],
              },
              {
                title: 'Stone Inscriptions',
                route: '/archives/scrolls/manuscripts/stone',
                trigger: 'route',
              },
            ],
          },
          {
            title: 'Codex Collection',
            route: '/archives/scrolls/codex',
            trigger: 'route',
          },
        ],
      },
      {
        title: 'Temple Records',
        children: [
          {
            title: 'Daily Rituals',
            route: '/archives/temple/rituals',
            trigger: 'route',
          },
          {
            title: 'Sacred Ceremonies',
            route: '/archives/temple/ceremonies',
            trigger: 'route',
          },
        ],
      },
    ],
  },
  {
    title: 'Divine Governance',
    children: [
      {
        title: "Pharaoh's Court",
        children: [
          {
            title: 'Royal Decrees',
            route: '/governance/court/decrees',
            trigger: 'route',
          },
          {
            title: 'Court Officials',
            children: [
              {
                title: 'High Priests',
                route: '/governance/court/officials/priests',
                trigger: 'route',
              },
              {
                title: 'Sacred Scribes',
                children: [
                  {
                    title: 'Royal Scribes',
                    route: '/governance/court/officials/scribes/royal',
                    trigger: 'route',
                  },
                  {
                    title: 'Divine Scholars',
                    children: [
                      {
                        title: 'Knowledge Keepers',
                        route:
                          '/governance/court/officials/scribes/scholars/keepers',
                        trigger: 'route',
                      },
                      {
                        title: 'Wisdom Guardians',
                        route:
                          '/governance/court/officials/scribes/scholars/guardians',
                        trigger: 'route',
                      },
                      {
                        title: 'Truth Seekers',
                        route:
                          '/governance/court/officials/scribes/scholars/seekers',
                        trigger: 'route',
                      },
                    ],
                  },
                  {
                    title: 'Temple Scribes',
                    route: '/governance/court/officials/scribes/temple',
                    trigger: 'route',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: 'Sacred Laws',
        route: '/governance/laws',
        trigger: 'route',
      },
    ],
  },
  {
    title: "Thoth's Analytics",
    children: [
      {
        title: 'Divine Metrics',
        route: '/analytics/metrics',
        trigger: 'route',
      },
      {
        title: 'Cosmic Patterns',
        children: [
          {
            title: 'Stellar Alignments',
            route: '/analytics/patterns/stellar',
            trigger: 'route',
          },
          {
            title: 'Seasonal Cycles',
            route: '/analytics/patterns/seasonal',
            trigger: 'route',
          },
        ],
      },
    ],
  },
  {
    title: 'Sacred Settings',
    children: [
      {
        title: 'Temple Configuration',
        route: '/settings/temple',
        trigger: 'route',
      },
      {
        title: 'Divine Permissions',
        children: [
          {
            title: 'Priest Hierarchy',
            route: '/settings/permissions/priests',
            trigger: 'route',
          },
          {
            title: 'Sacred Access',
            children: [
              {
                title: 'Inner Sanctum',
                route: '/settings/permissions/access/sanctum',
                trigger: 'route',
              },
              {
                title: 'Sacred Chambers',
                children: [
                  {
                    title: 'Library of Thoth',
                    route: '/settings/permissions/access/chambers/library',
                    trigger: 'route',
                  },
                  {
                    title: 'Divine Vaults',
                    children: [
                      {
                        title: 'Chamber of Truth',
                        route:
                          '/settings/permissions/access/chambers/vaults/truth',
                        trigger: 'route',
                      },
                      {
                        title: 'Hall of Judgment',
                        route:
                          '/settings/permissions/access/chambers/vaults/judgment',
                        trigger: 'route',
                      },
                      {
                        title: 'Eternal Archives',
                        route:
                          '/settings/permissions/access/chambers/vaults/eternal',
                        trigger: 'route',
                      },
                    ],
                  },
                  {
                    title: 'Meditation Chambers',
                    route: '/settings/permissions/access/chambers/meditation',
                    trigger: 'route',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

// Navigation with onClick handlers
const interactiveNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    route: '/dashboard',
    trigger: 'route',
  },
  {
    title: 'Quick Actions',
    children: [
      {
        title: 'Export Data',
        trigger: 'onClick',
        onClick: () => alert('Exporting data...'),
      },
      {
        title: 'Generate Report',
        trigger: 'onClick',
        onClick: () => alert('Generating report...'),
      },
      {
        title: 'Clear Cache',
        trigger: 'onClick',
        onClick: () => alert('Cache cleared!'),
      },
    ],
  },
  {
    title: 'Settings',
    route: '/settings',
    trigger: 'route',
  },
]

// --------------------------------------------------------------------------
// WRAPPER COMPONENTS
// --------------------------------------------------------------------------

const NavWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      height: '600px',
      width: '320px',
      position: 'relative',
      overflow: 'visible',
      minWidth: 'fit-content',
    }}
  >
    {children}
  </div>
)

const MobileNavDemo: React.FC<{
  navItems: NavItem[]
  sacredtheme?: boolean
}> = ({ navItems, sacredtheme = false }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div style={{ height: '400px', width: '100%', position: 'relative' }}>
      <button
        onClick={() => setMobileOpen(true)}
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          zIndex: 1000,
          padding: '0.5rem 1rem',
          backgroundColor: sacredtheme ? '#FFD700' : '#3B82F6',
          color: sacredtheme ? '#1C1917' : 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        Open Nav
      </button>
      <Nav
        items={navItems}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        verticalNavTitle="Mobile Navigation"
        title="Sacred Mobile"
        subtitle="The Portable Wisdom"
        styles={{
          variant: 'temporary',
          theme: sacredtheme ? 'sacred' : 'light',
        }}
      />
    </div>
  )
}

// --------------------------------------------------------------------------
// META CONFIGURATION
// --------------------------------------------------------------------------

const meta: Meta<typeof Nav> = {
  title: 'Components/Nav',
  component: Nav,
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of navigation items with hierarchical structure',
    },
    verticalNavTitle: {
      control: 'text',
      description: 'Title for navigation',
    },
    title: {
      control: 'text',
      description: 'Custom title (overrides verticalNavTitle when provided)',
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle text',
    },
    searchableNavLabel: {
      control: 'text',
      description: 'Label for the searchable navigation dropdown',
    },
    titleUrl: {
      control: 'text',
      description: 'URL for the title link',
    },
    mobileOpen: {
      control: 'boolean',
      description: 'Whether mobile navigation is open',
    },
    pathname: {
      control: 'text',
      description: 'Current path for active navigation highlighting',
    },
    styles: {
      control: 'object',
      description: 'Styling configuration object',
    },
  },
}

export default meta
type Story = StoryObj<typeof Nav>

// --------------------------------------------------------------------------
// SIX LEVEL NAVIGATION STORIES
// --------------------------------------------------------------------------

/**
 * Six-level navigation with light theme demonstrating full hierarchy and dynamic width expansion.
 */
export const SixLevelLightTheme: Story = {
  name: 'Six Level/Light Theme',
  render: () => (
    <NavWrapper>
      <Nav
        items={sixLevelNavItems}
        verticalNavTitle="Six Level Navigation"
        pathname="/management/users/permissions/advanced/security"
      />
    </NavWrapper>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates 6 levels of navigation hierarchy with light theme. Shows dynamic width expansion and progressive indentation.',
      },
    },
  },
}

/**
 * Six-level navigation with sacred theme showcasing Egyptian-inspired styling.
 */
export const SixLevelSacredTheme: Story = {
  name: 'Six Level/Sacred Theme',
  render: () => (
    <NavWrapper>
      <Nav
        items={sacredSixLevelNavItems}
        title="Sacred Hierarchy"
        subtitle="Six Levels of Divine Organization"
        pathname="/archives/scrolls/manuscripts/papyrus/math/astronomy"
        styles={{
          theme: 'sacred',
        }}
      />
    </NavWrapper>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story:
          'Sacred theme with 6 levels of navigation. Features Egyptian naming, progressive indentation, and golden styling with hieroglyphic elements.',
      },
    },
  },
}

/**
 * Six-level navigation comparison showing both themes side by side.
 */
export const SixLevelComparison: Story = {
  name: 'Six Level/Theme Comparison',
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'flex-start',
        overflow: 'visible',
      }}
    >
      {/* Light Theme */}
      <div style={{ minWidth: 'fit-content' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>
          Light Theme Navigation
        </h3>
        <div
          style={{
            height: '600px',
            width: '320px',
            position: 'relative',
            overflow: 'visible',
            minWidth: 'fit-content',
          }}
        >
          <Nav
            items={sixLevelNavItems}
            verticalNavTitle="Light Navigation"
            pathname="/management/users/permissions/advanced/audit"
          />
        </div>
      </div>

      {/* Sacred Theme */}
      <div style={{ minWidth: 'fit-content' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#FFD700' }}>
          Sacred Theme Navigation
        </h3>
        <div
          style={{
            height: '600px',
            width: '320px',
            position: 'relative',
            overflow: 'visible',
            minWidth: 'fit-content',
          }}
        >
          <Nav
            items={sacredSixLevelNavItems}
            title="Sacred Archives"
            subtitle="Divine Wisdom Hierarchy"
            pathname="/governance/court/officials/scribes/scholars/guardians"
            styles={{
              theme: 'sacred',
            }}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
    docs: {
      description: {
        story:
          'Side-by-side comparison of 6-level navigation with light and sacred themes, demonstrating dynamic width expansion.',
      },
    },
  },
}

/**
 * Six-level navigation with dynamic width demonstration.
 */
export const SixLevelDynamicWidth: Story = {
  name: 'Six Level/Dynamic Width Demo',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Fixed Width Container (shows overflow behavior) */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#dc2626' }}>
          Fixed Width Container (320px)
        </h3>
        <div
          style={{
            height: '500px',
            width: '320px',
            position: 'relative',
            border: '2px dashed #dc2626',
            overflow: 'hidden',
          }}
        >
          <Nav
            items={[
              {
                title: 'Very Long Navigation Item That Should Be Cut Off',
                children: [
                  {
                    title:
                      'Another Extremely Long Menu Item That Demonstrates Text Truncation',
                    route: '/long-path',
                    trigger: 'route',
                  },
                ],
              },
            ]}
            verticalNavTitle="Fixed Width"
            pathname="/long-path"
          />
        </div>
      </div>

      {/* Dynamic Width Container (auto-expands) */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#16a34a' }}>
          Dynamic Width Container (Auto-expands)
        </h3>
        <div
          style={{
            height: '500px',
            width: '320px',
            position: 'relative',
            border: '2px dashed #16a34a',
            overflow: 'visible',
            minWidth: 'fit-content',
          }}
        >
          <Nav
            items={[
              {
                title: 'Very Long Navigation Item That Should Be Fully Visible',
                children: [
                  {
                    title:
                      'Another Extremely Long Menu Item That Demonstrates Full Text Display',
                    route: '/long-path-visible',
                    trigger: 'route',
                  },
                ],
              },
            ]}
            verticalNavTitle="Dynamic Width"
            pathname="/long-path-visible"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
    docs: {
      description: {
        story:
          'Demonstrates the difference between fixed width containers and dynamic width containers with long navigation text.',
      },
    },
  },
}

// --------------------------------------------------------------------------
// BASIC THEME STORIES
// --------------------------------------------------------------------------

/**
 * Default light theme navigation with basic items.
 */
export const LightTheme: Story = {
  name: 'Basic/Light Theme',
  render: () => (
    <NavWrapper>
      <Nav
        items={basicNavItems}
        verticalNavTitle="Light Navigation"
        pathname="/dashboard"
      />
    </NavWrapper>
  ),
}

/**
 * Dark theme navigation with enhanced styling.
 */
export const DarkTheme: Story = {
  name: 'Basic/Dark Theme',
  render: () => (
    <NavWrapper>
      <Nav
        items={basicNavItems}
        verticalNavTitle="Dark Navigation"
        pathname="/analytics"
        styles={{
          backgroundColor: '#1F2937',
        }}
      />
    </NavWrapper>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

/**
 * Sacred theme navigation with Egyptian-inspired styling.
 */
export const SacredTheme: Story = {
  name: 'Basic/Sacred Theme',
  render: () => (
    <NavWrapper>
      <Nav
        items={basicNavItems}
        title="Sacred Navigation"
        subtitle="Divine Interface"
        pathname="/settings"
        styles={{
          theme: 'sacred',
        }}
      />
    </NavWrapper>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// NAVIGATION STRUCTURE STORIES
// --------------------------------------------------------------------------

/**
 * Nested navigation with expandable sections.
 */
export const NestedNavigation: Story = {
  name: 'Structure/Nested',
  render: () => (
    <NavWrapper>
      <Nav
        items={nestedNavItems}
        verticalNavTitle="Nested Navigation"
        pathname="/users/add"
      />
    </NavWrapper>
  ),
}

/**
 * Interactive navigation with onClick handlers.
 */
export const InteractiveNavigation: Story = {
  name: 'Structure/Interactive',
  render: () => (
    <NavWrapper>
      <Nav
        items={interactiveNavItems}
        verticalNavTitle="Interactive Navigation"
        pathname="/dashboard"
      />
    </NavWrapper>
  ),
}

// --------------------------------------------------------------------------
// VARIANT STORIES
// --------------------------------------------------------------------------

/**
 * Temporary navigation for mobile with six levels.
 */
export const TemporaryVariant: Story = {
  name: 'Variant/Temporary (Mobile)',
  render: () => <MobileNavDemo navItems={sixLevelNavItems} />,
}

/**
 * Sacred theme temporary navigation with six levels.
 */
export const SacredTemporaryVariant: Story = {
  name: 'Variant/Sacred Mobile',
  render: () => (
    <MobileNavDemo navItems={sacredSixLevelNavItems} sacredtheme={true} />
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// CONFIGURATION STORIES
// --------------------------------------------------------------------------

/**
 * Navigation without search functionality.
 */
export const WithoutSearch: Story = {
  name: 'Configuration/No Search',
  render: () => (
    <NavWrapper>
      <Nav
        items={sixLevelNavItems}
        verticalNavTitle="No Search Navigation"
        pathname="/management/users/permissions/roles"
        styles={{
          showSearchableNav: false,
        }}
      />
    </NavWrapper>
  ),
}

/**
 * Minimal navigation configuration.
 */
export const MinimalConfiguration: Story = {
  name: 'Configuration/Minimal',
  render: () => (
    <NavWrapper>
      <Nav
        items={basicNavItems}
        pathname="/analytics"
        styles={{
          showSearchableNav: false,
          showTitle: false,
          showLine: false,
        }}
      />
    </NavWrapper>
  ),
}

// --------------------------------------------------------------------------
// COMPREHENSIVE SHOWCASE
// --------------------------------------------------------------------------

/**
 * Comprehensive showcase of all navigation features and themes.
 */
export const ComprehensiveShowcase: Story = {
  name: 'Comprehensive Showcase',
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        padding: '2rem',
        minHeight: '100vh',
        overflow: 'visible',
      }}
    >
      {/* Six Level Light Theme */}
      <div
        style={{
          height: '600px',
          position: 'relative',
          overflow: 'visible',
          minWidth: 'fit-content',
        }}
      >
        <h3
          style={{
            margin: '0 0 1rem 0',
            color: '#374151',
            textAlign: 'center',
          }}
        >
          Six Level Light Theme
        </h3>
        <Nav
          items={sixLevelNavItems}
          verticalNavTitle="Light Navigation"
          pathname="/management/users/permissions/advanced/audit"
        />
      </div>

      {/* Six Level Sacred Theme */}
      <div
        style={{
          height: '600px',
          position: 'relative',
          overflow: 'visible',
          minWidth: 'fit-content',
        }}
      >
        <h3
          style={{
            margin: '0 0 1rem 0',
            color: '#FFD700',
            textAlign: 'center',
          }}
        >
          Six Level Sacred Theme
        </h3>
        <Nav
          items={sacredSixLevelNavItems}
          title="Sacred Archives"
          subtitle="Divine Hierarchy"
          pathname="/governance/court/officials/scribes/scholars/keepers"
          styles={{
            theme: 'sacred',
          }}
        />
      </div>

      {/* Interactive Features */}
      <div
        style={{
          height: '600px',
          position: 'relative',
          overflow: 'visible',
          minWidth: 'fit-content',
        }}
      >
        <h3
          style={{
            margin: '0 0 1rem 0',
            color: '#7C3AED',
            textAlign: 'center',
          }}
        >
          Interactive Features
        </h3>
        <Nav
          items={interactiveNavItems}
          verticalNavTitle="Interactive Nav"
          pathname="/dashboard"
          styles={{
            backgroundColor: '#7C3AED',
          }}
        />
      </div>

      {/* Custom Styling */}
      <div
        style={{
          height: '600px',
          position: 'relative',
          overflow: 'visible',
          minWidth: 'fit-content',
        }}
      >
        <h3
          style={{
            margin: '0 0 1rem 0',
            color: '#DC2626',
            textAlign: 'center',
          }}
        >
          Custom Styling
        </h3>
        <Nav
          items={nestedNavItems}
          verticalNavTitle="Custom Navigation"
          pathname="/users/roles"
          styles={{
            backgroundColor: '#DC2626',
            titleMarginTop: '1rem',
            titleMarginBottom: '1rem',
          }}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}

// --------------------------------------------------------------------------
// INTERACTION TEST
// --------------------------------------------------------------------------

export const InteractionTest: Story = {
  name: 'Interaction Test',
  render: () => (
    <NavWrapper>
      <Nav
        items={sixLevelNavItems}
        verticalNavTitle="Test Navigation"
        pathname="/management/users/permissions/advanced/security"
      />
    </NavWrapper>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Find and click on Management to expand it
    const managementItem = canvas.getByText('Management')
    await userEvent.click(managementItem)

    // Check if Users is visible after expansion
    await expect(canvas.getByText('Users')).toBeVisible()

    // Click on Users to expand it
    const usersItem = canvas.getByText('Users')
    await userEvent.click(usersItem)

    // Check if User Details is visible
    await expect(canvas.getByText('User Details')).toBeVisible()
  },
}
