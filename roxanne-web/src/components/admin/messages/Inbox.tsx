'use client'

import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Inbox as InboxIcon,
  Mail,
  MailOpen,
  Reply,
  Search,
  SearchX,
  Trash,
  X,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useOptimistic, useRef, useState, useTransition } from 'react'
import { WhatsAppIcon } from '@/components/icons/brand'
import type { ContactMessage, MessageStatus } from '@/content/types'
import { removeMessage, updateMessageStatus } from '@/lib/admin/actions/messages'
import { formatDate } from '@/lib/admin/format'
import { findPhoneNumber, whatsappLink } from '@/lib/admin/phone'
import { UNEXPECTED_ERROR, type ActionResult } from '@/lib/admin/types'
import { cn } from '@/lib/cn'
import { useConfirm } from '../ui/Confirm'
import { CopyButton } from '../ui/CopyButton'
import { LocalTime, RelativeTime } from '../ui/LocalTime'
import { AdminButton, Badge, Card, EmptyState, inputStyles } from '../ui/primitives'
import { useToast } from '../ui/Toast'

type Filter = 'all' | MessageStatus

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New' },
  { id: 'read', label: 'Read' },
  { id: 'replied', label: 'Replied' },
  { id: 'archived', label: 'Archived' },
]

const SOURCES: Record<ContactMessage['source'], string> = {
  'contact-page': 'the Contact page',
  'freelance-page': 'the Freelance page',
  popup: 'the consultation popup',
}

const STATUS_BADGE: Record<MessageStatus, { label: string; tone: 'clay' | 'muted' | 'sage' | 'ink' }> = {
  new: { label: 'New', tone: 'clay' },
  read: { label: 'Read', tone: 'muted' },
  replied: { label: 'Replied', tone: 'sage' },
  archived: { label: 'Archived', tone: 'muted' },
}

function parseFilter(value: string | null): Filter {
  return FILTERS.some((filter) => filter.id === value) ? (value as Filter) : 'all'
}

function matchesFilter(message: ContactMessage, filter: Filter) {
  // "All" is the inbox: everything except archived messages.
  return filter === 'all' ? message.status !== 'archived' : message.status === filter
}

function matchesQuery(message: ContactMessage, query: string) {
  if (!query) return true
  const haystack = `${message.name}\n${message.email}\n${message.topic}\n${message.message}`.toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word))
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '')).toUpperCase() || '?'
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? ''
}

