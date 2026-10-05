import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import MapView from './components/MapView';
import TelemetryPanel from './components/TelemetryPanel';
import RiskAlertPanel from './components/RiskAlertPanel';
import AiInsightPanel from './components/AiInsightPanel';
import StratigraphyCorrelation from './components/StratigraphyCorrelation';
import DocumentProcessor from './components/DocumentProcessor';
import SmartSearch from './components/SmartSearch';
import ApiInspectorModal from './components/ApiInspectorModal';

import { TARGET_WELL, NEARBY_WELLS, FORMATION_LAYERS } from './data/mockData';
import { apiService } from './services/apiService';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [radiusKm, setRadiusKm] = useState(10);
  const [currentDepth, setCurrentDepth] = useState(TARGET_WELL.currentDepth);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedWell, setSelectedWell] = useState(NEARBY_WELLS[0]);
  const [showApiInspector, setShowApiInspector] = useState(false);
  
  const [nearbyWells, setNearbyWells] = useState([]);
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [aiInsight, setAiInsight] = useState(null);

  // Active Formation Layer lookup
  const currentFormationLayer = FORMATION_LAYERS.find(
    f => currentDepth >= f.startDepth && currentDepth < f.endDepth
  ) || FORMATION_LAYERS[FORMATION_LAYERS.length - 1];

  // 1. Fetch Nearby Wells whenever radius changes
  useEffect(() => {
    async function loadNearby() {
      const res = await apiService.getNearbyWells(TARGET_WELL.lat, TARGET_WELL.lon, radiusKm);
      setNearbyWells(res.wells || []);
    }
    loadNearby();
  }, [radiusKm]);

  // 2. Recalculate Risk & AI Insight whenever depth or formation changes
  useEffect(() => {
    async function updateIntelligence() {
      const updatedTelemetry = {
        ...TARGET_WELL.telemetry,
        ecd: currentDepth >= 2600 && currentDepth <= 3300 ? 1.48 : 1.38
      };

      const riskRes = await apiService.analyzeRisk(currentDepth, currentFormationLayer.name, updatedTelemetry);
      setRiskAnalysis(riskRes);

      const aiRes = await apiService.getAIInsight(currentDepth, currentFormationLayer.name);
      setAiInsight(aiRes);

      // Trigger visual confetti burst when entering Critical Risk horizon for demo impact
      if (riskRes.riskLevel === 'CRITICAL' && currentDepth === 2870) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#f59e0b', '#00f2fe']
        });
      }
    }

    updateIntelligence();
  }, [currentDepth, currentFormationLayer]);

  // 3. Live Drilling Depth Animation Simulation Loop
  useEffect(() => {
    let interval = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setCurrentDepth(prev => {
          if (prev >= 3800) {
            setIsSimulating(false);
            return 3800;
          }
          return prev + 10;
        });
      }, 700);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleInjectDocument = (extractedData) => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, colors: ['#10b981', '#00f2fe'] });
    alert(`✅ Extracted event "${extractedData.event}" successfully injected into Field Database! Risk matrix updated.`);
    setActiveTab('dashboard');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        radiusKm={radiusKm}
        setRadiusKm={setRadiusKm}
        setShowApiInspector={setShowApiInspector}
        targetWell={TARGET_WELL}
      />

      {/* Main Dashboard Workspace Content */}
      <main style={{ flex: 1, padding: '20px', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
        
        {/* TAB 1: DASHBOARD (MAIN OPERATIONAL RISK MONITOR) */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Top Row: Map (Left) + Telemetry Controls (Right) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '20px' }}>
              <div style={{ height: '440px' }}>
                <MapView
                  targetWell={TARGET_WELL}
                  nearbyWells={nearbyWells}
                  radiusKm={radiusKm}
                  selectedWell={selectedWell}
                  setSelectedWell={setSelectedWell}
                />
              </div>

              <TelemetryPanel
                currentDepth={currentDepth}
                setCurrentDepth={setCurrentDepth}
                isSimulating={isSimulating}
                setIsSimulating={setIsSimulating}
                telemetry={{
                  ...TARGET_WELL.telemetry,
                  ecd: currentDepth >= 2600 && currentDepth <= 3300 ? 1.48 : 1.38
                }}
              />
            </div>

            {/* Bottom Row: Dynamic Risk Alert Banner + AI Insights Panel */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <RiskAlertPanel riskAnalysis={riskAnalysis} />
              <AiInsightPanel
                aiInsight={aiInsight}
                currentDepth={currentDepth}
                currentFormation={currentFormationLayer.name}
              />
            </div>

          </div>
        )}

        {/* TAB 2: INTERACTIVE MAP FULL SCREEN */}
        {activeTab === 'map' && (
          <div style={{ height: 'calc(100vh - 140px)' }}>
            <MapView
              targetWell={TARGET_WELL}
              nearbyWells={nearbyWells}
              radiusKm={radiusKm}
              selectedWell={selectedWell}
              setSelectedWell={setSelectedWell}
            />
          </div>
        )}

        {/* TAB 3: DEPTH STRATIGRAPHY CORRELATION */}
        {activeTab === 'stratigraphy' && (
          <StratigraphyCorrelation currentDepth={currentDepth} />
        )}

        {/* TAB 4: DOCUMENT PROCESSOR */}
        {activeTab === 'documents' && (
          <DocumentProcessor onInjectDocument={handleInjectDocument} />
        )}

        {/* TAB 5: SMART SEARCH */}
        {activeTab === 'search' && (
          <SmartSearch onSelectWell={(well) => { setSelectedWell(well); setActiveTab('map'); }} />
        )}

      </main>

      {/* REST API Developer Inspector Modal */}
      <ApiInspectorModal
        isOpen={showApiInspector}
        onClose={() => setShowApiInspector(false)}
      />

    </div>
  );
}
