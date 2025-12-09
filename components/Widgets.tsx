
import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import { MallTrafficData, Transaction, Sector, TransportMetric, MicroTrend, Currency, NewsAlert, NewsCategory } from '../types';
import { Translation } from '../services/translations';
import { EXCHANGE_RATES } from '../services/mockDataService';

// --- Types ---
interface StatCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon?: React.ReactNode;
  color?: string;
}

interface ChartWidgetProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
}

// --- Components ---

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon, color = "blue" }) => {
  const isPositive = trend && trend >= 0;
  
  const colorClasses: Record<string, string> = {
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    purple: "border-purple-500/30 bg-purple-500/10 text-purple-400",
    rose: "border-rose-500/30 bg-rose-500/10 text-rose-400",
  };

  const activeColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`p-4 rounded-xl border backdrop-blur-sm ${activeColor} flex flex-col justify-between h-32 transition-all hover:scale-[1.02]`}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium uppercase tracking-wider opacity-80">{title}</h3>
        {icon && <div className="p-2 rounded-full bg-white/5">{icon}</div>}
      </div>
      <div>
        <div className="text-3xl font-bold tracking-tight text-white">{value}</div>
        {trend !== undefined && (
          <div className={`text-xs mt-1 font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? '▲' : '▼'} {Math.abs(trend)}% vs last hour
          </div>
        )}
      </div>
    </div>
  );
};

export const ChartContainer: React.FC<ChartWidgetProps> = ({ title, subtitle, children }) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 h-full flex flex-col">
    <div>
        <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mb-4">{subtitle}</p>}
    </div>
    <div className="flex-1 min-h-0 w-full mt-2">
      {children}
    </div>
  </div>
);

interface MallTrafficChartProps {
  data: MallTrafficData[];
}

export const MallTrafficChart: React.FC<MallTrafficChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
        <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
          itemStyle={{ color: '#38bdf8' }}
        />
        <Line 
          type="monotone" 
          dataKey="visitors" 
          stroke="#38bdf8" 
          strokeWidth={3} 
          dot={false} 
          activeDot={{ r: 6, fill: '#38bdf8' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

interface POSCategoryChartProps {
  transactions: Transaction[];
  t: Translation;
}

export const POSCategoryChart: React.FC<POSCategoryChartProps> = ({ transactions, t }) => {
  const [viewMode, setViewMode] = useState<'sector' | 'location'>('sector');
  const [metricMode, setMetricMode] = useState<'volume' | 'count'>('volume');

  const dataMap = transactions.reduce((acc, curr) => {
    const key = viewMode === 'sector' ? curr.sector : curr.location;
    const val = metricMode === 'volume' ? curr.amount : 1;
    acc[key] = (acc[key] || 0) + val;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.keys(dataMap)
    .map(key => ({
      name: key,
      value: parseFloat(dataMap[key].toFixed(2))
    }))
    .sort((a, b) => b.value - a.value);

  const SECTOR_COLORS = {
    [Sector.RETAIL]: '#f472b6', // pink
    [Sector.FMCG]: '#34d399',   // emerald
    [Sector.TOURISM]: '#60a5fa', // blue
    [Sector.DINING]: '#fbbf24',  // amber
  };

  const LOCATION_COLORS = [
    '#818cf8', // indigo
    '#c084fc', // purple
    '#2dd4bf', // teal
    '#f87171', // red
    '#fb923c', // orange
    '#a3e635', // lime
  ];

  const getColor = (name: string, index: number) => {
      if (viewMode === 'sector') {
          return SECTOR_COLORS[name as Sector] || '#cbd5e1';
      }
      return LOCATION_COLORS[index % LOCATION_COLORS.length];
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="absolute top-[-3.5rem] right-0 flex flex-col items-end gap-1.5 z-10">
           {/* Row 1: View Mode */}
           <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50 shadow-sm">
               <button 
                 onClick={() => setViewMode('sector')}
                 className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded transition-colors ${viewMode === 'sector' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
               >
                 {t.widget.viewSector}
               </button>
               <button 
                 onClick={() => setViewMode('location')}
                 className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded transition-colors ${viewMode === 'location' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
               >
                 {t.widget.viewLocation}
               </button>
           </div>
           {/* Row 2: Metric Mode */}
           <div className="flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50 shadow-sm">
               <button 
                 onClick={() => setMetricMode('volume')}
                 className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded transition-colors ${metricMode === 'volume' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
               >
                 {t.widget.metricVolume}
               </button>
               <button 
                 onClick={() => setMetricMode('count')}
                 className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded transition-colors ${metricMode === 'count' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
               >
                 {t.widget.metricCount}
               </button>
           </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 5, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
          <XAxis type="number" stroke="#94a3b8" fontSize={12} hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            stroke="#e2e8f0" 
            fontSize={11} 
            width={viewMode === 'location' ? 110 : 60} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
             cursor={{fill: 'transparent'}}
             contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
             formatter={(value: number) => [
                 metricMode === 'volume' ? `€${value.toLocaleString()}` : value.toString(), 
                 metricMode === 'volume' ? 'Volume' : 'Tx Count'
             ]}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.name, index)} />
              ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface MobilityHeatmapProps {
    data: TransportMetric[];
    t: Translation;
}

export const MobilityHeatmap: React.FC<MobilityHeatmapProps> = ({ data, t }) => {
    // Show last 5 unique points
    const recent = data.slice(0, 5);

    return (
        <div className="flex flex-col gap-3 h-full justify-center">
            {recent.map((item) => (
                <div key={item.id} className="group">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium">{item.location}</span>
                        <span className={`${item.intensity > 80 ? 'text-rose-400' : 'text-slate-400'}`}>
                            {item.details}
                        </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                                item.intensity > 80 ? 'bg-rose-500 animate-pulse' : 
                                item.intensity > 50 ? 'bg-amber-400' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${item.intensity}%` }}
                        />
                    </div>
                </div>
            ))}
            {recent.length === 0 && <div className="text-slate-600 text-xs italic">{t.widget.waitingMobility}</div>}
        </div>
    );
};

