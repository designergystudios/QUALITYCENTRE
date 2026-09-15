import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Zap,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { AfroPattern } from './AfroPattern';

interface VideoExplainerProps {
  onOpenConsultation: (topic?: string) => void;
}

interface Chapter {
  id: number;
  time: number; // in seconds
  timestamp: string;
  title: string;
  summary: string;
  keyMetric: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    time: 0,
    timestamp: '00:00',
    title: 'The ISO Dilemma in East Africa',
    summary: 'Why traditional binder-based ISO compliance leads to audit panic, lost records, and operational fatigue.',
    keyMetric: '85% of firms experience pre-audit rush',
  },
  {
    id: 2,
    time: 45,
    timestamp: '00:45',
    title: 'The Quality Centre Digital OS',
    summary: 'Bridging international standards (ISO 9001, 27001, ESG) with SoftExpert software and official PECB certification frameworks.',
    keyMetric: '60% faster SOP deployment',
  },
  {
    id: 3,
    time: 90,
    timestamp: '01:30',
    title: 'Automated Real-Time Evidence',
    summary: 'Automating Clauses 4 through 10 with digital CAPA tracking, risk matrices, and cryptographic sign-offs.',
    keyMetric: 'Zero misplaced audit records',
  },
  {
    id: 4,
    time: 135,
    timestamp: '02:15',
    title: 'Guaranteed Pass & Continuous ESG',
    summary: 'Empowering African enterprises to win international tenders and achieve sustainable ESG investor readiness.',
    keyMetric: '99.4% first-time audit pass rate',
  },
];

