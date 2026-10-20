import type { CSSProperties } from "react"

/*
 * The Problem section's Before / After illustrations, from Case Study v3: a chat
 * thread where prototype links get lost, and a wireframe of the library's grid
 * with shining diamonds. Both are drawn, not screenshots, and captioned as such.
 *
 * The keyframes live here, not in globals.css, so they never depend on a
 * stylesheet rebuild. Every animated element carries data-anim, which the
 * reduced-motion rule below stills.
 */

const KEYFRAMES = `
@keyframes cs3msg{0%,3%{opacity:0;transform:translateY(8px)}9%,88%{opacity:1;transform:none}96%,100%{opacity:0;transform:none}}
@keyframes cs3shine{0%,55%{background-position:120% 0}85%,100%{background-position:-20% 0}}
@keyframes cs3dead{0%,92%,100%{transform:none}94%{transform:translateX(-2px)}96%{transform:translateX(2px)}98%{transform:translateX(-1px)}}
@keyframes cs3pulse{0%,100%{box-shadow:0 0 0 0 rgba(79,53,184,.5)}50%{box-shadow:0 0 0 4px rgba(79,53,184,0)}}
@media (prefers-reduced-motion:reduce){[data-anim]{animation:none!important;opacity:1!important}}
`

type Message = { who: "PM" | "DT" | "FE"; text: string; link?: { label: string; dead?: boolean } }

const MESSAGES: Message[] = [
    { who: "PM", text: "Where is the latest onboarding prototype?" },
    { who: "DT", text: "Here:", link: { label: "proto-onboarding-v3.app" } },
    { who: "FE", text: "Is this the one from the review? This link is dead.", link: { label: "proto-onboarding-v2.app · 404", dead: true } },
    { who: "DT", text: "That one was cleaned up. Try v4:", link: { label: "proto-onboarding-v4.app" } },
    { who: "PM", text: "What changed between v3 and v4?" },
    { who: "FE", text: "And which repo is it in?" },
]

const AVATAR: Record<Message["who"], string> = { PM: "#c9c8d0", DT: "#16151a", FE: "#a3a1ad" }

