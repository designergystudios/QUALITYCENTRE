/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCms } from '../context/CmsContext';
import { useTheme } from '../context/ThemeContext';
import { Award, CheckCircle2, Building2, FileText, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const SuccessStories: React.FC<{ onOpenConsultation: (topic: string) => void }> = ({ onOpenConsultation }) => {
  const { successStories } = useCms();
  const { isDark } = useTheme();
  const [selectedStoryId, setSelectedStoryId] = useState<string>(successStories[0]?.id || '');

  if (!successStories || successStories.length === 0) return null;

  const currentStory = successStories.find((s) => s.id === selectedStoryId) || successStories[0];

  return (
    <section id="success-stories" className={`py-24 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00A9CF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#00A9CF]/15 text-[#00A9CF] border border-[#00A9CF]/30 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>Proven Enterprise Impact & Case Studies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Client Success Stories & <span className="text-[#00A9CF]">Accreditation Results</span>
          </h2>
          <p className={`text-base sm:text-lg ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Explore how East Africa’s premier banks, telecommunications giants, and manufacturers achieved 100% compliance and audit excellence.
          </p>
        </div>

        {/* Story Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {successStories.map((story) => {
            const isSelected = story.id === currentStory.id;
            return (
              <button
                key={story.id}
                onClick={() => setSelectedStoryId(story.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 shadow-sm ${
                  isSelected
                    ? 'bg-[#00A9CF] text-slate-950 shadow-lg shadow-[#00A9CF]/25 scale-105 ring-2 ring-[#00A9CF]/50'
                    : isDark
                    ? 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <span>{story.clientName}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Story Detailed Card */}
        <div className={`rounded-3xl border overflow-hidden shadow-2xl transition-all duration-500 ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xl'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left: Image & Quick Meta */}
            <div className="lg:col-span-5 relative min-h-[360px] lg:min-h-full overflow-hidden bg-slate-900 flex flex-col justify-end p-8">
              <div className="absolute inset-0">
                <img
                  src={currentStory.imageUrl}
                  alt={currentStory.clientName}
                  className="w-full h-full object-cover opacity-75 hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              </div>

              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#00A9CF] text-slate-950 shadow">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{currentStory.standard}</span>
                </div>
                <div className="text-xs font-mono text-slate-300 uppercase tracking-widest">
                  {currentStory.industry}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {currentStory.clientName}
                </h3>
              </div>
            </div>

            {/* Right: Detailed Content */}
            <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#00A9CF]">
                    Project Case Study
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {currentStory.title}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className={`p-5 rounded-2xl border ${
                    isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      The Enterprise Challenge
                    </h5>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {currentStory.challenge}
                    </p>
                  </div>

                  <div className={`p-5 rounded-2xl border ${
                    isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#00A9CF] mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00A9CF]" />
                      Our Solution & Framework
                    </h5>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {currentStory.solution}
                    </p>
                  </div>
                </div>

                {/* Key Results Bullet Points */}
                <div className="space-y-3 pt-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    Verified Results & Outcomes
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentStory.results.map((result, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border flex items-start gap-2.5 shadow-sm ${
                          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className={`text-xs font-semibold leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {result}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-mono text-slate-400">
                  Accreditation Date: <span className="text-white font-bold">{currentStory.date}</span>
                </div>
                <button
                  onClick={() => onOpenConsultation(`Success Story Inquiry: ${currentStory.clientName}`)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all shadow-md shadow-[#00A9CF]/25 flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Request Similar Audit Strategy</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
