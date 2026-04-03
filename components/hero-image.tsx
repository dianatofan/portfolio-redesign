"use client"

import { useState } from "react"
import Image from "next/image"

export function HeroImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-card">
      {/* Shimmer skeleton shown until image is ready */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          loaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{
          background:
            "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
          backgroundSize: "200% 100%",
          animation: loaded ? "none" : "shimmer 1.4s infinite linear",
        }}
      />
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-500 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        sizes="100vw"
        priority
        fetchPriority="high"
        onLoad={() => setLoaded(true)}
      />
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

