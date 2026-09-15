/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useCms } from '../context/CmsContext';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, Award } from 'lucide-react';

export const ClientLogoCarousel: React.FC = () => {
  const { clientLogos } = useCms();
  const { isDark } = useTheme();

  if (!clientLogos || clientLogos.length === 0) return null;

  return (
    <section className={`py-12 border-y relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-100/70 border-slate-200/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00A9CF]/15 text-[#00A9CF] flex items-center justify-center border border-[#00A9CF]/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00A9CF]">
              Trusted Industry Partners & Certified Enterprises
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Empowering East Africa's banking, manufacturing, telecommunications, and institutional leaders with ISO & GRC excellence.
          </p>
        </div>
      </div>

      {/* Marquee / Logo Grid Carousel */}
      <div className="relative w-full overflow-hidden">
        {/* Gradient Fade Edges */}
        <div className={`absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-r ${
          isDark ? 'from-slate-950 to-transparent' : 'from-slate-100 to-transparent'
        }`} />
        <div className={`absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none bg-gradient-to-l ${
          isDark ? 'from-slate-950 to-transparent' : 'from-slate-100 to-transparent'
        }`} />

        <div className="flex items-center gap-4 sm:gap-5 animate-marquee py-6 px-4 whitespace-nowrap overflow-x-auto no-scrollbar">
          {clientLogos.concat(clientLogos).map((client, idx) => (
            <div
              key={`${client.id}-${idx}`}
              className={`flex items-center gap-3.5 px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl border transition-all duration-300 flex-shrink-0 group hover:-translate-y-1 shadow-md ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 hover:border-[#00A9CF]/60 hover:bg-slate-900'
                  : 'bg-white border-slate-200 hover:border-[#00A9CF]/60 hover:shadow-lg'
              }`}
            >
              <div className="w-22 h-22 sm:w-24 sm:h-24 md:w-26 md:h-26 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border-2 border-slate-200 dark:border-slate-700 shadow-inner p-1.5">
                <img
                  src={client.logoUrl}
                  alt={client.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left pr-1">
                <h5 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-[#00A9CF] transition-colors">
                  {client.name}
                </h5>
                {client.industry && (
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 block mt-0.5">
                    {client.industry}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
