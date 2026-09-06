import React from 'react';
import { ArrowUpRight, Mail, Phone, MapPin, Download } from 'lucide-react';
import { ViewRoute } from '../types';
import {
  ARCHZONA_EMAIL,
  ARCHZONA_PHONE_NARESH,
  ARCHZONA_PHONE_HARISH,
  ARCHZONA_ADDRESS_LINE1,
  ARCHZONA_MAPS_URL,
} from '../utils/quoteWorkflow';

interface FooterProps {
  onNavigate: (route: ViewRoute) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  return (
    <footer id="main-footer" className="relative z-10 bg-[#0D0C0A] text-[#F7F5F0] border-t border-[#D1C7B7]/20 pt-20 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#D1C7B7]/15">
          {/* Main Brand Column (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex flex-col">
              <span className="font-serif-title text-4xl md:text-5xl font-light tracking-[0.25em] text-[#F7F5F0]">
                ARCHZONA
              </span>
              <span className="font-mono text-[10px] tracking-[0.38em] text-[#C5A880] uppercase mt-1 font-semibold">
                STRUCTURES
              </span>
            </div>
            <p className="text-sm font-sans-clean text-[#D1C7B7]/85 leading-relaxed max-w-md font-light">
              A digital architectural experience centre curated for contemporary spatial creation. We bridge tactile material selection, engineered structure development, bespoke fabrication, and turnkey execution.
            </p>
            <div className="pt-2 text-xs font-mono text-[#8C8273] space-y-1">
              <p>EXPERIENCE FIRST // COMMERCE FOLLOWS</p>
              <p>LAT: 19.2183° N // LNG: 72.9781° E // THANE, IN</p>
            </div>
          </div>

          {/* Navigation Column (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-bold">
              NAVIGATION MATRIX
            </h4>
            <ul className="space-y-2.5 font-sans-clean text-sm">
              <li>
                <button
                  id="footer-nav-explore"
                  onClick={() => onNavigate({ type: 'explore' })}
                  className="text-[#D1C7B7]/80 hover:text-[#F7F5F0] transition-colors cursor-pointer text-left"
                >
                  EXPLORE SPACES
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-materials"
                  onClick={() => onNavigate({ type: 'materials' })}
                  className="text-[#D1C7B7]/80 hover:text-[#F7F5F0] transition-colors cursor-pointer text-left"
                >
                  THE MATERIAL UNIVERSE
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-structures"
                  onClick={() => onNavigate({ type: 'structures' })}
                  className="text-[#D1C7B7]/80 hover:text-[#F7F5F0] transition-colors cursor-pointer text-left"
                >
                  STRUCTURES & CONFIGURATORS
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-services"
                  onClick={() => onNavigate({ type: 'services' })}
                  className="text-[#D1C7B7]/80 hover:text-[#F7F5F0] transition-colors cursor-pointer text-left"
                >
                  OUR PROCESS & SERVICES
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-blogs"
                  onClick={() => onNavigate({ type: 'blogs' })}
                  className="text-[#D1C7B7]/80 hover:text-[#F7F5F0] transition-colors cursor-pointer text-left"
                >
                  BLOGS & ARCHITECTURAL INSIGHTS
                </button>
              </li>
              <li>
                <a
                  id="footer-nav-catalogue-deck"
                  href="/Archzona_Product_Catalogue_Deck.pdf"
                  download="Archzona_Product_Catalogue_Deck.pdf"
                  className="text-[#D4AF37] font-semibold hover:text-[#F7F5F0] transition-colors cursor-pointer text-left inline-flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PRODUCT CATALOGUE DECK (PDF)</span>
                </a>
              </li>
              <li>
                <button
                  id="footer-nav-contact"
                  onClick={() => onNavigate({ type: 'contact' })}
                  className="text-[#D1C7B7]/80 hover:text-[#F7F5F0] transition-colors cursor-pointer text-left"
                >
                  CONTACT & START A PROJECT
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Column (4 cols) */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="text-[10px] uppercase tracking-[0.25em] text-[#D1C7B7] font-mono font-bold">
              COMMUNICATION BEACON
            </h4>
            <div className="space-y-3 font-sans-clean text-sm text-[#D1C7B7]">
              <a
                href={`tel:${ARCHZONA_PHONE_NARESH.replace(/\s+/g, '')}`}
                className="flex items-center space-x-3 hover:text-[#F7F5F0] transition-colors group p-2 rounded-lg hover:bg-[#141311] border border-transparent hover:border-[#D1C7B7]/20"
              >
                <Phone className="w-4 h-4 text-[#D1C7B7] group-hover:text-[#F7F5F0]" />
                <span className="font-mono">{ARCHZONA_PHONE_NARESH}</span>
                <span className="text-[10px] text-[#8C8273]">(Naresh K)</span>
              </a>
              <a
                href={`tel:${ARCHZONA_PHONE_HARISH.replace(/\s+/g, '')}`}
                className="flex items-center space-x-3 hover:text-[#F7F5F0] transition-colors group p-2 rounded-lg hover:bg-[#141311] border border-transparent hover:border-[#D1C7B7]/20"
              >
                <Phone className="w-4 h-4 text-[#D1C7B7] group-hover:text-[#F7F5F0]" />
                <span className="font-mono">{ARCHZONA_PHONE_HARISH}</span>
                <span className="text-[10px] text-[#8C8273]">(Harish K)</span>
              </a>
              <a
                href={`mailto:${ARCHZONA_EMAIL}`}
                className="flex items-center space-x-3 hover:text-[#F7F5F0] transition-colors group p-2 rounded-lg hover:bg-[#141311] border border-transparent hover:border-[#D1C7B7]/20"
              >
                <Mail className="w-4 h-4 text-[#D1C7B7] group-hover:text-[#F7F5F0]" />
                <span className="font-mono">{ARCHZONA_EMAIL}</span>
              </a>
              <div className="flex flex-col space-y-1.5 pt-1 px-2">
                <div className="flex items-start space-x-3 text-[#8C8273]">
                  <MapPin className="w-4 h-4 text-[#D1C7B7] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#D1C7B7]">
                    {ARCHZONA_ADDRESS_LINE1}, Thane, Maharashtra, India
                  </span>
                </div>
                <a
                  href={ARCHZONA_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#D1C7B7] hover:text-[#F7F5F0] transition-colors ml-7 pt-0.5"
                >
                  <span>Open in Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#D1C7B7]" />
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="footer-discuss-project-btn"
                onClick={() => onNavigate({ type: 'contact' })}
                className="inline-flex items-center space-x-2 bg-[#F7F5F0] text-[#0D0C0A] px-6 py-2.5 rounded-full text-xs uppercase tracking-[0.18em] font-sans-clean font-bold hover:bg-[#D1C7B7] transition-all cursor-pointer shadow-md"
              >
                <span>HAVE A SPACE IN MIND?</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#8C8273] gap-4">
          <p>© {new Date().getFullYear()} ARCHZONA STRUCTURES. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center space-x-3 text-[10px] tracking-widest uppercase">
            <span className="px-2.5 py-0.5 rounded-full border border-[#D1C7B7]/20 bg-[#141311] text-[#D1C7B7]">RESORTS</span>
            <span className="px-2.5 py-0.5 rounded-full border border-[#D1C7B7]/20 bg-[#141311] text-[#D1C7B7]">VILLAS</span>
            <span className="px-2.5 py-0.5 rounded-full border border-[#D1C7B7]/20 bg-[#141311] text-[#D1C7B7]">TERRACES</span>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-2.5 py-0.5 rounded-full border border-[#D1C7B7]/40 bg-[#141311] text-[#D1C7B7] hover:text-[#F7F5F0] hover:border-[#D1C7B7] transition-colors cursor-pointer"
              >
                OWNER PORTAL
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
