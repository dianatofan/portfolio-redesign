"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"
import Image from "next/image"
import "./liveops.css"

/*
 * The Key tradeoffs table: decision, from, to. Each row opens a dialog with the
 * story and the before and after. Built on <dialog>, so Escape, focus and the
 * backdrop come from the browser.
 */

export type TradeoffMedia = {
  /** Starts with "Before:" or "After:"; anything else reads as before and after. */
  caption: string
  alt: string
  video?: string
  image?: string
  width?: number
  height?: number
}

export type Tradeoff = { decision: string; from: string; to: string; note: string; media: TradeoffMedia[] }

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

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (row && !dialog.open) {
      dialog.showModal()
      document.documentElement.style.overflow = "hidden"
    }
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [row])

  const close = () => {
    ref.current?.close()
  }

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
        onClick={(e) => {
          // A click on the backdrop lands on the dialog itself, outside its box.
          const box = e.currentTarget.getBoundingClientRect()
          const inside = e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom
          if (e.target === e.currentTarget && !inside) close()
        }}
        className="lo-anim m-auto max-h-[calc(100%-64px)] w-[min(1100px,calc(100%-32px))] max-w-none overflow-auto rounded-[20px] bg-white p-5 text-ink backdrop:bg-[rgba(22,21,26,.55)] min-[720px]:p-8 open:[animation:loPopIn_.4s_cubic-bezier(.2,.9,.3,1.1)_both] open:backdrop:[animation:loFadeIn_.25s_ease-out_both]"
      >
        {row && (
          <div className="flex flex-col gap-5">
            <div className="flex items-baseline justify-between gap-6">
              <h3 className="m-0 text-[clamp(24px,2.4vw,32px)] leading-[1.15] font-medium tracking-[-0.025em]">{row.decision}</h3>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="h-8 w-8 flex-none cursor-pointer rounded-full border border-hairline bg-white text-[15px] text-ink transition-colors hover:border-ink"
              >
                ✕
              </button>
            </div>
            <p className="m-0 max-w-[640px] text-[18px] leading-[1.6] text-[#3d3c44] text-pretty">{row.note}</p>
            <div
              className="grid grid-cols-1 items-start gap-6 min-[720px]:[grid-template-columns:var(--cols)]"
              style={{ "--cols": `repeat(${row.media.length},minmax(0,1fr))` } as CSSProperties}
            >
              {row.media.map((m) => {
                const l = label(m.caption)
                return (
                  <figure key={m.caption} className="m-0 flex flex-col gap-2.5 [animation:loUpIn_.45s_cubic-bezier(.2,0,0,1)_.12s_both]">
                    <span className={`self-start rounded-full px-2.5 py-1 text-[13px] leading-[1.45] font-medium ${l.tone}`}>{l.text}</span>
                    <div className={`flex justify-center overflow-hidden rounded-[14px] bg-[#f1f2f4] outline outline-offset-2 ${l.ring}`}>
                      {m.video ? (
                        <video src={m.video} autoPlay loop muted playsInline aria-label={m.alt} className="block max-h-[60vh] max-w-full object-contain" />
                      ) : (
                        <Image
                          src={m.image!}
                          alt={m.alt}
                          width={m.width}
                          height={m.height}
                          className="block h-auto max-h-[60vh] w-auto max-w-full object-contain"
                          sizes="(min-width: 1140px) 1040px, 100vw"
                        />
                      )}
                    </div>
                    <figcaption className="text-[13px] leading-[1.45] text-ink-meta">{m.caption.replace(/^(before|after):\s*(.)/i, (_, _k, c: string) => c.toUpperCase())}</figcaption>
                  </figure>
                )
              })}
            </div>
          </div>
        )}
      </dialog>
    </div>
  )
}
