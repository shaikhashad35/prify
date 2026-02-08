/**
 * validators.js — Input validation functions for PRify
 */

/**
 * Validate that the API key looks reasonable
 * @param {string} key
 * @returns {{ valid: boolean, message: string }}
 */
export function validateApiKey(key) {
  if (!key || key.trim().length === 0) {
    return { valid: false, message: 'API key cannot be empty.' };
  }
  if (key.trim().length < 10) {
    return { valid: false, message: 'API key seems too short. Please check and try again.' };
  }
  return { valid: true, message: 'API key saved.' };
}

/**
 * Validate the uploaded file is an Excel file
 * @param {File} file
 * @returns {{ valid: boolean, message: string }}
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, message: 'No file selected.' };
  }
  const validExtensions = ['.xlsx', '.xls'];
  const fileName = file.name.toLowerCase();
  const hasValidExt = validExtensions.some(ext => fileName.endsWith(ext));
  if (!hasValidExt) {
    return { valid: false, message: 'Only .xlsx or .xls files are supported.' };
  }
  const maxSizeMB = 10;
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, message: `File size exceeds ${maxSizeMB}MB limit.` };
  }
  return { valid: true, message: `File "${file.name}" is valid.` };
}

/**
 * Known header variations mapped to canonical column names
 */
const HEADER_ALIASES = {
  name: ['name', 'celebrity name', 'celebname', 'celeb name', 'celebrity'],
  contact: ['contact', 'email', 'phone', 'contact info', 'contactinfo', 'email address'],
  wikipediaLink: ['wikipedia link', 'wikipedialink', 'wikipedia', 'wiki', 'wikipedia url', 'wiki link', 'wiki url'],
};

/**
 * Map raw headers from the Excel file to canonical column names
 * @param {string[]} headers - Raw header strings from the first row
 * @returns {{ mapping: Record<string, string>|null, missing: string[] }}
 */
export function mapHeaders(headers) {
  const normalized = headers.map(h => h.toString().trim().toLowerCase());
  const mapping = {};
  const missing = [];

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

/**
 * Validate the PR agenda text
 * @param {string} agenda
 * @returns {{ valid: boolean, message: string }}
 */
export function validateAgenda(agenda) {
  if (!agenda || agenda.trim().length === 0) {
    return { valid: false, message: 'PR agenda cannot be empty.' };
  }
  if (agenda.trim().length < 20) {
    return { valid: false, message: 'PR agenda is too short. Please provide more detail for better results.' };
  }
  return { valid: true, message: '' };
}

/**
 * Validate a Wikipedia URL
 * @param {string} url
 * @returns {boolean}
 */
export function isValidWikipediaUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.hostname.endsWith('wikipedia.org');
  } catch {
    return false;
  }
}
