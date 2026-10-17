'use client';

import { useEffect, useRef, useState } from 'react';
import { Music2, Volume2, VolumeX, ArrowUpRight } from 'lucide-react';
import type { Language } from '../lib/invitations';

export default function Music({ language, name }: { language: Language; name: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [playing, setPlaying] = useState(false);
  const [gate, setGate] = useState(true);
  const [error, setError] = useState(false);
  const ru = language === 'ru';

  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    player.volume = 0.32;
    try { if (sessionStorage.getItem('invitation-entered')) setGate(false); } catch {}
    // Browsers that allow sound on entry start immediately; otherwise the entry button provides a gesture.
    player.play().then(() => setGate(false)).catch(() => {});
    return () => { player.pause(); };
  }, []);

  useEffect(() => { if (gate) dialog.current?.showModal(); else dialog.current?.close(); }, [gate]);

  async function enter(withMusic: boolean) {
    try { sessionStorage.setItem('invitation-entered', '1'); } catch {}
    setGate(false);
    if (withMusic) {
      try { await audio.current?.play(); setError(false); } catch { setError(true); }
    } else audio.current?.pause();
  }

  async function toggle() {
    if (playing) audio.current?.pause();
    else { try { await audio.current?.play(); setError(false); } catch { setError(true); } }
  }

  return <>
    <audio ref={audio} src="/audio/celebration.wav" loop preload="auto" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setError(true)} />
    <dialog ref={dialog} className="entry-screen" aria-labelledby="entry-title" onCancel={event=>{event.preventDefault();enter(false)}}>
      <div className="entry-card"><Music2 size={25} strokeWidth={1} /><p className="eyebrow">{ru ? 'ОСОБЕННЫЙ ВЕЧЕР' : 'UNUTILMAS OQSHOM'}</p>
        <h2 id="entry-title">{name}<span>60</span></h2>
        <p>{ru ? 'Приглашение, наполненное теплом' : 'Mehrga to‘la taklifnoma'}</p>
        <button autoFocus className="button" onClick={() => enter(true)}>{ru ? 'Открыть приглашение' : 'Taklifnomani ochish'}<ArrowUpRight size={18}/></button>
        <button className="entry-silent" onClick={() => enter(false)}>{ru ? 'Продолжить без музыки' : 'Musiqasiz davom etish'}</button>
      </div>
    </dialog>
    <button type="button" className={`music-toggle ${playing ? 'is-playing' : ''}`} aria-label={ru ? (playing ? 'Выключить музыку' : 'Включить музыку') : (playing ? 'Musiqani o‘chirish' : 'Musiqani yoqish')} aria-pressed={playing} onClick={toggle}>
      {playing ? <Volume2 size={18}/> : <VolumeX size={18}/>}<span>{ru ? 'Музыка' : 'Musiqa'}</span><span className="equalizer" aria-hidden="true"><i/><i/><i/></span>
    </button>
    {error && <p className="music-error" role="status">{ru ? 'Звук недоступен. Попробуйте включить музыку ещё раз.' : 'Ovoz mavjud emas. Musiqani qayta yoqib ko‘ring.'}</p>}
  </>;
}
