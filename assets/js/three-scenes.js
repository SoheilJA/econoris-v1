/* ═══ Econoris — صحنه‌های سه‌بعدی صفحات خدمات
   graph: شبکه دانش (میز پژوهشی) | room: اتاق ایزومتریک | molecule: مولکول | globe: کره اتصالات ═══ */
(function () {
    const E = window.Econoris = window.Econoris || {};
    if (!window.THREE) return;

    /* ── اجرای مشترک: رندرر، resize، توقف خارج از دید/تب مخفی، dispose ── */
    function runtime(canvas) {
        const U = E.utils || {};
        const isMobile = !!U.isTouch, reduced = !!U.reduced;
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, .1, 300);
        const disposables = [];
        const track = (o) => { disposables.push(o); return o; };
        let tick = null, raf = null, visible = true, inView = true, last = performance.now();

        function resize() {
            const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
            renderer.setSize(w, h, false);
            camera.aspect = w / h; camera.updateProjectionMatrix();
        }
        const ro = new ResizeObserver(resize);
        ro.observe(canvas.parentElement || canvas);
        resize();

        function loop(now) {
            raf = requestAnimationFrame(loop);
            const dt = Math.min(50, now - last); last = now;
            if (tick) tick(dt * .001, now * .001);
            renderer.render(scene, camera);
        }
        function start() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } }
        function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }
        function sync() {
            if (reduced) { if (tick) tick(.016, 0); renderer.render(scene, camera); stop(); return; }
            (inView && visible) ? start() : stop();
        }
        const io = new IntersectionObserver((en) => { inView = en[0].isIntersecting; sync(); }, { threshold: 0 });
        io.observe(canvas);
        const onVis = () => { visible = !document.hidden; sync(); };
        document.addEventListener('visibilitychange', onVis);
        sync();

        const api = { renderer, scene, camera, track, start, stop, setTick(fn) { tick = fn; } };
        api.destroy = function () {
            stop(); ro.disconnect(); io.disconnect();
            document.removeEventListener('visibilitychange', onVis);
            disposables.forEach((d) => d.dispose && d.dispose());
            renderer.dispose();
        };
        return api;
    }

    /* ── تکسچر درخشش مشترک ── */
    let _glow = null;
    function glowTex(rt) {
        if (_glow) return _glow;
        const c = document.createElement('canvas'); c.width = c.height = 128;
        const x = c.getContext('2d');
        const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(.3, 'rgba(255,255,255,.45)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = g; x.fillRect(0, 0, 128, 128);
        _glow = new THREE.CanvasTexture(c);
        rt.track(_glow);
        return _glow;
    }
    function glowSprite(rt, color, scale, opacity) {
        const s = new THREE.Sprite(rt.track(new THREE.SpriteMaterial({
            map: glowTex(rt), color, transparent: true,
            opacity: opacity == null ? .9 : opacity,
            blending: THREE.AdditiveBlending, depthWrite: false
        })));
        s.scale.setScalar(scale);
        return s;
    }
    function label(rt, text, glowColor) {
        const c = document.createElement('canvas'); c.width = 256; c.height = 64;
        const x = c.getContext('2d');
        x.font = '700 25px Vazirmatn, Arial, sans-serif';
        x.textAlign = 'center'; x.textBaseline = 'middle';
        x.shadowColor = glowColor; x.shadowBlur = 14; x.fillStyle = '#F2F6FF';
        x.fillText(text, 128, 34);
        const s = new THREE.Sprite(rt.track(new THREE.SpriteMaterial({
            map: rt.track(new THREE.CanvasTexture(c)), transparent: true, depthWrite: false
        })));
        s.scale.set(2.7, .68, 1);
        return s;
    }
    const hex = (n) => '#' + n.toString(16).padStart(6, '0');

    E.scenes = E.scenes || {};

    /* ═══ ۱) شبکه دانش — میز پژوهشی ═══ */
    E.scenes.graph = function (canvas) {
        const rt = runtime(canvas);
        const { scene, camera } = rt;
        camera.position.set(0, .4, 14);

        const LABELS = ['PubMed', 'Scopus', 'Web of Science', 'Journals', 'Patents', 'Clinical Trials', 'Regulatory'];
        const COLS = [0x7C4DFF, 0x2F6BFF, 0x00D4C2, 0xFF4FA3, 0xFFB938, 0xB6F23A, 0xFF6B6B];
        const g = new THREE.Group(); scene.add(g);
        const pts = [];
        LABELS.forEach((lb, i) => {
            const a = (i / LABELS.length) * Math.PI * 2;
            const r = 3.6 + (i % 2) * 1.0;
            const p = new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 1.35) * 1.9, Math.sin(a) * r * .75);
            pts.push(p);
            const col = COLS[i % COLS.length];
            const dot = new THREE.Mesh(rt.track(new THREE.SphereGeometry(.12, 12, 12)), rt.track(new THREE.MeshBasicMaterial({ color: col })));
            dot.position.copy(p); g.add(dot);
            const glow = glowSprite(rt, col, .95); glow.position.copy(p); g.add(glow);
            const t = label(rt, lb, hex(col));
            t.position.copy(p.clone().multiplyScalar(1.32)); g.add(t);
        });
        const seg = [];
        for (let i = 0; i < pts.length; i++) {
            const j = (i + 1) % pts.length;
            seg.push(...pts[i].toArray(), ...pts[j].toArray());
            if (i % 2 === 0) { const k = (i + 3) % pts.length; seg.push(...pts[i].toArray(), ...pts[k].toArray()); }
        }
        const lg = rt.track(new THREE.BufferGeometry());
        lg.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
        const lm = rt.track(new THREE.LineBasicMaterial({ color: 0x93a7ff, transparent: true, opacity: .3, blending: THREE.AdditiveBlending }));
        g.add(new THREE.LineSegments(lg, lm));

        /* میز شناور + برگه‌ها */
        const desk = new THREE.Mesh(rt.track(new THREE.PlaneGeometry(5.2, 3.4)),
            rt.track(new THREE.MeshBasicMaterial({ color: 0x131c44, transparent: true, opacity: .5, side: THREE.DoubleSide })));
        desk.rotation.x = -Math.PI / 2.2; desk.position.y = -3; scene.add(desk);
        const papers = [];
        for (let i = 0; i < 5; i++) {
            const p = new THREE.Mesh(rt.track(new THREE.PlaneGeometry(.72, .52)),
                rt.track(new THREE.MeshBasicMaterial({ color: 0xE9EFFB, transparent: true, opacity: .8, side: THREE.DoubleSide })));
            p.rotation.x = -Math.PI / 2.2;
            p.position.set(-1.6 + i * .85, -2.75 + (i % 2) * .18, .4 - (i % 3) * .5);
            scene.add(p); papers.push(p);
        }
        let tx = 0, ty = 0, cx = 0, cy = 0;
        window.addEventListener('pointermove', (e) => {
            tx = (e.clientX / innerWidth - .5) * 2; ty = (e.clientY / innerHeight - .5) * 2;
        }, { passive: true });
        rt.setTick((dt, t) => {
            g.rotation.y += dt * .12;
            cx += (tx - cx) * .04; cy += (ty - cy) * .04;
            camera.position.x = cx * 1.2; camera.position.y = .4 - cy * .8; camera.lookAt(0, 0, 0);
            lm.opacity = .22 + (Math.sin(t * 2.2) * .5 + .5) * .2;
            papers.forEach((p, i) => {
                p.position.y = -2.75 + Math.sin(t * 1.6 + i) * .1;
                p.rotation.z = Math.sin(t * .8 + i) * .12;
            });
        });
        return rt;
    };

    /* ═══ ۲) اتاق اختصاصی ایزومتریک ═══ */
    E.scenes.room = function (canvas) {
        const rt = runtime(canvas);
        const { scene, camera } = rt;
        camera.position.set(6.8, 5.6, 6.8); camera.lookAt(0, .8, 0);

        const M = 0xFF4FA3, C = 0xFF6B6B, G = 0xFFB938;
        const g = new THREE.Group(); scene.add(g);
        const box = (w, h, d, c, o) => new THREE.Mesh(rt.track(new THREE.BoxGeometry(w, h, d)),
            rt.track(new THREE.MeshBasicMaterial({ color: c, transparent: o != null, opacity: o == null ? 1 : o })));

        const floor = box(4.6, .14, 4.6, 0x1C1244); floor.position.y = 0; g.add(floor);
        const wb = box(4.6, 2.7, .1, 0x271A58, .45); wb.position.set(0, 1.35, -2.3); g.add(wb);
        const wl = box(.1, 2.7, 4.6, 0x271A58, .35); wl.position.set(-2.3, 1.35, 0); g.add(wl);
        [wb, wl, floor].forEach((m) => {
            m.add(new THREE.LineSegments(rt.track(new THREE.EdgesGeometry(m.geometry)),
                rt.track(new THREE.LineBasicMaterial({ color: M, transparent: true, opacity: .5 }))));
        });
        /* درِ نورانی (نشانه «اختصاصی») */
        const door = box(.95, 1.8, .1, M, .85); door.position.set(1.5, .9, -2.22); g.add(door);
        const doorGlow = glowSprite(rt, M, 2.2, .5); doorGlow.position.set(1.5, .9, -2.05); g.add(doorGlow);
        /* میز کار */
        const top = box(2, .1, 1, 0x2F245E); top.position.set(.1, .78, .35); g.add(top);
        [-.8, .85].forEach((dx) => { const l = box(.1, .72, .8, 0x241B4E); l.position.set(.1 + dx, .38, .35); g.add(l); });
        /* صفحه نمایش درخشان */
        const screen = new THREE.Mesh(rt.track(new THREE.PlaneGeometry(1.15, .68)),
            rt.track(new THREE.MeshBasicMaterial({ color: G, transparent: true, opacity: .8, side: THREE.DoubleSide })));
        screen.position.set(.1, 1.5, .05); screen.rotation.y = .5; g.add(screen);
        const scrGlow = glowSprite(rt, G, 1.5, .35); scrGlow.position.copy(screen.position); g.add(scrGlow);
        /* ارلن + حباب‌ها */
        const flask = new THREE.Mesh(rt.track(new THREE.CylinderGeometry(.05, .16, .34, 10)),
            rt.track(new THREE.MeshBasicMaterial({ color: C })));
        flask.position.set(-.55, .98, .55); g.add(flask);
        const bubbles = [];
        for (let i = 0; i < 3; i++) { const b = glowSprite(rt, C, .16, .9); b.position.set(-.55, .95, .55); g.add(b); bubbles.push(b); }
        /* قفل و کلید شناور */
        const lockG = new THREE.Group();
        lockG.add(box(.3, .26, .12, G));
        const shackle = new THREE.Mesh(rt.track(new THREE.TorusGeometry(.14, .035, 8, 18, Math.PI)),
            rt.track(new THREE.MeshBasicMaterial({ color: G })));
        shackle.position.y = .16; lockG.add(shackle);
        lockG.position.set(2.15, 2.15, .6); g.add(lockG);

        let progress = 0, stage = -1;
        rt.setProgress = (p) => { progress = p; };
        rt.setStage = (i) => { stage = i; };
        const stageTargets = [top, screen, flask, door, lockG];
        rt.setTick((dt, t) => {
            g.rotation.y = -.55 + Math.sin(t * .25) * .07 + progress * Math.PI * .85;
            door.position.x = 1.5 + progress * .55;
            doorGlow.position.x = door.position.x;
            screen.material.opacity = .65 + Math.sin(t * 6) * .12;
            scrGlow.material.opacity = .25 + Math.sin(t * 6) * .1;
            lockG.rotation.y += dt * 1.1;
            bubbles.forEach((b, i) => {
                const u = (t * .5 + i * .33) % 1;
                b.position.y = .95 + u * .5; b.material.opacity = .9 * (1 - u);
            });
            stageTargets.forEach((m, i) => { if (!m) return; m.scale.setScalar(i === stage ? 1 + Math.sin(t * 4) * .08 : 1); });
        });
        return rt;
    };

    /* ═══ ۳) مولکول تعاملی — آزمایشگاه ═══ */
    E.scenes.molecule = function (canvas) {
        const rt = runtime(canvas);
        const { scene, camera } = rt;
        camera.position.set(0, 0, 10.5);
        const g = new THREE.Group(); scene.add(g);

        /* چیدمان شبه‌مولکولی: حلقه شش‌تایی + سه شاخه */
        const P = [], B = [];
        for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; P.push([Math.cos(a) * 1.7, Math.sin(a) * 1.7, 0]); }
        P.push([3.2, .95, .6], [3.1, -1.15, -.5], [-3.25, .85, -.4]);
        for (let i = 0; i < 6; i++) B.push([i, (i + 1) % 6]);
        B.push([0, 6], [2, 7], [4, 8]);

        const cols = [0x00D4C2, 0xB6F23A, 0x2F6BFF];
        const atoms = [];
        P.forEach((p, i) => {
            const col = cols[i % cols.length];
            const a = new THREE.Mesh(rt.track(new THREE.SphereGeometry(.34, 16, 16)), rt.track(new THREE.MeshBasicMaterial({ color: col })));
            a.position.set(p[0], p[1], p[2]); g.add(a); atoms.push(a);
            const gl = glowSprite(rt, col, 1.15, .55); gl.position.set(p[0], p[1], p[2]); g.add(gl);
        });
        B.forEach((pair) => {
            const va = new THREE.Vector3(P[pair[0]][0], P[pair[0]][1], P[pair[0]][2]);
            const vb = new THREE.Vector3(P[pair[1]][0], P[pair[1]][1], P[pair[1]][2]);
            const len = va.distanceTo(vb);
            const cyl = new THREE.Mesh(rt.track(new THREE.CylinderGeometry(.07, .07, len, 8)),
                rt.track(new THREE.MeshBasicMaterial({ color: 0x7EE3D8, transparent: true, opacity: .75 })));
            cyl.position.copy(va.clone().add(vb).multiplyScalar(.5));
            cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
            g.add(cyl);
        });

        /* درگ برای چرخش (روی موبایل اسکرول عمودی آزاد می‌ماند) */
        let rx = .2, ry = .4, trx = .2, tryy = .4, drag = false, px = 0, py = 0;
        canvas.style.touchAction = 'pan-y';
        canvas.addEventListener('pointerdown', (e) => { drag = true; px = e.clientX; py = e.clientY; try { canvas.setPointerCapture(e.pointerId); } catch (err) { } });
        canvas.addEventListener('pointermove', (e) => {
            if (!drag) return;
            tryy += (e.clientX - px) * .006; trx += (e.clientY - py) * .006;
            px = e.clientX; py = e.clientY;
        });
        window.addEventListener('pointerup', () => { drag = false; });

        rt.setTick((dt, t) => {
            if (!drag) tryy += dt * .22;
            rx += (trx - rx) * .09; ry += (tryy - ry) * .09;
            g.rotation.x = rx; g.rotation.y = ry;
            atoms.forEach((a, i) => a.scale.setScalar(1 + Math.sin(t * 2 + i) * .06));
        });
        return rt;
    };

    /* ═══ ۴) کره اتصالات — اینترنت پرسرعت ═══ */
    E.scenes.globe = function (canvas) {
        const rt = runtime(canvas);
        const { scene, camera } = rt;
        camera.position.set(0, 1, 9);
        const R = 2.7;
        const g = new THREE.Group(); scene.add(g);

        g.add(new THREE.Mesh(rt.track(new THREE.SphereGeometry(R, 30, 20)),
            rt.track(new THREE.MeshBasicMaterial({ color: 0x1B3A6B, wireframe: true, transparent: true, opacity: .3 }))));
        const core = glowSprite(rt, 0x2F6BFF, 3.6, .18); g.add(core);

        const sp = [];
        for (let i = 0; i < 160; i++) {
            const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u);
            sp.push(Math.cos(th) * s * R, u * R, Math.sin(th) * s * R);
        }
        const pg = rt.track(new THREE.BufferGeometry());
        pg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
        g.add(new THREE.Points(pg, rt.track(new THREE.PointsMaterial({ color: 0x67E8F9, size: .05, transparent: true, opacity: .7 }))));

        function ll(lat, lon, r) {
            const phi = (90 - lat) * Math.PI / 180, theta = (lon + 180) * Math.PI / 180;
            return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
        }
        /* نشانگر مشهد */
        const mash = ll(36.3, 59.6, R * 1.03);
        const pin = glowSprite(rt, 0xB6F23A, .85, 1); pin.position.copy(mash); g.add(pin);
        const ring = new THREE.Mesh(rt.track(new THREE.RingGeometry(.16, .2, 24)),
            rt.track(new THREE.MeshBasicMaterial({ color: 0xB6F23A, transparent: true, opacity: .8, side: THREE.DoubleSide })));
        ring.position.copy(mash); ring.lookAt(0, 0, 0); g.add(ring);

        const cities = [[40.7, -74], [51.5, -.1], [35.7, 139.7], [52.5, 13.4], [1.35, 103.8], [-33.9, 151.2], [37.7, -122.4]];
        const packets = [];
        cities.forEach((c, i) => {
            const from = ll(c[0], c[1], R * 1.02);
            const mid = from.clone().add(mash).multiplyScalar(.5).normalize().multiplyScalar(R * (1.45 + (i % 3) * .18));
            const curve = new THREE.QuadraticBezierCurve3(from, mid, mash);
            g.add(new THREE.Line(rt.track(new THREE.BufferGeometry().setFromPoints(curve.getPoints(42))),
                rt.track(new THREE.LineBasicMaterial({ color: 0x22D3EE, transparent: true, opacity: .5 }))));
            const pk = glowSprite(rt, 0xB6F23A, .3, 1); g.add(pk);
            packets.push({ pk, curve, off: i / cities.length });
        });
        rt.setTick((dt, t) => {
            g.rotation.y += dt * .05;
            core.material.opacity = .14 + Math.sin(t * 1.4) * .05;
            packets.forEach((p) => {
                const u = (t * .11 + p.off) % 1;
                p.pk.position.copy(p.curve.getPoint(u));
                p.pk.material.opacity = Math.sin(u * Math.PI);
            });
            const rp = (t % 1.6) / 1.6;
            ring.scale.setScalar(1 + rp * 1.6);
            ring.material.opacity = .8 * (1 - rp);
        });
        return rt;
    };
})();