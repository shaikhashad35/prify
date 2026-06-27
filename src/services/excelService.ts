import * as XLSX from 'xlsx';
import type { CelebInput, CelebResult } from '../types';
import { mapHeaders } from '../utils/validators';
import { formatDateForFilename } from '../utils/helpers';

export async function parseExcelFile(file: File): Promise<{ celebrities: CelebInput[]; error: string | null }> {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

    if (!firstSheet) {
      return { celebrities: [], error: 'Excel file has no sheets.' };
    }

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: '' });

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

    const celebrities: CelebInput[] = rows
      .map((row) => ({
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
    return { celebrities: [], error: `Failed to parse Excel file: ${(err as Error).message}` };
  }
}

export function generateOutputExcel(results: CelebResult[]): void {
  const outputData = results.map(r => ({
    'Name': r.name,
    'Contact': r.contact,
    'Wikipedia Link': r.wikipediaLink,
    'Generated Tweet': r.message || '',
    'Status': r.status === 'success' ? '✅ Success' : '❌ Error',
    'Error Details': r.error || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(outputData);

  const colWidths = Object.keys(outputData[0] || {}).map(key => ({
    wch: Math.max(key.length, ...outputData.map(r => String(r[key as keyof typeof r] || '').length).slice(0, 20)) + 2,
  }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'PRify Results');

  const filename = `PRify_Output_${formatDateForFilename()}.xlsx`;
  XLSX.writeFile(workbook, filename);
}