interface IndulgenceTickerProps {
    trends: MicroTrend[];
    t: Translation;
}

export const IndulgenceTicker: React.FC<IndulgenceTickerProps> = ({ trends, t }) => {
    const spiking = trends.filter(t => t.trend === 'Spiking').slice(0, 3);
    const stable = trends.filter(t => t.trend === 'Stable').slice(0, 2);
    
    const display = [...spiking, ...stable].slice(0, 4);

    return (
        <div className="grid grid-cols-2 gap-3 h-full">
            {display.map(trend => (
                <div key={trend.id} className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${trend.trend === 'Spiking' ? 'bg-purple-400 animate-ping' : 'bg-slate-500'}`}></span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">{trend.category}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-200 truncate">{trend.item}</div>
                    <div className="text-xs text-slate-500 mt-1 flex justify-between">
                        <span>{t.widget.rate}: {trend.velocity}/m</span>
                        {trend.trend === 'Spiking' && <span className="text-purple-400 font-bold">{t.widget.hot}</span>}
                    </div>
                </div>
            ))}
             {display.length === 0 && <div className="col-span-2 text-slate-600 text-xs italic flex items-center justify-center">{t.widget.tracking}</div>}
        </div>
    );
};

interface ForexMarqueeProps {
    t: Translation;
}

export const ForexMarquee: React.FC<ForexMarqueeProps> = ({ t }) => {
    return (
        <div className="w-full bg-slate-900 border-y border-slate-800 h-8 flex items-center overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-900 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900 to-transparent z-10"></div>
            
            <div className="flex items-center gap-2 px-3 shrink-0 z-20 bg-slate-900 border-r border-slate-800 h-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider whitespace-nowrap">{t.forex}</span>
            </div>

            <div className="flex animate-marquee whitespace-nowrap items-center text-xs font-mono">
                {/* Duplicate the items to ensure seamless loop */}
                {[...Object.entries(EXCHANGE_RATES), ...Object.entries(EXCHANGE_RATES)].map(([curr, rate], idx) => (
                    <div key={`${curr}-${idx}`} className="flex items-center mx-4 gap-2">
                        <span className="text-slate-400">EUR/{curr}</span>
                        <span className="text-slate-200 font-bold">{rate.toFixed(2)}</span>
                        <span className={`text-[10px] ${Math.random() > 0.5 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {Math.random() > 0.5 ? '▲' : '▼'}
                        </span>
                    </div>
                ))}
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
            `}} />
        </div>
    );
};

interface CurrencyConverterModalProps {
    isOpen: boolean;
    onClose: () => void;
    t: Translation;
}

export const CurrencyConverterModal: React.FC<CurrencyConverterModalProps> = ({ isOpen, onClose, t }) => {
    const [amount, setAmount] = useState<string>('');
    const [currency, setCurrency] = useState<string>('USD');
    const [result, setResult] = useState<number | null>(null);

    if (!isOpen) return null;

    const handleConvert = () => {
        const val = parseFloat(amount);
        if (isNaN(val)) return;

        // Exchange rates are 1 EUR = X Foreign
        // So Foreign / Rate = EUR
        const rate = EXCHANGE_RATES[currency as Exclude<Currency, 'EUR'>];
        if (rate) {
            setResult(val / rate);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-xl shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {t.converter.title}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.converter.from}</label>
                        <select 
                            value={currency}
                            onChange={(e) => { setCurrency(e.target.value); setResult(null); }}
                            className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        >
                            {Object.keys(EXCHANGE_RATES).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.converter.amount}</label>
                        <div className="relative">
                             <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => { setAmount(e.target.value); setResult(null); }}
                                className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                placeholder="0.00"
                            />
                            <div className="absolute right-3 top-2 text-slate-500 text-xs font-bold pointer-events-none">{currency}</div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleConvert}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-colors text-sm shadow-lg shadow-indigo-900/20"
                    >
                        {t.converter.convert}
                    </button>

                    {result !== null && (
                        <div className="mt-4 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg text-center animate-in fade-in slide-in-from-bottom-2">
                             <div className="text-xs text-emerald-400 uppercase font-bold mb-1">{t.converter.result}</div>
                             <div className="text-3xl font-mono font-bold text-white">€{result.toFixed(2)}</div>
                             <div className="text-[10px] text-slate-500 mt-1">1 EUR = {EXCHANGE_RATES[currency as Exclude<Currency, 'EUR'>].toFixed(2)} {currency}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface SummitAlertsWidgetProps {
    alerts: NewsAlert[];
    t: Translation;
}

export const SummitAlertsWidget: React.FC<SummitAlertsWidgetProps> = ({ alerts, t }) => {
    // Helper to format "2h ago"
    const timeAgo = (ts: number) => {
        const diff = Date.now() - ts;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor(diff / (1000 * 60));
        if (hours >= 24) return `${Math.floor(hours / 24)}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (mins > 0) return `${mins}m ago`;
        return 'Just now';
    };

    const getCatColor = (cat: NewsCategory) => {
        switch(cat) {
            case 'Policy': return 'bg-blue-900/50 text-blue-300 border-blue-500/30';
            case 'Market': return 'bg-emerald-900/50 text-emerald-300 border-emerald-500/30';
            case 'Energy': return 'bg-amber-900/50 text-amber-300 border-amber-500/30';
            case 'Infrastructure': return 'bg-purple-900/50 text-purple-300 border-purple-500/30';
            default: return 'bg-slate-800 text-slate-400';
        }
    };

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/80">
                <div>
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        {t.summit.title}
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase">{t.summit.subtitle}</p>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {alerts.map(alert => (
                    <div key={alert.id} className="p-3 rounded bg-slate-950/40 border-l-2 border-slate-700 hover:bg-slate-800/40 transition-colors group">
                        <div className="flex justify-between items-start mb-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold uppercase ${getCatColor(alert.category)}`}>
                                {alert.category}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">{timeAgo(alert.timestamp)}</span>
                        </div>
                        <h4 className="text-sm font-medium text-slate-200 group-hover:text-white leading-snug">{alert.headline}</h4>
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 uppercase">
                             <span>• {alert.source}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
