import type { WorkProjectPage } from "./types"
import { CaseStudyImage, CaseStudyImageGrid, InsightCards, OutcomeCards } from "./shared"

const paragraph = "text-base leading-relaxed text-[var(--text-secondary)]"
const heading = "text-2xl md:text-3xl font-medium text-foreground mb-4"

export const dianasDiamondsPage: WorkProjectPage = {
  displayTitle: "Diana's Diamonds: a home for every prototype",
  subtitle:
    "With AI I was building prototypes faster than anyone could keep track of them, so I built a catalogue for them.",
  heroImage: "/images/dianas-diamonds/field.png",
  description:
    "A scalable catalogue for AI-built prototypes at Tactile: one place to find them, see what changed, and ship them to production.",
  meta: [
    { label: "Role", values: ["Product Designer", "Design Engineer"] },
    { label: "Duration", values: ["Sep – Oct 2026"] },
    { label: "Type", values: ["Work project"] },
    {
      label: "Skills",
      values: ["Prototyping with AI", "WebGL", "Design Ops"],
    },
  ],
  sections: [
    { id: "overview", title: "Overview" },
    { id: "problem", title: "Problem" },
    { id: "goal", title: "Goal" },
    { id: "diamonds", title: "Diamonds, literally", isGateStart: true },
    { id: "field", title: "Field view" },
    { id: "grid", title: "Grid view" },
    { id: "preview", title: "Preview" },
    { id: "workflow", title: "Wired into the workflow" },
    { id: "legacy", title: "Built to outlive me" },
    { id: "impact", title: "Impact" },
  ],
  renderBeforeGate: () => (
    <>
      <section id="overview">
        <h2 className={heading}>Overview</h2>
        <p className={`${paragraph} mb-4`}>
          At Tactile we use AI heavily. I design by building prototypes with Claude directly on
          top of our real source code, so the prototype is the source of truth and Figma comes
          second. In my final month at the company, I took on one last initiative: leaving a
          legacy for the designer who comes after me.
        </p>
        <p className={paragraph}>
          That makes prototypes cheap, so there are a lot of them. Every company working this way
          now faces the same questions: where do they live, and how do you get value from one
          after the meeting it was made for?
        </p>
      </section>

      <section id="problem">
        <h2 className={heading}>Problem</h2>
        <p className={paragraph}>
          Every prototype was its own repository and deploy. I cleaned old ones up regularly, so
          when someone asked to see a past prototype, it was often gone.
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
            One permanent home where anyone can find a prototype, see what it changes, and ship
            it. It had to scale from 13 prototypes to 100+.
          </p>
        </div>
      </section>
    </>
  ),
  renderAfterGate: () => (
    <>
      <section id="diamonds">
        <h2 className={heading}>Diamonds, literally</h2>
        <p className={`${paragraph} mb-4`}>
          The name started as a joke: my prototypes were "Diana's diamonds". I took it literally,
          so every prototype in the library is a diamond rendered in WebGL.
        </p>
        <p className={paragraph}>
          I worked with game artists at Tactile on a polished diamond model I could reuse for
          every stone. It had to look real and catch the light, and still stay fast with 100+
          prototypes on screen.
        </p>
      </section>

      <section id="field">
        <h2 className={heading}>Field view</h2>
        <p className={paragraph}>
          The hub opens on an interactive 3D field. Diamonds fall from the sky and pile up under
          real gravity, each one tinted by the product it belongs to. Physics only runs during
          the fall and then sleeps, and visitors who prefer reduced motion skip straight to the
          settled pile.
        </p>
        <CaseStudyImage
          src="/images/dianas-diamonds/field.png"
          alt="The field view: a pile of 3D diamonds, one per prototype, with filters above"
          ratioClass="aspect-[8/5]"
        />
      </section>

      <section id="grid">
        <h2 className={heading}>Grid view</h2>
        <p className={paragraph}>
          When you are looking for something specific, one switch turns the field into a grid.
          Each card shows a thumbnail, a title, a one-line description and the ticket's status,
          with filters and search above.
        </p>
        <CaseStudyImageGrid
          images={[
            { src: "/images/dianas-diamonds/proto-child-ab-tests.png", alt: "Config holdout groups prototype" },
            { src: "/images/dianas-diamonds/proto-user-support.png", alt: "User support prototype" },
            { src: "/images/dianas-diamonds/proto-sdk-size.png", alt: "SDK size prototype" },
            { src: "/images/dianas-diamonds/proto-config-changelog.png", alt: "Config changelog prototype" },
          ]}
        />
      </section>

      <section id="preview">
        <h2 className={heading}>Preview</h2>
        <p className={`${paragraph} mb-4`}>
          Clicking any diamond or card opens a preview with the screenshot and a short
          description, so you can skim through prototypes one after another.
        </p>
        <p className={paragraph}>
          From there, the details page shows the live prototype next to a numbered "What's new"
          list. Clicking a step highlights the part of the screen that changed.
        </p>
        <CaseStudyImage
          src="/images/dianas-diamonds/details.png"
          alt="A prototype's details page: the live prototype on the left, a numbered What's new list on the right"
          ratioClass="aspect-[8/5]"
        />
      </section>

      <section id="workflow">
        <h2 className={heading}>Wired into the workflow</h2>
        <p className={paragraph}>
          Alvaro Hernandez, an engineer, helped me set up the infrastructure: one repository and
          one address for every prototype. On top of it I added automations so the library
          updates itself.
        </p>
        <InsightCards
          items={[
            {
              title: "Deploys post themselves",
              description: "Each deploy comments the prototype's link on its PM ticket.",
            },
            {
              title: "Status comes from PM",
              description: "Cards show the ticket's live status, so the hub never goes stale.",
            },
            {
              title: "Handoff as code",
              description: "One command turns a prototype into a patch for the real app.",
            },
          ]}
        />
      </section>

      <section id="legacy">
        <h2 className={heading}>Built to outlive me</h2>
        <p className={paragraph}>
          Because this was my legacy, it had to work without me. A new designer pastes one message into Claude Code and it sets up their machine. Clear
          guides then cover how to add or edit a prototype.
        </p>
      </section>

      <section id="impact">
        <h2 className={heading}>Impact</h2>
        <OutcomeCards
          items={[
            {
              title: "13 prototypes, one home",
              description: "Nothing gets cleaned out any more, and past work stays findable.",
            },
            {
              title: "Shipped to production",
              description: "A frontender built a prototype in the real dashboard from its handoff.",
            },
            {
              title: "Used beyond me",
              description: "Other designers add prototypes, and stakeholders review in the hub.",
            },
            {
              title: "A legacy, not a backlog",
              description: "The next designer inherits a working system, not a pile of repos.",
            },
          ]}
        />
      </section>
    </>
  ),
}
