import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  ArrowRight,
  Play,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { AfroPattern } from './AfroPattern';

interface HeroProps {
  onOpenConsultation: (standard?: string) => void;
  onExploreSolutions: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenConsultation,
  onExploreSolutions,
}) => {
  const { isDark } = useTheme();
  const { heroConfig, openAdmin } = useCms();

  const scrollToGallery = () => {
    const el = document.getElementById('gallery');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className={`relative min-h-[90vh] flex items-center justify-center pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#0B0F19]' : 'bg-slate-50'
      }`}
    >
      {/* 1. Afro-Futuristic Geometric Ambient Overlays */}
      <AfroPattern
        variant="diamonds"
        opacity={isDark ? 0.08 : 0.04}
        className="inset-0 z-0 pointer-events-none"
      />

      {/* 2. Logo Blue Glowing Radial Orbs */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] rounded-full blur-[150px] pointer-events-none z-0 ${
          isDark ? 'bg-[#00A9CF]/12' : 'bg-[#00A9CF]/10'
        }`}
      />

      {/* =========================================================
          HERO CONTENT CONTAINER (EXPANSIVE, HIGH-CONTRAST LAYOUT)
          ========================================================= */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
        {/* Hero Headline & Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="space-y-5"
        >
          <h1
            className={`text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.12] transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {heroConfig.headline.includes('faster, easier, and better.') ? (
              <>
                {heroConfig.headline.replace('faster, easier, and better.', '')}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A9CF] via-[#0096C7] to-[#0077B6]">
                  faster, easier, and better.
                </span>
              </>
            ) : (
              heroConfig.headline
            )}
          </h1>

          <p
            className={`text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-3xl mx-auto transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Quality Centre transforms ISO, risk, GRC, and ESG/sustainability requirements into high-performing, digitally-enabled operating systems across Africa & beyond.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
        >
          <button
            id="hero-explore-solutions-btn"
            onClick={onExploreSolutions}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all shadow-[0_0_25px_rgba(0,169,207,0.35)] hover:shadow-[0_0_35px_rgba(0,169,207,0.5)] flex items-center justify-center gap-2.5 group active:scale-[0.98]"
          >
            <span>{heroConfig.ctaPrimaryText || 'Explore Solutions'}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            id="hero-book-audit-btn"
            onClick={() => onOpenConsultation('ISO 9001 Diagnostic')}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 backdrop-blur-md active:scale-[0.98] border ${
              isDark
                ? 'text-[#00A9CF] bg-slate-900/80 border-[#00A9CF]/40 hover:bg-slate-800/80 hover:text-white'
                : 'text-[#0077B6] bg-white/90 border-cyan-400 hover:bg-white shadow-md'
            }`}
          >
            <ShieldCheck className="w-5 h-5 text-[#00A9CF]" />
            <span>
              {heroConfig.ctaSecondaryText && heroConfig.ctaSecondaryText !== 'Book ISO Audit'
                ? heroConfig.ctaSecondaryText
                : 'Talk to our expert'}
            </span>
          </button>

          <button
            onClick={scrollToGallery}
            className={`w-full sm:w-auto px-6 py-4 rounded-xl font-medium text-sm sm:text-base transition-all flex items-center justify-center gap-2 ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Play className="w-4 h-4 text-[#00A9CF]" />
            <span>View Media Gallery</span>
          </button>
        </motion.div>

        {/* Quick Credentials Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className={`mt-14 pt-8 border-t grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto transition-colors ${
            isDark ? 'border-slate-800/80' : 'border-slate-200'
          }`}
        >
          <div className="text-center">
            <div
              className={`text-2xl sm:text-3xl font-black font-mono flex items-center justify-center gap-1 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              <span>350+</span>
              <span className="text-xs text-[#00A9CF] font-sans font-normal">Certs</span>
            </div>
            <div className={`text-xs font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Delivered Across Africa
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-[#00A9CF] font-mono flex items-center justify-center gap-1">
              <span>99.4%</span>
            </div>
            <div className={`text-xs font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              1st-Attempt Pass Rate
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-[#0077B6] dark:text-cyan-300 font-mono flex items-center justify-center gap-1">
              <span>SoftExpert</span>
            </div>
            <div className={`text-xs font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Premier Tech Partner
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-black text-amber-500 font-mono flex items-center justify-center gap-1">
              <span>PECB</span>
            </div>
            <div className={`text-xs font-medium mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Authorized Agreement
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator prompt */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={scrollToGallery}
            className="animate-bounce p-2 rounded-full text-slate-400 hover:text-[#00A9CF] transition-colors"
            title="Scroll down to media gallery"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
};

