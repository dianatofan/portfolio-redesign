import type { WorkProjectPage } from "./types"
import { CaseStudyImage, CaseStudyImageGrid, InsightCards, OutcomeCards } from "./shared"

export const dianasDiamondsPage: WorkProjectPage = {
  displayTitle: "Diana's Diamonds: a home for every prototype",
  subtitle:
    "With AI, I was building prototypes faster than anyone could keep track of them. So I built a catalogue that collects, explains and hands them off.",
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
    { id: "name", title: "A joke, taken literally" },
    { id: "one-library", title: "One library", isGateStart: true },
    { id: "catalogue", title: "A catalogue, not a folder" },
    { id: "what-changed", title: "Showing what changed" },
    { id: "handoff", title: "From prototype to production" },
    { id: "automations", title: "Wired into the workflow" },
    { id: "legacy", title: "Built to outlive me" },
    { id: "impact", title: "Impact" },
  ],
  renderBeforeGate: () => (
    <>
      <section id="overview">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Overview</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          AI has changed what a prototype is. A designer no longer clicks a flow together in
          Figma. They ask an agent to build the change on top of the real product's source code,
          and an hour later there is a working version anyone can open. At Tactile this became my
          main way of designing: the coded prototype was the source of truth, and Figma came
          second.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          That speed creates a new problem. When prototypes are cheap, there are a lot of them,
          and nearly every company that works this way now struggles with the same questions.
          Where do they all live? Which one is current? And how do you get value out of a
          prototype after the meeting it was made for? Diana's Diamonds is my answer: a
          catalogue for every prototype, designed to keep working as the number grows.
        </p>
      </section>

      <section id="problem">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Problem</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Every prototype I built was its own repository with its own deploy, domain and login.
          Within a few months there were eight of them on GitHub, plus a handful of local folders
          that never made it online. To keep things manageable, I periodically cleaned up the old
          ones. Then a PM or a lead would ask to see a past prototype again, and it was nowhere to
          be found.
        </p>
        <InsightCards
          items={[
            {
              title: "Prototypes got lost",
              description:
                "Links were scattered across Slack and tickets, and cleaned-up repos took past work with them. Nobody could find what had already been explored.",
            },
            {
              title: "Nothing said what changed",
              description:
                "A prototype is a copy of the real app with a design change somewhere in it. On screen, nothing showed which part was new.",
            },
            {
              title: "Every prototype started from zero",
              description:
                "Each new one meant another repo, deploy, domain and access setup, and the copies drifted apart within weeks.",
            },
          ]}
        />
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mt-6">
          The handoff was the most expensive part. A frontender who wanted to build a design had
          to reverse-engineer the change from a separate repository, with no record of what was
          design and what was just copied from the real app.
        </p>
      </section>

      <section id="goal">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Goal</h2>
        <div className="bg-accent/20 border-l-4 border-accent p-6 rounded-r-lg">
          <p className="text-lg font-medium text-foreground">
            Give every prototype one permanent home where anyone in the company can find it,
            understand what it changes, and take it to production. It also had to make adding the
            next one easy, whether that was prototype number 13 or 130.
          </p>
        </div>
      </section>

      <section id="name">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">A joke, taken literally</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          The name started as a joke: my prototypes were "Diana's diamonds". I took it literally.
          The hub opens on a field of shiny, three-dimensional diamonds, each one a prototype I
          built, tinted by the product it belongs to. It is a small piece of delight in an
          internal tool, and it makes the library feel like a collection worth adding to rather
          than a folder to dig through.
        </p>
      </section>
    </>
  ),
  renderAfterGate: () => (
    <>
      <section id="one-library">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">One library</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          I proposed moving every prototype into one place and worked with Alvaro Hernandez, an
          engineer, who set up the infrastructure. It became one repository, one service and one
          address, with each prototype at its own path.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          One rule shaped the rest: a prototype is a snapshot. Each one keeps the design-system
          version the real app had on the day it started, and nobody upgrades it later. A
          prototype from June still looks exactly like the product did in June. That made the
          library safe to keep forever, because nothing old can quietly break.
        </p>
      </section>

      <section id="catalogue">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">A catalogue, not a folder</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          I designed the hub like a Figma file's component catalogue. Besides the diamond field,
          there is a grid of screenshot cards grouped by product area. Each card shows a title, a
          one-line tagline, the ticket's status and how recently it changed. You can filter by
          product and status, search with a shortcut, and sort by "status changed" so the work
          that just moved comes first. Every filter is kept in the URL, so a filtered view can be
          shared in Slack.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          The hub works on every screen size, from a full filter bar on desktop to a bottom sheet
          on a phone, because reviews increasingly happen away from a desk.
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

      <section id="what-changed">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Showing what changed</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Because a prototype is a slice of the real app with a design change somewhere in it,
          the most important question in a review is "what's new?". Each prototype's details
          page answers it. The live prototype sits in a frame, with a short "What it is" beside
          it, then a numbered "What's new" list. Clicking a step dims the prototype and
          highlights the part that changed, so a reviewer gets a guided walkthrough instead of
          hunting for the difference.
        </p>
        <CaseStudyImage
          src="/images/dianas-diamonds/details.png"
          alt="A prototype's details page: the live prototype framed on the left, What it is and a numbered What's new walkthrough on the right"
          ratioClass="aspect-[8/5]"
        />
      </section>

      <section id="handoff">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">From prototype to production</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Since each prototype records exactly which version of the real app it copied, the
          library can compare the two. One command produces a summary of the design change and a
          patch the frontender applies directly in the real codebase, along with the API the
          design assumes and what not to port. The details page spells out the steps, including
          the sentence to give Claude. A design no longer has to be rebuilt from screenshots. The
          code itself is the handoff.
        </p>
      </section>

      <section id="automations">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Wired into the workflow</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          A catalogue only stays useful if it doesn't depend on someone remembering to update it.
          So I connected each prototype to its Figma file and to its ticket in PM, Tactile's
          in-house project tool, and automated the rest.
        </p>
        <InsightCards
          items={[
            {
              title: "Deploys post themselves",
              description:
                "Every deploy comments the prototype's link on its PM ticket, so the people following the ticket see it without asking.",
            },
            {
              title: "Status comes from PM",
              description:
                "A card's status is the ticket's status, and a deploy moves the ticket to In Progress. The hub never goes stale.",
            },
            {
              title: "Everything one click away",
              description:
                "Each details page links to its Figma file, repository and ticket, so design, code and decisions stay connected.",
            },
          ]}
        />
      </section>

      <section id="legacy">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Built to outlive me</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          I built the library knowing I was leaving Tactile. I wanted the designer hired after
          me to pick up my work from day one, and at a company where Claude Code prototypes are
          the main source of truth, that meant making the library easy to add to without me.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          So the instructions are written for two readers: the designer and the agent. A new
          designer installs Claude Code and pastes one message, and the agent sets up their
          machine and checks its own work. A guide then says what to tell it to start, iterate
          and ship a prototype, and a separate guide does the same for frontenders. The rules
          every prototype must follow are checked automatically, so quality holds as the library
          grows. Nothing depends on my accounts or my machine.
        </p>
      </section>

      <section id="impact">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Impact</h2>
        <OutcomeCards
          items={[
            {
              title: "13 prototypes, one address",
              description:
                "Eight separate repositories and deploys, plus prototypes that only existed on my laptop, now live in one catalogue that nothing gets cleaned out of.",
            },
            {
              title: "Shipped to production",
              description:
                "A frontender implemented a prototype in the real dashboard straight from the library's handoff.",
            },
            {
              title: "Used beyond me",
              description:
                "Other designers have built prototypes through the library, and stakeholders review designs in the hub instead of asking for links.",
            },
            {
              title: "A legacy, not a backlog",
              description:
                "The next designer inherits a working system with clear instructions, rather than a pile of repositories to decode.",
            },
          ]}
        />
      </section>
    </>
  ),
}
