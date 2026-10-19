import Image from "next/image"
import Link from "next/link"
import { Clock3, Layers, ShieldCheck, Wrench } from "lucide-react"
import { BeforeAfterVideoCard } from "@/components/work/before-after-video-card"
import ForceGraph from "@/components/work/force-graph"
import type { WorkProjectPage } from "./types"
import { ConstraintCards, OutcomeCards } from "./shared"

// Two separate Tactile projects on the same LiveOps Dashboard, presented on one
// page: game setup automation (launching a game) and LiveOps alerting (running
// one). Each keeps its own goal, team and impact. The old per-project URLs
// redirect here (see next.config.mjs).

const setupImpact = [
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
]

const alertingImpact = [
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
]

const projects = [
  {
    id: "setup",
    label: "Project 1",
    title: "Game setup automation",
    summary:
      "Every new game had to be registered across a dozen systems by a small Core Team. I designed a self-serve setup flow so game teams could do it themselves.",
    result: "~2x faster setup, +3 games per quarter",
  },
  {
    id: "alerting",
    label: "Project 2",
    title: "LiveOps alerting",
    summary:
      "Backend failures were invisible inside the LiveOps Dashboard, so creators heard about them from players and Slack. I designed alerting that surfaces them where creators work.",
    result: "22% fewer production incidents",
  },
]

function LoopingVideo({ src, caption }: { src: string; caption?: string }) {
  return (
    <figure className="mt-8">
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <video autoPlay loop muted playsInline className="h-full w-full object-cover">
          <source src={src} type="video/mp4" />
        </video>
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm text-[var(--text-tertiary)]">{caption}</figcaption>
      ) : null}
    </figure>
  )
}

