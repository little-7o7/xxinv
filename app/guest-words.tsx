import { guestCopy } from '../lib/guest-copy';
import type { Language } from '../lib/invitations';

export default function GuestWords({language,guest,name}:{language:Language;guest:string;name:string}) {
  const t=guestCopy[language];
  return <>
    <section className="guest-dedication section-shell" data-reveal>
      <p className="eyebrow">{t.eyebrow}</p><h2>{t.title}</h2>
      {guest && <p className="dedication-name">{guest}, {language==='ru'?'это приглашение — для вас.':'bu taklifnoma siz uchun.'}</p>}
      <div className="dedication-prose">{t.paragraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div>
      <blockquote>{t.quote}</blockquote>
      <div className="guest-wishes"><span aria-hidden="true">✧</span><h3>{t.wishTitle}</h3><p>{t.wish}</p><p className="signature">{name}</p></div>
    </section>
    <section id="guest-information" className="guest-faq section-shell" data-reveal>
      <p className="eyebrow">{t.faqEyebrow}</p><h2>{t.faqTitle}</h2>
      <div className="faq-list">{t.questions.map(({q,a},index)=><details key={q} open={index===0}><summary><span>0{index+1}</span>{q}<i aria-hidden="true">+</i></summary><p>{a}</p></details>)}</div>
      <p className="guest-farewell">{t.farewell}</p>
    </section>
  </>;
}
