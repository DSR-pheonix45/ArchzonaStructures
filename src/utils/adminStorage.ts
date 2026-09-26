import { Quotation, Invoice, OwnerUser, PaymentRecord, AdminDashboardMetrics, DocumentType } from '../types/adminTypes';
import { syncQuoteToGSheet, syncInvoiceToGSheet } from './googleSheetsSync';

const STORAGE_KEYS = {
  SESSION: 'archzona_admin_session',
  QUOTES: 'archzona_quotes_v2',
  INVOICES: 'archzona_invoices_v2',
  OWNER_PROFILE: 'archzona_owner_profile_v1',
};

export const DEFAULT_OWNER_PROFILE: OwnerUser = {
  id: 'owner-1',
  email: 'info.archzona@gmail.com',
  name: 'Naresh & Harish (Archzone Structures by ARCHZONA)',
  role: 'owner',
  companyName: 'Archzone Structures by ARCHZONA',
  phone: '+91 98700 48082',
  address: '105, Prism Industrial Estate, Near Pendharkar College, Dombivli (E), Thane, Maharashtra 421201',
  gstin: '27AAFFA1234F1Z5',
  bankDetails: {
    bankName: 'Axis Bank',
    accountName: 'archzona',
    accountNumber: '923020053039794',
    ifscCode: 'UTIB0000125',
    branch: 'Main Branch',
  },
};

// Initial clean arrays for live business operational use
const INITIAL_SEED_QUOTES: Quotation[] = [];
const INITIAL_SEED_INVOICES: Invoice[] = [];

// --- STORAGE HELPER FUNCTIONS ---

export function getOwnerProfile(): OwnerUser {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OWNER_PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.bankDetails && parsed.bankDetails.upiId) {
        delete parsed.bankDetails.upiId;
      }
      // Ensure updated Axis Bank details take precedence over old dummy account
      if (!parsed.bankDetails || parsed.bankDetails.accountNumber === '50200088991122' || parsed.bankDetails.bankName === 'HDFC Bank Ltd') {
        parsed.bankDetails = DEFAULT_OWNER_PROFILE.bankDetails;
        localStorage.setItem(STORAGE_KEYS.OWNER_PROFILE, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error loading owner profile', err);
  }
  localStorage.setItem(STORAGE_KEYS.OWNER_PROFILE, JSON.stringify(DEFAULT_OWNER_PROFILE));
  return DEFAULT_OWNER_PROFILE;
}

export function saveOwnerProfile(profile: OwnerUser): void {
  localStorage.setItem(STORAGE_KEYS.OWNER_PROFILE, JSON.stringify(profile));
}

export function checkIsLoggedIn(): boolean {
  return localStorage.getItem(STORAGE_KEYS.SESSION) === 'active';
}

export function setLoggedInSession(active: boolean): void {
  if (active) {
    localStorage.setItem(STORAGE_KEYS.SESSION, 'active');
  } else {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }
}

export function getQuotations(): Quotation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUOTES);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading quotations', err);
  }
  // Initialize with seed data
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(INITIAL_SEED_QUOTES));
  return INITIAL_SEED_QUOTES;
}

export function saveQuotation(quote: Quotation): void {
  const quotes = getQuotations();
  const index = quotes.findIndex((q) => q.id === quote.id);
  const updatedQuote = index >= 0
    ? { ...quote, updatedAt: new Date().toISOString() }
    : { ...quote, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

  if (index >= 0) {
    quotes[index] = updatedQuote;
  } else {
    quotes.unshift(updatedQuote);
  }
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));

  // Trigger Google Sheet sync in background
  syncQuoteToGSheet(updatedQuote).catch(() => {});
}

export function deleteQuotation(quoteId: string): void {
  const quotes = getQuotations().filter((q) => q.id !== quoteId);
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
}

export function getInvoices(): Invoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading invoices', err);
  }
  // Initialize with seed data
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(INITIAL_SEED_INVOICES));
  return INITIAL_SEED_INVOICES;
}

export function saveInvoice(invoice: Invoice): void {
  const invoices = getInvoices();
  const index = invoices.findIndex((i) => i.id === invoice.id);
  const updatedInvoice = index >= 0
    ? { ...invoice, updatedAt: new Date().toISOString() }
    : { ...invoice, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

  if (index >= 0) {
    invoices[index] = updatedInvoice;
  } else {
    invoices.unshift(updatedInvoice);
  }
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));

  // Trigger Google Sheet sync in background
  syncInvoiceToGSheet(updatedInvoice).catch(() => {});
}

export function saveAllQuotations(quotes: Quotation[]): void {
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
}

export function saveAllInvoices(invoices: Invoice[]): void {
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
}

