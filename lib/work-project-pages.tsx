import Image from "next/image"
import type { ReactNode } from "react"
import { LiveopsBackgroundBlock } from "@/components/work/liveops-background-block"
import { BeforeAfterVideoCard } from "@/components/work/before-after-video-card"
import ForceGraph from "@/components/work/force-graph"
import type { LucideIcon } from "lucide-react"
import { Bot, Clock3, ShieldCheck, Wrench } from "lucide-react"

export type WorkProjectSection = {
  id: string
  title: string
  isParent?: boolean
  parent?: string
  isGateStart?: boolean
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

function ConstraintCards({
  items,
}: {
  items: Array<{
    title: string
    description: string
    icon: LucideIcon
  }>
}) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item) => {
        const Icon = item.icon

        return (
          <div key={item.title} className="rounded-lg border border-border bg-card p-5">
            <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-foreground">
              <Icon size={18} aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-foreground">{item.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {item.description}
            </p>
          </div>
        )
      })}
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
    { label: "Duration", values: ["3 months"] },
    { label: "Team", values: ["Product Manager, CTO, 2 BE Engineers, 1 FE Engineer"] },
    { label: "Skills", values: ["Product Design", "Product Strategy", "Prototyping"] },
  ],
  sections: [
    { id: "overview", title: "Context" },
    { id: "problem", title: "The problem" },
    { id: "goal", title: "Goal" },
    { id: "discovery", title: "Discovery" },
    { id: "solution", title: "Solution", isParent: true, isGateStart: true },
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
    </>
  ),
  renderAfterGate: () => (
    <>
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
          <p className="mt-3 text-sm text-[var(--text-tertiary)]">
            Failures were detectable in engineering tools, but creators worked in the Dashboard,
            creating an observability gap
          </p>
        </div>
      </section>

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
            <figcaption className="mt-3 text-sm text-[var(--text-tertiary)]">
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
            <figcaption className="mt-3 text-sm text-[var(--text-tertiary)]">
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
            <figcaption className="mt-3 text-sm text-[var(--text-tertiary)]">
              Transfering ownership of a resource
            </figcaption>
          </figure>

          <figure>
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <video autoPlay loop muted playsInline className="h-full w-full object-cover">
                <source
                  src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1775044437/adding-watcher.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
            <figcaption className="mt-3 text-sm text-[var(--text-tertiary)]">
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
        <div className="mt-8 relative aspect-video overflow-hidden rounded-lg">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source
              src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610452/notifications-settings.mp4"
              type="video/mp4"
            />
          </video>
        </div>
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
            <BeforeAfterVideoCard />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">One badge per game</h3>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Separate badges for issues and updates created visual noise and were hard to scan at
              scale. I consolidated to a single, severity-based badge per game: red for critical
              issues, blue for updates only.
            </p>
            <div className="w-full mt-8 bg-[#E3E8F1] p-8 rounded-2xl justify-center flex">
              <Image
                src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610097/one-badge.png"
                alt="Sidebar with a single severity-based badge per game"
                width={160}
                height={330}
                className="w-[160px] h-[330px] object-contain"
                sizes="160px"
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">No email notifications</h3>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Although email was initially considered, we removed it to avoid delayed responses and
              alert fatigue. The system focuses on in-dashboard alerts as the source of truth, with
              Slack used only for time-sensitive awareness.
            </p>
            <div className="mt-8 w-full bg-[#E3E8F1] p-8 rounded-2xl">
              <Image
                src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610116/email-notifications-removed.png"
                alt="Notification settings with email notifications removed"
                width={1920}
                height={1080}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
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
  description: "Automating game setup to enable team independence and scale releases.",
  meta: [
    { label: "Role", values: ["Product Designer"] },
    { label: "Duration", values: ["3 months"] },
    { label: "Team", values: ["Product Manager, Tech Lead, 2 BE Engineers, 1 FE Engineer"] },
    { label: "Skills", values: ["Product Design", "Product Strategy", "Prototyping"] },
  ],
  sections: [
    { id: "context", title: "Context" },
    { id: "goal", title: "Goal" },
    { id: "discovery", title: "Discovery", isGateStart: true },
    { id: "constraints", title: "Constraints" },
    { id: "solution", title: "Solution", isParent: true },
    { id: "step-1", title: "Step 1: Define the essentials", parent: "solution" },
    { id: "step-2", title: "Step 2: Configure services", parent: "solution" },
    { id: "step-3", title: "Step 3: Permissions", parent: "solution" },
    { id: "step-4", title: "Step 4: Integration credentials", parent: "solution" },
    { id: "provisioning", title: "System behavior", parent: "solution" },
    { id: "post-setup", title: "Post-setup ownership", parent: "solution" },
    { id: "tradeoffs", title: "Key tradeoffs" },
    { id: "impact", title: "Impact" },
  ],
  renderBeforeGate: () => (
    <>
      <section id="context">
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          At Tactile, game teams ship and operate multiple live games in parallel.
        </p>
          <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">To ship more games per quarter and quickly learn what players love, teams needed a faster
              path from concept to live release.</h2>
          <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
       Before launch, each game had to be registered across
          LiveOps, analytics, build pipelines, permissions, and infrastructure, creating a Core
          Team–dependent bottleneck.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-8">
          The Game Canvas Setup Tool enables teams to set up new games independently while
          preserving infrastructure guarantees and operational safety.
        </p>
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="bg-white">
            <ForceGraph
              className="w-full"
              height={520}
              linkDistance={65}
              chargeStrength={-240}
              nodes={[
                { id: "Core Team" },
                { id: "Game Team" },
                { id: "LiveOps" },
                { id: "Analytics" },
                { id: "Build Pipelines" },
                { id: "Permissions" },
                { id: "Infrastructure" },
                { id: "Feature Flags" },
                { id: "Remote Config" },
                { id: "Monitoring" },
                { id: "QA Automation" },
                { id: "Identity Service" },
                { id: "Secrets Manager" },
                { id: "Experimentation" },
                { id: "Store Metadata" },
                { id: "Crash Reporting" },
                { id: "Data Warehouse" },
                { id: "Ownership Rules" },
                { id: "Release" },
              ] as any}
              links={[
                { source: "Game Team", target: "LiveOps" },
                { source: "Game Team", target: "Analytics" },
                { source: "Game Team", target: "Build Pipelines" },
                { source: "Game Team", target: "Permissions" },
                { source: "Game Team", target: "Infrastructure" },
                { source: "Game Team", target: "Feature Flags" },
                { source: "Game Team", target: "Remote Config" },
                { source: "Game Team", target: "Experimentation" },
                { source: "Game Team", target: "Store Metadata" },
                { source: "Game Team", target: "Ownership Rules" },
                { source: "Core Team", target: "LiveOps" },
                { source: "Core Team", target: "Analytics" },
                { source: "Core Team", target: "Build Pipelines" },
                { source: "Core Team", target: "Permissions" },
                { source: "Core Team", target: "Infrastructure" },
                { source: "Core Team", target: "Identity Service" },
                { source: "Core Team", target: "Secrets Manager" },
                { source: "Core Team", target: "QA Automation" },
                { source: "Core Team", target: "Monitoring" },
                { source: "LiveOps", target: "Release" },
                { source: "Analytics", target: "Release" },
                { source: "Build Pipelines", target: "Release" },
                { source: "Permissions", target: "Release" },
                { source: "Infrastructure", target: "Release" },
                { source: "Feature Flags", target: "Release" },
                { source: "Remote Config", target: "Release" },
                { source: "Experimentation", target: "Release" },
                { source: "Store Metadata", target: "Release" },
                { source: "QA Automation", target: "Release" },
                { source: "Monitoring", target: "Release" },
                { source: "Crash Reporting", target: "Monitoring" },
                { source: "Data Warehouse", target: "Analytics" },
                { source: "Identity Service", target: "Permissions" },
                { source: "Secrets Manager", target: "Build Pipelines" },
                { source: "Ownership Rules", target: "Permissions" },
                { source: "Feature Flags", target: "Remote Config" },
                { source: "Experimentation", target: "Data Warehouse" },
                { source: "Crash Reporting", target: "Release" },
              ] as any}
            />
          </div>
          <div className="px-5 py-4 md:px-6 border-t border-gray-100 bg-gray-50">
            <p className="text-xs md:text-sm leading-relaxed text-gray-800">
              Conceptual illustration of the many interconnected systems involved in game setup.
            </p>
          </div>
        </div>
      </section>

      <section id="goal">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Goal</h2>
        <div className="bg-accent/20 border-l-4 border-accent p-6 rounded-r-lg">
          <p className="text-lg font-medium text-foreground">
            Enable teams to launch more games per quarter through fast, safe, self-serve game setup.
          </p>
        </div>
      </section>

    </>
  ),
  renderAfterGate: () => (
    <>

      <section id="discovery">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Discovery</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          I ran a cross-functional workshop with Product, Core Team, and platform engineers to map the
          current setup process, surface hidden dependencies, and align on constraints.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-8">
          The goal was to clarify when a game is first provisioned across core systems and define a
          single, safe automation path.
        </p>
        <div className="max-w-5xl rounded-2xl border border-gray-200 bg-white overflow-hidden">
          <div className="relative w-full">
            <Image
              src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610260/workshop-compressed.png"
              alt="Workshop outputs mapping setup steps, constraints, and system dependencies."
              width={1920}
              height={1080}
              className="w-full h-auto transition-opacity duration-700 ease-out opacity-100"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
          <div className="px-5 py-4 md:px-6 border-t border-gray-100 bg-gray-50">
            <p className="text-xs md:text-sm leading-relaxed text-gray-800">
              Workshop outputs mapping setup steps, constraints, and system dependencies.
            </p>
          </div>
        </div>
      </section>

      <section id="constraints">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Constraints</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          These constraints were defined and agreed on during the workshop:
        </p>
        <ConstraintCards
          items={[
            {
              title: "Safe by default",
              description: "Prevent mistakes and ensure games are set up correctly from the start.",
              icon: ShieldCheck,
            },
            {
              title: "Guided setup",
              description: "Automate what we can, and clearly guide teams when input is needed.",
              icon: Bot,
            },
            {
              title: "Flexible process",
              description: "Allow setup to happen step by step, without blocking progress.",
              icon: Clock3,
            },
            {
              title: "Works with existing tools",
              description: "Build on current systems instead of replacing them.",
              icon: Wrench,
            },
          ]}
        />
      </section>

      <section id="solution">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Solution</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          I designed a wizard-style setup tool inspired by Firebase to keep the process fast and
          safe. Teams start with just the essentials, while more complex setup is pushed to later
          steps so they do not get overwhelmed or make early mistakes.
        </p>
      </section>

      <section id="step-1">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Step 1: Define the essentials</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Teams set the game's identity and ownership, the minimum needed to create a game.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          A helper panel explains each field and required format, making the first step clear and
          low risk.
        </p>
        <div className="mt-8 relative aspect-video overflow-hidden rounded-lg">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source
              src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610262/step1-demo.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section id="step-2">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Step 2: Configure services</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Teams select and set up the services their game depends on.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Services appear as cards with clear states like ready, in progress, or failed. Some are
          automatic, others need input. Teams can keep going without finishing everything at once.
        </p>
        <div className="mt-8 relative aspect-video overflow-hidden rounded-lg">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source
              src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610445/step2-services.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section id="step-3">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Step 3: Permissions</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Access is managed through simple roles like Viewer, Editor, and Publisher.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Teams can assign roles and instantly see who has access, with safeguards to prevent
          mistakes.
        </p>
        <div className="mt-8 relative aspect-video overflow-hidden rounded-lg">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source
              src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610423/step3-permissions.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section id="step-4">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Step 4: Integration credentials</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          External details like IDs or keys are added in a separate step.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Strict validation helps avoid errors while keeping earlier steps fast and simple.
        </p>
        <div className="mt-8 relative aspect-video overflow-hidden rounded-lg">
          <video autoPlay loop muted playsInline className="h-full w-full object-cover">
            <source
              src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610466/step4-credentials.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section id="provisioning">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">System behavior</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Setup runs across multiple systems in the background.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Each module shows its status and allows actions like Configure or Retry, so teams can keep
          moving without waiting.
        </p>
        <div className="w-full bg-gray-50 rounded-lg px-6 md:px-8 py-20 flex justify-center mt-8">
          <div className="w-full max-w-5xl">
            <Image
              src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610092/provisioning.png"
              alt="How provisioning works across systems"
              width={1920}
              height={1080}
              className="w-full h-auto object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
        </div>
      </section>

      <section id="post-setup">
        <div className="grid grid-cols-1 gap-8 items-start">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Post-setup ownership</h2>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Teams land in a central overview to track progress, fix issues, and manage access over
              time.
            </p>
          </div>

          <figure>
            <div className="relative overflow-hidden rounded-xl">
              <video autoPlay loop muted playsInline className="w-full">
                <source
                  src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610479/post-setup.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
            <figcaption className="mt-3 text-xs md:text-sm text-[var(--text-tertiary)]">
              Switching between overview, permissions, and integration settings for a partially configured game.
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="tradeoffs">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Key tradeoffs</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">Progressive expansion</h3>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Showing all service cards expanded by default made the setup long and overwhelming as more services were added. I moved to a progressive expansion model where only the core services stay open by default, while the rest can be expanded as needed, with each user&apos;s preference saved locally.
            </p>
            <BeforeAfterVideoCard
              beforeSrc="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610420/everything-expanded.mp4"
              afterSrc="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610187/mostly-collapsed.mp4"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">Fewer, clearer module states</h3>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Early designs exposed many granular states, which were accurate but hard to scan. I reduced these to a small, consistent set that clearly communicates readiness and required action at a glance.
            </p>
            <div className="mt-8 w-full bg-[#E3E8F1] p-8 rounded-2xl">
              <Image
                src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769609945/module-statuses.png"
                alt="Module status states showing readiness and required action"
                width={1920}
                height={1080}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-3">Inherited access</h3>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Restricting access to the game creator quickly became a bottleneck. I introduced inherited access so users with global LiveOps permissions are automatically added to new games, reducing manual permission management while keeping ownership explicit.
            </p>
            <div className="mt-8 w-full bg-[#E3E8F1] p-8 rounded-2xl">
              <Image
                src="https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610209/inherited-access.png"
                alt="Inherited access model for game permissions"
                width={1920}
                height={1080}
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="impact">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Impact</h2>
        <OutcomeCards
          items={[
            {
              title: "~2x faster game setup",
              description: "Teams moved through game creation with clearer sequencing and fewer blockers.",
            },
            {
              title: "+3 games / quarter",
              description: "Guardrails and validation reduced risky configuration errors.",
            },
            {
              title: "Stronger ownership",
              description: "Roles and responsibilities became explicit during setup and easier to manage after launch.",
            },
            {
              title: "More scalable workflow",
              description: "The flow supported more independent launches without proportional process overhead.",
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
