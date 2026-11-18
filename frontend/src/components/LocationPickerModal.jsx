import React, { useState } from 'react';
import { aqiApi } from '../services/api';
import { MapPin, Search, Map, Check, Crosshair, Loader2 } from 'lucide-react';

const LocationPickerModal = ({ isOpen, onClose, onSelectLocation, currentLat = 28.6508, currentLon = 77.3152 }) => {
  const [activeTab, setActiveTab] = useState('type'); // 'type' | 'map'
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [results, setResults] = useState([]);
  
  // Map tab state: address search instead of raw coordinates
  const [mapAddressQuery, setMapAddressQuery] = useState('');
  const [mapSearchLoading, setMapSearchLoading] = useState(false);
  const [mapSearchResults, setMapSearchResults] = useState([]);
  const [selectedPin, setSelectedPin] = useState({ lat: currentLat, lon: currentLon, name: 'Anand Vihar, New Delhi' });

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
      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(4));
          const lon = parseFloat(pos.coords.longitude.toFixed(4));
          let resolvedName = `Live GPS (${lat}°N, ${lon}°E)`;
          
          try {
            // Reverse geocode to get actual city / neighborhood name
            const revData = await aqiApi.reverseGeocode(lat, lon);
            if (revData && revData.name) {
              resolvedName = revData.name;
            }
          } catch (e) {
            console.log("Reverse geocode fallback to coords:", e);
          } finally {
            setGpsLoading(false);
            onSelectLocation({
              name: resolvedName,
              lat,
              lon
            });
            onClose();
          }
        },
        (err) => {
          setGpsLoading(false);
          alert('GPS permission not granted or unavailable. Defaulting to Delhi coordinates.');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  const handleMapAddressSearch = async (e) => {
    e?.preventDefault();
    if (!mapAddressQuery.trim()) return;
    setMapSearchLoading(true);
    try {
      const data = await aqiApi.geocode(mapAddressQuery);
      setMapSearchResults(data || []);
      if (data && data.length > 0) {
        setSelectedPin({
          lat: data[0].lat,
          lon: data[0].lon,
          name: data[0].name
        });
      }
    } catch (err) {
      console.error("Map geocoding failed:", err);
    } finally {
      setMapSearchLoading(false);
    }
  };

  const popularZones = [
    { name: 'Anand Vihar, New Delhi', lat: 28.6508, lon: 77.3152 },
    { name: 'Bandra Kurla, Mumbai', lat: 19.0657, lon: 72.8687 },
    { name: 'Silk Board, Bengaluru', lat: 12.9176, lon: 77.6238 },
    { name: 'Connaught Place, New Delhi', lat: 28.6315, lon: 77.2167 },
    { name: 'Talkatora, Lucknow', lat: 26.8393, lon: 80.9022 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl overflow-hidden flex flex-col max-h-[95vh] h-full sm:h-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              Choose Air Quality Location
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Type any neighborhood, address, or select on interactive map.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/60 text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection: Type vs Map */}
        <div className="flex items-center gap-2 my-3 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
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

              {/* Quick GPS Action with Reverse Geocoding */}
              <button
                type="button"
                onClick={handleUseCurrentGPS}
                disabled={gpsLoading}
                className="w-full py-2.5 px-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs font-semibold text-emerald-400 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {gpsLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    Detecting & Resolving Location Name...
                  </>
                ) : (
                  <>
                    <Crosshair className="w-4 h-4" />
                    Use My Current Device GPS Location
                  </>
                )}
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

              {/* Popular Smog Hotspots */}
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
              {/* Address Search Form for Map */}
              <form onSubmit={handleMapAddressSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Enter address or landmark (e.g. Connaught Place, MG Road, Sector 18)..."
                    value={mapAddressQuery}
                    onChange={(e) => setMapAddressQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={mapSearchLoading}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {mapSearchLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                  Search Address
                </button>
              </form>

              {/* Address Search Matches */}
              {mapSearchResults.length > 0 && (
                <div className="max-h-36 overflow-y-auto space-y-1.5 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Address Suggestions</span>
                  {mapSearchResults.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedPin({
                          lat: item.lat,
                          lon: item.lon,
                          name: item.name
                        });
                        setMapSearchResults([]);
                      }}
                      className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800/80 text-xs flex items-center justify-between transition-colors"
                    >
                      <div className="truncate pr-2">
                        <span className="text-slate-200 font-medium block truncate">{item.name}</span>
                        <span className="text-[10px] text-slate-400">{item.lat?.toFixed(4)}°N, {item.lon?.toFixed(4)}°E</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400 shrink-0">Pin on Map</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Interactive OpenStreetMap embed frame */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 h-72 sm:h-80 bg-slate-950">
                <iframe
                  title="Location Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedPin.lon - 0.06}%2C${selectedPin.lat - 0.06}%2C${selectedPin.lon + 0.06}%2C${selectedPin.lat + 0.06}&amp;layer=mapnik&amp;marker=${selectedPin.lat}%2C${selectedPin.lon}`}
                  className="w-full h-full filter saturate-150 contrast-125"
                />
                <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-200 flex items-center gap-2 max-w-[85%] truncate">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-medium truncate">{selectedPin.name}</span>
                </div>
              </div>

              {/* Selected Target Address Box */}
              <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Selected Address Location</span>
                  <div className="text-sm font-semibold text-white mt-0.5">{selectedPin.name}</div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                    {selectedPin.lat?.toFixed(4)}°N, {selectedPin.lon?.toFixed(4)}°E
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleSelect(selectedPin);
                  }}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Confirm This Location
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
