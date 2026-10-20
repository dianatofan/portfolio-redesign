import Image from "next/image"
import type { ReactNode } from "react"
import type { WorkProjectPage } from "./types"
import { BeforeAfter } from "@/components/work/cs3/before-after"
import { GrowthChart } from "@/components/work/growth-chart"
import { LiveGem } from "@/components/work/live-gem"
import { ProductTour, type TourSlide } from "@/components/work/product-tour"

/*
 * Diana's Diamonds, laid out as Case Study v3 (case_study_v3_handoff): copy,
 * order, spacing and type sizes from that file. The page template's v3 layout
 * draws the hero, title block and stats; this file draws the body.
 */

const media = "/images/dianas-diamonds"
// Case Study v3's body text colour.
const body = "text-[18px] leading-[1.6] text-[#3d3c44] text-pretty"

/** The three diamond finishes, live and turning, each on a square card, as the status a ticket is in. */
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
        <li key={finish} className="flex flex-col gap-2">
          <div className="grid aspect-square place-items-center overflow-hidden rounded-[14px] bg-[#f1f2f4]">
            <LiveGem finish={finish} rotateOffset={i * 1.3} className="w-[78%]" label={`A ${finish} diamond: ${label}`} />
          </div>
          <span className="text-[13px] text-ink-muted">{label}</span>
        </li>
      ))}
    </ol>
  )
}

/** The row that opens each section: its name over an ink rule. */
function SectionHead({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between border-b border-ink pb-4 text-[15px]">
      <span className="font-medium">{children}</span>
    </div>
  )
}

const problems = [
  {
    t: "Prototypes got lost",
    b: "Links lived in Slack and tickets, and cleanups deleted past work.",
    a: "Every prototype lives in one library, so nothing gets deleted to save space.",
  },
  {
    t: "Nothing said what changed",
    b: "A prototype copies the real app, so the new design was hard to spot.",
    a: "Each prototype walks you through what changed, step by step.",
  },
  {
    t: "Handoff started from zero",
    b: "Frontenders had to dig the design change out of a separate repo.",
    a: "Prototypes use the real codebase and design system, so developers get the design as a diff.",
  },
]

const decisions: Array<{ t: string; why: string; img?: { src: string; alt: string; cap: string } }> = [
  {
    t: "Claude in the terminal over an AI agent in the browser.",
    why: "I built a way to add and update prototypes straight from the hub, with an AI agent in the UI. Then I switched it off with our backend engineer: the tokens were too expensive, and at our team size a terminal workflow everyone already used beat a new UI.",
    img: {
      src: `${media}/agent-request.jpg`,
      alt: "The hub's Request a change form: Claude makes the change on a branch of its own",
      cap: "The in-browser agent, before it was retired.",
    },
  },
  {
    t: "A details page per prototype, not just a link.",
    why: "The brief was a list of links that redirect straight to each prototype. I pushed for a details page instead: what changed, its ticket and its status, so PMs and developers get the context before they click through. It turned out to be the part people didn't know they needed, especially the What's changed section and the ticket history.",
    img: {
      src: `${media}/ticket-latest.jpg`,
      alt: "A prototype's details page with What's new, its tickets and status",
      cap: "A prototype's details page: what changed, ticket history and status.",
    },
  },
  {
    t: "People merge, not AI.",
    why: "Claude can open a pull request, but it can never merge or push to main. Every change that reaches production is a person's click.",
  },
  {
    t: "Guidelines that survive a handover.",
    why: "I tested them on the other designer at Tactile. He added prototypes on his own, just from the published guidelines, and PMs and other teams started using it too.",
  },
]

const lessons = [
  "Nobody asked me to build this. People started using it because it made their work easier, not just mine.",
  "AI prototypes are worthless if they're not collected in one place. Scattered, they lose their meaning.",
]

// The numbers in the stat band under the title.
const impact = [
  { title: "18 prototypes in the first 6 weeks, and growing", description: "Every prototype lives in one library." },
  { title: "1 deploy pipeline instead of 18", description: "One pipeline for the whole library, not one per prototype." },
  { title: "2x faster handoff to developers", description: "Developers start from the design as a diff." },
]

