"use client";
import { useContext, useEffect, useRef, useState, type CSSProperties, type PointerEvent as RPE } from "react";
import { CursorContext } from "@/context/CursorContext";
import { AiComposer, AiComposerPreview } from "./ai-composer";
import { EmptyState, EmptyStatePreview } from "./empty-state";
import { HoldoutDiagram, HoldoutDiagramPreview } from "./holdout-diagram";
import { SwitchboardFilter, SwitchboardPreview } from "./switchboard-filter";
import { TargetingOrder, TargetingOrderPreview } from "./targeting-order";

/**
 * Microcomponents board — Figma-style canvas with a live, expandable, resizable frame.
 * - Left: list of components. Right: dotted board with one selected frame.
 * - Frame: the component's preview; click to expand it into the live component,
 *   corner handles resize, live size label.
 * - "Diana" cursor sits on the selected frame; a "You" cursor follows the
 *   visitor's mouse, in place of the site's own cursor.
 * Fonts/colours follow the site tokens. From Microcomponents.tsx in the design
 * handoff; the homepage draws the section and its "Microcomponents" heading.
 */

const INK = "#16151a", MUTED = "#6f6d78", FAINT = "#8b8e95", ACCENT = "#4f35b8", FIG = "#0d99ff", LINE = "#ececef";
const FONT = "Saans, 'Helvetica Neue', Helvetica, Arial, sans-serif";
// The board grows when an open component needs more room than this.
const BOARD_MIN_H = 440;

const ITEMS = [
  { t: "Animated conversation", d: "A drafted reply that breathes while it thinks.", Live: AiComposer, Preview: AiComposerPreview, openH: 430, openHNarrow: 560 },
  { t: "Empty state", d: "A cat asleep where the list will go.", Live: EmptyState, Preview: EmptyStatePreview, openH: 500, openHNarrow: 560 },
  { t: "Switchboard filter", d: "Multi-select you can read at a glance.", Live: SwitchboardFilter, Preview: SwitchboardPreview, openH: 260, openHNarrow: 300 },
  { t: "Illustrated tutorial", d: "An animated illustration that replaces hefty text.", Live: HoldoutDiagram, Preview: HoldoutDiagramPreview, openH: 250, openHNarrow: 300 },
  { t: "Targeting tabs", d: "Targeting tabs that assign each player to the first offer they match.", Live: TargetingOrder, Preview: TargetingOrderPreview, openH: 360, openHNarrow: 480 },
];
const KEYFRAMES = `
@keyframes mcPulse{0%,100%{box-shadow:0 0 0 0 rgba(13,153,255,.45)}50%{box-shadow:0 0 0 6px rgba(13,153,255,0)}}
@media (prefers-reduced-motion:reduce){[data-mc] *{animation:none!important;transition:none!important}}`;

function Cursor({ label, color, style }: { label: string; color: string; style: CSSProperties }) {
  return (
    <div style={{ position: "absolute", pointerEvents: "none", display: "flex", alignItems: "flex-start", gap: 2, zIndex: 1000, ...style }}>
      <svg width="16" height="18" viewBox="0 0 16 18"><path d="M1 1 L1 15 L5 11 L8 17 L10 16 L7 10 L13 10 Z" fill={color} stroke="#fff" strokeWidth="1.2" /></svg>
      <span style={{ marginTop: 14, fontSize: 11, background: color, color: "#fff", padding: "2px 7px", borderRadius: 999 }}>{label}</span>
    </div>
  );
}

