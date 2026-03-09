"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface TableOfContentsProps {
    sections: Array<{ id: string; title: string }>
}

export function ProjectTableOfContents({ sections }: TableOfContentsProps) {
    const [activeSection, setActiveSection] = useState<string>("")

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id)
                    }
                })
            },
            {
                rootMargin: "-20% 0px -80% 0px",
                threshold: 0,
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
            {sections.map(({ id, title }) => (
                <Link
                    key={id}
                    href={`#${id}`}
                    className={`block text-sm py-1.5 px-2 rounded transition-colors ${
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
                    {title}
                </Link>
            ))}
        </nav>
    )
}

