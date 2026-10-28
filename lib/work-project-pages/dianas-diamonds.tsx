import { TradeoffTable } from "@/components/work/liveops/tradeoffs"
import { AddingPrototypes, EachPrototype, Handover, Merging } from "@/components/work/diamonds-tradeoffs"
import type { WorkProjectPage } from "./types"
import { FigCaption } from "./shared"
import { H3, Lead, P, Section, full, lead, right, stack } from "./v4"
import { BeforeAfter } from "@/components/work/cs3/before-after"
import { GrowthChart } from "@/components/work/growth-chart"
import { LiveGem } from "@/components/work/live-gem"
import { ProductTour, type TourSlide } from "@/components/work/product-tour"

/*
 * Diana's Diamonds. The page template's v3 layout draws the hero (with its
 * caption), the title block and the stats; this file draws the body, with the
 * same blocks as LiveOps Alerting: headline on the left, text on the right.
 */

const media = "/images/dianas-diamonds"

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

// The Key tradeoffs table: each row opens the story and its before and after.
const tradeoffs = [
  {
    decision: "Change requests",
    from: "An AI agent inside the hub",
    to: "Claude in the terminal",
    note: "I built a way to add and update prototypes straight from the hub, with an AI agent in the UI. Then I switched it off with our backend engineer: the tokens were too expensive, and at our team size a terminal workflow everyone already used beat a new UI.",
    media: [],
    figure: <AddingPrototypes />,
  },
  {
    decision: "Prototype pages",
    from: "A link that redirects",
    to: "A details page: what changed, ticket, status",
    note: "The brief was a list of links that redirect straight to each prototype. I pushed for a details page instead: what changed, its ticket and its status, so PMs and developers get the context before they click through. It turned out to be the part people didn't know they needed, especially the What's changed section and the ticket history.",
    media: [],
    figure: <EachPrototype />,
  },
  {
    decision: "Merge rights",
    from: "Claude can push to main",
    to: "Claude opens PRs, people merge",
    note: "Claude can open a pull request, but it can never merge or push to main. Every change that reaches production is a person's click.",
    media: [],
    figure: <Merging />,
  },
  {
    decision: "Handover guidelines",
    from: "Knowledge lives with me",
    to: "Published guidelines anyone can follow",
    note: "I tested them on the other designer at Tactile. He added prototypes on his own, just from the published guidelines, and PMs and other teams started using it too.",
    media: [],
    figure: <Handover />,
  },
]

// Each lesson as the belief it replaced, then the line behind it.
const lessons = [
  {
    from: "Build what you’re asked for",
    to: "Build what makes people’s work easier",
    text: "Nobody asked me to build this. People started using it because it made their work easier, not just mine.",
  },
  {
    from: "Prototypes are disposable",
    to: "Prototypes are worth keeping, in one place",
    text: "AI prototypes are worthless if they're not collected in one place. Scattered, they lose their meaning.",
  },
]

// The Impact cards.
const outcomes = [
  { title: "18 of 18 shipped", description: "Every prototype in the library made it into the real product" },
  { title: "2x faster handoff", description: "Developers start from the design, not from zero" },
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
  readTime: "3 min read",
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
    { id: "decisions", title: "Key tradeoffs" },
    { id: "impact", title: "Impact" },
    { id: "learned", title: "What I learned" },
    { id: "next", title: "What's next" },
  ],
  renderBeforeGate: () => (
    <>
      {/* The overview opens on its statement, in the headline's place. */}
      <section id="overview" className="pt-24">
        <div className="grid grid-cols-12 items-start gap-x-6 gap-y-5">
          <p data-text="" className={`col-span-12 lg:col-span-5 ${lead} font-medium`}>
            Every company adopting AI runs into the same problem: prototypes get cheap to make, and just as easy to lose.
          </p>
          <P>
            At Tactile I build prototypes on our real source code, so developers can ship them. They were becoming a
            team asset with nowhere to live, so I proposed one library and built it. Past work stays findable, PMs
            catch up in a minute, and developers start from the design, not from zero.
          </P>
        </div>
      </section>

      <Section id="problem" title="The problem" wide>
        <Lead className={stack}>
          The question isn&apos;t how to make prototypes, it&apos;s where they live once the meeting is over.
        </Lead>
        <div className={`${full} mt-6`}>
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
      </Section>
    </>
  ),
  renderAfterGate: () => (
    <>
      <Section id="tool" title="The tool" wide>
        <div className={`${full} mt-6`}>
          <ProductTour label="Diana's Diamonds, screen by screen" slides={tourSlides} />
        </div>
        <div className={`${full} grid grid-cols-12 items-start gap-x-6 gap-y-5 pt-5`}>
          <div className="col-span-12 flex flex-col gap-5 xl:col-span-5">
            <H3 className="">It keeps itself up to date.</H3>
            <P className="">
              Every time a prototype changes, its ticket updates with the link on its own, and the diamond shows how
              far along it is.
            </P>
            <P className="">
              Six Claude Code skills cover the whole loop, from setting up a laptop to building the design for real.
            </P>
          </div>
          <figure className="col-span-12 m-0 mt-5 flex flex-col gap-3 xl:col-span-6 xl:col-start-7">
            <StatusBand />
            <FigCaption>
              I designed the stones with Tactile&apos;s 3D artists, cut like a Swarovski crystal so they catch light the
              way a real one does.
            </FigCaption>
          </figure>
        </div>
      </Section>

      <div className="flex flex-col items-center gap-5 pt-24 text-center">
        <blockquote className="m-0 max-w-[22ch] text-[clamp(32px,3.6vw,48px)] font-medium leading-[1.1] tracking-[-0.035em] text-balance">
          &ldquo;AI prototypes are worthless if they&apos;re not collected in one place.&rdquo;
        </blockquote>
        <span className="text-[13px] text-ink-meta">The idea the whole library is built on</span>
      </div>

      <Section id="decisions" title="Key tradeoffs" wide>
        <TradeoffTable rows={tradeoffs} />
      </Section>

      <Section id="impact" title="Impact" wide>
        <div className={`${full} grid grid-cols-1 gap-4 pt-2 min-[560px]:grid-cols-2`}>
          {outcomes.map((item, i) => (
            <div
              key={item.title}
              className={`flex min-h-[200px] flex-col justify-between gap-7 rounded-[20px] p-7 ${
                i === 0 ? "bg-ink text-white" : "bg-[#f1f2f4] text-ink"
              }`}
            >
              <span className="text-[24px] leading-[1.15] font-medium tracking-[-0.035em] text-balance">{item.title}</span>
              <span className={`text-[15px] leading-[1.45] ${i === 0 ? "text-[#c9c8d0]" : "text-[#3d3c44]"}`}>
                {item.description}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="learned" title="What I learned">
        <div className={`${right} flex flex-col`}>
          {lessons.map((l, i) => (
            <div key={l.to} className={`flex flex-col gap-2 py-5 ${i > 0 ? "border-t border-hairline" : ""}`}>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[24px] leading-[1.3] tracking-[-0.02em]">
                <span className="text-ink-meta line-through decoration-[#c9c8d0]">{l.from}</span>
                <span aria-hidden="true" className="text-brand">
                  →
                </span>
                <span className="font-medium">{l.to}</span>
              </div>
              <P className="">{l.text}</P>
            </div>
          ))}
        </div>
      </Section>

      <Section id="next" title="What's next" wide>
        <div className={`${full} pt-1`}>
          <GrowthChart />
        </div>
      </Section>
    </>
  ),
}
