"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { FigCaption, csHeading, csParagraph } from "@/lib/work-project-pages/shared"

type Mode = "ideal" | "error"

export function LiveopsBackgroundBlock() {
    const [mode, setMode] = useState<Mode>("ideal")

    const images = useMemo(
        () => ({
            ideal: {
                src: "https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_auto/v1769610157/LiveOps-ideal.png",
                alt: "Ideal LiveOps flow: Dashboard configuration processed by backend systems and delivered to players.",
                captionTitle: "Ideal flow",
                captionBody:
                    "A creator configures a feature in the Dashboard, backend systems process it, and the result reaches players as expected.",
            },
            error: {
                src: "https://res.cloudinary.com/dzpdf5ygh/image/upload/f_auto,q_auto/v1769610181/LiveOps-error.png",
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
            {/* Renders its own sections, so it adds the number and the head/body split the page adds elsewhere. */}
            <section id="overview">
                <div data-cs-head="">
                    <h2 className={csHeading}>
                        Live mobile games rely on continuous updates after release.
                    </h2>
                </div>
                <div data-cs-body="">

                <div className="space-y-4">
                    <p className={csParagraph}>
                        At Tactile, updates are managed through an internal LiveOps Dashboard,
                        where teams configure events, experiments, player targeting, and feature
                        rollouts without shipping new app versions.
                    </p>
                    <p className={csParagraph}>
                        The flow looks simple, but it depends on multiple backend systems staying
                        in sync. When something breaks, the impact often appears first in the live
                        game.
                    </p>
                </div>

                {/*<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">*/}
                {/*    <div className="rounded-lg border border-border bg-card p-4">*/}
                {/*        <p className="text-xs uppercase tracking-wide text-[var(--text-tertiary)]">*/}
                {/*            Creator action*/}
                {/*        </p>*/}
                {/*        <p className="mt-2 text-sm text-[var(--text-secondary)]">*/}
                {/*            Configure events, rollouts, and targeting directly in the Dashboard.*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*    <div className="rounded-lg border border-border bg-card p-4">*/}
                {/*        <p className="text-xs uppercase tracking-wide text-[var(--text-tertiary)]">*/}
                {/*            System dependency*/}
                {/*        </p>*/}
                {/*        <p className="mt-2 text-sm text-[var(--text-secondary)]">*/}
                {/*            Multiple backend services must process and deliver changes correctly.*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*    <div className="rounded-lg border border-border bg-card p-4">*/}
                {/*        <p className="text-xs uppercase tracking-wide text-[var(--text-tertiary)]">*/}
                {/*            Risk surface*/}
                {/*        </p>*/}
                {/*        <p className="mt-2 text-sm text-[var(--text-secondary)]">*/}
                {/*            Breakage appears first in production, where players feel impact.*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="mt-8 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setMode("ideal")}
                        className={`rounded-full border px-3 py-1.5 text-[13px] transition-colors ${
                            mode === "ideal" ? "border-ink bg-ink text-white" : "border-hairline text-ink-muted hover:text-brand"
                        }`}
                    >
                        Ideal flow
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("error")}
                        className={`rounded-full border px-3 py-1.5 text-[13px] transition-colors ${
                            mode === "error" ? "border-ink bg-ink text-white" : "border-hairline text-ink-muted hover:text-brand"
                        }`}
                    >
                        Error flow
                    </button>
                </div>

                <figure className="mt-3 flex flex-col gap-2.5">
                    <div className="overflow-hidden bg-surface p-8">
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
                    <FigCaption>
                        {active.captionTitle}. {active.captionBody}
                    </FigCaption>
                </figure>
                </div>
            </section>

            <section id="problem">
                <div data-cs-head="">
                    <h2 className={csHeading}>
                        The problem
                    </h2>
                </div>
                <div data-cs-body="">
                <p className={csParagraph}>
                    Failures were detected by backend systems, but not surfaced in the LiveOps
                    Dashboard. As a result, creators had no indication that a live feature was
                    failing until players or support teams raised the issue.
                </p>
                </div>
            </section>
        </>
    )
}
