import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Receipt,
  PlusCircle,
  Settings,
  LogOut,
  Download,
  Search,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Clock,
  Building,
  ShieldAlert,
  FileText,
  FileCheck,
  RefreshCw
} from 'lucide-react';
import { Quotation, Invoice, OwnerUser, AdminDashboardMetrics } from '../../types/adminTypes';
import {
  getQuotations,
  getInvoices,
  getOwnerProfile,
  saveOwnerProfile,
  getDashboardMetrics,
  setLoggedInSession,
  convertQuoteToInvoice,
  deleteQuotation,
  exportDataJSON,
  importDataJSON
} from '../../utils/adminStorage';
import { downloadQuotationPDF, downloadInvoicePDF } from '../../utils/pdfGenerator';
import { QuoteBuilderView } from './QuoteBuilderView';
import { InvoiceDetailModal } from './InvoiceDetailModal';

interface AdminLayoutProps {
  onLogout: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quotes' | 'invoices' | 'builder' | 'settings'>('dashboard');
  const [editingQuote, setEditingQuote] = useState<Quotation | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Refresh trigger for data updates
  const [refreshKey, setRefreshKey] = useState(0);

  const reloadData = () => setRefreshKey((prev) => prev + 1);

  const ownerProfile = getOwnerProfile();
  const quotes = getQuotations();
  const invoices = getInvoices();
  const metrics = getDashboardMetrics();

  // Search & Filters
  const [quoteSearch, setQuoteSearch] = useState('');
  const [quoteStatusFilter, setQuoteStatusFilter] = useState<string>('all');

  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<string>('all');

  // Settings State
  const [companySettings, setCompanySettings] = useState<OwnerUser>(ownerProfile);
  const [settingsMsg, setSettingsMsg] = useState('');

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.id.toLowerCase().includes(quoteSearch.toLowerCase()) ||
      q.client.name.toLowerCase().includes(quoteSearch.toLowerCase()) ||
      (q.client.projectName && q.client.projectName.toLowerCase().includes(quoteSearch.toLowerCase()));
    const matchesStatus = quoteStatusFilter === 'all' || q.status === quoteStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      inv.quoteId.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      inv.client.name.toLowerCase().includes(invoiceSearch.toLowerCase());
    const matchesStatus = invoiceStatusFilter === 'all' || inv.status === invoiceStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConvertQuote = (quoteId: string) => {
    const createdInvoice = convertQuoteToInvoice(quoteId);
    if (createdInvoice) {
      reloadData();
      setSelectedInvoice(createdInvoice);
      setActiveTab('invoices');
    }
  };

