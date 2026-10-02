import React, { useState } from 'react';
import { Car, Zap, Shield, Sparkles, Search, ChevronRight, Check, ArrowRight, Gauge, BatteryCharging, Filter, X } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  category: 'electric' | 'performance' | 'suv' | 'luxury';
  tagline: string;
  priceUsd: number;
  hp: number;
  zeroToSixtySec: number;
  rangeMiles: number;
  topSpeedMph: number;
  imageUrl: string;
  colorHex: string;
  features: string[];
}

export const CarDealershipPreview: React.FC<{ projectTitle?: string }> = ({ projectTitle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [bookedSuccess, setBookedSuccess] = useState(false);
  const [testDriveDate, setTestDriveDate] = useState('2026-10-05');

  const vehicles: Vehicle[] = [
    {
      id: 'v-1',
      name: 'Apex Hyperion EV GT',
      category: 'electric',
      tagline: 'Dual-Motor All-Wheel Drive Ultra GT',
      priceUsd: 118000,
      hp: 1020,
      zeroToSixtySec: 1.98,
      rangeMiles: 420,
      topSpeedMph: 200,
      imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80',
      colorHex: '#3B82F6',
      features: ['Level 3 Autonomous Cruise', '800V Ultra-Fast Charging (10-80% in 18 min)', 'Active Aero Rear Wing', 'Bespoke Alcantara Cabin'],
    },
    {
      id: 'v-2',
      name: 'Vanguard V12 Supra-Sport',
      category: 'performance',
      tagline: 'Naturally Aspirated Twin-Turbo V12',
      priceUsd: 185000,
      hp: 850,
      zeroToSixtySec: 2.7,
      rangeMiles: 380,
      topSpeedMph: 215,
      imageUrl: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&auto=format&fit=crop&q=80',
      colorHex: '#EF4444',
      features: ['Carbon-Ceramic Matrix Brakes', '6-Speed Sequential Gearbox', 'Track Telemetry Recorder', 'Launch Control System'],
    },
    {
      id: 'v-3',
      name: 'AeroStealth EV SUV',
      category: 'suv',
      tagline: '7-Passenger Luxury Electric All-Terrain',
      priceUsd: 94500,
      hp: 750,
      zeroToSixtySec: 3.4,
      rangeMiles: 360,
      topSpeedMph: 165,
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
      colorHex: '#10B981',
      features: ['Air Suspension with 12" Ground Clearance', 'Panorama Solar Roof', 'Quad-Zone Climate Control', 'Towing Capacity 8,500 lbs'],
    },
    {
      id: 'v-4',
      name: 'Lumina Sovereign Sedan',
      category: 'luxury',
      tagline: 'Executive VIP Lounge Rear Seating',
      priceUsd: 142000,
      hp: 680,
      zeroToSixtySec: 3.8,
      rangeMiles: 400,
      topSpeedMph: 175,
      imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=80',
      colorHex: '#6366F1',
      features: ['Massage Seats with Calf Rests', 'Active Noise Cancellation Studio Audio', 'Augmented Reality HUD', 'Hand-Stitched Nappa Leather'],
    },
  ];

  const filteredVehicles = vehicles.filter((v) => {
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookTestDrive = () => {
    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
      setSelectedVehicle(null);
    }, 3000);
  };

  return (
    <div className="bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 overflow-hidden font-sans space-y-6 p-6 shadow-2xl">
      {/* Top Navbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono text-indigo-400">Automotive Showcase</div>
            <h2 className="text-xl font-extrabold text-white font-display">
              {projectTitle || 'Nexus Automotive Dealership'}
            </h2>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search model or specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 text-xs text-white placeholder-slate-500 pl-9 pr-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-indigo-500 w-48 md:w-60"
            />
          </div>

          <button
            onClick={() => setSelectedCategory('all')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
          >
            All Models ({vehicles.length})
          </button>
        </div>
      </div>

      {/* Category Segmented Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Fleet' },
          { id: 'electric', label: 'Electric EV' },
          { id: 'performance', label: 'Supercars' },
          { id: 'suv', label: 'Luxury SUVs' },
          { id: 'luxury', label: 'Executive Sedans' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white font-semibold shadow'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-slate-900/90 rounded-xl border border-slate-800 hover:border-slate-700 transition overflow-hidden group flex flex-col justify-between shadow-xl"
          >
            <div>
              {/* Vehicle Image */}
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img
                  src={vehicle.imageUrl}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute top-3 right-3 px-2.5 py-1 text-xs font-bold font-mono text-white bg-slate-950/80 backdrop-blur-md rounded border border-slate-700">
                  ${vehicle.priceUsd.toLocaleString()}
                </div>
              </div>

              {/* Vehicle Specs */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-display group-hover:text-indigo-300 transition">
                    {vehicle.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{vehicle.tagline}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 font-mono text-xs">
                  <div className="p-2 bg-slate-950/80 rounded border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-500 font-sans">Power</div>
                    <div className="font-bold text-white tabular-nums">{vehicle.hp} HP</div>
                  </div>

                  <div className="p-2 bg-slate-950/80 rounded border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-500 font-sans">0-60 MPH</div>
                    <div className="font-bold text-indigo-400 tabular-nums">{vehicle.zeroToSixtySec}s</div>
                  </div>

                  <div className="p-2 bg-slate-950/80 rounded border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-500 font-sans">Range / Speed</div>
                    <div className="font-bold text-emerald-400 tabular-nums">{vehicle.rangeMiles} mi</div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold text-slate-400">Key Features:</div>
                  <ul className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                    {vehicle.features.slice(0, 2).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 truncate">
                        <Check className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">Immediate Delivery Ready</span>
              <button
                onClick={() => setSelectedVehicle(vehicle)}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition flex items-center gap-1.5 shadow"
              >
                <span>Book Test Drive</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Test Drive Booking Drawer / Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedVehicle(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Schedule VIP Test Drive</h3>
                <p className="text-xs text-indigo-300 font-semibold">{selectedVehicle.name}</p>
              </div>
            </div>

            {bookedSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2 text-xs">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="font-bold text-white text-sm">Test Drive Confirmed!</div>
                <p className="text-slate-300">
                  Your VIP reservation for the {selectedVehicle.name} on {testDriveDate} is locked.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Select Preferred Date</label>
                  <input
                    type="date"
                    value={testDriveDate}
                    onChange={(e) => setTestDriveDate(e.target.value)}
                    className="w-full bg-slate-950 text-white border border-slate-700 rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 text-slate-300">
                  <div className="flex justify-between font-mono">
                    <span>Base MSRP:</span>
                    <span className="font-bold text-white">${selectedVehicle.priceUsd.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>Horsepower:</span>
                    <span className="text-indigo-400">{selectedVehicle.hp} HP</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span>0-60 MPH:</span>
                    <span className="text-emerald-400">{selectedVehicle.zeroToSixtySec}s</span>
                  </div>
                </div>

                <button
                  onClick={handleBookTestDrive}
                  className="w-full py-2.5 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
                >
                  Confirm Reservation
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
