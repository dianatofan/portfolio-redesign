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

      <div className="my-4 h-px shrink-0 bg-border" />

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

      {revealed ? (
        <>
          <motion.div
            className="my-4 h-px shrink-0 origin-left bg-border"
            style={{ transformOrigin: "left" }}
            initial={reduceMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
          />
          <motion.div
            className="flex items-start justify-between gap-4"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.28, ease: "easeOut" }}
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                  Outcome
                </span>
                {prototype.details && (
                  <span className="group/info relative inline-flex">
                    <span
                      role="button"
                      tabIndex={isActive ? 0 : -1}
                      aria-label="More about this outcome"
                      className="inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-border text-[var(--text-tertiary)] transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
                    >
                      <HelpCircle size={11} aria-hidden />
                    </span>
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute bottom-full left-0 z-50 mb-2 w-56 rounded-lg border border-border bg-card p-3 text-xs font-normal normal-case leading-relaxed tracking-normal text-[var(--text-secondary)] opacity-0 shadow-lg transition-opacity duration-200 group-hover/info:opacity-100 group-focus-within/info:opacity-100"
                    >
                      {prototype.details}
                    </span>
                  </span>
                )}
              </div>
              <p className="text-[15px] leading-relaxed text-foreground">{prototype.outcome}</p>
            </div>
            <Chip>
              <Trophy size={18} aria-hidden />
            </Chip>
          </motion.div>
        </>
      ) : (
        <button
          type="button"
          onClick={onReveal}
          tabIndex={isActive ? 0 : -1}
          aria-label={`See outcome for ${prototype.title}`}
          className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-[#f4f4f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2"
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
