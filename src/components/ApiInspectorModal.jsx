import React, { useState } from 'react';
import { X, Play, Code2, Copy, Check, Terminal } from 'lucide-react';
import { apiService } from '../services/apiService';

export default function ApiInspectorModal({ isOpen, onClose }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/nearby-wells');
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const endpoints = [
    {
      id: '/wells',
      method: 'GET',
      path: '/api/v1/wells',
      desc: 'List target well and all field offset wells with coordinates.',
      handler: () => apiService.getWells()
    },
    {
      id: '/nearby-wells',
      method: 'GET',
      path: '/api/v1/nearby-wells?lat=56.2814&lon=3.3952&radius=10',
      desc: 'Retrieve offset wells within specified spatial radius (km).',
      handler: () => apiService.getNearbyWells(56.2814, 3.3952, 10)
    },
    {
      id: '/upload-report',
      method: 'POST',
      path: '/api/v1/upload-report',
      desc: 'Simulate NLP extraction from WCR / DDR reports (depth, formation, event).',
      handler: () => apiService.uploadReport("WCR Sample Doc")
    },
    {
      id: '/risk-analysis',
      method: 'POST',
      path: '/api/v1/risk-analysis',
      desc: 'Calculate risk rating (LOW/MEDIUM/HIGH/CRITICAL) for given depth & formation.',
      handler: () => apiService.analyzeRisk(2870, "Asgard Formation")
    },
    {
      id: '/ai-insight',
      method: 'GET',
      path: '/api/v1/ai-insight?depth=2870&formation=Asgard',
      desc: 'Generate explainable natural language insight and RAG vector chunks.',
      handler: () => apiService.getAIInsight(2870, "Asgard Formation")
    },
    {
      id: '/search',
      method: 'GET',
      path: '/api/v1/search?q=mud+loss',
      desc: 'Search historical wells, incidents, and formations.',
      handler: () => apiService.searchDatabase('mud loss')
    }
  ];

  const currentEp = endpoints.find(e => e.id === selectedEndpoint);

  const handleRunApi = async () => {
    setLoading(true);
    const start = performance.now();
    const res = await currentEp.handler();
    const end = performance.now();
    setLoading(false);
    setApiResponse({
      ...res,
      _meta: {
        responseTimeMs: Math.round(end - start),
        status: 200,
        statusText: 'OK'
      }
    });
  };

  const handleCopyCurl = () => {
    const curl = `curl -X ${currentEp.method} "https://ertmac-nwis.api.equinor-simulation.com${currentEp.path}" -H "Authorization: Bearer mock_jwt_token_2026"`;
    navigator.clipboard.writeText(curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(4, 7, 14, 0.85)',
      backdropFilter: 'blur(10px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '24px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '900px',
        maxHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid rgba(0, 242, 254, 0.3)'
      }}>
        
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          background: 'rgba(13, 19, 34, 0.9)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              eRTMAC-NWIS REST API Developer Console
            </h2>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', flex: 1, overflow: 'hidden' }}>
          
          {/* Endpoint List Selector */}
          <div style={{ background: '#070a12', borderRight: '1px solid var(--border-color)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="label-sm" style={{ marginBottom: '4px' }}>SIMULATED REST API ENDPOINTS</div>
            {endpoints.map(ep => (
              <button
                key={ep.id}
                onClick={() => { setSelectedEndpoint(ep.id); setApiResponse(null); }}
                style={{
                  background: selectedEndpoint === ep.id ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.03)',
                  border: selectedEndpoint === ep.id ? '1px solid #00f2fe' : '1px solid transparent',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between'
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: selectedEndpoint === ep.id ? '#00f2fe' : 'var(--text-main)' }}>
                  {ep.id}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '2px 5px',
                  borderRadius: '4px',
                  background: ep.method === 'GET' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                  color: ep.method === 'GET' ? '#10b981' : '#3b82f6'
                }}>
                  {ep.method}
                </span>
              </button>
            ))}
          </div>

          {/* Endpoint Inspector Window */}
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
            
            {/* Selected Endpoint Info */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="mono-val" style={{ color: '#00f2fe', fontSize: '0.9rem', fontWeight: 700 }}>
                  {currentEp.method} {currentEp.path}
                </span>
                <button className="btn-secondary" onClick={handleCopyCurl} style={{ fontSize: '0.72rem', padding: '4px 8px' }}>
                  {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />} {copied ? 'Copied!' : 'Copy cURL'}
                </button>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{currentEp.desc}</p>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunApi}
              className="btn-primary"
              disabled={loading}
              style={{ alignSelf: 'flex-start', fontSize: '0.85rem' }}
            >
              <Play size={16} /> Execute API Request
            </button>

            {/* Response Output Container */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="label-sm">JSON Response Payload</span>
                {apiResponse && (
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                    Status: 200 OK • Time: {apiResponse._meta?.responseTimeMs} ms
                  </span>
                )}
              </div>

              {loading ? (
                <div style={{ background: '#040710', borderRadius: '8px', padding: '24px', textAlign: 'center', color: '#00f2fe' }}>
                  Sending request...
                </div>
              ) : apiResponse ? (
                <pre className="json-box" style={{ flex: 1, maxHeight: '360px', overflowY: 'auto' }}>
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              ) : (
                <div style={{ background: '#040710', borderRadius: '8px', padding: '30px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                  Click "Execute API Request" to view live JSON response payload.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
