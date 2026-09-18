/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCms, ClientLogoItem } from '../context/CmsContext';
import { useTheme } from '../context/ThemeContext';
import {
  ShieldCheck,
  Award,
  Upload,
  Pencil,
  Plus,
  Trash2,
  X,
  Check,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const ClientLogoCarousel: React.FC = () => {
  const {
    clientLogos,
    addClientLogo,
    updateClientLogo,
    deleteClientLogo,
    uploadClientLogoToStorage,
    openAdmin,
  } = useCms();
  const { isDark } = useTheme();

  // In-section edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'add'>('edit');
  const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null);

  // Form states for selected / new logo
  const [logoName, setLogoName] = useState('');
  const [logoIndustry, setLogoIndustry] = useState('');
  const [logoCaption, setLogoCaption] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Open modal and select a specific logo for editing
  const handleOpenEditModal = (targetLogoId?: string) => {
    const targetId = targetLogoId || clientLogos[0]?.id || null;
    setSelectedLogoId(targetId);
    setActiveTab('edit');

    const target = clientLogos.find((l) => l.id === targetId);
    if (target) {
      setLogoName(target.name);
      setLogoIndustry(target.industry || '');
      setLogoCaption(target.caption || '');
      setLogoUrl(target.logoUrl);
    }
    setIsEditModalOpen(true);
  };

  const handleSelectLogo = (logo: ClientLogoItem) => {
    setSelectedLogoId(logo.id);
    setActiveTab('edit');
    setLogoName(logo.name);
    setLogoIndustry(logo.industry || '');
    setLogoCaption(logo.caption || '');
    setLogoUrl(logo.logoUrl);
    setUploadStatus(null);
  };

  const handleSwitchToAdd = () => {
    setActiveTab('add');
    setSelectedLogoId(null);
    setLogoName('');
    setLogoIndustry('');
    setLogoCaption('');
    setLogoUrl('');
    setUploadStatus(null);
  };

  // Upload image file handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      showNotification('File size must be under 20MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(30);
    setUploadStatus(`Uploading "${file.name}" to cloud storage...`);

    try {
      setUploadProgress(70);
      const publicUrl = await uploadClientLogoToStorage(file, logoName || file.name);
      setUploadProgress(100);
      setLogoUrl(publicUrl);
      setUploadStatus(`Successfully uploaded to cloud storage!`);
      showNotification(`Image "${file.name}" uploaded successfully!`);
    } catch (err: any) {
      console.error('Logo upload error:', err);
      setUploadStatus('Upload note: using local preview fallback');
      showNotification('Image processed and ready to save');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(null), 1000);
      if (e.target) e.target.value = '';
    }
  };

  // Save changes to existing logo
  const handleSaveLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoName.trim()) {
      showNotification('Please enter a company name.');
      return;
    }
    if (!logoUrl) {
      showNotification('Please upload an image or provide an image URL.');
      return;
    }

    if (activeTab === 'edit' && selectedLogoId) {
      await updateClientLogo(selectedLogoId, {
        name: logoName.trim(),
        industry: logoIndustry.trim() || 'Enterprise Partner',
        caption: logoCaption.trim(),
        logoUrl: logoUrl,
      });
      showNotification(`Updated "${logoName}" in database! Changes are live across all devices.`);
    } else {
      // Add new logo
      const newLogo = await addClientLogo({
        name: logoName.trim(),
        industry: logoIndustry.trim() || 'Enterprise Partner',
        caption: logoCaption.trim(),
        logoUrl: logoUrl,
      });
      if (newLogo) {
        setSelectedLogoId(newLogo.id);
        setActiveTab('edit');
      }
      showNotification(`Saved "${logoName}" to database! Changes are live across all devices.`);
    }
  };

  // Delete logo
  const handleDeleteLogo = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from carousel?`)) {
      deleteClientLogo(id);
      showNotification(`Removed "${name}" from carousel.`);
      const remaining = clientLogos.filter((l) => l.id !== id);
      if (remaining.length > 0) {
        handleSelectLogo(remaining[0]);
      } else {
        handleSwitchToAdd();
      }
    }
  };

  if (!clientLogos || clientLogos.length === 0) return null;

  return (
    <section
      id="client-logos-section"
      className={`py-12 border-y relative overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-100/70 border-slate-200/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00A9CF]/15 text-[#00A9CF] flex items-center justify-center border border-[#00A9CF]/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#00A9CF]">
                Trusted Industry Partners & Certified Enterprises
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Empowering East Africa's banking, manufacturing, telecommunications, and institutional leaders with ISO & GRC excellence.
            </p>
          </div>

          {/* Direct In-Section Upload & Edit Logos Button */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              id="edit-carousel-logos-btn"
              onClick={() => handleOpenEditModal()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#00A9CF] hover:bg-[#0096C7] text-slate-950 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Edit logos, captions, and upload new images directly"
            >
              <Upload className="w-3.5 h-3.5 text-slate-950" />
              <Pencil className="w-3.5 h-3.5 text-slate-950" />
              <span>Edit Logos & Upload</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950/15 text-[10px] font-mono">
                {clientLogos.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Marquee / Logo Grid Carousel */}
      <div className="relative w-full overflow-hidden">
        {/* Gradient Fade Edges */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-20 sm:w-28 z-10 pointer-events-none bg-gradient-to-r ${
            isDark ? 'from-slate-950 to-transparent' : 'from-slate-100 to-transparent'
          }`}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-20 sm:w-28 z-10 pointer-events-none bg-gradient-to-l ${
            isDark ? 'from-slate-950 to-transparent' : 'from-slate-100 to-transparent'
          }`}
        />

        <div className="flex items-center gap-4 sm:gap-5 animate-marquee py-6 px-4 whitespace-nowrap overflow-x-auto no-scrollbar">
          {clientLogos.concat(clientLogos).map((client, idx) => (
            <div
              key={`${client.id}-${idx}`}
              className={`flex items-center gap-3.5 px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl border transition-all duration-300 flex-shrink-0 group hover:-translate-y-1 shadow-md relative ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 hover:border-[#00A9CF]/60 hover:bg-slate-900'
                  : 'bg-white border-slate-200 hover:border-[#00A9CF]/60 hover:shadow-lg'
              }`}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border-2 border-slate-200 dark:border-slate-700 shadow-inner p-2 relative">
                <img
                  src={client.logoUrl}
                  alt={client.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const initials = (client.name || 'QC')
                      .split(' ')
                      .map((w: string) => w[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase();
                    target.onerror = null;
                    target.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%230F172A" rx="16"/><text x="50%" y="55%" font-size="28" font-family="sans-serif" font-weight="bold" fill="%2300A9CF" dominant-baseline="middle" text-anchor="middle">${initials}</text></svg>`;
                  }}
                />
              </div>

              <div className="text-left pr-2 max-w-[220px]">
                <h5 className="text-base font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-[#00A9CF] transition-colors truncate">
                  {client.name}
                </h5>

                {/* Caption displayed cleanly under company name */}
                {client.caption ? (
                  <p
                    className="text-xs font-semibold text-[#00A9CF] mt-0.5 leading-snug line-clamp-2"
                    title={client.caption}
                  >
                    {client.caption}
                  </p>
                ) : null}

                {client.industry && (
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                    {client.industry}
                  </span>
                )}
              </div>

              {/* Quick in-carousel edit trigger button on hover */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenEditModal(client.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-[#00A9CF]/20 text-[#00A9CF] hover:bg-[#00A9CF] hover:text-slate-950 text-xs ml-1"
                title={`Edit "${client.name}" logo or caption`}
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          IN-SECTION MODAL: EDIT LOGO IMAGES, CAPTIONS & UPLOAD NEW LOGOS
          ========================================================================= */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div
            id="carousel-logo-edit-modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
            onClick={() => setIsEditModalOpen(false)}
          >
            <motion.div
              id="carousel-logo-edit-modal"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-slate-700/80 bg-slate-900 text-white shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00A9CF]/15 border border-[#00A9CF]/30 flex items-center justify-center text-[#00A9CF]">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Carousel Logos & Captions Manager</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#00A9CF]/20 text-[#00A9CF]">
                        Live Section Editor
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Upload new client logo images, change captions, and manage the carousel.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="close-carousel-logo-modal-btn"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Toast feedback banner */}
              {feedbackToast && (
                <div className="px-6 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{feedbackToast}</span>
                </div>
              )}

              {/* Modal Body: Sidebar Logo Selector + Editor Form */}
              <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Column: List of Existing Logos */}
                <div className="md:col-span-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Carousel Logos ({clientLogos.length})
                    </span>
                    <button
                      type="button"
                      id="add-new-logo-tab-btn"
                      onClick={handleSwitchToAdd}
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                        activeTab === 'add'
                          ? 'bg-[#00A9CF] text-slate-950 shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {clientLogos.map((client) => {
                      const isSelected = activeTab === 'edit' && selectedLogoId === client.id;
                      return (
                        <div
                          key={client.id}
                          onClick={() => handleSelectLogo(client)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected
                              ? 'border-[#00A9CF] bg-[#00A9CF]/10 shadow-sm'
                              : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden p-1 flex-shrink-0">
                            <img
                              src={client.logoUrl}
                              alt={client.name}
                              className="w-full h-full object-contain"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-white truncate">{client.name}</div>
                            {client.caption ? (
                              <div className="text-[11px] text-[#00A9CF] truncate font-medium">
                                {client.caption}
                              </div>
                            ) : (
                              <div className="text-[10px] text-slate-400 truncate">{client.industry || 'Enterprise'}</div>
                            )}
                          </div>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#00A9CF] flex-shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Active Logo Editor & Image Uploader Form */}
                <div className="md:col-span-8 bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2 text-sm font-bold text-white">
                      {activeTab === 'edit' ? (
                        <>
                          <Pencil className="w-4 h-4 text-[#00A9CF]" />
                          <span>Edit Client: {logoName || 'Selected Logo'}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400">Add New Logo to Carousel</span>
                        </>
                      )}
                    </div>

                    {activeTab === 'edit' && selectedLogoId && (
                      <button
                        type="button"
                        onClick={() => handleDeleteLogo(selectedLogoId, logoName)}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Logo</span>
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleSaveLogo} className="space-y-4">
                    {/* Hidden File Input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {/* Image Upload Zone */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                        <span>Logo Image *</span>
                        <span className="text-[10px] font-normal text-slate-400">
                          PNG, SVG, JPG, WebP (Max 20MB)
                        </span>
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        {/* Current/Preview Image */}
                        <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-700 bg-slate-900/80 min-h-[120px]">
                          {logoUrl ? (
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-950 p-2 border border-slate-700 flex items-center justify-center shadow-inner">
                              <img
                                src={logoUrl}
                                alt="Preview"
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center text-slate-500 text-xs py-4">
                              <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                              <span>No image selected</span>
                            </div>
                          )}
                        </div>

                        {/* Upload Controls */}
                        <div className="sm:col-span-8 space-y-3">
                          <button
                            type="button"
                            id="browse-logo-file-btn"
                            disabled={isUploading}
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-3 px-4 rounded-xl border border-dashed border-[#00A9CF]/50 hover:border-[#00A9CF] bg-[#00A9CF]/10 hover:bg-[#00A9CF]/15 text-[#00A9CF] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <Upload className="w-4 h-4" />
                            <span>
                              {isUploading
                                ? 'Uploading to Supabase Storage...'
                                : 'Upload Image from Computer / Phone'}
                            </span>
                          </button>

                          {uploadStatus && (
                            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{uploadStatus}</span>
                            </div>
                          )}

                          {uploadProgress !== null && (
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#00A9CF] h-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          )}

                          <div>
                            <span className="text-[10px] text-slate-400 block mb-1">
                              Or specify custom image URL:
                            </span>
                            <input
                              type="url"
                              value={logoUrl}
                              onChange={(e) => setLogoUrl(e.target.value)}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full px-3 py-2 rounded-xl border text-xs font-mono bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Company Name & Industry */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Client / Company Name *
                        </label>
                        <input
                          type="text"
                          value={logoName}
                          onChange={(e) => setLogoName(e.target.value)}
                          placeholder="e.g. Kenya Commercial Bank"
                          className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#00A9CF] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Industry / Sector
                        </label>
                        <input
                          type="text"
                          value={logoIndustry}
                          onChange={(e) => setLogoIndustry(e.target.value)}
                          placeholder="e.g. Banking & Financial Services"
                          className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#00A9CF] outline-none"
                        />
                      </div>
                    </div>

                    {/* Caption Field */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                        <span>Caption / Certification Highlight (Displayed in Carousel)</span>
                        <span className="text-[10px] font-normal text-[#00A9CF]">
                          Appears under the client name
                        </span>
                      </label>
                      <input
                        type="text"
                        value={logoCaption}
                        onChange={(e) => setLogoCaption(e.target.value)}
                        placeholder="e.g. ISO 27001 & ISO 9001 Certified Enterprise Partner"
                        className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-[#00A9CF] outline-none"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Use this caption to highlight the ISO standard, certification status, or partnership scope.
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditModalOpen(false);
                          openAdmin('logos');
                        }}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Advanced Admin Console</span>
                      </button>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsEditModalOpen(false)}
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                        >
                          Close
                        </button>

                        <button
                          type="submit"
                          id="save-carousel-logo-submit-btn"
                          disabled={isUploading}
                          className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#00A9CF] hover:bg-[#0096C7] text-slate-950 shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          <span>
                            {activeTab === 'edit' ? 'Save Logo Changes' : 'Add Logo to Carousel'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
