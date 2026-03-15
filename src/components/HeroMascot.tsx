import { useState, useEffect, useRef, useCallback } from 'react';

type Mood = 'curious' | 'yay' | 'playful' | 'proud' | 'waving' | 'sad';

const MOODS: Mood[] = ['curious', 'yay', 'playful', 'proud', 'waving', 'sad'];

const moodImages: Record<Mood, string> = {
  curious:  '/images/curious.png',
  yay:      '/images/yay.png',
  playful:  '/images/playful.png',
  proud:    '/images/proud.png',
  waving:   '/images/waving.png',
  sad:      '/images/sad.png',
};

const moodGlow: Record<Mood, { border: string; shadow: string }> = {
  curious: { border: 'rgba(168,85,247,0.7)',  shadow: 'rgba(168,85,247,0.4)'  },
  yay:     { border: 'rgba(217,70,239,0.7)',  shadow: 'rgba(217,70,239,0.4)'  },
  playful: { border: 'rgba(249,115,22,0.7)',  shadow: 'rgba(249,115,22,0.4)'  },
  proud:   { border: 'rgba(52,211,153,0.7)',  shadow: 'rgba(52,211,153,0.4)'  },
  waving:  { border: 'rgba(168,85,247,0.7)',  shadow: 'rgba(168,85,247,0.4)'  },
  sad:     { border: 'rgba(99,102,241,0.7)',  shadow: 'rgba(99,102,241,0.4)'  },
};

// Section-level mood mapping (hover entire section)
const sectionMoods: Record<string, Mood> = {
  features: 'waving',
  pricing:  'proud',
  contact:  'sad',
};

function isMood(s: string): s is Mood {
  return MOODS.includes(s as Mood);
}

export default function HeroMascot() {
  const [mood, setMood] = useState<Mood>('curious');
  const [isFixed, setIsFixed] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const moodTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerMood = useCallback((m: Mood, duration?: number) => {
    if (moodTimeoutRef.current) clearTimeout(moodTimeoutRef.current);
    setMood(m);
    if (duration) {
      moodTimeoutRef.current = setTimeout(() => setMood('curious'), duration);
    }
  }, []);

  const revertMood = useCallback(() => {
    if (moodTimeoutRef.current) clearTimeout(moodTimeoutRef.current);
    setMood('curious');
  }, []);

  // ── IntersectionObserver: hero → fixed transition ──
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsFixed(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // ── Global data-nyx-mood listener (any element with the attribute) ──
  useEffect(() => {
    function onEnter(e: Event) {
      const el = (e.target as HTMLElement).closest('[data-nyx-mood]');
      if (!el) return;
      const m = el.getAttribute('data-nyx-mood') || '';
      if (isMood(m)) triggerMood(m);
    }
    function onLeave(e: Event) {
      const el = (e.target as HTMLElement).closest('[data-nyx-mood]');
      if (!el) return;
      revertMood();
    }

    document.addEventListener('mouseenter', onEnter, true);
    document.addEventListener('mouseleave', onLeave, true);

    return () => {
      document.removeEventListener('mouseenter', onEnter, true);
      document.removeEventListener('mouseleave', onLeave, true);
    };
  }, [triggerMood, revertMood]);

  // ── Section-level hover (features, pricing, contact) ──
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    Object.entries(sectionMoods).forEach(([id, m]) => {
      const el = document.getElementById(id);
      if (!el) return;
      const enter = () => triggerMood(m);
      const leave = () => revertMood();
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
      cleanups.push(() => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      });
    });

    return () => cleanups.forEach(fn => fn());
  }, [triggerMood, revertMood]);

  // ── Preload all mood images ──
  useEffect(() => {
    Object.values(moodImages).forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleClick = () => triggerMood('playful', 1500);
  const glow = moodGlow[mood];

  const mascotCard = (
    <div
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        borderRadius: '24px',
        overflow: 'hidden',
        border: `2px solid ${glow.border}`,
        boxShadow: `0 0 28px ${glow.shadow}, 0 0 56px ${glow.shadow}`,
        background: '#0d0820',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        width: '100%',
        height: '100%',
        position: 'relative' as const,
      }}
    >
      {MOODS.map(m => (
        <img
          key={m}
          src={moodImages[m]}
          alt={`Nyx - ${m}`}
          style={{
            position: 'absolute',
            inset: '-4%',
            width: '108%',
            height: '108%',
            objectFit: 'cover',
            objectPosition: 'center 35%',
            opacity: mood === m ? 1 : 0,
            transition: 'opacity 0.35s ease',
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes nyx-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Sentinel — stays in the hero grid to detect when to go fixed */}
      <div ref={sentinelRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div style={{
          width: '100%',
          height: '100%',
          animation: 'nyx-float 3.2s ease-in-out infinite',
          opacity: isFixed ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}>
          {!isFixed && mascotCard}
        </div>
      </div>

      {/* Fixed mascot when scrolled past hero */}
      {isFixed && (
        <div style={{
          position: 'fixed',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '300px',
          height: '300px',
          zIndex: 9999,
          animation: 'nyx-float 3.2s ease-in-out infinite',
        }}>
          {mascotCard}
        </div>
      )}
    </>
  );
}
