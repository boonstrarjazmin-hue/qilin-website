 // === Qilin Website — JavaScript ===

 // --- Three.js Hero Scene ---
 import * as THREE from 'three';

 const container = document.getElementById('hero-canvas');
 const scene = new THREE.Scene();
 const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
 const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
 renderer.setSize(container.clientWidth, container.clientHeight);
 renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
 container.appendChild(renderer.domElement);

 // Particles — golden mist
 const pCount = 800;
 const pos = new Float32Array(pCount * 3);
 const sizes = new Float32Array(pCount);
 for (let i = 0; i < pCount; i++) {
   pos[i*3] = (Math.random() - 0.5) * 40;
   pos[i*3+1] = (Math.random() - 0.5) * 20;
   pos[i*3+2] = (Math.random() - 0.5) * 20 - 5;
   sizes[i] = Math.random() * 0.08 + 0.02;
 }
 const pGeo = new THREE.BufferGeometry();
 pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
 pGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
 const pMat = new THREE.PointsMaterial({
   color: 0xc9a84c, size: 0.06, transparent: true, opacity: 0.35,
   blending: THREE.AdditiveBlending, depthWrite: false,
 });
 const particles = new THREE.Points(pGeo, pMat);
 scene.add(particles);

 // Golden rings
 const ringGroup = new THREE.Group();
 const ringMat = new THREE.LineBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.06 });
 for (let i = 0; i < 5; i++) {
   const pts = [];
   const r = 2 + i * 1.5;
   const segs = 64;
   for (let j = 0; j <= segs; j++) {
     const a = (j / segs) * Math.PI * 2;
     pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r * 0.3, 0));
   }
   const g = new THREE.BufferGeometry().setFromPoints(pts);
   const m = ringMat.clone();
   m.opacity = 0.02 + i * 0.01;
   const line = new THREE.Line(g, m);
   line.position.z = -3 + i * 1.2;
   ringGroup.add(line);
 }
 scene.add(ringGroup);

 // Central glow
 const glowGeo = new THREE.SphereGeometry(0.4, 16, 16);
 const glowMat = new THREE.MeshBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.08 });
 const glow = new THREE.Mesh(glowGeo, glowMat);
 scene.add(glow);

 camera.position.set(0, 0, 6);

 let mouseX = 0, mouseY = 0;
 document.addEventListener('mousemove', (e) => {
   mouseX = (e.clientX / window.innerWidth - 0.5) * 0.4;
   mouseY = (e.clientY / window.innerHeight - 0.5) * 0.25;
 });

 function animate() {
   requestAnimationFrame(animate);
   const t = Date.now() * 0.001;

   const pPos = particles.geometry.attributes.position.array;
   for (let i = 0; i < pCount; i++) {
     pPos[i*3+1] += Math.sin(t * 0.2 + i) * 0.001;
     pPos[i*3] += Math.sin(t * 0.15 + i * 0.7) * 0.0008;
   }
   particles.geometry.attributes.position.needsUpdate = true;
   particles.rotation.y = t * 0.02 + mouseX * 0.08;
   particles.rotation.x = Math.sin(t * 0.03) * 0.02 + mouseY * 0.06;

   ringGroup.rotation.x = Math.sin(t * 0.1) * 0.06 + 0.15;
   ringGroup.rotation.z = t * 0.05;
   ringGroup.position.y = Math.sin(t * 0.12) * 0.1;

   glow.material.opacity = 0.06 + Math.sin(t * 0.5) * 0.03;

   renderer.render(scene, camera);
 }
 animate();

 function resize() {
   const w = container.clientWidth, h = container.clientHeight;
   camera.aspect = w / h;
   camera.updateProjectionMatrix();
   renderer.setSize(w, h);
 }
 window.addEventListener('resize', resize);

 // --- Nav scroll ---
 const nav = document.getElementById('navbar');
 window.addEventListener('scroll', () => {
   nav.classList.toggle('scrolled', window.scrollY > 50);
 });

 // --- Mobile nav toggle ---
 document.querySelector('.nav-toggle')?.addEventListener('click', () => {
   document.querySelector('.nav-links')?.classList.toggle('open');
 });
 document.querySelectorAll('.nav-links a').forEach(a => {
   a.addEventListener('click', () => document.querySelector('.nav-links')?.classList.remove('open'));
 });

 // --- Scroll reveal ---
 const revealEls = document.querySelectorAll('.char-card, .tl-item, .rank-item, .achieve-card, .gallery-item, .book-card, .about-intro, .section-header');
 revealEls.forEach(el => el.classList.add('reveal'));
 const observer = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
     if (entry.isIntersecting) entry.target.classList.add('visible');
   });
 }, { threshold: 0.1 });
 revealEls.forEach(el => observer.observe(el));

 // --- Gallery canvas art (abstract character portraits) ---
 function drawAbstractPortrait(canvasId, palette) {
   const c = document.getElementById(canvasId);
   if (!c) return;
   const ctx = c.getContext('2d');
   const w = c.width = c.clientWidth;
   const h = c.height = c.clientHeight;
   ctx.clearRect(0, 0, w, h);

   // Background gradient
   const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w*0.7);
   grad.addColorStop(0, palette[0]);
   grad.addColorStop(0.5, palette[1]);
   grad.addColorStop(1, palette[2]);
   ctx.fillStyle = grad;
   ctx.fillRect(0, 0, w, h);

   // Geometric shapes
   for (let i = 0; i < 30; i++) {
     ctx.save();
     ctx.translate(w/2 + (Math.random()-0.5)*w*0.6, h/2 + (Math.random()-0.5)*h*0.6);
     ctx.rotate(Math.random() * Math.PI * 2);
     ctx.globalAlpha = Math.random() * 0.15 + 0.03;
     ctx.strokeStyle = palette[3];
     ctx.lineWidth = Math.random() * 1.5 + 0.3;
     const size = Math.random() * 80 + 20;
     ctx.strokeRect(-size/2, -size/2, size, size);
     ctx.restore();
   }

   // Circles
   for (let i = 0; i < 20; i++) {
     ctx.beginPath();
     ctx.arc(w/2 + (Math.random()-0.5)*w*0.5, h/2 + (Math.random()-0.5)*h*0.5, Math.random()*40+5, 0, Math.PI*2);
     ctx.fillStyle = palette[3];
     ctx.globalAlpha = Math.random() * 0.06 + 0.01;
     ctx.fill();
   }

   // Central abstract figure
   ctx.save();
   ctx.shadowColor = palette[3];
   ctx.shadowBlur = 30;
   ctx.strokeStyle = palette[3];
   ctx.lineWidth = 1.5;
   ctx.globalAlpha = 0.4;

   // Silhouette
   ctx.beginPath();
   ctx.arc(w/2, h*0.35, 25, 0, Math.PI, true);
   ctx.stroke();

   // Body
   ctx.beginPath();
   ctx.moveTo(w/2 - 30, h*0.35);
   ctx.lineTo(w/2 - 20, h*0.75);
   ctx.lineTo(w/2 + 20, h*0.75);
   ctx.lineTo(w/2 + 30, h*0.35);
   ctx.stroke();
   ctx.restore();
 }

 // Draw gallery art
 setTimeout(() => {
   drawAbstractPortrait('art-xml', ['#1a1410', '#0c0e14', '#080c10', '#c9a84c']);
   drawAbstractPortrait('art-lz', ['#0a1812', '#0c0e14', '#080c10', '#2a6b4a']);
   drawAbstractPortrait('art-xml2', ['#1a1410', '#0c0e14', '#080c10', '#8a7a5a']);
   drawAbstractPortrait('art-lz2', ['#0a1812', '#0c0e14', '#080c10', '#4a8a6a']);
   drawAbstractPortrait('art-duo', ['#1a1410', '#0a1812', '#080c10', '#c9a84c']);
   drawAbstractPortrait('art-xml3', ['#14100c', '#0c0e14', '#080c10', '#b89840']);
   drawAbstractPortrait('art-lz3', ['#080e0a', '#0c0e14', '#080c10', '#3a7a5a']);
   drawAbstractPortrait('art-team', ['#100c14', '#0c0e14', '#080c10', '#8a7a5a']);
 }, 100);

 // Resize canvases
 window.addEventListener('resize', () => {
   ['art-xml','art-lz','art-xml2','art-lz2','art-duo','art-xml3','art-lz3','art-team'].forEach(id => {
     const el = document.getElementById(id);
     if (el) { el.width = el.clientWidth; el.height = el.clientHeight; }
   });
 });
