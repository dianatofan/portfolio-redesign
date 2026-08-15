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

/**
 * An annotation note. `line` pins its bracket to a vertical span (percent), and
 * an array of `text` renders each entry on its own row. `whenExpanded` holds the
 * note back until the prototype's chart card is actually open.
 */
type Note = {
  text: string | string[]
  line?: { top: number; bottom: number }
  whenExpanded?: boolean
}

const asNote = (note: string | Note): Note =>
  typeof note === "string" ? { text: note } : note

const noteLines = (note: Note): string[] =>
  Array.isArray(note.text) ? note.text : [note.text]

const noteKey = (note: Note): string => noteLines(note).join(" ")

type Step = {
  num: string
  title: string
  text: string[]
  /** Either a screenshot variant or a text label shown inside the frame. */
  visual?: FrameVisual
  visualLabel?: string
  /** A static screenshot that becomes a live, interactive iframe on click. */
  embed?: { src: string; facade: string; designWidth: number }
  /**
   * "What changed" notes, shown beside the frame. A plain string gets its line
   * auto-distributed down the frame; pass `{ text, line }` to pin a note to the
   * region it actually describes.
   */
  notes?: (string | Note)[]
  /** Label shown in the browser frame's URL bar (defaults to "timeline"). */
  url?: string
  /** For a single-note step: vertical span (percent) the annotation line covers. */
  noteLine?: { top: number; bottom: number }
}

const steps: Step[] = [
  {
    num: "01",
    title: "Early exploration",
    text: [
      "The initial concept: a dedicated page where teams could explore releases, events, and performance metrics together.",
      "It gave me room to experiment with visualizing change over time.",
    ],
    visual: "separate",
    notes: ["Dedicated timeline page"],
  },
  {
    num: "02",
    title: "Visualizing change",
    text: [
      "My first prototype plotted releases and events directly on the chart as lollipop markers.",
      "With a handful of events, correlating releases with crash rate and DAU was easy.",
    ],
    embed: {
      src: "/release-timeline-embed.html",
      facade: "/images/release-timeline-embed-facade.webp",
      designWidth: 1440,
    },
    notes: [
      // Pinned: the first bracket sits beside the KPI row, the second spans the
      // chart and the events list it feeds.
      { text: "Key metrics", line: { top: 15, bottom: 27 } },
      {
        text: ["Left: lollipop markers", "Right: recent events list"],
        line: { top: 29, bottom: 100 },
      },
    ],
  },
  {
    num: "03",
    title: "Reality check",
    text: [
      "Production-like data exposed two problems: some games generated far more events than expected, cluttering the chart.",
      "And investigations almost always started from the Releases page, not a separate timeline.",
      "Both pushed the design in a different direction.",
    ],
    visual: "lollipop-cluttered",
    notes: ["Cluttered when too many events"],
    noteLine: { top: 44, bottom: 66 },
  },
  {
    num: "04",
    title: "Moving into Releases",
    text: [
      "Instead of a separate destination, the timeline moved into the Releases page — as a card on top of the release list, in the Released tab.",
      "That placed it exactly where investigations already started.",
    ],
    visual: "integrated",
    notes: ["Card on top of the Releases page"],
    // Matches the grey timeline-card block: starts below the Released/Unreleased
    // tabs and ends where the release table's search row begins.
    noteLine: { top: 16, bottom: 49 },
    url: "releases",
  },
  {
    num: "05",
    title: "Final solution",
    text: [
      "The card is expandable, tucking away when it's not needed.",
      "Events moved into their own lane below the chart — keeping it readable, with extra context available without leaving the existing workflow.",
    ],
    embed: {
      src: "/release-timeline-final.html",
      facade: "/images/release-timeline-final-facade.webp",
      designWidth: 1440,
    },
    notes: [
      // Spans measured off screenshots of the prototype, as a percentage of the
      // whole frame (browser chrome included). Collapsed, the "Crash rate & DAU"
      // card sits at 18–42%; expanded, its event lanes sit at 51–62%.
      { text: "Expandable card in the Released tab", line: { top: 18, bottom: 42 } },
      {
        text: "Events in their own lane",
        line: { top: 51, bottom: 62 },
        whenExpanded: true,
      },
    ],
    url: "releases",
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
    src: "/images/release-timeline-lollipop-dense.webp",
    alt: "Crash rate chart cluttered with dozens of overlapping lollipop event markers",
  },
}

