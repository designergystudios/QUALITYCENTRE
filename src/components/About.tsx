import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle,
  Cpu,
  FileText,
  Workflow,
  Sparkles,
  Shield,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Lock,
  Boxes,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AfroPattern } from './AfroPattern';
import { COMPANY_DETAILS, TECH_PARTNERS } from '../data/content';

interface AboutProps {
  onOpenConsultation: (topic?: string) => void;
}

export const About: React.FC<AboutProps> = ({ onOpenConsultation }) => {
  const { isDark } = useTheme();
  const [selectedPartner, setSelectedPartner] = useState<'SoftExpert' | 'PECB'>('SoftExpert');

  return (
    <section
      id="about"
      className={`relative py-24 overflow-hidden border-t transition-colors duration-300 ${
        isDark ? 'bg-[#0A0E17] border-slate-800/80' : 'bg-white border-slate-200'
      }`}
    >
      {/* Subtle Afro Background Geometric Lines */}
      <AfroPattern
        variant="chevrons"
        opacity={isDark ? 0.07 : 0.04}
        className="inset-0 pointer-events-none"
      />
      <div
        className={`absolute -top-32 right-10 w-96 h-96 rounded-full blur-[130px] pointer-events-none ${
          isDark ? 'bg-cyan-600/10' : 'bg-cyan-500/15'
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
            <Shield className="w-3.5 h-3.5" />
            <span>WHO WE ARE • 26+ YEARS OF CORPORATE EXCELLENCE</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Engineering High-Performance{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-sky-500 to-amber-500">
              Operating Systems
            </span>
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Quality Centre Limited is Kenya’s premier management systems performance, digital
            transformation, and sustainability solution provider—bridging international standard
            rigor with enterprise software agility.
          </p>
        </div>

        {/* Mission Statement Box with Afro-Futuristic Framing */}
        <div className="relative rounded-2xl p-0.5 bg-gradient-to-r from-cyan-500/40 via-amber-500/30 to-cyan-500/40 shadow-xl">
          <div
            className={`relative rounded-[15px] backdrop-blur-md p-8 sm:p-10 border overflow-hidden transition-colors ${
              isDark ? 'bg-[#0F172A]/95 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="absolute top-0 right-0 w-48 h-48 opacity-15 pointer-events-none">
              <AfroPattern variant="circuit" opacity={0.6} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div
                  className={`flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase ${
                    isDark ? 'text-amber-400' : 'text-amber-600'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Our Core Purpose & Mission Statement
                </div>
                <blockquote
                  className={`text-xl sm:text-2xl md:text-3xl font-bold leading-snug transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  “Empowering organizations to succeed through{' '}
                  <span className="text-cyan-500 underline decoration-amber-500/50 decoration-wavy decoration-2">
                    faster, easier, and better
                  </span>{' '}
                  business processes.”
                </blockquote>
                <p
                  className={`text-sm sm:text-base leading-relaxed pt-2 transition-colors ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  For over two decades, Kenyan and regional leaders have turned to Quality Centre Limited
                  to eliminate manual compliance burdens, eradicate audit anxiety, and transform
                  regulatory compliance into a powerful engine for market dominance and global competitiveness.
                </p>
              </div>

              <div
                className={`lg:col-span-4 flex flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l lg:pl-8 pt-4 lg:pt-0 transition-colors ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Our Three Pillars of Impact
                </div>
                <div
                  className={`flex items-center gap-3 text-sm font-medium ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-500 font-bold text-xs">
                    01
                  </div>
                  <span>Velocity: 60%+ Faster Audit Prep</span>
                </div>
                <div
                  className={`flex items-center gap-3 text-sm font-medium ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-600 font-bold text-xs">
                    02
                  </div>
                  <span>Simplicity: Zero Bureaucracy Paperwork</span>
                </div>
                <div
                  className={`flex items-center gap-3 text-sm font-medium ${
                    isDark ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 font-bold text-xs">
                    03
                  </div>
                  <span>Resilience: 100% Audit Readiness Always</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Quantitative Impact Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {COMPANY_DETAILS.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-xl p-6 relative overflow-hidden border transition-all ${
                isDark
                  ? 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40 shadow-md'
                  : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm shadow-slate-200/60'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-sky-500 to-amber-500 font-mono">
                {stat.value}
              </div>
              <div
                className={`text-sm font-bold mt-1 transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {stat.label}
              </div>
              <div
                className={`text-xs mt-2 leading-relaxed transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {stat.desc}
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl" />
            </motion.div>
          ))}
        </div>

        {/* Technology Partners Section (SoftExpert & PECB) */}
        <div className="space-y-8 pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-500 uppercase tracking-wider mb-2">
                <Cpu className="w-4 h-4 text-cyan-500" />
                Global Technology Alliances
              </div>
              <h3
                className={`text-2xl sm:text-3xl font-bold transition-colors ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Powered by World-Class Digital Platforms
              </h3>
              <p
                className={`text-sm mt-1 max-w-2xl transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                We combine strategic Kenyan management consulting with premier global enterprise software—giving
                organizations automated document intelligence and bulletproof audit trails.
              </p>
            </div>

            {/* Partner Selector Toggle */}
            <div
              className={`flex p-1 border rounded-xl transition-colors ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}
            >
              {TECH_PARTNERS.map((partner) => (
                <button
                  key={partner.name}
                  onClick={() => setSelectedPartner(partner.name as any)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    selectedPartner === partner.name
                      ? partner.name === 'SoftExpert'
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                        : 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Workflow className="w-4 h-4" />
                  <span>{partner.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Tech Partner Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {TECH_PARTNERS.map((partner) => {
              const isSelected = selectedPartner === partner.name;
              return (
                <motion.div
                  key={partner.name}
                  layout
                  className={`rounded-2xl p-6 sm:p-8 transition-all duration-300 relative overflow-hidden border ${
                    isSelected
                      ? isDark
                        ? 'bg-slate-900/95 border-cyan-500/50 shadow-[0_10px_35px_rgba(0,180,216,0.18)]'
                        : 'bg-white border-cyan-400 shadow-lg shadow-cyan-100'
                      : isDark
                      ? 'bg-slate-950/60 border-slate-800/80 opacity-80 hover:opacity-100'
                      : 'bg-slate-50 border-slate-200 opacity-90 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedPartner(partner.name as any)}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm sm:text-base text-slate-900 shadow-md"
                        style={{ backgroundColor: partner.accentColor }}
                      >
                        {partner.name === 'SoftExpert' ? 'SE' : 'PECB'}
                      </div>
                      <div>
                        <div
                          className={`text-lg sm:text-xl font-extrabold flex items-center gap-2 ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          <span>{partner.name}</span>
                          <span
                            className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                              partner.name === 'PECB'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                : isDark
                                ? 'bg-slate-800 text-cyan-300 border-slate-700'
                                : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                            }`}
                          >
                            {partner.name === 'PECB' ? 'Official Agreement' : 'Authorized Partner'}
                          </span>
                        </div>
                        <div
                          className={`text-xs font-semibold ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          {partner.tag}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {partner.agreementUrl && (
                        <a
                          href={partner.agreementUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                            isDark
                              ? 'text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30'
                              : 'text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border-amber-300'
                          }`}
                          title="Read official PECB press release"
                        >
                          <span>Partnership Notice</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenConsultation(`${partner.name} ${partner.name === 'PECB' ? 'Certification & Training' : 'Implementation'}`);
                        }}
                        className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          isDark
                            ? 'text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700'
                            : 'text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border-slate-300'
                        }`}
                      >
                        <span>{partner.name === 'PECB' ? 'Enroll / Inquire' : 'Deploy'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p
                    className={`text-sm leading-relaxed mb-5 ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {partner.description}
                  </p>

                  <div
                    className={`p-3.5 rounded-xl border mb-5 ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div
                      className={`text-[11px] font-mono uppercase font-bold mb-1 ${
                        isDark ? 'text-amber-400' : 'text-amber-600'
                      }`}
                    >
                      Enterprise Fit:
                    </div>
                    <div className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {partner.bestFor}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Core Digitization Capabilities:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {partner.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-2 text-xs ${
                            isDark ? 'text-slate-300' : 'text-slate-700'
                          }`}
                        >
                          <CheckCircle2
                            className="w-4 h-4 flex-shrink-0 mt-0.5"
                            style={{ color: partner.accentColor }}
                          />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className={`mt-6 pt-5 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isDark ? 'border-slate-800' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        {partner.name === 'PECB'
                          ? 'Accredited Training & International Certification Agreement'
                          : 'Integrated into Quality Centre Digital Operating System'}
                      </span>
                      {partner.websiteUrl && (
                        <a
                          href={partner.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs font-mono text-amber-500 hover:underline"
                        >
                          <span>pecb.com</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        onOpenConsultation(
                          partner.name === 'PECB' ? 'PECB Training & Certification' : `${partner.name} Integration`
                        )
                      }
                      className="text-xs font-bold text-cyan-500 hover:text-cyan-600 flex items-center gap-1"
                    >
                      {partner.name === 'PECB' ? 'Explore PECB Courses &rarr;' : 'Request Architecture Demo &rarr;'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

