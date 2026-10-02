import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const words = [['Bharat', 'en'], ['भारत', 'hi'], ['பாரதம்', 'ta'], ['భారత్', 'te'], ['ಭಾರತ', 'kn']];

export function BharatWord({ title = 'Wealth Simplified.', prefix = 'For everyone in' }) {
  const root = useRef(null);
  const text = useRef(null);
  const timeline = useRef(null);
  const cursor = useRef(null);
  const visible = useRef(true);
  const sync = () => {
    if (!timeline.current) return;
    const paused = !visible.current || document.hidden;
    root.current.classList.toggle('language-is-paused', paused);
    if (paused) timeline.current.pause();
    else timeline.current.play();
  };
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const sequence = gsap.timeline({ repeat: -1, paused: true });
      timeline.current = sequence;
      const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
      const moveCursor = gsap.quickTo(cursor.current, 'x', { duration: 0.12, ease: 'power2.out' });
      const write = (value, lang) => {
        const previous = cursor.current.getBoundingClientRect().left;
        if (lang) text.current.lang = lang;
        text.current.textContent = value;
        const next = cursor.current.getBoundingClientRect().left - Number(gsap.getProperty(cursor.current, 'x'));
        moveCursor(0, previous - next);
      };
      let time = 2.8;
      words.forEach(([word], index) => {
        sequence.call(() => text.current.parentElement.classList.add('is-typing'), [], time);
        const letters = Array.from(segmenter.segment(word), part => part.segment);
        for (let count = letters.length - 1; count >= 0; count--) {
          sequence.call(() => write(letters.slice(0, count).join('')), [], time);
          time += 0.075;
        }
        time += 0.24;
        const [next, lang] = words[(index + 1) % words.length];
        const nextLetters = Array.from(segmenter.segment(next), part => part.segment);
        nextLetters.forEach((_, index) => {
          sequence.call(() => write(nextLetters.slice(0, index + 1).join(''), lang), [], time);
          time += 0.135;
        });
        sequence.call(() => text.current.parentElement.classList.remove('is-typing'), [], time);
        time += 2.4;
      });
      sequence.to({}, { duration: 2.1 });
      const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; sync(); });
      observer.observe(root.current);
      document.addEventListener('visibilitychange', sync);
      sync();
      return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', sync);
        timeline.current = null;
        text.current.textContent = 'Bharat';
        text.current.lang = 'en';
        text.current.parentElement.classList.remove('is-typing');
        root.current.classList.remove('language-is-paused');
      };
    });
    return () => media.revert();
  }, { scope: root });
  return <div ref={root} className="hero-heading-group"><h1 id="hero-heading" aria-label={`${title} ${prefix} Bharat`} className="max-w-6xl"><span className="hero-line"><span>{title}</span></span><span className="hero-line"><span>{prefix.split(/\s+/).slice(0, -1).join(' ')}<span className="hero-mobile-break"> </span>{prefix.split(/\s+/).at(-1)} <span className="bharat-word"><span className="sr-only">Bharat</span><strong aria-hidden="true" className="bharat-typed"><span ref={text} lang="en">Bharat</span><span ref={cursor} className="typewriter-cursor" /></strong></span></span></span></h1></div>;
}
