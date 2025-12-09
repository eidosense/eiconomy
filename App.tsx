import React, { useState, useEffect, useCallback } from 'react';
import { generateTransaction, generateFlight, generateInitialMallTraffic, generateTransportMetric, generateMicroTrend } from './services/mockDataService';
import { analyzeEconomicPulse } from './services/geminiService';
import { Transaction, FlightData, MallTrafficData, TransportMetric, MicroTrend, AnalysisState } from './types';
import { StatCard, ChartContainer, MallTrafficChart, POSCategoryChart, MobilityHeatmap, IndulgenceTicker } from './components/Widgets';
import { LiveFeed, GlobalStreamView, LogisticsMonitor } from './components/LiveFeed';
import { translations, Language } from './services/translations';

// Icons
const PulseIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const UserGroupIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const CashIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const PlaneIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);
const BrainIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);
const TrafficIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const GlobeIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const TruckIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 012-2v0a2 2 0 012 2m0 0a2 2 0 012-2v0a2 2 0 012 2" />
    </svg>
);


const App: React.FC = () => {
  // --- State ---
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  // View State
  const [currentView, setCurrentView] = useState<'dashboard' | 'stream' | 'logistics'>('dashboard');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [mallTraffic, setMallTraffic] = useState<MallTrafficData[]>(generateInitialMallTraffic());
  const [transportData, setTransportData] = useState<TransportMetric[]>([]);
  const [microTrends, setMicroTrends] = useState<MicroTrend[]>([]);
  
  // Feed combines all types
  const [feedItems, setFeedItems] = useState<(Transaction | FlightData | TransportMetric | MicroTrend)[]>([]);
  
  const [analysis, setAnalysis] = useState<AnalysisState>({ loading: false, text: null, timestamp: null });
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  // --- Effects ---

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Basic Economy Data
      const newTx = generateTransaction();
      const newFlight = Math.random() > 0.8 ? generateFlight() : null;
      
      // 2. Deep Layer Data
      const newTransport = Math.random() > 0.6 ? generateTransportMetric() : null;
      const newMicroTrend = Math.random() > 0.5 ? generateMicroTrend() : null;

      // 3. Update States
      setTransactions(prev => [newTx, ...prev].slice(0, 50));
      
      const newFeedItems: any[] = [newTx];
      
      if (newFlight) {
        setFlights(prev => [newFlight, ...prev].slice(0, 20));
        newFeedItems.push(newFlight);
      }
      
      if (newTransport) {
          setTransportData(prev => [newTransport, ...prev].slice(0, 50)); 
          newFeedItems.push(newTransport);
      }

      if (newMicroTrend) {
          setMicroTrends(prev => {
              const filtered = prev.filter(p => p.item !== newMicroTrend.item);
              return [newMicroTrend, ...filtered].slice(0, 20);
          });
          newFeedItems.push(newMicroTrend);
      }

      setFeedItems(prev => [...newFeedItems, ...prev].slice(0, 200));

      // 4. Jitter Mall Traffic (MNE scale)
      setMallTraffic(prev => {
        const last = prev[prev.length - 1];
        const newVisitors = Math.max(0, last.visitors + Math.floor(Math.random() * 40 - 20));
        const newCapacity = Math.floor((newVisitors / 4000) * 100);
        const updatedLast = { ...last, visitors: newVisitors, capacityPercentage: newCapacity };
        return [...prev.slice(0, -1), updatedLast];
      });

    }, 2000); // Relaxed interval for Mediterranean pace

    return () => clearInterval(interval);
  }, []);

  // --- Handlers ---

  const handleGenerateAnalysis = useCallback(async () => {
    if (analysis.loading) return;
    
    setAnalysis(prev => ({ ...prev, loading: true }));
    setShowAnalysisModal(true);

    const result = await analyzeEconomicPulse(mallTraffic, transactions, flights, transportData, microTrends, lang);
    
    setAnalysis({
      loading: false,
      text: result,
      timestamp: Date.now()
    });
  }, [analysis.loading, mallTraffic, transactions, flights, transportData, microTrends, lang]);

  // --- Derived Metrics ---
  const totalVolume = transactions.reduce((acc, t) => acc + t.amount, 0);
  const avgTx = transactions.length > 0 ? Math.floor(totalVolume / transactions.length) : 0;
  const currentOccupancy = mallTraffic[mallTraffic.length - 1].capacityPercentage;
  
  // "Deep" Metrics calculation
  const crushLevel = transportData.filter(t => t.intensity > 80).length;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <PulseIcon />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{t.title}</h1>
            <p className="text-xs text-slate-400">{t.subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
             {/* Navigation Buttons */}
             <button
                onClick={() => setCurrentView('logistics')}
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${currentView === 'logistics' ? 'bg-orange-900/50 border-orange-500 text-orange-300' : 'border-slate-700 hover:border-slate-500 text-slate-400'}`}
             >
                <TruckIcon />
                <span className="uppercase">Logistics</span>
             </button>

             <button
                onClick={() => setCurrentView('stream')}
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${currentView === 'stream' ? 'bg-indigo-900/50 border-indigo-500 text-indigo-300' : 'border-slate-700 hover:border-slate-500 text-slate-400'}`}
             >
                <GlobeIcon />
                <span className="uppercase">Global Stream</span>
             </button>

            {/* Language Toggle */}
            <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                <button 
                    onClick={() => setLang('en')} 
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${lang === 'en' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                    EN
                </button>
                <button 
                    onClick={() => setLang('me')} 
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${lang === 'me' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                >
                    ME
                </button>
            </div>

            <div className="text-right hidden md:block">
            <div className="text-xs text-slate-500 uppercase tracking-wider">{t.signalQuality}</div>
            <div className="flex items-center gap-2 justify-end">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-sm font-medium text-indigo-400">{t.fusedSources}</span>
            </div>
          </div>
          <button 
            onClick={handleGenerateAnalysis}
            disabled={analysis.loading}
            className="flex items-center gap-2 bg-slate-100 hover:bg-white text-slate-900 px-4 py-2 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analysis.loading ? (
                <span className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></span>
            ) : (
                <BrainIcon />
            )}
            <span className="hidden sm:inline">{t.deepInsight}</span>
          </button>
        </div>
      </header>

      {/* View Router */}
      {currentView === 'stream' ? (
          <GlobalStreamView 
              items={feedItems} 
              t={t} 
              onClose={() => setCurrentView('dashboard')} 
              onAnalyze={handleGenerateAnalysis}
              isAnalyzing={analysis.loading}
          />
      ) : currentView === 'logistics' ? (
          <LogisticsMonitor 
              items={transportData} 
              t={t} 
              onClose={() => setCurrentView('dashboard')}
          />
      ) : (
          /* Main Dashboard Content Grid */
          <main className="flex-1 overflow-hidden p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left Col: Live Stats & Feed (Fixed Width on Desktop) */}
            <div className="md:col-span-3 lg:col-span-3 flex flex-col gap-6 h-full min-h-0">
               {/* Top Metrics */}
               <div className="grid grid-cols-1 gap-4 shrink-0">
                 <StatCard 
                   title={t.mallOccupancy} 
                   value={`${currentOccupancy}%`} 
                   trend={0.8} 
                   color="blue"
                   icon={<UserGroupIcon />}
                 />
                 <StatCard 
                   title={t.spendingPower} 
                   value={`€${avgTx}`} 
                   trend={-1.2} 
                   color="green"
                   icon={<CashIcon />}
                 />
                 <StatCard 
                   title={t.urbanCrush} 
                   value={crushLevel > 2 ? t.levels.critical : crushLevel > 0 ? t.levels.high : t.levels.normal} 
                   trend={crushLevel * 10} 
                   color={crushLevel > 1 ? 'rose' : 'purple'}
                   icon={<TrafficIcon />}
                 />
               </div>

               {/* Live Feed */}
               <div className="flex-1 min-h-0 bg-slate-900/50 border border-slate-800 rounded-xl p-4">
                 <LiveFeed 
                    items={feedItems.slice(0, 50)} 
                    t={t} 
                    onExpand={() => setCurrentView('stream')}
                 />
               </div>
            </div>

            {/* Center/Right Col: Visualizations */}
            <div className="md:col-span-9 lg:col-span-9 flex flex-col gap-6 h-full min-h-0 overflow-y-auto pb-20 md:pb-0">
              
              {/* Top Row Charts */}
              <div className="h-[280px] grid grid-cols-1 lg:grid-cols-2 gap-6 shrink-0">
                <ChartContainer title={t.hourlyFootfall}>
                   <MallTrafficChart data={mallTraffic} />
                </ChartContainer>
                <ChartContainer title={t.sectorDominance}>
                   <POSCategoryChart transactions={transactions} t={t} />
                </ChartContainer>
              </div>

              {/* Middle Row: New Creative Layers */}
              <div className="h-[240px] grid grid-cols-1 lg:grid-cols-2 gap-6 shrink-0">
                 <ChartContainer 
                    title={t.mobilityPressure} 
                    subtitle={t.mobilitySubtitle}
                 >
                    <MobilityHeatmap data={transportData} t={t} />
                 </ChartContainer>
                 
                 <ChartContainer 
                    title={t.lipstickIndex} 
                    subtitle={t.indulgenceSubtitle}
                 >
                    <IndulgenceTicker trends={microTrends} t={t} />
                 </ChartContainer>
              </div>

               {/* If no analysis yet, placeholder or map visualization area */}
               {!analysis.text && (
                 <div className="shrink-0 h-[100px] flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-sm">
                    {t.placeholder}
                 </div>
               )}
            </div>
          </main>
      )}

      {/* Analysis Modal Overlay */}
      {showAnalysisModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
              <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                          <BrainIcon />
                          {analysis.loading ? t.analyzing : t.analysisTitle}
                      </h2>
                      {!analysis.loading && (
                          <button onClick={() => setShowAnalysisModal(false)} className="text-slate-400 hover:text-white transition-colors">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                          </button>
                      )}
                  </div>
                  
                  <div className="p-6 overflow-y-auto bg-slate-900">
                      {analysis.loading ? (
                          <div className="flex flex-col items-center justify-center py-12 space-y-4">
                              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                              <p className="text-indigo-400 font-mono text-sm animate-pulse">{t.waiting}</p>
                          </div>
                      ) : (
                          <div className="prose prose-invert prose-indigo max-w-none">
                              <div className="bg-gradient-to-br from-indigo-900/20 to-slate-900 p-6 rounded-lg border border-indigo-500/20 mb-4 shadow-inner">
                                  <p className="whitespace-pre-wrap text-slate-200 text-lg leading-relaxed font-light">{analysis.text}</p>
                              </div>
                              <div className="flex justify-between items-center text-xs text-slate-500 mt-4 border-t border-slate-800 pt-4">
                                  <span>{t.generatedBy}</span>
                                  <span>{t.disclaimer}</span>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default App;