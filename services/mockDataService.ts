
import { Sector, Transaction, FlightData, MallTrafficData, TransportMetric, MicroTrend, Currency, DeepSignal, SignalCategory, NewsAlert, NewsCategory, MacroMetric } from '../types';

const LOCATIONS = ['Porto Montenegro', 'Delta City PG', 'Old Town Budva', 'Portonovi', 'TQ Plaza', 'Kotor Bazaar'];
const ORIGINS = ['Belgrade (BEG)', 'Istanbul (IST)', 'London (LGW)', 'Vienna (VIE)', 'Moscow (DME)', 'Dubai (DXB)', 'Berlin (BER)'];
const AIRLINES = ['Air Montenegro', 'Air Serbia', 'Turkish Airlines', 'EasyJet', 'Wizz Air', 'Ryanair'];

// Montenegro Infrastructure
const TRANSPORT_NODES = ['Sozina Tunnel', 'Kamenari Ferry', 'Debeli Brijeg Border', 'Kotor Main Gate', 'Budva Promenade'];

// Live Market Rates (Simulated)
export const EXCHANGE_RATES: Record<Exclude<Currency, 'EUR'>, number> = {
    USD: 1.08,  // 1 EUR = 1.08 USD
    GBP: 0.85,  // 1 EUR = 0.85 GBP
    RUB: 102.50,// 1 EUR = 102.5 RUB
    RSD: 117.10,// 1 EUR = 117.1 RSD
    TRY: 34.20  // 1 EUR = 34.2 TRY
};

const INDULGENCE_ITEMS = [
    { category: 'Coffee', item: 'Dojč Coffee (Espresso)', baseRate: 120 },
    { category: 'Coffee', item: 'Cappuccino Freddo', baseRate: 85 },
    { category: 'Luxury', item: 'Designer Sunglasses', baseRate: 5 },
    { category: 'Luxury', item: 'Yacht Fuel (Litres)', baseRate: 400 },
    { category: 'Dining', item: 'Black Risotto', baseRate: 45 },
    { category: 'Dining', item: 'Aperol Spritz', baseRate: 150 },
];

// Initial Summit Alerts Data
export const INITIAL_NEWS: NewsAlert[] = [
    { 
        id: 'n1', 
        headline: 'Brussels announces new Green Deal grants for Balkans', 
        source: 'EU Commission', 
        timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2h ago
        category: 'Policy' 
    },
    { 
        id: 'n2', 
        headline: 'Global lithium prices impact battery imports', 
        source: 'Global Markets', 
        timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5h ago
        category: 'Market' 
    },
    { 
        id: 'n3', 
        headline: 'Montenegro-Italy undersea cable capacity upgrade', 
        source: 'Energy Grid', 
        timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1d ago
        category: 'Infrastructure' 
    },
    {
        id: 'n4',
        headline: 'Regional Tourism Pact signed in Tirana',
        source: 'Regional Coop',
        timestamp: Date.now() - 1000 * 60 * 60 * 26,
        category: 'Policy'
    }
];

export const generateNewsAlert = (): NewsAlert => {
    const templates = [
        { headline: 'ECB Interest Rate Decision: Impact on Loans', category: 'Market', source: 'Frankfurt' },
        { headline: 'New Ferry Line approved for Bay of Kotor', category: 'Infrastructure', source: 'Local Gov' },
        { headline: 'Oil Prices surge affecting Aviation Fuel', category: 'Energy', source: 'Global Markets' },
        { headline: 'Digital Nomad Visa applications up 200%', category: 'Policy', source: 'MNE Ministry' },
        { headline: 'Direct Flights from Riyadh confirmed for Season', category: 'Market', source: 'Airports MNE' },
        { headline: 'Hydro-power output stable despite heatwave', category: 'Energy', source: 'EPCG' },
        { headline: 'Luxury Tax adjustments proposed for 2026', category: 'Policy', source: 'Parliament' }
    ];

    const pick = templates[Math.floor(Math.random() * templates.length)];

    return {
        id: `NA-${Date.now()}`,
        headline: pick.headline,
        source: pick.source,
        timestamp: Date.now(),
        category: pick.category as NewsCategory
    };
};

export const generateTransaction = (): Transaction => {
  const sectors = Object.values(Sector);
  const randomSector = sectors[Math.floor(Math.random() * sectors.length)];
  
  // 1. Determine Base Amount (EUR)
  const baseEur = randomSector === Sector.FMCG ? 15 : randomSector === Sector.RETAIL ? 120 : 350;
  const eurAmount = parseFloat((baseEur + Math.random() * baseEur).toFixed(2));

  // 2. Determine Currency (Simulate Tourists)
  // 40% chance of foreign currency
  const isForeign = Math.random() > 0.6; 
  let currency: Currency = 'EUR';
  let originalAmount = eurAmount;

  if (isForeign) {
      const currencies: Exclude<Currency, 'EUR'>[] = ['USD', 'GBP', 'RUB', 'RSD', 'TRY'];
      const picked = currencies[Math.floor(Math.random() * currencies.length)];
      currency = picked;
      const rate = EXCHANGE_RATES[picked];
      // Add slight jitter to rate to simulate live market
      const jitteredRate = rate * (1 + (Math.random() * 0.02 - 0.01));
      originalAmount = parseFloat((eurAmount * jitteredRate).toFixed(2));
  }
  
  return {
    id: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
    amount: eurAmount,
    sector: randomSector,
    location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    originalCurrency: currency,
    originalAmount: originalAmount
  };
};

