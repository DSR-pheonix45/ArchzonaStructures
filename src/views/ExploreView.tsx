import React, { useState } from 'react';
import { ArrowUpRight, ArrowLeft, Layers, Box, CheckCircle2, ChevronRight } from 'lucide-react';
import { spacesData } from '../data/spaces';
import { materialsData } from '../data/materials';
import { structuresData } from '../data/structures';
import { productsData } from '../data/products';
import { projectsData } from '../data/projects';
import { ViewRoute, Space } from '../types';

interface ExploreViewProps {
  initialSpaceSlug?: string;
  onNavigate: (route: ViewRoute) => void;
  onOpenProduct: (productSlug: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  initialSpaceSlug,
  onNavigate,
  onOpenProduct,
}) => {
  const [selectedSpaceSlug, setSelectedSpaceSlug] = useState<string | undefined>(initialSpaceSlug);

  const activeSpace: Space | undefined = selectedSpaceSlug
    ? spacesData.find((s) => s.slug === selectedSpaceSlug)
    : undefined;

  // Filtered relations if viewing space detail
  const relatedMaterials = activeSpace
    ? materialsData.filter((m) => activeSpace.materials.includes(m.slug))
    : [];

  const relatedStructures = activeSpace
    ? structuresData.filter((st) => activeSpace.structures.includes(st.slug))
    : [];

  const relatedProducts = activeSpace
    ? productsData.filter((p) => p.spaces.includes(activeSpace.slug))
    : [];

  const relatedProjectStories = activeSpace
    ? projectsData.filter((p) => p.space === activeSpace.slug)
    : [];

  return (
    <div id="explore-view" className="text-[#F7F5F0] pt-28 pb-32 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* If viewing a specific Space Detail Experience (Section 14) */}
        {activeSpace ? (
          <div className="space-y-16 animate-fadeIn">
            {/* Breadcrumbs & Back Navigation */}
            <div className="flex items-center gap-3 text-xs font-sans-clean text-[#8C8273]">
              <button
                onClick={() => setSelectedSpaceSlug(undefined)}
                className="hover:text-[#F7F5F0] flex items-center gap-1 uppercase tracking-wider cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> All Spaces
              </button>
              <span>/</span>
              <span className="text-[#F7F5F0] uppercase tracking-wider font-semibold">
                {activeSpace.name}
              </span>
            </div>

            {/* Space Hero Section */}
            <div className="space-y-8">
              <div className="relative h-[450px] md:h-[550px] overflow-hidden rounded-2xl border border-[#D1C7B7]/20 bg-black/40">
                <img
                  src={activeSpace.heroImage}
                  alt={activeSpace.name}
                  className="w-full h-full object-cover opacity-75 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0A] via-[#0D0C0A]/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 text-white space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D1C7B7]/30 bg-[#141311] text-[10px] uppercase font-mono tracking-[0.25em] text-[#D1C7B7]">
                    <span className="w-2 h-2 rounded-full bg-[#D1C7B7]" />
                    SPATIAL EXPERIENCE
                  </div>
                  <h1 className="font-serif-title text-5xl md:text-7xl text-[#F7F5F0]">
                    {activeSpace.name}
                  </h1>
                  <p className="text-sm md:text-lg font-sans-clean text-[#D1C7B7]/85 max-w-2xl font-light leading-relaxed">
                    {activeSpace.description}
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 1: APPLICATIONS (Section 14) */}
            <div className="space-y-6">
              <div className="border-b border-[#D1C7B7]/20 pb-3">
                <span className="text-xs uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-semibold">
                  01 — ARCHITECTURAL APPLICATIONS
                </span>
                <h3 className="font-serif-title text-3xl text-[#F7F5F0] mt-1">
                  Where Materials Integrate Around {activeSpace.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {activeSpace.applications.map((app) => (
                  <div
                    key={app}
                    className="p-4 bg-[#141311] rounded-xl border border-[#D1C7B7]/20 flex flex-col justify-between space-y-2 hover:border-[#D1C7B7]/60 hover:bg-[#141311]/80 transition-all shadow-md"
                  >
                    <span className="text-[10px] uppercase font-mono text-[#8C8273]">APPLICATION</span>
                    <span className="font-serif-title text-xl text-[#F7F5F0] leading-tight">{app}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 2: MATERIALS (Section 14) */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#D1C7B7]/20 pb-3">
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-semibold">
                    02 — RECOMMENDED MATERIALS
                  </span>
                  <h3 className="font-serif-title text-3xl text-[#F7F5F0] mt-1">
                    Tactile Materials Calibrated for {activeSpace.name}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedMaterials.map((mat) => (
                  <div
                    key={mat.id}
                    id={`space-material-card-${mat.slug}`}
                    onClick={() => onNavigate({ type: 'materials', materialSlug: mat.slug })}
                    className="bg-[#141311] rounded-xl p-6 border border-[#D1C7B7]/20 flex flex-col justify-between group cursor-pointer hover:border-[#D1C7B7]/60 transition-all shadow-md"
                  >
                    <div className="space-y-4">
                      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-black/40 border border-[#D1C7B7]/15">
                        <img
                          src={mat.heroImage}
                          alt={mat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] tracking-wider uppercase text-[#D1C7B7] font-semibold block font-mono">
                          {mat.category}
                        </span>
                        <h4 className="font-serif-title text-2xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors">
                          {mat.name}
                        </h4>
                      </div>
                      <p className="text-xs font-sans-clean text-[#8C8273] line-clamp-2">
                        {mat.positioning}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[#D1C7B7]/15 flex items-center justify-between text-xs font-sans-clean text-[#D1C7B7] font-medium">
                      <span>Explore Material Details</span>
                      <ArrowUpRight className="w-4 h-4 text-[#D1C7B7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 3: STRUCTURES (Section 14) */}
            <div className="space-y-6">
              <div className="border-b border-[#D1C7B7]/20 pb-3">
                <span className="text-xs uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-semibold">
                  03 — OUTDOOR STRUCTURES
                </span>
                <h3 className="font-serif-title text-3xl text-[#F7F5F0] mt-1">
                  Architectural Shade & Enclosures
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedStructures.map((st) => (
                  <div
                    key={st.id}
                    id={`space-structure-card-${st.slug}`}
                    onClick={() => onNavigate({ type: 'structures', structureSlug: st.slug })}
                    className="p-6 bg-[#141311] rounded-xl border border-[#D1C7B7]/20 flex flex-col sm:flex-row gap-6 items-center group cursor-pointer hover:border-[#D1C7B7]/60 transition-all shadow-md"
                  >
                    <img
                      src={st.heroImage}
                      alt={st.name}
                      className="w-full sm:w-48 h-36 object-cover rounded-lg border border-[#D1C7B7]/15 shrink-0"
                    />
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-wider text-[#D1C7B7] font-semibold font-mono block">
                        {st.type}
                      </span>
                      <h4 className="font-serif-title text-2xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors">
                        {st.name}
                      </h4>
                      <p className="text-xs font-sans-clean text-[#8C8273] line-clamp-2">
                        {st.tagline}
                      </p>
                      <div className="pt-2 text-xs font-sans-clean text-[#D1C7B7] font-semibold flex items-center gap-1 group-hover:text-[#F7F5F0]">
                        <span>Launch Configurator</span> <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 4: RELATED PRODUCTS (Section 14) */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#D1C7B7]/20 pb-3 gap-4">
                <div>
                  <span className="text-xs uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-semibold">
                    04 — CURATED PRODUCTS & SKUs
                  </span>
                  <h3 className="font-serif-title text-3xl text-[#F7F5F0] mt-1">
                    Products Ready for {activeSpace.name}
                  </h3>
                </div>
                <button
                  id="view-space-products-in-shop-btn"
                  onClick={() => onNavigate({ type: 'shop' })}
                  className="text-xs uppercase tracking-wider font-mono font-semibold text-[#D1C7B7] hover:text-[#F7F5F0] flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Filtered Shop</span> <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    id={`product-card-${p.id}`}
                    onClick={() => onOpenProduct(p.slug)}
                    className="bg-[#141311] rounded-xl border border-[#D1C7B7]/20 p-4 flex flex-col justify-between group cursor-pointer hover:border-[#D1C7B7]/60 transition-all shadow-md"
                  >
                    <div className="space-y-3">
                      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-black/40 border border-[#D1C7B7]/15">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#D1C7B7] font-semibold block font-mono">
                          {p.brand} • {p.material.toUpperCase()}
                        </span>
                        <h4 className="font-serif-title text-lg text-[#F7F5F0] leading-snug group-hover:text-[#D1C7B7] transition-colors mt-0.5">
                          {p.name}
                        </h4>
                      </div>
                      <p className="text-xs font-sans-clean text-[#8C8273] line-clamp-2">
                        {p.finish}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#D1C7B7]/15 flex items-center justify-between text-xs font-sans-clean">
                      <span className="text-[#8C8273]">{p.availability}</span>
                      <span className="font-semibold text-[#D1C7B7] group-hover:underline">
                        View Spec Sheet →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 5: FEATURED REAL PROJECTS (Section 27) */}
            {relatedProjectStories.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-[#D1C7B7]/20">
                <span className="text-xs uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-semibold block">
                  05 — CASE STUDIES IN THIS SPACE
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedProjectStories.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => onNavigate({ type: 'project-story', projectSlug: proj.slug })}
                      className="group cursor-pointer rounded-xl border border-[#D1C7B7]/20 p-6 bg-[#141311] space-y-4 hover:border-[#D1C7B7]/60 transition-all shadow-md"
                    >
                      <div className="aspect-[16/9] overflow-hidden rounded-lg bg-black/40 border border-[#D1C7B7]/15">
                        <img
                          src={proj.heroImage}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-mono text-[#8C8273]">{proj.location}</span>
                        <h4 className="font-serif-title text-2xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors">
                          {proj.title}
                        </h4>
                        <p className="text-xs font-sans-clean text-[#8C8273] line-clamp-2">
                          {proj.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* SPACES INDEX (EXPLORE ALL 8 SPACES) */
          <div className="space-y-16 animate-fadeIn">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D1C7B7]/30 bg-[#141311] text-[10px] uppercase font-mono tracking-[0.25em] text-[#D1C7B7]">
                <span className="w-2 h-2 rounded-full bg-[#D1C7B7]" />
                EXPLORE BY ARCHITECTURAL SPACE
              </div>
              <h1 className="font-serif-title text-5xl sm:text-7xl text-[#F7F5F0]">
                WHAT CAN THIS BECOME?
              </h1>
              <p className="text-base sm:text-lg font-sans-clean text-[#D1C7B7]/85 leading-relaxed font-light">
                Every architectural setting faces distinct environmental demands: salt spray on coastal pool decks, rain roar in plantation chalets, or thermal reflection on sky terraces. Choose an archetype to explore curated materials and structures.
              </p>
            </div>

            {/* Asymmetrical 8-Space Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
              {spacesData.map((space, idx) => {
                const colSpan = idx % 3 === 0 ? 'lg:col-span-8' : 'lg:col-span-4';
                return (
                  <div
                    key={space.id}
                    id={`explore-space-card-${space.slug}`}
                    onClick={() => setSelectedSpaceSlug(space.slug)}
                    className={`${colSpan} group relative h-[380px] sm:h-[420px] overflow-hidden rounded-2xl cursor-pointer border border-[#D1C7B7]/20 bg-[#141311] hover:border-[#D1C7B7]/60 transition-all shadow-md`}
                  >
                    <img
                      src={space.heroImage}
                      alt={space.name}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0A]/95 via-[#0D0C0A]/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] tracking-[0.25em] uppercase text-[#D1C7B7] font-mono font-semibold">
                          ARCHETYPE 0{idx + 1}
                        </span>
                        <span className="text-xs uppercase font-sans-clean text-[#D1C7B7] group-hover:text-[#F7F5F0] flex items-center gap-1">
                          Open Space Experience <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <h3 className="font-serif-title text-3xl sm:text-4xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors">
                        {space.name}
                      </h3>
                      <p className="text-xs sm:text-sm font-sans-clean text-[#D1C7B7]/80 line-clamp-2">
                        {space.tagline}
                      </p>
                      <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono text-[#8C8273] uppercase">
                        {space.applications.slice(0, 3).map((a) => (
                          <span key={a} className="bg-[#0D0C0A] border border-[#D1C7B7]/20 px-2 py-0.5 rounded text-[#D1C7B7]">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
