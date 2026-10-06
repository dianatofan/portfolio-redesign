import type { WorkProjectPage } from "./types"
import { InsightCards, OutcomeCards } from "./shared"
import { ShowcaseClip, StatBand } from "@/components/work/showcase-clip"

const paragraph = "text-base leading-relaxed text-[var(--text-secondary)]"
const heading = "text-2xl md:text-3xl font-medium text-foreground mb-4"

export const dianasDiamondsPage: WorkProjectPage = {
  displayTitle: "Building a prototype library to scale AI-driven design",
  subtitle:
    "Vibe-coded prototypes end up scattered and hard to find, a problem every designer working with AI runs into. This is how I solved it at Tactile.",
  heroImage: "/images/dianas-diamonds/field.png",
  description:
    "A scalable catalogue for AI-built prototypes at Tactile: one place to find them, see what changed, and ship them to production.",
  meta: [
    { label: "Role", values: ["Product Designer", "Design Engineer"] },
    { label: "Duration", values: ["Sep – Oct 2026"] },
    { label: "Type", values: ["Work project"] },
    {
      label: "Skills",
      values: ["Prototyping with AI", "Design Ops", "Developer Handoff"],
    },
  ],
  sections: [
    { id: "overview", title: "Overview" },
    { id: "problem", title: "Problem" },
    { id: "goal", title: "Goal" },
    { id: "diamonds", title: "Diamonds", isGateStart: true },
    { id: "preview", title: "Preview" },
    { id: "grid", title: "Grid" },
    { id: "whats-new", title: "What's new" },
    { id: "handoff", title: "Handoff" },
    { id: "agents", title: "Built for agents" },
    { id: "impact", title: "Impact" },
  ],
  renderBeforeGate: () => (
    <>
      <section id="overview">
        <h2 className={heading}>Overview</h2>
        <p className={`${paragraph} mb-4`}>
          At Tactile I design by building. I ask Claude to make the change on top of our real
          source code, and an hour later anyone can open a working version. The prototype is the
          source of truth, and Figma comes second.
        </p>
        <p className={`${paragraph} mb-4`}>
          When prototypes are that cheap, there are a lot of them. Mine ended up scattered across
          separate repositories and links nobody could find. Every company working this way now
          faces the same questions: where do prototypes live, which one is current, and how do
          you get value from one after the meeting it was made for?
        </p>
        <p className={paragraph}>
          In my last month at Tactile, I built the answer: one home for every prototype, made to
          keep working after I leave.
        </p>
      </section>

      <section id="problem">
        <h2 className={heading}>Problem</h2>
        <p className={paragraph}>
          Every prototype was its own repository, with its own deploy, domain and login. Each one
          cost money and setup time, so I deleted old ones regularly. Then a PM would ask to see a
          prototype from a few months back, and it was gone.
        </p>
        <InsightCards
          items={[
            {
              title: "Prototypes got lost",
              description: "Links lived in Slack and tickets, and cleanups deleted past work.",
            },
            {
              title: "Nothing said what changed",
              description: "A prototype copies the real app, so the new design was hard to spot.",
            },
            {
              title: "Handoff started from zero",
              description: "Frontenders had to dig the design change out of a separate repo.",
            },
          ]}
        />
      </section>

      <section id="goal">
        <h2 className={heading}>Goal</h2>
        <div className="bg-accent/20 border-l-4 border-accent p-6 rounded-r-lg">
          <p className="text-lg font-medium text-foreground">
            One permanent home where anyone can find a prototype, see what it changes, and take it
            to production. It had to work as well with 100 prototypes as with a dozen.
          </p>
        </div>
      </section>
    </>
  ),
  renderAfterGate: () => (
    <>
      <section id="diamonds">
        <ShowcaseClip
          eyebrow="Diamonds"
          title="Diana's diamonds. Literally."
          caption="The name started as a joke, so I took it literally. The hub opens on a field where every prototype falls in as a 3D diamond and piles up under real gravity. I modelled the diamond with Tactile's game artists, and the field stays smooth with 240 of them."
          src="/images/dianas-diamonds/field-drop.mp4"
          poster="/images/dianas-diamonds/field-drop-poster.jpg"
          label="240 diamonds fall and settle into a pile in the field view"
        />
      </section>

      <section id="preview">
        <ShowcaseClip
          eyebrow="Preview"
          title="Open one. Then the next."
          caption="Hover a diamond to see its name, click it, and it opens as a preview. Next goes through the prototypes like a gallery, so a PM can catch up on a month of design work in a minute."
          src="/images/dianas-diamonds/field-open.mp4"
          poster="/images/dianas-diamonds/field-open-poster.jpg"
          label="Hovering a diamond, opening its preview, then stepping to the next prototypes"
        />
      </section>

      <section id="grid">
        <ShowcaseClip
          eyebrow="Grid"
          title="Every prototype. One place."
          caption="The field is for delight, the grid is for finding. One switch turns the diamonds into cards with search, filters and each ticket's live status from our PM tool. Alvaro Hernandez, an engineer, helped me put them all in one repository and one address."
          src="/images/dianas-diamonds/grid-find.mp4"
          poster="/images/dianas-diamonds/grid-find-poster.jpg"
          label="The grid view: hovering over prototype cards, then searching for schedules"
        />
      </section>

      <section id="whats-new">
        <ShowcaseClip
          eyebrow="What's new"
          title="The design explains itself."
          caption="Each prototype has a details page with the live prototype beside its notes. What's new is an interactive walkthrough: click a step, and the prototype jumps to that screen and highlights what changed."
          src="/images/dianas-diamonds/walkthrough.mp4"
          poster="/images/dianas-diamonds/walkthrough-poster.jpg"
          label="Clicking What's new steps on the In-game inbox, each one highlighting part of the live prototype"
        />
      </section>

      <section id="handoff">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
          Handoff
        </p>
        <h2 className={heading}>From prototype to production in one command.</h2>
        <p className={`${paragraph} max-w-xl`}>
          Every prototype records what it copied from the real app, and at which commit. So one
          command gives a frontender the design change as a patch, plus the API endpoints it
          assumes that don't exist yet. No more reverse-engineering.
        </p>
      </section>

      <section id="agents">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
          Built for agents
        </p>
        <h2 className={heading}>The designer directs. The agent builds.</h2>
        <p className={`${paragraph} max-w-xl`}>
          Designers here don't write prototypes by hand, so I designed the library for the AI
          agent too. Its rules are short and checkable, and one check enforces them before
          anything deploys. A new designer pastes one message into Claude Code, and it sets up
          their machine.
        </p>
      </section>

      <section id="impact">
        <h2 className={heading}>Impact</h2>
        <StatBand
          items={[
            { value: "13", label: "prototypes, all in one home" },
            { value: "3 weeks", label: "from the first commit to the hub" },
            { value: "9 of 13", label: "are Done in the PM tool" },
          ]}
        />
        <p className={`${paragraph} mt-12 mb-6`}>With Claude, one designer did the work of a team.</p>
        <OutcomeCards
          items={[
            {
              title: "Design to deploy",
              description: "I designed the prototypes, built the hub and set up the deploys.",
            },
            {
              title: "Real software in reviews",
              description: "The team clicks through working prototypes, not mockups.",
            },
            {
              title: "A patch, not a picture",
              description: "Engineers start from the exact design change in code.",
            },
            {
              title: "Built to outlive me",
              description: "A new designer sets up their machine with one message to Claude.",
            },
          ]}
        />
      </section>
    </>
  ),
}
