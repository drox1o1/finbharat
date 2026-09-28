import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function MotionPage({ children, className = '' }) {
  const root = useRef(null);
  useGSAP((_context, contextSafe) => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const cleanups = [];
      const entries = root.current.querySelectorAll('.page-enter');
      if (entries.length) gsap.from(entries, { y: 24, opacity: 0, duration: 0.65, stagger: 0.06, ease: 'power3.out' });
      const revealSelector = '.scroll-reveal, .section-heading, .intention-card, .ai-principle, .download-panel, .faq-item, .manifesto, .horizontal-accordion, .calculator-tabs, .calculator-workspace, .ai-copy, .gallery-sticky-heading, .gallery-card';
      root.current.querySelectorAll(revealSelector).forEach(element => {
        // Avoid animating both a container and its nested content.
        if (element.parentElement.closest(revealSelector)) return;
        const tween = gsap.from(element, { y: 18, opacity: 0, duration: 0.6, ease: 'power1.inOut', clearProps: 'transform,opacity', scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
        const revealFocused = () => { tween.progress(1); };
        element.addEventListener('focusin', revealFocused);
        cleanups.push(() => element.removeEventListener('focusin', revealFocused));
      });
      root.current.querySelectorAll('.page-image').forEach(element => {
        gsap.fromTo(element.querySelector('img'), { scale: 1.07 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: element, start: 'top 95%', end: 'bottom 30%', scrub: true } });
      });
      root.current.querySelectorAll('.story-rail').forEach(element => {
        gsap.from(element, { scaleX: 0, transformOrigin: 'left center', ease: 'none', scrollTrigger: { trigger: element.parentElement, start: 'top 80%', end: 'bottom 60%', scrub: true } });
      });
      return () => cleanups.forEach(cleanup => cleanup());
    });
    media.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const cleanups = [];
      root.current.querySelectorAll('.motion-card').forEach(card => {
        const tilt = card.querySelector('.card-art');
        if (!tilt) return;
        const rotateX = gsap.quickTo(tilt, 'rotationX', { duration: 0.28, ease: 'power3.out' });
        const rotateY = gsap.quickTo(tilt, 'rotationY', { duration: 0.28, ease: 'power3.out' });
        gsap.set(tilt, { transformPerspective: 900 });
        const move = contextSafe(event => { const rect = card.getBoundingClientRect(); rotateX(-(event.clientY - rect.top - rect.height / 2) / rect.height * 4); rotateY((event.clientX - rect.left - rect.width / 2) / rect.width * 4); });
        const leave = contextSafe(() => { rotateX(0); rotateY(0); });
        card.addEventListener('pointermove', move);
        card.addEventListener('pointerleave', leave);
        cleanups.push(() => { card.removeEventListener('pointermove', move); card.removeEventListener('pointerleave', leave); });
      });
      return () => cleanups.forEach(cleanup => cleanup());
    });
    let mounted = true;
    document.fonts.ready.then(contextSafe(() => { if (mounted) ScrollTrigger.refresh(); }));
    return () => { mounted = false; media.revert(); };
  }, { scope: root });
  return <div className={`motion-page ${className}`} ref={root}>{children}</div>;
}
