"use client"

import { useEffect, useState } from "react"
import BounceCards from "./BounceCards"
import "./About.css"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const workHistory = [
    {
        id: "tactile-games",
        role: "Product Designer",
        company: "Tactile Games",
        period: "2024 — Present",
        description:
            "This role strengthened my ability to design systems, not just features. I learned how internal tools clarity directly impacts team velocity, and how to align stakeholders around complex workflows without overcomplicating solutions.",
    },
    {
        id: "google",
        role: "UX Engineer",
        company: "Google",
        period: "2024",
        description:
            "Working at Google expanded my sense of what’s possible. I used code to translate ambitious ideas into high-fidelity prototypes that made abstract concepts tangible and informed product direction before significant engineering investment.",
    },
    {
        id: "famly",
        role: "UX/UI Designer",
        company: "Famly",
        period: "2022 — 2024",
        description:
            "Rebuilding the design foundation of a mature product taught me that systems only work if they’re adopted. Eliminating design debt required clear standards, alignment, and consistent reinforcement across teams.",
    },
    {
        id: "maersk",
        role: "Frontend Engineer",
        company: "Maersk",
        period: "2020 — 2022",
        description:
            "This role strengthened my technical foundation. Working on a global cargo booking platform taught me to design for scale, reliability, and real operational constraints. Those principles still guide how I work today.",
    },
]

