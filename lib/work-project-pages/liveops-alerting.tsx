import Image from "next/image"
import type { ReactNode } from "react"
import { AlertingSketch, ObservabilityGap, RewardFlow, TabbedMedia } from "@/components/work/liveops/illustrations"
import type { WorkProjectPage } from "./types"
import { FigCaption } from "./shared"

/*
 * LiveOps Alerting, laid out as the v4 case study (liveops-alerting.html): the
 * page template draws the hero, title block, stat and at-a-glance box; this
 * file draws the body. Each section is a 12-column grid: headline on the left,
 * text on the right, figures across the full width.
 */

const cdn = "https://res.cloudinary.com/dzpdf5ygh"

// Shared by the stat band and the Impact cards, so the numbers above the
// password gate always match the ones below it.
const impact = [
  { title: "Faster detection", description: "Critical failures detected in minutes instead of hours" },
  { title: "Less escalation", description: "Teams relied less on Slack and external monitoring" },
  { title: "22% fewer incidents", description: "One in five production issues caught before full rollout" },
  { title: "Trusted workflow", description: "Alerting system became part of daily LiveOps work" },
]

const right = "col-span-12 lg:col-span-6 lg:col-start-7"
const full = "col-span-12"
const lead = "m-0 text-[24px] leading-[1.25] tracking-[-0.025em] text-pretty"
const body = "m-0 text-[18px] leading-[1.6] text-[#3d3c44] text-pretty"

/*
 * A section: a major one opens under an ink rule with a 48px headline, a sub
 * one under a hairline with a smaller headline. `wide` puts the headline over
 * all 12 columns, for sections of rows or cards.
 */
