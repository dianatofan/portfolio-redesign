"use client"

import React, { useContext } from "react"
import { CursorContext } from "@/context/CursorContext"

export function GlassCursor() {
    const { variant, x, y } = useContext(CursorContext)
    const isOpen = variant === "open"

    return (
        <div
            className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
            style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
            aria-hidden="true"
        >
            <div
                className={[
                    "-translate-x-1/2 -translate-y-1/2 transform-gpu",
                    "transition-all duration-300 ease-[cubic-bezier(.2,.8,.2,1)]",
                    "will-change-[width,height,transform,background-color,border-color,backdrop-filter,box-shadow]",
                ].join(" ")}
            >
                <div
                    className={[
                        "relative flex items-center justify-center rounded-full",
                        "transition-all duration-300 ease-[cubic-bezier(.2,.8,.2,1)]",
                        isOpen
                            ? [
                                // bigger circle
                                "h-24 w-24",
                                // glass body
                                "bg-white/12 backdrop-blur-md",
                                "shadow-[0_10px_30px_rgba(0,0,0,0.18)]",
                            ].join(" ")
                            : [
                                // slightly bigger dot too (optional)
                                "h-3 w-3",
                                "bg-black",
                                "shadow-none",
                            ].join(" "),
                    ].join(" ")}
                >
         <span
             className={[
                 "font-sans text-xs font-normal tracking-tight uppercase",
                 "transition-all duration-200 ease-out",
                 "mix-blend-difference text-white",
                 isOpen ? "opacity-100 scale-100" : "opacity-0 scale-75",
             ].join(" ")}
         >
  Open
</span>
                </div>
            </div>
        </div>
    )
}