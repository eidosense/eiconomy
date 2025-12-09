import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import { MallTrafficData, Transaction, Sector, TransportMetric, MicroTrend } from '../types';
import { Translation } from '../services/translations';

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

  const dataMap = transactions.reduce((acc, curr) => {
    const key = viewMode === 'sector' ? curr.sector : curr.location;
    acc[key] = (acc[key] || 0) + curr.amount;
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
      <div className="absolute top-[-3.5rem] right-0 flex bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
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
             formatter={(value: number) => [`€${value.toLocaleString()}`, 'Volume']}
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