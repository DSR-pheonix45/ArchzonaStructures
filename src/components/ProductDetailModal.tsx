import React, { useState } from 'react';
import { X, Plus, Check, FileDown, ArrowRight, ShieldCheck, Layers, Building2 } from 'lucide-react';
import { Product, ViewRoute } from '../types';
import { useProjectCart } from '../context/ProjectCartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onNavigate: (route: ViewRoute) => void;
  onDiscussProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onNavigate,
  onDiscussProduct,
}) => {
  const { addItem, cart } = useProjectCart();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(50);
  const [areaSqFt, setAreaSqFt] = useState(250);
  const [itemNote, setItemNote] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const isAlreadyInCart = cart.items.some((i) => i.productId === product.id);

  const handleAdd = () => {
    addItem(product, quantity, areaSqFt, itemNote);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  return (
    <div
      id="product-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="product-detail-modal-container"
        className="glass-panel-deep border border-white/20 rounded-2xl w-full max-w-5xl text-slate-100 shadow-2xl relative my-8 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-[#D1C7B7]/20 bg-[#0D0C0A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#D1C7B7] font-mono font-semibold">
              SPECIFICATION SHEET
            </span>
            <span className="text-xs text-[#8C8273]">•</span>
            <span className="text-xs text-[#D1C7B7] font-mono">{product.availability}</span>
          </div>
          <button
            id="close-product-detail-btn"
            onClick={onClose}
            className="p-1.5 text-[#8C8273] hover:text-[#F7F5F0] rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-8 flex-1 bg-[#141311]">
          {/* Main 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Gallery Column (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="aspect-[4/3] bg-black/50 overflow-hidden rounded-xl border border-[#D1C7B7]/20">
                <img
                  src={product.images[selectedImageIdx] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover opacity-95"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`w-20 h-16 rounded-lg border transition-all overflow-hidden cursor-pointer ${
                        selectedImageIdx === idx
                          ? 'border-[#D1C7B7] ring-2 ring-[#D1C7B7]/40 opacity-100'
                          : 'border-[#D1C7B7]/20 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Core Info Column (5 cols) */}
            <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-sans-clean">
                  <span className="text-[#D1C7B7] uppercase tracking-wider font-semibold font-mono">
                    {product.brand}
                  </span>
                  <span className="text-[#8C8273]">•</span>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigate({ type: 'materials', materialSlug: product.material });
                    }}
                    className="text-[#D1C7B7] hover:text-[#F7F5F0] uppercase tracking-wider underline cursor-pointer transition-colors"
                  >
                    {product.material.toUpperCase()}
                  </button>
                </div>

                <h1 className="font-serif-title text-2xl md:text-3xl text-[#F7F5F0] leading-tight">
                  {product.name}
                </h1>

                <p className="text-xs font-sans-clean text-[#8C8273]">
                  Collection: <span className="text-[#D1C7B7]">{product.collection}</span>
                </p>

                <p className="text-sm font-sans-clean text-[#D1C7B7]/85 leading-relaxed pt-2">
                  {product.description}
                </p>
              </div>

              {/* Surface Finish & Dimensions pill */}
              <div className="p-4 bg-[#0D0C0A] rounded-xl border border-[#D1C7B7]/20 space-y-2 text-xs font-sans-clean shadow-md">
                <div>
                  <span className="text-[#D1C7B7] block text-[10px] uppercase font-mono">Finish & Texture:</span>
                  <span className="text-[#F7F5F0] font-medium">{product.finish}</span>
                </div>
                <div>
                  <span className="text-[#D1C7B7] block text-[10px] uppercase font-mono">Dimensions / Gauge:</span>
                  <span className="font-mono text-[#D1C7B7]/80">{product.dimensions}</span>
                </div>
              </div>

              {/* Add to Project Schedule Inputs */}
              <div className="p-4 bg-[#0D0C0A] rounded-xl border border-[#D1C7B7]/20 space-y-3 text-xs font-sans-clean shadow-md">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase text-[#8C8273] block mb-1 font-mono">
                      Required Quantity (Units)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-[#141311] border border-[#D1C7B7]/25 rounded-lg px-3 py-1.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#D1C7B7] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-[#8C8273] block mb-1 font-mono">
                      Approx Area (Sq Ft)
                    </label>
                    <input
                      type="number"
                      value={areaSqFt}
                      onChange={(e) => setAreaSqFt(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#141311] border border-[#D1C7B7]/25 rounded-lg px-3 py-1.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#D1C7B7] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-[#8C8273] block mb-1 font-mono">
                    Project Notes / Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={itemNote}
                    onChange={(e) => setItemNote(e.target.value)}
                    placeholder="e.g. Master balcony, seaside veranda"
                    className="w-full bg-[#141311] border border-[#D1C7B7]/25 rounded-lg px-3 py-1.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#D1C7B7] placeholder-[#8C8273] transition-all"
                  />
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    id="modal-add-to-project-btn"
                    onClick={handleAdd}
                    className="w-full py-3 bg-[#F7F5F0] hover:bg-[#D1C7B7] text-[#0D0C0A] font-bold rounded-xl shadow-lg transition-all font-sans-clean text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-950" />
                        <span>ADDED TO PROJECT SCHEDULE</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>ADD TO PROJECT</span>
                      </>
                    )}
                  </button>

                  <button
                    id="modal-discuss-product-btn"
                    onClick={() => {
                      onClose();
                      onDiscussProduct(product);
                    }}
                    className="w-full py-2.5 bg-transparent border border-[#D1C7B7]/30 hover:border-[#D1C7B7] text-[#D1C7B7] hover:text-[#F7F5F0] rounded-xl font-sans-clean text-xs uppercase tracking-[0.18em] transition-all cursor-pointer"
                  >
                    DISCUSS THIS PRODUCT WITH ARCHZONA
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Information & Specifications */}
          <div className="border-t border-[#D1C7B7]/20 pt-8 space-y-6">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold">
              TECHNICAL INFORMATION & APPLICATION MATRIX
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Specs Table */}
              <div className="bg-[#0D0C0A] rounded-xl border border-[#D1C7B7]/20 p-5 space-y-3 shadow-md">
                <span className="text-[11px] uppercase tracking-wider text-[#D1C7B7] font-semibold font-mono block border-b border-[#D1C7B7]/20 pb-2">
                  Engineered Specifications
                </span>
                <dl className="space-y-2 text-xs font-sans-clean">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1 border-b border-[#D1C7B7]/10">
                      <dt className="text-[#8C8273]">{key}</dt>
                      <dd className="text-[#F7F5F0] text-right font-medium">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Spatial Context & Applications */}
              <div className="space-y-4">
                <div className="bg-[#0D0C0A] rounded-xl border border-[#D1C7B7]/20 p-5 space-y-3 shadow-md">
                  <span className="text-[11px] uppercase tracking-wider text-[#D1C7B7] font-semibold font-mono block border-b border-[#D1C7B7]/20 pb-2">
                    Suitable Spaces & Environments
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {product.spaces.map((sp) => (
                      <button
                        key={sp}
                        onClick={() => {
                          onClose();
                          onNavigate({ type: 'explore', spaceSlug: sp });
                        }}
                        className="text-xs font-sans-clean px-2.5 py-1 rounded-lg bg-[#141311] border border-[#D1C7B7]/25 text-[#D1C7B7] hover:text-[#F7F5F0] hover:border-[#D1C7B7] transition-all cursor-pointer uppercase"
                      >
                        {sp}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0D0C0A] rounded-xl border border-[#D1C7B7]/20 p-5 space-y-3 shadow-md">
                  <span className="text-[11px] uppercase tracking-wider text-[#D1C7B7] font-semibold font-mono block border-b border-[#D1C7B7]/20 pb-2">
                    Architectural Applications
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {product.applications.map((app) => (
                      <span
                        key={app}
                        className="text-xs font-sans-clean px-2.5 py-1 rounded-lg bg-[#D1C7B7]/15 text-[#F7F5F0] border border-[#D1C7B7]/30"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Architectural Documents */}
            {product.documents && product.documents.length > 0 && (
              <div className="pt-2 space-y-3">
                <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold block">
                  ARCHITECTURAL DOCUMENTS & CAD DETAILS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-[#0D0C0A] rounded-xl border border-[#D1C7B7]/20 flex items-center justify-between text-xs font-sans-clean shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <FileDown className="w-4 h-4 text-[#D1C7B7]" />
                        <div>
                          <p className="text-[#F7F5F0] font-medium">{doc.title}</p>
                          <span className="text-[10px] text-[#8C8273]">
                            {doc.type} • {doc.size}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase text-[#D1C7B7] bg-[#D1C7B7]/15 border border-[#D1C7B7]/30 px-2.5 py-1 rounded-md font-mono">
                        Available on Request
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
