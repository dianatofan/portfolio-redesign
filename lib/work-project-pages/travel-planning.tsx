import type { WorkProjectPage } from "./types"
import { CaseStudyImage, InsightCards, OutcomeCards } from "./shared"

export const travelPlanningPage: WorkProjectPage = {
  description:
    "Exploring how travel planning could feel more inspiring, structured, and actionable inside Google Search.",
  meta: [
    { label: "Role", values: ["UX Engineer"] },
    { label: "Timeline", values: ["2024"] },
    { label: "Team", values: ["Design + engineering collaboration"] },
    { label: "Skills", values: ["Interaction Design", "Prototyping", "Concept Development"] },
  ],
  sections: [
    { id: "overview", title: "Overview" },
    { id: "opportunity", title: "Opportunity" },
    { id: "concept", title: "Concept" },
    { id: "experience", title: "Experience design" },
    { id: "validation", title: "Validation" },
    { id: "outcome", title: "Outcome" },
  ],
  renderBeforeGate: () => (
    <>
      <section id="overview">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Overview</h2>
        <div className="space-y-4">
          <p className="text-base leading-relaxed text-[var(--text-secondary)]">
            This concept explored how travel planning on Search could move beyond isolated results
            and become a more connected planning experience. Instead of asking users to stitch
            together inspiration, destinations, dates, and logistics themselves, the product could
            help structure the journey from intent to plan.
          </p>
          <p className="text-base leading-relaxed text-[var(--text-secondary)]">
            The design challenge was balancing inspiration with utility: keeping the experience
            visually rich while still giving users enough orientation and control to make decisions.
          </p>
        </div>
        <CaseStudyImage src="/images/project-travel.png" alt="Travel planning concept overview" />
      </section>

      <section id="opportunity">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Opportunity</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Travel planning often starts with broad, fuzzy intent. People explore destinations, save
          ideas, compare options, and only later turn that intent into an actionable itinerary. The
          opportunity was to design for that messy middle: the point where exploration should start
          becoming a plan.
        </p>
        <InsightCards
          items={[
            {
              title: "From search to planning",
              description: "Support users after discovery, not just at the moment of query.",
            },
            {
              title: "Lightweight structure",
              description: "Introduce helpful organization without making the experience feel heavy.",
            },
            {
              title: "Confidence building",
              description: "Help users compare options and feel progress as their trip takes shape.",
            },
          ]}
        />
      </section>

      <section id="concept">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Concept</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          I framed the concept around a modular planning surface that could gather destinations,
          highlights, and next steps into one evolving place. The product direction emphasized quick
          capture, flexible comparison, and a clear path from inspiration to commitment.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Rather than forcing a rigid itinerary too early, the experience stays fluid while still
          giving users the feeling that they are assembling something coherent.
        </p>
      </section>

      <section id="experience">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Experience design</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          The interaction model focused on progressive commitment: broad inspiration first, more
          concrete decisions later. Visual hierarchy, saved states, and structured modules all work
          together to keep the experience legible even as the plan becomes more detailed.
        </p>
        <CaseStudyImage src="/images/project-travel.png" alt="Travel planning experience design" />
      </section>

      <section id="validation">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Validation</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          High-fidelity prototypes helped communicate the concept and test whether the planning model
          felt intuitive. The value was not only in the polished visuals, but in making the proposed
          behaviors concrete enough for teams to react to and refine.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          This made it easier to discuss tradeoffs around scope, data density, and how far Search
          should go in supporting downstream planning actions.
        </p>
      </section>

      <section id="outcome">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Outcome</h2>
        <OutcomeCards
          items={[
            {
              title: "Stronger narrative",
              description: "The concept gave teams a clearer picture of what travel planning on Search could become.",
            },
            {
              title: "Prototype as alignment tool",
              description: "High-fidelity interaction design helped conversations move from abstract to actionable.",
            },
            {
              title: "Balanced direction",
              description: "The work explored how inspiration and practicality can coexist in one flow.",
            },
            {
              title: "Reusable thinking",
              description: "The structure is applicable to other exploratory planning problems as well.",
            },
          ]}
        />
      </section>
    </>
  ),
}

