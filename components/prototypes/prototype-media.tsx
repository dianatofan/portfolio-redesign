import type { PrototypeDevice } from "@/lib/prototypes/google-maps-prototypes"

/**
 * The media slot for one prototype: 16:10 for desktop work, phone-shaped for
 * mobile. With no `src` it is a plain grey surface until the recording exists;
 * pass the recording's URL as `src` and it plays as a muted loop in the same box.
 */
export function PrototypeMedia({ device, src, label }: { device: PrototypeDevice; src?: string; label: string }) {
    const shape = device === "desktop" ? "aspect-[16/10] w-full" : "aspect-[9/19] w-full max-w-[220px] min-[1100px]:max-w-[280px]"

    return (
        <div className={`relative overflow-hidden rounded-[4px] bg-surface ${shape}`}>
            {src ? (
                <video
                    src={src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label={label}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            ) : (
                <span className="sr-only">{label}: recording coming soon</span>
            )}
        </div>
    )
}
