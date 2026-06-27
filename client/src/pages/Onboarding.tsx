import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { track } from '@/lib/analytics';

const ONBOARDED_KEY = 'katharsis_onboarded';

const STEPS = ['data', 'ora', 'luogo'] as const;
type Step = typeof STEPS[number];

const STEP_META: Record<Step, { icon: string; title: string; subtitle: string }> = {
  data:  { icon: '📅', title: 'Quando sei nato/a?',     subtitle: 'La data di nascita permette al nostro oracolo di calcolare i tuoi transiti planetari personali' },
  ora:   { icon: '🌙', title: 'A che ora sei nato/a?',  subtitle: "L'ora esatta rivela l'Ascendente — la maschera che mostri al mondo. Puoi anche saltare se non la conosci" },
  luogo: { icon: '🌍', title: 'Dove sei nato/a?',       subtitle: 'Il luogo definisce la posizione delle case astrologiche nel tuo tema natale' },
};

export default function Onboarding() {
  const { updateProfile } = useApp();
  const [step, setStep] = useState<Step>('data');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [saving, setSaving] = useState(false);

  const stepIndex = STEPS.indexOf(step);
  const meta = STEP_META[step];

  function nextStep() {
    if (step === 'data')  setStep('ora');
    if (step === 'ora')   setStep('luogo');
    if (step === 'luogo') handleComplete();
  }

  async function handleComplete() {
    setSaving(true);
    localStorage.setItem(ONBOARDED_KEY, 'true');
    track('onboarding_complete', { has_time: !!birthTime, has_place: !!birthPlace });
    await updateProfile({
      birth_date: birthDate || null,
      birth_time: birthTime || null,
      birth_place: birthPlace.trim() || null,
      onboarding_complete: true,
    });
  }

  async function handleSkip() {
    localStorage.setItem(ONBOARDED_KEY, 'true');
    track('onboarding_skipped', { step });
    await updateProfile({ onboarding_complete: true });
  }

  const canProceed = step === 'data' ? !!birthDate : true;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-5 py-10"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.18) 0%, #07060f 60%)' }}
    >
      {/* Top: logo + step dots */}
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-8">
          <p className="font-label text-[10px] tracking-[0.3em] text-[#4a4468] uppercase">KATHARSIS</p>
          <div className="flex gap-2">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === stepIndex ? '20px' : '6px',
                  height: '6px',
                  background: i <= stepIndex ? '#a78bfa' : 'rgba(255,255,255,0.1)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* Cosmic orb */}
            <div className="flex justify-center mb-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, rgba(167,139,250,0.3), rgba(124,58,237,0.15))',
                  border: '1px solid rgba(167,139,250,0.25)',
                  boxShadow: '0 0 40px rgba(124,58,237,0.2)',
                }}
              >
                {meta.icon}
              </div>
            </div>

            <h2 className="font-display font-light text-[#f0eeff] text-2xl text-center mb-2 leading-snug">
              {meta.title}
            </h2>
            <p className="font-body text-[#6b6491] text-sm text-center mb-8 leading-relaxed">
              {meta.subtitle}
            </p>

            {/* Inputs */}
            {step === 'data' && (
              <div>
                <label className="font-label text-[9px] tracking-[0.18em] text-[#9b93c4] uppercase block mb-2">
                  Data di nascita
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full bg-[#13112a] border border-[rgba(139,92,246,0.2)] rounded-2xl px-5 py-4 text-[#f0eeff] text-base focus:outline-none focus:border-[#a78bfa] transition-colors"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            )}

            {step === 'ora' && (
              <div>
                <label className="font-label text-[9px] tracking-[0.18em] text-[#9b93c4] uppercase block mb-2">
                  Ora di nascita <span className="text-[#4a4468] normal-case">(opzionale)</span>
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={e => setBirthTime(e.target.value)}
                  className="w-full bg-[#13112a] border border-[rgba(139,92,246,0.2)] rounded-2xl px-5 py-4 text-[#f0eeff] text-base focus:outline-none focus:border-[#a78bfa] transition-colors"
                  style={{ colorScheme: 'dark' }}
                />
                <p className="font-body text-[#4a4468] text-xs text-center mt-3">
                  Trovala sul certificato di nascita o chiedi ai tuoi genitori
                </p>
              </div>
            )}

            {step === 'luogo' && (
              <div>
                <label className="font-label text-[9px] tracking-[0.18em] text-[#9b93c4] uppercase block mb-2">
                  Città di nascita <span className="text-[#4a4468] normal-case">(opzionale)</span>
                </label>
                <input
                  type="text"
                  value={birthPlace}
                  onChange={e => setBirthPlace(e.target.value)}
                  placeholder="es. Roma, Milano, Napoli..."
                  className="w-full bg-[#13112a] border border-[rgba(139,92,246,0.2)] rounded-2xl px-5 py-4 text-[#f0eeff] text-base placeholder-[#4a4468] focus:outline-none focus:border-[#a78bfa] transition-colors"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="w-full max-w-sm space-y-3">
        <motion.button
          onClick={nextStep}
          disabled={!canProceed || saving}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-full font-label tracking-[0.1em] text-white font-semibold text-sm disabled:opacity-40 transition-all"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}
        >
          {saving
            ? 'Salvataggio...'
            : step === 'luogo'
              ? 'Inizia il viaggio ✦'
              : 'Continua'
          }
        </motion.button>

        {step !== 'data' && (
          <button
            onClick={step === 'luogo' ? handleComplete : nextStep}
            disabled={saving}
            className="w-full py-3 font-body text-[#4a4468] text-sm hover:text-[#9b93c4] transition-colors"
          >
            {step === 'luogo' ? 'Salta e inizia' : 'Non la conosco, salta'}
          </button>
        )}

        {step === 'data' && (
          <button
            onClick={handleSkip}
            disabled={saving}
            className="w-full py-3 font-body text-[#4a4468] text-xs hover:text-[#6b6491] transition-colors"
          >
            Salta configurazione
          </button>
        )}
      </div>
    </div>
  );
}