/*
 * The tour, one screen per feature, with Case Study v3's headlines, lines and
 * pin notes. Each pin is its target's centre, in percent of the 16:10
 * recording; the hand-drawn ring, arrow and label are placed from it. Positions were
 * measured on the recordings where the control is on screen; the ones marked
 * TODO are v3's placeholders, for the parts that only appear mid-clip.
 */
const tourSlides: TourSlide[] = [
  {
    tab: "Field",
    title: "Every prototype, one field.",
    text: "Every prototype as a diamond in one field.",
    video: `${media}/field-18.webm`,
    poster: `${media}/field-18-poster.jpg`,
    alt: "All 18 prototypes fall as diamonds and settle on the floor of the field",
    pins: [
      { x: 30, y: 82, label: "Each diamond is one prototype." },
      { x: 93.1, y: 4.5, label: "Switch between Field and Grid." },
    ],
  },
  {
    tab: "Names",
    title: "Find it by name.",
    text: "Toggle names to scan the library fast.",
    video: `${media}/field-names.mp4`,
    poster: `${media}/field-names-poster.jpg`,
    alt: "Show names on: light beams rise from each diamond to its name",
    pins: [
      { x: 31.8, y: 16, label: "Search by name or ticket." },
      { x: 55.3, y: 15.9, label: "Show names on the diamonds." },
    ],
  },
  {
    tab: "Preview",
    title: "Open one. Then the next.",
    text: "Open one, then the next. Step through them like a gallery.",
    video: `${media}/field-open.mp4`,
    poster: `${media}/field-open-poster.jpg`,
    alt: "Opening a diamond as a preview, then stepping to the next one",
    pins: [
      // TODO(Diana): placeholder positions from v3; the preview opens mid-clip.
      { x: 50, y: 14, label: "Open the live prototype or its details." },
      { x: 18, y: 88, label: "Step to the previous or next one, like a gallery." },
    ],
  },
  {
    tab: "Grid",
    title: "Prefer a list?",
    text: "The same library as a plain grid.",
    video: `${media}/grid-find.mp4`,
    poster: `${media}/grid-find-poster.jpg`,
    alt: "The grid view: prototype cards with search, filters and status",
    pins: [
      { x: 43.8, y: 15.9, label: "Filter by area and status." },
      { x: 60.5, y: 57, label: "Every card shows its status." },
    ],
  },
  {
    tab: "What's new",
    title: "See what changed.",
    text: "Each prototype walks you through what changed, step by step.",
    video: `${media}/walkthrough.mp4`,
    poster: `${media}/walkthrough-poster.jpg`,
    alt: "What's new: clicking a step highlights that part of the live prototype",
    pins: [
      // The What's new list, labelled from the dimmed left side so it covers no text.
      { x: 80, y: 53.5, label: "A guided walkthrough of what changed.", lx: 60, ly: 30 },
      // The walkthrough popover's Next button, inside the prototype.
      { x: 38.5, y: 71.5, label: "Step through it change by change.", lx: 18, ly: 86 },
    ],
  },
  {
    tab: "Tickets",
    title: "Linked to the work.",
    text: "Every diamond links to its ticket, and updates it.",
    video: `${media}/tickets-history.webm`,
    poster: `${media}/tickets-history-poster.jpg`,
    alt: "Stepping back to the earlier ticket's version of a prototype, then forward again",
    pins: [
      { x: 85, y: 10.7, label: "The ticket link updates on its own." },
      { x: 84, y: 74.5, label: "Status comes from the ticket." },
    ],
  },
  {
    tab: "Dark mode",
    title: "Easy on the eyes.",
    text: "The same library in a dark theme.",
    video: `${media}/dark-mode.webm`,
    poster: `${media}/dark-mode-poster.jpg`,
    alt: "Switching the hub to dark mode, then the grid in dark",
    dark: true,
    pins: [{ x: 86.1, y: 4.5, label: "One toggle for dark mode." }],
  },
  {
    tab: "Scale",
    title: "Built to grow.",
    text: "Built to keep growing past 18.",
    video: `${media}/field-drop.mp4`,
    poster: `${media}/field-drop-poster.jpg`,
    alt: "A stress test: 240 diamonds fall and settle into a pile",
    pins: [{ x: 50, y: 84, label: "The field keeps room for more diamonds.", ring: false }],
  },
]


