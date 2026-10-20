import Image from "next/image"
import type { WorkProjectPage } from "./types"
import {
  IconCards,
  NumberedDecision,
  TerminalSnippet,
  TlDr,
  UnderTheHood,
  csHeading,
  csParagraph,
  csPullQuote,
} from "./shared"
import { GrowthChart } from "@/components/work/growth-chart"
import { ProductTour, type TourSlide } from "@/components/work/product-tour"
import { ArrowRight, CalendarClock, FileDiff, GitPullRequest, Handshake, Link2, SearchX, Undo2, UserCheck } from "lucide-react"

const paragraph = csParagraph
const heading = csHeading
const media = "/images/dianas-diamonds"

/** A cut gem outline; the three finishes stand for a task's status, as the hub's diamonds do. */
function Gem({ finish }: { finish: "frosted" | "clear" | "sparkling" }) {
  // Rendered by the hub itself: the same stone in the To Do, In Progress and In Review finishes.
  const file = finish === "frosted" ? "frosted" : finish === "clear" ? "clear" : "brilliant"
  return (
    <div className="relative aspect-[68/50] w-full overflow-hidden rounded-[4px]">
      <Image
        src={`/images/dianas-diamonds/finish-${file}.webp`}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 30vw, 200px"
      />
    </div>
  )
}

