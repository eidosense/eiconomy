import { Sector, Transaction, FlightData, MallTrafficData, TransportMetric, MicroTrend } from '../types';

const LOCATIONS = ['Porto Montenegro', 'Delta City PG', 'Old Town Budva', 'Portonovi', 'TQ Plaza', 'Kotor Bazaar'];
const ORIGINS = ['Belgrade (BEG)', 'Istanbul (IST)', 'London (LGW)', 'Vienna (VIE)', 'Moscow (DME)', 'Dubai (DXB)', 'Berlin (BER)'];
const AIRLINES = ['Air Montenegro', 'Air Serbia', 'Turkish Airlines', 'EasyJet', 'Wizz Air', 'Ryanair'];

// Montenegro Infrastructure
const TRANSPORT_NODES = ['Sozina Tunnel', 'Kamenari Ferry', 'Debeli Brijeg Border', 'Kotor Main Gate', 'Budva Promenade'];

const INDULGENCE_ITEMS = [
    { category: 'Coffee', item: 'Dojč Coffee (Espresso)', baseRate: 120 },
    { category: 'Coffee', item: 'Cappuccino Freddo', baseRate: 85 },
    { category: 'Luxury', item: 'Designer Sunglasses', baseRate: 5 },
    { category: 'Luxury', item: 'Yacht Fuel (Litres)', baseRate: 400 },
    { category: 'Dining', item: 'Black Risotto', baseRate: 45 },
    { category: 'Dining', item: 'Aperol Spritz', baseRate: 150 },
];

export const generateTransaction = (): Transaction => {
  const sectors = Object.values(Sector);
  const randomSector = sectors[Math.floor(Math.random() * sectors.length)];
  // Euro amounts
  const baseAmount = randomSector === Sector.FMCG ? 15 : randomSector === Sector.RETAIL ? 120 : 350;
  
  return {
    id: Math.random().toString(36).substring(7),
    timestamp: Date.now(),
    amount: parseFloat((baseAmount + Math.random() * baseAmount).toFixed(2)),
    sector: randomSector,
    location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
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