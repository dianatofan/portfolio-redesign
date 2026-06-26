"use client"

import { useContext, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { CursorContext } from "@/context/CursorContext"
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"

type FrameVisual = "separate" | "integrated" | "lollipop-cluttered"

type Step = {
  num: string
  title: string
  text: string[]
  /** Either a screenshot variant or a text label shown inside the frame. */
  visual?: FrameVisual
  visualLabel?: string
  /** A static screenshot that becomes a live, interactive iframe on click. */
  embed?: { src: string; facade: string; designWidth: number }
  /** "What changed" notes, shown beside the frame. */
  notes?: string[]
  /** For a single-note step: vertical span (percent) the annotation line covers. */
  noteLine?: { top: number; bottom: number }
}

const steps: Step[] = [
  {
    num: "01",
    title: "Where should it live?",
    text: [
      "My first instinct was a dedicated Release Timeline page, with its own space to explore release history, operational events, and performance metrics side by side.",
      "It's also where I started experimenting with how to plot it all.",
    ],
    visual: "separate",
    notes: ["Dedicated timeline page"],
  },
  {
    num: "02",
    title: "Bringing the timeline into Releases",
    text: [
      "The idea made sense, but the workflow didn't. Investigations already started from the released versions tab.",
      "So I embedded the timeline right into the Releases page, in the flow teams already used.",
    ],
    visual: "integrated",
    notes: ["Embedded into Releases"],
    noteLine: { top: 16, bottom: 43 },
  },
  {
    num: "03",
    title: "How should it work?",
    text: ["My first visualization plotted releases and events directly on the graph using lollipop-inspired markers."],
    embed: {
      src: "/release-timeline-embed.html",
      facade: "/images/release-timeline-embed-facade.png",
      designWidth: 1440,
    },
    notes: ["Plotted events on the graph", "Lollipop markers"],
  },
  {
    num: "04",
    title: "Why it didn't scale",
    text: [
      "It worked well when there were only a few events.",
      "Then I looked at the data. Some games had multiple releases, experiments, and configuration changes every day. The chart quickly became cluttered and difficult to scan.",
    ],
    visual: "lollipop-cluttered",
    notes: ["Cluttered when too many events"],
    noteLine: { top: 44, bottom: 66 },
  },
  {
    num: "05",
    title: "Final solution",
    text: [
      "The timeline found its home in the Released tab, as an expandable, collapsible card.",
      "Events sit in their own lane below the graph, so the link between changes and player impact stays visible while the graph stays readable. It tucks away when you don't need it.",
    ],
    embed: {
      src: "/release-timeline-final.html",
      facade: "/images/release-timeline-final-facade.png",
      designWidth: 1440,
    },
    notes: ["Expandable card in the Released tab", "Events in their own lane", "Graph stayed readable"],
  },
]

const VISUAL_IMG: Record<FrameVisual, { src: string; alt: string }> = {
  separate: {
    src: "/images/release-timeline-separate.png",
    alt: "Releases page with a dedicated Timeline tab",
  },
  integrated: {
    src: "/images/release-timeline-integrated.png",
    alt: "Timeline integrated above the Releases data grid",
  },
  "lollipop-cluttered": {
    src: "/images/release-timeline-lollipop-dense.png",
    alt: "Crash rate chart cluttered with dozens of overlapping lollipop event markers",
  },
}

/** Landscape desktop/browser frame for the release-timeline prototype. */
function BrowserVisual({ children }: { children?: React.ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-1.5 border-b border-border bg-[#f3f3f4] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-auto flex h-5 w-1/2 items-center justify-center rounded border border-border bg-white text-[10px] text-[var(--text-tertiary)]">
          timeline
        </div>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f7f7f8]">{children}</div>
    </div>
  )
}

/**
 * Facade pattern: shows a static screenshot until clicked, then swaps in the
 * live (scaled-to-fit) iframe — so the heavy prototype only loads on demand.
 */
function EmbedFrame({ embed }: { embed: NonNullable<Step["embed"]> }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const { setHidden } = useContext(CursorContext)
  const [active, setActive] = useState(false)
  const [scale, setScale] = useState(0.5)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const update = () => setScale(el.clientWidth / embed.designWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [embed.designWidth])

  // Restore the cursor if the frame unmounts while still interactive (scroll away).
  useEffect(() => () => setHidden(false), [setHidden])

  const start = () => {
    setActive(true)
    setHidden(true) // hide the dot cursor, restore the native one for interacting
  }
  const stop = () => {
    setActive(false)
    setHidden(false)
  }

  // The iframe's own viewport is 16:10 of the design width; the (taller) app
  // scrolls inside it. Scaling by clientWidth/designWidth fits it to the frame.
  const viewH = Math.round((embed.designWidth * 10) / 16)

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden bg-card">
      {active ? (
        <>
          <iframe
            src={embed.src}
            title="Interactive release-timeline prototype"
            loading="lazy"
            className="origin-top-left border-0"
            style={{ width: embed.designWidth, height: viewH, transform: `scale(${scale})` }}
          />
          <button
            type="button"
            onClick={stop}
            className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-black/85"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <rect x="6" y="6" width="12" height="12" rx="1.5" />
            </svg>
            Stop interaction
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={start}
          className="group absolute inset-0 block cursor-pointer"
          aria-label="Play the interactive prototype"
        >
          <Image src={embed.facade} alt="Interactive prototype preview" fill className="object-cover object-top" sizes="60vw" />
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/15">
            <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
              Click to interact
            </span>
          </span>
        </button>
      )}
    </div>
  )
}

