import { jsPDF } from 'jspdf';
import { Quotation, Invoice, OwnerUser } from '../types/adminTypes';

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
  doc.setFontSize(16);
  doc.text('ARCHZONA STRUCTURES', titleX, 12.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(209, 199, 183); // #D1C7B7 Stone
  doc.text('Architectural Pergolas, Gazebos, Exterior Cladding & Custom Structures', titleX, 18.5);

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
 * Helper to render Table Header
 */
function renderTableHeader(doc: jsPDF, y: number, isInvoice: boolean): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFillColor(20, 19, 17);
  doc.rect(15, y, pageWidth - 30, 8, 'F');

  doc.setTextColor(247, 245, 240);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);

  doc.text('#', 18, y + 5.5);
  doc.text(isInvoice ? 'DESCRIPTION & SPECIFICATIONS' : 'ITEM DESCRIPTION', 28, y + 5.5);
  doc.text('QTY / UNIT', 115, y + 5.5, { align: 'center' });
  doc.text('UNIT RATE', 145, y + 5.5, { align: 'right' });
  doc.text(isInvoice ? 'TAXABLE VALUE' : 'AMOUNT (PRE-TAX)', pageWidth - 18, y + 5.5, { align: 'right' });

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
      // Strip any residual carriage return characters
      const line = String(rawLine).replace(/[\r\n]/g, '').trim();
      if (!line) continue;

      // Page break check before drawing each line
      if (y > 252) {
        doc.addPage();
        renderHeaderBanner(doc, headerTitle, refText, logoBase64);
        y = 35;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(60, 60, 60);
      }

      // Check if line looks like a sub-heading (all caps or ends with colon)
      const isSubHeader = line === line.toUpperCase() && line.length < 50 && !line.startsWith('•') && !/^\d+\./.test(line);
      if (isSubHeader) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 30, 30);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
      }

      doc.text(line, 15, y);
      y += 4.2; // Advance Y position vertically for EVERY line!
    }
  }

  y += 4; // Section bottom spacing
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

    // Footer divider line
    doc.setDrawColor(220, 215, 205);
    doc.setLineWidth(0.3);
    doc.line(15, 282, pageWidth - 15, 282);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 130, 115);

    // Left/Center company details
    doc.text('Archzona Structures LLP | www.archzonestructures.com | info.archzona@gmail.com', 15, 287);

    // Right page number
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 15, 287, { align: 'right' });
  }
}

/**
 * Download a crisp, professional, branded pre-tax Quotation PDF
 */
