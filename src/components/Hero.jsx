import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 288;

// Pre-generate all frame paths pointing to public/frames/
const frames = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const n = String(i + 1).padStart(3, '0');
  return `/frames/ezgif-frame-${n}.jpg`;
});

// Scroll height: 5px per frame gives nice pacing for 288 frames
const SCROLL_HEIGHT = TOTAL_FRAMES * 6;

export default function Hero() {
  const sectionRef   = useRef(null);
  const canvasRef    = useRef(null);
  const eyebrowRef   = useRef(null);
  const titleRef     = useRef(null);
  const subtitleRef  = useRef(null);
  const scrollHintRef = useRef(null);
  const imagesRef    = useRef([]);
  const frameRef     = useRef(0);
  const ctxRef       = useRef(null);

  /* ─── preload images ─────────────────────────── */
  useEffect(() => {
    const canvas  = canvasRef.current;
    const ctx     = canvas.getContext('2d');
    ctxRef.current = ctx;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(frameRef.current);
    };

    const drawFrame = (idx) => {
      const img = imagesRef.current[idx];
      if (!img?.complete || !img.naturalWidth) return;
      const { width: cw, height: ch } = canvas;
      const scale = Math.max(cw / img.width, ch / img.height);
      const w = img.width  * scale;
      const h = img.height * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    // Load all frames; render first immediately when ready
    frames.forEach((src, i) => {
      const img = new Image();
      img.src   = src;
      img.onload = () => {
        if (i === 0) drawFrame(0);
      };
      imagesRef.current[i] = img;
    });

    window.addEventListener('resize', resize);
    resize();

    /* ─── ScrollTrigger: scrub frames ─────────── */
    const stFrames = ScrollTrigger.create({
      trigger : sectionRef.current,
      start   : 'top top',
      end     : 'bottom bottom',
      scrub   : 0.5,
      onUpdate: (self) => {
        const idx = Math.min(
          Math.round(self.progress * (TOTAL_FRAMES - 1)),
          TOTAL_FRAMES - 1
        );
        if (idx !== frameRef.current) {
          frameRef.current = idx;
          drawFrame(idx);
        }
      },
    });

    /* ─── Text animations tied to scroll ──────── */
    // Fade IN: first 15% of scroll
    const tlIn = gsap.timeline({
      scrollTrigger: {
        trigger : sectionRef.current,
        start   : 'top top',
        end     : '12% top',
        scrub   : 1.5,
      },
    });
    tlIn
      .to(eyebrowRef.current,    { opacity: 1, y: 0, duration: 1 }, 0)
      .to(titleRef.current,      { opacity: 1, y: 0, duration: 1 }, 0.15)
      .to(subtitleRef.current,   { opacity: 1, y: 0, duration: 1 }, 0.3)
      .to(scrollHintRef.current, { opacity: 1, duration: 0.6 },     0.5);

    // Fade OUT: 35%–55% into scroll (phone moves to side / closes in)
    const tlOut = gsap.timeline({
      scrollTrigger: {
        trigger : sectionRef.current,
        start   : '35% top',
        end     : '55% top',
        scrub   : 1.2,
      },
    });
    tlOut.to(
      [eyebrowRef.current, titleRef.current, subtitleRef.current, scrollHintRef.current],
      { opacity: 0, y: -24, stagger: 0.05 }
    );

    return () => {
      window.removeEventListener('resize', resize);
      stFrames.kill();
      tlIn.kill();
      tlOut.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      style={{ height: `${SCROLL_HEIGHT}px` }}
    >
      {/* Sticky canvas window */}
      <div className="canvas-container">
        <canvas ref={canvasRef} className="frame-canvas" />

        {/* Text overlay */}
        <div className="hero-content">
          <p   ref={eyebrowRef}    className="hero-eyebrow">Apple</p>
          <h1  ref={titleRef}      className="hero-title">iPhone 16 Pro</h1>
          <p   ref={subtitleRef}   className="hero-subtitle">Forged in Titanium.</p>
          <div ref={scrollHintRef} className="hero-scroll-hint">
            <span>Scroll to explore</span>
            <div  className="scroll-arrow" />
          </div>
        </div>
      </div>
    </section>
  );
}
