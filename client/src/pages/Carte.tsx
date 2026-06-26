import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { getDailyCard, getThreeCardSpread, type TarotCard } from '@/lib/tarot';
import { TAROT_ART } from '@/lib/tarotArt';
import GlowCard from '@/components/GlowCard';
import { track } from '@/lib/analytics';

// legacy motif — kept only for cards with no art entry (shouldn't happen)
function CardMotif({ id, color, w, h }: { id: number; color: string; w: number; h: number }) {
  const c = color;
  const W = w;
  const H = h;

  const motif = (() => {
    switch (id) {
      case 0: // Il Matto — scattered dots, wandering diagonal path
        return (
          <>
            {([[0.15,0.18],[0.78,0.14],[0.22,0.68],[0.82,0.62],[0.48,0.84],[0.12,0.44],[0.7,0.36]] as [number,number][]).map(([x,y],i) => (
              <circle key={i} cx={x*W} cy={y*H} r={2} fill={c} opacity={0.3+i*0.02} />
            ))}
            <path d={`M${0.15*W},${0.2*H} Q${0.4*W},${0.38*H} ${0.78*W},${0.14*H}`} stroke={c} strokeWidth={0.5} fill="none" opacity={0.2} strokeDasharray="2,3" />
          </>
        );

      case 1: // Il Mago — four elements at corners, crosshair axis
        return (
          <>
            <line x1={W/2} y1={0.08*H} x2={W/2} y2={0.92*H} stroke={c} strokeWidth={0.6} opacity={0.2} />
            <line x1={0.08*W} y1={H/2} x2={0.92*W} y2={H/2} stroke={c} strokeWidth={0.6} opacity={0.2} />
            {([[0.14,0.1],[0.86,0.1],[0.14,0.9],[0.86,0.9]] as [number,number][]).map(([x,y],i) => (
              <text key={i} x={x*W} y={y*H+3} textAnchor="middle" fill={c} opacity={0.38} fontSize={7}>✦</text>
            ))}
            <circle cx={W/2} cy={H/2} r={4} fill={c} opacity={0.25} />
          </>
        );

      case 2: // La Sacerdotessa — two pillars + crescent arc
        return (
          <>
            <rect x={0.1*W} y={0.12*H} width={4} height={H*0.72} fill={c} opacity={0.22} rx={2} />
            <rect x={0.9*W-4} y={0.12*H} width={4} height={H*0.72} fill={c} opacity={0.22} rx={2} />
            <path d={`M${0.18*W},${0.08*H} Q${W/2},${0.22*H} ${0.82*W},${0.08*H}`} stroke={c} strokeWidth={0.8} fill="none" opacity={0.3} />
            <line x1={W/2} y1={0.1*H} x2={W/2} y2={0.9*H} stroke={c} strokeWidth={0.4} strokeDasharray="3,4" opacity={0.15} />
          </>
        );

      case 3: // L'Imperatrice — 6 petals radiating from center
        return (
          <>
            {[0,60,120,180,240,300].map((deg,i) => {
              const r = H*0.22, rad = deg*Math.PI/180;
              return (
                <g key={i}>
                  <circle cx={W/2+Math.cos(rad)*r} cy={H/2+Math.sin(rad)*r} r={3.5} fill={c} opacity={0.28} />
                  <line x1={W/2+Math.cos(rad)*6} y1={H/2+Math.sin(rad)*6} x2={W/2+Math.cos(rad)*(r-4)} y2={H/2+Math.sin(rad)*(r-4)} stroke={c} strokeWidth={0.5} opacity={0.18} />
                </g>
              );
            })}
            <circle cx={W/2} cy={H/2} r={H*0.22} stroke={c} strokeWidth={0.5} fill="none" opacity={0.18} />
          </>
        );

      case 4: // L'Imperatore — L-bracket corners, strong midline
        return (
          <>
            {([[0.1,0.1,1,1],[0.9,0.1,-1,1],[0.1,0.9,1,-1],[0.9,0.9,-1,-1]] as [number,number,number,number][]).map(([x,y,dx,dy],i) => (
              <path key={i} d={`M${(x+dx*0.07)*W},${y*H} L${x*W},${y*H} L${x*W},${(y+dy*0.07)*H}`} stroke={c} strokeWidth={1.5} fill="none" opacity={0.32} />
            ))}
            <line x1={0.1*W} y1={H/2} x2={0.9*W} y2={H/2} stroke={c} strokeWidth={0.8} opacity={0.22} />
          </>
        );

      case 5: // Il Papa — triple cross
        return (
          <>
            <line x1={W/2} y1={0.1*H} x2={W/2} y2={0.9*H} stroke={c} strokeWidth={1.5} opacity={0.28} />
            <line x1={0.25*W} y1={H*0.32} x2={0.75*W} y2={H*0.32} stroke={c} strokeWidth={1.5} opacity={0.28} />
            <line x1={0.32*W} y1={H*0.42} x2={0.68*W} y2={H*0.42} stroke={c} strokeWidth={0.8} opacity={0.22} />
            <circle cx={W/2} cy={H*0.32} r={3.5} fill={c} opacity={0.3} />
          </>
        );

      case 6: // Gli Amanti — vesica piscis (two overlapping circles)
        return (
          <>
            <circle cx={W*0.38} cy={H*0.52} r={H*0.19} stroke={c} strokeWidth={0.8} fill={c} fillOpacity={0.05} opacity={0.45} />
            <circle cx={W*0.62} cy={H*0.52} r={H*0.19} stroke={c} strokeWidth={0.8} fill={c} fillOpacity={0.05} opacity={0.45} />
            <circle cx={W/2} cy={H*0.2} r={2.5} fill={c} opacity={0.5} />
            <line x1={W/2} y1={H*0.13} x2={W/2} y2={H*0.28} stroke={c} strokeWidth={0.5} opacity={0.3} />
            <line x1={W*0.43} y1={H*0.2} x2={W*0.57} y2={H*0.2} stroke={c} strokeWidth={0.5} opacity={0.3} />
          </>
        );

      case 7: // Il Carro — horizontal speed lines + two wheel outlines
        return (
          <>
            {[0.3, 0.42, 0.54, 0.66, 0.78].map((y,i) => (
              <line key={i} x1={0.08*W} y1={y*H} x2={(0.68+i*0.05)*W} y2={y*H} stroke={c} strokeWidth={i===2?0.9:0.5} opacity={i===2?0.3:0.18} strokeDasharray={i===2?'':'5,3'} />
            ))}
            <circle cx={0.15*W} cy={H*0.54} r={H*0.07} stroke={c} strokeWidth={0.7} fill="none" opacity={0.22} />
            <circle cx={0.85*W} cy={H*0.54} r={H*0.07} stroke={c} strokeWidth={0.7} fill="none" opacity={0.22} />
          </>
        );

      case 8: // La Forza — lemniscate (infinity ∞)
        return (
          <>
            <path d={`M${W/2},${H/2} C${W*0.32},${H*0.3} ${W*0.05},${H*0.3} ${W*0.05},${H*0.5} C${W*0.05},${H*0.7} ${W*0.32},${H*0.7} ${W/2},${H*0.5} C${W*0.68},${H*0.3} ${W*0.95},${H*0.3} ${W*0.95},${H*0.5} C${W*0.95},${H*0.7} ${W*0.68},${H*0.7} ${W/2},${H*0.5} Z`}
              stroke={c} strokeWidth={1} fill={c} fillOpacity={0.06} opacity={0.45} />
            <circle cx={W/2} cy={H/2} r={2.5} fill={c} opacity={0.5} />
          </>
        );

      case 9: // L'Eremita — single vertical beam of light
        return (
          <>
            <rect x={W/2-3} y={0.1*H} width={6} height={H*0.8} fill={c} opacity={0.1} rx={3} />
            <rect x={W/2-1} y={0.1*H} width={2} height={H*0.8} fill={c} opacity={0.18} rx={1} />
            <circle cx={W/2} cy={H*0.16} r={8} fill={c} opacity={0.12} />
            <circle cx={W/2} cy={H*0.16} r={4} fill={c} opacity={0.22} />
            <circle cx={W*0.28} cy={H*0.4} r={1.5} fill={c} opacity={0.2} />
            <circle cx={W*0.72} cy={H*0.55} r={1.5} fill={c} opacity={0.2} />
          </>
        );

      case 10: // La Ruota — concentric rings + 4 spokes
        return (
          <>
            {[0.38, 0.27, 0.15].map((r,i) => (
              <circle key={i} cx={W/2} cy={H/2} r={H*r} stroke={c} strokeWidth={0.6} fill="none" opacity={0.18+i*0.06} />
            ))}
            {[0,45,90,135].map((deg,i) => {
              const rad = deg*Math.PI/180;
              return <line key={i} x1={W/2-Math.cos(rad)*H*0.38} y1={H/2-Math.sin(rad)*H*0.38} x2={W/2+Math.cos(rad)*H*0.38} y2={H/2+Math.sin(rad)*H*0.38} stroke={c} strokeWidth={0.6} opacity={0.18} />;
            })}
            <circle cx={W/2} cy={H/2} r={4} fill={c} opacity={0.3} />
          </>
        );

      case 11: // La Giustizia — perfect balance, scales
        return (
          <>
            <line x1={W/2} y1={0.1*H} x2={W/2} y2={0.9*H} stroke={c} strokeWidth={0.7} opacity={0.22} />
            <line x1={0.1*W} y1={H*0.42} x2={0.9*W} y2={H*0.42} stroke={c} strokeWidth={1} opacity={0.3} />
            <line x1={0.22*W} y1={H*0.42} x2={0.22*W} y2={H*0.52} stroke={c} strokeWidth={0.7} opacity={0.25} />
            <line x1={0.78*W} y1={H*0.42} x2={0.78*W} y2={H*0.52} stroke={c} strokeWidth={0.7} opacity={0.25} />
            <circle cx={0.22*W} cy={H*0.58} r={H*0.08} stroke={c} strokeWidth={0.7} fill="none" opacity={0.28} />
            <circle cx={0.78*W} cy={H*0.58} r={H*0.08} stroke={c} strokeWidth={0.7} fill="none" opacity={0.28} />
          </>
        );

      case 12: // L'Appeso — crossbar + pendant drops
        return (
          <>
            <line x1={0.22*W} y1={0.14*H} x2={0.78*W} y2={0.14*H} stroke={c} strokeWidth={1.2} opacity={0.32} />
            <line x1={W/2} y1={0.14*H} x2={W/2} y2={0.38*H} stroke={c} strokeWidth={0.8} opacity={0.28} />
            <circle cx={W/2} cy={H*0.74} r={3} fill={c} opacity={0.32} />
            {[{x:0.34,y:0.82},{x:0.5,y:0.88},{x:0.66,y:0.82}].map((d,i) => (
              <ellipse key={i} cx={d.x*W} cy={d.y*H} rx={2} ry={3} fill={c} opacity={0.22} />
            ))}
          </>
        );

      case 13: // La Morte — horizon line, stark division
        return (
          <>
            <line x1={0} y1={H*0.56} x2={W} y2={H*0.56} stroke={c} strokeWidth={1.5} opacity={0.38} />
            <rect x={0} y={H*0.56} width={W} height={H*0.44} fill={c} opacity={0.05} />
            <line x1={W/2-10} y1={H*0.36} x2={W/2+10} y2={H*0.36} stroke={c} strokeWidth={1} opacity={0.28} />
            <line x1={W/2} y1={H*0.27} x2={W/2} y2={H*0.45} stroke={c} strokeWidth={1} opacity={0.28} />
            <circle cx={W*0.22} cy={H*0.2} r={4} stroke={c} strokeWidth={0.7} fill="none" opacity={0.25} />
          </>
        );

      case 14: // La Temperanza — S-curve flow between two circles
        return (
          <>
            <circle cx={W*0.2} cy={H*0.44} r={H*0.1} stroke={c} strokeWidth={0.8} fill={c} fillOpacity={0.05} opacity={0.38} />
            <circle cx={W*0.8} cy={H*0.56} r={H*0.1} stroke={c} strokeWidth={0.8} fill={c} fillOpacity={0.05} opacity={0.38} />
            <path d={`M${W*0.2},${H*0.44} C${W*0.4},${H*0.34} ${W*0.6},${H*0.66} ${W*0.8},${H*0.56}`} stroke={c} strokeWidth={1.2} fill="none" opacity={0.32} />
            <circle cx={W/2} cy={H/2} r={2.5} fill={c} opacity={0.38} />
          </>
        );

      case 15: // Il Diavolo — heavy double frame + chain corners
        return (
          <>
            <rect x={0.08*W} y={0.08*H} width={W*0.84} height={H*0.84} stroke={c} strokeWidth={2} fill="none" opacity={0.18} rx={1} />
            <rect x={0.15*W} y={0.15*H} width={W*0.7} height={H*0.7} stroke={c} strokeWidth={0.8} fill="none" opacity={0.12} rx={1} />
            {([[0.1,0.1],[0.9,0.1],[0.1,0.9],[0.9,0.9]] as [number,number][]).map(([x,y],i) => (
              <circle key={i} cx={x*W} cy={y*H} r={4} stroke={c} strokeWidth={1} fill="none" opacity={0.28} />
            ))}
            {[0,72,144,216,288].map((deg,i) => {
              const rad = deg*Math.PI/180;
              return <circle key={i} cx={W/2+Math.cos(rad)*H*0.12} cy={H/2+Math.sin(rad)*H*0.12} r={1.8} fill={c} opacity={0.22} />;
            })}
          </>
        );

      case 16: // La Torre — lightning bolt + sparks
        return (
          <>
            <path d={`M${W*0.56},${H*0.1} L${W*0.36},${H*0.48} L${W*0.52},${H*0.48} L${W*0.38},${H*0.9} L${W*0.72},${H*0.46} L${W*0.54},${H*0.46} L${W*0.68},${H*0.1} Z`}
              stroke={c} strokeWidth={1} fill={c} fillOpacity={0.14} opacity={0.48} />
            {([[0.18,0.22],[0.82,0.28],[0.14,0.68],[0.86,0.72]] as [number,number][]).map(([x,y],i) => (
              <circle key={i} cx={x*W} cy={y*H} r={2} fill={c} opacity={0.38} />
            ))}
          </>
        );

      case 17: // La Stella — 8 radiating rays + satellite stars
        return (
          <>
            {[0,45,90,135,180,225,270,315].map((deg,i) => {
              const rad = deg*Math.PI/180;
              return <line key={i} x1={W/2+Math.cos(rad)*9} y1={H/2+Math.sin(rad)*9} x2={W/2+Math.cos(rad)*H*0.32} y2={H/2+Math.sin(rad)*H*0.32} stroke={c} strokeWidth={i%2===0?0.9:0.5} opacity={i%2===0?0.28:0.18} />;
            })}
            {([[0.14,0.14],[0.84,0.12],[0.1,0.74],[0.88,0.8],[0.18,0.44],[0.84,0.5]] as [number,number][]).map(([x,y],i) => (
              <circle key={i} cx={x*W} cy={y*H} r={i<2?2.5:1.5} fill={c} opacity={0.28+i*0.02} />
            ))}
          </>
        );

      case 18: { // La Luna — crescent mask + ripple waves + towers
        const moonCx = W/2, moonCy = H*0.24, moonR = H*0.14;
        return (
          <>
            <defs>
              <mask id="luna-crescent">
                <circle cx={moonCx} cy={moonCy} r={moonR} fill="white" />
                <circle cx={moonCx+moonR*0.45} cy={moonCy} r={moonR*0.78} fill="black" />
              </mask>
            </defs>
            <circle cx={moonCx} cy={moonCy} r={moonR} fill={c} opacity={0.38} mask="url(#luna-crescent)" />
            {[0.64, 0.74, 0.84].map((y,i) => (
              <path key={i} d={`M${W*0.08},${H*y} Q${W*0.3},${H*(y-0.025)} ${W/2},${H*y} Q${W*0.7},${H*(y+0.025)} ${W*0.92},${H*y}`} stroke={c} strokeWidth={0.6} fill="none" opacity={0.22-i*0.04} />
            ))}
            <rect x={W*0.1} y={H*0.42} width={W*0.09} height={H*0.34} stroke={c} strokeWidth={0.5} fill="none" opacity={0.2} />
            <rect x={W*0.81} y={H*0.42} width={W*0.09} height={H*0.34} stroke={c} strokeWidth={0.5} fill="none" opacity={0.2} />
          </>
        );
      }

      case 19: // Il Sole — 12 radiating sunrays
        return (
          <>
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg,i) => {
              const rad = deg*Math.PI/180;
              const r1 = H*0.12, r2 = H*(i%2===0?0.36:0.28);
              return <line key={i} x1={W/2+Math.cos(rad)*r1} y1={H/2+Math.sin(rad)*r1} x2={W/2+Math.cos(rad)*r2} y2={H/2+Math.sin(rad)*r2} stroke={c} strokeWidth={i%2===0?1.2:0.6} opacity={i%2===0?0.32:0.2} />;
            })}
            <circle cx={W/2} cy={H/2} r={H*0.1} fill={c} opacity={0.18} />
          </>
        );

      case 20: // Il Giudizio — rising arcs (trumpet waves)
        return (
          <>
            {[{r:0.3,y:0.7},{r:0.21,y:0.61},{r:0.12,y:0.52}].map(({r,y},i) => (
              <path key={i} d={`M${W/2-r*W},${y*H} Q${W/2},${(y-r*0.85)*H} ${W/2+r*W},${y*H}`} stroke={c} strokeWidth={1-i*0.2} fill="none" opacity={0.3-i*0.05} />
            ))}
            {([[0.3,0.72],[0.5,0.62],[0.7,0.72]] as [number,number][]).map(([x,y],i) => (
              <circle key={i} cx={x*W} cy={y*H} r={3} fill={c} opacity={0.28} />
            ))}
            <path d={`M${W*0.42},${H*0.14} L${W*0.42},${H*0.28} Q${W/2},${H*0.32} ${W*0.58},${H*0.28} L${W*0.58},${H*0.14}`} stroke={c} strokeWidth={0.8} fill="none" opacity={0.28} />
          </>
        );

      case 21: // Il Mondo — oval laurel wreath frame
        return (
          <>
            <ellipse cx={W/2} cy={H/2} rx={W*0.38} ry={H*0.42} stroke={c} strokeWidth={1} fill="none" opacity={0.28} />
            <ellipse cx={W/2} cy={H/2} rx={W*0.32} ry={H*0.36} stroke={c} strokeWidth={0.5} fill="none" opacity={0.18} />
            {([[0.1,0.12],[0.9,0.12],[0.1,0.88],[0.9,0.88]] as [number,number][]).map(([x,y],i) => (
              <rect key={i} x={x*W-3} y={y*H-3} width={6} height={6} fill={c} opacity={0.25} rx={1} />
            ))}
            <circle cx={W/2} cy={H/2} r={H*0.07} stroke={c} strokeWidth={0.6} fill={c} fillOpacity={0.05} opacity={0.3} />
          </>
        );

      default:
        return null;
    }
  })();

  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
    >
      {motif}
    </svg>
  );
}

