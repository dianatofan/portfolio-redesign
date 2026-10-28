// Glitter on the star and a code-drawn logo on the heel tab, for golden-goose-superstar.glb.
//
//   import { applyShoeMaterial, drawHeelLogo } from './shoe-material.js';
//   const gltf = await loader.loadAsync('golden-goose-superstar.glb');
//   const shoe = applyShoeMaterial(gltf.scene, {
//     starMask: await texLoader.loadAsync('star-mask.png'),
//     tabMask: await texLoader.loadAsync('tab-mask.png'),
//     logo: drawHeelLogo('GOLDEN GOOSE / ★'),
//   });
//   renderer.setAnimationLoop((t) => { shoe.update(t / 1000); renderer.render(scene, camera); });
//
// The masks are UV-space images of the GLB's texture: white where the star / the heel tab is.
import * as THREE from 'three';

// Heel tab geometry, measured on this model in its own (un-transformed) units: the tab wraps a
// vertical axis at (xc, zc); s is arc length around it, 0 = straight back. yMin/yMax are the tab's
// lower and upper edge at 20 points from s0 to s1.
const HEEL = {
  xc: 0.6177, zc: 0.0218, R: 0.2323, heelSign: 1, dir: -1,
  sMid: 0.0471, span: 0.7273, s0: -0.5039, s1: 0.5981,
  yMin: [0.1598, 0.1317, 0.0817, 0.0659, 0.0796, 0.0939, 0.1063, 0.1185, 0.1431, 0.1385,
         0.1429, 0.1161, 0.1016, 0.0882, 0.0767, 0.0634, 0.0965, 0.1634, 0.1627, 0.1627],
  yMax: [0.1682, 0.1704, 0.1813, 0.1990, 0.2318, 0.2587, 0.2902, 0.3132, 0.3275, 0.3304,
         0.3277, 0.3096, 0.2834, 0.2561, 0.2260, 0.1964, 0.1743, 0.1667, 0.1657, 0.1657],
};

/** A canvas texture with the heel lettering: white serif caps, wide tracking, transparent ground. */
export function drawHeelLogo(text = 'GOLDEN GOOSE / ★', { font = '"Times New Roman", Times, serif', color = '#ececec' } = {}) {
  const c = document.createElement('canvas');
  c.width = 2048; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = `400 150px ${font}`;
  if ('letterSpacing' in g) g.letterSpacing = '28px';
  g.fillText(text, c.width / 2, c.height / 2 + 6, c.width - 40);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.flipY = true;
  return t;
}

/**
 * Patches the shoe's MeshStandardMaterial in place.
 * options: starMask, tabMask, logo (Texture or null), logoWidth (0..1 of the tab's arc, default
 * 0.66), logoHeight (fraction of the tab's height the canvas covers, default 0.75), sparkle
 * (strength, default 1.6), flakes (flake density across UV, default 1400).
 */
