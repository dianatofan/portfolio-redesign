"use client"

import type { CSSProperties, ReactNode } from "react"
import "./boeuf.css"

/*
 * The Boeuf Salad Decorator illustrations: the three steps from mound to
 * card, the Kitsch-o-meter and the 1986 food inspection. Drawn in SVG and HTML so they stay sharp and can move.
 */

const panel = "rounded-[14px] bg-[#f4f4f4]"

const pop = (delay: number, duration = 6, timing = "ease-out"): CSSProperties => ({
  animation: `bsPop ${duration}s ${timing} infinite`,
  animationDelay: `${delay}s`,
})

/** The plate and the mound of salad, before anything goes on it. */
function Mound() {
  return (
    <>
      <ellipse cx="80" cy="96" rx="68" ry="14" fill="#fff" stroke="#dcdde2" />
      <path d="M26 92 Q80 8 134 92 Z" fill="#efe7cf" />
    </>
  )
}

// Tomato, carrots, peas and olives: [cx, cy, r, colour].
const toppings: [number, number, number, string][] = [
  [80, 62, 6.5, "#c8372d"],
  [62, 70, 6.5, "#e8833a"],
  [98, 70, 6.5, "#e8833a"],
  [71, 82, 5, "#6aa84f"],
  [89, 82, 5, "#6aa84f"],
  [52, 84, 5, "#16151a"],
  [108, 84, 5, "#16151a"],
  [80, 77, 4.5, "#6aa84f"],
]

// The card's glitter: [cx, cy, r, colour, delay].
const glitter: [number, number, number, string, number][] = [
  [40, 41.6, 1.16, "#7b5cff", 0.19], [119.4, 66.4, 0.91, "#7b5cff", 1.88], [96.4, 29.5, 0.86, "#7b5cff", 1.61],
  [44.4, 64.3, 0.79, "#7b5cff", 0.12], [125.7, 93.8, 1.09, "#7b5cff", 2.29], [47.7, 54.2, 1.34, "#c9a227", 0.67],
  [45.7, 95, 0.86, "#7b5cff", 1.31], [108.4, 49.3, 0.69, "#7b5cff", 2.22], [52.8, 87.7, 0.86, "#7b5cff", 1.45],
  [95.9, 33.8, 1.1, "#7b5cff", 0.22], [33, 53.7, 1.31, "#c9a227", 2.29], [115.2, 56.5, 0.89, "#7b5cff", 0.57],
  [105.3, 33.5, 1.44, "#7b5cff", 2.06], [128.7, 90.7, 1.42, "#c9a227", 1.54], [85.7, 25.7, 0.99, "#7b5cff", 0.52],
  [127.5, 24.5, 1.24, "#7b5cff", 1.06], [37.3, 95.3, 1.56, "#7b5cff", 1.41], [76.8, 33, 1.59, "#c9a227", 0.63],
  [30.5, 35.1, 1.37, "#c9a227", 1.58], [118.4, 40.5, 0.79, "#c9a227", 0.09], [36.5, 25.5, 1.51, "#c9a227", 2.02],
  [43.1, 59.6, 0.91, "#7b5cff", 1.17], [34.7, 49.6, 0.93, "#7b5cff", 1.9], [42.2, 35.9, 1.29, "#7b5cff", 0.21],
  [70, 31.9, 1.06, "#7b5cff", 0.02],
]

const sparkles: [string, number][] = [
  ["M38 28L39.8 32.2L44 34L39.8 35.8L38 40L36.2 35.8L32 34L36.2 32.2Z", 0.3],
  ["M122 31L123.5 34.5L127 36L123.5 37.5L122 41L120.5 37.5L117 36L120.5 34.5Z", 0.7],
  ["M124 74.5L125.05 76.95L127.5 78L125.05 79.05L124 81.5L122.95 79.05L120.5 78L122.95 76.95Z", 1.1],
  ["M36 76.5L37.05 78.95L39.5 80L37.05 81.05L36 83.5L34.95 81.05L32.5 80L34.95 78.95Z", 1.4],
]

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
      <svg viewBox="0 0 160 120" aria-hidden className="block w-full max-w-[200px]">
        {children}
      </svg>
      <span className="text-center text-[15px] leading-[1.45] font-medium">{label}</span>
    </div>
  )
}

