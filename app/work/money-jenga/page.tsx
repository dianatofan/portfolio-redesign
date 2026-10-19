import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight, CreditCard, Workflow } from "lucide-react"
import { Footer } from "@/components/footer"
import { MoneyJengaSteps } from "@/components/work/money-jenga-steps"
import { MoneyJengaPaceChart } from "@/components/work/money-jenga-pace-chart"
import { PlayablePhone } from "@/components/work/playable-phone"

// A static route, like /work/release-timeline: the post needs its own page
// layout, so it takes precedence over the dynamic [slug] template.

export const metadata: Metadata = {
  title: "Money Jenga - Diana Tofan",
  description:
    "An iPhone budget app where every purchase pulls a block out of a tower of cash. No bank details needed. Built in SwiftUI with Claude Code.",
}

const heading = "text-xl font-medium tracking-tight text-foreground md:text-2xl"
const body = "mt-4 text-lg leading-relaxed text-[var(--text-secondary)]"

const chip = "flex h-12 w-12 items-center justify-center rounded-full bg-[#f4ead6] text-[#c8372d]"

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
  { icon: <Workflow size={20} aria-hidden />, title: "iOS Shortcut", text: "Sends what I paid and where" },
  { icon: <TowerIcon />, title: "Money Jenga", text: "Pulls a block" },
]

export default function MoneyJengaPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="fixed left-0 right-0 top-0 z-50 bg-white/80 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex items-center justify-between gap-6">
          <Link
            href="/#built-in-code"
            className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-[var(--text-secondary)]"
          >
            <ChevronLeft size={16} aria-hidden />
            Back
          </Link>
          <Link
            href="/work/golden-goose-museum"
            className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-[var(--text-secondary)]"
          >
            Next: Golden Goose
            <ChevronRight size={16} aria-hidden />
          </Link>
        </div>
      </header>

      {/* Written as a short post: why, how it works, how I built it. Text stays in one
          narrow column; figures step out a little wider. */}
      <article className="pb-20 pt-28 md:pb-28 md:pt-36">
        <header className="mx-auto max-w-2xl px-6">
          <p className="text-sm text-[var(--text-tertiary)]">October 2026 · 1 min read</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-foreground md:text-5xl">Money Jenga</h1>
          <p className="mt-4 text-xl leading-relaxed text-[var(--text-secondary)]">
            A budget app where every purchase pulls a block out of a tower of cash.
          </p>
        </header>

        <figure className="mx-auto mt-12 w-[260px] md:mt-16 md:w-[280px]">
          <PlayablePhone
            src="/money-jenga-prototype/index.html"
            facade="/images/money-jenga/play-facade.webp"
            label="Money Jenga prototype"
            eventName="money_jenga_play"
          />
          <figcaption className="mt-4 text-center text-sm text-[var(--text-tertiary)]">
            The HTML prototype I built it from
          </figcaption>
        </figure>

        <section className="mx-auto mt-16 max-w-2xl px-6 md:mt-20">
          <h2 className={heading}>Why I built it</h2>
          <p className={body}>
            I love spending money. My bank account doesn&apos;t. Every budget app wanted my bank account details, and I
            wanted something more private. So I built my own.
          </p>
        </section>

        <section className="mx-auto mt-16 max-w-2xl px-6 md:mt-20">
          <h2 className={heading}>How it plays</h2>
        </section>

        <figure className="mx-auto mt-8 max-w-[900px] px-6">
          <MoneyJengaSteps />
        </figure>

        <section className="mx-auto mt-16 max-w-2xl px-6 md:mt-20">
          <h2 className={heading}>Smart, but private</h2>
          <p className={body}>
            An iOS Shortcut connects it to Apple Pay, so every payment logs itself. I never share my bank details.
          </p>
          <ol className="mt-8 flex items-start justify-between gap-2 sm:justify-start sm:gap-6">
            {flow.map((step, i) => (
              <li key={step.title} className="flex items-start gap-2 sm:gap-6">
                {i > 0 && <ArrowRight size={18} aria-hidden className="mt-[15px] shrink-0 text-[var(--text-tertiary)]" />}
                <div className="flex w-[84px] flex-col items-center text-center sm:w-[110px]">
                  <span className={chip}>{step.icon}</span>
                  <p className="mt-3 text-sm font-medium text-foreground">{step.title}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto mt-16 max-w-2xl px-6 md:mt-20">
          <h2 className={heading}>There&apos;s a cat</h2>
          <p className={body}>
            Spend evenly through the month and it sleeps. Too fast, the tower shakes. If it falls, the cat hides in a box.
          </p>
        </section>

        <div className="mx-auto mt-8 max-w-[900px] px-6">
          <MoneyJengaPaceChart />
        </div>

        <section className="mx-auto mt-16 max-w-2xl px-6 md:mt-20">
          <h2 className={heading}>How I built it</h2>
          <p className={body}>
            I prototyped it in HTML first, then built the iPhone app in SwiftUI with Claude Code. I like building silly
            little apps for myself, and this is the one I use most.
          </p>
        </section>
      </article>

      <Footer />
    </main>
  )
}
