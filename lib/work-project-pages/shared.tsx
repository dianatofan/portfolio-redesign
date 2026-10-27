import Image from "next/image"
import type { CSSProperties, ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider"
import { figCaption } from "@/components/work/caption"

/*
 * Editorial case-study type, shared by every project page so the body reads as
 * one system: 18px ink body, tight display headings, 13px grey meta.
 */
export const csHeading =
  "mb-5 text-[24px] sm:text-[36px] font-medium leading-[1.35] sm:leading-[1.1] tracking-[-0.035em] text-ink text-balance"
export const csSubheading = "mb-2 text-[18px] font-medium leading-[1.6] tracking-[-0.02em] text-ink"
export const csParagraph = "max-w-[640px] text-lg leading-[1.6] text-ink text-pretty"
export const csEyebrow = "mb-3 text-[13px] text-ink-meta"
export const csCaption = "mt-2.5 text-[13px] text-ink-meta"
/** A line set between two hairlines, 24px under what precedes it. */
export const csPullQuote =
  "mt-6 border-y border-hairline py-8 text-[24px] font-medium leading-[1.1] tracking-[-0.035em] text-ink text-balance"

/**
 * "Fig. N — caption". N comes from the `fig` CSS counter the case-study page
 * resets (the hero is Fig. 1), so figures number themselves in reading order.
 */
export function FigCaption({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <figcaption className={`${figCaption} ${className}`}>
      <span className="text-ink [counter-increment:fig] before:content-['Fig._'_counter(fig)]" /> — {children}
    </figcaption>
  )
}

export function InsightCards({
  items,
}: {
  items: Array<{
    id?: string
    title: string
    description: string
  }>
}) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-x-6 border-t border-hairline md:grid-cols-3">
      {items.map((item) => (
        <div id={item.id} key={item.id ?? item.title} className="border-b border-hairline py-5 md:border-b-0">
          <p className="text-[18px] font-medium leading-[1.6] text-ink">{item.title}</p>
          <p className="mt-1 text-[18px] leading-[1.6] text-ink-muted">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  )
}

export function ConstraintCards({
  items,
}: {
  items: Array<{
    title: string
    description: string
    icon: LucideIcon
  }>
}) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-x-6 border-t border-hairline md:grid-cols-2">
      {items.map((item) => {
        const Icon = item.icon

        return (
          <div key={item.title} className="border-b border-hairline py-5">
            <Icon size={18} className="mb-3 text-ink" aria-hidden="true" />
            <p className="text-[18px] font-medium leading-[1.6] text-ink">{item.title}</p>
            <p className="mt-1 text-[18px] leading-[1.6] text-ink-muted">
              {item.description}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export function OutcomeCards({
  items,
}: {
  items: Array<{
    title: string
    description: string
  }>
}) {
  return (
    <div className="grid grid-cols-1 gap-x-6 border-t border-hairline md:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="flex flex-col gap-1.5 border-b border-hairline py-6">
          <p className="text-[24px] font-medium leading-[1.35] tracking-[-0.03em] text-ink">
            {item.title}
          </p>
          <p className="max-w-[420px] text-[18px] leading-[1.6] text-ink-muted">{item.description}</p>
        </div>
      ))}
    </div>
  )
}

export function CaseStudyImageGrid({
  images,
  columns = 2,
}: {
  images: Array<{ src: string; alt: string }>
  columns?: 2 | 3
}) {
  return (
    <div className={`mt-8 grid grid-cols-1 gap-6 ${columns === 3 ? "min-[720px]:grid-cols-3" : "min-[720px]:grid-cols-2"}`}>
      {images.map((img) => (
        <figure key={img.src} className="flex flex-col gap-3">
          <div
            className={`relative overflow-hidden rounded-[4px] bg-surface ${columns === 3 ? "aspect-square" : "aspect-[4/3]"}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-contain"
              sizes="(max-width: 720px) 100vw, 40vw"
            />
          </div>
          <FigCaption>{img.alt}</FigCaption>
        </figure>
      ))}
    </div>
  )
}

export function BeforeAfterCompare({
  pairs,
}: {
  pairs: Array<{ before: string; after: string; alt?: string; caption?: string }>
}) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8 place-items-center">
      {pairs.map((pair, i) => (
        <div key={i} className="flex flex-col items-center gap-3">
          <div className="max-w-full overflow-hidden rounded-[4px]" style={{ width: "380px", aspectRatio: "24 / 49" }}>
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage src={pair.before} alt={`Before ${pair.alt ?? i + 1}`} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              }
              itemTwo={
                <ReactCompareSliderImage src={pair.after} alt={`After ${pair.alt ?? i + 1}`} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              }
              style={{ width: "100%", height: "100%" }}
            />
          </div>
          {pair.caption && (
            <p className="text-center text-[13px] text-ink-meta">{pair.caption}</p>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * A section figure: 16:10 on the grey surface with a numbered caption, as in
 * Case Study v2. The caption defaults to the alt text; pass `caption={null}`
 * for an image that is one tile of a larger figure. Screenshots are contained
 * rather than cropped, so their text stays whole.
 */
export function CaseStudyImage({
  src,
  alt,
  priority = false,
  background = true,
  topMargin = true,
  ratioClass = "aspect-[16/10]",
  fit = "contain",
  caption,
}: {
  src: string
  alt: string
  priority?: boolean
  background?: boolean
  topMargin?: boolean
  ratioClass?: string
  fit?: "contain" | "cover"
  caption?: ReactNode | null
}) {
  const text = caption === undefined ? alt : caption
  return (
    <figure className={`${topMargin ? "mt-3" : ""} flex flex-col gap-2.5`}>
      <div className={`relative ${ratioClass} overflow-hidden ${background ? "bg-surface" : ""}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={fit === "cover" ? "object-cover" : "object-contain"}
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>
      {text ? <FigCaption>{text}</FigCaption> : null}
    </figure>
  )
}

/**
 * A terminal or Claude Code window with a few lines in it. Commands get a `$`
 * prompt, messages to Claude get a `>`, comments and output are dimmed. Long
 * lines scroll inside the window, never the page.
 */
export function TerminalSnippet({
  title = "Terminal",
  lines,
}: {
  title?: string
  lines: Array<{ kind: "cmd" | "prompt" | "comment" | "out"; text: string }>
}) {
  return (
    <div className="mt-8 overflow-hidden rounded-[4px] bg-ink">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
        <span className="ml-2 text-[13px] text-white/50">{title}</span>
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[13px] leading-relaxed">
        {lines.map((line, index) => (
          <div
            key={index}
            className={`${line.kind === "comment" || line.kind === "out" ? "text-white/45" : "text-white/90"} ${
              // A message to Claude is prose: it wraps rather than scrolls.
              line.kind === "prompt" ? "whitespace-pre-wrap" : ""
            }`}
          >
            {line.kind === "cmd" && <span className="select-none text-[#7ee0a1]">$ </span>}
            {line.kind === "prompt" && <span className="select-none text-[#a99ae6]">&gt; </span>}
            {line.kind === "comment" ? `# ${line.text}` : line.text}
          </div>
        ))}
      </pre>
    </div>
  )
}

/*
 * Showcase blocks: short, visual-first pieces for case studies that read at a
 * glance. Each one carries a line or two of text at most.
 */

/** The summary that opens a showcase case study. */
export function TlDr({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] text-ink-meta">TL;DR</p>
      <div className="max-w-[640px] text-lg leading-[1.6] text-ink text-pretty [&>p+p]:mt-3">
        {children}
      </div>
    </div>
  )
}

/** Small cards with an icon, a title and one line, for problems or findings. */
export function IconCards({
  items,
  columns = 3,
}: {
  items: Array<{ icon: LucideIcon; title: string; description: string }>
  columns?: 2 | 3
}) {
  return (
    <div className={`mt-8 grid grid-cols-1 gap-3 ${columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
      {items.map(({ icon: Icon, title, description }) => (
        <div key={title} className="flex flex-col gap-2 rounded-2xl bg-surface p-5">
          <Icon size={18} className="text-brand" aria-hidden="true" />
          <p className="mt-1 text-[18px] font-medium leading-[1.6] text-ink">{title}</p>
          <p className="text-[18px] leading-[1.6] text-ink-muted">{description}</p>
        </div>
      ))}
    </div>
  )
}

/** One numbered decision: a big number, a one-line title, a sentence or two, then its visual. */
export function NumberedDecision({
  id,
  n,
  title,
  children,
  visual,
}: {
  id?: string
  n: string
  title: string
  children: ReactNode
  visual?: ReactNode
}) {
  /*
   * Text on the left, the visual on the right, as in the Create Canvas case
   * study: the recording fills the width, and the words stay beside it while
   * it plays. Stacked below 1100px.
   */
  return (
    <div
      id={id}
      className={`grid scroll-mt-24 grid-cols-1 gap-x-12 gap-y-5 ${
        visual ? "xl:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]" : ""
      }`}
    >
      <div className="flex min-w-0 flex-col gap-3 xl:sticky xl:top-28 xl:self-start">
        <span className="text-[36px] font-medium leading-[1.1] tracking-[-0.04em] text-brand">{n}</span>
        <h3 className="text-[24px] font-medium leading-[1.35] tracking-[-0.025em] text-ink text-balance">
          {title}
        </h3>
        <div className="max-w-[640px] text-[18px] leading-[1.6] text-ink-muted text-pretty">{children}</div>
      </div>
      {visual ? <div className="min-w-0">{visual}</div> : null}
    </div>
  )
}

/** A feature at a glance: its visual, a title and one line. */
export function FeatureCard({ media, title, description }: { media: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-2xl bg-surface">{media}</div>
      <p className="text-[18px] font-medium leading-[1.6] tracking-[-0.01em] text-ink">{title}</p>
      <p className="-mt-1.5 text-[18px] leading-[1.6] text-ink-muted text-pretty">{description}</p>
    </div>
  )
}

/** A technical aside in a grey box, led by "Under the hood:". */
export function UnderTheHood({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 rounded-2xl bg-surface px-6 py-5 text-[18px] leading-[1.6] text-ink-muted text-pretty">
      <span className="font-medium text-ink">Under the hood: </span>
      {children}
    </div>
  )
}

/** One full-width before/after: drag the handle to compare. Labels sit in the top corners. */
export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  alt,
  caption,
  ratio = "16 / 10",
}: {
  before: string
  after: string
  beforeLabel?: string
  afterLabel?: string
  alt: string
  caption?: ReactNode
  ratio?: string
}) {
  const pill = "pointer-events-none absolute top-3 rounded-full bg-white/90 px-2.5 py-1 text-[13px] font-medium text-ink shadow-[0_1px_2px_rgba(22,21,26,0.12)]"
  return (
    <figure className="flex flex-col gap-2.5">
      <div className="relative overflow-hidden rounded-2xl bg-surface" style={{ aspectRatio: ratio }}>
        <ReactCompareSlider
          itemOne={<ReactCompareSliderImage src={before} alt={`${alt}: ${beforeLabel}`} style={{ objectFit: "cover", width: "100%", height: "100%" }} />}
          itemTwo={<ReactCompareSliderImage src={after} alt={`${alt}: ${afterLabel}`} style={{ objectFit: "cover", width: "100%", height: "100%" }} />}
          style={{ width: "100%", height: "100%" }}
        />
        <span className={`${pill} left-3`}>{beforeLabel}</span>
        <span className={`${pill} right-3`}>{afterLabel}</span>
      </div>
      {caption ? <FigCaption>{caption}</FigCaption> : null}
    </figure>
  )
}

/** A reflection: an icon, a short title and two lines, stacked. */
export function Reflection({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div className="flex max-w-[640px] flex-col gap-3">
      <Icon size={20} className="text-brand" aria-hidden="true" />
      <p className="text-[24px] font-medium leading-[1.35] tracking-[-0.02em] text-ink text-balance">{title}</p>
      <div className="text-[18px] leading-[1.6] text-ink-muted text-pretty">{children}</div>
    </div>
  )
}

/*
 * Editorial blocks: the magazine furniture for skimming. A pull quote in the
 * margin, a problem-and-answer spread, a sidebar box and an editor's note.
 */

/** A line lifted into the margin: a short purple rule, then 24px ink. */
/**
 * A quiet aside for the margin: a small label, an optional thumbnail and one
 * line at body size. For anecdotes, so they don't compete with a PullQuote.
 */
export function MarginNote({
  label,
  image,
  media,
  children,
}: {
  label: string
  image?: string
  /** Any visual in place of the image, e.g. a live diamond; it floats the same way. */
  media?: ReactNode
  children: ReactNode
}) {
  return (
    <aside className="flex max-w-[360px] flex-col gap-4 border-t border-hairline pt-5">
      {/* Kept here so the float never depends on a stylesheet rebuild. */}
      <style>{"@keyframes gem-float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(2deg)}}"}</style>
      <span className="text-[13px] leading-[1.5] text-ink-meta">{label}</span>
      {image && (
        // multiply drops the render's near-white background into the page.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          // The render has a light grey backdrop; a soft oval mask fades it into the page.
          style={{
            maskImage: "radial-gradient(ellipse 50% 46% at 50% 50%, #000 62%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 50% 46% at 50% 50%, #000 62%, transparent 100%)",
          }}
          className="-ml-3 w-44 mix-blend-multiply motion-safe:animate-[gem-float_6s_ease-in-out_infinite]"
        />
      )}
      {media && <div className="-ml-3 motion-safe:animate-[gem-float_6s_ease-in-out_infinite]">{media}</div>}
      <p className="text-[18px] leading-[1.6] text-ink text-pretty">{children}</p>
    </aside>
  )
}

export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="m-0 flex max-w-[380px] flex-col gap-5">
      <span aria-hidden="true" className="block h-0.5 w-10 bg-brand" />
      <p className="text-[24px] font-medium leading-[1.35] tracking-[-0.02em] text-ink text-balance">{children}</p>
    </blockquote>
  )
}

/** Running text beside a pull quote in the right margin; stacked below 1100px. */
export function WithMargin({ children, aside }: { children: ReactNode; aside: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-x-28 gap-y-12 xl:grid-cols-[minmax(0,640px)_minmax(0,1fr)] xl:items-start">
      <div className="min-w-0">{children}</div>
      <aside className="xl:pt-2">{aside}</aside>
    </div>
  )
}

/** Each problem beside its answer, read across a hairline. */
export function ProblemSolution({
  rows,
}: {
  rows: Array<{ icon: LucideIcon; problem: string; detail: string; answer: string }>
}) {
  return (
    <div className="mt-12 flex flex-col">
      <div className="hidden grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)] pb-4 text-[13px] leading-[1.5] text-ink-meta md:grid">
        <span>Before</span>
        <span />
        <span>What the library does</span>
      </div>
      {rows.map(({ icon: Icon, problem, detail, answer }) => (
        <div
          key={problem}
          className="grid grid-cols-1 gap-y-4 border-t border-hairline py-8 md:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)] md:items-center"
        >
          <div className="flex gap-3">
            <Icon size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
            <div className="flex flex-col gap-1.5">
              <p className="text-[18px] font-medium leading-[1.6] text-ink">{problem}</p>
              <p className="text-[18px] leading-[1.6] text-ink-muted">{detail}</p>
            </div>
          </div>
          <span aria-hidden="true" className="hidden text-center text-[18px] leading-[1.6] text-ink-muted md:block">
            →
          </span>
          <p className="rounded-[16px] bg-surface px-6 py-5 text-[18px] leading-[1.6] text-ink text-pretty">{answer}</p>
        </div>
      ))}
    </div>
  )
}

/** A tinted aside, like a magazine sidebar: a title and a few tight lines. */
export function SidebarBox({
  title,
  items,
}: {
  title: string
  items: Array<{ icon: LucideIcon; title: string; description: string }>
}) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-surface p-6 sm:p-8 xl:p-10">
      <h2 className="text-[24px] font-medium leading-[1.35] tracking-[-0.02em] whitespace-nowrap text-ink sm:text-[36px] sm:leading-[1.1] sm:tracking-[-0.035em]">
        {title}
      </h2>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {items.map(({ icon: Icon, title: t, description }) => (
          <li key={t} className="flex gap-3">
            <Icon size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
            <p className="text-[18px] leading-[1.6] text-ink-muted">
              <span className="font-medium text-ink">{t}. </span>
              {description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** An editor's note: a bordered box with a small label, the text, and a figure beside it. */
export function EditorsNote({
  label,
  title,
  children,
  figure,
}: {
  label: string
  title: string
  children: ReactNode
  figure?: ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-8 rounded-2xl border border-hairline p-6 sm:p-8 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:gap-12 xl:p-10">
      <div className="flex flex-col gap-3">
        <span className="self-start rounded-[4px] bg-surface px-2 py-0.5 text-[13px] leading-[1.5] font-medium text-ink-meta">{label}</span>
        <h2 className="mb-3 text-[36px] font-medium leading-[1.1] tracking-[-0.035em] text-ink text-balance">{title}</h2>
        <div className="text-[18px] leading-[1.6] text-ink-muted text-pretty">{children}</div>
      </div>
      {figure ? <div className="min-w-0">{figure}</div> : null}
    </div>
  )
}

/*
 * A demo on a dark panel, like the Diamonds tour: #16151a, 24px corners, full
 * width to the header's gutter edges (it breaks out of the reading column).
 * The token colours are flipped inside, so figure captions read light.
 */
const DARK_TOKENS = {
  "--ink": "#ffffff",
  "--ink-meta": "#a3a1ad",
  "--ink-muted": "rgba(255,255,255,0.64)",
  "--hairline": "rgba(255,255,255,0.14)",
} as CSSProperties

export function DarkShowcase({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative left-1/2 w-[calc(100vw-2*var(--gutter))] max-w-none -translate-x-1/2 rounded-[24px] bg-[#16151a] p-5 text-white sm:p-10 xl:p-14 ${className}`}
      style={DARK_TOKENS}
    >
      {children}
    </div>
  )
}
