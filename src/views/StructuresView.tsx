import React, { useState } from 'react';
import { ArrowUpRight, ArrowLeft, Check, Layers, Sparkles, Sliders, Box, ShieldCheck, Send } from 'lucide-react';
import { structuresData } from '../data/structures';
import { materialsData } from '../data/materials';
import { projectsData } from '../data/projects';
import { ViewRoute, Structure } from '../types';

interface StructuresViewProps {
  initialStructureSlug?: string;
  onNavigate: (route: ViewRoute) => void;
  onRequestStructureQuote: (config: any) => void;
}

export const StructuresView: React.FC<StructuresViewProps> = ({
  initialStructureSlug,
  onNavigate,
  onRequestStructureQuote,
}) => {
  const [selectedSlug, setSelectedSlug] = useState<string | undefined>(initialStructureSlug);

  const activeStructure: Structure | undefined = selectedSlug
    ? structuresData.find((st) => st.slug === selectedSlug)
    : undefined;

  // Configurator state for active structure
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedRoof, setSelectedRoof] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Initialize configurator when activeStructure changes
  React.useEffect(() => {
    if (activeStructure) {
      setSelectedSize(activeStructure.configuratorOptions.sizes[1] || activeStructure.configuratorOptions.sizes[0]);
      setSelectedRoof(activeStructure.configuratorOptions.roofOptions[0]);
      setSelectedMaterial(activeStructure.configuratorOptions.materialOptions[0]);
      setSelectedAddons([activeStructure.configuratorOptions.addons[0]]);
    }
  }, [activeStructure]);

  const toggleAddon = (addon: string) => {
    if (selectedAddons.includes(addon)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== addon));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleRequestQuote = () => {
    if (!activeStructure) return;
    const config = {
      structureName: activeStructure.name,
      structureType: activeStructure.type,
      size: selectedSize,
      roofType: selectedRoof,
      material: selectedMaterial,
      addons: selectedAddons,
    };
    onRequestStructureQuote(config);
  };

  return (
    <div id="structures-view" className="text-[#F7F5F0] pt-28 pb-32 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {activeStructure ? (
          /* SECTION 22 — STRUCTURE DETAIL & CONFIGURATOR */
          <div className="space-y-16 animate-fadeIn">
            {/* Back Nav */}
            <div className="flex items-center gap-3 text-xs font-sans-clean text-[#8C8273]">
              <button
                onClick={() => setSelectedSlug(undefined)}
                className="hover:text-[#F7F5F0] flex items-center gap-1 uppercase tracking-wider cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> All Structures
              </button>
              <span>/</span>
              <span className="text-[#F7F5F0] uppercase tracking-wider font-semibold">
                {activeStructure.name}
              </span>
            </div>

            {/* Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D1C7B7]/30 bg-[#141311] text-[10px] uppercase font-mono tracking-[0.25em] text-[#D1C7B7]">
                <span className="w-2 h-2 rounded-full bg-[#D1C7B7]" />
                {activeStructure.type} • OUTDOOR ARCHITECTURAL OBJECT
              </div>
              <h1 className="font-serif-title text-4xl sm:text-6xl text-[#F7F5F0] leading-tight">
                {activeStructure.name}
              </h1>
              <p className="text-base sm:text-lg font-sans-clean text-[#D1C7B7]/85 max-w-2xl leading-relaxed font-light">
                {activeStructure.description}
              </p>
            </div>

            {/* Main Interactive Studio (Configurator + Live Visual) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Architectural Visual Canvas (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-[#D1C7B7]/20 bg-black/40 relative">
                  <img
                    src={activeStructure.heroImage}
                    alt={activeStructure.name}
                    className="w-full h-full object-cover opacity-90"
                  />
                  {/* Overlay Config Spec Badge */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0D0C0A]/90 border border-[#D1C7B7]/30 text-[#F7F5F0] flex flex-wrap items-center justify-between gap-3 text-xs font-sans-clean shadow-2xl backdrop-blur-md">
                    <div>
                      <span className="text-[#D1C7B7] text-[10px] uppercase block font-mono">Current Spec</span>
                      <span className="font-semibold text-[#F7F5F0]">
                        {selectedSize} • {selectedRoof} • {selectedMaterial}
                      </span>
                    </div>
                    {selectedAddons.length > 0 && (
                      <div className="text-right">
                        <span className="text-[#D1C7B7] text-[10px] uppercase block font-mono">Add-ons</span>
                        <span className="text-[#D1C7B7]/90">{selectedAddons.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Material Breakdown Matrix (Section 22) */}
                <div className="p-6 bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 space-y-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold">
                      MATERIAL BREAKDOWN FOR THIS STRUCTURE
                    </span>
                    <span className="text-xs font-mono text-[#8C8273]">
                      Click to explore material
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {activeStructure.materials.map((matName) => {
                      const matObj = materialsData.find((m) =>
                        m.name.toLowerCase().includes(matName.toLowerCase()) ||
                        matName.toLowerCase().includes(m.name.toLowerCase())
                      );
                      return (
                        <button
                          key={matName}
                          onClick={() => matObj && onNavigate({ type: 'materials', materialSlug: matObj.slug })}
                          className="p-3.5 bg-[#0D0C0A] rounded-xl border border-[#D1C7B7]/20 text-left hover:border-[#D1C7B7]/60 transition-all cursor-pointer group"
                        >
                          <span className="text-[10px] uppercase font-mono text-[#D1C7B7] block">
                            INTEGRATED
                          </span>
                          <span className="font-serif-title text-base text-[#F7F5F0] group-hover:text-[#D1C7B7]">
                            {matName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Configurator Controls (5 cols) */}
              <div className="lg:col-span-5 bg-[#141311] rounded-2xl text-[#F7F5F0] p-6 sm:p-8 border border-[#D1C7B7]/25 space-y-6 shadow-xl">
                <div className="border-b border-[#D1C7B7]/20 pb-4">
                  <div className="flex items-center gap-2 text-[#D1C7B7] text-xs uppercase tracking-[0.2em] font-mono font-semibold">
                    <Sliders className="w-4 h-4 text-[#D1C7B7]" />
                    <span>INTERACTIVE CONFIGURATOR</span>
                  </div>
                  <h3 className="font-serif-title text-2xl text-[#F7F5F0] mt-1">
                    Customise Your Structure
                  </h3>
                </div>

                {/* Option 1: Proportions / Size */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-[#8C8273] uppercase tracking-wider block">
                    01 — Span & Footprint Dimensions
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {activeStructure.configuratorOptions.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`p-2.5 text-xs font-sans-clean uppercase tracking-wider rounded-lg border transition-all cursor-pointer text-left ${
                          selectedSize === size
                            ? 'border-[#D1C7B7] bg-[#F7F5F0] text-[#0D0C0A] font-semibold shadow-md'
                            : 'bg-[#0D0C0A] border-[#D1C7B7]/20 text-[#D1C7B7] hover:border-[#D1C7B7]/50 hover:text-[#F7F5F0]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Option 2: Roof System */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-[#8C8273] uppercase tracking-wider block">
                    02 — Overhead Roof / Canopy Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {activeStructure.configuratorOptions.roofOptions.map((roof) => (
                      <button
                        key={roof}
                        onClick={() => setSelectedRoof(roof)}
                        className={`p-2.5 text-xs font-sans-clean uppercase tracking-wider rounded-lg border transition-all cursor-pointer text-left ${
                          selectedRoof === roof
                            ? 'border-[#D1C7B7] bg-[#F7F5F0] text-[#0D0C0A] font-semibold shadow-md'
                            : 'bg-[#0D0C0A] border-[#D1C7B7]/20 text-[#D1C7B7] hover:border-[#D1C7B7]/50 hover:text-[#F7F5F0]'
                        }`}
                      >
                        {roof}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Option 3: Primary Material */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-[#8C8273] uppercase tracking-wider block">
                    03 — Structural & Slat Material
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {activeStructure.configuratorOptions.materialOptions.map((mat) => (
                      <button
                        key={mat}
                        onClick={() => setSelectedMaterial(mat)}
                        className={`p-2.5 text-xs font-sans-clean uppercase tracking-wider rounded-lg border transition-all cursor-pointer text-left ${
                          selectedMaterial === mat
                            ? 'border-[#D1C7B7] bg-[#F7F5F0] text-[#0D0C0A] font-semibold shadow-md'
                            : 'bg-[#0D0C0A] border-[#D1C7B7]/20 text-[#D1C7B7] hover:border-[#D1C7B7]/50 hover:text-[#F7F5F0]'
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Option 4: Architectural Add-ons */}
                <div className="space-y-2">
                  <label className="text-xs font-mono text-[#8C8273] uppercase tracking-wider block">
                    04 — Integrated Architectural Add-ons
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {activeStructure.configuratorOptions.addons.map((addon) => {
                      const isChecked = selectedAddons.includes(addon);
                      return (
                        <button
                          key={addon}
                          onClick={() => toggleAddon(addon)}
                          className={`p-2.5 text-xs font-sans-clean rounded-lg border transition-all cursor-pointer flex items-center justify-between text-left ${
                            isChecked
                              ? 'border-[#D1C7B7] bg-[#D1C7B7]/20 text-[#F7F5F0]'
                              : 'bg-[#0D0C0A] border-[#D1C7B7]/20 text-[#8C8273] hover:text-[#F7F5F0] hover:border-[#D1C7B7]/40'
                          }`}
                        >
                          <span>{addon}</span>
                          {isChecked && <Check className="w-3.5 h-3.5 text-[#D1C7B7]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Configurator CTA Actions */}
                <div className="pt-4 space-y-3 border-t border-[#D1C7B7]/20">
                  <button
                    id="request-configured-structure-btn"
                    onClick={handleRequestQuote}
                    className="w-full py-4 bg-[#F7F5F0] hover:bg-[#D1C7B7] text-[#0D0C0A] font-sans-clean font-bold text-xs uppercase tracking-[0.2em] rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg"
                  >
                    <span>REQUEST THIS STRUCTURE SPEC</span>
                    <Send className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onNavigate({ type: 'contact' })}
                    className="w-full py-3 bg-[#0D0C0A] border border-[#D1C7B7]/30 text-[#D1C7B7] hover:text-[#F7F5F0] hover:border-[#D1C7B7] rounded-xl font-sans-clean text-xs uppercase tracking-[0.18em] transition-colors cursor-pointer"
                  >
                    CUSTOMISE WITH AN ARCHZONA ARCHITECT
                  </button>
                </div>
              </div>
            </div>

            {/* Related Real Projects Featuring This Structure */}
            <div className="space-y-6 pt-10 border-t border-[#D1C7B7]/20">
              <span className="text-xs uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-semibold block">
                SITE EXECUTIONS & FEATURED BUILDS
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projectsData.slice(0, 2).map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => onNavigate({ type: 'project-story', projectSlug: proj.slug })}
                    className="p-6 bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 space-y-4 group cursor-pointer hover:border-[#D1C7B7]/60 transition-all shadow-md"
                  >
                    <div className="aspect-[16/9] overflow-hidden rounded-xl bg-black/40 border border-[#D1C7B7]/15">
                      <img
                        src={proj.heroImage}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-[#8C8273]">{proj.location}</span>
                      <h4 className="font-serif-title text-2xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors mt-1">
                        {proj.title}
                      </h4>
                      <p className="text-xs font-sans-clean text-[#8C8273] line-clamp-2 mt-1">
                        {proj.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* STRUCTURES CATALOGUE INDEX */
          <div className="space-y-16 animate-fadeIn">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D1C7B7]/30 bg-[#141311] text-[10px] uppercase font-mono tracking-[0.25em] text-[#D1C7B7]">
                <span className="w-2 h-2 rounded-full bg-[#D1C7B7]" />
                WHAT CAN YOU BUILD?
              </div>
              <h1 className="font-serif-title text-4xl sm:text-6xl text-[#F7F5F0]">
                ARCHITECTURAL STRUCTURES.
              </h1>
              <p className="text-base sm:text-lg font-sans-clean text-[#D1C7B7]/85 leading-relaxed font-light">
                Pergolas, gazebos, cabanas, outdoor pavilions, and deck-pergola integrated systems engineered for wind loads, coastal weathering, and clean hidden joinery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {structuresData.map((st) => (
                <div
                  key={st.id}
                  id={`structure-tile-${st.slug}`}
                  onClick={() => setSelectedSlug(st.slug)}
                  className="bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 p-8 flex flex-col justify-between group cursor-pointer hover:border-[#D1C7B7]/60 transition-all space-y-6 shadow-md"
                >
                  <div className="space-y-4">
                    <div className="aspect-[16/10] overflow-hidden rounded-xl bg-black/40 border border-[#D1C7B7]/15">
                      <img
                        src={st.heroImage}
                        alt={st.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-[#D1C7B7] font-mono font-semibold block">
                        {st.type}
                      </span>
                      <h3 className="font-serif-title text-3xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors mt-1">
                        {st.name}
                      </h3>
                    </div>
                    <p className="text-sm font-sans-clean text-[#D1C7B7]/80 leading-relaxed">
                      {st.description}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2 text-xs font-sans-clean text-[#8C8273]">
                      <span className="text-[#D1C7B7] font-semibold font-mono">INCLUDES:</span>
                      {st.configuratorOptions.sizes.slice(0, 3).map((s) => (
                        <span key={s} className="bg-[#0D0C0A] px-2 py-0.5 rounded border border-[#D1C7B7]/20 text-[#D1C7B7]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#D1C7B7]/15 flex items-center justify-between text-xs font-sans-clean font-semibold text-[#D1C7B7]">
                    <span>Launch Interactive Configurator</span>
                    <span className="w-8 h-8 rounded-full bg-[#0D0C0A] border border-[#D1C7B7]/30 text-[#D1C7B7] flex items-center justify-center group-hover:bg-[#F7F5F0] group-hover:text-[#0D0C0A] transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
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
