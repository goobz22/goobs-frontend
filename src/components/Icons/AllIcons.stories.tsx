import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

// Import all the updated icons that support premium/sacred theming
import InfoIcon from './Info'
import WarningIcon from './Warning'
import AddIcon from './Add'
import RemoveIcon from './Remove'
import CheckIcon from './Check'
import ArrowBackIcon from './ArrowBack'
import DeleteIcon from './Delete'
import EditIcon from './Edit'
import SearchIcon from './Search'
import CloseIcon from './Close'
import ExpandMoreIcon from './ExpandMore'
import ShowHideEyeIcon from './ShowHideEye'
import FavoriteIcon from './FavoriteIcon'
import AccessTimeIcon from './AccessTime'
import ArrowDropDownIcon from './ArrowDropDown'
import ArrowDropUpIcon from './ArrowDropUp'
import CheckCircleIcon from './CheckCircle'
import ErrorIcon from './Error'
import DownloadIcon from './Download'
import LockIcon from './Lock'
import CodeIcon from './Code'
import CalendarIcon from './Calendar'
import CheckCircleOutlineIcon from './CheckCircleOutline'
import CircleOutlineIcon from './CircleOutline'
import ContentCopyIcon from './ContentCopy'
import DragIcon from './Drag'
import FileCopyIcon from './FileCopy'
import FirstPageIcon from './FirstPage'
import FormatAlignCenterIcon from './FormatAlignCenter'
import FormatAlignLeftIcon from './FormatAlignLeft'
import FormatAlignRightIcon from './FormatAlignRight'
import FormatBoldIcon from './FormatBold'
import FormatItalicIcon from './FormatItalic'
import FormatListBulletedIcon from './FormatListBulleted'
import FormatListNumberedIcon from './FormatListNumbered'
import FormatUnderlinedIcon from './FormatUnderlined'
import HistoryIcon from './History'
import InfoOutlineIcon from './InfoOutline'
import KeyboardArrowLeftIcon from './KeyboardArrowLeft'
import KeyboardArrowRightIcon from './KeyboardArrowRight'
import LastPageIcon from './LastPage'
import LinkIcon from './Link'
import MoreVertIcon from './MoreVert'
import RedoIcon from './Redo'
import StrikethroughSIcon from './StrikethroughS'
import UndoIcon from './Undo'

const meta: Meta = {
  title: 'Icons/All Icons Showcase',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A comprehensive showcase of all icons with both Premium and Sacred theming options.',
      },
    },
  },
}

export default meta

type Story = StoryObj