export const generateFlight = (): FlightData => {
  return {
    id: `MNE-${Math.floor(100 + Math.random() * 900)}`,
    airline: AIRLINES[Math.floor(Math.random() * AIRLINES.length)],
    origin: ORIGINS[Math.floor(Math.random() * ORIGINS.length)],
    status: Math.random() > 0.8 ? 'Approaching' : 'Landed',
    passengers: Math.floor(80 + Math.random() * 140),
    timestamp: Date.now(),
  };
};

export const generateTransportMetric = (): TransportMetric => {
    const rand = Math.random();
    const type = rand > 0.7 ? 'Ferry' : rand > 0.45 ? 'Tunnel' : rand > 0.2 ? 'Border' : 'Taxi';
    
    let location = '';
    let intensity = 0;
    let details = '';
    let queueLength = undefined;
    let waitTime = undefined;

    if (type === 'Ferry') {
        location = 'Lepetane-Kamenari';
        intensity = Math.floor(30 + Math.random() * 70);
        details = intensity > 80 ? 'Long Queue' : 'Flowing';
    } else if (type === 'Tunnel') {
        location = 'Sozina Tunnel';
        intensity = Math.floor(20 + Math.random() * 80);
        details = `${Math.floor(intensity * 1.5)} cars/min`;
    } else if (type === 'Border') {
        const borders = ['Debeli Brijeg (HR)', 'Dobrakovo (SRB)', 'Božaj (AL)', 'Ilino Brdo (BiH)'];
        location = borders[Math.floor(Math.random() * borders.length)];
        intensity = Math.floor(10 + Math.random() * 90);
        
        // Logistics specific details
        const logisticsDetails = [
            'Freight Queue > 1.5km', 
            'Customs Hold', 
            'Trucks: 32/hr', 
            'Passport Control Slow', 
            'Clear', 
            'Flowing'
        ];
        
        // Calculate detailed metrics based on intensity
        queueLength = parseFloat((intensity / 20 * Math.random()).toFixed(1)); // 0 to 4.5km
        waitTime = Math.floor(intensity * 1.2); // minutes
        
        if (intensity > 75) {
            details = logisticsDetails[Math.floor(Math.random() * 2)]; // Queue or Hold
            queueLength = parseFloat((1.5 + Math.random() * 3).toFixed(1)); // Ensure high queue for high intensity
            waitTime = 60 + Math.floor(Math.random() * 120);
        } else {
             details = logisticsDetails[Math.floor(Math.random() * 4) + 2]; // Trucks, Clear etc
        }

    } else {
        location = 'Budva-Kotor Road';
        const surge = (1.0 + Math.random() * 3.0).toFixed(1);
        intensity = parseFloat(surge) * 20; 
        details = `Taxi Surge ${surge}x`;
    }

    return {
        id: `TR-${Math.random().toString(36).substring(7)}`,
        type: type as any,
        location,
        intensity,
        details,
        timestamp: Date.now(),
        queueLength,
        waitTime
    };
};

export const generateMicroTrend = (): MicroTrend => {
    const pick = INDULGENCE_ITEMS[Math.floor(Math.random() * INDULGENCE_ITEMS.length)];
    const velocity = Math.floor(pick.baseRate + Math.random() * 30); 
    
    return {
        id: `MT-${Math.random().toString(36).substring(7)}`,
        category: pick.category as any,
        item: pick.item,
        velocity: velocity,
        trend: velocity > pick.baseRate + 15 ? 'Spiking' : 'Stable',
        timestamp: Date.now()
    };
};

// Macro Generator for specific indicators requested
export const generateMacroMetric = (): MacroMetric => {
    const options = [
        { label: 'EU Export Volume', baseVal: 42.5, unit: 'M', baseDelta: 12.4, context: 'Peak' },
        { label: 'Tourism Sentiment', baseVal: 84, unit: '/100', baseDelta: 5.2, context: 'North' },
        { label: 'FDI Inflow', baseVal: 120, unit: 'M', baseDelta: -0.8, context: 'Stable' },
        { label: 'Tech Adoption', baseVal: 0, unit: 'Low', baseDelta: -2.1, context: 'Needs Growth' }
    ];

    const pick = options[Math.floor(Math.random() * options.length)];
    
    // Add jitter
    let value = '';
    let delta = '';
    
    if (pick.label === 'Tech Adoption') {
        value = pick.unit;
    } else {
        const valJitter = (Math.random() * 2 - 1).toFixed(1);
        const finalVal = (pick.baseVal + parseFloat(valJitter)).toFixed(1);
        value = (pick.label.includes('Export') || pick.label.includes('FDI')) ? `€${finalVal}${pick.unit}` : `${finalVal}${pick.unit}`;
    }

    const deltaJitter = (Math.random() * 0.5 - 0.25).toFixed(1);
    const finalDelta = (pick.baseDelta + parseFloat(deltaJitter)).toFixed(1);
    delta = `${finalDelta}%`;
    if (parseFloat(finalDelta) > 0) delta = `+${delta}`;

    return {
        id: `MAC-${Date.now()}`,
        label: pick.label,
        value: value,
        delta: delta,
        context: pick.context,
        timestamp: Date.now()
    };
};

