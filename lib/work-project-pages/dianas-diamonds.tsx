import Image from "next/image"
import type { WorkProjectPage } from "./types"
import {
  EditorsNote,
  FigCaption,
  ProblemSolution,
  MarginNote,
  SidebarBox,
  WithMargin,
  csHeading,
  csParagraph,
} from "./shared"
import { GrowthChart } from "@/components/work/growth-chart"
import { LiveGem } from "@/components/work/live-gem"
import { ProductTour, type TourSlide } from "@/components/work/product-tour"
import { CalendarClock, FileDiff, Handshake, SearchX, Undo2, UserCheck } from "lucide-react"

const paragraph = csParagraph
const heading = csHeading
const media = "/images/dianas-diamonds"

/** The three diamond finishes, live and turning, as the status a ticket is in. No cards: the stones sit on the page. */
function StatusBand() {
  return (
    <ol className="grid grid-cols-3 gap-3">
      {(
        [
          ["frosted", "Not started"],
          ["clear", "In progress"],
          ["brilliant", "Ready for review"],
        ] as const
      ).map(([finish, label], i) => (
        <li key={finish} className="flex flex-col items-center gap-2">
          <LiveGem finish={finish} rotateOffset={i * 1.3} className="w-full max-w-[200px]" label={`A ${finish} diamond: ${label}`} />
          <span className="text-[13px] leading-[1.5] text-ink-muted">{label}</span>
        </li>
      ))}
    </ol>
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
  heroCaption: "All 18 prototypes falling into place",
  displayTitle: "Diana's Diamonds",
  subtitle: "Building a prototype library to scale AI-driven design",
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
      {/* The standfirst under the title says the problem; this is the story, with the name's joke in the margin. */}
      <section id="overview">
        <WithMargin
          aside={
            <MarginNote label="Why diamonds?" media={<LiveGem finish="brilliant" className="w-44" />}>
              The name started as a joke: my coworkers said I polish my prototypes like diamonds.
              <span className="mt-5 block border-t border-hairline pt-5 text-[18px] font-medium text-ink">&ldquo;They are actual diamonds!&rdquo;</span>
              <span className="block text-[13px] text-ink-meta">A coworker, on seeing the hub</span>
            </MarginNote>
          }
        >
          <div className="flex flex-col gap-4">
            <p className={paragraph}>
              Every company adopting AI runs into the same problem: prototypes get cheap to make, and
              just as easy to lose.
            </p>
            <p className={paragraph}>
              At Tactile I build prototypes on top of our real source code, so developers can pick them
              up and ship them to production. But I was building a lot, and our internal pipeline
              couldn&apos;t keep up, so I started a tool to bring them all into one place. And it&apos;s
              built to outlive me: when I hand over, a new designer can pick it up in about twenty
              minutes and keep growing the diamonds.
            </p>
            <p className={paragraph}>
              For the business: past work stays findable, PMs catch up in a minute, and developers
              start from the design, not from zero.
            </p>
          </div>
        </WithMargin>
      </section>

      {/* The hairline on top closes the Overview before the problem statement. */}
      <section id="problem" className="border-t border-hairline pt-16">
        {/* The statement is the heading for the evidence below it: before, and what the library does. */}
        <h2 className="max-w-[1100px] text-[36px] font-medium leading-[1.1] tracking-[-0.035em] text-ink text-balance">
          The question isn&apos;t how to make prototypes,{" "}
          it&apos;s where they live once the meeting is over.
        </h2>
        <ProblemSolution
          rows={[
            {
              icon: SearchX,
              problem: "Prototypes got lost",
              detail: "Links lived in Slack and tickets, and cleanups deleted past work. A PM would ask for one from a few months back, and it was gone.",
              answer: "Every prototype lives in one library, so nothing gets deleted to save space.",
            },
            {
              icon: FileDiff,
              problem: "Nothing said what changed",
              detail: "A prototype copies the real app, so the new design was hard to spot.",
              answer: "Each prototype walks you through what changed, step by step.",
            },
            {
              icon: Undo2,
              problem: "Handoff started from zero",
              detail: "Frontenders had to dig the design change out of a separate repo.",
              answer: "Prototypes use the real codebase and design system, so developers get the design as a diff.",
            },
          ]}
        />
      </section>
    </>
  ),
  renderAfterGate: () => (
    <>
      <section
        id="tour"
        className="tour-dark relative left-1/2 w-[calc(100vw-2*var(--gutter))] -translate-x-1/2 rounded-[24px] p-6 sm:p-10 xl:p-12"
      >
        <h2 className={heading}>Take the tour</h2>
        <ProductTour label="Diana's Diamonds, screen by screen" slides={tourSlides} />
      </section>

      <section id="adoption">
        <SidebarBox
          title="How it got adopted"
          items={[
            {
              icon: Handshake,
              title: "Foundations with our backend engineer",
              description: "Together we set up the foundations the library runs on.",
            },
            {
              icon: UserCheck,
              title: "Tested the handover",
              description:
                "The other designer at Tactile added prototypes on his own, just from the published guidelines.",
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
        <EditorsNote
          label="Trade-off"
          title="An AI agent in the browser"
          figure={
            <figure className="flex flex-col gap-2.5">
              <div className="relative aspect-[8/5] overflow-hidden rounded-2xl bg-surface ring-1 ring-black/[0.06]">
                <Image
                  src={`${media}/agent-request.jpg`}
                  alt="The hub's Request a change form: Claude makes the change on a branch of its own"
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 1100px) 55vw, 100vw"
                />
              </div>
              <FigCaption>The request form, before I switched it off.</FigCaption>
            </figure>
          }
        >
          I built a way to add and update prototypes straight from the hub, with an AI agent in the UI.
          Then I switched it off with our backend engineer. The tokens were too expensive, and
          Tactile has only two designers in the whole company. Everyone already uses Claude in the
          terminal.
        </EditorsNote>
      </section>

      <section id="workflow">
        <h2 className={heading}>It keeps itself up to date.</h2>
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,640px)_minmax(0,1fr)] xl:items-center xl:gap-16">
          <div className="flex flex-col gap-4">
            <p className={paragraph}>
              The ticket gets the prototype&apos;s link on its own, and the diamond shows how far along it is.
            </p>
            <p className="text-[18px] leading-[1.6] text-ink-muted text-pretty">
              Six Claude Code skills cover the whole loop, from setting up a laptop to building the design
              for real. Claude can open a pull request, but it can never merge or push to main. Merging is
              always a person&apos;s click.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <StatusBand />
            <p className="text-[13px] leading-[1.5] text-ink-meta text-pretty">
              I designed the stone with Tactile&apos;s 3D artists, cut like a Swarovski crystal so it
              catches light the way a real one does.
            </p>
          </div>
        </div>
      </section>

      <section id="impact">
        <h2 className={heading}>Impact</h2>
        <p className={`${paragraph} mb-10`}>
          Anyone can open and play with my prototypes, so they&apos;re much easier to share with
          stakeholders.
        </p>
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,760px)_minmax(0,1fr)] xl:gap-16">
          <GrowthChart />
          <aside className="flex flex-col gap-6 self-start xl:mt-8">
            <span className="text-[13px] leading-[1.5] text-ink-meta">What I learned</span>
            <ol className="flex flex-col gap-5">
              {[
                "Nobody asked me to solve this, and that's no reason not to. It made my own job simpler, and my coworkers appreciated it.",
                "AI prototypes are worthless if they're not collected in one central place. Scattered, they lose their meaning.",
              ].map((line, i) => (
                <li key={line} className="flex gap-4 border-t border-hairline pt-5 first:border-t-0 first:pt-0">
                  <span className="text-[18px] leading-[1.6] text-brand">{i + 1}</span>
                  <p className="text-[18px] leading-[1.6] text-ink text-pretty">{line}</p>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>
    </>
  ),
}
