import { guestCopy } from '../lib/guest-copy';
import type { Language } from '../lib/invitations';

export default function GuestWords({language}:{language:Language}) {
  const t=guestCopy[language];
  return <>
    <section className="guest-dedication section-shell" data-reveal>
      <div className="guest-wishes"><span aria-hidden="true">✧</span><h3>{t.wishTitle}</h3><p>{t.wish}</p></div>
    </section>
    <section id="guest-information" className="guest-faq section-shell" data-reveal>
      <h2>{t.faqEyebrow}</h2>
      <div className="faq-list">{t.questions.map(({q,a},index)=><details key={q}><summary><span>0{index+1}</span>{q}<i aria-hidden="true">+</i></summary><p>{a}</p></details>)}</div>
      <p className="guest-farewell">{t.farewell}</p>
    </section>
  </>;
}
