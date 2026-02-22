"use client"

import React, { createContext, useEffect, useMemo, useState } from "react"

type CursorVariant = "default" | "open"

type CursorContextValue = {
    variant: CursorVariant
    setVariant: (v: CursorVariant) => void
    x: number
    y: number
}

export const CursorContext = createContext<CursorContextValue>({
    variant: "default",
    setVariant: () => {},
    x: 0,
    y: 0,
})

export function CursorProvider({ children }: { children: React.ReactNode }) {
    const [variant, setVariant] = useState<CursorVariant>("default")
    const [pos, setPos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
        window.addEventListener("mousemove", onMove, { passive: true })
        return () => window.removeEventListener("mousemove", onMove)
    }, [])

    const value = useMemo(
        () => ({ variant, setVariant, x: pos.x, y: pos.y }),
        [variant, pos.x, pos.y]
    )

    return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
}