export const VideoExplainer: React.FC<VideoExplainerProps> = ({ onOpenConsultation }) => {
  const { isDark } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes simulated default
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'takeaways' | 'transcript' | 'stack'>('takeaways');
  const [showControls, setShowControls] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reliable primary video source (abstract digital network / tech workflow animation)
  const videoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-graphs-and-data-31913-large.mp4';
  const fallbackVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    // Sync active chapter
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (time >= CHAPTERS[i].time) {
        setActiveChapterIndex(i);
        break;
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setDuration(videoRef.current.duration);
    }
  };

  const jumpToChapter = (chapterTime: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = chapterTime;
    setCurrentTime(chapterTime);
    if (!isPlaying) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const cycleSpeed = () => {
    if (!videoRef.current) return;
    const speeds = [1, 1.25, 1.5, 2];
    const nextIndex = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    videoRef.current.playbackRate = nextSpeed;
    setPlaybackSpeed(nextSpeed);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShareVideo = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '#video-explainer');
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <section
      id="video-explainer"
      className={`relative py-24 overflow-hidden border-t transition-colors duration-300 ${
        isDark
          ? 'bg-[#0A0E17] border-slate-800/80'
          : 'bg-slate-50 border-slate-200'
      }`}
    >
      <div id="explainer" className="absolute -top-24 left-0" />
      {/* Afro Geometric Decorative Background Pattern */}
      <AfroPattern
        variant="diamonds"
        opacity={isDark ? 0.08 : 0.05}
        className="inset-0 pointer-events-none"
      />

      <div
        className={`absolute top-1/3 left-10 w-96 h-96 rounded-full blur-[140px] pointer-events-none ${
          isDark ? 'bg-cyan-500/10' : 'bg-cyan-400/15'
        }`}
      />
      <div
        className={`absolute bottom-10 right-10 w-96 h-96 rounded-full blur-[140px] pointer-events-none ${
          isDark ? 'bg-[#00A9CF]/10' : 'bg-[#00A9CF]/15'
        }`}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              isDark
                ? 'bg-[#00A9CF]/10 border-[#00A9CF]/30 text-[#00A9CF]'
                : 'bg-cyan-100 border-cyan-300 text-[#0077B6]'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>EXECUTIVE VIDEO EXPLAINER • 3-MINUTE STRATEGIC OVERVIEW</span>
          </div>

          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            How We Modernize ISO & GRC into a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A9CF] via-[#0096C7] to-[#0077B6]">
              Digital Operating System
            </span>
          </h2>

          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Watch how Kenyan and African enterprises eliminate audit panic, automate continuous
            compliance, and achieve guaranteed international certification with Quality Centre Limited.
          </p>
        </div>

        {/* Video Player & Interactive Chapters Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left / Main: Video Player Chassis */}
          <div className="lg:col-span-8 space-y-4">
            <div
              ref={containerRef}
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(isPlaying ? false : true)}
              className={`relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border transition-all ${
                isDark
                  ? 'bg-slate-950 border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
                  : 'bg-white border-slate-200 shadow-xl shadow-slate-200/80'
              }`}
            >
              {/* Aspect Ratio Container for 16:9 Video */}
              <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center">
                
                {/* HTML5 Video Element */}
                <video
                  ref={videoRef}
                  src={videoUrl}
                  loop
                  muted={isMuted}
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onClick={togglePlay}
                  className="w-full h-full object-cover cursor-pointer"
                >
                  <source src={fallbackVideoUrl} type="video/mp4" />
                  Your browser does not support HTML5 video.
                </video>

                {/* Big Center Play Button Overlay when Paused */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#00A9CF] p-0.5 shadow-2xl group transition-transform transform hover:scale-110 active:scale-95 flex items-center justify-center"
                    aria-label="Play executive explainer video"
                  >
                    <div className="w-full h-full rounded-full bg-slate-900/90 flex items-center justify-center backdrop-blur-md">
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1 group-hover:text-[#00A9CF] group-hover:fill-[#00A9CF] transition-colors" />
                    </div>
                  </button>
                )}

                {/* Live Chapter Title Pill in Top Left of Video */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-white text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Ch. {CHAPTERS[activeChapterIndex].id}: {CHAPTERS[activeChapterIndex].title}</span>
                </div>

                {/* Quality Centre Watermark / Brand Badge */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/70 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00A9CF]" />
                  <span>QC LIMITED OS</span>
                </div>

                {/* Bottom Custom Video Controls Bar */}
                <div
                  className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {/* Scrubber Progress Bar */}
                  <div className="relative mb-3 flex items-center group">
                    <input
                      type="range"
                      min={0}
                      max={duration || 180}
                      step={0.1}
                      value={currentTime}
                      onChange={handleScrubberChange}
                      className="w-full h-1.5 sm:h-2 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                    />
                  </div>

                  {/* Controls Row */}
                  <div className="flex items-center justify-between text-white text-xs">
                    {/* Left: Play/Pause, Replay, Time Display */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <button
                        onClick={togglePlay}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
                        aria-label={isPlaying ? 'Pause video' : 'Play video'}
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 fill-white" />
                        ) : (
                          <Play className="w-4 h-4 fill-white" />
                        )}
                      </button>

                      <button
                        onClick={() => jumpToChapter(0)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="Restart from beginning"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>

                      <div className="font-mono text-xs text-slate-300">
                        <span className="text-white font-bold">{formatTime(currentTime)}</span> / {formatTime(duration)}
                      </div>
                    </div>

                    {/* Right: Speed, Mute, Share, Fullscreen */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Playback Speed Pill */}
                      <button
                        onClick={cycleSpeed}
                        className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] font-mono font-bold text-cyan-300 transition-colors"
                        title="Change playback speed"
                      >
                        {playbackSpeed}x
                      </button>

                      {/* Mute Toggle */}
                      <button
                        onClick={toggleMute}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-cyan-400" />
                        )}
                      </button>

                      {/* Share Video Link */}
                      <button
                        onClick={handleShareVideo}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="Copy link to video"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Fullscreen */}
                      <button
                        onClick={toggleFullscreen}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="Fullscreen"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Video Footer Strip: Current Chapter Highlight */}
              <div
                className={`p-4 sm:p-5 border-t transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100/90 border-slate-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-500 uppercase">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Now Playing ({CHAPTERS[activeChapterIndex].timestamp}):</span>
                  </div>
                  <div
                    className={`text-sm sm:text-base font-bold transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {CHAPTERS[activeChapterIndex].title}
                  </div>
                  <p
                    className={`text-xs max-w-xl transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {CHAPTERS[activeChapterIndex].summary}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border ${
                      isDark
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{CHAPTERS[activeChapterIndex].keyMetric}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Share Confirmation Alert */}
            {copiedLink && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-xs text-cyan-400 text-center"
              >
                ✓ Video link copied to clipboard! Share with your executive board or audit committee.
              </motion.div>
            )}

            {/* Interactive Chapter Grid */}
            <div className="space-y-2">
              <div
                className={`text-xs font-mono uppercase tracking-wider font-bold transition-colors ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Jump to Strategic Chapter:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CHAPTERS.map((ch, idx) => {
                  const isCurrent = activeChapterIndex === idx;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => jumpToChapter(ch.time)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                        isCurrent
                          ? isDark
                            ? 'bg-cyan-500/15 border-cyan-400/60 text-white shadow-md shadow-cyan-500/20'
                            : 'bg-cyan-50 border-cyan-400 text-slate-900 shadow-md shadow-cyan-200/50'
                          : isDark
                          ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/60'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`px-2 py-1 rounded-lg text-xs font-mono font-bold flex-shrink-0 ${
                          isCurrent
                            ? 'bg-cyan-500 text-slate-950'
                            : isDark
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {ch.timestamp}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-xs font-bold truncate">{ch.title}</div>
                        <div
                          className={`text-[11px] truncate ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          {ch.keyMetric}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Executive Takeaways, Transcript & Demo CTA */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Tabbed Executive Dossier */}
            <div
              className={`rounded-2xl p-5 border transition-all ${
                isDark
                  ? 'bg-[#0F172A] border-slate-800'
                  : 'bg-white border-slate-200 shadow-lg shadow-slate-200/60'
              }`}
            >
              {/* Tab Navigation */}
              <div className="flex border-b pb-3 mb-4 gap-1">
                {[
                  { id: 'takeaways', label: 'Key Takeaways', icon: Zap },
                  { id: 'transcript', label: 'Transcript', icon: FileText },
                  { id: 'stack', label: 'Tech Stack', icon: Cpu },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500 to-[#0096C7] text-white shadow-sm'
                          : isDark
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Takeaways */}
              {activeTab === 'takeaways' && (
                <div className="space-y-4">
                  <div
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      isDark ? 'text-amber-400' : 'text-amber-600'
                    }`}
                  >
                    Executive Briefing Points:
                  </div>

                  <div className="space-y-3">
                    <div
                      className={`p-3 rounded-xl border space-y-1 ${
                        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-cyan-500">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>90-Day Digital Deployment</span>
                      </div>
                      <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        Replaces 12-month manual consulting cycles with pre-configured SoftExpert workflows tailored to Kenya regulations.
                      </p>
                    </div>

                    <div
                      className={`p-3 rounded-xl border space-y-1 ${
                        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-500">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>40% Admin Time Reclaimed</span>
                      </div>
                      <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        PECB accredited auditor frameworks and SoftExpert automation eliminate paper binders, physical signatures, and manual CAPA escalation delays.
                      </p>
                    </div>

                    <div
                      className={`p-3 rounded-xl border space-y-1 ${
                        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>100% Cryptographic Audit Trail</span>
                      </div>
                      <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        Third-party certification bodies (KEBS, SGS, BSI) log into your dedicated audit cockpit with verified timestamped evidence.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Transcript */}
              {activeTab === 'transcript' && (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs">
                  <div className={`p-2.5 rounded-lg ${isDark ? 'bg-slate-900/80' : 'bg-slate-100'}`}>
                    <span className="font-mono font-bold text-cyan-500">[00:00]</span>{' '}
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      "In East Africa, over 80% of companies still manage ISO through static paper binders and detached spreadsheets. When audit day comes, teams panic."
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-lg ${isDark ? 'bg-slate-900/80' : 'bg-slate-100'}`}>
                    <span className="font-mono font-bold text-cyan-500">[00:45]</span>{' '}
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      "Quality Centre Limited shifts compliance into an everyday Digital Operating System. We unite ISO 9001, ISO 27001, ESG, and GRC directly into your business processes."
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-lg ${isDark ? 'bg-slate-900/80' : 'bg-slate-100'}`}>
                    <span className="font-mono font-bold text-cyan-500">[01:30]</span>{' '}
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      "Through our PECB partnership and SoftExpert platforms, non-conformities automatically trigger root-cause analysis. Evidence compiles in real time according to accredited standards."
                    </span>
                  </div>

                  <div className={`p-2.5 rounded-lg ${isDark ? 'bg-slate-900/80' : 'bg-slate-100'}`}>
                    <span className="font-mono font-bold text-cyan-500">[02:15]</span>{' '}
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                      "The result? 99.4% first-time audit pass rate and operations that qualify for the most demanding international export markets."
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 3: Tech Stack */}
              {activeTab === 'stack' && (
                <div className="space-y-3 text-xs">
                  <div
                    className={`p-3 rounded-xl border space-y-1.5 ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-cyan-400 flex items-center justify-between">
                      <span>SoftExpert EQM / GRC</span>
                      <span className="text-[10px] font-mono text-slate-400">Enterprise Engine</span>
                    </div>
                    <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                      Document control, CAPA workflows, calibration logs, and unified regulatory compliance framework.
                    </p>
                  </div>

                  <div
                    className={`p-3 rounded-xl border space-y-1.5 ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-amber-500 flex items-center justify-between">
                      <span>PECB Authorized Partner</span>
                      <span className="text-[10px] font-mono text-slate-400">Official Agreement</span>
                    </div>
                    <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                      Accredited training courses, internationally recognized lead auditor certifications (ISO 9001, 27001, 14001, 45001), and global examination services.
                    </p>
                  </div>

                  <div
                    className={`p-3 rounded-xl border space-y-1.5 ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-emerald-400 flex items-center justify-between">
                      <span>QC Advisory Methodology</span>
                      <span className="text-[10px] font-mono text-slate-400">26+ Yrs Nairobi HQ</span>
                    </div>
                    <p className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                      Lead auditor advisory, Kenya DPA and NEMA regulatory alignment, and hands-on staff enablement.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Strategic Call to Action Box */}
            <div className="p-0.5 rounded-2xl bg-gradient-to-r from-[#00A9CF] to-[#0077B6] shadow-xl">
              <div
                className={`p-5 rounded-[15px] space-y-3.5 transition-colors ${
                  isDark ? 'bg-slate-950' : 'bg-white'
                }`}
              >
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-[#00A9CF] uppercase">
                    Ready to Transform?
                  </div>
                  <h4
                    className={`text-base font-extrabold tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Book a Tailored Platform Walkthrough
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    See how your organization's specific ISO and GRC requirements run in real time inside our software sandbox.
                  </p>
                </div>

                <button
                  id="explainer-book-demo-btn"
                  onClick={() => onOpenConsultation('Executive Platform Demonstration')}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>Request Live System Demo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
