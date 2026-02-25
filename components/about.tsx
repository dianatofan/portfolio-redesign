"use client"

import Image from "next/image"
import BounceCards from "./BounceCards"
import "./About.css"

export function About() {
    const images = [
        "/images/about/mountain.png",
        "/images/about/ride.jpg",
        "/images/about/run.jpg",
        "/images/about/minime.png",
        "/images/about/me.jpg",

    ] as const;

    const transformStyles = [
        "rotate(8deg) translate(-280px)",
        "rotate(-3deg) translate(-140px)",
        "rotate(-5deg)",
        "rotate(3deg) translate(140px)",
        "rotate(-8deg) translate(280px)"
    ] as const;

    return (
        <>
            {/* Full-width BounceCards section - outside section padding */}
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

            <section id="about" className="relative z-20 py-16 md:py-24">
                <div className="mx-auto w-full max-w-[1800px] px-6">
                {/* Hero Title */}
                <div className="mb-16 md:mb-24">
                    <h1 className="text-4xl md:text-[56px] lg:text-[67px] font-medium leading-[1.08] text-foreground text-balance tracking-tight">
                        About me
                    </h1>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">


                    {/* Left Column - Image */}
                    <div className="md:col-span-5">
                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-muted">
                            <Image
                                src="/placeholder-user.jpg"
                                alt="Diana Tofan"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right Column - Content */}
                    <div className="md:col-span-7 space-y-8">
                        {/* Intro */}
                        <div className="space-y-4">
                            <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
                                {"I'm a product designer based in Copenhagen, Denmark, specializing in complex systems and enterprise tools."}
                            </p>
                            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                                {
                                    "Currently, I'm designing SaaS tools at Tactile Games, helping game developers ship faster and more reliably. Previously, I worked on search experiences at Google and built design systems at Famly and Maersk."
                                }
                            </p>
                        </div>

                        {/* Experience Section */}
                        <div className="space-y-6 pt-8 border-t border-border">
                            <h2 className="text-2xl font-medium text-foreground">Experience</h2>

                            <div className="space-y-6">
                                <ExperienceItem
                                    role="Senior Product Designer"
                                    company="Tactile Games"
                                    period="2024 - Present"
                                    description="Designing internal tools and platform workflows for game development teams."
                                />

                                <ExperienceItem
                                    role="Product Designer"
                                    company="Google"
                                    period="2024"
                                    description="Worked on search experiences and travel planning features."
                                />

                                <ExperienceItem
                                    role="Product Designer"
                                    company="Famly"
                                    period="2022 - 2024"
                                    description="Built design systems and improved workflows for childcare management platform."
                                />

                                <ExperienceItem
                                    role="UX Designer"
                                    company="Maersk"
                                    period="2020 - 2022"
                                    description="Designed logistics and supply chain management tools."
                                />
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="space-y-6 pt-8 border-t border-border">
                            <h2 className="text-2xl font-medium text-foreground">
                                What I do best
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <SkillItem
                                    title="Complex Systems"
                                    description="Breaking down enterprise workflows into intuitive interfaces"
                                />
                                <SkillItem
                                    title="Design Systems"
                                    description="Building scalable component libraries and design tokens"
                                />
                                <SkillItem
                                    title="Developer Tools"
                                    description="Creating internal tools that developers actually want to use"
                                />
                                <SkillItem
                                    title="User Research"
                                    description="Conducting interviews and usability testing to validate designs"
                                />
                            </div>
                        </div>

                        {/* Tools Section */}
                        <div className="space-y-6 pt-8 border-t border-border">
                            <h2 className="text-2xl font-medium text-foreground">Tools</h2>

                            <div className="flex flex-wrap gap-3">
                                <ToolBadge>Figma</ToolBadge>
                                <ToolBadge>FigJam</ToolBadge>
                                <ToolBadge>Notion</ToolBadge>
                                <ToolBadge>React</ToolBadge>
                                <ToolBadge>Tailwind CSS</ToolBadge>
                                <ToolBadge>Framer</ToolBadge>
                                <ToolBadge>Principle</ToolBadge>
                            </div>
                        </div>

                        {/* Personal Note */}
                        <div className="space-y-4 pt-8 border-t border-border">
                            <h2 className="text-2xl font-medium text-foreground">Beyond work</h2>
                            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                                {
                                    "When I'm not designing, you'll find me exploring Copenhagen's coffee shops, experimenting with creative coding, or planning my next travel adventure. I'm passionate about sustainability, design ethics, and making technology more accessible."
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}

// Experience Item Component
function ExperienceItem({
    role,
    company,
    period,
    description,
}: {
    role: string
    company: string
    period: string
    description: string
}) {
    return (
        <div className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <h3 className="text-lg font-medium text-foreground">{role}</h3>
                <span className="text-sm text-[var(--text-tertiary)]">{period}</span>
            </div>
            <p className="text-base font-medium text-[var(--text-secondary)]">{company}</p>
            <p className="text-base text-[var(--text-secondary)] leading-relaxed">
                {description}
            </p>
        </div>
    )
}

// Skill Item Component
function SkillItem({ title, description }: { title: string; description: string }) {
    return (
        <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <h3 className="text-base font-medium text-foreground">{title}</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
        </div>
    )
}

// Tool Badge Component
function ToolBadge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-secondary text-sm font-medium text-foreground">
            {children}
        </span>
    )
}
