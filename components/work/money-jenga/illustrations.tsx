"use client"

import type { CSSProperties, ReactNode } from "react"
import { MoneyJengaPaceChart } from "@/components/work/money-jenga-pace-chart"
import { PlayablePhone } from "@/components/work/playable-phone"
import "./money-jenga.css"

/*
 * The Money Jenga illustrations: the playable prototype as the hero, the tower
 * from a full month to a pile of bills, the cat's pace chart and how an Apple
 * Pay payment reaches the app. Drawn in SVG and HTML so they stay sharp and
 * can move.
 */

const panel = "rounded-[14px] bg-[#f4f4f4]"

/** The hero: the real prototype in its phone, on a pale panel. It loads when tapped. */
export function PhoneHero() {
  return (
    <div className="flex justify-center rounded-[24px] bg-[#f1f2f4] px-6 py-[clamp(32px,5vw,64px)]">
      <div className="w-[clamp(220px,24vw,300px)]">
        <PlayablePhone
          src="/money-jenga-prototype/index.html"
          facade="/images/money-jenga/play-facade.webp"
          label="Money Jenga prototype"
          eventName="money_jenga_play"
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* The tower                                                           */
/* ------------------------------------------------------------------ */

// Block columns and rows of the full tower, from the bottom up.
const COLS = [56, 72.5, 89]
const ROWS = [104, 94, 84, 74, 64, 54, 44, 34, 24]
// The blocks already pulled from the wobbling tower: [row, column].
const PULLED = new Set(["0-1", "1-0", "2-1", "3-0", "4-2", "6-1", "7-1"])
// The pile after it falls: [x, y, rotation].
const PILE: [number, number, number][] = [
  [34, 104, -8], [50, 106, 4], [68, 100, -20], [86, 105, 10], [104, 103, -4],
  [120, 106, 14], [58, 94, 30], [96, 95, -26], [76, 90, 8], [44, 96, -34],
]

function Block({ x, y, style, transform }: { x: number; y: number; style?: CSSProperties; transform?: string }) {
  return <rect x={x} y={y} width="15" height="9" rx="1.5" fill="#d6ebc9" stroke="#6aa84f" strokeWidth="1.2" style={style} transform={transform} />
}

function Ground() {
  return <line x1="30" y1="114" x2="130" y2="114" stroke="#c9c8d0" strokeWidth="1.5" strokeLinecap="round" />
}

function Arrow({ d, head }: { d: string; head: string }) {
  return (
    <svg width="48" height="24" viewBox="0 0 48 24" aria-hidden className="block w-[clamp(24px,5vw,48px)] flex-none overflow-visible">
      <path d={d} fill="none" stroke="#16151a" strokeWidth="1.9" strokeLinecap="round" />
      <path d={head} fill="none" stroke="#16151a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Step({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-3">
      <svg viewBox="0 0 160 120" aria-hidden className="block w-full max-w-[200px] overflow-visible">
        {children}
      </svg>
      <span className="text-center text-[15px] leading-[1.45] font-medium">{label}</span>
    </div>
  )
}

/** One sum a month, every purchase pulls a block, then the tower falls. */
export function TowerSteps() {
  return (
    <figure className="mj-anim m-0">
      <div className={`${panel} grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-[clamp(8px,2vw,24px)] p-[clamp(24px,4vw,48px)]`}>
        <Step label="One sum a month">
          <Ground />
          {ROWS.map((y) => COLS.map((x) => <Block key={`${x}-${y}`} x={x} y={y} />))}
        </Step>
        <Arrow d="M3 15 C13 8, 25 17, 41 10" head="M33 4.5 L41.5 10 L34.5 16.5" />
        <Step label="Every purchase pulls a block">
          <Ground />
          {/* The tower wobbles on its base while one more block slides out. */}
          <g style={{ transformBox: "view-box", transformOrigin: "80px 114px", animation: "mjWob 1.4s ease-in-out infinite" }}>
            {ROWS.map((y, r) =>
              COLS.map((x, c) =>
                PULLED.has(`${r}-${c}`) ? null : (
                  <Block key={`${x}-${y}`} x={x} y={y} style={r === 4 && c === 1 ? { animation: "mjPull 3s ease-in infinite" } : undefined} />
                )
              )
            )}
          </g>
        </Step>
        <Arrow d="M3 11 C14 17, 26 7, 41 13" head="M34 7 L41.5 13 L33.5 18.5" />
        <Step label="Timberrr">
          <Ground />
          {PILE.map(([x, y, r]) => (
            <Block key={`${x}-${y}`} x={x} y={y} transform={`rotate(${r} ${x + 7} ${y + 4})`} />
          ))}
        </Step>
      </div>
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/* The cat                                                             */
/* ------------------------------------------------------------------ */

/** The month's pace chart, with the cat's mood on the line. */
export function CatSection({ caption }: { caption: ReactNode }) {
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className={`${panel} px-[clamp(8px,3vw,40px)] py-[clamp(20px,3vw,40px)]`}>
        <MoneyJengaPaceChart />
      </div>
      <figcaption className="text-[13px] text-ink-meta">{caption}</figcaption>
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/* How a payment gets in                                               */
/* ------------------------------------------------------------------ */

const hops = [
  { t: "Apple Pay", s: "I pay" },
  { t: "iOS Shortcut", s: "Sends what and where" },
  { t: "Money Jenga", s: "Pulls a block", dark: true },
]

/** Apple Pay to an iOS Shortcut to the app, with a dot travelling along the wire. */
export function PaymentFlow() {
  return (
    <figure className="mj-anim m-0">
      <div className={`${panel} flex flex-col gap-5 p-[clamp(24px,4vw,48px)]`}>
        <div className="relative grid grid-cols-1 items-center gap-[clamp(16px,4vw,48px)] sm:grid-cols-3">
          <div aria-hidden className="absolute top-1/2 right-[12%] left-[12%] hidden h-0 border-t-2 border-dashed border-[#c9c8d0] sm:block">
            <span className="absolute -top-1.5 -ml-[5px] h-2.5 w-2.5 rounded-full bg-brand" style={{ animation: "mjPkt 2.6s linear infinite" }} />
          </div>
          {hops.map((h) => (
            <div
              key={h.t}
              className={`relative z-[1] flex min-w-0 flex-col gap-0.5 rounded-xl px-4 py-3.5 ${h.dark ? "bg-ink text-white" : "bg-white text-ink"}`}
            >
              <span className="text-[18px] leading-[1.3] font-medium">{h.t}</span>
              <span className={`text-[13px] leading-[1.45] ${h.dark ? "text-[#a3a1ad]" : "text-ink-meta"}`}>{h.s}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 text-[15px] leading-[1.45] text-ink-muted">
          <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden className="block">
            <rect x="1.5" y="7" width="11" height="8" rx="2" fill="none" stroke="#16151a" strokeWidth="1.4" />
            <path d="M4 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="#16151a" strokeWidth="1.4" />
          </svg>
          Bank details never leave the phone
        </div>
      </div>
    </figure>
  )
}
