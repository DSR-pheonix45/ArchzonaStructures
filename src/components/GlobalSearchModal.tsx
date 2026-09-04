import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Layers, Sparkles, Building2, Box } from 'lucide-react';
import { spacesData } from '../data/spaces';
import { materialsData } from '../data/materials';
import { structuresData } from '../data/structures';
import { productsData } from '../data/products';
import { ViewRoute } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: ViewRoute) => void;
  onOpenProduct: (productSlug: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenProduct,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) {
      return {
        spaces: spacesData.slice(0, 4),
        materials: materialsData.slice(0, 4),
        structures: structuresData.slice(0, 3),
        products: productsData.slice(0, 4),
        isEmptyQuery: true,
      };
    }

    const matchedSpaces = spacesData.filter(
      (s) =>
        s.name.toLowerCase().includes(clean) ||
        s.description.toLowerCase().includes(clean) ||
        s.applications.some((a) => a.toLowerCase().includes(clean))
    );

    const matchedMaterials = materialsData.filter(
      (m) =>
        m.name.toLowerCase().includes(clean) ||
        m.category.toLowerCase().includes(clean) ||
        m.whereItWorks.some((w) => w.toLowerCase().includes(clean)) ||
        m.description.toLowerCase().includes(clean)
    );

    const matchedStructures = structuresData.filter(
      (st) =>
        st.name.toLowerCase().includes(clean) ||
        st.type.toLowerCase().includes(clean) ||
        st.description.toLowerCase().includes(clean)
    );

    const matchedProducts = productsData.filter(
      (p) =>
        p.name.toLowerCase().includes(clean) ||
        p.brand.toLowerCase().includes(clean) ||
        p.material.toLowerCase().includes(clean) ||
        p.applications.some((a) => a.toLowerCase().includes(clean)) ||
        p.spaces.some((s) => s.toLowerCase().includes(clean)) ||
        p.finish.toLowerCase().includes(clean)
    );

    return {
      spaces: matchedSpaces,
      materials: matchedMaterials,
      structures: matchedStructures,
      products: matchedProducts,
      isEmptyQuery: false,
    };
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    searchResults.spaces.length +
    searchResults.materials.length +
    searchResults.structures.length +
    searchResults.products.length;

  return (
    <div
      id="global-search-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#0D0C0A]/85 backdrop-blur-md flex items-start justify-center pt-16 md:pt-24 px-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="global-search-modal-container"
        className="bg-[#141311] border border-[#D1C7B7]/25 rounded-2xl w-full max-w-4xl text-[#F7F5F0] shadow-2xl relative mb-16 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-6 border-b border-[#D1C7B7]/20 flex items-center gap-4 bg-[#0D0C0A]">
          <Search className="w-5 h-5 text-[#D1C7B7]" />
          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search spaces (e.g. pool, villa), materials (WPC, HPL, roofing), structures or products..."
            className="w-full bg-transparent text-lg md:text-xl font-sans-clean text-[#F7F5F0] placeholder-[#8C8273] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#8C8273] hover:text-[#F7F5F0] p-1 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-widest text-[#8C8273] hover:text-[#F7F5F0] px-2.5 py-1 rounded-lg border border-[#D1C7B7]/20 cursor-pointer hidden sm:block font-mono transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Search Results Area */}
        <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto space-y-8">
          {searchResults.isEmptyQuery && (
            <div className="text-xs tracking-[0.2em] uppercase text-[#D1C7B7] font-mono flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D1C7B7]" />
              <span>EXPLORE SUGGESTIONS & FREQUENT ARCHITECTURAL INQUIRIES</span>
            </div>
          )}

          {!searchResults.isEmptyQuery && totalResults === 0 && (
            <div className="py-16 text-center space-y-3">
              <p className="font-serif-title text-2xl text-[#F7F5F0]">We couldn't find that material or space.</p>
              <p className="text-sm font-sans-clean text-[#8C8273]">
                Try searching for "pool", "villa", "wpc", "pergola", "onduline", or "terrazzo".
              </p>
            </div>
          )}

          {/* SPACES RESULTS */}
          {searchResults.spaces.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#D1C7B7]/20 pb-2">
                <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" /> SPACES ({searchResults.spaces.length})
                </span>
                <button
                  onClick={() => {
                    onNavigate({ type: 'explore' });
                    onClose();
                  }}
                  className="text-[11px] text-[#8C8273] hover:text-[#F7F5F0] uppercase tracking-wider font-mono cursor-pointer transition-colors"
                >
                  View All Spaces →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.spaces.map((space) => (
                  <button
                    key={space.id}
                    id={`search-result-space-${space.slug}`}
                    onClick={() => {
                      onNavigate({ type: 'explore', spaceSlug: space.slug });
                      onClose();
                    }}
                    className="flex items-center gap-4 p-3 bg-[#0D0C0A] hover:border-[#D1C7B7]/60 border border-[#D1C7B7]/20 rounded-xl transition-all text-left group cursor-pointer shadow-sm"
                  >
                    <img
                      src={space.heroImage}
                      alt={space.name}
                      className="w-16 h-12 object-cover shrink-0 rounded-lg border border-[#D1C7B7]/15"
                    />
                    <div className="min-w-0">
                      <div className="font-serif-title text-lg text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors truncate">
                        {space.name}
                      </div>
                      <p className="text-xs font-sans-clean text-[#8C8273] truncate">
                        {space.applications.slice(0, 3).join(' • ')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MATERIALS RESULTS */}
          {searchResults.materials.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#D1C7B7]/20 pb-2">
                <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" /> MATERIALS ({searchResults.materials.length})
                </span>
                <button
                  onClick={() => {
                    onNavigate({ type: 'materials' });
                    onClose();
                  }}
                  className="text-[11px] text-[#8C8273] hover:text-[#F7F5F0] uppercase tracking-wider font-mono cursor-pointer transition-colors"
                >
                  View All Materials →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.materials.map((mat) => (
                  <button
                    key={mat.id}
                    id={`search-result-material-${mat.slug}`}
                    onClick={() => {
                      onNavigate({ type: 'materials', materialSlug: mat.slug });
                      onClose();
                    }}
                    className="flex items-center gap-4 p-3 bg-[#0D0C0A] hover:border-[#D1C7B7]/60 border border-[#D1C7B7]/20 rounded-xl transition-all text-left group cursor-pointer shadow-sm"
                  >
                    <img
                      src={mat.heroImage}
                      alt={mat.name}
                      className="w-16 h-12 object-cover shrink-0 rounded-lg border border-[#D1C7B7]/15"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] tracking-wider uppercase text-[#D1C7B7] font-mono block">
                        {mat.category}
                      </span>
                      <div className="font-serif-title text-base text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors truncate">
                        {mat.name}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STRUCTURES RESULTS */}
          {searchResults.structures.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#D1C7B7]/20 pb-2">
                <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold flex items-center gap-2">
                  <Box className="w-3.5 h-3.5" /> STRUCTURES ({searchResults.structures.length})
                </span>
                <button
                  onClick={() => {
                    onNavigate({ type: 'structures' });
                    onClose();
                  }}
                  className="text-[11px] text-[#8C8273] hover:text-[#F7F5F0] uppercase tracking-wider font-mono cursor-pointer transition-colors"
                >
                  View Structures →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.structures.map((st) => (
                  <button
                    key={st.id}
                    id={`search-result-structure-${st.slug}`}
                    onClick={() => {
                      onNavigate({ type: 'structures', structureSlug: st.slug });
                      onClose();
                    }}
                    className="flex items-center gap-4 p-3 bg-[#0D0C0A] hover:border-[#D1C7B7]/60 border border-[#D1C7B7]/20 rounded-xl transition-all text-left group cursor-pointer shadow-sm"
                  >
                    <img
                      src={st.heroImage}
                      alt={st.name}
                      className="w-16 h-12 object-cover shrink-0 rounded-lg border border-[#D1C7B7]/15"
                    />
                    <div className="min-w-0">
                      <div className="font-serif-title text-base text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors truncate">
                        {st.name}
                      </div>
                      <p className="text-xs font-sans-clean text-[#8C8273] truncate">
                        Interactive Configurator Available
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS RESULTS */}
          {searchResults.products.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#D1C7B7]/20 pb-2">
                <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold flex items-center gap-2">
                  <Box className="w-3.5 h-3.5" /> PRODUCTS / SKUs ({searchResults.products.length})
                </span>
                <button
                  onClick={() => {
                    onNavigate({ type: 'shop' });
                    onClose();
                  }}
                  className="text-[11px] text-[#8C8273] hover:text-[#F7F5F0] uppercase tracking-wider font-mono cursor-pointer transition-colors"
                >
                  View All Products →
                </button>
              </div>
              <div className="space-y-2">
                {searchResults.products.map((prod) => (
                  <button
                    key={prod.id}
                    id={`search-result-product-${prod.id}`}
                    onClick={() => {
                      onOpenProduct(prod.slug);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 bg-[#0D0C0A] hover:border-[#D1C7B7]/60 border border-[#D1C7B7]/20 rounded-xl transition-all text-left group cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-12 h-12 object-cover shrink-0 rounded-lg border border-[#D1C7B7]/15"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-sans-clean font-medium text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors truncate">
                          {prod.name}
                        </div>
                        <div className="text-xs text-[#8C8273] font-sans-clean">
                          {prod.brand} • {prod.material.toUpperCase()} • {prod.availability}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8C8273] group-hover:text-[#F7F5F0] shrink-0 ml-4 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
