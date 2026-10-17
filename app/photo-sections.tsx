import Image from 'next/image';
import { Camera, Building2, ArrowUpRight } from 'lucide-react';
import { celebrants, type Celebrant, type Language } from '../lib/invitations';
import { restaurant } from '../lib/restaurant';

export default function PhotoSections({language, celebrant}:{language:Language;celebrant:Celebrant}) {
  const ru = language === 'ru';
  const brother = celebrants[celebrant.id === 'xasan' ? 'xusan' : 'xasan'];
  return <>
    <section id="portraits" className="portraits-section section-shell" data-reveal>
      <div className="section-heading"><p className="eyebrow">{ru ? 'ДВА БРАТА · ОДИН ОСОБЕННЫЙ ДЕНЬ' : 'IKKI AKA-UKA · BIR UNUTILMAS KUN'}</p><h2>{ru ? 'Две судьбы. Одна история.' : 'Ikki taqdir. Bir hikoya.'}</h2><p>{ru ? 'В этот вечер мы вместе отмечаем наше 60-летие.' : 'Bu oqshom biz 60 yoshimizni birgalikda nishonlaymiz.'}</p></div>
      <div className="portrait-pair">{[celebrant,brother].map((person,index)=><figure className={`person-card person-${index}`} key={person.id}>
        <div className="portrait-frame">{person.photo ? <Image src={person.photo} alt={person.name} width={800} height={1000} sizes="(max-width: 650px) 85vw, 40vw"/> : <div className="portrait-empty"><span className="portrait-monogram" aria-hidden="true">X</span><Camera size={22} strokeWidth={1}/><p>{ru ? `Фотография ${person.name}` : `${person.name}ning surati`}</p><span>{ru ? 'Скоро здесь появится портрет' : 'Tez orada shu yerda'}</span></div>}</div>
        <figcaption><span>0{index+1}</span><h3>{person.name}</h3><span>60 {ru?'лет':'yosh'}</span></figcaption>
      </figure>)}</div>
      <p className="portrait-footnote">{ru ? 'Самое ценное — быть рядом.' : 'Eng qadrlisi — birga bo‘lish.'}</p>
    </section>
    <div className="celebration-divider" aria-hidden="true"><span>04</span><i>✧</i><span>11</span></div>
    <section id="venue" className="venue-section section-shell" data-reveal>
      <div className="venue-heading"><div><p className="eyebrow">{ru ? 'МЕСТО НАШЕЙ ВСТРЕЧИ' : 'UCHRASHUV JOYIMIZ'}</p><h2>{ru ? 'Ресторан «Самарканд»' : '«Samarkand» restorani'}</h2></div><div className="venue-summary"><span>{ru?'Самарканд':'Samarqand'} · 4 {ru?'ноября':'noyabr'}</span><p>{ru?'Вечер в кругу родных и друзей':'Oila va do‘stlar davrasidagi oqshom'}</p></div></div>
      <div className="venue-gallery" role="region" aria-label={ru?'Фотографии ресторана':'Restoran suratlari'} tabIndex={0}>
        {restaurant.photos.map((photo,index)=><figure key={photo.id} className={`venue-photo venue-photo-${index}`}>
          {photo.src?<Image src={photo.src} alt={photo.label[language]} fill sizes="(max-width: 650px) 85vw, 60vw"/>:<div className="venue-empty"><Building2 size={index===0?48:32} strokeWidth={.7}/><span>{ru?'Место для фотографии':'Surat uchun joy'}</span></div>}
          <figcaption><span>0{index+1}</span>{photo.label[language]}</figcaption>
        </figure>)}
      </div>
      <div className="venue-bottom"><p>{ru?'Фотографии зала, фасада и атмосферы добавим позже.':'Zal, fasad va muhit suratlarini keyinroq qo‘shamiz.'}</p><a href={restaurant.mapUrl} target="_blank" rel="noreferrer">{ru?'Найти на карте':'Xaritadan topish'}<ArrowUpRight size={18}/></a></div>
    </section>
    <section id="information" className="information-section section-shell" data-reveal>
      <p className="eyebrow">{ru?'ДО ВСТРЕЧИ НА ПРАЗДНИКЕ':'BAYRAMDA KO‘RISHGUNCHA'}</p><h2>{ru?'Несколько тёплых деталей':'Bir nechta muhim tafsilot'}</h2>
      <div className="guest-notes"><article><span>01</span><h3>{ru?'Когда встречаемся':'Qachon uchrashamiz'}</h3><p>{ru?'4 ноября. Точное время начала сообщим дополнительно.':'4 noyabr. Boshlanish vaqtini qo‘shimcha xabar qilamiz.'}</p></article><article><span>02</span><h3>{ru?'Главный подарок':'Eng aziz sovg‘a'}</h3><p>{ru?'Ваше присутствие, улыбки и добрые пожелания — самое ценное в этот день.':'Shu kuni sizning ishtirokingiz, tabassumingiz va ezgu tilaklaringiz biz uchun eng qadrlisi.'}</p></article><article><span>03</span><h3>{ru?'Сохраним этот вечер':'Bu oqshomni eslab qolamiz'}</h3><p>{ru?'Сделаем общие фотографии, чтобы тёплые моменты остались с нами надолго.':'Iliq lahzalar uzoq vaqt yodimizda qolishi uchun birga suratga tushamiz.'}</p></article></div>
    </section>
  </>;
}
