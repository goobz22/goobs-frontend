'use client'

import React, { useState, useMemo } from 'react'
import type { ProjectBoardStyles } from '../../../../theme'
import type {
  Task,
  RawTopic,
  RawSeverityLevel,
  RawStatus,
  RawSubStatus,
  RawCompany,
  RawCustomer,
  RawProduct,
  RawService,
  RawRegion,
} from '../../types'
import Dropdown, { type DropdownOption } from '../../../Field/Dropdown/Regular'
import MultiSelectChip, {
  type SelectOption,
} from '../../../Field/Dropdown/MultiSelect'
import TextField from '../../../Field/Text'
import ComplexTextEditor from '../../../ComplexTextEditor'

interface InlineAddTaskProps {
  onAdd: (newTask: Omit<Task, '_id'>) => void
  onCancel: () => void
  topics: RawTopic[]
  severityLevels: RawSeverityLevel[]
  statuses: RawStatus[]
  subStatuses: RawSubStatus[]
  createdUserId: string
  companyId: string
  customerId: string
  rawCompanies: RawCompany[]
  rawCustomers: RawCustomer[]
  rawProducts: RawProduct[]
  rawServices: RawService[]
  rawRegions: RawRegion[]
  styles: ProjectBoardStyles
}

export const InlineAddTask: React.FC<InlineAddTaskProps> = ({
  onAdd,
  onCancel,
  topics,
  severityLevels,
  statuses,
  subStatuses,
  createdUserId,
  companyId,
  customerId,
  rawCompanies,
  rawCustomers,
  rawProducts,
  rawServices,
  rawRegions,
  styles,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSeverityId, setSelectedSeverityId] = useState('')
  const [selectedStatusId, setSelectedStatusId] = useState('')
  const [selectedSubStatusId, setSelectedSubStatusId] = useState('')
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState(companyId)
  const [selectedCustomerId, setSelectedCustomerId] = useState(customerId)
  const [productOrService, setProductOrService] = useState<
    'product' | 'service'
  >('product')
  const [productServiceId, setProductServiceId] = useState('')
  const [selectedRegionId, setSelectedRegionId] = useState('')

  const isSacred = styles?.theme === 'sacred'
  const isDark = styles?.theme === 'dark'

  // Filter substatus options based on selected status
  const filteredSubStatuses = useMemo(() => {
    if (!selectedStatusId) return []
    return subStatuses.filter(sub => sub.statusId === selectedStatusId)
  }, [subStatuses, selectedStatusId])

  // Convert raw data to dropdown options
  const severityOptions: DropdownOption[] = useMemo(
    () => [
      { value: '', _id: '' },
      ...severityLevels.map(level => ({
        value: level.description || `Level ${level.severityLevel}`,
        _id: level._id,
      })),
    ],
    [severityLevels]
  )

  const statusOptions: DropdownOption[] = useMemo(
    () => [
      { value: '', _id: '' },
      ...statuses.map(status => ({
        value: status.status,
        _id: status._id,
      })),
    ],
    [statuses]
  )

  const subStatusOptions: DropdownOption[] = useMemo(
    () => [
      { value: '', _id: '' },
      ...filteredSubStatuses.map(subStatus => ({
        value: subStatus.subStatus,
        _id: subStatus._id,
      })),
    ],
    [filteredSubStatuses]
  )

  const companyOptions: DropdownOption[] = useMemo(
    () => [
      { value: '', _id: '' },
      ...rawCompanies.map(company => ({
        value: company.companyName,
        _id: company._id,
      })),
    ],
    [rawCompanies]
  )

  const customerOptions: DropdownOption[] = useMemo(
    () => [
      { value: '', _id: '' },
      ...rawCustomers.map(customer => ({
        value: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
        _id: customer._id,
      })),
    ],
    [rawCustomers]
  )

  const topicSelectOptions: SelectOption[] = useMemo(
    () =>
      topics.map(topic => ({
        value: topic.topic,
        _id: topic._id,
      })),
    [topics]
  )

  const productOptions: DropdownOption[] = useMemo(
    () => [
      { value: '', _id: '' },
      ...rawProducts.map(product => ({
        value: product.productName,
        _id: product._id,
      })),
    ],
    [rawProducts]
  )

  const serviceOptions: DropdownOption[] = useMemo(
    () => [
      { value: '', _id: '' },
      ...rawServices.map(service => ({
        value: service.serviceName,
        _id: service._id,
      })),
    ],
    [rawServices]
  )

  const regionOptions: DropdownOption[] = useMemo(
    () => [
      { value: '', _id: '' },
      ...rawRegions.map(region => ({
        value: region.regionName,
        _id: region._id,
      })),
    ],
    [rawRegions]
  )

  const bgColor = isSacred
    ? 'rgba(0, 0, 0, 0.95)'
    : isDark
      ? '#1F2937'
      : '#FFFFFF'

  const borderColor = isSacred
    ? 'rgba(255, 215, 0, 0.3)'
    : isDark
      ? '#374151'
      : '#E5E7EB'

  const textColor = isSacred ? '#FFD700' : isDark ? '#F9FAFB' : '#1F2937'
  const secondaryTextColor = isSacred
    ? 'rgba(255, 215, 0, 0.7)'
    : isDark
      ? '#D1D5DB'
      : '#6B7280'

  const sidebarBg = isSacred
    ? 'rgba(0, 0, 0, 0.8)'
    : isDark
      ? '#111827'
      : '#F9FAFB'

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    height: '100vh',
    width: '100%',
    backgroundColor: bgColor,
    color: textColor,
    overflow: 'hidden',
  }

  const sidebarStyle: React.CSSProperties = {
    width: '280px',
    backgroundColor: sidebarBg,
    borderRight: `1px solid ${borderColor}`,
    padding: '1.5rem',
    overflowY: 'auto',
    flexShrink: 0,
  }

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '2rem',
  }

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: secondaryTextColor,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '1rem',
    ...(isSacred && {
      color: 'rgba(255, 215, 0, 0.6)',
      fontFamily: 'Cinzel, serif',
    }),
  }

  const fieldWrapperStyle: React.CSSProperties = {
    marginBottom: '1.5rem',
  }

  const twoColumnGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  }

  const buttonStyle: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    border: `1px solid ${borderColor}`,
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  }

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Please enter a title')
      return
    }

    if (!selectedSeverityId || !selectedStatusId || !productServiceId) {
      alert(
        'Please fill in all required fields (Severity, Status, Type, and Product/Service)'
      )
      return
    }

    const newTask: Omit<Task, '_id'> = {
      title: title.trim(),
      description: description.trim(),
      severityId: selectedSeverityId,
      statusId: selectedStatusId,
      substatusId: selectedSubStatusId || selectedStatusId,
      schedulingQueueId: '',
      topicIds: selectedTopicIds,
      articleIds: [],
      companyId: selectedCompanyId,
      customerId: selectedCustomerId,
      commentIds: [],
      employeeIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      closedAt: new Date(),
      createdBy: createdUserId,
      editHistory: [],
      comments: [],
      caseUpdates: [],
      customerAssigned: '',
      severity:
        severityLevels.find(s => s._id === selectedSeverityId)?.description ||
        '',
      schedulingQueue: '',
      status: statuses.find(s => s._id === selectedStatusId)?.status || '',
      subStatus:
        subStatuses.find(s => s._id === selectedSubStatusId)?.subStatus || '',
      topicLabels: topics
        .filter(t => selectedTopicIds.includes(t._id))
        .map(t => t.topic),
      kbArticles: [],
      teamMember: '',
      nextActionDate: '',
      regionId: selectedRegionId,
      region:
        rawRegions.find(r => r._id === selectedRegionId)?.regionName || '',
      productOrService,
      productServiceName:
        productOrService === 'product'
          ? rawProducts.find(p => p._id === productServiceId)?.productName || ''
          : rawServices.find(s => s._id === productServiceId)?.serviceName ||
            '',
      productId: productOrService === 'product' ? productServiceId : '',
      serviceId: productOrService === 'service' ? productServiceId : '',
      customerInternalNotes: '',
    }

    onAdd(newTask)
  }

  return (
    <div style={containerStyle}>
      {/* Sidebar - Quick Info */}
      <div style={sidebarStyle}>
        <div style={sectionTitleStyle}>New Ticket</div>
        <p
          style={{
            fontSize: '0.875rem',
            color: secondaryTextColor,
            lineHeight: '1.6',
          }}
        >
          Fill in the details to create a new ticket. All required fields are
          marked.
        </p>

        <div style={{ marginTop: '2rem' }}>
          <div style={sectionTitleStyle}>Required Fields</div>
          <ul
            style={{
              fontSize: '0.875rem',
              color: secondaryTextColor,
              paddingLeft: '1.25rem',
            }}
          >
            <li>Title</li>
            <li>Type</li>
            <li>Product/Service</li>
            <li>Severity</li>
            <li>Status</li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '2rem',
            color: textColor,
            ...(isSacred && {
              fontFamily: 'Cinzel, serif',
              color: '#FFD700',
              textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
            }),
          }}
        >
          Create New Ticket
        </h2>

        {/* Title & Description */}
        <div style={fieldWrapperStyle}>
          <TextField
            label="Title"
            value={title}
            onChange={setTitle}
            placeholder="Enter ticket title"
            styles={{ theme: styles?.theme || 'light', required: true }}
          />
        </div>

        <div style={fieldWrapperStyle}>
          <ComplexTextEditor
            label="Description"
            value={description}
            onChange={setDescription}
            editorType="simple"
            minRows={4}
            styles={{ theme: styles?.theme || 'light' }}
          />
        </div>

        {/* Two Column Layout */}
        <div style={twoColumnGridStyle}>
          {/* Company Selection (if applicable) */}
          {rawCompanies.length > 0 && (
            <Dropdown
              label="Company"
              options={companyOptions}
              value={selectedCompanyId}
              onChange={e => setSelectedCompanyId(e.target.value)}
              styles={{ theme: styles?.theme || 'light' }}
            />
          )}

          {/* Customer Selection (if applicable) */}
          {rawCustomers.length > 0 && (
            <Dropdown
              label="Customer"
              options={customerOptions}
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              styles={{ theme: styles?.theme || 'light' }}
            />
          )}

          {/* Product or Service Type */}
          <Dropdown
            label="Type"
            options={[
              { value: 'product', _id: 'product' },
              { value: 'service', _id: 'service' },
            ]}
            value={productOrService}
            onChange={e => {
              setProductOrService(e.target.value as 'product' | 'service')
              setProductServiceId('') // Reset selection when type changes
            }}
            styles={{ theme: styles?.theme || 'light', required: true }}
          />

          {/* Product/Service Dropdown */}
          <Dropdown
            label={productOrService === 'product' ? 'Product' : 'Service'}
            options={
              productOrService === 'product' ? productOptions : serviceOptions
            }
            value={productServiceId}
            onChange={e => {
              setProductServiceId(e.target.value)
              // Reset selection when switching between product/service
              if (
                (productOrService === 'product' &&
                  !rawProducts.find(p => p._id === e.target.value)) ||
                (productOrService === 'service' &&
                  !rawServices.find(s => s._id === e.target.value))
              ) {
                setProductServiceId('')
              }
            }}
            styles={{ theme: styles?.theme || 'light', required: true }}
          />

          {/* Severity */}
          <Dropdown
            label="Severity"
            options={severityOptions}
            value={selectedSeverityId}
            onChange={e => setSelectedSeverityId(e.target.value)}
            styles={{ theme: styles?.theme || 'light', required: true }}
          />

          {/* Status */}
          <Dropdown
            label="Status"
            options={statusOptions}
            value={selectedStatusId}
            onChange={e => {
              setSelectedStatusId(e.target.value)
              setSelectedSubStatusId('') // Reset substatus when status changes
            }}
            styles={{ theme: styles?.theme || 'light', required: true }}
          />

          {/* SubStatus */}
          {filteredSubStatuses.length > 0 && (
            <Dropdown
              label="Sub Status"
              options={subStatusOptions}
              value={selectedSubStatusId}
              onChange={e => setSelectedSubStatusId(e.target.value)}
              styles={{
                theme: styles?.theme || 'light',
                disabled: !selectedStatusId,
              }}
            />
          )}

          {/* Region */}
          {rawRegions.length > 0 && (
            <Dropdown
              label="Region"
              options={regionOptions}
              value={selectedRegionId}
              onChange={e => setSelectedRegionId(e.target.value)}
              styles={{ theme: styles?.theme || 'light' }}
            />
          )}
        </div>

        {/* Topics */}
        {topics.length > 0 && (
          <div style={fieldWrapperStyle}>
            <MultiSelectChip
              label="Topics"
              options={topicSelectOptions}
              defaultSelected={selectedTopicIds}
              onChange={values => {
                // Map topic values back to IDs
                const newIds = values
                  .map(value => topics.find(t => t.topic === value)?._id)
                  .filter((id): id is string => id !== undefined)
                setSelectedTopicIds(newIds)
              }}
              styles={{ theme: styles?.theme || 'light' }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            onClick={handleSubmit}
            style={{
              ...buttonStyle,
              backgroundColor: isSacred
                ? 'rgba(255, 215, 0, 0.2)'
                : isDark
                  ? '#3B82F6'
                  : '#3B82F6',
              color: isSacred ? '#FFD700' : '#FFFFFF',
              borderColor: isSacred ? 'rgba(255, 215, 0, 0.5)' : '#3B82F6',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = isSacred
                ? 'rgba(255, 215, 0, 0.3)'
                : isDark
                  ? '#2563EB'
                  : '#2563EB'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = isSacred
                ? 'rgba(255, 215, 0, 0.2)'
                : isDark
                  ? '#3B82F6'
                  : '#3B82F6'
            }}
          >
            Create Ticket
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              style={{
                ...buttonStyle,
                backgroundColor: 'transparent',
                color: textColor,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = isSacred
                  ? 'rgba(255, 215, 0, 0.1)'
                  : isDark
                    ? '#374151'
                    : '#F3F4F6'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