function Section({
  id,
  title,
  sub,
  wide,
  children,
}: {
  id: string
  title: string
  sub?: boolean
  wide?: boolean
  children: ReactNode
}) {
  return (
    <section id={id} className={sub ? "pt-14" : "pt-24"}>
      <div
        className={`grid grid-flow-row-dense grid-cols-12 items-start gap-x-6 gap-y-5 border-t pt-5 ${
          sub ? "border-hairline" : "border-ink"
        }`}
      >
        <h2
          className={`m-0 ${wide ? "col-span-12" : "col-span-12 lg:col-span-5 lg:row-span-2"} font-medium leading-[1.08] tracking-[-0.035em] text-balance ${
            sub ? "text-[clamp(24px,2.4vw,32px)]" : "text-[clamp(32px,3.6vw,48px)]"
          }`}
        >
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}

function Lead({ children }: { children: ReactNode }) {
  return (
    <p data-text="" className={`${right} ${lead}`}>
      {children}
    </p>
  )
}

function P({ children }: { children: ReactNode }) {
  return (
    <p data-text="" className={`${right} ${body}`}>
      {children}
    </p>
  )
}

function H3({ children }: { children: ReactNode }) {
  return (
    <h3 data-text="" className={`${right} m-0 mt-5 border-t border-hairline pt-4 text-[24px] leading-[1.3] font-medium tracking-[-0.02em]`}>
      {children}
    </h3>
  )
}

/** Points, each after a purple arrow, between hairlines. */
function Points({ items }: { items: string[] }) {
  return (
    <ul data-text="" className={`${right} m-0 flex list-none flex-col p-0`}>
      {items.map((item) => (
        <li key={item} className="grid grid-cols-[20px_1fr] gap-2 border-b border-hairline py-3 text-[18px] leading-[1.6] text-[#3d3c44]">
          <span aria-hidden="true" className="text-brand">
            →
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

/** A full-width recording with its caption. */
function Clip({ src, caption, label }: { src: string; caption: ReactNode; label: string }) {
  return (
    <figure className={`${full} m-0 mt-6 mb-2 flex flex-col gap-3`}>
      <div className="relative aspect-video overflow-hidden rounded-[14px] bg-[#f1f2f4]">
        <video src={src} autoPlay loop muted playsInline aria-label={label} className="h-full w-full object-cover" />
      </div>
      <FigCaption>{caption}</FigCaption>
    </figure>
  )
}

/** A screenshot on a pale backdrop, at most 64% of the screen tall. */
function Still({ src, alt, width, height, caption }: { src: string; alt: string; width: number; height: number; caption: ReactNode }) {
  return (
    <figure className={`${full} m-0 mt-6 mb-2 flex flex-col gap-3`}>
      <div className="flex justify-center rounded-[20px] bg-[#f6f7f8] p-[clamp(20px,3vw,40px)]">
        <Image src={src} alt={alt} width={width} height={height} className="h-auto max-h-[64vh] w-auto max-w-full object-contain" sizes="(min-width: 1280px) 1100px, 100vw" />
      </div>
      <FigCaption>{caption}</FigCaption>
    </figure>
  )
}

/** A tradeoff: what changed on the left, why on the right. */
function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={`${full} grid grid-cols-12 items-baseline gap-x-6 gap-y-3 border-t border-hairline py-[26px]`}>
      <h3 className="col-span-12 m-0 text-[clamp(24px,2.4vw,32px)] leading-[1.15] font-medium tracking-[-0.025em] text-balance lg:col-span-5">
        {title}
      </h3>
      <p className={`col-span-12 lg:col-span-6 lg:col-start-7 ${body}`}>{children}</p>
    </div>
  )
}

export const liveopsAlertingPage: WorkProjectPage = {
  layout: "v4",
  readTime: "4 min read",
  highlights: impact,
  glance: {
    problem: "Things broke in production, and the people who shipped them were the last to know.",
    did: "I put failures where creators already work, and gave every one of them an owner.",
    outcome: "22% fewer production incidents. Failures now surface in minutes, not hours.",
  },
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
    { id: "discovery", title: "Discovery" },
    { id: "solution", title: "Solution", isParent: true, isGateStart: true },
    { id: "see-it", title: "See it", parent: "solution" },
    { id: "act-on-it", title: "Act on it", parent: "solution" },
    { id: "own-it", title: "Own it", parent: "solution" },
    { id: "tradeoffs", title: "Key tradeoffs" },
    { id: "impact", title: "Impact" },
  ],
  renderBeforeGate: () => (
    <>
      <Section id="overview" title="Live mobile games rely on continuous updates after release.">
        <Lead>
          At Tactile, updates are managed through an internal LiveOps Dashboard, where teams configure events,
          experiments, player targeting, and feature rollouts without shipping new app versions.
        </Lead>
        <P>
          The flow looks simple, but it depends on multiple backend systems staying in sync. When something breaks, the
          impact often appears first in the live game.
        </P>
        <div className={`${full} mt-6 mb-2`}>
          <RewardFlow />
        </div>
      </Section>

      {/* The problem, on ink. */}
      <section id="problem" className="pt-24">
        <div className="grid grid-cols-12 items-start gap-x-6 gap-y-5 rounded-3xl bg-ink p-7 text-white min-[720px]:p-14">
          <h2 className="col-span-12 m-0 text-[clamp(32px,3.6vw,48px)] leading-[1.08] font-medium tracking-[-0.035em] text-balance lg:col-span-5">
            The problem
          </h2>
          <p className={`${right} ${lead}`}>
            Failures were detected by backend systems, but not surfaced in the LiveOps Dashboard. As a result, creators
            had no indication that a live feature was failing until players or support teams raised the issue.
          </p>
          <p className={`${right} m-0 text-[18px] leading-[1.6] text-[#c9c8d0] text-pretty`}>
            <span className="text-white">Goal:</span> surface backend failures to LiveOps creators early so they can act
            before players are affected.
          </p>
        </div>
      </section>

      <Section id="discovery" title="Discovery">
        <H3>Critical signals lived outside the LiveOps Dashboard</H3>
        <Lead>
          I worked closely with LiveOps creators, backend engineers, and support teams to understand how production
          issues were detected and handled in practice.
        </Lead>
        <P>
          While backend systems reliably flagged failures at runtime through monitoring and logs, creators had no direct
          visibility in the LiveOps Dashboard. Instead, they relied on indirect signals: Slack messages from engineers,
          support tickets, or noticing anomalies in player metrics.
        </P>
        <div className={`${full} mt-6 mb-2`}>
          <ObservabilityGap caption="Every engineering tool flagged the failure. The Dashboard, where creators actually work, showed nothing." />
        </div>
      </Section>
    </>
  ),
  renderAfterGate: () => (
    <>
      <Section id="solution" title="Solution">
        <Lead>
          To close the observability gap, I redesigned the LiveOps Dashboard to surface the right signals, to the right
          people, at the right time. The solution combines UI surfacing with ownership and subscription logic, so
          failures are visible, actionable, and clearly owned.
        </Lead>
        <div className={`${full} mt-6 mb-2`}>
          <AlertingSketch caption="A failure reaches its owner in the Dashboard: banner on the homepage, badge in the sidebar." />
        </div>
        <Clip
          src={`${cdn}/video/upload/v1769610317/homepage-video.mp4`}
          label="The redesigned LiveOps homepage with the critical issues banner and latest updates"
          caption="The redesigned homepage: critical issues first, then updates."
        />
      </Section>

      <Section id="see-it" title="See it" sub>
        <H3>Homepage</H3>
        <Lead>
          The homepage previously showed only creator-configured shortcuts, with no indication when systems were failing.
        </Lead>
        <P>I added 2 new sections at the top of the homepage:</P>
        <Points
          items={[
            "A critical issues banner that appears only when blocking issues exist and links directly to the Issues view",
            "A latest updates feed showing non-critical changes relevant to the logged-in user, scoped to resources they own or watch",
          ]}
        />
        <P>
          These sections act as previews, helping creators understand the current state before they start configuring
          features.
        </P>
        <H3>Sidebar</H3>
        <P>
          In practice, many users do not always land on the homepage. Some navigate directly to a specific game or
          resource.
        </P>
        <P>
          To account for this, I made critical states visible directly in the left-hand sidebar, where they could not be
          missed. This ensures issues draw attention regardless of entry point, without interrupting workflows.
        </P>
        <Still
          src={`${cdn}/image/upload/f_auto,q_auto/v1769610095/sidebar-badges.png`}
          alt="Sidebar with persistent attention badges for issues and updates"
          width={640}
          height={868}
          caption="Persistent attention badges in the sidebar."
        />
        <div className={`${full} mt-6 mb-2 grid grid-cols-1 items-start gap-6 min-[720px]:grid-cols-2`}>
          {[
            { src: `${cdn}/video/upload/v1769610490/avatar-sidebar.mp4`, caption: "Avatar-level signal" },
            { src: `${cdn}/video/upload/v1769610494/game-sidebar.mp4`, caption: "Game-level signals" },
          ].map((clip) => (
            <figure key={clip.src} className="m-0 flex flex-col gap-3">
              <div className="relative aspect-video overflow-hidden rounded-[14px] bg-[#f1f2f4]">
                <video src={clip.src} autoPlay loop muted playsInline aria-label={clip.caption} className="h-full w-full object-cover" />
              </div>
              <FigCaption>{clip.caption}</FigCaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section id="act-on-it" title="Act on it" sub>
        <Lead>Clicking into the Critical Issues or Latest Updates views reveals structured lists with clear context.</Lead>
        <P>
          For critical issues, users can see what is broken, where it occurs, which resources are affected, and how the
          issue was detected. Issues can be resolved or reopened, and deeper links provide access to backend or
          monitoring sources when needed.
        </P>
        <Clip
          src={`${cdn}/video/upload/v1769610246/list-views1.mp4`}
          label="Critical issues list view, resolving and reopening an issue"
          caption="The Critical Issues view: what broke, where, and how it was detected."
        />
      </Section>

      <Section id="own-it" title="Own it" sub>
        <H3>Ownership and watchers</H3>
        <Lead>Alerting only works if responsibility is clear.</Lead>
        <P>
          I introduced ownership as a first-class concept across LiveOps resources. The creator becomes the default
          owner, ownership can be transferred, and owners are automatically subscribed to critical issues affecting their
          resources. Owners cannot unsubscribe from these issues.
        </P>
        <div className={`${full} mt-6 mb-2`}>
          <TabbedMedia
            caption="Transferring ownership, and adding a watcher to a resource."
            items={[
              { label: "Transfer ownership", alt: "Transferring ownership of a resource", video: `${cdn}/video/upload/v1769610439/transfer-ownership.mp4` },
              { label: "Add a watcher", alt: "Adding a watcher to a resource", video: `${cdn}/video/upload/v1775044437/adding-watcher.mp4` },
            ]}
          />
        </div>
        <H3>Notification settings</H3>
        <P>
          To balance signal and noise, I designed a subscription-based notification model. Users can manage which games
          and resource types they follow, and whether they receive critical issues, updates, or both.
        </P>
        <Clip
          src={`${cdn}/video/upload/v1769610452/notifications-settings.mp4`}
          label="Notification settings: choosing games, resource types and alert types"
          caption="Notification settings: which games, which resources, which alerts."
        />
      </Section>

      <Section id="tradeoffs" title="Key tradeoffs" wide>
        <Row title="Homepage as preview">
          Early versions showed only unread updates, causing items to disappear once marked as read. I changed this to
          show all updates from the last 10 days, treating the homepage as a preview while the full Updates view remains
          the source of truth.
        </Row>
        <div className={`${full} mb-6`}>
          <TabbedMedia
            caption="Latest updates, before and after."
            items={[
              { label: "Before: only unread", alt: "Updates disappear from the homepage once marked as read", video: `${cdn}/video/upload/v1769610321/only-unread.mp4` },
              { label: "After: last 10 days", alt: "The homepage keeps all updates from the last 10 days", video: `${cdn}/video/upload/v1769610236/read-and-unread.mp4` },
            ]}
          />
        </div>
        <Row title="One badge per game">
          Separate badges for issues and updates created visual noise and were hard to scan at scale. I consolidated to a
          single, severity-based badge per game: red for critical issues, blue for updates only.
        </Row>
        <Still
          src={`${cdn}/image/upload/f_auto,q_auto/v1769610097/one-badge.png`}
          alt="Sidebar with a single severity-based badge per game"
          width={256}
          height={774}
          caption="One badge per game: red for critical issues, blue for updates."
        />
        <Row title="No email notifications">
          Although email was initially considered, we removed it to avoid delayed responses and alert fatigue. The system
          focuses on in-dashboard alerts as the source of truth, with Slack used only for time-sensitive awareness.
        </Row>
        <Still
          src={`${cdn}/image/upload/v1769610116/email-notifications-removed.png`}
          alt="Notification settings with email notifications removed"
          width={1080}
          height={675}
          caption="Notification settings, with email taken out."
        />
      </Section>

      <Section id="impact" title="Impact" wide>
        <div className={`${full} grid grid-cols-1 gap-4 pt-2 min-[560px]:grid-cols-2 lg:grid-cols-4`}>
          {impact.map((item, i) => (
            <div
              key={item.title}
              className={`flex min-h-[200px] flex-col justify-between gap-7 rounded-[20px] p-7 ${
                i === 0 ? "bg-ink text-white" : "bg-[#f1f2f4] text-ink"
              }`}
            >
              <span className="text-[clamp(24px,2.4vw,32px)] leading-[1.15] font-medium tracking-[-0.035em] text-balance">
                {item.title}
              </span>
              <span className={`text-[15px] leading-[1.45] ${i === 0 ? "text-[#c9c8d0]" : "text-[#3d3c44]"}`}>
                {item.description}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </>
  ),
}
