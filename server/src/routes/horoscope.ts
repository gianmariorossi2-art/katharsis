import { Router, Request, Response } from 'express';

const router = Router();

// Templates duplicated from client lib for server-side use
const TEMPLATES = [
  {
    base: "Mercurio è in retrogrado ma tu no — mentre gli altri inciampano nelle parole, il tuo segno brilla di chiarezza inaspettata. Qualcuno ti invidierà per questo, e onestamente se lo merita.",
    mood: {
      energico: "L'energia cosmica oggi amplifica ogni tua azione. Parti prima degli altri, arrivi dopo, ma con molto più stile.",
      riflessivo: "La chiarezza mentale di oggi è un dono raro. Usala bene, perché domani Mercurio torna a fare i capricci.",
      romantico: "Le stelle allineano parole e sentimenti — oggi dire ciò che provi sarà più facile del solito.",
      ansioso: "Respira. Le stelle confermano che il caos di oggi è temporaneo. Domani tornerai a sentirti padrone dell'universo.",
      curioso: "La tua mente oggi è una spugna cosmica. Tutto quello che assorbi diventerà un vantaggio.",
      malinconico: "Anche le stelle hanno i loro momenti bui. Ma proprio da quella oscurità nasce la luce più intensa.",
    },
  },
  {
    base: "Le stelle hanno deciso che oggi è il tuo giorno. Non chiedere perché, accettalo con la grazia di chi sa già di essere speciale.",
    mood: {
      energico: "Questa energia è reale e potente. Incanalala verso qualcosa che conta, non solo verso il divano.",
      riflessivo: "Il tuo giorno, usato con saggezza, vale tre giorni ordinari. Le stelle ti guardano con aspettativa.",
      romantico: "Qualcuno oggi vedrà in te qualcosa che tu stesso hai dimenticato di avere. Lasciati guardare.",
      ansioso: "Anche nei giorni speciali ci si può sentire stranamente a disagio. È normale. Le stelle lo sanno.",
      curioso: "Un giorno come questo porta risposte a domande che non avevi ancora formulato.",
      malinconico: "Anche un giorno cosmicamente favorevole può sembrare grigio dall'interno. Ma qualcosa di bello si sta avvicinando.",
    },
  },
  {
    base: "Venere transita nel tuo segno con l'energia di chi è in ritardo ma non vuole ammetterlo. Il risultato? Un magnetismo involontario.",
    mood: {
      energico: "Con questa energia e questo magnetismo, oggi potresti convincere chiunque. Usa il potere con responsabilità.",
      riflessivo: "Osserva chi si avvicina a te oggi. Non è un caso. L'universo sta selezionando il tuo prossimo capitolo.",
      romantico: "Il magnetismo di oggi è particolarmente efficace in amore. Sii presente, non sul telefono.",
      ansioso: "Anche quando non ti senti al massimo, il tuo fascino cosmico funziona in modo automatico.",
      curioso: "Questo magnetismo attirerà anche informazioni interessanti. Ascolta le conversazioni casuali.",
      malinconico: "La malinconia di oggi ha una sua bellezza profonda. Alcune persone la sentono e si avvicinano.",
    },
  },
  {
    base: "Giove benedice le tue ambizioni oggi, ma con quella sua aria da zio ricco che dà consigli non richiesti. Punta in alto, ma non dimenticare di guardare dove metti i piedi.",
    mood: {
      energico: "L'ambizione più l'energia di oggi è una combinazione potente. Il limite siete voi, non le stelle.",
      riflessivo: "Giove porta grandi idee. La tua mente riflessiva le filtrerà e tratterrà solo quelle che valgono.",
      romantico: "Anche in amore, punta in alto. Le stelle di oggi supportano chi chiede ciò che vuole davvero.",
      ansioso: "Giove espande tutto — anche le preoccupazioni. Ma espande anche le soluzioni. Concentrati su queste.",
      curioso: "Con Giove attivo, ogni domanda porta a dieci risposte e cento nuove domande.",
      malinconico: "Anche nelle giornate pesanti, Giove ricorda che le possibilità sono enormi.",
    },
  },
  {
    base: "La Luna nuova porta con sé un'energia di reset. È il momento di lasciare andare ciò che non funziona più, anche se ci sei affezionato/a per abitudine.",
    mood: {
      energico: "Il reset lunare e la tua energia formano un duo vincente. Inizia ora ciò che rimandavi da troppo tempo.",
      riflessivo: "La Luna nuova e la tua natura riflessiva si capiscono profondamente. Pensa, poi agisci.",
      romantico: "Un reset in amore non significa fine — può significare inizio. Le stelle oggi lo supportano.",
      ansioso: "Lasciare andare fa paura, ma spazio libero attrae cose nuove e migliori.",
      curioso: "Con la Luna nuova, ogni curiosità può diventare il seme di una nuova avventura.",
      malinconico: "La malinconia e la Luna nuova si conoscono bene. Ma la Luna cresce — e con lei, anche il tuo umore.",
    },
  },
  {
    base: "Saturno quadrato chiede di fare le cose per bene invece che in fretta. Una lezione cosmica di qualità sulla quantità.",
    mood: {
      energico: "La tentazione di fare tutto subito è alta. Saturno ti ricorda che la velocità non è sempre virtù.",
      riflessivo: "La tua natura riflessiva oggi è un vantaggio. Saturno premia chi pensa prima di agire.",
      romantico: "In amore come nel lavoro, Saturno chiede profondità. Qualità sopra quantità.",
      ansioso: "Saturno porta struttura. Crea una lista e affronta una cosa alla volta.",
      curioso: "La curiosità con la disciplina di Saturno produce risultati straordinari. Approfondisci invece di spaziare.",
      malinconico: "Saturno capisce la pesantezza. È il pianeta della resistenza. Puoi farcela.",
    },
  },
  {
    base: "L'opposizione di Marte porta tensioni che sono vecchie energie interne che cercano finalmente un'uscita. Il momento di chiarire è ora.",
    mood: {
      energico: "Tutta questa energia rischia di trasformarsi in conflitto. Incanalala in modo produttivo.",
      riflessivo: "Prima di chiarire con gli altri, chiarisci con te stesso/a. Le tue riflessioni saranno illuminanti.",
      romantico: "Le tensioni in amore di oggi nascondono conversazioni necessarie. Affrontale con amore.",
      ansioso: "Le stelle confermano che affrontare le tensioni è meglio che evitarle ancora.",
      curioso: "Osserva le tensioni con curiosità invece che con paura. Cosa ti stanno cercando di dire?",
      malinconico: "Le tensioni cosmiche possono essere la scintilla di un cambiamento necessario.",
    },
  },
  {
    base: "Nettuno in trigono sussurra visioni e intuizioni che sembrano sogni ma che valgono più di mille analisi razionali. Fidati di ciò che senti.",
    mood: {
      energico: "L'intuizione oggi è il tuo superpotere. Usala come bussola per questa energia travolgente.",
      riflessivo: "Intuizione e riflessione oggi si fondono perfettamente. Ascolta sia il cuore che la mente.",
      romantico: "Nettuno porta visioni romantiche che spesso si avverano. Sii aperto/a ai sogni ad occhi aperti.",
      ansioso: "Fidati delle tue intuizioni, anche quando l'ansia cerca di sabotarle. Il tuo istinto è affidabile oggi.",
      curioso: "Ogni intuizione di oggi è un filo da seguire. Tira delicatamente — non sai dove porta.",
      malinconico: "Nettuno trasforma la malinconia in ispirazione artistica. Scrivila, dipingila, cantala.",
    },
  },
];

