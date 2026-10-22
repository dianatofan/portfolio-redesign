"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import { EMPTY_PAGE_ART } from "./empty-page-art"

/*
 * The empty state from the prototype library's "Active project in the sidebar"
 * prototype, with its art copied as-is (empty-page-art.ts, from
 * apps/dashboard/active-project/src/wireframe on the active-project-sidebar-ux
 * branch) and mounted the way OutOfScopeBody in WireframePage.tsx mounts it:
 * --game-color fills the game tile, data-crumbs (1 to 4) sets how many
 * breadcrumbs the mini header shows, data-expanded opens the mini sidebar and
 * data-anim plays its frames for the moment after it's toggled.
 */

// The prototype's games (mocks/fixtures/games.ts), in their core-designsystem colours.
const GAMES = [
  { name: "Sunny Shores", short: "SS", color: "#15B79E" },
  { name: "Merge Tavern", short: "MT", color: "#36BFFA" },
  { name: "Apple Orchard", short: "AO", color: "#E31B54" },
  { name: "Kitty Kitchen", short: "KK", color: "#875BF7" },
]

// A few of the prototype's pages (prototype/config.ts): lists, and details
// pages whose breadcrumbs run one deeper per parent.
const PAGES = [
  { name: "Configurations", crumbs: ["Configurations"], kind: "list" },
  { name: "A/B Tests", crumbs: ["A/B Tests"], kind: "list" },
  { name: "Config details", crumbs: ["Configurations", "Shop offers"], kind: "details" },
  { name: "Feature type", crumbs: ["Scheduled Features", "Feature types", "Attempts tournament"], kind: "details" },
] as const

function Art({ game, crumbs, expanded, anim }: { game: string; crumbs: number; expanded: boolean; anim: boolean }) {
  return (
    <div
      aria-hidden
      data-crumbs={Math.min(4, Math.max(1, crumbs))}
      data-expanded={expanded}
      data-anim={anim || undefined}
      style={{ "--game-color": game } as CSSProperties}
      className="w-[300px] max-w-full [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
      dangerouslySetInnerHTML={{ __html: EMPTY_PAGE_ART.rail }}
    />
  )
}

const chip = "cursor-pointer rounded-full border px-2.5 py-1 text-[12px] leading-none transition-colors"

/**
 * The empty state as the prototype shows it, with its game, its page and its
 * sidebar to switch: each pick updates the mini page the way the prototype does.
 */
export function EmptyState() {
  const [game, setGame] = useState(0)
  const [page, setPage] = useState(0)
  const [expanded, setExpanded] = useState(false)
  // As in the prototype: the sidebar's frames play only for the moment after it's toggled.
  const [anim, setAnim] = useState(false)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setAnim(true)
    const done = window.setTimeout(() => setAnim(false), 300)
    return () => window.clearTimeout(done)
  }, [expanded])

  const g = GAMES[game]
  const p = PAGES[page]
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-5 py-4 text-center">
      <div className="flex flex-wrap justify-center gap-1.5" role="group" aria-label="Game">
        {GAMES.map((x, i) => (
          <button
            key={x.name}
            type="button"
            aria-pressed={i === game}
            onClick={() => setGame(i)}
            className={`${chip} flex items-center gap-1.5 ${i === game ? "border-ink text-ink" : "border-[#e4e3e8] text-ink-muted"}`}
          >
            <span className="grid h-4 w-4 place-items-center rounded-[4px] text-[8px] font-semibold text-white" style={{ background: x.color }}>
              {x.short}
            </span>
            {x.name}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5" role="group" aria-label="Page">
        {PAGES.map((x, i) => (
          <button
            key={x.name}
            type="button"
            aria-pressed={i === page}
            onClick={() => setPage(i)}
            className={`${chip} ${i === page ? "border-ink bg-ink text-white" : "border-[#e4e3e8] text-ink-muted"}`}
          >
            {x.name}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={expanded}
          onClick={() => setExpanded((v) => !v)}
          className={`${chip} ${expanded ? "border-ink text-ink" : "border-[#e4e3e8] text-ink-muted"}`}
        >
          {expanded ? "« Collapse sidebar" : "» Expand sidebar"}
        </button>
      </div>
      <Art game={g.color} crumbs={p.crumbs.length} expanded={expanded} anim={anim} />
      <span className="text-[12px] text-ink-meta">
        {g.name} <span aria-hidden>/</span> {p.crumbs.join(" / ")}
      </span>
      <p className="m-0 -mt-1 text-[17px] font-medium text-[#9a9ea7]">
        {p.kind === "list" ? "The list goes here" : "The details go here"}
      </p>
      <p className="m-0 text-[13px] text-[#a6a9b1]">To keep it lightweight, this prototype only builds the sidebar and the header.</p>
    </div>
  )
}

/** The art alone, for the collapsed frame. */
export function EmptyStatePreview() {
  return (
    <div className="h-[104px] w-[125px]">
      <Art game={GAMES[0].color} crumbs={1} expanded={false} anim={false} />
    </div>
  )
}
