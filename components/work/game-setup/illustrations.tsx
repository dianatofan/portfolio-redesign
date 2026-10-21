"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Tabs } from "@/components/work/liveops/illustrations"
import "./game-setup.css"

/*
 * The Game setup automation illustrations: games queueing for the Core Team,
 * the four-step setup, services setting themselves up, and the module states
 * before and after. Drawn in HTML so they stay sharp and can move.
 */

const ease = "cubic-bezier(.2,0,0,1)"

function Caption({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <figcaption className="text-[13px] leading-[1.45] text-ink-meta text-pretty">
      <span className={dark ? "text-white" : "text-ink"}>Illustration</span> — {children}
    </figcaption>
  )
}

const games = [
  ["Game A", "#12a594"],
  ["Game B", "#f76b15"],
  ["Game C", "#8e4ec6"],
  ["Game D", "#3e63dd"],
  ["Game E", "#e5484d"],
] as const

/** Before: each game waits its turn with the Core Team. After: every team sets up its own, at once. Sits on the ink problem panel. */
export function CoreTeamQueue({ caption }: { caption: ReactNode }) {
  const [after, setAfter] = useState(0)
  const a = after === 1
  return (
    <figure className="gs-anim m-0 flex flex-col gap-3">
      <div className="flex flex-col gap-5 rounded-[20px] bg-[#f6f7f8] px-[clamp(16px,4vw,48px)] py-[clamp(20px,2.4vw,32px)] text-ink">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="text-[15px] leading-[1.45] font-medium">
            {a ? "Teams set up their own games" : "Every game waits for the Core Team"}
          </span>
          <Tabs labels={["Before", "After"]} value={after} onChange={setAfter} className="bg-white" />
        </div>
        <div className="flex flex-col gap-2.5">
          {games.map(([name, color], i) => (
            <div key={name} className="grid grid-cols-[80px_1fr] items-center gap-3 min-[720px]:grid-cols-[120px_1fr] min-[720px]:gap-4">
              <span className="flex items-center gap-2 text-[13px] leading-[1.45] whitespace-nowrap">
                <span className="h-[18px] w-[18px] flex-none rounded-[5px]" style={{ background: color }} />
                {name}
              </span>
              <div className="relative h-7 rounded-md bg-[repeating-linear-gradient(90deg,#e9eaed_0,#e9eaed_1px,transparent_1px,transparent_10%)]">
                <span
                  className="absolute inset-y-0 flex items-center overflow-hidden rounded-md px-2.5"
                  style={{
                    left: a ? "0%" : `${i * 19}%`,
                    width: a ? "max(9.5%, 76px)" : "19%",
                    background: a ? color : "#6f6d78",
                    transition: `left .7s ${ease} ${i * 0.06}s, width .7s ${ease}, background .4s`,
                  }}
                >
                  <span className="text-[12px] leading-none whitespace-nowrap text-white">{a ? "Self-serve" : "Core Team"}</span>
                </span>
              </div>
            </div>
          ))}
          <div className="grid grid-cols-[80px_1fr] gap-3 min-[720px]:grid-cols-[120px_1fr] min-[720px]:gap-4">
            <span />
            <div className="flex justify-between text-[12px] leading-[1.4] text-ink-meta">
              <span>Start</span>
              <span>Time →</span>
            </div>
          </div>
        </div>
      </div>
      <Caption dark>{caption}</Caption>
    </figure>
  )
}

