import type { ReactNode } from "react"
import { FigCaption } from "./shared"

/*
 * The building blocks of every case study body (LiveOps Alerting, Game setup
 * automation, Travel planning, Diana's Diamonds): each section is a 12-column grid with the headline on the left,
 * text on the right and figures across the full width.
 *
 * Widths. The page sets the gutter (20 / 32 / 48px) and a centred 1,200px cap;
 * only the hero runs edge to edge. Inside the cap, from 1,024px up:
 *   - headline: 5 columns on the left (`Section`)
 *   - prose: 6 columns on the right (`right`), ~590px
 *   - sections that are mostly cards, rows or one big figure: `wide`, with the
 *     headline across all 12 and text at 7 (`stack`)
 *   - product screens, flows, tables: all 12 (`full`)
 *   - tall, narrow or low-resolution images: cap them (5 columns beside the
 *     text, or ~720px) rather than stretch them
 * Statements (the Problem panel, the Goal) are the exception: 12 and 10.
 */

export const right = "col-span-12 lg:col-span-6 lg:col-start-7"
export const full = "col-span-12"
// Under a full-width headline, the text stacks on the left.
export const stack = "col-span-12 lg:col-span-7"
export const lead = "m-0 text-[24px] leading-[1.3] tracking-[-0.02em] text-pretty"
export const body = "m-0 text-[18px] leading-[1.6] text-[#3d3c44] text-pretty"

/*
 * A section: a major one opens under an ink rule with a 48px headline, a sub
 * one under a hairline with a smaller headline. `wide` puts the headline over
 * all 12 columns, for sections of rows or cards.
 */
export function Section({
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

export function Lead({ children, className = right }: { children: ReactNode; className?: string }) {
  return (
    <p data-text="" className={`${className} ${lead}`}>
      {children}
    </p>
  )
}

export function P({ children, className = right }: { children: ReactNode; className?: string }) {
  return (
    <p data-text="" className={`${className} ${body}`}>
      {children}
    </p>
  )
}

export function H3({ id, children, className = right }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <h3 id={id} data-text="" className={`${className} scroll-mt-24 m-0 mt-5 border-t border-hairline pt-4 text-[24px] leading-[1.3] font-medium tracking-[-0.02em]`}>
      {children}
    </h3>
  )
}

/**
 * A figure in the column, numbered by the page's `fig` counter. `light` sets it
 * on a pale panel with room around it, for screenshots with a transparent edge.
 */
export function Frame({ light, caption, children }: { light?: boolean; caption: ReactNode; children: ReactNode }) {
  return (
    <figure className={`${full} m-0 mt-6 mb-2 flex flex-col gap-3`}>
      <div className={light ? "flex justify-center rounded-[20px] bg-[#f6f7f8] p-[clamp(20px,3vw,40px)]" : "flex justify-center"}>
        {children}
      </div>
      <FigCaption>{caption}</FigCaption>
    </figure>
  )
}

/** The main ideas of a section, each a card that jumps to where it's explained. */
export function Pillars({ items }: { items: { title: string; text: string; href: string }[] }) {
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

export function Clip({ src, label }: { src: string; label: string }) {
  return <video src={src} autoPlay loop muted playsInline aria-label={label} className="block h-auto max-h-[64vh] w-auto max-w-full rounded-[14px]" />
}
