import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import iphoneFront from '../assets/iphone-front.png';

gsap.registerPlugin(ScrollTrigger);

const appScreens = [
  { bg: 'linear-gradient(135deg,#1a1a2e,#16213e)', icon: '🌍', label: 'Maps' },
  { bg: 'linear-gradient(135deg,#0a2a1a,#143d25)', icon: '📸', label: 'Camera' },
  { bg: 'linear-gradient(135deg,#2a0a1a,#3d0a20)', icon: '🎵', label: 'Music' },
  { bg: 'linear-gradient(135deg,#1a0a2a,#250a3d)', icon: '⚡', label: 'AI' },
];

const uiCards = [
  { title: 'Super Retina XDR', desc: '2796 × 1290 resolution', style: { top: '20%', left: '5%' } },
  { title: 'ProMotion 120Hz', desc: 'Adaptive from 1Hz to 120Hz', style: { top: '30%', right: '5%' } },
  { title: '2000 nits Peak', desc: 'Brightest iPhone display ever', style: { bottom: '22%', left: '5%' } },
];

export default function Display() {
  const sectionRef = useRef(null);
  const phoneRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const screenRef = useRef(null);
  const uiCardsRef = useRef([]);
  const screenIndexRef = useRef({ val: 0 });
  const screensRef = useRef([]);

  useEffect(() => {
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

      // Phone returns to center + scales up slightly
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '30% top',
          scrub: 2,
        },
      }).fromTo(
        phoneRef.current,
        { x: -60, scale: 0.9, opacity: 0 },
        { x: 0, scale: 1.05, opacity: 1, ease: 'none' }
      );

      // "Screen turns on" effect
      gsap.to(screenRef.current, {
        opacity: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '15% top',
          end: '35% top',
          scrub: 1,
        },
      });

      // Cycle through app screens based on scroll
      const totalScreens = appScreens.length;
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: '20% top',
        end: '80% top',
        scrub: true,
        onUpdate: (self) => {
          const idx = Math.min(
            Math.floor(self.progress * totalScreens),
            totalScreens - 1
          );
          if (idx !== screenIndexRef.current.val) {
            const prevIdx = screenIndexRef.current.val;
            gsap.to(screensRef.current[prevIdx], { opacity: 0, duration: 0.3 });
            gsap.to(screensRef.current[idx], { opacity: 1, duration: 0.3 });
            screenIndexRef.current.val = idx;
          }
        },
      });

      // First screen visible by default after screen turns on
      gsap.set(screensRef.current[0], { opacity: 1 });

      // UI cards float up
      gsap.to(uiCardsRef.current, {
        opacity: 1,
        y: 0,
        stagger: 0.18,
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
    <section ref={sectionRef} className="display-section">
      <div className="display-sticky">
        {/* Header */}
        <div className="section-header">
          <p ref={eyebrowRef} className="section-eyebrow">Display</p>
          <h2 ref={titleRef} className="section-title">
            The most advanced <span>iPhone display.</span>
          </h2>
        </div>

        <div className="display-phone-wrap">
          {/* Floating UI cards */}
          {uiCards.map((card, i) => (
            <div
              key={i}
              ref={(el) => (uiCardsRef.current[i] = el)}
              className="ui-card-float"
              style={card.style}
            >
              <h4>{card.title}</h4>
              <p>{card.desc}</p>
            </div>
          ))}

          <div style={{ position: 'relative' }}>
            {/* Screen overlay with app screens */}
            <div
              ref={screenRef}
              style={{
                position: 'absolute',
                top: '8%',
                left: '7%',
                right: '7%',
                bottom: '8%',
                borderRadius: '36px',
                overflow: 'hidden',
                opacity: 0,
                zIndex: 3,
              }}
            >
              {appScreens.map((screen, i) => (
                <div
                  key={i}
                  ref={(el) => (screensRef.current[i] = el)}
                  className="app-screen"
                  style={{ background: screen.bg, opacity: 0 }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem' }}>{screen.icon}</div>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.8)',
                      marginTop: '0.5rem',
                      letterSpacing: '0.1em'
                    }}>
                      {screen.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <img
              ref={phoneRef}
              src={iphoneFront}
              alt="iPhone 16 Pro Display"
              className="section-phone-img"
              loading="lazy"
              style={{ position: 'relative', zIndex: 4, willChange: 'transform, opacity' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
