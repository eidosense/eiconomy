export enum Sector {
  RETAIL = 'Retail',
  FMCG = 'FMCG',
  TOURISM = 'Tourism',
  DINING = 'Dining'
}

export interface Transaction {
  id: string;
  timestamp: number;
  amount: number;
  sector: Sector;
  location: string;
}

export interface MallTrafficData {
  time: string;
  visitors: number;
  capacityPercentage: number;
}

export interface FlightData {
  id: string;
  airline: string;
  origin: string;
  status: 'Landed' | 'Approaching' | 'Delayed';
  passengers: number;
  timestamp: number;
}

// Montenegro Specific: Tunnels, Ferries, Border Crossings
export interface TransportMetric {
  id: string;
  type: 'Tunnel' | 'Ferry' | 'Border' | 'Taxi';
  location: string; // e.g. "Sozina Tunnel", "Kamenari Ferry"
  intensity: number; // 0-100 scale
  details: string; // "Surge 2.1x", "Queue > 2km"
  timestamp: number;
  // Logistics specific
  queueLength?: number; // km
  waitTime?: number; // minutes
}

// Micro Indulgences (Espresso Index / Seafood)
export interface MicroTrend {
  id: string;
  category: 'Coffee' | 'Luxury' | 'Dining';
  item: string; // "Dojc Coffee", "Aperol Spritz"
  velocity: number; // units per minute
  trend: 'Spiking' | 'Stable' | 'Dropping';
  timestamp: number;
}

export interface PosMetric {
  name: string;
  value: number;
  trend: number; // Percentage
}

export interface AnalysisState {
  loading: boolean;
  text: string | null;
  timestamp: number | null;
}