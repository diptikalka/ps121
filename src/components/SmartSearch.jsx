import React, { useState, useEffect } from 'react';
import { Search, Filter, Layers, AlertCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/apiService';

export default function SmartSearch({ onSelectWell }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const filterPresets = ["Mud Loss", "Gas Kick", "Stuck Pipe", "Asgard Formation", "Utsira Sand"];

  const handleSearch = async (searchTerm) => {
    const term = searchTerm !== undefined ? searchTerm : query;
    setIsSearching(true);
    const res = await apiService.searchDatabase(term);
    setIsSearching(false);
    setResults(res.wells || []);
  };

  useEffect(() => {
    handleSearch('');
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Search Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={20} color="var(--primary)" /> Smart Historical Drilling Database Search
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Query nearby offset wells by well name, formation horizon, depth, or past incident type
          </p>
        </div>

        {/* Input Bar */}
        <div style={{ display: 'flex', gap: '8px', flex: 1, maxWidth: '450px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              className="input-dark"
              style={{ width: '100%', paddingLeft: '36px' }}
              placeholder="Search wells, e.g. 'Mud Loss', 'Asgard', 'NW-402'..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); handleSearch(e.target.value); }}
            />
          </div>
          <button className="btn-primary" onClick={() => handleSearch(query)} style={{ padding: '8px 16px' }}>
            Search
          </button>
        </div>
      </div>

      {/* Quick Filter Presets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Filter size={14} /> FILTER PRESETS:
        </span>
        {filterPresets.map((preset, i) => (
          <button
            key={i}
            onClick={() => { setQuery(preset); handleSearch(preset); }}
            style={{
              background: query === preset ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: query === preset ? '1px solid #00f2fe' : '1px solid var(--border-color)',
              color: query === preset ? '#00f2fe' : 'var(--text-main)',
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Results Table */}
      <div style={{ overflowX: 'auto', background: '#070a12', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px' }}>WELL NAME</th>
              <th style={{ padding: '12px' }}>DISTANCE</th>
              <th style={{ padding: '12px' }}>TOTAL DEPTH</th>
              <th style={{ padding: '12px' }}>RISK LEVEL</th>
              <th style={{ padding: '12px' }}>HISTORICAL INCIDENTS LOGGED</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {results.map((well) => (
              <tr key={well.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px', fontWeight: 700, color: '#ffffff' }}>
                  {well.name} <span className="mono-val" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({well.id})</span>
                </td>
                <td style={{ padding: '12px' }}>
                  <span className="mono-val" style={{ color: '#00f2fe' }}>{well.distanceKm} km</span>
                </td>
                <td style={{ padding: '12px' }}>
                  <span className="mono-val">{well.td} m</span>
                </td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge-risk-${well.highestRisk.toLowerCase()}`}>
                    {well.highestRisk}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  {well.incidents.length === 0 ? (
                    <span style={{ color: '#10b981', fontSize: '0.75rem' }}>None (Clean Well)</span>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {well.incidents.map((inc, i) => (
                        <div key={i} style={{ color: '#f87171', fontSize: '0.75rem' }}>
                          • <strong>{inc.type}</strong> at {inc.depth}m ({inc.formation})
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button
                    onClick={() => onSelectWell && onSelectWell(well)}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    Inspect Map <ArrowUpRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
