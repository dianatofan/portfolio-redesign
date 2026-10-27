import Image from "next/image"
import type { ReactNode } from "react"
import { CoreTeamQueue, ModuleStates, Provisioning, SetupFlow } from "@/components/work/game-setup/illustrations"
import { TradeoffTable } from "@/components/work/liveops/tradeoffs"
import type { WorkProjectPage } from "./types"
import { FigCaption } from "./shared"
import { H3, Lead, P, Section, full, right, stack } from "./v4"

/*
 * Game setup automation, laid out as the v4 case study (site-pages.html): the
 * page template draws the hero, title block, stats and at-a-glance box; this
 * file draws the body, with the same blocks as LiveOps Alerting.
 */

const cdn = "https://res.cloudinary.com/dzpdf5ygh"

// The stat band above the password gate.
const stats = [
  { title: "~10 min to create a game, down from 1–2 weeks", description: "" },
  { title: "+3 games / quarter", description: "" },
]

const impact = [
  {
    title: "Setup in ~10 minutes",
    description: "Down from 1–2 weeks. Teams start working the same day while services finish in the background.",
  },
  { title: "+3 games per quarter", description: "Guardrails and validation also cut risky configuration errors." },
]

/** Title over a muted line, under a hairline: the principles and the reflections. */
function Rules({ items, cols }: { items: { title: string; text: string }[]; cols: string }) {
  return (
    <div className={`${full} grid gap-x-12 gap-y-2`} style={{ gridTemplateColumns: cols }}>
      {items.map((item) => (
        <div key={item.title} className="flex flex-col gap-1.5 border-t border-hairline py-5 text-[18px] leading-[1.45]">
          <span className="font-medium">{item.title}</span>
          <span className="text-ink-muted text-pretty">{item.text}</span>
        </div>
      ))}
    </div>
  )
}

/** A recording across the column at its own shape, never cropped. */
function Recording({ src, width, height, caption }: { src: string; width: number; height: number; caption: string }) {
  return (
    <figure className={`${full} m-0 mt-6 mb-2 flex flex-col gap-3`}>
      <video
        src={`${cdn}/video/upload/${src}`}
        autoPlay
        loop
        muted
        playsInline
        aria-label={caption}
        className="block h-auto w-full rounded-[14px] bg-[#f1f2f4]"
        style={{ aspectRatio: `${width} / ${height}` }}
      />
      <FigCaption>{caption}</FigCaption>
    </figure>
  )
}

const step = `${stack} mt-5 border-t border-hairline pt-4`

/**
 * Holds the sections behind the gate in one box, so the gate's own 96px
 * between sibling sections doesn't stack on each Section's top padding.
 */
