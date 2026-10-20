import type { CSSProperties, ReactNode } from "react"

/**
 * Retro silver Lab frames, one family (Macintosh material).
 * All sizes in cqw so frames keep proportions at any card width.
 * types: "mac" | "powerbook" | "window" | "phone"
 */
export type LabFrameType = "mac" | "powerbook" | "window" | "phone"
type Props = {
    type: LabFrameType
    src?: string | string[]
    alt?: string
    url?: string
    play?: boolean
    className?: string
}

const SILVER = "linear-gradient(160deg,#d6d7d9 0%,#b3b5b8 55%,#a7a9ac 100%)"
const HL = "inset 0 .5cqw 0 rgba(255,255,255,.9),inset 1cqw 0 2cqw rgba(255,255,255,.5)"
const DROP = "0 6cqw 9cqw -4.5cqw rgba(22,21,26,.45)"

function Screen({
    ratio,
    src,
    alt,
    bezel,
    r1,
    r2,
    ring = ".5cqw",
}: {
    ratio: string
    src?: string
    alt?: string
    bezel: string
    r1: string
    r2: string
    ring?: string
}) {
    return (
        <div
            style={{
                width: "100%",
                boxSizing: "border-box",
                background: "linear-gradient(180deg,#9a9ca0,#c6c8cb)",
                borderRadius: r1,
                padding: bezel,
                boxShadow:
                    "inset 0 1cqw 2.2cqw rgba(0,0,0,.18),inset 0 -.3cqw 0 rgba(255,255,255,.7)",
            }}
        >
            <div
                style={{
                    position: "relative",
                    aspectRatio: ratio,
                    borderRadius: r2,
                    overflow: "hidden",
                    background: "#e9eaed",
                }}
            >
                {src && (
                    // A .webm or .mp4 src plays as a muted loop; anything else is a still.
                    <MediaEl
                        src={src}
                        alt={alt ?? ""}
                        style={{
                            position: "absolute",
                            inset: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                )}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        borderRadius: "inherit",
                        boxShadow: `inset 0 0 0 ${ring} #2c2c2a`,
                        background:
                            "linear-gradient(155deg,rgba(255,255,255,.3) 0%,transparent 35%)",
                    }}
                />
            </div>
        </div>
    )
}

function MediaEl({ src, alt, style }: { src: string; alt: string; style: CSSProperties }) {
    if (/\.(webm|mp4)$/.test(src)) {
        return <video src={src} poster={src.replace(/\.(webm|mp4)$/, ".jpg")} autoPlay muted loop playsInline aria-label={alt || undefined} style={style} />
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} loading="lazy" style={style} />
}

const key = (w: string): CSSProperties => ({
    width: w,
    height: "1.4cqw",
    borderRadius: ".3cqw",
    background: "linear-gradient(180deg,#9a9ca0,#c6c8cb)",
    boxShadow: "inset 0 .2cqw .4cqw rgba(0,0,0,.25)",
})

function Mac({ src, alt }: { src?: string; alt?: string }) {
    return (
        <div
            style={{
                width: "38cqw",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: SILVER,
                    borderRadius: "3cqw 3cqw 1cqw 1cqw",
                    padding: "2.8cqw 3.4cqw 0",
                    boxShadow: `${HL},${DROP}`,
                }}
            >
                <Screen ratio="4/3" src={src} alt={alt} bezel="1.4cqw" r1="1.9cqw" r2="1.6cqw" />
                <div style={{ position: "relative", height: "11cqw" }}>
                    <span
                        style={{
                            position: "absolute",
                            right: "1cqw",
                            top: "3.4cqw",
                            width: "13cqw",
                            height: "1.1cqw",
                            borderRadius: ".3cqw",
                            background: "linear-gradient(180deg,#121212,#262626)",
                            boxShadow:
                                "inset 0 .3cqw .5cqw rgba(0,0,0,.6),0 .15cqw 0 rgba(255,255,255,.8)",
                        }}
                    />
                    <span
                        style={{
                            position: "absolute",
                            left: ".4cqw",
                            bottom: "2cqw",
                            width: "2.2cqw",
                            height: "2.2cqw",
                            borderRadius: ".5cqw",
                            background: "linear-gradient(180deg,#c6c8cb,#9a9ca0)",
                            boxShadow: "inset 0 .15cqw 0 rgba(255,255,255,.6)",
                        }}
                    />
                    <span
                        style={{
                            position: "absolute",
                            right: "1cqw",
                            bottom: "2cqw",
                            display: "flex",
                            gap: ".5cqw",
                        }}
                    >
                        <span
                            style={{
                                width: ".4cqw",
                                height: "3cqw",
                                borderRadius: 999,
                                background: "rgba(0,0,0,.14)",
                            }}
                        />
                        <span
                            style={{
                                width: ".4cqw",
                                height: "3cqw",
                                borderRadius: 999,
                                background: "rgba(0,0,0,.14)",
                            }}
                        />
                        <span
                            style={{
                                width: ".4cqw",
                                height: "3cqw",
                                borderRadius: 999,
                                background: "rgba(0,0,0,.14)",
                            }}
                        />
                    </span>
                </div>
            </div>
            <div
                style={{
                    width: "86%",
                    height: "2.2cqw",
                    background: "linear-gradient(180deg,#a7a9ac,#c4c5c8)",
                    borderRadius: "0 0 1cqw 1cqw",
                    boxShadow: "inset 0 .4cqw .6cqw rgba(0,0,0,.18)",
                }}
            />
        </div>
    )
}

