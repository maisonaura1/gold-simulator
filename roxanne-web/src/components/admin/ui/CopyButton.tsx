'use client'

import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { AdminButton } from './primitives'
import { useToast } from './Toast'

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Older browsers / insecure contexts: fall back to a hidden textarea.
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  }
}

export function CopyButton({
  text,
  label = 'Copy',
  copiedMessage = 'Copied to the clipboard.',
  variant = 'secondary',
  size = 'sm',
  className,
}: {
  text: string
  label?: string
  copiedMessage?: string
  variant?: 'secondary' | 'ghost' | 'primary'
  size?: 'sm' | 'md' | 'icon'
  className?: string
}) {
  const toast = useToast()
  const [copied, setCopied] = useState(false)

  return (
    <AdminButton
      variant={variant}
      size={size}
      className={className}
      aria-label={size === 'icon' ? label : undefined}
      onClick={async () => {
        if (await copyText(text)) {
          setCopied(true)
          toast.success(copiedMessage)
          window.setTimeout(() => setCopied(false), 2000)
        } else {
          toast.error('Copying didn’t work in this browser — please select the text and copy it by hand.')
        }
      }}
    >
      {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      {size !== 'icon' && (copied ? 'Copied' : label)}
    </AdminButton>
  )
}
