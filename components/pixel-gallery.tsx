import Image from "next/image"

type Tile = {
    src: string
    alt: string
    /** When set, a browser/laptop mockup floats on top of the art (thumbnail look). */
    screen?: string
}

const tiles: Tile[] = [
    { src: "/images/pixel-clouds.png", alt: "Pixel-art forest under a purple sky with towering clouds" },
    {
        src: "/images/pixel-valley.png",
        alt: "Pixel-art lake valley with pines and mountains",
        screen: "/images/release-timeline-integrated.png",
    },
    { src: "/images/pixel-lighthouse.png", alt: "Pixel-art lighthouse on a rocky coast" },
    { src: "/images/pixel-mountain.png", alt: "Pixel-art mountain peak at dawn" },
]

/** A small browser-window mockup that floats over the art. */
function DeviceMock({ screen }: { screen: string }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center p-[8%]">
            <div className="w-full overflow-hidden rounded-lg border border-black/10 bg-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)]">
                <div className="flex items-center gap-1.5 rounded-t-lg bg-black/55 px-3 py-1.5 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                </div>
                <div className="relative aspect-[16/10] bg-card">
                    <Image src={screen} alt="" fill className="object-cover object-top" sizes="40vw" />
                </div>
            </div>
        </div>
    )
}

export function PixelGallery() {
    return (
        <section className="relative z-20 pb-16 md:pb-24">
            <div className="mx-auto w-full max-w-[1800px] space-y-6 px-6 md:space-y-8">
                <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                    Pixel studies
                </h2>
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                    {tiles.map((tile) => (
                        <div
                            key={tile.src}
                            className="relative aspect-[5/4] overflow-hidden rounded-xl bg-card"
                        >
                            <Image
                                src={tile.src}
                                alt={tile.alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 550px"
                            />
                            {tile.screen && <DeviceMock screen={tile.screen} />}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
