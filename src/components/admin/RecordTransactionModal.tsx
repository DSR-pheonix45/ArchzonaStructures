import React, { useState } from 'react';
import { X, CreditCard, CheckCircle2, Landmark, ArrowRight, DollarSign } from 'lucide-react';
import { Quotation, Invoice, PaymentMethod } from '../../types/adminTypes';
import { recordUniversalTransaction, getQuotations, getInvoices } from '../../utils/adminStorage';
import { syncQuoteToGSheet, syncInvoiceToGSheet } from '../../utils/googleSheetsSync';

interface RecordTransactionModalProps {
  initialDocId?: string;
  onClose: () => void;
  onSaved: () => void;
}

export const RecordTransactionModal: React.FC<RecordTransactionModalProps> = ({
  initialDocId,
  onClose,
  onSaved,
}) => {
  const allQuotes = getQuotations();
  const allInvoices = getInvoices();

  // Combine into unified document list
  const docOptions = [
    ...allQuotes.map((q) => ({
      id: q.id,
      docTypeLabel: q.docType === 'proforma' ? 'Proforma Invoice' : 'Pre-Tax Quote',
      clientName: q.client.name,
      company: q.client.companyName,
      projectName: q.client.projectName,
      totalAmount: q.grandTotal || q.netPreTaxTotal,
      amountPaid: q.amountPaid || 0,
      balanceDue: Math.max(0, (q.grandTotal || q.netPreTaxTotal) - (q.amountPaid || 0)),
      isQuote: true,
    })),
    ...allInvoices.map((inv) => ({
      id: inv.id,
      docTypeLabel: 'Tax Invoice',
      clientName: inv.client.name,
      company: inv.client.companyName,
      projectName: inv.client.projectName,
      totalAmount: inv.grandTotal,
      amountPaid: inv.amountPaid,
      balanceDue: inv.balanceDue,
      isQuote: false,
    })),
  ];

  const defaultDoc = docOptions.find((d) => d.id === initialDocId) || docOptions[0];

  const [selectedDocId, setSelectedDocId] = useState<string>(defaultDoc?.id || '');
  const activeDoc = docOptions.find((d) => d.id === selectedDocId) || defaultDoc;

  const [payAmount, setPayAmount] = useState<number>(() => {
    if (!activeDoc) return 0;
    return activeDoc.balanceDue > 0 ? activeDoc.balanceDue : activeDoc.totalAmount;
  });

  const [payMethod, setPayMethod] = useState<PaymentMethod>('NEFT/RTGS');
  const [bankAccount, setBankAccount] = useState<string>('Axis Bank (A/C: 923020053039794)');
  const [transactionRef, setTransactionRef] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [autoConvertToInvoice, setAutoConvertToInvoice] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);

  // Quick Preset Helper
  const applyPercentage = (percent: number) => {
    if (!activeDoc) return;
    const calculated = Math.round((activeDoc.totalAmount * (percent / 100)) * 100) / 100;
    setPayAmount(calculated);
  };

  const handleDocChange = (id: string) => {
    setSelectedDocId(id);
    const doc = docOptions.find((d) => d.id === id);
    if (doc) {
      setPayAmount(doc.balanceDue > 0 ? doc.balanceDue : doc.totalAmount);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocId) {
      alert('Please select a Quote / Proforma or Invoice.');
      return;
    }
    if (payAmount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    setIsSaving(true);

    try {
      const result = recordUniversalTransaction({
        docId: selectedDocId,
        amount: payAmount,
        method: payMethod,
        transactionRef: transactionRef.trim() || 'N/A',
        bankAccount,
        notes: notes.trim() || `Bank payment received against ${selectedDocId}`,
        date: payDate,
        autoConvertToInvoice: activeDoc?.isQuote ? autoConvertToInvoice : false,
      });

      if (result.quote) {
        await syncQuoteToGSheet(result.quote).catch(() => {});
      }
      if (result.invoice) {
        await syncInvoiceToGSheet(result.invoice).catch(() => {});
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error('Error recording payment entry:', err);
      alert('Failed to record payment. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0C0A]/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#141311] border border-[#D1C7B7]/25 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#D1C7B7]/15">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif-title font-bold text-[#F7F5F0]">Record Bank Transaction Entry</h3>
              <p className="text-xs text-[#8C8273]">
                Log funds transferred by party against quote, proforma, or tax invoice.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C8273] hover:text-[#F7F5F0] hover:bg-[#0D0C0A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Document / Party Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#D1C7B7] mb-1.5">
              1. Select Party & Quote / Invoice
            </label>
            <select
              value={selectedDocId}
              onChange={(e) => handleDocChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-xl text-xs text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none font-sans"
            >
              {docOptions.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.id} &bull; {doc.clientName} ({doc.docTypeLabel} - ₹{doc.totalAmount.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          {/* Active Document Summary Badge */}
          {activeDoc && (
            <div className="p-3.5 rounded-xl bg-[#0D0C0A] border border-[#D1C7B7]/15 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#8C8273]">
                <span>Party: <strong className="text-[#F7F5F0]">{activeDoc.clientName}</strong> {activeDoc.company ? `(${activeDoc.company})` : ''}</span>
                <span className="px-2 py-0.5 rounded bg-[#D1C7B7]/15 text-[#D1C7B7] font-mono text-[10px] font-bold">
                  {activeDoc.docTypeLabel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#D1C7B7]/10 text-center font-mono">
                <div>
                  <span className="text-[10px] text-[#8C8273] block uppercase">Total</span>
                  <span className="font-bold text-[#F7F5F0]">₹{activeDoc.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C8273] block uppercase">Paid So Far</span>
                  <span className="font-bold text-emerald-400">₹{activeDoc.amountPaid.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8C8273] block uppercase">Balance Due</span>
                  <span className="font-bold text-amber-400">₹{activeDoc.balanceDue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Amount Paid with Quick Deposit Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#D1C7B7]">
                2. Amount Transferred (₹) *
              </label>
              <div className="flex items-center space-x-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => applyPercentage(30)}
                  className="px-2 py-0.5 rounded bg-[#D1C7B7]/15 hover:bg-[#D1C7B7]/30 text-[#D1C7B7] hover:text-[#F7F5F0] font-bold transition-colors cursor-pointer"
                >
                  30% Advance
                </button>
                <button
                  type="button"
                  onClick={() => applyPercentage(50)}
                  className="px-2 py-0.5 rounded bg-[#D1C7B7]/15 hover:bg-[#D1C7B7]/30 text-[#D1C7B7] hover:text-[#F7F5F0] font-bold transition-colors cursor-pointer"
                >
                  50% Advance
                </button>
                <button
                  type="button"
                  onClick={() => setPayAmount(activeDoc?.balanceDue || activeDoc?.totalAmount || 0)}
                  className="px-2 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold transition-colors cursor-pointer"
                >
                  Full Balance
                </button>
              </div>
            </div>

            <input
              type="number"
              min="1"
              max={activeDoc?.totalAmount}
              value={payAmount}
              onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2.5 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-xl text-base font-bold font-mono text-emerald-400 focus:border-emerald-500 focus:outline-none"
              placeholder="e.g. 150000"
            />
          </div>

          {/* Payment Method & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#8C8273] mb-1">Payment Method</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0] focus:outline-none"
              >
                <option value="NEFT/RTGS">NEFT / RTGS Bank Transfer</option>
                <option value="UPI">UPI / GPay / PhonePe</option>
                <option value="Cheque">Bank Cheque</option>
                <option value="Cash">Cash Deposit</option>
                <option value="Card">Credit / Debit Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#8C8273] mb-1">Date Received</label>
              <input
                type="date"
                value={payDate}
                onChange={(e) => setPayDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0] focus:outline-none"
              />
            </div>
          </div>

          {/* Bank Account & UTR Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#8C8273] mb-1">Receiving Bank Account</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#8C8273] mb-1">UTR / Bank Transaction Ref # *</label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. AXISN20260923001..."
                className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs font-mono text-[#F7F5F0] focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-[#8C8273] mb-1">Notes / Remarks</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 50% advance for Pergola fabrication PO..."
              className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0] focus:outline-none"
            />
          </div>

          {/* Optional Auto-Convert Checkbox for Quotes */}
          {activeDoc?.isQuote && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                id="autoConvertCheck"
                checked={autoConvertToInvoice}
                onChange={(e) => setAutoConvertToInvoice(e.target.checked)}
                className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
              />
              <label htmlFor="autoConvertCheck" className="text-amber-200 cursor-pointer font-medium">
                Turn this Quote/Proforma into a Tax Invoice upon logging payment
              </label>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#D1C7B7]/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[#8C8273] hover:text-[#F7F5F0] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-[#D1C7B7] hover:bg-[#F7F5F0] text-[#0D0C0A] font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Saving Entry...' : 'Save Bank Transaction Entry'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
