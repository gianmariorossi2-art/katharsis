type Direction = 'up' | 'warning' | 'neutral';

interface Verdict {
  label: string;
  direction: Direction;
}

interface MoodOutcomes {
  amore: Verdict;
  lavoro: Verdict;
  energia: Verdict;
}

export interface PlanetInfo {
  name: string;
  symbol: string;
  color: string;
  meaning: string;
}

export interface DailyHoroscopeData {
  text: string;
  prediction: string;
  planet: PlanetInfo;
  outcomes: MoodOutcomes;
}

interface HoroscopeTemplate {
  planet: PlanetInfo;
  predictions: Record<string, string>;
  outcomes: Record<string, MoodOutcomes>;
  base: string;
  moodVariations: Record<string, string>;
}

// ─── Verdict shorthands ───────────────────────────────────────────────────────
const UP: Verdict = { label: 'Favorevole', direction: 'up' };
const WARN: Verdict = { label: 'Attenzione', direction: 'warning' };
const FLAT: Verdict = { label: 'Stabile', direction: 'neutral' };

// ─── Templates ────────────────────────────────────────────────────────────────

const TEMPLATES: HoroscopeTemplate[] = [
  // 1 — Mercurio retrogrado
  {
    planet: { name: 'Mercurio', symbol: '☿', color: '#06b6d4', meaning: 'Il pianeta della comunicazione' },
    predictions: {
      energico:    "Una conversazione che evitavi troverà finalmente le parole giuste",
      riflessivo:  "Il silenzio di oggi si trasformerà in chiarezza cristallina domani",
      romantico:   "Le parole che pronunci in amore oggi pesano il doppio — sceglile con cura",
      ansioso:     "La confusione di comunicazione che senti è temporanea — Mercurio sta lavorando",
      curioso:     "Una risposta inaspettata arriverà da una direzione che non stavi guardando",
      malinconico: "Le parole non dette che porti si alleggeranno prima di quanto pensi",
    },
    outcomes: {
      energico:    { amore: UP,   lavoro: UP,   energia: UP   },
      riflessivo:  { amore: FLAT, lavoro: UP,   energia: FLAT },
      romantico:   { amore: UP,   lavoro: FLAT, energia: UP   },
      ansioso:     { amore: WARN, lavoro: WARN, energia: FLAT },
      curioso:     { amore: FLAT, lavoro: UP,   energia: UP   },
      malinconico: { amore: WARN, lavoro: FLAT, energia: WARN },
    },
    base: "Mercurio è in retrogrado ma tu no — mentre gli altri inciampano nelle parole, il tuo segno brilla di chiarezza inaspettata. Qualcuno ti invidierà per questo, e onestamente se lo merita.",
    moodVariations: {
      energico:    "L'energia cosmica oggi amplifica ogni tua azione. Parti prima degli altri, arrivi dopo, ma con molto più stile.",
      riflessivo:  "La chiarezza mentale di oggi è un dono raro. Usala bene, perché domani Mercurio torna a fare i capricci.",
      romantico:   "Le stelle allineano parole e sentimenti — oggi dire ciò che provi sarà più facile del solito. Non sprecare questa finestra cosmica.",
      ansioso:     "Respira. Le stelle confermano che il caos di oggi è temporaneo, anche se ora sembra eterno. Domani tornerai a sentirti padrone dell'universo.",
      curioso:     "La tua mente oggi è una spugna cosmica. Tutto quello che assorbi diventerà un vantaggio inaspettato nei prossimi giorni.",
      malinconico: "Anche le stelle hanno i loro momenti bui. Ma proprio da quella oscurità nasce la luce più intensa. Il tuo momento sta arrivando.",
    },
  },

  // 2 — Urano (sorprese)
  {
    planet: { name: 'Urano', symbol: '♅', color: '#22d3ee', meaning: 'Il pianeta delle sorprese' },
    predictions: {
      energico:    "Oggi sei invisibile solo se lo scegli tu — altrimenti tutto ciò che fai viene notato",
      riflessivo:  "Una persona che conta sta osservando il tuo modo di fare le cose, in silenzio",
      romantico:   "Qualcuno che non ti aspetti ti guarderà in modo diverso dal solito",
      ansioso:     "Anche la tua incertezza appare come profondità agli occhi di chi ti conosce davvero",
      curioso:     "Una domanda che fai oggi aprirà una porta che non sapevi esistesse",
      malinconico: "La malinconia che porti ha una sua eleganza silenziosa — e qualcuno la vede",
    },
    outcomes: {
      energico:    { amore: UP,   lavoro: UP,   energia: UP   },
      riflessivo:  { amore: FLAT, lavoro: UP,   energia: FLAT },
      romantico:   { amore: UP,   lavoro: FLAT, energia: UP   },
      ansioso:     { amore: FLAT, lavoro: FLAT, energia: WARN },
      curioso:     { amore: FLAT, lavoro: UP,   energia: UP   },
      malinconico: { amore: UP,   lavoro: FLAT, energia: WARN },
    },
    base: "Le stelle hanno deciso che oggi è il tuo giorno. Non chiedere perché, accettalo con la grazia di chi sa già di essere speciale. L'universo ha le sue ragioni, e raramente le spiega.",
    moodVariations: {
      energico:    "Questa energia è reale e potente. Incanalala verso qualcosa che conta, non solo verso il divano e i social.",
      riflessivo:  "Il tuo giorno, usato con saggezza, vale tre giorni ordinari. Le stelle ti guardano con aspettativa.",
      romantico:   "Qualcuno oggi vedrà in te qualcosa che tu stesso hai dimenticato di avere. Lasciati guardare.",
      ansioso:     "Sì, anche nei giorni speciali ci si può sentire stranamente a disagio. È normale. Le stelle lo sanno.",
      curioso:     "Un giorno come questo porta risposte a domande che non avevi ancora formulato. Stai attento/a ai dettagli.",
      malinconico: "Anche un giorno cosmicamente favorevole può sembrare grigio dall'interno. Ma fidati — qualcosa di bello si sta avvicinando.",
    },
  },

  // 3 — Venere
  {
    planet: { name: 'Venere', symbol: '♀', color: '#e040fb', meaning: 'Il pianeta dell\'amore e del desiderio' },
    predictions: {
      energico:    "La tua energia attirerà un'opportunità romantica o professionale entro 48 ore",
      riflessivo:  "Qualcuno nel tuo cerchio ti vede con occhi nuovi — lo scoprirai prima di quanto pensi",
      romantico:   "Una connessione che sembrava latente si riaccenderà con un gesto minimo",
      ansioso:     "Il tuo fascino di oggi funziona in automatico, anche quando non ti senti al massimo",
      curioso:     "Una nuova conoscenza di oggi potrebbe diventare qualcosa di più interessante nelle prossime settimane",
      malinconico: "La tua profondità emotiva di oggi è più magnetica di qualsiasi allegria di facciata",
    },
    outcomes: {
      energico:    { amore: UP,   lavoro: UP,   energia: UP   },
      riflessivo:  { amore: UP,   lavoro: FLAT, energia: FLAT },
      romantico:   { amore: UP,   lavoro: FLAT, energia: UP   },
      ansioso:     { amore: UP,   lavoro: WARN, energia: FLAT },
      curioso:     { amore: UP,   lavoro: FLAT, energia: UP   },
      malinconico: { amore: UP,   lavoro: FLAT, energia: WARN },
    },
    base: "Venere transita nel tuo segno con l'energia di chi è in ritardo ma non vuole ammetterlo. Il risultato? Un magnetismo involontario che attirerà persone e opportunità quasi a tua insaputa.",
    moodVariations: {
      energico:    "Con questa energia e questo magnetismo, oggi potresti convincere chiunque di quasi qualsiasi cosa. Usa il potere con responsabilità.",
      riflessivo:  "Osserva chi si avvicina a te oggi. Non è un caso. L'universo sta selezionando il tuo prossimo capitolo.",
      romantico:   "Il magnetismo di oggi è particolarmente efficace in amore. Sii presente, non sul telefono.",
      ansioso:     "Anche quando non ti senti al massimo, il tuo fascino cosmico funziona in modo automatico. Le stelle fanno gli straordinari per te.",
      curioso:     "Questo magnetismo attirerà anche informazioni interessanti. Ascolta le conversazioni casuali — una conterrà qualcosa di utile.",
      malinconico: "La malinconia di oggi ha una sua bellezza profonda. Alcune persone la sentono e si avvicinano. Non scacciarle.",
    },
  },

  // 4 — Giove
  {
    planet: { name: 'Giove', symbol: '♃', color: '#f97316', meaning: 'Il pianeta dell\'abbondanza' },
    predictions: {
      energico:    "Un'opportunità professionale si presenta questa settimana — non aspettare il momento perfetto",
      riflessivo:  "L'idea che tieni per te è più valida di quanto credi: è il momento di condividerla",
      romantico:   "In amore, chiedi quello che vuoi davvero — le stelle dicono che puoi ottenerlo",
      ansioso:     "Le soluzioni ai tuoi problemi sono già nel tuo campo visivo — espandi lo sguardo",
      curioso:     "Un libro, un podcast o una conversazione oggi conterrà qualcosa che cambia la prospettiva",
      malinconico: "Le possibilità che non vedi ora esistono comunque — Giove le sta preparando per te",
    },
    outcomes: {
      energico:    { amore: FLAT, lavoro: UP,   energia: UP   },
      riflessivo:  { amore: FLAT, lavoro: UP,   energia: FLAT },
      romantico:   { amore: UP,   lavoro: UP,   energia: FLAT },
      ansioso:     { amore: FLAT, lavoro: UP,   energia: WARN },
      curioso:     { amore: FLAT, lavoro: UP,   energia: UP   },
      malinconico: { amore: FLAT, lavoro: UP,   energia: WARN },
    },
    base: "Giove benedice le tue ambizioni oggi, ma con quella sua aria da zio ricco che dà consigli non richiesti. Il messaggio cosmico è chiaro: punta in alto, ma non dimenticare di guardare dove metti i piedi.",
    moodVariations: {
      energico:    "L'ambizione più l'energia di oggi è una combinazione potente. Il limite siete voi, non le stelle.",
      riflessivo:  "Giove porta grandi idee. La tua mente riflessiva le filtrerà e tratterrà solo quelle che valgono davvero.",
      romantico:   "Anche in amore, punta in alto. Le stelle di oggi supportano chi chiede ciò che vuole davvero.",
      ansioso:     "Giove espande tutto — anche le preoccupazioni. Ma espande anche le soluzioni. Concentrati su queste ultime.",
      curioso:     "Con Giove attivo, ogni domanda porta a dieci risposte e cento nuove domande. Benvenuto/a nel labirinto cosmico.",
      malinconico: "Anche nelle giornate pesanti, Giove ricorda che le possibilità sono enormi. Anche se oggi non riesci a vederle.",
    },
  },

  // 5 — Luna
  {
    planet: { name: 'Luna', symbol: '☽', color: '#a78bfa', meaning: 'La governatrice delle emozioni' },
    predictions: {
      energico:    "Oggi è il momento giusto per iniziare ciò che rimandavi: la Luna sostiene i nuovi inizi",
      riflessivo:  "Una vecchia abitudine che non ti serve più è pronta a essere rilasciata — senza dramma",
      romantico:   "Un capitolo romantico si chiude o si apre oggi — entrambe le direzioni portano bene",
      ansioso:     "Quello che lasci andare crea esattamente lo spazio che ti serve per qualcosa di meglio",
      curioso:     "La Luna nuova amplifica la curiosità: segui il primo pensiero interessante di oggi fino in fondo",
      malinconico: "La fine di qualcosa di pesante è vicina — la Luna nuova porta sempre luce dopo il buio",
    },
    outcomes: {
      energico:    { amore: UP,   lavoro: UP,   energia: UP   },
      riflessivo:  { amore: UP,   lavoro: FLAT, energia: FLAT },
      romantico:   { amore: UP,   lavoro: FLAT, energia: UP   },
      ansioso:     { amore: FLAT, lavoro: WARN, energia: WARN },
      curioso:     { amore: FLAT, lavoro: FLAT, energia: UP   },
      malinconico: { amore: UP,   lavoro: WARN, energia: WARN },
    },
    base: "La Luna nuova porta con sé un'energia di reset che hai aspettato — forse inconsciamente — da settimane. È il momento di lasciare andare ciò che non funziona più, anche se ci sei affezionato/a per abitudine.",
    moodVariations: {
      energico:    "Il reset lunare e la tua energia formano un duo vincente. Inizia ora ciò che rimandavi da troppo tempo.",
      riflessivo:  "La Luna nuova e la tua natura riflessiva si capiscono profondamente. Usa questa giornata per pensare, poi agire.",
      romantico:   "Un reset in amore non significa fine — può significare inizio. Le stelle oggi lo supportano.",
      ansioso:     "Lasciare andare fa paura, ma le stelle confermano che spazio libero attrae cose nuove e migliori.",
      curioso:     "Con la Luna nuova, ogni curiosità può diventare il seme di una nuova avventura. Cosa ti incuriosisce di più oggi?",
      malinconico: "La malinconia e la Luna nuova si conoscono bene. Ma la Luna cresce — e con lei, anche il tuo umore.",
    },
  },

  // 6 — Saturno
  {
    planet: { name: 'Saturno', symbol: '♄', color: '#94a3b8', meaning: 'Il pianeta della struttura' },
    predictions: {
      energico:    "Tutta la tua energia oggi vale di più se diretta su una cosa invece di dieci",
      riflessivo:  "Un progetto a cui tieni sta maturando in silenzio — ha bisogno di tempo, non di accelerazione",
      romantico:   "La profondità che cerchi in amore si costruisce lentamente, ma dura più a lungo di tutto il resto",
      ansioso:     "Struttura l'ansia: scrivi una lista, affronta il primo punto, poi il secondo — solo il secondo",
      curioso:     "Approfondire una cosa fino in fondo oggi vale più che sfiorarne dieci in modo superficiale",
      malinconico: "Saturno capisce il peso. Puoi fermarti — purché non smetti completamente",
    },
    outcomes: {
      energico:    { amore: FLAT, lavoro: UP,   energia: UP   },
      riflessivo:  { amore: FLAT, lavoro: UP,   energia: FLAT },
      romantico:   { amore: UP,   lavoro: WARN, energia: FLAT },
      ansioso:     { amore: WARN, lavoro: WARN, energia: WARN },
      curioso:     { amore: FLAT, lavoro: UP,   energia: FLAT },
      malinconico: { amore: WARN, lavoro: WARN, energia: WARN },
    },
    base: "Saturno quadrato al tuo segno suona come una notizia negativa, ma in realtà è l'universo che ti chiede di fare le cose per bene invece che in fretta. Una lezione cosmica di qualità sulla quantità.",
    moodVariations: {
      energico:    "Con tutta questa energia, la tentazione di fare tutto subito è alta. Saturno ti ricorda che la velocità non è sempre virtù.",
      riflessivo:  "La tua natura riflessiva oggi è un vantaggio. Saturno premia chi pensa prima di agire.",
      romantico:   "In amore come nel lavoro, Saturno chiede profondità. Qualità sopra quantità — in tutto.",
      ansioso:     "Saturno può amplificare le preoccupazioni, ma porta anche struttura. Crea una lista e affronta una cosa alla volta.",
      curioso:     "La curiosità con la disciplina di Saturno produce risultati straordinari. Approfondisci invece di spaziare.",
      malinconico: "Saturno capisce la pesantezza. È il pianeta della struttura e della resistenza. Puoi farcela.",
    },
  },

  // 7 — Marte
  {
    planet: { name: 'Marte', symbol: '♂', color: '#ef4444', meaning: 'Il pianeta dell\'energia vitale' },
    predictions: {
      energico:    "Incanalare questa energia in modo costruttivo oggi produrrà risultati visibili entro 3 giorni",
      riflessivo:  "Una tensione che covava da settimane è pronta a trovare parole — usale bene",
      romantico:   "La passione che senti in amore oggi è reale — non trattenerla per paura della reazione",
      ansioso:     "Le tensioni di oggi non sono una minaccia — sono energia che cerca una direzione produttiva",
      curioso:     "Osserva da dove viene la tensione di oggi: ti dirà esattamente cosa vuoi davvero",
      malinconico: "Il fuoco di Marte brucia ciò che non serve e libera lo spazio per qualcosa di nuovo",
    },
    outcomes: {
      energico:    { amore: FLAT, lavoro: UP,   energia: UP   },
      riflessivo:  { amore: WARN, lavoro: WARN, energia: FLAT },
      romantico:   { amore: UP,   lavoro: WARN, energia: UP   },
      ansioso:     { amore: WARN, lavoro: WARN, energia: UP   },
      curioso:     { amore: FLAT, lavoro: WARN, energia: UP   },
      malinconico: { amore: WARN, lavoro: WARN, energia: WARN },
    },
    base: "L'opposizione di Marte porta tensioni che sembrano venire dall'esterno, ma in realtà sono vecchie energie interne che cercano finalmente un'uscita. Il momento di chiarire è ora — con delicatezza, se possibile.",
    moodVariations: {
      energico:    "Tutta questa energia rischia di trasformarsi in conflitto. Incanalala in modo produttivo prima che esploda.",
      riflessivo:  "Prima di chiarire con gli altri, chiarisci con te stesso/a. Le tue riflessioni di oggi saranno illuminanti.",
      romantico:   "Le tensioni in amore di oggi nascondono conversazioni necessarie. Affrontale con amore, non con difese.",
      ansioso:     "Sì, ci sono tensioni. Ma le stelle confermano che affrontarle è meglio che evitarle ancora.",
      curioso:     "Osserva le tensioni con curiosità invece che con paura. Cosa ti stanno cercando di dire?",
      malinconico: "Le tensioni cosmiche possono amplificare la tristezza. Ma possono anche essere la scintilla di un cambiamento necessario.",
    },
  },

  // 8 — Nettuno
  {
    planet: { name: 'Nettuno', symbol: '♆', color: '#3b82f6', meaning: 'Il pianeta dell\'intuizione' },
    predictions: {
      energico:    "Fidati del primo istinto di oggi — è più preciso di qualsiasi analisi razionale",
      riflessivo:  "Una visione o un sogno recente contiene più informazioni utili di quanto sembri",
      romantico:   "Le emozioni romantiche di oggi non vanno analizzate — vanno vissute pienamente",
      ansioso:     "Il tuo istinto oggi è affidabile — l'ansia mente, l'intuizione no",
      curioso:     "Ogni sensazione di oggi è un filo da tirare — seguine almeno uno fino alla fine",
      malinconico: "La profondità emotiva di oggi è materiale grezzo per qualcosa di autentico e bello",
    },
    outcomes: {
      energico:    { amore: UP,   lavoro: FLAT, energia: UP   },
      riflessivo:  { amore: UP,   lavoro: FLAT, energia: FLAT },
      romantico:   { amore: UP,   lavoro: FLAT, energia: UP   },
      ansioso:     { amore: FLAT, lavoro: WARN, energia: FLAT },
      curioso:     { amore: FLAT, lavoro: FLAT, energia: UP   },
      malinconico: { amore: UP,   lavoro: WARN, energia: WARN },
    },
    base: "Nettuno in trigono sussurra visioni e intuizioni che sembrano sogni ma che valgono più di mille analisi razionali. Fidati di ciò che senti, anche quando non riesci a spiegarlo con la logica.",
    moodVariations: {
      energico:    "L'intuizione oggi è il tuo superpotere. Usala come bussola per questa energia travolgente.",
      riflessivo:  "Intuizione e riflessione oggi si fondono perfettamente. Ascolta sia il cuore che la mente.",
      romantico:   "Nettuno porta visioni romantiche che spesso si avverano. Sii aperto/a ai sogni ad occhi aperti.",
      ansioso:     "Fidati delle tue intuizioni, anche quando l'ansia cerca di sabotarle. Le stelle confermano che il tuo istinto è affidabile oggi.",
      curioso:     "Ogni intuizione di oggi è un filo da seguire. Tira delicatamente — non sai dove porta.",
      malinconico: "Nettuno trasforma la malinconia in ispirazione artistica. Se senti il peso del mondo, scrivilo, dipingilo, cantalo.",
    },
  },

  // 9 — Sole
  {
    planet: { name: 'Sole', symbol: '☀', color: '#f59e0b', meaning: 'La stella della visibilità' },
    predictions: {
      energico:    "Tutto quello che fai oggi con piena presenza avrà un impatto sproporzionato rispetto allo sforzo",
      riflessivo:  "Il riflettore è su di te — questo è il momento per mostrare chi sei davvero, non chi sembri",
      romantico:   "Essere visti per quello che sei — in amore — è l'unica base che funziona davvero nel tempo",
      ansioso:     "Il disagio di essere visibile è temporaneo, ma quello che costruisci standolo è permanente",
      curioso:     "La tua autenticità oggi è più interessante e attraente di qualsiasi performance studiata",
      malinconico: "Anche le ombre fanno parte del quadro — mostrare le tue non ti indebolisce, ti rende reale",
    },
    outcomes: {
      energico:    { amore: UP,   lavoro: UP,   energia: UP   },
      riflessivo:  { amore: FLAT, lavoro: UP,   energia: FLAT },
      romantico:   { amore: UP,   lavoro: FLAT, energia: UP   },
      ansioso:     { amore: FLAT, lavoro: UP,   energia: WARN },
      curioso:     { amore: FLAT, lavoro: UP,   energia: UP   },
      malinconico: { amore: WARN, lavoro: FLAT, energia: WARN },
    },
    base: "Il Sole nel tuo segno porta un riflettore cosmico su di te, anche se non lo hai chiesto e forse preferiresti la penombra. Questo è il momento di mostrarsi per quello che si è davvero — anche le parti imbarazzanti.",
    moodVariations: {
      energico:    "Il riflettore cosmico e la tua energia oggi ti rendono impossibile da ignorare. Usalo bene.",
      riflessivo:  "Il riflettore ti illumina mentre rifletti. Lascia che gli altri vedano anche questa parte di te.",
      romantico:   "Essere visti per quello che si è — anche in amore — è l'unica base che funziona davvero.",
      ansioso:     "Sì, essere sotto i riflettori fa paura. Ma le stelle confermano che quello che vedranno è qualcosa di buono.",
      curioso:     "Con il Sole che ti illumina, la tua curiosità diventa un tratto affascinante invece che strano. Mostrala.",
      malinconico: "Il riflettore mostra anche le ombre. Ma le ombre fanno parte del quadro completo — e il quadro è bello.",
    },
  },

  // 10 — Plutone
  {
    planet: { name: 'Plutone', symbol: '♇', color: '#7c3aed', meaning: 'Il pianeta della trasformazione' },
    predictions: {
      energico:    "Quello che inizi oggi ha radici più profonde e durature di quanto appaia in superficie",
      riflessivo:  "Una verità che eviti da tempo è pronta a essere guardata in faccia — senza dramma, stavolta",
      romantico:   "La trasformazione in amore fa paura, ma porta sempre verso qualcosa di più autentico",
      ansioso:     "Il cambiamento che senti arrivare è reale — e ti porta esattamente dove devi andare",
      curioso:     "Plutone rivela ciò che era nascosto: segui quella sensazione di 'c'è qualcosa sotto'",
      malinconico: "La profondità di oggi è Plutone che lavora. Qualcosa di vecchio cede il posto a qualcosa di vero",
    },
    outcomes: {
      energico:    { amore: FLAT, lavoro: UP,   energia: UP   },
      riflessivo:  { amore: FLAT, lavoro: UP,   energia: FLAT },
      romantico:   { amore: UP,   lavoro: FLAT, energia: FLAT },
      ansioso:     { amore: WARN, lavoro: FLAT, energia: WARN },
      curioso:     { amore: FLAT, lavoro: UP,   energia: UP   },
      malinconico: { amore: WARN, lavoro: WARN, energia: WARN },
    },
    base: "Plutone al tuo sestile porta trasformazioni profonde che sembrano piccole in superficie. Come un iceberg cosmico: quello che vedi è il 10%, quello che sta succedendo dentro è il 90%. Fidati del processo.",
    moodVariations: {
      energico:    "Le trasformazioni profonde richiedono energia. Hai esattamente quella giusta oggi per iniziare qualcosa di permanente.",
      riflessivo:  "Plutone e la riflessione sono alleati naturali. Vai in profondità — è lì che trovi le risposte vere.",
      romantico:   "Le trasformazioni in amore sono le più potenti. Non aver paura di cambiare — in meglio.",
      ansioso:     "La trasformazione fa paura. Ma Plutone non porta mai cambiamenti che non sei pronto/a ad affrontare.",
      curioso:     "Plutone rivela strati nascosti. La tua curiosità è lo strumento perfetto per esplorare questi strati oggi.",
      malinconico: "La malinconia profonda di oggi è Plutone che lavora. Qualcosa di vecchio sta finendo per fare spazio a qualcosa di nuovo.",
    },
  },
];

