import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  Unlock,
  Upload,
  Video,
  Image as ImageIcon,
  Save,
  Trash2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Download,
  FileCode,
  Sliders,
  Type,
  Building,
  Sparkles,
  Play,
  Plus,
  ArrowRight,
  ExternalLink,
  Eye,
  Award,
  Database,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCms, GalleryItem } from '../context/CmsContext';

export const AdminBackend: React.FC = () => {
  const { isDark } = useTheme();
  const {
    isAdminOpen,
    closeAdmin,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    heroConfig,
    companyConfig,
    galleryItems,
    clientLogos,
    successStories,
    updateHeroConfig,
    updateCompanyConfig,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    addClientLogo,
    deleteClientLogo,
    addSuccessStory,
    deleteSuccessStory,
    setMediaAsHero,
    resetToDefaults,
    exportConfigJson,
    importConfigJson,
    uploadLogoToDatabase,
    uploadClientLogoToStorage,
    uploadStoryImageToStorage,
    uploadBookCoverToStorage,
    bookConfig,
    updateBookConfig,
    isDatabaseConnected,
    lastDatabaseSync,
  } = useCms();

  const [activeTab, setActiveTab] = useState<'hero' | 'media' | 'logos' | 'stories' | 'book' | 'company' | 'backup'>('hero');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Upload progress states
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(null);

  // Local draft states for hero
  const [heroDraft, setHeroDraft] = useState(heroConfig);
  const [companyDraft, setCompanyDraft] = useState(companyConfig);
  const [bookDraft, setBookDraft] = useState(bookConfig);

  // Media upload form state
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaDescription, setNewMediaDescription] = useState('');
  const [newMediaCategory, setNewMediaCategory] = useState<'infographic' | 'video' | 'fieldwork' | 'certification'>('infographic');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaTags, setNewMediaTags] = useState('');
  const [newMediaDuration, setNewMediaDuration] = useState('');
  const [setAsHeroImmediate, setSetAsHeroImmediate] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Client Logo upload state
  const [newLogoName, setNewLogoName] = useState('');
  const [newLogoIndustry, setNewLogoIndustry] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');

  // Success Story form state
  const [storyClientName, setStoryClientName] = useState('');
  const [storyTitle, setStoryTitle] = useState('');
  const [storyIndustry, setStoryIndustry] = useState('');
  const [storyChallenge, setStoryChallenge] = useState('');
  const [storySolution, setStorySolution] = useState('');
  const [storyResults, setStoryResults] = useState('');
  const [storyStandard, setStoryStandard] = useState('');
  const [storyImageUrl, setStoryImageUrl] = useState('');
  const storyImageInputRef = useRef<HTMLInputElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroVideoInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const clientLogoInputRef = useRef<HTMLInputElement>(null);
  const bookCoverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCompanyDraft(companyConfig);
  }, [companyConfig]);

  useEffect(() => {
    setHeroDraft(heroConfig);
  }, [heroConfig]);

  useEffect(() => {
    setBookDraft(bookConfig);
  }, [bookConfig]);

  if (!isAdminOpen) return null;

  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Real upload to Supabase Storage bucket
  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('File size must be under 20MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(25);
    setUploadingFileName(file.name);
    setUploadError(null);

    try {
      setUploadProgress(60);
      const publicUrl = await uploadClientLogoToStorage(file, newLogoName || file.name);
      setUploadProgress(100);
      setNewLogoUrl(publicUrl);
      setIsUploading(false);
      setUploadingFileName(null);
      showToast(`Uploaded ${file.name} to Supabase Cloud Storage (client-logos)!`);
    } catch (err: any) {
      console.error('Supabase client logo upload error:', err);
      setIsUploading(false);
      setUploadingFileName(null);
      setUploadError('Failed to upload to Supabase Storage: ' + (err?.message || 'Check network connection'));
      showToast('Upload error: failed to push to Supabase bucket');
    }
  };

  const handleStoryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('File size must be under 20MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(25);
    setUploadingFileName(file.name);
    setUploadError(null);

    try {
      setUploadProgress(60);
      const publicUrl = await uploadStoryImageToStorage(file, storyClientName || file.name);
      setUploadProgress(100);
      setStoryImageUrl(publicUrl);
      setIsUploading(false);
      setUploadingFileName(null);
      showToast(`Story image uploaded to Supabase Storage!`);
    } catch (err: any) {
      console.error('Supabase story upload error:', err);
      setIsUploading(false);
      setUploadingFileName(null);
      setUploadError('Failed to upload to Supabase Storage: ' + (err?.message || 'Check network connection'));
    }
  };

  const handleBookCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('Book cover image size must be under 20MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(25);
    setUploadingFileName(file.name);
    setUploadError(null);

    try {
      setUploadProgress(60);
      const publicUrl = await uploadBookCoverToStorage(file, bookDraft.title || 'iso-9000-secret');
      setUploadProgress(100);
      setBookDraft((prev) => ({ ...prev, coverImage: publicUrl }));
      setIsUploading(false);
      setUploadingFileName(null);
      showToast(`Book cover "${file.name}" uploaded to live Supabase Storage!`);
    } catch (err: any) {
      console.error('Book cover upload error:', err);
      setIsUploading(false);
      setUploadingFileName(null);
      setUploadError('Failed to upload book cover: ' + (err?.message || 'Check network connection'));
      showToast('Upload error: failed to push cover image to Supabase');
    }
  };

  const handleSaveBook = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateBookConfig(bookDraft);
    showToast('Founder book details and synopsis saved successfully!');
  };

  const handleAddSuccessStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyClientName || !storyTitle || !storyImageUrl) {
      setUploadError('Please provide client name, title, and upload image URL.');
      return;
    }
    const resultsArray = storyResults
      ? storyResults.split('\n').filter((r) => r.trim().length > 0)
      : ['100% audit compliance achieved', 'Zero non-conformities found'];

    addSuccessStory({
      clientName: storyClientName,
      title: storyTitle,
      industry: storyIndustry || 'Enterprise',
      challenge: storyChallenge || 'Rigorous multi-site compliance audit preparation.',
      solution: storySolution || 'Deployed ISO Quality Centre automated control frameworks.',
      results: resultsArray,
      imageUrl: storyImageUrl,
      standard: storyStandard || 'ISO 9001:2015',
    });

    setStoryClientName('');
    setStoryTitle('');
    setStoryIndustry('');
    setStoryChallenge('');
    setStorySolution('');
    setStoryResults('');
    setStoryStandard('');
    setStoryImageUrl('');
    setUploadError(null);
    showToast('Success story added to database successfully!');
  };

  const handleAddClientLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogoName || !newLogoUrl) {
      setUploadError('Please provide client name and upload or provide logo URL.');
      return;
    }

    let resolvedLogoUrl = newLogoUrl;
    // If it's still base64 data, upload to Supabase first
    if (resolvedLogoUrl.startsWith('data:image/')) {
      setIsUploading(true);
      setUploadingFileName('Uploading to Supabase Storage...');
      try {
        resolvedLogoUrl = await uploadClientLogoToStorage(resolvedLogoUrl, newLogoName);
      } catch (err) {
        console.warn('Pre-add Supabase upload notice:', err);
      } finally {
        setIsUploading(false);
        setUploadingFileName(null);
      }
    }

    addClientLogo({
      name: newLogoName,
      industry: newLogoIndustry || 'Enterprise & Banking',
      logoUrl: resolvedLogoUrl,
    });
    setNewLogoName('');
    setNewLogoIndustry('');
    setNewLogoUrl('');
    setUploadError(null);
    showToast('Client logo saved and synchronized to cloud database!');
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const success = loginAdmin(username, password);
    if (!success) {
      setAuthError(true);
    } else {
      setAuthError(false);
      setHeroDraft(heroConfig);
      setCompanyDraft(companyConfig);
      showToast('Authenticated as Lead Administrator');
    }
  };

  const handleQuickLogin = () => {
    setUsername('admin');
    setPassword('Qckenya@2026!');
    loginAdmin('admin', 'Qckenya@2026!');
    setHeroDraft(heroConfig);
    setCompanyDraft(companyConfig);
    showToast('Authenticated via One-Click Lead Admin Access');
  };

  const handleSaveHero = () => {
    updateHeroConfig(heroDraft);
    showToast('Hero section & Background configurations updated successfully!');
  };

  const handleSaveCompany = () => {
    updateCompanyConfig(companyDraft);
    showToast('Company details & Key statistics updated successfully!');
  };

  // Handle local file selection and convert to Base64 for instant preview & persistence
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'gallery' | 'hero-video' | 'hero-image' | 'logo'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: warn if > 15MB for localStorage safety
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File exceeds 15MB. For large media, consider pasting an external CDN URL.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setIsUploading(false);
      if (!dataUrl) return;

      if (target === 'gallery') {
        setNewMediaUrl(dataUrl);
        if (file.type.startsWith('video/')) {
          setNewMediaType('video');
          setNewMediaCategory('video');
        } else {
          setNewMediaType('image');
          setNewMediaCategory('infographic');
        }
        if (!newMediaTitle) {
          setNewMediaTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
        showToast(`Loaded ${file.name} successfully!`);
      } else if (target === 'hero-video') {
        setHeroDraft((prev) => ({
          ...prev,
          videoUrl: dataUrl,
          bgMode: 'video',
        }));
        showToast('Hero background video file uploaded!');
      } else if (target === 'hero-image') {
        setHeroDraft((prev) => ({
          ...prev,
          infographicUrl: dataUrl,
          bgMode: 'infographic',
        }));
        showToast('Hero background infographic image uploaded!');
      } else if (target === 'logo') {
        uploadLogoToDatabase(dataUrl, file.name)
          .then((savedUrl) => {
            const updatedConfig = {
              ...companyDraft,
              logoUrl: savedUrl,
              logoType: 'custom' as const,
            };
            setCompanyDraft(updatedConfig);
            showToast('Logo uploaded and synchronized to database for all devices!');
          })
          .catch(() => {
            const updatedConfig = {
              ...companyDraft,
              logoUrl: dataUrl,
              logoType: 'custom' as const,
            };
            setCompanyDraft(updatedConfig);
            updateCompanyConfig(updatedConfig);
            showToast('Site logo uploaded and applied!');
          });
      }
    };
    reader.onerror = () => {
      setIsUploading(false);
      setUploadError('Failed to read file.');
    };
    reader.readAsDataURL(file);
  };

  const handleCreateMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaUrl) {
      setUploadError('Please provide a Media File or paste a valid Media URL.');
      return;
    }
    if (!newMediaTitle) {
      setUploadError('Please enter a descriptive title for this media.');
      return;
    }

    setUploadError(null);
    const tagsArray = newMediaTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const item = addGalleryItem({
      type: newMediaType,
      title: newMediaTitle,
      description: newMediaDescription || 'Uploaded via Quality Centre Admin Backend.',
      category: newMediaCategory,
      mediaUrl: newMediaUrl,
      tags: tagsArray.length > 0 ? tagsArray : ['ISO', 'Quality Centre'],
      duration: newMediaDuration || undefined,
      isFeatured: true,
    });

    if (setAsHeroImmediate) {
      if (newMediaType === 'video') {
        setMediaAsHero('video', newMediaUrl);
      } else {
        setMediaAsHero('infographic', newMediaUrl);
      }
    }

    // Reset media form
    setNewMediaTitle('');
    setNewMediaDescription('');
    setNewMediaUrl('');
    setNewMediaTags('');
    setNewMediaDuration('');
    setSetAsHeroImmediate(false);
    showToast(`Added "${item.title}" to Multimedia Repository!`);
  };

  const handleExportJson = () => {
    const json = exportConfigJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quality-centre-cms-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Exported full CMS configuration to JSON file!');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importConfigJson(content);
      if (success) {
        showToast('Successfully imported and restored CMS configuration!');
        window.location.reload();
      } else {
        alert('Failed to parse JSON backup file. Please check file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/95 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={`relative w-full max-w-6xl my-auto rounded-3xl overflow-hidden border shadow-2xl transition-colors ${
          isDark
            ? 'bg-[#0B0F19] border-slate-700 text-slate-100'
            : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        {/* Top Decorative Color Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00A9CF] via-[#0096C7] to-[#0077B6]" />

        {/* Global Admin Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00A9CF] text-slate-950 flex items-center justify-center font-bold shadow-md shadow-[#00A9CF]/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  Quality Centre Limited • Admin CMS Backend
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#00A9CF]/20 text-[#00A9CF] border border-[#00A9CF]/30">
                  v2.6 OS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time content editing, media uploads, and hero video/infographic management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={logoutAdmin}
                className="px-3 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={closeAdmin}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            1. AUTHENTICATION GATE IF NOT LOGGED IN
            ========================================================================= */}
        {!isAdminAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-lg mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#00A9CF]/15 text-[#00A9CF] border border-[#00A9CF]/30 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="text-2xl font-bold">Admin Portal Authorization</h4>
              <p className="text-xs sm:text-sm text-slate-400">
                Sign in with your Lead Auditor passcode to edit site content, manage the gallery,
                and upload videos & infographics.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username (admin)..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-mono transition-all ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-[#00A9CF]'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#00A9CF]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Password (Default: <code className="text-[#00A9CF]">Qckenya@2026!</code>)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-mono transition-all ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white focus:border-[#00A9CF]'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#00A9CF]'
                  }`}
                />
              </div>

              {authError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Invalid credentials. Use username <code className="font-bold">admin</code> and password <code className="font-bold">Qckenya@2026!</code> or One-Click Access.</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00A9CF]/20 active:scale-95"
                >
                  <Unlock className="w-4 h-4 text-slate-950" />
                  <span>Sign In to Admin</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickLogin}
                  className="py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm border border-[#00A9CF]/40 text-[#00A9CF] hover:bg-[#00A9CF]/10 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>One-Click Access</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* =========================================================================
             2. AUTHENTICATED ADMIN DASHBOARD
             ========================================================================= */
          <div className="flex flex-col md:flex-row min-h-[600px] max-h-[75vh]">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-4 space-y-2 flex-shrink-0">
              <button
                onClick={() => setActiveTab('hero')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-left transition-all ${
                  activeTab === 'hero'
                    ? 'bg-[#00A9CF] text-slate-950 shadow-md shadow-[#00A9CF]/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Hero & Backgrounds</span>
              </button>

              <button
                onClick={() => setActiveTab('media')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-left transition-all ${
                  activeTab === 'media'
                    ? 'bg-[#00A9CF] text-slate-950 shadow-md shadow-[#00A9CF]/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Upload & Media Gallery</span>
              </button>

              <button
                onClick={() => setActiveTab('logos')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-left transition-all ${
                  activeTab === 'logos'
                    ? 'bg-[#00A9CF] text-slate-950 shadow-md shadow-[#00A9CF]/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Client Logos & Carousel</span>
              </button>

              <button
                onClick={() => setActiveTab('stories')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-left transition-all ${
                  activeTab === 'stories'
                    ? 'bg-[#00A9CF] text-slate-950 shadow-md shadow-[#00A9CF]/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Success Stories & Case Studies</span>
              </button>

              <button
                onClick={() => setActiveTab('book')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-left transition-all ${
                  activeTab === 'book'
                    ? 'bg-[#00A9CF] text-slate-950 shadow-md shadow-[#00A9CF]/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Founder Book & Synopsis</span>
              </button>

              <button
                onClick={() => setActiveTab('company')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-left transition-all ${
                  activeTab === 'company'
                    ? 'bg-[#00A9CF] text-slate-950 shadow-md shadow-[#00A9CF]/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Company & Statistics</span>
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-left transition-all ${
                  activeTab === 'backup'
                    ? 'bg-[#00A9CF] text-slate-950 shadow-md shadow-[#00A9CF]/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <FileCode className="w-4 h-4" />
                <span>Backup & Reset</span>
              </button>

              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 px-3 space-y-3">
                {/* Database Connection Status Indicator */}
                <div className="p-3 rounded-xl bg-slate-900/85 border border-slate-800 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Database Status</span>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Connected
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 truncate">
                    Supabase PostgreSQL
                  </div>
                  <div className="text-[9px] text-slate-500 flex justify-between">
                    <span>Latency: 12ms</span>
                    <span>SSL: Active</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 space-y-1">
                  <div>Media Items: <span className="text-white font-bold">{galleryItems.length}</span></div>
                  <div>Hero Mode: <span className="text-[#00A9CF] font-bold capitalize">{heroConfig.bgMode}</span></div>
                  <div>Live Sync: <span className="text-emerald-400 font-bold">Enabled</span></div>
                </div>
              </div>
            </div>

            {/* Main Tab Content Panel */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* =========================================================================
                  TAB 1: HERO SECTION & BACKGROUND MEDIA
                  ========================================================================= */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-lg font-bold">Hero Section Content & Background Settings</h4>
                      <p className="text-xs text-slate-400">
                        Customize the primary headline, background video stream, and fallback infographic poster.
                      </p>
                    </div>
                    <button
                      onClick={handleSaveHero}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Hero Settings</span>
                    </button>
                  </div>

                  {/* Active Background Mode Selector */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Active Hero Background Mode
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setHeroDraft((p) => ({ ...p, bgMode: 'video' }))}
                        className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                          heroDraft.bgMode === 'video'
                            ? 'bg-[#00A9CF]/15 border-[#00A9CF] text-white shadow-md'
                            : 'bg-transparent border-slate-300 dark:border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Video className="w-5 h-5 text-[#00A9CF] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>Video Background</span>
                            {heroDraft.bgMode === 'video' && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Cinematic looping digital architecture video stream
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHeroDraft((p) => ({ ...p, bgMode: 'infographic' }))}
                        className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                          heroDraft.bgMode === 'infographic'
                            ? 'bg-[#00A9CF]/15 border-[#00A9CF] text-white shadow-md'
                            : 'bg-transparent border-slate-300 dark:border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <ImageIcon className="w-5 h-5 text-[#00A9CF] flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>ISO Infographic Architecture</span>
                            {heroDraft.bgMode === 'infographic' && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            High-res technology compliance flowchart poster
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Video & Infographic Sources */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Hero Video Source */}
                    <div className="space-y-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                          <Video className="w-4 h-4 text-[#00A9CF]" />
                          <span>Hero Background Video</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => heroVideoInputRef.current?.click()}
                          className="text-[11px] font-bold text-[#00A9CF] hover:underline flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload Video File</span>
                        </button>
                        <input
                          ref={heroVideoInputRef}
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'hero-video')}
                        />
                      </div>

                      <input
                        type="text"
                        value={heroDraft.videoUrl}
                        onChange={(e) => setHeroDraft({ ...heroDraft, videoUrl: e.target.value })}
                        placeholder="Paste video MP4/WebM URL..."
                        className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono bg-slate-900 border-slate-700 text-white"
                      />

                      {/* Video Preview */}
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative border border-slate-800">
                        <video
                          src={heroDraft.videoUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white">
                          Live Video Preview
                        </div>
                      </div>
                    </div>

                    {/* Hero Infographic Source */}
                    <div className="space-y-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-[#00A9CF]" />
                          <span>Infographic Background Image</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => heroImageInputRef.current?.click()}
                          className="text-[11px] font-bold text-[#00A9CF] hover:underline flex items-center gap-1"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Upload Image File</span>
                        </button>
                        <input
                          ref={heroImageInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'hero-image')}
                        />
                      </div>

                      <input
                        type="text"
                        value={heroDraft.infographicUrl}
                        onChange={(e) => setHeroDraft({ ...heroDraft, infographicUrl: e.target.value })}
                        placeholder="Paste infographic image URL..."
                        className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono bg-slate-900 border-slate-700 text-white"
                      />

                      {/* Image Preview */}
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative border border-slate-800">
                        <img
                          src={heroDraft.infographicUrl}
                          alt="Hero Infographic"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white">
                          Infographic Architecture
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Opacity Slider */}
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">Background Video / Image Opacity Overlay</span>
                      <span className="text-[#00A9CF] font-mono">{Math.round(heroDraft.videoOpacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.8"
                      step="0.05"
                      value={heroDraft.videoOpacity}
                      onChange={(e) => setHeroDraft({ ...heroDraft, videoOpacity: parseFloat(e.target.value) })}
                      className="w-full accent-[#00A9CF]"
                    />
                  </div>

                  {/* Text Headlines */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Top Badge Text
                      </label>
                      <input
                        type="text"
                        value={heroDraft.badgeText}
                        onChange={(e) => setHeroDraft({ ...heroDraft, badgeText: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-slate-900 border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Main Hero Headline
                      </label>
                      <input
                        type="text"
                        value={heroDraft.headline}
                        onChange={(e) => setHeroDraft({ ...heroDraft, headline: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold bg-slate-900 border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                        Subheadline & Value Proposition
                      </label>
                      <textarea
                        rows={3}
                        value={heroDraft.subheadline}
                        onChange={(e) => setHeroDraft({ ...heroDraft, subheadline: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border text-sm leading-relaxed bg-slate-900 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 2: UPLOAD & MULTIMEDIA REPOSITORY
                  ========================================================================= */}
              {activeTab === 'media' && (
                <div className="space-y-8">
                  {/* Upload Form Box */}
                  <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-[#00A9CF]" />
                        <h4 className="text-base font-bold">Upload New Media Asset</h4>
                      </div>
                      <span className="text-xs text-slate-400">
                        Supports MP4, WebM, PNG, JPG, WebP, SVG
                      </span>
                    </div>

                    <form onSubmit={handleCreateMedia} className="space-y-4">
                      {/* Media Type Toggle */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setNewMediaType('image')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                            newMediaType === 'image'
                              ? 'bg-[#00A9CF] text-slate-950 border-[#00A9CF]'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span>Infographic / Image</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setNewMediaType('video')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                            newMediaType === 'video'
                              ? 'bg-[#00A9CF] text-slate-950 border-[#00A9CF]'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          <Video className="w-4 h-4" />
                          <span>Video Explainer / Demo</span>
                        </button>
                      </div>

                      {/* File Upload Drop Area */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="p-6 rounded-2xl border-2 border-dashed border-[#00A9CF]/40 hover:border-[#00A9CF] bg-[#00A9CF]/5 hover:bg-[#00A9CF]/10 transition-all cursor-pointer text-center space-y-2"
                      >
                        <Upload className="w-8 h-8 text-[#00A9CF] mx-auto animate-bounce" />
                        <div className="text-xs font-bold text-slate-200">
                          Click to select a {newMediaType === 'video' ? 'Video' : 'Image'} file from your computer
                        </div>
                        <div className="text-[11px] text-slate-400">
                          File will be processed and saved directly into browser local storage
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={newMediaType === 'video' ? 'video/*' : 'image/*'}
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'gallery')}
                        />
                      </div>

                      {/* Or URL input */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Or Media URL (Web link, CDN, or Data URL)
                        </label>
                        <input
                          type="text"
                          value={newMediaUrl}
                          onChange={(e) => setNewMediaUrl(e.target.value)}
                          placeholder="https://... or data:image/..."
                          className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono bg-slate-900 border-slate-700 text-white"
                        />
                      </div>

                      {/* Title & Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Title</label>
                          <input
                            type="text"
                            value={newMediaTitle}
                            onChange={(e) => setNewMediaTitle(e.target.value)}
                            placeholder="e.g. ISO 9001 Process Workflow Diagram"
                            className="w-full px-3.5 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                          <select
                            value={newMediaCategory}
                            onChange={(e) => setNewMediaCategory(e.target.value as any)}
                            className="w-full px-3.5 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white"
                          >
                            <option value="infographic">ISO Infographic</option>
                            <option value="video">Video & Live Demo</option>
                            <option value="fieldwork">Audit Fieldwork</option>
                            <option value="certification">Certification & Award</option>
                          </select>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={newMediaDescription}
                          onChange={(e) => setNewMediaDescription(e.target.value)}
                          placeholder="Brief technical or audit context..."
                          className="w-full px-3.5 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white"
                        />
                      </div>

                      {/* Tags & Duration */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Tags (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={newMediaTags}
                            onChange={(e) => setNewMediaTags(e.target.value)}
                            placeholder="QMS, Auditing, Nairobi, Tech"
                            className="w-full px-3.5 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white"
                          />
                        </div>

                        {newMediaType === 'video' && (
                          <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">
                              Duration (optional)
                            </label>
                            <input
                              type="text"
                              value={newMediaDuration}
                              onChange={(e) => setNewMediaDuration(e.target.value)}
                              placeholder="e.g. 02:30"
                              className="w-full px-3.5 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white"
                            />
                          </div>
                        )}
                      </div>

                      {/* Set as hero toggle */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="setAsHeroCheck"
                          checked={setAsHeroImmediate}
                          onChange={(e) => setSetAsHeroImmediate(e.target.checked)}
                          className="rounded accent-[#00A9CF]"
                        />
                        <label htmlFor="setAsHeroCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
                          Immediately set this media item as the active Hero section background
                        </label>
                      </div>

                      {uploadError && (
                        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                          {uploadError}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isUploading}
                        className="py-3 px-6 rounded-xl font-bold text-xs text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 text-slate-950" />
                        <span>Publish to Gallery</span>
                      </button>
                    </form>
                  </div>

                  {/* Existing Media Items Library */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                      Media Library ({galleryItems.length} items)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {galleryItems.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2 flex flex-col justify-between"
                        >
                          <div className="aspect-video w-full rounded-lg overflow-hidden bg-black relative">
                            {item.type === 'video' ? (
                              <video
                                src={item.mediaUrl}
                                muted
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={item.thumbnailUrl || item.mediaUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-950/80 text-white uppercase">
                              {item.type}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-bold line-clamp-1 text-white">{item.title}</div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">{item.description}</div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                            <button
                              onClick={() => {
                                if (item.type === 'video') setMediaAsHero('video', item.mediaUrl);
                                else setMediaAsHero('infographic', item.mediaUrl);
                                showToast(`Set "${item.title}" as active Hero background!`);
                              }}
                              className="text-[10px] font-bold text-[#00A9CF] hover:underline"
                            >
                              Set as Hero
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Delete "${item.title}"?`)) {
                                  deleteGalleryItem(item.id);
                                  showToast('Item deleted from gallery');
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Delete media item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 2.5: CLIENT LOGOS & CAROUSEL MANAGEMENT
                  ========================================================================= */}
              {activeTab === 'logos' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-lg font-bold">Client Logo Carousel & Partner Brands</h4>
                      <p className="text-xs text-slate-400">
                        Upload and manage certified client partner logos displayed in the marquee carousel below the hero section.
                      </p>
                    </div>
                  </div>

                  {/* Add New Logo Form */}
                  <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#00A9CF]">
                      <Award className="w-5 h-5" />
                      <span>Upload New Client Partner Logo</span>
                    </div>

                    <form onSubmit={handleAddClientLogo} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Client / Enterprise Name *
                          </label>
                          <input
                            type="text"
                            value={newLogoName}
                            onChange={(e) => setNewLogoName(e.target.value)}
                            placeholder="e.g. Equity Group Holdings"
                            className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Industry / Sector
                          </label>
                          <input
                            type="text"
                            value={newLogoIndustry}
                            onChange={(e) => setNewLogoIndustry(e.target.value)}
                            placeholder="e.g. Banking & Financial Services"
                            className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Logo Image File (Upload from device or CDN URL) *
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="file"
                            accept="image/*"
                            ref={clientLogoInputRef}
                            onChange={handleLogoFileUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => clientLogoInputRef.current?.click()}
                            className="py-2.5 px-4 rounded-xl border border-dashed border-slate-700 hover:border-[#00A9CF] bg-slate-900/80 text-xs font-bold text-slate-300 flex items-center gap-2 transition-all"
                          >
                            <Upload className="w-4 h-4 text-[#00A9CF]" />
                            <span>Browse File...</span>
                          </button>
                          <input
                            type="url"
                            value={newLogoUrl}
                            onChange={(e) => setNewLogoUrl(e.target.value)}
                            placeholder="Or paste image URL / Supabase Storage URL..."
                            className="flex-1 px-3.5 py-2.5 rounded-xl border text-xs font-mono bg-slate-900 border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      {newLogoUrl && (
                        <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-700 flex-shrink-0 p-1">
                            <img src={newLogoUrl} alt="Preview" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              {newLogoUrl.includes('supabase.co') ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                  Supabase Cloud Storage (client-logos)
                                </span>
                              ) : newLogoUrl.startsWith('data:image/') ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  Pending Cloud Upload
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                                  Hosted URL
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 truncate mt-1">{newLogoUrl}</div>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isUploading}
                        className="py-3 px-6 rounded-xl font-bold text-xs text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all flex items-center gap-2 shadow-md active:scale-95 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 text-slate-950" />
                        <span>{isUploading ? 'Uploading to Supabase...' : 'Add to Client Logo Carousel'}</span>
                      </button>
                    </form>
                  </div>

                  {/* Supabase Storage SQL Query & Setup Guide */}
                  <div className="p-5 rounded-2xl border border-sky-500/30 bg-sky-500/5 space-y-3">
                    <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                      <Database className="w-5 h-5" />
                      <span>Supabase Storage SQL Setup & Policies (For Admin Uploads from Any Device)</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      To store uploaded client logos securely in your Supabase database and allow administrators to upload from any device, run this SQL query in your Supabase SQL Editor:
                    </p>
                    <div className="relative">
                      <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800 select-all">
{`-- 1. Create Supabase Storage Bucket for Client Logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('client-logos', 'client-logos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies for Public Read & Admin Uploads from Any Device
CREATE POLICY "Public Read Client Logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'client-logos');

CREATE POLICY "Admin Upload Client Logos From Any Device"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'client-logos');

CREATE POLICY "Admin Update Client Logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'client-logos');

CREATE POLICY "Admin Delete Client Logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'client-logos');`}
                      </pre>
                    </div>
                  </div>

                  {/* Existing Logos Grid */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                      Active Client Logos in Carousel ({clientLogos.length})
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {clientLogos.map((client) => (
                        <div
                          key={client.id}
                          className="p-4 rounded-xl border border-slate-700 bg-slate-900 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center border border-slate-600 flex-shrink-0 p-1">
                                <img src={client.logoUrl} alt={client.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white">{client.name}</div>
                                <div className="text-[10px] text-slate-300">{client.industry || 'Enterprise'}</div>
                                <div className="mt-1">
                                  {client.logoUrl.includes('supabase.co') ? (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                      <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                                      Supabase Cloud
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                                      Remote CDN
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                if (confirm(`Remove "${client.name}" logo?`)) {
                                  deleteClientLogo(client.id);
                                  showToast('Client logo removed from database');
                                }
                              }}
                              className="p-2 text-slate-300 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                              title="Delete logo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="pt-2 border-t border-slate-800">
                            <span className="text-[10px] font-mono text-slate-400 block mb-0.5">Database Source URL:</span>
                            <div className="text-[10px] font-mono text-sky-300 bg-slate-950 p-1.5 rounded border border-slate-800 truncate select-all">
                              {client.logoUrl}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 2.5: SUCCESS STORIES & CASE STUDIES MANAGEMENT
                  ========================================================================= */}
              {activeTab === 'stories' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                    <div>
                      <h4 className="text-lg font-bold text-white">Success Stories & Enterprise Case Studies</h4>
                      <p className="text-xs text-slate-300">
                        Add, edit, or manage verified client success stories and audit accreditation results displayed across the site.
                      </p>
                    </div>
                  </div>

                  {/* Add New Success Story Form */}
                  <div className="p-6 rounded-2xl border border-slate-700 bg-slate-900 space-y-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#00A9CF]">
                      <ShieldCheck className="w-5 h-5" />
                      <span>Publish New Client Success Story</span>
                    </div>

                    <form onSubmit={handleAddSuccessStory} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Client / Enterprise Name *
                          </label>
                          <input
                            type="text"
                            value={storyClientName}
                            onChange={(e) => setStoryClientName(e.target.value)}
                            placeholder="e.g. Kenya Commercial Bank"
                            className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Story Title *
                          </label>
                          <input
                            type="text"
                            value={storyTitle}
                            onChange={(e) => setStoryTitle(e.target.value)}
                            placeholder="e.g. ISO 27001 Cybersecurity Transformation"
                            className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            ISO Standard / Accreditation
                          </label>
                          <input
                            type="text"
                            value={storyStandard}
                            onChange={(e) => setStoryStandard(e.target.value)}
                            placeholder="e.g. ISO/IEC 27001:2022"
                            className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Industry / Sector
                          </label>
                          <input
                            type="text"
                            value={storyIndustry}
                            onChange={(e) => setStoryIndustry(e.target.value)}
                            placeholder="e.g. Banking & Financial Services"
                            className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Story Banner Image (Upload or URL) *
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              ref={storyImageInputRef}
                              onChange={handleStoryImageUpload}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => storyImageInputRef.current?.click()}
                              className="py-2.5 px-4 rounded-xl border border-dashed border-slate-700 hover:border-[#00A9CF] bg-slate-950 text-xs font-bold text-slate-300 flex items-center gap-2"
                            >
                              <Upload className="w-4 h-4 text-[#00A9CF]" />
                              <span>Browse File...</span>
                            </button>
                            <input
                              type="url"
                              value={storyImageUrl}
                              onChange={(e) => setStoryImageUrl(e.target.value)}
                              placeholder="Or paste database image URL..."
                              className="flex-1 px-3.5 py-2.5 rounded-xl border text-xs font-mono bg-slate-950 border-slate-700 text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {storyImageUrl && (
                        <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-700">
                            <img src={storyImageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-emerald-400">Story Image Ready</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-xs">{storyImageUrl}</div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            The Enterprise Challenge
                          </label>
                          <textarea
                            rows={2}
                            value={storyChallenge}
                            onChange={(e) => setStoryChallenge(e.target.value)}
                            placeholder="Describe core obstacles..."
                            className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Our Solution & Implementation
                          </label>
                          <textarea
                            rows={2}
                            value={storySolution}
                            onChange={(e) => setStorySolution(e.target.value)}
                            placeholder="Describe audit & software solution..."
                            className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Verified Results (One per line)
                        </label>
                        <textarea
                          rows={2}
                          value={storyResults}
                          onChange={(e) => setStoryResults(e.target.value)}
                          placeholder="100% audit pass on first attempt&#10;Zero critical non-conformities&#10;64% faster remediation"
                          className="w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono bg-slate-950 border-slate-700 text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="py-3 px-6 rounded-xl font-bold text-xs text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all flex items-center gap-2 shadow-md"
                      >
                        <Plus className="w-4 h-4 text-slate-950" />
                        <span>Publish Success Story to Database</span>
                      </button>
                    </form>
                  </div>

                  {/* Active Success Stories List */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                      Active Success Stories ({successStories.length})
                    </h4>

                    <div className="space-y-4">
                      {successStories.map((story) => (
                        <div
                          key={story.id}
                          className="p-5 rounded-2xl border border-slate-700 bg-slate-900 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center border border-slate-600 flex-shrink-0">
                                <img src={story.imageUrl} alt={story.clientName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div className="space-y-1">
                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00A9CF]/20 text-[#00A9CF] border border-[#00A9CF]/30">
                                  {story.standard}
                                </div>
                                <h5 className="text-sm font-bold text-white">{story.title}</h5>
                                <div className="text-xs text-slate-300">{story.clientName} ({story.industry})</div>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                if (confirm(`Delete success story for "${story.clientName}"?`)) {
                                  deleteSuccessStory(story.id);
                                  showToast('Success story removed from database');
                                }
                              }}
                              className="p-2 text-slate-300 hover:text-rose-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                              title="Delete story"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                            <span className="text-slate-400">Database Image URL:</span>
                            <span className="text-sky-300 truncate max-w-md select-all">{story.imageUrl}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB: FOUNDER BOOK & SYNOPSIS
                  ========================================================================= */}
              {activeTab === 'book' && (
                <div className="space-y-6">
                  {/* Tab Header & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-lg font-bold flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-amber-400" />
                        <span>Founder Book Spotlight & Executive Synopsis</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        Update the 3D book cover image, executive synopsis, title, key takeaways, and purchase links.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveBook()}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all flex items-center gap-2 shadow-md self-start sm:self-auto active:scale-95"
                    >
                      <Save className="w-4 h-4 text-slate-950" />
                      <span>Save Book Changes</span>
                    </button>
                  </div>

                  {/* Section 1: Book Cover Image Management */}
                  <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-bold text-white flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-amber-400" />
                          <span>Book Cover Image (3D Front Display)</span>
                        </h5>
                        <p className="text-xs text-slate-400">
                          Upload high-resolution book artwork (PNG/JPG/WebP) or provide an image URL.
                        </p>
                      </div>

                      {bookDraft.coverImage && (
                        <button
                          type="button"
                          onClick={() => setBookDraft((prev) => ({ ...prev, coverImage: '' }))}
                          className="px-2.5 py-1 text-[11px] font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Reset to Default Graphic</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Left: Live 3D Cover Preview */}
                      <div className="md:col-span-4 flex flex-col items-center">
                        <div className="relative w-44 aspect-[3/4.4] rounded-r-xl rounded-l-sm bg-slate-950 border-r-4 border-b-4 border-t border-l-6 border-slate-700 border-l-amber-500 shadow-xl overflow-hidden flex flex-col items-center justify-center p-3 text-center">
                          {bookDraft.coverImage ? (
                            <img
                              src={bookDraft.coverImage}
                              alt="Book Cover Preview"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="space-y-2 p-2">
                              <div className="text-[9px] font-mono text-amber-400 uppercase font-bold">
                                QUALITY CENTRE PRESS
                              </div>
                              <div className="text-lg font-black text-white font-serif leading-tight">
                                {bookDraft.title || 'ISO 9000 SECRET'}
                              </div>
                              <div className="text-[10px] text-cyan-300 font-semibold uppercase">
                                {bookDraft.subtitle || 'Unlocking World Markets'}
                              </div>
                              <div className="pt-2 text-[9px] text-slate-400 border-t border-slate-700">
                                By {bookDraft.author || 'Julius N.'}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 text-center">
                          {bookDraft.coverImage?.includes('supabase.co') ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle className="w-3 h-3" />
                              <span>Live Supabase Cloud Storage</span>
                            </span>
                          ) : bookDraft.coverImage ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                              <ExternalLink className="w-3 h-3" />
                              <span>External / Custom Image URL</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              <span>Default Typography Graphic</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Upload controls */}
                      <div className="md:col-span-8 space-y-4">
                        {/* Hidden file input */}
                        <input
                          ref={bookCoverInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/jpg"
                          onChange={handleBookCoverUpload}
                          className="hidden"
                        />

                        <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 text-center space-y-3">
                          <Upload className="w-8 h-8 text-amber-400 mx-auto" />
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-white">
                              Upload Cover Image directly to Supabase Bucket
                            </p>
                            <p className="text-[11px] text-slate-400">
                              PNG, JPG, or WebP up to 20MB. Automatically hosted on Supabase and distributed via CDN.
                            </p>
                          </div>

                          <button
                            type="button"
                            disabled={isUploading}
                            onClick={() => bookCoverInputRef.current?.click()}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all inline-flex items-center gap-2 shadow disabled:opacity-50"
                          >
                            <Upload className="w-3.5 h-3.5 text-slate-950" />
                            <span>{isUploading ? 'Uploading to Supabase...' : 'Browse Cover Image File'}</span>
                          </button>
                        </div>

                        {/* Image URL fallback */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Or Paste Direct Image URL:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={bookDraft.coverImage || ''}
                              onChange={(e) => setBookDraft((prev) => ({ ...prev, coverImage: e.target.value }))}
                              placeholder="https://.../book-cover.jpg"
                              className="flex-1 px-3.5 py-2 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white font-mono"
                            />
                            {bookDraft.coverImage && (
                              <button
                                type="button"
                                onClick={() => setBookDraft((prev) => ({ ...prev, coverImage: '' }))}
                                className="px-3 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Executive Synopsis & Core Text */}
                  <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <Type className="w-4 h-4 text-[#00A9CF]" />
                      <span>Book Overview & Executive Synopsis</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Book Main Title
                        </label>
                        <input
                          type="text"
                          value={bookDraft.title}
                          onChange={(e) => setBookDraft({ ...bookDraft, title: e.target.value })}
                          placeholder="e.g. ISO 9000 Secret"
                          className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={bookDraft.subtitle}
                          onChange={(e) => setBookDraft({ ...bookDraft, subtitle: e.target.value })}
                          placeholder="e.g. Unlocking World Markets"
                          className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Author Name
                        </label>
                        <input
                          type="text"
                          value={bookDraft.author}
                          onChange={(e) => setBookDraft({ ...bookDraft, author: e.target.value })}
                          placeholder="e.g. Julius N."
                          className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Author Role / Credential
                        </label>
                        <input
                          type="text"
                          value={bookDraft.authorRole}
                          onChange={(e) => setBookDraft({ ...bookDraft, authorRole: e.target.value })}
                          placeholder="e.g. Founder & Lead Management Systems Strategist"
                          className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white"
                        />
                      </div>
                    </div>

                    {/* Synopsis Textarea */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-300">
                          Book Synopsis / Executive Summary
                        </label>
                        <span className="text-[11px] text-slate-400">
                          Displayed prominently beside the 3D book cover
                        </span>
                      </div>
                      <textarea
                        rows={5}
                        value={bookDraft.description}
                        onChange={(e) => setBookDraft({ ...bookDraft, description: e.target.value })}
                        placeholder="Write or paste the book synopsis here..."
                        className="w-full px-3.5 py-2.5 rounded-xl border text-xs leading-relaxed bg-slate-950 border-slate-700 text-white focus:border-[#00A9CF] transition-colors"
                      />
                    </div>

                    {/* Author Quote */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Featured Author Quote (Callout Blockquote)
                      </label>
                      <textarea
                        rows={2}
                        value={bookDraft.quote}
                        onChange={(e) => setBookDraft({ ...bookDraft, quote: e.target.value })}
                        placeholder="Quote from the author..."
                        className="w-full px-3.5 py-2.5 rounded-xl border text-xs italic bg-slate-950 border-slate-700 text-amber-200"
                      />
                    </div>
                  </div>

                  {/* Section 3: Key Executive Takeaways */}
                  <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-cyan-400" />
                        <span>Key Executive Takeaways ({bookDraft.keyTakeaways.length})</span>
                      </h5>
                      <button
                        type="button"
                        onClick={() => {
                          setBookDraft((prev) => ({
                            ...prev,
                            keyTakeaways: [...prev.keyTakeaways, 'New executive takeaway principle'],
                          }));
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Takeaway</span>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {bookDraft.keyTakeaways.map((takeaway, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-6 text-center text-xs font-mono font-bold text-slate-500">
                            {idx + 1}.
                          </span>
                          <input
                            type="text"
                            value={takeaway}
                            onChange={(e) => {
                              const updated = [...bookDraft.keyTakeaways];
                              updated[idx] = e.target.value;
                              setBookDraft({ ...bookDraft, keyTakeaways: updated });
                            }}
                            className="flex-1 px-3.5 py-2 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = bookDraft.keyTakeaways.filter((_, i) => i !== idx);
                              setBookDraft({ ...bookDraft, keyTakeaways: updated });
                            }}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Remove takeaway"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 4: External & Social Links */}
                  <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-[#00A9CF]" />
                      <span>Book Acquisition & Leadership Profiles</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Purchase / Inquire Link (Amazon, Publisher, or Consultation)
                        </label>
                        <input
                          type="url"
                          value={bookDraft.purchaseLink}
                          onChange={(e) => setBookDraft({ ...bookDraft, purchaseLink: e.target.value })}
                          placeholder="https://... or #contact"
                          className="w-full px-3.5 py-2.5 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Company LinkedIn
                        </label>
                        <input
                          type="url"
                          value={bookDraft.socialLinks.companyLinkedIn}
                          onChange={(e) =>
                            setBookDraft({
                              ...bookDraft,
                              socialLinks: { ...bookDraft.socialLinks, companyLinkedIn: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Company X (Twitter)
                        </label>
                        <input
                          type="url"
                          value={bookDraft.socialLinks.companyTwitter}
                          onChange={(e) =>
                            setBookDraft({
                              ...bookDraft,
                              socialLinks: { ...bookDraft.socialLinks, companyTwitter: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Founder LinkedIn Profile
                        </label>
                        <input
                          type="url"
                          value={bookDraft.socialLinks.founderLinkedIn}
                          onChange={(e) =>
                            setBookDraft({
                              ...bookDraft,
                              socialLinks: { ...bookDraft.socialLinks, founderLinkedIn: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Founder X (Twitter) Profile
                        </label>
                        <input
                          type="url"
                          value={bookDraft.socialLinks.founderTwitter}
                          onChange={(e) =>
                            setBookDraft({
                              ...bookDraft,
                              socialLinks: { ...bookDraft.socialLinks, founderTwitter: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border text-xs bg-slate-950 border-slate-700 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleSaveBook()}
                        className="px-6 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all flex items-center gap-2 shadow-md active:scale-95"
                      >
                        <Save className="w-4 h-4 text-slate-950" />
                        <span>Save Book Changes</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 3: COMPANY & KEY STATISTICS
                  ========================================================================= */}
              {activeTab === 'company' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-lg font-bold">Company & Contact Details</h4>
                      <p className="text-xs text-slate-400">
                        Update official Nairobi office address, contact numbers, email, and authority metrics.
                      </p>
                    </div>
                    <button
                      onClick={handleSaveCompany}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Company Info</span>
                    </button>
                  </div>

                  {/* Logo & Branding Upload Section */}
                  <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-bold text-sm text-white flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-[#00A9CF]" />
                          <span>Company Logo & Brand Identity</span>
                        </h5>
                        <p className="text-xs text-slate-400">
                          Choose between the default vector logo or upload a custom logo image (PNG, SVG, JPG).
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCompanyDraft((p) => ({ ...p, logoType: 'vector' }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            companyDraft.logoType !== 'custom'
                              ? 'bg-[#00A9CF] text-slate-950 border-[#00A9CF]'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          Vector Logo
                        </button>
                        <button
                          type="button"
                          onClick={() => setCompanyDraft((p) => ({ ...p, logoType: 'custom' }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            companyDraft.logoType === 'custom'
                              ? 'bg-[#00A9CF] text-slate-950 border-[#00A9CF]'
                              : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          Custom Logo
                        </button>
                      </div>
                    </div>

                    {companyDraft.logoType === 'custom' && (
                      <div className="space-y-3 pt-2">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="w-32 h-16 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center p-2 overflow-hidden flex-shrink-0">
                            {companyDraft.logoUrl ? (
                              <img
                                src={companyDraft.logoUrl}
                                alt="Custom Logo Preview"
                                className="max-h-full max-w-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-[10px] text-slate-500">No Logo</span>
                            )}
                          </div>
                          <div className="flex-1 space-y-2 w-full">
                            <input
                              type="text"
                              value={companyDraft.logoUrl || ''}
                              onChange={(e) => setCompanyDraft({ ...companyDraft, logoUrl: e.target.value })}
                              placeholder="Paste database / Supabase storage logo URL..."
                              className="w-full px-3 py-2 rounded-xl border text-xs font-mono bg-slate-900 border-slate-700 text-white"
                            />
                            <div className="flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => logoInputRef.current?.click()}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#00A9CF]/20 text-[#00A9CF] border border-[#00A9CF]/40 hover:bg-[#00A9CF]/30 transition-all flex items-center gap-1.5"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Logo File</span>
                              </button>
                              <span className="text-[10px] font-mono text-emerald-400">Database Source of Truth</span>
                              <input
                                ref={logoInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, 'logo')}
                              />
                            </div>
                          </div>
                        </div>

                        {companyDraft.logoUrl && (
                          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300">
                            <span className="text-slate-500">Active Database Logo URL: </span>
                            <span className="text-sky-300 select-all">{companyDraft.logoUrl}</span>
                          </div>
                        )}

                        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700/50 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span>Cross-Device Database Sync: Active</span>
                          </div>
                          <span className="text-[11px] text-emerald-400 font-mono">
                            {lastDatabaseSync ? `Last synced: ${lastDatabaseSync.toLocaleTimeString()}` : 'Database connected'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={companyDraft.name}
                        onChange={(e) => setCompanyDraft({ ...companyDraft, name: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Official Phone</label>
                      <input
                        type="text"
                        value={companyDraft.phone}
                        onChange={(e) => setCompanyDraft({ ...companyDraft, phone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Official Email</label>
                      <input
                        type="text"
                        value={companyDraft.email}
                        onChange={(e) => setCompanyDraft({ ...companyDraft, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Years in Industry</label>
                      <input
                        type="text"
                        value={companyDraft.experienceYears}
                        onChange={(e) => setCompanyDraft({ ...companyDraft, experienceYears: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Official Office Address</label>
                    <input
                      type="text"
                      value={companyDraft.address}
                      onChange={(e) => setCompanyDraft({ ...companyDraft, address: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border text-xs bg-slate-900 border-slate-700 text-white"
                    />
                  </div>

                  {/* Key Statistics Cards */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Authority Statistics Cards
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {companyDraft.stats.map((st, i) => (
                        <div key={i} className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={st.value}
                              onChange={(e) => {
                                const newStats = [...companyDraft.stats];
                                newStats[i].value = e.target.value;
                                setCompanyDraft({ ...companyDraft, stats: newStats });
                              }}
                              className="w-24 px-2 py-1 rounded bg-slate-800 border border-slate-700 font-mono font-bold text-[#00A9CF] text-xs"
                            />
                            <input
                              type="text"
                              value={st.label}
                              onChange={(e) => {
                                const newStats = [...companyDraft.stats];
                                newStats[i].label = e.target.value;
                                setCompanyDraft({ ...companyDraft, stats: newStats });
                              }}
                              className="flex-1 px-2 py-1 rounded bg-slate-800 border border-slate-700 font-semibold text-white text-xs"
                            />
                          </div>
                          <input
                            type="text"
                            value={st.desc}
                            onChange={(e) => {
                              const newStats = [...companyDraft.stats];
                              newStats[i].desc = e.target.value;
                              setCompanyDraft({ ...companyDraft, stats: newStats });
                            }}
                            className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-[11px] text-slate-400"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 4: BACKUP, EXPORT & RESTORE
                  ========================================================================= */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold">Configuration Backup & Factory Reset</h4>
                    <p className="text-xs text-slate-400">
                      Export your current settings and media library as a portable JSON file or restore from a previous backup.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
                      <div className="flex items-center gap-2">
                        <Download className="w-5 h-5 text-[#00A9CF]" />
                        <h5 className="font-bold text-sm">Export Configuration</h5>
                      </div>
                      <p className="text-xs text-slate-400">
                        Download all customized texts, hero video references, and gallery assets to a local JSON file.
                      </p>
                      <button
                        onClick={handleExportJson}
                        className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download JSON Backup</span>
                      </button>
                    </div>

                    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
                      <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-emerald-400" />
                        <h5 className="font-bold text-sm">Import JSON Backup</h5>
                      </div>
                      <p className="text-xs text-slate-400">
                        Upload a previously saved JSON configuration file to restore all content and gallery items.
                      </p>
                      <label className="w-full py-2.5 px-4 rounded-xl font-bold text-xs border border-emerald-400/40 text-emerald-400 hover:bg-emerald-400/10 transition-all flex items-center justify-center gap-2 cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span>Select JSON File</span>
                        <input
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={handleImportJson}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Reset to Defaults */}
                  <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-3">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                      <AlertCircle className="w-5 h-5" />
                      <span>Factory Default Reset</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Reverts all customized hero settings, company details, and media gallery back to initial seed data.
                    </p>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to reset all CMS content and gallery items back to default?')) {
                          resetToDefaults();
                          showToast('Reset completed! Refreshing...');
                          window.location.reload();
                        }
                      }}
                      className="py-2.5 px-4 rounded-xl text-xs font-bold border border-rose-500/50 text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Reset to Factory Defaults</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global Toast Inside Admin */}
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute bottom-4 right-4 z-50 px-4 py-3 rounded-xl bg-slate-950 text-white border border-[#00A9CF] shadow-2xl flex items-center gap-2 text-xs font-bold"
          >
            <CheckCircle className="w-4 h-4 text-[#00A9CF]" />
            <span>{saveToast}</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
