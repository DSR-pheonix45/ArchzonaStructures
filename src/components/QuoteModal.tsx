import React, { useState } from 'react';
import { X, CheckCircle2, MessageSquare, Mail, Copy, Check, ArrowRight, Loader2, Paperclip, Upload } from 'lucide-react';
import { useProjectCart } from '../context/ProjectCartContext';
import {
  QuoteRequest,
  submitQuoteRequest,
  generateWhatsAppQuoteUrl,
  ARCHZONA_EMAIL,
  ARCHZONA_PHONE,
} from '../utils/quoteWorkflow';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  customStructureConfig?: any;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, customStructureConfig }) => {
  const { cart, clearCart } = useProjectCart();

  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    company: '',
    projectType: 'Villa / Residential',
    projectLocation: cart.projectLocation || '',
    approximateArea: cart.projectSize || '',
    notes: cart.notes || '',
  });

  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResponse, setSubmittedResponse] = useState<any | null>(null);
  const [copiedSchedule, setCopiedSchedule] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.phone || !formData.email) {
      setErrorMsg('Please enter your name, phone number, and email address.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    const finalNotes = attachedFile
      ? `${formData.notes ? formData.notes + '\n' : ''}[Attached Drawing/Spec: ${attachedFile.name} (${(attachedFile.size / 1024).toFixed(1)} KB)]`
      : formData.notes;

    try {
      const quotePayload: QuoteRequest = {
        clientName: formData.clientName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        projectName: cart.projectName || 'Architectural Project',
        projectLocation: formData.projectLocation,
        projectType: formData.projectType,
        approximateArea: formData.approximateArea,
        notes: finalNotes,
        items: cart.items,
        customStructureConfig,
        attachment: attachedFile || undefined,
      };

      const res = await submitQuoteRequest(quotePayload);
      setSubmittedResponse(res);
    } catch (err) {
      setErrorMsg('Submission error. Please send via WhatsApp or email directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalNotesForUrl = attachedFile
    ? `${formData.notes ? formData.notes + '\n' : ''}[Attached Drawing/Spec: ${attachedFile.name} (${(attachedFile.size / 1024).toFixed(1)} KB)]`
    : formData.notes;

  const handleCopySummary = () => {
    const quotePayload: QuoteRequest = {
      clientName: formData.clientName,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      projectName: cart.projectName,
      projectLocation: formData.projectLocation,
      projectType: formData.projectType,
      approximateArea: formData.approximateArea,
      notes: finalNotesForUrl,
      items: cart.items,
      customStructureConfig,
    };
    const text = generateWhatsAppQuoteUrl(quotePayload).split('?text=')[1];
    navigator.clipboard.writeText(decodeURIComponent(text));
    setCopiedSchedule(true);
    setTimeout(() => setCopiedSchedule(false), 2000);
  };

  const whatsAppUrl = submittedResponse
    ? generateWhatsAppQuoteUrl(submittedResponse.data)
    : generateWhatsAppQuoteUrl({
        clientName: formData.clientName || 'Architectural Client',
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        projectName: cart.projectName,
        projectLocation: formData.projectLocation,
        projectType: formData.projectType,
        approximateArea: formData.approximateArea,
        notes: finalNotesForUrl,
        items: cart.items,
        customStructureConfig,
      });

  return (
    <div
      id="quote-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#0D0C0A]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="quote-modal-container"
        className="bg-[#141311] border border-[#D1C7B7]/25 rounded-2xl w-full max-w-2xl text-[#F7F5F0] shadow-2xl relative my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#D1C7B7]/20 bg-[#0D0C0A] flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#D1C7B7] font-mono font-semibold block">
              ARCHZONA QUOTE WORKFLOW
            </span>
            <h2 className="font-serif-title text-2xl md:text-3xl text-[#F7F5F0]">
              {submittedResponse ? 'PROJECT RECEIVED' : 'REQUEST PROJECT QUOTE'}
            </h2>
          </div>
          <button
            id="close-quote-modal-btn"
            onClick={onClose}
            className="p-2 text-[#8C8273] hover:text-[#F7F5F0] rounded-full hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8">
          {submittedResponse ? (
            /* SUCCESS CONFIRMATION STATE (Section 32) */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#D1C7B7]/10 border border-[#D1C7B7]/30 flex items-center justify-center mx-auto text-[#D1C7B7] shadow-[0_0_20px_rgba(209,199,183,0.15)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold block">
                  REFERENCE #{submittedResponse.referenceId}
                </span>
                <h3 className="font-serif-title text-2xl md:text-3xl text-[#F7F5F0]">
                  Your material requirements have been compiled.
                </h3>
                <p className="text-sm font-sans-clean text-[#D1C7B7] max-w-lg mx-auto leading-relaxed">
                  Archzona will review the project specifications and contact you regarding pricing, batch availability, detailing, and installation execution.
                </p>
              </div>

              {/* Direct Instant Channels */}
              <div className="pt-4 border-t border-[#D1C7B7]/20 space-y-3">
                <p className="text-xs tracking-wider uppercase text-[#8C8273] font-mono">
                  INSTANT COMMUNICATION OPTIONS
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-sans-clean font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>SEND VIA WHATSAPP</span>
                  </a>

                  <a
                    href={`mailto:${ARCHZONA_EMAIL}?subject=Archzona%20Quote%20Request%20${submittedResponse.referenceId}`}
                    className="flex items-center justify-center gap-2 py-3.5 px-4 bg-[#F7F5F0] hover:bg-[#D1C7B7] text-[#0D0C0A] font-sans-clean font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                  >
                    <Mail className="w-4 h-4" />
                    <span>SEND VIA EMAIL</span>
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleCopySummary}
                    className="inline-flex items-center gap-1.5 text-xs text-[#D1C7B7] hover:text-[#F7F5F0] underline cursor-pointer font-mono"
                  >
                    {copiedSchedule ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSchedule ? 'Schedule copied to clipboard' : 'Copy structured quote schedule'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    clearCart();
                    onClose();
                  }}
                  className="text-xs uppercase tracking-widest text-[#8C8273] hover:text-[#F7F5F0] transition-colors cursor-pointer font-mono"
                >
                  Close & Return to Showroom
                </button>
              </div>
            </div>
          ) : (
            /* FORM SUBMISSION STATE */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Schedule Quick Preview */}
              <div className="bg-[#0D0C0A] rounded-xl border border-[#D1C7B7]/20 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-[#D1C7B7] font-mono uppercase tracking-wider">
                  <span>Project Schedule Summary</span>
                  <span>{cart.items.length} items selected</span>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-xs text-[#EFEAE2]">
                      <span className="truncate max-w-[280px]">• {item.productName}</span>
                      <span className="font-mono text-[#8C8273]">
                        {item.quantity} units {item.areaSqFt ? `(${item.areaSqFt} sq ft)` : ''}
                      </span>
                    </div>
                  ))}
                  {customStructureConfig && (
                    <div className="text-xs text-[#EFEAE2]">
                      • Custom Structure: {customStructureConfig.size || customStructureConfig.configuration}
                    </div>
                  )}
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-200 text-xs font-sans-clean">
                  {errorMsg}
                </div>
              )}

              {/* Contact Information Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans-clean">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C8273] block mb-1 font-mono">
                    Your Full Name *
                  </label>
                  <input
                    id="quote-name-input"
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="e.g. Rahul Mehta / Ar. Shreya Patil"
                    className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg px-3 py-2 text-sm text-[#F7F5F0] focus:outline-none focus:border-[#D1C7B7] transition-all placeholder-[#8C8273]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C8273] block mb-1 font-mono">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    id="quote-phone-input"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg px-3 py-2 text-sm text-[#F7F5F0] focus:outline-none focus:border-[#D1C7B7] transition-all placeholder-[#8C8273]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C8273] block mb-1 font-mono">
                    Email Address *
                  </label>
                  <input
                    id="quote-email-input"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@example.com"
                    className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg px-3 py-2 text-sm text-[#F7F5F0] focus:outline-none focus:border-[#D1C7B7] transition-all placeholder-[#8C8273]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C8273] block mb-1 font-mono">
                    Company / Firm Name (Optional)
                  </label>
                  <input
                    id="quote-company-input"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Studio Vista Architects"
                    className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg px-3 py-2 text-sm text-[#F7F5F0] focus:outline-none focus:border-[#D1C7B7] transition-all placeholder-[#8C8273]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C8273] block mb-1 font-mono">
                    Project Type
                  </label>
                  <select
                    id="quote-type-select"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg px-3 py-2 text-sm text-[#F7F5F0] focus:outline-none focus:border-[#D1C7B7]"
                  >
                    <option value="Villa / Residential">Villa / Residential</option>
                    <option value="Resort / Hospitality">Resort / Hospitality</option>
                    <option value="Poolside & Terrace">Poolside & Terrace</option>
                    <option value="Hill Bungalow / Farmhouse">Hill Bungalow / Farmhouse</option>
                    <option value="Commercial / Civic">Commercial / Civic</option>
                    <option value="Landscape Garden">Landscape Garden</option>
                    <option value="Other Custom Space">Other Custom Space</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C8273] block mb-1 font-mono">
                    Site Location
                  </label>
                  <input
                    id="quote-location-input"
                    type="text"
                    value={formData.projectLocation}
                    onChange={(e) => setFormData({ ...formData, projectLocation: e.target.value })}
                    placeholder="e.g. Alibaug / Goa / Pune / Lonavala"
                    className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg px-3 py-2 text-sm text-[#F7F5F0] focus:outline-none focus:border-[#D1C7B7] transition-all placeholder-[#8C8273]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] uppercase tracking-wider text-[#8C8273] block mb-1 font-mono">
                    Specific Site Requirements or Execution Notes
                  </label>
                  <textarea
                    id="quote-notes-textarea"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Mention specific details like sub-frame requirements, installation services needed, coastal exposure, timeline..."
                    className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg p-3 text-sm text-[#F7F5F0] focus:outline-none focus:border-[#D1C7B7] placeholder-[#8C8273] transition-all"
                  />
                </div>

                {/* File Uploader for CAD drawings & PDF specs */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-[#8C8273] block font-mono">
                    Attach CAD Drawings or PDF Specifications (Optional)
                  </label>
                  {attachedFile ? (
                    <div className="flex items-center justify-between p-3 bg-[#0D0C0A] border border-[#D4AF37]/40 rounded-xl text-xs">
                      <div className="flex items-center space-x-2.5 overflow-hidden">
                        <Paperclip className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <div className="truncate">
                          <span className="font-mono text-[#F7F5F0] font-semibold block truncate">{attachedFile.name}</span>
                          <span className="text-[10px] text-[#8C8273]">{(attachedFile.size / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedFile(null)}
                        className="p-1 text-[#8C8273] hover:text-red-400 cursor-pointer"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center space-x-2 p-3 bg-[#0D0C0A] border border-dashed border-[#D1C7B7]/30 hover:border-[#D1C7B7]/60 rounded-xl cursor-pointer transition-all group">
                      <Upload className="w-4 h-4 text-[#8C8273] group-hover:text-[#D1C7B7]" />
                      <span className="text-xs text-[#8C8273] group-hover:text-[#D1C7B7] font-sans-clean">
                        Click to attach .pdf, .dwg, .dxf, .cad, .zip, or images
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.dwg,.dxf,.cad,.zip,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  id="submit-quote-request-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-[#F7F5F0] hover:bg-[#D1C7B7] text-[#0D0C0A] font-sans-clean font-bold text-xs uppercase tracking-[0.2em] rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>COMPILING SCHEDULE...</span>
                    </>
                  ) : (
                    <>
                      <span>SUBMIT QUOTE SCHEDULE</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-sans-clean font-bold text-xs uppercase tracking-[0.18em] rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WHATSAPP DIRECT</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