// ─── Energy sets (unchanged) ──────────────────────────────────────────────────

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
    envy: "La tua capacità di dormire bene anche nei periodi complicati fa invidiare chi è sveglio alle 3 a guardare il soffitto",
    power: "La tua energia di oggi: radicamento cosmico che nessuna notizia riesce a scalfire",
    warning: "Attento/a a: aprire le app di notizie prima delle 10 di mattina",
  },
  {
    envy: "Il modo in cui riesci a dire 'no' senza sentirti in colpa è un superpotere raro che altri ti invidiano ferocemente",
    power: "La tua energia di oggi: confini cristallini che proteggono la tua pace",
    warning: "Attento/a a: chi inizia le conversazioni con 'ho solo bisogno di un piccolo favore'",
  },
  {
    envy: "La tua spontaneità creativa oggi farà sembrare tutti gli altri prevedibili e un po' noiosi",
    power: "La tua energia di oggi: scintille creative che accendono tutto ciò che tocchi",
    warning: "Attento/a a: sprecare questa creatività su cose che non contano nulla",
  },
  {
    envy: "La tua capacità di fare domande giuste al momento giusto è quella cosa che fa sentire gli altri improvvisamente ignoranti",
    power: "La tua energia di oggi: intelligenza intuitiva che taglia dritto al nocciolo",
    warning: "Attento/a a: chi non risponde alle domande ma fa finta di averlo fatto",
  },
  {
    envy: "Il tuo equilibrio emotivo di oggi fa sembrare tutti gli altri leggermente instabili per confronto",
    power: "La tua energia di oggi: calma oceanica che sorprende persino te",
    warning: "Attento/a a: confondere la calma temporanea con la risoluzione definitiva dei problemi",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function selectTemplate(sign: string, mood: string, date?: Date): HoroscopeTemplate {
  const d = date || new Date();
  const dateStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const hash = simpleHash(`${sign}-${mood}-${dateStr}`);
  return TEMPLATES[hash % TEMPLATES.length];
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export function generateDailyHoroscope(sign: string, mood: string, date?: Date): string {
  const t = selectTemplate(sign, mood, date);
  const moodText = t.moodVariations[mood] ?? t.moodVariations['riflessivo'];
  return `${t.base}\n\n${moodText}`;
}

export function getHoroscopeData(sign: string, mood: string, date?: Date): DailyHoroscopeData {
  const t = selectTemplate(sign, mood, date);
  const moodText = t.moodVariations[mood] ?? t.moodVariations['riflessivo'];
  return {
    text: `${t.base}\n\n${moodText}`,
    prediction: t.predictions[mood] ?? t.predictions['riflessivo'],
    planet: t.planet,
    outcomes: t.outcomes[mood] ?? t.outcomes['riflessivo'],
  };
}

export function generateDailyEnergies(
  sign: string,
  mood: string,
  date?: Date
): { envy: string; power: string; warning: string } {
  const d = date || new Date();
  const dateStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  const hash = simpleHash(`energies-${sign}-${mood}-${dateStr}`);
  return ENERGY_SETS[hash % ENERGY_SETS.length];
}