function FrameContent({ step }: { step: Step }) {
  if (step.embed) return <EmbedFrame embed={step.embed} />
  if (step.visual) {
    const img = VISUAL_IMG[step.visual]
    return (
      <Image
        src={img.src}
        alt={img.alt}
        fill
        className="object-cover object-top"
        sizes="(max-width: 1024px) 100vw, 60vw"
      />
    )
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="px-8 text-center text-sm text-[var(--text-tertiary)]">{step.visualLabel}</span>
    </div>
  )
}

/** Apple-style transition curve — fast start, long soft landing. */
const appleEase = [0.32, 0.72, 0, 1] as const

/**
 * Annotations shown in the gutter to the right of the screen: a vertical line
 * that "draws" downward when scrolled into view, with the explanation to its
 * right. A single note is centred vertically; multiple notes are distributed.
 */
function AnnotationMarkers({
  notes,
  reduceMotion,
  lineSpan,
}: {
  notes: string[]
  reduceMotion: boolean
  /** For a single note: the vertical span (percent) the line should cover. */
  lineSpan?: { top: number; bottom: number }
}) {
  const ref = useRef<HTMLDivElement>(null)
  // Only start drawing once the frame is actually scrolled into view.
  const inView = useInView(ref, { amount: 0.4 })
  const show = reduceMotion || inView
  const n = notes.length
  const LINE_X = "0%"
  // Vertical span of the gray content rectangle inside the frame (below the
  // browser chrome + Releases header/tabs).
  const GRAY_TOP = lineSpan?.top ?? 17
  const GRAY_BOTTOM = lineSpan?.bottom ?? 98

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
      {notes.map((note, i) => {
        // A single note marks its gray rectangle; multiple notes get
        // shorter lines distributed down it.
        const single = n <= 1
        const topPct = single ? GRAY_TOP : GRAY_TOP + ((GRAY_BOTTOM - GRAY_TOP - 14) * i) / Math.max(1, n - 1)
        const heightPct = single ? GRAY_BOTTOM - GRAY_TOP : 14
        const centerPct = topPct + heightPct / 2
        const delay = 0.15 + i * 0.25
        return (
          <div key={note}>
            <motion.span
              className="absolute block w-[1.5px] bg-foreground"
              style={{ left: LINE_X, top: `${topPct}%`, height: `${heightPct}%`, transformOrigin: "top" }}
              initial={reduceMotion ? false : { scaleY: 0 }}
              animate={show ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 0.55, delay, ease: appleEase }}
            />
            <div
              className="absolute"
              style={{ left: LINE_X, top: `${centerPct}%`, transform: "translate(24px, -50%)" }}
            >
              <motion.span
                className="block max-w-[170px] text-[13px] font-medium leading-snug text-foreground"
                initial={reduceMotion ? false : { opacity: 0, x: 4 }}
                animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: 4 }}
                transition={{ duration: 0.3, delay: delay + 0.35 }}
              >
                {note}
              </motion.span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

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
        <BrowserVisual>
          <FrameContent step={step} />
        </BrowserVisual>
        {step.notes && (
          <ul className="mt-5 space-y-2">
            {step.notes.map((note) => (
              <li key={note} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span aria-hidden className="mt-[1px] text-[var(--text-tertiary)]">↳</span>
                {note}
              </li>
            ))}
          </ul>
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
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
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

      {/* Sticky frame + annotations — desktop only */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          {/* Frame + annotation column, centered so there's no large right gap */}
          <div className="flex items-stretch justify-center gap-10">
            <div className="relative w-full max-w-[1100px]">
              {/* The browser chrome is rendered once and stays put. Every
                  screen stays mounted and only its opacity animates — so the
                  active one crossfades in without the image re-decoding (which
                  caused the flicker). */}
              <BrowserVisual>
                {steps.map((step, i) => {
                  const on = i === active
                  return (
                    <motion.div
                      key={step.num}
                      className="absolute inset-0"
                      // The active screen sits on top and fades in over the
                      // previous one, so the crossfade never dips to the empty
                      // background — a clean, gapless fade-in.
                      style={{ pointerEvents: on ? "auto" : "none", zIndex: on ? 2 : 1 }}
                      initial={false}
                      animate={{ opacity: on ? 1 : 0 }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.7,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                    >
                      <FrameContent step={step} />
                    </motion.div>
                  )
                })}
              </BrowserVisual>
            </div>
            {/* Vertical-line annotations beside the frame, drawn on scroll-in */}
            <div className="relative w-[200px] shrink-0">
              <AnnotationMarkers
                key={active}
                notes={activeStep.notes ?? []}
                lineSpan={activeStep.noteLine}
                reduceMotion={!!reduceMotion}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
