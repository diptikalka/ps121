// Synthetic Data for eRTMAC-NWIS (Nearby Wells Intelligence System)

export const TARGET_WELL = {
  id: "TARGET-VALHALL-X1",
  name: "Valhall Alpha-X1",
  operator: "Equinor / eRTMAC Ops",
  field: "Greater Valhall Basin (Block 2/8)",
  lat: 56.2814,
  lon: 3.3952,
  spudDate: "2026-08-14",
  targetDepth: 3800, // meters
  currentDepth: 2420, // meters
  status: "DRILLING ACTIVE",
  currentFormation: "Utsira Sand Formation",
  telemetry: {
    rop: 24.5, // m/hr
    mudWeight: 1.42, // S.G. (Specific Gravity) / ~11.8 ppg
    torque: 18.2, // kN.m
    spp: 2850, // psi
    flowRate: 2400, // L/min
    ecd: 1.48 // Equivalent Circulating Density
  }
};

export const FORMATION_LAYERS = [
  {
    name: "Nordland Group",
    startDepth: 0,
    endDepth: 800,
    lithology: "Unconsolidated Sandstone & Shallow Clay",
    avgPorePressure: 1.05, // S.G.
    baseRisk: "LOW",
    color: "#3b82f6"
  },
  {
    name: "Hordaland Group",
    startDepth: 800,
    endDepth: 1800,
    lithology: "Fissile Marine Shale & Siltstone",
    avgPorePressure: 1.18,
    baseRisk: "LOW",
    color: "#6366f1"
  },
  {
    name: "Utsira Sand Formation",
    startDepth: 1800,
    endDepth: 2600,
    lithology: "High Porosity Permeable Sandstone with Gas Lenses",
    avgPorePressure: 1.32,
    baseRisk: "MEDIUM",
    color: "#eab308"
  },
  {
    name: "Asgard Formation",
    startDepth: 2600,
    endDepth: 3300,
    lithology: "Naturally Fractured Glauconitic Sandstone & Limestone",
    avgPorePressure: 1.55,
    baseRisk: "CRITICAL",
    color: "#ef4444"
  },
  {
    name: "Skagerrak Formation",
    startDepth: 3300,
    endDepth: 3800,
    lithology: "Overpressured Tight Red Sandstone & Shale Interbeds",
    avgPorePressure: 1.68,
    baseRisk: "HIGH",
    color: "#a855f7"
  }
];

