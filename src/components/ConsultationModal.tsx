import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldCheck,
  Calendar,
  Building,
  User,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  FileCheck,
  Sparkles,
  Download,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ConsultationFormData } from '../types';
import { ISO_STANDARDS } from '../data/content';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedStandard?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  preselectedStandard,
}) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<ConsultationFormData>({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    industry: 'Manufacturing & Industrial',
    companySize: '26 - 100 Employees',
    serviceInterest: 'ISO Certification Audit',
    targetedStandard: preselectedStandard || 'ISO 9001 (Quality Management)',
    timeline: 'Within 30 - 60 Days',
    comments: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');

  useEffect(() => {
    if (preselectedStandard) {
      setFormData((prev) => ({
        ...prev,
        targetedStandard: preselectedStandard,
      }));
    }
  }, [preselectedStandard]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const randomCode = `QC-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceCode(randomCode);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window Chassis */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-2xl border rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-8 z-10 transition-colors ${
            isDark
              ? 'bg-[#0F172A] border-cyan-500/40 shadow-[0_20px_60px_rgba(0,180,216,0.25)]'
              : 'bg-white border-slate-300 shadow-2xl text-slate-900'
          }`}
        >
          {/* Top Decorative Afro Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#00A9CF] via-[#0096C7] to-[#0077B6]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-xl transition-colors z-20 ${
              isDark
                ? 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
            }`}
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSuccess ? (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-1 pr-8">
                <div
                  className={`flex items-center gap-2 text-xs font-mono uppercase font-bold ${
                    isDark ? 'text-[#00A9CF]' : 'text-[#0077B6]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#00A9CF]" />
                  <span>Quality Centre Limited • Client Engagement</span>
                </div>
                <h3
                  className={`text-xl sm:text-2xl font-black ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Schedule an ISO Audit & Advisory Consultation
                </h3>
                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Connect with our senior management systems auditors in Nairobi. We evaluate your current
                  processes and provide a clear, rapid compliance blueprint.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Standard or Scope Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      className={`text-xs font-semibold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      Target Management Standard / Topic:
                    </label>
                    <select
                      value={formData.targetedStandard}
                      onChange={(e) =>
                        setFormData({ ...formData, targetedStandard: e.target.value })
                      }
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-cyan-400 border ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="ISO 9001 (Quality Management)">ISO 9001 (Quality Management)</option>
                      <option value="ISO/IEC 27001 (Information Security)">ISO/IEC 27001 (Cyber & Data Security)</option>
                      <option value="ISO 14001 (Environmental Management)">ISO 14001 (Environmental / NEMA)</option>
                      <option value="ISO 45001 (Occupational Health & Safety)">ISO 45001 (Health & Safety / OSHA)</option>
                      <option value="ISO 22000 (Food Safety Management)">ISO 22000 (Food Safety / HACCP)</option>
                      <option value="ISO 21001 (Educational Management)">ISO 21001 (Educational Orgs)</option>
                      <option value="ISO 26000 & ESG Sustainability">ISO 26000 & Digital ESG</option>
                      <option value="Unified GRC Architecture">Unified Enterprise GRC</option>
                      <option value="PECB Training & Professional Certification">PECB Training & Professional Certification</option>
                      <option value="SoftExpert Enterprise Software Implementation">SoftExpert Enterprise Software</option>
                      <option value="General ISO Consultation & Gap Analysis">General ISO Diagnostic</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className={`text-xs font-semibold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      Target Implementation Timeline:
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) =>
                        setFormData({ ...formData, timeline: e.target.value })
                      }
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-cyan-400 border ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="Immediate (Tender / Regulatory Deadline)">Immediate (Tender / Audit in &lt;30 days)</option>
                      <option value="Within 30 - 60 Days">Within 30 - 60 Days</option>
                      <option value="Next Quarter (3 - 6 Months)">Next Quarter (3 - 6 Months)</option>
                      <option value="Long-term Strategic Planning">Long-term Strategic Planning</option>
                    </select>
                  </div>
                </div>

                {/* Contact Coordinates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      className={`text-xs font-semibold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      Full Name & Role:
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder="e.g. David Kamau, Head of Operations"
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-cyan-400 border ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className={`text-xs font-semibold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      Corporate Email:
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="kamau@company.co.ke"
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-cyan-400 border ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Phone & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      className={`text-xs font-semibold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      Organization Name:
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({ ...formData, companyName: e.target.value })
                        }
                        placeholder="e.g. Apex Industries Ltd"
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-cyan-400 border ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className={`text-xs font-semibold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      Phone / WhatsApp Number:
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+254 7XX XXX XXX"
                        className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-cyan-400 border ${
                          isDark
                            ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                            : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Industry & Company Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      className={`text-xs font-semibold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      Industry Sector:
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) =>
                        setFormData({ ...formData, industry: e.target.value })
                      }
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-cyan-400 border ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="Manufacturing & Industrial">Manufacturing & Heavy Industry</option>
                      <option value="Banking, Fintech & Insurance">Banking, Fintech & Insurance</option>
                      <option value="Agribusiness & Food Processing">Agribusiness & Food Processing</option>
                      <option value="Healthcare & Pharmaceuticals">Healthcare & Pharmaceuticals</option>
                      <option value="Education, TVET & Universities">Education & Universities</option>
                      <option value="Technology & Telecommunications">Technology & Telecoms</option>
                      <option value="Government & Public Agencies">Government & Parastatals</option>
                      <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className={`text-xs font-semibold ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      Workforce Size:
                    </label>
                    <select
                      value={formData.companySize}
                      onChange={(e) =>
                        setFormData({ ...formData, companySize: e.target.value })
                      }
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-cyan-400 border ${
                        isDark
                          ? 'bg-slate-900 border-slate-700 text-white'
                          : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="1 - 25 Employees">1 - 25 Employees</option>
                      <option value="26 - 100 Employees">26 - 100 Employees</option>
                      <option value="101 - 500 Employees">101 - 500 Employees</option>
                      <option value="500+ Enterprise">500+ Enterprise (Multi-Site)</option>
                    </select>
                  </div>
                </div>

                {/* Additional Scope Note */}
                <div className="space-y-1.5">
                  <label
                    className={`text-xs font-semibold ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    Specific Process Challenges or Audit Requirements (Optional):
                  </label>
                  <textarea
                    rows={2}
                    value={formData.comments}
                    onChange={(e) =>
                      setFormData({ ...formData, comments: e.target.value })
                    }
                    placeholder="e.g. Current pain points with document control, upcoming external certification body audit, PECB course registration, desire to deploy SoftExpert..."
                    className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium focus:outline-none focus:border-cyan-400 resize-none border ${
                      isDark
                        ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div
                    className={`text-[11px] ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    🔒 Strict NDA Protection & Kenya DPA Compliant Confidentiality
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all shadow-lg shadow-[#00A9CF]/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        Generating Audit Schedule...
                      </span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-slate-950" />
                        <span>Confirm Consultation Booking</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-8 sm:p-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-[#00A9CF] uppercase tracking-widest">
                  Consultation Request Confirmed
                </div>
                <h3
                  className={`text-2xl sm:text-3xl font-black ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  We Have Received Your Audit Request
                </h3>
                <p
                  className={`text-sm max-w-md mx-auto ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  A Quality Centre Limited senior lead auditor will contact{' '}
                  <span className="text-[#00A9CF] font-semibold">{formData.fullName}</span> at{' '}
                  <span className={`font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {formData.email}
                  </span>{' '}
                  within 4 business hours.
                </p>
              </div>

              {/* Consultation Reference Card */}
              <div
                className={`p-5 rounded-2xl border max-w-md mx-auto text-left space-y-2 font-mono text-xs ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800'
                    : 'bg-slate-100 border-slate-300'
                }`}
              >
                <div className="flex justify-between text-slate-400">
                  <span>Reference ID:</span>
                  <span className="text-[#00A9CF] font-bold">{referenceCode}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Target Standard:</span>
                  <span className="text-cyan-600">{formData.targetedStandard}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Company:</span>
                  <span className={isDark ? 'text-white' : 'text-slate-900'}>
                    {formData.companyName}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Office:</span>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                    Nairobi Chiromo Road HQ
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-xl text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

