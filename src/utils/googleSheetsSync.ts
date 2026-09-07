import { Quotation, Invoice } from '../types/adminTypes';

/**
 * Google Sheets Database Integration for Archzona Structures
 * Target Sheet: https://docs.google.com/spreadsheets/d/1UgAsXRQu2aQXRU3IMnGmhh8r6ZcLQA6dS478_zLPv0E/edit
 */

export const GSHEET_SPREADSHEET_ID = '1UgAsXRQu2aQXRU3IMnGmhh8r6ZcLQA6dS478_zLPv0E';
export const DEFAULT_GSHEET_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbx_FSxcB6fgZI2QSTFqqqEADB4whFld6soDOlqdeqiI-Rzu5iN1mL2rj22CCSFyvcnEAw/exec';

// Storage key for configured Apps Script Web App Deployment URL
const GSHEET_WEB_APP_URL_KEY = 'archzona_gsheet_web_app_url';

/**
 * Get or set Google Apps Script Web App URL
 */
export function getGSheetWebAppUrl(): string {
  return localStorage.getItem(GSHEET_WEB_APP_URL_KEY) || DEFAULT_GSHEET_WEB_APP_URL;
}

export function setGSheetWebAppUrl(url: string): void {
  localStorage.setItem(GSHEET_WEB_APP_URL_KEY, url.trim());
}

/**
 * Send Quotation to Google Sheet
 */
export async function syncQuoteToGSheet(quote: Quotation): Promise<boolean> {
  const webAppUrl = getGSheetWebAppUrl();
  if (!webAppUrl) return false;

  try {
    const response = await fetch(webAppUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'saveQuote',
        data: quote,
      }),
    });

    const result = await response.json();
    return result.status === 'success';
  } catch (err) {
    console.warn('Google Sheet quote sync error:', err);
    return false;
  }
}

/**
 * Send Invoice to Google Sheet
 */
export async function syncInvoiceToGSheet(invoice: Invoice): Promise<boolean> {
  const webAppUrl = getGSheetWebAppUrl();
  if (!webAppUrl) return false;

  try {
    const response = await fetch(webAppUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'saveInvoice',
        data: invoice,
      }),
    });

    const result = await response.json();
    return result.status === 'success';
  } catch (err) {
    console.warn('Google Sheet invoice sync error:', err);
    return false;
  }
}

/**
 * Fetch all Quotes from Google Sheet
 */
export async function fetchQuotesFromGSheet(): Promise<Quotation[] | null> {
  const webAppUrl = getGSheetWebAppUrl();
  if (!webAppUrl) return null;

  try {
    const response = await fetch(`${webAppUrl}?action=getQuotes`);
    const result = await response.json();
    if (result.status === 'success' && Array.isArray(result.data)) {
      return result.data as Quotation[];
    }
  } catch (err) {
    console.warn('Fetch quotes from Google Sheet failed:', err);
  }
  return null;
}

/**
 * Fetch all Invoices from Google Sheet
 */
export async function fetchInvoicesFromGSheet(): Promise<Invoice[] | null> {
  const webAppUrl = getGSheetWebAppUrl();
  if (!webAppUrl) return null;

  try {
    const response = await fetch(`${webAppUrl}?action=getInvoices`);
    const result = await response.json();
    if (result.status === 'success' && Array.isArray(result.data)) {
      return result.data as Invoice[];
    }
  } catch (err) {
    console.warn('Fetch invoices from Google Sheet failed:', err);
  }
  return null;
}

/**
 * Complete Google Apps Script template for the user's spreadsheet
 */
export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * Google Apps Script for Archzona Structures Quotation & Invoice Database
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1UgAsXRQu2aQXRU3IMnGmhh8r6ZcLQA6dS478_zLPv0E/edit
 *
 * HOW TO DEPLOY:
 * 1. Open Google Sheet: Extensions -> Apps Script
 * 2. Paste this entire code and save (Ctrl + S)
 * 3. Click "Deploy" -> "New deployment"
 * 4. Select type: "Web app"
 * 5. Set Description: "Archzona Database API"
 * 6. Set Execute as: "Me"
 * 7. Set Who has access: "Anyone"
 * 8. Click "Deploy", authorize permissions, and copy the Web App URL!
 */

function doGet(e) {
  var action = e.parameter.action;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === 'getQuotes') {
    var sheet = getOrCreateSheet(ss, 'Quotations');
    var quotes = readSheetJson(sheet);
    return responseJSON({ status: 'success', data: quotes });
  }
  
  if (action === 'getInvoices') {
    var sheet = getOrCreateSheet(ss, 'Invoices');
    var invoices = readSheetJson(sheet);
    return responseJSON({ status: 'success', data: invoices });
  }
  
  return responseJSON({ status: 'error', message: 'Invalid action' });
}

function doPost(e) {
  try {
    var postData = JSON.parse(e.postData.contents);
    var action = postData.action;
    var data = postData.data;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    if (action === 'saveQuote') {
      var sheet = getOrCreateSheet(ss, 'Quotations');
      upsertRecord(sheet, data);
      return responseJSON({ status: 'success', id: data.id });
    }
    
    if (action === 'saveInvoice') {
      var sheet = getOrCreateSheet(ss, 'Invoices');
      upsertRecord(sheet, data);
      return responseJSON({ status: 'success', id: data.id });
    }
    
    return responseJSON({ status: 'error', message: 'Unknown action' });
  } catch (err) {
    return responseJSON({ status: 'error', message: err.toString() });
  }
}

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(['ID', 'Client Name', 'Project', 'Total Amount', 'Status', 'Date', 'JSON Data', 'Updated At']);
    sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#EFEAE2');
  }
  return sheet;
}

function upsertRecord(sheet, record) {
  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == record.id) {
      rowIndex = i + 1;
      break;
    }
  }
  
  var id = record.id || '';
  var clientName = record.client ? record.client.name : '';
  var project = (record.client && record.client.projectName) ? record.client.projectName : '';
  var total = record.netPreTaxTotal || record.grandTotal || 0;
  var status = record.status || 'draft';
  var date = record.date || record.issueDate || new Date().toISOString().split('T')[0];
  var jsonStr = JSON.stringify(record);
  var updatedAt = new Date().toISOString();
  
  var rowValues = [id, clientName, project, total, status, date, jsonStr, updatedAt];
  
  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, 8).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }
}

function readSheetJson(sheet) {
  var data = sheet.getDataRange().getValues();
  var records = [];
  for (var i = 1; i < data.length; i++) {
    var jsonStr = data[i][6];
    if (jsonStr) {
      try {
        records.push(JSON.parse(jsonStr));
      } catch (err) {}
    }
  }
  return records;
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
