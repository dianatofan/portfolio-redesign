import type { WorkProjectPage } from "./types"
import { CaseStudyImage, InsightCards, OutcomeCards } from "./shared"

export const designSystemPage: WorkProjectPage = {
  description:
    "Building a stronger shared system to reduce design debt and make product teams faster and more consistent.",
  meta: [
    { label: "Role", values: ["Product Designer"] },
    { label: "Timeline", values: ["2024"] },
    { label: "Team", values: ["Design system initiative"] },
    { label: "Skills", values: ["Design Systems", "Documentation", "Cross-team Alignment"] },
  ],
  sections: [
    { id: "overview", title: "Overview" },
    { id: "problem", title: "Problem" },
    { id: "principles", title: "Principles" },
    { id: "system", title: "System building" },
    { id: "adoption", title: "Adoption" },
    { id: "impact", title: "Impact" },
  ],
  renderBeforeGate: () => (
    <>
      <section id="overview">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Overview</h2>
        <div className="space-y-4">
          <p className="text-base leading-relaxed text-[var(--text-secondary)]">
            This project focused on reducing design debt by creating a more consistent, reusable
            system across the product. Instead of solving the same UI problems again and again, the
            goal was to establish shared building blocks that improved speed, quality, and alignment.
          </p>
          <p className="text-base leading-relaxed text-[var(--text-secondary)]">
            The challenge was as much organizational as visual: a design system only works when it
            reflects real product needs and becomes easy for teams to trust and adopt.
          </p>
        </div>
        <CaseStudyImage src="/images/project-famly.png" alt="Design system overview" />
      </section>

      <section id="problem">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Problem</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Inconsistent patterns, duplicated components, and one-off fixes had gradually increased the
          cost of shipping. Even small UI changes required more discussion and cleanup than they
          should have, and teams lacked a common source of truth for interaction and visual behavior.
        </p>
        <InsightCards
          items={[
            {
              title: "Fragmented patterns",
              description: "The same interaction appeared differently across products and squads.",
            },
            {
              title: "Slow decision-making",
              description: "Teams repeatedly debated solved problems because there was no clear baseline.",
            },
            {
              title: "Design debt accumulation",
              description: "Short-term shipping choices compounded into long-term inconsistency.",
            },
          ]}
        />
      </section>

      <section id="principles">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Principles</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          I defined the system around a few practical principles: clarity over decoration,
          composability over one-off screens, and documentation that supports real implementation.
        </p>
        <ul className="list-disc list-inside space-y-2 text-base text-[var(--text-secondary)]">
          <li>Design components around real product use cases</li>
          <li>Keep tokens and patterns simple enough to scale</li>
          <li>Document intent so teams understand when and why to use each pattern</li>
        </ul>
      </section>

      <section id="system">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">System building</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          The work included defining reusable components, aligning interaction behavior, and creating
          a stronger relationship between design decisions and implementation. That helps the system
          stay maintainable instead of becoming another layer of abstraction.
        </p>
        <CaseStudyImage src="/images/project-famly.png" alt="Design system building" />
      </section>

      <section id="adoption">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Adoption</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Adoption depended on making the system genuinely useful. I focused on patterns teams could
          apply immediately, clear documentation, and a shared language that helped product, design,
          and engineering collaborate with less friction.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          This turned the system from a library into a workflow tool: something that supports faster
          decisions and more predictable execution.
        </p>
      </section>

      <section id="impact">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Impact</h2>
        <OutcomeCards
          items={[
            {
              title: "More consistency",
              description: "Shared patterns reduced variation across products and features.",
            },
            {
              title: "Less repeat work",
              description: "Teams could reuse decisions instead of redesigning common UI from scratch.",
            },
            {
              title: "Clearer collaboration",
              description: "A common system made design and engineering handoff more predictable.",
            },
            {
              title: "Lower design debt",
              description: "The product gained a path toward cleaner, more scalable UX over time.",
            },
          ]}
        />
      </section>
    </>
  ),
}

