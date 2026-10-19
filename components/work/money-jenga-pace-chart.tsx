"use client"

import { useState } from "react"

/*
 * An example month, not real spending: 10,000 kr over 31 days, with a splurge on
 * days 10 and 11. It runs the app's own rules (Support/Pace.swift and
 * Views/LivingRoom.swift):
 *
 *   danger = clamp(0.55 × share of budget spent + 2.2 × share spent ahead of pace)
 *
 * and the cat's calm states are thresholds on it. The cat lane under the chart
 * shows which state she's in each day.
 */
const BUDGET = 10_000
const DAYS = 31
const PURCHASES: Record<number, { amount: number; label: string }> = {
  2: { amount: 350, label: "Groceries" },
  4: { amount: 600, label: "Dinner out" },
  6: { amount: 300, label: "Groceries" },
  8: { amount: 450, label: "Taxi" },
  10: { amount: 2400, label: "New jacket" },
  11: { amount: 1500, label: "Concert tickets" },
  15: { amount: 300, label: "Groceries" },
  19: { amount: 250, label: "Coffee beans" },
  23: { amount: 600, label: "Groceries" },
  27: { amount: 500, label: "Haircut" },
  30: { amount: 300, label: "Groceries" },
}

export type CatState = "asleep" | "peek" | "watch" | "anxious" | "box"

export const CAT_STATES: Array<{ id: CatState; name: string; when: string; color: string }> = [
  { id: "asleep", name: "Asleep", when: "On pace. Curled up under the table.", color: "#efe6d2" },
  { id: "peek", name: "Peeking", when: "A little ahead. One eye open.", color: "#e6cf98" },
  { id: "watch", name: "Watching", when: "Spending fast. Sitting up, eyes on the tower.", color: "#e3a046" },
  { id: "anxious", name: "Anxious", when: "Close to toppling. Backed off to the end of the table.", color: "#c7372f" },
  { id: "box", name: "In the box", when: "The tower fell. Hiding until next month.", color: "#5a3a1a" },
]
const colorOf = (state: CatState) => CAT_STATES.find((s) => s.id === state)!.color
const nameOf = (state: CatState) => CAT_STATES.find((s) => s.id === state)!.name

const days = Array.from({ length: DAYS }, (_, i) => i + 1)
const spentByDay: number[] = []
days.reduce((total, day) => {
  const next = total + (PURCHASES[day]?.amount ?? 0)
  spentByDay.push(next)
  return next
}, 0)
const paceFor = (day: number) => Math.round((BUDGET * day) / DAYS)

const catFor = (day: number): CatState => {
  const spent = spentByDay[day - 1]
  if (spent >= BUDGET) return "box"
  const ahead = (spent - paceFor(day)) / BUDGET
  const danger = Math.max(0, Math.min(1, 0.55 * (spent / BUDGET) + 2.2 * Math.max(0, ahead)))
  return danger < 0.28 ? "asleep" : danger < 0.45 ? "peek" : danger < 0.72 ? "watch" : "anxious"
}
const catByDay = days.map(catFor)

// Drawing area: the chart, then the cat lane beneath it on the same x scale.
const W = 640
const M = { top: 16, right: 84, left: 48 }
const CHART_BOTTOM = 252
const LANE_TOP = 286
const LANE_H = 18
const H = LANE_TOP + LANE_H + 26
const step = (W - M.left - M.right) / (DAYS - 1)
const x = (day: number) => M.left + (day - 1) * step
const y = (kr: number) => M.top + (1 - kr / BUDGET) * (CHART_BOTTOM - M.top)
const kr = (n: number) => `${n.toLocaleString("en-US").replace(/,/g, ".")} kr`

const spentPath = days.map((d, i) => `${i === 0 ? "M" : "L"}${x(d)},${y(spentByDay[i])}`).join(" ")

// One band per run of days spent ahead of pace, between the pace line and spending.
const aheadBands: string[] = []
let run: number[] = []
days.forEach((d, i) => {
  if (spentByDay[i] > paceFor(d)) run.push(d)
  if ((spentByDay[i] <= paceFor(d) || d === DAYS) && run.length) {
    const top = run.map((rd) => `${x(rd)},${y(spentByDay[rd - 1])}`)
    const bottom = [...run].reverse().map((rd) => `${x(rd)},${y(paceFor(rd))}`)
    aheadBands.push(`M${[...top, ...bottom].join(" L")} Z`)
    run = []
  }
})

// Consecutive days in the same cat state, drawn as one lane segment each.
const catRuns: Array<{ state: CatState; from: number; to: number }> = []
catByDay.forEach((state, i) => {
  const last = catRuns[catRuns.length - 1]
  if (last && last.state === state) last.to = i + 1
  else catRuns.push({ state, from: i + 1, to: i + 1 })
})

const yTicks = [0, 2500, 5000, 7500, 10000]
const xTicks = [1, 10, 20, 31]

