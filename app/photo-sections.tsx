import Image from 'next/image';
import { Camera, Building2, ArrowUpRight } from 'lucide-react';
import { celebrants, type Celebrant, type Language } from '../lib/invitations';
import { restaurant } from '../lib/restaurant';

export default function PhotoSections({language, celebrant}:{language:Language;celebrant:Celebrant}) {
  const ru = language === 'ru';
  const other = celebrants[celebrant.id === 'shavkat' ? 'shuhrat' : 'shavkat'];
  const brother = {...other, name:ru ? other.nameRu : (other.id === 'shuhrat' ? 'Шуҳрат' : 'Шавкат')};
  return <>
    <section id="portraits" className="portraits-section section-shell" data-reveal>
      <div className="section-heading"><p className="eyebrow">{ru ? 'ДВА БРАТА · ОДИН ОСОБЕННЫЙ ДЕНЬ' : 'ДУ БАРОДАР · ЯК РӮЗИ ФАРОМӮШНАШАВАНДА'}</p><h2>{ru ? 'Две судьбы. Одна история.' : 'Ду сарнавишт. Як достон.'}</h2><p>{ru ? 'В этот вечер мы вместе отмечаем наше 60-летие.' : 'Дар ин шом мо 60-солагии худро якҷоя ҷашн мегирем.'}</p></div>
      <div className="portrait-pair">{[celebrant,brother].map((person,index)=><figure className={`person-card person-${index}`} key={person.id}>
        <div className="portrait-frame">{person.photo ? <Image src={person.photo} alt={person.name} width={800} height={1000} sizes="(max-width: 650px) 85vw, 40vw"/> : <div className="portrait-empty"><span className="portrait-monogram" aria-hidden="true">{person.name.charAt(0)}</span><Camera size={22} strokeWidth={1}/><p>{ru ? `Фотография ${person.name}` : `Акси ${person.name}`}</p><span>{ru ? 'Скоро здесь появится портрет' : 'Ба зудӣ дар ин ҷо акс пайдо мешавад'}</span></div>}</div>
        <figcaption><span>0{index+1}</span><h3>{person.name}</h3><span>60 {ru?'лет':'сол'}</span></figcaption>
      </figure>)}</div>
      <p className="portrait-footnote">{ru ? 'Самое ценное — быть рядом.' : 'Аз ҳама арзишманд — дар канори ҳам будан.'}</p>
    </section>
    <div className="celebration-divider" aria-hidden="true"><span>04</span><i>✧</i><span>11</span></div>
    <section id="venue" className="venue-section section-shell" data-reveal>
      <div className="venue-heading"><div><p className="eyebrow">{ru ? 'МЕСТО НАШЕЙ ВСТРЕЧИ' : 'ҶОЙИ ДИДОРИ МО'}</p><h2>{ru ? 'Ресторан «Самарканд»' : 'Тарабхонаи «Самарқанд»'}</h2></div><div className="venue-summary"><span>{ru?'Самарканд':'Самарқанд'} · 4 {ru?'ноября':'ноябр'}</span><p>{ru?'Вечер в кругу родных и друзей':'Шом дар ҳалқаи пайвандон ва дӯстон'}</p></div></div>
      <div className="venue-gallery venue-single" role="region" aria-label={ru?'Фотография ресторана снаружи':'Акси берунии тарабхона'}>
        {restaurant.photos.map((photo,index)=><figure key={photo.id} className={`venue-photo venue-photo-${index}`}>
          {photo.src?<Image src={photo.src} alt={photo.label[language]} fill sizes="(max-width: 650px) 90vw, 1040px"/>:<div className="venue-empty"><Building2 size={index===0?48:32} strokeWidth={.7}/><span>{ru?'Место для фотографии':'Ҷой барои акс'}</span></div>}
          <figcaption><span>0{index+1}</span>{photo.label[language]}</figcaption>
        </figure>)}
      </div>
      <div className="venue-bottom"><p>{ru?'Фотографию ресторана снаружи добавим позже.':'Акси берунии тарабхонаро баъдтар илова мекунем.'}</p><a href={restaurant.mapUrl} target="_blank" rel="noreferrer">{ru?'Найти на карте':'Дар харита ёфтан'}<ArrowUpRight size={18}/></a></div>
    </section>
    <section id="information" className="information-section section-shell" data-reveal>
      <p className="eyebrow">{ru?'ДО ВСТРЕЧИ НА ПРАЗДНИКЕ':'ТО ДИДОР ДАР ҶАШН'}</p><h2>{ru?'Несколько тёплых деталей':'Чанд ҷузъиёти муҳим'}</h2>
      <div className="guest-notes"><article><span>01</span><h3>{ru?'Когда встречаемся':'Кай ҷамъ мешавем'}</h3><p>{ru?'4 ноября. Точное время начала сообщим дополнительно.':'4 ноябр. Вақти дақиқи оғозро баъдтар хабар медиҳем.'}</p></article><article><span>02</span><h3>{ru?'Главный подарок':'Беҳтарин туҳфа'}</h3><p>{ru?'Ваше присутствие, улыбки и добрые пожелания — самое ценное в этот день.':'Ҳузур, табассум ва орзуҳои неки шумо дар ин рӯз барои мо аз ҳама азизанд.'}</p></article><article><span>03</span><h3>{ru?'Сохраним этот вечер':'Ин шомро дар хотир нигоҳ медорем'}</h3><p>{ru?'Сделаем общие фотографии, чтобы тёплые моменты остались с нами надолго.':'Якҷоя акс мегирем, то лаҳзаҳои ширин солҳои зиёд бо мо бимонанд.'}</p></article></div>
    </section>
  </>;
}
