import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  Building2,
  MapPin,
  Quote,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AfroPattern } from './AfroPattern';
import { CASE_STUDIES } from '../data/content';
import { CaseStudy } from '../types';

interface SuccessStoriesProps {
  onOpenConsultation: (clientType?: string) => void;
}

export const SuccessStories: React.FC<SuccessStoriesProps> = ({
  onOpenConsultation,
}) => {
  const { isDark } = useTheme();
  const [activeStory, setActiveStory] = useState<CaseStudy>(CASE_STUDIES[0]);

  return (
    <section
      id="success-stories"
      className={`relative py-24 overflow-hidden border-t transition-colors duration-300 ${
        isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}
    >
      <AfroPattern
        variant="chevrons"
        opacity={isDark ? 0.06 : 0.03}
        className="inset-0 pointer-events-none"
      />
      <div
        className={`absolute bottom-10 left-1/4 w-96 h-96 rounded-full blur-[140px] pointer-events-none ${
          isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/15'
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
            <Award className="w-3.5 h-3.5" />
            <span>PROVEN ENTERPRISE IMPACT ACROSS AFRICA</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Transforming Industry Leaders into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-sky-500 to-amber-500">
              Audit-Proof Powerhouses
            </span>
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Real outcomes from leading manufacturing plants, financial institutions, and agricultural exporters
            powered by Quality Centre Limited.
          </p>
        </div>

        {/* Stories Tabs & Active Case Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Case Studies List */}
          <div className="lg:col-span-4 space-y-3">
            <div
              className={`text-xs font-mono uppercase font-bold px-1 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Select Case Study:
            </div>

            {CASE_STUDIES.map((study) => {
              const isSelected = activeStory.id === study.id;
              return (
                <button
                  key={study.id}
                  onClick={() => setActiveStory(study)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                    isSelected
                      ? isDark
                        ? 'bg-slate-900/95 border-cyan-400 shadow-[0_10px_30px_rgba(0,180,216,0.2)]'
                        : 'bg-white border-cyan-500 shadow-md ring-1 ring-cyan-400'
                      : isDark
                      ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[11px] font-mono font-bold uppercase ${
                        isDark ? 'text-amber-400' : 'text-amber-600'
                      }`}
                    >
                      {study.industry}
                    </span>
                    <span
                      className={`text-[10px] flex items-center gap-1 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-cyan-500" />
                      {study.location.split('(')[0]}
                    </span>
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-bold mb-2 leading-snug transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {study.clientType}
                  </h3>

                  <div className="flex flex-wrap gap-1">
                    {study.standards.map((std, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          isDark
                            ? 'bg-slate-800 text-cyan-300'
                            : 'bg-slate-100 text-cyan-800 border border-slate-200 font-medium'
                        }`}
                      >
                        {std}
                      </span>
                    ))}
                  </div>

                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-amber-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Selected Case Study Detailed Workspace */}
          <div className="lg:col-span-8">
            <motion.div
              key={activeStory.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={`rounded-2xl p-6 sm:p-9 border shadow-2xl space-y-8 relative overflow-hidden transition-colors ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800'
                  : 'bg-white border-slate-200 shadow-xl'
              }`}
            >
              {/* Header */}
              <div
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-cyan-500 font-semibold">
                    <Building2 className="w-4 h-4" />
                    <span>{activeStory.industry}</span>
                    <span>•</span>
                    <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                      {activeStory.location}
                    </span>
                  </div>
                  <h3
                    className={`text-2xl sm:text-3xl font-black ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {activeStory.clientType}
                  </h3>
                </div>

                <button
                  onClick={() => onOpenConsultation(`Case Study Inquiry: ${activeStory.clientType}`)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-md whitespace-nowrap"
                >
                  Replicate Similar Architecture
                </button>
              </div>

              {/* Challenge & Solution Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                  className={`p-5 rounded-xl border space-y-2 ${
                    isDark
                      ? 'bg-slate-950/70 border-slate-800'
                      : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="text-xs font-mono uppercase text-rose-500 font-bold">
                    The Initial Bottleneck
                  </div>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {activeStory.challenge}
                  </p>
                </div>

                <div
                  className={`p-5 rounded-xl border space-y-2 ${
                    isDark
                      ? 'bg-slate-950/70 border-slate-800'
                      : 'bg-cyan-50/50 border-cyan-200'
                  }`}
                >
                  <div className="text-xs font-mono uppercase text-cyan-600 font-bold">
                    The Quality Centre Solution
                  </div>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {activeStory.solution}
                  </p>
                </div>
              </div>

              {/* Quantified Outcomes Strip */}
              <div className="space-y-3">
                <div
                  className={`text-xs font-mono uppercase font-bold ${
                    isDark ? 'text-amber-400' : 'text-amber-600'
                  }`}
                >
                  Verifiable Operational Metrics:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {activeStory.results.map((res, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border text-center space-y-1 ${
                        isDark
                          ? 'bg-slate-950 border-slate-800/80'
                          : 'bg-slate-50 border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-amber-500 font-mono">
                        {res.metric}
                      </div>
                      <div
                        className={`text-[11px] font-semibold ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {res.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Executive Testimonial Quote */}
              <div
                className={`p-6 rounded-2xl border relative ${
                  isDark
                    ? 'bg-gradient-to-r from-cyan-950/40 via-slate-900 to-amber-950/30 border-cyan-500/20'
                    : 'bg-gradient-to-r from-cyan-50/60 via-slate-50 to-amber-50/60 border-cyan-200 shadow-sm'
                }`}
              >
                <Quote
                  className={`w-8 h-8 absolute top-4 left-4 pointer-events-none ${
                    isDark ? 'text-cyan-500/30' : 'text-cyan-600/20'
                  }`}
                />
                <div className="relative pl-6 space-y-3">
                  <p
                    className={`text-sm sm:text-base italic leading-relaxed ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    “{activeStory.testimonial.quote}”
                  </p>
                  <div
                    className={`pt-2 border-t flex items-center justify-between text-xs ${
                      isDark ? 'border-slate-800' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {activeStory.testimonial.author}
                      </span>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                        {' '}— {activeStory.testimonial.role}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Verified Client
                    </span>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
};