export const generateDeepSignal = (): DeepSignal => {
    const categories: SignalCategory[] = ['MARKET', 'SOCIAL', 'REAL_ESTATE', 'DIGITAL', 'TALENT'];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    let title = '';
    let subTitle = '';
    let value = '';
    let delta = '';
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let details = '';

    const rand = Math.random();

    switch(category) {
        case 'DIGITAL':
            if (rand > 0.5) {
                title = 'Ad Auction Heatmap';
                subTitle = 'CPM Cost';
                const cpm = (2.50 + Math.random() * 3).toFixed(2);
                value = `€${cpm}`;
                delta = `▲ ${(Math.random() * 5).toFixed(1)}%`;
                sentiment = 'negative'; // Higher cost is negative for buyers
                details = 'High Bid Density';
            } else {
                title = 'Viral Velocity Alert';
                subTitle = 'Video Views/Hr';
                const views = Math.floor(15 + Math.random() * 30);
                value = `${views}.8k`;
                delta = '▲ 150%';
                sentiment = 'positive';
                details = 'Topic: "MNE Summer"';
            }
            break;
        case 'MARKET':
             if (rand > 0.5) {
                title = 'Competitor Stock';
                subTitle = 'Hospitality ETF';
                value = '-15%';
                delta = '▼';
                sentiment = 'positive'; // Competitor down is opportunity? Or Negative? Let's say high demand.
                details = 'High Demand Spike';
             } else {
                 title = 'Real-time POS Velocity';
                 subTitle = 'Budva Trans. Vol';
                 value = 'High';
                 delta = '▲ 12%';
                 sentiment = 'positive';
                 details = 'Outpacing Forecast';
             }
             break;
        case 'REAL_ESTATE':
            if (rand > 0.6) {
                title = 'Capital Flow (Whale Watch)';
                subTitle = 'Buy Orders > €500k';
                value = Math.floor(1 + Math.random() * 5).toString();
                delta = 'Active';
                sentiment = 'positive';
                details = 'Lustica Bay / Tivat';
            } else {
                title = 'Real Estate Liquidity';
                subTitle = 'New Listings (24h)';
                value = Math.floor(3 + Math.random() * 8).toString();
                delta = '+2';
                sentiment = 'neutral';
                details = 'Inventory Rising';
            }
            break;
        case 'SOCIAL':
            if (rand > 0.5) {
                title = 'Consumer Sentiment';
                subTitle = 'Social Stream';
                value = 'Positive';
                delta = '+8%';
                sentiment = 'positive';
                details = 'Shift: Optimistic';
            } else {
                title = 'Predictive Intent';
                subTitle = 'Search: "Best Hotel"';
                value = '+40%';
                delta = '▲';
                sentiment = 'positive';
                details = 'Booking Window: 7d';
            }
            break;
        case 'TALENT':
            title = 'Sector Talent Retention';
            subTitle = 'Tech Turnover';
            value = 'Stable';
            delta = '0%';
            sentiment = 'neutral';
            details = 'No churn detected';
            break;
    }
    
    // Override for Kotor Dock specific request occasionally
    if (Math.random() > 0.9) {
        return {
            id: `DS-${Date.now()}`,
            category: 'MARKET',
            title: 'Tourist Density',
            subTitle: 'Kotor Dock',
            value: `${Math.floor(1 + Math.random() * 3)} Ships`,
            delta: 'Arriving',
            sentiment: 'neutral',
            details: 'Traffic Alert',
            timestamp: Date.now()
        };
    }

    return {
        id: `DS-${Math.random().toString(36).substring(7)}`,
        category,
        title,
        subTitle,
        value,
        delta,
        sentiment,
        details,
        timestamp: Date.now()
    };
}


export const generateInitialMallTraffic = (): MallTrafficData[] => {
  const data: MallTrafficData[] = [];
  const now = new Date();
  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = time.getHours();
    let baseTraffic = 500; // Smaller scale for MNE
    if (hour > 10 && hour < 23) baseTraffic += 1500;
    if (hour === 21) baseTraffic += 1000; // Late dinner culture

    data.push({
      time: `${hour}:00`,
      visitors: Math.floor(baseTraffic + Math.random() * 300),
      capacityPercentage: Math.floor((baseTraffic / 4000) * 100),
    });
  }
  return data;
};
