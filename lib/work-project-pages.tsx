import Image from "next/image"
import type { ReactNode } from "react"
import { LiveopsBackgroundBlock } from "@/components/work/liveops-background-block"

export type WorkProjectSection = {
  id: string
  title: string
  isParent?: boolean
  parent?: string
}

export type WorkProjectMetaItem = {
  label: string
  values: string[]
}

export type WorkProjectPage = {
  description: string
  meta: WorkProjectMetaItem[]
  sections: WorkProjectSection[]
  renderBeforeGate: () => ReactNode
  renderAfterGate?: () => ReactNode
}

type WorkProjectSlug =
  | "liveops-alerting"
  | "game-setup-automation"
  | "travel-planning"
  | "game-setup-v2"

function InsightCards({
  items,
}: {
  items: Array<{
    title: string
    description: string
  }>
}) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm font-medium text-foreground">{item.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  )
}

function OutcomeCards({
  items,
}: {
  items: Array<{
    title: string
    description: string
  }>
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="bg-accent/20 p-6 rounded-lg">
          <p className="text-sm font-medium text-[var(--text-tertiary)] mb-2">{item.title}</p>
          <p className="text-base text-foreground">{item.description}</p>
        </div>
      ))}
    </div>
  )
}

function CaseStudyImage({
  src,
  alt,
  priority = false,
  background = true,
}: {
  src: string
  alt: string
  priority?: boolean
  background?: boolean
}) {
  return (
    <div className={`mt-8 relative aspect-video overflow-hidden ${background ? "rounded-lg bg-card" : ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-contain"
        sizes="(max-width: 768px) 100vw, 60vw"
      />
    </div>
  )
}

const liveopsAlertingPage: WorkProjectPage = {
  description:
    "Surfacing critical production failures in real time to reduce incidents and player impact.",
  meta: [
    { label: "Role", values: ["Product Designer"] },
    { label: "Timeline", values: ["August - September 2025"] },
    { label: "Team", values: ["3 Designers"] },
    { label: "Skills", values: ["Product Design", "Product Strategy", "Prototyping"] },
  ],
  sections: [
    { id: "overview", title: "Overview" },
    { id: "problem", title: "The problem" },
    { id: "goal", title: "Goal" },
    { id: "discovery", title: "Discovery" },
    { id: "solution", title: "Solution", isParent: true },
    { id: "homepage", title: "Homepage: Early Visibility", parent: "solution" },
    { id: "sidebar", title: "Sidebar: Persistent Attention", parent: "solution" },
    { id: "list-views", title: "List Views: Awareness to Action", parent: "solution" },
    { id: "ownership", title: "Ownership and Watchers", parent: "solution" },
    { id: "notifications", title: "Notification Settings", parent: "solution" },
    { id: "tradeoffs", title: "Key tradeoffs" },
    { id: "impact", title: "Impact" },
  ],
  renderBeforeGate: () => (
    <>
      <LiveopsBackgroundBlock />

      <section id="goal">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Goal</h2>
        <div className="bg-accent/20 border-l-4 border-accent p-6 rounded-r-lg">
          <p className="text-lg font-medium text-foreground">
            Surface backend failures to LiveOps creators early so they can act before players are
            affected
          </p>
        </div>
      </section>

      <section id="discovery">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Discovery</h2>
        <h3 className="text-xl font-medium text-foreground mb-3">
          Critical signals lived outside the LiveOps Dashboard
        </h3>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          I worked closely with LiveOps creators, backend engineers, and support teams to
          understand how production issues were detected and handled in practice.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          While backend systems reliably flagged failures at runtime through monitoring and logs,
          creators had no direct visibility in the LiveOps Dashboard. Instead, they relied on
          indirect signals: Slack messages from engineers, support tickets, or noticing anomalies
          in player metrics.
        </p>
        <div className="mt-8 overflow-hidden">
          <Image
            src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610137/observability-gap.png"
            alt="Observability gap: alerts appear in engineering tools while the LiveOps Dashboard shows no alerts"
            width={1920}
            height={1080}
            className="w-full h-auto object-contain"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        </div>
      </section>
    </>
  ),
  renderAfterGate: () => (
    <>
      <section id="solution">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Solution</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          To close the observability gap, I redesigned the LiveOps Dashboard to surface the right
          signals, to the right people, at the right time. The solution combines UI surfacing with
          ownership and subscription logic, so failures are visible, actionable, and clearly owned.
        </p>
      </section>

      <section id="homepage">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
          Homepage: Early Visibility
        </h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          The homepage previously showed only creator-configured shortcuts, with no indication when
          systems were failing.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          I added 2 new sections at the top of the homepage:
        </p>
        <ul className="list-disc list-inside space-y-2 text-base text-[var(--text-secondary)] mb-4">
          <li>
            A critical issues banner that appears only when blocking issues exist and links directly
            to the Issues view
          </li>
          <li>
            A latest updates feed showing non-critical changes relevant to the logged-in user,
            scoped to resources they own or watch
          </li>
        </ul>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          These sections act as previews, helping creators understand the current state before they
          start configuring features.
        </p>
        <div className="mt-8 relative aspect-video overflow-hidden rounded-lg">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source
              src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610317/homepage-video.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section id="sidebar">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
              Sidebar: Persistent Attention Signals
            </h2>
            <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
              In practice, many users do not always land on the homepage. Some navigate directly to a
              specific game or resource.
            </p>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              To account for this, I made critical states visible directly in the left-hand sidebar,
              where they could not be missed. This ensures issues draw attention regardless of entry
              point, without interrupting workflows.
            </p>
          </div>
          <div className="w-full max-w-[320px] md:justify-self-end">
            <Image
              src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610095/sidebar-badges.png"
              alt="Sidebar with persistent attention badges for issues and updates"
              width={1920}
              height={1080}
              className="w-full h-auto object-contain"
              sizes="(max-width: 768px) 100vw, 44vw"
            />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4">
          <figure>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              >
                <source
                  src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610490/avatar-sidebar.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
            <figcaption className="mt-3 text-sm text-[var(--text-secondary)]">
              Avatar-level signal
            </figcaption>
          </figure>

          <figure>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              >
                <source
                  src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610494/game-sidebar.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
            <figcaption className="mt-3 text-sm text-[var(--text-secondary)]">
              Game-level signals
            </figcaption>
          </figure>
        </div>
      </section>
        <section id="list-views">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
          List Views: From Awareness to Action
        </h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Clicking into the Critical Issues or Latest Updates views reveals structured lists with
          clear context.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          For critical issues, users can see what is broken, where it occurs, which resources are
          affected, and how the issue was detected. Issues can be resolved or reopened, and deeper
          links provide access to backend or monitoring sources when needed.
        </p>
        <div className="mt-8 relative aspect-video overflow-hidden rounded-lg">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source
              src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610246/list-views1.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section id="ownership">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
          Ownership and Watchers
        </h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Alerting only works if responsibility is clear.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          I introduced ownership as a first-class concept across LiveOps resources. The creator
          becomes the default owner, ownership can be transferred, and owners are automatically
          subscribed to critical issues affecting their resources. Owners cannot unsubscribe from
          these issues.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4">
          <figure>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                <source
                  src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610439/transfer-ownership.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
            <figcaption className="mt-3 text-sm text-[var(--text-secondary)]">
              Transfering ownership of a resource
            </figcaption>
          </figure>

          <figure>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                <source
                  src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610331/adding-watcher.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
            <figcaption className="mt-3 text-sm text-[var(--text-secondary)]">
              Adding watcher to a resource
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="notifications">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
          Notification Settings
        </h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          To balance signal and noise, I designed a subscription-based notification model. Users can
          manage which games and resource types they follow, and whether they receive critical
          issues, updates, or both.
        </p>
        <CaseStudyImage src="/placeholder.jpg" alt="Notification settings" />
      </section>

      <section id="tradeoffs">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Key tradeoffs</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">Homepage as preview</h3>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Early versions showed only unread updates, causing items to disappear once marked as
              read. I changed this to show all updates from the last 10 days, treating the homepage
              as a preview while the full Updates view remains the source of truth.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">One badge per game</h3>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Separate badges for issues and updates created visual noise and were hard to scan at
              scale. I consolidated to a single, severity-based badge per game: red for critical
              issues, blue for updates only.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">No email notifications</h3>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Although email was initially considered, we removed it to avoid delayed responses and
              alert fatigue. The system focuses on in-dashboard alerts as the source of truth, with
              Slack used only for time-sensitive awareness.
            </p>
          </div>
        </div>
      </section>

      <section id="impact">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Impact</h2>
        <div className="mb-6">
          <OutcomeCards
            items={[
              {
                title: "Faster detection",
                description: "Critical failures detected in minutes instead of hours",
              },
              {
                title: "Less escalation",
                description: "Teams relied less on Slack and external monitoring",
              },
              {
                title: "22% fewer incidents",
                description: "One in five production issues caught before full rollout",
              },
              {
                title: "Trusted workflow",
                description: "Alerting system became part of daily LiveOps work",
              },
            ]}
          />
        </div>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          By embedding backend observability into the LiveOps Dashboard, teams shifted from
          reactive firefighting to proactive production awareness, reducing player impact while
          scaling safely across games and teams.
        </p>
      </section>
    </>
  ),
}

const gameSetupAutomationPage: WorkProjectPage = {
  description:
    "A workflow redesign for faster game setup, clearer configuration, and fewer manual release steps.",
  meta: [
    { label: "Role", values: ["Product Designer"] },
    { label: "Timeline", values: ["2025"] },
    { label: "Team", values: ["Cross-functional squad"] },
    { label: "Skills", values: ["Workflow Design", "Systems Thinking", "Prototyping"] },
  ],
  sections: [
    { id: "overview", title: "Overview" },
    { id: "challenge", title: "Challenge" },
    { id: "approach", title: "Approach" },
    { id: "system", title: "System design" },
    { id: "rollout", title: "Rollout" },
    { id: "impact", title: "Impact" },
  ],
  renderBeforeGate: () => (
    <>
      <section id="overview">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Overview</h2>
        <div className="space-y-4">
          <p className="text-base leading-relaxed text-[var(--text-secondary)]">
            This project focused on simplifying how teams create and configure new games inside an
            internal platform. What had grown into a fragile, multi-step process needed to become
            clearer, faster, and easier to scale across teams.
          </p>
          <p className="text-base leading-relaxed text-[var(--text-secondary)]">
            The goal was not just to reduce time-to-setup, but to make the workflow easier to learn
            and harder to misuse. That meant thinking about information architecture, sensible
            defaults, and how the UI could guide people through a complex configuration flow.
          </p>
        </div>
        <CaseStudyImage src="/images/project-game-setup.png" alt="Game setup automation overview" />
      </section>

      <section id="challenge">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Challenge</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          The previous setup experience required too much product and engineering context up front.
          Users had to jump across tools, remember naming conventions, and understand system-level
          dependencies before they could even complete a first draft.
        </p>
        <InsightCards
          items={[
            {
              title: "Too many handoffs",
              description: "Critical setup knowledge lived across docs, Slack, and individual team memory.",
            },
            {
              title: "High cognitive load",
              description: "Fields were technically accurate, but not grouped in a way that matched how people think.",
            },
            {
              title: "Scaling friction",
              description: "Every new release repeated the same manual coordination and verification steps.",
            },
          ]}
        />
      </section>

      <section id="approach">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Approach</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          I reframed the flow around the user’s mental model: define the game, configure the
          essentials, validate dependencies, then review before launch. Instead of one dense form,
          the experience becomes a guided setup sequence with clearer progress and stronger guardrails.
        </p>
        <ul className="list-disc list-inside space-y-2 text-base text-[var(--text-secondary)]">
          <li>Grouped related decisions into digestible steps</li>
          <li>Used defaults and helper text to reduce unnecessary choices</li>
          <li>Made validation visible earlier so errors were caught before submission</li>
        </ul>
      </section>

      <section id="system">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">System design</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          The redesign established a repeatable pattern for setup-heavy workflows: progressive
          disclosure, contextual guidance, and review states that help teams move confidently from
          draft to launch.
        </p>
        <CaseStudyImage src="/images/project-game-setup.png" alt="System design for setup workflow" />
      </section>

      <section id="rollout">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Rollout</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Because the workflow touched both product and engineering operations, rollout mattered as
          much as the UI itself. I focused on making the new structure easy to adopt incrementally,
          so teams could benefit from clearer setup without a disruptive process change.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          The resulting design provided a stronger foundation for future automation: once the flow
          becomes structured and reliable, more of it can be standardized, validated, and eventually
          generated.
        </p>
      </section>

      <section id="impact">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Impact</h2>
        <OutcomeCards
          items={[
            {
              title: "Clearer setup flow",
              description: "Teams could move through configuration in a more predictable sequence.",
            },
            {
              title: "Less manual interpretation",
              description: "The interface carried more of the logic instead of relying on tribal knowledge.",
            },
            {
              title: "Stronger foundation",
              description: "The new structure made future automation opportunities easier to identify.",
            },
            {
              title: "Better onboarding",
              description: "New users could understand the process faster without extensive support.",
            },
          ]}
        />
      </section>
    </>
  ),
}

const travelPlanningPage: WorkProjectPage = {
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

const designSystemPage: WorkProjectPage = {
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

const workProjectPages: Record<WorkProjectSlug, WorkProjectPage> = {
  "liveops-alerting": liveopsAlertingPage,
  "game-setup-automation": gameSetupAutomationPage,
  "travel-planning": travelPlanningPage,
  "game-setup-v2": designSystemPage,
}

export function getWorkProjectPage(slug: string) {
  return workProjectPages[slug as WorkProjectSlug]
}

