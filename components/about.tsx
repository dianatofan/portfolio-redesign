"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { BmoTooltip } from "./about/bmo-tooltip"
import { PortraitLoupe } from "./about/portrait-loupe"

/*
 * Editorial About page (About v9 in the design handoff): a big greeting, the
 * portrait beside a short intro, a pull quote, the tools I use, and what each
 * role taught me.
 */

const tools = [
    { group: "Design", items: ["Figma", "Design systems", "Prototyping in code"] },
    {
        group: "Code",
        items: [
            "TypeScript",
            "CSS",
            "SVG",
            "React",
            "Next.js",
            "Tailwind",
            "framer-motion",
            "three.js",
            "d3",
            "Git",
            "Storybook",
            "Vercel",
        ],
    },
    { group: "AI", items: ["Claude Code", "Cursor", "ChatGPT", "Midjourney"] },
]

const roles = [
    {
        company: "3Shape",
        role: "Product Designer",
        note: "Healthcare is where I’ve wanted to end up for a while, so this one feels personal. I start in November, designing the account portal.",
    },
    {
        company: "Tactile Games",
        role: "Product Designer",
        note: "I never thought I’d work at a gaming company, but the people were too nice to say no. The domain was super hard at first, but somehow it’s a lot like e-commerce: A/B tests, scheduled features, offers.",
    },
    {
        company: "Google",
        role: "UX Engineer",
        note: "Working at Google expanded my sense of what’s possible. I used code to translate ambitious ideas into high-fidelity prototypes that made abstract concepts tangible and informed product direction before significant engineering investment.",
    },
    {
        company: "Famly",
        role: "UX/UI Designer",
        note: "A short job before Google stole me. Famly had no design system, so I laid the foundations, and getting people to actually adopt it was the trickiest part.",
    },
    {
        company: "Maersk",
        role: "Frontend Engineer",
        note: "This is where I started, as a frontend engineer on a global cargo booking platform. It taught me to build for scale, and I still design that way.",
    },
]

/*
 * Fades a block up as it enters the viewport, as the design does for every
 * block, including those on screen at load. Content stays visible if
 * JavaScript never runs.
 */
function Reveal({ children, className }: { children: ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

        el.style.opacity = "0"
        el.style.transform = "translateY(8px)"
        el.style.transition =
            "opacity .6s cubic-bezier(.2,0,0,1), transform .6s cubic-bezier(.2,0,0,1)"
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return
                observer.disconnect()
                el.style.opacity = "1"
                el.style.transform = "none"
            },
            { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    )
}

function SectionHead({ title, meta }: { title: string; meta: string }) {
    return (
        <Reveal className="flex items-baseline justify-between border-b border-ink pb-4 text-[15px]">
            <h2 className="font-medium">{title}</h2>
            <span className="text-ink-meta">{meta}</span>
        </Reveal>
    )
}

const introParagraph = "mb-4 text-[18px] leading-[1.55] text-ink text-pretty break-inside-avoid"

