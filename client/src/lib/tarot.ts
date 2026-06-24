export interface TarotCard {
  id: number;
  numeral: string;
  name: string;
  symbol: string;
  color: string;
  meaning: string;
  reversed: string;
  description: string;
}

export const MAJOR_ARCANA: TarotCard[] = [
  { id: 0,  numeral: '0',    name: 'Il Matto',       symbol: '🃏', color: '#2dd4bf',
    meaning: 'Nuovo inizio, avventura, spontaneità',
    reversed: 'Imprudenza, mancanza di direzione',
    description: 'Il Matto rappresenta l\'inizio di un nuovo ciclo pieno di possibilità. È il momento di osare e fare un salto verso l\'ignoto con fiducia nel destino.' },

  { id: 1,  numeral: 'I',    name: 'Il Mago',        symbol: '⚗️', color: '#f59e0b',
    meaning: 'Potere, volontà, creatività manifesta',
    reversed: 'Manipolazione, talenti non espressi',
    description: 'Il Mago ti ricorda che possiedi tutti gli strumenti per trasformare i sogni in realtà. La tua volontà e la tua concentrazione sono le chiavi del successo.' },

  { id: 2,  numeral: 'II',   name: 'La Sacerdotessa', symbol: '🌙', color: '#a78bfa',
    meaning: 'Intuizione, mistero, saggezza interiore',
    reversed: 'Segreti nascosti, disconnessione dall\'intuito',
    description: 'La Sacerdotessa parla alla tua voce interiore. Fidati del tuo istinto e ascolta il silenzio tra le parole — le risposte sono già dentro di te.' },

  { id: 3,  numeral: 'III',  name: 'L\'Imperatrice',  symbol: '🌸', color: '#f472b6',
    meaning: 'Abbondanza, fertilità, nutrimento creativo',
    reversed: 'Dipendenza, stagnazione creativa',
    description: 'L\'Imperatrice porta prosperità e creatività. Coltiva ciò che ami e nutri i tuoi progetti con cura e pazienza — la fioritura è vicina.' },

  { id: 4,  numeral: 'IV',   name: 'L\'Imperatore',   symbol: '🏛️', color: '#ef4444',
    meaning: 'Autorità, struttura, stabilità',
    reversed: 'Rigidità, abuso di potere',
    description: 'L\'Imperatore chiede di costruire solide fondamenta. Stabilisci regole chiare per te stesso, poni confini sani e guida la tua vita con determinazione.' },

  { id: 5,  numeral: 'V',    name: 'Il Papa',         symbol: '🔑', color: '#fbbf24',
    meaning: 'Tradizione, guida spirituale, apprendimento',
    reversed: 'Dogmatismo, sfida alle convenzioni',
    description: 'Il Papa suggerisce di cercare saggezza nella tradizione o in un mentore. Ci sono insegnamenti profondi disponibili — sii aperto a riceverli.' },

  { id: 6,  numeral: 'VI',   name: 'Gli Amanti',      symbol: '💫', color: '#fb7185',
    meaning: 'Amore, scelte importanti, armonia',
    reversed: 'Disarmonia, scelte difficili',
    description: 'Gli Amanti parlano di scelte fondamentali. Il tuo cuore e la tua mente devono essere in accordo per procedere nella direzione giusta.' },

  { id: 7,  numeral: 'VII',  name: 'Il Carro',        symbol: '⚡', color: '#2dd4bf',
    meaning: 'Vittoria, controllo, determinazione',
    reversed: 'Perdita di controllo, aggressività',
    description: 'Il Carro parla di trionfo attraverso la disciplina. Imbridia le tue energie contraddittorie e avanza verso la tua meta con forza e focus.' },

  { id: 8,  numeral: 'VIII', name: 'La Forza',        symbol: '🦁', color: '#f59e0b',
    meaning: 'Coraggio interiore, pazienza, compassione',
    reversed: 'Dubbio di sé, debolezza temporanea',
    description: 'La Forza non è fisica ma dell\'anima. La tua capacità di affrontare le difficoltà con grazia e compassione è la tua vera potenza.' },

  { id: 9,  numeral: 'IX',   name: 'L\'Eremita',      symbol: '🕯️', color: '#a78bfa',
    meaning: 'Riflessione, solitudine saggia, ricerca interiore',
    reversed: 'Isolamento eccessivo, rifiuto dell\'aiuto',
    description: 'L\'Eremita invita a un periodo di introspezione. Allontanati dal rumore del mondo — nel silenzio la tua vera saggezza può emergere.' },

  { id: 10, numeral: 'X',    name: 'La Ruota',        symbol: '🎡', color: '#f59e0b',
    meaning: 'Cicli, fortuna, destino in movimento',
    reversed: 'Resistenza al cambiamento, cattiva sorte',
    description: 'La Ruota della Fortuna ricorda che tutto cambia. I momenti difficili passeranno — accetta il flusso naturale della vita.' },

  { id: 11, numeral: 'XI',   name: 'La Giustizia',    symbol: '⚖️', color: '#2dd4bf',
    meaning: 'Equilibrio, verità, causa ed effetto',
    reversed: 'Ingiustizia, disonestà',
    description: 'La Giustizia ricorda che ogni azione ha una conseguenza. Agisci con integrità — la verità alla fine trionfa sempre.' },

  { id: 12, numeral: 'XII',  name: 'L\'Appeso',       symbol: '💧', color: '#7c3aed',
    meaning: 'Pausa, prospettiva nuova, lasciar andare',
    reversed: 'Stagnazione, martirio inutile',
    description: 'L\'Appeso chiede di fermarsi e cambiare prospettiva. Ciò che sembra una sconfitta è spesso un momento di illuminazione profonda.' },

  { id: 13, numeral: 'XIII', name: 'La Morte',        symbol: '🌑', color: '#6b21a8',
    meaning: 'Trasformazione, fine e nuovo inizio, rinascita',
    reversed: 'Resistenza al cambiamento, stagnazione',
    description: 'La Morte non è fisica ma trasformazione profonda. Un ciclo si chiude perché ne inizi uno nuovo, più autentico. Abbraccia la rinascita.' },

  { id: 14, numeral: 'XIV',  name: 'La Temperanza',   symbol: '🌊', color: '#2dd4bf',
    meaning: 'Equilibrio, moderazione, pazienza',
    reversed: 'Eccessi, squilibrio, fretta',
    description: 'La Temperanza parla di armonia e moderazione. Mescola con saggezza gli elementi della tua vita — la pazienza ti porterà al risultato.' },

  { id: 15, numeral: 'XV',   name: 'Il Diavolo',      symbol: '🔗', color: '#374151',
    meaning: 'Prendere coscienza di legami, materialismo',
    reversed: 'Liberazione, recupero del potere personale',
    description: 'Il Diavolo mostra le catene che ti tengono prigioniero — spesso create da te stesso. Riconosci i tuoi schemi negativi: la consapevolezza è liberazione.' },

  { id: 16, numeral: 'XVI',  name: 'La Torre',        symbol: '🌩️', color: '#dc2626',
    meaning: 'Rivelazione improvvisa, crollo di strutture false',
    reversed: 'Evitare il disastro, resistenza al cambiamento',
    description: 'La Torre porta cambiamenti improvvisi ma necessari. Ciò che crolla doveva crollare — dalle macerie nasce qualcosa di più autentico.' },

  { id: 17, numeral: 'XVII', name: 'La Stella',       symbol: '⭐', color: '#2dd4bf',
    meaning: 'Speranza, ispirazione, guarigione',
    reversed: 'Disperazione, sfiducia nel futuro',
    description: 'La Stella porta speranza e rinnovamento dopo la tempesta. Sei guidato da una luce interiore — fidati del percorso che l\'universo ha tracciato per te.' },

  { id: 18, numeral: 'XVIII',name: 'La Luna',         symbol: '🌕', color: '#7c3aed',
    meaning: 'Illusione, inconscio, sogni rivelatori',
    reversed: 'Confusione che si dissolve, chiarezza ritrovata',
    description: 'La Luna illumina ciò che resta nell\'ombra. Presta attenzione ai tuoi sogni e alle paure più profonde — contengono messaggi importanti.' },

  { id: 19, numeral: 'XIX',  name: 'Il Sole',         symbol: '☀️', color: '#f59e0b',
    meaning: 'Gioia, successo, vitalità, chiarezza',
    reversed: 'Ottimismo eccessivo, ritardi temporanei',
    description: 'Il Sole porta gioia e successo. La tua energia illumina tutto ciò che ti circonda — è uno dei presagi più positivi dell\'intero mazzo.' },

  { id: 20, numeral: 'XX',   name: 'Il Giudizio',     symbol: '🔔', color: '#f59e0b',
    meaning: 'Risveglio, rinascita, chiamata del destino',
    reversed: 'Dubbio di sé, rifiuto della chiamata',
    description: 'Il Giudizio è una chiamata al risveglio. È tempo di ascoltare la tua voce più profonda e rispondere alla tua vera vocazione.' },

  { id: 21, numeral: 'XXI',  name: 'Il Mondo',        symbol: '🌍', color: '#2dd4bf',
    meaning: 'Completamento, integrazione, realizzazione',
    reversed: 'Incompletezza, ciclo non chiuso',
    description: 'Il Mondo celebra il completamento di un ciclo. Hai raggiunto un traguardo significativo — goditi questo momento prima del prossimo viaggio.' },
];

function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return Math.abs(h);
}

export function getDailyCard(zodiacSign: string): TarotCard {
  const seed = simpleHash(new Date().toDateString() + zodiacSign);
  return MAJOR_ARCANA[seed % MAJOR_ARCANA.length];
}

export function getThreeCardSpread(zodiacSign: string): [TarotCard, TarotCard, TarotCard] {
  const base = simpleHash(new Date().toDateString() + zodiacSign + 'spread');
  const used = new Set<number>();
  const picks: number[] = [];
  let i = 0;
  while (picks.length < 3) {
    const idx = (base + i * 7) % MAJOR_ARCANA.length;
    if (!used.has(idx)) { used.add(idx); picks.push(idx); }
    i++;
  }
  return [MAJOR_ARCANA[picks[0]], MAJOR_ARCANA[picks[1]], MAJOR_ARCANA[picks[2]]];
}
