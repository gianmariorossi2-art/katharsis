/**
 * Natal chart calculation — Jean Meeus "Astronomical Algorithms" 2nd ed.
 * Accuracy: Sun ±0.01°, Moon ±0.5°, Planets ±1°, ASC/MC ±0.2°
 * House system: Placidus (equal house fallback for |lat| > 65°)
 */

export interface PlanetPos {
  lon: number;        // ecliptic longitude 0-360°
  sign: string;
  signIndex: number;  // 0=Ariete...11=Pesci
  degrees: string;    // "15°22'"
  casa: number;       // 1-12
}

export interface NatalChartData {
  sole: PlanetPos;
  luna: PlanetPos;
  mercurio: PlanetPos;
  venere: PlanetPos;
  marte: PlanetPos;
  giove: PlanetPos;
  saturno: PlanetPos;
  urano: PlanetPos;
  nettuno: PlanetPos;
  plutone: PlanetPos;
  ascendente: { lon: number; sign: string; degrees: string };
  medio_cielo: { lon: number; sign: string; degrees: string };
  nodo_nord: PlanetPos;
  chirone: PlanetPos;
  elemento_dominante: string;
  pianeta_dominante: string;
  configurazione_principale: string | null;
  house_cusps: number[];
}

const SIGNS = ['Ariete','Toro','Gemelli','Cancro','Leone','Vergine',
               'Bilancia','Scorpione','Sagittario','Capricorno','Acquario','Pesci'];
const ELEMENTS = { Ariete:'Fuoco',Leone:'Fuoco',Sagittario:'Fuoco',
                   Toro:'Terra',Vergine:'Terra',Capricorno:'Terra',
                   Gemelli:'Aria',Bilancia:'Aria',Acquario:'Aria',
                   Cancro:'Acqua',Scorpione:'Acqua',Pesci:'Acqua' } as Record<string,string>;

const RAD = Math.PI / 180;

function r(d: number) { return d * RAD; }
function d(rad: number) { return rad / RAD; }
function norm(deg: number) { return ((deg % 360) + 360) % 360; }

// ─── Julian Day ──────────────────────────────────────────────────────────────

export function julianDay(year: number, month: number, day: number, utHours = 12): number {
  let y = year, m = month;
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + utHours / 24 + B - 1524.5;
}

// ─── Kepler's equation ────────────────────────────────────────────────────────

function keplerE(M_rad: number, e: number): number {
  let E = M_rad;
  for (let i = 0; i < 50; i++) {
    const dE = (M_rad - E + e * Math.sin(E)) / (1 - e * Math.cos(E));
    E += dE;
    if (Math.abs(dE) < 1e-10) break;
  }
  return E;
}

function trueAnomaly(M_deg: number, e: number): number {
  const M_rad = r(norm(M_deg));
  const E = keplerE(M_rad, e);
  const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
  return norm(d(nu));
}

// ─── Orbital elements at J2000.0 ─────────────────────────────────────────────
// L0: mean longitude (°), n: daily motion (°/day), w: perihelion lon (°),
// e: eccentricity, a: semi-major axis (AU)

const ORBS: Record<string, { L0: number; n: number; w: number; e: number; a: number }> = {
  Mercury: { L0: 252.250906, n: 4.092377,  w:  77.456119, e: 0.205631750, a: 0.387098 },
  Venus:   { L0: 181.979801, n: 1.602132,  w: 131.563703, e: 0.006773230, a: 0.723330 },
  Earth:   { L0: 100.464457, n: 0.985600,  w: 102.937348, e: 0.016710220, a: 1.000000 },
  Mars:    { L0: 355.433000, n: 0.524071,  w: 336.060234, e: 0.093412330, a: 1.523689 },
  Jupiter: { L0:  34.351519, n: 0.083086,  w:  14.331207, e: 0.048392660, a: 5.202603 },
  Saturn:  { L0:  50.077444, n: 0.033460,  w:  92.431773, e: 0.054150600, a: 9.536675 },
  Uranus:  { L0: 314.055005, n: 0.011768,  w: 170.954175, e: 0.047167710, a:19.218446 },
  Neptune: { L0: 304.348665, n: 0.006020,  w:  44.971135, e: 0.008585870, a:30.110387 },
  Pluto:   { L0: 238.928524, n: 0.003963,  w: 224.068960, e: 0.248807660, a:39.482117 },
};

