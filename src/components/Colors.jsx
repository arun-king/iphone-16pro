import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import iphoneBackDesert from '../assets/iphone-back.png';
import iphoneBackBlack from '../assets/iphone-back-black.png';
import iphoneBackWhite from '../assets/iphone-back-white.png';
import iphoneBackNatural from '../assets/iphone-back-natural.png';

gsap.registerPlugin(ScrollTrigger);

const colorOptions = [
  {
    name: 'Desert Titanium',
    src: iphoneBackDesert,
    bg: 'radial-gradient(ellipse at center, rgba(201,169,110,0.4) 0%, transparent 70%)',
    dot: '#c9a96e',
    accent: '#c9a96e',
  },
  {
    name: 'Black Titanium',
    src: iphoneBackBlack,
    bg: 'radial-gradient(ellipse at center, rgba(60,55,53,0.5) 0%, transparent 70%)',
    dot: '#3d3735',
    accent: '#888',
  },
  {
    name: 'White Titanium',
    src: iphoneBackWhite,
    bg: 'radial-gradient(ellipse at center, rgba(232,227,220,0.3) 0%, transparent 70%)',
    dot: '#e8e3dc',
    accent: '#d0c9c0',
  },
  {
    name: 'Natural Titanium',
    src: iphoneBackNatural,
    bg: 'radial-gradient(ellipse at center, rgba(138,138,142,0.4) 0%, transparent 70%)',
    dot: '#8a8a8e',
    accent: '#aaa',
  },
];


export default function Colors() {
  const sectionRef = useRef(null);
  const phoneRef = useRef(null);
  const bgRef = useRef(null);
  const colorNameRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const dotsRef = useRef([]);
  const currentIdxRef = useRef(0);
  const [activeColor, setActiveColor] = useState(0);

  const morphToColor = (idx) => {
    if (idx === currentIdxRef.current) return;
    const prev = currentIdxRef.current;
    currentIdxRef.current = idx;
    setActiveColor(idx);

    const color = colorOptions[idx];
    const phone = phoneRef.current;
    const bg = bgRef.current;
    const nameEl = colorNameRef.current;

    // Fade out old phone
    gsap.to(phone, {
      opacity: 0,
      scale: 0.96,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        phone.src = color.src;
        gsap.to(phone, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' });
      },
    });

    // Fade background
    gsap.to(bg, {
      background: color.bg,
      duration: 0.8,
      ease: 'power2.out',
    });

    // Fade color name
    gsap.to(nameEl, {
      opacity: 0,
      y: -10,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        nameEl.textContent = color.name;
        nameEl.style.color = color.accent;
        gsap.to(nameEl, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
      },
    });
  };

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
        .to(titleRef.current, { opacity: 1, y: 0 }, 0.2)
        .to(colorNameRef.current, { opacity: 1, y: 0 }, 0.35);

      // Phone intro
      gsap.fromTo(
        phoneRef.current,
        { scale: 0.85, opacity: 0, rotateY: -15 },
        {
          scale: 1,
          opacity: 1,
          rotateY: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '25% top',
            scrub: 2,
          },
        }
      );

      // Scroll-driven color cycling
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const idx = Math.min(
            Math.floor(self.progress * colorOptions.length),
            colorOptions.length - 1
          );
          morphToColor(idx);
        },
      });

      // Slow rotation
      gsap.to(phoneRef.current, {
        rotateY: 8,
        repeat: -1,
        yoyo: true,
        duration: 4,
        ease: 'sine.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="colors-section">
      <div className="colors-sticky">
        {/* Background gradient */}
        <div
          ref={bgRef}
          className="colors-bg-gradient"
          style={{ background: colorOptions[0].bg, opacity: 0.4 }}
        />

        {/* Header */}
        <div className="section-header">
          <p ref={eyebrowRef} className="section-eyebrow">Colors</p>
          <h2 ref={titleRef} className="section-title">Four stunning <span>finishes.</span></h2>
        </div>

        <div className="colors-phone-wrap">
          <img
            ref={phoneRef}
            src={colorOptions[0].src}
            alt="iPhone 16 Pro Colors"
            className="section-phone-img"
            loading="lazy"
            style={{
              willChange: 'transform, opacity',
              transformStyle: 'preserve-3d',
            }}
          />

          <p
            ref={colorNameRef}
            className="color-name"
            style={{ color: colorOptions[0].accent }}
          >
            {colorOptions[0].name}
          </p>

          {/* Color selector dots */}
          <div className="color-dots">
            {colorOptions.map((c, i) => (
              <div
                key={i}
                ref={(el) => (dotsRef.current[i] = el)}
                className={`color-dot ${activeColor === i ? 'active' : ''}`}
                style={{ background: c.dot }}
                onClick={() => morphToColor(i)}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
