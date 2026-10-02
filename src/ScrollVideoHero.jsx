import { useContent } from './cms/Content';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ScrollVideoHero({ children }) {
  const { assets } = useContent().site;
  const scene = useRef(null);
  const video = useRef(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const element = video.current;
      let targetTime = 0;
      let disposed = false;
      let trigger;
      let frame;
      // Only one seek is in flight. Fast scrolling replaces the pending target.
      const seek = () => {
        frame = undefined;
        if (disposed || element.readyState < 2 || element.seeking) return;
        if (Math.abs(element.currentTime - targetTime) > 1 / 48) element.currentTime = targetTime;
      };
      const scheduleSeek = () => {
        if (!disposed && frame === undefined) frame = requestAnimationFrame(seek);
      };
      const connect = () => {
        if (disposed || !Number.isFinite(element.duration) || trigger) return;
        const duration = Math.max(0, element.duration - 1 / 24);
        trigger = ScrollTrigger.create({
          trigger: scene.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 0.65}`,
          invalidateOnRefresh: true,
          onUpdate: self => { targetTime = self.progress * duration; scheduleSeek(); },
          onRefresh: self => { targetTime = self.progress * duration; scheduleSeek(); },
        });
        targetTime = trigger.progress * duration;
        scheduleSeek();
      };
      const reveal = () => { element.classList.add('is-ready'); connect(); scheduleSeek(); };
      const failure = () => { element.classList.remove('is-ready'); };
      element.addEventListener('loadedmetadata', connect);
      element.addEventListener('loadeddata', reveal);
      element.addEventListener('seeked', scheduleSeek);
      element.addEventListener('error', failure);
      element.muted = true;
      element.src = assets.heroVideo;
      element.load();
      return () => {
        disposed = true;
        if (frame !== undefined) cancelAnimationFrame(frame);
        trigger?.kill();
        element.pause();
        element.removeEventListener('loadedmetadata', connect);
        element.removeEventListener('loadeddata', reveal);
        element.removeEventListener('seeked', scheduleSeek);
        element.removeEventListener('error', failure);
        element.classList.remove('is-ready');
        element.removeAttribute('src');
        element.load();
      };
    });
    return () => media.revert();
  }, { scope: scene, dependencies: [assets.heroVideo], revertOnUpdate: true });

  return <div className="video-scroll-scene" ref={scene}>
    <section className="cinematic-hero" aria-labelledby="hero-heading">
      <div className="cinematic-backdrop" aria-hidden="true">
        <img src={assets.heroPoster} alt="" width="1920" height="1080" fetchPriority="high" />
        <video ref={video} className="hero-scroll-video" muted playsInline preload="auto" poster={assets.heroPoster} disablePictureInPicture tabIndex={-1} />
        <div className="cinematic-wash" />
      </div>
      {children}
    </section>
  </div>;
}
