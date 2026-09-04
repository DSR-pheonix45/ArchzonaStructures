import React from 'react';
import { ArrowUpRight, Compass, ShieldCheck, Layers, Building2, MapPin } from 'lucide-react';
import { partnersData } from '../data/partners';
import { ViewRoute } from '../types';

interface AboutViewProps {
  onNavigate: (route: ViewRoute) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div id="about-view" className="text-[#F7F5F0] pt-28 pb-32 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-20">
        {/* Curatorial Philosophy Narrative */}
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D1C7B7]/30 bg-[#141311] text-[10px] uppercase font-mono tracking-[0.25em] text-[#D1C7B7]">
            <span className="w-2 h-2 rounded-full bg-[#D1C7B7]" />
            ABOUT ARCHZONA STRUCTURES
          </div>
          <h1 className="font-serif-title text-4xl sm:text-6xl text-[#F7F5F0] leading-tight">
            CURATING THE TACTILE EDGE OF ARCHITECTURE.
          </h1>
          <p className="text-xl sm:text-2xl font-serif-title italic text-[#D1C7B7] leading-relaxed border-l-2 border-[#D1C7B7]/60 pl-6 my-6">
            "Materials are not merely specifications on a quantity takeoff; they are the sensory interface between an inhabitant and the natural world."
          </p>
          <p className="text-base sm:text-lg font-sans-clean text-[#D1C7B7]/85 leading-relaxed font-light">
            Founded to bridge the divide between contemporary spatial concepts and field execution reality, Archzona operates as an experiential partner for architects, landscape designers, hospitality developers, and private villa owners.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-8 bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 space-y-4 hover:border-[#D1C7B7]/60 transition-all shadow-md">
            <span className="text-xs font-mono font-bold text-[#D1C7B7]">01 / SPACES</span>
            <h3 className="font-serif-title text-2xl text-[#F7F5F0]">Architectural Context</h3>
            <p className="text-xs font-sans-clean text-[#D1C7B7]/80 leading-relaxed">
              We begin with environmental reality: wind loads, salt spray, thermal mass, and solar trajectory before proposing surface finishes.
            </p>
          </div>

          <div className="p-8 bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 space-y-4 hover:border-[#D1C7B7]/60 transition-all shadow-md">
            <span className="text-xs font-mono font-bold text-[#D1C7B7]">02 / MATERIALS</span>
            <h3 className="font-serif-title text-2xl text-[#F7F5F0]">Curated Tactility</h3>
            <p className="text-xs font-sans-clean text-[#D1C7B7]/80 leading-relaxed">
              A tightly edited portfolio of advanced composites, monolithic microcement, acoustic slats, and engineered French roofing membranes.
            </p>
          </div>

          <div className="p-8 bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 space-y-4 hover:border-[#D1C7B7]/60 transition-all shadow-md">
            <span className="text-xs font-mono font-bold text-[#D1C7B7]">03 / STRUCTURES</span>
            <h3 className="font-serif-title text-2xl text-[#F7F5F0]">Objects of Shade</h3>
            <p className="text-xs font-sans-clean text-[#D1C7B7]/80 leading-relaxed">
              Pergolas and pavilions engineered with concealed fasteners, internal rainwater channels, and seamless integration with deck planes.
            </p>
          </div>

          <div className="p-8 bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 space-y-4 hover:border-[#D1C7B7]/60 transition-all shadow-md">
            <span className="text-xs font-mono font-bold text-[#D1C7B7]">04 / EXECUTION</span>
            <h3 className="font-serif-title text-2xl text-[#F7F5F0]">Turnkey Certainty</h3>
            <p className="text-xs font-sans-clean text-[#D1C7B7]/80 leading-relaxed">
              In-house certified installers, laser-verified sub-frames, and single-source warranty eliminates handoff failures on site.
            </p>
          </div>
        </div>

        {/* The Digital Experience Centre Philosophy */}
        <div className="bg-[#141311] rounded-2xl border border-[#D1C7B7]/25 text-[#F7F5F0] p-8 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-xl">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-semibold block">
              THE EXPERIENCE CENTRE MODEL
            </span>
            <h2 className="font-serif-title text-3xl sm:text-5xl text-[#F7F5F0]">
              Experience First. <br />
              Commerce Follows.
            </h2>
            <p className="text-sm sm:text-base font-sans-clean text-[#D1C7B7]/85 leading-relaxed font-light">
              Too many construction catalogs treat materials like electronic parts on a shelf. But architecture lives in sunlight, footfall, and shadow. Archzona is designed to allow you to experience materials in space, curate a project schedule, and execute with master precision.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate({ type: 'explore' })}
                className="px-6 py-3.5 bg-[#F7F5F0] hover:bg-[#D1C7B7] text-[#0D0C0A] text-xs font-sans-clean font-bold tracking-[0.2em] uppercase rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg"
              >
                <span>EXPLORE SPATIAL ARCHETYPES</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 aspect-[4/3] overflow-hidden rounded-2xl border border-[#D1C7B7]/20 bg-black/40">
            <img
              src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1600&auto=format&fit=crop"
              alt="Archzona Interior Architecture"
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        </div>

        {/* Material Partner Alliances */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#D1C7B7]/20 pb-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold">
              AUTHORISED TECHNICAL ALLIANCES
            </span>
            <span className="text-xs font-mono text-[#8C8273]">
              Global Certification Compliance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnersData.map((p) => (
              <div
                key={p.name}
                className="p-6 bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 space-y-2 hover:border-[#D1C7B7]/60 transition-all shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-serif-title text-2xl text-[#F7F5F0]">{p.name}</h4>
                  <span className="text-[10px] uppercase font-mono text-[#D1C7B7]">
                    {p.country}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#8C8273] block uppercase tracking-wider">
                  {p.category}
                </span>
                <p className="text-xs font-sans-clean text-[#D1C7B7]/80 pt-1">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
