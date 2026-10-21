import Image from "next/image"
import type { ReactNode } from "react"
import { AlertingSketch, ObservabilityGap, RewardFlow } from "@/components/work/liveops/illustrations"
import { TradeoffTable } from "@/components/work/liveops/tradeoffs"
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
// Under a full-width headline, the text stacks on the left.
const stack = "col-span-12 lg:col-span-7"
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
            sub ? "text-[24px]" : "text-[clamp(32px,3.6vw,48px)]"
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

/**
 * A figure in the column, numbered by the page's `fig` counter. `light` sets it
 * on a pale panel with room around it, for screenshots with a transparent edge.
 */
function Frame({ light, caption, children }: { light?: boolean; caption: ReactNode; children: ReactNode }) {
  return (
    <figure className={`${full} m-0 mt-6 mb-2 flex flex-col gap-3`}>
      <div className={light ? "flex justify-center rounded-[20px] bg-[#f6f7f8] p-[clamp(20px,3vw,40px)]" : "flex justify-center"}>
        {children}
      </div>
      <FigCaption>{caption}</FigCaption>
    </figure>
  )
}

function Clip({ src, label }: { src: string; label: string }) {
  return <video src={src} autoPlay loop muted playsInline aria-label={label} className="block h-auto max-h-[64vh] w-auto max-w-full rounded-[14px]" />
}

/** The three ideas of the solution, each a card that jumps to its section. */
function Pillars({ items }: { items: { title: string; text: string; href: string }[] }) {
  return (
    <div className={`${full} grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 pt-2`}>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="flex flex-col gap-2.5 rounded-2xl bg-[#f6f7f8] p-6 text-ink transition-colors duration-200 hover:bg-[#eceef1]"
        >
          <span className="text-[24px] leading-[1.2] font-medium tracking-[-0.02em] text-balance">{item.title}</span>
          <span className="text-[15px] leading-[1.45] text-[#3d3c44] text-pretty">{item.text}</span>
          <span className="mt-auto pt-1.5 text-[13px] leading-[1.45] text-brand">See how ↓</span>
        </a>
      ))}
    </div>
  )
}

