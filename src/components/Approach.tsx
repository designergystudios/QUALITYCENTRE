import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  GitMerge,
  Cpu,
  Award,
  CheckCircle2,
  ArrowRight,
  Clock,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AfroPattern } from './AfroPattern';
import { APPROACH_STEPS } from '../data/content';
import { ApproachStep } from '../types';

interface ApproachProps {
  onOpenConsultation: (phase?: string) => void;
}

export const Approach: React.FC<ApproachProps> = ({ onOpenConsultation }) => {
  const { isDark } = useTheme();
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const activeStep = APPROACH_STEPS[selectedStepIndex];

  return (
    <section
      id="approach"
      className={`relative py-24 overflow-hidden border-t transition-colors duration-300 ${
        isDark ? 'bg-[#0A0E17] border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}
    >
      {/* Afro-Futuristic Geometric Background */}
      <AfroPattern
        variant="diamonds"
        opacity={isDark ? 0.07 : 0.03}
        className="inset-0 pointer-events-none"
      />
      <div
        className={`absolute top-1/3 -right-32 w-80 h-80 rounded-full blur-[130px] pointer-events-none ${
          isDark ? 'bg-amber-500/10' : 'bg-amber-500/15'
        }`}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              isDark
                ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400'
                : 'bg-cyan-50 border-cyan-300 text-cyan-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>THE 4-STAGE TRANSFORMATION BLUEPRINT</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Our Systematic Path to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-sky-500 to-amber-500">
              Audit-Ready Excellence
            </span>
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Moving past chaotic paper binders through a structured four-stage methodology
            engineered specifically for Kenyan and African operating realities.
          </p>
        </div>

        {/* Step Progression Visual Stepper / Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {APPROACH_STEPS.map((step, idx) => {
            const isSelected = selectedStepIndex === idx;
            return (
              <button
                key={step.stepNumber}
                onClick={() => setSelectedStepIndex(idx)}
                className={`relative p-5 rounded-2xl text-left transition-all duration-300 border ${
                  isSelected
                    ? isDark
                      ? 'bg-slate-900/95 border-cyan-400 shadow-[0_8px_30px_rgba(0,180,216,0.25)]'
                      : 'bg-white border-cyan-500 shadow-lg shadow-cyan-100 ring-1 ring-cyan-400'
                    : isDark
                    ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-mono text-2xl font-black ${
                      isSelected
                        ? isDark ? 'text-cyan-400' : 'text-cyan-600'
                        : isDark ? 'text-slate-600' : 'text-slate-400'
                    }`}
                  >
                    {step.stepNumber}
                  </span>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                      isDark
                        ? 'bg-slate-800 text-amber-400 border-slate-700'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {step.duration}
                  </span>
                </div>

                <div
                  className={`text-base font-bold mb-1 transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {step.title}
                </div>
                <div
                  className={`text-xs line-clamp-1 transition-colors ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {step.subtitle}
                </div>

                {isSelected && (
                  <div className="absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive Detailed Stage Visual Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.stepNumber}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-2xl p-0.5 bg-gradient-to-r from-cyan-500/40 via-amber-500/30 to-cyan-500/40 shadow-2xl"
          >
            <div
              className={`relative rounded-[15px] p-6 sm:p-10 border overflow-hidden space-y-8 transition-colors ${
                isDark
                  ? 'bg-[#0F172A] border-slate-800'
                  : 'bg-white border-slate-200 shadow-xl'
              }`}
            >
              
              <div className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none">
                <AfroPattern variant="circuit" opacity={0.6} />
              </div>

              {/* Stage Header */}
              <div
                className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div className="space-y-2">
                  <div
                    className={`flex items-center gap-2 text-xs font-mono font-bold uppercase ${
                      isDark ? 'text-cyan-400' : 'text-cyan-700'
                    }`}
                  >
                    <span
                      className={`px-2 py-0.5 rounded border ${
                        isDark
                          ? 'bg-cyan-950/80 border-cyan-700/60'
                          : 'bg-cyan-50 border-cyan-300'
                      }`}
                    >
                      PHASE {activeStep.stepNumber}
                    </span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                      • {activeStep.duration}
                    </span>
                  </div>
                  <h3
                    className={`text-2xl sm:text-3xl font-black ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {activeStep.title} —{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-amber-500">
                      {activeStep.subtitle}
                    </span>
                  </h3>
                  <p
                    className={`text-sm max-w-3xl leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {activeStep.summary}
                  </p>
                </div>

                <button
                  onClick={() => onOpenConsultation(`Initiate ${activeStep.title}`)}
                  className="flex-shrink-0 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-900 bg-gradient-to-r from-cyan-400 to-amber-400 hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Start with Phase {activeStep.stepNumber}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Deliverables & Digital Toolkit Columns */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Deliverables Column */}
                <div className="md:col-span-7 space-y-4">
                  <div
                    className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 ${
                      isDark ? 'text-amber-400' : 'text-amber-600'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-500" />
                    <span>Tangible Stage Deliverables & Milestones</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {activeStep.deliverables.map((deliv, dIdx) => (
                      <div
                        key={dIdx}
                        className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
                          isDark
                            ? 'bg-slate-900/80 border-slate-800'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5 ${
                            isDark
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-cyan-100 text-cyan-800 font-bold'
                          }`}
                        >
                          {dIdx + 1}
                        </div>
                        <span
                          className={`text-xs sm:text-sm leading-relaxed font-medium ${
                            isDark ? 'text-slate-200' : 'text-slate-800'
                          }`}
                        >
                          {deliv}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Digital Tools Column */}
                <div className="md:col-span-5 space-y-4">
                  <div
                    className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 ${
                      isDark ? 'text-cyan-400' : 'text-cyan-700'
                    }`}
                  >
                    <Cpu className="w-4 h-4 text-cyan-500" />
                    <span>Digital Systems Deployed in Phase</span>
                  </div>

                  <div
                    className={`p-5 rounded-xl border space-y-4 transition-colors ${
                      isDark
                        ? 'bg-slate-900/60 border-slate-800'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="space-y-2">
                      {activeStep.digitalTools.map((tool, tIdx) => (
                        <div
                          key={tIdx}
                          className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs font-semibold ${
                            isDark
                              ? 'bg-slate-950 border-slate-800/80 text-slate-200'
                              : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-cyan-500" />
                          <span>{tool}</span>
                        </div>
                      ))}
                    </div>

                    <div
                      className={`pt-3 border-t text-[11px] leading-relaxed ${
                        isDark
                          ? 'border-slate-800 text-slate-400'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      💡 Every stage is underpinned by our 100% First-Time Audit Pass commitment
                      and complete knowledge transfer to your internal champion team.
                    </div>
                  </div>
                </div>

              </div>

              {/* Sequential Navigator Footer */}
              <div
                className={`pt-4 border-t flex items-center justify-between ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <button
                  disabled={selectedStepIndex === 0}
                  onClick={() => setSelectedStepIndex((prev) => Math.max(0, prev - 1))}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 ${
                    isDark
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  &larr; Previous Phase
                </button>

                <div className="flex items-center gap-2">
                  {APPROACH_STEPS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedStepIndex(idx)}
                      className={`h-2.5 rounded-full transition-all ${
                        selectedStepIndex === idx
                          ? 'w-8 bg-cyan-500'
                          : isDark
                          ? 'w-2.5 bg-slate-700'
                          : 'w-2.5 bg-slate-300'
                      }`}
                      aria-label={`Go to phase ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  disabled={selectedStepIndex === APPROACH_STEPS.length - 1}
                  onClick={() => setSelectedStepIndex((prev) => Math.min(APPROACH_STEPS.length - 1, prev + 1))}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 ${
                    isDark
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Next Phase &rarr;
                </button>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

