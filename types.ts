
export enum Sector {
  RETAIL = 'Retail',
  FMCG = 'FMCG',
  TOURISM = 'Tourism',
  DINING = 'Dining'
}

export type Currency = 'EUR' | 'USD' | 'GBP' | 'RUB' | 'RSD' | 'TRY';

export interface Transaction {
  id: string;
  timestamp: number;
  amount: number; // EUR amount
  sector: Sector;
  location: string;
  originalCurrency: Currency;
  originalAmount: number;
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

// Macro Economic Indicators (EU Exports, FDI, etc)
export interface MacroMetric {
  id: string;
  label: string; // "EU Export Volume"
  value: string; // "€42.5M"
  delta: string; // "+12.4%"
  context: string; // "Peak", "North", "Stable"
  timestamp: number;
}

// X-Ray Deep Signals
export type SignalCategory = 'MARKET' | 'SOCIAL' | 'REAL_ESTATE' | 'DIGITAL' | 'TALENT';

export interface DeepSignal {
  id: string;
  category: SignalCategory;
  title: string; // e.g. "Ad Auction Heatmap"
  subTitle: string; // e.g. "CPM"
  value: string; // e.g. "€3.99"
  delta: string; // e.g. "+3.0%"
  sentiment: 'positive' | 'negative' | 'neutral';
  details: string; // e.g. "High Demand"
  timestamp: number;
}

// Summit Alerts (Geopolitics / Macro)
export type NewsCategory = 'Policy' | 'Market' | 'Infrastructure' | 'Energy';

export interface NewsAlert {
    id: string;
    headline: string;
    source: string; // e.g. "Brussels", "Global Markets"
    timestamp: number;
    category: NewsCategory;
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
