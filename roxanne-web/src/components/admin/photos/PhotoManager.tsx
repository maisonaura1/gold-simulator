'use client'

import { ImagePlus, Images, Link2, RotateCcw, Trash, TriangleAlert, Upload } from 'lucide-react'
import { useEffect, useId, useRef, useState, useTransition } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Photo } from '@/components/ui/Photo'
import type { ResolvedPhoto } from '@/content/photos'
import type { PhotoKey } from '@/content/types'
import { assignLibraryPhoto, deleteLibraryPhoto, restoreDefaultPhoto, uploadPhoto } from '@/lib/admin/actions/photos'
import { formatBytes } from '@/lib/admin/format'
import { fetchImageFromLink, prepareImage, type PreparedImage } from '@/lib/admin/image-client'
import { UNEXPECTED_ERROR, type ActionResult } from '@/lib/admin/types'
import { cn } from '@/lib/cn'
import { useConfirm } from '../ui/Confirm'
import { LocalTime } from '../ui/LocalTime'
import { AdminButton, Badge, Callout, Card, CardHeader, EmptyState, FieldError, FieldHint, FieldLabel, Spinner, inputStyles } from '../ui/primitives'
import { useToast } from '../ui/Toast'

export interface SlotView {
  key: PhotoKey
  label: string
  hint: string
  photo: ResolvedPhoto
}

export interface MediaView {
  id: string
  path: string
  width: number
  height: number
  bytes: number
  createdAt: string
  label: string
  usedBy: string[]
}

type Stage =
  | { name: 'link'; error?: string }
  | { name: 'processing'; message: string }
  | { name: 'preview'; image: PreparedImage; url: string; label: string }
  | { name: 'error'; message: string }

interface Active {
  slot: SlotView
  mode: 'file' | 'link'
}

function fileLabel(name: string) {
  return name.replace(/\.[a-z0-9]+$/i, '').slice(0, 100)
}

/* ───────────────────────────── Slot card ───────────────────────────── */

