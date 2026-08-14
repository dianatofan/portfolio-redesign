"use client"

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import "./ai-composer.css"

/**
 * Microcomponent 02 — the animated conversation composer.
 *
 * Ported from the AI reply suggestion in the Tactile support messenger. A
 * support agent gets a drafted reply above their reply box: the frame glows,
 * shimmers while the draft is generated, then fades the finished text in. "Use"
 * drops it into the composer.
 *
 * Scope is deliberately the *animation*, not the whole messenger. The original
 * also carries reward attachments with typed quantity fields, file uploads with
 * image previews, starred templates, a device-backup picker, translation state
 * and an edit mode — all of which depend on the Tactile design system and nine
 * sibling modules that don't exist here, and none of which is the animated part.
 *
 * The WebGL mesh gradient is CSS here; see the note in ai-composer.css.
 */

const DRAFT = `Hi Marcus, sorry about the missing coins after yesterday's update.

I've checked your account and the purchase did go through, so I've re-granted the 1,200 coins plus a little extra for the trouble. They should appear next time you open the game.

Thanks for flagging it!`

/** How long the drafting state runs before the text lands. */
const DRAFT_MS = 2200

type Phase = "loading" | "ready"

function Glyph({ name, size = 18 }: { name: string; size?: number }) {
    return (
        <span
            aria-hidden
            className="material-symbols-outlined leading-none"
            style={{
                fontSize: size,
                fontVariationSettings: '"FILL" 0, "wght" 500, "GRAD" 0, "opsz" 20',
            }}
        >
            {name}
        </span>
    )
}

function Sparkle() {
    return (
        <span className="aic-sparkle">
            <span
                aria-hidden
                className="material-symbols-outlined leading-none"
                style={{
                    fontSize: 18,
                    fontVariationSettings: '"FILL" 1, "wght" 500, "GRAD" 0, "opsz" 20',
                }}
            >
                auto_awesome
            </span>
        </span>
    )
}

/** Staggered shimmer lines, mirroring the reference's rhythm. */
const SKELETON: Array<[string, string, string]> = [
    ["34%", "0", "0s"],
    ["98%", "18px", ".1s"],
    ["94%", "11px", ".2s"],
    ["88%", "11px", ".3s"],
    ["62%", "11px", ".4s"],
    ["20%", "22px", ".5s"],
    ["26%", "11px", ".6s"],
]

function Skeleton() {
    return (
        <div className="aic-pad">
            {SKELETON.map(([width, marginTop, delay]) => (
                <div
                    key={`${width}-${delay}`}
                    className="aic-skeleton"
                    style={{ width, marginTop, animationDelay: delay }}
                />
            ))}
        </div>
    )
}

export function AiComposer() {
    const reduceMotion = useReducedMotion()
    const [phase, setPhase] = useState<Phase>(reduceMotion ? "ready" : "loading")
    const [expanded, setExpanded] = useState(true)
    const [value, setValue] = useState("")
    const [inserted, setInserted] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const timer = useRef<number | undefined>(undefined)

    const regenerate = useCallback(() => {
        if (reduceMotion) {
            setPhase("ready")
            setExpanded(true)
            return
        }
        window.clearTimeout(timer.current)
        setPhase("loading")
        setExpanded(true)
        timer.current = window.setTimeout(() => setPhase("ready"), DRAFT_MS)
    }, [reduceMotion])

    // Run the drafting cycle on mount — the door mounts this fresh on every open,
    // so the animation plays each time rather than once ever.
    useEffect(() => {
        regenerate()
        return () => window.clearTimeout(timer.current)
    }, [regenerate])

    /*
     * Auto-grow the textarea to fit its content (e.g. when "Use" drops the draft
     * in), clamped before it takes over the panel. Clearing the inline height
     * when empty lets the CSS min-height govern instead of a stale measurement.
     */
    useLayoutEffect(() => {
        const el = textareaRef.current
        if (!el) return
        if (!value) {
            el.style.height = ""
            return
        }
        el.style.height = "auto"
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    }, [value])

    const use = () => {
        setValue(DRAFT)
        setInserted(true)
        window.setTimeout(() => setInserted(false), 500)
        textareaRef.current?.focus()
    }

    const loading = phase === "loading"
    const open = loading || expanded

    return (
        <div className="flex h-full w-full items-center justify-center px-6 py-5">
            <div
                className="aic w-full max-w-[560px]"
                data-open={open}
                data-loading={loading}
                data-expanded={!loading && expanded}
            >
                {open ? (
                    <div aria-hidden className="aic-glow-band" />
                ) : (
                    <div aria-hidden className="aic-glow-top" />
                )}

                <button
                    type="button"
                    className="aic-header aic-focus"
                    onClick={() => !loading && setExpanded((o) => !o)}
                    disabled={loading}
                    aria-expanded={!loading && expanded}
                >
                    <Sparkle />
                    <span className="aic-title">
                        {loading ? "Drafting response…" : "Suggested response"}
                    </span>
                    {!loading && (
                        <span className="aic-chevron">
                            <Glyph name="expand_more" />
                        </span>
                    )}
                </button>

                <div className="aic-body">
                    <div className="aic-body-inner">
                        {loading ? (
                            <Skeleton />
                        ) : (
                            <div className="aic-pad aic-draft">
                                <p className="aic-draft-text">{DRAFT}</p>
                                <div className="aic-actions" style={{ marginTop: 14 }}>
                                    <button
                                        type="button"
                                        className="aic-regen aic-focus"
                                        onClick={regenerate}
                                    >
                                        <Glyph name="autorenew" size={15} />
                                        REGENERATE
                                    </button>
                                    <button
                                        type="button"
                                        className="aic-action aic-focus"
                                        title="Dismiss"
                                        aria-label="Dismiss"
                                        onClick={() => setExpanded(false)}
                                    >
                                        <Glyph name="close" size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        className="aic-action aic-focus"
                                        title="Edit"
                                        aria-label="Edit"
                                        onClick={use}
                                    >
                                        <Glyph name="edit" size={15} />
                                    </button>
                                    <button
                                        type="button"
                                        className="aic-use aic-focus"
                                        onClick={use}
                                    >
                                        USE
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="aic-card-wrap">
                    <div aria-hidden className="aic-glow-input" />
                    <div className="aic-card">
                        <textarea
                            ref={textareaRef}
                            className={`aic-textarea ${inserted ? "aic-inserted" : ""}`}
                            placeholder="Send a message"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            aria-label="Reply"
                        />
                        <div className="aic-toolbar">
                            <span className="aic-icon-row">
                                <span className="aic-icon-btn">
                                    <Glyph name="attach_file" />
                                </span>
                                <span className="aic-icon-btn">
                                    <Glyph name="cloud_sync" />
                                </span>
                                <span className="aic-icon-btn">
                                    <Glyph name="quickreply" />
                                </span>
                            </span>
                            <button type="button" className="aic-send aic-focus">
                                SEND
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Inert teaser for the closed door: the glowing header strip, which is the
 * breathing part anyway. The full composer would need the whole panel, so the
 * closed cell shows the glow and the label rather than a shrunken copy.
 */
export function AiComposerPreview() {
    return (
        <div className="aic w-full max-w-[420px]" data-open="false" data-loading="true">
            <div aria-hidden className="aic-glow-top" />
            <div className="aic-header" style={{ cursor: "default", paddingBottom: 14 }}>
                <Sparkle />
                <span className="aic-title" style={{ fontSize: 13 }}>
                    Drafting response…
                </span>
            </div>
        </div>
    )
}
