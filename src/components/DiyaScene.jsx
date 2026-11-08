import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function DiyaScene() {
  const host = useRef(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer, raf, observer;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 1.8, 8.4);
    camera.lookAt(0, 0.25, 0);

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      el.classList.add('webgl-fallback');
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffc879, 1.35));
    const key = new THREE.PointLight(0xff9d35, 3.2, 12);
    key.position.set(0, 2.2, 1.4);
    scene.add(key);
    const rim = new THREE.PointLight(0x8c5bff, 1.4, 10);
    rim.position.set(-3, 1, -2);
    scene.add(rim);

    const gold = new THREE.MeshStandardMaterial({ color: 0xd99532, metalness: 0.88, roughness: 0.23 });
    const innerGold = new THREE.MeshStandardMaterial({ color: 0xf7bd57, metalness: 0.72, roughness: 0.28, side: THREE.DoubleSide });
    const profile = [
      new THREE.Vector2(0, -0.28), new THREE.Vector2(0.35, -0.27),
      new THREE.Vector2(0.75, -0.15), new THREE.Vector2(1.08, 0.05),
      new THREE.Vector2(1.16, 0.16), new THREE.Vector2(1.05, 0.21),
      new THREE.Vector2(0.83, 0.08), new THREE.Vector2(0.5, -0.02),
      new THREE.Vector2(0, -0.02)
    ];
    const bowl = new THREE.Mesh(new THREE.LatheGeometry(profile, 96), gold);
    bowl.scale.set(1.05, 0.72, 0.72);
    bowl.position.y = -0.05;
    scene.add(bowl);

    const inner = new THREE.Mesh(new THREE.CircleGeometry(0.82, 64), innerGold);
    inner.rotation.x = -Math.PI / 2;
    inner.scale.set(1.12, 0.7, 1);
    inner.position.y = 0.055;
    scene.add(inner);

    const wick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.055, 0.35, 16),
      new THREE.MeshStandardMaterial({ color: 0x38251c, roughness: 1 })
    );
    wick.position.set(0, 0.28, 0);
    wick.rotation.z = -0.12;
    scene.add(wick);

    const flameGroup = new THREE.Group();
    flameGroup.position.set(0, 0.56, 0);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffa12b, transparent: true, opacity: 0.94 });
    const flame = new THREE.Mesh(new THREE.SphereGeometry(0.19, 24, 24), flameMat);
    flame.scale.set(0.68, 1.8, 0.68);
    flameGroup.add(flame);
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xfff4c2 })
    );
    core.scale.set(0.75, 1.45, 0.75);
    core.position.y = -0.055;
    flameGroup.add(core);
    scene.add(flameGroup);

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(0.72, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xff9a31, transparent: true, opacity: 0.075, side: THREE.BackSide })
    );
    halo.position.set(0, 0.62, -0.05);
    halo.scale.set(1, 1.3, 0.55);
    scene.add(halo);

    const dustGeo = new THREE.BufferGeometry();
    const count = 240;
    const positions = new Float32Array(count * 3);
    const speeds = [];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = Math.random() * 3.8 - 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.8;
      speeds.push(0.15 + Math.random() * 0.35);
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xffd18a, size: 0.025, transparent: true, opacity: 0.75 }));
    scene.add(dust);

    const clock = new THREE.Clock();
    const resize = () => {
      if (!el.clientWidth || !el.clientHeight) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    observer = new ResizeObserver(resize);
    observer.observe(el);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      flameGroup.scale.y = 1 + Math.sin(t * 8) * 0.07 + Math.sin(t * 13) * 0.035;
      flameGroup.rotation.z = Math.sin(t * 5) * 0.07;
      key.intensity = 2.7 + Math.sin(t * 9) * 0.35 + Math.random() * 0.12;
      bowl.rotation.y = Math.sin(t * 0.45) * 0.045;
      const p = dustGeo.attributes.position.array;
      for (let i = 0; i < count; i++) {
        p[i * 3 + 1] += speeds[i] * 0.003;
        p[i * 3] += Math.sin(t + i) * 0.0008;
        if (p[i * 3 + 1] > 3.6) p[i * 3 + 1] = -0.4;
      }
      dustGeo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      scene.traverse(o => {
        o.geometry?.dispose();
        if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
        else o.material?.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="diya-canvas" ref={host} aria-label="Animated 3D golden diya" />;
}