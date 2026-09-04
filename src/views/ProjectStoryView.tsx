import React from 'react';
import { ArrowLeft, ArrowUpRight, Check, Plus, Layers, Building2, Box } from 'lucide-react';
import { projectsData } from '../data/projects';
import { productsData } from '../data/products';
import { ViewRoute } from '../types';
import { useProjectCart } from '../context/ProjectCartContext';

interface ProjectStoryViewProps {
  projectSlug: string;
  onNavigate: (route: ViewRoute) => void;
  onOpenProduct: (productSlug: string) => void;
}

export const ProjectStoryView: React.FC<ProjectStoryViewProps> = ({
  projectSlug,
  onNavigate,
  onOpenProduct,
}) => {
  const project = projectsData.find((p) => p.slug === projectSlug) || projectsData[0];
  const { addItem } = useProjectCart();

  const matchedProducts = productsData.filter((p) => project.productsUsed.includes(p.id));

  return (
    <div id="project-story-view" className="text-[#F7F5F0] pt-28 pb-32 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-16">
        {/* Back navigation */}
        <button
          onClick={() => onNavigate({ type: 'explore' })}
          className="hover:text-[#F7F5F0] flex items-center gap-2 text-xs font-sans-clean text-[#8C8273] uppercase tracking-wider cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Explore
        </button>

        {/* Story Header */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#D1C7B7]">
            <span>{project.location}</span>
            <span>•</span>
            <span>{project.clientType}</span>
          </div>

          <h1 className="font-serif-title text-4xl sm:text-6xl text-[#F7F5F0] leading-tight">
            {project.title}
          </h1>

          <p className="text-lg md:text-xl font-sans-clean text-[#D1C7B7]/85 max-w-3xl leading-relaxed font-light">
            {project.description}
          </p>
        </div>

        {/* Hero Architectural Image */}
        <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-[#D1C7B7]/20 bg-black/40">
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        {/* Interconnected Architecture Matrix (Section 27) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 shadow-xl">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#D1C7B7]">
              SPACE ARCHETYPE
            </span>
            <button
              onClick={() => onNavigate({ type: 'explore', spaceSlug: project.space })}
              className="font-serif-title text-2xl text-[#F7F5F0] hover:text-[#D1C7B7] underline block text-left cursor-pointer transition-colors"
            >
              {project.spaceName}
            </button>
            <p className="text-xs font-sans-clean text-[#8C8273]">Click to view space archetype</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#D1C7B7]">
              PRIMARY APPLICATION
            </span>
            <div className="font-serif-title text-2xl text-[#F7F5F0]">
              {project.application}
            </div>
            <p className="text-xs font-sans-clean text-[#8C8273]">Site specific installation</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#D1C7B7]">
              MATERIAL PALETTE
            </span>
            <button
              onClick={() => onNavigate({ type: 'materials' })}
              className="font-serif-title text-2xl text-[#F7F5F0] hover:text-[#D1C7B7] underline block text-left cursor-pointer transition-colors"
            >
              {project.material}
            </button>
            <p className="text-xs font-sans-clean text-[#8C8273]">Click to explore material family</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#D1C7B7]">
              INTEGRATED STRUCTURE
            </span>
            <button
              onClick={() => onNavigate({ type: 'structures' })}
              className="font-serif-title text-2xl text-[#F7F5F0] hover:text-[#D1C7B7] underline block text-left cursor-pointer transition-colors"
            >
              {project.structure}
            </button>
            <p className="text-xs font-sans-clean text-[#8C8273]">Click to configure structure</p>
          </div>
        </div>

        {/* Gallery & Highlights (Section 27) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-serif-title text-3xl text-[#F7F5F0]">
              Project Execution Gallery
            </h3>
            <div className="space-y-6">
              {project.gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-[16/10] overflow-hidden rounded-2xl border border-[#D1C7B7]/20 bg-black/40"
                >
                  <img
                    src={img}
                    alt={`${project.title} detail ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-10">
            {/* Highlights */}
            <div className="p-8 bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 space-y-4 shadow-xl">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold block">
                TECTONIC HIGHLIGHTS
              </span>
              <ul className="space-y-3 font-sans-clean text-sm text-[#D1C7B7]/90 leading-relaxed">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D1C7B7] mt-2 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Products Used in this Project (Clickable into shop/detail) */}
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold block">
                PRODUCTS USED IN THIS PROJECT
              </span>

              <div className="space-y-3">
                {matchedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-[#141311] rounded-xl border border-[#D1C7B7]/20 flex items-center justify-between gap-4 hover:border-[#D1C7B7]/60 transition-all shadow-md"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => onOpenProduct(p.slug)}
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-14 h-14 object-cover rounded-lg border border-[#D1C7B7]/20 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] uppercase font-mono text-[#D1C7B7]">
                          {p.brand} • {p.material.toUpperCase()}
                        </span>
                        <h5 className="font-serif-title text-base text-[#F7F5F0] hover:text-[#D1C7B7] transition-colors">
                          {p.name}
                        </h5>
                        <span className="text-xs text-[#8C8273] font-sans-clean">{p.finish}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => addItem(p, 50, 200, `Inspired by ${project.title}`)}
                      className="px-3.5 py-2 bg-[#F7F5F0] hover:bg-[#D1C7B7] text-[#0D0C0A] font-bold rounded-lg text-xs uppercase tracking-wider font-sans-clean shrink-0 cursor-pointer shadow-md transition-all"
                      title="Add to Project Schedule"
                    >
                      + ADD
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
