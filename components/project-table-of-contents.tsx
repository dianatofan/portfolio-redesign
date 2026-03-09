"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface TableOfContentsProps {
    sections: Array<{
        id: string
        title: string
        isParent?: boolean
        parent?: string
    }>
}

export function ProjectTableOfContents({ sections }: TableOfContentsProps) {
    const [activeSection, setActiveSection] = useState<string>("")

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Find the first entry from top that is intersecting
                const intersecting = entries.filter((e) => e.isIntersecting)

                if (intersecting.length > 0) {
                    // Use the first intersecting entry (topmost on screen)
                    setActiveSection(intersecting[0].target.id)
                }
            },
            {
                rootMargin: "-100px 0px -66% 0px",
                threshold: [0, 0.25, 0.5, 0.75, 1],
            }
        )

        sections.forEach(({ id }) => {
            const element = document.getElementById(id)
            if (element) {
                observer.observe(element)
            }
        })

        return () => {
            sections.forEach(({ id }) => {
                const element = document.getElementById(id)
                if (element) {
                    observer.unobserve(element)
                }
            })
        }
    }, [sections])

    return (
        <nav className="sticky top-32 space-y-0.5">
            {sections.map(({ id, title, parent }) => (
                <Link
                    key={id}
                    href={`#${id}`}
                    className={`block text-sm py-1.5 rounded transition-colors ${
                        parent ? "pl-5 pr-2" : "px-2"
                    } ${
                        activeSection === id
                            ? "text-foreground font-semibold bg-secondary"
                            : "text-[var(--text-secondary)] hover:text-foreground hover:bg-secondary/50"
                    }`}
                    onClick={(e) => {
                        e.preventDefault()
                        document.getElementById(id)?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        })
                    }}
                >
                    {parent && (
                        <span
                            className={`material-symbols-outlined inline-block mr-1 transition-colors ${
                                activeSection === id ? "text-foreground" : "text-[var(--text-secondary)]"
                            }`}
                            style={{
                                fontSize: 16,
                                fontVariationSettings: '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 20',
                            }}
                        >
                            subdirectory_arrow_right
                        </span>
                    )}
                    {title}
                </Link>
            ))}
        </nav>
    )
}

