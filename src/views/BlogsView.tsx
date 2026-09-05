import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUpRight, Search, Clock, Calendar, User, Tag, Share2, Check, BookOpen, ChevronRight } from 'lucide-react';
import { blogsData, BlogPost } from '../data/blogs';
import { materialsData } from '../data/materials';
import { structuresData } from '../data/structures';
import { ViewRoute } from '../types';

interface BlogsViewProps {
  initialArticleSlug?: string;
  onNavigate: (route: ViewRoute) => void;
  onOpenQuote: () => void;
}

export const BlogsView: React.FC<BlogsViewProps> = ({
  initialArticleSlug,
  onNavigate,
  onOpenQuote,
}) => {
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(initialArticleSlug);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSelectedSlug(initialArticleSlug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialArticleSlug]);

  const activeArticle = selectedSlug
    ? blogsData.find((b) => b.slug === selectedSlug)
    : undefined;

  const categories = ['ALL', 'FACADES & CLADDING', 'OUTDOOR STRUCTURES', 'SMART PARKING', 'SUSTAINABLE MATERIALS'];

  const filteredBlogs = blogsData.filter((blog) => {
    const matchesCategory = selectedCategory === 'ALL' || blog.category === selectedCategory;
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.seoKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="blogs-view" className="text-[#F7F5F0] pt-28 pb-32 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {activeArticle ? (
          /* SINGLE BLOG ARTICLE READER */
          <div className="space-y-12 animate-fadeIn max-w-4xl mx-auto">
            {/* Back Navigation */}
            <div className="flex items-center justify-between border-b border-[#D1C7B7]/20 pb-4">
              <button
                onClick={() => setSelectedSlug(undefined)}
                className="hover:text-[#F7F5F0] text-[#D1C7B7] flex items-center gap-2 text-xs font-mono uppercase tracking-wider cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Articles & Insights
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D1C7B7]/20 bg-[#141311] text-xs font-mono text-[#D1C7B7] hover:border-[#D1C7B7] transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied' : 'Share Article'}</span>
              </button>
            </div>

            {/* Header Meta */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D1C7B7]/30 bg-[#141311] text-[10px] font-mono tracking-[0.25em] text-[#D1C7B7] uppercase">
                <Tag className="w-3 h-3 text-[#C5A880]" />
                {activeArticle.category}
              </div>

              <h1 className="font-serif-title text-4xl sm:text-5xl md:text-6xl text-[#F7F5F0] leading-tight">
                {activeArticle.title}
              </h1>

              <p className="text-lg md:text-xl font-sans-clean text-[#D1C7B7]/85 font-light leading-relaxed">
                {activeArticle.subtitle}
              </p>

              {/* Author & Published Info */}
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#D1C7B7]/15 text-xs font-sans-clean text-[#8C8273]">
                <div className="flex items-center gap-3">
                  <img
                    src={activeArticle.author.avatar}
                    alt={activeArticle.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#D1C7B7]/30"
                  />
                  <div>
                    <div className="font-semibold text-[#F7F5F0]">{activeArticle.author.name}</div>
                    <div className="text-[11px] font-mono">{activeArticle.author.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-mono text-[11px] border-l border-[#D1C7B7]/15 pl-6">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{activeArticle.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{activeArticle.readTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-[#D1C7B7]/20 bg-black/40 shadow-2xl">
              <img
                src={activeArticle.heroImage}
                alt={activeArticle.title}
                className="w-full h-full object-cover opacity-90"
              />
            </div>

            {/* Article Content Stream */}
            <div className="space-y-8 text-base md:text-lg font-sans-clean text-[#D1C7B7]/90 leading-relaxed font-light">
              {activeArticle.content.map((sec, idx) => {
                if (sec.type === 'paragraph') {
                  return <p key={idx}>{sec.text}</p>;
                }
                if (sec.type === 'heading') {
                  return (
                    <h2 key={idx} className="font-serif-title text-3xl md:text-4xl text-[#F7F5F0] pt-6 border-b border-[#D1C7B7]/20 pb-3">
                      {sec.text}
                    </h2>
                  );
                }
                if (sec.type === 'subheading') {
                  return (
                    <h3 key={idx} className="font-serif-title text-2xl text-[#F7F5F0] pt-4">
                      {sec.text}
                    </h3>
                  );
                }
                if (sec.type === 'bullet_list' && sec.items) {
                  return (
                    <ul key={idx} className="space-y-3 pl-2 my-4">
                      {sec.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm md:text-base">
                          <span className="w-2 h-2 rounded-full bg-[#C5A880] mt-2 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (sec.type === 'key_takeaway') {
                  return (
                    <div
                      key={idx}
                      className="p-6 rounded-xl border border-[#C5A880]/40 bg-[#C5A880]/10 my-6 space-y-2 text-sm md:text-base"
                    >
                      <div className="font-mono text-xs text-[#C5A880] uppercase tracking-widest font-semibold flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> TECHNICAL SPECIFICATION HIGHLIGHT
                      </div>
                      <p className="text-[#F7F5F0] font-normal leading-relaxed">{sec.text}</p>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Related Materials / Structures Navigation Links */}
            {((activeArticle.relatedMaterials && activeArticle.relatedMaterials.length > 0) ||
              (activeArticle.relatedStructures && activeArticle.relatedStructures.length > 0)) && (
              <div className="pt-10 border-t border-[#D1C7B7]/20 space-y-6">
                <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-mono font-semibold block">
                  EXPLORE SPECIFIED MATERIALS & STRUCTURES
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeArticle.relatedMaterials?.map((mSlug) => {
                    const mat = materialsData.find((m) => m.slug === mSlug);
                    if (!mat) return null;
                    return (
                      <div
                        key={mat.id}
                        onClick={() => onNavigate({ type: 'materials', materialSlug: mat.slug })}
                        className="p-5 rounded-xl border border-[#D1C7B7]/20 bg-[#141311] flex items-center justify-between group cursor-pointer hover:border-[#D1C7B7]/60 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img src={mat.heroImage} alt={mat.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <span className="text-[10px] font-mono text-[#8C8273] uppercase">{mat.category}</span>
                            <div className="font-serif-title text-xl text-[#F7F5F0] group-hover:text-[#D1C7B7]">{mat.name}</div>
                          </div>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-[#D1C7B7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    );
                  })}

                  {activeArticle.relatedStructures?.map((stSlug) => {
                    const st = structuresData.find((s) => s.slug === stSlug);
                    if (!st) return null;
                    return (
                      <div
                        key={st.id}
                        onClick={() => onNavigate({ type: 'structures', structureSlug: st.slug })}
                        className="p-5 rounded-xl border border-[#D1C7B7]/20 bg-[#141311] flex items-center justify-between group cursor-pointer hover:border-[#D1C7B7]/60 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img src={st.heroImage} alt={st.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <span className="text-[10px] font-mono text-[#8C8273] uppercase">{st.type}</span>
                            <div className="font-serif-title text-xl text-[#F7F5F0] group-hover:text-[#D1C7B7]">{st.name}</div>
                          </div>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-[#D1C7B7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Project Lead CTA Box */}
            <div className="p-8 md:p-10 rounded-2xl border border-[#D1C7B7]/30 bg-gradient-to-br from-[#141311] via-[#1A1815] to-[#0D0C0A] space-y-6 text-center shadow-2xl">
              <h3 className="font-serif-title text-3xl md:text-4xl text-[#F7F5F0]">
                Planning an Architectural Project?
              </h3>
              <p className="text-sm md:text-base font-sans-clean text-[#D1C7B7]/85 max-w-xl mx-auto font-light">
                Consult with Archzona structural engineers and material specialists for custom CAD specifications, BOQ estimation, and samples.
              </p>
              <button
                onClick={onOpenQuote}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#F7F5F0] text-[#0D0C0A] font-bold text-xs uppercase tracking-[0.2em] font-sans-clean hover:bg-[#D1C7B7] transition-colors cursor-pointer shadow-lg"
              >
                <span>REQUEST ARCHITECTURAL CONSULTATION</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* BLOGS INDEX & SEARCH */
          <div className="space-y-12 animate-fadeIn">
            {/* Header Banner */}
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D1C7B7]/30 bg-[#141311] text-[10px] uppercase font-mono tracking-[0.25em] text-[#D1C7B7]">
                <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                ARCHZONA ARCHITECTURAL INSIGHTS
              </div>
              <h1 className="font-serif-title text-5xl sm:text-7xl text-[#F7F5F0]">
                MATERIAL & STRUCTURAL INTELLIGENCE
              </h1>
              <p className="text-base sm:text-lg font-sans-clean text-[#D1C7B7]/85 leading-relaxed font-light">
                Technical guides, comparative material studies, smart parking spatial engineering, and architectural innovations curated for developers, architects, and structural consultants.
              </p>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="space-y-6 pt-4 border-t border-[#D1C7B7]/20">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                {/* Search Box */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#8C8273] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics: Tensile, Smart Parking, WPC, HPL..."
                    className="w-full pl-11 pr-4 py-3 bg-[#141311] rounded-xl border border-[#D1C7B7]/20 text-xs font-sans-clean text-[#F7F5F0] placeholder-[#8C8273] focus:outline-none focus:border-[#D1C7B7]"
                  />
                </div>

                {/* Categories */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-[10px] font-mono tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#F7F5F0] text-[#0D0C0A] font-bold'
                          : 'bg-[#141311] border border-[#D1C7B7]/20 text-[#D1C7B7] hover:border-[#D1C7B7]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Blog Grid */}
            {filteredBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((blog) => (
                  <article
                    key={blog.id}
                    onClick={() => setSelectedSlug(blog.slug)}
                    className="bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 p-6 flex flex-col justify-between group cursor-pointer hover:border-[#D1C7B7]/60 transition-all shadow-lg hover:-translate-y-1"
                  >
                    <div className="space-y-5">
                      <div className="aspect-[16/10] overflow-hidden rounded-xl bg-black/40 border border-[#D1C7B7]/15 relative">
                        <img
                          src={blog.heroImage}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full border border-black/40 bg-[#0D0C0A]/80 backdrop-blur-md text-[9px] font-mono text-[#D1C7B7] uppercase tracking-wider">
                          {blog.category}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-[11px] font-mono text-[#8C8273]">
                          <span>{blog.date}</span>
                          <span>•</span>
                          <span>{blog.readTime}</span>
                        </div>

                        <h3 className="font-serif-title text-2xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors leading-snug">
                          {blog.title}
                        </h3>

                        <p className="text-xs font-sans-clean text-[#8C8273] line-clamp-3 leading-relaxed">
                          {blog.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-[#D1C7B7]/15 flex items-center justify-between text-xs font-mono text-[#D1C7B7]">
                      <span>Read Technical Article</span>
                      <ArrowUpRight className="w-4 h-4 text-[#D1C7B7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center border border-[#D1C7B7]/20 rounded-2xl bg-[#141311] space-y-3">
                <h4 className="font-serif-title text-2xl text-[#F7F5F0]">No Articles Match Your Search</h4>
                <p className="text-xs font-sans-clean text-[#8C8273]">Try searching for WPC, HPL, Tensile, or Smart Parking.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                  }}
                  className="px-4 py-2 bg-[#F7F5F0] text-[#0D0C0A] font-bold text-xs rounded-full font-mono uppercase"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
