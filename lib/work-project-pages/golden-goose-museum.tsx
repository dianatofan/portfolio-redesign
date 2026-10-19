import Image from "next/image"
import type { WorkProjectPage } from "./types"

function Shot({ src, alt, ratio }: { src: string; alt: string; ratio: string }) {
  return (
    <div className={`relative ${ratio} overflow-hidden rounded-lg bg-card`}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
    </div>
  )
}

export const goldenGooseMuseumPage: WorkProjectPage = {
  displayTitle: "Golden Goose Digital Museum",
  subtitle: "3D Superstar sneakers for a digital museum, and the tool I built to paint them.",
  heroImage: "/images/golden-goose-hero.webp",
  description:
    "Low-poly 3D Golden Goose Superstar sneakers and a browser-based part painter with an AI magic wand.",
  published: "October 2026",
  readTime: "1 min read",
  meta: [
    { label: "Role", values: ["3D", "Tool design"] },
    { label: "Type", values: ["Side project"] },
    { label: "Tools", values: ["Blender", "three.js", "Claude Code"] },
  ],
  sections: [],
  story: [
    {
      title: "Seven sneakers",
      text: [
        "I'm building a small digital museum of Golden Goose Superstars.",
        "It needs seven 3D models that look real and still load fast on the web.",
      ],
      visual: (
        <Shot
          src="/images/golden-goose-renders.webp"
          alt="The 3D Superstar sneaker rendered from six angles"
          ratio="aspect-[6/5]"
        />
      ),
    },
    {
      title: "Light, but real",
      text: [
        "Each shoe is around 10 to 15 thousand triangles. The textures do the realistic work.",
        "I matched the heel tab, the tongue label and the one sparkly star to photos of real pairs, and refined the shapes in Blender with Claude.",
      ],
    },
    {
      title: "A painter for the parts",
      text: [
        "To make colourways, I built a part painter in the browser. Trace a part, fill it, and see it on the 3D shoe.",
        "An AI magic wand guesses where a part ends, and it works with Apple Pencil on the iPad.",
      ],
      visual: (
        <Shot
          src="/images/golden-goose-painter.webp"
          alt="The part painter: a 3D sneaker with the heel tab, laces, star and sole each painted a different colour, and tools for pen, brush, eraser and wand"
          ratio="aspect-[4/3]"
        />
      ),
    },
    {
      title: "Colourways",
      text: [
        "Once the parts are painted, a new colourway is a few clicks. The viewer has twelve so far.",
        "The other six models and the museum itself are next.",
      ],
      visual: (
        <Shot
          src="/images/golden-goose-colourways.webp"
          alt="Eight colourways of the 3D sneaker: silver, black, pink, green and gold stars, black laces, an all-black pair and an orange heel tab"
          ratio="aspect-[160/69]"
        />
      ),
    },
  ],
  renderBeforeGate: () => null,
}
