import React, { useState } from 'react';
import { aqiApi } from '../services/api';
import { MapPin, Search, Map, Check, Crosshair, ExternalLink } from 'lucide-react';

const LocationPickerModal = ({ isOpen, onClose, onSelectLocation, currentLat = 28.6508, currentLon = 77.3152 }) => {
  const [activeTab, setActiveTab] = useState('type'); // 'type' | 'map'
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  
  // Interactive coordinates for map picker
  const [selectedPin, setSelectedPin] = useState({ lat: currentLat, lon: currentLon, name: 'Custom Pin Point' });

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await aqiApi.geocode(query);
      setResults(data || []);
    } catch (err) {
      console.error("Geocoding failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    onSelectLocation({
      name: item.name,
      lat: item.lat,
      lon: item.lon
    });
    onClose();
  };

  const handleUseCurrentGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(4));
          const lon = parseFloat(pos.coords.longitude.toFixed(4));
          onSelectLocation({
            name: `Live GPS (${lat}°N, ${lon}°E)`,
            lat,
            lon
          });
          onClose();
        },
        (err) => {
          alert('GPS permission not granted or unavailable. Defaulting to Delhi coordinates.');
        }
      );
    }
  };

  // Preset key hot zones
  const popularZones = [
    { name: 'Anand Vihar, New Delhi', lat: 28.6508, lon: 77.3152 },
    { name: 'Bandra Kurla, Mumbai', lat: 19.0657, lon: 72.8687 },
    { name: 'Silk Board, Bengaluru', lat: 12.9176, lon: 77.6238 },
    { name: 'Connaught Place, New Delhi', lat: 28.6315, lon: 77.2167 },
    { name: 'Talkatora, Lucknow', lat: 26.8393, lon: 80.9022 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              Choose Air Quality Location
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Type any neighborhood, city, or tap to choose directly via interactive map.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/60 text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection: Type vs Google/OSM Map */}
        <div className="flex items-center gap-2 my-4 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('type')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'type'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Type Location Name
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'map'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            Interactive Map Selection
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {activeTab === 'type' ? (
            <div className="space-y-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Type city, locality, pin code (e.g. Rohini Delhi, Indiranagar)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </form>

              {/* Quick GPS Action */}
              <button
                type="button"
                onClick={handleUseCurrentGPS}
                className="w-full py-2.5 px-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2 transition-colors"
              >
                <Crosshair className="w-4 h-4" />
                Use My Current Device GPS Location
              </button>

              {/* Search Results */}
              {results.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Search Matches</span>
                  {results.map((r, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelect(r)}
                      className="p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl cursor-pointer flex items-center justify-between transition-colors group"
                    >
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-emerald-400">{r.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {r.lat?.toFixed(4)}°N, {r.lon?.toFixed(4)}°E
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        Select
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Key Preset Hubs */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Popular Smog Hotspots</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {popularZones.map((z, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelect(z)}
                      className="p-2.5 bg-slate-950/70 hover:bg-slate-800 border border-slate-800 rounded-xl cursor-pointer text-xs flex items-center justify-between transition-colors"
                    >
                      <span className="text-slate-200 font-medium">{z.name}</span>
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Interactive OpenStreetMap / Google Maps embed frame */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-64 bg-slate-950">
                <iframe
                  title="Location Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedPin.lon - 0.08}%2C${selectedPin.lat - 0.08}%2C${selectedPin.lon + 0.08}%2C${selectedPin.lat + 0.08}&amp;layer=mapnik&amp;marker=${selectedPin.lat}%2C${selectedPin.lon}`}
                  className="w-full h-full filter saturate-150 contrast-125"
                />
                <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] text-slate-200 font-mono">
                  📍 {selectedPin.lat.toFixed(4)}°N, {selectedPin.lon.toFixed(4)}°E
                </div>
              </div>

              {/* Interactive Latitude / Longitude Adjuster */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.001"
                    value={selectedPin.lat}
                    onChange={(e) => setSelectedPin({ ...selectedPin, lat: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.001"
                    value={selectedPin.lon}
                    onChange={(e) => setSelectedPin({ ...selectedPin, lon: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSelect(selectedPin)}
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Confirm Map Location Coordinates
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;
