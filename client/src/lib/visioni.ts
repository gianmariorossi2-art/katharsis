export type RelationshipType =
  | 'fidanzato'
  | 'amica'
  | 'parente'
  | 'collega'
  | 'rivale'
  | 'sconosciuto';

interface PersonReading {
  intro: string;
  core: string;
  warning: string;
  final: string;
}

const readings: Record<RelationshipType, PersonReading[]> = {
  fidanzato: [
    {
      intro: 'Le carte vedono chiaramente l\'energia di questa persona.',
      core: 'C\'è un fuoco genuino qui — ma le fiamme più belle bruciano anche di più se non vengono nutrite con attenzione. Questa persona ti vuole bene, ma porta con sé una paura antica di non essere abbastanza. È quella paura, non la mancanza di sentimento, che a volte crea distanza.',
      warning: 'Attenzione: c\'è qualcosa che questa persona non ti ha ancora detto. Non per malicia — per paura della tua reazione. Il momento giusto per quella conversazione si avvicina.',
      final: 'Le stelle dicono: la cosa più coraggiosa che potete fare è essere onesti, anche quando fa paura.',
    },
    {
      intro: 'Vedo questa persona con grande chiarezza.',
      core: 'Questa anima è in transizione — sta crescendo verso qualcosa di più grande di sé stessa, e tu ne fai parte. Non sempre sa come dirtelo, e a volte quella difficoltà la trasforma in silenzio. Il silenzio non è assenza — è elaborazione.',
      warning: 'Le carte segnalano: state attraversando un momento in cui entrambi avete aspettative che l\'altro non conosce. Dite ad alta voce quello che volete, non quello che pensate l\'altro voglia sentire.',
      final: 'Il futuro di questa connessione dipende da quante verità siete disposti a portare alla luce.',
    },
    {
      intro: 'Questa persona porta un\'energia complessa.',
      core: 'C\'è lealtà profonda qui — il tipo che non si proclama a gran voce ma che si manifesta nei piccoli gesti quotidiani. Questa persona ha costruito un muro attorno al cuore, e il fatto che tu sia riuscito a entrare significa molto più di quanto lei sappia esprimere.',
      warning: 'Occhio ai momenti in cui cerca di controllare più del necessario — è la sua forma di dire "ho paura di perderti". La comprensione funziona meglio della resistenza.',
      final: 'Le stelle vogliono che tu sappia: vale la pena.',
    },
  ],

  amica: [
    {
      intro: 'Le carte parlano di una connessione importante.',
      core: 'Questa persona è una delle poche che ti vede davvero — non solo la versione di te che presenti al mondo, ma quella che emerge alle 2 di notte quando le cose si complicano. Questo tipo di amicizia è rara e va custodita come si custodisce una fiamma nel vento.',
      warning: 'Le carte vedono uno squilibrio sottile: una delle due parti sta dando di più in questo periodo. Non è ancora un problema — ma lo diventerà se non viene riconosciuto.',
      final: 'Dì a questa persona quello che provi davvero. L\'amicizia vera regge la verità.',
    },
    {
      intro: 'Questa anima è legata alla tua da qualcosa di antico.',
      core: 'C\'è una lealtà in questa persona che va oltre la convenienza o il dovere sociale. Ti ha scelto in un momento in cui poteva scegliere di non farlo, e quella scelta dice tutto. Porta però anche le sue zone d\'ombra — momenti di invidia mascherata da supporto, o silenzi quando le parole sarebbero più utili.',
      warning: 'Le stelle segnalano: qualcosa che ha detto recentemente ti ha ferito di più di quanto tu abbia ammesso. Quella ferita merita attenzione prima che diventi una crepa.',
      final: 'Le amicizie più solide sopravvivono anche ai conflitti detti ad alta voce.',
    },
    {
      intro: 'Le carte mostrano una relazione in evoluzione.',
      core: 'Questa persona sta cambiando — sta diventando una versione diversa di sé stessa, e una parte di te teme che quel cambiamento vi allontani. Non è necessariamente vero. Le persone che crescono insieme non devono crescere allo stesso modo — basta crescere nella stessa direzione generale.',
      warning: 'Attenzione: la competizione non dichiarata è il veleno più lento nelle amicizie. Se senti quell\'energia, meglio nominarla.',
      final: 'Questa connessione vale la fatica di navigare il cambiamento.',
    },
  ],

  parente: [
    {
      intro: 'Le carte di sangue parlano sempre in modo diverso.',
      core: 'Con i parenti il karma è più denso — ci sono dinamiche trasmesse di generazione in generazione che nessuno dei due ha scelto ma entrambi state portando. Questa persona in particolare porta una ferita antica che si manifesta nel modo in cui si relaziona a te. Non è personale — anche quando sembra personalissimo.',
      warning: 'Le stelle vedono un vecchio conflitto irrisolto che si ripresenta sotto forma di piccole tensioni quotidiane. La radice è più profonda di quello che sembra in superficie.',
      final: 'A volte la cosa più sana è capire cosa si può lasciar andare senza perdere se stessi.',
    },
    {
      intro: 'Il legame di sangue porta una complessità unica.',
      core: 'Questa persona ti ama — ma amare non significa sempre saper dimostrarlo. C\'è una generazione di distanza emotiva tra il modo in cui ha imparato a esprimere affetto e quello che tu cerchi o di cui hai bisogno. Questo non è un difetto — è una formazione storica.',
      warning: 'Le carte segnalano che aspettarti da questa persona quello che non ti ha mai dato è una fonte di dolore ricorrente. Cambia l\'aspettativa, non la persona.',
      final: 'Puoi voler bene a qualcuno e allo stesso tempo proteggere il tuo spazio emotivo da lui.',
    },
    {
      intro: 'L\'energia di questa persona è intrecciata alla tua da molto.',
      core: 'C\'è qualcosa che questa persona fa bene che non le hai mai detto apertamente. E c\'è qualcosa che ti pesa che non le hai mai detto perché sembrava più facile tacere. Le cose non dette con i parenti diventano muri — e i muri diventano abitudine.',
      warning: 'Le stelle vedono un momento di tensione imminente — ma anche la possibilità rara di una chiarezza nuova se navigato con cura.',
      final: 'La famiglia non è il luogo in cui dobbiamo per forza capirci — ma è il luogo in cui vale la pena provarci.',
    },
  ],

  collega: [
    {
      intro: 'Le carte del lavoro rivelano dinamiche interessanti.',
      core: 'Questa persona è più complicata di quanto appaia in superficie. In un contesto professionale presenta una faccia — competente, affidabile, strategica — ma sotto c\'è una persona che ha più insicurezze di quante lasci trasparire. Questo non la rende meno brava nel suo lavoro. La rende umana.',
      warning: 'Attenzione: questo collega potrebbe prendersi credito per un tuo contributo in futuro — non per cattiveria ma per opportunismo automatico. Documenta il tuo lavoro.',
      final: 'Le stelle consigliano: cordialità sì, fiducia cieca no.',
    },
    {
      intro: 'Vedo chiaramente l\'energia di questo rapporto professionale.',
      core: 'C\'è un\'alleanza potenziale qui che non state ancora sfruttando pienamente. Questa persona ha competenze che tu non hai, e viceversa — e un certo orgoglio reciproco ha finora impedito la collaborazione piena. Chi abbassa la guardia per primo guadagna di più.',
      warning: 'Le carte vedono una conversazione difficile che si sta avvicinando riguardo responsabilità o riconoscimento. Prepara il tuo punto di vista con fatti, non emozioni.',
      final: 'Le relazioni professionali migliori nascono quando la gerarchia lascia spazio alla complementarità.',
    },
    {
      intro: 'Questa persona porta un\'energia ambivalente.',
      core: 'In superficie c\'è collaborazione — ma sotto c\'è una competizione non dichiarata. Questa persona ti osserva più di quanto tu pensi, e non è necessariamente un male: significa che ti considera un punto di riferimento. Il problema nasce se quella osservazione diventa emulazione o sabotaggio.',
      warning: 'Le stelle segnalano: non condividere i tuoi piani più ambiziosi in questo contesto prima che siano già in moto.',
      final: 'Nell\'ambiente lavorativo, la discrezione è una forma di potere.',
    },
  ],

  rivale: [
    {
      intro: 'Le carte rivelano qualcosa di potente su questa persona.',
      core: 'Il tuo rivale ti annoia o ti stimola? Perché le due cose sono molto diverse. Se ti stimola, stai usando l\'energia nel modo giusto. Se ti annoia, stai già vincendo — anche se non lo sai ancora. La vera rivalità nasce sempre dal riconoscimento: per rivaleggiare con qualcuno bisogna riconoscergli un valore.',
      warning: 'Le stelle vedono che questa persona sta copiando qualcosa di tuo — un\'idea, uno stile, un approccio. Consideralo la forma più sincera di ammirazione mal gestita.',
      final: 'Il modo migliore di battere un rivale è diventare così buono che smette di essere rilevante.',
    },
    {
      intro: 'Questa energia è intensa — le carte lo sentono chiaramente.',
      core: 'C\'è qualcosa che questa persona ha che tu vuoi — o qualcosa che vuole ciò che hai tu. In entrambi i casi, la rivalità è uno specchio: ti dice cosa desideri davvero e dove senti che non sei ancora abbastanza. Quella sensazione è informazione preziosa, non un nemico.',
      warning: 'Attenzione: sprecare energia a monitorare cosa fa il tuo rivale è energia sottratta al tuo cammino. Le stelle dicono: guarda avanti.',
      final: 'Le persone che ti sfidano di più spesso sono quelle che ti fanno crescere di più. Anche se è fastidioso ammetterlo.',
    },
    {
      intro: 'Le carte parlano di una dinamica che ha radici profonde.',
      core: 'Questo rivale non è del tutto diverso da te — e questa è la parte più scomoda. C\'è una risonanza tra le vostre energie che rende la tensione persistente. La gente non si scontra con chi è completamente diverso: si scontra con chi è abbastanza simile da risultare una minaccia o uno specchio.',
      warning: 'Le stelle segnalano: questa rivalità potrebbe trasformarsi — in collaborazione, indifferenza, o qualcosa di più complesso. Il prossimo passo è tuo.',
      final: 'Non lasciare che qualcuno viva nella tua testa senza pagare l\'affitto.',
    },
  ],

  sconosciuto: [
    {
      intro: 'Interessante — questa persona è ancora un mistero per te.',
      core: 'Le carte parlano di prime impressioni. E la prima impressione che questa persona ti dà contiene già una verità — non tutta, ma una parte significativa. Quella cosa che hai notato per prima? Prestagli attenzione. L\'inconscio raccoglie informazioni molto più velocemente della mente razionale.',
      warning: 'Le stelle vedono che questa persona ha più strati di quanti ne mostra al primo incontro. Quello che vedi ora è solo la copertina — e i libri con le copertine più semplici sono spesso i più profondi.',
      final: 'Procedi con curiosità aperta e riserva il giudizio definitivo per quando avrai più dati.',
    },
    {
      intro: 'Le carte possono vedere anche chi non conosci ancora.',
      core: 'C\'è qualcosa in questa persona che ti ha colpito — altrimenti non saresti qui a chiedere alle stelle. Quella curiosità è già una risposta: la tua intuizione ha rilevato qualcosa di interessante prima ancora che la tua mente razionale abbia elaborato le informazioni.',
      warning: 'Attenzione: le persone che sembrano molto sicure di sé al primo incontro spesso nascondono le insicurezze più profonde. E viceversa.',
      final: 'Le stelle dicono: incontrala di nuovo. Le prime impressioni si costruiscono su basi troppo piccole.',
    },
    {
      intro: 'Uno sconosciuto — le carte si illuminano di curiosità.',
      core: 'Questa persona è entrata nel tuo campo di attenzione per una ragione. Potrebbe essere casuale, potrebbe essere significativa — le stelle non fanno distinzione. Quello che conta è cosa farai di questa energia. L\'universo tende a mandare le persone giuste nel momento giusto, ma tocca a te aprire la porta.',
      warning: 'Le carte segnalano: non lasciare che la distanza rimanga troppo a lungo allo stato di "sconosciuto" se c\'è curiosità reale. L\'occasione potrebbe non ripresentarsi nella stessa forma.',
      final: 'A volte uno sconosciuto diventa la persona più importante della tua storia. Non ancora — ma a volte.',
    },
  ],
};

function deterministicIndex(seed: string, max: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % max;
}

export async function getPersonReading(
  relationship: RelationshipType,
  imageFileName?: string
): Promise<PersonReading> {
  // Fake thinking delay
  await new Promise((r) => setTimeout(r, 2200));

  const seed = `${relationship}-${imageFileName ?? 'nophoto'}-${new Date().toDateString()}`;
  const pool = readings[relationship];
  const idx = deterministicIndex(seed, pool.length);
  return pool[idx];
}

export const RELATIONSHIP_OPTIONS: { id: RelationshipType; label: string; emoji: string }[] = [
  { id: 'fidanzato', label: 'Fidanzato/a', emoji: '💑' },
  { id: 'amica', label: 'Amico/a', emoji: '🤝' },
  { id: 'parente', label: 'Parente', emoji: '🏠' },
  { id: 'collega', label: 'Collega', emoji: '💼' },
  { id: 'rivale', label: 'Rivale', emoji: '⚔️' },
  { id: 'sconosciuto', label: 'Sconosciuto/a', emoji: '🌫️' },
];
