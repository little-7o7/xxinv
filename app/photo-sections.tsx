import Image from 'next/image';
import { Camera, Building2, ArrowUpRight } from 'lucide-react';
import { type Celebrant, type Language } from '../lib/invitations';
import { restaurant } from '../lib/restaurant';

export default function PhotoSections({language, celebrant}:{language:Language;celebrant:Celebrant}) {
  const ru = language === 'ru';
  const person = celebrant;
  return <>
    <section id="portraits" className="portraits-section section-shell" data-reveal>
      <div className="section-heading"><p className="eyebrow">{ru ? 'С УДОВОЛЬСТВИЕМ ПРИГЛАШАЮ ВАС' : 'ШУМОРО БО КАМОЛИ МАЙЛ ДАЪВАТ МЕКУНАМ'}</p><h2>{person.name}</h2><p>{ru ? 'Буду счастлив разделить с вами мой 60-летний юбилей.' : 'Аз он шод мешавам, ки ҷашни 60-солагиамро бо шумо мегузаронам.'}</p></div>
      <div className="portrait-single"><figure className="person-card">
        <div className="portrait-frame">{person.photo ? <Image src={person.photo} alt={person.name} width={3024} height={4032} sizes="(max-width: 650px) 85vw, 540px"/> : <div className="portrait-empty"><span className="portrait-monogram" aria-hidden="true">{person.name.charAt(0)}</span><Camera size={22} strokeWidth={1}/><p>{ru ? `Фотография: ${person.name}` : `Акси ${person.name}`}</p><span>{ru ? 'Скоро здесь появится портрет' : 'Ба зудӣ дар ин ҷо акс пайдо мешавад'}</span></div>}</div>
        <figcaption><h3>{person.name}</h3><span>60 {ru?'лет':'сол'}</span></figcaption>
      </figure></div>
      <p className="portrait-footnote">{ru ? 'Самое ценное — быть рядом.' : 'Аз ҳама арзишманд — дар канори ҳам будан.'}</p>
    </section>
    <div className="celebration-divider" aria-hidden="true"><span>04</span><i>✧</i><span>11</span></div>
    <section id="venue" className="venue-section section-shell" data-reveal>
      <div className="venue-heading"><div><p className="eyebrow">{ru ? 'МЕСТО НАШЕЙ ВСТРЕЧИ' : 'ҶОЙИ ДИДОРИ МО'}</p><h2>{ru ? 'Ресторан «Самарканд»' : 'Тарабхонаи «Самарқанд»'}</h2></div><div className="venue-summary"><span>{ru?'Самарканд':'Самарқанд'} · 4 {ru?'ноября':'ноябр'}</span><p>{ru?'Вечер в кругу родных и друзей':'Шом дар ҳалқаи пайвандон ва дӯстон'}</p></div></div>
      <div className="venue-gallery venue-single" role="region" aria-label={ru?'Фотография ресторана снаружи':'Акси берунии тарабхона'}>
        {restaurant.photos.map((photo,index)=><figure key={photo.id} className={`venue-photo venue-photo-${index}`}>
          {photo.src?<Image src={photo.src} alt={photo.label[language]} fill sizes="(max-width: 650px) 90vw, 1040px"/>:<div className="venue-empty"><Building2 size={index===0?48:32} strokeWidth={.7}/><span>{ru?'Место для фотографии':'Ҷой барои акс'}</span></div>}
        </figure>)}
      </div>
      <div className="venue-bottom"><p>{ru?'Ждём вас в ресторане «Самарканд».':'Шуморо дар тарабхонаи «Самарқанд» интизорем.'}</p><a href={restaurant.mapUrl} target="_blank" rel="noreferrer">{ru?'Найти на карте':'Дар харита ёфтан'}<ArrowUpRight size={18}/></a></div>
    </section>
    <section id="information" className="information-section section-shell" data-reveal>
      <p className="eyebrow">{ru?'ДО ВСТРЕЧИ НА ПРАЗДНИКЕ':'ТО ДИДОР ДАР ҶАШН'}</p>

    </section>
  </>;
}
