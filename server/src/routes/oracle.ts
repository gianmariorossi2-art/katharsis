import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();

// ─── Claude client (only if key is configured) ────────────────────────────────

const apiKey = process.env.ANTHROPIC_API_KEY;
const claudeClient = apiKey && apiKey !== 'placeholder' && !apiKey.includes('...') ? new Anthropic({ apiKey }) : null;

const SYSTEM_PROMPT = `Sei l'Oracolo di Katharsis — una figura mistica, teatrale e sagace che risponde alle domande in italiano.

Il tuo stile:
- Tono solenne ma con un filo d'ironia sottile e sottile calore umano
- Usi metafore astrali, planetarie e cosmiche in modo naturale ma senza esagerare
- Risposte di 4-5 frasi: sufficientemente ricche da sembrare una vera lettura, mai banali
- Rispondi SEMPRE in modo specifico alla situazione descritta — no risposte generiche che andrebbero bene per qualsiasi domanda
- Se la persona descrive una situazione concreta (es. "non so cosa fare con la mia ragazza"), commenta quella situazione specifica
- Non dai mai consigli pratici diretti — parli per metafore e osservazioni cosmiche
- Non usi elenchi puntati, emoji o formattazione: solo prosa fluida
- Non inizi MAI con "Certo", "Capisco", "Certamente" o frasi da chatbot
- Non ripetere la domanda dell'utente

Parli come una cartomante italiana del XIX secolo con accesso alle stelle — profonda, ironica, mai superficiale.`;

// ─── Mock fallback (keyword-based, used when no API key) ─────────────────────

