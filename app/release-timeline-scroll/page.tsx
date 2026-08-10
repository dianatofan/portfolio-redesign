import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Footer } from "@/components/footer"
import { MovingGradient } from "@/components/moving-gradient"
import { ReleaseTimelineScroll } from "@/components/release-timeline-scroll"

export const metadata: Metadata = {
  title: "Visualizing release impact across live games - Diana Tofan",
  description:
    "A scroll-driven walkthrough of a release timeline built to answer one question: what changed?",
}

const meta = [
  { label: "Role", values: ["Product Designer"] },
  { label: "Team", values: ["CTO", "Product Manager", "Engineers"] },
  { label: "Tools", values: ["Claude Code", "SVG"] },
]

export default function ReleaseTimelineScrollPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="fixed left-0 right-0 top-0 z-50 bg-white/80 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto grid grid-cols-12 items-center gap-x-6">
          <div className="col-span-6 md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-[var(--text-secondary)]"
            >
              <ChevronLeft size={16} aria-hidden />
              Back
            </Link>
          </div>

          <div className="col-span-6 flex justify-end md:col-span-4 md:col-start-9">
            <Link
              href="/work/liveops-alerting"
              className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-[var(--text-secondary)]"
            >
              Next: LiveOps Alerting
              <ChevronRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero image — matches the LiveOps Alerting page hero dimensions */}
      <section className="pt-28">
        <div className="mx-auto max-w-[1800px] px-6">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-card">
            <Image
              src="/images/release-timeline-hero.png"
              alt="Release timeline: client releases and events plotted against crash rate and DAU"
              fill
              priority
              className="object-cover object-top"
              sizes="100vw"
            />
          </div>
        </div>
      </section>

      {/* Title + meta + intro */}
      <section className="mx-auto max-w-[1100px] px-6 py-12 md:py-16">
        <h1 className="max-w-3xl text-3xl font-medium leading-[1.08] tracking-tight text-foreground md:text-[52px]">
          Visualizing release impact across live games
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
          Building a release timeline to answer one question: what changed?
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
          <h2 className="text-xl font-medium tracking-tight text-foreground md:text-2xl">
            Why a timeline?
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-[var(--text-secondary)]">
            <p>
              On live games, when something breaks the first question is rarely{" "}
              <span className="font-medium text-foreground">why did it happen?</span> It&apos;s{" "}
              <span className="font-medium text-foreground">what changed?</span> A release, experiment,
              configuration update, or backend change could all affect the player experience. That
              information already existed, but it was buried in tables and spread across tools.
              Visual patterns are far easier to spot in a chart.
            </p>
          </div>
        </div>
      </section>

      {/* Scroll story over a soft moving purple gradient */}
      <section className="relative mt-16 py-20 md:mt-24 md:py-28">
        <MovingGradient />
        <div className="relative mx-auto w-full max-w-[2000px] px-6">
          <ReleaseTimelineScroll />
        </div>
      </section>

      {/* What I learned */}
      <section className="mx-auto max-w-[1100px] px-6 pt-20 md:pt-28">
        <div className="max-w-2xl">
          <h2 className="text-xl font-medium tracking-tight text-foreground md:text-2xl">
            What I learned
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-[var(--text-secondary)]">
            <p>
              The hardest part wasn&apos;t designing the chart. It was deciding where it belonged.
            </p>
            <p>Good tools fit into existing workflows instead of creating new ones.</p>
          </div>
        </div>
      </section>

      {/* Outcome */}
      <section className="mx-auto max-w-[1100px] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
            Outcome
          </p>
          <p className="text-2xl font-medium leading-snug tracking-tight text-foreground md:text-3xl">
            A single place to answer one question:{" "}
            <span className="text-[var(--text-secondary)]">What changed?</span>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
