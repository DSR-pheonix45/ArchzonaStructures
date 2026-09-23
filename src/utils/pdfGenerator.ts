import { jsPDF } from 'jspdf';
import { Quotation, Invoice, OwnerUser, DocumentType } from '../types/adminTypes';

/**
 * Format currency string for PDF display (INR)
 */
function formatCurrency(amount: number): string {
  return `INR ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Helper to clean and normalize text (strips \r, converts HTML breaks, normalizes line endings)
 */
function cleanText(input: string | undefined | null): string {
  if (!input) return '';
  return String(input)
    .replace(/\r\n/g, '\n')          // convert Windows CRLF to LF
    .replace(/\r/g, '\n')            // convert standalone CR to LF
    .replace(/<br\s*\/?>/gi, '\n')   // convert HTML <br> tags to LF
    .replace(/<\/p>/gi, '\n')        // convert </p> tags to LF
    .replace(/<[^>]+>/g, '')         // strip any HTML tags
    .replace(/\u2028|\u2029/g, '\n') // convert unicode line separators to LF
    .trim();
}

/**
 * Helper to asynchronously load the site's logo from /logo.png as a Base64 string for jsPDF
 */
async function getLogoBase64(): Promise<string | null> {
  try {
    const res = await fetch('/logo.png');
    if (res.ok) {
      const blob = await res.blob();
      const dataUrl = await new Promise<string | null>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
      if (dataUrl) return dataUrl;
    }
  } catch (err) {
    console.warn('Fetch logo failed, attempting Image load fallback', err);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.src = '/logo.png';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
          return;
        }
      } catch (e) {
        console.warn('Canvas conversion failed for logo', e);
      }
      resolve(null);
    };
    img.onerror = () => resolve(null);
  });
}

/**
 * Helper to render Top Branded Banner
 */
function renderHeaderBanner(doc: jsPDF, title: string, refText: string, logoBase64: string | null): void {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Dark obsidian header rectangle
  doc.setFillColor(13, 12, 10); // #0D0C0A
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent bottom border line
  doc.setDrawColor(209, 199, 183); // #D1C7B7
  doc.setLineWidth(0.5);
  doc.line(0, 28, pageWidth, 28);

  // Logo Icon Badge
  if (logoBase64) {
    try {
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(11, 2.5, 23, 23, 3, 3, 'F');
      doc.addImage(logoBase64, 'PNG', 12, 3.5, 21, 21);
    } catch (err) {
      console.warn('jsPDF addImage logo failed:', err);
    }
  }

  const titleX = logoBase64 ? 38 : 15;

  doc.setTextColor(247, 245, 240); // #F7F5F0 Chalk
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('ARCHZONE STRUCTURES', titleX, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(209, 199, 183); // #D1C7B7 Stone
  doc.text('by ARCHZONA | Pergolas, Gazebos, Exterior Cladding & Custom Structures', titleX, 18);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(247, 245, 240);
  doc.text(title, pageWidth - 15, 13, { align: 'right' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 199, 183);
  doc.text(refText, pageWidth - 15, 19, { align: 'right' });
}

/**
 * Helper to render Table Header with HSN/SAC Column
 */
function renderTableHeader(doc: jsPDF, y: number, isInvoice: boolean): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(20, 19, 17);
  doc.rect(15, y, pageWidth - 30, 8, 'F');

  doc.setTextColor(247, 245, 240);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);

  doc.text('#', 17, y + 5.5);
  doc.text(isInvoice ? 'DESCRIPTION & SPECIFICATIONS' : 'ITEM DESCRIPTION', 26, y + 5.5);
  doc.text('HSN/SAC', 110, y + 5.5, { align: 'center' });
  doc.text('QTY / UNIT', 133, y + 5.5, { align: 'center' });
  doc.text('UNIT RATE', 156, y + 5.5, { align: 'right' });
  doc.text(isInvoice ? 'TAXABLE VALUE' : 'AMOUNT (₹)', pageWidth - 18, y + 5.5, { align: 'right' });

  return y + 8;
}

/**
 * Helper to render dynamic multi-line text safely across page boundaries with clean line heights
 */
function renderMultiLineSection(
  doc: jsPDF,
  title: string,
  rawText: string,
  startY: number,
  logoBase64: string | null,
  headerTitle: string,
  refText: string
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = startY;

  const text = cleanText(rawText);
  if (!text) return y;

  // Check if title fits on current page
  if (y > 245) {
    doc.addPage();
    renderHeaderBanner(doc, headerTitle, refText, logoBase64);
    y = 35;
  }

  // Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 12, 10);
  doc.text(title, 15, y);
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);

  // Split text by newlines first to preserve paragraph structure
  const paragraphs = text.split('\n');

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) {
      y += 2.5; // empty line spacing between paragraphs
      continue;
    }

    // Split long paragraph into wrapped lines
    const wrappedLines = doc.splitTextToSize(trimmed, pageWidth - 30);

    for (const rawLine of wrappedLines) {
      const line = String(rawLine).replace(/[\r\n]/g, '').trim();
      if (!line) continue;

      if (y > 252) {
        doc.addPage();
        renderHeaderBanner(doc, headerTitle, refText, logoBase64);
        y = 35;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(60, 60, 60);
      }

      const isSubHeader = line === line.toUpperCase() && line.length < 50 && !line.startsWith('•') && !/^\d+\./.test(line);
      if (isSubHeader) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 30, 30);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
      }

      doc.text(line, 15, y);
      y += 4.2;
    }
  }

  y += 4;
  return y;
}

/**
 * Apply page numbers & footers across all generated pages
 */
function applyFootersToAllPages(doc: jsPDF): void {
  const totalPages = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    doc.setDrawColor(220, 215, 205);
    doc.setLineWidth(0.3);
    doc.line(15, 282, pageWidth - 15, 282);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 130, 115);

    doc.text('Archzone Structures by ARCHZONA | www.archzonestructures.com | info.archzona@gmail.com', 15, 287);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 15, 287, { align: 'right' });
  }
}

/**
 * Universal document PDF generator supporting Quote, Proforma Invoice, and Tax Invoice
 */
export async function downloadDocumentPDF(docPayload: Quotation | Invoice, owner: OwnerUser): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const logoBase64 = await getLogoBase64();

  // Determine Document Type
  const docType: DocumentType = (docPayload as Quotation).docType ||
    (docPayload.id.includes('INV') ? 'tax_invoice' : docPayload.id.includes('PI') ? 'proforma' : 'quote');

  const headerTitleMap: Record<DocumentType, string> = {
    quote: 'COMMERCIAL QUOTATION',
    proforma: 'PROFORMA INVOICE',
    tax_invoice: 'TAX INVOICE',
  };

  const headerTitle = headerTitleMap[docType];
  const refText = `${docType === 'tax_invoice' ? 'Invoice #' : docType === 'proforma' ? 'Proforma #' : 'Ref'}: ${docPayload.id}`;

  // 1. Initial Page Banner
  renderHeaderBanner(doc, headerTitle, refText, logoBase64);

  let y = 35;

  // 2. Sender / Recipient Header Info
  doc.setTextColor(13, 12, 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('ISSUED BY:', 15, y);
  doc.text(docType === 'quote' ? 'QUOTATION FOR:' : 'BILLED TO:', 110, y);

  // Left Column (Sender - Archzona)
  let leftY = y + 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(cleanText(owner.companyName), 15, leftY);
  leftY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  const ownerAddressLines = doc.splitTextToSize(cleanText(owner.address), 85);
  for (const line of ownerAddressLines) {
    doc.text(String(line).replace(/[\r\n]/g, ''), 15, leftY);
    leftY += 4.2;
  }

  doc.text(`Phone: ${cleanText(owner.phone)} | Email: ${cleanText(owner.email)}`, 15, leftY);
  leftY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.text(`GSTIN: ${cleanText(owner.gstin)}`, 15, leftY);
  leftY += 4.5;

  // Right Column (Recipient - Client)
  let rightY = y + 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(cleanText(docPayload.client.name), 110, rightY);
  rightY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);

  if (docPayload.client.companyName) {
    doc.text(cleanText(docPayload.client.companyName), 110, rightY);
    rightY += 4.5;
  }

  if (docPayload.client.billingAddress) {
    const clientAddressLines = doc.splitTextToSize(cleanText(docPayload.client.billingAddress), 85);
    for (const line of clientAddressLines) {
      doc.text(String(line).replace(/[\r\n]/g, ''), 110, rightY);
      rightY += 4.2;
    }
  }

  if (docPayload.client.phone) {
    doc.text(`Phone: ${cleanText(docPayload.client.phone)}`, 110, rightY);
    rightY += 4.5;
  }

  if (docPayload.client.email) {
    doc.text(`Email: ${cleanText(docPayload.client.email)}`, 110, rightY);
    rightY += 4.5;
  }

  if (docPayload.client.gstin) {
    doc.setFont('helvetica', 'bold');
    doc.text(`Client GSTIN: ${cleanText(docPayload.client.gstin)}`, 110, rightY);
    rightY += 4.5;
  }

  y = Math.max(leftY, rightY) + 4;

  // 3. Metadata Banner Bar
  doc.setFillColor(239, 234, 226); // #EFEAE2
  doc.roundedRect(15, y, pageWidth - 30, 8, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 12, 10);
  doc.text(`Date: ${(docPayload as Invoice).issueDate || (docPayload as Quotation).date}`, 20, y + 5.5);
  doc.text(`Valid/Due Until: ${(docPayload as Invoice).dueDate || (docPayload as Quotation).validUntil}`, 80, y + 5.5);
  if (docPayload.client.projectName) {
    doc.text(`Project: ${cleanText(docPayload.client.projectName)}`, 140, y + 5.5, { maxWidth: 55 });
  }

  y += 14;

  // 4. Line Items Table Header with HSN
  y = renderTableHeader(doc, y, docType !== 'quote');

  // 5. Line Items Body Rows with Material HSN
  docPayload.items.forEach((item, index) => {
    const cleanedItemName = cleanText(item.name);
    const cleanedItemDesc = cleanText(item.description);
    const splitDesc = doc.splitTextToSize(cleanedItemDesc, 78);
    const rowHeight = Math.max(6 + (splitDesc.length * 3.8), 10);

    // Check pagination
    if (y + rowHeight > 250) {
      doc.addPage();
      renderHeaderBanner(doc, headerTitle, refText, logoBase64);
      y = renderTableHeader(doc, 33, docType !== 'quote');
    }

    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`${index + 1}`, 17, y + 5);

    // Item Title
    doc.setFont('helvetica', 'bold');
    doc.text(cleanedItemName, 26, y + 5);

    // Multiline item description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    let descY = y + 9;
    for (const dLine of splitDesc) {
      doc.text(String(dLine).replace(/[\r\n]/g, ''), 26, descY);
      descY += 3.8;
    }

    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 30);
    doc.text(item.hsnCode || '3925', 110, y + 5, { align: 'center' });
    doc.text(`${item.quantity} ${item.unit}`, 133, y + 5, { align: 'center' });
    doc.text(formatCurrency(item.unitRate), 156, y + 5, { align: 'right' });
    doc.text(formatCurrency(item.netAmount), pageWidth - 18, y + 5, { align: 'right' });

    y += rowHeight;

    // Line separator
    doc.setDrawColor(230, 225, 215);
    doc.line(15, y, pageWidth - 15, y);
  });

  y += 6;

  // 6. Tax & Totals Breakdown & Bank Details Box
  if (y + 60 > 250) {
    doc.addPage();
    renderHeaderBanner(doc, headerTitle, refText, logoBase64);
    y = 35;
  }

  const startTotalsY = y;
  const isGstActive = (docPayload as Quotation).gstEnabled || (docPayload as Invoice).taxType || docType === 'proforma' || docType === 'tax_invoice';

  // Bank Details Box on Left (X = 15 to X = 92)
  doc.setFillColor(247, 245, 240); // Soft stone background
  doc.roundedRect(15, startTotalsY, 77, 36, 2, 2, 'F');
  doc.setDrawColor(209, 199, 183);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, startTotalsY, 77, 36, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 12, 10);
  doc.text('BANK PAYMENT DETAILS (NEFT/RTGS):', 18, startTotalsY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  doc.text(`Bank: ${cleanText(owner.bankDetails.bankName)}`, 18, startTotalsY + 11);
  doc.text(`A/C Name: ${cleanText(owner.bankDetails.accountName)}`, 18, startTotalsY + 15.5);
  doc.text(`A/C #: ${cleanText(owner.bankDetails.accountNumber)}`, 18, startTotalsY + 20);
  doc.text(`IFSC Code: ${cleanText(owner.bankDetails.ifscCode)}`, 18, startTotalsY + 24.5);
  doc.text(`Branch: ${cleanText(owner.bankDetails.branch)}`, 18, startTotalsY + 29);
  if (owner.bankDetails.upiId) {
    doc.text(`UPI ID: ${cleanText(owner.bankDetails.upiId)}`, 18, startTotalsY + 33.5);
  }

  // Totals Breakdown on Right (X = 98 to X = 195)
  let rightTotalsY = startTotalsY;

  const subtotalVal = docPayload.subtotal || 0;
  const netTaxableVal = (docPayload as Quotation).netPreTaxTotal || subtotalVal;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.text('Taxable Subtotal:', 98, rightTotalsY + 4);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 12, 10);
  doc.text(formatCurrency(netTaxableVal), pageWidth - 18, rightTotalsY + 4, { align: 'right' });

  const taxType = (docPayload as Invoice).taxType || (docPayload as Quotation).taxType || 'CGST_SGST';

  if (isGstActive) {
    if (taxType === 'CGST_SGST') {
      const cgstAmt = (docPayload as Invoice).cgstAmount || (docPayload as Quotation).cgstAmount || Math.round(netTaxableVal * 0.09 * 100) / 100;
      const sgstAmt = (docPayload as Invoice).sgstAmount || (docPayload as Quotation).sgstAmount || Math.round(netTaxableVal * 0.09 * 100) / 100;

      rightTotalsY += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text('CGST @ 9%:', 98, rightTotalsY + 4);
      doc.text(formatCurrency(cgstAmt), pageWidth - 18, rightTotalsY + 4, { align: 'right' });

      rightTotalsY += 5;
      doc.text('SGST @ 9%:', 98, rightTotalsY + 4);
      doc.text(formatCurrency(sgstAmt), pageWidth - 18, rightTotalsY + 4, { align: 'right' });
    } else {
      const igstAmt = (docPayload as Invoice).igstAmount || (docPayload as Quotation).igstAmount || Math.round(netTaxableVal * 0.18 * 100) / 100;

      rightTotalsY += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text('IGST @ 18%:', 98, rightTotalsY + 4);
      doc.text(formatCurrency(igstAmt), pageWidth - 18, rightTotalsY + 4, { align: 'right' });
    }
  }

  rightTotalsY += 7;
  doc.setFillColor(20, 19, 17);
  doc.roundedRect(95, rightTotalsY, 100, 10, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(247, 245, 240);

  const finalGrandTotal = (docPayload as Invoice).grandTotal || (docPayload as Quotation).grandTotal || (isGstActive ? Math.round(netTaxableVal * 1.18 * 100) / 100 : netTaxableVal);

  doc.text(isGstActive ? 'GRAND TOTAL (INC. GST):' : 'NET ESTIMATED TOTAL:', 99, rightTotalsY + 6.5);
  doc.setFontSize(9.5);
  doc.text(formatCurrency(finalGrandTotal), pageWidth - 18, rightTotalsY + 6.5, { align: 'right' });

  // Advance Paid & Net Balance Due
  const amountPaidVal = docPayload.amountPaid || 0;
  const balanceDueVal = typeof docPayload.balanceDue === 'number' ? docPayload.balanceDue : Math.max(0, finalGrandTotal - amountPaidVal);

  if (amountPaidVal > 0) {
    rightTotalsY += 13;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(16, 124, 65); // Green accent
    doc.text('Less: Advance Paid / Received:', 98, rightTotalsY + 4);
    doc.setFont('helvetica', 'bold');
    doc.text(`(-) ${formatCurrency(amountPaidVal)}`, pageWidth - 18, rightTotalsY + 4, { align: 'right' });

    rightTotalsY += 5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9); // Amber accent
    doc.text('NET BALANCE DUE:', 98, rightTotalsY + 4);
    doc.text(formatCurrency(balanceDueVal), pageWidth - 18, rightTotalsY + 4, { align: 'right' });
  }

  y = Math.max(startTotalsY + 40, rightTotalsY + 15);

  // 7. Notes & Terms
  if (docPayload.notes) {
    y = renderMultiLineSection(
      doc,
      'REMARKS & NOTES:',
      docPayload.notes,
      y,
      logoBase64,
      headerTitle,
      refText
    );
  }

  if (docPayload.paymentTerms) {
    y = renderMultiLineSection(
      doc,
      'COMMERCIAL PAYMENT TERMS:',
      docPayload.paymentTerms,
      y,
      logoBase64,
      headerTitle,
      refText
    );
  }

  // 8. Signature Block Placement
  if (y + 20 > 265) {
    doc.addPage();
    renderHeaderBanner(doc, headerTitle, refText, logoBase64);
    y = 40;
  } else {
    y = Math.min(Math.max(y + 8, 230), 252);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 12, 10);
  doc.text('For ARCHZONE STRUCTURES (by ARCHZONA)', pageWidth - 15, y, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text('Authorized Signatory', pageWidth - 15, y + 10, { align: 'right' });

  // 9. Final Footers Pass
  applyFootersToAllPages(doc);

  const fileSuffix = docType === 'tax_invoice' ? 'Tax_Invoice' : docType === 'proforma' ? 'Proforma_Invoice' : 'Quotation';
  doc.save(`${docPayload.id}_Archzone_Structures_${fileSuffix}.pdf`);
}

/**
 * Backward compatible helper for Quotation PDFs
 */
export async function downloadQuotationPDF(quote: Quotation, owner: OwnerUser): Promise<void> {
  return downloadDocumentPDF(quote, owner);
}

/**
 * Backward compatible helper for Proforma Invoice PDFs
 */
export async function downloadProformaInvoicePDF(quote: Quotation, owner: OwnerUser): Promise<void> {
  return downloadDocumentPDF({ ...quote, docType: 'proforma' }, owner);
}

/**
 * Backward compatible helper for Tax Invoice PDFs
 */
export async function downloadInvoicePDF(invoice: Invoice, owner: OwnerUser): Promise<void> {
  return downloadDocumentPDF(invoice, owner);
}
