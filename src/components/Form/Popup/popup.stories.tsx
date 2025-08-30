/**
 * @fileoverview Storybook stories for the Popup component.
 * These stories showcase the draggable popup with various field components from goobs-frontend,
 * demonstrating responsive design across mobile, tablet, and desktop viewports.
 */
import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Popup from './index'
import Button from '../../Button'
import Typography from '../../Typography'
import TextField from '../../Field/Text'
import Dropdown from '../../Field/Dropdown/Regular'
import SearchableSimple from '../../Field/Dropdown/SearchableSimple'
import MultiSelectChip from '../../Field/Dropdown/MultiSelect'
import DateField from '../../Field/Date/DateField'
import PasswordField from '../../Field/Password'
import USDField from '../../Field/USD'
import PhoneNumberField from '../../Field/PhoneNumber'
import PercentageField from '../../Field/Percentage'
import SearchBar from '../../Field/Search'
import Checkbox from '../../Checkbox'
import Switch from '../../Switch'
import Divider from '../../Divider'
import Chip from '../../Chip'

const meta: Meta<typeof Popup> = {
  title: 'Components/Form/Popup',
  component: Popup,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the popup is open',
    },
    title: {
      control: 'text',
      description: 'Popup title',
    },
    description: {
      control: 'text',
      description: 'Popup description',
    },
    styles: {
      control: 'object',
      description: 'Popup styling options including theme and width',
    },
  },
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof Popup>

// Interactive wrapper for popup stories
const InteractivePopup = ({
  styles,
  title,
  description,
  content,
  buttons,
  buttonText = 'Open Popup',
  containerStyle = {},
}: {
  styles?: any
  title?: string
  description?: string
  content?: React.ReactNode
  buttons?: any[]
  buttonText?: string
  containerStyle?: React.CSSProperties
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', ...containerStyle }}>
      <Button
        styles={{
          theme:
            (styles as { theme?: 'light' | 'dark' | 'sacred' })?.theme ||
            'light',
        }}
        text={buttonText}
        onClick={() => setOpen(true)}
      />
      <Popup
        open={open}
        close={false}
        onClose={() => setOpen(false)}
        title={title}
        description={description}
        content={content}
        buttons={buttons}
        styles={styles as any}
      />
    </div>
  )
}

// User Profile Form - Mobile Optimized
const MobileUserForm = ({ theme }: { theme: 'light' | 'dark' | 'sacred' }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    department: '',
    skills: [] as string[],
    birthDate: null as Date | null,
    notifications: true,
    newsletter: false,
  })

  const departmentOptions = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
  ]

  const skillOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'react', label: 'React' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'python', label: 'Python' },
    { value: 'design', label: 'UI/UX Design' },
    { value: 'figma', label: 'Figma' },
  ]

  const containerStyle: React.CSSProperties = {
    padding: '1rem',
    width: '100%',
    maxWidth: '320px',
    color:
      theme === 'sacred' ? '#FFD700' : theme === 'dark' ? '#F9FAFB' : '#1F2937',
  }

  const sectionStyle: React.CSSProperties = {
    marginBottom: '1.5rem',
  }

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: '1.5rem',
  }

  return (
    <div style={containerStyle}>
      <div style={sectionStyle}>
        <TextField
          label="First Name"
          value={formData.firstName}
          onChange={value =>
            setFormData(prev => ({ ...prev, firstName: value }))
          }
          placeholder="Enter first name"
          styles={{ theme, required: true }}
        />
      </div>

      <div style={sectionStyle}>
        <TextField
          label="Last Name"
          value={formData.lastName}
          onChange={value =>
            setFormData(prev => ({ ...prev, lastName: value }))
          }
          placeholder="Enter last name"
          styles={{ theme, required: true }}
        />
      </div>

      <div style={sectionStyle}>
        <TextField
          label="Email"
          value={formData.email}
          onChange={value => setFormData(prev => ({ ...prev, email: value }))}
          placeholder="your@email.com"
          styles={{ theme, required: true }}
        />
      </div>

      <div style={sectionStyle}>
        <PhoneNumberField
          label="Phone Number"
          value={formData.phone}
          onChange={e =>
            setFormData(prev => ({ ...prev, phone: e.target.value }))
          }
          placeholder="(555) 123-4567"
          styles={{ theme }}
        />
      </div>

      <div style={sectionStyle}>
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

      <div style={sectionStyle}>
        <Dropdown
          label="Department"
          options={departmentOptions}
          value={formData.department}
          onChange={e =>
            setFormData(prev => ({ ...prev, department: e.target.value }))
          }
          styles={{ theme, required: true }}
        />
      </div>

      <div style={sectionStyle}>
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

      <div style={sectionStyle}>
        <DateField
          label="Birth Date"
          value={formData.birthDate}
          onChange={date => setFormData(prev => ({ ...prev, birthDate: date }))}
          placeholder="MM/DD/YYYY"
          styles={{ theme }}
        />
      </div>

      <Divider styles={{ theme, marginTop: '1rem', marginBottom: '1rem' }} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            text="Push Notifications"
            styles={{
              variant:
                theme === 'sacred' ? 'cinzelparagraph' : 'merriparagraph',
              theme,
              fontSize: '14px',
            }}
          />
          <Switch
            checked={formData.notifications}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                notifications: e.target.checked,
              }))
            }
            styles={{ theme }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            text="Email Newsletter"
            styles={{
              variant:
                theme === 'sacred' ? 'cinzelparagraph' : 'merriparagraph',
              theme,
              fontSize: '14px',
            }}
          />
          <Checkbox
            checked={formData.newsletter}
            onChange={e =>
              setFormData(prev => ({ ...prev, newsletter: e.target.checked }))
            }
            styles={{ theme }}
          />
        </div>
      </div>

      <div style={buttonGroupStyle}>
        <Button text="Create Profile" styles={{ theme, width: '100%' }} />
        <Button
          text="Cancel"
          styles={{ theme, outline: true, width: '100%' }}
        />
      </div>
    </div>
  )
}

