/**
 * app.js — Main entry point for PRify. Wires up all modules.
 */

import { initFormHandler } from './ui/formHandler.js';
import { initDownloadButton } from './ui/resultsUI.js';

/**
 * Initialize the PRify application
 */
function init() {
  initFormHandler();
  initDownloadButton();
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
