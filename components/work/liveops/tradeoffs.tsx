"use client"

import { useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import Image from "next/image"
import { CursorContext } from "@/context/CursorContext"
import "./liveops.css"
import { figCaption } from "@/components/work/caption"

/*
 * The Key tradeoffs table: decision, from, to. Each row opens a dialog with the
 * story and the before and after. Built on <dialog>, so Escape, focus and the
 * backdrop come from the browser. Inside, the tradeoffs read as a gallery:
 * segment tabs, ← / → (buttons and keys) that wrap around, and "n of 4".
 */

export type TradeoffMedia = {
  /** Starts with "Before:" or "After:"; anything else reads as before and after. */
  caption: string
  alt: string
  video?: string
  image?: string
  width?: number
  height?: number
  /** The frame behind the media, matched to its own background so no band shows. */
  bg?: string
  /** "cover" fills the frame (zoomed in, edges trimmed) instead of fitting inside it. */
  fit?: "contain" | "cover"
  /** The media's own shape, e.g. "1 / 1"; images without it take their width and height. */
  aspect?: string
}

/** `figure` is a drawn before and after, shown under the note in place of (or above) the media. */
export type Tradeoff = { decision: string; from: string; to: string; note: string; media: TradeoffMedia[]; figure?: ReactNode }

const cols = "grid grid-cols-[1fr_1fr_1.4fr_80px] gap-6 max-[719px]:grid-cols-[1fr_auto] max-[719px]:gap-x-4 max-[719px]:gap-y-1"

function label(caption: string) {
  if (/^before:/i.test(caption)) return { text: "Before", tone: "bg-hairline text-[#3d3c44]", ring: "outline-transparent" }
  if (/^after:/i.test(caption)) return { text: "After · shipped", tone: "bg-brand text-white", ring: "outline-2 outline-brand" }
  return { text: "Before → After", tone: "bg-brand text-white", ring: "outline-2 outline-brand" }
}

export function TradeoffTable({ rows }: { rows: Tradeoff[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const ref = useRef<HTMLDialogElement>(null)
  const row = open === null ? null : rows[open]
  const { setDotHidden } = useContext(CursorContext)
  const isOpen = open !== null

  // The modal sits in the top layer, above the site's glass cursor, so while it's
  // open the system cursor comes back and the glass one steps aside.
  useEffect(() => {
    if (!isOpen) return
    document.body.classList.add("allow-native-cursor")
    setDotHidden(true)
    return () => {
      document.body.classList.remove("allow-native-cursor")
      setDotHidden(false)
    }
  }, [isOpen, setDotHidden])

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (row && !dialog.open) {
      dialog.showModal()
      // Start on ✕ rather than the first segment tab.
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus()
      document.documentElement.style.overflow = "hidden"
    }
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [row])

  const close = () => {
    ref.current?.close()
  }

  // Wraps around, as in the design.
  const step = (n: number) => setOpen((i) => (i === null ? i : (i + n + rows.length) % rows.length))

  const arrow = (n: -1 | 1) => (
    <button
      type="button"
      onClick={() => step(n)}
      aria-label={n < 0 ? "Previous tradeoff" : "Next tradeoff"}
      className="grid h-8 w-8 flex-none cursor-pointer place-items-center rounded-full border border-hairline bg-white text-[15px] text-ink transition-colors hover:border-ink"
    >
      {n < 0 ? "←" : "→"}
    </button>
  )

  return (
    <div className="col-span-12 flex flex-col">
      <div className={`${cols} border-b border-ink pb-3 text-[13px] leading-[1.45] text-ink-meta`}>
        <span>Decision</span>
        <span className="max-[719px]:hidden">From</span>
        <span className="max-[719px]:hidden">To</span>
        <span />
      </div>
      {rows.map((r, i) => (
        <button
          key={r.decision}
          type="button"
          onClick={() => setOpen(i)}
          aria-haspopup="dialog"
          className={`${cols} w-full cursor-pointer items-baseline border-b border-hairline py-[18px] text-left text-ink transition-colors hover:bg-[#f6f7f8]`}
        >
          <span className="text-[18px] leading-[1.45] font-medium">{r.decision}</span>
          <span className="text-[18px] leading-[1.45] text-ink-meta line-through decoration-[#c9c8d0] max-[719px]:col-start-1">
            {r.from}
          </span>
          <span className="text-[18px] leading-[1.45] max-[719px]:col-start-1">{r.to}</span>
          <span className="pr-2 text-right text-[13px] leading-[1.45] text-brand max-[719px]:col-start-2 max-[719px]:row-start-1">
            View →
          </span>
        </button>
      ))}

      <dialog
        ref={ref}
        aria-label={row?.decision}
        onClose={() => setOpen(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1)
          else if (e.key === "ArrowLeft") step(-1)
          else return
          e.preventDefault()
        }}
        onClick={(e) => {
          // A click on the backdrop lands on the dialog itself, outside its box.
          const box = e.currentTarget.getBoundingClientRect()
          const inside = e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom
          if (e.target === e.currentTarget && !inside) close()
        }}
        className="lo-anim m-auto max-h-[calc(100%-64px)] w-[min(1100px,calc(100%-32px))] max-w-none overflow-auto rounded-[20px] bg-white p-5 text-ink backdrop:bg-[rgba(22,21,26,.55)] min-[720px]:p-8 open:[animation:loPopIn_.4s_cubic-bezier(.2,.9,.3,1.1)_both] open:backdrop:[animation:loFadeIn_.25s_ease-out_both]"
      >
        {row && open !== null && (
          <div className="flex flex-col gap-5">
            {/* Segment tabs: one per tradeoff, the current one in ink. */}
            <div
              role="tablist"
              aria-label="Tradeoffs"
              className="mb-2 grid gap-2"
              style={{ gridTemplateColumns: `repeat(${rows.length},minmax(0,1fr))` }}
            >
              {rows.map((r, i) => {
                const on = i === open
                return (
                  <button
                    key={r.decision}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setOpen(i)}
                    className="flex cursor-pointer flex-col gap-2 border-none bg-transparent p-0 text-left"
                  >
                    <span className={`block h-[3px] w-full rounded-full transition-colors duration-[250ms] ${on ? "bg-ink" : "bg-hairline"}`} />
                    <span className={`truncate text-[13px] leading-[1.45] transition-colors duration-[250ms] ${on ? "text-ink" : "text-ink-meta"}`}>
                      Tradeoff {i + 1}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="flex items-baseline justify-between gap-6">
              <h3 key={open} className="m-0 text-[24px] leading-[1.15] font-medium tracking-[-0.025em] [animation:loUpIn_.3s_cubic-bezier(.2,0,0,1)_both]">
                {row.decision}
              </h3>
              <div className="flex flex-none items-center gap-2">
                {arrow(-1)}
                <span className="px-1 text-[13px] leading-[1.45] text-ink-meta tabular-nums">
                  {open + 1} of {rows.length}
                </span>
                {arrow(1)}
                <button
                  type="button"
                  data-autofocus
                  onClick={close}
                  aria-label="Close"
                  className="ml-2 h-8 w-8 flex-none cursor-pointer rounded-full border border-hairline bg-white text-[15px] text-ink transition-colors hover:border-ink"
                >
                  ✕
                </button>
              </div>
            </div>
            <p key={`n${open}`} className="m-0 max-w-[640px] text-[18px] leading-[1.6] text-[#3d3c44] text-pretty [animation:loUpIn_.35s_cubic-bezier(.2,0,0,1)_.04s_both]">{row.note}</p>
            {row.figure && (
              <div key={`f${open}`} className="[animation:loUpIn_.45s_cubic-bezier(.2,0,0,1)_.12s_both]">
                {row.figure}
              </div>
            )}
            {row.media.length > 0 && (
              <div
                key={`m${open}`}
                className="grid grid-cols-1 items-start gap-6 min-[720px]:[grid-template-columns:var(--cols)]"
                style={{ "--cols": `repeat(${row.media.length},minmax(0,1fr))` } as CSSProperties}
              >
                {row.media.map((m) => {
                  const l = label(m.caption)
                  // Every frame takes its media's own shape (set, or from an image's size),
                  // so its height follows the content; it's capped by height, not width.
                  const shape = m.aspect ?? (m.width && m.height ? `${m.width} / ${m.height}` : undefined)
                  const [sw, sh] = (shape ?? "").split("/").map((n) => parseFloat(n))
                  const ratio = sw && sh ? sw / sh : undefined
                  return (
                    <figure key={m.caption} className="m-0 flex flex-col gap-2.5 [animation:loUpIn_.45s_cubic-bezier(.2,0,0,1)_.12s_both]">
                      <span className={`self-start rounded-full px-2.5 py-1 text-[13px] leading-[1.45] font-medium ${l.tone}`}>{l.text}</span>
                      <div
                        className={`relative overflow-hidden rounded-[14px] outline outline-offset-2 ${l.ring} ${
                          ratio ? "mx-auto w-full" : "h-[min(60vh,520px)] w-full"
                        }`}
                        style={{
                          background: m.bg ?? "#f1f2f4",
                          aspectRatio: shape,
                          maxWidth: ratio ? `calc(min(60vh, 520px) * ${ratio.toFixed(4)})` : undefined,
                        }}
                      >
                        {m.video ? (
                          <video
                            src={m.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                            aria-label={m.alt}
                            className={`absolute inset-0 block h-full w-full ${m.fit === "cover" ? "object-cover object-top" : "object-contain"}`}
                          />
                        ) : (
                          <Image src={m.image!} alt={m.alt} fill className={m.fit === "cover" ? "object-cover object-top" : "object-contain"} sizes="(min-width: 1140px) 1040px, 100vw" />
                        )}
                      </div>
                      <figcaption className={figCaption}>{m.caption.replace(/^(before|after):\s*(.)/i, (_, _k, c: string) => c.toUpperCase())}</figcaption>
                    </figure>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </dialog>
    </div>
  )
}
