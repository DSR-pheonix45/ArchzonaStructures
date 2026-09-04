import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, MapPin, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import { ARCHZONA_EMAIL, ARCHZONA_PHONE, generateWhatsAppQuoteUrl } from '../utils/quoteWorkflow';

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

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const whatsAppDirectUrl = `https://wa.me/919870048082?text=${encodeURIComponent(
    `Hello Archzona, I am reaching out regarding architectural materials & structure execution.\nName: ${formData.name || 'Client'}\nLocation: ${formData.location || 'Not specified'}\nMessage: ${formData.message || 'Consultation inquiry'}`
  )}`;

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
                  href="https://wa.me/919870048082"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-white hover:bg-emerald-500/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-mono font-bold text-sm block text-emerald-300">{ARCHZONA_PHONE}</span>
                    <span className="text-[11px] text-[#D1C7B7] font-sans-clean">Chat directly with an engineer</span>
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

              {/* Phone Direct */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono text-[#8C8273] block">
                  VOICE CALL
                </span>
                <a
                  href={`tel:${ARCHZONA_PHONE}`}
                  className="flex items-center gap-3 p-3.5 bg-[#0D0C0A] rounded-xl border border-[#D1C7B7]/20 text-[#F7F5F0] hover:border-[#D1C7B7] transition-all cursor-pointer"
                >
                  <Phone className="w-5 h-5 text-[#D1C7B7] shrink-0" />
                  <div>
                    <span className="font-mono text-sm block text-[#F7F5F0]">{ARCHZONA_PHONE}</span>
                    <span className="text-[11px] text-[#8C8273] font-sans-clean">Mon - Sat: 9:30 AM to 7:00 PM</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Experience Studio Location */}
            <div className="p-8 bg-[#141311] rounded-2xl border border-[#D1C7B7]/25 text-[#F7F5F0] space-y-4 shadow-xl">
              <span className="text-xs uppercase tracking-[0.2em] text-[#D1C7B7] font-mono font-semibold block">
                HEADQUARTERS & DISPLAY WAREHOUSE
              </span>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D1C7B7] shrink-0 mt-1" />
                <div className="font-sans-clean text-xs leading-relaxed space-y-1">
                  <p className="font-serif-title text-xl text-[#F7F5F0]">Archzona Structures Experience Centre</p>
                  <p className="text-[#D1C7B7]">Western Industrial Zone, Goregaon East</p>
                  <p className="text-[#D1C7B7]">Mumbai, Maharashtra 400063, India</p>
                  <p className="text-[10px] text-[#8C8273] pt-1">Field installations across Maharashtra, Goa, Gujarat & Pan-India.</p>
                </div>
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
                <h4 className="font-serif-title text-2xl text-[#F7F5F0]">Inquiry Received</h4>
                <p className="text-xs font-sans-clean text-[#D1C7B7] max-w-md mx-auto leading-relaxed">
                  Thank you, {formData.name || 'Client'}. An Archzona architectural representative will review your inquiry and connect with you shortly.
                </p>
                <div className="pt-2">
                  <a
                    href={whatsAppDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-sans-clean uppercase tracking-wider rounded-xl transition-all shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" /> Continue on WhatsApp
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
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the space, expected square footage, timeline, or specific materials you wish to explore..."
                    className="w-full bg-[#0D0C0A] border border-[#D1C7B7]/25 rounded-lg p-2.5 text-xs text-[#F7F5F0] placeholder-[#8C8273] focus:outline-none focus:border-[#D1C7B7] transition-all"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 bg-[#F7F5F0] hover:bg-[#D1C7B7] text-[#0D0C0A] text-xs font-bold font-sans-clean uppercase tracking-[0.2em] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>SEND CONSULTATION REQUEST</span>
                    <Send className="w-4 h-4" />
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
