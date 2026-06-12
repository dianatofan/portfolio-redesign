"use client"

import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"

type Step = {
  num: string
  title: string
  text: string[]
  visualLabel: string
  caption?: string
  /** "What changed" notes, shown as yellow sticky notes beside the frame. */
  notes?: string[]
}

const steps: Step[] = [
  {
    num: "01",
    title: "Where should this live?",
    text: ["My first concept was a dedicated Release Timeline page."],
    visualLabel: "Dedicated Release Timeline page",
    caption: "Timeline, metrics, side panel, and release history in a standalone experience.",
    notes: ["Added a dedicated timeline page", "Added a context side panel", "Added release summary cards"],
  },
  {
    num: "02",
    title: "The page disappeared",
    text: [
      "Investigations already started from Releases, so I moved the timeline into the existing workflow.",
    ],
    visualLabel: "Expand / collapse timeline (GIF)",
    caption: "Timeline integrated directly into Releases.",
    notes: ["Moved the timeline into Releases", "Collapsed it by default", "Dropped the standalone page"],
  },
  {
    num: "03",
    title: "The first graph didn't scale",
    text: [
      "I initially plotted releases and configuration changes directly on the chart.",
      "As more events were added, the graph became difficult to scan.",
    ],
    visualLabel: "Lollipop exploration",
    notes: ["Plotted releases on the chart", "Added config-change markers"],
  },
  {
    num: "04",
    title: "Events became their own layer",
    text: ["I moved releases and configuration changes into a dedicated timeline below the graph."],
    visualLabel: "Final timeline with event lane",
    caption: "Metrics stay readable while events remain easy to correlate.",
    notes: ["Split events into their own lane", "Kept the metrics chart clean", "Color + shape coded events"],
  },
  {
    num: "05",
    title: "Built in code",
    text: [
      "I connected Claude Code directly to our codebase and design system and hand-built the timeline in SVG.",
      "Engineers used the prototype as the starting point for implementation.",
    ],
    visualLabel: "Hover interactions, tooltips, overlays, event selection (GIF)",
    notes: ["Hand-built the timeline in SVG", "Added hover tooltips", "Added event selection"],
  },
]

/** Landscape desktop/browser frame placeholder for the release-timeline prototype. */
function BrowserVisual({ label }: { label: string }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-1.5 border-b border-border bg-[#f3f3f4] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-auto flex h-5 w-1/2 items-center justify-center rounded border border-border bg-white text-[10px] text-[var(--text-tertiary)]">
          dashboard / releases
        </div>
      </div>
      <div className="relative flex aspect-[16/10] items-center justify-center bg-[#f7f7f8]">
        <span className="px-8 text-center text-sm text-[var(--text-tertiary)]">{label}</span>
      </div>
    </div>
  )
}

function StickyNote({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <div
      className={`w-fit max-w-[200px] rounded-[3px] bg-[#fde68a] px-3.5 py-2.5 text-[12px] font-medium leading-snug text-[#5b4716] shadow-[0_12px_22px_-10px_rgba(0,0,0,0.45)] ${
        index % 2 === 0 ? "-rotate-2" : "rotate-2"
      }`}
    >
      {children}
    </div>
  )
}

/** Apple-style transition curve — fast start, long soft landing. */
const appleEase = [0.32, 0.72, 0, 1] as const

function NarrativeStep({
  step,
  index,
  registerRef,
  reduceMotion,
}: {
  step: Step
  index: number
  registerRef: (index: number, el: HTMLElement | null) => void
  reduceMotion: boolean
}) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  // Scroll-linked (not time-based): the pinned text drifts in and settles as it
  // reaches its resting spot, holds while pinned, then lifts away as the next
  // step pushes it out.
  const opacity = useTransform(scrollYProgress, [0.22, 0.42, 0.78, 0.94], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0.22, 0.42, 0.78, 0.94], [48, 0, 0, -32])

  return (
    <section
      data-index={index}
      ref={(el) => {
        sectionRef.current = el
        registerRef(index, el)
      }}
      className="flex min-h-[60vh] flex-col justify-center py-10 lg:block lg:min-h-screen lg:py-0"
    >
      <motion.div
        style={reduceMotion ? undefined : { opacity, y }}
        className="w-full max-w-[280px] lg:sticky lg:top-24"
      >
        <span className="font-mono text-sm tabular-nums text-[var(--text-tertiary)]">
          {step.num}
        </span>
        <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground md:text-3xl">
          {step.title}
        </h2>
        <div className="mt-4 space-y-3">
          {step.text.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-[var(--text-secondary)]">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>

      {/* Inline visual + notes — mobile only */}
      <div className="mt-8 w-full lg:hidden">
        <BrowserVisual label={step.visualLabel} />
        {step.caption && (
          <p className="mt-3 text-sm text-[var(--text-tertiary)]">{step.caption}</p>
        )}
        {step.notes && (
          <div className="mt-5 flex flex-wrap gap-3">
            {step.notes.map((note, n) => (
              <StickyNote key={note} index={n}>
                {note}
              </StickyNote>
            ))}
          </div>
        )}
      </div>
    </section>
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
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    )
    stepRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const activeStep = steps[active]

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[260px_minmax(0,1fr)_220px] lg:gap-10">
      {/* Left narrative — flush left, drives the scroll */}
      <div>
        {steps.map((step, i) => (
          <NarrativeStep
            key={step.num}
            step={step}
            index={i}
            reduceMotion={!!reduceMotion}
            registerRef={(idx, el) => {
              stepRefs.current[idx] = el
            }}
          />
        ))}
      </div>

      {/* Center sticky frame — desktop only */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          {/* Invisible sizer holds the box height; active frames crossfade on top */}
          <div className="relative">
            <div aria-hidden className="invisible">
              <BrowserVisual label="" />
            </div>
            <AnimatePresence initial={false}>
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.97, filter: "blur(8px)" }
                }
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 1.02, filter: "blur(8px)" }
                }
                transition={{ duration: 0.55, ease: appleEase }}
              >
                <BrowserVisual label={activeStep.visualLabel} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 h-5">
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

      {/* Right sticky notes — desktop only, what changed */}
      <div className="hidden lg:block">
        <div className="sticky top-28">
          <AnimatePresence mode="wait">
            <motion.div key={active} className="space-y-4">
              {activeStep.notes?.map((note, n) => (
                <motion.div
                  key={note}
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: 14, scale: 0.96, rotate: n % 2 === 0 ? -5 : 5 }
                  }
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.18 } }}
                  transition={{ duration: 0.45, delay: 0.1 + n * 0.07, ease: appleEase }}
                >
                  <StickyNote index={n}>{note}</StickyNote>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
