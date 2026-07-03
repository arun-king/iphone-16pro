import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import iphoneFront from '../assets/iphone-front.png';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const sectionRef = useRef(null);
  const phoneRef = useRef(null);
  const glowRef = useRef(null);
  const glowRingRef = useRef(null);
  const titleRef = useRef(null);
  const title2Ref = useRef(null);
  const btnRef = useRef(null);
  const subRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '60% top',
          scrub: 2,
        },
      });

      // Phone returns to center, scales up, rotates slowly
      tl.fromTo(
        phoneRef.current,
        { x: 0, scale: 0.8, opacity: 0, rotateY: 20 },
        { x: 0, scale: 1, opacity: 1, rotateY: 0, ease: 'none' },
        0
      );

      // Glow appears behind phone
      tl.to(glowRef.current, { opacity: 1, scale: 1, ease: 'none' }, 0.1);
      tl.to(glowRingRef.current, { opacity: 1, ease: 'none' }, 0.2);

      // Title fades in
      tl.to(titleRef.current, { opacity: 1, y: 0, ease: 'none' }, 0.3);
      tl.to(title2Ref.current, { opacity: 1, y: 0, ease: 'none' }, 0.45);

      // CTA + sub fade in
      tl.to(subRef.current, { opacity: 1, ease: 'none' }, 0.55);

      // Slow continuous rotation on phone
      gsap.to(phoneRef.current, {
        rotateY: 12,
        repeat: -1,
        yoyo: true,
        duration: 5,
        ease: 'sine.inOut',
      });

      // Background darkening as we scroll through this section
      gsap.to(bgRef.current, {
        opacity: 0.85,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '50% top',
          scrub: 1.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="final-section">
      {/* Dark bg overlay */}
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, #05050f 0%, #000 100%)',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="final-sticky">
        <div className="final-phone-wrap">
          {/* Glow behind phone */}
          <div
            ref={glowRef}
            className="final-glow-ring"
            style={{ opacity: 0, transform: 'scale(0.9)' }}
          />
          <div ref={glowRingRef} className="final-glow-ring-border" style={{ opacity: 0 }} />

          <img
            ref={phoneRef}
            src={iphoneFront}
            alt="iPhone 16 Pro"
            className="section-phone-img"
            loading="lazy"
            style={{
              willChange: 'transform, opacity',
              transformStyle: 'preserve-3d',
              position: 'relative',
              zIndex: 2,
            }}
          />
        </div>

        {/* Final text */}
        <h2
          ref={titleRef}
          className="final-title"
          style={{ opacity: 0, transform: 'translateY(30px)' }}
        >
          <span>Built for</span>
        </h2>
        <h2
          ref={title2Ref}
          className="final-title"
          style={{ opacity: 0, transform: 'translateY(30px)', marginTop: '0.2rem' }}
        >
          <span>Apple Intelligence.</span>
        </h2>

        <p ref={subRef} className="final-sub" style={{ opacity: 0 }}>
          From $999 or $41.62/mo. for 24 mo.
        </p>
      </div>
    </section>
  );
}