  const handleDeleteQuote = (quoteId: string) => {
    if (confirm(`Are you sure you want to delete quotation ${quoteId}?`)) {
      deleteQuotation(quoteId);
      reloadData();
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveOwnerProfile(companySettings);
    setSettingsMsg('Company & Bank RTGS details saved successfully!');
    setTimeout(() => setSettingsMsg(''), 4000);
    reloadData();
  };

  const handleExportBackup = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `archzona_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importDataJSON(content)) {
        alert('Data backup imported successfully!');
        reloadData();
      } else {
        alert('Failed to import backup file. Ensure it is valid Archzona JSON format.');
      }
    };
    reader.readAsText(file);
  };

  const handlePerformLogout = () => {
    setLoggedInSession(false);
    onLogout();
  };

  return (
    <div key={refreshKey} className="min-h-screen bg-[#0D0C0A] text-[#F7F5F0] font-sans-clean flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#141311]/95 backdrop-blur-md border-b border-[#D1C7B7]/20 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="font-serif-title font-bold text-xl text-[#F7F5F0] tracking-tight">ARCHZONA</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#D1C7B7]/15 border border-[#D1C7B7]/30 text-[#D1C7B7] font-mono">
              admin.archzonestructures.com
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setEditingQuote(null);
              setActiveTab('builder');
            }}
            className="px-4 py-2 rounded-xl bg-[#D1C7B7] hover:bg-[#F7F5F0] text-[#0D0C0A] font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Create Quote</span>
          </button>

          <div className="h-5 w-[1px] bg-[#D1C7B7]/20" />

          <button
            onClick={handlePerformLogout}
            className="p-2 rounded-xl bg-[#0D0C0A] border border-[#D1C7B7]/20 text-[#8C8273] hover:text-red-400 hover:border-red-500/40 transition-colors cursor-pointer"
            title="Sign Out Owner"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-2 overflow-x-auto border-b border-[#D1C7B7]/15 pb-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#D1C7B7]/20 border border-[#D1C7B7] text-[#F7F5F0]'
                : 'text-[#8C8273] hover:text-[#F7F5F0]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'quotes'
                ? 'bg-[#D1C7B7]/20 border border-[#D1C7B7] text-[#F7F5F0]'
                : 'text-[#8C8273] hover:text-[#F7F5F0]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Pre-Tax Quotes ({quotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-[#D1C7B7]/20 border border-[#D1C7B7] text-[#F7F5F0]'
                : 'text-[#8C8273] hover:text-[#F7F5F0]'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Tax Invoices ({invoices.length})</span>
          </button>

          <button
            onClick={() => {
              setEditingQuote(null);
              setActiveTab('builder');
            }}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'builder'
                ? 'bg-[#D1C7B7]/20 border border-[#D1C7B7] text-[#F7F5F0]'
                : 'text-[#8C8273] hover:text-[#F7F5F0]'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Quote Builder</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#D1C7B7]/20 border border-[#D1C7B7] text-[#F7F5F0]'
                : 'text-[#8C8273] hover:text-[#F7F5F0]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Company & Bank Settings</span>
          </button>
        </nav>

        {/* TAB 1: DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#141311] border border-[#D1C7B7]/20 space-y-2">
                <div className="flex items-center justify-between text-[#8C8273]">
                  <span className="text-xs uppercase tracking-wider font-bold">Total Invoiced (Inc. GST)</span>
                  <Receipt className="w-4 h-4 text-[#D1C7B7]" />
                </div>
                <div className="text-2xl font-serif-title font-bold text-[#F7F5F0]">
                  ₹{metrics.totalInvoiced.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-[#8C8273] block">Across {invoices.length} official tax invoices</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#141311] border border-[#D1C7B7]/20 space-y-2">
                <div className="flex items-center justify-between text-[#8C8273]">
                  <span className="text-xs uppercase tracking-wider font-bold">Revenue Collected</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-serif-title font-bold text-emerald-400">
                  ₹{metrics.totalCollected.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-[#8C8273] block">{metrics.paidInvoicesCount} fully paid invoices</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#141311] border border-[#D1C7B7]/20 space-y-2">
                <div className="flex items-center justify-between text-[#8C8273]">
                  <span className="text-xs uppercase tracking-wider font-bold">Balance Outstanding</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-serif-title font-bold text-amber-400">
                  ₹{metrics.outstandingBalance.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-[#8C8273] block">Pending collection from clients</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#141311] border border-[#D1C7B7]/20 space-y-2">
                <div className="flex items-center justify-between text-[#8C8273]">
                  <span className="text-xs uppercase tracking-wider font-bold">Active Quotations</span>
                  <FileSpreadsheet className="w-4 h-4 text-[#D1C7B7]" />
                </div>
                <div className="text-2xl font-serif-title font-bold text-[#F7F5F0]">
                  {quotes.length} <span className="text-xs font-sans text-[#8C8273]">Quotes</span>
                </div>
                <span className="text-[11px] text-[#D1C7B7] block">{metrics.pendingQuotesCount} pending client approval</span>
              </div>
            </div>

            {/* Quick Actions & Recent Quotes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Pre-Tax Quotes */}
              <div className="p-6 rounded-2xl bg-[#141311] border border-[#D1C7B7]/20 space-y-4">
                <div className="flex items-center justify-between border-b border-[#D1C7B7]/15 pb-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#D1C7B7]">
                    Recent Pre-Tax Commercial Quotes
                  </h3>
                  <button
                    onClick={() => setActiveTab('quotes')}
                    className="text-xs text-[#D1C7B7] hover:underline flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {quotes.slice(0, 4).map((q) => (
                    <div key={q.id} className="p-3 rounded-xl bg-[#0D0C0A] border border-[#D1C7B7]/15 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-[#D1C7B7]">{q.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            q.status === 'accepted' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            q.status === 'invoiced' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                            'bg-[#D1C7B7]/15 text-[#D1C7B7]'
                          }`}>
                            {q.status}
                          </span>
                        </div>
                        <p className="text-[#F7F5F0] font-medium mt-1">{q.client.name} &bull; {q.client.projectName || 'Architectural Project'}</p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-[#F7F5F0]">₹{q.netPreTaxTotal.toLocaleString('en-IN')}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          {q.status === 'accepted' && (
                            <button
                              onClick={() => handleConvertQuote(q.id)}
                              className="text-[11px] text-emerald-400 hover:underline font-bold"
                            >
                              Convert to Invoice
                            </button>
                          )}
                          <button
                            onClick={() => downloadQuotationPDF(q, ownerProfile)}
                            className="text-[#8C8273] hover:text-[#F7F5F0]"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Tax Invoices */}
              <div className="p-6 rounded-2xl bg-[#141311] border border-[#D1C7B7]/20 space-y-4">
                <div className="flex items-center justify-between border-b border-[#D1C7B7]/15 pb-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-[#D1C7B7]">
                    Recent Tax Invoices & Payments
                  </h3>
                  <button
                    onClick={() => setActiveTab('invoices')}
                    className="text-xs text-[#D1C7B7] hover:underline flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-3">
                  {invoices.slice(0, 4).map((inv) => (
                    <div key={inv.id} className="p-3 rounded-xl bg-[#0D0C0A] border border-[#D1C7B7]/15 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-[#F7F5F0]">{inv.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            inv.status === 'paid' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            inv.status === 'partially_paid' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            'bg-red-950 text-red-300 border border-red-800'
                          }`}>
                            {inv.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[#D1C7B7] font-medium mt-1">{inv.client.name}</p>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-[#F7F5F0]">₹{inv.grandTotal.toLocaleString('en-IN')}</span>
                        <div className="flex items-center justify-end space-x-2 mt-1">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="text-[11px] text-[#D1C7B7] hover:underline font-medium"
                          >
                            Details / Pay
                          </button>
                          <button
                            onClick={() => downloadInvoicePDF(inv, ownerProfile)}
                            className="text-[#8C8273] hover:text-[#F7F5F0]"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUOTATIONS MANAGER */}
        {activeTab === 'quotes' && (
          <div className="p-6 rounded-2xl bg-[#141311] border border-[#D1C7B7]/20 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D1C7B7]/15 pb-4">
              <div>
                <h3 className="text-lg font-serif-title font-bold text-[#F7F5F0]">Pre-Tax Commercial Quotations</h3>
                <p className="text-xs text-[#8C8273]">
                  Issued commercial estimates before tax. Once accepted by the end party, convert into a Tax Invoice.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8273]" />
                  <input
                    type="text"
                    value={quoteSearch}
                    onChange={(e) => setQuoteSearch(e.target.value)}
                    placeholder="Search by client or quote ID..."
                    className="pl-9 pr-4 py-1.5 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-xl text-xs text-[#F7F5F0] focus:outline-none"
                  />
                </div>

                <select
                  value={quoteStatusFilter}
                  onChange={(e) => setQuoteStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-xl text-xs text-[#F7F5F0] focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="issued">Issued</option>
                  <option value="accepted">Accepted</option>
                  <option value="invoiced">Invoiced</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0D0C0A] text-[#8C8273] uppercase tracking-wider border-b border-[#D1C7B7]/15">
                  <tr>
                    <th className="py-3 px-3">Quote ID</th>
                    <th className="py-3 px-3">Client & Project</th>
                    <th className="py-3 px-3">Quote Date</th>
                    <th className="py-3 px-3 text-right">Pre-Tax Total</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D1C7B7]/10 text-[#F7F5F0]">
                  {filteredQuotes.map((q) => (
                    <tr key={q.id} className="hover:bg-[#0D0C0A]/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#D1C7B7]">{q.id}</td>
                      <td className="py-3 px-3">
                        <p className="font-semibold">{q.client.name}</p>
                        <p className="text-[11px] text-[#8C8273]">{q.client.projectName || 'Architectural Project'}</p>
                      </td>
                      <td className="py-3 px-3 text-[#8C8273]">{q.date}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold">
                        ₹{q.netPreTaxTotal.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          q.status === 'accepted' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          q.status === 'invoiced' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                          'bg-[#D1C7B7]/15 text-[#D1C7B7]'
                        }`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        {q.status === 'accepted' && (
                          <button
                            onClick={() => handleConvertQuote(q.id)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[11px] font-bold cursor-pointer"
                          >
                            Convert &rarr; Invoice
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingQuote(q);
                            setActiveTab('builder');
                          }}
                          className="px-2 py-1 bg-[#D1C7B7]/15 text-[#D1C7B7] hover:text-[#F7F5F0] rounded text-[11px] font-semibold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => downloadQuotationPDF(q, ownerProfile)}
                          className="p-1 text-[#8C8273] hover:text-[#F7F5F0]"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INVOICES MANAGER */}
        {activeTab === 'invoices' && (
          <div className="p-6 rounded-2xl bg-[#141311] border border-[#D1C7B7]/20 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D1C7B7]/15 pb-4">
              <div>
                <h3 className="text-lg font-serif-title font-bold text-[#F7F5F0]">Official Tax Invoices</h3>
                <p className="text-xs text-[#8C8273]">
                  Final GST compliance tax invoices generated from accepted quotes. Record client payments and track balances.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8273]" />
                  <input
                    type="text"
                    value={invoiceSearch}
                    onChange={(e) => setInvoiceSearch(e.target.value)}
                    placeholder="Search invoice or client..."
                    className="pl-9 pr-4 py-1.5 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-xl text-xs text-[#F7F5F0] focus:outline-none"
                  />
                </div>

                <select
                  value={invoiceStatusFilter}
                  onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-xl text-xs text-[#F7F5F0] focus:outline-none"
                >
                  <option value="all">All Payment Statuses</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="partially_paid">Partially Paid</option>
                  <option value="paid">Fully Paid</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0D0C0A] text-[#8C8273] uppercase tracking-wider border-b border-[#D1C7B7]/15">
                  <tr>
                    <th className="py-3 px-3">Invoice ID</th>
                    <th className="py-3 px-3">Linked Quote</th>
                    <th className="py-3 px-3">Client</th>
                    <th className="py-3 px-3 text-right">Grand Total (Inc. GST)</th>
                    <th className="py-3 px-3 text-right">Paid</th>
                    <th className="py-3 px-3 text-right">Balance Due</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D1C7B7]/10 text-[#F7F5F0]">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#0D0C0A]/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#F7F5F0]">{inv.id}</td>
                      <td className="py-3 px-3 font-mono text-[#8C8273]">{inv.quoteId}</td>
                      <td className="py-3 px-3 font-semibold">{inv.client.name}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold">₹{inv.grandTotal.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-400">₹{inv.amountPaid.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right font-mono text-amber-400">₹{inv.balanceDue.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inv.status === 'paid' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          inv.status === 'partially_paid' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-red-950 text-red-300 border border-red-800'
                        }`}>
                          {inv.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-2.5 py-1 bg-[#D1C7B7] hover:bg-[#F7F5F0] text-[#0D0C0A] rounded text-[11px] font-bold cursor-pointer"
                        >
                          View / Record Pay
                        </button>
                        <button
                          onClick={() => downloadInvoicePDF(inv, ownerProfile)}
                          className="p-1 text-[#8C8273] hover:text-[#F7F5F0]"
                          title="Download Tax Invoice PDF"
                        >
                          <Download className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: QUOTE BUILDER VIEW */}
        {activeTab === 'builder' && (
          <QuoteBuilderView
            initialQuote={editingQuote}
            onBack={() => setActiveTab('quotes')}
            onSaved={() => {
              reloadData();
              setActiveTab('quotes');
            }}
          />
        )}

        {/* TAB 5: COMPANY & BANK SETTINGS */}
        {activeTab === 'settings' && (
          <div className="p-6 rounded-2xl bg-[#141311] border border-[#D1C7B7]/20 space-y-6">
            <div>
              <h3 className="text-lg font-serif-title font-bold text-[#F7F5F0]">Archzona Company & Bank Details</h3>
              <p className="text-xs text-[#8C8273]">
                These details are printed on all generated pre-tax commercial quotations and official tax invoices.
              </p>
            </div>

            {settingsMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{settingsMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#8C8273] mb-1">Company Legal Name</label>
                  <input
                    type="text"
                    value={companySettings.companyName}
                    onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8C8273] mb-1">Owner Contact Phone</label>
                  <input
                    type="text"
                    value={companySettings.phone}
                    onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8C8273] mb-1">Owner Email</label>
                  <input
                    type="email"
                    value={companySettings.email}
                    onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#8C8273] mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    value={companySettings.gstin}
                    onChange={(e) => setCompanySettings({ ...companySettings, gstin: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0] font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-[#8C8273] mb-1">Registered Address</label>
                  <input
                    type="text"
                    value={companySettings.address}
                    onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#D1C7B7]/15">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[#D1C7B7] mb-3">
                  Bank Account Details (Printed on Invoices for RTGS / NEFT)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-[#8C8273] mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={companySettings.bankDetails.bankName}
                      onChange={(e) => setCompanySettings({
                        ...companySettings,
                        bankDetails: { ...companySettings.bankDetails, bankName: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#8C8273] mb-1">Account Number</label>
                    <input
                      type="text"
                      value={companySettings.bankDetails.accountNumber}
                      onChange={(e) => setCompanySettings({
                        ...companySettings,
                        bankDetails: { ...companySettings.bankDetails, accountNumber: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#8C8273] mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={companySettings.bankDetails.ifscCode}
                      onChange={(e) => setCompanySettings({
                        ...companySettings,
                        bankDetails: { ...companySettings.bankDetails, ifscCode: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-[#0D0C0A] border border-[#D1C7B7]/20 rounded-lg text-xs text-[#F7F5F0] font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#D1C7B7]/15">
                <div className="flex items-center space-x-3 text-xs">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="px-3 py-1.5 rounded-lg bg-[#0D0C0A] border border-[#D1C7B7]/20 text-[#D1C7B7] hover:text-[#F7F5F0]"
                  >
                    Export JSON Backup
                  </button>

                  <label className="px-3 py-1.5 rounded-lg bg-[#0D0C0A] border border-[#D1C7B7]/20 text-[#D1C7B7] hover:text-[#F7F5F0] cursor-pointer">
                    <span>Import JSON Backup</span>
                    <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D1C7B7] hover:bg-[#F7F5F0] text-[#0D0C0A] font-bold text-xs cursor-pointer shadow-md"
                >
                  Save Profile & Bank Setup
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Invoice Details & Payment Modal */}
      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onUpdate={() => {
            reloadData();
            // refresh invoice state
            const updated = getInvoices().find((i) => i.id === selectedInvoice.id);
            if (updated) setSelectedInvoice(updated);
          }}
        />
      )}
    </div>
  );
};
