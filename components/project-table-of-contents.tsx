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
    projectSlug?: string
    isPasswordProtected?: boolean
}

export function ProjectTableOfContents({
    sections,
    projectSlug,
    isPasswordProtected = false,
}: TableOfContentsProps) {
    const [activeSection, setActiveSection] = useState<string>("")
    const [isUnlocked, setIsUnlocked] = useState(!isPasswordProtected)

    useEffect(() => {
        if (!isPasswordProtected || !projectSlug) {
            setIsUnlocked(true)
            return
        }

        const storageKey = `project-auth-${projectSlug}`
        const syncFromStorage = () => {
            setIsUnlocked(Boolean(localStorage.getItem(storageKey)))
        }

        syncFromStorage()

        const onUnlocked = (event: Event) => {
            const customEvent = event as CustomEvent<{ projectSlug?: string }>
            if (!customEvent.detail?.projectSlug || customEvent.detail.projectSlug === projectSlug) {
                syncFromStorage()
            }
        }

        const onStorage = (event: StorageEvent) => {
            if (event.key === storageKey) {
                syncFromStorage()
            }
        }

        window.addEventListener("project-unlocked", onUnlocked)
        window.addEventListener("storage", onStorage)

        return () => {
            window.removeEventListener("project-unlocked", onUnlocked)
            window.removeEventListener("storage", onStorage)
        }
    }, [isPasswordProtected, projectSlug])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // Keep active state stable by choosing the topmost visible section.
                const intersecting = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

                if (intersecting.length > 0) {
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
    }, [sections, isUnlocked])

    return (
        <nav className="sticky top-32 space-y-0.5">
            {(() => {
                const solutionIndex = sections.findIndex((section) => section.id === "solution")

                return sections.map(({ id, title, parent }, index) => {
                    const isLockedAfterSolution =
                        isPasswordProtected &&
                        !isUnlocked &&
                        solutionIndex !== -1 &&
                        index > solutionIndex

                    return (
                <Link
                    key={id}
                    href={`#${id}`}
                    className={`block text-sm py-1.5 rounded transition-all duration-200 ${
                        parent ? "pl-5 pr-2" : "px-2"
                    } ${
                        activeSection === id
                            ? "text-foreground font-semibold bg-secondary"
                            : "text-[var(--text-secondary)] hover:text-foreground hover:bg-secondary/50"
                    } ${isLockedAfterSolution ? "blur-[2px] opacity-55 pointer-events-none select-none" : ""}`}
                    onClick={(e) => {
                        if (isLockedAfterSolution) {
                            e.preventDefault()
                            return
                        }
                        e.preventDefault()
                        const element = document.getElementById(id)
                        if (!element) return

                        const headerOffset = 52
                        const y = element.getBoundingClientRect().top + window.scrollY - headerOffset
                        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" })
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
                    )
                })
            })()}
        </nav>
    )
}
