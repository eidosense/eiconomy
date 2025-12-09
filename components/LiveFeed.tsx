import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Transaction, FlightData, TransportMetric, MicroTrend } from '../types';
import { Translation } from '../services/translations';

interface FeedProps {
  items: (Transaction | FlightData | TransportMetric | MicroTrend)[];
  t: Translation;
  onExpand?: () => void;
}

// --- Icons ---
const CashIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PlaneIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;
const TunnelIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const FerryIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const TruckIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 012-2v0a2 2 0 012 2m0 0a2 2 0 012-2v0a2 2 0 012 2" /></svg>;
const SparkIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const ExpandIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>;
const BrainIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;

// --- Helper Functions ---
const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
};

// --- Sidebar Feed Component ---
export const LiveFeed: React.FC<FeedProps> = ({ items, t, onExpand }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [items]);

  const renderItem = (item: Transaction | FlightData | TransportMetric | MicroTrend) => {
      if ('amount' in item) {
          return (
            <div key={item.id} className="p-3 rounded bg-slate-800/30 border-l-2 border-emerald-500/50 flex justify-between items-center text-xs animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col">
                    <span className="text-emerald-200 font-semibold">{t.feed.pos}: {item.sector}</span>
                    <span className="text-slate-500">{item.location}</span>
                </div>
                <div className="text-emerald-400 font-mono font-bold">€{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
          );
      } else if ('airline' in item) {
          return (
            <div key={item.id} className="p-3 rounded bg-slate-800/30 border-l-2 border-blue-500/50 flex justify-between items-center text-xs animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col">
                    <span className="text-blue-200 font-semibold">{t.feed.flight}: {item.airline}</span>
                    <span className="text-slate-500">{t.feed.from} {item.origin}</span>
                </div>
                <div className="text-blue-400 font-mono font-bold">+{item.passengers} {t.feed.pax}</div>
            </div>
          );
      } else if ('intensity' in item) {
          const isHigh = item.intensity > 80;
          const isBorder = item.type === 'Border';
          
          return (
            <div key={item.id} className={`p-3 rounded bg-slate-800/30 border-l-2 ${isHigh ? 'border-rose-500 bg-rose-900/10' : isBorder ? 'border-orange-500/50' : 'border-amber-500/50'} flex justify-between items-center text-xs animate-in fade-in slide-in-from-top-2 duration-300`}>
                 <div className="flex flex-col">
                    <span className={`${isHigh ? 'text-rose-300' : isBorder ? 'text-orange-300' : 'text-amber-200'} font-semibold flex items-center gap-2`}>
                        {isBorder ? (
                           <>
                             <TruckIcon />
                             {t.feed.logistics}
                           </>
                        ) : t.feed.mobility}
                    </span>
                    <span className="text-slate-400">{item.location}</span>
                </div>
                <div className="flex flex-col items-end">
                    <div className={`${isHigh ? 'text-rose-400 font-bold' : isBorder ? 'text-orange-400' : 'text-amber-400'} font-mono`}>{item.details}</div>
                    {item.waitTime !== undefined && item.queueLength !== undefined && (
                        <div className="text-[10px] text-slate-500 mt-1 flex gap-2">
                           <span>Q: {item.queueLength}km</span>
                           <span>W: {item.waitTime}m</span>
                        </div>
                    )}
                </div>
            </div>
          );
      } else if ('velocity' in item) {
          return (
             <div key={item.id} className="p-3 rounded bg-slate-800/30 border-l-2 border-purple-500/50 flex justify-between items-center text-xs animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col">
                    <span className="text-purple-300 font-semibold flex items-center gap-1">
                        {t.feed.trend}: {item.category.toUpperCase()}
                    </span>
                    <span className="text-slate-400">{item.item}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-purple-400 font-mono font-bold">{item.velocity}/min</span>
                    {item.trend === 'Spiking' && <span className="text-[10px] text-purple-300 bg-purple-900/50 px-1 rounded">{t.feed.spike}</span>}
                </div>
            </div>
          );
      }
      return null;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-fast"></span>
            {t.feedTitle}
        </h3>
        {onExpand && (
            <button 
                onClick={onExpand} 
                className="text-slate-600 hover:text-indigo-400 transition-colors p-1"
                title={t.feed.expand}
            >
                <ExpandIcon />
            </button>
        )}
      </div>
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 space-y-2"
      >
        {items.map(renderItem)}
        {items.length === 0 && (
           <div className="text-slate-600 text-center italic mt-10">{t.feed.waiting}</div>
        )}
      </div>
    </div>
  );
};

