import type { WorkProjectPage } from "./types"
import { InsightCards, OutcomeCards, TerminalSnippet } from "./shared"
import { ShowcaseClip } from "@/components/work/showcase-clip"

const paragraph = "text-base leading-relaxed text-[var(--text-secondary)]"
const heading = "text-2xl md:text-3xl font-medium text-foreground mb-4"
const eyebrow = "mb-3 text-sm font-medium uppercase tracking-wider text-[var(--text-tertiary)]"

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
    { id: "names", title: "Show names" },
    { id: "stress-test", title: "Stress test" },
    { id: "preview", title: "Preview" },
    { id: "grid", title: "Grid" },
    { id: "pm", title: "PM integration" },
    { id: "whats-new", title: "What's new" },
    { id: "agents", title: "Built for agents" },
    { id: "impact", title: "Impact" },
    { id: "next", title: "What's next" },
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
        <p className={paragraph}>
          When prototypes are that cheap, there are a lot of them, and mine ended up scattered
          and hard to find. Every team designing with AI now runs into the same question: where
          do prototypes live once the meeting is over? In my last month at Tactile, I built one
          home for all of them, made to keep working after I leave.
        </p>
      </section>

      <section id="problem">
        <h2 className={heading}>Problem</h2>
        <p className={paragraph}>
          Every prototype was its own repository and deploy, so I deleted old ones regularly. Then
          a PM would ask for one from a few months back, and it was gone.
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
            to production, whether there are a dozen or a hundred.
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
          caption="The name started as a joke, so I took it literally: each of the 13 prototypes is a 3D diamond that falls into place under real gravity. I modelled the diamond with Tactile's game artists so it catches the light like a real stone."
          src="/images/dianas-diamonds/field-real.mp4"
          poster="/images/dianas-diamonds/field-real-poster.jpg"
          label="The 13 real prototypes fall as diamonds and settle on the floor of the field view"
        />
      </section>

      <section id="names">
        <ShowcaseClip
          eyebrow="Show names"
          title="Light that leads to a name."
          caption="Flip Show names, and a beam of light leaves each diamond and runs up to its name. Hover a name and its beam lights up while the rest dim, so you can find a prototype without opening one."
          src="/images/dianas-diamonds/field-names.mp4"
          poster="/images/dianas-diamonds/field-names-poster.jpg"
          label="Turning on Show names: light beams rise from each diamond to its name, and hovering a name highlights its beam"
        />
      </section>

      <section id="stress-test">
        <ShowcaseClip
          eyebrow="Stress test"
          title="Built to scale. Tested with 240."
          caption="A library only grows, so the field had to stay fast long after day one. Here it drops 240 diamonds, copies of the real 13, and stays smooth. The physics only runs while they fall."
          src="/images/dianas-diamonds/field-drop.mp4"
          poster="/images/dianas-diamonds/field-drop-poster.jpg"
          label="A stress test: 240 diamonds fall and settle into a pile in the field view"
        />
      </section>

      <section id="preview">
        <ShowcaseClip
          eyebrow="Preview"
          title="Open one. Then the next."
          caption="Hover a diamond to see its name, click it, and it opens as a preview. Next steps through them like a gallery, so a PM can catch up on a month of design work in a minute."
          src="/images/dianas-diamonds/field-open.mp4"
          poster="/images/dianas-diamonds/field-open-poster.jpg"
          label="Hovering a diamond, opening its preview, then stepping to the next prototypes"
        />
      </section>

      <section id="grid">
        <ShowcaseClip
          eyebrow="Grid"
          title="Every prototype. One place."
          caption="The field is for delight, the grid is for finding. One switch turns the diamonds into cards with a thumbnail, a one-line description, search, filters and each ticket's live status. Alvaro Hernandez, an engineer, helped me set up the infrastructure behind it."
          src="/images/dianas-diamonds/grid-find.mp4"
          poster="/images/dianas-diamonds/grid-find-poster.jpg"
          label="The grid view: hovering over prototype cards, then searching for schedules"
        />
      </section>

      <section id="pm">
        <p className={eyebrow}>PM integration</p>
        <h2 className={heading}>The library keeps itself up to date.</h2>
        <p className={`${paragraph} max-w-xl`}>
          Every prototype is linked to its ticket in our PM tool (project management, our Jira
          replacement) and to its Figma file, so design, code and decisions stay connected.
          Even the diamonds read the ticket: To Do is frosted, In Progress is clear, In Review
          sparkles the most and Cancelled goes dull, so you can read the whole pile at a glance.
        </p>
        <InsightCards
          items={[
            {
              title: "The link posts itself",
              description: "Each prototype's link lands on its PM ticket as a comment.",
            },
            {
              title: "The ticket moves itself",
              description: "Shipping a prototype moves its ticket from To Do to In Progress.",
            },
            {
              title: "New work comes first",
              description: "The hub sorts by the latest status change in PM.",
            },
          ]}
        />
      </section>

      <section id="whats-new">
        <ShowcaseClip
          eyebrow="What's new"
          title="The design explains itself."
          caption="A prototype copies the real app, so the hardest question in a review is what's new. Each prototype answers it with a walkthrough: click a step, and the live prototype jumps to that screen and highlights what changed."
          src="/images/dianas-diamonds/walkthrough.mp4"
          poster="/images/dianas-diamonds/walkthrough-poster.jpg"
          label="Clicking What's new steps on the In-game inbox, each one highlighting part of the live prototype"
        />
      </section>

      <section id="agents">
        <p className={eyebrow}>Built for agents</p>
        <h2 className={heading}>The designer directs. The agent builds.</h2>
        <p className={`${paragraph} max-w-xl`}>
          Nobody here writes prototypes by hand, so the library is written for the AI agent too.
          Its rules are checked automatically before anything ships, and a new designer sets up
          their machine by pasting one message. From then on, everyone works in plain English.
        </p>
        <TerminalSnippet
          title="Claude Code"
          lines={[
            { kind: "comment", text: "Designer" },
            { kind: "prompt", text: "Start a prototype from the A/B tests page." },
            { kind: "prompt", text: "Ship holdout-groups." },
            { kind: "out", text: " " },
            { kind: "comment", text: "Frontender" },
            { kind: "prompt", text: "Build holdout-groups in the real Dashboard." },
          ]}
        />
      </section>

      <section id="impact">
        <h2 className={heading}>Impact</h2>
        <OutcomeCards
          items={[
            {
              title: "Every prototype in one home",
              description: "All 13 prototypes live in one library, and nothing gets cleaned out any more.",
            },
            {
              title: "Easy to add and edit",
              description: "A new prototype, or a change to an existing one, is one message to Claude.",
            },
            {
              title: "Faster to production",
              description: "Frontenders start from the exact design change in code, not from screenshots.",
            },
            {
              title: "Smoother stakeholder reviews",
              description: "PMs and leads click through working prototypes in one place, with live status.",
            },
          ]}
        />
      </section>

      <section id="next">
        <h2 className={heading}>What's next</h2>
        <p className={`${paragraph} max-w-xl`}>
          I'd love for people to add or edit prototypes right in the hub. I built a first version,
          with "New prototype" and "Request a change" forms that started Claude in the cloud, but
          the infrastructure engineer and I agreed to switch it off: it cost too many credits,
          and everyone at Tactile already knows how to use Claude in the terminal.
        </p>
      </section>
    </>
  ),
}
