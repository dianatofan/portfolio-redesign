"use client"

import { useEffect, useImperativeHandle, useRef } from "react"

/*
 * A ball of yarn that winds and unwinds itself, with a fluffy black kitten
 * batting at the loose end. Ported from `Yarn 2D.dc.html` in the design handoff,
 * with the props the homepage uses baked in: Paper theme, the crouched
 * "Pouncer" kitten, black coat, no chrome, filling its container.
 *
 * Everything per frame is written straight to the DOM (path `d` attributes and
 * a canvas), so React renders this once. The loop pauses while the figure is
 * off screen, and under reduced motion it draws a single wound-up frame.
 *
 * The thread end is draggable: grab it to scrub between tangled and wound.
 *
 * `pettable` (cat-thread.html): click the cat and she slow-blinks, a "prrr"
 * drifts up from her head, and the first pet leaves a note in the console. On
 * a phone she's easier to hit: a tap anywhere on or near her counts.
 */

type Vec3 = [number, number, number]
type Pose = { a: number; dx: number; dy: number; lean: number; contact: boolean; nudge?: number }
type Sdf = (x: number, y: number) => number

const THEME = {
    back: "#D4CCF4",
    mid: "#937DE0",
    front: "#4F35B8",
    fur: [26, 25, 30] as const,
    eyeW: "#FFFFFF",
    eyeP: "#111013",
}

const R = 82
const STAGGER = 0.3
const HOVER_SPEED = 0.3

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x))