// --- Full Screen Logistics Monitor View ---

interface LogisticsMonitorProps {
    items: TransportMetric[]; // Filtered for Transport only
    t: Translation;
    onClose: () => void;
}

export const LogisticsMonitor: React.FC<LogisticsMonitorProps> = ({ items, t, onClose }) => {
    // Dedup by location, showing latest first
    const uniqueBorders = useMemo(() => {
        const seen = new Set();
        return items.filter(item => {
            if (item.type !== 'Border' && item.type !== 'Ferry' && item.type !== 'Tunnel') return false;
            if (seen.has(item.location)) return false;
            seen.add(item.location);
            return true;
        });
    }, [items]);

    return (
        <div className="fixed inset-0 z-40 bg-slate-950 text-slate-200 font-sans flex flex-col animate-in fade-in duration-300">
             {/* Header */}
             <div className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur flex items-center justify-between px-6 shrink-0">
                 <div className="flex items-center gap-4">
                     <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                     </button>
                     <div>
                         <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 uppercase">
                             <TruckIcon />
                             {t.logistics.title}
                         </h1>
                     </div>
                 </div>
                 <div className="flex items-center gap-2">
                     <span className="px-3 py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold animate-pulse">
                         {t.logistics.activeAlerts}: {uniqueBorders.filter(i => i.intensity > 80).length}
                     </span>
                 </div>
             </div>

             {/* Grid */}
             <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto">
                 {uniqueBorders.map(item => {
                     const isHeavy = item.intensity > 70;
                     const isCritical = item.intensity > 90;
                     const queueColor = isCritical ? 'bg-rose-500' : isHeavy ? 'bg-amber-500' : 'bg-emerald-500';
                     const textColor = isCritical ? 'text-rose-400' : isHeavy ? 'text-amber-400' : 'text-emerald-400';
                     const borderColor = isCritical ? 'border-rose-500' : isHeavy ? 'border-amber-500' : 'border-emerald-500/30';

                     return (
                         <div key={item.id} className={`bg-slate-900 border ${borderColor} rounded-xl p-5 flex flex-col gap-4 shadow-xl relative overflow-hidden group`}>
                             {/* Background Pattern */}
                             <div className={`absolute top-0 right-0 p-10 opacity-5 pointer-events-none transform translate-x-1/3 -translate-y-1/3 ${queueColor} rounded-full blur-3xl`}></div>
                             
                             <div className="flex justify-between items-start z-10">
                                 <div>
                                     <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.type}</div>
                                     <h3 className="text-lg font-bold text-white">{item.location}</h3>
                                     <div className="text-xs text-slate-400 mt-1">{formatTime(item.timestamp)}</div>
                                 </div>
                                 <div className={`p-2 rounded-lg bg-white/5 ${textColor}`}>
                                     {item.type === 'Border' ? <TruckIcon /> : item.type === 'Ferry' ? <FerryIcon /> : <TunnelIcon />}
                                 </div>
                             </div>
                             
                             {/* Metrics */}
                             <div className="grid grid-cols-2 gap-4 mt-2 z-10">
                                 <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                                     <div className="text-[10px] text-slate-500 uppercase">{t.logistics.wait}</div>
                                     <div className={`text-2xl font-mono font-bold ${textColor}`}>
                                         {item.waitTime !== undefined ? `${item.waitTime}` : '--'}<span className="text-sm ml-1 opacity-60">min</span>
                                     </div>
                                 </div>
                                 <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                                     <div className="text-[10px] text-slate-500 uppercase">{t.logistics.queue}</div>
                                     <div className="text-2xl font-mono font-bold text-white">
                                          {item.queueLength !== undefined ? `${item.queueLength}` : '--'}<span className="text-sm ml-1 opacity-60">km</span>
                                     </div>
                                 </div>
                             </div>

                             {/* Status Bar */}
                             <div className="space-y-1 z-10">
                                 <div className="flex justify-between text-xs font-medium">
                                     <span className="text-slate-400">{t.logistics.status}: <span className={textColor}>{item.details}</span></span>
                                     <span className="text-slate-600">{item.intensity}% Load</span>
                                 </div>
                                 <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                     <div 
                                         className={`h-full ${queueColor} transition-all duration-1000`} 
                                         style={{ width: `${item.intensity}%` }}
                                     ></div>
                                 </div>
                             </div>
                         </div>
                     );
                 })}
             </div>
        </div>
    );
};

