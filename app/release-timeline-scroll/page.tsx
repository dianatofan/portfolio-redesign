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

      {/* Hero image — a cropped screenshot, inset with margins on the gray surface */}
      <section className="bg-[#f4f4f5] pt-28 pb-16 md:pb-20">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="w-full overflow-hidden rounded-t-xl border border-b-0 border-border bg-card shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-1.5 border-b border-border bg-[#f3f3f4] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <div className="mx-auto flex h-6 w-1/2 items-center justify-center rounded border border-border bg-white text-[11px] text-[var(--text-tertiary)]">
                dashboard / releases
              </div>
            </div>
            <div className="relative aspect-[160/63] w-full bg-card">
              <Image
                src="/images/release-timeline-hero.png"
                alt="Release timeline: client releases and events plotted against crash rate and DAU"
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 1400px"
              />
            </div>
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
            player experience, but the information lived across multiple tools.
          </p>
        </div>
      </section>

      {/* Scroll story over a soft moving purple gradient */}
      <section className="relative mt-16 py-20 md:mt-24 md:py-28">
        <MovingGradient />
        <div className="relative mx-auto max-w-[1320px] px-6">
          <ReleaseTimelineScroll />
        </div>
      </section>

      {/* Outcome */}
      <section className="mx-auto max-w-[1100px] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
            Outcome
          </p>
          <p className="text-2xl font-medium leading-snug tracking-tight text-foreground md:text-3xl">
            The final design brought releases, configuration changes, and operational metrics into a
            single workflow, helping teams answer one question faster:{" "}
            <span className="text-[var(--text-secondary)]">What changed?</span>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
