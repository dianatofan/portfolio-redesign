import Image from "next/image"
import { LiveopsBackgroundBlock } from "@/components/work/liveops-background-block"
import { BeforeAfterVideoCard } from "@/components/work/before-after-video-card"
import type { WorkProjectPage } from "./types"
import { OutcomeCards } from "./shared"

export const liveopsAlertingPage: WorkProjectPage = {
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
              <video autoPlay loop muted playsInline className="h-full w-full object-cover">
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
              <video autoPlay loop muted playsInline className="h-full w-full object-cover">
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

