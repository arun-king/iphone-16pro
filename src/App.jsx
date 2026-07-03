import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useLenis, useScrollProgress } from './hooks/useScrollAnimations';
import Hero from './components/Hero';
import Titanium from './components/Titanium';
import Camera from './components/Camera';
import Performance from './components/Performance';
import Display from './components/Display';
import Colors from './components/Colors';
import Exploded from './components/Exploded';
import FinalCTA from './components/FinalCTA';

gsap.registerPlugin(ScrollTrigger);

// Custom cursor
function Cursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    let mx = 0, my = 0;
    let fx = 0, fy = 0;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };

    let rafId;
    const followLoop = () => {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.transform = `translate(${fx}px, ${fy}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(followLoop);
    };
    rafId = requestAnimationFrame(followLoop);

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}

// Nav component
function Nav() {
  return (
    <nav className="nav">
      <div className="nav-logo">&#63743;</div>
      <ul className="nav-links">
        <li><a href="#">iPhone 16 Pro</a></li>
        <li><a href="#">Features</a></li>
        <li><a href="#">Compare</a></li>
        <li><a href="#">Shop</a></li>
      </ul>
    </nav>
  );
}

// Loading screen
function Loading({ onDone }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true);
      if (onDone) onDone();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={`loading-screen ${hidden ? 'hidden' : ''}`}>
      <div className="loading-logo">&#63743;</div>
      <div className="loading-bar-track">
        <div className="loading-bar-fill" />
      </div>
      <p className="loading-text">iPhone 16 Pro</p>
    </div>
  );
}

export default function App() {
  const progressRef = useScrollProgress();
  const [loaded, setLoaded] = useState(false);

  // Init Lenis smooth scroll
  useLenis();

  useEffect(() => {
    // Refresh ScrollTrigger after all content mounts
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(timeout);
  }, [loaded]);

  return (
    <>
      <Loading onDone={() => setLoaded(true)} />
      <div className="noise-overlay" />
      <Cursor />
      <div ref={progressRef} className="scroll-progress" />

      <main>
        <Hero />
        <Titanium />
        <Camera />
        <Performance />
        <Display />
        <Colors />
        <Exploded />
        <FinalCTA />
      </main>
    </>
  );
}
