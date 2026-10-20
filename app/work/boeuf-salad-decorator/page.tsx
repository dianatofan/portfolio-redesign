import type { Metadata } from "next"
import Image from "next/image"
import { ArrowRight, Salad, Send, Sparkles } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FigCaption, LabHero, LabIntro, LabSection, NextInLab, labBody } from "@/components/work/lab-chrome"

// A static route, like /work/money-jenga: the post needs its own page layout,
// so it takes precedence over the dynamic [slug] template. The app itself is a
// static build in public/salata-de-boeuf/.

export const metadata: Metadata = {
  title: "Boeuf Salad Decorator - Diana Tofan",
  description:
    "A 3D web app that turns the Romanian tradition of over-decorated Christmas salads into retro holiday cards you send to Mom.",
}

const APP = "/salata-de-boeuf/index.html"

const body = labBody
const chip = "flex h-12 w-12 items-center justify-center rounded-full bg-[#f6e3c8] text-[#9e1f24]"

const steps = [
  {
    icon: <Salad size={20} aria-hidden />,
    title: "Start a salad",
    text: "A classic or a blank mound",
  },
  { icon: <Sparkles size={20} aria-hidden />, title: "Decorate it", text: "From Mom's pantry" },
  {
    icon: <Send size={20} aria-hidden />,
    title: "Send it to Mom",
    text: "As a glittery GIF card",
  },
]

// The 1986 food inspection, word for word from the app.
const plan = [
  "At least 3 different vegetables",
  "At least 30 pieces (the plan)",
  "At most 10 olives (luxury)",
  "No bourgeois excess (max 400)",
]

export default function BoeufSaladPage() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <Header />

      <LabIntro
        title="Boeuf Salad Decorator"
        standfirst="Decorate a Romanian Christmas salad in 3D, then send it to Mom as a retro holiday card."
        actions={[{ label: "Open the app ↗", href: APP, primary: true }]}
      />

      <LabHero
        specs={[
          { label: "Platform", value: "Web" },
          { label: "Stack", value: "three.js, Claude Code" },
          { label: "Year", value: "2026" },
          { label: "Status", value: "Playable" },
        ]}
      >
        <a href={APP} target="_blank" rel="noopener noreferrer" className="group block">
          <Image
            src="/salata-de-boeuf/og.jpg"
            alt="The app: Mom's pantry of jars on the left, a salad on a porcelain plate decorated with a pea and carrot Christmas tree in the middle, and the House Menu with classic salads and the Kitsch-o-meter at 100%, Soviet banquet hall, on the right."
            width={1200}
            height={627}
            priority
            className="h-auto w-full bg-surface transition-opacity duration-200 group-hover:opacity-90"
          />
        </a>
      </LabHero>

      <LabSection label="Why I built it">
        <p className={body}>
          Every Romanian Christmas table has a salată de boeuf, and every mom decorates it like
          it&apos;s going to a wedding. I wanted anyone to make one, and send it home.
        </p>
      </LabSection>

      <LabSection label="How it plays">
        <ol className="flex items-start justify-between gap-2 sm:justify-start sm:gap-6">
          {steps.map((step, i) => (
            <li key={step.title} className="flex items-start gap-2 sm:gap-6">
              {i > 0 && (
                <ArrowRight size={18} aria-hidden className="mt-[15px] shrink-0 text-ink-meta" />
              )}
              <div className="flex w-[84px] flex-col items-center text-center sm:w-[110px]">
                <span className={chip}>{step.icon}</span>
                <p className="mt-3 text-sm font-medium text-ink">{step.title}</p>
                <p className="mt-0.5 text-[13px] text-ink-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className={`${body} mt-8`}>
          The Kitsch-o-meter rates it from German-tidy to Wedding in Botoșani.
        </p>
      </LabSection>

      <LabSection label="Or travel to 1986">
        <p className={body}>
          One button takes it back to the 80s family table: queues, ration cards, 2 kg of mayo.
          Before the salad can leave the house, it has to pass the five-year plan.
        </p>
        <figure className="mt-8">
          <div className="rounded bg-[#faf6ec] px-6 py-5 font-mono text-sm text-[#3b2a1a]">
            <p className="text-xs tracking-[0.18em] text-ink-meta">FOOD INSPECTION BULLETIN</p>
            <ul className="mt-3 space-y-1.5">
              {plan.map((rule) => (
                <li key={rule}>☐ {rule}</li>
              ))}
            </ul>
            <span
              aria-hidden
              className="mt-4 inline-block rotate-[-6deg] rounded border-2 border-[#9e1f24] px-2 py-0.5 text-base font-medium tracking-widest text-[#9e1f24] opacity-80"
            >
              APROBAT
            </span>
          </div>
          <FigCaption n={1} className="mt-3">
            The 1986 food inspection, word for word from the app.
          </FigCaption>
        </figure>
      </LabSection>

      <LabSection label="How I built it">
        <p className={body}>
          A web app in three.js, built with Claude Code, in English and Romanian. The card is a
          sparkly GIF, made right in the browser.
        </p>
      </LabSection>

      <NextInLab
        title="Release Timeline"
        href="/work/release-timeline"
        image="/images/release-timeline-thumb.webp"
      />

      <Footer />
    </main>
  )
}
