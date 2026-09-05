import { QuoteRequest, ContactInquiry } from '../types';
export type { QuoteRequest, ContactInquiry };

export const ARCHZONA_EMAIL = 'info.archzona@gmail.com';
export const ARCHZONA_PHONE = '+91 98700 48082';
export const ARCHZONA_WHATSAPP_NUMBER = '919870048082';
export const ARCHZONA_ADDRESS_LINE1 = '105, Prism Industrial Estate, Near Pendharkar College, Dombivli (E)';
export const ARCHZONA_ADDRESS_LINE2 = 'Thane, Maharashtra, India';
export const ARCHZONA_MAPS_URL = 'https://maps.app.goo.gl/2ZGJW9GQhbkKXW6s7';

export interface SubmissionResponse {
  success: boolean;
  message: string;
  referenceId: string;
  timestamp: string;
  data: any;
}

/**
 * Clean submission abstraction for project quote requests.
 * Prepared for pluggable backend, Supabase Edge Function, or transactional email service.
 */
export async function submitQuoteRequest(quote: QuoteRequest): Promise<SubmissionResponse> {
  // Simulate network flight with micro-delay for UX feedback
  await new Promise((resolve) => setTimeout(resolve, 800));

  const referenceId = `AZ-QTE-${Date.now().toString().slice(-6)}`;
  const timestamp = new Date().toISOString();

  // In production, this can invoke an API route or serverless function
  console.log('[Archzona] Quote Request Submitted to', ARCHZONA_EMAIL, {
    referenceId,
    timestamp,
    quote,
  });

  return {
    success: true,
    message: 'Your project material requirements have been compiled and sent to the Archzona project team.',
    referenceId,
    timestamp,
    data: quote,
  };
}

/**
 * Clean submission abstraction for general project inquiries.
 */
export async function submitProjectInquiry(inquiry: ContactInquiry): Promise<SubmissionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const referenceId = `AZ-INQ-${Date.now().toString().slice(-6)}`;
  const timestamp = new Date().toISOString();

  console.log('[Archzona] Project Inquiry Submitted to', ARCHZONA_EMAIL, {
    referenceId,
    timestamp,
    inquiry,
  });

  return {
    success: true,
    message: 'Your inquiry has been received. An Archzona spatial partner will reach out within 24 hours.',
    referenceId,
    timestamp,
    data: inquiry,
  };
}

/**
 * Generates an architectural WhatsApp message format as required in Master Prompt Section 35:
 *
 * ARCHZONA PROJECT QUOTE REQUEST
 * Project:
 * Location:
 * Selected Products:
 * 1. ...
 * Approx. Area:
 * Notes:
 */
export function generateWhatsAppQuoteUrl(quote: QuoteRequest): string {
  let text = `*ARCHZONA PROJECT QUOTE REQUEST*\n\n`;
  text += `*Project:* ${quote.projectName || 'Not specified'}\n`;
  text += `*Location:* ${quote.projectLocation || 'Not specified'}\n`;
  text += `*Client Name:* ${quote.clientName}\n`;
  text += `*Contact:* ${quote.phone} (${quote.email})\n`;
  if (quote.company) text += `*Company:* ${quote.company}\n`;
  text += `*Project Type:* ${quote.projectType || 'Custom Space'}\n`;
  text += `*Approx. Area:* ${quote.approximateArea || 'To be determined'}\n\n`;

  if (quote.items && quote.items.length > 0) {
    text += `*Selected Products & Materials:*\n`;
    quote.items.forEach((item, idx) => {
      text += `${idx + 1}. *${item.productName}* [${item.material.toUpperCase()}]\n`;
      text += `   - Brand: ${item.brand}\n`;
      text += `   - Quantity: ${item.quantity} units\n`;
      if (item.areaSqFt > 0) text += `   - Area: ${item.areaSqFt} sq ft\n`;
      if (item.notes) text += `   - Item Note: ${item.notes}\n`;
    });
    text += `\n`;
  }

  if (quote.customStructureConfig) {
    text += `*Custom Structure Configuration:*\n`;
    const cfg = quote.customStructureConfig;
    Object.entries(cfg).forEach(([k, v]) => {
      if (v) text += `   - ${k}: ${v}\n`;
    });
    text += `\n`;
  }

  if (quote.notes) {
    text += `*Project Notes & Requirements:*\n${quote.notes}\n\n`;
  }

  text += `_Sent via Archzona Structures Digital Experience Centre_`;

  return `https://wa.me/${ARCHZONA_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function generateWhatsAppInquiryUrl(inquiry: ContactInquiry): string {
  let text = `*ARCHZONA SPATIAL INQUIRY*\n\n`;
  text += `*Name:* ${inquiry.name}\n`;
  text += `*Contact:* ${inquiry.phone} | ${inquiry.email}\n`;
  if (inquiry.company) text += `*Company:* ${inquiry.company}\n`;
  text += `*Project Type:* ${inquiry.projectType}\n`;
  text += `*Location:* ${inquiry.projectLocation}\n`;
  text += `*Approx. Size:* ${inquiry.approximateSize || 'Not specified'}\n\n`;
  text += `*Requirements:* ${inquiry.requirements}\n`;
  if (inquiry.message) text += `*Message:* ${inquiry.message}\n\n`;
  text += `_Sent via Archzona Structures Digital Experience Centre_`;

  return `https://wa.me/${ARCHZONA_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
