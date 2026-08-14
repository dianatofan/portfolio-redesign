"use client"

import React, { createContext, useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"

type CursorVariant = "default" | "open"

type CursorContextValue = {
    variant: CursorVariant
    setVariant: (v: CursorVariant) => void
    /** Hide the custom dot cursor and restore the native cursor (e.g. while an embed is interactive). */
    hidden: boolean
    setHidden: (h: boolean) => void
}

export const CursorContext = createContext<CursorContextValue>({
    variant: "default",
    setVariant: () => {},
    hidden: false,
    setHidden: () => {},
})

/*
 * Pointer coordinates deliberately do NOT live here. They used to, in state, and
 * every mousemove then produced a new context value — which re-rendered every
 * consumer on the page dozens of times a second. Cheap while the consumers were
 * small cards; ruinous once DoorGrid (framer-motion `layout` nodes, which
 * re-measure on every render) became one. GlassCursor now tracks the pointer
 * itself and writes the transform straight to the DOM, so nothing re-renders.
 */
export function CursorProvider({ children }: { children: React.ReactNode }) {
    const [variant, setVariant] = useState<CursorVariant>("default")
    const [hidden, setHidden] = useState(false)
    const pathname = usePathname()

    // While hidden, restore the OS cursor (the site otherwise forces cursor:none).
    useEffect(() => {
        document.body.classList.toggle("allow-native-cursor", hidden)
        return () => document.body.classList.remove("allow-native-cursor")
    }, [hidden])

    // Reset cursor to default on route change
    useEffect(() => {
        setVariant("default")
        setHidden(false)
    }, [pathname])

    const value = useMemo(
        () => ({ variant, setVariant, hidden, setHidden }),
        [variant, hidden]
    )

    return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
}
