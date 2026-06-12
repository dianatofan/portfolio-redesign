"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

type Step = {
  num: string
  navTitle: string
  title: string
  text: string[]
  visualLabel: string
  caption?: string
}

const steps: Step[] = [
  {
    num: "01",
    navTitle: "What changed?",
    title: "What changed?",
    text: [
      "Teams had to jump between releases, configuration tools, and monitoring dashboards before they could start debugging.",
    ],
    visualLabel: "Final timeline — hero",
  },
  {
    num: "02",
    navTitle: "Where should this live?",
    title: "Where should this live?",
    text: ["My first concept was a dedicated Release Timeline page."],
    visualLabel: "Dedicated Release Timeline page",
    caption: "Timeline, metrics, side panel, and release history in a standalone experience.",
  },
  {
    num: "03",
    navTitle: "The page disappeared",
    title: "The page disappeared",
    text: [
      "Investigations already started from Releases, so I moved the timeline into the existing workflow.",
    ],
    visualLabel: "Expand / collapse timeline (GIF)",
    caption: "Timeline integrated directly into Releases.",
  },
  {
    num: "04",
    navTitle: "The first graph didn't scale",
    title: "The first graph didn't scale",
    text: [
      "I initially plotted releases and configuration changes directly on the chart.",
      "As more events were added, the graph became difficult to scan.",
    ],
    visualLabel: "Lollipop exploration",
  },
  {
    num: "05",
    navTitle: "Events became their own layer",
    title: "Events became their own layer",
    text: ["I moved releases and configuration changes into a dedicated timeline below the graph."],
    visualLabel: "Final timeline with event lane",
    caption: "Metrics stay readable while events remain easy to correlate.",
  },
  {
    num: "06",
    navTitle: "Built in code",
    title: "Built in code",
    text: [
      "I connected Claude Code directly to our codebase and design system and hand-built the timeline in SVG.",
      "Engineers used the prototype as the starting point for implementation.",
    ],
    visualLabel: "Hover interactions, tooltips, overlays, event selection (GIF)",
  },
]

function VisualPanel({ label }: { label: string }) {
  return (
    <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-[#f7f7f8]">
      <span className="px-8 text-center text-sm text-[var(--text-tertiary)]">{label}</span>
    </div>
  )
}

export function ReleaseTimelineScroll() {
  const [active, setActive] = useState(0)
  const stepRefs = useRef<Array<HTMLElement | null>>([])
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index)
            if (!Number.isNaN(idx)) setActive(idx)
          }
        })
      },
      // Active when a step crosses the central band of the viewport.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    )
    stepRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollToStep = (i: number) => {
    stepRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  const activeStep = steps[active]

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[150px_minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
      {/* Progress rail — desktop only */}
      <nav className="hidden lg:block" aria-label="Sections">
        <ul className="sticky top-32 space-y-1">
          {steps.map((step, i) => {
            const isActive = i === active
            return (
              <li key={step.num}>
                <button
                  type="button"
                  onClick={() => scrollToStep(i)}
                  className={`flex w-full items-start gap-2 border-l-2 py-2 pl-3 text-left text-xs leading-snug transition-colors ${
                    isActive
                      ? "border-foreground text-foreground"
                      : "border-transparent text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  <span className="font-mono tabular-nums">{step.num}</span>
                  <span className="font-medium">{step.navTitle}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Narrative steps */}
      <div>
        {steps.map((step, i) => (
          <section
            key={step.num}
            data-index={i}
            ref={(el) => {
              stepRefs.current[i] = el
            }}
            className="flex min-h-[68vh] flex-col justify-center py-10 lg:min-h-[82vh]"
          >
            <span className="font-mono text-sm tabular-nums text-[var(--text-tertiary)]">
              {step.num}
            </span>
            <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground md:text-3xl">
              {step.title}
            </h2>
            <div className="mt-4 max-w-md space-y-3">
              {step.text.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed text-[var(--text-secondary)]">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Inline visual — mobile only */}
            <div className="mt-8 lg:hidden">
              <VisualPanel label={step.visualLabel} />
              {step.caption && (
                <p className="mt-3 text-sm text-[var(--text-tertiary)]">{step.caption}</p>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* Sticky visual — desktop only */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <div className="relative aspect-[4/3] w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <VisualPanel label={activeStep.visualLabel} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-3 h-5">
            <AnimatePresence mode="wait">
              {activeStep.caption && (
                <motion.p
                  key={active}
                  className="text-sm text-[var(--text-tertiary)]"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {activeStep.caption}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
