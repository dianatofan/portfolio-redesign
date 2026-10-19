import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Salad, Send, Sparkles } from "lucide-react"
import { Footer } from "@/components/footer"

// A static route, like /work/money-jenga: the post needs its own page layout,
// so it takes precedence over the dynamic [slug] template. The app itself is a
// static build in public/salata-de-boeuf/.

export const metadata: Metadata = {
  title: "Boeuf Salad Decorator - Diana Tofan",
  description:
    "A 3D web app that turns the Romanian tradition of over-decorated Christmas salads into retro holiday cards you send to Mom.",
}

const APP = "/salata-de-boeuf/index.html"

const heading = "text-xl font-medium tracking-tight text-foreground md:text-2xl"
const body = "mt-4 text-lg leading-relaxed text-[var(--text-secondary)]"
const chip = "flex h-12 w-12 items-center justify-center rounded-full bg-[#f6e3c8] text-[#9e1f24]"

const steps = [
  { icon: <Salad size={20} aria-hidden />, title: "Start a salad", text: "A classic or a blank mound" },
  { icon: <Sparkles size={20} aria-hidden />, title: "Decorate it", text: "From Mom's pantry" },
  { icon: <Send size={20} aria-hidden />, title: "Send it to Mom", text: "As a glittery GIF card" },
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
            href="/work/release-timeline"
            className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-[var(--text-secondary)]"
          >
            Next: Release Timeline
            <ChevronRight size={16} aria-hidden />
          </Link>
        </div>
      </header>

      {/* Written as a short post, like Money Jenga. Text stays in one narrow
          column; figures step out a little wider. */}
      <article className="pb-20 pt-28 md:pb-28 md:pt-36">
        <header className="mx-auto max-w-2xl px-6">
          <p className="text-sm text-[var(--text-tertiary)]">October 2026 · 1 min read</p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight text-foreground md:text-5xl">Boeuf Salad Decorator</h1>
          <p className="mt-4 text-xl leading-relaxed text-[var(--text-secondary)]">
            Decorate a Romanian Christmas salad in 3D, then send it to Mom as a retro holiday card.
          </p>
        </header>

        <figure className="mx-auto mt-12 max-w-[1100px] px-6 md:mt-16">
          <a href={APP} target="_blank" rel="noopener noreferrer" className="group block">
            <Image
              src="/salata-de-boeuf/og.jpg"
              alt="The app: Mom's pantry of jars on the left, a salad on a porcelain plate decorated with a pea and carrot Christmas tree in the middle, and the House Menu with classic salads and the Kitsch-o-meter at 100%, Soviet banquet hall, on the right."
              width={1200}
              height={627}
              priority
              className="h-auto w-full rounded-xl ring-1 ring-black/5 transition-opacity duration-200 group-hover:opacity-90"
            />
          </a>
          <figcaption className="mt-4 text-center text-sm">
            <a
              href={APP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-foreground transition-colors duration-200 hover:text-[var(--text-secondary)]"
            >
              Open the app
              <ArrowUpRight size={14} aria-hidden />
            </a>
          </figcaption>
        </figure>

        <section className="mx-auto mt-16 max-w-2xl px-6 md:mt-20">
          <h2 className={heading}>Why I built it</h2>
          <p className={body}>
            Every Romanian Christmas table has a salată de boeuf, and every mom decorates it like it&apos;s going to a
            wedding. I wanted anyone to make one, and send it home.
          </p>
        </section>

        <section className="mx-auto mt-16 max-w-2xl px-6 md:mt-20">
          <h2 className={heading}>How it plays</h2>
          <ol className="mt-8 flex items-start justify-between gap-2 sm:justify-start sm:gap-6">
            {steps.map((step, i) => (
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
          <p className={`${body} mt-8`}>
            The Kitsch-o-meter rates it from German-tidy to Wedding in Botoșani.
          </p>
        </section>

        <section className="mx-auto mt-16 max-w-2xl px-6 md:mt-20">
          <h2 className={heading}>Or travel to 1986</h2>
          <p className={body}>
            One button takes it back to the 80s family table: queues, ration cards, 2 kg of mayo. Before the salad can
            leave the house, it has to pass the five-year plan.
          </p>
          <div className="mt-8 rounded-lg bg-[#faf6ec] px-6 py-5 font-mono text-sm text-[#3b2a1a]">
            <p className="text-xs tracking-[0.18em] text-[var(--text-tertiary)]">FOOD INSPECTION BULLETIN</p>
            <ul className="mt-3 space-y-1.5">
              {plan.map((rule) => (
                <li key={rule}>☐ {rule}</li>
              ))}
            </ul>
            <span
              aria-hidden
              className="mt-4 inline-block rotate-[-6deg] rounded border-2 border-[#9e1f24] px-2 py-0.5 text-base font-bold tracking-widest text-[#9e1f24] opacity-80"
            >
              APROBAT
            </span>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-2xl px-6 md:mt-20">
          <h2 className={heading}>How I built it</h2>
          <p className={body}>
            A web app in three.js, built with Claude Code, in English and Romanian. The card is a sparkly GIF, made
            right in the browser.
          </p>
        </section>
      </article>

      <Footer />
    </main>
  )
}