export function convertQuoteToInvoice(quoteId: string, taxType: 'CGST_SGST' | 'IGST' = 'CGST_SGST'): Invoice | null {
  const quotes = getQuotations();
  const quote = quotes.find((q) => q.id === quoteId);
  if (!quote) return null;

  // Generate next Invoice ID e.g. AZ-INV-2026-002
  const existingInvoices = getInvoices();
  const count = existingInvoices.length + 1;
  const year = new Date().getFullYear();
  const invoiceId = `AZ-INV-${year}-${count.toString().padStart(3, '0')}`;

  const subtotal = quote.netPreTaxTotal;
  let cgstPercent = 0;
  let sgstPercent = 0;
  let igstPercent = 0;
  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (taxType === 'CGST_SGST') {
    cgstPercent = 9;
    sgstPercent = 9;
    cgstAmount = Math.round(subtotal * 0.09 * 100) / 100;
    sgstAmount = Math.round(subtotal * 0.09 * 100) / 100;
  } else {
    igstPercent = 18;
    igstAmount = Math.round(subtotal * 0.18 * 100) / 100;
  }

  const totalTax = cgstAmount + sgstAmount + igstAmount;
  const grandTotal = Math.round((subtotal + totalTax) * 100) / 100;

  const todayStr = new Date().toISOString().split('T')[0];
  const dueDateObj = new Date();
  dueDateObj.setDate(dueDateObj.getDate() + 14);
  const dueDateStr = dueDateObj.toISOString().split('T')[0];

  // Transfer any advance payments previously recorded against this Quote/Proforma!
  const priorPayments: PaymentRecord[] = (quote.payments || []).map((p) => ({
    ...p,
    invoiceId: invoiceId,
  }));
  const initialAmountPaid = priorPayments.reduce((sum, p) => sum + p.amount, 0);
  const initialBalanceDue = Math.max(0, Math.round((grandTotal - initialAmountPaid) * 100) / 100);

  let status: Invoice['status'] = 'unpaid';
  if (initialBalanceDue <= 0) {
    status = 'paid';
  } else if (initialAmountPaid > 0) {
    status = 'partially_paid';
  }

  const newInvoice: Invoice = {
    id: invoiceId,
    docType: 'tax_invoice',
    quoteId: quote.id,
    client: { ...quote.client },
    issueDate: todayStr,
    dueDate: dueDateStr,
    items: [...quote.items],
    subtotal: subtotal,
    taxType,
    cgstPercent,
    cgstAmount,
    sgstPercent,
    sgstAmount,
    igstPercent,
    igstAmount,
    totalTax,
    grandTotal,
    amountPaid: initialAmountPaid,
    balanceDue: initialBalanceDue,
    status,
    notes: `Tax Invoice generated against agreed quote ${quote.id}.`,
    paymentTerms: quote.paymentTerms || 'Payment due within 14 days of invoice date.',
    payments: priorPayments,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Update quote status to 'invoiced' and link invoice ID
  quote.status = 'invoiced';
  quote.linkedInvoiceId = invoiceId;
  saveQuotation(quote);

  // Save the new invoice
  saveInvoice(newInvoice);

  return newInvoice;
}

export function recordQuotePayment(
  quoteId: string,
  payment: Omit<PaymentRecord, 'id' | 'invoiceId' | 'recordedAt'>
): Quotation | null {
  const quotes = getQuotations();
  const quote = quotes.find((q) => q.id === quoteId);
  if (!quote) return null;

  if (!quote.payments) quote.payments = [];

  const newRecord: PaymentRecord = {
    ...payment,
    id: `pay-${Date.now().toString().slice(-6)}`,
    invoiceId: quote.id,
    recordedAt: new Date().toISOString(),
  };

  quote.payments.push(newRecord);
  quote.amountPaid = quote.payments.reduce((sum, p) => sum + p.amount, 0);
  const total = quote.grandTotal || quote.netPreTaxTotal;
  quote.balanceDue = Math.max(0, Math.round((total - quote.amountPaid) * 100) / 100);

  if (quote.status === 'draft' || quote.status === 'issued' || quote.status === 'under_negotiation') {
    quote.status = 'accepted';
  }

  saveQuotation(quote);
  return quote;
}

export function recordPayment(
  invoiceId: string,
  payment: Omit<PaymentRecord, 'id' | 'invoiceId' | 'recordedAt'>
): Invoice | null {
  const invoices = getInvoices();
  const invoice = invoices.find((i) => i.id === invoiceId);
  if (!invoice) return null;

  const newRecord: PaymentRecord = {
    ...payment,
    id: `pay-${Date.now().toString().slice(-6)}`,
    invoiceId: invoice.id,
    recordedAt: new Date().toISOString(),
  };

  invoice.payments.push(newRecord);
  invoice.amountPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  invoice.balanceDue = Math.max(0, Math.round((invoice.grandTotal - invoice.amountPaid) * 100) / 100);

  if (invoice.balanceDue <= 0) {
    invoice.status = 'paid';
  } else if (invoice.amountPaid > 0) {
    invoice.status = 'partially_paid';
  }

  saveInvoice(invoice);
  return invoice;
}

export function recordUniversalTransaction(payload: {
  docId: string;
  amount: number;
  method: PaymentRecord['method'];
  transactionRef: string;
  bankAccount?: string;
  notes?: string;
  date?: string;
  autoConvertToInvoice?: boolean;
}): { quote?: Quotation | null; invoice?: Invoice | null } {
  const { docId, amount, method, transactionRef, bankAccount, notes, date, autoConvertToInvoice } = payload;
  const payDate = date || new Date().toISOString().split('T')[0];

  // 1. Try finding as Invoice first
  const invoices = getInvoices();
  const invoiceMatch = invoices.find((i) => i.id === docId);

  if (invoiceMatch) {
    const updatedInv = recordPayment(docId, {
      date: payDate,
      amount,
      method,
      transactionRef,
      bankAccount: bankAccount || 'Axis Bank',
      notes,
    });
    return { invoice: updatedInv };
  }

  // 2. Otherwise try finding as Quotation / Proforma
  const quotes = getQuotations();
  const quoteMatch = quotes.find((q) => q.id === docId);

  if (quoteMatch) {
    const updatedQuote = recordQuotePayment(docId, {
      date: payDate,
      amount,
      method,
      transactionRef,
      bankAccount: bankAccount || 'Axis Bank',
      notes,
    });

    if (autoConvertToInvoice) {
      const createdInvoice = convertQuoteToInvoice(docId);
      return { quote: updatedQuote, invoice: createdInvoice };
    }

    return { quote: updatedQuote };
  }

  return {};
}

export function recordQuoteNegotiation(
  quoteId: string,
  note: string,
  revisedTotal?: number,
  actor: string = 'Admin / Party'
): Quotation | null {
  const quotes = getQuotations();
  const quote = quotes.find((q) => q.id === quoteId);
  if (!quote) return null;

  if (!quote.negotiationHistory) quote.negotiationHistory = [];

  quote.negotiationHistory.push({
    id: `neg-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    note,
    revisedTotal,
    status: quote.status,
    actor,
  });

  if (revisedTotal && revisedTotal > 0) {
    quote.netPreTaxTotal = revisedTotal;
    if (quote.gstEnabled) {
      const taxRate = quote.taxType === 'IGST' ? 0.18 : 0.18;
      quote.totalTax = Math.round(revisedTotal * taxRate * 100) / 100;
      quote.grandTotal = Math.round((revisedTotal + quote.totalTax) * 100) / 100;
    } else {
      quote.grandTotal = revisedTotal;
    }
  }

  quote.status = 'under_negotiation';
  saveQuotation(quote);
  return quote;
}

export function getDashboardMetrics(): AdminDashboardMetrics {
  const quotes = getQuotations();
  const invoices = getInvoices();

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalInvoiceCollected = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalQuoteAdvances = quotes.reduce((sum, q) => sum + (q.amountPaid || 0), 0);
  const totalCollected = totalInvoiceCollected + totalQuoteAdvances;
  const outstandingBalance = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  const pendingQuotesCount = quotes.filter((q) => q.status === 'issued' || q.status === 'draft' || q.status === 'under_negotiation').length;
  const acceptedQuotesCount = quotes.filter((q) => q.status === 'accepted' || q.status === 'negotiated').length;
  const paidInvoicesCount = invoices.filter((i) => i.status === 'paid').length;

  return {
    totalInvoiced,
    totalCollected,
    outstandingBalance,
    pendingQuotesCount,
    acceptedQuotesCount,
    paidInvoicesCount,
  };
}

export function generateNextQuoteId(docType: DocumentType = 'quote'): string {
  const quotes = getQuotations();
  const count = quotes.length + 1;
  const year = new Date().getFullYear();
  const prefix = docType === 'proforma' ? 'AZ-PI' : docType === 'tax_invoice' ? 'AZ-INV' : 'AZ-QT';
  return `${prefix}-${year}-${count.toString().padStart(3, '0')}`;
}

export function exportDataJSON(): string {
  const exportPayload = {
    profile: getOwnerProfile(),
    quotes: getQuotations(),
    invoices: getInvoices(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(exportPayload, null, 2);
}

export function importDataJSON(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.profile) localStorage.setItem(STORAGE_KEYS.OWNER_PROFILE, JSON.stringify(data.profile));
    if (data.quotes) localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(data.quotes));
    if (data.invoices) localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(data.invoices));
    return true;
  } catch (err) {
    console.error('Import failed', err);
    return false;
  }
}

export function clearAllDemoData(): void {
  localStorage.removeItem('archzona_quotes_v1');
  localStorage.removeItem('archzona_invoices_v1');
  localStorage.removeItem(STORAGE_KEYS.QUOTES);
  localStorage.removeItem(STORAGE_KEYS.INVOICES);
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify([]));
}
