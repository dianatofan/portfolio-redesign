let THREE;

let sd = 7; const R = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
function noiseTex(size = 256) {
  const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d'), img = x.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) { const v = 128 + (R() - 0.5) * 90; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  x.putImageData(img, 0, 0); x.globalAlpha = 0.22;
  for (let i = 0; i < 240; i++) { x.strokeStyle = R() < 0.5 ? '#000' : '#fff'; x.lineWidth = 1 + R() * 2; x.beginPath(); x.arc(R() * size, R() * size, 6 + R() * 18, R() * 6, R() * 6 + 1.5); x.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
function stripeTex() {
  const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d');
  x.fillStyle = '#f6ead6'; x.fillRect(0, 0, 512, 512); x.fillStyle = '#d63a2e';
  for (let i = 0; i < 512; i += 128) x.fillRect(i, 0, 64, 512);
  for (let i = 0; i < 6000; i++) { x.fillStyle = R() < 0.5 ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.07)'; x.fillRect(R() * 512, R() * 512, 2, 2); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

export function addTableProps(T) {
  THREE = T; const G = new THREE.Group(); G.name = 'tableProps';
  const bump = noiseTex(); bump.repeat.set(4, 4);
  const clay = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.86, metalness: 0, bumpMap: bump, bumpScale: 0.5, ...o });
  const add = (g, m, p = [0, 0, 0], s = 1, rot) => { const me = new THREE.Mesh(g, m); me.position.set(...p); typeof s === 'number' ? me.scale.setScalar(s) : me.scale.set(...s); if (rot) me.rotation.set(...rot); me.castShadow = me.receiveShadow = true; G.add(me); return me; };
  const lathe = (pts, seg = 64) => new THREE.LatheGeometry(pts.map(([a, b]) => new THREE.Vector2(a, b)), seg);
  const rbox = (w, d, h, rad, bev = 0.05) => { const s = new THREE.Shape(), x0 = -w / 2, y0 = -d / 2; s.moveTo(x0 + rad, y0); s.lineTo(x0 + w - rad, y0); s.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + rad); s.lineTo(x0 + w, y0 + d - rad); s.quadraticCurveTo(x0 + w, y0 + d, x0 + w - rad, y0 + d); s.lineTo(x0 + rad, y0 + d); s.quadraticCurveTo(x0, y0 + d, x0, y0 + d - rad); s.lineTo(x0, y0 + rad); s.quadraticCurveTo(x0, y0, x0 + rad, y0);
    const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 4, curveSegments: 12 }); g.rotateX(-Math.PI / 2); return g; };

  add(new THREE.PlaneGeometry(80, 80), clay('#5a3424', { bumpScale: 0.2 }), [0, -1.6, 0], 1, [-Math.PI / 2, 0, 0]);
  const st = stripeTex(); st.repeat.set(1.6, 1);
  const cloth = new THREE.MeshStandardMaterial({ map: st, roughness: 0.92, bumpMap: bump, bumpScale: 0.25 });
  const TW = 13.5, TD = 8.6, TY = -0.004;
  add(rbox(TW, TD, 0.12, 0.35, 0.06), cloth, [0, TY - 0.185, 0]);
  { const H = 1.3; for (const [w, px, pz, ry] of [[TW, 0, TD / 2 + 0.06, 0], [TW, 0, -TD / 2 - 0.06, Math.PI], [TD, TW / 2 + 0.06, 0, Math.PI / 2], [TD, -TW / 2 - 0.06, 0, -Math.PI / 2]]) { const t = st.clone(); t.needsUpdate = true; t.repeat.set(w * st.repeat.x, 1); const m = cloth.clone(); m.map = t; add(new THREE.PlaneGeometry(w, H), m, [px, TY - 0.12 - H / 2, pz], 1, [0, ry, 0]); } }
  add(new THREE.BoxGeometry(TW * 0.86, 0.01, 1.3), clay('#b8221a', { bumpScale: 0.3 }), [0, TY + 0.005, 0]);

  const Y = TY + 0.01;
  const china = new THREE.MeshPhysicalMaterial({ color: '#fbf6ec', roughness: 0.32, clearcoat: 0.5, side: THREE.DoubleSide }), gold = new THREE.MeshStandardMaterial({ color: '#d4a63a', metalness: 0.85, roughness: 0.32 });
  const plateG = lathe([[0, 0], [0.55, 0], [0.7, 0.04], [0.78, 0.07], [0.76, 0.085], [0.6, 0.05], [0, 0.03]]);
  const wineM = new THREE.MeshPhysicalMaterial({ color: '#6a0a1e', emissive: '#2a0208', emissiveIntensity: 0.3, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.03, transparent: true, opacity: 0.82 }), napM = clay('#b81f16', { bumpScale: 0.4 }), silver = new THREE.MeshStandardMaterial({ color: '#cfcfd4', metalness: 0.9, roughness: 0.3 });
  const seat = (x, z, back) => { const s = back ? -1 : 1; add(plateG, china, [x, Y, z]); add(new THREE.TorusGeometry(0.72, 0.012, 6, 64), gold, [x, Y + 0.075, z], 1, [Math.PI / 2, 0, 0]);
    add(rbox(0.32, 0.6, 0.04, 0.05, 0.02), napM, [x - 1.0, Y + 0.02, z]); add(new THREE.BoxGeometry(0.05, 0.02, 0.62), silver, [x - 0.92, Y + 0.08, z]); add(new THREE.BoxGeometry(0.06, 0.02, 0.62), silver, [x + 0.95, Y + 0.02, z]);
    add(lathe([[0, 0], [0.14, 0], [0.04, 0.03], [0.03, 0.32], [0.24, 0.46], [0.26, 0.5], [0.22, 0.47], [0, 0.4]]), new THREE.MeshPhysicalMaterial({ color: '#f2f6fa', roughness: 0.08, transparent: true, opacity: 0.38, clearcoat: 1 }), [x + 0.8, Y, z - s * 0.65]);
    const wine = add(lathe([[0, 0.405], [0.1, 0.41], [0.18, 0.44], [0.215, 0.47], [0, 0.47]], 32), wineM, [x + 0.8, Y, z - s * 0.65]); wine.castShadow = false; wine.renderOrder = -1; };
  [-4.4, 0, 4.4].forEach(x => { seat(x, 3.2, false); seat(x, -3.2, true); });

  const candle = (x, z, h) => { add(lathe([[0, 0], [0.26, 0], [0.24, 0.05], [0.08, 0.1], [0.06, 0.45], [0.1, 0.5], [0, 0.5]]), gold, [x, Y, z]);
    const c = add(new THREE.CylinderGeometry(0.07, 0.08, h, 16, 8), clay('#b81f16', { bumpScale: 0.2 }), [x, Y + 0.5 + h / 2, z]);
    const fl = add(new THREE.SphereGeometry(0.055, 14, 10), new THREE.MeshBasicMaterial({ color: '#ffb84a', transparent: true, opacity: 0.9 }), [x, Y + 0.56 + h, z], [1, 1.8, 1]); fl.castShadow = fl.receiveShadow = false;
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), new THREE.MeshBasicMaterial({ color: '#fff6d8' })); core.position.y = -0.015; core.scale.set(0.8, 0.7, 0.8);
    const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.006, 0.05, 6), new THREE.MeshBasicMaterial({ color: '#1a120a' })); wick.position.set(x, Y + 0.5 + h + 0.025, z); G.add(wick); fl.add(core);
    const halo = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), new THREE.MeshBasicMaterial({ color: '#ffb040', transparent: true, opacity: 0.08, depthWrite: false, blending: THREE.AdditiveBlending })); halo.visible = false; fl.add(halo);
    const pl = { intensity: 0 };
    FL.push({ fl, halo, pl, ph: R() * 10, y0: Y + 0.56 + h }); };
  const FL = [];
  candle(-3.7, 0, 1.0); candle(-2.15, 0, 1.25); candle(2.15, 0, 1.25); candle(3.7, 0, 1.0);

  { const bx = -4.6, bz = -0.35; add(lathe([[0, 0], [0.34, 0], [0.46, 0.2], [0.48, 0.22], [0.45, 0.22], [0.32, 0.03], [0, 0.03]], 24), clay('#b8843a', { bumpScale: 1.6 }), [bx, Y, bz], [1.25, 1, 0.9]);
    for (let i = 0; i < 7; i++) { const sl = add(rbox(0.3, 0.26, 0.05, 0.08, 0.02), clay(i % 2 ? '#f2dca8' : '#eed29a'), [bx - 0.3 + i * 0.1, Y + 0.17, bz + (i % 2 ? 0.05 : -0.05)], 1, [0, Math.PI / 2, 0.35]); add(new THREE.BoxGeometry(0.052, 0.04, 0.3), clay('#b8742a'), [bx - 0.3 + i * 0.1, Y + 0.3, bz + (i % 2 ? 0.05 : -0.05)], 1, [0, 0, 0.35]); } }
  const peelM = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); x.fillStyle = '#808080'; x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2600; i++) { const px = R() * 256, py = R() * 256, r = 1 + R() * 2.2; const g = x.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(px - r, py - r, r * 2, r * 2); }
    const bt = new THREE.CanvasTexture(c); bt.wrapS = bt.wrapT = THREE.RepeatWrapping; bt.repeat.set(2, 1);
    const cc = document.createElement('canvas'); cc.width = cc.height = 128; const cx = cc.getContext('2d'); const gr = cx.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, '#ff9a1e'); gr.addColorStop(0.5, '#f57a10'); gr.addColorStop(1, '#e8660a'); cx.fillStyle = gr; cx.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 400; i++) { cx.fillStyle = R() < 0.5 ? 'rgba(255,190,80,.18)' : 'rgba(200,80,0,.15)'; cx.fillRect(R() * 128, R() * 128, 2, 2); }
    const ct = new THREE.CanvasTexture(cc); ct.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshPhysicalMaterial({ map: ct, bumpMap: bt, bumpScale: 2.2, roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.4, sheen: 0.3, sheenColor: new THREE.Color('#ffb060') }); })();
  const stemM = new THREE.MeshStandardMaterial({ color: '#5a6a2a', roughness: 0.8 }), leafM = new THREE.MeshStandardMaterial({ color: '#2f6a2a', roughness: 0.55, side: THREE.DoubleSide });
  const fPlate = (x, z, r0) => { add(lathe([[0, 0], [r0 * 0.7, 0], [r0 * 0.75, 0.025], [r0, 0.06], [r0, 0.07], [r0 * 0.72, 0.035], [0, 0.03]], 48), new THREE.MeshPhysicalMaterial({ color: '#fbf6ea', roughness: 0.18, clearcoat: 1 }), [x, Y, z]);
    add(new THREE.TorusGeometry(r0 * 0.985, 0.012, 6, 64).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#d8a83a', metalness: 1, roughness: 0.25 }), [x, Y + 0.068, z]);
    add(new THREE.TorusGeometry(r0 * 0.76, 0.006, 6, 64).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#d8a83a', metalness: 1, roughness: 0.25 }), [x, Y + 0.033, z]); };
  const bowl = (x, z, r0, col, n, rs) => { add(lathe([[0, 0], [r0 * 0.5, 0], [r0 * 0.6, 0.1], [r0, 0.35], [r0 * 1.02, 0.37], [r0 * 0.96, 0.36], [r0 * 0.5, 0.12], [0, 0.11]]), new THREE.MeshPhysicalMaterial({ color: '#e8eef4', roughness: 0.15, transparent: true, opacity: 0.55, clearcoat: 1 }), [x, Y, z]);
    const isO = col === '#f08a2a'; for (let i = 0; i < n; i++) { const a = R() * Math.PI * 2, d = R() * r0 * 0.6, pos = [x + Math.cos(a) * d, Y + 0.28 + R() * 0.12, z + Math.sin(a) * d];
      if (!isO) { add(new THREE.SphereGeometry(rs, 16, 12), clay(col), pos); continue; }
      const g = new THREE.SphereGeometry(rs, 40, 28); g.scale(1, 0.9, 1); const o = add(g, peelM, pos, 1, [R() * 0.6 - 0.3, R() * 6, R() * 0.6 - 0.3]);
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.016, 0.03, 8), stemM); st.position.y = rs * 0.9; o.add(st);
      if (i % 2 === 0) { const lf = new THREE.Mesh(new THREE.CircleGeometry(0.06, 12), leafM); lf.scale.set(0.45, 1, 1); lf.position.set(0.03, rs * 0.92, 0); lf.rotation.set(-1.2, 0, -0.6); o.add(lf); } } };
  bowl(4.15, 0.95, 0.5, '#f08a2a', 7, 0.2); { const potM = clay('#a4502a', { roughness: 0.7 }), sx = 2.75, sz = -0.95;
    const hz = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 64; const x = c.getContext('2d'); x.fillStyle = '#a4502a'; x.fillRect(0, 0, 256, 64);
      x.fillStyle = '#f2e2b0'; x.fillRect(0, 40, 256, 10); x.fillStyle = '#2f6a2a'; for (let i = 0; i < 32; i++) { x.beginPath(); x.arc(i * 8 + 4, 45, 2.2, 0, 7); x.fill(); } x.fillStyle = '#c8201a'; x.fillRect(0, 52, 256, 3); x.fillStyle = '#2a3a8a'; x.fillRect(0, 36, 256, 2);
      x.strokeStyle = '#f2c23a'; x.lineWidth = 2; for (let i = 0; i < 16; i++) { x.beginPath(); x.moveTo(i * 16, 26); x.quadraticCurveTo(i * 16 + 8, 14, i * 16 + 16, 26); x.stroke(); }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = THREE.RepeatWrapping; t.repeat.set(3, 1); return new THREE.MeshPhysicalMaterial({ map: t, roughness: 0.35, clearcoat: 0.8, side: THREE.DoubleSide }); })();
    const terra = new THREE.MeshPhysicalMaterial({ color: '#b0582a', roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.15 });
    const inT = (() => { const c = document.createElement('canvas'); c.width = 512; c.height = 512; const x = c.getContext('2d'); x.fillStyle = '#f0dca0'; x.fillRect(0, 0, 512, 512); const O = 256;
      const ring = (r, w, col) => { x.strokeStyle = col; x.lineWidth = w; x.beginPath(); x.arc(O, O, r, 0, 7); x.stroke(); };
      ring(250, 14, '#b0582a'); ring(236, 4, '#2a3a6a'); ring(222, 3, '#2f6a2a');
      for (let i = 0; i < 40; i++) { const a2 = i / 40 * Math.PI * 2; x.save(); x.translate(O + Math.cos(a2) * 206, O + Math.sin(a2) * 206); x.rotate(a2); x.strokeStyle = i % 2 ? '#2a3a6a' : '#7a2a14'; x.lineWidth = 3; x.beginPath(); x.moveTo(-6, -8); x.quadraticCurveTo(0, 0, -6, 8); x.stroke(); x.restore(); }
      for (let i = 0; i < 60; i++) { const a2 = i / 60 * Math.PI * 2; x.fillStyle = '#2f6a2a'; x.beginPath(); x.arc(O + Math.cos(a2) * 188, O + Math.sin(a2) * 188, 3, 0, 7); x.fill(); }
      ring(176, 2, '#7a2a14'); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
    const BR = 0.66, BH = 0.32;
    add(lathe([[0, 0], [0.8, 0], [0.86, 0.035], [0.83, 0.05], [0, 0.045]], 56), terra, [sx, Y, sz]);
    add(new THREE.CircleGeometry(0.78, 56).rotateX(-Math.PI / 2), new THREE.MeshPhysicalMaterial({ map: inT, roughness: 0.3, clearcoat: 1 }), [sx, Y + 0.048, sz]);
    add(lathe([[0.4, 0.05], [0.5, 0.06], [0.6, 0.12], [BR, BH - 0.02], [BR + 0.03, BH], [BR + 0.015, BH + 0.015]], 56), terra, [sx, Y, sz]);
    add(lathe([[BR - 0.005, BH + 0.01], [BR - 0.04, BH - 0.03], [0.56, 0.12], [0.44, 0.09], [0, 0.085]], 56), new THREE.MeshPhysicalMaterial({ color: '#f0dca0', roughness: 0.3, clearcoat: 1, side: THREE.DoubleSide }), [sx, Y, sz]);
    add(new THREE.TorusGeometry(BR - 0.025, 0.012, 6, 64).rotateX(Math.PI / 2), clay('#2a3a6a'), [sx, Y + BH - 0.04, sz]);
    const leafT = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 128; const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 0, 128); g.addColorStop(0, '#d8c86a'); g.addColorStop(0.5, '#e8d88a'); g.addColorStop(1, '#c8b45a'); x.fillStyle = g; x.fillRect(0, 0, 256, 128);
      x.strokeStyle = 'rgba(250,245,200,.75)'; x.lineWidth = 3; x.beginPath(); x.moveTo(0, 64); x.bezierCurveTo(80, 58, 170, 70, 256, 62); x.stroke(); x.lineWidth = 1.6; for (let i = 0; i < 14; i++) { const u = 10 + i * 18; x.beginPath(); x.moveTo(u, 64); x.quadraticCurveTo(u + 14, 30, u + 30, 4); x.moveTo(u, 64); x.quadraticCurveTo(u + 14, 98, u + 30, 124); x.stroke(); }
      x.strokeStyle = 'rgba(120,100,30,.35)'; x.lineWidth = 2; for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(40 + i * 45, 0); x.lineTo(30 + i * 45, 128); x.stroke(); }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
    const sarM = new THREE.MeshPhysicalMaterial({ map: leafT, bumpMap: leafT, bumpScale: 2.5, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.3, transmission: 0.08, thickness: 0.2 });
    const sarG = new THREE.CapsuleGeometry(0.1, 0.12, 8, 16); sarG.rotateZ(Math.PI / 2); sarG.scale(1, 0.62, 0.92);
    { const P = sarG.attributes.position; for (let i = 0; i < P.count; i++) { const x0 = P.getX(i), y0 = P.getY(i), z0 = P.getZ(i); const wob = 1 + 0.06 * Math.sin(x0 * 40 + z0 * 18) + 0.04 * Math.sin(z0 * 55); P.setXYZ(i, x0 * (Math.abs(x0) > 0.1 ? 0.92 : 1), y0 * wob + (y0 > 0 ? 0.008 * Math.sin(x0 * 30) : 0), z0 * wob); } sarG.computeVertexNormals(); }
    const flapG = new THREE.PlaneGeometry(0.22, 0.12, 8, 4); { const P = flapG.attributes.position; for (let i = 0; i < P.count; i++) { const x0 = P.getX(i), y0 = P.getY(i); P.setZ(i, -Math.pow(y0 / 0.06, 2) * 0.03 + 0.01 * Math.sin(x0 * 40)); } flapG.computeVertexNormals(); flapG.rotateX(-Math.PI / 2 + 0.25); }
    const flapM = sarM.clone(); flapM.side = THREE.DoubleSide;
    const SAR = []; for (let i = 0; i < 9; i++) { const q = i / 9 * Math.PI * 2; SAR.push([Math.cos(q) * 0.42, Math.sin(q) * 0.42, -q + Math.PI / 2, 0]); } for (let i = 0; i < 4; i++) { const q = i / 4 * Math.PI * 2 + 0.4; SAR.push([Math.cos(q) * 0.15, Math.sin(q) * 0.15, -q, 0.02]); } for (let i = 0; i < 6; i++) { const q = i / 6 * Math.PI * 2 + 0.2; SAR.push([Math.cos(q) * 0.27, Math.sin(q) * 0.27, -q + Math.PI / 2 + 0.3, 0.13]); } SAR.push([0, 0, 0.7, 0.2]);
    for (const [dx, dz, ry, dy] of SAR) { const s3 = 0.9 + ((dx * 37 + dz * 11) % 0.2), m = add(sarG, sarM, [sx + dx, Y + 0.16 + dy, sz + dz], s3, [((dz * 13) % 0.2), ry, ((dx * 7) % 0.18)]); const fl = new THREE.Mesh(flapG, flapM); fl.position.set(0, 0.05, 0.02); fl.rotation.y = 0.15; m.add(fl); }
    add(new THREE.SphereGeometry(0.11, 14, 10).scale(1, 0.75, 1), clay('#f4ece0', { roughness: 0.6, bumpScale: 1.2 }), [sx + 0.55, Y + 0.08, sz + 0.82]);
    
    for (let i = 0; i < 3; i++) add(new THREE.ConeGeometry(0.02, 0.22, 6).rotateZ(Math.PI / 2), clay('#a8140e', { roughness: 0.4 }), [sx + 0.55 + i * 0.04, Y + 0.03, sz + 0.48 - i * 0.07], 1, [0, 0.6 + i * 0.3, 0]);
    { const mx = 2.8, mz = -2.45; add(new THREE.CylinderGeometry(0.62, 0.62, 0.05, 48), clay('#c89a5a', { roughness: 0.6, bumpScale: 1.2 }), [mx, Y + 0.025, mz]);
      const mmM = clay('#f6c02a', { roughness: 0.75, bumpScale: 0.4 });
      add(lathe([[0, 0], [0.46, 0], [0.5, 0.06], [0.5, 0.14], [0.44, 0.22], [0.3, 0.27], [0, 0.29]], 48), mmM, [mx - 0.1, Y + 0.05, mz]);
      const slab = new THREE.ExtrudeGeometry((() => { const s = new THREE.Shape(); s.moveTo(-0.2, 0); s.lineTo(0.2, 0); s.quadraticCurveTo(0.21, 0.13, 0.12, 0.2); s.lineTo(-0.12, 0.2); s.quadraticCurveTo(-0.21, 0.13, -0.2, 0); return s; })(), { depth: 0.07, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 2 }); slab.rotateX(-Math.PI / 2);
      for (let i = 0; i < 3; i++) add(slab, mmM, [mx + 0.36, Y + 0.06 + i * 0.075, mz - 0.18 + i * 0.13], 1, [0, -0.5 - i * 0.12, 0]);
      const str = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.004, 4, 24, Math.PI), clay('#f2e6c8')); str.position.set(mx + 0.1, Y + 0.055, mz + 0.45); str.rotation.x = Math.PI / 2; G.add(str); } }
  { const px = 4.45, pz = -1.7; add(lathe([[0, 0], [0.32, 0], [0.38, 0.12], [0.36, 0.12], [0.3, 0.02], [0, 0.02]], 40), new THREE.MeshPhysicalMaterial({ color: '#e8eef4', roughness: 0.15, transparent: true, opacity: 0.55, clearcoat: 1 }), [px, Y, pz]);
    add(new THREE.CylinderGeometry(0.33, 0.29, 0.1, 32), new THREE.MeshPhysicalMaterial({ color: '#d8a650', roughness: 0.08, transmission: 0.5, transparent: true, opacity: 0.85, clearcoat: 1 }), [px, Y + 0.07, pz]);
    for (let i = 0; i < 7; i++) add(new THREE.BoxGeometry(0.08, 0.05, 0.07), clay(i % 2 ? '#c88a6a' : '#e8742a'), [px + (R() - 0.5) * 0.4, Y + 0.08, pz + (R() - 0.5) * 0.4], 1, [0, R() * 3, 0]); }
  { const plat = (x, z) => { const S3 = [1.35, 1, 1]; const pm = new THREE.MeshPhysicalMaterial({ color: '#fbf6ea', roughness: 0.15, clearcoat: 1 }), gm = new THREE.MeshStandardMaterial({ color: '#d8a83a', metalness: 1, roughness: 0.22 });
      add(lathe([[0, 0], [0.62, 0], [0.68, 0.03], [0.82, 0.07], [0.82, 0.08], [0.66, 0.04], [0, 0.035]], 48), pm, [x, Y, z], S3);
      add(new THREE.TorusGeometry(0.81, 0.013, 6, 72).rotateX(Math.PI / 2), gm, [x, Y + 0.078, z], S3); add(new THREE.TorusGeometry(0.67, 0.007, 6, 72).rotateX(Math.PI / 2), gm, [x, Y + 0.04, z], S3); };
    const PS = 1.35, LX = -2.3, RX = 2.3, PZ = 1.85; plat(LX, PZ);
    const corn = clay('#e8c27a', { roughness: 0.7 }), sugar = clay('#fbf6ec', { roughness: 1 }), cg = new THREE.TorusGeometry(0.075, 0.032, 8, 16, Math.PI * 1.1); cg.rotateX(Math.PI / 2);

    const ham = clay('#e89a9a', { roughness: 0.5 }), hamF = clay('#f6d8cc'), tom = new THREE.MeshPhysicalMaterial({ color: '#d8281e', roughness: 0.25, clearcoat: 1 }), pk = clay('#5a7a2a', { roughness: 0.5 }), lett = new THREE.MeshStandardMaterial({ color: '#5aa03a', roughness: 0.6, side: THREE.DoubleSide });
    const cook = clay('#d8a85a', { roughness: 0.6 }), choc = clay('#3a1a0a', { roughness: 0.3 }), jam = new THREE.MeshPhysicalMaterial({ color: '#a8142a', roughness: 0.2, clearcoat: 1 });

    const salT = (col, dot, n) => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.fillStyle = col; x.fillRect(0, 0, 128, 128); x.fillStyle = dot; for (let i = 0; i < n; i++) { x.beginPath(); x.ellipse(R() * 128, R() * 128, 2 + R() * 3, 1.5 + R() * 2.5, R() * 3, 0, 7); x.fill(); } x.strokeStyle = 'rgba(40,10,5,.6)'; x.lineWidth = 6; x.beginPath(); x.arc(64, 64, 60, 0, 7); x.stroke(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
    const kinds = [[salT('#a82a2a', '#f6e2d0', 60), 0.075], [salT('#e8a0a0', '#f8d8d0', 4), 0.085], [salT('#7a1a14', '#f2dcc8', 90), 0.06], [salT('#c8504a', '#f6e6d8', 30), 0.07]];
    const o3 = new THREE.Object3D();
    { const ell = (k, q) => [LX + Math.cos(q) * 1.02 * k, PZ + Math.sin(q) * 0.74 * k];
      const lett = new THREE.MeshStandardMaterial({ color: '#5aa03a', roughness: 0.6, side: THREE.DoubleSide }); for (let i = 0; i < 14; i++) { const q = i / 14 * Math.PI * 2, [x, z] = ell(0.98, q); const lf = add(new THREE.CircleGeometry(0.16, 10).scale(1.4, 0.8, 1).rotateX(-Math.PI / 2 + 0.3), lett, [x, Y + 0.05, z], 1, [0, -q + Math.PI / 2, 0]); lf.castShadow = false; }
      const ring = (tex, rad, N, k, y, tilt, col) => { const im = new THREE.InstancedMesh(new THREE.CylinderGeometry(rad, rad, 0.014, 22), new THREE.MeshStandardMaterial(tex ? { map: tex, roughness: 0.45 } : { color: col, roughness: 0.5 }), N); for (let i = 0; i < N; i++) { const q = i / N * Math.PI * 2, [x, z] = ell(k, q); o3.position.set(x, Y + y, z); o3.rotation.set(0, -q, 0); o3.rotateZ(tilt); o3.updateMatrix(); im.setMatrixAt(i, o3.matrix); } im.castShadow = im.receiveShadow = true; G.add(im); };
      ring(salT('#a82a2a', '#f6e2d0', 60), 0.085, 44, 0.8, 0.1, -0.55);
      ring(salT('#7a1a14', '#f2dcc8', 90), 0.07, 34, 0.62, 0.11, -0.55);
      { const N = 22, im = new THREE.InstancedMesh(new THREE.BoxGeometry(0.13, 0.012, 0.13), new THREE.MeshStandardMaterial({ color: '#f6cf4a', roughness: 0.55 }), N); for (let i = 0; i < N; i++) { const q = i / N * Math.PI * 2, [x, z] = ell(0.44, q); o3.position.set(x, Y + 0.1, z); o3.rotation.set(0, -q + Math.PI / 4, 0); o3.rotateX(0.5); o3.updateMatrix(); im.setMatrixAt(i, o3.matrix); } im.castShadow = im.receiveShadow = true; G.add(im); }
      const ham = clay('#e89a9a', { roughness: 0.5 }); for (let i = 0; i < 8; i++) { const q = i / 8 * Math.PI * 2, [x, z] = ell(0.24, q); add(new THREE.CylinderGeometry(0.04, 0.04, 0.16, 14).rotateZ(Math.PI / 2), ham, [x, Y + 0.09, z], 1, [0, -q, 0]); }
      const olive = clay('#2a2a1a', { roughness: 0.3 }), tom = new THREE.MeshPhysicalMaterial({ color: '#d8281e', roughness: 0.25, clearcoat: 1 }); for (let i = 0; i < 6; i++) { const q = i / 6 * Math.PI * 2; add(new THREE.SphereGeometry(i % 2 ? 0.04 : 0.045, 12, 10), i % 2 ? olive : tom, [LX + Math.cos(q) * 0.07, Y + 0.1, PZ + Math.sin(q) * 0.05]); }
      add(new THREE.SphereGeometry(0.05, 10, 8), clay('#3a7a2a'), [LX, Y + 0.13, PZ], [1.3, 0.5, 1.3]); }

    { const o4 = new THREE.Object3D(); const kinds = [[new THREE.CylinderGeometry(0.055, 0.055, 0.025, 16), '#d8a85a', '#a8142a'], [new THREE.CylinderGeometry(0.05, 0.05, 0.03, 14), '#7a4a22', '#f6f0e0'], [new THREE.BoxGeometry(0.1, 0.025, 0.07), '#e8c27a', '#3a1a0a'], [new THREE.CylinderGeometry(0.06, 0.06, 0.022, 6), '#c88a3a', '#f6f0e0']];
      kinds.forEach(([g, c1, c2], k) => { const N = 34, im = new THREE.InstancedMesh(g, clay(c1, { roughness: 0.6 }), N), top = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.022, 0.022, 0.008, 10), new THREE.MeshPhysicalMaterial({ color: c2, roughness: 0.3, clearcoat: 0.8 }), N);
        for (let i = 0; i < N; i++) { let x, z; do { x = (R() - 0.5) * 2.0; z = (R() - 0.5) * 1.4; } while ((x * x) / (1.0 * 1.0) + (z * z) / (0.68 * 0.68) > 1); const y = Y + 0.12 + k * 0.025 + R() * 0.04;
          o4.position.set(RX + x, y, PZ + z); o4.rotation.set((R() - 0.5) * 0.5, R() * 6, (R() - 0.5) * 0.5); o4.updateMatrix(); im.setMatrixAt(i, o4.matrix); o4.position.y += 0.018; o4.updateMatrix(); top.setMatrixAt(i, o4.matrix); }
        im.castShadow = im.receiveShadow = true; G.add(im); G.add(top); }); }
    { const cx = -1.45, cz = -2.0; fPlate(cx, cz, 0.58); const sM = new THREE.MeshPhysicalMaterial({ color: '#8a3a1a', roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.3, bumpMap: bump, bumpScale: 0.8 });
      for (let i = 0; i < 6; i++) { const z0 = cz - 0.3 + i * 0.12, bend = 0.06 + (i % 2) * 0.03; const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(cx - 0.36, Y + 0.08, z0), new THREE.Vector3(cx - 0.12, Y + 0.08 + 0.01, z0 - bend), new THREE.Vector3(cx + 0.12, Y + 0.08 + 0.01, z0 - bend), new THREE.Vector3(cx + 0.36, Y + 0.08, z0)]);
        const tg = new THREE.TubeGeometry(curve, 20, 0.04, 10, false); const m = new THREE.Mesh(tg, sM); m.castShadow = m.receiveShadow = true; G.add(m);
        for (const t of [0, 1]) { const pt = curve.getPoint(t); add(new THREE.SphereGeometry(0.04, 10, 8), sM, [pt.x, pt.y, pt.z]); } }
      add(new THREE.SphereGeometry(0.08, 14, 10).scale(1, 0.45, 1), clay('#d8a820', { roughness: 0.35 }), [cx + 0.38, Y + 0.07, cz + 0.32]);
      for (let i = 0; i < 4; i++) add(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 12), clay('#f2f0e0'), [cx - 0.4 + i * 0.05, Y + 0.06, cz + 0.36], 1, [0, 0, 0.3]); } }
  
  { const vx = 1.45, vz = -2.0; add(plateG, china, [vx, Y, vz], 0.5); for (let i = 0; i < 26; i++) add(new THREE.BoxGeometry(0.16, 0.015, 0.025), clay(i % 3 ? '#e8e0a8' : '#c8c880'), [vx + (R() - 0.5) * 0.36, Y + 0.045 + R() * 0.04, vz + (R() - 0.5) * 0.36], 1, [0, R() * 3, 0]); }
  
  { const nx = -2.8, nz = -2.45; add(lathe([[0, 0], [0.2, 0], [0.3, 0.06], [0.42, 0.2], [0.4, 0.21], [0.28, 0.08], [0, 0.07]], 36), clay('#8a5a2a', { roughness: 0.55 }), [nx, Y, nz]);
    for (let i = 0; i < 9; i++) add(new THREE.SphereGeometry(0.06, 10, 8), clay('#a8763a', { bumpScale: 1.5 }), [nx + (R() - 0.5) * 0.4, Y + 0.14 + R() * 0.04, nz + (R() - 0.5) * 0.4], [1, 0.85, 1.1]);
    for (const [dx, dz, c] of [[0.6, 0.15, '#c8201a'], [0.72, -0.12, '#8fb030'], [0.5, -0.25, '#d83a1a']]) { const ap = add(new THREE.SphereGeometry(0.12, 20, 14), new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.3, clearcoat: 0.6 }), [nx + dx, Y + 0.11, nz + dz], [1, 0.9, 1]); add(new THREE.CylinderGeometry(0.008, 0.01, 0.06, 6), stemM, [nx + dx, Y + 0.23, nz + dz]); }
    const sx2 = nx - 0.75; fPlate(sx2, nz, 0.24); add(new THREE.CylinderGeometry(0.13, 0.12, 0.36, 20), new THREE.MeshPhysicalMaterial({ color: '#eef4f6', roughness: 0.05, transparent: true, opacity: 0.3, clearcoat: 1 }), [sx2, Y + 0.18, nz]);
    for (let i = 0; i < 14; i++) add(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 6), clay('#d8a24a'), [sx2 + (R() - 0.5) * 0.12, Y + 0.3, nz + (R() - 0.5) * 0.12], 1, [(R() - 0.5) * 0.4, 0, (R() - 0.5) * 0.4]); }
  
  
  { const jx = -4.45, jz = -1.7; fPlate(jx, jz, 0.34); add(new THREE.CylinderGeometry(0.22, 0.22, 0.6, 28), new THREE.MeshPhysicalMaterial({ color: '#e6f0e0', roughness: 0.1, transparent: true, opacity: 0.35, clearcoat: 1 }), [jx, Y + 0.3, jz]);
    add(new THREE.CylinderGeometry(0.23, 0.23, 0.07, 28), clay('#c8a020'), [jx, Y + 0.63, jz]);
    for (let i = 0; i < 14; i++) add(new THREE.SphereGeometry(i % 3 ? 0.07 : 0.05, 12, 8).scale(1, i % 3 ? 1 : 2.4, 1), clay(i % 3 ? '#6a8a2a' : '#4a6a1a'), [jx + (R() - 0.5) * 0.24, Y + 0.08 + (i / 14) * 0.45, jz + (R() - 0.5) * 0.24]); }
  add(lathe([[0, 0], [0.22, 0], [0.24, 0.05], [0.24, 0.85], [0.1, 1.05], [0.07, 1.4], [0.08, 1.45], [0, 1.45]], 40), new THREE.MeshPhysicalMaterial({ color: '#1f4a2a', roughness: 0.2, clearcoat: 1 }), [4.7, Y, -0.35]);
  add(new THREE.CylinderGeometry(0.245, 0.245, 0.32, 32), clay('#f2e6c8'), [4.7, Y + 0.45, -0.35]);
  const bottle = (x, z, liq, lab, cap, h0) => { const glass = new THREE.MeshPhysicalMaterial({ color: '#dfe8e2', roughness: 0.05, transparent: true, opacity: 0.35, clearcoat: 1 });
    const prof = [[0, 0], [0.13, 0], [0.145, 0.04], [0.12, 0.2], [0.145, 0.38], [0.12, 0.55], [0.06, 0.78], [0.045, 0.95], [0.05, 0.98], [0, 0.98]].map(([r, y]) => [r, y * h0]);
    add(lathe(prof, 28), glass, [x, Y, z]); add(lathe(prof.slice(0, 7).map(([r, y]) => [r * 0.9, Math.min(y, 0.7 * h0)]).concat([[0, 0.7 * h0]]), 24), new THREE.MeshPhysicalMaterial({ color: liq, roughness: 0.1, transparent: true, opacity: 0.92 }), [x, Y + 0.005, z]);
    add(new THREE.CylinderGeometry(0.135, 0.135, 0.15 * h0, 24, 1, true), lab && lab.isTexture ? new THREE.MeshStandardMaterial({ map: lab, roughness: 0.4, side: THREE.DoubleSide }) : new THREE.MeshStandardMaterial({ color: lab, roughness: 0.5, side: THREE.DoubleSide }), [x, Y + 0.3 * h0, z], 1, [0, -0.6, 0]);
    add(new THREE.CylinderGeometry(0.054, 0.054, 0.04, 14), new THREE.MeshStandardMaterial({ color: cap, metalness: 0.6, roughness: 0.4 }), [x, Y + 0.99 * h0, z]); };
  bottle(5.2, -0.05, '#2a0c04', '#d8281e', '#c8201a', 1.1); bottle(5.55, -0.45, '#2a0c04', '#d8281e', '#c8201a', 1.1); const cicoL = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 64; const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 0, 64); g.addColorStop(0, '#1a4aa8'); g.addColorStop(0.5, '#3a7ae0'); g.addColorStop(1, '#1a3a8a'); x.fillStyle = g; x.fillRect(0, 0, 256, 64);
    x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 3; x.beginPath(); for (let i = 0; i <= 256; i += 4) x.lineTo(i, 32 + Math.sin(i / 14) * 14); x.stroke();
    for (const cx of [64, 192]) { x.fillStyle = '#d8201a'; x.beginPath(); x.arc(cx, 32, 24, 0, 7); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 2.5; x.beginPath(); x.arc(cx, 32, 24, 0, 7); x.stroke(); x.fillStyle = '#ff9a1a'; x.beginPath(); x.arc(cx + 14, 42, 9, 0, 7); x.fill(); x.fillStyle = '#fff'; x.fillRect(cx - 14, 28, 22, 4); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  bottle(-5.3, 0.15, '#ffae12', cicoL, '#d8201a', 1.45); bottle(-5.7, -0.3, '#ffae12', cicoL, '#d8201a', 1.15);
  { const tx = 2.3, tz = 1.85, TW2 = 1.8, TD2 = 1.2, wM = new THREE.MeshPhysicalMaterial({ color: '#fbf8f0', roughness: 0.12, clearcoat: 1 });
    add(new THREE.BoxGeometry(TW2, 0.03, TD2), wM, [tx, Y + 0.015, tz]); for (const [w, d, x0, z0] of [[TW2, 0.05, 0, TD2 / 2], [TW2, 0.05, 0, -TD2 / 2], [0.05, TD2, TW2 / 2, 0], [0.05, TD2, -TW2 / 2, 0]]) add(new THREE.BoxGeometry(w, 0.05, d), wM, [tx + x0, Y + 0.04, tz + z0]);
    const sbT = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.fillStyle = '#4a2410'; x.fillRect(0, 0, 128, 128); for (let i = 0; i < 26; i++) { x.fillStyle = i % 3 ? '#f2e2b0' : '#c89a5a'; x.fillRect(R() * 118, R() * 118, 6 + R() * 10, 5 + R() * 8); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
    const sbM = new THREE.MeshStandardMaterial({ map: sbT, roughness: 0.5 }), sbS = new THREE.MeshStandardMaterial({ color: '#4a2410', roughness: 0.4 }), Yt = Y + 0.03;
    // row 1: salam de biscuiti log + 4 flat slices
    add(new THREE.CylinderGeometry(0.08, 0.08, 0.42, 22).rotateZ(Math.PI / 2), [sbS, sbM, sbM], [tx - 0.5, Yt + 0.08, tz - 0.4]);
    for (let i = 0; i < 4; i++) add(new THREE.CylinderGeometry(0.08, 0.08, 0.03, 22), [sbM, sbM, sbS], [tx + 0.0 + i * 0.2, Yt + 0.015, tz - 0.4]);
    // row 2: alba ca zapada
    const crm = clay('#fbf6ea', { roughness: 0.7 }), foi = clay('#e8c27a', { roughness: 0.6 }), snow = clay('#ffffff', { roughness: 1 });
    for (let i = 0; i < 8; i++) { const x = tx - 0.7 + i * 0.2, z = tz - 0.13; for (let l = 0; l < 4; l++) add(new THREE.BoxGeometry(0.16, l % 2 ? 0.03 : 0.012, 0.16), l % 2 ? crm : foi, [x, Yt + 0.006 + l * 0.022 + (l % 2 ? 0.009 : 0), z]); add(new THREE.BoxGeometry(0.16, 0.006, 0.16), snow, [x, Yt + 0.094, z]); }
    // row 3: cornulete, all same direction
    const cg2 = new THREE.TorusGeometry(0.055, 0.024, 8, 16, Math.PI * 1.1); cg2.rotateX(Math.PI / 2); const cM = clay('#e8c27a', { roughness: 0.7 }), sug = clay('#fbf6ec', { roughness: 1 });
    for (let i = 0; i < 8; i++) { const x = tx - 0.7 + i * 0.2, z = tz + 0.14; add(cg2, cM, [x, Yt + 0.024, z], 1, [0, 0.55, 0]); add(new THREE.SphereGeometry(0.026, 8, 6), sug, [x, Yt + 0.046, z], [1.5, 0.3, 1.5]); }
    // row 4: jam cookies
    const cook = clay('#d8a85a', { roughness: 0.6 }), jam = new THREE.MeshPhysicalMaterial({ color: '#a8142a', roughness: 0.2, clearcoat: 1 });
    for (let i = 0; i < 8; i++) { const x = tx - 0.7 + i * 0.2, z = tz + 0.4; add(new THREE.CylinderGeometry(0.065, 0.065, 0.026, 18), cook, [x, Yt + 0.013, z]); add(new THREE.CylinderGeometry(0.022, 0.022, 0.008, 12), jam, [x, Yt + 0.03, z]); } }
  const cozM = (() => { const c = document.createElement('canvas'); c.width = 400; c.height = 320; const x = c.getContext('2d');
    x.fillStyle = '#7a3a12'; x.fillRect(0, 0, 400, 320);
    x.save(); x.beginPath(); x.moveTo(14, 306); x.lineTo(14, 150); x.quadraticCurveTo(14, 18, 200, 14); x.quadraticCurveTo(386, 18, 386, 150); x.lineTo(386, 306); x.closePath(); x.clip();
    x.fillStyle = '#ffd23a'; x.fillRect(0, 0, 400, 320);
    for (let i = 0; i < 900; i++) { x.fillStyle = R() < 0.6 ? 'rgba(200,150,60,.35)' : 'rgba(255,240,180,.5)'; const r = 1 + R() * 3; x.beginPath(); x.ellipse(R() * 400, R() * 320, r, r * 0.7, R() * 3, 0, Math.PI * 2); x.fill(); }
    x.strokeStyle = '#2a1006'; x.lineCap = 'round'; x.lineWidth = 34; x.beginPath(); for (let t = 0; t < 15; t += 0.05) { const r = 10 + t * 8.5, px = 200 + Math.cos(t) * r * 1.25, py = 170 + Math.sin(t) * r; t === 0 ? x.moveTo(px, py) : x.lineTo(px, py); } x.stroke();
    x.fillStyle = '#6a3a1a'; for (let i = 0; i < 40; i++) { const t = R() * 24, r = 8 + t * 5.2; x.beginPath(); x.ellipse(200 + Math.cos(t) * r * 1.25, 170 + Math.sin(t) * r, 5, 3.5, t, 0, Math.PI * 2); x.fill(); }
    for (let i = 0; i < 18; i++) { x.fillStyle = '#5a1a3a'; x.beginPath(); x.ellipse(40 + R() * 320, 50 + R() * 240, 4, 3, R() * 3, 0, Math.PI * 2); x.fill(); }
    x.restore(); x.lineWidth = 10; x.strokeStyle = '#8a4214'; x.beginPath(); x.moveTo(14, 306); x.lineTo(14, 150); x.quadraticCurveTo(14, 18, 200, 14); x.quadraticCurveTo(386, 18, 386, 150); x.lineTo(386, 306); x.stroke();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.repeat.set(1 / 0.4, 1 / 0.32); t.offset.set(0.5, 0.02);
    return [new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 }), new THREE.MeshStandardMaterial({ color: '#7a3a12', roughness: 0.6, bumpMap: bump, bumpScale: 0.6 })]; })();
  const cozS = new THREE.Shape(); cozS.moveTo(-0.186, -0.0); cozS.lineTo(-0.186, 0.13); cozS.quadraticCurveTo(-0.186, 0.29, 0, 0.3); cozS.quadraticCurveTo(0.186, 0.29, 0.186, 0.13); cozS.lineTo(0.186, 0); cozS.closePath();
  const cozG = new THREE.ExtrudeGeometry(cozS, { depth: 0.06, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.006, bevelSegments: 2, curveSegments: 16 }); cozG.rotateX(-Math.PI / 2);
  const cozonac = (x, z, ry) => { add(cozG, cozM, [x, Y + 0.11, z], 1.6, [0, ry, 0]); add(cozG, cozM, [x + Math.cos(ry) * 0.2, Y + 0.015, z - Math.sin(ry) * 0.2 + 0.08], 1.6, [0, ry - 0.35, 0]); };
  { const cx = -2.75, cz = -0.95, wM = new THREE.MeshPhysicalMaterial({ color: '#fbf8f0', roughness: 0.12, clearcoat: 1 });
    add(new THREE.BoxGeometry(1.7, 0.035, 0.8), wM, [cx, Y + 0.018, cz]);
    for (const [w, d, x0, z0] of [[1.7, 0.06, 0, 0.37], [1.7, 0.06, 0, -0.37], [0.06, 0.8, 0.82, 0], [0.06, 0.8, -0.82, 0]]) add(new THREE.BoxGeometry(w, 0.055, d), wM, [cx + x0, Y + 0.045, cz + z0]);
    const crust = new THREE.MeshPhysicalMaterial({ color: '#9a4a16', roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.3, bumpMap: bump, bumpScale: 1.2 });
    const loafG = new THREE.ExtrudeGeometry(cozS, { depth: 0.78, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 3, curveSegments: 20 }); loafG.translate(0, 0, -0.39);
    add(loafG, [cozM[0], crust], [cx - 0.3, Y + 0.035, cz], [1.75, 1.55, 1], [0, Math.PI / 2, 0]);
    add(cozG, [cozM[0], crust], [cx + 0.42, Y + 0.08, cz + 0.02], 1.7, [0.32, 0.1, 0]);
    add(cozG, [cozM[0], crust], [cx + 0.55, Y + 0.035, cz + 0.06], 1.7, [0, -0.25, 0]); }
  const gbS = new THREE.Shape(); [[0, 0.22], [0.08, 0.16], [0.07, 0.1], [0.2, 0.08], [0.2, 0.02], [0.08, 0.02], [0.14, -0.2], [0.06, -0.22], [0, -0.1], [-0.06, -0.22], [-0.14, -0.2], [-0.08, 0.02], [-0.2, 0.02], [-0.2, 0.08], [-0.07, 0.1], [-0.08, 0.16]].forEach(([a, b], i) => i ? gbS.lineTo(a, b) : gbS.moveTo(a, b));
  const gbG = new THREE.ExtrudeGeometry(gbS, { depth: 0.04, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 }); gbG.rotateX(-Math.PI / 2);
  { const ex = -4.15, ez = 0.95; add(plateG, china, [ex, Y, ez], 0.62); const wM = clay('#fbf8ee', { roughness: 0.35 }), yM = clay('#f2c23a', { roughness: 0.7 }), pk = clay('#c8201a'), pa = clay('#3a7a2a');
    for (let i = 0; i < 8; i++) { const a2 = i / 8 * Math.PI * 2, x = ex + Math.cos(a2) * 0.3, z = ez + Math.sin(a2) * 0.3; add(new THREE.SphereGeometry(0.08, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.55, 1.45).rotateY(-a2), wM, [x, Y + 0.05, z], 1, [Math.PI, 0, 0]); add(new THREE.SphereGeometry(0.05, 10, 8).scale(1, 0.5, 1.2).rotateY(-a2), yM, [x, Y + 0.06, z]); add(new THREE.SphereGeometry(0.012, 6, 4), i % 2 ? pk : pa, [x, Y + 0.085, z]); }
    add(new THREE.SphereGeometry(0.08, 10, 8), pa, [ex, Y + 0.06, ez], [1.4, 0.4, 1.4]); }


  { const wc = document.createElement('canvas'); wc.width = 256; wc.height = 256; const wx = wc.getContext('2d'); wx.fillStyle = '#c9b98a'; wx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 256; i += 64) { wx.fillStyle = '#b8a674'; wx.fillRect(i, 0, 22, 256); wx.fillStyle = '#d8caa0'; wx.fillRect(i + 26, 0, 4, 256); }
    for (const [cx, cy] of [[46, 64], [110, 192], [174, 64], [238, 192]]) { wx.fillStyle = '#8a5a3a'; for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; wx.beginPath(); wx.ellipse(cx + Math.cos(a) * 9, cy + Math.sin(a) * 9, 7, 4, a, 0, Math.PI * 2); wx.fill(); } wx.fillStyle = '#d8a83a'; wx.beginPath(); wx.arc(cx, cy, 4, 0, Math.PI * 2); wx.fill(); }
    const wt = new THREE.CanvasTexture(wc); wt.colorSpace = THREE.SRGBColorSpace; wt.wrapS = wt.wrapT = THREE.RepeatWrapping; wt.repeat.set(24, 7);
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 12), new THREE.MeshStandardMaterial({ map: wt, roughness: 0.95 })); wall.position.set(0, 4.4, -5.0); wall.receiveShadow = true; G.add(wall); }
  G.traverse(o => { if (!o.isMesh) return; if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere(); if (o.geometry.boundingSphere.radius * o.scale.x < 0.16) o.castShadow = false; });
  G.updateMatrixWorld(true); G.traverse(o => { o.matrixAutoUpdate = false; });
  FL.forEach(f => { f.fl.matrixAutoUpdate = true; f.halo.matrixAutoUpdate = true; });
  let last = 0; const tick = (t) => { requestAnimationFrame(tick); if (!G.visible || document.hidden || t - last < 90) return; last = t; const s = t / 1000;
    for (const f of FL) { const n = Math.sin(s * 9 + f.ph) * 0.5 + Math.sin(s * 23 + f.ph * 2) * 0.3 + Math.sin(s * 3.1 + f.ph) * 0.2;
      f.fl.scale.set(1 - n * 0.06, 2.1 + n * 0.3, 1 - n * 0.06);  f.fl.rotation.z = Math.sin(s * 4 + f.ph) * 0.08; f.fl.updateMatrixWorld(true);
      f.halo.material.opacity = 0.07 + n * 0.03; f.pl.intensity = 1.6 + n * 0.6; }
    if (window.__bsTick) window.__bsTick(); };
  requestAnimationFrame(tick);
  return G;
}