/** Start a salad, decorate it, send it to Mom as a glittery card. */
export function SaladSteps() {
  return (
    <figure className="bs-anim m-0">
      <div
        className={`${panel} grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-[clamp(8px,2vw,24px)] p-[clamp(24px,4vw,48px)]`}
      >
        <Step label="Start a salad">
          <Mound />
        </Step>
        <Arrow d="M3 15 C13 8, 25 17, 41 10" head="M33 4.5 L41.5 10 L34.5 16.5" />
        <Step label="Decorate it">
          <Mound />
          {toppings.map(([cx, cy, r, fill], i) => (
            <circle key={i} className="bs-pop" cx={cx} cy={cy} r={r} fill={fill} style={pop(0.2 + i * 0.15)} />
          ))}
        </Step>
        <Arrow d="M3 11 C14 17, 26 7, 41 13" head="M34 7 L41.5 13 L33.5 18.5" />
        <Step label="Send it to Mom">
          <defs>
            <clipPath id="bsCardClip">
              <rect x="26" y="22" width="108" height="76" rx="3" />
            </clipPath>
            <linearGradient id="bsShineG" x1="0" x2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset=".5" stopColor="#fff" stopOpacity=".75" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g transform="rotate(-5 80 60)">
            <rect x="18" y="14" width="124" height="92" rx="6" fill="#fff" stroke="#dcdde2" />
            <rect x="26" y="22" width="108" height="76" rx="3" fill="#4f35b8" opacity=".08" />
            <rect x="26" y="22" width="108" height="76" rx="3" fill="none" stroke="#c9a227" strokeWidth="1.2" strokeDasharray="1.5 2.5" opacity=".9" />
            {glitter.map(([cx, cy, r, fill, delay], i) => (
              <circle key={i} className="bs-pop" cx={cx} cy={cy} r={r} fill={fill} style={pop(delay, 2.4, "ease-in-out")} />
            ))}
            <g transform="translate(38.4 18.3) scale(.52)">
              <Mound />
              {toppings.map(([cx, cy, r, fill], i) => (
                <circle key={i} cx={cx} cy={cy} r={r} fill={fill} />
              ))}
            </g>
            <g clipPath="url(#bsCardClip)">
              <g transform="skewX(-20)">
                <rect className="bs-shine" x="0" y="10" width="40" height="100" fill="url(#bsShineG)" style={{ animation: "bsShine 3.6s ease-in-out infinite" }} />
              </g>
            </g>
            <text x="80" y="93" textAnchor="middle" transform="rotate(-4 80 90)" fontFamily="Caveat,'Bradley Hand',cursive" fontSize="12" fontWeight="600" fill="#4f35b8">
              Pentru Mama
            </text>
            {sparkles.map(([d, delay]) => (
              <path key={d} className="bs-pop" d={d} fill="#4f35b8" style={pop(delay)} />
            ))}
          </g>
        </Step>
      </div>
    </figure>
  )
}

/** A scale from one end to the other, with a knob where this salad lands. */
export function KitschScale({ caption }: { caption: ReactNode }) {
  return (
    <figure className="m-0 flex flex-col gap-3">
      <div className={`${panel} flex flex-col gap-[18px] px-[clamp(20px,5vw,64px)] py-[clamp(28px,5vw,56px)]`}>
        <span className="text-[13px] text-ink-meta">The Kitsch-o-meter</span>
        <div className="relative h-2.5 rounded-full bg-[linear-gradient(90deg,#dcdde2,#4f35b8)]">
          <span className="absolute top-1/2 left-[82%] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink bg-white shadow-[0_2px_6px_rgba(22,21,26,.2)]" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-[15px] leading-[1.45]">
          <span className="text-ink-muted">German-tidy</span>
          <span className="text-right font-medium">Wedding in Botoșani</span>
        </div>
      </div>
      <figcaption className="text-[13px] text-ink-meta">{caption}</figcaption>
    </figure>
  )
}

/** The 1986 food inspection, word for word from the app, stamped. */
export function InspectionBulletin({ rules }: { rules: string[] }) {
  return (
    <figure className="m-0">
      <div className={`${panel} flex justify-center p-[clamp(24px,4vw,48px)]`}>
        <div className="relative w-full max-w-[520px] rotate-[-1deg] border border-[#d8d6cf] bg-[#fbfaf6] px-7 py-[26px] font-mono shadow-[0_14px_30px_-20px_rgba(22,21,26,.5)]">
          <div className="border-b border-dashed border-[#9a9890] pb-3 text-center text-[13px] leading-[1.45] tracking-[.12em]">FOOD INSPECTION BULLETIN</div>
          {rules.map((rule) => (
            <div key={rule} className="grid grid-cols-[22px_1fr] gap-2.5 border-b border-dashed border-[#d8d6cf] py-2.5 text-[14px] leading-[1.45] text-[#2c2b31]">
              <span aria-hidden className="mt-0.5 h-3.5 w-3.5 border-[1.5px] border-[#2c2b31]" />
              <span>{rule}</span>
            </div>
          ))}
          <span className="absolute right-[18px] bottom-4 rotate-[-9deg] rounded border-[2.5px] border-[#b3261e] px-3 py-1.5 text-[15px] leading-[1.2] font-bold tracking-[.1em] text-[#b3261e]">
            APPROVED
          </span>
        </div>
      </div>
    </figure>
  )
}

