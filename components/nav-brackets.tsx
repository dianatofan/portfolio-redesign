import { useId } from "react"

/*
 * Two hand-drawn purple brackets around the current nav or table-of-contents
 * item. The pencil look is a turbulence displacement on plain strokes; each
 * bracket draws in with a stroke-dash animation, the second one a beat later.
 * Paths are from Portfolio.dc.html in the design handoff.
 */
export function NavBrackets() {
    const filterId = `pencil-${useId().replace(/:/g, "")}`

    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            className="pointer-events-none absolute -left-3 -top-[3px] h-[calc(100%+6px)] w-[calc(100%+24px)] overflow-visible"
        >
            <defs>
                <filter id={filterId} x="-20%" y="-40%" width="140%" height="180%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
                </filter>
            </defs>
            <g filter={`url(#${filterId})`} fill="none" stroke="#4f35b8" strokeLinecap="round">
                <path
                    d="M15 10 C 9.5 15, 8 23, 13.5 31.5"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                    pathLength={1}
                    className="motion-safe:animate-[scrib_.3s_cubic-bezier(.4,0,.2,1)_both]"
                    style={{ strokeDasharray: 1 }}
                />
                <path
                    d="M84.5 8.5 C 91 13, 92.5 22, 86 29 C 85 30, 84 30.5, 83 31"
                    strokeWidth="1.4"
                    vectorEffect="non-scaling-stroke"
                    pathLength={1}
                    className="motion-safe:animate-[scrib_.3s_.14s_cubic-bezier(.4,0,.2,1)_both]"
                    style={{ strokeDasharray: 1 }}
                />
            </g>
        </svg>
    )
}