export function About() {
    const [openRole, setOpenRole] = useState(-1)

    return (
        <div className="text-ink">
            <section className="px-gutter pt-6 min-[720px]:pt-[72px]">
                <h1 className="mt-12 text-[clamp(44px,11vw,150px)] leading-[0.9] font-medium tracking-[-0.06em]">
                    Hi, I&apos;m Diana.
                </h1>
                <p className="mt-7 max-w-[640px] text-[clamp(20px,1.8vw,24px)] leading-[1.35] tracking-[-0.015em] text-pretty">
                    Product designer, joining 3Shape in November.{" "}
                    <span className="text-ink-meta">Ex Tactile, Google, Maersk.</span>
                </p>
            </section>

            <section className="grid items-start gap-[clamp(32px,4vw,80px)] px-gutter pt-10 pb-14 min-[720px]:grid-cols-[clamp(260px,36vw,420px)_minmax(0,1fr)] min-[720px]:pt-16 sm:pb-20 xl:grid-cols-[clamp(300px,30vw,640px)_minmax(0,1fr)]">
                <div className="row-start-2 min-[720px]:col-start-2 min-[720px]:row-start-1">
                    <div className="max-w-[1200px] gap-[clamp(32px,3vw,56px)] border-t border-ink pt-5 xl:columns-2">
                        <p className={introParagraph}>
                            {
                                "I started as a frontend developer, moved into product design, and now I work where the two meet, designing in code and building with AI."
                            }
                        </p>
                        <p className={introParagraph}>
                            {
                                "I've worked across gaming, big tech, SaaS and logistics. Along the way, I realised I care most about products that have a real, positive impact on people's lives, which is what brought me to healthcare."
                            }
                        </p>
                        <p className={introParagraph}>
                            Outside work, I&apos;m usually out running, hunting for specialty coffee
                            and a good <BmoTooltip>BMO</BmoTooltip>, doing a bit of shopping
                            therapy, or on a plane to somewhere warm.
                        </p>
                    </div>
                </div>

                <Reveal className="col-start-1 row-start-1 w-full max-w-[480px] min-[720px]:max-w-none">
                    <figure className="m-0 flex flex-col gap-2.5">
                        <PortraitLoupe />
                        <figcaption className="flex justify-between gap-3 text-[13px] text-ink-meta">
                            <span>
                                <span className="text-ink">Fig. 1</span> — Sibiu, Romania, October
                                2026
                            </span>
                        </figcaption>
                    </figure>
                </Reveal>
            </section>

            <section className="px-gutter pb-14 sm:pb-20">
                <Reveal>
                    <blockquote className="m-0 border-y border-hairline px-[max(0px,calc((100%-900px)/2))] py-12 text-center text-[clamp(32px,3.6vw,52px)] leading-[1.08] font-medium tracking-[-0.04em] text-balance">
                        “I care most about products that have a real, positive impact on
                        people&apos;s lives.”
                    </blockquote>
                </Reveal>
            </section>

            <section className="px-gutter pb-14 sm:pb-20">
                <SectionHead title="What I work with" meta="Tools" />
                <div>
                    {tools.map((tool) => (
                        <Reveal
                            key={tool.group}
                            className="grid grid-cols-12 items-baseline gap-1.5 border-b border-hairline py-[18px] min-[720px]:gap-6"
                        >
                            <span className="col-span-12 text-[13px] text-ink-meta min-[720px]:col-span-4">
                                {tool.group}
                            </span>
                            <p className="col-span-12 text-[18px] leading-[1.55] text-pretty min-[720px]:col-span-8 min-[720px]:col-start-5">
                                {tool.items.join(", ")}.
                            </p>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* Tops the footer's own 80px margin up or down to the design's gap: 72px on phones, 120px above. */}
            <section className="-mb-2 px-gutter min-[720px]:mb-0 min-[720px]:pb-10">
                <SectionHead title="What each role taught me" meta="Experience" />
                {roles.map((role, i) => {
                    const open = openRole === i
                    return (
                        <Reveal key={role.company} className="border-b border-hairline">
                            <button
                                type="button"
                                aria-expanded={open}
                                aria-controls={`role-note-${i}`}
                                onClick={() => setOpenRole(open ? -1 : i)}
                                className="grid w-full grid-cols-12 items-baseline gap-6 py-[18px] text-left text-ink transition-colors duration-200 hover:text-brand"
                            >
                                <span className="col-span-11 row-start-1 text-[clamp(24px,2.5vw,32px)] leading-[1.1] font-medium tracking-[-0.025em] min-[720px]:col-span-4">
                                    {role.company}
                                </span>
                                <span className="col-span-12 row-start-2 flex items-baseline gap-2.5 text-[15px] text-ink-muted min-[720px]:col-span-7 min-[720px]:col-start-5 min-[720px]:row-start-1">
                                    {role.role}
                                    {i === 0 && (
                                        <span className="text-[13px] text-ink-meta">From November</span>
                                    )}
                                </span>
                                {/* A plus whose vertical bar folds away into a minus. */}
                                <span
                                    aria-hidden="true"
                                    className="relative col-start-12 row-start-1 ml-auto h-3 w-3 self-center text-ink-meta"
                                >
                                    <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                                    <span
                                        className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-[cubic-bezier(.2,0,0,1)] motion-reduce:transition-none ${
                                            open ? "scale-y-0" : "scale-y-100"
                                        }`}
                                    />
                                </span>
                            </button>
                            {/*
                              * Always rendered so it can animate: the grid row goes from
                              * 0fr to 1fr, which eases to the note's real height without
                              * measuring it. Closed notes are inert, so they can't be
                              * tabbed into or read out.
                              */}
                            <div
                                id={`role-note-${i}`}
                                inert={!open}
                                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(.2,0,0,1)] motion-reduce:transition-none ${
                                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                }`}
                            >
                                <div className="overflow-hidden">
                                    <div className="grid grid-cols-12 gap-6 pb-5">
                                        <p className="col-span-12 text-[18px] leading-[1.55] text-pretty min-[720px]:col-span-6 min-[720px]:col-start-5">
                                            {role.note}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    )
                })}
            </section>
        </div>
    )
}
