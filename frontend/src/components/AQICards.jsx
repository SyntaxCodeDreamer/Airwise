import React from 'react';
import { AlertTriangle, ShieldCheck, HeartPulse, Activity } from 'lucide-react';

export const AQIGauge = ({ aqi, category, color, primaryPollutant, healthImpact }) => {
  // Angle for circular gauge arc: 0 to 500 maps to -180 deg to 0 deg
  const clampedAQI = Math.min(Math.max(aqi || 0, 0), 500);
  const percentage = (clampedAQI / 500) * 100;

  return (
    <div className="relative bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center shadow-xl overflow-hidden group">
      {/* Dynamic ambient background glow */}
      <div 
        className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: color || '#FF0000' }}
      />
      
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
        <Activity className="w-4 h-4 text-emerald-400" />
        Indian National AQI (CPCB)
      </div>

      <div className="relative my-4 flex flex-col items-center">
        <div 
          className="text-7xl font-extrabold tracking-tight transition-colors drop-shadow-md"
          style={{ color: color || '#FF0000' }}
        >
          {aqi || '--'}
        </div>
        <div 
          className="mt-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-inner"
          style={{ 
            backgroundColor: `${color}25`, 
            color: color || '#FF0000',
            border: `1px solid ${color}50`
          }}
        >
          {category || 'Calculating...'}
        </div>
      </div>

      <div className="w-full bg-slate-700/50 h-3 rounded-full overflow-hidden my-3 p-0.5 border border-slate-600/40">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%`, backgroundColor: color || '#E60000' }}
        />
      </div>

      <div className="w-full flex justify-between text-[11px] text-slate-400 font-medium px-1">
        <span>0 (Good)</span>
        <span>100</span>
        <span>200</span>
        <span>300</span>
        <span>400</span>
        <span>500+ (Severe)</span>
      </div>

      <div className="mt-5 w-full bg-slate-900/60 rounded-xl p-3.5 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Dominant Pollutant: </span>
          <span className="text-amber-300 font-mono font-bold mr-2">{primaryPollutant || 'PM2.5'}</span>
          <p className="mt-1 text-slate-400 leading-relaxed">{healthImpact || 'Advisory active.'}</p>
        </div>
      </div>
    </div>
  );
};

export const PollutantCard = ({ label, formula, value, unit, subIndex, color }) => {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 rounded-2xl p-4 transition-all hover:-translate-y-0.5 shadow-md">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
        <span className="font-semibold text-slate-200">{label}</span>
        <span className="font-mono text-[10px] bg-slate-700/60 px-1.5 py-0.5 rounded text-slate-300">{formula}</span>
      </div>
      <div className="flex items-baseline gap-1 my-1">
        <span className="text-2xl font-bold text-white tracking-tight">{value !== null ? value : '--'}</span>
        <span className="text-xs text-slate-400 font-normal">{unit}</span>
      </div>
      <div className="mt-2 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[11px]">
        <span className="text-slate-400">Sub-Index:</span>
        <span className="font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: color ? `${color}40` : '#475569' }}>
          {subIndex ?? '--'}
        </span>
      </div>
    </div>
  );
};

