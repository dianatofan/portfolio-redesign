"use client"

import { useContext, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CursorContext } from "@/context/CursorContext"

/*
 * Built in Code as a Material 3 style expanding strip: one item open wide, the
 * rest thin slices. Hovering or focusing a slice opens it and the others give
 * way, by animating flex-grow. On touch, the first tap opens a slice and the
 * second follows its link. The open item shows its title over the image.
 */

type GalleryProject = {
    title: string
    src: string
    href?: string
    newTab?: boolean
    year?: string
    tags?: readonly string[]
    subtitle?: string
}

export function BuiltInCodeGallery({ projects }: { projects: GalleryProject[] }) {
    const { setVariant } = useContext(CursorContext)
    const [active, setActive] = useState(0)

    return (
        <ul className="flex h-[220px] gap-2 md:h-[280px] md:gap-3">
            {projects.map((project, i) => {
                const open = i === active
                const href = project.href ?? "#"
                const external = project.newTab || /^https?:/.test(href)

                return (
                    <li
                        key={project.title}
                        className="min-w-0 transition-[flex-grow] duration-500 ease-[cubic-bezier(.2,0,0,1)] motion-reduce:transition-none"
                        style={{ flexGrow: open ? 5 : 1, flexBasis: 0 }}
                    >
                        <Link
                            href={href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                            aria-label={project.subtitle ? `${project.title}: ${project.subtitle}` : project.title}
                            className="group relative block h-full overflow-hidden rounded-2xl bg-card"
                            onMouseEnter={() => {
                                setActive(i)
                                setVariant("open")
                            }}
                            onMouseLeave={() => setVariant("default")}
                            onFocus={() => setActive(i)}
                            onClick={(event) => {
                                // A closed slice opens on the first tap instead of navigating.
                                if (!open) {
                                    event.preventDefault()
                                    setActive(i)
                                    return
                                }
                                setVariant("default")
                            }}
                        >
                            <Image
                                src={project.src}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 60vw, 40vw"
                            />
                            {/* Hairline edge, so a light screenshot doesn't bleed into the page. */}
                            <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/[0.06]" />

                            {/* Title on the open item only, fading in once it has room. */}
                            <div
                                aria-hidden
                                className={`pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 pt-12 transition-opacity md:p-5 md:pt-16 ${
                                    open ? "opacity-100 delay-200 duration-300" : "opacity-0 duration-150"
                                }`}
                            >
                                <p className="truncate font-medium text-white">{project.title}</p>
                                {project.subtitle && (
                                    <p className="mt-0.5 truncate text-sm text-white/80">{project.subtitle}</p>
                                )}
                            </div>
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}