export function MoneyJengaPaceChart() {
  const [hoverDay, setHoverDay] = useState<number | null>(null)
  const hovered =
    hoverDay === null
      ? null
      : {
          day: hoverDay,
          spent: spentByDay[hoverDay - 1],
          pace: paceFor(hoverDay),
          purchase: PURCHASES[hoverDay],
          cat: catByDay[hoverDay - 1],
        }

  const onMove = (event: React.PointerEvent<SVGRectElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    setHoverDay(Math.min(DAYS, Math.max(1, Math.round(ratio * (DAYS - 1)) + 1)))
  }

  return (
    <figure>
      <div className="relative rounded-lg bg-[#faf6ec] p-4 md:p-6">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-labelledby="pace-chart-title">
          <title id="pace-chart-title">
            Example month: money spent against an even daily pace for a 10,000 kr budget, with the cat&apos;s state each
            day. A jacket on day 10 and concert tickets on day 11 put spending well ahead of pace, so the cat goes from
            asleep to anxious, then calms down to watching and peeking as the month catches up. The month ends at 7,550
            kr, so the tower survives.
          </title>

          {yTicks.map((t) => (
            <g key={t}>
              <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} stroke="#e7dcc4" strokeWidth={1} />
              <text x={M.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill="var(--text-tertiary)">
                {t === 0 ? "0" : `${t / 1000}k`}
              </text>
            </g>
          ))}

          {aheadBands.map((band) => (
            <path key={band} d={band} fill="#c7372f" fillOpacity={0.16} />
          ))}

          <line
            x1={x(1)}
            y1={y(paceFor(1))}
            x2={x(DAYS)}
            y2={y(paceFor(DAYS))}
            stroke="var(--text-tertiary)"
            strokeWidth={1.5}
            strokeDasharray="5 5"
          />
          <path d={spentPath} fill="none" stroke="#1c1611" strokeWidth={2} strokeLinejoin="round" />

          {/* Direct labels instead of a legend: two lines, each named at its end. */}
          <text x={x(DAYS) + 8} y={y(paceFor(DAYS))} dy="0.32em" fontSize={12} fill="var(--text-secondary)">
            Even pace
          </text>
          <text x={x(DAYS) + 8} y={y(spentByDay[DAYS - 1])} dy="0.32em" fontSize={12} fontWeight={500} fill="#1c1611">
            Spent
          </text>

          <circle cx={x(11)} cy={y(spentByDay[10])} r={4} fill="#1c1611" stroke="#faf6ec" strokeWidth={2} />
          <text x={x(11) - 8} y={y(spentByDay[10]) - 12} textAnchor="end" fontSize={12} fill="var(--text-secondary)">
            Jacket, then concert tickets
          </text>

          {/* Cat lane */}
          <text x={M.left - 8} y={LANE_TOP + LANE_H / 2} dy="0.32em" textAnchor="end" fontSize={11} fill="var(--text-tertiary)">
            Cat
          </text>
          {catRuns.map((r) => {
            const x0 = r.from === 1 ? x(1) : x(r.from) - step / 2
            const x1 = r.to === DAYS ? x(DAYS) : x(r.to) + step / 2
            return (
              <g key={`${r.state}-${r.from}`}>
                <rect x={x0 + 1} y={LANE_TOP} width={Math.max(0, x1 - x0 - 2)} height={LANE_H} rx={4} fill={colorOf(r.state)} />
                {x1 - x0 > 52 && (
                  <text x={(x0 + x1) / 2} y={LANE_TOP - 7} textAnchor="middle" fontSize={11} fill="var(--text-secondary)">
                    {nameOf(r.state)}
                  </text>
                )}
              </g>
            )
          })}

          {xTicks.map((d) => (
            <text key={d} x={x(d)} y={H - 6} textAnchor="middle" fontSize={11} fill="var(--text-tertiary)">
              {`Day ${d}`}
            </text>
          ))}

          {hovered && (
            <g pointerEvents="none">
              <line x1={x(hovered.day)} x2={x(hovered.day)} y1={M.top} y2={LANE_TOP + LANE_H} stroke="var(--text-tertiary)" strokeWidth={1} />
              <circle cx={x(hovered.day)} cy={y(hovered.spent)} r={4} fill="#1c1611" stroke="#faf6ec" strokeWidth={2} />
            </g>
          )}

          <rect
            x={M.left}
            y={M.top}
            width={W - M.left - M.right}
            height={LANE_TOP + LANE_H - M.top}
            fill="transparent"
            onPointerMove={onMove}
            onPointerLeave={() => setHoverDay(null)}
          />
        </svg>

        {hovered && (
          <div
            className="pointer-events-none absolute top-4 w-[176px] rounded-md bg-white px-3 py-2 text-xs shadow-sm ring-1 ring-black/5 tabular-nums"
            style={{ left: `clamp(16px, calc(${(x(hovered.day) / W) * 100}% - 88px), calc(100% - 192px))` }}
          >
            <p className="font-medium text-foreground">{`Day ${hovered.day}`}</p>
            {hovered.purchase && (
              <p className="text-[var(--text-secondary)]">{`${hovered.purchase.label}, ${kr(hovered.purchase.amount)}`}</p>
            )}
            <p className="text-[var(--text-secondary)]">{`Spent ${kr(hovered.spent)}`}</p>
            <p className="text-[var(--text-secondary)]">{`Pace ${kr(hovered.pace)}`}</p>
            <p className="mt-1 flex items-center gap-1.5 font-medium text-foreground">
              <span className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-black/10" style={{ background: colorOf(hovered.cat) }} />
              {`Cat: ${nameOf(hovered.cat)}`}
            </p>
          </div>
        )}
      </div>

      {/* The cat's states, documented: the same colours as the lane above. */}
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {CAT_STATES.map((state) => (
          <li key={state.id} className="flex gap-3 lg:flex-col lg:gap-2">
            <span className="mt-1 h-3 w-8 shrink-0 rounded-full ring-1 ring-black/10" style={{ background: state.color }} />
            <div>
              <p className="text-sm font-medium text-foreground">{state.name}</p>
              <p className="mt-0.5 text-sm leading-snug text-[var(--text-secondary)]">{state.when}</p>
            </div>
          </li>
        ))}
      </ul>
      <figcaption className="mt-4 text-sm text-[var(--text-tertiary)]">
        An example month, run through the app&apos;s own pace rules. Shaded days are ahead of pace.
      </figcaption>
    </figure>
  )
}
