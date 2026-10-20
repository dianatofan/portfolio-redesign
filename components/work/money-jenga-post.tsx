"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import Image from "next/image"
import { ArrowRight, CreditCard, Workflow } from "lucide-react"
import { MoneyJengaPaceChart } from "@/components/work/money-jenga-pace-chart"
import { PlayablePhone } from "@/components/work/playable-phone"
import { FigCaption, LabHero, LabIntro, NextInLab, labBody, labHeading } from "@/components/work/lab-chrome"

/*
 * The Money Jenga post, in the Lab chrome: the intro and spec row up top, then
 * chapters of prose on the left and on desktop a sticky stage on the right that
 * swaps to each chapter's visual as you scroll. On phones each visual sits
 * inline under its chapter.
 */

type StageId = "play" | "steps" | "flow" | "cat"

// Figure number and caption for each visual. Numbered in reading order.
const STAGE_FIG: Record<StageId, { n: number; caption: string }> = {
  play: { n: 1, caption: "The prototype. Tap to play." },
  steps: { n: 2, caption: "Three screens from the app. Pick a step." },
  flow: { n: 3, caption: "How a payment gets in." },
  cat: { n: 4, caption: "The cat's pace chart. Hover the line." },
}

const steps = [
  {
    title: "One sum a month",
    text: "My budget stacks up as a tower.",
    screen: {
      src: "/images/money-jenga/setup.webp",
      alt: "Setup screen asking how tall the tower should be this month, set to 10.000 kr",
    },
  },
  {
    title: "Every purchase is a pull",
    text: "Big buys pull from the bottom, so it wobbles.",
    screen: {
      src: "/images/money-jenga/pull.webp",
      alt: "Animation: a cartoon glove pulls a block out of the cash tower after a 2.400 kr purchase",
      animated: true,
    },
  },
  {
    title: "Timberrr",
    text: "Out of money, the tower falls.",
    screen: {
      src: "/images/money-jenga/topple.webp",
      alt: "Animation: the last blocks are pulled and the tower collapses into a pile of bills, with the message Timberrr, the tower of life has fallen",
      animated: true,
    },
  },
]

/** A tiny tower of bills with one block pulled out, for the Apple Pay flow. */
function TowerIcon() {
  return (
    <span aria-hidden className="flex flex-col items-center gap-[2px]">
      <span className="h-[5px] w-5 rounded-[1px] bg-current" />
      <span className="h-[5px] w-5 translate-x-1.5 rounded-[1px] bg-current opacity-40" />
      <span className="h-[5px] w-5 rounded-[1px] bg-current" />
      <span className="h-[5px] w-5 rounded-[1px] bg-current" />
    </span>
  )
}

// How a payment reaches the app: the Shortcut passes on only the amount and merchant.
const flow = [
  { icon: <CreditCard size={20} aria-hidden />, title: "Apple Pay", text: "I pay" },
  {
    icon: <Workflow size={20} aria-hidden />,
    title: "iOS Shortcut",
    text: "Sends what I paid and where",
  },
  { icon: <TowerIcon />, title: "Money Jenga", text: "Pulls a block" },
]

const heading = labHeading
const body = `mt-4 ${labBody}`
const stageBg = "bg-surface"

function Play() {
  return (
    <div className="w-[240px] md:w-[280px]">
      <PlayablePhone
        src="/money-jenga-prototype/index.html"
        facade="/images/money-jenga/play-facade.webp"
        label="Money Jenga prototype"
        eventName="money_jenga_play"
      />
    </div>
  )
}

function StepScreens({ active }: { active: number }) {
  return (
    // The screens are 406×862 and include their own phone frame. All three stay
    // mounted and crossfade, so switching never re-decodes an animation.
    <div className="relative aspect-[406/862] w-[220px] drop-shadow-[0_16px_24px_rgba(28,22,17,0.18)] md:w-[260px]">
      {steps.map((step, i) => (
        <div
          key={step.title}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: i === active ? 1 : 0 }}
          aria-hidden={i !== active}
        >
          {step.screen.animated ? (
            // Plain img, not next/image: the optimizer would flatten the animation.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={step.screen.src}
              alt={step.screen.alt}
              className="absolute inset-0 h-full w-full object-contain"
              loading="lazy"
            />
          ) : (
            <Image
              src={step.screen.src}
              alt={step.screen.alt}
              fill
              className="object-contain"
              sizes="260px"
            />
          )}
        </div>
      ))}
    </div>
  )
}

