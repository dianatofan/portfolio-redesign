"use client"

import type { ReactNode } from "react"
import type { Microcomponent } from "./types"

/*
 * A Figma-board reading of the microcomponents, from `Home v7.dc.html`: a list
 * to pick from, and a dotted canvas showing the picked one as a selected frame —
 * blue handles, its size underneath, and a named cursor parked on its corner.
 */

// Frame placement on the canvas: x and width in %, y and height in px.
const FRAME = { x: 25, y: 150, w: 50, h: 120, dim: "480 × 120" }

// The small mock each frame shows, keyed by microcomponent id.
const MOCKS: Record<string, ReactNode> = {
    "pulsing-conversation": (
        <div className="flex items-center gap-2.5 rounded-xl border border-[#ececef] px-4 py-2.5 text-sm">
            <span className="text-brand">✦</span>Drafting response<span className="text-ink-meta">…</span>
        </div>
    ),
    "switchboard-filter": (
        <div className="flex items-center gap-2 rounded-full border border-[#ececef] px-[9px] py-[7px] text-[13px]">
            <span className="px-1.5">Status</span>
            <span className="h-5 w-5 rounded-full bg-[#2fa37a]" />
            <span className="h-5 w-5 rounded-full bg-[#e2a33b]" />
            <span className="h-5 w-5 rounded-full bg-[#d6453a]" />
            <span className="h-5 w-5 rounded-full bg-brand" />
        </div>
    ),
    "illustrated-tutorial": (
        <div className="flex w-[82%] gap-[3px] text-[11px] text-white">
            <span className="flex-[4] bg-chart-neutral px-1 py-[7px] text-ink">4%</span>
            <span className="flex-[48] bg-ink-muted p-[7px]">control 48%</span>
            <span className="flex-[48] bg-brand p-[7px]">treatment 48%</span>
        </div>
    ),
}

const HANDLES = ["-left-1 -top-1", "-right-1 -top-1", "-left-1 -bottom-1", "-right-1 -bottom-1"]

export function Board({ items, index, onPick }: { items: Microcomponent[]; index: number; onPick: (i: number) => void }) {
    const item = items[index]

    return (
        <div className="mt-6 grid grid-cols-1 gap-5 min-[62.5rem]:grid-cols-[240px_minmax(0,1fr)]">
            <div className="flex flex-col gap-[18px] overflow-y-auto pr-2 min-[62.5rem]:h-[440px]">
                <ul className="flex flex-col gap-0.5" aria-label="Microcomponents">
                    {items.map((entry, i) => {
                        const active = i === index
                        return (
                            <li key={entry.id}>
                                <button
                                    type="button"
                                    onClick={() => onPick(i)}
                                    aria-pressed={active}
                                    className={`flex w-full items-center gap-2.5 rounded-[8px] px-2.5 py-[9px] text-left text-[15px] hover:bg-surface ${
                                        active ? "bg-surface text-ink" : "text-ink-muted"
                                    }`}
                                >
                                    <span className="text-xs text-ink-meta" aria-hidden>
                                        #
                                    </span>
                                    {entry.name}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <div className="relative h-[440px] overflow-hidden rounded-2xl bg-[#f5f5f5] bg-[radial-gradient(#d9d9dd_1px,transparent_1px)] bg-[length:20px_20px]">
                <div
                    className="absolute"
                    style={{ left: `${FRAME.x}%`, top: FRAME.y, width: `${FRAME.w}%` }}
                >
                    <span className="mb-1.5 block text-xs whitespace-nowrap text-[#0d99ff]">{item.name}</span>
                    <div
                        className="relative grid place-items-center bg-white shadow-[0_1px_2px_rgba(22,21,26,0.06)] outline outline-[1.5px] outline-[#0d99ff]"
                        style={{ height: FRAME.h }}
                    >
                        {MOCKS[item.id]}
                        {HANDLES.map((corner) => (
                            <span
                                key={corner}
                                aria-hidden
                                className={`absolute h-[7px] w-[7px] border border-[#0d99ff] bg-white ${corner}`}
                            />
                        ))}
                        <span
                            aria-hidden
                            className="absolute -bottom-[26px] left-1/2 -translate-x-1/2 rounded-[3px] bg-[#0d99ff] px-1.5 py-0.5 text-[11px] whitespace-nowrap text-white"
                        >
                            {FRAME.dim}
                        </span>
                    </div>
                </div>

                <span
                    aria-hidden
                    className="pointer-events-none absolute flex items-start gap-0.5"
                    style={{ left: `${FRAME.x + FRAME.w + 1}%`, top: FRAME.y + FRAME.h + 26 }}
                >
                    <svg width="16" height="18" viewBox="0 0 16 18">
                        <path d="M1 1 L1 15 L5 11 L8 17 L10 16 L7 10 L13 10 Z" fill="#7d69d6" stroke="#fff" strokeWidth="1.2" />
                    </svg>
                    <span className="mt-3.5 rounded-full bg-[#7d69d6] px-[7px] py-0.5 text-[11px] text-white">Diana</span>
                </span>

                <span className="absolute bottom-4 left-5 text-[13px] text-ink-muted">{item.blurb}</span>
                <span className="absolute right-5 bottom-4 text-[13px] text-ink-meta">
                    {index + 1} of {items.length}
                </span>
            </div>
        </div>
    )
}
