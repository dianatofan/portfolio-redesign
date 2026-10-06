import type { WorkProjectPage } from "./types"
import { InsightCards, OutcomeCards, TerminalSnippet } from "./shared"
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
    { id: "stress-test", title: "Stress test" },
    { id: "preview", title: "Preview" },
    { id: "grid", title: "Grid" },
    { id: "pm", title: "PM integration" },
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
          caption="The name started as a joke, so I took it literally. The hub opens on a field where each of the 13 prototypes is a 3D diamond, tinted by the product it belongs to, falling into place under real gravity. I modelled the diamond with Tactile's game artists so it catches the light like a real stone."
          src="/images/dianas-diamonds/field-real.mp4"
          poster="/images/dianas-diamonds/field-real-poster.jpg"
          label="The 13 real prototypes fall as diamonds and settle on the floor of the field view"
        />
      </section>

      <section id="stress-test">
        <ShowcaseClip
          eyebrow="Stress test"
          title="Built for 240. Not just 13."
          caption="A library only grows, so the field had to stay fast long after day one. Here it drops 240 diamonds, copies of the real 13, and stays smooth. The physics runs only while they fall, then sleeps, and visitors who prefer reduced motion see the settled pile straight away."
          src="/images/dianas-diamonds/field-drop.mp4"
          poster="/images/dianas-diamonds/field-drop-poster.jpg"
          label="A stress test: 240 diamonds fall and settle into a pile in the field view"
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

      <section id="pm">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
          PM integration
        </p>
        <h2 className={heading}>The library keeps itself up to date.</h2>
        <p className={`${paragraph} max-w-xl mb-4`}>
          Every prototype is linked to its ticket in PM, Tactile's in-house project tool, and to
          its Figma file. A library nobody has to update by hand is one that stays true.
        </p>
        <p className={`${paragraph} max-w-xl`}>
          Even the diamonds read the ticket. A stone's finish shows where its work stands: To Do
          is frosted, In Progress is clear, In Review sparkles the most, and Cancelled goes dull.
          You can read the state of the whole pile without opening a single one.
        </p>
        <InsightCards
          items={[
            {
              title: "The link posts itself",
              description: "Opening a prototype's pull request comments its link on the PM ticket.",
            },
            {
              title: "The ticket moves itself",
              description: "A ticket still in To Do moves to In Progress. Never backwards.",
            },
            {
              title: "What just moved comes first",
              description: "The hub sorts by the latest status change, so new work is on top.",
            },
          ]}
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
        <TerminalSnippet
          lines={[
            { kind: "comment", text: "Click through the prototype locally" },
            { kind: "cmd", text: "pnpm --filter child-ab-tests dev" },
            { kind: "comment", text: "The design change, compared with the real app at the recorded commit" },
            { kind: "cmd", text: "pnpm diff-prototype --app child-ab-tests --out handoff/" },
            { kind: "out", text: "→ SUMMARY.md, design.patch and the files the design added" },
          ]}
        />
        <TerminalSnippet
          title="Claude Code"
          lines={[
            {
              kind: "prompt",
              text: "Implement the holdout-groups prototype in tactile-dashboard. Show me the design diff and the API it assumes first, then write the handover, then port it on a branch in my dashboard clone.",
            },
          ]}
        />
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
        <TerminalSnippet
          lines={[
            { kind: "comment", text: "Start a prototype from a real page of the Dashboard" },
            { kind: "cmd", text: "pnpm new-prototype config-holdouts --real-app dashboard" },
            { kind: "comment", text: "The rules every prototype follows, checked before it deploys" },
            { kind: "cmd", text: "pnpm check" },
          ]}
        />
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
