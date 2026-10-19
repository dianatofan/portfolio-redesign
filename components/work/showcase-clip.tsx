"use client"

import { useEffect, useRef, useState } from "react"

/**
 * A muted screen recording that plays only while it is on screen, under a short
 * headline and a one-line caption. Visitors who prefer reduced motion get the poster.
 */
export function ShowcaseClip({
  eyebrow,
  title,
  caption,
  src,
  poster,
  label,
}: {
  eyebrow?: string
  title: string
  caption: string
  src: string
  poster: string
  label: string
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

  return (
    <figure>
      {eyebrow && (
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl md:text-3xl font-medium text-foreground">{title}</h2>
      <div className="mt-8 relative aspect-[8/5] overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-black/5">
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
            <source src={src} type="video/mp4" />
          </video>
        )}
      </div>
      <figcaption className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
        {caption}
      </figcaption>
    </figure>
  )
}

/** A row of cards, each a number with a short label under it. */
export function StatBand({ items }: { items: Array<{ value: string; label: string }> }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="bg-accent/20 p-6 rounded-lg">
          <p className="text-3xl md:text-4xl font-medium tracking-tight text-foreground">
            {item.value}
          </p>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.label}</p>
        </div>
      ))}
    </div>
  )
}
