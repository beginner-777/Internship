import { create } from 'zustand';

export const WORKLOAD_MODES = {
  IDLE: 'idle',
  TRAINING: 'training',
  INFERENCE: 'inference',
  FINE_TUNING: 'fine-tuning',
  MAINTENANCE: 'maintenance',
  EMERGENCY: 'emergency',
};

// Per-mode profile driving lighting, heat, particle speed, power, etc.
export const MODE_PROFILES = {
  [WORKLOAD_MODES.IDLE]: {
    label: 'Idle',
    heat: 0.25,
    power: 0.2,
    packetSpeed: 0.3,
    packetDensity: 0.2,
    ledColor: '#4df1ff',
    ambientIntensity: 0.35,
    coolingSpeed: 0.3,
  },
  [WORKLOAD_MODES.TRAINING]: {
    label: 'Training',
    heat: 0.85,
    power: 0.95,
    packetSpeed: 1.4,
    packetDensity: 1,
    ledColor: '#ff9d2f',
    ambientIntensity: 0.55,
    coolingSpeed: 1.2,
  },
  [WORKLOAD_MODES.INFERENCE]: {
    label: 'Inference',
    heat: 0.5,
    power: 0.6,
    packetSpeed: 1,
    packetDensity: 0.7,
    ledColor: '#00e5ff',
    ambientIntensity: 0.45,
    coolingSpeed: 0.8,
  },
  [WORKLOAD_MODES.FINE_TUNING]: {
    label: 'Fine-Tuning',
    heat: 0.65,
    power: 0.75,
    packetSpeed: 1.1,
    packetDensity: 0.85,
    ledColor: '#a78bfa',
    ambientIntensity: 0.5,
    coolingSpeed: 1,
  },
  [WORKLOAD_MODES.MAINTENANCE]: {
    label: 'Maintenance',
    heat: 0.15,
    power: 0.1,
    packetSpeed: 0.1,
    packetDensity: 0.1,
    ledColor: '#ffd23f',
    ambientIntensity: 0.3,
    coolingSpeed: 0.2,
  },
  [WORKLOAD_MODES.EMERGENCY]: {
    label: 'Emergency',
    heat: 1,
    power: 1,
    packetSpeed: 1.8,
    packetDensity: 1,
    ledColor: '#ff4d5e',
    ambientIntensity: 0.65,
    coolingSpeed: 1.5,
  },
};

const getInitialQuality = () => {
  if (typeof window === 'undefined') return 'high';

  const mobileOrTouchDevice = window.matchMedia(
    '(max-width: 767px), (pointer: coarse)'
  ).matches;

  return mobileOrTouchDevice ? 'low' : 'high';
};

export const useStore = create((set, get) => ({
  // App flow
  appPhase: 'landing', // 'landing' | 'boot' | 'scene'
  setAppPhase: (phase) => set({ appPhase: phase }),

  // Scene toggles
  workloadMode: WORKLOAD_MODES.IDLE,
  setWorkloadMode: (mode) => set({ workloadMode: mode }),

  heatmapEnabled: false,
  toggleHeatmap: () => set((s) => ({ heatmapEnabled: !s.heatmapEnabled })),

  coolingOn: true,
  toggleCooling: () => set((s) => ({ coolingOn: !s.coolingOn })),

  dayNight: 'night', // 'day' | 'night'
  toggleDayNight: () => set((s) => ({ dayNight: s.dayNight === 'night' ? 'day' : 'night' })),

  networkVizEnabled: true,
  toggleNetworkViz: () => set((s) => ({ networkVizEnabled: !s.networkVizEnabled })),

  autoRotate: false,
  toggleAutoRotate: () => set((s) => ({ autoRotate: !s.autoRotate })),

  quality: getInitialQuality(), // 'low' | 'medium' | 'high'
  setQuality: (q) => set({ quality: q }),

  muted: true,
  toggleMuted: () => set((s) => ({ muted: !s.muted })),

  // Selection / dashboard
  selectedObject: null, // { type: 'rack'|'core', id, data }
  setSelectedObject: (obj) => set({ selectedObject: obj }),
  clearSelection: () => set({ selectedObject: null }),

  // Camera director requests consumed by CameraRig
  cameraTarget: null, // { position: [x,y,z], lookAt: [x,y,z], key }
  requestCameraMove: (target) => set({ cameraTarget: { ...target, key: Date.now() } }),

  // Assistant hologram
  assistantMessage: null,
  setAssistantMessage: (msg) => set({ assistantMessage: msg }),

  resetScene: () =>
    set({
      workloadMode: WORKLOAD_MODES.IDLE,
      heatmapEnabled: false,
      coolingOn: true,
      dayNight: 'night',
      networkVizEnabled: true,
      autoRotate: false,
      selectedObject: null,
      assistantMessage: null,
    }),
}));