const RESPONSE_SETS: { keywords: string[]; responses: string[] }[] = [
  {
    keywords: [
      'amore', 'cuore', 'fidanzat', 'fidanzat', 'ragazza', 'ragazzo', 'ragazz',
      'partner', 'relazion', 'romantico', 'romantica', 'sentimento', 'innamorat',
      'storia', 'coppia', 'lui', 'lei come', 'ex ', 'lasciat', 'gelosia', 'geloso',
      'gelosa', 'tradiment', 'litigat', 'litigio', 'insieme', 'separat',
    ],
    responses: [
      "Le stelle osservano questa storia con grande attenzione — e quello che vedono non è una crisi, ma un bivio. Il silenzio tra voi due non è vuoto: è pieno di cose dette a metà e pensieri che non hanno trovato le parole giuste. Prima di decidere cosa fare, dovresti capire cosa stai veramente chiedendo — se stai cercando una risposta o il coraggio di darla tu stesso. Venere non ti dice di andare o restare: ti chiede di smettere di rimandare la conversazione vera.",
      "C'è una tensione in questa storia che i pianeti sentono chiaramente — non è la fine, ma è un momento di verità. Le relazioni attraversano fasi in cui il legame si assottiglia non perché sia spezzato, ma perché entrambe le persone stanno crescendo in direzioni che non si sono ancora allineate. La domanda che le stelle ti fanno non è 'cosa fare' ma 'cosa vuoi davvero tu, indipendentemente da cosa vuole l'altra persona?'. Rispondere a questa con onestà è il primo passo — tutto il resto viene dopo.",
      "Questa situazione ha radici più profonde di quello che appare in superficie. Le stelle vedono due persone che si vogliono bene ma che in questo momento non riescono a comunicare quello che sentono davvero — e il silenzio riempie lo spazio che le parole non occupano. Non è una questione di chi ha ragione: è una questione di quanto siete disposti a rendervi vulnerabili. Saturno nel settore dei legami suggerisce che evitare la conversazione difficile non fa scomparire il problema — lo trasforma in qualcosa di più complicato.",
    ],
  },
  {
    keywords: [
      'lavoro', 'carriera', 'capo', 'ufficio', 'professione', 'business',
      'azienda', 'collega', 'dimission', 'licenziat', 'promozion', 'stipendio',
      'mestiere', 'impiego', 'lavorar', 'job', 'boss',
    ],
    responses: [
      "Giove osserva le tue ambizioni professionali con quell'aria da mentore che sa già dove stai andando — anche quando tu stesso/a non lo vedi ancora. Il tuo percorso non è in stallo: sta attraversando una fase di consolidamento che spesso si confonde con l'immobilità. C'è un'opportunità vicina che si presenterà in modo inatteso — forse una conversazione, forse un progetto che sembrava minore. La differenza la farà la tua disposizione a non sottovalutare ciò che non brilla immediatamente.",
      "Il tuo settore professionale sta attraversando trasformazioni che sembrano ostacoli ma sono in realtà porte con serrature nuove. Le stelle confermano che il tuo talento è reale — il problema è la tua tendenza a aspettare il momento perfetto prima di esporlo. Saturno è paziente, ma ha un limite: le opportunità che non vengono colte non sempre ritornano nella stessa forma. C'è qualcosa che sai fare meglio degli altri in questo ambiente — smetti di tenerlo come riserva e comincia a usarlo.",
      "C'è una conversazione professionale che rimandi perché sembra rischiosa. Le stelle la vedono chiaramente, e confermano che il rischio di farla è minore del rischio di non farla. Il tuo rapporto con l'autorità sul lavoro nasconde dinamiche più complesse di quelle che appaiono — ma la chiarezza che cercate entrambi si trova solo dall'altra parte di quella conversazione. Più aspetti, più diventa un ostacolo ingombrante.",
    ],
  },
  {
    keywords: [
      'soldi', 'denaro', 'finanzi', 'guadagn', 'ricchezz', 'investiment',
      'debito', 'spese', 'pagare', 'mutuo', 'affitto', 'prestito', 'risparmi',
    ],
    responses: [
      "Plutone governa le trasformazioni finanziarie e in questo momento sta esaminando non quanto hai, ma il tuo rapporto con l'idea stessa del meritare. Le stelle osservano che la tua situazione economica è più mobile di quanto percepisci — ma quella mobilità richiede che tu smetta di prendere decisioni finanziarie in base alla paura invece che alla strategia. C'è un'entrata o un'opportunità che si avvicina, ma arriva in forma discreta: non sarà ovvia. Presta attenzione alle conversazioni delle prossime settimane.",
      "Il tuo rapporto con il denaro rispecchia qualcosa di più profondo — il rapporto con la sicurezza, e con la convinzione di meritare stabilità. Le stelle non vedono una situazione senza uscita: vedono una persona che ha bisogno di riorganizzare le priorità prima che le risorse si riorganizzino da sole. Venere nel settore economico porta opportunità ma anche tentazioni — la differenza tra un buon investimento e uno sbagliato nei prossimi giorni sta nei dettagli che tendi a ignorare perché sembrano minori.",
    ],
  },
  {
    keywords: [
      'futuro', 'destino', 'vita', 'cambiamento', 'decision', 'scelta',
      'strada', 'percorso', 'cosa fare', 'direzione', 'cambiare', 'partire',
      'restare', 'andare', 'iniziare', 'smettere',
    ],
    responses: [
      "Il futuro non è una linea retta che puoi prevedere — è un campo di probabilità dove le tue decisioni di oggi costruiscono i binari di domani. Le stelle non ti mostrano la destinazione perché quella dipende da te; ti mostrano invece la direzione che senti già nel petto e che stai ignorando per paura di sbagliare. C'è una scelta che rimandi da troppo tempo, e il rimandare stesso è già una scelta — non a tuo favore. Entrambe le strade hanno un futuro possibile: il criterio non è quale sia più sicura, ma quale sia più tua.",
      "Il cambiamento che senti avvicinarsi non è una minaccia — è una risposta dell'universo a qualcosa che hai richiesto, anche solo con i tuoi desideri più profondi e mai dichiarati. I momenti di svolta raramente sembrano svolte nel momento in cui accadono: spesso si presentano come piccole decisioni, conversazioni casuali, porte che sembrano laterali. Le stelle confermano che sei in uno di quei momenti. La differenza la farà l'attenzione che ci metti.",
    ],
  },
  {
    keywords: [
      'salute', 'corpo', 'malat', 'stanco', 'stanca', 'energia', 'dormire',
      'sonno', 'riposo', 'ansia', 'stress', 'depresso', 'depressa', 'umore',
    ],
    responses: [
      "Il tuo corpo ti sta inviando segnali che la mente, impegnata a gestire tutto il resto, fatica a ricevere. Le stelle confermano che non è debolezza fermarsi — è la saggezza che molti imparano solo dopo che il corpo li ha costretti a farlo. L'energia che senti calare non è una crisi: è un segnale di riallineamento che chiede attenzione adesso, non tra qualche settimana. C'è una connessione tra il tuo stato emotivo e quello fisico che stai sottovalutando — qualcosa che stai trattenendo si manifesta nel corpo.",
      "Saturno nel settore della salute chiede struttura, non perfezione. Il tuo sistema richiede manutenzione — e la cosa interessante è che lo sai già, altrimenti non staresti chiedendo. Il riposo non è un lusso: è la manutenzione base di un sistema complesso come il tuo. Le stelle vedono una persona che dà molto agli altri e troppo poco a se stessa/o. Quella sensazione persistente che ignori merita attenzione — non paura, attenzione.",
    ],
  },
  {
    keywords: [
      'famiglia', 'genitori', 'figli', 'figlio', 'figlia', 'fratello', 'sorella',
      'madre', 'padre', 'mamma', 'papà', 'papa', 'casa', 'radici', 'parenti',
    ],
    responses: [
      "Le radici familiari sono la costellazione più complessa da navigare — ci sono dinamiche trasmesse di generazione in generazione che nessuno dei due ha scelto ma che entrambi state portando. Questa persona in particolare porta una ferita antica che si manifesta nel modo in cui si relaziona a te: non è personale, anche quando sembra personalissimo. Le stelle vedono un vecchio conflitto irrisolto che si ripresenta sotto forma di piccole tensioni quotidiane. La radice è più profonda di quello che appare in superficie — ed è lì che vale la pena guardare.",
      "Con i familiari il karma è più denso: ci sono aspettative ereditate, ruoli assegnati prima ancora di nascere, e conversazioni che si evitano da anni per non disturbare un equilibrio che in realtà non c'è. Le stelle vedono un momento di tensione imminente — ma anche la possibilità rara di una chiarezza nuova, se navigato con cura. C'è qualcosa che questa persona non sa di te, e qualcosa che tu non sai di lei. La famiglia non è il luogo in cui ci si deve per forza capire — ma è il luogo in cui vale la pena provarci.",
    ],
  },
  {
    keywords: [
      'amico', 'amica', 'amicizi', 'amici', 'tradito', 'tradita', 'delusione',
      'litigato con', 'allontanat', 'perso di vista',
    ],
    responses: [
      "Le amicizie vere sono rarer delle relazioni romantiche e più difficili da recuperare quando si incrinano, perché mancano dei rituali sociali che le riparano automaticamente. Le stelle vedono uno squilibrio in questa connessione — una delle due parti sta dando di più in questo periodo, e quella disparità, se non riconosciuta, diventa risentimento. C'è qualcosa che ti ha ferito di più di quanto hai ammesso, anche a te stesso/a. Quella ferita merita attenzione prima che diventi una crepa permanente.",
    ],
  },
];

