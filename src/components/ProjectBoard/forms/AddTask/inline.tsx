'use client'

import React, { useState, useMemo, useRef } from 'react'
import type {
  ProjectBoardStyles,
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
import cssStyles from './AddTask.module.css'

type AddTaskTabType = 'details' | 'knowledgeBase'

// Local class composer — filter falsy, join with spaces. Matches the
// goobs house pattern (Card / Button) instead of pulling in a class lib.
const cx = (...names: Array<string | false | undefined>): string =>
  names.filter(Boolean).join(' ')

// Keyboard parity for role="button" cards that contain block content (a
// heading etc.) and so can't be a native <button>: Enter/Space activate the
// same handler the onClick fires (WCAG 2.1.1).
const activateOnKey =
  (handler: () => void) => (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handler()
    }
  }

export interface InlineAddTaskProps {
  onAdd: (newTask: Omit<Task, '_id'>) => void
  onCancel: () => void
  topics: RawTopic[]
  severityLevels: RawSeverityLevel[]
  statuses: RawStatus[]
  subStatuses: RawSubStatus[]
  createdUserId: string
  companyId: string
  customerId: string
  /** Company roster — only the administrator-company-dropdown form supplies it. */
  rawCompanies?: RawCompany[]
  /** Customer roster — only the company-customer-dropdown form supplies it. */
  rawCustomers?: RawCustomer[]
  /** Product roster — only the company variant supplies it (admin has services only). */
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
  rawCompanies = [],
  rawCustomers = [],
  rawProducts = [],
  rawServices,
  rawRegions,
  knowledgebaseArticles = [],
  styles,
}) => {
  const [activeTab, setActiveTab] = useState<AddTaskTabType>('details')
  // Roving-tabindex refs + order for the WAI-ARIA tablist keyboard pattern.
  const tabOrder: AddTaskTabType[] = ['details', 'knowledgeBase']
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let next: number | null = null
    if (event.key === 'ArrowRight') next = (index + 1) % tabOrder.length
    else if (event.key === 'ArrowLeft')
      next = (index - 1 + tabOrder.length) % tabOrder.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabOrder.length - 1
    if (next === null) return
    event.preventDefault()
    const target = tabOrder[next]
    if (!target) return
    setActiveTab(target)
    requestAnimationFrame(() => tabRefs.current[next]?.focus())
  }
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSeverityId, setSelectedSeverityId] = useState('')
  const [selectedStatusId, setSelectedStatusId] = useState('')
  const [selectedSubStatusId, setSelectedSubStatusId] = useState('')
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState(companyId)
  const [selectedCustomerId, setSelectedCustomerId] = useState(customerId)
  const hasProducts = rawProducts.length > 0
  const hasServices = rawServices.length > 0
  const [productOrService, setProductOrService] = useState<
    'product' | 'service'
  >(hasProducts ? 'product' : 'service')
  const [productServiceId, setProductServiceId] = useState('')
  const [selectedRegionId, setSelectedRegionId] = useState('')
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([])
  const [articleSearchTerm, setArticleSearchTerm] = useState('')
  const [viewingArticle, setViewingArticle] = useState<RawArticle | null>(null)
  const [validationError, setValidationError] = useState('')

  // Theme drives the `data-theme` attribute on the styled root; sacred is the
  // hardcoded CSS default, light/dark are attribute-selector overrides. The
  // per-theme color values now live in AddTask.module.css as CSS custom
  // properties (--at-bg / --at-border / --at-text / etc.).
  const theme = styles?.theme || 'light'

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

  const handleSubmit = () => {
    const missing: string[] = []
    if (!title.trim()) missing.push('Title')
    if (!description.trim()) missing.push('Description')
    if (!selectedSeverityId) missing.push('Severity')
    if (!selectedStatusId) missing.push('Status')
    const hasProductServiceOptions =
      rawProducts.length > 0 || rawServices.length > 0
    if (hasProductServiceOptions && !productServiceId)
      missing.push('Product/Service')

    if (missing.length > 0) {
      setValidationError(
        `Please fill in all required fields (${missing.join(', ')})`
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
    <div className={cssStyles.root} data-theme={theme}>
      {/* Sidebar - Quick Info */}
      <div className={cssStyles.sidebar}>
        <div className={cssStyles.sectionTitle}>New Task</div>
        <p className={cssStyles.sidebarParagraph}>
          Fill in the details to create a new task. All required fields are
          marked.
        </p>

        <div className={cssStyles.sidebarSection}>
          <div className={cssStyles.sectionTitle}>Required Fields</div>
          <ul className={cssStyles.requiredList}>
            <li>Title</li>
            <li>Description</li>
            {(hasProducts || hasServices) && <li>Type</li>}
            {(hasProducts || hasServices) && <li>Product/Service</li>}
            <li>Severity</li>
            <li>Status</li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className={cssStyles.mainContent}>
        {/* Tabs — real WAI-ARIA tablist: native <button role="tab">s with
            aria-selected, roving tabindex, and arrow/Home/End keyboard nav.
            (They were onClick <div>s: unfocusable and unoperable by keyboard —
            WCAG 2.1.1 / 4.1.2.) data-active is preserved for the CSS + any
            existing selectors. */}
        <div
          className={cssStyles.tabsContainer}
          role="tablist"
          aria-label="Task form sections"
        >
          <button
            type="button"
            role="tab"
            id="add-task-tab-details"
            aria-selected={activeTab === 'details'}
            aria-controls="add-task-panel-details"
            tabIndex={activeTab === 'details' ? 0 : -1}
            ref={el => {
              tabRefs.current[0] = el
            }}
            className={cssStyles.tab}
            data-active={activeTab === 'details'}
            onClick={() => setActiveTab('details')}
            onKeyDown={event => handleTabKeyDown(event, 0)}
          >
            Task Details
          </button>
          <button
            type="button"
            role="tab"
            id="add-task-tab-knowledgeBase"
            aria-selected={activeTab === 'knowledgeBase'}
            aria-controls="add-task-panel-knowledgeBase"
            tabIndex={activeTab === 'knowledgeBase' ? 0 : -1}
            ref={el => {
              tabRefs.current[1] = el
            }}
            className={cssStyles.tab}
            data-active={activeTab === 'knowledgeBase'}
            onClick={() => setActiveTab('knowledgeBase')}
            onKeyDown={event => handleTabKeyDown(event, 1)}
          >
            Knowledgebase{' '}
            {selectedArticleIds.length > 0 && `(${selectedArticleIds.length})`}
          </button>
        </div>

        {/* Content Area — the active tab's panel. */}
        <div
          className={cssStyles.contentArea}
          role="tabpanel"
          id={`add-task-panel-${activeTab}`}
          aria-labelledby={`add-task-tab-${activeTab}`}
        >
          {activeTab === 'details' ? (
            <>
              <h2 className={cssStyles.heading}>Create New Task</h2>

              {/* Title & Description */}
              <div className={cssStyles.fieldWrapper}>
                <TextField
                  label="Title"
                  value={title}
                  onChange={setTitle}
                  placeholder="Enter task title"
                  styles={{ theme: styles?.theme || 'light', required: true }}
                />
              </div>

              <div className={cssStyles.fieldWrapper}>
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
              <div className={cssStyles.twoColumnGrid}>
                {/* Company Selection (if applicable) */}
                {rawCompanies.length > 0 && (
                  <Dropdown
                    label="Company"
                    options={companyOptions}
                    value={selectedCompanyId}
                    onChange={value => setSelectedCompanyId(value)}
                    styles={{ theme: styles?.theme || 'light' }}
                  />
                )}

                {/* Customer Selection (if applicable) */}
                {rawCustomers.length > 0 && (
                  <Dropdown
                    label="Customer"
                    options={customerOptions}
                    value={selectedCustomerId}
                    onChange={value => setSelectedCustomerId(value)}
                    styles={{ theme: styles?.theme || 'light' }}
                  />
                )}

                {/* Product or Service Type - only show when at least one type has data */}
                {hasProducts && hasServices ? (
                  <Dropdown
                    label="Type"
                    options={[
                      { value: 'Product', _id: 'product' },
                      { value: 'Service', _id: 'service' },
                    ]}
                    value={productOrService}
                    onChange={value => {
                      setProductOrService(value as 'product' | 'service')
                      setProductServiceId('') // Reset selection when type changes
                    }}
                    styles={{ theme: styles?.theme || 'light', required: true }}
                  />
                ) : hasProducts || hasServices ? (
                  <Dropdown
                    label="Type"
                    options={[
                      hasProducts
                        ? { value: 'Product', _id: 'product' }
                        : { value: 'Service', _id: 'service' },
                    ]}
                    value={productOrService}
                    onChange={() => {}}
                    styles={{
                      theme: styles?.theme || 'light',
                      required: true,
                      disabled: true,
                    }}
                  />
                ) : null}

                {/* Product/Service Dropdown - only show when options exist */}
                {(hasProducts || hasServices) && (
                  <Dropdown
                    label={
                      productOrService === 'product' ? 'Product' : 'Service'
                    }
                    options={
                      productOrService === 'product'
                        ? productOptions
                        : serviceOptions
                    }
                    value={productServiceId}
                    onChange={value => {
                      setProductServiceId(value)
                      // Reset selection when switching between product/service
                      if (
                        (productOrService === 'product' &&
                          !rawProducts.find(p => p._id === value)) ||
                        (productOrService === 'service' &&
                          !rawServices.find(s => s._id === value))
                      ) {
                        setProductServiceId('')
                      }
                    }}
                    styles={{ theme: styles?.theme || 'light', required: true }}
                  />
                )}

                {/* Severity */}
                <Dropdown
                  label="Severity"
                  options={severityOptions}
                  value={selectedSeverityId}
                  onChange={value => setSelectedSeverityId(value)}
                  styles={{ theme: styles?.theme || 'light', required: true }}
                />

                {/* Status */}
                <Dropdown
                  label="Status"
                  options={statusOptions}
                  value={selectedStatusId}
                  onChange={value => {
                    setSelectedStatusId(value)
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
                    onChange={value => setSelectedSubStatusId(value)}
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
                    onChange={value => setSelectedRegionId(value)}
                    styles={{ theme: styles?.theme || 'light' }}
                  />
                )}
              </div>

              {/* Topics */}
              {topics.length > 0 && (
                <div className={cssStyles.fieldWrapper}>
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
                  <div className={cssStyles.articleDetailHeader}>
                    <button
                      type="button"
                      onClick={() => setViewingArticle(null)}
                      className={cssStyles.backButton}
                    >
                      <span aria-hidden="true">←</span> Back to Articles
                    </button>
                  </div>

                  <h2 className={cssStyles.articleHeading}>
                    {viewingArticle.articleTitle}
                  </h2>

                  {/* Link/Unlink Button */}
                  <div className={cssStyles.linkActionRow}>
                    {selectedArticleIds.includes(viewingArticle._id) ? (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedArticleIds(prev =>
                            prev.filter(id => id !== viewingArticle._id)
                          )
                        }
                        className={cssStyles.unlinkButton}
                      >
                        <span aria-hidden="true">✓ </span>Linked - Click to
                        Unlink
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedArticleIds(prev => [
                            ...prev,
                            viewingArticle._id,
                          ])
                        }
                        className={cssStyles.linkButton}
                      >
                        Link to This Case
                      </button>
                    )}
                  </div>

                  {viewingArticle.categoryName && (
                    <div className={cssStyles.categoryChip}>
                      {viewingArticle.categoryName}
                    </div>
                  )}

                  {/* Render dynamic fieldValues if present, else fall back to legacy named fields */}
                  {viewingArticle.fieldValues &&
                  Object.keys(viewingArticle.fieldValues).length > 0 ? (
                    Object.entries(viewingArticle.fieldValues).map(
                      ([key, value]) => {
                        if (!value || value.trim() === '') return null
                        const label = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/_/g, ' ')
                          .replace(/^\w/, c => c.toUpperCase())
                          .trim()
                        return (
                          <div key={key} className={cssStyles.articleField}>
                            <div className={cssStyles.sectionTitle}>
                              {label}
                            </div>
                            <div
                              className={cssStyles.articleFieldTextPreWrap}
                              dangerouslySetInnerHTML={{ __html: value }}
                            />
                          </div>
                        )
                      }
                    )
                  ) : (
                    <>
                      {viewingArticle.purpose && (
                        <div className={cssStyles.articleField}>
                          <div className={cssStyles.sectionTitle}>Purpose</div>
                          <p className={cssStyles.articleFieldText}>
                            {viewingArticle.purpose}
                          </p>
                        </div>
                      )}
                      {viewingArticle.symptoms && (
                        <div className={cssStyles.articleField}>
                          <div className={cssStyles.sectionTitle}>Symptoms</div>
                          <p className={cssStyles.articleFieldText}>
                            {viewingArticle.symptoms}
                          </p>
                        </div>
                      )}
                      {viewingArticle.cause && (
                        <div className={cssStyles.articleField}>
                          <div className={cssStyles.sectionTitle}>Cause</div>
                          <p className={cssStyles.articleFieldText}>
                            {viewingArticle.cause}
                          </p>
                        </div>
                      )}
                      {viewingArticle.resolution && (
                        <div className={cssStyles.articleField}>
                          <div className={cssStyles.sectionTitle}>
                            Resolution
                          </div>
                          <p className={cssStyles.articleFieldText}>
                            {viewingArticle.resolution}
                          </p>
                        </div>
                      )}
                      {viewingArticle.workaround && (
                        <div className={cssStyles.articleField}>
                          <div className={cssStyles.sectionTitle}>
                            Workaround
                          </div>
                          <p className={cssStyles.articleFieldText}>
                            {viewingArticle.workaround}
                          </p>
                        </div>
                      )}
                      {viewingArticle.impact && (
                        <div className={cssStyles.articleField}>
                          <div className={cssStyles.sectionTitle}>Impact</div>
                          <p className={cssStyles.articleFieldText}>
                            {viewingArticle.impact}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                /* Article List View */
                <>
                  <h2 className={cssStyles.kbHeading}>
                    Link Knowledgebase Articles
                  </h2>
                  <p className={cssStyles.kbIntro}>
                    Search and select articles to link to this task. Click an
                    article to view details.
                  </p>

                  {/* Search Bar */}
                  <div className={cssStyles.searchWrapper}>
                    <SearchBar
                      label="Search Articles"
                      placeholder="Search by title, symptoms, resolution..."
                      value={articleSearchTerm}
                      onChange={value => setArticleSearchTerm(value)}
                      styles={{
                        theme: styles?.theme || 'light',
                      }}
                    />
                  </div>

                  {/* Selected Articles */}
                  {selectedArticleIds.length > 0 && (
                    <div className={cssStyles.selectedArticlesWrapper}>
                      <div className={cssStyles.sectionTitle}>
                        Selected Articles ({selectedArticleIds.length})
                      </div>
                      <div className={cssStyles.selectedChipRow}>
                        {selectedArticleIds.map(id => {
                          const article = knowledgebaseArticles.find(
                            a => a._id === id
                          )
                          if (!article) return null
                          return (
                            <div key={id} className={cssStyles.selectedChip}>
                              <button
                                type="button"
                                className={cssStyles.selectedChipLabel}
                                onClick={() => setViewingArticle(article)}
                              >
                                {article.articleTitle}
                              </button>
                              <button
                                type="button"
                                aria-label={`Remove ${article.articleTitle}`}
                                onClick={e => {
                                  e.stopPropagation()
                                  setSelectedArticleIds(prev =>
                                    prev.filter(aid => aid !== id)
                                  )
                                }}
                                className={cssStyles.selectedChipRemove}
                              >
                                <span aria-hidden="true">×</span>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Articles Grid */}
                  <div className={cssStyles.sectionTitle}>
                    {articleSearchTerm
                      ? `Search Results (${filteredArticles.length})`
                      : `All Articles (${knowledgebaseArticles.length})`}
                  </div>
                  <div className={cssStyles.articlesGrid}>
                    {filteredArticles.length === 0 ? (
                      <p className={cssStyles.emptyMessage}>
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
                            role="button"
                            tabIndex={0}
                            aria-label={`View article: ${article.articleTitle}${
                              isSelected ? ' (linked)' : ''
                            }`}
                            onClick={() => setViewingArticle(article)}
                            onKeyDown={activateOnKey(() =>
                              setViewingArticle(article)
                            )}
                            className={cssStyles.articleCard}
                            data-selected={isSelected}
                          >
                            <div className={cssStyles.articleCardHeader}>
                              <h3 className={cssStyles.articleCardTitle}>
                                {article.articleTitle}
                              </h3>
                              {isSelected && (
                                <span
                                  className={cssStyles.articleCardCheck}
                                  aria-hidden="true"
                                >
                                  ✓
                                </span>
                              )}
                            </div>
                            {article.categoryName && (
                              <div className={cssStyles.articleCardCategory}>
                                {article.categoryName}
                              </div>
                            )}
                            {article.purpose && (
                              <p className={cssStyles.articleCardPurpose}>
                                {article.purpose}
                              </p>
                            )}
                            {article.symptoms && (
                              <p className={cssStyles.articleCardSymptoms}>
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

          {/* Validation Error — role="alert" so the missing-field summary is
              announced the moment it appears, without moving focus (WCAG
              4.1.3). */}
          {validationError && (
            <div className={cssStyles.validationError} role="alert">
              {validationError}
            </div>
          )}

          {/* Action Buttons */}
          <div className={cssStyles.actionButtons}>
            <button
              type="button"
              onClick={handleSubmit}
              className={cx(cssStyles.button, cssStyles.submitButton)}
            >
              Create Task
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className={cx(cssStyles.button, cssStyles.cancelButton)}
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
