'use client'

import React, { useState, useMemo, ChangeEvent } from 'react'
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
  RawArticle,
} from '../../types'
import Dropdown, { type DropdownOption } from '../../../Field/Dropdown/Regular'
import MultiSelectChip, {
  type SelectOption,
} from '../../../Field/Dropdown/MultiSelect'
import TextField from '../../../Field/Text'
import ComplexTextEditor from '../../../ComplexTextEditor'
import SearchBar from '../../../Field/Search'

type AddTaskTabType = 'details' | 'knowledgeBase'

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
  /** Raw customers - only required for company variant (companies deal with customers) */
  rawCustomers?: RawCustomer[]
  /** Raw products - only required for company variant (admin only has services) */
  rawProducts?: RawProduct[]
  rawServices: RawService[]
  rawRegions: RawRegion[]
  knowledgebaseArticles?: RawArticle[]
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
  rawCustomers = [],
  rawProducts = [],
  rawServices,
  rawRegions,
  knowledgebaseArticles = [],
  styles,
}) => {
  const [activeTab, setActiveTab] = useState<AddTaskTabType>('details')
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
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([])
  const [articleSearchTerm, setArticleSearchTerm] = useState('')
  const [viewingArticle, setViewingArticle] = useState<RawArticle | null>(null)
  const [validationError, setValidationError] = useState('')

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

  // Filter articles based on search term
  const filteredArticles = useMemo(() => {
    if (!articleSearchTerm) return knowledgebaseArticles
    const term = articleSearchTerm.toLowerCase()
    return knowledgebaseArticles.filter(article => {
      const titleMatch = article.articleTitle?.toLowerCase().includes(term)
      const purposeMatch = article.purpose?.toLowerCase().includes(term)
      const symptomsMatch = article.symptoms?.toLowerCase().includes(term)
      const resolutionMatch = article.resolution?.toLowerCase().includes(term)
      return titleMatch || purposeMatch || symptomsMatch || resolutionMatch
    })
  }, [knowledgebaseArticles, articleSearchTerm])

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
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }

  const tabsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem 1.5rem 0',
    borderBottom: `1px solid ${borderColor}`,
    backgroundColor: bgColor,
  }

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '0.75rem 1.5rem',
    backgroundColor: isActive
      ? isSacred
        ? 'rgba(255, 215, 0, 0.2)'
        : isDark
          ? '#374151'
          : '#FFFFFF'
      : isSacred
        ? 'rgba(255, 215, 0, 0.05)'
        : isDark
          ? '#1F2937'
          : '#F3F4F6',
    border: `1px solid ${borderColor}`,
    borderBottom: isActive ? 'none' : `1px solid ${borderColor}`,
    borderRadius: '8px 8px 0 0',
    cursor: 'pointer',
    fontWeight: isActive ? 600 : 400,
    color: isActive ? textColor : secondaryTextColor,
    transition: 'all 0.2s',
    fontSize: '0.875rem',
    ...(isActive && {
      transform: 'translateY(1px)',
    }),
  })

  const contentAreaStyle: React.CSSProperties = {
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
      setValidationError('Please enter a title')
      return
    }

    if (!selectedSeverityId || !selectedStatusId || !productServiceId) {
      setValidationError(
        'Please fill in all required fields (Severity, Status, Type, and Product/Service)'
      )
      return
    }

    setValidationError('')

    const newTask: Omit<Task, '_id'> = {
      title: title.trim(),
      description: description.trim(),
      severityId: selectedSeverityId,
      statusId: selectedStatusId,
      substatusId: selectedSubStatusId || selectedStatusId,
      schedulingQueueId: '',
      topicIds: selectedTopicIds,
      articleIds: selectedArticleIds,
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
      kbArticles: knowledgebaseArticles
        .filter(a => selectedArticleIds.includes(a._id))
        .map(a => a.articleTitle),
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
      companyInternalNotes: '',
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
        {/* Tabs */}
        <div style={tabsContainerStyle}>
          <div
            style={tabStyle(activeTab === 'details')}
            onClick={() => setActiveTab('details')}
          >
            Ticket Details
          </div>
          <div
            style={tabStyle(activeTab === 'knowledgeBase')}
            onClick={() => setActiveTab('knowledgeBase')}
          >
            Knowledgebase{' '}
            {selectedArticleIds.length > 0 && `(${selectedArticleIds.length})`}
          </div>
        </div>

        {/* Content Area */}
        <div style={contentAreaStyle}>
          {activeTab === 'details' ? (
            <>
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
                    { value: 'Product', _id: 'product' },
                    { value: 'Service', _id: 'service' },
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
                    productOrService === 'product'
                      ? productOptions
                      : serviceOptions
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
            </>
          ) : (
            /* Knowledge Base Tab */
            <div>
              {viewingArticle ? (
                /* Article Detail View */
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <button
                      onClick={() => setViewingArticle(null)}
                      style={{
                        background: 'none',
                        border: `1px solid ${borderColor}`,
                        borderRadius: '6px',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        color: textColor,
                        fontSize: '0.875rem',
                      }}
                    >
                      ← Back to Articles
                    </button>
                  </div>

                  <h2
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: textColor,
                      marginBottom: '1rem',
                      ...(isSacred && {
                        fontFamily: 'Cinzel, serif',
                        color: '#FFD700',
                      }),
                    }}
                  >
                    {viewingArticle.articleTitle}
                  </h2>

                  {/* Link/Unlink Button */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    {selectedArticleIds.includes(viewingArticle._id) ? (
                      <button
                        onClick={() =>
                          setSelectedArticleIds(prev =>
                            prev.filter(id => id !== viewingArticle._id)
                          )
                        }
                        style={{
                          padding: '0.75rem 1.5rem',
                          backgroundColor: isSacred
                            ? 'rgba(239, 68, 68, 0.2)'
                            : isDark
                              ? '#7f1d1d'
                              : '#EF4444',
                          color: isSacred ? '#F87171' : '#FFFFFF',
                          border: `1px solid ${isSacred ? 'rgba(239, 68, 68, 0.5)' : '#EF4444'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        ✓ Linked - Click to Unlink
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setSelectedArticleIds(prev => [
                            ...prev,
                            viewingArticle._id,
                          ])
                        }
                        style={{
                          padding: '0.75rem 1.5rem',
                          backgroundColor: isSacred
                            ? 'rgba(255, 215, 0, 0.2)'
                            : isDark
                              ? '#1e40af'
                              : '#3B82F6',
                          color: isSacred ? '#FFD700' : '#FFFFFF',
                          border: `1px solid ${isSacred ? 'rgba(255, 215, 0, 0.5)' : '#3B82F6'}`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        Link to This Case
                      </button>
                    )}
                  </div>

                  {viewingArticle.categoryName && (
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: isSacred
                          ? 'rgba(255, 215, 0, 0.15)'
                          : isDark
                            ? '#374151'
                            : '#E5E7EB',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        color: isSacred ? '#FFD700' : textColor,
                        marginBottom: '1.5rem',
                      }}
                    >
                      {viewingArticle.categoryName}
                    </div>
                  )}

                  {/* Render dynamic fieldValues if present, else fall back to legacy named fields */}
                  {viewingArticle.fieldValues && Object.keys(viewingArticle.fieldValues).length > 0
                    ? Object.entries(viewingArticle.fieldValues).map(([key, value]) => {
                        if (!value || value.trim() === '') return null
                        const label = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/_/g, ' ')
                          .replace(/^\w/, c => c.toUpperCase())
                          .trim()
                        return (
                          <div key={key} style={{ marginBottom: '1.5rem' }}>
                            <div style={sectionTitleStyle}>{label}</div>
                            <div
                              style={{
                                color: secondaryTextColor,
                                fontSize: '0.875rem',
                                lineHeight: '1.6',
                                whiteSpace: 'pre-wrap',
                              }}
                              dangerouslySetInnerHTML={{ __html: value }}
                            />
                          </div>
                        )
                      })
                    : (
                      <>
                        {viewingArticle.purpose && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <div style={sectionTitleStyle}>Purpose</div>
                            <p style={{ color: secondaryTextColor, fontSize: '0.875rem', lineHeight: '1.6' }}>
                              {viewingArticle.purpose}
                            </p>
                          </div>
                        )}
                        {viewingArticle.symptoms && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <div style={sectionTitleStyle}>Symptoms</div>
                            <p style={{ color: secondaryTextColor, fontSize: '0.875rem', lineHeight: '1.6' }}>
                              {viewingArticle.symptoms}
                            </p>
                          </div>
                        )}
                        {viewingArticle.cause && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <div style={sectionTitleStyle}>Cause</div>
                            <p style={{ color: secondaryTextColor, fontSize: '0.875rem', lineHeight: '1.6' }}>
                              {viewingArticle.cause}
                            </p>
                          </div>
                        )}
                        {viewingArticle.resolution && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <div style={sectionTitleStyle}>Resolution</div>
                            <p style={{ color: secondaryTextColor, fontSize: '0.875rem', lineHeight: '1.6' }}>
                              {viewingArticle.resolution}
                            </p>
                          </div>
                        )}
                        {viewingArticle.workaround && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <div style={sectionTitleStyle}>Workaround</div>
                            <p style={{ color: secondaryTextColor, fontSize: '0.875rem', lineHeight: '1.6' }}>
                              {viewingArticle.workaround}
                            </p>
                          </div>
                        )}
                        {viewingArticle.impact && (
                          <div style={{ marginBottom: '1.5rem' }}>
                            <div style={sectionTitleStyle}>Impact</div>
                            <p style={{ color: secondaryTextColor, fontSize: '0.875rem', lineHeight: '1.6' }}>
                              {viewingArticle.impact}
                            </p>
                          </div>
                        )}
                      </>
                    )
                  }
                </div>
              ) : (
                /* Article List View */
                <>
                  <h2
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      marginBottom: '1rem',
                      color: textColor,
                      ...(isSacred && {
                        fontFamily: 'Cinzel, serif',
                        color: '#FFD700',
                        textShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                      }),
                    }}
                  >
                    Link Knowledgebase Articles
                  </h2>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: secondaryTextColor,
                      marginBottom: '1.5rem',
                    }}
                  >
                    Search and select articles to link to this ticket. Click an
                    article to view details.
                  </p>

                  {/* Search Bar */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <SearchBar
                      label="Search Articles"
                      placeholder="Search by title, symptoms, resolution..."
                      value={articleSearchTerm}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setArticleSearchTerm(e.target.value)
                      }
                      styles={{
                        theme: styles?.theme || 'light',
                      }}
                    />
                  </div>

                  {/* Selected Articles */}
                  {selectedArticleIds.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={sectionTitleStyle}>
                        Selected Articles ({selectedArticleIds.length})
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem',
                        }}
                      >
                        {selectedArticleIds.map(id => {
                          const article = knowledgebaseArticles.find(
                            a => a._id === id
                          )
                          if (!article) return null
                          return (
                            <div
                              key={id}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                backgroundColor: isSacred
                                  ? 'rgba(255, 215, 0, 0.2)'
                                  : isDark
                                    ? '#374151'
                                    : '#E5E7EB',
                                borderRadius: '20px',
                                fontSize: '0.875rem',
                                color: textColor,
                              }}
                            >
                              <span
                                style={{ cursor: 'pointer' }}
                                onClick={() => setViewingArticle(article)}
                              >
                                {article.articleTitle}
                              </span>
                              <button
                                onClick={e => {
                                  e.stopPropagation()
                                  setSelectedArticleIds(prev =>
                                    prev.filter(aid => aid !== id)
                                  )
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '0',
                                  color: secondaryTextColor,
                                  fontSize: '1rem',
                                  lineHeight: 1,
                                }}
                              >
                                ×
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Articles Grid */}
                  <div style={sectionTitleStyle}>
                    {articleSearchTerm
                      ? `Search Results (${filteredArticles.length})`
                      : `All Articles (${knowledgebaseArticles.length})`}
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(320px, 1fr))',
                      gap: '1rem',
                    }}
                  >
                    {filteredArticles.length === 0 ? (
                      <p
                        style={{
                          color: secondaryTextColor,
                          fontSize: '0.875rem',
                          textAlign: 'center',
                          gridColumn: '1 / -1',
                          padding: '2rem',
                        }}
                      >
                        {articleSearchTerm
                          ? 'No articles match your search.'
                          : 'No knowledge base articles available.'}
                      </p>
                    ) : (
                      filteredArticles.map(article => {
                        const isSelected = selectedArticleIds.includes(
                          article._id
                        )
                        return (
                          <div
                            key={article._id}
                            onClick={() => setViewingArticle(article)}
                            style={{
                              padding: '1rem',
                              backgroundColor: isSelected
                                ? isSacred
                                  ? 'rgba(255, 215, 0, 0.15)'
                                  : isDark
                                    ? 'rgba(59, 130, 246, 0.2)'
                                    : 'rgba(59, 130, 246, 0.1)'
                                : sidebarBg,
                              border: `2px solid ${
                                isSelected
                                  ? isSacred
                                    ? '#FFD700'
                                    : '#3B82F6'
                                  : borderColor
                              }`,
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '0.5rem',
                              }}
                            >
                              <h3
                                style={{
                                  fontSize: '1rem',
                                  fontWeight: 600,
                                  color: textColor,
                                  margin: 0,
                                  flex: 1,
                                }}
                              >
                                {article.articleTitle}
                              </h3>
                              {isSelected && (
                                <span
                                  style={{
                                    color: isSacred ? '#FFD700' : '#3B82F6',
                                    fontSize: '1.25rem',
                                    marginLeft: '0.5rem',
                                  }}
                                >
                                  ✓
                                </span>
                              )}
                            </div>
                            {article.categoryName && (
                              <div
                                style={{
                                  fontSize: '0.75rem',
                                  color: isSacred
                                    ? 'rgba(255, 215, 0, 0.7)'
                                    : isDark
                                      ? '#60A5FA'
                                      : '#3B82F6',
                                  marginBottom: '0.5rem',
                                }}
                              >
                                {article.categoryName}
                              </div>
                            )}
                            {article.purpose && (
                              <p
                                style={{
                                  fontSize: '0.85rem',
                                  color: secondaryTextColor,
                                  margin: '0 0 0.5rem 0',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                {article.purpose}
                              </p>
                            )}
                            {article.symptoms && (
                              <p
                                style={{
                                  fontSize: '0.8rem',
                                  color: secondaryTextColor,
                                  margin: 0,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                <strong>Symptoms:</strong> {article.symptoms}
                              </p>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Validation Error */}
          {validationError && (
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                backgroundColor: isSacred
                  ? 'rgba(220, 38, 38, 0.15)'
                  : isDark
                    ? 'rgba(220, 38, 38, 0.2)'
                    : '#FEF2F2',
                border: `1px solid ${isSacred ? 'rgba(220, 38, 38, 0.4)' : isDark ? 'rgba(220, 38, 38, 0.4)' : '#FECACA'}`,
                borderRadius: '6px',
                color: isSacred ? '#FCA5A5' : isDark ? '#FCA5A5' : '#DC2626',
                fontSize: '0.875rem',
              }}
            >
              {validationError}
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
    </div>
  )
}
