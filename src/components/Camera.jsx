import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import iphoneBack from '../assets/iphone-back.png';

gsap.registerPlugin(ScrollTrigger);

const cameraFeatures = [
  { icon: '📷', title: '48MP Main', desc: 'Quad-pixel sensor with second-gen 3nm chip.' },
  { icon: '🔭', title: '5× Telephoto', desc: 'Tetraprism for optical zoom like never before.' },
  { icon: '🌙', title: 'Night Mode', desc: 'Capture detail even in near darkness.' },
  { icon: '🎬', title: '4K ProRes', desc: 'Cinema-quality video in your pocket.' },
];

export default function Camera() {
  const sectionRef = useRef(null);
  const phoneRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const lens1Ref = useRef(null);
  const lens2Ref = useRef(null);
  const lens3Ref = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section header reveal
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1.2,
        },
      })
        .to(eyebrowRef.current, { opacity: 1, y: 0 })
        .to(titleRef.current, { opacity: 1, y: 0 }, 0.2);

      // Phone zoom-in effect
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '40% top',
          scrub: 2,
        },
      }).fromTo(
        phoneRef.current,
        { scale: 0.8, opacity: 0, rotateY: 180 },
        { scale: 1.05, opacity: 1, rotateY: 0, ease: 'none' }
      );

      // Scale back to normal
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '40% top',
          end: '70% top',
          scrub: 1.5,
        },
      }).to(phoneRef.current, { scale: 1, ease: 'none' });

      // Lens glows
      const lenses = [lens1Ref.current, lens2Ref.current, lens3Ref.current];
      gsap.to(lenses, {
        opacity: 1,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '20% top',
          end: '50% top',
          scrub: 1,
        },
      });

      // Camera cards stagger up
      gsap.to(cardsRef.current, {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '30% top',
          end: '65% top',
          scrub: 1.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="camera-section">
      <div className="camera-sticky">
        {/* Header */}
        <div className="section-header">
          <p ref={eyebrowRef} className="section-eyebrow">Camera</p>
          <h2 ref={titleRef} className="section-title">
            A camera system <span>built for pros.</span>
          </h2>
        </div>

        <div ref={wrapRef} className="camera-phone-wrap">
          {/* Lens glow overlays (positioned over back camera area) */}
          <div
            ref={lens1Ref}
            className="camera-lens-glow"
            style={{
              width: 80,
              height: 80,
              top: '26%',
              left: '44%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            ref={lens2Ref}
            className="camera-lens-glow"
            style={{
              width: 60,
              height: 60,
              top: '30%',
              left: '54%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            ref={lens3Ref}
            className="camera-lens-glow"
            style={{
              width: 55,
              height: 55,
              top: '22%',
              left: '54%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          <img
            ref={phoneRef}
            src={iphoneBack}
            alt="iPhone 16 Pro Camera System"
            className="section-phone-img"
            loading="lazy"
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1200px',
              willChange: 'transform, opacity',
            }}
          />

          {/* Camera feature cards */}
          <div className="camera-cards-grid">
            {cameraFeatures.map((feat, i) => (
              <div
                key={i}
                ref={(el) => (cardsRef.current[i] = el)}
                className="camera-card"
              >
                <span className="camera-card-icon">{feat.icon}</span>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
