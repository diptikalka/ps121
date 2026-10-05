import React from 'react';
import { FORMATION_LAYERS, TARGET_WELL, NEARBY_WELLS } from '../data/mockData';
import { Layers, AlertTriangle, ArrowDown, MapPin } from 'lucide-react';

export default function StratigraphyCorrelation({ currentDepth }) {
  // Select key offset wells for correlation chart
  const correlationWells = [
    { ...TARGET_WELL, name: 'Target: Valhall Alpha-X1', isTarget: true },
    NEARBY_WELLS.find(w => w.id === 'NW-402'),
    NEARBY_WELLS.find(w => w.id === 'NW-308'),
    NEARBY_WELLS.find(w => w.id === 'NW-512'),
    NEARBY_WELLS.find(w => w.id === 'NW-881')
  ];

  const totalMaxDepth = 4000;

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--primary)" /> Multi-Well Depth Stratigraphy Correlation
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Comparative cross-section of target well against nearby offset wells with historical incident horizon overlay
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444' }}>
            <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></span> Mud Loss Event
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
            <span style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%' }}></span> Gas Kick
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a855f7' }}>
            <span style={{ width: '8px', height: '8px', background: '#a855f7', borderRadius: '50%' }}></span> Stuck Pipe / Collapse
          </span>
        </div>
      </div>

      {/* Main Stratigraphy Diagram Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '120px repeat(5, 1fr)',
        gap: '12px',
        background: '#070a12',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        padding: '16px',
        minHeight: '520px',
        overflowX: 'auto'
      }}>
        
        {/* Column 1: Vertical Depth Scale */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid var(--border-color)', paddingRight: '12px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>DEPTH (MD)</div>
          {[0, 800, 1800, 2600, 3300, 3800, 4000].map(d => (
            <div key={d} className="mono-val" style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {d}m
            </div>
          ))}
        </div>

        {/* Columns 2-6: Individual Well Columns */}
        {correlationWells.map((well, idx) => {
          const isTarget = well.isTarget;

          return (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              background: isTarget ? 'rgba(0, 242, 254, 0.04)' : 'rgba(255, 255, 255, 0.02)',
              border: isTarget ? '1px solid rgba(0, 242, 254, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              padding: '8px'
            }}>
              
              {/* Well Header */}
              <div style={{ textAlign: 'center', marginBottom: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isTarget ? '#00f2fe' : '#ffffff' }}>
                  {well.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {isTarget ? `Current MD: ${currentDepth}m` : `${well.distanceKm} km away • TD: ${well.td}m`}
                </div>
              </div>

              {/* Vertical Formation Layer Stack */}
              <div style={{ flex: 1, position: 'relative', borderRadius: '4px', overflow: 'hidden', background: '#0a0e1a' }}>
                
                {/* Render Formations */}
                {FORMATION_LAYERS.map((form, fIdx) => {
                  const topPct = (form.startDepth / totalMaxDepth) * 100;
                  const heightPct = ((form.endDepth - form.startDepth) / totalMaxDepth) * 100;

                  return (
                    <div key={fIdx} style={{
                      position: 'absolute',
                      top: `${topPct}%`,
                      height: `${heightPct}%`,
                      width: '100%',
                      background: form.color,
                      opacity: 0.22,
                      borderBottom: '1px dashed rgba(255,255,255,0.15)',
                      padding: '4px',
                      boxSizing: 'border-block'
                    }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#ffffff', opacity: 0.8 }}>
                        {form.name}
                      </span>
                    </div>
                  );
                })}

                {/* If Target Well: Draw Bit Line */}
                {isTarget && (
                  <div style={{
                    position: 'absolute',
                    top: `${(currentDepth / totalMaxDepth) * 100}%`,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: '#00f2fe',
                    boxShadow: '0 0 10px #00f2fe',
                    zIndex: 10
                  }}>
                    <span style={{
                      position: 'absolute',
                      right: '4px',
                      top: '-18px',
                      background: '#00f2fe',
                      color: '#040914',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '1px 4px',
                      borderRadius: '3px'
                    }}>
                      BIT @ {currentDepth}m
                    </span>
                  </div>
                )}

                {/* If Offset Well: Draw Incident Pin Markers */}
                {!isTarget && well.incidents && well.incidents.map((inc, iIdx) => {
                  const incPct = (inc.depth / totalMaxDepth) * 100;
                  let pinColor = '#ef4444';
                  if (inc.type.includes('Kick')) pinColor = '#f59e0b';
                  if (inc.type.includes('Torque') || inc.type.includes('Stuck')) pinColor = '#a855f7';

                  return (
                    <div key={iIdx} style={{
                      position: 'absolute',
                      top: `${incPct}%`,
                      left: '8px',
                      right: '8px',
                      background: pinColor,
                      color: '#ffffff',
                      padding: '3px 6px',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      boxShadow: `0 0 8px ${pinColor}`,
                      zIndex: 8
                    }}>
                      ⚠️ {inc.type} ({inc.depth}m)
                    </div>
                  );
                })}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
