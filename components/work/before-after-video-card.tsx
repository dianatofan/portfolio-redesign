"use client"

import { useEffect, useRef, useState } from "react"

type Mode = "before" | "after"

function SegmentedToggle({
  value,
  onChange,
}: {
  value: Mode
  onChange: (value: Mode) => void
}) {
  return (
    <div className="inline-flex rounded-full bg-gray-100 p-1 ring-1 ring-gray-200">
      {(["before", "after"] as const).map((key) => {
        const active = value === key

        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={active}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              active
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {key === "before" ? "Before" : "After"}
          </button>
        )
      })}
    </div>
  )
}

export function BeforeAfterVideoCard({
  beforeSrc = "https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610236/read-and-unread.mp4",
  afterSrc = "https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610321/only-unread.mp4",
}: {
  beforeSrc?: string
  afterSrc?: string
} = {}) {
  const [mode, setMode] = useState<Mode>("before")

  const beforeRef = useRef<HTMLVideoElement | null>(null)
  const afterRef = useRef<HTMLVideoElement | null>(null)
  const sharedVideoClass =
    "absolute inset-0 h-full w-full object-contain scale-[1.04] will-change-opacity transition-opacity duration-700 ease-in-out"

  useEffect(() => {
    const before = beforeRef.current
    const after = afterRef.current
    if (!before || !after) return

    const active = mode === "before" ? before : after
    const inactive = mode === "before" ? after : before

    inactive.pause()
    inactive.currentTime = 0

    active.currentTime = 0
    /*
     * play() returns a promise that rejects with AbortError whenever playback is
     * cut short before it begins — toggling the segmented control quickly, or
     * this card unmounting mid-request. Discarding it with `void` left an
     * unhandled rejection, which is the "The play() request was interrupted
     * because the media was removed from the document" console error. There is
     * nothing to recover from, so swallow exactly that case.
     */
    active.play().catch((error: unknown) => {
      // AbortError: playback was cut short. NotAllowedError: the browser refused
      // autoplay (low-power mode, for one) — the videos are muted, so this is
      // rare, but it's the visitor's setting either way. Neither is actionable.
      const name = error instanceof DOMException ? error.name : ""
      if (name === "AbortError" || name === "NotAllowedError") return
      console.error("before/after video failed to play", error)
    })
  }, [mode])

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <SegmentedToggle value={mode} onChange={setMode} />
      </div>

      <div className="w-full bg-[#E6EBF2] p-8 rounded-2xl">
        <div className="relative w-full aspect-video overflow-hidden">
          <video
            ref={beforeRef}
            src={beforeSrc}
            muted
            loop
            playsInline
            preload="auto"
            className={`${
              sharedVideoClass
            } ${mode === "before" ? "opacity-100" : "opacity-0"}`}
          />

          <video
            ref={afterRef}
            src={afterSrc}
            muted
            loop
            playsInline
            preload="auto"
            className={`${
              sharedVideoClass
            } ${mode === "after" ? "opacity-100" : "opacity-0"}`}
          />
        </div>
      </div>
    </div>
  )
}
