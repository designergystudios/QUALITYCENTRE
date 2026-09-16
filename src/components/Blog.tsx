import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Tag,
  ChevronRight,
  X,
  Share2,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Award,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCms, BlogPostItem } from '../context/CmsContext';

interface BlogProps {
  onOpenConsultation: (topic?: string) => void;
}

export const Blog: React.FC<BlogProps> = ({ onOpenConsultation }) => {
  const { isDark } = useTheme();
  const { blogPosts } = useCms();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<BlogPostItem | null>(null);

  const categories = [
    'All',
    'ISO Standards',
    'Cybersecurity',
    'Audit Best Practices',
    'ESG & Sustainability',
  ];

  const filteredPosts = (blogPosts || []).filter((post) => {
    const matchesCategory =
      selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = (blogPosts || []).find((p) => p.isFeatured) || blogPosts?.[0];

  return (
    <section
      id="blog"
      className={`relative py-24 overflow-hidden border-t transition-colors duration-300 ${
        isDark ? 'bg-[#0B0F19] border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}
    >
      {/* Background Subtle Accent Gradients */}
      <div
        className={`absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none ${
          isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/15'
        }`}
      />
      <div
        className={`absolute bottom-1/3 right-1/4 w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none ${
          isDark ? 'bg-amber-500/10' : 'bg-amber-500/10'
        }`}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              isDark
                ? 'bg-cyan-500/10 border-cyan-500/25 text-[#00A9CF]'
                : 'bg-cyan-50 border-cyan-300 text-cyan-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00A9CF]" />
            <span>KNOWLEDGE CENTRE & INDUSTRY INSIGHTS</span>
          </div>
          
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight transition-colors ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Management Systems & ISO{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A9CF] via-cyan-400 to-amber-400">
              Thought Leadership
            </span>
          </h2>
          
          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            Expert breakdowns, implementation guides, ISO standard updates, and digital GRC insights curated by Quality Centre’s lead auditors and advisory team.
          </p>
        </div>

        {/* Filter Bar & Search Input */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start w-full md:w-auto">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#00A9CF] text-slate-950 shadow-md shadow-[#00A9CF]/20'
                      : isDark
                      ? 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles & topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#00A9CF]/50 ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 text-white placeholder-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
              }`}
            />
          </div>
        </div>

        {/* Featured Article Banner (Show if no search query active) */}
        {!searchQuery && selectedCategory === 'All' && featuredPost && (
          <div
            onClick={() => setSelectedPost(featuredPost)}
            className={`group cursor-pointer rounded-3xl border overflow-hidden shadow-2xl transition-all duration-300 hover:border-[#00A9CF]/50 grid grid-cols-1 lg:grid-cols-12 ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            {/* Featured Image */}
            <div className="lg:col-span-6 relative h-64 lg:h-auto overflow-hidden bg-slate-950">
              <img
                src={featuredPost.imageUrl}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 shadow">
                  ★ Featured Insight
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#00A9CF] text-slate-950 shadow">
                  {featuredPost.category}
                </span>
              </div>
            </div>

            {/* Featured Content Details */}
            <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#00A9CF]" />
                    <span>{featuredPost.publishedDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#00A9CF]" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>

                <h3
                  className={`text-2xl sm:text-3xl font-extrabold leading-snug group-hover:text-[#00A9CF] transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {featuredPost.title}
                </h3>

                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {featuredPost.excerpt}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap pt-2">
                  {featuredPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold ${
                        isDark
                          ? 'bg-slate-800/80 text-cyan-300 border border-slate-700'
                          : 'bg-slate-100 text-cyan-800 border border-slate-200'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Footer & Action */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={featuredPost.author.avatarUrl}
                    alt={featuredPost.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#00A9CF]"
                  />
                  <div>
                    <h5
                      className={`text-xs font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {featuredPost.author.name}
                    </h5>
                    <p className="text-[10px] text-slate-400">{featuredPost.author.role}</p>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00A9CF] text-slate-950 group-hover:bg-[#0096C7] transition-all flex items-center gap-1.5 shadow">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className={`group cursor-pointer rounded-3xl border overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-[#00A9CF]/40 flex flex-col justify-between ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 hover:bg-slate-900'
                  : 'bg-white border-slate-200 hover:bg-slate-50/50'
              }`}
            >
              <div>
                {/* Thumbnail Image */}
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#00A9CF] text-slate-950 shadow">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#00A9CF]" />
                      {post.publishedDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#00A9CF]" />
                      {post.readTime}
                    </span>
                  </div>

                  <h4
                    className={`text-lg font-bold leading-snug group-hover:text-[#00A9CF] transition-colors ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {post.title}
                  </h4>

                  <p
                    className={`text-xs leading-relaxed line-clamp-3 ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0 border-t border-slate-800/50 flex items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#00A9CF]/50"
                  />
                  <span
                    className={`text-[11px] font-semibold truncate max-w-[120px] ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {post.author.name}
                  </span>
                </div>

                <span className="text-xs font-bold text-[#00A9CF] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Read</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
            <h4 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              No articles found matching "{searchQuery}"
            </h4>
            <p className="text-xs text-slate-400">
              Try adjusting your category filter or search keywords.
            </p>
          </div>
        )}

        {/* Full Article Reader Modal Dialog */}
        <AnimatePresence>
          {selectedPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                {/* Modal Header Bar */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00A9CF] text-slate-950">
                      {selectedPost.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                      {selectedPost.readTime}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Article Scrollable Body */}
                <div className="p-6 sm:p-10 overflow-y-auto space-y-8 flex-1">
                  {/* Article Banner & Header */}
                  <div className="space-y-4">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                      {selectedPost.title}
                    </h2>

                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={selectedPost.author.avatarUrl}
                          alt={selectedPost.author.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#00A9CF]"
                        />
                        <div>
                          <span className="font-bold text-white block">{selectedPost.author.name}</span>
                          <span className="text-[10px] text-slate-400">{selectedPost.author.role}</span>
                        </div>
                      </div>
                      <span className="text-slate-600">•</span>
                      <span>Published: {selectedPost.publishedDate}</span>
                    </div>

                    <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mt-4 border border-slate-800">
                      <img
                        src={selectedPost.imageUrl}
                        alt={selectedPost.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Key Takeaways Highlight Box */}
                  <div className={`p-5 sm:p-6 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-cyan-50/60 border-cyan-200'
                  }`}>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-[#00A9CF] flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#00A9CF]" />
                      Executive Abstract & Key Takeaways
                    </h5>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      {selectedPost.excerpt}
                    </p>
                  </div>

                  {/* Full Article Content Text */}
                  <div className={`space-y-4 text-sm sm:text-base leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {selectedPost.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  {/* Article Tags */}
                  <div className="pt-6 border-t border-slate-800 flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-[#00A9CF]" />
                    {selectedPost.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-[#00A9CF]/15 text-[#00A9CF] border border-[#00A9CF]/30"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Call to Action Footer inside Modal */}
                  <div className={`p-6 sm:p-8 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-6 ${
                    isDark ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-slate-800' : 'bg-slate-900 text-white border-slate-800'
                  }`}>
                    <div className="space-y-1 text-center sm:text-left">
                      <h4 className="text-lg font-bold text-white">Need Customized ISO Advisory?</h4>
                      <p className="text-xs text-slate-300 max-w-md">
                        Our lead auditors provide tailored GAP analysis, internal audits, and SoftExpert digital QMS implementation.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPost(null);
                        onOpenConsultation(`Article Inquiry: ${selectedPost.title}`);
                      }}
                      className="px-6 py-3 rounded-xl font-extrabold text-xs text-slate-950 bg-[#00A9CF] hover:bg-[#0096C7] transition-all shadow-lg shadow-[#00A9CF]/30 flex-shrink-0 flex items-center gap-2"
                    >
                      <span>Book Consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
