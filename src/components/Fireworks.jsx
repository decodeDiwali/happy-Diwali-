import { useEffect, useRef } from 'react';

export default function Fireworks({ active }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let last = 0;
    const particles = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const burst = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = w * (0.15 + Math.random() * 0.7);
      const y = h * (0.15 + Math.random() * 0.35);
      const hue = [38, 45, 270, 190, 350][Math.floor(Math.random() * 5)];
      for (let i = 0; i < 40; i++) {
        const a = (Math.PI * 2 * i) / 40;
        const speed = 0.8 + Math.random() * 2.2;
        particles.push({
          x,
          y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed,
          life: 1,
          hue,
          size: 1 + Math.random() * 2,
        });
      }
    };

    const draw = (now) => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (now - last > 1200 + Math.random() * 800) {
        burst();
        last = now;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.life -= 0.015;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = `hsl(${p.hue} 100% 68%)`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = ctx.fillStyle;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [active]);

  return (
    <canvas
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
