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
    x: number
    y: number
}

export const CursorContext = createContext<CursorContextValue>({
    variant: "default",
    setVariant: () => {},
    hidden: false,
    setHidden: () => {},
    x: 0,
    y: 0,
})

export function CursorProvider({ children }: { children: React.ReactNode }) {
    const [variant, setVariant] = useState<CursorVariant>("default")
    const [hidden, setHidden] = useState(false)
    const [pos, setPos] = useState({ x: 0, y: 0 })
    const pathname = usePathname()

    useEffect(() => {
        const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
        window.addEventListener("mousemove", onMove, { passive: true })
        return () => window.removeEventListener("mousemove", onMove)
    }, [])

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
        () => ({ variant, setVariant, hidden, setHidden, x: pos.x, y: pos.y }),
        [variant, hidden, pos.x, pos.y]
    )

    return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
}