import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Footer } from "@/components/footer"
import { ReleaseTimelineScroll } from "@/components/release-timeline-scroll"

export const metadata: Metadata = {
  title: "Visualizing release impact across live games - Diana Tofan",
  description:
    "A scroll-driven walkthrough of a release timeline built to answer one question: what changed?",
}

const meta = [
  { label: "Role", values: ["Product Designer"] },
  { label: "Team", values: ["CTO", "Product Manager", "Engineers"] },
]

export default function ReleaseTimelineScrollPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="fixed left-0 right-0 top-0 z-50 bg-white/80 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto max-w-[1100px]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-[var(--text-secondary)]"
          >
            <ChevronLeft size={16} aria-hidden />
            Back
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-[1100px] px-6 pt-32 md:pt-40">
        <h1 className="max-w-3xl text-3xl font-medium leading-[1.08] tracking-tight text-foreground md:text-[52px]">
          Visualizing release impact across live games
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
          Building a release timeline to answer one question: what changed?
        </p>

        <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6 border-y border-border py-6">
          {meta.map((item) => (
            <div key={item.label}>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                {item.label}
              </p>
              <p className="text-sm font-medium text-foreground">{item.values.join(", ")}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 max-w-2xl space-y-4 text-base leading-relaxed text-[var(--text-secondary)]">
          <p>
            Working on live games taught me that when something breaks, the first question is rarely
            why.
          </p>
          <p>
            It&apos;s usually: <span className="font-medium text-foreground">What changed?</span>
          </p>
          <p>
            A release, configuration update, experiment rollout, or backend change could all impact
            player experience — but the information lived across multiple tools.
          </p>
        </div>
      </section>

      {/* Scroll story */}
      <section className="mx-auto mt-16 max-w-[1100px] px-6 md:mt-24">
        <ReleaseTimelineScroll />
      </section>

      {/* Outcome */}
      <section className="mx-auto max-w-[1100px] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
            Outcome
          </p>
          <p className="text-2xl font-medium leading-snug tracking-tight text-foreground md:text-3xl">
            The final design brought releases, configuration changes, and operational metrics into a
            single workflow — helping teams answer one question faster:{" "}
            <span className="text-[var(--text-secondary)]">What changed?</span>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
