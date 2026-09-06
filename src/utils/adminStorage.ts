import { Quotation, Invoice, OwnerUser, PaymentRecord, AdminDashboardMetrics } from '../types/adminTypes';

const STORAGE_KEYS = {
  SESSION: 'archzona_admin_session',
  QUOTES: 'archzona_quotes_v1',
  INVOICES: 'archzona_invoices_v1',
  OWNER_PROFILE: 'archzona_owner_profile_v1',
};

export const DEFAULT_OWNER_PROFILE: OwnerUser = {
  id: 'owner-1',
  email: 'info.archzona@gmail.com',
  name: 'Naresh & Harish (Archzona Owners)',
  role: 'owner',
  companyName: 'Archzona Structures LLP',
  phone: '+91 98700 48082',
  address: '105, Prism Industrial Estate, Near Pendharkar College, Dombivli (E), Thane, Maharashtra 421201',
  gstin: '27AAFFA1234F1Z5',
  bankDetails: {
    bankName: 'HDFC Bank Ltd',
    accountName: 'Archzona Structures LLP',
    accountNumber: '50200088991122',
    ifscCode: 'HDFC0000123',
    branch: 'Dombivli East Branch',
    upiId: 'archzona@hdfcbank',
  },
};

// Initial realistic seed data for Archzona Structures owner
const INITIAL_SEED_QUOTES: Quotation[] = [
  {
    id: 'AZ-QT-2026-001',
    client: {
      name: 'Vikramaditya Oberoi',
      companyName: 'Oberoi Luxury Estates',
      email: 'vikram.oberoi@oberoiestates.com',
      phone: '+91 98200 11223',
      gstin: '27AABCO9988K1ZP',
      billingAddress: 'Penthouse 42, Lodha Altamount, Altamount Road, Mumbai 400026',
      shippingAddress: 'Villa 14, Alibaug Waterfront, Alibaug, Raigad 402201',
      projectName: 'Alibaug Waterfront Villa Bioclimatic Pergola',
      projectLocation: 'Alibaug Waterfront, Maharashtra',
    },
    date: '2026-08-28',
    validUntil: '2026-09-28',
    items: [
      {
        id: 'qitem-1',
        productId: 'az-str-pergola-01',
        name: 'Architectural Aluminium Bioclimatic Motorized Pergola',
        description: 'Powder-coated architectural aluminium pergola with motorized weather-sensing louvers, integrated warm LED strip lighting (3000K), and rainwater drainage channels.',
        unit: 'Sq. Ft.',
        quantity: 450,
        unitRate: 1850,
        discountPercent: 5,
        netAmount: 791025,
      },
      {
        id: 'qitem-2',
        productId: 'mat-wp-deck-01',
        name: 'Thermo-Treated European Ash Wooden Decking System',
        description: 'Class 1 durability thermal wood deck boards with hidden clip installation sub-structure.',
        unit: 'Sq. Ft.',
        quantity: 450,
        unitRate: 650,
        discountPercent: 0,
        netAmount: 292500,
      },
      {
        id: 'qitem-3',
        name: 'On-Site Precision Installation & Structural Anchoring',
        description: 'Complete site preparation, foundation bracket fixing, motorized sensor wiring & commissioning by certified Archzona master installers.',
        unit: 'Lump Sum',
        quantity: 1,
        unitRate: 65000,
        discountPercent: 0,
        netAmount: 65000,
      },
    ],
    subtotal: 1148525,
    overallDiscountPercent: 2,
    overallDiscountAmount: 22970.5,
    netPreTaxTotal: 1125554.5,
    status: 'accepted',
    notes: 'Quote valid for 30 days. Includes 10-Year Structural Warranty and 3-Year Motor Warranty.',
    paymentTerms: '50% Advance on Purchase Order | 40% On Material Dispatch | 10% Post Handover Commissioning',
    createdAt: '2026-08-28T10:30:00Z',
    updatedAt: '2026-09-01T14:15:00Z',
  },
  {
    id: 'AZ-QT-2026-002',
    client: {
      name: 'Ananya Deshmukh',
      companyName: 'Studio Crafted Spaces',
      email: 'ananya@studiocrafted.in',
      phone: '+91 97699 44332',
      gstin: '27AABCS5544M1Z2',
      billingAddress: 'Suite 302, One BKC, Bandra Kurla Complex, Mumbai 400051',
      projectName: 'Bandra Penthouse Terrace Timber Cladding',
      projectLocation: 'Pali Hill, Bandra West, Mumbai',
    },
    date: '2026-09-02',
    validUntil: '2026-10-02',
    items: [
      {
        id: 'qitem-4',
        productId: 'mat-clad-02',
        name: 'Charred Japanese Shou Sugi Ban Accent Wall Cladding',
        description: 'Deep char carbonized timber panels with high UV weather seal for exterior elevation wall.',
        unit: 'Sq. Ft.',
        quantity: 280,
        unitRate: 1200,
        discountPercent: 0,
        netAmount: 336000,
      },
    ],
    subtotal: 336000,
    overallDiscountPercent: 0,
    overallDiscountAmount: 0,
    netPreTaxTotal: 336000,
    status: 'issued',
    notes: 'Sample swatches delivered on site. Installation timeline estimated 4 days from advance receipt.',
    paymentTerms: '60% Advance | 40% On Completion',
    createdAt: '2026-09-02T11:00:00Z',
    updatedAt: '2026-09-02T11:00:00Z',
  },
];

