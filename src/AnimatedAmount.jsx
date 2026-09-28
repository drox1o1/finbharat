import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { formatINR } from './calculations.mjs';

gsap.registerPlugin(ScrollTrigger);

export function AnimatedAmount({ value }) {
  const root = useRef(null);
  const display = useRef(null);
  const current = useRef({ amount: 0 });
  const entered = useRef(false);
  useEffect(() => {
    const model = current.current;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      let tween;
      const animate = () => {
        entered.current = true;
        tween = gsap.to(model, { amount: value, duration: 0.65, ease: 'power2.out', onUpdate: () => { display.current.textContent = formatINR(model.amount); } });
      };
      let trigger;
      if (entered.current) animate();
      else trigger = ScrollTrigger.create({ trigger: root.current, start: 'top 95%', once: true, onEnter: animate });
      return () => { tween?.kill(); trigger?.kill(); display.current.textContent = formatINR(value); };
    });
    return () => {
      const held = model.amount;
      media.revert();
      model.amount = held;
    };
  }, [value]);
  return <output className="result-total" ref={root}><span className="sr-only">{formatINR(value)}</span><span ref={display} aria-hidden="true">{formatINR(value)}</span></output>;
}