function helioLonDist(planet: string, jd: number): { lon: number; r: number } {
  const el = ORBS[planet];
  const dd = jd - 2451545.0;
  const L = norm(el.L0 + el.n * dd);
  const M = norm(L - el.w);
  const nu = trueAnomaly(M, el.e);
  const lon = norm(nu + el.w);
  const E_rad = keplerE(r(norm(M)), el.e);
  return { lon, r: el.a * (1 - el.e * Math.cos(E_rad)) };
}

function geocentricLon(p: { lon: number; r: number }, earth: { lon: number; r: number }): number {
  const px = p.r * Math.cos(r(p.lon)), py = p.r * Math.sin(r(p.lon));
  const ex = earth.r * Math.cos(r(earth.lon)), ey = earth.r * Math.sin(r(earth.lon));
  return norm(d(Math.atan2(py - ey, px - ex)));
}

// ─── Planet positions ─────────────────────────────────────────────────────────

function sunLon(jd: number): number {
  const n = jd - 2451545.0;
  const L = norm(280.460 + 0.9856474 * n);
  const g = norm(357.528 + 0.9856003 * n);
  return norm(L + 1.9148 * Math.sin(r(g)) + 0.0200 * Math.sin(r(2*g)) + 0.0003 * Math.sin(r(3*g)));
}

function moonLon(jd: number): number {
  const n = jd - 2451545.0;
  const L_  = norm(218.3164477 + 13.17639502 * n);
  const M   = norm(357.5291092 +  0.98560028 * n);
  const Mp  = norm(134.9633964 + 13.06499295 * n);
  const D   = norm(297.8501921 + 12.19074912 * n);
  const F   = norm( 93.2720950 + 13.22935024 * n);
  return norm(L_
    + 6.289*Math.sin(r(Mp))
    - 1.274*Math.sin(r(Mp-2*D))
    + 0.658*Math.sin(r(2*D))
    - 0.186*Math.sin(r(M))
    - 0.059*Math.sin(r(2*Mp-2*D))
    - 0.057*Math.sin(r(Mp-2*D+M))
    + 0.053*Math.sin(r(Mp+2*D))
    + 0.046*Math.sin(r(2*D-M))
    + 0.041*Math.sin(r(Mp-M))
    - 0.035*Math.sin(r(D))
    - 0.031*Math.sin(r(Mp+M))
    - 0.015*Math.sin(r(2*F-2*D))
    + 0.011*Math.sin(r(Mp-4*D)));
}

// Mean North Node (Rahu)
function northNodeLon(jd: number): number {
  return norm(125.0445479 - 0.0529539297 * (jd - 2451545.0));
}

// Chiron approximate ephemeris — orbital period ~50.45 yr
// At J2000.0: Chiron was ~Sagittarius 11° = 251°
// Perihelion 1996-02-14, at that date ~Libra 9° = 189°
function chironLon(jd: number): number {
  const n = jd - 2451545.0;
  return norm(251.0 + 0.01957 * n); // ~50.45yr period → 0.01957°/day
}

// ─── Obliquity & Sidereal Time ────────────────────────────────────────────────

function obliquity(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 23.439291111 - 0.013004167*T - 0.0000001639*T*T + 0.0000005036*T*T*T;
}

function gmst(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return norm(100.4606184 + 36000.77004*T + 0.000387933*T*T - T*T*T/38710000);
}

// ─── MC and Ascendant ─────────────────────────────────────────────────────────

function calcMC(ramc: number, eps: number): number {
  return norm(d(Math.atan2(Math.sin(r(ramc)), Math.cos(r(ramc)) * Math.cos(r(eps)))));
}

function calcASC(ramc: number, eps: number, lat: number): number {
  const x = Math.cos(r(ramc));
  const y = Math.cos(r(eps)) * Math.sin(r(ramc)) + Math.sin(r(eps)) * Math.tan(r(lat));
  return norm(d(Math.atan2(-x, y)));
}

// ─── Placidus Houses ──────────────────────────────────────────────────────────

function eclipticFromOA(OA_deg: number, eps_rad: number, phi_rad: number): number {
  const OA_r = r(OA_deg);
  let lambda = OA_deg;
  for (let i = 0; i < 50; i++) {
    const lam_r = r(lambda);
    const delta = Math.asin(Math.sin(eps_rad) * Math.sin(lam_r));
    const ra = Math.atan2(Math.sin(lam_r) * Math.cos(eps_rad), Math.cos(lam_r));
    const sinAD = Math.tan(delta) * Math.tan(phi_rad);
    const AD = Math.abs(sinAD) <= 1 ? Math.asin(sinAD) : (sinAD > 0 ? Math.PI/2 : -Math.PI/2);
    const OA_calc = ra - AD;
    const diff = OA_r - OA_calc;
    lambda = norm(lambda + d(diff));
    if (Math.abs(d(diff)) < 0.0001) break;
  }
  return lambda;
}