function PowerBook({ src, alt }: { src?: string; alt?: string }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div
                style={{
                    width: "62cqw",
                    boxSizing: "border-box",
                    padding: "2.4cqw",
                    background: SILVER,
                    borderRadius: "2.8cqw 2.8cqw 1cqw 1cqw",
                    boxShadow: HL,
                }}
            >
                <Screen ratio="16/10" src={src} alt={alt} bezel="1.3cqw" r1="1.6cqw" r2="1cqw" />
            </div>
            <div
                style={{
                    width: "72cqw",
                    height: "3.6cqw",
                    background: "linear-gradient(180deg,#dcdddf 0%,#c4c5c8 60%,#a7a9ac 100%)",
                    borderRadius: ".4cqw .4cqw 2cqw 2cqw",
                    boxShadow: `inset 0 .3cqw 0 rgba(255,255,255,.9),${DROP}`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1.4cqw",
                }}
            >
                <span style={key("3.6cqw")} />
                <span
                    style={{
                        width: "1.8cqw",
                        height: "1.8cqw",
                        borderRadius: "50%",
                        background: "radial-gradient(circle at 35% 30%,#5b5d62,#121212)",
                        boxShadow: "0 .1cqw 0 rgba(255,255,255,.8)",
                    }}
                />
                <span style={key("3.6cqw")} />
            </div>
        </div>
    )
}

function Window({ src, alt, url }: { src?: string; alt?: string; url?: string }) {
    return (
        <div
            style={{
                width: "72cqw",
                boxSizing: "border-box",
                padding: ".6cqw 1.4cqw 1.4cqw",
                background: SILVER,
                borderRadius: "1.6cqw",
                boxShadow: `${HL},${DROP}`,
            }}
        >
            <div
                style={{
                    position: "relative",
                    height: "4cqw",
                    boxSizing: "border-box",
                    padding: "1cqw 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                        "repeating-linear-gradient(180deg,#8e9094 0 .25cqw,transparent .25cqw .6cqw)",
                    backgroundClip: "content-box",
                }}
            >
                <span
                    style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        width: "2cqw",
                        height: "2cqw",
                        marginTop: "-1cqw",
                        background: "#d6d7d9",
                        boxShadow: "0 0 0 .5cqw #c4c5c8,inset 0 0 0 .2cqw #6e7074",
                    }}
                />
                <span
                    style={{
                        padding: "0 1.6cqw",
                        background: "#c4c5c8",
                        fontSize: "1.9cqw",
                        fontWeight: 500,
                        color: "#2c2c2a",
                        lineHeight: 1,
                    }}
                >
                    {url ?? "dianatofan.net"}
                </span>
            </div>
            <Screen
                ratio="16/9"
                src={src}
                alt={alt}
                bezel=".9cqw"
                r1=".8cqw"
                r2=".4cqw"
                ring=".4cqw"
            />
        </div>
    )
}

function Phone({ src, alt }: { src?: string; alt?: string }) {
    return (
        <div
            style={{
                width: "23.5cqw",
                boxSizing: "border-box",
                padding: "1.4cqw 1.4cqw 0",
                background: SILVER,
                borderRadius: "3.4cqw",
                boxShadow: `inset 0 .4cqw 0 rgba(255,255,255,.9),inset .8cqw 0 1.6cqw rgba(255,255,255,.5),${DROP}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <span
                style={{
                    width: "5cqw",
                    height: ".8cqw",
                    margin: ".6cqw 0 1.2cqw",
                    borderRadius: 999,
                    background: "linear-gradient(180deg,#121212,#262626)",
                    boxShadow: "0 .1cqw 0 rgba(255,255,255,.8)",
                }}
            />
            <Screen
                ratio="9/16"
                src={src}
                alt={alt}
                bezel=".8cqw"
                r1="1.4cqw"
                r2=".8cqw"
                ring=".4cqw"
            />
            <span
                style={{
                    width: "3.2cqw",
                    height: "3.2cqw",
                    margin: "1cqw 0",
                    borderRadius: "50%",
                    background: "linear-gradient(180deg,#c6c8cb,#9a9ca0)",
                    boxShadow: "inset 0 .2cqw .4cqw rgba(0,0,0,.25),0 .1cqw 0 rgba(255,255,255,.8)",
                }}
            />
        </div>
    )
}

export function LabFrame({ type, src, alt, url, play = true, className }: Props) {
    const one = Array.isArray(src) ? src[0] : src
    let frame: ReactNode
    if (type === "mac") frame = <Mac src={one} alt={alt} />
    else if (type === "powerbook") frame = <PowerBook src={one} alt={alt} />
    else if (type === "window") frame = <Window src={one} alt={alt} url={url} />
    else frame = <Phone src={one} alt={alt} />
    return (
        <div
            className={className}
            style={{
                position: "relative",
                aspectRatio: "4/3",
                containerType: "inline-size",
                background: "#f1f2f4",
                borderRadius: 24,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "3cqw",
            }}
        >
            {play && (
                <span
                    style={{
                        position: "absolute",
                        left: 12,
                        top: 12,
                        padding: "5px 12px",
                        borderRadius: 999,
                        background: "#fff",
                        fontSize: 15,
                        zIndex: 3,
                    }}
                >
                    ▶ Play
                </span>
            )}
            <div style={{ marginTop: "4cqw", display: "flex", gap: "3cqw", alignItems: "center" }}>
                {frame}
            </div>
        </div>
    )
}
export default LabFrame

/* Usage
<LabFrame type="powerbook" src="/lab/golden-goose.png" />
<LabFrame type="mac" src="/lab/terminal.png" />
<LabFrame type="phone" src="/lab/jenga.png" />
<LabFrame type="window" src="/lab/boeuf.png" url="dianatofan.net/salata-de-boeuf" />
*/
