import type { WorkProjectPage } from "./types"
import { InsightCards, OutcomeCards, TerminalSnippet } from "./shared"
import { ShowcaseClip } from "@/components/work/showcase-clip"

const paragraph = "text-base leading-relaxed text-[var(--text-secondary)]"
const heading = "text-2xl md:text-3xl font-medium text-foreground mb-4"
const eyebrow = "mb-3 text-sm font-medium uppercase tracking-wider text-[var(--text-tertiary)]"

export const dianasDiamondsPage: WorkProjectPage = {
  displayTitle: "Building a prototype library to scale AI-driven design",
  heroImage: "/images/dianas-diamonds/hero-13-21x9@2x.webp",
  description:
    "A scalable catalogue for AI-built prototypes at Tactile: one place to find them, see what changed, and ship them to production.",
  meta: [
    { label: "Role", values: ["Product Designer", "Design Engineer"] },
    { label: "Duration", values: ["September–October 2026"] },
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
    { id: "hub", title: "The hub", isParent: true, isGateStart: true },
    { id: "diamonds", title: "Diamonds", parent: "hub" },
    { id: "names", title: "Show names", parent: "hub" },
    { id: "stress-test", title: "Stress test", parent: "hub" },
    { id: "preview", title: "Preview", parent: "hub" },
    { id: "grid", title: "Grid", parent: "hub" },
    { id: "whats-new", title: "What's new", parent: "hub" },
    { id: "workflow", title: "Workflow", isParent: true },
    { id: "pm", title: "Project management", parent: "workflow" },
    { id: "agents", title: "Built for AI", parent: "workflow" },
    { id: "handoff", title: "Handoff", parent: "workflow" },
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
        {/* The TOC parent "hub" scrolls here: an anchor inside, so no element sits between sections. */}
        <div id="hub" aria-hidden="true" />
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
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">One pile beat tidy shelves</h3>
            <p className={paragraph}>
              Past a hundred diamonds, my first idea was a shelf: each product area got its own
              stretch of floor, and the view scrolled along it. It was tidier, and it lost the
              point. The field is a pile you take in at a glance, so I went back to one pile and
              left sorting to the grid.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">Every name, at any size</h3>
            <p className={paragraph}>
              The shimmering beams can draw 16 at a time. Rather than hide names past that, the
              first 16 shimmer and the rest get a simpler beam, so every diamond keeps a line to
              its name, whether there are 13 or 200.
            </p>
          </div>
        </div>
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
          caption="The field is for delight, the grid is for finding. One switch turns the diamonds into cards with a thumbnail, a one-line description, search, filters and each ticket's status. The grid is also what loads first, so the list works before the 3D field has started. Alvaro Hernandez, an engineer, helped me set up the infrastructure behind it."
          src="/images/dianas-diamonds/grid-find.mp4"
          poster="/images/dianas-diamonds/grid-find-poster.jpg"
          label="The grid view: hovering over prototype cards, then searching for schedules"
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

      <section id="pm">
        {/* The TOC parent "workflow" scrolls here: an anchor inside, so no element sits between sections. */}
        <div id="workflow" aria-hidden="true" />
        <p className={eyebrow}>Project management</p>
        <h2 className={heading}>It keeps itself up to date.</h2>
        <p className={`${paragraph} max-w-xl`}>
          Each prototype is connected to its task in our project management tool (our Jira
          replacement) and to its Figma file. When a prototype's pull request opens, its link is
          added to the task, and a task still in To Do moves to In Progress, so the ticket points
          at the design before anyone asks. The diamonds even show each task's progress: frosted
          means not started, clear means in progress, and sparkling means ready for review.
        </p>
      </section>

      <section id="agents">
        <p className={eyebrow}>Built for AI</p>
        <h2 className={heading}>Just ask.</h2>
        <p className={`${paragraph} max-w-xl`}>
          Nobody writes prototypes by hand. Designers and developers simply tell Claude what they
          want, in plain English. That only scales if the agent can't quietly get it wrong, so
          the library is built around rules it can check.
        </p>
        <InsightCards
          items={[
            {
              title: "Set up in one message",
              description:
                "A designer installs Claude Code and pastes one message. The agent sets up their machine, and no token ever enters the chat.",
            },
            {
              title: "Rules the build enforces",
              description:
                "Every prototype passes the same checks before it ships: pinned design system, fake data only, no real network calls.",
            },
            {
              title: "Real code, left untouched",
              description:
                "Prototypes copy the real app's code and never edit it, so whatever differs is the design and nothing else.",
            },
          ]}
        />
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

      <section id="handoff">
        <p className={eyebrow}>Handoff</p>
        <h2 className={heading}>The design, as a diff.</h2>
        <p className={`${paragraph} max-w-xl`}>
          Because a prototype copies the real app and only the design changes it, the handoff is
          a diff. One command turns a prototype into a patch against the exact version of the app
          it was built on. Each prototype's notes also list the data it assumes the backend will
          provide, so a frontender starts from what changed instead of digging for it.
        </p>
        <TerminalSnippet
          title="Claude Code"
          lines={[
            { kind: "comment", text: "Frontender" },
            { kind: "prompt", text: "Implement the inbox prototype in the Dashboard." },
            { kind: "out", text: " " },
            { kind: "comment", text: "What the agent runs first" },
            { kind: "cmd", text: "pnpm diff-prototype --app inbox --out handoff/" },
          ]}
        />
      </section>

      <section id="impact">
        <h2 className={heading}>Impact</h2>
        <p className={`${paragraph} mb-6 max-w-xl`}>
          In its first four weeks, 13 prototypes moved into one library, six of them from their
          own repositories, through 28 merged pull requests and one deploy pipeline instead of
          one per prototype.
        </p>
        <OutcomeCards
          items={[
            {
              title: "All in one place",
              description: "Every prototype lives in one library. Nothing gets deleted to save space.",
            },
            {
              title: "Easy to add or change",
              description: "Anyone can add or edit a prototype by asking Claude.",
            },
            {
              title: "Faster to build for real",
              description: "Prototypes use the real codebase and design system, and hand over as a diff, so developers start from what changed.",
            },
            {
              title: "Easier reviews",
              description: "Managers click through real prototypes, all in one place.",
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
          and everyone at Tactile already knows how to use Claude in the terminal. The library is
          also written to outlast me: a handover guide covers where everything is, who has access,
          and what is easy to break.
        </p>
      </section>
    </>
  ),
}
