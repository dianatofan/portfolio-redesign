"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  getProjectAuthKey,
  hasGlobalProjectUnlock,
  PROJECT_AUTH_GLOBAL_KEY,
  PROJECT_UNLOCK_EVENT,
} from "@/lib/project-auth"

interface TableOfContentsProps {
  sections: Array<{
    id: string
    title: string
    isParent?: boolean
    parent?: string
    isGateStart?: boolean
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

    const projectStorageKey = getProjectAuthKey(projectSlug)
    const syncFromStorage = () => {
      setIsUnlocked(hasGlobalProjectUnlock() || Boolean(localStorage.getItem(projectStorageKey)))
    }

    syncFromStorage()

    const onUnlocked = () => {
      syncFromStorage()
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === projectStorageKey || event.key === PROJECT_AUTH_GLOBAL_KEY) {
        syncFromStorage()
      }
    }

    window.addEventListener(PROJECT_UNLOCK_EVENT, onUnlocked)
    window.addEventListener("storage", onStorage)

    return () => {
      window.removeEventListener(PROJECT_UNLOCK_EVENT, onUnlocked)
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
        const gateIndex = sections.findIndex((s) => s.isGateStart)

        return sections.map(({ id, title, parent }, index) => {
          const isLockedAfterSolution =
            isPasswordProtected && !isUnlocked && gateIndex !== -1 && index >= gateIndex

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
