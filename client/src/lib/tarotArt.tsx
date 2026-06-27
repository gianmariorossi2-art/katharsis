import React from 'react';

type IllFn = (c: string, W: number, H: number) => React.ReactNode;

// Helpers
const rays = (cx: number, cy: number, r1: number, r2: number, n: number, c: string, op: number, sw = 1) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i * 2 * Math.PI) / n - Math.PI / 2;
    return <line key={i} x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1} x2={cx + Math.cos(a) * r2} y2={cy + Math.sin(a) * r2} stroke={c} strokeWidth={sw} opacity={op} />;
  });

const stars = (pts: [number, number, number][], c: string) =>
  pts.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={c} opacity={0.35 + i * 0.02} />);

function starPoly(cx: number, cy: number, r1: number, r2: number, n: number, c: string, op: number) {
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const a = (i * Math.PI) / n - Math.PI / 2;
    const r = i % 2 === 0 ? r1 : r2;
    return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(' ');
  return <polygon points={pts} fill={c} opacity={op} />;
}

export const TAROT_ART: Record<number, IllFn> = {
  // 0. Il Matto — cliff, sun, wandering path
  0: (c, W, H) => (
    <>
      {/* Sun top-right */}
      <circle cx={W * 0.8} cy={H * 0.14} r={H * 0.09} fill={c} opacity={0.65} />
      {rays(W * 0.8, H * 0.14, H * 0.1, H * 0.15, 8, c, 0.4)}
      {/* Mountains */}
      <polygon points={`0,${H * 0.82} ${W * 0.28},${H * 0.44} ${W * 0.56},${H * 0.82}`} fill={c} opacity={0.1} />
      <polygon points={`${W * 0.35},${H * 0.82} ${W * 0.65},${H * 0.38} ${W},${H * 0.82}`} fill={c} opacity={0.08} />
      {/* Cliff edge */}
      <path d={`M0,${H * 0.72} L${W * 0.48},${H * 0.72} L${W * 0.48},${H}`} stroke={c} strokeWidth={1.5} fill="none" opacity={0.35} />
      {/* Ground */}
      <rect x={0} y={H * 0.72} width={W * 0.48} height={H * 0.02} fill={c} opacity={0.2} />
      {/* Wandering path dots */}
      {stars([[W*0.12,H*0.88,1.5],[W*0.22,H*0.92,1],[W*0.32,H*0.85,1.5],[W*0.08,H*0.96,1]], c)}
      {/* Wind lines top-left */}
      {[H*0.2, H*0.26, H*0.32].map((y, i) => (
        <path key={i} d={`M${W*0.06},${y} Q${W*0.18},${y-4} ${W*0.3},${y}`} stroke={c} strokeWidth={0.7} fill="none" opacity={0.25} />
      ))}
      {/* Small dog silhouette (bottom-left) */}
      <ellipse cx={W * 0.14} cy={H * 0.76} rx={8} ry={5} fill={c} opacity={0.4} />
      <circle cx={W * 0.2} cy={H * 0.72} r={5} fill={c} opacity={0.4} />
    </>
  ),

  // 1. Il Mago — table, 4 elements, wand beam
  1: (c, W, H) => (
    <>
      {/* Wand beam from top */}
      <line x1={W * 0.72} y1={0} x2={W * 0.72} y2={H * 0.32} stroke={c} strokeWidth={2} opacity={0.5} />
      <circle cx={W * 0.72} cy={H * 0.06} r={6} fill={c} opacity={0.8} />
      {rays(W * 0.72, H * 0.06, 8, 14, 8, c, 0.35, 0.8)}
      {/* Infinity above center */}
      <path d={`M${W/2},${H*0.24} C${W*0.36},${H*0.14} ${W*0.14},${H*0.14} ${W*0.14},${H*0.24} C${W*0.14},${H*0.34} ${W*0.36},${H*0.34} ${W/2},${H*0.24} C${W*0.64},${H*0.14} ${W*0.86},${H*0.14} ${W*0.86},${H*0.24} C${W*0.86},${H*0.34} ${W*0.64},${H*0.34} ${W/2},${H*0.24} Z`} stroke={c} strokeWidth={1.2} fill={c} fillOpacity={0.07} opacity={0.6} />
      {/* Table surface */}
      <rect x={W*0.06} y={H*0.78} width={W*0.88} height={H*0.03} fill={c} opacity={0.35} rx={2} />
      {/* 4 element symbols on table */}
      <rect x={W*0.1} y={H*0.68} width={10} height={10} fill={c} opacity={0.45} rx={1} /> {/* cup */}
      <circle cx={W*0.36} cy={H*0.73} r={6} fill="none" stroke={c} strokeWidth={1.5} opacity={0.45} /> {/* coin */}
      <line x1={W*0.63} y1={H*0.66} x2={W*0.63} y2={H*0.78} stroke={c} strokeWidth={2} opacity={0.45} /> {/* wand */}
      <line x1={W*0.84} y1={H*0.64} x2={W*0.88} y2={H*0.78} stroke={c} strokeWidth={1.5} opacity={0.45} /> {/* sword */}
      <line x1={W*0.8} y1={H*0.71} x2={W*0.92} y2={H*0.71} stroke={c} strokeWidth={1} opacity={0.35} />
      {/* Stars scattered */}
      {stars([[W*0.1,H*0.12,1.5],[W*0.22,H*0.08,1],[W*0.4,H*0.16,2],[W*0.88,H*0.42,1.5]], c)}
    </>
  ),

  // 2. La Sacerdotessa — twin pillars, veil, crescent, stars
  2: (c, W, H) => (
    <>
      {/* Left pillar */}
      <rect x={W*0.04} y={H*0.08} width={W*0.15} height={H*0.78} fill={c} opacity={0.18} rx={2} />
      <rect x={W*0.04} y={H*0.04} width={W*0.15} height={H*0.06} fill={c} opacity={0.28} rx={1} />
      <text x={W*0.115} y={H*0.115} textAnchor="middle" fill={c} opacity={0.55} fontSize={8} fontWeight="bold">B</text>
      {/* Right pillar */}
      <rect x={W*0.81} y={H*0.08} width={W*0.15} height={H*0.78} fill={c} opacity={0.18} rx={2} />
      <rect x={W*0.81} y={H*0.04} width={W*0.15} height={H*0.06} fill={c} opacity={0.28} rx={1} />
      <text x={W*0.885} y={H*0.115} textAnchor="middle" fill={c} opacity={0.55} fontSize={8} fontWeight="bold">J</text>
      {/* Veil curtain */}
      <path d={`M${W*0.19},${H*0.1} Q${W*0.35},${H*0.18} ${W/2},${H*0.1} Q${W*0.65},${H*0.02} ${W*0.81},${H*0.1}`} stroke={c} strokeWidth={0.8} fill="none" opacity={0.3} />
      {/* Crescent moon at feet */}
      <path d={`M${W*0.36},${H*0.82} Q${W/2},${H*0.88} ${W*0.64},${H*0.82}`} stroke={c} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.6} />
      {/* Stars */}
      {stars([[W*0.26,H*0.22,2],[W*0.74,H*0.26,2],[W*0.22,H*0.5,1.5],[W*0.78,H*0.46,1.5],[W*0.5,H*0.06,2.5]], c)}
      {/* Scroll lines at bottom */}
      {[H*0.72, H*0.75, H*0.78].map((y, i) => (
        <line key={i} x1={W*0.3} y1={y} x2={W*0.7} y2={y} stroke={c} strokeWidth={0.6} opacity={0.25} />
      ))}
    </>
  ),

  // 3. L'Imperatrice — crown of stars, wheat, rose garden
  3: (c, W, H) => (
    <>
      {/* Crown of 12 stars at top */}
      {Array.from({length:12},(_,i)=>{
        const a=(i/12)*Math.PI*2 - Math.PI/2;
        return <circle key={i} cx={W/2+Math.cos(a)*W*0.3} cy={H*0.12+Math.sin(a)*H*0.06} r={i%3===0?3:2} fill={c} opacity={i%3===0?0.7:0.4}/>;
      })}
      {/* Scepter */}
      <line x1={W*0.78} y1={H*0.08} x2={W*0.72} y2={H*0.38} stroke={c} strokeWidth={2} opacity={0.45} />
      {starPoly(W*0.79, H*0.07, 6, 3, 6, c, 0.6)}
      {/* Heart / Venus symbol */}
      <path d={`M${W*0.24},${H*0.24} C${W*0.24},${H*0.18} ${W*0.14},${H*0.18} ${W*0.14},${H*0.26} C${W*0.14},${H*0.32} ${W*0.24},${H*0.36} ${W*0.24},${H*0.38} C${W*0.24},${H*0.36} ${W*0.34},${H*0.32} ${W*0.34},${H*0.26} C${W*0.34},${H*0.18} ${W*0.24},${H*0.18} ${W*0.24},${H*0.24} Z`} fill={c} opacity={0.35} />
      {/* Wheat stems along bottom */}
      {[0.12,0.22,0.32,0.68,0.78,0.88].map((x,i)=>(
        <g key={i}>
          <line x1={x*W} y1={H*0.96} x2={x*W} y2={H*0.76} stroke={c} strokeWidth={1} opacity={0.3} />
          <ellipse cx={x*W} cy={H*0.75} rx={3} ry={6} fill={c} opacity={0.3} />
        </g>
      ))}
      {/* Rose dots */}
      {stars([[W*0.18,H*0.82,3],[W*0.35,H*0.86,2.5],[W*0.65,H*0.84,3],[W*0.82,H*0.8,2.5],[W*0.5,H*0.88,3]], c)}
      {/* Forest/nature halo */}
      <circle cx={W/2} cy={H*0.5} r={W*0.4} stroke={c} strokeWidth={0.5} fill="none" opacity={0.12} />
    </>
  ),

  // 4. L'Imperatore — throne, mountains, ram heads
  4: (c, W, H) => (
    <>
      {/* Mountain range */}
      <polygon points={`0,${H*0.9} ${W*0.2},${H*0.55} ${W*0.4},${H*0.9}`} fill={c} opacity={0.12} />
      <polygon points={`${W*0.3},${H*0.9} ${W*0.55},${H*0.46} ${W*0.8},${H*0.9}`} fill={c} opacity={0.09} />
      <polygon points={`${W*0.65},${H*0.9} ${W*0.85},${H*0.58} ${W},${H*0.9}`} fill={c} opacity={0.12} />
      {/* Throne base */}
      <rect x={W*0.22} y={H*0.78} width={W*0.56} height={H*0.06} fill={c} opacity={0.3} rx={1} />
      {/* Throne back */}
      <rect x={W*0.28} y={H*0.32} width={W*0.44} height={H*0.48} fill={c} opacity={0.08} rx={2} />
      {/* Ram head ornaments */}
      <circle cx={W*0.26} cy={H*0.5} r={8} stroke={c} strokeWidth={1.5} fill="none" opacity={0.4} />
      <path d={`M${W*0.2},${H*0.48} Q${W*0.16},${H*0.52} ${W*0.2},${H*0.56}`} stroke={c} strokeWidth={1.2} fill="none" opacity={0.4} /> {/* left horn */}
      <circle cx={W*0.74} cy={H*0.5} r={8} stroke={c} strokeWidth={1.5} fill="none" opacity={0.4} />
      <path d={`M${W*0.8},${H*0.48} Q${W*0.84},${H*0.52} ${W*0.8},${H*0.56}`} stroke={c} strokeWidth={1.2} fill="none" opacity={0.4} /> {/* right horn */}
      {/* Horizontal authority lines */}
      {[H*0.16, H*0.22].map((y,i)=>(
        <line key={i} x1={W*0.1} y1={y} x2={W*0.9} y2={y} stroke={c} strokeWidth={1} opacity={0.2} />
      ))}
      {/* Orb */}
      <circle cx={W*0.36} cy={H*0.64} r={8} stroke={c} strokeWidth={1.5} fill={c} fillOpacity={0.1} opacity={0.5} />
      {/* Scepter */}
      <line x1={W*0.66} y1={H*0.3} x2={W*0.68} y2={H*0.68} stroke={c} strokeWidth={2} opacity={0.4} />
      <polygon points={`${W*0.66},${H*0.3} ${W*0.6},${H*0.38} ${W*0.74},${H*0.38}`} fill={c} opacity={0.4} />
    </>
  ),

  // 5. Il Papa — triple crown, keys, two worshippers
  5: (c, W, H) => (
    <>
      {/* Triple crown (3 stacked tiers) */}
      <rect x={W*0.34} y={H*0.04} width={W*0.32} height={H*0.04} fill={c} opacity={0.55} rx={1} />
      <rect x={W*0.3} y={H*0.08} width={W*0.4} height={H*0.04} fill={c} opacity={0.5} rx={1} />
      <rect x={W*0.26} y={H*0.12} width={W*0.48} height={H*0.04} fill={c} opacity={0.45} rx={1} />
      {/* Crown points */}
      {[0.36,0.5,0.64].map((x,i)=>(
        <polygon key={i} points={`${(x-0.04)*W},${H*0.04} ${x*W},${H*0} ${(x+0.04)*W},${H*0.04}`} fill={c} opacity={0.6} />
      ))}
      {/* Staff */}
      <line x1={W*0.72} y1={H*0.12} x2={W*0.7} y2={H*0.76} stroke={c} strokeWidth={2.5} opacity={0.4} />
      <path d={`M${W*0.64},${H*0.14} Q${W*0.72},${H*0.08} ${W*0.8},${H*0.14}`} stroke={c} strokeWidth={2} fill="none" opacity={0.5} />
      {/* Blessing hand rays */}
      {rays(W*0.42, H*0.26, 12, 22, 6, c, 0.2, 0.8)}
      {/* Two kneeling worshippers */}
      <circle cx={W*0.26} cy={H*0.74} r={6} fill={c} opacity={0.3} />
      <polygon points={`${W*0.26},${H*0.8} ${W*0.18},${H*0.9} ${W*0.34},${H*0.9}`} fill={c} opacity={0.28} />
      <circle cx={W*0.74} cy={H*0.74} r={6} fill={c} opacity={0.3} />
      <polygon points={`${W*0.74},${H*0.8} ${W*0.66},${H*0.9} ${W*0.82},${H*0.9}`} fill={c} opacity={0.28} />
      {/* Crossed keys */}
      <line x1={W*0.38} y1={H*0.86} x2={W*0.52} y2={H*0.98} stroke={c} strokeWidth={2} opacity={0.5} />
      <circle cx={W*0.37} cy={H*0.84} r={5} stroke={c} strokeWidth={1.5} fill="none" opacity={0.5} />
      <line x1={W*0.62} y1={H*0.86} x2={W*0.48} y2={H*0.98} stroke={c} strokeWidth={2} opacity={0.5} />
      <circle cx={W*0.63} cy={H*0.84} r={5} stroke={c} strokeWidth={1.5} fill="none" opacity={0.5} />
    </>
  ),

  // 6. Gli Amanti — angel above, two mountains, sun
  6: (c, W, H) => (
    <>
      {/* Sun top center */}
      <circle cx={W/2} cy={H*0.1} r={H*0.08} fill={c} opacity={0.6} />
      {rays(W/2, H*0.1, H*0.09, H*0.14, 12, c, 0.3, 0.8)}
      {/* Angel wings */}
      <path d={`M${W/2},${H*0.24} Q${W*0.22},${H*0.18} ${W*0.12},${H*0.32} Q${W*0.28},${H*0.28} ${W/2},${H*0.32}`} fill={c} fillOpacity={0.2} stroke={c} strokeWidth={0.8} opacity={0.5} />
      <path d={`M${W/2},${H*0.24} Q${W*0.78},${H*0.18} ${W*0.88},${H*0.32} Q${W*0.72},${H*0.28} ${W/2},${H*0.32}`} fill={c} fillOpacity={0.2} stroke={c} strokeWidth={0.8} opacity={0.5} />
      {/* Two mountains */}
      <polygon points={`${W*0.06},${H*0.9} ${W*0.26},${H*0.62} ${W*0.46},${H*0.9}`} fill={c} opacity={0.15} />
      <polygon points={`${W*0.54},${H*0.9} ${W*0.74},${H*0.58} ${W*0.94},${H*0.9}`} fill={c} opacity={0.12} />
      {/* Flames on left mountain */}
      {[W*0.12, W*0.2, W*0.28].map((x,i)=>(
        <path key={i} d={`M${x},${H*0.88} Q${x+3},${H*0.82} ${x+6},${H*0.88}`} stroke={c} strokeWidth={1} fill="none" opacity={0.35} />
      ))}
      {/* Tree on right */}
      <line x1={W*0.82} y1={H*0.88} x2={W*0.82} y2={H*0.7} stroke={c} strokeWidth={1.5} opacity={0.3} />
      {[H*0.7,H*0.76,H*0.82].map((y,i)=>(
        <line key={i} x1={W*0.74} y1={y} x2={W*0.9} y2={y} stroke={c} strokeWidth={1} opacity={0.25} />
      ))}
      {/* Stars */}
      {stars([[W*0.15,H*0.15,1.5],[W*0.85,H*0.18,1.5],[W*0.08,H*0.38,1],[W*0.92,H*0.35,1]], c)}
    </>
  ),

  // 7. Il Carro — star canopy, sphinxes, city
  7: (c, W, H) => (
    <>
      {/* Star canopy arch */}
      <path d={`M${W*0.06},${H*0.2} Q${W/2},${H*0.04} ${W*0.94},${H*0.2}`} stroke={c} strokeWidth={1.5} fill="none" opacity={0.4} />
      {/* Stars on canopy */}
      {Array.from({length:9},(_,i)=>{
        const t=i/8, x=W*(0.06+t*0.88), yBase=H*0.2, curve=-H*0.16*Math.sin(t*Math.PI);
        return <circle key={i} cx={x} cy={yBase+curve} r={2} fill={c} opacity={0.5}/>;
      })}
      {/* City silhouette */}
      {[{x:0.06,w:0.08,h:0.22},{x:0.16,w:0.06,h:0.18},{x:0.74,w:0.08,h:0.2},{x:0.84,w:0.06,h:0.16}].map((b,i)=>(
        <rect key={i} x={b.x*W} y={(0.88-b.h)*H} width={b.w*W} height={b.h*H} fill={c} opacity={0.15} />
      ))}
      {/* Left sphinx */}
      <ellipse cx={W*0.22} cy={H*0.82} rx={14} ry={8} fill={c} opacity={0.35} />
      <circle cx={W*0.32} cy={H*0.77} r={7} fill={c} opacity={0.35} />
      {/* Right sphinx */}
      <ellipse cx={W*0.78} cy={H*0.82} rx={14} ry={8} fill={c} opacity={0.35} />
      <circle cx={W*0.68} cy={H*0.77} r={7} fill={c} opacity={0.35} />
      {/* Chariot wheels */}
      <circle cx={W*0.3} cy={H*0.72} r={H*0.04} stroke={c} strokeWidth={1.5} fill="none" opacity={0.3} />
      <circle cx={W*0.7} cy={H*0.72} r={H*0.04} stroke={c} strokeWidth={1.5} fill="none" opacity={0.3} />
      {/* Crown/lemniscate */}
      <path d={`M${W/2},${H*0.26} C${W*0.42},${H*0.2} ${W*0.3},${H*0.2} ${W*0.3},${H*0.26} C${W*0.3},${H*0.32} ${W*0.42},${H*0.32} ${W/2},${H*0.26} C${W*0.58},${H*0.2} ${W*0.7},${H*0.2} ${W*0.7},${H*0.26} C${W*0.7},${H*0.32} ${W*0.58},${H*0.32} ${W/2},${H*0.26} Z`} stroke={c} strokeWidth={1} fill={c} fillOpacity={0.08} opacity={0.55} />
    </>
  ),

  // 8. La Forza — infinity, flower garland, lion
  8: (c, W, H) => (
    <>
      {/* Infinity symbol above */}
      <path d={`M${W/2},${H*0.18} C${W*0.36},${H*0.08} ${W*0.14},${H*0.08} ${W*0.14},${H*0.18} C${W*0.14},${H*0.28} ${W*0.36},${H*0.28} ${W/2},${H*0.18} C${W*0.64},${H*0.08} ${W*0.86},${H*0.08} ${W*0.86},${H*0.18} C${W*0.86},${H*0.28} ${W*0.64},${H*0.28} ${W/2},${H*0.18} Z`} stroke={c} strokeWidth={1.5} fill={c} fillOpacity={0.07} opacity={0.65} />
      {/* Lion body (right side) */}
      <ellipse cx={W*0.74} cy={H*0.74} rx={22} ry={14} fill={c} opacity={0.28} />
      {/* Lion head */}
      <circle cx={W*0.72} cy={H*0.62} r={12} fill={c} opacity={0.2} />
      <circle cx={W*0.72} cy={H*0.62} r={17} fill={c} opacity={0.1} /> {/* mane */}
      {/* Lion face */}
      <circle cx={W*0.68} cy={H*0.61} r={1.5} fill={c} opacity={0.4} />
      <circle cx={W*0.76} cy={H*0.61} r={1.5} fill={c} opacity={0.4} />
      {/* Flower garland */}
      {Array.from({length:10},(_,i)=>{
        const t=i/9;
        const x=W*(0.08+t*0.84);
        const y=H*(0.36-Math.sin(t*Math.PI)*0.06);
        return <circle key={i} cx={x} cy={y} r={3.5} fill={c} opacity={0.35}/>;
      })}
      {/* Mountain */}
      <polygon points={`${W*0.06},${H*0.92} ${W*0.22},${H*0.66} ${W*0.38},${H*0.92}`} fill={c} opacity={0.1} />
      {/* Stars */}
      {stars([[W*0.1,H*0.12,1.5],[W*0.86,H*0.1,1.5],[W*0.08,H*0.48,1],[W*0.9,H*0.44,1]], c)}
    </>
  ),

  // 9. L'Eremita — mountain peak, lantern, single star
  9: (c, W, H) => (
    <>
      {/* Dark mountain peak */}
      <polygon points={`0,${H} ${W*0.06},${H} ${W/2},${H*0.28} ${W*0.94},${H} ${W},${H}`} fill={c} opacity={0.1} />
      {/* Snowfield */}
      <polygon points={`${W*0.3},${H*0.48} ${W/2},${H*0.28} ${W*0.7},${H*0.48}`} fill={c} opacity={0.08} />
      {/* Single bright star top center */}
      {starPoly(W/2, H*0.1, 10, 4, 8, c, 0.7)}
      {rays(W/2, H*0.1, 12, 22, 8, c, 0.25, 0.8)}
      {/* Lantern glow (upper right) */}
      <circle cx={W*0.7} cy={H*0.42} r={H*0.06} fill={c} opacity={0.15} />
      <circle cx={W*0.7} cy={H*0.42} r={H*0.03} fill={c} opacity={0.45} />
      <rect x={W*0.67} y={H*0.44} width={W*0.06} height={H*0.06} fill={c} opacity={0.35} rx={1} />
      {/* Staff */}
      <line x1={W*0.65} y1={H*0.3} x2={W*0.68} y2={H*0.78} stroke={c} strokeWidth={2} opacity={0.35} />
      {/* Darkness/fog atmosphere */}
      <circle cx={W/2} cy={H*0.6} r={W*0.35} fill="none" stroke={c} strokeWidth={0.5} opacity={0.08} />
      {/* Small distant stars */}
      {stars([[W*0.14,H*0.18,1],[W*0.28,H*0.12,1.5],[W*0.82,H*0.22,1],[W*0.9,H*0.14,1.2]], c)}
      {/* Cloak shadow */}
      <polygon points={`${W*0.42},${H*0.38} ${W*0.28},${H*0.78} ${W*0.56},${H*0.78}`} fill={c} opacity={0.12} />
    </>
  ),

  // 10. La Ruota — large wheel dominant
  10: (c, W, H) => (
    <>
      {/* Wheel */}
      <circle cx={W/2} cy={H*0.5} r={W*0.42} stroke={c} strokeWidth={2} fill={c} fillOpacity={0.05} opacity={0.5} />
      <circle cx={W/2} cy={H*0.5} r={W*0.32} stroke={c} strokeWidth={1} fill="none" opacity={0.35} />
      <circle cx={W/2} cy={H*0.5} r={W*0.1} stroke={c} strokeWidth={1.5} fill={c} fillOpacity={0.15} opacity={0.5} />
      {/* 8 spokes */}
      {rays(W/2, H*0.5, W*0.1, W*0.42, 8, c, 0.3, 1)}
      {/* TARO text on rim */}
      {['T','A','R','O'].map((letter, i) => {
        const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
        const r = W * 0.24;
        return <text key={i} x={W/2 + Math.cos(a) * r} y={H*0.5 + Math.sin(a) * r + 3} textAnchor="middle" fill={c} opacity={0.55} fontSize={9} fontWeight="bold">{letter}</text>;
      })}
      {/* Sphinx on top */}
      <ellipse cx={W/2} cy={H*0.07} rx={12} ry={7} fill={c} opacity={0.4} />
      <circle cx={W/2} cy={H*0.03} r={6} fill={c} opacity={0.4} />
      {/* Snake descending left */}
      <path d={`M${W*0.1},${H*0.18} Q${W*0.06},${H*0.36} ${W*0.1},${H*0.5} Q${W*0.14},${H*0.64} ${W*0.1},${H*0.78}`} stroke={c} strokeWidth={1.5} fill="none" opacity={0.4} />
      {/* Figure ascending right */}
      <path d={`M${W*0.9},${H*0.78} Q${W*0.86},${H*0.64} ${W*0.9},${H*0.5} Q${W*0.94},${H*0.36} ${W*0.9},${H*0.22}`} stroke={c} strokeWidth={1.5} fill="none" opacity={0.35} />
    </>
  ),

  // 11. La Giustizia — scales, sword, pillars
  11: (c, W, H) => (
    <>
      {/* Pillars */}
      <rect x={W*0.04} y={H*0.12} width={W*0.1} height={H*0.78} fill={c} opacity={0.15} rx={2} />
      <rect x={W*0.86} y={H*0.12} width={W*0.1} height={H*0.78} fill={c} opacity={0.15} rx={2} />
      {/* Sword (vertical, upper right area) */}
      <line x1={W*0.76} y1={H*0.06} x2={W*0.76} y2={H*0.52} stroke={c} strokeWidth={2.5} opacity={0.5} />
      <line x1={W*0.68} y1={H*0.2} x2={W*0.84} y2={H*0.2} stroke={c} strokeWidth={1.5} opacity={0.4} /> {/* crossguard */}
      <circle cx={W*0.76} cy={H*0.04} r={4} fill={c} opacity={0.5} />
      {/* Scale beam */}
      <line x1={W*0.18} y1={H*0.44} x2={W*0.66} y2={H*0.44} stroke={c} strokeWidth={2} opacity={0.4} />
      <circle cx={W*0.42} cy={H*0.44} r={4} fill={c} opacity={0.4} /> {/* pivot */}
      {/* Left pan */}
      <line x1={W*0.18} y1={H*0.44} x2={W*0.18} y2={H*0.56} stroke={c} strokeWidth={1} opacity={0.35} />
      <path d={`M${W*0.1},${H*0.56} Q${W*0.18},${H*0.6} ${W*0.26},${H*0.56}`} stroke={c} strokeWidth={1.5} fill={c} fillOpacity={0.08} opacity={0.45} />
      {/* Right pan */}
      <line x1={W*0.66} y1={H*0.44} x2={W*0.66} y2={H*0.56} stroke={c} strokeWidth={1} opacity={0.35} />
      <path d={`M${W*0.58},${H*0.56} Q${W*0.66},${H*0.6} ${W*0.74},${H*0.56}`} stroke={c} strokeWidth={1.5} fill={c} fillOpacity={0.08} opacity={0.45} />
      {/* Crown */}
      {[0.38,0.5,0.62].map((x,i)=>(
        <polygon key={i} points={`${(x-0.04)*W},${H*0.12} ${x*W},${H*0.06} ${(x+0.04)*W},${H*0.12}`} fill={c} opacity={0.45} />
      ))}
      <rect x={W*0.3} y={H*0.12} width={W*0.4} height={H*0.03} fill={c} opacity={0.4} rx={1} />
      {/* Stars */}
      {stars([[W*0.2,H*0.22,1.5],[W*0.82,H*0.28,1.5],[W*0.14,H*0.68,1]], c)}
    </>
  ),

  // 12. L'Appeso — tau cross, inverted, halo drops
  12: (c, W, H) => (
    <>
      {/* Tau cross / tree */}
      <line x1={W/2} y1={H*0.06} x2={W/2} y2={H*0.38} stroke={c} strokeWidth={3} opacity={0.45} />
      <line x1={W*0.22} y1={H*0.18} x2={W*0.78} y2={H*0.18} stroke={c} strokeWidth={3} opacity={0.45} />
      {/* Root extensions */}
      <line x1={W*0.22} y1={H*0.18} x2={W*0.14} y2={H*0.1} stroke={c} strokeWidth={1.5} opacity={0.3} />
      <line x1={W*0.22} y1={H*0.18} x2={W*0.12} y2={H*0.26} stroke={c} strokeWidth={1.5} opacity={0.3} />
      <line x1={W*0.78} y1={H*0.18} x2={W*0.86} y2={H*0.1} stroke={c} strokeWidth={1.5} opacity={0.3} />
      <line x1={W*0.78} y1={H*0.18} x2={W*0.88} y2={H*0.26} stroke={c} strokeWidth={1.5} opacity={0.3} />
      {/* Hanging rope */}
      <line x1={W/2} y1={H*0.38} x2={W*0.52} y2={H*0.5} stroke={c} strokeWidth={1} opacity={0.4} />
      {/* Halo glow (where head hangs) */}
      <circle cx={W*0.5} cy={H*0.74} r={H*0.08} fill={c} opacity={0.12} />
      <circle cx={W*0.5} cy={H*0.74} r={H*0.05} stroke={c} strokeWidth={1} fill="none" opacity={0.4} />
      {/* Hanging figure suggestion */}
      <polygon points={`${W*0.44},${H*0.52} ${W*0.56},${H*0.52} ${W*0.54},${H*0.7} ${W*0.46},${H*0.7}`} fill={c} opacity={0.22} rx={2} />
      {/* Drop shapes below */}
      {[{x:0.36,y:0.82},{x:0.5,y:0.88},{x:0.64,y:0.82}].map((d,i)=>(
        <path key={i} d={`M${d.x*W},${d.y*H} Q${d.x*W-3},${(d.y+0.04)*H} ${d.x*W},${(d.y+0.06)*H} Q${d.x*W+3},${(d.y+0.04)*H} ${d.x*W},${d.y*H} Z`} fill={c} opacity={0.28} />
      ))}
      {/* Scattered dots suggesting enlightenment */}
      {stars([[W*0.2,H*0.42,1.5],[W*0.8,H*0.44,1.5],[W*0.14,H*0.62,1],[W*0.86,H*0.65,1]], c)}
    </>
  ),

  // 13. La Morte — skeleton horse, banner, rising sun
  13: (c, W, H) => (
    <>
      {/* Rising sun (just the arc) */}
      {rays(W/2, H*0.88, H*0.12, H*0.26, 10, c, 0.25, 1)}
      <path d={`M${W*0.06},${H*0.88} Q${W/2},${H*0.56} ${W*0.94},${H*0.88}`} stroke={c} strokeWidth={1.5} fill={c} fillOpacity={0.06} opacity={0.4} />
      {/* Two towers framing horizon */}
      <rect x={W*0.06} y={H*0.56} width={W*0.1} height={H*0.3} fill={c} opacity={0.18} rx={1} />
      <rect x={W*0.84} y={H*0.56} width={W*0.1} height={H*0.3} fill={c} opacity={0.18} rx={1} />
      {/* Banner / flag */}
      <line x1={W*0.58} y1={H*0.08} x2={W*0.56} y2={H*0.42} stroke={c} strokeWidth={2} opacity={0.5} />
      <path d={`M${W*0.58},${H*0.1} L${W*0.82},${H*0.18} L${W*0.58},${H*0.26} Z`} fill={c} fillOpacity={0.18} stroke={c} strokeWidth={1} opacity={0.4} />
      {/* White rose on banner */}
      <circle cx={W*0.7} cy={H*0.18} r={4} stroke={c} strokeWidth={1} fill="none" opacity={0.55} />
      {/* Horse silhouette */}
      <ellipse cx={W*0.42} cy={H*0.68} rx={26} ry={14} fill={c} opacity={0.3} />
      <polygon points={`${W*0.54},${H*0.56} ${W*0.6},${H*0.42} ${W*0.52},${H*0.42} ${W*0.46},${H*0.56}`} fill={c} opacity={0.28} /> {/* neck */}
      <circle cx={W*0.6} cy={H*0.4} r={9} fill={c} opacity={0.28} /> {/* head */}
      {/* Skull hint on rider */}
      <circle cx={W*0.44} cy={H*0.44} r={8} stroke={c} strokeWidth={1} fill="none" opacity={0.3} />
      {/* Fallen crown */}
      <path d={`M${W*0.22},${H*0.78} L${W*0.26},${H*0.74} L${W*0.3},${H*0.78} L${W*0.34},${H*0.74} L${W*0.38},${H*0.78}`} stroke={c} strokeWidth={1.5} fill="none" opacity={0.4} />
    </>
  ),

  // 14. La Temperanza — angel, two cups, flowing water
  14: (c, W, H) => (
    <>
      {/* Angel wings */}
      <path d={`M${W/2},${H*0.3} Q${W*0.2},${H*0.22} ${W*0.08},${H*0.4} Q${W*0.24},${H*0.35} ${W/2},${H*0.4}`} fill={c} fillOpacity={0.18} stroke={c} strokeWidth={1} opacity={0.5} />
      <path d={`M${W/2},${H*0.3} Q${W*0.8},${H*0.22} ${W*0.92},${H*0.4} Q${W*0.76},${H*0.35} ${W/2},${H*0.4}`} fill={c} fillOpacity={0.18} stroke={c} strokeWidth={1} opacity={0.5} />
      {/* Sun/crown brow */}
      {starPoly(W*0.42, H*0.22, 7, 3, 8, c, 0.5)}
      {/* Left cup */}
      <path d={`M${W*0.22},${H*0.54} L${W*0.18},${H*0.66} L${W*0.34},${H*0.66} L${W*0.3},${H*0.54} Z`} fill={c} opacity={0.35} />
      {/* Right cup */}
      <path d={`M${W*0.7},${H*0.52} L${W*0.66},${H*0.64} L${W*0.82},${H*0.64} L${W*0.78},${H*0.52} Z`} fill={c} opacity={0.35} />
      {/* Water flow between cups */}
      <path d={`M${W*0.3},${H*0.6} C${W*0.42},${H*0.5} ${W*0.58},${H*0.7} ${W*0.66},${H*0.6}`} stroke={c} strokeWidth={1.5} fill="none" opacity={0.5} />
      {/* Water ripples below */}
      {[H*0.82, H*0.87, H*0.92].map((y,i)=>(
        <path key={i} d={`M${W*0.06},${y} Q${W*0.3},${y-5} ${W/2},${y} Q${W*0.7},${y+5} ${W*0.94},${y}`} stroke={c} strokeWidth={0.7} fill="none" opacity={0.22-i*0.04} />
      ))}
      {/* Path to mountains (iris) */}
      <path d={`M${W*0.44},${H*0.78} L${W*0.44},${H*0.92}`} stroke={c} strokeWidth={1} opacity={0.3} />
      <path d={`M${W*0.56},${H*0.78} L${W*0.56},${H*0.92}`} stroke={c} strokeWidth={1} opacity={0.3} />
      <polygon points={`${W*0.3},${H*0.7} ${W*0.44},${H*0.56} ${W*0.58},${H*0.7}`} fill={c} opacity={0.1} /> {/* mountain */}
      {/* Iris flowers */}
      {[W*0.08,W*0.92].map((x,i)=>(
        <g key={i}>
          <line x1={x} y1={H*0.96} x2={x} y2={H*0.78} stroke={c} strokeWidth={1} opacity={0.3} />
          <path d={`M${x-6},${H*0.8} Q${x},${H*0.72} ${x+6},${H*0.8}`} fill={c} opacity={0.3} />
        </g>
      ))}
    </>
  ),

  // 15. Il Diavolo — pentagram, chains, pedestal
  15: (c, W, H) => (
    <>
      {/* Inverted pentagram */}
      {starPoly(W/2, H*0.2, H*0.14, H*0.06, 5, c, 0.22)}
      <polygon points={Array.from({length:5},(_,i)=>{const a=(i/5)*Math.PI*2+Math.PI/2+Math.PI/5;return`${W/2+Math.cos(a)*H*0.14},${H*0.2+Math.sin(a)*H*0.14}`;}).join(' ')} stroke={c} strokeWidth={1} fill="none" opacity={0.35} />
      {/* Bat wings */}
      <path d={`M${W/2},${H*0.36} Q${W*0.22},${H*0.28} ${W*0.08},${H*0.44} Q${W*0.26},${H*0.4} ${W/2},${H*0.46}`} fill={c} fillOpacity={0.1} stroke={c} strokeWidth={1} opacity={0.35} />
      <path d={`M${W/2},${H*0.36} Q${W*0.78},${H*0.28} ${W*0.92},${H*0.44} Q${W*0.74},${H*0.4} ${W/2},${H*0.46}`} fill={c} fillOpacity={0.1} stroke={c} strokeWidth={1} opacity={0.35} />
      {/* Stone pedestal */}
      <rect x={W*0.3} y={H*0.72} width={W*0.4} height={H*0.06} fill={c} opacity={0.3} rx={1} />
      <rect x={W*0.34} y={H*0.64} width={W*0.32} height={H*0.1} fill={c} opacity={0.2} rx={1} />
      {/* Two chained figures */}
      <circle cx={W*0.26} cy={H*0.78} r={6} stroke={c} strokeWidth={1} fill="none" opacity={0.32} />
      <path d={`M${W*0.26},${H*0.84} L${W*0.26},${H*0.92}`} stroke={c} strokeWidth={1} opacity={0.28} />
      <circle cx={W*0.74} cy={H*0.78} r={6} stroke={c} strokeWidth={1} fill="none" opacity={0.32} />
      <path d={`M${W*0.74},${H*0.84} L${W*0.74},${H*0.92}`} stroke={c} strokeWidth={1} opacity={0.28} />
      {/* Chains */}
      <path d={`M${W*0.26},${H*0.82} Q${W/2},${H*0.78} ${W*0.74},${H*0.82}`} stroke={c} strokeWidth={1.5} fill="none" strokeDasharray="3,2" opacity={0.35} />
      {/* Ring at pedestal base where chains attach */}
      <circle cx={W/2} cy={H*0.74} r={4} stroke={c} strokeWidth={1} fill="none" opacity={0.4} />
    </>
  ),

  // 16. La Torre — lightning, falling figures, flames
  16: (c, W, H) => (
    <>
      {/* Tower body */}
      <rect x={W*0.36} y={H*0.18} width={W*0.28} height={H*0.62} fill={c} opacity={0.15} rx={1} />
      <rect x={W*0.32} y={H*0.16} width={W*0.36} height={H*0.04} fill={c} opacity={0.2} rx={1} /> {/* parapet */}
      {/* Crown on top, being blown off */}
      <path d={`M${W*0.38},${H*0.1} L${W*0.42},${H*0.06} L${W*0.46},${H*0.1} L${W*0.5},${H*0.06} L${W*0.54},${H*0.1}`} stroke={c} strokeWidth={1.5} fill="none" opacity={0.5} />
      {/* Lightning bolt */}
      <path d={`M${W*0.76},${H*0.06} L${W*0.54},${H*0.36} L${W*0.64},${H*0.36} L${W*0.42},${H*0.68} L${W*0.7},${H*0.42} L${W*0.58},${H*0.42} L${W*0.82},${H*0.12} Z`} fill={c} fillOpacity={0.22} stroke={c} strokeWidth={1} opacity={0.6} />
      {/* Flames from window */}
      {[H*0.46,H*0.56,H*0.66].map((y,i)=>(
        <path key={i} d={`M${W*0.36},${y} Q${W*0.3},${y-5} ${W*0.36},${y-8}`} stroke={c} strokeWidth={1.2} fill="none" opacity={0.4} />
      ))}
      {/* Two falling figures */}
      <circle cx={W*0.2} cy={H*0.52} r={6} fill={c} opacity={0.3} />
      <line x1={W*0.2} y1={H*0.58} x2={W*0.14} y2={H*0.72} stroke={c} strokeWidth={1.5} opacity={0.28} />
      <circle cx={W*0.82} cy={H*0.56} r={6} fill={c} opacity={0.3} />
      <line x1={W*0.82} y1={H*0.62} x2={W*0.86} y2={H*0.76} stroke={c} strokeWidth={1.5} opacity={0.28} />
      {/* Spark debris */}
      {stars([[W*0.22,H*0.36,2],[W*0.86,H*0.28,2],[W*0.1,H*0.46,1.5],[W*0.9,H*0.44,1.5],[W*0.28,H*0.28,1.5]], c)}
    </>
  ),

  // 17. La Stella — dominant 8-pointed star, kneeling figure, water
  17: (c, W, H) => (
    <>
      {/* Large central star */}
      {starPoly(W/2, H*0.22, H*0.16, H*0.07, 8, c, 0.65)}
      {rays(W/2, H*0.22, H*0.17, H*0.26, 8, c, 0.2, 0.8)}
      {/* 7 small stars */}
      {[[0.14,0.1],[0.86,0.08],[0.1,0.3],[0.9,0.28],[0.22,0.48],[0.82,0.44],[0.5,0.06]].map(([x,y],i)=>(
        starPoly(x*W, y*H, 5, 2, 8, c, 0.4+i*0.02)
      ))}
      {/* Water pool */}
      <ellipse cx={W/2} cy={H*0.88} rx={W*0.4} ry={H*0.06} fill={c} opacity={0.15} />
      {[H*0.82,H*0.87].map((y,i)=>(
        <path key={i} d={`M${W*0.12},${y} Q${W*0.35},${y-4} ${W/2},${y} Q${W*0.65},${y+4} ${W*0.88},${y}`} stroke={c} strokeWidth={0.8} fill="none" opacity={0.25} />
      ))}
      {/* Two urns/cups pouring */}
      <rect x={W*0.2} y={H*0.6} width={8} height={12} fill={c} opacity={0.3} rx={2} />
      <path d={`M${W*0.24},${H*0.72} Q${W*0.22},${H*0.8} ${W*0.18},${H*0.86}`} stroke={c} strokeWidth={1.2} fill="none" opacity={0.35} />
      <rect x={W*0.72} y={H*0.58} width={8} height={12} fill={c} opacity={0.3} rx={2} />
      <path d={`M${W*0.76},${H*0.7} Q${W*0.78},${H*0.78} ${W*0.82},${H*0.84}`} stroke={c} strokeWidth={1.2} fill="none" opacity={0.35} />
      {/* Tree */}
      <line x1={W*0.9} y1={H*0.96} x2={W*0.9} y2={H*0.76} stroke={c} strokeWidth={1.5} opacity={0.25} />
      <circle cx={W*0.9} cy={H*0.72} r={8} fill={c} opacity={0.15} />
    </>
  ),

  // 18. La Luna — crescent moon, towers, wolf/dog, crayfish, water
  18: (c, W, H) => (
    <>
      {/* Large moon with crescent mask */}
      <defs>
        <mask id="luna18">
          <circle cx={W*0.5} cy={H*0.16} r={H*0.13} fill="white" />
          <circle cx={W*0.56} cy={H*0.16} r={H*0.1} fill="black" />
        </mask>
      </defs>
      <circle cx={W*0.5} cy={H*0.16} r={H*0.13} fill={c} opacity={0.7} mask="url(#luna18)" />
      {/* Moon glow */}
      <circle cx={W*0.5} cy={H*0.16} r={H*0.2} fill={c} opacity={0.06} />
      {/* Two towers */}
      <rect x={W*0.06} y={H*0.44} width={W*0.14} height={H*0.44} fill={c} opacity={0.22} rx={1} />
      <rect x={W*0.06} y={H*0.4} width={W*0.14} height={H*0.05} fill={c} opacity={0.28} rx={1} />
      <rect x={W*0.8} y={H*0.44} width={W*0.14} height={H*0.44} fill={c} opacity={0.22} rx={1} />
      <rect x={W*0.8} y={H*0.4} width={W*0.14} height={H*0.05} fill={c} opacity={0.28} rx={1} />
      {/* Path between towers */}
      <line x1={W*0.2} y1={H*0.92} x2={W*0.8} y2={H*0.92} stroke={c} strokeWidth={1} opacity={0.2} />
      {/* Dog (left) */}
      <circle cx={W*0.26} cy={H*0.76} r={7} fill={c} opacity={0.3} />
      <ellipse cx={W*0.22} cy={H*0.82} rx={9} ry={6} fill={c} opacity={0.28} />
      {/* Wolf (right) */}
      <circle cx={W*0.74} cy={H*0.74} r={8} fill={c} opacity={0.28} />
      <ellipse cx={W*0.78} cy={H*0.81} rx={10} ry={6} fill={c} opacity={0.26} />
      {/* Water ripples */}
      {[H*0.88,H*0.93].map((y,i)=>(
        <path key={i} d={`M${W*0.2},${y} Q${W*0.5},${y-4} ${W*0.8},${y}`} stroke={c} strokeWidth={0.8} fill="none" opacity={0.25} />
      ))}
      {/* Crayfish */}
      <circle cx={W/2} cy={H*0.9} r={5} fill={c} opacity={0.28} />
      <line x1={W*0.44} y1={H*0.9} x2={W*0.38} y2={H*0.86} stroke={c} strokeWidth={1} opacity={0.25} />
      <line x1={W*0.56} y1={H*0.9} x2={W*0.62} y2={H*0.86} stroke={c} strokeWidth={1} opacity={0.25} />
    </>
  ),

  // 19. Il Sole — radiant sun face, child, horse, sunflowers
  19: (c, W, H) => (
    <>
      {/* Sun (dominant, top center) */}
      <circle cx={W/2} cy={H*0.2} r={H*0.14} fill={c} opacity={0.6} />
      {rays(W/2, H*0.2, H*0.15, H*0.26, 16, c, 0.3, 1.2)}
      {/* Sun face dots */}
      <circle cx={W*0.44} cy={H*0.17} r={2} fill="rgba(0,0,0,0.3)" />
      <circle cx={W*0.56} cy={H*0.17} r={2} fill="rgba(0,0,0,0.3)" />
      <path d={`M${W*0.44},${H*0.23} Q${W/2},${H*0.27} ${W*0.56},${H*0.23}`} stroke="rgba(0,0,0,0.25)" strokeWidth={1.5} fill="none" />
      {/* Low wall */}
      <rect x={W*0.08} y={H*0.82} width={W*0.84} height={H*0.04} fill={c} opacity={0.25} rx={1} />
      {/* Sunflowers along wall */}
      {[0.16,0.32,0.68,0.84].map((x,i)=>(
        <g key={i}>
          <line x1={x*W} y1={H*0.82} x2={x*W} y2={H*0.66} stroke={c} strokeWidth={1.5} opacity={0.3} />
          <circle cx={x*W} cy={H*0.64} r={8} fill={c} opacity={0.35} />
          {rays(x*W, H*0.64, 9, 13, 8, c, 0.2, 0.8)}
        </g>
      ))}
      {/* Horse silhouette */}
      <ellipse cx={W/2} cy={H*0.72} rx={24} ry={12} fill={c} opacity={0.25} />
      <polygon points={`${W*0.56},${H*0.62} ${W*0.62},${H*0.5} ${W*0.54},${H*0.5} ${W*0.48},${H*0.62}`} fill={c} opacity={0.22} />
      <circle cx={W*0.62} cy={H*0.48} r={8} fill={c} opacity={0.22} />
      {/* Child figure */}
      <circle cx={W*0.46} cy={H*0.58} r={6} fill={c} opacity={0.4} />
      {/* Red banner */}
      <line x1={W*0.36} y1={H*0.44} x2={W*0.36} y2={H*0.66} stroke={c} strokeWidth={1.5} opacity={0.4} />
      <path d={`M${W*0.36},${H*0.46} L${W*0.54},${H*0.52} L${W*0.36},${H*0.58} Z`} fill={c} opacity={0.3} />
    </>
  ),

  // 20. Il Giudizio — angel, trumpet, rising figures, waves
  20: (c, W, H) => (
    <>
      {/* Angel body */}
      <circle cx={W/2} cy={H*0.14} r={H*0.06} fill={c} opacity={0.55} />
      {/* Angel wings */}
      <path d={`M${W/2},${H*0.18} Q${W*0.2},${H*0.1} ${W*0.06},${H*0.28} Q${W*0.24},${H*0.24} ${W/2},${H*0.3}`} fill={c} fillOpacity={0.2} stroke={c} strokeWidth={1} opacity={0.55} />
      <path d={`M${W/2},${H*0.18} Q${W*0.8},${H*0.1} ${W*0.94},${H*0.28} Q${W*0.76},${H*0.24} ${W/2},${H*0.3}`} fill={c} fillOpacity={0.2} stroke={c} strokeWidth={1} opacity={0.55} />
      {/* Trumpet */}
      <line x1={W/2} y1={H*0.22} x2={W*0.62} y2={H*0.38} stroke={c} strokeWidth={2.5} opacity={0.5} />
      <path d={`M${W*0.6},${H*0.36} L${W*0.72},${H*0.32} L${W*0.72},${H*0.44} L${W*0.6},${H*0.4} Z`} fill={c} opacity={0.35} />
      {/* Sound waves */}
      {[H*0.08,H*0.14,H*0.2].map((_offset,i)=>(
        <path key={i} d={`M${W*0.66},${H*0.36-i*5} Q${W*0.8},${H*0.3-i*5} ${W*0.94},${H*0.36-i*5}`} stroke={c} strokeWidth={0.8} fill="none" opacity={0.3-i*0.05} />
      ))}
      {/* Banner from trumpet */}
      <rect x={W*0.54} y={H*0.24} width={W*0.16} height={H*0.08} fill={c} opacity={0.2} stroke={c} strokeWidth={0.8} />
      <line x1={W*0.62} y1={H*0.2} x2={W*0.62} y2={H*0.24} stroke={c} strokeWidth={1} opacity={0.3} />
      {/* Waves */}
      {[H*0.78,H*0.84].map((y,i)=>(
        <path key={i} d={`M${W*0.04},${y} Q${W*0.28},${y-6} ${W/2},${y} Q${W*0.72},${y+6} ${W*0.96},${y}`} stroke={c} strokeWidth={0.8} fill="none" opacity={0.25} />
      ))}
      {/* Rising figures from coffins */}
      {[W*0.22,W*0.5,W*0.78].map((x,i)=>(
        <g key={i}>
          <rect x={x-10} y={H*0.82} width={20} height={H*0.08} stroke={c} strokeWidth={1} fill="none" opacity={0.25} />
          <circle cx={x} cy={H*0.76} r={6} fill={c} opacity={0.3} />
          <line x1={x} y1={H*0.82} x2={x} y2={H*0.76} stroke={c} strokeWidth={1} opacity={0.25} />
        </g>
      ))}
    </>
  ),

  // 21. Il Mondo — oval wreath, dancing figure hint, 4 creatures
  21: (c, W, H) => (
    <>
      {/* Laurel wreath (ellipse frame) */}
      <ellipse cx={W/2} cy={H*0.5} rx={W*0.38} ry={H*0.42} stroke={c} strokeWidth={3} fill="none" opacity={0.35} />
      <ellipse cx={W/2} cy={H*0.5} rx={W*0.36} ry={H*0.4} stroke={c} strokeWidth={1} fill="none" opacity={0.2} />
      {/* Leaf dots on wreath */}
      {Array.from({length:18},(_,i)=>{
        const a=(i/18)*Math.PI*2;
        const rx=W*0.38, ry=H*0.42;
        return <circle key={i} cx={W/2+Math.cos(a)*rx} cy={H*0.5+Math.sin(a)*ry} r={3.5} fill={c} opacity={0.3}/>;
      })}
      {/* Dancing figure (inside wreath) */}
      <circle cx={W/2} cy={H*0.4} r={7} fill={c} opacity={0.4} /> {/* head */}
      <ellipse cx={W/2} cy={H*0.54} rx={8} ry={14} fill={c} opacity={0.25} />
      {/* Two wands / scepters */}
      <line x1={W*0.36} y1={H*0.36} x2={W*0.38} y2={H*0.54} stroke={c} strokeWidth={1.5} opacity={0.4} />
      <line x1={W*0.64} y1={H*0.36} x2={W*0.62} y2={H*0.54} stroke={c} strokeWidth={1.5} opacity={0.4} />
      {/* Four creatures at corners */}
      {[{x:0.08,y:0.08,s:'☁'},{x:0.82,y:0.08,s:'☁'},{x:0.08,y:0.82,s:'☁'},{x:0.82,y:0.82,s:'☁'}].map(({x,y},i)=>(
        <rect key={i} x={x*W} y={y*H} width={14} height={14} fill={c} opacity={0.18} rx={2} />
      ))}
      {/* Corner symbols (angel/eagle/lion/bull) */}
      {[{x:0.1,y:0.12,t:'♈'},{x:0.88,y:0.12,t:'♌'},{x:0.1,y:0.9,t:'♏'},{x:0.88,y:0.9,t:'♉'}].map(({x,y,t},i)=>(
        <text key={i} x={x*W} y={y*H+3} textAnchor="middle" fill={c} opacity={0.45} fontSize={9}>{t}</text>
      ))}
      {/* Scattered celebration dots */}
      {stars([[W*0.5,H*0.06,2],[W*0.08,H*0.5,1.5],[W*0.92,H*0.5,1.5],[W*0.5,H*0.95,2]], c)}
    </>
  ),
};