// --- Card components ---

function CardBack() {
  return (
    <div
      className="w-full h-full rounded-2xl flex items-center justify-center overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #1e0d38 0%, #0d0d24 50%, #0a1828 100%)',
        border: '1.5px solid rgba(212,168,67,0.45)',
        boxShadow: '0 0 24px rgba(212,168,67,0.15), inset 0 0 40px rgba(124,58,237,0.08)',
        backfaceVisibility: 'hidden',
      }}
    >
      <div className="absolute w-1 h-1 rounded-full bg-white/50 top-[12%] left-[18%]" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/35 top-[8%] right-[22%]" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-purple-300/40 top-[28%] right-[10%]" />
      <div className="absolute w-1 h-1 rounded-full bg-teal-300/30 bottom-[14%] right-[18%]" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/40 bottom-[10%] left-[22%]" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/25 top-[45%] left-[8%]" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-yellow-200/30 top-[38%] right-[8%]" />
      <div className="absolute inset-2.5 rounded-xl border border-[rgba(212,168,67,0.22)]" />
      <div className="absolute inset-[18px] rounded-lg border border-[rgba(212,168,67,0.12)]" />
      <span className="absolute top-[14px] left-[14px] text-[7px] text-[#d4a843] opacity-60">✦</span>
      <span className="absolute top-[14px] right-[14px] text-[7px] text-[#d4a843] opacity-60">✦</span>
      <span className="absolute bottom-[14px] left-[14px] text-[7px] text-[#d4a843] opacity-60">✦</span>
      <span className="absolute bottom-[14px] right-[14px] text-[7px] text-[#d4a843] opacity-60">✦</span>
      <div className="relative flex flex-col items-center gap-1.5">
        <div className="absolute w-20 h-20 rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,168,67,0.2) 0%, transparent 70%)' }} />
        <div className="text-3xl text-[#d4a843] relative" style={{ filter: 'drop-shadow(0 0 12px rgba(212,168,67,0.8))' }}>✦</div>
        <p className="text-[6px] tracking-[0.35em] text-[#d4a843] opacity-50 font-semibold uppercase relative">Katharsis</p>
      </div>
    </div>
  );
}

