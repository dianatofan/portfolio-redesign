"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

const blockAnim = {
    initial: {
        opacity: 0,
    },
    open: (i: number) => ({
        opacity: 1,
        transition: { duration: 0, delay: 0.03 * i },
    }),
    closed: (i: number) => ({
        opacity: 0,
        transition: { duration: 0, delay: 0.03 * i },
    }),
}

const contentAnim = {
    initial: {
        opacity: 0,
    },
    open: {
        opacity: 1,
        transition: { duration: 0.5, delay: 0.6 },
    },
    closed: {
        opacity: 0,
        transition: { duration: 0.3 },
    },
}

export function PixelTransitionMenu({
    isOpen,
    onClose,
}: {
    isOpen: boolean
    onClose: () => void
}) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const updateDimensions = () => {
            const { innerWidth, innerHeight } = window
            setDimensions({ width: innerWidth, height: innerHeight })
        }

        updateDimensions()
        window.addEventListener("resize", updateDimensions)
        return () => window.removeEventListener("resize", updateDimensions)
    }, [])

    const shuffle = (a: number[]): number[] => {
        const arr = [...a]
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
        }
        return arr
    }

    const getBlocks = () => {
        const blockSize = dimensions.width * 0.05
        const nbOfBlocks = Math.ceil(dimensions.height / blockSize)
        const shuffledIndexes = shuffle([...Array(nbOfBlocks)].map((_, i) => i))

        return shuffledIndexes.map((randomIndex, index) => (
            <motion.div
                key={index}
                className="w-full bg-black"
                style={{
                    height: `${blockSize}px`,
                }}
                variants={blockAnim}
                initial="initial"
                animate={isOpen ? "open" : "closed"}
                custom={randomIndex}
            />
        ))
    }

    if (dimensions.width === 0) return null

    return (
        <>
            {/* Pixel blocks overlay */}
            <motion.div
                className="fixed inset-0 pointer-events-none z-40 w-full"
                animate={isOpen ? "open" : "closed"}
                initial="closed"
            >
                <div className="flex h-full">
                    {[...Array(20)].map((_, index) => (
                        <div key={index} className="flex-1 flex flex-col">
                            {getBlocks()}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Menu content overlay */}
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-auto bg-black w-full"
                    variants={contentAnim}
                    initial="initial"
                    animate="open"
                    exit="closed"
                >
                    <div className="flex flex-col items-center gap-8">
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-6 p-2 rounded hover:bg-white/10 transition-colors duration-200"
                            aria-label="Close menu"
                        >
                            <span
                                className="material-symbols-outlined text-white"
                                style={{
                                    fontSize: 24,
                                    fontVariationSettings:
                                        '"FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24',
                                }}
                            >
                                close
                            </span>
                        </button>

                        <nav className="flex flex-col items-center gap-6">
                            <Link
                                href="/#work"
                                className="text-3xl font-medium text-white hover:text-white/70 transition-colors duration-200"
                                onClick={onClose}
                            >
                                work
                            </Link>
                            <Link
                                href="/about"
                                className="text-3xl font-medium text-white hover:text-white/70 transition-colors duration-200"
                                onClick={onClose}
                            >
                                about
                            </Link>
                        </nav>
                    </div>
                </motion.div>
            )}
        </>
    )
}