function replyMailto(message: ContactMessage) {
  const subject = message.topic ? `Re: your enquiry — ${message.topic}` : 'Re: your enquiry'
  const original = message.message.length > 1500 ? `${message.message.slice(0, 1500)} […]` : message.message
  const quoted = original
    .split(/\r?\n/)
    .map((line) => `> ${line}`)
    .join('\n')
  const body = `Dear ${firstName(message.name)},\n\n\n\n—\nOn ${formatDate(message.createdAt, 'date', 'UTC')}, ${message.name} wrote:\n${quoted}\n`
  return `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

type Change = { id: string; status: MessageStatus } | { id: string; deleted: true }

/** Updates the address bar (integrates with Next's router) without a server round trip. */
function setUrl(params: URLSearchParams, mode: 'push' | 'replace') {
  const search = params.toString()
  const url = `${window.location.pathname}${search ? `?${search}` : ''}`
  if (mode === 'push') window.history.pushState(null, '', url)
  else window.history.replaceState(null, '', url)
}

export function Inbox({ messages, initialQuery }: { messages: ContactMessage[]; initialQuery: string }) {
  const searchParams = useSearchParams()
  const filter = parseFilter(searchParams.get('status'))
  const selectedId = searchParams.get('id')
  const [query, setQuery] = useState(initialQuery)
  const [, startTransition] = useTransition()
  const toast = useToast()
  const confirm = useConfirm()
  const markedAsRead = useRef(new Set<string>())
  const pushedDetail = useRef(false)

  const [items, applyChange] = useOptimistic(messages, (list, change: Change) =>
    'deleted' in change
      ? list.filter((message) => message.id !== change.id)
      : list.map((message) => (message.id === change.id ? { ...message, status: change.status } : message)),
  )

  const counts = useMemo(() => {
    const result: Record<Filter, number> = { all: 0, new: 0, read: 0, replied: 0, archived: 0 }
    for (const message of items) {
      result[message.status] += 1
      if (message.status !== 'archived') result.all += 1
    }
    return result
  }, [items])

  const visible = useMemo(
    () => items.filter((message) => matchesFilter(message, filter) && matchesQuery(message, query.trim())),
    [items, filter, query],
  )
  const selected = selectedId ? items.find((message) => message.id === selectedId) : undefined

  const run = (change: Change, action: () => Promise<ActionResult>, success?: string) => {
    startTransition(async () => {
      applyChange(change)
      try {
        const result = await action()
        if (!result.ok) toast.error(result.error)
        else if (success) toast.success(success)
      } catch {
        toast.error(UNEXPECTED_ERROR)
      }
    })
  }

  const setStatus = (message: ContactMessage, status: MessageStatus, success?: string) =>
    run({ id: message.id, status }, () => updateMessageStatus(message.id, status), success)

  // Opening a new message (click or link from the overview) marks it as read.
  useEffect(() => {
    if (!selected || selected.status !== 'new' || markedAsRead.current.has(selected.id)) return
    markedAsRead.current.add(selected.id)
    const id = selected.id
    startTransition(async () => {
      try {
        await updateMessageStatus(id, 'read')
      } catch {
        // Not important enough to interrupt reading — it stays "new".
      }
    })
  }, [selected])

  const updateParams = (patch: Record<string, string | null>, mode: 'push' | 'replace' = 'replace') => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(patch)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    setUrl(params, mode)
  }

  const open = (message: ContactMessage) => {
    if (message.id === selectedId) return
    if (message.status === 'new') {
      markedAsRead.current.add(message.id)
      setStatus(message, 'read')
    }
    // Push a history entry for the reading view, so the phone's back button returns to the list.
    pushedDetail.current = !selectedId
    updateParams({ id: message.id }, selectedId ? 'replace' : 'push')
  }

  const close = () => {
    if (pushedDetail.current) {
      pushedDetail.current = false
      window.history.back()
    } else {
      updateParams({ id: null })
    }
  }

  const changeFilter = (next: Filter) => updateParams({ status: next === 'all' ? null : next, id: null })

  const changeQuery = (value: string) => {
    setQuery(value)
    updateParams({ q: value.trim() || null })
  }

  const remove = async (message: ContactMessage) => {
    const ok = await confirm({
      title: 'Delete this message?',
      body: (
        <>
          The message from <strong className="text-ink">{message.name}</strong> will be deleted for good. You can’t undo
          this. (To keep it but hide it from your inbox, use Archive instead.)
        </>
      ),
      confirmLabel: 'Delete message',
      tone: 'danger',
    })
    if (!ok) return
    close()
    run({ id: message.id, deleted: true }, () => removeMessage(message.id), 'Message deleted.')
  }

  if (messages.length === 0) {
    return (
      <Card>
        <EmptyState icon={<InboxIcon />} title="No messages yet">
          When someone fills in the contact form on your website, their message appears here — and you’ll see a badge next to
          “Messages” in the menu.
        </EmptyState>
      </Card>
    )
  }

  const listPane = (
    <Card as="div" className={cn('flex min-h-0 flex-col overflow-hidden', selected && 'hidden lg:flex')}>
      <div className="space-y-3 border-b border-line p-3 sm:p-4">
        <div className="relative">
          <label htmlFor="message-search" className="sr-only">
            Search messages
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-soft" aria-hidden />
          <input
            id="message-search"
            type="search"
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
            placeholder="Search by name, email or text"
            className={cn(inputStyles, 'h-11 pr-10 pl-10 [&::-webkit-search-cancel-button]:hidden')}
          />
          {query && (
            <button
              type="button"
              onClick={() => changeQuery('')}
              className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-ink-soft hover:bg-ink/[0.05] hover:text-ink"
              aria-label="Clear search"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
        <div role="group" aria-label="Show messages" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-0.5">
          {FILTERS.map((item) => {
            const active = filter === item.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => changeFilter(item.id)}
                className={cn(
                  'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] font-semibold transition-colors',
                  active ? 'bg-ink text-ivory' : 'text-ink-soft hover:bg-ink/[0.05] hover:text-ink',
                )}
              >
                {item.label}
                <span className={cn('text-xs tabular-nums', active ? 'text-ivory/70' : 'text-ink-soft/70')}>{counts[item.id]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<SearchX />}
          title={query ? 'No matching messages' : 'Nothing here'}
          action={
            (query || filter !== 'all') && (
              <AdminButton
                size="sm"
                onClick={() => {
                  setQuery('')
                  updateParams({ q: null, status: null })
                }}
              >
                Show all messages
              </AdminButton>
            )
          }
        >
          {query ? `No message contains “${query.trim()}”.` : 'No messages in this list right now.'}
        </EmptyState>
      ) : (
        <ul className="min-h-0 flex-1 divide-y divide-line overflow-y-auto lg:max-h-[calc(100dvh-19rem)]" aria-label="Messages">
          {visible.map((message) => {
            const isNew = message.status === 'new'
            const active = message.id === selectedId
            return (
              <li key={message.id}>
                <button
                  type="button"
                  onClick={() => open(message)}
                  aria-current={active ? 'true' : undefined}
                  className={cn(
                    'flex w-full gap-3 px-4 py-3.5 text-left transition-colors',
                    active ? 'bg-cream/80' : 'hover:bg-ivory',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold',
                      isNew ? 'bg-clay text-white' : 'bg-cream text-ink-soft',
                    )}
                    aria-hidden
                  >
                    {initials(message.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className={cn('truncate', isNew ? 'font-bold text-ink' : 'font-semibold text-ink')}>
                        {message.name}
                      </span>
                      <RelativeTime iso={message.createdAt} className="shrink-0 text-xs text-ink-soft" />
                    </span>
                    <span className="mt-0.5 flex items-center gap-2">
                      <span className={cn('truncate text-[0.8125rem]', isNew ? 'font-semibold text-clay' : 'text-ink-soft')}>
                        {message.topic || 'No topic'}
                      </span>
                      {message.status !== 'read' && (
                        <Badge tone={STATUS_BADGE[message.status].tone} className="ml-auto">
                          {STATUS_BADGE[message.status].label}
                        </Badge>
                      )}
                    </span>
                    <span className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-soft">{message.message}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      {listPane}
      {selected ? (
        <MessageDetail
          key={selected.id}
          message={selected}
          onBack={close}
          onStatus={(status, success) => setStatus(selected, status, success)}
          onArchive={() => {
            setStatus(selected, 'archived', 'Archived — you’ll find it under “Archived”.')
            if (filter !== 'archived') close()
          }}
          onDelete={() => remove(selected)}
        />
      ) : (
        <Card as="div" className="hidden place-items-center p-10 text-center lg:grid">
          <div>
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-cream text-clay" aria-hidden>
              <MailOpen className="size-6" />
            </span>
            <p className="mt-4 font-display text-2xl text-ink">Choose a message to read it</p>
            <p className="mt-1 text-sm text-ink-soft">
              {counts.new > 0 ? `You have ${counts.new} new ${counts.new === 1 ? 'message' : 'messages'}.` : 'You’re all caught up.'}
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

function MessageDetail({
  message,
  onBack,
  onStatus,
  onArchive,
  onDelete,
}: {
  message: ContactMessage
  onBack: () => void
  onStatus: (status: MessageStatus, success?: string) => void
  onArchive: () => void
  onDelete: () => void
}) {
  const phone = findPhoneNumber(message.message)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const articleRef = useRef<HTMLDivElement>(null)

  // On phones the list is hidden while reading: bring the message to the top and move focus to it.
  useEffect(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) return
    articleRef.current?.scrollIntoView({ block: 'start' })
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <Card as="article" ref={articleRef} className="min-w-0 scroll-mt-20 overflow-hidden" aria-labelledby="message-heading">
      <div className="border-b border-line p-5 sm:p-7">
        <button
          type="button"
          onClick={onBack}
          className="-ml-2 mb-4 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-semibold text-ink-soft hover:text-ink lg:hidden"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All messages
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={STATUS_BADGE[message.status].tone}>{STATUS_BADGE[message.status].label}</Badge>
          {message.topic && <Badge tone="warm">{message.topic}</Badge>}
        </div>
        <h2
          id="message-heading"
          ref={headingRef}
          tabIndex={-1}
          className="mt-3 font-display text-[2rem] leading-tight text-ink outline-none"
        >
          {message.name}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <a href={`mailto:${message.email}`} className="font-semibold break-all text-clay underline-offset-4 hover:underline">
            {message.email}
          </a>
          <CopyButton text={message.email} label="Copy email address" copiedMessage="Email address copied." variant="ghost" size="icon" />
        </div>
        <p className="mt-1 text-[0.8125rem] text-ink-soft">
          Received <LocalTime iso={message.createdAt} format="datetime" /> from {SOURCES[message.source] ?? 'your website'}
        </p>
      </div>

      <div className="p-5 sm:p-7">
        <div className="rounded-2xl bg-ivory p-5 text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-ink [overflow-wrap:anywhere] sm:p-6">
          {message.message}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href={replyMailto(message)}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-clay px-5 text-[0.9375rem] font-semibold text-white shadow-[0_10px_24px_-14px_rgb(165_83_58/0.9)] transition hover:bg-clay-dark"
          >
            <Reply className="size-4" aria-hidden />
            Reply by email
          </a>
          {phone && (
            <a
              href={whatsappLink(phone.digits, `Dear ${firstName(message.name)}, thank you for your message on my website.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-[0.9375rem] font-semibold text-ink transition hover:border-ink/25"
            >
              <WhatsAppIcon className="size-4 text-[#1f9e57]" />
              Reply on WhatsApp
              <span className="sr-only">({phone.display}, opens in a new tab)</span>
            </a>
          )}
        </div>
        {phone && <p className="mt-2 text-[0.8125rem] text-ink-soft">Phone number found in the message: {phone.display}</p>}

        <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
          {message.status !== 'replied' && message.status !== 'archived' && (
            <AdminButton size="sm" onClick={() => onStatus('replied', 'Marked as replied.')}>
              <Reply aria-hidden />
              Mark as replied
            </AdminButton>
          )}
          {message.status !== 'new' && message.status !== 'archived' && (
            <AdminButton size="sm" onClick={() => onStatus('new', 'Marked as unread.')}>
              <Mail aria-hidden />
              Mark as unread
            </AdminButton>
          )}
          {message.status === 'new' && (
            <AdminButton size="sm" onClick={() => onStatus('read', 'Marked as read.')}>
              <MailOpen aria-hidden />
              Mark as read
            </AdminButton>
          )}
          {message.status === 'archived' ? (
            <AdminButton size="sm" onClick={() => onStatus('read', 'Moved back to your inbox.')}>
              <ArchiveRestore aria-hidden />
              Move back to inbox
            </AdminButton>
          ) : (
            <AdminButton size="sm" onClick={onArchive}>
              <Archive aria-hidden />
              Archive
            </AdminButton>
          )}
          <AdminButton size="sm" variant="danger" onClick={onDelete} className="sm:ml-auto">
            <Trash aria-hidden />
            Delete
          </AdminButton>
        </div>
      </div>
    </Card>
  )
}
