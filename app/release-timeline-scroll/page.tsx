import type { Metadata } from "next"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LabHero, LabIntro, LabSection, NextInLab, labBody, labContainer } from "@/components/work/lab-chrome"
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
    <main className="min-h-screen bg-white text-ink">
      <Header />

      <LabIntro
        title="Visualizing release impact across live games"
        standfirst="Building a release timeline to answer one question: what changed?"
      />

      <LabHero
        specs={[
          ...meta.map((item) => ({ label: item.label, value: item.values.join(", ") })),
          { label: "Year", value: "2026" },
        ]}
      >
        <div className="relative aspect-[2/1] w-full bg-surface">
          <Image
            src="/images/release-timeline-hero.webp"
            alt="Release timeline: client releases and events plotted against crash rate and DAU"
            fill
            priority
            className="object-cover object-top"
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
      </LabHero>

      <LabSection label="Why a timeline?">
        <p className={labBody}>
          On live games, when something breaks the first question is rarely{" "}
          <span className="font-medium text-ink">why did it happen?</span> It&apos;s{" "}
          <span className="font-medium text-ink">what changed?</span> A release, experiment,
          configuration update, or backend change could all affect the player experience. That
          information already existed, but it was buried in tables and spread across tools. Visual
          patterns are far easier to spot in a chart.
        </p>
      </LabSection>

      {/* Scroll story over a soft moving purple gradient */}
      <section className="relative mt-[72px] py-20 md:py-28">
        <MovingGradient />
        <div className="relative mx-auto w-full max-w-[2000px] px-gutter">
          <ReleaseTimelineScroll />
        </div>
      </section>

      <LabSection label="What I learned">
        <div className={`space-y-4 ${labBody}`}>
          <p>
            The hardest part wasn&apos;t designing the chart. It was deciding where it belonged.
          </p>
          <p>Good tools fit into existing workflows instead of creating new ones.</p>
        </div>
      </LabSection>

      {/* Outcome, as a pull quote between rules */}
      <section className={`${labContainer} pt-[72px]`}>
        <blockquote className="mx-auto max-w-[860px] border-y border-ink py-8 text-center text-[clamp(24px,2.6vw,36px)] font-medium leading-[1.2] tracking-[-0.03em] text-ink text-balance">
          A single place to answer one question:{" "}
          <span className="text-ink-muted">What changed?</span>
        </blockquote>
      </section>

      <NextInLab
        label="Next case study"
        title="LiveOps Alerting"
        href="/work/liveops-alerting"
        image="/images/project-liveops.webp"
      />

      <Footer />
    </main>
  )
}