/** Landscape desktop/browser frame for the release-timeline prototype. */
function BrowserVisual({ url = "timeline", children }: { url?: string; children?: React.ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-1.5 border-b border-border bg-[#f3f3f4] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <div className="mx-auto flex h-5 w-1/2 items-center justify-center rounded border border-border bg-white text-[10px] text-[var(--text-tertiary)]">
          {url}
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
function EmbedFrame({
  embed,
  onExpandedChange,
}: {
  embed: NonNullable<Step["embed"]>
  /** Reports whether the prototype's chart card is currently expanded. */
  onExpandedChange?: (expanded: boolean) => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const { setHidden } = useContext(CursorContext)
  const [active, setActive] = useState(false)
  const [scale, setScale] = useState(0.5)

  // Held in a ref so the observer below isn't torn down and rebuilt whenever the
  // parent re-renders with a fresh inline callback.
  const reportRef = useRef(onExpandedChange)
  useEffect(() => {
    reportRef.current = onExpandedChange
  }, [onExpandedChange])

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

  /*
   * Mirror the prototype's expand/collapse state out to the annotation gutter.
   * The embed is same-origin, so we can watch its DOM: the chart card's toggle is
   * `button.card-toggle` and carries aria-expanded. Watching that attribute (rather
   * than a minified class) is the most stable hook the prototype offers — the
   * sibling `.filter-trigger` dropdowns also use aria-expanded, hence the
   * class-scoped query. If the markup ever changes, this degrades to "never
   * expanded" rather than breaking the page.
   */
  useEffect(() => {
    if (!active) {
      reportRef.current?.(false)
      return
    }
    const iframe = frameRef.current
    if (!iframe) return

    let observer: MutationObserver | undefined

    const read = (doc: Document) => {
      const open = Array.from(doc.querySelectorAll(".card-toggle")).some(
        (el) => el.getAttribute("aria-expanded") === "true"
      )
      reportRef.current?.(open)
    }

    const attach = () => {
      let doc: Document | null = null
      try {
        doc = iframe.contentDocument
      } catch {
        return // cross-origin: leave the note hidden
      }
      if (!doc) return
      read(doc)
      observer?.disconnect()
      observer = new MutationObserver(() => read(doc!))
      observer.observe(doc.documentElement, {
        attributes: true,
        attributeFilter: ["aria-expanded"],
        subtree: true,
        // The prototype mounts its card after load, so watch for it arriving too.
        childList: true,
      })
    }

    iframe.addEventListener("load", attach)
    if (iframe.contentDocument?.readyState === "complete") attach()

    return () => {
      iframe.removeEventListener("load", attach)
      observer?.disconnect()
    }
  }, [active])

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
            ref={frameRef}
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

function FrameContent({
  step,
  onExpandedChange,
}: {
  step: Step
  onExpandedChange?: (expanded: boolean) => void
}) {
  if (step.embed) return <EmbedFrame embed={step.embed} onExpandedChange={onExpandedChange} />
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
  expanded = false,
}: {
  notes: (string | Note)[]
  reduceMotion: boolean
  /** For a single note: the vertical span (percent) the line should cover. */
  lineSpan?: { top: number; bottom: number }
  /** Whether the embedded prototype's chart card is currently expanded. */
  expanded?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  // Only start drawing once the frame is actually scrolled into view.
  const inView = useInView(ref, { amount: 0.4 })
  const show = reduceMotion || inView
  const items = notes.map(asNote).filter((note) => !note.whenExpanded || expanded)
  const n = items.length
  const LINE_X = "0%"
  // Vertical span of the gray content rectangle inside the frame (below the
  // browser chrome + Releases header/tabs).
  const GRAY_TOP = lineSpan?.top ?? 17
  const GRAY_BOTTOM = lineSpan?.bottom ?? 98

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0">
      {items.map((note, i) => {
        // A note with an explicit span brackets exactly that region. Otherwise a
        // single note marks the whole gray rectangle, and multiple notes get
        // shorter lines distributed down it.
        const single = n <= 1
        const autoTop = single
          ? GRAY_TOP
          : GRAY_TOP + ((GRAY_BOTTOM - GRAY_TOP - 14) * i) / Math.max(1, n - 1)
        const topPct = note.line?.top ?? autoTop
        const heightPct = note.line
          ? note.line.bottom - note.line.top
          : single
            ? GRAY_BOTTOM - GRAY_TOP
            : 14
        const centerPct = topPct + heightPct / 2
        const delay = 0.15 + i * 0.25
        return (
          <div key={noteKey(note)}>
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
                {noteLines(note).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
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
        <BrowserVisual url={step.url}>
          <FrameContent step={step} />
        </BrowserVisual>
        {step.notes && (
          <ul className="mt-5 space-y-2">
            {step.notes.map(asNote).map((note) => (
              <li
                key={noteKey(note)}
                className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
              >
                <span aria-hidden className="mt-[1px] text-[var(--text-tertiary)]">↳</span>
                <span>
                  {noteLines(note).map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
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
  // Keyed by step index: each embed reports its own expand state, so scrolling
  // between steps doesn't leak one prototype's state onto another's annotations.
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({})
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
              <BrowserVisual url={activeStep.url}>
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
                      <FrameContent
                        step={step}
                        onExpandedChange={(open) =>
                          setExpandedSteps((prev) =>
                            prev[i] === open ? prev : { ...prev, [i]: open }
                          )
                        }
                      />
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
                expanded={!!expandedSteps[active]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
