import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, Cpu, ArrowRight, Database, Sparkles, AlertCircle } from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../data/mockData';
import { apiService } from '../services/apiService';

export default function DocumentProcessor({ onInjectDocument }) {
  const [selectedDoc, setSelectedDoc] = useState(SAMPLE_DOCUMENTS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(SAMPLE_DOCUMENTS[0].extracted);
  const [customText, setCustomText] = useState('');

  const handleSelectSample = async (doc) => {
    setSelectedDoc(doc);
    setCustomText('');
    setIsProcessing(true);
    const res = await apiService.uploadReport(doc);
    setIsProcessing(false);
    setExtractedData(res.extracted);
  };

  const handleProcessCustomText = async () => {
    if (!customText.trim()) return;
    setIsProcessing(true);
    const res = await apiService.uploadReport(customText);
    setIsProcessing(false);
    setExtractedData(res.extracted);
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="var(--primary)" /> Intelligent Document Extraction (WCR / DDR PDF Parser)
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Converts unstructured Well Completion Reports & Daily Drilling Logs into structured risk database entities
          </p>
        </div>

        {/* Sample Document Preset Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {SAMPLE_DOCUMENTS.map(doc => (
            <button
              key={doc.id}
              onClick={() => handleSelectSample(doc)}
              className={selectedDoc?.id === doc.id ? "btn-primary" : "btn-secondary"}
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              <FileText size={14} /> {doc.type} ({doc.id.toUpperCase()})
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Raw Document & Extracted JSON */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        
        {/* Left Column: Raw Document Reader / Custom Upload */}
        <div style={{ background: '#070a12', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="label-sm" style={{ color: '#00f2fe' }}>Document Input & Text Stream</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Format: PDF / OCR Text</span>
          </div>

          <textarea
            value={customText || selectedDoc?.rawContent || ''}
            onChange={(e) => setCustomText(e.target.value)}
            style={{
              width: '100%',
              height: '320px',
              background: '#040710',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              color: '#94a3b8',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              padding: '12px',
              outline: 'none',
              resize: 'none'
            }}
            placeholder="Paste WCR / DDR report text here..."
          />

          <button
            onClick={handleProcessCustomText}
            className="btn-primary"
            style={{ alignSelf: 'flex-start', fontSize: '0.8rem' }}
          >
            <Cpu size={16} /> Run Extraction Pipeline
          </button>
        </div>

        {/* Right Column: Extracted Structured JSON */}
        <div style={{ background: '#070a12', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="label-sm" style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} /> Extracted Entity Schema
            </span>
            {isProcessing && (
              <span style={{ fontSize: '0.75rem', color: '#00f2fe', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={14} className="pulse-indicator" /> Processing NLP Pipeline...
              </span>
            )}
          </div>

          {/* Structured Output Cards */}
          {extractedData && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '320px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                <div className="label-sm">Target Well Name</div>
                <div style={{ fontWeight: 700, color: '#ffffff' }}>{extractedData.wellName}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                  <div className="label-sm">Depth Horizon</div>
                  <div className="mono-val" style={{ color: '#00f2fe' }}>{extractedData.depth}</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                  <div className="label-sm">Formation Lithology</div>
                  <div style={{ color: '#38bdf8', fontWeight: 600 }}>{extractedData.formation}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                <div className="label-sm" style={{ color: '#f87171' }}>Extracted Incident Event</div>
                <div style={{ fontWeight: 700, color: '#ffffff' }}>{extractedData.event}</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                <div className="label-sm">AI Suggested Engineering Directive</div>
                <div style={{ color: '#10b981' }}>{extractedData.suggestedAction}</div>
              </div>

              <pre className="json-box">
                {JSON.stringify(extractedData, null, 2)}
              </pre>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => onInjectDocument && onInjectDocument(extractedData)}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', marginTop: 'auto', borderColor: '#10b981', color: '#10b981' }}
          >
            <Database size={16} /> Inject Extracted Data into Live Field Database
          </button>
        </div>

      </div>

    </div>
  );
}
