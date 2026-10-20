"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { DIAMOND_HEIGHT, DIAMOND_POSITIONS } from "./diamond-mesh"
import { gemMaterial, studioEquirect, type GemFinish } from "./gem-shader"

/*
 * One of the hub's diamonds, live: the real cut and the hub's own gem shader,
 * turning slowly with a gentle bob so the facets catch the light. Transparent,
 * so it sits straight on the page. Each stone is a tiny canvas of its own (a
 * handful on the page is well inside the browser's WebGL context limit); it
 * renders only while on screen, and draws one still frame with reduced motion.
 */

// The model loads once for every stone on the page.
let modelGeometry: Promise<unknown> | null = null

function fallbackGeometry() {
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(DIAMOND_POSITIONS.slice(), 3))
    g.computeVertexNormals()
    return g
}

// As cube-field.js loadGemGeometry: one merged, recentred, flat-normalled mesh.
function loadModel(): Promise<unknown> {
    if (modelGeometry) return modelGeometry
    modelGeometry = Promise.all([
        import("three/examples/jsm/loaders/FBXLoader.js"),
        fetch("/models/diamond.fbx").then((r) => r.arrayBuffer()),
    ]).then(([{ FBXLoader }, buf]) => {
        const root = new FBXLoader().parse(buf, "")
        root.updateMatrixWorld(true)
        const pos: number[] = []
        const v = new THREE.Vector3()
        const m = new THREE.Matrix4()
        root.traverse((o: { isMesh?: boolean; geometry?: { attributes?: { position?: { array: ArrayLike<number> } }; index?: { array: ArrayLike<number> } | null }; matrixWorld: { elements: number[] } }) => {
            const g = o.isMesh && o.geometry
            if (!g || !g.attributes || !g.attributes.position) return
            m.fromArray(o.matrixWorld.elements)
            const p = g.attributes.position.array
            const idx = g.index ? g.index.array : null
            const push = (i: number) => {
                v.set(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]).applyMatrix4(m)
                pos.push(v.x, v.y, v.z)
            }
            if (idx) for (let i = 0; i < idx.length; i++) push(idx[i])
            else for (let i = 0; i < p.length / 3; i++) push(i)
        })
        if (!pos.length) throw new Error("no mesh in diamond.fbx")
        const geo = new THREE.BufferGeometry()
        geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3))
        geo.computeBoundingBox()
        const size = geo.boundingBox.getSize(new THREE.Vector3())
        const c = geo.boundingBox.getCenter(new THREE.Vector3())
        const s = DIAMOND_HEIGHT / Math.max(size.y, 1e-6)
        geo.translate(-c.x, -c.y, -c.z)
        geo.scale(s, s, s)
        geo.computeVertexNormals()
        return geo
    })
    return modelGeometry
}

export default function LiveGemCanvas({
    finish,
    rotateOffset = 0,
    onReady,
}: {
    finish: GemFinish
    rotateOffset?: number
    onReady?: () => void
}) {
    const hostRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const host = hostRef.current
        if (!host) return
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setClearColor(0x000000, 0)
        renderer.toneMapping = THREE.NoToneMapping
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        const canvas = renderer.domElement as HTMLCanvasElement
        canvas.style.display = "block"
        canvas.style.width = "100%"
        canvas.style.height = "100%"
        host.appendChild(canvas)

        const equirect = studioEquirect()
        const material = gemMaterial(equirect, finish)
        let geometry = fallbackGeometry()
        const mesh = new THREE.Mesh(geometry, material)
        const scene = new THREE.Scene()
        scene.add(mesh)

        // Framed as the hub frames a single stone (cube-field.js sprite).
        const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50)
        const frame = () => {
            geometry.computeBoundingSphere()
            const rad = geometry.boundingSphere ? geometry.boundingSphere.radius : 0.7
            camera.position.set(0, rad * 0.08, (rad * 1.12) / Math.tan((28 * Math.PI) / 360))
            camera.lookAt(0, 0, 0)
        }
        frame()

        const resize = () => {
            const w = host.clientWidth || 1
            const h = host.clientHeight || 1
            renderer.setSize(w, h, false)
            camera.aspect = w / h
            camera.updateProjectionMatrix()
        }
        resize()

        const start = performance.now()
        const draw = (now: number) => {
            const t = (now - start) / 1000
            // One turn every 12 seconds, tilted so the table shows above the girdle (the
            // hub's spin uses 0.2), a little rock forward and back, and a bob.
            mesh.rotation.set(0.2 + Math.sin(t * 0.5) * 0.08, rotateOffset + (t * Math.PI * 2) / 12, 0)
            mesh.position.y = Math.sin(t * 0.9) * 0.025
            material.uniforms.uTime.value = t
            renderer.render(scene, camera)
        }

        let raf = 0
        let visible = false
        const loop = (now: number) => {
            draw(now)
            raf = requestAnimationFrame(loop)
        }
        const play = () => {
            if (!raf && visible && !reduced) raf = requestAnimationFrame(loop)
        }
        const pause = () => {
            cancelAnimationFrame(raf)
            raf = 0
        }

        let disposed = false
        loadModel()
            .then((geo) => {
                if (disposed) return
                geometry.dispose()
                geometry = geo as typeof geometry
                mesh.geometry = geometry
                frame()
            })
            .catch(() => {})
            .finally(() => {
                if (disposed) return
                // Reduced motion: one still frame, at a flattering angle.
                draw(start + 1800)
                onReady?.()
            })

        const io = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting
            if (visible) play()
            else pause()
        })
        io.observe(host)
        const ro = new ResizeObserver(() => {
            resize()
            if (!raf) draw(performance.now())
        })
        ro.observe(host)

        return () => {
            disposed = true
            pause()
            io.disconnect()
            ro.disconnect()
            material.dispose()
            equirect.dispose()
            if (geometry !== mesh.geometry) geometry.dispose()
            renderer.dispose()
            renderer.forceContextLoss()
            canvas.remove()
        }
    }, [finish, rotateOffset, onReady])

    return <div ref={hostRef} className="absolute inset-0" />
}