/** A new game goes through the four steps and comes out ready to release. */
export function SetupFlow({ caption }: { caption: ReactNode }) {
  const steps = ["Define the essentials", "Permissions", "Configure services", "Integration credentials"]
  const card = "flex flex-col gap-2.5 rounded-xl p-[18px]"
  return (
    <figure className="gs-anim m-0 flex flex-col gap-3">
      <div aria-hidden className="flex items-center justify-center overflow-hidden rounded-[14px] bg-[#f1f2f4] py-8 min-[720px]:aspect-[21/9] min-[720px]:py-0">
        <div className="grid w-[84%] grid-cols-1 items-center gap-4 min-[720px]:grid-cols-[1fr_1.4fr_1fr] min-[720px]:gap-7">
          <div className={`${card} bg-white shadow-[0_1px_3px_rgba(22,21,26,.08)]`}>
            <span className="text-[13px] leading-[1.45] font-medium">New game</span>
            <span className="h-[7px] w-[70%] rounded bg-[#dcdde2]" />
            <span className="h-[7px] w-[50%] rounded bg-[#dcdde2]" />
          </div>
          <div className="flex flex-col gap-2.5">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-3 rounded-[10px] bg-white px-3.5 py-2.5 text-[13px] leading-[1.45]">
                <span
                  className="h-3.5 w-3.5 flex-none rounded border-[1.5px] border-[#c9c8d0]"
                  style={{ animation: `gsCheck 7s ease-in-out ${i * 0.35}s infinite` }}
                />
                {step}
              </div>
            ))}
          </div>
          <div className={`${card} bg-ink text-white`} style={{ animation: "gsBuild 7s ease-out 1.6s infinite" }}>
            <span className="text-[13px] leading-[1.45] font-medium">Ready to release</span>
            <span className="h-[7px] w-[60%] rounded bg-[#3d3c44]" />
            <span className="h-[7px] w-[40%] rounded bg-[#3d3c44]" />
          </div>
        </div>
      </div>
      <Caption>{caption}</Caption>
    </figure>
  )
}

/* Service icons, 24-unit Material shapes unless noted. */
const serviceIcons: Record<string, ReactNode> = {
  "Game Server": (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39" />
  ),
  "LiveOps Dashboard API": (
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2m-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2m3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1z" />
  ),
  "Build Server": (
    <path d="M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1M7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2M20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1M7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2" />
  ),
  "Data Dashboard": (
    <>
      <path d="M24 9.6V24H9.6v-4.8h4.8v-4.8h4.8V9.6Z" />
      <rect x="9.6" y="4.8" width="4.8" height="4.8" rx=".9" />
      <rect x="1.2" y="12" width="4.8" height="4.8" rx=".9" />
      <rect width="4.8" height="4.8" rx=".9" />
    </>
  ),
  "Push Notifications": (
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2m6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1z" />
  ),
  "Backup Service": (
    <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96M14 13v4h-4v-4H7l5-5 5 5z" />
  ),
  Embrace: (
    <>
      <path d="M3 15.17V8.49L6.28 5h3.3v3.17h-3.6v7.66h3.6V19H6.6Z" />
      <path d="M21 15.17V8.49L17.72 5h-3.3v3.17h3.6v7.66h-3.6V19h2.98Z" />
      <circle cx="9.64" cy="12" r="1.8" />
      <circle cx="14.48" cy="12" r="1.8" />
    </>
  ),
  // A flame, drawn on a 16-unit grid.
  "Google Sign-In": (
    <path
      transform="scale(1.5)"
      d="M12.99 8.23C11.94 5.51 8.21 5.37 9.11 1.41c.07-.29-.24-.52-.5-.37C6.19 2.47 4.45 5.33 5.91 9.08c.12.31-.24.59-.5.39C4.21 8.56 4.08 7.25 4.19 6.31c.04-.35-.41-.52-.61-.23-.45.69-.91 1.81-.91 3.5.25 3.73 3.41 4.88 4.54 5.03 1.62.21 3.37-.09 4.63-1.25 1.39-1.29 1.89-3.34 1.15-5.13M6.8 11.59c.96-.23 1.45-.93 1.59-1.54.22-.95-.64-1.89-.06-3.39.22 1.25 2.18 2.03 2.18 3.39.05 1.69-1.77 3.13-3.71 1.54"
    />
  ),
}

type Status = { t: string; c: string; icon: "scheduled" | "progress" | "available" | "none" | "partial" | "failed" }

const S = {
  scheduled: { t: "Scheduled", c: "#3d3c44", icon: "scheduled" },
  progress: { t: "In progress", c: "#4f35b8", icon: "progress" },
  available: { t: "Available", c: "#1d7a4e", icon: "available" },
  none: { t: "Not configured", c: "#8b8e95", icon: "none" },
  failed: { t: "Failed", c: "#c62a2f", icon: "failed" },
  partial: (t: string): Status => ({ t: `Configured for ${t}`, c: "#4f35b8", icon: "partial" }),
} as const

