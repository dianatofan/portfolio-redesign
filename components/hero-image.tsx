"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function HeroImage({
  src,
  alt,
  video,
  radius = "rounded-2xl",
  className = "",
}: {
  src: string
  alt: string
  video?: string
  /** Corner radius class for the frame and its hairline edge. */
  radius?: string
  /** Extra classes for the frame, e.g. a max height. */
  className?: string
}) {
  const [loaded, setLoaded] = useState(false)
  const [reduced, setReduced] = useState(true)

  // Video heroes play once and rest on their last frame; with reduced motion
  // they stay on the poster.
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  if (video && !reduced) {
    return (
      <div className={`relative aspect-video overflow-hidden ${radius} bg-surface ${className}`}>
        <video
          src={video}
          poster={src}
          autoPlay
          muted
          playsInline
          aria-label={alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span aria-hidden className={`pointer-events-none absolute inset-0 ${radius} ring-1 ring-black/[0.08] ring-inset`} />
      </div>
    )
  }

  return (
    <div className={`relative aspect-video overflow-hidden ${radius} bg-surface ${className}`}>
      {/* Keep placeholder lightweight so image paints as fast as possible. */}
      <div
        className={`absolute inset-0 bg-surface transition-opacity duration-150 ${
          loaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      />
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-150 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="100vw"
        // Local heroes are screenshots with small text, so they get the higher
        // quality step; Cloudinary heroes keep its own auto:best.
        quality={src.startsWith("/") ? 90 : undefined}
        priority
        fetchPriority="high"
        onLoad={() => setLoaded(true)}
      />
      <span aria-hidden className={`pointer-events-none absolute inset-0 ${radius} ring-1 ring-black/[0.08] ring-inset`} />
    </div>
  )
}

