import React, { useState, useEffect } from 'react';
import { X, CreditCard, Download, CheckCircle2, DollarSign, Calendar, Landmark, FileText, Check } from 'lucide-react';
import { Invoice, PaymentMethod } from '../../types/adminTypes';
import { recordPayment, getOwnerProfile } from '../../utils/adminStorage';
import { downloadInvoicePDF } from '../../utils/pdfGenerator';
import { syncInvoiceToGSheet } from '../../utils/googleSheetsSync';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onUpdate: () => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ invoice, onClose, onUpdate }) => {
  if (!invoice) return null;

  const [currentInvoice, setCurrentInvoice] = useState<Invoice>(invoice);
  useEffect(() => {
    setCurrentInvoice(invoice);
  }, [invoice]);

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(invoice.balanceDue);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('NEFT/RTGS');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSavingPay, setIsSavingPay] = useState(false);

  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    setIsSavingPay(true);
    const updatedInvoice = recordPayment(currentInvoice.id, {
      date: payDate,
      amount: payAmount,
      method: payMethod,
      transactionRef: payRef || 'N/A',
      notes: payNotes,
    });

    if (updatedInvoice) {
      setCurrentInvoice({ ...updatedInvoice });
      // Sync immediately to Google Sheet Invoices tab!
      try {
        await syncInvoiceToGSheet(updatedInvoice);
      } catch (err) {
        console.warn('GSheet invoice payment sync error:', err);
      }
    }

    setIsSavingPay(false);
    setShowPaymentForm(false);
    setPayAmount(0);
    setPayRef('');
    setPayNotes('');
    onUpdate();
  };

  const handleDownloadPDF = () => {
    downloadInvoicePDF(currentInvoice, getOwnerProfile());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0C0A]/90 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-[#141311] border border-[#D1C7B7]/25 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D1C7B7]/15">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#D1C7B7]/10 border border-[#D1C7B7]/30 flex items-center justify-center text-[#D1C7B7]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-serif-title font-bold text-[#F7F5F0]">
                  Tax Invoice {currentInvoice.id}
                </h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  currentInvoice.status === 'paid' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                  currentInvoice.status === 'partially_paid' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-red-950 text-red-300 border border-red-800'
                }`}>
                  {currentInvoice.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-[#8C8273]">
                Linked Quote: {currentInvoice.quoteId} &bull; Issue Date: {currentInvoice.issueDate}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPDF}
              className="px-3.5 py-1.5 rounded-lg bg-[#D1C7B7]/15 border border-[#D1C7B7]/30 text-[#F7F5F0] hover:bg-[#D1C7B7]/25 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#D1C7B7]" />
              <span>Tax Invoice PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8C8273] hover:text-[#F7F5F0] hover:bg-[#0D0C0A] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Summary Row */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0D0C0A] border border-[#D1C7B7]/15">
            <span className="text-[10px] text-[#8C8273] uppercase tracking-wider font-bold block">Grand Total (Inc. GST)</span>
            <span className="text-xl font-serif-title font-bold text-[#F7F5F0]">
              ₹{currentInvoice.grandTotal.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#D1C7B7]/70 block pt-1">
              Subtotal ₹{currentInvoice.subtotal.toLocaleString('en-IN')} + GST ₹{currentInvoice.totalTax.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0C0A] border border-[#D1C7B7]/15">
            <span className="text-[10px] text-[#8C8273] uppercase tracking-wider font-bold block">Amount Received</span>
            <span className="text-xl font-serif-title font-bold text-emerald-400">
              ₹{currentInvoice.amountPaid.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#8C8273] block pt-1">
              {currentInvoice.payments.length} Payment Receipts Logged
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0C0A] border border-[#D1C7B7]/15">
            <span className="text-[10px] text-[#8C8273] uppercase tracking-wider font-bold block">Balance Outstanding (AR)</span>
            <span className={`text-xl font-serif-title font-bold ${currentInvoice.balanceDue > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              ₹{currentInvoice.balanceDue.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#8C8273] block pt-1">
              Due Date: {currentInvoice.dueDate}
            </span>
          </div>
        </div>

        {/* Client & Tax Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0D0C0A]/60 border border-[#D1C7B7]/15 rounded-xl p-4 text-xs">
          <div>
            <h4 className="font-semibold text-[#D1C7B7] uppercase tracking-wider mb-2">Billed Client Details</h4>
            <p className="text-[#F7F5F0] font-bold">{currentInvoice.client.name}</p>
            {currentInvoice.client.companyName && <p className="text-[#8C8273]">{currentInvoice.client.companyName}</p>}
            <p className="text-[#8C8273] mt-1">{currentInvoice.client.billingAddress}</p>
            <p className="text-[#8C8273] mt-1">Phone: {currentInvoice.client.phone} | Email: {currentInvoice.client.email}</p>
            {currentInvoice.client.gstin && <p className="text-[#D1C7B7] font-mono mt-1">Client GSTIN: {currentInvoice.client.gstin}</p>}
          </div>

          <div>
            <h4 className="font-semibold text-[#D1C7B7] uppercase tracking-wider mb-2">GST & Payment Terms</h4>
            <p className="text-[#8C8273]">Tax Mode: <span className="text-[#F7F5F0] font-mono">{currentInvoice.taxType}</span></p>
            {currentInvoice.taxType === 'CGST_SGST' ? (
              <p className="text-[#8C8273]">CGST (9%): ₹{currentInvoice.cgstAmount.toLocaleString('en-IN')} | SGST (9%): ₹{currentInvoice.sgstAmount.toLocaleString('en-IN')}</p>
            ) : (
              <p className="text-[#8C8273]">IGST (18%): ₹{currentInvoice.igstAmount.toLocaleString('en-IN')}</p>
            )}
            <p className="text-[#8C8273] mt-2">Payment Terms: {currentInvoice.paymentTerms}</p>
          </div>
        </div>

        {/* Line Items Table with HSN */}
        <div className="mt-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D1C7B7] mb-3">Itemized Taxable Services & Products</h4>
          <div className="overflow-x-auto border border-[#D1C7B7]/15 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D0C0A] text-[#8C8273] uppercase tracking-wider border-b border-[#D1C7B7]/15">
                <tr>
                  <th className="py-2.5 px-3">Item</th>
                  <th className="py-2.5 px-3 text-center">HSN/SAC</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate</th>
                  <th className="py-2.5 px-3 text-right">Taxable Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D1C7B7]/10 text-[#F7F5F0]">
                {currentInvoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-[11px] text-[#8C8273]">{item.description}</p>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-[#D1C7B7]">{item.hsnCode || '3925'}</td>
                    <td className="py-2.5 px-3 text-center font-mono">{item.quantity} {item.unit}</td>
                    <td className="py-2.5 px-3 text-right font-mono">₹{item.unitRate.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">₹{item.netAmount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payments Log & Action */}
        <div className="mt-6 pt-4 border-t border-[#D1C7B7]/15">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D1C7B7]">Payment History Log</h4>
            {currentInvoice.balanceDue > 0 && !showPaymentForm && (
              <button
                onClick={() => {
                  setPayAmount(currentInvoice.balanceDue);
                  setShowPaymentForm(true);
                }}
                className="px-3 py-1.5 bg-[#D1C7B7] hover:bg-[#F7F5F0] text-[#0D0C0A] text-xs font-bold rounded-lg flex items-center space-x-1 transition-all cursor-pointer shadow-md"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>+ Record Payment</span>
              </button>
            )}
          </div>

          {/* Record Payment Form View */}
          {showPaymentForm && (
            <form onSubmit={handleRecordPaymentSubmit} className="mb-6 p-4 rounded-xl bg-[#0D0C0A] border border-[#D1C7B7]/30 space-y-4 shadow-xl">
              <h5 className="text-xs font-bold text-[#F7F5F0] uppercase tracking-wider border-b border-[#D1C7B7]/15 pb-2">
                Log Incoming Payment Transaction against Invoice {currentInvoice.id}
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-[#8C8273] mb-1">Amount Paid (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    max={currentInvoice.balanceDue}
                    value={payAmount}
                    onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-[#141311] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0] font-mono focus:border-[#D1C7B7] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#8C8273] mb-1">Payment Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 bg-[#141311] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none"
                  >
                    <option value="NEFT/RTGS">NEFT / RTGS Bank Transfer</option>
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Cheque">Bank Cheque</option>
                    <option value="Cash">Cash Receipt</option>
                    <option value="Card">Credit / Debit Card</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-[#8C8273] mb-1">Transaction Ref / UTR #</label>
                  <input
                    type="text"
                    value={payRef}
                    onChange={(e) => setPayRef(e.target.value)}
                    placeholder="e.g. AXISRN20260923..."
                    className="w-full px-3 py-2 bg-[#141311] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0] font-mono focus:border-[#D1C7B7] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#8C8273] mb-1">Notes / Internal Remarks</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. Received advance payment via NEFT"
                  className="w-full px-3 py-2 bg-[#141311] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0] focus:border-[#D1C7B7] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentForm(false)}
                  className="px-3 py-1.5 text-xs text-[#8C8273] hover:text-[#F7F5F0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPay}
                  className="px-4 py-1.5 bg-[#D1C7B7] text-[#0D0C0A] font-bold text-xs rounded-lg hover:bg-[#F7F5F0] cursor-pointer disabled:opacity-50"
                >
                  {isSavingPay ? 'Saving & Syncing...' : 'Save Payment Record'}
                </button>
              </div>
            </form>
          )}

          {currentInvoice.payments.length === 0 ? (
            <p className="text-xs text-[#8C8273] italic">No payment receipts logged yet for this invoice.</p>
          ) : (
            <div className="space-y-2">
              {currentInvoice.payments.map((pay) => (
                <div key={pay.id} className="p-3 rounded-lg bg-[#0D0C0A] border border-[#D1C7B7]/15 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-400 font-mono">₹{pay.amount.toLocaleString('en-IN')}</span>
                    <span className="text-[#8C8273] ml-2">via {pay.method} (Ref: {pay.transactionRef})</span>
                    {pay.notes && <p className="text-[11px] text-[#D1C7B7]/70 mt-0.5">{pay.notes}</p>}
                  </div>
                  <span className="text-[#8C8273] text-[11px]">{pay.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
