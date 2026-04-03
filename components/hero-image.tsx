"use client"

import { useState } from "react"
import Image from "next/image"

export function HeroImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-card">
      {/* Keep placeholder lightweight so image paints as fast as possible. */}
      <div
        className={`absolute inset-0 bg-[#f4f4f5] transition-opacity duration-150 ${
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
        priority
        fetchPriority="high"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}