// Project Settings Form - Tablet Optimized
const TabletProjectForm = ({
  theme,
}: {
  theme: 'light' | 'dark' | 'sacred'
}) => {
  const [formData, setFormData] = useState({
    projectName: '',
    projectType: '',
    budget: '',
    completion: '',
    priority: '',
    tags: [] as string[],
    description: '',
    searchQuery: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    autoSave: true,
    publicProject: false,
  })

  const projectTypeOptions = [
    { value: 'web', label: 'Web Application' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'desktop', label: 'Desktop Software' },
    { value: 'api', label: 'API Development' },
    { value: 'design', label: 'Design System' },
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' },
  ]

  const tagOptions = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'fullstack', label: 'Full Stack' },
    { value: 'devops', label: 'DevOps' },
    { value: 'ui', label: 'UI Design' },
    { value: 'ux', label: 'UX Research' },
    { value: 'testing', label: 'Testing' },
    { value: 'documentation', label: 'Documentation' },
  ]

  const containerStyle: React.CSSProperties = {
    padding: '1.5rem',
    width: '100%',
    maxWidth: '600px',
    color:
      theme === 'sacred' ? '#FFD700' : theme === 'dark' ? '#F9FAFB' : '#1F2937',
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1.5rem',
  }

  const fullWidthStyle: React.CSSProperties = {
    gridColumn: '1 / -1',
  }

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '2rem',
  }

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        <TextField
          label="Project Name"
          value={formData.projectName}
          onChange={value =>
            setFormData(prev => ({ ...prev, projectName: value }))
          }
          placeholder="Enter project name"
          styles={{ theme, required: true }}
        />

        <SearchableSimple
          label="Project Type"
          options={projectTypeOptions}
          defaultValue={formData.projectType}
          onChange={option =>
            setFormData(prev => ({
              ...prev,
              projectType: String(option?.value || ''),
            }))
          }
          placeholder="Select project type"
          styles={{ theme, required: true }}
        />

        <USDField
          label="Budget"
          value={formData.budget}
          onChange={e =>
            setFormData(prev => ({ ...prev, budget: e.target.value }))
          }
          placeholder="Enter budget"
          styles={{ theme }}
        />

        <PercentageField
          label="Completion"
          value={formData.completion}
          onChange={e =>
            setFormData(prev => ({ ...prev, completion: e.target.value }))
          }
          placeholder="0"
          styles={{ theme }}
        />

        <Dropdown
          label="Priority"
          options={priorityOptions}
          value={formData.priority}
          onChange={e =>
            setFormData(prev => ({ ...prev, priority: e.target.value }))
          }
          styles={{ theme }}
        />

        <DateField
          label="Start Date"
          value={formData.startDate}
          onChange={date => setFormData(prev => ({ ...prev, startDate: date }))}
          placeholder="MM/DD/YYYY"
          styles={{ theme }}
        />

        <div style={fullWidthStyle}>
          <SearchBar
            label="Quick Search"
            value={formData.searchQuery}
            onChange={e =>
              setFormData(prev => ({ ...prev, searchQuery: e.target.value }))
            }
            placeholder="Search projects, tasks, or team members..."
            styles={{ theme }}
          />
        </div>

        <div style={fullWidthStyle}>
          <MultiSelectChip
            label="Project Tags"
            options={tagOptions}
            defaultSelected={formData.tags}
            onChange={values =>
              setFormData(prev => ({ ...prev, tags: values }))
            }
            styles={{ theme }}
          />
        </div>

        <div style={fullWidthStyle}>
          <TextField
            label="Description"
            value={formData.description}
            onChange={value =>
              setFormData(prev => ({ ...prev, description: value }))
            }
            placeholder="Enter project description..."
            multiline
            rows={3}
            styles={{ theme }}
          />
        </div>
      </div>

      <Divider styles={{ theme, marginTop: '1rem', marginBottom: '1.5rem' }} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Typography
              text="Auto-save Changes"
              styles={{
                variant:
                  theme === 'sacred' ? 'cinzelparagraph' : 'merriparagraph',
                theme,
                fontWeight: 'bold',
              }}
            />
            <Typography
              text="Automatically save project changes"
              styles={{
                variant:
                  theme === 'sacred'
                    ? 'cinzelhelperfooter'
                    : 'merrihelperfooter',
                theme,
                fontSize: '12px',
                marginTop: '0.25rem',
              }}
            />
          </div>
          <Switch
            checked={formData.autoSave}
            onChange={e =>
              setFormData(prev => ({ ...prev, autoSave: e.target.checked }))
            }
            styles={{ theme }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Typography
              text="Public Project"
              styles={{
                variant:
                  theme === 'sacred' ? 'cinzelparagraph' : 'merriparagraph',
                theme,
                fontWeight: 'bold',
              }}
            />
            <Typography
              text="Make this project visible to the community"
              styles={{
                variant:
                  theme === 'sacred'
                    ? 'cinzelhelperfooter'
                    : 'merrihelperfooter',
                theme,
                fontSize: '12px',
                marginTop: '0.25rem',
              }}
            />
          </div>
          <Checkbox
            checked={formData.publicProject}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                publicProject: e.target.checked,
              }))
            }
            styles={{ theme }}
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
        }}
      >
        <Chip text="In Progress" styles={{ theme, variant: 'outlined' }} />
        <Chip text="High Priority" styles={{ theme, variant: 'filled' }} />
        <Chip text="Frontend" styles={{ theme, variant: 'outlined' }} />
      </div>

      <div style={buttonGroupStyle}>
        <Button text="Cancel" styles={{ theme, outline: true }} />
        <Button text="Save Project" styles={{ theme }} />
        <Button text="Save & Create Task" styles={{ theme }} />
      </div>
    </div>
  )
}

