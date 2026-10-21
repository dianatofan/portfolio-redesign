"use client"

import { useEffect, useRef, useState } from "react"
import type { Microcomponent } from "./types"

/*
 * A Figma-board reading of the microcomponents, from `Home v7.dc.html`: a list
 * to pick from, and a dotted canvas showing the picked one, live, as a selected
 * frame: blue handles, its measured size underneath, and a named cursor parked
 * on its corner.
 */

// Frame width on the canvas, per component; each fills the frame it's given.
const FRAME_W: Record<string, string> = {
    "pulsing-conversation": "min(100%, 600px)",
    "switchboard-filter": "min(100%, 440px)",
    "illustrated-tutorial": "min(100%, 640px)",
}

const HANDLES = ["-left-1 -top-1", "-right-1 -top-1", "-left-1 -bottom-1", "-right-1 -bottom-1"]

/** The frame's rendered size, rounded, as Figma shows it under a selection. */
function useSize() {
    const ref = useRef<HTMLDivElement>(null)
    const [size, setSize] = useState("")
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect
            setSize(`${Math.round(width)} × ${Math.round(height)}`)
        })
        observer.observe(el)
        return () => observer.disconnect()
    }, [])
    return [ref, size] as const
}

export function Board({ items, index, onPick }: { items: Microcomponent[]; index: number; onPick: (i: number) => void }) {
    const item = items[index]
    const [frame, size] = useSize()

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

            <div className="relative flex min-h-[560px] items-center justify-center overflow-hidden rounded-2xl bg-[#f5f5f5] bg-[radial-gradient(#d9d9dd_1px,transparent_1px)] bg-[length:20px_20px] px-4 pt-12 pb-20 sm:px-10">
                <div className="relative" style={{ width: FRAME_W[item.id] ?? "min(100%, 560px)" }}>
                    <span className="mb-1.5 block text-xs whitespace-nowrap text-[#0d99ff]">{item.name}</span>
                    <div
                        ref={frame}
                        className="relative bg-white shadow-[0_1px_2px_rgba(22,21,26,0.06)] outline outline-[1.5px] outline-[#0d99ff]"
                    >
                        {/* Keyed so each component starts its animation fresh when picked. */}
                        <div key={item.id}>{item.render()}</div>
                        {HANDLES.map((corner) => (
                            <span
                                key={corner}
                                aria-hidden
                                className={`pointer-events-none absolute h-[7px] w-[7px] border border-[#0d99ff] bg-white ${corner}`}
                            />
                        ))}
                        {size && (
                            <span
                                aria-hidden
                                className="absolute -bottom-[26px] left-1/2 -translate-x-1/2 rounded-[3px] bg-[#0d99ff] px-1.5 py-0.5 text-[11px] whitespace-nowrap text-white tabular-nums"
                            >
                                {size}
                            </span>
                        )}
                        <span aria-hidden className="pointer-events-none absolute top-full left-full mt-1.5 ml-1 hidden items-start gap-0.5 sm:flex">
                            <svg width="16" height="18" viewBox="0 0 16 18">
                                <path d="M1 1 L1 15 L5 11 L8 17 L10 16 L7 10 L13 10 Z" fill="#7d69d6" stroke="#fff" strokeWidth="1.2" />
                            </svg>
                            <span className="mt-3.5 rounded-full bg-[#7d69d6] px-[7px] py-0.5 text-[11px] text-white">Diana</span>
                        </span>
                    </div>
                </div>

                <span className="absolute bottom-4 left-5 text-[13px] text-ink-muted">{item.blurb}</span>
                <span className="absolute right-5 bottom-4 text-[13px] text-ink-meta">
                    {index + 1} of {items.length}
                </span>
            </div>
        </div>
    )
}
