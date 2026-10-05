import { TARGET_WELL, NEARBY_WELLS, FORMATION_LAYERS, SAMPLE_DOCUMENTS } from '../data/mockData';

// Simulated latency helper for realistic API behavior
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Calculate distance between two lat/lon points using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

export const apiService = {
  // 1. GET /wells -> list all wells with coordinates
  async getWells() {
    await delay(150);
    return {
      status: 200,
      targetWell: TARGET_WELL,
      nearbyWells: NEARBY_WELLS
    };
  },

  // 2. GET /nearby-wells?lat=&lon=&radius=
  async getNearbyWells(lat = TARGET_WELL.lat, lon = TARGET_WELL.lon, radiusKm = 10) {
    await delay(200);
    const filtered = NEARBY_WELLS.filter(well => {
      const dist = calculateDistance(lat, lon, well.lat, well.lon);
      return dist <= radiusKm;
    }).map(well => ({
      ...well,
      distanceKm: calculateDistance(lat, lon, well.lat, well.lon)
    }));

    return {
      status: 200,
      center: { lat, lon },
      radiusKm,
      count: filtered.length,
      wells: filtered.sort((a, b) => a.distanceKm - b.distanceKm)
    };
  },

  // 3. POST /upload-report -> simulate extraction of depth, formation, events
  async uploadReport(documentData) {
    await delay(1200); // simulate extraction processing

    let extracted;
    if (typeof documentData === 'string') {
      // NLP/Regex parsing simulation
      const text = documentData;
      const depthMatch = text.match(/(\d+[,.]?\d*)\s*(m|meters|ft)/i);
      const formationMatch = text.match(/(Asgard|Utsira|Hordaland|Skagerrak|Nordland)\s*(Formation|Group)?/i);
      const eventMatch = text.match(/(Mud Loss|Gas Kick|Stuck Pipe|Collapse|Loss|Circulation|Kick)/i);

      extracted = {
        wellName: text.match(/WELL:?\s*([^\n\r]+)/i)?.[1] || "Uploaded Document Well",
        depth: depthMatch ? `${depthMatch[1]} m` : "2,870 m",
        formation: formationMatch ? formationMatch[0] : "Asgard Formation",
        event: eventMatch ? eventMatch[0] : "Total Mud Circulation Loss",
        severity: text.includes("CRITICAL") || text.includes("450 bbl") ? "CRITICAL" : "HIGH",
        mudWeightRecommended: "1.39 S.G.",
        confidenceScore: 0.96
      };
    } else if (documentData.extracted) {
      extracted = {
        ...documentData.extracted,
        confidenceScore: 0.98
      };
    } else {
      extracted = SAMPLE_DOCUMENTS[0].extracted;
    }

    return {
      status: 200,
      timestamp: new Date().toISOString(),
      extractionEngine: "eRTMAC-NLP-v2.4 (Regex + LLM Structurer)",
      extracted
    };
  },

  // 4. POST /risk-analysis -> input: depth + formation
  async analyzeRisk(depth = TARGET_WELL.currentDepth, formation = TARGET_WELL.currentFormation, telemetry = TARGET_WELL.telemetry) {
    await delay(180);

    // Identify current formation layer
    const layer = FORMATION_LAYERS.find(f => depth >= f.startDepth && depth < f.endDepth) || FORMATION_LAYERS[FORMATION_LAYERS.length - 1];

    // Find nearby wells with incidents at a similar depth (± 150m) and formation
    const matchingIncidents = [];
    NEARBY_WELLS.forEach(well => {
      well.incidents.forEach(inc => {
        const depthDiff = Math.abs(inc.depth - depth);
        const sameFormation = inc.formation.toLowerCase().includes(formation.toLowerCase()) || formation.toLowerCase().includes(inc.formation.toLowerCase());
        
        if (depthDiff <= 200 || (sameFormation && depthDiff <= 350)) {
          matchingIncidents.push({
            wellId: well.id,
            wellName: well.name,
            distanceKm: well.distanceKm,
            incidentDepth: inc.depth,
            depthDelta: depthDiff,
            incidentType: inc.type,
            severity: inc.severity,
            cause: inc.cause,
            mitigation: inc.mitigation
          });
        }
      });
    });

    // Rule-based logic calculation
    let riskLevel = layer.baseRisk;
    let riskScore = 20;
    let reasons = [];

    if (matchingIncidents.length > 0) {
      const hasCritical = matchingIncidents.some(i => i.severity === "CRITICAL");
      const hasHigh = matchingIncidents.some(i => i.severity === "HIGH");

      if (hasCritical || matchingIncidents.length >= 3) {
        riskLevel = "CRITICAL";
        riskScore = 94;
        reasons.push(`CRITICAL: 2 nearby wells (NW-402 at 1.8km & NW-881 at 12.1km) suffered severe Mud Losses (>450 bbls) at depth ${depth}m (Asgard Formation).`);
      } else if (hasHigh || matchingIncidents.length >= 1) {
        riskLevel = "HIGH";
        riskScore = 78;
        reasons.push(`HIGH: Nearby well ${matchingIncidents[0].wellName} experienced ${matchingIncidents[0].incidentType} at depth ${matchingIncidents[0].incidentDepth}m.`);
      } else {
        riskLevel = "MEDIUM";
        riskScore = 52;
        reasons.push(`MEDIUM: Historical minor drilling anomalies logged within ±200m depth horizon in ${formation}.`);
      }
    } else {
      if (layer.baseRisk === "CRITICAL") riskScore = 85;
      else if (layer.baseRisk === "HIGH") riskScore = 70;
      else if (layer.baseRisk === "MEDIUM") riskScore = 45;
      else riskScore = 15;
      
      reasons.push(`Formation Base Risk: ${layer.name} (${layer.lithology}) has baseline risk rating [${layer.baseRisk}].`);
    }

    // Telemetry modifier
    if (telemetry && telemetry.ecd > 1.45 && formation.includes("Asgard")) {
      riskScore = Math.min(99, riskScore + 10);
      reasons.push(`Telemetry Warning: Current ECD (${telemetry.ecd} SG) exceeds recommended formation pressure limit (1.42 SG).`);
    }

    return {
      status: 200,
      depth,
      formation: layer.name,
      riskLevel,
      riskScore,
      reasons,
      matchingIncidents,
      recommendedActions: riskLevel === "CRITICAL" || riskLevel === "HIGH" ? [
        "Reduce mud weight / ECD to max 1.39 S.G.",
        "Stage 50 bbl coarse calcium carbonate LCM pill in active pit",
        "Control ROP below 15 m/hr to avoid surge pressure",
        "Monitor flow rate & pit volume return delta in real-time"
      ] : [
        "Continue normal drilling operations with standard parameter monitoring",
        "Verify shaker screen mesh size for formation cuttings"
      ]
    };
  },

  // 5. GET /ai-insight -> returns explanation text & RAG context
  async getAIInsight(depth = TARGET_WELL.currentDepth, formation = TARGET_WELL.currentFormation) {
    await delay(250);

    const riskData = await this.analyzeRisk(depth, formation, TARGET_WELL.telemetry);

    let explanationText = "";
    if (depth >= 2600 && depth <= 3300) {
      explanationText = `🤖 AI Operational Intelligence Analysis (Asgard Sandstone Zone):\nTarget Well Valhall Alpha-X1 is currently drilling at ${depth}m in the ${formation}. Spatial correlation with 7 offset wells indicates high vulnerability to total fluid loss.\n\nKey Offset Evidence:\n- Well NW-402 (Mjølner West, 1.8km NE) experienced a total 450 bbl oil-based mud loss at 2,870m when penetrating natural fracture corridors with ECD at 1.48 S.G.\n- Well NW-881 (Draupne Prospect, 12.1km S) suffered 620 bbl total circulation loss at 2,900m requiring a cement plug sidetrack.\n\nAI Decision Vector:\nGeological strike vector predicts active natural fractures crossing Alpha-X1 between 2,850m and 2,980m depth. Current telemetry (ECD 1.48 S.G.) is operating at the upper limit of the fracture gradient. Immediate drop in mud weight to 1.39 S.G. is strongly advised prior to entering 2,850m MD.`;
    } else if (depth >= 1800 && depth < 2600) {
      explanationText = `🤖 AI Operational Intelligence Analysis (Utsira Sand Zone):\nDrilling at ${depth}m in ${formation}.\n\nKey Offset Evidence:\n- Well NW-308 (Balder South, 2.6km SW) recorded an 18 bbl gas kick at 2,550m MD due to localized high-permeability shallow gas lenses.\n\nAI Decision Vector:\nMaintain ROP below 25 m/hr to prevent gas swab. Monitor gas background percentage and keep trip tank filled during connections.`;
    } else {
      explanationText = `🤖 AI Operational Intelligence Analysis:\nDrilling at ${depth}m in ${formation}. Offset well data shows low incident density in upper formations. Standard operational guidelines apply.`;
    }

    const ragRetrievedChunks = [
      {
        source: "WCR-2021-NW402 (Mjølner West 2/8-A)",
        similarityScore: 0.94,
        snippet: "Encountered major natural fault zone at 2,870m MD. Instantaneous pit loss of 450 bbls Synthetic OBM under 1.48 SG ECD. Solved by pumping 40 bbl heavy LCM pill & reducing mud weight to 1.39 SG."
      },
      {
        source: "DDR-2019-NW308 (Balder South 2/8-4)",
        similarityScore: 0.88,
        snippet: "Gas kick (+18 bbl pit gain) at 2,550m in Utsira Sand during 45 m/hr ROP spike. SICP 420 psi. Circulated out with 1.42 SG mud."
      },
      {
        source: "Geological Volve-Valhall Survey 2024",
        similarityScore: 0.82,
        snippet: "Asgard Formation exhibits NW-SE trending natural fracture network. Fracture opening pressure is lower than hydrostatic column when ECD > 1.44 SG."
      }
    ];

    return {
      status: 200,
      timestamp: new Date().toISOString(),
      model: "eRTMAC-RAG-LLM-v4.2 (Geothermal & Drilling Domain Model)",
      riskData,
      explanationText,
      ragRetrievedChunks
    };
  },

  // 6. GET /search?q=
  async searchDatabase(query = "") {
    await delay(150);
    const q = query.toLowerCase().trim();

    if (!q) {
      return { status: 200, resultsCount: NEARBY_WELLS.length, wells: NEARBY_WELLS };
    }

    const results = NEARBY_WELLS.filter(well => {
      const matchName = well.name.toLowerCase().includes(q) || well.id.toLowerCase().includes(q);
      const matchWcr = well.wcrSummary.toLowerCase().includes(q);
      const matchIncidents = well.incidents.some(inc => 
        inc.type.toLowerCase().includes(q) || 
        inc.formation.toLowerCase().includes(q) ||
        inc.cause?.toLowerCase().includes(q) ||
        inc.mitigation?.toLowerCase().includes(q)
      );
      return matchName || matchWcr || matchIncidents;
    });

    return {
      status: 200,
      query: q,
      resultsCount: results.length,
      wells: results
    };
  }
};
