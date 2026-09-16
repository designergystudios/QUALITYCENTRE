import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  ExternalLink,
  BookOpen,
  ShieldCheck,
  ArrowUp,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Logo } from './Logo';
import { COMPANY_DETAILS, FOUNDER_BOOK } from '../data/content';

interface FooterProps {
  onOpenConsultation: () => void;
  onNavigate: (href: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenConsultation,
  onNavigate,
}) => {
  const { isDark } = useTheme();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className={`relative border-t text-xs transition-colors duration-300 ${
        isDark ? 'bg-[#070A11] border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-600'
      }`}
    >
      {/* Quality Centre Glowing Top Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#00A9CF] via-[#0096C7] to-[#0077B6]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 space-y-12">
        
        {/* Top Grid: Brand & Global Sitemap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" className="h-20 sm:h-24 md:h-26" />
            <p className={`leading-relaxed max-w-sm text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {COMPANY_DETAILS.tagline}
            </p>
            <p className={`text-[11px] leading-relaxed max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Quality Centre Limited is East Africa’s leading management systems performance,
              digital transformation, and sustainability consultancy. Official SoftExpert Partner & PECB
              Authorized Partner.
            </p>

            {/* Nairobi Headquarters Coordinates */}
            <div className={`space-y-2 pt-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00A9CF] flex-shrink-0 mt-0.5" />
                <span className="text-[11px]">{COMPANY_DETAILS.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#00A9CF] flex-shrink-0" />
                <span className="text-[11px] font-mono">{COMPANY_DETAILS.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00A9CF] flex-shrink-0" />
                <span className="text-[11px] font-mono">{COMPANY_DETAILS.email}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Core ISO Standards */}
          <div className="space-y-3">
            <div
              className={`text-xs font-mono font-bold uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Management Standards
            </div>
            <ul className={`space-y-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <li>
                <button
                  onClick={() => onNavigate('#services')}
                  className="hover:text-cyan-500 transition-colors text-left"
                >
                  ISO 9001:2015 (QMS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#services')}
                  className="hover:text-cyan-500 transition-colors text-left"
                >
                  ISO/IEC 27001:2022 (ISMS)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#services')}
                  className="hover:text-cyan-500 transition-colors text-left"
                >
                  ISO 14001:2015 (EMS & NEMA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#services')}
                  className="hover:text-cyan-500 transition-colors text-left"
                >
                  ISO 45001:2018 (Health & Safety)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#services')}
                  className="hover:text-cyan-500 transition-colors text-left"
                >
                  ISO 22000:2018 (Food Safety)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#services')}
                  className="hover:text-cyan-500 transition-colors text-left"
                >
                  ISO 21001 (Education Systems)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#services')}
                  className="hover:text-cyan-500 transition-colors text-left"
                >
                  ISO 26000 & ESG Reporting
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Solutions & Tech Stack */}
          <div className="space-y-3">
            <div
              className={`text-xs font-mono font-bold uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Solutions & Software
            </div>
            <ul className={`space-y-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <li>
                <button
                  onClick={() => onNavigate('#services')}
                  className="hover:text-cyan-500 transition-colors text-left"
                >
                  Digital Management Systems
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#services')}
                  className="hover:text-cyan-500 transition-colors text-left"
                >
                  Sustainability & Digital ESG
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#services')}
                  className="hover:text-cyan-500 transition-colors text-left"
                >
                  Unified GRC Transformation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#about')}
                  className="hover:text-cyan-500 transition-colors text-left"
                >
                  SoftExpert EQM / GRC Suite
                </button>
              </li>
              <li>
                <a
                  href="https://pecb.com/en/newsReleases/pecb-signs-a-partnership-agreement-with-quality-centre-ltd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span>PECB Partnership Agreement</span>
                  <ExternalLink className="w-3 h-3 text-amber-500 flex-shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://pecb.com/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5"
                >
                  <span>PECB Global (pecb.com)</span>
                  <ExternalLink className="w-3 h-3 text-amber-500 flex-shrink-0" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('#approach')}
                  className="hover:text-cyan-500 transition-colors text-left"
                >
                  4-Stage Transformation Blueprint
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: QMS Book Highlight & Social Links */}
          <div className="space-y-4">
            <div
              className={`text-xs font-mono font-bold uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              QMS Book Masterwork
            </div>
            
            <div
              className={`p-3 rounded-xl border space-y-2 ${
                isDark
                  ? 'bg-slate-900 border-amber-500/30'
                  : 'bg-amber-50/70 border-amber-200'
              }`}
            >
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
                <BookOpen className="w-4 h-4" />
                <span>QMS Book & Playbook</span>
              </div>
              <p className={`text-[11px] leading-snug ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                By Julius N. Unlocking world markets for African enterprise through verifiable quality.
              </p>
              <button
                onClick={() => onNavigate('#founder-book')}
                className="text-[11px] font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
              >
                <span>Read QMS Book Overview</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Social Media Embedded Links */}
            <div className="space-y-1.5 pt-1">
              <div className={`text-[10px] font-mono uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Official Channels:
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={COMPANY_DETAILS.social.companyLinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-slate-900 hover:bg-[#0077B5]/20 text-slate-300 hover:text-cyan-300 border-slate-800'
                      : 'bg-white hover:bg-slate-200 text-slate-700 hover:text-[#0077B5] border-slate-300 shadow-sm'
                  }`}
                  title="Quality Centre LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={COMPANY_DETAILS.social.companyTwitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
                      : 'bg-white hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-300 shadow-sm'
                  }`}
                  title="Quality Centre X (Twitter)"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href={COMPANY_DETAILS.social.founderLinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-slate-900 hover:bg-[#0077B5]/20 text-amber-400 hover:text-amber-300 border-slate-800'
                      : 'bg-white hover:bg-slate-200 text-amber-600 hover:text-[#0077B5] border-slate-300 shadow-sm'
                  }`}
                  title="Julius Njatha LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={COMPANY_DETAILS.social.founderTwitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg border transition-colors ${
                    isDark
                      ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border-slate-800'
                      : 'bg-white hover:bg-slate-200 text-amber-600 hover:text-amber-700 border-slate-300 shadow-sm'
                  }`}
                  title="Julius N. on X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Regulatory & ISO Accreditation Disclaimer */}
        <div className={`pt-8 border-t space-y-4 ${isDark ? 'border-slate-800/80' : 'border-slate-300'}`}>
          <div
            className={`p-4 rounded-xl border text-[11px] leading-relaxed ${
              isDark
                ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                : 'bg-white border-slate-200 text-slate-600 shadow-sm'
            }`}
          >
            <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              ISO Compliance & Advisory Disclaimer:
            </span>{' '}
            Quality Centre Limited is an independent management systems, digital transformation, and
            GRC consulting firm. We architect, implement, train, and prepare organizations for external
            certification. In accordance with ISO 17021 requirements, third-party accredited certification
            audits are administered by accredited certification bodies (e.g. KEBS, SGS, BSI, Bureau Veritas).
            All trademarks including ISO®, SoftExpert®, and PECB® belong to their respective proprietors.
          </div>
        </div>

        {/* Bottom Bar: Copyright, Back to Top */}
        <div
          className={`pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] ${
            isDark ? 'border-slate-800/60 text-slate-500' : 'border-slate-300 text-slate-600'
          }`}
        >
          <div>
            © {new Date().getFullYear()} Quality Centre Limited. All Rights Reserved. Incorporated in the Republic of Kenya.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onOpenConsultation}
              className="text-cyan-500 hover:text-cyan-600 font-semibold"
            >
              Book Consultation
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('#founder-book')}
              className="text-amber-500 hover:text-amber-600 font-semibold"
            >
              Founder's Book
            </button>
            <span>•</span>
            <button
              onClick={scrollToTop}
              className={`flex items-center gap-1 font-medium ${
                isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

