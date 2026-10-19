import React, { useMemo, useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs'
import ProjectBoard from './index'
import {
  InlineShowTask,
  type InlineShowTaskProps,
} from './forms/ShowTask/inline'
import type { Comment, Task } from './types'

/** W-2058 / ThothOS W-1957: the transport is controlled; both UI components are real. */
export function ReplyDraftHarness({ board = false }: { board?: boolean }) {
  const [comments, setComments] = useState<Comment[]>([
    {
      _id: 'comment-1',
      text: 'Saved original reply',
      createdBy: 'Casey Customer',
      createdAt: new Date('2026-10-13T10:00:00Z'),
      editHistory: [],
    },
  ])
  const [calls, setCalls] = useState<string[][]>([])
  const [sync, setSync] = useState(false)
  const pending = useRef<
    Array<{ resolve: () => void; reject: (error: Error) => void }>
  >([])
  function write(args: string[], commit: () => void): Promise<void> | void {
    setCalls(previous => [...previous, args])
    if (sync) {
      commit()
      return
    }
    const promise = new Promise<void>((resolve, reject) => {
      pending.current.push({
        resolve: () => {
          commit()
          resolve()
        },
        reject,
      })
    })
    // Observe the controlled transport even on the deliberately broken baseline;
    // this does not change the promise returned to the real component.
    void promise.catch(() => {})
    return promise
  }
  const onComment = (text: string, taskId: string) =>
    write([text, taskId], () => {
      setComments(previous => [
        ...previous,
        {
          _id: 'reply-' + previous.length,
          text,
          createdBy: 'Casey Customer',
          createdAt: new Date(),
          editHistory: [],
        },
      ])
    })
  const onEditComment = (id: string, text: string) =>
    write([id, text], () => {
      setComments(previous =>
        previous.map(comment =>
          comment._id === id ? { ...comment, text } : comment
        )
      )
    })
  const props: InlineShowTaskProps = {
    taskId: 'ticket-1',
    taskTitle: 'Reply regression ticket',
    createdBy: 'Casey Customer',
    description: 'Save completion controls',
    comments,
    caseUpdates: [],
    customerAssigned: 'Casey Customer',
    severity: 'Normal',
    schedulingQueue: '',
    region: '',
    status: 'Open',
    subStatus: 'New',
    topics: [],
    knowledgebaseArticles: [],
    teamMemberAssigned: '',
    nextActionDate: '',
    currentUserName: 'Casey Customer',
    productOrService: 'service',
    productServiceName: '',
    productId: '',
    serviceId: '',
    taskAccess: 'write',
    onEdit: () => {},
    onComment,
    onEditComment,
    onBack: () => {},
    severityOptions: [],
    schedulingQueueOptions: [],
    regionOptions: [],
    statusOptions: [],
    subStatusOptions: [],
    topicOptions: [],
    knowledgebaseArticleOptions: [],
    teamMemberOptions: [],
    rawServices: [],
    styles: { theme: 'light' },
    meetings: [],
    currentDate: new Date('2026-10-13T12:00:00Z'),
    variant: 'customer',
  }
  const tasks = useMemo<Task[]>(
    () => [
      {
        _id: 'ticket-1',
        companyId: 'company-1',
        title: 'Reply regression ticket',
        description: 'Save completion controls',
        severityId: '',
        statusId: 'open',
        substatusId: '',
        schedulingQueueId: '',
        topicIds: [],
        commentIds: [],
        employeeIds: [],
        articleIds: [],
        customerId: 'customer-1',
        createdAt: new Date(),
        closedAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'Casey Customer',
        editHistory: [],
        caseUpdates: [],
        comments,
        customerAssigned: 'Casey Customer',
        severity: 'Normal',
        schedulingQueue: '',
        regionId: '',
        region: '',
        status: 'Open',
        subStatus: 'New',
        topicLabels: [],
        kbArticles: [],
        teamMember: '',
        nextActionDate: '',
        productOrService: 'service',
        productServiceName: '',
        productId: '',
        serviceId: '',
      },
    ],
    [comments]
  )
  const columns = useMemo(
    () => [{ _id: 'open', title: 'Open', description: '' }],
    []
  )
  return (
    <>
      <div aria-label="Controlled save transport">
        <button onClick={() => pending.current.shift()?.resolve()}>
          Resolve write
        </button>
        <button
          onClick={() =>
            pending.current.shift()?.reject(new Error('Save rejected'))
          }
        >
          Reject write
        </button>
        <button
          onClick={() => {
            const error = new Error('Save interrupted')
            error.name = 'AbortError'
            pending.current.shift()?.reject(error)
          }}
        >
          Abort write
        </button>
        <button onClick={() => setSync(true)}>Use synchronous writer</button>
        <pre data-testid="write-calls">{JSON.stringify(calls)}</pre>
      </div>
      {board ? (
        <ProjectBoard
          variant="customer"
          boardType="status"
          columns={columns}
          tasks={tasks}
          rawStatuses={[]}
          rawSubStatuses={[]}
          rawTopics={[]}
          rawQueues={[]}
          rawArticles={[]}
          rawEmployees={[]}
          rawServices={[]}
          rawRegions={[]}
          rawSeverityLevels={[]}
          onEdit={() => {}}
          onAdd={() => {}}
          onComment={onComment}
          onEditComment={onEditComment}
          currentUser={{
            _id: 'user-1',
            firstName: 'Casey',
            lastName: 'Customer',
          }}
          companyId="company-1"
          customerId="customer-1"
          preferDropdown={false}
          styles={{ theme: 'light' }}
          permissions={{ access: 'write' }}
          meetings={[]}
          currentDate={props.currentDate}
        />
      ) : (
        <InlineShowTask {...props} />
      )}
    </>
  )
}

const meta = {
  title: 'ProjectBoard/Reply drafts',
  component: ReplyDraftHarness,
} satisfies Meta<typeof ReplyDraftHarness>
export default meta
type Story = StoryObj<typeof meta>
/** The reply draft survives a pending, rejected or aborted write in the InlineShowTask detail view. */
export const Detail: Story = { args: { board: false } }
/** The same draft-preservation contract through the ProjectBoard, which forwards the write's completion. */
export const Board: Story = { args: { board: true } }
