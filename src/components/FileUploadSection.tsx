import { useState, useRef, type DragEvent } from 'react';
import type { CelebInput } from '../types';
import { validateFile } from '../utils/validators';
import { parseExcelFile } from '../services/excelService';
import { shortenUrl } from '../utils/helpers';

interface Props {
  onCelebritiesLoaded: (celebs: CelebInput[]) => void;
}

export default function FileUploadSection({ onCelebritiesLoaded }: Props) {
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | 'info' | '' }>({ message: '', type: '' });
  const [celebrities, setCelebrities] = useState<CelebInput[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setStatus({ message: validation.message, type: 'error' });
      setCelebrities([]);
      onCelebritiesLoaded([]);
      return;
    }

    setStatus({ message: '⏳ Parsing Excel file...', type: 'info' });

    const { celebrities: celebs, error } = await parseExcelFile(file);
    if (error) {
      setStatus({ message: error, type: 'error' });
      setCelebrities([]);
      onCelebritiesLoaded([]);
      return;
    }

    setCelebrities(celebs);
    setStatus({ message: `✅ Found ${celebs.length} celebrities.`, type: 'success' });
    onCelebritiesLoaded(celebs);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleClick = () => fileInputRef.current?.click();

  const handleInputChange = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <section className="card">
      <div className="card-header">
        <span className="step-badge">Step 2</span>
        <h2>Upload Celebrity List</h2>
      </div>
      <div className="card-body">
        <p className="hint">
          Excel file (.xlsx) with columns: <strong>Name</strong>, <strong>Contact</strong>, <strong>Wikipedia Link</strong>
          {' — '}
          <a href={`${import.meta.env.BASE_URL}sample-celebrities.xlsx`} download>📥 Download sample file</a>
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        <div
          className={`dropzone${dragActive ? ' dropzone-active' : ''}`}
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="dropzone-content">
            <span className="dropzone-icon">📁</span>
            <p>Drag & drop your Excel file here</p>
            <p className="hint">or click to browse</p>
          </div>
        </div>
        {status.message && (
          <div className={`status-message status-${status.type}`}>{status.message}</div>
        )}
        {celebrities.length > 0 && (
          <div className="preview-section">
            <h3>📋 Preview ({celebrities.length} celebrities)</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Wikipedia Link</th>
                  </tr>
                </thead>
                <tbody>
                  {celebrities.map((c, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{c.name}</td>
                      <td>{c.contact}</td>
                      <td>
                        <a href={c.wikipediaLink} target="_blank" rel="noopener noreferrer">
                          {shortenUrl(c.wikipediaLink)}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
