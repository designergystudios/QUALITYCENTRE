import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Sparkles,
  Award,
  ExternalLink,
  Linkedin,
  Twitter,
  CheckCircle2,
  BookmarkCheck,
  Send,
  Download,
  Share2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { AfroPattern } from './AfroPattern';
import { FOUNDER_BOOK } from '../data/content';

interface BookShowcaseProps {
  onOpenConsultation: (topic?: string) => void;
}

export const BookShowcase: React.FC<BookShowcaseProps> = ({
  onOpenConsultation,
}) => {
  const { isDark } = useTheme();
  const { bookConfig } = useCms();
  const book = bookConfig || FOUNDER_BOOK;

  const [downloadRequested, setDownloadRequested] = useState(false);
  const [executiveEmail, setExecutiveEmail] = useState('');

  const handleExecutiveSummaryRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (executiveEmail.trim()) {
      setDownloadRequested(true);
      setTimeout(() => {
        setDownloadRequested(false);
        setExecutiveEmail('');
      }, 4000);
    }
  };

  return (
    <section
      id="founder-book"
      className={`relative py-24 overflow-hidden border-t transition-colors duration-300 ${
        isDark ? 'bg-[#0A0E17] border-slate-800/80' : 'bg-white border-slate-200'
      }`}
    >
      {/* Afro Geometric Visual Backdrop */}
      <AfroPattern
        variant="diamonds"
        opacity={isDark ? 0.08 : 0.03}
        className="inset-0 pointer-events-none"
      />
      <div
        className={`absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none ${
          isDark ? 'bg-amber-500/10' : 'bg-amber-500/15'
        }`}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              isDark
                ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
                : 'bg-amber-50 border-amber-300 text-amber-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>THOUGHT LEADERSHIP & FOUNDER SPOTLIGHT</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            The Definitive Playbook for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-400 to-cyan-500">
              African Global Competitiveness
            </span>
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Authored by Julius N., Founder of Quality Centre Limited, sharing 26+ years of
            battle-tested strategies for conquering international markets through ISO standards.
          </p>
        </div>

        {/* Book Feature Card */}
        <div className="relative rounded-3xl p-0.5 bg-gradient-to-r from-amber-500/50 via-cyan-500/40 to-amber-500/50 shadow-2xl">
          <div
            className={`relative rounded-[23px] backdrop-blur-xl p-8 sm:p-12 border overflow-hidden transition-colors ${
              isDark
                ? 'bg-[#0F172A]/95 border-slate-800'
                : 'bg-white border-slate-200 shadow-xl'
            }`}
          >
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* Left: 3D Perspective Book Cover Graphic */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group select-none">
                  {/* Glowing Aura Behind Book */}
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-amber-500/25 via-cyan-500/20 to-transparent blur-2xl group-hover:opacity-100 transition-opacity" />

                  {/* 3D Book Chassis */}
                  {book.coverImage ? (
                    <div className="relative w-64 sm:w-72 aspect-[3/4.4] rounded-r-2xl rounded-l-md bg-slate-900 border-r-4 border-b-4 border-t border-l-8 border-slate-700 border-l-[#F59E0B] shadow-[20px_20px_40px_rgba(0,0,0,0.8)] overflow-hidden transform hover:-rotate-1 hover:scale-105 transition-all duration-300">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {/* Spine shadow overlay */}
                      <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/70 to-transparent pointer-events-none" />
                      {/* Gloss subtle sheen */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="relative w-64 sm:w-72 aspect-[3/4.4] rounded-r-2xl rounded-l-md bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0A0E17] border-r-4 border-b-4 border-t border-l-8 border-slate-700 border-l-[#F59E0B] shadow-[20px_20px_40px_rgba(0,0,0,0.8)] p-6 flex flex-col justify-between overflow-hidden transform hover:-rotate-1 hover:scale-105 transition-all duration-300">
                      
                      {/* Afro Pattern Overlay on Book */}
                      <div className="absolute inset-0 opacity-15 pointer-events-none">
                        <AfroPattern variant="diamonds" opacity={0.8} />
                      </div>

                      {/* Book Spine Shadow Effect */}
                      <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />

                      {/* Top Tag & Publisher */}
                      <div className="relative z-10 space-y-1">
                        <div className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase">
                          QUALITY CENTRE PRESS
                        </div>
                        <div className="h-0.5 w-12 bg-gradient-to-r from-cyan-400 to-amber-400" />
                      </div>

                      {/* Book Title & Artwork */}
                      <div className="relative z-10 space-y-3 my-auto text-left">
                        <div className="text-3xl sm:text-4xl font-black text-white tracking-tight font-serif leading-none">
                          {book.title.split(' ')[0] || 'ISO'} {book.title.split(' ')[1] || '9000'}<br />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
                            {book.title.split(' ').slice(2).join(' ') || 'SECRET'}
                          </span>
                        </div>
                        
                        <div className="text-xs sm:text-sm font-semibold tracking-wider text-cyan-300 uppercase">
                          {book.subtitle}
                        </div>

                        <div className="pt-2 text-[10px] text-slate-300 leading-relaxed font-sans line-clamp-3">
                          {book.description}
                        </div>
                      </div>

                      {/* Author Seal */}
                      <div className="relative z-10 pt-4 border-t border-slate-700/80 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-mono">By Author</div>
                          <div className="text-sm font-bold text-white">{book.author}</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center text-[10px] font-bold text-amber-400">
                          QCL
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              </div>

              {/* Right: Book Overview, Key Takeaways & Action */}
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-2">
                  <div
                    className={`flex items-center gap-2 text-xs font-mono font-bold uppercase ${
                      isDark ? 'text-amber-400' : 'text-amber-600'
                    }`}
                  >
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Published Business Masterwork</span>
                  </div>
                  <h3
                    className={`text-2xl sm:text-3xl font-black ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    "{book.title}: {book.subtitle}"
                  </h3>
                  <div
                    className={`text-xs sm:text-sm font-medium ${
                      isDark ? 'text-cyan-300' : 'text-cyan-700'
                    }`}
                  >
                    By {book.author} • {book.authorRole}
                  </div>
                </div>

                <p
                  className={`text-sm sm:text-base leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {book.description}
                </p>

                {/* Key Takeaways */}
                <div className="space-y-2.5">
                  <div
                    className={`text-xs font-mono uppercase font-bold ${
                      isDark ? 'text-amber-400' : 'text-amber-600'
                    }`}
                  >
                    Key Executive Takeaways in the Book:
                  </div>
                  <div className="space-y-2">
                    {book.keyTakeaways.map((takeaway, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2.5 text-xs sm:text-sm ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        <BookmarkCheck className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Author Quote Box */}
                <blockquote
                  className={`p-4 rounded-xl border-l-4 border-amber-400 text-xs sm:text-sm italic ${
                    isDark
                      ? 'bg-slate-900/80 text-slate-300'
                      : 'bg-amber-50/50 text-slate-700 border-amber-500'
                  }`}
                >
                  “{book.quote}”
                </blockquote>

                {/* CTAs & Executive Brief Download */}
                <div className="pt-2 space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={() => onOpenConsultation('Inquire: Order "ISO 9000 Secret"')}
                      className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-900 bg-gradient-to-r from-amber-400 via-yellow-300 to-cyan-400 hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-4 h-4 text-slate-900" />
                      <span>Order Book & Consultation Copy</span>
                    </button>

                    <button
                      onClick={() => onOpenConsultation('Request Executive Chapter Preview')}
                      className={`px-5 py-3.5 rounded-xl font-semibold text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 ${
                        isDark
                          ? 'text-slate-200 bg-slate-800 hover:bg-slate-700 border-slate-700'
                          : 'text-slate-800 bg-slate-100 hover:bg-slate-200 border-slate-300'
                      }`}
                    >
                      <Download className="w-4 h-4 text-amber-500" />
                      <span>Request Executive Chapter Preview</span>
                    </button>
                  </div>

                  {downloadRequested && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Thank you! Your executive chapter preview request has been registered.</span>
                    </motion.div>
                  )}
                </div>

                {/* Social Media Integration Matrix */}
                <div
                  className={`pt-6 border-t space-y-3 ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  <div
                    className={`text-xs font-mono uppercase font-bold ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Connect Directly with Quality Centre & Leadership:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Company LinkedIn */}
                    <a
                      href={book.socialLinks?.companyLinkedIn || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between group ${
                        isDark
                          ? 'bg-slate-900/80 hover:bg-[#0077B5]/20 border-slate-800 hover:border-[#0077B5]/50'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-[#0077B5]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-[#0077B5]/20 text-[#0077B5]">
                          <Linkedin className="w-4 h-4" />
                        </div>
                        <div>
                          <div
                            className={`text-xs font-bold transition-colors ${
                              isDark ? 'text-white group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-[#0077B5]'
                            }`}
                          >
                            Quality Centre Limited
                          </div>
                          <div className={isDark ? 'text-[10px] text-slate-400' : 'text-[10px] text-slate-500'}>
                            Company LinkedIn
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-500" />
                    </a>

                    {/* Company Twitter/X */}
                    <a
                      href={book.socialLinks?.companyTwitter || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between group ${
                        isDark
                          ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-800'}`}>
                          <Twitter className="w-4 h-4" />
                        </div>
                        <div>
                          <div
                            className={`text-xs font-bold transition-colors ${
                              isDark ? 'text-white group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-cyan-600'
                            }`}
                          >
                            @qualitycentreke
                          </div>
                          <div className={isDark ? 'text-[10px] text-slate-400' : 'text-[10px] text-slate-500'}>
                            Official Company X
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-500" />
                    </a>

                    {/* Founder LinkedIn */}
                    <a
                      href={book.socialLinks?.founderLinkedIn || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between group ${
                        isDark
                          ? 'bg-slate-900/80 hover:bg-[#0077B5]/20 border-slate-800 hover:border-[#0077B5]/50'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-[#0077B5]/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-[#0077B5]/20 text-[#0077B5]">
                          <Linkedin className="w-4 h-4" />
                        </div>
                        <div>
                          <div
                            className={`text-xs font-bold transition-colors ${
                              isDark ? 'text-white group-hover:text-amber-300' : 'text-slate-900 group-hover:text-[#0077B5]'
                            }`}
                          >
                            Julius Njatha
                          </div>
                          <div className={isDark ? 'text-[10px] text-slate-400' : 'text-[10px] text-slate-500'}>
                            Founder LinkedIn Profile
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500" />
                    </a>

                    {/* Founder Twitter/X */}
                    <a
                      href={book.socialLinks?.founderTwitter || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between group ${
                        isDark
                          ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                          <Twitter className="w-4 h-4" />
                        </div>
                        <div>
                          <div
                            className={`text-xs font-bold transition-colors ${
                              isDark ? 'text-white group-hover:text-amber-300' : 'text-slate-900 group-hover:text-amber-600'
                            }`}
                          >
                            @juliusnmm
                          </div>
                          <div className={isDark ? 'text-[10px] text-slate-400' : 'text-[10px] text-slate-500'}>
                            Julius N. on X
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500" />
                    </a>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

