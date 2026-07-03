import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import iphoneFront from '../assets/iphone-front.png';

gsap.registerPlugin(ScrollTrigger);

const perfCards = [
  { icon: '⚡', title: 'A18 Pro Chip', desc: '6-core CPU built on 3nm technology.' },
  { icon: '🧠', title: 'Apple Intelligence', desc: 'On-device AI for private, powerful features.' },
  { icon: '🎮', title: 'Faster GPU', desc: '20% faster than A17 Pro. Ray tracing support.' },
  { icon: '🔋', title: 'Better Battery', desc: 'Up to 27 hours video playback on a single charge.' },
];

function createParticles(container) {
  const count = 60;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    const x = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 6 + 4;
    const drift = (Math.random() - 0.5) * 200;
    const hue = Math.random() > 0.5 ? '200' : '220';
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${x}%; bottom: -20px;
      background: hsl(${hue}, 80%, ${Math.random() * 40 + 40}%);
      --drift: ${drift}px;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      opacity: 0;
      box-shadow: 0 0 ${size * 3}px hsl(${hue}, 80%, 60%);
    `;
    container.appendChild(p);
  }
}

export default function Performance() {
  const sectionRef = useRef(null);
  const phoneRef = useRef(null);
  const chipRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const particlesRef = useRef(null);

  useEffect(() => {
    if (particlesRef.current) createParticles(particlesRef.current);

    const ctx = gsap.context(() => {
      // Header reveal
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

      // Phone shifts left
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '50% top',
          scrub: 2,
        },
      }).fromTo(
        phoneRef.current,
        { x: 80, opacity: 0, scale: 0.9 },
        { x: -80, opacity: 1, scale: 1, ease: 'none' }
      );

      // Chip reveal
      gsap.to(chipRef.current, {
        opacity: 1,
        scale: 1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '20% top',
          end: '45% top',
          scrub: 1.5,
        },
      });

      // Perf cards stagger in from right
      gsap.to(cardsRef.current, {
        opacity: 1,
        x: 0,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '25% top',
          end: '65% top',
          scrub: 1.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="performance-section">
      <div className="performance-sticky">
        {/* Section header */}
        <div className="section-header">
          <p ref={eyebrowRef} className="section-eyebrow">Performance</p>
          <h2 ref={titleRef} className="section-title">
            Chip of <span>Champions.</span>
          </h2>
        </div>

        {/* Floating particles */}
        <div ref={particlesRef} className="particles-container" />

        <div className="perf-phone-wrap">
          {/* Chip visual floating near the phone */}
          <div
            ref={chipRef}
            className="chip-visual"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-120%, -50%)',
              zIndex: 5,
            }}
          >
            <div className="chip-circuit" />
            <div className="chip-label">A18</div>
            <div className="chip-sublabel">PRO</div>
          </div>

          <img
            ref={phoneRef}
            src={iphoneFront}
            alt="iPhone 16 Pro Performance"
            className="section-phone-img"
            loading="lazy"
            style={{ willChange: 'transform, opacity' }}
          />

          {/* Perf cards right */}
          <div className="perf-cards-grid">
            {perfCards.map((card, i) => (
              <div
                key={i}
                ref={(el) => (cardsRef.current[i] = el)}
                className="perf-card"
              >
                <span className="perf-icon">{card.icon}</span>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
