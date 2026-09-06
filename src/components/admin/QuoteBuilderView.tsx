import React, { useState } from 'react';
import { Plus, Trash2, Save, Download, FileText, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';
import { Quotation, QuoteItem, ClientDetails } from '../../types/adminTypes';
import { productsData } from '../../data/products';
import { saveQuotation, generateNextQuoteId, getOwnerProfile } from '../../utils/adminStorage';
import { downloadQuotationPDF } from '../../utils/pdfGenerator';

interface QuoteBuilderViewProps {
  initialQuote?: Quotation | null;
  onBack: () => void;
  onSaved: () => void;
}

export const QuoteBuilderView: React.FC<QuoteBuilderViewProps> = ({ initialQuote, onBack, onSaved }) => {
  const isEditing = !!initialQuote;

  const [quoteId] = useState(initialQuote ? initialQuote.id : generateNextQuoteId());
  const [date, setDate] = useState(initialQuote ? initialQuote.date : new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(() => {
    if (initialQuote) return initialQuote.validUntil;
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });

  // Client Details State
  const [client, setClient] = useState<ClientDetails>(initialQuote?.client || {
    name: '',
    companyName: '',
    email: '',
    phone: '',
    gstin: '',
    billingAddress: '',
    shippingAddress: '',
    projectName: '',
    projectLocation: '',
  });

  // Line Items State
  const [items, setItems] = useState<QuoteItem[]>(initialQuote?.items || [
    {
      id: `item-${Date.now()}-1`,
      productId: productsData[0]?.id,
      name: productsData[0]?.name || 'Bioclimatic Motorized Pergola System',
      description: 'Powder-coated architectural aluminium pergola with motorized weather-sensing louvers and integrated warm LED strip lighting.',
      unit: 'Sq. Ft.',
      quantity: 350,
      unitRate: 1750,
      discountPercent: 0,
      netAmount: 350 * 1750,
    },
  ]);

  const [overallDiscountPercent, setOverallDiscountPercent] = useState<number>(initialQuote?.overallDiscountPercent || 0);
  const [notes, setNotes] = useState(initialQuote?.notes || 'Quotation valid for 30 days from issue date. Subject to site dimension verification. Includes standard 5-Year Structural Warranty.');
  const [paymentTerms, setPaymentTerms] = useState(initialQuote?.paymentTerms || '50% Advance on Purchase Order | 40% On Dispatch of Materials | 10% Post Handover Commissioning');
  const [status, setStatus] = useState<Quotation['status']>(initialQuote?.status || 'draft');

  // Selected catalog item shortcut
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>('');

  // Auto Calculations
  const calculateItemNet = (qty: number, rate: number, disc: number) => {
    const gross = qty * rate;
    const discAmt = gross * (disc / 100);
    return Math.round((gross - discAmt) * 100) / 100;
  };

  const handleItemChange = (index: number, field: keyof QuoteItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };

    if (field === 'quantity' || field === 'unitRate' || field === 'discountPercent') {
      item.netAmount = calculateItemNet(
        Number(field === 'quantity' ? value : item.quantity),
        Number(field === 'unitRate' ? value : item.unitRate),
        Number(field === 'discountPercent' ? value : item.discountPercent)
      );
    }

    updated[index] = item;
    setItems(updated);
  };

  const handleAddCatalogItem = (prodId: string) => {
    if (!prodId) return;
    const found = productsData.find((p) => p.id === prodId);
    if (!found) return;

    const newItem: QuoteItem = {
      id: `item-${Date.now()}-${items.length + 1}`,
      productId: found.id,
      name: `${found.name} (${found.brand})`,
      description: `${found.description.slice(0, 140)}... Finish: ${found.finish}`,
      unit: 'Sq. Ft.',
      quantity: 100,
      unitRate: 850,
      discountPercent: 0,
      netAmount: 85000,
    };

    setItems([...items, newItem]);
    setSelectedCatalogId('');
  };

  const handleAddCustomItem = () => {
    const newItem: QuoteItem = {
      id: `item-${Date.now()}-${items.length + 1}`,
      name: 'Custom Architectural Component / Service',
      description: 'Detailed specifications and structural parameters as agreed.',
      unit: 'Lump Sum',
      quantity: 1,
      unitRate: 25000,
      discountPercent: 0,
      netAmount: 25000,
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Pre-tax Totals Calculation
  const subtotal = items.reduce((sum, item) => sum + item.netAmount, 0);
  const overallDiscountAmount = Math.round(subtotal * (overallDiscountPercent / 100) * 100) / 100;
  const netPreTaxTotal = Math.round((subtotal - overallDiscountAmount) * 100) / 100;

  const handleSave = (saveStatus?: Quotation['status']) => {
    if (!client.name || !client.email) {
      alert('Please fill in Client Name and Email before saving.');
      return;
    }

    const finalStatus = saveStatus || status;

    const newQuote: Quotation = {
      id: quoteId,
      client,
      date,
      validUntil,
      items,
      subtotal,
      overallDiscountPercent,
      overallDiscountAmount,
      netPreTaxTotal,
      status: finalStatus,
      notes,
      paymentTerms,
      createdAt: initialQuote ? initialQuote.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      linkedInvoiceId: initialQuote?.linkedInvoiceId,
    };

    saveQuotation(newQuote);
    onSaved();
  };

  const handleDownloadPDF = () => {
    const tempQuote: Quotation = {
      id: quoteId,
      client,
      date,
      validUntil,
      items,
      subtotal,
      overallDiscountPercent,
      overallDiscountAmount,
      netPreTaxTotal,
      status,
      notes,
      paymentTerms,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    downloadQuotationPDF(tempQuote, getOwnerProfile());
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D1C7B7]/15">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-[#141311] border border-[#D1C7B7]/20 text-[#D1C7B7] hover:text-[#F7F5F0] hover:border-[#D1C7B7]/40 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-serif-title font-bold text-[#F7F5F0]">
              {isEditing ? `Edit Quotation (${quoteId})` : `Create Pre-Tax Commercial Quote (${quoteId})`}
            </h2>
            <p className="text-xs text-[#8C8273]">
              Pre-Tax Estimate Phase &bull; GST (18%) will be added when converted to final Tax Invoice upon acceptance.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 rounded-xl bg-[#141311] border border-[#D1C7B7]/25 text-[#F7F5F0] hover:border-[#D1C7B7] text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#D1C7B7]" />
            <span>Download Quote PDF</span>
          </button>
          <button
            onClick={() => handleSave('draft')}
            className="px-4 py-2 rounded-xl bg-[#141311] border border-[#D1C7B7]/30 text-[#D1C7B7] hover:text-[#F7F5F0] text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={() => handleSave('issued')}
            className="px-5 py-2 rounded-xl bg-[#D1C7B7] hover:bg-[#F7F5F0] text-[#0D0C0A] text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Issue Commercial Quote</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Client Info & Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Client & Project Details */}
        <div className="lg:col-span-2 bg-[#141311] border border-[#D1C7B7]/20 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-[#D1C7B7] border-b border-[#D1C7B7]/10 pb-2">
            1. Client & Project Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#8C8273] mb-1">Client Full Name *</label>
              <input
                type="text"
                value={client.name}
                onChange={(e) => setClient({ ...client, name: e.target.value })}
                placeholder="e.g. Vikramaditya Oberoi"
                className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-sm text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#8C8273] mb-1">Company / Firm Name</label>
              <input
                type="text"
                value={client.companyName || ''}
                onChange={(e) => setClient({ ...client, companyName: e.target.value })}
                placeholder="e.g. Oberoi Luxury Estates"
                className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-sm text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#8C8273] mb-1">Email Address *</label>
              <input
                type="email"
                value={client.email}
                onChange={(e) => setClient({ ...client, email: e.target.value })}
                placeholder="vikram@example.com"
                className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-sm text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#8C8273] mb-1">Phone / WhatsApp *</label>
              <input
                type="text"
                value={client.phone}
                onChange={(e) => setClient({ ...client, phone: e.target.value })}
                placeholder="+91 98200 00000"
                className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-sm text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#8C8273] mb-1">Project Name</label>
              <input
                type="text"
                value={client.projectName || ''}
                onChange={(e) => setClient({ ...client, projectName: e.target.value })}
                placeholder="e.g. Waterfront Villa Bioclimatic Pergola"
                className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-sm text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-[#8C8273] mb-1">Client GSTIN (Optional for quote)</label>
              <input
                type="text"
                value={client.gstin || ''}
                onChange={(e) => setClient({ ...client, gstin: e.target.value })}
                placeholder="27AAAAA0000A1Z5"
                className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-sm text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs text-[#8C8273] mb-1">Billing & Project Site Address</label>
              <textarea
                rows={2}
                value={client.billingAddress}
                onChange={(e) => setClient({ ...client, billingAddress: e.target.value })}
                placeholder="Enter complete site or billing address..."
                className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-sm text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Quote Meta & Status */}
        <div className="bg-[#141311] border border-[#D1C7B7]/20 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#D1C7B7] border-b border-[#D1C7B7]/10 pb-2 mb-3">
              2. Quote Metadata
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[#8C8273] mb-1">Quotation ID</label>
                <input
                  type="text"
                  readOnly
                  value={quoteId}
                  className="w-full px-3 py-2 bg-[#0D0C0A]/60 border border-[#D1C7B7]/15 rounded-lg text-sm text-[#D1C7B7] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#8C8273] mb-1">Quote Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8C8273] mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#8C8273] mb-1">Quotation Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Quotation['status'])}
                  className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none"
                >
                  <option value="draft">Draft (Internal)</option>
                  <option value="issued">Issued (Sent to Client)</option>
                  <option value="accepted">Accepted (Ready for Invoice)</option>
                  <option value="invoiced">Invoiced (Converted)</option>
                  <option value="declined">Declined / Expired</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0C0A] border border-[#D1C7B7]/15 space-y-1 text-xs">
            <span className="text-[#8C8273] uppercase tracking-widest text-[10px] font-bold block">Pre-Tax Net Estimate</span>
            <span className="text-2xl font-serif-title font-bold text-[#F7F5F0]">
              ₹{netPreTaxTotal.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#8C8273] block pt-1">
              * Excludes GST 18% (added on invoice stage)
            </span>
          </div>
        </div>
      </div>

      {/* Section 3: Pre-Tax Line Items Builder */}
      <div className="bg-[#141311] border border-[#D1C7B7]/20 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D1C7B7]/10 pb-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#D1C7B7]">
              3. Pre-Tax Line Items
            </h3>
            <p className="text-xs text-[#8C8273]">
              Add products from the Archzona catalog or enter custom architectural line items.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Catalog Selector */}
            <select
              value={selectedCatalogId}
              onChange={(e) => handleAddCatalogItem(e.target.value)}
              className="px-3 py-1.5 bg-[#0D0C0A] border border-[#D1C7B7]/25 rounded-lg text-xs text-[#D1C7B7] focus:outline-none max-w-xs"
            >
              <option value="">+ Add from Product Catalog...</option>
              {productsData.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} [{p.brand}]
                </option>
              ))}
            </select>

            <button
              onClick={handleAddCustomItem}
              className="px-3 py-1.5 bg-[#D1C7B7]/15 hover:bg-[#D1C7B7]/25 border border-[#D1C7B7]/30 text-[#F7F5F0] rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Item</span>
            </button>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D1C7B7]/15 text-[#8C8273] uppercase tracking-wider">
                <th className="py-2.5 px-2 w-8">#</th>
                <th className="py-2.5 px-2">Item Name & Description</th>
                <th className="py-2.5 px-2 w-28">Unit</th>
                <th className="py-2.5 px-2 w-24">Qty</th>
                <th className="py-2.5 px-2 w-28">Rate (₹)</th>
                <th className="py-2.5 px-2 w-20">Disc %</th>
                <th className="py-2.5 px-2 w-32 text-right">Net Amount (₹)</th>
                <th className="py-2.5 px-2 w-10 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D1C7B7]/10 text-[#F7F5F0]">
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-[#0D0C0A]/40 transition-colors">
                  <td className="py-3 px-2 font-mono text-[#8C8273]">{index + 1}</td>
                  <td className="py-3 px-2 space-y-1">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      placeholder="Item Title"
                      className="w-full px-2 py-1 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded text-xs font-semibold text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      placeholder="Item specifications and notes..."
                      className="w-full px-2 py-1 bg-[#0D0C0A] border border-[#D1C7B7]/15 rounded text-[11px] text-[#D1C7B7] focus:border-[#D1C7B7] focus:outline-none"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={item.unit}
                      onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                      className="w-full px-2 py-1.5 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded text-xs text-[#F7F5F0] focus:outline-none"
                    >
                      <option value="Sq. Ft.">Sq. Ft.</option>
                      <option value="Sq. Mtr.">Sq. Mtr.</option>
                      <option value="Running Ft.">Running Ft.</option>
                      <option value="Units">Units</option>
                      <option value="Sets">Sets</option>
                      <option value="Lump Sum">Lump Sum</option>
                    </select>
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded text-xs text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none text-right font-mono"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      min="0"
                      value={item.unitRate}
                      onChange={(e) => handleItemChange(index, 'unitRate', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded text-xs text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none text-right font-mono"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={item.discountPercent}
                      onChange={(e) => handleItemChange(index, 'discountPercent', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded text-xs text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none text-right font-mono"
                    />
                  </td>
                  <td className="py-3 px-2 text-right font-mono font-bold text-[#F7F5F0]">
                    ₹{item.netAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={() => handleRemoveItem(index)}
                      disabled={items.length <= 1}
                      className="p-1.5 text-red-400 hover:text-red-300 disabled:opacity-30 transition-colors cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary Footer */}
        <div className="pt-4 border-t border-[#D1C7B7]/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-3 text-xs">
            <span className="text-[#8C8273]">Overall Discount (%):</span>
            <input
              type="number"
              min="0"
              max="50"
              value={overallDiscountPercent}
              onChange={(e) => setOverallDiscountPercent(parseFloat(e.target.value) || 0)}
              className="w-20 px-2 py-1 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded text-xs text-[#F7F5F0] text-right font-mono"
            />
            {overallDiscountAmount > 0 && (
              <span className="text-emerald-400 font-mono">
                (-₹{overallDiscountAmount.toLocaleString('en-IN')})
              </span>
            )}
          </div>

          <div className="text-right space-y-1">
            <div className="text-xs text-[#8C8273]">
              Items Pre-Tax Subtotal: <span className="text-[#F7F5F0] font-mono">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-lg font-serif-title font-bold text-[#F7F5F0]">
              Net Pre-Tax Total: ₹{netPreTaxTotal.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Terms & Conditions & Payment Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#141311] border border-[#D1C7B7]/20 rounded-2xl p-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1C7B7] mb-2">
            Notes & Warranty Terms
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1C7B7] mb-2">
            Commercial Payment Milestones
          </label>
          <textarea
            rows={3}
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
