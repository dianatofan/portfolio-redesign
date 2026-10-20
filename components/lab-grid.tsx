"use client"

import { useContext } from "react"
import Link from "next/link"
import { CursorContext } from "@/context/CursorContext"
import { LabFrame, type LabFrameType } from "./lab-frame"

export type LabItem = {
    title: string
    description: string
    /** The retro device the screenshot sits in, and its screenshot; see lab-frame. */
    frame: { type: LabFrameType; src: string; url?: string }
    href: string
}

/* Small cards for side projects: 2, 3 or 4 across. External links open in a new tab. */
export function LabGrid({ items }: { items: LabItem[] }) {
    const { setVariant } = useContext(CursorContext)

    return (
        <ul className="grid grid-cols-2 gap-5 pt-6 sm:grid-cols-3 min-[62.5rem]:grid-cols-4">
            {items.map((item) => {
                const external = /^https?:/.test(item.href)
                return (
                    <li key={item.title} className="min-w-0">
                        <Link
                            href={item.href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                            onMouseEnter={() => setVariant("open")}
                            onMouseLeave={() => setVariant("default")}
                            onClick={() => setVariant("default")}
                            className="link-ink flex flex-col gap-2.5"
                        >
                            {/* The card, its Play pill and the device all come from LabFrame. */}
                            <LabFrame type={item.frame.type} src={item.frame.src} url={item.frame.url} />
                            <span className="truncate text-[15px] font-medium">{item.title}</span>
                            <span className="-mt-1.5 truncate text-[13px] text-ink-muted">{item.description}</span>
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}
