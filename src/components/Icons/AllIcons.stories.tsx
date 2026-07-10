import type { Meta, StoryObj } from '@storybook/nextjs'
import React from 'react'
import * as IconModules from './index'

// --------------------------------------------------------------------------
// DRIFT-PROOF ICON LIST
// Derived directly from the barrel (src/components/Icons/index.ts), which
// re-exports every icon as `<Name>Icon`. Any icon added to the barrel shows up
// here automatically — the gallery can never silently miss an icon again
// (the previous hand-typed list had dropped 6: Account, Flag,
// IndeterminateCheckBox, LocalHospital, ShoppingBag, ViewKanban).
// --------------------------------------------------------------------------
type IconComponentType = React.ComponentType<{
  styles?: { theme?: 'light' | 'dark' | 'sacred' }
}>

const allIcons: Array<{ name: string; component: IconComponentType }> = (
  Object.entries(IconModules) as Array<[string, unknown]>
)
  .filter(([, component]) => typeof component === 'function')
  .map(([exportName, component]) => ({
    name: exportName.replace(/Icon$/, ''),
    component: component as IconComponentType,
  }))
  .sort((first, second) => first.name.localeCompare(second.name))

const meta: Meta = {
  title: 'Components/Icons/All Icons',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A comprehensive showcase of every icon with Light, Dark, and Sacred theming options. The list is derived from the icon barrel, so it always covers all icons.',
      },
    },
  },
}

export default meta

type Story = StoryObj

const IconShowcase: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
      <h1 style={{ marginBottom: '40px', textAlign: 'center', color: '#333' }}>
        🎨 Complete Icons Gallery: Light, Dark & Sacred Themes
      </h1>

      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', color: '#666' }}>
          Showcasing all {allIcons.length} icons with the centralized theme
          system
        </p>
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2
          style={{
            marginBottom: '20px',
            color: '#2d3748',
            borderBottom: '2px solid #4f46e5',
            paddingBottom: '10px',
          }}
        >
          ✨ All Icons ({allIcons.length} Total)
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {allIcons.map(({ name, component: IconComponent }) => (
            <div
              key={name}
              data-icon-name={name}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
              }}
            >
              <h3
                style={{
                  marginBottom: '15px',
                  color: '#4a5568',
                  fontSize: '16px',
                  fontWeight: '600',
                }}
              >
                {name}
              </h3>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                {/* Light Theme */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div
                    style={{
                      marginBottom: '8px',
                      fontSize: '12px',
                      color: '#6b7280',
                      fontWeight: '500',
                    }}
                  >
                    Light
                  </div>
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: '#f7fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '60px',
                    }}
                  >
                    <IconComponent styles={{ theme: 'light' }} />
                  </div>
                </div>

                {/* Dark Theme */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div
                    style={{
                      marginBottom: '8px',
                      fontSize: '12px',
                      color: '#6b7280',
                      fontWeight: '500',
                    }}
                  >
                    Dark
                  </div>
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: '#1a1a1a',
                      borderRadius: '8px',
                      border: '1px solid #333',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '60px',
                    }}
                  >
                    <IconComponent styles={{ theme: 'dark' }} />
                  </div>
                </div>

                {/* Sacred Theme */}
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div
                    style={{
                      marginBottom: '8px',
                      fontSize: '12px',
                      // Dark antique gold: keeps the sacred-gold identity while
                      // passing WCAG on the white card (4.90:1 vs 2.10:1 for #d4af37).
                      color: '#8a6d1a',
                      fontWeight: '500',
                    }}
                  >
                    Sacred
                  </div>
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: '#1a1a1a',
                      borderRadius: '8px',
                      border: '1px solid #ffd700',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      minHeight: '60px',
                    }}
                  >
                    <IconComponent styles={{ theme: 'sacred' }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Instructions */}
      <div
        style={{
          marginTop: '60px',
          padding: '20px',
          backgroundColor: '#f0f9ff',
          borderRadius: '12px',
          border: '1px solid #0284c7',
        }}
      >
        <h3 style={{ color: '#0c4a6e', marginBottom: '15px' }}>
          💡 Usage Instructions
        </h3>
        <div style={{ color: '#0369a1', fontSize: '14px', lineHeight: '1.6' }}>
          <p style={{ marginBottom: '10px' }}>
            <strong>Light Theme (Default):</strong>{' '}
            <code>{'<IconComponent />'}</code> or{' '}
            <code>{'<IconComponent styles={{ theme: "light" }} />'}</code>
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>Dark Theme:</strong>{' '}
            <code>{'<IconComponent styles={{ theme: "dark" }} />'}</code>
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>Sacred Theme:</strong>{' '}
            <code>{'<IconComponent styles={{ theme: "sacred" }} />'}</code>
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>Custom Styling:</strong>{' '}
            <code>
              {'<IconComponent styles={{ color: "#ff0000", size: 32 }} />'}
            </code>
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>Disabled State:</strong>{' '}
            <code>{'<IconComponent styles={{ disabled: true }} />'}</code>
          </p>
          <p>
            <strong>Sacred Features:</strong> Golden colors, rotating
            hieroglyphs on hover, mystical glow effects, and sacred animation
            keyframes
          </p>
        </div>
      </div>
    </div>
  )
}

export const AllIconsShowcase: Story = {
  render: () => <IconShowcase />,
  // The showcase is a light-themed sheet (#f8f9fa page, white cards, dark
  // headings) — pin the light canvas so it doesn't inherit the sacred #0e0e0e
  // default around the padded layout.
  globals: { backgrounds: { value: 'light' } },
  parameters: {
    docs: {
      description: {
        story:
          'A comprehensive showcase of every icon (derived from the barrel, so always complete) demonstrating Light, Dark, and Sacred theming using the centralized theme system.',
      },
    },
  },
}