// Analytics Dashboard Form - Desktop Optimized
const DesktopAnalyticsForm = ({
  theme,
}: {
  theme: 'light' | 'dark' | 'sacred'
}) => {
  const [formData, setFormData] = useState({
    dashboardName: '',
    dataSource: '',
    refreshRate: '',
    chartType: '',
    dateRange: null as Date | null,
    endDate: null as Date | null,
    metrics: [] as string[],
    filters: [] as string[],
    threshold: '',
    budget: '',
    description: '',
    searchFilters: '',
    realTimeUpdates: true,
    alertsEnabled: true,
    publicDashboard: false,
    exportEnabled: true,
  })

  const dataSourceOptions = [
    { value: 'analytics', label: 'Google Analytics' },
    { value: 'database', label: 'Database Connection' },
    { value: 'api', label: 'REST API' },
    { value: 'file', label: 'File Upload' },
    { value: 'webhook', label: 'Webhook Integration' },
  ]

  const chartTypeOptions = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'scatter', label: 'Scatter Plot' },
    { value: 'heatmap', label: 'Heatmap' },
  ]

  const metricOptions = [
    { value: 'users', label: 'Active Users' },
    { value: 'sessions', label: 'Sessions' },
    { value: 'pageviews', label: 'Page Views' },
    { value: 'bounce', label: 'Bounce Rate' },
    { value: 'conversion', label: 'Conversion Rate' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'retention', label: 'User Retention' },
    { value: 'engagement', label: 'Engagement Rate' },
  ]

  const filterOptions = [
    { value: 'country', label: 'Country' },
    { value: 'device', label: 'Device Type' },
    { value: 'browser', label: 'Browser' },
    { value: 'source', label: 'Traffic Source' },
    { value: 'campaign', label: 'Campaign' },
    { value: 'age', label: 'Age Group' },
    { value: 'gender', label: 'Gender' },
  ]

  const refreshOptions = [
    { value: '1min', label: 'Every Minute' },
    { value: '5min', label: 'Every 5 Minutes' },
    { value: '15min', label: 'Every 15 Minutes' },
    { value: '1hour', label: 'Every Hour' },
    { value: 'daily', label: 'Daily' },
  ]

  const containerStyle: React.CSSProperties = {
    padding: '2rem',
    width: '100%',
    maxWidth: '900px',
    color:
      theme === 'sacred' ? '#FFD700' : theme === 'dark' ? '#F9FAFB' : '#1F2937',
  }

  const sectionStyle: React.CSSProperties = {
    marginBottom: '2rem',
  }

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color:
      theme === 'sacred' ? '#FFD700' : theme === 'dark' ? '#F9FAFB' : '#1F2937',
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  }

  const halfGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  }

  const fullWidthStyle: React.CSSProperties = {
    gridColumn: '1 / -1',
  }

  const toggleSectionStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.5rem',
    marginBottom: '2rem',
  }

  const toggleItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    borderRadius: '8px',
    border:
      theme === 'sacred'
        ? '1px solid rgba(255, 215, 0, 0.3)'
        : theme === 'dark'
          ? '1px solid #374151'
          : '1px solid #E5E7EB',
    backgroundColor:
      theme === 'sacred'
        ? 'rgba(255, 215, 0, 0.05)'
        : theme === 'dark'
          ? 'rgba(31, 41, 55, 0.5)'
          : 'rgba(249, 250, 251, 1)',
  }

  const buttonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'space-between',
    marginTop: '2rem',
  }

  const leftButtonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
  }

  const rightButtonGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
  }

  return (
    <div style={containerStyle}>
      {/* Basic Configuration */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Dashboard Configuration</h3>
        <div style={gridStyle}>
          <TextField
            label="Dashboard Name"
            value={formData.dashboardName}
            onChange={value =>
              setFormData(prev => ({ ...prev, dashboardName: value }))
            }
            placeholder="Enter dashboard name"
            styles={{ theme, required: true }}
          />

          <SearchableSimple
            label="Data Source"
            options={dataSourceOptions}
            defaultValue={formData.dataSource}
            onChange={option =>
              setFormData(prev => ({
                ...prev,
                dataSource: String(option?.value || ''),
              }))
            }
            placeholder="Select data source"
            styles={{ theme, required: true }}
          />

          <Dropdown
            label="Refresh Rate"
            options={refreshOptions}
            value={formData.refreshRate}
            onChange={e =>
              setFormData(prev => ({ ...prev, refreshRate: e.target.value }))
            }
            styles={{ theme }}
          />

          <SearchableSimple
            label="Chart Type"
            options={chartTypeOptions}
            defaultValue={formData.chartType}
            onChange={option =>
              setFormData(prev => ({
                ...prev,
                chartType: String(option?.value || ''),
              }))
            }
            placeholder="Select chart type"
            styles={{ theme }}
          />

          <PercentageField
            label="Alert Threshold"
            value={formData.threshold}
            onChange={e =>
              setFormData(prev => ({ ...prev, threshold: e.target.value }))
            }
            placeholder="0"
            styles={{ theme }}
          />

          <USDField
            label="Budget Limit"
            value={formData.budget}
            onChange={e =>
              setFormData(prev => ({ ...prev, budget: e.target.value }))
            }
            placeholder="Enter budget"
            styles={{ theme }}
          />
        </div>
      </div>

      {/* Date Range Configuration */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Date Range</h3>
        <div style={halfGridStyle}>
          <DateField
            label="Start Date"
            value={formData.dateRange}
            onChange={date =>
              setFormData(prev => ({ ...prev, dateRange: date }))
            }
            placeholder="MM/DD/YYYY"
            styles={{ theme }}
          />

          <DateField
            label="End Date"
            value={formData.endDate}
            onChange={date => setFormData(prev => ({ ...prev, endDate: date }))}
            placeholder="MM/DD/YYYY"
            styles={{ theme }}
          />
        </div>
      </div>

      {/* Metrics and Filters */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Data Configuration</h3>
        <div style={{ marginBottom: '1.5rem' }}>
          <MultiSelectChip
            label="Metrics to Track"
            options={metricOptions}
            defaultSelected={formData.metrics}
            onChange={values =>
              setFormData(prev => ({ ...prev, metrics: values }))
            }
            styles={{ theme }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <MultiSelectChip
            label="Data Filters"
            options={filterOptions}
            defaultSelected={formData.filters}
            onChange={values =>
              setFormData(prev => ({ ...prev, filters: values }))
            }
            styles={{ theme }}
          />
        </div>

        <SearchBar
          label="Advanced Filters"
          value={formData.searchFilters}
          onChange={e =>
            setFormData(prev => ({ ...prev, searchFilters: e.target.value }))
          }
          placeholder="Enter custom filter expressions..."
          styles={{ theme }}
        />
      </div>

      {/* Description */}
      <div style={sectionStyle}>
        <TextField
          label="Dashboard Description"
          value={formData.description}
          onChange={value =>
            setFormData(prev => ({ ...prev, description: value }))
          }
          placeholder="Describe the purpose and usage of this dashboard..."
          multiline
          rows={4}
          styles={{ theme }}
        />
      </div>

      <Divider styles={{ theme, marginTop: '1.5rem', marginBottom: '2rem' }} />

      {/* Toggle Options */}
      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Dashboard Settings</h3>
        <div style={toggleSectionStyle}>
          <div style={toggleItemStyle}>
            <div>
              <Typography
                text="Real-time Updates"
                styles={{
                  variant:
                    theme === 'sacred' ? 'cinzelparagraph' : 'merriparagraph',
                  theme,
                  fontWeight: 'bold',
                }}
              />
              <Typography
                text="Automatically refresh data in real-time"
                styles={{
                  variant:
                    theme === 'sacred'
                      ? 'cinzelhelperfooter'
                      : 'merrihelperfooter',
                  theme,
                  fontSize: '12px',
                  marginTop: '0.25rem',
                }}
              />
            </div>
            <Switch
              checked={formData.realTimeUpdates}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  realTimeUpdates: e.target.checked,
                }))
              }
              styles={{ theme }}
            />
          </div>

          <div style={toggleItemStyle}>
            <div>
              <Typography
                text="Alerts Enabled"
                styles={{
                  variant:
                    theme === 'sacred' ? 'cinzelparagraph' : 'merriparagraph',
                  theme,
                  fontWeight: 'bold',
                }}
              />
              <Typography
                text="Send notifications when thresholds are met"
                styles={{
                  variant:
                    theme === 'sacred'
                      ? 'cinzelhelperfooter'
                      : 'merrihelperfooter',
                  theme,
                  fontSize: '12px',
                  marginTop: '0.25rem',
                }}
              />
            </div>
            <Checkbox
              checked={formData.alertsEnabled}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  alertsEnabled: e.target.checked,
                }))
              }
              styles={{ theme }}
            />
          </div>

          <div style={toggleItemStyle}>
            <div>
              <Typography
                text="Public Dashboard"
                styles={{
                  variant:
                    theme === 'sacred' ? 'cinzelparagraph' : 'merriparagraph',
                  theme,
                  fontWeight: 'bold',
                }}
              />
              <Typography
                text="Make dashboard publicly accessible"
                styles={{
                  variant:
                    theme === 'sacred'
                      ? 'cinzelhelperfooter'
                      : 'merrihelperfooter',
                  theme,
                  fontSize: '12px',
                  marginTop: '0.25rem',
                }}
              />
            </div>
            <Switch
              checked={formData.publicDashboard}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  publicDashboard: e.target.checked,
                }))
              }
              styles={{ theme }}
            />
          </div>

          <div style={toggleItemStyle}>
            <div>
              <Typography
                text="Export Enabled"
                styles={{
                  variant:
                    theme === 'sacred' ? 'cinzelparagraph' : 'merriparagraph',
                  theme,
                  fontWeight: 'bold',
                }}
              />
              <Typography
                text="Allow data export to CSV, PDF formats"
                styles={{
                  variant:
                    theme === 'sacred'
                      ? 'cinzelhelperfooter'
                      : 'merrihelperfooter',
                  theme,
                  fontSize: '12px',
                  marginTop: '0.25rem',
                }}
              />
            </div>
            <Checkbox
              checked={formData.exportEnabled}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  exportEnabled: e.target.checked,
                }))
              }
              styles={{ theme }}
            />
          </div>
        </div>
      </div>

      {/* Status Chips */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
        }}
      >
        <Chip text="Live Dashboard" styles={{ theme, variant: 'filled' }} />
        <Chip text="Auto-refreshing" styles={{ theme, variant: 'outlined' }} />
        <Chip text="Alerts Active" styles={{ theme, variant: 'filled' }} />
        <Chip text="Public Access" styles={{ theme, variant: 'outlined' }} />
      </div>

      {/* Action Buttons */}
      <div style={buttonGroupStyle}>
        <div style={leftButtonGroupStyle}>
          <Button text="Preview" styles={{ theme, outline: true }} />
          <Button text="Export Config" styles={{ theme, outline: true }} />
        </div>
        <div style={rightButtonGroupStyle}>
          <Button text="Cancel" styles={{ theme, outline: true }} />
          <Button text="Save Draft" styles={{ theme }} />
          <Button text="Create Dashboard" styles={{ theme }} />
        </div>
      </div>
    </div>
  )
}

