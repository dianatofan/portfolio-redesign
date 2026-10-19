"use client"

import { useEffect, useRef, useState } from "react"

/*
 * An example month, not real spending: 10,000 kr over 31 days, with a splurge on
 * days 10 and 11. It runs the app's own rules (Support/Pace.swift and
 * Views/LivingRoom.swift):
 *
 *   danger = clamp(0.55 × share of budget spent + 2.2 × share spent ahead of pace)
 *
 * and the cat's calm states are thresholds on it.
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

const CAT_NAMES: Record<CatState, string> = {
  asleep: "Asleep",
  peek: "Peeking",
  watch: "Watching",
  anxious: "Anxious",
  box: "In the box",
}
// Cut out of the native app, frame by frame, from Simulator recordings of each
// mood. All five were cut at one scale, so their pixel sizes keep the cats' real
// relative size: a curled-up cat is wide and low, a sitting one tall.
const catImg = (state: CatState) => `/images/money-jenga/cat-${state}.webp`
const CAT_PX: Record<CatState, [number, number]> = {
  asleep: [130, 97],
  peek: [130, 67],
  watch: [109, 129],
  anxious: [112, 130],
  box: [116, 89],
}
const catSize = (state: CatState, scale: number) => ({
  width: Math.round(CAT_PX[state][0] * scale),
  height: Math.round(CAT_PX[state][1] * scale),
})
const nameOf = (state: CatState) => CAT_NAMES[state]

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

// The width follows the container (so the chart can run full width without its
// text scaling up); the height is fixed.
const M = { top: 40, right: 84, left: 48 }
const CHART_BOTTOM = 252
const H = CHART_BOTTOM + 28
const kr = (n: number) => `${n.toLocaleString("en-US").replace(/,/g, ".")} kr`

// A few moments in the month where a tiny cat sits on the line. Hand-picked
// rather than one per state change: days 10-12 change mood daily and their cats
// would pile on top of each other. Hover still gives the exact state per day.
const CAT_MOMENTS = [4, 11, 14, 25]

function geometry(W: number) {
  const x = (day: number) => M.left + ((day - 1) * (W - M.left - M.right)) / (DAYS - 1)
  const y = (amount: number) => M.top + (1 - amount / BUDGET) * (CHART_BOTTOM - M.top)

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
  return { x, y, spentPath, aheadBands }
}

const yTicks = [0, 5000, 10000]
const xTicks = [1, 10, 20, 31]

export function MoneyJengaPaceChart() {
  const boxRef = useRef<HTMLDivElement>(null)
  const [W, setW] = useState(640)
  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const update = () => setW(Math.max(360, Math.round(el.clientWidth)))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const { x, y, spentPath, aheadBands } = geometry(W)

  const [hoverDay, setHoverDay] = useState<number | null>(null)
  const hovered =
    hoverDay === null
      ? null
      : {
          day: hoverDay,
          spent: spentByDay[hoverDay - 1],
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
      <div ref={boxRef} className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block h-auto w-full" role="img" aria-labelledby="pace-chart-title">
          <title id="pace-chart-title">
            Example month: money spent against an even daily pace for a 10,000 kr budget. The cat sleeps while spending
            is on pace, turns anxious after a jacket and concert tickets on days 10 and 11, then calms down as the month
            catches up. The month ends at 7,550 kr, so the tower survives.
          </title>

          {yTicks.map((t) => (
            <g key={t}>
              <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} stroke="#eee6d6" strokeWidth={1} />
              <text x={M.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill="var(--text-tertiary)">
                {t === 0 ? "0" : `${t / 1000}k`}
              </text>
            </g>
          ))}

          {aheadBands.map((band) => (
            <path key={band} d={band} fill="#c7372f" fillOpacity={0.14} />
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

          {/* Tiny cats sitting on the spending line, each showing her mood that day. */}
          {CAT_MOMENTS.map((day) => {
            const state = catByDay[day - 1]
            const { width, height } = catSize(state, 0.3)
            return (
              <image
                key={day}
                href={catImg(state)}
                x={x(day) - width / 2}
                y={y(spentByDay[day - 1]) - height + 2}
                width={width}
                height={height}
              >
                <title>{nameOf(state)}</title>
              </image>
            )
          })}

          {xTicks.map((d) => (
            <text key={d} x={x(d)} y={H - 6} textAnchor="middle" fontSize={11} fill="var(--text-tertiary)">
              {`Day ${d}`}
            </text>
          ))}

          {hovered && (
            <g pointerEvents="none">
              <line x1={x(hovered.day)} x2={x(hovered.day)} y1={M.top} y2={CHART_BOTTOM} stroke="var(--text-tertiary)" strokeWidth={1} />
              <circle cx={x(hovered.day)} cy={y(hovered.spent)} r={4} fill="#1c1611" stroke="white" strokeWidth={2} />
            </g>
          )}

          <rect
            x={M.left}
            y={M.top}
            width={W - M.left - M.right}
            height={CHART_BOTTOM - M.top}
            fill="transparent"
            onPointerMove={onMove}
            onPointerLeave={() => setHoverDay(null)}
          />
        </svg>

        {hovered && (
          <div
            className="pointer-events-none absolute top-0 w-[160px] rounded-md bg-white px-3 py-2 text-xs shadow-sm ring-1 ring-black/5 tabular-nums"
            style={{ left: `clamp(0px, calc(${(x(hovered.day) / W) * 100}% - 80px), calc(100% - 160px))` }}
          >
            <p className="font-medium text-foreground">{`Day ${hovered.day}`}</p>
            {hovered.purchase && (
              <p className="text-[var(--text-secondary)]">{`${hovered.purchase.label}, ${kr(hovered.purchase.amount)}`}</p>
            )}
            <p className="text-[var(--text-secondary)]">{`Spent ${kr(hovered.spent)}`}</p>
            <p className="mt-1 flex items-center gap-1.5 font-medium text-foreground">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={catImg(hovered.cat)} alt="" {...catSize(hovered.cat, 0.22)} />
              {nameOf(hovered.cat)}
            </p>
          </div>
        )}
      </div>
      <figcaption className="mt-4 text-sm text-[var(--text-tertiary)]">
        An example month. Shaded days are ahead of pace.
      </figcaption>
    </figure>
  )
}
