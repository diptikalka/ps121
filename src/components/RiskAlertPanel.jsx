import React from 'react';
import { AlertTriangle, ShieldAlert, CheckSquare, Zap, CheckCircle2, ChevronRight, Info } from 'lucide-react';

export default function RiskAlertPanel({ riskAnalysis }) {
  if (!riskAnalysis) return null;

  const { riskLevel, riskScore, reasons, matchingIncidents, recommendedActions, depth, formation } = riskAnalysis;

  let borderColor = '#10b981';
  let bgGradient = 'rgba(16, 185, 129, 0.08)';
  let textColor = '#10b981';

  if (riskLevel === 'CRITICAL') {
    borderColor = '#ef4444';
    bgGradient = 'linear-gradient(135deg, rgba(239, 68, 68, 0.18) 0%, rgba(220, 38, 38, 0.08) 100%)';
    textColor = '#f87171';
  } else if (riskLevel === 'HIGH') {
    borderColor = '#f59e0b';
    bgGradient = 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 100%)';
    textColor = '#fbbf24';
  } else if (riskLevel === 'MEDIUM') {
    borderColor = '#eab308';
    bgGradient = 'rgba(234, 179, 8, 0.08)';
    textColor = '#fde047';
  }

  return (
    <div className="glass-panel" style={{
      padding: '16px',
      background: bgGradient,
      border: `1px solid ${borderColor}`,
      boxShadow: riskLevel === 'CRITICAL' ? '0 0 25px rgba(239, 68, 68, 0.25)' : 'none',
      transition: 'all 0.3s ease'
    }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? (
            <ShieldAlert size={24} color={textColor} className="pulse-indicator alert" style={{ width: '24px', height: '24px' }} />
          ) : (
            <Zap size={22} color={textColor} />
          )}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              REAL-TIME RISK ALERT SYSTEM
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: textColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {riskLevel === 'CRITICAL' && '⚠️ CRITICAL DRILLING HAZARD'}
              {riskLevel === 'HIGH' && '⚡ HIGH INCIDENT PROBABILITY'}
              {riskLevel === 'MEDIUM' && '⚡ MODERATE FORMATION RISK'}
              {riskLevel === 'LOW' && '✅ NORMAL DRILLING CONDITIONS'}
            </h3>
          </div>
        </div>

        {/* Risk Level Badge & Score Dial */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div className="label-sm">Risk Score</div>
            <div className="mono-val" style={{ fontSize: '1.25rem', fontWeight: 800, color: textColor }}>
              {riskScore} / 100
            </div>
          </div>

          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)',
            border: `3px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            fontSize: '0.85rem',
            fontWeight: 800,
            color: textColor
          }}>
            {riskScore}%
          </div>
        </div>
      </div>

      {/* Main Alert Message */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '12px',
        borderRadius: '8px',
        borderLeft: `4px solid ${borderColor}`,
        marginBottom: '12px',
        fontSize: '0.85rem'
      }}>
        <div style={{ color: '#ffffff', fontWeight: 600, marginBottom: '4px' }}>
          Depth Horizon: {depth}m MD • Lithology: {formation}
        </div>
        {reasons.map((r, i) => (
          <div key={i} style={{ color: 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
            <ChevronRight size={14} color={textColor} style={{ flexShrink: 0, marginTop: '3px' }} />
            <span>{r}</span>
          </div>
        ))}
      </div>

      {/* Matching Offset Incidents Highlight */}
      {matchingIncidents && matchingIncidents.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <div className="label-sm" style={{ marginBottom: '6px', color: textColor }}>
            Correlated Nearby Incidents ({matchingIncidents.length})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
            {matchingIncidents.map((inc, i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem'
              }}>
                <div style={{ fontWeight: 700, color: '#38bdf8' }}>{inc.wellName} ({inc.distanceKm} km away)</div>
                <div style={{ color: '#f87171', fontWeight: 600, margin: '2px 0' }}>
                  {inc.incidentType} @ {inc.incidentDepth}m MD
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                  Cause: {inc.cause}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Action Checklist */}
      <div>
        <div className="label-sm" style={{ marginBottom: '6px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckSquare size={14} color="var(--primary)" /> Engineering Mitigation Directives
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {recommendedActions.map((action, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(0,0,0,0.25)',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              color: '#f1f5f9'
            }}>
              <CheckCircle2 size={14} color={borderColor} style={{ flexShrink: 0 }} />
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
