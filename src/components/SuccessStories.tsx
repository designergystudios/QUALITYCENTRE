/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useCms } from '../context/CmsContext';
import { useTheme } from '../context/ThemeContext';
import { uploadPdfToLiveStorage } from '../lib/supabase';
import {
  Award,
  CheckCircle2,
  Building2,
  FileText,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Upload,
  Loader2,
  ExternalLink,
  Trash2,
  FileCheck,
  AlertCircle,
  Eye,
  Download,
  FileUp,
} from 'lucide-react';

export const SuccessStories: React.FC<{ onOpenConsultation: (topic: string) => void }> = ({ onOpenConsultation }) => {
  const { successStories, updateSuccessStory } = useCms();
  const { isDark } = useTheme();
  const [selectedStoryId, setSelectedStoryId] = useState<string>(successStories[0]?.id || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!successStories || successStories.length === 0) return null;

  const currentStory = successStories.find((s) => s.id === selectedStoryId) || successStories[0];

  const handlePdfFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadError('Please select a valid PDF file (.pdf).');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadStatus(`Uploading "${file.name}" to Supabase Storage...`);

      // Upload file directly to Supabase Storage
      const publicUrl = await uploadPdfToLiveStorage(file, currentStory.clientName || 'case-study');

      // Update CMS Context & Backend Database with Supabase PDF URL
      updateSuccessStory(currentStory.id, {
        pdfUrl: publicUrl,
        pdfName: file.name,
      });

      setUploadStatus(`PDF successfully uploaded to Supabase & embedded!`);
      setTimeout(() => setUploadStatus(null), 6000);
    } catch (err: any) {
      console.error('PDF upload error:', err);
      setUploadError('Failed to upload PDF to Supabase. Please check connection and try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePdf = () => {
    if (confirm(`Remove attached PDF from "${currentStory.clientName}"?`)) {
      updateSuccessStory(currentStory.id, {
        pdfUrl: undefined,
        pdfName: undefined,
      });
      setUploadStatus(null);
    }
  };

  return (
    <section id="success-stories" className={`py-24 relative overflow-hidden transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Hidden File Input for PDF Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="application/pdf"
        onChange={handlePdfFileSelect}
        className="hidden"
      />

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

          {/* Quick PDF Upload Trigger in Header */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#00A9CF] text-slate-950 hover:bg-[#0096C7] transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading to Supabase...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Case Study PDF to Supabase</span>
                </>
              )}
            </button>
          </div>

          {/* Upload Status Banner */}
          {uploadStatus && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-fade-in">
              <FileCheck className="w-4 h-4" />
              <span>{uploadStatus}</span>
            </div>
          )}

          {/* Upload Error Banner */}
          {uploadError && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-fade-in">
              <AlertCircle className="w-4 h-4" />
              <span>{uploadError}</span>
            </div>
          )}
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
                {story.pdfUrl && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm" title="PDF Report Attached" />
                )}
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00A9CF]">
                      Project Case Study
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-black tracking-tight">
                      {currentStory.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="self-start sm:self-center px-4 py-2 rounded-xl text-xs font-bold bg-[#00A9CF]/15 text-[#00A9CF] hover:bg-[#00A9CF] hover:text-slate-950 border border-[#00A9CF]/30 transition-all flex items-center gap-2"
                    title="Upload or replace PDF for this case study"
                  >
                    <FileUp className="w-4 h-4" />
                    <span>{currentStory.pdfUrl ? 'Replace PDF' : 'Upload PDF'}</span>
                  </button>
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

              {/* PDF Upload / Embed Status Section inside Card */}
              {!currentStory.pdfUrl && (
                <div className={`p-5 rounded-2xl border-2 border-dashed ${
                  isDark
                    ? 'bg-slate-950/40 border-[#00A9CF]/30 text-slate-300'
                    : 'bg-cyan-50/40 border-[#00A9CF]/40 text-slate-700'
                } flex flex-col sm:flex-row items-center justify-between gap-4`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00A9CF]/20 flex items-center justify-center text-[#00A9CF] flex-shrink-0">
                      <FileUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-[#00A9CF] flex items-center gap-2">
                        Upload Case Study PDF
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono normal-case">Supabase Cloud</span>
                      </h5>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Attach an official PDF report or certificate to embed directly in this case study.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all flex items-center gap-2 flex-shrink-0"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Select PDF</span>
                      </>
                    )}
                  </button>
                </div>
              )}

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

        {/* Embedded PDF Viewer Section (if PDF is attached to selected story) */}
        {currentStory.pdfUrl && (
          <div className={`mt-8 p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-4 transition-all ${
            isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00A9CF]/20 flex items-center justify-center text-[#00A9CF] flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">
                      {currentStory.pdfName || `${currentStory.clientName} Official PDF Document`}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      Supabase Storage
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-lg font-mono">
                    {currentStory.pdfUrl}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={currentStory.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00A9CF] text-slate-950 hover:bg-[#0096C7] transition-all flex items-center gap-1.5 shadow"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open PDF in Supabase</span>
                </a>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace</span>
                </button>
                <button
                  onClick={handleRemovePdf}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>

            {/* Embedded Iframe PDF Viewer */}
            <div className="w-full h-[550px] sm:h-[650px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner relative">
              <iframe
                src={`${currentStory.pdfUrl}#toolbar=1`}
                title={currentStory.pdfName || `${currentStory.clientName} Case Study PDF`}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