export function applyShoeMaterial(root, opts) {
  const uniforms = {
    uTime: { value: 0 },
    uStarMask: { value: opts.starMask },
    uTabMask: { value: opts.tabMask },
    uLogo: { value: opts.logo ?? null },
    uLogoOn: { value: opts.logo ? 1 : 0 },
    uLogoWidth: { value: opts.logoWidth ?? 0.66 },
    uLogoHeight: { value: opts.logoHeight ?? 0.75 },
    uSparkle: { value: opts.sparkle ?? 3.0 },
    uFlakes: { value: opts.flakes ?? 900 },
    uHeel: { value: new THREE.Vector4(HEEL.xc, HEEL.zc, HEEL.R, HEEL.heelSign) },
    uArc: { value: new THREE.Vector4(HEEL.sMid, HEEL.span, HEEL.s0, HEEL.s1) },
    uDir: { value: HEEL.dir },
    uYMin: { value: HEEL.yMin },
    uYMax: { value: HEEL.yMax },
    uShoeMatrix: { value: new THREE.Matrix4() },
  };
  for (const t of [opts.starMask, opts.tabMask]) {
    if (!t) continue;
    t.flipY = false; t.colorSpace = THREE.NoColorSpace; t.needsUpdate = true; // glTF UV convention
  }

  let mesh = null;
  root.traverse((o) => { if (o.isMesh && !mesh) mesh = o; });
  const mat = mesh.material;

  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform mat4 uShoeMatrix;\nvarying vec3 vShoePos;\nvarying vec2 vUv0;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvShoePos = (uShoeMatrix * vec4(position, 1.0)).xyz;\nvUv0 = uv;');

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', /* glsl */ `#include <common>
        uniform float uTime, uLogoOn, uLogoWidth, uLogoHeight, uSparkle, uFlakes, uDir;
        uniform sampler2D uStarMask, uTabMask, uLogo;
        uniform vec4 uHeel, uArc;
        uniform float uYMin[20], uYMax[20];
        varying vec3 vShoePos;
        varying vec2 vUv0;
        float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
        vec3 hash32(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yxz + 33.33); return fract((p3.xxy + p3.yzz) * p3.zyx); }
        float band(float arr[20], float f) { float i = clamp(f, 0.0, 19.0); int a = int(floor(i)); int b = min(a + 1, 19); return mix(arr[a], arr[b], fract(i)); }
      `)
      // logo: tint the base colour where the tab is, before lighting
      .replace('#include <map_fragment>', /* glsl */ `#include <map_fragment>
        if (uLogoOn > 0.5) {
          float tab = texture2D(uTabMask, vUv0).r;
          if (tab > 0.5) {
            vec2 d = vec2((vShoePos.x - uHeel.x) * uHeel.w, vShoePos.z - uHeel.y);
            float s = atan(d.y, d.x) * uHeel.z;
            float f = (s - uArc.z) / (uArc.w - uArc.z) * 19.0;
            float y0 = band(uYMin, f), y1 = band(uYMax, f);
            float v = (vShoePos.y - y0) / max(y1 - y0, 1e-4);
            float u = uDir * (s - uArc.x) / (uArc.y * uLogoWidth / 0.66) + 0.5;
            float tv = (v - 0.5) / uLogoHeight + 0.5;
            if (u > 0.0 && u < 1.0 && tv > 0.0 && tv < 1.0) {
              vec4 ink = texture2D(uLogo, vec2(u, tv));
              diffuseColor.rgb = mix(diffuseColor.rgb, ink.rgb, ink.a * smoothstep(0.5, 0.7, tab));
            }
          }
        }
      `)
      // the star is a little shinier and more metallic than the leather
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nfloat starM = texture2D(uStarMask, vUv0).r;\nroughnessFactor = mix(roughnessFactor, 0.35, starM);')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\nmetalnessFactor = mix(metalnessFactor, 0.85, texture2D(uStarMask, vUv0).r);')
      // glitter: each UV cell is a flake with its own tilt; it flashes when it mirrors a light toward the eye
      .replace('#include <dithering_fragment>', /* glsl */ `#include <dithering_fragment>
        float sm = texture2D(uStarMask, vUv0).r;
        if (sm > 0.01) {
          vec2 cell = floor(vUv0 * uFlakes);
          vec2 inCell = fract(vUv0 * uFlakes) - 0.5;
          vec3 r = hash32(cell);
          vec3 nf = normalize(normal + (r - 0.5) * 2.2);
          vec3 V = normalize(vViewPosition);
          vec3 refl = reflect(-V, nf);
          vec3 L1 = normalize(vec3(0.4, 0.9, 0.5));
          vec3 L2 = normalize(vec3(-0.6, 0.3, 0.8));
          float flash = pow(max(dot(refl, L1), 0.0), 40.0) + pow(max(dot(refl, L2), 0.0), 40.0) + pow(max(dot(refl, V), 0.0), 120.0);
          float tw = 0.6 + 0.4 * sin(uTime * (2.0 + 3.0 * r.z) + r.x * 40.0);
          float dotShape = smoothstep(0.55, 0.1, length(inCell));
          gl_FragColor.rgb += vec3(1.0, 0.98, 0.95) * flash * tw * dotShape * sm * uSparkle;
        }
      `);
  };
  mat.customProgramCacheKey = () => 'shoe-glitter-logo';
  mat.needsUpdate = true;

  const inv = new THREE.Matrix4();
  return {
    uniforms,
    /** Call every frame with seconds. */
    update(t) {
      uniforms.uTime.value = t;
      root.updateMatrixWorld();
      inv.copy(root.matrixWorld).invert();
      uniforms.uShoeMatrix.value.multiplyMatrices(inv, mesh.matrixWorld); // mesh space -> model units
    },
    setLogo(texture) { uniforms.uLogo.value = texture; uniforms.uLogoOn.value = texture ? 1 : 0; },
  };
}
