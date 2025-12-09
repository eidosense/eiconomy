import { GoogleGenAI } from "@google/genai";
import { MallTrafficData, Transaction, FlightData, TransportMetric, MicroTrend } from "../types";

const getGeminiClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY is missing from environment variables.");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const analyzeEconomicPulse = async (
    mallData: MallTrafficData[],
    recentTransactions: Transaction[],
    recentFlights: FlightData[],
    transportData: TransportMetric[],
    microTrends: MicroTrend[],
    language: 'en' | 'me' = 'en'
): Promise<string> => {
    const ai = getGeminiClient();
    if (!ai) return "Error: API Key missing. Please check configuration.";

    const totalSpent = recentTransactions.reduce((acc, t) => acc + t.amount, 0).toFixed(2);
    const topSector = recentTransactions.sort((a,b) => b.amount - a.amount)[0]?.sector || 'N/A';
    const recentVisitors = mallData[mallData.length - 1].visitors;
    const touristInflow = recentFlights.reduce((acc, f) => acc + f.passengers, 0);
    
    // Process new layers
    const highTrafficZones = transportData.filter(t => t.intensity > 70).map(t => t.location).join(', ');
    const trendingItems = microTrends.filter(m => m.trend === 'Spiking').map(m => m.item).join(', ');

    let prompt = `
    You are a senior macro-economic analyst specializing in the Adriatic region and Montenegro.
    The economy is heavily dependent on Tourism, Luxury Hospitality, and Seasonal Inflow.
    
    Data Snapshot (Montenegro & Global Context):
    - Retail Footfall: ${recentVisitors} visitors/hr (Porto Montenegro / Delta City).
    - POS Volume: ${recentTransactions.length} txns, Total Volume: €${totalSpent}.
    - Dominant Spending Sector: ${topSector}.
    - Tourist Inflow: ${touristInflow} pax (Tivat/Podgorica Airports).
    - Infrastructure Bottlenecks: ${highTrafficZones || 'Flowing freely'}.
    - "Dojč Index" (Micro Trends): ${trendingItems || 'Stable baseline'}.

    Task:
    Provide a concise, 3-sentence executive summary.
    1. Analyze the "Tourist Wealth Effect": Are high-end luxury items selling, or just basic commodities?
    2. Infrastructure Check: Does the ferry/tunnel traffic correlate with retail spikes?
    3. Provide a prediction for the next 4 hours based on flight arrivals.
    
    Tone: Professional, Insightful, Focus on "High Season" dynamics vs "Off Season".
    `;

    if (language === 'me') {
        prompt += `
        IMPORTANT: OUTPUT MUST BE IN MONTENEGRIN / SERBIAN / CROATIAN (BCMS) LANGUAGE.
        Style: Professional economic news anchor (like Vijesti or Bankar.me). 
        Use terms like "Turistička sezona", "Platni promet", "Infrastrukturna uskim grla".
        `;
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: language === 'me' 
                    ? "Ti si ekonomski analitičar za Crnu Goru. Fokusiraj se na turizam i investicije." 
                    : "You are an economic analyst for Montenegro. Focus on tourism and foreign investment flows.",
                temperature: 0.4,
            }
        });

        return response.text || "Analysis complete but no text returned.";
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return language === 'me' 
            ? "Analiza nije uspjela. Molimo pokušajte ponovo."
            : "Failed to generate economic analysis. Please try again.";
    }
};