"use client"

import { useState } from "react"
import Image from "next/image"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"

type FadeImageProps = ComponentProps<typeof Image>

export function FadeImage({ className, onLoad, ...props }: FadeImageProps) {
    const [loaded, setLoaded] = useState(false)

    return (
        <Image
            {...props}
            className={cn(
                "transition-opacity duration-700 ease-in-out",
                loaded ? "opacity-100" : "opacity-0",
                className
            )}
            onLoad={(e) => {
                setLoaded(true)
                if (typeof onLoad === "function") onLoad(e)
            }}
        />
    )
}