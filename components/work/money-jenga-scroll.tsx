"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { AnnotationMarkers, asNote, noteKey, noteLines, type Note } from "@/components/release-timeline-scroll"

/*
 * The Money Jenga scroll story. Same mechanics as the release timeline: the
 * narrative scrolls on the left, a pinned frame on the right crossfades to each
 * step's screen, and annotation lines draw in beside it. The frame is a phone
 * here, so every note's `line` is a percentage of the phone's height.
 */

type Step = {
  num: string
  title: string
  text: string[]
  screen: { src: string; alt: string; animated?: boolean }
  notes: Note[]
}

const steps: Step[] = [
  {
    num: "01",
    title: "One number a month",
    text: ["At the start of the month I type in one sum.", "No bank login and no account."],
    screen: { src: "/images/money-jenga/setup.webp", alt: "Setup screen asking how tall the tower should be this month, set to 10.000 kr" },
    notes: [
      { text: "Typed in by hand", line: { top: 61, bottom: 72 } },
      { text: "Nothing leaves the phone", line: { top: 87, bottom: 93 } },
    ],
  },
  {
    num: "02",
    title: "A tower of cash",
    text: [
      "The budget stacks up as a tower of cash bundles.",
      "A placard shows what's left, and how much I can spend each day.",
    ],
    screen: { src: "/images/money-jenga/tower.webp", alt: "The full tower of cash with 10.000 kr left to spend" },
    notes: [
      { text: "Left to spend, and per day", line: { top: 12, bottom: 33 } },
      { text: "10.000 kr in cash bundles", line: { top: 38, bottom: 68 } },
    ],
  },
  {
    num: "03",
    title: "Taking money out",
    text: ["Every purchase is a pull.", "Type the amount, pick a category, and press Pull it."],
    screen: { src: "/images/money-jenga/keypad.webp", alt: "The Pull a block sheet with 2.400 kr typed in and the Stuff category selected" },
    notes: [
      { text: "Amount", line: { top: 30, bottom: 38 } },
      { text: "Category", line: { top: 40, bottom: 52 } },
      { text: "Keypad", line: { top: 58, bottom: 88 } },
    ],
  },
  {
    num: "04",
    title: "Pulling a block",
    text: [
      "A cartoon glove pulls the blocks out. Small buys come off the top, big ones from the bottom.",
      "The bills fly off and pile up on the floor.",
    ],
    screen: {
      src: "/images/money-jenga/pull.webp",
      alt: "Animation: a cartoon glove pulls a block out of the cash tower after a 2.400 kr purchase",
      animated: true,
    },
    notes: [
      { text: "Big buys pull from below", line: { top: 40, bottom: 68 } },
      { text: "Bills on the floor", line: { top: 87, bottom: 97 } },
    ],
  },
  {
    num: "05",
    title: "Getting shaky",
    text: ["The less money is left, the hollower the tower gets.", "When it runs out, the tower falls."],
    screen: { src: "/images/money-jenga/shaky.webp", alt: "A hollow, wobbly tower with 1.100 kr left and the warning One more and it's curtains" },
    notes: [
      { text: "“One more and it's curtains!”", line: { top: 27, bottom: 34 } },
      { text: "Hollow and wobbly", line: { top: 40, bottom: 68 } },
    ],
  },
  {
    num: "06",
    title: "The ledger",
    text: ["Every purchase is listed, and any of them can be undone.", "Past months are stamped Survived or Toppled."],
    screen: { src: "/images/money-jenga/ledger.webp", alt: "The ledger listing this month's three purchases, 8.900 kr of 10.000 kr spent" },
    notes: [
      { text: "Spent so far", line: { top: 61, bottom: 66 } },
      { text: "Each purchase, with undo", line: { top: 68, bottom: 98 } },
    ],
  },
]

// The phone screens are 406×862; the frame keeps that ratio.
const PHONE_RATIO = "aspect-[406/862]"

function Screen({ screen }: { screen: Step["screen"] }) {
  if (screen.animated) {
    // Plain img, not next/image: the optimizer would flatten the animation.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={screen.src} alt={screen.alt} className="absolute inset-0 h-full w-full object-contain" loading="lazy" />
  }
  return <Image src={screen.src} alt={screen.alt} fill className="object-contain" sizes="300px" />
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
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  // Matches the release timeline: drift in, hold while pinned, lift away.
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
      <motion.div style={reduceMotion ? undefined : { opacity, y }} className="w-full max-w-[280px] lg:sticky lg:top-24">
        <span className="font-mono text-sm tabular-nums text-[var(--text-tertiary)]">{step.num}</span>
        <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground md:text-3xl">{step.title}</h2>
        <div className="mt-4 space-y-3">
          {step.text.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-[var(--text-secondary)]">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>

      {/* Inline phone + notes — mobile only */}
      <div className="mt-8 w-full lg:hidden">
        <div className={`relative mx-auto w-[240px] ${PHONE_RATIO}`}>
          <Screen screen={step.screen} />
        </div>
        <ul className="mt-5 space-y-2">
          {step.notes.map(asNote).map((note) => (
            <li key={noteKey(note)} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <span aria-hidden className="mt-[1px] text-[var(--text-tertiary)]">
                ↳
              </span>
              <span>{noteLines(note).join(" ")}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function MoneyJengaScroll() {
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
    <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
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

      {/* Pinned phone + annotations — desktop only */}
      <div className="hidden lg:block">
        <div className="sticky top-[max(6rem,calc(50vh-320px))]">
          <div className="flex items-stretch justify-center gap-10">
            <div className={`relative w-[300px] ${PHONE_RATIO} drop-shadow-[0_30px_40px_rgba(0,0,0,0.35)]`}>
              {/* Every screen stays mounted and only its opacity animates, so the
                  crossfade never re-decodes an image mid-fade. */}
              {steps.map((step, i) => {
                const on = i === active
                return (
                  <motion.div
                    key={step.num}
                    className="absolute inset-0"
                    style={{ zIndex: on ? 2 : 1 }}
                    initial={false}
                    animate={{ opacity: on ? 1 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <Screen screen={step.screen} />
                  </motion.div>
                )
              })}
            </div>
            <div className="relative w-[200px] shrink-0">
              <AnnotationMarkers key={active} notes={activeStep.notes} reduceMotion={!!reduceMotion} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
