import React, { useState, useEffect } from 'react';
import { aqiApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AQIGauge, PollutantCard } from '../components/AQICards';
import LocationPickerModal from '../components/LocationPickerModal';
import LoginModal from '../components/LoginModal';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { MapPin, RefreshCw, Calendar, ShieldCheck, Search, Info, Map, Lock, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  
  // Active coordinates & label
  const [currentLocation, setCurrentLocation] = useState({
    name: "New Delhi - Anand Vihar CPCB",
    lat: 28.6508,
    lon: 77.3152
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const loadData = async (lat, lon) => {
    setLoading(true);
    try {
      const aqiRes = await aqiApi.getCurrentAQI(lat, lon);
      setData(aqiRes);
    } catch (e) {
      console.error("AQI fetch failed:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentLocation.lat, currentLocation.lon);
  }, [currentLocation.lat, currentLocation.lon]);

  const handleSelectLocation = (loc) => {
    setCurrentLocation(loc);
  };

  const aqiInfo = data?.aqi_data || {};
  const pollutants = aqiInfo.sub_indices || {};
  const forecast = data?.hourly_forecast || [];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Sign-in Gate Notice if User is Not Logged In */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Sign in to save custom locations & unlock AI Family Alerts
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-xs text-slate-400">
                Sign in or use 1-Click quick sign in to personalize your home coordinates and health vulnerabilities.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap"
          >
            Sign In / Register
          </button>
        </div>
      )}

      {/* Top Header & Location Chooser */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live National Monitoring Feed
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Indian National Air Quality Index
          </h1>
          <p className="text-sm text-slate-400">
            CPCB NAQI multi-pollutant real-time metrics, station data & 24-hour predictive forecast.
          </p>
        </div>

        {/* Dynamic Location Selector Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center gap-2.5 bg-slate-800/80 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold transition-all hover:border-emerald-500/50 shadow-md group"
          >
            <MapPin className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block font-normal leading-none mb-0.5">Active Location</span>
              <span className="max-w-[200px] truncate block text-xs md:text-sm font-bold">
                {currentLocation.name}
              </span>
            </div>
            <Map className="w-4 h-4 text-slate-500 ml-1" />
          </button>

          <button 
            onClick={() => loadData(currentLocation.lat, currentLocation.lon)}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
            title="Refresh AQI Feed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Live Gauge + Pollutant Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <AQIGauge 
            aqi={aqiInfo.aqi}
            category={aqiInfo.category}
            color={aqiInfo.color}
            primaryPollutant={aqiInfo.primary_pollutant}
            healthImpact={aqiInfo.health_impact}
          />
        </div>

        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Criteria Pollutant Sub-Indices
              </h3>
              <span className="text-xs text-slate-400 bg-slate-700/40 px-2.5 py-1 rounded-full">
                Source: {data?.source || 'CPCB / Open-Meteo'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <PollutantCard 
                label="PM 2.5 Fine Particles"
                formula="PM2.5"
                value={pollutants.pm25?.concentration}
                unit="µg/m³"
                subIndex={pollutants.pm25?.sub_index}
                color={aqiInfo.color}
              />
              <PollutantCard 
                label="PM 10 Coarse Dust"
                formula="PM10"
                value={pollutants.pm10?.concentration}
                unit="µg/m³"
                subIndex={pollutants.pm10?.sub_index}
                color={aqiInfo.color}
              />
              <PollutantCard 
                label="Nitrogen Dioxide"
                formula="NO2"
                value={pollutants.no2?.concentration}
                unit="µg/m³"
                subIndex={pollutants.no2?.sub_index}
                color={aqiInfo.color}
              />
              <PollutantCard 
                label="Sulphur Dioxide"
                formula="SO2"
                value={pollutants.so2?.concentration}
                unit="µg/m³"
                subIndex={pollutants.so2?.sub_index}
                color={aqiInfo.color}
              />
              <PollutantCard 
                label="Carbon Monoxide"
                formula="CO"
                value={pollutants.co?.concentration}
                unit="mg/m³"
                subIndex={pollutants.co?.sub_index}
                color={aqiInfo.color}
              />
              <PollutantCard 
                label="Ground Ozone"
                formula="O3"
                value={pollutants.o3?.concentration}
                unit="µg/m³"
                subIndex={pollutants.o3?.sub_index}
                color={aqiInfo.color}
              />
            </div>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Calculation strictly follows Central Pollution Control Board (CPCB) sub-index linear interpolation norms.
              </span>
            </div>
            <span className="font-mono bg-emerald-500/20 px-2 py-0.5 rounded text-[11px] text-emerald-200">
              {data?.freshness_status || 'LIVE'}
            </span>
          </div>
        </div>
      </div>

      {/* Hourly Trend Forecast Chart */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              24-Hour Projected AQI & Smog Trend
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Hourly dispersion forecasting based on meteorological atmospheric inversion models.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              Projected AQI
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              PM2.5 (µg/m³)
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast}>
              <defs>
                <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="pmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="time" 
                stroke="#64748b" 
                fontSize={11}
                tickFormatter={(val) => {
                  if (typeof val === 'string' && val.includes('T')) {
                    return val.split('T')[1]?.slice(0, 5) || val;
                  }
                  return val;
                }}
              />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="aqi" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#aqiGrad)" name="NAQI" />
              <Area type="monotone" dataKey="pm25" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#pmGrad)" name="PM2.5 (µg/m³)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={handleSelectLocation}
        currentLat={currentLocation.lat}
        currentLon={currentLocation.lon}
      />

      {/* Sign In Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
