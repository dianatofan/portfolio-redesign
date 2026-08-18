// Custom next/image loader.
//
// Two sources feed <Image> in this app and they want different handling:
//
//   * Cloudinary URLs — let Cloudinary do the resizing. Going through Next's
//     optimizer instead would re-encode an already-encoded WebP, so we build a
//     width-specific Cloudinary URL and get a real srcset in one pass.
//   * Local /public files — hand back the standard /_next/image URL so Next's
//     built-in optimizer (sharp) serves AVIF/WebP at the right width.
//
// Before this existed, next.config set `unoptimized: true`, which suppressed
// srcset generation entirely: every `sizes` prop in the repo was inert and local
// PNGs shipped at full resolution.

const CLOUDINARY_PREFIX = "https://res.cloudinary.com"
const UPLOAD_SEGMENT = "/image/upload/"

// Cloudinary transform parameter prefixes. Used to tell a baked-in transform
// segment apart from a folder name in the public id.
const TRANSFORM_KEYS = new Set([
    "a",
    "ar",
    "b",
    "bo",
    "br",
    "c",
    "co",
    "d",
    "dl",
    "dn",
    "dpr",
    "du",
    "e",
    "eo",
    "f",
    "fl",
    "fn",
    "g",
    "h",
    "l",
    "o",
    "p",
    "pg",
    "q",
    "r",
    "so",
    "t",
    "u",
    "vc",
    "w",
    "x",
    "y",
    "z",
])

function isTransformSegment(segment) {
    if (/^v\d+$/.test(segment)) return false // version, not a transform
    const parts = segment.split(",")
    return parts.every((part) => {
        const key = part.split("_")[0]
        return part.includes("_") && TRANSFORM_KEYS.has(key)
    })
}

// Sizing/encoding params we always re-derive per srcset entry.
const RESIZED_KEYS = new Set(["w", "h", "q", "f", "dpr"])
const CROPPING_MODES = new Set(["fill", "crop", "thumb", "pad", "lfill", "fill_pad"])

// Some URLs carry a deliberate crop (the about page frames portraits with
// c_fill,g_auto,w_900,h_1170). Dropping that would change the composition, so
// keep the crop intent and express the fixed w/h as an aspect ratio instead —
// that way the crop survives while the width is still free to vary per breakpoint.
function preservedCrop(segment) {
    const params = segment.split(",")
    const byKey = new Map(
        params.map((part) => [part.split("_")[0], part.slice(part.indexOf("_") + 1)])
    )

    const mode = byKey.get("c")
    if (!mode || !CROPPING_MODES.has(mode)) return []

    const kept = params.filter((part) => !RESIZED_KEYS.has(part.split("_")[0]))

    const width = byKey.get("w")
    const height = byKey.get("h")
    if (width && height && !byKey.has("ar")) {
        kept.unshift(`ar_${width}:${height}`)
    }

    return kept
}

function cloudinaryUrl(src, width, quality) {
    const uploadAt = src.indexOf(UPLOAD_SEGMENT)
    if (uploadAt === -1) return src

    const base = src.slice(0, uploadAt + UPLOAD_SEGMENT.length)
    const segments = src.slice(uploadAt + UPLOAD_SEGMENT.length).split("/")

    // Consume any transform the source URL already carries. We re-emit it as part
    // of a single segment rather than chaining, because chaining our width on top
    // of an existing one downscales an already-processed image — measurably worse
    // (133KB vs 18KB at w_640) since it encodes twice.
    let carried = []
    while (segments.length > 1 && isTransformSegment(segments[0])) {
        carried = carried.concat(preservedCrop(segments[0]))
        segments.shift()
    }

    // c_limit never upscales and never crops — the cards frame with aspect-[3/2]
    // plus object-cover, so cropping does not belong in the URL. A carried crop
    // brings its own c_ mode and wins.
    const hasCrop = carried.some((part) => part.startsWith("c_"))
    const transform = [
        ...carried,
        `w_${width}`,
        hasCrop ? null : "c_limit",
        `q_${quality ?? "auto:best"}`,
        "f_auto",
    ]
        .filter(Boolean)
        .join(",")

    return `${base}${transform}/${segments.join("/")}`
}

export default function imageLoader({ src, width, quality }) {
    if (src.startsWith(CLOUDINARY_PREFIX)) {
        return cloudinaryUrl(src, width, quality)
    }

    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 90}`
}