const INITIAL_SEED_INVOICES: Invoice[] = [
  {
    id: 'AZ-INV-2026-001',
    quoteId: 'AZ-QT-2026-001',
    client: {
      name: 'Vikramaditya Oberoi',
      companyName: 'Oberoi Luxury Estates',
      email: 'vikram.oberoi@oberoiestates.com',
      phone: '+91 98200 11223',
      gstin: '27AABCO9988K1ZP',
      billingAddress: 'Penthouse 42, Lodha Altamount, Altamount Road, Mumbai 400026',
      shippingAddress: 'Villa 14, Alibaug Waterfront, Alibaug, Raigad 402201',
      projectName: 'Alibaug Waterfront Villa Bioclimatic Pergola',
      projectLocation: 'Alibaug Waterfront, Maharashtra',
    },
    issueDate: '2026-09-01',
    dueDate: '2026-09-15',
    items: [
      {
        id: 'qitem-1',
        name: 'Architectural Aluminium Bioclimatic Motorized Pergola',
        description: 'Powder-coated architectural aluminium pergola with motorized weather-sensing louvers, integrated warm LED strip lighting (3000K).',
        unit: 'Sq. Ft.',
        quantity: 450,
        unitRate: 1850,
        discountPercent: 5,
        netAmount: 791025,
      },
      {
        id: 'qitem-2',
        name: 'Thermo-Treated European Ash Wooden Decking System',
        description: 'Class 1 durability thermal wood deck boards with hidden clip installation sub-structure.',
        unit: 'Sq. Ft.',
        quantity: 450,
        unitRate: 650,
        discountPercent: 0,
        netAmount: 292500,
      },
      {
        id: 'qitem-3',
        name: 'On-Site Precision Installation & Structural Anchoring',
        description: 'Complete site preparation, foundation bracket fixing, motorized sensor wiring & commissioning.',
        unit: 'Lump Sum',
        quantity: 1,
        unitRate: 65000,
        discountPercent: 0,
        netAmount: 65000,
      },
    ],
    subtotal: 1125554.5,
    taxType: 'CGST_SGST',
    cgstPercent: 9,
    cgstAmount: 101299.9,
    sgstPercent: 9,
    sgstAmount: 101299.9,
    igstPercent: 0,
    igstAmount: 0,
    totalTax: 202599.8,
    grandTotal: 1328154.3,
    amountPaid: 664077,
    balanceDue: 664077.3,
    status: 'partially_paid',
    notes: 'Official Tax Invoice issued following accepted quote AZ-QT-2026-001. GST @ 18% applied.',
    paymentTerms: '50% Advance received. 40% balance due on material dispatch.',
    payments: [
      {
        id: 'pay-1',
        invoiceId: 'AZ-INV-2026-001',
        date: '2026-09-02',
        amount: 664077,
        method: 'NEFT/RTGS',
        transactionRef: 'HDFCRN202609029981',
        notes: '50% Advance Payment received via HDFC Netbanking',
        recordedAt: '2026-09-02T16:20:00Z',
      },
    ],
    createdAt: '2026-09-01T15:00:00Z',
    updatedAt: '2026-09-02T16:20:00Z',
  },
];

// --- STORAGE HELPER FUNCTIONS ---

export function getOwnerProfile(): OwnerUser {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OWNER_PROFILE);
    if (raw) return JSON.parse(raw);
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
  if (index >= 0) {
    quotes[index] = { ...quote, updatedAt: new Date().toISOString() };
  } else {
    quotes.unshift({ ...quote, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
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
  if (index >= 0) {
    invoices[index] = { ...invoice, updatedAt: new Date().toISOString() };
  } else {
    invoices.unshift({ ...invoice, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
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

  const newInvoice: Invoice = {
    id: invoiceId,
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
    amountPaid: 0,
    balanceDue: grandTotal,
    status: 'unpaid',
    notes: `Tax Invoice generated against accepted quote ${quote.id}.`,
    paymentTerms: quote.paymentTerms || 'Payment due within 14 days of invoice date.',
    payments: [],
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

export function recordPayment(invoiceId: string, payment: Omit<PaymentRecord, 'id' | 'invoiceId' | 'recordedAt'>): Invoice | null {
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

export function getDashboardMetrics(): AdminDashboardMetrics {
  const quotes = getQuotations();
  const invoices = getInvoices();

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const outstandingBalance = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  const pendingQuotesCount = quotes.filter((q) => q.status === 'issued' || q.status === 'draft').length;
  const acceptedQuotesCount = quotes.filter((q) => q.status === 'accepted' || q.status === 'invoiced').length;
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

export function generateNextQuoteId(): string {
  const quotes = getQuotations();
  const count = quotes.length + 1;
  const year = new Date().getFullYear();
  return `AZ-QT-${year}-${count.toString().padStart(3, '0')}`;
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
