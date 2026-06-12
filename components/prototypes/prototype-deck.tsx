"use client"

import { useCallback, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { googleMapsPrototypes } from "@/lib/prototypes/google-maps-prototypes"
import { PrototypeCard } from "./prototype-card"
import { DeviceFrame } from "./device-frame"
import { PrototypeMedia } from "./prototype-media"
import { OutcomeStamp } from "./outcome-stamp"

const SWIPE_THRESHOLD = 70
const SWIPE_VELOCITY = 400

function NavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next"
  onClick: () => void
  disabled: boolean
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous prototype" : "Next prototype"}
      className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all hover:bg-[#f4f4f5] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2"
    >
      <Icon size={22} aria-hidden />
    </button>
  )
}

export function PrototypeDeck() {
  const prototypes = googleMapsPrototypes
  const total = prototypes.length
  const [active, setActive] = useState(0)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const reduceMotion = useReducedMotion()
  const deckRef = useRef<HTMLDivElement>(null)

  const activePrototype = prototypes[active]
  const activeRevealed = revealed.has(activePrototype.id)

  const goNext = useCallback(() => setActive((i) => (i + 1) % total), [total])
  const goPrev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total])

  const reveal = useCallback((id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault()
        goNext()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        goPrev()
      }
    },
    [goNext, goPrev]
  )

  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const { offset, velocity } = info
      if (offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY) {
        goNext()
      } else if (offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY) {
        goPrev()
      }
    },
    [goNext, goPrev]
  )

  const springTransition = reduceMotion
    ? { duration: 0.2 }
    : { type: "spring" as const, stiffness: 320, damping: 34, mass: 0.9 }

  return (
    <div className="w-full">
      <div
        ref={deckRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Google prototype explorations"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative mx-auto w-full max-w-[480px] rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-4"
      >
        {/* Fixed device — stays put behind the cards; only the media swaps */}
        <div
          className="relative z-0 flex items-end justify-center px-5"
          style={{ perspective: 1200 }}
        >
          <motion.div
            className={`w-full ${reduceMotion ? "" : "cursor-grab active:cursor-grabbing"}`}
            whileHover={reduceMotion ? undefined : { y: -16 }}
            drag={reduceMotion ? false : "y"}
            dragConstraints={{ top: -72, bottom: 0 }}
            dragElastic={0.18}
            dragSnapToOrigin
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <DeviceFrame device={activePrototype.device}>
              <AnimatePresence>
                <motion.div
                  key={activePrototype.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  <PrototypeMedia media={activePrototype.media} />
                </motion.div>
              </AnimatePresence>
            </DeviceFrame>
          </motion.div>
        </div>

        {/* Swipeable content stack — cards cycle: the front card tucks to the back */}
        <div className="relative z-20 -mt-10 h-[392px]">
          {prototypes.map((prototype, index) => {
            // Wrapped position so the deck loops: 0 = front, total-1 = back.
            const pos = ((index - active) % total + total) % total
            const isActive = pos === 0
            const isHidden = pos > 3

            const targetStyle = {
              x: 0,
              y: pos * 13,
              scale: 1 - pos * 0.03,
              opacity: isHidden ? 0 : 1,
            }

            return (
              <motion.div
                key={prototype.id}
                className={`absolute inset-x-0 top-0 ${isActive ? "" : "pointer-events-none"}`}
                style={{
                  zIndex: total - pos,
                  touchAction: "pan-y",
                }}
                initial={false}
                animate={targetStyle}
                transition={springTransition}
                aria-hidden={!isActive}
                drag={isActive ? "x" : false}
                dragSnapToOrigin
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={isActive ? onDragEnd : undefined}
              >
                <PrototypeCard
                  prototype={prototype}
                  isActive={isActive}
                  revealed={revealed.has(prototype.id)}
                  onReveal={() => reveal(prototype.id)}
                />
              </motion.div>
            )
          })}

          {/* Stamp straddles the device base and the top of the active card */}
          <AnimatePresence>
            {activeRevealed && (
              <OutcomeStamp key={`stamp-${activePrototype.id}`} status={activePrototype.status} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-5">
          <NavButton direction="prev" onClick={goPrev} disabled={false} />

          <div className="flex items-center gap-2.5" role="tablist" aria-label="Prototype">
            {prototypes.map((prototype, index) => (
              <button
                key={prototype.id}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`Go to ${prototype.title}`}
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 ${
                  index === active
                    ? "w-7 bg-foreground"
                    : "w-2.5 bg-[var(--border)] hover:bg-[var(--text-tertiary)]"
                }`}
              />
            ))}
          </div>

          <NavButton direction="next" onClick={goNext} disabled={false} />
        </div>

        <p className="text-sm text-[var(--text-tertiary)]">Drag the card, swipe, or use ← →</p>
      </div>
    </div>
  )
}
