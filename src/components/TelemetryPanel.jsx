import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, Gauge, ArrowDownCircle, Layers, Droplet } from 'lucide-react';
import { FORMATION_LAYERS } from '../data/mockData';

export default function TelemetryPanel({ 
  currentDepth, 
  setCurrentDepth, 
  isSimulating, 
  setIsSimulating,
  telemetry 
}) {
  
  // Find active formation layer based on current depth
  const currentFormationLayer = FORMATION_LAYERS.find(
    f => currentDepth >= f.startDepth && currentDepth < f.endDepth
  ) || FORMATION_LAYERS[FORMATION_LAYERS.length - 1];

  const handleStepDepth = () => {
    setCurrentDepth(prev => Math.min(3800, prev + 50));
  };

  const handleReset = () => {
    setIsSimulating(false);
    setCurrentDepth(2420);
  };

  return (
    <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gauge size={20} color="var(--primary)" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Real-Time Drilling Stream Simulation</h2>
        </div>

        {/* Live Simulation Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className={isSimulating ? "btn-danger" : "btn-primary"}
            onClick={() => setIsSimulating(!isSimulating)}
            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
          >
            {isSimulating ? (
              <> <Pause size={14} /> PAUSE STREAM </>
            ) : (
              <> <Play size={14} /> START DRILLING SIMULATION </>
            )}
          </button>

          <button
            className="btn-secondary"
            onClick={handleStepDepth}
            disabled={isSimulating}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            <SkipForward size={14} /> +50m Step
          </button>

          <button
            className="btn-secondary"
            onClick={handleReset}
            style={{ fontSize: '0.8rem', padding: '6px 10px' }}
            title="Reset Depth"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Depth Slider Scrub Bar */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowDownCircle size={14} color="var(--primary)" /> Measured Depth (MD)
          </span>
          <span className="mono-val" style={{ color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 700 }}>
            {currentDepth} meters
          </span>
        </div>

        <input
          type="range"
          min="1000"
          max="3800"
          step="10"
          value={currentDepth}
          onChange={(e) => setCurrentDepth(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#00f2fe',
            cursor: 'pointer',
            height: '6px'
          }}
        />

        {/* Active Formation Indicator Banner */}
        <div style={{
          marginTop: '10px',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          background: 'rgba(0,0,0,0.4)',
          borderLeft: `4px solid ${currentFormationLayer.color}`,
          padding: '8px 12px',
          borderRadius: '6px'
        }}>
          <div>
            <span className="label-sm" style={{ color: 'var(--text-muted)' }}>Active Lithology Layer</span>
            <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.88rem' }}>
              {currentFormationLayer.name} ({currentFormationLayer.startDepth}m - {currentFormationLayer.endDepth}m)
            </div>
          </div>
          <span className={`badge-risk-${currentFormationLayer.baseRisk.toLowerCase()}`}>
            Baseline: {currentFormationLayer.baseRisk} Risk
          </span>
        </div>
      </div>

      {/* Telemetry Grid Telemetry Parameters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
        
        {/* ROP */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px' }}>
          <div className="label-sm">ROP (m/hr)</div>
          <div className="mono-val" style={{ fontSize: '1.2rem', color: '#00f2fe', marginTop: '2px' }}>
            {(telemetry.rop + (Math.sin(currentDepth / 20) * 2)).toFixed(1)}
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Rate of Penetration</div>
        </div>

        {/* Mud Weight / ECD */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px' }}>
          <div className="label-sm">Mud Weight / ECD</div>
          <div className="mono-val" style={{ fontSize: '1.2rem', color: telemetry.ecd > 1.45 ? '#ef4444' : '#38bdf8', marginTop: '2px' }}>
            {telemetry.ecd} S.G.
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>12.3 ppg equivalent</div>
        </div>

        {/* Torque */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px' }}>
          <div className="label-sm">Torque</div>
          <div className="mono-val" style={{ fontSize: '1.2rem', color: '#f59e0b', marginTop: '2px' }}>
            {(telemetry.torque + (currentDepth > 3000 ? 5 : 0)).toFixed(1)} kN.m
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Top Drive Load</div>
        </div>

        {/* Standpipe Pressure */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px' }}>
          <div className="label-sm">SPP</div>
          <div className="mono-val" style={{ fontSize: '1.2rem', color: '#a855f7', marginTop: '2px' }}>
            {Math.round(telemetry.spp + (currentDepth * 0.12))} psi
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>Standpipe Pressure</div>
        </div>

      </div>

    </div>
  );
}
