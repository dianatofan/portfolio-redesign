/*
 * The hub's gem look, ported from prototype-library/server/assets/field/gem-shader.js
 * (and the finish table in cube-field.js): the same shader, panorama and
 * per-status finishes, so the case study's diamonds are the hub's diamonds.
 * Keep in step with the source by hand.
 */
import * as THREE from "three"

const GEM_VERT = `
  varying vec3 vN;
  varying vec3 vON;
  varying vec3 vWP;
  varying float vAlpha;
  #ifdef USE_INSTANCING
    attribute float aAlpha;
  #endif
  void main() {
    #ifdef USE_INSTANCING
      vAlpha = aAlpha;
    #else
      vAlpha = 1.0;
    #endif
    // Instancing-aware: the shower draws its gems through an InstancedMesh.
    vec4 lp = vec4(position, 1.0);
    mat3 nm = mat3(modelMatrix);
    #ifdef USE_INSTANCING
      lp = instanceMatrix * lp;
      nm = nm * mat3(instanceMatrix);
    #endif
    vec4 wp = modelMatrix * lp;
    vWP = wp.xyz;
    vN = normalize(nm * normal);
    vON = normal; // object space: stable per facet however the stone turns
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const GEM_FRAG = `
  uniform sampler2D uEnv;
  uniform vec3 uTint;
  uniform vec3 uDeep;
  uniform vec3 uLight;
  uniform float uTime;
  uniform float uEnvI;
  uniform float uSparkle;
  uniform float uTwinkle;
  uniform float uCaustic;
  uniform float uCausScale;
  uniform float uCausSpeed;
  uniform float uIOR;
  uniform float uDisp;
  uniform float uPrism;
  uniform float uAbsorb;
  uniform float uFacet;
  uniform float uFloor;
  uniform float uSoft;
  uniform float uGain;
  uniform float uOpacity;
  uniform float uEdge;
  varying vec3 vN;
  varying vec3 vON;
  varying vec3 vWP;
  varying float vAlpha;

  vec2 dir2uv(vec3 d) {
    return vec2(atan(d.z, d.x) * 0.15915494 + 0.5, acos(clamp(d.y, -1.0, 1.0)) * 0.31830989);
  }
  vec3 envAt(vec3 d) {
    vec3 c = texture2D(uEnv, dir2uv(normalize(d))).rgb;
    return c * c + uFloor; // cheap sRGB -> linear, plus a floor so the pavilion never goes dead
  }
  float facetHash(vec3 n) {
    return fract(sin(dot(floor(n * 6.0), vec3(12.9898, 78.233, 37.719))) * 43758.5453);
  }

  void main() {
    vec3 N = normalize(vN);
    vec3 V = normalize(cameraPosition - vWP);
    if (dot(N, V) < 0.0) N = -N;
    float f = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
    float eta = 1.0 / max(uIOR, 1.01);

    // Per-facet prism: each polygon splits the light its own way, so the
    // spectrum bends by a different amount and lands on a different hue.
    // Keyed off the OBJECT normal, so a facet keeps its identity as the stone
    // turns instead of popping between hash buckets every frame.
    vec3 ON = normalize(vON);
    float hp = facetHash(ON + 7.3);
    float spread = uDisp * (0.3 + 1.5 * hp);
    vec3 r1 = refract(-V, N, eta * (1.0 - spread));
    vec3 r2 = refract(-V, N, eta);
    vec3 r3 = refract(-V, N, eta * (1.0 + spread));
    vec3 inner = normalize(r2 + reflect(r2, -N) * 0.65);
    // Second internal bounce, tilted per facet: this is what keeps a large
    // facet from filling with one flat value — the pavilion mirrors itself.
    vec3 tilt = normalize(N + vec3(ON.z, ON.x, ON.y) * 0.42);
    vec3 inner2 = normalize(reflect(r2, tilt));
    vec3 inner3 = normalize(refract(inner2, -tilt, eta * 1.04));
    vec3 refr = vec3(envAt(r1).r, envAt(r2).g, envAt(r3).b) * 0.82
              + envAt(inner) * 0.4
              + envAt(inner2) * 0.3
              + envAt(inner3) * 0.22;
    vec3 prism = 0.5 + 0.5 * cos(6.2831853 * (vec3(0.0, 0.33, 0.67) + hp + dot(N, uLight) * 0.12));
    prism /= max(dot(prism, vec3(0.299, 0.587, 0.114)), 0.2); // hue only, brightness untouched
    refr *= mix(vec3(1.0), prism, clamp(uPrism * (0.55 + 0.45 * f), 0.0, 1.0));

    // Per-facet brightness: a real brilliant never shows two neighbours alike.
    float h = facetHash(ON);
    refr *= mix(1.0, 0.5 + 0.9 * h * h, uFacet);

    // Light falls from the top of the viewport: facets turned toward it read
    // softer and paler, the ones facing away keep the saturated body colour.
    float up = clamp(dot(N, uLight) * 0.5 + 0.5, 0.0, 1.0);
    refr *= mix(vec3(0.94), vec3(1.28), up * up);

    float thick = 1.0 - f;
    refr *= uTint * mix(vec3(1.0), uDeep * 1.6, uAbsorb * thick * (1.0 - 0.45 * up)) * uGain;
    refr = mix(refr, refr * 0.72 + vec3(0.3), uSoft * up);

    vec3 refl = envAt(reflect(-V, N)) * uEnvI;

    // Caustics: an animated three-axis interference pattern read in refracted
    // space, so the bands crawl across the facets as the stone turns.
    float ts = uTime * uCausSpeed;
    vec3 cp = r2 * uCausScale + vec3(ts * 0.28, ts * -0.21, ts * 0.17);
    float caus = sin(cp.x * 4.4) * sin(cp.y * 3.9 + 1.7) * sin(cp.z * 3.3 + 3.1);
    caus = pow(max(caus, 0.0), 2.2) * uCaustic;

    // Key glints share the one light direction, so every stone catches it from
    // the same place on screen; the hash-phased twinkle fires individual facets.
    vec3 L2 = normalize(uLight + vec3(-0.85, -0.5, 0.35));
    float glint = pow(max(dot(N, uLight), 0.0), 26.0) * 1.2
                + pow(max(dot(N, L2), 0.0), 40.0) * 0.8;
    // Twinkle breathes slowly and only where the facet already faces the light,
    // so it reads as a stone catching the light rather than a strobe.
    float twinkle = pow(0.5 + 0.5 * sin(uTime * 0.35 + h * 24.0), 6.0)
                  * pow(max(dot(N, uLight), 0.0), 8.0) * uTwinkle;

    vec3 col = mix(refr, refl, clamp(f * 0.85 + 0.06, 0.0, 1.0))
             + caus * vec3(1.0, 0.93, 1.0)
             + (glint + twinkle * 0.7) * uSparkle * mix(uTint, vec3(1.0), 0.65);

    // Facet seams: the object normal changes abruptly at every edge, so the
    // screen-space derivative spikes exactly there. Darkening that spike draws
    // the crisp junction lines a real cut stone has.
    float seam = clamp(length(fwidth(ON)) * uEdge, 0.0, 1.0);
    col *= mix(1.0, 0.34, seam);

    gl_FragColor = vec4(col, uOpacity * vAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const GEM_DEFAULTS = {
    ior: 2.42,
    dispersion: 0.05,
    prism: 0.35,
    envI: 1.5,
    sparkle: 1,
    twinkle: 0.6,
    caustic: 0.9,
    causticScale: 2.6,
    causticSpeed: 0.35,
    absorb: 0.7,
    facet: 1,
    floor: 0.05,
    soft: 0.3,
    gain: 1.62,
    opacity: 1,
    edge: 9,
    lightAzimuth: 8,
    lightElevation: 62,
}

type GemParams = Partial<typeof GEM_DEFAULTS>

// A ticket's status as a finish (cube-field.js STATUS_FINISH): not started is
// frosted, in progress is clear, in review throws the most light.
export type GemFinish = "frosted" | "clear" | "brilliant"

const FINISHES: Record<GemFinish | "base", GemParams> = {
    base: { absorb: 0.28, prism: 0.14, dispersion: 0.042, facet: 1.05, soft: 0.03, floor: 0.035, gain: 1.45, envI: 1.85, edge: 9, sparkle: 1.3, twinkle: 0.85, caustic: 0.75 },
    // Pushed apart from the hub's values: here the three stand side by side and
    // have to read as three states at a glance.
    clear: { prism: 0.06, dispersion: 0.015, sparkle: 0.7, twinkle: 0.3, caustic: 0.45, envI: 1.6 },
    brilliant: { prism: 0.36, dispersion: 0.11, gain: 1.7, envI: 2.4, sparkle: 2.6, twinkle: 1.9, caustic: 1.25 },
    frosted: { absorb: 0.4, prism: 0.03, dispersion: 0.008, facet: 0.35, soft: 0.85, gain: 1.3, envI: 1.1, sparkle: 0.25, twinkle: 0, caustic: 0.2 },
}

// The LiveOps Dashboard area's colours (build-index.mjs), mixed halfway from
// white as cube-field.js _makeSet does: a diamond with a blue cast.
const LIVEOPS = { tint: 0x93a7ff, deep: 0x6f86ff, hue: 0.5 }

function lightVector(az: number, el: number) {
    const a = (az * Math.PI) / 180
    const e = (el * Math.PI) / 180
    return new THREE.Vector3(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)).normalize()
}

// The studio panorama the shader samples: two softboxes and a horizon, 256x128.
export function studioEquirect() {
    const c = document.createElement("canvas")
    c.width = 256
    c.height = 128
    const g = c.getContext("2d")!
    const sky = g.createLinearGradient(0, 0, 0, 128)
    sky.addColorStop(0, "#f2f2f2")
    sky.addColorStop(0.5, "#7d7d80")
    sky.addColorStop(0.52, "#4a4a50")
    sky.addColorStop(1, "#1b1c22")
    g.fillStyle = sky
    g.fillRect(0, 0, 256, 128)
    const blob = (x: number, y: number, r: number, a: number) => {
        const rg = g.createRadialGradient(x, y, 0, x, y, r)
        rg.addColorStop(0, `rgba(255,255,255,${a})`)
        rg.addColorStop(1, "rgba(255,255,255,0)")
        g.fillStyle = rg
        g.fillRect(x - r, y - r, r * 2, r * 2)
    }
    blob(70, 34, 42, 1)
    blob(186, 20, 30, 0.85)
    blob(150, 96, 34, 0.4)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    tex.minFilter = THREE.LinearFilter
    tex.generateMipmaps = false
    return tex
}

export function gemMaterial(equirect: unknown, finish: GemFinish) {
    const p = { ...GEM_DEFAULTS, ...FINISHES.base, ...FINISHES[finish] }
    const tint = new THREE.Color(0xffffff).lerp(new THREE.Color(LIVEOPS.tint), LIVEOPS.hue)
    const deep = new THREE.Color(0xeef0f4).lerp(new THREE.Color(LIVEOPS.deep), LIVEOPS.hue + 0.06)
    const m = new THREE.ShaderMaterial({
        vertexShader: GEM_VERT,
        fragmentShader: GEM_FRAG,
        side: THREE.DoubleSide,
        uniforms: {
            uEnv: { value: equirect },
            uTint: { value: tint },
            uDeep: { value: deep },
            uLight: { value: lightVector(p.lightAzimuth, p.lightElevation) },
            uTime: { value: 0 },
            uEnvI: { value: p.envI },
            uSparkle: { value: p.sparkle },
            uTwinkle: { value: p.twinkle },
            uCaustic: { value: p.caustic },
            uCausScale: { value: p.causticScale },
            uCausSpeed: { value: p.causticSpeed },
            uIOR: { value: p.ior },
            uDisp: { value: p.dispersion },
            uPrism: { value: p.prism },
            uAbsorb: { value: p.absorb },
            uFacet: { value: p.facet },
            uFloor: { value: p.floor },
            uSoft: { value: p.soft },
            uGain: { value: p.gain },
            uOpacity: { value: p.opacity },
            uEdge: { value: p.edge },
        },
    })
    m.toneMapped = true
    return m
}
