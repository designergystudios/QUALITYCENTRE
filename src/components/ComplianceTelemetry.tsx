import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  ShieldCheck,
  Zap,
  TrendingUp,
  FileCheck2,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Lock,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AfroPattern } from './AfroPattern';

interface ComplianceTelemetryProps {
  onOpenConsultation: (topic?: string) => void;
}

type StandardType = '9001' | '27001' | 'esg' | 'grc';

export const ComplianceTelemetry: React.FC<ComplianceTelemetryProps> = ({
  onOpenConsultation,
}) => {
  const { isDark } = useTheme();
  const [selectedStandard, setSelectedStandard] = useState<StandardType>('9001');
  const [auditPassScore, setAuditPassScore] = useState<number>(98.4);
  const [isSimulatingAudit, setIsSimulatingAudit] = useState<boolean>(false);

  const handleSimulateAudit = () => {
    setIsSimulatingAudit(true);
    setTimeout(() => {
      setAuditPassScore((prev) => (prev >= 99.8 ? 98.4 : Number((prev + 0.5).toFixed(1))));
      setIsSimulatingAudit(false);
    }, 800);
  };

  const standardData = {
    '9001': {
      title: 'ISO 9001:2015 Quality Management System',
      badge: 'QMS AUTOMATION ENGINE',
      description: 'Digitized document control, continuous CAPA loops, and automated calibration logs for manufacturing and service leaders in Kenya.',
      metric1: '98.4%',
      metric1Label: 'Audit Readiness Index',
      metric2: '-42%',
      metric2Label: 'Non-Conformities Reduction',
      metric3: '+3.2x',
      metric3Label: 'SOP Execution Velocity',
      clauseStatus: [
        { clause: 'Clause 4: Organizational Context & Stakeholder Matrix', status: 'Compliant & Digitized', pct: 100 },
        { clause: 'Clause 6: Risk & Opportunity Matrix Scoring', status: 'Automated Real-Time Matrix', pct: 96 },
        { clause: 'Clause 8: Operations, Traceability & Quality Gates', status: 'PECB Lead Auditor Inspected & Verified', pct: 100 },
        { clause: 'Clause 9: Performance Evaluation & Internal Audit', status: 'SoftExpert EQM Synced Audit Pack', pct: 97 },
        { clause: 'Clause 10: Corrective Action (CAPA) Resolution', status: 'Zero Overdue CAPAs', pct: 99 },
      ],
    },
    '27001': {
      title: 'ISO/IEC 27001:2022 Information Security & Cyber GRC',
      badge: 'ISMS DATA PROTECTION ENGINE',
      description: 'Continuous cloud security posture, Kenya Data Protection Act (DPA 2019) compliance, and automated Annex A security controls.',
      metric1: '99.1%',
      metric1Label: 'SecOps Audit Readiness',
      metric2: 'Zero',
      metric2Label: 'Unmitigated High Risks',
      metric3: '100%',
      metric3Label: 'Access Revocation SLA',
      clauseStatus: [
        { clause: 'Annex A.5: Information Security Policies & Governance', status: 'Synchronized with Kenya DPA & CBK', pct: 100 },
        { clause: 'Annex A.7: Physical & Environmental Controls', status: 'Continuous Biometric & CCTV Logs', pct: 98 },
        { clause: 'Annex A.8: Technology Vulnerability Management', status: 'Automated Patch & Pen-test Validation', pct: 99 },
        { clause: 'Clause 9: Management Review & Security Audits', status: 'Cryptographic Audit Trail Generated', pct: 100 },
        { clause: 'Clause 10: Incident Response & Continuous Hardening', status: 'SLA < 15 Min Containment', pct: 96 },
      ],
    },
    'esg': {
      title: 'Digital ESG & Environmental Sustainability (ISO 14001 / ISO 26000)',
      badge: 'ESG & DECARBONIZATION ENGINE',
      description: 'NEMA statutory reporting, Nairobi Securities Exchange (NSE) ESG disclosure framework, and real-time utility consumption tracking.',
      metric1: '96.8%',
      metric1Label: 'NSE ESG Disclosure Alignment',
      metric2: '-28%',
      metric2Label: 'Scope 1 & 2 Emissions',
      metric3: '100%',
      metric3Label: 'NEMA Waste Manifest Log',
      clauseStatus: [
        { clause: 'Environmental: Effluent, Water & Energy Telemetry', status: 'IoT Metering Live Ingestion', pct: 98 },
        { clause: 'Social: OSHA Safety Protocols & Fair Labor Ratios', status: 'Worker Safety Incidents at Zero', pct: 100 },
        { clause: 'Governance: Anti-Bribery & Board Charters', status: 'Fully Ratified & Monitored', pct: 95 },
        { clause: 'Reporting: GRI & IFRS S1/S2 Investor Disclosures', status: 'Annual ESG Export Ready', pct: 97 },
      ],
    },
    'grc': {
      title: 'Unified Enterprise Governance, Risk & Compliance (GRC)',
      badge: 'UNIFIED ENTERPRISE COCKPIT',
      description: 'Consolidating multi-standard compliance across CBK, CMA, KRA, NEMA, and international certifications into one executive screen.',
      metric1: '99.5%',
      metric1Label: 'Statutory Obligation Score',
      metric2: '50%',
      metric2Label: 'Audit Redundancy Saved',
      metric3: 'Instant',
      metric3Label: 'Board Compliance Cockpit',
      clauseStatus: [
        { clause: 'Central Regulatory Register (Kenya & Regional Laws)', status: '500+ Obligations Cross-Linked', pct: 100 },
        { clause: 'Enterprise Risk Taxonomy & Heatmaps (ISO 31000)', status: 'Real-Time KRI Alerts Active', pct: 98 },
        { clause: 'Audit Universe & Evidence Repository', status: 'Single Source of Truth for Regulators', pct: 100 },
        { clause: 'Policy Management & Employee Attestation', status: '98.9% Staff Completed Training', pct: 99 },
      ],
    },
  };

  const current = standardData[selectedStandard];

  return (
    <section
      id="telemetry"
      className={`relative py-24 border-t transition-colors duration-300 ${
        isDark ? 'bg-[#090D16] border-slate-800' : 'bg-slate-100 border-slate-300'
      }`}
    >
      {/* Afro-futuristic subtle geometric accents */}
      <AfroPattern variant="diamonds" opacity={isDark ? 0.07 : 0.04} className="inset-0 pointer-events-none" />

      {/* Brand Blue Ambient Glow */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[140px] pointer-events-none ${
          isDark ? 'bg-[#00A9CF]/10' : 'bg-[#00A9CF]/12'
        }`}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              isDark
                ? 'bg-[#00A9CF]/10 border-[#00A9CF]/30 text-[#00A9CF]'
                : 'bg-cyan-50 border-cyan-300 text-[#0077B6]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#00A9CF] animate-pulse" />
            <span>QC-DIGITAL-OS // COMPLIANCE TELEMETRY COCKPIT</span>
          </div>

          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Real-Time Audit Readiness &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A9CF] to-[#0077B6]">
              Process Telemetry
            </span>
          </h2>

          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Replace binder panic with real-time proof. Explore how Quality Centre Limited digitizes
            management system clauses into live, self-auditing workflows.
          </p>
        </div>

        {/* Interactive Telemetry Main Chassis */}
        <div
          className={`rounded-3xl border p-6 sm:p-8 lg:p-10 shadow-2xl transition-all duration-300 ${
            isDark
              ? 'bg-[#0F172A]/90 border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.6)]'
              : 'bg-white border-slate-300 shadow-xl shadow-slate-200/60'
          }`}
        >
          {/* Top Control Bar: Selector Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#00A9CF]">
                {current.badge}
              </div>
              <h3 className={`text-xl sm:text-2xl font-black transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {current.title}
              </h3>
            </div>

            {/* Standard Selection Buttons */}
            <div
              className={`flex flex-wrap items-center gap-1.5 p-1 rounded-2xl border ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-300'
              }`}
            >
              {[
                { id: '9001', label: 'ISO 9001 QMS' },
                { id: '27001', label: 'ISO 27001 Cyber' },
                { id: 'esg', label: 'ESG / NEMA' },
                { id: 'grc', label: 'Unified GRC' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStandard(tab.id as StandardType)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedStandard === tab.id
                      ? 'bg-[#00A9CF] text-slate-950 shadow-md shadow-[#00A9CF]/30'
                      : isDark
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <p className={`pt-4 text-xs sm:text-sm leading-relaxed max-w-3xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {current.description}
          </p>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            <div
              className={`p-5 rounded-2xl border transition-all ${
                isDark ? 'bg-slate-900/70 border-[#00A9CF]/30' : 'bg-cyan-50/70 border-cyan-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Audit Health
                </span>
                <ShieldCheck className="w-4 h-4 text-[#00A9CF]" />
              </div>
              <div className="text-3xl sm:text-4xl font-black font-mono text-[#00A9CF]">
                {selectedStandard === '9001' ? `${auditPassScore}%` : current.metric1}
              </div>
              <div className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                {current.metric1Label}
              </div>
            </div>

            <div
              className={`p-5 rounded-2xl border transition-all ${
                isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Variance
                </span>
                <TrendingUp className="w-4 h-4 text-[#00A9CF]" />
              </div>
              <div className="text-3xl sm:text-4xl font-black font-mono text-[#0077B6] dark:text-cyan-300">
                {current.metric2}
              </div>
              <div className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                {current.metric2Label}
              </div>
            </div>

            <div
              className={`p-5 rounded-2xl border transition-all ${
                isDark ? 'bg-slate-900/70 border-emerald-500/20' : 'bg-emerald-50/70 border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Throughput
                </span>
                <Zap className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-500">
                {current.metric3}
              </div>
              <div className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                {current.metric3Label}
              </div>
            </div>
          </div>

          {/* Clause Verification List */}
          <div className="pt-8 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-xs sm:text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <FileCheck2 className="w-4 h-4 text-[#00A9CF]" />
                Live Clause Verification Matrix (Clauses 4 through 10)
              </span>
              <span className="text-[11px] font-mono text-[#00A9CF] font-semibold">
                SoftExpert Suite & PECB Active
              </span>
            </div>

            <div
              className={`space-y-3 rounded-2xl p-5 border ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-300'
              }`}
            >
              {current.clauseStatus.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {item.clause}
                    </span>
                    <span className="text-emerald-500 font-mono text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{item.pct}% Verified</span>
                    </span>
                  </div>

                  <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.08 }}
                      className="h-full bg-gradient-to-r from-[#00A9CF] to-[#0077B6] rounded-full"
                    />
                  </div>

                  <div className={`text-[11px] italic ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    ↳ {item.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 mt-6">
            <button
              onClick={handleSimulateAudit}
              disabled={isSimulatingAudit}
              className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 ${
                isDark
                  ? 'text-[#00A9CF] bg-[#00A9CF]/10 hover:bg-[#00A9CF]/20 border-[#00A9CF]/40'
                  : 'text-[#0077B6] bg-cyan-50 hover:bg-cyan-100 border-cyan-300'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingAudit ? 'animate-spin text-[#00A9CF]' : ''}`} />
              <span>{isSimulatingAudit ? 'Verifying Clause Evidence...' : 'Simulate External Audit Pass'}</span>
            </button>

            <button
              onClick={() => onOpenConsultation(current.title)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all shadow-lg shadow-[#00A9CF]/25 flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Schedule System Diagnostic & Deploy OS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
