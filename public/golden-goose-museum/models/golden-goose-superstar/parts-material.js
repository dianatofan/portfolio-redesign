// Per-part recolouring for golden-goose-superstar-{left,right}.glb, driven by a part map.
//
// parts-id-<side>.png is laid out like the shoe's texture; each texel's grey value says which part it
// belongs to (part index × 36): Upper, Sole, HeelTab, TongueLabel, Star, Laces, Lining. Edit it with
// paint-parts.html. With no tint a part looks exactly like the scan; with a tint the texture is
// re-coloured in a way that suits it:
//
//   light  (Upper, Sole, Laces, Lining, TongueLabel): texture × tint, keeps grain, scuffs and stitching
//   print  (HeelTab):  dark leather takes the tint, the light "GOLDEN GOOSE" print stays as is
//   glitter (Star):    texture brightness × tint, plus animated flakes
//
//   import { applyPartMaterials } from './parts-material.js';
//   const idMap = await new THREE.TextureLoader().loadAsync('parts-id-right.png');
//   const shoe = applyPartMaterials(gltf.scene, { idMap, outsole: outsoleGltf.scene });
//   shoe.setTint('HeelTab', '#1d3b8f');   // null restores the original texture
//   shoe.setTint('Outsole', '#7a4a22');   // the modelled outsole's rubber (its cream rim follows 'Sole')
//   applyPartMaterials(gltf.scene, { idMap, glitter: ['Upper', 'Star'] });   // glitter beyond the star
//   renderer.setAnimationLoop((t) => { shoe.update(t / 1000); ... });
import * as THREE from 'three';

export const PARTS = ['Upper', 'Sole', 'HeelTab', 'TongueLabel', 'Star', 'Laces', 'Lining', 'Suede'];
const MODE = [0, 0, 1, 0, 2, 0, 0, 0];
const SUEDE = PARTS.indexOf('Suede');   // only with the suede-counter heel (opts.heel2Mask)
const STAR = PARTS.indexOf('Star');

const LACES = PARTS.indexOf('Laces');

/** opts.laces: optional separate lace meshes; the Laces tint colours them as well as the painted Laces.
 *  opts.outsole: optional modelled outsole (superstar-outsole-<side>.glb): black rubber tread in a cream rim.
 *  opts.insole: optional modelled insole (superstar-insole-<side>.glb), recoloured by the 'Insole' tint.
 *  opts.glitter: optional part names that glitter like the star (default ['Star']).
 *  opts.snake: optional part names printed with snake scales in their tint; opts.snakeScale: scales across the texture (default 240). */
