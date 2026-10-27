import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Geist_Mono } from "next/font/google"
import { figCaption } from "@/components/work/caption"

/*
 * The chrome shared by the Lab posts, matched to Lab Project.dc.html in the
 * design handoff: a 1200px column with 40px sides, Geist Mono labels, the title
 * and pill links, a hero with the spec row under it, label-and-prose sections,
 * a build log, and a "Next in the Lab" row at the end. Each post keeps its own
 * content and interactive pieces; this only sets the frame around them.
 */

const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap" })

/** The design's small uppercase labels: Geist Mono 11px. */
export const labMono = `${geistMono.className} text-[11px] uppercase`

// The design has no box-sizing reset, so its 1200px column is 1200px of content plus the 40px sides.
export const labContainer = "mx-auto w-full max-w-[1280px] px-5 sm:px-10"
/** Prose under a section label: 22px ink, as in the design's "Why" block. */
export const labBody = "text-[22px] leading-[1.5] tracking-[-0.01em] text-ink text-pretty"
/** A label heading inside a post's own layout, in the same mono as the section labels. */
export const labHeading = `${labMono} text-ink-meta`

type LabAction = { label: string; href: string; primary?: boolean }
type LabSpec = { label: string; value: ReactNode }

export function LabIntro({
    back = { label: "Lab", href: "/#lab" },
    title,
    standfirst,
    actions = [],
}: {
    back?: { label: string; href: string }
    title: ReactNode
    standfirst?: ReactNode
    actions?: LabAction[]
}) {
    return (
        <section className={`${labContainer} flex flex-col gap-8 pt-12 pb-8`}>
            <Link
                href={back.href}
                className={`${geistMono.className} self-start text-xs uppercase text-ink-muted transition-colors hover:text-brand`}
            >
                ← {back.label}
            </Link>
            <div className="flex flex-wrap items-end justify-between gap-8">
                <div className="flex max-w-[720px] flex-col gap-3">
                    <h1 className="m-0 text-[56px] leading-none font-medium tracking-[-0.04em] text-ink">{title}</h1>
                    {standfirst && <p className="m-0 text-[19px] leading-[1.45] text-ink-muted">{standfirst}</p>}
                </div>
                {actions.length > 0 && (
                    <div className="flex gap-2">
                        {actions.map((action) => {
                            const external = /^https?:|\.html$/.test(action.href)
                            return (
                                <a
                                    key={action.label}
                                    href={action.href}
                                    target={external ? "_blank" : undefined}
                                    rel={external ? "noopener noreferrer" : undefined}
                                    className={
                                        action.primary
                                            ? "rounded-full bg-ink px-[18px] py-2.5 text-sm text-white"
                                            : "rounded-full border border-hairline px-[18px] py-2.5 text-sm text-ink transition-colors hover:text-brand"
                                    }
                                >
                                    {action.label}
                                </a>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}

/**
 * The hero and the spec row under it. The design's hero is a 600px rounded
 * live embed; posts pass their own media. Without media, the spec row gets a
 * top rule too, so it doesn't float.
 */
export function LabHero({ children, specs = [] }: { children?: ReactNode; specs?: LabSpec[] }) {
    return (
        <section className={labContainer}>
            {children && <div className="overflow-hidden rounded-[20px]">{children}</div>}
            {specs.length > 0 && (
                <dl
                    className={`grid grid-cols-2 border-b border-hairline sm:grid-cols-4 ${children ? "" : "border-t"}`}
                >
                    {specs.map((spec) => (
                        <div key={spec.label} className="flex flex-col gap-[3px] py-5 pr-4">
                            <dt className={`${labMono} text-ink-meta`}>{spec.label}</dt>
                            <dd className="text-[15px] text-ink">{spec.value}</dd>
                        </div>
                    ))}
                </dl>
            )}
        </section>
    )
}

/**
 * A section: a mono label in a 200px column, content beside it. Prose is capped
 * at 720px, as in the design's "Why"; `rule` is the Build log variant, with a
 * 1px ink rule over a full-width content column.
 */
export function LabSection({
    label,
    children,
    rule = false,
    className = "",
}: {
    label: string
    children: ReactNode
    rule?: boolean
    className?: string
}) {
    return (
        <section
            className={`${labContainer} grid grid-cols-1 gap-4 pt-[72px] md:gap-16 ${
                rule ? "md:grid-cols-[200px_minmax(0,1fr)]" : "md:grid-cols-[200px_minmax(0,720px)]"
            } ${className}`}
        >
            <h2 className={`${labMono} pt-1.5 font-normal text-ink-meta`}>{label}</h2>
            <div className={`min-w-0 ${rule ? "border-t border-ink" : ""}`}>{children}</div>
        </section>
    )
}

export type LabLogEntry = { when: string; title: string; text: ReactNode; media?: ReactNode }

/** Build log rows: when, what happened, and a 4:3 picture. Goes inside a ruled LabSection. */
export function LabLog({ entries }: { entries: LabLogEntry[] }) {
    return (
        <ol>
            {entries.map((entry) => (
                <li
                    key={entry.title}
                    className="grid grid-cols-1 items-start gap-3 border-b border-hairline py-[18px] sm:grid-cols-[110px_minmax(0,1fr)_220px] sm:gap-6"
                >
                    <span className={`${labMono} pt-[3px] text-ink-meta`}>{entry.when}</span>
                    <div className="flex flex-col gap-1">
                        <span className="text-base font-medium">{entry.title}</span>
                        <span className="text-sm leading-[1.55] text-ink-muted">{entry.text}</span>
                    </div>
                    {entry.media && (
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] border border-hairline bg-surface">
                            {entry.media}
                        </div>
                    )}
                </li>
            ))}
        </ol>
    )
}

/** "Fig. N — caption", with "Fig. N" in ink. */
export function FigCaption({
    n,
    children,
    className = "",
}: {
    n: number
    children: ReactNode
    className?: string
}) {
    return (
        <figcaption className={`${figCaption} ${className}`}>
            <span className="text-ink">Fig. {n}</span> — {children}
        </figcaption>
    )
}

export function NextInLab({
    title,
    href,
    image,
    label = "Next in the Lab",
}: {
    title: string
    href: string
    image?: string
    label?: string
}) {
    return (
        <Link href={href} className="mt-[88px] block border-t border-hairline text-ink hover:text-ink">
            <div
                className={`mx-auto flex max-w-[1280px] items-center justify-between gap-8 p-5 transition-opacity hover:opacity-70 sm:p-10`}
            >
                <div className="flex items-center gap-5">
                    <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[14px] border border-hairline bg-[repeating-linear-gradient(135deg,#ededed_0_6px,#fff_6px_12px)]">
                        {image && <Image src={image} alt="" fill sizes="72px" className="object-cover" />}
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className={`${labMono} text-ink-meta`}>{label}</span>
                        <span className="text-2xl font-medium tracking-[-0.02em]">{title}</span>
                    </div>
                </div>
                <span aria-hidden className="text-2xl">
                    →
                </span>
            </div>
        </Link>
    )
}
