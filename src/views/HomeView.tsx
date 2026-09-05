import React from 'react';
import { ArrowUpRight, ArrowDown, ChevronRight, Layers, Sparkles, Building2, Box, ShieldCheck, Download } from 'lucide-react';
import { spacesData } from '../data/spaces';
import { materialsData } from '../data/materials';
import { structuresData } from '../data/structures';
import { projectsData } from '../data/projects';
import { partnersData } from '../data/partners';
import { ViewRoute } from '../types';

interface HomeViewProps {
  onNavigate: (route: ViewRoute) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const featuredProject = projectsData[0]; // The Poolside Villa

  return (
    <div id="home-view" className="bg-transparent text-[#F7F5F0] overflow-hidden">
      {/* SECTION 01 — BENTO HERO GRID */}
      <section
        id="hero-bento-section"
        className="pt-28 pb-16 px-6 md:px-10 max-w-7xl mx-auto"
      >
        {/* 12-Column Master Bento Grid (Row 1 & Row 2) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* BENTO BLOCK 1: Hero Statement (Span 5 cols, 2 rows) */}
          <div
            id="bento-hero-statement"
            onClick={() => onNavigate({ type: 'explore' })}
            className="md:col-span-5 relative rounded-2xl overflow-hidden min-h-[480px] lg:min-h-[540px] p-8 md:p-10 flex flex-col justify-between group cursor-pointer border border-[#D1C7B7]/20 shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
              alt="Archzona Materials Structures Spaces"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0A] via-[#0D0C0A]/60 to-[#0D0C0A]/40" />

            <div className="relative z-10">
              <span className="inline-block text-[10px] font-mono uppercase tracking-[0.25em] text-[#D1C7B7] px-3 py-1 rounded-full border border-[#D1C7B7]/30 bg-[#0D0C0A]/60 backdrop-blur-sm">
                EXPERIENCE CENTRE
              </span>
            </div>

            <div className="relative z-10 space-y-6">
              <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl text-[#F7F5F0] leading-[1.05] tracking-tight">
                MATERIALS.<br />
                STRUCTURES.<br />
                SPACES.
              </h1>

              <p className="text-xs sm:text-sm font-sans-clean text-[#D1C7B7]/90 max-w-sm leading-relaxed font-light">
                Architectural materials and outdoor structures curated for contemporary spaces.
              </p>

              <div>
                <button
                  id="hero-bento-explore-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate({ type: 'explore' });
                  }}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans-clean px-6 py-3 rounded-full border border-[#D1C7B7] text-[#F7F5F0] bg-[#0D0C0A]/70 hover:bg-[#F7F5F0] hover:text-[#0D0C0A] transition-all cursor-pointer"
                >
                  <span>EXPLORE SPACES</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* BENTO BLOCK 2: Spaces Center Hub (Span 4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-5">
            {/* Top Card: START WITH A SPACE (Dark Bento Block #141311) */}
            <div
              id="bento-start-space"
              onClick={() => onNavigate({ type: 'explore' })}
              className="p-7 rounded-2xl bg-[#141311] border border-[#D1C7B7]/20 flex flex-col justify-between group cursor-pointer hover:border-[#D1C7B7]/50 transition-all flex-1 min-h-[170px]"
            >
              <div>
                <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#8C8273] block mb-1">
                  DISCOVER ARCHETYPES
                </span>
                <h3 className="font-serif-title text-2xl sm:text-3xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors">
                  START WITH A SPACE.
                </h3>
                <p className="text-xs font-sans-clean text-[#8C8273] mt-2 font-light">
                  Explore environments, suitable finishes and possibilities.
                </p>
              </div>
              <div className="pt-4 flex justify-end">
                <span className="w-8 h-8 rounded-full border border-[#D1C7B7]/30 flex items-center justify-center text-[#D1C7B7] group-hover:bg-[#F7F5F0] group-hover:text-[#0D0C0A] transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Middle Card: POOLSIDE (Image Bento Block) */}
            <div
              id="bento-poolside-card"
              onClick={() => onNavigate({ type: 'explore', spaceSlug: 'poolside' })}
              className="relative h-[160px] rounded-2xl overflow-hidden group cursor-pointer border border-[#D1C7B7]/15"
            >
              <img
                src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=900&auto=format&fit=crop"
                alt="Poolside environment"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0A]/90 via-[#0D0C0A]/30 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-[#F7F5F0]">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#D1C7B7] block">
                    ARCHETYPE // 01
                  </span>
                  <span className="font-serif-title text-xl text-[#F7F5F0]">POOLSIDE</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#D1C7B7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Bottom Card: VILLA (Image Bento Block) */}
            <div
              id="bento-villa-card"
              onClick={() => onNavigate({ type: 'explore', spaceSlug: 'villas' })}
              className="relative h-[160px] rounded-2xl overflow-hidden group cursor-pointer border border-[#D1C7B7]/15"
            >
              <img
                src="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=900&auto=format&fit=crop"
                alt="Villa environment"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0A]/90 via-[#0D0C0A]/30 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-[#F7F5F0]">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#D1C7B7] block">
                    ARCHETYPE // 02
                  </span>
                  <span className="font-serif-title text-xl text-[#F7F5F0]">VILLA</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#D1C7B7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* BENTO BLOCK 3: Warm Cream Material Universe (Span 3 cols, Vertical) */}
          <div
            id="bento-material-universe"
            onClick={() => onNavigate({ type: 'materials' })}
            className="md:col-span-3 rounded-2xl bg-[#EFEAE2] text-[#0D0C0A] p-7 flex flex-col justify-between group cursor-pointer border border-[#D1C7B7] shadow-lg"
          >
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#8C8273] font-bold block">
                TACTILE ARCHIVE
              </span>
              <h3 className="font-serif-title text-3xl sm:text-4xl text-[#0D0C0A] leading-tight">
                OUR<br />
                MATERIAL<br />
                UNIVERSE.
              </h3>
              <p className="text-xs font-sans-clean text-[#8C8273] font-normal leading-relaxed">
                Discover materials crafted for weathering performance and spatial beauty.
              </p>
            </div>

            {/* Vertical Stack of 4 Tactile Swatches */}
            <div className="grid grid-cols-2 gap-2 my-6">
              <div className="aspect-square rounded-lg overflow-hidden border border-[#D1C7B7]/60">
                <img
                  src="https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?q=80&w=400&auto=format&fit=crop"
                  alt="Timber Texture"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden border border-[#D1C7B7]/60">
                <img
                  src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=400&auto=format&fit=crop"
                  alt="WPC Decking Detail"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden border border-[#D1C7B7]/60">
                <img
                  src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=400&auto=format&fit=crop"
                  alt="Terrazzo Texture"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden border border-[#D1C7B7]/60">
                <img
                  src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=400&auto=format&fit=crop"
                  alt="Mineral Surface"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#D1C7B7]/50 text-xs font-mono text-[#0D0C0A]">
              <span className="tracking-wider uppercase font-semibold">VIEW ARCHIVE</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* SECOND ROW BENTO COMPOSITION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-5">
          {/* BENTO BLOCK 4: STRUCTURES THAT DEFINE OUTDOOR LIVING (Span 6 cols) */}
          <div
            id="bento-structures-block"
            onClick={() => onNavigate({ type: 'structures' })}
            className="md:col-span-6 rounded-2xl bg-[#EFEAE2] text-[#0D0C0A] p-7 md:p-8 flex flex-col md:flex-row gap-6 items-center justify-between group cursor-pointer border border-[#D1C7B7] shadow-lg"
          >
            <div className="space-y-3 max-w-xs">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#8C8273] font-bold block">
                ENGINEERED FRAMEWORKS
              </span>
              <h3 className="font-serif-title text-2xl sm:text-3xl text-[#0D0C0A] leading-tight">
                STRUCTURES THAT DEFINE OUTDOOR LIVING.
              </h3>
              <p className="text-xs font-sans-clean text-[#8C8273] font-normal leading-relaxed">
                Gazebos, pergolas, tensile fabric canopies and modular extensions.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#0D0C0A] group-hover:underline">
                  EXPLORE STRUCTURES <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div className="w-full md:w-48 h-40 rounded-xl overflow-hidden border border-[#D1C7B7] shrink-0">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=700&auto=format&fit=crop"
                alt="Outdoor living structure"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* BENTO BLOCK 5: ONE PARTNER (Span 3 cols, Dark #141311) */}
          <div
            id="bento-turnkey-block"
            onClick={() => onNavigate({ type: 'services' })}
            className="md:col-span-3 rounded-2xl bg-[#141311] text-[#F7F5F0] p-7 flex flex-col justify-between group cursor-pointer border border-[#D1C7B7]/20 hover:border-[#D1C7B7]/50 transition-all shadow-md"
          >
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#8C8273] block">
                TURNKEY SCOPE
              </span>
              <h3 className="font-serif-title text-2xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors leading-snug">
                ONE PARTNER.<br />
                FROM MATERIAL<br />
                TO SPACE.
              </h3>
              <p className="text-xs font-sans-clean text-[#8C8273] font-light leading-relaxed">
                Consult. Curate. Engineer. Source. Fabricate. Install.
              </p>
            </div>
            <div className="pt-6 flex justify-end">
              <span className="w-8 h-8 rounded-full border border-[#D1C7B7]/30 flex items-center justify-center text-[#D1C7B7] group-hover:bg-[#F7F5F0] group-hover:text-[#0D0C0A] transition-all">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* BENTO BLOCK 6: FEATURED PROJECT (Span 3 cols, Cream #EFEAE2) */}
          <div
            id="bento-featured-project-card"
            onClick={() => onNavigate({ type: 'project-story', projectSlug: featuredProject.slug })}
            className="md:col-span-3 rounded-2xl bg-[#EFEAE2] text-[#0D0C0A] p-6 flex flex-col justify-between group cursor-pointer border border-[#D1C7B7] shadow-lg"
          >
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#8C8273] font-bold block">
                CASE STUDY
              </span>
              <h4 className="font-serif-title text-xl text-[#0D0C0A] leading-snug">
                FEATURED PROJECT
              </h4>
              <p className="text-[11px] font-sans-clean text-[#8C8273] line-clamp-2">
                The Poolside Villa — a seamless blend of natural materials and structures.
              </p>
            </div>

            <div className="my-3 h-24 rounded-lg overflow-hidden border border-[#D1C7B7]">
              <img
                src={featuredProject.heroImage}
                alt={featuredProject.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-[#0D0C0A] pt-1">
              <span className="font-semibold text-[11px]">SEE CASE STUDY</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02 — SPACE EXPLORER (Section 13) */}
      <section id="space-explorer-section" className="py-24 md:py-32 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-semibold block">
              01 // DISCOVER A SPACE
            </span>
            <h2 className="font-serif-title text-4xl sm:text-6xl text-[#F7F5F0]">
              START WITH A SPACE.
            </h2>
            <p className="text-sm md:text-base font-sans-clean text-[#D1C7B7]/80 max-w-xl leading-relaxed font-light">
              Explore how materials and structures come together in real environments.
              Select an archetype to see suitable applications, integrated materials, and turnkey structures.
            </p>
          </div>
          <button
            id="view-all-spaces-link-btn"
            onClick={() => onNavigate({ type: 'explore' })}
            className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold border-b border-[#D1C7B7]/50 pb-1 hover:text-[#F7F5F0] hover:border-[#F7F5F0] transition-colors cursor-pointer self-start md:self-end flex items-center gap-2"
          >
            <span>VIEW ALL SPACES</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Asymmetrical Editorial Composition in Brand Palette */}
        <div className="space-y-6">
          {/* Row 1: Large Resort (12 cols) */}
          {(() => {
            const resort = spacesData.find((s) => s.slug === 'resorts') || spacesData[0];
            return (
              <div
                id={`space-tile-${resort.slug}`}
                onClick={() => onNavigate({ type: 'explore', spaceSlug: resort.slug })}
                className="group relative h-[380px] sm:h-[460px] rounded-2xl overflow-hidden cursor-pointer bg-[#141311] border border-[#D1C7B7]/20"
              >
                <img
                  src={resort.heroImage}
                  alt={resort.name}
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0A] via-[#0D0C0A]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-[#F7F5F0]">
                  <div className="space-y-2 max-w-xl">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#D1C7B7] font-mono font-bold block">
                      ARCHITECTURAL ENVIRONMENT // 01
                    </span>
                    <h3 className="font-serif-title text-4xl sm:text-5xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors">
                      {resort.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-sans-clean text-[#D1C7B7]/80 line-clamp-2 font-light">
                      {resort.tagline}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 font-sans-clean text-xs uppercase tracking-wider text-[#F7F5F0] shrink-0">
                    <span className="text-[#D1C7B7] font-mono">EXPLORE SPACE</span>
                    <span className="w-10 h-10 rounded-full border border-[#D1C7B7]/40 bg-[#0D0C0A]/80 flex items-center justify-center group-hover:bg-[#F7F5F0] group-hover:text-[#0D0C0A] transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Row 2: 5/7 Split (Poolside + Villa) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Poolside (5 cols) */}
            {(() => {
              const poolside = spacesData.find((s) => s.slug === 'poolside') || spacesData[0];
              return (
                <div
                  id={`space-tile-${poolside.slug}`}
                  onClick={() => onNavigate({ type: 'explore', spaceSlug: poolside.slug })}
                  className="md:col-span-5 group relative h-[380px] sm:h-[460px] rounded-2xl overflow-hidden cursor-pointer bg-[#141311] border border-[#D1C7B7]/20"
                >
                  <img
                    src={poolside.heroImage}
                    alt={poolside.name}
                    className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0A] via-[#0D0C0A]/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-[#F7F5F0] space-y-2">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#D1C7B7] font-mono font-bold block">
                      ARCHITECTURAL ENVIRONMENT // 02
                    </span>
                    <h3 className="font-serif-title text-3xl sm:text-4xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors">
                      {poolside.name}
                    </h3>
                    <p className="text-xs font-sans-clean text-[#D1C7B7]/80 line-clamp-2 font-light">
                      {poolside.tagline}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-mono text-[#D1C7B7] uppercase">
                      {poolside.applications.slice(0, 3).map((a) => (
                        <span key={a} className="bg-[#0D0C0A]/80 border border-[#D1C7B7]/30 px-2.5 py-1 rounded-full">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Villa (7 cols) */}
            {(() => {
              const villa = spacesData.find((s) => s.slug === 'villas') || spacesData[1];
              return (
                <div
                  id={`space-tile-${villa.slug}`}
                  onClick={() => onNavigate({ type: 'explore', spaceSlug: villa.slug })}
                  className="md:col-span-7 group relative h-[380px] sm:h-[460px] rounded-2xl overflow-hidden cursor-pointer bg-[#141311] border border-[#D1C7B7]/20"
                >
                  <img
                    src={villa.heroImage}
                    alt={villa.name}
                    className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0A] via-[#0D0C0A]/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-[#F7F5F0]">
                    <div className="space-y-2 max-w-md">
                      <span className="text-[10px] tracking-[0.25em] uppercase text-[#D1C7B7] font-mono font-bold block">
                        ARCHITECTURAL ENVIRONMENT // 03
                      </span>
                      <h3 className="font-serif-title text-3xl sm:text-4xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors">
                        {villa.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-sans-clean text-[#D1C7B7]/80 line-clamp-2 font-light">
                        {villa.tagline}
                      </p>
                    </div>
                    <span className="w-10 h-10 rounded-full border border-[#D1C7B7]/40 bg-[#0D0C0A]/80 flex items-center justify-center group-hover:bg-[#F7F5F0] group-hover:text-[#0D0C0A] transition-all shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Row 3: 3 Cards (Terraces, Bungalows, Hospitality) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            {spacesData.slice(3, 6).map((sp) => (
              <div
                key={sp.id}
                id={`space-tile-${sp.slug}`}
                onClick={() => onNavigate({ type: 'explore', spaceSlug: sp.slug })}
                className="group relative h-[320px] rounded-2xl overflow-hidden cursor-pointer bg-[#141311] border border-[#D1C7B7]/15"
              >
                <img
                  src={sp.heroImage}
                  alt={sp.name}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0A] via-[#0D0C0A]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-[#F7F5F0] space-y-1">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#D1C7B7] font-mono font-bold block">
                    SPACE ARCHETYPE
                  </span>
                  <h4 className="font-serif-title text-2xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors">
                    {sp.name}
                  </h4>
                  <p className="text-xs font-sans-clean text-[#D1C7B7]/70 line-clamp-1 font-light">
                    {sp.tagline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 03 — THE MATERIAL UNIVERSE (Section 15 & 16) */}
      <section id="material-universe-section" className="relative py-28 md:py-36 px-6 md:px-10 border-y border-[#D1C7B7]/15 bg-[#0D0C0A]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D1C7B7]/15 pb-10">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-semibold block">
                02 // MATERIAL TACTILITY
              </span>
              <h2 className="font-serif-title text-4xl sm:text-6xl text-[#F7F5F0]">
                THE MATERIAL UNIVERSE.
              </h2>
              <p className="text-sm md:text-base font-sans-clean text-[#D1C7B7]/80 max-w-2xl font-light leading-relaxed">
                We curate materials not as commodities, but through their spatial poetry, weathering performance, and tectonic detailing.
                Explore our signature three-tier image system: Space, Material, and Construction Detail.
              </p>
            </div>
            <button
              id="view-all-materials-link-btn"
              onClick={() => onNavigate({ type: 'materials' })}
              className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold border-b border-[#D1C7B7]/50 pb-1 hover:text-[#F7F5F0] hover:border-[#F7F5F0] transition-colors cursor-pointer self-start md:self-end flex items-center gap-2"
            >
              <span>EXPLORE ALL MATERIAL FAMILIES</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* 5 Material Category Blocks in Brand Colors */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* WPC Spotlight (7 cols) */}
            {(() => {
              const wpc = materialsData.find((m) => m.slug === 'wpc') || materialsData[0];
              return (
                <div
                  id={`home-material-spotlight-${wpc.slug}`}
                  onClick={() => onNavigate({ type: 'materials', materialSlug: wpc.slug })}
                  className="lg:col-span-7 bg-[#141311] rounded-2xl border border-[#D1C7B7]/25 p-8 sm:p-10 space-y-6 group cursor-pointer hover:border-[#D1C7B7]/60 transition-all shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-bold px-3 py-1 rounded-full border border-[#D1C7B7]/30 bg-[#D1C7B7]/10">
                      {wpc.category}
                    </span>
                    <span className="text-xs font-mono text-[#D1C7B7] group-hover:text-[#F7F5F0] flex items-center gap-1">
                      Explore Material <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif-title text-3xl sm:text-4xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors">
                      {wpc.name}
                    </h3>
                    <p className="text-sm font-sans-clean text-[#D1C7B7]/80 mt-2 font-light">
                      {wpc.positioning}
                    </p>
                  </div>

                  {/* 3-Level Visual System: SPACE / MATERIAL / DETAIL */}
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="space-y-1.5">
                      <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[#D1C7B7]/20">
                        <img
                          src={wpc.spaceImages[0]}
                          alt="Space application"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-[#D1C7B7] block font-mono">
                        01 // SPACE
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[#D1C7B7]/20">
                        <img
                          src={wpc.materialImage}
                          alt="Macro texture"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-[#D1C7B7] block font-mono">
                        02 // MATERIAL
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[#D1C7B7]/20">
                        <img
                          src={wpc.detailImage}
                          alt="Construction detail"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-[#D1C7B7] block font-mono">
                        03 // DETAIL
                      </span>
                    </div>
                  </div>

                  {/* Where it works tags */}
                  <div className="pt-2 border-t border-[#D1C7B7]/15 flex flex-wrap gap-2 text-xs font-sans-clean text-[#D1C7B7]">
                    <span className="text-[#8C8273] text-[11px] uppercase tracking-wider font-mono mr-1">
                      Works In:
                    </span>
                    {wpc.whereItWorks.slice(0, 5).map((w) => (
                      <span key={w} className="bg-white/5 border border-[#D1C7B7]/20 px-2.5 py-0.5 rounded-full text-[11px] text-[#D1C7B7]">
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Roofing & Surfaces Columns (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Onduline Roofing */}
              {(() => {
                const ondu = materialsData.find((m) => m.slug === 'onduline-roofing') || materialsData[3];
                return (
                  <div
                    id={`home-material-spotlight-${ondu.slug}`}
                    onClick={() => onNavigate({ type: 'materials', materialSlug: ondu.slug })}
                    className="bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 p-6 group cursor-pointer hover:border-[#D1C7B7]/50 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-bold block">
                        ROOFING SYSTEM
                      </span>
                      <h4 className="font-serif-title text-2xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors">
                        {ondu.name}
                      </h4>
                      <p className="text-xs font-sans-clean text-[#D1C7B7]/75 line-clamp-2 font-light">
                        {ondu.positioning}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#D1C7B7]/15 text-xs font-mono">
                      <span className="text-[#8C8273]">Lightweight • Rain Damping • Rust-proof</span>
                      <ArrowUpRight className="w-4 h-4 text-[#D1C7B7] group-hover:text-[#F7F5F0]" />
                    </div>
                  </div>
                );
              })()}

              {/* Wooden Floors / Deck System */}
              {(() => {
                const wood = materialsData.find((m) => m.slug === 'wooden-floors') || materialsData[5];
                return (
                  <div
                    id={`home-material-spotlight-${wood.slug}`}
                    onClick={() => onNavigate({ type: 'materials', materialSlug: wood.slug })}
                    className="bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 p-6 group cursor-pointer hover:border-[#D1C7B7]/50 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-bold block">
                        WOODEN DECK SYSTEM
                      </span>
                      <h4 className="font-serif-title text-2xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors">
                        Floors, Walls & Acoustic Partitions
                      </h4>
                      <p className="text-xs font-sans-clean text-[#D1C7B7]/75 line-clamp-2 font-light">
                        Engineered European timber, rigid core SPC waterproof click, and acoustic slatted wall panels.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#D1C7B7]/15 text-xs font-mono">
                      <span className="text-[#8C8273]">Quick-Step • Unilin • Acoustic Slat</span>
                      <ArrowUpRight className="w-4 h-4 text-[#D1C7B7] group-hover:text-[#F7F5F0]" />
                    </div>
                  </div>
                );
              })()}

              {/* Surfaces: Microcement & Terrazzo */}
              {(() => {
                const micro = materialsData.find((m) => m.slug === 'microcement') || materialsData[7];
                return (
                  <div
                    id={`home-material-spotlight-${micro.slug}`}
                    onClick={() => onNavigate({ type: 'materials', materialSlug: micro.slug })}
                    className="bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 p-6 group cursor-pointer hover:border-[#D1C7B7]/50 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-bold block">
                        SURFACES
                      </span>
                      <h4 className="font-serif-title text-2xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors">
                        Microcement & NovaMix Terrazzo
                      </h4>
                      <p className="text-xs font-sans-clean text-[#D1C7B7]/75 line-clamp-2 font-light">
                        Seamless continuous floor-to-wall mineral skins and Italian marble aggregate terrazzo.
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#D1C7B7]/15 text-xs font-mono">
                      <span className="text-[#8C8273]">Zero Grout Lines • Barefoot Coolness</span>
                      <ArrowUpRight className="w-4 h-4 text-[#D1C7B7] group-hover:text-[#F7F5F0]" />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04 — STRUCTURES & CONFIGURATORS (Section 21, 22, 23, 24) */}
      <section id="structures-section" className="py-24 md:py-36 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-semibold block">
              03 // ARCHITECTURAL STRUCTURES
            </span>
            <h2 className="font-serif-title text-4xl sm:text-6xl text-[#F7F5F0]">
              WHAT CAN YOU BUILD?
            </h2>
            <p className="text-sm md:text-base font-sans-clean text-[#D1C7B7]/80 max-w-xl leading-relaxed font-light">
              Outdoor structures treated as architectural objects. Configure proportions, roof types, decking materials, integrated lighting, and seating via our interactive configurators.
            </p>
          </div>
          <button
            id="view-all-structures-link-btn"
            onClick={() => onNavigate({ type: 'structures' })}
            className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold border-b border-[#D1C7B7]/50 pb-1 hover:text-[#F7F5F0] hover:border-[#F7F5F0] transition-colors cursor-pointer self-start md:self-end flex items-center gap-2"
          >
            <span>OPEN STRUCTURE CONFIGURATORS</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Structures 4-Card Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {structuresData.map((st) => (
            <div
              key={st.id}
              id={`structure-card-${st.slug}`}
              onClick={() => onNavigate({ type: 'structures', structureSlug: st.slug })}
              className="bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 p-6 flex flex-col justify-between group cursor-pointer hover:border-[#D1C7B7]/60 transition-all shadow-md"
            >
              <div className="space-y-4">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-[#D1C7B7]/15">
                  <img
                    src={st.heroImage}
                    alt={st.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#D1C7B7] font-mono font-bold block">
                    {st.type}
                  </span>
                  <h3 className="font-serif-title text-2xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors mt-1">
                    {st.name}
                  </h3>
                </div>
                <p className="text-xs font-sans-clean text-[#D1C7B7]/75 line-clamp-3 leading-relaxed font-light">
                  {st.tagline}
                </p>
              </div>

              <div className="pt-6 border-t border-[#D1C7B7]/15 flex items-center justify-between text-xs font-mono text-[#D1C7B7]">
                <span>Launch Configurator</span>
                <span className="w-8 h-8 rounded-full bg-[#D1C7B7]/10 text-[#D1C7B7] border border-[#D1C7B7]/30 flex items-center justify-center group-hover:bg-[#F7F5F0] group-hover:text-[#0D0C0A] transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 05 — FEATURED PROJECT STORY (Section 27) */}
      <section id="featured-project-section" className="relative py-28 px-6 md:px-10 border-t border-[#D1C7B7]/15 bg-[#0D0C0A]/95">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex items-center justify-between border-b border-[#D1C7B7]/15 pb-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-semibold">
              FEATURED ARCHITECTURAL PROJECT // CASE STUDY
            </span>
            <button
              onClick={() => onNavigate({ type: 'project-story', projectSlug: featuredProject.slug })}
              className="text-xs uppercase tracking-wider text-[#D1C7B7] hover:text-[#F7F5F0] font-mono cursor-pointer flex items-center gap-1"
            >
              Read Full Case Study →
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Visual (7 cols) */}
            <div
              className="lg:col-span-7 aspect-[16/10] rounded-2xl overflow-hidden border border-[#D1C7B7]/25 group cursor-pointer shadow-2xl"
              onClick={() => onNavigate({ type: 'project-story', projectSlug: featuredProject.slug })}
            >
              <img
                src={featuredProject.heroImage}
                alt={featuredProject.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Narrative & Cross-Links (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono text-[#D1C7B7]">
                  {featuredProject.location} • {featuredProject.clientType}
                </span>
                <h3 className="font-serif-title text-4xl sm:text-5xl text-[#F7F5F0]">
                  {featuredProject.title}
                </h3>
              </div>

              <p className="text-sm font-sans-clean text-[#D1C7B7]/80 leading-relaxed font-light">
                {featuredProject.description}
              </p>

              {/* Interconnected Metadata */}
              <div className="grid grid-cols-2 gap-4 p-5 rounded-xl bg-[#141311] border border-[#D1C7B7]/20 text-xs font-sans-clean">
                <div>
                  <span className="text-[#8C8273] block text-[10px] uppercase font-mono">Space Archetype</span>
                  <button
                    onClick={() => onNavigate({ type: 'explore', spaceSlug: featuredProject.space })}
                    className="text-[#F7F5F0] hover:text-[#D1C7B7] hover:underline font-medium cursor-pointer"
                  >
                    {featuredProject.spaceName}
                  </button>
                </div>
                <div>
                  <span className="text-[#8C8273] block text-[10px] uppercase font-mono">Application</span>
                  <span className="text-[#F7F5F0] font-medium">{featuredProject.application}</span>
                </div>
                <div>
                  <span className="text-[#8C8273] block text-[10px] uppercase font-mono">Primary Material</span>
                  <span className="text-[#F7F5F0] font-medium">{featuredProject.material}</span>
                </div>
                <div>
                  <span className="text-[#8C8273] block text-[10px] uppercase font-mono">Integrated Structure</span>
                  <span className="text-[#F7F5F0] font-medium">{featuredProject.structure}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="view-featured-project-btn"
                  onClick={() => onNavigate({ type: 'project-story', projectSlug: featuredProject.slug })}
                  className="px-6 py-3 rounded-full bg-[#F7F5F0] text-[#0D0C0A] text-xs font-sans-clean font-bold tracking-[0.2em] uppercase hover:bg-[#D1C7B7] transition-all cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  <span>EXPLORE PROJECT STORY & PRODUCTS</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 06 — SERVICES & PARTNERS (Section 26 & 50) */}
      <section id="services-preview-section" className="py-28 md:py-36 px-6 md:px-10 max-w-7xl mx-auto space-y-20">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-semibold block">
            04 // TURNKEY ARCHITECTURAL PARTNERSHIP
          </span>
          <h2 className="font-serif-title text-4xl sm:text-6xl text-[#F7F5F0]">
            ONE PARTNER. <br />
            FROM MATERIAL TO SPACE.
          </h2>
          <p className="text-sm md:text-base font-sans-clean text-[#D1C7B7]/80 leading-relaxed font-light">
            Archzona is not merely a material warehouse. We partner with project creators across the full lifecycle:
            <br />
            <span className="font-mono text-[#D1C7B7] text-xs tracking-wider">
              UNDERSTAND → CURATE → ENGINEER → SOURCE → BUILD → INSTALL
            </span>
          </p>
        </div>

        {/* 6-Step Visual Timeline Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs font-sans-clean">
          {[
            { step: '01', name: 'CONSULT' },
            { step: '02', name: 'CURATE' },
            { step: '03', name: 'ENGINEER' },
            { step: '04', name: 'SOURCE' },
            { step: '05', name: 'FABRICATE' },
            { step: '06', name: 'INSTALL' },
          ].map((item) => (
            <div
              key={item.step}
              className="p-5 rounded-xl bg-[#141311] border border-[#D1C7B7]/20 space-y-2 hover:border-[#D1C7B7]/50 transition-all"
            >
              <span className="text-xs font-mono font-bold text-[#D1C7B7]">{item.step}</span>
              <h4 className="font-serif-title text-lg text-[#F7F5F0]">{item.name}</h4>
            </div>
          ))}
        </div>

        {/* Material Partners Strip */}
        <div className="pt-12 border-t border-[#D1C7B7]/15 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-semibold">
              AUTHORIZED MATERIAL PARTNERS
            </span>
            <span className="text-[11px] text-[#8C8273] font-mono">
              Global & Domestic Technical Leaders
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {partnersData.map((partner) => (
              <div
                key={partner.name}
                className="p-4 rounded-xl bg-[#141311] border border-[#D1C7B7]/20 flex flex-col justify-center text-center space-y-1 hover:border-[#D1C7B7]/50 transition-colors"
              >
                <span className="font-serif-title text-xl text-[#F7F5F0]">{partner.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#8C8273] font-mono">
                  {partner.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 06.5 — OFFICIAL PRODUCT CATALOGUE DECK */}
      <section id="catalogue-deck-section" className="relative py-20 px-6 md:px-10 border-t border-[#D1C7B7]/20 bg-[#12141C]">
        <div className="max-w-7xl mx-auto rounded-3xl border border-[#D4AF37]/30 bg-[#1A1D28] p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 font-serif-title text-8xl text-[#D4AF37] pointer-events-none select-none">
            DECK
          </div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[10px] uppercase font-mono tracking-[0.25em] text-[#D4AF37] font-bold">
              <Download className="w-3.5 h-3.5" /> OFFICIAL ARCHZONA PRODUCT CATALOGUE DECK
            </div>

            <h2 className="font-serif-title text-3xl sm:text-5xl text-[#F7F5F0] leading-tight font-light">
              Download Complete 26-Page Architectural Specification Deck
            </h2>

            <p className="text-sm sm:text-base font-sans-clean text-[#D1C7B7]/85 font-light leading-relaxed">
              Includes comprehensive technical data sheets, profile dimensions, material specifications, and load tables for Onduline Roofing Systems, Lamit Asphalt Shingles, Tensile Fabric Shades, WPC Decking, HPL/ACP Facades, MgSO4 Voody Proboards, and NovaMix Terrazzo Pathways.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <a
                id="home-download-deck-pdf-btn"
                href="/Archzona_Product_Catalogue_Deck.pdf"
                download="Archzona_Product_Catalogue_Deck.pdf"
                className="px-8 py-4 rounded-full bg-[#D4AF37] text-[#0D0C0A] text-xs font-sans-clean font-bold tracking-[0.2em] uppercase hover:bg-[#E5C158] transition-all cursor-pointer inline-flex items-center gap-2 shadow-xl"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD PRODUCT CATALOGUE DECK (PDF)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 07 — BOTTOM SPATIAL CTA */}
      <section className="relative py-24 px-6 md:px-10 border-t border-[#D1C7B7]/20 bg-[#141311]">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-semibold block">
            CREATE YOUR NEXT ARCHITECTURAL SPACE
          </span>
          <h2 className="font-serif-title text-4xl sm:text-6xl md:text-7xl text-[#F7F5F0] leading-tight">
            HAVE A SPACE IN MIND?
          </h2>
          <p className="text-base sm:text-lg font-sans-clean text-[#D1C7B7]/80 max-w-xl mx-auto font-light leading-relaxed">
            Tell us what you are building. Whether a coastal villa, boutique resort, or high-rise sky terrace, Archzona provides tactile materials and turnkey execution.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              id="cta-start-project-btn"
              onClick={() => onNavigate({ type: 'contact' })}
              className="px-8 py-4 rounded-full bg-[#F7F5F0] text-[#0D0C0A] text-xs font-sans-clean font-bold tracking-[0.2em] uppercase hover:bg-[#D1C7B7] transition-all cursor-pointer flex items-center gap-2 shadow-xl"
            >
              <span>START A PROJECT</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <a
              id="cta-download-catalogue-deck-btn"
              href="/Archzona_Product_Catalogue_Deck.pdf"
              download="Archzona_Product_Catalogue_Deck.pdf"
              className="px-8 py-4 rounded-full bg-transparent border border-[#D4AF37]/60 text-[#D4AF37] text-xs font-mono tracking-[0.2em] uppercase hover:bg-[#D4AF37] hover:text-[#0D0C0A] transition-all cursor-pointer inline-flex items-center gap-2 font-bold"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD CATALOGUE DECK</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
