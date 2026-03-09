import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { projects } from "@/components/projects"
import { PasswordProtect } from "@/components/password-protect"
import { ProjectTableOfContents } from "@/components/project-table-of-contents"
import { CloudinaryVideoPlayer } from "@/components/cloudinary-video-player"
import { LiveopsBackgroundBlock } from "@/components/work/liveops-background-block"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return { title: "Project Not Found" }
  return {
    title: `${project.title} - Diana Tofan`,
    description: project.title,
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  const sections = [
    { id: "overview", title: "Overview" },
    { id: "problem", title: "The problem" },
    { id: "goal", title: "Goal" },
    { id: "discovery", title: "Discovery" },
    { id: "solution", title: "Solution" },
    { id: "homepage", title: "Homepage: Early Visibility" },
    { id: "sidebar", title: "Sidebar: Persistent Attention" },
    { id: "list-views", title: "List Views: Awareness to Action" },
    { id: "ownership", title: "Ownership and Watchers" },
    { id: "notifications", title: "Notification Settings" },
    { id: "tradeoffs", title: "Key tradeoffs" },
    { id: "impact", title: "Impact" },
  ]

  // Find the next project
  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]

  const content = (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background/80 backdrop-blur-sm">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-[var(--text-secondary)] transition-colors duration-200"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </Link>

          <Link
            href={`/work/${nextProject.slug}`}
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-[var(--text-secondary)] transition-colors duration-200"
          >
            Next project
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Cover Photo */}
      <section className="pt-28">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-card">
            <Image
              src={project.image}
              alt={`${project.title} cover`}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </section>

      {/* Title and Project Details */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="grid grid-cols-4 md:grid-cols-12 gap-x-3">
            <div className="col-span-4 md:col-span-8 md:col-start-3">
              <h1 className="text-3xl md:text-[48px] lg:text-[56px] font-medium leading-[1.08] tracking-tight text-foreground text-balance mb-12">
                {project.title}
              </h1>

              {/* Project Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-border">
                <div>
                  <p className="text-sm font-medium text-[var(--text-tertiary)] mb-2">
                    Role
                  </p>
                  <p className="text-base font-medium text-foreground">Product Designer</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-tertiary)] mb-2">
                    Timeline
                  </p>
                  <p className="text-base font-medium text-foreground">August - September 2025</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-tertiary)] mb-2">
                    Team
                  </p>
                  <p className="text-base font-medium text-foreground">3 Designers</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-tertiary)] mb-2">
                    Skills
                  </p>
                  <p className="text-base font-medium text-foreground">
                    Product Design
                    <br />
                    Product Strategy
                    <br />
                    Prototyping
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with TOC - Using 12-column grid */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1800px] mx-auto px-6">
          <div className="grid grid-cols-4 md:grid-cols-12 gap-x-3">
            {/* Table of Contents - Left (3 cols) */}
            <div className="hidden md:block col-span-3">
              <ProjectTableOfContents sections={sections} />
            </div>

            {/* Content - Right (7 cols, starting at col 4) */}
            <div className="col-span-4 md:col-span-7 md:col-start-5 space-y-16">
              <LiveopsBackgroundBlock />

              {/* Goal */}
              <section id="goal">
                <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Goal</h2>
                <div className="bg-accent/20 border-l-4 border-accent p-6 rounded-r-lg">
                  <p className="text-lg font-medium text-foreground">
                    Surface backend failures to LiveOps creators early so they can act before
                    players are affected
                  </p>
                </div>
              </section>

              {/* Discovery */}
              <section id="discovery">
                <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
                  Discovery
                </h2>
                <h3 className="text-xl font-medium text-foreground mb-3">
                  Critical signals lived outside the LiveOps Dashboard
                </h3>
                <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
                  I worked closely with LiveOps creators, backend engineers, and support teams to
                  understand how production issues were detected and handled in practice.
                </p>
                <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                  While backend systems reliably flagged failures at runtime through monitoring
                  and logs, creators had no direct visibility in the LiveOps Dashboard. Instead,
                  they relied on indirect signals: Slack messages from engineers, support
                  tickets, or noticing anomalies in player metrics.
                </p>
                <div className="mt-8 relative aspect-video bg-card rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.jpg"
                    alt="Observability gap"
                    fill
                    className="object-cover"
                  />
                </div>
              </section>

              {/* Solution */}
              <section id="solution">
                <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
                  Solution
                </h2>
                <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                  To close the observability gap, I redesigned the LiveOps Dashboard to surface
                  the right signals, to the right people, at the right time. The solution
                  combines UI surfacing with ownership and subscription logic, so failures are
                  visible, actionable, and clearly owned.
                </p>
              </section>

              {/* Homepage */}
              <section id="homepage">
                <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
                  Homepage: Early Visibility
                </h2>
                <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
                  The homepage previously showed only creator-configured shortcuts, with no
                  indication when systems were failing.
                </p>
                <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
                  I added 2 new sections at the top of the homepage:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base text-[var(--text-secondary)] mb-4">
                  <li>
                    A critical issues banner that appears only when blocking issues exist and
                    links directly to the Issues view
                  </li>
                  <li>
                    A latest updates feed showing non-critical changes relevant to the logged-in
                    user, scoped to resources they own or watch
                  </li>
                </ul>
                <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                  These sections act as previews, helping creators understand the current state
                  before they start configuring features.
                </p>
                <CloudinaryVideoPlayer publicId="list-views1" />
              </section>

              {/* Sidebar */}
              <section id="sidebar">
                <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
                  Sidebar: Persistent Attention Signals
                </h2>
                <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
                  In practice, many users do not always land on the homepage. Some navigate
                  directly to a specific game or resource.
                </p>
                <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                  To account for this, I made critical states visible directly in the left-hand
                  sidebar, where they could not be missed. This ensures issues draw attention
                  regardless of entry point, without interrupting workflows.
                </p>
                <CloudinaryVideoPlayer publicId="game-sidebar" />
              </section>

              {/* List Views */}
              <section id="list-views">
                <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
                  List Views: From Awareness to Action
                </h2>
                <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
                  Clicking into the Critical Issues or Latest Updates views reveals structured
                  lists with clear context.
                </p>
                <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                  For critical issues, users can see what is broken, where it occurs, which
                  resources are affected, and how the issue was detected. Issues can be resolved
                  or reopened, and deeper links provide access to backend or monitoring sources
                  when needed.
                </p>
                <div className="mt-8 relative aspect-video bg-card rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.jpg"
                    alt="List views"
                    fill
                    className="object-cover"
                  />
                </div>
              </section>

              {/* Ownership */}
              <section id="ownership">
                <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
                  Ownership and Watchers
                </h2>
                <p className="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
                  Alerting only works if responsibility is clear.
                </p>
                <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                  I introduced ownership as a first-class concept across LiveOps resources. The
                  creator becomes the default owner, ownership can be transferred, and owners are
                  automatically subscribed to critical issues affecting their resources. Owners
                  cannot unsubscribe from these issues.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="relative aspect-video bg-card rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.jpg"
                      alt="Transfer ownership"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-video bg-card rounded-lg overflow-hidden">
                    <Image
                      src="/placeholder.jpg"
                      alt="Adding watcher"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </section>

              {/* Notifications */}
              <section id="notifications">
                <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
                  Notification Settings
                </h2>
                <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                  To balance signal and noise, I designed a subscription-based notification
                  model. Users can manage which games and resource types they follow, and whether
                  they receive critical issues, updates, or both.
                </p>
                <div className="mt-8 relative aspect-video bg-card rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.jpg"
                    alt="Notification settings"
                    fill
                    className="object-cover"
                  />
                </div>
              </section>

              {/* Tradeoffs */}
              <section id="tradeoffs">
                <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
                  Key tradeoffs
                </h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">
                      Homepage as preview
                    </h3>
                    <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                      Early versions showed only unread updates, causing items to disappear once
                      marked as read. I changed this to show all updates from the last 10 days,
                      treating the homepage as a preview while the full Updates view remains the
                      source of truth.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">
                      One badge per game
                    </h3>
                    <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                      Separate badges for issues and updates created visual noise and were hard
                      to scan at scale. I consolidated to a single, severity-based badge per
                      game: red for critical issues, blue for updates only.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">
                      No email notifications
                    </h3>
                    <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                      Although email was initially considered, we removed it to avoid delayed
                      responses and alert fatigue. The system focuses on in-dashboard alerts as
                      the source of truth, with Slack used only for time-sensitive awareness.
                    </p>
                  </div>
                </div>
              </section>

              {/* Impact */}
              <section id="impact">
                <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">Impact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-accent/20 p-6 rounded-lg">
                    <p className="text-sm font-medium text-[var(--text-tertiary)] mb-2">
                      Faster detection
                    </p>
                    <p className="text-base text-foreground">
                      Critical failures detected in minutes instead of hours
                    </p>
                  </div>
                  <div className="bg-accent/20 p-6 rounded-lg">
                    <p className="text-sm font-medium text-[var(--text-tertiary)] mb-2">
                      Less escalation
                    </p>
                    <p className="text-base text-foreground">
                      Teams relied less on Slack and external monitoring
                    </p>
                  </div>
                  <div className="bg-accent/20 p-6 rounded-lg">
                    <p className="text-sm font-medium text-[var(--text-tertiary)] mb-2">
                      22% fewer incidents
                    </p>
                    <p className="text-base text-foreground">
                      One in five production issues caught before full rollout
                    </p>
                  </div>
                  <div className="bg-accent/20 p-6 rounded-lg">
                    <p className="text-sm font-medium text-[var(--text-tertiary)] mb-2">
                      Trusted workflow
                    </p>
                    <p className="text-base text-foreground">
                      Alerting system became part of daily LiveOps work
                    </p>
                  </div>
                </div>
                <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                  By embedding backend observability into the LiveOps Dashboard, teams shifted
                  from reactive firefighting to proactive production awareness, reducing player
                  impact while scaling safely across games and teams.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )

  // Wrap with password protection if needed
  if (project.isPasswordProtected) {
    return (
      <PasswordProtect projectSlug={project.slug}>
        {content}
      </PasswordProtect>
    )
  }

  return content
}