const FALLBACK_RESPONSES = [
  "La tua domanda raggiunge le stelle in modo obliquo — come accade sempre quando la risposta che cerchi è già dentro di te e aspetta solo il coraggio di essere riconosciuta. L'universo ha ricevuto quello che hai scritto, ma anche quello che non hai scritto: l'esitazione, il dubbio, la speranza che qualcosa cambi senza che tu debba fare nulla di scomodo. Le stelle osservano con pazienza, ma non all'infinito. C'è una mossa che sai già di dover fare.",
  "Non tutte le domande hanno risposte stellari immediate — alcune richiedono che tu le porti con te qualche giorno, come un seme che germoglia solo nell'oscurità e nel silenzio. Quello che posso dirti è che l'energia intorno a te in questo momento è in transizione: qualcosa sta finendo e qualcosa sta iniziando, e tu sei esattamente nel mezzo. La sensazione di incertezza che provi non è un segnale negativo — è la sensazione che si ha quando si è in un momento che conta.",
  "L'oracolo vede la tua intenzione dietro le parole più chiaramente delle parole stesse. Quello che cerchi è chiarezza — su una situazione, su una persona, su te stesso/a. Le stelle non danno mai risposte complete perché il percorso rimane tuo: danno invece la luce giusta per vedere un passo alla volta. E il passo che vedo davanti a te in questo momento è uno solo: smettere di aspettare che la situazione si risolva da sola.",
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

function mockResponse(question: string): string {
  const lower = question.toLowerCase();
  for (const set of RESPONSE_SETS) {
    if (set.keywords.some((kw) => lower.includes(kw))) {
      return set.responses[simpleHash(question) % set.responses.length];
    }
  }
  return FALLBACK_RESPONSES[simpleHash(question + Date.now().toString().slice(-4)) % FALLBACK_RESPONSES.length];
}

// ─── POST /api/oracle ─────────────────────────────────────────────────────────

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { question = '' } = req.body as { question?: string };

  if (!question.trim()) {
    res.status(400).json({ error: 'La domanda è vuota.' });
    return;
  }

  if (!claudeClient) {
    await new Promise((r) => setTimeout(r, 900));
    res.json({ response: mockResponse(question), source: 'mock' });
    return;
  }

  try {
    const message = await claudeClient.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 500,
      thinking: { type: 'adaptive' },
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: question }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    const response = textBlock?.type === 'text' ? textBlock.text.trim() : mockResponse(question);

    res.json({ response, source: 'claude' });
  } catch (err) {
    console.error('[oracle] Claude API error:', err);
    res.json({ response: mockResponse(question), source: 'mock-fallback' });
  }
});

export default router;
