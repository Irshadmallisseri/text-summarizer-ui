import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

function App() {
  const [inputType, setInputType] = useState('text');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      if (inputType === 'text') {
        if (!inputText.trim()) {
          setError('Please enter some text to summarize.');
          setLoading(false);
          return;
        }
        setStatus('Generating Summary...');
        const res = await axios.post(`${API_BASE_URL}/api/v1/summarize-text`, {
          text: inputText,
        });
        setSummary(res.data.summary || 'No summary returned.');
      } else if (inputType === 'audio') {
        if (!file) {
          setError('Please upload an audio file.');
          setLoading(false);
          return;
        }
        setStatus('Uploading Audio...');
        const formData = new FormData();
        formData.append('file', file);

        const transcriptionRes = await axios.post(
          `${API_BASE_URL}/api/v1/transcribe-audio`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        const transcription = transcriptionRes.data.transcription;

        if (!transcription) {
          setError('Failed to transcribe audio.');
          setLoading(false);
          return;
        }

        setStatus('Generating Summary...');
        const summaryRes = await axios.post(`${API_BASE_URL}/api/v1/summarize-text`, {
          text: transcription,
        });
        setSummary(summaryRes.data.summary || 'No summary returned.');
      }
    } catch (err) {
      setError(err?.response?.data?.detail || 'An error occurred while processing.');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="container py-5" style={{ maxWidth: '700px' }}>
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">AI Summarizer</h2>
        <p className="text-muted">Summarize your audio or text in seconds with just one click.</p>
      </div>

      {!loading && !summary && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="btn-group w-100 mb-4">
            <button
              className={`btn ${inputType === 'text' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setInputType('text')}
            >
              Enter Text
            </button>
            <button
              className={`btn ${inputType === 'audio' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setInputType('audio')}
            >
              Upload Audio
            </button>
          </div>

          <AnimatePresence mode="wait">
            {inputType === 'text' && (
              <motion.div
                key="text-area-wrapper"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.1 } }}
                transition={{ duration: 0.2 }}
              >
                <textarea
                  className="form-control mb-2 border-primary"
                  rows="6"
                  placeholder="Paste or write your text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  style={{ resize: 'none' }}
                ></textarea>
                {error && (
                  <div className="alert alert-danger py-2 text-center" role="alert">
                    {error}
                  </div>
                )}
              </motion.div>
            )}

            {inputType === 'audio' && (
              <motion.div
                key="audio-upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.1 } }}
                transition={{ duration: 0.2 }}
                className="mb-3 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <label className="form-control d-flex flex-column align-items-center justify-content-center border-primary py-5">
                  <FaCloudUploadAlt size={40} className="text-primary mb-2" />
                  <span className="text-muted">Click to upload or drag audio files here</span>
                  <input
                    type="file"
                    className="d-none"
                    accept="audio/*"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>
                <div className="form-text">Supported formats: MP3, WAV, FLAC, M4A</div>
                {file && (
                  <div className="mt-2 text-success">
                    Selected: {file.name}
                  </div>
                )}
                {error && (
                  <div className="alert alert-danger py-2 mt-2" role="alert">
                    {error}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <button className="btn btn-primary w-100" onClick={handleSubmit}>Summarize</button>
        </motion.div>
      )}

      {loading && (
        <motion.div
          className="text-center my-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="spinner-border text-primary mb-3"></div>
          <p className="fw-semibold text-primary">{status}</p>
        </motion.div>
      )}

      {summary && !loading && (
        <motion.div
          className="card shadow-sm border-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-body">
            <h5 className="card-title text-primary">Summary</h5>
            <p className="card-text">{summary}</p>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-outline-primary"
                onClick={() => navigator.clipboard.writeText(summary)}
              >
                Copy
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = 'summary.txt';
                  link.click();
                }}
              >
                Download
              </button>
              <button className="btn btn-primary" onClick={() => { setSummary(''); setInputText(''); setFile(null); }}>New Summary</button>
            </div>
          </div>
        </motion.div>
      )}

      <footer className="text-center mt-5 text-muted">
        <small>© {currentYear} AI Summarizer • <a href="#">Privacy</a> • <a href="#">Terms</a></small>
      </footer>
    </div>
  );
}

export default App;
