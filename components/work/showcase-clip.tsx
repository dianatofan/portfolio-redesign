"use client"

import { useEffect, useRef, useState } from "react"

/**
 * A muted screen recording that plays only while it is on screen, under a short
 * headline and a one-line caption. Visitors who prefer reduced motion get the poster.
 *
 * `bare` drops the headline and caption so the clip can sit inside another block
 * (a feature card, a numbered decision); the frame ratio is then up to the caller.
 */
export function ShowcaseClip({
  eyebrow,
  title,
  caption,
  src,
  poster,
  label,
  bare = false,
  ratio = "aspect-[8/5]",
}: {
  eyebrow?: string
  title?: string
  caption?: string
  src: string
  poster: string
  label: string
  bare?: boolean
  ratio?: string
}) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const [still, setStill] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.5 },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  // WebM for the in-browser recordings, MP4 for the older screen captures.
  const type = src.endsWith(".webm") ? "video/webm" : "video/mp4"

  const frame = (
    <div className={`relative ${ratio} overflow-hidden ${bare ? "" : "mt-8 rounded-[4px]"} bg-surface`}>
      {still ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt={label} className="h-full w-full object-cover" />
      ) : (
        <video
          ref={ref}
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={label}
          className="h-full w-full object-cover"
        >
          <source src={src} type={type} />
        </video>
      )}
    </div>
  )

  if (bare) return frame

  return (
    <figure>
      {eyebrow && (
        <p className="mb-3 text-[13px] text-ink-meta">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="text-[clamp(30px,3.2vw,44px)] font-medium leading-[1.05] tracking-[-0.04em] text-ink text-balance">
          {title}
        </h2>
      )}
      {frame}
      {caption && (
        <figcaption className="mt-4 max-w-[640px] text-lg leading-[1.6] text-ink text-pretty">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/** A row of cards, each a number with a short label under it. */
export function StatBand({ items }: { items: Array<{ value: string; label: string }> }) {
  return (
    <div className="grid grid-cols-1 border-t border-ink border-b border-b-hairline sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1.5 py-6 pr-6">
          <p className="text-[clamp(40px,4.4vw,64px)] font-medium leading-none tracking-[-0.05em] text-ink">
            {item.value}
          </p>
          <p className="max-w-[260px] text-[15px] text-ink-muted">{item.label}</p>
        </div>
      ))}
    </div>
  )
}
