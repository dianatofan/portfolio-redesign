import type { WorkProjectPage } from "./types"

function Placeholder({
  label,
  ratioClass = "aspect-video",
}: {
  label: string
  ratioClass?: string
}) {
  return (
    <div
      className={`mt-8 relative ${ratioClass} w-full overflow-hidden rounded-lg bg-card border border-dashed border-border flex items-center justify-center`}
    >
      <span className="px-6 text-center text-sm text-[var(--text-tertiary)]">{label}</span>
    </div>
  )
}

export const releaseTimelinePage: WorkProjectPage = {
  description:
    "A release timeline that brings releases, configuration changes, and operational metrics into one view, so teams can see what changed and debug faster.",
  subtitle: "Building a release timeline to reduce debugging time",
  heroImage: "/images/placeholder.svg",
  meta: [
    { label: "Role", values: ["Product Designer"] },
    { label: "Team", values: ["CTO", "Product Manager", "Engineers"] },
  ],
  sections: [
    { id: "problem", title: "The Problem" },
    { id: "where", title: "Where should this live?" },
    { id: "how", title: "How should it work?" },
    { id: "production", title: "From Idea to Production" },
    { id: "outcome", title: "Outcome" },
  ],
  renderBeforeGate: () => (
    <>
      <section id="problem">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">The Problem</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Working on live games taught me that when something breaks, the first question is rarely
          why.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          It&apos;s usually: <span className="font-medium text-foreground">What changed?</span>
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          A release, configuration update, experiment rollout, or backend change could all impact
          player experience, but the information lived across multiple tools. Teams spent valuable
          time stitching together release history, configuration changes, and monitoring data
          before they could start debugging.
        </p>
        <Placeholder label="[IMAGE — Final timeline hero image]" />
      </section>

      <section id="where">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
          Where should this live?
        </h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          My first concept was a dedicated Release Timeline page containing operational metrics,
          release history, summary cards, and a side panel that updated as users explored the
          graph.
        </p>
        <Placeholder label="[IMAGE — Initial dedicated Release Timeline page]" />
        <p className="mt-8 text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          After reviewing the concept with stakeholders, we realized investigations already started
          from the Releases page. Instead of creating another destination, I integrated the timeline
          directly into the existing workflow.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          The final solution lives inside Releases and stays collapsed until teams need additional
          context.
        </p>
        <Placeholder label="[GIF — Expand / collapse timeline inside Releases page]" />
      </section>

      <section id="how">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
          How should it work?
        </h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          My first exploration plotted releases and configuration changes directly on the graph
          using lollipop markers.
        </p>
        <Placeholder label="[IMAGE — Lollipop exploration]" />
        <p className="mt-8 text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          While this made correlations obvious, it quickly became cluttered as more releases,
          experiments, and configuration changes were added.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          I moved events into a dedicated timeline below the graph, keeping operational metrics
          readable while preserving the relationship between changes and incidents.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          I also simplified event visualization, replacing text-based markers with color and
          shape-based indicators that are easier to scan at a glance.
        </p>
        <Placeholder label="[IMAGE — Final timeline with event lane]" />
      </section>

      <section id="production">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
          From Idea to Production
        </h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          My background in frontend engineering has fundamentally changed how I design.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Instead of relying solely on mockups, I increasingly prototype complex interactions in
          code. For this project, I connected Claude Code directly to the LiveOps Dashboard codebase
          and design system, allowing me to build against the same components engineers use in
          production.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          The timeline itself was hand-built in SVG to give complete control over event rendering,
          overlays, tooltips, and interactions.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Because the prototype reflected real implementation constraints, engineers were able to
          use it directly as the foundation for the shipped feature.
        </p>
        <Placeholder label="[GIF — Hover interactions, tooltips, overlays, event selection]" />
      </section>

      <section id="outcome">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Outcome</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          The final design brought releases, configuration changes, and operational metrics into a
          single workflow, helping teams answer a simple question much faster:{" "}
          <span className="font-medium text-foreground">What changed?</span>
        </p>
      </section>
    </>
  ),
}
