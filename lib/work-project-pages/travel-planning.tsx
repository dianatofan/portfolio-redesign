import Image from "next/image"
import {
  AlternativesWireframe,
  InspireWireframe,
  ResumeJourney,
  StagesFlight,
  TripTimeline,
} from "@/components/work/travel/illustrations"
import type { WorkProjectPage } from "./types"
import { FigCaption } from "./shared"
import { H3, Lead, P, Pillars, Section, full, right, stack } from "./v4"

/*
 * Travel planning on Google Search, laid out as the v4 case study
 * (travel-planning.html): the page template draws the hero, title block, stats
 * and at-a-glance box; this file draws the body.
 */

const cdn = "https://res.cloudinary.com/dzpdf5ygh"

// Shared by the Outcome section and the work index.
const impact = [
  {
    title: "Adopted into the roadmap",
    description:
      "Concepts were validated by the UX steering committee and directly informed Search's planning priorities.",
  },
  {
    title: "Shifted the product direction",
    description:
      "The work helped define the 2024 Google Search shift on the product roadmap and supported the move toward more visual, cross-vertical results.",
  },
  {
    title: "Prototype as a research tool",
    description:
      "React prototypes with real Maps data replaced static mocks in user testing, producing sharper and more reliable insights.",
  },
  {
    title: "A unified experience",
    description:
      "Three separately designed stages were brought into a single coherent visual and interaction language.",
  },
]

/** High-fidelity prototype recordings in phone frames, side by side on a pale panel. */
function Phones({ items }: { items: { src: string; alt: string; caption: string }[] }) {
  return (
    <div
      className={`${full} mt-6 mb-2 grid justify-center gap-[clamp(24px,5vw,72px)] rounded-[14px] bg-[#f4f4f4] px-[clamp(16px,3vw,40px)] py-[clamp(24px,4vw,56px)]`}
      style={{ gridTemplateColumns: `repeat(${items.length},minmax(0,254px))` }}
    >
      {items.map((item) => (
        <figure key={item.src} className="m-0 flex flex-col gap-3">
          <div className="overflow-hidden rounded-[28px] border-2 border-ink bg-ink">
            {/* Animated GIFs: next/image would only keep the first frame. */}
            <img src={item.src} alt={item.alt} loading="lazy" className="block aspect-[320/676] h-auto w-full object-cover" />
          </div>
          <FigCaption>{item.caption}</FigCaption>
        </figure>
      ))}
    </div>
  )
}

