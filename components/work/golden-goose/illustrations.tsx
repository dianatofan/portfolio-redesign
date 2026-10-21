import type { ReactNode } from "react"
import { buildSteps, pairStorySvg } from "./svgs"

/*
 * The Golden Goose Digital Museum illustrations. The drawings are animated
 * SVG from the design file, so they're set as markup rather than rebuilt.
 */

/** Pick a pair, spin it, read its story. */
export function PairStory({ caption }: { caption: ReactNode }) {
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div
        className="rounded-[14px] bg-[#f4f4f4] p-[clamp(16px,3vw,32px)] [&>svg]:block [&>svg]:h-auto [&>svg]:w-full [&>svg]:overflow-visible"
        dangerouslySetInnerHTML={{ __html: pairStorySvg }}
      />
      <figcaption className="text-[13px] text-ink-meta">{caption}</figcaption>
    </figure>
  )
}

/** Photograph, generate, refine, place, remember. */
export function BuildSteps() {
  return (
    <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-x-4 gap-y-6 p-0">
      {buildSteps.map((step) => (
        <li key={step.n} className="flex min-w-0 flex-col gap-3">
          <div
            aria-hidden
            className="flex aspect-square items-center justify-center rounded-[14px] bg-[#f4f4f4] [&>svg]:block [&>svg]:h-auto [&>svg]:w-[86%] [&>svg]:overflow-visible"
            dangerouslySetInnerHTML={{ __html: step.svg }}
          />
          <div className="flex flex-col gap-1">
            <span className="text-[13px] text-ink-meta tabular-nums">{step.n}</span>
            <span className="text-[18px] leading-[1.3] font-medium tracking-[-0.01em]">{step.title}</span>
            <span className="text-[15px] leading-[1.45] text-ink-muted text-pretty">{step.text}</span>
          </div>
        </li>
      ))}
    </ol>
  )
}
