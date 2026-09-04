import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, FileText, Send, Building, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { useProjectCart } from '../context/ProjectCartContext';

interface ProjectCartDrawerProps {
  onRequestQuote: () => void;
}

export const ProjectCartDrawer: React.FC<ProjectCartDrawerProps> = ({ onRequestQuote }) => {
  const {
    cart,
    updateItem,
    removeItem,
    clearCart,
    updateProjectMeta,
    isCartOpen,
    setIsCartOpen,
    totalItemsCount,
  } = useProjectCart();

  const [isEditingMeta, setIsEditingMeta] = useState(false);

  if (!isCartOpen) return null;

  return (
    <div
      id="project-cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-[#0D0C0A]/85 backdrop-blur-md flex justify-end"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        id="project-cart-drawer-panel"
        className="bg-[#141311] border-l border-[#D1C7B7]/25 w-full max-w-xl h-full flex flex-col text-[#F7F5F0] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#D1C7B7]/20 bg-[#0D0C0A] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#D1C7B7] font-mono font-semibold">
                PROJECT MATERIAL SCHEDULE
              </span>
            </div>
            <h2 className="font-serif-title text-2xl text-[#F7F5F0]">
              MY PROJECT
            </h2>
          </div>
          <button
            id="close-project-cart-btn"
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-[#8C8273] hover:text-[#F7F5F0] rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close Project Schedule"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Context Summary / Meta Editor */}
        <div className="p-5 bg-[#0D0C0A]/60 border-b border-[#D1C7B7]/20 text-xs font-sans-clean space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] tracking-wider uppercase text-[#D1C7B7] font-semibold font-mono">
              PROJECT CONTEXT
            </span>
            <button
              id="edit-project-meta-toggle-btn"
              onClick={() => setIsEditingMeta(!isEditingMeta)}
              className="text-[#D1C7B7] hover:text-[#F7F5F0] underline cursor-pointer text-[11px] transition-colors font-mono"
            >
              {isEditingMeta ? 'Done Editing' : 'Edit Details'}
            </button>
          </div>

          {isEditingMeta ? (
            <div className="space-y-2.5 pt-1">
              <div>
                <label className="text-[10px] uppercase text-[#8C8273] block mb-1 font-mono">Project Name</label>
                <input
                  id="project-meta-name-input"
                  type="text"
                  value={cart.projectName}
                  onChange={(e) => updateProjectMeta({ projectName: e.target.value })}
                  placeholder="e.g. Poolside Villa Alibaug"
                  className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg px-3 py-1.5 text-[#F7F5F0] text-xs focus:outline-none focus:border-[#D1C7B7] placeholder-[#8C8273] transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase text-[#8C8273] block mb-1 font-mono">Location</label>
                  <input
                    id="project-meta-location-input"
                    type="text"
                    value={cart.projectLocation}
                    onChange={(e) => updateProjectMeta({ projectLocation: e.target.value })}
                    placeholder="e.g. Alibaug / Goa / Pune"
                    className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg px-3 py-1.5 text-[#F7F5F0] text-xs focus:outline-none focus:border-[#D1C7B7] placeholder-[#8C8273] transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-[#8C8273] block mb-1 font-mono">Approx. Size</label>
                  <input
                    id="project-meta-size-input"
                    type="text"
                    value={cart.projectSize}
                    onChange={(e) => updateProjectMeta({ projectSize: e.target.value })}
                    placeholder="e.g. 1,500 sq ft"
                    className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg px-3 py-1.5 text-[#F7F5F0] text-xs focus:outline-none focus:border-[#D1C7B7] placeholder-[#8C8273] transition-all"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 text-[#D1C7B7]">
              <div>
                <span className="text-[#8C8273] block text-[10px] uppercase font-mono">Project Name:</span>
                <span className="font-medium text-[#F7F5F0]">{cart.projectName || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-[#8C8273] block text-[10px] uppercase font-mono">Location:</span>
                <span className="font-medium text-[#F7F5F0]">{cart.projectLocation || 'Not specified'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[#8C8273] block text-[10px] uppercase font-mono">Approximate Size:</span>
                <span className="text-[#F7F5F0]">{cart.projectSize || 'To be determined'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Selected Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.items.length === 0 ? (
            <div className="py-24 text-center space-y-4">
              <FileText className="w-12 h-12 text-[#8C8273] mx-auto stroke-1" />
              <div className="space-y-1">
                <h3 className="font-serif-title text-2xl text-[#D1C7B7]">Your project schedule is empty.</h3>
                <p className="text-xs font-sans-clean text-[#8C8273] max-w-xs mx-auto">
                  Explore materials or browse the shop to add items to your project schedule.
                </p>
              </div>
            </div>
          ) : (
            cart.items.map((item) => (
              <div
                key={item.productId}
                id={`cart-item-${item.productId}`}
                className="p-4 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-xl space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-14 h-14 object-cover rounded-lg border border-[#D1C7B7]/15"
                    />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#D1C7B7] font-semibold font-mono">
                        {item.brand} • {item.material.toUpperCase()}
                      </span>
                      <h4 className="font-serif-title text-base text-[#F7F5F0] leading-snug">
                        {item.productName}
                      </h4>
                      <p className="text-[11px] text-[#8C8273] truncate max-w-[260px]">
                        {item.finish}
                      </p>
                    </div>
                  </div>
                  <button
                    id={`remove-cart-item-${item.productId}`}
                    onClick={() => removeItem(item.productId)}
                    className="text-[#8C8273] hover:text-rose-400 p-1 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantities, Area and Specific Notes */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#D1C7B7]/15 text-xs font-sans-clean">
                  <div>
                    <label className="text-[10px] uppercase text-[#8C8273] block mb-1 font-mono">Quantity (Units)</label>
                    <div className="flex items-center border border-[#D1C7B7]/20 rounded-lg overflow-hidden w-fit bg-[#141311]">
                      <button
                        onClick={() =>
                          updateItem(item.productId, { quantity: Math.max(1, item.quantity - 10) })
                        }
                        className="px-2 py-1 text-[#D1C7B7] hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(item.productId, { quantity: Math.max(1, parseInt(e.target.value) || 1) })
                        }
                        className="w-12 text-center bg-transparent text-xs text-[#F7F5F0] focus:outline-none"
                      />
                      <button
                        onClick={() =>
                          updateItem(item.productId, { quantity: item.quantity + 10 })
                        }
                        className="px-2 py-1 text-[#D1C7B7] hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-[#8C8273] block mb-1 font-mono">Approx. Area (Sq Ft)</label>
                    <input
                      type="number"
                      value={item.areaSqFt || ''}
                      onChange={(e) =>
                        updateItem(item.productId, { areaSqFt: parseInt(e.target.value) || 0 })
                      }
                      placeholder="e.g. 500"
                      className="w-full bg-[#141311] border border-[#D1C7B7]/20 rounded-lg px-2.5 py-1 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#D1C7B7] placeholder-[#8C8273] transition-all"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] uppercase text-[#8C8273] block mb-1 font-mono">Item Notes / Site Location</label>
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => updateItem(item.productId, { notes: e.target.value })}
                      placeholder="e.g. Sunken pool deck area, east elevation"
                      className="w-full bg-[#141311] border border-[#D1C7B7]/20 rounded-lg px-2.5 py-1 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#D1C7B7] placeholder-[#8C8273] transition-all"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Actions */}
        {cart.items.length > 0 && (
          <div className="p-6 bg-[#0D0C0A] border-t border-[#D1C7B7]/20 space-y-3">
            <div className="flex items-center justify-between text-xs font-sans-clean text-[#D1C7B7]">
              <span>Selected Products: {cart.items.length} items ({totalItemsCount} units)</span>
              <button
                onClick={clearCart}
                className="text-[#8C8273] hover:text-rose-400 underline cursor-pointer transition-colors font-mono"
              >
                Clear All
              </button>
            </div>

            <button
              id="proceed-to-quote-btn"
              onClick={() => {
                setIsCartOpen(false);
                onRequestQuote();
              }}
              className="w-full py-3.5 bg-[#F7F5F0] hover:bg-[#D1C7B7] text-[#0D0C0A] font-sans-clean font-bold text-xs uppercase tracking-[0.2em] rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg cursor-pointer"
            >
              <span>REQUEST PROJECT QUOTE</span>
              <Send className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center font-sans-clean text-[#8C8273]">
              Experience first. Quotation-led project workflow — no upfront payment required.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
