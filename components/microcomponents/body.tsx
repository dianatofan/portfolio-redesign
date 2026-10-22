"use client"

// Split out of index.tsx so it can be loaded with `next/dynamic`: none of the
// board is visible when the homepage opens, so it stays out of the initial
// bundle and the hero's renderer starts sooner.

import { Board } from "./board"

// Default export so `next/dynamic` can pick it up without a selector.
export default function MicrocomponentsBody() {
    return <Board />
}
