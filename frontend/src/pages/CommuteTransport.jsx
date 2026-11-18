import React, { useState, useEffect } from 'react';
import { aiApi } from '../services/api';
import { Navigation, Leaf, ShieldAlert, Award, ArrowRight, Gauge } from 'lucide-react';

const CommuteTransport = () => {
  const [distance, setDistance] = useState(14);
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState(null);

  const calculateCommute = async (dist) => {
    setLoading(true);
    try {
      const res = await aiApi.compareTransport(dist);
      setComparison(res);
    } catch (e) {
      console.error("Commute calculation error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateCommute(distance);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <Leaf className="w-3.5 h-3.5" />
          Sustainable Mobility & Carbon Avoidance
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Commute Exposure & CO2 Calculator
        </h1>
        <p className="text-sm text-slate-400">
          Compare personal vehicle emissions against public transit while tracking real-time smog exposure.
        </p>
      </div>

      {/* Interactive Distance Slider */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Travel Distance</span>
            <div className="text-2xl font-black text-white mt-0.5">{distance} km (One Way)</div>
          </div>
          <button
            onClick={() => calculateCommute(distance)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/20"
          >
            Recalculate Impact
          </button>
        </div>

        <input
          type="range"
          min="2"
          max="50"
          step="1"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
          <span>2 km</span>
          <span>15 km</span>
          <span>30 km</span>
          <span>50 km</span>
        </div>
      </div>

      {/* Commute Modes Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {comparison?.modes?.map((m, idx) => {
          const isTop = m.mode.includes("Metro");
          return (
            <div
              key={idx}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                isTop 
                  ? 'bg-gradient-to-b from-emerald-950/40 to-slate-900 border-emerald-500/40 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500/30'
                  : 'bg-slate-800/50 border-slate-700/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Mode {idx + 1}
                  </span>
                  {isTop && (
                    <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Award className="w-3 h-3" /> Recommended
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{m.mode}</h3>

                <div className="space-y-3 mt-4">
                  <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Carbon Emitted</span>
                    <span className="text-xl font-bold text-rose-400">{m.co2_emitted_kg} kg</span>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">CO2 Saved vs Car</span>
                    <span className="text-xl font-bold text-emerald-400">+{m.co2_saved_vs_car_kg} kg</span>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Respiratory Smog Risk</span>
                    <span className="text-xs font-semibold text-slate-200 mt-1 block">
                      {m.smog_exposure_risk}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-700/40 flex items-center justify-between text-xs">
                <span className="text-slate-400">Eco Score</span>
                <span className="text-base font-black text-white">{m.recommendation_score}/100</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-400" />
            AirWise Green Mobility Commitment
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Switching a single 14km round-trip car commute to the Delhi Metro cuts your direct PM2.5 inhalation by up to 65% and saves over 4.2 kg of greenhouse gas every day.
          </p>
        </div>
        <div className="shrink-0 bg-emerald-500 text-slate-950 font-bold px-6 py-3 rounded-2xl text-center shadow-lg shadow-emerald-500/20">
          <div className="text-2xl font-black">~126 kg</div>
          <div className="text-[11px] uppercase tracking-wider font-semibold">CO2 Saved Monthly</div>
        </div>
      </div>
    </div>
  );
};

export default CommuteTransport;

