import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import iphoneFront from '../assets/iphone-front.png';
import iphoneBack from '../assets/iphone-back.png';

gsap.registerPlugin(ScrollTrigger);

const layers = [
  { label: 'Camera Module', offset: -220, side: 'left', img: iphoneBack, opacity: 0.9 },
  { label: 'Display Glass', offset: -100, side: 'right', img: iphoneFront, opacity: 0.7 },
  { label: 'A18 Pro Chip', offset: 0, side: 'center', img: iphoneFront, opacity: 1 },
  { label: 'Battery', offset: 100, side: 'left', img: iphoneFront, opacity: 0.7 },
];

export default function Exploded() {
  const sectionRef = useRef(null);
  const layersRef = useRef([]);
  const labelsRef = useRef([]);
  const linesRef = useRef([]);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header
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

      // Explode layers outward
      const explodeTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '40% top',
          scrub: 2,
        },
      });

      layersRef.current.forEach((layer, i) => {
        if (!layer) return;
        const yOffset = layers[i].offset;
        explodeTl.fromTo(
          layer,
          { y: 0, opacity: 0, scale: 0.85 },
          { y: yOffset, opacity: layers[i].opacity, scale: 1, ease: 'none' },
          0
        );
      });

      // Labels and lines appear during explode
      gsap.to(labelsRef.current, {
        opacity: 1,
        x: 0,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '20% top',
          end: '45% top',
          scrub: 1.5,
        },
      });
      gsap.to(linesRef.current, {
        opacity: 1,
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '20% top',
          end: '45% top',
          scrub: 1.5,
        },
      });

      // Reassemble layers
      const reassembleTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '50% top',
          end: '85% top',
          scrub: 2,
        },
      });

      layersRef.current.forEach((layer) => {
        if (!layer) return;
        reassembleTl.to(layer, { y: 0, ease: 'none' }, 0);
      });

      // Hide labels when reassembling
      gsap.to([...labelsRef.current, ...linesRef.current], {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '50% top',
          end: '70% top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="exploded-section">
      <div className="exploded-sticky">
        {/* Header */}
        <div className="section-header">
          <p ref={eyebrowRef} className="section-eyebrow">Engineering</p>
          <h2 ref={titleRef} className="section-title">
            Every detail. <span>Engineered.</span>
          </h2>
        </div>

        <div className="exploded-wrap">
          {layers.map((layer, i) => (
            <div key={i} style={{ position: 'absolute', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                ref={(el) => (layersRef.current[i] = el)}
                src={layer.img}
                alt={layer.label}
                className="exploded-layer"
                style={{
                  height: 'clamp(280px, 42vh, 420px)',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: `drop-shadow(0 0 30px rgba(201,169,110,${0.1 + i * 0.05})) brightness(${0.7 + i * 0.1})`,
                }}
                loading="lazy"
              />

              {/* Connector line */}
              <div
                ref={(el) => (linesRef.current[i] = el)}
                className="exploded-line"
                style={{
                  position: 'absolute',
                  left: layer.side === 'left' ? '-80px' : 'auto',
                  right: layer.side === 'right' ? '-80px' : 'auto',
                  top: '50%',
                  width: '70px',
                  transform: layer.side === 'right' ? 'scaleX(-1)' : 'none',
                }}
              />

              {/* Layer label */}
              <p
                ref={(el) => (labelsRef.current[i] = el)}
                className="exploded-layer-label"
                style={{
                  position: 'absolute',
                  left: layer.side === 'right' ? 'auto' : '-170px',
                  right: layer.side === 'right' ? '-170px' : 'auto',
                  top: '50%',
                  transform: 'translateY(-50%) translateX(-20px)',
                  textAlign: layer.side === 'right' ? 'left' : 'right',
                }}
              >
                {layer.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
