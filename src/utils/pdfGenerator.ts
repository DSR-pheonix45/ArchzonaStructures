import { jsPDF } from 'jspdf';
import { Quotation, Invoice, OwnerUser } from '../types/adminTypes';

/**
 * Format currency string for PDF display (INR)
 */
function formatCurrency(amount: number): string {
  return `INR ${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Helper to asynchronously load the site's logo from /logo.png as a Base64 string for jsPDF
 */
async function getLogoBase64(): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
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
 * Download a crisp, professional, branded pre-tax Quotation PDF
 */
export async function downloadQuotationPDF(quote: Quotation, owner: OwnerUser): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 15;

  // Header Banner / Brand Title
  doc.setFillColor(13, 12, 10); // #0D0C0A Obsidian
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Load Logo Icon from /logo.png
  const logoBase64 = await getLogoBase64();
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', 12, 3, 22, 22);
    } catch (err) {
      console.warn('jsPDF addImage logo failed:', err);
    }
  }

  const titleX = logoBase64 ? 38 : 15;

  doc.setTextColor(247, 245, 240); // #F7F5F0 Chalk
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('ARCHZONA STRUCTURES', titleX, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(209, 199, 183); // #D1C7B7 Stone
  doc.text('Architectural Pergolas, Gazebos, Timber Cladding & Custom Structures', titleX, 19);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(247, 245, 240);
  doc.text('COMMERCIAL QUOTATION', pageWidth - 15, 15, { align: 'right' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Ref: ${quote.id}`, pageWidth - 15, 21, { align: 'right' });

  y = 35;

  // --- DYNAMIC HEADER SECTION (ISSUED BY vs QUOTATION FOR) ---
  doc.setTextColor(13, 12, 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('ISSUED BY:', 15, y);
  doc.text('QUOTATION FOR:', 110, y);

  // Left Column (Sender - Archzona)
  let leftY = y + 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);

  doc.text(owner.companyName, 15, leftY);
  leftY += 4.5;

  const ownerAddressLines = doc.splitTextToSize(owner.address, 85);
  doc.text(ownerAddressLines, 15, leftY);
  leftY += (ownerAddressLines.length * 4.2);

  doc.text(`Phone: ${owner.phone} | Email: ${owner.email}`, 15, leftY);
  leftY += 4.5;
  doc.text(`GSTIN: ${owner.gstin}`, 15, leftY);
  leftY += 4.5;

  // Right Column (Recipient - Client)
  let rightY = y + 5;
  doc.text(quote.client.name, 110, rightY);
  rightY += 4.5;

  if (quote.client.companyName) {
    doc.text(quote.client.companyName, 110, rightY);
    rightY += 4.5;
  }

  if (quote.client.billingAddress) {
    const clientAddressLines = doc.splitTextToSize(quote.client.billingAddress, 85);
    doc.text(clientAddressLines, 110, rightY);
    rightY += (clientAddressLines.length * 4.2);
  }

  if (quote.client.phone) {
    doc.text(`Phone: ${quote.client.phone}`, 110, rightY);
    rightY += 4.5;
  }

  if (quote.client.email) {
    doc.text(`Email: ${quote.client.email}`, 110, rightY);
    rightY += 4.5;
  }

  if (quote.client.gstin) {
    doc.text(`Client GSTIN: ${quote.client.gstin}`, 110, rightY);
    rightY += 4.5;
  }

  // Advance y past both header blocks
  y = Math.max(leftY, rightY) + 5;

  // Metadata Row
  doc.setFillColor(239, 234, 226); // #EFEAE2
  doc.rect(15, y, pageWidth - 30, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(13, 12, 10);
  doc.text(`Quote Date: ${quote.date}`, 20, y + 5.5);
  doc.text(`Valid Until: ${quote.validUntil}`, 80, y + 5.5);
  if (quote.client.projectName) {
    doc.text(`Project: ${quote.client.projectName}`, 140, y + 5.5, { maxWidth: 55 });
  }

  y += 14;

  // Table Header
  doc.setFillColor(20, 19, 17);
  doc.rect(15, y, pageWidth - 30, 8, 'F');
  doc.setTextColor(247, 245, 240);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('#', 18, y + 5.5);
  doc.text('ITEM DESCRIPTION', 28, y + 5.5);
  doc.text('QTY / UNIT', 115, y + 5.5, { align: 'center' });
  doc.text('UNIT RATE', 145, y + 5.5, { align: 'right' });
  doc.text('AMOUNT (PRE-TAX)', pageWidth - 18, y + 5.5, { align: 'right' });

  y += 8;

  // Table Body Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 30, 30);

  quote.items.forEach((item, index) => {
    // Check if new page is needed
    if (y > 245) {
      doc.addPage();
      y = 20;
    }

    doc.text(`${index + 1}`, 18, y + 5);

    // Multiline item description
    doc.setFont('helvetica', 'bold');
    doc.text(item.name, 28, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    const splitDesc = doc.splitTextToSize(item.description, 80);
    doc.text(splitDesc, 28, y + 9);

    const descHeight = 5 + (splitDesc.length * 3.8);

    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 30);
    doc.text(`${item.quantity} ${item.unit}`, 115, y + 5, { align: 'center' });
    doc.text(formatCurrency(item.unitRate), 145, y + 5, { align: 'right' });
    doc.text(formatCurrency(item.netAmount), pageWidth - 18, y + 5, { align: 'right' });

    y += Math.max(descHeight, 10);

    // Thin separator line
    doc.setDrawColor(220, 220, 220);
    doc.line(15, y, pageWidth - 15, y);
  });

  y += 4;

  // Totals Box (Wider box starting at X=95 to prevent ANY text overlap)
  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.text('Subtotal (Pre-Tax):', 100, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 12, 10);
  doc.text(formatCurrency(quote.subtotal), pageWidth - 18, y + 5, { align: 'right' });

  if (quote.overallDiscountAmount > 0) {
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`Overall Discount (${quote.overallDiscountPercent}%):`, 100, y + 5);
    doc.text(`- ${formatCurrency(quote.overallDiscountAmount)}`, pageWidth - 18, y + 5, { align: 'right' });
  }

  y += 7;
  // Box starts at X=95, width=100 (from 95mm to 195mm)
  doc.setFillColor(239, 234, 226);
  doc.rect(95, y, 100, 10, 'F');
  doc.setDrawColor(209, 199, 183);
  doc.rect(95, y, 100, 10, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(13, 12, 10);
  doc.text('NET ESTIMATED TOTAL:', 99, y + 6.5);
  doc.setFontSize(9.5);
  doc.text(formatCurrency(quote.netPreTaxTotal), pageWidth - 18, y + 6.5, { align: 'right' });

  y += 15;

  // Note on Pre-Tax nature
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('* Note: This Quotation contains pre-tax estimates. Applicable GST (18%) will be added upon issuance of the final Tax Invoice after acceptance.', 15, y);

  y += 8;

  // Terms & Payment Milestones
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 12, 10);
  doc.text('TERMS & CONDITIONS:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  const termsText = quote.notes || '1. Valid for 30 days. 2. Subject to final site dimensions verification.';
  doc.text(termsText, 15, y + 4, { maxWidth: pageWidth - 30 });

  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 12, 10);
  doc.text('PAYMENT TERMS:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(quote.paymentTerms || '50% Advance | 40% On Dispatch | 10% On Handover', 15, y + 4, { maxWidth: pageWidth - 30 });

  // Signature Block
  y = 265;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 12, 10);
  doc.text('For ARCHZONA STRUCTURES LLP', pageWidth - 15, y, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Authorized Signatory', pageWidth - 15, y + 10, { align: 'right' });

  // Footer text
  doc.setFontSize(7.5);
  doc.setTextColor(140, 130, 115);
  doc.text('Archzona Structures LLP | www.archzonestructures.com | info.archzona@gmail.com', pageWidth / 2, 287, { align: 'center' });

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
  let y = 15;

  // Header Banner / Brand Title
  doc.setFillColor(13, 12, 10); // #0D0C0A Obsidian
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Load Logo Icon from /logo.png
  const logoBase64 = await getLogoBase64();
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, 'PNG', 12, 3, 22, 22);
    } catch (err) {
      console.warn('jsPDF addImage logo failed:', err);
    }
  }

  const titleX = logoBase64 ? 38 : 15;

  doc.setTextColor(247, 245, 240); // #F7F5F0 Chalk
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('ARCHZONA STRUCTURES', titleX, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(209, 199, 183); // #D1C7B7 Stone
  doc.text('Architectural Pergolas, Gazebos, Timber Cladding & Custom Structures', titleX, 19);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(247, 245, 240);
  doc.text('TAX INVOICE', pageWidth - 15, 15, { align: 'right' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice #: ${invoice.id}`, pageWidth - 15, 21, { align: 'right' });

  y = 35;

  // --- DYNAMIC HEADER SECTION (ISSUED BY vs BILLED TO) ---
  doc.setTextColor(13, 12, 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('ISSUED BY:', 15, y);
  doc.text('BILLED TO:', 110, y);

  // Left Column (Sender - Archzona)
  let leftY = y + 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);

  doc.text(owner.companyName, 15, leftY);
  leftY += 4.5;

  const ownerAddressLines = doc.splitTextToSize(owner.address, 85);
  doc.text(ownerAddressLines, 15, leftY);
  leftY += (ownerAddressLines.length * 4.2);

  doc.text(`Phone: ${owner.phone} | Email: ${owner.email}`, 15, leftY);
  leftY += 4.5;
  doc.setFont('helvetica', 'bold');
  doc.text(`GSTIN: ${owner.gstin}`, 15, leftY);
  leftY += 4.5;

  // Right Column (Recipient - Client)
  let rightY = y + 5;
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.client.name, 110, rightY);
  rightY += 4.5;

  if (invoice.client.companyName) {
    doc.text(invoice.client.companyName, 110, rightY);
    rightY += 4.5;
  }

  if (invoice.client.billingAddress) {
    const clientAddressLines = doc.splitTextToSize(invoice.client.billingAddress, 85);
    doc.text(clientAddressLines, 110, rightY);
    rightY += (clientAddressLines.length * 4.2);
  }

  if (invoice.client.phone) {
    doc.text(`Phone: ${invoice.client.phone}`, 110, rightY);
    rightY += 4.5;
  }

  if (invoice.client.email) {
    doc.text(`Email: ${invoice.client.email}`, 110, rightY);
    rightY += 4.5;
  }

  if (invoice.client.gstin) {
    doc.setFont('helvetica', 'bold');
    doc.text(`Client GSTIN: ${invoice.client.gstin}`, 110, rightY);
    rightY += 4.5;
  }

  // Advance y past both header blocks
  y = Math.max(leftY, rightY) + 5;

  // Invoice Metadata Row
  doc.setFillColor(239, 234, 226);
  doc.rect(15, y, pageWidth - 30, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(13, 12, 10);
  doc.text(`Invoice Date: ${invoice.issueDate}`, 20, y + 5.5);
  doc.text(`Due Date: ${invoice.dueDate}`, 80, y + 5.5);
  doc.text(`Linked Quote: ${invoice.quoteId}`, 140, y + 5.5);

  y += 14;

  // Table Header
  doc.setFillColor(20, 19, 17);
  doc.rect(15, y, pageWidth - 30, 8, 'F');
  doc.setTextColor(247, 245, 240);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('#', 18, y + 5.5);
  doc.text('DESCRIPTION & SPECIFICATIONS', 28, y + 5.5);
  doc.text('QTY / UNIT', 115, y + 5.5, { align: 'center' });
  doc.text('UNIT RATE', 145, y + 5.5, { align: 'right' });
  doc.text('TAXABLE VALUE', pageWidth - 18, y + 5.5, { align: 'right' });

  y += 8;

  // Table Body Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 30, 30);

  invoice.items.forEach((item, index) => {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.text(`${index + 1}`, 18, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.text(item.name, 28, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    const splitDesc = doc.splitTextToSize(item.description, 80);
    doc.text(splitDesc, 28, y + 9);

    const descHeight = 5 + (splitDesc.length * 3.8);

    doc.setFontSize(8.5);
    doc.setTextColor(30, 30, 30);
    doc.text(`${item.quantity} ${item.unit}`, 115, y + 5, { align: 'center' });
    doc.text(formatCurrency(item.unitRate), 145, y + 5, { align: 'right' });
    doc.text(formatCurrency(item.netAmount), pageWidth - 18, y + 5, { align: 'right' });

    y += Math.max(descHeight, 10);
    doc.setDrawColor(220, 220, 220);
    doc.line(15, y, pageWidth - 15, y);
  });

  y += 4;

  // Tax & Totals Breakdown (Box starts at X=95, width=100mm to prevent text overlap)
  if (y > 215) {
    doc.addPage();
    y = 20;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.text('Taxable Subtotal:', 100, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(13, 12, 10);
  doc.text(formatCurrency(invoice.subtotal), pageWidth - 18, y + 5, { align: 'right' });

  if (invoice.taxType === 'CGST_SGST') {
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`CGST @ ${invoice.cgstPercent}%:`, 100, y + 5);
    doc.text(formatCurrency(invoice.cgstAmount), pageWidth - 18, y + 5, { align: 'right' });
    y += 5;
    doc.text(`SGST @ ${invoice.sgstPercent}%:`, 100, y + 5);
    doc.text(formatCurrency(invoice.sgstAmount), pageWidth - 18, y + 5, { align: 'right' });
  } else {
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(`IGST @ ${invoice.igstPercent}%:`, 100, y + 5);
    doc.text(formatCurrency(invoice.igstAmount), pageWidth - 18, y + 5, { align: 'right' });
  }

  y += 7;
  doc.setFillColor(20, 19, 17);
  doc.rect(95, y, 100, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(247, 245, 240);
  doc.text('GRAND TOTAL (INC. GST):', 99, y + 6.5);
  doc.setFontSize(9.5);
  doc.text(formatCurrency(invoice.grandTotal), pageWidth - 18, y + 6.5, { align: 'right' });

  y += 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 12, 10);
  doc.text('AMOUNT PAID:', 100, y + 4);
  doc.text(formatCurrency(invoice.amountPaid), pageWidth - 18, y + 4, { align: 'right' });

  y += 5;
  doc.setFillColor(239, 234, 226);
  doc.rect(95, y, 100, 9, 'F');
  doc.setDrawColor(209, 199, 183);
  doc.rect(95, y, 100, 9, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(invoice.balanceDue > 0 ? 180 : 0, invoice.balanceDue > 0 ? 0 : 120, 0);
  doc.text('BALANCE DUE:', 99, y + 6);
  doc.setFontSize(9.5);
  doc.text(formatCurrency(invoice.balanceDue), pageWidth - 18, y + 6, { align: 'right' });

  // Left Column: Bank Details for Payment
  const leftYBank = y - 27;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 12, 10);
  doc.text('BANK PAYMENT DETAILS (NEFT/RTGS):', 15, leftYBank);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(`Bank: ${owner.bankDetails.bankName}`, 15, leftYBank + 4);
  doc.text(`Account Name: ${owner.bankDetails.accountName}`, 15, leftYBank + 8);
  doc.text(`Account #: ${owner.bankDetails.accountNumber}`, 15, leftYBank + 12);
  doc.text(`IFSC Code: ${owner.bankDetails.ifscCode}`, 15, leftYBank + 16);
  doc.text(`Branch: ${owner.bankDetails.branch}`, 15, leftYBank + 20);

  y += 16;

  // Signature Block
  y = 265;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 12, 10);
  doc.text('For ARCHZONA STRUCTURES LLP', pageWidth - 15, y, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Authorized Signatory', pageWidth - 15, y + 10, { align: 'right' });

  // Footer text
  doc.setFontSize(7.5);
  doc.setTextColor(140, 130, 115);
  doc.text('Archzona Structures LLP | www.archzonestructures.com | info.archzona@gmail.com', pageWidth / 2, 287, { align: 'center' });

  doc.save(`${invoice.id}_Archzona_Tax_Invoice.pdf`);
}
