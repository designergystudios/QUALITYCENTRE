import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Sprout,
  Network,
  ShieldCheck,
  Lock,
  Leaf,
  HardHat,
  UtensilsCrossed,
  GraduationCap,
  Globe,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Award,
  Check,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Search,
  CheckCircle2,
  Calendar,
  Compass,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AfroPattern } from './AfroPattern';
import { SERVICE_PILLARS, ISO_STANDARDS } from '../data/content';
import { IsoStandard, ServicePillar } from '../types';

interface ServicesProps {
  onOpenConsultation: (standardOrService?: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onOpenConsultation }) => {
  const { isDark } = useTheme();
  const [activePillarId, setActivePillarId] = useState<
    'iso-transformation' | 'sustainability-esg' | 'grc-transformation'
  >('iso-transformation');

  const [selectedStandard, setSelectedStandard] = useState<IsoStandard>(ISO_STANDARDS[0]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  // Quick Diagnostic Interactive State
  const [diagnosticStep, setDiagnosticStep] = useState<number>(0);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<number, string>>({});
  const [showDiagnosticResult, setShowDiagnosticResult] = useState<boolean>(false);

  const activePillar = SERVICE_PILLARS.find((p) => p.id === activePillarId)!;

  // Filtered standards for Pillar 1
  const categories = ['All', 'Quality', 'Security', 'Environment', 'Sector-Specific', 'ESG'];
  const filteredStandards = ISO_STANDARDS.filter((s) => {
    if (activeCategoryFilter === 'All') return true;
    return s.category === activeCategoryFilter;
  });

  const diagnosticQuestions = [
    {
      q: 'How are your Standard Operating Procedures (SOPs) & Policies currently managed?',
      options: [
        { text: 'Paper binders & local Word docs with manual signatures', score: 1 },
        { text: 'Shared Google Drive/Dropbox folders with some digital versions', score: 2 },
        { text: 'Dedicated digital workflow system (e.g. SoftExpert/PECB frameworks) with automated audit logs', score: 3 },
      ],
    },
    {
      q: 'How does your organization handle Internal Audits and Corrective Actions (CAPA)?',
      options: [
        { text: 'Ad-hoc spreadsheets; findings often linger past deadlines', score: 1 },
        { text: 'Regular manual audits, but tracking evidence for each clause is stressful', score: 2 },
        { text: 'Automated digital audit forms, live root cause 5-Why, and instant executive dashboards', score: 3 },
      ],
    },
    {
      q: 'What is your primary strategic compliance goal for the next 6-12 months?',
      options: [
        { text: 'First-time ISO certification to win government/corporate tenders', score: 2 },
        { text: 'Upgrading existing ISO/GRC systems from paper to cloud automation', score: 3 },
        { text: 'Achieving ESG, NEMA and information security (ISO 27001) compliance for global export', score: 3 },
      ],
    },
  ];

  const handleDiagnosticAnswer = (scoreStr: string) => {
    const updated = { ...diagnosticAnswers, [diagnosticStep]: scoreStr };
    setDiagnosticAnswers(updated);
    if (diagnosticStep < diagnosticQuestions.length - 1) {
      setDiagnosticStep(diagnosticStep + 1);
    } else {
      setShowDiagnosticResult(true);
    }
  };

  const resetDiagnostic = () => {
    setDiagnosticStep(0);
    setDiagnosticAnswers({});
    setShowDiagnosticResult(false);
  };

  const getStandardIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-cyan-400" />;
      case 'Lock':
        return <Lock className="w-5 h-5 text-sky-400" />;
      case 'Leaf':
        return <Leaf className="w-5 h-5 text-emerald-400" />;
      case 'HardHat':
        return <HardHat className="w-5 h-5 text-amber-400" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-5 h-5 text-rose-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-purple-400" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-teal-400" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getCapabilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award':
        return <Award className="w-5 h-5 text-amber-400" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'ClipboardCheck':
        return <ClipboardCheck className="w-5 h-5 text-emerald-400" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-sky-400" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5 text-teal-400" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section
      id="services"
      className={`relative py-24 overflow-hidden border-t transition-colors duration-300 ${
        isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}
    >
      {/* Background Graphic Elements */}
      <AfroPattern
        variant="diamonds"
        opacity={isDark ? 0.06 : 0.03}
        className="inset-0 pointer-events-none"
      />
      <div
        className={`absolute top-1/2 left-0 w-96 h-96 rounded-full blur-[140px] pointer-events-none ${
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
            <Layers className="w-3.5 h-3.5" />
            <span>SOLUTIONS & SERVICE ARCHITECTURE</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Three Core Pillars of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-sky-500 to-amber-500">
              Operational Excellence
            </span>
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Eliminating audit anxiety and transforming compliance into high-velocity digital operating systems.
          </p>
        </div>

        {/* Pillar Switcher Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SERVICE_PILLARS.map((pillar) => {
            const isActive = activePillarId === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => setActivePillarId(pillar.id)}
                className={`relative text-left p-5 sm:p-6 rounded-2xl transition-all duration-300 border ${
                  isActive
                    ? isDark
                      ? 'bg-slate-900/95 border-cyan-500 shadow-[0_10px_35px_rgba(0,180,216,0.2)]'
                      : 'bg-white border-cyan-500 shadow-lg shadow-cyan-100'
                    : isDark
                    ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 shadow-md'
                          : isDark
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {pillar.id === 'iso-transformation' && <Layers className="w-5 h-5" />}
                      {pillar.id === 'sustainability-esg' && <Sprout className="w-5 h-5" />}
                      {pillar.id === 'grc-transformation' && <Network className="w-5 h-5" />}
                    </div>
                    <span
                      className={`text-[11px] font-mono font-bold uppercase ${
                        isDark ? 'text-amber-400' : 'text-amber-600'
                      }`}
                    >
                      {pillar.badge}
                    </span>
                  </div>
                  {isActive && (
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                  )}
                </div>

                <h3
                  className={`text-lg font-bold mb-2 leading-snug transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {pillar.title}
                </h3>
                <p
                  className={`text-xs line-clamp-2 transition-colors ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {pillar.tagline}
                </p>

                {isActive && (
                  <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-amber-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Pillar Detailed Workspace */}
        <div className="space-y-12">
          
          {/* Pillar 1 Detail View: ISO & Management Systems */}
          {activePillarId === 'iso-transformation' && (
            <div className="space-y-10">
              
              {/* Pillar Overview Header */}
              <div
                className={`p-6 sm:p-8 rounded-2xl border space-y-4 transition-colors ${
                  isDark
                    ? 'bg-slate-900/80 border-slate-800'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-cyan-500 uppercase tracking-wider font-bold">
                      Flagship Pillar 01
                    </div>
                    <h3
                      className={`text-2xl font-bold transition-colors ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      ISO & Management Systems Digital Transformation
                    </h3>
                    <p
                      className={`text-sm max-w-3xl transition-colors ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {activePillar.description}
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenConsultation('ISO Digital Transformation')}
                    className="flex-shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-md flex items-center gap-2"
                  >
                    <span>Request System Demo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Business Value Badges */}
                <div
                  className={`grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  {activePillar.businessValue.map((val, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 text-xs ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive ISO Standards Catalog */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4
                      className={`text-xl font-bold flex items-center gap-2 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      <ShieldCheck className="w-5 h-5 text-cyan-500" />
                      <span>Supported International Standards in Kenya & Africa</span>
                    </h4>
                    <p
                      className={`text-xs ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Click any standard to inspect key clauses, digital benefits, and audit blueprints.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div
                    className={`flex flex-wrap gap-1.5 p-1 border rounded-xl transition-colors ${
                      isDark
                        ? 'bg-slate-900 border-slate-800'
                        : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          activeCategoryFilter === cat
                            ? 'bg-cyan-500 text-slate-950 shadow-sm'
                            : isDark
                            ? 'text-slate-400 hover:text-white'
                            : 'text-slate-600 hover:text-slate-950'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Standards Grid & Selected Standard Deep Dive */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left: Standard Cards List */}
                  <div className="lg:col-span-5 space-y-2.5">
                    {filteredStandards.map((std) => {
                      const isSelected = selectedStandard.code === std.code;
                      return (
                        <button
                          key={std.code}
                          onClick={() => setSelectedStandard(std)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? isDark
                                ? 'bg-cyan-500/15 border-cyan-400/80 shadow-md shadow-cyan-500/20'
                                : 'bg-cyan-50 border-cyan-400 shadow-sm'
                              : isDark
                              ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg border ${
                                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                              }`}
                            >
                              {getStandardIcon(std.iconName)}
                            </div>
                            <div>
                              <div
                                className={`text-sm font-extrabold flex items-center gap-2 ${
                                  isDark ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                <span>{std.code}</span>
                                <span
                                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                                    isDark
                                      ? 'bg-slate-800 text-slate-300'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {std.category}
                                </span>
                              </div>
                              <div
                                className={`text-xs truncate max-w-[220px] ${
                                  isDark ? 'text-slate-400' : 'text-slate-500'
                                }`}
                              >
                                {std.name}
                              </div>
                            </div>
                          </div>

                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${
                              isSelected
                                ? 'text-cyan-500 translate-x-1'
                                : isDark
                                ? 'text-slate-600'
                                : 'text-slate-400'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Right: Selected Standard Details Interactive Card */}
                  <div className="lg:col-span-7">
                    <motion.div
                      key={selectedStandard.code}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`rounded-2xl p-6 sm:p-7 border shadow-xl relative overflow-hidden space-y-6 transition-colors ${
                        isDark
                          ? 'bg-slate-900/90 border-cyan-500/40'
                          : 'bg-white border-cyan-400 shadow-md shadow-cyan-50'
                      }`}
                    >
                      <div
                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${
                          isDark ? 'border-slate-800' : 'border-slate-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-2xl font-black font-mono ${
                                isDark ? 'text-white' : 'text-slate-900'
                              }`}
                            >
                              {selectedStandard.code}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                isDark
                                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                                  : 'bg-amber-50 border-amber-300 text-amber-800'
                              }`}
                            >
                              {selectedStandard.category} Standard
                            </span>
                          </div>
                          <h5
                            className={`text-sm font-semibold mt-0.5 ${
                              isDark ? 'text-cyan-300' : 'text-cyan-700'
                            }`}
                          >
                            {selectedStandard.name}
                          </h5>
                        </div>

                        <button
                          onClick={() => onOpenConsultation(`Audit for ${selectedStandard.code}`)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-gradient-to-r from-cyan-400 to-amber-400 hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-1.5"
                        >
                          <Calendar className="w-3.5 h-3.5 text-slate-900" />
                          <span>Book Audit for {selectedStandard.code}</span>
                        </button>
                      </div>

                      <p
                        className={`text-sm leading-relaxed ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {selectedStandard.description}
                      </p>

                      {/* Key Clauses & Digital Capabilities */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2.5">
                          <div
                            className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5 text-cyan-500" />
                            <span>Key Audited Clauses</span>
                          </div>
                          <ul className="space-y-1.5">
                            {selectedStandard.keyClauses.map((clause, idx) => (
                              <li
                                key={idx}
                                className={`text-xs flex items-start gap-2 ${
                                  isDark ? 'text-slate-300' : 'text-slate-700'
                                }`}
                              >
                                <span className="text-cyan-500 font-bold">•</span>
                                <span>{clause}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2.5">
                          <div
                            className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                              isDark ? 'text-amber-400' : 'text-amber-600'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Digital Transformation Output</span>
                          </div>
                          <ul className="space-y-1.5">
                            {selectedStandard.digitalBenefits.map((benefit, idx) => (
                              <li
                                key={idx}
                                className={`text-xs flex items-start gap-2 ${
                                  isDark ? 'text-slate-300' : 'text-slate-700'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Bottom Quick Integration Notice */}
                      <div
                        className={`pt-4 border-t flex items-center justify-between text-[11px] font-mono ${
                          isDark
                            ? 'border-slate-800 text-slate-400'
                            : 'border-slate-200 text-slate-500'
                        }`}
                      >
                        <span>Pre-configured SoftExpert EQM & PECB audit templates ready</span>
                        <span className="text-cyan-500 font-semibold">100% External Audit Guarantee</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Core Capabilities Grid */}
              <div className="space-y-6 pt-4">
                <div className="text-center max-w-2xl mx-auto space-y-1">
                  <h4
                    className={`text-xl font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Full-Lifecycle Management System Capabilities
                  </h4>
                  <p
                    className={`text-xs ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    From initial documentation to automated CAPA root-cause resolution.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activePillar.capabilities.map((cap, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl p-5 space-y-3 relative overflow-hidden border transition-all ${
                        isDark
                          ? 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40'
                          : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`p-2.5 rounded-xl border ${
                            isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                          }`}
                        >
                          {getCapabilityIcon(cap.icon)}
                        </div>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            isDark
                              ? 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60'
                              : 'text-cyan-800 bg-cyan-50 border-cyan-200'
                          }`}
                        >
                          CAPABILITY {idx + 1}
                        </span>
                      </div>

                      <h5
                        className={`text-sm font-bold leading-snug ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {cap.title}
                      </h5>

                      <p
                        className={`text-xs leading-relaxed ${
                          isDark ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {cap.description}
                      </p>

                      <div
                        className={`pt-2 flex flex-wrap gap-1.5 border-t ${
                          isDark ? 'border-slate-800' : 'border-slate-200'
                        }`}
                      >
                        {cap.tools.map((tool, tIdx) => (
                          <span
                            key={tIdx}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                              isDark
                                ? 'bg-slate-900 text-slate-400 border-slate-800'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pillar 2 Detail View: Sustainability & Digital ESG */}
          {activePillarId === 'sustainability-esg' && (
            <div className="space-y-10">
              <div
                className={`p-6 sm:p-8 rounded-2xl border space-y-4 transition-colors ${
                  isDark
                    ? 'bg-slate-900/80 border-emerald-500/30'
                    : 'bg-white border-emerald-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-emerald-500 uppercase tracking-wider font-bold">
                      Future-Proof Pillar 02
                    </div>
                    <h3
                      className={`text-2xl font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Sustainability & Digital ESG Management
                    </h3>
                    <p
                      className={`text-sm max-w-3xl ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {activePillar.description}
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenConsultation('ESG & Sustainability Consultation')}
                    className="flex-shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md flex items-center gap-2"
                  >
                    <span>Request ESG Diagnostic</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div
                  className={`grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  {activePillar.businessValue.map((val, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 text-xs ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ESG Capabilities Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {activePillar.capabilities.map((cap, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl border transition-all space-y-4 ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40'
                        : 'bg-white border-slate-200 hover:border-emerald-400 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                        <Sprout className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded border ${
                          isDark
                            ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
                            : 'text-emerald-800 bg-emerald-50 border-emerald-200'
                        }`}
                      >
                        ESG Pillar {idx + 1}
                      </span>
                    </div>

                    <h4
                      className={`text-lg font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {cap.title}
                    </h4>
                    <p
                      className={`text-sm leading-relaxed ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {cap.description}
                    </p>

                    <div
                      className={`pt-2 flex flex-wrap gap-2 border-t ${
                        isDark ? 'border-slate-800' : 'border-slate-200'
                      }`}
                    >
                      {cap.tools.map((tool, tIdx) => (
                        <span
                          key={tIdx}
                          className={`text-xs font-mono px-2.5 py-1 rounded-md ${
                            isDark
                              ? 'bg-slate-800 text-emerald-300'
                              : 'bg-slate-100 text-emerald-800 border border-slate-200'
                          }`}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Kenyan Regulatory Alignment Strip (NEMA, NSE) */}
              <div
                className={`p-6 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <div
                      className={`text-sm font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      Nairobi Securities Exchange (NSE) & NEMA Regulatory Conformity
                    </div>
                    <div
                      className={`text-xs ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Automated emissions calculations & environmental audit documentation aligned with Kenyan Environmental Management & Co-ordination Act.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onOpenConsultation('NEMA & NSE Alignment')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border whitespace-nowrap transition-colors ${
                    isDark
                      ? 'text-white bg-slate-800 hover:bg-slate-700 border-slate-700'
                      : 'text-slate-800 bg-slate-100 hover:bg-slate-200 border-slate-300'
                  }`}
                >
                  Verify Compliance
                </button>
              </div>
            </div>
          )}

          {/* Pillar 3 Detail View: GRC Management Transformation */}
          {activePillarId === 'grc-transformation' && (
            <div className="space-y-10">
              <div
                className={`p-6 sm:p-8 rounded-2xl border space-y-4 transition-colors ${
                  isDark
                    ? 'bg-slate-900/80 border-amber-500/30'
                    : 'bg-white border-amber-300 shadow-sm'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono text-amber-500 uppercase tracking-wider font-bold">
                      Enterprise Architecture Pillar 03
                    </div>
                    <h3
                      className={`text-2xl font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      GRC Management Transformation
                    </h3>
                    <p
                      className={`text-sm max-w-3xl ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {activePillar.description}
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenConsultation('Enterprise GRC Strategy')}
                    className="flex-shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md flex items-center gap-2"
                  >
                    <span>Request GRC Blueprints</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div
                  className={`grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t ${
                    isDark ? 'border-slate-800' : 'border-slate-200'
                  }`}
                >
                  {activePillar.businessValue.map((val, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 text-xs ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      <Check className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* GRC Architecture Capabilities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {activePillar.capabilities.map((cap, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl border transition-all space-y-4 ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/40'
                        : 'bg-white border-slate-200 hover:border-amber-400 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                        <Network className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded border ${
                          isDark
                            ? 'text-amber-400 bg-amber-950/60 border-amber-800/60'
                            : 'text-amber-800 bg-amber-50 border-amber-200'
                        }`}
                      >
                        GRC Component {idx + 1}
                      </span>
                    </div>

                    <h4
                      className={`text-lg font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {cap.title}
                    </h4>
                    <p
                      className={`text-sm leading-relaxed ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {cap.description}
                    </p>

                    <div
                      className={`pt-2 flex flex-wrap gap-2 border-t ${
                        isDark ? 'border-slate-800' : 'border-slate-200'
                      }`}
                    >
                      {cap.tools.map((tool, tIdx) => (
                        <span
                          key={tIdx}
                          className={`text-xs font-mono px-2.5 py-1 rounded-md ${
                            isDark
                              ? 'bg-slate-800 text-amber-300'
                              : 'bg-slate-100 text-amber-800 border border-slate-200'
                          }`}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison: Siloed vs Quality Centre Unified GRC */}
              <div
                className={`p-6 rounded-2xl border overflow-x-auto ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div
                  className={`text-sm font-bold mb-4 flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <Compass className="w-4 h-4 text-cyan-500" />
                  <span>The Strategic Shift: Siloed Paperwork vs Quality Centre Digital GRC</span>
                </div>
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr
                      className={`border-b ${
                        isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                      }`}
                    >
                      <th className="pb-3 pr-4">Operational Dimension</th>
                      <th className="pb-3 pr-4 text-rose-500">Traditional Fragile Silos</th>
                      <th className="pb-3 text-cyan-600 font-bold">Quality Centre Digital Operating System</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      isDark
                        ? 'divide-slate-800/60 text-slate-300'
                        : 'divide-slate-200 text-slate-700'
                    }`}
                  >
                    <tr>
                      <td
                        className={`py-3 pr-4 font-semibold ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        External Audit Preparation
                      </td>
                      <td
                        className={`py-3 pr-4 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        3-4 weeks of panicked paper hunting
                      </td>
                      <td className="py-3 text-cyan-600 font-medium">Instant 1-click cryptographic auditor pack</td>
                    </tr>
                    <tr>
                      <td
                        className={`py-3 pr-4 font-semibold ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        CAPA & Non-Conformities
                      </td>
                      <td
                        className={`py-3 pr-4 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        Forgotten in Excel sheets, repeat findings
                      </td>
                      <td className="py-3 text-cyan-600 font-medium">Automated 5-Why root cause & closure SLA alerts</td>
                    </tr>
                    <tr>
                      <td
                        className={`py-3 pr-4 font-semibold ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        Executive Visibility
                      </td>
                      <td
                        className={`py-3 pr-4 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        Outdated retrospective quarterly slide decks
                      </td>
                      <td className="py-3 text-cyan-600 font-medium">Live risk heatmap and objective telemetry</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Interactive Quick ISO Audit Readiness Diagnostic Tool */}
        <div className="relative rounded-2xl p-0.5 bg-gradient-to-r from-cyan-500/50 via-amber-500/40 to-cyan-500/50 shadow-2xl">
          <div
            className={`rounded-[15px] p-6 sm:p-10 border space-y-6 transition-colors ${
              isDark ? 'bg-[#0F172A] border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}
            >
              <div className="space-y-1">
                <div
                  className={`inline-flex items-center gap-2 text-xs font-mono font-bold uppercase ${
                    isDark ? 'text-amber-400' : 'text-amber-600'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Free Interactive Enterprise Tool
                </div>
                <h3
                  className={`text-xl sm:text-2xl font-bold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Quick ISO & GRC Audit Readiness Diagnostic
                </h3>
                <p
                  className={`text-xs sm:text-sm ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Assess your organization's digital compliance maturity in 45 seconds.
                </p>
              </div>

              <div
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border ${
                  isDark
                    ? 'text-cyan-400 bg-slate-900 border-slate-800'
                    : 'text-cyan-800 bg-cyan-50 border-cyan-200 font-bold'
                }`}
              >
                {showDiagnosticResult
                  ? 'Evaluation Complete'
                  : `Question ${diagnosticStep + 1} of ${diagnosticQuestions.length}`}
              </div>
            </div>

            {!showDiagnosticResult ? (
              <div className="space-y-5">
                <div
                  className={`text-sm sm:text-base font-semibold ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {diagnosticQuestions[diagnosticStep].q}
                </div>

                <div className="space-y-2.5">
                  {diagnosticQuestions[diagnosticStep].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => handleDiagnosticAnswer(opt.text)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                        isDark
                          ? 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-cyan-500/60'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-cyan-500'
                      }`}
                    >
                      <span
                        className={`text-xs sm:text-sm transition-colors ${
                          isDark
                            ? 'text-slate-200 group-hover:text-white'
                            : 'text-slate-800 group-hover:text-slate-950 font-medium'
                        }`}
                      >
                        {opt.text}
                      </span>
                      <ArrowRight
                        className={`w-4 h-4 group-hover:translate-x-1 transition-all flex-shrink-0 ${
                          isDark
                            ? 'text-slate-600 group-hover:text-cyan-400'
                            : 'text-slate-400 group-hover:text-cyan-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div
                  className={`w-full h-1.5 rounded-full overflow-hidden ${
                    isDark ? 'bg-slate-800' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-300"
                    style={{ width: `${((diagnosticStep + 1) / diagnosticQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div
                  className={`p-5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
                    isDark
                      ? 'bg-cyan-950/40 border-cyan-500/30'
                      : 'bg-cyan-50 border-cyan-300'
                  }`}
                >
                  <div className="space-y-1 text-center sm:text-left">
                    <div
                      className={`text-xs font-mono uppercase font-bold ${
                        isDark ? 'text-cyan-400' : 'text-cyan-800'
                      }`}
                    >
                      Diagnostic Profile Generated
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      High Digital Modernization Potential Detected
                    </div>
                    <p
                      className={`text-xs max-w-xl ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      Based on your responses, migrating your management procedures to SoftExpert & PECB
                      audit protocols will likely reduce audit preparation time by 60%+ and eliminate recurrent compliance penalties.
                    </p>
                  </div>

                  <div
                    className={`flex-shrink-0 text-center p-3 rounded-xl border ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div
                      className={`text-2xl font-black font-mono ${
                        isDark ? 'text-amber-400' : 'text-amber-600'
                      }`}
                    >
                      60%+
                    </div>
                    <div
                      className={`text-[10px] ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Estimated Velocity Gain
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    onClick={resetDiagnostic}
                    className={`text-xs underline ${
                      isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Retake Diagnostic
                  </button>

                  <button
                    onClick={() => onOpenConsultation('Comprehensive Diagnostic Review')}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-900 bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-400 hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>Schedule Free Strategy Review & Implementation Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
