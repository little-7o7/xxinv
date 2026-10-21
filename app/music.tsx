'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import type { Language } from '../lib/invitations';

export default function Music({ language }: { language: Language }) {
  const audio = useRef<HTMLAudioElement>(null);
  const manuallyPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const ru = language === 'ru';

  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    player.volume = 0.32;
    let disposed = false;
    const gestures = ['touchend', 'click', 'pointerup', 'keydown'] as const;
    const removeListeners = () => {
      gestures.forEach(name => document.removeEventListener(name, onInteraction, true));
    };
    const attempt = () => {
      if (disposed || manuallyPaused.current) return;
      // Call play synchronously inside the gesture, especially for iOS/WebViews.
      player.play().then(() => {
        if (disposed || manuallyPaused.current) { player.pause(); return; }
        setError(false);
        removeListeners();
      }).catch(() => { /* Keep gesture listeners when autoplay is blocked. */ });
    };
    const onInteraction = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('.music-toggle')) return;
      attempt();
    };
    const onPlaying = () => { removeListeners(); setError(false); };
    player.addEventListener('playing', onPlaying);
    player.addEventListener('canplay', attempt, {once:true});
    gestures.forEach(name => document.addEventListener(name, onInteraction, {capture:true,passive:true}));
    attempt();
    return () => {
      disposed = true;
      removeListeners();
      player.removeEventListener('playing', onPlaying);
      player.removeEventListener('canplay', attempt);
      player.pause();
    };
  }, []);

  async function toggle() {
    const player = audio.current;
    if (!player) return;
    if (!player.paused) { manuallyPaused.current = true; player.pause(); }
    else {
      manuallyPaused.current = false;
      try { await player.play(); setError(false); } catch { setError(true); }
    }
  }

  return <>
    <audio ref={audio} src="/audio/i-just-called.m4a" autoPlay loop playsInline preload="auto" onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setError(true)} />
    <button type="button" className={`music-toggle ${playing ? 'is-playing' : ''}`} aria-label={ru ? (playing ? 'Выключить музыку' : 'Включить музыку') : (playing ? 'Хомӯш кардани мусиқӣ' : 'Фаъол кардани мусиқӣ')} aria-pressed={playing} onClick={toggle}>
      {playing ? <Volume2 size={18}/> : <VolumeX size={18}/>}<span>{ru ? 'Музыка' : 'Мусиқӣ'}</span><span className="equalizer" aria-hidden="true"><i/><i/><i/></span>
    </button>
    {error && <p className="music-error" role="status">{ru ? 'Звук недоступен. Попробуйте включить музыку ещё раз.' : 'Садо дастрас нест. Мусиқиро бори дигар фаъол кунед.'}</p>}
  </>;
}