export function Board() {
  const [sel, setSel] = useState(0);
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null); // w in % of board, h in px
  const [resizing, setResizing] = useState(false);
  const [you, setYou] = useState<{ x: number; y: number } | null>(null);
  const [bw, setBw] = useState(960);
  const board = useRef<HTMLDivElement>(null);
  const { setDotHidden } = useContext(CursorContext);
  // Over the board the site's dot gives way to the drawn "You" cursor; the OS
  // cursor stays off (the site hides it everywhere). Back on leave or unmount.
  useEffect(() => () => setDotHidden(false), [setDotHidden]);

  useEffect(() => {
    const el = board.current; if (!el) return;
    const ro = new ResizeObserver(() => setBw(el.offsetWidth)); ro.observe(el); return () => ro.disconnect();
  }, []);

  const item = ITEMS[sel];
  // On a phone-width board the frames go wider, and the composer's text wraps
  // to more lines, so it needs more height open.
  const narrow = bw < 600;
  const base = open
    ? { w: narrow ? 92 : 76, h: narrow ? item.openHNarrow : item.openH }
    : { w: narrow ? 84 : 50, h: 120 };
  const rz = size ?? base;
  const BOARD_H = Math.max(BOARD_MIN_H, rz.h + 140);
  const top = open && !size ? 44 : Math.max(24, Math.round((BOARD_H - rz.h) / 2) - 16);
  const left = 50 - rz.w / 2;
  const showDim = open || resizing || !!size;
  const dim = `${Math.round((bw * rz.w) / 100)} × ${Math.round(rz.h)}`;

  const startResize = (sx: number, sy: number) => (e: RPE) => {
    e.preventDefault(); e.stopPropagation();
    const x0 = e.clientX, y0 = e.clientY, w0 = rz.w, h0 = rz.h;
    setResizing(true);
    const mv = (ev: PointerEvent) => {
      const w = Math.max(30, Math.min(92, w0 + (sx * 2 * (ev.clientX - x0)) / bw * 100));
      const h = Math.max(90, Math.min(620, h0 + sy * 2 * (ev.clientY - y0)));
      setSize({ w, h }); setOpen(h >= 200);
    };
    const up = () => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); setResizing(false); };
    addEventListener("pointermove", mv); addEventListener("pointerup", up);
  };

  const handle = (pos: CSSProperties, cursor: string, sx: number, sy: number) => (
    <span onPointerDown={startResize(sx, sy)} title="Drag to resize"
      style={{ position: "absolute", width: 9, height: 9, boxSizing: "border-box", background: "#fff", border: `1px solid ${FIG}`, cursor, zIndex: 2, ...pos }} />
  );

  const { Live, Preview } = item;

  return (
    <div data-mc style={{ fontFamily: FONT, color: INK }}>
      <style>{KEYFRAMES}</style>
      <div className="grid grid-cols-1 gap-5 min-[62.5rem]:grid-cols-[minmax(180px,220px)_minmax(0,1fr)]" style={{ marginTop: 24 }}>
        <div className="flex gap-0.5 overflow-x-auto min-[62.5rem]:flex-col">
          {ITEMS.map((m, i) => (
            <button key={m.t} onClick={() => setSel(i)}
              style={{ display: "flex", alignItems: "center", gap: 10, textAlign: "left", border: "none", cursor: "pointer", padding: "9px 10px", borderRadius: 8, background: i === sel ? "#f4f4f4" : "transparent", fontFamily: FONT, fontSize: 15, color: i === sel ? INK : MUTED }}>
              <span style={{ fontSize: 12, color: FAINT }}>#</span>{m.t}
            </button>
          ))}
        </div>

        <div ref={board}
          onPointerMove={e => { if (e.pointerType !== "mouse") return; const r = e.currentTarget.getBoundingClientRect(); setYou({ x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) }); }}
          onPointerEnter={e => { if (e.pointerType === "mouse") setDotHidden(true); }}
          onPointerLeave={() => { setYou(null); setDotHidden(false); }}
          style={{ position: "relative", height: BOARD_H, transition: "height .45s cubic-bezier(.2,0,0,1)", borderRadius: 16, backgroundColor: "#f5f5f5", backgroundImage: "radial-gradient(#d9d9dd 1px,transparent 1px)", backgroundSize: "20px 20px", overflow: "hidden", cursor: you ? "none" : "default", touchAction: resizing ? "none" : "auto" }}>

          <div style={{ position: "absolute", left: `${left}%`, top, width: `${rz.w}%`, transition: resizing ? "none" : "top .45s cubic-bezier(.2,0,0,1), left .45s cubic-bezier(.2,0,0,1), width .45s cubic-bezier(.2,0,0,1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, fontSize: 12 }}>
              <span style={{ color: FIG, whiteSpace: "nowrap" }}>{item.t}</span>
              <button onClick={e => { e.stopPropagation(); setOpen(o => !o); setSize(null); }}
                style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", fontFamily: FONT, fontSize: 12, color: FIG }}>
                {open ? "Collapse ↙" : "Expand ↗"}
              </button>
            </div>
            <div onClick={() => { if (!open) { setOpen(true); setSize(null); } }}
              style={{ position: "relative", height: rz.h, background: "#fff", display: "grid", placeItems: "center", boxShadow: "0 1px 2px rgba(22,21,26,.06)", outline: `1.5px solid ${FIG}`, cursor: open ? "default" : "pointer", transition: resizing ? "none" : "height .45s cubic-bezier(.2,0,0,1)" }}>
              {/* The real component, clipped to the frame; keyed so it starts fresh when picked or opened. */}
              <div key={`${sel}-${open}`} style={{ position: "absolute", inset: 0, overflow: "hidden", display: "grid", placeItems: "center", pointerEvents: open ? "auto" : "none" }}>
                {open ? <Live /> : <Preview />}
              </div>
              {!open && (
                <span style={{ position: "absolute", right: 10, bottom: -30, display: "flex", alignItems: "center", gap: 6, padding: "3px 10px 3px 8px", borderRadius: 999, background: FIG, color: "#fff", fontSize: 12, animation: "mcPulse 2s infinite" }}>
                  <span>▶</span>Click to try it
                </span>
              )}
              {handle({ left: -5, top: -5 }, "nwse-resize", -1, -1)}
              {handle({ right: -5, top: -5 }, "nesw-resize", 1, -1)}
              {handle({ left: -5, bottom: -5 }, "nesw-resize", -1, 1)}
              {handle({ right: -5, bottom: -5 }, "nwse-resize", 1, 1)}
              {showDim && (
                <span style={{ position: "absolute", left: "50%", bottom: -26, transform: "translateX(-50%)", fontSize: 11, background: FIG, color: "#fff", padding: "2px 6px", borderRadius: 3, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{dim}</span>
              )}
            </div>
          </div>

          <Cursor label="Diana" color="#7d69d6" style={{ left: `${left + rz.w + 1}%`, top: top + rz.h + 26, transition: resizing ? "none" : "left .5s cubic-bezier(.2,0,0,1), top .5s cubic-bezier(.2,0,0,1)" }} />
          {you && <Cursor label="You" color={INK} style={{ left: you.x, top: you.y }} />}

          <span style={{ position: "absolute", left: 20, bottom: 16, fontSize: 13, color: MUTED }}>{item.d}</span>
          <span style={{ position: "absolute", right: 20, bottom: 16, fontSize: 13, color: FAINT }}>{sel + 1} of {ITEMS.length}</span>
        </div>
      </div>
    </div>
  );
}