export const NEARBY_WELLS = [
  {
    id: "NW-402",
    name: "Mjølner West 2/8-A",
    lat: 56.2951,
    lon: 3.4128,
    distanceKm: 1.8,
    spudYear: 2021,
    td: 3650,
    status: "COMPLETED",
    highestRisk: "CRITICAL",
    incidentsCount: 3,
    incidents: [
      {
        depth: 2870,
        formation: "Asgard Formation",
        type: "Mud Loss / Lost Circulation",
        severity: "CRITICAL",
        losses: "450 bbl oil-based mud",
        cause: "Natural fracture network intersection under 1.48 SG ECD",
        mitigation: "Pumped 40 bbl heavy LCM pill (calcium carbonate + mica), reduced mud weight to 1.39 SG.",
        reportRef: "WCR-2021-NW402-SECT4"
      },
      {
        depth: 3210,
        formation: "Asgard Formation",
        type: "Differential Stuck Pipe",
        severity: "HIGH",
        durationHours: 14,
        cause: "Overbalance pressure against depleted sandstone stringer",
        mitigation: "Spotting acid wash + jarring 6 hours to free string."
      }
    ],
    wcrSummary: "Well completed in 2021. High risk zone identified at 2850m-2980m in Asgard Sandstone due to open natural fracture corridors."
  },
  {
    id: "NW-308",
    name: "Balder South 2/8-4",
    lat: 56.2625,
    lon: 3.3710,
    distanceKm: 2.6,
    spudYear: 2019,
    td: 3920,
    status: "COMPLETED",
    highestRisk: "HIGH",
    incidentsCount: 2,
    incidents: [
      {
        depth: 2550,
        formation: "Utsira Sand Formation",
        type: "Gas Kick",
        severity: "HIGH",
        pitGain: "18 bbl",
        maxSICP: "420 psi",
        cause: "Shallow gas pocket underbalance during ROP spike (45 m/hr)",
        mitigation: "Closed annular preventer, circulated out kick via driller method with 1.42 SG mud.",
        reportRef: "DDR-2019-NW308-DAY22"
      },
      {
        depth: 3400,
        formation: "Skagerrak Formation",
        type: "High Stick-Slip Torque",
        severity: "MEDIUM",
        torqueSpike: "34 kN.m",
        mitigation: "Reduced WOB from 18t to 12t, added lubricant beads."
      }
    ],
    wcrSummary: "Shallow gas kick encountered at 2550m in Utsira formation. Required weighted mud increase."
  },
  {
    id: "NW-512",
    name: "Sleipner East 2/8-9",
    lat: 56.3105,
    lon: 3.3602,
    distanceKm: 4.3,
    spudYear: 2023,
    td: 4100,
    status: "PRODUCING",
    highestRisk: "HIGH",
    incidentsCount: 2,
    incidents: [
      {
        depth: 3150,
        formation: "Asgard Formation",
        type: "Wellbore Instability / Collapse",
        severity: "HIGH",
        washout: "35% caving",
        cause: "High dipping bedding planes & under-gauge mud weight",
        mitigation: "Increased mud weight from 1.45 to 1.54 SG."
      }
    ],
    wcrSummary: "Wellbore collapse experienced in lower Asgard due to insufficient mud window."
  },
  {
    id: "NW-104",
    name: "Oseberg North 2/8-2",
    lat: 56.2401,
    lon: 3.4409,
    distanceKm: 6.8,
    spudYear: 2017,
    td: 3500,
    status: "ABANDONED",
    highestRisk: "MEDIUM",
    incidentsCount: 1,
    incidents: [
      {
        depth: 1900,
        formation: "Hordaland Group",
        type: "Seep Mud Loss",
        severity: "LOW",
        losses: "30 bbl",
        mitigation: "Slight mud viscosity adjustment."
      }
    ],
    wcrSummary: "Minor mud loss in shallow section. Straightforward drilling overall."
  },
  {
    id: "NW-709",
    name: "Gimle Deep 2/8-11",
    lat: 56.3302,
    lon: 3.4501,
    distanceKm: 8.5,
    spudYear: 2024,
    td: 4250,
    status: "COMPLETED",
    highestRisk: "LOW",
    incidentsCount: 0,
    incidents: [],
    wcrSummary: "Benchmark clean well. No major NPT (Non-Productive Time) logged."
  },
  {
    id: "NW-881",
    name: "Draupne Prospect 2/7-3",
    lat: 56.2105,
    lon: 3.3204,
    distanceKm: 12.1,
    spudYear: 2018,
    td: 3900,
    status: "PLUGGED",
    highestRisk: "CRITICAL",
    incidentsCount: 2,
    incidents: [
      {
        depth: 2900,
        formation: "Asgard Formation",
        type: "Severe Mud Loss & Pipe Sticking",
        severity: "CRITICAL",
        losses: "620 bbl total lost",
        mitigation: "Cement plug set at 2890m to isolate loss zone; sidetracked."
      }
    ],
    wcrSummary: "Severe loss zone at 2900m required sidetrack operation."
  },
  {
    id: "NW-620",
    name: "Tor Subsea 2/8-14",
    lat: 56.3512,
    lon: 3.3015,
    distanceKm: 14.5,
    spudYear: 2022,
    td: 3750,
    status: "PRODUCING",
    highestRisk: "HIGH",
    incidentsCount: 1,
    incidents: [
      {
        depth: 2840,
        formation: "Asgard Formation",
        type: "Partial Circulation Loss",
        severity: "HIGH",
        losses: "180 bbl",
        mitigation: "Mixed high concentration fiber pill."
      }
    ],
    wcrSummary: "Partial mud losses encountered upon penetrating fracture zone in Asgard."
  }
];