function CardFront({ card }: { card: TarotCard }) {
  const art = TAROT_ART[card.id];
  return (
    <div
      className="w-full h-full rounded-2xl overflow-hidden relative"
      style={{
        background: `linear-gradient(160deg, ${card.color}55 0%, #0c082a 45%, #060212 100%)`,
        border: `1.5px solid ${card.color}80`,
        boxShadow: `0 0 22px ${card.color}35, inset 0 0 30px ${card.color}12`,
        backfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
      }}
    >
      {/* Full illustration */}
      {art && (
        <svg viewBox="0 0 140 210" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
          {art(card.color, 140, 210)}
        </svg>
      )}

      {/* Numeral — top overlay */}
      <div className="absolute top-0 left-0 right-0 flex items-center gap-1.5 px-2.5 pt-2 z-10">
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${card.color}50)` }} />
        <p className="text-[8px] font-semibold tracking-[0.25em] uppercase" style={{ color: card.color }}>{card.numeral}</p>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${card.color}50)` }} />
      </div>

      {/* Central emoji with glow */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative">
          <div className="absolute inset-0 rounded-full scale-[2.5]" style={{ background: `radial-gradient(circle, ${card.color}35 0%, transparent 70%)` }} />
          <span className="text-5xl relative" style={{ filter: `drop-shadow(0 0 18px ${card.color}) drop-shadow(0 0 8px ${card.color})` }}>
            {card.symbol}
          </span>
        </div>
      </div>

      {/* Name — bottom overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5 text-center z-10">
        <div className="h-px w-10 mx-auto rounded-full mb-1.5" style={{ background: `${card.color}60` }} />
        <p className="font-display font-bold text-[10px] leading-tight" style={{ color: card.color }}>
          {card.name}
        </p>
      </div>
    </div>
  );
}

function FlipCard({
  card,
  onFlip,
  flipped,
  reducedMotion,
}: {
  card: TarotCard;
  onFlip: () => void;
  flipped: boolean;
  reducedMotion: boolean;
}) {
  return (
    <div
      className="relative cursor-pointer select-none"
      style={{ width: '140px', height: '210px', perspective: '900px' }}
      onClick={() => !flipped && onFlip()}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.65, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0"><CardBack /></div>
        <div className="absolute inset-0"><CardFront card={card} /></div>
      </motion.div>

      {!flipped && (
        <motion.div
          className="absolute -bottom-7 left-0 right-0 text-center text-[10px] text-white/35 font-body"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          tocca per rivelare
        </motion.div>
      )}
    </div>
  );
}

function SmallCard({ card, label }: { card: TarotCard; label: string }) {
  const art = TAROT_ART[card.id];
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="rounded-xl overflow-hidden relative"
        style={{
          width: '88px', height: '132px',
          background: `linear-gradient(160deg, ${card.color}52 0%, #080614 100%)`,
          border: `1.5px solid ${card.color}70`,
          boxShadow: `0 0 14px ${card.color}30, inset 0 0 16px ${card.color}10`,
        }}
      >
        {/* Illustration */}
        {art && (
          <svg viewBox="0 0 88 132" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
            {art(card.color, 88, 132)}
          </svg>
        )}

        {/* Numeral */}
        <div className="absolute top-0 left-0 right-0 flex items-center gap-1 px-1.5 pt-1.5 z-10">
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${card.color}45)` }} />
          <p className="text-[6px] font-semibold tracking-widest uppercase" style={{ color: card.color }}>{card.numeral}</p>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${card.color}45)` }} />
        </div>

        {/* Emoji */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="text-2xl" style={{ filter: `drop-shadow(0 0 10px ${card.color})` }}>{card.symbol}</span>
        </div>

        {/* Name */}
        <div className="absolute bottom-0 left-0 right-0 pb-1.5 text-center z-10">
          <p className="font-display font-bold text-[7px] leading-tight px-1" style={{ color: `${card.color}ee` }}>
            {card.name}
          </p>
        </div>
      </div>
      <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-white/35">{label}</p>
    </div>
  );
}

