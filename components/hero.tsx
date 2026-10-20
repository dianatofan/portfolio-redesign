import { HeroThread } from "./hero-thread"

/*
 * Editorial hero: one large headline and the yarn thread underneath it. The
 * Copenhagen time lives in the header now, so the hero carries nothing else.
 */
export function Hero() {
    return (
        <section className="relative px-gutter pt-16 pb-14 sm:pt-28 sm:pb-24 xl:pt-40 xl:pb-28">
            <h1 className="m-0 max-w-[10.5em] text-[clamp(44px,7vw,112px)] leading-[0.96] font-medium tracking-[-0.05em] text-balance">
                I&apos;m Diana, a design engineer untangling complex systems.
            </h1>
            <div className="mt-10">
                <HeroThread />
            </div>
        </section>
    )
}
