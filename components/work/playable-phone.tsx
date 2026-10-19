"use client"

import { useContext, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { CursorContext } from "@/context/CursorContext"
import { trackEvent } from "@/lib/track-event"

/*
 * A phone that plays a real prototype. Like the release timeline's embeds, it
 * shows a still until tapped, so the prototype only loads for people who want
 * it. The iframe renders at the prototype's design size and is scaled to fit.
 */

// The prototype's page size, and where its own phone frame sits on that page.
// Only the phone is shown, so the page's dark margin never reads as a second frame.
const DESIGN = { width: 430, height: 900 }
const PHONE = { x: 10, y: 28, width: 410, height: 864, radius: 56 }

export function PlayablePhone({
  src,
  facade,
  label,
  eventName,
}: {
  src: string
  facade: string
  label: string
  eventName: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const { setHidden } = useContext(CursorContext)
  const [active, setActive] = useState(false)
  const [scale, setScale] = useState(0.7)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => setScale(el.clientWidth / PHONE.width)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Give the native cursor back while playing; restore the custom one on unmount.
  useEffect(() => () => setHidden(false), [setHidden])

  return (
    // No frame of our own: the prototype draws its own phone. The wrapper only
    // clips its square corners to the phone's rounded outline.
    <div className="drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]">
      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: `${PHONE.width} / ${PHONE.height}`,
          borderRadius: `${(PHONE.radius / PHONE.width) * 100}% / ${(PHONE.radius / PHONE.height) * 100}%`,
        }}
        onMouseEnter={() => active && setHidden(true)}
        onMouseLeave={() => setHidden(false)}
      >
        {active ? (
          <iframe
            src={src}
            title={label}
            className="absolute left-0 top-0 origin-top-left border-0"
            style={{
              width: DESIGN.width,
              height: DESIGN.height,
              transform: `scale(${scale}) translate(${-PHONE.x}px, ${-PHONE.y}px)`,
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setActive(true)
              setHidden(true)
              trackEvent(eventName)
            }}
            className="group absolute inset-0 block cursor-pointer"
            aria-label={`Play: ${label}`}
          >
            <Image src={facade} alt="" fill className="object-cover" sizes="320px" priority />
            <span className="absolute inset-0 flex items-center justify-center transition-colors duration-300 group-hover:bg-black/10">
              <span className="flex items-center gap-2 rounded-full bg-[#c8372d] px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M8 5v14l11-7z" />
                </svg>
                Tap to play
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
