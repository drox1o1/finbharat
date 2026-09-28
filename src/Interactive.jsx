import { useRef, useState } from 'react';
import { Pause, Play, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function MotionDetails({ children, className = '' }) {
  const ref = useRef(null);
  const pointer = useRef(false);
  const { contextSafe } = useGSAP({ scope: ref });
  const reveal = contextSafe(() => {
    const content = ref.current.querySelector('.disclosure-content');
    gsap.killTweensOf(content);
    if (ref.current.open && pointer.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(content, { y: -6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.24, ease: 'power3.out', clearProps: 'transform,opacity', onComplete: () => ScrollTrigger.refresh() });
    } else { gsap.set(content, { clearProps: 'transform,opacity' }); ScrollTrigger.refresh(); }
  });
  const [summary, ...body] = children;
  return <details ref={ref} className={className} onClickCapture={event => { if (event.target.closest('summary')) pointer.current = event.detail > 0; }} onToggle={reveal}>{summary}<div className="disclosure-content">{body}</div></details>;
}

export function PrinciplesRibbon() {
  const ref = useRef(null);
  const tween = useRef(null);
  const visible = useRef(false);
  const hovering = useRef(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const sync = () => {
    if (!tween.current) return;
    if (pausedRef.current || !visible.current || hovering.current || document.hidden) tween.current.pause();
    else tween.current.play();
  };
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      tween.current = gsap.to('.principles-track', { xPercent: -50, duration: 36, repeat: -1, ease: 'none', paused: true });
      ScrollTrigger.create({ trigger: ref.current, start: 'top bottom', end: 'bottom top', onToggle: self => { visible.current = self.isActive; sync(); } });
      document.addEventListener('visibilitychange', sync);
      return () => { tween.current = null; document.removeEventListener('visibilitychange', sync); };
    });
    return () => media.revert();
  }, { scope: ref });
  return <section className="principles-ribbon" ref={ref} aria-label="Our principles" onMouseEnter={() => { hovering.current = true; sync(); }} onMouseLeave={() => { hovering.current = false; sync(); }}>
    <p className="sr-only">Clarity. Access. Confidence. Choice. Opportunity.</p>
    <div className="principles-window" aria-hidden="true"><div className="principles-track">{[0, 1].map(copy => <div className="principles-group" key={copy}>{['Clarity', 'Access', 'Confidence', 'Choice', 'Opportunity'].map(word => <span key={word}>{word}<ArrowUpRight strokeWidth={1} /></span>)}</div>)}</div></div>
    <button className="ribbon-control" aria-label={paused ? 'Play moving principles' : 'Pause moving principles'} onClick={() => { pausedRef.current = !paused; setPaused(!paused); sync(); }}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>
  </section>;
}
