
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Transaction, FlightData, TransportMetric, MicroTrend, DeepSignal, SignalCategory, MacroMetric } from '../types';
import { Translation } from '../services/translations';

interface FeedProps {
  items: (Transaction | FlightData | TransportMetric | MicroTrend | MacroMetric)[];
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
const TableIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const EyeIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const ChartBarIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;

// --- Helper Functions ---
const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
};

const formatFullDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString('en-GB');
}

// --- Sidebar Feed Component ---
export const LiveFeed: React.FC<FeedProps> = ({ items, t, onExpand }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [items]);

  const renderItem = (item: Transaction | FlightData | TransportMetric | MicroTrend | MacroMetric) => {
      if ('amount' in item) {
          return (
            <div key={item.id} className="p-3 rounded bg-slate-800/30 border-l-2 border-emerald-500/50 flex justify-between items-center text-xs animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col">
                    <span className="text-emerald-200 font-semibold">{t.feed.pos}: {item.sector}</span>
                    <span className="text-slate-500">{item.location}</span>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-emerald-400 font-mono font-bold">€{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    {item.originalCurrency !== 'EUR' && (
                        <div className="text-[10px] text-slate-500">
                            ({item.originalCurrency} {item.originalAmount.toFixed(2)})
                        </div>
                    )}
                </div>
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
      } else if ('label' in item) {
         // Macro Metric
         return (
             <div key={item.id} className="p-3 rounded bg-cyan-950/20 border-l-2 border-cyan-500/50 flex justify-between items-center text-xs animate-in fade-in slide-in-from-top-2 duration-300 hover:bg-cyan-900/10 transition-colors group">
                <div className="flex flex-col">
                    <span className="text-cyan-200 font-semibold flex items-center gap-2 group-hover:text-cyan-100">
                        <ChartBarIcon />
                        {item.label}
                    </span>
                    <span className="text-slate-400">{t.feed.macro}</span>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-cyan-400 font-mono font-bold text-sm">{item.value}</div>
                    <div className={`text-[10px] font-medium flex gap-1 ${item.delta.startsWith('+') ? 'text-emerald-400' : item.delta.startsWith('-') ? 'text-rose-400' : 'text-slate-400'}`}>
                        <span>{item.delta}</span>
                        <span className="text-slate-500">• {item.context}</span>
                    </div>
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

// --- X-Ray Deep Signal View ---

interface XRayViewProps {
    signals: DeepSignal[];
    t: Translation;
    onClose: () => void;
}

// Sentiment Modal
const SentimentAnalysisModal: React.FC<{ signal: DeepSignal; onClose: () => void; t: Translation }> = ({ signal, onClose, t }) => {
    // Mock Breakdown Data (Simulated)
    const mockData = [
        { platform: 'Instagram', volume: '12.4k', growth: '+12%', sentiment: 85, color: 'text-rose-400', bar: 'bg-rose-500' },
        { platform: 'TikTok', volume: '8.1k', growth: '+45%', sentiment: 62, color: 'text-cyan-400', bar: 'bg-cyan-500' },
        { platform: 'Google Search', volume: '45.2k', growth: '+8%', sentiment: 78, color: 'text-blue-400', bar: 'bg-blue-500' },
        { platform: 'TripAdvisor', volume: '2.3k', growth: '-2%', sentiment: 91, color: 'text-emerald-400', bar: 'bg-emerald-500' },
    ];

    const keywords = ["#MontenegroSummer", "LuxuryYacht", "BudvaOldTown", "AmanResort", "KotorCats", "TivatAirport", "BeachLife"];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                 <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <div>
                         <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="text-purple-400">●</span> {t.xray.breakdown.title}
                        </h3>
                        <p className="text-xs text-slate-500">{signal.title} • {signal.details}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Signal Summary */}
                    <div className="flex gap-4 p-4 bg-purple-900/10 border border-purple-500/20 rounded-lg">
                        <div className="flex-1">
                            <div className="text-xs text-slate-400 uppercase tracking-wider">{t.xray.signal}</div>
                            <div className="text-2xl font-bold text-white">{signal.value}</div>
                        </div>
                        <div className="flex-1 text-right">
                             <div className="text-xs text-slate-400 uppercase tracking-wider">{t.xray.breakdown.score}</div>
                             <div className={`text-2xl font-bold ${signal.sentiment === 'positive' ? 'text-emerald-400' : 'text-slate-200'}`}>{signal.delta}</div>
                        </div>
                    </div>

                    {/* Breakdown Table */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{t.xray.breakdown.sources}</h4>
                        <div className="space-y-3">
                            <div className="grid grid-cols-12 text-[10px] text-slate-600 uppercase font-bold px-2">
                                <div className="col-span-4">{t.xray.breakdown.platform}</div>
                                <div className="col-span-5">{t.xray.breakdown.volume}</div>
                                <div className="col-span-3 text-right">{t.xray.breakdown.score}</div>
                            </div>
                            {mockData.map((d) => (
                                <div key={d.platform} className="bg-slate-950/50 p-3 rounded border border-slate-800/50 grid grid-cols-12 items-center">
                                    <div className={`col-span-4 text-sm font-bold ${d.color}`}>{d.platform}</div>
                                    <div className="col-span-5 pr-4">
                                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                                            <span>{d.volume}</span>
                                            <span className="text-slate-500">{d.growth}</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div className={`h-full ${d.bar}`} style={{ width: `${Math.random() * 40 + 40}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="col-span-3 text-right">
                                        <div className="text-sm font-mono font-bold text-white">{d.sentiment}/100</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Keywords Cloud */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{t.xray.breakdown.keywords}</h4>
                        <div className="flex flex-wrap gap-2">
                            {keywords.map(kw => (
                                <span key={kw} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700">
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const XRayView: React.FC<XRayViewProps> = ({ signals, t, onClose }) => {
    const [selectedSignal, setSelectedSignal] = useState<DeepSignal | null>(null);
    const recentSignals = signals.slice(0, 50);

    const getCategoryColor = (cat: SignalCategory) => {
        switch(cat) {
            case 'MARKET': return 'text-emerald-400 border-emerald-500/30';
            case 'SOCIAL': return 'text-purple-400 border-purple-500/30';
            case 'REAL_ESTATE': return 'text-amber-400 border-amber-500/30';
            case 'DIGITAL': return 'text-blue-400 border-blue-500/30';
            case 'TALENT': return 'text-rose-400 border-rose-500/30';
            default: return 'text-slate-400 border-slate-500/30';
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/95 text-slate-200 font-mono flex flex-col animate-in fade-in duration-300 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black">
             {/* Header */}
             <div className="h-20 border-b border-slate-800 bg-black/50 backdrop-blur flex items-center justify-between px-8 shrink-0">
                 <div className="flex items-center gap-6">
                     <button onClick={onClose} className="p-3 hover:bg-slate-800/50 rounded-full text-slate-400 hover:text-white transition-colors border border-transparent hover:border-slate-700">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                     </button>
                     <div>
                         <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-3">
                             <EyeIcon />
                             {t.xray.title.toUpperCase()}
                         </h1>
                         <p className="text-xs text-indigo-500/80 uppercase tracking-[0.2em]">{t.xray.subtitle}</p>
                     </div>
                 </div>
                 <div className="flex gap-4">
                     <div className="text-right">
                         <div className="text-xs text-slate-600 uppercase">System Status</div>
                         <div className="text-emerald-500 font-bold text-sm">ONLINE • MONITORING</div>
                     </div>
                 </div>
             </div>

             {/* Main Grid */}
             <div className="flex-1 overflow-y-auto p-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    
                    {/* Render specific categories first if available, or just stream */}
                    {['REAL_ESTATE', 'DIGITAL', 'SOCIAL', 'MARKET', 'TALENT'].map((cat) => {
                        const catSignals = recentSignals.filter(s => s.category === cat).slice(0, 3);
                        const label = cat === 'REAL_ESTATE' ? t.xray.realEstate : cat === 'DIGITAL' ? t.xray.digital : cat === 'SOCIAL' ? t.xray.social : cat === 'MARKET' ? t.xray.market : t.xray.talent;
                        
                        return (
                            <div key={cat} className="flex flex-col gap-4">
                                <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest border-b border-slate-800 pb-2 mb-2 flex justify-between">
                                    {label}
                                    <span className="text-[10px] opacity-50">{catSignals.length} Active</span>
                                </h3>
                                
                                {catSignals.map(signal => (
                                    <div 
                                        key={signal.id} 
                                        onClick={() => {
                                            if (signal.category === 'SOCIAL') {
                                                setSelectedSignal(signal);
                                            }
                                        }}
                                        className={`bg-slate-900/40 border border-slate-800 hover:border-slate-600 transition-colors p-4 rounded-sm relative group overflow-hidden ${signal.category === 'SOCIAL' ? 'cursor-pointer hover:bg-slate-800/60 ring-0 hover:ring-1 hover:ring-purple-500/40' : ''}`}
                                    >
                                        {/* Scanline effect */}
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 animate-pulse pointer-events-none"></div>
                                        
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="text-[10px] text-slate-500 uppercase mb-0.5">{signal.subTitle}</div>
                                                <div className="text-sm font-bold text-slate-200">{signal.title}</div>
                                            </div>
                                            <div className={`px-2 py-1 text-[10px] font-bold border rounded ${getCategoryColor(signal.category)}`}>
                                                {signal.category}
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between mt-4">
                                            <div>
                                                <div className="text-2xl font-bold text-white tracking-tighter">{signal.value}</div>
                                                <div className={`text-xs ${signal.sentiment === 'positive' ? 'text-emerald-400' : signal.sentiment === 'negative' ? 'text-rose-400' : 'text-slate-400'}`}>
                                                    {signal.delta} <span className="text-slate-600 mx-1">|</span> {signal.details}
                                                </div>
                                            </div>
                                            {/* Sparkline simulation */}
                                            <div className="flex gap-0.5 items-end h-8">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className={`w-1 rounded-t-sm ${Math.random() > 0.5 ? 'bg-indigo-500/40' : 'bg-slate-700/40'}`} style={{height: `${20 + Math.random() * 80}%`}}></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                 </div>
             </div>

             {/* Detail Modal */}
             {selectedSignal && (
                <SentimentAnalysisModal 
                    signal={selectedSignal} 
                    onClose={() => setSelectedSignal(null)} 
                    t={t} 
                />
             )}
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
        if ('label' in item) return "text-cyan-400 border-cyan-500/30 hover:bg-cyan-900/10";
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
        if ('label' in item) return <span className="flex items-center gap-2"><ChartBarIcon /> MACRO / ECON</span>;
        return "UNKNOWN";
    };

    const getValue = (item: any) => {
        if ('amount' in item) return `€${item.amount.toFixed(2)}`;
        if ('airline' in item) return `+${item.passengers} Pax`;
        if ('intensity' in item) return `${item.intensity}% Cap`;
        if ('velocity' in item) return `${item.velocity} units/m`;
        if ('label' in item) return item.value;
        return "";
    };

    const getContext = (item: any) => {
         if ('amount' in item) {
             const sector = item.sector.toUpperCase();
             if (item.originalCurrency !== 'EUR') {
                 return `${sector} (${item.originalCurrency})`;
             }
             return sector;
         }
         if ('airline' in item) return `${item.status.toUpperCase()} from ${item.origin}`;
         if ('intensity' in item) return item.details.toUpperCase();
         if ('velocity' in item) return `${item.trend.toUpperCase()} DEMAND`;
         if ('label' in item) return `${item.delta} • ${item.context.toUpperCase()}`;
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
                                    {'location' in item ? item.location : 'item' in item ? item.item : 'origin' in item ? item.origin : 'label' in item ? item.label : ''}
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

// --- Raw Data Explorer View ---

interface RawDataViewProps {
  transactions: Transaction[];
  flights: FlightData[];
  transport: TransportMetric[];
  trends: MicroTrend[];
  t: Translation;
  onClose: () => void;
}

export const RawDataView: React.FC<RawDataViewProps> = ({ transactions, flights, transport, trends, t, onClose }) => {
  const [activeTab, setActiveTab] = useState<'tx' | 'flights' | 'transport' | 'trends'>('tx');

  const tabs = [
    { id: 'tx', label: t.rawData.tabs.tx, count: transactions.length },
    { id: 'flights', label: t.rawData.tabs.flights, count: flights.length },
    { id: 'transport', label: t.rawData.tabs.transport, count: transport.length },
    { id: 'trends', label: t.rawData.tabs.trends, count: trends.length },
  ];

  const handleExport = () => {
    alert("Exporting CSV... (Simulation)");
  };

  const renderTable = () => {
    switch(activeTab) {
      case 'tx':
        return (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 sticky top-0 z-10">
              <tr className="text-xs uppercase text-slate-500 font-bold border-b border-slate-800">
                <th className="p-4">{t.rawData.cols.id}</th>
                <th className="p-4">{t.rawData.cols.time}</th>
                <th className="p-4">{t.rawData.cols.sector}</th>
                <th className="p-4">{t.rawData.cols.location}</th>
                <th className="p-4 text-right">{t.rawData.cols.amount}</th>
                <th className="p-4 text-right">{t.rawData.cols.currency}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-800/50 transition-colors text-sm font-mono text-slate-300">
                  <td className="p-4 text-slate-500">{tx.id}</td>
                  <td className="p-4">{formatFullDate(tx.timestamp)}</td>
                  <td className="p-4 text-emerald-400">{tx.sector}</td>
                  <td className="p-4">{tx.location}</td>
                  <td className="p-4 text-right font-bold text-white">€{tx.amount.toFixed(2)}</td>
                  <td className="p-4 text-right text-slate-400">{tx.originalCurrency !== 'EUR' ? `${tx.originalCurrency} ${tx.originalAmount.toFixed(2)}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'flights':
        return (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 sticky top-0 z-10">
              <tr className="text-xs uppercase text-slate-500 font-bold border-b border-slate-800">
                <th className="p-4">{t.rawData.cols.id}</th>
                <th className="p-4">{t.rawData.cols.time}</th>
                <th className="p-4">{t.rawData.cols.airline}</th>
                <th className="p-4">{t.rawData.cols.origin}</th>
                <th className="p-4">{t.rawData.cols.status}</th>
                <th className="p-4 text-right">{t.rawData.cols.pax}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {flights.map(f => (
                <tr key={f.id} className="hover:bg-slate-800/50 transition-colors text-sm font-mono text-slate-300">
                  <td className="p-4 text-slate-500">{f.id}</td>
                  <td className="p-4">{formatFullDate(f.timestamp)}</td>
                  <td className="p-4 text-blue-400">{f.airline}</td>
                  <td className="p-4">{f.origin}</td>
                  <td className="p-4">{f.status}</td>
                  <td className="p-4 text-right font-bold text-white">{f.passengers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'transport':
        return (
           <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 sticky top-0 z-10">
              <tr className="text-xs uppercase text-slate-500 font-bold border-b border-slate-800">
                <th className="p-4">{t.rawData.cols.id}</th>
                <th className="p-4">{t.rawData.cols.time}</th>
                <th className="p-4">{t.rawData.cols.type}</th>
                <th className="p-4">{t.rawData.cols.location}</th>
                <th className="p-4">{t.rawData.cols.intensity}</th>
                <th className="p-4">{t.rawData.cols.metrics}</th>
                <th className="p-4 text-right">{t.logistics.details}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {transport.map(tr => (
                <tr key={tr.id} className="hover:bg-slate-800/50 transition-colors text-sm font-mono text-slate-300">
                  <td className="p-4 text-slate-500">{tr.id}</td>
                  <td className="p-4">{formatFullDate(tr.timestamp)}</td>
                  <td className="p-4 text-amber-400">{tr.type}</td>
                  <td className="p-4">{tr.location}</td>
                  <td className="p-4">
                     <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${tr.intensity > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{width: `${tr.intensity}%`}}></div>
                     </div>
                  </td>
                  <td className="p-4 text-xs">
                     {tr.queueLength !== undefined ? `Q: ${tr.queueLength}km` : ''} 
                     {tr.waitTime !== undefined ? ` | W: ${tr.waitTime}m` : ''}
                  </td>
                  <td className="p-4 text-right font-bold text-white">{tr.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
        case 'trends':
        return (
           <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 sticky top-0 z-10">
              <tr className="text-xs uppercase text-slate-500 font-bold border-b border-slate-800">
                <th className="p-4">{t.rawData.cols.id}</th>
                <th className="p-4">{t.rawData.cols.time}</th>
                <th className="p-4">{t.rawData.cols.category}</th>
                <th className="p-4">{t.rawData.cols.item}</th>
                <th className="p-4 text-right">{t.rawData.cols.velocity}</th>
                <th className="p-4 text-right">{t.rawData.cols.trend}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {trends.map(tr => (
                <tr key={tr.id} className="hover:bg-slate-800/50 transition-colors text-sm font-mono text-slate-300">
                  <td className="p-4 text-slate-500">{tr.id}</td>
                  <td className="p-4">{formatFullDate(tr.timestamp)}</td>
                  <td className="p-4 text-purple-400">{tr.category}</td>
                  <td className="p-4">{tr.item}</td>
                  <td className="p-4 text-right font-bold text-white">{tr.velocity}/min</td>
                  <td className="p-4 text-right">{tr.trend === 'Spiking' ? <span className="text-rose-400 font-bold">SPIKE</span> : 'Stable'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
  }

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
                     <TableIcon />
                     {t.rawData.title}
                 </h1>
                 <p className="text-xs text-slate-500">{t.rawData.subtitle}</p>
             </div>
         </div>
         <button onClick={handleExport} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-bold transition-colors">
            {t.rawData.export}
         </button>
       </div>

       {/* Tabs */}
       <div className="border-b border-slate-800 bg-slate-900/50 px-6 flex gap-6">
         {tabs.map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab.id ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
           >
             {tab.label}
             <span className="bg-slate-800 px-2 py-0.5 rounded-full text-[10px] text-slate-400">{tab.count}</span>
           </button>
         ))}
       </div>

       {/* Table Area */}
       <div className="flex-1 overflow-auto bg-slate-950">
          <div className="min-w-full inline-block align-middle">
            <div className="border-b border-slate-800">
               {renderTable()}
            </div>
          </div>
       </div>
    </div>
  );
};
