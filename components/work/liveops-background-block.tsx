"use client"

import { useMemo, useState } from "react"
import Image from "next/image"

type Mode = "ideal" | "error"

export function LiveopsBackgroundBlock() {
    const [mode, setMode] = useState<Mode>("ideal")

    const images = useMemo(
        () => ({
            ideal: {
                src: "https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610157/LiveOps-ideal.png",
                alt: "Ideal LiveOps flow: Dashboard configuration processed by backend systems and delivered to players.",
                captionTitle: "Ideal flow",
                captionBody:
                    "A creator configures a feature in the Dashboard, backend systems process it, and the result reaches players as expected.",
            },
            error: {
                src: "https://res.cloudinary.com/dzpdf5ygh/image/upload/v1769610181/LiveOps-error.png",
                alt: "Error LiveOps flow: backend failure impacts players without Dashboard visibility.",
                captionTitle: "Error flow",
                captionBody:
                    "Backend failures can affect players while creators still see no actionable signal inside the Dashboard.",
            },
        }),
        []
    )

    const active = images[mode]

    return (
        <>
            <section id="overview">
                <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
                    Live mobile games rely on continuous updates after release.
                </h2>

                <div className="space-y-4">
                    <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                        At Tactile, updates are managed through an internal LiveOps Dashboard,
                        where teams configure events, experiments, player targeting, and feature
                        rollouts without shipping new app versions.
                    </p>
                    <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                        The flow looks simple, but it depends on multiple backend systems staying
                        in sync. When something breaks, the impact often appears first in the live
                        game.
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-lg border border-border bg-card p-4">
                        <p className="text-xs uppercase tracking-wide text-[var(--text-tertiary)]">
                            Creator action
                        </p>
                        <p className="mt-2 text-sm text-[var(--text-secondary)]">
                            Configure events, rollouts, and targeting directly in the Dashboard.
                        </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4">
                        <p className="text-xs uppercase tracking-wide text-[var(--text-tertiary)]">
                            System dependency
                        </p>
                        <p className="mt-2 text-sm text-[var(--text-secondary)]">
                            Multiple backend services must process and deliver changes correctly.
                        </p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4">
                        <p className="text-xs uppercase tracking-wide text-[var(--text-tertiary)]">
                            Risk surface
                        </p>
                        <p className="mt-2 text-sm text-[var(--text-secondary)]">
                            Breakage appears first in production, where players feel impact.
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setMode("ideal")}
                        className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                            mode === "ideal"
                                ? "bg-foreground text-background"
                                : "bg-card text-[var(--text-secondary)] border border-border"
                        }`}
                    >
                        Ideal flow
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("error")}
                        className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                            mode === "error"
                                ? "bg-foreground text-background"
                                : "bg-card text-[var(--text-secondary)] border border-border"
                        }`}
                    >
                        Error flow
                    </button>
                </div>

                <figure className="mt-4">
                    <div className="rounded-lg overflow-hidden bg-card border border-border p-8">
                        <div className="grid">
                            {(["ideal", "error"] as const).map((key) => {
                                const item = images[key]
                                const isActive = mode === key

                                return (
                                    <div
                                        key={key}
                                        className={`col-start-1 row-start-1 transition-opacity duration-500 ease-in-out ${
                                            isActive ? "opacity-100" : "opacity-0"
                                        }`}
                                        aria-hidden={!isActive}
                                    >
                                        <Image
                                            src={item.src}
                                            alt={item.alt}
                                            width={1920}
                                            height={1080}
                                            className="w-full h-auto object-contain"
                                            sizes="(max-width: 768px) 100vw, 60vw"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <figcaption className="mt-4 border-l-2 border-border pl-4 transition-colors duration-300">
                        <p className="text-sm font-medium text-foreground">{active.captionTitle}</p>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                            {active.captionBody}
                        </p>
                    </figcaption>
                </figure>
            </section>

            <section id="problem" className="mt-14">
                <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4">
                    The problem
                </h2>
                <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                    Failures were detected by backend systems, but not surfaced in the LiveOps
                    Dashboard. As a result, creators had no indication that a live feature was
                    failing until players or support teams raised the issue.
                </p>
            </section>
        </>
    )
}
