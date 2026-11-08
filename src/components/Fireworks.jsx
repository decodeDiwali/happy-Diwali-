import { useEffect, useRef } from 'react';

export default function Fireworks({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext('2d');
    let w, h, raf, last = 0;
    const particles = [];
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const burst = () => {
      const x = w * (0.12 + Math.random() * 0.76);
      const y = h * (0.12 + Math.random() * 0.43);
      const hue = [38, 45, 270, 190, 350][Math.floor(Math.random() * 5)];
      for (let i = 0; i < 65; i++) {
        const a = Math.PI * 2 * i / 65;
        const speed = 0.8 + Math.random() * 2.8;
        particles.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, life: 1, hue, size: 1 + Math.random() * 2 });
      }
    };
    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, w, h);
      if (now - last > 1150 + Math.random() * 900) { burst(); last = now; }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.018; p.vx *= 0.992; p.vy *= 0.992; p.life -= 0.012;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = `hsl(${p.hue} 100% 68%)`;
        ctx.shadowBlur = 12; ctx.shadowColor = ctx.fillStyle;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [active]);
  return <canvas ref={ref} className="fireworks-canvas" />;
}