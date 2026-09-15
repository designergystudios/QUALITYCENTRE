import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Image as ImageIcon,
  Video,
  Layers,
  Sparkles,
  ExternalLink,
  X,
  Tag,
  Calendar,
  CheckCircle,
  Clock,
  ShieldCheck,
  Settings,
  Plus,
  Maximize2,
  FileCheck,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCms, GalleryItem } from '../context/CmsContext';
import { AfroPattern } from './AfroPattern';

interface GalleryProps {
  onOpenConsultation?: (topic?: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ onOpenConsultation }) => {
  const { isDark } = useTheme();
  const {
    galleryItems,
    openAdmin,
    heroConfig,
    setMediaAsHero,
  } = useCms();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Media', icon: Layers },
    { id: 'video', label: 'Videos & Demos', icon: Video },
    { id: 'infographic', label: 'ISO Infographics', icon: ImageIcon },
    { id: 'fieldwork', label: 'Audit Fieldwork', icon: FileCheck },
    { id: 'certification', label: 'Certifications', icon: ShieldCheck },
  ];

  const filteredItems = galleryItems.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handleSetAsHero = (item: GalleryItem) => {
    if (item.type === 'video') {
      setMediaAsHero('video', item.mediaUrl);
      setCopiedNotification('Video set as active Hero background!');
    } else {
      setMediaAsHero('infographic', item.mediaUrl);
      setCopiedNotification('Infographic set as active Hero background!');
    }
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  return (
    <section
      id="gallery"
      className={`relative py-20 lg:py-28 border-t transition-colors duration-300 ${
        isDark
          ? 'bg-[#080C14] border-slate-800/80 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Subtle Geometric Background Overlay */}
      <AfroPattern
        variant="interlocking"
        opacity={isDark ? 0.04 : 0.02}
        className="inset-0 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header with Title and Admin Manage Media Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                isDark
                  ? 'bg-[#00A9CF]/10 border-[#00A9CF]/30 text-[#00A9CF]'
                  : 'bg-cyan-50 border-cyan-300 text-[#0077B6]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>MULTIMEDIA AUDIT REPOSITORY</span>
            </div>

            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Interactive{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A9CF] via-[#0096C7] to-[#0077B6]">
                Image & Video Gallery
              </span>
            </h2>

            <p
              className={`text-base sm:text-lg leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Explore our comprehensive library of live digital compliance demos, ISO architecture infographics,
              field audit photos, and client accreditations. Manageable directly via the Admin CMS backend.
            </p>
          </div>

          {/* Quick Action: Open Admin Backend */}
          <div className="flex items-center gap-3">
            <button
              onClick={openAdmin}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shadow-sm ${
                isDark
                  ? 'bg-slate-900 border-[#00A9CF]/40 text-[#00A9CF] hover:bg-slate-800 hover:text-white'
                  : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <Settings className="w-4 h-4 text-[#00A9CF]" />
              <span>Admin Media Manager</span>
            </button>

            <button
              onClick={openAdmin}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all flex items-center gap-2 active:scale-95 shadow-md shadow-[#00A9CF]/20"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Upload Video / Image</span>
            </button>
          </div>
        </div>

        {/* Category Filtering Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const count =
              cat.id === 'all'
                ? galleryItems.length
                : galleryItems.filter((i) => i.category === cat.id).length;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 whitespace-nowrap border ${
                  isActive
                    ? 'bg-[#00A9CF] text-slate-950 border-[#00A9CF] shadow-md shadow-[#00A9CF]/25'
                    : isDark
                    ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                    : 'bg-slate-100/90 border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-[#00A9CF]'}`} />
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive
                      ? 'bg-slate-950/20 text-slate-950'
                      : isDark
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item, idx) => {
              const isHeroMedia =
                item.mediaUrl === heroConfig.videoUrl ||
                item.mediaUrl === heroConfig.infographicUrl;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl flex flex-col ${
                    isDark
                      ? 'bg-slate-900/70 border-slate-800 hover:border-[#00A9CF]/50'
                      : 'bg-white border-slate-200 hover:border-cyan-400 shadow-sm'
                  }`}
                >
                  {/* Thumbnail / Media Container */}
                  <div
                    onClick={() => setSelectedMedia(item)}
                    className="relative aspect-video w-full overflow-hidden bg-slate-950 cursor-pointer"
                  >
                    {item.type === 'video' ? (
                      <div className="w-full h-full relative">
                        {item.thumbnailUrl && item.thumbnailUrl !== item.mediaUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <video
                            src={item.mediaUrl}
                            muted
                            playsInline
                            className="w-full h-full object-cover opacity-80"
                          />
                        )}
                        <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center group-hover:bg-slate-950/20 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-[#00A9CF] text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full relative">
                        <img
                          src={item.thumbnailUrl || item.mediaUrl}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <div className="w-10 h-10 rounded-full bg-slate-900/80 text-white flex items-center justify-center backdrop-blur-md">
                            <Maximize2 className="w-5 h-5 text-[#00A9CF]" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5 ${
                          item.type === 'video'
                            ? 'bg-rose-500/90 text-white'
                            : 'bg-[#00A9CF]/90 text-slate-950'
                        }`}
                      >
                        {item.type === 'video' ? (
                          <>
                            <Video className="w-3 h-3" /> Video Demo
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-3 h-3" /> Infographic
                          </>
                        )}
                      </span>

                      {item.duration && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-950/80 text-slate-300 backdrop-blur-md flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {item.duration}
                        </span>
                      )}
                    </div>

                    {isHeroMedia && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-500/95 text-slate-950 backdrop-blur-md flex items-center gap-1 shadow-md">
                          <CheckCircle className="w-3 h-3" />
                          Active Hero
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Meta */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                        <Calendar className="w-3 h-3 text-[#00A9CF]" />
                        <span>{item.date}</span>
                        <span>•</span>
                        <span className="capitalize">{item.category}</span>
                      </div>

                      <h3
                        onClick={() => setSelectedMedia(item)}
                        className={`font-bold text-base line-clamp-2 cursor-pointer transition-colors ${
                          isDark
                            ? 'text-white group-hover:text-[#00A9CF]'
                            : 'text-slate-900 group-hover:text-[#0077B6]'
                        }`}
                      >
                        {item.title}
                      </h3>

                      <p
                        className={`text-xs leading-relaxed line-clamp-2 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>

                    {/* Tags & Quick Actions */}
                    <div className="space-y-3 pt-2 border-t border-slate-200/40 dark:border-slate-800/80">
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                              isDark
                                ? 'bg-slate-800/70 text-slate-300'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          onClick={() => setSelectedMedia(item)}
                          className={`text-xs font-bold flex items-center gap-1 transition-colors ${
                            isDark
                              ? 'text-[#00A9CF] hover:text-white'
                              : 'text-[#0077B6] hover:text-slate-950'
                          }`}
                        >
                          <span>Inspect Media</span>
                          <Maximize2 className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => handleSetAsHero(item)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                            isHeroMedia
                              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                              : isDark
                              ? 'bg-slate-800/60 border-slate-700 text-slate-300 hover:text-[#00A9CF] hover:border-[#00A9CF]/40'
                              : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-[#0077B6] hover:border-cyan-300'
                          }`}
                          title="Display this media as the live background behind the Hero section"
                        >
                          {isHeroMedia ? 'Selected for Hero' : 'Set as Hero BG'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Global Toast Notification */}
        {copiedNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-950 text-white border border-[#00A9CF]/50 shadow-2xl flex items-center gap-3 text-xs font-bold"
          >
            <CheckCircle className="w-4 h-4 text-[#00A9CF]" />
            <span>{copiedNotification}</span>
          </motion.div>
        )}
      </div>

      {/* =========================================================================
          MEDIA LIGHTBOX / DETAILED PREVIEW MODAL
          ========================================================================= */}
      <AnimatePresence>
        {selectedMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative w-full max-w-5xl rounded-3xl overflow-hidden border shadow-2xl transition-colors ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-white'
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase ${
                      selectedMedia.type === 'video'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-[#00A9CF]/20 text-[#00A9CF] border border-[#00A9CF]/30'
                    }`}
                  >
                    {selectedMedia.type === 'video' ? 'Video Player' : 'High-Res Infographic'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ID: {selectedMedia.id}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedMedia(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Media Player / Viewer */}
              <div className="relative bg-black flex items-center justify-center max-h-[60vh] overflow-hidden">
                {selectedMedia.type === 'video' ? (
                  <video
                    src={selectedMedia.mediaUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full max-h-[60vh] object-contain"
                  >
                    Your browser does not support HTML5 video playback.
                  </video>
                ) : (
                  <img
                    src={selectedMedia.mediaUrl}
                    alt={selectedMedia.title}
                    className="w-full max-h-[60vh] object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              {/* Description & Action Footer */}
              <div className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold">{selectedMedia.title}</h3>
                    <p
                      className={`text-sm mt-1 leading-relaxed ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {selectedMedia.description}
                    </p>
                  </div>

                  {/* Set As Hero Button */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleSetAsHero(selectedMedia)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all flex items-center gap-2 shadow-md"
                    >
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>Use as Hero Background</span>
                    </button>
                  </div>
                </div>

                {/* Metadata Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-mono text-slate-400">Tagged:</span>
                  {selectedMedia.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      #{t}
                    </span>
                  ))}

                  <div className="ml-auto text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Added: {selectedMedia.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