// --- Full Screen Global Stream View ---

interface GlobalStreamProps extends FeedProps {
    onClose: () => void;
    onAnalyze?: () => void;
    isAnalyzing?: boolean;
}

export const GlobalStreamView: React.FC<GlobalStreamProps> = ({ items, t, onClose, onAnalyze, isAnalyzing }) => {
    const [filter, setFilter] = useState<'all' | 'pos' | 'mobility' | 'flight' | 'trend'>('all');
    const [originFilter, setOriginFilter] = useState<string>('all');

    // Get unique origins from flight items
    const availableOrigins = useMemo(() => {
        const origins = new Set<string>();
        items.forEach(item => {
            if ('origin' in item) {
                origins.add(item.origin);
            }
        });
        return Array.from(origins).sort();
    }, [items]);

    const filteredItems = items.filter(item => {
        // 1. Type Filter
        let matchesType = true;
        if (filter === 'pos') matchesType = 'amount' in item;
        else if (filter === 'mobility') matchesType = 'intensity' in item;
        else if (filter === 'flight') matchesType = 'airline' in item;
        else if (filter === 'trend') matchesType = 'velocity' in item;

        if (!matchesType) return false;

        // 2. Origin Filter
        if (originFilter !== 'all') {
            if ('origin' in item) {
                return item.origin === originFilter;
            }
            // If item doesn't have an origin property (not a flight), hide it if a specific origin is selected.
            // This assumes the user wants to see data "related to that origin", which currently is only flights.
            return false;
        }

        return true;
    });

    const getRowStyle = (item: any) => {
        if ('amount' in item) return "text-emerald-400 border-emerald-500/30 hover:bg-emerald-900/10";
        if ('airline' in item) return "text-blue-400 border-blue-500/30 hover:bg-blue-900/10";
        if ('intensity' in item) {
             if (item.type === 'Border') return "text-orange-400 border-orange-500/30 hover:bg-orange-900/10";
             return item.intensity > 80 ? "text-rose-400 border-rose-500/30 hover:bg-rose-900/10" : "text-amber-400 border-amber-500/30 hover:bg-amber-900/10";
        }
        if ('velocity' in item) return "text-purple-400 border-purple-500/30 hover:bg-purple-900/10";
        return "text-slate-400";
    };

    const getTypeLabel = (item: any) => {
        if ('amount' in item) return <span className="flex items-center gap-2"><CashIcon /> RETAIL / POS</span>;
        if ('airline' in item) return <span className="flex items-center gap-2"><PlaneIcon /> TOURISM / PAX</span>;
        if ('intensity' in item) {
            if (item.type === 'Border') return <span className="flex items-center gap-2"><TruckIcon /> LOGISTICS / BORDER</span>;
            return <span className="flex items-center gap-2">{item.type === 'Ferry' ? <FerryIcon /> : <TunnelIcon />} LOGISTICS / {item.type.toUpperCase()}</span>;
        }
        if ('velocity' in item) return <span className="flex items-center gap-2"><SparkIcon /> MICRO / {item.category.toUpperCase()}</span>;
        return "UNKNOWN";
    };

    const getValue = (item: any) => {
        if ('amount' in item) return `€${item.amount.toFixed(2)}`;
        if ('airline' in item) return `+${item.passengers} Pax`;
        if ('intensity' in item) return `${item.intensity}% Cap`;
        if ('velocity' in item) return `${item.velocity} units/m`;
        return "";
    };

    const getContext = (item: any) => {
         if ('amount' in item) return item.sector.toUpperCase();
         if ('airline' in item) return `${item.status.toUpperCase()} from ${item.origin}`;
         if ('intensity' in item) return item.details.toUpperCase();
         if ('velocity' in item) return `${item.trend.toUpperCase()} DEMAND`;
         return "";
    }

    return (
        <div className="fixed inset-0 z-40 bg-slate-950 text-slate-200 font-mono flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-4">
                     <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                     </button>
                     <div>
                         <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                             <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                             {t.stream.title}
                         </h1>
                         <p className="text-xs text-slate-500 uppercase tracking-widest">{filteredItems.length} SIGNALS PROCESSED</p>
                     </div>
                </div>

                <div className="flex items-center gap-4">
                    {onAnalyze && (
                        <button 
                            onClick={onAnalyze}
                            disabled={isAnalyzing}
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-500/50 text-indigo-300 rounded-lg text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAnalyzing ? <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div> : <BrainIcon />}
                            {t.stream.analyze}
                        </button>
                    )}

                    {/* Origin Filter Dropdown */}
                    <div className="relative">
                        <select
                            value={originFilter}
                            onChange={(e) => setOriginFilter(e.target.value)}
                            className="appearance-none bg-slate-950 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-bold rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors uppercase cursor-pointer"
                        >
                            <option value="all">{t.stream.allOrigins}</option>
                            {availableOrigins.map(origin => (
                                <option key={origin} value={origin}>{origin}</option>
                            ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {[
                            { id: 'all', label: t.stream.filterAll },
                            { id: 'pos', label: t.stream.filterRetail },
                            { id: 'mobility', label: t.stream.filterMobility },
                            { id: 'flight', label: t.stream.filterTourism },
                            { id: 'trend', label: t.stream.filterTrends },
                        ].map(f => (
                            <button
                                key={f.id}
                                onClick={() => setFilter(f.id as any)}
                                className={`px-3 py-1.5 text-xs font-bold border rounded transition-all ${
                                    filter === f.id 
                                    ? 'bg-slate-100 text-slate-900 border-white' 
                                    : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Terminal Table */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-950">
                <div className="w-full min-w-[1000px]">
                    <div className="grid grid-cols-12 gap-4 text-xs font-bold text-slate-600 mb-2 px-4 uppercase tracking-wider">
                        <div className="col-span-1">{t.stream.colTime}</div>
                        <div className="col-span-3">{t.stream.colType}</div>
                        <div className="col-span-3">{t.stream.colSource}</div>
                        <div className="col-span-2 text-right">{t.stream.colValue}</div>
                        <div className="col-span-3 pl-4">{t.stream.colContext}</div>
                    </div>
                    
                    <div className="space-y-1">
                        {filteredItems.map((item) => (
                            <div 
                                key={item.id} 
                                className={`grid grid-cols-12 gap-4 items-center px-4 py-3 border-l-4 bg-slate-900/30 rounded-r transition-all ${getRowStyle(item)}`}
                            >
                                <div className="col-span-1 text-slate-500 font-medium">{formatTime(item.timestamp)}</div>
                                <div className="col-span-3 font-bold tracking-tight">{getTypeLabel(item)}</div>
                                <div className="col-span-3 text-slate-300 truncate">
                                    {'location' in item ? item.location : 'item' in item ? item.item : 'origin' in item ? item.origin : ''}
                                </div>
                                <div className="col-span-2 text-right font-mono text-lg leading-none">{getValue(item)}</div>
                                <div className="col-span-3 pl-4 text-xs font-medium opacity-80 flex items-center gap-2">
                                    {getContext(item)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};