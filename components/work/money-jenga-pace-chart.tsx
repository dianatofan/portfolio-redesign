"use client"

import { useState } from "react"

/*
 * An example month, not real spending: 10,000 kr over 31 days, with one splurge on
 * day 10. It shows the rule the app runs on (Support/Pace.swift): a day is on pace
 * while total spending stays under that day's even share of the budget. Above the
 * line, the tower shakes harder and the cat wakes up.
 */
const BUDGET = 10_000
const DAYS = 31
const PURCHASES: Record<number, { amount: number; label?: string }> = {
  2: { amount: 350 },
  4: { amount: 600 },
  6: { amount: 300 },
  8: { amount: 450 },
  10: { amount: 2400, label: "New jacket" },
  12: { amount: 500 },
  15: { amount: 300 },
  18: { amount: 250 },
  21: { amount: 900 },
  24: { amount: 600 },
  27: { amount: 800 },
  30: { amount: 400 },
}

const days = Array.from({ length: DAYS }, (_, i) => i + 1)
const spentByDay: number[] = []
days.reduce((total, day) => {
  const next = total + (PURCHASES[day]?.amount ?? 0)
  spentByDay.push(next)
  return next
}, 0)
const paceFor = (day: number) => Math.round((BUDGET * day) / DAYS)

// Drawing area
const W = 640
const H = 300
const M = { top: 16, right: 84, bottom: 32, left: 48 }
const x = (day: number) => M.left + ((day - 1) / (DAYS - 1)) * (W - M.left - M.right)
const y = (kr: number) => M.top + (1 - kr / BUDGET) * (H - M.top - M.bottom)
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

const yTicks = [0, 2500, 5000, 7500, 10000]
const xTicks = [1, 10, 20, 31]

export function MoneyJengaPaceChart() {
  const [hoverDay, setHoverDay] = useState<number | null>(null)
  const hovered = hoverDay === null ? null : { day: hoverDay, spent: spentByDay[hoverDay - 1], pace: paceFor(hoverDay) }

  const onMove = (event: React.PointerEvent<SVGRectElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    setHoverDay(Math.min(DAYS, Math.max(1, Math.round(ratio * (DAYS - 1)) + 1)))
  }

  return (
    <figure>
      <div className="relative rounded-lg bg-background p-4 md:p-6">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-labelledby="pace-chart-title">
          <title id="pace-chart-title">
            Example month: money spent against an even daily pace for a 10,000 kr budget. A 2,400 kr jacket on day
            10 puts spending ahead of pace until day 18. The month ends at 7,850 kr, so the tower survives.
          </title>

          {yTicks.map((t) => (
            <g key={t}>
              <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth={1} />
              <text x={M.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill="var(--text-tertiary)">
                {t === 0 ? "0" : `${t / 1000}k`}
              </text>
            </g>
          ))}
          {xTicks.map((d) => (
            <text key={d} x={x(d)} y={H - 10} textAnchor="middle" fontSize={11} fill="var(--text-tertiary)">
              {`Day ${d}`}
            </text>
          ))}

          {aheadBands.map((band) => (
            <path key={band} d={band} fill="#B19EEF" fillOpacity={0.35} />
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
          <path d={spentPath} fill="none" stroke="var(--foreground)" strokeWidth={2} strokeLinejoin="round" />

          {/* Direct labels instead of a legend: two lines, each named at its end. */}
          <text x={x(DAYS) + 8} y={y(paceFor(DAYS))} dy="0.32em" fontSize={12} fill="var(--text-secondary)">
            Even pace
          </text>
          <text x={x(DAYS) + 8} y={y(spentByDay[DAYS - 1])} dy="0.32em" fontSize={12} fontWeight={500} fill="var(--foreground)">
            Spent
          </text>

          <circle cx={x(10)} cy={y(spentByDay[9])} r={4} fill="var(--foreground)" stroke="var(--background)" strokeWidth={2} />
          <text x={x(10) - 8} y={y(spentByDay[9]) - 12} textAnchor="end" fontSize={12} fill="var(--text-secondary)">
            New jacket, 2.400 kr
          </text>

          {hovered && (
            <g pointerEvents="none">
              <line x1={x(hovered.day)} x2={x(hovered.day)} y1={M.top} y2={H - M.bottom} stroke="var(--text-tertiary)" strokeWidth={1} />
              <circle cx={x(hovered.day)} cy={y(hovered.spent)} r={4} fill="var(--foreground)" stroke="var(--background)" strokeWidth={2} />
            </g>
          )}

          <rect
            x={M.left}
            y={M.top}
            width={W - M.left - M.right}
            height={H - M.top - M.bottom}
            fill="transparent"
            onPointerMove={onMove}
            onPointerLeave={() => setHoverDay(null)}
          />
        </svg>

        {hovered && (
          <div
            className="pointer-events-none absolute top-4 rounded-md bg-card px-3 py-2 text-xs shadow-sm ring-1 ring-black/5 tabular-nums"
            style={{ left: `clamp(16px, calc(${(x(hovered.day) / W) * 100}% - 70px), calc(100% - 156px))` }}
          >
            <p className="font-medium text-foreground">{`Day ${hovered.day}`}</p>
            <p className="text-[var(--text-secondary)]">{`Spent ${kr(hovered.spent)}`}</p>
            <p className="text-[var(--text-secondary)]">{`Pace ${kr(hovered.pace)}`}</p>
            <p className="mt-1 font-medium text-foreground">
              {hovered.spent > hovered.pace ? "Ahead of pace: the tower shakes" : "On pace: the cat sleeps"}
            </p>
          </div>
        )}
      </div>
      <figcaption className="mt-3 text-sm text-[var(--text-tertiary)]">
        An example month. In the shaded days, spending runs ahead of pace.
      </figcaption>
    </figure>
  )
}
