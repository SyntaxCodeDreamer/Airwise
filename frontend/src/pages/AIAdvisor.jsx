import React, { useState, useEffect } from 'react';
import { aiApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Brain, Clock, ShieldCheck, Home, AlertCircle, Languages, Sparkles, ChevronDown } from 'lucide-react';

const AIAdvisor = () => {
  const { user } = useAuth();
  const [language, setLanguage] = useState(user?.preferredLanguage || "en");
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [routine, setRoutine] = useState(null);

  const fetchAIInsights = async (lang) => {
    setLoading(true);
    try {
      const familyProfileSafe = {
        has_elderly: user?.familyProfile?.hasElderly ?? true,
        has_infants: user?.familyProfile?.hasInfants ?? false,
        has_asthma_respiratory: user?.familyProfile?.hasAsthmaRespiratory ?? true,
        has_indoor_air_purifier: user?.familyProfile?.hasIndoorAirPurifier ?? false
      };

      const [expRes, routineRes] = await Promise.all([
        aiApi.explainAQI({
          aqi: 382,
          category: "Very Poor",
          primary_pollutant: "PM2.5",
          language: lang,
          family_profile: familyProfileSafe
        }),
        aiApi.getRoutine({
          city: user?.city || "New Delhi",
          aqi: 382,
          language: lang
        })
      ]);
      setExplanation(expRes);
      setRoutine(routineRes);
    } catch (e) {
      console.error("AI Insight Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIInsights(language);
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    fetchAIInsights(lang);
  };

  const languageOptions = [
    { id: "en", label: "English" },
    { id: "hi", label: "हिंदी (Hindi)" },
    { id: "bn", label: "বাংলা (Bengali)" },
    { id: "mr", label: "मराठी (Marathi)" },
    { id: "ta", label: "தமிழ் (Tamil)" },
    { id: "te", label: "తెలుగు (Telugu)" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header and Language Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Google Gemini Multilingual Assistant
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Personalized Environmental Guidance
          </h1>
          <p className="text-sm text-slate-400">
            AI health advisories contextualized to your family's respiratory risk factors in {user?.city || 'New Delhi'}.
          </p>
        </div>

        {/* Clean Language Selector Dropdown Menu */}
        <div className="relative inline-flex items-center bg-slate-800/90 border border-slate-700/80 rounded-2xl px-3 py-1.5 shadow-lg group">
          <Languages className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-transparent text-white text-xs md:text-sm font-semibold pr-8 py-1.5 focus:outline-none cursor-pointer appearance-none"
          >
            {languageOptions.map(l => (
              <option key={l.id} value={l.id} className="bg-slate-900 text-slate-100 py-1">
                {l.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none group-hover:text-emerald-400 transition-colors" />
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Brain className="w-8 h-8 text-emerald-400 animate-bounce" />
          <p className="text-sm">Synthesizing personalized environmental advisory with Gemini AI...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Health Guidance */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Current Threat Assessment</h2>
                  <span className="text-xs font-semibold text-rose-400">
                    Risk Assessment: {explanation?.health_risk_level || 'High'}
                  </span>
                </div>
              </div>

              <p className="text-sm md:text-base text-slate-200 leading-relaxed font-normal bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
                {explanation?.simple_summary || 'Analyzing ambient smog data...'}
              </p>

              <div className="mt-6 space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Recommended Immediate Protocol
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {explanation?.immediate_actions?.map((act, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-slate-800/40 border border-slate-700/40 p-3 rounded-xl text-xs md:text-sm text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vulnerable Family Guidance */}
              <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs md:text-sm text-amber-200">
                <span className="font-bold block mb-1">👨‍👩‍👧 Family Vulnerability Notice:</span>
                {explanation?.vulnerable_guidance || 'High alert for sensitive family members.'}
              </div>
            </div>

            {/* Indoor Air Quality Tips */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 shadow-xl">
              <h2 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <Home className="w-5 h-5 text-emerald-400" />
                Indoor Air Quality (IAQ) Enhancements
              </h2>
              <ul className="space-y-2 text-xs md:text-sm text-slate-300">
                {explanation?.indoor_tips?.map((tip, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: AI Low-Emission Daily Routine Planner */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Low-Exposure Daily Routine</h2>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                Optimized scheduling to avoid daily thermal inversion peaks in {user?.city || 'New Delhi'}.
              </p>

              <div className="space-y-4">
                {routine?.optimal_routine?.map((slot, idx) => (
                  <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
                      <span>{slot.time_slot}</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                        {slot.smog_profile}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2">
                      {slot.recommendation}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                <span className="font-bold block mb-1">🌱 Citizen Action & CO2 Saving:</span>
                {routine?.co2_reduction_tip}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAdvisor;
