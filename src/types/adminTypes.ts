export type QuoteStatus = 'draft' | 'issued' | 'accepted' | 'invoiced' | 'declined';
export type InvoiceStatus = 'unpaid' | 'partially_paid' | 'paid' | 'overdue';
export type PaymentMethod = 'NEFT/RTGS' | 'UPI' | 'Cheque' | 'Cash' | 'Card';

export interface OwnerUser {
  id: string;
  email: string;
  name: string;
  role: 'owner';
  companyName: string;
  phone: string;
  address: string;
  gstin: string;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
    upiId?: string;
  };
}

export interface QuoteItem {
  id: string;
  productId?: string;
  name: string;
  description: string;
  category?: string;
  unit: string; // e.g. 'Sq. Ft.', 'Meters', 'Sets', 'Units', 'Lump Sum'
  quantity: number;
  unitRate: number; // Pre-tax rate per unit
  discountPercent: number; // Discount % per item
  netAmount: number; // calculated: quantity * unitRate * (1 - discountPercent/100)
}

export interface ClientDetails {
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  gstin?: string;
  billingAddress: string;
  shippingAddress?: string;
  projectName?: string;
  projectLocation?: string;
}

export interface Quotation {
  id: string; // e.g. 'AZ-QT-2026-001'
  client: ClientDetails;
  date: string; // YYYY-MM-DD
  validUntil: string; // YYYY-MM-DD
  items: QuoteItem[];
  subtotal: number; // Sum of pre-tax items netAmount
  overallDiscountPercent: number;
  overallDiscountAmount: number;
  netPreTaxTotal: number; // subtotal - overallDiscountAmount
  status: QuoteStatus;
  notes: string;
  paymentTerms: string;
  createdAt: string;
  updatedAt: string;
  linkedInvoiceId?: string; // Set when converted to invoice
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  transactionRef: string;
  notes?: string;
  recordedAt: string;
}

export interface Invoice {
  id: string; // e.g. 'AZ-INV-2026-001'
  quoteId: string; // Linked pre-tax quote ID
  client: ClientDetails;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  items: QuoteItem[];
  subtotal: number; // Pre-tax subtotal
  taxType: 'CGST_SGST' | 'IGST';
  cgstPercent: number; // e.g. 9
  cgstAmount: number;
  sgstPercent: number; // e.g. 9
  sgstAmount: number;
  igstPercent: number; // e.g. 18
  igstAmount: number;
  totalTax: number;
  grandTotal: number; // subtotal + totalTax
  amountPaid: number;
  balanceDue: number;
  status: InvoiceStatus;
  notes: string;
  paymentTerms: string;
  payments: PaymentRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboardMetrics {
  totalInvoiced: number;
  totalCollected: number;
  outstandingBalance: number;
  pendingQuotesCount: number;
  acceptedQuotesCount: number;
  paidInvoicesCount: number;
}
