'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import type { Language } from '../lib/invitations';

export default function Music({ language }: { language: Language }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const ru = language === 'ru';

  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    player.volume = 0.32;
    const removeListeners = () => {
      document.removeEventListener('pointerup', onInteraction);
      document.removeEventListener('keydown', onInteraction);
    };
    const onInteraction = (event: Event) => {
      // The sound button keeps its own explicit play/pause behavior.
      if (event.target instanceof Element && event.target.closest('.music-toggle')) return;
      player.play().then(removeListeners).catch(() => {});
    };
    player.addEventListener('play', removeListeners);
    document.addEventListener('pointerup', onInteraction);
    document.addEventListener('keydown', onInteraction);
    player.play().then(removeListeners).catch(() => {});
    return () => { removeListeners(); player.removeEventListener('play', removeListeners); player.pause(); };
  }, []);

  async function toggle() {
    if (playing) audio.current?.pause();
    else { try { await audio.current?.play(); setError(false); } catch { setError(true); } }
  }

  return <>
    <audio ref={audio} src="/audio/i-just-called.m4a" autoPlay loop preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setError(true)} />
    <button type="button" className={`music-toggle ${playing ? 'is-playing' : ''}`} aria-label={ru ? (playing ? 'Выключить музыку' : 'Включить музыку') : (playing ? 'Хомӯш кардани мусиқӣ' : 'Фаъол кардани мусиқӣ')} aria-pressed={playing} onClick={toggle}>
      {playing ? <Volume2 size={18}/> : <VolumeX size={18}/>}<span>{ru ? 'Музыка' : 'Мусиқӣ'}</span><span className="equalizer" aria-hidden="true"><i/><i/><i/></span>
    </button>
    {error && <p className="music-error" role="status">{ru ? 'Звук недоступен. Попробуйте включить музыку ещё раз.' : 'Садо дастрас нест. Мусиқиро бори дигар фаъол кунед.'}</p>}
  </>;
}
