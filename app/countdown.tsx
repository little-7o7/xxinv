'use client';
import {useEffect, useState} from 'react';
import {event, remaining} from '../lib/event';
import type {Language} from '../lib/invitations';

export default function Countdown({language}:{language:Language}) {
  const [left, setLeft] = useState<ReturnType<typeof remaining> | null>(null);
  useEffect(() => {
    const update = () => setLeft(remaining(new Date()));
    update();
    const timer = window.setInterval(update, event.startsAt ? 1000 : 30000);
    document.addEventListener('visibilitychange', update);
    return () => {clearInterval(timer);document.removeEventListener('visibilitychange', update)};
  }, []);
  const ru = language === 'ru';
  const labels = ru ? ['дней','часов','минут','секунд'] : ['рӯз','соат','дақиқа','сония'];
  const values = left ? [left.days,left.hours,left.minutes,left.seconds] : [null,null,null,null];
  const title = left?.finished ? (ru?'Спасибо, что разделили этот день с нами':'Ташаккур, ки ин рӯзро бо мо гузарондед') : left?.days===0 && !event.startsAt ? (ru?'Сегодня наш праздник!':'Имрӯз ҷашни мост!') : (ru?'До нашей встречи':'То дидори мо');
  return <section className="countdown" aria-label={ru?'Отсчёт до праздника':'Ҳисоби вақт то ҷашн'}>
    <p className="eyebrow">{title}</p>
    {!left?.finished && <div className="countdown-units">{values.slice(0,event.startsAt?4:1).map((value,index)=><div className="countdown-unit" key={index}><strong>{value===null?'—':String(value).padStart(2,'0')}</strong><span>{labels[index]}</span></div>)}</div>}
    {!event.startsAt && !left?.finished && <p className="countdown-note">{ru?'4 ноября · Точное время сообщим позже':'4 ноябр · Вақти дақиқро баъдтар хабар медиҳем'}</p>}
  </section>;
}