function calcPlacidusHouses(ramc: number, eps: number, lat: number, mc: number, asc: number): number[] {
  if (Math.abs(lat) > 65) {
    // Equal house fallback for extreme latitudes
    const h = Array.from({length: 12}, (_, i) => norm(asc + i * 30));
    h[9] = mc; h[3] = norm(mc + 180);
    return h;
  }
  const eps_r = r(eps), phi_r = r(lat);
  const h11 = eclipticFromOA(norm(ramc + 30),  eps_r, phi_r);
  const h12 = eclipticFromOA(norm(ramc + 60),  eps_r, phi_r);
  const h2  = eclipticFromOA(norm(ramc + 120), eps_r, phi_r);
  const h3  = eclipticFromOA(norm(ramc + 150), eps_r, phi_r);
  return [
    asc,               // 1
    h2,                // 2
    h3,                // 3
    norm(mc + 180),    // 4 (IC)
    norm(h11 + 180),   // 5
    norm(h12 + 180),   // 6
    norm(asc + 180),   // 7 (DSC)
    norm(h2 + 180),    // 8
    norm(h3 + 180),    // 9
    mc,                // 10 (MC)
    h11,               // 11
    h12,               // 12
  ];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lonToSign(lon: number): { sign: string; signIndex: number; degrees: string } {
  const idx = Math.floor(norm(lon) / 30);
  const deg = norm(lon) % 30;
  const min = Math.floor((deg % 1) * 60);
  return {
    sign: SIGNS[idx],
    signIndex: idx,
    degrees: `${Math.floor(deg)}°${String(min).padStart(2,'0')}'`,
  };
}

function houseOf(lon: number, cusps: number[]): number {
  const l = norm(lon);
  for (let i = 0; i < 12; i++) {
    const c = cusps[i];
    const next = cusps[(i + 1) % 12];
    if (next > c) {
      if (l >= c && l < next) return i + 1;
    } else {
      if (l >= c || l < next) return i + 1;
    }
  }
  return 1;
}

function dominantElement(planets: { sign: string; weight: number }[]): string {
  const counts: Record<string, number> = { Fuoco: 0, Terra: 0, Aria: 0, Acqua: 0 };
  for (const p of planets) {
    const el = ELEMENTS[p.sign];
    if (el) counts[el] += p.weight;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function dominantPlanet(data: NatalChartData): string {
  // Planet is dominant if: in angular house (1,4,7,10), conjunct ASC or MC
  const angularHouses = new Set([1, 4, 7, 10]);
  const scores: Record<string, number> = {
    sole: 0, luna: 0, mercurio: 0, venere: 0, marte: 0,
    giove: 0, saturno: 0, urano: 0, nettuno: 0, plutone: 0,
  };
  const planets: [string, PlanetPos][] = [
    ['sole', data.sole], ['luna', data.luna], ['mercurio', data.mercurio],
    ['venere', data.venere], ['marte', data.marte], ['giove', data.giove],
    ['saturno', data.saturno], ['urano', data.urano], ['nettuno', data.nettuno],
    ['plutone', data.plutone],
  ];
  for (const [name, pos] of planets) {
    if (angularHouses.has(pos.casa)) scores[name] += 4;
    // Conjunct ASC or MC (within 8°)
    const diffASC = Math.abs(norm(pos.lon - data.ascendente.lon + 180) - 180);
    const diffMC  = Math.abs(norm(pos.lon - data.medio_cielo.lon + 180) - 180);
    if (diffASC < 8) scores[name] += 3;
    if (diffMC  < 8) scores[name] += 3;
  }
  const IT: Record<string, string> = {
    sole:'Sole', luna:'Luna', mercurio:'Mercurio', venere:'Venere',
    marte:'Marte', giove:'Giove', saturno:'Saturno',
    urano:'Urano', nettuno:'Nettuno', plutone:'Plutone',
  };
  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return IT[top] || 'Sole';
}

function detectConfiguration(data: NatalChartData): string | null {
  const lons = [
    data.sole.lon, data.luna.lon, data.mercurio.lon, data.venere.lon,
    data.marte.lon, data.giove.lon, data.saturno.lon,
  ];
  // Stellium: 3+ planets within 10° of a sign (30° span)
  const signCounts: Record<number, number> = {};
  for (const l of lons) {
    const s = Math.floor(norm(l) / 30);
    signCounts[s] = (signCounts[s] || 0) + 1;
    if (signCounts[s] >= 3) return `Stellium in ${SIGNS[s]}`;
  }
  // Grand Trine: 3 planets mutually within 8° of 120° separation
  for (let a = 0; a < lons.length; a++) {
    for (let b = a+1; b < lons.length; b++) {
      for (let c = b+1; c < lons.length; c++) {
        const ab = Math.abs(norm(lons[a]-lons[b]+180)-180);
        const bc = Math.abs(norm(lons[b]-lons[c]+180)-180);
        const ca = Math.abs(norm(lons[c]-lons[a]+180)-180);
        if (Math.abs(ab-120)<8 && Math.abs(bc-120)<8 && Math.abs(ca-120)<8) return 'Grand Trigono';
      }
    }
  }
  return null;
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export function calculateNatalChart(
  birthDate: string,   // "YYYY-MM-DD"
  birthTime: string,   // "HH:MM" or "12:00"
  lat: number,
  lon: number,
): NatalChartData {
  const [y, mo, day] = birthDate.split('-').map(Number);
  const [h, m] = (birthTime || '12:00').split(':').map(Number);
  const utHours = h + m / 60;

  const jd = julianDay(y, mo, day, utHours);
  const eps = obliquity(jd);
  const lst = norm(gmst(jd) + lon); // Local Sidereal Time = RAMC

  // MC and ASC
  const mc_lon  = calcMC(lst, eps);
  const asc_lon = calcASC(lst, eps, lat);

  // House cusps (Placidus)
  const cusps = calcPlacidusHouses(lst, eps, lat, mc_lon, asc_lon);

  // Earth position (heliocentric)
  const earth = helioLonDist('Earth', jd);

  // Planetary geocentric longitudes
  const planetsGeo: Record<string, number> = {
    Mercurio: geocentricLon(helioLonDist('Mercury', jd), earth),
    Venere:   geocentricLon(helioLonDist('Venus',   jd), earth),
    Marte:    geocentricLon(helioLonDist('Mars',    jd), earth),
    Giove:    geocentricLon(helioLonDist('Jupiter', jd), earth),
    Saturno:  geocentricLon(helioLonDist('Saturn',  jd), earth),
    Urano:    geocentricLon(helioLonDist('Uranus',  jd), earth),
    Nettuno:  geocentricLon(helioLonDist('Neptune', jd), earth),
    Plutone:  geocentricLon(helioLonDist('Pluto',   jd), earth),
  };

  function makePos(lonDeg: number): PlanetPos {
    const { sign, signIndex, degrees } = lonToSign(lonDeg);
    return { lon: lonDeg, sign, signIndex, degrees, casa: houseOf(lonDeg, cusps) };
  }

  const sunL  = sunLon(jd);
  const moonL = moonLon(jd);
  const nnL   = northNodeLon(jd);
  const chL   = chironLon(jd);

  const data: NatalChartData = {
    sole:     makePos(sunL),
    luna:     makePos(moonL),
    mercurio: makePos(planetsGeo.Mercurio),
    venere:   makePos(planetsGeo.Venere),
    marte:    makePos(planetsGeo.Marte),
    giove:    makePos(planetsGeo.Giove),
    saturno:  makePos(planetsGeo.Saturno),
    urano:    makePos(planetsGeo.Urano),
    nettuno:  makePos(planetsGeo.Nettuno),
    plutone:  makePos(planetsGeo.Plutone),
    ascendente: { lon: asc_lon, ...lonToSign(asc_lon) },
    medio_cielo:{ lon: mc_lon,  ...lonToSign(mc_lon) },
    nodo_nord:  makePos(nnL),
    chirone:    makePos(chL),
    house_cusps: cusps,
    elemento_dominante: '',
    pianeta_dominante: '',
    configurazione_principale: null,
  };

  // Dominant element (personal planets + ASC weighted 2x)
  const planetWeights = [
    { sign: data.sole.sign, weight: 2 },
    { sign: data.luna.sign, weight: 2 },
    { sign: data.ascendente.sign, weight: 2 },
    { sign: data.mercurio.sign, weight: 1 },
    { sign: data.venere.sign, weight: 1 },
    { sign: data.marte.sign, weight: 1 },
    { sign: data.giove.sign, weight: 1 },
    { sign: data.saturno.sign, weight: 1 },
  ];
  data.elemento_dominante = dominantElement(planetWeights);
  data.pianeta_dominante  = dominantPlanet(data);
  data.configurazione_principale = detectConfiguration(data);

  return data;
}
