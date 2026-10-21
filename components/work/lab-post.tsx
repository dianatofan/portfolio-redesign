import Link from "next/link"
import type { ReactNode } from "react"

/*
 * The Lab post layout (boeuf-salad-decorator.html, money-jenga.html): the v4
 * title block with "← Lab · read time", the specs under a hairline and the
 * hero, then sections on a 12-column grid, and Previous / Next at the end.
 *
 * Widths. Every section sits in `labCol`: the page gutter (20 / 32 / 48px),
 * capped at a centred 1,200px. Inside it, pick by what the thing is:
 *   - read (paragraphs, headings): 8 columns, ~790px, for a ~70-character line
 *   - looked at (diagrams, screenshots, demos): 10 columns, ~1,000px
 *   - sets the page (title block, meta, hero, Previous / Next): all 12
 * Captions stay at their figure's left edge. Below 1,024px everything is
 * full width inside the gutter.
 */

export const labCol = "px-[max(var(--gutter),calc((100%-1200px)/2))]"
const grid = "grid grid-cols-12 items-start gap-x-6 gap-y-5"
export const labText = "col-span-12 lg:col-span-8 lg:col-start-3"
export const labFig = "col-span-12 lg:col-span-10 lg:col-start-2"
const labBody = "m-0 text-[18px] leading-[1.6] text-[#3d3c44] text-pretty"

export function LabPostHeader({
  title,
  standfirst,
  readTime,
  meta,
  action,
  hero,
}: {
  title: string
  standfirst: string
  readTime: string
  meta?: [label: string, value: string][]
  action?: { label: string; href: string }
  hero?: ReactNode
}) {
  return (
    <section className={`${labCol} flex flex-col gap-10 pt-10`}>
      <div className="grid grid-cols-12 items-end gap-6">
        <div className="col-span-12 flex flex-col gap-[18px] lg:col-span-9">
          <span className="flex items-baseline gap-3 text-[13px] text-ink-meta">
            <Link href="/#lab" className="transition-colors hover:text-brand">
              ← Lab
            </Link>
            <span aria-hidden="true">·</span>
            <span>{readTime}</span>
          </span>
          <h1 className="m-0 text-[clamp(40px,5.2vw,80px)] leading-none font-medium tracking-[-0.045em] text-balance">
            {title}
          </h1>
          <p className="m-0 max-w-[760px] text-[24px] leading-[1.3] tracking-[-0.015em] text-[#3d3c44] text-pretty">
            {standfirst}
          </p>
        </div>
        {action && (
          <div className="col-span-12 flex lg:col-span-3 lg:justify-end">
            <a
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-ink px-5 py-3 text-[15px] leading-[1.45] text-white transition-colors hover:bg-brand"
            >
              {action.label} ↗
            </a>
          </div>
        )}
      </div>
      {meta && (
        <dl className="grid grid-cols-2 gap-6 border-t border-hairline pt-4 min-[720px]:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
          {meta.map(([label, value]) => (
            <div key={label} className="flex flex-col gap-1">
              <dt className="text-[13px] text-ink-meta">{label}</dt>
              <dd className="text-[15px] leading-[1.45]">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {hero}
    </section>
  )
}

/** A section: a 24px heading over the text column. Untitled, it holds a lone figure. */
export function LabPostSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className={`${labCol} pt-[72px]`}>
      <div className={grid}>
        {title && (
          <h2 className={`${labText} m-0 text-[24px] leading-[1.08] font-medium tracking-[-0.035em] text-balance`}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  )
}

/** A paragraph at text width: 18px body type, as in the Lab post designs. */
export function LabParagraph({ children }: { children: ReactNode }) {
  return <p className={`${labText} ${labBody}`}>{children}</p>
}

/** A figure across the 10 middle columns. */
export function LabFigure({ children }: { children: ReactNode }) {
  return <div className={`${labFig} mt-4 mb-2`}>{children}</div>
}

type Neighbour = { title: string; href: string }

export function LabPrevNext({ prev, next }: { prev: Neighbour; next: Neighbour }) {
  const link = "flex flex-col gap-2 border-t border-ink py-6 text-ink transition-colors hover:text-brand"
  const name = "text-[24px] leading-[1.15] font-medium tracking-[-0.03em] text-balance"
  return (
    <nav aria-label="More in the Lab" className={`${labCol} grid grid-cols-2 gap-6 pt-[120px] pb-24`}>
      <Link href={prev.href} className={link}>
        <span className="text-[13px] text-ink-meta">← Previous</span>
        <span className={name}>{prev.title}</span>
      </Link>
      <Link href={next.href} className={`${link} items-end text-right`}>
        <span className="text-[13px] text-ink-meta">Next →</span>
        <span className={name}>{next.title}</span>
      </Link>
    </nav>
  )
}
