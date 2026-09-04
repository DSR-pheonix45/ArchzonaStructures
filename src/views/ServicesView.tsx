import React from 'react';
import { ArrowUpRight, CheckCircle2, ShieldCheck, Wrench, HardHat, Compass, Layers } from 'lucide-react';
import { servicesData } from '../data/services';
import { partnersData } from '../data/partners';
import { ViewRoute } from '../types';

interface ServicesViewProps {
  onNavigate: (route: ViewRoute) => void;
  onRequestConsultation: () => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  onNavigate,
  onRequestConsultation,
}) => {
  return (
    <div id="services-view" className="text-[#F7F5F0] pt-28 pb-32 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-20">
        {/* Header Section */}
        <div className="max-w-3xl space-y-4 border-b border-[#D1C7B7]/20 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D1C7B7]/30 bg-[#141311] text-[10px] uppercase font-mono tracking-[0.25em] text-[#D1C7B7]">
            <span className="w-2 h-2 rounded-full bg-[#D1C7B7]" />
            TURNKEY ARCHITECTURAL EXECUTION
          </div>
          <h1 className="font-serif-title text-4xl sm:text-6xl text-[#F7F5F0]">
            ONE PARTNER. <br />
            FROM MATERIAL TO SPACE.
          </h1>
          <p className="text-base sm:text-lg font-sans-clean text-[#D1C7B7]/85 leading-relaxed font-light">
            Architectural projects frequently break down between the design table and the site: incorrect sub-framing, uncertified fasteners, poor drainage slopes, and finger-pointing between vendors and civil contractors. Archzona bridges this chasm with full lifecycle ownership.
          </p>
        </div>

        {/* 6 Lifecycle Steps Visual Flow */}
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold block">
            THE ARCHZONA TURNKEY METHODOLOGY
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((svc) => (
              <div
                key={svc.id}
                id={`service-card-${svc.id}`}
                className="p-8 bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 flex flex-col justify-between space-y-6 hover:border-[#D1C7B7]/60 transition-all shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#D1C7B7]/15 pb-3">
                    <span className="text-xs font-mono font-bold text-[#D1C7B7]">
                      STAGE {svc.step}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#8C8273] font-mono">
                      Turnkey Execution
                    </span>
                  </div>

                  <h3 className="font-serif-title text-3xl text-[#F7F5F0]">{svc.title}</h3>

                  <p className="text-sm font-sans-clean text-[#D1C7B7]/85 leading-relaxed">
                    {svc.description}
                  </p>

                  <div className="pt-2 space-y-2">
                    <span className="text-[10px] uppercase font-mono text-[#D1C7B7] block">
                      DELIVERABLES:
                    </span>
                    <ul className="space-y-1.5 text-xs font-sans-clean text-[#D1C7B7]">
                      {svc.deliverables.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D1C7B7] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Quality Guarantees */}
        <div className="bg-[#141311] rounded-2xl text-[#F7F5F0] p-8 md:p-12 border border-[#D1C7B7]/25 space-y-8 shadow-xl">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-semibold block">
              EXECUTION CERTAINTY
            </span>
            <h2 className="font-serif-title text-3xl sm:text-5xl text-[#F7F5F0]">
              Why Leading Architectural Studios Partner With Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 text-xs font-sans-clean">
            <div className="p-4 bg-[#0D0C0A] rounded-xl border border-[#D1C7B7]/20 space-y-2">
              <span className="font-serif-title text-xl text-[#F7F5F0] block">
                Zero Warranty Splits
              </span>
              <p className="text-[#D1C7B7]/80 leading-relaxed">
                When Archzona executes, material warranties and installation guarantees are held under a single responsible entity.
              </p>
            </div>
            <div className="p-4 bg-[#0D0C0A] rounded-xl border border-[#D1C7B7]/20 space-y-2">
              <span className="font-serif-title text-xl text-[#F7F5F0] block">
                Pre-Engineered Sub-frames
              </span>
              <p className="text-[#D1C7B7]/80 leading-relaxed">
                We engineer and calculate aluminum and heavy-gauge galvanized steel joist spans specifically for your soil and deck loads.
              </p>
            </div>
            <div className="p-4 bg-[#0D0C0A] rounded-xl border border-[#D1C7B7]/20 space-y-2">
              <span className="font-serif-title text-xl text-[#F7F5F0] block">
                Laser Level Accuracy
              </span>
              <p className="text-[#D1C7B7]/80 leading-relaxed">
                Sub-millimeter site grading ensures zero pooling, clean shadow gaps, and flush transitions to stone or glass door tracks.
              </p>
            </div>
            <div className="p-4 bg-[#0D0C0A] rounded-xl border border-[#D1C7B7]/20 space-y-2">
              <span className="font-serif-title text-xl text-[#F7F5F0] block">
                Direct Factory Alliances
              </span>
              <p className="text-[#D1C7B7]/80 leading-relaxed">
                Authorized master distributor channels with Onduline, Quick-Step, NovaMix, and international WPC mills.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4 items-center">
            <button
              id="services-consultation-btn"
              onClick={onRequestConsultation}
              className="px-8 py-4 bg-[#F7F5F0] hover:bg-[#D1C7B7] text-[#0D0C0A] font-bold text-xs font-sans-clean tracking-[0.2em] uppercase rounded-xl transition-all cursor-pointer shadow-lg"
            >
              SCHEDULE A SITE CONSULTATION
            </button>
            <button
              onClick={() => onNavigate({ type: 'contact' })}
              className="px-8 py-4 bg-[#0D0C0A] border border-[#D1C7B7]/30 text-[#F7F5F0] text-xs font-sans-clean tracking-[0.2em] uppercase hover:border-[#D1C7B7] hover:bg-[#141311] rounded-xl transition-colors cursor-pointer"
            >
              SEND DRAWINGS FOR ESTIMATE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
