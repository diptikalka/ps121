import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Navigation, Layers, CheckCircle2 } from 'lucide-react';

export default function MapView({ targetWell, nearbyWells, radiusKm, selectedWell, setSelectedWell }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet Map
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [targetWell.lat, targetWell.lon],
        zoom: 11,
        zoomControl: true,
        attributionControl: false
      });

      // Esri World Dark Gray Canvas tile server (100% Open Public GIS, No API Key Required)
      const tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 16,
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
      });

      tileLayer.on('tileerror', function() {
        // Backup fallback to standard OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
      });

      tileLayer.addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    // 1. Draw Radius Ring around Target Well
    const radiusCircle = L.circle([targetWell.lat, targetWell.lon], {
      color: '#00f2fe',
      fillColor: '#00f2fe',
      fillOpacity: 0.1,
      weight: 2,
      dashArray: '6, 6',
      radius: radiusKm * 1000 // meters
    });
    layerGroup.addLayer(radiusCircle);

    // 2. Draw Target Well Marker (Cyan Diamond)
    const targetIcon = L.divIcon({
      className: 'custom-target-marker',
      html: `
        <div style="
          width: 22px;
          height: 22px;
          background: #00f2fe;
          border: 2px solid #ffffff;
          border-radius: 4px;
          transform: rotate(45deg);
          box-shadow: 0 0 16px #00f2fe;
        "></div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    const targetMarker = L.marker([targetWell.lat, targetWell.lon], { icon: targetIcon });
    targetMarker.bindPopup(`
      <div style="padding: 4px;">
        <strong style="color: #00f2fe; font-size: 13px;">🎯 ${targetWell.name}</strong><br/>
        <span style="font-size: 11px; color: #94a3b8;">Current MD: <strong>${targetWell.currentDepth}m</strong></span><br/>
        <span style="font-size: 11px; color: #38bdf8;">Formation: ${targetWell.currentFormation}</span>
      </div>
    `);
    layerGroup.addLayer(targetMarker);

    // 3. Draw Nearby Offset Well Markers
    nearbyWells.forEach(well => {
      let badgeColor = '#10b981'; // LOW
      if (well.highestRisk === 'CRITICAL') badgeColor = '#ef4444';
      else if (well.highestRisk === 'HIGH') badgeColor = '#f59e0b';
      else if (well.highestRisk === 'MEDIUM') badgeColor = '#eab308';

      const isSelected = selectedWell?.id === well.id;

      const offsetIcon = L.divIcon({
        className: 'custom-well-marker',
        html: `
          <div style="
            width: ${isSelected ? '24px' : '18px'};
            height: ${isSelected ? '24px' : '18px'};
            background: ${badgeColor};
            border: 2px solid ${isSelected ? '#ffffff' : 'rgba(0,0,0,0.5)'};
            border-radius: 50%;
            box-shadow: 0 0 ${isSelected ? '16px' : '8px'} ${badgeColor};
            cursor: pointer;
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([well.lat, well.lon], { icon: offsetIcon });
      
      marker.on('click', () => {
        setSelectedWell(well);
      });

      marker.bindPopup(`
        <div style="padding: 6px;">
          <div style="font-weight: 700; color: #f8fafc; font-size: 13px;">${well.name} (${well.id})</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Distance: <strong style="color:#00f2fe">${well.distanceKm} km</strong> • TD: ${well.td}m</div>
          <div style="margin-top: 4px; font-size: 11px;">Risk Level: <span style="color: ${badgeColor}; font-weight: 700;">${well.highestRisk}</span></div>
        </div>
      `);

      layerGroup.addLayer(marker);
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 150);

  }, [targetWell, nearbyWells, radiusKm, selectedWell]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', height: '100%', minHeight: '500px' }}>
      
      {/* Proper Map Display Container */}
      <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', padding: '4px' }}>
        
        {/* Map Title Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 500,
          background: 'rgba(13, 19, 34, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Navigation size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>
            Geospatial Field Map ({nearbyWells.length} Offset Wells)
          </span>
        </div>

        {/* Legend Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          zIndex: 500,
          background: 'rgba(13, 19, 34, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '0.75rem'
        }}>
          <div style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--text-muted)' }}>FIELD LEGEND</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', background: '#00f2fe', transform: 'rotate(45deg)' }}></span>
              <span>Target Drilling Well (Alpha-X1)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', background: '#ef4444', borderRadius: '50%' }}></span>
              <span>Critical Risk (Mud Loss Zone)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', background: '#f59e0b', borderRadius: '50%' }}></span>
              <span>High Risk (Gas Kick / Sticking)</span>
            </div>
          </div>
        </div>

        {/* Leaflet Map Box */}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '480px' }} />
      </div>

      {/* Offset Well Sidebar Detail Card */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
        {selectedWell ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#00f2fe' }}>{selectedWell.name}</h3>
                <span className="mono-val" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {selectedWell.id}</span>
              </div>
              <span className={`badge-risk-${selectedWell.highestRisk.toLowerCase()}`}>
                {selectedWell.highestRisk}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px' }}>
                <div className="label-sm">Distance</div>
                <div className="mono-val" style={{ color: '#ffffff', fontSize: '0.95rem' }}>{selectedWell.distanceKm} km</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px' }}>
                <div className="label-sm">Total Depth</div>
                <div className="mono-val" style={{ color: '#ffffff', fontSize: '0.95rem' }}>{selectedWell.td} m</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px' }}>
                <div className="label-sm">Spud Year</div>
                <div className="mono-val" style={{ color: '#ffffff' }}>{selectedWell.spudYear}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '6px' }}>
                <div className="label-sm">Status</div>
                <div style={{ color: '#38bdf8', fontWeight: 600 }}>{selectedWell.status}</div>
              </div>
            </div>

            {/* WCR Summary */}
            <div>
              <div className="label-sm" style={{ marginBottom: '4px' }}>WCR Geological Summary</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px', borderLeft: '3px solid var(--primary)' }}>
                {selectedWell.wcrSummary}
              </p>
            </div>

            {/* Incident History Timeline */}
            <div>
              <div className="label-sm" style={{ marginBottom: '8px' }}>Historical Incidents ({selectedWell.incidents.length})</div>
              {selectedWell.incidents.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> No major unplanned NPT events logged.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedWell.incidents.map((inc, i) => (
                    <div key={i} style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#f87171', marginBottom: '4px' }}>
                        <span>⚠️ {inc.type}</span>
                        <span className="mono-val">@ {inc.depth}m</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Formation: <strong style={{ color: '#ffffff' }}>{inc.formation}</strong>
                      </div>
                      <div style={{ color: 'var(--text-main)', marginBottom: '4px' }}>
                        <strong>Cause:</strong> {inc.cause}
                      </div>
                      <div style={{ color: '#38bdf8' }}>
                        <strong>Mitigation:</strong> {inc.mitigation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </>
        ) : (
          <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Layers size={36} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '8px' }} />
            <p>Click any offset well marker on the map to inspect historical drilling records & incidents.</p>
          </div>
        )}
      </div>

    </div>
  );
}
