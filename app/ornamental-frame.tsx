import { useId } from 'react';

/** Quiet geometric corner work inspired by traditional invitation stationery. */
export default function OrnamentalFrame() {
  const goldId=useId();
  return <div className="ornamental-frame" aria-hidden="true">
    {[0,1,2,3].map(corner=><svg key={corner} className={`ornamental-corner corner-${corner}`} viewBox="0 0 120 120" fill="none" style={{stroke:`url(#${goldId}-${corner})`}}>
      <defs><linearGradient id={`${goldId}-${corner}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#a87322"/><stop offset=".22" stopColor="#f5cb62"/><stop offset=".37" stopColor="#fff4c4"/><stop offset=".46" stopColor="#c58b27"/><stop offset=".65" stopColor="#fce49b"/><stop offset=".82" stopColor="#b98021"/><stop offset="1" stopColor="#f6d77f"/>
      </linearGradient></defs>
      <path d="M3 117V3H117M11 106V11H106"/>
      <path d="M3 53L18 46L21 29L38 25L46 10L59 21L76 18L83 35L100 41L97 59L110 72L99 87L101 105M3 88L20 80L24 62L41 57L49 40L66 45L79 33M11 110L28 102L32 85L49 79L57 63L74 68L87 56L104 61"/>
      <path d="M21 29L41 57L18 46L24 62L49 79L32 85L28 102M38 25L49 40L59 21M49 40L57 63L66 45L83 35M57 63L87 56L74 68L99 87L82 93L78 111M74 68L82 93L60 96L49 79M60 96L65 115M97 59L87 56L100 41"/>
      <path d="M41 57L49 40L57 63L49 79Z" fill="currentColor" fillOpacity=".12"/>
      <circle cx="49" cy="59" r="3" fill="currentColor" stroke="none"/>
    </svg>)}
  </div>;
}
