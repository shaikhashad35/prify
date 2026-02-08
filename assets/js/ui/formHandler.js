/**
 * formHandler.js — Form validation, submission, and UI state management
 */

import { validateApiKey, validateFile, validateAgenda } from '../utils/validators.js';
import { saveApiKey, getApiKey, hasApiKey } from '../utils/storage.js';
import { testApiKey } from '../services/geminiService.js';
import { parseExcelFile } from '../services/excelService.js';
import { processCelebrities } from '../services/orchestrator.js';
import { showProgress, updateProgress, setProgressComplete } from './progressUI.js';
import { showResults, hideResults } from './resultsUI.js';
import { sanitize, shortenUrl } from '../utils/helpers.js';

// DOM references
const apiKeyInput = document.getElementById('apiKeyInput');
const toggleKeyBtn = document.getElementById('toggleKeyBtn');
const saveKeyBtn = document.getElementById('saveKeyBtn');
const apiKeyStatus = document.getElementById('apiKeyStatus');
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const fileStatus = document.getElementById('fileStatus');
const previewSection = document.getElementById('previewSection');
const previewBody = document.getElementById('previewBody');
const celebCount = document.getElementById('celebCount');
const agendaInput = document.getElementById('agendaInput');
const agendaCharCount = document.getElementById('agendaCharCount');
const generateBtn = document.getElementById('generateBtn');

// State
let parsedCelebrities = [];
let isProcessing = false;

/**
 * Initialize all form event listeners
 */
export function initFormHandler() {
  loadSavedKey();
  initApiKeyHandlers();
  initFileUploadHandlers();
  initAgendaHandlers();
  initGenerateHandler();
}

// ─── API Key ────────────────────────────────────────────────

function loadSavedKey() {
  if (hasApiKey()) {
    apiKeyInput.value = getApiKey();
    showStatus(apiKeyStatus, '✅ API key loaded from storage.', 'success');
    checkGenerateReady();
  }
}

function initApiKeyHandlers() {
  toggleKeyBtn.addEventListener('click', () => {
    const isPassword = apiKeyInput.type === 'password';
    apiKeyInput.type = isPassword ? 'text' : 'password';
    toggleKeyBtn.textContent = isPassword ? '🙈' : '👁️';
  });

  saveKeyBtn.addEventListener('click', async () => {
    const key = apiKeyInput.value.trim();
    const validation = validateApiKey(key);
    if (!validation.valid) {
      showStatus(apiKeyStatus, validation.message, 'error');
      return;
    }

    showStatus(apiKeyStatus, '⏳ Validating API key...', 'info');
    saveKeyBtn.disabled = true;

    const result = await testApiKey(key);
    saveKeyBtn.disabled = false;

    if (result.valid) {
      saveApiKey(key);
      showStatus(apiKeyStatus, result.message, 'success');
    } else {
      showStatus(apiKeyStatus, result.message, 'error');
    }
    checkGenerateReady();
  });
}

// ─── File Upload ────────────────────────────────────────────

function initFileUploadHandlers() {
  dropzone.addEventListener('click', () => fileInput.click());

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dropzone-active');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dropzone-active');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dropzone-active');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) handleFile(file);
  });
}

async function handleFile(file) {
  const validation = validateFile(file);
  if (!validation.valid) {
    showStatus(fileStatus, validation.message, 'error');
    previewSection.hidden = true;
    parsedCelebrities = [];
    checkGenerateReady();
    return;
  }

  showStatus(fileStatus, '⏳ Parsing Excel file...', 'info');

  const { celebrities, error } = await parseExcelFile(file);
  if (error) {
    showStatus(fileStatus, error, 'error');
    previewSection.hidden = true;
    parsedCelebrities = [];
    checkGenerateReady();
    return;
  }

  parsedCelebrities = celebrities;
  showStatus(fileStatus, `✅ Found ${celebrities.length} celebrities.`, 'success');
  renderPreview(celebrities);
  checkGenerateReady();
}

function renderPreview(celebrities) {
  previewSection.hidden = false;
  celebCount.textContent = String(celebrities.length);
  previewBody.innerHTML = '';

  celebrities.forEach((c, i) => {
    const row = document.createElement('tr');

    const cellNum = document.createElement('td');
    cellNum.textContent = String(i + 1);

    const cellName = document.createElement('td');
    cellName.textContent = sanitize(c.name);

    const cellContact = document.createElement('td');
    cellContact.textContent = sanitize(c.contact);

    const cellWiki = document.createElement('td');
    const link = document.createElement('a');
    link.href = c.wikipediaLink;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = shortenUrl(c.wikipediaLink);
    cellWiki.appendChild(link);

    row.appendChild(cellNum);
    row.appendChild(cellName);
    row.appendChild(cellContact);
    row.appendChild(cellWiki);
    previewBody.appendChild(row);
  });
}

// ─── Agenda ─────────────────────────────────────────────────

function initAgendaHandlers() {
  agendaInput.addEventListener('input', () => {
    agendaCharCount.textContent = String(agendaInput.value.length);
    checkGenerateReady();
  });
}

// ─── Generate ───────────────────────────────────────────────

function checkGenerateReady() {
  const ready = hasApiKey()
    && parsedCelebrities.length > 0
    && agendaInput.value.trim().length >= 20
    && !isProcessing;
  generateBtn.disabled = !ready;
}

function initGenerateHandler() {
  generateBtn.addEventListener('click', async () => {
    const agenda = agendaInput.value.trim();
    const agendaValidation = validateAgenda(agenda);
    if (!agendaValidation.valid) {
      alert(agendaValidation.message);
      return;
    }
    if (!hasApiKey()) {
      alert('Please save your Gemini API key first.');
      return;
    }
    if (parsedCelebrities.length === 0) {
      alert('Please upload an Excel file with celebrities.');
      return;
    }

    isProcessing = true;
    generateBtn.disabled = true;
    generateBtn.textContent = '⏳ Processing...';
    hideResults();
    showProgress();

    try {
      const results = await processCelebrities(
        parsedCelebrities,
        agenda,
        getApiKey(),
        updateProgress,
      );

      const successCount = results.filter(r => r.status === 'success').length;
      const failCount = results.filter(r => r.status === 'error').length;
      setProgressComplete(successCount, failCount);
      showResults(results);
    } catch (err) {
      alert(`An unexpected error occurred: ${err.message}`);
    } finally {
      isProcessing = false;
      generateBtn.disabled = false;
      generateBtn.textContent = '🚀 Generate Personalized Tweets';
      checkGenerateReady();
    }
  });
}

// ─── Helpers ────────────────────────────────────────────────

function showStatus(el, message, type) {
  el.textContent = message;
  el.className = `status-message status-${type}`;
}