// --------------------------------------------------------------------------
// MOBILE VIEWPORT STORIES
// --------------------------------------------------------------------------

export const MobileLightTheme: Story = {
  name: 'Mobile/Light Theme',
  render: () => (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <InteractivePopup
        styles={{ theme: 'light', width: 350 }}
        title="Create User Profile"
        description="Please fill out your information to create a new user profile."
        content={<MobileUserForm theme="light" />}
        buttonText="Create Profile (Mobile)"
        containerStyle={{ backgroundColor: '#f8fafc' }}
      />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const MobileDarkTheme: Story = {
  name: 'Mobile/Dark Theme',
  render: () => (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <InteractivePopup
        styles={{ theme: 'dark', width: 350 }}
        title="Create User Profile"
        description="Please fill out your information to create a new user profile."
        content={<MobileUserForm theme="dark" />}
        buttonText="Create Profile (Mobile)"
        containerStyle={{ backgroundColor: '#0f172a' }}
      />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'dark' },
  },
}

export const MobileSacredTheme: Story = {
  name: 'Mobile/Sacred Theme',
  render: () => (
    <div style={{ backgroundColor: '#1C1917', minHeight: '100vh' }}>
      <InteractivePopup
        styles={{ theme: 'sacred', width: 350 }}
        title="Sacred Profile Creation"
        description="Enter your sacred information to join the mystical realm."
        content={<MobileUserForm theme="sacred" />}
        buttonText="Sacred Profile (Mobile)"
        containerStyle={{ backgroundColor: '#1C1917' }}
      />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// TABLET VIEWPORT STORIES
// --------------------------------------------------------------------------

export const TabletLightTheme: Story = {
  name: 'Tablet/Light Theme',
  render: () => (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <InteractivePopup
        styles={{ theme: 'light', width: 650 }}
        title="Project Configuration"
        description="Set up your project settings and preferences."
        content={<TabletProjectForm theme="light" />}
        buttonText="Configure Project (Tablet)"
        containerStyle={{ backgroundColor: '#f8fafc' }}
      />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
}

export const TabletDarkTheme: Story = {
  name: 'Tablet/Dark Theme',
  render: () => (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <InteractivePopup
        styles={{ theme: 'dark', width: 650 }}
        title="Project Configuration"
        description="Set up your project settings and preferences."
        content={<TabletProjectForm theme="dark" />}
        buttonText="Configure Project (Tablet)"
        containerStyle={{ backgroundColor: '#0f172a' }}
      />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'tablet' },
    backgrounds: { default: 'dark' },
  },
}

export const TabletSacredTheme: Story = {
  name: 'Tablet/Sacred Theme',
  render: () => (
    <div style={{ backgroundColor: '#1C1917', minHeight: '100vh' }}>
      <InteractivePopup
        styles={{ theme: 'sacred', width: 650 }}
        title="Sacred Project Manifestation"
        description="Channel your creative energy into a divine project configuration."
        content={<TabletProjectForm theme="sacred" />}
        buttonText="Manifest Project (Tablet)"
        containerStyle={{ backgroundColor: '#1C1917' }}
      />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'tablet' },
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// DESKTOP VIEWPORT STORIES
// --------------------------------------------------------------------------

export const DesktopLightTheme: Story = {
  name: 'Desktop/Light Theme',
  render: () => (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <InteractivePopup
        styles={{ theme: 'light', width: 950 }}
        title="Analytics Dashboard Setup"
        description="Configure your analytics dashboard with comprehensive data visualization options."
        content={<DesktopAnalyticsForm theme="light" />}
        buttonText="Create Analytics Dashboard"
        containerStyle={{ backgroundColor: '#f8fafc' }}
      />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
}

export const DesktopDarkTheme: Story = {
  name: 'Desktop/Dark Theme',
  render: () => (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh' }}>
      <InteractivePopup
        styles={{ theme: 'dark', width: 950 }}
        title="Analytics Dashboard Setup"
        description="Configure your analytics dashboard with comprehensive data visualization options."
        content={<DesktopAnalyticsForm theme="dark" />}
        buttonText="Create Analytics Dashboard"
        containerStyle={{ backgroundColor: '#0f172a' }}
      />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    backgrounds: { default: 'dark' },
  },
}

export const DesktopSacredTheme: Story = {
  name: 'Desktop/Sacred Theme',
  render: () => (
    <div style={{ backgroundColor: '#1C1917', minHeight: '100vh' }}>
      <InteractivePopup
        styles={{ theme: 'sacred', width: 950 }}
        title="Sacred Data Wisdom Dashboard"
        description="Harness the mystical power of data visualization and sacred analytics wisdom."
        content={<DesktopAnalyticsForm theme="sacred" />}
        buttonText="Channel Data Wisdom"
        containerStyle={{ backgroundColor: '#1C1917' }}
      />
    </div>
  ),
  parameters: {
    viewport: { defaultViewport: 'desktop' },
    backgrounds: { default: 'dark' },
  },
}

// --------------------------------------------------------------------------
// COMPREHENSIVE SHOWCASE
// --------------------------------------------------------------------------

export const ComprehensiveShowcase: Story = {
  name: 'All Viewport & Theme Combinations',
  render: () => (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc' }}>
      <div style={{ marginBottom: '3rem' }}>
        <Typography
          text="Popup Component Showcase"
          styles={{
            variant: 'merrih1',
            theme: 'light',
            textAlign: 'center',
            marginBottom: '1rem',
          }}
        />
        <Typography
          text="Interactive popups demonstrating responsive design across mobile, tablet, and desktop viewports with all theme variations. Each popup is draggable and showcases different goobs-frontend components."
          styles={{
            variant: 'merriparagraph',
            theme: 'light',
            textAlign: 'center',
            maxWidth: '800px',
            marginX: 'auto',
          }}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
        }}
      >
        {/* Mobile Section */}
        <div style={{ textAlign: 'center' }}>
          <Typography
            text="📱 Mobile (350px)"
            styles={{
              variant: 'merrih3',
              theme: 'light',
              marginBottom: '1rem',
            }}
          />
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <InteractivePopup
              styles={{ theme: 'light', width: 350 }}
              title="Mobile Profile"
              description="Optimized for mobile screens"
              content={<MobileUserForm theme="light" />}
              buttonText="Light Mobile"
            />
            <InteractivePopup
              styles={{ theme: 'dark', width: 350 }}
              title="Mobile Profile"
              description="Dark theme mobile experience"
              content={<MobileUserForm theme="dark" />}
              buttonText="Dark Mobile"
            />
            <InteractivePopup
              styles={{ theme: 'sacred', width: 350 }}
              title="Sacred Mobile"
              description="Mystical mobile interface"
              content={<MobileUserForm theme="sacred" />}
              buttonText="Sacred Mobile"
            />
          </div>
        </div>

        {/* Tablet Section */}
        <div style={{ textAlign: 'center' }}>
          <Typography
            text="📊 Tablet (650px)"
            styles={{
              variant: 'merrih3',
              theme: 'light',
              marginBottom: '1rem',
            }}
          />
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <InteractivePopup
              styles={{ theme: 'light', width: 650 }}
              title="Project Setup"
              description="Perfect for tablet workflows"
              content={<TabletProjectForm theme="light" />}
              buttonText="Light Tablet"
            />
            <InteractivePopup
              styles={{ theme: 'dark', width: 650 }}
              title="Project Setup"
              description="Dark theme tablet interface"
              content={<TabletProjectForm theme="dark" />}
              buttonText="Dark Tablet"
            />
            <InteractivePopup
              styles={{ theme: 'sacred', width: 650 }}
              title="Sacred Project"
              description="Mystical tablet configuration"
              content={<TabletProjectForm theme="sacred" />}
              buttonText="Sacred Tablet"
            />
          </div>
        </div>

        {/* Desktop Section */}
        <div style={{ textAlign: 'center' }}>
          <Typography
            text="🖥️ Desktop (950px)"
            styles={{
              variant: 'merrih3',
              theme: 'light',
              marginBottom: '1rem',
            }}
          />
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <InteractivePopup
              styles={{ theme: 'light', width: 950 }}
              title="Analytics Dashboard"
              description="Full-featured desktop experience"
              content={<DesktopAnalyticsForm theme="light" />}
              buttonText="Light Desktop"
            />
            <InteractivePopup
              styles={{ theme: 'dark', width: 950 }}
              title="Analytics Dashboard"
              description="Professional dark theme"
              content={<DesktopAnalyticsForm theme="dark" />}
              buttonText="Dark Desktop"
            />
            <InteractivePopup
              styles={{ theme: 'sacred', width: 950 }}
              title="Sacred Analytics"
              description="Divine data wisdom interface"
              content={<DesktopAnalyticsForm theme="sacred" />}
              buttonText="Sacred Desktop"
            />
          </div>
        </div>
      </div>

      {/* Feature Overview */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
        }}
      >
        <Typography
          text="🚀 Featured Components & Features"
          styles={{
            variant: 'merrih3',
            theme: 'light',
            marginBottom: '1.5rem',
          }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
          }}
        >
          <div>
            <Typography
              text="Form Components"
              styles={{
                variant: 'merrih4',
                theme: 'light',
                marginBottom: '0.5rem',
              }}
            />
            <ul
              style={{
                margin: 0,
                paddingLeft: '1.5rem',
                fontSize: '14px',
                color: '#6b7280',
              }}
            >
              <li>TextField (text, email, multiline)</li>
              <li>PasswordField with validation</li>
              <li>PhoneNumberField with formatting</li>
              <li>USDField for currency input</li>
              <li>PercentageField with validation</li>
              <li>DateField with date picker</li>
              <li>SearchBar for filtering</li>
            </ul>
          </div>

          <div>
            <Typography
              text="Selection Components"
              styles={{
                variant: 'merrih4',
                theme: 'light',
                marginBottom: '0.5rem',
              }}
            />
            <ul
              style={{
                margin: 0,
                paddingLeft: '1.5rem',
                fontSize: '14px',
                color: '#6b7280',
              }}
            >
              <li>Dropdown with various options</li>
              <li>SearchableSimple for filterable selects</li>
              <li>MultiSelectChip for tags/skills</li>
              <li>Checkbox for boolean options</li>
              <li>Switch for toggle controls</li>
            </ul>
          </div>

          <div>
            <Typography
              text="Layout & Display"
              styles={{
                variant: 'merrih4',
                theme: 'light',
                marginBottom: '0.5rem',
              }}
            />
            <ul
              style={{
                margin: 0,
                paddingLeft: '1.5rem',
                fontSize: '14px',
                color: '#6b7280',
              }}
            >
              <li>Typography with theme variants</li>
              <li>Divider for section separation</li>
              <li>Chip for status indicators</li>
              <li>Button with multiple variants</li>
              <li>Responsive grid layouts</li>
            </ul>
          </div>

          <div>
            <Typography
              text="Popup Features"
              styles={{
                variant: 'merrih4',
                theme: 'light',
                marginBottom: '0.5rem',
              }}
            />
            <ul
              style={{
                margin: 0,
                paddingLeft: '1.5rem',
                fontSize: '14px',
                color: '#6b7280',
              }}
            >
              <li>Drag and drop repositioning</li>
              <li>Three theme variations</li>
              <li>Responsive width sizing</li>
              <li>Auto-scrolling for tall content</li>
              <li>Sacred glyphs and animations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}