function Flow() {
  return (
    <ol className="flex items-start justify-center gap-1.5 sm:gap-5">
      {flow.map((step, i) => (
        <li key={step.title} className="flex items-start gap-1.5 sm:gap-5">
          {i > 0 && (
            <ArrowRight size={18} aria-hidden className="mt-[15px] shrink-0 text-ink-meta" />
          )}
          <div className="flex w-[72px] flex-col items-center text-center sm:w-[110px]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#c8372d] shadow-sm">
              {step.icon}
            </span>
            <p className="mt-3 text-sm font-medium text-ink">{step.title}</p>
            <p className="mt-0.5 text-[13px] text-ink-muted">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

/** One chapter: its text, and on phones its visual right underneath. */
function Chapter({
  index,
  stage,
  visual,
  register,
  children,
}: {
  index: number
  stage: StageId
  visual: ReactNode
  register: (index: number, el: HTMLElement | null) => void
  children: ReactNode
}) {
  return (
    <section
      data-index={index}
      ref={(el) => register(index, el)}
      className="py-12 lg:flex lg:min-h-[85vh] lg:flex-col lg:justify-center lg:py-0"
    >
      {children}
      <figure className="mt-10 lg:hidden">
        <div className={`flex justify-center overflow-hidden rounded ${stageBg} px-4 py-10`}>
          {visual}
        </div>
        <FigCaption n={STAGE_FIG[stage].n} className="mt-3">
          {STAGE_FIG[stage].caption}
        </FigCaption>
      </figure>
    </section>
  )
}

export function MoneyJengaPost() {
  const [chapter, setChapter] = useState(0)
  const [step, setStep] = useState(0)
  const chapterRefs = useRef<Array<HTMLElement | null>>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setChapter(Number((entry.target as HTMLElement).dataset.index))
        })
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    )
    chapterRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const register = (index: number, el: HTMLElement | null) => {
    chapterRefs.current[index] = el
  }

  // Which visual each chapter puts on the stage. The last chapter is about the
  // prototype, so it brings the playable phone back.
  const chapterStages: StageId[] = ["play", "steps", "flow", "cat", "play"]
  const activeStage = chapterStages[chapter] ?? "play"

  const visuals: Record<StageId, ReactNode> = {
    play: <Play />,
    steps: <StepScreens active={step} />,
    flow: <Flow />,
    cat: (
      <div className="w-full px-2 md:px-8">
        <MoneyJengaPaceChart />
      </div>
    ),
  }

  return (
    <>
      <LabIntro
        title="Money Jenga"
        standfirst="A budget app where every purchase pulls a block out of a tower of cash."
      />
      <LabHero
        specs={[
          { label: "Platform", value: "iPhone" },
          { label: "Stack", value: "SwiftUI, Claude Code" },
          { label: "Year", value: "2026" },
          { label: "Status", value: "In daily use" },
        ]}
      />
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-16 px-5 pt-[72px] sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <article className="min-w-0 pb-12 lg:max-w-[600px] lg:pb-[20vh]">
          <Chapter index={0} stage="play" visual={visuals.play} register={register}>
            <h2 className={heading}>Why I built it</h2>
            <p className={body}>
              I love spending money. My bank account doesn&apos;t. Every budget app wanted my bank
              account details, and I wanted something more private. So I built my own.
            </p>
          </Chapter>

          <Chapter index={1} stage="steps" visual={visuals.steps} register={register}>
            <h2 className={heading}>How it plays</h2>
            <ul className="mt-6 space-y-2">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    onMouseEnter={() => setStep(i)}
                    onFocus={() => setStep(i)}
                    onClick={() => setStep(i)}
                    className="group flex w-full gap-4 rounded-lg py-2 text-left"
                    aria-pressed={i === step}
                  >
                    <span
                      aria-hidden
                      className={`mt-[3px] text-[13px] tabular-nums transition-colors ${i === step ? "text-brand" : "text-ink-meta"}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg leading-[1.6]">
                      <span
                        className={`font-medium transition-colors ${i === step ? "text-ink" : "text-ink-muted"}`}
                      >
                        {s.title}.
                      </span>{" "}
                      <span className="text-ink-muted">{s.text}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Chapter>

          <Chapter index={2} stage="flow" visual={visuals.flow} register={register}>
            <h2 className={heading}>Smart, but private</h2>
            <p className={body}>
              An iOS Shortcut connects it to Apple Pay, so every payment logs itself. I never share
              my bank details.
            </p>
          </Chapter>

          <Chapter index={3} stage="cat" visual={visuals.cat} register={register}>
            <h2 className={heading}>There&apos;s a cat</h2>
            <p className={body}>
              Spend evenly through the month and it sleeps. Too fast, the tower shakes. If it falls,
              the cat hides in a box.
            </p>
          </Chapter>

          <Chapter index={4} stage="play" visual={visuals.play} register={register}>
            <h2 className={heading}>How I built it</h2>
            <p className={body}>
              I prototyped it in HTML first, then built the iPhone app in SwiftUI with Claude Code.
            </p>
            <blockquote className="mt-10 border-y border-ink py-6 text-[clamp(24px,2.4vw,30px)] font-medium leading-[1.2] tracking-[-0.03em] text-ink text-balance">
              I like building silly little apps for myself, and this is the one I use most.
            </blockquote>
          </Chapter>
        </article>

        {/* The stage: desktop only. Every visual stays mounted and only the active
          one shows, so the prototype keeps its state when you scroll back to it. */}
        <div className="hidden lg:block">
          <figure className="sticky top-[88px] flex h-[calc(100vh-112px)] flex-col">
            <div className={`relative flex-1 overflow-hidden rounded ${stageBg}`}>
              {(Object.keys(visuals) as StageId[]).map((id) => (
                <div
                  key={id}
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
                  style={{
                    opacity: id === activeStage ? 1 : 0,
                    pointerEvents: id === activeStage ? "auto" : "none",
                  }}
                  aria-hidden={id !== activeStage}
                >
                  {visuals[id]}
                </div>
              ))}
            </div>
            <FigCaption n={STAGE_FIG[activeStage].n} className="py-3">
              {STAGE_FIG[activeStage].caption}
            </FigCaption>
          </figure>
        </div>
      </div>
      <NextInLab
        title="Golden Goose Digital Museum"
        href="/work/golden-goose-museum"
        image="/images/golden-goose-hero.webp"
      />
    </>
  )
}