export const liveopsAlertingPage: WorkProjectPage = {
  layout: "v4",
  // The cover is a wide browser frame; show it whole rather than cropped to 16:9.
  heroAspect: "aspect-[2400/847]",
  readTime: "2 min read",
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
    { id: "goal", title: "Goal" },
    { id: "discovery", title: "Discovery" },
    { id: "solution", title: "Solution", isParent: true, isGateStart: true },
    { id: "surface", title: "Surface failures", parent: "solution" },
    { id: "context-to-act", title: "Context to act", parent: "solution" },
    { id: "responsibility", title: "Responsibility", parent: "solution" },
    { id: "tradeoffs", title: "Key tradeoffs" },
    { id: "impact", title: "Impact" },
    { id: "learned", title: "What I learned" },
  ],
  renderBeforeGate: () => (
    <>
      <Section id="overview" title="Live mobile games rely on continuous updates after release.">
        <Lead>
          At Tactile, updates are managed through an internal LiveOps Dashboard, where teams configure events,
          experiments, player targeting, and feature rollouts without shipping new app versions.
        </Lead>
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
          <p className={`${right} m-0 text-[18px] leading-[1.6] text-pretty`}>
            Failures were detected by backend systems, but not surfaced in the LiveOps Dashboard.
          </p>
        </div>
      </section>

      {/* Goal, as a centred statement under a small grey label. */}
      <section id="goal" className="pt-[120px] pb-6">
        <div className="grid grid-cols-12 gap-x-6 gap-y-5 text-center">
          <h2 className="col-span-12 m-0 text-[15px] leading-[1.45] font-normal text-ink-meta">Goal</h2>
          <p className="col-span-12 m-0 text-[clamp(32px,3.6vw,48px)] leading-[1.25] font-medium tracking-[-0.025em] text-balance lg:col-span-10 lg:col-start-2">
            Surface backend failures to LiveOps creators early so they can act before players are affected.
          </p>
        </div>
      </section>

      <Section id="discovery" title="Discovery">
        <h3 data-text="" className={`${right} m-0 text-[24px] leading-[1.3] font-medium tracking-[-0.02em]`}>
          Critical signals lived outside the LiveOps Dashboard
        </h3>
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
        <Pillars
          items={[
            {
              title: "Show failures where creators work",
              text: "A critical issues banner on the homepage and a red badge on each game in the sidebar.",
              href: "#surface",
            },
            {
              title: "Give enough context to act",
              text: "Issue and update lists that say what broke, where, and how it was detected.",
              href: "#context-to-act",
            },
            {
              title: "Make every alert someone’s job",
              text: "Every resource has an owner who is always alerted. Everyone else opts in.",
              href: "#responsibility",
            },
          ]}
        />
      </Section>

      <Section id="surface" title="Surface failures where creators already work" sub>
        <div className={`${full} grid grid-cols-12 items-start gap-6`}>
          <p data-text="" className="col-span-12 m-0 text-[24px] leading-[1.3] tracking-[-0.015em] text-pretty lg:col-span-6">
            I made critical states visible directly in the left-hand sidebar, where they could not be missed.
          </p>
          <figure className="col-span-12 m-0 flex flex-col gap-3 lg:col-span-5 lg:col-start-8">
            <div className="flex justify-center rounded-[20px] bg-[#f6f7f8] p-[clamp(20px,3vw,40px)]">
              <Image
                src={`${cdn}/image/upload/f_auto,q_auto/v1769610095/sidebar-badges.png`}
                alt="Sidebar with persistent attention badges for issues and updates"
                width={640}
                height={868}
                className="h-auto max-h-[70vh] w-auto max-w-full object-contain"
                sizes="(min-width: 1280px) 480px, 100vw"
              />
            </div>
            <FigCaption>Sidebar with persistent attention badges for issues and updates</FigCaption>
          </figure>
        </div>
        <div className={`${full} mt-6 mb-2 grid grid-cols-1 items-start gap-6 min-[720px]:grid-cols-2`}>
          {[
            { src: `${cdn}/video/upload/v1769610490/avatar-sidebar.mp4`, caption: "Avatar-level signal" },
            { src: `${cdn}/video/upload/v1769610494/game-sidebar.mp4`, caption: "Game-level signals" },
          ].map((clip) => (
            <figure key={clip.src} className="m-0 flex flex-col gap-3">
              <video src={clip.src} autoPlay loop muted playsInline aria-label={clip.caption} className="block aspect-[1920/1056] h-auto w-full rounded-[14px] bg-[#f1f2f4] object-contain" />
              <FigCaption>{clip.caption}</FigCaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section id="context-to-act" title="Give enough context to act" sub>
        <Lead>Clicking into the Critical Issues or Latest Updates views reveals structured lists with clear context.</Lead>
        <Frame caption="Give enough context to act">
          <Clip src={`${cdn}/video/upload/v1769610246/list-views1.mp4`} label="Critical issues list view, resolving and reopening an issue" />
        </Frame>
      </Section>

      <Section id="responsibility" title="Make every alert someone’s responsibility" sub wide>
        <h3 data-text="" className={`${stack} m-0 text-[24px] leading-[1.3] font-medium tracking-[-0.02em]`}>
          Ownership and watchers
        </h3>
        <p data-text="" className={`${stack} ${body}`}>Alerting only works if responsibility is clear.</p>
        <p data-text="" className={`${stack} ${body}`}>
          I introduced ownership as a first-class concept across LiveOps resources.
        </p>
        {/* The two ownership recordings side by side, cut to the same height. */}
        <div className={`${full} mt-6 mb-2 grid grid-cols-1 items-start gap-6 min-[720px]:grid-cols-2`}>
          {[
            { src: "v1769610439/transfer-ownership.mp4", cap: "Transferring ownership of a resource" },
            { src: "v1775044437/adding-watcher.mp4", cap: "Adding a watcher to a resource" },
          ].map((clip) => (
            <figure key={clip.src} className="m-0 flex flex-col gap-3">
              <video
                src={`${cdn}/video/upload/${clip.src}`}
                autoPlay
                loop
                muted
                playsInline
                aria-label={clip.cap}
                className="block aspect-[16/10] w-full rounded-[14px] object-cover object-top"
              />
              <FigCaption>{clip.cap}</FigCaption>
            </figure>
          ))}
        </div>
        <h3 data-text="" className={`${stack} m-0 mt-5 border-t border-hairline pt-4 text-[24px] leading-[1.3] font-medium tracking-[-0.02em]`}>
          Notification settings
        </h3>
        <p data-text="" className={`${stack} ${body}`}>
          To balance signal and noise, I designed a subscription-based notification model.
        </p>
        <figure className={`${full} m-0 mt-6 mb-2 flex flex-col gap-3`}>
          <video
            src={`${cdn}/video/upload/v1769610452/notifications-settings.mp4`}
            autoPlay
            loop
            muted
            playsInline
            aria-label="Notification settings: choosing games, resource types and alert types"
            className="block h-auto w-full rounded-[14px]"
          />
          <FigCaption>Make every alert someone’s responsibility</FigCaption>
        </figure>
      </Section>

      <Section id="tradeoffs" title="Key tradeoffs" wide>
        <TradeoffTable
          rows={[
            {
              decision: "Critical issues on the homepage",
              from: "Separate Issues view only",
              to: "Preview on the homepage, full list in Issues",
              note: "The proposal was to drop the critical issues banner from the homepage and keep issues in a separate view. I pushed back: creators start their day on the homepage, so that is where a failure has to show up. We kept a short preview there that links to the full view.",
              media: [
                { caption: "After: critical issues previewed at the top of the homepage.", alt: "The LiveOps homepage with the critical issues banner at the top", image: "/images/project-liveops.webp", width: 2400, height: 847 },
              ],
            },
            {
              decision: "Homepage updates",
              from: "Unread only",
              to: "Everything from the last 10 days",
              note: "Early versions showed only unread updates, causing items to disappear once marked as read.",
              media: [
                { caption: "Before: only unread updates, so read items disappeared.", alt: "Latest updates showing unread items only", video: `${cdn}/video/upload/v1769610321/only-unread.mp4`, aspect: "1 / 1" },
                { caption: "After: everything from the last 10 days, with an unread filter.", alt: "Latest updates showing the last 10 days", video: `${cdn}/video/upload/v1769610236/read-and-unread.mp4`, aspect: "1 / 1" },
              ],
            },
            {
              decision: "Sidebar badges",
              from: "One for issues, one for updates",
              to: "One per game, coloured by severity",
              note: "The team first wanted two dots per game, one for issues and one for updates. Across dozens of games that was noise, so I argued for a single dot coloured by severity.",
              media: [
                { caption: "Before and after: two badges per game became one, coloured by severity.", alt: "Sidebar badges before and after", image: `${cdn}/image/upload/f_auto,q_auto/v1769610097/one-badge.png`, width: 256, height: 774 },
              ],
            },
            {
              decision: "Email notifications",
              from: "Considered",
              to: "Dropped: in-Dashboard alerts, Slack for urgent",
              note: "Although email was initially considered, we removed it to avoid delayed responses and alert fatigue.",
              media: [
                { caption: "Email is greyed out. Alerts live in the Dashboard, with Slack and push for urgent ones.", alt: "Notification settings with email removed", image: `${cdn}/image/upload/v1769610116/email-notifications-removed.png`, width: 1080, height: 675 },
              ],
            },
          ]}
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
              <span className="text-[24px] leading-[1.15] font-medium tracking-[-0.035em] text-balance">
                {item.title}
              </span>
              <span className={`text-[15px] leading-[1.45] ${i === 0 ? "text-[#c9c8d0]" : "text-[#3d3c44]"}`}>
                {item.description}
              </span>
            </div>
          ))}
        </div>
        <p className={`${full} m-0 text-[13px] leading-[1.45] text-ink-meta`}>Source: incident data tracked in Datadog.</p>
      </Section>

      <Section id="learned" title="What I learned">
        <div className={`${right} flex flex-col`}>
          {[
            "Showing every update from every game to everyone was a headache. People should only see what they care about.",
            "Disagreeing with the team about keeping critical issues on the homepage felt uncomfortable. It taught me to trust my instincts.",
            "People are busy. Alerts have to find them, not wait for someone to open the Dashboard.",
          ].map((line) => (
            <p key={line} data-text="" className="m-0 border-t border-hairline py-4 text-[18px] leading-[1.5] text-pretty">
              {line}
            </p>
          ))}
        </div>
      </Section>
    </>
  ),
}