// All icons with premium/sacred theming support
const allIcons = [
  { name: 'Info', component: InfoIcon },
  { name: 'Warning', component: WarningIcon },
  { name: 'Add', component: AddIcon },
  { name: 'Remove', component: RemoveIcon },
  { name: 'Check', component: CheckIcon },
  { name: 'ArrowBack', component: ArrowBackIcon },
  { name: 'Delete', component: DeleteIcon },
  { name: 'Edit', component: EditIcon },
  { name: 'Search', component: SearchIcon },
  { name: 'Close', component: CloseIcon },
  { name: 'ExpandMore', component: ExpandMoreIcon },
  { name: 'ShowHideEye', component: ShowHideEyeIcon },
  { name: 'Favorite', component: FavoriteIcon },
  { name: 'AccessTime', component: AccessTimeIcon },
  { name: 'ArrowDropDown', component: ArrowDropDownIcon },
  { name: 'ArrowDropUp', component: ArrowDropUpIcon },
  { name: 'CheckCircle', component: CheckCircleIcon },
  { name: 'Error', component: ErrorIcon },
  { name: 'Download', component: DownloadIcon },
  { name: 'Lock', component: LockIcon },
  { name: 'Code', component: CodeIcon },
  { name: 'Calendar', component: CalendarIcon },
  { name: 'CheckCircleOutline', component: CheckCircleOutlineIcon },
  { name: 'CircleOutline', component: CircleOutlineIcon },
  { name: 'ContentCopy', component: ContentCopyIcon },
  { name: 'Drag', component: DragIcon },
  { name: 'FileCopy', component: FileCopyIcon },
  { name: 'FirstPage', component: FirstPageIcon },
  { name: 'FormatAlignCenter', component: FormatAlignCenterIcon },
  { name: 'FormatAlignLeft', component: FormatAlignLeftIcon },
  { name: 'FormatAlignRight', component: FormatAlignRightIcon },
  { name: 'FormatBold', component: FormatBoldIcon },
  { name: 'FormatItalic', component: FormatItalicIcon },
  { name: 'FormatListBulleted', component: FormatListBulletedIcon },
  { name: 'FormatListNumbered', component: FormatListNumberedIcon },
  { name: 'FormatUnderlined', component: FormatUnderlinedIcon },
  { name: 'History', component: HistoryIcon },
  { name: 'InfoOutline', component: InfoOutlineIcon },
  { name: 'KeyboardArrowLeft', component: KeyboardArrowLeftIcon },
  { name: 'KeyboardArrowRight', component: KeyboardArrowRightIcon },
  { name: 'LastPage', component: LastPageIcon },
  { name: 'Link', component: LinkIcon },
  { name: 'MoreVert', component: MoreVertIcon },
  { name: 'Redo', component: RedoIcon },
  { name: 'StrikethroughS', component: StrikethroughSIcon },
  { name: 'Undo', component: UndoIcon },
]

const IconShowcase: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
      <h1 style={{ marginBottom: '40px', textAlign: 'center', color: '#333' }}>
        🎨 Icons Gallery: Premium & Sacred Themes
      </h1>

      <div style={{ marginBottom: '60px' }}>
        <h2
          style={{
            marginBottom: '20px',
            color: '#2d3748',
            borderBottom: '2px solid #4f46e5',
            paddingBottom: '10px',
          }}
        >
          ✨ All Icons (Premium & Sacred Support)
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {allIcons.map(({ name, component: IconComponent }) => (
            <div
              key={name}
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
                  gap: '20px',
                }}
              >
                {/* Premium Theme */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      marginBottom: '8px',
                      fontSize: '14px',
                      color: '#6b7280',
                      fontWeight: '500',
                    }}
                  >
                    Premium
                  </div>
                  <div
                    style={{
                      padding: '16px',
                      backgroundColor: '#f7fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    {name === 'ShowHideEye' ? (
                      <IconComponent visible={true} sacredtheme={false} />
                    ) : name === 'Favorite' ? (
                      <IconComponent sacredtheme={false} />
                    ) : (
                      <IconComponent sacredtheme={false} />
                    )}
                  </div>
                </div>

                {/* Sacred Theme */}
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      marginBottom: '8px',
                      fontSize: '14px',
                      color: '#d4af37',
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
                    }}
                  >
                    {name === 'ShowHideEye' ? (
                      <IconComponent visible={true} sacredtheme={true} />
                    ) : name === 'Favorite' ? (
                      <IconComponent sacredtheme={true} />
                    ) : (
                      <IconComponent sacredtheme={true} />
                    )}
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
            <strong>Premium Theme (Default):</strong>{' '}
            <code>{'<IconComponent />'}</code> or{' '}
            <code>{'<IconComponent sacredtheme={false} />'}</code>
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>Sacred Theme:</strong>{' '}
            <code>{'<IconComponent sacredtheme={true} />'}</code>
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>Hover Effects:</strong> All icons include interactive hover
            animations
          </p>
          <p>
            <strong>Sacred Features:</strong> Golden colors, rotating
            hieroglyphs, and mystical glow effects
          </p>
        </div>
      </div>
    </div>
  )
}

export const AllIconsShowcase: Story = {
  render: () => <IconShowcase />,
  parameters: {
    docs: {
      description: {
        story:
          'A comprehensive showcase of all icons demonstrating both Premium and Sacred theming capabilities.',
      },
    },
  },
}
