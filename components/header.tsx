"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { formatCopenhagenTime, isCopenhagenNight } from "@/lib/copenhagen-time"
import { NavBrackets } from "./nav-brackets"
import { workProjects } from "./projects"

/*
 * Sticky editorial header: name and Copenhagen time on the left, Work / About on
 * the right. The current item gets two hand-drawn purple brackets. On the
 * homepage "Work" only counts as current once Selected work has scrolled up
 * under the header, so the hero doesn't claim to be the work section.
 */

const WORK_SECTION_ID = "work"

function useClock() {
    // "" on the server: the page is prerendered, so build time is no useful
    // "now". The inline script in app/layout.tsx paints the real value first.
    const [time, setTime] = useState(() => (typeof window === "undefined" ? "" : formatCopenhagenTime()))
    const [night, setNight] = useState(() => (typeof window === "undefined" ? false : isCopenhagenNight()))

    useEffect(() => {
        const tick = () => {
            setTime(formatCopenhagenTime())
            setNight(isCopenhagenNight())
        }
        tick()
        const id = window.setInterval(tick, 30_000)
        return () => window.clearInterval(id)
    }, [])

    return { time, night }
}

function useWorkInView(enabled: boolean) {
    const [inView, setInView] = useState(false)

    useEffect(() => {
        if (!enabled) {
            setInView(false)
            return
        }
        const onScroll = () => {
            const el = document.getElementById(WORK_SECTION_ID)
            setInView(!!el && el.getBoundingClientRect().top < 140)
        }
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [enabled])

    return inView
}

/*
 * Reading a case study: the header slides away while you scroll down past the
 * hero and comes back as soon as you scroll up. The study's title shows in it
 * once the page headline is out of view, and the bar under it fills as you read.
 */
function useReading(enabled: boolean) {
    const [state, setState] = useState({ hidden: false, titleShown: false, progress: 0 })

    useEffect(() => {
        if (!enabled) return
        let last = window.scrollY
        let frame = 0
        const update = () => {
            frame = 0
            const y = window.scrollY
            const max = document.documentElement.scrollHeight - window.innerHeight
            setState((s) => ({
                hidden: y > 240 && y > last + 2 ? true : y < last - 2 ? false : s.hidden,
                titleShown: y > 420,
                progress: max > 0 ? Math.min(1, y / max) : 0,
            }))
            last = y
        }
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update)
        }
        update()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            window.removeEventListener("scroll", onScroll)
            cancelAnimationFrame(frame)
        }
    }, [enabled])

    return state
}