function ChatMockup() {
    return (
        <div
            aria-label="Mockup of a chat thread"
            className="relative flex aspect-[4/5] flex-col overflow-hidden rounded-[14px] bg-[#f1f2f4]"
        >
            <div className="flex items-baseline justify-between border-b border-hairline px-[18px] py-3.5 text-[13px]">
                <span className="font-medium"># design-reviews</span>
                <span className="text-ink-meta">142 replies</span>
            </div>
            <div
                className="flex flex-1 flex-col justify-end gap-4 p-[18px]"
                style={{ WebkitMaskImage: "linear-gradient(180deg,transparent,#000 22%)", maskImage: "linear-gradient(180deg,transparent,#000 22%)" }}
            >
                {MESSAGES.map((m, i) => (
                    <div
                        key={i}
                        data-anim="1"
                        className="flex items-start gap-2.5"
                        style={{ opacity: 0, animation: `cs3msg 9s ${(i * 0.9).toFixed(1)}s ease-out infinite` }}
                    >
                        <span
                            className="grid h-7 w-7 flex-none place-items-center rounded-[8px] text-[11px] font-medium text-white"
                            style={{ background: AVATAR[m.who] }}
                        >
                            {m.who}
                        </span>
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="text-[13px] leading-[1.4] text-ink">{m.text}</span>
                            {m.link && (
                                <span
                                    data-anim={m.link.dead ? "1" : undefined}
                                    className={`self-start rounded-[6px] border border-hairline bg-white px-2 py-1 text-[12px] ${
                                        m.link.dead ? "text-ink-meta line-through" : "text-brand"
                                    }`}
                                    style={m.link.dead ? { animation: "cs3dead 3s ease-in-out infinite" } : undefined}
                                >
                                    {m.link.label}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Status dot per card, in reading order: grey not started, purple (pulsing) in progress, ink ready.
const CARDS: Array<{ bar: number; dot: "todo" | "doing" | "done" }> = [
    { bar: 60, dot: "todo" },
    { bar: 73, dot: "doing" },
    { bar: 86, dot: "done" },
    { bar: 69, dot: "todo" },
    { bar: 82, dot: "doing" },
    { bar: 65, dot: "done" },
    { bar: 78, dot: "todo" },
    { bar: 61, dot: "doing" },
    { bar: 74, dot: "done" },
    { bar: 87, dot: "todo" },
    { bar: 70, dot: "doing" },
    { bar: 83, dot: "done" },
]
const SHINE_DELAYS = [0, 0.37, 0.74, 1.11, 1.48, 1.85, 2.22, 2.59, 2.96, 3.33, 0.1, 0.47]

const GEM: CSSProperties = {
    width: "38%",
    aspectRatio: "1 / 0.8",
    background: "linear-gradient(115deg,#d4d3db 0%,#d4d3db 38%,#ffffff 48%,#ece9ff 52%,#b9b7c4 58%,#d4d3db 70%,#d4d3db 100%)",
    backgroundSize: "300% 100%",
    backgroundPosition: "120% 0",
    clipPath: "polygon(22% 0,78% 0,100% 32%,50% 100%,0 32%)",
}

function Dot({ kind }: { kind: "todo" | "doing" | "done" }) {
    if (kind === "doing")
        return (
            <span
                data-anim="1"
                className="h-1.5 w-1.5 rounded-full bg-brand"
                style={{ animation: "cs3pulse 1.8s ease-in-out infinite" }}
            />
        )
    return <span className={`h-1.5 w-1.5 rounded-full ${kind === "done" ? "bg-ink" : "bg-[#c9c8d0]"}`} />
}

function GridWireframe() {
    const field = "flex h-[26px] items-center rounded-[6px] border border-[#d9d8de] bg-white text-[11px]"
    return (
        <div
            aria-label="Wireframe of the library grid view"
            className="relative box-border flex aspect-[4/5] flex-col gap-3.5 overflow-hidden rounded-[14px] bg-[#f1f2f4] p-[18px]"
        >
            <div className="flex items-center justify-between gap-2.5">
                <span className="text-[13px] font-medium">Diana&apos;s Diamonds</span>
                <span className="flex rounded-full border border-[#d9d8de] p-0.5 text-[11px]">
                    <span className="rounded-full px-[9px] py-[3px] text-ink-meta">Field</span>
                    <span className="rounded-full bg-ink px-[9px] py-[3px] text-white">Grid</span>
                </span>
            </div>
            <div className="flex items-center gap-1.5">
                <span className={`${field} flex-1 px-2 text-[#a3a1ad]`}>Search by name or ticket</span>
                <span className={`${field} px-2.5 text-ink-muted`}>Area</span>
                <span className={`${field} px-2.5 text-ink-muted`}>Status</span>
            </div>
            <div
                className="grid min-h-0 flex-1 grid-cols-3 content-start gap-2 overflow-hidden"
                style={{ WebkitMaskImage: "linear-gradient(180deg,#000 78%,transparent)", maskImage: "linear-gradient(180deg,#000 78%,transparent)" }}
            >
                {CARDS.map((card, i) => (
                    <div key={i} className="flex flex-col gap-1.5 rounded-[8px] border border-[#d9d8de] bg-white p-2.5">
                        <div className="grid aspect-[4/3] place-items-center rounded-[4px] bg-[#f6f6f8]">
                            <span data-anim="1" style={{ ...GEM, animation: `cs3shine 3.6s ${SHINE_DELAYS[i].toFixed(2)}s ease-in-out infinite` }} />
                        </div>
                        <span className="h-1.5 rounded-[3px] bg-[#c9c8d0]" style={{ width: `${card.bar}%` }} />
                        <span className="flex items-center gap-[5px]">
                            <Dot kind={card.dot} />
                            <span className="h-[5px] w-[36%] rounded-[3px] bg-hairline" />
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex gap-3 text-[11px] text-ink-muted">
                <span className="flex items-center gap-[5px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c9c8d0]" />
                    Not started
                </span>
                <span className="flex items-center gap-[5px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    In progress
                </span>
                <span className="flex items-center gap-[5px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                    Ready for review
                </span>
            </div>
        </div>
    )
}

export function BeforeAfter() {
    return (
        <div className="grid grid-cols-1 gap-6 pt-12 min-[720px]:grid-cols-2">
            <style>{KEYFRAMES}</style>
            <div className="flex flex-col gap-3">
                <ChatMockup />
                <span className="text-[13px] text-ink-meta">
                    <span className="text-ink">Before</span> — Illustration: prototype links lost in chat threads.
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <GridWireframe />
                <span className="text-[13px] text-ink-meta">
                    <span className="text-ink">After</span> — Wireframe: every prototype in one grid, searchable by name or ticket.
                </span>
            </div>
        </div>
    )
}