export async function downloadQuotationPDF(quote: Quotation, owner: OwnerUser): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const logoBase64 = await getLogoBase64();
  const headerTitle = 'COMMERCIAL QUOTATION';
  const refText = `Ref: ${quote.id}`;

  // 1. Initial Page Banner
  renderHeaderBanner(doc, headerTitle, refText, logoBase64);

  let y = 35;

  // 2. Sender / Recipient Header Info
  doc.setTextColor(13, 12, 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('ISSUED BY:', 15, y);
  doc.text('QUOTATION FOR:', 110, y);

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
  doc.text(`GSTIN: ${cleanText(owner.gstin)}`, 15, leftY);
  leftY += 4.5;

  // Right Column (Recipient - Client)
  let rightY = y + 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(cleanText(quote.client.name), 110, rightY);
  rightY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);

  if (quote.client.companyName) {
    doc.text(cleanText(quote.client.companyName), 110, rightY);
    rightY += 4.5;
  }

  if (quote.client.billingAddress) {
    const clientAddressLines = doc.splitTextToSize(cleanText(quote.client.billingAddress), 85);
    for (const line of clientAddressLines) {
      doc.text(String(line).replace(/[\r\n]/g, ''), 110, rightY);
      rightY += 4.2;
    }
  }

  if (quote.client.phone) {
    doc.text(`Phone: ${cleanText(quote.client.phone)}`, 110, rightY);
    rightY += 4.5;
  }

  if (quote.client.email) {
    doc.text(`Email: ${cleanText(quote.client.email)}`, 110, rightY);
    rightY += 4.5;
  }

  if (quote.client.gstin) {
    doc.text(`Client GSTIN: ${cleanText(quote.client.gstin)}`, 110, rightY);
    rightY += 4.5;
  }

  y = Math.max(leftY, rightY) + 4;

  // 3. Metadata Banner Bar
  doc.setFillColor(239, 234, 226); // #EFEAE2
  doc.roundedRect(15, y, pageWidth - 30, 8, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 12, 10);
  doc.text(`Quote Date: ${quote.date}`, 20, y + 5.5);
  doc.text(`Valid Until: ${quote.validUntil}`, 80, y + 5.5);
  if (quote.client.projectName) {
    doc.text(`Project: ${cleanText(quote.client.projectName)}`, 140, y + 5.5, { maxWidth: 55 });
  }

  y += 14;

  // 4. Line Items Table Header
  y = renderTableHeader(doc, y, false);

  // 5. Line Items Body Rows
  quote.items.forEach((item, index) => {
    const cleanedItemName = cleanText(item.name);
    const cleanedItemDesc = cleanText(item.description);
    const splitDesc = doc.splitTextToSize(cleanedItemDesc, 80);
    const rowHeight = Math.max(6 + (splitDesc.length * 3.8), 10);

    // Check pagination
    if (y + rowHeight > 250) {
      doc.addPage();
      renderHeaderBanner(doc, headerTitle, refText, logoBase64);
      y = renderTableHeader(doc, 33, false);
    }

    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`${index + 1}`, 18, y + 5);

    // Item Title
    doc.setFont('helvetica', 'bold');
    doc.text(cleanedItemName, 28, y + 5);

    // Multiline item description
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    let descY = y + 9;
    for (const dLine of splitDesc) {
      doc.text(String(dLine).replace(/[\r\n]/g, ''), 28, descY);
      descY += 3.8;
    }

    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 30);
    doc.text(`${item.quantity} ${item.unit}`, 115, y + 5, { align: 'center' });
    doc.text(formatCurrency(item.unitRate), 145, y + 5, { align: 'right' });
    doc.text(formatCurrency(item.netAmount), pageWidth - 18, y + 5, { align: 'right' });

    y += rowHeight;

    // Line separator
    doc.setDrawColor(230, 225, 215);
    doc.line(15, y, pageWidth - 15, y);
  });

  y += 6;

  // 6. Pre-Tax Totals Summary Box
  if (y + 35 > 250) {
    doc.addPage();
    renderHeaderBanner(doc, headerTitle, refText, logoBase64);
    y = 35;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.text('Subtotal (Pre-Tax):', 100, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 12, 10);
  doc.text(formatCurrency(quote.subtotal), pageWidth - 18, y + 5, { align: 'right' });

  if (quote.overallDiscountAmount > 0) {
    y += 5.5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`Overall Discount (${quote.overallDiscountPercent}%):`, 100, y + 5);
    doc.text(`- ${formatCurrency(quote.overallDiscountAmount)}`, pageWidth - 18, y + 5, { align: 'right' });
  }

  y += 7.5;
  doc.setFillColor(239, 234, 226);
  doc.roundedRect(95, y, 100, 10, 1.5, 1.5, 'F');
  doc.setDrawColor(209, 199, 183);
  doc.roundedRect(95, y, 100, 10, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(13, 12, 10);
  doc.text('NET ESTIMATED TOTAL:', 99, y + 6.5);
  doc.setFontSize(9.5);
  doc.text(formatCurrency(quote.netPreTaxTotal), pageWidth - 18, y + 6.5, { align: 'right' });

  y += 16;

  // 7. Pre-Tax Disclaimer Note
  if (y > 250) {
    doc.addPage();
    renderHeaderBanner(doc, headerTitle, refText, logoBase64);
    y = 35;
  }

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('* Note: This Quotation contains pre-tax estimates. Applicable GST (18%) will be added upon issuance of the final Tax Invoice after acceptance.', 15, y);

  y += 8;

  // 8. Terms & Conditions Section (Dynamic multi-line rendering)
  const defaultNotes = '1. Valid for 30 days. 2. Subject to final site dimensions verification.';
  y = renderMultiLineSection(
    doc,
    'TERMS & CONDITIONS:',
    quote.notes || defaultNotes,
    y,
    logoBase64,
    headerTitle,
    refText
  );

  // 9. Payment Terms Section (Dynamic multi-line rendering)
  const defaultPayment = '50% Advance | 40% On Dispatch | 10% On Handover';
  y = renderMultiLineSection(
    doc,
    'PAYMENT TERMS:',
    quote.paymentTerms || defaultPayment,
    y,
    logoBase64,
    headerTitle,
    refText
  );

  // 10. Signature Block
  if (y + 25 > 255) {
    doc.addPage();
    renderHeaderBanner(doc, headerTitle, refText, logoBase64);
    y = 35;
  } else {
    y = Math.max(y + 8, 245);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 12, 10);
  doc.text('For ARCHZONA STRUCTURES LLP', pageWidth - 15, y, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text('Authorized Signatory', pageWidth - 15, y + 10, { align: 'right' });

  // 11. Final Footers Pass
  applyFootersToAllPages(doc);

  doc.save(`${quote.id}_Archzona_Quotation.pdf`);
}

/**
 * Download a crisp, legal, GST Tax Invoice PDF
 */
export async function downloadInvoicePDF(invoice: Invoice, owner: OwnerUser): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const logoBase64 = await getLogoBase64();
  const headerTitle = 'TAX INVOICE';
  const refText = `Invoice #: ${invoice.id}`;

  // 1. Initial Page Banner
  renderHeaderBanner(doc, headerTitle, refText, logoBase64);

  let y = 35;

  // 2. Sender / Recipient Header Info
  doc.setTextColor(13, 12, 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('ISSUED BY:', 15, y);
  doc.text('BILLED TO:', 110, y);

  // Left Column (Sender)
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

  // Right Column (Recipient)
  let rightY = y + 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.text(cleanText(invoice.client.name), 110, rightY);
  rightY += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);

  if (invoice.client.companyName) {
    doc.text(cleanText(invoice.client.companyName), 110, rightY);
    rightY += 4.5;
  }

  if (invoice.client.billingAddress) {
    const clientAddressLines = doc.splitTextToSize(cleanText(invoice.client.billingAddress), 85);
    for (const line of clientAddressLines) {
      doc.text(String(line).replace(/[\r\n]/g, ''), 110, rightY);
      rightY += 4.2;
    }
  }

  if (invoice.client.phone) {
    doc.text(`Phone: ${cleanText(invoice.client.phone)}`, 110, rightY);
    rightY += 4.5;
  }

  if (invoice.client.email) {
    doc.text(`Email: ${cleanText(invoice.client.email)}`, 110, rightY);
    rightY += 4.5;
  }

  if (invoice.client.gstin) {
    doc.setFont('helvetica', 'bold');
    doc.text(`Client GSTIN: ${cleanText(invoice.client.gstin)}`, 110, rightY);
    rightY += 4.5;
  }

  y = Math.max(leftY, rightY) + 4;

  // 3. Metadata Banner Bar
  doc.setFillColor(239, 234, 226); // #EFEAE2
  doc.roundedRect(15, y, pageWidth - 30, 8, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 12, 10);
  doc.text(`Invoice Date: ${invoice.issueDate}`, 20, y + 5.5);
  doc.text(`Due Date: ${invoice.dueDate}`, 80, y + 5.5);
  doc.text(`Linked Quote: ${invoice.quoteId}`, 140, y + 5.5);

  y += 14;

  // 4. Line Items Table Header
  y = renderTableHeader(doc, y, true);

  // 5. Line Items Body Rows
  invoice.items.forEach((item, index) => {
    const cleanedItemName = cleanText(item.name);
    const cleanedItemDesc = cleanText(item.description);
    const splitDesc = doc.splitTextToSize(cleanedItemDesc, 80);
    const rowHeight = Math.max(6 + (splitDesc.length * 3.8), 10);

    if (y + rowHeight > 250) {
      doc.addPage();
      renderHeaderBanner(doc, headerTitle, refText, logoBase64);
      y = renderTableHeader(doc, 33, true);
    }

    doc.setTextColor(30, 30, 30);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`${index + 1}`, 18, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.text(cleanedItemName, 28, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    let descY = y + 9;
    for (const dLine of splitDesc) {
      doc.text(String(dLine).replace(/[\r\n]/g, ''), 28, descY);
      descY += 3.8;
    }

    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 30);
    doc.text(`${item.quantity} ${item.unit}`, 115, y + 5, { align: 'center' });
    doc.text(formatCurrency(item.unitRate), 145, y + 5, { align: 'right' });
    doc.text(formatCurrency(item.netAmount), pageWidth - 18, y + 5, { align: 'right' });

    y += rowHeight;

    doc.setDrawColor(230, 225, 215);
    doc.line(15, y, pageWidth - 15, y);
  });

  y += 6;

  // 6. Tax & Totals Breakdown & Bank Details Box
  if (y + 50 > 250) {
    doc.addPage();
    renderHeaderBanner(doc, headerTitle, refText, logoBase64);
    y = 35;
  }

  const startTotalsY = y;

  // Bank Details on Left (X = 15 to X = 90)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 12, 10);
  doc.text('BANK PAYMENT DETAILS (NEFT/RTGS):', 15, startTotalsY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(`Bank: ${cleanText(owner.bankDetails.bankName)}`, 15, startTotalsY + 8.5);
  doc.text(`Account Name: ${cleanText(owner.bankDetails.accountName)}`, 15, startTotalsY + 12.5);
  doc.text(`Account #: ${cleanText(owner.bankDetails.accountNumber)}`, 15, startTotalsY + 16.5);
  doc.text(`IFSC Code: ${cleanText(owner.bankDetails.ifscCode)}`, 15, startTotalsY + 20.5);
  doc.text(`Branch: ${cleanText(owner.bankDetails.branch)}`, 15, startTotalsY + 24.5);

  // Totals Breakdown on Right (X = 95 to X = 195)
  let rightTotalsY = startTotalsY;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.text('Taxable Subtotal:', 100, rightTotalsY + 4);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 12, 10);
  doc.text(formatCurrency(invoice.subtotal), pageWidth - 18, rightTotalsY + 4, { align: 'right' });

  if (invoice.taxType === 'CGST_SGST') {
    rightTotalsY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`CGST @ ${invoice.cgstPercent}%:`, 100, rightTotalsY + 4);
    doc.text(formatCurrency(invoice.cgstAmount), pageWidth - 18, rightTotalsY + 4, { align: 'right' });

    rightTotalsY += 5;
    doc.text(`SGST @ ${invoice.sgstPercent}%:`, 100, rightTotalsY + 4);
    doc.text(formatCurrency(invoice.sgstAmount), pageWidth - 18, rightTotalsY + 4, { align: 'right' });
  } else {
    rightTotalsY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`IGST @ ${invoice.igstPercent}%:`, 100, rightTotalsY + 4);
    doc.text(formatCurrency(invoice.igstAmount), pageWidth - 18, rightTotalsY + 4, { align: 'right' });
  }

  rightTotalsY += 7;
  doc.setFillColor(20, 19, 17);
  doc.roundedRect(95, rightTotalsY, 100, 10, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(247, 245, 240);
  doc.text('GRAND TOTAL (INC. GST):', 99, rightTotalsY + 6.5);
  doc.setFontSize(9.5);
  doc.text(formatCurrency(invoice.grandTotal), pageWidth - 18, rightTotalsY + 6.5, { align: 'right' });

  rightTotalsY += 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 12, 10);
  doc.text('AMOUNT PAID:', 100, rightTotalsY + 4);
  doc.text(formatCurrency(invoice.amountPaid), pageWidth - 18, rightTotalsY + 4, { align: 'right' });

  rightTotalsY += 5.5;
  doc.setFillColor(239, 234, 226);
  doc.roundedRect(95, rightTotalsY, 100, 9, 1.5, 1.5, 'F');
  doc.setDrawColor(209, 199, 183);
  doc.roundedRect(95, rightTotalsY, 100, 9, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(invoice.balanceDue > 0 ? 180 : 0, invoice.balanceDue > 0 ? 0 : 120, 0);
  doc.text('BALANCE DUE:', 99, rightTotalsY + 6);
  doc.setFontSize(9.5);
  doc.text(formatCurrency(invoice.balanceDue), pageWidth - 18, rightTotalsY + 6, { align: 'right' });

  y = Math.max(startTotalsY + 30, rightTotalsY + 15);

  // 7. Invoice Notes / Terms if available
  if (invoice.notes) {
    y = renderMultiLineSection(
      doc,
      'INVOICE REMARKS & NOTES:',
      invoice.notes,
      y,
      logoBase64,
      headerTitle,
      refText
    );
  }

  if (invoice.paymentTerms) {
    y = renderMultiLineSection(
      doc,
      'PAYMENT TERMS:',
      invoice.paymentTerms,
      y,
      logoBase64,
      headerTitle,
      refText
    );
  }

  // 8. Signature Block
  if (y + 25 > 255) {
    doc.addPage();
    renderHeaderBanner(doc, headerTitle, refText, logoBase64);
    y = 35;
  } else {
    y = Math.max(y + 8, 245);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 12, 10);
  doc.text('For ARCHZONA STRUCTURES LLP', pageWidth - 15, y, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text('Authorized Signatory', pageWidth - 15, y + 10, { align: 'right' });

  // 9. Final Footers Pass
  applyFootersToAllPages(doc);

  doc.save(`${invoice.id}_Archzona_Tax_Invoice.pdf`);
}
