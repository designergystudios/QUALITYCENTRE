/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useCms, SuccessStoryItem } from '../context/CmsContext';
import { useTheme } from '../context/ThemeContext';
import { uploadPdfToLiveStorage, uploadStoryImageToLiveStorage } from '../lib/supabase';
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
  Pencil,
  Layers,
  LayoutGrid,
  X,
  Save,
  Plus,
} from 'lucide-react';

export const SuccessStories: React.FC<{ onOpenConsultation: (topic: string) => void }> = ({ onOpenConsultation }) => {
  const { successStories, updateSuccessStory, addSuccessStory } = useCms();
  const { isDark } = useTheme();
  const [selectedStoryId, setSelectedStoryId] = useState<string>(successStories[0]?.id || '');
  const [viewMode, setViewMode] = useState<'tab' | 'grid'>('tab');
  
  // PDF upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Edit / Add Story Modal State
  const [editingStory, setEditingStory] = useState<SuccessStoryItem | null>(null);
  const [isAddingNewStory, setIsAddingNewStory] = useState(false);

  const [editClientName, setEditClientName] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editIndustry, setEditIndustry] = useState('');
  const [editStandard, setEditStandard] = useState('');
  const [editChallenge, setEditChallenge] = useState('');
  const [editSolution, setEditSolution] = useState('');
  const [editResults, setEditResults] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editPdfUrl, setEditPdfUrl] = useState('');
  const [editPdfName, setEditPdfName] = useState('');
  const [isModalUploading, setIsModalUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalImageInputRef = useRef<HTMLInputElement>(null);
  const modalPdfInputRef = useRef<HTMLInputElement>(null);

  // Helper to flexibly render results (bullet items or paragraph/narrative text) across full container width
  const renderResultsContent = (results: string[] | string) => {
    let items: string[] = [];

    if (Array.isArray(results)) {
      items = results.filter((r) => typeof r === 'string' && r.trim().length > 0);
    } else if (typeof results === 'string' && results.trim().length > 0) {
      items = results
        .split(/\n|;/)
        .map((item) => item.replace(/^[-•*1-9.]+\s*/, '').trim())
        .filter(Boolean);
    }

    if (items.length > 0) {
      return (
        <div className="space-y-2.5 w-full flex-1 flex flex-col justify-center">
          {items.map((result, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-start gap-3 w-full shadow-xs transition-all ${
                isDark ? 'bg-slate-950/80 border-slate-800/90' : 'bg-white border-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {result}
              </span>
            </div>
          ))}
        </div>
      );
    }

    const textContent = typeof results === 'string' ? results : '';
    return (
      <div className={`p-4 rounded-xl border w-full flex-1 flex items-center ${
        isDark ? 'bg-slate-950/80 border-slate-800/90' : 'bg-white border-slate-200'
      }`}>
        <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          {textContent || 'No specific outcomes recorded for this audit.'}
        </p>
      </div>
    );
  };

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

      const publicUrl = await uploadPdfToLiveStorage(file, currentStory.clientName || 'case-study');

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

  // Open Add New Case Study Modal
  const openAddNewModal = () => {
    setIsAddingNewStory(true);
    setEditingStory({
      id: 'new',
      clientName: '',
      title: '',
      industry: 'Banking & Finance',
      standard: 'ISO 9001:2015',
      challenge: 'Multi-site compliance audit preparation & operational standard implementation.',
      solution: 'Deployed ISO Quality Centre automated control frameworks and staff training.',
      results: ['100% audit pass rate achieved', 'Zero non-conformities found'],
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      date: new Date().toISOString().split('T')[0],
    });
    setEditClientName('');
    setEditTitle('');
    setEditIndustry('Banking & Finance');
    setEditStandard('ISO 9001:2015');
    setEditChallenge('');
    setEditSolution('');
    setEditResults('100% audit pass rate achieved\nZero non-conformities found');
    setEditImageUrl('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80');
    setEditPdfUrl('');
    setEditPdfName('');
  };

  // Open Edit Story Modal
  const openEditModal = (story: SuccessStoryItem) => {
    setIsAddingNewStory(false);
    setEditingStory(story);
    setEditClientName(story.clientName);
    setEditTitle(story.title);
    setEditIndustry(story.industry);
    setEditStandard(story.standard);
    setEditChallenge(story.challenge);
    setEditSolution(story.solution);
    setEditResults(Array.isArray(story.results) ? story.results.join('\n') : '');
    setEditImageUrl(story.imageUrl);
    setEditPdfUrl(story.pdfUrl || '');
    setEditPdfName(story.pdfName || '');
  };

  // Save Edits or Add New Story
  const handleSaveModalEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editClientName || !editTitle) return;

    const resultsArray = editResults
      ? editResults.split('\n').map((r) => r.trim()).filter(Boolean)
      : ['100% audit pass rate achieved'];

    if (isAddingNewStory) {
      const createdStory = await addSuccessStory({
        clientName: editClientName,
        title: editTitle,
        industry: editIndustry || 'Enterprise',
        standard: editStandard || 'ISO 9001:2015',
        challenge: editChallenge || 'Enterprise quality and compliance audit implementation.',
        solution: editSolution || 'Deployed ISO Quality Centre automated control frameworks.',
        results: resultsArray,
        imageUrl: editImageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
        pdfUrl: editPdfUrl || undefined,
        pdfName: editPdfName || undefined,
      });

      setSelectedStoryId(createdStory.id);
      setUploadStatus(`New case study for "${editClientName}" published to database!`);
    } else if (editingStory) {
      await updateSuccessStory(editingStory.id, {
        clientName: editClientName,
        title: editTitle,
        industry: editIndustry || 'Enterprise',
        standard: editStandard || 'ISO 9001:2015',
        challenge: editChallenge,
        solution: editSolution,
        results: resultsArray,
        imageUrl: editImageUrl,
        pdfUrl: editPdfUrl || undefined,
        pdfName: editPdfName || undefined,
      });
      setUploadStatus(`Saved changes for "${editClientName}" to database!`);
    }

    setTimeout(() => setUploadStatus(null), 5000);
    setEditingStory(null);
    setIsAddingNewStory(false);
  };

  // Modal Image Upload
  const handleModalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsModalUploading(true);
      const url = await uploadStoryImageToLiveStorage(file, editClientName || 'story');
      setEditImageUrl(url);
    } catch (err) {
      console.error('Modal image upload failed:', err);
    } finally {
      setIsModalUploading(false);
    }
  };

  // Modal PDF Upload
  const handleModalPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsModalUploading(true);
      const url = await uploadPdfToLiveStorage(file, editClientName || 'case-study');
      setEditPdfUrl(url);
      setEditPdfName(file.name);
    } catch (err) {
      console.error('Modal PDF upload failed:', err);
    } finally {
      setIsModalUploading(false);
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
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
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

          {/* View Mode Toggle & Add Story Pill Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <div className={`p-1.5 rounded-2xl border flex items-center gap-1 ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <button
                onClick={() => setViewMode('tab')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  viewMode === 'tab'
                    ? 'bg-[#00A9CF] text-slate-950 shadow-md'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Interactive Tab View ({successStories.length})</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  viewMode === 'grid'
                    ? 'bg-[#00A9CF] text-slate-950 shadow-md'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Show All {successStories.length} Case Studies</span>
              </button>
            </div>

            <button
              onClick={openAddNewModal}
              className="px-5 py-3 rounded-2xl text-xs font-bold bg-[#00A9CF] hover:bg-[#0096C7] text-slate-950 transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Case Study</span>
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

        {/* =========================================================================
            VIEW MODE 1: INTERACTIVE TABBED FOCUS VIEW
            ========================================================================= */}
        {viewMode === 'tab' && (
          <>
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
                <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8 min-h-full">
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#00A9CF]">
                          Project Case Study
                        </span>
                        <h4 className="text-2xl sm:text-3xl font-black tracking-tight">
                          {currentStory.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        {currentStory.pdfUrl && (
                          <a
                            href={currentStory.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#00A9CF] text-slate-950 hover:bg-[#0096C7] transition-all flex items-center gap-1.5 shadow"
                            title="Open attached PDF report in new tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View PDF Report</span>
                          </a>
                        )}

                        <button
                          onClick={() => openEditModal(currentStory)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all flex items-center gap-1.5 shadow"
                          title="Edit this success story"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit Story</span>
                        </button>
                      </div>
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

                    {/* Verified Results & Outcomes - Full width elastic container stretching to fill entire column */}
                    <div className={`w-full flex-1 p-5 rounded-2xl border flex flex-col justify-between space-y-3 shadow-sm ${
                      isDark ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-emerald-50/40 border-emerald-200/80'
                    }`}>
                      <div className="flex items-center justify-between gap-2 border-b border-emerald-500/15 pb-2.5">
                        <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                          <Award className="w-4 h-4 text-emerald-400" />
                          Verified Results & Outcomes
                        </h5>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Audit Certified
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col justify-center w-full">
                        {renderResultsContent(currentStory.results)}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs font-mono text-slate-400">
                      Accreditation Date: <span className={isDark ? 'text-white font-bold' : 'text-slate-900 font-bold'}>{currentStory.date}</span>
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
          </>
        )}

        {/* =========================================================================
            VIEW MODE 2: SHOW ALL CASE STORIES GRID VIEW
            ========================================================================= */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {successStories.map((story) => (
              <div
                key={story.id}
                className={`rounded-3xl border overflow-hidden shadow-xl flex flex-col justify-between transition-all duration-300 hover:shadow-2xl ${
                  isDark ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  {/* Card Banner Image */}
                  <div className="relative h-56 overflow-hidden bg-slate-950">
                    <img
                      src={story.imageUrl}
                      alt={story.clientName}
                      className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00A9CF] text-slate-950 shadow">
                        {story.standard}
                      </span>
                      <button
                        onClick={() => openEditModal(story)}
                        className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all flex items-center gap-1 shadow"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest">{story.industry}</div>
                      <h3 className="text-xl font-black text-white">{story.clientName}</h3>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 space-y-5">
                    <div>
                      <h4 className="text-lg font-bold text-[#00A9CF] leading-snug">{story.title}</h4>
                    </div>

                    <div className="space-y-3">
                      <div className={`p-4 rounded-xl border text-xs ${
                        isDark ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}>
                        <div className="font-bold text-rose-400 mb-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          Challenge
                        </div>
                        <p>{story.challenge}</p>
                      </div>

                      <div className={`p-4 rounded-xl border text-xs ${
                        isDark ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}>
                        <div className="font-bold text-[#00A9CF] mb-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00A9CF]" />
                          Solution
                        </div>
                        <p>{story.solution}</p>
                      </div>
                    </div>

                    {/* Verified Results */}
                    <div className={`p-4 rounded-xl border space-y-2.5 ${
                      isDark ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-emerald-50/40 border-emerald-200/80'
                    }`}>
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        Verified Results & Outcomes
                      </div>
                      {renderResultsContent(story.results)}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-0 space-y-3">
                  {story.pdfUrl && (
                    <a
                      href={story.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>View Attached PDF Report</span>
                    </a>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(story)}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit Fields</span>
                    </button>
                    <button
                      onClick={() => onOpenConsultation(`Case Study: ${story.clientName}`)}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#00A9CF] text-slate-950 hover:bg-[#0096C7] transition-all flex items-center justify-center gap-1.5 shadow"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Case Study Card Tile */}
            <div
              onClick={openAddNewModal}
              className={`rounded-3xl border-2 border-dashed border-slate-700 hover:border-[#00A9CF] cursor-pointer p-8 flex flex-col items-center justify-center text-center space-y-4 transition-all hover:bg-slate-900/60 min-h-[420px] group ${
                isDark ? 'bg-slate-900/40' : 'bg-white/80'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#00A9CF]/15 text-[#00A9CF] flex items-center justify-center border border-[#00A9CF]/30 shadow-inner group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Publish New Case Study
                </h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Add client accreditation details, ISO standard, verified results, banner image & attach PDF report.
                </p>
              </div>
              <span className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00A9CF] text-slate-950 shadow-md group-hover:bg-[#0096C7]">
                + Add Case Study
              </span>
            </div>
          </div>
        )}

        {/* =========================================================================
            EDIT / ADD STORY MODAL DIALOG
            ========================================================================= */}
        {editingStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 font-bold text-lg">
                  {isAddingNewStory ? (
                    <>
                      <Plus className="w-5 h-5 text-[#00A9CF]" />
                      <span className="text-[#00A9CF]">Publish New Client Case Study</span>
                    </>
                  ) : (
                    <>
                      <Pencil className="w-5 h-5 text-amber-400" />
                      <span className="text-amber-400">Edit Success Story: {editingStory.clientName}</span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => {
                    setEditingStory(null);
                    setIsAddingNewStory(false);
                  }}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModalEdits} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Client / Enterprise Name *
                    </label>
                    <input
                      type="text"
                      value={editClientName}
                      onChange={(e) => setEditClientName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Case Study Title *
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      ISO Standard / Accreditation
                    </label>
                    <input
                      type="text"
                      value={editStandard}
                      onChange={(e) => setEditStandard(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Industry / Sector
                    </label>
                    <input
                      type="text"
                      value={editIndustry}
                      onChange={(e) => setEditIndustry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white"
                    />
                  </div>
                </div>

                {/* Banner Image Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Banner Image URL or Upload
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      ref={modalImageInputRef}
                      onChange={handleModalImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => modalImageInputRef.current?.click()}
                      className="py-2.5 px-4 rounded-xl border border-dashed border-slate-700 hover:border-[#00A9CF] bg-slate-950 text-xs font-bold text-slate-300 flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4 text-[#00A9CF]" />
                      <span>{isModalUploading ? 'Uploading...' : 'Upload Image'}</span>
                    </button>
                    <input
                      type="url"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border text-xs font-mono bg-slate-950 border-slate-700 text-white"
                    />
                  </div>
                </div>

                {/* PDF Document Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    PDF Document URL or Upload
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="application/pdf"
                      ref={modalPdfInputRef}
                      onChange={handleModalPdfUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => modalPdfInputRef.current?.click()}
                      className="py-2.5 px-4 rounded-xl border border-dashed border-slate-700 hover:border-[#00A9CF] bg-slate-950 text-xs font-bold text-slate-300 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-[#00A9CF]" />
                      <span>{isModalUploading ? 'Uploading...' : 'Upload PDF'}</span>
                    </button>
                    <input
                      type="url"
                      value={editPdfUrl}
                      onChange={(e) => setEditPdfUrl(e.target.value)}
                      placeholder="Supabase PDF URL..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border text-xs font-mono bg-slate-950 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    The Enterprise Challenge
                  </label>
                  <textarea
                    rows={2}
                    value={editChallenge}
                    onChange={(e) => setEditChallenge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Our Solution & Framework
                  </label>
                  <textarea
                    rows={2}
                    value={editSolution}
                    onChange={(e) => setEditSolution(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Verified Results (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={editResults}
                    onChange={(e) => setEditResults(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono bg-slate-950 border-slate-700 text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStory(null);
                      setIsAddingNewStory(false);
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md ${
                      isAddingNewStory
                        ? 'bg-[#00A9CF] hover:bg-[#0096C7] text-slate-950'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    }`}
                  >
                    {isAddingNewStory ? <Plus className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    <span>{isAddingNewStory ? 'Publish Case Study to Database' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