export function About() {
    const [time, setTime] = useState("")
    const [isNight, setIsNight] = useState(false)
    const [currentRole, setCurrentRole] = useState(0)
    const [displayText, setDisplayText] = useState("")

    const bioText1 =
        "I work across design and engineering, with a background in frontend, UX engineering, and product design. I build and ship product experiences, using code to explore ideas, test decisions early, and make things tangible."
    const bioText2 =
        "I enjoy shaping decisions and bringing people onto the same page, especially in complex problem spaces where things are still undefined. At the same time, I stay close to the work. I prototype, build, and ship, because that's how I think best and move things forward."
    const bioText3 =
        "I've worked across gaming, big tech, SaaS, and logistics, and I'm comfortable navigating different domains, constraints, and levels of ambiguity."

    const roles = ["frontend engineer", "UX engineer", "product designer"]
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"

    // Decrypt effect
    useEffect(() => {
        const targetText = roles[currentRole]
        let iteration = 0
        const interval = setInterval(() => {
            setDisplayText(
                targetText
                    .split("")
                    .map((char, index) => {
                        if (char === " ") return " "
                        if (index < iteration) {
                            return targetText[index]
                        }
                        return chars[Math.floor(Math.random() * chars.length)]
                    })
                    .join("")
            )

            if (iteration >= targetText.length) {
                clearInterval(interval)
            }

            iteration += 1 / 2 // Faster iteration
        }, 20) // Faster interval

        return () => clearInterval(interval)
    }, [currentRole])

    // Rotate through roles once, then stop at "product designer"
    useEffect(() => {
        const roleInterval = setInterval(() => {
            setCurrentRole((prev) => {
                const next = prev + 1
                // Stop at the last role (product designer)
                if (next >= roles.length) {
                    clearInterval(roleInterval)
                    return roles.length - 1
                }
                return next
            })
        }, 2000) // Change every 2 seconds

        return () => clearInterval(roleInterval)
    }, [])

    useEffect(() => {
        let interval: number | undefined
        let timeout: number | undefined

        const updateTime = () => {
            const now = new Date()
            const copenhagenTime = now
                .toLocaleTimeString("en-US", {
                    timeZone: "Europe/Copenhagen",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                })
                .replace(/\s?(AM|PM)$/, "$1")
            setTime(copenhagenTime)
            const hour = Number(
                new Intl.DateTimeFormat("en-US", {
                    timeZone: "Europe/Copenhagen",
                    hour: "numeric",
                    hour12: false,
                }).format(now)
            )
            setIsNight(hour >= 20 || hour < 6)
        }

        updateTime()
        const now = new Date()
        const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
        timeout = window.setTimeout(() => {
            updateTime()
            interval = window.setInterval(updateTime, 60_000)
        }, msToNextMinute)

        return () => {
            if (timeout) window.clearTimeout(timeout)
            if (interval) window.clearInterval(interval)
        }
    }, [])

    const images = [
        "/images/about/mountain.png",
        "/images/about/ride.jpg",
        "/images/about/run.jpg",
        "/images/about/minime.png",
        "/images/about/me.jpg",
    ] as const

    const transformStyles = [
        "rotate(8deg) translate(-280px)",
        "rotate(-3deg) translate(-140px)",
        "rotate(-5deg)",
        "rotate(3deg) translate(140px)",
        "rotate(-8deg) translate(280px)",
    ] as const

    return (
        <>
            {/* Full-width BounceCards collage */}
            <div id="bounce-cards" className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] pt-24 mb-16 md:mb-24">
                <BounceCards
                    className="about-bounce-cards"
                    images={images as any}
                    containerHeight={600}
                    animationStagger={0.08}
                    easeType="elastic.out(1, 0.5)"
                    transformStyles={transformStyles as any}
                    enableHover
                />
            </div>

            <section id="about" className="relative z-20 pb-16 md:pb-24">
                <div className="max-w-[1800px] mx-auto px-6">
                    {/* Meta + Headline row — same grid as homepage hero */}
                    <div className="grid grid-cols-4 md:grid-cols-12 gap-x-3 gap-y-8 mb-16 md:mb-24">
                        {/* Left: meta block (time / location) */}
                        <div className="col-span-4 md:col-span-3 flex flex-col justify-end pb-8 md:pb-0">
                            <span
                                className="material-symbols-outlined text-foreground leading-none mb-1 font-medium"
                                aria-hidden="true"
                                style={{
                                    fontSize: 18,
                                    fontVariationSettings:
                                        '"FILL" 0, "wght" 500, "GRAD" 0, "opsz" 20',
                                }}
                            >
                                {isNight ? "bedtime" : "sunny"}
                            </span>
                            <span
                                className="text-base font-medium text-foreground"
                                aria-label="Current time in Copenhagen"
                            >
                                {time || "..."}
                            </span>
                            <p className="text-base font-medium text-[var(--text-tertiary)]">
                                Copenhagen, Denmark
                            </p>
                        </div>

                        {/* Right: headline + bio */}
                        <div className="col-span-4 md:col-span-7 md:col-start-6 flex flex-col justify-center">
                            <h1 className="text-4xl md:text-[36px] lg:text-[48px] font-medium leading-[1.08] text-foreground text-balance tracking-tight mb-8 max-w-[840px]">
                                Hi, I'm Diana, a{" "}
                                <span className="role-text-container">
                                    <span className="role-text">{displayText || roles[0]}</span>
                                </span>
                                .
                            </h1>
                            <div id="bio" className="relative z-20">
                                <p id="bio-paragraph-1" className="text-base leading-relaxed max-w-[680px]">
                                    {bioText1}
                                </p>
                                <p id="bio-paragraph-2" className="text-base mt-4 leading-relaxed max-w-[680px]">
                                    {bioText2}
                                </p>
                                <p id="bio-paragraph-3" className="text-base mt-4 leading-relaxed max-w-[680px]">
                                    {bioText3}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* "Where I've worked" section */}
                    <div className="grid grid-cols-4 md:grid-cols-12 gap-x-3 border-t border-[#F0F0F0] pt-12 md:pt-16">
                        {/* Left: section label */}
                        <div className="col-span-4 md:col-span-3 mb-8 md:mb-0">
                            <p className="text-base font-medium text-foreground">
                                {"What each role taught me"}
                            </p>
                        </div>

                        {/* Right: accordion - aligned with intro text */}
                        <div className="col-span-4 md:col-span-7 md:col-start-6">
                            <div className="max-w-[680px]">
                                <Accordion type="single" collapsible>
                                    {workHistory.map((item) => (
                                        <AccordionItem
                                            key={item.id}
                                            value={item.id}
                                            className="border-[#F0F0F0]"
                                        >
                                            <AccordionTrigger className="text-base font-medium text-foreground hover:no-underline py-5">
                                                <span>
                                                    {item.role}
                                                    <span className="text-[var(--text-tertiary)] font-normal ml-2">
                                                        {item.company}
                                                    </span>
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="flex flex-col gap-2 pb-2 text-base">
                                                    <span className="text-sm text-[var(--text-tertiary)]">
                                                        {item.period}
                                                    </span>
                                                    <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
