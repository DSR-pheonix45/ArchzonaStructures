import React, { useState, useMemo } from 'react';
import { Filter, X, Plus, Check, Search, ArrowUpRight, FileText, Sparkles, Building2, Layers } from 'lucide-react';
import { productsData } from '../data/products';
import { spacesData } from '../data/spaces';
import { materialsData } from '../data/materials';
import { Product, ViewRoute } from '../types';
import { useProjectCart } from '../context/ProjectCartContext';

interface ShopViewProps {
  onOpenProduct: (productSlug: string) => void;
  onNavigate: (route: ViewRoute) => void;
  onRequestQuote: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  onOpenProduct,
  onNavigate,
  onRequestQuote,
}) => {
  const { addItem, cart, setIsCartOpen, totalItemsCount } = useProjectCart();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [selectedSpace, setSelectedSpace] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Quick feedback for added items
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Extract unique filter lists
  const allMaterials = useMemo(() => {
    return ['All', ...Array.from(new Set(productsData.map((p) => p.material)))];
  }, []);

  const allBrands = useMemo(() => {
    return ['All', ...Array.from(new Set(productsData.map((p) => p.brand)))];
  }, []);

  const allSpaces = useMemo(() => {
    return ['All', ...Array.from(new Set(spacesData.map((s) => s.slug)))];
  }, []);

  const filteredProducts = useMemo(() => {
    return productsData.filter((p) => {
      const matchSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.finish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase());

      const matchMaterial =
        selectedMaterial === 'All' || p.material.toLowerCase() === selectedMaterial.toLowerCase();

      const matchSpace =
        selectedSpace === 'All' || p.spaces.some((s) => s.toLowerCase() === selectedSpace.toLowerCase());

      const matchBrand =
        selectedBrand === 'All' || p.brand.toLowerCase() === selectedBrand.toLowerCase();

      return matchSearch && matchMaterial && matchSpace && matchBrand;
    });
  }, [searchQuery, selectedMaterial, selectedSpace, selectedBrand]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 50, 200, 'Direct catalog selection');
    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 1800);
  };

  const hasActiveFilters =
    selectedMaterial !== 'All' ||
    selectedSpace !== 'All' ||
    selectedBrand !== 'All' ||
    searchQuery !== '';

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedMaterial('All');
    setSelectedSpace('All');
    setSelectedBrand('All');
    setSelectedCategory('All');
  };

  return (
    <div id="shop-view" className="text-[#F7F5F0] pt-28 pb-32 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-12">
        {/* Shop Header & Architectural Statement */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D1C7B7]/20 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D1C7B7]/30 bg-[#141311] text-[10px] uppercase font-mono tracking-[0.25em] text-[#D1C7B7]">
              <span className="w-2 h-2 rounded-full bg-[#D1C7B7]" />
              ARCHITECTURAL MATERIAL CATALOGUE
            </div>
            <h1 className="font-serif-title text-4xl sm:text-6xl text-[#F7F5F0]">
              SHOP SPECIFICATIONS.
            </h1>
            <p className="text-sm sm:text-base font-sans-clean text-[#D1C7B7]/85 max-w-2xl leading-relaxed font-light">
              Add products directly to your Project Schedule (My Project). When your specifications are ready, request a consolidated project quote for pricing, batch availability, and turnkey installation.
            </p>
          </div>

          {/* Project Schedule Floating trigger */}
          <div className="bg-[#141311] rounded-2xl border border-[#D1C7B7]/25 p-4 shrink-0 flex items-center gap-4 shadow-xl">
            <div>
              <span className="text-[10px] uppercase font-mono text-[#D1C7B7] block">
                MY PROJECT SCHEDULE
              </span>
              <span className="font-serif-title text-xl text-[#F7F5F0]">
                {cart.items.length} Products ({totalItemsCount} Units)
              </span>
            </div>
            <button
              id="shop-view-open-schedule-btn"
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2.5 bg-[#F7F5F0] hover:bg-[#D1C7B7] text-[#0D0C0A] text-xs font-sans-clean font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
            >
              Open Schedule
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 p-6 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search within catalog */}
            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-[#D1C7B7] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="shop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, finish, material..."
                className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/25 pl-10 pr-4 py-2 text-xs font-sans-clean text-[#F7F5F0] placeholder-[#8C8273] rounded-lg focus:outline-none focus:border-[#D1C7B7] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8273] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto text-xs font-sans-clean">
              {/* Material filter */}
              <div className="flex items-center gap-2">
                <span className="text-[#8C8273] uppercase text-[10px] font-mono">Material:</span>
                <select
                  id="shop-material-filter"
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="bg-[#0D0C0A] border border-[#D1C7B7]/25 text-[#F7F5F0] px-3 py-1.5 uppercase font-medium rounded-lg focus:outline-none focus:border-[#D1C7B7]"
                >
                  {allMaterials.map((m) => (
                    <option key={m} value={m} className="bg-[#0D0C0A] text-[#F7F5F0]">
                      {m.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Space filter */}
              <div className="flex items-center gap-2">
                <span className="text-[#8C8273] uppercase text-[10px] font-mono">Space:</span>
                <select
                  id="shop-space-filter"
                  value={selectedSpace}
                  onChange={(e) => setSelectedSpace(e.target.value)}
                  className="bg-[#0D0C0A] border border-[#D1C7B7]/25 text-[#F7F5F0] px-3 py-1.5 uppercase font-medium rounded-lg focus:outline-none focus:border-[#D1C7B7]"
                >
                  {allSpaces.map((s) => (
                    <option key={s} value={s} className="bg-[#0D0C0A] text-[#F7F5F0]">
                      {s.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand filter */}
              <div className="flex items-center gap-2">
                <span className="text-[#8C8273] uppercase text-[10px] font-mono">Brand:</span>
                <select
                  id="shop-brand-filter"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="bg-[#0D0C0A] border border-[#D1C7B7]/25 text-[#F7F5F0] px-3 py-1.5 uppercase font-medium rounded-lg focus:outline-none focus:border-[#D1C7B7]"
                >
                  {allBrands.map((b) => (
                    <option key={b} value={b} className="bg-[#0D0C0A] text-[#F7F5F0]">
                      {b.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  id="shop-clear-filters-btn"
                  onClick={clearAllFilters}
                  className="text-xs text-[#D1C7B7] hover:text-[#F7F5F0] underline cursor-pointer ml-auto lg:ml-2"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-sans-clean text-[#8C8273]">
          <span>
            Showing <strong className="text-[#F7F5F0]">{filteredProducts.length}</strong> architectural products
          </span>
          <span className="text-[11px] uppercase tracking-wider text-[#D1C7B7] font-mono">
            All items available for consolidated project quotation
          </span>
        </div>

        {/* Product Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-24 text-center space-y-4 border border-[#D1C7B7]/20 bg-[#141311] rounded-2xl">
            <p className="font-serif-title text-3xl text-[#F7F5F0]">No materials match this filter.</p>
            <p className="text-xs font-sans-clean text-[#8C8273]">
              Try resetting filters or searching with different parameters.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 bg-[#F7F5F0] text-[#0D0C0A] font-bold rounded-lg text-xs uppercase tracking-wider font-sans-clean cursor-pointer hover:bg-[#D1C7B7] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isInSchedule = cart.items.some((i) => i.productId === product.id);
              const isJustAdded = recentlyAddedId === product.id;

              return (
                <div
                  key={product.id}
                  id={`product-grid-card-${product.id}`}
                  onClick={() => onOpenProduct(product.slug)}
                  className="bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 p-5 flex flex-col justify-between group cursor-pointer hover:border-[#D1C7B7]/60 transition-all shadow-md"
                >
                  <div className="space-y-4">
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-black/40 border border-[#D1C7B7]/15 relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[#D1C7B7] text-[9px] font-mono uppercase border border-[#D1C7B7]/20">
                        {product.availability}
                      </span>
                    </div>

                    {/* Metadata & Names */}
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#D1C7B7] uppercase">
                        <span>{product.brand}</span>
                        <span>{product.material}</span>
                      </div>
                      <h3 className="font-serif-title text-xl text-[#F7F5F0] group-hover:text-[#D1C7B7] transition-colors mt-1 leading-snug">
                        {product.name}
                      </h3>
                    </div>

                    {/* Finish & Specs */}
                    <div className="space-y-1 text-xs font-sans-clean text-[#8C8273]">
                      <p className="line-clamp-1">
                        <strong className="text-[#D1C7B7]">Finish:</strong> {product.finish}
                      </p>
                      <p className="line-clamp-1 font-mono text-[11px]">
                        <strong className="text-[#D1C7B7]">Dims:</strong> {product.dimensions}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-5 mt-4 border-t border-[#D1C7B7]/15 space-y-2">
                    <button
                      id={`quick-add-btn-${product.id}`}
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={`w-full py-2.5 text-xs font-sans-clean font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        isJustAdded
                          ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
                          : isInSchedule
                          ? 'bg-[#EFEAE2]/15 border border-[#D1C7B7]/40 text-[#F7F5F0]'
                          : 'bg-[#F7F5F0] hover:bg-[#D1C7B7] text-[#0D0C0A]'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>ADDED TO SCHEDULE</span>
                        </>
                      ) : isInSchedule ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>IN SCHEDULE (+ADD MORE)</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD TO PROJECT</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onOpenProduct(product.slug)}
                      className="w-full text-center text-xs text-[#8C8273] hover:text-[#F7F5F0] underline font-sans-clean cursor-pointer py-1"
                    >
                      VIEW SPEC SHEET & CAD
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
