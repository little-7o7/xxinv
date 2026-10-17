'use client';
import { useEffect, useRef } from 'react';

export default function ScrollEffects() {
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const main = document.querySelector('main');
    const sections = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!main || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    main.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    sections.forEach(section => observer.observe(section));
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${height > 0 ? Math.min(1, window.scrollY / height) : 0})`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll);
    return () => { observer.disconnect(); main.classList.remove('motion-ready'); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);
  return <div ref={progress} className="reading-progress" aria-hidden="true"/>;
}
