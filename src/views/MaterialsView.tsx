import React, { useState } from 'react';
import { ArrowUpRight, ArrowLeft, Check, Layers, Box, FileDown, ShieldCheck } from 'lucide-react';
import { materialsData } from '../data/materials';
import { productsData } from '../data/products';
import { structuresData } from '../data/structures';
import { spacesData } from '../data/spaces';
import { ViewRoute, MaterialCategory, Material } from '../types';

interface MaterialsViewProps {
  initialMaterialSlug?: string;
  onNavigate: (route: ViewRoute) => void;
  onOpenProduct: (productSlug: string) => void;
  onRequestConsultation: (materialName?: string) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  initialMaterialSlug,
  onNavigate,
  onOpenProduct,
  onRequestConsultation,
}) => {
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(initialMaterialSlug);
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory | 'All'>('All');

  const activeMaterial: Material | undefined = selectedSlug
    ? materialsData.find((m) => m.slug === selectedSlug)
    : undefined;

  const categories: (MaterialCategory | 'All')[] = [
    'All',
    'Roofing',
    'Cladding',
    'Wooden Deck System',
    'Boards',
    'Surfaces',
  ];

  const filteredMaterials = selectedCategory === 'All'
    ? materialsData
    : materialsData.filter((m) => m.category === selectedCategory);

  // When viewing a material detail:
  const matchedProducts = activeMaterial
    ? productsData.filter((p) => p.material.toLowerCase() === activeMaterial.slug || p.material.toLowerCase().includes(activeMaterial.slug))
    : [];

  const matchedStructures = activeMaterial
    ? structuresData.filter((st) => st.materials.some((m) => m.toLowerCase().includes(activeMaterial.slug)))
    : [];

  return (
    <div id="materials-view" className="text-[#F7F5F0] pt-28 pb-32 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {activeMaterial ? (
          /* SECTION 16 — MATERIAL DETAIL PAGE */
          <div className="space-y-16 animate-fadeIn">
            {/* Breadcrumb / Back */}
            <div className="flex items-center gap-3 text-xs font-sans-clean text-[#8C8273]">
              <button
                onClick={() => setSelectedSlug(undefined)}
                className="hover:text-[#F7F5F0] flex items-center gap-1 uppercase tracking-wider cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> All Materials
              </button>
              <span>/</span>
              <span className="text-[#F7F5F0] uppercase tracking-wider font-semibold">
                {activeMaterial.name}
              </span>
            </div>

            {/* Material Hero & Narrative */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D1C7B7]/30 bg-[#141311] text-[10px] uppercase font-mono tracking-[0.25em] text-[#D1C7B7]">
                  <span className="w-2 h-2 rounded-full bg-[#D1C7B7]" />
                  {activeMaterial.category}
                </div>
                <span className="text-xs text-[#8C8273]">•</span>
                <span className="text-xs font-mono text-[#D1C7B7]">ARCHITECTURAL SPECIFICATION</span>
              </div>

              <h1 className="font-serif-title text-4xl sm:text-6xl text-[#F7F5F0] leading-tight">
                {activeMaterial.name}
              </h1>

              <p className="text-xl sm:text-2xl font-serif-title italic text-[#D1C7B7] max-w-3xl">
                "{activeMaterial.positioning}"
              </p>

              <p className="text-sm sm:text-base font-sans-clean text-[#D1C7B7]/85 max-w-3xl leading-relaxed">
                {activeMaterial.description}
              </p>
            </div>

            {/* 3-LEVEL VISUAL SYSTEM */}
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold block">
                THREE-TIER ARCHITECTURAL VISUAL SYSTEM
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 01 Space */}
                <div className="space-y-2">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl border border-[#D1C7B7]/20 bg-black/40">
                    <img
                      src={activeMaterial.spaceImages[0]}
                      alt="Space Context"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans-clean">
                    <span className="font-semibold uppercase text-[#F7F5F0]">01 — SPACE CONTEXT</span>
                    <span className="text-[#8C8273]">Scale & Mood</span>
                  </div>
                </div>

                {/* 02 Material */}
                <div className="space-y-2">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl border border-[#D1C7B7]/20 bg-black/40">
                    <img
                      src={activeMaterial.materialImage}
                      alt="Material Macro"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans-clean">
                    <span className="font-semibold uppercase text-[#F7F5F0]">02 — MATERIAL MACRO</span>
                    <span className="text-[#8C8273]">Grain & Surface</span>
                  </div>
                </div>

                {/* 03 Detail */}
                <div className="space-y-2">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl border border-[#D1C7B7]/20 bg-black/40">
                    <img
                      src={activeMaterial.detailImage}
                      alt="Construction Detail"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans-clean">
                    <span className="font-semibold uppercase text-[#F7F5F0]">03 — TECTONIC DETAIL</span>
                    <span className="text-[#8C8273]">Joinery & Sub-frame</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DEEP TACTILITY MATRIX */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-6 bg-[#141311] rounded-xl border border-[#D1C7B7]/20 space-y-2 shadow-md">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#D1C7B7] block">
                  WHAT IT FEELS LIKE
                </span>
                <h4 className="font-serif-title text-xl text-[#F7F5F0]">Tactile Texture</h4>
                <p className="text-xs font-sans-clean text-[#D1C7B7]/80 leading-relaxed">
                  {activeMaterial.tactility || 'Subtle textural grain with matte architectural finish and low thermal conductivity under direct sunlight.'}
                </p>
              </div>

              <div className="p-6 bg-[#141311] rounded-xl border border-[#D1C7B7]/20 space-y-2 shadow-md">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#D1C7B7] block">
                  HOW IT WEATHERS
                </span>
                <h4 className="font-serif-title text-xl text-[#F7F5F0]">Environmental Aging</h4>
                <p className="text-xs font-sans-clean text-[#D1C7B7]/80 leading-relaxed">
                  {activeMaterial.weathering || 'High UV resistance with slow, graceful patina development under heavy tropical sun and coastal exposure.'}
                </p>
              </div>

              <div className="p-6 bg-[#141311] rounded-xl border border-[#D1C7B7]/20 space-y-2 shadow-md">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#D1C7B7] block">
                  WHERE IT WORKS BEST
                </span>
                <h4 className="font-serif-title text-xl text-[#F7F5F0]">Ideal Spatial Settings</h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeMaterial.whereItWorks.map((w) => (
                    <span
                      key={w}
                      className="text-[11px] font-sans-clean bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded px-2 py-0.5 text-[#D1C7B7]"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* TECHNICAL HIGHLIGHTS & SUITABLE APPLICATIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
              <div className="p-8 bg-[#141311] rounded-xl border border-[#D1C7B7]/20 space-y-4 shadow-md">
                <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold block">
                  TECHNICAL SPECIFICATIONS & HIGHLIGHTS
                </span>
                <ul className="space-y-3 font-sans-clean text-xs sm:text-sm text-[#D1C7B7]/90">
                  {(activeMaterial.technicalHighlights || activeMaterial.whyItWorks).map((t, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D1C7B7] mt-2 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 bg-[#141311] rounded-xl border border-[#D1C7B7]/20 space-y-4 shadow-md">
                <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold block">
                  SUITABLE ARCHITECTURAL APPLICATIONS
                </span>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {activeMaterial.applications.map((app) => (
                    <div
                      key={app}
                      className="p-3 bg-[#0D0C0A] rounded-lg border border-[#D1C7B7]/20 font-serif-title text-base text-[#F7F5F0]"
                    >
                      {app}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA: REQUEST MATERIAL CONSULTATION / SAMPLE */}
            <div className="p-8 md:p-12 rounded-2xl bg-[#141311] border border-[#D1C7B7]/25 text-[#F7F5F0] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D1C7B7]/30 bg-[#0D0C0A] text-[10px] uppercase font-mono tracking-[0.25em] text-[#D1C7B7]">
                  TACTILE MATERIAL SPECIFICATION
                </div>
                <h3 className="font-serif-title text-3xl md:text-4xl text-[#F7F5F0]">
                  Need swatches or technical sub-frame drawings for {activeMaterial.name}?
                </h3>
                <p className="text-xs sm:text-sm font-sans-clean text-[#D1C7B7]/85 max-w-xl">
                  We supply physical swatches, fire/slip test certificates, and custom shop drawing support to architects and developers.
                </p>
              </div>

              <button
                id="request-material-consultation-btn"
                onClick={() => onRequestConsultation(activeMaterial.name)}
                className="px-8 py-4 bg-[#F7F5F0] hover:bg-[#D1C7B7] text-[#0D0C0A] text-xs font-sans-clean font-bold tracking-[0.2em] uppercase rounded-xl transition-all cursor-pointer shrink-0 shadow-lg"
              >
                REQUEST SAMPLE & CONSULTATION
              </button>
            </div>

            {/* PRODUCTS IN THIS MATERIAL */}
            {matchedProducts.length > 0 && (
              <div className="space-y-6 pt-6">
                <div className="flex items-center justify-between border-b border-[#D1C7B7]/20 pb-3">
                  <span className="text-xs uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-semibold">
                    AVAILABLE SKUs & PRODUCTS IN {activeMaterial.name.toUpperCase()}
                  </span>
                  <button
                    onClick={() => onNavigate({ type: 'shop' })}
                    className="text-xs uppercase tracking-wider font-sans-clean text-[#D1C7B7] hover:text-[#F7F5F0] cursor-pointer"
                  >
                    View All in Shop →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {matchedProducts.map((p) => (
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
                          <span className="text-[10px] uppercase font-mono text-[#D1C7B7]">
                            {p.brand}
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
                          View Specs →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RELATED STRUCTURES */}
            {matchedStructures.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-[#D1C7B7]/20">
                <span className="text-xs uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-semibold block">
                  STRUCTURES UTILIZING THIS MATERIAL
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matchedStructures.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => onNavigate({ type: 'structures', structureSlug: st.slug })}
                      className="p-6 bg-[#141311] rounded-xl border border-[#D1C7B7]/20 flex flex-col sm:flex-row gap-6 items-center group cursor-pointer hover:border-[#D1C7B7]/60 transition-all shadow-md"
                    >
                      <img
                        src={st.heroImage}
                        alt={st.name}
                        className="w-full sm:w-44 h-32 object-cover rounded-lg border border-[#D1C7B7]/20 shrink-0"
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
                        <div className="pt-1 text-xs font-sans-clean text-[#D1C7B7] font-semibold flex items-center gap-1 group-hover:text-[#F7F5F0]">
                          <span>Configure with {activeMaterial.name}</span> <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* MATERIALS CATALOGUE INDEX */
          <div className="space-y-16 animate-fadeIn">
            {/* Title & Philosophy */}
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D1C7B7]/30 bg-[#141311] text-[10px] uppercase font-mono tracking-[0.25em] text-[#D1C7B7]">
                <span className="w-2 h-2 rounded-full bg-[#D1C7B7]" />
                CURATED ARCHITECTURAL SPECIFICATIONS
              </div>
              <h1 className="font-serif-title text-4xl sm:text-6xl text-[#F7F5F0]">
                THE MATERIAL UNIVERSE.
              </h1>
              <p className="text-base sm:text-lg font-sans-clean text-[#D1C7B7]/85 leading-relaxed font-light">
                Not a commodity list. Archzona categorizes surfaces by their environmental resilience, tactile warmth, and structural integrity under tropical sun and heavy monsoon rainfall.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 border-b border-[#D1C7B7]/20 pb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  id={`material-cat-pill-${cat}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs font-sans-clean tracking-wider uppercase transition-all rounded-lg cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#F7F5F0] text-[#0D0C0A] font-semibold shadow-md'
                      : 'bg-[#141311] border border-[#D1C7B7]/25 text-[#8C8273] hover:text-[#F7F5F0] hover:border-[#D1C7B7]/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid of Materials */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMaterials.map((mat) => (
                <div
                  key={mat.id}
                  id={`material-card-${mat.slug}`}
                  onClick={() => setSelectedSlug(mat.slug)}
                  className="bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 p-6 flex flex-col justify-between group cursor-pointer hover:border-[#D1C7B7]/60 transition-all shadow-md"
                >
                  <div className="space-y-4">
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-black/40 border border-[#D1C7B7]/15">
                      <img
                        src={mat.heroImage}
                        alt={mat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-[#D1C7B7] font-mono font-semibold block">
                        {mat.category}
                      </span>
                      <h3 className="font-serif-title text-2xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors mt-1">
                        {mat.name}
                      </h3>
                    </div>
                    <p className="text-xs font-sans-clean text-[#8C8273] line-clamp-2 leading-relaxed">
                      {mat.positioning}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-sans-clean text-[#8C8273] uppercase">
                      {mat.whereItWorks.slice(0, 3).map((w) => (
                        <span key={w} className="bg-[#0D0C0A] px-2 py-0.5 rounded border border-[#D1C7B7]/20 text-[#D1C7B7]">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-[#D1C7B7]/15 flex items-center justify-between text-xs font-sans-clean font-medium text-[#D1C7B7]">
                    <span>View Specifications</span>
                    <span className="w-7 h-7 rounded-full bg-[#0D0C0A] border border-[#D1C7B7]/30 text-[#D1C7B7] flex items-center justify-center group-hover:bg-[#F7F5F0] group-hover:text-[#0D0C0A] transition-colors">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