const ENERGY_SETS = [
  {
    envy: "Oggi qualcuno ti invidia per il tuo modo di non preoccuparti affatto di ciò che pensano gli altri",
    power: "La tua energia di oggi: disarmante serenità che confonde i tuoi critici",
    warning: "Attento/a a: persone che iniziano le frasi con 'non per fare polemica, ma...'",
  },
  {
    envy: "La tua capacità di trovare il lato positivo in tutto irrita chi preferisce il lamento cronico",
    power: "La tua energia di oggi: ottimismo cosmico che non si spiega ma si sente",
    warning: "Attento/a a: prendere decisioni importanti nel momento immediatamente dopo aver mangiato",
  },
  {
    envy: "Il tuo stile — qualunque cosa tu abbia indossato stamattina — è inspiegabilmente indovinato",
    power: "La tua energia di oggi: magnetismo visivo involontario e devastante",
    warning: "Attento/a a: le riunioni che potevano essere una email e non lo saranno",
  },
  {
    envy: "La tua capacità di dormire bene anche nei periodi complicati fa invidiare chi è sveglio alle 3",
    power: "La tua energia di oggi: radicamento cosmico che nessuna notizia riesce a scalfire",
    warning: "Attento/a a: aprire le app di notizie prima delle 10 di mattina",
  },
  {
    envy: "Il modo in cui riesci a dire 'no' senza sentirti in colpa è un superpotere raro",
    power: "La tua energia di oggi: confini cristallini che proteggono la tua pace",
    warning: "Attento/a a: chi inizia le conversazioni con 'ho solo bisogno di un piccolo favore'",
  },
  {
    envy: "La tua spontaneità creativa oggi farà sembrare tutti gli altri prevedibili",
    power: "La tua energia di oggi: scintille creative che accendono tutto ciò che tocchi",
    warning: "Attento/a a: sprecare questa creatività su cose che non contano nulla",
  },
  {
    envy: "La tua capacità di fare domande giuste al momento giusto fa sentire gli altri improvvisamente ignoranti",
    power: "La tua energia di oggi: intelligenza intuitiva che taglia dritto al nocciolo",
    warning: "Attento/a a: chi non risponde alle domande ma fa finta di averlo fatto",
  },
  {
    envy: "Il tuo equilibrio emotivo di oggi fa sembrare tutti gli altri leggermente instabili per confronto",
    power: "La tua energia di oggi: calma oceanica che sorprende persino te",
    warning: "Attento/a a: confondere la calma temporanea con la risoluzione definitiva dei problemi",
  },
];

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// POST /api/horoscope
router.post('/', (req: Request, res: Response): void => {
  const { sign = 'Leone', mood = 'riflessivo' } = req.body as { sign?: string; mood?: string };

  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const seed = `${sign}-${mood}-${dateStr}`;
  const hash = simpleHash(seed);

  const template = TEMPLATES[hash % TEMPLATES.length];
  const moodText = (template.mood as Record<string, string>)[mood] || template.mood.riflessivo;
  const horoscope = `${template.base}\n\n${moodText}`;

  const energySeed = `energies-${sign}-${mood}-${dateStr}`;
  const energyHash = simpleHash(energySeed);
  const energies = ENERGY_SETS[energyHash % ENERGY_SETS.length];

  res.json({ horoscope, energies });
});

export default router;
