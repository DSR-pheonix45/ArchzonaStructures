import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Send, CheckCircle2, ArrowRight, Paperclip, Upload, X, ExternalLink, Loader2 } from 'lucide-react';
import {
  ARCHZONA_EMAIL,
  ARCHZONA_PHONE,
  ARCHZONA_ADDRESS_LINE1,
  ARCHZONA_ADDRESS_LINE2,
  ARCHZONA_MAPS_URL,
  submitProjectInquiry,
  generateWhatsAppQuoteUrl,
} from '../utils/quoteWorkflow';

interface ContactViewProps {
  initialSubject?: string;
}

export const ContactView: React.FC<ContactViewProps> = ({ initialSubject }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    firm: '',
    projectType: 'Villa / Residential',
    location: '',
    message: initialSubject ? `Inquiring regarding ${initialSubject}. ` : '',
  });

  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const messageWithFile = attachedFile
      ? `${formData.message ? formData.message + '\n' : ''}[Attached Drawing/Spec: ${attachedFile.name} (${(attachedFile.size / 1024).toFixed(1)} KB)]`
      : formData.message;

    await submitProjectInquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.firm,
      projectType: formData.projectType,
      projectLocation: formData.location,
      message: messageWithFile,
      requirements: messageWithFile,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const defaultWhatsAppIntro = 'Hello Archzona, I am reaching out regarding architectural materials & structure execution.';

  const whatsAppDirectUrl = `https://wa.me/919870048082?text=${encodeURIComponent(defaultWhatsAppIntro)}`;

  const buildSubmittedWhatsAppUrl = () => {
    let text = defaultWhatsAppIntro;
    if (formData.name) text += `\nName: ${formData.name}`;
    if (formData.location) text += `\nLocation: ${formData.location}`;
    if (formData.message) text += `\nMessage: ${formData.message}`;
    if (attachedFile) text += `\n[Attached Drawing: ${attachedFile.name} (${(attachedFile.size / 1024).toFixed(1)} KB)]`;
    return `https://wa.me/919870048082?text=${encodeURIComponent(text)}`;
  };

  const buildSubmittedMailtoUrl = () => {
    const subject = `[Archzona Inquiry] Project Consultation from ${formData.name || 'Client'}`;
    let body = `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nFirm/Company: ${formData.firm}\nProject Type: ${formData.projectType}\nLocation: ${formData.location}\n\nMessage:\n${formData.message}`;
    if (attachedFile) {
      body += `\n\n[Attached File: ${attachedFile.name} (${(attachedFile.size / 1024).toFixed(1)} KB)]`;
    }
    return `mailto:${ARCHZONA_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div id="contact-view" className="text-[#F7F5F0] pt-28 pb-32 min-h-screen relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4 border-b border-[#D1C7B7]/20 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D1C7B7]/30 bg-[#141311] text-[10px] uppercase font-mono tracking-[0.25em] text-[#D1C7B7]">
            <span className="w-2 h-2 rounded-full bg-[#D1C7B7]" />
            ENGAGE WITH ARCHZONA
          </div>
          <h1 className="font-serif-title text-4xl sm:text-6xl text-[#F7F5F0]">
            START A CONVERSATION.
          </h1>
          <p className="text-base sm:text-lg font-sans-clean text-[#D1C7B7]/85 leading-relaxed font-light">
            Whether you are detailing a private residence, planning a boutique hospitality resort, or requiring material sample swatches and sub-frame calculation, our architectural team is ready.
          </p>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Info & Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-[#141311] rounded-2xl border border-[#D1C7B7]/20 space-y-6">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold block">
                DIRECT CHANNELS
              </span>

              {/* WhatsApp Direct */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono text-[#8C8273] block">
                  INSTANT ARCHITECTURAL DESK (WHATSAPP)
                </span>
                <a
                  href={whatsAppDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-white hover:bg-emerald-500/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-mono font-bold text-sm block text-emerald-300">{ARCHZONA_PHONE}</span>
                    <span className="text-[11px] text-[#D1C7B7] font-sans-clean">Naresh K — Co-Founder, Archzona</span>
                  </div>
                </a>
              </div>

              {/* Email Direct */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono text-[#8C8273] block">
                  PROJECT SPECIFICATIONS & TENDERS (EMAIL)
                </span>
                <a
                  href={`mailto:${ARCHZONA_EMAIL}`}
                  className="flex items-center gap-3 p-3.5 bg-[#0D0C0A] rounded-xl border border-[#D1C7B7]/20 text-[#F7F5F0] hover:border-[#D1C7B7] transition-all cursor-pointer"
                >
                  <Mail className="w-5 h-5 text-[#D1C7B7] shrink-0" />
                  <div>
                    <span className="font-mono text-sm block text-[#F7F5F0]">{ARCHZONA_EMAIL}</span>
                    <span className="text-[11px] text-[#8C8273] font-sans-clean">Send CAD drawings & schedules</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Experience Studio Location */}
            <div className="p-8 bg-[#141311] rounded-2xl border border-[#D1C7B7]/25 text-[#F7F5F0] space-y-5 shadow-xl">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold block">
                HEADQUARTERS & OFFICE
              </span>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D1C7B7] shrink-0 mt-1" />
                <div className="font-sans-clean text-xs leading-relaxed space-y-1">
                  <p className="font-serif-title text-xl text-[#F7F5F0]">Archzona Structures</p>
                  <p className="text-[#D1C7B7]">{ARCHZONA_ADDRESS_LINE1}</p>
                  <p className="text-[#D1C7B7]">{ARCHZONA_ADDRESS_LINE2}</p>
                  <p className="text-[10px] text-[#8C8273] pt-1">Field installations across Maharashtra, Goa, Gujarat & Pan-India.</p>
                </div>
              </div>
              <div className="pt-2">
                <a
                  href={ARCHZONA_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#F7F5F0] hover:bg-[#D1C7B7] text-[#0D0C0A] text-xs font-sans-clean font-bold tracking-[0.18em] uppercase rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#0D0C0A]" />
                  <span>OPEN IN MAPS</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#0D0C0A]" />
                </a>
              </div>
            </div>
          </div>

          {/* Right: Consultation Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#141311] rounded-2xl border border-[#D1C7B7]/25 p-8 sm:p-10 space-y-6 shadow-xl">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold block">
                PROJECT CONSULTATION INQUIRY
              </span>
              <h3 className="font-serif-title text-3xl text-[#F7F5F0] mt-1">
                Tell Us About Your Space
              </h3>
            </div>

            {isSubmitted ? (
              <div className="p-8 bg-[#0D0C0A] rounded-2xl border border-[#D1C7B7]/30 space-y-4 text-center">
                <CheckCircle2 className="w-12 h-12 text-[#D1C7B7] mx-auto" />
                <h4 className="font-serif-title text-2xl text-[#F7F5F0]">Inquiry Dispatched</h4>
                <p className="text-xs font-sans-clean text-[#D1C7B7] max-w-md mx-auto leading-relaxed">
                  Thank you, {formData.name || 'Client'}. Your project details have been sent to <strong className="text-[#F7F5F0]">info.archzona@gmail.com</strong>. An Archzona spatial partner will review your inquiry and connect with you shortly.
                </p>
                {attachedFile && (
                  <p className="text-xs font-mono text-[#D4AF37]">
                    Attached File: {attachedFile.name} ({(attachedFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <a
                    href={buildSubmittedWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-sans-clean uppercase tracking-wider rounded-xl transition-all shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" /> Continue on WhatsApp
                  </a>
                  <a
                    href={buildSubmittedMailtoUrl()}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#141311] border border-[#D1C7B7]/40 hover:border-[#D1C7B7] text-[#F7F5F0] font-bold text-xs font-sans-clean uppercase tracking-wider rounded-xl transition-all shadow-md"
                  >
                    <Mail className="w-4 h-4 text-[#D1C7B7]" /> Open Mail Client
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans-clean">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#8C8273] block mb-1 font-mono">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ar. Rajesh Shinde"
                      className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/25 rounded-lg p-2.5 text-xs text-[#F7F5F0] placeholder-[#8C8273] focus:outline-none focus:border-[#D1C7B7] transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#8C8273] block mb-1 font-mono">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/25 rounded-lg p-2.5 text-xs text-[#F7F5F0] placeholder-[#8C8273] focus:outline-none focus:border-[#D1C7B7] transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#8C8273] block mb-1 font-mono">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="architect@domain.com"
                      className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/25 rounded-lg p-2.5 text-xs text-[#F7F5F0] placeholder-[#8C8273] focus:outline-none focus:border-[#D1C7B7] transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#8C8273] block mb-1 font-mono">
                      Firm / Studio Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.firm}
                      onChange={(e) => setFormData({ ...formData, firm: e.target.value })}
                      placeholder="e.g. Studio Morph"
                      className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/25 rounded-lg p-2.5 text-xs text-[#F7F5F0] placeholder-[#8C8273] focus:outline-none focus:border-[#D1C7B7] transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#8C8273] block mb-1 font-mono">
                      Project Type
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/25 rounded-lg p-2.5 text-xs text-[#F7F5F0] focus:outline-none focus:border-[#D1C7B7]"
                    >
                      <option value="Villa / Residential">Private Villa / Residential</option>
                      <option value="Resort / Hospitality">Resort / Hospitality</option>
                      <option value="Poolside / Terrace Deck">Poolside / Terrace Deck</option>
                      <option value="Farmhouse / Chalet">Farmhouse / Chalet</option>
                      <option value="Commercial / Civic">Commercial / Civic</option>
                      <option value="Material Sample Request">Material Sample Request Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#8C8273] block mb-1 font-mono">
                      Project Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Alibaug, Goa, Pune, Mumbai"
                      className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/25 rounded-lg p-2.5 text-xs text-[#F7F5F0] placeholder-[#8C8273] focus:outline-none focus:border-[#D1C7B7] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#8C8273] block mb-1 font-mono">
                    Message or Drawing Notes
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the space, expected square footage, timeline, or specific materials you wish to explore..."
                    className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/25 rounded-lg p-2.5 text-xs text-[#F7F5F0] placeholder-[#8C8273] focus:outline-none focus:border-[#D1C7B7] transition-all"
                  />
                </div>

                {/* FILE UPLOADER FOR CAD DRAWINGS & PDF SPECIFICATIONS */}
                <div className="space-y-1.5 pt-1">
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
                        Click to upload .pdf, .dwg, .dxf, .cad, .zip, or images
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

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 bg-[#F7F5F0] hover:bg-[#D1C7B7] disabled:opacity-50 text-[#0D0C0A] text-xs font-bold font-sans-clean uppercase tracking-[0.2em] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#0D0C0A]" />
                        <span>SENDING INQUIRY...</span>
                      </>
                    ) : (
                      <>
                        <span>SEND CONSULTATION REQUEST</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <a
                    href={whatsAppDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-sans-clean uppercase tracking-[0.18em] rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WHATSAPP</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