export function applyPartMaterials(root, opts) {
  const outsole = opts.outsole ? outsoleMaterial(opts.outsole) : null;
  const insole = opts.insole ? insoleMaterial(opts.insole) : null;
  const idMap = opts.idMap;
  const laceMats = [];
  opts.laces?.traverse((o) => {
    if (!o.isMesh) return;
    o.material = o.material.clone();
    o.castShadow = true;
    laceMats.push({ mat: o.material, aglet: /aglet/i.test(o.name), base: o.material.color.clone() });
  });
  Object.assign(idMap, { colorSpace: THREE.NoColorSpace, flipY: false, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, generateMipmaps: false });
  idMap.needsUpdate = true;

  const uniforms = {
    uTime: { value: 0 },
    uIds: { value: idMap },
    uTint: { value: Array.from({ length: 8 }, () => new THREE.Color(1, 1, 1)) },
    uTintOn: { value: new Array(8).fill(0) },
    uSnake: { value: PARTS.map((name) => (opts.snake?.includes(name) ? 1 : 0)) },
    uSnakeScale: { value: opts.snakeScale ?? 240 },
    uMode: { value: MODE.map((m, i) => (opts.glitter ? opts.glitter.includes(PARTS[i]) : i === STAR) ? 2 : m === 2 ? 0 : m) },
    uSparkle: { value: opts.sparkle ?? 3.0 },
    uLacesGeo: { value: opts.laces ? 1 : 0 },
    uFlakes: { value: opts.flakes ?? 1400 },
    // heel style 2: a short leather tab along the collar and a suede counter at the back.
    // heel2-mask-<side>.png: 1 = stays heel tab, 2 = heel tab becomes white leather, 3 = suede,
    // 4 = the old tab's print inside the new tab, made plain leather (value × 60)
    uHeelStyle: { value: 0 },
    uHeelMask: { value: opts.heel2Mask ?? null },
  };
  if (opts.heel2Mask) {
    Object.assign(opts.heel2Mask, { colorSpace: THREE.NoColorSpace, flipY: false, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, generateMipmaps: false });
    opts.heel2Mask.needsUpdate = true;
  }

  let mesh = null;
  root.traverse((o) => { if (o.isMesh && !mesh && !/^(laces|aglets)/i.test(o.name)) mesh = o; });
  const mat = mesh.material.clone();
  mesh.material = mat;
  mesh.castShadow = true;

  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', /* glsl */ `#include <common>
        uniform float uTime, uSparkle, uFlakes, uLacesGeo, uHeelStyle;
        uniform sampler2D uIds, uHeelMask;
        uniform vec3 uTint[8];
        uniform float uTintOn[8], uMode[8], uSnake[8], uSnakeScale;
        vec3 hash32(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yxz + 33.33); return fract((p3.xxy + p3.yzz) * p3.zyx); }
        float vnoise(vec2 p) {
          vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash32(i).x, hash32(i + vec2(1, 0)).x, u.x), mix(hash32(i + vec2(0, 1)).x, hash32(i + vec2(1, 1)).x, u.x), u.y);
        }
        // snake print: domed hexagonal scales with dark seams, under darker blotches; brightness around 1
        float snake(vec2 uv) {
          vec2 p = uv * uSnakeScale, r = vec2(1.0, 1.7320508), h = r * 0.5;
          vec2 a = mod(p, r) - h, b = mod(p - h, r) - h;
          vec2 g = dot(a, a) < dot(b, b) ? a : b, id = p - g;
          float d = max(dot(abs(g), vec2(0.5, 0.8660254)), abs(g.x));   // 0.5 at the hexagon's edge
          float seam = smoothstep(0.36, 0.5, d), dome = 1.0 - 0.9 * dot(g, g);
          float blotch = smoothstep(0.42, 0.62, vnoise(id * 0.16) * 0.7 + vnoise(id * 0.5) * 0.3);
          return dome * (1.0 - 0.7 * seam) * (1.2 - 0.95 * blotch) * (0.93 + 0.14 * hash32(id).x);
        }
      `)
      .replace('#include <map_fragment>', /* glsl */ `
        int partId = 0;
        #ifdef USE_MAP
          partId = int(floor(texture2D(uIds, vMapUv).r * 255.0 / 36.0 + 0.5));
          vec4 texel = texture2D(map, vMapUv);
          vec3 c = texel.rgb;
          if (uHeelStyle > 0.5) {
            int hm = int(floor(texture2D(uHeelMask, vMapUv).r * 255.0 / 60.0 + 0.5));
            vec3 h = hash32(floor(vMapUv * 2048.0));
            if (hm == 4) {          // no print on the short tab
              c = vec3(0.025, 0.024, 0.023) * (0.9 + 0.2 * h.x);
            } else if (hm == 2) {          // the lower heel tab: plain white leather like the upper
              partId = 0;
              c = vec3(0.755, 0.74, 0.705) * (0.985 + 0.03 * h.x);
            } else if (hm == 3) {   // suede: fine nap, a little mottled
              partId = ${SUEDE};
              vec3 n2 = hash32(floor(vMapUv * 6000.0));
              float mott = 0.94 + 0.06 * hash32(floor(vMapUv * 300.0)).y;
              c = vec3(0.50, 0.475, 0.43) * mott * (0.9 + 0.2 * n2.x);
            }
          }
          if (partId == ${SUEDE} && uTintOn[partId] > 0.5) {
            c = uTint[partId] * (c / vec3(0.50, 0.475, 0.43));
          } else if (uTintOn[partId] > 0.5) {
            vec3 tint = uTint[partId];
            float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
            float mode = uMode[partId];
            // snake: the scales replace the texture, the light print shows through.
            // glitter: follows the texture's brightness; on dark leather (a glitter heel tab) it gets its own grain
            if (uSnake[partId] > 0.5) c = mix(tint * snake(vMapUv), vec3(0.78, 0.8, 0.74), 0.75 * smoothstep(0.1, 0.35, l));
            else if (mode > 1.5) c = tint * (l < 0.12 ? 0.62 + 0.4 * hash32(floor(vMapUv * 520.0)).y + 0.12 * hash32(floor(vMapUv * 2048.0)).x : clamp(l / 0.55, 0.0, 1.5));
            else if (mode > 0.5) c = mix(tint * (0.8 + 2.0 * (l - 0.02)), c, smoothstep(0.08, 0.3, l));
            else c *= tint;
          }
          diffuseColor *= vec4(c, texel.a);
        #endif
      `)
      // the star is a little shinier and more metallic than the leather
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>\nif (uMode[partId] > 1.5) roughnessFactor = 0.35;\nif (partId == ${SUEDE}) roughnessFactor = 1.0;`)
      .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>\nif (uMode[partId] > 1.5) metalnessFactor = 0.6;`)
      // glitter: each UV cell is a flake with its own tilt; it flashes when it mirrors a light toward the eye
      .replace('#include <dithering_fragment>', /* glsl */ `#include <dithering_fragment>
        #ifdef USE_MAP
        if (uMode[partId] > 1.5 && uSparkle > 0.0) {
          vec2 cell = floor(vMapUv * uFlakes);
          vec2 inCell = fract(vMapUv * uFlakes) - 0.5;
          vec3 r = hash32(cell);
          vec3 nf = normalize(normal + (r - 0.5) * 2.2);
          vec3 V = normalize(vViewPosition);
          vec3 refl = reflect(-V, nf);
          float flash = pow(max(dot(refl, normalize(vec3(0.4, 0.9, 0.5))), 0.0), 40.0)
                      + pow(max(dot(refl, normalize(vec3(-0.6, 0.3, 0.8))), 0.0), 40.0)
                      + pow(max(dot(refl, V), 0.0), 120.0);
          float tw = 0.6 + 0.4 * sin(uTime * (2.0 + 3.0 * r.z) + r.x * 40.0);
          vec3 glint = uTintOn[partId] > 0.5 ? mix(vec3(1.0), uTint[partId], 0.35) : vec3(1.0, 0.98, 0.95);
          gl_FragColor.rgb += glint * flash * tw * smoothstep(0.55, 0.1, length(inCell)) * uSparkle;
        }
        #endif
      `);
  };
  mat.customProgramCacheKey = () => 'superstar-partmap';

  return {
    /** css colour string, THREE.Color, or null for the original texture */
    setTint(name, colour) {
      if (outsole && (name === 'Outsole' || name === 'Sole')) outsole.setTint(name === 'Outsole' ? 'rubber' : 'rim', colour);
      if (insole && name === 'Insole') insole.setTint(colour);
      const i = PARTS.indexOf(name);
      if (i < 0) return;
      uniforms.uTintOn.value[i] = colour == null ? 0 : 1;
      if (colour != null) uniforms.uTint.value[i].set(colour);
      if (i === LACES) {
        for (const { mat, aglet, base } of laceMats) {
          if (colour == null) mat.color.copy(base);
          else if (aglet) mat.color.copy(base).lerp(new THREE.Color(colour), 0.6);  // tips follow the lace colour, a little lighter
          else mat.color.set(colour);
        }
      }
    },
    setSparkle(v) { uniforms.uSparkle.value = v; },
    /** 1: the heel tab as scanned; 2: short tab along the collar + suede counter (needs opts.heel2Mask) */
    setHeelStyle(n) { uniforms.uHeelStyle.value = n === 2 && uniforms.uHeelMask.value ? 1 : 0; },
    /** Call every frame with seconds. */
    update(t) { uniforms.uTime.value = t; },
  };
}

/** The outsole's rubber is recoloured by the 'Outsole' tint, its cream rim by the 'Sole' tint. */
function outsoleMaterial(root) {
  const u = {
    uRubber: { value: new THREE.Color() }, uRubberOn: { value: 0 },
    uRim: { value: new THREE.Color() }, uRimOn: { value: 0 },
  };
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.material = o.material.clone();
    o.material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, u);
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
          uniform vec3 uRubber, uRim;
          uniform float uRubberOn, uRimOn;`)
        .replace('#include <map_fragment>', /* glsl */ `
          #ifdef USE_MAP
            vec4 texel = texture2D(map, vMapUv);
            vec3 c = texel.rgb;
            float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
            float rubber = 1.0 - smoothstep(0.06, 0.2, l);   // the rubber is near black, the rim cream
            if (uRubberOn > 0.5) c = mix(c, uRubber * clamp(0.55 + 18.0 * l, 0.0, 1.2), rubber);
            if (uRimOn > 0.5) c = mix(c * uRim, c, rubber);
            diffuseColor *= vec4(c, texel.a);
          #endif
        `);
    };
    o.material.customProgramCacheKey = () => 'superstar-outsole';
  });
  return {
    setTint(which, colour) {
      const on = which === 'rubber' ? u.uRubberOn : u.uRimOn;
      on.value = colour == null ? 0 : 1;
      if (colour != null) (which === 'rubber' ? u.uRubber : u.uRim).value.set(colour);
    },
  };
}

/** The insole's leather and foam take the 'Insole' tint; its black label and the perforations stay dark. */
function insoleMaterial(root) {
  const u = { uTint: { value: new THREE.Color() }, uTintOn: { value: 0 } };
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = o.receiveShadow = true;
    o.material = o.material.clone();
    o.material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, u);
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', `#include <common>
          uniform vec3 uTint;
          uniform float uTintOn;`)
        .replace('#include <color_fragment>', /* glsl */ `#include <color_fragment>
          if (uTintOn > 0.5) {
            float l = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
            diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * uTint, smoothstep(0.15, 0.45, l));
          }`);
    };
    o.material.customProgramCacheKey = () => 'superstar-insole';
  });
  return {
    setTint(colour) {
      u.uTintOn.value = colour == null ? 0 : 1;
      if (colour != null) u.uTint.value.set(colour);
    },
  };
}
