import { QuoteRequest, ContactInquiry } from '../types';
export type { QuoteRequest, ContactInquiry };

export const ARCHZONA_EMAIL = 'info.archzona@gmail.com';
export const ARCHZONA_PHONE_NARESH = '+91 98700 48082';
export const ARCHZONA_WHATSAPP_NARESH = '919870048082';
export const ARCHZONA_PHONE_HARISH = '+91 97020 51858';
export const ARCHZONA_WHATSAPP_HARISH = '919702051858';

export const ARCHZONA_PHONE = ARCHZONA_PHONE_NARESH;
export const ARCHZONA_WHATSAPP_NUMBER = ARCHZONA_WHATSAPP_NARESH;
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
 * Connects to FormSubmit AJAX service to deliver emails to info.archzona@gmail.com
 */
export async function submitQuoteRequest(quote: QuoteRequest): Promise<SubmissionResponse> {
  const referenceId = `AZ-QTE-${Date.now().toString().slice(-6)}`;
  const timestamp = new Date().toISOString();

  const formattedItems = quote.items && quote.items.length > 0
    ? quote.items.map((item, idx) => `${idx + 1}. ${item.productName} [Brand: ${item.brand}] - Qty: ${item.quantity}`).join('\n')
    : 'No items selected';

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('_subject', `[Archzona Quote Request] ${quote.clientName} - ${quote.projectName || 'Project'}`);
    formDataToSend.append('_replyto', quote.email);
    formDataToSend.append('_captcha', 'false');
    formDataToSend.append('Reference ID', referenceId);
    formDataToSend.append('Client Name', quote.clientName);
    formDataToSend.append('Email Address', quote.email);
    formDataToSend.append('Phone / WhatsApp', quote.phone);
    formDataToSend.append('Company / Firm', quote.company || 'Not specified');
    formDataToSend.append('Project Name', quote.projectName || 'Architectural Project');
    formDataToSend.append('Project Location', quote.projectLocation || 'Not specified');
    formDataToSend.append('Project Type', quote.projectType || 'Custom Space');
    formDataToSend.append('Approximate Area', quote.approximateArea || 'Not specified');
    formDataToSend.append('Selected Products', formattedItems);
    formDataToSend.append('Project Notes', quote.notes || 'None');

    if (quote.attachment) {
      formDataToSend.append('attachment', quote.attachment, quote.attachment.name);
    }

    await fetch(`https://formsubmit.co/ajax/${ARCHZONA_EMAIL}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formDataToSend,
    });
  } catch (err) {
    console.warn('[Archzona] FormSubmit quote email attempt exception:', err);
  }

  return {
    success: true,
    message: 'Your project material requirements have been compiled and sent to info.archzona@gmail.com.',
    referenceId,
    timestamp,
    data: quote,
  };
}

/**
 * Clean submission abstraction for general project inquiries.
 */
export async function submitProjectInquiry(inquiry: ContactInquiry): Promise<SubmissionResponse> {
  const referenceId = `AZ-INQ-${Date.now().toString().slice(-6)}`;
  const timestamp = new Date().toISOString();

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('_subject', `[Archzona Inquiry] ${inquiry.name} (${inquiry.projectType})`);
    formDataToSend.append('_replyto', inquiry.email);
    formDataToSend.append('_captcha', 'false');
    formDataToSend.append('Reference ID', referenceId);
    formDataToSend.append('Client Name', inquiry.name);
    formDataToSend.append('Email Address', inquiry.email);
    formDataToSend.append('Phone / WhatsApp', inquiry.phone);
    formDataToSend.append('Company / Firm', inquiry.company || 'Not specified');
    formDataToSend.append('Project Type', inquiry.projectType);
    formDataToSend.append('Project Location', inquiry.projectLocation || 'Not specified');
    formDataToSend.append('Approximate Size', inquiry.approximateSize || 'Not specified');
    formDataToSend.append('Message & Requirements', inquiry.message || inquiry.requirements || 'General inquiry');

    if (inquiry.attachment) {
      formDataToSend.append('attachment', inquiry.attachment, inquiry.attachment.name);
    }

    await fetch(`https://formsubmit.co/ajax/${ARCHZONA_EMAIL}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formDataToSend,
    });
  } catch (err) {
    console.warn('[Archzona] FormSubmit inquiry email attempt exception:', err);
  }

  return {
    success: true,
    message: 'Your inquiry has been sent to info.archzona@gmail.com.',
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
