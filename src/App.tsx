import { useState, useCallback } from 'react';
import type { CelebInput, CelebResult, ProgressInfo } from './types';
import { validateAgenda } from './utils/validators';
import { getApiKey, hasApiKey } from './utils/storage';
import { processCelebrities } from './services/orchestrator';
import Header from './components/Header';
import ApiKeySection from './components/ApiKeySection';
import FileUploadSection from './components/FileUploadSection';
import AgendaSection from './components/AgendaSection';
import ProgressSection from './components/ProgressSection';
import ResultsSection from './components/ResultsSection';
import './App.css';

export default function App() {
  const [apiKeyValid, setApiKeyValid] = useState(false);
  const [celebrities, setCelebrities] = useState<CelebInput[]>([]);
  const [agenda, setAgenda] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState<ProgressInfo | null>(null);
  const [logs, setLogs] = useState<{ message: string; type: 'success' | 'error' }[]>([]);
  const [complete, setComplete] = useState<{ success: number; fail: number } | null>(null);
  const [results, setResults] = useState<CelebResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleKeyStatusChange = useCallback((valid: boolean) => {
    setApiKeyValid(valid);
  }, []);

  const handleCelebritiesLoaded = useCallback((celebs: CelebInput[]) => {
    setCelebrities(celebs);
  }, []);

  const isReady = apiKeyValid && celebrities.length > 0 && agenda.trim().length >= 20 && !isProcessing;

  const handleGenerate = async () => {
    const agendaValidation = validateAgenda(agenda);
    if (!agendaValidation.valid) {
      alert(agendaValidation.message);
      return;
    }
    if (!hasApiKey()) {
      alert('Please save your Gemini API key first.');
      return;
    }

    setIsProcessing(true);
    setShowProgress(true);
    setShowResults(false);
    setResults([]);
    setLogs([]);
    setComplete(null);
    setProgress(null);

    try {
      const output = await processCelebrities(
        celebrities,
        agenda.trim(),
        getApiKey()!,
        (p: ProgressInfo) => {
          setProgress({ ...p });
          if (p.status === 'success') {
            setLogs(prev => [...prev, { message: `✅ ${p.name} — done`, type: 'success' }]);
          } else if (p.status === 'error') {
            setLogs(prev => [...prev, { message: `❌ ${p.name} — failed`, type: 'error' }]);
          }
        }
      );

      const successCount = output.filter(r => r.status === 'success').length;
      const failCount = output.filter(r => r.status === 'error').length;
      setComplete({ success: successCount, fail: failCount });
      setResults(output);
      setShowResults(true);
    } catch (err) {
      alert(`An unexpected error occurred: ${(err as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <ApiKeySection onKeyStatusChange={handleKeyStatusChange} />
        <FileUploadSection onCelebritiesLoaded={handleCelebritiesLoaded} />
        <AgendaSection agenda={agenda} onAgendaChange={setAgenda} />
        <div className="action-bar">
          <button
            className="btn btn-primary btn-large"
            disabled={!isReady}
            onClick={handleGenerate}
          >
            {isProcessing ? '⏳ Processing...' : '🚀 Generate Personalized Tweets'}
          </button>
        </div>
        <ProgressSection
          visible={showProgress}
          progress={progress}
          logs={logs}
          complete={complete}
        />
        <ResultsSection visible={showResults} results={results} />
      </main>
      <footer className="footer">
        <p>PRify v1.0 — All processing happens in your browser. Your data never leaves your device.</p>
      </footer>
    </div>
  );
}
