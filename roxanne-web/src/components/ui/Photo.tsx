'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { ResolvedPhoto } from '@/content/photos'
import { cn } from '@/lib/cn'

interface PhotoProps {
  photo: ResolvedPhoto
  sizes: string
  className?: string
  imgClassName?: string
  preload?: boolean
}

/**
 * Fills its (sized) parent with an optimized image. If the image cannot load,
 * a warm gradient stays visible instead of a broken-image icon.
 */
export function Photo({ photo, sizes, className, imgClassName, preload = false }: PhotoProps) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLImageElement>(null)

  // An error that fires before hydration never reaches onError — check once mounted.
  useEffect(() => {
    const img = ref.current
    if (img?.complete && img.naturalWidth === 0) setFailed(true)
  }, [])

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-[radial-gradient(120%_90%_at_20%_10%,var(--color-blush),var(--color-sand)_55%,var(--color-cream))]',
        className,
      )}
    >
      {!failed && (
        <Image
          ref={ref}
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          preload={preload}
          unoptimized={photo.unoptimized}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            'object-cover transition-[opacity,transform] duration-[1.2s] ease-out-expo',
            loaded ? 'scale-100 opacity-100' : 'scale-[1.03] opacity-0',
            imgClassName,
          )}
        />
      )}
      {failed && <span className="sr-only">{photo.alt}</span>}
    </div>
  )
}
