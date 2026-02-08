/**
 * excelService.js — Parse input & generate output Excel files in-browser via SheetJS
 */

import { mapHeaders } from '../utils/validators.js';
import { formatDateForFilename } from '../utils/helpers.js';

/**
 * Parse an uploaded Excel file and return an array of celebrity objects
 * @param {File} file - The uploaded .xlsx file
 * @returns {Promise<{ celebrities: Array<{name: string, contact: string, wikipediaLink: string}>, error: string|null }>}
 */
export async function parseExcelFile(file) {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

    if (!firstSheet) {
      return { celebrities: [], error: 'Excel file has no sheets.' };
    }

    const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });

    if (rows.length === 0) {
      return { celebrities: [], error: 'Excel file is empty — no data rows found.' };
    }

    const headers = Object.keys(rows[0]);
    const { mapping, missing } = mapHeaders(headers);

    if (!mapping) {
      return {
        celebrities: [],
        error: `Missing required columns: ${missing.join(', ')}. Expected: Name, Contact, Wikipedia Link.`,
      };
    }

    const celebrities = rows
      .map((row, i) => ({
        name: String(row[mapping.name] || '').trim(),
        contact: String(row[mapping.contact] || '').trim(),
        wikipediaLink: String(row[mapping.wikipediaLink] || '').trim(),
      }))
      .filter(c => c.name.length > 0);

    if (celebrities.length === 0) {
      return { celebrities: [], error: 'No valid celebrity rows found (all names are empty).' };
    }

    return { celebrities, error: null };
  } catch (err) {
    return { celebrities: [], error: `Failed to parse Excel file: ${err.message}` };
  }
}

/**
 * Generate an output Excel file from the results and trigger a download
 * @param {Array<{name: string, contact: string, wikipediaLink: string, message: string, status: string, error?: string}>} results
 */
export function generateOutputExcel(results) {
  const outputData = results.map(r => ({
    'Name': r.name,
    'Contact': r.contact,
    'Wikipedia Link': r.wikipediaLink,
    'Generated Tweet': r.message || '',
    'Status': r.status === 'success' ? '✅ Success' : '❌ Error',
    'Error Details': r.error || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(outputData);

  // Auto-size columns
  const colWidths = Object.keys(outputData[0] || {}).map(key => ({
    wch: Math.max(key.length, ...outputData.map(r => String(r[key] || '').length).slice(0, 20)) + 2,
  }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'PRify Results');

  const filename = `PRify_Output_${formatDateForFilename()}.xlsx`;
  XLSX.writeFile(workbook, filename);
}
