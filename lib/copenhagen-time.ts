/**
 * The hero and the about page both show the current time in Copenhagen.
 *
 * This is shared by two callers that cannot share code any other way: the React
 * components, and the tiny inline script in app/layout.tsx that paints the time
 * during HTML parse. The page is statically prerendered, so the server has no
 * useful "now" to render — before this, the clock showed "..." until React had
 * downloaded, parsed and hydrated, which on a real connection was most of a
 * second after the text was already on screen.
 *
 * Keep the formatting here identical to the inline script's, or the value will
 * visibly change when React takes over.
 */

export function formatCopenhagenTime(now: Date = new Date()): string {
    return now
        .toLocaleTimeString("en-US", {
            timeZone: "Europe/Copenhagen",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        })
        .replace(/\s?(AM|PM)$/, "$1") // no space before AM/PM
}

export function isCopenhagenNight(now: Date = new Date()): boolean {
    const hour = Number(
        new Intl.DateTimeFormat("en-US", {
            timeZone: "Europe/Copenhagen",
            hour: "numeric",
            hour12: false,
        }).format(now)
    )
    return hour >= 20 || hour < 6
}