export const dianasDiamondsPage: WorkProjectPage = {
  layout: "v3",
  highlights: impact,
  heroImage: `${media}/hero-fall-poster.jpg`,
  heroVideo: `${media}/hero-fall.webm`,
  heroCaptionLabel: "Why diamonds?",
  heroCaption:
    "It started as a joke: my coworkers said I polish my prototypes like diamonds. So I took it literally.",
  displayTitle: "Diana's Diamonds",
  subtitle: "Building a prototype library to scale AI-driven design.",
  description:
    "A scalable catalogue for AI-built prototypes at Tactile: one place to find them, see what changed, and ship them to production.",
  meta: [
    { label: "Role", values: ["Lead Designer", "Design Engineer"] },
    { label: "Timeline", values: ["September–October 2026"] },
    { label: "Used by", values: ["Designers, PMs, Frontenders"] },
    { label: "Skills", values: ["Prototyping with AI", "Design Ops", "Developer handoff"] },
  ],
  sections: [
    { id: "overview", title: "Overview" },
    { id: "problem", title: "Problem" },
    { id: "tool", title: "The tool" },
    { id: "decisions", title: "Decisions" },
    { id: "impact", title: "Impact" },
  ],
  // Every section keeps its content in one wrapper, so the template's section
  // split (case-study-sections) leaves the order as it is.
  renderBeforeGate: () => (
    <>
      <section id="overview">
        <div className="grid grid-cols-12 gap-6">
          <p className="col-span-12 m-0 text-[clamp(28px,2.6vw,36px)] font-medium leading-[1.15] tracking-[-0.025em] text-balance xl:col-span-5">
            Every company adopting AI runs into the same problem: prototypes get cheap to make, and just as easy to lose.
          </p>
          <div className="col-span-12 flex flex-col gap-5 xl:col-span-6 xl:col-start-7">
            <p className={`m-0 ${body}`}>
              At Tactile I build prototypes on our real source code, so developers can ship them. They were becoming a
              team asset with nowhere to live, so I proposed one library and built it. Past work stays findable, PMs
              catch up in a minute, and developers start from the design, not from zero.
            </p>
          </div>
        </div>
      </section>

      <section id="problem">
        <div>
          <SectionHead>Problem</SectionHead>
          <h2 className="my-10 max-w-[900px] text-[clamp(32px,3.4vw,48px)] font-medium leading-[1.08] tracking-[-0.035em] text-balance">
            The question isn&apos;t how to make prototypes, it&apos;s where they live once the meeting is over.
          </h2>
          <div className="hidden grid-cols-12 gap-6 pb-3 text-[13px] text-ink-meta min-[720px]:grid">
            <span className="col-span-6">Before</span>
            <span className="col-span-6">With the library</span>
          </div>
          {problems.map((p) => (
            <div key={p.t} className="grid grid-cols-12 items-baseline gap-x-6 gap-y-2 border-t border-hairline py-5">
              <div className="col-span-12 flex flex-col gap-1 min-[720px]:col-span-5">
                <span className="text-[18px] font-medium">{p.t}</span>
                <span className="text-[15px] leading-[1.5] text-ink-muted">{p.b}</span>
              </div>
              <span aria-hidden="true" className="hidden text-[15px] text-ink-meta min-[720px]:col-span-1 min-[720px]:block">
                →
              </span>
              <span className="col-span-12 text-[18px] leading-[1.5] min-[720px]:col-span-6">{p.a}</span>
            </div>
          ))}
          <BeforeAfter />
        </div>
      </section>
    </>
  ),
  renderAfterGate: () => (
    <>
      <section id="tool">
        <div>
          <SectionHead>The tool</SectionHead>
          {/* The tour breaks out of the column to the header's edges, like Back and Next. */}
          <div className="relative left-1/2 mt-10 w-[calc(100vw-2*var(--gutter))] -translate-x-1/2">
            <ProductTour label="Diana's Diamonds, screen by screen" slides={tourSlides} />
          </div>
          <div className="grid grid-cols-12 items-start gap-6 pt-16">
            <div className="col-span-12 flex flex-col gap-4 xl:col-span-5">
              <h3 className="m-0 text-[24px] font-medium tracking-[-0.015em]">It keeps itself up to date.</h3>
              <p className={`m-0 ${body}`}>
                Every time a prototype changes, its ticket updates with the link on its own, and the diamond shows how
                far along it is.
              </p>
              <p className={`m-0 ${body}`}>
                Six Claude Code skills cover the whole loop, from setting up a laptop to building the design for real.
              </p>
            </div>
            <div className="col-span-12 flex flex-col gap-3 xl:col-span-6 xl:col-start-7">
              <StatusBand />
              <span className="text-[13px] text-ink-meta">
                <span className="text-ink">Fig. 2</span> — I designed the stones with Tactile&apos;s 3D artists, cut like a
                Swarovski crystal so they catch light the way a real one does.
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col items-center gap-5 pt-4 text-center">
        <blockquote className="m-0 max-w-[22ch] text-[clamp(32px,3.6vw,52px)] font-medium leading-[1.1] tracking-[-0.035em] text-balance">
          &ldquo;AI prototypes are worthless if they&apos;re not collected in one place.&rdquo;
        </blockquote>
        <span className="text-[13px] text-ink-meta">The idea the whole library is built on</span>
      </div>

      <section id="decisions">
        <div>
          <SectionHead>Decisions</SectionHead>
          {decisions.map((d) => (
            <div key={d.t} className="grid grid-cols-12 items-baseline gap-x-6 gap-y-3 border-b border-hairline py-7">
              <span className="col-span-12 text-[24px] font-medium leading-[1.2] tracking-[-0.015em] text-balance min-[720px]:col-span-6">
                {d.t}
              </span>
              <span className={`col-span-12 text-[18px] leading-[1.55] text-[#3d3c44] text-pretty min-[720px]:col-span-6`}>
                {d.why}
              </span>
              {d.img && (
                <figure className="col-span-12 m-0 flex flex-col gap-3 pt-4">
                  {/* The screenshots' own 16:10, so the whole screen shows and scales with the page. */}
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-[#f1f2f4] ring-1 ring-black/[0.06]">
                    <Image src={d.img.src} alt={d.img.alt} fill className="object-contain" sizes="(min-width: 1280px) 1200px, 100vw" />
                  </div>
                  <figcaption className="text-[13px] text-ink-meta">{d.img.cap}</figcaption>
                </figure>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* The chart's caption counts on from here: v3 numbers it Fig. 4. */}
      <section id="impact" className="[counter-set:fig_3]">
        <div>
          <SectionHead>Impact</SectionHead>
          <div className="grid grid-cols-12 items-start gap-6 pt-10">
            <div className="col-span-12 flex flex-col gap-4 xl:col-span-7">
              <p className="m-0 max-w-[560px] text-[24px] font-medium leading-[1.3] tracking-[-0.015em]">
                All 18 prototypes made it into the real product, and handoff to developers got 2x faster.
              </p>
              <div className="pt-4 pb-6">
                <GrowthChart />
              </div>
              <div className="flex max-w-[560px] flex-col gap-2 border-t border-hairline pt-6">
                <span className="text-[13px] text-ink-meta">What&apos;s next</span>
                <p className={`m-0 ${body}`}>
                  Prototypes built with Claude are now Tactile&apos;s source of truth for design. The goal is for more
                  designers to keep adding to the library after I leave, so it becomes what Figma is for static design,
                  but for AI prototypes.
                </p>
              </div>
            </div>
            <div className="col-span-12 flex flex-col xl:col-span-4 xl:col-start-9">
              <span className="pb-3 text-[13px] text-ink-meta">What I learned</span>
              {lessons.map((l) => (
                <div key={l} className="flex gap-3 border-t border-hairline py-4">
                  <span className="text-[18px] leading-[1.5]">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  ),
}
