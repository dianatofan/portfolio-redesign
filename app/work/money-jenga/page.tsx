import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Footer } from "@/components/footer"
import { MovingGradient } from "@/components/moving-gradient"
import { MoneyJengaScroll } from "@/components/work/money-jenga-scroll"
import { MoneyJengaPaceChart } from "@/components/work/money-jenga-pace-chart"

// A static route, like /work/release-timeline: the scroll story needs its own
// page layout, so it takes precedence over the dynamic [slug] template.

export const metadata: Metadata = {
  title: "Money Jenga - Diana Tofan",
  description:
    "An iPhone budget app where every purchase pulls a block out of a tower of cash. No bank details needed. Built in SwiftUI with Claude Code.",
}

const meta = [
  { label: "Role", values: ["Designer", "Developer"] },
  { label: "Type", values: ["Side project"] },
  { label: "Tools", values: ["SwiftUI", "SpriteKit", "Claude Code"] },
]

export default function MoneyJengaPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="fixed left-0 right-0 top-0 z-50 bg-white/80 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto grid grid-cols-12 items-center gap-x-6">
          <div className="col-span-6 md:col-span-2">
            <Link
              href="/#built-in-code"
              className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-[var(--text-secondary)]"
            >
              <ChevronLeft size={16} aria-hidden />
              Back
            </Link>
          </div>
          <div className="col-span-6 flex justify-end md:col-span-4 md:col-start-9">
            <Link
              href="/work/golden-goose-museum"
              className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-[var(--text-secondary)]"
            >
              Next: Golden Goose Digital Museum
              <ChevronRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      <section className="pt-28">
        <div className="mx-auto max-w-[1800px] px-6">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-card">
            <Image
              src="/images/money-jenga-hero.webp"
              alt="Four Money Jenga screens: setting the budget, a full tower of cash, 7.600 kr left, and a shaky tower with 1.100 kr left"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-12 md:py-16">
        <p className="mb-4 text-sm text-[var(--text-tertiary)]">October 2026 · 2 min read</p>
        <h1 className="max-w-3xl text-3xl font-medium leading-[1.08] tracking-tight text-foreground md:text-[52px]">
          Money Jenga
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
          A budget app where every purchase pulls a block out of a tower of cash.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-8 border-b border-border pb-12 md:grid-cols-4">
          {meta.map((item) => (
            <div key={item.label}>
              <p className="mb-2 text-sm font-medium text-[var(--text-tertiary)]">{item.label}</p>
              <p className="text-base font-medium text-foreground">
                {item.values.map((value, index) => (
                  <span key={`${item.label}-${value}`}>
                    {index > 0 && <br />}
                    {value}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 max-w-2xl">
          <h2 className="text-xl font-medium tracking-tight text-foreground md:text-2xl">Why I made it</h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-[var(--text-secondary)]">
            <p>
              I like splurging on clothes and other things, so I wanted a way to manage my money. Every
              budgeting app I found wanted my{" "}
              <span className="font-medium text-foreground">bank account details</span>, and I didn&apos;t want
              to share them.
            </p>
            <p>
              So I made my own: put in <span className="font-medium text-foreground">one sum a month</span>, take
              money out of it as I spend, and make it fun.
            </p>
          </div>
        </div>
      </section>

      <section className="relative mt-16 py-20 md:mt-24 md:py-28">
        <MovingGradient />
        <div className="relative mx-auto w-full max-w-[2000px] px-6">
          <MoneyJengaScroll />
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 pt-20 md:pt-28">
        <div className="max-w-2xl">
          <h2 className="text-xl font-medium tracking-tight text-foreground md:text-2xl">Staying on pace</h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-[var(--text-secondary)]">
            <p>
              The app spreads the budget evenly over the month. Spend faster than that and the tower shakes
              harder. Stay under it and the cat under the table keeps sleeping.
            </p>
          </div>
        </div>
        <div className="mt-8 max-w-3xl">
          <MoneyJengaPaceChart />
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 pt-20 md:pt-28">
        <div className="grid max-w-3xl grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-medium tracking-tight text-foreground md:text-2xl">Apple Pay, kept private</h2>
            <p className="mt-5 text-base leading-relaxed text-[var(--text-secondary)]">
              A Shortcuts automation logs every Apple Pay payment on its own. Card numbers are masked before
              anything is saved, and the data stays in my own iCloud.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-medium tracking-tight text-foreground md:text-2xl">Built in two days</h2>
            <p className="mt-5 text-base leading-relaxed text-[var(--text-secondary)]">
              I wrote a spec and an HTML prototype, then had Claude Code build it natively in SwiftUI and
              SpriteKit. It runs on my iPhone, and isn&apos;t on the App Store yet.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
            Outcome
          </p>
          <p className="text-2xl font-medium leading-snug tracking-tight text-foreground md:text-3xl">
            One sum a month, a tower that shows what&apos;s left,{" "}
            <span className="text-[var(--text-secondary)]">and no bank details.</span>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
