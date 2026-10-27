import Image from "next/image"
import type { ReactNode } from "react"
import { figCaption } from "@/components/work/caption"

/*
 * The before and after for each of Diana's Diamonds' key tradeoffs, shown in
 * the tradeoff dialog. Where there's a real screen it's used; the rest are
 * drawn, and say so in their caption.
 */

const media = "/images/dianas-diamonds"

function Side({ after, caption, children }: { after?: boolean; caption: string; children: ReactNode }) {
  return (
    <figure className="m-0 flex flex-col gap-2.5">
      <span
        className={`self-start rounded-full px-2.5 py-1 text-[13px] leading-[1.45] font-medium ${
          after ? "bg-brand text-white" : "bg-hairline text-[#3d3c44]"
        }`}
      >
        {after ? "After · shipped" : "Before"}
      </span>
      <div
        className={`relative grid min-h-[220px] place-items-center overflow-hidden rounded-[14px] bg-[#f1f2f4] outline outline-offset-2 ${
          after ? "outline-2 outline-brand" : "outline-transparent"
        }`}
      >
        {children}
      </div>
      <figcaption className={figCaption}>{caption}</figcaption>
    </figure>
  )
}

function Pair({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 items-start gap-6 min-[720px]:grid-cols-2">{children}</div>
}

function Screen({ src, alt, width, height }: { src: string; alt: string; width: number; height: number }) {
  return <Image src={src} alt={alt} width={width} height={height} className="block h-auto w-full" sizes="(min-width: 1140px) 520px, 100vw" />
}

const chip = "rounded-full bg-white px-2.5 py-0.5 text-[13px] leading-[1.45] text-ink"

function Flow({ steps, end }: { steps: string[]; end: { label: string; tone: string } }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-6">
      {steps.map((s) => (
        <span key={s} className="flex items-center gap-2">
          <span className={chip}>{s}</span>
          <span aria-hidden="true" className="text-[13px] text-ink-meta">
            →
          </span>
        </span>
      ))}
      <span className={`rounded-full px-2.5 py-0.5 text-[13px] leading-[1.45] ${end.tone}`}>{end.label}</span>
    </div>
  )
}

export function AddingPrototypes() {
  return (
    <Pair>
      <Side caption="The in-browser agent, before it was retired.">
        <Screen src={`${media}/agent-request.jpg`} alt="The hub's Request a change form: Claude makes the change on a branch of its own" width={2000} height={1250} />
      </Side>
      <Side after caption="Illustration · the shape of a session, not real output.">
        <div className="w-full self-stretch bg-ink p-5 font-mono text-[12px] leading-[1.7] text-[#c9c8d0]">
          <div>
            <span className="text-[#7b5cff]">$</span> claude &quot;add a prototype for the in-game inbox&quot;
          </div>
          <div className="text-ink-meta">→ reading the guidelines</div>
          <div className="text-ink-meta">→ branch prototype/in-game-inbox</div>
          <div className="text-[#6fcf97]">✓ pull request opened</div>
        </div>
      </Side>
    </Pair>
  )
}

export function EachPrototype() {
  return (
    <Pair>
      <Side caption="Illustration · the brief: a list of links that redirect.">
        <div className="flex w-full flex-col gap-2 p-5">
          {["Config holdout groups", "In-game inbox", "Recurring feature schedules"].map((name) => (
            <span key={name} className="flex justify-between rounded-[8px] border border-hairline bg-white px-3 py-2 text-[13px] leading-[1.45]">
              <span>{name}</span>
              <span aria-hidden="true" className="text-brand">
                ↗
              </span>
            </span>
          ))}
          <span className="text-[13px] leading-[1.45] text-ink-meta">No context, just a redirect.</span>
        </div>
      </Side>
      <Side after caption="A prototype's details page: what changed, its ticket and status.">
        <Screen src={`${media}/details.png`} alt="The details page for Config holdout groups, with What it is and What's new beside the prototype" width={1600} height={1000} />
      </Side>
    </Pair>
  )
}

export function Merging() {
  return (
    <Pair>
      <Side caption="Illustration · changes could reach production with nobody reviewing them.">
        <Flow steps={["Claude"]} end={{ label: "main", tone: "bg-[#fde8e8] text-[#b42318]" }} />
      </Side>
      <Side after caption="Illustration · every change to production is a person's click.">
        <Flow steps={["Claude", "Pull request"]} end={{ label: "A person merges", tone: "bg-[#e3f3e6] text-[#1e7a3c]" }} />
      </Side>
    </Pair>
  )
}

/** Prototypes in the library and who added each, as rows. */
function Authors({ rows }: { rows: [string, string][] }) {
  return (
    <div className="flex w-full flex-col gap-2 p-5">
      {rows.map(([name, by]) => (
        <span key={name} className="flex items-baseline justify-between gap-3 rounded-[8px] border border-hairline bg-white px-3 py-2 text-[13px] leading-[1.45]">
          <span>{name}</span>
          <span className={by === "Diana" ? "text-ink-meta" : "text-brand"}>{by}</span>
        </span>
      ))}
    </div>
  )
}

export function Handover() {
  return (
    <Pair>
      <Side caption="Illustration · every prototype added by me.">
        <Authors
          rows={[
            ["Config holdout groups", "Diana"],
            ["In-game inbox", "Diana"],
            ["Recurring feature schedules", "Diana"],
            ["Targeting presets", "Diana"],
          ]}
        />
      </Side>
      <Side after caption="Illustration · from the published guidelines, others add their own.">
        <Authors
          rows={[
            ["Config holdout groups", "Diana"],
            ["In-game inbox", "Designer"],
            ["Recurring feature schedules", "Diana"],
            ["Targeting presets", "PM"],
          ]}
        />
      </Side>
    </Pair>
  )
}
