import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { aqiApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LocationPickerModal from '../components/LocationPickerModal';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Trophy, 
  Leaf, 
  Users, 
  UserPlus
} from 'lucide-react';

// Exact cropped assets from db.png
import dbBackground from '../assets/db_background.png';
import biodomeCity from '../assets/biodome_city.png';
import holographicLungs from '../assets/holographic_lungs.png';
import calendar3D from '../assets/calendar_3d.png';
import avatarYou from '../assets/avatar_you.png';
import avatarRiya from '../assets/avatar_riya.png';
import avatarDadaji from '../assets/avatar_dadaji.png';
import mapRadar from '../assets/map_radar.png';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  
  // Coordinates for Ahmedabad, Gujarat (matching db.png)
  const [currentLocation, setCurrentLocation] = useState({
    name: "Ahmedabad",
    lat: 23.0225,
    lon: 72.5714
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Today's Plan checklist items exactly matching db.png
  const [tasks, setTasks] = useState([
    { id: 1, text: "Check AQI before commute", completed: true },
    { id: 2, text: "Choose public transport", completed: false },
    { id: 3, text: "Indoor exercise", completed: false }
  ]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

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

  const aqiInfo = data?.aqi_data || {};
  const aqiValue = aqiInfo.aqi || 185;
  const aqiCategory = aqiInfo.category || "Moderate";
  const pollutants = aqiInfo.sub_indices || {};
  
  // Exact 24h curve from db.png (300, 200, 100 curve: 12AM, 6AM, 12PM, 6PM, 12AM)
  const forecast = [
    { time: '12AM', aqi: 110 },
    { time: '6AM', aqi: 185 },
    { time: '12PM', aqi: 245 },
    { time: '6PM', aqi: 285 },
    { time: '12AM', aqi: 175 },
  ];

  return (
    <div className="relative min-h-screen text-slate-100 overflow-x-hidden pb-12">
      
      {/* =========================================================================
          BACKGROUND ARTWORK (Exact sci-fi planetary atmosphere & city lake from db.png)
         ========================================================================= */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 bg-cover bg-top opacity-35"
        style={{ backgroundImage: `url(${dbBackground})` }}
      />
      <div className="absolute inset-0 bg-[#060e1c]/80 pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        
        {/* =========================================================================
            ROW 1: BENTO HERO SECTION (3 Columns)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* 1.1 Left Hero Card: Breathe Better with AirWise AI */}
          <div className="lg:col-span-4 rounded-[26px] bg-[#0c182c]/85 backdrop-blur-xl border border-slate-700/60 p-6 flex flex-col justify-between relative overflow-hidden group shadow-2xl">
            <div className="space-y-3 relative z-10">
              {/* Live Location Pill Button */}
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 hover:border-emerald-400 text-xs font-semibold text-slate-200 transition-all shadow-md group/loc"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Air Quality • {currentLocation.name}</span>
              </button>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Breathe Better <br />
                with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">AirWise AI</span>
              </h1>

              <p className="text-slate-300/80 text-xs sm:text-sm leading-relaxed max-w-xs">
                Your intelligent companion for cleaner air and healthier life.
              </p>
            </div>

            <div className="pt-5 relative z-10">
              <NavLink
                to="/ai-advisor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-black text-xs tracking-wider shadow-lg shadow-teal-500/25 transition-all group/btn"
              >
                <span>Get AI Advice</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </NavLink>
            </div>
          </div>

          {/* 1.2 Center Card: AQI Dial + Pollutant Levels (Asymmetrical 2-in-1 layout) */}
          <div className="lg:col-span-5 rounded-[26px] bg-[#0c182c]/85 backdrop-blur-xl border border-slate-700/60 p-5 flex flex-col justify-between shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center h-full">
              
              {/* Circular Radial AQI Dial */}
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">AQI</span>
                
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-slate-800/80 stroke-current"
                      strokeWidth="9"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#eab308"
                      strokeWidth="9"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (185 / 500) * 200}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>

                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-white tracking-tighter">
                      185
                    </span>
                    <span className="text-xs font-bold px-3 py-0.5 rounded-full mt-1 bg-amber-400 text-slate-950 font-extrabold shadow-sm">
                      Moderate
                    </span>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 mt-1.5">
                  Updated: 10:24 AM, 17 Nov
                </span>
              </div>

              {/* Pollutant Levels Breakdown Tile */}
              <div className="rounded-2xl bg-[#081220]/95 border border-slate-700/70 p-3.5 space-y-2.5 shadow-inner">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider pb-1 border-b border-slate-800">
                  Pollutant Levels
                </h3>
                
                <div className="space-y-2 text-xs">
                  {/* PM2.5 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
                      <span className="text-slate-300 font-semibold">PM2.5</span>
                    </div>
                    <span className="font-mono font-bold text-white">
                      88 <span className="text-[10px] text-slate-400 font-normal">µg/m³</span>
                    </span>
                  </div>

                  {/* PM10 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-sm shadow-yellow-400/50" />
                      <span className="text-slate-300 font-semibold">PM10</span>
                    </div>
                    <span className="font-mono font-bold text-white">
                      160 <span className="text-[10px] text-slate-400 font-normal">µg/m³</span>
                    </span>
                  </div>

                  {/* NO2 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                      <span className="text-slate-300 font-semibold">NO₂</span>
                    </div>
                    <span className="font-mono font-bold text-white">
                      42 <span className="text-[10px] text-slate-400 font-normal">µg/m³</span>
                    </span>
                  </div>

                  {/* CO */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50" />
                      <span className="text-slate-300 font-semibold">CO</span>
                    </div>
                    <span className="font-mono font-bold text-white">
                      1.2 <span className="text-[10px] text-slate-400 font-normal">mg/m³</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 1.3 Right Card: Futuristic Biodome City with Sprouting Leaf */}
          <div className="lg:col-span-3 rounded-[26px] bg-[#0c182c]/85 backdrop-blur-xl border border-slate-700/60 p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            {/* Cleaner Air, Greener Future Badge */}
            <div className="relative z-10 flex items-center gap-3 bg-[#0a1628]/90 border border-slate-700/70 rounded-2xl p-2.5 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Leaf className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-white block leading-tight">Cleaner</span>
                <span className="text-xs font-extrabold text-emerald-400 block leading-tight">Air, Greener Future</span>
              </div>
            </div>

            {/* Exact Biodome City Image from db.png */}
            <div className="py-2 flex items-center justify-center relative z-10">
              <img 
                src={biodomeCity} 
                alt="Cleaner Air Future" 
                className="w-full max-h-28 object-contain rounded-xl shadow-lg border border-slate-700/40" 
              />
            </div>

            <NavLink
              to="/commute"
              className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-center text-slate-200 transition-all block relative z-10"
            >
              Explore Transport Modes →
            </NavLink>
          </div>

        </div>

        {/* =========================================================================
            ROW 2: TELEMETRY & PREDICTIVE INTELLIGENCE (3 Columns)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* 2.1 24h AQI Trend Chart */}
          <div className="lg:col-span-4 rounded-[26px] bg-[#0c182c]/85 backdrop-blur-xl border border-slate-700/60 p-4 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">24h AQI Trend</h3>
              </div>
              <NavLink
                to="/suite"
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>Forecast</span>
              </NavLink>
            </div>

            <div className="h-40 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecast}>
                  <defs>
                    <linearGradient id="emeraldCurve" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[0, 300]} ticks={[0, 100, 200, 300]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#091323',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#fff'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="aqi" 
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#emeraldCurve)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2.2 Air Quality Map Preview with exact radar graphic from db.png */}
          <div className="lg:col-span-4 rounded-[26px] bg-[#0c182c]/85 backdrop-blur-xl border border-slate-700/60 p-4 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Air Quality Map</h3>
              </div>
              <NavLink
                to="/suite"
                className="text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg transition-colors"
              >
                View Map →
              </NavLink>
            </div>

            {/* Exact Air Quality Micro-Map from db.png */}
            <div className="my-1.5 h-36 rounded-2xl bg-[#081220] border border-slate-700/70 relative flex items-center justify-center overflow-hidden">
              <img 
                src={mapRadar} 
                alt="Air Quality Map" 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>CPCB Central Feed</span>
              <span className="text-emerald-400 font-semibold">Active Sensors</span>
            </div>
          </div>

          {/* 2.3 AI Protection Tip (Exact Holographic Lungs Shield from db.png) */}
          <div className="lg:col-span-4 rounded-[26px] bg-[#0c182c]/85 backdrop-blur-xl border border-slate-700/60 p-4 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center gap-2 pb-2">
              <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-white">AI Protection Tip</h3>
            </div>

            <div className="flex items-center gap-3 py-2">
              <div className="space-y-1.5 flex-1">
                <p className="text-sm font-extrabold text-white leading-snug">
                  Avoid strenuous outdoor exercise today.
                </p>
                <p className="text-xs text-slate-300/80 leading-relaxed">
                  Reason: High PM2.5 levels
                </p>
              </div>

              {/* Exact Holographic Lungs Shield Image from db.png */}
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-cyan-400/50 flex items-center justify-center bg-cyan-950/40 shadow-lg shadow-cyan-500/20 shrink-0">
                <img 
                  src={holographicLungs} 
                  alt="Protection Shield" 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <NavLink
                to="/ai-advisor"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>
          </div>

        </div>

        {/* =========================================================================
            ROW 3: OPERATIONAL & FAMILY ECOSYSTEM (3 Columns)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* 3.1 For Your Family (Exact Avatars from db.png) */}
          <div className="lg:col-span-4 rounded-[26px] bg-[#0c182c]/85 backdrop-blur-xl border border-slate-700/60 p-5 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">For Your Family</h3>
                <p className="text-[11px] text-slate-400">Personalized Safety</p>
              </div>
            </div>

            {/* Profile Avatars Row */}
            <div className="grid grid-cols-4 gap-2.5 my-3">
              {/* You (Adult) */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-emerald-400/60 shadow-md shadow-emerald-500/20">
                  <img src={avatarYou} alt="You" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-white mt-1">You</span>
                <span className="text-[10px] text-slate-400">Adult</span>
              </div>

              {/* Riya (Child) */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-amber-400/60 shadow-md shadow-amber-500/20">
                  <img src={avatarRiya} alt="Riya" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-white mt-1">Riya</span>
                <span className="text-[10px] text-amber-400">Child</span>
              </div>

              {/* Dadaji (Senior) */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-purple-400/60 shadow-md shadow-purple-500/20">
                  <img src={avatarDadaji} alt="Dadaji" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-white mt-1">Dadaji</span>
                <span className="text-[10px] text-rose-400">Senior</span>
              </div>

              {/* Add Member Button */}
              <NavLink
                to="/profile"
                className="flex flex-col items-center text-center group"
              >
                <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-slate-700 hover:border-emerald-400 flex items-center justify-center text-slate-400 hover:text-emerald-400 transition-colors">
                  <UserPlus className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-300 mt-1">Add</span>
                <span className="text-[10px] text-slate-500">Member</span>
              </NavLink>
            </div>

            <NavLink
              to="/profile"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors text-center block pt-2 border-t border-slate-800"
            >
              Configure Health Context →
            </NavLink>
          </div>

          {/* 3.2 Today's Plan (Checklist with exact 3D Calendar from db.png) */}
          <div className="lg:col-span-4 rounded-[26px] bg-[#0c182c]/85 backdrop-blur-xl border border-slate-700/60 p-5 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Today's Plan</h3>
                  <p className="text-[11px] text-slate-400">Your AI Daily Routine</p>
                </div>
              </div>
              <NavLink
                to="/suite"
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
              >
                View Plan →
              </NavLink>
            </div>

            {/* Checklist Items + 3D Calendar Badge side-by-side */}
            <div className="flex items-center gap-3 my-2">
              <div className="space-y-2 flex-1">
                {tasks.map(task => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer ${
                      task.completed 
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-slate-200' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span className={`text-[11px] font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Exact 3D Calendar Image from db.png */}
              <div className="w-18 h-18 rounded-2xl overflow-hidden border border-slate-700/50 p-1 bg-slate-900/80 shadow-md shrink-0">
                <img 
                  src={calendar3D} 
                  alt="Calendar" 
                  className="w-full h-full object-contain" 
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-400 text-center pt-1.5 border-t border-slate-800">
              Clean outdoor window: <strong className="text-emerald-400">1:00 PM – 4:00 PM</strong>
            </div>
          </div>

          {/* 3.3 Your Impact (Green Progress Arc & CO2 Saved from db.png) */}
          <div className="lg:col-span-4 rounded-[26px] bg-[#0c182c]/85 backdrop-blur-xl border border-slate-700/60 p-5 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-800">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Your Impact</h3>
                <p className="text-[11px] text-slate-400">Together for a greener planet</p>
              </div>
            </div>

            <div className="flex items-center justify-around my-2">
              {/* Circular Gauge 72% */}
              <div className="relative w-18 h-18 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800 stroke-current"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400 stroke-current"
                    strokeWidth="3.5"
                    strokeDasharray="72, 100"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-sm font-black text-white">72%</span>
              </div>

              {/* CO2 Saved Numbers & Graph */}
              <div className="space-y-1">
                <span className="text-2xl font-black text-white block">12.5 kg</span>
                <span className="text-xs font-semibold text-emerald-400 block">CO₂ Saved This Month</span>
                <div className="flex items-end gap-1 h-4 pt-1">
                  <div className="w-1.5 h-2 bg-emerald-500/40 rounded-full" />
                  <div className="w-1.5 h-2.5 bg-emerald-500/60 rounded-full" />
                  <div className="w-1.5 h-3.5 bg-emerald-500/80 rounded-full" />
                  <div className="w-1.5 h-4 bg-emerald-400 rounded-full" />
                </div>
              </div>
            </div>

            {/* Go Green Challenge Button */}
            <NavLink
              to="/suite"
              className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 hover:border-emerald-400 text-xs font-bold text-center text-emerald-300 flex items-center justify-center gap-2 transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Go Green Challenge</span>
            </NavLink>
          </div>

        </div>

        {/* =========================================================================
            BOTTOM SMOG ALERT BAR (Pill banner from db.png)
           ========================================================================= */}
        <div className="rounded-2xl bg-gradient-to-r from-[#0c182c] via-emerald-950/40 to-[#0c182c] border border-emerald-500/30 p-3 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs font-medium text-slate-200">
              <strong className="text-emerald-400">Smog Alert:</strong> Air quality may deteriorate this evening. Stay indoors if possible.
            </p>
          </div>

          <NavLink
            to="/ai-advisor"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>

      </div>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={(loc) => {
          setCurrentLocation(loc);
          setIsLocationModalOpen(false);
        }}
      />

    </div>
  );
};

export default Dashboard;
