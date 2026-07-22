import React, { useState } from 'react';

const WATCH_DATABASE = [
  {
    id: 'cyber-pulse',
    name: 'Cyber Pulse GT',
    category: 'Flagship Sport',
    price: '$499',
    defaultColor: '#06b6d4', // Cyan
    colors: [
      { name: 'Cyber Cyan', hex: '#06b6d4' },
      { name: 'Neon Pink', hex: '#ec4899' },
      { name: 'Solar Gold', hex: '#eab308' },
      { name: 'Stealth Emerald', hex: '#10b981' }
    ],
    specs: {
      display: { title: '1.9" Crystal AMOLED', desc: '120Hz Refresh rate with 2000 nits peak brightness.' },
      sensors: { title: 'BioPulse Matrix 4.0', desc: 'Real-time ECG, SpO2, and continuous stress tracking.' },
      crown: { title: 'Haptic Digital Crown', desc: 'Titanium crown with ultra-smooth optical navigation.' },
      body: { title: 'Grade 5 Titanium Frame', desc: 'Aerospace-grade lightweight, scratch-resistant build.' }
    },
    hotspots: {
      display: { top: '35%', left: '50%' },
      crown: { top: '50%', left: '78%' },
      sensors: { top: '65%', left: '50%' },
      body: { top: '50%', left: '22%' }
    }
  },
  {
    id: 'apex-sport',
    name: 'Apex Fit Pro',
    category: 'Ultra Endurance',
    price: '$399',
    defaultColor: '#ec4899', // Pink
    colors: [
      { name: 'Neon Pink', hex: '#ec4899' },
      { name: 'Cyber Cyan', hex: '#06b6d4' },
      { name: 'Electric Violet', hex: '#8b5cf6' }
    ],
    specs: {
      display: { title: 'Sapphire Glass Touch', desc: 'Ultra-tough shatterproof curved glass panel.' },
      sensors: { title: 'GPS Dual-Band', desc: 'Sub-meter accuracy outdoor tracking and altimeter.' },
      crown: { title: 'Quick Action Button', desc: 'Customizable tactile button for instant workout logs.' },
      body: { title: 'Carbon Composite Casing', desc: 'Waterproof up to 100 meters (10 ATM).' }
    },
    hotspots: {
      display: { top: '35%', left: '50%' },
      crown: { top: '50%', left: '78%' },
      sensors: { top: '65%', left: '50%' },
      body: { top: '50%', left: '22%' }
    }
  }
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWatch, setSelectedWatch] = useState(WATCH_DATABASE[0]);
  const [activeColor, setActiveColor] = useState('#06b6d4');
  const [activeHotspot, setActiveHotspot] = useState('display');

  const filteredWatches = WATCH_DATABASE.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectWatch = (watch) => {
    setSelectedWatch(watch);
    setActiveColor(watch.defaultColor);
    setActiveHotspot('display');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-4 md:p-8 font-sans relative overflow-x-hidden select-none">
      
      {/* Dynamic Ambient Background Glow */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full opacity-25 blur-[120px] transition-all duration-700 pointer-events-none"
        style={{ backgroundColor: activeColor }}
      />

      {/* Header */}
      <div className="z-10 text-center mb-6">
        <h1 className="text-3xl md:text-5xl font-extralight tracking-widest text-white">
          Aura<span className="font-bold transition-colors duration-500" style={{ color: activeColor }}>Studio</span>
        </h1>
        <p className="text-[10px] tracking-[0.3em] text-slate-500 uppercase mt-1">3D Interactive Wearable Customizer</p>
      </div>

      {/* Floating Search Bar */}
      <div className="z-30 w-full max-w-md relative mb-6">
        <input
          type="text"
          placeholder="Search smartwatches (e.g., Cyber Pulse, Apex)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900/90 border border-slate-800 rounded-full px-5 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none transition-all shadow-xl backdrop-blur-md"
          style={{ borderColor: searchQuery ? activeColor : 'rgba(30,41,59,1)' }}
        />

        {/* Dropdown Results */}
        {searchQuery && (
          <div className="absolute top-14 left-0 right-0 bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-50 backdrop-blur-xl">
            {filteredWatches.length > 0 ? (
              filteredWatches.map(watch => (
                <button
                  key={watch.id}
                  onClick={() => {
                    handleSelectWatch(watch);
                    setSearchQuery('');
                  }}
                  className="w-full text-left px-5 py-3.5 hover:bg-slate-800/80 flex items-center justify-between border-b border-slate-800/50 last:border-none transition-colors"
                >
                  <div>
                    <span className="font-semibold text-sm text-slate-200 block">{watch.name}</span>
                    <span className="text-[10px] text-slate-400">{watch.category}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300">{watch.price}</span>
                </button>
              ))
            ) : (
              <div className="px-5 py-3 text-xs text-slate-500">No matching smartwatches found</div>
            )}
          </div>
        )}
      </div>

      {/* Main Studio Interactive Container */}
      <div className="z-10 w-full max-w-2xl bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl flex flex-col items-center relative">
        
        {/* Top Info Bar */}
        <div className="w-full flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">{selectedWatch.category}</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">{selectedWatch.name}</h2>
          </div>
          <button
            onClick={() => {
              const other = WATCH_DATABASE.find(w => w.id !== selectedWatch.id);
              if (other) handleSelectWatch(other);
            }}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
          >
            Switch Model ↻
          </button>
        </div>

        {/* 3D Model Display Viewport */}
        <div className="relative w-full h-80 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center justify-center p-4 my-2 shadow-inner overflow-visible">
          
          {/* Watch Visual */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Straps */}
            <div 
              className="absolute -top-12 w-20 h-20 rounded-t-2xl transition-colors duration-500 shadow-lg" 
              style={{ backgroundColor: activeColor, opacity: 0.85 }} 
            />
            <div 
              className="absolute -bottom-12 w-20 h-20 rounded-b-2xl transition-colors duration-500 shadow-lg" 
              style={{ backgroundColor: activeColor, opacity: 0.85 }} 
            />

            {/* Watch Bezel Body */}
            <div className="w-44 h-44 rounded-full bg-slate-900 border-4 border-slate-700 shadow-2xl z-10 flex items-center justify-center relative">
              {/* Crown Dial */}
              <div className="absolute -right-3 w-3 h-8 bg-slate-600 rounded-r-md border-l border-slate-800 shadow-md" />
              
              {/* Screen Display */}
              <div className="w-36 h-36 rounded-full bg-black border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="text-xl font-mono font-bold text-white">09:41</div>
                <div className="text-[9px] font-mono mt-1 font-bold transition-colors" style={{ color: activeColor }}>98 BPM • 100%</div>
              </div>
            </div>
          </div>

          {/* Part Hotspot Pins */}
          {Object.keys(selectedWatch.hotspots).map((partKey) => {
            const hs = selectedWatch.hotspots[partKey];
            const isActive = activeHotspot === partKey;
            return (
              <button
                key={partKey}
                onClick={() => setActiveHotspot(partKey)}
                style={{ top: hs.top, left: hs.left }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest transition-all border cursor-pointer z-30 ${
                  isActive
                    ? 'bg-white text-slate-950 border-white shadow-[0_0_15px_rgba(255,255,255,0.8)] scale-110'
                    : 'bg-slate-900/90 text-slate-400 border-slate-700 hover:border-slate-400 hover:text-white'
                }`}
              >
                ● {partKey}
              </button>
            );
          })}
        </div>

        {/* Color Palette Customizer */}
        <div className="w-full flex items-center justify-between my-4 px-2">
          <span className="text-xs font-semibold text-slate-300">Choose Strap Color:</span>
          <div className="flex items-center gap-3">
            {selectedWatch.colors.map((c) => (
              <button
                key={c.hex}
                onClick={() => setActiveColor(c.hex)}
                className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                  activeColor === c.hex ? 'scale-125 border-white shadow-lg' : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Dynamic Part Detail Specs Card */}
        {activeHotspot && selectedWatch.specs[activeHotspot] && (
          <div className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
            <div 
              className="px-3 py-2 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 transition-colors duration-500"
              style={{ backgroundColor: activeColor }}
            >
              {activeHotspot}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                {selectedWatch.specs[activeHotspot].title}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedWatch.specs[activeHotspot].desc}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}