function ProjectHeader({
  id,
  label,
  title,
  goal,
  details,
}: {
  id: string
  label: string
  title: string
  goal: string
  details: { label: string; value: string }[]
}) {
  return (
    <section id={id} className="pt-12 border-t border-border">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--text-tertiary)] mb-3">
        {label}
      </p>
      <h2 className="text-3xl md:text-4xl font-medium text-foreground mb-6">{title}</h2>
      <dl className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {details.map((item) => (
          <div key={item.label}>
            <dt className="text-sm font-medium text-[var(--text-tertiary)] mb-1">{item.label}</dt>
            <dd className="text-base font-medium text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
      <div className="bg-accent/20 border-l-4 border-accent p-6 rounded-r-lg">
        <p className="text-sm font-medium text-[var(--text-tertiary)] mb-1">Goal</p>
        <p className="text-lg font-medium text-foreground">{goal}</p>
      </div>
    </section>
  )
}

export const liveopsToolingPage: WorkProjectPage = {
  highlights: [setupImpact[0], setupImpact[1], alertingImpact[2], alertingImpact[0]],
  description:
    "Two projects I designed at Tactile Games for the LiveOps Dashboard: self-serve game setup, and alerting for live games.",
  meta: [
    { label: "Role", values: ["Product Designer"] },
    { label: "Company", values: ["Tactile Games, 2025"] },
    { label: "Projects", values: ["Game setup automation", "LiveOps alerting"] },
    { label: "Skills", values: ["Product Design", "Product Strategy", "Prototyping"] },
  ],
  sections: [
    { id: "overview", title: "My work at Tactile" },
    { id: "projects", title: "Two projects" },
    { id: "setup", title: "Project 1: Game setup", isParent: true, isGateStart: true },
    { id: "setup-problem", title: "Setup was a bottleneck", parent: "setup" },
    { id: "setup-discovery", title: "Shifting gears", parent: "setup" },
    { id: "setup-solution", title: "A guided setup flow", parent: "setup" },
    { id: "setup-tradeoffs", title: "Key tradeoffs", parent: "setup" },
    { id: "setup-impact", title: "Impact", parent: "setup" },
    { id: "alerting", title: "Project 2: Alerting", isParent: true },
    { id: "alerting-problem", title: "Failures were invisible", parent: "alerting" },
    { id: "alerting-solution", title: "Surfacing the right signals", parent: "alerting" },
    { id: "alerting-ownership", title: "Ownership and watchers", parent: "alerting" },
    { id: "alerting-tradeoffs", title: "Key tradeoffs", parent: "alerting" },
    { id: "alerting-impact", title: "Impact", parent: "alerting" },
    { id: "common", title: "What they have in common" },
  ],
  renderBeforeGate: () => (
    <>
      <section id="overview">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
          My work at Tactile
        </h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Tactile makes casual mobile games that are updated continuously after release. Teams do
          that through an internal LiveOps Dashboard, where they configure events, experiments,
          player targeting and feature rollouts without shipping new app versions.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          As a Product Designer, I worked on the internal tools behind that: products for technical
          users, sitting on top of many backend systems, where a confusing screen turns into a
          broken live game. The work is mostly about making complex systems understandable,
          designed closely with engineers and tested with the people who run the games every day.
        </p>
      </section>

      <section id="projects">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Two projects</h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-6">
          This page covers two separate projects, each about 3 months, at the two ends of a
          game&apos;s life: getting it launched, and keeping it healthy once it&apos;s live.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`#${project.id}`}
              className="group block rounded-xl border border-border p-6 transition-colors hover:bg-gray-50"
            >
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-tertiary)] mb-2">
                {project.label}
              </p>
              <h3 className="text-xl font-medium text-foreground mb-2">{project.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)] mb-4">
                {project.summary}
              </p>
              <p className="text-sm font-medium text-foreground">{project.result}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  ),
  renderAfterGate: () => (
    <>
      <ProjectHeader
        id="setup"
        label="Project 1"
        title="Game setup automation"
        goal="Enable teams to launch more games per quarter through fast, safe, self-serve game setup."
        details={[
          { label: "Duration", value: "3 months" },
          { label: "Team", value: "PM, Tech Lead, 2 BE, 1 FE" },
          { label: "Status", value: "Shipped" },
        ]}
      />

      <section id="setup-problem">
        <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
          Setup was a bottleneck
        </h3>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Every new game had to be registered across LiveOps, analytics, build pipelines,
          permissions and infrastructure before it could launch. Most of that work depended on a
          small Core Team, so as more teams shipped games in parallel, every launch queued behind
          them.
        </p>
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white overflow-hidden">
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
          <div className="px-5 py-4 md:px-6 border-t border-gray-100 bg-gray-50">
            <p className="text-xs md:text-sm leading-relaxed text-gray-800">
              Conceptual illustration of the many interconnected systems involved in game setup.
            </p>
          </div>
        </div>
      </section>

      <section id="setup-discovery">
        <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Shifting gears</h3>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          The original request was simple: automate game setup. After running a workshop with
          stakeholders, it became clear that some steps could be automated, while others still
          needed team input and decisions. A few principles came out of it:
        </p>
        <ConstraintCards
          items={[
            {
              title: "Safe by default",
              description: "Reduce setup mistakes before they happen.",
              icon: ShieldCheck,
            },
            {
              title: "Progressive disclosure",
              description: "Start with the essentials and reveal complexity when needed.",
              icon: Layers,
            },
            {
              title: "Flexible setup",
              description: "Allow teams to continue even when some systems are still provisioning.",
              icon: Clock3,
            },
            {
              title: "Build on existing infrastructure",
              description: "Integrate with existing systems instead of replacing them.",
              icon: Wrench,
            },
          ]}
        />
      </section>

      <section id="setup-solution">
        <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-4">A guided setup flow</h3>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          I designed a wizard-style setup tool, inspired by Firebase, in four steps:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-base text-[var(--text-secondary)] mb-4">
          <li>
            <span className="font-medium text-foreground">Essentials:</span> the game&apos;s identity
            and owner, the minimum needed to create it, with a helper panel explaining each field.
          </li>
          <li>
            <span className="font-medium text-foreground">Services:</span> cards with clear states
            (ready, in progress, failed). Some set themselves up, others need input, and teams can
            keep going without finishing everything at once.
          </li>
          <li>
            <span className="font-medium text-foreground">Permissions:</span> simple Viewer, Editor
            and Publisher roles, with safeguards against mistakes.
          </li>
          <li>
            <span className="font-medium text-foreground">Integration credentials:</span> external
            IDs and keys in a separate step with strict validation, so earlier steps stay fast.
          </li>
        </ol>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Provisioning runs across systems in the background. Each module shows its status with
          Configure or Retry actions, and teams land in an overview where they can track progress
          and manage access after launch.
        </p>
        <LoopingVideo
          src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610262/step1-demo.mp4"
          caption="Step 1: the essentials, with a helper panel for each field"
        />
        <LoopingVideo
          src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610445/step2-services.mp4"
          caption="Step 2: configuring services, with each card showing its own state"
        />
        <LoopingVideo
          src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610479/post-setup.mp4"
          caption="After setup: overview, permissions and integration settings for a partially configured game"
        />
      </section>

      <section id="setup-tradeoffs">
        <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Key tradeoffs</h3>
        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-medium text-foreground mb-3">Progressive expansion</h4>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Showing every service card expanded made setup long and overwhelming as more services
              were added. Only the core services now stay open by default, the rest expand on
              demand, and each user&apos;s preference is saved locally.
            </p>
            <BeforeAfterVideoCard
              beforeSrc="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610420/everything-expanded.mp4"
              afterSrc="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610187/mostly-collapsed.mp4"
            />
          </div>
          <div>
            <h4 className="text-lg font-medium text-foreground mb-3">Fewer, clearer module states</h4>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Early designs exposed many granular states, which were accurate but hard to scan. I
              reduced them to a small, consistent set that shows readiness and required action at a
              glance.
            </p>
            <div className="mt-8 w-full bg-[#E3E8F1] p-8 rounded-2xl">
              <Image
                src="https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_auto/v1769609945/module-statuses.png"
                alt="Module status states showing readiness and required action"
                width={600}
                height={360}
                className="mx-auto w-[600px] h-[360px] object-contain"
                sizes="600px"
              />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium text-foreground mb-3">Inherited access</h4>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Restricting access to the game creator quickly became a bottleneck. Users with global
              LiveOps permissions are now added to new games automatically, which cuts manual
              permission work while keeping ownership explicit.
            </p>
            <div className="mt-8 w-full bg-[#E3E8F1] p-8 rounded-2xl">
              <Image
                src="https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_auto/v1769610209/inherited-access.png"
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

      <section id="setup-impact">
        <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Impact</h3>
        <OutcomeCards items={setupImpact} />
      </section>

      <ProjectHeader
        id="alerting"
        label="Project 2"
        title="LiveOps alerting"
        goal="Surface backend failures to LiveOps creators early so they can act before players are affected."
        details={[
          { label: "Duration", value: "3 months" },
          { label: "Team", value: "PM, CTO, 2 BE, 1 FE" },
          { label: "Status", value: "Shipped" },
        ]}
      />

      <section id="alerting-problem">
        <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
          Failures were invisible
        </h3>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          I worked with LiveOps creators, backend engineers and support teams to understand how
          production issues were detected and handled in practice.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Backend systems reliably flagged failures through monitoring and logs, but creators had no
          view of them in the Dashboard. They relied on Slack messages from engineers, support
          tickets, or noticing anomalies in player metrics.
        </p>
        <div className="mt-8 overflow-hidden">
          <Image
            src="https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_auto/v1769610137/observability-gap.png"
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

      <section id="alerting-solution">
        <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
          Surfacing the right signals
        </h3>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          I redesigned the Dashboard to show the right signals to the right people at the right
          time, wherever they entered it:
        </p>
        <ul className="list-disc list-inside space-y-2 text-base text-[var(--text-secondary)]">
          <li>
            <span className="font-medium text-foreground">Homepage:</span> a critical issues banner
            that only appears when something is blocking, and a feed of updates scoped to what the
            user owns or watches.
          </li>
          <li>
            <span className="font-medium text-foreground">Sidebar:</span> persistent badges, because
            many users go straight to a game and never see the homepage.
          </li>
          <li>
            <span className="font-medium text-foreground">Issue lists:</span> what is broken, where,
            which resources are affected and how it was detected, with links to the backend source.
          </li>
        </ul>
        <LoopingVideo
          src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610317/homepage-video.mp4"
          caption="Critical issues and latest updates at the top of the homepage"
        />
        <LoopingVideo
          src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610494/game-sidebar.mp4"
          caption="Game-level signals in the sidebar"
        />
        <LoopingVideo
          src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610246/list-views1.mp4"
          caption="From a badge to the issue list"
        />
      </section>

      <section id="alerting-ownership">
        <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
          Ownership and watchers
        </h3>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          Alerting only works if responsibility is clear. I made ownership a first-class concept
          across LiveOps resources: the creator is the default owner, ownership can be transferred,
          and owners are automatically subscribed to critical issues on their resources, with no
          way to opt out. Others can watch a resource and choose whether they get critical issues,
          updates or both.
        </p>
        <LoopingVideo
          src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610439/transfer-ownership.mp4"
          caption="Transferring ownership of a resource"
        />
        <LoopingVideo
          src="https://res.cloudinary.com/dzpdf5ygh/video/upload/v1769610452/notifications-settings.mp4"
          caption="Choosing which games and resource types to follow"
        />
      </section>

      <section id="alerting-tradeoffs">
        <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Key tradeoffs</h3>
        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-medium text-foreground mb-3">One badge per game</h4>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Separate badges for issues and updates were noisy and hard to scan at scale. I
              consolidated them into a single severity-based badge per game: red for critical
              issues, blue for updates only.
            </p>
            <div className="w-full mt-8 bg-[#E3E8F1] p-8 rounded-2xl justify-center flex">
              <Image
                src="https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_auto/v1769610097/one-badge.png"
                alt="Sidebar with a single severity-based badge per game"
                width={160}
                height={330}
                className="w-[160px] h-[330px] object-contain"
                sizes="160px"
              />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium text-foreground mb-3">Homepage as preview</h4>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              Early versions showed only unread updates, so items vanished once read. The homepage
              now shows everything from the last 10 days as a preview, while the full Updates view
              stays the source of truth.
            </p>
            <BeforeAfterVideoCard />
          </div>
          <div>
            <h4 className="text-lg font-medium text-foreground mb-3">No email notifications</h4>
            <p className="text-base leading-relaxed text-[var(--text-secondary)]">
              We dropped email to avoid delayed responses and alert fatigue. The Dashboard is the
              source of truth, with Slack used only for time-sensitive awareness.
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

      <section id="alerting-impact">
        <h3 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Impact</h3>
        <OutcomeCards items={alertingImpact} />
      </section>

      <section id="common" className="pt-12 border-t border-border">
        <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
          What they have in common
        </h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
          Both projects came back to ownership. Setup made it explicit who owns a game and who can
          change it, and alerting used ownership to send each failure to someone responsible for
          fixing it.
        </p>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          And in both, the biggest improvements came from taking things away: fewer module states,
          fewer expanded cards, one badge instead of two, no email. In tools built on complex
          systems, most of the design work is deciding what people don&apos;t need to see.
        </p>
      </section>
    </>
  ),
}
