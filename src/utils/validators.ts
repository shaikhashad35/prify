import type { ValidationResult, HeaderMapping } from '../types';

export function validateApiKey(key: string): ValidationResult {
  if (!key || key.trim().length === 0) {
    return { valid: false, message: 'API key cannot be empty.' };
  }
  if (key.trim().length < 10) {
    return { valid: false, message: 'API key seems too short. Please check and try again.' };
  }
  return { valid: true, message: 'API key saved.' };
}

export function validateFile(file: File): ValidationResult {
  if (!file) {
    return { valid: false, message: 'No file selected.' };
  }
  const validExtensions = ['.xlsx', '.xls'];
  const fileName = file.name.toLowerCase();
  const hasValidExt = validExtensions.some(ext => fileName.endsWith(ext));
  if (!hasValidExt) {
    return { valid: false, message: 'Only .xlsx or .xls files are supported.' };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, message: 'File size exceeds 10MB limit.' };
  }
  return { valid: true, message: `File "${file.name}" is valid.` };
}

const HEADER_ALIASES: Record<string, string[]> = {
  name: ['name', 'celebrity name', 'celebname', 'celeb name', 'celebrity'],
  contact: ['contact', 'email', 'phone', 'contact info', 'contactinfo', 'email address'],
  wikipediaLink: ['wikipedia link', 'wikipedialink', 'wikipedia', 'wiki', 'wikipedia url', 'wiki link', 'wiki url'],
};

export function mapHeaders(headers: string[]): HeaderMapping {
  const normalized = headers.map(h => h.toString().trim().toLowerCase());
  const mapping: Record<string, string> = {};
  const missing: string[] = [];

  for (const [canonical, aliases] of Object.entries(HEADER_ALIASES)) {
    const index = normalized.findIndex(h => aliases.includes(h));
    if (index === -1) {
      missing.push(canonical);
    } else {
      mapping[canonical] = headers[index];
    }
  }

  if (missing.length > 0) {
    return { mapping: null, missing };
  }
  return { mapping, missing: [] };
}

export function validateAgenda(agenda: string): ValidationResult {
  if (!agenda || agenda.trim().length === 0) {
    return { valid: false, message: 'PR agenda cannot be empty.' };
  }
  if (agenda.trim().length < 20) {
    return { valid: false, message: 'PR agenda is too short. Please provide more detail for better results.' };
  }
  return { valid: true, message: '' };
}

export function isValidWikipediaUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.hostname.endsWith('wikipedia.org');
  } catch {
    return false;
  }
}
