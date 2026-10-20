import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
    title: "Colophon - Diana Tofan",
    description:
        "How dianatofan.net was designed and built: who did what, the decisions behind it, and the tools.",
}

/*
 * Label on the left (cols 1-3), lines on the right (cols 4-10), one row per
 * topic between hairlines. Copy is from Colophon.dc.html in the design handoff.
 */
const rows: Array<{ label: string; lines: string[] }> = [
    { label: "Time", lines: ["One working day, redesigning my previous site from scratch."] },
    {
        label: "What I did",
        lines: [
            "Brainstormed the ideas and set the direction.",
            "Wrote the words, chose what to show, and filled it with my work.",
            "Made every call on what stays and what goes.",
        ],
    },
    {
        label: "What AI did",
        lines: [
            "Helped structure the page and wrote most of the code.",
            "I reviewed it, refined it, and threw a lot of it away.",
        ],
    },
    {
        label: "Decisions",
        lines: [
            "Cut the homepage to about two screens, so work comes first.",
            "Kept one playful detail, the thread, instead of five.",
            "Kept the headline I already had. It was still true.",
        ],
    },
    { label: "Tools", lines: ["Figma, Claude Code, Next.js. Set in Saans."] },
]

export default function ColophonPage() {
    return (
        <main className="min-h-screen bg-white text-ink">
            <Header />

            <section className="grid grid-cols-1 gap-6 px-gutter pt-14 pb-12 sm:pt-20 md:grid-cols-12 md:pb-[72px] xl:pt-[120px]">
                <Link
                    href="/"
                    className="pt-4 text-sm text-ink-meta transition-colors hover:text-brand md:col-span-3"
                >
                    ← Home
                </Link>
                <div className="flex flex-col gap-6 md:col-span-8 md:col-start-4">
                    <h1 className="text-[clamp(44px,5.5vw,80px)] font-medium leading-none tracking-[-0.045em] text-balance">
                        How this site was made
                    </h1>
                    <p className="max-w-[640px] text-xl leading-normal text-ink-muted text-pretty">
                        I redesigned my old portfolio in one working day, with AI as a pair.
                        Here&apos;s who did what, and the decisions behind it.
                    </p>
                </div>
            </section>

            <section className="px-gutter pb-14 md:pb-[120px]">
                {rows.map((row) => (
                    <div
                        key={row.label}
                        className="grid grid-cols-1 gap-3 border-t border-hairline py-7 md:grid-cols-12 md:gap-6"
                    >
                        <h2 className="text-[15px] font-normal text-ink-meta md:col-span-3">
                            {row.label}
                        </h2>
                        <div className="flex flex-col gap-2.5 md:col-span-7 md:col-start-4">
                            {row.lines.map((line) => (
                                <p
                                    key={line}
                                    className="text-xl leading-normal tracking-[-0.01em] text-pretty"
                                >
                                    {line}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            <Footer />
        </main>
    )
}
