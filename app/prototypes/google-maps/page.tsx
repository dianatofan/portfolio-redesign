import type { Metadata } from "next"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PrototypeMedia } from "@/components/prototypes/prototype-media"
import { googleMapsPrototypes } from "@/lib/prototypes/google-maps-prototypes"
import { csHeading, csParagraph } from "@/lib/work-project-pages/shared"

export const metadata: Metadata = {
    title: "Exploring Product Directions at Google - Diana Tofan",
    description:
        "Four React prototypes I built at Google for Search and Maps: the question behind each one, what I tried, and what happened after the review.",
}

const meta = [
    { label: "Role", values: ["UX Engineer"] },
    { label: "Company", values: ["Google"] },
    { label: "Team", values: ["UX Leads", "Researchers", "Product Managers"] },
    { label: "Skills", values: ["Prototyping", "Interaction Design"] },
    { label: "Tools", values: ["React", "Google Maps API"] },
]

/*
 * The prototypes as an editorial case study: one numbered section each, in the
 * same type and rules as app/work/[slug]. Every section reads question →
 * solution → outcome, with the review result as a small label on its rule.
 */
export default function GoogleMapsPrototypesPage() {
    return (
        <main className="min-h-screen bg-white text-ink">
            <Header />

            <section className="flex flex-col gap-7 px-gutter pt-10 pb-12 min-[720px]:pt-[72px]">
                <Link href="/#work" className="self-start text-[13px] text-ink-meta transition-colors hover:text-brand">
                    ← Work
                </Link>
                <div className="flex flex-col gap-5">
                    <span className="text-[13px] text-ink-meta">Prototypes · Google</span>
                    <h1 className="max-w-[1400px] text-[clamp(52px,9vw,140px)] font-medium leading-[0.9] tracking-[-0.06em] text-balance">
                        Exploring Product Directions at Google
                    </h1>
                    <p className="mt-2 max-w-[820px] text-[clamp(20px,2vw,26px)] leading-[1.3] tracking-[-0.015em] text-pretty">
                        As a UX Engineer on Google Travel, I built dozens of React prototypes to help teams explore new
                        product directions, validate assumptions and make decisions faster. Not every prototype shipped,
                        but every prototype answered a question.
                    </p>
                </div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink pt-4 min-[720px]:grid-cols-5">
                    {meta.map((item) => (
                        <div key={item.label} className="flex flex-col gap-1">
                            <dt className="text-[13px] text-ink-meta">{item.label}</dt>
                            <dd className="text-[15px]">
                                {item.values.map((value, index) => (
                                    <span key={`${item.label}-${value}`}>
                                        {index > 0 && <br />}
                                        {value}
                                    </span>
                                ))}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>

            <div className="flex max-w-[1180px] flex-col gap-24 px-gutter pt-12 pb-24 min-[720px]:pt-16">
                {googleMapsPrototypes.map((prototype, i) => {
                    const n = String(i + 1).padStart(2, "0")
                    const approved = prototype.status === "APPROVED"

                    return (
                        <section key={prototype.id} id={prototype.id} className="scroll-mt-24">
                            <div className="mb-5 flex items-baseline justify-between gap-3.5 border-t border-ink pt-3.5">
                                <span className="flex items-baseline gap-3.5">
                                    <span className="text-[13px] text-ink-meta">{n}</span>
                                    <span className="text-[15px] font-medium">Prototype</span>
                                </span>
                                <span className={`text-[13px] ${approved ? "text-brand" : "text-ink-muted"}`}>
                                    {approved ? "Approved" : "Not shipped"}
                                </span>
                            </div>

                            <h2 className={csHeading}>{prototype.title}</h2>
                            <p className="mb-8 max-w-[760px] text-2xl leading-[1.3] tracking-[-0.015em] text-ink-muted text-pretty">
                                {prototype.question}
                            </p>

                            <div className="grid grid-cols-1 gap-x-14 gap-y-8 min-[1100px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                                <div className="flex flex-col gap-6">
                                    <div>
                                        <p className="mb-1.5 text-[13px] text-ink-meta">What I built</p>
                                        <p className={csParagraph}>{prototype.solution}</p>
                                    </div>
                                    <div>
                                        <p className="mb-1.5 text-[13px] text-ink-meta">What happened</p>
                                        <p className={csParagraph}>{prototype.outcome}</p>
                                    </div>
                                    {prototype.details && (
                                        <p className="max-w-[560px] text-[13px] leading-[1.5] text-ink-muted">
                                            {prototype.details}
                                        </p>
                                    )}
                                </div>

                                <figure className="flex flex-col gap-2.5">
                                    <PrototypeMedia device={prototype.device} label={prototype.title} />
                                    <figcaption className="text-[13px] text-ink-meta">
                                        <span className="text-ink">Fig. {i + 1}</span> — Recording coming soon
                                    </figcaption>
                                </figure>
                            </div>
                        </section>
                    )
                })}
            </div>

            <section className="px-gutter">
                <Link
                    href="/work/dianas-diamonds"
                    className="group flex flex-col gap-2 border-t border-ink pt-6 transition-colors hover:text-brand"
                >
                    <span className="text-[13px] text-ink-meta">Next case study →</span>
                    <span className="text-[clamp(40px,6vw,88px)] font-medium leading-[0.95] tracking-[-0.05em]">
                        Diana&apos;s Diamonds
                    </span>
                </Link>
            </section>

            <Footer />
        </main>
    )
}