// Mulberry32: the design seeds every random draw, so the ball and the fur come
// out identical on every load.
function seeded(seed: number) {
    let s = seed
    return () => {
        s |= 0
        s = (s + 0x6d2b79f5) | 0
        let t = Math.imul(s ^ (s >>> 15), 1 | s)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

/* ---------- yarn geometry ---------- */

function buildYarn(lumpy = false) {
    const rnd = seeded(5)
    const add = (a: Vec3, b: Vec3, k = 1): Vec3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
    const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
    const norm = (a: Vec3): Vec3 => {
        const l = Math.hypot(a[0], a[1], a[2]) || 1
        return [a[0] / l, a[1] / l, a[2] / l]
    }
    const cross = (a: Vec3, b: Vec3): Vec3 => [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    ]
    const sm = (x: number) => {
        x = clamp(x)
        return x * x * (3 - 2 * x)
    }

    // Wound ball: bands of parallel strands, each band on its own axis.
    const BANDS = 8,
        WPB = 4,
        PPW = 64,
        NB = BANDS * WPB * PPW
    const axes: Vec3[] = []
    for (let b = 0; b < BANDS; b++) {
        const ph = Math.acos(1 - (2 * (b + 0.5)) / BANDS),
            th = b * 2.39996 + 0.4
        axes.push([Math.sin(ph) * Math.cos(th), Math.cos(ph), Math.sin(ph) * Math.sin(th)])
    }
    const ball: Vec3[] = []
    let u = norm(cross(axes[0], [0, 0, 1]))
    for (let i = 0; i < NB; i++) {
        const w = i / PPW,
            b = Math.min(Math.floor(w / WPB), BANDS - 1)
        const f = b < BANDS - 1 ? sm((w - (b + 1) * WPB + 0.9) / 1.4) : 0
        const ax = norm(add(axes[b].map((v) => v * (1 - f)) as Vec3, axes[Math.min(b + 1, BANDS - 1)], f))
        u = norm(add(u, ax, -dot(ax, u)))
        const v = cross(ax, u),
            th = w * Math.PI * 2
        const tri = Math.abs(((w / WPB) % 1) * 2 - 1) // latitude steps out and back: parallel strands
        const de = 0.3 * (tri - 0.5),
            r = R * (0.95 + (0.05 * i) / NB)
        const c = Math.cos(de) * r,
            sn = Math.sin(de) * r
        const q0: Vec3 = [
            u[0] * Math.cos(th) * c + v[0] * Math.sin(th) * c + ax[0] * sn,
            u[1] * Math.cos(th) * c + v[1] * Math.sin(th) * c + ax[1] * sn,
            u[2] * Math.cos(th) * c + v[2] * Math.sin(th) * c + ax[2] * sn,
        ]
        if (lumpy) {
            // A hand-wound ball: low-frequency bumps, a little wider than tall,
            // and the top settling slightly.
            const l = Math.hypot(q0[0], q0[1], q0[2]) || 1,
                n0 = q0[0] / l,
                n1 = q0[1] / l,
                n2 = q0[2] / l
            const lump =
                1 +
                0.09 * Math.sin(3.1 * n0 + 1.3) * Math.cos(2.3 * n1 - 0.4) +
                0.06 * Math.sin(4.7 * n2 + 2.1 * n0) +
                0.035 * Math.sin(9 * n1 + 5 * n2)
            const sag = n1 < -0.55 ? 1 - (-0.55 - n1) * 0.35 : 1
            ball.push([q0[0] * lump * 1.04, q0[1] * lump * 0.9 * sag, q0[2] * lump])
        } else ball.push(q0)
    }

    // Loose tail trailing off to the right, lying in front.
    const P = ball[NB - 1],
        NT = 160,
        E: Vec3 = [140, -58, R * 0.4]
    const out = norm([P[0], P[1], 0])
    const C1 = add(P, out, 45),
        C2: Vec3 = [108, -66, R * 0.4]
    const tail: Vec3[] = []
    for (let j = 1; j <= NT; j++) {
        const t = j / NT,
            m = 1 - t
        tail.push(
            [0, 1, 2].map(
                (k) => m * m * m * P[k] + 3 * m * m * t * C1[k] + 3 * m * t * t * C2[k] + t * t * t * E[k]
            ) as Vec3
        )
    }
    const wound = ball.concat(tail)
    const N = wound.length
    const tailDir = norm([E[0] - P[0], E[1] - P[1], 0])

    // Tangle: coils riding a random path inside a sphere.
    const ctrl: Vec3[] = []
    for (let k = 0; k < 28; k++) {
        let p: Vec3
        do p = [rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1]
        while (dot(p, p) > 1)
        ctrl.push(p.map((v) => v * R * 0.9) as Vec3)
    }
    const cr = (a: Vec3, b: Vec3, c: Vec3, d: Vec3, t: number) =>
        [0, 1, 2].map(
            (k) =>
                0.5 *
                (2 * b[k] +
                    (-a[k] + c[k]) * t +
                    (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * t * t +
                    (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * t * t * t)
        ) as Vec3
    const base: Vec3[] = []
    for (let i = 0; i < NB; i++) {
        const g = (i / (NB - 1)) * (ctrl.length - 3),
            k = Math.min(Math.floor(g), ctrl.length - 4)
        base.push(cr(ctrl[k], ctrl[k + 1], ctrl[k + 2], ctrl[k + 3], g - k))
    }
    const tang: Vec3[] = [],
        loops = 130
    let a: Vec3 = [0, 1, 0]
    for (let i = 0; i < NB; i++) {
        const t = i / (NB - 1)
        const tn = norm(add(base[Math.min(i + 1, NB - 1)], base[Math.max(i - 1, 0)], -1))
        a = norm(add(a, tn, -dot(tn, a)))
        const b2 = cross(tn, a),
            ph = t * loops * Math.PI * 2
        const lr = R * (0.26 + 0.16 * Math.sin(t * 23 + 1.1) + 0.06 * Math.sin(t * 71))
        let p = add(add(base[i], a, Math.cos(ph) * lr), b2, Math.sin(ph) * lr)
        const r = Math.hypot(p[0], p[1], p[2]),
            lim = R * 1.15
        if (r > lim) p = p.map((v) => (v * lim * Math.tanh(r / lim)) / r) as Vec3
        tang.push(p)
    }
    const TL = tang[NB - 1]
    for (let j = 0; j < NT; j++) tang.push(add(TL, [tail[j][0] - P[0], tail[j][1] - P[1], tail[j][2] - P[2]], 0.28))

    return { wound, tang, N, NB, tailDir, Ew: wound[N - 1], Et: tang[N - 1] }
}

/* ---------- procedural fur kitten, crouched to pounce ---------- */

const EYES: [number, number][] = [
    [208, 428],
    [292, 426],
]
const EYE_R = 19
const PAW_PIVOT: [number, number] = [225, 500]
const BODY_TOP = 290

function buildCat() {
    const rnd = seeded(33)
    const ell = (x: number, y: number, cx: number, cy: number, rx: number, ry: number, rot = 0) => {
        const c = Math.cos(rot),
            sn = Math.sin(rot),
            dx = x - cx,
            dy = y - cy,
            u = dx * c + dy * sn,
            v = -dx * sn + dy * c
        return (Math.hypot(u / rx, v / ry) - 1) * Math.min(rx, ry)
    }
    const smin = (a: number, b: number, k: number) => {
        const h = clamp(0.5 + (0.5 * (b - a)) / k)
        return b + (a - b) * h - k * h * (1 - h)
    }
    const tri = (x: number, y: number, P: [number, number][], r: number) => {
        const cx = (P[0][0] + P[1][0] + P[2][0]) / 3,
            cy = (P[0][1] + P[1][1] + P[2][1]) / 3
        let d = -1e9
        for (let i = 0; i < 3; i++) {
            const [ax, ay] = P[i],
                [bx, by] = P[(i + 1) % 3]
            let nx = by - ay,
                ny = -(bx - ax)
            if ((cx - ax) * nx + (cy - ay) * ny > 0) {
                nx = -nx
                ny = -ny
            }
            const l = Math.hypot(nx, ny)
            d = Math.max(d, ((x - ax) * nx + (y - ay) * ny) / l)
        }
        return d - r
    }
    const tailPts: [number, number, number][] = []
    {
        const P = [
            [505, 315],
            [570, 240],
            [520, 160],
            [478, 118],
        ]
        for (let i = 0; i <= 26; i++) {
            const t = i / 26,
                m = 1 - t
            tailPts.push([
                m * m * m * P[0][0] + 3 * m * m * t * P[1][0] + 3 * m * t * t * P[2][0] + t * t * t * P[3][0],
                m * m * m * P[0][1] + 3 * m * m * t * P[1][1] + 3 * m * t * t * P[2][1] + t * t * t * P[3][1],
                t,
            ])
        }
    }
    const earL: [number, number][] = [
        [163, 304],
        [176, 384],
        [240, 350],
    ]
    const earR: [number, number][] = [
        [337, 302],
        [264, 350],
        [330, 384],
    ]

    const parts: Record<"tail" | "body" | "head" | "paw", Sdf> = {
        tail: (x, y) => {
            let d = 1e9
            for (const [px, py, t] of tailPts) d = Math.min(d, Math.hypot(x - px, y - py) - (34 - 8 * t))
            return d
        },
        body: (x, y) =>
            smin(
                smin(ell(x, y, 410, 385, 150, 92, -0.32), ell(x, y, 515, 440, 58, 70), 30),
                ell(x, y, 335, 505, 52, 28),
                24
            ),
        head: (x, y) => smin(smin(ell(x, y, 250, 425, 108, 88), tri(x, y, earL, 13), 40), tri(x, y, earR, 13), 40),
        paw: (x, y) => ell(x, y, 172, 508, 44, 26, -0.1),
    }
    type Part = keyof typeof parts
    const B: Record<Part, [number, number, number, number]> = {
        tail: [420, 70, 620, 360],
        body: [240, 260, 600, 545],
        head: [125, 280, 375, 530],
        paw: [115, 470, 235, 550],
    }

    const dark = (name: Part, x: number, y: number, d: number) => {
        const edge = 1 - clamp(-d / 45)
        if (name === "head") return clamp(0.92 + 0.06 * edge - 0.12 * clamp((y - 440) / 60))
        if (name === "paw") return clamp(0.66 + 0.25 * edge)
        if (name === "tail") return clamp(0.9 + 0.1 * edge)
        const top = clamp((y - BODY_TOP) / 220)
        return clamp(0.86 - 0.26 * top + 0.22 * edge)
    }

    // Each layer is thousands of short, faint hair strokes scattered over a
    // signed-distance shape and combed along its gradient.
    const makeLayer = (names: Part[], counts: Partial<Record<Part, number>>) => {
        const c = document.createElement("canvas")
        c.width = c.height = 1400
        const g = c.getContext("2d")!
        g.scale(2, 2)
        g.lineCap = "round"
        const FR = THEME.fur
        for (const name of names) {
            const F = parts[name],
                BB = B[name]
            for (let k = 0; k < (counts[name] ?? 0); k++) {
                const x = BB[0] + rnd() * (BB[2] - BB[0]),
                    y = BB[1] + rnd() * (BB[3] - BB[1]),
                    d = F(x, y)
                if (d > 12 * Math.pow(rnd(), 1.6)) continue
                if (name === "body" && parts.head(x, y) < -3) continue
                if (name === "tail" && parts.body(x, y) < -2) continue
                const dk = dark(name, x, y, d) * (d > 0 ? 1 - d / 14 : 1)
                if (rnd() > dk) continue
                const e = 1.5,
                    gx = F(x + e, y) - F(x - e, y),
                    gy = F(x, y + e) - F(x, y - e),
                    gl = Math.hypot(gx, gy) || 1
                const rim = clamp(1 + d / 22, 0, 1)
                let dx = (gx / gl) * (0.35 + rim) + (rnd() - 0.5) * 1.1,
                    dy = (gy / gl) * (0.35 + rim) + 0.35 + (rnd() - 0.5) * 1.1
                const l = Math.hypot(dx, dy) || 1,
                    len = 2.2 + rnd() * (2.5 + 3.5 * rim)
                dx /= l
                dy /= l
                const j = Math.round(rnd() * 26) - 6
                g.strokeStyle = `rgba(${FR[0] + j}, ${FR[1] + j}, ${FR[2] + j}, ${0.18 + rnd() * 0.24})`
                g.lineWidth = 0.3 + rnd() * 0.35
                g.beginPath()
                g.moveTo(x, y)
                g.lineTo(x + dx * len, y + dy * len)
                g.stroke()
            }
        }
        return c
    }

    return {
        parts,
        body: makeLayer(["tail", "body", "head"], { tail: 110000, body: 300000, head: 220000 }),
        paw: makeLayer(["paw"], { paw: 26000 }),
    }
}

// Swat keyframes: cock back and lift, fast strike past rest, pad drags the
// thread back, settle.
function pawPose(d: number): Pose {
    if (!d) return { a: 0, dx: 0, dy: 0, lean: 0, contact: true }
    const K = [
        [0, 0, 0, 0],
        [0.26, 0.5, 8, -20],
        [0.36, 0.42, 4, -22],
        [0.46, -0.08, -24, 2],
        [0.7, 0.02, 10, 0],
        [1, 0, 0, 0],
    ]
    let i = 0
    while (i < K.length - 2 && d > K[i + 1][0]) i++
    const A = K[i],
        Bk = K[i + 1],
        f = (d - A[0]) / (Bk[0] - A[0])
    const e = i === 2 ? f * f * f : f * f * (3 - 2 * f) // strike accelerates into contact
    const L = (j: number) => A[j] + (Bk[j] - A[j]) * e
    const strike = Math.exp(-(((d - 0.48) / 0.12) ** 2))
    return {
        a: L(1),
        dx: L(2),
        dy: L(3),
        lean: -2.6 * strike + 0.8 * Math.exp(-(((d - 0.25) / 0.1) ** 2)),
        contact: d < 0.06 || d > 0.44,
    }
}

// Reach out, pad down on the thread, draw it back toward the body.
function drawPose(d: number): Pose {
    const K = [
        [0, 0, 0, 0],
        [0.22, 0.14, -30, -18],
        [0.34, 0.03, -46, 0],
        [0.82, -0.05, 10, 2],
        [1, 0, 0, 0],
    ]
    let i = 0
    while (i < K.length - 2 && d > K[i + 1][0]) i++
    const A = K[i],
        Bk = K[i + 1],
        f = (d - A[0]) / (Bk[0] - A[0])
    const e = i === 1 ? f * f : f * f * (3 - 2 * f)
    const L = (j: number) => A[j] + (Bk[j] - A[j]) * e
    const pull = d > 0.34 && d < 1 ? Math.sin((Math.PI * (d - 0.34)) / 0.66) : 0
    return {
        a: L(1),
        dx: L(2),
        dy: L(3),
        lean: -1.6 * Math.exp(-(((d - 0.3) / 0.12) ** 2)) + 1.4 * pull,
        contact: d < 0.04 || d > 0.33,
        nudge: 5 * pull,
    }
}

type YarnCatProps = {
    className?: string
    /** Pins the yarn at this wound amount (0 tangled, 1 wound) instead of the idle loop. Dragging still overrides it. */
    progress?: number
    /** Lumpier, hand-wound ball. */
    lumpy?: boolean
    /** The yarn's SVG, for callers that need to map its 800×800 coordinates to the page. */
    svgRef?: React.Ref<SVGSVGElement>
    /** Click the cat for a slow blink and a "prrr". */
    pettable?: boolean
}

export function YarnCat({ className, progress, lumpy = false, pettable = false, svgRef: outerSvgRef }: YarnCatProps) {
    const rootRef = useRef<HTMLDivElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const backRef = useRef<SVGPathElement>(null)
    const midRef = useRef<SVGPathElement>(null)
    const frontRef = useRef<SVGPathElement>(null)
    const handleRef = useRef<SVGCircleElement>(null)
    const tailHitRef = useRef<SVGPathElement>(null)
    const catRef = useRef<HTMLCanvasElement>(null)
    // Read inside the frame loop, so a changing progress doesn't restart the effect.
    const progressRef = useRef(progress)
    progressRef.current = progress

    useImperativeHandle(outerSvgRef, () => svgRef.current!, [])

    useEffect(() => {
        const svg = svgRef.current!
        const yarn = buildYarn(lumpy)
        const { N, NB, wound, tang, tailDir } = yarn
        const cur = new Float32Array(N * 3)
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")

        let cat: ReturnType<typeof buildCat> | null = null
        let clock = 0,
            scale = 1,
            target = 1,
            dragging = false,
            dragP = 0,
            dt = 0.016
        let pose: Pose = pawPose(0)
        let threadEnd: [number, number] | null = null
        let blinkT = 2,
            blink = 1
        let look: [number, number] = [-0.85, 0.55]
        let lookTarget: [number, number] | null = null
        // Petting: the slow blink's time left, and how many pets.
        let petT = 0,
            pets = 0
        const touch = () => window.matchMedia("(pointer: coarse)").matches

        const draw = (p: number, tug: number) => {
            for (let i = 0; i < N; i++) {
                const w = ease(clamp(p * (1 + STAGGER) - STAGGER * ((N - 1 - i) / (N - 1))))
                let x = tang[i][0] + (wound[i][0] - tang[i][0]) * w
                let y = tang[i][1] + (wound[i][1] - tang[i][1]) * w
                const z = tang[i][2] + (wound[i][2] - tang[i][2]) * w
                if (i >= NB && tug) {
                    const f = (i - NB) / (N - NB),
                        pull = tug * 34 * f * f
                    x += tailDir[0] * pull
                    y += tailDir[1] * pull
                }
                cur[i * 3] = x
                cur[i * 3 + 1] = y
                cur[i * 3 + 2] = z
            }
            if (cat) {
                // Pin the thread's end under the paw pad, following the swat.
                const [px, py] = PAW_PIVOT,
                    ca = Math.cos(pose.a),
                    sa = Math.sin(pose.a)
                const cx = 152 - px,
                    cy = 530 - py
                const x = px + cx * ca - cy * sa + pose.dx,
                    y = py + cx * sa + cy * ca + pose.dy
                const b = (pose.lean * Math.PI) / 180,
                    ox = 350,
                    oy = 630 // canvas CSS lean
                const rx = ox + (x - ox) * Math.cos(b) - (y - oy) * Math.sin(b),
                    ry = oy + (x - ox) * Math.sin(b) + (y - oy) * Math.cos(b)
                // The pad only holds the thread while it's down; lifted, the end
                // stays where it was dropped.
                const T: [number, number] = [280 + rx * 0.64 - 220, 475 - (208 + ry * 0.64)]
                if (!threadEnd) threadEnd = T
                else if (pose.contact) {
                    const k = Math.min(1, dt * 16)
                    threadEnd[0] += (T[0] - threadEnd[0]) * k
                    threadEnd[1] += (T[1] - threadEnd[1]) * k
                }
                if (pose.nudge) for (let i = 0; i < NB; i++) cur[i * 3] += pose.nudge
                const [tx, ty] = threadEnd
                const dx = tx - cur[(N - 1) * 3],
                    dy = ty - cur[(N - 1) * 3 + 1],
                    span = N - NB
                for (let i = NB; i < N; i++) {
                    const f = (i - NB) / (span - 1),
                        w = f * f * (3 - 2 * f)
                    cur[i * 3] += dx * w
                    cur[i * 3 + 1] += dy * w
                    if (f > 0.6) cur[i * 3 + 2] = Math.max(cur[i * 3 + 2], R * 0.4)
                }
            }
            // Split the strand into back / middle / front by depth, so the ball
            // reads as round without any real 3D.
            const d = ["", "", ""]
            let prev = -1
            const X = (i: number) => (220 + cur[i * 3]).toFixed(1),
                Y = (i: number) => (475 - cur[i * 3 + 1]).toFixed(1)
            for (let i = 0; i < N; i++) {
                const z = cur[i * 3 + 2] / R
                const t = z < -0.3 ? 0 : z < 0.25 ? 1 : 2
                if (t !== prev) {
                    d[t] += i > 0 ? `M${X(i - 1)} ${Y(i - 1)}L${X(i)} ${Y(i)}` : `M${X(i)} ${Y(i)}`
                    prev = t
                } else d[t] += `L${X(i)} ${Y(i)}`
            }
            backRef.current?.setAttribute("d", d[0])
            midRef.current?.setAttribute("d", d[1])
            frontRef.current?.setAttribute("d", d[2])
            const h = handleRef.current
            if (h) {
                h.setAttribute("cx", X(N - 1))
                h.setAttribute("cy", Y(N - 1))
            }
            const th = tailHitRef.current
            if (th) {
                let s = ""
                for (let i = NB + Math.floor((N - NB) * 0.35); i < N; i += 4) s += (s ? "L" : "M") + X(i) + " " + Y(i)
                th.setAttribute("d", s + "L" + X(N - 1) + " " + Y(N - 1))
            }
        }

        const drawCat = () => {
            const c = catRef.current
            if (!c || !cat) return
            const g = c.getContext("2d")!,
                [px, py] = PAW_PIVOT
            g.setTransform(1, 0, 0, 1, 0, 0)
            g.clearRect(0, 0, 1400, 1400)
            g.drawImage(cat.body, 0, 0)
            // Eyes: pupils follow the pointer (or watch the paw), with the
            // occasional blink.
            g.setTransform(2, 0, 0, 2, 0, 0)
            const [lx, ly] = look,
                bl = Math.max(0.06, Math.min(1, blink))
            for (const [ex, ey] of EYES) {
                g.save()
                g.beginPath()
                g.ellipse(ex, ey, EYE_R, EYE_R * bl, 0, 0, Math.PI * 2)
                g.fillStyle = THEME.eyeW
                g.fill()
                g.clip()
                g.fillStyle = THEME.eyeP
                g.beginPath()
                g.arc(ex + lx * 8, ey + ly * 7, 10.5, 0, Math.PI * 2)
                g.fill()
                g.fillStyle = THEME.eyeW
                g.beginPath()
                g.arc(ex + lx * 8 + 3.5, ey + ly * 7 - 4, 2.4, 0, Math.PI * 2)
                g.fill()
                g.restore()
            }
            g.setTransform(1, 0, 0, 1, 0, 0)
            g.translate((px + pose.dx) * 2, (py + pose.dy) * 2)
            g.rotate(pose.a)
            g.translate(-px * 2, -py * 2)
            g.drawImage(cat.paw, 0, 0)
        }

        const project = (e: PointerEvent) => {
            const ctm = svg.getScreenCTM()
            if (!ctm) return dragP
            const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse())
            const ax = 220 + yarn.Et[0],
                ay = 475 - yarn.Et[1],
                bx = 220 + yarn.Ew[0],
                by = 475 - yarn.Ew[1]
            const vx = bx - ax,
                vy = by - ay
            return clamp(((q.x - ax) * vx + (q.y - ay) * vy) / (vx * vx + vy * vy))
        }

        const frame = (now: number) => {
            dt = Math.min((now - prevT) / 1000, 0.1)
            prevT = now
            scale += (target - scale) * Math.min(1, dt * 4)
            clock += dt * scale
            const t = clock % 8
            let p: number
            let bat = 0
            let mode: "swat" | "draw" = "swat"
            if (dragging) p = dragP
            else p = t < 3 ? t / 3 : t < 4 ? 1 : t < 7 ? 1 - (t - 4) / 3 : 0
            if (progressRef.current != null && !dragging) p = progressRef.current
            if (cat) {
                // Untangle: three reach-and-draw strokes reeling the thread in.
                // Re-tangle: playful swats.
                for (const b of [0, 1, 2]) {
                    const d = t - b
                    if (d > 0 && d < 1) {
                        bat = d
                        mode = "draw"
                        break
                    }
                }
                if (!bat)
                    for (const b of [4.3, 5.35, 6.35]) {
                        const d = (t - b) / 0.75
                        if (d > 0 && d < 1) {
                            bat = d
                            break
                        }
                    }
            }
            pose = mode === "draw" ? drawPose(bat) : pawPose(bat)
            blinkT -= dt
            if (blinkT < -0.14) blinkT = 2.5 + Math.random() * 3.5
            blink = blinkT < 0 ? Math.abs(blinkT / 0.07 + 1) : 1
            // A slow blink after a pet: the eyes close over a third of it, stay shut, then open.
            if (petT > 0) {
                petT -= dt
                const u = 1 - petT / 1.2,
                    q = u < 0.35 ? u / 0.35 : u < 0.6 ? 1 : 1 - (u - 0.6) / 0.4,
                    e = q * q * (3 - 2 * q)
                blink = 1 - 0.94 * e
                blinkT = Math.max(blinkT, 2)
            }
            const lt = lookTarget ?? [-0.85, 0.55]
            const k = Math.min(1, dt * 9)
            look = [look[0] + (lt[0] - look[0]) * k, look[1] + (lt[1] - look[1]) * k]
            // The cat's own tug is replaced by the paw while it's on screen.
            draw(p, 0)
            const c = catRef.current
            if (c && cat) {
                c.style.opacity = "1"
                const breathe = Math.sin(clock * 2.2) * 0.008
                c.style.transform = `rotate(${pose.lean}deg) scale(${1 + breathe}, ${1 - breathe})`
                drawCat()
            }
            raf = requestAnimationFrame(frame)
        }

        let raf = 0
        let prevT = performance.now()
        let visible = false
        const start = () => {
            if (raf || reduced.matches || !visible) return
            prevT = performance.now()
            raf = requestAnimationFrame(frame)
        }
        const stop = () => {
            cancelAnimationFrame(raf)
            raf = 0
        }

        // Static frame: fully wound, eyes open, paw at rest.
        const drawStill = () => {
            pose = pawPose(0)
            draw(progressRef.current ?? 1, 0)
            if (cat && catRef.current) {
                catRef.current.style.opacity = "1"
                catRef.current.style.transform = "none"
                drawCat()
            }
        }
        draw(0, 0)

        // Hundreds of thousands of fur strokes: built once the browser is idle so
        // the hero text paints first. The canvas fades in when it's ready.
        const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1))
        const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout
        const idleId = idle(() => {
            cat = buildCat()
            if (reduced.matches) drawStill()
        })

        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
            if (visible) start()
            else stop()
        })
        io.observe(rootRef.current!)

        const onMotionChange = () => {
            if (reduced.matches) {
                stop()
                drawStill()
            } else start()
        }
        reduced.addEventListener("change", onMotionChange)
        if (reduced.matches) drawStill()

        // Whether a pointer is over the cat, in the cat canvas's 700 × 700 space.
        const catAt = (e: PointerEvent) => {
            const c = catRef.current
            if (!c || !cat) return null
            const r = c.getBoundingClientRect(),
                x = ((e.clientX - r.left) / r.width) * 700,
                y = ((e.clientY - r.top) / r.height) * 700
            const P = cat.parts
            return { x, y, on: P.head(x, y) < 8 || P.body(x, y) < 8 || P.tail(x, y) < 8 || P.paw(x, y) < 8 }
        }
        // On touch the cat is small, so a tap on or near her canvas counts. Taps on
        // the yarn grab the thread first (they set `dragging` before this runs).
        const nearCat = (e: PointerEvent) => {
            const c = catRef.current
            if (!c) return false
            const r = c.getBoundingClientRect(),
                pad = 16
            return e.clientX > r.left - pad && e.clientX < r.right + pad && e.clientY > r.top - pad && e.clientY < r.bottom + pad
        }
        const onMove = (e: PointerEvent) => {
            if (dragging) {
                dragP = project(e)
                if (reduced.matches) {
                    pose = pawPose(0)
                    draw(dragP, 0)
                }
            }
            // Eyes follow the pointer unless it's on the cat itself.
            const hit = catAt(e)
            if (!hit) return
            const { x, y, on: onCat } = hit
            if (onCat || dragging) {
                lookTarget = null
                return
            }
            const dx = x - (EYES[0][0] + EYES[1][0]) / 2,
                dy = y - (EYES[0][1] + EYES[1][1]) / 2,
                l = Math.hypot(dx, dy) || 1,
                m = Math.min(1, l / 140)
            lookTarget = [(dx / l) * m, (dy / l) * m]
        }
        const onUp = () => {
            if (!dragging) return
            dragging = false
            target = 1
            clock = Math.floor(clock / 8) * 8 + dragP * 3 // resume untangling from here
            ;[handleRef.current, tailHitRef.current].forEach((el) => el && (el.style.cursor = "grab"))
        }
        const onLookOut = (e: PointerEvent) => {
            if (!e.relatedTarget) lookTarget = null
        }
        const onDown = (e: PointerEvent) => {
            e.preventDefault()
            dragging = true
            dragP = project(e)
            ;(e.currentTarget as SVGElement).style.cursor = "grabbing"
        }
        const onPet = (e: PointerEvent) => {
            // Test the press itself: a tap on a touchscreen comes with no move before it.
            if (!pettable || dragging || !(catAt(e)?.on || (touch() && nearCat(e)))) return
            pets += 1
            petT = 1.2
            blinkT = 3
            if (pets === 1) {
                try {
                    console.log("%cYou found the cat. She likes you. — Diana", "color:#4f35b8;font-weight:600")
                } catch {}
            }
            const c = catRef.current,
                host = c?.parentElement
            if (!c || !host || reduced.matches) return
            const ex = (EYES[0][0] + EYES[1][0]) / 2 / 700,
                ey = Math.min(EYES[0][1], EYES[1][1]) / 700
            const el = document.createElement("span")
            el.textContent = "prrr"
            Object.assign(el.style, {
                position: "absolute",
                left: `${c.offsetLeft + c.offsetWidth * ex}px`,
                top: `${c.offsetTop + c.offsetHeight * ey - 18}px`,
                transform: "translate(-50%,0)",
                fontFamily: "Saans,'Helvetica Neue',sans-serif",
                fontSize: "13px",
                fontStyle: "italic",
                color: "#4f35b8",
                pointerEvents: "none",
                whiteSpace: "nowrap",
                zIndex: "3",
            })
            host.appendChild(el)
            const dx = (Math.random() - 0.5) * 30
            el.animate(
                [
                    { opacity: 0, transform: "translate(-50%,6px) rotate(-4deg)" },
                    { opacity: 1, offset: 0.25 },
                    { opacity: 0, transform: `translate(calc(-50% + ${dx}px),-34px) rotate(6deg)` },
                ],
                { duration: 1300, easing: "cubic-bezier(.2,0,0,1)" },
            ).onfinish = () => el.remove()
        }
        const onEnter = () => {
            if (!dragging) target = HOVER_SPEED
        }
        const onLeave = () => {
            if (!dragging) target = 1
        }

        window.addEventListener("pointermove", onMove)
        window.addEventListener("pointerup", onUp)
        window.addEventListener("pointerdown", onPet)
        document.addEventListener("pointerout", onLookOut)
        svg.addEventListener("pointerenter", onEnter)
        svg.addEventListener("pointerleave", onLeave)
        const grabbers = [handleRef.current, tailHitRef.current].filter(Boolean) as SVGElement[]
        grabbers.forEach((el) => el.addEventListener("pointerdown", onDown))

        return () => {
            stop()
            cancelIdle(idleId)
            io.disconnect()
            reduced.removeEventListener("change", onMotionChange)
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerup", onUp)
            window.removeEventListener("pointerdown", onPet)
            document.removeEventListener("pointerout", onLookOut)
            svg.removeEventListener("pointerenter", onEnter)
            svg.removeEventListener("pointerleave", onLeave)
            grabbers.forEach((el) => el.removeEventListener("pointerdown", onDown))
        }
    }, [])

    return (
        <div
            ref={rootRef}
            className={className}
            style={{ containerType: "size", width: "100%", height: "100%", display: "grid", placeItems: "center" }}
        >
            <div style={{ position: "relative", width: "min(92cqw, 92cqh)", aspectRatio: "1 / 1" }}>
                <svg
                    ref={svgRef}
                    viewBox="0 0 800 800"
                    aria-hidden="true"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", overflow: "visible", touchAction: "none" }}
                >
                    <defs>
                        <filter id="yarn-cat-fibre" x="-5%" y="-5%" width="110%" height="110%">
                            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="n" />
                            <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                    </defs>
                    <g filter="url(#yarn-cat-fibre)" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path ref={backRef} stroke={THEME.back} strokeWidth="1.5" />
                        <path ref={midRef} stroke={THEME.mid} strokeWidth="2" />
                        <path ref={frontRef} stroke={THEME.front} strokeWidth="2.6" />
                    </g>
                    <path
                        ref={tailHitRef}
                        fill="none"
                        stroke="rgba(116, 82, 198, 0)"
                        strokeWidth="44"
                        strokeLinecap="round"
                        className="transition-[stroke] duration-200 hover:stroke-[rgba(116,82,198,0.025)]"
                        style={{ pointerEvents: "stroke", cursor: "grab" }}
                    />
                    <circle
                        ref={handleRef}
                        r="48"
                        fill="rgba(116, 82, 198, 0)"
                        className="transition-[fill] duration-200 hover:fill-[rgba(116,82,198,0.03)]"
                        style={{ cursor: "grab" }}
                    />
                </svg>
                <canvas
                    ref={catRef}
                    width={1400}
                    height={1400}
                    role="img"
                    aria-label="A fluffy black cat batting at the yarn"
                    style={{
                        position: "absolute",
                        left: "35%",
                        top: "26%",
                        width: "56%",
                        aspectRatio: "1 / 1",
                        pointerEvents: "none",
                        transformOrigin: "50% 90%",
                        opacity: 0,
                        transition: "opacity 0.8s ease",
                    }}
                />
            </div>
        </div>
    )
}