function SlotCard({
  slot,
  featured = false,
  onFile,
  onLink,
  onRestore,
  restoring,
}: {
  slot: SlotView
  featured?: boolean
  onFile: (slot: SlotView, file: File) => void
  onLink: (slot: SlotView) => void
  onRestore: (slot: SlotView) => void
  restoring: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const custom = slot.photo.custom

  return (
    <Card
      as="article"
      id={slot.key}
      aria-labelledby={`${inputId}-title`}
      className={cn('flex scroll-mt-24 flex-col overflow-hidden', featured && 'md:flex-row')}
    >
      <div className={cn('relative shrink-0 bg-cream', featured ? 'aspect-square md:aspect-[4/5] md:w-72 lg:w-80' : 'aspect-[4/3]')}>
        {/* Photo's own wrapper is `relative`, so it fills a positioned box instead of taking `absolute`. */}
        <div className="absolute inset-0">
          <Photo
            key={slot.photo.src}
            photo={slot.photo}
            sizes={featured ? '(min-width: 768px) 20rem, 100vw' : '(min-width: 1280px) 24rem, (min-width: 640px) 50vw, 100vw'}
            className="size-full"
          />
        </div>
        <span className="absolute top-3 left-3">
          {custom ? <Badge tone="ink">Your photo</Badge> : <Badge className="bg-white/90 text-ink-soft">Sample photo</Badge>}
        </span>
      </div>

      <div className={cn('flex flex-1 flex-col p-5', featured && 'md:p-8')}>
        <h2 id={`${inputId}-title`} className={cn('font-display leading-tight text-ink', featured ? 'text-[2rem]' : 'text-[1.5rem]')}>
          {slot.label}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{slot.hint}</p>

        {featured && !custom && (
          <Callout tone="draft" className="mt-5" title="Add your portrait — visitors want to see who they’ll learn with.">
            A friendly, well-lit photo of you builds trust instantly. Until then, a calm reading-corner picture is shown.
          </Callout>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif"
            className="sr-only"
            tabIndex={-1}
            onChange={(event) => {
              const file = event.target.files?.[0]
              event.target.value = ''
              if (file) onFile(slot, file)
            }}
          />
          <AdminButton size="sm" variant="primary" onClick={() => inputRef.current?.click()}>
            <Upload aria-hidden />
            {custom ? 'Replace photo' : featured ? 'Upload your portrait' : 'Upload photo'}
            <span className="sr-only"> for {slot.label}</span>
          </AdminButton>
          <AdminButton size="sm" variant="secondary" onClick={() => onLink(slot)}>
            <Link2 aria-hidden />
            Use an image link
            <span className="sr-only"> for {slot.label}</span>
          </AdminButton>
          {custom && (
            <AdminButton size="sm" variant="ghost" onClick={() => onRestore(slot)} pending={restoring}>
              {!restoring && <RotateCcw aria-hidden />}
              Restore sample
              <span className="sr-only"> photo for {slot.label}</span>
            </AdminButton>
          )}
        </div>
      </div>
    </Card>
  )
}

/* ───────────────────────────── Dialog ──────────────────────────────── */

function PhotoDialog({
  active,
  stage,
  uploading,
  onClose,
  onFetchLink,
  onChooseFile,
  onUpload,
}: {
  active: Active | null
  stage: Stage | null
  uploading: boolean
  onClose: () => void
  onFetchLink: (link: string) => void
  onChooseFile: (file: File) => void
  onUpload: () => void
}) {
  const titleId = useId()
  const [link, setLink] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const slot = active?.slot

  return (
    <Modal open={Boolean(active)} onClose={onClose} labelledBy={titleId} size="lg">
      <div className="p-6 sm:p-9">
        <p className="pr-12 text-xs font-bold tracking-[0.2em] text-clay uppercase">{slot?.label}</p>
        <h2 id={titleId} className="mt-2 pr-12 font-display text-[2rem] leading-tight text-ink">
          {stage?.name === 'preview' ? 'Does this look right?' : active?.mode === 'link' ? 'Use an image link' : 'Upload a photo'}
        </h2>

        {stage?.name === 'link' && (
          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              onFetchLink(link.trim())
            }}
          >
            <p className="text-sm leading-relaxed text-ink-soft">
              Paste the address of a picture from the web (for example from your LinkedIn profile or a photo website). A
              copy is saved on your website so it always loads quickly.
            </p>
            <div>
              <FieldLabel htmlFor="photo-link">Image address</FieldLabel>
              <input
                id="photo-link"
                type="url"
                inputMode="url"
                value={link}
                onChange={(event) => setLink(event.target.value)}
                placeholder="https://…"
                className={cn(inputStyles, 'mt-1.5')}
                aria-invalid={stage.error ? true : undefined}
                aria-describedby={stage.error ? 'photo-link-error' : 'photo-link-hint'}
                autoComplete="off"
                required
              />
              {stage.error ? (
                <FieldError id="photo-link-error">{stage.error}</FieldError>
              ) : (
                <FieldHint id="photo-link-hint">
                  Tip: right-click the picture and choose “Copy image address”. Only use photos you have the right to use.
                </FieldHint>
              )}
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <AdminButton variant="secondary" onClick={onClose}>
                Cancel
              </AdminButton>
              <AdminButton type="submit" variant="primary" disabled={!/^https:\/\/\S+$/i.test(link.trim())}>
                Get the image
              </AdminButton>
            </div>
          </form>
        )}

        {stage?.name === 'processing' && (
          <div className="mt-8 flex flex-col items-center gap-3 py-10 text-center" role="status">
            <Spinner className="size-8" />
            <p className="text-sm text-ink-soft">{stage.message}</p>
          </div>
        )}

        {stage?.name === 'error' && (
          <div className="mt-6 space-y-5">
            <Callout tone="warning" title="That didn’t work" role="alert">
              {stage.message}
            </Callout>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <AdminButton variant="secondary" onClick={onClose}>
                Close
              </AdminButton>
              <AdminButton variant="primary" onClick={() => fileRef.current?.click()}>
                <Upload aria-hidden />
                Choose a photo from this device
              </AdminButton>
            </div>
          </div>
        )}

        {stage?.name === 'preview' && (
          <div className="mt-5">
            <div className="grid place-items-center overflow-hidden rounded-2xl bg-cream p-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- local preview of a blob: URL */}
              <img src={stage.url} alt="Preview of the new photo" className="max-h-[48dvh] w-auto rounded-xl object-contain" />
            </div>
            <p className="mt-3 text-center text-[0.8125rem] text-ink-soft">
              {stage.image.width} × {stage.image.height} px · {formatBytes(stage.image.blob.size)} ·{' '}
              {stage.image.type === 'image/webp' ? 'WebP' : 'JPEG'} — resized for fast loading
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <AdminButton variant="secondary" onClick={() => fileRef.current?.click()} disabled={uploading}>
                <ImagePlus aria-hidden />
                Choose another
              </AdminButton>
              <AdminButton variant="primary" onClick={onUpload} pending={uploading}>
                {uploading ? 'Saving…' : 'Use this photo'}
              </AdminButton>
            </div>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            if (file) onChooseFile(file)
          }}
        />
      </div>
    </Modal>
  )
}

/* ─────────────────────────── Media library ─────────────────────────── */

function MediaLibrary({ media, slots }: { media: MediaView[]; slots: SlotView[] }) {
  const toast = useToast()
  const confirm = useConfirm()
  const [busy, setBusy] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const [targets, setTargets] = useState<Record<string, PhotoKey | ''>>({})

  const run = (id: string, action: () => Promise<ActionResult>, success: string) => {
    setBusy(id)
    startTransition(async () => {
      try {
        const result = await action()
        if (result.ok) toast.success(success)
        else toast.error(result.error)
      } catch {
        toast.error(UNEXPECTED_ERROR)
      } finally {
        setBusy(null)
      }
    })
  }

  if (media.length === 0) {
    return (
      <EmptyState icon={<Images />} title="No uploads yet" className="py-10">
        Photos you upload are kept here, so you can reuse them or delete the ones you no longer need.
      </EmptyState>
    )
  }

  return (
    <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {media.map((item) => {
        const target = targets[item.id] ?? ''
        return (
          <li key={item.id} className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="relative aspect-[4/3] bg-cream">
              {/* eslint-disable-next-line @next/next/no-img-element -- uploads are already resized */}
              <img src={item.path} alt={item.label || 'Uploaded photo'} loading="lazy" className="absolute inset-0 size-full object-cover" />
            </div>
            <div className="space-y-3 p-4">
              <div>
                <p className="truncate text-sm font-semibold text-ink" title={item.label}>
                  {item.label || 'Photo'}
                </p>
                <p className="text-xs text-ink-soft">
                  {item.width > 0 && `${item.width} × ${item.height} px · `}
                  {formatBytes(item.bytes)} · <LocalTime iso={item.createdAt} format="date" />
                </p>
              </div>
              {item.usedBy.length > 0 ? (
                <p className="flex flex-wrap gap-1.5">
                  {item.usedBy.map((label) => (
                    <Badge key={label} tone="sage">
                      In use: {label}
                    </Badge>
                  ))}
                </p>
              ) : (
                <p className="text-xs text-ink-soft">Not used on your website.</p>
              )}
              <div className="flex items-center gap-2">
                <label htmlFor={`use-${item.id}`} className="sr-only">
                  Use this photo for
                </label>
                <select
                  id={`use-${item.id}`}
                  value={target}
                  onChange={(event) => setTargets((current) => ({ ...current, [item.id]: event.target.value as PhotoKey | '' }))}
                  className="h-9 min-w-0 flex-1 rounded-full border border-line bg-white pr-8 pl-3.5 text-sm text-ink transition hover:border-ink/20 focus:border-clay focus:ring-4 focus:ring-clay/12 focus:outline-none"
                >
                  <option value="">Use for…</option>
                  {slots.map((slot) => (
                    <option key={slot.key} value={slot.key}>
                      {slot.label}
                    </option>
                  ))}
                </select>
                <AdminButton
                  size="sm"
                  variant="secondary"
                  disabled={!target || busy === item.id}
                  onClick={() => {
                    if (!target) return
                    const label = slots.find((slot) => slot.key === target)?.label ?? 'this spot'
                    run(item.id, () => assignLibraryPhoto(target, item.id), `Now used for ${label}.`)
                    setTargets((current) => ({ ...current, [item.id]: '' }))
                  }}
                >
                  Use
                </AdminButton>
                {item.usedBy.length === 0 && (
                  <AdminButton
                    size="icon"
                    variant="ghost"
                    className="hover:bg-blush hover:text-clay-dark"
                    aria-label={`Delete ${item.label || 'photo'}`}
                    pending={busy === item.id}
                    onClick={async () => {
                      const ok = await confirm({
                        title: 'Delete this photo?',
                        body: 'It isn’t used on your website. It will be deleted for good.',
                        confirmLabel: 'Delete photo',
                        tone: 'danger',
                      })
                      if (ok) run(item.id, () => deleteLibraryPhoto(item.id), 'Photo deleted.')
                    }}
                  >
                    {busy !== item.id && <Trash aria-hidden />}
                  </AdminButton>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/* ───────────────────────────── Manager ─────────────────────────────── */

export function PhotoManager({ slots, media }: { slots: SlotView[]; media: MediaView[] }) {
  const toast = useToast()
  const confirm = useConfirm()
  const [active, setActive] = useState<Active | null>(null)
  const [stage, setStage] = useState<Stage | null>(null)
  const [uploading, startUpload] = useTransition()
  const [restoring, setRestoring] = useState<PhotoKey | null>(null)
  const [, startRestore] = useTransition()
  const request = useRef(0)
  const previewUrls = useRef(new Set<string>())

  const releasePreview = () => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url))
    previewUrls.current.clear()
  }

  useEffect(() => {
    const urls = previewUrls.current
    return () => urls.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  const prepare = async (load: () => Promise<Blob>, label: string, message: string) => {
    const ticket = ++request.current
    releasePreview()
    setStage({ name: 'processing', message })
    try {
      const blob = await load()
      const image = await prepareImage(blob)
      if (ticket !== request.current) return
      const url = URL.createObjectURL(image.blob)
      previewUrls.current.add(url)
      setStage({ name: 'preview', image, url, label })
    } catch (err) {
      if (ticket !== request.current) return
      setStage({ name: 'error', message: err instanceof Error ? err.message : UNEXPECTED_ERROR })
    }
  }

  const onFile = (slot: SlotView, file: File) => {
    setActive({ slot, mode: 'file' })
    void prepare(async () => file, fileLabel(file.name), 'Preparing your photo…')
  }

  const onLink = (slot: SlotView) => {
    request.current += 1
    releasePreview()
    setActive({ slot, mode: 'link' })
    setStage({ name: 'link' })
  }

  const onFetchLink = async (link: string) => {
    const ticket = ++request.current
    setStage({ name: 'processing', message: 'Downloading the image…' })
    try {
      const blob = await fetchImageFromLink(link)
      if (ticket !== request.current) return
      void prepare(async () => blob, new URL(link).pathname.split('/').pop()?.replace(/\.[a-z0-9]+$/i, '') || 'Image from a link', 'Preparing your photo…')
    } catch (err) {
      if (ticket !== request.current) return
      setStage({ name: 'link', error: err instanceof Error ? err.message : UNEXPECTED_ERROR })
    }
  }

  const close = () => {
    request.current += 1
    setActive(null)
  }

  const upload = () => {
    if (!active || stage?.name !== 'preview') return
    const { slot } = active
    const { image, label } = stage
    startUpload(async () => {
      try {
        const data = new FormData()
        data.set('file', new File([image.blob], `${slot.key}.${image.type === 'image/webp' ? 'webp' : 'jpg'}`, { type: image.type }))
        data.set('slot', slot.key)
        data.set('width', String(image.width))
        data.set('height', String(image.height))
        data.set('label', label || slot.label)
        const result = await uploadPhoto(data)
        if (!result.ok) {
          setStage({ name: 'error', message: result.error })
          return
        }
        close()
        toast.success(`${slot.label}: your new photo is on your website.`)
      } catch {
        setStage({ name: 'error', message: UNEXPECTED_ERROR })
      }
    })
  }

  const restore = async (slot: SlotView) => {
    const ok = await confirm({
      title: 'Go back to the sample photo?',
      body: `The sample picture will be shown again for “${slot.label}”. Your photo stays in your library below.`,
      confirmLabel: 'Restore sample',
    })
    if (!ok) return
    setRestoring(slot.key)
    startRestore(async () => {
      try {
        const result = await restoreDefaultPhoto(slot.key)
        if (result.ok) toast.success(`${slot.label}: the sample photo is back.`)
        else toast.error(result.error)
      } catch {
        toast.error(UNEXPECTED_ERROR)
      } finally {
        setRestoring(null)
      }
    })
  }

  const portrait = slots.find((slot) => slot.key === 'portrait')
  const others = slots.filter((slot) => slot.key !== 'portrait')

  return (
    <div className="space-y-10">
      {portrait && (
        <SlotCard slot={portrait} featured onFile={onFile} onLink={onLink} onRestore={restore} restoring={restoring === portrait.key} />
      )}

      <section aria-labelledby="site-photos-title">
        <h2 id="site-photos-title" className="font-sans text-xs font-bold tracking-[0.2em] text-ink-soft uppercase">
          Photos around your website
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {others.map((slot) => (
            <SlotCard key={slot.key} slot={slot} onFile={onFile} onLink={onLink} onRestore={restore} restoring={restoring === slot.key} />
          ))}
        </div>
      </section>

      <Card className="p-5 sm:p-7" aria-labelledby="library-title">
        <CardHeader
          id="library-title"
          icon={<Images />}
          title="Your uploads"
          description="Every photo you have uploaded. Photos in use can’t be deleted — replace them first."
        />
        <MediaLibrary media={media} slots={slots} />
      </Card>

      <p className="flex items-start gap-2 text-[0.8125rem] leading-relaxed text-ink-soft">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
        Only use photos you own or have permission to use. Photos are resized to 2000 pixels automatically.
      </p>

      <PhotoDialog
        active={active}
        stage={stage}
        uploading={uploading}
        onClose={close}
        onFetchLink={onFetchLink}
        onChooseFile={(file) => {
          if (!active) return
          setActive({ slot: active.slot, mode: 'file' })
          void prepare(async () => file, fileLabel(file.name), 'Preparing your photo…')
        }}
        onUpload={upload}
      />
    </div>
  )
}
