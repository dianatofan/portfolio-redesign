import Image from "next/image"
import type { WorkProjectPage } from "./types"
import { InsightCards, OutcomeCards, TerminalSnippet } from "./shared"
import { ShowcaseClip } from "@/components/work/showcase-clip"
import { ArrowRight, GitPullRequest, Link2 } from "lucide-react"

const paragraph = "text-base leading-relaxed text-[var(--text-secondary)]"
const heading = "text-2xl md:text-3xl font-medium text-foreground mb-4"
const eyebrow = "mb-3 text-sm font-medium uppercase tracking-wider text-[var(--text-tertiary)]"

/** A cut gem outline; the three finishes stand for a task's status, as the hub's diamonds do. */
function Gem({ finish }: { finish: "frosted" | "clear" | "sparkling" }) {
  // Rendered by the hub itself: the same stone in the To Do, In Progress and In Review finishes.
  const file = finish === "frosted" ? "frosted" : finish === "clear" ? "clear" : "brilliant"
  return (
    <div className="relative aspect-[68/50] w-full overflow-hidden rounded-md">
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
    { id: "tradeoffs", title: "Trade-offs", parent: "hub" },
    { id: "preview", title: "Preview", parent: "hub" },
    { id: "grid", title: "Grid", parent: "hub" },
    { id: "whats-new", title: "What's new", parent: "hub" },
    { id: "workflow", title: "Workflow", isParent: true },
    { id: "pm", title: "Project management", parent: "workflow" },
    { id: "how", title: "Built for AI", parent: "workflow" },
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
      </section>

      <section id="tradeoffs">
        <p className={eyebrow}>Trade-offs</p>
        <h2 className={heading}>Two ways to hold 240 diamonds.</h2>
        <div className="mt-8 grid grid-cols-1 gap-8 rounded-xl bg-background p-6 md:grid-cols-2 md:p-8">
          <figure>
            <div className="relative aspect-[3200/1626] overflow-hidden rounded-lg border border-border bg-card">
              <Image
                src="/images/dianas-diamonds/tradeoff-shelf.jpg"
                alt="The field with 240 diamonds on shelves: one pile per product area, side by side"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
            <figcaption className="mt-4">
              <h3 className="text-lg font-medium text-foreground mb-2">Tried: a shelf per product area</h3>
              <p className={paragraph}>
                A pile per product area. Tidier, but you lose the one-glance view.
              </p>
            </figcaption>
          </figure>
          <figure>
            <div className="relative aspect-[3200/1626] overflow-hidden rounded-lg border border-border bg-card">
              <Image
                src="/images/dianas-diamonds/tradeoff-pile-names.jpg"
                alt="The field with 240 diamonds in one pile and Show names on: a beam from every diamond to its name"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
            <figcaption className="mt-4">
              <h3 className="text-lg font-medium text-foreground mb-2">Kept: one pile, a beam for every name</h3>
              <p className={paragraph}>
                Every name stays reachable. When it gets crowded, the grid takes over.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="preview">
        <ShowcaseClip
          eyebrow="Preview"
          title="Open one. Then the next."
          caption="Hover a diamond to see its name, click it, and it opens as a preview. Next and Previous step through them like a gallery, so a PM can catch up on a month of design work in a minute."
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
          Each prototype is linked to its task in our project management tool and its Figma file.
          The task gets the link on its own, and the diamond shows how far along it is.
        </p>
        <PmGraphic />
      </section>

      <section id="how">
        <p className={eyebrow}>Built for AI</p>
        <h2 className={heading}>Just ask.</h2>
        <p className={`${paragraph} max-w-xl`}>
          Nobody writes prototypes by hand. Designers and developers tell Claude what they want,
          in plain English, and developers get the design back as a diff.
        </p>
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
        <p className={`${paragraph} mb-6 max-w-xl`}>
          In four weeks: 13 prototypes in one library and one deploy pipeline instead of one per
          prototype.
        </p>
        <OutcomeCards
          items={[
            { title: "All in one place", description: "Nothing gets deleted to save space any more." },
            { title: "Easy to add or change", description: "Anyone can add or edit a prototype by asking Claude." },
            {
              title: "Faster to build for real",
              description: "Prototypes use the real codebase and design system, so developers have little left to change.",
            },
            { title: "Easier reviews", description: "Managers click through real prototypes, all in one place." },
          ]}
        />
      </section>

      <section id="next">
        <h2 className={heading}>What's next</h2>
        <p className={`${paragraph} max-w-xl`}>
          Adding and editing prototypes right in the hub. I built it, then switched it off with
          our infrastructure engineer: it cost too many credits, and everyone already uses Claude
          in the terminal.
        </p>
      </section>
    </>
  ),
}
