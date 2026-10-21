import Image from 'next/image';
import { Camera, Building2, ArrowUpRight, CalendarDays } from 'lucide-react';
import { type Celebrant, type Language } from '../lib/invitations';
import { restaurant } from '../lib/restaurant';

export default function PhotoSections({language, celebrant}:{language:Language;celebrant:Celebrant}) {
  const ru = language === 'ru';
  const person = celebrant;
  return <>
    <section id="portraits" className="portraits-section section-shell" data-reveal>
      <div className="section-heading"><p className="eyebrow">{ru ? 'С УДОВОЛЬСТВИЕМ ПРИГЛАШАЮ ВАС!' : 'ШУМОРО БО КАМОЛИ МАЙЛ ДАЪВАТ МЕКУНАМ!'}</p><p>{ru ? 'Буду счастлив разделить с вами мой 60-летний юбилей.' : 'Аз он шод мешавам, ки ҷашни 60-солагиамро бо шумо мегузаронам.'}</p></div>
      <div className="portrait-single"><figure className="person-card">
        <div className="portrait-frame">{person.photo ? <Image src={person.photo} alt={person.name} width={3024} height={4032} sizes="(max-width: 650px) 85vw, 540px"/> : <div className="portrait-empty"><span className="portrait-monogram" aria-hidden="true">{person.name.charAt(0)}</span><Camera size={22} strokeWidth={1}/><p>{ru ? `Фотография: ${person.name}` : `Акси ${person.name}`}</p><span>{ru ? 'Скоро здесь появится портрет' : 'Ба зудӣ дар ин ҷо акс пайдо мешавад'}</span></div>}</div>
        <figcaption><h3>{ru?'Ваш, ':'Бо эҳтиром, '}{person.name}</h3></figcaption>
      </figure></div>

    </section>
    <section id="venue" className="venue-section section-shell" data-reveal>
      <div className="venue-heading"><div><p className="eyebrow">{ru ? 'МЕСТО НАШЕЙ ВСТРЕЧИ' : 'ҶОЙИ ДИДОРИ МО'}</p><h2>{ru ? 'Ресторан' : 'Тарабхона'}<br/>{ru ? '«Самарканд»' : '«Самарқанд»'}</h2></div></div>
      <div className="venue-gallery venue-single" role="region" aria-label={ru?'Фотография ресторана снаружи':'Акси берунии тарабхона'}>
        {restaurant.photos.map((photo,index)=><figure key={photo.id} className={`venue-photo venue-photo-${index}`}>
          {photo.src?<Image src={photo.src} alt={photo.label[language]} fill sizes="(max-width: 650px) 90vw, 1040px"/>:<div className="venue-empty"><Building2 size={index===0?48:32} strokeWidth={.7}/><span>{ru?'Место для фотографии':'Ҷой барои акс'}</span></div>}
        </figure>)}
      </div>
      <div id="details" className="venue-meeting"><CalendarDays size={25} strokeWidth={1}/><p>{ru?'4 ноября 2026 · 18:00':'4 ноябри 2026 · 18:00'}</p><span>{ru?'Самарканд':'Самарқанд'}</span></div><div className="venue-bottom"><a href={restaurant.mapUrl} target="_blank" rel="noreferrer">{ru?'Найти на карте':'Дар харита ёфтан'}<ArrowUpRight size={18}/></a></div>
    </section>
    <section id="information" className="information-section section-shell" data-reveal>
      <p className="eyebrow">{ru?'ДО ВСТРЕЧИ НА ПРАЗДНИКЕ':'ТО ДИДОР ДАР ҶАШН'}</p>

    </section>
  </>;
}
