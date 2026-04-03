import type { WorkProjectPage } from "./types"
import { BeforeAfterCompare, CaseStudyImage, CaseStudyImageGrid, InsightCards, OutcomeCards } from "./shared"

export const designSystemPage: WorkProjectPage = {
  displayTitle: "Building a design system to eliminate design debt",
  heroImage: "https://res.cloudinary.com/dzpdf5ygh/image/upload/v1775069463/cover_1.png",
  meta: [
    { label: "Role", values: ["UX/UI Designer"] },
    { label: "Duration", values: ["3 months"] },
    { label: "Type", values: ["Work project"] },
    {
      label: "Skills",
      values: ["Design Systems", "Developer Handoff", "Documentation"],
    },
  ],
  sections: [
    { id: "overview", title: "Overview" },
    { id: "problem", title: "Problem" },
    { id: "goal", title: "Goal" },
    { id: "strategy", title: "Strategy" },
    { id: "rollout", title: "Rollout" },
    { id: "before-after", title: "Before & After" },
    { id: "ui-in-practice", title: "UI in Practice" },
    { id: "impact", title: "Impact" },
  ],
  renderBeforeGate: () => (
    <>
      <section id="overview">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Overview</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          In Famly's early days, engineers built the UI using an off-the-shelf UI kit to move
          fast. It worked until the product scaled. As the codebase grew, that approach started
          creating real cracks: inconsistent patterns, rising support calls, and usability issues
          that were hard to trace and harder to fix. The work became about replacing that foundation
          with something the team actually owned.
        </p>
      </section>

      <section id="problem">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Problem</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Scaling on top of a UI kit the team didn't control left visible seams across the product.
          Users ran into inconsistent interactions and confusing flows, which drove up support
          volume. Internally, engineers were patching the same things repeatedly with no shared
          reference to align on.
        </p>
        <InsightCards
          items={[
            {
              title: "Usability gaps at scale",
              description:
                "Patterns that worked early became confusing as the product grew, leading to a spike in user support calls.",
            },
            {
              title: "No shared source of truth",
              description:
                "Without ownership over the UI layer, teams made inconsistent decisions and repeated the same fixes.",
            },
            {
              title: "Slow delivery",
              description:
                "Engineers rebuilt common patterns from scratch each time, making even small UI changes expensive.",
            },
          ]}
        />
      </section>


        <section id="goal">
            <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Goal</h2>
            <div className="bg-accent/20 border-l-4 border-accent p-6 rounded-r-lg">
                <p className="text-lg font-medium text-foreground">
                    Replace the inherited UI kit with a design system Famly owned end-to-end — one that
                    reduced inconsistency, made delivery faster, and gave both design and engineering a
                    shared language to build from.</p>

            </div>
        </section>


      <section id="strategy">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Strategy</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          I audited the product to find where inconsistency was costing the team, then conducted
          user interviews across the company to understand the biggest pain points and identify
          which components to prioritise first. We focused on the patterns touched most often, the
          ones where fixing the foundation would make the biggest difference to delivery and the
          user experience.
        </p>
        <CaseStudyImage
          src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610230/phase1.png"
          alt="Design system phased rollout plan"
        />
      </section>

      <section id="rollout">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Rollout</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          The system was built across Figma, React, and Storybook, starting with typography,
          colour, spacing, and the component patterns that appeared everywhere. Documentation
          covered not just what existed, but when and how to use it. To drive product adoption, we
          presented updates at the weekly company demo and shared progress through internal email
          newsletters so teams stayed in the loop as the system grew.
        </p>
        <div className="mt-8 rounded-lg overflow-hidden bg-card">
          <CaseStudyImage src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769609987/styleguide1.png" alt="Style guide — typography and colour" topMargin={false} background={false} />
          <CaseStudyImage src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769609978/styleguide2.png" alt="Style guide — spacing and layout" topMargin={false} background={false} />
          <CaseStudyImage src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769609981/styleguide3.png" alt="Style guide — iconography" topMargin={false} background={false} />
          <CaseStudyImage src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610074/components1.png" alt="Component library — form elements" topMargin={false} background={false} />
          <CaseStudyImage src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769609990/components2.png" alt="Component library — navigation and feedback" topMargin={false} background={false} />
        </div>
      </section>

      <section id="before-after">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Before &amp; After</h2>
        <BeforeAfterCompare
          pairs={[
            {
              before: "https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610159/before1.png",
              after: "https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769609975/after1.png",
              caption: "Profile page",
            },
            {
              before: "https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610224/before2.png",
              after: "https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610221/after2.png",
              caption: "Newsfeed",
            },
          ]}
        />
      </section>

      <section id="ui-in-practice">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">UI in Practice</h2>
        <CaseStudyImage
          src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610265/ui.png"
          alt="Design system applied in the product UI"
          fit="cover"
        />
      </section>

      <section id="impact">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Impact</h2>
        <OutcomeCards
          items={[
            {
              title: "35% faster UI development",
              description:
                "Teams stopped rebuilding common patterns and spent more time shipping product work.",
            },
            {
              title: "18% fewer support calls",
              description:
                "A more consistent product reduced user confusion and eased pressure on support.",
            },
            {
              title: "Stronger design-dev alignment",
              description:
                "A shared language made handoff clearer and reduced back-and-forth between teams.",
            },
            {
              title: "A foundation the team owns",
              description:
                "Instead of working around a third-party kit, teams had a system they could extend and trust.",
            },
          ]}
        />
      </section>
    </>
  ),
}