function Body({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

export const gameSetupAutomationPage: WorkProjectPage = {
  layout: "v4",
  // The cover is wider than 16:9; show it whole rather than cropped.
  heroAspect: "aspect-[8048/4224]",
  readTime: "1 min read",
  highlights: stats,
  glance: {
    problem:
      "Every new game had to be registered across LiveOps, analytics, builds, permissions and infrastructure, and only a small Core Team could do it.",
    did: "I turned a Core-Team-only process into a self-serve setup tool, so teams could launch games without waiting on engineering.",
    outcome: "Game setup down from 1–2 weeks to about 10 minutes, and 3 more games shipped every quarter.",
  },
  description: "Automating game setup to enable team independence and scale releases.",
  meta: [
    { label: "Role", values: ["Product Designer"] },
    { label: "Duration", values: ["3 months"] },
    { label: "Team", values: ["Product Manager, Tech Lead, 2 BE Engineers, 1 FE Engineer"] },
    { label: "Skills", values: ["Product Design", "Product Strategy", "Prototyping"] },
  ],
  sections: [
    { id: "problem", title: "The problem" },
    { id: "principles", title: "Principles", isGateStart: true },
    { id: "solution", title: "Solution", isParent: true },
    { id: "step-1", title: "1. Define the essentials", parent: "solution" },
    { id: "step-2", title: "2. Permissions", parent: "solution" },
    { id: "step-3", title: "3. Configure services", parent: "solution" },
    { id: "step-4", title: "4. Integration credentials", parent: "solution" },
    { id: "tradeoffs", title: "Key tradeoffs" },
    { id: "impact", title: "Impact" },
  ],
  renderBeforeGate: () => (
    // The problem, on ink.
    <section id="problem" className="pt-24">
      <div className="grid grid-flow-row-dense grid-cols-12 items-start gap-x-6 gap-y-5 rounded-3xl bg-ink p-7 text-white min-[720px]:p-14">
        <h2 className="col-span-12 m-0 text-[clamp(32px,3.6vw,48px)] leading-[1.08] font-medium tracking-[-0.035em] text-balance lg:col-span-5 lg:row-span-2">
          The problem
        </h2>
        <p className={`${right} m-0 text-[18px] leading-[1.6] text-pretty`}>
          Every new game had to be registered across LiveOps, analytics, builds, permissions and infrastructure, and
          only a small Core Team could do it.
        </p>
        <p className={`${right} m-0 text-[18px] leading-[1.6] text-pretty`}>
          As more teams shipped games in parallel, that became the bottleneck.
        </p>
        <div className={`${full} mt-6 mb-2`}>
          <CoreTeamQueue caption="Teams used to queue for the Core Team. Now they set up games in parallel." />
        </div>
      </div>
    </section>
  ),
  renderAfterGate: () => (
    <Body>
      <Section id="discovery" title="Shifting gears" sub>
        <P>The original request was simple: automate game setup.</P>
        <P>
          After running a workshop with stakeholders, it became clear that some steps could be automated, while others
          still required team input and decisions.
        </P>
        <figure className={`${full} m-0 mt-6 mb-2 flex flex-col gap-3`}>
          <Image
            src={`${cdn}/image/upload/f_auto,q_auto/v1769610260/workshop-compressed.png`}
            alt="Workshop outputs mapping setup steps, constraints, and system dependencies."
            width={4000}
            height={2638}
            className="block h-auto w-full rounded-[14px]"
            sizes="(min-width: 1280px) 1200px, 100vw"
          />
          <FigCaption>Workshop outputs: setup steps, constraints and system dependencies.</FigCaption>
        </figure>
      </Section>

      <Section id="principles" title="Principles that shaped the solution">
        <Rules
          cols="repeat(auto-fit,minmax(min(100%,420px),1fr))"
          items={[
            { title: "Safe by default", text: "Reduce setup mistakes before they happen." },
            { title: "Progressive disclosure", text: "Start with the essentials and reveal complexity when needed." },
            { title: "Flexible setup", text: "Allow teams to continue even when some systems are still provisioning." },
            { title: "Build on existing infrastructure", text: "Integrate with existing systems instead of replacing them." },
          ]}
        />
      </Section>

      <Section id="solution" title="Solution" wide>
        <Lead className={stack}>
          Instead of another long form, the Dashboard norm, I proposed a step-by-step setup built on progressive
          disclosure: teams see only what they need and always know what’s next.
        </Lead>
        <div className={`${full} mt-6 mb-2`}>
          <SetupFlow caption="Four steps, one flow, instead of tickets to four teams." />
        </div>

        {/* The steps sit inside Solution; their ids are for the contents rail. */}
        <H3 id="step-1" className={step}>Step 1: Define the essentials</H3>
        <P className={stack}>
          Only the fields a game needs to exist: name, shortcode, codename and repo. We cut the required fields on
          purpose so a game could be created fast.
        </P>
        <Recording src="v1769610262/step1-demo.mp4" width={2560} height={1104} caption="Step 1: only the fields a game needs to exist." />

        <H3 id="step-2" className={step}>Step 2: Permissions</H3>
        <P className={stack}>Access is set at creation, with edit or view per person, so nobody gets locked out.</P>
        <Recording src="v1769610423/step3-permissions.mp4" width={2560} height={1104} caption="Step 2: edit or view access, set per person." />

        <H3 id="step-3" className={step}>Step 3: Configure services</H3>
        <P className={stack}>
          Each service has its own card that sets itself up in the background, showing Scheduled, Available or Not
          configured, so teams never wait on one request at a time.
        </P>
        <Recording src="v1769610445/step2-services.mp4" width={2560} height={1104} caption="Step 3: each service sets itself up in the background." />

        <H3 id="step-4" className={step}>Step 4: Integration credentials</H3>
        <P className={stack}>
          External IDs and keys, like store app IDs or SDK tokens, get their own step. Not every game uses every
          integration, so teams can skip it and add them later. Each key is validated on entry, since a wrong one
          breaks builds or sign-in.
        </P>
        <Recording src="v1769610466/step4-credentials.mp4" width={2560} height={1104} caption="Step 4: external IDs and keys, validated in their own step." />

        <H3 className={step}>System behavior</H3>
        <P className={stack}>
          Each module shows its status and allows actions like Configure or Retry, so teams can keep moving without
          waiting.
        </P>
        <div className={`${full} mt-6 mb-2`}>
          <Provisioning caption="Each service sets itself up in the background. Teams can keep going while some are still in progress, or retry one that failed." />
        </div>

        <H3 className={step}>What happens after setup</H3>
        <P className={stack}>Teams land in a central overview to track progress, fix issues, and manage access over time.</P>
        <Recording
          src="v1769610479/post-setup.mp4"
          width={2184}
          height={1440}
          caption="Switching between overview, permissions, and integration settings for a partially configured game."
        />
      </Section>

      <Section id="tradeoffs" title="Key tradeoffs">
        <TradeoffTable
          rows={[
            {
              decision: "Service cards",
              from: "All expanded by default",
              to: "Collapsed, expanded when needed",
              note: "With every new service, an all-expanded setup got long and overwhelming. Now only core services stay open; the rest expand on demand, and each user’s choice is saved.",
              media: [
                { caption: "Before: all cards expanded", alt: "Service setup with every card expanded", video: `${cdn}/video/upload/v1769610420/everything-expanded.mp4`, aspect: "2232 / 1440" },
                { caption: "After: cards expand on demand", alt: "Service setup with most cards collapsed", video: `${cdn}/video/upload/v1769610187/mostly-collapsed.mp4`, aspect: "2232 / 1440" },
              ],
            },
            {
              decision: "Module states",
              from: "Many granular states",
              to: "A small set of clear states",
              note: "Early designs showed many granular states: accurate, but hard to scan. I cut them to five that show readiness and the next action at a glance.",
              media: [],
              figure: <ModuleStates />,
            },
            {
              decision: "Game access",
              from: "Game creator only",
              to: "Inherited from existing access",
              note: "Only the game creator having access quickly became a bottleneck. Now people with global LiveOps permissions inherit access, and ownership stays explicit.",
              media: [
                { caption: "Inherited access model for game permissions", alt: "Inherited access model for game permissions", image: `${cdn}/image/upload/f_auto,q_auto/v1769610209/inherited-access.png`, width: 2194, height: 1092, bg: "#f9fafb" },
              ],
            },
          ]}
        />
      </Section>

      <Section id="impact" title="Impact" wide>
        <div className={`${full} grid grid-cols-1 gap-4 pt-2 min-[560px]:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]`}>
          {impact.map((item, i) => (
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

      <Section id="reflections" title="Reflections">
        <Rules
          cols="repeat(auto-fit,minmax(240px,1fr))"
          items={[
            {
              title: "The faded screens.",
              text: "I faded parts of a Figma screen to explain one component, and developers built the faded UI. Now I label documentation clearly.",
            },
            {
              title: "It never stopped changing.",
              text: "Every new service on the backend meant a new section in the tool. I stopped designing screens and started designing a structure that could keep growing.",
            },
            {
              title: "It’s really a backend product.",
              text: "Every screen depended on what the backend could do. The closer I worked with engineering, the better the design got.",
            },
          ]}
        />
      </Section>
    </Body>
  ),
}
