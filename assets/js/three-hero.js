/* ═══ Econoris — صحنه سه‌بعدی هیرو (شبکه مولکولی + کپسول‌ها و شش‌ضلعی‌های شناور)
   قابلیت‌ها: پارالاکس ماوس/لمس، pause خارج از دید / تب مخفی، dispose کامل ═══ */
(function () {
  const E = window.Econoris = window.Econoris || {};

  function makeGlowTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(.28, 'rgba(255,255,255,.5)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  E.mountHeroScene = function (canvas, opts = {}) {
    if (!window.THREE || !canvas) return null;
    const U = E.utils || { reduced: false, isTouch: false };
    const reduced = U.reduced, isMobile = U.isTouch;
    const palette = [0x2F6BFF, 0x7C4DFF, 0x00D4C2, 0xFF4FA3, 0xFFB938, 0xFF6B6B];

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, .1, 120);
    camera.position.set(0, 0, 15);

    const disposables = [];
    const track = (x) => { disposables.push(x); return x; };
    const glowTex = track(makeGlowTexture());

    /* ── خوشه مولکولی (ball-and-stick) ── */
    const group = new THREE.Group(); scene.add(group);
    const N = opts.nodes || (isMobile ? 14 : 24);
    const nodes = [];
    const sphGeo = track(new THREE.SphereGeometry(.17, 14, 14));
    for (let i = 0; i < N; i++) {
      const k = i + .5;
      const phi = Math.acos(1 - 2 * k / N), theta = Math.PI * (1 + Math.sqrt(5)) * k;
      const r = 3.1 + Math.sin(i * 12.9898) * .5;
      const pos = new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi));
      const col = palette[i % palette.length];
      const m = new THREE.Mesh(sphGeo, track(new THREE.MeshBasicMaterial({ color: col })));
      m.position.copy(pos); group.add(m);
      const glow = new THREE.Sprite(track(new THREE.SpriteMaterial({
        map: glowTex, color: col, transparent: true, opacity: .85,
        blending: THREE.AdditiveBlending, depthWrite: false })));
      glow.scale.setScalar(1.15); glow.position.copy(pos); group.add(glow);
      m.userData.glow = glow; nodes.push(m);
    }
    const bondPos = [];
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      if (nodes[i].position.distanceTo(nodes[j].position) < 2.35) {
        bondPos.push(nodes[i].position.x, nodes[i].position.y, nodes[i].position.z,
          nodes[j].position.x, nodes[j].position.y, nodes[j].position.z);
      }
    }
    const bg = track(new THREE.BufferGeometry());
    bg.setAttribute('position', new THREE.Float32BufferAttribute(bondPos, 3));
    group.add(new THREE.LineSegments(bg, track(new THREE.LineBasicMaterial({
      color: 0x93a7ff, transparent: true, opacity: .32, blending: THREE.AdditiveBlending }))));
    const nucleus = new THREE.Sprite(track(new THREE.SpriteMaterial({
      map: glowTex, color: 0x4470ff, transparent: true, opacity: .5,
      blending: THREE.AdditiveBlending, depthWrite: false })));
    nucleus.scale.setScalar(7.5); group.add(nucleus);

    /* ── کپسول‌ها و شش‌ضلعی‌های مداری ── */
    const orbiters = [];
    const capGeo = track(new THREE.CapsuleGeometry(.16, .55, 4, 10));
    const hexGeo = track(new THREE.CylinderGeometry(.34, .34, .05, 6));
    const nOrb = isMobile ? 6 : 11;
    for (let i = 0; i < nOrb; i++) {
      const isCap = i % 3 !== 2;
      const m = new THREE.Mesh(isCap ? capGeo : hexGeo,
        track(new THREE.MeshBasicMaterial({ color: palette[(i + 2) % palette.length], transparent: true, opacity: .9 })));
      m.userData = {
        r: 5.2 + (i % 4) * 1.15, sp: .12 + Math.random() * .16, ph: Math.random() * Math.PI * 2,
        self: .4 + Math.random() * .8, y0: Math.random() * 4 - 2
      };
      scene.add(m); orbiters.push(m);
    }

    /* ── غبار ستاره‌ای ── */
    const dustN = isMobile ? 90 : 220;
    const dp = new Float32Array(dustN * 3);
    for (let i = 0; i < dustN; i++) {
      const r = 9 + Math.random() * 10, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      dp[i * 3] = r * Math.sin(ph) * Math.cos(th);
      dp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * .6;
      dp[i * 3 + 2] = r * Math.cos(ph);
    }
    const dg = track(new THREE.BufferGeometry());
    dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
    const dust = new THREE.Points(dg, track(new THREE.PointsMaterial({
      size: .09, map: glowTex, transparent: true, opacity: .55, color: 0x9fb4ff,
      blending: THREE.AdditiveBlending, depthWrite: false })));
    scene.add(dust);

    /* ── تعامل و رندر ── */
    let tx = 0, ty = 0, cx = 0, cy = 0;
    function onPointer(e) {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      tx = (x / innerWidth - .5) * 2; ty = (y / innerHeight - .5) * 2;
    }
    window.addEventListener('pointermove', onPointer, { passive: true });

    function resize() {
      const w = canvas.clientWidth || (canvas.parentElement && canvas.parentElement.clientWidth) || 1;
      const h = canvas.clientHeight || (canvas.parentElement && canvas.parentElement.clientHeight) || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement || canvas);
    resize();

    let raf = null, visible = true, inView = true, t = 0, lastT = performance.now();
    function loop(now) {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(50, now - lastT); lastT = now;
      t += dt * .001;
      cx += (tx - cx) * .04; cy += (ty - cy) * .04;
      group.rotation.y += dt * .00012;
      group.rotation.x = cy * .22; group.rotation.z = -cx * .06;
      camera.position.x = cx * 1.1; camera.position.y = -cy * .7;
      camera.lookAt(0, 0, 0);
      group.scale.setScalar(1 + Math.sin(t * 1.8) * .06);
      nodes.forEach((n, i) => {
        const s = 1 + Math.sin(t * 2.2 + i) * .18;
        n.scale.setScalar(s);
        if (n.userData.glow) n.userData.glow.scale.setScalar(1.15 * s);
      });
      orbiters.forEach((o) => {
        const u = o.userData, a = t * u.sp + u.ph;
        o.position.set(Math.cos(a) * u.r, u.y0 + Math.sin(a * 1.7) * .8, Math.sin(a) * u.r);
        o.rotation.x += dt * .0004 * u.self; o.rotation.y += dt * .0005 * u.self;
      });
      dust.rotation.y = t * .02;
      renderer.render(scene, camera);
    }
    function start() { if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(loop); } }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
    function sync() { (inView && visible && !reduced) ? start() : stop(); }

    const io = new IntersectionObserver((en) => { inView = en[0].isIntersecting; sync(); }, { threshold: 0 });
    io.observe(canvas);
    function onVis() { visible = !document.hidden; sync(); }
    document.addEventListener('visibilitychange', onVis);

    if (reduced) { resize(); renderer.render(scene, camera); }
    else sync();

    return {
      destroy() {
        stop(); ro.disconnect(); io.disconnect();
        document.removeEventListener('visibilitychange', onVis);
        window.removeEventListener('pointermove', onPointer);
        disposables.forEach((d) => d.dispose && d.dispose());
        renderer.dispose();
      }
    };
  };
})();