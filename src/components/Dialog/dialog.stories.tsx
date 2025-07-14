/**
 * @fileoverview Storybook stories for the Dialog component.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Dialog from './index'
import Button from '../Button'
import TextField from '../Field/Text'
import Dropdown from '../Field/Dropdown/Regular'
import MultiSelectChip from '../Field/Dropdown/MultiSelect'
import DateField from '../Field/Date/DateField'
import PasswordField from '../Field/Password'
import SearchableSimple from '../Field/Dropdown/SearchableSimple'

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the dialog is open',
    },
    styles: {
      control: 'object',
      description: 'Custom styles using the theme system',
    },
  },
}
export default meta

type Story = StoryObj<typeof Dialog>

// Interactive wrapper for stories
const InteractiveDialog = ({
  styles,
  children,
  buttonText = 'Open Dialog',
}: {
  styles?: any
  children: React.ReactNode
  buttonText?: string
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ padding: '20px' }}>
      <Button
        styles={{ theme: styles?.theme || 'light' }}
        text={buttonText}
        onClick={() => setOpen(true)}
      />
      <Dialog open={open} onClose={() => setOpen(false)} styles={styles}>
        {children}
      </Dialog>
    </div>
  )
}

// User Profile Form Component
const UserProfileForm = ({ theme }: { theme: 'light' | 'dark' | 'sacred' }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    department: '',
    role: '',
    birthDate: null as Date | null,
    skills: [] as string[],
  })

  const departmentOptions = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
  ]

  const roleOptions = [
    { value: 'junior', label: 'Junior' },
    { value: 'mid', label: 'Mid-level' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' },
    { value: 'manager', label: 'Manager' },
  ]

  const skillOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'react', label: 'React' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'python', label: 'Python' },
    { value: 'design', label: 'UI/UX Design' },
    { value: 'figma', label: 'Figma' },
    { value: 'photoshop', label: 'Photoshop' },
  ]

  const containerStyle: React.CSSProperties = {
    padding: '24px',
    minWidth: '500px',
    maxWidth: '600px',
    color:
      theme === 'sacred' ? '#FFD700' : theme === 'dark' ? '#F9FAFB' : '#1F2937',
  }

  const titleStyle: React.CSSProperties = {
    margin: '0 0 24px 0',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color:
      theme === 'sacred' ? '#FFD700' : theme === 'dark' ? '#F9FAFB' : '#1F2937',
    textShadow: theme === 'sacred' ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none',
  }

  const formGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
  }

  const fullWidthStyle: React.CSSProperties = {
    gridColumn: '1 / -1',
  }

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Create User Profile</h2>

      <div style={formGridStyle}>
        <TextField
          label="First Name"
          value={formData.firstName}
          onChange={value =>
            setFormData(prev => ({ ...prev, firstName: value }))
          }
          placeholder="Enter first name"
          styles={{ theme, required: true }}
        />

        <TextField
          label="Last Name"
          value={formData.lastName}
          onChange={value =>
            setFormData(prev => ({ ...prev, lastName: value }))
          }
          placeholder="Enter last name"
          styles={{ theme, required: true }}
        />

        <div style={fullWidthStyle}>
          <TextField
            label="Email Address"
            value={formData.email}
            onChange={value => setFormData(prev => ({ ...prev, email: value }))}
            placeholder="Enter email address"
            styles={{ theme, required: true }}
          />
        </div>

        <div style={fullWidthStyle}>
          <PasswordField
            label="Password"
            value={formData.password}
            onChange={e =>
              setFormData(prev => ({ ...prev, password: e.target.value }))
            }
            placeholder="Enter password"
            styles={{ theme, required: true }}
          />
        </div>

        <Dropdown
          label="Department"
          options={departmentOptions}
          value={formData.department}
          onChange={e =>
            setFormData(prev => ({ ...prev, department: e.target.value }))
          }
          styles={{ theme, required: true }}
        />

        <SearchableSimple
          label="Role"
          options={roleOptions}
          defaultValue={formData.role}
          onChange={option =>
            setFormData(prev => ({ ...prev, role: option?.value || '' }))
          }
          placeholder="Select role"
          styles={{ theme, required: true }}
        />

        <DateField
          label="Birth Date"
          value={formData.birthDate}
          onChange={date => setFormData(prev => ({ ...prev, birthDate: date }))}
          placeholder="MM/DD/YYYY"
          styles={{ theme }}
        />

        <div style={fullWidthStyle}>
          <MultiSelectChip
            label="Skills"
            options={skillOptions}
            defaultSelected={formData.skills}
            onChange={values =>
              setFormData(prev => ({ ...prev, skills: values }))
            }
            styles={{ theme }}
          />
        </div>
      </div>

      <div style={buttonGroupStyle}>
        <Button text="Cancel" styles={{ theme }} />
        <Button text="Create User" styles={{ theme }} />
      </div>
    </div>
  )
}

// Tall Content Component for scroll demonstration
const TallContentForm = ({ theme }: { theme: 'light' | 'dark' | 'sacred' }) => {
  const [formData, setFormData] = useState({
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    field5: '',
    field6: '',
    field7: '',
    field8: '',
    field9: '',
    field10: '',
    field11: '',
    field12: '',
    field13: '',
    field14: '',
    field15: '',
    dropdown1: '',
    dropdown2: '',
    dropdown3: '',
    dropdown4: '',
    dropdown5: '',
  })

  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
    { value: 'option5', label: 'Option 5' },
  ]

  const containerStyle: React.CSSProperties = {
    padding: '24px',
    minWidth: '600px',
    color:
      theme === 'sacred' ? '#FFD700' : theme === 'dark' ? '#F9FAFB' : '#1F2937',
  }

  const titleStyle: React.CSSProperties = {
    margin: '0 0 24px 0',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color:
      theme === 'sacred' ? '#FFD700' : theme === 'dark' ? '#F9FAFB' : '#1F2937',
    textShadow: theme === 'sacred' ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none',
  }

  const sectionStyle: React.CSSProperties = {
    marginBottom: '32px',
  }

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '16px',
    color:
      theme === 'sacred'
        ? 'rgba(255, 215, 0, 0.9)'
        : theme === 'dark'
          ? '#E5E7EB'
          : '#374151',
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
  }

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '32px',
    position: 'sticky',
    bottom: 0,
    backgroundColor:
      theme === 'sacred'
        ? 'rgba(10, 10, 10, 0.95)'
        : theme === 'dark'
          ? 'rgba(31, 41, 55, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
    padding: '16px 0',
    marginLeft: '-24px',
    marginRight: '-24px',
    paddingLeft: '24px',
    paddingRight: '24px',
    borderTop: `1px solid ${theme === 'sacred' ? 'rgba(255, 215, 0, 0.3)' : theme === 'dark' ? 'rgba(75, 85, 99, 0.5)' : 'rgba(226, 232, 240, 0.5)'}`,
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Scroll Demonstration - Very Tall Form</h2>
      <p
        style={{
          marginBottom: '24px',
          color:
            theme === 'sacred'
              ? 'rgba(255, 215, 0, 0.8)'
              : theme === 'dark'
                ? '#D1D5DB'
                : '#6B7280',
        }}
      >
        This form demonstrates vertical scrolling with themed scrollbars. Notice
        how the scrollbar styling matches the dialog theme.
      </p>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Personal Information</h3>
        <div style={gridStyle}>
          <TextField
            label="First Name"
            value={formData.field1}
            onChange={value =>
              setFormData(prev => ({ ...prev, field1: value }))
            }
            placeholder="Enter first name"
            styles={{ theme }}
          />
          <TextField
            label="Last Name"
            value={formData.field2}
            onChange={value =>
              setFormData(prev => ({ ...prev, field2: value }))
            }
            placeholder="Enter last name"
            styles={{ theme }}
          />
          <TextField
            label="Email"
            value={formData.field3}
            onChange={value =>
              setFormData(prev => ({ ...prev, field3: value }))
            }
            placeholder="Enter email"
            styles={{ theme }}
          />
          <TextField
            label="Phone"
            value={formData.field4}
            onChange={value =>
              setFormData(prev => ({ ...prev, field4: value }))
            }
            placeholder="Enter phone"
            styles={{ theme }}
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Address Information</h3>
        <div style={gridStyle}>
          <TextField
            label="Street Address"
            value={formData.field5}
            onChange={value =>
              setFormData(prev => ({ ...prev, field5: value }))
            }
            placeholder="Enter street address"
            styles={{ theme }}
          />
          <TextField
            label="City"
            value={formData.field6}
            onChange={value =>
              setFormData(prev => ({ ...prev, field6: value }))
            }
            placeholder="Enter city"
            styles={{ theme }}
          />
          <TextField
            label="State"
            value={formData.field7}
            onChange={value =>
              setFormData(prev => ({ ...prev, field7: value }))
            }
            placeholder="Enter state"
            styles={{ theme }}
          />
          <TextField
            label="ZIP Code"
            value={formData.field8}
            onChange={value =>
              setFormData(prev => ({ ...prev, field8: value }))
            }
            placeholder="Enter ZIP code"
            styles={{ theme }}
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Work Information</h3>
        <div style={gridStyle}>
          <TextField
            label="Company"
            value={formData.field9}
            onChange={value =>
              setFormData(prev => ({ ...prev, field9: value }))
            }
            placeholder="Enter company"
            styles={{ theme }}
          />
          <TextField
            label="Position"
            value={formData.field10}
            onChange={value =>
              setFormData(prev => ({ ...prev, field10: value }))
            }
            placeholder="Enter position"
            styles={{ theme }}
          />
          <Dropdown
            label="Department"
            options={options}
            value={formData.dropdown1}
            onChange={e =>
              setFormData(prev => ({ ...prev, dropdown1: e.target.value }))
            }
            styles={{ theme }}
          />
          <Dropdown
            label="Level"
            options={options}
            value={formData.dropdown2}
            onChange={e =>
              setFormData(prev => ({ ...prev, dropdown2: e.target.value }))
            }
            styles={{ theme }}
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Additional Fields</h3>
        <div style={gridStyle}>
          <TextField
            label="Field 11"
            value={formData.field11}
            onChange={value =>
              setFormData(prev => ({ ...prev, field11: value }))
            }
            placeholder="Additional field"
            styles={{ theme }}
          />
          <TextField
            label="Field 12"
            value={formData.field12}
            onChange={value =>
              setFormData(prev => ({ ...prev, field12: value }))
            }
            placeholder="Additional field"
            styles={{ theme }}
          />
          <TextField
            label="Field 13"
            value={formData.field13}
            onChange={value =>
              setFormData(prev => ({ ...prev, field13: value }))
            }
            placeholder="Additional field"
            styles={{ theme }}
          />
          <TextField
            label="Field 14"
            value={formData.field14}
            onChange={value =>
              setFormData(prev => ({ ...prev, field14: value }))
            }
            placeholder="Additional field"
            styles={{ theme }}
          />
          <TextField
            label="Field 15"
            value={formData.field15}
            onChange={value =>
              setFormData(prev => ({ ...prev, field15: value }))
            }
            placeholder="Additional field"
            styles={{ theme }}
          />
          <Dropdown
            label="Final Dropdown"
            options={options}
            value={formData.dropdown5}
            onChange={e =>
              setFormData(prev => ({ ...prev, dropdown5: e.target.value }))
            }
            styles={{ theme }}
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>More Content</h3>
        <p
          style={{
            marginBottom: '16px',
            color:
              theme === 'sacred'
                ? 'rgba(255, 215, 0, 0.8)'
                : theme === 'dark'
                  ? '#D1D5DB'
                  : '#6B7280',
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
        <p
          style={{
            marginBottom: '16px',
            color:
              theme === 'sacred'
                ? 'rgba(255, 215, 0, 0.8)'
                : theme === 'dark'
                  ? '#D1D5DB'
                  : '#6B7280',
          }}
        >
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde
          omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
          veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </p>
      </div>

      <div style={buttonGroupStyle}>
        <Button text="Cancel" styles={{ theme }} />
        <Button text="Save All Data" styles={{ theme }} />
      </div>
    </div>
  )
}

// Confirmation Dialog Component
const ConfirmationDialog = ({
  theme,
}: {
  theme: 'light' | 'dark' | 'sacred'
}) => {
  const containerStyle: React.CSSProperties = {
    padding: '24px',
    minWidth: '400px',
    textAlign: 'center',
    color:
      theme === 'sacred' ? '#FFD700' : theme === 'dark' ? '#F9FAFB' : '#1F2937',
  }

  const titleStyle: React.CSSProperties = {
    margin: '0 0 16px 0',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color:
      theme === 'sacred' ? '#FFD700' : theme === 'dark' ? '#F9FAFB' : '#1F2937',
    textShadow: theme === 'sacred' ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none',
  }

  const messageStyle: React.CSSProperties = {
    margin: '0 0 24px 0',
    color:
      theme === 'sacred'
        ? 'rgba(255, 215, 0, 0.8)'
        : theme === 'dark'
          ? '#D1D5DB'
          : '#6B7280',
    lineHeight: '1.5',
  }

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Confirm Action</h2>
      <p style={messageStyle}>
        Are you sure you want to delete this user account? This action cannot be
        undone and will permanently remove all associated data.
      </p>
      <div style={buttonGroupStyle}>
        <Button text="Cancel" styles={{ theme }} />
        <Button text="Delete Account" styles={{ theme }} />
      </div>
    </div>
  )
}

// Settings Dialog Component
const SettingsDialog = ({ theme }: { theme: 'light' | 'dark' | 'sacred' }) => {
  const [settings, setSettings] = useState({
    notifications: '',
    privacy: '',
    theme: theme,
    language: '',
    timezone: '',
  })

  const notificationOptions = [
    { value: 'all', label: 'All notifications' },
    { value: 'important', label: 'Important only' },
    { value: 'none', label: 'No notifications' },
  ]

  const privacyOptions = [
    { value: 'public', label: 'Public profile' },
    { value: 'friends', label: 'Friends only' },
    { value: 'private', label: 'Private profile' },
  ]

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' },
  ]

  const timezoneOptions = [
    { value: 'utc', label: 'UTC' },
    { value: 'est', label: 'Eastern Time' },
    { value: 'pst', label: 'Pacific Time' },
    { value: 'gmt', label: 'GMT' },
  ]

  const containerStyle: React.CSSProperties = {
    padding: '24px',
    minWidth: '480px',
    color:
      theme === 'sacred' ? '#FFD700' : theme === 'dark' ? '#F9FAFB' : '#1F2937',
  }

  const titleStyle: React.CSSProperties = {
    margin: '0 0 24px 0',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color:
      theme === 'sacred' ? '#FFD700' : theme === 'dark' ? '#F9FAFB' : '#1F2937',
    textShadow: theme === 'sacred' ? '0 0 10px rgba(255, 215, 0, 0.5)' : 'none',
  }

  const sectionStyle: React.CSSProperties = {
    marginBottom: '20px',
  }

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
  }

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Account Settings</h2>

      <div style={sectionStyle}>
        <SearchableSimple
          label="Notifications"
          options={notificationOptions}
          defaultValue={settings.notifications}
          onChange={option =>
            setSettings(prev => ({
              ...prev,
              notifications: option?.value || '',
            }))
          }
          placeholder="Select notification preference"
          styles={{ theme }}
        />
      </div>

      <div style={sectionStyle}>
        <Dropdown
          label="Privacy"
          options={privacyOptions}
          value={settings.privacy}
          onChange={e =>
            setSettings(prev => ({ ...prev, privacy: e.target.value }))
          }
          styles={{ theme }}
        />
      </div>

      <div style={sectionStyle}>
        <Dropdown
          label="Language"
          options={languageOptions}
          value={settings.language}
          onChange={e =>
            setSettings(prev => ({ ...prev, language: e.target.value }))
          }
          styles={{ theme }}
        />
      </div>

      <div style={sectionStyle}>
        <SearchableSimple
          label="Timezone"
          options={timezoneOptions}
          defaultValue={settings.timezone}
          onChange={option =>
            setSettings(prev => ({ ...prev, timezone: option?.value || '' }))
          }
          placeholder="Select timezone"
          styles={{ theme }}
        />
      </div>

      <div style={buttonGroupStyle}>
        <Button text="Cancel" styles={{ theme }} />
        <Button text="Save Settings" styles={{ theme }} />
      </div>
    </div>
  )
}

export const LightTheme: Story = {
  name: 'Light Theme',
  render: () => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <div
          style={{ marginBottom: '2rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>Light Theme:</strong> Clean and professional dialog with light
          backgrounds and subtle shadows.
          <br />
          <strong>Features:</strong> Optimized for readability in bright
          environments, comprehensive form components, and accessible design.
        </div>
        <InteractiveDialog
          styles={{ theme: 'light' }}
          buttonText="Open User Profile Form"
        >
          <UserProfileForm theme="light" />
        </InteractiveDialog>
      </div>
    </div>
  ),
}

export const DarkTheme: Story = {
  name: 'Dark Theme',
  render: () => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <div
          style={{ marginBottom: '2rem', fontSize: '14px', color: '#94a3b8' }}
        >
          <strong>Dark Theme:</strong> Developer-friendly dark mode with high
          contrast and reduced eye strain.
          <br />
          <strong>Features:</strong> Perfect for low-light environments, modern
          form components, and smooth interactions.
        </div>
        <InteractiveDialog
          styles={{ theme: 'dark' }}
          buttonText="Open User Profile Form"
        >
          <UserProfileForm theme="dark" />
        </InteractiveDialog>
      </div>
    </div>
  ),
}

export const SacredTheme: Story = {
  name: 'Sacred Theme',
  render: () => (
    <div
      style={{
        backgroundColor: '#1C1917',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <div
          style={{ marginBottom: '2rem', fontSize: '14px', color: '#FFD700' }}
        >
          <strong>Sacred Theme:</strong> Mystical and spiritual dialog with
          sacred color palettes and ethereal aesthetics.
          <br />
          <strong>Features:</strong> Designed for contemplative sessions, sacred
          color schemes, and transcendent form experience.
        </div>
        <InteractiveDialog
          styles={{ theme: 'sacred' }}
          buttonText="Open User Profile Form"
        >
          <UserProfileForm theme="sacred" />
        </InteractiveDialog>
      </div>
    </div>
  ),
}

export const LightScrollDemo: Story = {
  name: 'Light Scroll Demo',
  render: () => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <div
          style={{ marginBottom: '2rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>Light Scroll Demo:</strong> Dialog with tall content to
          demonstrate vertical scrolling with light theme scrollbars.
          <br />
          <strong>Features:</strong> Smooth scrolling, themed scrollbar styling,
          and sticky action buttons.
        </div>
        <InteractiveDialog
          styles={{ theme: 'light' }}
          buttonText="Open Tall Form (Light)"
        >
          <TallContentForm theme="light" />
        </InteractiveDialog>
      </div>
    </div>
  ),
}

export const DarkScrollDemo: Story = {
  name: 'Dark Scroll Demo',
  render: () => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <div
          style={{ marginBottom: '2rem', fontSize: '14px', color: '#94a3b8' }}
        >
          <strong>Dark Scroll Demo:</strong> Dialog with tall content to
          demonstrate vertical scrolling with dark theme scrollbars.
          <br />
          <strong>Features:</strong> High contrast scrollbars, dark theme
          styling, and optimized for low-light environments.
        </div>
        <InteractiveDialog
          styles={{ theme: 'dark' }}
          buttonText="Open Tall Form (Dark)"
        >
          <TallContentForm theme="dark" />
        </InteractiveDialog>
      </div>
    </div>
  ),
}

export const SacredScrollDemo: Story = {
  name: 'Sacred Scroll Demo',
  render: () => (
    <div
      style={{
        backgroundColor: '#1C1917',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <div
          style={{ marginBottom: '2rem', fontSize: '14px', color: '#FFD700' }}
        >
          <strong>Sacred Scroll Demo:</strong> Dialog with tall content to
          demonstrate vertical scrolling with sacred theme scrollbars.
          <br />
          <strong>Features:</strong> Golden themed scrollbars, mystical styling,
          and ethereal scroll experience.
        </div>
        <InteractiveDialog
          styles={{ theme: 'sacred' }}
          buttonText="Open Tall Form (Sacred)"
        >
          <TallContentForm theme="sacred" />
        </InteractiveDialog>
      </div>
    </div>
  ),
}

export const LightConfirmation: Story = {
  name: 'Light Confirmation',
  render: () => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div
          style={{ marginBottom: '2rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>Light Confirmation Dialog:</strong> Clean and professional
          confirmation dialog with clear action buttons.
          <br />
          <strong>Features:</strong> Centered layout, clear messaging, and
          accessible button design.
        </div>
        <InteractiveDialog
          styles={{ theme: 'light' }}
          buttonText="Delete Account"
        >
          <ConfirmationDialog theme="light" />
        </InteractiveDialog>
      </div>
    </div>
  ),
}

export const DarkConfirmation: Story = {
  name: 'Dark Confirmation',
  render: () => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div
          style={{ marginBottom: '2rem', fontSize: '14px', color: '#94a3b8' }}
        >
          <strong>Dark Confirmation Dialog:</strong> Modern confirmation dialog
          with dark theme styling and high contrast.
          <br />
          <strong>Features:</strong> Optimized for low-light environments with
          clear visual hierarchy.
        </div>
        <InteractiveDialog
          styles={{ theme: 'dark' }}
          buttonText="Delete Account"
        >
          <ConfirmationDialog theme="dark" />
        </InteractiveDialog>
      </div>
    </div>
  ),
}

export const SacredConfirmation: Story = {
  name: 'Sacred Confirmation',
  render: () => (
    <div
      style={{
        backgroundColor: '#1C1917',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div
          style={{ marginBottom: '2rem', fontSize: '14px', color: '#FFD700' }}
        >
          <strong>Sacred Confirmation Dialog:</strong> Mystical confirmation
          dialog with sacred golden aesthetics.
          <br />
          <strong>Features:</strong> Ethereal styling, sacred typography, and
          transcendent confirmation experience.
        </div>
        <InteractiveDialog
          styles={{ theme: 'sacred' }}
          buttonText="Delete Account"
        >
          <ConfirmationDialog theme="sacred" />
        </InteractiveDialog>
      </div>
    </div>
  ),
}

export const LightSettings: Story = {
  name: 'Light Settings',
  render: () => (
    <div
      style={{
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div
          style={{ marginBottom: '2rem', fontSize: '14px', color: '#475569' }}
        >
          <strong>Light Settings Dialog:</strong> Clean settings interface with
          various dropdown components.
          <br />
          <strong>Features:</strong> Multiple form fields, dropdowns, and
          searchable selections.
        </div>
        <InteractiveDialog
          styles={{ theme: 'light' }}
          buttonText="Open Settings"
        >
          <SettingsDialog theme="light" />
        </InteractiveDialog>
      </div>
    </div>
  ),
}

export const DarkSettings: Story = {
  name: 'Dark Settings',
  render: () => (
    <div
      style={{
        backgroundColor: '#0f172a',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div
          style={{ marginBottom: '2rem', fontSize: '14px', color: '#94a3b8' }}
        >
          <strong>Dark Settings Dialog:</strong> Modern settings interface with
          dark theme styling.
          <br />
          <strong>Features:</strong> High contrast form fields, dark-optimized
          dropdowns, and smooth interactions.
        </div>
        <InteractiveDialog
          styles={{ theme: 'dark' }}
          buttonText="Open Settings"
        >
          <SettingsDialog theme="dark" />
        </InteractiveDialog>
      </div>
    </div>
  ),
}

export const SacredSettings: Story = {
  name: 'Sacred Settings',
  render: () => (
    <div
      style={{
        backgroundColor: '#1C1917',
        minHeight: '100vh',
        padding: '2rem',
        margin: 0,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div
          style={{ marginBottom: '2rem', fontSize: '14px', color: '#FFD700' }}
        >
          <strong>Sacred Settings Dialog:</strong> Mystical settings interface
          with sacred golden aesthetics.
          <br />
          <strong>Features:</strong> Ethereal form fields, sacred-themed
          dropdowns, and transcendent user experience.
        </div>
        <InteractiveDialog
          styles={{ theme: 'sacred' }}
          buttonText="Open Settings"
        >
          <SettingsDialog theme="sacred" />
        </InteractiveDialog>
      </div>
    </div>
  ),
}
