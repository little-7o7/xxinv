'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { Language, Theme } from '../lib/invitations';

type Spark = {x:number;y:number;vx:number;vy:number;life:number;max:number;color:string;size:number};
export default function CelebrationBackground({theme,language}:{theme:Theme;language:Language}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused,setPaused] = useState(false);
  useEffect(() => {
    const surface=canvas.current;
    const context=surface?.getContext('2d');
    if(!surface||!context)return;
    const ctx=context;
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    let width=0,height=0,frame=0,last=0,elapsed=0,nextBurst=.1;
    let sparks:Spark[]=[];
    const palette=theme==='rose'?['244,192,134','225,144,157','255,221,184']:theme==='jade'?['225,198,133','145,219,186','239,222,176']:['230,197,132','147,190,240','224,164,186'];
    const stars=Array.from({length:45},()=>({x:Math.random(),y:Math.random(),size:Math.random()*1.3+.4,phase:Math.random()*6}));
    const resize=()=>{
      width=window.innerWidth;height=window.innerHeight;
      const ratio=Math.min(window.devicePixelRatio||1,1.5);
      surface.width=Math.round(width*ratio);surface.height=Math.round(height*ratio);
      ctx.setTransform(ratio,0,0,ratio,0,0);
    };
    function burst(){
      const side=Math.random()>.5;
      const x=width*(side?.79+Math.random()*.13:.08+Math.random()*.13);
      const y=height*(.13+Math.random()*.43);
      const count=width<650?38:64;
      const color=palette[Math.floor(Math.random()*palette.length)];
      const radius=Math.min(width*.21,155);
      for(let i=0;i<count;i++){
        const angle=Math.PI*2*i/count;
        const velocity=radius*(.58+Math.random()*.48);
        const life=1.8+Math.random()*.9;
        sparks.push({x,y,vx:Math.cos(angle)*velocity,vy:Math.sin(angle)*velocity,life,max:life,color,size:.7+Math.random()*.9});
      }
    }
    function paint(time:number){
      const dt=Math.min((time-last)/1000||0,.04);last=time;elapsed+=dt;
      ctx.clearRect(0,0,width,height);
      for(const star of stars){
        const alpha=.12+(Math.sin(elapsed*.7+star.phase)+1)*.13;
        ctx.fillStyle=`rgba(244,220,168,${alpha})`;ctx.beginPath();
        ctx.arc(star.x*width,star.y*height,star.size,0,Math.PI*2);ctx.fill();
      }
      if(!paused&&!media.matches){
        if(elapsed>=nextBurst){burst();nextBurst=elapsed+1.5+Math.random()*.7;}
        sparks=sparks.filter(s=>s.life>0);
        for(const s of sparks){
          const px=s.x,py=s.y;s.life-=dt;s.vx*=Math.exp(-dt*.7);s.vy=s.vy*Math.exp(-dt*.7)+dt*18;s.x+=s.vx*dt;s.y+=s.vy*dt;
          const alpha=Math.max(0,Math.min(1,(s.max-s.life)*4))*Math.max(0,s.life/s.max)*.8;
          ctx.strokeStyle=`rgba(${s.color},${alpha*.5})`;ctx.lineWidth=s.size*.65;ctx.beginPath();ctx.moveTo(px-s.vx*.045,py-s.vy*.045);ctx.lineTo(s.x,s.y);ctx.stroke();
          ctx.fillStyle=`rgba(${s.color},${alpha})`;ctx.beginPath();ctx.arc(s.x,s.y,s.size,0,Math.PI*2);ctx.fill();
        }
        frame=requestAnimationFrame(paint);
      }
    }
    const start=()=>{cancelAnimationFrame(frame);last=0;if(!document.hidden)frame=requestAnimationFrame(paint)};
    const visibility=()=>{if(document.hidden)cancelAnimationFrame(frame);else start()};
    const onResize=()=>{resize();start()};
    resize();start();window.addEventListener('resize',onResize);document.addEventListener('visibilitychange',visibility);media.addEventListener('change',start);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',onResize);document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',start)};
  },[theme,paused]);
  return <><div className="celebration-sky" aria-hidden="true"><div className="sky-glow sky-glow-one"/><div className="sky-glow sky-glow-two"/><canvas ref={canvas}/></div><button type="button" className="effects-toggle" aria-pressed={!paused} aria-label={language==='ru'?(paused?'Включить фейерверки':'Приостановить фейерверки'):(paused?'Mushakbozlikni yoqish':'Mushakbozlikni to‘xtatish')} onClick={()=>setPaused(value=>!value)}><Sparkles size={16}/><span>{language==='ru'?'Фейерверки':'Mushakbozlik'}</span></button></>;
}