export const SAMPLE_DOCUMENTS = [
  {
    id: "doc-wcr-nw402",
    title: "Well Completion Report (WCR) - Mjølner West 2/8-A (NW-402)",
    type: "WCR PDF",
    spudDate: "2021-04-12",
    rawContent: `OFFSHORE DRILLING FINAL COMPLETION REPORT
WELL: Mjølner West 2/8-A (NW-402)
LOCATION: North Sea Block 2/8 (Lat 56.2951 N, Lon 3.4128 E)
OPERATOR: Equinor Energy AS / Deepsea Atlantic Rig

SUMMARY OF UNPLANNED DRILLING EVENTS:
At depth 2,870 meters MD (Asgard Formation), drill string encountered a major subseafloor natural fault zone. Mud logging unit recorded instantaneous loss of returns with pit volume drop of 450 bbls of Synthetic Oil-Based Mud (1.48 S.G. ECD).

CHRONOLOGICAL EVENT LOG:
- 04:15 hrs @ 2,868m MD: ROP spiked from 12 m/hr to 48 m/hr.
- 04:22 hrs @ 2,870m MD: Standpipe pressure dropped by 420 psi. Flow meter alarmed zero flow back.
- 04:30 hrs: Total loss confirmed. Annular space filled with seawater.
- 06:00 hrs: Pumped 40 bbl heavy LCM Pill containing coarse calcium carbonate (50 lb/bbl) and mica flakes.
- 11:30 hrs: Full circulation regained. Mud weight reduced to 1.39 S.G. to maintain narrow drilling window.

RECOMMENDATIONS FOR NEARBY TARGET WELLS:
1. Maintain ECD below 1.42 S.G. when approaching 2,800m depth horizon in Asgard formation.
2. Stage 50 bbl coarse LCM pill on pit #4 before drilling past 2,820m.
3. Utilize real-time seismic-while-drilling (SWD) to detect fault displacement.`,
    extracted: {
      wellName: "Mjølner West 2/8-A (NW-402)",
      depth: "2,870 m",
      formation: "Asgard Formation",
      event: "Total Mud Circulation Loss (450 bbl)",
      severity: "CRITICAL",
      mudWeightBefore: "1.48 S.G.",
      mudWeightRecommended: "1.39 S.G.",
      suggestedAction: "Prepare Coarse Calcium Carbonate + Mica LCM Pill prior to 2,820m MD"
    }
  },
  {
    id: "doc-ddr-nw308",
    title: "Daily Drilling Report (DDR Day 22) - Balder South 2/8-4 (NW-308)",
    type: "DDR PDF",
    spudDate: "2019-11-03",
    rawContent: `DAILY DRILLING REPORT #22
WELL: Balder South 2/8-4 (NW-308)
RIG: Transocean Spitsbergen

24 HOUR LOGGED INCIDENT REPORT:
Depth: 2,550m MD in Utsira Sand Formation.
While drilling 12-1/4 inch hole section at 45 m/hr, gas background increased from 1.2% to 18.5%. Active mud pit volume gained +18 bbl over 4 minutes. SICP rose to 420 psi.

ACTION TAKEN:
Shut in well using Upper Annular BOP. Executed Driller's Method kick circulation. Heavy mud kill weight (1.42 S.G.) circulated to surface. Gas flared safely through degasser manifold. NPT incurred: 14.5 hours.`,
    extracted: {
      wellName: "Balder South 2/8-4 (NW-308)",
      depth: "2,550 m",
      formation: "Utsira Sand Formation",
      event: "Gas Kick (18 bbl pit gain, 420 psi SICP)",
      severity: "HIGH",
      mudWeightBefore: "1.32 S.G.",
      mudWeightRecommended: "1.42 S.G.",
      suggestedAction: "Monitor gas background continuously & control ROP below 25 m/hr in Utsira Sand"
    }
  }
];
