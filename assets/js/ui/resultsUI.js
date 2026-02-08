/**
 * resultsUI.js — Render results table & download button
 */

import { generateOutputExcel } from '../services/excelService.js';
import { sanitize, truncate } from '../utils/helpers.js';

const resultsSection = document.getElementById('section-results');
const resultsBody = document.getElementById('resultsBody');
const resultsSummary = document.getElementById('resultsSummary');
const downloadBtn = document.getElementById('downloadBtn');

let currentResults = [];

/**
 * Show the results section and populate the table
 * @param {Array<{name: string, contact: string, wikipediaLink: string, message: string, status: string, error?: string}>} results
 */
export function showResults(results) {
  currentResults = results;
  resultsSection.hidden = false;

  const successCount = results.filter(r => r.status === 'success').length;
  const failCount = results.filter(r => r.status === 'error').length;

  resultsSummary.textContent = `${successCount} successful, ${failCount} failed out of ${results.length} celebrities.`;

  // Clear previous rows
  resultsBody.innerHTML = '';

  results.forEach((r, i) => {
    const row = document.createElement('tr');
    row.className = r.status === 'success' ? 'row-success' : 'row-error';

    const cellNum = document.createElement('td');
    cellNum.textContent = String(i + 1);

    const cellName = document.createElement('td');
    cellName.textContent = sanitize(r.name);

    const cellTweet = document.createElement('td');
    cellTweet.className = 'cell-tweet';
    if (r.status === 'success') {
      cellTweet.textContent = r.message;
    } else {
      cellTweet.textContent = r.error || 'Generation failed';
      cellTweet.classList.add('cell-error-text');
    }

    const cellStatus = document.createElement('td');
    cellStatus.textContent = r.status === 'success' ? '✅' : '❌';

    row.appendChild(cellNum);
    row.appendChild(cellName);
    row.appendChild(cellTweet);
    row.appendChild(cellStatus);
    resultsBody.appendChild(row);
  });

  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Hide the results section
 */
export function hideResults() {
  resultsSection.hidden = true;
  resultsBody.innerHTML = '';
  currentResults = [];
}

/**
 * Initialize download button listener
 */
export function initDownloadButton() {
  downloadBtn.addEventListener('click', () => {
    if (currentResults.length === 0) return;
    generateOutputExcel(currentResults);
  });
}
