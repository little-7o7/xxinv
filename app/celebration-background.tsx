'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { Language, Theme } from '../lib/invitations';

type Point={x:number;y:number};
type Spark=Point&{vx:number;vy:number;life:number;max:number;color:string;size:number;trail:Point[];twinkle:number};
type Rocket=Point&{sx:number;sy:number;tx:number;ty:number;age:number;duration:number;trail:Point[]};

export default function CelebrationBackground({theme,language}:{theme:Theme;language:Language}) {
  const canvas=useRef<HTMLCanvasElement>(null);
  const [paused,setPaused]=useState(false);
  useEffect(()=>{
    const surface=canvas.current;
    const context=surface?.getContext('2d');
    if(!surface||!context)return;
    const ctx=context;
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    let width=0,height=0,frame=0,last=0,elapsed=0,nextLaunch=.1;
    let sparks:Spark[]=[],rockets:Rocket[]=[];
    const palette=theme==='rose'?['255,211,145','255,160,170','255,232,191']:theme==='jade'?['255,217,144','163,255,207','255,237,193']:['255,217,144','159,211,255','255,182,199'];
    const stars=Array.from({length:180},()=>({x:Math.random(),y:Math.random(),size:Math.random()*1.2+.4,phase:Math.random()*6}));
    const resize=()=>{
      width=window.innerWidth;height=window.innerHeight;
      const ratio=Math.min(window.devicePixelRatio||1,1.5);
      surface.width=Math.round(width*ratio);surface.height=Math.round(height*ratio);
      ctx.setTransform(ratio,0,0,ratio,0,0);
    };
    function burst(x:number,y:number){
      const count=width<650?48:80;
      const color=palette[Math.floor(Math.random()*palette.length)];
      const radius=Math.min(width*.24,200);
      const willow=Math.random()<.35;
      for(let i=0;i<count;i++){
        const angle=Math.PI*2*i/count+(Math.random()-.5)*.05;
        const velocity=radius*(.38+Math.random()*.62);
        const life=(willow?3.7:2.9)+Math.random()*1.1;
        sparks.push({x,y,vx:Math.cos(angle)*velocity,vy:Math.sin(angle)*velocity*(willow?.8:1),life,max:life,color:i%7===0?'255,244,210':color,size:.9+Math.random()*1.2,trail:[],twinkle:Math.random()*10});
      }
    }
    function launch(){
      const tx=width*(Math.random()>.5?.76+Math.random()*.17:.07+Math.random()*.17);
      const ty=height*(.12+Math.random()*.4);
      const sx=tx+(Math.random()-.5)*width*.14;
      rockets.push({x:sx,y:height+15,sx,sy:height+15,tx,ty,age:0,duration:1.1+Math.random()*.5,trail:[]});
    }
    function trail(points:Point[],color:string,alpha:number,size:number){
      for(let i=1;i<points.length;i++){
        ctx.strokeStyle=`rgba(${color},${alpha*i/points.length})`;ctx.lineWidth=size*i/points.length;
        ctx.beginPath();ctx.moveTo(points[i-1].x,points[i-1].y);ctx.lineTo(points[i].x,points[i].y);ctx.stroke();
      }
    }
    function paint(time:number){
      if(last&&time-last<32){frame=requestAnimationFrame(paint);return;}
      // Slightly slower than real time: linger on the bloom and falling embers.
      const dt=Math.min(last?(time-last)/1000:.016,.06)*.76;last=time;elapsed+=dt;
      ctx.clearRect(0,0,width,height);
      ctx.globalCompositeOperation='source-over';
      for(const star of stars){
        const alpha=.18+(Math.sin(elapsed*.5+star.phase)+1)*.15;
        ctx.fillStyle=`rgba(255,232,186,${alpha})`;ctx.beginPath();ctx.arc(star.x*width,star.y*height,star.size,0,Math.PI*2);ctx.fill();
      }
      if(!paused&&!media.matches){
        ctx.globalCompositeOperation='lighter';
        if(elapsed>=nextLaunch){launch();nextLaunch=elapsed+(1.5+Math.random()*.7)/4;}
        for(const r of rockets){
          r.age+=dt;const p=Math.min(1,r.age/r.duration);const ease=1-Math.pow(1-p,1.6);
          r.x=r.sx+(r.tx-r.sx)*p;r.y=r.sy+(r.ty-r.sy)*ease;
          r.trail.push({x:r.x,y:r.y});if(r.trail.length>14)r.trail.shift();
          trail(r.trail,'255,198,112',.8,2);
          ctx.fillStyle='rgba(255,243,201,.95)';ctx.beginPath();ctx.arc(r.x,r.y,1.8,0,Math.PI*2);ctx.fill();
          if(p===1)burst(r.tx,r.ty);
        }
        rockets=rockets.filter(r=>r.age<r.duration);
        sparks=sparks.filter(s=>s.life>0);
        for(const s of sparks){
          s.life-=dt;s.vx*=Math.exp(-dt*.58);s.vy=s.vy*Math.exp(-dt*.58)+dt*29;s.x+=s.vx*dt;s.y+=s.vy*dt;
          s.trail.push({x:s.x,y:s.y});if(s.trail.length>9)s.trail.shift();
          const age=s.max-s.life;
          const fade=Math.min(1,s.life/1.2);
          const shimmer=s.life<1.4?.55+Math.sin(age*18+s.twinkle)*.35:1;
          const alpha=Math.max(0,Math.min(1,age*8))*Math.max(0,fade)*shimmer;
          trail(s.trail,s.color,alpha*.55,s.size);
          if(s.size>1.85){ctx.shadowColor=`rgba(${s.color},.7)`;ctx.shadowBlur=7;}
          ctx.fillStyle=`rgba(${s.color},${alpha})`;ctx.beginPath();ctx.arc(s.x,s.y,s.size,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
        }
        ctx.globalCompositeOperation='source-over';
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
