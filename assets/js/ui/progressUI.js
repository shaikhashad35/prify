/**
 * progressUI.js — Progress bar & status log updates
 */

const progressSection = document.getElementById('section-progress');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const logContainer = document.getElementById('logContainer');

/**
 * Show the progress section and reset its state
 */
export function showProgress() {
  progressSection.hidden = false;
  progressBar.style.width = '0%';
  progressText.textContent = 'Preparing...';
  logContainer.innerHTML = '';
}

/**
 * Hide the progress section
 */
export function hideProgress() {
  progressSection.hidden = true;
}

/**
 * Update the progress bar and status text
 * @param {{ current: number, total: number, name: string, status: string }} progress
 */
export function updateProgress({ current, total, name, status }) {
  const pct = Math.round((current / total) * 100);
  progressBar.style.width = `${pct}%`;

  const statusMessages = {
    fetching_bio: `Fetching Wikipedia bio for ${name}...`,
    generating_tweet: `Generating tweet for ${name}...`,
    success: `✅ ${name} — done`,
    error: `❌ ${name} — failed`,
  };

  progressText.textContent = `Processing ${current}/${total}: ${statusMessages[status] || name}`;

  // Append to log for success/error statuses
  if (status === 'success' || status === 'error') {
    const entry = document.createElement('div');
    entry.className = `log-entry log-${status}`;
    entry.textContent = statusMessages[status];
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
  }
}

/**
 * Set the progress to complete state
 * @param {number} successCount
 * @param {number} failCount
 */
export function setProgressComplete(successCount, failCount) {
  progressBar.style.width = '100%';
  progressText.textContent = `Done! ${successCount} succeeded, ${failCount} failed.`;
}