// Each service's status at the four stages the tabs pick.
const services: [string, Status[]][] = [
  ["Game Server", [S.scheduled, S.progress, S.available, S.available]],
  ["LiveOps Dashboard API", [S.available, S.available, S.available, S.available]],
  ["Build Server", [S.none, S.none, S.available, S.available]],
  ["Data Dashboard", [S.none, S.none, S.partial("Android"), S.available]],
  ["Push Notifications", [S.none, S.none, S.partial("iOS (Dev), Android"), S.available]],
  ["Backup Service", [S.none, S.none, S.failed, S.available]],
  ["Embrace", [S.none, S.none, S.partial("iOS (Dev), Android"), S.available]],
  ["Google Sign-In", [S.none, S.none, S.none, S.available]],
]

const stages = ["Initial state", "After a few seconds", "Partial configuration", "Fully configured"]

function StatusIcon({ icon }: { icon: Status["icon"] }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="block flex-none">
      {icon === "scheduled" && (
        <>
          <circle cx="8" cy="8" r="6" fill="currentColor" />
          <path d="M8 5v3.3l2 1.2" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </>
      )}
      {icon === "progress" && (
        <circle
          cx="8"
          cy="8"
          r="5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeDasharray="20 15"
          style={{ transformOrigin: "8px 8px", animation: "gsSpin 1s linear infinite" }}
        />
      )}
      {icon === "available" && (
        <>
          <circle cx="8" cy="8" r="6.5" fill="currentColor" />
          <path d="M5 8.2l2 2 4-4.2" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {icon === "none" && <circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.3" />}
      {icon === "partial" && (
        <>
          <circle cx="8" cy="8" r="6" fill="#ece9ff" />
          <path d="M8 2a6 6 0 0 1 0 12Z" fill="currentColor" />
        </>
      )}
      {icon === "failed" && (
        <>
          <path d="M8 2l6.5 11.5h-13Z" fill="currentColor" />
          <path d="M8 6.5v3.2M8 11.6v.1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

/**
 * Services setting themselves up in the background. The stages step on their
 * own every 2.2s until one is picked; with reduced motion they wait for a pick.
 */
export function Provisioning({ caption }: { caption: ReactNode }) {
  const [stage, setStage] = useState(0)
  const [held, setHeld] = useState(false)

  useEffect(() => {
    if (held || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = setInterval(() => setStage((s) => (s + 1) % stages.length), 2200)
    return () => clearInterval(t)
  }, [held])

  return (
    <figure className="gs-anim m-0 flex flex-col gap-3">
      <div className="grid grid-cols-1 items-center gap-6 rounded-[20px] bg-[#f6f7f8] px-[clamp(16px,4vw,48px)] py-[clamp(20px,2.4vw,32px)] min-[900px]:grid-cols-[minmax(0,1fr)_220px] min-[900px]:gap-10">
        <div aria-live="polite" className="flex w-full flex-col gap-2.5 justify-self-center min-[900px]:w-auto">
          {services.map(([name, states]) => {
            const s = states[stage]
            return (
              <div key={name} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 min-[720px]:grid-cols-[220px_260px] min-[720px]:gap-4">
                <span className="flex items-center gap-2 justify-self-end rounded-full bg-[#e9eaed] px-3.5 py-[7px] text-[13px] leading-[1.3] font-medium text-[#3d3c44] max-[719px]:max-w-full max-[719px]:truncate">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden className="block flex-none">
                    {serviceIcons[name]}
                  </svg>
                  <span className="truncate">{name}</span>
                </span>
                <span className="flex items-center gap-2 text-[13px] leading-[1.3] transition-colors duration-300" style={{ color: s.c }}>
                  <StatusIcon icon={s.icon} />
                  {s.t}
                </span>
              </div>
            )
          })}
        </div>
        <div role="tablist" aria-label="Setup stage" className="flex flex-col gap-1 max-[899px]:grid max-[899px]:grid-cols-2 max-[899px]:gap-x-4">
          {stages.map((label, i) => {
            const on = i === stage
            return (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setStage(i)
                  setHeld(true)
                }}
                className="grid cursor-pointer grid-cols-[3px_1fr] gap-3 border-none bg-transparent py-2 text-left"
              >
                <span className={`rounded-full transition-colors duration-300 ${on ? "bg-ink" : "bg-[#dcdde2]"}`} />
                <span className={`text-[13px] leading-[1.45] transition-colors duration-300 ${on ? "text-ink" : "text-ink-meta"}`}>{label}</span>
              </button>
            )
          })}
        </div>
      </div>
      <Caption>{caption}</Caption>
    </figure>
  )
}

/* The module states, before and after: chips in their own colours. */
const chipIcons = {
  ring: <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.3" />,
  clock: (
    <>
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <path d="M8 4.5V8l2.2 2.2" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  ok: (
    <>
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <path d="M4.9 8.2l2.1 2.1 4.1-4.3" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  pie: (
    <>
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <path d="M8 2.6A5.4 5.4 0 0 0 2.6 8H8Z" fill="#fff" />
    </>
  ),
  spin: <path d="M8 2a6 6 0 1 0 6 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />,
  warn: (
    <>
      <path d="M8 1.6 15.2 14H.8Z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      <path d="M8 6v3.6M8 11.6v.1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  manual: (
    <>
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <circle cx="6" cy="6.3" r="1.3" fill="#fff" />
      <circle cx="10" cy="6.3" r="1.3" fill="#fff" />
      <path d="M3.6 11c.6-1.3 1.4-2 2.4-2s1.8.7 2.4 2M7.6 11c.6-1.3 1.4-2 2.4-2s1.8.7 2.4 2" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
  bolt: (
    <>
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <path d="M8.8 3.4 5.4 8.6h2.4l-.6 4 3.4-5.2H8.2Z" fill="#fff" />
    </>
  ),
  opt: (
    <>
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <path d="M4.8 11.2h6.4M5.4 7.6l1.8 1.8 3.4-3.6" fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
}

type Chip = [label: string, icon: keyof typeof chipIcons, color: string, text?: string]

const GR = "#9aa0ab", SL = "#4a5160", TX = "#3d3c44", OK = "#16a34a", PU = "#6d3cf0", LP = "#8b8cf5", RD = "#dc2626", OR = "#e07b12"

const beforeStates: Chip[] = [
  ["Not Configured", "ring", GR],
  ["1–2 days estimated", "clock", SL, "#6f6d78"],
  ["Scheduled", "clock", SL, TX],
  ["Configured", "ok", OK],
  ["Available", "ok", OK],
  ["Partial", "pie", PU],
  ["Configured for [Platform] / [Env]", "pie", PU],
  ["In progress", "spin", LP],
  ["Failed", "warn", RD],
  ["Manual", "manual", OR],
  ["Automated", "bolt", PU],
  ["Optional", "opt", SL, TX],
]

const afterStates: Chip[] = [
  ["Scheduled", "clock", SL, TX],
  ["Available", "ok", OK],
  ["Configured for [Platform] / [Env]", "pie", PU],
  ["In progress", "spin", LP],
  ["Failed", "warn", RD],
]

function Chips({ items }: { items: Chip[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map(([label, icon, color, text]) => (
        <span key={label} className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] leading-[1.3]">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden className="block" style={{ color }}>
            {chipIcons[icon]}
          </svg>
          <span style={{ color: text ?? color }}>{label}</span>
        </span>
      ))}
    </div>
  )
}

/** Twelve granular module states, cut to five. Shown in the Key tradeoffs dialog. */
export function ModuleStates() {
  const panel = "flex flex-col gap-3.5 rounded-[14px] p-6"
  const badge = "self-start rounded-full px-2.5 py-1 text-[13px] leading-[1.45] font-medium"
  return (
    <figure className="m-0 flex flex-col gap-2.5">
      <div className="grid grid-cols-1 items-stretch gap-4 min-[720px]:grid-cols-2">
        <div className={`${panel} bg-[#f6f7f8]`}>
          <span className={`${badge} bg-hairline text-[#3d3c44]`}>Before</span>
          <Chips items={beforeStates} />
          <span className="text-[13px] leading-[1.45] text-ink-meta">Accurate, but hard to scan.</span>
        </div>
        <div className={`${panel} bg-[#ece9ff]`}>
          <span className={`${badge} bg-brand text-white`}>After · shipped</span>
          <Chips items={afterStates} />
          <span className="text-[13px] leading-[1.45] text-ink-meta">Readiness and the next action, at a glance.</span>
        </div>
      </div>
      <figcaption className="text-[13px] leading-[1.45] text-ink-meta">Module states, before and after.</figcaption>
    </figure>
  )
}
