"use client"

import { useEffect, useRef, useState } from "react"
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

  // Every entry in reading order. Subsections sit right after their parent in
  // `sections`, so progress can run straight through the flat list.
  const flat = sections

  // How far through the current entry the reader is, 0–1, in whole percents so
  // the component only re-renders when the tick visibly changes.
  const [progress, setProgress] = useState(0)

  // The ruler shows while you scroll and fades out 2.5s after you stop. Hover
  // and keyboard focus bring it back (see the nav's classes).
  const [awake, setAwake] = useState(false)

  // Like iOS glass, the ruler and its panel turn dark over a dark section: on
  // each scroll, look at what sits behind the ruler's middle.
  const navRef = useRef<HTMLElement>(null)
  const [onDark, setOnDark] = useState(false)
  useEffect(() => {
    let frame = 0
    const check = () => {
      frame = 0
      const nav = navRef.current
      if (!nav) return
      const box = nav.getBoundingClientRect()
      const under = document
        .elementsFromPoint(box.left - 24, box.top + box.height / 2)
        .find((el) => !nav.contains(el))
      setOnDark(Boolean(under?.closest(".tour-dark")))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }
    check()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])
  useEffect(() => {
    let timer = 0
    const wake = () => {
      setAwake(true)
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setAwake(false), 2500)
    }
    window.addEventListener("scroll", wake, { passive: true })
    return () => {
      window.removeEventListener("scroll", wake)
      window.clearTimeout(timer)
    }
  }, [])

  // As in Case Study v2: the current entry is the last one whose top has
  // passed 35% of the viewport. Its progress runs from that moment until the
  // next entry on the page takes over.
  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const line = window.innerHeight * 0.35
      let current = 0
      flat.forEach(({ id }, i) => {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top < line) current = i
      })
      setActiveSection(flat[current]?.id ?? "")

      const el = document.getElementById(flat[current]?.id ?? "")
      // The next entry actually on the page (locked ones aren't rendered).
      const next = flat
        .slice(current + 1)
        .map(({ id }) => document.getElementById(id))
        .find(Boolean)
      if (el) {
        const top = el.getBoundingClientRect().top
        const end = next ? next.getBoundingClientRect().top : el.getBoundingClientRect().bottom
        const p = Math.min(1, Math.max(0, (line - top) / Math.max(1, end - top)))
        setProgress(Math.round(p * 100) / 100)
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, isUnlocked])

  const gateIndex = sections.findIndex((s) => s.isGateStart)
  const activeIndex = flat.findIndex((section) => section.id === activeSection)
  const isLocked = (index: number) => isPasswordProtected && !isUnlocked && gateIndex !== -1 && index >= gateIndex

  const goTo = (id: string) => {
    const element = document.getElementById(id)
    if (!element) return
    // Clears the 64px sticky header with some air.
    const y = element.getBoundingClientRect().top + window.scrollY - 88
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: Math.max(0, y), behavior: reduce ? "auto" : "smooth" })
  }

  /*
   * Dock-style magnification. On hover each tick's target scale comes from its
   * distance to the pointer (a Gaussian falloff), and a damped spring eases the
   * current scale towards it every frame. Scales are written straight to the
   * DOM as transforms, so moving the pointer never re-renders React. The label
   * nearest the pointer turns ink. Reduced motion skips all of this.
   */
  const tickRefs = useRef<(HTMLSpanElement | null)[]>([])
  const labelRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const scales = useRef<number[]>([])
  const velocities = useRef<number[]>([])
  const pointerY = useRef<number | null>(null)
  const raf = useRef(0)
  // The scroll-progress stretch on the current tick, read by the frame loop.
  const stretch = useRef<{ index: number; amount: number }>({ index: -1, amount: 0 })
  stretch.current = { index: activeIndex, amount: progress }

  const paint = () => {
    flat.forEach((_, i) => {
      const tick = tickRefs.current[i]
      if (!tick) return
      const grow = i === stretch.current.index ? 1 + stretch.current.amount * 0.6 : 1
      tick.style.transform = `scaleX(${((scales.current[i] ?? 1) * grow).toFixed(3)})`
    })
  }

  const step = () => {
    raf.current = 0
    const y = pointerY.current
    let moving = false
    let nearest = -1
    let nearestDistance = Infinity
    flat.forEach((_, i) => {
      const row = rowRefs.current[i]
      let target = 1
      if (row && y !== null) {
        const box = row.getBoundingClientRect()
        const d = Math.abs(y - (box.top + box.height / 2))
        target = 1 + 1.1 * Math.exp(-((d / 16) ** 2))
        if (d < nearestDistance) {
          nearestDistance = d
          nearest = i
        }
      }
      const current = scales.current[i] ?? 1
      // Spring: stiffness 0.18, damping 0.72 per frame. Slightly underdamped, so
      // a tick settles with a soft give rather than snapping.
      const v = ((velocities.current[i] ?? 0) + (target - current) * 0.18) * 0.72
      velocities.current[i] = v
      scales.current[i] = current + v
      if (Math.abs(v) > 0.001 || Math.abs(target - current) > 0.001) moving = true
    })
    labelRefs.current.forEach((label, i) => {
      if (label) label.dataset.near = String(i === nearest && y !== null)
    })
    paint()
    if (moving) raf.current = requestAnimationFrame(step)
  }

  const kick = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!raf.current) raf.current = requestAnimationFrame(step)
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  // Scroll progress changes the current tick even while the pointer is away.
  useEffect(paint)

  return (
    <nav
      ref={navRef}
      aria-label="Contents"
      className={`group fixed top-1/2 right-3 z-30 hidden -translate-y-1/2 transition-opacity duration-500 ease-out hover:opacity-100 focus-within:opacity-100 xl:block min-[1400px]:right-5 ${
        awake ? "opacity-100" : "opacity-0"
      } ${onDark ? "on-dark" : ""}`}
      onPointerMove={(e) => {
        pointerY.current = e.clientY
        kick()
      }}
      onPointerLeave={() => {
        pointerY.current = null
        kick()
      }}
    >
      {/* Labels, right-aligned beside their ticks, on a Liquid Glass panel (iOS 26): a translucent gradient, heavy blur and saturation, a bright top edge. Opens on hover and on focus. */}
      <div className="pointer-events-none absolute top-1/2 right-full w-64 -translate-y-1/2 translate-x-2 opacity-0 transition-[opacity,translate] duration-200 ease-[cubic-bezier(.2,0,0,1)] group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:translate-x-0 motion-reduce:transition-none">
        <div
          className={`rounded-[22px] border py-3 pr-4 pl-5 backdrop-blur-[22px] backdrop-saturate-[1.8] transition-[background,border-color] duration-300 ${
            onDark
              ? "border-white/15 bg-[linear-gradient(160deg,rgba(44,43,50,0.62),rgba(22,21,26,0.42))] shadow-[0_18px_50px_-14px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.18)]"
              : "border-white/50 bg-[linear-gradient(160deg,rgba(255,255,255,0.55),rgba(255,255,255,0.28))] shadow-[0_18px_50px_-14px_rgba(22,21,26,0.28),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(255,255,255,0.25),inset_0_0_0_1px_rgba(255,255,255,0.18)]"
          }`}
        >
          {flat.map(({ id, title, parent }, i) => {
            const locked = isLocked(i)
            const isActive = i === activeIndex
            return (
              <Link
                key={id}
                ref={(el) => {
                  labelRefs.current[i] = el
                }}
                href={`#${id}`}
                aria-current={isActive ? "location" : undefined}
                aria-disabled={locked || undefined}
                tabIndex={locked ? -1 : undefined}
                onClick={(e) => {
                  e.preventDefault()
                  if (!locked) goTo(id)
                }}
                className={`flex items-center justify-end truncate rounded-[3px] py-[7px] text-right leading-[1.2] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand data-[near=true]:text-ink ${
                  parent ? "text-[12px]" : "text-[13px]"
                } ${isActive ? "font-medium text-ink" : "text-ink-muted"} ${
                  locked ? "pointer-events-none select-none opacity-50 blur-[2px]" : ""
                }`}
              >
                {title}
              </Link>
            )
          })}
        </div>
      </div>

      {/*
        The ruler: one hairline tick per entry on tight 8px rows, as in Notion
        and Apple's newsroom; the labels keep their own spacing in the panel. Wide
        enough that a fully magnified, fully read tick (16px × 2.1 × 1.6) still
        ends inside it, clear of the label panel.
      */}
      <div aria-hidden="true" className="flex w-14 flex-col py-2">
        {flat.map(({ id, parent }, i) => {
          const locked = isLocked(i)
          const tone = i === activeIndex ? "bg-ink" : i < activeIndex ? "bg-ink-muted" : "bg-chart-neutral"
          return (
            <div
              key={id}
              ref={(el) => {
                rowRefs.current[i] = el
              }}
              onClick={() => {
                if (!locked) goTo(id)
              }}
              className={`flex h-2 items-center justify-end ${locked ? "opacity-40" : "cursor-pointer"}`}
            >
              <span
                ref={(el) => {
                  tickRefs.current[i] = el
                }}
                className={`block h-px origin-right rounded-full transition-colors duration-200 ${parent ? "w-2.5" : "w-4"} ${tone}`}
              />
            </div>
          )
        })}
      </div>
    </nav>
  )
}
