import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Download } from 'lucide-react';
import { ViewRoute } from '../types';

interface NavbarProps {
  currentRoute: ViewRoute;
  onNavigate: (route: ViewRoute) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate, onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (type: string) => currentRoute.type === type;

  const navLinks = [
    { label: 'EXPLORE', route: { type: 'explore' as const } },
    { label: 'MATERIALS', route: { type: 'materials' as const } },
    { label: 'STRUCTURES', route: { type: 'structures' as const } },
    { label: 'SERVICES', route: { type: 'services' as const } },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b ${
        isScrolled
          ? 'bg-[#0D0C0A]/90 backdrop-blur-md border-[#D1C7B7]/20 py-3 shadow-2xl'
          : 'bg-[#0D0C0A]/40 backdrop-blur-sm border-transparent py-5'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <button
          id="nav-brand-logo-btn"
          onClick={() => onNavigate({ type: 'home' })}
          className="flex items-center gap-3 text-left group cursor-pointer shrink-0"
        >
          <img
            src="/logo.png?v=1"
            alt="Archzona Logo"
            className="w-8 h-8 object-contain shrink-0 group-hover:scale-110 transition-transform duration-300"
          />
          <div className="flex flex-col">
            <span className="font-serif-title text-2xl sm:text-3xl font-light tracking-[0.25em] text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors">
              ARCHZONA
            </span>
            <span className="font-mono text-[9px] tracking-[0.38em] text-[#C5A880] uppercase -mt-1 font-semibold">
              STRUCTURES
            </span>
          </div>
        </button>

        {/* Primary Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navLinks.map((link) => {
            const active = isActive(link.route.type);
            return (
              <button
                key={link.label}
                id={`nav-link-${link.label.toLowerCase()}`}
                onClick={() => onNavigate(link.route)}
                className={`text-xs uppercase tracking-[0.2em] font-sans-clean transition-all cursor-pointer relative py-1 ${
                  active
                    ? 'text-[#F7F5F0] font-semibold'
                    : 'text-[#D1C7B7]/75 hover:text-[#F7F5F0]'
                }`}
              >
                <span>{link.label}</span>
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#D1C7B7] rounded-full animate-fadeIn" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Items: [SEARCH] [ CATALOGUE DECK ] [ SHOP ] [ CONTACT ] */}
        <div className="flex items-center space-x-3">
          {/* Universal Search Trigger */}
          <button
            id="nav-search-btn"
            onClick={onOpenSearch}
            className="p-2 text-[#D1C7B7]/80 hover:text-[#F7F5F0] hover:bg-white/5 rounded-full border border-[#D1C7B7]/20 hover:border-[#D1C7B7] transition-all cursor-pointer"
            title="Search spaces, materials, structures, products"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* CATALOGUE DECK Direct Download Button */}
          <a
            id="nav-catalogue-deck-btn"
            href="/Archzona_Product_Catalogue_Deck.pdf"
            download="Archzona_Product_Catalogue_Deck.pdf"
            className="hidden xl:inline-flex items-center space-x-1.5 text-[11px] uppercase tracking-[0.18em] px-4 py-2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D0C0A] transition-all cursor-pointer font-sans-clean font-bold shadow-sm"
            title="Download Official Archzona Product Catalogue Deck PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>DOWNLOAD CATALOGUE</span>
          </a>

          {/* SHOP Button */}
          <button
            id="nav-shop-btn"
            onClick={() => onNavigate({ type: 'shop' })}
            className={`flex items-center text-[11px] uppercase tracking-[0.18em] px-4 py-2 rounded-full border transition-all cursor-pointer font-sans-clean ${
              isActive('shop')
                ? 'border-[#D1C7B7] bg-[#D1C7B7]/20 text-[#F7F5F0] font-semibold'
                : 'border-[#D1C7B7]/25 bg-white/5 text-[#D1C7B7] hover:text-[#F7F5F0] hover:border-[#D1C7B7]'
            }`}
          >
            <span>SHOP</span>
          </button>

          {/* CONTACT Button */}
          <button
            id="nav-contact-btn"
            onClick={() => onNavigate({ type: 'contact' })}
            className={`hidden sm:inline-flex items-center space-x-1.5 text-[11px] uppercase tracking-[0.18em] px-4 py-2 rounded-full font-sans-clean transition-all cursor-pointer ${
              isActive('contact')
                ? 'bg-[#EFEAE2] text-[#0D0C0A] font-bold'
                : 'bg-[#F7F5F0] text-[#0D0C0A] font-bold hover:bg-[#D1C7B7]'
            }`}
          >
            <span>CONTACT</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#D1C7B7] hover:text-[#F7F5F0] focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden bg-[#0D0C0A]/95 backdrop-blur-2xl border-b border-[#D1C7B7]/20 px-6 py-8 space-y-6 animate-fadeIn"
        >
          <div className="space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                id={`mobile-nav-${link.label.toLowerCase()}`}
                onClick={() => {
                  onNavigate(link.route);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left font-serif-title text-2xl tracking-wide py-2.5 px-3 rounded-lg transition-colors ${
                  isActive(link.route.type) ? 'text-[#F7F5F0] bg-[#D1C7B7]/15 border border-[#D1C7B7]/40' : 'text-[#D1C7B7]/70 hover:text-[#F7F5F0]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-[#D1C7B7]/15 flex flex-col space-y-3">
            <a
              id="mobile-nav-catalogue-deck-btn"
              href="/Archzona_Product_Catalogue_Deck.pdf"
              download="Archzona_Product_Catalogue_Deck.pdf"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-full border border-[#D4AF37]/50 text-xs tracking-[0.2em] uppercase font-sans-clean text-[#0D0C0A] bg-[#D4AF37] font-bold flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD CATALOGUE DECK (PDF)</span>
            </a>

            <button
              id="mobile-nav-shop-btn"
              onClick={() => {
                onNavigate({ type: 'shop' });
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-3 rounded-full border border-[#D4AF37]/40 text-xs tracking-[0.2em] uppercase font-sans-clean text-[#D4AF37] bg-[#D4AF37]/10 flex items-center justify-center space-x-2 font-semibold"
            >
              <span>SHOP (COMING SOON)</span>
            </button>

            <button
              id="mobile-nav-contact-btn"
              onClick={() => {
                onNavigate({ type: 'contact' });
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-3 rounded-full bg-[#F7F5F0] text-[#0D0C0A] text-xs tracking-[0.2em] uppercase font-sans-clean font-bold hover:bg-[#D1C7B7]"
            >
              START A PROJECT
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
