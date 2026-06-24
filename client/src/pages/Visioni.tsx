import { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  getPersonReading,
  RELATIONSHIP_OPTIONS,
  type RelationshipType,
} from '@/lib/visioni';
import SparkleField from '@/components/SparkleField';
import GlowCard from '@/components/GlowCard';

type Step = 'upload' | 'select' | 'reading' | 'reveal';

interface Reading {
  intro: string;
  core: string;
  warning: string;
  final: string;
}

function EyeHeroVisual({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#0f0a2e] via-[#0a0820] to-[#080614]">
      {/* Stars */}
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/35 top-4 left-10" />
      <div className="absolute w-1 h-1 rounded-full bg-white/20 top-6 right-14" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-teal-300/25 top-10 left-1/3" />
      <div className="absolute w-0.5 h-0.5 rounded-full bg-white/25 bottom-5 right-10" />
      <div className="absolute w-1 h-1 rounded-full bg-purple-300/20 bottom-4 left-12" />

      {/* Expanding glow rings */}
      <motion.div
        className="absolute rounded-full border border-teal-500/10"
        style={{ width: '90px', height: '46px' }}
        animate={reducedMotion ? {} : { scale: [1, 1.6, 1], opacity: [0.15, 0, 0.15] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full border border-purple-500/10"
        style={{ width: '72px', height: '36px' }}
        animate={reducedMotion ? {} : { scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.6, ease: 'easeInOut' }}
      />

      {/* Eye shape */}
      <div className="relative flex items-center justify-center" style={{ width: '72px', height: '36px' }}>
        {/* Eye outline */}
        <div
          className="absolute inset-0 rounded-full border border-purple-400/40"
          style={{ borderRadius: '50%' }}
        />
        {/* Iris */}
        <motion.div
          className="w-7 h-7 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #2dd4bf, #7c3aed 60%, #3b0764)',
            boxShadow: '0 0 18px rgba(45,212,191,0.5), 0 0 40px rgba(124,58,237,0.2)',
          }}
          animate={reducedMotion ? {} : { scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Pupil */}
        <div className="absolute w-3 h-3 rounded-full bg-black/60 pointer-events-none" />
        {/* Highlight */}
        <div className="absolute w-1 h-1 rounded-full bg-white/60 pointer-events-none"
          style={{ top: '25%', left: '30%' }} />
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #0a0820 80%)' }}
      />
    </div>
  );
}

export default function Visioni() {
  const shouldReduceMotion = useReducedMotion();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | undefined>();
  const [relationship, setRelationship] = useState<RelationshipType | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);
  const [sparkleActive, setSparkleActive] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
      setStep('select');
    };
    reader.readAsDataURL(file);
  }

  async function handleReveal() {
    if (!relationship) return;
    setStep('reading');
    const result = await getPersonReading(relationship, imageFileName);
    setReading(result);
    if (!shouldReduceMotion) setSparkleActive(true);
    setStep('reveal');
    setTimeout(() => setSparkleActive(false), 3000);
  }

  function handleReset() {
    setStep('upload');
    setImagePreview(null);
    setImageFileName(undefined);
    setRelationship(null);
    setReading(null);
    setSparkleActive(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="min-h-screen pb-28 px-4 pt-6 font-body max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-1">
          LETTURA
        </p>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Visioni</h1>
        <p className="text-white/40 text-sm">
          Carica una foto — le carte ti diranno cosa vedono
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 — Upload */}
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <GlowCard
              glowColor="purple"
              heroSlot={<EyeHeroVisual reducedMotion={!!shouldReduceMotion} />}
              heroHeight="h-44"
              className="p-5"
              animate={false}
            >
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-1">
                VISIONI COSMICHE
              </p>
              <h2 className="font-display font-semibold text-white text-xl mb-2">
                Carica una foto
              </h2>
              <p className="text-white/50 text-sm mb-4">
                Le carte ti diranno cosa vedono in questa persona
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 rounded-full bg-purple-600 hover:bg-purple-500 border border-purple-500/40 text-white font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95"
              >
                Scegli una foto
              </button>
            </GlowCard>

            <p className="text-center text-white/20 text-xs mt-4 leading-relaxed max-w-xs mx-auto">
              La foto non viene analizzata da sistemi esterni. Le visioni sono un&apos;arte interpretativa.
            </p>
          </motion.div>
        )}

        {/* STEP 2 — Select relationship */}
        {step === 'select' && imagePreview && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
            className="space-y-5"
          >
            <div className="relative w-28 h-28 mx-auto">
              <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-teal-500/40"
                style={{ boxShadow: '0 0 24px rgba(20,184,166,0.2)' }}>
                <img src={imagePreview} alt="Persona" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-purple-900/30 to-transparent" />
            </div>

            <div className="text-center">
              <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-teal-400 mb-1">
                CHI È?
              </p>
              <h2 className="font-display text-xl text-white mb-1">Chi è questa persona?</h2>
              <p className="text-white/40 text-sm">Le carte leggono diversamente in base al legame</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {RELATIONSHIP_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setRelationship(opt.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-left ${
                    relationship === opt.id
                      ? 'border-teal-500/60 bg-teal-500/10 text-teal-400'
                      : 'border-white/8 bg-surface-2/40 text-white/60 hover:border-white/20 hover:text-white/80'
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleReveal}
              disabled={!relationship}
              className={`w-full py-4 rounded-full font-semibold text-base transition-all duration-300 ${
                relationship
                  ? 'bg-teal-500 hover:bg-teal-400 text-white hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] active:scale-[0.98]'
                  : 'bg-surface-2/50 text-white/30 cursor-not-allowed'
              }`}
            >
              {relationship ? 'Rivela la lettura' : 'Seleziona chi è'}
            </button>

            <button onClick={handleReset}
              className="w-full text-white/30 text-sm hover:text-white/50 transition-colors py-2">
              Cambia foto
            </button>
          </motion.div>
        )}

        {/* STEP — Loading */}
        {step === 'reading' && (
          <motion.div
            key="reading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-6 pt-20"
          >
            <div className="relative w-20 h-20 flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border border-teal-500/30"
                animate={shouldReduceMotion ? {} : { scale: [1, 1.3, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-3 rounded-full border border-purple-500/25"
                animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
              />
              <div
                className="w-12 h-12 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #2dd4bf, #7c3aed)',
                  boxShadow: '0 0 20px rgba(45,212,191,0.4)',
                }}
              />
            </div>
            <div className="text-center">
              <p className="font-display text-lg text-white/70">Le carte stanno parlando</p>
              <div className="flex justify-center gap-1 mt-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full bg-teal-400/60"
                    animate={shouldReduceMotion ? {} : { opacity: [0.2, 1, 0.2] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.25 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3 — Reveal reading */}
        {step === 'reveal' && reading && imagePreview && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: 'easeOut' }}
            className="space-y-4"
          >
            <div className="relative flex justify-center">
              <SparkleField active={sparkleActive} color="#2dd4bf" />
              <div className="relative w-24 h-24">
                <div
                  className="w-full h-full rounded-2xl overflow-hidden border-2 border-teal-500/60"
                  style={{ boxShadow: '0 0 24px rgba(20,184,166,0.35)' }}
                >
                  <img src={imagePreview} alt="Persona" className="w-full h-full object-cover" />
                </div>
                {relationship && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-surface-2 border border-white/10 flex items-center justify-center text-lg">
                    {RELATIONSHIP_OPTIONS.find((o) => o.id === relationship)?.emoji}
                  </div>
                )}
              </div>
            </div>

            <div
              className="rounded-2xl border border-teal-500/20 bg-surface-2/60 backdrop-blur-sm p-5 space-y-4"
              style={{ boxShadow: '0 0 32px rgba(20,184,166,0.06)' }}
            >
              <p className="text-white/45 text-sm italic text-center">{reading.intro}</p>

              <div className="border-t border-white/8 pt-4">
                <p className="text-white/80 leading-relaxed text-[15px]">{reading.core}</p>
              </div>

              <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl px-4 py-3">
                <div className="flex items-start gap-2">
                  <span className="text-base mt-0.5">⚠️</span>
                  <p className="text-white/65 text-sm leading-relaxed">{reading.warning}</p>
                </div>
              </div>

              <div className="pt-1">
                <p
                  className="font-display text-teal-400 text-center text-[15px] italic leading-relaxed"
                  style={{ textShadow: '0 0 12px rgba(45,212,191,0.35)' }}
                >
                  ✦ {reading.final} ✦
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={async () => {
                  const text = `✦ Visione delle carte ✦\n\n${reading.core}\n\n⚠️ ${reading.warning}\n\n${reading.final}\n\n— Katharsis`;
                  await navigator.clipboard.writeText(text);
                }}
                className="flex-1 py-3 rounded-full border border-white/10 text-white/50 text-sm hover:border-white/20 hover:text-white/70 transition-all"
              >
                Copia lettura
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-400 text-sm hover:bg-teal-500/25 transition-all"
              >
                Nuova visione
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
