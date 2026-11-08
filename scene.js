// Ar Livre — cena 3D do topo: unidade interna procedural (sem marca de fabricante),
// reflexos de estúdio via PMREM e fluxo de ar em espiral nas cores do logotipo.
// Script clássico (three r149 UMD) para funcionar também via file://.
(() => {
  const host = document.querySelector('#ac-scene');
  if (!host || !window.THREE) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (navigator.connection && navigator.connection.saveData) return;
  try {
    const probe = document.createElement('canvas');
    if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return;
  } catch (e) { return; }

  try {
    const T = THREE;
    const small = innerWidth < 700;
    const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 1.75));
    renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(28, 1, 0.1, 100);

    /* ---------- Estúdio de luz (reflexos) ---------- */
    const pmrem = new T.PMREMGenerator(renderer);
    const studio = new T.Scene();
    studio.add(new T.Mesh(new T.BoxGeometry(30, 30, 30), new T.MeshBasicMaterial({ color: 0x0a2236, side: T.BackSide })));
    const panel = (w, h, color, x, y, z, rx, ry) => {
      const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color, side: T.DoubleSide }));
      m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, 0); studio.add(m);
    };
    panel(16, 5, new T.Color(5.2, 5.2, 5.4), 0, 11, 2, Math.PI / 2, 0);          // softbox de cima
    panel(4, 12, new T.Color(1.2, 3.6, 3.9), -12, 2, 4, 0, Math.PI / 2);         // tira turquesa (esq.)
    panel(3, 10, new T.Color(3.6, 1.5, 1.0), 12, 1, -2, 0, -Math.PI / 2);        // tira coral (dir.)
    panel(18, 3, new T.Color(0.9, 1.6, 2.1), 0, -2, 13, 0, 0);                   // rebatedor frontal
    scene.environment = pmrem.fromScene(studio, 0.035).texture;

    /* ---------- Unidade interna ---------- */
    const W = 4.9, H = 1.34, D = 0.92;
    const unit = new T.Group();
    const rig = new T.Group(); rig.add(unit); scene.add(rig);

    const shell = new T.MeshPhysicalMaterial({ color: 0xf6f9fa, roughness: 0.32, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 1.05, sheen: 0.2 });
    const satin = new T.MeshPhysicalMaterial({ color: 0xe3ebee, roughness: 0.45, metalness: 0, clearcoat: 0.4, envMapIntensity: 0.9 });
    const cavity = new T.MeshStandardMaterial({ color: 0x0b1d2a, roughness: 0.8, metalness: 0.2, envMapIntensity: 0.3 });
    const vaneMat = new T.MeshStandardMaterial({ color: 0x2b3f4c, roughness: 0.55, metalness: 0.35 });
    const glass = new T.MeshPhysicalMaterial({ color: 0x050d14, roughness: 0.08, metalness: 0, clearcoat: 1, envMapIntensity: 1.4 });

    // Perfil lateral (x = profundidade p/ frente, y = altura)
    const p = new T.Shape();
    p.moveTo(0, 0.24);
    p.lineTo(0, H - 0.1);
    p.quadraticCurveTo(0, H, 0.12, H);
    p.lineTo(D - 0.32, H);
    p.bezierCurveTo(D - 0.08, H, D + 0.03, H - 0.1, D + 0.03, H - 0.36);
    p.bezierCurveTo(D + 0.03, 0.8, D + 0.01, 0.58, D - 0.01, 0.47);
    p.quadraticCurveTo(D - 0.03, 0.37, D - 0.14, 0.355);
    p.lineTo(D - 0.38, 0.32);
    p.lineTo(D - 0.44, 0.15);
    p.lineTo(D - 0.2, 0.075);
    p.quadraticCurveTo(D - 0.1, 0.0, D - 0.3, 0.0);
    p.lineTo(0.22, 0.0);
    p.quadraticCurveTo(0, 0, 0, 0.24);
    const bodyGeo = new T.ExtrudeGeometry(p, { depth: W - 0.16, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.05, bevelSegments: 8, curveSegments: 28, steps: 1 });
    bodyGeo.translate(0, 0, -(W - 0.16) / 2);
    const body = new T.Mesh(bodyGeo, shell);
    body.rotation.y = -Math.PI / 2;            // profundidade -> +z (para a câmera)
    unit.add(body);

    // Fundo escuro da saída de ar
    const cav = new T.Mesh(new T.BoxGeometry(W - 0.34, 0.2, 0.02), cavity);
    cav.position.set(0, 0.23, D - 0.42); unit.add(cav);
    const cavTop = new T.Mesh(new T.BoxGeometry(W - 0.34, 0.02, 0.26), cavity);
    cavTop.position.set(0, 0.33, D - 0.27); unit.add(cavTop);

    // Aletas verticais (instanciadas)
    const vanes = new T.InstancedMesh(new T.BoxGeometry(0.012, 0.15, 0.2), vaneMat, 46);
    const mtx = new T.Matrix4();
    for (let i = 0; i < 46; i++) { mtx.makeTranslation(-W / 2 + 0.3 + i * ((W - 0.6) / 45), 0.22, D - 0.3); vanes.setMatrixAt(i, mtx); }
    unit.add(vanes);

    // Defletor (louver) com perfil curvo, articulado na borda de trás
    const lp = new T.Shape();
    lp.moveTo(0, 0); lp.quadraticCurveTo(0.2, 0.035, 0.42, 0.0); lp.lineTo(0.42, -0.022); lp.quadraticCurveTo(0.2, 0.012, 0, -0.022); lp.lineTo(0, 0);
    const louverGeo = new T.ExtrudeGeometry(lp, { depth: W - 0.3, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.008, bevelSegments: 2, curveSegments: 16 });
    louverGeo.translate(0, 0, -(W - 0.3) / 2);
    const louverPivot = new T.Group(); louverPivot.position.set(0, 0.1, D - 0.4); unit.add(louverPivot);
    const louver = new T.Mesh(louverGeo, satin); louver.rotation.y = -Math.PI / 2; louverPivot.add(louver);

    // Vinco do painel frontal
    const seam = new T.Mesh(new T.BoxGeometry(W - 0.2, 0.006, 0.01), new T.MeshStandardMaterial({ color: 0x9fb1ba, roughness: 0.6 }));
    seam.position.set(0, 0.6, D + 0.012); unit.add(seam);

    // Visor com temperatura
    const disp = new T.Mesh(new T.BoxGeometry(0.46, 0.17, 0.012), glass);
    disp.position.set(W / 2 - 0.78, 0.86, D + 0.035); unit.add(disp);
    const c = document.createElement('canvas'); c.width = 256; c.height = 96;
    const g = c.getContext('2d');
    g.fillStyle = '#7ee8e2'; g.shadowColor = '#7ee8e2'; g.shadowBlur = 14;
    g.font = '600 62px "DM Sans", system-ui, sans-serif'; g.textBaseline = 'middle'; g.fillText('23°', 24, 52);
    g.beginPath(); g.arc(222, 48, 7, 0, Math.PI * 2); g.fill();
    const dispTex = new T.CanvasTexture(c); dispTex.encoding = T.sRGBEncoding;
    const readout = new T.Mesh(new T.PlaneGeometry(0.4, 0.15), new T.MeshBasicMaterial({ map: dispTex, transparent: true, toneMapped: false, depthWrite: false }));
    readout.position.set(W / 2 - 0.78, 0.86, D + 0.043); unit.add(readout);

    // Centraliza a unidade no grupo
    unit.position.set(0, -H / 2, -D / 2);

    // Luzes diretas (o grosso vem do ambiente)
    scene.add(new T.HemisphereLight(0xdff6ff, 0x0a2638, 0.55));
    const key = new T.DirectionalLight(0xffffff, 1.4); key.position.set(-4, 6, 6); scene.add(key);
    const rim = new T.DirectionalLight(0x5fe0e0, 2.2); rim.position.set(5, 1.5, -4); scene.add(rim);
    const warm = new T.DirectionalLight(0xff9a6b, 0.7); warm.position.set(4, -3, 3); scene.add(warm);

    /* ---------- Fluxo de ar (shader) ---------- */
    const N = small ? 1500 : 3200;
    const seed = new Float32Array(N * 4), col = new Float32Array(N * 3);
    const brand = ['#e8493a', '#f2953f', '#e8c64a', '#8fc65a', '#46c3b8', '#2a9fd6', '#1c6fb8'].map(h => new T.Color(h));
    const streams = 18;
    for (let i = 0; i < N; i++) {
      const inStream = Math.random() < 0.8; const li = Math.floor(Math.random() * streams);
      const lane = inStream ? (li + 0.5) / streams + (Math.random() - 0.5) * 0.012 : Math.random();
      seed[i * 4] = Math.random();                 // fase
      seed[i * 4 + 1] = lane;                      // posição ao longo da saída (0..1)
      seed[i * 4 + 2] = inStream ? 0.5 + (li % 3) * 0.12 + Math.random() * 0.04 : Math.random(); // velocidade
      seed[i * 4 + 3] = inStream ? (li * 0.37) % 1 + Math.random() * 0.05 : Math.random(); // ângulo da espiral (coerente por fluxo)
      const k = lane * (brand.length - 1), a = Math.floor(k), b = Math.min(brand.length - 1, a + 1);
      const cc = brand[a].clone().lerp(brand[b], k - a);
      col[i * 3] = cc.r; col[i * 3 + 1] = cc.g; col[i * 3 + 2] = cc.b;
    }
    const pg = new T.BufferGeometry();
    pg.setAttribute('position', new T.BufferAttribute(new Float32Array(N * 3), 3));
    pg.setAttribute('aSeed', new T.BufferAttribute(seed, 4));
    pg.setAttribute('aColor', new T.BufferAttribute(col, 3));
    const uniforms = {
      uTime: { value: 0 }, uSpread: { value: 0 }, uIntro: { value: 0 },
      uPR: { value: renderer.getPixelRatio() }, uSize: { value: small ? 70 : 84 },
      uW: { value: W - 0.6 }, uOrigin: { value: new T.Vector3(0, 0.2 - H / 2, D - 0.32 - D / 2) }
    };
    const pm = new T.ShaderMaterial({
      uniforms, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      vertexShader: `
        attribute vec4 aSeed; attribute vec3 aColor;
        uniform float uTime, uSpread, uIntro, uPR, uSize, uW; uniform vec3 uOrigin;
        varying vec3 vColor; varying float vAlpha;
        void main(){
          float speed = 0.075 + aSeed.z * 0.07;
          float t = fract(aSeed.x + uTime * speed);
          vec3 pos = uOrigin;
          pos.x += (aSeed.y - 0.5) * uW;
          // jato: para frente e descendo, abrindo em leque
          pos.z += t * (3.6 + aSeed.z * 1.4);
          pos.y -= t * 0.55 + t * t * (1.2 + uSpread * 0.8);
          pos.x += (aSeed.y - 0.5) * t * (1.6 + uSpread * 2.4);
          // espiral em torno do eixo do jato (assinatura da marca)
          float ang = t * (7.5 + aSeed.z * 3.0) + aSeed.w * 6.2831 + uTime * 0.6;
          float rad = 0.03 + t * (0.32 + uSpread * 0.35);
          pos.y += sin(ang) * rad;
          pos.x += cos(ang) * rad * 0.7;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * uPR * (0.55 + t * 0.9) / -mv.z;
          vAlpha = smoothstep(0.0, 0.06, t) * (1.0 - smoothstep(0.62, 1.0, t)) * uIntro;
          vColor = aColor;
        }`,
      fragmentShader: `
        varying vec3 vColor; varying float vAlpha;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d);
          float core = smoothstep(0.18, 0.0, d);
          gl_FragColor = vec4(vColor * (0.9 + core * 1.2), a * a * vAlpha);
        }`
    });
    const air = new T.Points(pg, pm);
    air.frustumCulled = false;
    rig.add(air);

    /* ---------- Tamanho e enquadramento ---------- */
    let baseDist = 12;
    function size() {
      const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      const hf = 2 * Math.atan(Math.tan(T.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
      baseDist = (W * 0.78) / Math.tan(hf / 2);
      baseDist = Math.max(baseDist, 9.5);
    }
    const ro = new ResizeObserver(size); ro.observe(host); size();

    /* ---------- Animação ---------- */
    const ease = x => 1 - Math.pow(1 - x, 4);
    let visible = true, raf = 0, last = 0, time = 0, born = 0, scrollS = 0, started = false;
    const introDelay = document.documentElement.classList.contains('no-loader') ? 200 : 900;
    function frame(now) {
      if (!visible || document.hidden) return;
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016); last = now; time += dt;
      if (!born) born = now + introDelay;
      const intro = ease(Math.max(0, Math.min(1, (now - born) / 1800)));
      const r = host.getBoundingClientRect();
      const target = Math.max(0, Math.min(1, -r.top / Math.max(1, innerHeight * 0.75)));
      scrollS += (target - scrollS) * Math.min(1, dt * 5);

      rig.rotation.y = -0.62 + intro * 0.1 + scrollS * 0.55 + Math.sin(time * 0.35) * 0.02;
      rig.rotation.x = 0.2 - scrollS * 0.1 + Math.sin(time * 0.5) * 0.008;
      rig.position.y = 0.42 + Math.sin(time * 0.7) * 0.05 + (1 - intro) * -0.35 + scrollS * 0.3;
      rig.scale.setScalar(0.94 + intro * 0.06);
      louverPivot.rotation.x = -(0.12 + intro * 0.55 + scrollS * 0.35 + Math.sin(time * 0.9) * 0.02);
      uniforms.uTime.value = time;
      uniforms.uIntro.value = intro;
      uniforms.uSpread.value = scrollS;
      camera.position.set(0, -0.35, baseDist * (1 - scrollS * 0.12));
      camera.lookAt(0, 0.05, 0);
      renderer.render(scene, camera);
      if (!started) { started = true; host.classList.add('has-frame'); }
      raf = requestAnimationFrame(frame);
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting; cancelAnimationFrame(raf); last = 0;
      if (visible) raf = requestAnimationFrame(frame);
    });
    io.observe(host);
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(raf); last = 0;
      if (!document.hidden && visible) raf = requestAnimationFrame(frame);
    });
    addEventListener('pagehide', () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material && o.material.dispose) o.material.dispose(); });
      dispTex.dispose(); pmrem.dispose(); renderer.dispose();
    }, { once: true });
  } catch (err) {
    host.replaceChildren();
  }
})();
