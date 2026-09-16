import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  PhoneCall,
  ChevronRight,
  Sparkles,
  BookOpen,
  Sun,
  Moon,
  Play,
  Settings,
  Image as ImageIcon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCms } from '../context/CmsContext';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenConsultation: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenConsultation,
  activeSection,
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { openAdmin } = useCms();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'gallery', label: 'Media Gallery', href: '#gallery' },
    { id: 'about', label: 'About Us', href: '#about' },
    { id: 'services', label: 'Services', href: '#services' },
    { id: 'approach', label: 'Our Approach', href: '#approach' },
    { id: 'success-stories', label: 'Case Studies', href: '#success-stories' },
    { id: 'blog', label: 'Blog', href: '#blog' },
    { id: 'founder-book', label: 'QMS Book', href: '#founder-book' },
  ];


  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? isDark
            ? 'bg-[#0B0F19]/90 backdrop-blur-md border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,180,216,0.1)] py-3'
            : 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-3'
          : isDark
          ? 'bg-gradient-to-b from-[#0B0F19]/95 via-[#0B0F19]/70 to-transparent py-5 border-b border-white/5'
          : 'bg-gradient-to-b from-white/95 via-white/80 to-transparent py-5 border-b border-slate-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <a
            href="#home"
            className="flex items-center gap-2 group transition-transform hover:scale-[1.02]"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#home');
            }}
          >
            <Logo size="lg" className="h-20 sm:h-24 md:h-26" />
          </a>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-colors ${
              isDark
                ? 'bg-slate-900/70 border-slate-800/90'
                : 'bg-slate-100/90 border-slate-200 shadow-inner'
            }`}
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 relative flex items-center gap-1.5 ${
                    isActive
                      ? isDark
                        ? 'text-white'
                        : 'text-slate-950 font-bold'
                      : isDark
                      ? 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50'
                      : 'text-slate-600 hover:text-cyan-700 hover:bg-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className={`absolute inset-0 rounded-full border ${
                        isDark
                          ? 'bg-[#00A9CF]/20 border-[#00A9CF]/50'
                          : 'bg-white shadow-sm border-[#00A9CF]/40'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle + Admin CMS + Book a Consultation CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center active:scale-95 ${
                isDark
                  ? 'bg-slate-900/80 border-slate-700 text-[#00A9CF] hover:text-white hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-200 shadow-sm'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Admin CMS Access Button */}
            <button
              id="nav-admin-btn"
              onClick={openAdmin}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                isDark
                  ? 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-[#00A9CF] hover:border-[#00A9CF]/40'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-950 hover:bg-slate-200'
              }`}
              title="Open Admin CMS Backend (Edit content, upload videos & images)"
            >
              <Settings className="w-4 h-4 text-[#00A9CF]" />
              <span className="hidden lg:inline text-[11px]">Admin CMS</span>
            </button>

            <div
              className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                isDark
                  ? 'bg-[#00A9CF]/10 border-[#00A9CF]/30 text-[#00A9CF]'
                  : 'bg-cyan-50 border-cyan-300 text-[#0077B6]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#00A9CF] animate-pulse" />
              Nairobi • 26+ Yrs ISO
            </div>

            <button
              id="nav-consultation-btn"
              onClick={onOpenConsultation}
              className="relative group overflow-hidden px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all duration-300 shadow-[0_0_20px_rgba(0,169,207,0.35)] active:scale-95"
            >
              <div className="flex items-center gap-2 relative z-10">
                <PhoneCall className="w-4 h-4 text-slate-950" />
                <span>Book a Consultation</span>
              </div>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </button>
          </div>


          {/* Mobile Menu Button & Mobile Theme Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-colors ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-amber-400'
                  : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenConsultation}
              className="sm:hidden px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 bg-cyan-400"
            >
              Consult
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isDark
                  ? 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-cyan-700 hover:border-cyan-500'
              }`}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className={`lg:hidden border-b overflow-hidden transition-colors ${
              isDark
                ? 'bg-[#0B0F19]/95 backdrop-blur-2xl border-cyan-500/20'
                : 'bg-white/95 backdrop-blur-2xl border-slate-200 shadow-xl'
            }`}
          >
            <div className="px-5 py-6 space-y-3">
              <div
                className={`flex items-center justify-between pb-3 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <div
                  className={`flex items-center gap-2 text-xs ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  ISO 9001, 27001, ESG & GRC Certified Advisory
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleLinkClick(link.href)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? isDark
                            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                            : 'bg-cyan-50 text-cyan-900 border border-cyan-300 font-bold'
                          : isDark
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 ${
                          isActive ? 'text-cyan-500' : isDark ? 'text-slate-500' : 'text-slate-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div
                className={`pt-3 border-t space-y-2 ${
                  isDark ? 'border-slate-800/80' : 'border-slate-200'
                }`}
              >
                <button
                  id="mobile-nav-consultation-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenConsultation();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-[#00A9CF] shadow-lg shadow-[#00A9CF]/25"
                >
                  <PhoneCall className="w-4 h-4 text-slate-900" />
                  <span>Book a Consultation</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAdmin();
                  }}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs border transition-colors ${
                    isDark
                      ? 'border-slate-700 text-[#00A9CF] bg-slate-900/60'
                      : 'border-slate-300 text-slate-700 bg-slate-100'
                  }`}
                >
                  <Settings className="w-4 h-4 text-[#00A9CF]" />
                  <span>Open Admin CMS Backend</span>
                </button>


                <div
                  className={`flex items-center justify-center gap-4 pt-2 text-xs ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  <span>Nairobi HQ: Chiromo Road</span>
                  <span>•</span>
                  <span>SoftExpert & PECB Authorized Partners</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

