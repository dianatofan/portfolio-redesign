"use client"

import { useContext, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CursorContext } from "@/context/CursorContext"
import { CursorPreview } from "./cursor-preview"

export type SelectedWorkRow = {
    title: string
    outcome: string
    status: string
    year: string
    href: string
    image: string
    /** A short clip that plays once in the thumbnail, resting on its last frame. */
    video?: string
}

/*
 * Selected work as a numbered list. Hovering a row fades the others back, so
 * the one under the pointer reads on its own. On wide screens the status and
 * description sit in their own column, sized to stay on one line; below that
 * they move under the title and the thumbnail spans both.
 */
export function SelectedWork({ rows }: { rows: SelectedWorkRow[] }) {
    const { setVariant } = useContext(CursorContext)
    const [hovered, setHovered] = useState<number | null>(null)
    // Last row hovered, kept after leaving so the preview shrinks away on the
    // image it was showing rather than jumping back to the first one.
    const [previewIndex, setPreviewIndex] = useState(0)

    return (
        <>
            <ol
                onMouseLeave={() => {
                    setHovered(null)
                    setVariant("default")
                }}
            >
                {rows.map((row, i) => {
                    const dimmed = hovered !== null && hovered !== i
                    return (
                        <li key={row.href}>
                            <Link
                                href={row.href}
                                onMouseEnter={() => {
                                    setHovered(i)
                                    setPreviewIndex(i)
                                    setVariant("open")
                                }}
                                onClick={() => setVariant("default")}
                                onFocus={() => {
                                    setHovered(i)
                                    setPreviewIndex(i)
                                }}
                                onBlur={() => setHovered(null)}
                                className={`grid grid-cols-[96px_minmax(0,1fr)] items-center gap-x-4 gap-y-3.5 border-b border-hairline py-[18px] transition-colors duration-200 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-x-6 min-[80rem]:grid-cols-[40px_160px_minmax(0,1fr)_450px_56px] min-[80rem]:gap-6 ${
                                    dimmed ? "text-[#b9b8bf]" : "text-ink"
                                }`}
                            >
                                <span className="hidden text-[13px] text-ink-meta min-[80rem]:inline">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <div
                                    className={`relative row-span-2 h-16 w-24 overflow-hidden rounded-[4px] bg-surface transition-opacity duration-200 min-[80rem]:row-span-1 sm:h-20 sm:w-[120px] min-[80rem]:h-[104px] min-[80rem]:w-40 ${
                                        dimmed ? "opacity-45" : ""
                                    }`}
                                >
                                    {row.video ? (
                                    <video
                                        src={row.video}
                                        poster={row.image}
                                        autoPlay
                                        muted
                                        playsInline
                                        aria-hidden="true"
                                        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
                                    />
                                ) : null}
                                    <Image
                                        src={row.image}
                                        alt=""
                                        fill
                                        sizes="(min-width: 1280px) 160px, 120px"
                                        className={`object-cover ${row.video ? "motion-safe:hidden" : ""}`}
                                        priority={i < 2}
                                    />
                                </div>
                                <span className="text-[clamp(24px,2.5vw,32px)] leading-[1.1] font-medium tracking-[-0.025em] text-balance">
                                    {row.title}
                                </span>
                                <span className="flex flex-col gap-1 min-[80rem]:whitespace-nowrap">
                                    <span className="text-[13px] text-brand">{row.status}</span>
                                    <span className="text-[15px] leading-[1.4] text-ink-muted">
                                        {row.outcome}
                                    </span>
                                </span>
                                <span className="hidden text-right text-[13px] text-ink-meta min-[80rem]:inline">
                                    {row.year}
                                </span>
                            </Link>
                        </li>
                    )
                })}
            </ol>
            <CursorPreview
                images={rows.map((row) => row.image)}
                videos={rows.map((row) => row.video)}
                active={hovered !== null}
                index={previewIndex}
            />
        </>
    )
}
