import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PrototypeDeck } from "@/components/prototypes/prototype-deck"

export const metadata: Metadata = {
  title: "Exploring Product Directions at Google Maps - Diana Tofan",
  description:
    "A swipeable deck of Google Maps and Search prototypes — the product questions behind each one, the interaction I explored, and what happened after the review.",
}

const meta = [
  { label: "Role", values: ["UX Engineer"] },
  { label: "Company", values: ["Google"] },
  { label: "Team", values: ["Designers", "PMs", "Engineers"] },
  { label: "Skills", values: ["Prototyping", "Interaction Design"] },
]

export default function GoogleMapsPrototypesPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="fixed left-0 right-0 top-0 z-50 bg-white/80 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto grid grid-cols-12 items-center gap-x-6">
          <div className="col-span-6 md:col-span-2">
            <Link
              href="/#fun"
              className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-[var(--text-secondary)]"
            >
              <ChevronLeft size={16} aria-hidden />
              Back
            </Link>
          </div>

          <div className="col-span-6 flex justify-end md:col-span-4 md:col-start-9">
            <Link
              href="/work/release-timeline"
              className="flex items-center gap-2 text-sm font-medium text-foreground transition-colors duration-200 hover:text-[var(--text-secondary)]"
            >
              Next: Release Timeline
              <ChevronRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      {/* Title — same layout as the case study pages */}
      <div className="mx-auto max-w-[1200px] px-6 pt-28 md:pt-32">
        <section className="max-w-4xl">
          <h1 className="mb-12 text-3xl font-medium leading-[1.08] tracking-tight text-foreground md:text-[48px] lg:text-[56px]">
            Exploring Product Directions at Google
          </h1>

          <div className="grid grid-cols-2 gap-8 border-b border-border pb-12 md:grid-cols-4">
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

          <div className="mt-12 max-w-3xl space-y-4 text-base leading-relaxed text-[var(--text-secondary)]">
            <p>
              As a UX Engineer on Google Travel, I built dozens of rapid prototypes to help teams
              explore new product directions, validate assumptions, and make decisions faster.
            </p>
            <p>
              Many of these explorations went through multiple rounds of iteration before reaching a
              final concept. Some influenced production experiences, while others helped teams
              evaluate tradeoffs and decide what not to build.
            </p>
            <p>The examples below are a small selection of the work and show some final concepts.</p>
          </div>
        </section>
      </div>

      {/* Full-bleed gradient surface with the centered deck */}
      <section
        className="relative mt-16 w-full overflow-hidden py-16 md:mt-20 md:py-24"
        style={{
          background:
            "radial-gradient(70% 60% at 18% 8%, rgba(177,158,239,0.30), transparent 60%), radial-gradient(60% 60% at 88% 92%, rgba(129,140,248,0.22), transparent 60%), linear-gradient(180deg, #f5f3fc 0%, #f7f7fb 100%)",
        }}
      >
        {/* Soft top + bottom fade so the band blends into the white page */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent"
        />
        <div className="relative mx-auto max-w-[560px] px-6">
          <PrototypeDeck />
        </div>
      </section>
    </main>
  )
}
