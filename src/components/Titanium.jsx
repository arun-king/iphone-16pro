import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import iphoneFront from '../assets/iphone-front.png';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: '⬡', title: 'Grade 5 Titanium', desc: 'Stronger than steel. Lighter than aluminum.' },
  { icon: '✦', title: 'Ceramic Shield', desc: 'Tougher than any smartphone glass.' },
];

const featuresRight = [
  { icon: '◈', title: 'Action Button', desc: 'Customizable shortcut at your fingertip.' },
  { icon: '◉', title: 'USB‑C Pro', desc: 'USB 3 speeds for lightning transfers.' },
];

export default function Titanium() {
  const sectionRef = useRef(null);
  const phoneRef = useRef(null);
  const headerRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const leftCardsRef = useRef([]);
  const rightCardsRef = useRef([]);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section header reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1.2,
        },
      });
      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 1 })
        .to(titleRef.current, { opacity: 1, y: 0, duration: 1 }, 0.2);

      // Phone: 360° rotation linked to scroll
      const tlPhone = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2,
        },
      });
      tlPhone
        .fromTo(phoneRef.current,
          { rotateY: -30, scale: 0.85, opacity: 0 },
          { rotateY: 360, scale: 1, opacity: 1, ease: 'none' }
        );

      // Feature cards stagger
      const allCards = [...leftCardsRef.current, ...rightCardsRef.current];
      gsap.to(leftCardsRef.current, {
        opacity: 1,
        x: 0,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '15% top',
          end: '45% top',
          scrub: 1.5,
        },
      });
      gsap.to(rightCardsRef.current, {
        opacity: 1,
        x: 0,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '15% top',
          end: '45% top',
          scrub: 1.5,
        },
      });

      // Glow rings
      gsap.fromTo(
        [ring1Ref.current, ring2Ref.current],
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="titanium-section">
      <div className="titanium-sticky">
        {/* Section header */}
        <div className="section-header">
          <p ref={eyebrowRef} className="section-eyebrow">Design</p>
          <h2 ref={titleRef} className="section-title">
            Titanium. So strong. <span>So light.</span>
          </h2>
        </div>

        <div className="titanium-phone-wrap">
          {/* Glow rings */}
          <div ref={ring1Ref} className="glow-ring" />
          <div ref={ring2Ref} className="glow-ring" />

          {/* Feature cards left */}
          <div className="titanium-label left">
            {features.map((f, i) => (
              <div
                key={i}
                ref={(el) => (leftCardsRef.current[i] = el)}
                className="feature-card"
              >
                <div className="feature-card-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Phone */}
          <img
            ref={phoneRef}
            src={iphoneFront}
            alt="iPhone 16 Pro Titanium"
            className="section-phone-img"
            loading="lazy"
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px',
              willChange: 'transform',
            }}
          />

          {/* Feature cards right */}
          <div className="titanium-label right">
            {featuresRight.map((f, i) => (
              <div
                key={i}
                ref={(el) => (rightCardsRef.current[i] = el)}
                className="feature-card"
                style={{ transform: 'translateX(30px)' }}
              >
                <div className="feature-card-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