export const travelPlanningPage: WorkProjectPage = {
  layout: "v4",
  heroAspect: "aspect-[1440/681]",
  readTime: "3 min read",
  subtitle:
    "In a 10-week summer sprint, we gave Google Search a way to plan trips, not just answer queries. The framework fed into the 2024 Search roadmap.",
  highlights: impact,
  stats: [
    { value: "10 weeks", label: "summer design sprint" },
    { value: "4 designers", label: "one team, one shared framework" },
    { value: "3 stages", label: "of trip planning, mapped into one framework" },
  ],
  glance: {
    problem: "Most travellers start without a destination, and Search treated every visit as new.",
    did: "Owned the third stage, Rediscover the journey, and pulled all three stages into one connected prototype.",
    outcome: "UX leadership validated the framework, and it fed into the 2024 Search roadmap.",
  },
  description:
    "Rethinking travel planning in Google Search as a continuous journey, not a series of isolated queries.",
  heroImage: `${cdn}/image/upload/f_auto,q_auto:best,w_1920/v1769610470/cover.png`,
  meta: [
    { label: "Role", values: ["UX Engineer"] },
    { label: "Duration", values: ["Summer 2024"] },
    { label: "Team", values: ["3 UX Designers, 1 UX Researcher, 1 Product Manager"] },
    { label: "Skills", values: ["Interaction Design, Prototyping, Concept Exploration, Research Synthesis"] },
  ],
  sections: [
    { id: "overview", title: "Overview" },
    { id: "problem", title: "Problem" },
    { id: "goal", title: "Goal" },
    { id: "research", title: "Research", isGateStart: true },
    { id: "framework", title: "Framework", isParent: true },
    { id: "framework-get-inspired", title: "I. Get inspired", parent: "framework" },
    { id: "framework-look-into-alternatives", title: "II. Look into alternatives", parent: "framework" },
    { id: "framework-rediscover-the-journey", title: "III. Rediscover the journey", parent: "framework" },
    { id: "prototyping", title: "Prototyping" },
    { id: "outcome", title: "Outcome" },
  ],
  renderBeforeGate: () => (
    <>
      <Section id="overview" title="Overview">
        <Lead>
          Search was built for one query. Trip planning takes weeks. In a 10-week summer design sprint at Google, a
          team of four designed a planning framework for Search that UX leadership validated, and it fed into the 2024
          Search roadmap.
        </Lead>
      </Section>

      {/* The problem, on ink. */}
      <section id="problem" className="pt-24">
        <div className="grid grid-cols-12 items-start gap-x-6 gap-y-5 rounded-3xl bg-ink p-7 text-white min-[720px]:p-14">
          <h2 className="col-span-12 m-0 text-[clamp(32px,3.6vw,48px)] leading-[1.08] font-medium tracking-[-0.035em] text-balance lg:col-span-5">
            Problem
          </h2>
          <p className={`${right} m-0 text-[18px] leading-[1.6] text-pretty`}>
            Most travellers start without a destination. Search treated every visit as new, with nothing to spark
            ideas, compare options or remember where you were, so people patched it together with tabs and
            screenshots.
          </p>
          <div className={`${full} mt-6 text-ink`}>
            <TripTimeline dark caption="One trip, 34 days. Every visit starts from zero." />
          </div>
        </div>
      </section>

      {/* Goal, as a centred statement under a small grey label. */}
      <section id="goal" className="pt-[120px] pb-6">
        <div className="grid grid-cols-12 gap-x-6 gap-y-5 text-center">
          <h2 className="col-span-12 m-0 text-[15px] leading-[1.45] font-normal text-ink-meta">Goal</h2>
          <p className="col-span-12 m-0 text-[clamp(32px,3.6vw,48px)] leading-[1.25] font-medium tracking-[-0.025em] text-balance lg:col-span-10 lg:col-start-2">
            Help travellers go from “I want to go somewhere” to a booked trip, across weeks of searching, without
            starting over.
          </p>
        </div>
      </section>
    </>
  ),
  renderAfterGate: () => (
    <>
      <Section id="research" title="Research">
        <P>
          Before touching a frame, I went deep into Google’s existing research. Most travellers hadn’t picked a
          destination, dates or even a trip length.
        </P>
        <P>
          Travellers were already working around it. Tricks for finding cheap flights spread on TikTok as hacks, not as
          anything Search offered. To us, every hack was a feature waiting to be designed.
        </P>
        <P>
          Three gaps kept coming up: getting inspired, comparing without losing context, and picking up where you left
          off. They became the framework.
        </P>
      </Section>

      <Section id="framework" title="Framework" wide>
        <Lead className={stack}>
          Three stages, one designer each. I owned stage three, Rediscover the journey, and pulled all three into one
          experience, since they’d been designed separately.
        </Lead>
        <Pillars
          items={[
            {
              title: "Get inspired",
              text: "A visual surface for destinations, stays and things to do.",
              href: "#framework-get-inspired",
            },
            {
              title: "Look into alternatives",
              text: "Side-by-side comparisons with price and sustainability cues.",
              href: "#framework-look-into-alternatives",
            },
            {
              title: "Rediscover the journey",
              text: "Search history, curated and kept up to date between sessions.",
              href: "#framework-rediscover-the-journey",
            },
          ]}
        />
        <div className={`${full} mt-6 mb-2`}>
          <StagesFlight caption="Drag the plane through the three stages of planning a trip." />
        </div>

        <H3 id="framework-get-inspired" className={stack}>
          I. Get inspired
        </H3>
        <P className={stack}>
          A visual, cross-vertical surface that surfaces destinations, stays, and things to do before any destination
          has been decided on.
        </P>
        <div className={`${full} mt-6 mb-2`}>
          <InspireWireframe caption="Get inspired low-fidelity concept" />
        </div>
        <Phones
          items={[
            {
              src: `${cdn}/image/upload/f_webp,fl_awebp,q_auto/v1769610475/firstscreen-grindelwald.gif`,
              alt: "Get inspired high-fidelity prototype, without a map",
              caption: "Without map: broad exploration",
            },
            {
              src: `${cdn}/image/upload/f_webp,fl_awebp,q_auto/v1769610472/firstscreen-selected.gif`,
              alt: "Get inspired high-fidelity prototype, with a map",
              caption: "With map: contextual exploration",
            },
          ]}
        />

        <H3 id="framework-look-into-alternatives" className={stack}>
          II. Look into alternatives
        </H3>
        <P className={stack}>
          Side-by-side comparisons with price signals and sustainability cues to help weigh tradeoffs without jumping
          between tabs.
        </P>
        <div className={`${full} mt-6 mb-2`}>
          <AlternativesWireframe caption="Look into alternatives low-fidelity concept" />
        </div>
        <Phones
          items={[
            {
              src: `${cdn}/image/upload/f_webp,fl_awebp,q_auto/v1769610303/secondscreen-flights.gif`,
              alt: "Look into alternatives high-fidelity prototype",
              caption: "Look into alternatives high-fidelity prototype",
            },
          ]}
        />

        <H3 id="framework-rediscover-the-journey" className={stack}>
          III. Rediscover the journey
        </H3>
        <P className={stack}>
          A curated view of the user&apos;s search history, personalised and kept up to date, so returning to a trip
          mid-planning feels like picking up a conversation, not starting a new one. Results are ranked by how likely
          they are to engage you, so the strongest picks stand out.
        </P>
        <div className={`${full} mt-6 mb-2`}>
          <ResumeJourney caption="Five visits over 34 days. Each picks up where the last left off, with the most engaging results shown biggest." />
        </div>
        <Phones
          items={[
            {
              src: `${cdn}/image/upload/f_webp,fl_awebp,q_auto/v1769610281/lastscreen.gif`,
              alt: "Rediscover the journey high-fidelity prototype",
              caption: "Rediscover the journey high-fidelity prototype",
            },
          ]}
        />
      </Section>

      <Section id="prototyping" title="Prototyping">
        <Lead>Sketches first, to align the team before going high-fidelity.</Lead>
        <figure className={`${full} m-0 mt-6 mb-2 flex flex-col items-center gap-3`}>
          <Image
            src={`${cdn}/image/upload/f_auto,q_auto/v1775065425/8435D46E-367D-447E-85FD-C171E26B6458.jpg`}
            alt="Sketching and aligning with the team before prototyping"
            width={1080}
            height={810}
            className="block h-auto w-full max-w-[720px] rounded-[14px]"
            sizes="(min-width: 760px) 720px, 100vw"
          />
          <FigCaption className="w-full max-w-[720px]">Me in action: sketching with the team before going high-fidelity.</FigCaption>
        </figure>
        <P>
          Then I built high-fidelity prototypes in React with live Google Maps, which Figma couldn’t do at the time.
          They went straight into research sessions, so we tested motion and map interactions, not static screens.
        </P>
      </Section>

      <Section id="outcome" title="Outcome" wide>
        <div className={`${full} grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-x-12 gap-y-2`}>
          {impact.map((item) => (
            <div key={item.title} className="flex flex-col gap-1.5 border-t border-hairline py-5">
              <span className="text-[18px] leading-[1.45] font-medium">{item.title}</span>
              <span className="text-[18px] leading-[1.45] text-ink-muted text-pretty">{item.description}</span>
            </div>
          ))}
        </div>
        <Lead className={stack}>
          All of this happened during a major reorg at Google, while teams and priorities shifted. Getting the work onto
          the roadmap in that climate was its own win.
        </Lead>
      </Section>
    </>
  ),
}
