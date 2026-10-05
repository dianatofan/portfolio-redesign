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
      values: ["Prototyping with AI", "Design Ops", "Developer Handoff"],
    },
  ],
  sections: [
    { id: "overview", title: "Overview" },
    { id: "problem", title: "Problem" },
    { id: "goal", title: "Goal" },
    { id: "findable", title: "Nothing gets lost", isGateStart: true },
    { id: "whats-new", title: "Showing what changed" },
    { id: "handoff", title: "Handoff as a patch" },
    { id: "diamonds", title: "Diamonds, literally" },
    { id: "agents", title: "Designed for agents" },
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
      <section id="findable">
        <h2 className={heading}>Nothing gets lost</h2>
        <p className={`${paragraph} mb-4`}>
          Alvaro Hernandez, an engineer, helped me set up the foundation: one repository and one
          address for every prototype. A new prototype costs nothing to keep, so nothing has to be
          deleted any more.
        </p>
        <p className={paragraph}>
          The grid view is for finding things. Each card has a thumbnail, a one-line description
          and the ticket's status. The status comes straight from our PM tool, so the hub can't go
          out of date. When a prototype deploys, its link is posted on the ticket, so the work and
          the prototype point to each other.
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

      <section id="whats-new">
        <h2 className={heading}>Showing what changed</h2>
        <p className={`${paragraph} mb-4`}>
          A prototype looks like the real app, so a reviewer opening one cold can't tell what's
          new. They click around the parts that already exist and miss the design.
        </p>
        <p className={paragraph}>
          So every prototype's details page shows the live prototype next to "What's new", an
          interactive walkthrough of the design. Clicking a step takes you to that screen and
          highlights the part that changed. A PM can review a prototype on their own, without me there to walk them
          through it.
        </p>
        <CaseStudyImage
          src="/images/dianas-diamonds/details.png"
          alt="A prototype's details page: the live prototype on the left, a numbered What's new list on the right"
          ratioClass="aspect-[8/5]"
        />
      </section>

      <section id="handoff">
        <h2 className={heading}>Handoff as a patch</h2>
        <p className={`${paragraph} mb-4`}>
          Every prototype records which parts of the real app it copied, and at which commit. That
          means the design can be separated from everything else.
        </p>
        <p className={paragraph}>
          One command compares a prototype with the real app and produces the design change as a
          patch, plus a list of the API endpoints the prototype assumes but that don't exist yet. A
          frontender starts from exactly what changed instead of reverse-engineering it from a
          separate repository.
        </p>
      </section>

      <section id="diamonds">
        <h2 className={heading}>Diamonds, literally</h2>
        <p className={`${paragraph} mb-4`}>
          The name started as a joke: my prototypes were "Diana's diamonds". I took it literally.
          The hub opens on a 3D field where diamonds fall from the sky and pile up under real
          gravity, one per prototype, tinted by the product it belongs to. I worked with game
          artists at Tactile on a diamond model that catches the light and still runs smoothly
          with 100+ on screen.
        </p>
        <p className={`${paragraph} mb-4`}>
          The field and the grid do different jobs. The field makes an internal tool feel like a
          collection worth adding to. The grid is for finding things. I kept both, one switch
          apart, so the delight never gets in the way of finding a prototype. The physics only
          runs while the diamonds fall, and visitors who prefer reduced motion get the settled
          pile straight away.
        </p>
        <figure className="mt-8">
          <div className="relative aspect-[8/5] overflow-hidden rounded-lg bg-card">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="/images/dianas-diamonds/field-drop-poster.jpg"
              aria-label="240 diamonds fall from the sky and settle into a pile in the field view"
              className="h-full w-full object-cover"
            >
              <source src="/images/dianas-diamonds/field-drop.mp4" type="video/mp4" />
            </video>
          </div>
          <figcaption className="mt-3 text-sm text-[var(--text-tertiary)]">
            A stress test with 240 diamonds, the scale the field was built for.
          </figcaption>
        </figure>
      </section>

      <section id="agents">
        <h2 className={heading}>Designed for agents</h2>
        <p className={`${paragraph} mb-4`}>
          Designers don't write prototypes by hand. They direct an AI agent, so the agent is a
          user of the library too. I wrote the repository's rules for it: short and checkable,
          like "copy the real app's code, don't rewrite it". A single check enforces them before
          anything deploys, so a prototype stays honest about what is design and what is copied.
        </p>
        <p className={paragraph}>
          The same idea made the library work without me. A new designer pastes one message into
          Claude Code and it sets up their machine. Anyone, even without a setup, can ask for a
          new prototype or a change from a form in the hub. An agent builds it and opens a pull
          request.
        </p>
      </section>

      <section id="impact">
        <h2 className={heading}>Impact</h2>
        {/* TODO: add real numbers: how many designers add prototypes, how many came from the
            request form, and how long the shipped handoff took compared with before. */}
        <OutcomeCards
          items={[
            {
              title: "13 prototypes, one home",
              description: "Nothing gets deleted any more, and past work stays findable.",
            },
            {
              title: "Shipped to production",
              description: "A frontender built a prototype in the real dashboard from its patch.",
            },
            {
              title: "Used beyond me",
              description: "Other designers add prototypes, and stakeholders review in the hub.",
            },
          ]}
        />
      </section>
    </>
  ),
}