/** The project management loop at a glance: what happens when a pull request opens, and what the diamond says. */
function PmGraphic() {
  const steps = [
    { icon: GitPullRequest, label: "Pull request opens" },
    { icon: Link2, label: "Link added to the task" },
  ]
  return (
    <div className="mt-8 rounded-xl bg-background p-6 md:p-8">
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
        {steps.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 md:contents">
            <div className="flex flex-1 items-center gap-3 rounded-lg bg-card p-4 ring-1 ring-black/5">
              <Icon size={18} className="shrink-0 text-foreground" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">{label}</span>
            </div>
            <ArrowRight size={18} className="hidden shrink-0 text-[var(--text-tertiary)] md:block" aria-hidden="true" />
          </div>
        ))}
        <div className="flex flex-1 items-center gap-2 rounded-lg bg-card p-4 ring-1 ring-black/5">
          <span className="rounded-full bg-background px-2.5 py-0.5 text-xs font-medium text-[var(--text-secondary)]">To Do</span>
          <ArrowRight size={14} className="text-[var(--text-tertiary)]" aria-hidden="true" />
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-foreground">In Progress</span>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-4">
        {(
          [
            ["frosted", "Not started"],
            ["clear", "In progress"],
            ["sparkling", "Ready for review"],
          ] as const
        ).map(([finish, label]) => (
          <div key={finish} className="flex flex-col items-center gap-3 rounded-lg bg-card p-5 ring-1 ring-black/5">
            <Gem finish={finish} />
            <span className="text-center text-sm text-[var(--text-secondary)]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// The numbers in the stat band under the hero, public above the password gate.
const impact = [
  {
    title: "18 prototypes in the first 5 weeks, and growing",
    description: "Every prototype lives in one library, so nothing gets deleted to save space.",
  },
  {
    title: "1 deploy pipeline instead of 18",
    description: "One pipeline for the whole library, not one per prototype.",
  },
  {
    title: "240+ prototypes, tested to scale",
    description: "The field was stress-tested with more than 240 diamonds and stays smooth.",
  },
]

/*
 * The tour, one screen per feature. Each note marks a region (top-left, width,
 * height) as fractions of the 16:10 frame; every recording is 16:10, so the
 * regions land on the same controls at any size.
 */
const tourSlides: TourSlide[] = [
  {
    tab: "Field",
    title: "One home for every prototype.",
    text: "Each of the 18 prototypes is a 3D diamond that falls into place under real gravity.",
    video: `${media}/field-18.webm`,
    poster: `${media}/field-18-poster.jpg`,
    alt: "All 18 prototypes fall as diamonds and settle on the floor of the field",
    notes: [
      { x: 0.03, y: 0.68, w: 0.94, h: 0.31, label: "Every prototype is a diamond" },
      { x: 0.1, y: 0.158, w: 0.183, h: 0.04, label: "Search by name or ticket" },
      { x: 0.287, y: 0.158, w: 0.126, h: 0.04, label: "Filter by status" },
      { x: 0.876, y: 0.024, w: 0.108, h: 0.04, label: "Switch to the grid" },
    ],
  },
  {
    tab: "Names",
    title: "Light that leads to a name.",
    text: "Flip Show names, and a beam runs from each diamond up to its name.",
    video: `${media}/field-names.mp4`,
    poster: `${media}/field-names-poster.jpg`,
    alt: "Show names on: light beams rise from each diamond to its name",
    notes: [{ x: 0.05, y: 0.25, w: 0.9, h: 0.45, label: "Hover a name and its beam lights up" }],
  },
  {
    tab: "Preview",
    title: "Open one. Then the next.",
    text: "Click a diamond to preview it, and step through them like a gallery.",
    video: `${media}/field-open.mp4`,
    poster: `${media}/field-open-poster.jpg`,
    alt: "Opening a diamond as a preview, then stepping to the next one",
    notes: [{ x: 0.05, y: 0.6, w: 0.9, h: 0.38, label: "Click a diamond to open it" }],
  },
  {
    tab: "Grid",
    title: "The grid is for finding.",
    text: "Cards with a thumbnail, one line, and each ticket's status.",
    video: `${media}/grid-find.mp4`,
    poster: `${media}/grid-find-poster.jpg`,
    alt: "The grid view: prototype cards with search, filters and status",
    notes: [
      { x: 0.28, y: 0.143, w: 0.075, h: 0.035, label: "Search" },
      { x: 0.555, y: 0.552, w: 0.1, h: 0.035, label: "Each ticket's status" },
      { x: 0.52, y: 0.142, w: 0.1, h: 0.037, label: "Newest first" },
    ],
  },
  {
    tab: "What's new",
    title: "The design explains itself.",
    text: "Each prototype walks you through what changed, step by step.",
    video: `${media}/walkthrough.mp4`,
    poster: `${media}/walkthrough-poster.jpg`,
    alt: "What's new: clicking a step highlights that part of the live prototype",
    notes: [
      { x: 0.775, y: 0.49, w: 0.215, h: 0.5, label: "Click a step" },
      { x: 0.015, y: 0.1, w: 0.74, h: 0.87, label: "The live prototype jumps to it" },
    ],
  },
  {
    tab: "Tickets",
    title: "Every ticket. Every version.",
    text: "A prototype links all its tickets, and you can step back to how it looked at each one.",
    video: `${media}/tickets-history.webm`,
    poster: `${media}/tickets-history-poster.jpg`,
    alt: "Stepping back to the earlier ticket's version of a prototype, then forward again",
    notes: [
      { x: 0.75, y: 0.087, w: 0.22, h: 0.04, label: "Every linked ticket" },
      { x: 0.905, y: 0.685, w: 0.08, h: 0.035, label: "Step to an earlier ticket" },
      { x: 0.016, y: 0.098, w: 0.705, h: 0.876, label: "The frame loads that version" },
    ],
  },
  {
    tab: "Dark mode",
    title: "Dark mode.",
    text: "The field and the grid, both in dark. It follows your system by default.",
    video: `${media}/dark-mode.webm`,
    poster: `${media}/dark-mode-poster.jpg`,
    alt: "Switching the hub to dark mode, then turning on Show names",
    notes: [{ x: 0.848, y: 0.024, w: 0.026, h: 0.04, label: "Theme switch" }],
  },
  {
    tab: "Scale",
    title: "Built to scale. Tested with 240+.",
    text: "A library only grows, so the field had to stay fast with hundreds of diamonds.",
    video: `${media}/field-drop.mp4`,
    poster: `${media}/field-drop-poster.jpg`,
    alt: "A stress test: 240 diamonds fall and settle into a pile",
    notes: [{ x: 0.03, y: 0.3, w: 0.94, h: 0.68, label: "240+ diamonds, still smooth" }],
  },
]


export const dianasDiamondsPage: WorkProjectPage = {
  highlights: impact,
  heroImage: "/images/dianas-diamonds/hero-fall-poster.jpg",
  heroVideo: "/images/dianas-diamonds/hero-fall.webm",
  heroCaption: "Diana's Diamonds: all 18 prototypes falling into place",
  displayTitle: "Building a prototype library to scale AI-driven design",
  description:
    "A scalable catalogue for AI-built prototypes at Tactile: one place to find them, see what changed, and ship them to production.",
  meta: [
    { label: "Role", values: ["Product Designer", "Design Engineer"] },
    { label: "Duration", values: ["September–October 2026"] },
    { label: "Used by", values: ["Designers", "PMs", "Frontenders"] },
    {
      label: "Skills",
      values: ["Prototyping with AI", "Design Ops", "Developer Handoff"],
    },
  ],
  sections: [
    { id: "overview", title: "Overview" },
    { id: "problem", title: "Problem" },
    { id: "tour", title: "The tour" },
    { id: "adoption", title: "Adoption" },
    { id: "cut", title: "What I cut" },
    { id: "workflow", title: "Workflow" },
    { id: "impact", title: "Impact" },
  ],
  renderBeforeGate: () => (
    <>
      <section id="overview">
        <h2 className={heading}>Overview</h2>
        <TlDr>
          <p>
            Every company adopting AI runs into the same problem: prototypes get cheap to make, and
            just as easy to lose.
          </p>
          <p>
            At Tactile I build prototypes on top of our real source code, so developers can pick them
            up and ship them to production. But I was building a lot, and our internal pipeline
            couldn&apos;t keep up, so I started a tool to bring them all into one place. And it&apos;s
            built to outlive me: when I hand over, a new designer can pick it up in about twenty
            minutes and keep growing the diamonds.
          </p>
          <p>
            The name started as a joke: my coworkers said I polish my prototypes like diamonds. So
            I took it literally, and every prototype in the hub is a 3D diamond.
          </p>
          <p>
            For the business: past work stays findable, PMs catch up in a minute, and developers
            start from the design, not from zero.
          </p>
        </TlDr>
      </section>

      <section id="problem">
        <h2 className={heading}>Problem</h2>
        <p className={paragraph}>
          With one repository and deploy per prototype, cleanups deleted past work. Then a PM would
          ask for one from a few months back, and it was gone. Any team designing with
          AI hits this: the question isn&apos;t how to make prototypes, it&apos;s where they live
          once the meeting is over.
        </p>
        <IconCards
          items={[
            {
              icon: SearchX,
              title: "Prototypes got lost",
              description: "Links lived in Slack and tickets, and cleanups deleted past work.",
            },
            {
              icon: FileDiff,
              title: "Nothing said what changed",
              description: "A prototype copies the real app, so the new design was hard to spot.",
            },
            {
              icon: Undo2,
              title: "Handoff started from zero",
              description: "Frontenders had to dig the design change out of a separate repo.",
            },
          ]}
        />
        <div className={csPullQuote}>
          <p>
            One permanent home where anyone can find a prototype, see what it changes, and take it
            to production, whether there are a dozen or a hundred.
          </p>
        </div>
      </section>
    </>
  ),
  renderAfterGate: () => (
    <>
      <section
        id="tour"
        className="tour-dark w-[calc(100vw-2*var(--gutter))] max-w-none rounded-[24px] p-6 sm:p-10 xl:p-12"
      >
        <h2 className={heading}>Take the tour</h2>
        <ProductTour label="Diana's Diamonds, screen by screen" slides={tourSlides} />
      </section>

      <section id="adoption">
        <h2 className={heading}>Getting it adopted</h2>
        <IconCards
          items={[
            {
              icon: Handshake,
              title: "Foundations with Alvaro",
              description: "I worked with Alvaro, our engineer, to set the foundations the library runs on.",
            },
            {
              icon: UserCheck,
              title: "Tested the handover",
              description: "I user tested it with the other designer at Tactile, to check he can add new prototypes on his own once I've left.",
            },
            {
              icon: CalendarClock,
              title: "Shared every week",
              description: "I share the library with stakeholders and users every week. What's new is the part they like most.",
            },
          ]}
        />
      </section>

      <section id="cut">
        <h2 className={heading}>What I cut: an AI agent in the browser</h2>
        <p className={paragraph}>
          I built a way to add and update prototypes straight from the hub, with an AI agent in the
          UI. Then I switched it off with our infrastructure engineer. The tokens were too
          expensive, and Tactile has only two designers in the whole company. Everyone already uses
          Claude in the terminal.
        </p>
      </section>

      <section id="workflow">
        <h2 className={heading}>It keeps itself up to date.</h2>
        <p className={paragraph}>
          The ticket gets the prototype&apos;s link on its own, and the diamond shows how far along it is.
        </p>
        <PmGraphic />
        <UnderTheHood>
          Six Claude Code skills cover the whole loop, from setting up a laptop to building the design
          for real. Claude can open a pull request, but it can never merge or push to main. Merging is
          always a person&apos;s click.
        </UnderTheHood>
        <TerminalSnippet
          title="Claude Code"
          lines={[
            { kind: "comment", text: "Designer" },
            { kind: "prompt", text: "Start a prototype from the A/B tests page." },
            { kind: "prompt", text: "Publish holdout-groups." },
            { kind: "out", text: " " },
            { kind: "comment", text: "Developer" },
            { kind: "prompt", text: "Build holdout-groups in the real Dashboard." },
          ]}
        />
      </section>

      <section id="impact">
        <h2 className={heading}>Impact</h2>
        <p className={paragraph}>
          In five weeks: 18 prototypes in one library, and one deploy pipeline instead of one per
          prototype.
        </p>
        <GrowthChart />
      </section>
    </>
  ),
}
