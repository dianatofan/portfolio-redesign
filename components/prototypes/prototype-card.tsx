"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, HelpCircle, Lightbulb, Trophy } from "lucide-react"
import type { Prototype } from "@/lib/prototypes/google-maps-prototypes"

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/40 text-[var(--accent-foreground)]">
      {children}
    </span>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
      {children}
    </p>
  )
}

/**
 * The swipeable content card (Question / Solution / Outcome). The device and
 * its media are rendered once by the deck and stay put; only these cards move.
 */
export function PrototypeCard({
  prototype,
  isActive,
  revealed,
  onReveal,
}: {
  prototype: Prototype
  isActive: boolean
  revealed: boolean
  onReveal: () => void
}) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="flex h-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.4)] md:p-7">
      <h3 className="sr-only">{prototype.title}</h3>

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <SectionLabel>Question</SectionLabel>
          <p className="text-[15px] font-medium leading-snug text-foreground">
            {prototype.question}
          </p>
        </div>
        <Chip>
          <HelpCircle size={18} aria-hidden />
        </Chip>
      </div>

      <div className="my-4 h-px bg-border" />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <SectionLabel>Solution</SectionLabel>
          <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {prototype.solution}
          </p>
        </div>
        <Chip>
          <Lightbulb size={18} aria-hidden />
        </Chip>
      </div>

      <div className="my-4 h-px bg-border" />

      {revealed ? (
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <SectionLabel>Outcome</SectionLabel>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-[15px] leading-relaxed text-foreground"
            >
              {prototype.outcome}
            </motion.p>
          </div>
          <Chip>
            <Trophy size={18} aria-hidden />
          </Chip>
        </div>
      ) : (
        <button
          type="button"
          onClick={onReveal}
          tabIndex={isActive ? 0 : -1}
          aria-label={`See outcome for ${prototype.title}`}
          className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-[#f4f4f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2"
        >
          See Outcome
          <ArrowRight
            size={16}
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      )}
    </div>
  )
}
