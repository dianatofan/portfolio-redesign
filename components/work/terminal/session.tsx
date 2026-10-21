import "./terminal.css"

/*
 * The Human Redundancy Terminal, as an illustration (hrt-terminal.html): a role
 * typed in, the 2024–2030 signals scanned, two bars and a verdict. The shape of
 * a session, not real output.
 */

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <span className="grid grid-cols-[140px_1fr] items-center gap-3">
      <span className="text-[#a3a1ad]">{label}</span>
      <span className="h-2 overflow-hidden rounded-full bg-[#2c2b31]">
        <span className="block h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </span>
    </span>
  )
}

export function TerminalSession() {
  return (
    <figure className="hrt-anim m-0 flex flex-col gap-3">
      <div className="flex justify-center rounded-[14px] bg-[#f4f4f4] p-[clamp(20px,4vw,48px)]">
        <div className="flex w-full max-w-[640px] flex-col gap-1.5 rounded-xl bg-[#16151a] px-[26px] py-6 font-mono text-[14px] leading-[1.7] text-white shadow-[0_20px_40px_-24px_rgba(22,21,26,.6)]">
          <span aria-hidden className="mb-2 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-[9px] w-[9px] rounded-full bg-[#3d3c44]" />
            ))}
          </span>
          <span>
            <span className="text-[#7b5cff]">&gt;</span> role:{" "}
            <span className="inline-block overflow-hidden align-bottom whitespace-nowrap" style={{ animation: "hrtType 7s steps(15) infinite" }}>
              product designer
            </span>
            <span aria-hidden className="inline-block h-[15px] w-2 bg-white" style={{ verticalAlign: -2, animation: "hrtCaret 1s steps(1) infinite" }} />
          </span>
          <span className="text-[#a3a1ad]">scanning 2024–2030 signals…</span>
          <Bar label="automation risk" value={46} color="#7b5cff" />
          <Bar label="human edge" value={72} color="#fff" />
          <span className="mt-1.5">
            verdict: <span className="text-[#7b5cff]">not redundant. yet.</span>
          </span>
        </div>
      </div>
      <figcaption className="text-[13px] leading-[1.45] text-ink-meta">
        Illustration · the shape of a session, not real output.
      </figcaption>
    </figure>
  )
}
