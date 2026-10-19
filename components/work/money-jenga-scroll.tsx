"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

/*
 * The Money Jenga scroll story. Same mechanics as the release timeline: the
 * narrative scrolls on the left while a pinned phone on the right crossfades to
 * each step's screen. Three beats, no annotations: the screens explain
 * themselves. Styled for the dark, sepia stage it sits on.
 */

type Step = {
  num: string
  title: string
  text: string
  screen: { src: string; alt: string; animated?: boolean }
}

const steps: Step[] = [
  {
    num: "01",
    title: "One sum a month",
    text: "I type in how much I can spend this month, and it stacks up as a tower of cash.",
    screen: { src: "/images/money-jenga/setup.webp", alt: "Setup screen asking how tall the tower should be this month, set to 10.000 kr" },
  },
  {
    num: "02",
    title: "Every purchase is a pull",
    text: "Small buys come off the top. Big ones pull from the bottom, so the tower gets wobbly.",
    screen: {
      src: "/images/money-jenga/pull.webp",
      alt: "Animation: a cartoon glove pulls a block out of the cash tower after a 2.400 kr purchase",
      animated: true,
    },
  },
  {
    num: "03",
    title: "Timberrr",
    text: "When the money runs out, the tower falls. Hard to ignore, and a little funny.",
    screen: {
      src: "/images/money-jenga/topple.webp",
      alt: "Animation: the last blocks are pulled and the tower collapses into a pile of bills, with the message Timberrr, the tower of life has fallen",
      animated: true,
    },
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

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)")
    const sync = () => setDesktop(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])
  return desktop
}

function NarrativeStep({
  step,
  index,
  registerRef,
  animate,
}: {
  step: Step
  index: number
  registerRef: (index: number, el: HTMLElement | null) => void
  animate: boolean
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
      className="flex flex-col justify-center py-12 lg:block lg:min-h-screen lg:py-0"
    >
      {/* The scroll fade only runs beside the pinned phone. On phones the text
          sits above its own screen and must stay fully readable. */}
      <motion.div style={animate ? { opacity, y } : undefined} className="w-full max-w-[300px] lg:sticky lg:top-[40vh]">
        <span className="font-mono text-sm tabular-nums text-[#c9b48a]">{step.num}</span>
        <h2 className="mt-2 text-3xl font-medium tracking-tight text-[#f4ead6] md:text-4xl">{step.title}</h2>
        <p className="mt-4 text-base leading-relaxed text-[#cbbd9f]">{step.text}</p>
      </motion.div>

      <div className={`relative mx-auto mt-8 w-[240px] lg:hidden ${PHONE_RATIO}`}>
        <Screen screen={step.screen} />
      </div>
    </section>
  )
}

export function MoneyJengaScroll() {
  const [active, setActive] = useState(0)
  const stepRefs = useRef<Array<HTMLElement | null>>([])
  const reduceMotion = useReducedMotion()
  const desktop = useIsDesktop()

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

  return (
    <div className="mx-auto grid max-w-[1000px] grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
      {/* Bottom padding keeps the phone pinned through the last step instead of
          sliding up under the header while its text is still on screen. */}
      <div className="lg:pb-[25vh]">
        {steps.map((step, i) => (
          <NarrativeStep
            key={step.num}
            step={step}
            index={i}
            animate={desktop && !reduceMotion}
            registerRef={(idx, el) => {
              stepRefs.current[idx] = el
            }}
          />
        ))}
      </div>

      {/* Pinned phone — desktop only */}
      <div className="hidden lg:block">
        <div className={`sticky top-[max(6rem,calc(50vh-320px))] w-[300px] ${PHONE_RATIO} drop-shadow-[0_40px_50px_rgba(0,0,0,0.55)]`}>
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
      </div>
    </div>
  )
}