export function Header() {
    const pathname = usePathname() ?? "/"
    const [menuOpen, setMenuOpen] = useState(false)
    const isHome = pathname === "/"
    const workInView = useWorkInView(isHome)

    useEffect(() => setMenuOpen(false), [pathname])

    // No page scroll behind the open menu.
    useEffect(() => {
        document.documentElement.style.overflow = menuOpen ? "hidden" : ""
        return () => {
            document.documentElement.style.overflow = ""
        }
    }, [menuOpen])

    // Inside a case study: the name, the study's title once its own headline has
    // scrolled away, Work / About, and round arrows to the previous and next
    // case study (the same order as the links at the end of the page).
    const slug = pathname.match(/^\/work\/([^/]+)/)?.[1]
    const project = slug ? workProjects.find((p) => p.slug === slug) : undefined
    const caseStudies = workProjects.filter((p) => p.category !== "experiment")
    const inCaseStudy = !!project && project.category !== "experiment"
    const index = caseStudies.findIndex((p) => p.slug === slug)
    const prev = inCaseStudy ? caseStudies[(index - 1 + caseStudies.length) % caseStudies.length] : undefined
    const next = inCaseStudy ? caseStudies[(index + 1) % caseStudies.length] : undefined
    const reading = useReading(inCaseStudy)

    const links = [
        { label: "Work", href: `/#${WORK_SECTION_ID}`, current: pathname.startsWith("/work") || pathname.startsWith("/fun") || (isHome && workInView) },
        { label: "About", href: "/about", current: pathname.startsWith("/about") },
    ]

    if (inCaseStudy && project && prev && next) {
        const arrow = "grid h-7 w-7 place-items-center rounded-full border border-hairline bg-white text-[13px] text-ink transition-colors hover:border-ink"
        return (
            <header
                className={`sticky top-0 z-40 bg-white/[0.94] backdrop-blur-[8px] transition-transform duration-[350ms] ease-[cubic-bezier(.2,0,0,1)] motion-reduce:transition-none ${
                    reading.hidden ? "-translate-y-full" : "translate-y-0"
                }`}
            >
                <div className="grid h-16 grid-cols-[1fr_auto] items-center gap-6 px-gutter text-[15px] lg:grid-cols-[1fr_auto_1fr]">
                    <Link href="/" className="link-ink justify-self-start font-medium">
                        Diana Tofan
                    </Link>
                    <span
                        aria-hidden={!reading.titleShown}
                        className={`hidden max-w-[46vw] truncate text-[13px] text-ink-muted transition-opacity duration-[250ms] lg:block ${
                            reading.titleShown ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        {project.title}
                    </span>
                    <nav aria-label="Main" className="flex items-center justify-end gap-7">
                        {links.map((link) => (
                            <Link key={link.label} href={link.href} className="link-ink hidden sm:inline">
                                {link.label}
                            </Link>
                        ))}
                        <span className="flex gap-1">
                            <Link href={`/work/${prev.slug}`} aria-label={`Previous: ${prev.title}`} title={prev.title} className={arrow}>
                                ←
                            </Link>
                            <Link href={`/work/${next.slug}`} aria-label={`Next: ${next.title}`} title={next.title} className={arrow}>
                                →
                            </Link>
                        </span>
                    </nav>
                </div>
                {/* How far through the study you are. */}
                <div
                    aria-hidden
                    className="h-0.5 origin-left bg-brand"
                    style={{ transform: `scaleX(${reading.progress})` }}
                />
            </header>
        )
    }

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-6 border-b border-black/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.5))] px-gutter text-[15px] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_24px_-16px_rgba(22,21,26,0.18)] backdrop-blur-[20px] backdrop-saturate-[1.8]">
            <Link href="/" aria-label="Diana Tofan, home" className="link-ink -m-2 p-2">
                <svg width={22} height={21} viewBox="0 0 251 239" fill="currentColor" aria-hidden="true" className="block">
                        <path d="M81.8812 236.371C70.4592 236.371 59.7762 234.311 49.8387 230.187C39.8897 226.064 31.2221 220.459 23.8188 213.365C16.4152 206.282 10.602 197.988 6.37312 188.469C2.13835 178.951 0.0239258 168.791 0.0239258 158.005C0.0239258 147.215 2.13835 137.07 6.37312 127.552C10.602 118.034 16.4152 109.739 23.8188 102.645C31.2221 95.5623 39.8897 89.9577 49.8387 85.8341C59.7762 81.7104 70.4592 79.6472 81.8812 79.6472H86.9537C83.1464 82.816 79.6051 86.9987 76.3239 92.1717C73.0457 97.3654 70.3025 103.331 68.0767 110.1C65.8567 116.869 64.1097 124.324 62.8446 132.468C61.5764 140.612 60.9409 149.128 60.9409 158.005C60.9409 166.893 61.5764 175.41 62.8446 183.554C64.1097 191.694 65.8567 199.152 68.0767 205.907C70.3025 212.688 73.0457 218.653 76.3239 223.838C79.6051 229.023 83.1464 233.203 86.9537 236.371H81.8812" />
                        <path d="M241.777 67.9032V136.754H240.509C239.022 134.635 236.646 131.094 233.367 126.119C230.089 121.156 225.753 115.495 220.361 109.145C214.966 102.808 208.413 96.1448 200.689 89.1657C192.971 82.1865 183.925 75.6272 173.567 69.4876V67.9032H241.777ZM105.674 56.8034C113.711 52.5733 121.959 47.7166 130.419 42.2037C137.605 37.347 145.539 31.4764 154.212 24.6007C162.884 17.728 171.448 9.85323 179.911 0.964538V106.618V158.643C179.911 166.042 180.913 172.764 182.923 178.789C184.933 184.81 187.629 190.32 191.014 195.283C194.398 200.258 198.203 204.651 202.436 208.449C206.666 212.256 211.005 215.544 215.445 218.293C225.806 225.062 237.654 230.232 250.976 233.832C242.519 235.313 234.053 236.478 225.596 237.329C218.194 237.956 210.207 238.166 201.644 237.956C193.077 237.746 184.987 236.688 177.372 234.787C169.97 232.878 163.044 229.395 156.594 224.314C150.141 219.236 144.537 213.049 139.777 205.756C135.018 198.464 131.261 190.367 128.518 181.49C125.763 172.602 124.389 163.515 124.389 154.207V103.751C124.389 92.976 123.392 84.5159 121.376 78.3763C119.369 72.2396 117.2 67.5898 114.87 64.421C112.127 60.6107 109.059 58.0715 105.674 56.8034" />
                </svg>
            </Link>

            {/* Quiet meta before the nav: the city names what the number is. */}
            <div className="flex items-center gap-10">

                <nav aria-label="Main" className="hidden items-baseline gap-7 sm:flex">
                    {links.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            aria-current={link.current ? "page" : undefined}
                            className="link-ink relative"
                        >
                            {link.label}
                            {link.current && <NavBrackets />}
                        </Link>
                    ))}
                </nav>
            </div>

            <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Menu"
                aria-expanded={menuOpen}
                className="-mr-2.5 grid h-10 w-10 place-items-center text-ink sm:hidden"
            >
                <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                        d={menuOpen ? "M5 5l10 10M15 5L5 15" : "M3 7h14M3 13h14"}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        fill="none"
                    />
                </svg>
            </button>

            {/*
              Full-screen menu on phones, on Liquid Glass: the page stays faintly
              visible through a heavy blur. Always mounted so it can animate; the
              links rise in one after another. Inert while closed.
            */}
            <div
                inert={!menuOpen}
                aria-hidden={!menuOpen}
                className={`fixed inset-x-0 top-16 bottom-0 z-30 flex flex-col bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,255,255,0.6))] px-gutter pt-6 pb-10 backdrop-blur-[28px] backdrop-saturate-[1.8] transition-[opacity,visibility] duration-300 ease-[cubic-bezier(.2,0,0,1)] sm:hidden ${
                    menuOpen ? "visible opacity-100" : "invisible opacity-0"
                }`}
            >
                <nav aria-label="Main" className="flex flex-col">
                    {links.map((link, i) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            aria-current={link.current ? "page" : undefined}
                            style={{ transitionDelay: menuOpen ? `${80 + i * 60}ms` : "0ms" }}
                            className={`flex items-baseline justify-between border-b border-black/[0.08] py-5 text-[44px] leading-none font-medium tracking-[-0.04em] text-ink transition-[opacity,transform] duration-500 ease-[cubic-bezier(.2,0,0,1)] motion-reduce:transition-none ${
                                menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                            }`}
                        >
                            {link.label}
                            <span className="text-[13px] font-normal tracking-normal text-ink-meta">
                                {link.current ? "Current" : ""}
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    )
}
