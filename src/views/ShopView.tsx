import React, { useState } from 'react';
import { Download, ArrowRight, Check, Sparkles, Package, Layers, ShieldCheck, FileText, Mail, ArrowUpRight } from 'lucide-react';
import { ViewRoute } from '../types';

interface ShopViewProps {
  onOpenProduct: (productSlug: string) => void;
  onNavigate: (route: ViewRoute) => void;
  onRequestQuote: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  onNavigate,
  onRequestQuote,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 800);
  };

  return (
    <div id="shop-view" className="text-[#F7F5F0] pt-28 pb-32 min-h-screen relative overflow-hidden bg-[#0D0C0A]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#D1C7B7]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-10 relative z-10 space-y-16">
        
        {/* Main Teaser Hero */}
        <div className="text-center space-y-6 max-w-3xl mx-auto pt-6">
          {/* Status Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-[11px] uppercase font-mono tracking-[0.25em] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>DIGITAL ARCHITECTURAL STORE // COMING SOON</span>
          </div>

          <h1 className="font-serif-title text-4xl sm:text-6xl text-[#F7F5F0] leading-[1.1] tracking-tight">
            ONLINE DIRECT MATERIAL PROCUREMENT IS COMING SOON.
          </h1>

          <p className="text-base sm:text-lg font-sans-clean text-[#D1C7B7]/85 leading-relaxed font-light">
            We are curating a direct online ordering portal for WPC decking & cladding, HPL compact laminates, Onduline roofing, tensile membranes, microcement systems, and timber acoustic panels with live warehouse inventory and trade pricing.
          </p>

          {/* Email Notification Form */}
          <div className="pt-4 max-w-lg mx-auto">
            {isSuccess ? (
              <div className="p-4 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center space-x-3 text-sm font-sans-clean font-semibold tracking-wide">
                <Check className="w-5 h-5 shrink-0" />
                <span>Thank you! You are on our launch notification list.</span>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#D1C7B7]/50" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email to get launch invitation & trade pricing..."
                    className="w-full bg-[#141311] border border-[#D1C7B7]/30 rounded-xl pl-11 pr-4 py-3.5 text-xs text-[#F7F5F0] placeholder-[#D1C7B7]/40 focus:outline-none focus:border-[#D4AF37] transition-all font-sans-clean"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3.5 bg-[#D4AF37] hover:bg-[#b8952b] text-[#0D0C0A] text-xs font-sans-clean font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shrink-0 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>JOINING...</span>
                  ) : (
                    <>
                      <span>NOTIFY ME AT LAUNCH</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Immediate Alternatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Action 1: Download Catalogue */}
          <div className="bg-[#141311] border border-[#D1C7B7]/20 rounded-2xl p-6 flex flex-col justify-between space-y-6 hover:border-[#D4AF37]/50 transition-all group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-serif-title text-xl text-[#F7F5F0]">Product Catalogue Deck</h3>
              <p className="text-xs font-sans-clean text-[#D1C7B7]/70 leading-relaxed font-light">
                Download the complete Archzona architectural material and structural specification manual (PDF, 2.5 MB).
              </p>
            </div>
            <a
              id="shop-coming-soon-download-deck-btn"
              href="/Archzona_Product_Catalogue_Deck.pdf"
              download="Archzona_Product_Catalogue_Deck.pdf"
              className="inline-flex items-center justify-between w-full px-4 py-3 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-xs uppercase font-sans-clean font-bold tracking-wider hover:bg-[#D4AF37] hover:text-[#0D0C0A] transition-all cursor-pointer"
            >
              <span>Download PDF Deck</span>
              <Download className="w-4 h-4" />
            </a>
          </div>

          {/* Action 2: Request Swatches & Quote */}
          <div className="bg-[#141311] border border-[#D1C7B7]/20 rounded-2xl p-6 flex flex-col justify-between space-y-6 hover:border-[#D4AF37]/50 transition-all group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFEAE2]/15 border border-[#EFEAE2]/30 text-[#EFEAE2] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-serif-title text-xl text-[#F7F5F0]">Request Swatches & Quote</h3>
              <p className="text-xs font-sans-clean text-[#D1C7B7]/70 leading-relaxed font-light">
                Get express material swatch box dispatches, CAD CAD CAD detailing, and consolidated project quotes today.
              </p>
            </div>
            <button
              id="shop-coming-soon-request-quote-btn"
              onClick={onRequestQuote}
              className="inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-[#F7F5F0] hover:bg-[#D1C7B7] text-[#0D0C0A] text-xs uppercase font-sans-clean font-bold tracking-wider transition-all cursor-pointer"
            >
              <span>Get Immediate Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Action 3: Explore Materials */}
          <div className="bg-[#141311] border border-[#D1C7B7]/20 rounded-2xl p-6 flex flex-col justify-between space-y-6 hover:border-[#D4AF37]/50 transition-all group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#D1C7B7]/15 border border-[#D1C7B7]/30 text-[#D1C7B7] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-serif-title text-xl text-[#F7F5F0]">Explore Material Systems</h3>
              <p className="text-xs font-sans-clean text-[#D1C7B7]/70 leading-relaxed font-light">
                Browse detailed technical specifications, characteristics, and application galleries for WPC, HPL, ACP, and Onduline.
              </p>
            </div>
            <button
              id="shop-coming-soon-explore-materials-btn"
              onClick={() => onNavigate({ type: 'materials' })}
              className="inline-flex items-center justify-between w-full px-4 py-3 rounded-xl border border-[#D1C7B7]/30 text-[#D1C7B7] hover:text-[#F7F5F0] hover:border-[#D1C7B7] text-xs uppercase font-sans-clean font-semibold tracking-wider transition-all cursor-pointer"
            >
              <span>View Materials</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Feature Teaser Cards Section */}
        <div className="border-t border-[#D1C7B7]/15 pt-14 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="font-serif-title text-2xl sm:text-3xl text-[#F7F5F0]">
              WHAT TO EXPECT FROM THE ONLINE STORE
            </h2>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#D1C7B7]/60">
              ENGINEERED FOR ARCHITECTS, DEVELOPERS & CONTRACTORS
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-[#141311]/60 border border-[#D1C7B7]/15 rounded-2xl p-6 space-y-3">
              <div className="text-xs font-mono text-[#D4AF37] font-semibold">01 // READY WAREHOUSE STOCK</div>
              <h4 className="font-serif-title text-lg text-[#F7F5F0]">Real-Time Stock Checks</h4>
              <p className="text-xs font-sans-clean text-[#D1C7B7]/70 leading-relaxed font-light">
                Check exact available stock quantities and sheet counts in our Thane warehouse before ordering.
              </p>
            </div>

            <div className="bg-[#141311]/60 border border-[#D1C7B7]/15 rounded-2xl p-6 space-y-3">
              <div className="text-xs font-mono text-[#D4AF37] font-semibold">02 // 3D MODELS & CAD FILES</div>
              <h4 className="font-serif-title text-lg text-[#F7F5F0]">Download 3D & CAD Files</h4>
              <p className="text-xs font-sans-clean text-[#D1C7B7]/70 leading-relaxed font-light">
                Download ready-to-use 3D building models (BIM / Revit) and CAD drawings directly into your architectural plans.
              </p>
            </div>

            <div className="bg-[#141311]/60 border border-[#D1C7B7]/15 rounded-2xl p-6 space-y-3">
              <div className="text-xs font-mono text-[#D4AF37] font-semibold">03 // ARCHITECT DISCOUNTS</div>
              <h4 className="font-serif-title text-lg text-[#F7F5F0]">Wholesale Trade Pricing</h4>
              <p className="text-xs font-sans-clean text-[#D1C7B7]/70 leading-relaxed font-light">
                Registered architects, interior studios, and contractors get special bulk trade discounts automatically.
              </p>
            </div>

            <div className="bg-[#141311]/60 border border-[#D1C7B7]/15 rounded-2xl p-6 space-y-3">
              <div className="text-xs font-mono text-[#D4AF37] font-semibold">04 // FREE MATERIAL SAMPLES</div>
              <h4 className="font-serif-title text-lg text-[#F7F5F0]">Fast Sample Delivery</h4>
              <p className="text-xs font-sans-clean text-[#D1C7B7]/70 leading-relaxed font-light">
                Order real physical material samples (WPC, HPL, ACP) delivered directly to your office or home in 48 hours.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