function CardHeroVisual({ card, flipped, reducedMotion, onFlip }: { card: TarotCard; flipped: boolean; reducedMotion: boolean; onFlip: () => void }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #100a2e 0%, #050312 100%)' }}
    >
      <div className="absolute w-1 h-1 rounded-full bg-white/45 top-[15%] left-[12%]" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/30 top-[10%] right-[18%]" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-purple-300/40 top-[30%] right-[8%]" />
      <div className="absolute w-1 h-1 rounded-full bg-teal-300/25 bottom-[18%] right-[12%]" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/35 bottom-[12%] left-[16%]" />
      <motion.div
        className="absolute w-44 h-44 rounded-full"
        style={{ background: `radial-gradient(circle, ${card.color}30 0%, transparent 70%)` }}
        animate={{ opacity: flipped ? 1 : 0.35 }}
        transition={{ duration: 0.5 }}
      />
      <FlipCard card={card} onFlip={onFlip} flipped={flipped} reducedMotion={reducedMotion} />
    </div>
  );
}

export default function Carte() {
  const shouldReduceMotion = useReducedMotion();
  const { userProfile } = useApp();
  const sign = userProfile?.zodiac_sign || 'Leone';
  const isPremium = userProfile?.subscription_status === 'premium';

  const dailyCard = getDailyCard(sign);
  const [flipped, setFlipped] = useState(false);
  const [showSpread, setShowSpread] = useState(false);
  const [spreadUnlocked, setSpreadUnlocked] = useState(false);
  const spread = getThreeCardSpread(sign);

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-1">TAROT</p>
        <h1 className="font-display font-light text-[#f0eeff] text-2xl mb-1">Carte</h1>
        <p className="text-white/40 font-body text-sm">La tua guida del giorno attraverso i Grandi Arcani</p>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <GlowCard
          glowColor="purple"
          heroSlot={
            <CardHeroVisual
              card={dailyCard}
              flipped={flipped}
              reducedMotion={!!shouldReduceMotion}
              onFlip={() => { setFlipped(true); track('tarot_card_revealed', { card: dailyCard.name, sign }); }}
            />
          }
          heroHeight="h-56"
          className="p-5"
          animate={false}
        >
          <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-1">CARTA DEL GIORNO</p>

          <AnimatePresence mode="wait">
            {!flipped ? (
              <motion.div key="hidden" exit={{ opacity: 0 }}>
                <h2 className="font-display font-bold text-white text-xl mb-1">La tua carta ti attende</h2>
                <p className="text-white/45 font-body text-sm mb-4">Tocca la carta per scoprire il messaggio di oggi</p>
                <button
                  onClick={() => { setFlipped(true); track('tarot_card_revealed', { card: dailyCard.name, sign }); }}
                  className="w-full py-3 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #d4a843)' }}
                >
                  Rivela la carta
                </button>
              </motion.div>
            ) : (
              <motion.div key="revealed" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h2 className="font-display font-bold text-xl mb-1" style={{ color: dailyCard.color }}>{dailyCard.name}</h2>
                <p className="text-white/60 font-body text-xs font-semibold uppercase tracking-widest mb-2">{dailyCard.meaning}</p>
                <p className="text-white/60 font-body text-sm leading-relaxed">{dailyCard.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </GlowCard>
      </motion.div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {!showSpread ? (
          <GlowCard className="p-5 text-center" animate={false}>
            <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-1">SPREAD</p>
            <h3 className="font-display font-light text-[#f0eeff] text-lg mb-1">Spread a 3 Carte</h3>
            <p className="text-white/45 font-body text-sm mb-4">Passato · Presente · Futuro — una visione più profonda del tuo percorso</p>
            {isPremium || spreadUnlocked ? (
              <button
                onClick={() => { setShowSpread(true); track('tarot_spread_opened'); }}
                className="w-full py-3 rounded-full bg-teal-500 hover:bg-teal-400 text-white font-semibold text-sm transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] active:scale-95"
              >
                Apri lo spread
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setSpreadUnlocked(true); setShowSpread(true); track('tarot_spread_unlocked', { method: 'premium_click' }); }}
                  className="w-full py-3 rounded-full text-white font-semibold text-sm mb-3 transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                  style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #7c3aed 100%)' }}
                >
                  Sblocca lo Spread — Premium
                </button>
                <button
                  onClick={() => { setSpreadUnlocked(true); setShowSpread(true); track('tarot_spread_unlocked', { method: 'free_trial' }); }}
                  className="text-white/30 font-body text-xs hover:text-white/50 transition-colors"
                >
                  Prova gratis (1 volta)
                </button>
              </>
            )}
          </GlowCard>
        ) : (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <GlowCard glowColor="teal" className="p-5" animate={false}>
              <p className="text-[10px] font-label font-semibold tracking-[0.18em] uppercase text-[#a78bfa] mb-1">SPREAD · TRE CARTE</p>
              <h3 className="font-display font-light text-[#f0eeff] text-lg mb-4">Il tuo percorso</h3>

              <div className="flex justify-around mb-5">
                <SmallCard card={spread[0]} label="Passato" />
                <SmallCard card={spread[1]} label="Presente" />
                <SmallCard card={spread[2]} label="Futuro" />
              </div>

              <div className="space-y-3">
                {[{ label: 'Passato', card: spread[0] }, { label: 'Presente', card: spread[1] }, { label: 'Futuro', card: spread[2] }].map(({ label, card }) => (
                  <div key={label} className="border border-white/6 rounded-xl p-3 bg-surface-2/30">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: card.color, boxShadow: `0 0 6px ${card.color}88` }} />
                      <p className="text-[9px] font-semibold tracking-[0.15em] uppercase text-white/40">{label} · {card.name}</p>
                    </div>
                    <p className="text-white/60 font-body text-xs leading-relaxed">{card.meaning}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowSpread(false)}
                className="mt-4 w-full py-2.5 rounded-full border border-white/10 text-white/35 text-sm hover:text-white/55 hover:border-white/20 transition-colors"
              >
                Chiudi spread
              </button>
            </GlowCard>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
