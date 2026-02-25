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
        role: "Senior Product Designer",
        company: "Tactile Games",
        period: "2024 — Present",
        description:
            "Designing internal tools and platform workflows for game development teams. Focused on reducing friction in the LiveOps pipeline.",
    },
    {
        id: "google",
        role: "Product Designer",
        company: "Google",
        period: "2024",
        description:
            "Worked on search experiences and travel planning features across mobile and desktop surfaces.",
    },
    {
        id: "famly",
        role: "Product Designer",
        company: "Famly",
        period: "2022 — 2024",
        description:
            "Built design systems and improved workflows for a childcare management platform used by thousands of nurseries.",
    },
    {
        id: "maersk",
        role: "UX Designer",
        company: "Maersk",
        period: "2020 — 2022",
        description:
            "Designed logistics and supply chain management tools for one of the world's largest shipping companies.",
    },
]

export function About() {
    const [time, setTime] = useState("")
    const [isNight, setIsNight] = useState(false)

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
            <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] mb-16 md:mb-24">
                <BounceCards
                    className="about-bounce-cards"
                    images={images as any}
                    containerHeight={500}
                    animationStagger={0.08}
                    easeType="elastic.out(1, 0.5)"
                    transformStyles={transformStyles as any}
                    enableHover
                />
            </div>

            <section id="about" className="relative z-20 pb-16 md:pb-24">
                <div className="w-full mx-auto px-6">

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
                            <h1 className="text-4xl md:text-[56px] lg:text-[67px] font-medium leading-[1.08] text-foreground text-balance tracking-tight mb-8">
                                {"I'm Diana, a product designer based in Copenhagen"}
                            </h1>
                            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                                {
                                    "Currently designing SaaS tools at Tactile Games, helping game developers ship faster and more reliably. Previously, I worked on search experiences at Google and built design systems at Famly and Maersk."
                                }
                            </p>
                        </div>
                    </div>

                    {/* "Where I've worked" section */}
                    <div className="grid grid-cols-4 md:grid-cols-12 gap-x-3 border-t border-border pt-12 md:pt-16">

                        {/* Left: section label */}
                        <div className="col-span-4 md:col-span-3 mb-8 md:mb-0">
                            <p className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
                                {"Where I've worked"}
                            </p>
                        </div>

                        {/* Right: accordion */}
                        <div className="col-span-4 md:col-span-8 md:col-start-5">
                            <Accordion
                                type="single"
                                collapsible
                                defaultValue="tactile-games"
                            >
                                {workHistory.map((item) => (
                                    <AccordionItem key={item.id} value={item.id}>
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
            </section>
        </>
    )
}
