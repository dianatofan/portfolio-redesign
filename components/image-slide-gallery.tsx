"use client"

import { useState, useRef, useEffect, useContext } from "react"
import { createPortal } from "react-dom"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { CursorContext } from "@/context/CursorContext"

type GalleryProject = {
    title: string
    src: string
    href?: string
    year?: string
    tags?: string[]
    subtitle?: string
}

const MODAL_W = 320
const MODAL_H = 200

const scaleAnimation = {
    initial: { scale: 0, x: "-50%", y: "-50%" },
    enter: {
        scale: 1,
        x: "-50%",
        y: "-50%",
        transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] },
    },
    closed: {
        scale: 0,
        x: "-50%",
        y: "-50%",
        transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] as [number, number, number, number] },
    },
}

function GalleryModal({
    modal,
    projects,
}: {
    modal: { active: boolean; index: number }
    projects: GalleryProject[]
}) {
    const { active, index } = modal
    const modalContainer = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return
        const xMove = gsap.quickTo(modalContainer.current, "left", { duration: 0.8, ease: "power3" })
        const yMove = gsap.quickTo(modalContainer.current, "top", { duration: 0.8, ease: "power3" })

        const onMouseMove = (e: MouseEvent) => {
            xMove(e.clientX)
            yMove(e.clientY)
        }

        window.addEventListener("mousemove", onMouseMove)
        return () => window.removeEventListener("mousemove", onMouseMove)
    }, [mounted])

    if (!mounted) return null

    return createPortal(
        <motion.div
            ref={modalContainer}
            variants={scaleAnimation}
            initial="initial"
            animate={active ? "enter" : "closed"}
            className="pointer-events-none fixed z-[9998] overflow-hidden rounded-xl"
            style={{ width: MODAL_W, height: MODAL_H, top: "50%", left: "50%" }}
        >
            <div
                className="relative w-full"
                style={{
                    top: `${index * -MODAL_H}px`,
                    transition: "top 0.5s cubic-bezier(0.76, 0, 0.24, 1)",
                }}
            >
                {projects.map((project, i) => (
                    <div key={`modal_${i}`} className="relative w-full" style={{ height: MODAL_H }}>
                        <Image
                            src={project.src}
                            fill
                            alt={project.title}
                            className="object-cover"
                            sizes={`${MODAL_W}px`}
                        />
                    </div>
                ))}
            </div>
        </motion.div>,
        document.body
    )
}

function ProjectRow({
    index,
    project,
    setModal,
}: {
    index: number
    project: GalleryProject
    setModal: (v: { active: boolean; index: number }) => void
}) {
    const { setVariant } = useContext(CursorContext)

    const handleEnter = () => {
        setModal({ active: true, index })
        setVariant("open")
    }

    const handleLeave = () => {
        setModal({ active: false, index })
        setVariant("default")
    }

    const inner = (
        <div
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            className="group flex cursor-none items-center justify-between border-t border-border py-6 last:border-b"
        >
            <div>
                <h3 className="text-xl font-medium text-foreground transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-x-2 md:text-2xl">
                    {project.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{project.subtitle ?? "Design & Development"}</p>
            </div>
            {(project.year || (project.tags && project.tags.length > 0)) && (
                <span className="shrink-0 text-xs uppercase tracking-widest text-[var(--text-tertiary)]">
                    {project.year ?? project.tags?.join(" · ")}
                </span>
            )}
        </div>
    )

    const isExternal = project.href?.startsWith("http")

    return project.href ? (
        <Link
            href={project.href}
            className="block"
            onFocus={handleEnter}
            onBlur={handleLeave}
            {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
        >
            {inner}
        </Link>
    ) : (
        inner
    )
}

export function ImageSlideGallery({ projects }: { projects: GalleryProject[] }) {
    const [modal, setModal] = useState({ active: false, index: 0 })

    return (
        <div className="relative w-full">
            {projects.map((project, index) => (
                <ProjectRow key={project.title} index={index} project={project} setModal={setModal} />
            ))}
            <GalleryModal modal={modal} projects={projects} />
        </div>
    )
}
