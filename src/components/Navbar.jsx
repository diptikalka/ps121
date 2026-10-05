import React from 'react';
import { 
  Activity, 
  MapPin, 
  Layers, 
  FileText, 
  Search, 
  Code2, 
  Sparkles, 
  Radio, 
  Sliders
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  radiusKm, 
  setRadiusKm, 
  setShowApiInspector,
  targetWell 
}) {
  return (
    <header style={{
      background: 'rgba(8, 11, 17, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '14px 28px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
            boxShadow: '0 4px 14px rgba(56, 189, 248, 0.25)',
            color: '#040914'
          }}>
            <Sparkles size={22} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                letterSpacing: '-0.02em', 
                background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent' 
              }}>
                eRTMAC-NWIS
              </h1>
              <span className="badge-risk-low" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-indicator"></span> STREAM ACTIVE
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1px' }}>
              Nearby Wells Intelligence System • Target: <strong style={{ color: '#f8fafc', fontWeight: 600 }}>{targetWell.name}</strong> ({targetWell.field})
            </p>
          </div>
        </div>

        {/* Global Controls: Radius & API Inspector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Radius Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-md)'
          }}>
            <Radio size={15} color="var(--primary)" />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>RADIUS:</span>
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value={5} style={{ background: '#0f172a', color: '#fff' }}>5 km</option>
              <option value={10} style={{ background: '#0f172a', color: '#fff' }}>10 km</option>
              <option value={25} style={{ background: '#0f172a', color: '#fff' }}>25 km</option>
              <option value={50} style={{ background: '#0f172a', color: '#fff' }}>50 km</option>
            </select>
          </div>

          {/* REST API Tester Button */}
          <button
            onClick={() => setShowApiInspector(true)}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '7px 14px' }}
          >
            <Code2 size={15} color="var(--primary)" />
            <span>API Inspector</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', gap: '6px', marginTop: '14px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', overflowX: 'auto' }}>
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <Activity size={15} /> Live Ops & Risk Monitor
        </button>

        <button
          className={`tab-btn ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <MapPin size={15} /> Interactive Map
        </button>

        <button
          className={`tab-btn ${activeTab === 'stratigraphy' ? 'active' : ''}`}
          onClick={() => setActiveTab('stratigraphy')}
        >
          <Layers size={15} /> Depth Correlation
        </button>

        <button
          className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          <FileText size={15} /> Document Processor (WCR/DDR)
        </button>

        <button
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <Search size={15} /> Smart Search
        </button>
      </nav>
    </header>
  );
}
